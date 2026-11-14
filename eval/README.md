# AITS eval harness

Measures a release against decisions whose outcome is already known.

Each case lives in `cases/<id>/`:

- `case.yaml`: the problem as it was framed, the playbook graph, and the truth (risks that materialised, scenario that occurred, gates that should have fired, whether the decision was right). Start from `template/case.yaml`.
- `runs/<label>/*.json`: the agent envelopes recorded for that case, one file per output, the synthesis last. Use one label per version (for example `v2` and `v3`), produced with the same models, so that differences come from the method and not from the model.

Run:

```
node ../skills/aits/scripts/aits.mjs eval .
```

For each case and label the harness replays the envelopes through the engine and reports invalid outputs, gates fired, gate recall, risk recall, Brier score of the predictions, whether the synthesis was accepted, the engine confidence and the elapsed time between the first and the last output. Gates are answered `proceed` during the replay so that it can reach the synthesis.

`cases/demo-pricing-change` is synthetic: it only shows the format. Real cases should be anonymised before publication.

## Activation set

`triggers.json` lists requests that must load the skill and requests that must not, in English and Italian. The description in `SKILL.md` decides when a runtime loads AITS, so change it only after measuring this set: send each query in a fresh session where AITS is installed next to other skills, and record whether it was loaded. Report the share of correct activations separately for queries that should and should not trigger, for every runtime and model family you support. A description that fires on everything costs as much as one that never fires.

## Matrix

The method is neutral with respect to models, and the tests have to show it. Run the same cases and the activation set for each tier (`deep`, `standard`, `fast`) on at least two model families and on each runtime you ship to, and keep the results in `results/<date>-<runtime>-<family>.md`. A gap between families on the same case is a finding, not noise.
