# Agent Contract — Common Structural Template

This document defines the **shared structure** every AITS agent follows. It is the contract that guarantees interoperability, reproducibility, and predictability across the system.

Every agent file in the repository (meta-orchestrator, analytical, emotional-intuitive, critical-validator, optimizer, creative-generative, ethical-governance, predictive-strategic, systemic, foresight, memory) conforms to this template.

---

## Why a shared contract

In AITS 1.x, each agent had its own structure. This worked for individual use but created friction when agents needed to pass context to each other, when the Meta-Orchestrator needed to know what to expect, and when humans needed to review outputs consistently.

In 2.0, every agent follows the same 10-section structure. This means:

- The Meta-Orchestrator knows exactly where to find what it needs from any agent
- Handoffs are formal rather than improvised
- Humans reviewing outputs see consistent formatting
- New agents can be added without breaking existing flows

---

## The 10-section structure

Every agent file follows this outline, in this order:

### 1. Frontmatter
Runtime-neutral frontmatter: `id`, `description`, `tier` (`deep`, `standard`, `fast`), `color`, `capabilities` (abstract: `file_read`, `file_write`, `shell`, `subagent_invoke`, `web_search`, `web_fetch`). Each adapter translates these into its own runtime format (agent name, tool list, model setting). No model or vendor name appears in the spec.

### 2. Identity
Who the agent is, its origin (which hat, if any), its function in one sentence.

### 3. Cognitive Mission
The singular cognitive operation this agent performs. One paragraph, no padding.

### 4. Role in the System
- Which agents typically precede this one
- Which agents typically follow
- Which system rules this agent can trigger
- Which system rules this agent must respect

### 5. Handoff Protocol (new in 2.0)

Explicit declaration of inputs and outputs. Every agent declares:

```
### Receives from
- [Agent Name] → [field names it consumes]

### Passes to
- [Agent Name] → [field names it produces for that target]
```

This is the circulatory system of AITS. Without it, agents are islands.

### 6. Operating Rules
Numbered rules that constrain the agent's behavior. Typically 5-8 rules. Rules are **constraints**, not suggestions. They are enforceable during review.

### 7. Output Contract

The JSON schema the agent must produce. This section references the formal schema in `/schemas/<agent-name>.schema.json` and shows a canonical example.

Every output includes these **common envelope fields** (defined in `schemas/_envelope.schema.json`):

- `agent` — agent identifier
- `version` — AITS envelope version (`"3.0"`; `"2.0"` still accepted)
- `timestamp` — ISO 8601
- `confidence` — `"high" | "medium" | "low"` with `reasoning`
- `summary` — one-paragraph narrative summary
- `pattern_match` — result of memory query (see §9)
- `main_output` — agent-specific payload
- `handoff_packets` — structured data destined for downstream agents
- `hitl_flags` — list of any mandatory gates this agent raises
- `gaps_or_assumptions` — explicit list of what's missing or assumed
- `quality_self_check` — agent's self-evaluation against its quality metrics
- `provenance` (3.0) — runtime, model family, model, tier and run index. Filled by the adapter or the orchestrator from the user configuration, never invented by the agent
- `predictions` (3.0) — explicit, resolvable probabilities (`id`, `statement`, `probability`, `resolve_by`) used for calibration. Critical-Validator, Predictive-Strategic and Foresight must emit them; the engine also derives them from risk maps and scenarios

### 8. HITL Escalation Triggers (new in 2.0)

Explicit conditions under which the agent raises a **mandatory gate**. In AITS 1.x, only the Meta-Orchestrator could trigger gates; in 2.0, any agent can raise one when it detects a threshold crossing.

Example format:

```
Raises mandatory gate when:
- [specific condition] → gate reason: [X]
- [specific condition] → gate reason: [Y]
```

### 9. Memory Query (new in 2.0)

Similar past decisions are retrieved by the engine (semantic memory) when the run starts and passed to each agent by the Meta-Orchestrator as `memory_context`. The protocol is:

1. Read the `memory_context` received with the task; agents do not search `.aits/memory/` themselves
2. Search `references/pattern-library.md` for named archetypes that fit
3. Use the lessons as additional context, never as evidence for the current case
4. Report the match in the `pattern_match` field of the output

### 10. Failure Modes, Quality Metrics, Operational Parameters

- **Failure modes**: what this agent must not do (violations of the cognitive separation principle)
- **Quality metrics**: how the output is judged
- **Operational parameters**: style, tone, focus

---

## Envelope field reference

### confidence

```json
{
  "level": "high|medium|low",
  "reasoning": "One sentence explaining the basis for this confidence level",
  "upstream_dependency": "Agents whose output, if wrong, would invalidate this confidence"
}
```

### pattern_match

```json
{
  "matched": true,
  "pattern_id": "restructuring-survivor-guilt",
  "source": "pattern-library|memory|both",
  "match_confidence": 0.82,
  "reference": "references/pattern-library.md#restructuring-survivor-guilt or memory:2025-09-12_foo",
  "lessons_applied": ["..."]
}
```

### handoff_packets

A map from target agent name to the payload destined for that agent. The payload is the subset of this agent's output that the target actually consumes.

```json
{
  "critical-validator": { "candidate_risks": [...] },
  "ethical-governance": { "fairness_concerns": [...] },
  "meta-orchestrator": { "synthesis_summary": "..." }
}
```

### hitl_flags

```json
[
  {
    "trigger": "data_gap_high_impact",
    "severity": "blocking|advisory",
    "description": "...",
    "recommended_action": "Return to Analytical with these specific questions: [...]"
  }
]
```

### gaps_or_assumptions

```json
{
  "gaps": [{ "description": "...", "impact_if_unfilled": "...", "how_to_fill": "..." }],
  "assumptions": [{ "statement": "...", "testable": true, "risk_if_wrong": "..." }]
}
```

### quality_self_check

```json
{
  "metrics": [
    { "metric": "specificity", "self_score": "high|medium|low", "evidence": "..." },
    { "metric": "completeness", "self_score": "high|medium|low", "evidence": "..." }
  ],
  "known_limitations": ["..."]
}
```

---

## Enforcement

From 3.0, enforcement is performed by the AITS engine (`aits-core`), not by the model. Every envelope is submitted to the engine, which:

1. Validates it against its schema with a deterministic validator
2. Evaluates the inviolable rules declared in `rules.yaml`
3. Opens gates that only a human can close, and records unmet requirements that block the synthesis
4. Appends every event to a hash-chained decision log, optionally signed with the user's key

A failed validation is retried once with the engine's error list as correction instructions; a second failure for the same agent opens a mandatory gate (rule R7). When no engine is reachable, the orchestrator declares `enforcement: absent` in the synthesis: the rules then hold only as instructions.

---

## Versioning

This contract is versioned. Agents declare the contract version they comply with in their `version` field. The Meta-Orchestrator enforces compatibility: all agents in a single analysis must declare the same major version.

Current version: **3.0**. Envelopes declaring 2.0 are accepted by the 3.0 engine.
