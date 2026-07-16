"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ChatPanel, { type ChatMessage, type LeadPayload, type LeadResult } from "@/components/assistant/chat-panel";
import BrandMark from "@/components/ui/BrandMark";
import { OPEN_ASSISTANT_EVENT, type OpenAssistantDetail } from "@/components/assistant/open-assistant";

// Used only if the live API isn't configured yet (no API key set) or a
// request fails, keeps the widget usable during local dev / before launch
// instead of showing a dead end.
function mockReply(prompt: string) {
  const p = prompt.toLowerCase();

  // Specific quick-action prompts from AgentsSection get their own real
  // answer, not the generic catch-all, these are what visitors actually
  // click first, so they're the most important ones to get right.
  if (p.includes("route this lead") || (p.includes("route") && p.includes("lead"))) {
    return "Lead routing is a classic branching workflow: a form or webhook captures the lead, a scoring step (rule-based logic or an AI Agent node, depending on how messy the signal is) classifies it, then a Switch node sends it down the right path, hot leads to a CRM or Slack ping, warm leads to a nurture sequence, cold leads to a holding sheet. I've built this exact pattern in n8n with Gemini doing the judgment call on ambiguous leads.";
  }
  if (p.includes("score eligibility") || p.includes("eligibility")) {
    return "Eligibility scoring works best as explicit, auditable logic first, not a black box. I define the rules as discrete checks (thresholds, required fields, document completeness), run them through a Code node or Switch, and only bring in an AI Agent when the judgment genuinely can't be reduced to fixed rules. That order matters: it's the difference between a system you can explain to a stakeholder and one you have to trust blindly.";
  }
  if (p.includes("summarize document") || p.includes("summarize")) {
    return "Document summarization in my workflows usually sits at the end of a pipeline: pull the file (Google Drive, email attachment, upload), extract the text, then pass it to an AI model with a tightly scoped prompt so the summary actually matches what the next step needs, not a generic recap. I'd rather under-engineer the prompt and iterate than ship something verbose that nobody reads.";
  }
  if (p.includes("process application") || (p.includes("application") && p.includes("process"))) {
    return "Application processing is intake, validation, and routing stitched together: a structured form catches the data, a validation step checks completeness and eligibility before anything moves forward, and the result gets routed to the right outcome with the reasoning attached. I've built this pattern for an admissions-style use case, form intake through to a routed decision.";
  }

  // Most-specific multi-word phrases next, checked before any single
  // broad keyword (like "work" or "stack") that could appear inside them
  // and steal the match. Order here matters: a phrase containing "work"
  // must be checked before the generic p.includes("work") fallback below.
  if (p.includes("start working") || p.includes("work together") || p.includes("get started")) {
    return "Best way to start is just tell me what you're trying to automate, even roughly. I'll tell you honestly whether it's a good fit and what the first version would look like. Otherwise, email or the Contact section both reach me directly.";
  }
  if (p.includes("available") || p.includes("availability") || p.includes("freelance") || p.includes("hire")) {
    return "Yes, I'm currently open to work, freelance or full-time. Share what you need automated and your timeline and I'll tell you if it's something I can take on now.";
  }
  if (p.includes("reach") || p.includes("contact") || p.includes("email")) {
    return "Best way to reach me is email, or use the Contact section. Tell me what you're building here first if you want a head start on the conversation.";
  }
  if (p.includes("problem") && (p.includes("solve") || p.includes("business"))) {
    return "The problems I solve are the ones that eat a team's time without needing a person's judgment every step: lead qualification and routing, document intake and validation, eligibility checks, scheduled reporting that should already be in someone's inbox. I design the workflow to make the actual decision, not just move data between tools.";
  }
  if (p.includes("stack") || p.includes("tech")) {
    return "I lead with automation and AI: n8n for workflow orchestration, AI Agent nodes powered by Gemini or OpenAI for the steps that need real judgment, and Claude when a task calls for more careful reasoning.";
  }
  if (p.includes("project") || p.includes("portfolio") || p.includes("work")) {
    return "Recent work is rendered in the workflow canvas. If you tell me what you're building, I'll suggest how I'd automate it.";
  }

  return "I can walk you through my stack, recent work, how I approach automation problems, or availability, just ask. What are you trying to ship?";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [context, setContext] = useState<string | undefined>(undefined);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<OpenAssistantDetail>).detail;
      setOpen(true);
      setContext(detail?.context);
      if (detail?.prompt) setPendingPrompt(detail.prompt);
    }
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, []);

  const onSend = useCallback(async (text: string, history: ChatMessage[]) => {
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { content?: string } | null;
      if (res.ok && data?.content) {
        return data.content;
      }
    } catch {
      // network/offline, fall through to the local fallback below.
    }
    return mockReply(text);
  }, []);

  const onSubmitLead = useCallback(async (payload: LeadPayload): Promise<LeadResult> => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { ok: true };
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      return {
        ok: false,
        error: data?.error || "Couldn't send that just now, try the Contact section instead.",
      };
    } catch {
      return { ok: false, error: "Network hiccup, try the Contact section instead." };
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="mb-3 w-[min(420px,calc(100vw-2.5rem))]"
          >
            <ChatPanel
              title="New AI chat"
              onSend={onSend}
              onSubmitLead={onSubmitLead}
              pendingPrompt={pendingPrompt}
              context={context}
              onPendingPromptConsumed={() => setPendingPrompt(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {!open && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:inline-flex label-mono rounded-full border border-line bg-canvas-raised px-3 py-1.5 text-ink-soft shadow-sm"
            >
              Ask Columba
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          aria-label={open ? "Close assistant" : "Open assistant"}
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.08, rotate: open ? 0 : 6 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas shadow-sm ring-1 ring-line-strong ${
            open ? "" : "fab-ring"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
              >
                <X size={18} className="text-canvas" />
              </motion.span>
            ) : (
              <motion.span
                key="brand"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.18 }}
              >
                <BrandMark size={18} className="text-canvas" />
              </motion.span>
            )}
          </AnimatePresence>

          {!open && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-status-live"
            />
          )}
          <span className="sr-only">Columba AI assistant</span>
        </motion.button>
      </div>
    </div>
  );
}
