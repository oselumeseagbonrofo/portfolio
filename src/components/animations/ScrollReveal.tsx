/**
 * ScrollReveal Component
 * Wraps components to trigger animations when scrolled into view
 * Uses Intersection Observer API for efficient scroll detection
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { animationConfig } from '@/utils/animationConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAccessibility } from '@/components/accessibility';
import { getAccessibleVariants } from '@/utils/accessibility';

export interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  threshold = 0.5,
  delay = 0,
  direction = 'up',
  distance = 50,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { announce } = useAccessibility();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger animation once when threshold is exceeded
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setIsVisible(true);
          // Announce to screen readers when content becomes visible
          if (prefersReducedMotion) {
            announce('New content is now visible', 'polite');
          }
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  // Use accessible variants that respect user preferences
  const baseVariants = getAccessibleVariants(prefersReducedMotion);
  
  const variants: Variants = prefersReducedMotion 
    ? baseVariants 
    : {
        hidden: {
          opacity: 0,
          ...getInitialPosition(),
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: animationConfig.durations.medium,
            delay: delay,
            ease: animationConfig.easings.entrance,
          },
        },
      };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
