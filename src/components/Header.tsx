"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ onOpenChat }: { onOpenChat: (intent?: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="focus-ring rounded-md">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-sm font-sans text-sm font-medium text-brand-from transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={() => onOpenChat("booking")}
          className="btn-primary focus-ring hidden rounded-full px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0 md:block"
        >
          Let&apos;s Work Together →
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="focus-ring flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md md:hidden"
        >
          <span
            className="block h-0.5 w-5 bg-ink transition-transform duration-300"
            style={{ transform: menuOpen ? "translateY(4px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-0.5 w-5 bg-ink transition-opacity duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-0.5 w-5 bg-ink transition-transform duration-300"
            style={{ transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile dropdown nav */}
      {menuOpen && (
        <div className="border-t border-line/70 bg-base/95 px-6 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="focus-ring rounded-lg px-2 py-3 font-sans text-sm font-medium text-brand-from transition-colors hover:bg-panel hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => { setMenuOpen(false); onOpenChat("booking"); }}
            className="btn-primary focus-ring mt-4 w-full rounded-full py-3 text-sm font-medium text-white shadow-glow"
          >
            Let&apos;s Work Together →
          </button>
        </div>
      )}
    </header>
  );
}
