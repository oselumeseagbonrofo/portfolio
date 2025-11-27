/**
 * Hook to detect device capabilities and performance tier
 * Determines optimal settings for animations and 3D effects
 */

import { useState, useEffect } from 'react';
import { getPerformanceMonitor, PerformanceTier } from '@/utils/performanceMonitor';

export interface DeviceCapabilities {
  tier: PerformanceTier;
  isMobile: boolean;
  supportsWebGL2: boolean;
  maxParticles: number;
  enablePostProcessing: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    tier: 'high',
    isMobile: false,
    supportsWebGL2: true,
    maxParticles: 2000,
    enablePostProcessing: true,
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Enhanced mobile device detection - Requirement 8.1
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || 
        window.innerWidth < 768 ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);

      // Check WebGL2 support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      const supportsWebGL2 = !!gl;

      // Get initial performance tier
      const performanceMonitor = getPerformanceMonitor();
      const tier = performanceMonitor.getPerformanceTier();

      // Mobile-optimized particle count - Requirement 8.1
      // Reduce particle count to 500 or fewer for mobile devices
      let maxParticles = 2000;
      if (isMobile) {
        maxParticles = Math.min(
          tier === 'high' ? 500 : tier === 'medium' ? 300 : 200,
          500 // Ensure never exceeds 500 on mobile
        );
      } else {
        maxParticles = tier === 'high' ? 2000 : tier === 'medium' ? 1000 : 500;
      }

      // Disable post-processing on mobile - Requirement 8.2
      const enablePostProcessing = !isMobile && tier === 'high' && supportsWebGL2;

      setCapabilities({
        tier,
        isMobile,
        supportsWebGL2,
        maxParticles,
        enablePostProcessing,
      });
    };

    detectCapabilities();

    // Subscribe to performance changes with mobile-specific thresholds
    const performanceMonitor = getPerformanceMonitor();
    const unsubscribe = performanceMonitor.subscribe((fps) => {
      // Use mobile-specific performance thresholds - Requirement 8.5
      const mobileThresholds = isMobile ? {
        targetFPS: 30, // 30 FPS minimum for mobile
        minFPS: 20,
        degradeThreshold: 25
      } : undefined;
      
      const newTier = performanceMonitor.getPerformanceTier(mobileThresholds);
      
      setCapabilities((prev) => {
        if (prev.tier !== newTier) {
          const isMobile = prev.isMobile;
          let maxParticles = 2000;
          if (isMobile) {
            // Ensure mobile particle count never exceeds 500 - Requirement 8.1
            maxParticles = Math.min(
              newTier === 'high' ? 500 : newTier === 'medium' ? 300 : 200,
              500
            );
          } else {
            maxParticles = newTier === 'high' ? 2000 : newTier === 'medium' ? 1000 : 500;
          }

          return {
            ...prev,
            tier: newTier,
            maxParticles,
            enablePostProcessing: !isMobile && newTier === 'high' && prev.supportsWebGL2,
          };
        }
        return prev;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return capabilities;
}
