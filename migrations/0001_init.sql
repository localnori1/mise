-- Mise schema (source/handoff/04-architecture.md "Data model"), adapted to
-- D1/SQLite: JSON columns are TEXT, timestamps are ISO-8601 TEXT.

CREATE TABLE owners (
  owner_key TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  owner_key TEXT NOT NULL REFERENCES owners(owner_key),
  share_token TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL CHECK (template IN ('requirements', 'pre_audit')),
  setup TEXT NOT NULL,
  basics TEXT,
  turns TEXT NOT NULL DEFAULT '[]',
  state TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'ready', 'deleted')),
  output_md TEXT,
  -- Hash of the creator's IP, for the per-device creation limit (NFR-03).
  creator_ip_hash TEXT NOT NULL,
  -- Optimistic locking: a write only succeeds against the version it read.
  version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX sessions_owner ON sessions (owner_key, created_at);
CREATE INDEX sessions_ip ON sessions (creator_ip_hash, created_at);
CREATE INDEX sessions_expires ON sessions (expires_at);

-- Daily per-IP counter for setup drafting, which calls the AI without
-- creating a session.
CREATE TABLE draft_usage (
  ip_hash TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, day)
);
