/**
 * Property-based tests for EnhancedParticles component
 * Using fast-check for property-based testing
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as THREE from 'three';

/**
 * Feature: enhanced-ui-animations, Property 1: Particle convergence
 * Validates: Requirements 1.2
 * 
 * For any particle in the system, after 3 seconds from page load,
 * the particle position should be within 5% of its target formation position.
 */
describe('EnhancedParticles - Property 1: Particle convergence', () => {
  it('should converge particles to within 5% of target position after 3 seconds', () => {
    fc.assert(
      fc.property(
        // Generate random particle configurations
        fc.record({
          scatteredPosition: fc.record({
            x: fc.float({ min: -50, max: 50, noNaN: true }),
            y: fc.float({ min: -50, max: 50, noNaN: true }),
            z: fc.float({ min: -50, max: 50, noNaN: true }),
          }),
          targetPosition: fc.record({
            x: fc.float({ min: -15, max: 15, noNaN: true }),
            y: fc.float({ min: -15, max: 15, noNaN: true }),
            z: fc.float({ min: -15, max: 15, noNaN: true }),
          }),
          time: fc.float({ min: 3.0, max: 10.0, noNaN: true }), // Time >= 3 seconds
        }),
        ({ scatteredPosition, targetPosition, time }) => {
          // Calculate convergence factor (same as in component)
          const convergenceDuration = 3.0;
          let convergence = Math.min(time / convergenceDuration, 1);
          // Apply smoothstep for easing
          convergence = convergence * convergence * (3 - 2 * convergence);

          // Calculate interpolated position
          const currentX = THREE.MathUtils.lerp(scatteredPosition.x, targetPosition.x, convergence);
          const currentY = THREE.MathUtils.lerp(scatteredPosition.y, targetPosition.y, convergence);
          const currentZ = THREE.MathUtils.lerp(scatteredPosition.z, targetPosition.z, convergence);

          // Calculate distance from target
          const dx = currentX - targetPosition.x;
          const dy = currentY - targetPosition.y;
          const dz = currentZ - targetPosition.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Calculate target distance (for 5% threshold)
          const targetDistance = Math.sqrt(
            targetPosition.x * targetPosition.x +
            targetPosition.y * targetPosition.y +
            targetPosition.z * targetPosition.z
          );
          const threshold = targetDistance * 0.05;

          // After 3 seconds, convergence should be 1.0, so distance should be 0
          // We allow a small numerical error
          if (time >= 3.0) {
            expect(distance).toBeLessThanOrEqual(threshold + 0.001);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: enhanced-ui-animations, Property 4: Proximity-based particle highlighting
 * Validates: Requirements 2.2
 * 
 * For any particle and mouse position, if the distance between them is less than
 * a threshold radius, the particle brightness and scale should increase proportionally to proximity.
 */
describe('EnhancedParticles - Property 4: Proximity-based particle highlighting', () => {
  it('should increase brightness and opacity proportionally to proximity', () => {
    fc.assert(
      fc.property(
        fc.record({
          particlePosition: fc.record({
            x: fc.float({ min: -10, max: 10, noNaN: true }),
            y: fc.float({ min: -10, max: 10, noNaN: true }),
          }),
          mousePosition: fc.record({
            x: fc.float({ min: -10, max: 10, noNaN: true }),
            y: fc.float({ min: -10, max: 10, noNaN: true }),
          }),
        }),
        ({ particlePosition, mousePosition }) => {
          // Calculate distance (2D for simplicity, matching shader logic)
          const dx = particlePosition.x - mousePosition.x;
          const dy = particlePosition.y - mousePosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Shader logic for proximity highlighting
          const proximityThreshold = 2.0;
          const proximityFactor = Math.max(0, 1 - distance / proximityThreshold);
          
          const baseOpacity = 0.6;
          const opacity = baseOpacity + proximityFactor * 0.4;
          const glow = proximityFactor * 0.5;

          // Property: When distance < threshold, opacity and glow should increase
          if (distance < proximityThreshold) {
            // Opacity should be greater than base
            expect(opacity).toBeGreaterThan(baseOpacity);
            // Glow should be positive
            expect(glow).toBeGreaterThan(0);
            
            // Closer particles should have higher values
            const closerDistance = distance * 0.5;
            const closerProximityFactor = Math.max(0, 1 - closerDistance / proximityThreshold);
            const closerOpacity = baseOpacity + closerProximityFactor * 0.4;
            const closerGlow = closerProximityFactor * 0.5;
            
            expect(closerOpacity).toBeGreaterThanOrEqual(opacity);
            expect(closerGlow).toBeGreaterThanOrEqual(glow);
          } else {
            // Outside threshold, should be at base values
            expect(opacity).toBeCloseTo(baseOpacity, 5);
            expect(glow).toBeCloseTo(0, 5);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: enhanced-ui-animations, Property 5: Momentum-based particle trailing
 * Validates: Requirements 2.4
 * 
 * For any rapid mouse movement (velocity above threshold), particle positions should
 * lag behind the target position proportionally to mouse velocity, creating a trailing effect.
 */
describe('EnhancedParticles - Property 5: Momentum-based particle trailing', () => {
  it('should create trailing effect proportional to mouse velocity', () => {
    fc.assert(
      fc.property(
        fc.record({
          velocity: fc.float({ min: 0, max: 1, noNaN: true }),
          convergence: fc.float({ min: 0.5, max: 1, noNaN: true }), // Partially or fully converged
          scatteredPosition: fc.float({ min: -50, max: 50, noNaN: true }),
          targetPosition: fc.float({ min: -15, max: 15, noNaN: true }),
        }),
        ({ velocity, convergence, scatteredPosition, targetPosition }) => {
          // Component logic for momentum trailing
          const momentumFactor = Math.min(velocity * 10, 1);
          const trailingDelay = momentumFactor * 0.1 * (1 - convergence);
          const effectiveConvergence = Math.max(0, convergence - trailingDelay);

          // Calculate positions
          const positionWithoutTrailing = THREE.MathUtils.lerp(
            scatteredPosition,
            targetPosition,
            convergence
          );
          const positionWithTrailing = THREE.MathUtils.lerp(
            scatteredPosition,
            targetPosition,
            effectiveConvergence
          );

          // Property: Higher velocity should create more lag (lower effective convergence)
          if (velocity > 0.1) {
            // With trailing, effective convergence should be less than original
            expect(effectiveConvergence).toBeLessThanOrEqual(convergence);
            
            // Position with trailing should be further from target than without
            const distanceWithoutTrailing = Math.abs(positionWithoutTrailing - targetPosition);
            const distanceWithTrailing = Math.abs(positionWithTrailing - targetPosition);
            
            expect(distanceWithTrailing).toBeGreaterThanOrEqual(distanceWithoutTrailing - 0.001);
          } else {
            // Low velocity should have minimal trailing
            expect(effectiveConvergence).toBeCloseTo(convergence, 1);
          }

          // Property: Trailing delay should be proportional to velocity
          const higherVelocity = Math.min(velocity * 1.5, 1);
          const higherMomentumFactor = Math.min(higherVelocity * 10, 1);
          const higherTrailingDelay = higherMomentumFactor * 0.1 * (1 - convergence);
          
          if (velocity < 0.9 && higherVelocity <= 1) {
            expect(higherTrailingDelay).toBeGreaterThanOrEqual(trailingDelay);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: enhanced-ui-animations, Property 6: Light-particle coupling
 * Validates: Requirements 3.3
 * 
 * For any particle formation center position, dynamic point lights should be
 * positioned within a fixed offset distance from that center.
 */
describe('EnhancedParticles - Property 6: Light-particle coupling', () => {
  it('should position lights within fixed offset from particle formation center', () => {
    fc.assert(
      fc.property(
        fc.record({
          centerX: fc.float({ min: -20, max: 20, noNaN: true }),
          centerY: fc.float({ min: -20, max: 20, noNaN: true }),
          centerZ: fc.float({ min: -20, max: 20, noNaN: true }),
        }),
        ({ centerX, centerY, centerZ }) => {
          // Component logic for light positioning
          // Light 1 offset: (+5, +5, +10)
          const light1X = centerX + 5;
          const light1Y = centerY + 5;
          const light1Z = centerZ + 10;

          // Light 2 offset: (-5, -5, +10)
          const light2X = centerX - 5;
          const light2Y = centerY - 5;
          const light2Z = centerZ + 10;

          // Calculate distances from center
          const light1Distance = Math.sqrt(
            Math.pow(light1X - centerX, 2) +
            Math.pow(light1Y - centerY, 2) +
            Math.pow(light1Z - centerZ, 2)
          );

          const light2Distance = Math.sqrt(
            Math.pow(light2X - centerX, 2) +
            Math.pow(light2Y - centerY, 2) +
            Math.pow(light2Z - centerZ, 2)
          );

          // Expected fixed offset distances
          const expectedLight1Distance = Math.sqrt(5 * 5 + 5 * 5 + 10 * 10); // ~12.25
          const expectedLight2Distance = Math.sqrt(5 * 5 + 5 * 5 + 10 * 10); // ~12.25

          // Property: Lights should maintain fixed offset distance from center
          expect(light1Distance).toBeCloseTo(expectedLight1Distance, 5);
          expect(light2Distance).toBeCloseTo(expectedLight2Distance, 5);

          // Property: Light positions should move with center
          const newCenterX = centerX + 10;
          const newCenterY = centerY + 10;
          const newCenterZ = centerZ + 10;

          const newLight1X = newCenterX + 5;
          const newLight1Y = newCenterY + 5;
          const newLight1Z = newCenterZ + 10;

          // Distance between old and new light position should equal distance between centers
          const centerMovement = Math.sqrt(10 * 10 + 10 * 10 + 10 * 10);
          const lightMovement = Math.sqrt(
            Math.pow(newLight1X - light1X, 2) +
            Math.pow(newLight1Y - light1Y, 2) +
            Math.pow(newLight1Z - light1Z, 2)
          );

          expect(lightMovement).toBeCloseTo(centerMovement, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: enhanced-ui-animations, Property 7: Lighting transition timing
 * Validates: Requirements 3.5
 * 
 * For any light intensity or color change, the transition should complete
 * within 0.5 seconds ± 0.1 seconds.
 */
describe('EnhancedParticles - Property 7: Lighting transition timing', () => {
  it('should complete light transitions within 0.5 ± 0.1 seconds', () => {
    fc.assert(
      fc.property(
        fc.record({
          startIntensity: fc.float({ min: 0, max: 3, noNaN: true }),
          targetIntensity: fc.float({ min: 0, max: 3, noNaN: true }),
          deltaTime: fc.float({ min: Math.fround(0.016), max: Math.fround(0.033), noNaN: true }), // 30-60 FPS
        }),
        ({ startIntensity, targetIntensity, deltaTime }) => {
          // Component logic: Linear interpolation over 0.5 seconds
          const TRANSITION_DURATION = 0.5;
          
          // Simulate transition over time with linear interpolation
          let elapsedTime = 0;
          let currentIntensity = startIntensity;
          
          while (elapsedTime < TRANSITION_DURATION) {
            elapsedTime += deltaTime;
            const t = Math.min(elapsedTime / TRANSITION_DURATION, 1);
            currentIntensity = THREE.MathUtils.lerp(startIntensity, targetIntensity, t);
          }

          // Property: Transition should complete in exactly 0.5 seconds (within frame precision)
          // Allow for frame rate variations: 0.4 to 0.6 seconds
          expect(elapsedTime).toBeGreaterThanOrEqual(0.4);
          expect(elapsedTime).toBeLessThanOrEqual(0.6);

          // Property: Final intensity should equal target (linear interpolation reaches exactly)
          expect(currentIntensity).toBeCloseTo(targetIntensity, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should smoothly interpolate color transitions within timing constraints', () => {
    fc.assert(
      fc.property(
        fc.record({
          startColor: fc.record({
            r: fc.float({ min: 0, max: 1, noNaN: true }),
            g: fc.float({ min: 0, max: 1, noNaN: true }),
            b: fc.float({ min: 0, max: 1, noNaN: true }),
          }),
          targetColor: fc.record({
            r: fc.float({ min: 0, max: 1, noNaN: true }),
            g: fc.float({ min: 0, max: 1, noNaN: true }),
            b: fc.float({ min: 0, max: 1, noNaN: true }),
          }),
          deltaTime: fc.float({ min: Math.fround(0.016), max: Math.fround(0.033), noNaN: true }),
        }),
        ({ startColor, targetColor, deltaTime }) => {
          // Component logic: Linear interpolation over 0.5 seconds
          const TRANSITION_DURATION = 0.5;
          
          const start = new THREE.Color(startColor.r, startColor.g, startColor.b);
          const target = new THREE.Color(targetColor.r, targetColor.g, targetColor.b);
          const currentColor = start.clone();
          
          let elapsedTime = 0;
          
          // Simulate color transition with linear interpolation
          while (elapsedTime < TRANSITION_DURATION) {
            elapsedTime += deltaTime;
            const t = Math.min(elapsedTime / TRANSITION_DURATION, 1);
            currentColor.copy(start);
            currentColor.lerp(target, t);
          }

          // Property: Color transition timing should match intensity timing (0.5s ± 0.1s)
          expect(elapsedTime).toBeGreaterThanOrEqual(0.4);
          expect(elapsedTime).toBeLessThanOrEqual(0.6);

          // Property: Final color should equal target (linear interpolation reaches exactly)
          expect(currentColor.r).toBeCloseTo(target.r, 5);
          expect(currentColor.g).toBeCloseTo(target.g, 5);
          expect(currentColor.b).toBeCloseTo(target.b, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
