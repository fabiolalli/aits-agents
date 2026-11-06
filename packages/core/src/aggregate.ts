import { median } from './util.ts';

type Env = Record<string, unknown>;
type Obj = Record<string, unknown>;

export interface MinorityPosition {
  kind: string;
  position: string;
  held_by_runs: number;
  of_runs: number;
  detail?: unknown;
}

export interface AggregatedView {
  agent: string;
  runs: number;
  families: string[];
  consensus: Record<string, unknown>;
  minority_report: MinorityPosition[];
  aggregated_predictions: { id: string; statement: string; probability: number; range: [number, number]; runs: number }[];
  note: string;
}

const tokens = (s: string) => new Set(s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 3));
function similar(a: string, b: string): boolean {
  const ta = tokens(a), tb = tokens(b);
  if (!ta.size || !tb.size) return false;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / Math.min(ta.size, tb.size) >= 0.5;
}

/** Groups items from different runs that describe the same thing (same key, or similar text). */
function cluster<T>(items: { run: number; item: T }[], key: (t: T) => string, text: (t: T) => string) {
  const clusters: { key: string; label: string; members: { run: number; item: T }[] }[] = [];
  for (const it of items) {
    const k = key(it.item);
    const found = clusters.find((c) => (k && c.key === k) || similar(c.label, text(it.item)));
    if (found) found.members.push(it);
    else clusters.push({ key: k, label: text(it.item), members: [it] });
  }
  return clusters;
}

function distribution(values: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) out[v] = (out[v] ?? 0) + 1;
  return out;
}

function majority(dist: Record<string, number>): string | undefined {
  return Object.entries(dist).sort((a, b) => b[1] - a[1])[0]?.[0];
}

/**
 * Combines independent runs of the same agent without letting them debate:
 * numbers are aggregated by median, positions by count, and every position held by
 * fewer than `threshold` of the runs goes to the minority report instead of disappearing.
 */
