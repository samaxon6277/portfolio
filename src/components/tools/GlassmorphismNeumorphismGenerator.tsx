import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Layers, Sliders, Copy, Download, RotateCcw, 
  Eye, Check, ShieldCheck, Sun, Moon, Palette, Box, 
  HelpCircle, ExternalLink, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolHeader from './common/ToolHeader';
import { CopyButton, DownloadButton, ResetButton } from './common/ToolActions';

type GeneratorMode = 'glassmorphism' | 'neumorphism';
type PreviewComponent = 'card' | 'button' | 'input' | 'badge';
type LightDirection = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
type NeumorphicShape = 'flat' | 'concave' | 'convex' | 'pressed';

interface GlassSettings {
  bgColor: string;
  bgOpacity: number;
  backdropBlur: number;
  saturation: number;
  borderColor: string;
  borderOpacity: number;
  borderWidth: number;
  borderRadius: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowOpacity: number;
  innerHighlight: boolean;
  innerHighlightOpacity: number;
}

interface NeumorphSettings {
  baseColor: string;
  distance: number;
  blur: number;
  spread: number;
  borderRadius: number;
  lightDirection: LightDirection;
  shape: NeumorphicShape;
  lightIntensity: number;
  darkIntensity: number;
}

const DEFAULT_GLASS: GlassSettings = {
  bgColor: '#ffffff',
  bgOpacity: 25,
  backdropBlur: 16,
  saturation: 120,
  borderColor: '#ffffff',
  borderOpacity: 35,
  borderWidth: 1,
  borderRadius: 24,
  shadowX: 0,
  shadowY: 8,
  shadowBlur: 32,
  shadowSpread: 0,
  shadowOpacity: 12,
  innerHighlight: true,
  innerHighlightOpacity: 20
};

const DEFAULT_NEUMORPH: NeumorphSettings = {
  baseColor: '#e0e5ec',
  distance: 10,
  blur: 20,
  spread: 0,
  borderRadius: 24,
  lightDirection: 'top-left',
  shape: 'flat',
  lightIntensity: 90,
  darkIntensity: 30
};

// Color manipulation utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function adjustColorLightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(factor > 0 ? r + (255 - r) * factor : r + r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(factor > 0 ? g + (255 - g) * factor : g + g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(factor > 0 ? b + (255 - b) * factor : b + b * factor)));
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

