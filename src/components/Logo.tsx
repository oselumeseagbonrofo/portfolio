'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D5DF2" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          
          <mask id="overlap-mask">
            <rect width="100" height="100" fill="white" />
            <path 
              d="M45 80 L70 20" 
              stroke="black" 
              strokeWidth="12" 
              strokeLinecap="round" 
            />
          </mask>
        </defs>

        {/* The 'O' */}
        <circle 
          cx="38" 
          cy="50" 
          r="28" 
          stroke="url(#logo-gradient)" 
          strokeWidth="9" 
        />

        {/* The 'A' Structure */}
        <path 
          d="M45 80 L70 20 L95 80" 
          stroke="url(#logo-gradient)" 
          strokeWidth="9" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* The 'A' Crossbar */}
        <path 
          d="M54 62 H86" 
          stroke="url(#logo-gradient)" 
          strokeWidth="9" 
          strokeLinecap="round" 
        />
      </svg>
    </motion.div>
  );
}
