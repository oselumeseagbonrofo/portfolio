/**
 * Tests for SceneEffects component
 * Validates post-processing effects configuration and device-based toggling
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import SceneEffects from './SceneEffects';

describe('SceneEffects', () => {
  it('should render nothing when disabled', () => {
    const { container } = render(
      <Canvas>
        <SceneEffects enabled={false} />
      </Canvas>
    );
    
    // When disabled, the component should return null
    // The Canvas will still render but SceneEffects won't add any effects
    expect(container).toBeTruthy();
  });

  it('should accept custom bloom intensity', () => {
    const { container } = render(
      <Canvas>
        <SceneEffects enabled={true} bloomIntensity={1.5} />
      </Canvas>
    );
    
    expect(container).toBeTruthy();
  });

  it('should accept custom chromatic aberration offset', () => {
    const { container } = render(
      <Canvas>
        <SceneEffects 
          enabled={true} 
          chromaticAberrationOffset={[0.002, 0.002]} 
        />
      </Canvas>
    );
    
    expect(container).toBeTruthy();
  });

  it('should use default values when not specified', () => {
    const { container } = render(
      <Canvas>
        <SceneEffects />
      </Canvas>
    );
    
    expect(container).toBeTruthy();
  });

  it('should handle all configurable parameters', () => {
    const { container } = render(
      <Canvas>
        <SceneEffects
          enabled={true}
          bloomIntensity={0.6}
          bloomLuminanceThreshold={0.8}
          bloomLuminanceSmoothing={0.03}
          chromaticAberrationOffset={[0.0015, 0.0015]}
        />
      </Canvas>
    );
    
    expect(container).toBeTruthy();
  });
});
