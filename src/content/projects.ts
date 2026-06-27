import type { Project } from "@/types/content";

// ---------------------------------------------------------------------------
// This is where every real project goes once it's actually finished and
// ready to show. Nothing in this file is published until you add it here,
// there are no placeholder or example projects shipped in the live site.
//
// HOW TO ADD A PROJECT
// 1. Copy the EXAMPLE_PROJECT shape below into a new object in `projects`.
// 2. Fill in every field with your real project's details.
// 3. `position` controls where the node sits on the workflow canvas:
//      x = column (left → right, use 0, 1, 2, 3...)
//      y = row    (use 0 for your main row; ±1 for a parallel branch)
//    Leave at least one COL_WIDTH of horizontal space between connected
//    nodes, and at least one full row of vertical space between rows,
//    the canvas component (src/components/workflow/WorkflowCanvas.tsx)
//    documents the exact spacing constants if you want precise control.
// 4. `connectsTo` is an array of other project slugs this one flows into
//    on the canvas. Leave it as [] if the project stands alone.
// 5. Set `featured: true` to have it appear in the homepage canvas. All
//    projects (featured or not) appear on the /projects index page.
//
// See the README's "Adding a project" section for the full walkthrough,
// including how case studies, metrics, and status badges are used.
// ---------------------------------------------------------------------------

export const projects: Project[] = [];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
