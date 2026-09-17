import React, { useState } from 'react';
import { 
  X, GitCompare, ArrowRight, ArrowUpRight, ArrowDownRight, 
  Clock, Shield, Zap, Search, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { ComprehensiveAuditReport, AuditHistoryEntry } from '../../../utils/auditEngine/types';
import { getAuditHistory, getStoredAuditReport, compareAuditReports } from '../../../utils/auditEngine/auditHistory';

interface AuditCompareModalProps {
  currentReport: ComprehensiveAuditReport;
  onClose: () => void;
}

export const AuditCompareModal: React.FC<AuditCompareModalProps> = ({
  currentReport,
  onClose
}) => {
  const history = getAuditHistory(currentReport.hostname);
  const [selectedPreviousId, setSelectedPreviousId] = useState<string>(
    history.length > 1 ? history[1].id : (history[0]?.id || '')
  );

  const previousReport = selectedPreviousId ? getStoredAuditReport(selectedPreviousId) : null;
  const comparison = previousReport ? compareAuditReports(previousReport, currentReport) : null;

  const renderDelta = (val: number, invert = false, unit = '') => {
    if (val === 0) return <span className="text-zinc-500 font-mono text-xs">No change (0{unit})</span>;
    const isPositiveGood = invert ? val < 0 : val > 0;
    const sign = val > 0 ? '+' : '';

    return (
      <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-bold ${
        isPositiveGood ? 'text-emerald-700' : 'text-rose-700'
      }`}>
        {sign}{val}{unit}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-[#D6B46A]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#85641C]">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-[#111111]">
                Audit Before / After Comparison
              </h3>
              <p className="text-xs text-[#8A8178]">
                Comparing current audit with historical scans of {currentReport.hostname}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Scan Selector */}
        {history.length > 1 ? (
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase text-[#85641C]">
              Select Baseline Audit to Compare Against:
            </label>
            <select
              value={selectedPreviousId}
              onChange={(e) => setSelectedPreviousId(e.target.value)}
              className="w-full p-3 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl text-xs font-mono text-[#111111] focus:outline-hidden focus:border-[#85641C] cursor-pointer"
            >
              {history.map((h, idx) => (
                <option key={h.id} value={h.id}>
                  {new Date(h.analyzedAt).toLocaleString()} — Overall Score: {h.overallScore}/100 ({h.criticalCount} crit)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl text-xs text-[#8A8178]">
            This is the first audit logged for this domain in local history. Future audit runs will allow direct side-by-side delta comparisons.
          </div>
        )}

        {/* Comparison Matrix */}
        {comparison && previousReport ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#F4EFE6]/50 border border-[#D6B46A]/30 rounded-2xl text-xs">
              <div>
                <span className="text-[#8A8178] block text-[10px] font-mono uppercase">Baseline Scan</span>
                <span className="font-mono font-bold text-sm text-[#111111]">
                  {comparison.previousDate}
                </span>
                <span className="block text-xs font-mono text-[#85641C]">Score: {previousReport.scores?.overall || 0}/100</span>
              </div>
              <div className="text-right">
                <span className="text-[#8A8178] block text-[10px] font-mono uppercase">Current Scan</span>
                <span className="font-mono font-bold text-sm text-[#111111]">
                  {comparison.currentDate}
                </span>
                <span className="block text-xs font-mono text-[#85641C]">Score: {currentReport.scores?.overall || 0}/100</span>
              </div>
            </div>

            {/* Metric Rows */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="font-bold text-[#111111]">Overall Health Rating</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{previousReport.scores?.overall || 0} → {currentReport.scores?.overall || 0}</span>
                  {renderDelta(comparison.overallScoreDiff, false, ' pts')}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="font-bold text-[#111111]">Server TTFB (Latency)</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{previousReport.performanceData?.ttfbMs ?? previousReport.responseTimeMs ?? 0}ms → {currentReport.performanceData?.ttfbMs ?? currentReport.responseTimeMs ?? 0}ms</span>
                  {renderDelta(comparison.ttfbDiffMs, true, 'ms')}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="font-bold text-[#111111]">HTML Document Weight</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{previousReport.performanceData?.htmlSizeKb ?? 0}KB → {currentReport.performanceData?.htmlSizeKb ?? 0}KB</span>
                  {renderDelta(comparison.htmlSizeDiffKb, true, 'KB')}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="font-bold text-[#111111]">Critical Issues Identified</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{previousReport.findings?.filter(f => f.severity === 'critical').length || 0} → {currentReport.findings?.filter(f => f.severity === 'critical').length || 0}</span>
                  {renderDelta(comparison.criticalIssuesDiff, true)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="font-bold text-[#111111]">Performance Score</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{previousReport.scores?.performance || 0} → {currentReport.scores?.performance || 0}</span>
                  {renderDelta(comparison.performanceScoreDiff, false, ' pts')}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="font-bold text-[#111111]">Security Score</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{previousReport.scores?.security || 0} → {currentReport.scores?.security || 0}</span>
                  {renderDelta(comparison.securityScoreDiff, false, ' pts')}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
