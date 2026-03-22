"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, PlusCircle, User, Settings, Zap } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Monthly Draw', href: '/draws', icon: Zap },
  { name: 'Add Score', href: '/scores/new', icon: PlusCircle },
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
];

export default function Navigation() {
  const pathname = usePathname();
  const hideNav = ['/', '/login', '/signup'].includes(pathname);
  if (hideNav) return null;

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-zinc-950 border-r border-zinc-800 p-6">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black italic tracking-tighter text-emerald-500 underline uppercase decoration-2 underline-offset-4">GOLF HERO</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-4">
           <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white w-full transition-colors group">
             <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
             <span className="font-medium">Settings</span>
           </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-6 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 group">
                <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className={`text-[10px] ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
