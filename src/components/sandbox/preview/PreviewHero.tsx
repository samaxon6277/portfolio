import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck, Zap, Star, Calendar } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';
import { CURRENCIES } from '../constants/currencies';

interface PreviewHeroProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onCtaClick?: () => void;
  onOpenBookingModal?: () => void;
}

export const PreviewHero: React.FC<PreviewHeroProps> = ({
  state,
  accent,
  preset,
  onCtaClick,
  onOpenBookingModal,
}) => {
  const currencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;
  const formattedPrice = currencyConfig.format(state.pricingValue);

  const isMinimalist = state.layoutStyle === 'minimalist-dark';
  const isSaas = state.layoutStyle === 'high-velocity-saas';
  const isBespoke = state.layoutStyle === 'bespoke-luxury';

  const isSerif = state.fontPairing === 'editorial-serif';

  return (
    <div
      className={`relative overflow-hidden p-6 sm:p-10 text-left flex flex-col justify-between min-h-[380px] sm:min-h-[440px] transition-colors duration-300 ${
        isMinimalist
          ? 'bg-[#09090B] text-white border-b border-white/10'
          : isSaas
          ? 'bg-[#0B0F17] text-white border-b border-emerald-500/20'
          : 'bg-gradient-to-b from-[#111115] via-[#16161C] to-[#0D0D11] text-soft-ivory border-b border-champagne-gold/20'
      }`}
    >
      {/* Dynamic Ambient Mesh Glow Backing */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: accent.hex }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: accent.hex }}
      />

      {/* Top Tag & Status Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.12em] border transition-colors duration-300 flex items-center gap-1.5 ${
              isSaas ? 'rounded-md' : 'rounded-full'
            }`}
            style={{
              backgroundColor: accent.badgeBg,
              color: accent.hex,
              borderColor: `${accent.hex}40`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{preset.badge}</span>
          </span>
          <span className="text-[9px] font-mono text-warm-grey uppercase tracking-wider hidden sm:inline-block">
            {preset.heroTagline}
          </span>
        </div>

        {/* Dynamic Pricing Tag formatted with selected currency */}
        <motion.div
          key={`${state.currency}-${state.pricingValue}`}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-soft-ivory text-[10px] font-mono font-bold flex items-center gap-1.5 border border-white/15 shadow-sm"
        >
          <span className="text-warm-grey">Base:</span>
          <span style={{ color: accent.hex }}>{formattedPrice}</span>
          <span className="text-[8.5px] text-warm-grey px-1 py-0.5 rounded bg-white/10 ml-0.5">
            {state.currency}
          </span>
        </motion.div>
      </div>

      {/* Main Headline & Subtitle */}
      <div className="relative z-10 max-w-xl space-y-4 my-auto">
        {state.bookingStatus === 'urgency_2_slots' && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Urgency Trigger: Only 2 Client Slots Available This Quarter</span>
          </div>
        )}

        {state.bookingStatus === 'waitlist_only' && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Waitlist Only: VIP Application Review Active</span>
          </div>
        )}

        <motion.h2
          key={`${state.headline}-${state.fontPairing}`}
          initial={{ opacity: 0.8, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.18] break-words ${
            isSerif ? 'font-serif' : isSaas ? 'font-mono' : 'font-display'
          }`}
        >
          {state.headline || preset.defaultHeadline}
        </motion.h2>

        <p className="text-xs sm:text-sm text-warm-grey leading-relaxed max-w-lg">
          {state.subheadline || preset.defaultSubheadline}
        </p>

        {/* Action Controls in Hero */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCtaClick}
            id="preview-hero-primary-cta"
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group relative overflow-hidden"
            style={{
              backgroundColor: accent.buttonBg,
              color: accent.buttonText,
              boxShadow: `0 8px 24px -4px ${accent.glow}`,
            }}
          >
            <span className="relative z-10 font-sans">{state.ctaText || preset.defaultCtaText}</span>
            <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <button
            type="button"
            onClick={onOpenBookingModal}
            className="px-4 py-3 rounded-xl font-bold text-xs border border-white/20 hover:border-white/40 text-soft-ivory hover:text-white bg-white/5 hover:bg-white/10 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-champagne-gold" />
            <span>Interactive Booking Sheet</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid at Bottom */}
      <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 pt-6 mt-6 border-t border-white/10">
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
          <span className="text-[8px] font-mono uppercase text-warm-grey flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" style={{ color: accent.hex }} />
            <span>SPEED</span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-soft-ivory mt-1 font-mono">
            0.28s Edge TTFB
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
          <span className="text-[8px] font-mono uppercase text-warm-grey flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            <span>SECURITY</span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-soft-ivory mt-1 font-mono">
            Isolated Sandbox
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
          <span className="text-[8px] font-mono uppercase text-warm-grey flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" style={{ color: accent.hex }} />
            <span>AUTONOMY</span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-soft-ivory mt-1 font-mono">
            100% Client Control
          </span>
        </div>
      </div>
    </div>
  );
};
