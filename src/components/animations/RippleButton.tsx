/**
 * RippleButton Component
 * Button component with ripple effect emanating from click position
 * Implements scale pulse feedback on click
 */

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animationConfig } from '@/utils/animationConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useKeyboardNavigation } from '@/utils/accessibility';
import { FocusIndicator } from '@/components/accessibility';

export interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  rippleColor?: string;
  rippleDuration?: number;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function RippleButton({
  children,
  onClick,
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  rippleDuration = 0.6,
  className = '',
  disabled = false,
  type = 'button',
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  /**
   * Handle both mouse and touch events for cross-platform compatibility
   * Calculate ripple origin position relative to button bounds
   * Property 12: Ripple origin positioning
   * For any button click at position (x, y) within the button bounds,
   * the ripple effect should originate from coordinates (x, y) relative
   * to the button's top-left corner.
   */
  const handleInteraction = (
    clientX: number,
    clientY: number,
    event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    if (disabled || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();

    // Calculate interaction position relative to button's top-left corner
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Create new ripple
    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    const rippleTimeout = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, rippleDuration * 1000);
    timeoutsRef.current.push(rippleTimeout);

    // Trigger scale pulse animation - Property 15: Click feedback animation
    // For any button click event, a scale pulse animation should trigger,
    // scaling from 1.0 to 0.95 and back to 1.0 within 0.2 seconds.
    setIsPressed(true);
    const pressTimeout = setTimeout(() => {
      setIsPressed(false);
    }, 200);
    timeoutsRef.current.push(pressTimeout);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleInteraction(event.clientX, event.clientY, event);

    // Call user's onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  // Handle touch events for mobile devices - Requirement 8.4
  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      handleInteraction(touch.clientX, touch.clientY, event);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      disabled={disabled}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent', // Remove default mobile tap highlight
        touchAction: 'manipulation', // Improve touch responsiveness
      }}
      animate={{
        scale: isPressed && !prefersReducedMotion ? 0.95 : 1.0,
      }}
      transition={{
        scale: {
          duration: 0.2,
          ease: animationConfig.easings.smooth,
        },
      }}
    >
      {children}

      {/* Ripple effects */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{
                scale: 0,
                opacity: 1,
              }}
              animate={{
                scale: 4,
                opacity: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: rippleDuration,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: rippleColor,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.button>
  );
}

/**
 * Utility function to calculate ripple origin position
 * Exported for testing purposes
 */
export function calculateRippleOrigin(
  clickX: number,
  clickY: number,
  buttonLeft: number,
  buttonTop: number
): { x: number; y: number } {
  return {
    x: clickX - buttonLeft,
    y: clickY - buttonTop,
  };
}
