import Ajv2020Module from 'ajv/dist/2020.js';
import addFormatsModule from 'ajv-formats';
import type { ErrorObject, ValidateFunction } from 'ajv';
import { getSpec } from './spec.ts';

// ajv and ajv-formats ship CommonJS default exports.
const Ajv2020 = ((Ajv2020Module as unknown as { default?: unknown }).default ?? Ajv2020Module) as typeof import('ajv/dist/2020.js').default;
const addFormats = ((addFormatsModule as unknown as { default?: unknown }).default ?? addFormatsModule) as unknown as (ajv: unknown) => void;

export interface ValidationResult {
  valid: boolean;
  agent?: string;
  schema?: string;
  errors: string[];
}

let ajv: InstanceType<typeof Ajv2020> | undefined;
const compiled = new Map<string, ValidateFunction>();

function getAjv() {
  if (ajv) return ajv;
  ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const schema of Object.values(getSpec().schemas)) ajv.addSchema(schema);
  return ajv;
}

function validatorFor(schemaName: string): ValidateFunction | undefined {
  if (compiled.has(schemaName)) return compiled.get(schemaName);
  const schema = getSpec().schemas[schemaName] as { $id?: string } | undefined;
  if (!schema?.$id) return undefined;
  const fn = getAjv().getSchema(schema.$id);
  if (fn) compiled.set(schemaName, fn);
  return fn;
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  return (errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}${e.params && 'allowedValues' in e.params ? ` (${(e.params.allowedValues as unknown[]).join(', ')})` : ''}`);
}

/** Validates an agent envelope against the per-agent schema (which includes the common envelope). */
export function validateEnvelope(envelope: unknown): ValidationResult {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
    return { valid: false, errors: ['envelope must be a JSON object'] };
  }
  const agent = (envelope as { agent?: unknown }).agent;
  if (typeof agent !== 'string') return { valid: false, errors: ['/agent is required'] };
  const schemaName = `${agent}.schema.json`;
  const fn = validatorFor(schemaName) ?? validatorFor('_envelope.schema.json');
  if (!fn) return { valid: false, agent, errors: [`no schema available for agent ${agent}`] };
  const ok = fn(envelope) as boolean;
  return { valid: ok, agent, schema: validatorFor(schemaName) ? schemaName : '_envelope.schema.json', errors: ok ? [] : formatErrors(fn.errors) };
}

export function validateMemoryRecord(record: unknown): ValidationResult {
  const fn = validatorFor('memory-record.schema.json');
  if (!fn) return { valid: false, errors: ['memory-record schema missing'] };
  const ok = fn(record) as boolean;
  return { valid: ok, schema: 'memory-record.schema.json', errors: ok ? [] : formatErrors(fn.errors) };
}
