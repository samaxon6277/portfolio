import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';

interface PreviewBentoGridProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onCardSelect?: (title: string) => void;
}

export const PreviewBentoGrid: React.FC<PreviewBentoGridProps> = ({
  state,
  accent,
  preset,
  onCardSelect,
}) => {
  const isMinimalist = state.layoutStyle === 'minimalist-dark';
  const isSaas = state.layoutStyle === 'high-velocity-saas';

  return (
    <div className="w-full space-y-3 pt-6 pb-2 text-left">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-warm-grey font-bold flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" style={{ color: accent.hex }} />
          <span>Curated Signature Offerings</span>
        </span>
        <span className="text-[9px] font-mono text-warm-grey">Interactive Bento Deck</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {preset.serviceCards.map((card, idx) => (
          <motion.button
            key={idx}
            type="button"
            onClick={() => onCardSelect && onCardSelect(card.title)}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group border ${
              isMinimalist
                ? 'bg-neutral-900/80 border-white/10 hover:border-white/30 text-white'
                : isSaas
                ? 'bg-neutral-950/70 border-emerald-500/20 hover:border-emerald-500/50 text-white'
                : 'bg-white/80 backdrop-blur-md border-champagne-gold/20 hover:border-champagne-gold shadow-sm hover:shadow-md text-matte-black'
            }`}
            style={{
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Ambient hover flare */}
            <div
              className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
              style={{ backgroundColor: accent.hex }}
            />

            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span
                  className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: accent.badgeBg,
                    color: accent.hex,
                    border: `1px solid ${accent.hex}30`,
                  }}
                >
                  {card.badge}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-warm-grey group-hover:text-champagne-gold" />
              </div>

              <h4
                className={`text-xs font-bold leading-tight mb-1.5 ${
                  state.fontPairing === 'editorial-serif' && !isSaas
                    ? 'font-serif text-sm'
                    : 'font-display'
                } ${isMinimalist || isSaas ? 'text-white' : 'text-matte-black'}`}
              >
                {card.title}
              </h4>

              <p className="text-[10px] text-warm-grey leading-relaxed line-clamp-2">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-between text-[8.5px] font-mono text-warm-grey">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                <span>Verified Allocation</span>
              </span>
              <span className="text-champagne-gold group-hover:underline font-bold">Inspect →</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
