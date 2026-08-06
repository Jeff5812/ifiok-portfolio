"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ToolChip } from "./ToolChip";

const TOOLS = ["n8n", "OpenAI", "Gemini", "Python", "PostgreSQL", "Supabase"];

export default function Hero({ onOpenChat }: { onOpenChat: (intent?: string) => void }) {
  return (
    <section id="home" className="relative overflow-hidden border-b border-line/70">
      <div className="circuit-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 md:gap-12 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="label-mono inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-brand-from">
            <span className="grad-text">⚡ AUTOMATION ENGINEER</span>
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            I build <span className="grad-text">automations</span>
            <br /> that save time and
            <br /> drive results.
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-inkSoft sm:text-lg">
            I am Ifiok Columba. I design and build AI agents, workflows,
            and integrations that take repetitive manual work off your
            team&apos;s plate, so people spend less time on busywork and
            more time on what actually needs a human.
          </p>

          {/* Mobile portrait — only shown on small screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-line bg-panel shadow-glow md:hidden"
          >
            <Image
              src="/portrait.png"
              alt="Ifiok Columba"
              fill
              sizes="320px"
              className="object-cover object-top"
              priority
            />
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="btn-primary focus-ring rounded-full px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              ⟶ View My Projects
            </a>
            <button
              onClick={() => onOpenChat("booking")}
              className="btn-ghost focus-ring rounded-full border border-line px-5 py-3 text-sm font-medium text-ink"
            >
              ✉ Get In Touch
            </button>
          </div>

          <div className="mt-12">
            <div className="label-mono text-inkSoft">Tools I work with</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOOLS.map((t, i) => (
                <ToolChip key={t} name={t} delay={i * 0.05} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Desktop portrait — hidden on mobile (shown inline above instead) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative hidden md:block"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-panel shadow-glow">
            <Image
              src="/portrait.png"
              alt="Ifiok Columba"
              fill
              sizes="(min-width: 768px) 384px, 90vw"
              className="object-cover object-top"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
