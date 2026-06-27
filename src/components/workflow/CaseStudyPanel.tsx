"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

interface CaseStudyPanelProps {
  project: Project | null;
  onClose: () => void;
}

export default function CaseStudyPanel({ project, onClose }: CaseStudyPanelProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} case study`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-line bg-canvas-raised sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:max-h-[85vh] sm:w-[min(680px,92vw)] sm:-translate-x-1/2 sm:rounded-3xl sm:border"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas-raised px-6 py-4">
              <span className="label-mono text-ink-soft">Case study</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong hover:bg-canvas"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-8 sm:px-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="label-mono rounded-full border border-line-strong px-2.5 py-1 text-ink-soft">
                  {STATUS_LABEL[project.status]}
                </span>
                <span className="label-mono text-ink-soft">{project.year}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                {project.title}
              </h2>
              <p className="mt-2 text-ink-soft">{project.tagline}</p>

              <section className="mt-8">
                <p className="label-mono text-ink-soft mb-2">The problem</p>
                <p className="text-[15px] leading-relaxed text-ink/90">
                  {project.caseStudy.problem}
                </p>
              </section>

              <section className="mt-8">
                <p className="label-mono text-ink-soft mb-4">
                  The workflow
                </p>
                <ol className="relative flex flex-col gap-5 border-l border-line pl-6">
                  {project.caseStudy.process.map((step) => (
                    <li key={step.id} className="relative">
                      <span
                        aria-hidden
                        className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full border-2 border-canvas-raised bg-ink"
                      />
                      <div className="flex flex-wrap items-baseline gap-2">
                        {step.kind && (
                          <span className="label-mono rounded border border-line-strong px-1.5 py-0.5 text-ink-soft">
                            {step.kind}
                          </span>
                        )}
                        <h4 className="text-sm font-medium text-ink">
                          {step.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-8">
                <p className="label-mono text-ink-soft mb-3">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.caseStudy.stack.map((tech) => (
                    <span
                      key={tech}
                      className="label-mono rounded-full border border-line px-2.5 py-1.5 text-ink-soft"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {project.caseStudy.metrics && project.caseStudy.metrics.length > 0 && (
                <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {project.caseStudy.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-line p-4"
                    >
                      <p className="text-xl font-medium text-ink">
                        {metric.value}
                      </p>
                      <p className="label-mono mt-1 text-ink-soft">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </section>
              )}

              <section className="mt-8">
                <p className="label-mono text-ink-soft mb-2">Outcome</p>
                <p className="text-[15px] leading-relaxed text-ink/90">
                  {project.caseStudy.outcome}
                </p>
              </section>

              {project.caseStudy.learnings && (
                <section
                  className={cn(
                    "mt-8 rounded-2xl border border-line bg-canvas p-5"
                  )}
                >
                  <p className="label-mono text-ink-soft mb-2">
                    What this taught me
                  </p>
                  <p className="text-sm leading-relaxed text-ink/90">
                    {project.caseStudy.learnings}
                  </p>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
