"use client";

import { motion } from "framer-motion";
import { BrandIcon } from "./BrandIcon";

const SOCIALS = [
  { name: "github", label: "GitHub", handle: "@Jeff5812", href: "https://github.com/Jeff5812" },
  { name: "x", label: "X", handle: "@rust_automates", href: "https://x.com/rust_automates" },
  { name: "gmail", label: "Email", handle: "wizicolumba@gmail.com", href: "mailto:wizicolumba@gmail.com" },
  {
    name: "upwork",
    label: "Upwork",
    handle: "View my profile",
    href: "https://www.upwork.com/freelancers/~01c94dc22db54d989f",
  },
];

export default function Contact({
  onOpenChat,
}: {
  onOpenChat: (intent?: string) => void;
}) {
  return (
    <div className="bg-panel/40">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
        <div className="label-mono text-brand-from">Contact</div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
          Got a workflow worth automating?
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-inkSoft sm:max-w-md sm:text-base">
          Tell me what&apos;s eating your team&apos;s time, I&apos;ll tell you honestly
          whether automation is the right fix for it.
        </p>
        <button
          onClick={() => onOpenChat("booking")}
          className="btn-primary focus-ring mt-8 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Let&apos;s Work Together →
        </button>

        <div className="mx-auto mt-12 flex max-w-md flex-col gap-3 md:mt-14">
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target={s.name === "gmail" ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="focus-ring flex items-center gap-4 rounded-xl border border-line bg-panel px-5 py-4 text-left transition-colors hover:border-brand-from/50"
            >
              <BrandIcon name={s.name} size={26} />
              <div>
                <div className="text-sm font-semibold text-ink">{s.label}</div>
                <div className="break-all text-xs text-inkSoft">{s.handle}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
