# AITS Diverge — Creative Brainstorming

Run a divergent exploration with the AITS system — to generate options, break patterns, and find the space of possibilities before converging.

## What It Does

Activates a sequence oriented toward creative generation:

1. **Creative-Generative (Green)** -> Options, cross-industry analogies, radical ideas
2. **Emotional-Intuitive (Red)** -> Which option generates enthusiasm? Which resistance?
3. **Foresight (Foresight)** -> Do the generated options hold up across different scenarios?
4. **Meta-Orchestrator (Blue)** -> Synthesis of the most promising options with next steps

If the Green generates > 4 options, the Foresight is activated automatically (AITS rule).

## How to Use It

Describe the exploratory space:
- What are we looking for? (new product, business model, differentiation strategy...)
- What constraints are there? (budget, technology, market...)
- What have we already tried or discarded?
- How radical can we be?

## When to Use It

- Brainstorming on new products or services
- Searching for competitive differentiation
- Decision deadlock (known options don't work)
- Innovation sprints and design thinking
- When you need to "think outside the box" with structure

## Expected Output

An option-rich JSON with:
- 5-7+ alternatives (including at least 1-2 radical ones)
- Analogies from other industries
- Micro-tests to validate the most promising ideas
- Emotional map: which options generate positive energy
- Robustness matrix (if Foresight activated)
- The 2-3 recommended options for deeper exploration

## Instructions

Use the sub-agent `aits-meta-orchestrator` in diverge mode. First invoke `aits-creative-generative` to generate a broad space of options. Then `aits-emotional-intuitive` to map the perceptual dimension of the options. If options are > 4, activate `aits-foresight` for the comparative matrix across scenarios. Finally, produce a synthesis that collects the most promising options with their respective validation micro-tests. The objective is NOT to decide, but to expand the space of possibilities in a structured way.

