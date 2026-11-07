import fs from 'node:fs';
import path from 'node:path';
import { Engine, ENGINE_VERSION, exportRun, generateSigningKey, planGraph, readLog, sendOtlp, toOtlp, validateEnvelope, verifyLog, writeCalibration, extractEnvelope, type GateDecision } from '@fabiolalli/aits-core';
import { projectDir, publicKeysFor } from './common.ts';

const HELP = `aits ${ENGINE_VERSION} — AITS engine

Runs
  aits start "<problem>" [--graph full] [--mode supervised|autonomous|review] [--tags a,b] [--include systemic]
  aits plan <graph> [--include a,b]
  aits submit <file|-> [--run <id>]          submit an agent envelope (JSON or text containing it)
  aits status [--run <id>]
  aits gate <gate_id> <proceed|provide_context|override|abort> [--run <id>] [--why "..."] [--quote "..."]
  aits skip <agent> --reason "..." [--run <id>] [--quote "..."]
  aits aggregate <agent> [--run <id>]
  aits synthesize <file|-> [--run <id>]
  aits runs
  aits verify [--run <id>] [--file <log.jsonl>]
  aits export [--run <id>] [--out <dir>] [--otel]

Memory and calibration
  aits recall "<query>" [-k 5]
  aits outcome <decision_id> <prediction_id> <0|1> [--note "..."]
  aits calibrate
  aits patterns [scan|list|approve <id>|reject <id>]

Tools
  aits validate <file|->
  aits keys generate
  aits build --target claude-code|agent-skills|all [--out <dir>] [--config <aits.config.yaml>]
  aits eval [dir]
  aits mcp                                    MCP server on stdio
  aits a2a [--port 8765]                      A2A governance-review endpoint
  aits hook post-tool-use|subagent-stop|session-start   runtime hooks, read JSON on stdin

Data lives in .aits/ of the project directory (AITS_HOME to override).`;

function parseArgs(argv: string[]) {
  const pos: string[] = [];
  const flags: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--') || (a.startsWith('-') && a.length === 2)) {
      const key = a.replace(/^-+/, '');
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        flags[key] = next;
        i++;
      } else flags[key] = true;
    } else pos.push(a);
  }
  return { pos, flags };
}

const str = (v: string | true | undefined) => (typeof v === 'string' ? v : undefined);
const list = (v: string | true | undefined) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined);

async function readInput(src: string | undefined): Promise<string> {
  if (!src || src === '-') {
    let data = '';
    for await (const chunk of process.stdin) data += chunk;
    return data;
  }
  return fs.readFileSync(src, 'utf8');
}

const out = (v: unknown) => console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 2));

