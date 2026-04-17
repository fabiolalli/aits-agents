# Pattern Library — Recurring Decision Archetypes

AITS 2.0 recognizes that most complex decisions fall into a relatively small number of archetypes. Each archetype has a known signature: typical stakeholders, typical emotional dynamics, typical risks, typical failure modes, lessons from repeated observation.

This library pre-loads that knowledge so agents don't have to rediscover it every time. At the start of an analysis, agents consult this file to see if the current decision matches a known archetype. If it does, analysis starts from the archetype's baseline rather than from zero.

---

## How agents use this library

1. The Meta-Orchestrator, at analysis start, performs pattern matching on the user's problem statement
2. If a pattern matches with confidence ≥ 0.7, the matched pattern is loaded as additional context for all agents
3. Each agent, when producing output, declares in its `pattern_match` envelope field whether it is operating against a known pattern
4. At analysis end, the decision is stored in `.aits/memory/` and over time enriches this library with new patterns

---

## Pattern format

Every pattern has:

- `id` — slug identifier
- `title` — human-readable name
- `problem_signature` — keywords, phrases, and structural features that signal this pattern
- `typical_stakeholders` — who shows up in this archetype
- `emotional_signature` — dominant drivers (from `taxonomies.md`) typically in play
- `risk_signature` — risk categories and drivers typically material
- `known_failure_modes` — how these decisions typically go wrong
- `known_success_factors` — what separates successful instances from failures
- `recommended_playbook` — which AITS playbook fits
- `recommended_sequence_adjustments` — deviations from the playbook's default sequence
- `lessons` — free-form accumulated wisdom

---

## Organizational and people patterns

### restructuring-survivor-syndrome

- **problem_signature**: keywords = ["layoff", "restructuring", "rightsizing", "downsizing"], structural = "organizational change reducing headcount"
- **typical_stakeholders**: departing employees, remaining employees, managers of affected teams, customers, HR, legal
- **emotional_signature**:
  - departing: identity, safety, fairness (high intensity, slow decay)
  - remaining: belonging, safety, legacy ("survivor guilt," "next time it's me," loss of colleagues)
  - managers: competence, autonomy (being the executor of unpopular decisions)
