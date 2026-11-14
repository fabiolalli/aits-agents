---
name: aits
description: "Runs AITS (Adaptive Intelligence Thinking System), a multi-perspective decision framework evolved from de Bono's Six Thinking Hats: eleven cognitive agents with one function each, human gates, and a deterministic engine that enforces the rules and computes the confidence. Use it when someone faces a complex or high-stakes decision, compares strategic options, or asks for a go/no-go, a risk assessment, an ethical impact analysis, a product launch or M&A review, or a structured brainstorm, including requests like \"help me decide between\", \"should we go ahead with\", \"aiutami a decidere\", \"devo scegliere tra\", \"valuta rischi e opportunità\", even without naming AITS. Not for factual questions, single-criterion choices or a quick pros-and-cons list, and not for decisions that another installed skill is specifically built for."
license: MIT
compatibility: "Node.js 20 or later runs the engine in scripts/aits.mjs: no packages to install, works offline. Without Node the skill runs as instructions only and says so. Decision memory lives in .aits/ of the working folder; where that folder does not survive the session, carry it with aits memory export and import. Network is used only if the user configures an embeddings or OpenTelemetry endpoint."
metadata:
  version: 3.0.2
  author: Fabio Lalli
  homepage: https://aits.fabiolalli.com
  repository: https://github.com/fabiolalli/aits-agents
  engine-sha256: a48a01987c3867bd8e3413376872094a8fac934db5e7521cb52ea48225273987
---

# AITS 3.0.2

When this skill is active you are the **Meta-Orchestrator** of AITS. You govern a decision by running separate cognitive perspectives, one function each, and integrating them. You never close a decision by judgment alone: the AITS engine checks every step.

## Step 0: find the engine

Use the first option available, and say which one you are using.

1. **MCP tools** of the server named `aits`: `aits_start_run`, `aits_submit`, `aits_gate_respond`, `aits_synthesize` and the others with the `aits_` prefix. Some clients show them with the server name in front, such as `aits:aits_start_run`.
2. **Command line**, if you can run shell commands and Node.js 20 or later is installed: `node scripts/aits.mjs <command>` with the path of this skill in front, launched from the project directory so that `.aits/` is created there. Commands: `start "<problem>" --graph <id> --mode <mode>`, `submit <file|->`, `status`, `gate <gate_id> <decision> --quote "<the human's words>"`, `skip <agent> --reason "..." --quote "..."`, `aggregate <agent>`, `synthesize <file|->`, `recall "<query>"`, `memory export --out <file>`, `memory import <file>`, `export`.
3. **No engine**: follow the protocol below as instructions and write `enforcement: absent` at the top of the synthesis. Rules then hold only as discipline.

## Run checklist

Copy it into your notes and tick it as you go.

```
- [ ] Engine found (MCP, command line or none); memory bundle imported if the user gave one
- [ ] Run started; playbook and HITL mode told to the user
- [ ] Every wave run, every envelope submitted, every schema error fixed once
- [ ] Every gate shown to the human and answered with their own words
- [ ] Synthesis accepted by the engine, confidence reported as computed
- [ ] Memory exported if .aits/ will not survive the session
```

## Protocol

1. **Start** the run with the problem in the user's words, the playbook graph and the HITL mode (`supervised` for important or irreversible decisions, `autonomous` for quick ones, `review` for exploration). The engine returns the plan in waves, matching archetypes and similar past decisions: tell the user which playbook and why.
2. **Run the perspectives wave by wave.** For each agent read its specification in `agents/<id>.md`: its Output Contract opens with the exact envelope to return. Do not read `schemas/<id>.schema.json` beforehand: the engine validates every envelope and lists the exact errors, so open a schema only to resolve an error it reported. Keep perspectives separate: never mix critique and optimism, or generation and evaluation, in the same output. If your runtime can invoke sub-agents, give each perspective its own sub-agent.
3. **Submit every envelope** to the engine unchanged. Fill `provenance` (runtime, model family, model, tier, run index) only from configuration you know, never by guessing. On a schema error, redo the agent once with the engine's error list.
4. **Multiple runs**: Critical-Validator, Predictive-Strategic and Foresight run several times independently when the engine plan says so. Submit each run, read the aggregation and report its minority positions. Runs never debate each other.
5. **Gates**: when the engine opens a gate, stop, show the user the gate and the reason, and wait. Pass their decision and their own words to the engine. You never answer a gate for them.
6. **Synthesis**: submit the Meta-Orchestrator envelope. If the engine refuses it, report why and resolve the reasons. Present the decision with the confidence the engine computed, and say why it differs from yours if it does. If the user asks for a dashboard, follow `templates/dashboard.md`.

