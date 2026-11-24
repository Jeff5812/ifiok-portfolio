import type { Metadata } from "next";
import AskButton from "@/components/chat/AskButton";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmail from "@/components/contact/CopyEmail";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import { SITE } from "@/content/site";
import { iconSrc } from "@/content/tools";
import s from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ifiok Columba about a project, a role or a question.",
  alternates: { canonical: "/contact" },
};

// As on the previous contact page: each profile with its real logo and handle.
const PROFILES = [
  { slug: "gmail", label: "Email", handle: SITE.email, href: `mailto:${SITE.email}` },
  { slug: "github", label: "GitHub", handle: "@Jeff5812", href: SITE.links.github },
  { slug: "x", label: "X", handle: "@rust_automates", href: SITE.links.x },
  { slug: "upwork", label: "Upwork", handle: "View my profile", href: SITE.links.upwork },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        lead="Tell me what you're building, or what's taking up your team's time. If AI or automation isn't the right fix, I'll tell you."
      >
        Get in <em>touch</em>
      </PageHeader>

      <div className={`wrap ${s.grid}`}>
        <div className={s.side} data-reveal>
          <CopyEmail email={SITE.email} />
          <ul role="list" className={s.profiles}>
            {PROFILES.map((p) => (
              <li key={p.slug}>
                <a href={p.href} className={`glass ${s.profile}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconSrc(p.slug)} alt="" width={48} height={48} />
                  <span>
                    <strong>{p.label}</strong>
                    <small>{p.handle}</small>
                  </span>
                  <Icon name="arrowUpRight" className={s.go} />
                </a>
              </li>
            ))}
          </ul>
          <div className={`glass ${s.assist}`}>
            <p>
              <strong>Prefer to chat?</strong> IC, my AI assistant, can answer questions about my work and pass your
              details to me.
            </p>
            <AskButton intent="booking" className="btn btn-ghost">
              Book a call with IC
            </AskButton>
          </div>
          <p className={s.availability}>
            <span className="status" data-state="ok">
              {SITE.availability}
            </span>
          </p>
        </div>

        <div data-reveal>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
