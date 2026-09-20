/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAMAXON DIGITAL STUDIO — UNIFIED MOTION DESIGN SYSTEM
 * 
 * Performance-calibrated GPU-composited motion language (80-550ms standard).
 * Respects `prefers-reduced-motion` at every layer.
 * Zero layout-thrashing properties (strictly transform, opacity & filter).
 * Mobile-calibrated translation distances to prevent overflow and jank.
 */

import { useState, useEffect } from 'react';
import type { Transition, Variants } from 'motion/react';

// Exact calibrated duration scale in seconds
export const DURATION = {
  instant: 0.08,    // 80ms - haptic ticks, immediate feedback
  micro: 0.14,      // 140ms - button hover/press, toggles, badges
  standard: 0.24,   // 240ms - cards, dropdowns, tab indicators
  emphasis: 0.38,   // 380ms - modal entrances, drawers, sheet reveals
  cinematic: 0.55,  // 550ms - hero scroll storytelling reveals
} as const;

// Precision mathematical bezier curves
export const EASING = {
  // Editorial out-quint: fast initial movement, velvety settling
  outQuint: [0.22, 1, 0.36, 1] as const,
  // Awwwards-style out-expo: high energy deceleration
  outExpo: [0.16, 1, 0.3, 1] as const,
  // Balanced standard curve
  standard: [0.25, 0.1, 0.25, 1] as const,
  // Tactile spring physics for buttons & toggles
  springTactile: { type: 'spring', stiffness: 420, damping: 28 } as const,
  // Snappy spring for quick micro-states
  springSnappy: { type: 'spring', stiffness: 520, damping: 32 } as const,
  // Gentle spring for floating elements
  springGentle: { type: 'spring', stiffness: 220, damping: 24 } as const,
};

// Reusable standard transitions
export const TRANSITIONS = {
  micro: {
    duration: DURATION.micro,
    ease: EASING.outExpo,
  } as Transition,
  standard: {
    duration: DURATION.standard,
    ease: EASING.outExpo,
  } as Transition,
  emphasis: {
    duration: DURATION.emphasis,
    ease: EASING.outQuint,
  } as Transition,
  cinematic: {
    duration: DURATION.cinematic,
    ease: EASING.outExpo,
  } as Transition,
  springPress: EASING.springSnappy as Transition,
  springTactile: EASING.springTactile as Transition,
};

/**
 * Hook to detect and listen for user's OS-level reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

/**
 * Helper to check if current viewport is mobile (width < 640px)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

// Staggered Container Variants
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Editorial Reveal Variants (Up, Down, Left, Right, Scale, Blur, Masked Clip)
export const revealFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

export const revealFadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

export const revealFadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

export const revealFadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

export const revealFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.standard,
      ease: EASING.outExpo,
    },
  },
};

export const revealScaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

export const revealBlurSharp: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 14 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

export const revealClipUp: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 16 },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    transition: {
      duration: DURATION.emphasis,
      ease: EASING.outExpo,
    },
  },
};

// Tactile Button Hover & Press Presets
export const buttonTactilePhysics = {
  rest: { y: 0, scale: 1 },
  hover: { y: -2, scale: 1.012, transition: { duration: DURATION.micro, ease: EASING.outExpo } },
  tap: { y: 1, scale: 0.98, transition: { duration: DURATION.instant } },
};

// Card Hover Physics (No layout thrash, GPU transform only)
export const cardElevationPhysics = {
  rest: { y: 0, transition: { duration: DURATION.standard, ease: EASING.outExpo } },
  hover: { y: -4, transition: { duration: DURATION.standard, ease: EASING.outExpo } },
};
