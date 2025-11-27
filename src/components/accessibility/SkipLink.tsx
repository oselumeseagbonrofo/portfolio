/**
 * SkipLink Component
 * Provides keyboard navigation to skip to main content
 * Essential for screen reader and keyboard-only users
 */

'use client';

import React from 'react';
import { Box, Link } from '@mui/material';
import { motion } from 'framer-motion';

export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileFocus={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Link
        href={href}
        className={className}
        sx={{
          position: 'absolute',
          top: -40,
          left: 6,
          background: 'primary.main',
          color: 'primary.contrastText',
          padding: '8px 16px',
          borderRadius: '0 0 4px 4px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 9999,
          transform: 'translateY(-100%)',
          transition: 'transform 0.2s ease',
          '&:focus': {
            transform: 'translateY(0)',
            outline: '2px solid',
            outlineColor: 'secondary.main',
            outlineOffset: '2px',
          },
          '&:hover': {
            background: 'primary.dark',
          },
        }}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default SkipLink;