// Everything the IC Assistant knows about Ifiok, the site, and how to help
// a visitor. This is a lightweight local knowledge base (keyword matching),
// not a live model, so answers are hand-written and kept accurate on purpose.

export const ABOUT_IFIOK = `Ifiok Columba is an AI automation engineer. He designs and builds AI agents, workflows, and integrations that take repetitive, judgment-heavy manual work off a business's plate, the kind of task that usually means someone checking a spreadsheet every morning or manually deciding what needs attention today.`;

export const HOW_IT_WORKS = `In plain terms: most of what Ifiok builds is a system that watches for something happening (a form submitted, a new record, a scheduled time), decides what should happen next, and then does it automatically, sending a message, updating a record, notifying the right person, or flagging something for a human to look at. Where a decision needs real judgment instead of a fixed rule, an AI model handles that part, and anything it isn't confident about gets routed to a person instead of guessed at.`;

export const PROCESS_STEPS = [
  "A short conversation about what's eating up your team's time and whether automation is actually the right fix for it.",
  "Ifiok maps out the workflow in plain language, what triggers it, what decisions it makes, what it does at the end, so you know exactly what you're getting before anything is built.",
  "He builds and connects it to your real tools and data.",
  "You review it, he adjusts it, and it goes live.",
];

export const SERVICES_SUMMARY = [
  { name: "Workflow Automation", detail: "Replacing manual, repetitive steps with reliable, automatic workflows." },
  { name: "AI Agent Development", detail: "Agents that make judgment calls, scoring, reading, routing, with a human fallback for anything uncertain." },
  { name: "Custom Chatbots & Assistants", detail: "Conversational assistants for a website or WhatsApp that answer questions and can kick off real workflows." },
  { name: "LLM & API Integration", detail: "Connecting OpenAI, Claude, Gemini, and other APIs into your existing systems so they act on real data." },
  { name: "Lead Qualification Systems", detail: "Automatic intake and scoring so the right leads reach the right person without manual sorting." },
  { name: "Multi-Platform Posting", detail: "One workflow that distributes content and updates across multiple channels automatically." },
];

export const TOOLS = "n8n, OpenAI, Claude, Gemini, Python, PostgreSQL, Supabase, Gmail, Google Workspace, WhatsApp, and REST APIs.";

export const CONTACT = {
  email: "wizicolumba@gmail.com",
  github: "https://github.com/Jeff5812",
  x: "https://x.com/rust_automates",
};

// Free-text question matching. Keeps things simple, transparent, and always
// truthful, no invented facts, no promises Ifiok hasn't made.
type Rule = { keywords: string[]; answer: string };

const RULES: Rule[] = [
  {
    keywords: ["price", "pricing", "cost", "rate", "budget", "how much", "charge"],
    answer:
      "Pricing depends on the scope of the workflow, so Ifiok prefers to quote after a quick conversation about what you need rather than guess at a number here. Want me to pass your details along so he can follow up with a quote?",
  },
  {
    keywords: ["full time", "full-time", "employment", "hire you", "freelance only", "contract only", "job offer", "available for hire", "open to work"],
    answer:
      "Ifiok is open to both full-time roles and freelance/contract work, the right fit depends on the details. Best way to move forward is to send over what you have in mind and he'll get back to you directly. Want me to start that?",
  },
  {
    keywords: ["who are you", "who is ifiok", "about you", "about ifiok", "who made this", "who built this"],
    answer: ABOUT_IFIOK,
  },
  {
    keywords: ["how does it work", "how does this work", "how do you work", "how does automation work", "explain", "process"],
    answer: HOW_IT_WORKS,
  },
  {
    keywords: ["service", "what do you offer", "what can you build", "what do you do"],
    answer:
      "Ifiok works across six areas: " +
      SERVICES_SUMMARY.map((s) => s.name).join(", ") +
      ". Want details on any of these, or should I show you real projects he's built?",
  },
  {
    keywords: ["tool", "tech stack", "technology", "stack", "what do you use"],
    answer: `The toolkit: ${TOOLS}`,
  },
  {
    keywords: ["contact", "email", "reach", "get in touch", "talk to ifiok"],
    answer: `You can reach Ifiok directly at ${CONTACT.email}, or I can collect your details right here and pass them along. Want me to do that?`,
  },
  {
    keywords: ["project", "portfolio", "built", "work", "example", "case study"],
    answer: "Ifiok has built a clinic follow-up and escalation system, and an autonomous micro-lending collection system. Want me to walk you through either one?",
  },
];

export function answerFreeText(raw: string): string | null {
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  for (const rule of RULES) {
    if (rule.keywords.some((k) => q.includes(k))) return rule.answer;
  }
  return null;
}
