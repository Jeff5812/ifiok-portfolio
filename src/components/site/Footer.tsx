import Link from "next/link";
import Socials from "@/components/ui/Socials";
import { SITE } from "@/content/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.inner}`}>
        <div className={s.brand}>
          <Link href="/" className={s.logo} aria-label="Ifiok Columba, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/3d/ic-logo.webp" alt="" width={36} height={36} />
            <span>{SITE.name}</span>
          </Link>
          <p className={s.copy}>
            © 2026 {SITE.name} · {SITE.role}. <a href={SITE.links.source}>Source on GitHub</a>.
          </p>
        </div>
        <nav aria-label="Footer" className={s.nav}>
          <Link href="/projects">Projects</Link>
          <Link href="/skills">Skills</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Socials size={40} />
      </div>
    </footer>
  );
}
