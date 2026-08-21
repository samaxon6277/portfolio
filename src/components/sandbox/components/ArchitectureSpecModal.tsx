import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Code2,
  Layers,
} from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';
import { CURRENCIES } from '../constants/currencies';
import { SITE_CONFIG } from '../../../config/siteConfig';

interface ArchitectureSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
}

export const ArchitectureSpecModal: React.FC<ArchitectureSpecModalProps> = ({
  isOpen,
  onClose,
  state,
  accent,
  preset,
}) => {
  const currencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;
  const formattedPrice = currencyConfig.format(state.pricingValue);

  const handlePrint = () => {
    window.print();
  };

  const bookingLabel =
    state.bookingStatus === 'available'
      ? 'Instant Confirmation (Open)'
      : state.bookingStatus === 'urgency_2_slots'
      ? 'High Urgency (2 Slots Left)'
      : 'Exclusive Waitlist Review';

  const whatsappMessage = encodeURIComponent(
    `Hi Samaxon Team,\n\nI have generated my Enterprise Architecture Spec Sheet:\n` +
      `• Industry: ${preset.label} (${preset.badge})\n` +
      `• Layout Preset: ${state.layoutStyle}\n` +
      `• Typography: ${state.fontPairing}\n` +
      `• Palette: ${accent.name} (${accent.hex})\n` +
      `• Currency & Floor: ${formattedPrice} (${state.currency})\n` +
      `• Booking Scarcity: ${bookingLabel}\n` +
      `• Custom Headline: "${state.headline}"\n\n` +
      `Please review and confirm our 48-hour development kickoff.`
  );

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.phoneWhatsappRaw}?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-2xl bg-neutral-900 border border-champagne-gold/30 rounded-3xl p-6 sm:p-8 text-left shadow-2xl text-soft-ivory relative overflow-hidden my-auto"
          >
            {/* Ambient Lighting */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: accent.hex }}
            />

            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm font-display shadow-md"
                  style={{ backgroundColor: accent.hex, color: accent.buttonText }}
                >
                  SPEC
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-champagne-gold font-bold block">
                    SamaXon Client OS • Enterprise Architecture
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-soft-ivory">
                    Deployment Specification Sheet
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-warm-grey hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-6 font-sans text-xs">
              {/* Primary Architecture Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-mono text-warm-grey uppercase block">Industry</span>
                  <span className="text-xs font-bold text-soft-ivory mt-0.5 block truncate font-display">
                    {preset.label}
                  </span>
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-mono text-warm-grey uppercase block">Layout Style</span>
                  <span className="text-xs font-bold text-soft-ivory mt-0.5 block truncate font-mono">
                    {state.layoutStyle}
                  </span>
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-mono text-warm-grey uppercase block">Typography</span>
                  <span className="text-xs font-bold text-soft-ivory mt-0.5 block truncate">
                    {state.fontPairing === 'editorial-serif' ? 'Editorial Serif' : 'Modern Sans'}
                  </span>
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-mono text-warm-grey uppercase block">Target Floor</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block font-mono">
                    {formattedPrice}
                  </span>
                </div>
              </div>

              {/* Color Token & Palette Spec */}
              <div className="p-4 bg-neutral-950/70 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider">
                    Design Tokens &amp; Lighting Palette:
                  </span>
                  <span className="text-[9px] font-mono text-warm-grey">WCAG AA Compliant</span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl shadow-md border border-white/20"
                    style={{ backgroundColor: accent.hex }}
                  />
                  <div>
                    <h5 className="font-bold text-soft-ivory text-sm">{accent.name}</h5>
                    <span className="text-[10px] font-mono text-warm-grey block">
                      Hex: <code className="text-soft-ivory">{accent.hex}</code> • RGB: {accent.rgb}
                    </span>
                  </div>
                </div>
              </div>

              {/* Configured Copy Staging */}
              <div className="p-4 bg-neutral-950/70 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider block">
                  Configured Front-End Copy:
                </span>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-soft-ivory font-display">
                    Headline: &ldquo;{state.headline}&rdquo;
                  </p>
                  <p className="text-warm-grey text-[11px]">
                    Subheading: {state.subheadline}
                  </p>
                  <p className="text-[10px] font-mono text-champagne-gold">
                    Primary CTA: &ldquo;{state.ctaText}&rdquo; • Urgency Mode: {bookingLabel}
                  </p>
                </div>
              </div>

              {/* Feature Checklist & SLA Guarantee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-neutral-950/70 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Included Architecture Modules:</span>
                  </span>
                  <ul className="space-y-1 text-[10.5px] text-warm-grey">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Zero-latency edge webhook routing</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Telegram Bot &amp; CRM simultaneous dispatch</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>iPhone 16 Pro Dynamic Island telemetry</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Google SERP &amp; OpenGraph Social Cards</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-neutral-950/70 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>48-Hour Turnkey Deployment SLA:</span>
                  </span>
                  <p className="text-[10.5px] text-warm-grey leading-relaxed">
                    Dedicated engineering sprint: Full brand asset injection, staging verification, custom domain DNS handshake, and live cutover guaranteed in 48 hours.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-soft-ivory text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xl flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-center"
                  style={{
                    backgroundColor: accent.buttonBg,
                    color: accent.buttonText,
                    boxShadow: `0 8px 24px -4px ${accent.glow}`,
                  }}
                >
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  <span>Lock In 48-Hour Build Sprint</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
