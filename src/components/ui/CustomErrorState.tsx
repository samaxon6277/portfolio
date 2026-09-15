import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';

export interface CustomErrorStateProps {
  title: string;
  whatWentWrong: string;
  whyItMatters: string;
  howToFix: string;
  technicalDetails?: string;
  onRetry?: () => void;
  onReset?: () => void;
  actionText?: string;
  className?: string;
}

export default function CustomErrorState({
  title,
  whatWentWrong,
  whyItMatters,
  howToFix,
  technicalDetails,
  onRetry,
  onReset,
  actionText = 'Try Again',
  className = ''
}: CustomErrorStateProps) {
  return (
    <div className={`p-6 sm:p-8 rounded-2xl border border-rose-200 bg-rose-50/40 text-left space-y-4 shadow-sm animate-fade-in ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-base font-bold text-rose-950">
            {title}
          </h4>
          <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
            {whatWentWrong}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-white border border-rose-100/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Why this matters</span>
          </div>
          <p className="text-[11.5px] text-neutral-600 leading-relaxed">
            {whyItMatters}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-rose-100/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
            <span>How to resolve</span>
          </div>
          <p className="text-[11.5px] text-neutral-600 leading-relaxed">
            {howToFix}
          </p>
        </div>
      </div>

      {technicalDetails && (
        <details className="text-[11px] text-neutral-500 bg-white/80 p-2.5 rounded-lg border border-neutral-200/80 cursor-pointer">
          <summary className="font-mono font-medium text-neutral-700 select-none">
            Technical diagnostic details
          </summary>
          <pre className="mt-2 p-2 bg-neutral-900 text-neutral-200 font-mono text-[10px] rounded overflow-x-auto whitespace-pre-wrap">
            {technicalDetails}
          </pre>
        </details>
      )}

      {(onRetry || onReset) && (
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{actionText}</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Reset & Start Over</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
