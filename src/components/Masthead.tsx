"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import Card from "@/components/ui/Card";
import { transition } from "@/lib/motion";
import { openAssistant } from "@/components/assistant/open-assistant";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Masthead: Profile card with brand mark, availability indicator, menu,
 * avatar placeholder, name, title, and hero headline.
 * Replaces the full-width Hero section with a card-based approach.
 */
export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="space-y-6">
      {/* Top row: portrait avatar, availability, menu */}
      <div className="flex items-center justify-between">
        <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="/ifiok-portrait.png"
            alt="Ifiok Columba"
            fill
            sizes="40px"
            className="object-cover object-[50%_26%]"
          />
        </div>

        {/* Availability indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition(0.1)}
          className="flex items-center gap-1.5 label-mono text-ink-soft text-xs"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-live" />
          </span>
          {profile.availability === "available" && "Available"}
          {profile.availability === "limited" && "Limited"}
          {profile.availability === "unavailable" && "Unavailable"}
        </motion.div>

        {/* Menu trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 hover:bg-line/50 rounded-lg transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu dropdown */}
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0)}
          className="flex flex-col gap-3 pt-3 border-t border-line"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-ink-soft hover:text-ink transition-colors py-1.5"
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openAssistant();
            }}
            className="flex items-center gap-1.5 text-left text-sm font-medium text-ink transition-opacity hover:opacity-70 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask Columba
          </button>
        </motion.nav>
      )}

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition(0.15)}
        className="space-y-2"
      >
        {/* Name and title */}
        <div>
          <h2 className="text-lg font-medium text-ink">{profile.name}</h2>
          <p className="text-sm text-ink-soft">{profile.role}</p>
        </div>
      </motion.div>

      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition(0.2)}
        className="space-y-4"
      >
        <h1 className="text-2xl sm:text-3xl font-medium leading-tight text-ink">
          Hi, I&apos;m {profile.shortName} <span className="signal-gradient">{profile.heroDisplayTitle}</span>
        </h1>

        {/* Subheadline */}
        <div className="space-y-3">
          {profile.subhead.map((paragraph, i) => (
            <p key={i} className="text-base text-ink-soft leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </Card>
  );
}