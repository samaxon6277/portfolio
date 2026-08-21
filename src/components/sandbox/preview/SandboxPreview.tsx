import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Smartphone, RefreshCw, Globe, Search, Share2, Sparkles, Zap } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset, PreviewMode } from '../types';
import { DeviceFrameDesktop } from './DeviceFrameDesktop';
import { DeviceFrameMobile } from './DeviceFrameMobile';
import { PreviewHero } from './PreviewHero';
import { PreviewBentoGrid } from './PreviewBentoGrid';
import { PreviewBookingModal } from './PreviewBookingModal';
import { PreviewWhatsAppBot } from './PreviewWhatsAppBot';
import { PreviewGoogleSerp } from './PreviewGoogleSerp';
import { PreviewSocialCard } from './PreviewSocialCard';
import { PreviewMaintenance } from './PreviewMaintenance';
import { PreviewToastStack } from './PreviewToastStack';

interface SandboxPreviewProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onCtaClick?: () => void;
  onReset?: () => void;
  onSimulateLead?: () => void;
}

export const SandboxPreview: React.FC<SandboxPreviewProps> = ({
  state,
  accent,
  preset,
  onDeviceChange,
  onPreviewModeChange,
  onCtaClick,
  onReset,
  onSimulateLead,
}) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  const handleBookingConfirmed = (dateStr: string, slotStr: string) => {
    if (onSimulateLead) {
      onSimulateLead();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Top Device Switcher & Staging Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 bg-matte-black/90 backdrop-blur-xl border border-champagne-gold/20 rounded-2xl">
        {/* Left: Device Switchers */}
        <div className="flex items-center gap-1 p-1 bg-charcoal/80 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            id="viewport-desktop-btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              state.deviceView === 'desktop'
                ? 'bg-champagne-gold text-matte-black shadow-md font-bold'
                : 'text-warm-grey hover:text-soft-ivory hover:bg-white/5'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block font-sans">Desktop (16:9)</span>
            <span className="sm:hidden">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            id="viewport-mobile-btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              state.deviceView === 'mobile'
                ? 'bg-champagne-gold text-matte-black shadow-md font-bold'
                : 'text-warm-grey hover:text-soft-ivory hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block font-sans">iPhone 16 Pro</span>
            <span className="sm:hidden">Mobile</span>
          </button>
        </div>

        {/* Center: SEO / Social Preview Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-charcoal/80 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => onPreviewModeChange('live-site')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              state.previewMode === 'live-site'
                ? 'bg-white/15 text-white font-bold'
                : 'text-warm-grey hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Live Site</span>
          </button>

          <button
            type="button"
            onClick={() => onPreviewModeChange('google-serp')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              state.previewMode === 'google-serp'
                ? 'bg-white/15 text-white font-bold'
                : 'text-warm-grey hover:text-white'
            }`}
          >
            <Search className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Google SERP</span>
            <span className="sm:hidden">SEO</span>
          </button>

          <button
            type="button"
            onClick={() => onPreviewModeChange('social-og')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              state.previewMode === 'social-og'
                ? 'bg-white/15 text-white font-bold'
                : 'text-warm-grey hover:text-white'
            }`}
          >
            <Share2 className="w-3 h-3 text-purple-400" />
            <span className="hidden sm:inline">Social Card</span>
            <span className="sm:hidden">Social</span>
          </button>
        </div>

        {/* Right: Live Sync Info & Reset Quick Action */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-warm-grey">
          <div className="hidden lg:flex items-center gap-1.5 bg-charcoal/60 px-2.5 py-1 rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-soft-ivory">Sync: &lt;16ms</span>
          </div>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title="Reset Sandbox"
              className="p-1.5 rounded-lg bg-charcoal/60 hover:bg-charcoal text-warm-grey hover:text-champagne-gold border border-white/5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Staging Area */}
      <div className="w-full flex items-center justify-center p-2 sm:p-5 bg-charcoal/40 rounded-3xl border border-champagne-gold/15 min-h-[540px] transition-all duration-300 relative overflow-hidden">
        {/* Ambient background mesh glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: accent.hex }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: accent.hex }}
        />

        <div
          className={`w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            state.deviceView === 'mobile' ? 'max-w-[360px]' : 'max-w-full'
          }`}
        >
          {state.deviceView === 'desktop' ? (
            <DeviceFrameDesktop accent={accent}>
              {/* Preview Content Inside Desktop Frame */}
              {state.previewMode === 'google-serp' ? (
                <PreviewGoogleSerp state={state} accent={accent} preset={preset} />
              ) : state.previewMode === 'social-og' ? (
                <PreviewSocialCard state={state} accent={accent} preset={preset} />
              ) : (
                <div className="relative w-full text-left">
                  {/* Top Promo Banner */}
                  {state.showPromoBanner && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 text-center text-xs font-mono font-bold tracking-wide flex items-center justify-center gap-2 relative z-20 shadow-md"
                      style={{
                        backgroundColor: accent.hex,
                        color: accent.buttonText,
                      }}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                      <span>{state.promoBannerText || preset.promoText}</span>
                    </motion.div>
                  )}

                  {/* Hero Section */}
                  <PreviewHero
                    state={state}
                    accent={accent}
                    preset={preset}
                    onCtaClick={() => setIsBookingModalOpen(true)}
                    onOpenBookingModal={() => setIsBookingModalOpen(true)}
                  />

                  {/* Bento Offerings Deck */}
                  <div className="px-6 sm:px-10 pb-8 bg-[#0D0D11]">
                    <PreviewBentoGrid
                      state={state}
                      accent={accent}
                      preset={preset}
                      onCardSelect={() => setIsBookingModalOpen(true)}
                    />
                  </div>

                  {/* Interactive Booking Sheet */}
                  <PreviewBookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    state={state}
                    accent={accent}
                    preset={preset}
                    onConfirmBooking={handleBookingConfirmed}
                  />

                  {/* Floating WhatsApp AI Bot */}
                  <PreviewWhatsAppBot
                    isOpen={isWhatsAppOpen}
                    onToggle={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
                    state={state}
                    accent={accent}
                    preset={preset}
                    onSimulateInquiry={() => onSimulateLead && onSimulateLead()}
                  />

                  {/* Maintenance Mode Overlay */}
                  <AnimatePresence>
                    {state.maintenanceMode && <PreviewMaintenance accent={accent} />}
                  </AnimatePresence>

                  {/* Live Toast Lead Stack */}
                  <PreviewToastStack leads={state.leads} accent={accent} />
                </div>
              )}
            </DeviceFrameDesktop>
          ) : (
            <DeviceFrameMobile accent={accent}>
              {/* Preview Content Inside Mobile Frame */}
              {state.previewMode === 'google-serp' ? (
                <PreviewGoogleSerp state={state} accent={accent} preset={preset} />
              ) : state.previewMode === 'social-og' ? (
                <PreviewSocialCard state={state} accent={accent} preset={preset} />
              ) : (
                <div className="relative w-full text-left">
                  {/* Top Promo Banner */}
                  {state.showPromoBanner && (
                    <div
                      className="px-3 py-1.5 text-center text-[10px] font-mono font-bold tracking-tight flex items-center justify-center gap-1.5 relative z-20"
                      style={{
                        backgroundColor: accent.hex,
                        color: accent.buttonText,
                      }}
                    >
                      <Zap className="w-3 h-3 fill-current shrink-0" />
                      <span className="truncate">{state.promoBannerText || preset.promoText}</span>
                    </div>
                  )}

                  {/* Hero Section Mobile */}
                  <PreviewHero
                    state={state}
                    accent={accent}
                    preset={preset}
                    onCtaClick={() => setIsBookingModalOpen(true)}
                    onOpenBookingModal={() => setIsBookingModalOpen(true)}
                  />

                  {/* Bento Offerings Deck */}
                  <div className="px-4 pb-6 bg-[#0D0D11]">
                    <PreviewBentoGrid
                      state={state}
                      accent={accent}
                      preset={preset}
                      onCardSelect={() => setIsBookingModalOpen(true)}
                    />
                  </div>

                  {/* Interactive Booking Sheet */}
                  <PreviewBookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    state={state}
                    accent={accent}
                    preset={preset}
                    onConfirmBooking={handleBookingConfirmed}
                  />

                  {/* Floating WhatsApp AI Bot */}
                  <PreviewWhatsAppBot
                    isOpen={isWhatsAppOpen}
                    onToggle={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
                    state={state}
                    accent={accent}
                    preset={preset}
                    onSimulateInquiry={() => onSimulateLead && onSimulateLead()}
                  />

                  {/* Maintenance Mode Overlay */}
                  <AnimatePresence>
                    {state.maintenanceMode && <PreviewMaintenance accent={accent} />}
                  </AnimatePresence>

                  {/* Live Toast Lead Stack */}
                  <PreviewToastStack leads={state.leads} accent={accent} />
                </div>
              )}
            </DeviceFrameMobile>
          )}
        </div>
      </div>
    </div>
  );
};
