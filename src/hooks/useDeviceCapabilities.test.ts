/**
 * Property-based tests for useDeviceCapabilities hook
 * Feature: enhanced-ui-animations, Property 2: Frame rate maintenance during animations
 * Validates: Requirements 1.3, 1.5, 2.5, 6.5, 8.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeviceCapabilities } from './useDeviceCapabilities';
import { getPerformanceMonitor, PerformanceTier } from '@/utils/performanceMonitor';
import * as fc from 'fast-check';

describe('useDeviceCapabilities - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset performance monitor before each test
    const monitor = getPerformanceMonitor();
    monitor.reset();
  });

  /**
   * Property 2: Frame rate maintenance during animations
   * For any active animation sequence, the system should maintain frame rate above
   * 60 FPS on high-tier devices, 50 FPS on medium-tier devices, and 30 FPS on low-tier devices.
   */
  it('should assign appropriate particle counts based on performance tier and device type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<PerformanceTier>('high', 'medium', 'low'),
        fc.boolean(),
        fc.integer({ min: 320, max: 2560 }),
        (tier, isMobile, screenWidth) => {
          // Mock window.innerWidth
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: screenWidth,
          });

          // Mock user agent for mobile detection
          const originalUserAgent = navigator.userAgent;
          Object.defineProperty(navigator, 'userAgent', {
            writable: true,
            configurable: true,
            value: isMobile
              ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
              : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          });

          // Mock touch capabilities for enhanced mobile detection
          const originalOntouchstart = 'ontouchstart' in window;
          const originalMaxTouchPoints = navigator.maxTouchPoints;
          
          if (isMobile) {
            // @ts-ignore
            window.ontouchstart = () => {};
            Object.defineProperty(navigator, 'maxTouchPoints', {
              writable: true,
              configurable: true,
              value: 5,
            });
          } else {
            // @ts-ignore
            delete window.ontouchstart;
            Object.defineProperty(navigator, 'maxTouchPoints', {
              writable: true,
              configurable: true,
              value: 0,
            });
          }

          // Mock performance monitor to return specific tier
          const monitor = getPerformanceMonitor();
          vi.spyOn(monitor, 'getPerformanceTier').mockReturnValue(tier);

          const { result } = renderHook(() => useDeviceCapabilities());

          // Verify particle count is appropriate for tier and device
          const expectedMaxParticles = (() => {
            // Enhanced mobile detection logic matching implementation
            const actualIsMobile = isMobile || 
              screenWidth < 768 || 
              ('ontouchstart' in window) || 
              (navigator.maxTouchPoints > 0);
              
            if (actualIsMobile) {
              // Ensure mobile never exceeds 500 particles - Requirement 8.1
              return Math.min(
                tier === 'high' ? 500 : tier === 'medium' ? 300 : 200,
                500
              );
            } else {
              return tier === 'high' ? 2000 : tier === 'medium' ? 1000 : 500;
            }
          })();

          expect(result.current.maxParticles).toBe(expectedMaxParticles);

          // Verify tier is correctly detected
          expect(result.current.tier).toBe(tier);

          // Verify mobile detection with enhanced logic
          const actualIsMobile = isMobile || 
            screenWidth < 768 || 
            ('ontouchstart' in window) || 
            (navigator.maxTouchPoints > 0);
          expect(result.current.isMobile).toBe(actualIsMobile);

          // Verify post-processing is only enabled on high-tier desktop
          const expectedPostProcessing = !actualIsMobile && tier === 'high' && result.current.supportsWebGL2;
          expect(result.current.enablePostProcessing).toBe(expectedPostProcessing);

          // Restore all mocked properties
          Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true,
          });
          
          if (originalOntouchstart) {
            // @ts-ignore
            window.ontouchstart = originalOntouchstart;
          } else {
            // @ts-ignore
            delete window.ontouchstart;
          }
          
          Object.defineProperty(navigator, 'maxTouchPoints', {
            value: originalMaxTouchPoints,
            configurable: true,
          });
          
          vi.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reduce particle count on lower performance tiers to maintain frame rate', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (isMobile) => {
          // Mock mobile/desktop
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: isMobile ? 375 : 1920,
          });

          const originalUserAgent = navigator.userAgent;
          Object.defineProperty(navigator, 'userAgent', {
            writable: true,
            configurable: true,
            value: isMobile
              ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
              : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          });

          const monitor = getPerformanceMonitor();

          // Test high tier
          vi.spyOn(monitor, 'getPerformanceTier').mockReturnValue('high');
          const { result: highResult } = renderHook(() => useDeviceCapabilities());
          const highParticles = highResult.current.maxParticles;

          // Test medium tier
          vi.spyOn(monitor, 'getPerformanceTier').mockReturnValue('medium');
          const { result: mediumResult } = renderHook(() => useDeviceCapabilities());
          const mediumParticles = mediumResult.current.maxParticles;

          // Test low tier
          vi.spyOn(monitor, 'getPerformanceTier').mockReturnValue('low');
          const { result: lowResult } = renderHook(() => useDeviceCapabilities());
          const lowParticles = lowResult.current.maxParticles;

          // Property: Particle count should decrease as performance tier decreases
          expect(highParticles).toBeGreaterThan(mediumParticles);
          expect(mediumParticles).toBeGreaterThan(lowParticles);

          // Restore
          Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true,
          });
          vi.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should disable post-processing on mobile devices regardless of tier', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<PerformanceTier>('high', 'medium', 'low'),
        (tier) => {
          // Force mobile detection
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
          });

          const originalUserAgent = navigator.userAgent;
          Object.defineProperty(navigator, 'userAgent', {
            writable: true,
            configurable: true,
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          });

          const monitor = getPerformanceMonitor();
          vi.spyOn(monitor, 'getPerformanceTier').mockReturnValue(tier);

          const { result } = renderHook(() => useDeviceCapabilities());

          // Property: Post-processing should always be disabled on mobile
          expect(result.current.isMobile).toBe(true);
          expect(result.current.enablePostProcessing).toBe(false);

          // Restore
          Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true,
          });
          vi.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent particle count for same tier and device type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<PerformanceTier>('high', 'medium', 'low'),
        fc.boolean(),
        (tier, isMobile) => {
          // Mock device
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: isMobile ? 375 : 1920,
          });

          const originalUserAgent = navigator.userAgent;
          Object.defineProperty(navigator, 'userAgent', {
            writable: true,
            configurable: true,
            value: isMobile
              ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
              : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          });

          const monitor = getPerformanceMonitor();
          vi.spyOn(monitor, 'getPerformanceTier').mockReturnValue(tier);

          // Render hook multiple times
          const { result: result1 } = renderHook(() => useDeviceCapabilities());
          const { result: result2 } = renderHook(() => useDeviceCapabilities());

          // Property: Same inputs should produce same particle count
          expect(result1.current.maxParticles).toBe(result2.current.maxParticles);
          expect(result1.current.tier).toBe(result2.current.tier);
          expect(result1.current.enablePostProcessing).toBe(result2.current.enablePostProcessing);

          // Restore
          Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true,
          });
          vi.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });
});
