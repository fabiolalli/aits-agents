# AITS Board — Decision Dashboard

Display the current state of an ongoing or completed AITS analysis, with options to intervene.

## What It Does

Presents a real-time dashboard of where the AITS analysis stands:
- Which agents have been activated and their key outputs
- Which agents are pending in the sequence
- Any open conflicts or unresolved gates
- The current partial synthesis (if available)
- Options to intervene at any point

## When to Use It

- Mid-analysis: "Where are we? What have we found so far?"
- After switching away from a long analysis and coming back
- To get an overview before deciding to drill down
- To check if any mandatory gates need attention

## Expected Output

```
═══════════════════════════════════════════════════
  AITS DECISION BOARD
═══════════════════════════════════════════════════

▶ PROBLEM: [Original problem statement]
▶ MODE: [full/quick/diverge] | HITL: [supervised/autonomous/review]
▶ STATUS: [in progress / awaiting input / complete]

──────────────────────────────────────────────────
  AGENT STATUS
──────────────────────────────────────────────────

  ✅ Analytical (White)        — [1-line summary]
  ✅ Emotional-Intuitive (Red) — [1-line summary]
  🔄 Creative-Generative (Green) — IN PROGRESS
  ⏳ Critical-Validator (Black) — PENDING
  ⏳ Optimizer (Yellow)         — PENDING
  ➖ Ethical-Governance (Purple) — NOT IN SEQUENCE
  ➖ Predictive-Strategic (Indigo) — NOT IN SEQUENCE

──────────────────────────────────────────────────
  FLAGS & GATES
──────────────────────────────────────────────────

  ⚠️ [Any open mandatory gates or conflicts]
  📊 Confidence so far: [preliminary assessment]

──────────────────────────────────────────────────
  PARTIAL SYNTHESIS
──────────────────────────────────────────────────

  [What we can conclude so far based on completed agents]

──────────────────────────────────────────────────
  YOUR OPTIONS
──────────────────────────────────────────────────

  [1] ▶️  RESUME — continue from where we left off
  [2] 🔍 DRILL DOWN — examine a specific agent's full output
  [3] 🔁 RE-RUN — re-run a completed agent with new context
  [4] ➕ ADD — add an agent to the sequence
  [5] ⏭️  SKIP — skip the next pending agent
  [6] 🔀 REORDER — change the remaining sequence
  [7] 🏁 SYNTHESIZE NOW — produce synthesis with what we have
  [8] ⛔ ABORT — stop and discard

═══════════════════════════════════════════════════
```

## Instructions

Present the current state of the AITS analysis in the dashboard format above. If no analysis is in progress, inform the user and suggest starting one with `/aits-full`, `/aits-quick`, or `/aits-diverge`. The dashboard is read-only by default — it displays status and offers intervention options. The user's response determines the next action. This command can be used at any point during an analysis to get an overview and regain control of the flow.
