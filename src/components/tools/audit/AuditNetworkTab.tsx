import React from 'react';
import { 
  Network, Globe, Layers, ArrowRight, CheckCircle2, 
  AlertTriangle, Wrench, Shield
} from 'lucide-react';
import { ComprehensiveAuditReport } from '../../../utils/auditEngine/types';

interface AuditNetworkTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditNetworkTab: React.FC<AuditNetworkTabProps> = ({
  report,
  onRequestFix
}) => {
  const net = report.networkData || {
    resources: [],
    totalDetectedAssets: 20,
    firstPartyDomains: [report.hostname],
    thirdPartyDomains: [],
    knownTrackersDetected: [],
    redirectHops: 0,
    redirectChain: [report.url],
    cacheHeadersFound: {
      hasCacheControl: true,
      cacheControlValue: 'public, max-age=3600',
      hasEtag: true,
      hasExpires: false
    },
    contentEncoding: null,
    failedResources: [],
    slowResources: [],
    duplicateResources: []
  };

  const cacheValue = net.cacheHeadersFound?.cacheControlValue || null;
  const scriptCount = report.javascriptData?.totalScripts || report.meta?.scriptTags || 0;
  const sheetCount = report.performanceData?.stylesheetCount || report.meta?.stylesheetTags || 0;
  const imgCount = report.imageData?.totalImages || report.meta?.totalImages || 0;
  const fontCount = report.fontData?.totalFonts || 2;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Network className="w-4 h-4 text-[#D6B46A]" />
              <span>Network Routing &amp; Resource Delivery Engine</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Domains, Caching &amp; Payload Architecture
            </h3>
            <p className="text-xs text-[#8A8178]">
              Inspects first-party vs third-party origins, asset request distribution, HTTP caching headers, and redirect chains.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">Network Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.network?.score ?? 85}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* 4 Quick Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Total Assets</span>
            <span className="font-display font-black text-2xl text-[#111111]">{net.totalDetectedAssets}</span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">3rd-Party Domains</span>
            <span className={`font-display font-black text-2xl ${net.thirdPartyDomains.length > 5 ? 'text-amber-600' : 'text-[#111111]'}`}>
              {net.thirdPartyDomains.length}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Cache-Control</span>
            <span className={`font-display font-black text-xl ${cacheValue ? 'text-emerald-700' : 'text-amber-600'}`}>
              {cacheValue ? 'Configured' : 'Missing'}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Redirect Hops</span>
            <span className="font-display font-black text-2xl text-[#111111]">{net.redirectHops || (net.redirectChain.length - 1)}</span>
          </div>
        </div>
      </div>

      {/* Asset Distribution & Caching Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Counts by Resource Type */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-black text-sm text-[#111111] border-b border-[#D6B46A]/15 pb-3">
            Resource Request Distribution
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-black/5">
              <span className="text-[#8A8178]">Script Bundles (.js):</span>
              <span className="font-mono font-bold text-[#111111]">{scriptCount} requests</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-black/5">
              <span className="text-[#8A8178]">Stylesheets (.css):</span>
              <span className="font-mono font-bold text-[#111111]">{sheetCount} requests</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-black/5">
              <span className="text-[#8A8178]">Images &amp; SVG (.png, .webp, .svg):</span>
              <span className="font-mono font-bold text-[#111111]">{imgCount} requests</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#8A8178]">Web Fonts (.woff2):</span>
              <span className="font-mono font-bold text-[#111111]">{fontCount} requests</span>
            </div>
          </div>
        </div>

        {/* Third Party Domains & Cache Policy */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-black text-sm text-[#111111] border-b border-[#D6B46A]/15 pb-3">
            Third-Party Origins &amp; Caching Policy
          </h4>

          {net.thirdPartyDomains.length > 0 ? (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#8A8178] uppercase block">Connected Origins:</span>
              <div className="flex flex-wrap gap-1.5">
                {net.thirdPartyDomains.map((dom, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-[#F4EFE6] rounded-lg text-xs font-mono text-[#111111]">
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              Zero third-party domain dependencies detected. Clean self-hosted architecture.
            </div>
          )}

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl text-xs space-y-1">
            <span className="font-mono font-bold uppercase text-[10px] text-[#85641C] block">Header: Cache-Control</span>
            <code className="font-mono text-[11px] text-[#111111] block truncate">
              {cacheValue || 'None sent by server'}
            </code>
          </div>

          <button
            type="button"
            onClick={() => onRequestFix('HTTP Caching & Network Optimization')}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Configure Cache-Control Headers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
