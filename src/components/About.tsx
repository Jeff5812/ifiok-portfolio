"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="label-mono text-brand-from">About</div>
        <h1 className="mt-2 font-mono text-3xl font-bold md:text-4xl">Hey, I&apos;m Ifiok.</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-line bg-panel md:float-right md:ml-8 md:mt-2 md:w-64"
      >
        <Image
          src="/portrait.png"
          alt="Ifiok Columba"
          fill
          sizes="(min-width: 768px) 256px, 320px"
          className="object-cover object-top"
        />
      </motion.div>

      <div className="mt-6 space-y-5 leading-relaxed text-inkSoft">
        <p>
          I&apos;m an AI automation engineer. I design and build AI agents, n8n
          workflows, and integrations that take repetitive, judgment-heavy
          manual work off a business&apos;s plate: the kind of work that
          usually means someone checking a spreadsheet at 6am or manually
          deciding which of two hundred delinquent accounts needs a phone
          call today.
        </p>
        <p>
          My core tool is n8n for orchestration: form triggers, branching
          logic, retries, and multi-step escalation paths. On top of that I
          bring in LLMs (OpenAI, Gemini) where a workflow needs actual
          judgment instead of a fixed rule: scoring risk, reading sentiment,
          deciding which channel a message should go out on, with a
          confidence threshold that routes anything uncertain to a human
          instead of guessing. The data and integration layer underneath is
          PostgreSQL and Supabase for storage, and Gmail, Google Workspace,
          and WhatsApp for the channels the workflow actually acts through.
        </p>
        <p>
          I recently completed a hands-on AI automation bootcamp, and I like
          projects with a real, specific problem behind them: a clinic
          that&apos;s losing track of patients, a loan book that needs
          consistent follow-up. If it&apos;s repetitive, rule-shaped in parts
          and judgment-shaped in others, and currently costing someone hours
          a week, that&apos;s the kind of problem I want to automate.
        </p>
      </div>

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
