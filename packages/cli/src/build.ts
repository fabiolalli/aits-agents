import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { ENGINE_VERSION, getSpec, loadConfig, parseFrontmatter, type AitsConfig, type Tier } from '@fabiolalli/aits-core';

const write = (file: string, content: string) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

function copySpecFolder(prefix: string, dest: string, rename: (name: string) => string = (n) => n) {
  for (const [name, content] of Object.entries(getSpec().files)) {
    if (name.startsWith(prefix + '/')) write(path.join(dest, rename(name.slice(prefix.length + 1))), content);
  }
}

function bundlePath(): string {
  const self = fileURLToPath(import.meta.url);
  if (self.endsWith('.mjs')) return self;
  const fallback = path.resolve(path.dirname(self), '../../../dist/aits.mjs');
  if (!fs.existsSync(fallback)) throw new Error('bundle not found: run npm run bundle first');
  return fallback;
}

function modelFor(config: AitsConfig, tier: Tier, runtime: string): string {
  const choice = (config.models[tier] ?? []).find((c) => !c.runtime || c.runtime === runtime);
  return choice?.model ?? 'inherit';
}

const RUNTIME_PATHS: Record<string, string> = {
  'claude-code': `## Path Resolution (plugin install)

Files referenced as \`references/...\`, \`playbooks/...\`, \`graphs/...\` or \`schemas/...\` are relative to the plugin root, not to the current project.

1. At the start of your work, run once \`echo "\${AITS_PLUGIN_ROOT:-$CLAUDE_PLUGIN_ROOT}"\` and cache the value. The plugin sets \`AITS_PLUGIN_ROOT\` when the session starts.
2. Prepend that root to any \`references/...\`, \`playbooks/...\`, \`graphs/...\` or \`schemas/...\` path before reading it.
3. If both are empty, look for the folder once with \`ls -d ~/.claude/plugins/cache/*/aits/*/ ~/.claude/plugins/marketplaces/*/plugins/aits/ 2>/dev/null | head -1\`, and use \`$HOME/.claude/\` only if nothing is found (files copied by hand). Do not search the whole disk.

Project-local paths such as \`.aits/\` stay relative to the current project. The AITS engine is available as MCP tools with the \`aits_\` prefix.
`,
  'agent-skills': `## Path Resolution

Files referenced as \`references/...\`, \`playbooks/...\`, \`graphs/...\` or \`schemas/...\` are relative to the folder of this skill. Project-local paths such as \`.aits/\` stay relative to the current project.
`,
};

/**
 * The exact envelope an agent must return, generated from the schemas so that an agent that cannot
 * open its schema file still produces a valid output. Inserted at the top of each Output Contract.
 */
export function envelopeSkeleton(agentId: string, withPredictions: boolean) {
  return JSON.parse(envelopeBlock(agentId, withPredictions).split('```json\n')[1].split('\n```')[0]) as Record<string, unknown>;
}

function envelopeBlock(agentId: string, withPredictions: boolean): string {
  const spec = getSpec();
  const env = JSON.parse(spec.files['schemas/_envelope.schema.json']) as { required: string[] };
  const own = JSON.parse(spec.files[`schemas/${agentId}.schema.json`] ?? '{}') as { properties?: { main_output?: { required?: string[] } } };
  const mainRequired = own.properties?.main_output?.required ?? [];
  const skeleton = {
    agent: agentId,
    version: '3.0',
    timestamp: '<ISO 8601 date and time>',
    confidence: { level: 'high|medium|low', reasoning: '<one sentence>' },
    summary: '<one paragraph>',
    main_output: Object.fromEntries(mainRequired.map((k) => [k, '<see the shape below>'])),
    hitl_flags: [],
    gaps_or_assumptions: {
      gaps: [{ description: '<what is missing>', impact_if_unfilled: 'high|medium|low', how_to_fill: '<how to get it>' }],
      assumptions: [{ statement: '<what you assumed>', testable: true, risk_if_wrong: '<consequence>' }],
    },
    ...(withPredictions ? { predictions: [{ id: 'p1', statement: '<event that can be checked later>', probability: 0.3, resolve_by: '<ISO date>', source_ref: '<risk, premortem or scenario id>' }] } : {}),
  };
  const lead =
    agentId === 'meta-orchestrator'
      ? 'The synthesis you submit to the engine is this JSON object, passed unchanged; the engine refuses anything else.'
      : 'Return **only** this JSON object as your final message, with no text before or after it. The engine rejects anything else.';
  return `${lead} \`agent\` must be exactly \`"${agentId}"\` and \`version\` exactly \`"3.0"\`; the required fields are ${env.required.map((f) => `\`${f}\``).join(', ')}${mainRequired.length ? `, and \`main_output\` requires ${mainRequired.map((f) => `\`${f}\``).join(', ')}` : ''}. Enumerated values take exactly one of the listed options: when none fits, use the neutral option the list offers (such as \`unknown\` or \`none\`) or leave out an optional field, never \`N/A\` or free text. Add \`hitl_flags\` entries (\`trigger\`, \`severity\`: \`blocking\` or \`advisory\`, \`description\`) when one of your escalation triggers fires.

\`\`\`json
${JSON.stringify(skeleton, null, 2)}
\`\`\`
`;
}