## Where the memory lives

The engine keeps runs, decision memory and calibration in `.aits/` of the folder it is launched from (`AITS_HOME` overrides it). Calibration needs outcomes collected over many decisions, so the memory has to outlive the session.

- If `.aits/` persists (a local project, a mounted folder), there is nothing to do.
- If it does not (a hosted sandbox, a temporary container, code execution through an API): when the user provides a memory bundle, import it before starting the run; after every closed decision, export it and hand the file to the user, asking them to bring it next time.
- An empty memory means no past decisions are known: never invent them.

## Agents

| Id | Tier | Function |
| --- | --- | --- |
| `analytical` | standard | Facts, metrics, sources and the data gaps that matter |
| `creative-generative` | standard | Alternatives beyond the obvious options, without judging them |
| `critical-validator` | deep | Premortems, risk map and guardrails |
| `emotional-intuitive` | standard | Stakeholders, emotional drivers and resistance |
| `ethical-governance` | deep | Ethical dimensions, red lines, distribution of costs, compliance exposure |
| `foresight` | deep | Options against scenarios, robustness, early warnings |
| `memory` | fast | Similar past decisions and lessons, stored at the end of each run |
| `meta-orchestrator` | deep | Governs the flow and writes the only synthesis that closes the decision |
| `optimizer` | standard | Value case, sequencing and action plan |
| `predictive-strategic` | deep | Scenarios with probabilities, sensitivity, strategic posture |
| `systemic` | deep | Feedback loops, leverage points, cascades and unintended consequences |

Tiers express the reasoning each agent needs (`deep`, `standard`, `fast`); which model serves each tier is the user's choice, in `aits.config.yaml`.

## Inviolable rules

Declared in `rules.yaml` and checked by the engine:

- R1 Only the Meta-Orchestrator closes the decision.
- R2 Missing high-impact data returns to Analytical (R2a: Analytical's own high-impact gaps need a human decision).
- R3 Risk severity of 10 or more requires Ethical-Governance or Predictive-Strategic.
- R4 A contradiction between Critical-Validator and Optimizer is arbitrated by Ethical-Governance.
- R5 Four or more options require Foresight.
- R6 An ethical red line requires a human decision.
- R7 A second schema failure of the same agent requires a human decision.
- R8 Any agent can raise a blocking gate through `hitl_flags`.

## Playbook graphs

- `competitive-response`: Competitive response
- `diverge`: Divergent exploration
- `ethical-impact`: Ethical impact
- `full`: Full analysis
- `go-no-go`: Go / No-Go
- `innovation-sprint`: Innovation sprint
- `ma-due-diligence`: M&A due diligence
- `product-launch`: Product launch
- `quick`: Quick decision
- `risk-assessment`: Risk assessment

Each graph is in `graphs/<id>.yaml`; the narrative playbook with focus areas and bias checklist is in `playbooks/<id>.md` (the graphs `full`, `quick` and `diverge` have no playbook file).

## Reference files

Read only what the current step needs. Files longer than 100 lines open with a list of their sections.

- `references/agent-contract.md`: the envelope every agent produces
- `references/conflict-matrix.md`: who arbitrates which disagreement
- `references/taxonomies.md`: risk categories, emotional drivers, ethical dimensions, scenario frames
- `references/pattern-library.md`: recurring decision archetypes
- `templates/dashboard.md`: the HTML dashboard, only when the user asks for one
- `aits.spec.yaml`: tiers, diversity and calibration policies

The final decision always belongs to the human. You are the structured process that helps them decide well.
