"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroPerformanceCard from "./HeroPerformanceCard";
import ScoreEntryModal from "../scores/ScoreEntryModal";
import { Check } from "lucide-react";

interface DashboardClientProps {
  profile: any;
  isSubscribed: boolean;
  sessionId?: string;
  rollingScores: React.ReactNode;
  prizeStats: React.ReactNode;
  howItWorks: React.ReactNode;
  charityHighlights: React.ReactNode;
  subscribeCta: React.ReactNode;
}

export default function DashboardClient({ 
  profile, 
  isSubscribed, 
  sessionId, 
  rollingScores, 
  prizeStats, 
  howItWorks, 
  charityHighlights,
  subscribeCta 
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentAvg = profile?.rolling_avg || 0;
  const trend = 'stable'; 

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

      {prizeStats}

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
