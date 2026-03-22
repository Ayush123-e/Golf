"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Phone, Heart, Percent, Zap, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import PremiumBackground from "@/components/ui/PremiumBackground";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [charities, setCharities] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    phone: "",
    charityId: "",
    percentage: 10,
    plan: "monthly"
  });
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchCharities() {
      const { data } = await supabase.from("charities").select("*");
      if (data) setCharities(data);
    }
    fetchCharities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Subscription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden pt-24">
      <PremiumBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
            <Zap size={14} className="text-emerald-400 fill-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Phase 2: Level Up Your Game</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Join The <span className="text-emerald-500">Championship</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Unlock rolling 5 scores and support your cause</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8">
          

          <div className="grid grid-cols-2 gap-4">
            <PlanCard 
              active={formData.plan === "monthly"} 
              title="Monthly" 
              price="£9.99" 
              onClick={() => setFormData({ ...formData, plan: "monthly" })} 
            />
            <PlanCard 
              active={formData.plan === "yearly"} 
              title="Yearly" 
              price="£99" 
              badge="Best Value"
              onClick={() => setFormData({ ...formData, plan: "yearly" })} 
            />
          </div>


          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 flex items-center gap-2">
              <Phone size={12} /> Contact Number
            </label>
            <input 
              type="tel" 
              placeholder="+44 7000 000000"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 transition-all font-medium"
            />
          </div>


          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 flex items-center gap-2">
              <Heart size={12} /> Select Your Charity
            </label>
            <select 
              required
              value={formData.charityId}
              onChange={(e) => setFormData({ ...formData, charityId: e.target.value })}
              className="w-full bg-black text-white border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 transition-all font-medium appearance-none"
            >
              <option value="" disabled>Choose a cause to support...</option>
              {charities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {charities.length === 0 && <option value="temp">Global Golf Conservation</option>}
            </select>
          </div>


          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Percent size={12} /> Contribution %
              </label>
              <span className="text-emerald-500 font-black italic">{formData.percentage}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="50" 
              step="5"
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center mt-2">Minimum 10% Required for Draw Eligibility</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
          >
            {loading ? "Initializing Secure Payment..." : "Proceed to Checkout"}
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">
          Securely Processed by Stripe • © 2026 GOLF HERO
        </p>
      </motion.div>
    </div>
  );
}

function PlanCard({ active, title, price, badge, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden group ${
        active ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : "border-white/5 bg-black/40 hover:border-white/10"
      }`}
    >
      {badge && (
        <span className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
          {badge}
        </span>
      )}
      <div className="flex justify-between items-start mb-4">
        <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${active ? "text-emerald-400" : "text-zinc-500"}`}>{title}</h4>
        {active && <Check size={16} className="text-emerald-500" />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black italic uppercase tracking-tighter">{price}</span>
        <span className="text-zinc-500 text-[10px] font-bold">/m</span>
      </div>
    </div>
  );
}
