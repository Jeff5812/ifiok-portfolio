"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import Icon from "@/components/ui/Icon";
import s from "./Nav.module.css";

// The previous site's menu, now with a page for each section.
const LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={s.bar} data-scrolled={scrolled || open}>
      <div className={`wrap ${s.inner}`}>
        <Link href="/" className={s.logo} aria-label="Ifiok Columba, home">
          ifiok<span>.</span>
        </Link>

        <nav aria-label="Main" className={s.pill}>
          <ul role="list">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={s.link} aria-current={isActive(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/contact" className={`btn btn-ghost ${s.cta}`}>
          <Icon name="send" />
          Let&rsquo;s talk
        </Link>

        <button
          type="button"
          className={s.burger}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id={menuId} className={s.sheet} hidden={!open}>
        <ul role="list">
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
              <Link href={l.href} onClick={() => setOpen(false)} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
          Let&rsquo;s talk
        </Link>
      </div>
    </header>
  );
}
