"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import BrandMark from "@/components/ui/BrandMark";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Stack", href: "/#stack" },
  { label: "Journey", href: "/#journey" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-canvas/90 backdrop-blur-md border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-medium tracking-tight"
          onClick={() => setOpen(false)}
        >
          <BrandMark size={36} />
          <span className="hidden sm:inline text-[15px]">{profile.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label-mono-lg text-ink-soft hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1.5 label-mono text-ink-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-live" />
            </span>
            Open to work
          </span>
          <Link
            href="/#contact"
            className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-canvas transition-all duration-300 hover:opacity-85 hover:scale-[1.02]"
          >
            Get in touch
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden flex h-9 w-9 items-center justify-center"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex flex-col gap-1.5">
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }}
              className="h-px w-5 bg-ink block"
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              className="h-px w-5 bg-ink block"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }}
              className="h-px w-5 bg-ink block"
            />
          </div>
        </button>
      </div>

      {open && (
        <motion.nav
          id="mobile-nav"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-line bg-canvas overflow-hidden"
        >
          <div className="flex flex-col px-5 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-lg tracking-tight border-b border-line last:border-none"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-canvas"
            >
              Get in touch
            </Link>
          </div>
        </motion.nav>
      )}
    </header>
  );
}
