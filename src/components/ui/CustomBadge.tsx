import React from 'react';

export interface CustomBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'amber' | 'rose' | 'charcoal' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export default function CustomBadge({
  children,
  variant = 'gold',
  size = 'md',
  icon,
  className = ''
}: CustomBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300/80';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-300/80';
      case 'rose':
        return 'bg-rose-50 text-rose-800 border-rose-300/80';
      case 'charcoal':
        return 'bg-[#111111] text-[#D6B46A] border-[#D6B46A]/30';
      case 'neutral':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'gold':
      default:
        return 'bg-[#FAF6F0] text-[#85641C] border-[#D6B46A]/35';
    }
  };

  const getSizeStyles = () => {
    return size === 'sm'
      ? 'px-2 py-0.5 text-[9px]'
      : 'px-3 py-1 text-[10px]';
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider rounded-full border select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
