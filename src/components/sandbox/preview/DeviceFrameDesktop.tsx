import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, RotateCcw, ShieldCheck, Share, Sparkles, ExternalLink, Minus, Plus, X } from 'lucide-react';
import { AccentColorToken } from '../types';

interface DeviceFrameDesktopProps {
  accent: AccentColorToken;
  children: React.ReactNode;
}

export const DeviceFrameDesktop: React.FC<DeviceFrameDesktopProps> = ({
  accent,
  children,
}) => {
  const [isDotHovered, setIsDotHovered] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0E0E10] transition-all duration-300 relative group flex flex-col"
      style={{
        boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.75), 0 0 32px -8px ${accent.glow}`,
      }}
    >
      {/* macOS Sonoma Charcoal Window Header */}
      <div className="h-11 bg-[#121214] border-b border-white/5 px-4 flex items-center justify-between select-none relative z-20">
        {/* macOS Window Controls */}
        <div
          className="flex items-center gap-2"
          onMouseEnter={() => setIsDotHovered(true)}
          onMouseLeave={() => setIsDotHovered(false)}
        >
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
            {isDotHovered && <X className="w-2 h-2 text-[#4A0002]" />}
          </div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
            {isDotHovered && <Minus className="w-2 h-2 text-[#5E3B00]" />}
          </div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
            {isDotHovered && <Plus className="w-2 h-2 text-[#004D11]" />}
          </div>
        </div>

        {/* Central Address Capsule */}
        <div className="flex-1 max-w-md mx-auto px-2">
          <div className="h-7 bg-[#1A1A1E] hover:bg-[#222228] transition-colors rounded-lg border border-white/5 flex items-center justify-between px-3 text-[11px] font-mono text-warm-grey">
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-white/40">https://</span>
              <span className="text-soft-ivory font-bold truncate">samaxon-client.preview</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>SSL</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 text-warm-grey text-xs">
          <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono bg-white/5 px-2 py-1 rounded-md border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>60 FPS</span>
          </div>
          <button
            type="button"
            className="p-1 rounded hover:bg-white/10 transition-colors text-warm-grey hover:text-white"
            title="Reload Sandbox"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screen Viewport Canvas */}
      <div className="relative w-full overflow-hidden bg-[#0A0A0C] min-h-[480px]">
        {children}
      </div>
    </motion.div>
  );
};
