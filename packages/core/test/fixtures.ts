import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function tmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'aits-test-'));
}

type Level = 'high' | 'medium' | 'low';
type Prov = { model_family?: string; model?: string; run_index?: number; tier?: string } | undefined;

let clock = Date.parse('2026-11-06T10:00:00Z');
const ts = () => new Date((clock += 1000)).toISOString();

export function envelope(agent: string, main_output: Record<string, unknown>, opts: { level?: Level; provenance?: Prov; extra?: Record<string, unknown> } = {}) {
  return {
    agent,
    version: '3.0',
    timestamp: ts(),
    confidence: { level: opts.level ?? 'high', reasoning: 'test fixture' },
    summary: `${agent} summary`,
    main_output,
    ...(opts.provenance ? { provenance: { runtime: 'test', tier: 'standard', ...opts.provenance } } : {}),
    ...(opts.extra ?? {}),
  };
}

export const analytical = (opts: { highGap?: boolean; level?: Level; provenance?: Prov } = {}) =>
  envelope(
    'analytical',
    {
      facts: [{ id: 'f1', statement: 'Market grows 12% a year', source_confidence: 'high', source: 'https://example.org' }],
      gaps: [{ id: 'g1', description: 'Churn of the target segment', impact_if_unfilled: opts.highGap ? 'high' : 'medium' }],
      assumptions: [{ id: 'a1', statement: 'Pricing stays stable', testable: true }],
    },
    opts,
  );

export const critical = (opts: { severity?: number; recommendation?: string; level?: Level; provenance?: Prov; risk?: string; driver?: string } = {}) =>
  envelope(
    'critical-validator',
    {
      risk_map: [
        {
          id: 'rk1',
          risk: opts.risk ?? 'Customer acquisition cost exceeds lifetime value',
          category: 'financial',
          driver: opts.driver ?? 'unit_economics',
          probability: 3,
          impact: Math.max(1, Math.ceil((opts.severity ?? 6) / 3)),
          severity: opts.severity ?? 6,
          severity_level: (opts.severity ?? 6) >= 10 ? 'high' : 'medium',
        },
      ],
      overall_risk_level: (opts.severity ?? 6) >= 10 ? 'high' : 'medium',
      recommendation: opts.recommendation ?? 'proceed_with_guardrails',
    },
    opts,
  );

export const optimizer = (opts: { recommendation?: string; level?: Level; provenance?: Prov } = {}) =>
  envelope('optimizer', { business_case: { option_id: 'o1' }, recommendation: opts.recommendation ?? 'proceed_with_sequencing' }, opts);

const dim = { status: 'clear', reasoning: 'fine' };
export const ethical = (opts: { redLine?: boolean; arbitrating?: boolean; level?: Level; provenance?: Prov } = {}) =>
  envelope(
    'ethical-governance',
    {
      dimensional_assessment: { fairness: dim, autonomy: dim, transparency: dim, accountability: dim, non_maleficence: dim, beneficence: dim, dignity: dim },
      red_lines_detected: opts.redLine ? [{ id: 'rl1', red_line: 'Deception of affected parties', dimension: 'transparency', evidence: 'test' }] : [],
      overall_ethical_posture: opts.redLine ? 'red_line' : 'clear',
      ...(opts.arbitrating ? { arbitration_output: { is_arbitrating: true, parties: ['critical-validator', 'optimizer'], decision: 'critical prevails', reasoning: 'test' } } : {}),
    },
    opts,
  );

export const creative = (n: number, opts: { provenance?: Prov } = {}) =>
  envelope('creative-generative', { options: Array.from({ length: n }, (_, i) => ({ id: `o${i + 1}`, title: `Option ${i + 1}`, description: 'An option', novelty_level: 'adjacent' })) }, opts);

export const predictive = (opts: { provenance?: Prov; probs?: [number, number, number]; level?: Level } = {}) => {
  const [a, b, c] = opts.probs ?? [0.5, 0.3, 0.2];
  return envelope(
    'predictive-strategic',
    {
      scenarios: [
        { id: 'sc1', frame: 'baseline', name: 'Steady growth', probability: { point: a }, time_horizon: '12 months' },
        { id: 'sc2', frame: 'pessimistic', name: 'Demand contraction', probability: { point: b }, time_horizon: '12 months' },
        { id: 'sc3', frame: 'competitive_move', name: 'Competitor price cut', probability: { point: c }, time_horizon: '12 months' },
      ],
      robustness_ranking: [{ option_id: 'o1', robustness_level: 'robust' }],
    },
    opts,
  );
};

export const synthesis = (opts: { level?: Level; type?: string } = {}) =>
  envelope(
    'meta-orchestrator',
    {
      integrated_synthesis: 'All perspectives considered.',
      decision: { statement: 'Launch in two stages with a churn checkpoint', type: opts.type ?? 'conditional_go', conditions: ['Churn below 5% after 90 days'] },
      action_plan: [{ action: 'Run the pilot', owner: 'Product' }],
      decision_log: [{ step: 1, agent: 'analytical', key_output_summary: 'facts' }],
      confidence_level: { overall: opts.level ?? 'high' },
      hitl_summary: { mode_used: 'supervised' },
    },
    opts,
  );
