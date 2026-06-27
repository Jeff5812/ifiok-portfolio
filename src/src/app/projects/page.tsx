import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Automation systems, AI agents, and full-stack products built by Ifiok Columba — with full case studies on problem, process, and outcome.",
};

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-24">
      <p className="label-mono text-ink-soft mb-3">All work</p>
      <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-ink max-w-2xl">
        Every system, end to end.
      </h1>
      <p className="mt-5 max-w-xl text-ink-soft leading-relaxed">
        Automation workflows, AI agents, and full-stack products — each with
        the full case study: the problem, the build, and what shipped.
      </p>

      {projects.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <p className="label-mono text-ink-soft mb-2">Nothing published yet</p>
          <p className="text-sm text-ink-soft max-w-sm mx-auto">
            First case study is in progress — check back soon, or see what
            I&apos;m building right now on the home page.
          </p>
          <Link
            href="/#now"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            See what I&apos;m building →
          </Link>
        </div>
      ) : (
        <div className="mt-16 flex flex-col">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col gap-4 border-t border-line py-8 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-5">
                <span className="label-mono mt-1 text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-ink/70">
                    {project.title}
                  </h2>
                  <p className="mt-1.5 max-w-md text-sm text-ink-soft">
                    {project.tagline}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="label-mono rounded-full border border-line-strong px-2 py-0.5 text-ink-soft">
                      {STATUS_LABEL[project.status]}
                    </span>
                    <span className="label-mono text-ink-soft">{project.year}</span>
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-soft transition-transform group-hover:rotate-45 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
