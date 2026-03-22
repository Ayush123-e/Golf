import { getAdminStats } from "@/actions/admin";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { Users, CreditCard, Trophy, Heart, Zap, ArrowUpRight, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default async function AdminDashboardPage() {
  const { stats, error } = await getAdminStats();

  if (error) return <div className="p-12 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Zap size={24} className="text-emerald-500" />
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Overview</h1>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Platform performance and network health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AdminStatCard 
          label="Total Network"
          value={stats?.totalUsers || 0}
          icon={Users}
          subtext="Verified Profiles"
        />
        <AdminStatCard 
          label="Active Subs"
          value={stats?.activeSubscribers || 0}
          icon={CreditCard}
          subtext="Unlocked Members"
          color="white"
        />
        <AdminStatCard 
          label="Prize Paid"
          value={`£${Math.floor(stats?.totalPrizePaid || 0).toLocaleString()}`}
          icon={Trophy}
          subtext="Draw Distribution"
        />
        <AdminStatCard 
          label="Charity Impact"
          value={`£${Math.floor(stats?.totalCharityRaised || 0).toLocaleString()}`}
          icon={Heart}
          subtext="Platform Social Share"
          color="zinc"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 bg-zinc-900/50 border border-white/5 rounded-[3rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">System Actions</h3>
            <Link href="/admin/draws" className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2 hover:text-white transition-colors">
              VIEW CENTER
              <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                  <Trophy size={18} />
                </div>
                <div>
                   <p className="text-xs font-black uppercase text-white tracking-widest">Prepare Monthly Draw</p>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">Generate and simulate results</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-800" />
            </div>

            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                  <Heart size={18} />
                </div>
                <div>
                   <p className="text-xs font-black uppercase text-white tracking-widest">Manage Charities</p>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">Update partners and mission</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-800" />
            </div>
          </div>
        </div>

        <div className="p-10 bg-emerald-500 rounded-[3rem] text-black">
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Network Growth</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-12 opacity-40 italic">Coming Soon: Visual Analytics</p>
          
          <div className="flex items-end gap-1 h-32 mb-8">
            {[40, 70, 45, 90, 65, 80, 55, 100, 75, 95].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05 }}
                className="flex-1 bg-black/20 rounded-full"
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-6">
            <div>
              <p className="text-3xl font-black italic tracking-tighter uppercase">+12%</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Revenue Increase</p>
            </div>
            <BarChart3 size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
