import React, { useState, useEffect } from 'react';
import { 
  Minimize2, Crop, Sparkles, Wand2, FileText, Image as ImageIcon, 
  ArrowRight, ShieldCheck, Zap, Lock, HeartHandshake, CheckCircle2, 
  RefreshCw, Calculator, AlertTriangle, SearchCode
} from 'lucide-react';
import { getToolsConfig, ToolItemConfig } from '../../utils/toolsConfig';

interface ToolsOverviewProps {
  onSelectTool: (toolId: 'analyzer' | 'compressor' | 'resizer' | 'converter' | 'calculator' | 'bg-remover' | 'upscaler' | 'vectorizer' | 'pdf-tool') => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  SearchCode,
  RefreshCw,
  Calculator,
  Minimize2,
  Crop,
  FileText,
  Wand2,
  Sparkles,
  ImageIcon
};

export default function ToolsOverview({ onSelectTool }: ToolsOverviewProps) {
  const [tools, setTools] = useState<ToolItemConfig[]>(getToolsConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setTools(getToolsConfig());
    };
    window.addEventListener('samaxon_tools_status_updated', handleUpdate);
    return () => window.removeEventListener('samaxon_tools_status_updated', handleUpdate);
  }, []);

  const toolFeaturePills: Record<string, string[]> = {
    analyzer: ['SSL & Security Vulnerabilities', 'Code Bugs & Missing Alt Tags', 'Missing SEO Keywords Engine'],
    converter: ['WEBP · PNG · JPG · ICO', 'Batch ZIP Export', 'Alpha Transparency'],
    calculator: ['Basic & Scientific Pro', 'Loan EMI & GST Solver', 'SIP Wealth & Unit Matrix'],
    compressor: ['Target KB Precision', 'Client-Side Canvas', 'Real-Time File Comparison'],
    resizer: ['Passport & Visa Presets', '300 DPI Print Fidelity', 'Cover & Contain Scaling'],
    'pdf-tool': ['Compress Under 100KB', 'Draw, Type or Scan Sign', 'Interactive Drag Placement'],
    'bg-remover': ['Smart Edge Isolation', 'White/Light Studio Presets', 'Custom Color Backdrops'],
    upscaler: ['4K Super-Resolution', 'Unsharp Detail Enhancer', 'Bicubic GPU Acceleration'],
    vectorizer: ['Infinite Scalable SVG', 'Bezier Edge Smoothing', 'Clean Copyable XML']
  };

  const toolFooterBadges: Record<string, string> = {
    analyzer: 'Deep Diagnostic Scan · 100% Free',
    converter: '100% Client-Side · Unlimited',
    calculator: 'Tactile Audio · Keyboard Ready',
    compressor: 'Lossless WebP · 1-Click Export',
    resizer: '300 DPI · Free Forever',
    'pdf-tool': 'Official Govt Specs · Zero Uploads',
    'bg-remover': 'In-Browser Matting · Zero Uploads',
    upscaler: 'GPU Accelerated · No Watermarks',
    vectorizer: 'Crisp Vector Paths · Clean Code'
  };

  return (
    <div className="space-y-16 text-left" id="tools-overview-catalog">
      {/* All 8 Tools in Unified, First-Class Luxury Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {tools.map((tool) => {
          const Icon = ICON_MAP[tool.iconName] || RefreshCw;
          const pills = toolFeaturePills[tool.id] || ['Fast & Secure', 'Client-Side', 'Free Forever'];
          const footerBadge = toolFooterBadges[tool.id] || '100% Client-Side';

          return (
            <div 
              key={tool.id}
              onClick={() => {
                if (tool.enabled) {
                  onSelectTool(tool.id);
                } else {
                  alert(tool.maintenanceNotice || `${tool.name} is currently undergoing scheduled maintenance. Please check back shortly.`);
                }
              }}
              className={`group bg-white border rounded-[32px] p-8 sm:p-10 shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                tool.enabled
                  ? 'border-[#D6B46A]/25 hover:border-[#D6B46A] hover:shadow-[0_16px_40px_rgba(214,180,106,0.18)]'
                  : 'border-amber-300/60 bg-[#FFFDF8] opacity-90'
              }`}
            >
              {/* Subtle Gold Ambient Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105 shadow-md ${
                    tool.enabled
                      ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A]/30 group-hover:border-[#D6B46A]'
                      : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {tool.enabled ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-bold rounded-full">
                      ✦ Live & Ready
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-300 text-[10px] font-mono uppercase font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Maintenance
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-2xl text-[#111111] group-hover:text-[#BFA15A] transition-colors">
                      {tool.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#BFA15A] text-[9px] font-mono uppercase font-bold rounded">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-sm text-[#8A8178] leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {pills.map((pill, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-[#D6B46A]/15 flex items-center justify-between relative z-10 mt-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
                  {tool.enabled ? footerBadge : (tool.maintenanceNotice || 'Under Maintenance')}
                </span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${
                  tool.enabled
                    ? 'bg-[#111111] text-[#D6B46A] group-hover:translate-x-1'
                    : 'bg-neutral-300 text-neutral-600'
                }`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust, Security & Performance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#D6B46A]/20">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#D6B46A]/10 text-[#BFA15A] border border-[#D6B46A]/25 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-left">
            <h5 className="font-display font-bold text-xs text-[#111111] uppercase tracking-wider">
              Zero Server Uploads
            </h5>
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Every operation executes 100% inside your local browser memory via HTML5 Canvas & WebAssembly. Your photos and documents never touch our cloud.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#D6B46A]/10 text-[#BFA15A] border border-[#D6B46A]/25 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-left">
            <h5 className="font-display font-bold text-xs text-[#111111] uppercase tracking-wider">
              Instant Processing Speed
            </h5>
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Zero network latency or queue waiting times. Calculations, compression, and conversions finish in real time on your GPU.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#D6B46A]/10 text-[#BFA15A] border border-[#D6B46A]/25 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-left">
            <h5 className="font-display font-bold text-xs text-[#111111] uppercase tracking-wider">
              No Watermarks or Limits
            </h5>
            <p className="text-xs text-[#8A8178] leading-relaxed">
              100% free and unrestricted. No subscription requirements, no watermarks, and no sign-up forms required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
