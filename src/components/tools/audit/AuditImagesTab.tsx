import React from 'react';
import { 
  Image as ImageIcon, AlertTriangle, CheckCircle2, 
  XCircle, Layers, Wrench, ExternalLink
} from 'lucide-react';
import { ComprehensiveAuditReport } from '../../../utils/auditEngine/types';

interface AuditImagesTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditImagesTab: React.FC<AuditImagesTabProps> = ({
  report,
  onRequestFix
}) => {
  const img = report.imageData || {
    totalImages: report.meta?.totalImages || 0,
    missingAltCount: report.meta?.imagesWithoutAltCount || 0,
    missingDimensionsCount: report.deepHealth?.imagesMissingDimensions || 0,
    missingAspectRatiosCount: 0,
    lazyLoadedLcpDetected: false,
    missingLazyBelowFoldCount: 0,
    missingSrcsetCount: 0,
    legacyFormatCount: report.meta?.totalImages || 0,
    webpAvifOpportunities: 0,
    duplicateImages: [],
    brokenImageCandidates: [],
    samples: []
  };

  const missingAltList = (report.imageData?.samples?.filter(s => !s.hasAlt).map(s => s.src)) || (report.meta?.missingAltImages || []);
  const modernFormatsCount = img.samples?.filter(s => s.format === 'webp' || s.format === 'avif').length ?? (img.totalImages > 0 && img.legacyFormatCount === 0 ? img.totalImages : 0);
  const lazyLoadedCount = img.samples?.filter(s => s.isLazy).length ?? 0;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <ImageIcon className="w-4 h-4 text-[#D6B46A]" />
              <span>Images &amp; Visual Media Asset Engine</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Image Optimization &amp; Layout Shift Health
            </h3>
            <p className="text-xs text-[#8A8178]">
              Checks for alt text completeness, explicit width/height tags (CLS protection), modern WebP/AVIF formats, and native lazy-loading.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">Image Health Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.images?.score ?? 80}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* 5 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Total Images</span>
            <span className="font-display font-black text-xl text-[#111111]">{img.totalImages}</span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Missing Alt Tags</span>
            <span className={`font-display font-black text-xl ${img.missingAltCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {img.missingAltCount}
            </span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Missing W/H (CLS)</span>
            <span className={`font-display font-black text-xl ${img.missingDimensionsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {img.missingDimensionsCount}
            </span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">WebP / AVIF Modern</span>
            <span className="font-display font-black text-xl text-emerald-700">{modernFormatsCount}</span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Lazy-Loaded</span>
            <span className="font-display font-black text-xl text-[#111111]">{lazyLoadedCount}</span>
          </div>
        </div>
      </div>

      {/* Missing Alt Samples & Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Alt Image List */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <h4 className="font-display font-black text-sm text-[#111111]">
              Images Missing Alt Attributes
            </h4>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              img.missingAltCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {img.missingAltCount > 0 ? `${img.missingAltCount} Defects` : '100% Compliant'}
            </span>
          </div>

          {missingAltList.length > 0 ? (
            <div className="space-y-2">
              {missingAltList.slice(0, 6).map((src, idx) => (
                <div key={idx} className="p-2.5 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs font-mono text-amber-900 truncate">
                  &lt;img src="{src}" alt=""&gt;
                </div>
              ))}
              {missingAltList.length > 6 && (
                <div className="text-[11px] font-mono text-[#8A8178] text-center pt-1">
                  + {missingAltList.length - 6} additional images missing alt text
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All detected &lt;img&gt; tags have descriptive alt attributes configured.</span>
            </div>
          )}
        </div>

        {/* CLS & Next-Gen Conversion Advisory */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <h4 className="font-display font-black text-sm text-[#111111]">
              Layout Shift &amp; Next-Gen Optimization
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#85641C]">
              Best Practice
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#8A8178]">
            <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl space-y-1">
              <span className="font-bold text-[#111111] block">Explicit Width &amp; Height Attributes:</span>
              <p>
                Images without declared dimensions cause browser recalculations and visual jumping (CLS) as assets stream in.
              </p>
            </div>

            <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl space-y-1">
              <span className="font-bold text-[#111111] block">WebP / AVIF Conversion Opportunity:</span>
              <p>
                Converting legacy PNG and JPEG files to WebP or AVIF reduces image payload weight by 45% to 70% with zero visual quality loss.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRequestFix('Image Optimization & Layout Shift Fix')}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Apply Dimension Attributes &amp; WebP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
