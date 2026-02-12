# AITS Playbook: M&A Due Diligence

A pre-configured AITS analysis optimized for merger and acquisition evaluation — from initial assessment through deal structuring.

## When to Use

- Evaluating an acquisition target
- Assessing a merger proposal
- Strategic investment decision (majority stake)
- Acqui-hire evaluation
- Divestiture analysis (sell-side)

## Pre-configured Sequence

```
White (financials & data) → Systemic (integration complexity) → Black (risks & deal-breakers) → Yellow (synergies & value) → Ethical (people & culture) → Predictive (post-merger scenarios) → Foresight (deal structure options) → Blue (synthesis)
```

**HITL Mode**: Supervised — M&A decisions are high-stakes and irreversible. Every checkpoint matters.

## Agent Focus Areas

| Agent | Specific Focus for M&A |
|-------|----------------------|
| **Analytical (White)** | Financial metrics (revenue, EBITDA, margins, growth rate). Valuation benchmarks (multiples, DCF inputs). Customer concentration. IP portfolio. Technical debt assessment. |
| **Systemic (Extended)** | Integration complexity map: systems, processes, culture, customers, suppliers. Feedback loops between combined entities. Dependencies that could break post-merger. |
| **Critical-Validator (Black)** | Deal-breakers. Hidden liabilities. Customer churn risk. Key person dependencies. Regulatory hurdles. Integration failure scenarios. "What does the seller know that we don't?" |
| **Optimizer (Yellow)** | Revenue synergies. Cost synergies. Cross-sell opportunities. Talent leverage. Quick wins in first 100 days post-close. Optimal deal structure for value maximization. |
| **Ethical-Governance (Purple)** | Impact on employees (both sides). Redundancy handling. Cultural clash risks. Community impact. Regulatory/antitrust compliance. Communication transparency. |
| **Predictive-Strategic (Indigo)** | 3 post-merger scenarios (best/base/worst). Integration timeline sensitivity. Market evolution impact on combined entity. Competitor response to the deal. |
| **Foresight (Extended)** | Deal structure options matrix: full acquisition vs. majority stake vs. partnership vs. earn-out. Evaluate each across the 3 scenarios from Predictive. |

## Key Questions to Address

1. **Why this target?** (Strategic rationale beyond financials)
2. **What are we really buying?** (Core asset: technology, team, customers, brand?)
3. **What breaks if key people leave?** (Key person risk)
4. **Can we integrate without destroying value?** (Integration feasibility)
5. **What is the walk-away price?** (Maximum acceptable valuation)
6. **What does the seller know that we don't?** (Information asymmetry)
7. **How do customers react?** (Customer retention risk)

## Known Cognitive Biases for This Decision Type

- **Winner's curse**: Overpaying to "win" the deal
- **Deal fever**: Emotional attachment to closing the deal
- **Anchoring on asking price**: Using the seller's price as the starting point
- **Overestimating synergies**: "We'll save X by combining operations"
- **Neglecting integration costs**: Underestimating the time, money, and cultural effort
- **Survivorship bias**: Looking only at successful M&A for benchmarks

## Expected Output

```json
{
  "recommendation": "PROCEED | WALK AWAY | PROCEED WITH CONDITIONS",
  "strategic_rationale": "Core reason for the acquisition",
  "valuation_range": {"floor": "", "ceiling": "", "walk_away_price": ""},
  "synergies": {"revenue": "", "cost": "", "timeline_to_realize": ""},
  "deal_breakers": ["Factors that would kill the deal"],
  "integration_plan": {
    "phase_1_30_days": [],
    "phase_2_90_days": [],
    "phase_3_year_1": []
  },
  "key_risks": [{"risk": "", "probability": "", "impact": "", "mitigation": ""}],
  "post_merger_scenarios": {"best": "", "base": "", "worst": ""},
  "people_impact": {"redundancies": "", "key_retention": "", "culture_plan": ""},
  "deal_structure_recommendation": "Recommended structure with rationale"
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` with this playbook context. Load the extended agent sequence including `aits-systemic` and `aits-foresight`. This is the most comprehensive playbook — expect 7-8 agent activations. Set HITL mode to SUPERVISED. The Critical-Validator must explicitly flag each cognitive bias listed above. The Optimizer must separate "realistic synergies" from "aspirational synergies." The final synthesis must include a clear PROCEED/WALK AWAY recommendation with a walk-away price and integration plan.
