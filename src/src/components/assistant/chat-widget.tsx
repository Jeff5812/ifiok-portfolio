"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ChatPanel, { type ChatMessage, type LeadPayload, type LeadResult } from "@/components/assistant/chat-panel";
import BrandMark from "@/components/ui/BrandMark";
import { OPEN_ASSISTANT_EVENT, type OpenAssistantDetail } from "@/components/assistant/open-assistant";

// Used only if the live API isn't configured yet (no API key set) or a
// request fails — keeps the widget usable during local dev / before launch
// instead of showing a dead end.
function mockReply(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("stack")) {
    return "Stack: n8n, Next.js, TypeScript, Supabase/Postgres, Tailwind, and AI models (Gemini/OpenAI) depending on the workflow.";
  }
  if (p.includes("project") || p.includes("work")) {
    return "Recent work is rendered in the workflow canvas. If you tell me what you're building, I'll suggest how I'd automate it.";
  }
  if (p.includes("available") || p.includes("availability")) {
    return "Yes — I'm currently open to work. Share what you need automated and your timeline.";
  }
  if (p.includes("reach") || p.includes("contact") || p.includes("email")) {
    return "Best way to reach me is email. Use the Contact section, or ask me here and I'll point you to the right link.";
  }
  return "I can answer questions about my stack, work, availability, and how to get in touch. What are you trying to ship?";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<OpenAssistantDetail>).detail;
      setOpen(true);
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
      // network/offline — fall through to the local fallback below.
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
        error: data?.error || "Couldn't send that just now — try the Contact section instead.",
      };
    } catch {
      return { ok: false, error: "Network hiccup — try the Contact section instead." };
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
