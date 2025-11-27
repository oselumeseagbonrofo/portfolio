/**
 * FocusIndicator Component
 * Provides enhanced focus indicators for better keyboard navigation visibility
 * Ensures WCAG compliance for focus management
 */

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useFocusManagement, useHighContrast } from '@/utils/accessibility';

export interface FocusIndicatorProps {
  children: React.ReactNode;
  focusColor?: string;
  focusWidth?: number;
  borderRadius?: number;
  className?: string;
}

export function FocusIndicator({
  children,
  focusColor = '#2563eb',
  focusWidth = 2,
  borderRadius = 4,
  className,
}: FocusIndicatorProps) {
  const { focusVisible, focusProps } = useFocusManagement();
  const prefersHighContrast = useHighContrast();

  // Adjust focus indicator for high contrast mode
  const effectiveFocusColor = prefersHighContrast ? '#000000' : focusColor;
  const effectiveFocusWidth = prefersHighContrast ? focusWidth + 1 : focusWidth;

  return (
    <Box
      {...focusProps}
      className={className}
      sx={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: `${borderRadius}px`,
        '&:focus-within': {
          outline: 'none',
        },
      }}
    >
      {children}
      
      {/* Enhanced focus indicator */}
      {focusVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: -effectiveFocusWidth,
            left: -effectiveFocusWidth,
            right: -effectiveFocusWidth,
            bottom: -effectiveFocusWidth,
            border: `${effectiveFocusWidth}px solid ${effectiveFocusColor}`,
            borderRadius: `${borderRadius + effectiveFocusWidth}px`,
            pointerEvents: 'none',
            zIndex: 1,
            boxShadow: prefersHighContrast 
              ? `0 0 0 1px #ffffff` 
              : `0 0 0 ${effectiveFocusWidth}px rgba(37, 99, 235, 0.2)`,
          }}
        />
      )}
    </Box>
  );
}

export default FocusIndicator;