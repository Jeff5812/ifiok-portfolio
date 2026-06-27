"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  Project["status"],
  { label: string; dot: string }
> = {
  live: { label: "Live", dot: "bg-status-live" },
  "in-progress": { label: "In progress", dot: "bg-signal-amber" },
  archived: { label: "Archived", dot: "bg-ink-soft" },
  concept: { label: "Concept", dot: "bg-signal-violet" },
};

interface WorkflowNodeProps {
  project: Project;
  isActive: boolean;
  onSelect: (slug: string) => void;
  style?: React.CSSProperties;
}

export default function WorkflowNode({
  project,
  isActive,
  onSelect,
  style,
}: WorkflowNodeProps) {
  const status = STATUS_CONFIG[project.status];

  return (
    <motion.button
      type="button"
      style={style}
      onClick={() => onSelect(project.slug)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      aria-pressed={isActive}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border bg-canvas-raised p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors",
        style ? "w-full" : "w-[260px]",
        isActive
          ? "border-ink shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          : "border-line-strong hover:border-ink/40"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="label-mono inline-flex items-center gap-1.5 text-ink-soft">
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
        <ArrowUpRight
          className={cn(
            "h-4 w-4 text-ink-soft transition-transform",
            isActive ? "rotate-45 text-ink" : "group-hover:rotate-45 group-hover:text-ink"
          )}
        />
      </div>

      <div>
        <h3 className="text-base font-medium leading-snug tracking-tight text-ink">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm leading-snug text-ink-soft">
          {project.tagline}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {project.stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="label-mono rounded-full border border-line px-2 py-1 text-ink-soft"
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 3 && (
          <span className="label-mono rounded-full border border-line px-2 py-1 text-ink-soft">
            +{project.stack.length - 3}
          </span>
        )}
      </div>
    </motion.button>
  );
}
