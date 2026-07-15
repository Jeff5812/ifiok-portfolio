"use client";

import { motion } from "framer-motion";
import { UserCheck, FileText, GitBranch, Workflow, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { transition, viewportOnce } from "@/lib/motion";
import { openAssistant } from "@/components/assistant/open-assistant";

// Icon lookup keyed by service label, kept separate from content data so
// profile.ts stays plain data with no JSX/component imports in it.
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Lead Qualification": UserCheck,
  "Document Processing": FileText,
  "Decision Automation": GitBranch,
  "Workflow Orchestration": Workflow,
};

export default function ServicesSection() {
  const { title, tagline, items } = profile.services;

  return (
    <section id="services" className="scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={transition(0)}
        className="mb-8"
      >
        <h2 className="text-2xl font-medium tracking-tight text-ink mb-2">{title}</h2>
        {tagline && <p className="label-mono max-w-md text-ink-soft">{tagline}</p>}
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const Icon = ICONS[item.label] ?? Workflow;
          return (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => openAssistant(item.prompt)}
              aria-label={`Ask the AI assistant about ${item.label}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={transition(0.06 + i * 0.06)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-line bg-canvas-raised p-5 text-left shadow-sm transition-colors hover:border-line-strong"
            >
              {/* Soft signal-gradient glow that sweeps in on hover, echoes the brand accent without becoming a background fill. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,var(--signal-violet)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-20"
              />

              <motion.span
                whileHover={{ rotate: -6, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-ink"
              >
                <Icon className="h-4.5 w-4.5" />
              </motion.span>

              <div className="min-w-0 flex-1">
                <p className="label-mono text-ink mb-1">{item.label}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{item.description}</p>
              </div>

              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
