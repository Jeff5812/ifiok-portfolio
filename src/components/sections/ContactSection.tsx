"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { transition, viewportOnce } from "@/lib/motion";

export default function ContactSection() {
  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--signal-violet) 25%, transparent) 0%, color-mix(in srgb, var(--signal-teal) 18%, transparent) 45%, transparent 75%)",
        }}
      />
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={transition(0)}
          className="flex flex-col items-start"
        >
          <p className="label-mono text-ink-soft mb-4">
            Open for freelance work &amp; full-time roles
          </p>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-ink max-w-md leading-[1.1]">
            Ready to fix your operations?
          </h2>
          <p className="mt-6 max-w-xl text-base text-ink-soft leading-relaxed">
            If your business is dealing with messy processes, scattered tools,
            or too much manual work, I can help you fix it.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={transition(0.1)}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href={profile.social.email}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-canvas transition-all duration-300 hover:opacity-85 hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
            {profile.social.linkedin && (
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:bg-canvas-raised hover:scale-[1.02]"
              >
                Connect on LinkedIn
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            )}
            <a
              href={profile.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:bg-canvas-raised hover:scale-[1.02]"
            >
              {profile.social.twitterHandle} on X
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