export default function GlassmorphismNeumorphismGenerator() {
  const [mode, setMode] = useState<GeneratorMode>('glassmorphism');
  const [glass, setGlass] = useState<GlassSettings>(DEFAULT_GLASS);
  const [neumorph, setNeumorph] = useState<NeumorphSettings>(DEFAULT_NEUMORPH);
  const [previewComp, setPreviewComp] = useState<PreviewComponent>('card');
  const [backgroundTheme, setBackgroundTheme] = useState<'mesh' | 'sunset' | 'dark' | 'grid'>('mesh');

  // Compute CSS for Glassmorphism
  const glassStyle = useMemo(() => {
    const bgRgb = hexToRgb(glass.bgColor);
    const borderRgb = hexToRgb(glass.borderColor);
    
    const bgRgba = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${(glass.bgOpacity / 100).toFixed(2)})`;
    const borderRgba = `rgba(${borderRgb.r}, ${borderRgb.g}, ${borderRgb.b}, ${(glass.borderOpacity / 100).toFixed(2)})`;
    const shadowRgba = `rgba(0, 0, 0, ${(glass.shadowOpacity / 100).toFixed(2)})`;
    const highlightRgba = `rgba(255, 255, 255, ${(glass.innerHighlightOpacity / 100).toFixed(2)})`;

    const boxShadows = [
      `${glass.shadowX}px ${glass.shadowY}px ${glass.shadowBlur}px ${glass.shadowSpread}px ${shadowRgba}`
    ];
    if (glass.innerHighlight) {
      boxShadows.push(`inset 0 1px 1px 0 ${highlightRgba}`);
    }

    return {
      background: bgRgba,
      backdropFilter: `blur(${glass.backdropBlur}px) saturate(${glass.saturation}%)`,
      WebkitBackdropFilter: `blur(${glass.backdropBlur}px) saturate(${glass.saturation}%)`,
      border: `${glass.borderWidth}px solid ${borderRgba}`,
      borderRadius: `${glass.borderRadius}px`,
      boxShadow: boxShadows.join(', ')
    };
  }, [glass]);

  // Compute CSS for Neumorphism
  const neumorphStyle = useMemo(() => {
    const base = neumorph.baseColor;
    const lightColor = adjustColorLightness(base, neumorph.lightIntensity * 0.25);
    const darkColor = adjustColorLightness(base, -neumorph.darkIntensity * 0.35);

    let xMult = 1;
    let yMult = 1;
    if (neumorph.lightDirection === 'top-right') {
      xMult = -1;
      yMult = 1;
    } else if (neumorph.lightDirection === 'bottom-right') {
      xMult = -1;
      yMult = -1;
    } else if (neumorph.lightDirection === 'bottom-left') {
      xMult = 1;
      yMult = -1;
    }

    const lightX = -neumorph.distance * xMult;
    const lightY = -neumorph.distance * yMult;
    const darkX = neumorph.distance * xMult;
    const darkY = neumorph.distance * yMult;

    let boxShadow = '';
    let background = base;

    if (neumorph.shape === 'flat') {
      boxShadow = `${darkX}px ${darkY}px ${neumorph.blur}px ${neumorph.spread}px ${darkColor}, ${lightX}px ${lightY}px ${neumorph.blur}px ${neumorph.spread}px ${lightColor}`;
      background = base;
    } else if (neumorph.shape === 'pressed') {
      boxShadow = `inset ${darkX}px ${darkY}px ${neumorph.blur}px ${neumorph.spread}px ${darkColor}, inset ${lightX}px ${lightY}px ${neumorph.blur}px ${neumorph.spread}px ${lightColor}`;
      background = base;
    } else if (neumorph.shape === 'concave') {
      const gradientStart = adjustColorLightness(base, -10);
      const gradientEnd = adjustColorLightness(base, 10);
      background = `linear-gradient(145deg, ${gradientStart}, ${gradientEnd})`;
      boxShadow = `${darkX}px ${darkY}px ${neumorph.blur}px ${darkColor}, ${lightX}px ${lightY}px ${neumorph.blur}px ${lightColor}`;
    } else if (neumorph.shape === 'convex') {
      const gradientStart = adjustColorLightness(base, 10);
      const gradientEnd = adjustColorLightness(base, -10);
      background = `linear-gradient(145deg, ${gradientStart}, ${gradientEnd})`;
      boxShadow = `${darkX}px ${darkY}px ${neumorph.blur}px ${darkColor}, ${lightX}px ${lightY}px ${neumorph.blur}px ${lightColor}`;
    }

    return {
      background,
      borderRadius: `${neumorph.borderRadius}px`,
      boxShadow
    };
  }, [neumorph]);

  // Generated Clean CSS Text
  const generatedCss = useMemo(() => {
    if (mode === 'glassmorphism') {
      return `/* Glassmorphism CSS */
.glass-container {
  background: ${glassStyle.background};
  backdrop-filter: ${glassStyle.backdropFilter};
  -webkit-backdrop-filter: ${glassStyle.WebkitBackdropFilter};
  border: ${glassStyle.border};
  border-radius: ${glassStyle.borderRadius};
  box-shadow: ${glassStyle.boxShadow};
}`;
    } else {
      return `/* Neumorphism CSS */
.neumorphic-element {
  background: ${neumorphStyle.background};
  border-radius: ${neumorphStyle.borderRadius};
  box-shadow: ${neumorphStyle.boxShadow};
}`;
    }
  }, [mode, glassStyle, neumorphStyle]);

  // Generated Tailwind CSS Classes
  const generatedTailwind = useMemo(() => {
    if (mode === 'glassmorphism') {
      const bgRgb = hexToRgb(glass.bgColor);
      const borderRgb = hexToRgb(glass.borderColor);
      const bgHex = `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},${(glass.bgOpacity / 100).toFixed(2)})`;
      const borderHex = `rgba(${borderRgb.r},${borderRgb.g},${borderRgb.b},${(glass.borderOpacity / 100).toFixed(2)})`;
      
      return `bg-[${bgHex}] backdrop-blur-[${glass.backdropBlur}px] saturate-[${glass.saturation}%] border-[${glass.borderWidth}px] border-[${borderHex}] rounded-[${glass.borderRadius}px] shadow-[${glass.shadowX}px_${glass.shadowY}px_${glass.shadowBlur}px_rgba(0,0,0,${(glass.shadowOpacity / 100).toFixed(2)})]`;
    } else {
      return `bg-[${neumorph.baseColor}] rounded-[${neumorph.borderRadius}px] shadow-[${neumorphStyle.boxShadow.replace(/\s+/g, '_')}]`;
    }
  }, [mode, glass, neumorph, neumorphStyle]);

  const handleDownloadCss = () => {
    const blob = new Blob([generatedCss], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'glassmorphism' ? 'glassmorphism.css' : 'neumorphism.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (mode === 'glassmorphism') setGlass(DEFAULT_GLASS);
    else setNeumorph(DEFAULT_NEUMORPH);
  };

  return (
    <div className="space-y-8 text-left" id="glassmorphism-neumorphism-generator">
      <ToolHeader
        title="CSS Glassmorphism & Neumorphism Generator"
        description="Craft modern translucent frosted glass and soft tactile neumorphic UI elements with real-time CSS and Tailwind generation."
        icon={Layers}
        categoryName="Design & UX"
        categorySlug="design-ux"
        badgeText="100% IN-BROWSER · REAL-TIME CSS"
      />

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-neutral-200/80 rounded-2xl p-2 sm:p-3 shadow-xs">
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('glassmorphism')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              mode === 'glassmorphism'
                ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Glassmorphism (Frosted Glass)
          </button>
          <button
            type="button"
            onClick={() => setMode('neumorphism')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              mode === 'neumorphism'
                ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Neumorphism (Soft UI)
          </button>
        </div>

        <ResetButton onReset={handleReset} label="Reset to Defaults" />
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls Panel */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A68936]" />
              {mode === 'glassmorphism' ? 'Glass Attributes' : 'Neumorphic Attributes'}
            </h2>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Live Controls</span>
          </div>

          {mode === 'glassmorphism' ? (
            <div className="space-y-4">
              {/* Color & Opacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="glass-bg-color" className="text-neutral-700 font-bold">Surface Color</label>
                  <span className="text-neutral-500">{glass.bgColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="glass-bg-color"
                    type="color"
                    value={glass.bgColor}
                    onChange={(e) => setGlass(g => ({ ...g, bgColor: e.target.value }))}
                    className="w-10 h-8 rounded-lg cursor-pointer border border-neutral-300"
                  />
                  <input
                    type="text"
                    value={glass.bgColor}
                    onChange={(e) => setGlass(g => ({ ...g, bgColor: e.target.value }))}
                    className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Background Opacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="glass-opacity" className="text-neutral-700">Opacity</label>
                  <span className="text-neutral-500">{glass.bgOpacity}%</span>
                </div>
                <input
                  id="glass-opacity"
                  type="range"
                  min="0"
                  max="100"
                  value={glass.bgOpacity}
                  onChange={(e) => setGlass(g => ({ ...g, bgOpacity: Number(e.target.value) }))}
                  className="w-full accent-[#111111]"
                />
              </div>

              {/* Backdrop Blur */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="glass-blur" className="text-neutral-700 font-bold">Backdrop Blur</label>
                  <span className="text-neutral-500">{glass.backdropBlur}px</span>
                </div>
                <input
                  id="glass-blur"
                  type="range"
                  min="0"
                  max="40"
                  value={glass.backdropBlur}
                  onChange={(e) => setGlass(g => ({ ...g, backdropBlur: Number(e.target.value) }))}
                  className="w-full accent-[#111111]"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="glass-saturation" className="text-neutral-700">Backdrop Saturation</label>
                  <span className="text-neutral-500">{glass.saturation}%</span>
                </div>
                <input
                  id="glass-saturation"
                  type="range"
                  min="50"
                  max="250"
                  value={glass.saturation}
                  onChange={(e) => setGlass(g => ({ ...g, saturation: Number(e.target.value) }))}
                  className="w-full accent-[#111111]"
                />
              </div>

              {/* Border Color & Opacity */}
              <div className="pt-2 border-t border-neutral-100 space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="glass-border-color" className="text-neutral-700 font-bold">Border Refraction Line</label>
                  <span className="text-neutral-500">{glass.borderWidth}px / {glass.borderOpacity}%</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      id="glass-border-color"
                      type="color"
                      value={glass.borderColor}
                      onChange={(e) => setGlass(g => ({ ...g, borderColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300"
                    />
                    <span className="text-xs font-mono text-neutral-600">{glass.borderColor}</span>
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glass.borderOpacity}
                      onChange={(e) => setGlass(g => ({ ...g, borderOpacity: Number(e.target.value) }))}
                      className="w-full accent-[#111111]"
                      title="Border Opacity"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-neutral-500">Border Width</span>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={glass.borderWidth}
                      onChange={(e) => setGlass(g => ({ ...g, borderWidth: Number(e.target.value) }))}
                      className="w-full accent-[#111111]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-neutral-500">Corner Radius ({glass.borderRadius}px)</span>
                    <input
                      type="range"
                      min="0"
                      max="48"
                      value={glass.borderRadius}
                      onChange={(e) => setGlass(g => ({ ...g, borderRadius: Number(e.target.value) }))}
                      className="w-full accent-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* Shadow Controls */}
              <div className="pt-2 border-t border-neutral-100 space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-700 font-bold">Ambient Drop Shadow</span>
                  <span className="text-neutral-500">{glass.shadowBlur}px blur</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-neutral-500">Y Offset ({glass.shadowY}px)</span>
                    <input
                      type="range"
                      min="-30"
                      max="50"
                      value={glass.shadowY}
                      onChange={(e) => setGlass(g => ({ ...g, shadowY: Number(e.target.value) }))}
                      className="w-full accent-[#111111]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-neutral-500">Opacity ({glass.shadowOpacity}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={glass.shadowOpacity}
                      onChange={(e) => setGlass(g => ({ ...g, shadowOpacity: Number(e.target.value) }))}
                      className="w-full accent-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* Inner Highlight Checkbox */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <label htmlFor="inner-highlight" className="text-xs font-mono text-neutral-700 flex items-center gap-2 cursor-pointer">
                  <input
                    id="inner-highlight"
                    type="checkbox"
                    checked={glass.innerHighlight}
                    onChange={(e) => setGlass(g => ({ ...g, innerHighlight: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                  />
                  <span>Inner Specular Top Highlight</span>
                </label>
                {glass.innerHighlight && (
                  <span className="text-[10px] font-mono text-neutral-500">{glass.innerHighlightOpacity}%</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Base Color */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="neumorph-color" className="text-neutral-700 font-bold">Base Canvas Color</label>
                  <span className="text-neutral-500">{neumorph.baseColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="neumorph-color"
                    type="color"
                    value={neumorph.baseColor}
                    onChange={(e) => setNeumorph(n => ({ ...n, baseColor: e.target.value }))}
                    className="w-10 h-8 rounded-lg cursor-pointer border border-neutral-300"
                  />
                  <input
                    type="text"
                    value={neumorph.baseColor}
                    onChange={(e) => setNeumorph(n => ({ ...n, baseColor: e.target.value }))}
                    className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Preset Palette Chips */}
              <div className="flex items-center gap-2">
                {['#e0e5ec', '#f0f3f8', '#2b2d42', '#1e1e24', '#d1d8e0'].map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setNeumorph(n => ({ ...n, baseColor: col }))}
                    className="w-6 h-6 rounded-full border border-neutral-300 cursor-pointer transition-transform hover:scale-110"
                    style={{ backgroundColor: col }}
                    title={`Select ${col}`}
                  />
                ))}
              </div>

              {/* Shape / Surface Treatment */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-700 font-bold block">Surface Elevation</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['flat', 'concave', 'convex', 'pressed'] as NeumorphicShape[]).map((shp) => (
                    <button
                      key={shp}
                      type="button"
                      onClick={() => setNeumorph(n => ({ ...n, shape: shp }))}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                        neumorph.shape === shp
                          ? 'bg-[#111111] text-[#D6B46A]'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {shp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Light Direction */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-700 font-bold block">Light Source Angle</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['top-left', 'top-right', 'bottom-right', 'bottom-left'] as LightDirection[]).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setNeumorph(n => ({ ...n, lightDirection: dir }))}
                      className={`p-2 rounded-lg text-[10px] font-mono font-bold text-center transition-all cursor-pointer ${
                        neumorph.lightDirection === dir
                          ? 'bg-[#111111] text-[#D6B46A]'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {dir.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance & Blur */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label htmlFor="nm-distance" className="text-neutral-700">Distance</label>
                    <span className="text-neutral-500">{neumorph.distance}px</span>
                  </div>
                  <input
                    id="nm-distance"
                    type="range"
                    min="1"
                    max="40"
                    value={neumorph.distance}
                    onChange={(e) => setNeumorph(n => ({ ...n, distance: Number(e.target.value) }))}
                    className="w-full accent-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label htmlFor="nm-blur" className="text-neutral-700">Blur</label>
                    <span className="text-neutral-500">{neumorph.blur}px</span>
                  </div>
                  <input
                    id="nm-blur"
                    type="range"
                    min="1"
                    max="60"
                    value={neumorph.blur}
                    onChange={(e) => setNeumorph(n => ({ ...n, blur: Number(e.target.value) }))}
                    className="w-full accent-[#111111]"
                  />
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor="nm-radius" className="text-neutral-700">Corner Radius</label>
                  <span className="text-neutral-500">{neumorph.borderRadius}px</span>
                </div>
                <input
                  id="nm-radius"
                  type="range"
                  min="0"
                  max="60"
                  value={neumorph.borderRadius}
                  onChange={(e) => setNeumorph(n => ({ ...n, borderRadius: Number(e.target.value) }))}
                  className="w-full accent-[#111111]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Interactive Preview & Code Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Container */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#A68936]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                  Real-time Component Preview
                </span>
              </div>

              {/* Component Selector */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                {(['card', 'button', 'input', 'badge'] as PreviewComponent[]).map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setPreviewComp(comp)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold capitalize transition-all cursor-pointer ${
                      previewComp === comp
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Background Chooser */}
            {mode === 'glassmorphism' && (
              <div className="flex items-center justify-end gap-2 text-xs font-mono text-neutral-500">
                <span>Backdrop:</span>
                {(['mesh', 'sunset', 'dark', 'grid'] as const).map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBackgroundTheme(bg)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer ${
                      backgroundTheme === bg ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Preview Canvas */}
            <div 
              className="min-h-[340px] sm:min-h-[380px] rounded-2xl p-6 sm:p-10 flex items-center justify-center relative overflow-hidden transition-all"
              style={
                mode === 'glassmorphism'
                  ? backgroundTheme === 'mesh'
                    ? {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundImage: 'radial-gradient(at 20% 20%, #fbc2eb 0px, transparent 50%), radial-gradient(at 80% 80%, #a18cd1 0px, transparent 50%), radial-gradient(at 50% 50%, #fad0c4 0px, transparent 50%)'
                      }
                    : backgroundTheme === 'sunset'
                    ? {
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                        backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(255, 131, 61) 0%, rgb(249, 183, 23) 90%)'
                      }
                    : backgroundTheme === 'dark'
                    ? {
                        background: '#0d1117',
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(214, 180, 106, 0.25) 0%, transparent 60%)'
                      }
                    : {
                        background: '#f8fafc',
                        backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                      }
                  : {
                      backgroundColor: neumorph.baseColor
                    }
              }
            >
              {/* Render Selected Component */}
              {previewComp === 'card' && (
                <div
                  style={mode === 'glassmorphism' ? glassStyle : neumorphStyle}
                  className="max-w-xs w-full p-6 space-y-4 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#111111]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-neutral-800" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-neutral-900 text-base">
                      {mode === 'glassmorphism' ? 'Translucent Surface' : 'Tactile Card'}
                    </h4>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      Real optical refraction with calibrated specular highlights.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-800">SamaXon Studio</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900/10 text-neutral-900 font-bold">v3.2</span>
                  </div>
                </div>
              )}

              {previewComp === 'button' && (
                <button
                  type="button"
                  style={mode === 'glassmorphism' ? glassStyle : neumorphStyle}
                  className="px-8 py-3.5 text-xs font-mono font-bold text-neutral-900 cursor-pointer active:scale-95 transition-transform"
                >
                  Interactive Component CTA
                </button>
              )}

              {previewComp === 'input' && (
                <div className="max-w-xs w-full space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-800 block">Search Studio</label>
                  <input
                    type="text"
                    placeholder="Type anything here..."
                    style={mode === 'glassmorphism' ? glassStyle : neumorphStyle}
                    className="w-full px-4 py-3 text-xs font-mono text-neutral-900 placeholder:text-neutral-500 focus:outline-none transition-all"
                  />
                </div>
              )}

              {previewComp === 'badge' && (
                <div
                  style={mode === 'glassmorphism' ? glassStyle : neumorphStyle}
                  className="px-5 py-2 inline-flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Production Ready</span>
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Panel */}
          <div className="bg-[#111111] text-[#FFFDF8] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D6B46A]">
                Generated Code Output
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton textToCopy={generatedCss} label="Copy CSS" />
                <CopyButton textToCopy={generatedTailwind} label="Copy Tailwind" />
                <DownloadButton onDownload={handleDownloadCss} label="Download .css" />
              </div>
            </div>

            {/* Standard CSS Snippet */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-neutral-400">Vanilla CSS</div>
              <pre className="p-3.5 bg-black/50 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 overflow-x-auto selection:bg-[#D6B46A]/30">
                {generatedCss}
              </pre>
            </div>

            {/* Tailwind Classes Snippet */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-neutral-400">Tailwind CSS Classes</div>
              <pre className="p-3.5 bg-black/50 border border-neutral-800 rounded-xl font-mono text-xs text-[#D6B46A] overflow-x-auto whitespace-pre-wrap selection:bg-[#D6B46A]/30">
                {generatedTailwind}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Educational & Practical Technical Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#A68936]" />
            How Glassmorphism Works
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Glassmorphism mimics the optical properties of frosted glass in the browser. It combines semi-transparent background fills with <code>backdrop-filter: blur()</code> to diffuse light from underlying page layers, elevated with subtle border gradients that emulate specular edge reflections.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A68936]" />
            How Neumorphism Works
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Neumorphism (Soft UI) creates a tactile, extruded appearance by matching the element’s background color identically to the parent container. Two distinct drop shadows (one lighter than the canvas and one darker) are projected at opposing angles, simulating a 45-degree directional light source.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-neutral-900 font-display">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs text-neutral-600">
          <div>
            <p className="font-bold text-neutral-900">Does Glassmorphism work across all major browsers?</p>
            <p className="mt-1">
              Yes. Modern versions of Chrome, Safari, Edge, and Firefox support <code>backdrop-filter</code> natively. We automatically include the <code>-webkit-backdrop-filter</code> vendor prefix to guarantee compatibility with iOS Safari and macOS WebKit engines.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">What are the accessibility considerations for Neumorphism?</p>
            <p className="mt-1">
              Because Neumorphism relies on subtle shadow contrasts rather than distinct color boundaries, it can present low-contrast challenges under WCAG standards. We recommend ensuring that text and iconography placed inside neumorphic cards exceed the 4.5:1 contrast ratio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
