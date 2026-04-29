# Playbook: Competitive Response

Rapid response to a competitive move — launch, pricing change, acquisition, regulatory filing, or market entry by a competitor. Time-sensitive by nature; runs in autonomous mode with aggressive auto-escalation.

## When this playbook fires

- Problem statement contains: "competitor launched", "disruption", "competitive threat", "market share loss", "competitor move"
- Time horizon is days to weeks
- Reaction is expected and the question is what form it should take

## Sequence

**⚪ Analytical → 🔴 Emotional-Intuitive → 🟢 Creative-Generative → ⚫ Critical-Validator → 🟡 Optimizer → 🔵 Predictive-Strategic → 🔭 Foresight → 🎯 Synthesis**

Why this order: rapid fact-gathering; customer and internal emotional state (do we need to reassure or mobilize?); options including non-obvious responses; stress-test each response; value case; scenarios for how competitor and market react to our response; robustness; synthesis.

This playbook defaults to **autonomous mode** given time pressure, with aggressive auto-escalation on high-severity flags.

## Focus areas per agent

### ⚪ Analytical
- What did the competitor actually do? (Not what we heard, what they demonstrably did.)
- Their capability and commitment — is this a real pivot or a PR move?
- Customer response so far (if observable)
- Our current position on relevant dimensions
- Time pressure: what's the window for response to matter?

### 🔴 Emotional-Intuitive
- Customer emotional response: panic, indifference, curiosity, defection-risk?
- Our sales team: shaken? energized? needing talking points urgently?
- Investor sentiment: calls expected?
- Internal cohorts: leadership direction vs. working-level sentiment
- Media narrative momentum

### 🟢 Creative-Generative
- Direct response options (match them on their move)
- Orthogonal response options (change the dimension of competition)
- Meta-response options (treat their move as an opportunity to reframe the market)
- No-response option (explicitly evaluated, not defaulted to)
- Cross-domain analogies from other industries' competitive responses
- The response options should span at least 3 novelty levels

### ⚫ Critical-Validator
- For each response option, premortem: "We responded with X and it made things worse. Why?"
- Competitive-response-specific failure modes:
  - Reactive copying that validated their framing
  - Over-response that signaled panic
  - Under-response that confirmed their narrative
  - Response that burned bridges (with partners, customers, regulators)
  - Response that triggered escalation cycle
  - Response that was copy-able and gave them a second move
- Fallacy scan: **sunk cost in existing strategy**, **deal fever on acquisition responses**, **anchoring on their framing**

### 🟡 Optimizer
- Value case for each response option
- Opportunity cost of response vs. business-as-usual investment
- Quick wins within the response
- Long-term value preservation/creation per option

### 🔵 Predictive-Strategic
- Scenario: competitor succeeds
- Scenario: competitor stumbles
- Scenario: market follows competitor
- Scenario: regulatory shift triggered by the move
- Scenario: our response triggers further escalation
- Response-option performance across scenarios

### 🔭 Foresight
- Response options × competitor counter-moves matrix
- Which responses are robust across competitor counter-moves?
- Antifragile response options — those that strengthen us regardless of competitor's next move
- Staged responses — first move that preserves optionality for second move

### 🎯 Synthesis
- Recommended response with timing
- Key messages by audience (customers, team, market, investors, press)
- Resource commitment for the response
- Triggers for escalation or de-escalation
- Review cadence (likely tight — weekly or faster)

## Cognitive bias checklist (passed to Critical)

- **Reactance** — are we responding to the frame the competitor set rather than our own strategic logic?
- **Recency effect** — are we weighing this single competitive move out of proportion to our multi-year strategy?
- **Zero-sum framing** — is our response treating this as zero-sum when it might be positive-sum?
- **Us-vs-them** — are we being driven by the social identity dynamic rather than the strategic logic?
- **Planning fallacy** — under time pressure, are we setting response timelines that won't hold?
- **Escalation trap** — are we matching their move in a way that invites the next move?
- **Herding** — are we responding because the market expects a response, not because responding is right?

## Output format specifics

```
COMPETITIVE CONTEXT
  Competitor: [name]
  Their move: [factual summary]
  Time since move: [X days]
  Our response window: [weeks]

RECOMMENDED RESPONSE
  Type: [match | orthogonal | meta | no-response]
  Core action: [specific]
  Timing: [by X date]
  Resource commitment: [people, capital, attention]

KEY MESSAGES
  To customers: [message]
  To team: [message]
  To market/press: [message]
  To investors: [message]

TRIGGERS
  Escalate response if: [signal]
  De-escalate if: [signal]
  Reassess entirely if: [signal]

RESPONSE CASCADE
  Week 1: [actions]
  Week 2-4: [actions]
  30+ days: [actions]

KEY RISKS ACCEPTED
  1. [risk + why acceptable]
  ...

REVIEW CADENCE
  [frequency and triggers]
```

## Pattern library hooks

- `pricing-change` → if competitor's move is a pricing change, the pricing-change pattern applies with "them" as the actor
- `competitive-displacement-threat` → the general pattern for this playbook; always applies

## HITL gates specific to competitive response

- Any response option with severity ≥ 15 risk → blocking gate
- "No response" is the recommended option → advisory gate (confirm with HITL — this is a hard call)
- Time pressure forces skipping an agent → advisory gate (confirm skip)
- Emotional state of customer base shows panic → advisory gate (communication plan first, tactical response second)

## Autonomous mode specifics

Given time pressure, this playbook defaults to autonomous with:

- More aggressive auto-escalation (any agent raising `advisory` flag is treated as `blocking`)
- Shorter checkpoints (one-line summaries not full findings)
- Faster synthesis (7-section output, not the full 12)

The human can always switch to supervised if they want depth over speed.
