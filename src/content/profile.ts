// Single source of truth for site-wide identity, positioning, and copy.
// Update this file as the brand evolves, nothing else should hardcode this content.

export const profile = {
  name: "Ifiok Columba",
  shortName: "Ifiok",
  initials: "IC",
  role: "AI Automation Engineer",
  location: "Nigeria · Open to remote",
  email: "wizicolumba@gmail.com",
  availability: "available" as "available" | "limited" | "unavailable",

  headline: "Manual work doesn't scale. The systems that replace it should think for themselves.",

  subhead: [
    "I specialize in automating operations for startups and business owners using n8n and AI agent workflows. I streamline manual processes, eliminate repetitive tasks, and build systems that decide and act, not just move data between tools.",
    "I work across workflow orchestration, AI agent design, and process automation, bringing in Gemini, OpenAI, or Claude wherever a step needs real judgment instead of a fixed script.",
    "Most teams don't struggle because they lack effort, they struggle because their processes are disconnected, unclear, and overly manual. That's what I fix.",
  ],

  // Used in <head>, OG tags, and the hero eyebrow.
  seoTitle: "Ifiok Columba, AI Automation Engineer",
  seoDescription:
    "Ifiok Columba designs AI automation that replaces manual, repetitive work with systems that make real decisions, lead qualification, document processing, and workflow orchestration built in n8n and AI agents.",

  social: {
    github: "https://github.com/Jeff5812",
    // Add your real LinkedIn URL here when ready, left null so nothing
    // links to a placeholder in the meantime. Every consumer of this field
    // checks for null before rendering.
    linkedin: null as string | null,
    twitter: "https://x.com/rust_automates",
    twitterHandle: "@rust_automates",
    email: "mailto:wizicolumba@gmail.com",
  },

  // The "what I'm building right now" ticker, update this freely, it's the pulse of the site.
  nowBuilding: "Currently undergoing an AI Automation Bootcamp, going deep on n8n and AI agent orchestration.",

  // Display title and taglines used in the hero and assistant context
  heroDisplayTitle: "Columba.",
  heroTaglines: ["BUILDING AI AGENTS", "AUTOMATING OPERATIONS", "POWERED BY N8N & AI"],

  // Small list of brand names / logos shown in the LogoCloud
  logoCloud: ["n8n", "Next.js", "OpenAI", "Claude", "Vercel", "Gemini", "DeepSeek"],

  // Apps/work examples metadata used by the Apps section
  apps: {
    title: "Agentic Apps & Workflows",
    description: "Systems and apps that automate decision-making, routing, and processing, built with n8n and AI models.",
  },

  // Services section content: what I do, shown as animated icon buttons
  // that route straight into the assistant with a matching prompt.
  services: {
    title: "My Services",
    tagline: "What I build, and the systems behind each one.",
    items: [
      {
        label: "Lead Qualification",
        description: "Score and route inbound leads the moment they land.",
        prompt: "Route this lead",
      },
      {
        label: "Document Processing",
        description: "Extract, validate, and summarize documents automatically.",
        prompt: "Summarize document",
      },
      {
        label: "Decision Automation",
        description: "Rule-based logic or AI judgment, applied where each one fits.",
        prompt: "Score eligibility",
      },
      {
        label: "Workflow Orchestration",
        description: "Systems that connect your tools and move work forward on their own.",
        prompt: "Process application",
      },
    ],
  },

  // Agents section content: the live chat demo intro.
  agents: {
    title: "AI Agents",
    tagline: "These aren't scripted replies, they're decisions. Try one below.",
    blurb: "",
    features: [] as string[],
  },

  stats: [
    { label: "Core focus", value: "Automation" },
    { label: "Availability", value: "Open now" },
  ],

  pillars: [
    {
      title: "Automation Engineering",
      kind: "AI AGENT",
      description:
        "I design n8n workflows that don't just move data, they reason about it: eligibility checks, lead scoring, routing logic, document handling. Systems built to make real decisions, not just relay them.",
    },
    {
      title: "AI Agent Orchestration",
      kind: "GATEWAY",
      description:
        "From rule-based Code nodes to full AI Agent nodes powered by Gemini and OpenAI, I'm learning exactly when a workflow needs a model's judgment and when it just needs clean logic, and building for the right one.",
    },
    {
      title: "AI Infrastructure",
      kind: "DEPLOY",
      description:
        "I build infrastructure for AI automation: APIs, agents, orchestration layers. Comfortable deploying end-to-end systems that make autonomous decisions at scale.",
    },
  ],
};

export const milestonesIntro =
  "A running log of the path, bootcamp progress, real milestones, and the moments that moved things forward. This is the part of the site that should never stop growing.";
