# Taxonomies — Shared Vocabulary

AITS 2.0 agents use a shared vocabulary. This ensures that when Analytical says "financial risk," Critical understands the same thing, and when Emotional says "loss of autonomy," Ethical recognizes the pattern.

The taxonomies in this file are **normative**: agents must use these categories rather than inventing their own. New categories can be proposed through the contribution process.

---

## Risk taxonomy

Used by: Critical-Validator, Predictive-Strategic, Systemic, Foresight

### Level 1 — Category (6 categories, mutually exclusive)

| Category | Definition | Typical examples |
|----------|-----------|------------------|
| **strategic** | Risks to the long-term position and direction | Competitive displacement, obsolescence, market timing miss |
| **operational** | Risks to the execution of the plan | Supply chain failure, team capacity gap, process breakdown |
| **financial** | Risks to cash, capital, margins | Cost overrun, revenue miss, liquidity crisis |
| **reputational** | Risks to trust, brand, social license | Public backlash, customer trust erosion, employee defection |
| **legal_regulatory** | Risks from law, regulation, compliance | Fine, license loss, litigation, regulatory shift |
| **technical** | Risks from technology, systems, data | System failure, security breach, technical debt, dependency lock-in |

### Level 2 — Driver (the proximate cause)

Every risk declares a driver within its category. Examples within `operational`:

- `capacity_gap` — insufficient people, time, or tooling
- `dependency_failure` — a partner, vendor, or input fails
- `coordination_breakdown` — teams misalign
- `process_debt` — accumulated workarounds collapse

This two-level structure lets agents reason across risks (e.g., "three of our top five risks share driver `capacity_gap` — this is a systemic signal").

### Severity scoring

`severity = probability × impact` where both are 1–5 integers, producing a 1–25 score.

| Score range | Level | Meaning |
|-------------|-------|---------|
| 1–4 | low | Monitor; no immediate action |
| 5–9 | medium | Mitigation plan required |
| 10–14 | high | **Triggers inviolable rule #3** (mandatory Ethical or Predictive activation) |
| 15–25 | critical | **Triggers inviolable rule #3 + mandatory HITL gate** |

---

## Emotional taxonomy

Used by: Emotional-Intuitive, Ethical-Governance

### Level 1 — Deep driver (8 categories)

Stakeholder emotions are mapped to their **deep driver** — the underlying need that is being threatened or fulfilled. Surface emotions ("anger," "enthusiasm," "anxiety") are symptoms; drivers are causes.

| Driver | When threatened, people feel | When fulfilled, people feel |
|--------|------------------------------|------------------------------|
| **identity** | Invisibility, erasure, "I'm being replaced" | Recognition, purpose, belonging to the story |
| **status** | Humiliation, demotion, loss of respect | Pride, recognition, elevated standing |
| **autonomy** | Control loss, micromanagement, "I'm being told what to do" | Empowerment, trust, self-direction |
| **competence** | Inadequacy, fear of failure, "I can't do this" | Mastery, growth, capability |
| **belonging** | Exclusion, othering, "I don't fit here anymore" | Inclusion, community, we-ness |
| **safety** | Threat, instability, "I might lose something essential" | Security, predictability, protection |
| **fairness** | Injustice, rigged game, "This is not right" | Equity, due process, reciprocity |
| **legacy** | Futility, "My work doesn't matter," erasure of contribution | Continuity, impact, meaningful work |

### Level 2 — Surface emotion

The observable emotional state: anger, fear, enthusiasm, distrust, pride, resignation, hope, resentment, relief, anxiety, apathy, engagement, etc. Surface emotions can map to multiple drivers; the deep driver is the operative one for intervention design.

### Intensity and decay

Each stakeholder group's emotional state carries:

- `intensity_current` — 1-10 snapshot now
- `intensity_peak_expected` — 1-10 forecast peak
- `decay_curve` — `fast` (resolves within weeks), `medium` (months), `slow` (years), `permanent` (structural; e.g., broken trust post-betrayal)

---

## Ethical taxonomy

Used by: Ethical-Governance, Meta-Orchestrator

### Level 1 — Ethical dimension (7 dimensions)

| Dimension | Question it asks |
|-----------|------------------|
| **fairness** | Are benefits and burdens distributed justly? |
| **autonomy** | Are affected parties given meaningful choice and consent? |
| **transparency** | Is the decision process visible and explainable to affected parties? |
| **accountability** | Is it clear who bears responsibility if things go wrong? |
| **non_maleficence** | Are we avoiding causing harm? |
| **beneficence** | Are we actively promoting good outcomes? |
| **dignity** | Are we treating people as ends, not merely as means? |

### Level 2 — Red line

A red line is a **non-negotiable inviolability**. When any agent detects a potential red line breach, inviolable rule #6 triggers (mandatory HITL gate). Red lines include:

- Discrimination on protected characteristics
- Violation of informed consent
- Deception of affected parties
- Harm to minors or vulnerable populations
- Irreversible environmental damage
- Violation of applicable law
- Exploitation of asymmetric power

This list is not exhaustive; agents flagging a suspected red line must articulate which principle is violated and why the violation is material.

---

## Scenario taxonomy

Used by: Predictive-Strategic, Foresight

### Standard scenario frames (choose 3-5 per analysis)

| Scenario frame | Description |
|----------------|-------------|
| **baseline** | Current trends continue without major disruption |
| **optimistic** | Favorable developments compound |
| **pessimistic** | Adverse developments compound |
| **shock** | A single high-impact discontinuous event |
| **regulatory_shift** | Material change in legal/compliance environment |
| **competitive_move** | A specific rival makes a specific move |
| **technological_leap** | Discontinuous improvement in a key capability |
| **market_contraction** | Demand-side reduction |
| **market_expansion** | Demand-side growth |
| **black_swan** | Low-probability, high-impact event outside normal frames |

Each scenario carries a `probability` estimate (low/medium/high or a point probability with confidence interval) and a `time_horizon`.

---

## Option taxonomy

Used by: Creative-Generative, Foresight, Optimizer

### Option novelty

| Level | Meaning |
|-------|---------|
| **incremental** | Variation on existing approach |
| **adjacent** | Recombines known elements in new configuration |
| **novel** | Introduces an element not previously considered in this domain |
| **radical** | Challenges the frame of the decision itself |

### Option robustness (Foresight)

| Level | Meaning |
|-------|---------|
| **fragile** | Performs well in 1 scenario, poorly in others |
| **sensitive** | Performs well in 2-3 scenarios |
| **robust** | Performs acceptably in most scenarios |
| **antifragile** | Benefits from volatility; improves under stress |

---

## Confidence taxonomy

Used by: all agents (in the envelope field)

| Level | Meaning | When to use |
|-------|---------|-------------|
| **high** | Strong evidence, multiple sources, low ambiguity | Claims well-supported by current data and reasoning |
| **medium** | Reasonable evidence but with material uncertainty | Claims supported but with known limitations |
| **low** | Significant uncertainty, speculative elements | Claims based on weak evidence or high extrapolation |

Confidence propagates: the final synthesis cannot exceed the confidence of its weakest critical input.

---

## Using the taxonomies

- Agents **must** classify using these categories
- Agents **may** add a `driver_custom` field when no Level 2 category fits — this is data for future taxonomy extensions
- The Meta-Orchestrator validates that agent outputs use valid taxonomy values and rejects outputs that don't

This is not bureaucracy. It's the shared language that makes AITS a system rather than a collection of improvisations.
