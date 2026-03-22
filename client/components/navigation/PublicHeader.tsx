"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function PublicHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();


  const isPublicPage = ["/", "/login", "/signup"].includes(pathname);
  if (!isPublicPage) return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/10" : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
            <Trophy size={20} className="text-black" />
          </div>
          <span className="font-black text-2xl italic tracking-tighter uppercase">
            GOLF<span className="text-emerald-500">HERO</span>
          </span>
        </Link>


        <nav className="hidden md:flex items-center gap-10">
          <NavLink href="/leaderboard">LEADERBOARD</NavLink>
          <NavLink href="/#features">FEATURES</NavLink>
          <NavLink href="/#about">ABOUT</NavLink>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          
          {user ? (
            <Link 
              href="/dashboard"
              className="bg-emerald-500 text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group"
            >
              DASHBOARD
              <Zap size={14} className="fill-black group-hover:animate-pulse" />
            </Link>
          ) : (
            <Link 
              href="/login"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all"
            >
              SIGN IN
            </Link>
          )}
        </nav>


        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>


      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              <MobileNavLink href="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>LEADERBOARD</MobileNavLink>
              <MobileNavLink href="/#features" onClick={() => setIsMobileMenuOpen(false)}>FEATURES</MobileNavLink>
              <MobileNavLink href="/#about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</MobileNavLink>
              <Link 
                href={user ? "/dashboard" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-emerald-500 text-black py-4 rounded-2xl font-black text-center uppercase tracking-widest"
              >
                {user ? "DASHBOARD" : "SIGN IN"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-emerald-400 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="text-lg font-black uppercase tracking-widest text-zinc-200"
    >
      {children}
    </Link>
  );
}
