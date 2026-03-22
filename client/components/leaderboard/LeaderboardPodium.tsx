"use client";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal } from "lucide-react";

export default function LeaderboardPodium({ topThree }: { topThree: any[] }) {
  if (!topThree || topThree.length === 0) return null;

  // Ensure we have exactly 3 slots for the podium layout [2, 1, 3]
  const slots = [
    { p: topThree[1], rank: 2, height: "h-32 md:h-48", color: "bg-zinc-400/10", border: "border-zinc-400/20", icon: <Medal className="text-zinc-400" /> },
    { p: topThree[0], rank: 1, height: "h-48 md:h-64", color: "bg-emerald-500/10", border: "border-emerald-500/30", icon: <Crown size={32} className="text-emerald-400 drop-shadow-glow" />, glow: true },
    { p: topThree[2], rank: 3, height: "h-24 md:h-36", color: "bg-amber-700/10", border: "border-amber-700/20", icon: <Medal className="text-amber-700" /> }
  ];

  return (
    <div className="flex items-end justify-center gap-2 md:gap-4 mb-16 pt-10">
      {slots.map((slot, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center flex-1 max-w-[120px] md:max-w-[180px]"
        >
          {slot.p ? (
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="relative mb-3">
                <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full border-2 p-1 overflow-hidden transition-all ${slot.glow ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "border-zinc-800"}`}>
                  <img src={slot.p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${slot.p.id}`} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className={`absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${slot.color} border ${slot.border} backdrop-blur-md`}>
                  {slot.icon}
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-300 truncate w-full px-2">{slot.p.full_name || "Golfer"}</span>
              <span className="text-lg md:text-2xl font-black italic text-white">{slot.p.rolling_avg || 0}</span>
            </div>
          ) : (
            <div className="h-20" /> // Spacer for empty slots
          )}
          
          <div className={`w-full ${slot.height} ${slot.color} border-t border-x ${slot.border} rounded-t-3xl relative overflow-hidden group`}>
            {slot.glow && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-6xl font-black italic text-white/5 uppercase select-none">#{slot.rank}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
