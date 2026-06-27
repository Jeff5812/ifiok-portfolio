"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Move, Plus } from "lucide-react";
import { projects } from "@/content/projects";
import WorkflowNode from "./WorkflowNode";
import WorkflowEdges from "./WorkflowEdges";
import CaseStudyPanel from "./CaseStudyPanel";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 168;
const COL_WIDTH = 320;
const ROW_HEIGHT = 210;
const CONTAINER_HEIGHT = 420;

/** Shown when no projects have been added to src/content/projects.ts yet,
 * keeps the canvas metaphor (a single trigger node waiting for its first
 * connection) instead of rendering a blank box or an apologetic message. */
function EmptyCanvasState() {
  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-line-strong bg-canvas bg-[radial-gradient(circle,_var(--line)_1px,_transparent_1px)] [background-size:24px_24px]"
      style={{ height: CONTAINER_HEIGHT }}
    >
      <div className="flex max-w-sm flex-col items-center gap-4 px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line-strong bg-canvas-raised">
          <Plus className="h-5 w-5 text-ink-soft" />
        </span>
        <div>
          <p className="label-mono text-ink-soft mb-2">No nodes yet</p>
          <p className="text-sm leading-relaxed text-ink-soft">
            The canvas is wired up and ready, add a project to{" "}
            <code className="label-mono rounded bg-canvas-raised border border-line px-1.5 py-0.5">
              src/content/projects.ts
            </code>{" "}
            and it shows up here automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowCanvas() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const hasProjects = projects.length > 0;

  const activeProject = useMemo(
    () => projects.find((p) => p.slug === activeSlug) ?? null,
    [activeSlug]
  );

  const { originY, canvasWidth } = useMemo(() => {
    if (!hasProjects) return { originY: 0, canvasWidth: 0 };
    const ys = projects.map((p) => p.position.y);
    const xs = projects.map((p) => p.position.x);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const maxX = Math.max(...xs);

    const contentHeight = (maxY - minY) * ROW_HEIGHT + NODE_HEIGHT;
    const computedOriginY =
      Math.max((CONTAINER_HEIGHT - contentHeight) / 2, 24) + Math.abs(minY) * ROW_HEIGHT;
    const computedWidth = maxX * COL_WIDTH + NODE_WIDTH + 80;

    return { originY: computedOriginY, canvasWidth: computedWidth };
  }, [hasProjects]);

  if (!hasProjects) {
    return <EmptyCanvasState />;
  }

  return (
    <>
      {/* Desktop / tablet: draggable workflow canvas */}
      <div className="hidden md:block">
        <div className="mb-4 flex items-center gap-2 label-mono text-ink-soft">
          <Move className="h-3.5 w-3.5" />
          Drag to explore the canvas, click any node to open its case study
        </div>
        <div
          className="relative w-full overflow-hidden rounded-3xl border border-line bg-canvas bg-[radial-gradient(circle,_var(--line)_1px,_transparent_1px)] [background-size:24px_24px]"
          style={{ height: CONTAINER_HEIGHT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas to-transparent"
          />
          <motion.div
            drag="x"
            dragConstraints={{ left: -(canvasWidth - 1040), right: 0 }}
            dragElastic={0.08}
            dragTransition={{ power: 0.2, timeConstant: 200 }}
            className="relative cursor-grab active:cursor-grabbing"
            style={{
              width: Math.max(canvasWidth, 1040),
              height: CONTAINER_HEIGHT,
            }}
          >
            <WorkflowEdges
              projects={projects}
              nodeWidth={NODE_WIDTH}
              nodeHeight={NODE_HEIGHT}
              colWidth={COL_WIDTH}
              rowHeight={ROW_HEIGHT}
              originY={originY}
            />
            {projects.map((project) => (
              <div
                key={project.slug}
                className="absolute"
                style={{
                  left: project.position.x * COL_WIDTH + 40,
                  top: originY + project.position.y * ROW_HEIGHT,
                }}
              >
                <WorkflowNode
                  project={project}
                  isActive={project.slug === activeSlug}
                  onSelect={setActiveSlug}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile: clean stepped/numbered list, same data, no canvas metaphor needed
          where there's no room to pan, so it degrades to a sequence instead. */}
      <div className="md:hidden flex flex-col gap-4">
        {projects.map((project, i) => (
          <div key={project.slug} className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <span className="label-mono flex h-6 w-6 items-center justify-center rounded-full border border-line-strong text-ink-soft">
                {i + 1}
              </span>
              {i < projects.length - 1 && (
                <span className="mt-2 h-full w-px flex-1 bg-line" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <WorkflowNode
                project={project}
                isActive={project.slug === activeSlug}
                onSelect={setActiveSlug}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <CaseStudyPanel project={activeProject} onClose={() => setActiveSlug(null)} />
    </>
  );
}
