# AITS Dashboard — Visual Decision Dashboard

Generate an interactive HTML dashboard that visualizes the current or completed AITS analysis. Open it in a browser for a visual overview of the decision-making process.

## What It Does

After an AITS analysis completes (or at any checkpoint during a supervised analysis), the Meta-Orchestrator can generate a self-contained HTML file that visualizes:

1. **Agent Flow Graph** — Which agents were activated, in what order, with directional arrows showing information flow
2. **Agent Status** — Color-coded status for each agent (completed, in progress, pending, not in sequence)
3. **Key Findings Cards** — Expandable cards with each agent's key output
4. **Risk Heatmap** — Visual risk matrix (probability × impact) from the Critical-Validator
5. **Conflict Timeline** — Where agents disagreed and how conflicts were resolved
6. **Confidence Meter** — Overall decision confidence with breakdown by dimension
7. **Decision Summary** — The final synthesis and action plan
8. **HITL Log** — Visual timeline of human interventions

## How to Use

### Automatic generation
Add "generate dashboard" to any AITS command:
```
/aits-full generate dashboard
"Should we launch product X in market Y?"
```

### After analysis
```
"Generate a visual dashboard for this analysis"
```

### The dashboard file
The HTML file is written to `.aits/dashboard/[decision-title].html` and can be opened in any browser. It is fully self-contained (no external dependencies).

## Instructions

When asked to generate a dashboard, the Meta-Orchestrator should use the Write tool to create an HTML file at `.aits/dashboard/[decision-title].html`. The HTML must be self-contained with inline CSS and JavaScript (no external CDN dependencies). Use the template structure below, filling in the actual data from the completed analysis.

### HTML Template Structure

