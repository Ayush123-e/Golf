import { createClient } from '@server/lib/supabaseServer';
import { Trophy, AlertCircle } from 'lucide-react';

export default async function RollingScores() {
  const supabase = await createClient();
  
  const { data: scores } = await supabase
    .from('scores')
    .select('score, played_at')
    .order('played_at', { ascending: false })
    .limit(5);

  const scoreCount = scores?.length || 0;
  const placeholders = Array(5 - scoreCount).fill(null);

  return (
    <section className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Your Rolling 5</h3>
        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
          {scoreCount}/5 Scores
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {scores?.map((s, i) => (
          <div key={i} className="aspect-square rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-emerald-400 tracking-tighter">{s.score}</span>
            <span className="text-[8px] text-emerald-500/60 uppercase font-bold">Pts</span>
          </div>
        ))}

        {placeholders.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-xl bg-zinc-900/50 border border-dashed border-zinc-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>

      {scoreCount < 5 && (
        <div className="mt-4 flex items-center gap-2 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-[11px] text-amber-200/70 font-medium">
            Add {5 - scoreCount} more scores to qualify for the <span className="text-amber-500 font-bold">£10,000 Draw</span>.
          </p>
        </div>
      )}
    </section>
  );
}
