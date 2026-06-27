"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import BrandMark from "@/components/ui/BrandMark";
import { transition } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Single accent glow for this entire view, anchored to the brand mark.
          Intentionally the only colored glow on the page; do not add a second. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 h-[460px] w-[460px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--signal-violet) 30%, transparent) 0%, color-mix(in srgb, var(--signal-teal) 22%, transparent) 42%, color-mix(in srgb, var(--signal-amber) 14%, transparent) 68%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition(0, 0.8)}
          className="flex justify-center mb-12 sm:mb-14"
        >
          <BrandMark size={120} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.1)}
          className="flex justify-center mb-8"
        >
          <span className="label-mono inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-canvas-raised px-3 py-1.5 text-ink-soft">
            <Sparkles className="h-3 w-3" />
            {profile.role}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.2)}
          className="mx-auto max-w-4xl text-center text-4xl sm:text-6xl lg:text-7xl font-medium leading-[1.08] tracking-tight text-ink"
        >
          {profile.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.3)}
          className="mx-auto mt-7 max-w-2xl text-center text-base sm:text-lg text-ink-soft leading-relaxed"
        >
          {profile.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.4)}
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition-all duration-300 hover:opacity-85 hover:scale-[1.02]"
          >
            See the work
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-all duration-300 hover:bg-canvas-raised hover:scale-[1.02]"
          >
            Start a project
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition(0.55, 0.8)}
          className="mx-auto mt-24 grid max-w-2xl grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-3"
        >
          {profile.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(0.6 + i * 0.09)}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="label-mono mt-1.5 text-ink-soft">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
