"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";

interface HeroPerformanceCardProps {
  avgScore: number;
  trend: 'up' | 'down' | 'stable';
  trendValue?: string;
  onEnterScore: () => void;
}

export default function HeroPerformanceCard({ avgScore, trend, trendValue, onEnterScore }: HeroPerformanceCardProps) {
  return (
    <div className="mx-6 mb-8 relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-800/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Your Performance</p>
            <div className="flex items-baseline gap-4">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {avgScore.toFixed(1)}
              </motion.span>
              <div className="flex flex-col">
                <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-none">Avg Score</span>
                <div className={`flex items-center gap-1.5 mt-2 font-black text-[10px] uppercase tracking-widest ${
                  trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-zinc-500'
                }`}>
                  {trend === 'up' && <TrendingUp size={14} className="animate-bounce" />}
                  {trend === 'down' && <TrendingDown size={14} className="animate-bounce" />}
                  {trend === 'stable' && <Minus size={14} />}
                  {trendValue || trend}
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onEnterScore}
            className="bg-emerald-500 hover:bg-white text-black px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 group/btn"
          >
            Enter Today's Score
            <Zap size={18} className="fill-black group-hover/btn:animate-pulse" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
             <span className="block text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Status</span>
             <span className="text-[10px] font-black uppercase text-emerald-400">Championship Ready</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
             <span className="block text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Rank</span>
             <span className="text-[10px] font-black uppercase text-white">#482 Globally</span>
          </div>
        </div>
      </div>
    </div>
  );
}
