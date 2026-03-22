import { createClient } from "@/lib/supabase";
import { getDrawStatus } from "@/actions/draws";
import AdminWinnerManager from "@/components/admin/AdminWinnerManager";
import { ShieldCheck, Trophy } from "lucide-react";

export default async function AdminWinnersPage() {
  const supabase = await createClient();
  const { currentDraw } = await getDrawStatus();

  const { data: allWinners } = currentDraw 
    ? await supabase.from('winners').select('*').eq('draw_id', currentDraw.id).order('created_at', { ascending: false })
    : { data: [] };

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={24} className="text-emerald-500" />
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Verification</h1>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Review proof and process payout distributions.</p>
      </div>

      {!currentDraw ? (
        <div className="p-20 bg-zinc-900/50 border border-white/5 rounded-[3rem] text-center">
          <Trophy size={40} className="text-zinc-800 mx-auto mb-6" />
          <p className="text-zinc-600 font-black uppercase text-sm tracking-[0.2em]">No active draw results to verify</p>
        </div>
      ) : (
        <AdminWinnerManager winners={allWinners || []} />
      )}
    </div>
  );
}
