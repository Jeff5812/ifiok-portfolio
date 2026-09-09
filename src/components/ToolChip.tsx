"use client";

import { motion } from "framer-motion";
import { BrandIcon } from "./BrandIcon";

export function ToolChip({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2, scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-[13px] font-medium text-inkSoft shadow-sm transition-all duration-300 ease-premium hover:border-brand-from/60 hover:bg-panel2 hover:text-ink hover:shadow-glow"
    >
      <BrandIcon name={name} size={18} />
      {name}
    </motion.span>
  );
}
