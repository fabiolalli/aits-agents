import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { AitsConfig } from './config.ts';
import { validateMemoryRecord } from './validate.ts';

export interface Embedder {
  id: string;
  embed(texts: string[]): Promise<number[][]>;
}

const DIM = 1024;

function normalizeToken(t: string): string {
  // Light, language-agnostic stemming: keeps the first 6 characters, which merges most
  // Italian and English inflections (ristrutturazione / ristrutturare, launch / launching).
  return t.length > 6 ? t.slice(0, 6) : t;
}

/** Local, deterministic embedder (feature hashing of words and word pairs). No network, no model. */
export class HashingEmbedder implements Embedder {
  id = `hashing-v1-${DIM}`;
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      const v = new Array<number>(DIM).fill(0);
      const words = text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3).map(normalizeToken);
      const feats = [...words, ...words.slice(1).map((w, i) => `${words[i]}_${w}`)];
      const counts = new Map<string, number>();
      for (const f of feats) counts.set(f, (counts.get(f) ?? 0) + 1);
      for (const [f, c] of counts) {
        const h = createHash('md5').update(f).digest();
        const idx = h.readUInt32BE(0) % DIM;
        const sign = h[4] & 1 ? 1 : -1;
        v[idx] += sign * (1 + Math.log(c));
      }
      const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
      return v.map((x) => x / norm);
    });
  }
}

/** Any OpenAI-compatible /embeddings endpoint, local or remote, chosen by the user. */
export class HttpEmbedder implements Embedder {
  id: string;
  constructor(private cfg: { url: string; model?: string; api_key_env?: string }) {
    this.id = `http:${cfg.url}:${cfg.model ?? 'default'}`;
  }
  async embed(texts: string[]): Promise<number[][]> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    const key = this.cfg.api_key_env ? process.env[this.cfg.api_key_env] : undefined;
    if (key) headers.authorization = `Bearer ${key}`;
    const res = await fetch(this.cfg.url, { method: 'POST', headers, body: JSON.stringify({ input: texts, model: this.cfg.model }) });
    if (!res.ok) throw new Error(`embedding endpoint answered ${res.status}`);
    const body = (await res.json()) as { data: { embedding: number[] }[] };
    return body.data.map((d) => d.embedding);
  }
}

