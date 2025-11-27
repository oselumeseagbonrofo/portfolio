/**
 * Enhanced particle system with advanced interactions and effects
 * Requirements: 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5
 */

'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './ParticleShader';
import { getPerformanceMonitor } from '@/utils/performanceMonitor';
import { useOptimizedThree } from './OptimizedThreeProvider';

export interface ParticleConfig {
  count: number;
  radius: number;
  mouseInfluence: number;
  idleAnimation: boolean;
  performanceTier: 'high' | 'medium' | 'low';
}

export interface ParticleSystemProps {
  config: ParticleConfig;
  onPerformanceChange?: (fps: number) => void;
  lightIntensity?: number;
  lightColor?: string;
}

// Helper function to get particle formation center (exported for testing)
export function calculateParticleCenter(positions: Float32Array, count: number): THREE.Vector3 {
  let centerX = 0, centerY = 0, centerZ = 0;
  
  for (let i = 0; i < count; i++) {
    centerX += positions[i * 3];
    centerY += positions[i * 3 + 1];
    centerZ += positions[i * 3 + 2];
  }
  
  return new THREE.Vector3(
    centerX / count,
    centerY / count,
    centerZ / count
  );
}

export default function EnhancedParticles({ 
  config, 
  onPerformanceChange,
  lightIntensity = 1.5,
  lightColor = '#3b82f6'
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const mouseVelocityRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const lastMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const idleTimeRef = useRef<number>(0);
  const [particleCount, setParticleCount] = useState(config.count);
  
  // Use optimized Three.js context for adaptive quality
  const { qualitySettings } = useOptimizedThree();
  
  // Lighting refs for dynamic lighting system
  const pointLight1Ref = useRef<THREE.PointLight>(null);
  const pointLight2Ref = useRef<THREE.PointLight>(null);
  const targetLightIntensity = useRef<number>(lightIntensity);
  const targetLightColor = useRef<THREE.Color>(new THREE.Color(lightColor));
  const currentLightIntensity = useRef<number>(0);
  const currentLightColor = useRef<THREE.Color>(new THREE.Color(lightColor));
  
  // Linear transition state for precise timing (Requirement 3.5)
  const lightTransitionStart = useRef<{ intensity: number; color: THREE.Color } | null>(null);
  const lightTransitionTime = useRef<number>(0);
  const LIGHT_TRANSITION_DURATION = 0.5; // 0.5 seconds as per requirement

  const { mouse } = useThree();

  // Update target light properties when props change
  useEffect(() => {
    // Start a new transition when targets change
    if (targetLightIntensity.current !== lightIntensity || 
        !targetLightColor.current.equals(new THREE.Color(lightColor))) {
      lightTransitionStart.current = {
        intensity: currentLightIntensity.current,
        color: currentLightColor.current.clone()
      };
      lightTransitionTime.current = 0;
    }
    targetLightIntensity.current = lightIntensity;
    targetLightColor.current = new THREE.Color(lightColor);
  }, [lightIntensity, lightColor]);

  // Generate particle positions and attributes
  const { positions, targetPositions, indices } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const indices = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Target position (sphere formation)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = config.radius + Math.random() * 2;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      targetPositions[i * 3] = x;
      targetPositions[i * 3 + 1] = y;
      targetPositions[i * 3 + 2] = z;

      // Initial scattered position
      const scatterRadius = 50;
      positions[i * 3] = (Math.random() - 0.5) * scatterRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * scatterRadius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * scatterRadius;

      indices[i] = i;
    }

    return { positions, targetPositions, indices };
  }, [particleCount, config.radius]);

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: config.mouseInfluence },
        uIdleAnimation: { value: 0 },
        uColorStart: { value: new THREE.Color('#3b82f6') },
        uColorEnd: { value: new THREE.Color('#8b5cf6') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [config.mouseInfluence]);

  // Sync particle count with adaptive quality settings
  useEffect(() => {
    setParticleCount(qualitySettings.particleCount);
  }, [qualitySettings.particleCount]);

  // Monitor performance and report changes
  useEffect(() => {
    const performanceMonitor = getPerformanceMonitor();
    
    const unsubscribe = performanceMonitor.subscribe((fps) => {
      if (onPerformanceChange) {
        onPerformanceChange(fps);
      }
    });

    return () => unsubscribe();
  }, [onPerformanceChange]);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    const deltaTime = state.clock.getDelta();
    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;

    // Calculate mouse velocity for momentum trailing
    const currentMouse = new THREE.Vector2(mouse.x, mouse.y);
    mouseVelocityRef.current.subVectors(currentMouse, lastMouseRef.current);
    lastMouseRef.current.copy(currentMouse);

    // Track idle time (when mouse is stationary)
    const velocity = mouseVelocityRef.current.length();
    if (velocity < 0.001) {
      idleTimeRef.current += deltaTime;
    } else {
      idleTimeRef.current = 0;
    }

    // Enable idle animation after 2 seconds of no movement
    const idleAnimationStrength = idleTimeRef.current > 2 ? 1 : 0;

    // Convergence animation (0 to 1 over 3 seconds)
    const convergenceDuration = 3.0;
    let convergence = Math.min(time / convergenceDuration, 1);
    // Apply smoothstep for easing
    convergence = convergence * convergence * (3 - 2 * convergence);

    // Calculate particle formation center for lighting
    let centerX = 0, centerY = 0, centerZ = 0;

    // Update particle positions with convergence
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Interpolate from scattered to target position
      const scatteredX = positions[i3];
      const scatteredY = positions[i3 + 1];
      const scatteredZ = positions[i3 + 2];
      
      const targetX = targetPositions[i3];
      const targetY = targetPositions[i3 + 1];
      const targetZ = targetPositions[i3 + 2];

      // Apply momentum trailing for fast movements
      const momentumFactor = Math.min(velocity * 10, 1);
      const trailingDelay = momentumFactor * 0.1 * (1 - convergence);
      const effectiveConvergence = Math.max(0, convergence - trailingDelay);

      const finalX = THREE.MathUtils.lerp(scatteredX, targetX, effectiveConvergence);
      const finalY = THREE.MathUtils.lerp(scatteredY, targetY, effectiveConvergence);
      const finalZ = THREE.MathUtils.lerp(scatteredZ, targetZ, effectiveConvergence);

      positionAttribute.setXYZ(i, finalX, finalY, finalZ);

      // Accumulate for center calculation
      centerX += finalX;
      centerY += finalY;
      centerZ += finalZ;
    }

    positionAttribute.needsUpdate = true;

    // Calculate average center position
    centerX /= particleCount;
    centerY /= particleCount;
    centerZ /= particleCount;

    // Apply mouse-based rotation to entire formation
    const rotationInfluence = 0.3;
    pointsRef.current.rotation.y = mouse.x * rotationInfluence * convergence;
    pointsRef.current.rotation.x = -mouse.y * rotationInfluence * convergence;

    // Transform center by rotation to get world space position
    const centerVector = new THREE.Vector3(centerX, centerY, centerZ);
    centerVector.applyEuler(pointsRef.current.rotation);

    // Update dynamic lighting - Requirements 3.3, 3.5
    // Linear transition for light intensity and color (0.5 second transition)
    if (lightTransitionStart.current) {
      lightTransitionTime.current += deltaTime;
      const t = Math.min(lightTransitionTime.current / LIGHT_TRANSITION_DURATION, 1);
      
      // Linear interpolation for precise timing
      currentLightIntensity.current = THREE.MathUtils.lerp(
        lightTransitionStart.current.intensity,
        targetLightIntensity.current,
        t
      );
      
      currentLightColor.current.copy(lightTransitionStart.current.color);
      currentLightColor.current.lerp(targetLightColor.current, t);
      
      // Clear transition state when complete
      if (t >= 1) {
        lightTransitionStart.current = null;
      }
    } else {
      // No transition in progress, use target values
      currentLightIntensity.current = targetLightIntensity.current;
      currentLightColor.current.copy(targetLightColor.current);
    }

    // Position lights to follow particle formation center with fixed offset
    if (pointLight1Ref.current) {
      pointLight1Ref.current.position.set(
        centerVector.x + 5,
        centerVector.y + 5,
        centerVector.z + 10
      );
      pointLight1Ref.current.intensity = currentLightIntensity.current;
      pointLight1Ref.current.color.copy(currentLightColor.current);
    }

    if (pointLight2Ref.current) {
      pointLight2Ref.current.position.set(
        centerVector.x - 5,
        centerVector.y - 5,
        centerVector.z + 10
      );
      pointLight2Ref.current.intensity = currentLightIntensity.current * 0.7;
      pointLight2Ref.current.color.copy(currentLightColor.current);
    }

    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.set(mouse.x * 10, mouse.y * 10);
    materialRef.current.uniforms.uIdleAnimation.value = idleAnimationStrength;
    
    // Smooth mouse position for shader
    mouseRef.current.lerp(new THREE.Vector2(mouse.x * 10, mouse.y * 10), 0.1);
  });

  return (
    <>
      {/* Ambient lighting for overall scene illumination - Requirement 3.3 */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Dynamic point lights that follow particle formation - Requirements 3.3, 3.5 */}
      <pointLight
        ref={pointLight1Ref}
        distance={40}
        decay={2}
        intensity={currentLightIntensity.current}
        color={currentLightColor.current}
      />
      <pointLight
        ref={pointLight2Ref}
        distance={35}
        decay={2}
        intensity={currentLightIntensity.current * 0.7}
        color={currentLightColor.current}
      />
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-targetPosition"
            count={particleCount}
            array={targetPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-particleIndex"
            count={particleCount}
            array={indices}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive ref={materialRef} object={shaderMaterial} attach="material" />
      </points>
    </>
  );
}
