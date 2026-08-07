"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects as allProjects } from "@/content/projects";
import { ToolChip } from "./ToolChip";
import { ImageLightbox } from "./ImageLightbox";

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
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <div>
            <div className="label-mono text-brand-from">Projects</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Things I have built</h2>
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

        <div className="flex flex-col gap-12 md:gap-16">
          {projects.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-2 md:gap-8"
            >
              {/* On mobile, image always comes first */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <ImageLightbox
                  src={p.screenshot}
                  alt={`${p.title} — n8n workflow canvas`}
                  className="aspect-video"
                />
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-inkSoft">{p.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <ToolChip key={s} name={s} />
                  ))}
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <div className="label-mono text-brand-from">Problem</div>
                    <p className="mt-1 text-inkSoft">{p.problem}</p>
                  </div>

                  <div>
                    <div className="label-mono text-brand-from">Key Features</div>
                    <ul className="mt-1.5 space-y-1.5">
                      {p.keyFeatures.map((f) => (
                        <li key={f} className="flex gap-2 text-inkSoft">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-from" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="label-mono text-brand-from">Outcome</div>
                    <p className="mt-1 text-inkSoft">{p.outcome}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {p.demoInChat && (
                    <button
                      onClick={() => onOpenChat(`project:${p.slug}`)}
                      className="btn-ghost focus-ring rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
                    >
                      💬 Ask the assistant
                    </button>
                  )}
                  {p.caseStudy && (
                    <Link
                      href={`/projects/${p.slug}`}
                      className="btn-primary focus-ring rounded-full px-4 py-2 text-xs font-medium text-white"
                    >
                      Read case study →
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
