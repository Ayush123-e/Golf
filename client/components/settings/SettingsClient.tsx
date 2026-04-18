"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, ArrowRight } from "lucide-react";

export default function SettingsClient() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="grid gap-6 max-w-xl">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none transition-all group-hover:bg-red-500/20" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1">Session Access</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Terminate Current Session</p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
              <LogOut size={20} />
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition-all flex items-center justify-between px-6 group/btn"
          >
            <span>Disconnect Securely</span>
            <ArrowRight size={16} className="text-zinc-500 group-hover/btn:text-red-400 group-hover/btn:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
