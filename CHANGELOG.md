# Changelog

All notable changes to the AITS repository are documented here.

---

## [2.0] — 2026-04-17

Major architectural evolution from the 1.x series. Every agent file has been refactored, four new foundational files have been added, and the system has gained JSON schemas, a pattern library, a conflict matrix, and shared taxonomies.

### Added — new foundational files

- **`references/agent-contract.md`** — The shared 10-section structural template every agent now follows. Eliminates agent isolation and makes handoffs formal.
- **`references/conflict-matrix.md`** — Codified pairwise resolution rules for every meaningful agent conflict, with L1-L4 severity scale (Divergence / Tension / Contradiction / Red line). Replaces ad-hoc conflict handling.
- **`references/taxonomies.md`** — Shared vocabulary for risks (6 categories), emotional drivers (8 deep drivers), ethical dimensions (7), scenario frames (10), option novelty and robustness levels, and confidence levels. Agents now use a normative vocabulary rather than inventing their own.
- **`references/pattern-library.md`** — 10+ pre-loaded decision archetypes with typical stakeholders, emotional signatures, risk signatures, known failure modes, known success factors, and recommended playbooks. Includes: `restructuring-survivor-syndrome`, `ai-adoption-competence-fear`, `founder-exit-identity-loss`, `middle-management-squeeze`, `product-launch-cold-start`, `pricing-change`, `competitive-displacement-threat`, `build-vs-buy-vs-partner`, `geographic-expansion`, `legacy-system-replacement`, `ai-infrastructure-vendor-choice`.

### Added — JSON schemas

Every agent output now validates against a published JSON Schema. The Meta-Orchestrator validates before integrating; failures auto-retry once, then trigger a mandatory HITL gate.

- `schemas/_envelope.schema.json` — common envelope for all agents
- `schemas/meta-orchestrator.schema.json`
- `schemas/analytical.schema.json`
- `schemas/emotional-intuitive.schema.json`
- `schemas/critical-validator.schema.json`
- `schemas/optimizer.schema.json`
- `schemas/creative-generative.schema.json`
- `schemas/ethical-governance.schema.json`
- `schemas/predictive-strategic.schema.json`
- `schemas/systemic.schema.json`
- `schemas/foresight.schema.json`
- `schemas/memory-record.schema.json`

### Added — new agent

- **`aits-memory.md`** — Memory agent with SAVE, RECALL, and LEARN procedures. Archives every decision to `.aits/memory/`, recalls similar past decisions at the start of new analyses, and extracts recurring patterns after ≥3 similar decisions. This is the compounding-asset mechanism that transforms AITS from a framework into a learning system.

### Changed — Meta-Orchestrator (Blue)

- **Pattern matching at intake** — consults `references/pattern-library.md` and loads matching archetypes as context for all agents
- **Schema validation** — every incoming agent output is validated; failures auto-retry, then gate
- **Conflict matrix lookup** — consults `references/conflict-matrix.md` when conflicts detected, rather than improvising
- **Canonical invocation template** — every agent sub-task is invoked with the same structured context (problem, playbook, pattern match, prior outputs, specific questions, HITL mode)
- **Seven inviolable rules** (was six) — added rule #7: schema validation failure triggers mandatory gate
- **Mandatory gates raisable by any agent** — in 1.x only the Meta-Orchestrator raised gates; in 2.0 any agent can
- **Confidence propagation** — final synthesis confidence bounded by weakest critical input
- **Memory read at start, write at close**

### Changed — Analytical (White)

- **Source confidence scoring** — every source tagged high/medium/low confidence based on reliability, recency, independence
- **Structured gap tracking** — gaps carry impact, how-to-fill, cost-to-fill, which agents they block
- **Explicit hypothesis labeling** — every unsourced claim labeled `[HYPOTHESIS]`
- **Assumptions as first-class** — separate from hypotheses, with testable flag and risk_if_wrong
- **Source inventory** — independence and recency metadata

### Changed — Emotional-Intuitive (Red)

