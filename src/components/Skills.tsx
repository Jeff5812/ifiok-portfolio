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
  {
    label: "Recent workflow patterns",
    items: [
      "Form-triggered intake pipelines",
      "Critical vs. routine branching logic",
      "Multi-stage reminder & escalation cadences",
      "AI risk / sentiment scoring with confidence gating",
      "Webhook-based confirmation flows",
      "Postgres record tracking & audit trails",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="label-mono text-brand-from">Skills</div>
        <h2 className="mt-2 font-mono text-3xl font-bold">What I work with</h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: gi * 0.05 }}
            >
              <div className="label-mono text-inkSoft">{g.label}</div>
              {g.label === "Recent workflow patterns" ? (
                <ul className="mt-3 space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="text-sm text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <ToolChip key={item} name={item} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
