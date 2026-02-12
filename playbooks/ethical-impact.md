# AITS Playbook: Ethical Impact Analysis

A pre-configured AITS analysis optimized for evaluating the ethical, social, and governance implications of a decision — especially for AI deployment, data use, automation, and decisions that impact people.

## When to Use

- AI/automation deployment affecting workers
- Data collection or use policy decisions
- Decisions with significant social impact
- DEI (Diversity, Equity, Inclusion) assessments
- ESG (Environmental, Social, Governance) evaluations
- Decisions involving vulnerable populations
- Regulatory compliance with ethical dimensions (GDPR, AI Act, etc.)

## Pre-configured Sequence

```
White (factual impact data) → Ethical (primary analysis) → Red (stakeholder emotions) → Black (risk & failure modes) → Systemic (second-order effects) → Predictive (long-term consequences) → Blue (synthesis with red lines)
```

**HITL Mode**: Supervised — ethical decisions always require human judgment at every step.

## Agent Focus Areas

| Agent | Specific Focus for Ethical Impact |
|-------|--------------------------------|
| **Analytical (White)** | Who is affected? How many people? What is the baseline before the change? What data do we have on similar decisions' outcomes? Legal/regulatory requirements. |
| **Ethical-Governance (Purple)** | PRIMARY AGENT. Fairness assessment across affected groups. Red lines that cannot be crossed. Accountability chain: who is responsible if things go wrong? Compliance mapping. |
| **Emotional-Intuitive (Red)** | How do the affected people feel? Trust dynamics. Fear and anxiety mapping. Perception vs. reality gap. Cultural sensitivity. |
| **Critical-Validator (Black)** | What could go wrong ethically? Unintended consequences. Bias amplification risks. Worst-case scenarios for the most vulnerable affected groups. |
| **Systemic (Extended)** | Second-order effects: if we automate X, what happens to Y? Feedback loops between ethical choices and business outcomes. Community ecosystem effects. |
| **Predictive-Strategic (Indigo)** | Long-term ethical trajectory: is this the first step on a slippery slope? How does this precedent affect future decisions? Reputational evolution over 1/3/5 years. |

## Key Questions to Address

1. **Who benefits and who bears the cost?** (Distribution of impact)
2. **Would we be comfortable if this decision were public?** (Transparency test)
3. **What would the most affected person say?** (Empathy test)
4. **Is this legal, ethical, AND right?** (Triple filter — legality is necessary but not sufficient)
5. **What precedent does this set?** (Precedent analysis)
6. **What are the irreversible consequences?** (Reversibility assessment)
7. **Are we treating people as means or ends?** (Kantian test)

## Ethical Frameworks to Apply

- **Utilitarianism**: Greatest good for the greatest number — but check who is sacrificed
- **Deontology**: Are there duties or rules being violated regardless of outcome?
- **Virtue ethics**: What would a person of good character do?
- **Justice/Fairness**: Is the burden distributed equitably?
- **Care ethics**: Are we protecting the most vulnerable?
- **Transparency**: Would we make this decision in full public view?

## Known Cognitive Biases for This Decision Type

- **Moral licensing**: "We did good things before, so this is fine"
- **Diffusion of responsibility**: "Everyone does it" or "It's not my call"
- **Outcome bias**: Judging ethics by results rather than the decision process
- **Empathy gap**: Failing to imagine the experience of those affected
- **Slippery slope dismissal**: "This is just a small step, it won't escalate"

## Expected Output

```json
{
  "ethical_assessment": "ACCEPTABLE | CONCERNING | UNACCEPTABLE",
  "affected_populations": [
    {"group": "", "impact": "positive | negative | mixed", "severity": "1-10", "reversibility": "high | low"}
  ],
  "red_lines": ["Inviolable ethical limits identified"],
  "fairness_analysis": {
    "benefits_distribution": "Who gains what",
    "costs_distribution": "Who loses what",
    "equity_score": "1-10"
  },
  "ethical_frameworks_applied": [
    {"framework": "", "verdict": "", "reasoning": ""}
  ],
  "second_order_effects": ["Unintended consequences identified"],
  "precedent_analysis": "What future decisions this enables or constrains",
  "accountability_chain": {"decision_maker": "", "implementer": "", "oversight": "", "recourse_for_affected": ""},
  "recommendations": {
    "proceed_as_is": "Yes/No with conditions",
    "modifications_required": ["Changes needed to make the decision ethical"],
    "monitoring": ["Ongoing ethical metrics to track"],
    "communication_plan": "How to transparently communicate the decision"
  },
  "long_term_trajectory": "Where this path leads in 1/3/5 years"
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` with this playbook context. The **Ethical-Governance (Purple)** is the PRIMARY agent — allocate it the most focus and context. Set HITL mode to SUPERVISED with mandatory checkpoints after every agent. If the Ethical agent flags ANY red line, this triggers a mandatory gate even in autonomous mode. Include `aits-systemic` for second-order effects mapping. The final synthesis MUST include explicit red lines, an accountability chain, and modifications required before the decision can proceed ethically.
