/**
 * Post-processing effects wrapper for Three.js scenes
 * Requirements: 3.4, 8.2
 */

'use client';

import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export interface SceneEffectsProps {
  enabled?: boolean;
  bloomIntensity?: number;
  bloomLuminanceThreshold?: number;
  bloomLuminanceSmoothing?: number;
  chromaticAberrationOffset?: [number, number];
}

/**
 * SceneEffects component wraps post-processing effects
 * Includes bloom and chromatic aberration effects
 * Can be toggled based on device capabilities
 */
export default function SceneEffects({
  enabled = true,
  bloomIntensity = 0.8,
  bloomLuminanceThreshold = 0.9,
  bloomLuminanceSmoothing = 0.025,
  chromaticAberrationOffset = [0.001, 0.001],
}: SceneEffectsProps) {
  // Don't render effects if disabled (for mobile devices)
  if (!enabled) {
    return null;
  }

  return (
    <EffectComposer>
      {/* Bloom effect for glowing particles and lights */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomLuminanceThreshold}
        luminanceSmoothing={bloomLuminanceSmoothing}
        mipmapBlur
      />
      
      {/* Subtle chromatic aberration for visual interest */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(...chromaticAberrationOffset)}
      />
    </EffectComposer>
  );
}
