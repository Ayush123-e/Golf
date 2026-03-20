"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Trophy, PlusCircle, User } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Draws', href: '/draws', icon: Trophy },
  { name: 'Scores', href: '/scores/new', icon: PlusCircle },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-800 px-6 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="relative flex flex-col items-center gap-1 group">
              <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span className={`text-[10px] ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -top-[14px] w-8 h-1 bg-emerald-400 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
