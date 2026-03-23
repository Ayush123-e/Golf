import { createClient } from '@/lib/supabase';
import { Trophy } from "lucide-react";
import RoundHistoryClient from "@/components/scores/RoundHistoryClient";

export default async function HistoryPage() {
  const supabase = await createClient();
  
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .order('played_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
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

        <RoundHistoryClient scores={scores || []} />
      </div>
    </div>
  );
}
