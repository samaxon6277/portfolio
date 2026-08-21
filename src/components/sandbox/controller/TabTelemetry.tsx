import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, Globe, Cpu, Server } from 'lucide-react';
import { SandboxState, AccentColorToken } from '../types';

interface TabTelemetryProps {
  state: SandboxState;
  accent: AccentColorToken;
}

export const TabTelemetry: React.FC<TabTelemetryProps> = ({ state, accent }) => {
  // Live Active Visitors tick simulation (18 - 26)
  const [activeVisitors, setActiveVisitors] = useState<number>(22);
  const [latencyTicks, setLatencyTicks] = useState<number>(0.38);

  useEffect(() => {
    const visitorInterval = setInterval(() => {
      setActiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const next = prev + delta;
        return Math.min(26, Math.max(18, next));
      });
      setLatencyTicks(Number((0.34 + Math.random() * 0.08).toFixed(2)));
    }, 2800);

    return () => clearInterval(visitorInterval);
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* 1. Real-time Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Active Visitors */}
        <div className="p-3.5 rounded-2xl bg-charcoal/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-warm-grey">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE VISITORS</span>
            </span>
            <Globe className="w-3 h-3" style={{ color: accent.hex }} />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display font-bold text-2xl text-soft-ivory">
              {activeVisitors}
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">● Active</span>
          </div>
          <span className="text-[8px] font-mono text-warm-grey mt-1">Multi-Region Concurrent</span>
        </div>

        {/* Metric 2: Edge Response TTFB */}
        <div className="p-3.5 rounded-2xl bg-charcoal/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-warm-grey">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>EDGE TTFB</span>
            </span>
            <Server className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display font-bold text-2xl text-soft-ivory">
              {latencyTicks}ms
            </span>
            <span className="text-[9px] font-mono text-amber-400 font-bold">Fast</span>
          </div>
          <span className="text-[8px] font-mono text-warm-grey mt-1">Global Edge CDN Pop</span>
        </div>
      </div>

      {/* 2. SVG Animated Sparkline Chart */}
      <div className="p-4 rounded-2xl bg-charcoal/90 border border-champagne-gold/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-soft-ivory font-sans">
              Lead Capture Velocity &amp; Throughput
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold">99.99% Uptime</span>
        </div>

        {/* Sparkline Canvas */}
        <div className="w-full h-28 relative pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
            <defs>
              <linearGradient id="telemetryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={accent.hex} stopOpacity="0.45" />
                <stop offset="100%" stopColor={accent.hex} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#ffffff10" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#ffffff10" strokeDasharray="3 3" />

            {/* Gradient Fill */}
            <path
              d="M 0 70 L 30 55 L 60 62 L 90 40 L 120 48 L 150 25 L 180 38 L 210 18 L 240 30 L 270 12 L 300 22 L 300 80 L 0 80 Z"
              fill="url(#telemetryGrad)"
            />

            {/* Line stroke */}
            <path
              d="M 0 70 L 30 55 L 60 62 L 90 40 L 120 48 L 150 25 L 180 38 L 210 18 L 240 30 L 270 12 L 300 22"
              fill="none"
              stroke={accent.hex}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Current point indicator */}
            <circle cx="300" cy="22" r="4" fill="#ffffff" stroke={accent.hex} strokeWidth="2" />
          </svg>
        </div>

        <div className="flex justify-between text-[8.5px] font-mono text-warm-grey pt-1 border-t border-white/5">
          <span>T - 60s</span>
          <span>Lead Ingestion Rate: High</span>
          <span>Live Now</span>
        </div>
      </div>

      {/* 3. Security Protocols Audit */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security &amp; Sandboxing Protocols:</span>
        </label>

        <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
          <div className="p-2.5 rounded-xl bg-charcoal/60 border border-white/5 text-center">
            <span className="text-emerald-400 font-bold block">TLS 1.3 / SSL</span>
            <span className="text-warm-grey text-[8px]">Encrypted Pipe</span>
          </div>
          <div className="p-2.5 rounded-xl bg-charcoal/60 border border-white/5 text-center">
            <span className="text-emerald-400 font-bold block">SHA-256</span>
            <span className="text-warm-grey text-[8px]">Signature Verified</span>
          </div>
          <div className="p-2.5 rounded-xl bg-charcoal/60 border border-white/5 text-center">
            <span className="text-emerald-400 font-bold block">Isolated Core</span>
            <span className="text-warm-grey text-[8px]">Zero Cross-Bleed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
