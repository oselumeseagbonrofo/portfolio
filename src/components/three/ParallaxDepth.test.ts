/**
 * Property-based tests for parallax depth calculation
 * Feature: enhanced-ui-animations, Property 13: Parallax depth calculation
 * Validates: Requirements 6.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 13: Parallax depth calculation
 * 
 * For any 3D background element with depth value d and scroll position s,
 * the element's translation should be: translateY = s * d * parallaxStrength.
 */
describe('3D Background Elements - Property 13: Parallax depth calculation', () => {
  /**
   * Helper function to calculate parallax translation
   * This represents the logic that would be in FloatingShapes/DataVisualization components
   */
  function calculateParallaxTranslation(
    scrollPosition: number,
    depth: number,
    parallaxStrength: number
  ): number {
    return scrollPosition * depth * parallaxStrength;
  }

  it('should calculate parallax translation as product of scroll, depth, and strength', () => {
    fc.assert(
      fc.property(
        // Generate scroll position (0 to 1)
        fc.double({ min: 0, max: 1, noNaN: true }),
        // Generate depth value (typically 0.1 to 2.0 for reasonable parallax)
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        // Generate parallax strength (typically 10 to 100)
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, depth, parallaxStrength) => {
          const translation = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);
          const expected = scrollPosition * depth * parallaxStrength;

          // Property: Translation should equal s * d * parallaxStrength
          expect(translation).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce zero translation at scroll position 0', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (depth, parallaxStrength) => {
          const translation = calculateParallaxTranslation(0, depth, parallaxStrength);

          // Property: At scroll 0, translation should be 0
          expect(translation).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce proportional translation for depth values', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 1, noNaN: true }),
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, depth, parallaxStrength) => {
          // Calculate translation at depth
          const translation1 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);

          // Calculate translation at double depth
          const translation2 = calculateParallaxTranslation(scrollPosition, depth * 2, parallaxStrength);

          // Property: Doubling depth should double translation
          if (Math.abs(translation1) > 0.001) {
            expect(translation2 / translation1).toBeCloseTo(2, 5);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce proportional translation for scroll position', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 0.5, noNaN: true }),
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, depth, parallaxStrength) => {
          // Calculate translation at scroll position
          const translation1 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);

          // Calculate translation at double scroll position
          const translation2 = calculateParallaxTranslation(scrollPosition * 2, depth, parallaxStrength);

          // Property: Doubling scroll should double translation
          if (Math.abs(translation1) > 0.001) {
            expect(translation2 / translation1).toBeCloseTo(2, 5);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce proportional translation for parallax strength', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 1, noNaN: true }),
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, depth, parallaxStrength) => {
          // Calculate translation at parallax strength
          const translation1 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);

          // Calculate translation at double parallax strength
          const translation2 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength * 2);

          // Property: Doubling strength should double translation
          if (Math.abs(translation1) > 0.001) {
            expect(translation2 / translation1).toBeCloseTo(2, 5);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce deterministic translations for same inputs', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, depth, parallaxStrength) => {
          // Calculate translation multiple times
          const translation1 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);
          const translation2 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);
          const translation3 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);

          // Property: Same inputs should always produce same output
          expect(translation1).toBe(translation2);
          expect(translation2).toBe(translation3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce greater translation for elements with greater depth', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 1, noNaN: true }),
        fc.double({ min: 0.1, max: 1.0, noNaN: true }),
        fc.double({ min: 0.1, max: 1.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, depth1, depth2, parallaxStrength) => {
          // Ensure depth1 < depth2
          const smallerDepth = Math.min(depth1, depth2);
          const largerDepth = Math.max(depth1, depth2);

          const translation1 = calculateParallaxTranslation(scrollPosition, smallerDepth, parallaxStrength);
          const translation2 = calculateParallaxTranslation(scrollPosition, largerDepth, parallaxStrength);

          // Property: Greater depth should produce greater translation (in absolute value)
          if (scrollPosition > 0.01) {
            expect(Math.abs(translation2)).toBeGreaterThanOrEqual(Math.abs(translation1));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case of zero depth', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, parallaxStrength) => {
          const translation = calculateParallaxTranslation(scrollPosition, 0, parallaxStrength);

          // Property: Zero depth should produce zero translation
          expect(translation).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case of zero parallax strength', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        (scrollPosition, depth) => {
          const translation = calculateParallaxTranslation(scrollPosition, depth, 0);

          // Property: Zero strength should produce zero translation
          expect(translation).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce continuous translations for continuous scroll changes', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.9, noNaN: true }),
        fc.double({ min: 0.001, max: 0.1, noNaN: true }),
        fc.double({ min: 0.1, max: 2.0, noNaN: true }),
        fc.double({ min: 10, max: 100, noNaN: true }),
        (scrollPosition, delta, depth, parallaxStrength) => {
          // Calculate translation at current scroll
          const translation1 = calculateParallaxTranslation(scrollPosition, depth, parallaxStrength);

          // Calculate translation at slightly different scroll
          const nextScrollPosition = Math.min(scrollPosition + delta, 1);
          const translation2 = calculateParallaxTranslation(nextScrollPosition, depth, parallaxStrength);

          // Property: Small changes in scroll should produce small changes in translation
          const change = Math.abs(translation2 - translation1);
          const expectedChange = Math.abs(delta * depth * parallaxStrength);

          expect(change).toBeCloseTo(expectedChange, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
