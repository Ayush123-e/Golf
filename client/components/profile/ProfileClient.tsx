"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Trophy, Heart, Calendar, Camera, Upload, CheckCircle, Zap, AlertCircle } from "lucide-react";
import { updateProfile, uploadAvatar } from "@/actions/profile";
import { useRouter } from "next/navigation";

export default function ProfileClient({ profile, subscription, charity }: { profile: any; subscription: any; charity: any }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await updateProfile(fullName);
    if (!res.error) {
      setSuccess(true);
    } else {
      setError(res.error);
    }
    setLoading(false);
    setTimeout(() => {
      setSuccess(false);
      setError(null);
    }, 5000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadAvatar(formData);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      if (res.url) setAvatarUrl(res.url);
      router.refresh();
    }
    setUploading(false);
    setTimeout(() => {
      setSuccess(false);
      setError(null);
    }, 5000);
  };

  const memberSince = new Date(profile?.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <div className="relative group flex flex-col items-center">
        <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-48 h-48 rounded-[3rem] bg-zinc-900 border-4 border-emerald-500 overflow-hidden relative shadow-[0_0_60px_rgba(16,185,129,0.3)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                <User size={80} />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-emerald-500 hover:text-black transition-all">
                <Camera size={24} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            
            {uploading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 rounded-2xl text-[10px] font-black uppercase text-black italic tracking-widest shadow-xl">
            {profile?.role === 'admin' ? "COMMANDER" : "ELITE MEMBER"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden"
        >
          <Calendar className="text-zinc-600 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">JOURNEY STARTED</p>
          <h4 className="text-2xl font-black italic tracking-tighter uppercase text-white">{memberSince}</h4>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full blur-2xl" />
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="p-8 bg-zinc-900 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden"
        >
          <Heart className="text-emerald-500 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">ELITE IMPACT</p>
          <h4 className="text-2xl font-black italic tracking-tighter uppercase text-white">10% SUBSCRIPTION</h4>
          <p className="text-emerald-500 text-[10px] font-bold uppercase mt-2 tracking-widest">{charity?.name || "No Charity Selected"}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden"
        >
          <Trophy className="text-zinc-600 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">HIGHEST RANKING</p>
          <h4 className="text-2xl font-black italic tracking-tighter uppercase text-white">{profile?.rolling_avg || "0"} AVG</h4>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full blur-2xl" />
        </motion.div>
      </div>

      <div className="p-12 bg-zinc-950 border border-white/5 rounded-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full -mr-48 -mt-48" />
        
        <form onSubmit={handleUpdate} className="relative z-10 max-w-sm mx-auto flex flex-col gap-8">
          <div className="text-center">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">IDENTITY SETTINGS</h3>
            <p className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest">UPDATE YOUR GOLF HERO PROFILE</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-4">GOLFER NAME</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-16 bg-zinc-900 border border-white/5 rounded-2xl px-6 text-sm font-black italic uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full h-16 rounded-2xl font-black italic uppercase text-sm tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 ${
              success ? "bg-white text-black" : 
              error ? "bg-red-500 text-white" : 
              "bg-emerald-500 hover:bg-white text-black"
            }`}
          >
            {loading ? <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" /> : 
             success ? <CheckCircle size={20} /> : 
             error ? <AlertCircle size={20} /> : <Zap size={20} className="fill-black" />}
            {success ? "PROFILE UPDATED" : error ? "UPDATE FAILED" : "SAVE SESSION SETTINGS"}
          </button>
        </form>
      </div>
    </div>
  );
}
