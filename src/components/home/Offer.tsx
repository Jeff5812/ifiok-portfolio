import Link from "next/link";
import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icon";
import { PROJECTS } from "@/content/projects";
import { SERVICES, SKILLS } from "@/content/offer";
import { iconSrc } from "@/content/tools";
import s from "./Offer.module.css";

const titleOf = (slug: string) => PROJECTS.find((p) => p.slug === slug)?.title ?? slug;

/** Skill groups, each skill linked to the project that proves it (as on the previous site). */
export function SkillsGrid() {
  return (
    <div className={s.skills}>
      {SKILLS.map((g, i) => (
        <div key={g.label} data-reveal style={{ "--delay": `${i * 100}ms` } as CSSProperties}>
          <section className={`glass ${s.group}`} aria-labelledby={`sk-${i}`}>
            <header className={s.groupHead}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconSrc(g.icon)} alt="" width={52} height={52} />
              <h2 id={`sk-${i}`}>{g.label}</h2>
            </header>
            <ul role="list" className={s.skillList}>
              {g.items.map((it) => (
                <li key={it.name}>
                  <Link href={`/projects/${it.project}`} className={s.skill}>
                    <span>{it.name}</span>
                    <small>{titleOf(it.project)} ↗</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ))}
    </div>
  );
}

/** Service cards; the home page shows the first three, /services shows them all. */
export function ServicesGrid({ limit }: { limit?: number }) {
  const items = limit ? SERVICES.slice(0, limit) : SERVICES;
  return (
    <ul role="list" className={s.services}>
      {items.map((sv, i) => (
        <li key={sv.title} data-reveal style={{ "--delay": `${(i % 3) * 90}ms` } as CSSProperties}>
          <article className={`glass ${s.service}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconSrc(sv.icon)} alt="" width={64} height={64} className={s.serviceIcon} />
            <h3 className={s.serviceTitle}>{sv.title}</h3>
            <p className={s.serviceText}>{sv.description}</p>
            <Link href={`/projects/${sv.project}`} className={s.serviceLink}>
              See it in {titleOf(sv.project)} <Icon name="arrowUpRight" />
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
