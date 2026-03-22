import { getCharities } from "@/actions/charities";
import { Heart, Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminCharitiesPage() {
  const { charities, error } = await getCharities();

  if (error) return <div className="p-12 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Heart size={24} className="text-emerald-500" />
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Partners</h1>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Manage charitable organizations and mission details.</p>
        </div>
        
        <button className="flex items-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-white text-black font-black italic uppercase text-xs tracking-tighter rounded-2xl transition-all active:scale-95">
          <Plus size={16} />
          ADD NEW CHARITY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map((charity) => (
          <div key={charity.id} className="group bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="relative h-48">
              <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>
            <div className="p-8 relative -mt-12">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2">{charity.name}</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest line-clamp-2 mb-8">{charity.description}</p>
              
              <div className="flex items-center gap-3">
                <Link 
                  href={`/charities/${charity.id}`}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <ExternalLink size={14} />
                  VIEW PAGE
                </Link>
                <button className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