function withEnvelope(agentId: string, body: string): string {
  if (agentId === 'memory') return body;
  return body.replace(/^## Output Contract\s*\n/m, (h) => `${h}\n${envelopeBlock(agentId, /^## Predictions for Calibration/m.test(body))}\n`);
}

/** Plugin commands are namespaced by Claude Code as /aits:<id>. */
const pluginCommandNames = (text: string) => text.replace(/\/aits-(full|quick|diverge|board)\b/g, '/aits:$1');

const CLAUDE_TOOLS: Record<string, string[]> = {
  file_read: ['Read', 'Glob', 'Grep'],
  file_write: ['Write'],
  shell: ['Bash'],
  subagent_invoke: ['Task'],
  web_search: ['WebSearch'],
  web_fetch: ['WebFetch'],
};

/** Claude Code plugin: same layout as v2, generated from the neutral spec plus the engine bundle. */
export function buildClaudeCode(outRoot: string, config: AitsConfig) {
  const spec = getSpec();
  const dir = path.join(outRoot, 'plugins', 'aits');
  for (const sub of ['agents', 'commands', 'playbooks', 'references', 'schemas', 'graphs', 'server', 'hooks']) fs.rmSync(path.join(dir, sub), { recursive: true, force: true });

  for (const agent of Object.values(spec.agents)) {
    const fm: Record<string, unknown> = { name: `aits-${agent.id}`, description: agent.description, color: agent.color, model: modelFor(config, agent.tier, 'claude-code') };
    // The orchestrator inherits every tool, including the engine's MCP tools.
    if (agent.id !== 'meta-orchestrator') fm.tools = [...new Set(agent.capabilities.flatMap((c) => CLAUDE_TOOLS[c] ?? []))].join(', ');
    const body = pluginCommandNames(withEnvelope(agent.id, agent.body.replace('<!-- aits:runtime-paths -->', RUNTIME_PATHS['claude-code'])));
    write(path.join(dir, 'agents', `aits-${agent.id}.md`), `---\n${YAML.stringify(fm).trim()}\n---\n\n${body.trimStart()}`);
  }
  const dash = parseFrontmatter(spec.files['templates/dashboard.md']);
  write(path.join(dir, 'agents', 'aits-dashboard.md'), `---\nname: aits-dashboard\ndescription: ${JSON.stringify(String(dash.data.description))}\n---\n\n${pluginCommandNames(dash.body.replace('<!-- aits:runtime-paths -->', RUNTIME_PATHS['claude-code'])).trimStart()}`);

  for (const [name, content] of Object.entries(spec.files)) {
    if (!name.startsWith('commands/')) continue;
    const { data, body } = parseFrontmatter(content);
    const id = String(data.id);
    const engineNote = id === 'board' ? '' : `\n> Engine: this command starts an AITS run with \`aits_start_run\` (graph \`${data.graph}\`, mode \`${data.mode}\`) and closes it only through \`aits_synthesize\`.\n`;
    write(path.join(dir, 'commands', `${id}.md`), `---\ndescription: ${JSON.stringify(String(data.description))}\n---\n${engineNote}\n${pluginCommandNames(body.replace(/aits-dashboard\.md/g, 'agents/aits-dashboard.md')).trimStart()}`);
  }
  copySpecFolder('playbooks', path.join(dir, 'playbooks'));
  copySpecFolder('references', path.join(dir, 'references'));
  copySpecFolder('schemas', path.join(dir, 'schemas'));
  copySpecFolder('graphs', path.join(dir, 'graphs'));
  write(path.join(dir, 'rules.yaml'), spec.files['rules.yaml']);
  write(path.join(dir, 'aits.spec.yaml'), spec.files['aits.spec.yaml']);

  fs.mkdirSync(path.join(dir, 'server'), { recursive: true });
  fs.copyFileSync(bundlePath(), path.join(dir, 'server', 'aits.mjs'));
  write(
    path.join(dir, '.mcp.json'),
    JSON.stringify({ mcpServers: { aits: { command: 'node', args: ['${CLAUDE_PLUGIN_ROOT}/server/aits.mjs', 'mcp'], env: { AITS_PROJECT_DIR: '${CLAUDE_PROJECT_DIR}' } } } }, null, 2) + '\n',
  );
  const hookCmd = 'node "${CLAUDE_PLUGIN_ROOT}/server/aits.mjs" hook';
  write(
    path.join(dir, 'hooks', 'hooks.json'),
    JSON.stringify(
      {
        hooks: {
          SessionStart: [{ hooks: [{ type: 'command', command: `${hookCmd} session-start`, timeout: 10 }] }],
          PostToolUse: [{ matcher: 'Task|Agent', hooks: [{ type: 'command', command: `${hookCmd} post-tool-use`, timeout: 30 }] }],
          SubagentStop: [{ hooks: [{ type: 'command', command: `${hookCmd} subagent-stop`, timeout: 30 }] }],
        },
      },
      null,
      2,
    ) + '\n',
  );
  write(
    path.join(dir, '.claude-plugin', 'plugin.json'),
    JSON.stringify(
      {
        name: 'aits',
        version: ENGINE_VERSION,
        description:
          'AITS 3.0 — 11 cognitive agents and a dashboard template, 4 commands, 10 execution graphs, conflict matrix, pattern library and JSON schemas, enforced by a deterministic engine (MCP server and hook): rules and human gates, hash-chained decision log, model-diversity policy, semantic memory and calibration.',
        author: { name: 'Fabio Lalli', url: 'https://github.com/fabiolalli' },
        homepage: 'https://github.com/fabiolalli/aits-agents',
        repository: 'https://github.com/fabiolalli/aits-agents',
        license: 'MIT',
        keywords: ['aits', 'decision-making', 'multi-agent', 'thinking-hats', 'de-bono', 'orchestration', 'playbooks', 'governance', 'calibration'],
      },
      null,
      2,
    ) + '\n',
  );
  return dir;
}

function skillMd(): string {
  const spec = getSpec();
  const agents = Object.values(spec.agents)
    .map((a) => `| \`${a.id}\` | ${a.tier} | ${a.function.replace(/\|/g, '/')} |`)
    .join('\n');
  const graphs = Object.values(spec.graphs)
    .map((g) => `- \`${g.id}\`: ${g.title}`)
    .join('\n');
  return `---
name: aits
description: Adaptive Intelligence Thinking System (AITS) 3.0, a multi-perspective decision framework evolved from de Bono's Six Thinking Hats, enforced by a deterministic engine. Use it whenever someone faces a complex decision, compares strategic options, asks for a go/no-go, a risk assessment, an ethical impact analysis or a structured brainstorm, or says things like "help me decide", "should we", "devo scegliere tra", "aiutami a decidere", "valuta rischi e opportunità", even without naming AITS.
---

# AITS 3.0

When this skill is active you are the **Meta-Orchestrator** of AITS. You govern a decision by running separate cognitive perspectives, one function each, and integrating them. You never close a decision by judgment alone: the AITS engine checks every step.

## Step 0: find the engine

Use the first option available, and say which one you are using.

1. **MCP tools** named \`aits_start_run\`, \`aits_submit\`, \`aits_gate_respond\`, \`aits_synthesize\` (and the others with the \`aits_\` prefix).
2. **Command line**, if you can run shell commands and Node.js 20 or later is installed: \`node <path of this skill>/scripts/aits.mjs <command>\`, launched from the project directory so that \`.aits/\` is created there. Commands: \`start "<problem>" --graph <id> --mode <mode>\`, \`submit <file|->\`, \`status\`, \`gate <gate_id> <decision> --quote "<the human's words>"\`, \`skip <agent> --reason "..." --quote "..."\`, \`aggregate <agent>\`, \`synthesize <file|->\`, \`recall "<query>"\`, \`export\`.
3. **No engine**: follow the protocol below as instructions and write \`enforcement: absent\` at the top of the synthesis. Rules then hold only as discipline.

## Protocol

1. **Start** the run with the problem in the user's words, the playbook graph and the HITL mode (\`supervised\` for important or irreversible decisions, \`autonomous\` for quick ones, \`review\` for exploration). The engine returns the plan in waves, matching archetypes and similar past decisions: tell the user which playbook and why.
2. **Run the perspectives wave by wave.** For each agent read its specification in \`agents/<id>.md\` and produce its JSON envelope exactly as specified in its Output Contract and in \`schemas/<id>.schema.json\`. Keep perspectives separate: never mix critique and optimism, or generation and evaluation, in the same output. If your runtime can invoke sub-agents, give each perspective its own sub-agent.
3. **Submit every envelope** to the engine unchanged. Fill \`provenance\` (runtime, model family, model, tier, run index) only from configuration you know, never by guessing. On a schema error, redo the agent once with the engine's error list.
4. **Multiple runs**: Critical-Validator, Predictive-Strategic and Foresight run several times independently when the engine plan says so. Submit each run, read the aggregation and report its minority positions. Runs never debate each other.
5. **Gates**: when the engine opens a gate, stop, show the user the gate and the reason, and wait. Pass their decision and their own words to the engine. You never answer a gate for them.
6. **Synthesis**: submit the Meta-Orchestrator envelope. If the engine refuses it, report why and resolve the reasons. Present the decision with the confidence the engine computed, and say why it differs from yours if it does.

## Agents

| Id | Tier | Function |
| --- | --- | --- |
${agents}

Tiers express the reasoning each agent needs (\`deep\`, \`standard\`, \`fast\`); which model serves each tier is the user's choice, in \`aits.config.yaml\`.

## Inviolable rules

Declared in \`rules.yaml\` and checked by the engine:

- R1 Only the Meta-Orchestrator closes the decision.
- R2 Missing high-impact data returns to Analytical (R2a: Analytical's own high-impact gaps need a human decision).
- R3 Risk severity of 10 or more requires Ethical-Governance or Predictive-Strategic.
- R4 A contradiction between Critical-Validator and Optimizer is arbitrated by Ethical-Governance.
- R5 Four or more options require Foresight.
- R6 An ethical red line requires a human decision.
- R7 A second schema failure of the same agent requires a human decision.
- R8 Any agent can raise a blocking gate through \`hitl_flags\`.

## Playbook graphs

${graphs}

Each graph is in \`graphs/<id>.yaml\`; the narrative playbook with focus areas and bias checklist is in \`playbooks/<id>.md\` (the graphs \`full\`, \`quick\` and \`diverge\` have no playbook file).

## Reference files

Read only what the current step needs.

- \`references/agent-contract.md\`: the envelope every agent produces
- \`references/conflict-matrix.md\`: who arbitrates which disagreement
- \`references/taxonomies.md\`: risk categories, emotional drivers, ethical dimensions, scenario frames
- \`references/pattern-library.md\`: recurring decision archetypes
- \`aits.spec.yaml\`: tiers, diversity and calibration policies

The final decision always belongs to the human. You are the structured process that helps them decide well.
`;
}

/** Portable package for any runtime that reads Agent Skills (SKILL.md). Includes the engine as a script. */
export function buildAgentSkills(outRoot: string) {
  const spec = getSpec();
  const dir = path.join(outRoot, 'skills', 'aits');
  fs.rmSync(dir, { recursive: true, force: true });
  write(path.join(dir, 'SKILL.md'), skillMd());
  for (const agent of Object.values(spec.agents)) {
    write(path.join(dir, 'agents', `${agent.id}.md`), `# ${agent.id} (tier: ${agent.tier})\n\n${withEnvelope(agent.id, agent.body.replace('<!-- aits:runtime-paths -->', RUNTIME_PATHS['agent-skills'])).trimStart()}`);
  }
  copySpecFolder('playbooks', path.join(dir, 'playbooks'));
  copySpecFolder('references', path.join(dir, 'references'));
  copySpecFolder('schemas', path.join(dir, 'schemas'));
  copySpecFolder('graphs', path.join(dir, 'graphs'));
  write(path.join(dir, 'templates', 'dashboard.md'), parseFrontmatter(spec.files['templates/dashboard.md']).body.replace('<!-- aits:runtime-paths -->', RUNTIME_PATHS['agent-skills']));
  write(path.join(dir, 'rules.yaml'), spec.files['rules.yaml']);
  write(path.join(dir, 'aits.spec.yaml'), spec.files['aits.spec.yaml']);
  fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  fs.copyFileSync(bundlePath(), path.join(dir, 'scripts', 'aits.mjs'));
  return dir;
}

export function build(target: string, out: string, configPath?: string) {
  if (configPath) process.env.AITS_CONFIG = path.resolve(configPath);
  const config = loadConfig(process.cwd());
  const built: string[] = [];
  if (target === 'claude-code' || target === 'all') built.push(buildClaudeCode(out, config));
  if (target === 'agent-skills' || target === 'all') built.push(buildAgentSkills(out));
  if (!built.length) throw new Error(`unknown target ${target}: use claude-code, agent-skills or all`);
  return built;
}
