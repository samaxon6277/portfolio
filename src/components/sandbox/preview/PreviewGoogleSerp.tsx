import React from 'react';
import { motion } from 'motion/react';
import { Search, Globe, Star, MoreVertical, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';

interface PreviewGoogleSerpProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
}

export const PreviewGoogleSerp: React.FC<PreviewGoogleSerpProps> = ({
  state,
  accent,
  preset,
}) => {
  const isMobile = state.deviceView === 'mobile';

  return (
    <div className="p-4 sm:p-8 bg-[#202124] text-left text-white min-h-[420px] flex flex-col justify-start">
      {/* Google Search Bar Mockup */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#303134] border border-[#5f6368]/30 shadow-inner">
          <Search className="w-4 h-4 text-[#9aa0a6]" />
          <div className="flex-1 text-xs sm:text-sm text-[#e8eaed] font-sans truncate">
            {preset.label} premium bespoke portfolio 2026
          </div>
          <div className="flex items-center gap-2 text-[#9aa0a6]">
            <span className="text-[10px] font-mono border border-[#5f6368] px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-[11px] text-[#9aa0a6] px-3 font-sans overflow-x-auto">
          <span className="text-[#8ab4f8] border-b-2 border-[#8ab4f8] pb-1 font-bold">All</span>
          <span>Images</span>
          <span>Maps</span>
          <span>News</span>
          <span>Finance</span>
        </div>
      </div>

      {/* Primary Organic Snippet */}
      <div className="w-full max-w-2xl mx-auto bg-[#303134]/40 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-2">
        {/* Site Header / Favicon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
              style={{ backgroundColor: accent.hex }}
            >
              S
            </div>
            <div>
              <div className="text-xs font-medium text-[#dadce0] leading-none">
                SamaXon Agency • {preset.label}
              </div>
              <div className="text-[10px] text-[#9aa0a6] font-mono leading-none mt-0.5 truncate max-w-[200px] sm:max-w-md">
                https://samaxon.agency › clients › {preset.id}
              </div>
            </div>
          </div>
          <MoreVertical className="w-3.5 h-3.5 text-[#9aa0a6]" />
        </div>

        {/* Snippet Title */}
        <motion.h3
          key={state.headline}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-base sm:text-lg text-[#8ab4f8] hover:underline cursor-pointer font-sans font-medium leading-snug pt-1"
        >
          {state.headline} | Official {preset.badge}
        </motion.h3>

        {/* Schema Star Rating & Rich Snippets */}
        <div className="flex items-center gap-2 text-xs text-[#bdc1c6] font-sans">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="font-bold text-[#e8eaed]">4.9</span>
          <span className="text-[#9aa0a6] text-[11px]">(142 Client Verifications)</span>
          <span className="text-[#9aa0a6]">•</span>
          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>SOC2 Certified</span>
          </span>
        </div>

        {/* Meta Description */}
        <p className="text-xs sm:text-sm text-[#bdc1c6] leading-relaxed pt-1 font-sans">
          {state.subheadline || preset.metaDescription} 48-hour turnkey client deployment,
          automated lead routing to CRM, and bespoke design systems for high-net-worth brands.
        </p>

        {/* Sitelinks Mini Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[#5f6368]/20 mt-3">
          <div className="p-2.5 rounded-xl bg-[#202124]/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            <div className="text-xs text-[#8ab4f8] font-medium flex items-center justify-between">
              <span>{state.ctaText || 'Private Inventory Deck'}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </div>
            <p className="text-[10px] text-[#9aa0a6] mt-0.5 line-clamp-1">
              Direct allocation access &amp; VIP onboarding
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#202124]/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            <div className="text-xs text-[#8ab4f8] font-medium flex items-center justify-between">
              <span>Instant Telemetry &amp; CRM</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </div>
            <p className="text-[10px] text-[#9aa0a6] mt-0.5 line-clamp-1">
              Real-time Webhook &amp; Telegram dispatching
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
