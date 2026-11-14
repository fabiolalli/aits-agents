import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ElicitRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { analytical, critical, ethical, optimizer, synthesis } from '../../core/test/fixtures.ts';

const BUNDLE = path.resolve(__dirname, '../../../dist/aits.mjs');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aits-cli-'));
const parse = (r: unknown) => JSON.parse(((r as { content: { text: string }[] }).content[0]).text);

beforeAll(() => {
  if (!fs.existsSync(BUNDLE)) throw new Error('run npm run bundle before the integration tests');
});

describe('MCP server', () => {
  let client: Client;
  let dir: string;
  let answers: { decision: string; justification?: string }[] = [];

  beforeAll(async () => {
    dir = tmp();
    client = new Client({ name: 'test', version: '1.0.0' }, { capabilities: { elicitation: {} } });
    client.setRequestHandler(ElicitRequestSchema, async () => ({ action: 'accept', content: answers.shift() ?? { decision: 'proceed' } }));
    await client.connect(new StdioClientTransport({ command: 'node', args: [BUNDLE, 'mcp'], cwd: dir, env: { ...process.env, AITS_PROJECT_DIR: dir } as Record<string, string> }));
  });
  afterAll(async () => client?.close());

  it('lists the engine tools', async () => {
    const tools = (await client.listTools()).tools.map((t) => t.name);
    expect(tools).toEqual(expect.arrayContaining(['aits_start_run', 'aits_submit', 'aits_gate_respond', 'aits_synthesize', 'aits_recall', 'aits_calibration', 'aits_export', 'aits_memory_export', 'aits_memory_import']));
    expect(tools).toHaveLength(16);
  });

  it('blocks a synthesis on a violated rule and asks the human through elicitation', async () => {
    const start = parse(await client.callTool({ name: 'aits_start_run', arguments: { problem: 'Should we launch product X in Q2?', graph: 'quick' } }));
    expect(start.plan.waves[0][0].agent).toBe('analytical');
    await client.callTool({ name: 'aits_submit', arguments: { envelope: analytical() } });
    const sub = parse(await client.callTool({ name: 'aits_submit', arguments: { envelope: '```json\n' + JSON.stringify(critical({ severity: 15 })) + '\n```' } }));
    expect(sub.open_gates.map((g: { id: string }) => g.id)).toContain('R3#1');
    await client.callTool({ name: 'aits_submit', arguments: { envelope: optimizer() } });

    const refused = parse(await client.callTool({ name: 'aits_synthesize', arguments: { envelope: synthesis() } }));
    expect(refused.accepted).toBe(false);

    // The model tries to answer "override" itself: with elicitation the human's answer wins.
    answers = [{ decision: 'proceed', justification: 'Go on, but run the ethics check' }];
    const gate = parse(await client.callTool({ name: 'aits_gate_respond', arguments: { gate_id: 'R3#1', decision: 'override', user_quote: 'fake' } }));
    expect(gate.decision).toBe('proceed');

    await client.callTool({ name: 'aits_submit', arguments: { envelope: ethical() } });
    const ok = parse(await client.callTool({ name: 'aits_synthesize', arguments: { envelope: synthesis() } }));
    expect(ok.accepted).toBe(true);
    const verify = parse(await client.callTool({ name: 'aits_verify', arguments: { run_id: start.run_id } }));
    expect(verify.ok).toBe(true);
    const log = fs.readFileSync(path.join(dir, '.aits', 'runs', start.run_id, 'log.jsonl'), 'utf8');
    expect(log).toContain('"via":"elicitation"');
  });
});

