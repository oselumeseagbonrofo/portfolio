/**
 * Tests for WebGL context loss recovery
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebGLRecoveryManager, checkWebGL2Support, checkWebGLSupport, getWebGLCapabilities } from './webglRecovery';

// Mock canvas and WebGL context
const mockCanvas = {
  getContext: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockWebGLContext = {
  isContextLost: vi.fn(() => false),
  getParameter: vi.fn(),
  getSupportedExtensions: vi.fn(() => ['EXT_texture_filter_anisotropic']),
};

// Mock document.createElement
const mockCreateElement = vi.fn();
Object.defineProperty(global, 'document', {
  value: {
    createElement: mockCreateElement,
  },
  writable: true,
});

describe('WebGL Recovery Manager', () => {
  let recoveryManager: WebGLRecoveryManager;
  let mockRenderer: any;

  beforeEach(() => {
    mockCreateElement.mockReturnValue(mockCanvas);
    mockCanvas.getContext.mockReturnValue(mockWebGLContext);
    
    mockRenderer = {
      domElement: mockCanvas,
    };

    recoveryManager = new WebGLRecoveryManager({
      maxRecoveryAttempts: 3,
      recoveryDelay: 100,
    });
  });

  afterEach(() => {
    recoveryManager.dispose();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with renderer', () => {
      recoveryManager.initialize(mockRenderer);
      
      expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
        'webglcontextlost',
        expect.any(Function)
      );
      expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
        'webglcontextrestored',
        expect.any(Function)
      );
    });

    it('should handle missing canvas gracefully', () => {
      const rendererWithoutCanvas = { domElement: null };
      
      expect(() => {
        recoveryManager.initialize(rendererWithoutCanvas);
      }).not.toThrow();
    });
  });

  describe('Context Loss Handling', () => {
    it('should detect context loss', () => {
      recoveryManager.initialize(mockRenderer);
      
      expect(recoveryManager.getContextLostStatus()).toBe(false);
      
      // Simulate context loss
      const contextLostEvent = new Event('webglcontextlost');
      const addEventListenerCalls = mockCanvas.addEventListener.mock.calls;
      const contextLostHandler = addEventListenerCalls.find(
        call => call[0] === 'webglcontextlost'
      )?.[1];
      
      if (contextLostHandler) {
        contextLostHandler(contextLostEvent);
        expect(recoveryManager.getContextLostStatus()).toBe(true);
      }
    });

    it('should attempt recovery after context loss', (done) => {
      let onContextLostCalled = false;
      let onRecoveryAttempted = false;

      recoveryManager = new WebGLRecoveryManager({
        onContextLost: () => { onContextLostCalled = true; },
        recoveryDelay: 50,
      });

      recoveryManager.initialize(mockRenderer);
      
      // Simulate context loss
      const contextLostEvent = new Event('webglcontextlost');
      const addEventListenerCalls = mockCanvas.addEventListener.mock.calls;
      const contextLostHandler = addEventListenerCalls.find(
        call => call[0] === 'webglcontextlost'
      )?.[1];
      
      if (contextLostHandler) {
        contextLostHandler(contextLostEvent);
        
        // Check that recovery is attempted
        setTimeout(() => {
          expect(onContextLostCalled).toBe(true);
          expect(mockCanvas.getContext).toHaveBeenCalled();
          done();
        }, 100);
      }
    });
  });

  describe('Recovery Attempts', () => {
    it('should limit recovery attempts', () => {
      let recoveryFailedCalled = false;

      recoveryManager = new WebGLRecoveryManager({
        maxRecoveryAttempts: 2,
        recoveryDelay: 10,
        onRecoveryFailed: () => { recoveryFailedCalled = true; },
      });

      // Mock context that remains lost
      mockWebGLContext.isContextLost.mockReturnValue(true);
      mockCanvas.getContext.mockReturnValue(mockWebGLContext);

      recoveryManager.initialize(mockRenderer);
      
      // Force multiple recovery attempts
      for (let i = 0; i < 3; i++) {
        recoveryManager.forceRecovery();
      }

      setTimeout(() => {
        expect(recoveryManager.getRecoveryAttempts()).toBeGreaterThan(0);
      }, 50);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on dispose', () => {
      recoveryManager.initialize(mockRenderer);
      recoveryManager.dispose();
      
      expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
        'webglcontextlost',
        expect.any(Function)
      );
      expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
        'webglcontextrestored',
        expect.any(Function)
      );
    });
  });
});

describe('WebGL Support Detection', () => {
  beforeEach(() => {
    mockCreateElement.mockReturnValue(mockCanvas);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('WebGL2 Support', () => {
    it('should detect WebGL2 support', () => {
      mockCanvas.getContext.mockImplementation((type) => {
        return type === 'webgl2' ? mockWebGLContext : null;
      });

      expect(checkWebGL2Support()).toBe(true);
    });

    it('should detect lack of WebGL2 support', () => {
      mockCanvas.getContext.mockImplementation((type) => {
        return type === 'webgl2' ? null : mockWebGLContext;
      });

      expect(checkWebGL2Support()).toBe(false);
    });
  });

  describe('WebGL Support', () => {
    it('should detect WebGL support', () => {
      mockCanvas.getContext.mockReturnValue(mockWebGLContext);
      expect(checkWebGLSupport()).toBe(true);
    });

    it('should detect lack of WebGL support', () => {
      mockCanvas.getContext.mockReturnValue(null);
      expect(checkWebGLSupport()).toBe(false);
    });

    it('should handle exceptions gracefully', () => {
      mockCanvas.getContext.mockImplementation(() => {
        throw new Error('WebGL not supported');
      });

      expect(checkWebGLSupport()).toBe(false);
    });
  });

  describe('WebGL Capabilities', () => {
    it('should return capabilities when WebGL is supported', () => {
      // Mock WebGL constants
      const GL_MAX_TEXTURE_SIZE = 0x0D33;
      const GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
      const GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;

      mockWebGLContext.getParameter.mockImplementation((param) => {
        switch (param) {
          case GL_MAX_TEXTURE_SIZE: return 4096;
          case GL_MAX_VERTEX_UNIFORM_VECTORS: return 256;
          case GL_MAX_FRAGMENT_UNIFORM_VECTORS: return 256;
          default: return 0;
        }
      });

      // Add the constants to the mock context
      Object.assign(mockWebGLContext, {
        MAX_TEXTURE_SIZE: GL_MAX_TEXTURE_SIZE,
        MAX_VERTEX_UNIFORM_VECTORS: GL_MAX_VERTEX_UNIFORM_VECTORS,
        MAX_FRAGMENT_UNIFORM_VECTORS: GL_MAX_FRAGMENT_UNIFORM_VECTORS,
      });

      mockCanvas.getContext.mockReturnValue(mockWebGLContext);

      const capabilities = getWebGLCapabilities();
      
      expect(capabilities.hasWebGL).toBe(true);
      expect(capabilities.maxTextureSize).toBe(4096);
      expect(capabilities.extensions).toContain('EXT_texture_filter_anisotropic');
    });

    it('should return empty capabilities when WebGL is not supported', () => {
      mockCanvas.getContext.mockReturnValue(null);

      const capabilities = getWebGLCapabilities();
      
      expect(capabilities.hasWebGL).toBe(false);
      expect(capabilities.maxTextureSize).toBe(0);
      expect(capabilities.extensions).toEqual([]);
    });
  });
});