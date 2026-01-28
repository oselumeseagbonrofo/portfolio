/**
 * Hook to detect device capabilities
 * Determines optimal settings for animations and 3D effects based on device type
 */

import { useState, useEffect } from 'react';

export type PerformanceTier = 'low' | 'medium' | 'high';

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
      // Enhanced mobile device detection
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

      // Base quality on device type since we removed the performance monitor
      const tier: PerformanceTier = isMobile ? 'medium' : 'high';
      const maxParticles = isMobile ? 500 : 2000;
      const enablePostProcessing = !isMobile && supportsWebGL2;

      setCapabilities({
        tier,
        isMobile,
        supportsWebGL2,
        maxParticles,
        enablePostProcessing,
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
}
