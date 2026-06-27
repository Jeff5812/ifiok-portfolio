"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { transition } from "@/lib/motion";

/**
 * PortraitCard: Dedicated portrait card that renders the supplied portrait
 * asset from /public/ifiok-portrait.png.
 */
export default function PortraitCard() {
  return (
    <Card>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition(0.25)}
        className="relative overflow-hidden rounded-xl bg-line aspect-square"
      >
        <Image
          src="/ifiok-portrait.png"
          alt="Ifiok Columba"
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover object-[50%_26%]"
          priority
        />
      </motion.div>
    </Card>
  );
}
