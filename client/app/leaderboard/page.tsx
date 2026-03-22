import { getLeaderboard } from "@/actions/leaderboard";
import LeaderboardPodium from "@/components/leaderboard/LeaderboardPodium";
import { Trophy, ChevronRight, Zap, Target } from "lucide-react";
import Link from "next/link";

export default async function LeaderboardPage() {
  const result = await getLeaderboard();
  const profiles = result.profiles || [];
  
  const topThree = profiles.slice(0, 3);
  const remaining = profiles.slice(3);

  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-3">
                <Trophy size={26} className="text-black" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Global<br />Rankings</h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium italic max-w-md">
              The world's most trusted elite Stableford network. Top performers qualify for the £10,000 monthly prize pool.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Total Players</span>
              <span className="text-2xl font-black italic text-emerald-500">2,841</span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Avg Score</span>
              <span className="text-2xl font-black italic text-white">32.4</span>
            </div>
          </div>
        </div>

        <LeaderboardPodium topThree={topThree} />

        <div className="space-y-3">
          <div className="grid grid-cols-12 px-8 py-4 bg-white/5 rounded-t-2xl border-x border-t border-white/5">
            <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Rank</div>
            <div className="col-span-7 text-[10px] font-black uppercase tracking-widest text-zinc-500">Player</div>
            <div className="col-span-2 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Rolling 5</div>
            <div className="col-span-2 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</div>
          </div>

          {remaining.map((p: any, i: number) => (
            <div 
              key={p.id}
              className="grid grid-cols-12 items-center px-8 py-5 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group cursor-default"
            >
              <div className="col-span-1">
                <span className="text-sm font-black italic text-zinc-500 transition-colors group-hover:text-white">#{i + 4}</span>
              </div>
              <div className="col-span-7 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 overflow-hidden border border-white/5">
                  <img src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-white">{p.full_name || "Golfer"}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Verified Member</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-lg font-black italic text-emerald-500">{p.rolling_avg || 0}</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <Target size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 shrink-0">
                <Zap size={32} className="text-black fill-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-2">Claim Your Spot on the Green</h3>
                <p className="text-zinc-400 text-xs font-medium max-w-sm">Every round counts. Enter your latest score now to jump in the global ranks and qualify for the monthly draw.</p>
              </div>
            </div>
            <Link 
              href="/scores/new"
              className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-colors hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/10"
            >
              Enter Score
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
