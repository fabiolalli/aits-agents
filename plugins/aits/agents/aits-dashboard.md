---
name: aits-dashboard
description: HTML template and generator spec for AITS 2.0 visual dashboards. The Meta-Orchestrator reads this file when producing a dashboard. Defines the full HTML structure, CSS, and placeholder syntax. Produces a self-contained file (no external dependencies) suitable for sharing, archival, and print.
---

## Path Resolution (plugin install)

When this agent reads files referenced as `references/...`, `playbooks/...`, or `schemas/...`, those paths are **relative to the plugin root**, not to the current project.

Resolution rule:

1. At the start of your work, run once: `Bash(echo "$CLAUDE_PLUGIN_ROOT")` and cache the value. When AITS is installed as a Claude Code plugin, this resolves to something like `~/.claude/plugins/cache/aits-marketplace/aits/`.
2. Prepend that root to any `references/...`, `playbooks/...`, or `schemas/...` path before calling `Read`.
3. If `$CLAUDE_PLUGIN_ROOT` is empty (legacy install with files copied into `~/.claude/`), fall back to `$HOME/.claude/` as the root.

Project-local paths (e.g., `.aits/memory/...`) stay relative to the **current project** and must not be prefixed.


# aits-dashboard — HTML Dashboard Template

This file defines the template the Meta-Orchestrator uses to produce HTML dashboards for AITS 2.0 analyses. The template is a single self-contained HTML file with inlined CSS and inlined SVG.

## When this is used

- When the user invokes `/aits-full generate dashboard` or `/aits-board for [decision]`
- When any Meta-Orchestrator synthesis explicitly requests dashboard generation

## Output location

`.aits/dashboard/[title-slug].html`

## Placeholder syntax

The template uses `{{PLACEHOLDER}}` syntax for substitution. The Meta-Orchestrator fills these before writing.

## Full template

