import DashboardHeader from '@/components/dashboard/Header';
import RollingScores from '@/components/dashboard/RollingScores';
import PrizeStats from '@/components/dashboard/PrizeStats';
import { createClient } from '@server/lib/supabase';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black flex flex-col pt-4">
      <DashboardHeader user={profile} />
      
      <div className="mt-2 text-center mb-8 px-6">
        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Competition Active
        </div>
      </div>

      <PrizeStats />
      
      <div className="mt-8">
        <RollingScores />
      </div>

      <div className="px-6 mt-8 mb-12 flex-1 flex flex-col justify-end">
        <button className="w-full bg-white text-black font-black py-5 rounded-3xl active:scale-95 transition-all shadow-xl shadow-white/5 hover:bg-zinc-200">
          ENTER TODAY'S SCORE
        </button>
      </div>
    </div>
  );
}
