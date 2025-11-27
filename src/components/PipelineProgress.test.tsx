import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import PipelineProgress from './PipelineProgress';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useSpring: vi.fn(),
    useScroll: vi.fn(),
    motion: {
      div: 'div',
    },
  };
});

describe('PipelineProgress', () => {
  let mockUseSpring: any;
  let mockUseScroll: any;

  beforeEach(async () => {
    const { useSpring, useScroll } = await import('framer-motion');
    mockUseSpring = useSpring as any;
    mockUseScroll = useScroll as any;
    
    // Mock scroll progress value
    const mockScrollYProgress = { get: () => 0.5, set: vi.fn() };
    mockUseScroll.mockReturnValue({ scrollYProgress: mockScrollYProgress });
    
    // Mock spring value
    const mockSpringValue = { get: () => 0.5, set: vi.fn() };
    mockUseSpring.mockReturnValue(mockSpringValue);
    
    // Mock DOM methods
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 2000, writable: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Property 17: Progress indicator synchronization', () => {
    /**
     * **Feature: enhanced-ui-animations, Property 17: Progress indicator synchronization**
     * **Validates: Requirements 7.3**
     * 
     * For any scroll position p (0 to 1), the pipeline progress indicator should 
     * display progress value p with spring physics applied (no instant jumps).
     */
    it('should apply spring physics configuration correctly', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.0), max: Math.fround(1.0) }), // scroll progress
          (scrollProgress) => {
            // Mock the scroll progress value
            const mockScrollYProgress = { get: () => scrollProgress, set: vi.fn() };
            mockUseScroll.mockReturnValue({ scrollYProgress: mockScrollYProgress });
            
            render(<PipelineProgress />);
            
            // Property: useSpring should be called with the scroll progress value
            expect(mockUseSpring).toHaveBeenCalledWith(
              mockScrollYProgress,
              expect.objectContaining({
                stiffness: expect.any(Number),
                damping: expect.any(Number),
                restDelta: expect.any(Number),
              })
            );
            
            // Property: Spring configuration should prevent instant jumps
            const springConfig = mockUseSpring.mock.calls[0][1];
            expect(springConfig.stiffness).toBeGreaterThan(0);
            expect(springConfig.damping).toBeGreaterThan(0);
            expect(springConfig.restDelta).toBeGreaterThan(0);
            
            // Property: Spring should be applied to scroll progress, not raw values
            expect(mockUseSpring).toHaveBeenCalledWith(mockScrollYProgress, expect.any(Object));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use consistent spring physics parameters', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.0), max: Math.fround(1.0) }),
          fc.float({ min: Math.fround(0.0), max: Math.fround(1.0) }),
          (scrollProgress1, scrollProgress2) => {
            // Render component twice with different scroll values
            const mockScrollYProgress1 = { get: () => scrollProgress1, set: vi.fn() };
            mockUseScroll.mockReturnValue({ scrollYProgress: mockScrollYProgress1 });
            
            const { unmount: unmount1 } = render(<PipelineProgress />);
            const firstCall = mockUseSpring.mock.calls[mockUseSpring.mock.calls.length - 1];
            unmount1();
            
            const mockScrollYProgress2 = { get: () => scrollProgress2, set: vi.fn() };
            mockUseScroll.mockReturnValue({ scrollYProgress: mockScrollYProgress2 });
            
            const { unmount: unmount2 } = render(<PipelineProgress />);
            const secondCall = mockUseSpring.mock.calls[mockUseSpring.mock.calls.length - 1];
            unmount2();
            
            // Property: Spring configuration should be consistent regardless of scroll position
            expect(firstCall[1]).toEqual(secondCall[1]);
            
            // Property: The specific spring values should match expected configuration
            const config = firstCall[1];
            expect(config.stiffness).toBe(100);
            expect(config.damping).toBe(30);
            expect(config.restDelta).toBe(0.001);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Basic functionality', () => {
    it('should render without crashing', () => {
      const { container } = render(<PipelineProgress />);
      expect(container).toBeInTheDocument();
    });

    it('should call useScroll and useSpring hooks', () => {
      render(<PipelineProgress />);
      
      expect(mockUseScroll).toHaveBeenCalled();
      expect(mockUseSpring).toHaveBeenCalled();
    });
  });
});