"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Lock, Edit2, Trophy, Target } from "lucide-react";
import Link from "next/link";
import ScoreEditModal from "./ScoreEditModal";

interface RoundHistoryClientProps {
  scores: any[];
}

export default function RoundHistoryClient({ scores }: RoundHistoryClientProps) {
  const [editingScore, setEditingScore] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (score: any) => {
    if (score.is_locked) return;
    setEditingScore(score);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {scores && scores.length > 0 ? (
          scores.map((s) => (
            <div 
              key={s.id}
              className="flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                  <span className="text-lg font-black text-white">{s.score}</span>
                  <span className="text-[7px] text-zinc-500 uppercase font-black tracking-widest">Points</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-emerald-400 transition-colors">Stableford Round</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={10} className="text-zinc-600" />
                    <span className="text-[10px] font-bold text-zinc-600">{format(new Date(s.played_at), 'MMMM do, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {s.is_locked ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950/50 border border-white/5 rounded-xl text-zinc-600">
                    <Lock size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Locked</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEdit(s)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <Edit2 size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Edit</span>
                  </button>
                )}
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <Target size={16} className="text-emerald-500/20" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[2.5rem]">
            <Trophy size={48} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No rounds recorded yet.</p>
            <Link href="/scores/new" className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-4 inline-block hover:underline">
              Record your first score
            </Link>
          </div>
        )}
      </div>

      <ScoreEditModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingScore(null);
        }} 
        scoreData={editingScore}
      />
    </>
  );
}
