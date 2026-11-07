import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { Engine, normalizeAgentId, exportRun, generateSigningKey, getSpec, loadSigner, planGraph, readLog, validateEnvelope, verifyLog, aggregateRuns, calibrationReport, matchPatterns, toOtlp } from '../src/index.ts';
import { analytical, critical, creative, ethical, optimizer, predictive, synthesis, tmpDir, envelope } from './fixtures.ts';

describe('agent names', () => {
  it('maps runtime names to spec ids and leaves unknown names alone', () => {
    const known = Object.keys(getSpec().agents);
    for (const n of ['aits:aits-analytical', 'aits-analytical', 'analytical-agent', 'Analytical', 'analytical']) expect(normalizeAgentId(n, known)).toBe('analytical');
    expect(normalizeAgentId('aits:aits-meta-orchestrator', known)).toBe('meta-orchestrator');
    expect(normalizeAgentId('finance-bot', known)).toBe('finance-bot');
  });
});

describe('runtime and orchestrator copies of one output', () => {
  it('counts one attempt once, even when the orchestrator rewrites it', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Copies', graph: 'quick' });
    const run = engine.open(run_id);
    const bad = { ...analytical(), gaps_or_assumptions: [] };
    expect(run.submit(bad, { source: 'runtime' }).status).toBe('invalid');
    expect(run.submit(bad, { source: 'runtime' }).seq).toBe(1);
    const rewritten = run.submit({ ...bad, summary: 'shortened by the orchestrator' });
    expect(rewritten.status).toBe('invalid');
    expect(rewritten.seq).toBe(1);
    expect(rewritten.next.join(' ')).toMatch(/one of record/);
    expect(run.gates().filter((g) => g.rule === 'R7')).toHaveLength(0);
    run.submit({ ...bad, summary: 'second attempt, still wrong' }, { source: 'runtime' });
    expect(run.gates().filter((g) => g.rule === 'R7')).toHaveLength(1);
    const good = analytical();
    run.submit(good, { source: 'runtime' });
    const copy = run.submit({ ...good, provenance: { runtime: 'x', model_family: 'fam-a' } });
    expect(copy.status).toBe('accepted');
    expect(copy.next[0]).toMatch(/only adds provenance/);
    expect(run.submit({ ...good, provenance: { runtime: 'x', model_family: 'fam-a' } }).status).toBe('duplicate');
    expect(run.status().submitted.filter((x) => x.status === 'accepted')).toHaveLength(1);
  });
});

describe('schema validation', () => {
  it('accepts a valid envelope and a 2.0 envelope', () => {
    expect(validateEnvelope(analytical()).valid).toBe(true);
    expect(validateEnvelope({ ...analytical(), version: '2.0' }).valid).toBe(true);
  });
  it('reports precise errors', () => {
    const bad = critical();
    (bad.main_output as { risk_map: { severity: number }[] }).risk_map[0].severity = 40;
    const r = validateEnvelope(bad);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/severity/);
  });
});

describe('decision log', () => {
  it('detects tampering and verifies signatures', () => {
    const dir = tmpDir();
    process.env.AITS_KEY_DIR = path.join(dir, 'keys');
    const key = generateSigningKey();
    fs.writeFileSync(path.join(dir, 'aits.config.yaml'), `signing:\n  key: ${key.privatePath}\n`);
    const engine = new Engine(dir);
    return engine.start({ problem: 'Should we launch product X?', graph: 'quick' }).then(({ run_id }) => {
      const run = engine.open(run_id);
      run.submit(analytical());
      const pub = loadSigner(key.privatePath).publicKeyPem;
      const ok = verifyLog(readLog(run.log.file), { [key.keyId]: pub });
      expect(ok.ok).toBe(true);
      expect(ok.signed).toBe(2);
      const lines = fs.readFileSync(run.log.file, 'utf8').trim().split('\n');
      const tampered = JSON.parse(lines[1]);
      tampered.data.status = 'rejected';
      lines[1] = JSON.stringify(tampered);
      fs.writeFileSync(run.log.file, lines.join('\n') + '\n');
      const bad = verifyLog(readLog(run.log.file), { [key.keyId]: pub });
      expect(bad.ok).toBe(false);
      expect(bad.problems.join(' ')).toMatch(/modified/);
    });
  });
});

