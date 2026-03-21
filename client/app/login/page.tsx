"use client";

import Link from "next/link";
import { Trophy, ArrowRight, ShieldCheck, Mail, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden relative flex flex-col items-center justify-center px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="mb-8 group">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:rotate-6 transition-transform">
              <Trophy size={32} className="text-black" />
            </div>
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">WELCOME <span className="text-emerald-500 text-shadow-glow">HERO</span></h1>
          <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">The Network is Waiting</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="email" 
                  placeholder="name@golfhero.com" 
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Member Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:bg-white hover:scale-[1.02] active:scale-95 group mt-8 shadow-xl shadow-emerald-500/20">
              AUTHORIZE ACCESS 
              <Zap size={20} className="fill-black group-hover:animate-pulse" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-500" />
             Biometric Security Enabled
          </p>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors underline underline-offset-4">
            Back to Platform
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
