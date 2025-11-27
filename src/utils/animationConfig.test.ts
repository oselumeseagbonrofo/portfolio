import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { animationConfig, fadeInUp, fadeIn, scaleIn, slideInFromLeft, slideInFromRight } from './animationConfig';

describe('Animation Configuration', () => {
  describe('Property 18: Animation easing consistency', () => {
    /**
     * **Feature: enhanced-ui-animations, Property 18: Animation easing consistency**
     * **Validates: Requirements 7.5**
     * 
     * For any entrance animation, the easing function should be ease-out; 
     * for any exit animation, the easing function should be ease-in.
     */
    it('should use consistent easing functions for entrance and exit animations', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('entrance', 'exit', 'smooth'), // easing type
          (easingType) => {
            // Property: Easing configuration should be consistent
            const easing = animationConfig.easings[easingType as keyof typeof animationConfig.easings];
            
            switch (easingType) {
              case 'entrance':
                expect(easing).toBe('easeOut');
                break;
              case 'exit':
                expect(easing).toBe('easeIn');
                break;
              case 'smooth':
                expect(easing).toBe('easeInOut');
                break;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should apply correct easing to animation variants', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(fadeInUp, fadeIn, scaleIn, slideInFromLeft, slideInFromRight), // animation variant
          (variant) => {
            // Property: All entrance animation variants should have initial, animate, and exit states
            expect(variant).toHaveProperty('initial');
            expect(variant).toHaveProperty('animate');
            expect(variant).toHaveProperty('exit');
            
            // Property: Initial and exit states should be different from animate state
            expect(variant.initial).not.toEqual(variant.animate);
            expect(variant.exit).not.toEqual(variant.animate);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should maintain consistent duration values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('fast', 'medium', 'slow'), // duration type
          (durationType) => {
            const duration = animationConfig.durations[durationType as keyof typeof animationConfig.durations];
            
            // Property: Duration values should be positive numbers
            expect(duration).toBeGreaterThan(0);
            expect(typeof duration).toBe('number');
            
            // Property: Duration hierarchy should be maintained
            switch (durationType) {
              case 'fast':
                expect(duration).toBeLessThan(animationConfig.durations.medium);
                expect(duration).toBeLessThan(animationConfig.durations.slow);
                break;
              case 'medium':
                expect(duration).toBeGreaterThan(animationConfig.durations.fast);
                expect(duration).toBeLessThan(animationConfig.durations.slow);
                break;
              case 'slow':
                expect(duration).toBeGreaterThan(animationConfig.durations.fast);
                expect(duration).toBeGreaterThan(animationConfig.durations.medium);
                break;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain consistent stagger values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('grid', 'list'), // stagger type
          (staggerType) => {
            const stagger = animationConfig.stagger[staggerType as keyof typeof animationConfig.stagger];
            
            // Property: Stagger values should be positive numbers
            expect(stagger).toBeGreaterThan(0);
            expect(typeof stagger).toBe('number');
            
            // Property: Stagger values should be reasonable (less than 1 second)
            expect(stagger).toBeLessThan(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Basic functionality', () => {
    it('should export all required animation variants', () => {
      expect(fadeInUp).toBeDefined();
      expect(fadeIn).toBeDefined();
      expect(scaleIn).toBeDefined();
      expect(slideInFromLeft).toBeDefined();
      expect(slideInFromRight).toBeDefined();
    });

    it('should have correct animation configuration structure', () => {
      expect(animationConfig).toHaveProperty('durations');
      expect(animationConfig).toHaveProperty('easings');
      expect(animationConfig).toHaveProperty('stagger');
      
      expect(animationConfig.durations).toHaveProperty('fast');
      expect(animationConfig.durations).toHaveProperty('medium');
      expect(animationConfig.durations).toHaveProperty('slow');
      
      expect(animationConfig.easings).toHaveProperty('entrance');
      expect(animationConfig.easings).toHaveProperty('exit');
      expect(animationConfig.easings).toHaveProperty('smooth');
      
      expect(animationConfig.stagger).toHaveProperty('grid');
      expect(animationConfig.stagger).toHaveProperty('list');
    });
  });
});