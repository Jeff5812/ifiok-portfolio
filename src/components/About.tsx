"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="label-mono text-brand-from">About Me</div>
      </motion.div>

      {/* Bordered card, image left-aligned on top, paragraph left-aligned below it */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 flex flex-col items-start gap-6 rounded-3xl border border-line bg-panel/40 p-6 sm:p-8"
      >
        {/* Photo — left-aligned, ~30% smaller than the original */}
        <div className="relative aspect-[4/5] w-56 overflow-hidden rounded-2xl border border-line bg-panel sm:w-60">
          <Image
            src="/portrait.png"
            alt="Ifiok Columba"
            fill
            sizes="240px"
            className="object-cover object-top"
          />
        </div>

        {/* Text — left-aligned, sitting directly below the photo */}
        <div className="max-w-xl space-y-5 text-inkSoft" style={{ lineHeight: 1.7 }}>
          <p>
            I&apos;m Ifiok Columba, an AI Automation Engineer who designs intelligent systems that solve real business problems, not just automate tasks.
          </p>
          <p>
            I specialize in building AI agents, workflow automations, and backend integrations that reduce manual effort, improve decision-making, and create reliable operational processes. My work combines n8n, modern AI models, APIs, databases, and cloud infrastructure into systems that businesses can depend on every day.
          </p>
          <p>
            Every project begins with understanding the business before writing a single workflow. I enjoy breaking down complex processes, identifying bottlenecks, and engineering practical solutions that are scalable, maintainable, and measurable.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="clear-both mt-14"
      >
        <div className="label-mono text-brand-from">Certification</div>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-panel/40 px-6 py-14 text-center">
          <span className="label-mono text-inkSoft">Certificate coming soon</span>
          <span className="max-w-xs text-xs text-inkSoft">
            This slot is reserved and sized for a certificate image. Drop it in
            public/certification.png and it renders here automatically.
          </span>
        </div>
      </motion.div>
    </div>
  );
}