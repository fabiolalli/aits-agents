# AITS — Adaptive Intelligence Thinking System

**Version 2.0** · by [Fabio Lalli](https://github.com/fabiolalli)

A decision-making framework for Claude Code, evolved from Edward de Bono's *Six Thinking Hats* (1985) into a multi-agent operating system with formal rules, structured outputs, conflict resolution, memory, and human-in-the-loop governance.

---

## What is AITS

De Bono proposed a mental exercise: wear one thinking hat at a time, think from that perspective, then integrate. AITS keeps that core insight — **separating thinking modes and then integrating them** — and evolves it into a complete system with:

- **11 cognitive agents** — each with a single-focus cognitive function, structured JSON output, and a clear handoff protocol
- **A Meta-Orchestrator** that governs the flow, validates outputs against schemas, resolves conflicts via a codified matrix, and enforces seven inviolable rules
- **A pattern library** of recurring decision archetypes with pre-loaded emotional, risk, and outcome signatures
- **A memory** that accumulates past decisions and their retrospective outcomes, so AITS becomes a learning system rather than a static framework
- **Three HITL modes** — supervised, autonomous, review — with mandatory gates that cannot be bypassed

See [`AITS.md`](./AITS.md) for the full manifesto and design principles.

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

### Where it is going

Every decision recorded in `.aits/memory/` becomes raw material for the next one. After a handful of similar decisions the system begins extracting patterns on its own, and the Pattern Library grows from seed examples into a real corpus of empirical archetypes.

The next chapters are already visible in the repository: richer playbooks for specific industries, integration with external validators, multilingual agents, and adaptive orchestration that learns which agent sequences produce the best-calibrated outputs on which problem types. AITS is built to evolve, and the public CHANGELOG is the current audit trail of that evolution.

---

## The 11 Agents

| Agent | Color | Hat origin | Function |
|-------|-------|-----------|----------|
| **Meta-Orchestrator** | 🔵 Blue | Blue | Governs the flow, validates outputs, resolves conflicts, produces the synthesis |
| **Analytical** | ⚪ White | White | Facts, metrics, verifiable sources, explicit gaps |
| **Emotional-Intuitive** | 🔴 Red | Red | Stakeholder maps with deep drivers, emotional timeline, asymmetry detection |
| **Critical-Validator** | ⚫ Black | Black | Premortem, risk map (6 categories × 5×5 severity), fallacy detection |
| **Optimizer** | 🟡 Yellow | Yellow | Business case, value sequencing, quick wins, opportunity cost |
| **Creative-Generative** | 🟢 Green | Green | Options with novelty scoring, cross-domain analogies, micro-tests |
| **Ethical-Governance** | 🟣 Purple | New | Seven ethical dimensions, red lines, distributional analysis, arbitration |
| **Predictive-Strategic** | 🔮 Indigo | New | Scenario simulation, sensitivity analysis, robustness ranking |
| **Systemic** | 🌐 Cyan | New | Feedback loops, leverage points, cascade paths |
| **Foresight** | 🔭 Magenta | New | Options × scenarios matrix, dominance analysis, antifragility detection |
| **Memory** | 💾 Gray | New | Decision archive, pattern extraction, retrospective learning |

---

## Installation

AITS is designed for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) and ships as a **plugin marketplace**. The recommended way to install it is via Claude Code's plugin system.

### Option A — Install via plugin marketplace (recommended)

From inside Claude Code:

```
/plugin marketplace add fabiolalli/aits-agents
/plugin install aits@aits-marketplace
```

This single command installs all 12 agents, 4 slash commands, 7 playbooks, the conflict matrix, the pattern library, and all JSON schemas. Files land in `~/.claude/plugins/cache/aits-marketplace/aits/` and are exposed by Claude Code automatically.

### Option B — Install as a local plugin (for development or air-gapped use)

```bash
git clone https://github.com/fabiolalli/aits-agents.git ~/aits-agents
```

Then in Claude Code:

```
/plugin marketplace add ~/aits-agents
/plugin install aits@aits-marketplace
```

### Option C — Manual copy (legacy v1 layout)

Useful if you prefer files directly under `~/.claude/` without going through the plugin loader.

```bash
git clone https://github.com/fabiolalli/aits-agents.git
cd aits-agents/plugins/aits

mkdir -p ~/.claude/agents ~/.claude/commands ~/.claude/playbooks ~/.claude/references ~/.claude/schemas
cp agents/*.md       ~/.claude/agents/
cp commands/*.md     ~/.claude/commands/
cp playbooks/*.md    ~/.claude/playbooks/
cp references/*.md   ~/.claude/references/
cp schemas/*.json    ~/.claude/schemas/
cp ../../AITS.md     ~/.claude/
```

### Per-project installation

If you want AITS only for a specific project, install into the project's `.claude/` directory instead of your home directory:

