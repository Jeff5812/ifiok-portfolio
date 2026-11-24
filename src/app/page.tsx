import Link from "next/link";
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

      <section className="wrap section" aria-labelledby="services-title">
        <SectionTitle
          eyebrow="Services"
          id="services-title"
          lead="What I can build for you. Each one links to a project where I've done it before."
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
