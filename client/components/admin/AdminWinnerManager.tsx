"use client";

import { useState, useEffect } from "react";
import { adminVerifyWinner, adminMarkPaid } from "@/actions/draws";
import { Check, X, CreditCard, ExternalLink, Image as ImageIcon, Loader2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminWinnerManager({ winners }: { winners: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredWinners = winners.filter(w => {
    if (filter === 'all') return true;
    return w.status === filter;
  });

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    const res = await adminVerifyWinner(id, status);
    if (res.error) alert(res.error);
    setLoadingId(null);
  };

  const handlePay = async (id: string) => {
    setLoadingId(id);
    const res = await adminMarkPaid(id);
    if (res.error) alert(res.error);
    setLoadingId(null);
  };

  return (
    <div className="mt-12 p-8 bg-zinc-900/50 border border-emerald-500/20 rounded-[2.5rem]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <CreditCard size={20} className="text-black" />
          </div>
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Winner Management</h3>
            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">Review, Verify & Process Payouts</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {['all', 'pending', 'approved', 'paid', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              <th className="px-6 py-4">Winner</th>
              <th className="px-6 py-4">Match</th>
              <th className="px-6 py-4">Prize</th>
              <th className="px-6 py-4">Proof</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWinners.map((winner) => (
              <tr key={winner.id} className="group transition-all">
                <td className="px-6 py-4 bg-zinc-950/50 border-y border-l border-white/5 rounded-l-2xl">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{winner.user_id.split('-')[0]}</span>
                </td>
                <td className="px-6 py-4 bg-zinc-950/50 border-y border-white/5">
                  <span className="text-xs font-black italic text-emerald-500">{winner.match_count} MATCH</span>
                </td>
                <td className="px-6 py-4 bg-zinc-950/50 border-y border-white/5">
                  <span className="text-xs font-black text-white italic tracking-tighter">£{Math.floor(winner.prize_amount).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 bg-zinc-950/50 border-y border-white/5">
                  {winner.proof_url ? (
                    <button 
                      onClick={() => setPreviewImage(winner.proof_url)}
                      className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 transition-all group/img"
                    >
                      <ImageIcon size={16} className="text-emerald-500 group-hover/img:text-black" />
                    </button>
                  ) : (
                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">No Proof</span>
                  )}
                </td>
                <td className="px-6 py-4 bg-zinc-950/50 border-y border-white/5">
                   <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                     winner.status === 'paid' ? 'bg-emerald-500 text-black border-transparent' :
                     winner.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                     winner.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                     'bg-orange-500/10 text-orange-500 border-orange-500/20'
                   }`}>
                     {winner.status}
                   </div>
                </td>
                <td className="px-6 py-4 bg-zinc-950/50 border-y border-r border-white/5 rounded-r-2xl text-right">
                  <div className="flex items-center justify-end gap-2">
                    {winner.status === 'pending' && winner.proof_url && (
                      <>
                        <button 
                          onClick={() => handleVerify(winner.id, 'approved')}
                          disabled={!!loadingId}
                          className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                        >
                          {loadingId === winner.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        </button>
                        <button 
                          onClick={() => handleVerify(winner.id, 'rejected')}
                          disabled={!!loadingId}
                          className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {winner.status === 'approved' && (
                      <button 
                        onClick={() => handlePay(winner.id)}
                        disabled={!!loadingId}
                        className="px-4 py-2 bg-emerald-500 text-black font-black uppercase text-[9px] tracking-widest rounded-lg hover:bg-white transition-all flex items-center gap-2"
                      >
                        {loadingId === winner.id ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                        MARK PAID
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-20"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-4xl w-full"
            >
              <img src={previewImage} alt="Proof Full" className="w-full h-auto rounded-[3rem] shadow-2xl border border-white/10" />
              <button 
                className="absolute -top-12 right-0 text-zinc-500 hover:text-white flex items-center gap-2 uppercase font-black text-[10px] tracking-widest"
                onClick={() => setPreviewImage(null)}
              >
                CLOSE [ESC]
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
