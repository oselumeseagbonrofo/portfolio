/**
 * Performance monitoring utility for FPS tracking and optimization
 * Monitors frame rate and provides adaptive quality recommendations
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  particleCount: number;
  drawCalls: number;
  memoryUsage?: number;
  gpuMemoryUsage?: number;
}

export interface PerformanceThresholds {
  targetFPS: number;
  minFPS: number;
  degradeThreshold: number;
}

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface AdaptiveQualitySettings {
  particleCount: number;
  enablePostProcessing: boolean;
  enable3DBackgrounds: boolean;
  enableComplexShaders: boolean;
  enableDynamicLighting: boolean;
}

class PerformanceMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private currentFPS: number = 60;
  private readonly maxSamples: number = 60;
  private callbacks: Set<(fps: number) => void> = new Set();
  private qualityCallbacks: Set<(settings: AdaptiveQualitySettings) => void> = new Set();
  private currentQuality: AdaptiveQualitySettings;
  private performanceHistory: number[] = [];
  private isMonitoring: boolean = false;

  constructor() {
    this.currentQuality = this.getDefaultQualitySettings();
    this.startMonitoring();
  }

  private getDefaultQualitySettings(): AdaptiveQualitySettings {
    const isMobile = this.isMobileDevice();
    return {
      particleCount: isMobile ? 500 : 2000,
      enablePostProcessing: !isMobile,
      enable3DBackgrounds: !isMobile,
      enableComplexShaders: !isMobile,
      enableDynamicLighting: true,
    };
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  }

  private startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    const measure = () => {
      if (!this.isMonitoring) return;

      const now = performance.now();
      const delta = now - this.lastTime;
      this.lastTime = now;

      if (delta > 0) {
        const fps = 1000 / delta;
        this.frames.push(fps);

        if (this.frames.length > this.maxSamples) {
          this.frames.shift();
        }

        this.frameCount++;

        // Calculate average FPS every 10 frames
        if (this.frameCount % 10 === 0) {
          this.currentFPS = this.getAverageFPS();
          this.performanceHistory.push(this.currentFPS);
          
          // Keep only last 100 samples for trend analysis
          if (this.performanceHistory.length > 100) {
            this.performanceHistory.shift();
          }

          this.notifyCallbacks(this.currentFPS);
          this.updateAdaptiveQuality();
        }
      }

      requestAnimationFrame(measure);
    };

    requestAnimationFrame(measure);
  }

  private getAverageFPS(): number {
    if (this.frames.length === 0) return 60;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return sum / this.frames.length;
  }

  private notifyCallbacks(fps: number): void {
    this.callbacks.forEach((callback) => callback(fps));
  }

  /**
   * Get current FPS
   */
  public getFPS(): number {
    return Math.round(this.currentFPS);
  }

  /**
   * Subscribe to FPS updates
   */
  public subscribe(callback: (fps: number) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Determine performance tier based on current FPS
   * Mobile devices use different thresholds (30 FPS minimum vs 60 FPS for desktop)
   */
  public getPerformanceTier(thresholds?: PerformanceThresholds): PerformanceTier {
    const fps = this.getFPS();
    const { targetFPS = 60, minFPS = 30, degradeThreshold = 50 } = thresholds || {};

    if (fps >= targetFPS) return 'high';
    if (fps >= degradeThreshold) return 'medium';
    if (fps >= minFPS) return 'low';
    return 'low';
  }

  /**
   * Check if performance is degraded
   */
  public isPerformanceDegraded(threshold: number = 50): boolean {
    return this.getFPS() < threshold;
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return {
      fps: this.getFPS(),
      frameTime: 1000 / this.currentFPS,
      particleCount: 0, // To be set by particle system
      drawCalls: 0, // To be set by renderer
    };
  }

  private updateAdaptiveQuality(): void {
    const isMobile = this.isMobileDevice();
    const fps = this.getFPS();
    const newQuality = { ...this.currentQuality };
    let qualityChanged = false;

    // Mobile-specific thresholds (Requirements 8.1, 8.5)
    const degradeThreshold = isMobile ? 25 : 40;
    const improveThreshold = isMobile ? 28 : 50;

    // Analyze performance trend
    const recentPerformance = this.performanceHistory.slice(-10);
    const avgRecentFPS = recentPerformance.length > 0 
      ? recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length 
      : fps;

    // Degrade quality if performance is consistently poor
    if (avgRecentFPS < degradeThreshold) {
      // Step 1: Reduce particle count
      if (newQuality.particleCount > (isMobile ? 100 : 200)) {
        newQuality.particleCount = Math.floor(newQuality.particleCount * 0.7);
        qualityChanged = true;
      }
      // Step 2: Disable post-processing (Requirement 8.2)
      else if (newQuality.enablePostProcessing) {
        newQuality.enablePostProcessing = false;
        qualityChanged = true;
      }
      // Step 3: Disable 3D backgrounds (Requirement 8.3)
      else if (newQuality.enable3DBackgrounds) {
        newQuality.enable3DBackgrounds = false;
        qualityChanged = true;
      }
      // Step 4: Disable complex shaders
      else if (newQuality.enableComplexShaders) {
        newQuality.enableComplexShaders = false;
        qualityChanged = true;
      }
      // Step 5: Disable dynamic lighting
      else if (newQuality.enableDynamicLighting) {
        newQuality.enableDynamicLighting = false;
        qualityChanged = true;
      }
    }
    // Improve quality if performance is consistently good
    else if (avgRecentFPS > improveThreshold) {
      const maxParticles = isMobile ? 500 : 2000; // Requirement 8.1
      
      // Gradually restore features in reverse order
      if (!newQuality.enableDynamicLighting) {
        newQuality.enableDynamicLighting = true;
        qualityChanged = true;
      } else if (!newQuality.enableComplexShaders && !isMobile) {
        newQuality.enableComplexShaders = true;
        qualityChanged = true;
      } else if (!newQuality.enable3DBackgrounds && !isMobile) {
        newQuality.enable3DBackgrounds = true;
        qualityChanged = true;
      } else if (!newQuality.enablePostProcessing && !isMobile) {
        newQuality.enablePostProcessing = true;
        qualityChanged = true;
      } else if (newQuality.particleCount < maxParticles) {
        newQuality.particleCount = Math.min(
          Math.floor(newQuality.particleCount * 1.2),
          maxParticles
        );
        qualityChanged = true;
      }
    }

    if (qualityChanged) {
      this.currentQuality = newQuality;
      this.notifyQualityCallbacks(newQuality);
    }
  }

  private notifyQualityCallbacks(settings: AdaptiveQualitySettings): void {
    this.qualityCallbacks.forEach((callback) => callback(settings));
  }

  /**
   * Subscribe to adaptive quality changes
   */
  public subscribeToQuality(callback: (settings: AdaptiveQualitySettings) => void): () => void {
    this.qualityCallbacks.add(callback);
    return () => this.qualityCallbacks.delete(callback);
  }

  /**
   * Get current adaptive quality settings
   */
  public getCurrentQuality(): AdaptiveQualitySettings {
    return { ...this.currentQuality };
  }

  /**
   * Force quality settings (for testing or manual override)
   */
  public setQuality(settings: Partial<AdaptiveQualitySettings>): void {
    this.currentQuality = { ...this.currentQuality, ...settings };
    this.notifyQualityCallbacks(this.currentQuality);
  }

  /**
   * Get memory usage information
   */
  public getMemoryInfo(): { used: number; total: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / 1024 / 1024, // MB
        total: memory.totalJSHeapSize / 1024 / 1024, // MB
      };
    }
    return null;
  }

  /**
   * Stop monitoring (for cleanup)
   */
  public stop(): void {
    this.isMonitoring = false;
    this.callbacks.clear();
    this.qualityCallbacks.clear();
  }

  /**
   * Reset monitoring
   */
  public reset(): void {
    this.frames = [];
    this.frameCount = 0;
    this.currentFPS = 60;
    this.performanceHistory = [];
    this.currentQuality = this.getDefaultQualitySettings();
  }
}

