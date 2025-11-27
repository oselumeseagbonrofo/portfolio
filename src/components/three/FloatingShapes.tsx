/**
 * FloatingShapes component for 3D geometric background elements
 * Requirements: 6.1, 6.3, 6.4
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface Shape {
  geometry: 'box' | 'sphere' | 'torus' | 'octahedron';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  depth: number; // For parallax effect (0.1 to 2.0)
}

export interface FloatingShapesProps {
  shapes: Shape[];
  scrollProgress: number;
  parallaxStrength?: number;
  rotationSpeed?: THREE.Vector3;
}

/**
 * Helper function to calculate parallax translation
 * Implements Property 13: translateY = s * d * parallaxStrength
 */
export function calculateParallaxTranslation(
  scrollPosition: number,
  depth: number,
  parallaxStrength: number
): number {
  return scrollPosition * depth * parallaxStrength;
}

/**
 * Helper function to calculate rotation based on scroll
 * Implements Property 14: deterministic scroll-based transforms
 */
export function calculateRotationFromScroll(
  scrollProgress: number,
  baseRotation: THREE.Euler,
  rotationSpeed: THREE.Vector3
): THREE.Euler {
  return new THREE.Euler(
    baseRotation.x + scrollProgress * rotationSpeed.x,
    baseRotation.y + scrollProgress * rotationSpeed.y,
    baseRotation.z + scrollProgress * rotationSpeed.z,
    baseRotation.order
  );
}

/**
 * Helper function to calculate translation based on scroll
 * Implements Property 14: deterministic scroll-based transforms
 */
export function calculateTranslationFromScroll(
  scrollProgress: number,
  basePosition: THREE.Vector3,
  scrollInfluence: THREE.Vector3
): THREE.Vector3 {
  return new THREE.Vector3(
    basePosition.x + scrollProgress * scrollInfluence.x,
    basePosition.y + scrollProgress * scrollInfluence.y,
    basePosition.z + scrollProgress * scrollInfluence.z
  );
}

/**
 * Individual shape component
 */
function FloatingShape({
  shape,
  scrollProgress,
  parallaxStrength,
  rotationSpeed,
}: {
  shape: Shape;
  scrollProgress: number;
  parallaxStrength: number;
  rotationSpeed: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create geometry based on shape type
  const geometry = useMemo(() => {
    switch (shape.geometry) {
      case 'box':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'sphere':
        return new THREE.SphereGeometry(0.5, 32, 32);
      case 'torus':
        return new THREE.TorusGeometry(0.5, 0.2, 16, 100);
      case 'octahedron':
        return new THREE.OctahedronGeometry(0.5, 0);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [shape.geometry]);

  // Create material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: shape.color,
      metalness: 0.5,
      roughness: 0.5,
      transparent: true,
      opacity: 0.6,
    });
  }, [shape.color]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Calculate parallax translation (Property 13)
    const parallaxY = calculateParallaxTranslation(
      scrollProgress,
      shape.depth,
      parallaxStrength
    );

    // Apply base position with parallax offset
    meshRef.current.position.set(
      shape.position[0],
      shape.position[1] + parallaxY,
      shape.position[2]
    );

    // Calculate scroll-based rotation (Property 14)
    const baseRotation = new THREE.Euler(
      shape.rotation[0],
      shape.rotation[1],
      shape.rotation[2]
    );
    const newRotation = calculateRotationFromScroll(
      scrollProgress,
      baseRotation,
      rotationSpeed
    );

    meshRef.current.rotation.copy(newRotation);

    // Apply scale
    meshRef.current.scale.setScalar(shape.scale);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}

/**
 * FloatingShapes component renders multiple 3D geometric shapes
 * with parallax scrolling and scroll-based rotation
 */
export default function FloatingShapes({
  shapes,
  scrollProgress,
  parallaxStrength = 50,
  rotationSpeed = new THREE.Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2),
}: FloatingShapesProps) {
  return (
    <group>
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          shape={shape}
          scrollProgress={scrollProgress}
          parallaxStrength={parallaxStrength}
          rotationSpeed={rotationSpeed}
        />
      ))}
    </group>
  );
}
