import type { Metadata } from "next";
import AskButton from "@/components/chat/AskButton";
import { ContactBand } from "@/components/home/Closing";
import { ServicesGrid } from "@/components/home/Offer";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI-powered web apps, WhatsApp and Telegram assistants, workflow automation, AI agents and integrations, document pipelines and knowledge assistants, built by Ifiok Columba.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        lead="Here's what I can build for you. Each service links to a project where I've done it before, so you can see how I'd approach yours."
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

      <ContactBand />
    </>
  );
}
