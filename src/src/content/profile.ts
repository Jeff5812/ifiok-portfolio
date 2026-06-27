// Single source of truth for site-wide identity, positioning, and copy.
// Update this file as the brand evolves — nothing else should hardcode this content.

export const profile = {
  name: "Ifiok Columba",
  shortName: "Ifiok",
  initials: "IC",
  role: "AI Automation Engineer",
  location: "Nigeria · Open to remote",
  email: "wizicolumba@gmail.com",
  availability: "available" as "available" | "limited" | "unavailable",

  headline: "I build systems that think, act, and ship — so people don't have to do the boring parts twice.",

  subhead:
    "I design AI-powered automation systems, workflow engines that make real decisions, agents that read and act. Currently deep in n8n, AI agent orchestration, and intelligent process automation.",

  // Used in <head>, OG tags, and the hero eyebrow.
  seoTitle: "Ifiok Columba — AI Automation Engineer",
  seoDescription:
    "Ifiok Columba designs AI-powered automation systems, agent workflows, and intelligent automation solutions. Currently building in n8n, AI orchestration, and agent infrastructure.",

  social: {
    github: "https://github.com/Jeff5812",
    // Add your real LinkedIn URL here when ready — left null so nothing
    // links to a placeholder in the meantime. Every consumer of this field
    // checks for null before rendering.
    linkedin: null as string | null,
    twitter: "https://x.com/rust_automates",
    twitterHandle: "@rust_automates",
    email: "mailto:wizicolumba@gmail.com",
  },

  // The "what I'm building right now" ticker — update this freely, it's the pulse of the site.
  nowBuilding: "Currently undergoing an AI Automation Bootcamp, going deep on n8n and AI agent orchestration.",

  // Display title and taglines used in the hero and assistant context
  heroDisplayTitle: "Columba.",
  heroTaglines: ["BUILDING AI AGENTS", "AUTOMATING OPERATIONS", "POWERED BY N8N & AI"],

  // Small list of brand names / logos shown in the LogoCloud
  logoCloud: ["n8n", "Next.js", "OpenAI", "Claude", "Vercel", "Gemini", "DeepSeek"],

  // Apps/work examples metadata used by the Apps section
  apps: {
    title: "Agentic Apps & Workflows",
    description: "Systems and apps that automate decision-making, routing, and processing — built with n8n and AI models.",
  },

  // Agents section content
  agents: {
    title: "AI Agents",
    tagline: "Agents that make decisions, take action, and deliver results.",
    blurb:
      "I design AI agents and n8n workflows that automate decision-making, document processing, lead qualification, and operational routing — reducing manual work and increasing execution speed.",
    features: ["LEAD QUALIFICATION", "DOCUMENT PROCESSING", "DECISION AUTOMATION", "WORKFLOW ORCHESTRATION"],
  },

  stats: [
    { label: "Bootcamp", value: "In progress" },
    { label: "Core focus", value: "Automation" },
    { label: "Availability", value: "Open now" },
  ],

  pillars: [
    {
      title: "Automation Engineering",
      kind: "AI AGENT",
      description:
        "I design n8n workflows that don't just move data — they reason about it: eligibility checks, lead scoring, routing logic, document handling. Systems built to make real decisions, not just relay them.",
    },
    {
      title: "AI Agent Orchestration",
      kind: "GATEWAY",
      description:
        "From rule-based Code nodes to full AI Agent nodes powered by Gemini and OpenAI — I'm learning exactly when a workflow needs a model's judgment and when it just needs clean logic, and building for the right one.",
    },
    {
      title: "AI Infrastructure",
      kind: "DEPLOY",
      description:
        "I build infrastructure for AI automation — APIs, agents, orchestration layers. Comfortable deploying end-to-end systems that make autonomous decisions at scale.",
    },
  ],
};

export const milestonesIntro =
  "A running log of the path — bootcamp progress, real milestones, and the moments that moved things forward. This is the part of the site that should never stop growing.";
