/**
 * Enhanced LazyScene component for lazy loading 3D scenes
 * Loads Three.js scenes only when they are near the viewport
 * Includes performance monitoring and adaptive loading
 * Requirements: 6.4
 */

'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { getPerformanceMonitor } from '@/utils/performanceMonitor';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export interface LazySceneProps {
  children: ReactNode;
  threshold?: number; // How close to viewport before loading (0 to 1)
  rootMargin?: string; // Margin around viewport for early loading
  fallback?: ReactNode; // Loading placeholder
  priority?: 'low' | 'medium' | 'high'; // Loading priority
  onLoad?: () => void; // Callback when scene loads
  onError?: (error: Error) => void; // Callback when loading fails
}

/**
 * Enhanced LazyScene component with performance-aware loading
 */
export default function LazyScene({
  children,
  threshold = 0.1,
  rootMargin = '200px',
  fallback,
  priority = 'medium',
  onLoad,
  onError,
}: LazySceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { tier, isMobile } = useDeviceCapabilities();

  // Adjust loading behavior based on device capabilities
  const shouldDelayLoading = tier === 'low' || isMobile;
  const loadDelay = priority === 'low' ? 1000 : priority === 'medium' ? 500 : 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Adjust threshold based on performance tier
    const adjustedThreshold = shouldDelayLoading ? Math.max(threshold, 0.3) : threshold;
    const adjustedRootMargin = shouldDelayLoading ? '50px' : rootMargin;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay for low-performance devices
            const delay = shouldDelayLoading ? loadDelay + 200 : loadDelay;
            
            loadTimeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }, delay);
          }
        });
      },
      {
        threshold: adjustedThreshold,
        rootMargin: adjustedRootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [threshold, rootMargin, shouldDelayLoading, loadDelay]);

  // Handle scene loading
  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const loadScene = async () => {
      try {
        // Monitor performance during loading
        const performanceMonitor = getPerformanceMonitor();
        const initialFPS = performanceMonitor.getFPS();

        // Simulate async loading (in real scenario, this would be the actual 3D scene initialization)
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if performance degraded during loading
        const finalFPS = performanceMonitor.getFPS();
        if (finalFPS < initialFPS * 0.8) {
          console.warn('Performance degraded during scene loading');
        }

        setIsLoaded(true);
        onLoad?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Scene loading failed');
        setLoadError(err);
        onError?.(err);
      }
    };

    loadScene();
  }, [isVisible, isLoaded, onLoad, onError]);

  // Render loading state
  if (!isVisible) {
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {fallback || <div className="animate-pulse bg-gray-800/20 rounded-lg h-full" />}
      </div>
    );
  }

  // Render error state
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <div>
          <p className="text-red-400 mb-2">Failed to load 3D scene</p>
          <button
            onClick={() => {
              setLoadError(null);
              setIsLoaded(false);
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render loading state while scene initializes
  if (!isLoaded) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {fallback || (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}
      </div>
    );
  }

  // Render the actual scene
  return <>{children}</>;
}

/**
 * Performance-aware lazy loading hook
 */
export function useLazyScenePerformance() {
  const [loadingScenes, setLoadingScenes] = useState(0);
  const performanceMonitor = getPerformanceMonitor();

  const registerSceneLoad = () => {
    setLoadingScenes(prev => prev + 1);
  };

  const unregisterSceneLoad = () => {
    setLoadingScenes(prev => Math.max(0, prev - 1));
  };

  const shouldDelayNextScene = () => {
    const fps = performanceMonitor.getFPS();
    return fps < 40 || loadingScenes > 2;
  };

  return {
    loadingScenes,
    registerSceneLoad,
    unregisterSceneLoad,
    shouldDelayNextScene,
  };
}
