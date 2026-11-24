import type { Metadata } from "next";
import { SkillsGrid } from "@/components/home/Offer";
import StackExplorer from "@/components/home/StackExplorer";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Ifiok Columba's skills in software engineering, AI engineering and automation, each linked to a project where he used it, plus the tools he works with.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Skills"
        lead="What I do on the software side and the automation side. Each skill links to a project where I used it."
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
          lead="Pick a tool to see where I've used it, or pick a project to see what went into it."
        >
          Tools I <em>use</em>
        </SectionTitle>
        <div data-reveal>
          <StackExplorer />
        </div>
      </section>
    </>
  );
}
