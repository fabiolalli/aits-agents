// Regenerates examples/demo-pricing-change from the synthetic eval case, through the bundled CLI.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const cli = path.join(root, 'dist/aits.mjs');
const src = path.join(root, 'eval/cases/demo-pricing-change/runs/v3');
const out = path.join(root, 'examples/demo-pricing-change');
const project = fs.mkdtempSync(path.join(os.tmpdir(), 'aits-example-'));
const aits = (...args) => execFileSync('node', [cli, ...args], { cwd: project, encoding: 'utf8' });

aits('start', 'Raise the price of the SMB plan from 29 to 35 EUR per seat?', '--graph', 'go-no-go', '--mode', 'autonomous', '--tags', 'pricing,smb');
for (const f of fs.readdirSync(src).filter((x) => x.endsWith('.json') && !x.startsWith('06-')).sort()) aits('submit', path.join(src, f));
aits('gate', 'R3#1', 'proceed', '--quote', 'Procedi, ma con grandfathering per i clienti SMB storici');
aits('synthesize', path.join(src, '06-synthesis.json'));
fs.rmSync(out, { recursive: true, force: true });
aits('export', '--out', out);
console.log(`example written to ${path.relative(root, out)}`);
