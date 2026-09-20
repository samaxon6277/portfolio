import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, AlertTriangle, Loader2, Send } from 'lucide-react';
import { usePrefersReducedMotion, DURATION, EASING } from '../../utils/motion';

export type SendButtonState = 'idle' | 'processing' | 'success' | 'error';

export interface SendButtonProps {
  state: SendButtonState;
  onClick?: () => void;
  idleText?: string;
  processingText?: string;
  successText?: string;
  errorText?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SendButton: React.FC<SendButtonProps> = ({
  state,
  onClick,
  idleText = 'Send Inquiry & Launch Sprint',
  processingText = 'Transmitting Data...',
  successText = 'Inquiry Received · 48H Staging Queued',
  errorText = 'Transmission Failed · Click to Retry',
  type = 'submit',
  disabled = false,
  fullWidth = true,
  className = '',
  id = 'form-send-button',
  size = 'lg'
}) => {
  const prefersReduced = usePrefersReducedMotion();

  const isInteractive = state === 'idle' || state === 'error';
  const isDisabled = disabled || state === 'processing';

  // State-specific styling
  const getStateColors = () => {
    switch (state) {
      case 'processing':
        return 'bg-[#181614] text-[#D6B46A] border-[#D6B46A]/60 shadow-[0_4px_20px_rgba(214,180,106,0.25)]';
      case 'success':
        return 'bg-[#0E2416] text-[#6EE7B7] border-emerald-500/70 shadow-[0_4px_25px_rgba(16,185,129,0.3)]';
      case 'error':
        return 'bg-[#2B1113] text-[#FCA5A5] border-rose-500/80 shadow-[0_4px_20px_rgba(239,68,68,0.25)]';
      case 'idle':
      default:
        return 'bg-[#111111] text-[#F8F4EE] hover:text-[#D6B46A] border-[#D6B46A]/35 hover:border-[#D6B46A] shadow-[0_4px_16px_rgba(17,17,17,0.18)] hover:shadow-[0_8px_30px_rgba(214,180,106,0.3)]';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2.5 px-4 text-xs rounded-xl';
      case 'md':
        return 'py-3.5 px-5 text-sm rounded-xl';
      case 'lg':
      default:
        return 'py-4 sm:py-5 px-6 text-xs sm:text-sm rounded-2xl';
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'processing':
        return (
          <motion.span
            key="processing"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: DURATION.micro }}
            className="flex items-center justify-center gap-2.5"
          >
            <Loader2 className="w-5 h-5 animate-spin text-[#D6B46A]" />
            <span className="font-mono uppercase font-bold tracking-wider">{processingText}</span>
          </motion.span>
        );

      case 'success':
        return (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: DURATION.micro }}
            className="flex items-center justify-center gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-mono uppercase font-bold tracking-wider">{successText}</span>
          </motion.span>
        );

      case 'error':
        return (
          <motion.span
            key="error"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: [0, -4, 4, -2, 2, 0] }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: DURATION.standard }}
            className="flex items-center justify-center gap-2.5"
          >
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span className="font-mono uppercase font-bold tracking-wider">{errorText}</span>
          </motion.span>
        );

      case 'idle':
      default:
        return (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: DURATION.micro }}
            className="flex items-center justify-center gap-2.5"
          >
            <span className="font-mono uppercase font-bold tracking-wider">{idleText}</span>
            <ArrowRight className="w-4 h-4 text-[#D6B46A] group-hover:translate-x-1 transition-transform duration-200" />
          </motion.span>
        );
    }
  };

  const buttonClasses = `
    group relative border font-mono font-bold tracking-wider
    transition-all duration-200 cursor-pointer overflow-hidden
    select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B46A]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getStateColors()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (prefersReduced) {
    return (
      <button
        type={type}
        id={id}
        disabled={isDisabled}
        onClick={isInteractive ? onClick : undefined}
        className={buttonClasses}
        aria-live="polite"
      >
        {renderContent()}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      id={id}
      disabled={isDisabled}
      onClick={isInteractive ? onClick : undefined}
      className={buttonClasses}
      whileHover={isInteractive ? { y: -2, scale: 1.008 } : undefined}
      whileTap={isInteractive ? { y: 1, scale: 0.985 } : undefined}
      transition={EASING.springTactile}
      aria-live="polite"
    >
      {/* Background subtle sheen */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </motion.button>
  );
};
