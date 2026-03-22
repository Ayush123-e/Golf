import ScoreEntryForm from "@/components/scores/ScoreEntryForm";
import { Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PremiumBackground from "@/components/ui/PremiumBackground";

export default function NewScorePage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      <PremiumBackground />
      
      <div className="max-w-xl mx-auto relative z-10 pt-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Trophy size={24} className="text-emerald-500" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Record Round</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium italic">
            Enter your Stableford points from today's performance. Results will impact your Rolling 5 average and Global Rank.
          </p>
        </div>

        <ScoreEntryForm />

        <div className="mt-10 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-md">
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 flex-shrink-0 animate-pulse" />
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Only your <strong className="text-emerald-500">last 5 rounds</strong> define your current standing. Entering a new score will automatically phase out your 6th oldest round to keep the competition fierce and current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
