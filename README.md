# ALTEREGO OS — HIVE Check-In

AI-assisted onboarding for the HIVE Business Accelerator, powered by ALTEREGO OS.

A Next.js 14 app that walks aspiring founders through the HIVE check-in (Investment
Readiness Level, IRL 1–9), autosaves every response, lets users resume by email,
and provides a floating "Ask Me" AI assistant (Claude) with a RAG scaffold over
reference documents (Italian Startup Act, HIVE program materials).

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind
- **Prisma** + **SQLite** (offline/local) — swap to Postgres for production
- **Anthropic Claude** (`@anthropic-ai/sdk`) with prompt caching on system prompts
- **RAG**: naive keyword retrieval over JSON chunks (scaffold). Upgrade path:
  Voyage/OpenAI embeddings + pgvector/Supabase Vector.

## Run it offline (first time)

```bash
cd alterego-os
npm install
cp .env.local.example .env.local      # Windows: copy .env.local.example .env.local
# edit .env.local and paste your ANTHROPIC_API_KEY (optional — Ask Me degrades without it)

npx prisma generate
npx prisma db push                     # creates prisma/dev.db (SQLite)

npm run dev
```

Open http://localhost:3000 and click **Start Your Journey**.

### Optional: seed the RAG index

```bash
npm run rag:ingest
```

This downloads referenced public PDFs into `data/raw/`, chunks them, and writes
`data/rag-chunks.json`. The Ask Me widget will pick them up automatically on the
next request.

> Add your own HIVE program materials by editing `SOURCES` in
> [`scripts/ingest-rag.ts`](scripts/ingest-rag.ts).

## How the resume-by-email flow works

1. User lands on `/` and clicks **Start Your Journey**.
2. `/onboarding` asks for email (no password).
3. `POST /api/session` finds or creates the user, returns all previously saved
   answers, and computes `currentStep` = earliest section with a missing required
   answer.
4. User is routed directly to that section — every field autosaves via
   `POST /api/answer` (debounced 400ms).
5. At the end, `/onboarding/review` shows every response grouped by section with
   an **Edit** button per section. **Submit** calls `POST /api/submit` which
   validates that all required fields are answered, then marks the session
   submitted and routes to `/onboarding/thank-you`.

If the user closes the tab at any point and comes back with the same email, they
land exactly where they left off.

## Project layout

```
alterego-os/
├── prisma/schema.prisma              SQLite schema (User, Session, Answer)
├── scripts/ingest-rag.ts             RAG ingestion scaffold
├── src/
│   ├── app/
│   │   ├── page.tsx                  Landing
│   │   ├── layout.tsx                Root layout + Ask Me widget mount
│   │   ├── globals.css
│   │   ├── onboarding/
│   │   │   ├── page.tsx              Email gate / resume
│   │   │   ├── personal/page.tsx     Personal info form
│   │   │   ├── irl/[section]/page.tsx  IRL 1..9 dynamic sections
│   │   │   ├── review/page.tsx       Scrollable review + Submit
│   │   │   └── thank-you/page.tsx
│   │   └── api/
│   │       ├── session/route.ts      Create/resume session
│   │       ├── answer/route.ts       Autosave a single answer
│   │       ├── submit/route.ts       Finalize submission
│   │       └── chat/route.ts         Ask Me streaming (Claude)
│   ├── components/
│   │   ├── HiveLogo.tsx              Pure-SVG branding
│   │   ├── ProgressBar.tsx
│   │   ├── QuestionField.tsx         Renders any Question type
│   │   ├── SectionForm.tsx           Shared form logic + autosave
│   │   └── AskMeWidget.tsx           Floating AI avatar, bottom-right
│   └── lib/
│       ├── db.ts                     Prisma client singleton
│       ├── anthropic.ts              Claude SDK + model IDs
│       ├── questions.ts              All 59 IRL questions + personal info
│       ├── session.ts                Resume + validation helpers
│       └── rag.ts                    Keyword retrieval over JSON chunks
└── README.md
```

## Adding / editing questions

All questions live in [`src/lib/questions.ts`](src/lib/questions.ts) as a typed
array. Add a new entry to the relevant IRL section and it will appear in the UI,
validation, review screen, and submit check automatically. No DB migration
needed — answers are stored by `questionId`.

## Ask Me AI widget

- Bottom-right floating button on every page.
- Streams responses from Claude (`claude-sonnet-4-5` by default).
- System prompt is prompt-cached per turn for cost/latency.
- If `ANTHROPIC_API_KEY` is not set, it shows a friendly "not configured yet" message.
- RAG: last user message is used as query against `data/rag-chunks.json`. Top-3
  chunks are injected into the system prompt inside a `<retrieved_context>` block.

## Going to production

1. **Database**: change `provider` in `prisma/schema.prisma` from `sqlite` to
   `postgresql`, set `DATABASE_URL` to your Postgres URL (Supabase, Neon, etc.),
   run `npx prisma db push`.
2. **RAG**: replace `src/lib/rag.ts` with a real vector store. Minimum changes:
   - Embed chunks in `scripts/ingest-rag.ts` (Voyage or OpenAI embeddings).
   - Store embeddings in pgvector or Supabase Vector.
   - Replace `retrieveContext()` with a vector similarity query.
3. **Auth**: current "auth" is email-only. For production, add magic-link email
   verification (Supabase Auth, Clerk, or Auth.js) so one user can't resume
   another's session.
4. **Deploy**: Vercel for the Next.js app + any managed Postgres. Set all env
   vars from `.env.local.example` in the Vercel dashboard.

## Known limitations / TODOs

- [ ] Email is not verified. Anyone who knows an email can resume.
- [ ] No rate limiting on `/api/chat`.
- [ ] RAG is keyword-based only — good enough for the scaffold, not production.
- [ ] No admin dashboard to view submitted responses (query the DB directly via
      `npx prisma studio`).
- [ ] Mobile styles are responsive but could use a deeper pass.

---

Built with care for HIVE Business Accelerator.
