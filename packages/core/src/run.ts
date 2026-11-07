import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getSpec, matchPatterns, type Spec } from './spec.ts';
import { validateEnvelope } from './validate.ts';
import { DecisionLog, loadSigner, type LogEntry } from './log.ts';
import { computeGates, computeRequirements, rejectingRules, type GateAck, type GateState, type RecordedEnvelope, type RequirementState } from './rules.ts';
import { aggregateRuns, type AggregatedView } from './aggregate.ts';
import { planGraph, requiredCoverage, type Plan } from './graph.ts';
import { availableFamilies, loadConfig, type AitsConfig } from './config.ts';
import { MemoryStore, embedderFor, type MemoryPrediction, type MemoryRecord } from './memory.ts';
import { agentReliability, readCalibration } from './calibration.ts';
import { CONFIDENCE_ORDER, hashOf, minConfidence, slugify, type ConfidenceLevel } from './util.ts';

export const ENGINE_VERSION = '3.0.1';

export type Mode = 'supervised' | 'autonomous' | 'review';
export type GateDecision = GateAck['decision'];
export type AckVia = 'elicitation' | 'cli' | 'agent_relayed' | 'a2a';

export interface StartOptions {
  problem: string;
  graph?: string;
  mode?: Mode;
  tags?: string[];
  include?: string[];
}

export interface SubmitResult {
  run_id: string;
  agent?: string;
  status: 'accepted' | 'rejected' | 'invalid' | 'duplicate';
  seq?: number;
  errors: string[];
  rejected_by?: string[];
  open_gates: GateState[];
  unmet_requirements: RequirementState[];
  next: string[];
}

export interface SynthesisResult {
  run_id: string;
  accepted: boolean;
  reasons: string[];
  engine_confidence?: ConfidenceLevel;
  declared_confidence?: ConfidenceLevel;
  caps?: string[];
  diversity?: DiversityState;
  memory_id?: string;
  log_head?: string;
}

export interface DiversityState {
  families: string[];
  verified: boolean;
  monoculture: boolean;
  families_available: string[];
  multi_run: Record<string, { runs: number; required: number }>;
}

export interface RunStatus {
  run_id: string;
  problem: string;
  graph: string;
  mode: Mode;
  state: 'open' | 'completed' | 'aborted';
  plan: Plan;
  submitted: { seq: number; agent: string; status: string; confidence?: string; family?: string }[];
  open_gates: GateState[];
  closed_gates: GateState[];
  requirements: RequirementState[];
  missing_coverage: Record<string, number>;
  skipped: string[];
  diversity: DiversityState;
  can_synthesize: boolean;
  blocking_reasons: string[];
  log_head: string;
}

interface StartData extends Required<Pick<StartOptions, 'problem' | 'mode' | 'tags' | 'include'>> {
  run_id: string;
  graph: string;
  engine_version: string;
}

/** Extracts a JSON object from raw agent output: a bare object, or the last fenced JSON block. */
/**
 * Maps the names a runtime gives an agent ("aits:aits-analytical", "aits-analytical",
 * "analytical-agent", "Analytical") to the spec id, so that schema failures and rules are
 * counted on the right agent. Unknown names are returned unchanged and fail validation.
 */
export function normalizeAgentId(name: string, known: string[]): string {
  if (known.includes(name)) return name;
  const n = name
    .trim()
    .toLowerCase()
    .replace(/^[a-z0-9_-]+:/, '')
    .replace(/^aits[-_ ]/, '')
    .replace(/[-_ ]agent$/, '')
    .replace(/[_ ]/g, '-');
  return known.includes(n) ? n : name;
}

export function extractEnvelope(raw: unknown): Record<string, unknown> | undefined {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw as Record<string, unknown>;
  if (typeof raw !== 'string') return undefined;
  const text = raw.trim();
  const candidates: string[] = [];
  if (text.startsWith('{')) candidates.push(text);
  for (const m of text.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)) candidates.push(m[1]);
  for (const c of candidates.reverse()) {
    try {
      const v = JSON.parse(c);
      if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
    } catch {
      /* try the next candidate */
    }
  }
  return undefined;
}

