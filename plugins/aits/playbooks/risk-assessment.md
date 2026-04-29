# Playbook: Risk Assessment

Comprehensive risk identification and mitigation design. Deployed when the user's primary question is "what could go wrong and how do we prepare?"

## When this playbook fires

- Problem statement contains: "risk assessment", "what are the risks", "risk map", "what could go wrong"
- Decision already made and the question is now about risk mitigation
- Periodic organizational risk review
- Scenario planning with risk focus

## Sequence

**⚪ Analytical → ⚫ Critical-Validator → 🌐 Systemic → 🟣 Ethical-Governance → 🔵 Predictive-Strategic → 🟡 Optimizer → 🎯 Synthesis**

Why this order: facts first; deep risk map; systemic cascade analysis; ethical/reputational/legal risks; scenarios for risk evolution; optimization of mitigations; synthesis as risk register.

## Focus areas per agent

### ⚪ Analytical
- Historical risk data: what's materialized before, with what frequency
- Current risk landscape baseline
- Regulatory/compliance current state
- Dependencies and their health
- Known threat actors (if security is a dimension)
- Incident history and near-miss data

### ⚫ Critical-Validator
- Comprehensive premortem across all 6 risk categories (strategic, operational, financial, reputational, legal_regulatory, technical)
- Each premortem with probability, impact, severity score
- Failure-mode enumeration — not just top-3, aim for 15-25 material risks
- Fallacy detection in current risk management assumptions ("it hasn't happened in 10 years so it won't happen")
- Tail-risk focus: the 1-in-100 events that are existential
- Dependency risk chains

### 🌐 Systemic
- Cascade paths between risks (which risks trigger other risks?)
- Risk correlation mapping (which risks are actually the same underlying risk?)
- Systemic vulnerabilities: single points of failure across the system
- Feedback loops that amplify risk (e.g., panic cycles, trust collapses)
- Leverage points for risk reduction

### 🟣 Ethical-Governance
- Reputational risks with ethical dimension
- Compliance and regulatory risk with specific exposures
- Risks to vulnerable populations
- Risks that, if materialized, would be indefensible publicly
- Governance gaps that would be revealed in a crisis

### 🔵 Predictive-Strategic
- How does the risk landscape evolve in 1y, 3y, 5y?
- Which risks are growing? Which are decaying?
- Scenarios where multiple risks materialize together
- Correlated-risk stress test
- Early warning signal panel for each material risk

### 🟡 Optimizer
- Mitigation optimization: which mitigations have highest ROI?
- Mitigation sequencing: what to do first, what can wait
- Insurance vs prevention trade-offs
- Guardrail economics: how much do guardrails cost vs. the expected loss they prevent?
- Quick mitigations that reduce risk posture fast

### 🎯 Synthesis
- Structured **Risk Register**
- Top risks with mitigation owners and deadlines
- Residual risk posture after mitigations
- Monitoring and review schedule

## Output format: Risk Register (mandatory)

```
| ID  | Risk | Category | Driver | P | I | Severity | Mitigation | Cost | Owner | Residual | Review |
|-----|------|----------|--------|---|---|----------|------------|------|-------|----------|--------|
```

Plus:

- **Top 10 by severity** — highlighted section
- **Correlated risk clusters** — grouped presentation
- **Tail risk scenarios** — the 2-3 scenarios where multiple risks fire simultaneously
- **Early warning panel** — specific indicators to monitor
- **Review cadence** — when this register is revisited

## Cognitive bias checklist (passed to Critical)

- **Availability heuristic** — recent vivid risks are over-weighted; dormant risks are under-weighted
- **Normalcy bias** — "it's been fine so it'll stay fine"
- **Base rate neglect** — forgetting the probability distribution when the specific case feels unique
- **Ostrich effect** — avoiding information about risks we don't want to manage
- **Overconfidence in mitigations** — believing mitigations work better than evidence supports
- **Risk compensation** — adding safety measures that are offset by risk-increasing behavior
- **Cognitive dissonance on inherited risks** — resistance to accepting risks we didn't create

## Pattern library hooks

- `legacy-system-replacement` → technical risk category gets elevated attention
- `restructuring-survivor-syndrome` → operational + reputational risk specific patterns
- Any industry-specific archetypes → load their risk signatures

## HITL gates specific to risk assessment

Additional mandatory gates:

- Any risk with severity ≥ 15 and no viable mitigation → blocking gate
- Correlated risk cluster with combined severity ≥ 20 → blocking gate
- Ethical red line implied in a current operational practice → blocking gate
- Discovered existential tail risk previously unknown → blocking gate

## Specialization parameters

If the risk assessment is specifically for:

- **Cybersecurity** — add technical subcategories (application security, infrastructure, identity, data), emphasize Critical and Systemic
- **Financial** — add financial subcategories (liquidity, credit, market, operational), emphasize Analytical and Predictive
- **Operational resilience** — emphasize Systemic and Predictive, add explicit dependency chains
- **Regulatory** — emphasize Ethical-Governance with specific regime mapping

The base playbook is the general risk assessment; specializations add emphasis without changing the sequence.
