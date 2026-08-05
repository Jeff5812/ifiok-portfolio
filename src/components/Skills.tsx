"use client";

import { motion } from "framer-motion";
import { ToolChip } from "./ToolChip";

const GROUPS = [
  {
    label: "Automation",
    items: ["n8n", "Webhooks", "MCP servers", "Docker"],
  },
  {
    label: "AI & agents",
    items: ["OpenAI", "Claude", "Gemini", "AI agents", "Prompt engineering", "Chatbot design"],
  },
  {
    label: "Data & storage",
    items: ["PostgreSQL", "Supabase", "Google Workspace", "REST APIs"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="label-mono text-brand-from">Skills</div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">What I work with</h2>

        {/* 1 col mobile → 3 col from sm */}
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
                {g.items.map((item) => (
                  <ToolChip key={item} name={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
