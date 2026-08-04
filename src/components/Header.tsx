"use client";

import Link from "next/link";
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
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="focus-ring rounded-md">
          <Logo />
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-sm text-sm text-inkSoft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => onOpenChat("booking")}
          className="btn-primary focus-ring rounded-full px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Let&apos;s Work Together →
        </button>
      </div>
    </header>
  );
}