export function embedderFor(config: AitsConfig): Embedder {
  if (config.memory.embedder === 'http' && config.memory.http?.url) return new HttpEmbedder(config.memory.http);
  return new HashingEmbedder();
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export interface MemoryPrediction {
  id: string;
  agent: string;
  model_family?: string;
  tier?: string;
  statement: string;
  probability: number;
  resolve_by?: string;
  outcome?: 0 | 1 | null;
  resolved_at?: string | null;
  note?: string | null;
}

export interface MemoryRecord {
  id: string;
  version: '3.0';
  run_id?: string;
  decision_timestamp: string;
  problem_statement: string;
  problem_type?: string;
  tags?: string[];
  pattern_matched?: { pattern_id: string; confidence: number };
  playbook_used?: string;
  hitl_mode?: string;
  agents_activated?: string[];
  final_decision: { statement: string; type: string; conditions?: string[]; confidence?: string };
  engine_confidence?: string;
  diversity?: { families: string[]; monoculture: boolean };
  predictions?: MemoryPrediction[];
  log_head?: string;
  next_review_date?: string;
  [k: string]: unknown;
}

export interface PatternCandidate {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  members: string[];
  top_terms: string[];
  centroid: number[];
  created_at: string;
}

export const MEMORY_BUNDLE_FORMAT = 'aits-memory-bundle';

/** Portable copy of a memory, to carry decisions and outcomes between machines and sessions. */
export interface MemoryBundle {
  format: typeof MEMORY_BUNDLE_FORMAT;
  bundle_version: 1;
  engine_version: string;
  exported_at: string;
  records: MemoryRecord[];
  patterns: Omit<PatternCandidate, 'centroid'>[];
}

export interface MemoryImportResult {
  added: string[];
  updated: string[];
  unchanged: string[];
  invalid: { id: string; errors: string[] }[];
  conflicts: { id: string; prediction: string; local: 0 | 1; incoming: 0 | 1 }[];
  patterns_added: number;
}

interface VectorFile {
  embedder: string;
  vectors: Record<string, number[]>;
}

export function textForRecord(r: MemoryRecord): string {
  return [r.problem_statement, (r.tags ?? []).join(' '), r.playbook_used ?? '', r.final_decision?.statement ?? ''].join('\n');
}

export class MemoryStore {
  readonly dir: string;
  constructor(storageDir: string, private embedder: Embedder, private redact: string[] = []) {
    this.dir = path.join(storageDir, 'memory');
    fs.mkdirSync(path.join(this.dir, 'records'), { recursive: true });
  }

  private applyRedaction(text: string): string {
    return this.redact.reduce((t, pattern) => t.replace(new RegExp(pattern, 'gi'), '[REDACTED]'), text);
  }

  private vectorsFile(): VectorFile {
    const p = path.join(this.dir, 'vectors.json');
    if (!fs.existsSync(p)) return { embedder: this.embedder.id, vectors: {} };
    return JSON.parse(fs.readFileSync(p, 'utf8')) as VectorFile;
  }

  private writeVectors(v: VectorFile) {
    fs.writeFileSync(path.join(this.dir, 'vectors.json'), JSON.stringify(v));
  }

  list(): MemoryRecord[] {
    const d = path.join(this.dir, 'records');
    return fs
      .readdirSync(d)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) as MemoryRecord);
  }

  get(id: string): MemoryRecord | undefined {
    const p = path.join(this.dir, 'records', `${id}.json`);
    return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, 'utf8')) as MemoryRecord) : undefined;
  }

  async save(record: MemoryRecord): Promise<MemoryRecord> {
    const r: MemoryRecord = JSON.parse(JSON.stringify({ ...record, problem_statement: this.applyRedaction(record.problem_statement) }));
    if (r.final_decision?.statement) r.final_decision = { ...r.final_decision, statement: this.applyRedaction(r.final_decision.statement) };
    const check = validateMemoryRecord(r);
    if (!check.valid) throw new Error(`memory record is invalid: ${check.errors.join('; ')}`);
    fs.writeFileSync(path.join(this.dir, 'records', `${r.id}.json`), JSON.stringify(r, null, 2));
    await this.reindex([r]);
    this.writeIndex();
    return r;
  }

  private writeIndex() {
    const index = this.list().map((r) => ({
      id: r.id,
      date: r.decision_timestamp.slice(0, 10),
      problem: r.problem_statement.slice(0, 160),
      playbook: r.playbook_used,
      tags: r.tags ?? [],
      decision: r.final_decision?.type,
      engine_confidence: r.engine_confidence,
      predictions: r.predictions?.length ?? 0,
      resolved: r.predictions?.filter((p) => p.outcome === 0 || p.outcome === 1).length ?? 0,
    }));
    fs.writeFileSync(path.join(this.dir, 'index.json'), JSON.stringify({ version: '3.0', total: index.length, decisions: index }, null, 2));
  }

  /** Embeds records missing from the vector file, or all records if the embedder changed. */
  async reindex(only?: MemoryRecord[]): Promise<void> {
    let vf = this.vectorsFile();
    const all = vf.embedder !== this.embedder.id;
    if (all) vf = { embedder: this.embedder.id, vectors: {} };
    const todo = all || !only ? this.list().filter((r) => all || !vf.vectors[r.id]) : only;
    if (todo.length === 0) return;
    const vecs = await this.embedder.embed(todo.map(textForRecord));
    todo.forEach((r, i) => (vf.vectors[r.id] = vecs[i]));
    this.writeVectors(vf);
  }

  async recall(query: string, k = 5, minScore = 0.15): Promise<{ id: string; score: number; problem: string; decision?: string; playbook?: string; resolved_predictions: number; brier?: number }[]> {
    await this.reindex();
    const vf = this.vectorsFile();
    const [q] = await this.embedder.embed([query]);
    return this.list()
      .map((r) => ({ r, score: vf.vectors[r.id] ? cosine(q, vf.vectors[r.id]) : 0 }))
      .filter((x) => x.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ r, score }) => {
        const resolved = (r.predictions ?? []).filter((p) => p.outcome === 0 || p.outcome === 1);
        const brier = resolved.length ? resolved.reduce((s, p) => s + (p.probability - (p.outcome as number)) ** 2, 0) / resolved.length : undefined;
        return { id: r.id, score: Number(score.toFixed(3)), problem: r.problem_statement.slice(0, 200), decision: r.final_decision?.type, playbook: r.playbook_used, resolved_predictions: resolved.length, brier };
      });
  }

  recordOutcome(decisionId: string, predictionId: string, outcome: 0 | 1, note?: string): MemoryPrediction {
    const r = this.get(decisionId);
    if (!r) throw new Error(`no decision ${decisionId} in memory`);
    const p = r.predictions?.find((x) => x.id === predictionId);
    if (!p) throw new Error(`no prediction ${predictionId} in decision ${decisionId}. Known: ${(r.predictions ?? []).map((x) => x.id).join(', ')}`);
    p.outcome = outcome;
    p.resolved_at = new Date().toISOString();
    p.note = note ?? null;
    const preds = r.predictions ?? [];
    const resolved = preds.filter((x) => x.outcome === 0 || x.outcome === 1).length;
    const retro = (r.retrospective as Record<string, unknown> | undefined) ?? {};
    r.retrospective = { ...retro, status: resolved === preds.length ? 'partially_validated' : 'outcome_pending', last_updated: p.resolved_at };
    fs.writeFileSync(path.join(this.dir, 'records', `${r.id}.json`), JSON.stringify(r, null, 2));
    this.writeIndex();
    return p;
  }

  /** Greedy clustering of past decisions. Clusters of 3 or more become pattern candidates for human review. */
  async patternCandidates(minSize = 3, threshold = 0.35): Promise<PatternCandidate[]> {
    await this.reindex();
    const vf = this.vectorsFile();
    const records = this.list().filter((r) => vf.vectors[r.id]);
    const existing = this.readPatterns();
    const known = new Set(existing.map((p) => [...p.members].sort().join('|')));
    const used = new Set<string>();
    const fresh: PatternCandidate[] = [];
    for (const seed of records) {
      if (used.has(seed.id)) continue;
      const members = records.filter((r) => !used.has(r.id) && cosine(vf.vectors[seed.id], vf.vectors[r.id]) >= threshold);
      if (members.length < minSize) continue;
      members.forEach((m) => used.add(m.id));
      const ids = members.map((m) => m.id).sort();
      if (known.has(ids.join('|'))) continue;
      const centroid = vf.vectors[seed.id].map((_, i) => members.reduce((s, m) => s + vf.vectors[m.id][i], 0) / members.length);
      const freq = new Map<string, number>();
      for (const m of members) for (const w of new Set(m.problem_statement.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((x) => x.length > 4))) freq.set(w, (freq.get(w) ?? 0) + 1);
      const top_terms = [...freq.entries()].filter(([, n]) => n >= Math.ceil(members.length / 2)).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
      fresh.push({ id: `candidate-${existing.length + fresh.length + 1}`, status: 'pending', members: ids, top_terms, centroid, created_at: new Date().toISOString() });
    }
    this.writePatterns([...existing, ...fresh]);
    return fresh;
  }

  readPatterns(): PatternCandidate[] {
    const p = path.join(this.dir, 'patterns.json');
    return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, 'utf8')) as PatternCandidate[]) : [];
  }

  private writePatterns(list: PatternCandidate[]) {
    fs.writeFileSync(path.join(this.dir, 'patterns.json'), JSON.stringify(list, null, 2));
  }

  setPatternStatus(id: string, status: 'approved' | 'rejected'): PatternCandidate {
    const list = this.readPatterns();
    const p = list.find((x) => x.id === id);
    if (!p) throw new Error(`no pattern candidate ${id}`);
    p.status = status;
    this.writePatterns(list);
    return p;
  }

  /**
   * Everything the memory knows that cannot be recomputed: decision records with their predictions
   * and outcomes, and the pattern candidates with their human review status. Vectors, index and
   * calibration are derived and rebuilt on import, so the bundle does not depend on the embedder.
   */
  exportBundle(engineVersion: string): MemoryBundle {
    return {
      format: MEMORY_BUNDLE_FORMAT,
      bundle_version: 1,
      engine_version: engineVersion,
      exported_at: new Date().toISOString(),
      records: this.list(),
      patterns: this.readPatterns().map(({ centroid, ...p }) => p),
    };
  }

  /**
   * Merges a bundle into this memory. Records are matched by id: a new record is added, an existing
   * one keeps its content and gains any outcome the bundle has and it lacks. An outcome is never
   * overwritten by a different one: the conflict is reported and the local value stays.
   */
  async importBundle(raw: unknown): Promise<MemoryImportResult> {
    const bundle = raw as Partial<MemoryBundle>;
    if (!bundle || typeof bundle !== 'object' || bundle.format !== MEMORY_BUNDLE_FORMAT) throw new Error(`not an AITS memory bundle: expected format "${MEMORY_BUNDLE_FORMAT}"`);
    if (bundle.bundle_version !== 1) throw new Error(`unsupported memory bundle version ${String(bundle.bundle_version)}: this engine reads version 1`);
    if (!Array.isArray(bundle.records)) throw new Error('memory bundle has no records array');
    const result: MemoryImportResult = { added: [], updated: [], unchanged: [], invalid: [], conflicts: [], patterns_added: 0 };
    const recordsDir = path.join(this.dir, 'records');
    for (const incoming of bundle.records as MemoryRecord[]) {
      const check = validateMemoryRecord(incoming);
      if (!check.valid || !/^[\w.-]+$/.test(String(incoming?.id ?? ''))) {
        result.invalid.push({ id: String(incoming?.id ?? '?'), errors: check.valid ? ['id may contain only letters, digits, dot, dash and underscore'] : check.errors });
        continue;
      }
      const local = this.get(incoming.id);
      if (!local) {
        fs.writeFileSync(path.join(recordsDir, `${incoming.id}.json`), JSON.stringify(incoming, null, 2));
        result.added.push(incoming.id);
        continue;
      }
      let changed = false;
      for (const p of incoming.predictions ?? []) {
        if (p.outcome !== 0 && p.outcome !== 1) continue;
        const mine = local.predictions?.find((x) => x.id === p.id);
        if (!mine) continue;
        if (mine.outcome === 0 || mine.outcome === 1) {
          if (mine.outcome !== p.outcome) result.conflicts.push({ id: local.id, prediction: p.id, local: mine.outcome, incoming: p.outcome });
          continue;
        }
        mine.outcome = p.outcome;
        mine.resolved_at = p.resolved_at ?? new Date().toISOString();
        mine.note = p.note ?? null;
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(path.join(recordsDir, `${local.id}.json`), JSON.stringify(local, null, 2));
        result.updated.push(local.id);
      } else result.unchanged.push(local.id);
    }
    await this.reindex();
    this.writeIndex();

    const vf = this.vectorsFile();
    const existing = this.readPatterns();
    const known = new Set(existing.map((p) => [...p.members].sort().join('|')));
    const fresh: PatternCandidate[] = [];
    for (const p of (bundle.patterns ?? []) as Omit<PatternCandidate, 'centroid'>[]) {
      const members = (p.members ?? []).filter((id) => vf.vectors[id]);
      const key = [...members].sort().join('|');
      if (!members.length || known.has(key)) continue;
      known.add(key);
      // The centroid is recomputed with this memory's embedder, so imported patterns match new problems here.
      const centroid = vf.vectors[members[0]].map((_, i) => members.reduce((s, m) => s + vf.vectors[m][i], 0) / members.length);
      fresh.push({ id: `candidate-${existing.length + fresh.length + 1}`, status: p.status === 'approved' || p.status === 'rejected' ? p.status : 'pending', members: [...members].sort(), top_terms: p.top_terms ?? [], centroid, created_at: p.created_at ?? new Date().toISOString() });
    }
    if (fresh.length) this.writePatterns([...existing, ...fresh]);
    result.patterns_added = fresh.length;
    return result;
  }

  /** Approved learned patterns close to a problem statement. */
  async matchLearnedPatterns(problem: string, minScore = 0.3) {
    const approved = this.readPatterns().filter((p) => p.status === 'approved');
    if (!approved.length) return [];
    const [q] = await this.embedder.embed([problem]);
    return approved
      .map((p) => ({ id: p.id, score: Number(cosine(q, p.centroid).toFixed(3)), members: p.members, top_terms: p.top_terms }))
      .filter((m) => m.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }
}
