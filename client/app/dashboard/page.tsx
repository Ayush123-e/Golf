import DashboardHeader from '@/components/dashboard/Header';
import RollingScores from '@/components/dashboard/RollingScores';
import PrizeStats from '@/components/dashboard/PrizeStats';
import HowItWorks from '@/components/dashboard/HowItWorks';
import CharityHighlights from '@/components/dashboard/CharityHighlights';
import { createClient } from '@/lib/supabase';
import { Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default async function DashboardPage(props: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await props.searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user?.id)
    .eq('status', 'active')
    .single();

  const isSubscribed = !!subscription;

  return (
    <div className="min-h-screen bg-black flex flex-col pt-4">
      <DashboardHeader user={profile} />
      
      <AnimatePresence>
        {session_id && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold"
          >
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Check size={16} className="text-black" />
            </div>
            <div>
              <p className="uppercase tracking-widest">Subscription Activated!</p>
              <p className="text-emerald-500/60 font-medium">Welcome to the Championship. Your rolling 5 scores are now unlocked.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-center mb-8 px-6">
        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Competition Active
        </div>
      </div>

      <PrizeStats />
      
      {isSubscribed ? (
        <>
          <div className="mt-8">
            <RollingScores />
          </div>

          <div className="px-6 mt-8 mb-12 flex-1 flex flex-col justify-end">
            <Link 
              href="/scores/new"
              className="w-full bg-white text-black font-black py-5 rounded-3xl active:scale-95 transition-all shadow-xl shadow-white/5 hover:bg-emerald-500 flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
            >
              ENTER TODAY'S SCORE
            </Link>
          </div>
        </>
      ) : (
        <>
          <HowItWorks />
          <CharityHighlights />
          
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pt-32 pb-12 z-50">
            <div className="max-w-md mx-auto">
              <Link 
                href="/subscribe"
                className="w-full bg-emerald-500 text-black font-black py-6 rounded-3xl shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm group"
              >
                LEVEL UP NOW
                <Zap size={20} className="fill-black group-hover:animate-bounce" />
              </Link>
              <p className="mt-4 text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Unlock scores, draws, and charity choice
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
