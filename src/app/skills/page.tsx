import type { Metadata } from "next";
import { SkillsGrid } from "@/components/home/Offer";
import StackExplorer from "@/components/home/StackExplorer";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Ifiok Columba's skills in software engineering, AI engineering and automation, each linked to the project that proves it, and the tools behind them.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Skills"
        lead="Software engineering and AI automation, side by side. Every skill links to the project that proves it."
      >
        What I <em>work with</em>
      </PageHeader>

      <div className="wrap">
        <SkillsGrid />
      </div>

      <section id="stack" className="wrap section" aria-labelledby="stack-title">
        <SectionTitle
          eyebrow="Tools"
          id="stack-title"
          lead="Pick a tool to see where I've used it, or a project to see what it's made of."
        >
          The tools <em>behind the work</em>
        </SectionTitle>
        <div data-reveal>
          <StackExplorer />
        </div>
      </section>
    </>
  );
}
