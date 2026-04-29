# Playbook: Innovation Sprint

Rapid ideation plus rigorous validation. When the output needed is a new option set, tested for robustness, with quick tests to validate assumptions.

## When this playbook fires

- Problem statement contains: "innovate", "new ideas", "brainstorm", "break the binary", "what else"
- Current options are inadequate and the team is stuck
- Time-boxed sprint for generating and filtering ideas

## Sequence

**🟢 Creative-Generative → 🔴 Emotional-Intuitive → 🟢 Creative-Generative (v2, refined) → 🔭 Foresight → 🟡 Optimizer → 🎯 Synthesis**

Why this order: Generate first without filtering. Map emotional reception of generated options. Re-generate with the emotional lens informing (not killing) the options. Foresight evaluates robustness. Optimizer builds value cases for the surviving options. Synthesis.

**Critical is deliberately absent from the default sequence** to protect the generative phase. If the synthesis reveals options that need stress-testing, the output explicitly recommends a follow-up `/aits-full` with Critical.

## Focus areas per agent

### 🟢 Creative-Generative (Pass 1)
- No filtering — 6-10 options across novelty levels (incremental, adjacent, novel, radical)
- Cross-domain analogies: "what would [other industry] do?"
- Micro-test proposal for each option
- Dissolve binaries aggressively
- Combinable-option identification

### 🔴 Emotional-Intuitive
- For each option, sketch the adoption profile: who embraces, who resists
- Key resistance points that might kill the option
- Trust drivers that could enable the option
- **Crucial discipline**: Emotional here informs Creative v2, it does not kill options. "Stakeholder X would resist" is input, not veto.

### 🟢 Creative-Generative (Pass 2, refined)
- Reframe options that Pass 1 generated but Emotional flagged as hard to adopt
- Generate new options that address Emotional's signals
- Combinations that weren't visible in Pass 1
- Drop options that are both low-novelty AND high-resistance (they are incremental pain)

### 🔭 Foresight
- Options-scenarios matrix (if ≥ 4 viable)
- Robustness ranking
- Antifragility detection — which options benefit from volatility?
- Staged commitment paths — which options allow low-commit testing before full investment?
- Dominance analysis — eliminate dominated options

### 🟡 Optimizer
- Value case for each surviving option
- Opportunity cost comparison
- Quick wins vs structural bets
- Sequencing if multiple options are selected for parallel exploration

### 🎯 Synthesis
- **Option space summary** — the survived options with novelty, robustness, value profile
- Top 2-3 recommended options with reasoning
- Suggested micro-tests to run NOW (before deeper analysis)
- Recommendation for follow-up `/aits-full` on chosen option(s)
- Review schedule

## Cognitive bias checklist (passed to Foresight and Optimizer)

- **Novelty theater** — are "radical" options actually radical or just incremental dressed up?
- **Availability heuristic** — are recent news stories (other companies' moves) distorting the option set?
- **Anchor bias** — is Pass 2 only varying from Pass 1 around the original frame?
- **Dominated-option attachment** — are we keeping options because they have internal champions, not because they're viable?
- **Premature optimization** — are we killing options because they'd be hard to execute before we've validated they'd be valuable?

## Output format specifics

```
OPTION INVENTORY

| ID | Title | Novelty | Robustness | Adoption | Value | Status |
|----|-------|---------|------------|----------|-------|--------|

TOP RECOMMENDATIONS (2-3)
  [specific, with reasoning]

IMMEDIATE MICRO-TESTS
  Test 1: [cheap, fast, validates which assumption]
  Test 2: ...

DOMINATED OPTIONS (to drop)
  [list with reasoning]

RESERVED OPTIONS (not pursued now but worth revisiting)
  [list with conditions for revisiting]

SUGGESTED NEXT: /aits-full on option [X] for go/no-go decision
```

## Pattern library hooks

Most patterns in the library have a `recommended_sequence_adjustments` field. If the problem matches any archetype, apply those adjustments to this playbook's sequence.

## HITL gates specific to innovation sprint

Rare — this playbook is deliberately low-gate to preserve creative flow. Gates only trigger on:

- Ethical red line detected in a generated option → blocking gate
- No viable options after Pass 2 → blocking gate (reframe needed)
- All generated options are incremental (Creative failed to produce novelty) → advisory gate

## Time-boxing

This playbook is designed for a single sitting. If the sprint extends beyond ~2 hours of work, the user is probably in analysis-paralysis territory. The synthesis should then explicitly recommend choosing an option for deeper `/aits-full` analysis rather than generating more.
