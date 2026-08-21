import { useState, useRef, MouseEvent, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface LiquidGlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  variant?: 'sheet' | 'elevated' | 'pill' | 'subtle' | 'gold' | 'water';
  interactive?: boolean;
  tilt?: boolean;
  glow?: boolean;
}

export default function LiquidGlassPanel({
  children,
  className = '',
  variant = 'sheet',
  interactive = false,
  tilt = false,
  glow = true,
  ...props
}: LiquidGlassPanelProps) {
  const [coords, setCoords] = useState<{ x: number; y: number; isHovered: boolean }>({
    x: 50,
    y: 50,
    isHovered: false,
  });
  const [tiltAngles, setTiltAngles] = useState({ rx: 0, ry: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y, isHovered: true });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const rx = ((py - centerY) / centerY) * -3;
      const ry = ((px - centerX) / centerX) * 3;
      setTiltAngles({ rx, ry });
    }
  };

  const handlePointerLeave = () => {
    setCoords((prev) => ({ ...prev, isHovered: false }));
    if (tilt) {
      setTiltAngles({ rx: 0, ry: 0 });
    }
  };

  const variantClasses = {
    sheet: `
      bg-gradient-to-br from-white/75 via-white/45 to-white/65 
      backdrop-blur-2xl backdrop-saturate-180 
      border border-white/80 
      shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.98),inset_0_-1.5px_2px_rgba(255,255,255,0.4)]
    `,
    water: `
      bg-gradient-to-br from-white/80 via-white/35 to-white/60 
      backdrop-blur-3xl backdrop-saturate-200 
      border border-white/90 
      shadow-[0_24px_60px_-12px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.03),inset_0_1.5px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(255,255,255,0.45)]
    `,
    elevated: `
      bg-gradient-to-br from-white/85 via-white/55 to-white/75 
      backdrop-blur-3xl backdrop-saturate-190 
      border border-white/90 
      shadow-[0_28px_65px_-12px_rgba(0,0,0,0.08),0_6px_20px_rgba(0,0,0,0.03),inset_0_1.5px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(255,255,255,0.45)]
    `,
    pill: `
      bg-gradient-to-br from-white/82 via-white/50 to-white/70 
      backdrop-blur-2xl backdrop-saturate-180 
      rounded-full 
      border border-white/85 
      shadow-[0_8px_28px_-4px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.98),inset_0_-1px_1px_rgba(255,255,255,0.4)]
    `,
    subtle: `
      bg-gradient-to-br from-white/55 via-white/30 to-white/45 
      backdrop-blur-xl backdrop-saturate-150 
      border border-white/70 
      shadow-[0_8px_28px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,0.9)]
    `,
    gold: `
      bg-gradient-to-br from-[#FAF5E8]/85 via-[#F6EED8]/60 to-[#F2E5C4]/75 
      backdrop-blur-2xl backdrop-saturate-180 
      border border-[#D6B46A]/45 
      shadow-[0_16px_45px_rgba(214,180,106,0.18),0_4px_16px_rgba(214,180,106,0.08),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(214,180,106,0.25)]
    `,
  }[variant];

  return (
    <motion.div
      ref={panelRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      animate={
        tilt
          ? {
              rotateX: tiltAngles.rx,
              rotateY: tiltAngles.ry,
              transformPerspective: 1000,
            }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden transition-all duration-300 ${variantClasses} ${
        interactive ? 'hover:border-[#D6B46A]/60 hover:shadow-[0_24px_56px_rgba(0,0,0,0.08),0_4px_16px_rgba(214,180,106,0.12)]' : ''
      } ${className}`}
      {...props}
    >
      {/* Top Meniscus Convex Water Gloss Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-[inherit] bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-70"
        aria-hidden="true" 
      />

      {/* Specular Liquid Cursor Sheen */}
      {glow && coords.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-65 mix-blend-soft-light"
          style={{
            background: `radial-gradient(circle 280px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.9), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Layered Liquid Depth Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
