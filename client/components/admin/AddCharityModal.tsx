"use client";

import { useState } from "react";
import { Plus, X, Loader2, Image as ImageIcon } from "lucide-react";
import { addCharity } from "@/actions/charities";

export default function AddCharityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    website_url: "",
    mission_statement: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addCharity(formData);
    if (res.error) alert(res.error);
    else onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">New Partner</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Register a new charitable organization</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all"
                placeholder="Charity Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Image URL</label>
              <input 
                required
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all"
                placeholder="Unsplash / S3 link"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Mission Statement (Short)</label>
            <input 
              required
              value={formData.mission_statement}
              onChange={e => setFormData({ ...formData, mission_statement: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all"
              placeholder="e.g. Empowering youth through golf"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all h-32 resize-none"
              placeholder="Full organizational strategy and impact..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Website URL</label>
            <input 
              required
              value={formData.website_url}
              onChange={e => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-6 bg-emerald-500 hover:bg-white text-black font-black italic uppercase rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
            CONFIRM & ACTIVATE PARTNER
          </button>
        </form>
      </div>
    </div>
  );
}
