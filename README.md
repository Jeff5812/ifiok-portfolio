# Ifiok Columba — AI Automation Portfolio

This repository contains the current production-ready portfolio for Ifiok Columba, built as a polished Next.js marketing site and automation portfolio.

## Live

- Production: https://ifiok-portfolio.vercel.app
- GitHub: https://github.com/Jeff5812/ifiok-portfolio

## What changed in this version

Compared with the earlier portfolio version, the current codebase includes a more premium design system and a cleaner production-ready structure:

- Full dark premium brand styling with softer gradients and more readable contrast
- A fixed film-grain overlay applied once at low opacity for texture without performance cost
- Limited glass styling only on static surfaces (header, hero portrait card, certificate card) with a safe `@supports` fallback
- Better mobile and desktop spacing system across sections
- Improved certificate card layout to prevent overlap and text crowding
- Stronger typography setup using Next.js self-hosted fonts instead of relying on browser defaults
- Real chat and booking API routes with production-style error handling
- Cleaner metadata and layout architecture for Vercel deployment

## Current stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Resend for email automation
- OpenAI chat API route
- Vercel deployment

## Font loading and production safety

The project uses Next.js font optimization for these fonts:

- Inter
- JetBrains Mono
- Space Grotesk

They are loaded in [src/app/layout.tsx](src/app/layout.tsx) using `next/font/google`, which makes them compile into the production build and serve correctly on Vercel. This is the correct way to ensure the custom fonts are included in production; it avoids missing or fallback fonts caused by CSS-only declarations.

## Key app features

- Home landing page with brand messaging and CTA flow
- Projects showcase with case study pages
- Services overview and conversion-oriented CTA sections
- About page with portfolio and certification card
- Contact page with lead capture
- AI assistant chat widget with OpenAI-backed responses and fallback behavior
- Booking request route connected to email delivery via Resend

## Project structure

```bash
src/
  app/
    about/
    api/
      booking/
      chat/
    contact/
    projects/
    services/
    globals.css
    layout.tsx
    page.tsx
  components/
    About.tsx
    Contact.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    ImageLightbox.tsx
    ProjectsSection.tsx
    Services.tsx
    Skills.tsx
    ToolChip.tsx
    chat/
  content/
    projects.ts
    services.ts
  context/
    ChatContext.tsx
```

## Environment variables

Create a `.env.local` file before local development:

```bash
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
BOOKING_NOTIFY_EMAIL=wizicolumba@gmail.com
```

Notes:

- `OPENAI_API_KEY` powers the AI chat endpoint.
- `RESEND_API_KEY` powers the booking/contact email route.
- `BOOKING_NOTIFY_EMAIL` is the inbox where new inquiries are sent.

## Local development

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Production deployment

This app is intended to be deployed on Vercel. Before the first production deploy, add these environment variables in the Vercel dashboard under Project Settings → Environment Variables:

- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `BOOKING_NOTIFY_EMAIL`

The font setup is automatically included during the Next.js production build, so no extra static font hosting step is required when using the current config.

## Contact

- Email: wizicolumba@gmail.com
- GitHub: https://github.com/Jeff5812
- X: https://x.com/rust_automates
- Upwork: https://www.upwork.com/freelancers/~01c94dc22db54d989f