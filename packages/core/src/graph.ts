import type { GraphSpec, Spec } from './spec.ts';

export interface PlannedNode {
  node: string;
  agent: string;
  optional: boolean;
  required_by: string[];
  multi_run: number;
  note?: string;
}

export interface Plan {
  graph: string;
  title: string;
  waves: PlannedNode[][];
}

/**
 * Turns a playbook graph into waves: every node in a wave depends only on earlier waves,
 * so the nodes of a wave can run in parallel. Optional nodes are planned only when included.
 */
export function planGraph(spec: Spec, graphId: string, include: string[] = []): Plan {
  const graph: GraphSpec | undefined = spec.graphs[graphId];
  if (!graph) throw new Error(`unknown graph "${graphId}". Available: ${Object.keys(spec.graphs).sort().join(', ')}`);
  const active = graph.nodes.filter((n) => !n.optional || include.includes(n.id) || include.includes(n.agent ?? n.id));
  const ids = new Set(active.map((n) => n.id));
  const deps = new Map(active.map((n) => [n.id, (n.after ?? []).filter((d) => ids.has(d))]));
  const level = new Map<string, number>();
  const visiting = new Set<string>();
  const depth = (id: string): number => {
    if (level.has(id)) return level.get(id)!;
    if (visiting.has(id)) throw new Error(`cycle in graph ${graphId} at ${id}`);
    visiting.add(id);
    const d = Math.max(-1, ...(deps.get(id) ?? []).map(depth)) + 1;
    visiting.delete(id);
    level.set(id, d);
    return d;
  };
  active.forEach((n) => depth(n.id));
  const waves: PlannedNode[][] = [];
  const multi = spec.policies.diversity;
  for (const n of active) {
    const agent = n.agent ?? n.id;
    const l = level.get(n.id)!;
    (waves[l] ??= []).push({
      node: n.id,
      agent,
      optional: !!n.optional,
      required_by: n.required_by ? (Array.isArray(n.required_by) ? n.required_by : [n.required_by]) : [],
      multi_run: multi.multi_run_agents.includes(agent) ? multi.runs : 1,
      note: n.note,
    });
  }
  return { graph: graph.id, title: graph.title, waves };
}

/** Agents the graph requires unconditionally, with how many distinct outputs each must produce. */
export function requiredCoverage(spec: Spec, graphId: string): Record<string, number> {
  const graph = spec.graphs[graphId];
  const out: Record<string, number> = {};
  for (const n of graph?.nodes ?? []) {
    if (n.optional || n.required_by) continue;
    const agent = n.agent ?? n.id;
    out[agent] = (out[agent] ?? 0) + 1;
  }
  return out;
}
