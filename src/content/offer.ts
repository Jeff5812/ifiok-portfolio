// Skills (each linked to the project that demonstrates it, as on the previous site) and services.
// Every line must map to real work in content/projects.ts.

export type SkillGroup = {
  label: string;
  icon: string; // 3D logo slug
  items: { name: string; project: string }[];
};

export const SKILLS: SkillGroup[] = [
  {
    label: "Software engineering",
    icon: "typescript",
    items: [
      { name: "Python & FastAPI backends", project: "chat-receipt" },
      { name: "TypeScript & Next.js web apps", project: "mayor-edits" },
      { name: "PostgreSQL schema design, constraints & triggers", project: "meridian-scheduling-agent" },
      { name: "Row-level security & multi-tenant data", project: "chat-receipt" },
      { name: "Background jobs, queues & idempotency", project: "chat-receipt" },
      { name: "Large file uploads & media pipelines", project: "mayor-edits" },
      { name: "Automated testing (unit, API, end-to-end)", project: "chat-receipt" },
    ],
  },
  {
    label: "AI engineering",
    icon: "claude",
    items: [
      { name: "LLM integration (Claude, Gemini, OpenAI)", project: "chat-receipt" },
      { name: "AI evaluation on held-out data", project: "chat-receipt" },
      { name: "Guardrails that keep the model in check", project: "chat-receipt" },
      { name: "RAG pipelines & vector search (pgvector)", project: "stripe-docs-support-bot" },
      { name: "AI agents & MCP tool servers", project: "meridian-scheduling-agent" },
      { name: "Structured output & confidence gates", project: "loan-collections-router" },
      { name: "Speech-to-text & translation (Whisper, Gemma)", project: "mayor-edits" },
    ],
  },
  {
    label: "Automation",
    icon: "n8n",
    items: [
      { name: "n8n workflow orchestration", project: "lab-results-follow-up" },
      { name: "WhatsApp, Telegram, Gmail, Sheets & Slack integrations", project: "ai-lead-scoring-and-routing" },
      { name: "Escalation & human-in-the-loop design", project: "lab-results-follow-up" },
      { name: "Retries, error workflows & alerting", project: "invoice-intake-anomaly-detection" },
      { name: "Document extraction & validation", project: "invoice-intake-anomaly-detection" },
      { name: "Scoring, triage & routing", project: "ai-lead-scoring-and-routing" },
    ],
  },
];

export type Service = { title: string; description: string; icon: string; project: string };

export const SERVICES: Service[] = [
  {
    title: "AI-powered web apps",
    description:
      "Full web apps with AI built in, using FastAPI or Next.js on Postgres. The AI reads and suggests, and the code and database make sure the rules are followed.",
    icon: "nextdotjs",
    project: "chat-receipt",
  },
  {
    title: "WhatsApp & Telegram assistants",
    description:
      "Assistants that book appointments, read deals or answer questions on WhatsApp and Telegram, and pass the chat to a person when they're not sure.",
    icon: "whatsapp",
    project: "meridian-scheduling-agent",
  },
  {
    title: "Workflow automation",
    description:
      "n8n workflows that take over repetitive, multi-step work, with retries, error alerts and a person in the loop where it matters.",
    icon: "n8n",
    project: "lab-results-follow-up",
  },
  {
    title: "AI agents & integrations",
    description:
      "I connect Claude, Gemini or OpenAI to your calendar, database and messaging apps, through tools the model can use but can't misuse.",
    icon: "claude",
    project: "loan-collections-router",
  },
  {
    title: "Document & data pipelines",
    description:
      "Turning invoices, chats and forms into clean records, with the math re-checked in code and duplicates caught before they cost you money.",
    icon: "googlesheets",
    project: "invoice-intake-anomaly-detection",
  },
  {
    title: "Knowledge assistants (RAG)",
    description: "Bots that answer questions from your own documents, and say so when the answer isn't in them.",
    icon: "postgresql",
    project: "stripe-docs-support-bot",
  },
];