export class Engine {
  readonly spec: Spec;
  readonly config: ReturnType<typeof loadConfig>;
  readonly memory: MemoryStore;

  constructor(cwd = process.cwd()) {
    this.spec = getSpec();
    this.config = loadConfig(cwd);
    this.memory = new MemoryStore(this.config.storageDir, embedderFor(this.config), this.config.memory.redact ?? []);
  }

  runsDir(): string {
    return path.join(this.config.storageDir, 'runs');
  }

  private signer() {
    const key = this.config.signing?.key;
    return key && fs.existsSync(key) ? loadSigner(key) : undefined;
  }

  async start(opts: StartOptions) {
    if (!opts.problem?.trim()) throw new Error('problem is required');
    const graph = opts.graph ?? 'full';
    const plan = planGraph(this.spec, graph, opts.include ?? []);
    const run_id = `${new Date().toISOString().slice(0, 10)}_${slugify(opts.problem, 36)}_${randomUUID().slice(0, 8)}`;
    const patterns = matchPatterns(this.spec, opts.problem).slice(0, 3);
    const learned = await this.memory.matchLearnedPatterns(opts.problem).catch(() => []);
    const recalled = await this.memory.recall(opts.problem, 3).catch(() => []);
    const data: StartData = { run_id, problem: opts.problem, graph, mode: opts.mode ?? 'supervised', tags: opts.tags ?? [], include: opts.include ?? [], engine_version: ENGINE_VERSION };
    const run = new Run(this, run_id);
    run.log.append('run_started', { ...data, plan, patterns, learned_patterns: learned, recalled, families_available: availableFamilies(this.config) });
    fs.writeFileSync(path.join(this.runsDir(), 'active'), run_id);
    return { run_id, plan, patterns, learned_patterns: learned, recalled, families_available: availableFamilies(this.config) };
  }

  open(runId?: string): Run {
    const id = runId ?? this.activeRunId() ?? this.latestRunId();
    if (!id) throw new Error('no run id given and no run found');
    const file = path.join(this.runsDir(), id, 'log.jsonl');
    if (!fs.existsSync(file)) throw new Error(`run ${id} not found in ${this.runsDir()}`);
    return new Run(this, id);
  }

  activeRunId(): string | undefined {
    const p = path.join(this.runsDir(), 'active');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() || undefined : undefined;
  }

  /** Most recently written run, used when no run id is given and no run is active. */
  latestRunId(): string | undefined {
    return this.listRuns()
      .map((id) => ({ id, t: fs.statSync(path.join(this.runsDir(), id, 'log.jsonl')).mtimeMs }))
      .sort((a, b) => b.t - a.t)[0]?.id;
  }

  listRuns(): string[] {
    if (!fs.existsSync(this.runsDir())) return [];
    return fs.readdirSync(this.runsDir()).filter((d) => fs.existsSync(path.join(this.runsDir(), d, 'log.jsonl'))).sort();
  }

  signerFor() {
    return this.signer();
  }
}

export class Run {
  readonly id: string;
  readonly dir: string;
  readonly log: DecisionLog;
  constructor(private engine: Engine, id: string) {
    this.id = id;
    this.dir = path.join(engine.runsDir(), id);
    this.log = new DecisionLog(path.join(this.dir, 'log.jsonl'), engine.signerFor());
  }

  private get spec() {
    return this.engine.spec;
  }

  start(): StartData & { plan: Plan } {
    const e = this.log.all().find((x) => x.type === 'run_started');
    if (!e) throw new Error(`run ${this.id} has no start entry`);
    return e.data as StartData & { plan: Plan };
  }

  envelopes(): RecordedEnvelope[] {
    const attached = new Map<number, Record<string, unknown>>();
    for (const e of this.log.all()) {
      if (e.type === 'provenance_attached') {
        const d = e.data as { target_seq: number; provenance: Record<string, unknown> };
        attached.set(d.target_seq, d.provenance);
      }
    }
    return this.log
      .all()
      .filter((e) => e.type === 'envelope')
      .map((e) => {
        const d = e.data as { agent: string; status: RecordedEnvelope['status']; envelope: Record<string, unknown>; content_hash?: string; envelope_hash: string; source?: RecordedEnvelope['source'] };
        const envelope = attached.has(e.seq) ? { ...d.envelope, provenance: attached.get(e.seq) } : d.envelope;
        return { seq: e.seq, agent: d.agent, envelope, hash: d.content_hash ?? d.envelope_hash, status: d.status, source: d.source };
      });
  }

