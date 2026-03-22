"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Heart, 
  BarChart3, 
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Trophy, label: "Draws", href: "/admin/draws" },
  { icon: ShieldCheck, label: "Winners", href: "/admin/winners" },
  { icon: Heart, label: "Charities", href: "/admin/charities" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-screen sticky top-0 bg-zinc-950 border-r border-white/5 flex flex-col pt-12 pb-8 px-6">
      <div className="flex items-center gap-3 px-4 mb-12">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <Settings size={20} className="text-black" />
        </div>
        <div>
          <h2 className="text-xl font-black italic tracking-tighter uppercase text-white leading-none">Admin<br />Control</h2>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between p-4 rounded-2xl transition-all ${
                isActive ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/5">
        <Link 
          href="/dashboard"
          className="flex items-center gap-4 p-4 text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={20} />
          Back to Platform
        </Link>
      </div>
    </aside>
  );
}
