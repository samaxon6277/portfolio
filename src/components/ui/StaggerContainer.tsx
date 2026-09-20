import React, { ReactNode } from 'react';
import { motion, Variants } from 'motion/react';
import { usePrefersReducedMotion, useIsMobile, EASING } from '../../utils/motion';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  threshold?: number;
  once?: boolean;
  id?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
  initialDelay = 0,
  threshold = 0.08,
  once = true,
  id
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (prefersReduced) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? Math.min(staggerDelay, 0.05) : staggerDelay,
        delayChildren: initialDelay,
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
        amount: isMobile ? 0.01 : threshold,
        margin: '0px 0px -20px 0px',
      }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';
  distance?: number;
  id?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  direction = 'up',
  distance = 24,
  id
}) => {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
      scale: direction === 'scale' ? 0.94 : 1,
      filter: direction === 'blur' ? 'blur(6px)' : 'blur(0px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.38,
        ease: EASING.outExpo,
      },
    },
  };

  return (
    <motion.div id={id} className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};
