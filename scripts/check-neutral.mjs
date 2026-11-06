// Fails when a model or vendor name appears in spec/: the specification must stay runtime-neutral.
import fs from 'node:fs';
import path from 'node:path';
const banned = /\b(claude|anthropic|openai|gpt-?\d|gemini|google|mistral|llama|opus|sonnet|haiku|fable|mythos)\b/i;
const hits = [];
const walk = (d) => fs.readdirSync(d).forEach((n) => {
  const p = path.join(d, n);
  if (fs.statSync(p).isDirectory()) return walk(p);
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => { const m = line.match(banned); if (m) hits.push(`${p}:${i + 1}: ${m[0]}`); });
});
walk('spec');
if (hits.length) { console.error(hits.join('\n')); process.exit(1); }
console.log('spec is runtime-neutral');
