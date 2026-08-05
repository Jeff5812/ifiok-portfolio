import {
  Webhook,
  MessageCircle,
  Sparkles,
  Braces,
  Bot,
  Users,
  Share2,
  Container,
} from "lucide-react";

// Official brand marks sourced from simple-icons (CC0), stored as local SVGs
// so no external network call is needed at runtime.
const LOGO_FILES: Record<string, string> = {
  n8n: "/logos/n8n.svg",
  postgresql: "/logos/postgresql.svg",
  postgres: "/logos/postgresql.svg",
  supabase: "/logos/supabase.svg",
  gmail: "/logos/gmail.svg",
  github: "/logos/github.svg",
  x: "/logos/x.svg",
  python: "/logos/python.svg",
  javascript: "/logos/javascript.svg",
  gemini: "/logos/googlegemini.svg",
  "gemini (ai agent)": "/logos/googlegemini.svg",
  whatsapp: "/logos/whatsapp.svg",
  "whatsapp api": "/logos/whatsapp.svg",
  "whatsapp business api": "/logos/whatsapp.svg",
  "gmail api": "/logos/gmail.svg",
  openai: "/logos/openai.png",
  "openai (llm)": "/logos/openai.png",
  claude: "/logos/claude.svg",
  upwork: "/logos/upwork.svg",
};

const BRAND_COLOR: Record<string, string> = {
  n8n: "#EA4B71",
  postgresql: "#4169E1",
  postgres: "#4169E1",
  supabase: "#3FCF8E",
  gmail: "#EA4335",
  // GitHub's mark is near-black (#181717) — invisible masked onto this
  // site's dark background. Using off-white instead so it actually renders.
  github: "#f5f6f8",
  x: "#ffffff",
  python: "#3776AB",
  javascript: "#F7DF1E",
  gemini: "#8E75B2",
  "gemini (ai agent)": "#8E75B2",
  whatsapp: "#25D366",
  "whatsapp api": "#25D366",
  "whatsapp business api": "#25D366",
  "gmail api": "#EA4335",
  openai: "#ffffff",
  "openai (llm)": "#ffffff",
  claude: "#D97757",
};

// Tools without a usable trademark-safe SVG get a clean lucide-react icon instead.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FALLBACK_ICON: Record<string, React.ComponentType<any>> = {
  webhooks: Webhook,
  twilio: MessageCircle,
  openai: Sparkles,
  "openai (llm)": Sparkles,
  "mcp servers": Braces,
  "ai agents": Bot,
  "prompt engineering": Bot,
  "chatbot design": MessageCircle,
  "rest apis": Braces,
  "google workspace": Users,
  docker: Container,
  "multi-platform posting": Share2,
};

export function BrandIcon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const key = name.trim().toLowerCase();
  const file = LOGO_FILES[key];

  // GitHub's and Upwork's marks ship pre-colored in the SVG itself, so render
  // them directly instead of through the CSS mask trick (which wasn't
  // reliably painting for these).
  if (key === "github" || key === "upwork") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={file}
        alt=""
        width={size}
        height={size}
        className={`inline-block shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (file) {
    const color = BRAND_COLOR[key];
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          WebkitMaskImage: `url(${file})`,
          maskImage: `url(${file})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
        aria-hidden="true"
      />
    );
  }

  const Fallback = FALLBACK_ICON[key] ?? Braces;
  return <Fallback size={size} className={className} aria-hidden="true" />;
}
