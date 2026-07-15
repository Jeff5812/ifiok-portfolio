# Ifiok Columba — Digital HQ

A personal portfolio site built as a living platform, not a static brochure.
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion.

The visual language is a monochrome, engineering-minimal system (warm-white
canvas, near-black ink, one violet→teal→amber signal gradient used sparingly,
mono-uppercase labels) inspired by Vercel's marketing site, but every section
and the project showcase mechanic are built around how this specific person
actually works: n8n workflows, AI agent orchestration, and full-stack builds.

**Current state:** the architecture is fully wired up — workflow canvas,
case study pages, blog, sitemap, OG images, SEO — but `src/content/projects.ts`
and `src/content/blog/` are intentionally **empty**. Nothing is published
until you add it. See "Adding content" below.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| Motion | Framer Motion |
| Content | Local TypeScript modules (projects, profile, skills, milestones) + MDX (blog) |
<<<<<<< HEAD
=======
| Lead capture | n8n + Google Sheets (webhook) |
| Icons | lucide-react |
| Deployment target | Vercel |

No database, no CMS, no API keys required to run. Content lives in version
control as code, which means zero hosting cost beyond Vercel's free tier and
zero moving parts to keep alive.

---

## Project structure

```
src/
├── app/                      # Routes (App Router)
│   ├── page.tsx              # Homepage — assembles all sections
│   ├── layout.tsx            # Root layout, fonts, global SEO metadata
│   ├── globals.css           # Design tokens (colors, fonts) + base styles
│   ├── sitemap.ts            # Auto-generated sitemap (includes all projects/posts)
│   ├── robots.ts             # robots.txt
│   ├── opengraph-image.tsx   # Dynamic OG image for the homepage
│   ├── not-found.tsx         # Custom 404
│   ├── projects/
│   │   ├── page.tsx          # /projects — all projects, list view
│   │   └── [slug]/page.tsx   # /projects/[slug] — full case study page
│   └── blog/
│       ├── page.tsx          # /blog — all posts
│       └── [slug]/page.tsx   # /blog/[slug] — full post (MDX rendered)
│
├── components/
│   ├── sections/             # Homepage sections (Hero, WorkSection, etc.)
│   ├── workflow/              # The project showcase mechanic
│   │   ├── WorkflowCanvas.tsx    # Desktop drag-to-pan graph + mobile list + empty state
│   │   ├── WorkflowNode.tsx      # Individual project card/node
│   │   ├── WorkflowEdges.tsx     # SVG connector lines between nodes
│   │   └── CaseStudyPanel.tsx    # Slide-up modal with full case study
│   └── mdx/MDXComponents.tsx  # Styled overrides for MDX blog content
│
├── content/                   # ← YOU EDIT THESE FILES
│   ├── profile.ts             # Name, role, headline, stats, "now building", pillars
│   ├── projects.ts            # Project list — EMPTY by default, see below
│   ├── skills.ts               # Tech stack grouped by category
│   ├── milestones.ts          # Journey timeline entries
│   └── blog/*.mdx              # Blog posts — EMPTY by default, see below
│
├── lib/
│   ├── blog.ts                # Reads & parses MDX files from src/content/blog
│   └── utils.ts                # cn() class-merging helper
│
└── types/content.ts            # TypeScript types for all content shapes
```

---

## Adding content

This is the part that matters most. Everything below is designed so you
never touch component code to add a real project or post.

### Adding a project

Open `src/content/projects.ts`. It currently exports an empty array with a
comment block explaining the shape. To add a project, add an object like
this to the `projects` array:

```ts
{
  slug: "my-project-slug",                  // used in the URL: /projects/my-project-slug
  title: "My Project Title",
  tagline: "One-line summary of what it does",
  category: "automation",                    // "automation" | "ai-agent" | "web-app" | "integration"
  status: "live",                            // "live" | "in-progress" | "archived" | "concept"
  year: 2026,
  featured: true,                             // true = appears in the homepage workflow canvas
  position: { x: 0, y: 0 },                   // canvas position, see below
  connectsTo: [],                             // slugs of other projects this flows into, or []
  stack: ["n8n", "Google Sheets"],            // shown as tags on the card
  links: [],                                  // optional: [{ label: "Live site", href: "https://..." }]
  caseStudy: {
    problem: "What problem this solves, 2-4 sentences.",
    process: [
      {
        id: "step-1",
        kind: "FORM TRIGGER",                 // shown as a small mono tag, e.g. the node type
        title: "Step title",
        description: "What happens in this step.",
      },
      // ...more steps
    ],
    stack: ["n8n", "Google Sheets API"],       // full tech list for the case study page
    outcome: "What shipped / the result, 2-4 sentences.",
    metrics: [{ label: "Time saved", value: "3 hrs/week" }],  // optional
    learnings: "What you'd do differently or what it taught you.",  // optional
  },
},
```

**That's it.** The project will automatically:
- Appear as a node on the homepage workflow canvas (if `featured: true`)
- Get its own page at `/projects/[slug]` with full SEO metadata
- Appear in the `/projects` index list
- Get added to `sitemap.xml`
- Open in the case-study slide-up panel when its node is clicked

