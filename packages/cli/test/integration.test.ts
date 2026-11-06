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
    expect(tools).toEqual(expect.arrayContaining(['aits_start_run', 'aits_submit', 'aits_gate_respond', 'aits_synthesize', 'aits_recall', 'aits_calibration', 'aits_export']));
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
    expect(again.status).toBe('duplicate');
    const status = JSON.parse(run(['status']));
    expect(status.submitted).toHaveLength(1);
    expect(status.submitted[0].family).toBe('fam-a');
  });

  it('builds the Claude Code plugin and the Agent Skills package from the spec', () => {
    const out = tmp();
    execFileSync('node', [BUNDLE, 'build', '--target', 'all', '--out', out], { encoding: 'utf8' });
    const plugin = path.join(out, 'plugins', 'aits');
    expect(fs.readdirSync(path.join(plugin, 'agents'))).toHaveLength(12);
    const orch = fs.readFileSync(path.join(plugin, 'agents', 'aits-meta-orchestrator.md'), 'utf8');
    expect(orch).toMatch(/^---\nname: aits-meta-orchestrator/);
    expect(orch).toContain('CLAUDE_PLUGIN_ROOT');
    expect(orch).not.toMatch(/^tools:/m);
    expect(JSON.parse(fs.readFileSync(path.join(plugin, '.mcp.json'), 'utf8')).mcpServers.aits.args[1]).toBe('mcp');
    expect(fs.existsSync(path.join(plugin, 'server', 'aits.mjs'))).toBe(true);
    const skill = fs.readFileSync(path.join(out, 'skills', 'aits', 'SKILL.md'), 'utf8');
    expect(skill).toMatch(/^---\nname: aits\n/);
    expect(skill.split('\n').length).toBeLessThan(500);
    expect(fs.existsSync(path.join(out, 'skills', 'aits', 'scripts', 'aits.mjs'))).toBe(true);
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
