# Game Dev Portfolio

A Next.js + Tailwind portfolio site for a gameplay-programmer job hunt, built around a
"systems dossier" visual identity — status indicators, mono-spaced specs, and a
profiler-style status strip instead of a generic gamer template.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- next/font (Space Grotesk, Inter, JetBrains Mono)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where to edit things

**All project content lives in one file:** `lib/projects.ts`

Each project has:
- `status`: `"flagship" | "in-progress" | "planned" | "complete"` — controls the tag color/label everywhere
- `videoUrl`: add a YouTube embed URL (e.g. `https://www.youtube.com/embed/VIDEO_ID`) once you have a capture, and the "CAPTURE_PENDING" placeholder is replaced automatically
- `githubUrl` / `itchUrl`: link out to the repo or a playable build
- `whatIdImprove`: optional — a short honest note shown on the project's own page

To add a new project, just add another object to the `projects` array — it will
automatically show up on `/projects` and get its own `/projects/[slug]` page.

**Homepage flagship**: whichever project has `featured: true` in `lib/projects.ts`
becomes the homepage hero automatically.

**System Status strip** (the homepage signature element): edit the `CATEGORIES`
array in `components/SystemStatus.tsx` to reflect what you're actively building
(`active`), what's next (`building`), or what's on deck (`planned`).

**About / Contact**: edit `app/about/page.tsx` and `app/contact/page.tsx` directly —
replace the placeholder email and LinkedIn URL in `app/contact/page.tsx`.

## Deploying to Vercel

```bash
npx vercel
```

or connect the GitHub repo directly in the Vercel dashboard — either way, no config
changes needed, it's a standard Next.js app.
