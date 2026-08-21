import React from 'react';
import { ArrowRight, RotateCcw, MessageCircle, Sparkles, FileText } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';
import { CURRENCIES } from '../constants/currencies';
import { SITE_CONFIG } from '../../../config/siteConfig';

interface SandboxFooterBarProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onReset: () => void;
  onOpenSpecModal?: () => void;
}

export const SandboxFooterBar: React.FC<SandboxFooterBarProps> = ({
  state,
  accent,
  preset,
  onReset,
  onOpenSpecModal,
}) => {
  const currencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;
  const formattedPrice = currencyConfig.format(state.pricingValue);

  // Construct WhatsApp deep link with all customized parameters
  const bookingStatusLabel =
    state.bookingStatus === 'available'
      ? 'Online (Instant Confirmation)'
      : state.bookingStatus === 'urgency_2_slots'
      ? 'Urgency (2 Slots Left)'
      : 'Waitlist Only';

  const message = encodeURIComponent(
    `Hi Samaxon Team,\n\nI just customized my digital platform in your Client OS Sandbox:\n` +
      `• Industry Architecture: ${preset.label}\n` +
      `• Layout Preset: ${state.layoutStyle}\n` +
      `• Typography: ${state.fontPairing}\n` +
      `• Theme Lighting: ${accent.name}\n` +
      `• Target Base Investment: ${formattedPrice} (${state.currency})\n` +
      `• Initial Booking Status: ${bookingStatusLabel}\n` +
      `• Custom Headline: "${state.headline}"\n\n` +
      `I want to deploy this custom architecture. Let's discuss the 48-hour build timeline.`
  );

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.phoneWhatsappRaw}?text=${message}`;

  return (
    <div className="w-full bg-matte-black text-soft-ivory border border-champagne-gold/30 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: accent.hex }}
      />

      {/* Left Section: Live Configuration Summary */}
      <div className="flex items-center gap-3 text-left w-full md:w-auto">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm"
          style={{
            backgroundColor: `${accent.hex}20`,
            borderColor: `${accent.hex}50`,
          }}
        >
          <Sparkles className="w-5 h-5" style={{ color: accent.hex }} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-soft-ivory font-display">
              Live Configured Architecture
            </span>
            <span
              className="px-2 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider"
              style={{
                backgroundColor: accent.badgeBg,
                color: accent.hex,
                border: `1px solid ${accent.hex}40`,
              }}
            >
              {preset.label}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase text-warm-grey">
              {state.layoutStyle}
            </span>
          </div>

          <p className="text-[10px] font-mono text-warm-grey truncate mt-0.5">
            Theme: <span className="text-soft-ivory font-semibold">{accent.name}</span> • Status:{' '}
            <span className="text-soft-ivory font-semibold">{state.bookingStatus}</span> • Target:{' '}
            <span className="text-emerald-400 font-bold font-mono">
              {formattedPrice}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section: Action CTAs */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto justify-end">
        {/* Spec Sheet Download Button */}
        {onOpenSpecModal && (
          <button
            type="button"
            onClick={onOpenSpecModal}
            id="download-spec-sheet-btn"
            className="w-full sm:w-auto px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-soft-ivory border border-champagne-gold/40 hover:border-champagne-gold text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-champagne-gold" />
            <span className="font-sans">Spec Sheet</span>
          </button>
        )}

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          id="sandbox-reset-btn"
          className="w-full sm:w-auto px-4 py-3 bg-charcoal/80 hover:bg-charcoal text-warm-grey hover:text-soft-ivory border border-white/10 hover:border-white/20 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="font-sans">Reset</span>
        </button>

        {/* High-Ticket Conversion CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="deploy-custom-architecture-wa-btn"
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xl flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-center group"
          style={{
            backgroundColor: accent.buttonBg,
            color: accent.buttonText,
            boxShadow: `0 8px 24px -4px ${accent.glow}`,
          }}
        >
          <MessageCircle className="w-4 h-4 fill-current shrink-0" />
          <span className="font-sans whitespace-nowrap">Deploy This Architecture (WhatsApp)</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};
