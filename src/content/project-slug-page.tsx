"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolChip } from "@/components/ToolChip";
import { ImageLightbox } from "@/components/ImageLightbox";
import { projects } from "@/content/projects";
import { useChat } from "@/context/ChatContext";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <div className="label-mono text-brand-from">{title}</div>
      <div className="mt-3 text-inkSoft">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-from" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectCaseStudyPage() {
  const { openChat } = useChat();
  const params = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === params.slug);

  if (!project || !project.caseStudy) notFound();

  const cs = project.caseStudy;

  return (
    <main>
      <Header onOpenChat={openChat} />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-16">
        <Link href="/projects" className="label-mono text-brand-from hover:underline">
          ← All projects
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{project.title}</h1>
        <p className="mt-3 text-lg text-inkSoft">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <ToolChip key={s} name={s} />
          ))}
        </div>

        <div className="mt-8">
          <ImageLightbox
            src={project.screenshot}
            alt={`${project.title} — full workflow canvas`}
            className="aspect-video"
          />
        </div>

        <div className="mt-10">
          <Section title="Architecture">
            {cs.architecture.split("\n\n").map((para, i) => (
              <p key={i} className={i > 0 ? "mt-3" : ""}>
                {para}
              </p>
            ))}
          </Section>

          <Section title="Engineering Decisions">
            <BulletList items={cs.decisions} />
          </Section>

          <Section title="Challenges & Solutions">
            <BulletList items={cs.challenges} />
          </Section>

          <Section title="Error Handling">
            <BulletList items={cs.errorHandling} />
          </Section>

          <Section title="Retry Strategy">
            <BulletList items={cs.retryStrategy} />
          </Section>

          <Section title="Privacy & Security Considerations">
            <BulletList items={cs.security} />
          </Section>

          <Section title="What I Learned">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-ink">What worked well</div>
                <p className="mt-1">{cs.whatWorkedWell}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Biggest technical challenge</div>
                <p className="mt-1">{cs.biggestChallenge}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">How I&apos;d improve it in production</div>
                <p className="mt-1">{cs.improveInProduction}</p>
              </div>
            </div>
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
