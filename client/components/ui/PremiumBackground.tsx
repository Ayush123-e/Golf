"use client";

import React from 'react';

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-transparent pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[80px] rounded-full animate-mesh opacity-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/10 blur-[60px] rounded-full animate-mesh opacity-10 [animation-delay:-5s]" />
      

      <div className="scanline" />
    </div>
  );
}
