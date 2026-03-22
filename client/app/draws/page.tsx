import { createClient } from "@/lib/supabase";
import { getDrawStatus, getUserEntry } from "@/actions/draws";
import DrawHero from "@/components/draws/DrawHero";
import UserDrawEntry from "@/components/draws/UserDrawEntry";
import PrizePoolInfo from "@/components/draws/PrizePoolInfo";
import AdminDrawControl from "@/components/draws/AdminDrawControl";
import AdminWinnerManager from "@/components/admin/AdminWinnerManager";
import { Trophy, Target, History } from "lucide-react";
import Link from "next/link";

export default async function DrawsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { currentDraw } = await getDrawStatus();
  const { entry, winner } = currentDraw ? await getUserEntry(currentDraw.id) : { entry: null, winner: null };

  const isAdmin = profile?.role === 'admin';

  const { data: allWinners } = isAdmin && currentDraw 
    ? await supabase.from('winners').select('*').eq('draw_id', currentDraw.id)
    : { data: [] };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto relative z-10 pt-10 pb-20">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <Trophy size={24} className="text-zinc-500" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Championship<br />Draw</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium italic max-w-md">
            The monthly pinnacle of the GOLF HERO network. Your performance converted into real-world rewards.
          </p>
        </div>

        {isAdmin && <AdminDrawControl currentDraw={currentDraw} />}

        <DrawHero currentDraw={currentDraw} nextDrawDate={"April 1, 2026"} />

        <PrizePoolInfo draw={currentDraw} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8">
            <UserDrawEntry 
              entry={entry} 
              winner={winner}
              drawNumbers={currentDraw?.draw_numbers || []} 
              isPublished={currentDraw?.is_published || false} 
            />
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <div className="p-8 bg-zinc-950 border border-white/5 rounded-[2rem]">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">How it works</h4>
               <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="text-emerald-500 font-black italic">01</span>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider leading-relaxed">System syncs your latest 5 rounds.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-zinc-700 font-black italic">02</span>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider leading-relaxed">Match 3, 4, or 5 numbers.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-zinc-700 font-black italic">03</span>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider leading-relaxed">Claim your share of the global pool.</p>
                  </li>
               </ul>
            </div>

            <Link 
              href="/history"
              className="flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all group"
            >
              <div className="flex items-center gap-3">
                 <History size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Entry History</span>
              </div>
              <Target size={16} className="opacity-20" />
            </Link>
          </div>
        </div>

        {isAdmin && allWinners && allWinners.length > 0 && (
          <AdminWinnerManager winners={allWinners} />
        )}
      </div>
    </div>
  );
}
