/**
 * AriaLiveRegion Component
 * Provides screen reader announcements for dynamic content changes
 * Essential for communicating state changes to assistive technologies
 */

'use client';

import React from 'react';
import { Box } from '@mui/material';

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
    <Box
      aria-live={priority}
      aria-atomic="true"
      className={className}
      sx={{
        position: 'absolute',
        left: -10000,
        width: 1,
        height: 1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </Box>
  );
}

export default AriaLiveRegion;