"use client";

import { useState } from "react";
import { updateUserCharity } from "@/actions/charities";
import CharityCard from "./CharityCard";
import { Search, Globe, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function CharityDirectory({ charities, initialSelection }: { charities: any[], initialSelection?: any }) {
  const [selectedId, setSelectedId] = useState(initialSelection?.charity_id);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (id: string) => {
    setLoadingId(id);
    const res = await updateUserCharity(id);
    if (res.error) alert(res.error);
    else setSelectedId(id);
    setLoadingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-emerald-500" size={24} />
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Impact<br />Directory</h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest max-w-sm">
            Choose where your subscription share goes. Every monthly fee funds the mission of your choice.
          </p>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH CAUSES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCharities.map((charity) => (
          <CharityCard 
            key={charity.id}
            charity={charity}
            isSelected={selectedId === charity.id}
            onSelect={handleSelect}
            loading={loadingId === charity.id}
          />
        ))}
      </div>

      {filteredCharities.length === 0 && (
        <div className="text-center py-40">
          <p className="text-zinc-600 font-black uppercase text-sm tracking-[0.2em]">No causes matching your search</p>
        </div>
      )}
    </div>
  );
}
