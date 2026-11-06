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
