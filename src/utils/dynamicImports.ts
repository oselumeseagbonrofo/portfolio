/**
 * Dynamic import utilities for code splitting and lazy loading
 * Optimizes bundle size by loading components only when needed
 */

import React, { lazy, ComponentType } from 'react';

/**
 * Create a lazy-loaded component with error handling
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Failed to load component:', error);
      
      // Return fallback component if available
      if (fallback) {
        return { default: fallback };
      }
      
      // Return minimal error component
      return {
        default: (() => 
          React.createElement('div', 
            { className: 'p-4 text-center text-gray-500' }, 
            'Failed to load component'
          )
        ) as T,
      };
    }
  });

  LazyComponent.displayName = 'LazyComponent';
  return LazyComponent;
}

/**
 * Preload a component for better performance
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  // Start loading the component but don't wait for it
  importFn().catch((error) => {
    console.warn('Failed to preload component:', error);
  });
}

/**
 * Create a lazy component that only loads when intersecting with viewport
 */
export function createIntersectionLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    threshold?: number;
    rootMargin?: string;
    fallback?: ComponentType;
  } = {}
): ComponentType<React.ComponentProps<T> & { className?: string }> {
  const { threshold = 0.1, rootMargin = '100px', fallback } = options;
  
  return function IntersectionLazyComponent(props) {
    const [shouldLoad, setShouldLoad] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold, rootMargin }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, []);

    if (!shouldLoad) {
      return React.createElement('div', 
        { ref, className: props.className },
        fallback ? React.createElement(fallback) : 
          React.createElement('div', 
            { className: 'animate-pulse bg-gray-800 rounded-lg h-64' }
          )
      );
    }

    const LazyComponent = createLazyComponent(importFn, fallback);
    return React.createElement(LazyComponent, props);
  };
}

// Lazy-loaded Three.js components
export const LazyEnhancedParticles = createLazyComponent(
  () => import('@/components/three/EnhancedParticles'),
  () => React.createElement('div', 
    { className: 'animate-pulse bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg h-64' }
  )
);

export const LazyFloatingShapes = createIntersectionLazyComponent(
  () => import('@/components/three/FloatingShapes'),
  {
    threshold: 0.1,
    rootMargin: '200px',
    fallback: () => React.createElement('div', 
      { className: 'animate-pulse bg-gray-800/20 rounded-lg h-32' }
    ),
  }
);

export const LazyDataVisualization = createIntersectionLazyComponent(
  () => import('@/components/three/DataVisualization'),
  {
    threshold: 0.1,
    rootMargin: '200px',
    fallback: () => React.createElement('div', 
      { className: 'animate-pulse bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg h-48' }
    ),
  }
);

export const LazySceneEffects = createLazyComponent(
  () => import('@/components/three/SceneEffects'),
  () => null // No fallback needed for effects
);

// Preload critical components
export function preloadCriticalComponents(): void {
  // Preload particle system as it's used in hero section
  preloadComponent(() => import('@/components/three/EnhancedParticles'));
  
  // Preload scene effects for better UX
  preloadComponent(() => import('@/components/three/SceneEffects'));
}

// Preload components based on user interaction
export function preloadOnInteraction(): void {
  const preloadOnScroll = () => {
    preloadComponent(() => import('@/components/three/FloatingShapes'));
    preloadComponent(() => import('@/components/three/DataVisualization'));
    
    // Remove listener after first scroll
    window.removeEventListener('scroll', preloadOnScroll);
  };

  const preloadOnMouseMove = () => {
    preloadComponent(() => import('@/components/three/FloatingShapes'));
    
    // Remove listener after first mouse move
    window.removeEventListener('mousemove', preloadOnMouseMove);
  };

  // Preload on first user interaction
  window.addEventListener('scroll', preloadOnScroll, { passive: true });
  window.addEventListener('mousemove', preloadOnMouseMove, { passive: true });
}