```bash
mkdir -p .claude/agents .claude/commands .claude/playbooks .claude/references .claude/schemas
cp plugins/aits/agents/*.md       .claude/agents/
cp plugins/aits/commands/*.md     .claude/commands/
cp plugins/aits/playbooks/*.md    .claude/playbooks/
cp plugins/aits/references/*.md   .claude/references/
cp plugins/aits/schemas/*.json    .claude/schemas/
cp AITS.md .claude/
```

### Migrating from v1 (manual install) to v2 plugin

If you previously installed AITS by copying files into `~/.claude/agents/`, `~/.claude/commands/`, and `~/.claude/playbooks/`, you must remove the v1 files **before** installing the plugin — otherwise Claude Code will load both copies and you will see duplicate agents.

```bash
# 1. Backup
BAK="$HOME/.claude/backups/aits-v1-pre-plugin-$(date +%Y%m%d)"
mkdir -p "$BAK"
cp ~/.claude/agents/aits-*.md "$BAK/" 2>/dev/null
cp ~/.claude/commands/aits-{full,quick,diverge,board}.md "$BAK/" 2>/dev/null
[ -d ~/.claude/playbooks  ] && cp -r ~/.claude/playbooks  "$BAK/"
[ -d ~/.claude/references ] && cp -r ~/.claude/references "$BAK/"
[ -d ~/.claude/schemas    ] && cp -r ~/.claude/schemas    "$BAK/"
[ -f ~/.claude/AITS.md    ] && cp ~/.claude/AITS.md "$BAK/"

# 2. Remove the originals
rm ~/.claude/agents/aits-*.md
rm ~/.claude/commands/aits-{full,quick,diverge,board}.md
rm -rf ~/.claude/playbooks ~/.claude/references ~/.claude/schemas
rm -f ~/.claude/AITS.md

# 3. Install the plugin (inside Claude Code)
#    /plugin marketplace add fabiolalli/aits-agents
#    /plugin install aits@aits-marketplace
```

After install, the v2 files live under `~/.claude/plugins/cache/aits-marketplace/aits/` and are exposed automatically. You can delete the backup once you have verified the plugin works.

### Memory directory

AITS writes decision records to `.aits/memory/` in the working directory. This directory is created automatically on first use. It is local-only — decisions never leave your machine.

```
.aits/
├── memory/
│   ├── index.json
│   ├── patterns.json
│   └── [YYYY-MM-DD]_[title-slug].json
└── dashboard/
    └── [title-slug].html
```

---

## Quick start

Four commands give you the full system:

### `/aits-full` — deep supervised analysis

Full multi-agent sequence with checkpoints after every agent. Default for high-stakes or irreversible decisions.

```
/aits-full

Should we launch Product X in the EU market in Q2?
```

### `/aits-quick` — rapid decision

Minimal 3-agent flow (Analytical → Critical → Optimizer) with automatic escalation when inviolable rules trigger.

```
/aits-quick

Approve this marketing budget reallocation?
```

### `/aits-diverge` — divergent brainstorming

Creative-first sequence (Creative → Emotional → Foresight) that runs uninterrupted and presents a drill-down review at the end.

```
/aits-diverge

We're stuck between hiring vs. outsourcing. What else is possible?
```

### `/aits-board` — dashboard

View the current state of an in-flight analysis or generate an HTML dashboard for a completed one.

```
/aits-board
/aits-board for 2026-04-17_product-x-launch
/aits-board for pattern product-launch-cold-start
```

---

## The seven inviolable rules

These are enforced mechanically by the Meta-Orchestrator regardless of HITL mode:

1. **Only Blue closes the decision** — no other agent produces a final decision
2. **Missing high-impact data → return to White** — triggers mandatory gate
3. **Risk severity ≥ 10 from Black → Ethical or Predictive must activate** — triggers mandatory gate
4. **Black/Yellow L3 contradiction → Ethical arbitrates** — triggers mandatory gate
5. **≥ 4 viable options from Green → Foresight must evaluate** — advisory gate
6. **Any red-line flag from Purple → mandatory HITL gate** — non-negotiable
7. **Schema validation failure (after one retry) → mandatory HITL gate**

---

## Repository structure

