import React, { useState, useRef, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface LiquidButtonProps {
  children: ReactNode;
  variant?: 'gold' | 'glass' | 'outline' | 'dark' | 'emerald' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  icon?: ReactNode;
  title?: string;
}

export default function LiquidButton({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  onClick,
  to,
  href,
  target,
  rel,
  disabled = false,
  type = 'button',
  id,
  icon,
  title,
}: LiquidButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [coords, setCoords] = useState<{ x: number; y: number; isHovered: boolean }>({
    x: 50,
    y: 50,
    isHovered: false,
  });
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  // Size styles
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-[11px] gap-1.5 rounded-full',
    md: 'px-5 py-2.5 text-xs gap-2 rounded-full',
    lg: 'px-7 py-3.5 text-sm gap-2.5 rounded-full',
  }[size];

  // Variant styles with liquid glass multi-layer depth & specular highlights
  const variantClasses = {
    gold: `
      bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] 
      text-[#0A0A0A] font-bold 
      shadow-[0_6px_22px_rgba(214,180,106,0.38),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(0,0,0,0.18)]
      hover:shadow-[0_10px_30px_rgba(214,180,106,0.55),inset_0_1.5px_2.5px_rgba(255,255,255,1)]
      border border-white/60
    `,
    glass: `
      bg-gradient-to-b from-white/75 via-white/40 to-white/60 
      text-[#1D1D1F] font-bold 
      backdrop-blur-2xl backdrop-saturate-180 
      shadow-[0_6px_22px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(255,255,255,0.4)]
      border border-white/85
      hover:border-[#D6B46A]/80
      hover:shadow-[0_10px_32px_rgba(0,0,0,0.08),inset_0_1.5px_2px_rgba(255,255,255,1),0_0_16px_rgba(214,180,106,0.2)]
    `,
    outline: `
      bg-white/20 
      text-[#1D1D1F] font-semibold 
      backdrop-blur-lg
      border border-white/70 
      hover:border-[#D6B46A]
      hover:bg-white/40
      shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.02)]
    `,
    dark: `
      bg-gradient-to-b from-[#2A2A2E]/90 to-[#121214]/90 
      text-white font-bold 
      backdrop-blur-xl
      shadow-[0_6px_22px_rgba(0,0,0,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.3)]
      hover:shadow-[0_10px_30px_rgba(0,0,0,0.45),inset_0_1.5px_2.5px_rgba(255,255,255,0.5)]
      border border-white/15
    `,
    emerald: `
      bg-gradient-to-b from-[#34E876] to-[#1EBA54] 
      text-white font-bold 
      shadow-[0_6px_22px_rgba(37,211,102,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.85)]
      hover:shadow-[0_10px_30px_rgba(37,211,102,0.5),inset_0_1.5px_2.5px_rgba(255,255,255,0.95)]
      border border-white/40
    `,
    ghost: `
      bg-transparent text-[#6E6E73] 
      hover:text-[#1D1D1F] 
      hover:bg-white/40
      hover:backdrop-blur-md
    `,
  }[variant];

  const handlePointerMove = (e: MouseEvent<HTMLElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y, isHovered: true });
  };

  const handlePointerLeave = () => {
    setCoords((prev) => ({ ...prev, isHovered: false }));
  };

  const handlePointerDown = (e: MouseEvent<HTMLElement>) => {
    if (disabled || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev.slice(-4), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 700);
  };

  const content = (
    <>
      {/* Curved Convex Meniscus Glass Gloss Layer */}
      <span 
        className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none rounded-t-full bg-gradient-to-b from-white/50 via-white/15 to-transparent opacity-90" 
        aria-hidden="true" 
      />

      {/* Specular Liquid Light Sheen Following Cursor */}
      {coords.isHovered && !disabled && (
        <span
          className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300 opacity-70 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 90px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.9), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Physics-based Liquid Ripples */}
      <span className="absolute inset-0 overflow-hidden pointer-events-none rounded-full" aria-hidden="true">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none animate-liquid-ripple"
            style={{
              top: ripple.y - ripple.size / 2,
              left: ripple.x - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              background:
                variant === 'gold'
                  ? 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)'
                  : variant === 'emerald'
                  ? 'radial-gradient(circle, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.15) 40%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(214, 180, 106, 0.35) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)',
            }}
          />
        ))}
      </span>

      {/* Label and Icon Content */}
      <span className="relative z-10 flex items-center gap-2 justify-center leading-none">
        {children}
        {icon && <span className="shrink-0">{icon}</span>}
      </span>
    </>
  );

  const sharedMotionProps = {
    whileHover: disabled ? {} : { scale: 1.025, y: -1 },
    whileTap: disabled ? {} : { scale: 0.96, y: 1 },
    transition: { type: 'spring', stiffness: 500, damping: 28 },
  };

  const combinedClasses = `
    relative inline-flex items-center justify-center 
    uppercase font-mono tracking-wider select-none 
    overflow-hidden transition-colors duration-200 cursor-pointer
    ${sizeClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}
  `.trim();

  if (to && !disabled) {
    return (
      <motion.div {...sharedMotionProps} className="inline-block">
        <Link
          to={to}
          id={id}
          title={title}
          ref={btnRef as any}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          onMouseDown={handlePointerDown}
          onClick={onClick as any}
          className={combinedClasses}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href && !disabled) {
    return (
      <motion.div {...sharedMotionProps} className="inline-block">
        <a
          href={href}
          id={id}
          title={title}
          target={target}
          rel={rel}
          ref={btnRef as any}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          onMouseDown={handlePointerDown}
          onClick={onClick as any}
          className={combinedClasses}
        >
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...sharedMotionProps}
      type={type}
      id={id}
      title={title}
      disabled={disabled}
      ref={btnRef as any}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onMouseDown={handlePointerDown}
      onClick={onClick}
      className={combinedClasses}
    >
      {content}
    </motion.button>
  );
}
