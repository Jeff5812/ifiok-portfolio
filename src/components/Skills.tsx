"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandIcon } from "./BrandIcon";

// Each skill links to the project that actually demonstrates it. Kept as a
// dedicated list here rather than a separate content file since it's small
// and only used by this component; move it into src/content/skills.ts if it
// grows or needs to be reused elsewhere.
type Skill = {
  name: string;
  slug: string; // project slug, from src/content/projects.ts
  icon: string; // must match a key in BrandIcon.tsx (LOGO_FILES or FALLBACK_ICON)
};

type SkillGroup = {
  label: string;
  items: Skill[];
};

const GROUPS: SkillGroup[] = [
  {
    label: "Automation",
    items: [
      { name: "n8n workflow orchestration", slug: "meridian-scheduling-agent", icon: "n8n" },
      { name: "MCP tool servers", slug: "meridian-scheduling-agent", icon: "mcp servers" },
      { name: "Webhook design", slug: "meridian-scheduling-agent", icon: "webhooks" },
      { name: "Retry logic & idempotency", slug: "meridian-scheduling-agent", icon: "idempotency" },
    ],
  },
  {
    label: "AI & agents",
    items: [
      { name: "AI agent design (Gemini)", slug: "meridian-scheduling-agent", icon: "gemini" },
      { name: "RAG pipelines", slug: "stripe-docs-support-bot", icon: "gemini" },
      { name: "Structured output parsing", slug: "invoice-intake-anomaly-detection", icon: "gemini" },
      { name: "Lead scoring logic", slug: "ai-lead-scoring-and-routing", icon: "gemini" },
      { name: "Prompt engineering", slug: "stripe-docs-support-bot", icon: "prompt engineering" },
    ],
  },
  {
    label: "Data & storage",
    items: [
      { name: "PostgreSQL & Supabase", slug: "meridian-scheduling-agent", icon: "postgresql" },
      { name: "SQL constraints & triggers", slug: "meridian-scheduling-agent", icon: "postgresql" },
      { name: "Vector search (pgvector)", slug: "stripe-docs-support-bot", icon: "supabase" },
      { name: "Gmail & Google Sheets API", slug: "invoice-intake-anomaly-detection", icon: "gmail" },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="label-mono text-brand-from">Skills</div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">What I work with</h2>
        <p className="mt-2 max-w-xl text-sm text-inkSoft">
          Each one links to the project that actually proves it, not just a claim.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: gi * 0.05 }}
            >
              <div className="label-mono text-inkSoft">{g.label}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((skill) => (
                  <Link
                    key={skill.name}
                    href={`/projects/${skill.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-3.5 py-2 text-[13px] text-inkSoft transition-colors hover:border-brand-from/50 hover:text-ink hover:-translate-y-0.5"
                  >
                    <BrandIcon name={skill.icon} size={16} />
                    {skill.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
