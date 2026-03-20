"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Plus, 
  History, 
  Settings, 
  ShieldCheck, 
  ShieldAlert,
  ArrowUpRight,
  User,
  LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [scores, setScores] = useState<number[]>([38, 36, 40, 34, 39]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const toggleSubscriber = () => {
    setDevMode(prev => !prev);
    setIsSubscriber(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-emerald-500/30">
      <AnimatePresence>
        {devMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-amber-500/20 border-b border-amber-500/30 backdrop-blur-md py-1 px-4 flex justify-center items-center gap-2 text-xs font-medium text-amber-200"
          >
            <ShieldAlert size={12} />
            DEVELOPER MODE ACTIVE: SUBMISSION CHECKS BYPASSED
            <button onClick={toggleSubscriber} className="underline hover:text-white transition-colors">Disable</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-[#0d0d0d] border-r border-white/5 flex flex-col items-center lg:items-stretch p-4 z-40">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="text-black" size={20} />
          </div>
          <span className="hidden lg:block font-bold text-xl tracking-tight">GOLF<span className="text-emerald-500">HERO</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<History size={20} />} label="Dashboard" active />
          <NavItem icon={<Trophy size={20} />} label="Leaderboard" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
               <User size={20} className="text-indigo-400" />
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-medium truncate">Amit Mahto</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pro Player</p>
            </div>
          </div>
          <button className="flex items-center gap-3 w-full px-2 py-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white">
            <LogOut size={20} />
            <span className="hidden lg:block text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      <main className={cn(
        "transition-all duration-300",
        "pl-20 lg:pl-64 pr-4 py-8 max-w-7xl mx-auto",
        devMode ? "pt-14" : "pt-8"
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-slate-400">Welcome back, champ. Ready for today's swing?</p>
          </motion.div>

          {!isSubscriber && !devMode && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleSubscriber}
              className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400"
            >
              UNLOCK PRO FEATURES
              <ArrowUpRight size={18} />
            </motion.button>
          )}

          {devMode && (
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubmitModal(true)}
                className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-white/10 hover:bg-slate-200 transition-all"
             >
               <Plus size={18} />
               SUBMIT NEW SCORE
             </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <StatCard 
             title="Average Stableford" 
             value="37.4" 
             trend="+2.1" 
             description="Based on last 5 games"
           />
           <StatCard 
             title="Global Rank" 
             value="#42" 
             trend="Up 5" 
             description="Top 5% this month"
           />
           <StatCard 
             title="Entries" 
             value="5 / 5" 
             description="Rolling quota full"
           />
        </div>

        <section>
          <div className="flex items-center gap-2 mb-6 text-emerald-500">
             <ShieldCheck size={18} />
             <h2 className="uppercase text-xs font-bold tracking-[0.2em]">Live Rolling 5 Verification</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
             {scores.map((score, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/30 transition-all duration-500 cursor-default"
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                   <span className="text-4xl font-black text-white group-hover:scale-110 transition-transform duration-500">{score}</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entry 0{i+1}</span>
                </motion.div>
             ))}
          </div>
        </section>

        {!isSubscriber && !devMode && (
          <div className="mt-12 overflow-hidden relative bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-[32px] p-8 md:p-12 text-center md:text-left">
             <div className="relative z-10 md:max-w-md">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">You're currently in Viewer Mode.</h3>
                <p className="text-white/80 mb-8">Subscribe to GolfHero Pro to enter scores, join monthly draws, and win real cash prize pools while supporting global charities.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform">Get Pro Now</button>
                   <button onClick={toggleSubscriber} className="bg-black/20 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black/40 transition-all border border-white/10">Try Demo Mode</button>
                </div>
             </div>
             <Trophy size={200} className="absolute top-1/2 -translate-y-1/2 -right-10 text-white/10 rotate-12 pointer-events-none hidden lg:block" />
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex items-center gap-3 w-full px-2 py-3 rounded-xl transition-all font-medium",
      active ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
    )}>
      {icon}
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, trend, description }: { title: string, value: string, trend?: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#121212] border border-white/5 rounded-[32px] p-8"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        {trend && (
           <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">{trend}</span>
        )}
      </div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{description}</p>
    </motion.div>
  );
}
