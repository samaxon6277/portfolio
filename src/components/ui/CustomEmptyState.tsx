import React from 'react';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export interface CustomEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export default function CustomEmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = ''
}: CustomEmptyStateProps) {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border border-[#D6B46A]/20 bg-[#FFFDF8] shadow-sm flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/30 flex items-center justify-center shadow-md">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>

      <div className="max-w-md space-y-1.5">
        <h4 className="font-display text-base font-bold text-[#111111]">
          {title}
        </h4>
        <p className="text-xs text-[#8A8178] leading-relaxed">
          {description}
        </p>
      </div>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionText && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="px-5 py-2.5 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{secondaryActionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
