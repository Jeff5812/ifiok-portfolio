"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import { LAB_FIELDS, buildSimulatedOutcome, LENDING_FIELDS, buildLendingOutcome } from "./chatData";

type Msg = { from: "bot" | "user"; text: string };
type Mode =
  | "menu"
  | "menu-projects"
  | "project"
  | "lab-demo"
  | "lab-done"
  | "lending-demo"
  | "lending-done"
  | "booking"
  | "booking-done";

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
  const [labData, setLabData] = useState<Record<string, string>>({});
  const [bookingData, setBookingData] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

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
  }, [messages, mode, step]);

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
          "Hey, I'm the IC Assistant. I can walk you through what Ifiok has built, let you try one of the real workflows yourself, or help you start a project. What would you like to do?",
      },
    ]);
    setMode("menu");
  }

  function backToMenu() {
    pushBot("Sure, what would you like to do next?");
    setMode("menu");
    setStep(0);
  }

  function startProject(slug: string) {
    const p = projects.find((x) => x.slug === slug) ?? projects[0];
    setProjectSlug(p.slug);
    pushUser(`Tell me about "${p.title}"`);
    pushBot(
      `**${p.title}**\n\nProblem: ${p.problem}\n\nSolution: ${p.solution}\n\nTech stack: ${p.stack.join(", ")}\n\nOutcome: ${p.outcome}`
    );
    setMode("project");
  }

  function startLabDemo() {
    pushUser("Let me try the Lab Result Follow-Up workflow");
    pushBot(
      "Great, this is the exact intake form the clinic workflow uses. I'll ask for the same fields, one at a time. Nothing you enter here is sent anywhere or emailed to anyone, it's a sandboxed replay so you can see how the automation decides what happens next."
    );
    setLabData({});
    setStep(0);
    setMode("lab-demo");
    askLabField(0);
  }

  function askLabField(i: number) {
    const f = LAB_FIELDS[i];
    if (!f) return;
    pushBot(f.label + (f.optional ? " (optional, you can skip this)" : ""));
  }

  function submitLabField(rawValue: string) {
    const f = LAB_FIELDS[step];
    const value = rawValue.trim();
    if (!value && !f.optional) {
      pushBot("This one's required in the real form, mind giving me a value?");
      return;
    }
    if (value) pushUser(value);
    else pushUser("(skipped)");

    const next = { ...labData, [f.key]: value };
    setLabData(next);
    setInputValue("");

    const nextIndex = step + 1;
    if (nextIndex < LAB_FIELDS.length) {
      setStep(nextIndex);
      askLabField(nextIndex);
    } else {
      const { ref, isCritical, cadence } = buildSimulatedOutcome(next);
      pushBot(
        `Got it, here's what the real workflow would do with this:\n\n` +
          `Lab reference: ${ref}\n` +
          `Flagged: ${isCritical ? "CRITICAL" : "routine"}\n\n` +
          `Notification cadence:\n${cadence.map((c) => "• " + c).join("\n")}\n\n` +
          `That's the same branching logic (critical vs. routine) and escalation-to-CHW path used in the live n8n workflow, just replayed here without sending any real emails.`
      );
      setMode("lab-done");
    }
  }

  function startLendingDemo() {
    pushUser("Let me try the Micro-Lending risk scoring");
    pushBot(
      "This mirrors the AI agent that scores real delinquent accounts every morning. Give me a few details about a hypothetical account and I'll show you the risk tier, confidence, and action it would trigger. Nothing here touches your real database or sends anything."
    );
    setLabData({});
    setStep(0);
    setMode("lending-demo");
    pushBot(LENDING_FIELDS[0].label);
  }

  function submitLendingField(rawValue: string) {
    const f = LENDING_FIELDS[step];
    const value = rawValue.trim();
    if (!value) {
      pushBot("Go ahead and fill this one in so I can score the account.");
      return;
    }
    pushUser(value);
    const next = { ...labData, [f.key]: value };
    setLabData(next);
    setInputValue("");

    const nextIndex = step + 1;
    if (nextIndex < LENDING_FIELDS.length) {
      setStep(nextIndex);
      pushBot(LENDING_FIELDS[nextIndex].label);
    } else {
      const { riskTier, confidence, action } = buildLendingOutcome(next);
      pushBot(
        `Here's how the Risk & Sentiment Agent would score this:\n\n` +
          `Risk tier: ${riskTier.toUpperCase()}\n` +
          `AI confidence: ${confidence.toFixed(2)}\n\n` +
          `Action: ${action}\n\n` +
          `That's the same routing logic (confidence gate → risk-tier branch → channel) as the live workflow.`
      );
      setMode("lending-done");
    }
  }

  function startBooking() {
    pushUser("I'd like to work together");
    pushBot(
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
      pushBot(BOOKING_FIELDS[nextIndex].label);
    } else {
      pushBot("Sending that over to Ifiok now…");
      if (BOOKING_WEBHOOK_URL) {
        try {
          await fetch(BOOKING_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
        } catch {
          // fail silently, confirmation copy below is unconditional
        }
      }
      pushBot(
        `Thanks, ${next.name.split(" ")[0]}, that's in. Ifiok will get back to you at ${next.email} within a day or two. If it's urgent, mention that in a follow-up message here.`
      );
      setMode("booking-done");
    }
  }

  function renderMarkdownish(text: string) {
    // Minimal bold (**text**) + line break support, no HTML injection.
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

  function startDemoForSlug(slug: string | null) {
    if (slug === "micro-lending-collection") startLendingDemo();
    else startLabDemo();
  }

  const currentLabField = mode === "lab-demo" ? LAB_FIELDS[step] : null;
  const currentLendingField = mode === "lending-demo" ? LENDING_FIELDS[step] : null;
  const currentBookingField = mode === "booking" ? BOOKING_FIELDS[step] : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            bottom: "max(96px, calc(env(safe-area-inset-bottom) + 92px))",
            right: "max(20px, env(safe-area-inset-right))",
            zIndex: 2147482999,
          }}
          className="flex h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
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
                  onClick={startLabDemo}
                  className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                >
                  Try the Lab Follow-Up demo
                </button>
                <button
                  onClick={startLendingDemo}
                  className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                >
                  Try the Micro-Lending risk scoring
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
                {projects.find((p) => p.slug === projectSlug)?.demoInChat && (
                  <button onClick={() => startDemoForSlug(projectSlug)} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                    Try this workflow
                  </button>
                )}
                <button onClick={startBooking} className="btn-primary focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-white">
                  Book a call
                </button>
                <button onClick={backToMenu} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                  Back to menu
                </button>
              </div>
            )}

            {mode === "lab-demo" && currentLabField && currentLabField.type === "select" && (
              <div className="flex flex-wrap gap-2">
                {currentLabField.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => submitLabField(opt)}
                    className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {mode === "lab-demo" && currentLabField && currentLabField.type !== "select" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitLabField(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type={currentLabField.type === "textarea" ? "text" : currentLabField.type}
                  placeholder={currentLabField.label}
                  className="focus-ring w-full rounded-full border border-line bg-panel2 px-3.5 py-2 text-sm outline-none placeholder:text-inkSoft"
                />
                <button type="submit" className="btn-primary focus-ring rounded-full px-4 py-2 text-xs font-medium text-white">
                  Send
                </button>
              </form>
            )}

            {mode === "lending-demo" && currentLendingField && currentLendingField.type === "select" && (
              <div className="flex flex-wrap gap-2">
                {currentLendingField.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => submitLendingField(opt)}
                    className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {mode === "lending-demo" && currentLendingField && currentLendingField.type !== "select" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitLendingField(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type={currentLendingField.type === "number" ? "number" : "text"}
                  placeholder={currentLendingField.label}
                  className="focus-ring w-full rounded-full border border-line bg-panel2 px-3.5 py-2 text-sm outline-none placeholder:text-inkSoft"
                />
                <button type="submit" className="btn-primary focus-ring rounded-full px-4 py-2 text-xs font-medium text-white">
                  Send
                </button>
              </form>
            )}

            {mode === "lending-done" && (
              <div className="flex flex-wrap gap-2">
                <button onClick={startBooking} className="btn-primary focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-white">
                  Book a call
                </button>
                <button onClick={backToMenu} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                  Back to menu
                </button>
              </div>
            )}

            {mode === "lab-done" && (
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
              <div className="flex flex-wrap gap-2">
                <button onClick={backToMenu} className="btn-ghost focus-ring rounded-full border border-line px-3 py-1.5 text-xs">
                  Back to menu
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
