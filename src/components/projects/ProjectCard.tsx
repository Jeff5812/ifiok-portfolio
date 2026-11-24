import Link from "next/link";
import AskButton from "@/components/chat/AskButton";
import Icon from "@/components/ui/Icon";
import Lightbox from "@/components/ui/Lightbox";
import StackChips from "@/components/ui/StackChips";
import type { Project } from "@/content/projects";
import s from "./ProjectCard.module.css";

/** A project in the previous site's format: picture, problem, key features, outcome, then actions. */
export default function ProjectCard({ p, flip = false }: { p: Project; flip?: boolean }) {
  return (
    <article className={`glass ${s.card}`} data-flip={flip} data-group={p.group} aria-labelledby={`p-${p.slug}`}>
      <div className={s.media}>
        {p.image && (
          <Lightbox
            src={p.image.src}
            alt={p.image.alt}
            width={p.image.w}
            height={p.image.h}
            sizes="(max-width: 1024px) 100vw, 600px"
            fit={p.group === "automation" ? "contain" : "cover"}
          />
        )}
      </div>

      <div className={s.body}>
        <p className={s.meta}>
          <span className={s.num}>{p.number}</span>
          <span className="status" data-state={p.status.state}>
            {p.status.label}
          </span>
          <span className={s.kind}>{p.kind}</span>
        </p>
        <h3 id={`p-${p.slug}`} className={s.title}>
          <Link href={`/projects/${p.slug}`}>{p.title}</Link>
        </h3>
        <p className={s.tagline}>{p.tagline}</p>
        <StackChips stack={p.stack} />

        <div className={s.block}>
          <h4 className={s.label}>Problem</h4>
          <p>{p.problem}</p>
        </div>
        <div className={s.block}>
          <h4 className={s.label}>Key features</h4>
          <ul role="list" className={s.features}>
            {p.keyFeatures.map((f) => (
              <li key={f}>
                <Icon name="check" className={s.check} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className={s.block}>
          <h4 className={s.label}>Outcome</h4>
          <p>{p.outcome}</p>
        </div>

        <div className={s.actions}>
          <Link href={`/projects/${p.slug}`} className="btn btn-primary">
            Read case study <Icon name="arrowRight" />
          </Link>
          <AskButton intent={`project:${p.slug}`}>
            <Icon name="spark" /> Ask the assistant
          </AskButton>
          {p.links.live && (
            <a href={p.links.live} className="btn btn-ghost">
              Live <Icon name="arrowUpRight" />
            </a>
          )}
          {p.links.source && (
            <a href={p.links.source} className="btn btn-ghost">
              Code <Icon name="github" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
