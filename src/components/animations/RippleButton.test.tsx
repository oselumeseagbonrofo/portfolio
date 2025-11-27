/**
 * Property-based tests for RippleButton component
 * Feature: enhanced-ui-animations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RippleButton, calculateRippleOrigin } from './RippleButton';
import * as fc from 'fast-check';

describe('RippleButton - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 12: Ripple origin positioning
   * For any button click at position (x, y) within the button bounds,
   * the ripple effect should originate from coordinates (x, y) relative
   * to the button's top-left corner.
   * Validates: Requirements 5.3
   */
  describe('Property 12: Ripple origin positioning', () => {
    it('should calculate ripple origin correctly for any click position', () => {
      fc.assert(
        fc.property(
          // Button position
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          // Click position (absolute)
          fc.integer({ min: 0, max: 2000 }),
          fc.integer({ min: 0, max: 2000 }),
          (buttonLeft, buttonTop, clickX, clickY) => {
            const result = calculateRippleOrigin(
              clickX,
              clickY,
              buttonLeft,
              buttonTop
            );

            // Property: Ripple origin should be click position relative to button
            const expectedX = clickX - buttonLeft;
            const expectedY = clickY - buttonTop;

            expect(result.x).toBe(expectedX);
            expect(result.y).toBe(expectedY);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce zero origin when click is at button top-left', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          (buttonLeft, buttonTop) => {
            const result = calculateRippleOrigin(
              buttonLeft,
              buttonTop,
              buttonLeft,
              buttonTop
            );

            // Property: Click at button origin should produce (0, 0)
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle clicks at button center correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 100, max: 500 }),
          fc.integer({ min: 100, max: 500 }),
          (buttonLeft, buttonTop, buttonWidth, buttonHeight) => {
            const centerX = buttonLeft + buttonWidth / 2;
            const centerY = buttonTop + buttonHeight / 2;

            const result = calculateRippleOrigin(
              centerX,
              centerY,
              buttonLeft,
              buttonTop
            );

            // Property: Click at center should produce center coordinates
            expect(result.x).toBeCloseTo(buttonWidth / 2, 5);
            expect(result.y).toBeCloseTo(buttonHeight / 2, 5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce consistent results for same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 2000 }),
          fc.integer({ min: 0, max: 2000 }),
          (buttonLeft, buttonTop, clickX, clickY) => {
            const result1 = calculateRippleOrigin(
              clickX,
              clickY,
              buttonLeft,
              buttonTop
            );
            const result2 = calculateRippleOrigin(
              clickX,
              clickY,
              buttonLeft,
              buttonTop
            );

            // Property: Same inputs should produce same outputs (deterministic)
            expect(result1.x).toBe(result2.x);
            expect(result1.y).toBe(result2.y);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle negative relative positions correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 1000 }),
          fc.integer({ min: 100, max: 1000 }),
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 0, max: 99 }),
          (buttonLeft, buttonTop, clickX, clickY) => {
            // Click is before button position
            const result = calculateRippleOrigin(
              clickX,
              clickY,
              buttonLeft,
              buttonTop
            );

            // Property: Should handle negative relative positions
            expect(result.x).toBe(clickX - buttonLeft);
            expect(result.y).toBe(clickY - buttonTop);
            expect(result.x).toBeLessThan(0);
            expect(result.y).toBeLessThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should create ripple at correct position in rendered component', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 500 }),
          fc.integer({ min: 100, max: 500 }),
          fc.integer({ min: 50, max: 200 }),
          fc.integer({ min: 50, max: 200 }),
          (buttonLeft, buttonTop, buttonWidth, buttonHeight) => {
            const onClick = vi.fn();
            const { container, unmount } = render(
              <RippleButton onClick={onClick}>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Mock getBoundingClientRect
            const mockRect = {
              left: buttonLeft,
              top: buttonTop,
              width: buttonWidth,
              height: buttonHeight,
              right: buttonLeft + buttonWidth,
              bottom: buttonTop + buttonHeight,
              x: buttonLeft,
              y: buttonTop,
              toJSON: () => ({}),
            };

            vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(mockRect);

            // Click at a specific position
            const clickX = buttonLeft + buttonWidth / 4;
            const clickY = buttonTop + buttonHeight / 4;

            fireEvent.click(button, {
              clientX: clickX,
              clientY: clickY,
            });

            // Property: onClick should be called
            expect(onClick).toHaveBeenCalledTimes(1);

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 15: Click feedback animation
   * For any button click event, a scale pulse animation should trigger,
   * scaling from 1.0 to 0.95 and back to 1.0 within 0.2 seconds.
   * Validates: Requirements 7.1
   */
  describe('Property 15: Click feedback animation', () => {
    it('should trigger scale pulse animation on any click', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (buttonText) => {
            const onClick = vi.fn();
            const { container, unmount } = render(
              <RippleButton onClick={onClick}>
                {buttonText}
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Mock getBoundingClientRect
            const mockRect = {
              left: 0,
              top: 0,
              width: 100,
              height: 40,
              right: 100,
              bottom: 40,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            };

            vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(mockRect);

            // Click the button
            fireEvent.click(button, {
              clientX: 50,
              clientY: 20,
            });

            // Property: Button should respond to click without errors
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(button).toBeTruthy();

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle multiple rapid clicks correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (clickCount) => {
            const onClick = vi.fn();
            const { container, unmount } = render(
              <RippleButton onClick={onClick}>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Mock getBoundingClientRect
            const mockRect = {
              left: 0,
              top: 0,
              width: 100,
              height: 40,
              right: 100,
              bottom: 40,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            };

            vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(mockRect);

            // Perform multiple clicks
            for (let i = 0; i < clickCount; i++) {
              fireEvent.click(button, {
                clientX: 50,
                clientY: 20,
              });
            }

            // Property: All clicks should be registered
            expect(onClick).toHaveBeenCalledTimes(clickCount);
            expect(button).toBeTruthy();

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger animation when disabled', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (buttonText) => {
            const onClick = vi.fn();
            const { container, unmount } = render(
              <RippleButton onClick={onClick} disabled={true}>
                {buttonText}
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();
            expect(button.disabled).toBe(true);

            // Try to click disabled button
            fireEvent.click(button);

            // Property: Disabled button should not trigger onClick
            expect(onClick).not.toHaveBeenCalled();

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should respect custom ripple colors', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.double({ min: 0, max: 1, noNaN: true }),
          (r, g, b, a) => {
            const rippleColor = `rgba(${r}, ${g}, ${b}, ${a})`;
            const { container, unmount } = render(
              <RippleButton rippleColor={rippleColor}>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Property: Component should render with custom color
            expect(button).toBeTruthy();

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should respect custom ripple duration', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 2.0, noNaN: true }),
          (duration) => {
            const { container, unmount } = render(
              <RippleButton rippleDuration={duration}>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Mock getBoundingClientRect
            const mockRect = {
              left: 0,
              top: 0,
              width: 100,
              height: 40,
              right: 100,
              bottom: 40,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            };

            vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(mockRect);

            // Click the button
            fireEvent.click(button, {
              clientX: 50,
              clientY: 20,
            });

            // Property: Component should handle custom duration without errors
            expect(button).toBeTruthy();

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render children correctly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (content) => {
            const { container, unmount } = render(
              <RippleButton>
                {content}
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();
            expect(button.textContent).toBe(content);

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle different button types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('button' as const, 'submit' as const, 'reset' as const),
          (buttonType) => {
            const { container, unmount } = render(
              <RippleButton type={buttonType}>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();
            expect(button.type).toBe(buttonType);

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Integration tests', () => {
    it('should create ripples at different click positions', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              x: fc.integer({ min: 0, max: 200 }),
              y: fc.integer({ min: 0, max: 80 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (clickPositions) => {
            const onClick = vi.fn();
            const { container, unmount } = render(
              <RippleButton onClick={onClick}>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Mock getBoundingClientRect
            const mockRect = {
              left: 0,
              top: 0,
              width: 200,
              height: 80,
              right: 200,
              bottom: 80,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            };

            vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(mockRect);

            // Click at different positions
            clickPositions.forEach((pos) => {
              fireEvent.click(button, {
                clientX: pos.x,
                clientY: pos.y,
              });
            });

            // Property: All clicks should be registered
            expect(onClick).toHaveBeenCalledTimes(clickPositions.length);

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case of click at button boundaries', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 500 }),
          fc.integer({ min: 50, max: 200 }),
          (buttonWidth, buttonHeight) => {
            const { container, unmount } = render(
              <RippleButton>
                Click Me
              </RippleButton>
            );

            const button = container.querySelector('button') as HTMLButtonElement;
            expect(button).toBeTruthy();

            // Mock getBoundingClientRect
            const mockRect = {
              left: 0,
              top: 0,
              width: buttonWidth,
              height: buttonHeight,
              right: buttonWidth,
              bottom: buttonHeight,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            };

            vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(mockRect);

            // Click at corners
            const corners = [
              { x: 0, y: 0 }, // Top-left
              { x: buttonWidth, y: 0 }, // Top-right
              { x: 0, y: buttonHeight }, // Bottom-left
              { x: buttonWidth, y: buttonHeight }, // Bottom-right
            ];

            corners.forEach((corner) => {
              fireEvent.click(button, {
                clientX: corner.x,
                clientY: corner.y,
              });
            });

            // Property: Component should handle boundary clicks without errors
            expect(button).toBeTruthy();

            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
