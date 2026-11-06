# Examples

`demo-pricing-change/` is the export of one run of the go-no-go graph, produced by `scripts/make-example.mjs` from the synthetic eval case in `eval/cases/demo-pricing-change`. The data is invented. It shows what a decision record looks like:

- `report.md`: decision, confidence declared versus computed by the engine, outputs and model families, gates with the human's answer, rule requirements, predictions registered for calibration, evidence table
- `log.jsonl`: the hash-chained decision log
- `verification.json`: integrity check of the log
- `envelopes.json`: every agent output as received
- `trace.otlp.json`: the run as an OpenTelemetry trace (structure and hashes, no content)

Check the integrity yourself with `aits verify --file examples/demo-pricing-change/log.jsonl`, then change one character in a copy of the file and run it again: the hash chain breaks at that entry.