```html
<!DOCTYPE html>
<html lang="{{LANGUAGE}}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AITS 2.0 · {{DECISION_TITLE}}</title>
  <style>
    :root {
      --bg: #ffffff;
      --fg: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --card: #f8fafc;
      --accent: #2563eb;
      --white: #f1f5f9;
      --red: #dc2626;
      --black: #0f172a;
      --yellow: #d97706;
      --green: #059669;
      --purple: #7c3aed;
      --indigo: #4338ca;
      --cyan: #0891b2;
      --magenta: #c026d3;
      --gray: #6b7280;
      --risk-critical: #991b1b;
      --risk-high: #dc2626;
      --risk-medium: #d97706;
      --risk-low: #65a30d;
    }
    [data-theme="dark"] {
      --bg: #0f172a;
      --fg: #f1f5f9;
      --muted: #94a3b8;
      --border: #334155;
      --card: #1e293b;
    }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--fg); margin: 0; padding: 0; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    header { border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; margin-bottom: 2rem; }
    h1 { margin: 0 0 0.5rem 0; font-size: 1.75rem; }
    .meta { color: var(--muted); font-size: 0.9rem; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .meta-item { background: var(--card); padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border); }
    .meta-item-label { font-size: 0.75rem; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; }
    .meta-item-value { font-size: 1.1rem; font-weight: 500; margin-top: 0.25rem; }
    section { margin-bottom: 3rem; }
    h2 { font-size: 1.25rem; border-left: 4px solid var(--accent); padding-left: 0.75rem; margin-bottom: 1rem; }
    .agent-card { background: var(--card); border: 1px solid var(--border); border-left-width: 4px; border-radius: 0.5rem; padding: 1rem 1.25rem; margin-bottom: 1rem; }
    .agent-card[data-color="white"] { border-left-color: var(--white); }
    .agent-card[data-color="red"] { border-left-color: var(--red); }
    .agent-card[data-color="black"] { border-left-color: var(--black); }
    .agent-card[data-color="yellow"] { border-left-color: var(--yellow); }
    .agent-card[data-color="green"] { border-left-color: var(--green); }
    .agent-card[data-color="purple"] { border-left-color: var(--purple); }
    .agent-card[data-color="indigo"] { border-left-color: var(--indigo); }
    .agent-card[data-color="cyan"] { border-left-color: var(--cyan); }
    .agent-card[data-color="magenta"] { border-left-color: var(--magenta); }
    .agent-card[data-color="blue"] { border-left-color: var(--accent); }
    .agent-card[data-color="gray"] { border-left-color: var(--gray); }
    .agent-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .agent-name { font-weight: 600; font-size: 1.05rem; }
    .confidence-badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
    .conf-high { background: #dcfce7; color: #166534; }
    .conf-medium { background: #fef9c3; color: #854d0e; }
    .conf-low { background: #fee2e2; color: #991b1b; }
    .risk-grid { display: grid; grid-template-columns: 60px repeat(5, 1fr); gap: 2px; margin-top: 1rem; font-size: 0.85rem; }
    .risk-cell { padding: 0.5rem; text-align: center; border-radius: 0.25rem; min-height: 3rem; display: flex; align-items: center; justify-content: center; }
    .risk-axis { font-weight: 600; color: var(--muted); }
    .risk-s-low { background: #d1fae5; }
    .risk-s-medium { background: #fef3c7; }
    .risk-s-high { background: #fecaca; }
    .risk-s-critical { background: #fca5a5; color: white; font-weight: 600; }
    .conflict-item { border-left: 3px solid var(--accent); padding: 0.5rem 1rem; margin-bottom: 0.75rem; background: var(--card); }
    .conflict-severity { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
    .robustness-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 1rem; }
    .robustness-table th, .robustness-table td { padding: 0.5rem; border: 1px solid var(--border); text-align: center; }
    .robustness-table th { background: var(--card); }
    .perf-excellent { background: #bbf7d0; }
    .perf-good { background: #d9f99d; }
    .perf-acceptable { background: #fef9c3; }
    .perf-poor { background: #fed7aa; }
    .perf-failure { background: #fecaca; }
    .action-item { padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.5rem; background: var(--card); }
    .action-meta { color: var(--muted); font-size: 0.85rem; margin-top: 0.25rem; }
    .ethical-radar { max-width: 400px; margin: 1rem auto; }
    .hitl-entry { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
    .hitl-entry:last-child { border-bottom: none; }
    .theme-toggle { position: fixed; top: 1rem; right: 1rem; padding: 0.5rem 0.75rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.375rem; cursor: pointer; font-size: 0.85rem; }
    @media print {
      .theme-toggle { display: none; }
      section { page-break-inside: avoid; }
    }
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      h1 { font-size: 1.4rem; }
      .risk-grid { font-size: 0.7rem; }
    }
  </style>
</head>
<body>
  <button class="theme-toggle" onclick="toggleTheme()">🌓 Theme</button>
  <div class="container">
    <header>
      <h1>{{DECISION_TITLE}}</h1>
      <div class="meta">{{DECISION_DATE}} · AITS 2.0 analysis</div>
      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-item-label">Decision</div>
          <div class="meta-item-value">{{DECISION_TYPE}}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Confidence</div>
          <div class="meta-item-value">{{CONFIDENCE_LEVEL}}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">HITL Mode</div>
          <div class="meta-item-value">{{HITL_MODE}}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Pattern</div>
          <div class="meta-item-value">{{PATTERN_MATCH}}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Playbook</div>
          <div class="meta-item-value">{{PLAYBOOK_USED}}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Agents</div>
          <div class="meta-item-value">{{AGENTS_COUNT}}</div>
        </div>
      </div>
    </header>

    <section>
      <h2>Decision Statement</h2>
      <p style="font-size: 1.1rem;">{{DECISION_STATEMENT}}</p>
      {{#CONDITIONS}}
      <div style="margin-top: 1rem;">
        <strong>Conditions:</strong>
        <ul>{{CONDITIONS_LIST}}</ul>
      </div>
      {{/CONDITIONS}}
    </section>

    <section>
      <h2>Integrated Synthesis</h2>
      <p>{{INTEGRATED_SYNTHESIS}}</p>
    </section>

    <section>
      <h2>Agent Findings</h2>
      {{AGENT_CARDS}}
      <!-- Each agent produces a card like:
      <div class="agent-card" data-color="{{COLOR}}">
        <div class="agent-header">
          <div class="agent-name">{{SYMBOL}} {{AGENT_NAME}}</div>
          <span class="confidence-badge conf-{{CONF_LEVEL}}">{{CONF_LEVEL}}</span>
        </div>
        <p>{{KEY_FINDINGS_SUMMARY}}</p>
        {{#HITL_FLAGS}}<div style="color: var(--red); font-size: 0.85rem;">⚠ HITL flags raised: {{FLAGS}}</div>{{/HITL_FLAGS}}
      </div>
      -->
    </section>

    {{#HAS_RISK_MAP}}
    <section>
      <h2>Risk Heatmap</h2>
      <div class="risk-grid">
        <div class="risk-cell risk-axis"></div>
        <div class="risk-cell risk-axis">P1</div>
        <div class="risk-cell risk-axis">P2</div>
        <div class="risk-cell risk-axis">P3</div>
        <div class="risk-cell risk-axis">P4</div>
        <div class="risk-cell risk-axis">P5</div>
        <!-- Rows I5 down to I1, each with 5 cells colored by severity and labeled with risk names -->
        {{RISK_HEATMAP_ROWS}}
      </div>
      <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--muted);">
        <strong>Overall risk level:</strong> {{OVERALL_RISK_LEVEL}} — {{OVERALL_RISK_REASONING}}
      </div>
    </section>
    {{/HAS_RISK_MAP}}

    {{#HAS_ROBUSTNESS_MATRIX}}
    <section>
      <h2>Options × Scenarios Robustness Matrix</h2>
      <table class="robustness-table">
        <thead>
          <tr>
            <th>Option</th>
            {{SCENARIO_HEADERS}}
            <th>Robustness</th>
          </tr>
        </thead>
        <tbody>
          {{ROBUSTNESS_ROWS}}
        </tbody>
      </table>
    </section>
    {{/HAS_ROBUSTNESS_MATRIX}}

    {{#HAS_ETHICAL_ASSESSMENT}}
    <section>
      <h2>Ethical Assessment — 7 Dimensions</h2>
      <svg class="ethical-radar" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-label="Ethical dimension radar chart">
        {{ETHICAL_RADAR_SVG}}
      </svg>
      <div>{{ETHICAL_SUMMARY}}</div>
      {{#RED_LINES_DETECTED}}
      <div style="background: #fee2e2; border-left: 4px solid var(--red); padding: 1rem; margin-top: 1rem; border-radius: 0.25rem;">
        <strong>🚨 Red lines detected:</strong>
        <ul>{{RED_LINES_LIST}}</ul>
      </div>
      {{/RED_LINES_DETECTED}}
    </section>
    {{/HAS_ETHICAL_ASSESSMENT}}

    {{#HAS_CONFLICTS}}
    <section>
      <h2>Conflicts & Resolutions</h2>
      {{CONFLICT_ITEMS}}
      <!-- Each conflict:
      <div class="conflict-item">
        <div class="conflict-severity">{{SEVERITY_LEVEL}}</div>
        <div><strong>{{PARTY_A}} vs {{PARTY_B}}</strong></div>
        <div>{{NATURE}}</div>
        <div style="margin-top: 0.25rem; color: var(--muted); font-size: 0.85rem;">Arbiter: {{ARBITER}} — Rule: {{MATRIX_RULE}}</div>
        <div>{{RESOLUTION}}</div>
      </div>
      -->
    </section>
    {{/HAS_CONFLICTS}}

    <section>
      <h2>Action Plan</h2>
      {{ACTION_ITEMS}}
      <!-- Each action:
      <div class="action-item">
        <div><strong>{{ACTION_TEXT}}</strong></div>
        <div class="action-meta">Owner: {{OWNER}} · Timeline: {{TIMELINE}} · Source: {{AGENT_SOURCE}}</div>
        {{#DEPENDENCIES}}<div class="action-meta">Depends on: {{DEPS}}</div>{{/DEPENDENCIES}}
      </div>
      -->
    </section>

    <section>
      <h2>HITL Log</h2>
      <div style="background: var(--card); border-radius: 0.5rem; padding: 1rem;">
        <div class="hitl-entry">Mode used: <strong>{{HITL_MODE}}</strong></div>
        <div class="hitl-entry">Checkpoints presented: {{CHECKPOINTS_COUNT}}</div>
        <div class="hitl-entry">Mandatory gates triggered: {{GATES_COUNT}}</div>
        <div class="hitl-entry">Human corrections: {{CORRECTIONS_COUNT}}</div>
        <div class="hitl-entry">Redirects: {{REDIRECTS_COUNT}}</div>
        <div class="hitl-entry">Mode switches: {{MODE_SWITCHES_COUNT}}</div>
        {{#INTERVENTIONS}}
        <div class="hitl-entry">{{TIMESTAMP}} — {{INTERVENTION_SUMMARY}}</div>
        {{/INTERVENTIONS}}
      </div>
    </section>

    <section>
      <h2>Uncovered Dimensions</h2>
      <ul>{{UNCOVERED_DIMENSIONS}}</ul>
    </section>

    <section>
      <h2>Next Review</h2>
      <p>{{NEXT_REVIEW}}</p>
    </section>

    <footer style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 2rem; color: var(--muted); font-size: 0.85rem;">
      Generated by AITS 2.0 · {{GENERATION_TIMESTAMP}}<br>
      Saved to: {{MEMORY_RECORD_PATH}}
    </footer>
  </div>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      html.setAttribute('data-theme', html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    }
  </script>
</body>
</html>
```

