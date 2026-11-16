import type { Kind, SetupInput, Status, TemplateId } from "../shared/api";
import type { TurnOutput } from "./interviewer";
import type { Item } from "./state";

// Session state kept in the `state` JSON column (04-architecture.md, plus the
// flow fields from ADR-002).
export type SessionState = {
  panel: Item[];
  steps: Item[];
  requirements: Item[];
  core_need: string | null;
  their_questions: string[];
  count: number; // question/offer turns asked (FR-08)
  ai_turns: number; // model calls, for the NFR-03 cap
  priorities_done: boolean;
  last_kind: Kind | null;
  wrap_up: boolean;
  steps_edited: boolean; // respondent edited step cards since the last turn
  topic_index?: number; // furthest map topic reached, for the progress bar
  last: { kind: Kind; say: string; options: string[]; topic: string | null; steps_changed: boolean } | null;
};

export type StoredTurn = { role: "respondent" | "interviewer"; text: string; json?: TurnOutput; at: string };

export type Session = {
  id: string;
  owner_key: string;
  share_token: string;
  template: TemplateId;
  setup: SetupInput;
  basics: Record<string, string | string[]> | null;
  turns: StoredTurn[];
  state: SessionState;
  status: Status;
  output_md: string | null;
  version: number;
  created_at: string;
  updated_at: string;
};

export const emptyState = (): SessionState => ({
  panel: [],
  steps: [],
  requirements: [],
  core_need: null,
  their_questions: [],
  count: 0,
  ai_turns: 0,
  priorities_done: false,
  last_kind: null,
  wrap_up: false,
  steps_edited: false,
  last: null,
});

export class ConflictError extends Error {}

const DAY_MS = 86_400_000;
export const RETENTION_DAYS = 90; // NFR-05

// 144 random bits, URL-safe (NFR-04 asks for at least 128).
export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// IPs are stored only as salted hashes, for the daily creation limits.
export async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromRow(row: Record<string, any>): Session {
  return {
    id: row.id,
    owner_key: row.owner_key,
    share_token: row.share_token,
    template: row.template,
    setup: JSON.parse(row.setup),
    basics: row.basics ? JSON.parse(row.basics) : null,
    turns: JSON.parse(row.turns),
    state: JSON.parse(row.state),
    status: row.status,
    output_md: row.output_md,
    version: row.version,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function sessionByToken(db: D1Database, token: string): Promise<Session | null> {
  const row = await db.prepare("SELECT * FROM sessions WHERE share_token = ?").bind(token).first();
  return row ? fromRow(row) : null;
}

export async function sessionForOwner(db: D1Database, ownerKey: string, id: string): Promise<Session | null> {
  const row = await db.prepare("SELECT * FROM sessions WHERE owner_key = ? AND id = ?").bind(ownerKey, id).first();
  return row ? fromRow(row) : null;
}

// The owner deleting a link: the session, with the respondent's answers and
// the document, is removed for good, and the share link stops working.
// Returns false when the id isn't one of this owner's.
export async function deleteSessionForOwner(db: D1Database, ownerKey: string, id: string): Promise<boolean> {
  const result = await db.prepare("DELETE FROM sessions WHERE id = ? AND owner_key = ?").bind(id, ownerKey).run();
  return result.meta.changes > 0;
}

export async function sessionsForOwner(db: D1Database, ownerKey: string): Promise<Session[]> {
  const { results } = await db
    .prepare("SELECT * FROM sessions WHERE owner_key = ? ORDER BY created_at DESC")
    .bind(ownerKey)
    .all();
  return results.map(fromRow);
}

export async function insertSession(
  db: D1Database,
  input: { ownerKey: string; template: TemplateId; setup: SetupInput; ipHash: string },
): Promise<Session> {
  const now = new Date();
  const session: Session = {
    id: crypto.randomUUID(),
    owner_key: input.ownerKey,
    share_token: newToken(),
    template: input.template,
    setup: input.setup,
    basics: null,
    turns: [],
    // The sender's process sketch becomes the respondent's draft step cards
    // (02-flows-and-screens.md, S1), with ids the interviewer can update.
    state: { ...emptyState(), steps: input.setup.sketch.map((text, i) => ({ id: `s${i + 1}`, text })) },
    status: "not_started",
    output_md: null,
    version: 0,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
  const expires = new Date(now.getTime() + RETENTION_DAYS * DAY_MS).toISOString();
  await db
    .prepare(
      `INSERT INTO sessions (id, owner_key, share_token, template, setup, turns, state, status, creator_ip_hash, created_at, updated_at, expires_at)
       VALUES (?, ?, ?, ?, ?, '[]', ?, 'not_started', ?, ?, ?, ?)`,
    )
    .bind(session.id, session.owner_key, session.share_token, session.template, JSON.stringify(session.setup),
      JSON.stringify(session.state), input.ipHash, session.created_at, session.updated_at, expires)
    .run();
  return session;
}

// Optimistic save: fails with ConflictError if someone else saved first
// (e.g. the same link open in two tabs).
export async function saveSession(db: D1Database, session: Session): Promise<Session> {
  const updatedAt = new Date().toISOString();
  const result = await db
    .prepare(
      `UPDATE sessions SET basics = ?, turns = ?, state = ?, status = ?, output_md = ?, version = version + 1, updated_at = ?
       WHERE id = ? AND version = ?`,
    )
    .bind(
      session.basics ? JSON.stringify(session.basics) : null,
      JSON.stringify(session.turns),
      JSON.stringify(session.state),
      session.status,
      session.output_md,
      updatedAt,
      session.id,
      session.version,
    )
    .run();
  if (result.meta.changes === 0) throw new ConflictError("Session changed since it was read");
  return { ...session, version: session.version + 1, updated_at: updatedAt };
}

// Daily counters: adds one to each key and returns the new counts. They count
// AI setup drafts and new links ("new:owner:<key>", "new:ip:<hash>", "new:site")
// and live apart from the sessions table, so deleting a link never gives its
// allowance back. The column is named ip_hash from when only IPs were counted.
export async function countDraft(db: D1Database, keys: string[], day: string): Promise<number[]> {
  const statement = db.prepare(
    `INSERT INTO draft_usage (ip_hash, day, count) VALUES (?, ?, 1)
     ON CONFLICT (ip_hash, day) DO UPDATE SET count = count + 1
     RETURNING count`,
  );
  const results = await db.batch<{ count: number }>(keys.map((key) => statement.bind(key, day)));
  return results.map((result) => result.results[0]?.count ?? 1);
}

// NFR-05: daily cleanup of expired sessions, sign-ins and old usage counters.
export async function purgeExpired(db: D1Database, now = new Date()) {
  const cutoffDay = new Date(now.getTime() - 2 * DAY_MS).toISOString().slice(0, 10);
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now.toISOString()),
    db.prepare("DELETE FROM draft_usage WHERE day < ?").bind(cutoffDay),
    db.prepare("DELETE FROM logins WHERE expires_at < ?").bind(now.toISOString()),
    // Anonymous owners from before sign-in (ADR-003) go once their links do.
    db.prepare("DELETE FROM owners WHERE google_sub IS NULL AND owner_key NOT IN (SELECT owner_key FROM sessions)"),
  ]);
}
