# AITS Playbook: Product Launch Assessment

A pre-configured AITS analysis optimized for evaluating whether a product is ready for market launch and how to maximize launch success.

## When to Use

- New product launch readiness assessment
- Feature release evaluation
- MVP launch decision
- Geographic expansion of an existing product
- Relaunch or pivot assessment

## Pre-configured Sequence

```
White (market data) → Red (user emotions) → Green (positioning options) → Black (risks) → Yellow (go-to-market) → Predictive (adoption curves) → Blue (synthesis)
```

**HITL Mode**: Supervised (default) — product launches have many moving parts that benefit from step-by-step review.

## Agent Focus Areas

| Agent | Specific Focus for Product Launch |
|-------|----------------------------------|
| **Analytical (White)** | Market size, target segment validation, competitive landscape, pricing benchmarks. Product-market fit evidence (surveys, beta metrics, NPS). |
| **Emotional-Intuitive (Red)** | How will users feel when they first encounter the product? What friction points create frustration? What generates "wow" moments? What does the team feel about readiness? |
| **Creative-Generative (Green)** | Alternative positioning strategies. Unconventional go-to-market channels. Cross-industry launch analogies. Creative pricing models. |
| **Critical-Validator (Black)** | Technical risks (scalability, bugs). Market risks (timing, competition). Execution risks (team capacity, supply chain). What could make launch day a disaster? |
| **Optimizer (Yellow)** | Launch sequencing: what to ship in v1 vs. v1.1. Quick wins for first 30 days. Revenue optimization. Partner leverage opportunities. |
| **Predictive-Strategic (Indigo)** | Adoption curve modeling (3/6/12 months). Competitive response scenarios. Market evolution impact on product relevance. |

## Key Questions to Address

1. **Is there validated demand?** (Evidence of product-market fit)
2. **Can we deliver at launch quality?** (Technical readiness)
3. **Who are the first 100 customers?** (Early adopter identification)
4. **What is the unfair advantage?** (Competitive moat)
5. **What does success look like at 30/90/180 days?** (Success metrics)
6. **What is the rollback plan?** (If launch fails)

## Known Cognitive Biases for This Decision Type

- **Optimism bias**: "Users will love it because we love it"
- **Planning fallacy**: Underestimating time/resources for launch
- **Curse of knowledge**: Assuming users understand the product as well as the team
- **Feature creep justification**: "Just one more feature before launch"
- **Survivorship bias**: Looking only at successful launches for benchmarking

## Expected Output

```json
{
  "launch_readiness": "READY | NOT READY | READY WITH CONDITIONS",
  "readiness_score": {"product": "1-10", "market": "1-10", "team": "1-10", "timing": "1-10"},
  "target_segment": "Primary launch segment",
  "positioning": "Core value proposition",
  "go_to_market": {"channel": "", "messaging": "", "pricing": ""},
  "launch_timeline": {"soft_launch": "", "full_launch": "", "first_review": ""},
  "success_metrics": {"30_days": [], "90_days": [], "180_days": []},
  "top_risks": [{"risk": "", "mitigation": "", "owner": ""}],
  "rollback_trigger": "Conditions under which to pause/reverse",
  "quick_wins": ["First 30 days opportunities"]
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` with this playbook context. Load the agent sequence: `aits-analytical` → `aits-emotional-intuitive` → `aits-creative-generative` → `aits-critical-validator` → `aits-optimizer` → `aits-predictive-strategic`. For each agent, pass the specific focus areas and key questions defined above. If the Creative-Generative produces more than 4 positioning options, activate `aits-foresight` to evaluate them across scenarios. The final synthesis must include a clear READY/NOT READY assessment with a launch timeline and success metrics.
