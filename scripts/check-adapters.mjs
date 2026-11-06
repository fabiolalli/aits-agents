// Fails when plugins/aits or skills/aits differ from what the spec generates: adapters are never edited by hand.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'aits-adapters-'));
execFileSync('node', ['dist/aits.mjs', 'build', '--target', 'all', '--out', out], { stdio: 'ignore' });
const list = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { recursive: true }).filter((f) => fs.statSync(path.join(d, f)).isFile()).sort() : []);
const diffs = [];
for (const rel of ['plugins/aits', 'skills/aits']) {
  const a = path.join(out, rel), b = rel;
  const files = new Set([...list(a), ...list(b)]);
  for (const f of files) {
    const pa = path.join(a, f), pb = path.join(b, f);
    if (!fs.existsSync(pa) || !fs.existsSync(pb) || !fs.readFileSync(pa).equals(fs.readFileSync(pb))) diffs.push(path.join(rel, f));
  }
}
if (diffs.length) { console.error('adapters out of sync, run npm run build:adapters:\n' + diffs.join('\n')); process.exit(1); }
console.log('adapters in sync with spec/');
