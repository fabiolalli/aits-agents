# AITS Playbook: Strategic Go/No-Go

A pre-configured AITS analysis optimized for binary strategic decisions: proceed or don't proceed.

## When to Use

- Product launch decisions
- Market entry decisions
- Partnership or investment go/no-go
- Project continuation vs. termination
- Any "should we or shouldn't we?" decision

## Pre-configured Sequence

```
White (data) → Black (risks) → Yellow (value) → Ethical (impact) → Predictive (scenarios) → Blue (synthesis)
```

**HITL Mode**: Supervised (default) — these are consequential decisions that benefit from human checkpoints.

## Agent Focus Areas

| Agent | Specific Focus for Go/No-Go |
|-------|----------------------------|
| **Analytical (White)** | Verify the core assumptions. What data supports "go"? What data supports "no-go"? Identify the 3 most critical unknowns. |
| **Critical-Validator (Black)** | Premortem: assume we decide "go" and it fails — why? Top 5 risks with probability and impact. Identify deal-breakers. |
| **Optimizer (Yellow)** | Quantify the upside. What is the expected value? What are the quick wins in the first 90 days? What value do we lose by not going? |
| **Ethical-Governance (Purple)** | Who is impacted if we go? Who is impacted if we don't? Are there reputational or compliance risks? |
| **Predictive-Strategic (Indigo)** | Model 3 scenarios: optimistic, base case, pessimistic. Sensitivity analysis on the top 3 variables. At what point does "go" become "no-go"? |

## Key Questions to Address

1. **What must be true for "go" to succeed?** (Critical assumptions)
2. **What would make us reverse the decision in 6 months?** (Kill criteria)
3. **What is the cost of waiting vs. the cost of acting?** (Optionality value)
4. **Who has veto power over this decision?** (Stakeholder mapping)
5. **Is this reversible?** (Reversibility assessment)

## Known Cognitive Biases for This Decision Type

- **Sunk cost fallacy**: "We've already invested X, we can't stop now"
- **Confirmation bias**: Seeking data that supports the preferred option
- **Overconfidence**: Underestimating the probability of failure
- **Status quo bias**: Defaulting to "no-go" because change is uncomfortable
- **Anchoring**: Fixating on the first piece of data encountered

The Critical-Validator (Black) should explicitly check for each of these biases in the analysis.

## Expected Output

```json
{
  "decision": "GO | NO-GO | CONDITIONAL GO",
  "confidence": "high | medium | low",
  "conditions_for_go": ["List of conditions that must be met"],
  "deal_breakers": ["List of factors that would force no-go"],
  "kill_criteria": ["Measurable thresholds for reversing the decision"],
  "expected_value": "Quantified if possible",
  "key_risks": [{"risk": "", "probability": "", "impact": "", "mitigation": ""}],
  "scenarios": {"optimistic": "", "base": "", "pessimistic": ""},
  "reversibility": "high | medium | low",
  "recommended_timeline": "Decision deadline and implementation milestones"
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` with this playbook context. Load the agent sequence: `aits-analytical` → `aits-critical-validator` → `aits-optimizer` → `aits-ethical-governance` → `aits-predictive-strategic`. For each agent, pass the specific focus areas and key questions defined above. The Critical-Validator must explicitly check for the listed cognitive biases. The final synthesis must include a clear GO/NO-GO/CONDITIONAL GO recommendation with kill criteria for post-decision monitoring.
