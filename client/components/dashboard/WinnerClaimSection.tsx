"use client";

import { useState } from "react";
import { uploadWinnerProof } from "@/actions/draws";
import { Upload, CheckCircle2, Clock, AlertCircle, Loader2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiTrigger from "../ui/ConfettiTrigger";

export default function WinnerClaimSection({ winner }: { winner: any }) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!winner) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please upload a smaller image.");
      return;
    }

    setUploading(true);
    setStatus("Uploading Proof...");

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadWinnerProof(winner.id, formData);
    if (res.error) {
      alert(res.error);
      setStatus(null);
    } else {
      setStatus("Proof Submitted Successfully!");
    }
    setUploading(false);
  };

  const statusConfig = {
    pending: { label: "Under Review", icon: <Clock size={14} className="text-orange-500" />, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    approved: { label: "Approved", icon: <CheckCircle2 size={14} className="text-emerald-500" />, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    rejected: { label: "Rejected", icon: <AlertCircle size={14} className="text-red-500" />, color: "bg-red-500/10 text-red-500 border-red-500/20" },
    paid: { label: "Paid", icon: <CheckCircle2 size={14} className="text-emerald-500" />, color: "bg-emerald-500 text-black border-transparent" }
  };

  const config = statusConfig[winner.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="space-y-6">
      <ConfettiTrigger />
      <div className="p-8 bg-zinc-900 border border-emerald-500/20 rounded-[3rem] relative overflow-hidden group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Winner Claim</span>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${config.color}`}>
                {config.icon}
                {config.label}
              </div>
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">
              Claim Your £{Math.floor(winner.prize_amount).toLocaleString()}
            </h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-widest">
              {winner.match_count} Match Draw Result
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!winner.proof_url || winner.status === 'rejected' ? (
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <button className="flex items-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-white text-black font-black italic uppercase text-xs tracking-tighter rounded-2xl transition-all active:scale-95">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  UPLOAD VERIFICATION PROOF
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-black border border-white/5 overflow-hidden">
                <img src={winner.proof_url} alt="Proof" className="w-full h-full object-cover opacity-60" />
              </div>
            )}
          </div>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{status}</span>
          </motion.div>
        )}

        {winner.status === 'approved' && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-pulse">
            <Clock size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">
              Identity Verified. Payout Processing by admin.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
