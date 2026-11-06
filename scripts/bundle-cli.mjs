// Bundles the CLI, MCP server, hook and A2A endpoint into one dependency-free file: dist/aits.mjs.
import { build } from 'esbuild';
import fs from 'node:fs';

await build({
  entryPoints: ['packages/cli/src/main.ts'],
  outfile: 'dist/aits.mjs',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  legalComments: 'none',
  minify: true,
  banner: { js: "#!/usr/bin/env node\nimport { createRequire as __aitsCreateRequire } from 'node:module';\nconst require = __aitsCreateRequire(import.meta.url);" },
});
fs.chmodSync('dist/aits.mjs', 0o755);
console.log(`dist/aits.mjs ${(fs.statSync('dist/aits.mjs').size / 1024).toFixed(0)} KB`);