  acks(): (GateAck & { via: AckVia; justification?: string; user_quote?: string })[] {
    return this.log
      .all()
      .filter((e) => e.type === 'gate_response')
      .map((e) => ({ seq: e.seq, ...(e.data as Omit<GateAck, 'seq'> & { via: AckVia; justification?: string; user_quote?: string }) }));
  }

  skipped(): string[] {
    return this.log.all().filter((e) => e.type === 'node_skipped').map((e) => (e.data as { agent: string }).agent);
  }

  state(): 'open' | 'completed' | 'aborted' {
    const closed = this.log.all().find((e) => e.type === 'run_closed');
    return closed ? ((closed.data as { status: 'completed' | 'aborted' }).status) : 'open';
  }

  gates(): GateState[] {
    return computeGates(this.spec, this.envelopes(), this.acks());
  }

  requirements(): RequirementState[] {
    return computeRequirements(this.spec, this.envelopes(), this.acks());
  }

  private assertOpen() {
    const s = this.state();
    if (s !== 'open') throw new Error(`run ${this.id} is ${s}`);
  }

  submit(raw: unknown, opts: { source?: 'runtime' | 'orchestrator' } = {}): SubmitResult {
    this.assertOpen();
    const source = opts.source ?? 'orchestrator';
    const envelope = extractEnvelope(raw);
    if (!envelope) {
      const entry = this.log.append('envelope', { agent: 'unknown', status: 'invalid', envelope: { raw: String(raw).slice(0, 4000) }, envelope_hash: hashOf(String(raw)), errors: ['no JSON object found in the agent output'] });
      return this.result('invalid', entry.seq, 'unknown', ['no JSON object found in the agent output']);
    }
    const declared = String(envelope.agent ?? 'unknown');
    const agent = normalizeAgentId(declared, Object.keys(this.spec.agents));
    if (agent !== declared) envelope.agent = agent;
    const envelope_hash = hashOf(envelope);
    // The same output can arrive twice (a runtime hook and the orchestrator). Identity ignores
    // provenance, which the orchestrator may add later: it is attached instead of counted twice.
    const { provenance, ...content } = envelope;
    const content_hash = hashOf(content);
    // Two runtime hooks (tool result and sub-agent stop) can both see the same output, valid or not.
    const dup = this.envelopes().find((e) => e.hash === content_hash && (e.status !== 'invalid' || (source === 'runtime' && e.source === 'runtime')));
    if (dup) {
      if (provenance && !dup.envelope.provenance) this.log.append('provenance_attached', { target_seq: dup.seq, provenance });
      const claimed = this.log.all().some((e) => e.type === 'resubmission' && (e.data as { target_seq: number }).target_seq === dup.seq);
      if (source === 'orchestrator' && dup.source === 'runtime' && !claimed) this.log.append('resubmission', { agent, target_seq: dup.seq, content_hash, identical: true });
      if (dup.status === 'invalid') return this.result('invalid', dup.seq, agent, ((this.log.all().find((e) => e.seq === dup.seq)?.data as { errors?: string[] }).errors ?? []));
      return this.result('duplicate', dup.seq, agent, []);
    }

    // The runtime hook already recorded this agent's raw output and the orchestrator is now sending
    // its own copy of the same attempt, possibly reformatted: the hook's copy stays the one of record,
    // so one attempt is never counted twice (R7, multi-run) and a rewritten output never replaces it.
    if (source === 'orchestrator') {
      const claimed = new Set(this.log.all().filter((e) => e.type === 'resubmission').map((e) => (e.data as { target_seq: number }).target_seq));
      const pending = this.envelopes().filter((e) => e.agent === agent && e.source === 'runtime' && !claimed.has(e.seq));
      if (pending.length) {
        const target = pending[0];
        const targetErrors = ((this.log.all().find((e) => e.seq === target.seq)?.data as { errors?: string[] } | undefined)?.errors ?? []);
        this.log.append('resubmission', { agent, target_seq: target.seq, content_hash, identical: content_hash === target.hash });
        if (provenance && !target.envelope.provenance) this.log.append('provenance_attached', { target_seq: target.seq, provenance });
        const res = this.result(target.status === 'accepted' ? 'duplicate' : target.status, target.seq, agent, targetErrors);
        if (content_hash !== target.hash) res.next.unshift(`The runtime had already recorded the output of ${agent} as log entry ${target.seq}; that copy is the one of record. Pass agent outputs unchanged.`);
        return res;
      }
    }

    const v = validateEnvelope(envelope);
    if (!v.valid) {
      const entry = this.log.append('envelope', { agent, status: 'invalid', envelope, content_hash, envelope_hash, errors: v.errors, source });
      return this.result('invalid', entry.seq, agent, v.errors);
    }
    const rejecting = rejectingRules(this.spec, agent, envelope);
    if (rejecting.length) {
      const errors = rejecting.map((r) => `${r.id}: ${r.title}`);
      const entry = this.log.append('envelope', { agent, status: 'rejected', envelope, content_hash, envelope_hash, errors, rejected_by: rejecting.map((r) => r.id), source });
      return { ...this.result('rejected', entry.seq, agent, errors), rejected_by: rejecting.map((r) => r.id) };
    }
    const entry = this.log.append('envelope', { agent, status: 'accepted', envelope, content_hash, envelope_hash, source });
    return this.result('accepted', entry.seq, agent, []);
  }

