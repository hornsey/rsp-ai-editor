-- RSP AI Editor — D1 Schema Migration 0001
-- Run: wrangler d1 execute rsp-db --file=./migrations/0001_initial.sql --remote

-- Sessions (anonymous + Google-linked)
CREATE TABLE sessions (
  id           TEXT PRIMARY KEY,
  google_id    TEXT UNIQUE,
  plan         TEXT NOT NULL DEFAULT 'free',
  edits_used   INTEGER NOT NULL DEFAULT 0,
  edits_limit  INTEGER NOT NULL DEFAULT 5,
  resets_at    INTEGER NOT NULL,
  name         TEXT,
  picture      TEXT,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

-- Edit tasks
CREATE TABLE edits (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL,
  mode         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  input_url    TEXT NOT NULL,
  output_url   TEXT,
  error_msg    TEXT,
  credits_used INTEGER NOT NULL DEFAULT 1,
  created_at   INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Subscriptions (Pro / Team)
CREATE TABLE subscriptions (
  id                 TEXT PRIMARY KEY,
  session_id         TEXT NOT NULL UNIQUE,
  provider           TEXT NOT NULL,
  plan               TEXT NOT NULL,
  status             TEXT NOT NULL,
  provider_id        TEXT NOT NULL,
  current_period_end INTEGER NOT NULL,
  created_at         INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Admin audit log
CREATE TABLE admin_log (
  id         TEXT PRIMARY KEY,
  action     TEXT NOT NULL,
  target_id  TEXT,
  admin_key  TEXT NOT NULL,
  note       TEXT,
  created_at INTEGER NOT NULL
);

-- Indexes
CREATE INDEX idx_edits_session ON edits(session_id);
CREATE INDEX idx_edits_status  ON edits(status);
CREATE INDEX idx_subs_session  ON subscriptions(session_id);
CREATE INDEX idx_subs_status   ON subscriptions(status);
CREATE INDEX idx_admin_created ON admin_log(created_at DESC);
CREATE INDEX idx_sessions_google ON sessions(google_id);

-- Seed: pricing tiers
CREATE TABLE pricing_tiers (
  plan         TEXT PRIMARY KEY,
  edits_limit  INTEGER NOT NULL,
  resets_every TEXT NOT NULL,
  hd_export    INTEGER NOT NULL,
  watermark    INTEGER NOT NULL,
  batch_size   INTEGER NOT NULL,
  created_at   INTEGER NOT NULL
);

INSERT INTO pricing_tiers VALUES
  ('free',  5,    'day',   0, 1, 1,   unixepoch()),
  ('pro',   500,  'month', 1, 0, 20,  unixepoch()),
  ('team',  2500, 'month', 1, 0, 20,  unixepoch());