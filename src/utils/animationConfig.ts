/**
 * Centralized animation configuration
 * Provides consistent timing and easing settings across the application
 */

import { Easing } from 'framer-motion';

export interface AnimationConfig {
  durations: {
    fast: number;
    medium: number;
    slow: number;
  };
  easings: {
    entrance: Easing;
    exit: Easing;
    smooth: Easing;
  };
  stagger: {
    grid: number;
    list: number;
  };
}

export const animationConfig: AnimationConfig = {
  durations: {
    fast: 0.3,
    medium: 0.6,
    slow: 1.2,
  },
  easings: {
    entrance: 'easeOut',
    exit: 'easeIn',
    smooth: 'easeInOut',
  },
  stagger: {
    grid: 0.1,
    list: 0.15,
  },
};

// Framer Motion variants for common animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationConfig.durations.medium,
      ease: animationConfig.easings.entrance,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: animationConfig.durations.fast,
      ease: animationConfig.easings.exit,
    },
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: animationConfig.durations.medium,
      ease: animationConfig.easings.entrance,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: animationConfig.durations.fast,
      ease: animationConfig.easings.exit,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: animationConfig.durations.medium,
      ease: animationConfig.easings.entrance,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: animationConfig.durations.fast,
      ease: animationConfig.easings.exit,
    },
  },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationConfig.durations.medium,
      ease: animationConfig.easings.entrance,
    },
  },
  exit: { 
    opacity: 0, 
    x: -50,
    transition: {
      duration: animationConfig.durations.fast,
      ease: animationConfig.easings.exit,
    },
  },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationConfig.durations.medium,
      ease: animationConfig.easings.entrance,
    },
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: {
      duration: animationConfig.durations.fast,
      ease: animationConfig.easings.exit,
    },
  },
};
