# Agent Contract — Common Structural Template

This document defines the **shared structure** every AITS 2.0 agent follows. It is the contract that guarantees interoperability, reproducibility, and predictability across the system.

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
Standard Claude Code sub-agent frontmatter: `name`, `description` (with `<example>` blocks), `color`, `tools`.

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

This is the circulatory system of AITS 2.0. Without it, agents are islands.

### 6. Operating Rules
Numbered rules that constrain the agent's behavior. Typically 5-8 rules. Rules are **constraints**, not suggestions. They are enforceable during review.

### 7. Output Contract

The JSON schema the agent must produce. This section references the formal schema in `/schemas/<agent-name>.schema.json` and shows a canonical example.

Every output includes these **common envelope fields** (defined in `schemas/_envelope.schema.json`):

- `agent` — agent identifier
- `version` — AITS version (currently `"2.0"`)
- `timestamp` — ISO 8601
- `confidence` — `"high" | "medium" | "low"` with `reasoning`
- `summary` — one-paragraph narrative summary
- `pattern_match` — result of memory query (see §9)
- `main_output` — agent-specific payload
- `handoff_packets` — structured data destined for downstream agents
- `hitl_flags` — list of any mandatory gates this agent raises
- `gaps_or_assumptions` — explicit list of what's missing or assumed
- `quality_self_check` — agent's self-evaluation against its quality metrics

### 8. HITL Escalation Triggers (new in 2.0)

Explicit conditions under which the agent raises a **mandatory gate**. In AITS 1.x, only the Meta-Orchestrator could trigger gates; in 2.0, any agent can raise one when it detects a threshold crossing.

Example format:

```
Raises mandatory gate when:
- [specific condition] → gate reason: [X]
- [specific condition] → gate reason: [Y]
```

### 9. Memory Query (new in 2.0)

At the start of each run, the agent queries `.aits/memory/` and `references/pattern-library.md` for similar past decisions. The protocol is:

1. Build a query signature from the current decision context
2. Search `memory/index.json` for matches above a confidence threshold
3. Search `pattern-library.md` for named archetypes that fit
4. Load lessons and include them as additional context
5. Report the match in the `pattern_match` field of the output

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
  "reference": "references/pattern-library.md#restructuring-survivor-guilt or .aits/memory/2025-09-foo.json",
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

The Meta-Orchestrator validates every incoming agent output against the schema before integrating it. If an output fails validation:

1. The Meta-Orchestrator attempts one automatic retry with explicit correction instructions
2. If the retry also fails, a mandatory gate is raised for human resolution
3. The decision log records the validation failure and its resolution

This ensures the system cannot degrade silently.

---

## Versioning

This contract is versioned. Agents declare the contract version they comply with in their `version` field. The Meta-Orchestrator enforces compatibility: all agents in a single analysis must declare the same major version.

Current version: **2.0**.