## Placeholders to fill

- `{{LANGUAGE}}` — `it`, `en`, etc.
- `{{DECISION_TITLE}}`, `{{DECISION_DATE}}`, `{{DECISION_TYPE}}`, `{{DECISION_STATEMENT}}`
- `{{CONFIDENCE_LEVEL}}` — high/medium/low
- `{{HITL_MODE}}`, `{{PATTERN_MATCH}}`, `{{PLAYBOOK_USED}}`, `{{AGENTS_COUNT}}`
- `{{CONDITIONS_LIST}}` — if conditional decision
- `{{INTEGRATED_SYNTHESIS}}` — narrative from Meta-Orchestrator
- `{{AGENT_CARDS}}` — rendered HTML for each agent card (see template inside)
- `{{HAS_RISK_MAP}}` section — include if Critical ran; `{{RISK_HEATMAP_ROWS}}` is a 5×5 grid rendered as HTML cells
- `{{HAS_ROBUSTNESS_MATRIX}}` section — include if Foresight ran; `{{SCENARIO_HEADERS}}` and `{{ROBUSTNESS_ROWS}}` render the matrix
- `{{HAS_ETHICAL_ASSESSMENT}}` section — include if Ethical ran; `{{ETHICAL_RADAR_SVG}}` is an inline SVG radar chart of the 7 dimensions
- `{{HAS_CONFLICTS}}` section — include if any conflicts were resolved; `{{CONFLICT_ITEMS}}` renders each
- `{{ACTION_ITEMS}}` — rendered action plan
- HITL log fields from `hitl_summary` and `decision_log.human_intervention` entries
- `{{UNCOVERED_DIMENSIONS}}` — bulleted list
- `{{NEXT_REVIEW}}` — date or trigger
- `{{GENERATION_TIMESTAMP}}`, `{{MEMORY_RECORD_PATH}}`

## Generation rules

1. **Self-contained** — no external scripts, no external CSS, no external images. All inline.
2. **Accessible** — every SVG has `aria-label`, every icon has alt text
3. **Print-friendly** — `@media print` rules are already in the template; do not add page-breaks-in-section
4. **Language** — if the user's analysis is in Italian, localize section headers (Agent Findings → "Analisi per Agente", etc.)
5. **Data density** — the dashboard is a single-file reference; err on the side of showing more data rather than less
6. **Fallback for missing sections** — if an agent didn't run, don't render its section at all (use the `{{#HAS_X}}...{{/HAS_X}}` gates)

## Pattern-mode dashboard variant

When called via `/aits-board for pattern [pattern_id]`, generate a different dashboard that aggregates across decisions:

- Header: pattern archetype name, count of matching decisions, retrospective coverage %
- Prediction accuracy grid: agent × (predicted / actual) — was Critical's risk assessment too pessimistic? Was Optimizer's value case calibrated?
- Recurring themes: which failure modes repeat, which success factors recur
- Drift over time: are recent instances of this pattern diverging from older ones?

This view is the LEARN function made visual.
