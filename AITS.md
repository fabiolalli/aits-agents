# AITS — Manifesto and Theory

## Adaptive Intelligence Thinking System

**Author**: Fabio Lalli
**Version**: 3.0.1
**Origin**: Evolution of the Six Thinking Hats model (Edward de Bono, 1985), through the book *La mente adattiva. Pensare insieme alle macchine* (Fabio Lalli, Egea, 2025)

---

## Genesis

AITS is not a repository that stumbled into a theory. It is a theory that, progressively, found its way into a repository.

### 1985: the first intuition (Edward de Bono)

Edward de Bono observed something that still holds: when the brain tries to analyse, criticise, create, and optimise at the same time, the dominant mode wins and silences the others. He proposed to separate the modes, one hat at a time, and to integrate them sequentially. A mental exercise, elegant and productive, built for a world in which the only cognitive actor at the table was a person.

The *Six Thinking Hats* got the core right: separating thinking modes, and integrating them on purpose. It also left open, by construction, everything that four decades later would become unavoidable. Ethics as a perspective that deserves equal standing. Predictive scenarios. Systems thinking. Regulatory compliance. The fact that, today, alongside humans, cognitive agents made of software now sit at the same table and actively participate in the analysis.

### 2025: the book

The book *La mente adattiva. Pensare insieme alle macchine* (Egea, 2025), written in Rome in 2025, is the first attempt to update De Bono for the era of hybrid intelligence. The starting question was narrow and direct: how do we keep thinking well when AI generates, suggests, and simulates alongside us? The answer proposed in the book is built on three moves.

First, turn the hats into **agents**. The hat was a metaphor for a mental mode. The agent is a functional unit, embodiable by a human, by an AI, or more often by a human-AI pair dedicated to a specific cognitive function. Agents can work in sequence, but also in parallel, with feedback loops between them. It is a leap: no longer only metaphors guiding human thought, but operational cognitive units that have capabilities, interfaces, and interactions.

Second, **expand the set**. Four agents are direct evolutions of the hats (Analytical, Emotional-Intuitive, Critical-Validator, Optimizer). Four are new, because they cover dimensions that 1985 could not foresee: Creative-Generative (enhanced by generative AI), Ethical-Governance, Predictive-Strategic, Meta-Orchestrator as intelligent coordination entity. Eight agents total in the book.

Third, define the **guiding principles**. Hybrid intelligence as the foundation (not human alone, not AI alone, always a loop between the two). Dynamic adaptivity (the sequence and the weight of the agents change with the problem). Integrated ethics (not a final check, but a perspective that travels through the whole process).

### 2026: from book to code

The book described a framework. Version 1 of this repository turned that framework into working software, released as open source from the first commit.

Claude Code provided the technical substrate the book was already describing implicitly: a sub-agent system where each cognitive agent becomes a file with its own prompt, tools, and output contract, and where a Meta-Orchestrator invokes them via the `Task` tool, collects their outputs, and composes the synthesis. What in the book was an "orchestra of cognitive agents" on Claude Code became eleven `.md` files and a set of commands. The framework started running on real problems.

Using it changed what we understood about it. Some things from the book held up well: the cognitive separation, the multiple operational modes, the primacy of the human-in-the-loop. Others emerged only in practice, as missing pieces: the need for structured outputs comparable across agents, explicit handoff protocols, codified conflict resolution rules, a memory that prevents the system from re-analysing the same pattern as if for the first time, gates that cannot be bypassed even in autonomous mode. Version 2 is the answer to those missing pieces.

### 2.0: the system

Version 2 is the first release in which AITS behaves as a system rather than a collection of well-written prompts. Eleven agents, not eight. Three new additions where the gaps were widest: Systemic (feedback loops, leverage points, unintended consequences), Foresight (options-scenarios matrix, antifragility detection), Memory (decision archive, pattern extraction, compound learning). Published JSON schemas that validate every agent output. A conflict matrix with codified pairwise resolution rules. A pattern library of recurring decision archetypes. Shared taxonomies for risks, emotions, ethical dimensions, and scenarios. Three human-in-the-loop modes. Seven inviolable rules enforced mechanically.

