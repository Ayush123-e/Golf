"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500">
          <AlertTriangle size={36} />
        </div>
        
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-4">System Interruption</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-12">
          The platform encountered an unexpected network desync. Our engineers have been notified.
        </p>

        <button
          onClick={() => reset()}
          className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black italic uppercase text-xs tracking-tighter rounded-2xl mx-auto hover:bg-emerald-500 transition-all active:scale-95"
        >
          <RefreshCcw size={16} />
          REINITIALIZE SESSION
        </button>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent)]" />
      </div>
    </div>
  );
}
