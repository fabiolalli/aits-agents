# AITS — Adaptive Intelligence Thinking System for Claude Code

A system of cognitive agents for structured decision-making, inspired by the Six Thinking Hats of Edward de Bono and reimagined by **Fabio Lalli** as an evolved framework with 11 agents featuring orchestration, JSON output, and interaction rules.

> **AITS is not a collection of experts to call one at a time.
> It is a thinking system where agents activate in logical sequence, pass context to each other, and converge toward a traceable decision.**

---

## 📥 Installation

### Option 1: Global (available in all projects)

```bash
git clone https://github.com/fabiolalli/aits-agents.git
mkdir -p ~/.claude/agents ~/.claude/commands ~/.claude/playbooks

# Core agents
cp aits-agents/aits-meta-orchestrator.md ~/.claude/agents/
cp aits-agents/aits-analytical.md aits-agents/aits-emotional-intuitive.md aits-agents/aits-critical-validator.md aits-agents/aits-optimizer.md aits-agents/aits-creative-generative.md aits-agents/aits-ethical-governance.md aits-agents/aits-predictive-strategic.md ~/.claude/agents/
cp aits-agents/aits-systemic.md aits-agents/aits-foresight.md ~/.claude/agents/

# Memory & Dashboard system
cp aits-agents/aits-memory.md aits-agents/aits-dashboard.md ~/.claude/agents/

# Commands
cp aits-agents/aits-full.md aits-agents/aits-quick.md aits-agents/aits-diverge.md aits-agents/aits-board.md ~/.claude/commands/

# Playbooks
cp aits-agents/playbooks/*.md ~/.claude/playbooks/
```

### Option 2: Per project (only in the current project)

```bash
git clone https://github.com/fabiolalli/aits-agents.git
mkdir -p .claude/agents .claude/commands .claude/playbooks

# Core agents
cp aits-agents/aits-meta-orchestrator.md .claude/agents/
cp aits-agents/aits-analytical.md aits-agents/aits-emotional-intuitive.md aits-agents/aits-critical-validator.md aits-agents/aits-optimizer.md aits-agents/aits-creative-generative.md aits-agents/aits-ethical-governance.md aits-agents/aits-predictive-strategic.md .claude/agents/
cp aits-agents/aits-systemic.md aits-agents/aits-foresight.md .claude/agents/

# Memory & Dashboard system
cp aits-agents/aits-memory.md aits-agents/aits-dashboard.md .claude/agents/

# Commands
cp aits-agents/aits-full.md aits-agents/aits-quick.md aits-agents/aits-diverge.md aits-agents/aits-board.md .claude/commands/

# Playbooks
cp aits-agents/playbooks/*.md .claude/playbooks/
```

Restart Claude Code to load the agents.

---

## 🚀 How to Use It

### Full analysis of a problem

```
/aits-full

"Should we launch product X in market Y by Q2?"
```

The Meta-Orchestrator (Blue) automatically activates the necessary agents, collects JSON outputs, manages conflicts, and produces an integrated synthesis with a decision and action plan. In full mode, you get a **checkpoint after every agent** where you can approve, correct, or redirect.

### Quick decision

```
/aits-quick

"Is it worth acquiring company Z?"
```

Fast track: Analytical → Critical-Validator → Optimizer → Blue Synthesis. Runs **autonomously** — only stops if a mandatory gate triggers (high risk, data gaps, conflicts).

### Divergent brainstorming

```
/aits-diverge

"How can we differentiate ourselves in the premium wellness market?"
```

Creative-Generative → Emotional-Intuitive → Foresight → Blue Synthesis. Runs the full creative sequence, then presents everything for **review** at the end.

### Decision dashboard

```
/aits-board
```

Check the current state of an ongoing analysis: which agents have completed, what they found, any open gates, and your options to intervene.

### Using Playbooks

Playbooks are pre-configured analysis templates optimized for common decision types. They set the agent sequence, focus areas, cognitive bias checklists, and output format automatically.

```
/aits-full
"Should we acquire company Z?" → Automatically loads the M&A Due Diligence playbook
```

Available playbooks:

| Playbook | Best for | Agent Focus |
|----------|----------|-------------|
| **Go/No-Go** | Binary strategic decisions | White → Black → Yellow → Ethical → Predictive |
| **Product Launch** | Launch readiness assessment | White → Red → Green → Black → Yellow → Predictive |
| **M&A Due Diligence** | Merger & acquisition evaluation | White → Systemic → Black → Yellow → Ethical → Predictive → Foresight |
| **Risk Assessment** | Comprehensive risk identification | White → Black → Systemic → Ethical → Predictive → Yellow |
| **Innovation Sprint** | Rapid idea generation & validation | Green → Red → Green(v2) → Foresight → Yellow |
| **Ethical Impact** | Ethical & social impact analysis | White → Ethical → Red → Black → Systemic → Predictive |
| **Competitive Response** | Responding to competitive threats | White → Red → Green → Black → Yellow → Predictive → Foresight |

