"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitStablefordScore } from "@/actions/entries";
import { Calendar, ChevronRight, Loader2 } from "lucide-react";

export default function ScoreEntryForm() {
  const [score, setScore] = useState<number>(36);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await submitStablefordScore(score, date);
    
    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-md">

      <div className="text-center">
        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Stableford Points</label>
        <div className="flex items-center justify-center gap-8 mt-6">
          <button 
            type="button" 
            onClick={() => setScore(Math.max(0, score - 1))} 
            className="w-14 h-14 rounded-2xl bg-zinc-800 text-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all active:scale-95 border border-white/5"
          >
            -
          </button>
          <span className="text-8xl font-black text-emerald-400 tabular-nums drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">{score}</span>
          <button 
            type="button" 
            onClick={() => setScore(Math.min(45, score + 1))} 
            className="w-14 h-14 rounded-2xl bg-zinc-800 text-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all active:scale-95 border border-white/5"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-6">

        <div className="space-y-2">
          <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest ml-2">Round Date</label>
          <div className="relative group">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all font-bold uppercase text-xs tracking-widest"
            />
          </div>
        </div>


        <button 
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-white disabled:opacity-50 text-black font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-emerald-500/20 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              CONFIRM SCORE & RECORD
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
