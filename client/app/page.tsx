"use client";

import Link from "next/link";
import { Trophy, ArrowRight, ShieldCheck, Target, Zap, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden relative">
      <section className="relative h-[90vh] flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero_golf_ball.png" 
            alt="Golf Hero" 
            fetchPriority="high"
            className="w-full h-full object-cover opacity-60 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">The Elite Player Network</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl sm:text-9xl font-black italic tracking-tighter uppercase mb-6 leading-[0.8] mix-blend-difference"
          >
            MASTER <br />
            <span className="text-emerald-500 text-shadow-glow">THE GREEN</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-200 text-lg sm:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-tight drop-shadow-lg"
          >
            Elevate your game with the ultimate Stableford tracking platform. 
            Real-time leaderboards, Rolling 5 averages, and monthly prize draws.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link 
              href="/dashboard"
              className="bg-emerald-500 text-black px-12 py-5 rounded-full font-black flex items-center justify-center gap-3 transition-all hover:bg-white hover:scale-105 active:scale-95 group shadow-2xl shadow-emerald-500/40"
            >
              LEVEL UP NOW 
              <Zap size={20} className="fill-black group-hover:animate-pulse" />
            </Link>
            <Link 
              href="/login"
              className="bg-white/5 backdrop-blur-md border border-white/10 px-12 py-5 rounded-full font-black transition-all hover:bg-white/10"
            >
              MEMBERS SIGN IN
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          <BentoCard 
            className="md:col-span-2 md:row-span-2 bg-zinc-900/50 border-zinc-800"
            icon={<Target size={32} className="text-emerald-500" />}
            title="Rolling 5 System"
            desc="Only your last 5 rounds define your current standing. Dynamic, fair, and fiercely competitive."
            badge="LIVE ALGORITHM"
            imageUrl="/assets/rolling_5_tech.png"
          />
          <BentoCard 
            className="md:col-span-2 bg-emerald-950/20 border-emerald-500/20"
            icon={<Trophy size={32} className="text-emerald-500" />}
            title="£10,000 Monthly Pot"
            desc="Every qualified player enters the automatic month-end draw. Top 3 scorers win guaranteed cash."
            badge="GUARANTEED"
          />
          <BentoCard 
            className="bg-zinc-900/50 border-zinc-800"
            icon={<Globe size={32} className="text-zinc-500" />}
            title="Global Rank"
            desc="Face off against the world's best golfers."
            imageUrl="/assets/global_rank_tech.png"
          />
          <BentoCard 
            className="bg-zinc-900/50 border-zinc-800"
            icon={<Users size={32} className="text-zinc-500" />}
            title="Community"
            desc="Network with elite enthusiasts."
            imageUrl="/assets/community_tech.png"
          />
        </div>
      </section>

      <footer className="border-t border-white/5 py-32 px-6 relative bg-black overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none opacity-20">
          <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full h-auto">
            <path d="M0 200V150C200 120 400 180 600 140C800 100 1000 160 1200 130V200H0Z" fill="url(#greenGradient)" />
            <defs>
              <linearGradient id="greenGradient" x1="600" y1="100" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="black" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute bottom-10 left-[45%] w-1 h-32 bg-zinc-800" />
          <div className="absolute bottom-[130px] left-[45%] w-12 h-8 bg-emerald-500 rounded-sm skew-y-12 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 relative z-10 text-center md:text-left">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-3">
                <Trophy size={28} className="text-black" />
              </div>
              <span className="font-black text-5xl italic tracking-tighter uppercase leading-none">GOLF<span className="text-emerald-500">HERO</span></span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md max-w-md">
              <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-4">
                Elevating the game of golf through precision tracking and the world's most trusted elite Stableford network.
              </p>
              <div className="flex items-center gap-2 text-emerald-500">
                <ShieldCheck size={16} />
                <span className="font-black text-[10px] uppercase tracking-widest">Verified Championship Platform</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-4">
               <FooterSocial icon={<Globe size={20} />} />
               <FooterSocial icon={<Users size={20} />} />
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/50 flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              Platform
            </h4>
            <ul className="space-y-6">
              <FooterLink icon={<Target size={14} />} href="/dashboard">DASHBOARD</FooterLink>
              <FooterLink icon={<Globe size={14} />} href="/leaderboard">LEADERBOARD</FooterLink>
              <FooterLink icon={<Trophy size={14} />} href="/draws">MONTHLY DRAWS</FooterLink>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/50 flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              The Network
            </h4>
            <ul className="space-y-6">
              <FooterLink icon={<Users size={14} />} href="/community">COMMUNITY</FooterLink>
              <FooterLink icon={<ShieldCheck size={14} />} href="/legal">TERMS OF PLAY</FooterLink>
              <FooterLink icon={<ShieldCheck size={14} />} href="/privacy">PRIVACY SHIELD</FooterLink>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">
            © 2026 GOLF HERO. BUILT FOR THE MODERN CHAMPION.
          </p>
          <div className="flex gap-10 items-center">
             <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-30 hover:opacity-100 cursor-default">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">VERIFIED NETWORK</span>
             </div>
             <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-30 hover:opacity-100 cursor-default">
               <Target size={14} className="text-emerald-500" />
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">PRECISION TRACKED</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, icon, children }: any) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-4 text-xs font-black text-zinc-500 hover:text-white group transition-all text-left group">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 flex-shrink-0">
          {icon}
        </div>
        <span className="group-hover:translate-x-1 transition-transform">{children}</span>
      </Link>
    </li>
  );
}

function FooterSocial({ icon }: any) {
  return (
    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-emerald-500 hover:text-black hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer group shadow-xl">
      {icon}
    </div>
  );
}

function BentoCard({ className, icon, title, desc, badge, imageUrl }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-[2.5rem] border overflow-hidden flex flex-col justify-end group transition-colors min-h-[300px] ${className}`}
    >
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>
      )}
      {badge && (
        <span className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full z-10">
          {badge}
        </span>
      )}
      <div className="relative z-10">
        <div className="mb-6 group-hover:scale-110 transition-transform origin-left">{icon}</div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-3 leading-none">{title}</h3>
        <p className="text-zinc-200 text-sm font-medium leading-relaxed max-w-[280px] drop-shadow-md">{desc}</p>
      </div>
    </motion.div>
  );
}