Write the following HTML structure, replacing all `{{PLACEHOLDER}}` values with actual analysis data:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AITS Dashboard — {{DECISION_TITLE}}</title>
<style>
  :root {
    --blue: #3b82f6; --white-agent: #94a3b8; --red: #ef4444;
    --black: #1e293b; --yellow: #eab308; --green: #22c55e;
    --purple: #a855f7; --indigo: #6366f1; --teal: #14b8a6;
    --bg: #0f172a; --card: #1e293b; --text: #e2e8f0; --border: #334155;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); padding: 24px; }
  .header { text-align: center; margin-bottom: 32px; }
  .header h1 { font-size: 28px; color: var(--blue); margin-bottom: 8px; }
  .header .subtitle { color: #94a3b8; font-size: 14px; }
  .meta-bar { display: flex; justify-content: center; gap: 24px; margin: 16px 0; flex-wrap: wrap; }
  .meta-item { background: var(--card); padding: 8px 16px; border-radius: 8px; font-size: 13px; border: 1px solid var(--border); }
  .meta-item strong { color: var(--blue); }

  /* Grid Layout */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .grid-full { grid-column: 1 / -1; }

  /* Cards */
  .card { background: var(--card); border-radius: 12px; padding: 20px; border: 1px solid var(--border); }
  .card h2 { font-size: 16px; color: var(--blue); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .card h2 .icon { font-size: 20px; }

  /* Agent Flow */
  .flow { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; padding: 16px; }
  .agent-node { padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; color: white; text-align: center; min-width: 100px; position: relative; }
  .agent-node.completed { opacity: 1; }
  .agent-node.pending { opacity: 0.4; }
  .agent-node.active { animation: pulse 2s infinite; }
  .flow-arrow { color: #475569; font-size: 20px; }
  @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); } 50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); } }

  /* Findings */
  .finding { margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid var(--border); }
  .finding .agent-label { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
  .finding .content { font-size: 13px; line-height: 1.5; color: #cbd5e1; }

  /* Risk Matrix */
  .risk-matrix { display: grid; grid-template-columns: auto repeat(5, 1fr); grid-template-rows: auto repeat(5, 1fr); gap: 2px; font-size: 11px; }
  .risk-cell { padding: 8px 4px; text-align: center; border-radius: 4px; min-height: 36px; display: flex; align-items: center; justify-content: center; }
  .risk-label { font-weight: 600; color: #94a3b8; display: flex; align-items: center; justify-content: center; }
  .risk-low { background: rgba(34,197,94,0.15); }
  .risk-med { background: rgba(234,179,8,0.15); }
  .risk-high { background: rgba(249,115,22,0.15); }
  .risk-critical { background: rgba(239,68,68,0.2); }
  .risk-item { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.1); }

  /* Confidence */
  .confidence-bar { height: 24px; background: #1e293b; border-radius: 12px; overflow: hidden; margin: 8px 0; }
  .confidence-fill { height: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .confidence-high { background: linear-gradient(90deg, var(--green), #16a34a); }
  .confidence-medium { background: linear-gradient(90deg, var(--yellow), #ca8a04); }
  .confidence-low { background: linear-gradient(90deg, var(--red), #dc2626); }

  /* Conflicts */
  .conflict { margin-bottom: 12px; padding: 12px; background: rgba(239,68,68,0.05); border-radius: 8px; border-left: 3px solid var(--red); }
  .conflict .agents { font-weight: 600; color: var(--red); font-size: 13px; }
  .conflict .resolution { font-size: 12px; color: #94a3b8; margin-top: 4px; }

  /* Decision Box */
  .decision-box { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1)); border: 1px solid var(--blue); border-radius: 12px; padding: 24px; text-align: center; }
  .decision-box h3 { color: var(--blue); font-size: 14px; margin-bottom: 8px; }
  .decision-box .decision-text { font-size: 18px; font-weight: 700; line-height: 1.4; }

  /* Action Plan */
  .action { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .action:last-child { border-bottom: none; }
  .action-num { background: var(--blue); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .action-details { flex: 1; }
  .action-details .action-title { font-weight: 600; }
  .action-details .action-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }

  /* HITL Log */
  .hitl-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .hitl-item:last-child { border-bottom: none; }
  .hitl-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .hitl-checkpoint { background: rgba(59,130,246,0.2); color: var(--blue); }
  .hitl-gate { background: rgba(239,68,68,0.2); color: var(--red); }
  .hitl-correction { background: rgba(234,179,8,0.2); color: var(--yellow); }

  /* Footer */
  .footer { text-align: center; margin-top: 32px; padding: 16px; color: #475569; font-size: 12px; }
  .footer a { color: var(--blue); text-decoration: none; }

  /* Responsive */
  @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } .flow { flex-direction: column; } }
</style>
</head>
<body>

<div class="header">
  <h1>AITS Decision Dashboard</h1>
  <div class="subtitle">Adaptive Intelligence Thinking System — by Fabio Lalli</div>
</div>

<div class="meta-bar">
  <div class="meta-item"><strong>Problem:</strong> {{PROBLEM_TITLE}}</div>
  <div class="meta-item"><strong>Mode:</strong> {{MODE}} | HITL: {{HITL_MODE}}</div>
  <div class="meta-item"><strong>Date:</strong> {{DATE}}</div>
  <div class="meta-item"><strong>Agents:</strong> {{AGENT_COUNT}} activated</div>
</div>

<!-- AGENT FLOW -->
<div class="card grid-full" style="margin-bottom: 20px;">
  <h2><span class="icon">🔄</span> Agent Flow</h2>
  <div class="flow">
    <!-- Repeat for each agent in sequence -->
    <!-- Example: -->
    <!-- <div class="agent-node completed" style="background: var(--white-agent);">⚪ Analytical</div> -->
    <!-- <span class="flow-arrow">→</span> -->
    {{AGENT_FLOW_NODES}}
  </div>
</div>

<div class="grid">

  <!-- KEY FINDINGS -->
  <div class="card">
    <h2><span class="icon">🔍</span> Key Findings</h2>
    {{FINDINGS_HTML}}
  </div>

  <!-- RISK HEATMAP -->
  <div class="card">
    <h2><span class="icon">⚠️</span> Risk Matrix</h2>
    <div class="risk-matrix">
      <div class="risk-label"></div>
      <div class="risk-label">Negligible</div>
      <div class="risk-label">Low</div>
      <div class="risk-label">Medium</div>
      <div class="risk-label">High</div>
      <div class="risk-label">Critical</div>

      <div class="risk-label">Very Likely</div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-high"></div>
      <div class="risk-cell risk-critical"></div>
      <div class="risk-cell risk-critical"></div>
      <div class="risk-cell risk-critical"></div>

      <div class="risk-label">Likely</div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-high"></div>
      <div class="risk-cell risk-critical"></div>
      <div class="risk-cell risk-critical"></div>

      <div class="risk-label">Possible</div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-high"></div>
      <div class="risk-cell risk-critical"></div>

      <div class="risk-label">Unlikely</div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-high"></div>

      <div class="risk-label">Rare</div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-low"></div>
      <div class="risk-cell risk-med"></div>
      <div class="risk-cell risk-med"></div>
    </div>
    <!-- Place risk items as overlays or below the matrix -->
    <div style="margin-top: 12px;">
      {{RISK_ITEMS_HTML}}
    </div>
  </div>

  <!-- CONFIDENCE -->
  <div class="card">
    <h2><span class="icon">📊</span> Confidence Level</h2>
    <div class="confidence-bar">
      <div class="confidence-fill {{CONFIDENCE_CLASS}}" style="width: {{CONFIDENCE_PCT}}%;">
        {{CONFIDENCE_LEVEL}} — {{CONFIDENCE_PCT}}%
      </div>
    </div>
    <div style="margin-top: 12px; font-size: 13px;">
      {{CONFIDENCE_BREAKDOWN_HTML}}
    </div>
  </div>

  <!-- CONFLICTS -->
  <div class="card">
    <h2><span class="icon">⚡</span> Conflicts & Resolutions</h2>
    {{CONFLICTS_HTML}}
    <!-- If no conflicts: -->
    <!-- <div style="color: #94a3b8; font-size: 13px;">No inter-agent conflicts detected.</div> -->
  </div>

</div>

<!-- DECISION -->
<div class="decision-box" style="margin-bottom: 20px;">
  <h3>DECISION</h3>
  <div class="decision-text">{{DECISION_TEXT}}</div>
</div>

<div class="grid">

  <!-- ACTION PLAN -->
  <div class="card">
    <h2><span class="icon">🎯</span> Action Plan</h2>
    {{ACTION_PLAN_HTML}}
  </div>

  <!-- HITL LOG -->
  <div class="card">
    <h2><span class="icon">🤝</span> Human-in-the-Loop Log</h2>
    <div style="margin-bottom: 8px; font-size: 12px; color: #94a3b8;">
      Checkpoints: {{CHECKPOINTS}} | Gates: {{GATES}} | Corrections: {{CORRECTIONS}}
    </div>
    {{HITL_LOG_HTML}}
  </div>

</div>

<div class="footer">
  <p>Generated by <a href="https://github.com/fabiolalli/aits-agents">AITS</a> — Adaptive Intelligence Thinking System by Fabio Lalli</p>
  <p>{{TIMESTAMP}}</p>
</div>

</body>
</html>
```

### How to Fill the Template

The Meta-Orchestrator replaces each `{{PLACEHOLDER}}` with actual data from the analysis:

| Placeholder | Source |
|-------------|--------|
| `{{DECISION_TITLE}}` | User's problem statement (shortened) |
| `{{PROBLEM_TITLE}}` | Full problem statement |
| `{{MODE}}` | full / quick / diverge |
| `{{HITL_MODE}}` | supervised / autonomous / review |
| `{{DATE}}` | Analysis date |
| `{{AGENT_COUNT}}` | Number of agents activated |
| `{{AGENT_FLOW_NODES}}` | HTML nodes for each agent with status colors |
| `{{FINDINGS_HTML}}` | Key findings cards from each agent |
| `{{RISK_ITEMS_HTML}}` | Risk items from Critical-Validator placed on matrix |
| `{{CONFIDENCE_CLASS}}` | confidence-high / confidence-medium / confidence-low |
| `{{CONFIDENCE_PCT}}` | Numeric confidence (high=85, medium=60, low=35) |
| `{{CONFIDENCE_LEVEL}}` | HIGH / MEDIUM / LOW |
| `{{CONFLICTS_HTML}}` | Conflict cards with resolution details |
| `{{DECISION_TEXT}}` | The final decision from synthesis |
| `{{ACTION_PLAN_HTML}}` | Action items with owners and timelines |
| `{{HITL_LOG_HTML}}` | Timeline of human interventions |
| `{{CHECKPOINTS}}` | Count of checkpoints presented |
| `{{GATES}}` | Count of mandatory gates triggered |
| `{{CORRECTIONS}}` | Count of human corrections |
| `{{TIMESTAMP}}` | Generation timestamp |

### Agent Node Colors

When generating flow nodes, use these colors:
- Analytical (White): `var(--white-agent)` / `#94a3b8`
- Emotional-Intuitive (Red): `var(--red)` / `#ef4444`
- Critical-Validator (Black): `var(--black)` / `#1e293b`
- Optimizer (Yellow): `var(--yellow)` / `#eab308`
- Creative-Generative (Green): `var(--green)` / `#22c55e`
- Ethical-Governance (Purple): `var(--purple)` / `#a855f7`
- Predictive-Strategic (Indigo): `var(--indigo)` / `#6366f1`
- Systemic: `var(--teal)` / `#14b8a6`
- Foresight: `var(--teal)` / `#14b8a6`
- Meta-Orchestrator (Blue): `var(--blue)` / `#3b82f6`
