/**
 * SkipLink Component
 * Provides keyboard navigation to skip to main content
 * Essential for screen reader and keyboard-only users
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileFocus={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-0 left-0 z-[9999]"
    >
      <a
        href={href}
        className={`
          absolute top-[-40px] left-1.5 
          bg-primary text-primary-foreground 
          px-4 py-2 
          rounded-b-md 
          no-underline 
          text-sm font-bold 
          z-[9999] 
          -translate-y-full 
          transition-transform duration-200 
          focus:translate-y-10 
          focus:outline focus:outline-2 focus:outline-secondary focus:outline-offset-2 
          hover:bg-primary/90
          ${className}
        `}
      >
        {children}
      </a>
    </motion.div>
  );
}

export default SkipLink;