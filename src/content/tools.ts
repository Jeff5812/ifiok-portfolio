// The tools behind the work, each mapped to the projects that actually use it (checked against the
// repositories). Logos are real brand marks (Simple Icons paths, CC0; n8n's classic mark) rendered as
// 3D app icons into public/media/3d with three.js.

export type Tool = {
  slug: string;
  name: string;
  role: string;
  usedIn: string[]; // project slugs from content/projects.ts
};

const ALL_N8N = [
  "meridian-scheduling-agent",
  "stripe-docs-support-bot",
  "lab-results-follow-up",
  "loan-collections-router",
  "invoice-intake-anomaly-detection",
  "ai-lead-scoring-and-routing",
];

export const TOOLS: Tool[] = [
  { slug: "n8n", name: "n8n", role: "Workflow orchestration", usedIn: ALL_N8N },
  { slug: "claude", name: "Claude", role: "Extraction, and the coding agent I build with", usedIn: ["chat-receipt"] },
  {
    slug: "googlegemini",
    name: "Gemini",
    role: "Reading chats, intent and risk",
    usedIn: ["chat-receipt", "meridian-scheduling-agent", "stripe-docs-support-bot", "loan-collections-router", "invoice-intake-anomaly-detection", "ai-lead-scoring-and-routing"],
  },
  { slug: "python", name: "Python", role: "Backends and evaluations", usedIn: ["chat-receipt"] },
  { slug: "typescript", name: "TypeScript", role: "Web apps, and this site", usedIn: ["chat-receipt", "mayor-edits"] },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    role: "The rules that can't be argued with",
    usedIn: ["chat-receipt", "meridian-scheduling-agent", "stripe-docs-support-bot", "lab-results-follow-up", "loan-collections-router"],
  },
  {
    slug: "supabase",
    name: "Supabase",
    role: "Postgres, auth, row-level security",
    usedIn: ["chat-receipt", "mayor-edits", "meridian-scheduling-agent", "stripe-docs-support-bot"],
  },
  { slug: "nextdotjs", name: "Next.js", role: "Web apps", usedIn: ["chat-receipt", "mayor-edits"] },
  { slug: "fastapi", name: "FastAPI", role: "APIs and webhooks", usedIn: ["chat-receipt"] },
  { slug: "whatsapp", name: "WhatsApp", role: "Where the customers are", usedIn: ["chat-receipt", "loan-collections-router"] },
  { slug: "telegram", name: "Telegram", role: "Bots and agents", usedIn: ["meridian-scheduling-agent", "stripe-docs-support-bot"] },
  { slug: "cloudflare", name: "Cloudflare", role: "R2 storage, Workers AI", usedIn: ["mayor-edits"] },
  { slug: "vercel", name: "Vercel", role: "Hosting", usedIn: ["chat-receipt", "mayor-edits"] },
  { slug: "docker", name: "Docker", role: "Packaging and self-hosting", usedIn: ["chat-receipt"] },
  { slug: "huggingface", name: "Hugging Face", role: "Embeddings", usedIn: ["stripe-docs-support-bot"] },
  { slug: "googlecalendar", name: "Google Calendar", role: "Bookings", usedIn: ["meridian-scheduling-agent"] },
  { slug: "googlesheets", name: "Google Sheets", role: "Lightweight ledgers and logs", usedIn: ["stripe-docs-support-bot", "invoice-intake-anomaly-detection", "ai-lead-scoring-and-routing"] },
  { slug: "gmail", name: "Gmail", role: "Intake, alerts and escalations", usedIn: ["lab-results-follow-up", "loan-collections-router", "invoice-intake-anomaly-detection", "ai-lead-scoring-and-routing"] },
  {
    slug: "github",
    name: "GitHub",
    role: "Everything, in the open",
    usedIn: ["chat-receipt", "mayor-edits", "meridian-scheduling-agent", "stripe-docs-support-bot", "lab-results-follow-up", "loan-collections-router", "invoice-intake-anomaly-detection", "ai-lead-scoring-and-routing"],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const iconSrc = (slug: string) => `/media/3d/${slug}.webp`;

// Stack names as written in project data -> 3D logo slug. Names without a logo render as text chips.
const LOGO_FOR: Record<string, string> = {
  n8n: "n8n",
  claude: "claude",
  gemini: "googlegemini",
  python: "python",
  typescript: "typescript",
  postgresql: "postgresql",
  supabase: "supabase",
  "next.js": "nextdotjs",
  fastapi: "fastapi",
  whatsapp: "whatsapp",
  telegram: "telegram",
  cloudflare: "cloudflare",
  vercel: "vercel",
  docker: "docker",
  "hugging face": "huggingface",
  "google calendar": "googlecalendar",
  "google sheets": "googlesheets",
  gmail: "gmail",
  github: "github",
};

export const logoFor = (name: string): string | null => LOGO_FOR[name.toLowerCase()] ?? null;

// Social profiles, shown with the real app logos.
export const SOCIALS = [
  { slug: "gmail", label: "Email", href: "mailto:wizicolumba@gmail.com" },
  { slug: "github", label: "GitHub", href: "https://github.com/Jeff5812" },
  { slug: "x", label: "X", href: "https://x.com/rust_automates" },
  { slug: "upwork", label: "Upwork", href: "https://www.upwork.com/freelancers/~01c94dc22db54d989f" },
] as const;
