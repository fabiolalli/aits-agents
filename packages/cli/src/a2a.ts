import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Engine, ENGINE_VERSION, markdownReport } from '@fabiolalli/aits-core';

/**
 * A2A endpoint exposing one model-free skill: governance review of a set of AITS envelopes.
 * Another agent sends the outputs of its own analysis; AITS returns which rules fire, which gates
 * a human would have to close, whether the synthesis would be accepted and the engine confidence.
 */
export function agentCard(url: string) {
  return {
    protocolVersion: '1.0',
    name: 'AITS governance review',
    description: 'Checks a multi-perspective decision analysis against the AITS rules: schemas, inviolable rules, human gates, playbook coverage, model diversity and engine confidence. No model is called.',
    url,
    version: ENGINE_VERSION,
    provider: { organization: 'AITS', url: 'https://github.com/fabiolalli/aits-agents' },
    capabilities: { streaming: false, pushNotifications: false },
    defaultInputModes: ['application/json'],
    defaultOutputModes: ['text/markdown', 'application/json'],
    skills: [
      {
        id: 'governance-review',
        name: 'Governance review of a decision analysis',
        description: 'Input: a data part {problem, graph?, envelopes: [...], synthesis?}. Output: a markdown report and the run status as data.',
        tags: ['decision-making', 'governance', 'audit', 'human-in-the-loop'],
        examples: ['Review these AITS envelopes before I present the decision'],
      },
    ],
  };
}

interface ReviewInput {
  problem: string;
  graph?: string;
  envelopes: unknown[];
  synthesis?: unknown;
}

export async function governanceReview(input: ReviewInput) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aits-a2a-'));
  try {
    const engine = new Engine(dir);
    const { run_id } = await engine.start({ problem: input.problem, graph: input.graph ?? 'full', mode: 'review' });
    const run = engine.open(run_id);
    const submissions = input.envelopes.map((e) => {
      const r = run.submit(e);
      return { agent: r.agent, status: r.status, errors: r.errors };
    });
    const synthesis = input.synthesis ? await run.synthesize(input.synthesis) : undefined;
    return { report: markdownReport(run), status: run.status(), submissions, synthesis };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function findData(params: unknown): ReviewInput | undefined {
  const parts = ((params as { message?: { parts?: unknown[] } })?.message?.parts ?? []) as Record<string, unknown>[];
  for (const p of parts) {
    const data = (p.data ?? (p.kind === 'data' ? p.data : undefined)) as ReviewInput | undefined;
    if (data && Array.isArray(data.envelopes)) return data;
  }
  return undefined;
}

export function serveA2A(port: number, host = '127.0.0.1') {
  const url = `http://${host}:${port}/`;
  const server = http.createServer(async (req, res) => {
    const send = (code: number, body: unknown) => {
      res.writeHead(code, { 'content-type': 'application/json' });
      res.end(JSON.stringify(body));
    };
    if (req.method === 'GET' && (req.url === '/.well-known/agent-card.json' || req.url === '/.well-known/agent.json')) return send(200, agentCard(url));
    if (req.method !== 'POST') return send(404, { error: 'not found' });
    let raw = '';
    for await (const chunk of req) raw += chunk;
    let rpc: { id?: unknown; method?: string; params?: unknown };
    try {
      rpc = JSON.parse(raw);
    } catch {
      return send(200, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } });
    }
    if (rpc.method !== 'message/send' && rpc.method !== 'SendMessage') return send(200, { jsonrpc: '2.0', id: rpc.id, error: { code: -32601, message: `method ${rpc.method} not supported` } });
    const input = findData(rpc.params);
    if (!input?.problem) return send(200, { jsonrpc: '2.0', id: rpc.id, error: { code: -32602, message: 'expected a data part with {problem, envelopes, synthesis?}' } });
    try {
      const out = await governanceReview(input);
      const contextId = ((rpc.params as { message?: { contextId?: string } })?.message?.contextId) ?? randomUUID();
      return send(200, {
        jsonrpc: '2.0',
        id: rpc.id,
        result: {
          kind: 'task',
          id: randomUUID(),
          contextId,
          status: { state: 'completed', timestamp: new Date().toISOString() },
          artifacts: [
            {
              artifactId: randomUUID(),
              name: 'governance-report',
              parts: [
                { kind: 'text', text: out.report },
                { kind: 'data', data: { status: out.status, submissions: out.submissions, synthesis: out.synthesis } },
              ],
            },
          ],
        },
      });
    } catch (err) {
      return send(200, { jsonrpc: '2.0', id: rpc.id, error: { code: -32000, message: err instanceof Error ? err.message : String(err) } });
    }
  });
  server.listen(port, host);
  return { server, url };
}
