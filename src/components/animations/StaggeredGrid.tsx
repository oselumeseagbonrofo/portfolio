/**
 * StaggeredGrid Component
 * Wraps grid items to animate them with staggered timing
 * Each child element animates in sequence with a configurable delay
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { animationConfig } from '@/utils/animationConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface StaggeredGridProps {
  children: React.ReactNode;
  threshold?: number;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
}

export function StaggeredGrid({
  children,
  threshold = 0.5,
  staggerDelay = animationConfig.stagger.grid,
  direction = 'up',
  distance = 50,
  className,
}: StaggeredGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger animation once when threshold is exceeded
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setIsVisible(true);
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

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : animationConfig.durations.medium,
        ease: animationConfig.easings.entrance,
      },
    },
  };

  // Convert children to array and wrap each in motion.div
  const childArray = React.Children.toArray(children);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
