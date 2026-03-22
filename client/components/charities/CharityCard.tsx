"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CharityCardProps {
  charity: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export default function CharityCard({ charity, isSelected, onSelect, loading }: CharityCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
        isSelected ? 'bg-emerald-500 border-transparent' : 'bg-zinc-900/50 border-white/5 hover:border-emerald-500/30'
      }`}
    >
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent opacity-60 z-10" />
      
      <div className="relative h-64 overflow-hidden">
        <img 
          src={charity.image_url} 
          alt={charity.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
        />
        <div className="absolute top-6 right-6 z-20">
          <div className={`p-3 rounded-2xl backdrop-blur-xl border ${
            isSelected ? 'bg-black text-emerald-500 border-white/10' : 'bg-white/5 text-zinc-500 border-white/5 group-hover:text-emerald-500'
          }`}>
            <Heart size={20} className={isSelected ? 'fill-emerald-500' : ''} />
          </div>
        </div>
      </div>

      <div className="p-8 relative z-20 -mt-20">
        <h3 className={`text-2xl font-black italic tracking-tighter uppercase mb-2 ${
          isSelected ? 'text-black' : 'text-white'
        }`}>
          {charity.name}
        </h3>
        <p className={`text-[10px] font-bold uppercase tracking-widest line-clamp-2 leading-relaxed mb-8 ${
          isSelected ? 'text-black/60' : 'text-zinc-500'
        }`}>
          {charity.description}
        </p>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelect(charity.id)}
            disabled={loading || isSelected}
            className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
              isSelected 
                ? 'bg-black text-emerald-500 cursor-default' 
                : 'bg-emerald-500 text-black hover:bg-white active:scale-95'
            }`}
          >
            {isSelected ? 'CURRENTLY SUPPORTING' : 'SUPPORT THIS CAUSE'}
          </button>
          
          <Link 
            href={`/charities/${charity.id}`}
            className={`p-4 rounded-2xl border transition-all ${
              isSelected 
                ? 'border-black/10 text-black hover:bg-black/5' 
                : 'border-white/10 text-white hover:bg-white/5'
            }`}
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
