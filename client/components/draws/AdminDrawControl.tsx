"use client";

import { useState } from "react";
import { adminGenerateDrawNumbers, adminProcessWinners, adminPublishDraw } from "@/actions/draws";
import { Settings, Play, Users, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDrawControl({ currentDraw }: { currentDraw: any }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setStatus("Generating Numbers...");
    const month = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const res = await adminGenerateDrawNumbers(month);
    if (res.error) alert(res.error);
    setStatus("Draw Generated. Ready to Process.");
    setLoading(false);
  };

  const handleProcess = async () => {
    if (!currentDraw) return;
    setLoading(true);
    setStatus("Analyzing Matches...");
    const res = await adminProcessWinners(currentDraw.id);
    if (res.error) alert(res.error);
    setStatus(`Processed ${res.winnerCount} matches for ${currentDraw.draw_month}.`);
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!currentDraw) return;
    setLoading(true);
    setStatus("Publishing Results...");
    const res = await adminPublishDraw(currentDraw.id);
    if (res.error) alert(res.error);
    setStatus("Draw Published Successfully.");
    setLoading(false);
  };

  return (
    <div className="mb-12 p-8 bg-zinc-900/50 border border-emerald-500/20 rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <Settings size={20} className="text-black" />
        </div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Championship Admin</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={handleGenerate}
          disabled={loading || (currentDraw && !currentDraw.is_published)}
          className="p-6 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/50 transition-all flex flex-col items-center gap-3 group disabled:opacity-50"
        >
          <Play size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Generate Draw</span>
        </button>

        <button 
          onClick={handleProcess}
          disabled={loading || !currentDraw || currentDraw.is_published}
          className="p-6 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/50 transition-all flex flex-col items-center gap-3 group disabled:opacity-50"
        >
          <Users size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Process Winners</span>
        </button>

        <button 
          onClick={handlePublish}
          disabled={loading || !currentDraw || currentDraw.is_published}
          className="p-6 rounded-2xl bg-emerald-500 text-black hover:bg-white transition-all flex flex-col items-center gap-3 group disabled:opacity-50"
        >
          <Check size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Publish Results</span>
        </button>
      </div>

      {status && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center gap-3"
        >
          {loading ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{status}</span>
        </motion.div>
      )}
    </div>
  );
}
