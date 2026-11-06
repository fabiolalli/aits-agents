import fs from 'node:fs';
import path from 'node:path';
import type { MemoryRecord, MemoryStore } from './memory.ts';

export interface ScoreGroup {
  key: string;
  n: number;
  brier: number;
  /** Brier score of always answering the observed base rate: the bar a forecaster must beat. */
  baseline: number;
  skill: number;
  reliability: { bin: string; n: number; mean_predicted: number; observed: number }[];
  recalibration?: { a: number; b: number };
}

export interface CalibrationReport {
  generated_at: string;
  resolved: number;
  pending: number;
  min_resolved_for_adjustment: number;
  overall?: ScoreGroup;
  by_agent: ScoreGroup[];
  by_family: ScoreGroup[];
  by_tier: ScoreGroup[];
}

type Resolved = { p: number; y: 0 | 1; agent: string; family: string; tier: string };

const clamp = (p: number) => Math.min(0.999, Math.max(0.001, p));
const logit = (p: number) => Math.log(clamp(p) / (1 - clamp(p)));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/** Platt-style recalibration p' = sigmoid(a·logit(p) + b), fitted by gradient descent on log loss. */
function fitRecalibration(items: Resolved[]): { a: number; b: number } {
  let a = 1, b = 0;
  const lr = 0.05;
  for (let it = 0; it < 2000; it++) {
    let ga = 0, gb = 0;
    for (const { p, y } of items) {
      const x = logit(p);
      const q = sigmoid(a * x + b);
      ga += (q - y) * x;
      gb += q - y;
    }
    a -= (lr * ga) / items.length;
    b -= (lr * gb) / items.length;
  }
  return { a: Number(a.toFixed(4)), b: Number(b.toFixed(4)) };
}

function score(key: string, items: Resolved[], minForAdjustment: number): ScoreGroup {
  const n = items.length;
  const brier = items.reduce((s, x) => s + (x.p - x.y) ** 2, 0) / n;
  const rate = items.reduce((s, x) => s + x.y, 0) / n;
  const baseline = rate * (1 - rate);
  const bins = [0, 0.2, 0.4, 0.6, 0.8, 1.0001];
  const reliability = bins.slice(0, -1).map((lo, i) => {
    const hi = bins[i + 1];
    const inBin = items.filter((x) => x.p >= lo && x.p < hi);
    return {
      bin: `${lo.toFixed(1)}-${Math.min(hi, 1).toFixed(1)}`,
      n: inBin.length,
      mean_predicted: inBin.length ? Number((inBin.reduce((s, x) => s + x.p, 0) / inBin.length).toFixed(3)) : 0,
      observed: inBin.length ? Number((inBin.reduce((s, x) => s + x.y, 0) / inBin.length).toFixed(3)) : 0,
    };
  });
  return {
    key,
    n,
    brier: Number(brier.toFixed(4)),
    baseline: Number(baseline.toFixed(4)),
    skill: baseline > 0 ? Number((1 - brier / baseline).toFixed(3)) : 0,
    reliability,
    recalibration: n >= minForAdjustment ? fitRecalibration(items) : undefined,
  };
}

function groupBy(items: Resolved[], key: (r: Resolved) => string, min: number): ScoreGroup[] {
  const groups = new Map<string, Resolved[]>();
  for (const it of items) groups.set(key(it), [...(groups.get(key(it)) ?? []), it]);
  return [...groups.entries()].map(([k, list]) => score(k, list, min)).sort((a, b) => b.n - a.n);
}

export function calibrationReport(records: MemoryRecord[], minForAdjustment: number): CalibrationReport {
  const all = records.flatMap((r) => r.predictions ?? []);
  const resolved: Resolved[] = all
    .filter((p) => p.outcome === 0 || p.outcome === 1)
    .map((p) => ({ p: p.probability, y: p.outcome as 0 | 1, agent: p.agent, family: p.model_family ?? 'unspecified', tier: p.tier ?? 'unspecified' }));
  return {
    generated_at: new Date().toISOString(),
    resolved: resolved.length,
    pending: all.length - resolved.length,
    min_resolved_for_adjustment: minForAdjustment,
    overall: resolved.length ? score('all', resolved, minForAdjustment) : undefined,
    by_agent: groupBy(resolved, (r) => r.agent, minForAdjustment),
    by_family: groupBy(resolved, (r) => r.family, minForAdjustment),
    by_tier: groupBy(resolved, (r) => r.tier, minForAdjustment),
  };
}

export function writeCalibration(store: MemoryStore, minForAdjustment: number): CalibrationReport {
  const report = calibrationReport(store.list(), minForAdjustment);
  fs.writeFileSync(path.join(store.dir, 'calibration.json'), JSON.stringify(report, null, 2));
  return report;
}

export function readCalibration(store: MemoryStore): CalibrationReport | undefined {
  const p = path.join(store.dir, 'calibration.json');
  return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, 'utf8')) as CalibrationReport) : undefined;
}

/** Applies an agent's fitted recalibration, when enough outcomes exist; otherwise returns p unchanged. */
export function recalibrate(report: CalibrationReport | undefined, agent: string, p: number): number {
  const g = report?.by_agent.find((x) => x.key === agent);
  if (!g?.recalibration) return p;
  return Number(sigmoid(g.recalibration.a * logit(p) + g.recalibration.b).toFixed(4));
}

/** An agent whose forecasts do no better than the base rate, on enough outcomes, is marked unreliable. */
export function agentReliability(report: CalibrationReport | undefined, agent: string): 'unknown' | 'reliable' | 'unreliable' {
  const g = report?.by_agent.find((x) => x.key === agent);
  if (!g || g.n < report!.min_resolved_for_adjustment) return 'unknown';
  return g.skill > 0 ? 'reliable' : 'unreliable';
}
