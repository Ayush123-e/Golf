"use client";

import { Heart, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export default function MyCharityWidget({ charity }: { charity?: Charity }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Heart size={20} className="text-black fill-black" />
          </div>
          <div>
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Your Impact</h3>
            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">Direct from your Subscription</p>
          </div>
        </div>
        
        <Link 
          href="/charities" 
          className="p-3 bg-black hover:bg-emerald-500 text-zinc-500 hover:text-black rounded-xl border border-white/5 transition-all"
        >
          <Globe size={16} />
        </Link>
      </div>

      {charity ? (
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-black border border-white/5 overflow-hidden flex-shrink-0">
            <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover grayscale opacity-60" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black italic uppercase tracking-tighter text-white mb-1">{charity.name}</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest line-clamp-1 truncate w-40">{charity.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[9px] font-black italic text-emerald-500 uppercase tracking-widest">10% Active Share ✨</span>
            </div>
          </div>
          <Link 
            href="/charities" 
            className="p-4 bg-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-2xl transition-all"
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="py-2">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed mb-6">
            You haven&apos;t chosen a cause yet. 10% of your fee is currently in the general impact pool.
          </p>
          <Link 
            href="/charities" 
            className="w-full py-4 bg-emerald-500 hover:bg-white text-black font-black italic uppercase text-[10px] tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 group"
          >
            CHOOSE YOUR CAUSE
            <Heart size={14} className="group-hover:fill-emerald-500" />
          </Link>
        </div>
      )}
    </div>
  );
}
