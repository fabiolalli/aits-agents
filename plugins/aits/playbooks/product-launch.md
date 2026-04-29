# Playbook: Product Launch

Assessing launch readiness for a new product, feature, or service.

## When this playbook fires

- Problem statement contains: "launch", "go to market", "release", "ship"
- Decision is about timing and readiness, not build-vs-buy
- Customer-facing or market-facing output

## Sequence

**⚪ Analytical → 🔴 Emotional-Intuitive → 🟢 Creative-Generative → ⚫ Critical-Validator → 🟡 Optimizer → 🔵 Predictive-Strategic → 🎯 Synthesis**

Why this order: facts first; customer perception and internal-team readiness second (launch is a people decision as much as a product decision); creative options for launch mechanics; stress-test the plan; optimize the value capture; project market response.

## Focus areas per agent

### ⚪ Analytical
- Market size, TAM/SAM/SOM with sources
- Competitive landscape: who's in, what they do, their recent moves
- Our readiness: product state, support capacity, sales enablement, marketing readiness
- Customer validation data: betas, interviews, waitlist signal strength
- Unit economics at scale

### 🔴 Emotional-Intuitive
- **Customer cohorts**: early adopters, mainstream, skeptics — map each
- **Internal teams**: sales, support, engineering on-call, marketing — readiness *and* emotional state (are they excited or exhausted?)
- **Competitor emotional response**: who feels threatened and will react hard?
- Stakeholder maps with deep drivers
- Trust drivers to activate for adoption
- Resistance points (especially in customers who'd have to switch)
- Emotional timeline: announcement → beta → GA → 90 days post

### 🟢 Creative-Generative
- Launch mechanics options: stealth → beta → soft launch → hard launch — or unconventional
- Pricing options (if pricing is part of the decision)
- Positioning options
- Dissolve the binary "launch now vs wait" if present
- Cross-domain analogies from adjacent category launches

### ⚫ Critical-Validator
- Pre-mortem: "In 90 days the launch has clearly failed. What went wrong?"
- Launch-specific failure modes:
  - Support capacity overwhelmed
  - Marketing oversells product reality
  - Competitor responds faster than expected
  - Cold-start demand curve flatter than model predicts
  - Bug leak at T-0
  - Key customer signs with competitor in launch week
- Reversibility of the launch commitments
- Bias scan: especially confirmation bias on internal enthusiasm, planning fallacy on timeline

### 🟡 Optimizer
- Value sequencing: what wins in first 7 days, 30 days, 90 days
- Quick wins that signal momentum without overcommitting
- Pricing optimization within the constraint set
- Levers to amplify adoption
- Opportunity cost of launching now vs. holding

### 🔵 Predictive-Strategic
- Scenarios: baseline adoption curve, upside, pessimistic, competitive counter-launch
- Sensitivity on: price elasticity, competitor response speed, support quality, CAC
- Robustness of the launch plan across scenarios
- Early warning signals: what's the 7-day indicator that tells us we're in the pessimistic scenario?

### 🎯 Synthesis
- Launch decision: GO / DELAY / REDESIGN / STAGED
- If STAGED: the stages, their gates, their go/no-go criteria
- Specific launch window
- Top 5 risks accepted and their mitigations
- Pre-launch checklist tied to launch date

## Cognitive bias checklist (passed to Critical)

- **Planning fallacy** — are timelines and resource estimates based on best case?
- **Optimism bias** — are we projecting adoption curves that no analogous launch has ever achieved?
- **In-group conformity** — is internal enthusiasm masking external skepticism?
- **Availability heuristic** — are recent successful launches in other categories disproportionately influencing our assumptions?
- **Sunk cost** — "we have to launch because we've built it" is not a reason to launch now
- **Anchoring** — is the launch date chosen by prior commitment rather than readiness?

## Pattern library hooks

- `product-launch-cold-start` → extra weight on Emotional's customer cohorts
- `pricing-change` → if the launch includes a pricing change, augment with the pricing-change pattern's known failure modes
- `competitive-displacement-threat` → if this launch is a competitive response, consider competitive-response playbook instead

## Output format specifics

Include a **Launch Readiness Scorecard** in the synthesis:

```
DIMENSION              | SCORE (1-5) | OWNER
Product quality        |             |
Support capacity       |             |
Sales enablement       |             |
Marketing readiness    |             |
Documentation          |             |
Pricing validation     |             |
Legal/compliance       |             |
Rollback plan          |             |

MINIMUM SCORE TO LAUNCH: 4 in each
CURRENT STATE: [list dimensions below threshold]
```

## HITL gates specific to this playbook

Additional triggers for mandatory gates in product launches:

- Any customer cohort with `intensity_current ≥ 8` and negative surface emotion → gate
- Support capacity below projected peak demand × 1.3 → gate
- Any launch readiness dimension scoring below 3 → gate
- Legal/compliance with unresolved material issue → gate
