"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  // Flip this back to false if the certificate image isn't in place yet.
  // Drop the image at public/certification.webp before deploying with this on.
  const showCertification = true;

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

      {showCertification && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="clear-both mt-14"
        >
          <div className="label-mono text-brand-from">Certification</div>
          <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-line bg-panel/40 px-6 py-8 text-center sm:flex-row sm:items-center sm:justify-start sm:text-left">
            <div className="relative h-32 w-44 shrink-0 overflow-hidden rounded-xl border border-line bg-panel">
              <Image
                src="/certification.webp"
                alt="AI Automation certificate, TechCrush"
                fill
                sizes="176px"
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="font-semibold text-ink">AI Automation, TechCrush</div>
              <div className="mt-1 text-sm text-inkSoft">Issued August 31, 2026 · Credential TEC-6BF8BE3F</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
