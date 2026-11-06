# Playbook: Go / No-Go

Binary strategic decisions where the output must be unambiguous — GO, NO-GO, or CONDITIONAL GO with explicit conditions.

## When this playbook fires

- Problem statement contains: "should we", "go or not", "proceed with", "pull the trigger"
- Decision space is binary (or at most trinary: go / no-go / defer)
- Irreversibility or commitment level is moderate to high

## Sequence

**⚪ Analytical → ⚫ Critical-Validator → 🟡 Optimizer → 🟣 Ethical-Governance → 🔵 Predictive-Strategic → 🎯 Synthesis**

Why this order: fact base first; stress-test before optimism; optimism before ethics (so ethics evaluates a real plan); predictions after ethics (so we project an ethically-acceptable version).

## Focus areas per agent

### ⚪ Analytical
- Current state hard facts
- Addressable market / opportunity size with confidence intervals
- Our current capability gaps
- Comparable past decisions (internal and external)
- Explicit list of what we don't know and whether we can know it before the decision window closes

### ⚫ Critical-Validator
- Formal premortem: "In 18 months, this decision has clearly failed. Why?"
- Stress-test the core thesis
- Fallacy scan with explicit attention to: sunk cost, confirmation bias, planning fallacy, overconfidence
- Single-point-of-failure analysis
- Reversibility assessment — how expensive is reversing this decision if wrong?

### 🟡 Optimizer
- Business case: gross benefit, implementation cost, risk-adjusted net value
- Quick wins within 30/60/90 days
- Value sequencing
- Opportunity cost vs. alternatives explicitly listed (including do-nothing)
- Levers to amplify value

### 🟣 Ethical-Governance
- 7-dimension assessment
- Distributional analysis — who gains, who bears cost
- Red-line check
- Compliance exposure (regulatory, contractual, reputational)

### 🔵 Predictive-Strategic
- At least 3 scenarios: baseline, pessimistic, upside
- Sensitivity on the 3 most critical variables
- Robustness of the decision across scenarios
- Early warning signals that would warrant reconsideration

### 🎯 Meta-Orchestrator Synthesis
- Explicit GO / NO-GO / CONDITIONAL GO verdict
- If conditional: the specific conditions, their verification method, and the deadline for verification
- Confidence level (cannot exceed weakest critical input)
- Review trigger: date or signal that mandates revisiting

## Cognitive bias checklist (passed to Critical)

- **Sunk cost** — is "we've invested X already" a factor in the decision?
- **Confirmation bias** — did the analysis seek only confirming evidence?
- **Planning fallacy** — are timelines/costs based on best-case scenarios?
- **Overconfidence** — are confidence intervals narrower than evidence supports?
- **Ambiguity aversion** — are we choosing a known bad over an unknown possible good (or vice versa)?
- **Status quo bias** — is "don't change" being privileged without examination?

## Output format (mandatory for this playbook)

The synthesis must structure its decision statement as:

```
DECISION: GO | NO-GO | CONDITIONAL GO

IF CONDITIONAL:
  Condition 1: [specific, measurable, time-bound]
  Condition 2: ...
  Verification owner: [name/role]
  Verification deadline: [date]

RATIONALE: [3-5 sentence synthesis]

KEY RISKS ACCEPTED: [top 3 from Critical's risk map]
KEY OPPORTUNITIES CAPTURED: [top 3 from Optimizer]
ETHICAL POSTURE: [clear | cautionary | red-line-addressed]
ROBUSTNESS: [from Predictive — how well does this hold across scenarios?]

REVIEW: [date or signal triggering reassessment]
```

## Pattern library hooks

If the problem matches one of these archetypes, adjust:

- `build-vs-buy-vs-partner` → force partnership option onto the table (it's usually absent from binary framings)
- `geographic-expansion` → include `ethical-impact` augmentation
- `ai-infrastructure-vendor-choice` → emphasize switching cost and vendor lock-in in Critical

## When the playbook recommends against GO

A legitimate output is "NO-GO with reasoning" or "DEFER with trigger conditions for reconsideration." The playbook does not exist to produce a GO; it exists to produce a sound verdict.