The Meta-Orchestrator automatically detects which playbook matches your problem. You can also specify one: "Use the M&A playbook for this analysis."

### Visual Dashboard

Generate an interactive HTML dashboard to visualize your analysis:

```
/aits-full generate dashboard
"Should we launch product X in market Y?"
```

Or after any analysis: "Generate a visual dashboard for this analysis"

The dashboard shows: agent flow graph, key findings, risk heatmap, confidence meter, conflict timeline, action plan, and HITL log. Open the generated HTML file in any browser.

### Decision Memory

AITS learns from your past decisions. After each analysis, the decision record is saved to `.aits/memory/`. On subsequent analyses, the Meta-Orchestrator recalls similar past decisions and applies learned patterns:

- Which agent sequences worked best for similar problems
- Recurring risks and how they were mitigated
- Where human overrides improved the analysis
- Cognitive biases that appeared in similar decisions

```
"What similar decisions have I made?"     → Search memory
"Show me patterns from past decisions"    → Display learned patterns
"Rate the outcome of the Q1 launch"       → Update retrospective
```

### Direct invocation

You can also call a single agent:

```
"Give me a critical analysis of this business plan"      → Critical-Validator (Black)
"What creative alternatives do we have?"                  → Creative-Generative (Green)
"Map the ethical risks of this decision"                  → Ethical-Governance
"What future scenarios should we consider?"               → Predictive-Strategic
```

---

## 🤝 Human-in-the-Loop

AITS is designed for **collaborative decision-making** between the AI system and the human decision-maker. The human is always the ultimate authority — AITS provides the structured process.

### Three Modes

| Mode | Behavior | Default for |
|------|----------|-------------|
| **Supervised** | Checkpoint after every agent. You approve, correct, or redirect before proceeding. | `/aits-full` |
| **Autonomous** | No checkpoints except at mandatory gates. Fast execution with safety stops. | `/aits-quick` |
| **Review** | Full execution, then complete review with drill-down and modification options. | `/aits-diverge` |

### Switching modes

You can switch at any time during an analysis:
- "Switch to supervised" — start getting checkpoints
- "Switch to autonomous" — let it run, stop only at gates
- "Switch to review" — complete remaining agents and present everything

### Mandatory Gates

These always pause the flow regardless of mode — because the decision requires human judgment:

- ⚠️ **High risk** — the Critical-Validator flags risk level "high" or "critical"
- ⚠️ **Data gaps** — the Analytical reports missing data with high impact
- ⚠️ **Agent conflict** — two agents produce contradictory recommendations
- ⚠️ **Red line** — the Ethical-Governance flags an inviolable ethical limit
- ⚠️ **Loop detected** — the flow returns to an already-completed agent (e.g., back to White for missing data)

### At every checkpoint you can

1. ✅ **Proceed** — continue to the next agent
2. ✏️ **Correct** — modify the output or add context
3. 🔀 **Redirect** — change the sequence
4. 🔁 **Redo** — re-run the agent with different focus
5. ⏭️ **Switch mode** — change to autonomous or review

### Decision traceability

Every human intervention is logged in the `decision_log`, including what was modified and why. This ensures full traceability of the decision-making process.

---

## 🧠 The 11 Agents

### Orchestration

| Agent | Color | Mission |
|-------|-------|---------|
| **Meta-Orchestrator** | 🔵 Blue | Govern the flow, integrate outputs, produce the final decision |

### Core (7 agents)

| Agent | Color | Mission |
|-------|-------|---------|
| **Analytical** | ⚪ White | Reduce uncertainty with verifiable data and metrics |
| **Emotional-Intuitive** | 🔴 Red | Surface perceptions, emotions, and resistance |
| **Critical-Validator** | ⚫ Black | Stress-test hypotheses, risks, and fallacies |
| **Optimizer** | 🟡 Yellow | Maximize value, opportunities, quick wins |
| **Creative-Generative** | 🟢 Green | Generate alternatives and lateral innovation |
| **Ethical-Governance** | 🟣 Purple | Evaluate fairness, compliance, social impact |
| **Predictive-Strategic** | 🔮 Indigo | Simulate future scenarios and sensitivities |

### Extended (optional, 2 agents)

| Agent | Mission |
|-------|---------|
| **Systemic** 🌐 | Map feedback loops and system levers |
| **Foresight** 🔭 | Evaluate robustness of options across multiple scenarios |

---

## 📁 Repository Structure