**Positioning on the canvas** (`position: { x, y }`):
- `x` increases left → right. Use whole numbers like 0, 1, 2, 3.
- `y` controls the row. Use `0` for your main row; `1` or `-1` for a
  parallel branch. Keep the total y-range small (3 rows max looks best —
  the canvas container is a fixed height).
- `connectsTo: ["other-slug"]` draws a curved connector line from this
  project to another, showing the flow between them. Leave as `[]` if the
  project stands alone.

If you only want a project on the `/projects` list and not the homepage
canvas, set `featured: false`.

### Adding a blog post

Create a new `.mdx` file in `src/content/blog/`, e.g. `my-first-post.mdx`:

```mdx
---
title: "Your post title"
description: "One-sentence summary for the blog index and SEO."
date: "2026-06-23"
tags: ["n8n", "automation"]
---

Your content here, in regular Markdown. Headings, lists, links, code blocks,
and blockquotes are all styled automatically via `src/components/mdx/MDXComponents.tsx`.
```

Drop the file in, and it automatically appears on `/blog`, gets its own page
at `/blog/[slug]`, and is added to the sitemap. To unpublish a draft without
deleting it, add `draft: true` to the frontmatter.

### Updating your identity, stats, or "now building" line

All of this lives in `src/content/profile.ts` — one file, no hunting through
components. Update `nowBuilding` regularly; it's the live pulse line shown
in the dark band on the homepage.

### Updating the journey timeline

`src/content/milestones.ts`. Add new entries at the top of the array. Only
add a milestone once it has actually happened — this timeline is a
credibility signal, so keep it strictly factual.

### Updating your tech stack

`src/content/skills.ts`, grouped by category.

---

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build locally
npm run lint    # eslint
```

---

## Deployment (Vercel)

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Next.js** (auto-detected). No build command changes needed.
4. No environment variables are required for the current feature set —
   see `.env.example` for what to add later (contact form, analytics, CMS).
5. Click Deploy.
6. Once deployed, update the `siteUrl` constant in:
   - `src/app/layout.tsx`
   - `src/app/sitemap.ts`
   - `src/app/robots.ts`
   to match your actual production domain (defaults to `https://ifiokcolumba.dev`).
7. If you attach a custom domain in Vercel, update the same constant again
   to match it exactly — this affects canonical URLs, the sitemap, and OG tags.

### Fonts note

This build uses system font stacks (`Inter`, `-apple-system`, etc.) defined
in `src/app/globals.css`, rather than `next/font/google`, because the
sandbox this was built in had no network access to fonts.googleapis.com.
**If you want pixel-perfect Geist + JetBrains Mono** (recommended, and what
the design was originally art-directed for), swap back in two steps:

1. In `src/app/layout.tsx`, restore:
   ```ts
   import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";

   const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
   const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
   const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400","500","600"] });
   ```
   and add `${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable}` to the `<html>` className.
2. In `src/app/globals.css`, change the `--font-display`, `--font-body`, and
   `--font-mono` variables back to reference `var(--font-geist-sans)` /
   `var(--font-jetbrains-mono)` (the original values are noted in a comment
   right above those lines).

Vercel's build environment has normal internet access, so this works fine
once deployed — it only needed the system-font fallback inside this
particular sandboxed build environment.

---

## SEO & metadata

- Per-page metadata via Next.js `generateMetadata` (homepage, every project,
  every blog post).
- `sitemap.xml` and `robots.txt` are generated automatically from
  `src/app/sitemap.ts` / `robots.ts` and include every project and post.
- Dynamic OG image at `/opengraph-image` for social previews — regenerates
  automatically, no manual image exports needed.
- `PersonJsonLd` component injects schema.org `Person` structured data for
  richer search results.

---

## Design system reference

All design tokens live in `src/app/globals.css` under `:root`:

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#fafaf8` | Page background |
| `--canvas-raised` | `#ffffff` | Cards, panels |
| `--ink` | `#0a0a0a` | Primary text |
| `--ink-soft` | `#6b6f76` | Secondary text (WCAG AA verified, 4.8:1+) |
| `--line` / `--line-strong` | `#edede8` / `#d8d8d2` | Borders |
| `--signal-violet/teal/amber` | gradient accent | Used once per view, never as a fill |
| `--status-live` | `#16a34a` | "Live" / active status indicators only |

The `.label-mono` utility class is the recurring mono-uppercase label style
used for eyebrows, status tags, and node-kind labels throughout the site —
apply it rather than redefining the styles inline.

---

## Future-growth notes

This was deliberately built so each of these is a small, contained change:

- **New project category or status**: extend the union types in
  `src/types/content.ts`, then add the matching label/color in
  `WorkflowNode.tsx` and the `/projects` page.
- **Outgrowing local content files**: every content shape already has a
  matching TypeScript interface in `src/types/content.ts`. Swapping the data
  source for a headless CMS means writing one fetch function per content
  type and keeping the same shape — no component changes required.
- **Adding a real contact form**: wire a Next.js API route (or a service
  like Resend) behind the existing `mailto:` link in `ContactSection.tsx`.
- **Analytics**: Vercel Analytics is a one-line add (`@vercel/analytics`)
  with zero environment variables needed.
