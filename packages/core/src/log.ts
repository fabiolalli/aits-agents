import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createPrivateKey, createPublicKey, generateKeyPairSync, sign, verify, type KeyObject } from 'node:crypto';
import { canonicalJson, sha256, nowIso } from './util.ts';

export const GENESIS = '0'.repeat(64);

export interface LogEntry<T = unknown> {
  seq: number;
  ts: string;
  type: string;
  data: T;
  prev: string;
  hash: string;
  sig?: string;
  key_id?: string;
}

export interface Signer {
  keyId: string;
  privateKey: KeyObject;
  publicKeyPem: string;
}

function entryHash(e: Pick<LogEntry, 'seq' | 'ts' | 'type' | 'data' | 'prev'>): string {
  return sha256(canonicalJson({ seq: e.seq, ts: e.ts, type: e.type, data: e.data, prev: e.prev }));
}

/** Append-only, hash-chained JSONL log. Every entry commits to the previous one. */
export class DecisionLog {
  readonly file: string;
  private entries: LogEntry[];
  private signer?: Signer;

  constructor(file: string, signer?: Signer) {
    this.file = file;
    this.signer = signer;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    this.entries = fs.existsSync(file) ? readLog(file) : [];
  }

  all(): LogEntry[] {
    return this.entries;
  }

  head(): string {
    return this.entries.at(-1)?.hash ?? GENESIS;
  }

  append<T>(type: string, data: T): LogEntry<T> {
    const base = { seq: this.entries.length, ts: nowIso(), type, data: JSON.parse(JSON.stringify(data)) as T, prev: this.head() };
    const hash = entryHash(base);
    const entry: LogEntry<T> = { ...base, hash };
    if (this.signer) {
      entry.sig = sign(null, Buffer.from(hash, 'hex'), this.signer.privateKey).toString('base64');
      entry.key_id = this.signer.keyId;
    }
    fs.appendFileSync(this.file, JSON.stringify(entry) + '\n');
    this.entries.push(entry);
    return entry;
  }
}

export function readLog(file: string): LogEntry[] {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as LogEntry);
}

export interface VerifyResult {
  ok: boolean;
  entries: number;
  head: string;
  signed: number;
  problems: string[];
}

/** Recomputes every hash and, when public keys are given, every signature. */
export function verifyLog(entries: LogEntry[], publicKeys: Record<string, string> = {}): VerifyResult {
  const problems: string[] = [];
  let prev = GENESIS;
  let signed = 0;
  entries.forEach((e, i) => {
    if (e.seq !== i) problems.push(`entry ${i}: sequence is ${e.seq}`);
    if (e.prev !== prev) problems.push(`entry ${i}: previous hash does not match`);
    const expected = entryHash(e);
    if (expected !== e.hash) problems.push(`entry ${i}: content was modified (hash mismatch)`);
    if (e.sig) {
      const pem = e.key_id ? publicKeys[e.key_id] : undefined;
      if (pem) {
        const ok = verify(null, Buffer.from(e.hash, 'hex'), createPublicKey(pem), Buffer.from(e.sig, 'base64'));
        if (!ok) problems.push(`entry ${i}: signature is invalid`);
        else signed++;
      } else problems.push(`entry ${i}: signed with key ${e.key_id} but no public key was provided`);
    }
    prev = e.hash;
  });
  return { ok: problems.length === 0, entries: entries.length, head: prev, signed, problems };
}

export function defaultKeyDir(): string {
  return process.env.AITS_KEY_DIR ?? path.join(os.homedir(), '.aits', 'keys');
}

export function generateSigningKey(dir = defaultKeyDir()): { privatePath: string; publicPath: string; keyId: string } {
  fs.mkdirSync(dir, { recursive: true });
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const privatePath = path.join(dir, 'aits-ed25519.pem');
  const publicPath = path.join(dir, 'aits-ed25519.pub.pem');
  if (fs.existsSync(privatePath)) throw new Error(`a key already exists at ${privatePath}`);
  fs.writeFileSync(privatePath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  const pub = publicKey.export({ type: 'spki', format: 'pem' }).toString();
  fs.writeFileSync(publicPath, pub);
  return { privatePath, publicPath, keyId: keyIdOf(pub) };
}

export function keyIdOf(publicKeyPem: string): string {
  return sha256(publicKeyPem.trim()).slice(0, 16);
}

export function loadSigner(privatePath: string): Signer {
  const privateKey = createPrivateKey(fs.readFileSync(privatePath));
  const publicKeyPem = createPublicKey(privateKey).export({ type: 'spki', format: 'pem' }).toString();
  return { keyId: keyIdOf(publicKeyPem), privateKey, publicKeyPem };
}
