import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icon";
import SectionTitle from "@/components/ui/SectionTitle";
import s from "./Method.module.css";

const GH = "https://github.com/Jeff5812";

const RULES = [
  {
    title: "The AI suggests, my code decides",
    body: "The model reads the message or screenshot and suggests what should happen. Then plain code, with no AI in it, checks whether that's allowed.",
    proof: { label: "chatreceipt · TECHNICAL_DECISIONS.md", href: `${GH}/chatreceipt/blob/main/TECHNICAL_DECISIONS.md` },
  },
  {
    title: "Important rules live in the database",
    body: "Double bookings, one customer seeing another customer's records, or an approved record being changed later are blocked by Postgres itself, so the data stays right even if the app or the model gets something wrong.",
    proof: { label: "meridian · schema.sql", href: `${GH}/ifiok-automation-demos/blob/main/meridian-scheduling-agent/schema.sql` },
  },
  {
    title: "Doing it twice is always safe",
    body: "Messages arrive twice, workers stall and uploads drop halfway. I build things so running the same step again can't double anything.",
    proof: { label: "chatreceipt · jobs.py", href: `${GH}/chatreceipt/blob/main/backend/app/engine/jobs.py` },
  },
  {
    title: "Not sure? Ask a person",
    body: "When the system isn't confident, it doesn't act on its own. It asks the customer, flags the record or passes it to a person.",
    proof: { label: "chatreceipt · review_policy.py", href: `${GH}/chatreceipt/blob/main/backend/app/intelligence/review_policy.py` },
  },
  {
    title: "Test it and write it down",
    body: "I test the AI on data it hasn't seen, look at the worst mistakes first, and keep a written list of what isn't finished yet.",
    proof: { label: "chatreceipt · TESTING.md", href: `${GH}/chatreceipt/blob/main/TESTING.md` },
  },
];

export default function Method() {
  return (
    <section id="method" className="wrap section" aria-labelledby="method-title">
      <SectionTitle
        eyebrow="How I work"
        id="method-title"
        lead="These run through everything I build, and each one links to the file in my code where you can see it."
      >
        Five rules I <em>stick to</em>
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
              I write the product&rsquo;s rules first, then use AI coding agents to build against them. I check their
              code the same way I check any model output, with tests, evaluations and live checks, before it ships. You
              can see this in my repos, co-authored commits included.
            </p>
            <a href={`${GH}/chatreceipt/blob/main/CLAUDE.md`} className={s.proof}>
              See Chat Receipt&rsquo;s rules file <Icon name="arrowUpRight" />
            </a>
          </article>
        </li>
      </ol>
    </section>
  );
}