- **Two-level taxonomy** — surface emotion + deep driver (identity, status, autonomy, competence, belonging, safety, fairness, legacy)
- **Emotional timeline** — intensity_current, peak_expected, decay_curve per stakeholder group
- **Asymmetry detection** — explicit surfacing of groups who gain vs lose, with power differential
- **Perceptual risks** — how decisions can be misperceived (separate from actual risks)
- **Intervention windows** — when is the window to address each resistance point wide/narrow/closed
- **Evidence basis labeling** — observation, interview, survey, pattern-library, inference

### Changed — Critical-Validator (Black)

- **6-category risk map** — strategic, operational, financial, reputational, legal_regulatory, technical
- **Two-level risk taxonomy** — category + driver
- **Severity scoring 1-25** — probability (1-5) × impact (1-5), with level mapping (low/medium/high/critical)
- **10-item bias checklist** — actively scanned for, not passively noted
- **Guardrail formalization** — every material risk has guardrail with type, trigger, action, owner
- **Residual severity after mitigation** — tracked explicitly
- **Fallacy attribution** — which agent's output contains the detected fallacy

### Changed — Optimizer (Yellow)

- **Value sequencing** — quick wins (< 30 days), short-term (1-6 months), structural (> 6 months)
- **Opportunity cost mandatory** — alternatives considered, including do-nothing
- **Distributional analysis** — beneficiaries and cost-bearers (Ethical handoff material)
- **Risk-adjusted net value** — gross benefit minus implementation cost minus risk adjustment
- **Confidence intervals** on value drivers
- **Levers with sensitivity** — effort-to-value ratio

### Changed — Creative-Generative (Green)

- **Novelty scoring** — incremental / adjacent / novel / radical on every option
- **Cross-domain analogies** with explicit structural mapping
- **Micro-tests per option** — cost, duration, validates assumption, success criteria
- **Problem reframing** — alternative framings surfaced explicitly
- **Dissolved binaries** — when options break false binaries, they're labeled as such
- **Options triggers Foresight** — ≥ 4 viable options activates inviolable rule #5

### Changed — Ethical-Governance (Purple)

- **Seven-dimension framework** — fairness, autonomy, transparency, accountability, non-maleficence, beneficence, dignity (was previously underspecified)
- **Red-line detection** with explicit inviolability citations — triggers inviolable rule #6
- **Arbitration output format** — specific structure when arbitrating Black/Yellow conflicts per rule #4
- **Distributional analysis** — formal assessment of benefits concentration, cost distribution, consent, voice
- **Compliance exposure mapping** — specific regime (GDPR, AI Act, etc.), exposure, enforcement likelihood
- **Normative drift forecast** — will this decision age well?

### Changed — Predictive-Strategic (Indigo)

- **3-5 scenario frames** per analysis (from a defined taxonomy: baseline, optimistic, pessimistic, shock, regulatory_shift, competitive_move, technological_leap, market_contraction, market_expansion, black_swan)
- **Probability with confidence interval** — not false precision
- **Sensitivity analysis** — explicit elasticity per critical variable
- **Robustness ranking separate from EV** — fragile / sensitive / robust / antifragile
- **Early warning signals** per scenario — observable, sourced, with lead time
- **Uncertainty disclosure** — known unknowns named, out-of-frame scenarios acknowledged

### Changed — Systemic (Cyan)

- **Explicit system boundaries** — inside / outside-but-interacting / deliberately-excluded
- **Stocks, flows, loops vocabulary** — consistent use of systems dynamics terms
- **Meadows' leverage point hierarchy** — interventions ranked from parameters (weak) to paradigms (transformative)
- **Eight systemic archetypes** — limits to growth, fixes that fail, tragedy of commons, shifting the burden, success to successful, escalation, drifting goals, growth and underinvestment
- **Cascade paths** with reversibility labels
- **Linear thinking failures** — explicit callouts where linear analysis misleads

### Changed — Foresight (Magenta)

- **Full options × scenarios matrix** — every cell filled or explicitly deferred
- **Robustness ranking** distinct from expected value
- **Dominance analysis** — options dominated in every scenario are flagged for elimination
- **Option combinations** — sequential, parallel, conditional — mapped where relevant
- **Staged commitment paths** — when options allow phased commitment with abandonment triggers
- **Early warning panel** linking signals to option shifts
- **Antifragility detection** — options that benefit from volatility