  private result(status: SubmitResult['status'], seq: number | undefined, agent: string, errors: string[]): SubmitResult {
    const open_gates = this.gates().filter((g) => g.status === 'open');
    const unmet = this.requirements().filter((r) => !r.satisfied && !r.overridden);
    const next: string[] = [];
    if (status === 'invalid') next.push(`Re-run ${agent} once, passing these schema errors as correction instructions. A second failure opens gate R7.`);
    if (status === 'rejected') next.push(`The envelope from ${agent} broke an inviolable rule and was not accepted.`);
    for (const g of open_gates.filter((x) => x.severity === 'blocking')) next.push(`Stop and present gate ${g.id} (${g.title}) to the human. Close it only with their decision.`);
    for (const g of open_gates.filter((x) => x.severity === 'advisory')) next.push(`Advisory ${g.id}: ${g.title}. Inform the human; it does not block the flow.`);
    for (const r of unmet) next.push(`Rule ${r.rule} requires ${r.mode === 'any' ? 'one of' : 'all of'} [${r.agents.join(', ')}] after entry ${r.trigger_seq} before the synthesis.`);
    return { run_id: this.id, agent, status, seq, errors, open_gates, unmet_requirements: unmet, next };
  }

  respondToGate(gateId: string, decision: GateDecision, via: AckVia, opts: { justification?: string; user_quote?: string } = {}) {
    this.assertOpen();
    const gate = this.gates().find((g) => g.id === gateId);
    if (!gate) throw new Error(`gate ${gateId} does not exist in run ${this.id}`);
    if (gate.status !== 'open') throw new Error(`gate ${gateId} is already closed`);
    if (via === 'agent_relayed' && !opts.user_quote?.trim()) throw new Error('a relayed answer must include the human\'s own words in user_quote');
    if (decision === 'override' && !opts.justification?.trim()) throw new Error('an override needs a justification');
    const entry = this.log.append('gate_response', { gate_id: gateId, rule: gate.rule, decision, via, justification: opts.justification, user_quote: opts.user_quote });
    if (decision === 'abort') this.close('aborted', opts.justification ?? opts.user_quote ?? 'aborted at gate ' + gateId);
    return { gate: { ...gate, status: 'closed' as const }, decision, seq: entry.seq, run_state: this.state() };
  }

  skip(agent: string, reason: string, via: AckVia, user_quote?: string) {
    this.assertOpen();
    if (via === 'agent_relayed' && !user_quote?.trim()) throw new Error('a relayed skip must include the human\'s own words in user_quote');
    this.log.append('node_skipped', { agent, reason, via, user_quote });
    return this.status();
  }

