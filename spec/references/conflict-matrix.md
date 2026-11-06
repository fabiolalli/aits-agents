# Conflict Matrix — Agent Disagreement Resolution

When two AITS agents produce conflicting conclusions, the resolution is not left to improvisation. This matrix codifies, for every meaningful pairwise conflict, **who arbitrates**, **on what basis**, and **what escalation path** applies.

The Meta-Orchestrator consults this matrix whenever it detects a conflict during integration. A conflict is detected when two agents produce recommendations that cannot both be acted on without contradiction.

---

## Conflict severity scale

Before resolution, every conflict is classified by severity:

| Level | Description | Resolution path |
|-------|-------------|-----------------|
| **L1 — Divergence** | Different emphasis, compatible conclusions | Meta-Orchestrator integrates both perspectives in synthesis |
| **L2 — Tension** | Different priorities, partially compatible | Arbiter agent (per matrix below) rebalances |
| **L3 — Contradiction** | Mutually exclusive recommendations | Arbiter agent + explicit synthesis choice required |
| **L4 — Red line** | Ethical or legal inviolability breached | Mandatory HITL gate, no autonomous resolution |

---

## Pairwise conflict matrix

The matrix lists conflicts as **(Agent A vs Agent B)** — the pair that tends to disagree. For each pair: **nature of typical disagreement**, **arbiter**, **decision principle**.

### Core conflicts (the most frequent)

#### Analytical ⚪ vs Emotional-Intuitive 🔴
- **Typical nature**: Data say one thing, stakeholders feel another (e.g., "the numbers support restructuring" vs "the team will lose faith")
- **Severity**: Usually L2
- **Arbiter**: **Ethical-Governance** 🟣
- **Principle**: Both are valid; the decision must either accommodate both or explicitly choose which to privilege, with accountability

