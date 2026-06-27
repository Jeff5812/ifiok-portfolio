import { profile } from "@/content/profile";
import { milestones } from "@/content/milestones";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";

function safeLines(lines: Array<string | null | undefined>) {
  return lines.filter((l): l is string => Boolean(l && l.trim())).join("\n");
}

export type AssistantContext = {
  identity: {
    name: string;
    role: string;
    location: string;
    availability: string;
    email: string;
  };
  socials: Record<string, string | null>;
  hero: {
    title: string;
    taglines: string[];
  };
  stack: Array<{ category: string; items: string[] }>;
  journey: Array<{ date: string; title: string; description: string; kind: string }>;
  projects: Array<{ slug: string; title: string; tagline?: string }>;
};

export function getAssistantContext(): AssistantContext {
  return {
    identity: {
      name: profile.name,
      role: profile.role,
      location: profile.location,
      availability: profile.availability,
      email: profile.email,
    },
    socials: {
      github: profile.social.github,
      linkedin: profile.social.linkedin,
      twitter: profile.social.twitter,
      email: profile.social.email,
    },
    hero: {
      title: profile.heroDisplayTitle || profile.role,
      taglines: profile.heroTaglines || [],
    },
    stack: skillGroups.map((g) => ({ category: g.category, items: g.items })),
    journey: milestones.map((m) => ({
      date: m.date,
      title: m.title,
      description: m.description,
      kind: m.kind,
    })),
    projects: projects.map((p) => ({ slug: p.slug, title: p.title, tagline: p.tagline })),
  };
}

export function assistantContextText() {
  const ctx = getAssistantContext();

  const stackText = ctx.stack
    .map((g) => `- ${g.category}: ${g.items.join(", ")}`)
    .join("\n");

  const journeyText = ctx.journey
    .map((m) => `- ${m.date} (${m.kind}): ${m.title} — ${m.description}`)
    .join("\n");

  const projectsText =
    ctx.projects.length === 0
      ? "- (No public case studies listed yet in src/content/projects.ts)"
      : ctx.projects.map((p) => `- ${p.title} (${p.slug})${p.tagline ? ` — ${p.tagline}` : ""}`).join("\n");

  return safeLines([
    `NAME: ${ctx.identity.name}`,
    `ROLE: ${ctx.identity.role}`,
    `LOCATION: ${ctx.identity.location}`,
    `AVAILABILITY: ${ctx.identity.availability}`,
    `CONTACT_EMAIL: ${ctx.identity.email}`,
    "",
    "SOCIALS:",
    `- GitHub: ${ctx.socials.github ?? ""}`,
    `- LinkedIn: ${ctx.socials.linkedin ?? ""}`,
    `- X/Twitter: ${ctx.socials.twitter ?? ""}`,
    "",
    "HERO:",
    `- Title: ${ctx.hero.title}`,
    `- Taglines: ${ctx.hero.taglines.join(" | ")}`,
    "",
    "STACK:",
    stackText,
    "",
    "JOURNEY:",
    journeyText,
    "",
    "PROJECTS:",
    projectsText,
  ]);
}

