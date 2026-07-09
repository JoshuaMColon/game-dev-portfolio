# Joshua Colon | Gameplay Programmer Portfolio

This project is a polished, modern portfolio website built to present my work as a gameplay programmer in a way that feels professional, intentional, and tailored to the games industry. It highlights my systems-focused development work in Unreal Engine 5, while also reflecting my broader software engineering background.

The site is designed to feel more like a technical portfolio than a generic personal website. It emphasizes clear project storytelling, gameplay systems, and a clean presentation that is easy to navigate for recruiters, collaborators, and studio leads.

## What this portfolio showcases

- Gameplay programming work in Unreal Engine 5
- Systems-oriented projects such as AI, combat, tools, and interactive mechanics
- A professional layout with a refined dark/light mode experience
- A structured presentation of current work, featured projects, and contact information

## Tech stack

- Next.js 14 with the App Router
- TypeScript
- Tailwind CSS
- next/font for typography

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project structure

The portfolio content is primarily managed through:

- [lib/projects.ts](lib/projects.ts) — project data, descriptions, status, and links
- [app/page.tsx](app/page.tsx) — the homepage hero and featured work
- [app/about/page.tsx](app/about/page.tsx) — professional overview
- [app/contact/page.tsx](app/contact/page.tsx) — contact details and links
- [components/SystemStatus.tsx](components/SystemStatus.tsx) — the status-based systems strip

## Editing content

To update a project, edit the corresponding entry in [lib/projects.ts](lib/projects.ts). Each project includes:

- `status` — controls the visible status label and visual treatment
- `videoUrl` — optional embed link for gameplay capture
- `githubUrl` / `itchUrl` — project links
- `whatIdImprove` — optional note about future improvements

To add a new project, create another object in the projects array. It will automatically appear on the projects page and receive its own detail route.

The homepage featured project is determined by the project marked with `featured: true` in [lib/projects.ts](lib/projects.ts).

## Deployment

This app is ready for deployment on Vercel or any standard Next.js hosting platform.

```bash
npx vercel
```
