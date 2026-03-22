"use client";

import { motion } from "framer-motion";
import { Check, Dot } from "lucide-react";

interface UserDrawEntryProps {
  entry: any;
  drawNumbers: number[];
  isPublished: boolean;
}

export default function UserDrawEntry({ entry, drawNumbers, isPublished }: UserDrawEntryProps) {
  if (!entry) return (
    <div className="p-8 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl text-center">
       <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">No entry detected for this month.</p>
       <p className="text-zinc-600 text-[10px] uppercase font-medium mt-2">Add 5 scores to automatically qualify.</p>
    </div>
  );

  const matchedIndices = entry.scores.map((s: number) => drawNumbers.includes(s));
  const matchCount = matchedIndices.filter(Boolean).length;

  return (
    <div className="p-10 bg-zinc-900/30 border border-white/5 rounded-[3rem] backdrop-blur-md">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Your Entry Numbers</h3>
          <p className="text-zinc-600 text-[9px] font-medium italic uppercase">Generated from your latest 5 championship rounds</p>
        </div>
        
        {isPublished && (
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
               matchCount >= 3 ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {matchCount >= 3 ? <Check size={14} className="stroke-[3]" /> : <Dot size={14} />}
              {matchCount} Matches
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        {entry.scores.map((num: number, i: number) => {
          const isMatch = isPublished && drawNumbers.includes(num);
          return (
            <div 
              key={i}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${
                isMatch 
                  ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/30 rotate-3 scale-110' 
                  : 'bg-black border border-white/5 text-zinc-400'
              }`}
            >
              <span className={`text-xl font-black italic ${isMatch ? 'text-black' : 'text-zinc-400'}`}>{num}</span>
            </div>
          );
        })}
      </div>

      {isPublished && matchCount >= 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
        >
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            Congratulations! You've matched {matchCount} numbers.
          </p>
          <p className="text-zinc-500 text-[9px] font-medium mt-1">
            Check your profile for prize distribution details.
          </p>
        </motion.div>
      )}
    </div>
  );
}