### Changed — Commands

- **`/aits-full`** — now loads pattern library, announces pattern match at intake, enforces schema validation, references conflict matrix in conflict resolution
- **`/aits-quick`** — auto-upgrade conditions explicit (multiple gates triggered, high-stakes pattern match)
- **`/aits-diverge`** — now uses creative-first sequence with Creative running twice (pass 1 unconstrained, pass 2 informed by Emotional), with Critical deliberately excluded from default sequence
- **`/aits-board`** — expanded to three modes (in-flight, HTML dashboard, pattern dashboard)

### Changed — Dashboard

- Dashboard template expanded with: SVG radar chart for 7-dimension ethical assessment, robustness matrix table for Foresight, confidence meter, conflict timeline with matrix citations, HITL log with intervention entries
- Pattern-mode dashboard added — aggregates across decisions matching an archetype, shows prediction accuracy per agent

### Changed — Playbooks

All 7 playbooks updated to:

- Reference the new pattern library and taxonomies
- Include an explicit cognitive bias checklist passed to Critical
- Specify HITL gates specific to the playbook type
- Reference the agent contract and handoff protocols
- Include playbook-specific output format requirements

Specific changes:

- **`go-no-go`** — added reversibility assessment, 6-item bias checklist, structured output format
- **`product-launch`** — added Launch Readiness Scorecard, customer-cohort emotional mapping, support capacity gate
- **`ma-due-diligence`** — expanded to include Systemic in default sequence, added Emotional-in-parallel-with-Systemic, added integration plan skeleton, retention plan, 100-day plan
- **`risk-assessment`** — formalized Risk Register output, added correlated-risk clusters, specialization parameters for cybersec/financial/operational/regulatory
- **`innovation-sprint`** — Creative runs twice, Critical deliberately excluded, dominated options explicit
- **`ethical-impact`** — Purple now leads, Optimizer deliberately later, prime directive against rationalizing defensible decisions
- **`competitive-response`** — defaults to autonomous mode with aggressive auto-escalation, time-pressure adapted output

### Changed — Manifesto

- **`AITS.md`** expanded from 6 design principles to 9 (added: handoff protocols, memory and learning, traceability as first-class)
- New section: "What's new in 2.0"
- Updated agent table with the 11th agent (Memory)

### Deprecated

- The "one and only one" description of De Bono in the original manifesto has been nuanced — AITS diverges from De Bono in ways the original didn't emphasize

### Removed

- Nothing removed from the agent set. All 1.x agents remain; Memory is additive.
- Some implicit 1.x behaviors are now explicit (e.g., handoffs were implicit in 1.x; they are formal in 2.0)

### Breaking changes

- **Agent output format changed** — every output now carries the common envelope. Custom consumers of 1.x outputs will need to adapt to the new envelope + main_output structure.
- **Memory directory required** — AITS 2.0 expects `.aits/memory/` to exist or be creatable in the working directory
- **Playbook frontmatter** — playbooks in 2.0 reference taxonomies and patterns by ID; custom 1.x playbooks using different ID conventions will need migration
- **Schema compliance is enforced** — outputs that don't match the schema trigger retries and gates; this did not happen in 1.x

### Migration from 1.x

For users upgrading from 1.x:

1. Back up your current `.aits/memory/` if you had one — 1.x memory records are not directly compatible with 2.0 schema
2. Copy the new files from this repo (agents, playbooks, references, schemas, commands, dashboard)
3. Run your first 2.0 analysis with `/aits-full` on a low-stakes decision to verify the setup
4. If you had custom playbooks in 1.x, update them to reference the new taxonomies and include the cognitive bias checklist

There is no automatic migration script. The structural changes are large enough that a clean install is recommended.

---

## [1.1] — prior release

De Bono's Six Thinking Hats evolved to 10 agents. Three HITL modes introduced. Seven playbooks added. Dashboard introduced. Memory concept prototyped but not fully implemented.

## [1.0] — initial release

10 agents, four commands, basic playbooks. First public version on GitHub.
