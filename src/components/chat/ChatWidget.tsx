"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";
import { useChat } from "./ChatContext";
import s from "./ChatWidget.module.css";

type Msg = { from: "bot" | "user"; text: string };
type Mode = "menu" | "projects" | "project" | "booking" | "done";

const BOOKING = [
  { key: "name", ask: "Nice! Let's get the basics so Ifiok can follow up properly. What's your name?", type: "text" },
  { key: "email", ask: "And the best email to reach you?", type: "email" },
  { key: "projectType", ask: "What kind of project is it?", type: "select" },
  { key: "message", ask: "In a sentence or two, what do you need?", type: "text" },
] as const;

const PROJECT_TYPES = ["An AI product or web app", "A WhatsApp or Telegram assistant", "Workflow automation (n8n)", "A full-time or contract role", "Something else"];

const GREETING =
  "Hi, I'm IC, Ifiok's AI assistant. Ask me anything about his work, how his systems work, or any of his projects. Or use the buttons to see what he's built or book a call.";

function projectSummary(slug: string): Msg[] {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return [];
  return [
    { from: "user", text: `Tell me about ${p.title}` },
    {
      from: "bot",
      text: `**${p.title}** (${p.status.label})\n\n${p.tagline}\n\n**The problem:** ${p.problem}\n\n**The result:** ${p.outcome}\n\nFull write-up: /projects/${p.slug}`,
    },
  ];
}

function initial(intent: string | null): { messages: Msg[]; mode: Mode } {
  const hello: Msg = { from: "bot", text: GREETING };
  if (intent === "booking") {
    return {
      messages: [hello, { from: "user", text: "I'd like to work together" }, { from: "bot", text: BOOKING[0].ask }],
      mode: "booking",
    };
  }
  if (intent?.startsWith("project:")) {
    return { messages: [hello, ...projectSummary(intent.slice(8))], mode: "project" };
  }
  return { messages: [hello], mode: "menu" };
}

