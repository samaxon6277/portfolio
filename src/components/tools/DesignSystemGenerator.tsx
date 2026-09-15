import React, { useState, useMemo } from 'react';
import { 
  Palette, Sparkles, Check, Copy, Download, RefreshCw, 
  ShieldCheck, Eye, Layers, Type, Sliders, CheckCircle2, 
  XCircle, AlertCircle, FileText, Code2, Printer
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import { 
  generateShadeScale, 
  generateNeutrals, 
  getContrastRatio 
} from '../../utils/designSystemUtils';
import CustomSelect from '../ui/CustomSelect';
import CustomTabs from '../ui/CustomTabs';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomExportControls from '../ui/CustomExportControls';

const PERSONALITY_PRESETS: Record<string, { primary: string; secondary: string; neutralTone: 'warm' | 'cool' | 'slate'; headingFont: string; bodyFont: string; radius: string }> = {
  'Luxury High-End': {
    primary: '#D6B46A',
    secondary: '#1A1A1A',
    neutralTone: 'warm',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    radius: '16px'
  },
  'Modern Minimalist': {
    primary: '#0F172A',
    secondary: '#3B82F6',
    neutralTone: 'slate',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    radius: '12px'
  },
  'Bold & High-Energy': {
    primary: '#EF4444',
    secondary: '#0F172A',
    neutralTone: 'cool',
    headingFont: 'Syne, sans-serif',
    bodyFont: 'Inter, sans-serif',
    radius: '8px'
  },
  'Corporate Enterprise': {
    primary: '#1D4ED8',
    secondary: '#059669',
    neutralTone: 'slate',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    radius: '8px'
  },
  'Editorial & Cultured': {
    primary: '#78350F',
    secondary: '#1C1917',
    neutralTone: 'warm',
    headingFont: 'Cinzel, serif',
    bodyFont: 'Lora, serif',
    radius: '4px'
  },
  'High-Tech Cyber': {
    primary: '#06B6D4',
    secondary: '#8B5CF6',
    neutralTone: 'cool',
    headingFont: 'Space Grotesk, sans-serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    radius: '12px'
  }
};

export default function DesignSystemGenerator() {
  const { showToast } = useCustomUi();

  const [brandName, setBrandName] = useState('SamaXon Studio');
  const [personality, setPersonality] = useState<string>('Luxury High-End');
  const [primaryColor, setPrimaryColor] = useState('#D6B46A');
  const [secondaryColor, setSecondaryColor] = useState('#111111');
  const [neutralTone, setNeutralTone] = useState<'warm' | 'cool' | 'slate'>('warm');
  const [radiusChoice, setRadiusChoice] = useState('16px');
  const [headingFont, setHeadingFont] = useState('Syne, sans-serif');
  const [bodyFont, setBodyFont] = useState('Plus Jakarta Sans, sans-serif');

  const [activeTab, setActiveTab] = useState<'palette' | 'typography' | 'components' | 'export'>('palette');

  // Handle Preset Change
  const handlePresetSelect = (presetKey: string) => {
    setPersonality(presetKey);
    const p = PERSONALITY_PRESETS[presetKey];
    if (p) {
      setPrimaryColor(p.primary);
      setSecondaryColor(p.secondary);
      setNeutralTone(p.neutralTone);
      setHeadingFont(p.headingFont);
      setBodyFont(p.bodyFont);
      setRadiusChoice(p.radius);
      showToast(`Applied "${presetKey}" personality parameters.`, 'info');
    }
  };

  // Color scales
  const primaryShades = useMemo(() => generateShadeScale(primaryColor), [primaryColor]);
  const secondaryShades = useMemo(() => generateShadeScale(secondaryColor), [secondaryColor]);
  const neutralShades = useMemo(() => generateNeutrals(neutralTone), [neutralTone]);

  // Semantics
  const semanticColors = {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  };

  // Contrast checks
  const contrastOnWhite = useMemo(() => getContrastRatio(primaryColor, '#FFFFFF'), [primaryColor]);
  const contrastOnDark = useMemo(() => getContrastRatio(primaryColor, '#111111'), [primaryColor]);

  // Code exports
  const tailwindConfigCode = useMemo(() => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '${primaryShades['50']}',
          100: '${primaryShades['100']}',
          200: '${primaryShades['200']}',
          300: '${primaryShades['300']}',
          400: '${primaryShades['400']}',
          500: '${primaryShades['500']}',
          600: '${primaryShades['600']}',
          700: '${primaryShades['700']}',
          800: '${primaryShades['800']}',
          900: '${primaryShades['900']}',
          950: '${primaryShades['950']}',
        },
        neutral: {
          50: '${neutralShades['50']}',
          100: '${neutralShades['100']}',
          200: '${neutralShades['200']}',
          300: '${neutralShades['300']}',
          400: '${neutralShades['400']}',
          500: '${neutralShades['500']}',
          600: '${neutralShades['600']}',
          700: '${neutralShades['700']}',
          800: '${neutralShades['800']}',
          900: '${neutralShades['900']}',
          950: '${neutralShades['950']}',
        }
      },
      borderRadius: {
        'brand': '${radiusChoice}'
      },
      fontFamily: {
        heading: ['${headingFont.split(',')[0]}', 'sans-serif'],
        body: ['${bodyFont.split(',')[0]}', 'sans-serif']
      }
    }
  }
};`;
  }, [primaryShades, neutralShades, radiusChoice, headingFont, bodyFont]);

  const cssVariablesCode = useMemo(() => {
    return `:root {
  /* Brand Primary Shades */
  --color-brand-50: ${primaryShades['50']};
  --color-brand-100: ${primaryShades['100']};
  --color-brand-200: ${primaryShades['200']};
  --color-brand-300: ${primaryShades['300']};
  --color-brand-400: ${primaryShades['400']};
  --color-brand-500: ${primaryShades['500']};
  --color-brand-600: ${primaryShades['600']};
  --color-brand-700: ${primaryShades['700']};
  --color-brand-800: ${primaryShades['800']};
  --color-brand-900: ${primaryShades['900']};
  --color-brand-950: ${primaryShades['950']};

  /* Neutrals (<5% Saturation) */
  --color-neutral-50: ${neutralShades['50']};
  --color-neutral-100: ${neutralShades['100']};
  --color-neutral-200: ${neutralShades['200']};
  --color-neutral-900: ${neutralShades['900']};
  --color-neutral-950: ${neutralShades['950']};

  /* Border Radii & Typography */
  --radius-brand: ${radiusChoice};
  --font-heading: ${headingFont};
  --font-body: ${bodyFont};
}`;
  }, [primaryShades, neutralShades, radiusChoice, headingFont, bodyFont]);

  const tokensJson = useMemo(() => {
    return JSON.stringify({
      brandName,
      personality,
      colors: {
        primary: primaryShades,
        secondary: secondaryShades,
        neutral: neutralShades,
        semantic: semanticColors
      },
      typography: {
        heading: headingFont,
        body: bodyFont,
        scale: {
          display: '48px',
          h1: '36px',
          h2: '28px',
          h3: '22px',
          body: '16px',
          small: '14px',
          micro: '12px'
        }
      },
      radii: {
        brand: radiusChoice
      },
      contrastAudit: {
        onWhite: contrastOnWhite,
        onDark: contrastOnDark,
        wcagAaPassOnWhite: contrastOnWhite >= 4.5,
        wcagAaPassOnDark: contrastOnDark >= 4.5
      }
    }, null, 2);
  }, [brandName, personality, primaryShades, secondaryShades, neutralShades, headingFont, bodyFont, radiusChoice, contrastOnWhite, contrastOnDark]);

  const handleDownloadTokens = () => {
    const blob = new Blob([tokensJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-design-tokens.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Design tokens JSON downloaded.', 'success');
  };

  const handleDownloadCss = () => {
    const blob = new Blob([cssVariablesCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-variables.css`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSS variables downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="design-system-generator-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>Design Tokens & Typography Engine</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Design System Generator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Generate an enterprise design system token specification complete with 11-step mathematical color scales, WCAG AA/AAA contrast audits, typographical scales, component blueprints, and direct Tailwind CSS exports.
          </p>
        </div>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Column: Inputs */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Brand Attributes
            </h3>
            <p className="text-xs text-neutral-500">Configure core stylistic anchors.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1.5">
              Brand Entity Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </div>

          <CustomSelect
            label="Brand Archetype / Personality"
            value={personality}
            onChange={handlePresetSelect}
            options={Object.keys(PERSONALITY_PRESETS).map(key => ({
              value: key,
              label: key
            }))}
          />

          {/* Color Pickers */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Primary Accent Hex</span>
                <span className="font-mono text-[11px] text-neutral-500">{primaryColor}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Secondary Neutral Hex</span>
                <span className="font-mono text-[11px] text-neutral-500">{secondaryColor}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                />
              </div>
            </div>

            <CustomSelect
              label="Neutral Tint Substratum"
              value={neutralTone}
              onChange={(v) => setNeutralTone(v as any)}
              options={[
                { value: 'warm', label: 'Warm Tones (<5% Sand / Gold tint)' },
                { value: 'cool', label: 'Cool Tones (<5% Slate Blue tint)' },
                { value: 'slate', label: 'Balanced Slate Neutrals' }
              ]}
            />

            <CustomSelect
              label="Corner Radius Math"
              value={radiusChoice}
              onChange={setRadiusChoice}
              options={[
                { value: '4px', label: 'Sharp Architectural (4px)' },
                { value: '8px', label: 'Refined Modern (8px)' },
                { value: '16px', label: 'SamaXon Luxury (16px)' },
                { value: '24px', label: 'Organic Pill (24px)' }
              ]}
            />
          </div>
        </div>

        {/* Right 2 Columns: Live Interactive Preview */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#D6B46A]" />
              <span>Live Component Canvas & Contrast Audit</span>
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">
              Rendered with active tokens
            </span>
          </div>

          {/* Contrast Diagnostic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500">Contrast on Pure White</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold font-mono">{contrastOnWhite}:1</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    contrastOnWhite >= 4.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {contrastOnWhite >= 4.5 ? 'Passes AA' : 'Large Text Only'}
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full border border-neutral-300" style={{ backgroundColor: primaryColor }} />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111111] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Contrast on Deep Dark</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold font-mono text-white">{contrastOnDark}:1</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    contrastOnDark >= 4.5 ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'
                  }`}>
                    {contrastOnDark >= 4.5 ? 'Passes AA' : 'Sub-AA'}
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full border border-white/20" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>

          {/* Interactive Live Component Sandbox */}
          <div 
            className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-md space-y-6"
            style={{ borderRadius: radiusChoice }}
          >
            <div className="space-y-1">
              <span 
                className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider inline-block font-mono"
                style={{
                  backgroundColor: primaryShades['100'],
                  color: primaryShades['900'],
                  borderRadius: radiusChoice === '4px' ? '2px' : '999px'
                }}
              >
                {brandName} Showcase
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-neutral-900" style={{ fontFamily: headingFont }}>
                Engineered for Visual Clarity & High Conversion
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl" style={{ fontFamily: bodyFont }}>
                This card dynamically adopts your configured mathematical palette, corner radii, and contrast ratios in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 cursor-pointer shadow-sm flex items-center gap-2"
                style={{
                  backgroundColor: primaryColor,
                  color: contrastOnDark > contrastOnWhite ? '#111111' : '#FFFFFF',
                  borderRadius: radiusChoice
                }}
              >
                <span>Primary Trigger</span>
              </button>

              <button
                type="button"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                style={{ borderRadius: radiusChoice }}
              >
                <span>Secondary Neutral</span>
              </button>

              <button
                type="button"
                className="px-4 py-2 text-xs font-bold border transition-colors cursor-pointer"
                style={{
                  borderColor: primaryColor,
                  color: primaryShades['800'],
                  borderRadius: radiusChoice
                }}
              >
                <span>Ghost Outline</span>
              </button>
            </div>

            <div className="pt-2">
              <input
                type="text"
                readOnly
                value="Simulated input field styling"
                className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 text-neutral-700"
                style={{ borderRadius: radiusChoice }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Tabs */}
      <div className="space-y-4">
        <CustomTabs
          tabs={[
            { id: 'palette', label: '11-Step Palette', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'typography', label: 'Typography Scale', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'components', label: 'Design Tokens JSON', icon: <Code2 className="w-3.5 h-3.5" /> },
            { id: 'export', label: 'Tailwind Config Export', icon: <FileText className="w-3.5 h-3.5" /> }
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />

        {/* Tab 1: Palette */}
        {activeTab === 'palette' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6 animate-fade-in">
            <div>
              <h4 className="font-display text-base font-bold text-neutral-900">
                Full 11-Step Mathematical Color Ramp
              </h4>
              <p className="text-xs text-neutral-500">
                Tint and shade scale calculated using weighted linear luminance mixing.
              </p>
            </div>

            {/* Primary Ramp */}
            <div className="space-y-2">
              <span className="text-xs font-bold font-mono text-neutral-700">Primary Brand Accent ({primaryColor})</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
                {Object.entries(primaryShades).map(([step, hex]) => (
                  <div key={step} className="p-2.5 rounded-xl border border-neutral-200/80 space-y-2 flex flex-col justify-between">
                    <div className="h-12 w-full rounded-lg shadow-inner" style={{ backgroundColor: hex }} />
                    <div className="text-center">
                      <span className="block text-[11px] font-bold text-neutral-800">{step}</span>
                      <span className="block text-[9.5px] font-mono text-neutral-500 uppercase">{hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutral Ramp */}
            <div className="space-y-2 pt-4">
              <span className="text-xs font-bold font-mono text-neutral-700">Sophisticated Neutrals (&lt;5% {neutralTone} saturation)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
                {Object.entries(neutralShades).map(([step, hex]) => (
                  <div key={step} className="p-2.5 rounded-xl border border-neutral-200/80 space-y-2 flex flex-col justify-between">
                    <div className="h-12 w-full rounded-lg shadow-inner" style={{ backgroundColor: hex }} />
                    <div className="text-center">
                      <span className="block text-[11px] font-bold text-neutral-800">{step}</span>
                      <span className="block text-[9.5px] font-mono text-neutral-500 uppercase">{hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Typography */}
        {activeTab === 'typography' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6 animate-fade-in">
            <div>
              <h4 className="font-display text-base font-bold text-neutral-900">
                Typographic Hierarchy & Step Ratio
              </h4>
              <p className="text-xs text-neutral-500">
                Calibrated against a Major Second / Minor Third proportional scale.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-neutral-100">
              <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="w-36 shrink-0 text-xs font-mono font-bold text-neutral-400">Display (48px / 1.1)</div>
                <div className="text-4xl font-bold text-neutral-900 flex-1" style={{ fontFamily: headingFont }}>
                  Architectural Digital Precision
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="w-36 shrink-0 text-xs font-mono font-bold text-neutral-400">Heading 1 (36px / 1.2)</div>
                <div className="text-3xl font-bold text-neutral-900 flex-1" style={{ fontFamily: headingFont }}>
                  Bespoke High-Conversion Engineering
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="w-36 shrink-0 text-xs font-mono font-bold text-neutral-400">Heading 2 (28px / 1.25)</div>
                <div className="text-2xl font-bold text-neutral-900 flex-1" style={{ fontFamily: headingFont }}>
                  Structured Performance & Rapid Turnaround
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="w-36 shrink-0 text-xs font-mono font-bold text-neutral-400">Heading 3 (22px / 1.3)</div>
                <div className="text-xl font-bold text-neutral-900 flex-1" style={{ fontFamily: headingFont }}>
                  Audited WCAG Accessibility Standards
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="w-36 shrink-0 text-xs font-mono font-bold text-neutral-400">Body (16px / 1.6)</div>
                <p className="text-base text-neutral-600 leading-relaxed flex-1" style={{ fontFamily: bodyFont }}>
                  Every paragraph is styled with optimal character line lengths (65–75ch) and high-contrast foreground values to eliminate optical fatigue.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="w-36 shrink-0 text-xs font-mono font-bold text-neutral-400">Micro (12px / 1.4)</div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 flex-1">
                  Metadata Tag &bull; Version 2.0 &bull; Verified Standards
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Tokens JSON */}
        {activeTab === 'components' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-neutral-900">
                  Design Tokens JSON Specification
                </h4>
                <p className="text-xs text-neutral-500">
                  Ready for direct ingestion by Figma Token Studio or Style Dictionary.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CustomCopyButton text={tokensJson} label="Copy JSON" />
                <button
                  type="button"
                  onClick={handleDownloadTokens}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 text-xs font-mono overflow-x-auto max-h-96">
              {tokensJson}
            </pre>
          </div>
        )}

        {/* Tab 4: Tailwind Export */}
        {activeTab === 'export' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-neutral-900">
                  Tailwind CSS Configuration & CSS Variables
                </h4>
                <p className="text-xs text-neutral-500">
                  Drop-in code snippet for tailwind.config.js and global CSS.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CustomCopyButton text={tailwindConfigCode} label="Copy Tailwind" />
                <button
                  type="button"
                  onClick={handleDownloadCss}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSS</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 text-xs font-mono overflow-x-auto max-h-96">
              {tailwindConfigCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
