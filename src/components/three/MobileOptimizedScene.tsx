/**
 * Mobile-optimized 3D scene wrapper
 * Conditionally renders 3D elements based on device capabilities
 * Requirements: 8.1, 8.2, 8.3
 */

'use client';

import { ReactNode } from 'react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export interface MobileOptimizedSceneProps {
  children: ReactNode;
  fallback?: ReactNode;
  forceHide?: boolean; // Force hide on mobile regardless of capabilities
  simplifiedVersion?: ReactNode; // Simplified version for mobile
}

/**
 * MobileOptimizedScene conditionally renders 3D content based on device capabilities
 * - Hides 3D backgrounds on mobile devices - Requirement 8.3
 * - Provides fallback or simplified versions for mobile
 * - Respects performance tier for rendering decisions
 */
export default function MobileOptimizedScene({
  children,
  fallback = null,
  forceHide = false,
  simplifiedVersion = null,
}: MobileOptimizedSceneProps) {
  const { isMobile, tier } = useDeviceCapabilities();

  // Force hide if specified or if mobile device - Requirement 8.3
  if (forceHide || isMobile) {
    // Return simplified version if available, otherwise fallback
    return <>{simplifiedVersion || fallback}</>;
  }

  // On desktop, render based on performance tier
  if (tier === 'low') {
    return <>{simplifiedVersion || fallback}</>;
  }

  // Render full 3D scene for capable devices
  return <>{children}</>;
}

/**
 * Hook to determine if 3D content should be rendered
 */
export function useShould3DRender(): {
  shouldRender: boolean;
  shouldSimplify: boolean;
  isMobile: boolean;
  tier: 'high' | 'medium' | 'low';
} {
  const { isMobile, tier } = useDeviceCapabilities();

  return {
    shouldRender: !isMobile && tier !== 'low',
    shouldSimplify: tier === 'medium' || isMobile,
    isMobile,
    tier,
  };
}