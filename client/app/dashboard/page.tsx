import DashboardHeader from '@/components/dashboard/Header';
import RollingScores from '@/components/dashboard/RollingScores';
import PrizeStats from '@/components/dashboard/PrizeStats';
import HowItWorks from '@/components/dashboard/HowItWorks';
import CharityHighlights from '@/components/dashboard/CharityHighlights';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { createClient } from '@/lib/supabase';
import { getUserCharity } from '@/actions/charities';
import { Zap } from 'lucide-react';
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
  
  const { data: winner } = await supabase
    .from('winners')
    .select('*')
    .eq('user_id', user?.id)
    .in('status', ['pending', 'approved', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  const { count: drawsEntered } = await supabase
    .from('user_draw_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);

  const { selection: charitySelection } = await getUserCharity();

  return (
    <div className="min-h-screen bg-black flex flex-col pt-4">
      <DashboardHeader user={profile} />
      
      <DashboardClient 
        profile={profile}
        isSubscribed={isSubscribed}
        subscription={subscription}
        sessionId={session_id}
        winner={winner}
        charity={charitySelection?.charity}
        drawsEntered={drawsEntered || 0}
        rollingScores={<RollingScores />}
        prizeStats={<PrizeStats currencySymbol={subscription?.plan?.includes('INR') || subscription?.plan_region === 'india' ? '₹' : '£'} />}
        howItWorks={<HowItWorks />}
        charityHighlights={<CharityHighlights />}
        subscribeCta={
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
        }
      />
    </div>
  );
}
