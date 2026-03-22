import { getDrawStatus } from "@/actions/draws";
import AdminDrawControl from "@/components/draws/AdminDrawControl";
import { getDrawSimulation } from "@/actions/admin";
import { Trophy, Target, PlayCircle, ShieldCheck, Info } from "lucide-react";

export default async function AdminDrawsPage() {
  const { currentDraw } = await getDrawStatus();
  
  const simulationData = currentDraw && !currentDraw.is_published 
    ? await getDrawSimulation(currentDraw.id) 
    : null;

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Trophy size={24} className="text-emerald-500" />
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Draw Center</h1>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Generate, simulate, and publish championship results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <AdminDrawControl currentDraw={currentDraw} />

          {simulationData?.simulation && (
            <div className="p-10 bg-zinc-900/50 border border-emerald-500/20 rounded-[3rem] relative overflow-hidden">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-emerald-500 text-black rounded-2xl">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Pre-Publish Simulation</h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Calculated based on current entries</p>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 mb-10">
                  {[5, 4, 3].map((match) => (
                    <div key={match} className="p-6 bg-zinc-950/50 border border-white/5 rounded-3xl">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{match} MATCH</p>
                      <p className="text-2xl font-black italic text-emerald-500 tracking-tighter uppercase">
                        {simulationData.simulation.winners[match as 5|4|3]} Winners
                      </p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-2 italic">
                        Est. £{Math.floor(simulationData.simulation.payouts[match as 5|4|3]).toLocaleString()} each
                      </p>
                    </div>
                  ))}
               </div>

               <div className="flex items-center gap-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <Info size={16} className="text-emerald-500" />
                  <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest leading-relaxed">
                    Total Prize Pool for this draw: <span className="text-white">£{Math.floor(simulationData.simulation.totalPool).toLocaleString()}</span>. 
                    Publishing will finalize these winners and notify users.
                  </p>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Workflow Status</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentDraw ? 'bg-emerald-500 border-transparent text-black' : 'border-zinc-800 text-zinc-800'}`}>
                  <ShieldCheck size={12} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-white tracking-widest">Draw Setup</p>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{currentDraw ? 'Ready to Simulate' : 'Waiting for Month End'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${simulationData ? 'bg-emerald-500 border-transparent text-black' : 'border-zinc-800 text-zinc-800'}`}>
                  <PlayCircle size={12} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-white tracking-widest">Simulation</p>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{simulationData ? 'Results Verified' : 'Awaiting Calculation'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
