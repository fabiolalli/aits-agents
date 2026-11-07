import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { Engine, ENGINE_VERSION, exportRun, planGraph, readLog, verifyLog, writeCalibration, type GateDecision } from '@fabiolalli/aits-core';
import { projectDir, publicKeysFor } from './common.ts';

const text = (value: unknown) => ({ content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
const fail = (err: unknown) => ({ isError: true, content: [{ type: 'text' as const, text: err instanceof Error ? err.message : String(err) }] });

async function guard<T>(fn: () => Promise<T> | T) {
  try {
    return text(await fn());
  } catch (err) {
    return fail(err);
  }
}

const DECISIONS = ['proceed', 'provide_context', 'override', 'abort'] as const;

/** The AITS engine as an MCP server. Every tool is deterministic: no model is called here. */
export function createServer(): McpServer {
  const server = new McpServer({ name: 'aits', version: ENGINE_VERSION }, { instructions: 'AITS engine. Start a run, submit every agent envelope, present the gates it opens to the human, and close the decision only through aits_synthesize. The engine never calls a model.' });
  const engine = () => new Engine(projectDir());
  const runArg = { run_id: z.string().optional().describe('Run id; defaults to the active run') };

  server.registerTool(
    'aits_start_run',
    {
      title: 'Start an AITS run',
      description: 'Starts a decision run. Returns the run id, the execution plan in parallel waves, matching archetypes and similar past decisions.',
      inputSchema: {
        problem: z.string().describe('The decision problem, in the user\'s words'),
        graph: z.string().optional().describe('full, quick, diverge or a playbook id (go-no-go, product-launch, ma-due-diligence, risk-assessment, innovation-sprint, ethical-impact, competitive-response)'),
        mode: z.enum(['supervised', 'autonomous', 'review']).optional(),
        tags: z.array(z.string()).optional(),
        include: z.array(z.string()).optional().describe('Optional graph nodes to include, for example systemic'),
      },
    },
    (args) => guard(() => engine().start(args)),
  );

  server.registerTool(
    'aits_plan',
    { title: 'Plan a playbook', description: 'Returns the waves of a playbook graph without starting a run.', inputSchema: { graph: z.string(), include: z.array(z.string()).optional() } },
    ({ graph, include }) => guard(() => planGraph(engine().spec, graph, include ?? [])),
  );

  server.registerTool(
    'aits_submit',
    {
      title: 'Submit an agent envelope',
      description: 'Validates an agent output against its schema, evaluates the inviolable rules and records it in the decision log. Pass the agent output unchanged, as an object or as the raw text containing the JSON.',
      inputSchema: { ...runArg, envelope: z.union([z.record(z.string(), z.unknown()), z.string()]) },
    },
    ({ run_id, envelope }) => guard(() => engine().open(run_id).submit(envelope)),
  );

  server.registerTool('aits_status', { title: 'Run status', description: 'Gates, requirements, coverage, diversity and whether the synthesis is allowed.', inputSchema: runArg }, ({ run_id }) => guard(() => engine().open(run_id).status()));

  server.registerTool(
    'aits_gate_respond',
    {
      title: 'Answer a gate',
      description:
        'Closes an open gate with the human\'s decision. When the client supports elicitation the engine first asks the human directly through a form; if nobody answers it (for example in a headless session) the decision and the human\'s own words passed in user_quote are recorded as relayed. Never answer a gate the human has not answered in the conversation.',
      inputSchema: {
        ...runArg,
        gate_id: z.string(),
        decision: z.enum(DECISIONS).optional(),
        user_quote: z.string().optional().describe('The human\'s words, verbatim'),
        justification: z.string().optional(),
      },
    },
    async ({ run_id, gate_id, decision, user_quote, justification }) =>
      guard(async () => {
        const run = engine().open(run_id);
        const gate = run.gates().find((g) => g.id === gate_id);
        if (!gate) throw new Error(`gate ${gate_id} does not exist`);
        const e = engine();
        let unanswered = '';
        if (e.config.gates.elicitation !== 'never' && server.server.getClientCapabilities()?.elicitation) {
          let answer: { action: string; content?: Record<string, unknown> } | undefined;
          try {
            answer = await server.server.elicitInput({
              message: `AITS gate ${gate.id}: ${gate.title}. Raised by ${gate.agents.join(', ')}. How do you want to proceed?`,
              requestedSchema: {
                type: 'object',
                properties: {
                  decision: { type: 'string', enum: [...DECISIONS], description: 'proceed, provide_context, override (waive the rule, needs a justification) or abort' },
                  justification: { type: 'string', description: 'Your reasons or the context to add' },
                },
                required: ['decision'],
              },
            });
          } catch (err) {
            answer = undefined;
            unanswered = `elicitation failed: ${err instanceof Error ? err.message : String(err)}`;
          }
          if (answer?.action === 'accept' && answer.content) {
            const c = answer.content as { decision: GateDecision; justification?: string };
            return run.respondToGate(gate.id, c.decision, 'elicitation', { justification: c.justification, user_quote: c.justification });
          }
          // An explicit refusal of the form is the human's answer: the gate stays open.
          if (answer?.action === 'decline') return { gate: gate.id, status: 'still open', note: 'the human declined to answer the gate' };
          // Nobody answered the form (headless session, form dismissed): fall back to the human's words in the conversation.
          unanswered ||= 'nobody answered the elicitation form';
        }
        if (!decision || !user_quote?.trim()) {
          return {
            gate: gate.id,
            status: 'still open',
            note: `${unanswered ? unanswered + '. ' : ''}Ask the human in the conversation, then call again with decision and user_quote containing their own words.`,
          };
        }
        return run.respondToGate(gate.id, decision, 'agent_relayed', { user_quote, justification: unanswered ? `${justification ?? ''} [${unanswered}]`.trim() : justification });
      }),
  );

  server.registerTool(
    'aits_skip_agent',
    { title: 'Skip a playbook agent', description: 'Records the human decision to skip an agent the playbook requires.', inputSchema: { ...runArg, agent: z.string(), reason: z.string(), user_quote: z.string() } },
    ({ run_id, agent, reason, user_quote }) => guard(() => engine().open(run_id).skip(agent, reason, 'agent_relayed', user_quote)),
  );

  server.registerTool(
    'aits_aggregate',
    { title: 'Aggregate independent runs', description: 'Median of numbers, count of positions and minority report across the runs of one agent.', inputSchema: { ...runArg, agent: z.string() } },
    ({ run_id, agent }) => guard(() => engine().open(run_id).aggregate(agent)),
  );

  server.registerTool(
    'aits_synthesize',
    {
      title: 'Close the decision',
      description: 'Submits the Meta-Orchestrator synthesis. Refused while gates are open, requirements unmet or playbook agents missing. On success returns the confidence computed by the engine and saves the decision to memory.',
      inputSchema: { ...runArg, envelope: z.union([z.record(z.string(), z.unknown()), z.string()]) },
    },
    ({ run_id, envelope }) => guard(() => engine().open(run_id).synthesize(envelope)),
  );

  server.registerTool(
    'aits_recall',
    { title: 'Recall similar decisions', description: 'Semantic search over past decisions in local memory.', inputSchema: { query: z.string(), k: z.number().int().min(1).max(20).optional() } },
    ({ query, k }) => guard(() => engine().memory.recall(query, k ?? 5)),
  );

  server.registerTool(
    'aits_record_outcome',
    {
      title: 'Record what happened',
      description: 'Marks a past prediction as happened (1) or not happened (0). Use only with the outcome the human reports.',
      inputSchema: { decision_id: z.string(), prediction_id: z.string(), outcome: z.union([z.literal(0), z.literal(1)]), note: z.string().optional() },
    },
    ({ decision_id, prediction_id, outcome, note }) => guard(() => engine().memory.recordOutcome(decision_id, prediction_id, outcome, note)),
  );

  server.registerTool('aits_calibration', { title: 'Calibration report', description: 'Brier score and reliability by agent, model family and tier on resolved predictions.', inputSchema: {} }, () =>
    guard(() => {
      const e = engine();
      return writeCalibration(e.memory, e.spec.policies.calibration.min_resolved_for_adjustment);
    }),
  );

  server.registerTool(
    'aits_patterns',
    {
      title: 'Learned patterns',
      description: 'scan proposes pattern candidates from clusters of past decisions; list shows them; approve and reject record the human review.',
      inputSchema: { action: z.enum(['scan', 'list', 'approve', 'reject']), id: z.string().optional() },
    },
    ({ action, id }) =>
      guard(async () => {
        const m = engine().memory;
        if (action === 'scan') return m.patternCandidates();
        if (action === 'list') return m.readPatterns().map(({ centroid, ...p }) => p);
        if (!id) throw new Error('id is required');
        return m.setPatternStatus(id, action === 'approve' ? 'approved' : 'rejected');
      }),
  );

  server.registerTool('aits_verify', { title: 'Verify the decision log', description: 'Recomputes the hash chain and the signatures of a run log.', inputSchema: runArg }, ({ run_id }) =>
    guard(() => {
      const e = engine();
      return verifyLog(readLog(e.open(run_id).log.file), publicKeysFor(e));
    }),
  );

  server.registerTool('aits_export', { title: 'Export a run', description: 'Writes report.md, envelopes.json, log.jsonl, verification.json and trace.otlp.json for a run.', inputSchema: runArg }, ({ run_id }) =>
    guard(() => {
      const e = engine();
      return exportRun(e.open(run_id), undefined, publicKeysFor(e));
    }),
  );

  return server;
}

export async function serveStdio() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
