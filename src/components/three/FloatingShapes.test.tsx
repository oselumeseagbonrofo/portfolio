/**
 * Unit tests for FloatingShapes component
 */

import { describe, it, expect } from 'vitest';
import {
  calculateParallaxTranslation,
  calculateRotationFromScroll,
  calculateTranslationFromScroll,
} from './FloatingShapes';
import * as THREE from 'three';

describe('FloatingShapes helper functions', () => {
  describe('calculateParallaxTranslation', () => {
    it('should calculate parallax translation correctly', () => {
      const result = calculateParallaxTranslation(0.5, 1.0, 50);
      expect(result).toBe(25);
    });

    it('should return 0 at scroll position 0', () => {
      const result = calculateParallaxTranslation(0, 1.0, 50);
      expect(result).toBe(0);
    });

    it('should return 0 with depth 0', () => {
      const result = calculateParallaxTranslation(0.5, 0, 50);
      expect(result).toBe(0);
    });
  });

  describe('calculateRotationFromScroll', () => {
    it('should calculate rotation based on scroll', () => {
      const baseRotation = new THREE.Euler(0, 0, 0);
      const rotationSpeed = new THREE.Vector3(Math.PI, Math.PI, Math.PI);
      const result = calculateRotationFromScroll(0.5, baseRotation, rotationSpeed);

      expect(result.x).toBeCloseTo(Math.PI * 0.5);
      expect(result.y).toBeCloseTo(Math.PI * 0.5);
      expect(result.z).toBeCloseTo(Math.PI * 0.5);
    });

    it('should return base rotation at scroll 0', () => {
      const baseRotation = new THREE.Euler(0.1, 0.2, 0.3);
      const rotationSpeed = new THREE.Vector3(Math.PI, Math.PI, Math.PI);
      const result = calculateRotationFromScroll(0, baseRotation, rotationSpeed);

      expect(result.x).toBeCloseTo(0.1);
      expect(result.y).toBeCloseTo(0.2);
      expect(result.z).toBeCloseTo(0.3);
    });
  });

  describe('calculateTranslationFromScroll', () => {
    it('should calculate translation based on scroll', () => {
      const basePosition = new THREE.Vector3(0, 0, 0);
      const scrollInfluence = new THREE.Vector3(10, 20, 30);
      const result = calculateTranslationFromScroll(0.5, basePosition, scrollInfluence);

      expect(result.x).toBeCloseTo(5);
      expect(result.y).toBeCloseTo(10);
      expect(result.z).toBeCloseTo(15);
    });

    it('should return base position at scroll 0', () => {
      const basePosition = new THREE.Vector3(1, 2, 3);
      const scrollInfluence = new THREE.Vector3(10, 20, 30);
      const result = calculateTranslationFromScroll(0, basePosition, scrollInfluence);

      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(2);
      expect(result.z).toBeCloseTo(3);
    });
  });
});
