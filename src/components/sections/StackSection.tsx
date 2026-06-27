"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/content/skills";
import { transition, viewportOnce } from "@/lib/motion";

export default function StackSection() {
  return (
    <section id="stack" className="border-b border-line scroll-mt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <p className="label-mono text-ink-soft mb-3">Tools & technologies</p>
        <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink max-w-2xl">
          The stack behind the systems.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={transition(i * 0.08)}
            >
              <p className="label-mono text-ink-soft mb-4 border-b border-line pb-3">
                {group.category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-ink/85">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
