import Link from "next/link";
import RouterDemo from "@/components/demos/RouterDemo";
import { ContactBand } from "@/components/home/Closing";
import Hero from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/Offer";
import Stats from "@/components/home/Stats";
import Work from "@/components/home/Work";
import Icon from "@/components/ui/Icon";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Work />

      <section id="demo" className="wrap section" aria-labelledby="demo-title">
        <SectionTitle
          eyebrow="Try it"
          id="demo-title"
          lead="The real decision logic from my loan collections router, running in your browser. Pick an account, change what the AI read, and see where the code sends it."
        >
          The AI suggests. <em>The code decides.</em>
        </SectionTitle>
        <div data-reveal>
          <RouterDemo />
        </div>
      </section>

      <section className="wrap section" aria-labelledby="services-title">
        <SectionTitle
          eyebrow="Services"
          id="services-title"
          lead="What I can build for you. Every service maps to work you can inspect."
          aside={
            <Link href="/services" className="btn btn-ghost">
              All services <Icon name="arrowRight" />
            </Link>
          }
        >
          How I can <em>help</em>
        </SectionTitle>
        <ServicesGrid limit={3} />
      </section>

      <ContactBand />
    </>
  );
}
