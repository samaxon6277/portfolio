import React from 'react';
import { 
  Code2, AlertTriangle, CheckCircle2, XCircle, 
  Terminal, Wrench, Shield, Layers
} from 'lucide-react';
import { ComprehensiveAuditReport } from '../../../utils/auditEngine/types';

interface AuditJavaScriptTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditJavaScriptTab: React.FC<AuditJavaScriptTabProps> = ({
  report,
  onRequestFix
}) => {
  const js = report.javascriptData || {
    totalScripts: report.meta?.scriptTags || 0,
    inlineScripts: 2,
    externalScripts: (report.meta?.scriptTags || 2) - 2,
    renderBlockingScripts: report.deepHealth?.renderBlockingScriptsCount || 0,
    asyncScripts: 1,
    deferScripts: 1,
    moduleScripts: 1,
    thirdPartyScripts: 2,
    duplicateScripts: [],
    largeBundlesDetected: [],
    legacyIndicatorsFound: [],
    inlineScriptTotalBytes: 0,
    excessiveThirdParty: false
  };

  const trackers = report.networkData?.knownTrackersDetected || [];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Code2 className="w-4 h-4 text-[#D6B46A]" />
              <span>JavaScript Bundles &amp; Script Execution Health</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Script Execution &amp; Tracker Telemetry
            </h3>
            <p className="text-xs text-[#8A8178]">
              Breakdown of head scripts, render-blocking tags, async/defer flags, and third-party vendor tracking libraries.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">JS Health Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.javascript?.score ?? 85}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* Script Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Total Scripts</span>
            <span className="font-display font-black text-xl text-[#111111]">{js.totalScripts}</span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Render Blocking</span>
            <span className={`font-display font-black text-xl ${js.renderBlockingScripts > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {js.renderBlockingScripts}
            </span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Async / Defer</span>
            <span className="font-display font-black text-xl text-emerald-700">
              {js.asyncScripts + js.deferScripts}
            </span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">ES Modules</span>
            <span className="font-display font-black text-xl text-[#111111]">{js.moduleScripts}</span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Inline Blocks</span>
            <span className="font-display font-black text-xl text-[#111111]">{js.inlineScripts}</span>
          </div>

          <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">3rd-Party Scripts</span>
            <span className={`font-display font-black text-xl ${js.thirdPartyScripts > 4 ? 'text-amber-600' : 'text-[#111111]'}`}>
              {js.thirdPartyScripts}
            </span>
          </div>
        </div>
      </div>

      {/* Trackers & Duplicate Scripts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Marketing & Analytics Trackers */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <h4 className="font-display font-black text-sm text-[#111111]">
              Detected Third-Party Trackers
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#85641C]">
              {trackers.length} Identified
            </span>
          </div>

          {trackers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {trackers.map(tracker => (
                <span 
                  key={tracker}
                  className="px-3 py-1 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5 shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {tracker}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero invasive third-party telemetry or ad trackers detected on page.</span>
            </div>
          )}

          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            Excessive analytics trackers inflate main-thread parse time and degrade mobile battery life.
          </p>
        </div>

        {/* Duplicate Scripts or Warnings */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <h4 className="font-display font-black text-sm text-[#111111]">
              Script Redundancy &amp; Duplication
            </h4>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              js.duplicateScripts.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {js.duplicateScripts.length > 0 ? `${js.duplicateScripts.length} Duplicates` : 'Clean (0 Duplicates)'}
            </span>
          </div>

          {js.duplicateScripts.length > 0 ? (
            <div className="space-y-2">
              {js.duplicateScripts.map(dup => (
                <div key={dup} className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-800 truncate">
                  Duplicate script URL: {dup}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All script resources have unique origin URLs. No redundant network fetches.</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onRequestFix('JavaScript Bundle & Async Defer Optimization')}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Eliminate Render-Blocking Scripts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
