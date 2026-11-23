import type { Metadata } from "next";
import type { CSSProperties } from "react";
import AskButton from "@/components/chat/AskButton";
import { ContactBand } from "@/components/home/Closing";
import { ServicesGrid } from "@/components/home/Offer";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import s from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI-powered web apps, WhatsApp and Telegram assistants, workflow automation, AI agents and integrations, document pipelines and knowledge assistants, built by Ifiok Columba.",
  alternates: { canonical: "/services" },
};

const STEPS = [
  { title: "A short conversation", text: "What's eating up your team's time, and whether automation is actually the right fix for it." },
  { title: "A plain-language plan", text: "What triggers the system, what it decides, what it does at the end, and where a person stays in the loop." },
  { title: "The build", text: "Connected to your real tools and data, with tests and the failure paths built in, not bolted on." },
  { title: "Review and go live", text: "You review it, I adjust it, and it ships with documentation that says plainly what's done and what isn't." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        lead="What I can build for you. Every service maps to a project you can inspect, so you can see how I'd approach yours."
        actions={
          <AskButton intent="booking" className="btn btn-primary">
            Book a call <Icon name="arrowRight" />
          </AskButton>
        }
      >
        How I can <em>help</em>
      </PageHeader>

      <div className="wrap">
        <ServicesGrid />
      </div>

      <section className="wrap section" aria-labelledby="process-title">
        <SectionTitle eyebrow="Process" id="process-title" lead="How a project goes, from first message to live.">
          Working <em>together</em>
        </SectionTitle>
        <ol role="list" className={s.steps}>
          {STEPS.map((st, i) => (
            <li key={st.title} className={`glass ${s.step}`} data-reveal style={{ "--delay": `${i * 90}ms` } as CSSProperties}>
              <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <ContactBand />
    </>
  );
}
