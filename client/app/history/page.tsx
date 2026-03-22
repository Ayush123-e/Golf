import { createClient } from '@/lib/supabase';
import { Trophy, Calendar, Target } from "lucide-react";
import Link from "next/link";
import PremiumBackground from "@/components/ui/PremiumBackground";
import { format } from 'date-fns';

export default async function HistoryPage() {
  const supabase = await createClient();
  
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .order('played_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      <PremiumBackground />
      
      <div className="max-w-2xl mx-auto relative z-10 pt-10">

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <Trophy size={24} className="text-zinc-500" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Round History</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium italic">
            Your complete performance record. Every round contributes to your legacy in the GOLF HERO network.
          </p>
        </div>

        <div className="space-y-3">
          {scores && scores.length > 0 ? (
            scores.map((s) => (
              <div 
                key={s.id}
                className="flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                    <span className="text-lg font-black text-white">{s.score}</span>
                    <span className="text-[7px] text-zinc-500 uppercase font-black tracking-widest">Points</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-emerald-400 transition-colors">Stableford Round</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={10} className="text-zinc-600" />
                      <span className="text-[10px] font-bold text-zinc-600">{format(new Date(s.played_at), 'MMMM do, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <Target size={16} className="text-emerald-500/20" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[2.5rem]">
              <Trophy size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No rounds recorded yet.</p>
              <Link href="/scores/new" className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-4 inline-block hover:underline">
                Record your first score
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
