# AITS Playbook: Risk Assessment

A pre-configured AITS analysis optimized for comprehensive risk identification, evaluation, and mitigation planning.

## When to Use

- Pre-launch risk assessment for major initiatives
- Annual strategic risk review
- Regulatory compliance risk evaluation
- Technology or vendor risk assessment
- Crisis preparedness planning
- Investment portfolio risk analysis

## Pre-configured Sequence

```
White (data & context) → Black (risk identification) → Systemic (risk interdependencies) → Ethical (ethical & reputational risks) → Predictive (scenario modeling) → Yellow (mitigation optimization) → Blue (synthesis)
```

**HITL Mode**: Supervised — risk assessment requires human validation at each stage.

## Agent Focus Areas

| Agent | Specific Focus for Risk Assessment |
|-------|----------------------------------|
| **Analytical (White)** | Historical risk data. Industry benchmarks. Current controls and their effectiveness. Data gaps in risk monitoring. |
| **Critical-Validator (Black)** | Comprehensive risk identification across categories: strategic, operational, financial, technological, regulatory, reputational. Probability × Impact matrix. Premortem: what does failure look like? |
| **Systemic (Extended)** | Risk interdependencies: which risks trigger other risks? Cascading failure paths. Single points of failure. Feedback loops that amplify risk. |
| **Ethical-Governance (Purple)** | Ethical risks often invisible in standard frameworks: bias, privacy, fairness, community impact, environmental. Reputational risk from public perception. |
| **Predictive-Strategic (Indigo)** | Scenario modeling: what does the risk landscape look like in 6/12/24 months? Black swan identification. Stress testing under extreme conditions. |
| **Optimizer (Yellow)** | Mitigation priority: which mitigations give the best risk-reduction per effort? Quick wins. Residual risk acceptance criteria. Insurance vs. mitigation vs. avoidance. |

## Key Questions to Address

1. **What keeps us up at night?** (Gut-check risk inventory)
2. **What risks are we not seeing?** (Blind spot identification)
3. **What happens if three things go wrong simultaneously?** (Correlation risk)
4. **Which risks are existential vs. manageable?** (Risk tiering)
5. **Are our current controls working?** (Control effectiveness)
6. **What is our risk appetite?** (Tolerance thresholds)

## Risk Categories to Cover

- **Strategic**: Market shifts, competitive threats, business model disruption
- **Operational**: Process failures, supply chain, key person dependencies
- **Financial**: Liquidity, currency, credit, market volatility
- **Technological**: Security, infrastructure, technical debt, vendor lock-in
- **Regulatory**: Compliance, legal, licensing, data protection
- **Reputational**: Public perception, social media, stakeholder trust
- **Environmental**: Climate, sustainability, ESG compliance
- **Human**: Talent retention, culture, organizational resilience

## Known Cognitive Biases for This Decision Type

- **Normalcy bias**: "It won't happen to us"
- **Availability heuristic**: Overweighting recent or dramatic risks
- **Neglect of probability**: Focusing on impact and ignoring likelihood
- **Groupthink**: Everyone agrees the risks are low (without dissent)
- **Black swan blindness**: Dismissing low-probability, high-impact events

## Expected Output

```json
{
  "risk_landscape": "Narrative overview of the risk environment",
  "risk_register": [
    {
      "risk": "Description",
      "category": "strategic | operational | financial | technological | regulatory | reputational",
      "probability": "low | medium | high | critical",
      "impact": "low | medium | high | critical",
      "risk_score": "P × I (1-25)",
      "current_controls": "Existing mitigations",
      "control_effectiveness": "effective | partial | ineffective",
      "recommended_mitigation": "New or improved controls",
      "owner": "Who is responsible",
      "timeline": "Implementation deadline"
    }
  ],
  "risk_interdependencies": ["Risk A triggers Risk B because..."],
  "top_5_risks": ["Ranked by risk score"],
  "existential_risks": ["Risks that threaten organizational survival"],
  "blind_spots": ["Risks identified that were previously unmonitored"],
  "mitigation_priorities": ["Ranked by risk-reduction per effort"],
  "residual_risk_acceptance": "What risk we consciously accept and why",
  "monitoring_plan": {"metrics": [], "frequency": "", "escalation_triggers": []}
}
```

## Instructions

Use the sub-agent `aits-meta-orchestrator` with this playbook context. Load the agent sequence including `aits-systemic` for risk interdependency mapping. The Critical-Validator is the primary agent in this playbook — give it extended focus. The Systemic agent must map cascading failure paths. The final synthesis must include a prioritized risk register with clear ownership and timelines, plus a monitoring plan with escalation triggers.
