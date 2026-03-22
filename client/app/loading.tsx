"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: 1 }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative"
      >
        <Zap size={48} className="text-emerald-500 blur-sm absolute inset-0" />
        <Zap size={48} className="text-emerald-500 relative z-10" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500"
      >
        Syncing Network Performance
      </motion.p>
    </div>
  );
}
