---
name: aits-full
description: Full AITS 2.0 analysis in supervised mode. Activates the Meta-Orchestrator with checkpoint after every agent. The user can approve, correct, redirect, redo, or switch to autonomous at each step. Default for high-stakes, irreversible decisions. Consults pattern library and memory, matches playbooks, enforces all seven inviolable rules, validates schemas, resolves conflicts via the matrix.
---

# /aits-full — Full AITS 2.0 Analysis (Supervised Mode)

This command activates the Meta-Orchestrator in **supervised mode** — the highest-depth, highest-oversight AITS flow.

## When to use

- Irreversible or high-stakes decisions
- Decisions with material human, ethical, or strategic consequences
- When you want maximum depth and control
- First time applying AITS to a new type of decision

## What happens

1. **Intake** — Meta-Orchestrator reads your problem, matches against `references/pattern-library.md`, searches `.aits/memory/` for similar past decisions, detects a matching playbook from `playbooks/`
2. **Plan announcement** — Meta-Orchestrator tells you the pattern match, the playbook choice, and the planned agent sequence
3. **Execution** — Agents run in sequence. After **each** agent, a checkpoint is presented:

```
═══════════════════════════════════════════════════
  AITS CHECKPOINT — [Agent] ([Color]) complete
═══════════════════════════════════════════════════
▶ KEY FINDINGS
▶ CONFIDENCE
▶ PATTERN MATCH
▶ HITL FLAGS RAISED
▶ NEXT IN SEQUENCE

▶ YOUR OPTIONS
  [1] ✅ PROCEED
  [2] ✏️  CORRECT
  [3] 🔀 REDIRECT
  [4] 🔁 REDO
  [5] ⏭️  SWITCH TO AUTONOMOUS

═══════════════════════════════════════════════════
```

4. **Mandatory gates** — even in supervised mode, inviolable rules trigger explicit mandatory gates with rule citation
5. **Conflict resolution** — when agents conflict, `references/conflict-matrix.md` is consulted and the assigned arbiter is invoked
6. **Synthesis** — Meta-Orchestrator produces the final integrated output with decision, action plan, conflicts resolved, confidence level, and uncovered dimensions
7. **Memory** — the decision record is saved to `.aits/memory/` for future pattern learning
8. **Dashboard (optional)** — if you include "generate dashboard" in your command, an HTML dashboard is produced

## Usage

```
/aits-full

[your problem statement]
```

You can specify a playbook:

```
/aits-full

Use the M&A due diligence playbook.
Should we acquire company Z?
```

You can include dashboard generation:

```
/aits-full generate dashboard

[problem]
```

## Default sequence

Unless a playbook overrides it, the default supervised sequence is:

**⚪ Analytical → 🔴 Emotional-Intuitive → 🟢 Creative-Generative → ⚫ Critical-Validator → 🟡 Optimizer → 🟣 Ethical-Governance → 🔵 Predictive-Strategic → [🌐 Systemic if interdependencies] → [🔭 Foresight if ≥4 options] → 🎯 Meta-Orchestrator Synthesis**

## Mode switching

At any checkpoint, you can:

- Switch to **autonomous** (option 5) — continue without checkpoints, mandatory gates still apply
- Switch to **review** — complete remaining agents silently, review all at end

## What makes this different from 1.x

- **Pattern matching** at intake informs the whole analysis
- **Schema validation** — every agent output is validated; failures are auto-retried once, then gated
- **Conflict matrix** — L1-L4 severity resolution, codified not improvised
- **Handoff protocols** — every agent declares what it passes to downstream agents
- **Confidence propagation** — synthesis confidence bounded by weakest critical input

See `AITS.md` for the full manifesto and `references/agent-contract.md` for the structural details.