export function aggregateRuns(agent: string, envelopes: Env[], threshold = 0.5): AggregatedView {
  const runs = envelopes.length;
  const families = [...new Set(envelopes.map((e) => ((e.provenance as Obj | undefined)?.model_family as string) ?? 'unspecified'))];
  const consensus: Record<string, unknown> = {};
  const minority: MinorityPosition[] = [];
  const share = (n: number) => n / Math.max(runs, 1);
  const main = (e: Env) => (e.main_output ?? {}) as Obj;

  const confidences = envelopes.map((e) => ((e.confidence as Obj | undefined)?.level as string) ?? 'unknown');
  consensus.confidence_distribution = distribution(confidences);

  const recs = envelopes.map((e) => main(e).recommendation as string | undefined).filter(Boolean) as string[];
  if (recs.length) {
    const dist = distribution(recs);
    consensus.recommendation = majority(dist);
    consensus.recommendation_distribution = dist;
    for (const [r, n] of Object.entries(dist)) if (runs > 1 && share(n) < threshold) minority.push({ kind: 'recommendation', position: r, held_by_runs: n, of_runs: runs });
  }

  if (agent === 'critical-validator') {
    const levels = envelopes.map((e) => main(e).overall_risk_level as string).filter(Boolean);
    consensus.overall_risk_level = majority(distribution(levels));
    consensus.overall_risk_level_distribution = distribution(levels);
    const items = envelopes.flatMap((e, run) => ((main(e).risk_map as Obj[]) ?? []).map((item) => ({ run, item })));
    const clusters = cluster(items, (r) => (r.category && r.driver ? `${r.category}|${r.driver}` : ''), (r) => String(r.risk ?? ''));
    consensus.risks = clusters
      .map((c) => {
        const runsHolding = new Set(c.members.map((m) => m.run)).size;
        const sev = c.members.map((m) => m.item.severity as number).filter((v) => typeof v === 'number');
        const entry = {
          risk: c.label,
          category: c.members[0].item.category,
          driver: c.members[0].item.driver,
          held_by_runs: runsHolding,
          severity_median: sev.length ? median(sev) : undefined,
          severity_range: sev.length ? [Math.min(...sev), Math.max(...sev)] : undefined,
        };
        if (runs > 1 && share(runsHolding) < threshold) minority.push({ kind: 'risk', position: c.label, held_by_runs: runsHolding, of_runs: runs, detail: entry });
        return entry;
      })
      .filter((r) => runs === 1 || share(r.held_by_runs) >= threshold)
      .sort((a, b) => (b.severity_median ?? 0) - (a.severity_median ?? 0));
  }

  if (agent === 'predictive-strategic') {
    const items = envelopes.flatMap((e, run) => ((main(e).scenarios as Obj[]) ?? []).map((item) => ({ run, item })));
    const clusters = cluster(items, (s) => String(s.frame ?? ''), (s) => String(s.name ?? s.description ?? ''));
    consensus.scenarios = clusters.map((c) => {
      const runsHolding = new Set(c.members.map((m) => m.run)).size;
      const probs = c.members.map((m) => (m.item.probability as Obj | undefined)?.point as number).filter((v) => typeof v === 'number');
      const entry = { frame: c.key || undefined, name: c.label, held_by_runs: runsHolding, probability_median: probs.length ? median(probs) : undefined, probability_range: probs.length ? [Math.min(...probs), Math.max(...probs)] : undefined };
      if (runs > 1 && share(runsHolding) < threshold) minority.push({ kind: 'scenario', position: c.label, held_by_runs: runsHolding, of_runs: runs, detail: entry });
      return entry;
    });
    const postures = envelopes.map((e) => ((main(e).strategic_posture_recommendation as Obj | undefined)?.posture as string)).filter(Boolean);
    if (postures.length) {
      const dist = distribution(postures);
      consensus.strategic_posture = majority(dist);
      consensus.strategic_posture_distribution = dist;
      for (const [p, n] of Object.entries(dist)) if (runs > 1 && share(n) < threshold) minority.push({ kind: 'strategic_posture', position: p, held_by_runs: n, of_runs: runs });
    }
  }

  if (agent === 'foresight') {
    const picks = envelopes.map((e) => ((main(e).strategic_recommendation as Obj | undefined)?.recommended_option as string)).filter(Boolean);
    if (picks.length) {
      const dist = distribution(picks);
      consensus.recommended_option = majority(dist);
      consensus.recommended_option_distribution = dist;
      for (const [p, n] of Object.entries(dist)) if (runs > 1 && share(n) < threshold) minority.push({ kind: 'recommended_option', position: p, held_by_runs: n, of_runs: runs });
    }
    const rob = envelopes.flatMap((e) => ((main(e).robustness_ranking as Obj[]) ?? []).map((r) => [r.option_id as string, r.robustness_level as string] as const));
    const byOption: Record<string, Record<string, number>> = {};
    for (const [opt, level] of rob) byOption[opt] = { ...(byOption[opt] ?? {}), [level]: (byOption[opt]?.[level] ?? 0) + 1 };
    consensus.robustness_by_option = byOption;
  }

  const preds = envelopes.flatMap((e, run) => ((e.predictions as Obj[]) ?? []).map((item) => ({ run, item })));
  const predClusters = cluster(preds, (p) => String(p.source_ref ?? ''), (p) => String(p.statement ?? ''));
  const aggregated_predictions = predClusters.map((c, i) => {
    const probs = c.members.map((m) => m.item.probability as number).filter((v) => typeof v === 'number');
    return {
      id: String(c.members[0].item.id ?? `p${i + 1}`),
      statement: c.label,
      probability: median(probs),
      range: [Math.min(...probs), Math.max(...probs)] as [number, number],
      runs: new Set(c.members.map((m) => m.run)).size,
    };
  });

  const note =
    runs <= 1
      ? 'Single run: no aggregation was possible and no minority positions can be detected.'
      : families.length <= 1
        ? `${runs} runs from a single model family: errors are likely correlated across runs.`
        : `${runs} runs across ${families.length} model families.`;

  return { agent, runs, families, consensus, minority_report: minority, aggregated_predictions, note };
}
