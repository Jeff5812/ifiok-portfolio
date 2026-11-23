import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AskButton from "@/components/chat/AskButton";
import RouterDemo from "@/components/demos/RouterDemo";
import Icon from "@/components/ui/Icon";
import Lightbox from "@/components/ui/Lightbox";
import StackChips from "@/components/ui/StackChips";
import { PROJECTS, bySlug, neighbours } from "@/content/projects";
import s from "./case.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title}: case study`,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} · Ifiok Columba`, description: p.tagline },
  };
}

function List({ items }: { items: string[] }) {
  return (
    <ul role="list" className={s.list}>
      {items.map((it) => (
        <li key={it}>
          <Icon name="check" className={s.check} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const cs = p.caseStudy;
  const { prev, next } = neighbours(p.slug);

  const sections = [
    { id: "status", title: "Project status" },
    { id: "architecture", title: "Architecture" },
    ...(p.slug === "loan-collections-router" ? [{ id: "demo", title: "Try the router" }] : []),
    { id: "decisions", title: "Engineering decisions" },
    { id: "challenges", title: "Challenges" },
    { id: "failure", title: "When things fail" },
    { id: "security", title: "Security" },
    { id: "lessons", title: "What I learned" },
    { id: "next", title: "What's next" },
  ];

  return (
    <article className="wrap">
      <nav className={s.crumbs} aria-label="Breadcrumb">
        <Link href="/projects">Projects</Link> <span aria-hidden>/</span> <span>{p.title}</span>
      </nav>

      <header className={s.header}>
        <div className={s.headText} data-reveal>
          <p className={s.meta}>
            <span className={s.num}>{p.number}</span>
            <span className="status" data-state={p.status.state}>
              {p.status.label}
            </span>
            <span>{p.kind}</span>
            <span>{p.date}</span>
          </p>
          <h1 className={s.title}>{p.title}</h1>
          <p className={s.tagline}>{p.tagline}</p>
          <div className={s.actions}>
            {p.links.live && (
              <a href={p.links.live} className="btn btn-primary">
                Visit the live site <Icon name="arrowUpRight" />
              </a>
            )}
            {p.links.source && (
              <a href={p.links.source} className={`btn ${p.links.live ? "btn-ghost" : "btn-primary"}`}>
                View the code <Icon name="github" />
              </a>
            )}
            <AskButton intent={`project:${p.slug}`}>
              <Icon name="spark" /> Ask the assistant
            </AskButton>
          </div>
          <StackChips stack={p.stack} />
        </div>
        <div className={s.hero} data-reveal>
          {p.image && (
            <Lightbox
              src={p.image.src}
              alt={p.image.alt}
              width={p.image.w}
              height={p.image.h}
              sizes="(max-width: 1024px) 100vw, 640px"
              fit={p.group === "automation" ? "contain" : "cover"}
              priority
            />
          )}
        </div>
      </header>

      <section className={s.overview} aria-label="Overview">
        {[
          { label: "The problem", text: p.problem },
          { label: "The solution", text: p.solution },
          { label: "The outcome", text: p.outcome },
        ].map((b, i) => (
          <div key={b.label} className={`glass ${s.card}`} data-reveal style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
            <h2 className={s.cardLabel}>{b.label}</h2>
            <p>{b.text}</p>
          </div>
        ))}
      </section>

      <section className={`glass ${s.features}`} aria-labelledby="features-title" data-reveal>
        <h2 id="features-title" className={s.h2}>
          Key features
        </h2>
        <List items={p.keyFeatures} />
        <ul role="list" className={s.proof}>
          {p.proof.map((pr) => (
            <li key={pr}>{pr}</li>
          ))}
        </ul>
      </section>

      <div className={s.layout}>
        <aside className={s.toc} aria-label="On this page">
          <p className={s.tocTitle}>On this page</p>
          <ol role="list">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`}>{sec.title}</a>
              </li>
            ))}
          </ol>
        </aside>

        <div className={s.content}>
          <section id="status" className={s.section} data-reveal>
            <h2 className={s.h2}>Project status</h2>
            <p className={s.lead}>{cs.projectStatus}</p>
          </section>

          <section id="architecture" className={s.section} data-reveal>
            <h2 className={s.h2}>Architecture</h2>
            {cs.architecture.split("\n\n").map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
            {p.gallery?.map((g) => (
              <figure key={g.src} className={s.figure}>
                <div className={s.figureImg}>
                  <Lightbox src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="(max-width: 1024px) 100vw, 760px" fit="contain" />
                </div>
                {g.caption && <figcaption>{g.caption}</figcaption>}
              </figure>
            ))}
          </section>

          {p.slug === "loan-collections-router" && (
            <section id="demo" className={s.section} data-reveal>
              <h2 className={s.h2}>Try the router</h2>
              <p>
                The workflow&rsquo;s decision path, running in your browser: pick an account, then change what the AI
                read and watch where the code sends it.
              </p>
              <RouterDemo />
            </section>
          )}

          <section id="decisions" className={s.section} data-reveal>
            <h2 className={s.h2}>Engineering decisions</h2>
            <List items={cs.decisions} />
          </section>

          <section id="challenges" className={s.section} data-reveal>
            <h2 className={s.h2}>Challenges</h2>
            <List items={cs.challenges} />
          </section>

          <section id="failure" className={s.section} data-reveal>
            <h2 className={s.h2}>When things fail</h2>
            <div className={s.twoCol}>
              <div className={`glass ${s.card}`}>
                <h3 className={s.cardLabel}>Error handling</h3>
                <List items={cs.errorHandling} />
              </div>
              <div className={`glass ${s.card}`}>
                <h3 className={s.cardLabel}>Retries</h3>
                <List items={cs.retryStrategy} />
              </div>
            </div>
          </section>

          <section id="security" className={s.section} data-reveal>
            <h2 className={s.h2}>Security</h2>
            <List items={cs.security} />
          </section>

          <section id="lessons" className={s.section} data-reveal>
            <h2 className={s.h2}>What I learned</h2>
            <div className={s.twoCol}>
              <div className={`glass ${s.card}`}>
                <h3 className={s.cardLabel}>What worked well</h3>
                <p>{cs.whatWorkedWell}</p>
              </div>
              <div className={`glass ${s.card}`}>
                <h3 className={s.cardLabel}>Biggest challenge</h3>
                <p>{cs.biggestChallenge}</p>
              </div>
            </div>
          </section>

          <section id="next" className={s.section} data-reveal>
            <h2 className={s.h2}>What&rsquo;s next</h2>
            {cs.futureImprovements.length > 0 ? (
              <List items={cs.futureImprovements} />
            ) : (
              <p>Kept deliberately small: new features wait for a concrete reason from the client.</p>
            )}
          </section>

          <section className={`glass ${s.cta}`} data-reveal>
            <h2 className={s.ctaTitle}>Have something like this in mind?</h2>
            <p>Tell me about it, or ask the assistant anything about how {p.title} works.</p>
            <div className={s.actions}>
              <AskButton intent="booking" className="btn btn-primary">
                Book a call <Icon name="arrowRight" />
              </AskButton>
              <AskButton intent={`project:${p.slug}`}>Ask about {p.title}</AskButton>
            </div>
          </section>
        </div>
      </div>

      <nav className={s.pager} aria-label="More projects">
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className={`glass ${s.pageLink}`}>
            <small>← Previous</small>
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/projects/${next.slug}`} className={`glass ${s.pageLink} ${s.pageNext}`}>
            <small>Next →</small>
            <span>{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
