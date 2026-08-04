"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects as allProjects } from "@/content/projects";
import { ToolChip } from "./ToolChip";

export default function ProjectsSection({
  onOpenChat,
  featuredOnly = false,
  showViewAll = false,
}: {
  onOpenChat: (intent?: string) => void;
  featuredOnly?: boolean;
  showViewAll?: boolean;
}) {
  const projects = featuredOnly ? allProjects.filter((p) => p.featured) : allProjects;

  return (
    <section id="projects" className="border-b border-line/70 bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono text-brand-from">Projects</div>
            <h2 className="mt-2 font-mono text-3xl font-bold">Things I&apos;ve built</h2>
          </div>
          {showViewAll && (
            <Link
              href="/projects"
              className="btn-ghost focus-ring rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
            >
              View all projects →
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-16">
          {projects.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 md:grid-cols-2"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-panel2">
                  <Image
                    src={p.screenshot}
                    alt={`${p.title} — n8n workflow canvas`}
                    fill
                    sizes="(min-width: 768px) 576px, 92vw"
                    className="object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h3 className="font-mono text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-inkSoft">{p.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <ToolChip key={s} name={s} />
                  ))}
                </div>

                <dl className="mt-6 space-y-4 text-sm">
                  <div>
                    <dt className="label-mono text-brand-from">Problem</dt>
                    <dd className="mt-1 text-inkSoft">{p.problem}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-brand-from">Solution</dt>
                    <dd className="mt-1 text-inkSoft">{p.solution}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-brand-from">Outcome</dt>
                    <dd className="mt-1 text-inkSoft">{p.outcome}</dd>
                  </div>
                </dl>

                {p.demoInChat && (
                  <button
                    onClick={() => onOpenChat(`project:${p.slug}`)}
                    className="btn-ghost focus-ring mt-6 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
                  >
                    ▶ Try this workflow in the chat
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
