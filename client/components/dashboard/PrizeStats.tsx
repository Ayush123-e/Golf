export default function PrizeStats({ currencySymbol = "£" }: { currencySymbol?: string }) {
  const currentPrize = "12,450"; 

  return (
    <div className="mx-6 p-8 rounded-[32px] bg-gradient-to-br from-zinc-900 to-black border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Estimated Grand Prize</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-white tracking-tighter">{currencySymbol}{currentPrize}</span>
          <span className="text-emerald-500 font-black animate-pulse text-lg">●</span>
        </div>
        
        <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>
        
        <div className="mt-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
           <span className="text-zinc-500">Next Draw</span>
           <span className="text-zinc-300">April 1st, 2026</span>
        </div>
      </div>
    </div>
  );
}
