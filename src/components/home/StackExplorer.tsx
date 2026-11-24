"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROJECTS } from "@/content/projects";
import { TOOLS, iconSrc } from "@/content/tools";
import s from "./Stack.module.css";

type Pick = { kind: "tool" | "project"; slug: string } | null;

export default function StackExplorer() {
  const [pick, setPick] = useState<Pick>(null);

  // The hero's orbiting icons link to #stack-<tool>: arriving that way selects the tool.
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#stack-(.+)$/);
      if (m && TOOLS.some((t) => t.slug === m[1])) setPick({ kind: "tool", slug: m[1]! });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const toolOn = (slug: string) => {
    if (!pick) return null;
    if (pick.kind === "tool") return pick.slug === slug;
    return TOOLS.find((t) => t.slug === slug)?.usedIn.includes(pick.slug) ?? false;
  };
  const projectOn = (slug: string) => {
    if (!pick) return null;
    if (pick.kind === "project") return pick.slug === slug;
    return TOOLS.find((t) => t.slug === pick.slug)?.usedIn.includes(slug) ?? false;
  };
  const toggle = (next: NonNullable<Pick>) =>
    setPick((cur) => (cur && cur.kind === next.kind && cur.slug === next.slug ? null : next));

  const picked = pick?.kind === "tool" ? TOOLS.find((t) => t.slug === pick.slug) : null;
  const pickedProject = pick?.kind === "project" ? PROJECTS.find((p) => p.slug === pick.slug) : null;
  const count = pick ? (pick.kind === "tool" ? picked?.usedIn.length ?? 0 : TOOLS.filter((t) => t.usedIn.includes(pick.slug)).length) : 0;

  return (
    <div className={s.explorer}>
      <ul role="list" className={s.grid} aria-label="Tools">
        {TOOLS.map((t) => {
          const on = toolOn(t.slug);
          return (
            <li key={t.slug} id={`stack-${t.slug}`}>
              <button
                type="button"
                className={`glass ${s.tool}`}
                data-on={on === null ? undefined : on}
                aria-pressed={pick?.kind === "tool" && pick.slug === t.slug}
                onClick={() => toggle({ kind: "tool", slug: t.slug })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconSrc(t.slug)} alt="" width={72} height={72} loading="lazy" />
                <span className={s.name}>{t.name}</span>
                <span className={s.role}>{t.role}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <aside className={`glass ${s.panel}`} aria-live="polite">
        <p className={s.panelHead}>
          {picked ? (
            <>
              <strong>{picked.name}</strong> is in {count} {count === 1 ? "project" : "projects"}
            </>
          ) : pickedProject ? (
            <>
              <strong>{pickedProject.title}</strong> uses {count} of these tools
            </>
          ) : (
            <>Pick a tool to see where I&rsquo;ve used it, or pick a project to see what went into it.</>
          )}
        </p>
        <ul role="list" className={s.projects}>
          {PROJECTS.map((p) => {
            const on = projectOn(p.slug);
            return (
              <li key={p.slug} data-on={on === null ? undefined : on}>
                <button
                  type="button"
                  className={s.project}
                  aria-pressed={pick?.kind === "project" && pick.slug === p.slug}
                  onClick={() => toggle({ kind: "project", slug: p.slug })}
                >
                  <span className={s.pNum}>{p.number}</span>
                  <span className={s.pTitle}>{p.title}</span>
                  <span className={s.pKind}>{p.kind}</span>
                </button>
                <Link href={`/projects/${p.slug}`} className={s.pLink} aria-label={`${p.title} case study`}>
                  ↗
                </Link>
              </li>
            );
          })}
        </ul>
        {pick && (
          <button type="button" className={s.clear} onClick={() => setPick(null)}>
            Clear selection
          </button>
        )}
      </aside>
    </div>
  );
}
