# Ifiok Columba — Portfolio

My personal site. I build AI automations for a living, so I built this to actually run one instead of just writing about it.

**Live:** [ifiok-portfolio.vercel.app](https://ifiok-portfolio.vercel.app)

## About this build

The chat widget on the site (IC Assistant) is a real agent, not a decoration. It answers questions about my work, walks visitors through past projects, and can take a booking, backed by an actual LLM call with a fallback in place for when that call fails. It's the same kind of system I build for clients, just pointed at my own site.

Everything here is real. No made-up projects, no invented numbers, nothing I can't back up if someone asks.

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Email:** Resend (contact / booking flow)
- **AI chat:** OpenAI-backed API route with a scripted fallback layer
- **Deployment:** Vercel

## Why it's built this way

- **The chat widget is a working agent** — handles guided flows (project walkthroughs, booking a call) and open-ended questions through a live LLM call, and falls back to a direct contact path if the API call fails instead of just breaking.
- **Built like something meant to run in production** — typed API routes, config kept in environment variables, errors handled so a visitor always has a way to reach me.
- **Same approach I use for client work** — n8n for orchestration, webhooks for integrations, agents built across whichever tool fits the job (Gemini, OpenAI, Claude, Ollama), with cost kept in mind from the start.

## Project structure

```
src/
  app/
    api/
      chat/       → LLM-backed chat endpoint
      booking/     → booking/lead capture endpoint
    projects/      → case studies page
    services/
    about/
    contact/
  components/
    chat/          → IC Assistant widget (ChatWidget, ChatTrigger, GlobalChat)
    Hero.tsx, Skills.tsx, Services.tsx, ProjectsSection.tsx, Contact.tsx, Header.tsx
  content/
    projects.ts    → project data (source of truth for case studies)
  context/
    ChatContext.tsx
```

## Running locally

```bash
git clone https://github.com/Jeff5812/ifiok-portfolio.git
cd ifiok-portfolio
npm install
```

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your_key_here                    # server-side, powers the AI chat
RESEND_API_KEY=your_key_here                     # for contact/booking emails
NEXT_PUBLIC_BOOKING_WEBHOOK_URL=your_url_here    # optional, external booking webhook
```

Then:

```bash
npm run dev
```

Site runs at `http://localhost:3000`.

## Deployment

Connected to Vercel with auto-deploy on push to `main`. Environment variables are set in Vercel → Settings → Environment Variables and must be applied to Production (and Preview, if used) before a deploy will pick them up.

## Contact

- Email: wizicolumba@gmail.com
- X / Twitter: [@rust_automates](https://twitter.com/rust_automates)
- GitHub: [Jeff5812](https://github.com/Jeff5812)
- Upwork: (https://www.upwork.com/freelancers/~01c94dc22db54d989f)