describe('MCP server in a headless session', () => {
  it('falls back to the relayed words when nobody answers the elicitation form', async () => {
    const dir = tmp();
    const client = new Client({ name: 'headless', version: '1.0.0' }, { capabilities: { elicitation: {} } });
    client.setRequestHandler(ElicitRequestSchema, async () => ({ action: 'cancel' }));
    await client.connect(new StdioClientTransport({ command: 'node', args: [BUNDLE, 'mcp'], cwd: dir, env: { ...process.env, AITS_PROJECT_DIR: dir } as Record<string, string> }));
    try {
      const start = parse(await client.callTool({ name: 'aits_start_run', arguments: { problem: 'Headless gate', graph: 'quick' } }));
      await client.callTool({ name: 'aits_submit', arguments: { envelope: analytical() } });
      await client.callTool({ name: 'aits_submit', arguments: { envelope: critical({ severity: 15 }) } });
      const noQuote = parse(await client.callTool({ name: 'aits_gate_respond', arguments: { gate_id: 'R3#1', decision: 'proceed' } }));
      expect(noQuote.status).toBe('still open');
      expect(noQuote.note).toMatch(/Ask the human/);
      const relayed = parse(await client.callTool({ name: 'aits_gate_respond', arguments: { gate_id: 'R3#1', decision: 'proceed', user_quote: 'Procedi pure' } }));
      expect(relayed.decision).toBe('proceed');
      const log = fs.readFileSync(path.join(dir, '.aits', 'runs', start.run_id, 'log.jsonl'), 'utf8');
      expect(log).toContain('"via":"agent_relayed"');
      expect(log).toContain('nobody answered the elicitation form');
      // Two gates raised by the same output, answered with one decision.
      const second = parse(await client.callTool({ name: 'aits_submit', arguments: { envelope: { ...critical({ severity: 15 }), summary: 'second', hitl_flags: [{ trigger: 'x', severity: 'blocking', description: 'stop' }] } } }));
      expect(second.status, JSON.stringify(second.errors)).toBe('accepted');
      const open = parse(await client.callTool({ name: 'aits_status', arguments: {} })).open_gates.map((g: { id: string }) => g.id);
      expect(open.length).toBe(2);
      const both = parse(await client.callTool({ name: 'aits_gate_respond', arguments: { gate_id: open.join(','), decision: 'proceed', user_quote: 'Vai avanti con entrambi' } }));
      expect(both.gates).toHaveLength(2);
      expect(parse(await client.callTool({ name: 'aits_status', arguments: {} })).open_gates).toHaveLength(0);
    } finally {
      await client.close();
    }
  });
});

