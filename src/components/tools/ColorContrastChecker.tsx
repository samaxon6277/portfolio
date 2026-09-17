import React, { useState, useMemo } from 'react';
import { 
  Palette, CheckCircle2, XCircle, ArrowLeftRight, Copy, 
  RotateCcw, Sparkles, Sliders, Eye, HelpCircle, ShieldCheck
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, ResetButton } from './common/ToolActions';

// WCAG 2.1 Standard Luminance and Contrast Calculation
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1)}`;
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// HSL utilities for Harmony Palettes
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = (h % 360 + 360) % 360 / 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Find closest accessible color by adjusting lightness
function findAccessibleVariant(fgHex: string, bgHex: string, targetRatio: number): string | null {
  const fg = hexToRgb(fgHex);
  const { h, s, l } = rgbToHsl(fg.r, fg.g, fg.b);
  const bgL = getRelativeLuminance(hexToRgb(bgHex).r, hexToRgb(bgHex).g, hexToRgb(bgHex).b);

  // If background is light, make foreground darker; if background is dark, make foreground lighter
  const direction = bgL > 0.5 ? -1 : 1;

  let currentL = l;
  for (let i = 0; i < 100; i++) {
    currentL += direction * 1;
    if (currentL < 0 || currentL > 100) break;
    const candidateHex = hslToHex(h, s, currentL);
    if (calculateContrastRatio(candidateHex, bgHex) >= targetRatio) {
      return candidateHex;
    }
  }
  return null;
}

export default function ColorContrastChecker() {
  const [fgColor, setFgColor] = useState('#111111');
  const [bgColor, setBgColor] = useState('#D6B46A');

  const ratio = useMemo(() => {
    return parseFloat(calculateContrastRatio(fgColor, bgColor).toFixed(2));
  }, [fgColor, bgColor]);

  // WCAG 2.1 Criteria Evaluation
  const wcagResults = useMemo(() => {
    return {
      normalAa: ratio >= 4.5,
      normalAaa: ratio >= 7.0,
      largeAa: ratio >= 3.0,
      largeAaa: ratio >= 4.5,
      uiComponents: ratio >= 3.0
    };
  }, [ratio]);

  // Harmony Palettes based on Foreground Color
  const harmonies = useMemo(() => {
    const fgRgb = hexToRgb(fgColor);
    const { h, s, l } = rgbToHsl(fgRgb.r, fgRgb.g, fgRgb.b);

    return [
      { name: 'Complementary (180°)', hex: hslToHex(h + 180, s, l) },
      { name: 'Analogous Left (-30°)', hex: hslToHex(h - 30, s, l) },
      { name: 'Analogous Right (+30°)', hex: hslToHex(h + 30, s, l) },
      { name: 'Triadic 1 (+120°)', hex: hslToHex(h + 120, s, l) },
      { name: 'Triadic 2 (+240°)', hex: hslToHex(h + 240, s, l) }
    ];
  }, [fgColor]);

  // Suggested Accessible Color Variant
  const suggestedFix = useMemo(() => {
    if (wcagResults.normalAa) return null;
    return findAccessibleVariant(fgColor, bgColor, 4.5);
  }, [fgColor, bgColor, wcagResults.normalAa]);

  const handleSwap = () => {
    setFgColor(bgColor);
    setBgColor(fgColor);
  };

  return (
    <div className="space-y-8 text-left" id="color-contrast-checker">
      <ToolHeader
        title="Color Contrast Checker & Palette Harmony"
        description="Verify WCAG 2.1 contrast ratios for text and UI components, simulate real-world layout contexts, and generate harmonized color palettes."
        icon={Palette}
        categoryName="Design & UX"
        categorySlug="design-ux"
        badgeText="100% MATHEMATICAL · WCAG 2.1 COMPLIANT"
      />

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Color Pickers & Ratio Card */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A68936]" />
              Color Pair Configuration
            </h3>
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-mono font-bold text-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap
            </button>
          </div>

          <div className="space-y-4">
            {/* Foreground Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="fg-color-picker" className="font-bold text-neutral-800">Foreground (Text / Icon)</label>
                <span className="text-neutral-500">{fgColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="fg-color-picker"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-9 rounded-lg border border-neutral-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-mono uppercase"
                />
              </div>
            </div>

            {/* Background Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="bg-color-picker" className="font-bold text-neutral-800">Background (Canvas / Card)</label>
                <span className="text-neutral-500">{bgColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="bg-color-picker"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-9 rounded-lg border border-neutral-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Contrast Score Big Badge */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-white text-center space-y-2 border border-neutral-800 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Contrast Ratio</span>
            <div className="font-display font-black text-4xl sm:text-5xl text-[#D6B46A]">
              {ratio}:1
            </div>
            <p className="text-xs font-mono text-neutral-300">
              {ratio >= 7.0
                ? 'Enhanced Contrast (Passes all WCAG AAA)'
                : ratio >= 4.5
                ? 'Standard Contrast (Passes WCAG AA)'
                : ratio >= 3.0
                ? 'Moderate (Passes Large Text & UI AA)'
                : 'Fails WCAG Minimum Requirements'}
            </p>
          </div>

          {/* Accessible Auto-Fix Suggestion */}
          {suggestedFix && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900 font-mono">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Accessible Color Suggestion</span>
              </div>
              <p className="text-amber-800">
                Adjust foreground lightness to <code>{suggestedFix}</code> to reach the 4.5:1 AA standard.
              </p>
              <button
                type="button"
                onClick={() => setFgColor(suggestedFix)}
                className="w-full py-2 bg-[#111111] text-[#D6B46A] rounded-xl font-mono font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Apply Accessible Color
              </button>
            </div>
          )}
        </div>

        {/* Right Column: WCAG Breakdown & Real Context Simulation */}
        <div className="lg:col-span-7 space-y-6">
          {/* WCAG Compliance Matrix */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#A68936]" />
              WCAG 2.1 Criteria Evaluation
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Normal Text (AA)', req: '≥ 4.5:1', pass: wcagResults.normalAa },
                { title: 'Normal Text (AAA)', req: '≥ 7.0:1', pass: wcagResults.normalAaa },
                { title: 'Large Text (AA)', req: '≥ 3.0:1', pass: wcagResults.largeAa },
                { title: 'Large Text (AAA)', req: '≥ 4.5:1', pass: wcagResults.largeAaa },
                { title: 'UI Elements & Borders (AA)', req: '≥ 3.0:1', pass: wcagResults.uiComponents }
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    item.pass
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold font-mono">{item.title}</div>
                    <div className="text-[10px] opacity-70">Target: {item.req}</div>
                  </div>
                  {item.pass ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> PASS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-800">
                      <XCircle className="w-3 h-3" /> FAIL
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Real Context Simulation */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Eye className="w-4 h-4 text-[#A68936]" />
              Real Component Rendering
            </span>

            <div
              className="p-6 sm:p-8 rounded-2xl space-y-4 transition-colors border border-neutral-200/60"
              style={{ backgroundColor: bgColor, color: fgColor }}
            >
              <h2 className="font-display font-black text-xl sm:text-2xl">
                Heading Preview (24px Bold)
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Standard body paragraph text demonstrates visual comfort and optical legibility at scale. High contrast ensures effortless comprehension.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  style={{ backgroundColor: fgColor, color: bgColor }}
                  className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold shadow-xs cursor-pointer"
                >
                  Inverted Button CTA
                </button>
                <div
                  style={{ borderColor: fgColor }}
                  className="px-4 py-2 border rounded-xl text-xs font-mono"
                >
                  Outlined Component
                </div>
              </div>
            </div>
          </div>

          {/* Color Harmonies */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Palette className="w-4 h-4 text-[#A68936]" />
              Harmonized Palette Coordinates
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {harmonies.map((h) => {
                const harmRatio = calculateContrastRatio(h.hex, bgColor).toFixed(1);
                return (
                  <div key={h.name} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full border border-neutral-300" style={{ backgroundColor: h.hex }} />
                      <div>
                        <div className="text-xs font-mono font-bold text-neutral-900">{h.hex}</div>
                        <div className="text-[10px] text-neutral-500">{h.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setFgColor(h.hex)}
                        className="text-[10px] font-mono text-[#A68936] hover:underline font-bold"
                      >
                        Use ({harmRatio}:1)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
