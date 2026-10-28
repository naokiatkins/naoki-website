-- Run this once in your Neon (Vercel Postgres) query console
-- Dashboard → Storage → your DB → Query

CREATE TABLE IF NOT EXISTS jd_submissions (
  id              SERIAL PRIMARY KEY,
  token           TEXT NOT NULL UNIQUE,
  filename        TEXT NOT NULL,
  blob_url        TEXT,
  extracted_text  TEXT,
  score           INTEGER NOT NULL,
  summary         TEXT,
  matched_skills  JSONB DEFAULT '[]',
  gaps            JSONB DEFAULT '[]',
  ip_address      TEXT,
  user_agent      TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Already created the table with an older version of this file? Run this too:
-- the PDF upload is now best-effort, so blob_url may be empty.
ALTER TABLE jd_submissions ALTER COLUMN blob_url DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_jd_submissions_submitted_at
  ON jd_submissions (submitted_at DESC);

-- Used by the per-IP rate limit in /api/analyze
CREATE INDEX IF NOT EXISTS idx_jd_submissions_ip_submitted_at
  ON jd_submissions (ip_address, submitted_at DESC);
