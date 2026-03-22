import { getAllUsers } from "@/actions/admin";
import AdminUserTable from "@/components/admin/UserTable";
import { Users, ShieldAlert } from "lucide-react";

export default async function AdminUsersPage() {
  const { users, error } = await getAllUsers();

  if (error) return <div className="p-12 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-emerald-500" />
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Network</h1>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Manage platform members and administrative access.</p>
        </div>
        
        <div className="flex items-center gap-4 p-6 bg-zinc-900/50 border border-white/5 rounded-3xl">
           <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <ShieldAlert size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{users?.length || 0} Total Profiles</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Synced across network</p>
           </div>
        </div>
      </div>

      <AdminUserTable users={users || []} />
    </div>
  );
}
