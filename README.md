# Portfolio — JD-gated booking site

A portfolio website where recruiters upload a job description PDF. Claude scores the match against your profile, and the server only hands out your Calendly booking link if the score meets your threshold. Every submission is logged to Postgres, and the PDF is kept in private Blob storage.

## Tech stack

| Thing | Service |
|---|---|
| Hosting + CI/CD | Vercel |
| AI analysis | Anthropic Claude Haiku 5.5 |
| Submission log | Neon Postgres (Vercel Storage) |
| PDF storage | Vercel Blob (private) |
| Booking | Calendly (opens in a new tab) |

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Create the storage

In the Vercel dashboard, under **Storage**:

1. Create a **Neon Postgres** database and connect it to the project. This sets `POSTGRES_URL`.
2. Create a **Blob** store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`.
3. Open the database's **Query** tab and run [`lib/schema.sql`](lib/schema.sql).

### 3. Set up Calendly

1. Create the event recruiters should book.
2. Add a custom question to the event and make it the **first** question (e.g. "Reference"). The site prefills it with the submission token, so each booking links back to the JD that unlocked it.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local` (see [`.env.example`](.env.example) for what each one is), then add the same keys in Vercel → **Settings** → **Environment Variables**. To pull the storage values Vercel created, run `vercel env pull .env.local`.

### 5. Personalise your profile

Edit the `MY_PROFILE` constant at the top of `app/api/analyze/route.ts`, plus:
- `components/HeroSection.tsx` — name, links, tagline
- `components/AboutSection.tsx` — bio, stats
- `components/WorkSection.tsx` — projects
- `app/layout.tsx` — page title & meta description

---

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to GitHub; Vercel deploys every push. To deploy from the CLI instead:

```bash
npx vercel
```

---

## Adjusting the match threshold

`MATCH_THRESHOLD` (default `70`) controls when the booking link unlocks. It is read on the server, so changing it needs a redeploy.
- `60` — more open
- `75` — more selective
- `85` — only near-perfect matches

## Looking up submissions

[`lib/queries.sql`](lib/queries.sql) has saved queries for the Neon query console: find a submission by the token from a Calendly booking, list the latest submissions, and list recent strong matches.

---

## Architecture

```
Recruiter uploads PDF
        ↓
POST /api/analyze
  1. Validate file (PDF, <5 MB)
  2. Rate-limit: max 5 uploads per IP per hour
  3. Extract text with unpdf
  4. Score with Claude Haiku (structured JSON: score, summary, skills, gaps)
  5. Store the PDF in private Blob storage and log the submission to Postgres
     (storage failures are logged, never shown to the recruiter)
  6. score >= MATCH_THRESHOLD → return the Calendly link with the token
        ↓
Client shows the result
  bookingUrl present → "Book a call" link that opens Calendly in a new tab
  otherwise          → low-match message
```

The booking link never ships in the client bundle; a visitor only receives it after a passing score.
