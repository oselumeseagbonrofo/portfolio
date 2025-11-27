/**
 * DataVisualization component with animated 3D mesh
 * Requirements: 6.2, 6.3, 6.4
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  calculateParallaxTranslation,
  calculateRotationFromScroll,
} from './FloatingShapes';

export interface DataVisualizationProps {
  scrollProgress: number;
  position?: [number, number, number];
  scale?: number;
  color?: string;
  depth?: number;
  parallaxStrength?: number;
  rotationSpeed?: THREE.Vector3;
  waveAmplitude?: number;
  waveFrequency?: number;
}

/**
 * DataVisualization component renders an animated 3D mesh
 * that responds to scroll position with parallax and rotation
 */
export default function DataVisualization({
  scrollProgress,
  position = [0, 0, -10],
  scale = 5,
  color = '#3b82f6',
  depth = 0.5,
  parallaxStrength = 50,
  rotationSpeed = new THREE.Vector3(Math.PI, Math.PI * 0.5, 0),
  waveAmplitude = 0.5,
  waveFrequency = 2,
}: DataVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Create plane geometry with subdivisions for wave animation
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(1, 1, 32, 32);
  }, []);

  // Create material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      wireframe: true,
    });
  }, [color]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Calculate parallax translation (Property 13)
    const parallaxY = calculateParallaxTranslation(
      scrollProgress,
      depth,
      parallaxStrength
    );

    // Apply base position with parallax offset
    meshRef.current.position.set(
      position[0],
      position[1] + parallaxY,
      position[2]
    );

    // Calculate scroll-based rotation (Property 14)
    const baseRotation = new THREE.Euler(0, 0, 0);
    const newRotation = calculateRotationFromScroll(
      scrollProgress,
      baseRotation,
      rotationSpeed
    );

    meshRef.current.rotation.copy(newRotation);

    // Apply scale
    meshRef.current.scale.setScalar(scale);

    // Animate vertices with wave effect
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      // Create wave pattern based on position and time
      const wave =
        Math.sin(x * waveFrequency + time) *
        Math.cos(y * waveFrequency + time * 0.5) *
        waveAmplitude;

      positionAttribute.setZ(i, wave);
    }
    positionAttribute.needsUpdate = true;

    // Update material opacity based on scroll
    if (materialRef.current) {
      // Fade in as user scrolls
      materialRef.current.opacity = 0.3 + scrollProgress * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}
