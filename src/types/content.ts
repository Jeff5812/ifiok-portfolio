// Central type definitions for all content entities.
// This is the contract every content source (local TS data, MDX frontmatter,
// or a future headless CMS) must satisfy. Keeping this in one file means
// swapping the data source later never touches a component.

export type ProjectStatus = "live" | "in-progress" | "archived" | "concept";

export type ProjectCategory =
  | "automation"
  | "ai-agent"
  | "web-app"
  | "integration";

export interface NodeMetric {
  label: string;
  value: string;
}

/** One step in a project's build/workflow trace, rendered on the workflow canvas node detail. */
export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  /** Optional: which tool/node type this maps to, shown as a mono tag (e.g. "WEBHOOK", "AI AGENT", "SWITCH"). */
  kind?: string;
}

export interface CaseStudy {
  problem: string;
  process: WorkflowStep[];
  stack: string[];
  outcome: string;
  metrics?: NodeMetric[];
  learnings?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  featured: boolean;
  /** Position on the workflow canvas graph, in grid units. */
  position: { x: number; y: number };
  /** slugs of projects this one connects to / flows into on the canvas */
  connectsTo: string[];
  stack: string[];
  links?: { label: string; href: string }[];
  cover?: string;
  caseStudy: CaseStudy;
}

export interface Milestone {
  id: string;
  date: string; // ISO
  title: string;
  description: string;
  kind: "bootcamp" | "project" | "certification" | "role" | "milestone";
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  readingTime: string;
}
