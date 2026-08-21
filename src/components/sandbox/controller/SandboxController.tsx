import React from 'react';
import { motion } from 'motion/react';
import { Palette, Sliders, Zap, Activity, FileText } from 'lucide-react';
import {
  SandboxState,
  AccentColorToken,
  IndustryPreset,
  IndustryKey,
  BrandAccentKey,
  LayoutStyle,
  FontPairing,
  CurrencyCode,
  PreviewMode,
} from '../types';
import { TabBrandContent } from './TabBrandContent';
import { TabOperations } from './TabOperations';
import { TabLeadEngine } from './TabLeadEngine';
import { TabTelemetry } from './TabTelemetry';

interface SandboxControllerProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onTabChange: (tab: 'brand' | 'ops' | 'leads' | 'telemetry') => void;
  onIndustryChange: (id: IndustryKey) => void;
  onAccentChange: (accent: BrandAccentKey) => void;
  onLayoutStyleChange: (layout: LayoutStyle) => void;
  onFontPairingChange: (font: FontPairing) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onHeadlineChange: (headline: string) => void;
  onSubheadlineChange: (subheadline: string) => void;
  onCtaChange: (cta: string) => void;
  onTogglePromo: (show: boolean) => void;
  onPromoTextChange: (text: string) => void;
  onBookingStatusChange: (status: 'available' | 'urgency_2_slots' | 'waitlist_only') => void;
  onPricingChange: (price: number) => void;
  onMaintenanceToggle: (maintenance: boolean) => void;
  onSimulateLead: () => void;
  onOpenTelegramDrawer?: () => void;
  onOpenSpecModal?: () => void;
}

export const SandboxController: React.FC<SandboxControllerProps> = ({
  state,
  accent,
  preset,
  onTabChange,
  onIndustryChange,
  onAccentChange,
  onLayoutStyleChange,
  onFontPairingChange,
  onCurrencyChange,
  onPreviewModeChange,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaChange,
  onTogglePromo,
  onPromoTextChange,
  onBookingStatusChange,
  onPricingChange,
  onMaintenanceToggle,
  onSimulateLead,
  onOpenTelegramDrawer,
  onOpenSpecModal,
}) => {
  const tabs = [
    { id: 'brand', label: 'Brand & Copy', icon: Palette },
    { id: 'ops', label: 'Operations', icon: Sliders },
    { id: 'leads', label: 'Lead Engine', icon: Zap },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
  ] as const;

  return (
    <div className="w-full bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-left relative overflow-hidden">
      {/* Subtle Accent Edge Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: accent.hex }}
      />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-display shadow-sm"
            style={{ backgroundColor: accent.hex, color: accent.buttonText }}
          >
            OS
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-soft-ivory tracking-wide">
              Client OS Control Deck
            </h3>
            <span className="text-[9px] font-mono text-warm-grey block">
              Autonomous Admin Staging Layer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSpecModal && (
            <button
              type="button"
              onClick={onOpenSpecModal}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-soft-ivory hover:text-white text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <FileText className="w-3 h-3 text-champagne-gold" />
              <span className="hidden sm:inline">Spec Sheet</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              60 FPS
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-black/50 rounded-2xl border border-white/5 relative">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              id={`controller-tab-${tab.id}`}
              className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer select-none z-10 ${
                isActive ? 'text-matte-black font-bold' : 'text-warm-grey hover:text-soft-ivory'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="controllerTab"
                  className="absolute inset-0 rounded-xl shadow-md -z-1"
                  style={{
                    backgroundColor: accent.buttonBg,
                    boxShadow: `0 4px 14px -2px ${accent.glow}`,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate font-sans">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="relative min-h-[360px]">
        {state.activeTab === 'brand' && (
          <TabBrandContent
            state={state}
            accent={accent}
            preset={preset}
            onIndustryChange={onIndustryChange}
            onAccentChange={onAccentChange}
            onLayoutStyleChange={onLayoutStyleChange}
            onFontPairingChange={onFontPairingChange}
            onPreviewModeChange={onPreviewModeChange}
            onHeadlineChange={onHeadlineChange}
            onSubheadlineChange={onSubheadlineChange}
            onCtaChange={onCtaChange}
            onTogglePromo={onTogglePromo}
            onPromoTextChange={onPromoTextChange}
          />
        )}

        {state.activeTab === 'ops' && (
          <TabOperations
            state={state}
            accent={accent}
            onCurrencyChange={onCurrencyChange}
            onBookingStatusChange={onBookingStatusChange}
            onPricingChange={onPricingChange}
            onMaintenanceToggle={onMaintenanceToggle}
          />
        )}

        {state.activeTab === 'leads' && (
          <TabLeadEngine
            state={state}
            accent={accent}
            preset={preset}
            onSimulateLead={onSimulateLead}
            onOpenTelegramDrawer={onOpenTelegramDrawer}
          />
        )}

        {state.activeTab === 'telemetry' && (
          <TabTelemetry state={state} accent={accent} />
        )}
      </div>
    </div>
  );
};
