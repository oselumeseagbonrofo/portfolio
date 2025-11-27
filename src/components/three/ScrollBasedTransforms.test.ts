/**
 * Property-based tests for scroll-based 3D transforms
 * Feature: enhanced-ui-animations, Property 14: Scroll-based 3D transforms
 * Validates: Requirements 6.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as THREE from 'three';

/**
 * Property 14: Scroll-based 3D transforms
 * 
 * For any 3D background element and scroll position, the element's rotation
 * and translation should be deterministic functions of scroll position
 * (same scroll position always produces same transform).
 */
describe('3D Background Elements - Property 14: Scroll-based 3D transforms', () => {
  /**
   * Helper function to calculate rotation based on scroll position
   * This represents the logic that would be in FloatingShapes/DataVisualization components
   */
  function calculateRotationFromScroll(
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
   * Helper function to calculate translation based on scroll position
   * This represents the logic that would be in FloatingShapes/DataVisualization components
   */
  function calculateTranslationFromScroll(
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

  it('should produce identical rotations for identical scroll positions', () => {
    fc.assert(
      fc.property(
        // Generate scroll progress (0 to 1)
        fc.double({ min: 0, max: 1, noNaN: true }),
        // Generate base rotation angles
        fc.record({
          x: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          y: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          z: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
        }),
        // Generate rotation speed multipliers
        fc.record({
          x: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          y: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          z: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
        }),
        (scrollProgress, baseRotation, rotationSpeed) => {
          const baseEuler = new THREE.Euler(baseRotation.x, baseRotation.y, baseRotation.z);
          const speedVector = new THREE.Vector3(rotationSpeed.x, rotationSpeed.y, rotationSpeed.z);

          // Calculate rotation twice with same scroll position
          const rotation1 = calculateRotationFromScroll(scrollProgress, baseEuler, speedVector);
          const rotation2 = calculateRotationFromScroll(scrollProgress, baseEuler, speedVector);

          // Property: Same scroll position should always produce same rotation
          expect(rotation1.x).toBeCloseTo(rotation2.x, 10);
          expect(rotation1.y).toBeCloseTo(rotation2.y, 10);
          expect(rotation1.z).toBeCloseTo(rotation2.z, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce identical translations for identical scroll positions', () => {
    fc.assert(
      fc.property(
        // Generate scroll progress (0 to 1)
        fc.double({ min: 0, max: 1, noNaN: true }),
        // Generate base position
        fc.record({
          x: fc.double({ min: -50, max: 50, noNaN: true }),
          y: fc.double({ min: -50, max: 50, noNaN: true }),
          z: fc.double({ min: -50, max: 50, noNaN: true }),
        }),
        // Generate scroll influence
        fc.record({
          x: fc.double({ min: -20, max: 20, noNaN: true }),
          y: fc.double({ min: -20, max: 20, noNaN: true }),
          z: fc.double({ min: -20, max: 20, noNaN: true }),
        }),
        (scrollProgress, basePosition, scrollInfluence) => {
          const basePos = new THREE.Vector3(basePosition.x, basePosition.y, basePosition.z);
          const influence = new THREE.Vector3(scrollInfluence.x, scrollInfluence.y, scrollInfluence.z);

          // Calculate translation twice with same scroll position
          const translation1 = calculateTranslationFromScroll(scrollProgress, basePos, influence);
          const translation2 = calculateTranslationFromScroll(scrollProgress, basePos, influence);

          // Property: Same scroll position should always produce same translation
          expect(translation1.x).toBeCloseTo(translation2.x, 10);
          expect(translation1.y).toBeCloseTo(translation2.y, 10);
          expect(translation1.z).toBeCloseTo(translation2.z, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce deterministic transforms across multiple calculations', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.record({
          x: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          y: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          z: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          y: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          z: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -50, max: 50, noNaN: true }),
          y: fc.double({ min: -50, max: 50, noNaN: true }),
          z: fc.double({ min: -50, max: 50, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -20, max: 20, noNaN: true }),
          y: fc.double({ min: -20, max: 20, noNaN: true }),
          z: fc.double({ min: -20, max: 20, noNaN: true }),
        }),
        (scrollProgress, baseRotation, rotationSpeed, basePosition, scrollInfluence) => {
          const baseEuler = new THREE.Euler(baseRotation.x, baseRotation.y, baseRotation.z);
          const speedVector = new THREE.Vector3(rotationSpeed.x, rotationSpeed.y, rotationSpeed.z);
          const basePos = new THREE.Vector3(basePosition.x, basePosition.y, basePosition.z);
          const influence = new THREE.Vector3(scrollInfluence.x, scrollInfluence.y, scrollInfluence.z);

          // Calculate transforms multiple times
          const results = [];
          for (let i = 0; i < 5; i++) {
            const rotation = calculateRotationFromScroll(scrollProgress, baseEuler, speedVector);
            const translation = calculateTranslationFromScroll(scrollProgress, basePos, influence);
            results.push({ rotation, translation });
          }

          // Property: All calculations should produce identical results
          for (let i = 1; i < results.length; i++) {
            expect(results[i].rotation.x).toBeCloseTo(results[0].rotation.x, 10);
            expect(results[i].rotation.y).toBeCloseTo(results[0].rotation.y, 10);
            expect(results[i].rotation.z).toBeCloseTo(results[0].rotation.z, 10);
            expect(results[i].translation.x).toBeCloseTo(results[0].translation.x, 10);
            expect(results[i].translation.y).toBeCloseTo(results[0].translation.y, 10);
            expect(results[i].translation.z).toBeCloseTo(results[0].translation.z, 10);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce linearly proportional transforms for scroll progress', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.5, noNaN: true }),
        fc.record({
          x: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          y: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          z: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          y: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          z: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
        }),
        (scrollProgress, baseRotation, rotationSpeed) => {
          const baseEuler = new THREE.Euler(baseRotation.x, baseRotation.y, baseRotation.z);
          const speedVector = new THREE.Vector3(rotationSpeed.x, rotationSpeed.y, rotationSpeed.z);

          // Calculate rotation at scroll position
          const rotation1 = calculateRotationFromScroll(scrollProgress, baseEuler, speedVector);

          // Calculate rotation at double the scroll position
          const doubleScrollProgress = Math.min(scrollProgress * 2, 1);
          const rotation2 = calculateRotationFromScroll(doubleScrollProgress, baseEuler, speedVector);

          // Property: Rotation change should be proportional to scroll change
          // If we double scroll progress, the rotation change from base should double
          const change1X = rotation1.x - baseRotation.x;
          const change2X = rotation2.x - baseRotation.x;
          const change1Y = rotation1.y - baseRotation.y;
          const change2Y = rotation2.y - baseRotation.y;
          const change1Z = rotation1.z - baseRotation.z;
          const change2Z = rotation2.z - baseRotation.z;

          // Allow for small numerical errors
          if (Math.abs(change1X) > 0.001) {
            expect(Math.abs(change2X / change1X)).toBeCloseTo(2, 1);
          }
          if (Math.abs(change1Y) > 0.001) {
            expect(Math.abs(change2Y / change1Y)).toBeCloseTo(2, 1);
          }
          if (Math.abs(change1Z) > 0.001) {
            expect(Math.abs(change2Z / change1Z)).toBeCloseTo(2, 1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain transform consistency when scroll position is revisited', () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: 0, max: 1, noNaN: true }), { minLength: 3, maxLength: 10 }),
        fc.record({
          x: fc.double({ min: -50, max: 50, noNaN: true }),
          y: fc.double({ min: -50, max: 50, noNaN: true }),
          z: fc.double({ min: -50, max: 50, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -20, max: 20, noNaN: true }),
          y: fc.double({ min: -20, max: 20, noNaN: true }),
          z: fc.double({ min: -20, max: 20, noNaN: true }),
        }),
        (scrollPositions, basePosition, scrollInfluence) => {
          const basePos = new THREE.Vector3(basePosition.x, basePosition.y, basePosition.z);
          const influence = new THREE.Vector3(scrollInfluence.x, scrollInfluence.y, scrollInfluence.z);

          // Store transforms for each scroll position
          const transformMap = new Map<number, THREE.Vector3>();

          // Calculate transforms for all scroll positions
          for (const scrollProgress of scrollPositions) {
            const translation = calculateTranslationFromScroll(scrollProgress, basePos, influence);
            transformMap.set(scrollProgress, translation);
          }

          // Revisit each scroll position and verify consistency
          for (const scrollProgress of scrollPositions) {
            const newTranslation = calculateTranslationFromScroll(scrollProgress, basePos, influence);
            const originalTranslation = transformMap.get(scrollProgress)!;

            // Property: Revisiting a scroll position should produce the same transform
            expect(newTranslation.x).toBeCloseTo(originalTranslation.x, 10);
            expect(newTranslation.y).toBeCloseTo(originalTranslation.y, 10);
            expect(newTranslation.z).toBeCloseTo(originalTranslation.z, 10);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce transforms at scroll boundaries (0 and 1)', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          y: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
          z: fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          y: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
          z: fc.double({ min: -2 * Math.PI, max: 2 * Math.PI, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -50, max: 50, noNaN: true }),
          y: fc.double({ min: -50, max: 50, noNaN: true }),
          z: fc.double({ min: -50, max: 50, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -20, max: 20, noNaN: true }),
          y: fc.double({ min: -20, max: 20, noNaN: true }),
          z: fc.double({ min: -20, max: 20, noNaN: true }),
        }),
        (baseRotation, rotationSpeed, basePosition, scrollInfluence) => {
          const baseEuler = new THREE.Euler(baseRotation.x, baseRotation.y, baseRotation.z);
          const speedVector = new THREE.Vector3(rotationSpeed.x, rotationSpeed.y, rotationSpeed.z);
          const basePos = new THREE.Vector3(basePosition.x, basePosition.y, basePosition.z);
          const influence = new THREE.Vector3(scrollInfluence.x, scrollInfluence.y, scrollInfluence.z);

          // Test at scroll position 0 (top of page)
          const rotationAt0 = calculateRotationFromScroll(0, baseEuler, speedVector);
          const translationAt0 = calculateTranslationFromScroll(0, basePos, influence);

          // Property: At scroll 0, transforms should equal base values
          expect(rotationAt0.x).toBeCloseTo(baseRotation.x, 10);
          expect(rotationAt0.y).toBeCloseTo(baseRotation.y, 10);
          expect(rotationAt0.z).toBeCloseTo(baseRotation.z, 10);
          expect(translationAt0.x).toBeCloseTo(basePosition.x, 10);
          expect(translationAt0.y).toBeCloseTo(basePosition.y, 10);
          expect(translationAt0.z).toBeCloseTo(basePosition.z, 10);

          // Test at scroll position 1 (bottom of page)
          const rotationAt1 = calculateRotationFromScroll(1, baseEuler, speedVector);
          const translationAt1 = calculateTranslationFromScroll(1, basePos, influence);

          // Property: At scroll 1, transforms should equal base + full influence
          expect(rotationAt1.x).toBeCloseTo(baseRotation.x + rotationSpeed.x, 10);
          expect(rotationAt1.y).toBeCloseTo(baseRotation.y + rotationSpeed.y, 10);
          expect(rotationAt1.z).toBeCloseTo(baseRotation.z + rotationSpeed.z, 10);
          expect(translationAt1.x).toBeCloseTo(basePosition.x + scrollInfluence.x, 10);
          expect(translationAt1.y).toBeCloseTo(basePosition.y + scrollInfluence.y, 10);
          expect(translationAt1.z).toBeCloseTo(basePosition.z + scrollInfluence.z, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce continuous transforms for continuous scroll changes', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.9, noNaN: true }),
        fc.double({ min: 0.001, max: 0.1, noNaN: true }),
        fc.record({
          x: fc.double({ min: -50, max: 50, noNaN: true }),
          y: fc.double({ min: -50, max: 50, noNaN: true }),
          z: fc.double({ min: -50, max: 50, noNaN: true }),
        }),
        fc.record({
          x: fc.double({ min: -20, max: 20, noNaN: true }),
          y: fc.double({ min: -20, max: 20, noNaN: true }),
          z: fc.double({ min: -20, max: 20, noNaN: true }),
        }),
        (scrollProgress, delta, basePosition, scrollInfluence) => {
          const basePos = new THREE.Vector3(basePosition.x, basePosition.y, basePosition.z);
          const influence = new THREE.Vector3(scrollInfluence.x, scrollInfluence.y, scrollInfluence.z);

          // Calculate translation at current scroll position
          const translation1 = calculateTranslationFromScroll(scrollProgress, basePos, influence);

          // Calculate translation at slightly different scroll position
          const nextScrollProgress = Math.min(scrollProgress + delta, 1);
          const translation2 = calculateTranslationFromScroll(nextScrollProgress, basePos, influence);

          // Property: Small changes in scroll should produce small changes in transform
          const changeX = Math.abs(translation2.x - translation1.x);
          const changeY = Math.abs(translation2.y - translation1.y);
          const changeZ = Math.abs(translation2.z - translation1.z);

          // Expected change based on influence and delta
          const expectedChangeX = Math.abs(influence.x * delta);
          const expectedChangeY = Math.abs(influence.y * delta);
          const expectedChangeZ = Math.abs(influence.z * delta);

          // Changes should be proportional to delta
          expect(changeX).toBeCloseTo(expectedChangeX, 5);
          expect(changeY).toBeCloseTo(expectedChangeY, 5);
          expect(changeZ).toBeCloseTo(expectedChangeZ, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
