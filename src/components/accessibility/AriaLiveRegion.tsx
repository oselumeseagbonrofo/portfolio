/**
 * AriaLiveRegion Component
 * Provides screen reader announcements for dynamic content changes
 * Essential for communicating state changes to assistive technologies
 */

'use client';

import React from 'react';

export interface AriaLiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export function AriaLiveRegion({ 
  message, 
  priority = 'polite', 
  className 
}: AriaLiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className || ''}`}
    >
      {message}
    </div>
  );
}

export default AriaLiveRegion;