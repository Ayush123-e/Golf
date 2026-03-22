"use client";

import { CheckCircle2, Trophy, Heart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <CheckCircle2 className="text-emerald-500" size={24} />,
    title: "1. Log Your Rounds",
    desc: "Simply enter your Stableford points after every game. We keep it focused on your best performance."
  },
  {
    icon: <Trophy className="text-emerald-500" size={24} />,
    title: "2. Qualify for Draws",
    desc: "Maintain 5 active scores to automatically enter our £12,500+ monthly prize championships."
  },
  {
    icon: <Heart className="text-emerald-500" size={24} />,
    title: "3. Support Your Cause",
    desc: "10% of every subscription goes directly to your chosen charity. Play for more than just yourself."
  }
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-10">
      <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-2">How It Works</h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-start gap-4 hover:bg-white/10 transition-colors cursor-default"
          >
            <div className="shrink-0 p-3 bg-emerald-500/10 rounded-2xl">
              {step.icon}
            </div>
            <div>
              <h4 className="text-white font-black italic uppercase tracking-tight mb-1">{step.title}</h4>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
