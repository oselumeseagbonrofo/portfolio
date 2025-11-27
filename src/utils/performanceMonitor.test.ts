/**
 * Tests for performance monitoring and adaptive quality system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getPerformanceMonitor, getRecommendedParticleCount, shouldEnablePostProcessing } from './performanceMonitor';

// Mock performance.now
const mockPerformanceNow = vi.fn();
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow,
  },
  writable: true,
});

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn();
Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true,
});

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  writable: true,
});

// Mock window
Object.defineProperty(global, 'window', {
  value: {
    innerWidth: 1920,
    innerHeight: 1080,
  },
  writable: true,
});

describe('Performance Monitor', () => {
  let performanceMonitor: ReturnType<typeof getPerformanceMonitor>;
  let time = 0;

  beforeEach(() => {
    time = 0;
    mockPerformanceNow.mockImplementation(() => {
      time += 16.67; // Simulate 60 FPS
      return time;
    });
    
    mockRequestAnimationFrame.mockImplementation((callback) => {
      setTimeout(callback, 16.67);
      return 1;
    });

    performanceMonitor = getPerformanceMonitor();
    performanceMonitor.reset();
  });

  afterEach(() => {
    performanceMonitor.stop();
    vi.clearAllMocks();
  });

  describe('FPS Monitoring', () => {
    it('should calculate FPS correctly', () => {
      // Initial FPS should be around 60
      expect(performanceMonitor.getFPS()).toBeGreaterThan(50);
    });

    it('should detect performance degradation', () => {
      // Simulate poor performance
      mockPerformanceNow.mockImplementation(() => {
        time += 50; // Simulate 20 FPS
        return time;
      });

      // Wait for performance to be measured
      setTimeout(() => {
        expect(performanceMonitor.isPerformanceDegraded(30)).toBe(true);
      }, 200);
    });
  });

  describe('Adaptive Quality', () => {
    it('should provide default quality settings', () => {
      const quality = performanceMonitor.getCurrentQuality();
      expect(quality).toHaveProperty('particleCount');
      expect(quality).toHaveProperty('enablePostProcessing');
      expect(quality).toHaveProperty('enable3DBackgrounds');
    });

    it('should allow manual quality override', () => {
      const newSettings = { particleCount: 1000 };
      performanceMonitor.setQuality(newSettings);
      
      const quality = performanceMonitor.getCurrentQuality();
      expect(quality.particleCount).toBe(1000);
    });
  });

  describe('Mobile Optimization', () => {
    beforeEach(() => {
      // Mock mobile user agent
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        },
        writable: true,
      });

      // Mock mobile viewport
      Object.defineProperty(global, 'window', {
        value: {
          innerWidth: 375,
          innerHeight: 667,
        },
        writable: true,
      });
    });

    it('should limit particle count on mobile devices', () => {
      const particleCount = getRecommendedParticleCount('high', true);
      expect(particleCount).toBeLessThanOrEqual(500); // Requirement 8.1
    });

    it('should disable post-processing on mobile devices', () => {
      const enablePostProcessing = shouldEnablePostProcessing('high', true);
      expect(enablePostProcessing).toBe(false); // Requirement 8.2
    });
  });

  describe('Performance Tiers', () => {
    it('should classify performance tiers correctly', () => {
      // High performance (60+ FPS)
      mockPerformanceNow.mockImplementation(() => {
        time += 16; // ~62 FPS
        return time;
      });
      
      setTimeout(() => {
        expect(performanceMonitor.getPerformanceTier()).toBe('high');
      }, 200);
    });

    it('should handle low performance scenarios', () => {
      // Low performance (< 30 FPS)
      mockPerformanceNow.mockImplementation(() => {
        time += 40; // 25 FPS
        return time;
      });
      
      setTimeout(() => {
        expect(performanceMonitor.getPerformanceTier()).toBe('low');
      }, 200);
    });
  });

  describe('Memory Monitoring', () => {
    it('should return null when memory API is not available', () => {
      const memoryInfo = performanceMonitor.getMemoryInfo();
      expect(memoryInfo).toBeNull();
    });

    it('should return memory info when available', () => {
      // Mock memory API
      Object.defineProperty(global, 'performance', {
        value: {
          ...global.performance,
          memory: {
            usedJSHeapSize: 50 * 1024 * 1024, // 50MB
            totalJSHeapSize: 100 * 1024 * 1024, // 100MB
          },
        },
        writable: true,
      });

      const memoryInfo = performanceMonitor.getMemoryInfo();
      expect(memoryInfo).toEqual({
        used: 50,
        total: 100,
      });
    });
  });
});