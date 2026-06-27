import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects, getProjectBySlug } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.caseStudy.problem,
    openGraph: {
      title: `${project.title}, Ifiok Columba`,
      description: project.tagline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 label-mono text-ink-soft mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        All projects
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <span className="label-mono rounded-full border border-line-strong px-2.5 py-1 text-ink-soft">
          {STATUS_LABEL[project.status]}
        </span>
        <span className="label-mono text-ink-soft">{project.year}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">{project.tagline}</p>

      <section className="mt-12">
        <p className="label-mono text-ink-soft mb-3">The problem</p>
        <p className="text-base leading-relaxed text-ink/90">
          {project.caseStudy.problem}
        </p>
      </section>

      <section className="mt-12">
        <p className="label-mono text-ink-soft mb-6">The workflow</p>
        <ol className="relative flex flex-col gap-6 border-l border-line pl-7">
          {project.caseStudy.process.map((step) => (
            <li key={step.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-[33px] top-1 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-ink"
              />
              <div className="flex flex-wrap items-baseline gap-2">
                {step.kind && (
                  <span className="label-mono rounded border border-line-strong px-1.5 py-0.5 text-ink-soft">
                    {step.kind}
                  </span>
                )}
                <h3 className="text-base font-medium text-ink">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <p className="label-mono text-ink-soft mb-3">Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.caseStudy.stack.map((tech) => (
            <span
              key={tech}
              className="label-mono rounded-full border border-line px-3 py-1.5 text-ink-soft"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {project.caseStudy.metrics && project.caseStudy.metrics.length > 0 && (
        <section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.caseStudy.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-line p-5">
              <p className="text-2xl font-medium text-ink">{metric.value}</p>
              <p className="label-mono mt-1 text-ink-soft">{metric.label}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mt-12">
        <p className="label-mono text-ink-soft mb-3">Outcome</p>
        <p className="text-base leading-relaxed text-ink/90">
          {project.caseStudy.outcome}
        </p>
      </section>

      {project.caseStudy.learnings && (
        <section className="mt-12 rounded-2xl border border-line bg-canvas-raised p-6">
          <p className="label-mono text-ink-soft mb-3">What this taught me</p>
          <p className="text-base leading-relaxed text-ink/90">
            {project.caseStudy.learnings}
          </p>
        </section>
      )}

      <div className="mt-16 border-t border-line pt-10">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-canvas hover:opacity-85"
        >
          Start a similar project
        </Link>
      </div>
    </article>
  );
}
