# AITS — Manifesto and Theory

## Adaptive Intelligence Thinking System

**Author**: Fabio Lalli
**Version**: 1.1
**Origin**: Evolution of the Six Thinking Hats model (Edward de Bono, 1985)

---

## The Problem

Complex decisions suffer from systematic cognitive biases: confirmation bias, groupthink, anchoring, framing effect. Traditional decision-making frameworks are either too simple (pros/cons) or too academic (decision trees with 47 nodes that nobody actually uses).

Edward de Bono's Six Thinking Hats model had the merit of making structured thinking accessible: wear one hat at a time, think from that perspective. But the world has changed. Today's decisions require dimensions that De Bono had not foreseen: AI ethics, predictive scenarios, systems thinking, regulatory compliance.

## The Solution: AITS

AITS takes De Bono's fundamental insight — **separating thinking modes and then integrating them** — and evolves it into a complete system:

### From 6 hats to 11 agents

| De Bono | AITS | What changes |
|---------|------|-------------|
| White (Facts) | **Analytical** | Structured JSON output, verifiable metrics, gap tracking |
| Red (Emotions) | **Emotional-Intuitive** | Emotional maps for stakeholders, trust and resistance drivers |
| Black (Criticism) | **Critical-Validator** | Formal premortem, risk map, logical fallacy detection |
| Yellow (Optimism) | **Optimizer** | Structured business case, quick wins, value sequencing |
| Green (Creativity) | **Creative-Generative** | Cross-domain analogies, micro-tests for rapid validation |
| Blue (Process) | **Meta-Orchestrator** | Formal orchestration with rules, decision log, integrated synthesis |
| — | **Ethical-Governance** | *New*: fairness, red lines, accountability, AI compliance |
| — | **Predictive-Strategic** | *New*: scenario simulation, sensitivity analysis |
| — | **Systemic** | *New*: feedback loops, system levers, causal diagrams |
| — | **Foresight** | *New*: options-scenarios matrix, early warnings |

### From mental framework to operating system

De Bono proposed a mental exercise. AITS is a **system with formal rules**:

- **Structured outputs**: each agent produces JSON with defined fields
- **Activation rules**: automatic triggers that determine which agents are needed
- **Conflict management**: when two agents conflict, there is a designated arbiter
- **Decision log**: every decision is traceable and reproducible
- **Quality metrics**: the system measures its own effectiveness
- **Human-in-the-loop**: the human decision-maker maintains control at every stage

## Design Principles

### 1. Cognitive separation
Each agent has one and only one function. The Critic does not optimize. The Optimizer does not criticize. This separation prevents biases: when you wear all hats at once, the dominant hat always wins.

### 2. Sequence first, content second
The order in which you activate agents changes the outcome. The Meta-Orchestrator decides the optimal sequence based on the type of problem. An analysis that starts from data (White → Black → Yellow) produces different outputs than one that starts from creativity (Green → Red → Foresight).

### 3. Productive conflict
Conflict between agents is not a bug, it is a feature. When Black (risks) and Yellow (opportunities) conflict, a tension emerges that Ethics can arbitrate. Without this tension, decisions are either too cautious or too optimistic.

### 4. Verifiable output
Every claim has a source or is marked as a hypothesis. Every risk has a probability and an impact. Every option has a validation criterion. No "in my opinion": data, evidence, structure.

### 5. Controlled completeness
Not every decision needs 11 perspectives. AITS provides three operational modes: full analysis, rapid decision, divergent brainstorming. The Meta-Orchestrator calibrates depth based on the problem.

### 6. Human-in-the-loop by design
AITS is a collaborative system, not an autonomous one. The human decision-maker is always the ultimate authority. The system provides three levels of human involvement:

- **Supervised**: the human reviews and can redirect after every agent — maximum control, maximum depth
- **Autonomous**: the system runs freely but stops at mandatory gates — speed with safety nets
- **Review**: the system completes the full analysis, then the human reviews everything — creative flow with structured review

**Mandatory gates** ensure that critical moments always require human judgment, regardless of mode: high risks, data gaps, agent conflicts, and ethical red lines. These gates cannot be bypassed because the most consequential moments in a decision process are precisely the ones where human judgment matters most.

The decision log tracks not only what each agent produced, but also what the human corrected, redirected, or overrode — making the entire decision process transparent and reproducible.

## Implementation in Claude Code

This repository implements AITS as a sub-agent system for Claude Code. Each AITS agent becomes a `.md` file with a system prompt, tool access, and output format. The Meta-Orchestrator uses the `Task` tool to invoke other agents as sub-tasks, collect their JSON outputs, present checkpoints to the user, and produce the final synthesis.

The result is a decision-making framework that you can invoke with a single command and that produces a multi-dimensional analysis that is traceable, repeatable, and actionable — with the human always in control.

---

*"Thinking is the last skill we have yet to structure. AITS is an attempt."*
— Fabio Lalli