```
aits-agents/
├── README.md                               # This file
├── CHANGELOG.md                            # 2.0 evolution from 1.x
├── AITS.md                                 # Manifesto and design principles
│
├── aits-meta-orchestrator.md               # Blue — the flow governor
├── aits-analytical.md                      # White
├── aits-emotional-intuitive.md             # Red
├── aits-critical-validator.md              # Black
├── aits-optimizer.md                       # Yellow
├── aits-creative-generative.md             # Green
├── aits-ethical-governance.md              # Purple
├── aits-predictive-strategic.md            # Indigo
├── aits-systemic.md                        # Cyan
├── aits-foresight.md                       # Magenta
├── aits-memory.md                          # Gray
│
├── aits-full.md                            # Command: supervised full analysis
├── aits-quick.md                           # Command: autonomous quick decision
├── aits-diverge.md                         # Command: review-mode brainstorming
├── aits-board.md                           # Command: dashboard view
├── aits-dashboard.md                       # HTML dashboard template
│
├── playbooks/                              # Decision-type-specific sequences
│   ├── go-no-go.md
│   ├── product-launch.md
│   ├── ma-due-diligence.md
│   ├── risk-assessment.md
│   ├── innovation-sprint.md
│   ├── ethical-impact.md
│   └── competitive-response.md
│
├── references/                             # Architectural foundations (new in 2.0)
│   ├── agent-contract.md                   # Shared 10-section structure
│   ├── conflict-matrix.md                  # Pairwise conflict resolution
│   ├── taxonomies.md                       # Shared vocabulary
│   └── pattern-library.md                  # Decision archetypes
│
├── schemas/                                # JSON Schema (new in 2.0)
│   ├── _envelope.schema.json               # Common output envelope
│   ├── meta-orchestrator.schema.json
│   ├── analytical.schema.json
│   ├── emotional-intuitive.schema.json
│   ├── critical-validator.schema.json
│   ├── optimizer.schema.json
│   ├── creative-generative.schema.json
│   ├── ethical-governance.schema.json
│   ├── predictive-strategic.schema.json
│   ├── systemic.schema.json
│   ├── foresight.schema.json
│   └── memory-record.schema.json
│
└── examples/                               # Usage examples (work in progress)
```

---

## What's new in 2.0

Short summary — see [`CHANGELOG.md`](./CHANGELOG.md) for the full evolution log.

- **Handoff protocols** — every agent declares what it receives from upstream agents and what it passes to downstream agents (no more implicit coupling)
- **Conflict matrix** — pairwise resolution rules with L1-L4 severity scale (no more improvisation)
- **Pattern library** — 10+ pre-loaded decision archetypes (restructuring-survivor-syndrome, AI-adoption-competence-fear, founder-exit-identity-loss, etc.) with typical emotional and risk signatures
- **Shared taxonomies** — 6 risk categories, 8 deep emotional drivers, 7 ethical dimensions, 10 scenario frames, explicit novelty and robustness levels
- **JSON schemas** — every agent output validated against a published contract; validation failures trigger retries and gates
- **Common envelope** — every output carries confidence, pattern match, handoff packets, HITL flags, gaps/assumptions, and quality self-check
- **Memory agent** — SAVE / RECALL / LEARN procedures that make AITS a learning system
- **HITL escalation** — any agent can raise a mandatory gate, not only the Meta-Orchestrator
- **Temporal dimension** — emotional timelines, risk evolution, scenario horizons, decay curves
- **Two-level taxonomies** — surface category plus deep driver throughout

---

## Design principles

1. **Cognitive separation** — each agent has one function; the Critic never optimizes, the Optimizer never criticizes
2. **Sequence first, content second** — the order of agents changes the outcome; the Meta-Orchestrator calibrates sequence to problem type
3. **Productive conflict** — conflict between agents is a feature; the conflict matrix codifies resolution
4. **Verifiable output** — every claim has a source or is explicitly labeled hypothesis; confidence is always reported
5. **Controlled completeness** — not every decision needs 11 perspectives; playbooks and commands calibrate depth
6. **Handoff protocols** — agents are connected by explicit data contracts, not implicit coupling
7. **Memory and learning** — past decisions inform future ones; patterns emerge from the corpus
8. **Human-in-the-loop by design** — three modes, mandatory gates, logged interventions
9. **Traceability as first-class** — every synthesis claim traces to its source agent

---

## Philosophy

> *Thinking is the last skill we have yet to structure. AITS is an attempt.*
> — Fabio Lalli

AITS is opinionated about what a good decision process looks like. It believes that:

- **Speed and depth are different problems** — they deserve different tools
- **Ethics is not a final layer** — it is a perspective that deserves equal standing with optimization and risk
- **Emotion is data** — systematically mapped and named, not intuited and dismissed
- **Systems think non-linearly** — second-order effects matter, and linear analysis fails silently
- **The future is multiple** — decisions robust across scenarios beat decisions optimal for one
- **Memory compounds** — a framework that learns from its own history is more than the sum of its cases
- **The human is always the decision-maker** — AITS structures the process, not the judgment

---

## Contributing

Contributions welcome. Areas of active interest:

- **New playbooks** for specific industries or decision types
- **New pattern library entries** from repeated decisions in specific domains
- **Schema refinements** based on real-world usage feedback
- **Examples** in the `examples/` directory showing full analyses for common decisions
- **Translations** of agent prompts to languages other than English and Italian

See `CONTRIBUTING.md` (forthcoming) for the contribution process.

---

## License

MIT. See `LICENSE`.

---

## Links

- **Author**: [Fabio Lalli](https://www.fabiolalli.com) · [GitHub](https://github.com/fabiolalli)
- **Origin book**: *Adaptive Intelligence Thinking System* (Fabio Lalli, Rome, 2025), the theoretical foundation this repository implements
- **Other books**: *Spatial Shift*, *L'AI non è quello che pensi*, *Sport Digital Transformation*
- **Related**: [Claude Code documentation](https://docs.claude.com/en/docs/claude-code/overview)

---

*Built on Claude Code. Designed for decisions that matter.*