export async function main(argv: string[]) {
  const [cmd, ...rest] = argv;
  const { pos, flags } = parseArgs(rest);
  const engine = () => new Engine(projectDir());
  const runId = str(flags.run);

  switch (cmd) {
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      return out(HELP);
    case 'version':
    case '--version':
      return out(ENGINE_VERSION);
    case 'mcp': {
      const { serveStdio } = await import('./mcp.ts');
      return serveStdio();
    }
    case 'hook': {
      const hooks = await import('./hook.ts');
      const event = pos[0] ?? 'post-tool-use';
      let result = '';
      if (event === 'session-start') result = await hooks.sessionStartHook();
      else if (event === 'subagent-stop') result = await hooks.subagentStopHook(await readInput('-'));
      else if (event === 'post-tool-use') result = await hooks.postToolUseHook(await readInput('-'));
      else throw new Error(`unknown hook "${event}": use post-tool-use, subagent-stop or session-start`);
      if (result) process.stdout.write(result);
      return;
    }
    case 'a2a': {
      const { serveA2A } = await import('./a2a.ts');
      const { url } = serveA2A(Number(str(flags.port) ?? 8765), str(flags.host));
      return out(`AITS A2A endpoint on ${url} (agent card at ${url}.well-known/agent-card.json)`);
    }
    case 'start':
      return out(await engine().start({ problem: pos.join(' '), graph: str(flags.graph), mode: str(flags.mode) as never, tags: list(flags.tags), include: list(flags.include) }));
    case 'plan':
      return out(planGraph(engine().spec, pos[0] ?? 'full', list(flags.include) ?? []));
    case 'submit':
      return out(engine().open(runId).submit(await readInput(pos[0])));
    case 'status':
      return out(engine().open(runId).status());
    case 'gate':
      if (!pos[0] || !pos[1]) throw new Error('usage: aits gate <gate_id> <decision>');
      return out(engine().open(runId).respondToGate(pos[0], pos[1] as GateDecision, 'cli', { justification: str(flags.why), user_quote: str(flags.quote) }));
    case 'skip':
      if (!pos[0] || !str(flags.reason)) throw new Error('usage: aits skip <agent> --reason "..."');
      return out(engine().open(runId).skip(pos[0], str(flags.reason)!, 'cli', str(flags.quote)));
    case 'aggregate':
      return out(engine().open(runId).aggregate(pos[0]));
    case 'synthesize':
      return out(await engine().open(runId).synthesize(await readInput(pos[0])));
    case 'runs': {
      const e = engine();
      return out(e.listRuns().map((id) => ({ id, state: e.open(id).state(), active: id === e.activeRunId() })));
    }
    case 'verify': {
      const e = engine();
      const file = str(flags.file);
      const r = verifyLog(readLog(file ?? e.open(runId).log.file), publicKeysFor(e));
      out(r);
      if (!r.ok) process.exitCode = 1;
      return;
    }
    case 'export': {
      const e = engine();
      const run = e.open(runId);
      const res = exportRun(run, str(flags.out), publicKeysFor(e));
      if (flags.otel) {
        const endpoint = e.config.otel?.endpoint ?? process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
        if (!endpoint) throw new Error('set otel.endpoint in aits.config.yaml or OTEL_EXPORTER_OTLP_ENDPOINT');
        return out({ ...res, otel_status: await sendOtlp(endpoint, toOtlp(run), e.config.otel?.headers) });
      }
      return out(res);
    }
    case 'recall':
      return out(await engine().memory.recall(pos.join(' '), Number(str(flags.k) ?? 5)));
    case 'outcome': {
      const [decision, prediction, value] = pos;
      if (!decision || !prediction || (value !== '0' && value !== '1')) throw new Error('usage: aits outcome <decision_id> <prediction_id> <0|1>');
      return out(engine().memory.recordOutcome(decision, prediction, Number(value) as 0 | 1, str(flags.note)));
    }
    case 'calibrate': {
      const e = engine();
      return out(writeCalibration(e.memory, e.spec.policies.calibration.min_resolved_for_adjustment));
    }
    case 'patterns': {
      const m = engine().memory;
      const action = pos[0] ?? 'list';
      if (action === 'scan') return out(await m.patternCandidates());
      if (action === 'approve' || action === 'reject') return out(m.setPatternStatus(pos[1], action === 'approve' ? 'approved' : 'rejected'));
      return out(m.readPatterns().map(({ centroid, ...p }) => p));
    }
    case 'validate': {
      const env = extractEnvelope(await readInput(pos[0]));
      const r = validateEnvelope(env);
      out(r);
      if (!r.valid) process.exitCode = 1;
      return;
    }
    case 'keys':
      if (pos[0] !== 'generate') throw new Error('usage: aits keys generate');
      return out({ ...generateSigningKey(), next: 'Add to aits.config.yaml:\nsigning:\n  key: <privatePath>' });
    case 'build': {
      const { build } = await import('./build.ts');
      return out({ built: build(str(flags.target) ?? 'all', path.resolve(str(flags.out) ?? '.'), str(flags.config)) });
    }
    case 'eval': {
      const { runEval } = await import('./eval.ts');
      const res = await runEval(path.resolve(pos[0] ?? 'eval'));
      if (flags.json) return out(res.rows);
      return out(res.markdown);
    }
    default:
      throw new Error(`unknown command "${cmd}". Run aits help.`);
  }
}

main(process.argv.slice(2)).catch((err) => {
  console.error(`aits: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
