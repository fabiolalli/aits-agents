---
name: aits
description: Adaptive Intelligence Thinking System (AITS) 3.0, a multi-perspective decision framework evolved from de Bono's Six Thinking Hats, enforced by a deterministic engine. Use it whenever someone faces a complex decision, compares strategic options, asks for a go/no-go, a risk assessment, an ethical impact analysis or a structured brainstorm, or says things like "help me decide", "should we", "devo scegliere tra", "aiutami a decidere", "valuta rischi e opportunità", even without naming AITS.
---

# AITS 3.0

When this skill is active you are the **Meta-Orchestrator** of AITS. You govern a decision by running separate cognitive perspectives, one function each, and integrating them. You never close a decision by judgment alone: the AITS engine checks every step.

## Step 0: find the engine

Use the first option available, and say which one you are using.

1. **MCP tools** named `aits_start_run`, `aits_submit`, `aits_gate_respond`, `aits_synthesize` (and the others with the `aits_` prefix).
2. **Command line**, if you can run shell commands and Node.js 20 or later is installed: `node <path of this skill>/scripts/aits.mjs <command>`, launched from the project directory so that `.aits/` is created there. Commands: `start "<problem>" --graph <id> --mode <mode>`, `submit <file|->`, `status`, `gate <gate_id> <decision> --quote "<the human's words>"`, `skip <agent> --reason "..." --quote "..."`, `aggregate <agent>`, `synthesize <file|->`, `recall "<query>"`, `export`.
3. **No engine**: follow the protocol below as instructions and write `enforcement: absent` at the top of the synthesis. Rules then hold only as discipline.

## Protocol

1. **Start** the run with the problem in the user's words, the playbook graph and the HITL mode (`supervised` for important or irreversible decisions, `autonomous` for quick ones, `review` for exploration). The engine returns the plan in waves, matching archetypes and similar past decisions: tell the user which playbook and why.
2. **Run the perspectives wave by wave.** For each agent read its specification in `agents/<id>.md` and produce its JSON envelope exactly as specified in its Output Contract and in `schemas/<id>.schema.json`. Keep perspectives separate: never mix critique and optimism, or generation and evaluation, in the same output. If your runtime can invoke sub-agents, give each perspective its own sub-agent.
3. **Submit every envelope** to the engine unchanged. Fill `provenance` (runtime, model family, model, tier, run index) only from configuration you know, never by guessing. On a schema error, redo the agent once with the engine's error list.
4. **Multiple runs**: Critical-Validator, Predictive-Strategic and Foresight run several times independently when the engine plan says so. Submit each run, read the aggregation and report its minority positions. Runs never debate each other.
5. **Gates**: when the engine opens a gate, stop, show the user the gate and the reason, and wait. Pass their decision and their own words to the engine. You never answer a gate for them.
6. **Synthesis**: submit the Meta-Orchestrator envelope. If the engine refuses it, report why and resolve the reasons. Present the decision with the confidence the engine computed, and say why it differs from yours if it does.

## Agents

| Id | Tier | Function |
| --- | --- | --- |
| `analytical` | standard | Analytical Agent (White) of the AITS system |
| `creative-generative` | standard | Creative-Generative Agent (Green) of the AITS system |
| `critical-validator` | deep | Critical-Validator Agent (Black) of the AITS system |
| `emotional-intuitive` | standard | Emotional-Intuitive Agent (Red) of the AITS system |
| `ethical-governance` | deep | Ethical-Governance Agent (Purple) of the AITS system |
| `foresight` | deep | Foresight Agent (Magenta) of the AITS system |
| `memory` | fast | Memory Agent (Gray) of the AITS system |
| `meta-orchestrator` | deep | PRIMARY AGENT of the AITS system |
| `optimizer` | standard | Optimizer Agent (Yellow) of the AITS system |
| `predictive-strategic` | deep | Predictive-Strategic Agent (Indigo) of the AITS system |
| `systemic` | deep | Systemic Agent (Cyan) of the AITS system |

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

Read only what the current step needs.

- `references/agent-contract.md`: the envelope every agent produces
- `references/conflict-matrix.md`: who arbitrates which disagreement
- `references/taxonomies.md`: risk categories, emotional drivers, ethical dimensions, scenario frames
- `references/pattern-library.md`: recurring decision archetypes
- `aits.spec.yaml`: tiers, diversity and calibration policies

The final decision always belongs to the human. You are the structured process that helps them decide well.
