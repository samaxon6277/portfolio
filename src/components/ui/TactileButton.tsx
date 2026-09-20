import React, { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion, EASING } from '../../utils/motion';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  id?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#111111] text-[#F8F4EE] hover:text-[#D6B46A] border border-[#D6B46A]/35 shadow-[0_4px_16px_rgba(17,17,17,0.12)] hover:border-[#D6B46A] hover:shadow-[0_8px_24px_rgba(214,180,106,0.25)]',
  gold: 'bg-[#D6B46A] text-[#111111] font-bold border border-[#BFA15A] shadow-[0_4px_16px_rgba(214,180,106,0.32)] hover:bg-[#BFA15A] hover:shadow-[0_8px_24px_rgba(214,180,106,0.45)]',
  secondary: 'bg-[#FFFDF8]/85 text-[#111111] border border-[#D6B46A]/25 backdrop-blur-md shadow-xs hover:border-[#D6B46A]/60 hover:bg-white',
  outline: 'bg-transparent text-[#111111] border border-[#D6B46A]/40 hover:bg-[#D6B46A]/10 hover:border-[#D6B46A]',
  ghost: 'bg-transparent text-[#4A443E] hover:text-[#111111] hover:bg-[#111111]/5 border border-transparent',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300'
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-4 py-2 text-xs rounded-xl gap-1.5 font-semibold',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-bold',
  lg: 'px-6 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl gap-2.5 font-bold tracking-wide'
};

export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  disabled = false,
  id,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const prefersReduced = usePrefersReducedMotion();

  const baseClasses = `
    inline-flex items-center justify-center select-none cursor-pointer
    transition-colors duration-200 text-center font-sans uppercase tracking-wider
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B46A] focus-visible:ring-offset-2
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="shrink-0 transition-transform duration-200">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
      )}
    </>
  );

  // Link behavior
  if (to && !disabled) {
    return (
      <Link to={to} id={id} className={`group ${baseClasses}`}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} id={id} className={`group ${baseClasses}`} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  if (prefersReduced || disabled) {
    return (
      <button
        ref={ref}
        type={type}
        id={id}
        disabled={disabled}
        onClick={onClick}
        className={`group ${baseClasses}`}
        {...props}
      >
        {content}
      </button>
    );
  }

  // Tactile animated button
  return (
    <motion.button
      ref={ref}
      type={type}
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={`group ${baseClasses}`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ y: 1, scale: 0.98 }}
      transition={EASING.springTactile}
      {...(props as any)}
    >
      {content}
    </motion.button>
  );
});

TactileButton.displayName = 'TactileButton';
