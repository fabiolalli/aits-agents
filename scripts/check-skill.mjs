// Validates an Agent Skills package against the open specification (agentskills.io/specification)
// and the authoring guidance it links to. Fails on errors, prints warnings. Usage:
//   node scripts/check-skill.mjs [skill-dir]      default: skills/aits
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import YAML from 'yaml';

const dir = path.resolve(process.argv[2] ?? 'skills/aits');
const errors = [];
const warnings = [];

// Limits from the specification. The body limits are recommendations, so they only warn.
const NAME_MAX = 64;
const DESCRIPTION_MAX = 1024;
const COMPATIBILITY_MAX = 500;
const BODY_MAX_LINES = 500;
// About four characters per token for English prose: a conservative estimate of the 5000-token guidance.
const BODY_MAX_TOKENS = 5000;
// Files longer than this should list their sections, so a partial read still shows their scope.
const TOC_MIN_LINES = 100;
const KNOWN_FIELDS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const RESERVED = /(anthropic|claude)/;

const skillFile = path.join(dir, 'SKILL.md');
if (!fs.existsSync(skillFile)) {
  console.error(`${skillFile} not found`);
  process.exit(1);
}
const raw = fs.readFileSync(skillFile, 'utf8');
const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
if (!m) {
  console.error('SKILL.md must start with YAML frontmatter between --- lines');
  process.exit(1);
}
let fm;
try {
  fm = YAML.parse(m[1]) ?? {};
} catch (err) {
  console.error(`frontmatter is not valid YAML: ${err.message}`);
  process.exit(1);
}
const body = m[2];

for (const key of Object.keys(fm)) if (!KNOWN_FIELDS.has(key)) errors.push(`frontmatter field "${key}" is not defined by the specification`);

const { name, description, compatibility, metadata } = fm;
if (typeof name !== 'string' || !name) errors.push('name is required');
else {
  if (name.length > NAME_MAX) errors.push(`name is longer than ${NAME_MAX} characters`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) errors.push('name may contain only lowercase letters, digits and single hyphens, not at the start or end');
  if (name !== path.basename(dir)) errors.push(`name "${name}" must match the folder name "${path.basename(dir)}"`);
  if (RESERVED.test(name)) errors.push('name must not contain a reserved word');
}
if (typeof description !== 'string' || !description.trim()) errors.push('description is required');
else {
  if (description.length > DESCRIPTION_MAX) errors.push(`description is ${description.length} characters, the maximum is ${DESCRIPTION_MAX}`);
  if (/<[^>]+>/.test(description)) errors.push('description must not contain XML tags');
  if (!/\buse (it|this skill) (when|whenever|for)\b/i.test(description)) warnings.push('description should say when to use the skill ("Use it when ...")');
  if (/^(I|I'm|I can|You)\b/.test(description)) warnings.push('description should be written in the third person');
}
if (compatibility !== undefined && (typeof compatibility !== 'string' || !compatibility.length || compatibility.length > COMPATIBILITY_MAX)) errors.push(`compatibility must be 1-${COMPATIBILITY_MAX} characters`);
if (metadata !== undefined) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) errors.push('metadata must be a map');
  else for (const [k, v] of Object.entries(metadata)) if (typeof v !== 'string') errors.push(`metadata.${k} must be a string`);
}
if (fm['allowed-tools'] !== undefined && typeof fm['allowed-tools'] !== 'string') errors.push('allowed-tools must be a space-separated string');

const bodyLines = body.split('\n').length;
if (bodyLines > BODY_MAX_LINES) warnings.push(`SKILL.md body has ${bodyLines} lines, the guidance is under ${BODY_MAX_LINES}`);
const bodyTokens = Math.round(body.length / 4);
if (bodyTokens > BODY_MAX_TOKENS) warnings.push(`SKILL.md body is about ${bodyTokens} tokens, the guidance is under ${BODY_MAX_TOKENS}`);

// The bundled engine must be the one the metadata declares.
const engine = path.join(dir, 'scripts', 'aits.mjs');
if (metadata?.['engine-sha256'] && fs.existsSync(engine)) {
  const actual = createHash('sha256').update(fs.readFileSync(engine)).digest('hex');
  if (actual !== metadata['engine-sha256']) errors.push(`metadata.engine-sha256 does not match scripts/aits.mjs (${actual})`);
}

// Every file a Markdown file points to must exist, with paths relative to the skill root.
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(dir);
const IN_FOLDER = /^(agents|references|playbooks|graphs|schemas|templates|scripts|assets)\/[\w.-]+\.(md|json|yaml|yml|mjs|js|py|sh)$/;
const BARE = /^[\w.-]+\.(md|json|yaml|yml|mjs)$/;
const byName = new Map(files.map((f) => [path.basename(f), path.relative(dir, f)]));
let checked = 0;
for (const file of files.filter((f) => f.endsWith('.md'))) {
  const rel = path.relative(dir, file);
  const text = fs.readFileSync(file, 'utf8');
  const refs = [...text.matchAll(/`([^`\s]+)`/g), ...text.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)/g)].map((x) => x[1]).filter((r) => !/^[a-z]+:/.test(r));
  for (const ref of new Set(refs)) {
    if (IN_FOLDER.test(ref)) {
      checked++;
      if (!fs.existsSync(path.join(dir, ref))) errors.push(`${rel}: points to ${ref}, which is not in the skill`);
    } else if (BARE.test(ref) && !fs.existsSync(path.join(dir, ref))) {
      // A bare name is either a project file (aits.config.yaml) or a skill file missing its folder.
      if (byName.has(ref)) errors.push(`${rel}: write ${ref} as ${byName.get(ref)}, relative to the skill root`);
      else if (ref.endsWith('.md')) errors.push(`${rel}: points to ${ref}, which is not in the skill`);
      else continue;
      checked++;
    } else if (BARE.test(ref)) checked++;
  }
  const lines = text.split('\n').length;
  if (rel !== 'SKILL.md' && lines > TOC_MIN_LINES && !/^## Contents$/m.test(text)) warnings.push(`${rel}: ${lines} lines without a list of sections`);
  if (/\\(?:scripts|references|agents)\\/.test(text)) errors.push(`${rel}: uses backslashes in a path`);
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`${path.relative(process.cwd(), dir) || dir}: valid Agent Skill (${files.length} files, ${checked} file references resolved, body ${bodyLines} lines, about ${bodyTokens} tokens)`);
