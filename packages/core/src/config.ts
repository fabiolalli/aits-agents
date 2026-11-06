import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import YAML from 'yaml';
import type { Tier } from './spec.ts';

/** A model choice as configured by the user. The engine never interprets the model string. */
export interface ModelChoice {
  family: string;
  model: string;
  runtime?: string;
}

export interface AitsConfig {
  /** Directory for runs and memory, relative to the working directory. */
  storage: string;
  models: Partial<Record<Tier, ModelChoice[]>>;
  memory: {
    embedder: 'hashing' | 'http';
    http?: { url: string; model?: string; api_key_env?: string };
    redact?: string[];
  };
  signing?: { key?: string };
  otel?: { endpoint?: string; headers?: Record<string, string> };
}

const DEFAULTS: AitsConfig = {
  storage: '.aits',
  models: {},
  memory: { embedder: 'hashing' },
};

function expandHome(p: string): string {
  return p.startsWith('~/') ? path.join(os.homedir(), p.slice(2)) : p;
}

/** Reads aits.config.yaml from the working directory, then .aits/config.yaml. Missing file means defaults. */
export function loadConfig(cwd = process.cwd()): AitsConfig & { root: string; storageDir: string } {
  const candidates = [process.env.AITS_CONFIG, path.join(cwd, 'aits.config.yaml'), path.join(cwd, '.aits', 'config.yaml')].filter(Boolean) as string[];
  let user: Partial<AitsConfig> = {};
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      user = (YAML.parse(fs.readFileSync(c, 'utf8')) ?? {}) as Partial<AitsConfig>;
      break;
    }
  }
  const merged: AitsConfig = {
    ...DEFAULTS,
    ...user,
    memory: { ...DEFAULTS.memory, ...(user.memory ?? {}) },
    models: user.models ?? {},
  };
  if (merged.signing?.key) merged.signing.key = expandHome(merged.signing.key);
  const storageDir = path.resolve(cwd, process.env.AITS_HOME ?? merged.storage);
  return { ...merged, root: cwd, storageDir };
}

export function availableFamilies(config: AitsConfig): string[] {
  const set = new Set<string>();
  for (const choices of Object.values(config.models)) for (const c of choices ?? []) set.add(c.family);
  return [...set];
}