- **risk_signature**:
  - operational → capacity_gap (work doesn't disappear with people)
  - reputational → employer brand damage, customer-facing signal
  - legal_regulatory → employment law, discrimination exposure
- **known_failure_modes**:
  - Underestimating the productivity drop of remaining employees in weeks 4-12
  - Treating the departure as complete on the exit date (reputational tail is 6-18 months)
  - Inequitable selection process that erodes trust across the survivor cohort
  - Communications that treat departing people as non-persons
- **known_success_factors**:
  - Transparent selection criteria visible before selections are made
  - Generous, above-legal-minimum severance where possible
  - Post-departure engagement with survivor cohort (not just announcements)
  - Manager training for the conversation itself
- **recommended_playbook**: `ethical-impact`
- **recommended_sequence_adjustments**: Elevate Emotional-Intuitive to second position (after Analytical), before Critical and Optimizer. Ethical-Governance must run before synthesis regardless of other flags.
- **lessons**: "The decision is not complete when the restructuring is announced. It is complete when trust has been re-established among those who remain, which typically takes 12-24 months."

### ai-adoption-competence-fear

- **problem_signature**: keywords = ["AI rollout", "AI adoption", "automation", "copilot", "augmentation"], structural = "introducing AI capabilities into existing workflows"
- **typical_stakeholders**: affected individual contributors, middle management, IT, leadership, end customers
- **emotional_signature**:
  - ICs: competence (fear of irrelevance), autonomy (loss of craft), identity (professional self-image)
  - managers: status (their expertise becomes less scarce), legacy (what remains of their contribution)
  - leadership: usually enthusiasm, sometimes anxiety about competitive position
- **risk_signature**:
  - operational → coordination_breakdown (adoption gaps), capacity_gap (training time)
  - technical → dependency_lock_in, data governance, output verification debt
  - reputational → customer-facing quality degradation during adoption
- **known_failure_modes**:
  - Treating AI adoption as a tooling decision rather than an identity transition
  - Top-down mandates without bottom-up skill-building investment
  - Underestimating the verification overhead ("it's fast but we check everything twice")
  - Celebrating individual productivity wins while eroding team cohesion
- **known_success_factors**:
  - Framing as "augmentation" and making the framing honest
  - Public, celebrated examples of ICs mastering the new tools (status restoration)
  - Explicit policy on what AI output is final vs draft
  - Protecting some workflows as deliberately non-AI (craft preservation)
- **recommended_playbook**: `product-launch` (treating internal AI rollout as an internal product launch) or `ethical-impact`
- **recommended_sequence_adjustments**: Run Emotional-Intuitive twice: once pre-launch (map resistance), once mid-launch (measure actual vs predicted resistance)

### founder-exit-identity-loss

- **problem_signature**: keywords = ["founder exit", "succession", "sell the company", "acquisition of our company", "step down"], structural = "a founder considering departure from a company they built"
- **typical_stakeholders**: founder, co-founders, early team, current team, investors, acquirers (if any), family
- **emotional_signature**:
  - founder: identity (the company is self), legacy, autonomy, status
  - co-founders: similar, plus trust in the exiting founder's process
  - early team: legacy (what was built), safety (what changes now)
- **risk_signature**:
  - strategic → post-exit drift, cultural dilution
  - operational → knowledge transfer gaps (founder tacit knowledge)
  - financial → deal structure, earn-out misalignment
- **known_failure_modes**:
  - Founder commits to exit rationally but emotionally sabotages the transition
  - Insufficient handover time
  - Misalignment between founder's stated motivation and actual motivation (the surface vs deep driver gap)
- **known_success_factors**:
  - Working through the identity transition before signing
  - Defined post-exit role that honors legacy without blocking successors
  - External advisor who can mirror back the emotional state
- **recommended_playbook**: `ma-due-diligence` augmented with `ethical-impact`
- **recommended_sequence_adjustments**: Emotional-Intuitive must run early and must include the founder as a primary stakeholder, not just an agent of the decision

### middle-management-squeeze

- **problem_signature**: keywords = ["reorg", "flattening", "span of control"], structural = "decision that reduces or reshapes middle management"
- **typical_stakeholders**: middle managers, their reports, senior leadership, HR
- **emotional_signature**:
  - middle managers: status, legacy, fairness (they feel disproportionately targeted)
  - their reports: competence (lost mentorship), safety (lost buffer)
- **risk_signature**:
  - operational → coordination_breakdown (middle managers translate strategy to execution)
  - reputational → employer brand ("they punish the people who do the work")
- **known_failure_modes**:
  - Assuming senior leadership can span the gap
  - Losing the informal knowledge middle managers carried
  - Creating a perception of class warfare within the company
- **recommended_playbook**: `ethical-impact`

---

## Market and product patterns

### product-launch-cold-start

- **problem_signature**: keywords = ["new product launch", "go-to-market", "launch readiness"], structural = "bringing a new product to market"
- **typical_stakeholders**: customers, competitors, internal teams (product, marketing, sales, support, ops)
- **emotional_signature**:
  - customers: curiosity, skepticism, switching cost anxiety
  - internal: excitement, fear of miss, cross-functional friction
- **risk_signature**:
  - strategic → market timing, competitive response
  - operational → launch execution, support capacity
  - reputational → first-impression damage from bugs or undelivered promises
- **known_failure_modes**:
  - Launching before the support org can absorb the volume
  - Over-promising in marketing relative to product reality
  - Competitor response faster than expected
  - Cold-start demand curve flatter than model predicted
- **known_success_factors**:
  - Soft launch / beta before full launch
  - Explicit "what would cause us to delay" list before the launch window
  - Customer success capacity pre-provisioned
- **recommended_playbook**: `product-launch`

### pricing-change

- **problem_signature**: keywords = ["price increase", "price change", "repricing", "monetization"]
- **typical_stakeholders**: existing customers, prospective customers, sales team, finance, competitors
- **emotional_signature**:
  - customers: fairness (did I sign up for this?), autonomy (can I leave?), trust
  - sales: competence (how do I explain this?), status (am I selling something harder now?)
- **risk_signature**:
  - reputational → public backlash, especially in B2C
  - strategic → competitive response, churn spike
  - financial → short-term upside offset by long-term LTV damage
- **known_failure_modes**:
  - Announcing the change without adequate grandfather/transition mechanics
  - Underestimating churn elasticity at the new price point
  - Failing to arm the sales team with the narrative before external announcement
- **known_success_factors**:
  - Long notice period (60-90 days)
  - Value-based framing rather than cost-based framing
  - Offering a downgrade path or loyalty pricing
- **recommended_playbook**: `competitive-response` (often a pricing change is a competitive move) or custom

---

## Strategic patterns

### competitive-displacement-threat

- **problem_signature**: keywords = ["a competitor launched", "disruption", "market share loss to X"]
- **typical_stakeholders**: affected product/service teams, customers, sales, leadership, investors
- **risk_signature**:
  - strategic → obsolescence, positioning erosion
  - operational → response speed vs quality trade-off
- **known_failure_modes**:
  - Reactive copying instead of strategic response
  - Underestimating the competitor's durability (flash in the pan or structural change?)
  - Over-indexing on features the competitor has, under-indexing on the job-to-be-done
- **recommended_playbook**: `competitive-response`

### build-vs-buy-vs-partner

- **problem_signature**: keywords = ["build or buy", "make or acquire", "partner vs build"]
- **typical_stakeholders**: engineering, product, finance, legal, the target acquisition (if any)
- **risk_signature**:
  - strategic → capability lock-in, option value loss
  - operational → integration cost (buy), execution risk (build)
  - financial → capital allocation
- **recommended_playbook**: `go-no-go`
- **lessons**: "Almost no decision framed as pure build-vs-buy actually is — there's usually a partnership path that should be forced onto the table."

### geographic-expansion

- **problem_signature**: keywords = ["enter market X", "expand to country Y", "international launch"]
- **typical_stakeholders**: local customers, local competitors, local regulators, parent org, local team (if any)
- **risk_signature**:
  - legal_regulatory → unfamiliar regulatory environment
  - operational → local hiring, distribution
  - reputational → cultural missteps
- **recommended_playbook**: `go-no-go` with `ethical-impact` augmentation if the target market has material differences in legal/ethical baseline

---

## Technology patterns

### legacy-system-replacement

- **problem_signature**: keywords = ["replace legacy", "migrate off", "modernization", "rewrite"]
- **typical_stakeholders**: engineering, users of the system, operations, finance, dependency owners
- **risk_signature**:
  - technical → migration failure, data loss, dependency revelation
  - operational → parallel-run period disruption
  - financial → cost overrun (classic)
- **known_failure_modes**:
  - Underestimating the tacit business logic embedded in the legacy system
  - Parallel-run becoming permanent
  - "Strangler fig" pattern abandoned halfway
- **recommended_playbook**: `risk-assessment`
- **lessons**: "The cost estimate for a legacy replacement should be doubled, then doubled again."

### ai-infrastructure-vendor-choice

- **problem_signature**: keywords = ["AI platform choice", "LLM provider", "model vendor", "foundation model selection"]
- **typical_stakeholders**: engineering, security, legal, finance, end users of the resulting capability
- **risk_signature**:
  - technical → vendor lock-in, model deprecation, rate limit exposure
  - legal_regulatory → data handling, indemnification, jurisdictional
  - financial → token cost volatility
- **known_failure_modes**:
  - Optimizing on benchmark performance that doesn't match production workload
  - Missing the vendor's actual SLA terms
  - Over-indexing on today's cost, under-indexing on switching cost
- **recommended_playbook**: `go-no-go` with `risk-assessment` augmentation

---

## Contributing new patterns

New patterns are extracted from `.aits/memory/` automatically when the Memory agent detects 3+ past decisions sharing structural features. The proposed pattern is surfaced for human review before being added to this library. Manual contributions are welcome via PR.

A pattern is worth adding when:

- It recurs (not a single case)
- Its signature can be identified automatically from problem statements
- It changes what AITS should do (sequence, emphasis, specific agent activation) — otherwise it's a note, not a pattern
