-- Saved queries for looking up JD submissions.
-- Paste into the Neon query console (Dashboard → Storage → your DB → Query).

-- Look up who booked: Calendly shows the token as the answer to the
-- event's first custom question. Paste it here.
SELECT id, filename, score, summary, matched_skills, gaps, blob_url, submitted_at
FROM jd_submissions
WHERE token = 'PASTE_TOKEN_HERE';

-- Latest submissions
SELECT id, token, filename, score, summary, ip_address, submitted_at
FROM jd_submissions
ORDER BY submitted_at DESC
LIMIT 50;

-- Strong matches in the last 30 days
SELECT id, token, filename, score, summary, submitted_at
FROM jd_submissions
WHERE score >= 70
  AND submitted_at > NOW() - INTERVAL '30 days'
ORDER BY score DESC;
