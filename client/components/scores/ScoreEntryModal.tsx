"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ChevronRight, Loader2, Check, Target } from "lucide-react";
import { submitStablefordScore } from "@/actions/entries";
import { useRouter } from "next/navigation";

interface ScoreEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreEntryModal({ isOpen, onClose }: ScoreEntryModalProps) {
  const [score, setScore] = useState<number>(36);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await submitStablefordScore(score, date);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setLoading(false);
        router.refresh();
      }, 1500);
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-2xl shadow-emerald-500/5"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Target size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">Record Round</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Phase 3: Performance Sync</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative">
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                    >
                      <Check size={48} className="text-black stroke-[3]" />
                    </motion.div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Entry Authenticated</h3>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center">
                <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block mb-6">Course Performance (Stableford)</label>
                <div className="flex items-center justify-center gap-10">
                  <button 
                    type="button" 
                    onClick={() => setScore(Math.max(0, score - 1))}
                    className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 text-2xl font-bold hover:bg-emerald-500 hover:text-black transition-all active:scale-95"
                  >
                    -
                  </button>
                  <span className="text-9xl font-black text-emerald-400 tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">{score}</span>
                  <button 
                    type="button" 
                    onClick={() => setScore(Math.min(45, score + 1))}
                    className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 text-2xl font-bold hover:bg-emerald-500 hover:text-black transition-all active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 px-2">
                  <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest ml-1 text-left block">Tournament Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-[1.5rem] py-6 pl-16 pr-6 text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all font-bold uppercase text-[11px] tracking-widest"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading || success}
                  className="w-full bg-emerald-500 hover:bg-white text-black py-7 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-emerald-500/10 flex items-center justify-center gap-4 group/btn disabled:opacity-50"
                >
                  {loading && !success ? <Loader2 className="animate-spin" /> : (
                    <>
                      SYNC ROUND DATA
                      <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
