---
name: aits-diverge
description: Divergent AITS 2.0 brainstorming in review mode. Activates the Meta-Orchestrator with a creative-first sequence (Creative-Generative → Emotional-Intuitive → Foresight → Synthesis) and runs the full analysis without voluntary checkpoints. At the end, presents everything with a drill-down review interface. Default for idea generation, option exploration, and problems where premature filtering would kill the best ideas.
---

# /aits-diverge — Divergent AITS 2.0 (Review Mode)

This command activates the Meta-Orchestrator in **review mode** — full generative sequence runs uninterrupted, then everything is presented for structured review at the end.

## When to use

- Idea generation and option exploration
- When the problem is "we need more alternatives"
- Breaking out of false binaries
- Innovation sprints and creative strategy sessions
- When you want creative flow without premature critique

## What happens

1. **Intake** — Meta-Orchestrator reads the problem; notes if this is a deadlock-reframing call (Critical or Optimizer couldn't find a path with existing options)
2. **Execution — uninterrupted** — the creative-first sequence runs without voluntary checkpoints:
   - **🟢 Creative-Generative** — generates options, novelty-labeled, with cross-domain analogies and micro-tests
   - **🔴 Emotional-Intuitive** — maps stakeholder reception for the generated options (adoption profile hints)
   - **🔭 Foresight** (if ≥ 4 viable options, triggered by inviolable rule #5) — options-scenarios matrix and robustness ranking
   - **🎯 Synthesis** — integrated view of the option space
3. **Review interface** — full analysis presented at once:

```
═══════════════════════════════════════════════════
  AITS ANALYSIS COMPLETE — Review Mode
═══════════════════════════════════════════════════
▶ DECISION LOG
▶ OPTION SPACE (labeled by novelty: incremental/adjacent/novel/radical)
▶ DISSOLVED BINARIES (options that reframe the original question)
▶ ROBUSTNESS RANKING (if Foresight ran)
▶ STRATEGIC RECOMMENDATION

▶ REVIEW OPTIONS
  [1] ✅ ACCEPT and generate action plan
  [2] 🔍 DRILL DOWN on specific option
  [3] 🔁 RE-RUN Creative with new constraint
  [4] ➕ ADD Critical-Validator for stress-testing the options
  [5] 🔄 RECALCULATE with modified problem framing
═══════════════════════════════════════════════════
```

## Usage

```
/aits-diverge

[your problem — ideally an open question, not a yes/no decision]
```

Good prompts for diverge:

- "How can we differentiate in market X?"
- "What options do we have for expanding capacity without hiring?"
- "We're stuck choosing between A and B — what else is possible?"

## Mandatory gates still apply

Even in review mode, inviolable rules trigger explicit gates mid-flow:

- Rule #6 (ethical red line) — any red-line flag in the generated options triggers a gate
- Rule #5 (≥ 4 options) — Foresight activation is automatic, no gate needed

## Upgrade path

After review, common next steps:

- "Take options 2 and 5 and run `/aits-full` on the go/no-go"
- "Run Critical-Validator on the full option set"
- "Generate action plan for option 3"

## Default sequence

**🟢 Creative-Generative → 🔴 Emotional-Intuitive → [🔭 Foresight if options ≥ 4] → 🎯 Synthesis**

## Why no Critical in the default sequence

Critical's job is to kill fragile options. Doing that inside the divergent phase defeats the point. Critical runs next, either via `/aits-full` on the chosen option(s) or via explicit invocation in the review interface.

## Key difference from 1.x

- Creative now produces options with explicit novelty levels and analogical chains
- Emotional runs after Creative (not before) to supply adoption profile data per option
- Foresight triggers on ≥ 4 options automatically
- Review interface includes dissolved-binaries and staged-commitment paths
- Options are passed to downstream flows with full handoff packets, not re-analyzed from scratch
