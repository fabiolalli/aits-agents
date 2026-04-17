# Playbook: Ethical Impact

Deep analysis of decisions with material ethical, social, or governance implications. Purple leads; other agents support.

## When this playbook fires

- Problem statement contains: "ethical", "impact on people", "social impact", "AI ethics", "fairness"
- Decisions affecting vulnerable populations
- AI/automation decisions that displace human work
- Privacy-sensitive decisions
- Decisions with distributional consequences

## Sequence

**⚪ Analytical → 🟣 Ethical-Governance → 🔴 Emotional-Intuitive → ⚫ Critical-Validator → 🌐 Systemic → 🔵 Predictive-Strategic → 🎯 Synthesis**

Why this order: facts about affected parties; ethical dimensional assessment early (frames everything downstream); emotional mapping of affected parties; stress-test with reputational and legal risk emphasis; systemic cascade to vulnerable populations; scenarios including normative drift; synthesis.

**Optimizer is deliberately later or absent.** Ethical playbooks shouldn't be driven by optimization early — it can be added back in synthesis for feasibility, but value maximization should not frame the assessment.

## Focus areas per agent

### ⚪ Analytical
- Who are the affected parties? Demographics, size, power, voice.
- What is the counterfactual? What happens if we do nothing?
- What does the evidence say about similar interventions elsewhere?
- What are the regulatory and legal contexts?
- What consent and information exists?

### 🟣 Ethical-Governance (leads)
- Full 7-dimension assessment with each dimension reasoned explicitly
- Distributional analysis: benefits vs costs vs voice
- Red line check with specific inviolability citations
- Compliance exposure mapped to specific regulations
- Normative drift risk: will this age well?
- Recommended conditions if proceeding

### 🔴 Emotional-Intuitive
- Affected parties with deep drivers (identity, dignity, autonomy often central here)
- Those without voice: who bears cost and can't object?
- Power asymmetry mapping
- Emotional timeline across affected populations
- Resistance and trust drivers

### ⚫ Critical-Validator
- Reputational risk specifically
- Legal/regulatory risk specifically
- Failure modes specific to ethical decisions: "the decision was technically defensible but publicly indefensible"
- What would an investigative journalist see?
- What would opposing counsel argue?
- Bias scan: especially **in-group favoritism**, **out-group neglect**, **utilitarian over-simplification**, **moral licensing**

### 🌐 Systemic
- Cascade to vulnerable populations
- Feedback loops of trust erosion
- Precedent effects: what does this decision establish as norm?
- Interaction with existing inequities: does this decision widen or narrow them?

### 🔵 Predictive-Strategic
- Normative shift scenarios: what happens if social norms shift against this decision?
- Regulatory shift scenarios: what regulations are likely in 3-5 years?
- Technology shift scenarios: how does the decision age as technology changes?
- Early warning signals of norm shifts

### 🎯 Synthesis
- Ethical posture: CLEAR / CAUTIONARY / RED-LINE-ADDRESSED / DO-NOT-PROCEED
- If CAUTIONARY: specific conditions for proceeding
- Stakeholder communication plan
- Remedy mechanisms: how affected parties can seek redress
- Monitoring framework: ongoing ethical assessment
- Review cadence

## Cognitive bias checklist (passed to Critical)

- **In-group favoritism** — are we weighing in-group interests more heavily?
- **Out-group neglect** — are out-group impacts under-weighted?
- **Utilitarian over-simplification** — "the math says net good" ignoring dignity and autonomy dimensions
- **Moral licensing** — "we've done other good things so this questionable thing is fine"
- **Just-world bias** — "affected parties deserve this outcome because of their prior choices"
- **Abstract distance** — ethical concerns feel lower-priority when the affected parties are abstract to decision-makers
- **Motivated reasoning** — starting from the desired conclusion and building the ethical case backward

## Output format specifics

```
ETHICAL POSTURE: [clear | cautionary | red-line-addressed | do-not-proceed]

7-DIMENSION ASSESSMENT
  Fairness:         [status] — [reasoning]
  Autonomy:         ...
  Transparency:     ...
  Accountability:   ...
  Non-maleficence:  ...
  Beneficence:      ...
  Dignity:          ...

DISTRIBUTIONAL ANALYSIS
  Benefits concentrated in: [group, with power level]
  Costs borne by:           [group, with voice level]
  Asymmetry severity:       [none | mild | strong | structural]

RED LINES: [none detected | specific violations with remedies]

REQUIRED CONDITIONS FOR PROCEEDING
  1. [specific, verifiable]
  2. ...

REMEDY MECHANISMS FOR AFFECTED PARTIES
  [how harm can be surfaced and addressed]

NORMATIVE DRIFT OUTLOOK
  Today:  [acceptability]
  10-yr:  [acceptability forecast]
  Drift vector: [which norms shifting]

MONITORING FRAMEWORK
  [what to track, at what frequency, with what trigger for reassessment]
```

## Pattern library hooks

- `restructuring-survivor-syndrome` → automatic escalation to this playbook
- `ai-adoption-competence-fear` → automatic escalation
- `founder-exit-identity-loss` → automatic escalation if deal terms include employee equity acceleration issues

## HITL gates specific to ethical impact

Every red-line detection triggers a mandatory blocking gate. That's the whole point of this playbook.

Advisory gates:

- Any dimension rated "concern" in the 7-dimension assessment
- Strong power asymmetry (power_differential >= "strong_asymmetry")
- Normative drift forecast showing current acceptability but future unacceptability
- Affected parties without voice in the decision

## The ethical-impact playbook's prime directive

A decision that is technically compliant, economically optimal, and strategically sound can still be ethically wrong. This playbook exists to surface that possibility. The playbook's bias is toward raising concerns and letting the human confirm that proceeding is justified — not toward finding reasons the decision is fine.
