import { createHash } from 'node:crypto';
import YAML from 'yaml';

export type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

/** Deterministic JSON: object keys sorted at every level. Used for hashing and signing. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as object).sort()) {
      const v = (value as Record<string, unknown>)[k];
      if (v !== undefined) out[k] = sortKeys(v);
    }
    return out;
  }
  return value;
}

export function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

export function hashOf(value: unknown): string {
  return sha256(canonicalJson(value));
}

/**
 * Reads a dotted path with `[*]` wildcards and returns every value found.
 * `a.b[*].c` on {a:{b:[{c:1},{c:2}]}} returns [1, 2]. Missing segments yield nothing.
 */
export function getPathValues(obj: unknown, path: string): unknown[] {
  const segments = path.split('.').flatMap((seg) => {
    const parts: string[] = [];
    const m = seg.match(/^([^[]+)((\[\*\])*)$/);
    if (!m) return [seg];
    parts.push(m[1]);
    const stars = (m[2] || '').match(/\[\*\]/g) || [];
    for (let i = 0; i < stars.length; i++) parts.push('[*]');
    return parts;
  });
  let current: unknown[] = [obj];
  for (const seg of segments) {
    const next: unknown[] = [];
    for (const c of current) {
      if (seg === '[*]') {
        if (Array.isArray(c)) next.push(...c);
      } else if (c && typeof c === 'object' && seg in (c as object)) {
        next.push((c as Record<string, unknown>)[seg]);
      }
    }
    current = next;
  }
  return current;
}

export function parseFrontmatter(text: string): { data: Record<string, unknown>; body: string } {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: text };
  return { data: (YAML.parse(m[1]) ?? {}) as Record<string, unknown>, body: text.slice(m[0].length) };
}

export function nowIso(): string {
  return new Date().toISOString();
}

export const CONFIDENCE_ORDER = { low: 1, medium: 2, high: 3 } as const;
export type ConfidenceLevel = keyof typeof CONFIDENCE_ORDER;

export function minConfidence(...levels: (ConfidenceLevel | undefined)[]): ConfidenceLevel {
  const present = levels.filter((l): l is ConfidenceLevel => !!l && l in CONFIDENCE_ORDER);
  if (present.length === 0) return 'low';
  return present.reduce((a, b) => (CONFIDENCE_ORDER[a] <= CONFIDENCE_ORDER[b] ? a : b));
}

export function slugify(text: string, max = 48): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '') || 'decision';
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
