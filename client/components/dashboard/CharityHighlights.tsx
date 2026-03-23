"use client";

import { Heart, Globe, Star } from "lucide-react";
import { motion } from "framer-motion";

const highLights = [
  {
    name: "Save the Green",
    desc: "Global conservation efforts for golf biodiversity.",
    icon: <Globe size={18} />,
    color: "bg-blue-500"
  },
  {
    name: "Junior Golf Fund",
    desc: "Providing equipment to underprivileged youth.",
    icon: <Star size={18} />,
    color: "bg-amber-500"
  }
];

export default function CharityHighlights() {
  return (
    <section className="px-6 py-6 pb-48">
       <div className="flex items-center justify-between mb-6 px-2">
         <h3 className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em]">Charity Impact</h3>
         <Heart className="text-emerald-500 w-4 h-4" />
       </div>
       
       <div className="grid grid-cols-2 gap-4">
         {highLights.map((item, i) => (
           <motion.div 
             key={i}
             whileHover={{ y: -5 }}
             className="p-5 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl"
           >
             <div className={`w-10 h-10 ${item.color} rounded-xl mb-4 flex items-center justify-center text-white shadow-lg shadow-black/40`}>
               {item.icon}
             </div>
             <h4 className="text-[12px] font-black uppercase tracking-tight text-white mb-2">{item.name}</h4>
             <p className="text-[10px] text-zinc-400 font-bold leading-tight uppercase tracking-widest">{item.desc}</p>
           </motion.div>
         ))}
       </div>
    </section>
  );
}
