"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroPerformanceCard from "./HeroPerformanceCard";
import ScoreEntryModal from "../scores/ScoreEntryModal";
import { Check, Shield } from "lucide-react";
import WinnerClaimSection from "./WinnerClaimSection";
import MyCharityWidget from "./MyCharityWidget";

interface DashboardClientProps {
  profile: any;
  isSubscribed: boolean;
  subscription?: any;
  sessionId?: string;
  winner?: any;
  charity?: any;
  rollingScores: React.ReactNode;
  prizeStats: React.ReactNode;
  howItWorks: React.ReactNode;
  charityHighlights: React.ReactNode;
  subscribeCta: React.ReactNode;
}

export default function DashboardClient({ 
  profile, 
  isSubscribed, 
  subscription,
  sessionId,
  winner, 
  charity,
  rollingScores, 
  prizeStats, 
  howItWorks, 
  charityHighlights,
  subscribeCta 
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentAvg = profile?.rolling_avg || 0;
  const trend = 'stable'; 
  const currencySymbol = subscription?.plan_region === 'india' || (subscription?.plan && subscription.plan.includes('INR')) ? '₹' : '£';

  return (
    <>
      <AnimatePresence>
        {sessionId && (
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
              <p className="uppercase tracking-widest text-[10px]">Subscription Activated!</p>
              <p className="text-emerald-500/60 font-medium text-[9px]">Welcome to the Championship. Your rolling 5 scores are now unlocked.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-center mb-8 px-6">
        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Network Active
        </div>
      </div>

      <div className="px-6">
        {winner && <WinnerClaimSection winner={winner} />}
      </div>

      {isSubscribed && subscription && (
        <div className="px-6 mb-6">
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-0.5">Membership Status</p>
                <h4 className="text-sm font-black italic uppercase text-white tracking-tight">
                  Elite {subscription.plan === 'yearly' ? 'Yearly' : 'Monthly'} Member
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {React.cloneElement(prizeStats as React.ReactElement, { currencySymbol } as any)}

      <div className="px-6 mt-8">
        <MyCharityWidget charity={charity} />
      </div>

      {isSubscribed ? (
        <>
          <HeroPerformanceCard 
            avgScore={currentAvg} 
            trend={trend} 
            trendValue="Stable"
            onEnterScore={() => setIsModalOpen(true)}
          />
          <div className="mt-4">
            {rollingScores}
          </div>
        </>
      ) : (
        <>
          {howItWorks}
          {charityHighlights}
          {subscribeCta}
        </>
      )}

      <ScoreEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
