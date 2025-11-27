/**
 * Hook to track mouse position with normalization
 * Returns both absolute and normalized (-1 to 1) coordinates
 */

import { useState, useEffect, RefObject } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  normalized: {
    x: number;
    y: number;
  };
}

export function useMousePosition(ref?: RefObject<HTMLElement>): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalized: { x: 0, y: 0 },
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const target = ref?.current || document.documentElement;
      const rect = target.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Normalize to -1 to 1 range
      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = (y / rect.height) * 2 - 1;

      setMousePosition({
        x,
        y,
        normalized: {
          x: normalizedX,
          y: normalizedY,
        },
      });
    };

    const element = ref?.current || window;
    element.addEventListener('mousemove', handleMouseMove as EventListener);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
    };
  }, [ref]);

  return mousePosition;
}
