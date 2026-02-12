# AITS Memory — Decision Memory & Pattern Library

Manage the AITS decision memory: save completed analyses, retrieve relevant patterns from past decisions, and build organizational decision intelligence over time.

## What It Does

AITS Memory provides three functions:

### 1. SAVE — Record a completed analysis
After any AITS analysis completes, the Meta-Orchestrator can save the decision record to the memory library. Each record captures:
- The problem type and classification
- The agent sequence used
- Key findings from each agent
- Conflicts encountered and how they were resolved
- Human interventions (corrections, redirects, overrides)
- The final decision and confidence level
- Outcome quality rating (added later via `/aits-replay`)

### 2. RECALL — Retrieve relevant past decisions
Before starting a new analysis, the Meta-Orchestrator can search the memory library for similar past decisions. Relevant patterns include:
- Similar problem types → which agent sequences worked best
- Similar industries/contexts → which risks and opportunities recurred
- Previous mistakes → what to watch out for
- Successful patterns → what to replicate

### 3. LEARN — Extract patterns across decisions
Over time, the memory library accumulates enough decisions to identify meta-patterns:
- Which agent sequences produce the highest-confidence decisions?
- Which types of decisions most frequently trigger mandatory gates?
- Where do human overrides most often improve the analysis?
- What cognitive biases recur in specific decision types?

## Memory Storage Format

Decisions are stored as JSON files in `.aits/memory/` directory:

```
.aits/
└── memory/
    ├── index.json                              # Index of all decisions
    ├── 2026-02-12_product-launch-decision.json  # Individual decision records
    ├── 2026-02-15_ma-evaluation.json
    └── patterns.json                            # Extracted patterns (auto-updated)
```

### index.json

```json
{
  "version": "1.0",
  "total_decisions": 0,
  "decisions": [
    {
      "id": "uuid",
      "date": "ISO-8601",
      "title": "Short description of the decision",
      "problem_type": "strategic | operational | ethical | creative | mixed",
      "playbook_used": "go-no-go | product-launch | ... | custom",
      "agents_activated": ["list of agents"],
      "hitl_mode": "supervised | autonomous | review",
      "confidence_level": "high | medium | low",
      "decision": "Brief summary of the final decision",
      "outcome_rating": null,
      "tags": ["industry", "context", "keywords"],
      "file": "filename.json"
    }
  ]
}
```

### Individual Decision Record

```json
{
  "id": "uuid",
  "metadata": {
    "date": "ISO-8601",
    "title": "Decision title",
    "problem_type": "strategic",
    "playbook_used": "go-no-go",
    "duration_minutes": 0
  },
  "problem_statement": "The original problem as described by the user",
  "context": "Key context provided",
  "analysis": {
    "agent_sequence": ["aits-analytical", "aits-critical-validator", "..."],
    "agent_outputs": [
      {
        "agent": "aits-analytical",
        "key_findings": ["Summary of findings"],
        "confidence": "high | medium | low",
        "data_gaps": ["Identified gaps"]
      }
    ],
    "conflicts": [
      {
        "agents": ["aits-critical-validator", "aits-optimizer"],
        "nature": "Description of the conflict",
        "resolution": "How it was resolved",
        "arbiter": "aits-ethical-governance"
      }
    ],
    "mandatory_gates_triggered": [
      {
        "trigger": "High risk from Black",
        "user_action": "Acknowledged and proceeded",
        "impact": "Led to activation of Ethical agent"
      }
    ]
  },
  "human_interventions": [
    {
      "checkpoint": "After Analytical (White)",
      "type": "correction | redirect | redo | mode_switch",
      "description": "What the user changed",
      "impact_on_outcome": "How it affected the final decision"
    }
  ],
  "decision": {
    "recommendation": "The final decision",
    "confidence": "high | medium | low",
    "action_plan": [],
    "kill_criteria": []
  },
  "retrospective": {
    "outcome_rating": null,
    "actual_outcome": null,
    "what_aits_got_right": [],
    "what_aits_missed": [],
    "lessons_learned": [],
    "date_reviewed": null
  },
  "patterns_extracted": {
    "effective_sequence": true,
    "bias_detected": [],
    "recurring_risk": [],
    "human_override_quality": null
  }
}
```

### patterns.json

```json
{
  "version": "1.0",
  "last_updated": "ISO-8601",
  "total_decisions_analyzed": 0,
  "sequence_effectiveness": {
    "strategic_decisions": {
      "best_sequence": ["most effective agent order"],
      "average_confidence": "high | medium | low",
      "common_mandatory_gates": ["most frequent triggers"],
      "sample_size": 0
    }
  },
  "recurring_biases": [
    {
      "bias": "Confirmation bias",
      "frequency": "How often detected",
      "decision_types": ["Which types most affected"],
      "effective_counter": "What helped mitigate it"
    }
  ],
  "human_override_patterns": {
    "override_rate": "% of checkpoints where user intervened",
    "most_overridden_agent": "Which agent is most frequently corrected",
    "override_quality": "How often overrides improved the outcome"
  },
  "risk_patterns": {
    "most_common_risks": ["Across all decisions"],
    "most_underestimated_risks": ["Risks that were flagged low but materialized"],
    "best_mitigations": ["Mitigations that proved effective"]
  }
}
```

## How to Use

### Automatic save (recommended)
The Meta-Orchestrator should save every completed analysis automatically. At the end of each synthesis, it writes the decision record to `.aits/memory/`.

### Manual commands
- **"Save this analysis to memory"** — explicitly save the current analysis
- **"What similar decisions have I made?"** — search memory for related past decisions
- **"Show me patterns from my past decisions"** — display the patterns.json insights
- **"Rate the outcome of [decision]"** — update a past decision's retrospective

## Privacy & Security

- All memory is stored locally in the project's `.aits/memory/` directory
- No data is sent externally
- Users can delete any decision record at any time
- Sensitive content should be summarized, not stored verbatim
- The `.aits/` directory can be added to `.gitignore` for private decisions

## Instructions

When the Meta-Orchestrator completes a synthesis, it should:
1. Generate a unique ID and filename based on date and decision title
2. Write the decision record JSON to `.aits/memory/[filename].json`
3. Update `.aits/memory/index.json` with the new entry
4. If there are 5+ decisions in memory, update `.aits/memory/patterns.json` with extracted patterns

When starting a new analysis, the Meta-Orchestrator should:
1. Check if `.aits/memory/index.json` exists
2. If yes, search for decisions with similar problem_type, tags, or playbook
3. If relevant past decisions exist, load their key findings and patterns
4. Pass relevant patterns as additional context to the first agent in the sequence
5. Note in the synthesis which patterns from memory influenced the analysis
