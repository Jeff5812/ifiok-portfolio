"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useChat } from "@/components/chat/ChatContext";
import s from "./Nav.module.css";

// The previous site's menu, with a page for each section.
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
  const { open: chatOpen, toggleChat } = useChat();
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/3d/ic-logo.webp" alt="" width={40} height={40} />
          <span>Ifiok Columba</span>
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

        <div className={s.right}>
          <button
            type="button"
            className={s.assistant}
            onClick={() => {
              setOpen(false);
              toggleChat();
            }}
            aria-expanded={chatOpen}
            aria-label={chatOpen ? "Close the assistant" : "Ask IC, my AI assistant"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/3d/mascot.webp" alt="" width={34} height={34} />
            <span className={s.assistantText}>{chatOpen ? "Close" : "Ask IC"}</span>
          </button>

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
      </div>
    </header>
  );
}
