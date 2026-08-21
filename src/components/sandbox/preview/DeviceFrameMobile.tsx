import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Battery, Signal, Sparkles, Music } from 'lucide-react';
import { AccentColorToken } from '../types';

interface DeviceFrameMobileProps {
  accent: AccentColorToken;
  children: React.ReactNode;
}

export const DeviceFrameMobile: React.FC<DeviceFrameMobileProps> = ({
  accent,
  children,
}) => {
  return (
    <div className="w-full flex justify-center items-center py-4">
      {/* iPhone 16 Pro Titanium Outer Chassis */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[360px] rounded-[48px] p-[10px] bg-gradient-to-b from-[#383840] via-[#1E1E22] to-[#121215] shadow-2xl relative border border-white/20"
        style={{
          boxShadow: `0 28px 70px -10px rgba(0, 0, 0, 0.8), 0 0 30px -10px ${accent.glow}`,
        }}
      >
        {/* Outer Titanium Micro-Reflective Rim */}
        <div className="absolute inset-0 rounded-[48px] border border-white/10 pointer-events-none" />

        {/* Screen Bezel Frame */}
        <div className="w-full rounded-[38px] overflow-hidden bg-[#0A0A0C] border border-black/80 relative flex flex-col min-h-[580px]">
          {/* iOS Status Bar & Dynamic Island */}
          <div className="h-10 px-6 flex items-center justify-between text-white text-[11px] font-mono z-30 select-none bg-black/40 backdrop-blur-md">
            {/* Clock */}
            <span className="font-bold tracking-tight text-white/90">9:41</span>

            {/* Dynamic Island Capsule */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/10 relative overflow-hidden group cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-0.5">
                <span
                  className="w-1 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: accent.hex }}
                />
                <span
                  className="w-1 h-3 rounded-full animate-bounce delay-75"
                  style={{ backgroundColor: accent.hex }}
                />
                <span
                  className="w-1 h-1.5 rounded-full animate-bounce delay-150"
                  style={{ backgroundColor: accent.hex }}
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1.5 text-white/80">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0A0A0C]">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-6 flex items-center justify-center bg-black/40 backdrop-blur-md z-30">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
