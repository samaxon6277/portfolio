import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Tactile Copy Button with micro-spring compression and instant visual confirmation
 */
interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  variant = 'secondary',
  size = 'md'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-mono font-bold rounded-xl transition-all cursor-pointer select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B46A]';
  
  const sizeStyles = size === 'sm' 
    ? 'text-xs px-2.5 py-1.5 gap-1.5' 
    : 'text-xs px-3.5 py-2 gap-2';

  const variantStyles = {
    primary: copied 
      ? 'bg-emerald-700 text-white' 
      : 'bg-[#111111] hover:bg-[#262626] text-[#D6B46A]',
    secondary: copied
      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
      : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300',
    subtle: copied
      ? 'text-emerald-700 bg-emerald-50'
      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
  }[variant];

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-1.5"
          >
            <Check className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
            <span>{copiedLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-1.5"
          >
            <Copy className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span>{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

/**
 * High-Performance Code Output Panel with language tag, line numbers, and copy action
 */
interface CodeOutputPanelProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
  className?: string;
}

export const CodeOutputPanel: React.FC<CodeOutputPanelProps> = ({
  code,
  language = 'css',
  title,
  maxHeight = 'max-h-72',
  className = ''
}) => {
  return (
    <div className={`rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-md flex flex-col font-mono text-xs ${className}`}>
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#D6B46A]" />
          <span className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
            {title || `${language.toUpperCase()} Output`}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 text-[9px]">
            {language}
          </span>
        </div>
        <CopyButton textToCopy={code} size="sm" variant="secondary" />
      </div>

      {/* Code viewport */}
      <div className={`p-4 overflow-x-auto overflow-y-auto text-neutral-200 leading-relaxed ${maxHeight} selection:bg-[#D6B46A]/30 selection:text-white`}>
        <pre className="font-mono text-xs whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

/**
 * Tactile Segmented Control (Radio-like tabs)
 */
interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function ToolSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className = ''
}: SegmentedControlProps<T>) {
  return (
    <div className={`inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/80 ${className}`}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative flex items-center justify-center gap-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
            } ${
              isSelected 
                ? 'bg-white text-[#111111] shadow-xs' 
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Tactile Instrument Slider
 */
interface ToolSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
}

export const ToolSlider: React.FC<ToolSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-700 font-medium">{label}</span>
        <span className="font-bold text-[#111111] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#D6B46A]"
      />
    </div>
  );
};

/**
 * Result Status Indicator Badge
 */
export const StatusBadge: React.FC<{
  status: 'ready' | 'processing' | 'verified' | 'error' | 'copied';
  label?: string;
}> = ({ status, label }) => {
  const configs = {
    ready: { bg: 'bg-emerald-50 border-emerald-300 text-emerald-800', dot: 'bg-emerald-500', defaultLabel: 'Ready' },
    processing: { bg: 'bg-amber-50 border-amber-300 text-amber-800', dot: 'bg-amber-500 animate-spin', defaultLabel: 'Processing' },
    verified: { bg: 'bg-sky-50 border-sky-300 text-sky-800', dot: 'bg-sky-500', defaultLabel: 'Verified' },
    error: { bg: 'bg-rose-50 border-rose-300 text-rose-800', dot: 'bg-rose-500', defaultLabel: 'Invalid' },
    copied: { bg: 'bg-emerald-50 border-emerald-400 text-emerald-900', dot: 'bg-emerald-600', defaultLabel: 'Copied' },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold ${configs.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${configs.dot}`} />
      <span>{label || configs.defaultLabel}</span>
    </span>
  );
};
