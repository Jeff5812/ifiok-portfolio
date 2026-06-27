"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import { transition, viewportOnce } from "@/lib/motion";

export default function AppsSection() {
  const { apps } = profile;

  return (
    <section id="work" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={transition(0)}
            className="text-4xl font-medium tracking-tight text-ink sm:text-5xl"
          >
            {apps.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={transition(0.1)}
            className="label-mono max-w-md text-ink-soft lg:justify-self-end lg:text-right"
          >
            {apps.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={transition(0.2)}
          className="mt-16"
        >
          <WorkflowCanvas />
        </motion.div>
      </div>
    </section>
  );
}
