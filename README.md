# AITS — Adaptive Intelligence Thinking System for Claude Code

A system of cognitive agents for structured decision-making, inspired by the Six Thinking Hats of Edward de Bono and reimagined by **Fabio Lalli** as an evolved framework with 11 agents featuring orchestration, JSON output, and interaction rules.

> **AITS is not a collection of experts to call one at a time.
> It is a thinking system where agents activate in logical sequence, pass context to each other, and converge toward a traceable decision.**

---

## 📥 Installation

### Option 1: Global (available in all projects)

```bash
git clone https://github.com/fabiolalli/aits-agents.git
cp -r aits-agents/orchestration/* ~/.claude/agents/
cp -r aits-agents/core/* ~/.claude/agents/
cp -r aits-agents/extended/* ~/.claude/agents/
cp -r aits-agents/commands/* ~/.claude/commands/
```

### Option 2: Per project (only in the current project)

```bash
git clone https://github.com/fabiolalli/aits-agents.git
mkdir -p .claude/agents .claude/commands
cp -r aits-agents/orchestration/* .claude/agents/
cp -r aits-agents/core/* .claude/agents/
cp -r aits-agents/extended/* .claude/agents/
cp -r aits-agents/commands/* .claude/commands/
```

Restart Claude Code to load the agents.

---

## 🚀 How to Use It

### Full analysis of a problem

```
/aits-full

"Should we launch product X in market Y by Q2?"
```

The Meta-Orchestrator (Blue) automatically activates the necessary agents, collects JSON outputs, manages conflicts, and produces an integrated synthesis with a decision and action plan.

### Quick decision

```
/aits-quick

"Is it worth acquiring company Z?"
```

Fast track: Analytical → Critical-Validator → Optimizer → Blue Synthesis. For when you need solid answers in a short time.

### Divergent brainstorming

```
/aits-diverge

"How can we differentiate ourselves in the premium wellness market?"
```

Creative-Generative → Emotional-Intuitive → Foresight → Blue Synthesis. To explore opportunity spaces before converging.

### Direct invocation

You can also call a single agent:

```
"Give me a critical analysis of this business plan"      → Critical-Validator (Black)
"What creative alternatives do we have?"                  → Creative-Generative (Green)
"Map the ethical risks of this decision"                  → Ethical-Governance
"What future scenarios should we consider?"               → Predictive-Strategic
```

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
├── orchestration/
│   └── meta-orchestrator.md           # 🔵 The system director
│
├── core/
│   ├── analytical.md                  # ⚪ Factual base
│   ├── emotional-intuitive.md         # 🔴 Perceptive dimension
│   ├── critical-validator.md          # ⚫ Stress test
│   ├── optimizer.md                   # 🟡 Value and opportunities
│   ├── creative-generative.md         # 🟢 Alternatives and innovation
│   ├── ethical-governance.md          # 🟣 Fairness and compliance
│   └── predictive-strategic.md        # 🔮 Future scenarios
│
├── extended/
│   ├── systemic.md                    # 🌐 System and feedback loops
│   └── foresight.md                   # 🔭 Options-scenarios matrix
│
└── commands/
    ├── aits-full.md                   # Full analysis
    ├── aits-quick.md                  # Quick decision
    └── aits-diverge.md               # Divergent brainstorming
```

---

## ⚙️ System Rules

These rules are encoded in the Meta-Orchestrator and govern the flow automatically:

1. **Only Blue closes the decision** — no other agent can produce a final decision
2. **Missing data → White** — if an agent flags insufficient data, the flow returns to the Analytical agent
3. **High risk → Ethical or Predictive** — if Black flags a "high" risk, activating Ethical-Governance or Predictive-Strategic is mandatory
4. **Black/Yellow conflict → Ethical arbitrates** — when criticism and optimism clash, Ethical-Governance decides the direction
5. **Numerous options → Foresight** — too many alternatives? Foresight evaluates them across multiple scenarios

---

## 📊 Quality Metrics

The AITS system tracks decision-making process quality:

- **Analysis completeness**: % of dimensions covered by activated agents
- **Inter-agent coherence**: outputs are logically consistent with each other
- **Iterations before convergence**: how many cycles are needed to reach the decision
- **% valid JSON outputs**: agents produce output in the expected format
- **Human override**: how many times the user had to correct the flow
- **Scenario robustness**: the decision holds under different conditions

---

## 💡 Best Practices

1. **Start with context**: the more context you provide for the initial problem, the better each agent's analysis will be
2. **Use `/aits-full` for important decisions**: the full flow covers all cognitive dimensions
3. **Use `/aits-quick` for day-to-day**: not every decision needs 11 perspectives
4. **Trust Blue**: the Meta-Orchestrator knows when to activate whom — let it work
5. **Read the decision log**: traceability is one of the key advantages of AITS

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

