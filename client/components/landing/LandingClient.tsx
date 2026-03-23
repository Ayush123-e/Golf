"use client";

import Link from "next/link";
import { Trophy, ArrowRight, ShieldCheck, Target, Zap, Globe, Users, ChevronRight, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface LandingClientProps {
  stats: {
    activePlayers: number;
    prizesAwarded: number;
    verifiedRounds: number;
    estimatedPrize: string;
  };
}

export default function LandingClient({ stats }: LandingClientProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden pt-20">
      
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img
            src="/assets/hero_golf_ball.png"
            alt="Golf Hero"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-full mb-10 backdrop-blur-md"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">The New Standard of Competition</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-8 leading-none"
          >
            Play Better. Win Bigger. <br />
            <span className="text-emerald-500 drop-shadow-[0_0_100px_rgba(16,185,129,0.4)]">Give Back.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed px-4"
          >
            Every round you play fuels a greater cause. Track your scores, enter monthly draws, and compete for life-changing prizes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/dashboard"
              className="group relative px-12 py-6 bg-emerald-500 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Level Up Now
                <Zap size={20} className="fill-black group-hover:animate-bounce" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <Link
              href="/#features"
              className="text-xs font-black uppercase tracking-[0.3em] hover:text-emerald-400 transition-colors flex items-center gap-3 group"
            >
              How it works
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-10 hidden lg:block opacity-30 select-none pointer-events-none">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-emerald-500" />
              <span className="text-[10px] font-black tracking-widest uppercase">CHAMPIONSHIP NETWORK</span>
            </div>
            <div className="text-[40px] font-black italic leading-none text-white/20">LIVE_TRACKING</div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-32 max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Precision <span className="text-emerald-500">Infrastructure</span></h2>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Proprietary systems designed for the modern golfer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[800px]">
          <BentoCard
            className="md:col-span-3 md:row-span-2 bg-zinc-900/40 border-white/5"
            title="Rolling 5 System"
            desc="Our dynamic algorithm tracks your last 5 rounds, ensuring your global rank is always based on your current peak performance."
            badge="ALGORITHM"
            icon={<Target className="text-emerald-500" size={32} />}
            imageUrl="/assets/rolling_5_tech.png"
          />
          
          <BentoCard
            className="md:col-span-3 bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-500/10"
            title={`£${stats.estimatedPrize} Monthly Pot`}
            desc="Automated prize pool distribution for the top performers and random verified players every single month."
            badge="PRIZES"
            icon={<Trophy className="text-emerald-500" size={32} />}
          />

          <BentoCard
            className="md:col-span-3 bg-zinc-900/40 border-white/5"
            title="Verified Network"
            desc="Every score is authenticated by our cross-check system, maintaining the integrity of the leaderboard."
            badge="SECURITY"
            icon={<ShieldCheck className="text-emerald-500" size={32} />}
            imageUrl="/assets/global_rank_tech.png"
          />

          <BentoCard
            className="md:col-span-2 bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-500/10"
            title="Global Hub"
            desc="Connect with the world's most elite golf community."
            badge="LIVE NETWORK"
            icon={<Globe className="text-emerald-500" size={32} />}
          />
          
          <div className="md:col-span-4 bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-[2.5rem] p-10 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter text-black mb-4 group-hover:scale-105 transition-transform origin-left">Ready to Ascend?</h3>
              <p className="text-black/80 font-bold max-w-md leading-relaxed">Join {stats.activePlayers.toLocaleString()}+ golfers who have already elevated their game through the GOLF HERO network.</p>
            </div>
            
            <div className="mt-8 relative z-10">
              <Link href="/login" className="bg-black text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-colors inline-flex items-center gap-3">
                Create Free Account
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={300} className="text-black" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                <Star size={14} className="fill-emerald-500" />
                Featured Cause
              </div>
              <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
                SUPPORT THE <br />
                <span className="text-emerald-500">NEXT GENERATION</span>
              </h2>
            </div>
            <Link href="/charities" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
              EXPLORE ALL CHARITIES
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative">
               <div className="aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/10 relative group">
                  <img src="/assets/charity_spotlight.png" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[3s]" alt="Charity Spotlight" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 p-10 backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl max-w-md">
                    <p className="text-sm text-white font-medium italic mb-4">&quot;Developing the next generation of players through accessibility and world-class grassroots coaching.&quot;</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">The Junior Golf Foundation • Spotlight Partner</p>
                  </div>
               </div>
            </div>
            <div className="lg:col-span-5 space-y-12">
               <div>
                  <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white">Your Impact Matters</h4>
                  <p className="text-zinc-500 font-medium leading-relaxed">Choose a cause at checkout. A minimum of 10% of your subscription goes directly to your selected partner, providing stable, recurring funding for their most critical missions.</p>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-3xl font-black italic tracking-tighter text-emerald-500 mb-2">10%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">MINIMUM CONTRIBUTION</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black italic tracking-tighter text-white mb-2">12+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">CERTIFIED PARTNERS</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
                 <Users className="text-emerald-500" size={24} />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Community First</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-none text-white">
              BUILT FOR THE <br className="hidden md:block" />
              <span className="text-emerald-500">MODERN CHAMPION</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
              Golf is more than just a sport; it&apos;s a legacy. GOLF HERO brings data-driven insight and a global stage to your local course.
            </p>
            <div className="space-y-6">
              <StatItem label="Active Players" value={`${stats.activePlayers.toLocaleString()}+`} />
              <StatItem label="Prizes Awarded" value={`£${stats.prizesAwarded.toLocaleString()}+`} />
              <StatItem label="Verified Rounds" value={`${stats.verifiedRounds.toLocaleString()}+`} />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-zinc-900 border border-white/10 overflow-hidden relative group">
              <img 
                src="/assets/community_tech.png" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                alt="Community Tech"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-emerald-500 text-emerald-500" />)}
                </div>
                <p className="text-white text-sm italic font-medium leading-relaxed mb-4">
                  &quot;The Rolling 5 system completely changed how I approach my rounds. It&apos;s competitive, fair, and incredibly addictive.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">James Harrison</div>
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Scratch Golfer • Surrey</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy size={20} className="text-black" />
            </div>
            <span className="font-black text-2xl italic tracking-tighter uppercase">
              GOLF<span className="text-emerald-500">HERO</span>
            </span>
          </div>

          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em] text-center">
            Verified Championship Network • © 2026 GOLF HERO
          </p>

          <div className="flex gap-8">
            <Link href="/privacy" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Terms</Link>
            <Link href="/legal" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Safety</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">{label}</span>
      <span className="text-emerald-400 text-xl font-black italic uppercase tracking-tighter">{value}</span>
    </div>
  );
}

interface BentoCardProps {
  className: string;
  title: string;
  desc: string;
  badge?: string;
  imageUrl?: string;
  icon: React.ReactNode;
}

function BentoCard({ className, title, desc, badge, imageUrl, icon }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative p-10 rounded-[2.5rem] border overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] ${className}`}
    >
      {imageUrl && (
        <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
          {icon}
        </div>
        {badge && (
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/50 group-hover:text-emerald-500 transition-colors px-4 py-1.5 border border-emerald-500/10 bg-emerald-500/5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-12">
        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 leading-none group-hover:translate-x-2 transition-transform">{title}</h3>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-[320px] transition-colors group-hover:text-zinc-200">{desc}</p>
      </div>
    </motion.div>
  );
}
