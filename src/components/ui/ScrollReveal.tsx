import React, { ReactNode, useMemo } from 'react';
import { motion, Variants } from 'motion/react';
import { usePrefersReducedMotion, useIsMobile, DURATION, EASING } from '../../utils/motion';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'clip' | 'none';

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  scale?: boolean;
  once?: boolean;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = DURATION.emphasis,
  distance,
  threshold = 0.08,
  scale = false,
  once = true,
  id
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Compute mobile-calibrated motion distance
  // On mobile (<640px), limit travel distance to avoid horizontal scrollbar leaks or visual jitter
  const travelDistance = useMemo(() => {
    if (distance !== undefined) {
      return isMobile ? Math.min(distance, 20) : distance;
    }
    if (direction === 'left' || direction === 'right') {
      return isMobile ? 18 : 32;
    }
    return isMobile ? 18 : 28;
  }, [distance, direction, isMobile]);

  if (prefersReduced || direction === 'none') {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const getInitialProps = () => {
    const base: Record<string, any> = { opacity: 0 };
    if (scale) base.scale = 0.94;

    switch (direction) {
      case 'up':
        base.y = travelDistance;
        break;
      case 'down':
        base.y = -travelDistance;
        break;
      case 'left':
        base.x = -travelDistance;
        break;
      case 'right':
        base.x = travelDistance;
        break;
      case 'scale':
        base.scale = isMobile ? 0.95 : 0.92;
        break;
      case 'blur':
        base.filter = 'blur(8px)';
        base.y = travelDistance * 0.5;
        break;
      case 'clip':
        base.clipPath = 'inset(100% 0% 0% 0%)';
        base.y = travelDistance * 0.5;
        break;
    }
    return base;
  };

  const getAnimateProps = () => {
    const base: Record<string, any> = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      clipPath: 'inset(0% 0% 0% 0%)',
    };
    return base;
  };

  const variants: Variants = {
    hidden: getInitialProps(),
    visible: {
      ...getAnimateProps(),
      transition: {
        duration,
        delay,
        ease: EASING.outExpo,
      },
    },
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount: isMobile ? 0.01 : (typeof threshold === 'number' ? threshold : 0.08),
        margin: '0px 0px -20px 0px',
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