  aggregate(agent: string): AggregatedView {
    const envs = this.envelopes().filter((e) => e.status === 'accepted' && e.agent === agent).map((e) => e.envelope);
    return aggregateRuns(agent, envs, this.spec.policies.diversity.minority_threshold);
  }

  diversity(): DiversityState {
    const accepted = this.envelopes().filter((e) => e.status === 'accepted' && e.agent !== 'meta-orchestrator');
    const fams = accepted.map((e) => (e.envelope.provenance as { model_family?: string } | undefined)?.model_family);
    const known = [...new Set(fams.filter((f): f is string => !!f))];
    const verified = fams.length > 0 && fams.every((f) => !!f);
    const policy = this.spec.policies.diversity;
    const multi_run: DiversityState['multi_run'] = {};
    for (const a of policy.multi_run_agents) {
      const n = accepted.filter((e) => e.agent === a).length;
      if (n) multi_run[a] = { runs: n, required: policy.runs };
    }
    return { families: known, verified, monoculture: known.length <= 1, families_available: availableFamilies(this.engine.config), multi_run };
  }

  missingCoverage(): Record<string, number> {
    const start = this.start();
    const need = requiredCoverage(this.spec, start.graph);
    const skipped = new Set(this.skipped());
    const accepted = this.envelopes().filter((e) => e.status === 'accepted');
    const out: Record<string, number> = {};
    for (const [agent, n] of Object.entries(need)) {
      if (skipped.has(agent)) continue;
      const have = accepted.filter((e) => e.agent === agent && ((e.envelope.provenance as { run_index?: number } | undefined)?.run_index ?? 0) === 0).length;
      if (have < n) out[agent] = n - have;
    }
    return out;
  }

  blockingReasons(): string[] {
    const reasons: string[] = [];
    if (this.state() !== 'open') reasons.push(`run is ${this.state()}`);
    for (const g of this.gates().filter((x) => x.status === 'open' && x.severity === 'blocking')) reasons.push(`gate ${g.id} is open: ${g.title}`);
    for (const r of this.requirements().filter((x) => !x.satisfied && !x.overridden)) reasons.push(`rule ${r.rule} unmet: needs ${r.agents.join(' or ')} after entry ${r.trigger_seq}`);
    for (const [agent, n] of Object.entries(this.missingCoverage())) reasons.push(`playbook coverage: ${agent} has not produced ${n} accepted output(s); run it or record a human skip`);
    return reasons;
  }

  status(): RunStatus {
    const start = this.start();
    const gates = this.gates();
    const reasons = this.blockingReasons();
    return {
      run_id: this.id,
      problem: start.problem,
      graph: start.graph,
      mode: start.mode,
      state: this.state(),
      plan: start.plan,
      submitted: this.envelopes().map((e) => ({
        seq: e.seq,
        agent: e.agent,
        status: e.status,
        confidence: (e.envelope.confidence as { level?: string } | undefined)?.level,
        family: (e.envelope.provenance as { model_family?: string } | undefined)?.model_family,
      })),
      open_gates: gates.filter((g) => g.status === 'open'),
      closed_gates: gates.filter((g) => g.status === 'closed'),
      requirements: this.requirements(),
      missing_coverage: this.missingCoverage(),
      skipped: this.skipped(),
      diversity: this.diversity(),
      can_synthesize: reasons.length === 0,
      blocking_reasons: reasons,
      log_head: this.log.head(),
    };
  }

