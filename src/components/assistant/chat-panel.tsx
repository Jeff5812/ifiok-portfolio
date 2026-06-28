"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "user" | "assistant";
export type ChatMessage = { id: string; role: Role; content: string };

export type LeadPayload = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

export type LeadResult = { ok: true } | { ok: false; error: string };

type ChatPanelProps = {
  title?: string;
  initialMessages?: ChatMessage[];
  /** Receives the new message plus prior turns (oldest → newest) for context. */
  onSend?: (text: string, history: ChatMessage[]) => Promise<string> | string;
  onSubmitLead?: (payload: LeadPayload) => Promise<LeadResult>;
  /** A message to send automatically the moment it's set (e.g. a quick-action
   * clicked elsewhere on the page opened this panel with a specific ask). */
  pendingPrompt?: string | null;
  onPendingPromptConsumed?: () => void;
};

const QUICK_REPLIES = [
  "What's your tech stack?",
  "What problems can AI agents solve for a business?",
  "Are you available for freelance work?",
  "What's the best way to start working together?",
] as const;

const START_PROJECT_CHIP = "Start a project →";

const PROJECT_TYPES = [
  "Workflow automation (n8n)",
  "AI agent system",
  "Not sure yet",
] as const;

// Loose, intentionally generous match, false positives just mean we offer
// the form a little eagerly, which is harmless; false negatives mean a real
// lead never sees it, which isn't worth risking for precision.
const LEAD_INTENT = /\b(hire|hiring|quote|freelance|budget|collab|consult|work together|build (me|us|this)|looking for (a |an )?(dev|developer|automation|agent)|need (this|something) (built|automated)|available for work)\b/i;

type LeadStatus = "idle" | "offered" | "open" | "submitting" | "done" | "error";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatPanel({
  title = "Columba AI chat",
  initialMessages,
  onSend,
  onSubmitLead,
  pendingPrompt,
  onPendingPromptConsumed,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages ?? [
      {
        id: uid(),
        role: "assistant",
        content: "How can I help you today?",
      },
    ],
  );
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadError, setLeadError] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadPayload>({
    name: "",
    email: "",
    projectType: PROJECT_TYPES[0],
    message: "",
  });

  const canSend = value.trim().length > 0 && !busy;
  const chips = useMemo(() => [...QUICK_REPLIES, START_PROJECT_CHIP], []);

  useEffect(() => {
    if (!pendingPrompt) return;
    void send(pendingPrompt);
    onPendingPromptConsumed?.();
    // Intentionally re-fires only when pendingPrompt itself changes, send()
    // and onPendingPromptConsumed are stable enough in practice here, and
    // including them would re-fire this on every parent re-render instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt]);

  function pushMessage(role: Role, content: string) {
    setMessages((m) => [...m, { id: uid(), role, content }]);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const history = messages;
    pushMessage("user", trimmed);
    setValue("");

    if (!onSend) return;

    setBusy(true);
    try {
      const result = await onSend(trimmed, history);
      pushMessage("assistant", typeof result === "string" ? result : String(result));

      if (leadStatus === "idle" && LEAD_INTENT.test(trimmed)) {
        setLeadStatus("offered");
      }
    } finally {
      setBusy(false);
    }
  }

  function startProject() {
    pushMessage("user", "Start a project");
    pushMessage("assistant", "Happy to help, a few quick details and I'll pass it straight along.");
    setLead((l) => ({ ...l, message: l.message || "" }));
    setLeadStatus("open");
  }

  function dismissLeadOffer() {
    setLeadStatus("idle");
  }

  async function submitLead() {
    if (!onSubmitLead) return;
    if (!lead.name.trim() || !lead.email.trim() || !lead.message.trim()) {
      setLeadError("Name, email, and a short message all help, mind filling those in?");
      return;
    }
    setLeadError(null);
    setLeadStatus("submitting");
    const result = await onSubmitLead(lead);
    if (result.ok) {
      setLeadStatus("done");
      pushMessage("assistant", "Thanks, I've passed this along. You'll hear back soon.");
    } else {
      setLeadStatus("error");
      setLeadError(result.error);
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-line bg-canvas-raised shadow-sm">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-medium text-ink">{title}</p>
        <span className="label-mono text-ink-soft">{busy ? "Thinking" : "Ready"}</span>
      </div>

      <div className="max-h-[340px] space-y-3 overflow-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl bg-ink px-3 py-2 text-sm text-canvas"
                  : "max-w-[85%] rounded-2xl border border-line bg-canvas px-3 py-2 text-sm text-ink/80"
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {leadStatus === "offered" && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink/80">
              <p className="mb-2">Want me to pass this along so Ifiok can follow up directly?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLeadStatus("open")}
                  className="label-mono rounded-full bg-ink px-3 py-1.5 text-canvas transition-opacity hover:opacity-90"
                >
                  Share details
                </button>
                <button
                  type="button"
                  onClick={dismissLeadOffer}
                  className="label-mono rounded-full border border-line px-3 py-1.5 text-ink-soft transition-colors hover:bg-canvas-raised"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {(leadStatus === "open" || leadStatus === "submitting" || leadStatus === "error") && (
        <div className="space-y-3 border-t border-line px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="label-mono text-ink-soft">Project details</p>
            <button
              type="button"
              onClick={dismissLeadOffer}
              className="label-mono text-ink-soft transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={lead.name}
              onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
              placeholder="Your name"
              className="h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-line-strong"
            />
            <input
              value={lead.email}
              onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
              placeholder="Email"
              type="email"
              className="h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-line-strong"
            />
          </div>

          <select
            value={lead.projectType}
            onChange={(e) => setLead((l) => ({ ...l, projectType: e.target.value }))}
            className="h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-line-strong"
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <textarea
            value={lead.message}
            onChange={(e) => setLead((l) => ({ ...l, message: e.target.value }))}
            placeholder="What are you trying to build or automate?"
            rows={2}
            className="w-full resize-none rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-line-strong"
          />

          {leadError && <p className="text-xs text-signal-amber">{leadError}</p>}

          <button
            type="button"
            onClick={submitLead}
            disabled={leadStatus === "submitting"}
            className="h-10 w-full rounded-lg bg-ink text-sm font-medium text-canvas transition-opacity disabled:opacity-50"
          >
            {leadStatus === "submitting" ? "Sending…" : "Send to Ifiok"}
          </button>
        </div>
      )}

      <div className="border-t border-line px-4 py-3">
        <div className="flex flex-wrap gap-2 pb-3">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={busy}
              onClick={() => (chip === START_PROJECT_CHIP ? startProject() : send(chip))}
              className="label-mono rounded-full border border-line px-2.5 py-1 text-ink-soft transition-colors hover:bg-canvas disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(value);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about my stack, work, or availability…"
            className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-line-strong"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="h-11 shrink-0 rounded-xl bg-ink px-4 text-sm font-medium text-canvas transition-opacity disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
