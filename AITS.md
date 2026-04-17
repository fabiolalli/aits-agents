# AITS — Manifesto and Theory

## Adaptive Intelligence Thinking System

**Author**: Fabio Lalli
**Version**: 2.0
**Origin**: Evolution of the Six Thinking Hats model (Edward de Bono, 1985)

---

## The Problem

Complex decisions suffer from systematic cognitive biases: confirmation bias, groupthink, anchoring, framing effect. Traditional decision-making frameworks are either too simple (pros/cons) or too academic (decision trees with 47 nodes that nobody actually uses).

Edward de Bono's Six Thinking Hats model had the merit of making structured thinking accessible: wear one hat at a time, think from that perspective. But the world has changed. Today's decisions require dimensions that De Bono had not foreseen: AI ethics, predictive scenarios, systems thinking, regulatory compliance. And more importantly, today's decisions must be reproducible, traceable, and integrated with agentic AI systems — something a mental framework alone cannot provide.

## The Solution: AITS

AITS takes De Bono's fundamental insight — **separating thinking modes and then integrating them** — and evolves it into a complete operating system for decisions.

### From 6 hats to 11 agents

| De Bono | AITS 2.0 | What changes |
| --- | --- | --- |
| White (Facts) | **Analytical** | Structured JSON output, verifiable metrics, gap tracking, source confidence |
| Red (Emotions) | **Emotional-Intuitive** | Stakeholder maps with deep drivers, emotional timeline, asymmetry detection |
| Black (Criticism) | **Critical-Validator** | Formal premortem, 6-category risk map, fallacy detection, severity scoring |
| Yellow (Optimism) | **Optimizer** | Structured business case, value sequencing, quick wins, opportunity-cost analysis |
| Green (Creativity) | **Creative-Generative** | Cross-domain analogies, option generation with novelty scoring, micro-tests |
| Blue (Process) | **Meta-Orchestrator** | Formal orchestration with rules, conflict matrix, HITL gates, integrated synthesis |
| — | **Ethical-Governance** | *New*: fairness, red lines, accountability, AI compliance, equity metrics |
| — | **Predictive-Strategic** | *New*: scenario simulation, sensitivity analysis, robustness ranking |
| — | **Systemic** | *New*: feedback loops, leverage points, causal diagrams, unintended consequences |
| — | **Foresight** | *New*: options-scenarios matrix, early warnings, option-value theory |
| — | **Memory** | *New*: decision memory, pattern extraction, retrospective learning |

### From mental framework to operating system

De Bono proposed a mental exercise. AITS is a **system with formal rules**:

- **Structured outputs** — each agent produces JSON conforming to a published schema
- **Activation rules** — automatic triggers determine which agents are needed
- **Conflict management** — when agents conflict, a conflict matrix resolves or escalates
- **Decision log** — every decision is traceable, reproducible, auditable
- **Quality metrics** — the system measures its own effectiveness over time
- **Human-in-the-loop** — the human maintains control at every consequential step
- **Pattern library** — recurring decision archetypes accelerate future analyses

## Design Principles

### 1. Cognitive separation

Each agent has one and only one function. The Critic does not optimize. The Optimizer does not criticize. This separation prevents biases: when you wear all hats at once, the dominant hat always wins.

### 2. Sequence first, content second

The order in which you activate agents changes the outcome. The Meta-Orchestrator decides the optimal sequence based on the type of problem. An analysis that starts from data (White → Black → Yellow) produces different outputs than one that starts from creativity (Green → Red → Foresight).

### 3. Productive conflict

Conflict between agents is not a bug, it is a feature. When Black (risks) and Yellow (opportunities) conflict, a tension emerges that Ethics can arbitrate. Without this tension, decisions are either too cautious or too optimistic. In AITS 2.0, conflict resolution is codified in an explicit **conflict matrix** rather than left to improvisation.

### 4. Verifiable output

Every claim has a source or is marked as a hypothesis. Every risk has a probability and an impact. Every option has a validation criterion. No "in my opinion": data, evidence, structure. AITS 2.0 publishes **JSON schemas** that every agent output must satisfy.

### 5. Controlled completeness

Not every decision needs 11 perspectives. AITS provides multiple operational modes calibrated to the problem at hand: full analysis, rapid decision, divergent brainstorming, scenario exploration. The Meta-Orchestrator calibrates depth based on stakes, reversibility, and time pressure.

### 6. Handoff protocols

Agents don't work in isolation. Each agent declares what it **receives** from upstream agents and what it **passes** downstream. This handoff protocol is the circulatory system of AITS 2.0 — it's what transforms a collection of perspectives into a thinking system.

### 7. Memory and learning

AITS 2.0 remembers. Past decisions are stored as structured records; recurring patterns are extracted automatically. Before starting a new analysis, the system retrieves similar past decisions and uses their lessons. This transforms AITS from a static framework into a compounding asset.

### 8. Human-in-the-loop by design

AITS is a collaborative system, not an autonomous one. The human decision-maker is always the ultimate authority. The system provides three levels of human involvement:

- **Supervised** — the human reviews and can redirect after every agent (maximum control, maximum depth)
- **Autonomous** — the system runs freely but stops at mandatory gates (speed with safety nets)
- **Review** — the system completes the full analysis, then the human reviews everything (creative flow with structured review)

**Mandatory gates** ensure critical moments always require human judgment regardless of mode: high risks, significant data gaps, agent conflicts, ethical red lines. These gates are inviolable.

### 9. Traceability as a first-class concern

Every output carries its provenance. Every human intervention is logged. Every decision record becomes part of the corpus. Decision quality can be measured because decision processes are measurable.

## Implementation in Claude Code

This repository implements AITS as a sub-agent system for Claude Code. Each AITS agent becomes a `.md` file with a system prompt, tool access, structured output contract, and handoff protocol. The Meta-Orchestrator uses the `Task` tool to invoke other agents as sub-tasks, collect their JSON outputs, present checkpoints to the user, manage conflicts via the conflict matrix, and produce the final synthesis.

AITS 2.0 adds:

- **Schemas** (`/schemas`) — JSON Schema files that validate every agent output
- **Pattern library** (`references/pattern-library.md`) — recurring decision archetypes with known emotional, risk, and outcome profiles
- **Conflict matrix** (`references/conflict-matrix.md`) — explicit rules for resolving every pairwise agent disagreement
- **Taxonomies** (`references/taxonomies.md`) — shared vocabulary for risks, emotions, ethical categories, scenarios
- **Common contract** (`references/agent-contract.md`) — the shared structural template every agent follows

The result is a decision-making framework invocable with a single command that produces a multi-dimensional analysis — traceable, repeatable, actionable — with the human always in control.

---

## What's new in 2.0

- Explicit **handoff protocols** between every pair of agents (no more implicit coupling)
- **Temporal dimension** — emotional timelines, risk evolution curves, scenario time horizons
- **Two-level taxonomies** — surface category plus deep driver for risks, emotions, ethical concerns
- **Conflict matrix** — codified resolution rules for every agent-vs-agent tension
- **Pattern library** — pre-loaded decision archetypes with memory hooks
- **JSON schemas** — every output validated against a published contract
- **Memory integration** — agents query memory before analyzing, not after
- **HITL escalation logic** — agents can raise mandatory gates, not only the Meta-Orchestrator
- **Confidence propagation** — uncertainty flows through the system and reaches the final synthesis

---

*"Thinking is the last skill we have yet to structure. AITS is an attempt."*
— Fabio Lalli
