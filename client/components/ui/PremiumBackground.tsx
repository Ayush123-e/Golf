"use client";

import React from 'react';

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-transparent pointer-events-none overflow-hidden">
      <div className="absolute inset-0 noise-overlay" />
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[150px] rounded-full animate-mesh opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[120px] rounded-full animate-mesh opacity-40 [animation-delay:-5s]" />
      
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="scanline" />
    </div>
  );
}
