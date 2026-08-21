import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import { AccentColorToken } from '../types';

interface PreviewMaintenanceProps {
  accent: AccentColorToken;
}

export const PreviewMaintenance: React.FC<PreviewMaintenanceProps> = ({ accent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-30 bg-matte-black/85 flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <motion.div
        initial={{ scale: 0.88, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="max-w-md w-full bg-charcoal/90 border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-4"
        style={{
          borderColor: `${accent.hex}40`,
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px -5px ${accent.glow}`,
        }}
      >
        {/* Top pulse radar */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center border relative z-10"
            style={{
              backgroundColor: `${accent.hex}15`,
              borderColor: `${accent.hex}50`,
            }}
          >
            <ShieldCheck className="w-8 h-8" style={{ color: accent.hex }} />
          </div>
          <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-35"
            style={{ backgroundColor: accent.hex }}
          />
        </div>

        {/* Badge */}
        <div
          className="px-3 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase flex items-center gap-1.5"
          style={{
            backgroundColor: `${accent.hex}20`,
            color: accent.hex,
            border: `1px solid ${accent.hex}40`,
          }}
        >
          <Lock className="w-3 h-3" />
          <span>Security Protocol Active</span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-lg sm:text-xl text-soft-ivory tracking-tight">
            Private System Upgrade in Progress
          </h3>
          <p className="text-xs text-warm-grey max-w-xs mx-auto leading-relaxed">
            Access is currently restricted to authorized enterprise administrators. Live services will resume shortly with zero data interruption.
          </p>
        </div>

        <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-warm-grey">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Integrity: 100% Verified</span>
          </span>
          <span className="text-soft-ivory/60">SHA-256 Vault Locked</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
