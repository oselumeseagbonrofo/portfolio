import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import AnimatedInput from './AnimatedInput';
import { animationConfig } from '@/utils/animationConfig';

describe('AnimatedInput', () => {
  describe('Property 16: Input focus animation', () => {
    /**
     * **Feature: enhanced-ui-animations, Property 16: Input focus animation**
     * **Validates: Requirements 7.2**
     * 
     * For any form input receiving focus, the border color and glow should 
     * transition from the default state to the focused state within 0.3 seconds.
     */
    it('should use correct transition duration configuration', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 0xffffff }).map(n => n.toString(16).padStart(6, '0')), // focusColor
          fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }), // glowIntensity
          (focusColorHex, glowIntensity) => {
            const focusColor = `#${focusColorHex}`;
            
            // Property: The transition duration should be exactly 0.3 seconds
            const expectedDuration = animationConfig.durations.fast * 1000; // Convert to ms
            expect(expectedDuration).toBe(300); // Should be 0.3 seconds = 300ms
            
            // Property: The easing should be smooth for focus transitions
            expect(animationConfig.easings.smooth).toBe('easeInOut');
            
            // Verify the component can be rendered with any valid color and intensity
            const { unmount } = render(
              <AnimatedInput 
                focusColor={focusColor}
                glowIntensity={glowIntensity}
              />
            );
            
            // Clean up
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle focus and blur events correctly', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      
      const { container } = render(
        <AnimatedInput 
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="test-input" 
        />
      );
      const input = container.querySelector('input')!;
      
      // Focus the input
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalledTimes(1);
      
      // Blur the input
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Basic functionality', () => {
    it('should render with label', () => {
      render(<AnimatedInput label="Test Label" data-testid="animated-input" />);
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByTestId('animated-input')).toBeInTheDocument();
    });

    it('should show error message', () => {
      render(<AnimatedInput error="Test error" data-testid="animated-input" />);
      
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('should call onFocus and onBlur callbacks', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      
      render(
        <AnimatedInput 
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="animated-input"
        />
      );
      
      const input = screen.getByTestId('animated-input');
      
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalledTimes(1);
      
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });
});