```
aits-agents/
├── README.md
├── AITS.md                            # Manifesto and model theory
│
├── aits-meta-orchestrator.md          # 🔵 The system director (orchestration)
│
├── aits-analytical.md                 # ⚪ Factual base (core)
├── aits-emotional-intuitive.md        # 🔴 Perceptive dimension (core)
├── aits-critical-validator.md         # ⚫ Stress test (core)
├── aits-optimizer.md                  # 🟡 Value and opportunities (core)
├── aits-creative-generative.md        # 🟢 Alternatives and innovation (core)
├── aits-ethical-governance.md         # 🟣 Fairness and compliance (core)
├── aits-predictive-strategic.md       # 🔮 Future scenarios (core)
│
├── aits-systemic.md                   # 🌐 System and feedback loops (extended)
├── aits-foresight.md                  # 🔭 Options-scenarios matrix (extended)
│
├── aits-memory.md                     # 🧠 Decision Memory system
├── aits-dashboard.md                  # 📊 Visual Dashboard HTML generator
│
├── aits-full.md                       # Full analysis — supervised mode (command)
├── aits-quick.md                      # Quick decision — autonomous mode (command)
├── aits-diverge.md                    # Divergent brainstorming — review mode (command)
├── aits-board.md                      # Decision dashboard (command)
│
└── playbooks/                         # 📋 Pre-configured decision playbooks
    ├── go-no-go.md                    # Strategic Go/No-Go decisions
    ├── product-launch.md              # Product launch assessment
    ├── ma-due-diligence.md            # M&A due diligence
    ├── risk-assessment.md             # Comprehensive risk analysis
    ├── innovation-sprint.md           # Rapid idea generation
    ├── ethical-impact.md              # Ethical impact analysis
    └── competitive-response.md        # Competitive threat response
```

### Runtime directories (auto-created)

```
.aits/                                 # Created automatically during use
├── memory/                            # Decision Memory (local, private)
│   ├── index.json                     # Index of all past decisions
│   ├── patterns.json                  # Extracted patterns (auto-updated)
│   └── *.json                         # Individual decision records
│
└── dashboard/                         # Visual Dashboards (HTML files)
    └── *.html                         # One file per analysis
```

---

## ⚙️ System Rules

These rules are encoded in the Meta-Orchestrator and govern the flow automatically:

1. **Only Blue closes the decision** — no other agent can produce a final decision
2. **Missing data → White** — if an agent flags insufficient data, the flow returns to the Analytical agent
3. **High risk → Ethical or Predictive** — if Black flags a "high" risk, activating Ethical-Governance or Predictive-Strategic is mandatory
4. **Black/Yellow conflict → Ethical arbitrates** — when criticism and optimism clash, Ethical-Governance decides the direction
5. **Numerous options → Foresight** — too many alternatives? Foresight evaluates them across multiple scenarios
6. **Red line violation → mandatory human gate** — ethical limits always require explicit human acknowledgment
7. **Mandatory gates are inviolable** — they always pause the flow regardless of HITL mode

---

## 📊 Quality Metrics

The AITS system tracks decision-making process quality:

- **Analysis completeness**: % of dimensions covered by activated agents
- **Inter-agent coherence**: outputs are logically consistent with each other
- **Iterations before convergence**: how many cycles are needed to reach the decision
- **% valid JSON outputs**: agents produce output in the expected format
- **Human override**: how many times the user corrected or redirected the flow
- **Scenario robustness**: the decision holds under different conditions
- **Mandatory gates triggered**: how many safety stops were needed
- **Human corrections**: what the user changed and how it affected the outcome

---

## 💡 Best Practices

1. **Start with context**: the more context you provide for the initial problem, the better each agent's analysis will be
2. **Use `/aits-full` for important decisions**: the full flow covers all cognitive dimensions with human oversight at every step
3. **Use `/aits-quick` for day-to-day**: fast execution with safety stops only when they matter
4. **Use `/aits-diverge` for creativity**: uninterrupted generation followed by structured review
5. **Use `/aits-board` to check progress**: the dashboard gives you control without disrupting the flow
6. **Trust Blue, but verify**: the Meta-Orchestrator makes good sequencing decisions, but your corrections at checkpoints improve the output
7. **Read the decision log**: traceability — including your own interventions — is one of the key advantages of AITS
8. **Switch modes freely**: start supervised, switch to autonomous when you're confident, switch back if something unexpected emerges

---

## 📖 Origins

AITS is an evolution of the **Six Thinking Hats** model by Edward de Bono (1985). Fabio Lalli reimagined the framework by adding agents for ethics, strategic prediction, systemic thinking, and foresight, and introduced formal orchestration with interaction rules, structured outputs, and quality metrics.

To dive deeper into the theory: see [AITS.md](AITS.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch for your change
3. Test the agents with real decision-making problems
4. Document the results
5. Open a Pull Request

---

## 📄 License

MIT License — Use, modify, distribute. Attribution appreciated.

**Created by Fabio Lalli** | AITS — Adaptive Intelligence Thinking System
