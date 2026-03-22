"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Zap } from "lucide-react";

interface DrawHeroProps {
  draw: any;
}

export default function DrawHero({ draw }: DrawHeroProps) {
  if (!draw) return null;

  return (
    <div className="relative group p-8 bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden mb-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Monthly Draw</span>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">{draw.draw_month}</h2>
          </div>
          <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {draw.is_published ? "RESULTS LIVE" : "LIVE POOL"}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          {draw.is_published ? (
             draw.draw_numbers.map((num: number, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-zinc-900 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/10"
                >
                  <span className="text-2xl md:text-3xl font-black italic text-emerald-400">{num}</span>
                </motion.div>
             ))
          ) : (
            <div className="flex flex-col items-center gap-6 py-6">
               <div className="flex gap-4">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-16 h-16 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center">
                       <Zap size={20} className="text-zinc-800" />
                    </div>
                  ))}
               </div>
               <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Draw Closing soon</span>
               </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5">
           <div>
              <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest block mb-1">Total Pool</span>
              <span className="text-xl font-black italic text-white uppercase tracking-tighter">£{draw.total_prize_pool.toLocaleString()}</span>
           </div>
           <div>
              <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest block mb-1">Participants</span>
              <span className="text-xl font-black italic text-zinc-400 uppercase tracking-tighter">2,841</span>
           </div>
        </div>
      </div>
    </div>
  );
}
