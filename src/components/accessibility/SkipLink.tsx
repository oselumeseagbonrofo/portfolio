'use client';

import React from 'react';
import { FocusIndicator } from './FocusIndicator';

export interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipLink({ 
  href = '#main-content', 
  children = 'Skip to main content',
  className = ''
}: SkipLinkProps) {
  return (
    <div className={`fixed top-4 left-4 z-[100] translate-y-[-150%] focus-within:translate-y-0 transition-transform duration-300 ${className}`}>
      <FocusIndicator>
        <a
          href={href}
          className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg block"
        >
          {children}
        </a>
      </FocusIndicator>
    </div>
  );
}

export default SkipLink;