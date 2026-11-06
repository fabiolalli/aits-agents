import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { Engine, extractEnvelope } from '@fabiolalli/aits-core';

/**
 * Eval harness. A case is a past decision with a known outcome. For each case, one or more labelled
 * sets of recorded envelopes (for example "v2" and "v3", produced with the same models) are replayed
 * through the engine and scored against what actually happened.
 *
 * eval/cases/<id>/case.yaml
 * eval/cases/<id>/runs/<label>/*.json    (agent envelopes, synthesis last)
 */
export interface EvalCase {
  id: string;
  synthetic?: boolean;
  problem: string;
  graph?: string;
  truth: {
    materialized_risks?: string[];
    scenario_occurred?: string;
    expected_gates?: string[];
    decision_was_right?: boolean;
  };
}

const words = (s: string) => new Set(s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 3));
function overlaps(a: string, b: string) {
  const wa = words(a), wb = words(b);
  let n = 0;
  for (const w of wa) if (wb.has(w)) n++;
  return wa.size && wb.size ? n / Math.min(wa.size, wb.size) >= 0.5 : false;
}

export async function scoreCase(caseDir: string) {
  const c = YAML.parse(fs.readFileSync(path.join(caseDir, 'case.yaml'), 'utf8')) as EvalCase;
  const runsDir = path.join(caseDir, 'runs');
  const labels = fs.existsSync(runsDir) ? fs.readdirSync(runsDir).filter((d) => fs.statSync(path.join(runsDir, d)).isDirectory()).sort() : [];
  const results = [];
  for (const label of labels) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aits-eval-'));
    try {
      const engine = new Engine(tmp);
      const { run_id } = await engine.start({ problem: c.problem, graph: c.graph ?? 'full', mode: 'autonomous' });
      const run = engine.open(run_id);
      const files = fs.readdirSync(path.join(runsDir, label)).filter((f) => f.endsWith('.json')).sort();
      const envs = files.map((f) => extractEnvelope(fs.readFileSync(path.join(runsDir, label, f), 'utf8'))).filter(Boolean) as Record<string, unknown>[];
      const synth = envs.filter((e) => e.agent === 'meta-orchestrator').at(-1);
      let invalid = 0;
      for (const e of envs.filter((x) => x.agent !== 'meta-orchestrator')) if (run.submit(e).status === 'invalid') invalid++;
      const gates = run.gates().map((g) => g.rule);
      // Gates are answered "proceed" so that the replay can reach the synthesis.
      for (const g of run.gates().filter((x) => x.status === 'open')) run.respondToGate(g.id, 'proceed', 'cli', { justification: 'eval replay' });
      const synthesis = synth ? await run.synthesize(synth) : undefined;

      const risks = envs.filter((e) => e.agent === 'critical-validator').flatMap((e) => ((e.main_output as { risk_map?: { risk: string }[] }).risk_map ?? []).map((r) => r.risk));
      const materialized = c.truth.materialized_risks ?? [];
      const caught = materialized.filter((m) => risks.some((r) => overlaps(m, r)));
      const preds = run.predictions();
      const scored = preds
        .map((p) => {
          let y: 0 | 1 | undefined;
          if (p.statement.startsWith('Risk materialises')) y = materialized.some((m) => overlaps(m, p.statement)) ? 1 : 0;
          const occurred = c.truth.scenario_occurred;
          if (p.statement.startsWith('Scenario occurs') && occurred) y = p.id.endsWith(`scenario-${occurred}`) || overlaps(occurred, p.statement) ? 1 : 0;
          return y === undefined ? undefined : (p.probability - y) ** 2;
        })
        .filter((x): x is number => x !== undefined);
      const expected = c.truth.expected_gates ?? [];
      const ts = envs.map((e) => Date.parse(String(e.timestamp))).filter((n) => !Number.isNaN(n));
      results.push({
        case: c.id,
        synthetic: !!c.synthetic,
        label,
        envelopes: envs.length,
        invalid_envelopes: invalid,
        gates: [...new Set(gates)],
        gate_recall: expected.length ? expected.filter((g) => gates.includes(g)).length / expected.length : null,
        risk_recall: materialized.length ? caught.length / materialized.length : null,
        brier: scored.length ? Number((scored.reduce((s, x) => s + x, 0) / scored.length).toFixed(4)) : null,
        synthesis_accepted: synthesis?.accepted ?? false,
        engine_confidence: synthesis?.engine_confidence ?? null,
        decision_was_right: c.truth.decision_was_right ?? null,
        elapsed_minutes: ts.length > 1 ? Number(((Math.max(...ts) - Math.min(...ts)) / 60000).toFixed(1)) : null,
      });
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }
  return results;
}

export async function runEval(dir: string) {
  const casesDir = path.join(dir, 'cases');
  const cases = fs.existsSync(casesDir) ? fs.readdirSync(casesDir).filter((d) => fs.existsSync(path.join(casesDir, d, 'case.yaml'))).sort() : [];
  const rows = (await Promise.all(cases.map((c) => scoreCase(path.join(casesDir, c))))).flat();
  const fmt = (v: unknown) => (v === null || v === undefined ? '' : typeof v === 'number' ? String(Number(v.toFixed(3))) : String(v));
  const md = [
    '| Case | Label | Synthetic | Invalid | Gates | Gate recall | Risk recall | Brier | Synthesis | Engine confidence | Minutes |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((r) => `| ${r.case} | ${r.label} | ${r.synthetic ? 'yes' : 'no'} | ${r.invalid_envelopes} | ${r.gates.join(' ')} | ${fmt(r.gate_recall)} | ${fmt(r.risk_recall)} | ${fmt(r.brier)} | ${r.synthesis_accepted ? 'accepted' : 'refused'} | ${fmt(r.engine_confidence)} | ${fmt(r.elapsed_minutes)} |`),
  ].join('\n');
  return { rows, markdown: md };
}
