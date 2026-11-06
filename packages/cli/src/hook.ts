import { Engine, extractEnvelope } from '@fabiolalli/aits-core';

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

/**
 * Runtime hook run after a sub-agent returns. When a run is active, the agent output is submitted to
 * the engine automatically, so validation and rules do not depend on the orchestrator remembering to
 * do it. Input: the hook JSON on stdin. Output: context for the orchestrator, or nothing.
 */
export async function postToolUseHook(stdin: string): Promise<string> {
  let input: { cwd?: string; tool_name?: string; tool_input?: Record<string, unknown>; tool_response?: unknown };
  try {
    input = JSON.parse(stdin);
  } catch {
    return '';
  }
  const engine = new Engine(input.cwd ?? process.cwd());
  const runId = engine.activeRunId();
  if (!runId) return '';
  let envelope: Record<string, unknown> | undefined;
  for (const s of collectStrings(input.tool_response).reverse()) {
    const e = extractEnvelope(s);
    if (e && typeof e.agent === 'string' && typeof e.version === 'string') {
      envelope = e;
      break;
    }
  }
  if (!envelope) return '';
  const result = engine.open(runId).submit(envelope);
  const lines = [`AITS engine: ${result.agent} envelope ${result.status} in run ${runId} (log entry ${result.seq}).`];
  if (result.errors.length) lines.push(`Errors: ${result.errors.join('; ')}`);
  lines.push(...result.next);
  if (result.status === 'accepted' || result.status === 'duplicate') lines.push('Add provenance (model family, model, tier, run index) by submitting the same envelope with aits_submit.');
  return JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: lines.join('\n') } });
}
