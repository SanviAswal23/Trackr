# trackr. — Internship Application Tracker

A full-stack web app for tracking internship applications, with AI-assisted follow-up drafting and application-answer generation grounded in the user's actual profile.

**Live demo:** [trackr-gdyz.vercel.app](https://trackr-gdyz.vercel.app)

---

## What it does

- Track applications with company, role, status (Applied / Interview / Rejected / Offer), applied date, job link, and notes.
- Automatic **follow-up reminders** — applications past 10 days with no response are flagged.
- **AI Follow-Up Drafts** — one click generates a personalized follow-up email and LinkedIn message per application, referencing the specific company, role, and days since applying.
- **AI Answer Generator** — paste a job posting and a list of application questions, get back tailored, grounded answers based on the user's saved profile (skills, bio, resume excerpt).
- Google Sign-In via Supabase Auth, with per-user Row Level Security so each user only ever sees their own data.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, Tailwind CSS |
| Auth & Database | Supabase (Postgres, Row Level Security, Google OAuth) |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Deployment | Vercel (static frontend + serverless functions) |
| Icons | FontAwesome |

## AI / LLM engineering notes

This project isn't a thin wrapper around a chat API — a few things worth a closer look:

- **Grounded generation, not hallucination.** The Answer Generator's system prompt explicitly instructs the model to *never* invent projects, skills, or achievements not present in the user's saved profile, and to answer honestly in general terms when a detail is missing. Each generated answer is tagged `grounded: true/false` by the model itself, and the UI visibly distinguishes "based on your profile" answers from generic ones — so the user can see at a glance which answers are safe to submit as-is.
- **Structured output with a fallback path.** Answers are requested as strict JSON (`[{question, answer, grounded}]`), parsed client-side, with a raw-text fallback and a retry if the model returns malformed JSON — so a single bad generation doesn't break the whole feature.
- **Context injection from relational data.** The prompt is assembled dynamically per request from the user's `profiles` row (skills, bio, resume excerpt) and the specific `applications` row (company, role, days since applying) — the same pattern used in RAG-style systems, just against a small structured source instead of a vector store.
- **Secure key handling.** The Groq API key never ships to the client. All AI calls route through a Vercel serverless function (`/api/groq`) that holds the key server-side — the frontend only ever talks to its own backend, never to Groq directly.

## Chrome Extension — coming soon

A companion Chrome extension is in development: a **"+ Save to Tracker"** button that appears on job postings (LinkedIn, Indeed, Greenhouse, Lever, Internshala) for one-click saving straight from the job board, plus a toolbar popup to view and add applications without leaving the page you're on. It shares your existing web app session — no separate login required.

Not yet published to the Chrome Web Store — check back soon, or see the `chrome-extension/` folder in this repo for the current development build.

## Local development

```bash
git clone https://github.com/SanviAswal23/trackr.git
cd trackr
npm install
```

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the AI features, set `GROQ_API_KEY` (no `VITE_` prefix) as an environment variable wherever you run the `/api/groq` serverless function locally (e.g. `vercel dev`).

```bash
npm run dev
```

## Author

Sanvi Aswal — [GitHub](https://github.com/SanviAswal23)
