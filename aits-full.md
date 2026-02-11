# AITS Full Analysis

Run a complete decision analysis with the AITS system (Adaptive Intelligence Thinking System).

## What It Does

Activates the Meta-Orchestrator (Blue) which orchestrates a complete sequence of cognitive agents to analyze the problem from every dimension:

1. **Analytical (White)** -> Factual base: data, metrics, gaps
2. **Emotional-Intuitive (Red)** -> Perceptions, emotions, stakeholder resistance
3. **Creative-Generative (Green)** -> Alternatives and unconventional options
4. **Critical-Validator (Black)** -> Stress test: risks, fallacies, guardrails
5. **Optimizer (Yellow)** -> Business case, quick wins, value levers
6. **Ethical-Governance (Purple)** -> Fairness, compliance, red lines
7. **Predictive-Strategic (Indigo)** -> Future scenarios, sensitivity
8. **Systemic (optional)** -> If the problem has complex interdependencies
9. **Foresight (optional)** -> If options are > 4
10. **Meta-Orchestrator (Blue)** -> Integrated synthesis, decision, action plan

## How to Use It

Describe the decision problem completely, including:
- The business context
- The stakeholders involved
- The constraints (time, budget, resources)
- The options already considered (if any)
- The relevant KPIs

The Blue will autonomously decide whether to activate all agents or only those needed, and will manage conflicts and iterations according to AITS rules.

## When to Use It

- Important strategic decisions
- Problems with multiple dimensions (financial, human, ethical, technological)
- Irreversible choices or those with long-term impact
- Situations where maximum decision-making rigor is needed

## Expected Output

A structured JSON with:
- Integrated synthesis that unifies all perspectives
- Clear and actionable decision
- Action plan with owners, timelines, and dependencies
- Decision log that traces each agent's contribution
- Confidence level and uncovered dimensions

## Instructions

Use the sub-agent `aits-meta-orchestrator` to orchestrate the complete analysis of the problem described by the user. The Meta-Orchestrator will autonomously determine the optimal sequence of agents, invoking them as sub-tasks and integrating their outputs into the final synthesis. Follow the AITS system rules for managing conflicts, missing data, and high risks.
