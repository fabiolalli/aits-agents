# AITS — Adaptive Intelligence Thinking System

**Version 3.0** · by [Fabio Lalli](https://github.com/fabiolalli) · Website: [aits.fabiolalli.com](https://aits.fabiolalli.com/en) (English and Italian: docs, install guide and an [interactive demo](https://aits.fabiolalli.com/en/demo))

A decision-making framework evolved from Edward de Bono's *Six Thinking Hats* (1985) into a multi-agent operating system for decisions: separate cognitive perspectives, formal rules, human gates, memory, and a deterministic engine that enforces all of it whatever model or runtime you use.

---

## What is AITS

De Bono proposed a mental exercise: wear one thinking hat at a time, think from that perspective, then integrate. AITS keeps that core insight, **separating thinking modes and then integrating them**, and turns it into a system with:

- **11 cognitive agents**, each with one function, a structured JSON output and an explicit handoff protocol
- **A Meta-Orchestrator** that runs the agents in parallel waves and closes the decision
- **A deterministic engine** (`aits-core`) that validates every output, evaluates the inviolable rules, opens gates only a human can close, and keeps a hash-chained, optionally signed decision log
- **A diversity policy**: the agents that estimate risks and probabilities run several times, on different model families when available, and their disagreements are kept in a minority report
- **Memory and calibration**: past decisions are recalled semantically, predictions are scored against what actually happened, and the engine adjusts how much it trusts each agent
- **Three HITL modes** (supervised, autonomous, review) with mandatory gates that no mode can bypass

AITS is **runtime-neutral**: the specification names no model and no vendor. Models are a choice in your own configuration file.

See [`AITS.md`](./AITS.md) for the manifesto and design principles.

---

## Genesis & History

### The book (2025)

AITS started as a book, *Adaptive Intelligence Thinking System*, written in Rome in 2025. The book asked one question: in an era where AI generates, suggests and simulates, how do we keep thinking well, together? Not thinking instead of machines, not thinking like machines, thinking with them, in a way that structures complexity rather than ignoring it.

The answer proposed in the book was to take De Bono's *Six Thinking Hats* (1985), recognise what it got right (separating cognitive modes and integrating them on purpose) and evolve it for the age of hybrid intelligence. The metaphor of the "hat" became something more operational, a cognitive agent: not a role a person wears, but a functional unit that can be embodied by a human, by an AI, or more often by a human-AI pairing working on a specific dimension of the problem.

The book proposed **eight cognitive agents**: four direct evolutions of De Bono's hats (Analytical, Emotional-Intuitive, Critical-Validator, Optimizer) and four new ones needed to cover dimensions that 1985 could not foresee (Creative-Generative, Ethical-Governance, Predictive-Strategic, Meta-Orchestrator). Around them, three guiding principles (hybrid intelligence, dynamic adaptivity, integrated ethics), multiple operating modes (sequential, parallel, emergent, hybrid), and a ten-point ethical manifesto closing the system.

### Version 1 — from theory to code (early 2026)

The book defined the framework. Version 1 of this repository translated it into working code, as open source from day one.

The choice was Claude Code, because its sub-agent architecture already provided what the book was describing: specialised cognitive units invoked by an orchestrator, each with its own prompt, tools, and contract. What on paper was an "orchestra of agents" in Claude Code could become eleven `.md` files and a `Task` tool. The framework became executable. A command on the terminal, a decision, a structured multi-dimensional output.

The v1 series (released in sequence as `v1`, `v2`, `v3`) carried the book's architecture into the real world, translated everything to English, added the first three commands (`/aits-full`, `/aits-quick`, `/aits-diverge`), brought in the playbooks, introduced the visual HTML dashboard, and made the system usable across projects via the `.claude/` convention.

Running it on real decisions surfaced what the book could not anticipate. Agents that ignored each other's outputs. Conflicts resolved by improvisation. A system with no memory, that would re-analyse the same pattern for the tenth time as if encountering it for the first. Outputs with variable structure, hard to compare, hard to validate. Ethics raising alarms that the orchestrator treated as suggestions rather than gates. A framework that worked well, but that had not yet become a system.

### Version 2.0 — from framework to operating system (April 2026)

Version 2 is the answer to what v1 was missing. It keeps everything that already worked and rebuilds the connective tissue around the agents: the rules, the contracts, the memory, the gates.

Three expansions in one release. **More agents**, from eight to eleven: Systemic (feedback loops, leverage points, unintended consequences), Foresight (options × scenarios matrix, antifragility detection), Memory (the archive that makes AITS a learning system, not a static framework). **Formal structure**, introduced from scratch: a common envelope, per-agent JSON Schemas, a shared 10-section agent contract, a conflict matrix that codifies every pairwise agent tension, a shared vocabulary (6 risk categories, 8 deep emotional drivers, 7 ethical dimensions, 10 scenario frames), and a pattern library of recurring decision archetypes. **Governance**, made explicit: three human-in-the-loop modes (supervised, autonomous, review), seven inviolable rules enforced mechanically regardless of mode, mandatory gates that any agent can raise, and a decision archive with retrospective outcome tracking for compound learning over time.

The book was theory. v1 was prototype. v2 is the operating system, the first release where AITS stops looking like a set of clever prompts and starts behaving like a system: measurable, composable, auditable, capable of remembering, and always handing the final judgement back to a human.

### Version 3.0 — from prompts to an enforced, portable system (November 2026)

v2 defined the rules; v3 makes them hold. In v2 the inviolable rules, the schema validation and the gates lived inside the Meta-Orchestrator's prompt: a model could skip them and nothing would notice. v3 moves enforcement into a deterministic engine that every runtime calls, so the same rule blocks the same synthesis on any model.

Four changes define the release. **Enforcement**: schemas, rules (now declared in `rules.yaml`) and gates are evaluated by code, gates are closed only by a human answer recorded with the channel it came through, and every event goes into an append-only log whose hash chain makes later edits visible. **Independence from models**: the spec is separated from the runtime; agents declare a capability tier (`deep`, `standard`, `fast`) instead of a model, and research on multi-agent debate showed that agents of the same model family share errors, so the perspectives that estimate risk and probability now run independently, on different families when configured, aggregated without debate, with minority positions preserved. **Learning**: memory moves from tag matching to semantic recall, every prediction is stored with a field for its outcome, and calibration (Brier score by agent, model family and tier) feeds back into the confidence the engine reports. **Portability**: the same spec is built into a Claude Code plugin, a portable Agent Skills package with the engine as a script, an MCP server usable by any MCP client, and an A2A endpoint for governance review.

### Where it is going

The next step is evidence. The eval harness in `eval/` replays past decisions with known outcomes; filling it with real cases will show, with numbers, whether v3 calibrates better than v2 at equal models. After twenty resolved predictions per agent the engine starts recalibrating their probabilities on its own.

---

## The 11 agents

| Agent | Color | Hat origin | Tier | Function |
|-------|-------|-----------|------|----------|
| **Meta-Orchestrator** | 🔵 Blue | Blue | deep | Plans the waves, submits every output to the engine, closes the decision |
| **Analytical** | ⚪ White | White | standard | Facts, metrics, verifiable sources, explicit gaps |
| **Emotional-Intuitive** | 🔴 Red | Red | standard | Stakeholder maps with deep drivers, emotional timeline, asymmetry detection |
| **Critical-Validator** | ⚫ Black | Black | deep | Premortem, risk map (6 categories × 5×5 severity), fallacy detection |
| **Optimizer** | 🟡 Yellow | Yellow | standard | Business case, value sequencing, quick wins, opportunity cost |
| **Creative-Generative** | 🟢 Green | Green | standard | Options with novelty scoring, cross-domain analogies, micro-tests |
| **Ethical-Governance** | 🟣 Purple | New | deep | Seven ethical dimensions, red lines, distributional analysis, arbitration |
| **Predictive-Strategic** | 🔮 Indigo | New | deep | Scenario simulation, sensitivity analysis, robustness ranking |
| **Systemic** | 🌐 Cyan | New | deep | Feedback loops, leverage points, cascade paths |
| **Foresight** | 🔭 Magenta | New | deep | Options × scenarios matrix, dominance analysis, antifragility detection |
| **Memory** | 💾 Gray | New | fast | Decision archive, pattern extraction, retrospective learning |

---

## Architecture

```
spec/                 the method: agents, rules.yaml, graphs, schemas, references, playbooks (no vendor names)
packages/core/        aits-core: the engine (validator, rules and gates, log, memory, calibration, export)
packages/cli/         aits CLI, aits-mcp server, runtime hook, A2A endpoint, adapter builder, eval harness
plugins/aits/         Claude Code adapter (generated from spec/)
skills/aits/          Agent Skills adapter with the engine as scripts/aits.mjs (generated from spec/)
aits.config.yaml      yours: which model serves each tier, memory embedder, signing key
```

The model produces, the engine validates. Adapters change per runtime; spec and engine do not.

---

## Installation

The engine needs Node.js 20 or later. Nothing else is installed: the engine ships as a single file inside each adapter.

### Claude Code (plugin marketplace)

```
/plugin marketplace add fabiolalli/aits-agents
/plugin install aits@aits-marketplace
```

This installs the 11 agents, the dashboard template, 4 commands, 7 playbooks, 10 execution graphs, references, schemas and the engine. The plugin registers the engine as an MCP server (`aits`) and adds three hooks: one at session start that tells the sub-agents where the plugin files are, and two that submit every sub-agent output to the engine automatically, whether the sub-agent runs in the foreground or in the background.

To update an existing install:

```
/plugin marketplace update aits-marketplace
/plugin update aits@aits-marketplace
```

Then restart Claude Code so the new hooks and MCP server are loaded.

### Any runtime that reads Agent Skills

Copy `skills/aits/` into the skills folder your runtime reads (for example `.agents/skills/aits/` in a project). The skill tells the orchestrating model to use the engine through MCP when available, otherwise through `node scripts/aits.mjs`, otherwise to declare `enforcement: absent`.

For claude.ai, zip the content of `skills/aits/` (with `SKILL.md` at the root of the archive) and upload it as a skill.

### Any MCP client

Point the client to the engine bundled in the skill folder:

```json
{
  "mcpServers": {
    "aits": { "command": "node", "args": ["/path/to/aits-agents/skills/aits/scripts/aits.mjs", "mcp"] }
  }
}
```

Tools: `aits_start_run`, `aits_plan`, `aits_submit`, `aits_status`, `aits_gate_respond`, `aits_skip_agent`, `aits_aggregate`, `aits_synthesize`, `aits_recall`, `aits_record_outcome`, `aits_calibration`, `aits_patterns`, `aits_verify`, `aits_export`. When the client supports MCP elicitation, gates are asked to the human directly through a form and a decision sent by the model is ignored. If nobody answers the form (headless sessions such as `claude -p`), the engine accepts the human's words relayed by the model in `user_quote` and records the gate as `agent_relayed`; set `gates.elicitation: never` to skip the form.

### Configuration

Copy `aits.config.example.yaml` to `aits.config.yaml` in your project. Without it the engine works, but it cannot tell which models produced the outputs: provenance stays empty and the report marks model diversity as unverified. Map each tier to the models you want, give each model a family label, and choose the memory embedder (local hashing by default, or any OpenAI-compatible embeddings endpoint, including a local one). To build the Claude Code plugin with your own tier mapping:

```
node skills/aits/scripts/aits.mjs build --target claude-code --config aits.config.yaml --out .
```

### Migrating from v2

v2 envelopes are accepted by the v3 engine. If you installed v2 as a plugin, update it from the marketplace. If you copied v2 files into `~/.claude/`, remove them first (`aits-*.md` in `agents/` and `commands/`, and the `playbooks/`, `references/`, `schemas/` folders), then install the plugin. Existing `.aits/memory/` records from v2 are not migrated automatically: the v3 memory starts empty and is filled by new runs.

---

## Quick start

### Claude Code

```
/aits:full    Should we launch Product X in the EU market in Q2?
/aits:quick   Approve this marketing budget reallocation?
/aits:diverge We're stuck between hiring and outsourcing. What else is possible?
/aits:board   for last
```

Claude Code namespaces plugin commands with the plugin name, so from 3.0.1 the commands are `/aits:full`, `/aits:quick`, `/aits:diverge` and `/aits:board` (in 3.0.0 they were `/aits:aits-full` and so on).

### Command line

```
aits start "Raise the SMB price from 29 to 35 EUR?" --graph go-no-go --mode autonomous
aits submit analytical.json
aits status
aits gate R3#1 proceed --quote "Go ahead, with grandfathering for older customers"
aits synthesize synthesis.json
aits export
```

`aits` is `node skills/aits/scripts/aits.mjs` (or `node plugins/aits/server/aits.mjs`). Run `aits help` for every command. A complete exported run is in [`examples/demo-pricing-change`](./examples/demo-pricing-change) (synthetic data).

---

## Inviolable rules

Declared in [`spec/rules.yaml`](./spec/rules.yaml) and evaluated by the engine after every output, in every HITL mode.

| Rule | Condition | Effect |
|------|-----------|--------|
| R1 | An agent other than the Meta-Orchestrator carries a decision | Output rejected, blocking gate |
| R2 | An agent reports a high-impact data gap | Analytical must run again, blocking gate |
| R2a | Analytical reports a high-impact data gap | Blocking gate |
| R3 | Critical-Validator finds severity ≥ 10 | Ethical-Governance or Predictive-Strategic must run, blocking gate |
| R4 | Critical-Validator says stop and Optimizer says go | Ethical-Governance must arbitrate, blocking gate |
| R5 | Creative-Generative proposes 4 or more options | Foresight must run, advisory gate |
| R6 | Ethical-Governance finds a red line | Blocking gate |
| R7 | The same agent fails schema validation twice | Blocking gate |
| R8 | Any agent raises a blocking `hitl_flag` | Blocking gate |

A human answers a gate with `proceed`, `provide_context`, `override` (waives the rule requirement, needs a justification and caps the engine confidence) or `abort`. The synthesis is refused while a blocking gate is open, a requirement is unmet, or an agent required by the playbook graph has neither run nor been skipped by a human.

---

## Engine confidence

The confidence reported to the user is computed by the engine, not declared by the model: the weakest confidence among critical inputs, lowered to `low` for an agent whose past forecasts do not beat the base rate, capped at `medium` when all outputs come from one model family (or families are not declared), and capped at `medium` after a human override. The report shows the declared and the computed confidence side by side, with the reasons.

---

## Memory, calibration, patterns

- `aits recall "<query>"` finds similar past decisions by meaning, not by tag.
- Every closed decision stores its predictions: the ones agents declare, plus the risks of severity ≥ 10 and the scenario probabilities.
- `aits outcome <decision> <prediction> 0|1` records what happened; `aits calibrate` reports Brier score, skill over the base rate and reliability by agent, model family and tier. From 20 resolved predictions per agent the engine fits a recalibration.
- `aits patterns scan` proposes new archetypes from clusters of three or more similar decisions; a human approves or rejects them.

Memory is local (`.aits/` in the project), can redact patterns before storing, and never leaves the machine unless you configure a remote embedder.

---

## Governance export

`aits export` writes `report.md`, `envelopes.json`, `log.jsonl`, `verification.json` and `trace.otlp.json` (OpenTelemetry GenAI conventions, structure and hashes only, no content). `aits export --otel` also sends the trace to a collector. With `aits keys generate` and `signing.key` in the configuration, every log entry is signed with your Ed25519 key. The report includes an evidence table for oversight and record-keeping duties, worded as support for, not proof of, compliance.

---

## Development

```
npm install
npm test               # engine, MCP server, CLI, hook, build and A2A tests
npm run typecheck
npm run check:neutral  # fails if a model or vendor name enters spec/
npm run build:adapters # regenerates plugins/aits and skills/aits from spec/
node scripts/make-example.mjs
node dist/aits.mjs eval eval
```

Edit the method in `spec/`, never in the generated adapters.

---

## Design principles

1. **Cognitive separation**: each agent has one function; the Critic never optimizes, the Optimizer never criticizes
2. **Sequence first, content second**: the order of agents changes the outcome; graphs make the order explicit and run independent agents in parallel
3. **Productive conflict**: conflict between agents is a feature; the conflict matrix codifies resolution
4. **Verifiable output**: every claim has a source or is labeled as a hypothesis; confidence is computed, not asserted
5. **Controlled completeness**: not every decision needs 11 perspectives; playbooks calibrate depth
6. **Handoff protocols**: agents are connected by explicit data contracts
7. **Memory and learning**: past decisions inform future ones; predictions are scored against outcomes
8. **Human-in-the-loop by design**: three modes, mandatory gates, every human answer logged with its channel
9. **Traceability as first-class**: every synthesis claim traces to its source agent and log entry
10. **Independence from models**: the method names no model; diversity across model families is measured, not assumed

---

## Philosophy

> *Thinking is the last skill we have yet to structure. AITS is an attempt.*
> — Fabio Lalli

AITS is opinionated about what a good decision process looks like. It believes that:

- **Speed and depth are different problems**: they deserve different tools
- **Ethics is not a final layer**: it is a perspective that deserves equal standing with optimization and risk
- **Emotion is data**: systematically mapped and named, not intuited and dismissed
- **Systems think non-linearly**: second-order effects matter, and linear analysis fails silently
- **The future is multiple**: decisions robust across scenarios beat decisions optimal for one
- **Memory compounds**: a framework that learns from its own history is more than the sum of its cases
- **The human is always the decision-maker**: AITS structures the process, not the judgment

---

## Contributing

Contributions welcome: playbooks and graphs for specific industries, pattern library entries, schema refinements, eval cases with known outcomes, adapters for other runtimes, translations of agent prompts.

---

## License

MIT. See [`LICENSE`](./LICENSE).

---

## Links

- **Website**: [aits.fabiolalli.com](https://aits.fabiolalli.com/en) · [versione italiana](https://aits.fabiolalli.com) · [demo](https://aits.fabiolalli.com/en/demo)
- **Author**: [Fabio Lalli](https://www.fabiolalli.com) · [GitHub](https://github.com/fabiolalli)
- **Origin book**: *Adaptive Intelligence Thinking System* (Fabio Lalli, Rome, 2025), the theoretical foundation this repository implements
- **Other books**: *Spatial Shift*, *L'AI non è quello che pensi*, *Sport Digital Transformation*
- **Standards used**: [Agent Skills](https://agentskills.io), [Model Context Protocol](https://modelcontextprotocol.io), [A2A](https://a2a-protocol.org), [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

---

*Designed for decisions that matter, on whatever model you trust.*
