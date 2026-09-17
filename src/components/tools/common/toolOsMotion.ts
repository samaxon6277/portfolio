/**
 * SAMAXON TOOL OS — MOTION SYSTEM & DESIGN TOKENS
 * 
 * Strict performance-calibrated motion presets using GPU-friendly properties
 * (opacity, transform) with full `prefers-reduced-motion` compliance.
 */

import { useState, useEffect } from 'react';
import type { Transition, Variants } from 'motion/react';

// Motion Durations (ms)
export const DURATION = {
  micro: 0.12,     // 120ms - hover, tap, icon toggles
  standard: 0.22,  // 220ms - dropdowns, cards, tab switches
  emphasis: 0.38,  // 380ms - modals, command palette, panel transitions
  cinematic: 0.65, // 650ms - hero reveals, initial entry
} as const;

// Easing Curves (Cubic-Bezier)
export const EASING = {
  // Professional smooth instrument decelerations
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOutSine: [0.37, 0, 0.63, 1],
  springTactile: { type: 'spring', stiffness: 400, damping: 28 },
  springSnappy: { type: 'spring', stiffness: 520, damping: 32 },
  springGentle: { type: 'spring', stiffness: 260, damping: 24 },
} as const;

// Reusable Transitions
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
    ease: EASING.outExpo,
  } as Transition,
  springPress: EASING.springSnappy as Transition,
  springTactile: EASING.springTactile as Transition,
};

// Accessible Reduced-Motion Hook
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

// Motion Animation Variants
export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: TRANSITIONS.standard },
    exit: { opacity: 0, transition: TRANSITIONS.micro },
  } as Variants,

  fadeUp: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: TRANSITIONS.standard },
    exit: { opacity: 0, y: -8, transition: TRANSITIONS.micro },
  } as Variants,

  fadeScale: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: TRANSITIONS.standard },
    exit: { opacity: 0, scale: 0.98, transition: TRANSITIONS.micro },
  } as Variants,

  cardHover: {
    rest: { y: 0, transition: TRANSITIONS.standard },
    hover: { y: -3, transition: TRANSITIONS.standard },
  } as Variants,

  commandPalette: {
    hidden: { opacity: 0, scale: 0.98, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: DURATION.standard, ease: EASING.outExpo } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: -8, 
      transition: { duration: DURATION.micro, ease: 'easeIn' } 
    },
  } as Variants,

  resultPulse: {
    idle: { scale: 1 },
    success: { 
      scale: [1, 1.03, 1], 
      transition: { duration: 0.3, ease: 'easeInOut' } 
    },
    error: { 
      x: [0, -4, 4, -4, 4, 0], 
      transition: { duration: 0.35, ease: 'easeInOut' } 
    }
  } as Variants,
};
