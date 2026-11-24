import type { Metadata } from "next";
import ProjectCard from "@/components/projects/ProjectCard";
import Icon from "@/components/ui/Icon";
import { ARCHIVE, PROJECTS } from "@/content/projects";
import s from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project by Ifiok Columba, from software products (Chat Receipt, Mayor Edits) to AI automations, each with a full case study.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const groups = [
    { id: "products", title: "Software products", lead: "Full-stack web apps with AI built in.", items: PROJECTS.filter((p) => p.group === "product") },
    { id: "automation", title: "AI automations", lead: "Agents and workflows built with n8n and Postgres, on the apps people already use.", items: PROJECTS.filter((p) => p.group === "automation") },
  ];

  return (
    <div className="wrap">
      <header className={s.head} data-reveal>
        <p className="eyebrow">All projects</p>
        <h1 className={s.title}>
          Everything I&rsquo;ve <em>built</em>
        </h1>
        <p className="lead">
          {PROJECTS.length} projects, from live products to automation workflows. Each card covers the problem, what I
          built and how it turned out. Every project has a full case study, and you can ask IC, my AI assistant, about
          any of them.
        </p>
        <nav className={s.jump} aria-label="Jump to">
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`}>
              {g.title} <span>{g.items.length}</span>
            </a>
          ))}
        </nav>
      </header>

      {groups.map((g) => (
        <section key={g.id} id={g.id} className={s.group} aria-labelledby={`${g.id}-title`}>
          <div className={s.groupHead} data-reveal>
            <h2 id={`${g.id}-title`} className={s.groupTitle}>
              {g.title}
            </h2>
            <p>{g.lead}</p>
          </div>
          <div className={s.list}>
            {g.items.map((p, i) => (
              <div key={p.slug} data-reveal>
                <ProjectCard p={p} flip={i % 2 === 1} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className={s.archive} aria-labelledby="archive-title" data-reveal>
        <h2 id="archive-title" className={s.groupTitle}>
          Smaller builds
        </h2>
        <ul role="list">
          {ARCHIVE.map((a) => (
            <li key={a.title}>
              <a href={a.href} className="glass">
                <strong>
                  {a.title} <Icon name="arrowUpRight" />
                </strong>
                <span>{a.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
