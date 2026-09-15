import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface FormFieldProps {
  id?: string;
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  charCount?: { current: number; max: number };
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  id,
  label,
  description,
  required,
  error,
  success,
  hint,
  charCount,
  children,
  className = ''
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 text-left ${className}`} id={id ? `${id}-container` : undefined}>
      {(label || charCount) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={id}
              className="block text-xs font-bold text-[#111111] uppercase tracking-wider select-none"
            >
              {label}
              {required && <span className="text-[#D6B46A] ml-1" title="Required field">*</span>}
            </label>
          )}

          {charCount && (
            <span className={`text-[10px] font-mono select-none ${
              charCount.current > charCount.max ? 'text-rose-500 font-bold' : 'text-[#8A8178]'
            }`}>
              {charCount.current}/{charCount.max}
            </span>
          )}
        </div>
      )}

      {description && (
        <p className="text-[11px] text-[#8A8178] leading-relaxed font-normal">
          {description}
        </p>
      )}

      <div className="relative">
        {children}
      </div>

      {error ? (
        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1.5 animate-fade-in" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : success ? (
        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{success}</span>
        </p>
      ) : hint ? (
        <p className="text-[10.5px] text-[#8A8178]/80 font-mono">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
