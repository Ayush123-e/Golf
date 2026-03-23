"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext: string;
  color?: string;
}

export default function AdminStatCard({ label, value, icon: Icon, subtext, color = "emerald" }: AdminStatCardProps) {
  const colorMap = {
    emerald: "bg-emerald-500 text-black",
    white: "bg-white text-black",
    zinc: "bg-zinc-800 text-white"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden group"
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-4">{label}</p>
          <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">{value}</h3>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{subtext}</p>
        </div>
        
        <div className={`p-4 rounded-2xl ${colorMap[color as keyof typeof colorMap]} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
    </motion.div>
  );
}
