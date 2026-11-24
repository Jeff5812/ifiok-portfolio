import Image from "next/image";
import Link from "next/link";
import AskButton from "@/components/chat/AskButton";
import Icon from "@/components/ui/Icon";
import Lightbox from "@/components/ui/Lightbox";
import { SITE } from "@/content/site";
import s from "./Closing.module.css";

const FACTS = ["Based in Nigeria", "Works remotely", "Python", "TypeScript", "SQL", "n8n"];

/** Bio, facts and certificate. On /about the title is the page's h1. */
export function About({ as: Heading = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="about" className={`wrap ${Heading === "h1" ? s.pageTop : "section"}`} aria-labelledby="about-title">
      <div className={s.about}>
        <div className={s.photoWrap} data-reveal>
          <div className={s.photo}>
            <Image
              src="/media/portrait.webp"
              alt="Ifiok Columba"
              width={820}
              height={1025}
              sizes="(max-width: 900px) 90vw, 460px"
              priority={Heading === "h1"}
            />
          </div>
        </div>

        <div className={s.aboutText}>
          <div data-reveal>
            <p className="eyebrow">About me</p>
            <Heading id="about-title" className={`h2 ${s.aboutTitle}`}>
              I build for the <em>conditions I know</em>
            </Heading>
          </div>
          <p className="lead" data-reveal>
            I&rsquo;m Ifiok Columba, a software and AI automation engineer based in Nigeria, working remotely. Most of
            what I build is shaped by where I build it: WhatsApp-first businesses, prices in naira, customers who write
            in Pidgin, free-tier infrastructure and connections that drop.
          </p>
          <p data-reveal>
            Before software, I trained as a nurse. In 2026 I completed TechCrush&rsquo;s AI Automation programme, and
            I&rsquo;ve kept going from workflows into full products: Python and TypeScript services, Postgres schemas that
            enforce their own rules, and evaluations that check the AI before anyone relies on it.
          </p>
          <ul role="list" className={s.facts} data-reveal>
            {FACTS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div className={`glass ${s.cert}`} data-reveal>
            <div className={s.certImg}>
              <Lightbox
                src="/media/certificate-techcrush.webp"
                alt="TechCrush certificate of completion in AI Automation, awarded to Ifiok Michael Columba"
                width={1200}
                height={855}
                sizes="220px"
                fit="contain"
              />
            </div>
            <div>
              <p className={s.certTitle}>AI Automation · TechCrush</p>
              <p className={s.certMeta}>15-week programme · issued 31 August 2026</p>
              <p className={s.certMeta}>Credential TEC-6BF8BE3F</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The closing call to action on the home page. */
export function ContactBand() {
  return (
    <section className="wrap section" aria-labelledby="band-title">
      <div className={`glass ${s.band}`} data-reveal>
        <div>
          <h2 id="band-title" className={`h2 ${s.bandTitle}`}>
            Let&rsquo;s build something that <em>doesn&rsquo;t guess</em>
          </h2>
          <p className={s.bandText}>{SITE.availability}.</p>
        </div>
        <div className={s.bandActions}>
          <AskButton intent="booking" className="btn btn-primary">
            Book a call <Icon name="arrowRight" />
          </AskButton>
          <Link href="/contact" className="btn btn-ghost">
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}
