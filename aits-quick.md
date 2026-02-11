# AITS Quick Decision

Run a rapid decision analysis with the AITS system — fast track for decisions that require rigor but not the full flow.

## What It Does

Activates a reduced sequence of 3 agents + synthesis:

1. **Analytical (White)** -> Essential factual base
2. **Critical-Validator (Black)** -> Main risks and deal-breakers
3. **Optimizer (Yellow)** -> Capturable value and quick wins
4. **Meta-Orchestrator (Blue)** -> Synthesis and rapid decision

If the Black flags "high" risk, the Blue will automatically activate the Ethical or the Predictive (inviolable AITS rule).

## How to Use It

Describe the problem concisely. The focus is on:
- What do I need to decide?
- What are the main constraints?
- By when is the decision needed?

## When to Use It

- Day-to-day operational decisions that still require structure
- Rapid go/no-go decisions
- Preliminary assessments before a full analysis
- When time is the main constraint

## Expected Output

A lean JSON with:
- Key verified facts
- Top 3 risks
- Concise business case
- Decision with confidence level
- Any flags for deeper analysis

## Instructions

Use the sub-agent `aits-meta-orchestrator` in quick mode. Invoke in sequence: `aits-analytical`, then `aits-critical-validator`, then `aits-optimizer`. Collect the JSON outputs and produce a rapid synthesis. If the Critical-Validator flags high risk, activate `aits-ethical-governance` or `aits-predictive-strategic` before the synthesis. The objective is a solid decision in the shortest time possible.

