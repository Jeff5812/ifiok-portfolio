"use client";

import { motion } from "framer-motion";

export default function ChatTrigger({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={open ? "Close chat" : "Open IC Assistant chat"}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "fixed",
        bottom: "max(20px, env(safe-area-inset-bottom))",
        right: "max(20px, env(safe-area-inset-right))",
        zIndex: 2147483000,
      }}
      className="btn-primary focus-ring flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white shadow-glow"
    >
      {open ? "✕" : "IC"}
    </motion.button>
  );
}
