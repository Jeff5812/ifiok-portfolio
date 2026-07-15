"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { transition, viewportOnce } from "@/lib/motion";
import { openAssistant } from "@/components/assistant/open-assistant";

export default function AgentsSection() {
  const agents = profile.agents ?? {
    title: "AI Agents",
    tagline: "",
    blurb: "",
    features: [] as string[],
  };

  return (
    <section id="agents" className="scroll-mt-16">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={transition(0)}
        >
          <h2 className="text-2xl font-medium tracking-tight text-ink mb-2">
            {agents.title}
          </h2>
          {agents.tagline && (
            <p className="label-mono mb-8 max-w-md text-ink-soft">{agents.tagline}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={transition(0.08)}
          className="mb-8 overflow-hidden rounded-2xl border border-line bg-canvas-raised text-left shadow-sm"
        >
          <button
            type="button"
            onClick={() => openAssistant(undefined, "agents")}
            aria-label="Open the AI assistant"
            className="block w-full border-b border-line px-4 py-3 text-left transition-colors hover:bg-canvas"
          >
            <p className="text-sm font-medium text-ink">New AI chat</p>
          </button>

          <div className="space-y-4 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-line text-[10px] label-mono">
                {profile.initials}
              </div>
              <p className="text-sm text-ink-soft">How can I help you today?</p>
            </div>
            <div className="space-y-2 pl-10">
              {["Route this lead", "Score eligibility", "Summarize document", "Process application"].map(
                (action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => openAssistant(action, "agents")}
                    aria-label={`Ask the AI assistant: ${action}`}
                    className="block w-full rounded-lg border border-line px-3 py-2 text-left text-sm text-ink/80 transition-colors hover:border-line-strong hover:bg-canvas hover:text-ink"
                  >
                    {action}
                  </button>
                ),
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => openAssistant()}
            aria-label="Open the AI assistant"
            className="block w-full border-t border-line px-4 py-3 text-left transition-colors hover:bg-canvas"
          >
            <div className="flex items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2">
              <span className="label-mono text-ink-soft">Strategy doc</span>
              <span className="ml-auto text-xs text-ink-soft">↵</span>
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
