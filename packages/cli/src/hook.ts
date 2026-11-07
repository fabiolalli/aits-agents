import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Engine, extractEnvelope } from '@fabiolalli/aits-core';

type HookInput = {
  hook_event_name?: string;
  cwd?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_response?: unknown;
  agent_type?: string;
  last_assistant_message?: string;
};

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

function parse(stdin: string): HookInput | undefined {
  try {
    return JSON.parse(stdin) as HookInput;
  } catch {
    return undefined;
  }
}

function findEnvelope(strings: string[]): Record<string, unknown> | undefined {
  for (const s of strings.reverse()) {
    const e = extractEnvelope(s);
    if (e && typeof e.agent === 'string' && typeof e.version === 'string') return e;
  }
  return undefined;
}

/** Submits an envelope found in a sub-agent's output to the active run. Returns the engine's message lines. */
function submitFound(input: HookInput, strings: string[]): string[] | undefined {
  const engine = new Engine(input.cwd ?? process.cwd());
  const runId = engine.activeRunId();
  if (!runId) return undefined;
  const envelope = findEnvelope(strings);
  if (!envelope) return undefined;
  const result = engine.open(runId).submit(envelope);
  const lines = [`AITS engine: ${result.agent} envelope ${result.status} in run ${runId} (log entry ${result.seq}).`];
  if (result.errors.length) lines.push(`Errors: ${result.errors.join('; ')}`);
  lines.push(...result.next);
  if (result.status === 'accepted' || result.status === 'duplicate') lines.push('Add provenance (model family, model, tier, run index) by submitting the same envelope with aits_submit.');
  return lines;
}

/**
 * Runtime hook run after a sub-agent tool call returns. When a run is active, the agent output is
 * submitted to the engine automatically, so validation and rules do not depend on the orchestrator
 * remembering to do it. A sub-agent launched in the background returns only a handle here: its
 * output is captured by the subagent-stop hook instead.
 */
export async function postToolUseHook(stdin: string): Promise<string> {
  const input = parse(stdin);
  if (!input) return '';
  const lines = submitFound(input, collectStrings(input.tool_response));
  if (!lines) return '';
  return JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: lines.join('\n') } });
}

/**
 * Runtime hook run when a sub-agent finishes, in the foreground or in the background. It reads the
 * agent's last message, so the envelope reaches the engine even when no tool result carries it.
 * It prints nothing: the orchestrator reads the result when it submits the envelope itself, which
 * the engine recognises as the same output.
 */
export async function subagentStopHook(stdin: string): Promise<string> {
  const input = parse(stdin);
  if (!input || typeof input.last_assistant_message !== 'string') return '';
  if (input.agent_type && !/aits/i.test(input.agent_type)) return '';
  submitFound(input, [input.last_assistant_message]);
  return '';
}

/**
 * Runtime hook run at session start. Sub-agents cannot see the plugin root, so the reference files
 * of the method (schemas, conflict matrix, pattern library) would be unreachable from their shell.
 * The root is written to the session environment file as AITS_PLUGIN_ROOT.
 */
export async function sessionStartHook(): Promise<string> {
  const envFile = process.env.CLAUDE_ENV_FILE;
  const self = fileURLToPath(import.meta.url);
  const root = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(path.dirname(self), '..');
  if (envFile && fs.existsSync(path.join(root, 'references'))) {
    fs.appendFileSync(envFile, `export AITS_PLUGIN_ROOT=${JSON.stringify(root)}\n`);
  }
  return '';
}