describe('rules and gates', () => {
  it('R3: high risk blocks the synthesis until a human answers and Ethical runs', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Should we launch product X in Q2?', graph: 'quick' });
    const run = engine.open(run_id);
    expect(run.submit(analytical()).status).toBe('accepted');
    const r = run.submit(critical({ severity: 12 }));
    expect(r.open_gates.map((g) => g.id)).toContain('R3#1');
    expect(r.unmet_requirements.map((x) => x.rule)).toContain('R3');
    run.submit(optimizer());

    const refused = await run.synthesize(synthesis());
    expect(refused.accepted).toBe(false);
    expect(refused.reasons.join(' ')).toMatch(/gate R3#1/);

    expect(() => run.respondToGate('R3#1', 'proceed', 'agent_relayed')).toThrow(/own words/);
    run.respondToGate('R3#1', 'proceed', 'agent_relayed', { user_quote: 'Go ahead, but check the ethics' });
    const stillRefused = await run.synthesize(synthesis());
    expect(stillRefused.reasons.join(' ')).toMatch(/rule R3 unmet/);

    run.submit(ethical());
    const ok = await run.synthesize(synthesis({ level: 'high' }));
    expect(ok.accepted).toBe(true);
    expect(ok.engine_confidence).toBe('medium');
    expect(ok.caps!.join(' ')).toMatch(/diversity unverified/);
    expect(run.state()).toBe('completed');
    const rec = engine.memory.get(run_id)!;
    expect(rec.final_decision.type).toBe('conditional');
    expect(rec.predictions!.some((p) => p.statement.startsWith('Risk materialises'))).toBe(true);
    expect(engine.activeRunId()).toBeUndefined();
  });

  it('R1: an agent other than the orchestrator cannot carry a decision', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Test', graph: 'quick' });
    const run = engine.open(run_id);
    const env = analytical();
    (env.main_output as Record<string, unknown>).decision = { statement: 'go', type: 'go' };
    const r = run.submit(env);
    expect(r.status).toBe('rejected');
    expect(r.rejected_by).toEqual(['R1']);
    expect(r.open_gates.map((g) => g.rule)).toContain('R1');
  });

  it('R7: a second schema failure opens a gate', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Test', graph: 'quick' });
    const run = engine.open(run_id);
    const bad = { ...critical(), main_output: { overall_risk_level: 'high' } };
    expect(run.submit(bad).open_gates.length).toBe(0);
    const second = run.submit({ ...bad, timestamp: new Date().toISOString() });
    expect(second.open_gates.map((g) => g.rule)).toContain('R7');
  });

  it('R4: contradiction requires an arbitrating Ethical output', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Test', graph: 'quick' });
    const run = engine.open(run_id);
    run.submit(analytical());
    run.submit(critical({ recommendation: 'do_not_proceed' }));
    const r = run.submit(optimizer({ recommendation: 'proceed_as_designed' }));
    expect(r.unmet_requirements.map((x) => x.rule)).toContain('R4');
    run.submit(ethical());
    expect(run.requirements().find((x) => x.rule === 'R4')!.satisfied).toBe(false);
    run.submit(ethical({ arbitrating: true }));
    expect(run.requirements().find((x) => x.rule === 'R4')!.satisfied).toBe(true);
  });

  it('R6 and override: a red line needs a human, an override caps confidence', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Test', graph: 'diverge' });
    const run = engine.open(run_id);
    run.submit(creative(5, { provenance: { model_family: 'fam-a' } }));
    const r = run.submit(envelope('emotional-intuitive', { stakeholder_maps: [{ group: 'Staff', emotional_signature: { deep_driver: 'safety' }, intensity: { current: 4 } }] }, { provenance: { model_family: 'fam-b' } }));
    expect(r.unmet_requirements.map((x) => x.rule)).toContain('R5');
    expect(run.status().open_gates.map((g) => g.severity)).toEqual(['advisory']);
    expect(() => run.respondToGate('R5#1', 'override', 'cli')).toThrow(/justification/);
    run.respondToGate('R5#1', 'override', 'cli', { justification: 'Options are variations of one idea' });
    const ok = await run.synthesize(synthesis());
    expect(ok.accepted).toBe(true);
    expect(ok.engine_confidence).toBe('medium');
    expect(ok.caps!.join(' ')).toMatch(/override/);
    expect(ok.diversity!.monoculture).toBe(false);
  });

  it('coverage: a missing playbook agent blocks until a human skips it', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Test', graph: 'quick' });
    const run = engine.open(run_id);
    run.submit(analytical());
    run.submit(critical());
    expect((await run.synthesize(synthesis())).reasons.join(' ')).toMatch(/optimizer/);
    run.skip('optimizer', 'No financial dimension', 'cli');
    expect((await run.synthesize(synthesis())).accepted).toBe(true);
  });

  it('abort closes the run', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Test', graph: 'quick' });
    const run = engine.open(run_id);
    run.submit(analytical({ highGap: true }));
    run.respondToGate('R2a#1', 'abort', 'cli', { justification: 'Not enough data' });
    expect(run.state()).toBe('aborted');
    expect(() => run.submit(critical())).toThrow(/aborted/);
  });
});