  /** Confidence computed by the engine: the weakest critical input, then the caps of the policy. */
  engineConfidence(declared: ConfidenceLevel | undefined): { level: ConfidenceLevel; caps: string[] } {
    const policy = this.spec.policies;
    const calibration = readCalibration(this.engine.memory);
    const caps: string[] = [];
    const inputs: ConfidenceLevel[] = [];
    for (const agent of policy.critical_inputs) {
      const envs = this.envelopes().filter((e) => e.status === 'accepted' && e.agent === agent);
      if (!envs.length) continue;
      let lvl = minConfidence(...envs.map((e) => (e.envelope.confidence as { level?: ConfidenceLevel } | undefined)?.level));
      if (agentReliability(calibration, agent) === 'unreliable') {
        lvl = 'low';
        caps.push(`${agent}: forecasts do not beat the base rate on past outcomes`);
      }
      inputs.push(lvl);
    }
    let level = minConfidence(declared ?? 'high', ...inputs);
    if (inputs.length) caps.push(`weakest critical input: ${minConfidence(...inputs)}`);
    const div = this.diversity();
    if (div.monoculture) {
      const cap = policy.diversity.monoculture_confidence_cap;
      if (CONFIDENCE_ORDER[level] > CONFIDENCE_ORDER[cap]) level = cap;
      caps.push(div.verified ? `single model family (${div.families.join(', ') || 'unknown'}): capped at ${cap}` : `model families not declared in provenance: diversity unverified, capped at ${cap}`);
    }
    if (this.acks().some((a) => a.decision === 'override')) {
      const cap = policy.confidence.cap_on_human_override;
      if (CONFIDENCE_ORDER[level] > CONFIDENCE_ORDER[cap]) level = cap;
      caps.push(`a human override waived a rule requirement: capped at ${cap}`);
    }
    return { level, caps };
  }

  async synthesize(raw: unknown): Promise<SynthesisResult> {
    const envelope = extractEnvelope(raw);
    const reasons: string[] = [];
    if (!envelope) reasons.push('no JSON object found in the synthesis');
    else {
      if (typeof envelope.agent === 'string') envelope.agent = normalizeAgentId(envelope.agent, Object.keys(this.spec.agents));
      if (envelope.agent !== 'meta-orchestrator') reasons.push('only the meta-orchestrator can close the decision (R1)');
      const v = validateEnvelope(envelope);
      if (!v.valid) reasons.push(...v.errors.map((e) => `schema: ${e}`));
    }
    reasons.push(...this.blockingReasons());
    if (reasons.length) {
      if (this.state() === 'open') this.log.append('synthesis_refused', { reasons, envelope_hash: envelope ? hashOf(envelope) : undefined });
      return { run_id: this.id, accepted: false, reasons };
    }
    const main = envelope!.main_output as Record<string, unknown>;
    const declared = ((main.confidence_level as { overall?: ConfidenceLevel } | undefined)?.overall ?? (envelope!.confidence as { level?: ConfidenceLevel }).level) as ConfidenceLevel;
    const { level, caps } = this.engineConfidence(declared);
    const diversity = this.diversity();
    this.log.append('synthesis_accepted', { envelope, envelope_hash: hashOf(envelope), declared_confidence: declared, engine_confidence: level, caps, diversity });
    const record = this.buildMemoryRecord(envelope!, level, diversity);
    this.close('completed', 'synthesis accepted');
    record.log_head = this.log.head();
    await this.engine.memory.save(record);
    return { run_id: this.id, accepted: true, reasons: [], engine_confidence: level, declared_confidence: declared, caps, diversity, memory_id: record.id, log_head: record.log_head };
  }

  private close(status: 'completed' | 'aborted', note: string) {
    this.log.append('run_closed', { status, note });
    const active = path.join(this.engine.runsDir(), 'active');
    if (fs.existsSync(active) && fs.readFileSync(active, 'utf8').trim() === this.id) fs.unlinkSync(active);
  }

