/**
 * Optimized Three.js provider with comprehensive performance monitoring,
 * error handling, and adaptive quality management
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceMonitor, AdaptiveQualitySettings } from '@/utils/performanceMonitor';
import { WebGLRecoveryManager } from '@/utils/webglRecovery';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import ThreeErrorBoundary from './ThreeErrorBoundary';
import WebGLFallback from './WebGLFallback';

interface OptimizedThreeContextValue {
  qualitySettings: AdaptiveQualitySettings;
  fps: number;
  isContextLost: boolean;
  forceQuality: (settings: Partial<AdaptiveQualitySettings>) => void;
  resetPerformance: () => void;
}

const OptimizedThreeContext = createContext<OptimizedThreeContextValue | null>(null);

export function useOptimizedThree() {
  const context = useContext(OptimizedThreeContext);
  if (!context) {
    throw new Error('useOptimizedThree must be used within OptimizedThreeProvider');
  }
  return context;
}

interface OptimizedThreeProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  onPerformanceChange?: (fps: number, quality: AdaptiveQualitySettings) => void;
  onContextLoss?: () => void;
  onContextRestore?: () => void;
  onError?: (error: Error) => void;
}

export default function OptimizedThreeProvider({
  children,
  fallback,
  onPerformanceChange,
  onContextLoss,
  onContextRestore,
  onError,
}: OptimizedThreeProviderProps) {
  const [qualitySettings, setQualitySettings] = useState<AdaptiveQualitySettings>({
    particleCount: 2000,
    enablePostProcessing: true,
    enable3DBackgrounds: true,
    enableComplexShaders: true,
    enableDynamicLighting: true,
  });
  const [fps, setFps] = useState(60);
  const [isContextLost, setIsContextLost] = useState(false);
  const [webglRecovery] = useState(() => new WebGLRecoveryManager({
    onContextLost: () => {
      setIsContextLost(true);
      onContextLoss?.();
    },
    onContextRestored: () => {
      setIsContextLost(false);
      onContextRestore?.();
    },
    onRecoveryFailed: (error) => {
      onError?.(error);
    },
  }));

  const { isMobile, supportsWebGL2 } = useDeviceCapabilities();

  useEffect(() => {
    const performanceMonitor = getPerformanceMonitor();

    // Subscribe to FPS updates
    const unsubscribeFPS = performanceMonitor.subscribe((newFps) => {
      setFps(newFps);
    });

    // Subscribe to quality changes
    const unsubscribeQuality = performanceMonitor.subscribeToQuality((newQuality) => {
      setQualitySettings(newQuality);
      onPerformanceChange?.(fps, newQuality);
    });

    return () => {
      unsubscribeFPS();
      unsubscribeQuality();
    };
  }, [fps, onPerformanceChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      webglRecovery.dispose();
    };
  }, [webglRecovery]);

  const contextValue: OptimizedThreeContextValue = {
    qualitySettings,
    fps,
    isContextLost,
    forceQuality: (settings) => {
      const performanceMonitor = getPerformanceMonitor();
      performanceMonitor.setQuality(settings);
    },
    resetPerformance: () => {
      const performanceMonitor = getPerformanceMonitor();
      performanceMonitor.reset();
    },
  };

  // Show fallback if WebGL is not supported
  if (!supportsWebGL2) {
    return (
      <WebGLFallback requireWebGL2={true} fallback={fallback}>
        {children}
      </WebGLFallback>
    );
  }

  // Show context lost message
  if (isContextLost) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-900 rounded-lg">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Restoring 3D Graphics...
          </h3>
          <p className="text-gray-300 text-sm">
            The graphics context was lost. Attempting recovery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <OptimizedThreeContext.Provider value={contextValue}>
      <ThreeErrorBoundary
        fallback={fallback}
        onError={(error, errorInfo) => {
          console.error('Three.js Error:', error, errorInfo);
          onError?.(error);
        }}
      >
        <Canvas
          gl={{
            antialias: !isMobile && qualitySettings.enablePostProcessing,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{
            position: [0, 0, 10],
            fov: 75,
          }}
          onCreated={({ gl }) => {
            // Initialize WebGL recovery for this renderer
            webglRecovery.initialize(gl);
            
            // Configure renderer for optimal performance
            gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
            gl.setClearColor('#000000', 0);
            
            // Enable optimizations
            gl.shadowMap.enabled = qualitySettings.enableDynamicLighting && !isMobile;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
          performance={{
            min: isMobile ? 0.2 : 0.5, // Lower minimum for mobile
            max: 1,
            debounce: 200,
          }}
        >
          {children}
        </Canvas>
      </ThreeErrorBoundary>
    </OptimizedThreeContext.Provider>
  );
}

/**
 * Hook to get current performance metrics
 */
export function useThreePerformance() {
  const { fps, qualitySettings } = useOptimizedThree();
  const performanceMonitor = getPerformanceMonitor();

  return {
    fps,
    qualitySettings,
    metrics: performanceMonitor.getMetrics(),
    memoryInfo: performanceMonitor.getMemoryInfo(),
    tier: performanceMonitor.getPerformanceTier(),
  };
}

/**
 * Hook to control quality settings
 */
export function useQualityControl() {
  const { qualitySettings, forceQuality, resetPerformance } = useOptimizedThree();

  const setParticleCount = (count: number) => {
    forceQuality({ particleCount: count });
  };

  const togglePostProcessing = () => {
    forceQuality({ enablePostProcessing: !qualitySettings.enablePostProcessing });
  };

  const toggle3DBackgrounds = () => {
    forceQuality({ enable3DBackgrounds: !qualitySettings.enable3DBackgrounds });
  };

  const setQualityPreset = (preset: 'low' | 'medium' | 'high') => {
    const presets = {
      low: {
        particleCount: 200,
        enablePostProcessing: false,
        enable3DBackgrounds: false,
        enableComplexShaders: false,
        enableDynamicLighting: false,
      },
      medium: {
        particleCount: 1000,
        enablePostProcessing: false,
        enable3DBackgrounds: true,
        enableComplexShaders: true,
        enableDynamicLighting: true,
      },
      high: {
        particleCount: 2000,
        enablePostProcessing: true,
        enable3DBackgrounds: true,
        enableComplexShaders: true,
        enableDynamicLighting: true,
      },
    };

    forceQuality(presets[preset]);
  };

  return {
    qualitySettings,
    setParticleCount,
    togglePostProcessing,
    toggle3DBackgrounds,
    setQualityPreset,
    resetPerformance,
  };
}