describe('aggregation', () => {
  it('keeps minority positions instead of dropping them', () => {
    const view = aggregateRuns('critical-validator', [
      critical({ severity: 12, recommendation: 'pause_and_reconsider', provenance: { model_family: 'fam-a', run_index: 0 } }),
      critical({ severity: 15, recommendation: 'pause_and_reconsider', provenance: { model_family: 'fam-b', run_index: 1 } }),
      critical({ severity: 6, recommendation: 'proceed', risk: 'Key engineer leaves during the migration', driver: 'capacity_gap', provenance: { model_family: 'fam-c', run_index: 2 } }),
    ]);
    expect(view.runs).toBe(3);
    expect(view.families).toHaveLength(3);
    expect(view.consensus.recommendation).toBe('pause_and_reconsider');
    expect(view.minority_report.map((m) => m.kind)).toEqual(expect.arrayContaining(['recommendation', 'risk']));
    const risks = view.consensus.risks as { severity_median: number }[];
    expect(risks[0].severity_median).toBe(13.5);
  });
});

describe('graphs', () => {
  it('plans parallel waves from handoff dependencies', () => {
    const plan = planGraph(getSpec(), 'full', ['systemic']);
    expect(plan.waves[0].map((n) => n.agent)).toEqual(['analytical']);
    expect(plan.waves[1].map((n) => n.agent).sort()).toEqual(['creative-generative', 'emotional-intuitive', 'systemic']);
    expect(plan.waves.flat().find((n) => n.agent === 'critical-validator')!.multi_run).toBe(3);
    for (const id of Object.keys(getSpec().graphs)) expect(() => planGraph(getSpec(), id)).not.toThrow();
  });
});

describe('memory, patterns and calibration', () => {
  it('recalls similar decisions across languages of wording and scores outcomes', async () => {
    const engine = new Engine(tmpDir());
    for (const problem of ['Ristrutturazione: tagliare il 20% del personale per adottare AI', 'Lancio del nuovo prodotto SaaS in Germania', 'Ristrutturazione del personale nella divisione retail']) {
      const { run_id } = await engine.start({ problem, graph: 'quick' });
      const run = engine.open(run_id);
      run.submit(analytical());
      run.submit(critical());
      run.submit(optimizer());
      run.submit(predictive());
      expect((await run.synthesize(synthesis())).accepted).toBe(true);
    }
    const hits = await engine.memory.recall('ristrutturazione del personale', 2);
    expect(hits[0].problem).toMatch(/Ristrutturazione/);
    expect(matchPatterns(getSpec(), 'Valutiamo una ristrutturazione con esuberi').map((m) => m.id)).toContain('restructuring-survivor-syndrome');

    const rec = engine.memory.list()[0];
    const pred = rec.predictions!.find((p) => p.agent === 'predictive-strategic')!;
    engine.memory.recordOutcome(rec.id, pred.id, 1, 'happened');
    const report = calibrationReport(engine.memory.list(), 20);
    expect(report.resolved).toBe(1);
    expect(report.by_agent[0].key).toBe('predictive-strategic');
  });
});

describe('export', () => {
  it('produces a report, a verifiable log and an OTLP trace', async () => {
    const engine = new Engine(tmpDir());
    const { run_id } = await engine.start({ problem: 'Should we launch product X?', graph: 'quick' });
    const run = engine.open(run_id);
    run.submit(analytical({ provenance: { model_family: 'fam-a' } }));
    run.submit(critical({ provenance: { model_family: 'fam-b' } }));
    run.submit(optimizer({ provenance: { model_family: 'fam-a' } }));
    await run.synthesize(synthesis({ level: 'medium' }));
    const out = exportRun(run);
    expect(out.verification.ok).toBe(true);
    expect(out.files).toEqual(expect.arrayContaining(['report.md', 'log.jsonl', 'trace.otlp.json', 'envelopes.json', 'verification.json']));
    const report = fs.readFileSync(path.join(out.dir, 'report.md'), 'utf8');
    expect(report).toMatch(/Confidence computed by the engine \| \*\*medium\*\*/);
    const otlp = toOtlp(run) as { resourceSpans: { scopeSpans: { spans: { name: string }[] }[] }[] };
    const names = otlp.resourceSpans[0].scopeSpans[0].spans.map((s) => s.name);
    expect(names[0]).toBe('invoke_workflow aits.quick');
    expect(names).toContain('invoke_agent critical-validator');
  });
});

describe('neutrality', () => {
  it('the spec names no model or vendor', () => {
    const banned = /\b(claude|anthropic|openai|gpt-?\d|gemini|google|mistral|llama|opus|sonnet|haiku|fable|mythos)\b/i;
    for (const [file, text] of Object.entries(getSpec().files)) {
      const hit = text.match(banned);
      expect(hit ? `${file}: ${hit[0]}` : null).toBeNull();
    }
  });
});
