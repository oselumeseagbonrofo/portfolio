/**
 * Three.js components exports
 */

export { default as EnhancedParticles } from './EnhancedParticles';
export type { ParticleConfig, ParticleSystemProps } from './EnhancedParticles';

export { default as SceneEffects } from './SceneEffects';
export type { SceneEffectsProps } from './SceneEffects';

export { default as FloatingShapes } from './FloatingShapes';
export type { Shape, FloatingShapesProps } from './FloatingShapes';
export {
  calculateParallaxTranslation,
  calculateRotationFromScroll,
  calculateTranslationFromScroll,
} from './FloatingShapes';

export { default as DataVisualization } from './DataVisualization';
export type { DataVisualizationProps } from './DataVisualization';

export { default as LazyScene } from './LazyScene';
export type { LazySceneProps } from './LazyScene';

export { default as OptimizedThreeProvider } from './OptimizedThreeProvider';
export { useOptimizedThree, useThreePerformance, useQualityControl } from './OptimizedThreeProvider';

export { default as ThreeErrorBoundary } from './ThreeErrorBoundary';
export { useThreeErrorHandler, withThreeErrorBoundary } from './ThreeErrorBoundary';

export { default as WebGLFallback } from './WebGLFallback';
export { ParticleFallback, Background3DFallback } from './WebGLFallback';

export { default as MobileOptimizedScene } from './MobileOptimizedScene';
export { useShould3DRender } from './MobileOptimizedScene';
