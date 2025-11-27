/**
 * WebGL context loss recovery utility
 * Handles WebGL context loss and restoration for Three.js scenes
 */

import * as THREE from 'three';

export interface WebGLRecoveryOptions {
  onContextLost?: () => void;
  onContextRestored?: () => void;
  onRecoveryFailed?: (error: Error) => void;
  maxRecoveryAttempts?: number;
  recoveryDelay?: number;
}

export class WebGLRecoveryManager {
  private canvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private options: Required<WebGLRecoveryOptions>;
  private recoveryAttempts: number = 0;
  private isContextLost: boolean = false;
  private recoveryTimeout: NodeJS.Timeout | null = null;

  constructor(options: WebGLRecoveryOptions = {}) {
    this.options = {
      onContextLost: options.onContextLost || (() => {}),
      onContextRestored: options.onContextRestored || (() => {}),
      onRecoveryFailed: options.onRecoveryFailed || (() => {}),
      maxRecoveryAttempts: options.maxRecoveryAttempts || 3,
      recoveryDelay: options.recoveryDelay || 1000,
    };
  }

  /**
   * Initialize WebGL context loss handling for a renderer
   */
  public initialize(renderer: THREE.WebGLRenderer): void {
    this.renderer = renderer;
    this.canvas = renderer.domElement;

    if (!this.canvas) {
      console.warn('WebGL Recovery: No canvas found');
      return;
    }

    // Add context loss event listeners
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost.bind(this));
    this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored.bind(this));
  }

  /**
   * Handle WebGL context lost event
   */
  private handleContextLost(event: Event): void {
    console.warn('WebGL context lost');
    event.preventDefault(); // Prevent default browser behavior
    
    this.isContextLost = true;
    this.options.onContextLost();

    // Attempt recovery after delay
    this.scheduleRecovery();
  }

  /**
   * Handle WebGL context restored event
   */
  private handleContextRestored(event: Event): void {
    console.log('WebGL context restored');
    
    this.isContextLost = false;
    this.recoveryAttempts = 0;
    
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
      this.recoveryTimeout = null;
    }

    this.options.onContextRestored();
  }

  /**
   * Schedule context recovery attempt
   */
  private scheduleRecovery(): void {
    if (this.recoveryAttempts >= this.options.maxRecoveryAttempts) {
      const error = new Error(`WebGL context recovery failed after ${this.options.maxRecoveryAttempts} attempts`);
      this.options.onRecoveryFailed(error);
      return;
    }

    this.recoveryTimeout = setTimeout(() => {
      this.attemptRecovery();
    }, this.options.recoveryDelay);
  }

  /**
   * Attempt to recover WebGL context
   */
  private attemptRecovery(): void {
    if (!this.isContextLost || !this.canvas) {
      return;
    }

    this.recoveryAttempts++;
    console.log(`WebGL recovery attempt ${this.recoveryAttempts}/${this.options.maxRecoveryAttempts}`);

    try {
      // Force context restoration by getting a new context
      const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
      
      if (gl && !gl.isContextLost()) {
        console.log('WebGL context recovery successful');
        this.handleContextRestored(new Event('webglcontextrestored'));
      } else {
        // Context still lost, schedule another attempt
        this.scheduleRecovery();
      }
    } catch (error) {
      console.error('WebGL recovery attempt failed:', error);
      this.scheduleRecovery();
    }
  }

  /**
   * Check if WebGL context is currently lost
   */
  public getContextLostStatus(): boolean {
    return this.isContextLost;
  }

  /**
   * Get recovery attempt count
   */
  public getRecoveryAttempts(): number {
    return this.recoveryAttempts;
  }

  /**
   * Manually trigger recovery (for testing)
   */
  public forceRecovery(): void {
    if (this.isContextLost) {
      this.attemptRecovery();
    }
  }

  /**
   * Clean up event listeners
   */
  public dispose(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', this.handleContextLost.bind(this));
      this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored.bind(this));
    }

    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
      this.recoveryTimeout = null;
    }

    this.canvas = null;
    this.renderer = null;
  }
}

/**
 * Check if WebGL2 is supported
 */
export function checkWebGL2Support(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  } catch (error) {
    return false;
  }
}

/**
 * Check if WebGL (any version) is supported
 */
export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch (error) {
    return false;
  }
}

/**
 * Get WebGL capabilities information
 */
export function getWebGLCapabilities(): {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  extensions: string[];
} {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) {
    return {
      hasWebGL: false,
      hasWebGL2: false,
      maxTextureSize: 0,
      maxVertexUniforms: 0,
      maxFragmentUniforms: 0,
      extensions: [],
    };
  }

  const extensions = gl.getSupportedExtensions() || [];

  return {
    hasWebGL: true,
    hasWebGL2: !!canvas.getContext('webgl2'),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    extensions,
  };
}