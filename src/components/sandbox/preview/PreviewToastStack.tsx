import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { InboundLead, AccentColorToken } from '../types';

interface PreviewToastStackProps {
  leads: InboundLead[];
  accent: AccentColorToken;
  onDismiss?: (id: string) => void;
}

export const PreviewToastStack: React.FC<PreviewToastStackProps> = ({ leads, accent, onDismiss }) => {
  // Show up to the 2 most recent leads in the floating preview toast
  const activeToasts = leads.slice(0, 2);

  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 max-w-[280px] sm:max-w-xs pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((lead) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: -16, scale: 0.9, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="pointer-events-auto bg-matte-black/95 text-soft-ivory p-3 sm:p-3.5 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-3"
            style={{
              borderColor: `${accent.hex}60`,
              boxShadow: `0 12px 30px -4px rgba(0,0,0,0.6), 0 0 20px -4px ${accent.glow}`,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${accent.hex}25`, border: `1px solid ${accent.hex}50` }}
            >
              <Sparkles className="w-4 h-4" style={{ color: accent.hex }} />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-1">
                <span
                  className="text-[9px] font-mono uppercase font-bold tracking-wider"
                  style={{ color: accent.hex }}
                >
                  ⚡ Inbound Lead Captured
                </span>
                <span className="text-[8px] font-mono text-warm-grey">{lead.timestamp}</span>
              </div>
              <p className="text-xs font-bold text-soft-ivory truncate mt-0.5">{lead.customerName}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono text-warm-grey">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{lead.phoneNumber}</span>
                <span className="text-soft-ivory/40">•</span>
                <span className="text-emerald-400 font-bold">{lead.estimatedBudget}</span>
              </div>
            </div>

            {onDismiss && (
              <button
                type="button"
                onClick={() => onDismiss(lead.id)}
                className="text-warm-grey hover:text-soft-ivory p-0.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