  /** Predictions declared by agents, plus those the engine derives from risk maps and scenarios. */
  predictions(): MemoryPrediction[] {
    const map = this.spec.policies.calibration.probability_score_map;
    const out: MemoryPrediction[] = [];
    const seen = new Set<string>();
    for (const e of this.envelopes().filter((x) => x.status === 'accepted')) {
      const prov = (e.envelope.provenance ?? {}) as { model_family?: string; tier?: string; run_index?: number };
      const tier = prov.tier ?? this.spec.agents[e.agent]?.tier;
      const prefix = `${e.agent}-r${prov.run_index ?? 0}-e${e.seq}`;
      const push = (id: string, statement: string, probability: number, resolve_by?: string) => {
        const pid = `${prefix}-${id}`;
        if (seen.has(pid) || !(probability >= 0 && probability <= 1)) return;
        seen.add(pid);
        out.push({ id: pid, agent: e.agent, model_family: prov.model_family, tier, statement, probability, resolve_by, outcome: null, resolved_at: null, note: null });
      };
      const declared = (e.envelope.predictions as { id: string; statement: string; probability: number; resolve_by?: string; source_ref?: string }[] | undefined) ?? [];
      for (const p of declared) push(p.id, p.statement, p.probability, p.resolve_by);
      // A risk or scenario the agent already turned into an explicit prediction is not derived again.
      const covered = new Set(declared.map((p) => p.source_ref).filter(Boolean));
      const main = (e.envelope.main_output ?? {}) as Record<string, unknown>;
      if (e.agent === 'critical-validator') {
        for (const r of (main.risk_map as { id?: string; risk: string; probability: number; severity: number }[] | undefined) ?? []) {
          if (r.id && covered.has(r.id)) continue;
          if (r.severity >= 10 && map[String(r.probability)] !== undefined) push(`risk-${r.id ?? slugify(r.risk, 24)}`, `Risk materialises: ${r.risk}`, map[String(r.probability)]);
        }
      }
      if (e.agent === 'predictive-strategic') {
        for (const s of (main.scenarios as { id: string; name?: string; description?: string; probability?: { point?: number }; time_horizon?: string }[] | undefined) ?? []) {
          if (!covered.has(s.id) && typeof s.probability?.point === 'number') push(`scenario-${s.id}`, `Scenario occurs: ${s.name ?? s.description ?? s.id}`, s.probability.point, s.time_horizon);
        }
      }
    }
    return out;
  }

  private buildMemoryRecord(synth: Record<string, unknown>, engineConfidence: ConfidenceLevel, diversity: DiversityState): MemoryRecord {
    const start = this.start();
    const main = synth.main_output as Record<string, unknown>;
    const decision = (main.decision ?? {}) as { statement?: string; type?: string; conditions?: string[] };
    const typeMap: Record<string, string> = { go: 'go', no_go: 'no_go', conditional_go: 'conditional', defer: 'defer', redesign: 'redesign' };
    const accepted = this.envelopes().filter((e) => e.status === 'accepted');
    const status = this.status();
    return {
      id: this.id,
      version: '3.0',
      run_id: this.id,
      decision_timestamp: new Date().toISOString(),
      problem_statement: start.problem,
      problem_type: start.graph,
      tags: start.tags,
      playbook_used: start.graph,
      hitl_mode: start.mode,
      agents_activated: [...new Set(accepted.map((e) => e.agent))],
      agent_outputs_digest: accepted
        .filter((e) => e.agent !== 'meta-orchestrator')
        .map((e) => ({ agent: e.agent, key_findings_summary: String(e.envelope.summary ?? '').slice(0, 400), confidence: (e.envelope.confidence as { level?: string }).level })),
      mandatory_gates_triggered: status.closed_gates.map((g) => {
        const ack = this.acks().filter((a) => a.rule === g.rule).find((a) => a.gate_id === g.id);
        return { rule: g.rule, trigger: g.title, resolution: ack ? `${ack.decision} (${ack.via})${ack.justification ? ': ' + ack.justification : ''}` : 'closed' };
      }),
      human_interventions: [
        ...this.acks().map((a) => ({ at_step: `gate ${a.gate_id}`, intervention_type: a.decision === 'abort' ? 'abort' : a.decision === 'provide_context' ? 'context_add' : 'correction', summary: a.user_quote ?? a.justification ?? a.decision })),
        ...this.log.all().filter((e) => e.type === 'node_skipped').map((e) => ({ at_step: 'skip', intervention_type: 'redirect', summary: `skipped ${(e.data as { agent: string }).agent}: ${(e.data as { reason: string }).reason}` })),
      ],
      final_decision: { statement: decision.statement ?? '', type: typeMap[decision.type ?? ''] ?? 'defer', conditions: decision.conditions ?? [], confidence: engineConfidence },
      engine_confidence: engineConfidence,
      diversity: { families: diversity.families, monoculture: diversity.monoculture },
      predictions: this.predictions(),
      next_review_date: typeof main.next_review === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(main.next_review) ? main.next_review : undefined,
      retrospective: { status: 'untested', last_updated: null, outcome_vs_prediction: null, what_materialized: null, what_did_not_materialize: null, unexpected_emergents: null, lessons_for_library: null },
    } as MemoryRecord;
  }

  entries(): LogEntry[] {
    return this.log.all();
  }
}