### 3.0: the enforced, portable system

Version 2 wrote the rules; version 3 makes them hold. In v2 the rules lived in the orchestrator's prompt, so their strength depended on the model following them. In v3 a deterministic engine validates every output, evaluates the rules, opens gates that only a human can close and records everything in a hash-chained log. The method is separated from the runtime and names no model: agents declare a capability tier, the user decides which model serves it. Perspectives that estimate risks and probabilities run independently, on different model families when available, because agents of the same family share their errors. Every prediction is scored against what actually happened, and that score changes how much the engine trusts each agent.

Version 3.0.1 comes from running the system in real sessions. It moves the record of each agent output from the orchestrator to the runtime: the agent's own last message reaches the engine directly, and the orchestrator can no longer reshape what gets recorded. The same sessions showed what the method still lacks, in particular gates that reopen for a gap the human has already accepted; that is the work of 3.1.

What stays constant, from De Bono to the book to v3.0, is the original insight: to think well you separate the modes, then integrate them on purpose, with a human always at the centre. Everything else is evolution.

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

### 10. Independence from models

The method names no model and no vendor. Each agent declares the reasoning it needs (a capability tier); which model serves each tier is the user's choice. The diversity between the models that contributed to a decision is measured and reported, never assumed, and a decision produced by a single model family cannot claim the highest confidence.

## Implementation

AITS is implemented in four layers.

- **Spec** (`spec/`): the method. Agents, inviolable rules in `rules.yaml`, execution graphs, JSON schemas, conflict matrix, taxonomies, pattern library, playbooks. No vendor names.
- **Engine** (`aits-core`): validator, rules and gates, hash-chained and optionally signed decision log, aggregation of independent runs with minority report, semantic memory, calibration, OpenTelemetry export. It never calls a model.
- **Adapters**: a Claude Code plugin (sub-agents, commands, MCP server, hook), a portable Agent Skills package with the engine as a script, an MCP server for any client, an A2A endpoint for governance review.
- **Configuration** (`aits.config.yaml`): the user's mapping from tiers to models, the memory embedder and the signing key.

The Meta-Orchestrator plans the agents in waves from the playbook graph, submits every output to the engine, presents the gates to the human, and closes the decision only when the engine accepts the synthesis. The result is a decision-making framework that produces a multi-dimensional analysis, traceable and repeatable, with the human always in control, on whatever model they trust.

---

## What's new in 3.0.1

- **The runtime keeps the record**: a sub-agent's output is submitted by a runtime hook when the agent finishes; the orchestrator's copy only adds provenance
- **Attempts, not submissions**: rule R7 and multi-run counts follow the agent's attempts
- **Exact envelope in every agent**, generated from the schemas and tested against them
- **Gates in unattended sessions** close with the human's relayed words, recorded as such
- **Plugin commands** `/aits:full`, `/aits:quick`, `/aits:diverge`, `/aits:board`

## What's new in 3.0

- **Deterministic enforcement**: schemas, rules and gates evaluated by code; the synthesis is refused while a rule is unmet
- **Human gates with provenance**: every answer records whether it came from the human directly or was relayed
- **Hash-chained, signable decision log** and an export bundle for oversight and record-keeping
- **Capability tiers** instead of model names; **diversity policy** with independent runs and minority report
- **Engine confidence**: computed from the weakest input, model diversity, human overrides and past calibration
- **Semantic memory**, **predictions with outcomes**, **calibration** by agent, model family and tier, **learned patterns** approved by a human
- **Execution graphs**: independent agents run in parallel waves
- **Portability**: Claude Code plugin, Agent Skills package, MCP server, A2A endpoint, OpenTelemetry traces
- **Eval harness** to measure each release against decisions with known outcomes

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
