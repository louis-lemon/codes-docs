'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Returns true on server and when reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation variants based on reduced motion preference
 */
export function getMotionVariants<T extends object>(
  animated: T,
  reduced: T,
  prefersReducedMotion: boolean
): T {
  return prefersReducedMotion ? reduced : animated;
}

/**
 * Standard reduced motion variants for common animations
 */
export const reducedMotionVariants = {
  fadeIn: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
  },
  scale: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1 },
  },
};
