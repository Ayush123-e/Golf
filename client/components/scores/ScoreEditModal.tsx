"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Loader2, Check, Target } from "lucide-react";
import { updateScore } from "@/actions/entries";
import { useRouter } from "next/navigation";

interface ScoreEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: {
    id: string;
    score: number;
    played_at: string;
  } | null;
}

export default function ScoreEditModal({ isOpen, onClose, scoreData }: ScoreEditModalProps) {
  const [score, setScore] = useState<number>(scoreData?.score || 36);
  const [date, setDate] = useState(scoreData?.played_at || new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Reset state when modal opens with new data
  useState(() => {
    if (scoreData) {
      setScore(scoreData.score);
      setDate(scoreData.played_at);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreData) return;
    
    setLoading(true);
    const result = await updateScore(scoreData.id, score, date);
    
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
            <button onClick={onClose} title="Close" className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Target size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">Update Round</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Edit Performance</p>
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
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Entry Updated</h3>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center">
                <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block mb-6">Correct Stableford Points</label>
                <div className="flex items-center justify-center gap-10">
                  <button 
                    type="button" 
                    onClick={() => setScore(Math.max(0, score - 1))}
                    title="Decrease Score"
                    className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 text-2xl font-bold hover:bg-emerald-500 hover:text-black transition-all active:scale-95"
                  >
                    -
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-8xl font-black italic text-white tracking-tighter leading-none">{score}</span>
                    <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Points</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setScore(Math.min(45, score + 1))}
                    title="Increase Score"
                    className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 text-2xl font-bold hover:bg-emerald-500 hover:text-black transition-all active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <label htmlFor="round-date" className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block mb-4 text-center">Round Date</label>
                <div className="relative group max-w-xs mx-auto">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors pointer-events-none" size={20} />
                  <input 
                    id="round-date"
                    type="date" 
                    title="Round Date"
                    max={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white font-bold outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">📅</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Round Entry"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
