-- Owners sign in with Google (ADR-003), so their links follow them across
-- devices. Owners created before this (anonymous cookie keys) keep their rows
-- until their sessions expire, but can no longer reach them.
ALTER TABLE owners ADD COLUMN google_sub TEXT;
ALTER TABLE owners ADD COLUMN email TEXT;
ALTER TABLE owners ADD COLUMN name TEXT;
CREATE UNIQUE INDEX owners_google_sub ON owners (google_sub);

-- Signed-in browsers. The cookie holds a random token; only its hash is stored.
CREATE TABLE logins (
  token_hash TEXT PRIMARY KEY,
  owner_key TEXT NOT NULL REFERENCES owners(owner_key) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX logins_expires ON logins (expires_at);
