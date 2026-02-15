'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  const uniqueId = React.useId().replace(/:/g, '');
  const glowId = `${uniqueId}-glow`;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 340, damping: 16 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 96 96" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <path
          d="M16 18.5C16 15.4624 18.4624 13 21.5 13H74.5C77.5376 13 80 15.4624 80 18.5V77.5C80 80.5376 77.5376 83 74.5 83H21.5C18.4624 83 16 80.5376 16 77.5V18.5Z"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        <path
          d="M25 47.5C25 35.07 35.07 25 47.5 25C59.93 25 70 35.07 70 47.5C70 59.93 59.93 70 47.5 70"
          stroke="hsl(var(--primary))"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M44 70L58 29L72 70"
          stroke="hsl(var(--primary))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M51.5 56H66.5" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinecap="round" />

        <path
          d="M70.4 21.8L75.8 27.2"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.45"
          strokeWidth="2"
          filter={`url(#${glowId})`}
        />
      </svg>
    </motion.div>
  );
}