/** Bold, paragraphs and site links; nothing else is interpreted. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className={s.line}>
          {line.split(/(\*\*[^*]+\*\*|\/projects\/[a-z0-9-]+)/g).map((chunk, j) => {
            if (chunk.startsWith("**") && chunk.endsWith("**")) return <strong key={j}>{chunk.slice(2, -2)}</strong>;
            if (/^\/projects\/[a-z0-9-]+$/.test(chunk))
              return (
                <a key={j} href={chunk}>
                  {chunk}
                </a>
              );
            return <span key={j}>{chunk}</span>;
          })}
        </span>
      ))}
    </>
  );
}

function Panel({ intent, hidden }: { intent: string | null; hidden: boolean }) {
  const { closeChat } = useChat();
  const [{ messages, mode }, setState] = useState(() => initial(intent));
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  const setMessages = (fn: (m: Msg[]) => Msg[]) => setState((st) => ({ ...st, messages: fn(st.messages) }));
  const setMode = (mode: Mode) => setState((st) => ({ ...st, mode }));
  const push = (m: Msg) => setMessages((ms) => [...ms, m]);
  const reply = (text: string, delay = 650) => {
    if (timer.current) window.clearTimeout(timer.current);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      push({ from: "bot", text });
    }, delay);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, mode]);

  useEffect(() => {
    if (!hidden) inputRef.current?.focus({ preventScroll: true });
  }, [hidden, mode, step]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const toMenu = () => {
    reply("Sure. What would you like to do next?");
    setMode("menu");
    setStep(0);
  };

  const startBooking = () => {
    push({ from: "user", text: "I'd like to work together" });
    reply(BOOKING[0].ask);
    setBooking({});
    setStep(0);
    setMode("booking");
  };

  const showProject = (slug: string) => {
    const [user, bot] = projectSummary(slug);
    if (!user || !bot) return;
    push(user);
    reply(bot.text, 500);
    setMode("project");
  };

  const howItWorks = () => {
    push({ from: "user", text: "How does Ifiok build things?" });
    reply(
      "**The AI suggests; the code decides.** A model reads the message or screenshot and proposes what should happen. Code with no AI in it checks that against the rules, and the database enforces what can't be broken (like double bookings or overselling).\n\nWhen the system isn't sure, it asks the customer or hands the case to a person. Everything is measured with tests and evaluations, and each project says plainly how finished it is.\n\nHe builds with AI coding agents, writing the product's rules first and verifying their work with tests and live checks.",
    );
  };

  const submitBooking = async (raw: string) => {
    const field = BOOKING[step]!;
    const value = raw.trim();
    if (!value) return;
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      reply("That email doesn't look quite right. Could you check it?", 300);
      return;
    }
    push({ from: "user", text: value });
    setInput("");
    const next = { ...booking, [field.key]: value };
    setBooking(next);
    if (step + 1 < BOOKING.length) {
      setStep(step + 1);
      reply(BOOKING[step + 1]!.ask);
      return;
    }
    setMode("done");
    setTyping(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      setTyping(false);
      if (!res.ok) throw new Error(String(res.status));
      push({
        from: "bot",
        text: `Thanks, ${next.name!.split(" ")[0]}. That's with Ifiok now, and he'll reply to ${next.email}. If it's urgent, you can also email ${SITE.email}.`,
      });
    } catch {
      setTyping(false);
      push({
        from: "bot",
        text: `Sorry, I couldn't send that just now, so nothing was delivered. Please email Ifiok directly at ${SITE.email} and he'll get back to you.`,
      });
    }
  };

  const ask = async (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    const history = [...messages, { from: "user" as const, text: value }];
    push({ from: "user", text: value });
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-10).map((m) => ({ role: m.from === "bot" ? "assistant" : "user", content: m.text })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      setTyping(false);
      if (!res.ok || !data.reply) throw new Error("no reply");
      push({ from: "bot", text: data.reply });
    } catch {
      setTyping(false);
      push({
        from: "bot",
        text: `I can't reach the AI service right now. You can still browse the projects below, or email Ifiok at ${SITE.email}.`,
      });
    }
  };

  const field = mode === "booking" ? BOOKING[step] : null;

  return (
    <div
      className={s.panel}
      role="dialog"
      aria-label="IC, Ifiok's AI assistant"
      hidden={hidden}
      onKeyDown={(e) => e.key === "Escape" && closeChat()}
    >
      <header className={s.head}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/3d/mascot.webp" alt="" className={s.avatar} width={44} height={44} />
        <div>
          <p className={s.name}>IC</p>
          <p className={s.sub}>
            <span className={s.online} aria-hidden /> Ifiok&rsquo;s AI assistant
          </p>
        </div>
        <button type="button" className={s.close} onClick={closeChat} aria-label="Close the assistant">
          ✕
        </button>
      </header>

      <div ref={scrollRef} className={s.messages} aria-live="polite">
        {messages.map((m, i) => (
          <p key={i} className={m.from === "bot" ? s.bot : s.user}>
            <Rich text={m.text} />
          </p>
        ))}
        {typing && (
          <p className={`${s.bot} ${s.typing}`} aria-label="The assistant is typing">
            <span />
            <span />
            <span />
          </p>
        )}
      </div>

      <div className={s.foot}>
        {mode === "menu" && (
          <div className={s.chips}>
            <button type="button" onClick={() => { push({ from: "user", text: "Show me what you've built" }); reply("Here's what Ifiok has built. Pick one:", 350); setMode("projects"); }}>
              See what he&rsquo;s built
            </button>
            <button type="button" onClick={howItWorks}>
              How does he work?
            </button>
            <button type="button" className={s.primary} onClick={startBooking}>
              Book a call
            </button>
          </div>
        )}

        {mode === "projects" && (
          <div className={s.chips}>
            {PROJECTS.map((p) => (
              <button key={p.slug} type="button" onClick={() => showProject(p.slug)}>
                {p.title}
              </button>
            ))}
            <button type="button" onClick={toMenu}>
              ← Back
            </button>
          </div>
        )}

        {(mode === "project" || mode === "done") && (
          <div className={s.chips}>
            {mode === "project" && (
              <button type="button" className={s.primary} onClick={startBooking}>
                Book a call
              </button>
            )}
            <button type="button" onClick={() => { setMode("projects"); }}>
              Other projects
            </button>
            <button type="button" onClick={toMenu}>
              Menu
            </button>
          </div>
        )}

        {field?.type === "select" ? (
          <div className={s.chips}>
            {PROJECT_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => submitBooking(t)}>
                {t}
              </button>
            ))}
          </div>
        ) : (
          <form
            className={s.form}
            noValidate // the assistant checks the email itself and answers in the conversation
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "booking") void submitBooking(input);
              else void ask(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type={field?.type === "email" ? "email" : "text"}
              placeholder={mode === "booking" ? "Type your answer…" : "Ask anything about Ifiok's work…"}
              aria-label={mode === "booking" ? "Your answer" : "Your question"}
              maxLength={mode === "booking" ? 600 : 500}
            />
            <button type="submit" aria-label="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { open, intent, nonce } = useChat();
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true); // first open mounts the panel; it then stays, hidden, to keep the thread

  // Opened from the "Ask IC" button in the nav, or any "Ask" / "Hire me" button on a page.
  return <div className={s.root}>{mounted && <Panel key={nonce} intent={intent} hidden={!open} />}</div>;
}
