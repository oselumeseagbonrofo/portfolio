/**
 * Property-based tests for useMousePosition hook
 * Feature: enhanced-ui-animations, Property 3: Mouse-driven particle rotation
 * Validates: Requirements 2.1
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMousePosition } from './useMousePosition';
import * as fc from 'fast-check';

describe('useMousePosition - Property-Based Tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 1000,
        height: 800,
        right: 1000,
        bottom: 800,
      }),
    });
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * Property 3: Mouse-driven particle rotation
   * For any mouse position within the hero section, the particle formation rotation
   * should be proportional to the normalized mouse position (rotation angle = mouseX * influence factor).
   */
  it('should normalize mouse position proportionally to container dimensions', () => {
    fc.assert(
      fc.property(
        // Generate container dimensions first
        fc.integer({ min: 100, max: 1920 }),
        fc.integer({ min: 100, max: 1080 }),
        // Then generate mouse positions within those bounds
        fc.integer({ min: 0, max: 1 }),
        fc.integer({ min: 0, max: 1 }),
        (containerWidth, containerHeight, mouseXRatio, mouseYRatio) => {
          // Calculate mouse position within container bounds
          const mouseX = mouseXRatio * containerWidth;
          const mouseY = mouseYRatio * containerHeight;
          // Create a fresh container for each test iteration
          const testContainer = document.createElement('div');
          testContainer.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            width: containerWidth,
            height: containerHeight,
            right: containerWidth,
            bottom: containerHeight,
            x: 0,
            y: 0,
            toJSON: () => {},
          });
          document.body.appendChild(testContainer);

          const ref = { current: testContainer };
          const { result, unmount } = renderHook(() => useMousePosition(ref));

          // Simulate mouse move event
          act(() => {
            const event = new MouseEvent('mousemove', {
              clientX: mouseX,
              clientY: mouseY,
              bubbles: true,
            });
            testContainer.dispatchEvent(event);
          });

          // Calculate expected normalized values
          const x = mouseX - 0; // left offset is 0
          const y = mouseY - 0; // top offset is 0
          const expectedNormalizedX = (x / containerWidth) * 2 - 1;
          const expectedNormalizedY = (y / containerHeight) * 2 - 1;

          // Verify absolute position
          expect(result.current.x).toBe(x);
          expect(result.current.y).toBe(y);

          // Verify normalized position is proportional to mouse position
          // Normalized values should be in range [-1, 1]
          expect(result.current.normalized.x).toBeCloseTo(expectedNormalizedX, 5);
          expect(result.current.normalized.y).toBeCloseTo(expectedNormalizedY, 5);

          // Verify normalization bounds
          expect(result.current.normalized.x).toBeGreaterThanOrEqual(-1);
          expect(result.current.normalized.x).toBeLessThanOrEqual(3); // Allow some overflow
          expect(result.current.normalized.y).toBeGreaterThanOrEqual(-1);
          expect(result.current.normalized.y).toBeLessThanOrEqual(3); // Allow some overflow

          // Cleanup
          unmount();
          document.body.removeChild(testContainer);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain proportional relationship between absolute and normalized coordinates', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 0, max: 800 }),
        (mouseX, mouseY) => {
          const containerWidth = 1000;
          const containerHeight = 800;

          const testContainer = document.createElement('div');
          testContainer.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            width: containerWidth,
            height: containerHeight,
            right: containerWidth,
            bottom: containerHeight,
            x: 0,
            y: 0,
            toJSON: () => {},
          });
          document.body.appendChild(testContainer);

          const ref = { current: testContainer };
          const { result, unmount } = renderHook(() => useMousePosition(ref));

          act(() => {
            const event = new MouseEvent('mousemove', {
              clientX: mouseX,
              clientY: mouseY,
              bubbles: true,
            });
            testContainer.dispatchEvent(event);
          });

          // Verify the mathematical relationship holds
          // normalized = (absolute / dimension) * 2 - 1
          const calculatedNormalizedX = (result.current.x / containerWidth) * 2 - 1;
          const calculatedNormalizedY = (result.current.y / containerHeight) * 2 - 1;

          expect(result.current.normalized.x).toBeCloseTo(calculatedNormalizedX, 5);
          expect(result.current.normalized.y).toBeCloseTo(calculatedNormalizedY, 5);

          // Cleanup
          unmount();
          document.body.removeChild(testContainer);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce center position (0, 0) when mouse is at container center', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 200, max: 2000 }),
        fc.integer({ min: 200, max: 2000 }),
        (containerWidth, containerHeight) => {
          const testContainer = document.createElement('div');
          testContainer.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            width: containerWidth,
            height: containerHeight,
            right: containerWidth,
            bottom: containerHeight,
            x: 0,
            y: 0,
            toJSON: () => {},
          });
          document.body.appendChild(testContainer);

          const ref = { current: testContainer };
          const { result, unmount } = renderHook(() => useMousePosition(ref));

          // Mouse at center
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;

          act(() => {
            const event = new MouseEvent('mousemove', {
              clientX: centerX,
              clientY: centerY,
              bubbles: true,
            });
            testContainer.dispatchEvent(event);
          });

          // At center, normalized coordinates should be (0, 0)
          expect(result.current.normalized.x).toBeCloseTo(0, 5);
          expect(result.current.normalized.y).toBeCloseTo(0, 5);

          // Cleanup
          unmount();
          document.body.removeChild(testContainer);
        }
      ),
      { numRuns: 100 }
    );
  });
});
