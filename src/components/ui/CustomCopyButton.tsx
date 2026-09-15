import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CustomCopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon-only';
  onCopied?: () => void;
}

export default function CustomCopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  variant = 'secondary',
  onCopied
}: CustomCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          copied 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border border-neutral-200'
        } ${className}`}
        title={copied ? copiedLabel : label}
        aria-label={copied ? copiedLabel : label}
      >
        {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    );
  }

  const baseStyle = "px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2";
  const variantStyles = {
    primary: copied
      ? 'bg-emerald-600 text-white'
      : 'bg-[#111111] hover:bg-[#222222] text-[#D6B46A] shadow-md',
    secondary: copied
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
      : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 shadow-xs',
    ghost: copied
      ? 'text-emerald-600 bg-emerald-50/50'
      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
    'icon-only': ''
  }[variant];

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${baseStyle} ${variantStyles} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-neutral-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
