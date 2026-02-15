/**
 * AnimatedCard Component
 * Provides 3D tilt effect based on mouse position within the card bounds
 * Calculates tilt angles using mouse position relative to card center
 */

'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { animationConfig } from '@/utils/animationConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useKeyboardNavigation } from '@/utils/accessibility';
import { FocusIndicator } from '@/components/accessibility';

export interface AnimatedCardProps {
  children: React.ReactNode;
  tiltEnabled?: boolean;
  tiltStrength?: number;
  hoverScale?: number;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
  onKeyPress?: () => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
}

export function AnimatedCard({
  children,
  tiltEnabled = true,
  tiltStrength = 10,
  hoverScale = 1.05,
  glowColor = 'rgba(59, 130, 246, 0.5)',
  className = '',
  onClick,
  onKeyPress,
  tabIndex,
  role,
  'aria-label': ariaLabel,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Motion values for smooth tilt animation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Apply spring physics for smooth motion
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  // Keyboard navigation support
  const { handleKeyDown } = useKeyboardNavigation({
    onEnterPress: onClick || onKeyPress,
    onSpacePress: onClick || onKeyPress,
  });

  /**
   * Calculate tilt angles based on mouse position
   * Property 10: Card tilt calculation
   * rotateX = (mouseY - centerY) / height * tiltStrength
   * rotateY = (mouseX - centerX) / width * tiltStrength
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || prefersReducedMotion || !ref.current) return;

    const card = ref.current;
    const rect = card.getBoundingClientRect();

    // Get mouse position relative to card
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt angles
    const tiltX = ((mouseY - centerY) / rect.height) * tiltStrength;
    const tiltY = ((mouseX - centerX) / rect.width) * tiltStrength;

    // Apply tilt (note: rotateX is inverted for natural feel)
    rotateX.set(-tiltX);
    rotateY.set(tiltY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt to neutral position
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsHovered(true); // Treat focus like hover for consistent experience
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsHovered(false);
    // Reset tilt to neutral position
    rotateX.set(0);
    rotateY.set(0);
  };

  const isInteractive = onClick || onKeyPress || tabIndex !== undefined;

  return (
    <FocusIndicator>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        onClick={onClick}
        tabIndex={isInteractive ? (tabIndex ?? 0) : undefined}
        role={role || (isInteractive ? 'button' : undefined)}
        aria-label={ariaLabel}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateXSpring,
          rotateY: prefersReducedMotion ? 0 : rotateYSpring,
          transformStyle: 'preserve-3d',
          cursor: isInteractive ? 'pointer' : 'default',
        }}
        animate={{
          scale: (isHovered || isFocused) && !prefersReducedMotion ? hoverScale : 1,
        }}
        transition={{
          scale: {
            duration: animationConfig.durations.fast,
            ease: animationConfig.easings.smooth,
          },
        }}
        className={className}
      >
        {/* Glow effect on hover/focus */}
        {(isHovered || isFocused) && !prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationConfig.durations.fast }}
            style={{
              position: 'absolute',
              inset: -2,
              backgroundColor: glowColor,
              opacity: 0.08,
              borderRadius: 'inherit',
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        )}
        {children}
      </motion.div>
    </FocusIndicator>
  );
}

/**
 * Utility function to calculate tilt angles
 * Exported for testing purposes
 */
export function calculateTiltAngles(
  mouseX: number,
  mouseY: number,
  cardWidth: number,
  cardHeight: number,
  tiltStrength: number
): { rotateX: number; rotateY: number } {
  const centerX = cardWidth / 2;
  const centerY = cardHeight / 2;

  const tiltX = ((mouseY - centerY) / cardHeight) * tiltStrength;
  const tiltY = ((mouseX - centerX) / cardWidth) * tiltStrength;

  return {
    rotateX: -tiltX, // Inverted for natural feel
    rotateY: tiltY,
  };
}
