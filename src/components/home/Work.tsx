import Link from "next/link";
import ProjectCard from "@/components/projects/ProjectCard";
import Icon from "@/components/ui/Icon";
import SectionTitle from "@/components/ui/SectionTitle";
import { PROJECTS } from "@/content/projects";
import s from "./Work.module.css";

export default function Work() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="work" className="wrap section" aria-labelledby="work-title">
      <SectionTitle
        eyebrow="Projects"
        id="work-title"
        lead="Software products and AI automation systems. Each one says plainly how finished it is."
        aside={
          <Link href="/projects" className="btn btn-ghost">
            View all {PROJECTS.length} projects <Icon name="arrowRight" />
          </Link>
        }
      >
        Things I&rsquo;ve <em>built</em>
      </SectionTitle>

      <div className={s.list}>
        {featured.map((p, i) => (
          <div key={p.slug} data-reveal>
            <ProjectCard p={p} flip={i % 2 === 1} />
          </div>
        ))}
      </div>

      <div className={s.more} data-reveal>
        <Link href="/projects" className="btn btn-primary">
          See all {PROJECTS.length} projects <Icon name="arrowRight" />
        </Link>
        <p>Also: {rest.map((p) => p.title).join(", ")}.</p>
      </div>
    </section>
  );
}
