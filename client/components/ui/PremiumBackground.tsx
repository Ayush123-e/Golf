"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PremiumBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className="fixed inset-0 z-0 bg-transparent pointer-events-none overflow-hidden">
      {/* Topographic/Course Elevation Lines (Animated) - INCREASED VISIBILITY */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.2] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <motion.path
          d="M-100 200 C 150 150, 250 350, 600 250 S 900 150, 1200 300"
          stroke="#10b981"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M-100 400 C 200 350, 450 550, 800 450 S 1100 350, 1400 500"
          stroke="#10b981"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
        />
        <motion.circle
          cx="85%"
          cy="20%"
          r="60"
          stroke="#10b981"
          strokeWidth="1"
          fill="none"
          filter="url(#glow)"
          animate={{ r: [55, 75, 55], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Background Glows (Mesh) - INCREASED INTENSITY */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/15 blur-[120px] rounded-full animate-mesh opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/20 blur-[100px] rounded-full animate-mesh opacity-30 [animation-delay:-7s]" />
      
      {/* HUD Grid Pattern - MORE VISIBLE */}
      <div className="absolute inset-0 opacity-[0.08]" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10l5 5m90 90l-5-5' stroke='%2310b981' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
             backgroundSize: '100px 100px'
           }} 
      />

      {/* Floating Interactive Particles - BRIGHTER */}
      {isMounted && [...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_15px_#10b981]"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0 
          }}
          animate={{ 
            y: ["-10%", "110%"],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{ 
            duration: 12 + Math.random() * 12, 
            repeat: Infinity, 
            delay: Math.random() * 12,
            ease: "linear"
          }}
        />
      ))}

      <div className="scanline" />
    </div>
  );
}
