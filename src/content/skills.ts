// Skills grouped the way Vercel groups its footer (AGENT STACK / CORE PLATFORM /
// SECURITY...), categories that mean something, not a flat tag cloud.

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Automation & Orchestration",
    items: ["n8n", "Webhooks", "Workflow design", "Switch/branch logic", "Error handling & retries"],
  },
  {
    category: "AI & Agents",
    items: ["AI Agent nodes", "Gemini", "OpenAI", "Prompt design", "Ollama (local models)", "Qwen2.5"],
  },
  {
    category: "Integrations & Data",
    items: ["Google Sheets API", "Slack API", "REST APIs", "NewsAPI", "File/document handling"],
  },
  {
    category: "Deployment & Tooling",
    items: ["Vercel", "Git/GitHub", "Figma (flow mapping)", "Environment config"],
  },
  {
    category: "Foundations",
    items: ["Systems thinking", "Technical documentation", "Client-style scoping"],
  },
];
