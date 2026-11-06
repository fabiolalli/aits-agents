import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { SPEC_FILES } from './spec-files.generated.ts';
import { parseFrontmatter } from './util.ts';

export type Tier = 'deep' | 'standard' | 'fast';

export interface AgentSpec {
  id: string;
  description: string;
  tier: Tier;
  color: string;
  capabilities: string[];
  body: string;
}

export interface Selector {
  agent?: string | string[];
  agent_not?: string[];
  path: string;
  op: 'exists' | 'truthy' | 'eq' | 'in' | 'gte' | 'lte' | 'count_gte';
  value?: unknown;
}

export interface RuleSpec {
  id: string;
  title: string;
  when: { any?: Selector[]; all?: Selector[] };
  reject?: boolean;
  gate?: 'blocking' | 'advisory';
  require?: { agents: string[]; mode?: 'any' | 'all'; where?: Selector };
}

export interface GraphNode {
  id: string;
  agent?: string;
  after?: string[];
  optional?: boolean;
  required_by?: string | string[];
  note?: string;
}

export interface GraphSpec {
  id: string;
  title: string;
  description?: string;
  nodes: GraphNode[];
}

export interface PatternSpec {
  id: string;
  keywords: string[];
  recommended_playbook?: string;
  section: string;
}

export interface Policies {
  version: string;
  tiers: Record<Tier, { description: string; min_context_tokens: number }>;
  critical_inputs: string[];
  diversity: {
    multi_run_agents: string[];
    runs: number;
    distinct_family_pairs: [string, string][];
    minority_threshold: number;
    monoculture_confidence_cap: 'high' | 'medium' | 'low';
  };
  validation: { max_failures_per_agent: number };
  calibration: { min_resolved_for_adjustment: number; probability_score_map: Record<string, number> };
  confidence: { cap_on_human_override: 'high' | 'medium' | 'low'; cap_on_unresolved_advisory: 'high' | 'medium' | 'low' };
}

export interface Spec {
  files: Record<string, string>;
  policies: Policies;
  rules: RuleSpec[];
  agents: Record<string, AgentSpec>;
  graphs: Record<string, GraphSpec>;
  schemas: Record<string, object>;
  patterns: PatternSpec[];
}

let cached: Spec | undefined;

/** Loads the specification embedded at build time, or from a directory when AITS_SPEC_DIR is set. */
export function getSpec(): Spec {
  if (cached) return cached;
  const dir = process.env.AITS_SPEC_DIR;
  cached = buildSpec(dir ? readSpecDir(dir) : SPEC_FILES);
  return cached;
}

export function readSpecDir(dir: string): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (d: string) => {
    for (const name of fs.readdirSync(d).sort()) {
      const full = path.join(d, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else files[path.relative(dir, full).split(path.sep).join('/')] = fs.readFileSync(full, 'utf8');
    }
  };
  walk(dir);
  return files;
}

export function buildSpec(files: Record<string, string>): Spec {
  const policies = YAML.parse(files['aits.spec.yaml']) as Policies;
  const rules = (YAML.parse(files['rules.yaml']) as { rules: RuleSpec[] }).rules;
  const agents: Record<string, AgentSpec> = {};
  const graphs: Record<string, GraphSpec> = {};
  const schemas: Record<string, object> = {};
  for (const [name, text] of Object.entries(files)) {
    if (name.startsWith('agents/') && name.endsWith('.md')) {
      const { data, body } = parseFrontmatter(text);
      const id = String(data.id);
      agents[id] = {
        id,
        description: String(data.description ?? ''),
        tier: data.tier as Tier,
        color: String(data.color ?? ''),
        capabilities: (data.capabilities as string[]) ?? [],
        body,
      };
    } else if (name.startsWith('graphs/') && name.endsWith('.yaml')) {
      const g = YAML.parse(text) as GraphSpec;
      graphs[g.id] = g;
    } else if (name.startsWith('schemas/') && name.endsWith('.json')) {
      schemas[name.slice('schemas/'.length)] = JSON.parse(text);
    }
  }
  const patterns = parsePatterns(files['references/pattern-library.md'] ?? '');
  return { files, policies, rules, agents, graphs, schemas, patterns };
}

function parsePatterns(md: string): PatternSpec[] {
  const out: PatternSpec[] = [];
  const parts = md.split(/\n### /).slice(1);
  for (const part of parts) {
    const id = part.split('\n')[0].trim();
    if (!/^[a-z0-9-]+$/.test(id)) continue;
    const keywords: string[] = [];
    const sig = part.match(/\*\*problem_signature\*\*: keywords = (\[[^\]]*\])/);
    if (sig) keywords.push(...(JSON.parse(sig[1]) as string[]));
    const it = part.match(/\*\*keywords_it\*\*: (\[[^\]]*\])/);
    if (it) keywords.push(...(JSON.parse(it[1]) as string[]));
    const pb = part.match(/\*\*recommended_playbook\*\*: `([a-z-]+)`/);
    out.push({ id, keywords, recommended_playbook: pb?.[1], section: '### ' + part.split('\n---')[0].trim() });
  }
  return out;
}

/** Ranks pattern-library archetypes by keyword hits in the problem statement. */
export function matchPatterns(spec: Spec, problem: string): { id: string; score: number; hits: string[]; recommended_playbook?: string }[] {
  const text = problem.toLowerCase();
  return spec.patterns
    .map((p) => {
      const hits = p.keywords.filter((k) => text.includes(k.toLowerCase()));
      return { id: p.id, score: Math.min(1, hits.length / 2), hits, recommended_playbook: p.recommended_playbook };
    })
    .filter((m) => m.hits.length > 0)
    .sort((a, b) => b.score - a.score);
}
