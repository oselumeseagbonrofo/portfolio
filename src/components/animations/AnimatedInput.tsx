'use client';

import { motion } from 'framer-motion';
import { useState, forwardRef } from 'react';
import { animationConfig } from '@/utils/animationConfig';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  focusColor?: string;
  glowIntensity?: number;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ 
    label, 
    error, 
    focusColor = '#3b82f6', 
    glowIntensity = 0.5, 
    className = '', 
    // Omit conflicting motion props that might be in props
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="relative">
        {label && (
          <motion.label
            className="block text-sm font-medium text-gray-700 mb-1"
            animate={{
              color: isFocused ? focusColor : '#374151',
            }}
            transition={{
              duration: animationConfig.durations.fast,
              ease: animationConfig.easings.smooth,
            }}
          >
            {label}
          </motion.label>
        )}
        
        <motion.div
          className="relative"
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{
            duration: animationConfig.durations.fast,
            ease: animationConfig.easings.smooth,
          }}
        >
          <motion.input
            ref={ref}
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full px-3 py-2 border rounded-md
              transition-colors duration-300
              focus:outline-none focus:ring-0
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${className}
            `}
            animate={{
              borderColor: isFocused 
                ? focusColor 
                : error 
                  ? '#ef4444' 
                  : '#d1d5db',
              boxShadow: isFocused 
                ? `0 0 0 3px ${focusColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}` 
                : '0 0 0 0px transparent',
            }}
            transition={{
              duration: animationConfig.durations.fast,
              ease: animationConfig.easings.smooth,
            }}
          />
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;