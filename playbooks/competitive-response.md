# AITS Playbook: Competitive Response

A pre-configured AITS analysis optimized for responding to a competitive threat, market disruption, or strategic move by a competitor.

## When to Use

- Competitor launches a disruptive product
- New entrant threatens market position
- Price war initiated by competitor
- Competitor acquires a key player in the ecosystem
- Market shift that changes competitive dynamics
- Loss of a major customer to a competitor

## Pre-configured Sequence

```
White (competitive intelligence) → Red (market perception) → Green (response options) → Black (risk of each response) → Yellow (value optimization) → Predictive (competitive dynamics) → Foresight (response options matrix) → Blue (synthesis)
```

**HITL Mode**: Autonomous (default) — competitive response often requires speed. Mandatory gates still apply.

## Agent Focus Areas

| Agent | Specific Focus for Competitive Response |
|-------|---------------------------------------|
| **Analytical (White)** | Competitor analysis: what exactly did they do? Market data: customer sentiment, market share shifts, pricing changes. Our position: strengths, weaknesses, assets we can leverage. |
| **Emotional-Intuitive (Red)** | How are customers feeling? Fear of switching? Curiosity about the competitor? Loyalty drivers. How is our team feeling? Panic vs. confidence. |
| **Creative-Generative (Green)** | Generate 5-7 response options ranging from "do nothing" to "aggressive counter-move." Include asymmetric responses (don't fight where they're strong). Cross-industry counter-strategy analogies. |
| **Critical-Validator (Black)** | For each response option: what could go wrong? Risk of escalation. Risk of distraction from core strategy. "Are we reacting or responding strategically?" |
| **Optimizer (Yellow)** | For the top 3 responses: expected value, timeline, resource requirements. Which response maximizes our position while minimizing resource expenditure? |
| **Predictive-Strategic (Indigo)** | Game theory: how will the competitor respond to our response? Second and third-order competitive dynamics. Market evolution over 6/12/24 months. |
| **Foresight (Extended)** | Response options × competitive scenarios matrix. Which response is most robust across different competitor follow-up moves? |

## Key Questions to Address

1. **Is this a real threat or noise?** (Threat assessment)
2. **What is the competitor's true objective?** (Intent analysis)
3. **Where are we genuinely vulnerable?** (Honest self-assessment)
4. **What asymmetric advantage do we have?** (Leverage identification)
5. **What does the customer actually want?** (Customer-centric response)
6. **Is the best response to NOT respond?** (Strategic patience evaluation)

## Response Framework

### Response Options Spectrum

| Type | Description | When to Use |
|------|-------------|-------------|
| **Ignore** | Do nothing, stay the course | Threat is minor or competitor is bluffing |
| **Absorb** | Acknowledge and adapt incrementally | Threat is real but manageable |
| **Counter** | Direct competitive response | Must defend core market position |
| **Leapfrog** | Skip the competitor's move, go beyond | Have the capability to jump ahead |
| **Redirect** | Change the competitive dimension entirely | Can't win on their terms, change the game |
| **Ally** | Partner with others against the threat | Threat is industry-wide, collective response needed |

## Known Cognitive Biases for This Decision Type

- **Reactive bias**: Feeling compelled to respond immediately to every competitor move
- **Competitor fixation**: Focusing on the competitor instead of the customer
- **Loss aversion**: Overweighting what we might lose vs. what we could gain
- **Escalation trap**: Matching every move, leading to a race to the bottom
- **Anchoring on past competitive dynamics**: "This is how we always responded"

## Expected Output

```json
{
  "threat_assessment": {
    "severity": "low | medium | high | critical",
    "urgency": "immediate | weeks | months",
    "competitor_intent": "What they're really trying to achieve",
    "our_vulnerability": "Where we're genuinely exposed"
  },
  "response_options": [
    {
      "type": "ignore | absorb | counter | leapfrog | redirect | ally",
      "description": "What we would do",
      "expected_outcome": "What we expect to happen",
      "resources_required": "Cost and effort",
      "timeline": "How fast we can execute",
      "risk": "What could go wrong",
      "competitor_likely_response": "How they'll react"
    }
  ],
  "recommended_response": {
    "primary": "The recommended response",
    "rationale": "Why this response",
    "execution_plan": {"immediate": [], "week_1_2": [], "month_1_3": []},
    "success_metrics": ["How we know it's working"],
    "escalation_triggers": ["When to escalate to a stronger response"]
  },
  "competitive_dynamics": {
    "6_months": "Expected market state",
    "12_months": "Expected market state",
    "our_target_position": "Where we want to be"
  }
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` with this playbook context. Set HITL mode to AUTONOMOUS for speed — competitive response values timeliness. Activate `aits-foresight` to evaluate response options across competitor scenarios (mandatory if options > 4). The Predictive-Strategic agent must model the competitor's likely counter-response using game theory reasoning. The final synthesis must include a recommended response with an execution timeline and escalation triggers. Emphasize that responding is a choice — "do nothing" is always a valid option if the analysis supports it.
