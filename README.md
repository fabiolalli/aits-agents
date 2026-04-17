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

AITS is designed for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview). Agents live in your `.claude/agents/` directory; playbooks, references, and schemas live in dedicated subdirectories.

### Clone and install

```bash
# 1. Clone the repo somewhere
git clone https://github.com/fabiolalli/aits-agents.git
cd aits-agents

# 2. Copy agents to your Claude Code agents directory
mkdir -p ~/.claude/agents
cp aits-*.md ~/.claude/agents/

# 3. Copy the manifesto, commands, playbooks, references, and schemas
cp AITS.md ~/.claude/
mkdir -p ~/.claude/playbooks ~/.claude/references ~/.claude/schemas
cp playbooks/*.md ~/.claude/playbooks/
cp references/*.md ~/.claude/references/
cp schemas/*.json ~/.claude/schemas/
```

### Per-project installation

If you want AITS only for a specific project, install into the project's `.claude/` directory instead of your home directory:

```bash
mkdir -p .claude/agents .claude/playbooks .claude/references .claude/schemas
cp aits-*.md .claude/agents/
cp AITS.md .claude/
cp playbooks/*.md .claude/playbooks/
cp references/*.md .claude/references/
cp schemas/*.json .claude/schemas/
```

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
- **Books**: *Pelle Digitale*, *Spatial Shift*
- **Related**: [Claude Code documentation](https://docs.claude.com/en/docs/claude-code/overview)

---

*Built on Claude Code. Designed for decisions that matter.*
