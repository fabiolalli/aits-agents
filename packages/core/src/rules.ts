import type { RuleSpec, Selector, Spec } from './spec.ts';
import { getPathValues } from './util.ts';

/** An envelope as recorded in the log, valid or rejected. */
export interface RecordedEnvelope {
  seq: number;
  agent: string;
  envelope: Record<string, unknown>;
  hash: string;
  status: 'accepted' | 'rejected' | 'invalid';
  /** Who submitted it: the runtime hook that saw the agent's raw output, or the orchestrator. */
  source?: 'runtime' | 'orchestrator';
}

export interface GateAck {
  seq: number;
  gate_id: string;
  rule: string;
  decision: 'proceed' | 'provide_context' | 'override' | 'abort';
}

export interface GateState {
  id: string;
  rule: string;
  title: string;
  severity: 'blocking' | 'advisory';
  status: 'open' | 'closed';
  trigger_seqs: number[];
  agents: string[];
  reason: string;
}

export interface RequirementState {
  rule: string;
  title: string;
  agents: string[];
  mode: 'any' | 'all';
  trigger_seq: number;
  satisfied: boolean;
  satisfied_by?: number[];
  overridden: boolean;
}

function agentMatches(sel: Selector, agent: string): boolean {
  if (sel.agent) {
    const list = Array.isArray(sel.agent) ? sel.agent : [sel.agent];
    if (!list.includes(agent)) return false;
  }
  if (sel.agent_not && sel.agent_not.includes(agent)) return false;
  return true;
}

export function selectorMatches(sel: Selector, agent: string, envelope: unknown): boolean {
  if (!agentMatches(sel, agent)) return false;
  const values = getPathValues(envelope, sel.path);
  switch (sel.op) {
    case 'exists':
      return values.length > 0 && values.some((v) => v !== undefined && v !== null);
    case 'truthy':
      return values.some((v) => !!v);
    case 'eq':
      return values.some((v) => v === sel.value);
    case 'in':
      return values.some((v) => (sel.value as unknown[]).includes(v));
    case 'gte':
      return values.some((v) => typeof v === 'number' && v >= (sel.value as number));
    case 'lte':
      return values.some((v) => typeof v === 'number' && v <= (sel.value as number));
    case 'count_gte':
      return values.some((v) => Array.isArray(v) && v.length >= (sel.value as number));
    default:
      return false;
  }
}

/**
 * Returns the sequence numbers of the envelopes that trigger a rule.
 * For `all`, the rule triggers only when every selector matches some envelope; the trigger is then
 * the latest of the matching envelopes, because that is when the condition became true.
 */
export function ruleTriggers(rule: RuleSpec, envelopes: RecordedEnvelope[]): { seqs: number[]; agents: string[] } {
  const pool = envelopes.filter((e) => e.status === 'accepted' || (rule.reject && e.status === 'rejected'));
  if (rule.when.any) {
    const hits = pool.filter((e) => rule.when.any!.some((s) => selectorMatches(s, e.agent, e.envelope)));
    return { seqs: hits.map((h) => h.seq), agents: [...new Set(hits.map((h) => h.agent))] };
  }
  if (rule.when.all) {
    const perSelector = rule.when.all.map((s) => pool.filter((e) => selectorMatches(s, e.agent, e.envelope)));
    if (perSelector.some((list) => list.length === 0)) return { seqs: [], agents: [] };
    const latest = Math.max(...perSelector.map((list) => Math.max(...list.map((e) => e.seq))));
    return { seqs: [latest], agents: [...new Set(perSelector.flat().map((e) => e.agent))] };
  }
  return { seqs: [], agents: [] };
}

/** Rules that reject an envelope outright (R1). Evaluated before the envelope is accepted. */
export function rejectingRules(spec: Spec, agent: string, envelope: unknown): RuleSpec[] {
  return spec.rules.filter((r) => r.reject && (r.when.any ?? []).some((s) => selectorMatches(s, agent, envelope)));
}

export function computeGates(spec: Spec, envelopes: RecordedEnvelope[], acks: GateAck[]): GateState[] {
  const gates: GateState[] = [];
  const rulesWithGates = spec.rules.filter((r) => r.gate);
  for (const rule of rulesWithGates) {
    const { seqs, agents } = ruleTriggers(rule, envelopes);
    gates.push(...episodes(rule.id, rule.title, rule.gate!, seqs, agents, acks));
  }
  // R7: schema validation failures, built into the engine.
  const max = spec.policies.validation.max_failures_per_agent;
  const byAgent = new Map<string, RecordedEnvelope[]>();
  for (const e of envelopes) byAgent.set(e.agent, [...(byAgent.get(e.agent) ?? []), e]);
  const r7Seqs: number[] = [];
  const r7Agents: string[] = [];
  for (const [agent, list] of byAgent) {
    let streak = 0;
    for (const e of list) {
      if (e.status === 'invalid') {
        streak++;
        if (streak === max) {
          r7Seqs.push(e.seq);
          r7Agents.push(agent);
        }
      } else if (e.status === 'accepted') streak = 0;
    }
  }
  gates.push(...episodes('R7', 'Schema validation failed after a retry', 'blocking', r7Seqs.sort((a, b) => a - b), r7Agents, acks));
  return gates;
}

/**
 * A rule's gate reopens when it is triggered again after the last human answer.
 * Each episode gets a stable id `<rule>#<n>`.
 */
function episodes(rule: string, title: string, severity: 'blocking' | 'advisory', seqs: number[], agents: string[], acks: GateAck[]): GateState[] {
  if (seqs.length === 0) return [];
  const ruleAcks = acks.filter((a) => a.rule === rule).sort((a, b) => a.seq - b.seq);
  const out: GateState[] = [];
  let from = -1;
  ruleAcks.forEach((ack, i) => {
    const inEpisode = seqs.filter((s) => s > from && s < ack.seq);
    if (inEpisode.length) out.push({ id: `${rule}#${i + 1}`, rule, title, severity, status: 'closed', trigger_seqs: inEpisode, agents, reason: title });
    from = ack.seq;
  });
  const pending = seqs.filter((s) => s > from);
  if (pending.length) {
    out.push({ id: `${rule}#${ruleAcks.length + 1}`, rule, title, severity, status: 'open', trigger_seqs: pending, agents, reason: title });
  }
  return out;
}

export function computeRequirements(spec: Spec, envelopes: RecordedEnvelope[], acks: GateAck[]): RequirementState[] {
  const out: RequirementState[] = [];
  for (const rule of spec.rules.filter((r) => r.require)) {
    const { seqs } = ruleTriggers(rule, envelopes);
    if (seqs.length === 0) continue;
    const trigger = Math.max(...seqs);
    const req = rule.require!;
    const mode = req.mode ?? 'any';
    const satisfiers = req.agents.map((agent) =>
      envelopes.filter((e) => e.status === 'accepted' && e.agent === agent && e.seq > trigger && (!req.where || selectorMatches(req.where, e.agent, e.envelope))),
    );
    const satisfied = mode === 'any' ? satisfiers.some((l) => l.length > 0) : satisfiers.every((l) => l.length > 0);
    const overridden = acks.some((a) => a.rule === rule.id && a.decision === 'override' && a.seq > trigger);
    out.push({
      rule: rule.id,
      title: rule.title,
      agents: req.agents,
      mode,
      trigger_seq: trigger,
      satisfied,
      satisfied_by: satisfied ? satisfiers.flat().map((e) => e.seq) : undefined,
      overridden,
    });
  }
  return out;
}
