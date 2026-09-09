"use client";

import { motion } from "framer-motion";
import { BrandIcon } from "./BrandIcon";

export function ToolChip({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ duration: 0.35, delay }}
      className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-3.5 py-2 text-[13px] text-inkSoft transition-colors hover:border-brand-from/50 hover:text-ink"
    >
      <BrandIcon name={name} size={18} />
      {name}
    </motion.span>
  );
}