// Singleton instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
  }
  return performanceMonitorInstance;
}

/**
 * Hook-friendly function to get recommended particle count based on performance
 * Mobile devices are limited to 500 particles maximum - Requirement 8.1
 */
export function getRecommendedParticleCount(
  tier: PerformanceTier,
  isMobile: boolean
): number {
  if (isMobile) {
    // Ensure mobile never exceeds 500 particles - Requirement 8.1
    return Math.min(
      tier === 'high' ? 500 : tier === 'medium' ? 300 : 200,
      500
    );
  }
  return tier === 'high' ? 2000 : tier === 'medium' ? 1000 : 500;
}

/**
 * Determine if post-processing should be enabled
 * Disabled on mobile devices - Requirement 8.2
 */
export function shouldEnablePostProcessing(
  tier: PerformanceTier,
  isMobile: boolean
): boolean {
  return !isMobile && tier === 'high';
}

/**
 * Get mobile-specific performance thresholds
 * Mobile devices target 30 FPS minimum - Requirement 8.5
 */
export function getMobilePerformanceThresholds(): PerformanceThresholds {
  return {
    targetFPS: 30, // 30 FPS minimum for mobile devices
    minFPS: 20,
    degradeThreshold: 25
  };
}

/**
 * Get desktop performance thresholds
 */
export function getDesktopPerformanceThresholds(): PerformanceThresholds {
  return {
    targetFPS: 60,
    minFPS: 30,
    degradeThreshold: 50
  };
}
