# Playbook: M&A Due Diligence

Acquisition, merger, or significant investment evaluation. Highest-stakes playbook in the system — runs the full sequence including Systemic and Foresight.

## When this playbook fires

- Problem statement contains: "acquire", "buy", "merge", "acquisition", "M&A"
- Target is a company, business unit, or substantial asset
- Capital commitment is material to the acquirer

## Sequence

**⚪ Analytical → 🌐 Systemic → ⚫ Critical-Validator → 🟡 Optimizer → 🟣 Ethical-Governance → 🔵 Predictive-Strategic → 🔭 Foresight → 🎯 Synthesis**

Why this order: deep factual base; systemic mapping of integration effects before stress-testing; stress-test; value case; ethical/cultural/regulatory; scenarios; robustness of integration options; synthesis. Emotional is invoked in parallel with Systemic — acquisitions are deeply human decisions.

**Emotional-Intuitive runs in parallel with Systemic** — for M&A, the emotional and the structural are inseparable.

## Focus areas per agent

### ⚪ Analytical
- Target financials: 5-year history, unit economics, quality-of-revenue
- Customer concentration, churn, NPS trajectory
- Product/technology assessment — dependency tree, technical debt, architecture fit
- Team composition — key people, retention risk, comp structure, equity vested/unvested
- Legal: IP ownership, outstanding litigation, contracts, regulatory posture
- Cap table, financing history, outstanding obligations
- Integration cost estimate baseline

### 🌐 Systemic
- The combined system: what changes in the feedback loops of both organizations
- Integration leverage points (where small interventions will propagate)
- Cultural integration dynamics (is this a cultural acquisition or a separation model?)
- Customer-base interaction effects (cannibalization? expansion?)
- Product architecture combination: merge, integrate, or keep separate
- Known M&A archetypes: "acqui-hire," "technology tuck-in," "horizontal expansion," "defensive acquisition"
- Cascade paths: what are the third-order effects we haven't thought about?

### 🔴 Emotional-Intuitive (parallel with Systemic)
- Target team: how do they feel about being acquired? Retention risk per key person.
- Our team: how do they feel about the acquisition? Integration capacity.
- Target's customers: how will they react to the news and to the post-acquisition product roadmap?
- Founders / key execs at target: identity and legacy drivers — are they relieved, resigned, anxious, triumphant?
- Emotional timeline: announcement, signing, closing, 30-60-90-180-365 day milestones

### ⚫ Critical-Validator
- Formal premortem specific to M&A: "In 2 years, this deal has destroyed value. Why?"
- The classic M&A failure modes, tested specifically:
  - Cultural integration failed
  - Key people left
  - Revenue synergies never materialized
  - Cost synergies were rounded up to disguise operational pain
  - Technical integration took 3× the estimate
  - Customer churn accelerated post-deal
  - Regulatory approval blocked or delayed
- Earn-out and deal-structure stress-test
- Representation and warranty coverage gaps
- Bias scan: **winner's curse, escalation of commitment, deal fever, planning fallacy**

### 🟡 Optimizer
- Deal value case: revenue synergies (confidence-labeled), cost synergies (confidence-labeled), strategic value
- Deal structure optimization: cash/stock/earn-out mix
- Integration sequencing: what to preserve, what to absorb, what to rebuild
- Quick wins for year 1
- Value destruction avoidance (the things that should NOT be optimized early)

### 🟣 Ethical-Governance
- Employee treatment: severance, integration vs displacement, equity acceleration
- Customer treatment: honoring commitments, transition communication
- Supplier treatment: payment terms, contract honoring
- Regulatory/antitrust assessment
- Cultural respect — is the target's culture being erased or honored?
- Compliance inheritance: what regulatory exposures are we buying?
- Red lines: unresolved litigation exposure, undisclosed material issues, rep-and-warranty insurance gaps

### 🔵 Predictive-Strategic
- Scenarios:
  - Integration smooth — synergies land
  - Integration partial — some synergies, some friction
  - Integration failure — separate operations persist indefinitely
  - Key-person loss — multiple key departures
  - Regulatory delay — closing pushed 12+ months
  - Market shift — the thesis is invalidated by external event
- Sensitivity on: synergy timing, churn rate, integration cost, key retention
- Robustness of the deal thesis across scenarios

### 🔭 Foresight
- Deal structure options matrix (cash-only, mixed, earn-out heavy, etc.) × scenarios
- Robustness ranking
- Staged commitment paths: if some aspects can be staged (e.g., staged buyout)
- Alternative to the deal: partnership? licensing? build internally? — compare across scenarios
- Option-value retention: does this deal close off future options?

### 🎯 Synthesis
- Recommendation: PROCEED / PROCEED WITH RENEGOTIATION / PASS / DEFER
- If PROCEED WITH RENEGOTIATION: specific deal-terms changes required
- Integration plan outline
- Retention plan for key people
- 100-day plan
- Value realization milestones
- Review trigger: specific milestones that would trigger deal reassessment

## Cognitive bias checklist (passed to Critical)

- **Winner's curse** — having won the bidding, are we over-paying?
- **Escalation of commitment** — once we started, are we pushing through red flags?
- **Deal fever** — is the excitement of "doing a deal" overriding dispassionate analysis?
- **Planning fallacy** — are integration timelines and costs realistic or hopeful?
- **Synergy inflation** — are synergy numbers multiplied by probability of achievement or taken at face value?
- **Cultural fit bias** — are we seeing cultural similarity where there's actually cultural difference?
- **Hindsight-resistance** — in 3 years when this is analyzed, what will be obvious that we're missing now?

## Pattern library hooks

- `founder-exit-identity-loss` → critical if acquiring a founder-led company; Emotional gets elevated role
- `legacy-system-replacement` → if integration will replace acquirer's or target's systems
- `ai-adoption-competence-fear` → if one company is being AI-transformed via the acquisition

## HITL gates specific to M&A

Additional mandatory gates:

- Any material undisclosed item surfaced → blocking gate
- Ethical red line detected (e.g., undisclosed harassment settlements, regulatory exposure) → blocking gate
- Systemic analysis reveals a critical dependency that would be disrupted by the deal → blocking gate
- Key-person retention probability < 60% for any critical role → blocking gate
- Any single scenario has existential downside (regulatory kill, market collapse) → advisory gate with HITL decision on risk appetite

## Output format specifics

Deal synthesis must include:

- **Deal Thesis** (one paragraph, traceable to Analytical + Optimizer)
- **Top 3 Risks Accepted** with mitigation
- **Top 3 Assumptions That Must Hold** with test methods
- **Deal Structure Recommendation** with specific terms
- **Integration Plan Skeleton** (30/90/180/365 day)
- **Key-Person Retention Plan**
- **Review Schedule** (specific dates)
