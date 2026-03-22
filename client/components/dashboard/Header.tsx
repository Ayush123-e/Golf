import Link from "next/link";
import { User as UserIcon } from "lucide-react";

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="p-6 pt-10 flex justify-between items-center bg-transparent relative z-20">
      <div>
        <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">Authorized Personal</h2>
        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">
          {user?.full_name || 'Golfer'}
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:block text-right">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest">
              {user?.role === 'admin' ? "CORE ADMIN" : "ELITE SUBSCRIBER"}
            </span>
          </div>
        </div>
        
        <Link 
          href="/dashboard/profile"
          className="relative group focus:outline-none"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden relative z-10 hover:border-emerald-500/50 transition-colors">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                <UserIcon size={20} />
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
