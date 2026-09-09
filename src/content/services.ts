import { Bot, MessageCircle, Braces, UserCheck, Share2, Workflow } from "lucide-react";

export const SERVICES = [
  {
    title: "Workflow Automation",
    description:
      "n8n pipelines that replace manual, repetitive steps with reliable, trigger-based workflows.",
    icon: Workflow,
  },
  {
    title: "AI Agent Development",
    description:
      "Agents that make judgment calls, risk scoring, sentiment reading, routing, with confidence gating and human fallback.",
    icon: Bot,
  },
  {
    title: "Custom Chatbots & Assistants",
    description:
      "Conversational assistants for your site or WhatsApp that answer questions and trigger real workflows.",
    icon: MessageCircle,
  },
  {
    title: "LLM & API Integration",
    description:
      "Wiring OpenAI, Claude, Gemini, and third-party APIs into your existing systems so they act on real data.",
    icon: Braces,
  },
  {
    title: "Lead Qualification Systems",
    description:
      "Automated intake and scoring so the right leads reach the right person, without manual triage.",
    icon: UserCheck,
  },
  {
    title: "Multi-Platform Posting",
    description:
      "One workflow, many destinations, content and updates distributed across channels automatically.",
    icon: Share2,
  },
];
