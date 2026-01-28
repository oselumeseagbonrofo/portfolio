/**
 * Accessibility utilities for enhanced UI animations
 * Provides comprehensive accessibility support including reduced motion,
 * keyboard navigation, screen reader support, and WCAG compliance
 */

import { useEffect, useState } from 'react';
import { Easing, Variants } from 'framer-motion';

/**
 * Enhanced reduced motion detection with fallback animations
 * Provides alternative animations that respect user preferences
 */
export interface ReducedMotionConfig {
  prefersReducedMotion: boolean;
  fallbackDuration: number;
  fallbackEasing: Easing;
}

export function useAccessibleMotion(): ReducedMotionConfig {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return {
    prefersReducedMotion,
    fallbackDuration: prefersReducedMotion ? 0.2 : 0.6, // Shorter, simpler animations
    fallbackEasing: prefersReducedMotion ? 'easeInOut' : 'easeOut',
  };
}

/**
 * Keyboard navigation utilities
 * Provides consistent keyboard interaction patterns
 */
export interface KeyboardNavigationProps {
  onEnterPress?: () => void;
  onSpacePress?: () => void;
  onEscapePress?: () => void;
  onArrowNavigation?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export function useKeyboardNavigation({
  onEnterPress,
  onSpacePress,
  onEscapePress,
  onArrowNavigation,
}: KeyboardNavigationProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (onEnterPress) {
          event.preventDefault();
          onEnterPress();
        }
        break;
      case ' ':
        if (onSpacePress) {
          event.preventDefault();
          onSpacePress();
        }
        break;
      case 'Escape':
        if (onEscapePress) {
          event.preventDefault();
          onEscapePress();
        }
        break;
      case 'ArrowUp':
        if (onArrowNavigation) {
          event.preventDefault();
          onArrowNavigation('up');
        }
        break;
      case 'ArrowDown':
        if (onArrowNavigation) {
          event.preventDefault();
          onArrowNavigation('down');
        }
        break;
      case 'ArrowLeft':
        if (onArrowNavigation) {
          event.preventDefault();
          onArrowNavigation('left');
        }
        break;
      case 'ArrowRight':
        if (onArrowNavigation) {
          event.preventDefault();
          onArrowNavigation('right');
        }
        break;
    }
  };

  return { handleKeyDown };
}

/**
 * Focus management utilities
 * Provides accessible focus handling for interactive elements
 */
export function useFocusManagement() {
  const [focusVisible, setFocusVisible] = useState<boolean>(false);

  const handleFocus = () => {
    setFocusVisible(true);
  };

  const handleBlur = () => {
    setFocusVisible(false);
  };

  const handleMouseDown = () => {
    setFocusVisible(false);
  };

  return {
    focusVisible,
    focusProps: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseDown: handleMouseDown,
    },
  };
}

/**
 * Screen reader utilities
 * Provides screen reader announcements and ARIA support
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * WCAG color contrast utilities
 * Validates and provides accessible color combinations
 */
export interface ColorContrastResult {
  ratio: number;
  isAccessible: boolean;
  level: 'AA' | 'AAA' | 'fail';
}

export function calculateColorContrast(foreground: string, background: string): ColorContrastResult {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    return { ratio: 0, isAccessible: false, level: 'fail' };
  }

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

  let level: 'AA' | 'AAA' | 'fail' = 'fail';
  let isAccessible = false;

  if (ratio >= 7) {
    level = 'AAA';
    isAccessible = true;
  } else if (ratio >= 4.5) {
    level = 'AA';
    isAccessible = true;
  }

  return { ratio, isAccessible, level };
}

/**
 * Accessible animation variants for Framer Motion
 * Provides fallback animations that respect reduced motion preferences
 */
export function getAccessibleVariants(prefersReducedMotion: boolean): Variants {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.2, ease: 'easeInOut' }
      },
      exit: { 
        opacity: 0,
        transition: { duration: 0.1, ease: 'easeInOut' }
      }
    };
  }

  return {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: { 
        duration: 0.3, 
        ease: 'easeIn'
      }
    }
  };
}

/**
 * Skip link component for keyboard navigation
 * Allows users to skip to main content
 */
export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * ARIA live region hook for dynamic content announcements
 */
export function useAriaLiveRegion() {
  const [message, setMessage] = useState<string>('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  const announce = (text: string, level: 'polite' | 'assertive' = 'polite') => {
    setMessage(text);
    setPriority(level);
    
    // Clear message after announcement
    setTimeout(() => {
      setMessage('');
    }, 1000);
  };

  return {
    message,
    priority,
    announce,
  };
}

/**
 * High contrast mode detection
 * Detects if user prefers high contrast and adjusts styling accordingly
 */
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersHighContrast;
}