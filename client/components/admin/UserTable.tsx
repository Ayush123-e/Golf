"use client";

import { useState } from "react";
import { updateUserRole } from "@/actions/admin";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  User as UserIcon, 
  CreditCard,
  Mail,
  BarChart3,
  Calendar,
  ChevronDown,
  Loader2,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUserTable({ users }: { users: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                          u.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : 
                          filter === "admin" ? u.role === "admin" :
                          filter === "active" ? u.subscriptions?.some((s: any) => s.status === 'active') : true;
    return matchesSearch && matchesFilter;
  });

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setLoadingId(userId);
    const newRole = currentRole === 'admin' ? 'subscriber' : 'admin';
    const res = await updateUserRole(userId, newRole);
    if (res.error) alert(res.error);
    setLoadingId(null);
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-[3rem] overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME OR ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "admin", "active"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === f ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              <th className="px-8 py-6">User / Identity</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Rolling Avg</th>
              <th className="px-8 py-6">Joined</th>
              <th className="px-8 py-6 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => {
              const isActive = user.subscriptions?.some((s: any) => s.status === 'active');
              return (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={20} className="text-zinc-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black italic tracking-tighter uppercase text-white">{user.full_name || "Anonymous Hero"}</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{user.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {isActive ? <Check size={10} /> : <X size={10} />}
                      {isActive ? "Active" : "Standard"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black italic text-emerald-500">{user.rolling_avg?.toFixed(1) || "0.0"}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => alert(`Scores for ${user.full_name}: Coming Soon in Detailed View`)}
                        className="p-2.5 bg-white/5 border border-white/5 text-zinc-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all"
                        title="View Scores"
                      >
                        <BarChart3 size={14} />
                      </button>
                      
                      <button 
                        onClick={() => handleToggleRole(user.id, user.role)}
                        disabled={loadingId === user.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          user.role === 'admin' 
                            ? 'bg-zinc-800 text-white hover:bg-red-500 hover:text-black' 
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black'
                        }`}
                      >
                        {loadingId === user.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : user.role === 'admin' ? (
                          <>
                            <Shield size={12} />
                            Admin
                          </>
                        ) : (
                          "Promote"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-20 text-center">
          <p className="text-zinc-600 font-black uppercase text-sm tracking-[0.2em]">No network members found</p>
        </div>
      )}
    </div>
  );
}
