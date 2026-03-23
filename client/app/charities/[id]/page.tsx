import { getCharityById } from "@/actions/charities";
import DashboardHeader from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase";
import { Heart, Globe, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export default async function CharityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { charity } = await getCharityById(id) as { charity: Charity | null };
  
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
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

            <div className="flex flex-col md:flex-row gap-4">
              <Link 
                href={`/subscribe?charityId=${id}`}
                className="flex-1 px-12 py-6 bg-emerald-500 text-black font-black italic uppercase text-sm tracking-tighter rounded-2xl hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-3 group text-center"
              >
                CHOOSE THIS CAUSE
                <Heart size={18} className="group-hover:fill-emerald-500 transition-colors" />
              </Link>
              
              <Link 
                href={`/subscribe?charityId=${id}&donation=true`}
                className="flex-1 px-12 py-6 bg-white/5 border border-white/10 text-white font-black italic uppercase text-sm tracking-tighter rounded-2xl hover:bg-white hover:text-black active:scale-95 transition-all flex items-center justify-center gap-3 group text-center"
              >
                DIRECT DONATION
                <Globe size={18} />
              </Link>
            </div>
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

        <div className="mt-32 border-t border-white/5 pt-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Upcoming Events</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Mark your calendar for community impact</p>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-12 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EventCard 
              date="JUNE 12" 
              title="Charity Golf Day" 
              location="Wentworth Club" 
              desc="Join us for 18 holes of championship golf followed by a gala dinner and auction."
            />
            <EventCard 
              date="JULY 05" 
              title="Junior Workshop" 
              location="Online / Regional" 
              desc="Expert coaching sessions for aspiring young golfers from disadvantaged backgrounds."
            />
            <EventCard 
              date="AUG 21" 
              title="Legacy Gala" 
              location="The Savoy, London" 
              desc="Our annual celebration of impact, highlighting the lives changed through your support."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ date, title, location, desc }: any) {
  return (
    <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2rem] hover:border-emerald-500/20 transition-all group">
      <div className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em] mb-4">{date}</div>
      <h4 className="text-xl font-black italic uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">{title}</h4>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">{location}</p>
      <p className="text-xs text-zinc-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
