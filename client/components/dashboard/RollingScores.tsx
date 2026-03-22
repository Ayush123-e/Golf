import { createClient } from '@/lib/supabase';
import { Trophy, AlertCircle, TrendingUp, TrendingDown, Minus, History, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function RollingScores() {
  const supabase = await createClient();
  
  const { data: scores } = await supabase
    .from('scores')
    .select('score, played_at')
    .order('played_at', { ascending: false })
    .limit(10);

  const currentScores = scores?.slice(0, 5) || [];
  const scoreCount = currentScores.length;
  const previousScores = scores?.slice(5, 10) || [];
  
  const currentAvg = currentScores.length > 0 
    ? currentScores.reduce((acc, s) => acc + s.score, 0) / currentScores.length 
    : 0;
    
  const previousAvg = previousScores.length > 0 
    ? previousScores.reduce((acc, s) => acc + s.score, 0) / previousScores.length 
    : 0;

  const trend = currentAvg > previousAvg ? 'up' : currentAvg < previousAvg ? 'down' : 'stable';
  
  const chartPoints = [...currentScores].reverse().map((s, i) => ({
    x: i * 25,
    y: 60 - (s.score / 45) * 50
  }));

  const pathD = chartPoints.length > 0 
    ? `M ${chartPoints[0].x} ${chartPoints[0].y} ${chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` 
    : '';

  return (
    <section className="px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Trophy size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Championship Rounds</h3>
        </div>
        <Link href="/history" className="text-[9px] text-zinc-500 hover:text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors">
          <History size={12} />
          Full History
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {currentScores.map((s, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all hover:scale-105 cursor-default ${
              i === 0 
                ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                : 'bg-zinc-900 border-white/5'
            }`}
          >
            <span className={`text-lg font-black italic tracking-tighter ${i === 0 ? 'text-white' : 'text-zinc-400'}`}>
              {s.score}
            </span>
            <div className="flex flex-col leading-none">
              <span className={`text-[8px] font-black uppercase ${i === 0 ? 'text-emerald-500' : 'text-zinc-600'}`}>Points</span>
              <span className="text-[7px] text-zinc-500 font-bold uppercase mt-0.5">
                {new Date(s.played_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          </div>
        ))}
        
        {Array(5 - scoreCount).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="h-[52px] w-[80px] rounded-full border border-dashed border-zinc-800 flex items-center justify-center opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
             <Sparkles size={20} className="text-orange-500" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Performance Insight</h4>
            <p className="text-xs font-bold text-zinc-300 leading-tight italic">
              {trend === 'up' && "You're absolutely Dialed in! Performance is trending higher than last week. 🔥"}
              {trend === 'down' && "Tough stretch, but the network believes in the comeback. Focus on the next round. 🏌️‍♂️"}
              {trend === 'stable' && "Consistent striking! You're holding your position in the global network."}
              {scoreCount < 5 && "Build your legacy! Add more rounds to unlock deep performance insights."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="relative">
            <svg width="100" height="60" className="opacity-40">
              <path
                d={pathD}
                fill="none"
                stroke={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#71717a'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute top-0 right-0 flex items-center gap-1 text-[8px] font-black uppercase text-zinc-600">
               <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               Live Trend
            </div>
          </div>
        </div>
      </div>

      {scoreCount < 5 && (
        <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
          <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-[11px] text-emerald-200/50 font-medium">
            Record {5 - scoreCount} more rounds to qualify for the <span className="text-emerald-500 font-bold tracking-widest uppercase">£10,000 April Draw</span>.
          </p>
        </div>
      )}
    </section>
  );
}