#### Critical-Validator ⚫ vs Optimizer 🟡
- **Typical nature**: "Too risky to proceed" vs "Value clearly exceeds risk"
- **Severity**: Ranges L2–L3
- **Arbiter**: **Ethical-Governance** 🟣 (as defined in inviolable rule #4)
- **Principle**: When optimism and pessimism cannot reconcile through data, fairness and long-term accountability break the tie
- **Special handling**: If ⚫ flags risk ≥ "high", mandatory gate triggers before arbitration proceeds

#### Critical-Validator ⚫ vs Creative-Generative 🟢
- **Typical nature**: "These ideas are fragile" vs "Breakthrough requires accepting fragility early"
- **Severity**: Usually L2
- **Arbiter**: **Foresight** 🔭 (if available) or **Meta-Orchestrator** 🔵
- **Principle**: Ideas should not be killed by premature critique; but fragile ideas should not pass the stress test unexamined. Foresight evaluates whether the idea is robust across scenarios.

#### Optimizer 🟡 vs Ethical-Governance 🟣
- **Typical nature**: "This creates value" vs "This creates value for the wrong parties or at unacceptable cost"
- **Severity**: Ranges L2–L4
- **Arbiter**: **Ethical-Governance wins by precedence** (inviolable rule #6)
- **Principle**: Efficiency without fairness is not acceptable optimization. If Ethical flags a red line, this becomes L4 automatically.

#### Predictive-Strategic 🔮 vs Analytical ⚪
- **Typical nature**: "Future scenarios suggest X" vs "Current data shows Y"
- **Severity**: Usually L1–L2
- **Arbiter**: **Meta-Orchestrator** 🔵
- **Principle**: Present data grounds predictive models but does not supersede them when the decision horizon is long. The synthesis must make the time horizon explicit.

#### Systemic 🌐 vs Optimizer 🟡
- **Typical nature**: "This optimization breaks a feedback loop" vs "The direct gains outweigh second-order effects"
- **Severity**: Ranges L2–L3
- **Arbiter**: **Predictive-Strategic** 🔮 (simulates the breakdown scenarios)
- **Principle**: Local optima are suspicious when systemic feedback is non-linear. Predictive runs the scenario, Meta synthesizes.

#### Creative-Generative 🟢 vs Emotional-Intuitive 🔴
- **Typical nature**: "This novel approach is the best option" vs "Stakeholders will reject it on sight"
- **Severity**: Usually L2
- **Arbiter**: **Meta-Orchestrator** 🔵 with option re-framing
- **Principle**: A good idea rejected by stakeholders is a failed idea. Creative must either revise the framing or accept Emotional's veto with explicit acknowledgment of the lost option.

#### Foresight 🔭 vs Optimizer 🟡
- **Typical nature**: "This option maximizes expected value but is fragile across scenarios" vs "Expected value is what matters"
- **Severity**: Usually L2
- **Arbiter**: **Meta-Orchestrator** 🔵 (with user HITL preferred)
- **Principle**: Risk-adjusted expected value requires a choice between expected-value maximization and robustness — this is a user preference, not an agent decision. Raise HITL.

#### Ethical-Governance 🟣 vs any agent
- **Severity**: L4 when red line is flagged; L2–L3 otherwise
- **Arbiter**: **Ethical-Governance itself** for red-line cases (inviolable rule #6)
- **Principle**: Red lines cannot be arbitrated away. The only paths are: remove the violation, escalate to HITL, abort.

---

## Extended conflicts

#### Systemic 🌐 vs Critical-Validator ⚫
- **Typical nature**: Disagreement on the scope of risk (direct risks vs cascade effects)
- **Arbiter**: **Meta-Orchestrator** 🔵 — integrate by combining both risk maps into a unified view

#### Foresight 🔭 vs Creative-Generative 🟢
- **Typical nature**: "This option is robust" vs "Robustness in today's scenarios means stagnation in tomorrow's"
- **Arbiter**: **Meta-Orchestrator** 🔵 with explicit time-horizon choice surfaced to HITL

#### Predictive-Strategic 🔮 vs Foresight 🔭
- **Typical nature**: These two rarely conflict; when they do, it's usually about scenario boundaries
- **Arbiter**: **Meta-Orchestrator** — request scenario re-scoping from both, usually with added context from Systemic

---

## Escalation path

Every conflict follows this path:

```
1. DETECT — Meta-Orchestrator identifies the conflict and classifies severity (L1–L4)
2. LOG — Conflict entered in decision_log with timestamp and both positions
3. LOOKUP — This matrix is consulted for arbiter assignment
4. ARBITRATE — Arbiter agent is invoked with both conflicting outputs as context
5. RESOLVE — One of four outcomes:
   (a) Integration: both positions absorbed into synthesis (typical for L1)
   (b) Rebalance: arbiter reweights or reframes (typical for L2)
   (c) Choice: arbiter declares one position prevails with rationale (typical for L3)
   (d) Escalation: mandatory HITL gate (typical for L4)
6. RECORD — Resolution entered in decision_log with arbiter's reasoning
```

---

## Escalation to human

HITL escalation is **mandatory** when:

- The conflict is classified L4 (red line)
- The arbiter itself cannot resolve (agent returns `"resolution": "inconclusive"`)
- Two different arbiters would apply and their recommendations differ
- The conflict involves the Meta-Orchestrator's own synthesis (a meta-conflict)

HITL escalation is **recommended** (but can be overridden in autonomous mode) when:

- Conflict is L3 and the arbiter's confidence is "low"
- The time horizon of the disagreement is the root cause (present vs future trade-off)
- The conflict involves a user-preference dimension (risk appetite, time preference, fairness weights)

---

## Using this matrix

The Meta-Orchestrator does not need to memorize this file. It must:

1. **Read this file** at the start of every analysis if the playbook indicates conflicts are likely
2. **Query this file by pair** when a conflict is detected: "I have a conflict between Optimizer and Ethical — what does the matrix say?"
3. **Cite the matrix** in the decision log when recording a resolution: "Per conflict-matrix §Optimizer-vs-Ethical, Ethical prevails by inviolable rule #6."

This transforms conflict resolution from ad-hoc judgment into traceable governance.
