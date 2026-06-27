"use client";

import type { Project } from "@/types/content";

interface WorkflowEdgesProps {
  projects: Project[];
  nodeWidth: number;
  nodeHeight: number;
  colWidth: number;
  rowHeight: number;
  originY: number;
}

/** Builds a smooth cubic-bezier path between two node anchor points, the way
 * n8n draws connections between nodes on its canvas. */
function buildPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.max(Math.abs(x2 - x1) * 0.5, 40);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export default function WorkflowEdges({
  projects,
  nodeWidth,
  nodeHeight,
  colWidth,
  rowHeight,
  originY,
}: WorkflowEdgesProps) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  const edges: { id: string; d: string }[] = [];

  projects.forEach((project) => {
    project.connectsTo.forEach((targetSlug) => {
      const target = bySlug.get(targetSlug);
      if (!target) return;

      const x1 = project.position.x * colWidth + nodeWidth;
      const y1 = originY + project.position.y * rowHeight + nodeHeight / 2;
      const x2 = target.position.x * colWidth;
      const y2 = originY + target.position.y * rowHeight + nodeHeight / 2;

      edges.push({
        id: `${project.slug}->${targetSlug}`,
        d: buildPath(x1, y1, x2, y2),
      });
    });
  });

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <marker
          id="edge-dot"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
        >
          <circle cx="3" cy="3" r="2.5" fill="var(--line-strong)" />
        </marker>
      </defs>
      {edges.map((edge) => (
        <path
          key={edge.id}
          d={edge.d}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={1.5}
          strokeDasharray="0"
          markerEnd="url(#edge-dot)"
        />
      ))}
    </svg>
  );
}