describe('CLI, hook and build', () => {
  it('runs a decision from the command line', () => {
    const dir = tmp();
    const run = (args: string[], input?: string) => execFileSync('node', [BUNDLE, ...args], { cwd: dir, input, encoding: 'utf8' });
    JSON.parse(run(['start', 'Lanciare il prodotto X in Germania?', '--graph', 'quick']));
    expect(JSON.parse(run(['submit', '-'], JSON.stringify(analytical()))).status).toBe('accepted');
    expect(JSON.parse(run(['submit', '-'], JSON.stringify(critical()))).status).toBe('accepted');
    expect(JSON.parse(run(['synthesize', '-'], JSON.stringify(synthesis()))).accepted).toBe(false);
    run(['submit', '-'], JSON.stringify(optimizer()));
    expect(JSON.parse(run(['synthesize', '-'], JSON.stringify(synthesis()))).accepted).toBe(true);
    expect(JSON.parse(run(['recall', 'prodotto in Germania']))[0].problem).toMatch(/Germania/);

    // The memory moves to a fresh folder, as between two sessions of a hosted sandbox.
    const file = path.join(dir, 'memory.json');
    expect(JSON.parse(run(['memory', 'export', '--out', file])).records).toBe(1);
    const other = tmp();
    const imported = JSON.parse(execFileSync('node', [BUNDLE, 'memory', 'import', file], { cwd: other, encoding: 'utf8' }));
    expect(imported.added).toHaveLength(1);
    expect(JSON.parse(execFileSync('node', [BUNDLE, 'recall', 'prodotto in Germania'], { cwd: other, encoding: 'utf8' }))[0].problem).toMatch(/Germania/);
  });

  it('the hook submits sub-agent outputs and attaches provenance later', () => {
    const dir = tmp();
    const run = (args: string[], input?: string) => execFileSync('node', [BUNDLE, ...args], { cwd: dir, input, encoding: 'utf8' });
    JSON.parse(run(['start', 'Test', '--graph', 'quick']));
    const env = analytical();
    const hookInput = { cwd: dir, tool_name: 'Task', tool_input: {}, tool_response: { content: [{ type: 'text', text: 'Here is my output:\n```json\n' + JSON.stringify(env) + '\n```' }] } };
    const res = JSON.parse(run(['hook', 'post-tool-use'], JSON.stringify(hookInput)));
    expect(res.hookSpecificOutput.additionalContext).toMatch(/analytical envelope accepted/);
    const again = JSON.parse(run(['submit', '-'], JSON.stringify({ ...env, provenance: { runtime: 'x', model_family: 'fam-a' } })));
    expect(again.status).toBe('accepted');
    expect(again.next[0]).toMatch(/only adds provenance/);
    const status = JSON.parse(run(['status']));
    expect(status.submitted).toHaveLength(1);
    expect(status.submitted[0].family).toBe('fam-a');
  });

  it('the subagent-stop hook captures the output of a background sub-agent under its runtime name', () => {
    const dir = tmp();
    const run = (args: string[], input?: string) => execFileSync('node', [BUNDLE, ...args], { cwd: dir, input, encoding: 'utf8' });
    JSON.parse(run(['start', 'Test', '--graph', 'quick']));
    const env = { ...analytical(), agent: 'aits:aits-analytical' };
    const out = run(['hook', 'subagent-stop'], JSON.stringify({ hook_event_name: 'SubagentStop', cwd: dir, agent_type: 'aits:aits-analytical', last_assistant_message: JSON.stringify(env) }));
    expect(out).toBe('');
    const status = JSON.parse(run(['status']));
    expect(status.submitted).toHaveLength(1);
    expect(status.submitted[0].agent).toBe('analytical');
    expect(status.submitted[0].status).toBe('accepted');
  });

  it('the envelope shown in each agent file is valid once its placeholders are filled', async () => {
    const { envelopeSkeleton } = await import('../src/build.ts');
    const { getSpec, validateEnvelope } = await import('@fabiolalli/aits-core');
    const fill = (v: unknown): unknown => {
      if (typeof v === 'string' && /^[a-z_]+(\|[a-z_]+)+$/.test(v)) return v.split('|')[0];
      if (Array.isArray(v)) return v.map(fill);
      if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]));
      return v;
    };
    for (const id of Object.keys(getSpec().agents)) {
      if (id === 'memory') continue;
      const env = fill(envelopeSkeleton(id, true)) as Record<string, unknown>;
      env.main_output = {};
      env.timestamp = '2026-11-07T08:00:00Z';
      const errors = validateEnvelope(env).errors.filter((e) => !e.startsWith('/main_output'));
      expect(errors, id).toEqual([]);
    }
  });

  it('the session-start hook exposes the plugin root to sub-agents', () => {
    const dir = tmp();
    const plugin = path.join(dir, 'plugin');
    fs.mkdirSync(path.join(plugin, 'references'), { recursive: true });
    const envFile = path.join(dir, 'env.sh');
    execFileSync('node', [BUNDLE, 'hook', 'session-start'], { cwd: dir, input: '{}', encoding: 'utf8', env: { ...process.env, CLAUDE_ENV_FILE: envFile, CLAUDE_PLUGIN_ROOT: plugin } });
    expect(fs.readFileSync(envFile, 'utf8')).toBe(`export AITS_PLUGIN_ROOT=${JSON.stringify(plugin)}\n`);
  });

  it('builds the Claude Code plugin and the Agent Skills package from the spec', () => {
    const out = tmp();
    execFileSync('node', [BUNDLE, 'build', '--target', 'all', '--out', out], { encoding: 'utf8' });
    const plugin = path.join(out, 'plugins', 'aits');
    expect(fs.readdirSync(path.join(plugin, 'agents'))).toHaveLength(12);
    const orch = fs.readFileSync(path.join(plugin, 'agents', 'aits-meta-orchestrator.md'), 'utf8');
    expect(orch).toMatch(/^---\nname: aits-meta-orchestrator/);
    expect(orch).toContain('AITS_PLUGIN_ROOT');
    expect(orch).not.toMatch(/^tools:/m);
    expect(orch).toContain('/aits:full');
    expect(orch).not.toContain('/aits-full');
    for (const sub of ['agents', 'commands', 'playbooks', 'references']) {
      for (const f of fs.readdirSync(path.join(plugin, sub))) expect(fs.readFileSync(path.join(plugin, sub, f), 'utf8'), `${sub}/${f}`).not.toMatch(/\/aits-(full|quick|diverge|board)\b/);
    }
    const analyticalAgent = fs.readFileSync(path.join(plugin, 'agents', 'aits-analytical.md'), 'utf8');
    expect(analyticalAgent).toContain('"agent": "analytical"');
    expect(analyticalAgent).toContain('`version` exactly `"3.0"`');
    expect(fs.readdirSync(path.join(plugin, 'commands')).sort()).toEqual(['board.md', 'diverge.md', 'full.md', 'quick.md']);
    const hooks = JSON.parse(fs.readFileSync(path.join(plugin, 'hooks', 'hooks.json'), 'utf8')).hooks;
    expect(Object.keys(hooks).sort()).toEqual(['PostToolUse', 'SessionStart', 'SubagentStop']);
    expect(JSON.parse(fs.readFileSync(path.join(plugin, '.mcp.json'), 'utf8')).mcpServers.aits.args[1]).toBe('mcp');
    expect(fs.existsSync(path.join(plugin, 'server', 'aits.mjs'))).toBe(true);
    const skill = fs.readFileSync(path.join(out, 'skills', 'aits', 'SKILL.md'), 'utf8');
    expect(skill).toMatch(/^---\nname: aits\n/);
    expect(skill.split('\n').length).toBeLessThan(500);
    expect(skill).not.toMatch(/of the AITS system \|/);
    expect(fs.existsSync(path.join(out, 'skills', 'aits', 'scripts', 'aits.mjs'))).toBe(true);
    // The package follows the Agent Skills specification and every file it points to exists.
    expect(skill).toMatch(/^license: MIT$/m);
    expect(skill).toMatch(/^compatibility: /m);
    expect(skill).toMatch(/^  engine-sha256: [0-9a-f]{64}$/m);
    expect(skill).toContain('memory export');
    const checked = execFileSync('node', [path.resolve(__dirname, '../../../scripts/check-skill.mjs'), path.join(out, 'skills', 'aits')], { encoding: 'utf8' });
    expect(checked).toMatch(/valid Agent Skill/);
    expect(fs.readFileSync(path.join(out, 'skills', 'aits', 'agents', 'meta-orchestrator.md'), 'utf8')).toContain('templates/dashboard.md');
    expect(fs.readFileSync(path.join(plugin, 'agents', 'aits-meta-orchestrator.md'), 'utf8')).toContain('agents/aits-dashboard.md');
  });
});

describe('A2A', () => {
  it('reviews envelopes sent by another agent', async () => {
    const { serveA2A } = await import('../src/a2a.ts');
    const { server, url } = serveA2A(0);
    await new Promise((r) => server.once('listening', r));
    const port = (server.address() as { port: number }).port;
    const base = url.replace(':0/', `:${port}/`);
    const card = await (await fetch(base + '.well-known/agent-card.json')).json();
    expect(card.skills[0].id).toBe('governance-review');
    const body = {
      jsonrpc: '2.0',
      id: 1,
      method: 'message/send',
      params: { message: { role: 'user', messageId: 'm1', parts: [{ kind: 'data', data: { problem: 'Test', graph: 'quick', envelopes: [analytical(), critical({ severity: 12 }), optimizer()], synthesis: synthesis() } }] } },
    };
    const res = await (await fetch(base, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).json();
    const data = res.result.artifacts[0].parts[1].data;
    expect(data.synthesis.accepted).toBe(false);
    expect(data.synthesis.reasons.join(' ')).toMatch(/R3/);
    server.close();
  });
});
