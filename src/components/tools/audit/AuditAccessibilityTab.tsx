import React from 'react';
import { 
  Eye, CheckCircle2, AlertTriangle, XCircle, 
  Layers, Wrench, Shield, ExternalLink
} from 'lucide-react';
import { ComprehensiveAuditReport } from '../../../utils/auditEngine/types';

interface AuditAccessibilityTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditAccessibilityTab: React.FC<AuditAccessibilityTabProps> = ({
  report,
  onRequestFix
}) => {
  const a11y = report.accessibilityData || {
    hasHtmlLang: report.deepHealth?.hasHtmlLang ?? true,
    htmlLang: 'en',
    isZoomLocked: report.meta?.isZoomLocked ?? false,
    hasViewport: report.meta?.hasViewport ?? true,
    imagesTotal: report.meta?.totalImages || 0,
    imagesWithoutAltCount: report.meta?.imagesWithoutAltCount || 0,
    missingAltSamples: (report.meta?.missingAltImages || []).map(src => ({ src })),
    emptyButtonsCount: 0,
    emptyButtonSamples: [],
    emptyLinksCount: 0,
    emptyLinkSamples: [],
    formInputsWithoutLabelCount: 0,
    hasMainLandmark: true,
    hasNavLandmark: true,
    hasHeaderLandmark: true,
    hasFooterLandmark: true,
    hasSkipLink: false,
    hasReducedMotionQuery: false
  };

  const checklist = [
    {
      title: 'HTML <html> Language Attribute',
      passed: a11y.hasHtmlLang,
      desc: a11y.hasHtmlLang ? `Configured properly as lang="${a11y.htmlLang || 'en'}"` : 'Missing lang attribute. Screen readers cannot infer pronunciation rules.',
      critical: true
    },
    {
      title: 'Mobile Viewport Zoom Accessibility',
      passed: !a11y.isZoomLocked,
      desc: !a11y.isZoomLocked ? 'Zooming enabled. Users with low vision can pinch-to-zoom.' : 'Hazardous user-scalable=no or maximum-scale=1.0 detected in viewport tag.',
      critical: true
    },
    {
      title: 'Descriptive Image Alt Text',
      passed: (a11y.missingAltSamples?.length || 0) === 0,
      desc: (a11y.missingAltSamples?.length || 0) === 0 ? 'All detected <img> tags have alternative text.' : `${a11y.missingAltSamples?.length} images lacking alt descriptions.`,
      critical: false
    },
    {
      title: 'Accessible Interactive Buttons',
      passed: a11y.emptyButtonsCount === 0,
      desc: a11y.emptyButtonsCount === 0 ? 'All buttons have accessible text labels or aria-label.' : `${a11y.emptyButtonsCount} buttons missing accessible names.`,
      critical: false
    },
    {
      title: 'Form Input Label Associations',
      passed: (a11y.formInputsWithoutLabelCount || 0) === 0,
      desc: (a11y.formInputsWithoutLabelCount || 0) === 0 ? 'Form controls have matching <label> or aria-label.' : `${a11y.formInputsWithoutLabelCount} inputs without clear labels.`,
      critical: false
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Eye className="w-4 h-4 text-[#D6B46A]" />
              <span>Accessibility &amp; Inclusive Design Audit (WCAG 2.1 AA)</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Assistive Technology &amp; Screen Reader Readiness
            </h3>
            <p className="text-xs text-[#8A8178]">
              Automated inspection of document landmarks, viewport scaling locks, language declarations, and accessible names.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">WCAG Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.accessibility?.score ?? 85}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-4 ${
                item.passed 
                  ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950' 
                  : item.critical 
                  ? 'bg-rose-50/50 border-rose-300 text-rose-950' 
                  : 'bg-amber-50/50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : item.critical ? (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-0.5">
                  <span className="font-bold text-sm text-[#111111] block">
                    {item.title}
                  </span>
                  <p className="text-[#8A8178]">
                    {item.desc}
                  </p>
                </div>
              </div>

              {!item.passed && (
                <button
                  type="button"
                  onClick={() => onRequestFix(item.title)}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Fix</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
