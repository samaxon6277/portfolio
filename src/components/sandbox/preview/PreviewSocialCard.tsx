import React from 'react';
import { motion } from 'motion/react';
import { Share2, Globe, Sparkles, MessageSquare, CheckCircle } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';
import { CURRENCIES } from '../constants/currencies';

interface PreviewSocialCardProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
}

export const PreviewSocialCard: React.FC<PreviewSocialCardProps> = ({
  state,
  accent,
  preset,
}) => {
  const currencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;
  const formattedPrice = currencyConfig.format(state.pricingValue);

  return (
    <div className="p-4 sm:p-8 bg-neutral-950 text-left text-soft-ivory min-h-[420px] flex flex-col items-center justify-center">
      {/* Social Card Wrapper */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between px-1 text-xs text-warm-grey font-mono">
          <span className="flex items-center gap-1.5 text-champagne-gold">
            <Share2 className="w-3.5 h-3.5" />
            <span>Rich Social OpenGraph Preview</span>
          </span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">WhatsApp / iMessage / X</span>
        </div>

        {/* The Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl overflow-hidden bg-neutral-900 border border-white/15 shadow-2xl transition-all"
        >
          {/* Dynamic OG Banner Graphic */}
          <div
            className="h-44 sm:h-48 relative p-5 flex flex-col justify-between overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #111113 0%, #1a1a1f 100%)`,
            }}
          >
            {/* Ambient Accent Radial Glow */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: accent.hex }}
            />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-display"
                  style={{ backgroundColor: accent.hex, color: accent.buttonText }}
                >
                  S
                </div>
                <span className="text-[11px] font-mono tracking-wider font-bold text-white uppercase">
                  SAMAXON • {preset.label}
                </span>
              </div>

              <span
                className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: accent.badgeBg,
                  color: accent.hex,
                  borderColor: `${accent.hex}40`,
                }}
              >
                {preset.badge}
              </span>
            </div>

            <div className="relative z-10 space-y-1">
              <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight">
                {state.headline}
              </h3>
              <p className="text-xs text-warm-grey font-sans line-clamp-1">
                {state.subheadline}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] font-mono">
              <span className="text-warm-grey">Base Investment</span>
              <span className="font-bold text-soft-ivory" style={{ color: accent.hex }}>
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Social Metadata Footer */}
          <div className="p-4 bg-neutral-900 border-t border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-warm-grey uppercase tracking-wider block">
              samaxon.agency • verified client deployment
            </span>
            <h4 className="font-sans font-bold text-sm text-soft-ivory">
              {state.headline}
            </h4>
            <p className="text-xs text-warm-grey line-clamp-2">
              {state.subheadline || preset.metaDescription}
            </p>
          </div>
        </motion.div>

        {/* Message Bubble Simulation */}
        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-white/10 flex items-start gap-2.5 text-xs text-warm-grey">
          <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            When your link is shared via WhatsApp or iMessage, this high-contrast, branded rich preview is rendered automatically with zero extra configuration.
          </p>
        </div>
      </div>
    </div>
  );
};
