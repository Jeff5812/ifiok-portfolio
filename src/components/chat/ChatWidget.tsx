"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import { HOW_IT_WORKS, PROCESS_STEPS } from "./chatData";

type Msg = { from: "bot" | "user"; text: string };
type Mode = "menu" | "menu-projects" | "project" | "booking" | "booking-done";

const BOOKING_WEBHOOK_URL = process.env.NEXT_PUBLIC_BOOKING_WEBHOOK_URL || "";

const BOOKING_FIELDS = [
  { key: "name", label: "Your name", type: "text" as const },
  { key: "email", label: "Your email", type: "email" as const },
  {
    key: "projectType",
    label: "What kind of project is this?",
    type: "select" as const,
    options: [...projects.map((p) => p.title), "Something else"],
  },
  { key: "message", label: "A quick summary of what you need", type: "textarea" as const },
];

export default function ChatWidget({
  open,
  onClose,
  intent,
}: {
  open: boolean;
  onClose: () => void;
  intent?: string | null;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [mode, setMode] = useState<Mode>("menu");
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [bookingData, setBookingData] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (open && !initializedRef.current) {
      initializedRef.current = true;
      greet();
      if (intent === "booking") startBooking();
      else if (intent?.startsWith("project:")) {
        const slug = intent.split(":")[1];
        startProject(slug);
      }
    }
    if (!open) initializedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mode, step, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  function pushBot(text: string) {
    setMessages((m) => [...m, { from: "bot", text }]);
  }
  function pushUser(text: string) {
    setMessages((m) => [...m, { from: "user", text }]);
  }

  function greet() {
    setMessages([
      {
        from: "bot",
        text:
          "Hi, I'm the IC Assistant. Ask me anything about Ifiok, how his workflows work, or his past projects, or use the buttons below to see what he's built or start a project.",
      },
    ]);
    setMode("menu");
  }

  function queueBotReply(text: string, delay = 700) {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(true);
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
      pushBot(text);
      typingTimeoutRef.current = null;
    }, delay);
  }

  function backToMenu() {
    queueBotReply("Sure, what would you like to do next?");
    setMode("menu");
    setStep(0);
  }

  function startProject(slug: string) {
    const p = projects.find((x) => x.slug === slug) ?? projects[0];
    setProjectSlug(p.slug);
    pushUser(`Tell me about "${p.title}"`);
    queueBotReply(
      `**${p.title}**\n\nIn plain terms: ${p.tagline}\n\nThe problem: ${p.problem}\n\nHow it works: ${p.solution}\n\nThe result: ${p.outcome}`
    );
    setMode("project");
  }

  function explainHowItWorks() {
    pushUser("How does this actually work?");
    queueBotReply(
      HOW_IT_WORKS +
        "\n\nHis usual process:\n" +
        PROCESS_STEPS.map((s, i) => `${i + 1}. ${s}`).join("\n")
    );
    setMode("menu");
  }

  function startBooking() {
    pushUser("I'd like to work together");
    queueBotReply(
      "Nice, let's get the basics so Ifiok can follow up properly. First, what's your name?"
    );
    setBookingData({});
    setStep(0);
    setMode("booking");
  }

  async function submitBookingField(rawValue: string) {
    const f = BOOKING_FIELDS[step];
    const value = rawValue.trim();
    if (!value) {
      pushBot("I'll need something here to pass along, go ahead and fill this in.");
      return;
    }
    pushUser(value);
    const next = { ...bookingData, [f.key]: value };
    setBookingData(next);
    setInputValue("");

    const nextIndex = step + 1;
    if (nextIndex < BOOKING_FIELDS.length) {
      setStep(nextIndex);
      queueBotReply(BOOKING_FIELDS[nextIndex].label);
    } else {
      queueBotReply("Sending that over to Ifiok now…");
      if (BOOKING_WEBHOOK_URL) {
        try {
          await fetch(BOOKING_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
        } catch {
          // fail silently
        }
      }
      queueBotReply(
        `Thanks, ${next.name.split(" ")[0]}, that's in. Ifiok will get back to you at ${next.email} within a day or two. If it's urgent, mention that in a follow-up message here.`
      );
      setMode("booking-done");
    }
  }

  async function handleFreeText(raw: string) {
    const value = raw.trim();
    if (!value) return;
    pushUser(value);
    setInputValue("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: value }] }),
      });

      if (!response.ok) throw new Error("Chat API failed");

      const data = await response.json();
      const reply = data.reply?.trim();

      if (reply) {
        queueBotReply(reply);
      } else {
        queueBotReply(
          "I’m having trouble reaching the AI service right now. Please try again in a moment."
        );
      }
    } catch {
      queueBotReply(
        "I’m having trouble reaching the AI service right now. Please try again in a moment."
      );
    }
  }

  function renderMarkdownish(text: string) {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
          chunk.startsWith("**") && chunk.endsWith("**") ? (
            <strong key={j}>{chunk.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{chunk}</span>
          )
        )}
        <br />
      </span>
    ));
  }

  const currentBookingField = mode === "booking" ? BOOKING_FIELDS[step] : null;
  const showFreeTextInput = mode === "menu" || mode === "menu-projects" || mode === "project" || mode === "booking-done";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: "max(96px, calc(env(safe-area-inset-bottom) + 92px))",
            right: "max(16px, env(safe-area-inset-right))",
            left: "max(16px, env(safe-area-inset-left))",
            maxHeight: "calc(100vh - 140px)",
            zIndex: 2147482999,
          }}
          className="mx-auto flex h-[560px] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl sm:left-auto sm:w-[92vw]"
          role="dialog"
          aria-label="IC Assistant chat"
        >
          <div className="flex items-center justify-between border-b border-line bg-panel2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                IC
              </div>
              <div>
                <div className="text-sm font-semibold">IC Assistant</div>
                <div className="text-[11px] text-inkSoft">Usually replies instantly</div>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="focus-ring rounded-md p-1 text-inkSoft hover:text-ink"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="scrollbar-none flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.from === "bot"
                    ? "bg-panel2 text-ink"
                    : "ml-auto bg-brand-gradient text-white"
                }`}
              >
                {renderMarkdownish(m.text)}
              </div>
            ))}

            {isTyping && (
              <div className="max-w-[85%] rounded-2xl bg-panel2 px-3.5 py-2.5 text-sm text-ink">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-inkSoft">
                    IC Assistant is typing
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-inkSoft"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: dot * 0.12 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line p-3">
            {mode === "menu" && (
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                  onClick={() => {
                    pushUser("Show me what you've built");
                    pushBot("Here's what I've shipped so far, pick one:");
                    setMode("menu-projects");
                  }}
                >
                  See what I&apos;ve built
                </button>
                <button
                  onClick={explainHowItWorks}
                  className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                >
                  How does this work?
                </button>
                <button
                  onClick={startBooking}
                  className="btn-primary focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-white"
                >
                  Book a call
                </button>
              </div>
            )}

            {mode === "menu-projects" && (
              <div className="flex flex-wrap gap-2">
                {projects.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => startProject(p.slug)}
                    className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                  >
                    {p.title}
                  </button>
                ))}
                <button onClick={backToMenu} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                  Back
                </button>
              </div>
            )}

            {mode === "project" && (
              <div className="flex flex-wrap gap-2">
                <button onClick={startBooking} className="btn-primary focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-white">
                  Book a call
                </button>
                <button onClick={backToMenu} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                  Back to menu
                </button>
              </div>
            )}

            {mode === "booking" && currentBookingField && currentBookingField.type === "select" && (
              <div className="flex flex-wrap gap-2">
                {currentBookingField.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => submitBookingField(opt)}
                    className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {mode === "booking" && currentBookingField && currentBookingField.type !== "select" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitBookingField(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type={currentBookingField.type === "textarea" ? "text" : currentBookingField.type}
                  placeholder={currentBookingField.label}
                  className="focus-ring w-full rounded-full border border-line bg-panel2 px-3.5 py-2 text-sm outline-none placeholder:text-inkSoft"
                />
                <button type="submit" className="btn-primary focus-ring rounded-full px-4 py-2 text-xs font-medium text-white">
                  Send
                </button>
              </form>
            )}

            {mode === "booking-done" && (
              <button onClick={backToMenu} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                Back to menu
              </button>
            )}

            {showFreeTextInput && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFreeText(inputValue);
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="text"
                  placeholder="Or just type a question…"
                  className="focus-ring w-full rounded-full border border-line bg-panel2 px-3.5 py-2 text-sm outline-none placeholder:text-inkSoft"
                />
                <button type="submit" className="btn-primary focus-ring rounded-full px-4 py-2 text-xs font-medium text-white">
                  Ask
                </button>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}