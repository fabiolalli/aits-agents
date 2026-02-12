# AITS Playbook: Innovation Sprint

A pre-configured AITS analysis optimized for rapid idea generation, evaluation, and validation planning — the structured brainstorming playbook.

## When to Use

- Innovation sprints and hackathons
- New business model exploration
- Product ideation sessions
- Competitive differentiation search
- "We're stuck and need fresh ideas"
- Design thinking divergent phase

## Pre-configured Sequence

```
Green (idea generation) → Red (emotional resonance) → Green (refinement round 2) → Foresight (scenario matrix) → Yellow (quick validation) → Blue (synthesis)
```

**HITL Mode**: Review (default) — creative flow benefits from uninterrupted generation, with structured review at the end.

## Agent Focus Areas

| Agent | Specific Focus for Innovation Sprint |
|-------|-------------------------------------|
| **Creative-Generative (Green) — Round 1** | Generate 7-10 options. Include at least 2 radical/unconventional ideas. Use cross-industry analogies. Apply "What would [company X] do?" lens. |
| **Emotional-Intuitive (Red)** | Which ideas generate excitement? Which create fear or resistance? What would delight users? Energy ranking of all options. |
| **Creative-Generative (Green) — Round 2** | Refine the top ideas based on Red's emotional insights. Combine ideas. Push the radical ones further. Add micro-test designs for the top 3-5. |
| **Foresight (Extended)** | Build options × scenarios matrix. Which ideas are robust across different futures? Which are high-risk/high-reward bets? |
| **Optimizer (Yellow)** | For the top 3 options: quick validation plan, resource requirements, timeline to first evidence, and expected value if successful. |

## Key Questions to Address

1. **What job-to-be-done are we solving?** (Problem reframing)
2. **What would a 10x solution look like?** (Moonshot thinking)
3. **What are adjacent industries doing?** (Cross-pollination)
4. **What would we do with unlimited resources?** (Constraint removal)
5. **What is the smallest experiment to test this?** (Lean validation)
6. **What would make users tell their friends?** (Viral potential)

## Creative Techniques to Apply

- **Reverse brainstorming**: How would we make this problem WORSE? Then invert.
- **SCAMPER**: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse
- **Analogical thinking**: "What would Spotify/Uber/Nintendo do?"
- **Constraint elimination**: "What if money/time/technology were no object?"
- **First principles**: Strip away assumptions, rebuild from fundamentals
- **10x thinking**: Not 10% better — 10x better. What changes at that scale?

## Known Cognitive Biases for This Decision Type

- **Anchoring on existing solutions**: "Let's improve what we have"
- **Functional fixedness**: Only seeing objects/systems in their current use
- **Groupthink**: Converging too quickly on safe ideas
- **Status quo bias**: "This is how we've always done it"
- **Feasibility filter too early**: Killing ideas before exploring them

The first round of Green should explicitly IGNORE feasibility. Feasibility comes later with Yellow.

## Expected Output

```json
{
  "ideas_generated": 0,
  "idea_portfolio": [
    {
      "name": "Idea name",
      "description": "What it does",
      "category": "incremental | adjacent | radical",
      "analogy": "Cross-industry inspiration",
      "emotional_score": {"excitement": "1-10", "fear": "1-10", "delight": "1-10"},
      "robustness_across_scenarios": "high | medium | low",
      "micro_test": {
        "what": "The experiment",
        "duration": "How long",
        "cost": "How much",
        "success_metric": "How we know it works"
      }
    }
  ],
  "top_3_recommended": ["With rationale for each"],
  "radical_moonshots": ["The wild ideas worth preserving even if not top 3"],
  "validation_roadmap": {
    "week_1": "First micro-test",
    "week_2_4": "Expanded validation",
    "month_2_3": "Build/don't build decision"
  },
  "energy_map": "Which ideas generated the most positive team energy"
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` in diverge mode. Set HITL mode to REVIEW. Invoke `aits-creative-generative` TWICE: first for broad generation (7-10 ideas, no feasibility filter), then after `aits-emotional-intuitive`, invoke Green again for refinement incorporating emotional insights. If ideas > 4 (which they should be), activate `aits-foresight` for the options-scenarios matrix. Finish with `aits-optimizer` for the validation roadmap. The objective is to produce a rich portfolio of validated ideas with concrete next steps — NOT to make a final decision.
