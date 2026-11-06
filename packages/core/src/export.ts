import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { Run } from './run.ts';
import { verifyLog, type LogEntry } from './log.ts';
import { ENGINE_VERSION } from './run.ts';

type Attr = { key: string; value: { stringValue?: string; intValue?: string; boolValue?: boolean; doubleValue?: number } };

function attr(key: string, v: unknown): Attr | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'boolean') return { key, value: { boolValue: v } };
  if (typeof v === 'number') return Number.isInteger(v) ? { key, value: { intValue: String(v) } } : { key, value: { doubleValue: v } };
  return { key, value: { stringValue: String(v) } };
}
const attrs = (o: Record<string, unknown>) => Object.entries(o).map(([k, v]) => attr(k, v)).filter(Boolean) as Attr[];
const nanos = (iso: string) => (BigInt(Date.parse(iso)) * 1_000_000n).toString();
const hex = (s: string, len: number) => createHash('sha256').update(s).digest('hex').slice(0, len);

/**
 * Converts the decision log into OTLP/JSON traces using the OpenTelemetry GenAI conventions:
 * one workflow span for the run and one invoke_agent span per submitted envelope.
 * Content (prompts, outputs) is not exported; only structure, statuses and hashes.
 */
export function toOtlp(run: Run): object {
  const entries = run.entries();
  const start = run.start();
  const traceId = hex(run.id, 32);
  const rootId = hex(run.id + ':root', 16);
  const first = entries[0];
  const last = entries.at(-1)!;
  const spans: object[] = [];
  const rootEvents: object[] = [];
  for (const e of entries) {
    if (e.type === 'envelope') {
      const d = e.data as { agent: string; status: string; envelope: Record<string, unknown>; errors?: string[] };
      const prov = (d.envelope.provenance ?? {}) as Record<string, unknown>;
      const began = typeof d.envelope.timestamp === 'string' && Date.parse(d.envelope.timestamp) <= Date.parse(e.ts) ? d.envelope.timestamp : e.ts;
      spans.push({
        traceId,
        spanId: hex(`${run.id}:${e.seq}`, 16),
        parentSpanId: rootId,
        name: `invoke_agent ${d.agent}`,
        kind: 1,
        startTimeUnixNano: nanos(began),
        endTimeUnixNano: nanos(e.ts),
        attributes: attrs({
          'gen_ai.operation.name': 'invoke_agent',
          'gen_ai.agent.name': d.agent,
          'gen_ai.request.model': prov.model,
          'aits.model_family': prov.model_family,
          'aits.tier': prov.tier,
          'aits.run_index': prov.run_index,
          'aits.envelope.status': d.status,
          'aits.confidence': (d.envelope.confidence as { level?: string } | undefined)?.level,
          'aits.log.seq': e.seq,
          'aits.log.hash': e.hash,
        }),
        events: [
          {
            name: 'gen_ai.evaluation.result',
            timeUnixNano: nanos(e.ts),
            attributes: attrs({ 'gen_ai.evaluation.name': 'aits.schema_and_rules', 'gen_ai.evaluation.score.label': d.status, 'gen_ai.evaluation.explanation': (d.errors ?? []).join('; ') || undefined }),
          },
        ],
        status: { code: d.status === 'accepted' ? 1 : 2 },
      });
    } else if (e.type !== 'run_started') {
      rootEvents.push({ name: `aits.${e.type}`, timeUnixNano: nanos(e.ts), attributes: attrs({ 'aits.log.seq': e.seq, 'aits.log.hash': e.hash, ...flatData(e) }) });
    }
  }
  spans.unshift({
    traceId,
    spanId: rootId,
    name: `invoke_workflow aits.${start.graph}`,
    kind: 1,
    startTimeUnixNano: nanos(first.ts),
    endTimeUnixNano: nanos(last.ts),
    attributes: attrs({ 'gen_ai.operation.name': 'invoke_workflow', 'aits.run_id': run.id, 'aits.graph': start.graph, 'aits.mode': start.mode, 'aits.state': run.state(), 'aits.log.head': run.log.head() }),
    events: rootEvents,
    status: { code: run.state() === 'aborted' ? 2 : 1 },
  });
  return {
    resourceSpans: [
      {
        resource: { attributes: attrs({ 'service.name': 'aits', 'service.version': ENGINE_VERSION }) },
        scopeSpans: [{ scope: { name: 'aits-core', version: ENGINE_VERSION }, spans }],
      },
    ],
  };
}

