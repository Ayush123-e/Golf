"use client";

import { motion } from "framer-motion";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`overflow-hidden relative bg-zinc-900 ${className}`}>
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
      />
    </div>
  );
}
