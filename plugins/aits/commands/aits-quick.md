---
name: aits-quick
description: Rapid AITS 2.0 decision in autonomous mode. Activates the Meta-Orchestrator with a minimal 3-agent sequence (Analytical → Critical-Validator → Optimizer) and auto-escalates to additional agents when inviolable rules require. No voluntary checkpoints — only mandatory gates pause the flow. Default for time-sensitive decisions with moderate stakes.
---

# /aits-quick — Rapid AITS 2.0 Decision (Autonomous Mode)

This command activates the Meta-Orchestrator in **autonomous mode** — minimal agent sequence, no voluntary checkpoints, mandatory gates still enforced.

## When to use

- Time-sensitive decisions where speed matters more than depth
- Lower-stakes decisions where full multi-agent analysis would be overkill
- Follow-up iterations after a full analysis on related topics
- Routine recurring decisions of the same type

## What happens

1. **Intake** — Meta-Orchestrator reads the problem, matches pattern library, recalls memory, picks a playbook if one clearly fits
2. **Execution** — 3-agent sequence runs uninterrupted:
   - **⚪ Analytical** — facts and data baseline
   - **⚫ Critical-Validator** — risk map and premortems
   - **🟡 Optimizer** — value case and action plan
3. **Auto-escalation** — inviolable rules trigger automatic additions:
   - Rule #2: data gap → return to Analytical
   - Rule #3: risk severity ≥ 10 → activate Ethical or Predictive
   - Rule #4: Black/Yellow L3 conflict → activate Ethical
   - Rule #6: ethical red line → mandatory HITL gate
4. **Mandatory gates** — when triggered, the flow pauses with a gate checkpoint requiring explicit user input
5. **Synthesis** — Meta-Orchestrator closes the decision with the usual structured output

## Gate checkpoint format

```
═══════════════════════════════════════════════════
  ⚠️  MANDATORY GATE — [Reason]
═══════════════════════════════════════════════════
▶ TRIGGER [rule citation]
▶ AGENT OUTPUT SUMMARY
▶ IMPLICATIONS
▶ RULE REQUIRES

▶ YOUR OPTIONS
  [1] ✅ ACKNOWLEDGE & PROCEED
  [2] ✏️  PROVIDE CONTEXT
  [3] 🛑 PAUSE (switch to supervised)
  [4] ⛔ ABORT
═══════════════════════════════════════════════════
```

## Usage

```
/aits-quick

[your problem statement]
```

## Upgrade paths

If the autonomous flow is producing low-confidence outputs or frequent mandatory gates, switch modes:

- "Switch to supervised" — start getting checkpoints from next agent
- "Switch to full analysis" — restart with `/aits-full` (rare; usually the autonomous flow + occasional gates is sufficient)

## When `/aits-quick` auto-upgrades

The Meta-Orchestrator will recommend upgrading to `/aits-full` and stop for your approval when:

- ≥ 2 mandatory gates have been triggered in a single analysis (signal of complexity beyond quick scope)
- Pattern library match suggests an archetype whose `recommended_playbook` requires full analysis (e.g., `ma-due-diligence` with high stakes)
- The problem domain involves vulnerable populations or irreversible commitments

## Default sequence

**⚪ Analytical → ⚫ Critical-Validator → 🟡 Optimizer → 🎯 Synthesis**

With auto-escalations per inviolable rules.

## What makes quick "quick"

- No voluntary checkpoints
- 3 agents instead of 7-9
- Memory is consulted but pattern library matching is a simpler keyword match (not full archetype loading)
- Playbook loading is optional (only if a very specific match)

The cost: less depth on people/ethics/futures dimensions. The quick mode explicitly trades these for speed. Use `/aits-full` when those dimensions matter.
