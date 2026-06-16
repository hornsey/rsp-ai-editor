-- RSP AI Editor — D1 Schema Migration 0002
-- Convert legacy edit-count entitlements to the credits wallet model.

ALTER TABLE sessions ADD COLUMN monthly_credits INTEGER NOT NULL DEFAULT 5;
ALTER TABLE sessions ADD COLUMN purchased_credits INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sessions ADD COLUMN credits_used INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sessions ADD COLUMN reset_at INTEGER;

UPDATE sessions
SET
  monthly_credits = CASE
    WHEN plan = 'pro' THEN 1200
    WHEN plan = 'max' THEN 3500
    WHEN plan = 'team' THEN 3500
    ELSE 5
  END,
  credits_used = COALESCE(edits_used, 0),
  reset_at = COALESCE(resets_at, strftime('%s','now') * 1000 + 86400000),
  plan = CASE WHEN plan = 'team' THEN 'max' ELSE plan END;

CREATE TABLE sessions_credits_new (
  id                TEXT PRIMARY KEY,
  google_id         TEXT UNIQUE,
  plan              TEXT NOT NULL DEFAULT 'free',
  monthly_credits   INTEGER NOT NULL DEFAULT 5,
  purchased_credits INTEGER NOT NULL DEFAULT 0,
  credits_used      INTEGER NOT NULL DEFAULT 0,
  reset_at          INTEGER NOT NULL,
  name              TEXT,
  picture           TEXT,
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);

INSERT INTO sessions_credits_new (
  id, google_id, plan, monthly_credits, purchased_credits, credits_used, reset_at, name, picture, created_at, updated_at
)
SELECT
  id, google_id, plan, monthly_credits, purchased_credits, credits_used, reset_at, name, picture, created_at, updated_at
FROM sessions;

DROP TABLE sessions;
ALTER TABLE sessions_credits_new RENAME TO sessions;
CREATE INDEX idx_sessions_google ON sessions(google_id);

CREATE TABLE pricing_tiers_credits_new (
  plan              TEXT PRIMARY KEY,
  monthly_credits   INTEGER NOT NULL,
  resets_every      TEXT NOT NULL,
  hd_export         INTEGER NOT NULL,
  watermark         INTEGER NOT NULL,
  batch_size        INTEGER NOT NULL,
  created_at        INTEGER NOT NULL
);

INSERT INTO pricing_tiers_credits_new VALUES
  ('free', 5,    'day',   0, 1, 1,   unixepoch()),
  ('pro',  1200, 'month', 1, 0, 20,  unixepoch()),
  ('max',  3500, 'month', 1, 0, 20,  unixepoch());

DROP TABLE pricing_tiers;
ALTER TABLE pricing_tiers_credits_new RENAME TO pricing_tiers;
