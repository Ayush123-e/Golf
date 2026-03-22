import { getCharityById } from "@/actions/charities";
import DashboardHeader from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase";
import { Heart, Globe, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CharityProfilePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { charity } = await getCharityById(id);
  
  if (!charity) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DashboardHeader user={profile} />

      <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
        <Link 
          href="/charities" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest mb-12 transition-all"
        >
          <ArrowLeft size={14} />
          BACK TO DIRECTORY
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">Official Partner</span>
              <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} className="text-emerald-500" />
                Verified Impact
              </div>
            </div>

            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase mb-8">
              {charity.name}
            </h1>

            <p className="text-xl text-zinc-400 font-medium leading-[1.6] mb-12">
              {charity.description}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Platform Impact</p>
                <p className="text-3xl font-black italic text-emerald-500 tracking-tighter uppercase">£48.2k+</p>
              </div>
              <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Active Supporters</p>
                <p className="text-3xl font-black italic text-white tracking-tighter uppercase">582</p>
              </div>
            </div>

            <button className="w-full md:w-auto px-12 py-6 bg-emerald-500 text-black font-black italic uppercase text-sm tracking-tighter rounded-2xl hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-3 group">
              CHOOSE THIS CAUSE
              <Heart size={18} className="group-hover:fill-emerald-500 transition-colors" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-[100px] rounded-full" />
            <div className="relative aspect-[4/5] rounded-[4rem] border border-white/10 overflow-hidden">
               <img 
                src={charity.image_url} 
                alt={charity.name} 
                className="w-full h-full object-cover grayscale opacity-50 contrast-125"
               />
               <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Mission Statement</p>
                    <p className="text-xs text-white/80 font-bold uppercase tracking-widest leading-relaxed">
                       {charity.description}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
