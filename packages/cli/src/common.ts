import fs from 'node:fs';
import { loadSigner, type Engine } from '@fabiolalli/aits-core';

/** Project directory: AITS_PROJECT_DIR when set to a real path, otherwise the working directory. */
export function projectDir(): string {
  const p = process.env.AITS_PROJECT_DIR;
  return p && !p.includes('${') && fs.existsSync(p) ? p : process.cwd();
}

export function publicKeysFor(engine: Engine): Record<string, string> {
  const key = engine.config.signing?.key;
  if (!key || !fs.existsSync(key)) return {};
  const s = loadSigner(key);
  return { [s.keyId]: s.publicKeyPem };
}
