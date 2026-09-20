import React, { ReactNode, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { usePrefersReducedMotion, EASING } from '../../utils/motion';

export interface TactileCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  elevateOnHover?: boolean;
  glowOnHover?: boolean;
  id?: string;
  onClick?: () => void;
}

export const TactileCard = forwardRef<HTMLDivElement, TactileCardProps>(({
  children,
  className = '',
  elevateOnHover = true,
  glowOnHover = false,
  id,
  onClick,
  ...props
}, ref) => {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div 
        ref={ref} 
        id={id} 
        className={className} 
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      onClick={onClick}
      whileHover={elevateOnHover ? { 
        y: -4, 
        scale: 1.01,
        transition: { duration: 0.22, ease: EASING.outExpo } 
      } : undefined}
      whileTap={onClick ? { 
        scale: 0.98, 
        y: 1,
        transition: { duration: 0.08 } 
      } : undefined}
      className={`relative will-change-transform ${glowOnHover ? 'hover:border-[#D6B46A]/60 hover:shadow-[0_12px_32px_rgba(214,180,106,0.18)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
});

TactileCard.displayName = 'TactileCard';
