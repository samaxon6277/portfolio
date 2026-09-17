import React from 'react';
import { 
  Type, AlertTriangle, CheckCircle2, XCircle, 
  ExternalLink, Wrench, Shield
} from 'lucide-react';
import { ComprehensiveAuditReport } from '../../../utils/auditEngine/types';

interface AuditFontsTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditFontsTab: React.FC<AuditFontsTabProps> = ({
  report,
  onRequestFix
}) => {
  const fonts = report.fontData || {
    totalFonts: 2,
    fontFamilies: ['Sans-Serif'],
    externalFontProviders: [],
    hasFontDisplaySwap: true,
    renderBlockingFontsCount: 0,
    hasPreconnect: false,
    duplicateFontRequests: [],
    legacyFontFormats: []
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Type className="w-4 h-4 text-[#D6B46A]" />
              <span>Fonts &amp; Web Typography Performance</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Font Delivery &amp; FOUT/FOIT Prevention
            </h3>
            <p className="text-xs text-[#8A8178]">
              Inspects font loading strategies, font-display: swap declaration, third-party CDN providers, and DNS preconnect hints.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">Typography Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.fonts?.score ?? 90}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Webfonts Loaded</span>
            <span className="font-display font-black text-2xl text-[#111111]">{fonts.totalFonts}</span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">font-display: swap</span>
            <span className={`font-display font-black text-2xl ${fonts.hasFontDisplaySwap ? 'text-emerald-700' : 'text-amber-600'}`}>
              {fonts.hasFontDisplaySwap ? 'Active' : 'Missing'}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">CDN Providers</span>
            <span className="font-display font-black text-2xl text-[#111111]">
              {fonts.externalFontProviders.length}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Preconnect Hint</span>
            <span className={`font-display font-black text-2xl ${fonts.hasPreconnect ? 'text-emerald-700' : 'text-amber-600'}`}>
              {fonts.hasPreconnect ? 'Configured' : 'Missing'}
            </span>
          </div>
        </div>
      </div>

      {/* Font Families & External Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-black text-sm text-[#111111] border-b border-[#D6B46A]/15 pb-3">
            Identified Font Families
          </h4>
          {fonts.fontFamilies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {fonts.fontFamilies.map((fam, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl text-xs font-bold text-[#111111] shadow-xs"
                >
                  {fam}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#8A8178]">Default system fonts utilized.</div>
          )}
        </div>

        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-black text-sm text-[#111111] border-b border-[#D6B46A]/15 pb-3">
            Font Delivery &amp; FOIT Optimization
          </h4>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            Without <code>font-display: swap</code>, browsers conceal text content (Flash of Invisible Text) while waiting for network font files.
          </p>
          <button
            type="button"
            onClick={() => onRequestFix('Font Loading & Preconnect Optimization')}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Configure font-display: swap &amp; Preconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
