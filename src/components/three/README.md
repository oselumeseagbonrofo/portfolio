# Three.js Components

This directory contains Three.js-based 3D components for the portfolio site.

## SceneEffects

Post-processing effects wrapper for Three.js scenes. Includes bloom and chromatic aberration effects.

### Usage

```tsx
import { Canvas } from '@react-three/fiber';
import SceneEffects from '@/components/three/SceneEffects';
import EnhancedParticles from '@/components/three/EnhancedParticles';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

function MyScene() {
  const capabilities = useDeviceCapabilities();
  
  return (
    <Canvas>
      <EnhancedParticles 
        config={{
          count: capabilities.maxParticles,
          radius: 10,
          mouseInfluence: 1.0,
          idleAnimation: true,
          performanceTier: capabilities.tier,
        }}
      />
      
      {/* Post-processing effects - automatically disabled on mobile */}
      <SceneEffects
        enabled={capabilities.enablePostProcessing}
        bloomIntensity={0.8}
        bloomLuminanceThreshold={0.9}
        bloomLuminanceSmoothing={0.025}
        chromaticAberrationOffset={[0.001, 0.001]}
      />
    </Canvas>
  );
}
```

### Props

- `enabled` (boolean, default: true): Enable/disable all effects
- `bloomIntensity` (number, default: 0.8): Intensity of the bloom effect
- `bloomLuminanceThreshold` (number, default: 0.9): Luminance threshold for bloom
- `bloomLuminanceSmoothing` (number, default: 0.025): Smoothing for bloom
- `chromaticAberrationOffset` ([number, number], default: [0.001, 0.001]): Chromatic aberration offset

### Device-Based Toggling

The component respects device capabilities. Use `useDeviceCapabilities` hook to automatically disable effects on mobile devices:

```tsx
const capabilities = useDeviceCapabilities();

<SceneEffects enabled={capabilities.enablePostProcessing} />
```

This ensures optimal performance on mobile devices by disabling post-processing effects (Requirement 8.2).

## ParticleSceneWithEffects

A convenience component that combines EnhancedParticles with SceneEffects and automatically handles device detection.

### Usage

```tsx
import { Canvas } from '@react-three/fiber';
import ParticleSceneWithEffects from '@/components/three/ParticleSceneWithEffects';

function MyScene() {
  return (
    <Canvas>
      <ParticleSceneWithEffects
        bloomIntensity={0.8}
        chromaticAberrationStrength={0.001}
      />
    </Canvas>
  );
}
```

This component automatically:
- Detects device capabilities
- Adjusts particle count based on device tier
- Disables post-processing on mobile devices
- Configures optimal settings for performance
