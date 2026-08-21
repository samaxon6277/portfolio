import React from 'react';
import {
  Sparkles,
  Type,
  Palette,
  Megaphone,
  Check,
  LayoutTemplate,
  Globe,
  Search,
  Share2,
  BookOpen,
} from 'lucide-react';
import {
  IndustryKey,
  BrandAccentKey,
  SandboxState,
  AccentColorToken,
  IndustryPreset,
  LayoutStyle,
  FontPairing,
  PreviewMode,
} from '../types';
import { INDUSTRY_PRESETS } from '../constants/industryPresets';
import { THEME_ACCENTS } from '../constants/themeColors';

interface TabBrandContentProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onIndustryChange: (id: IndustryKey) => void;
  onAccentChange: (accent: BrandAccentKey) => void;
  onLayoutStyleChange: (layout: LayoutStyle) => void;
  onFontPairingChange: (font: FontPairing) => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onHeadlineChange: (headline: string) => void;
  onSubheadlineChange: (subheadline: string) => void;
  onCtaChange: (cta: string) => void;
  onTogglePromo: (show: boolean) => void;
  onPromoTextChange: (text: string) => void;
}

export const TabBrandContent: React.FC<TabBrandContentProps> = ({
  state,
  accent,
  onIndustryChange,
  onAccentChange,
  onLayoutStyleChange,
  onFontPairingChange,
  onPreviewModeChange,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaChange,
  onTogglePromo,
  onPromoTextChange,
}) => {
  const industries = Object.values(INDUSTRY_PRESETS);
  const accents = Object.values(THEME_ACCENTS);

  const layoutStyles: Array<{ id: LayoutStyle; label: string; desc: string }> = [
    {
      id: 'bespoke-luxury',
      label: 'Bespoke Luxury',
      desc: 'Editorial serif, champagne borders, relaxed spacing',
    },
    {
      id: 'high-velocity-saas',
      label: 'High-Velocity SaaS',
      desc: 'Clean mono badges, neon emerald, bento grid',
    },
    {
      id: 'minimalist-dark',
      label: 'Minimalist Dark',
      desc: 'Deep obsidian contrast, subtle type, sharp borders',
    },
  ];

  const fontPairings: Array<{ id: FontPairing; label: string; sample: string }> = [
    {
      id: 'modern-sans',
      label: 'Modern Sans-Serif',
      sample: 'Aa • Clean Precision',
    },
    {
      id: 'editorial-serif',
      label: 'Editorial Luxury Serif',
      sample: 'Aa • Haute Elegance',
    },
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 0. SEO & Live Preview Mode Switcher */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span>Simulation Viewport Target:</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onPreviewModeChange('live-site')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              state.previewMode === 'live-site'
                ? 'bg-neutral-800 border-champagne-gold text-white font-bold shadow-md'
                : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:border-white/20'
            }`}
            style={state.previewMode === 'live-site' ? { borderColor: accent.hex } : {}}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono">Live Site</span>
          </button>

          <button
            type="button"
            onClick={() => onPreviewModeChange('google-serp')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              state.previewMode === 'google-serp'
                ? 'bg-neutral-800 border-champagne-gold text-white font-bold shadow-md'
                : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:border-white/20'
            }`}
            style={state.previewMode === 'google-serp' ? { borderColor: accent.hex } : {}}
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span className="text-[10px] font-mono">Google SERP</span>
          </button>

          <button
            type="button"
            onClick={() => onPreviewModeChange('social-og')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              state.previewMode === 'social-og'
                ? 'bg-neutral-800 border-champagne-gold text-white font-bold shadow-md'
                : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:border-white/20'
            }`}
            style={state.previewMode === 'social-og' ? { borderColor: accent.hex } : {}}
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-mono">Social Card</span>
          </button>
        </div>
      </div>

      {/* 1. Industry Preset Selector */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Select Industry Architecture:</span>
        </label>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {industries.map((ind) => {
            const isSelected = state.industry === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => onIndustryChange(ind.id)}
                id={`industry-preset-${ind.id}`}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'bg-neutral-800 border-champagne-gold shadow-md'
                    : 'bg-neutral-900/50 border-white/5 hover:border-champagne-gold/40 hover:bg-neutral-800/80'
                }`}
                style={
                  isSelected
                    ? {
                        boxShadow: `0 4px 20px -2px ${accent.glow}`,
                        borderColor: accent.hex,
                      }
                    : {}
                }
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <span
                    className={`text-[9px] font-mono uppercase font-bold tracking-wider ${
                      isSelected ? 'text-soft-ivory' : 'text-warm-grey group-hover:text-soft-ivory'
                    }`}
                  >
                    {ind.label}
                  </span>
                  {isSelected && (
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: accent.hex, color: accent.buttonText }}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[8.5px] font-mono text-warm-grey mt-1 truncate block">
                  {ind.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Layout Style Preset Switcher */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>2. Layout Style Preset Switcher:</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {layoutStyles.map((layout) => {
            const isSelected = state.layoutStyle === layout.id;
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => onLayoutStyleChange(layout.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 border-champagne-gold text-white font-bold shadow-sm'
                    : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:border-white/20'
                }`}
                style={isSelected ? { borderColor: accent.hex } : {}}
              >
                <span className="text-[10px] font-bold font-mono block text-soft-ivory">
                  {layout.label}
                </span>
                <span className="text-[8.5px] text-warm-grey leading-tight block mt-0.5">
                  {layout.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Font Pairing Switcher */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>3. Dynamic Font Pairing Switcher:</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {fontPairings.map((fp) => {
            const isSelected = state.fontPairing === fp.id;
            return (
              <button
                key={fp.id}
                type="button"
                onClick={() => onFontPairingChange(fp.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 border-champagne-gold text-white font-bold shadow-sm'
                    : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:border-white/20'
                }`}
                style={isSelected ? { borderColor: accent.hex } : {}}
              >
                <span className="text-[10.5px] font-bold block text-soft-ivory">
                  {fp.label}
                </span>
                <span className="text-[9px] font-mono text-champagne-gold block mt-0.5">
                  {fp.sample}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Color Accent Swatches */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>4. Brand Color &amp; Lighting Engine:</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {accents.map((acc) => {
            const isSelected = state.brandAccent === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onAccentChange(acc.id)}
                id={`accent-swatch-${acc.id}`}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 border-white/40 shadow-sm'
                    : 'bg-neutral-900/40 border-white/5 hover:border-white/20'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: acc.hex,
                        boxShadow: `0 0 16px -2px ${acc.glow}`,
                      }
                    : {}
                }
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-sm border border-white/20 relative flex items-center justify-center"
                  style={{ backgroundColor: acc.hex }}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span
                  className={`text-[9.5px] font-mono font-medium truncate ${
                    isSelected ? 'text-soft-ivory font-bold' : 'text-warm-grey'
                  }`}
                >
                  {acc.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Two-Way Copy Editors */}
      <div className="space-y-3.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" />
          <span>5. Live Front-End Copy Editors:</span>
        </label>

        {/* Headline Input */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-warm-grey">
            <span>Display Headline (H1 / H2)</span>
            <span>{state.headline.length} chars</span>
          </div>
          <input
            type="text"
            value={state.headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
            id="admin-copy-headline"
            className="w-full bg-neutral-900 border border-white/10 focus:border-champagne-gold text-xs text-soft-ivory p-3 rounded-xl font-sans focus:outline-none transition-colors"
            placeholder="Enter high-impact display headline..."
          />
        </div>

        {/* Sub-headline Input */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-warm-grey">
            <span>Supporting Value Proposition</span>
            <span>{state.subheadline.length} chars</span>
          </div>
          <textarea
            rows={2}
            value={state.subheadline}
            onChange={(e) => onSubheadlineChange(e.target.value)}
            id="admin-copy-subheadline"
            className="w-full bg-neutral-900 border border-white/10 focus:border-champagne-gold text-xs text-soft-ivory p-3 rounded-xl font-sans focus:outline-none transition-colors resize-none"
            placeholder="Enter strategic subheading copy..."
          />
        </div>

        {/* CTA Button Text */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-warm-grey">
            <span>Primary CTA Button Copy</span>
            <span>{state.ctaText.length} chars</span>
          </div>
          <input
            type="text"
            value={state.ctaText}
            onChange={(e) => onCtaChange(e.target.value)}
            id="admin-copy-cta"
            className="w-full bg-neutral-900 border border-white/10 focus:border-champagne-gold text-xs text-soft-ivory p-3 rounded-xl font-sans focus:outline-none transition-colors"
            placeholder="e.g., Download Private Inventory"
          />
        </div>
      </div>

      {/* 6. Flash Urgency Announcement Bar */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            <span>6. Flash Announcement Bar:</span>
          </label>
          <button
            type="button"
            onClick={() => onTogglePromo(!state.showPromoBanner)}
            id="toggle-promo-banner-btn"
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer ${
              state.showPromoBanner ? 'bg-emerald-500' : 'bg-neutral-700'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-sm ${
                state.showPromoBanner ? 'left-5.5' : 'left-1'
              }`}
            />
          </button>
        </div>

        {state.showPromoBanner && (
          <input
            type="text"
            value={state.promoBannerText}
            onChange={(e) => onPromoTextChange(e.target.value)}
            id="admin-copy-promotext"
            className="w-full bg-neutral-900 border border-white/10 focus:border-champagne-gold text-xs text-soft-ivory p-3 rounded-xl font-mono focus:outline-none transition-colors"
            placeholder="Enter flash announcement message..."
          />
        )}
      </div>
    </div>
  );
};
