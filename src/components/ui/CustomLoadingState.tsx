import React from 'react';
import { Loader2 } from 'lucide-react';

export interface CustomLoadingStateProps {
  title?: string;
  stage?: string;
  subtext?: string;
  variant?: 'spinner' | 'shimmer' | 'card';
  className?: string;
}

export default function CustomLoadingState({
  title = 'Processing Operation',
  stage,
  subtext = 'Please wait while calculations finish...',
  variant = 'spinner',
  className = ''
}: CustomLoadingStateProps) {
  if (variant === 'shimmer') {
    return (
      <div className={`p-6 rounded-2xl border border-[#D6B46A]/20 bg-[#FFFDF8] space-y-4 animate-pulse ${className}`}>
        <div className="h-5 bg-[#D6B46A]/15 rounded-lg w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200/80 rounded w-full" />
          <div className="h-4 bg-neutral-200/80 rounded w-5/6" />
          <div className="h-4 bg-neutral-200/80 rounded w-2/3" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-8 bg-[#D6B46A]/20 rounded-xl w-24" />
          <div className="h-8 bg-neutral-200/80 rounded-xl w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border border-[#D6B46A]/25 bg-[#FFFDF8] shadow-sm flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Luxury Dual-Ring Gold Spinner */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-[#D6B46A]/20 animate-ping opacity-40" />
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#D6B46A] border-r-[#111111] animate-spin" />
        <Loader2 className="w-5 h-5 text-[#D6B46A] absolute" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h4 className="font-display text-sm sm:text-base font-bold text-[#111111] uppercase tracking-wider">
          {title}
        </h4>
        {stage && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111] text-[#D6B46A] rounded-full text-[10.5px] font-mono font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] animate-pulse" />
            <span>{stage}</span>
          </div>
        )}
        <p className="text-xs text-[#8A8178] leading-relaxed">
          {subtext}
        </p>
      </div>
    </div>
  );
}
