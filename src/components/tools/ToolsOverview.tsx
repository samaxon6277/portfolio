import React from 'react';
import { 
  Minimize2, Crop, Sparkles, Wand2, FileText, Image as ImageIcon, 
  ArrowRight, ShieldCheck, Zap, Lock, HeartHandshake, CheckCircle2, 
  RefreshCw, Calculator 
} from 'lucide-react';

interface ToolsOverviewProps {
  onSelectTool: (toolId: 'compressor' | 'resizer' | 'converter' | 'calculator') => void;
}

export default function ToolsOverview({ onSelectTool }: ToolsOverviewProps) {
  return (
    <div className="space-y-16 text-left" id="tools-overview-catalog">
      {/* Featured Primary Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tool 1: Universal Batch Image Converter */}
        <div 
          onClick={() => onSelectTool('converter')}
          className="group bg-white border border-[#D6B46A]/25 hover:border-[#D6B46A] rounded-[32px] p-8 sm:p-10 shadow-sm hover:shadow-[0_16px_40px_rgba(214,180,106,0.18)] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:border-[#D6B46A] transition-all group-hover:scale-105 shadow-md">
                <RefreshCw className="w-7 h-7" />
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-bold rounded-full">
                ✦ Live & Ready
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-2xl text-[#111111] group-hover:text-[#BFA15A] transition-colors">
                  Batch Image Converter
                </h3>
                <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#BFA15A] text-[9px] font-mono uppercase font-bold rounded">
                  Multi-Format
                </span>
              </div>
              <p className="text-sm text-[#8A8178] leading-relaxed">
                Convert between PNG, JPG, WEBP, AVIF, BMP, GIF, and ICO favicon standards instantly in-browser. Zero server uploads, custom quality slider, transparent alpha preservation, and 1-click batch ZIP downloads.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                WEBP · PNG · JPG · ICO
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Batch ZIP Export
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Alpha Transparency
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D6B46A]/15 flex items-center justify-between relative z-10 mt-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
              100% Client-Side · Unlimited
            </span>
            <div className="w-9 h-9 rounded-full bg-[#111111] text-[#D6B46A] flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tool 2: Universal Multi-Paradigm Calculator */}
        <div 
          onClick={() => onSelectTool('calculator')}
          className="group bg-white border border-[#D6B46A]/25 hover:border-[#D6B46A] rounded-[32px] p-8 sm:p-10 shadow-sm hover:shadow-[0_16px_40px_rgba(214,180,106,0.18)] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:border-[#D6B46A] transition-all group-hover:scale-105 shadow-md">
                <Calculator className="w-7 h-7" />
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-bold rounded-full">
                ✦ Live & Ready
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-2xl text-[#111111] group-hover:text-[#BFA15A] transition-colors">
                  Universal Multi-Calculator
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 text-[9px] font-mono uppercase font-bold rounded">
                  Pro Engine
                </span>
              </div>
              <p className="text-sm text-[#8A8178] leading-relaxed">
                Realistic, smooth multi-paradigm calculator covering every calculation: Scientific Pro (trig, powers, calculus), Loan & EMI planner, Indian GST & tax solver, Mutual Fund SIP compound wealth, two-way unit converter, and programmer Hex/Bin.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Scientific FX-991
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Loan EMI & GST Solver
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                SIP & Programmer Math
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D6B46A]/15 flex items-center justify-between relative z-10 mt-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
              Tactile Audio · Keyboard Ready
            </span>
            <div className="w-9 h-9 rounded-full bg-[#111111] text-[#D6B46A] flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tool 3: Photo Compressor */}
        <div 
          onClick={() => onSelectTool('compressor')}
          className="group bg-white border border-[#D6B46A]/25 hover:border-[#D6B46A] rounded-[32px] p-8 sm:p-10 shadow-sm hover:shadow-[0_16px_40px_rgba(214,180,106,0.18)] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:border-[#D6B46A] transition-all group-hover:scale-105 shadow-md">
                <Minimize2 className="w-7 h-7" />
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-bold rounded-full">
                ✦ Live & Ready
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-2xl text-[#111111] group-hover:text-[#BFA15A] transition-colors">
                  Photo Compressor
                </h3>
                <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#BFA15A] text-[9px] font-mono uppercase font-bold rounded">
                  Pro Engine
                </span>
              </div>
              <p className="text-sm text-[#8A8178] leading-relaxed">
                Compress JPG, PNG, WEBP and AVIF photos up to 95% with zero visible quality loss. Includes interactive before/after split slider, batch ZIP export, and exact target KB mode (under 50KB/100KB for government portals).
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Interactive Split Comparison
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Target KB Solver
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Batch ZIP Download
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D6B46A]/15 flex items-center justify-between relative z-10 mt-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
              100% Client-Side · Unlimited
            </span>
            <div className="w-9 h-9 rounded-full bg-[#111111] text-[#D6B46A] flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tool 4: Photo Resizer */}
        <div 
          onClick={() => onSelectTool('resizer')}
          className="group bg-white border border-[#D6B46A]/25 hover:border-[#D6B46A] rounded-[32px] p-8 sm:p-10 shadow-sm hover:shadow-[0_16px_40px_rgba(214,180,106,0.18)] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:border-[#D6B46A] transition-all group-hover:scale-105 shadow-md">
                <Crop className="w-7 h-7" />
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-bold rounded-full">
                ✦ Live & Ready
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-2xl text-[#111111] group-hover:text-[#BFA15A] transition-colors">
                  Photo Resizer & Transformer
                </h3>
                <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#BFA15A] text-[9px] font-mono uppercase font-bold rounded">
                  300 DPI
                </span>
              </div>
              <p className="text-sm text-[#8A8178] leading-relaxed">
                Resize by pixels, cm, mm, inch or percentage with aspect-ratio locking and 300 DPI print fidelity. Includes 1-click official ID standards (Indian Passport 3.5×4.5cm, US Visa 2×2", UPSC signature) and social media crops.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Passport & Visa Presets
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Cover, Contain & Stretch
              </span>
              <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#111111] text-[11px] font-mono rounded-lg">
                Rotate 90° & Flip H/V
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D6B46A]/15 flex items-center justify-between relative z-10 mt-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
              100% Client-Side · Free Forever
            </span>
            <div className="w-9 h-9 rounded-full bg-[#111111] text-[#D6B46A] flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>


      {/* Upcoming AI Studio Tools Roadmap Section */}
      <div className="bg-[#111111] text-soft-ivory border border-[#D6B46A]/30 rounded-[32px] p-8 sm:p-12 relative overflow-hidden space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
            ✦ SMR AI Innovation Lab
          </span>
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
            Upcoming AI Tools in Active Development
          </h3>
          <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
            We are engineering a full suite of zero-cost, privacy-first AI productivity tools to supercharge developers, founders, and content creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Wand2,
              title: 'AI Background Remover',
              desc: '1-click neural segmentation to remove portrait & product backgrounds with clean hair detail.',
              status: 'In Alpha'
            },
            {
              icon: Sparkles,
              title: 'AI Image 4K Upscaler',
              desc: 'Enhance low-resolution graphics to crisp 4K using deep learning super-resolution.',
              status: 'In Alpha'
            },
            {
              icon: ImageIcon,
              title: 'Vector SVG Converter',
              desc: 'Convert raster logos and badges into clean scalable vector SVGs with zero pixelation.',
              status: 'Scheduled'
            },
            {
              icon: FileText,
              title: 'PDF Reducer & Signer',
              desc: 'Shrink massive PDF files to under 1MB and apply verified digital signatures.',
              status: 'Scheduled'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-5 bg-white/[0.03] border border-[#D6B46A]/15 rounded-2xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#D6B46A]/20 flex items-center justify-center text-[#D6B46A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 bg-[#D6B46A]/10 text-[#D6B46A] text-[9px] font-mono uppercase font-bold rounded">
                    {item.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-[11px] text-warm-grey mt-1 leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust, Security & Performance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#D6B46A]/10 text-[#BFA15A] border border-[#D6B46A]/25 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-left">
            <h5 className="font-display font-bold text-xs text-[#111111] uppercase tracking-wider">
              Zero Server Uploads
            </h5>
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Every pixel is computed on your client device using HTML5 Canvas & WebAssembly. Your photos never touch our servers.
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
              Zero network latency. Files process directly on your GPU, making compression and resizing virtually instant.
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
              Free forever. No daily limits, no registration required, and completely watermark-free output files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
