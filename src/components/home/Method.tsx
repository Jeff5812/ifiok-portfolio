import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icon";
import SectionTitle from "@/components/ui/SectionTitle";
import s from "./Method.module.css";

const GH = "https://github.com/Jeff5812";

const RULES = [
  {
    title: "The AI suggests. The code decides.",
    body: "The model reads the message or the screenshot and proposes what should happen. A small piece of code with no AI in it decides what's allowed.",
    proof: { label: "chatreceipt · TECHNICAL_DECISIONS.md", href: `${GH}/chatreceipt/blob/main/TECHNICAL_DECISIONS.md` },
  },
  {
    title: "Rules live in the database.",
    body: "Double bookings, one customer seeing another's records, an approved record quietly edited: stopped by Postgres itself, whatever the app or the model gets wrong.",
    proof: { label: "meridian · schema.sql", href: `${GH}/ifiok-automation-demos/blob/main/meridian-scheduling-agent/schema.sql` },
  },
  {
    title: "Every retry is safe.",
    body: "Messages arrive twice, workers stall, uploads drop halfway. Everything is built so doing it again can't double anything.",
    proof: { label: "chatreceipt · jobs.py", href: `${GH}/chatreceipt/blob/main/backend/app/engine/jobs.py` },
  },
  {
    title: "Not sure? Ask a person.",
    body: "Low confidence never acts alone. It asks the customer, flags the record, or hands the case to a human.",
    proof: { label: "chatreceipt · review_policy.py", href: `${GH}/chatreceipt/blob/main/backend/app/intelligence/review_policy.py` },
  },
  {
    title: "Measure it, honestly.",
    body: "Evaluations on held-out data, the worst failures reported first, and a written list of what isn't finished yet.",
    proof: { label: "chatreceipt · TESTING.md", href: `${GH}/chatreceipt/blob/main/TESTING.md` },
  },
];

export default function Method() {
  return (
    <section id="method" className="wrap section" aria-labelledby="method-title">
      <SectionTitle
        eyebrow="How I work"
        id="method-title"
        lead="Five rules run through everything I build. Each one links to the file where it's enforced."
      >
        AI you can <em>trust</em> with real work
      </SectionTitle>

      <ol role="list" className={s.rules}>
        {RULES.map((r, i) => (
          <li key={r.title} data-reveal style={{ "--delay": `${(i % 3) * 90}ms` } as CSSProperties}>
            <article className={`glass ${s.rule}`}>
              <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.title}>{r.title}</h3>
              <p className={s.body}>{r.body}</p>
              <a href={r.proof.href} className={s.proof}>
                {r.proof.label} <Icon name="arrowUpRight" />
              </a>
            </article>
          </li>
        ))}
        <li data-reveal style={{ "--delay": "180ms" } as CSSProperties}>
          <article className={`glass ${s.rule} ${s.ai}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/3d/claude.webp" alt="" width={64} height={64} className={s.aiIcon} />
            <h3 className={s.title}>How I build with AI agents</h3>
            <p className={s.body}>
              I write the product&rsquo;s rules first, then direct AI coding agents to build against them. Their code
              gets the same treatment as any model output: tests, evals and live checks decide what ships. It&rsquo;s
              all in the repos, co-authored commits included.
            </p>
            <a href={`${GH}/chatreceipt/blob/main/CLAUDE.md`} className={s.proof}>
              Read a product constitution <Icon name="arrowUpRight" />
            </a>
          </article>
        </li>
      </ol>
    </section>
  );
}
