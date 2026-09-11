import { Bot, MessageCircle, Braces, UserCheck, Database, Workflow } from "lucide-react";

// Every line here should be something one of the live /projects can actually
// back up. If a service doesn't map to a real build, it doesn't belong here.
export const SERVICES = [
  {
    title: "Workflow Automation",
    description:
      "n8n workflows that take over multi-step manual processes, form intake, approvals, reminders, so nothing depends on someone remembering to do it.",
    icon: Workflow,
  },
  {
    title: "AI Agent Development",
    description:
      "Agents that hold a conversation and take real action, booking, rescheduling, answering support questions, with the database as the final check, not the model's judgment.",
    icon: Bot,
  },
  {
    title: "Telegram & Chat Assistants",
    description:
      "Assistants that run inside Telegram or your site, answer from your own documents, and hand off to a human when they're not sure.",
    icon: MessageCircle,
  },
  {
    title: "LLM & API Integration",
    description:
      "Connecting Claude, OpenAI, or Gemini to your existing tools, Google Calendar, Sheets, Slack, a database, so the model can act on real data, not just talk about it.",
    icon: Braces,
  },
  {
    title: "Lead Scoring & Routing",
    description:
      "Intake forms that get checked for duplicates, scored for intent, and routed to the right person automatically, hot leads paged, cold leads logged.",
    icon: UserCheck,
  },
  {
    title: "Data Validation Pipelines",
    description:
      "Incoming documents, like invoices, checked for math errors and duplicates before they ever reach a spreadsheet or an inbox.",
    icon: Database,
  },
];
