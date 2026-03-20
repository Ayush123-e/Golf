import Link from "next/link";
import { Trophy, ArrowRight, ShieldCheck, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="text-black" size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight">GOLF<span className="text-emerald-500">HERO</span></span>
        </div>
        <Link 
          href="/dashboard"
          className="text-sm font-medium hover:text-emerald-400 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400">Trusted by 5,000+ Golfers</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-[0.9]">
          The Elite <br />
          <span className="text-emerald-500">Stableford</span> <br />
          Network
        </h1>
        
        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mb-12 font-medium">
          Track your Rolling 5, compete on global leaderboards, and enter monthly draws to win real prize pools.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="bg-emerald-500 text-black px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 group"
          >
            GET STARTED 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="bg-white/5 border border-white/10 px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition-all">
            LEARN MORE
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 w-full border-t border-white/5 pt-12">
          <FeatureCard 
            icon={<Target size={20} />} 
            title="Rolling 5" 
            desc="Only your latest 5 rounds count toward your handicap."
          />
          <FeatureCard 
            icon={<Trophy size={20} />} 
            title="Cash Prizes" 
            desc="Monthly prize pools distributed automatically to winners."
          />
          <FeatureCard 
            icon={<ShieldCheck size={20} />} 
            title="Global Rank" 
            desc="See how you stack up against the best in the community."
          />
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 px-6 text-center">
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          © 2026 GOLF HERO PLATFORM. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <div className="text-emerald-500 mb-4">{icon}</div>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed max-w-[200px]">{desc}</p>
    </div>
  );
}
