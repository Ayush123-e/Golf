"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Zap } from "lucide-react";
import CountdownTimer from "../ui/CountdownTimer";

interface DrawHeroProps {
  currentDraw: any;
  nextDrawDate: string;
}

export default function DrawHero({ currentDraw, nextDrawDate }: DrawHeroProps) {
  return (
    <div className="relative p-12 lg:p-20 bg-zinc-900 border border-white/5 rounded-[4rem] overflow-hidden group mb-12">
      <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 bg-emerald-500 rounded-full text-[10px] font-black uppercase text-black italic tracking-widest">
              Live Prize Pool
            </div>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">{currentDraw?.draw_month || "Active Session"}</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter uppercase mb-8 group-hover:scale-[1.02] transition-transform duration-700">
            £{(currentDraw?.total_pool || 0).toLocaleString()}
          </h1>

          <div className="flex flex-wrap gap-8 items-center">
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">DRIVING TOWARDS DRAW</p>
              <CountdownTimer targetDate={nextDrawDate} />
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-[300px]">
          <div className="absolute inset-0 w-full h-full bg-emerald-500/5 blur-[80px] rounded-full scale-150 group-hover:scale-100 transition-transform duration-1000 ease-out" />
          
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            {currentDraw?.is_published ? (
              currentDraw.draw_numbers.map((num: number, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white text-black flex items-center justify-center font-black italic text-2xl lg:text-3xl shadow-[0_0_40px_rgba(255,255,255,0.3)] border-4 border-emerald-500"
                >
                  {num}
                </motion.div>
              ))
            ) : (
              <div className="text-center">
                <Trophy size={80} className="text-white/10 mb-6 mx-auto animate-bounce" />
                <p className="text-xs font-black uppercase text-zinc-500 tracking-widest">Numbers locked until month end</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
