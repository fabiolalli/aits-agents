---
name: aits-board
description: Generate or view the AITS 2.0 decision dashboard. Shows the current state of an ongoing analysis (agents completed, findings, conflicts, open gates) or produces a self-contained HTML dashboard for a completed analysis. The dashboard includes agent flow graph, risk heatmap, confidence meter, conflict timeline, robustness matrix (if Foresight ran), action plan, and HITL log.
---

# /aits-board — AITS 2.0 Decision Dashboard

This command either displays the current state of an in-flight analysis or generates a visual HTML dashboard for a completed analysis.

## Two modes

### In-flight mode

If an analysis is currently running:

```
/aits-board
```

Displays:

- Agents completed (with status indicators)
- Agents pending
- Key findings so far
- Open HITL gates (if any)
- Current confidence level
- Current option space (if Creative has run)
- Current top risks (if Critical has run)
- Your available actions (continue, intervene, switch mode, abort)

### HTML dashboard mode

For any completed analysis (including past decisions in `.aits/memory/`):

```
/aits-board for [decision-id or title]
```

Generates a self-contained HTML file at `.aits/dashboard/[title-slug].html` with:

- **Header** — decision title, date, confidence level, HITL mode used
- **Agent flow graph** — visual sequence with links showing handoffs
- **Key findings by agent** — expandable cards per agent
- **Risk heatmap** — risk map from Critical visualized as a 5×5 probability × impact grid
- **Robustness matrix** — if Foresight ran, the full options-scenarios matrix as a color-coded table
- **Confidence meter** — overall confidence with breakdown by agent
- **Conflict timeline** — conflicts detected, severity level, arbiter, resolution with matrix citations
- **Ethical assessment** — Purple's 7-dimension assessment as a radar chart
- **Action plan** — timestamped actions with owners and dependencies
- **HITL log** — every checkpoint, gate, and human intervention

## Usage examples

```
/aits-board
```
→ Shows current state of in-flight analysis

```
/aits-board for 2026-04-17_product-x-launch
```
→ Generates HTML dashboard for that past decision

```
/aits-board for last
```
→ Generates HTML dashboard for the most recent completed analysis

```
/aits-board for pattern product-launch-cold-start
```
→ Generates an aggregated dashboard showing all past decisions matching this pattern with their retrospective outcomes

## In-flight state display format

```
═══════════════════════════════════════════════════
  AITS 2.0 BOARD — In-flight analysis
═══════════════════════════════════════════════════
▶ PROBLEM: [problem statement truncated to 100 chars]
▶ PATTERN MATCH: [pattern_id or "none"] (conf [0.0])
▶ PLAYBOOK: [playbook_name or "none"]
▶ HITL MODE: [supervised|autonomous|review]

▶ SEQUENCE PROGRESS
  ✅ ⚪ Analytical        — [summary, 1 line]
  ✅ 🔴 Emotional         — [summary]
  ⏳ ⚫ Critical           — RUNNING
  ⏸️ 🟡 Optimizer          — pending
  ⏸️ 🟣 Ethical            — pending (conditional on Critical severity)
  ⏸️ 🔵 Predictive         — pending (conditional)
  ⏸️ 🎯 Synthesis          — pending

▶ HITL FLAGS OPEN: [list or "none"]
▶ CONFLICTS OPEN: [list or "none"]
▶ CURRENT CONFIDENCE TREND: [high→medium, reasoning]

▶ YOUR OPTIONS
  [1] ⏩ CONTINUE — let the current agent finish
  [2] ✏️  CORRECT — add context for the current agent
  [3] 🔀 REDIRECT — change remaining sequence
  [4] 🛑 PAUSE — switch to supervised after current agent
  [5] ⛔ ABORT — stop with partial synthesis
═══════════════════════════════════════════════════
```

## HTML dashboard template

The HTML template (in `aits-dashboard.md`) produces a self-contained single file with:

- No external dependencies (inlined CSS, inlined SVG)
- Light/dark mode toggle
- Print-friendly styling
- Accessibility-compliant (ARIA labels, keyboard navigation)
- Exportable to PDF via browser print

## When to use

- **In-flight mode**: whenever you want to see where you are without disrupting the flow. The check is non-invasive — it reports state without consuming a checkpoint.
- **HTML dashboard**: for sharing with stakeholders, for archival, for retrospective reviews, for pattern comparison across decisions
- **Pattern mode**: to see retrospective accuracy of past predictions for the same pattern archetype

## Pattern dashboard

The pattern view (when called with `/aits-board for pattern [pattern_id]`) shows:

- Count of decisions matching this pattern
- % with completed retrospectives
- Prediction accuracy per agent (which agent's predictions tend to hold up)
- Recurring failure modes
- Recurring success factors
- Drift over time (are recent instances different from older ones?)

This is the LEARN function of Memory made visible.