function flatData(e: LogEntry): Record<string, unknown> {
  const d = (e.data ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of ['gate_id', 'rule', 'decision', 'via', 'agent', 'status', 'engine_confidence', 'declared_confidence']) if (d[k] !== undefined) out[`aits.${k}`] = d[k];
  return out;
}

export async function sendOtlp(endpoint: string, payload: object, headers: Record<string, string> = {}): Promise<number> {
  const url = endpoint.replace(/\/$/, '') + (endpoint.endsWith('/v1/traces') ? '' : '/v1/traces');
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(payload) });
  return res.status;
}

/** Human-readable report of a run, built only from the log. */
export function markdownReport(run: Run, publicKeys: Record<string, string> = {}): string {
  const s = run.status();
  const entries = run.entries();
  const verification = verifyLog(entries, publicKeys);
  const synth = entries.find((e) => e.type === 'synthesis_accepted')?.data as
    | { envelope: { main_output: { decision?: { statement?: string; type?: string; conditions?: string[] }; integrated_synthesis?: string } }; engine_confidence: string; declared_confidence: string; caps: string[] }
    | undefined;
  const acks = run.acks();
  const lines: string[] = [];
  lines.push(`# AITS decision record`, '');
  lines.push(`**Problem:** ${s.problem}`, '');
  lines.push(`| Field | Value |`, `| --- | --- |`);
  lines.push(`| Run | \`${s.run_id}\` |`, `| Playbook graph | ${s.graph} |`, `| HITL mode | ${s.mode} |`, `| State | ${s.state} |`);
  if (synth) {
    lines.push(`| Decision | ${synth.envelope.main_output.decision?.type ?? 'n/a'} |`);
    lines.push(`| Confidence declared by the orchestrator | ${synth.declared_confidence} |`);
    lines.push(`| Confidence computed by the engine | **${synth.engine_confidence}** |`);
  }
  lines.push(`| Log entries | ${verification.entries} |`, `| Log head | \`${verification.head}\` |`, `| Log integrity | ${verification.ok ? 'verified' : 'FAILED'} |`, `| Signed entries verified | ${verification.signed} |`, '');
  if (synth) {
    lines.push('## Decision', '', synth.envelope.main_output.decision?.statement ?? '', '');
    for (const c of synth.envelope.main_output.decision?.conditions ?? []) lines.push(`- Condition: ${c}`);
    if (synth.envelope.main_output.integrated_synthesis) lines.push('', synth.envelope.main_output.integrated_synthesis, '');
    lines.push('### Why the engine set this confidence', '', ...synth.caps.map((c) => `- ${c}`), '');
  }
  lines.push('## Agent outputs', '', '| Log # | Agent | Status | Confidence | Model family |', '| --- | --- | --- | --- | --- |');
  for (const x of s.submitted) lines.push(`| ${x.seq} | ${x.agent} | ${x.status} | ${x.confidence ?? ''} | ${x.family ?? 'not declared'} |`);
  lines.push('', '## Diversity', '');
  lines.push(`- Families that produced outputs: ${s.diversity.families.join(', ') || 'none declared'}`);
  lines.push(`- Families available in the configuration: ${s.diversity.families_available.join(', ') || 'none configured'}`);
  lines.push(`- Monoculture: ${s.diversity.monoculture ? 'yes' : 'no'}${s.diversity.verified ? '' : ' (provenance missing on some outputs, diversity unverified)'}`);
  for (const [agent, m] of Object.entries(s.diversity.multi_run)) lines.push(`- ${agent}: ${m.runs} run(s) of ${m.required} required by policy`);
  const multi = Object.keys(s.diversity.multi_run);
  for (const agent of multi) {
    const agg = run.aggregate(agent);
    if (!agg.minority_report.length) continue;
    lines.push('', `### Minority report: ${agent}`, '', agg.note, '');
    for (const m of agg.minority_report) lines.push(`- ${m.kind}: ${m.position} (held by ${m.held_by_runs} of ${m.of_runs} runs)`);
  }
  lines.push('', '## Gates and human decisions', '');
  if (!s.closed_gates.length && !s.open_gates.length) lines.push('No gate was opened.');
  for (const g of [...s.closed_gates, ...s.open_gates]) {
    const ack = acks.find((a) => a.gate_id === g.id);
    lines.push(`- **${g.id}** ${g.title} (${g.severity}) — ${ack ? `${ack.decision}, answered via ${ack.via}${ack.user_quote ? `: "${ack.user_quote}"` : ''}${ack.justification ? ` — ${ack.justification}` : ''}` : 'OPEN'}`);
  }
  lines.push('', '## Rule requirements', '');
  if (!s.requirements.length) lines.push('No rule required additional agents.');
  for (const r of s.requirements) lines.push(`- ${r.rule} ${r.title}: ${r.satisfied ? `satisfied by log entries ${r.satisfied_by?.join(', ')}` : r.overridden ? 'waived by a human override' : 'UNMET'}`);
  if (s.skipped.length) lines.push('', `Agents skipped by human decision: ${s.skipped.join(', ')}`);
  const preds = run.predictions();
  if (preds.length) {
    lines.push('', '## Predictions registered for calibration', '', '| Id | Agent | Probability | Statement |', '| --- | --- | --- | --- |');
    for (const p of preds) lines.push(`| ${p.id} | ${p.agent} | ${p.probability} | ${p.statement.replace(/\|/g, '/')} |`);
  }
  lines.push('', '## Evidence for oversight and record-keeping', '');
  lines.push(
    'This record supports, and does not by itself establish, compliance with obligations such as those of the EU AI Act on record-keeping (Art. 12), human oversight (Art. 14), deployer duties including log retention (Art. 26) and the right to an explanation of individual decisions (Art. 86). Applicability depends on the use case and must be assessed by counsel.',
    '',
    '| Evidence | Where |',
    '| --- | --- |',
    '| Every agent output, validation result and human decision, in order | `log.jsonl` (hash-chained) |',
    '| Integrity check of the log | `verification.json` |',
    '| Who decided each gate and through which channel | Gates section above, `via` field |',
    '| Inputs behind the decision | `envelopes.json` |',
    '| Execution trace for observability systems | `trace.otlp.json` |',
  );
  if (verification.problems.length) lines.push('', '### Integrity problems', '', ...verification.problems.map((p) => `- ${p}`));
  lines.push('', `_Generated by AITS engine ${ENGINE_VERSION}._`, '');
  return lines.join('\n');
}

export function exportRun(run: Run, outDir = path.join(run.dir, 'export'), publicKeys: Record<string, string> = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const entries = run.entries();
  const verification = verifyLog(entries, publicKeys);
  fs.writeFileSync(path.join(outDir, 'report.md'), markdownReport(run, publicKeys));
  fs.writeFileSync(path.join(outDir, 'envelopes.json'), JSON.stringify(run.envelopes(), null, 2));
  fs.copyFileSync(run.log.file, path.join(outDir, 'log.jsonl'));
  fs.writeFileSync(path.join(outDir, 'verification.json'), JSON.stringify(verification, null, 2));
  fs.writeFileSync(path.join(outDir, 'trace.otlp.json'), JSON.stringify(toOtlp(run), null, 2));
  for (const [id, pem] of Object.entries(publicKeys)) fs.writeFileSync(path.join(outDir, `signing-key-${id}.pub.pem`), pem);
  return { dir: outDir, files: fs.readdirSync(outDir), verification };
}
