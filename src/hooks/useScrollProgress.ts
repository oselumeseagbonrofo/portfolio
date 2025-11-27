/**
 * Hook to track scroll progress as a 0-1 value
 * Useful for scroll-based animations and effects
 */

import { useState, useEffect } from 'react';

export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Calculate scroll progress (0 to 1)
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollProgress;
}
