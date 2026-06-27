"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { transition, viewportOnce } from "@/lib/motion";

export default function PillarsSection() {
  return (
    <section id="about" className="border-b border-line scroll-mt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <p className="label-mono text-ink-soft mb-3">How I work</p>
        <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink max-w-2xl">
          A few things I&apos;m actually good at.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
          {profile.pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={transition(i * 0.09)}
              className="group relative flex flex-col gap-4 bg-canvas-raised p-8 sm:p-10 transition-colors duration-300 hover:bg-canvas"
            >
              <span className="label-mono inline-flex w-fit items-center rounded-full border border-line-strong px-2.5 py-1 text-ink-soft">
                {pillar.kind}
              </span>
              <h3 className="text-xl font-medium tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
