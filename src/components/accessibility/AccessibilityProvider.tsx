/**
 * AccessibilityProvider Component
 * Provides global accessibility context and settings
 * Manages reduced motion, high contrast, and other accessibility preferences
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAccessibleMotion, useHighContrast, useAriaLiveRegion } from '@/utils/accessibility';
import { Easing } from 'framer-motion';
import AriaLiveRegion from './AriaLiveRegion';
import SkipLink from './SkipLink';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  fallbackDuration: number;
  fallbackEasing: Easing;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export interface AccessibilityProviderProps {
  children: ReactNode;
  skipLinkHref?: string;
  skipLinkText?: string;
}

export function AccessibilityProvider({ 
  children, 
  skipLinkHref = '#main-content',
  skipLinkText = 'Skip to main content'
}: AccessibilityProviderProps) {
  const { prefersReducedMotion, fallbackDuration, fallbackEasing } = useAccessibleMotion();
  const prefersHighContrast = useHighContrast();
  const { message, priority, announce } = useAriaLiveRegion();

  const contextValue: AccessibilityContextType = {
    prefersReducedMotion,
    prefersHighContrast,
    fallbackDuration,
    fallbackEasing,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Skip link for keyboard navigation */}
      <SkipLink href={skipLinkHref}>
        {skipLinkText}
      </SkipLink>
      
      {/* ARIA live region for announcements */}
      <AriaLiveRegion message={message} priority={priority} />
      
      {children}
    </AccessibilityContext.Provider>
  );
}

export default AccessibilityProvider;