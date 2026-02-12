'use client';

import React from 'react';
import { FocusIndicator } from './FocusIndicator';

export function SkipLink() {
  return (
    <div className="fixed top-4 left-4 z-[100] translate-y-[-150%] focus-within:translate-y-0 transition-transform duration-300">
      <FocusIndicator>
        <a
          href="#main-content"
          className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg block"
        >
          Skip to main content
        </a>
      </FocusIndicator>
    </div>
  );
}
export default SkipLink;