"use client";

import { PieChart, Zap, TrendingUp, DollarSign } from "lucide-react";

export default function PrizePoolInfo({ draw }: { draw: any }) {
  if (!draw) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Zap size={20} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Jackpot</span>
        </div>
        <div>
          <h4 className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">5 Numbers</h4>
          <span className="text-2xl font-black italic text-emerald-400 uppercase tracking-tighter leading-none">
            £{(draw.total_prize_pool * 0.40).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <PieChart size={20} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Silver Pool</span>
        </div>
        <div>
          <h4 className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">4 Numbers</h4>
          <span className="text-2xl font-black italic text-zinc-100 uppercase tracking-tighter leading-none">
            £{(draw.total_prize_pool * 0.35).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-orange-500" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Bronze Pool</span>
        </div>
        <div>
          <h4 className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">3 Numbers</h4>
          <span className="text-2xl font-black italic text-orange-500 uppercase tracking-tighter leading-none">
            £{(draw.total_prize_pool * 0.25).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
