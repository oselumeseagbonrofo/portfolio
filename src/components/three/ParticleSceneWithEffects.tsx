/**
 * Example component demonstrating EnhancedParticles with SceneEffects
 * This shows how to integrate post-processing effects with the particle system
 * Requirements: 3.4, 8.2
 */

'use client';

import EnhancedParticles, { ParticleConfig } from './EnhancedParticles';
import SceneEffects from './SceneEffects';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export interface ParticleSceneWithEffectsProps {
  particleConfig?: Partial<ParticleConfig>;
  bloomIntensity?: number;
  chromaticAberrationStrength?: number;
}

/**
 * Combines EnhancedParticles with post-processing effects
 * Automatically disables effects on mobile devices for performance
 */
export default function ParticleSceneWithEffects({
  particleConfig,
  bloomIntensity = 0.8,
  chromaticAberrationStrength = 0.001,
}: ParticleSceneWithEffectsProps) {
  const capabilities = useDeviceCapabilities();

  // Build full particle config with defaults
  const fullConfig: ParticleConfig = {
    count: capabilities.maxParticles,
    radius: 10,
    mouseInfluence: 1.0,
    idleAnimation: true,
    performanceTier: capabilities.tier,
    ...particleConfig,
  };

  return (
    <>
      <EnhancedParticles config={fullConfig} />
      
      {/* Post-processing effects - disabled on mobile per requirement 8.2 */}
      <SceneEffects
        enabled={capabilities.enablePostProcessing}
        bloomIntensity={bloomIntensity}
        bloomLuminanceThreshold={0.9}
        bloomLuminanceSmoothing={0.025}
        chromaticAberrationOffset={[chromaticAberrationStrength, chromaticAberrationStrength]}
      />
    </>
  );
}
