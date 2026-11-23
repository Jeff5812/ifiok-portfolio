# Ifiok Columba — portfolio

Software & AI automation engineer. Live at <https://ifiok-portfolio.vercel.app>.

## What's here

| Page | What it shows |
| --- | --- |
| `/` | Hero, numbers, featured projects, a live demo of the collections router's decision logic, services preview |
| `/projects`, `/projects/<slug>` | Every project in full (problem, key features, outcome) and a case study for each |
| `/skills` | Skills linked to the projects that prove them, and an explorer of the tools behind them |
| `/services` | What I build, and how a project goes |
| `/about` | Background, how I work, certificate, what I'm doing now |
| `/contact` | Contact form, profiles, and booking through the assistant |

The **AI assistant** (bottom right) answers questions about the work, grounded in the same project data the pages
render (`src/lib/assistant-prompt.ts`), and can take a booking.

## Content

Everything you'd edit lives in `src/content/`:

- `projects.ts`: every project and its case study
- `offer.ts`: skills and services
- `tools.ts`: the tools, which projects use them, and social links
- `site.ts`: name, links, availability and the "Now" list

## Logic behind the demo

`src/lib/collections.ts` is the collections workflow's decision path (its Parse AI Output, Confidence Check and
Route by Risk Tier nodes) ported to TypeScript. `src/lib/*.test.ts` checks it and the other ported models.

## Assets

- 3D logos in `public/media/3d` are real brand marks (Simple Icons paths, CC0; n8n's classic mark) rendered
  locally with three.js.
- `npm run assets` rebuilds the fonts and portrait crops from `assets/`.

## Environment

Same variables as the previous site (see `.env.example`):

- `OPENAI_API_KEY`: the assistant. `OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`.
- `RESEND_API_KEY`, `BOOKING_NOTIFY_EMAIL`: the contact form and the assistant's "Book a call".

Without them the site still works; the assistant and form say plainly that they can't send, and show the email.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck, lint, tests, production build
```

Next.js 16, React 19, TypeScript. No UI framework: CSS modules over a small set of tokens in `src/app/globals.css`.
