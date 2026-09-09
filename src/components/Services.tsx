"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SERVICES } from "@/content/services";

export default function Services({
  onOpenChat,
  featuredOnly = false,
  showViewAll = false,
}: {
  onOpenChat: (intent?: string) => void;
  featuredOnly?: boolean;
  showViewAll?: boolean;
}) {
  const items = featuredOnly ? SERVICES.slice(0, 3) : SERVICES;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
        <div>
          <div className="label-mono text-brand-from">Services</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl md:text-5xl">
            {featuredOnly ? "How I can help" : "What I can build for you"}
          </h2>
        </div>
        {showViewAll && (
          <Link
            href="/services"
            className="btn-ghost focus-ring rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
          >
            See all services →
          </Link>
        )}
      </div>

      {/* 1 col mobile → 2 col tablet → 3 col desktop */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {items.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.title}
              onClick={() => onOpenChat("booking")}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="focus-ring group flex flex-col items-start gap-4 rounded-2xl border border-line bg-panel px-6 py-7 text-left transition-colors hover:border-brand-from/50 hover:bg-panel2"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-panel2 text-brand-from transition-transform group-hover:scale-110">
                <Icon size={26} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inkSoft">{s.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
