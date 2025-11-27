'use client';

import { motion } from 'framer-motion';
import { useState, useCallback, ReactNode, useRef, useEffect } from 'react';

interface TouchFeedbackProps {
  children: ReactNode;
  feedbackType?: 'scale' | 'ripple' | 'highlight';
  feedbackDuration?: number;
  className?: string;
  onTouch?: () => void;
}

export default function TouchFeedback({
  children,
  feedbackType = 'scale',
  feedbackDuration = 150, // 150ms for mobile touch feedback
  className = '',
  onTouch,
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const startTime = performance.now();
    
    // Immediate visual feedback - Requirement 8.4
    setIsPressed(true);
    
    // Calculate ripple position immediately for fastest response
    if (feedbackType === 'ripple' && e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      setRipplePosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }

    // Call user callback after visual feedback is set
    onTouch?.();

    // Ensure feedback is provided within 16ms (one frame at 60fps) - Requirement 8.4
    const elapsedTime = performance.now() - startTime;
    if (elapsedTime > 16) {
      console.warn(`Touch feedback took ${elapsedTime}ms, exceeding 16ms target`);
    }
  }, [feedbackType, onTouch]);

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsPressed(false), feedbackDuration);
  }, [feedbackDuration]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const startTime = performance.now();
    
    // Immediate visual feedback - Requirement 8.4
    setIsPressed(true);
    
    // Calculate ripple position immediately for fastest response
    if (feedbackType === 'ripple') {
      const rect = e.currentTarget.getBoundingClientRect();
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    // Call user callback after visual feedback is set
    onTouch?.();

    // Ensure feedback is provided within 16ms - Requirement 8.4
    const elapsedTime = performance.now() - startTime;
    if (elapsedTime > 16) {
      console.warn(`Touch feedback took ${elapsedTime}ms, exceeding 16ms target`);
    }
  }, [feedbackType, onTouch]);

  const handleMouseUp = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsPressed(false), feedbackDuration);
  }, [feedbackDuration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getFeedbackStyles = () => {
    switch (feedbackType) {
      case 'scale':
        return {
          scale: isPressed ? 0.95 : 1,
          transition: { duration: feedbackDuration / 1000 },
        };
      case 'highlight':
        return {
          backgroundColor: isPressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          transition: { duration: feedbackDuration / 1000 },
        };
      case 'ripple':
        return {
          position: 'relative' as const,
          overflow: 'hidden' as const,
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`touch-feedback ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      animate={getFeedbackStyles()}
      style={{ userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
      {feedbackType === 'ripple' && isPressed && (
        <motion.div
          className="absolute rounded-full bg-black bg-opacity-20 pointer-events-none"
          style={{
            left: ripplePosition.x - 20,
            top: ripplePosition.y - 20,
            width: 40,
            height: 40,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: feedbackDuration / 1000 }}
        />
      )}
    </motion.div>
  );
}