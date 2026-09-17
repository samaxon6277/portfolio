import React, { useState } from 'react';
import { 
  Shield, Zap, Code2, Image as ImageIcon, Type, Network, 
  Search, Eye, Lock, Unlock, CheckCircle2, AlertTriangle, 
  XCircle, Info, ExternalLink, Wrench, ArrowRight, Calculator,
  ChevronDown, ChevronUp, Share2, Download, GitCompare
} from 'lucide-react';
import { ComprehensiveAuditReport, AuditCategory } from '../../../utils/auditEngine/types';
import { exportAuditAsJson } from '../../../utils/auditEngine/auditHistory';

interface AuditOverviewTabProps {
  report: ComprehensiveAuditReport;
  onNavigateTab: (tabId: string) => void;
  onRequestFix: (issueTitle?: string) => void;
  onOpenCompare?: () => void;
}

export const AuditOverviewTab: React.FC<AuditOverviewTabProps> = ({
  report,
  onNavigateTab,
  onRequestFix,
  onOpenCompare
}) => {
  const [showScoringMath, setShowScoringMath] = useState(false);

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Exceptional Health', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { grade: 'A', label: 'Good Health', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 70) return { grade: 'B', label: 'Needs Optimization', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score >= 55) return { grade: 'C', label: 'Warning / Fixes Required', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { grade: 'F', label: 'Critical Vulnerabilities', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const gradeInfo = getScoreGrade(report.scores?.overall || 0);

  const categoryCards: Array<{
    id: string;
    category: AuditCategory;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    score: number;
    statSummary: string;
    sourceTag: string;
  }> = [
    {
      id: 'performance',
      category: 'performance',
      title: 'Performance',
      icon: Zap,
      score: report.categoryStats?.performance?.score ?? report.scores?.performance ?? 0,
      statSummary: `TTFB: ${report.performanceData?.ttfbMs || report.responseTimeMs || 0}ms · ${report.performanceData?.htmlSizeKb || report.meta?.htmlSizeKb || 0}KB`,
      sourceTag: '[SERVER + LAB]'
    },
    {
      id: 'javascript',
      category: 'javascript',
      title: 'JavaScript',
      icon: Code2,
      score: report.categoryStats?.javascript?.score ?? 85,
      statSummary: `${report.javascriptData?.totalScripts || 0} scripts · ${report.javascriptData?.renderBlockingScripts || 0} render-blocking`,
      sourceTag: '[DOM]'
    },
    {
      id: 'images',
      category: 'images',
      title: 'Images & Media',
      icon: ImageIcon,
      score: report.categoryStats?.images?.score ?? 80,
      statSummary: `${report.imageData?.totalImages || 0} images · ${report.imageData?.missingAltCount || 0} missing alt`,
      sourceTag: '[DOM]'
    },
    {
      id: 'fonts',
      category: 'fonts',
      title: 'Fonts & Typography',
      icon: Type,
      score: report.categoryStats?.fonts?.score ?? 90,
      statSummary: `${report.fontData?.totalFonts || 0} webfonts · ${report.fontData?.externalFontProviders?.length || 0} providers`,
      sourceTag: '[DOM]'
    },
    {
      id: 'network',
      category: 'network',
      title: 'Network & Resources',
      icon: Network,
      score: report.categoryStats?.network?.score ?? 85,
      statSummary: `${report.networkData?.totalDetectedAssets || 0} assets · ${report.networkData?.thirdPartyDomains?.length || 0} 3rd-party origins`,
      sourceTag: '[SERVER + DOM]'
    },
    {
      id: 'seo',
      category: 'seo',
      title: 'SEO & Metadata',
      icon: Search,
      score: report.categoryStats?.seo?.score ?? report.scores?.seo ?? 0,
      statSummary: `${report.seoData?.titleLength || report.meta?.title?.length || 0} char title · ${report.seoData?.headings?.totalHeadings || 0} headings`,
      sourceTag: '[DOM + SITEMAP]'
    },
    {
      id: 'accessibility',
      category: 'accessibility',
      title: 'Accessibility (WCAG)',
      icon: Eye,
      score: report.categoryStats?.accessibility?.score ?? 85,
      statSummary: `${report.accessibilityData?.hasHtmlLang ? 'HTML lang present' : 'Missing lang'} · ${report.accessibilityData?.missingAltSamples?.length || 0} alt defects`,
      sourceTag: '[DOM WCAG]'
    },
    {
      id: 'security',
      category: 'security',
      title: 'Security & Headers',
      icon: Shield,
      score: report.categoryStats?.security?.score ?? report.scores?.security ?? 0,
      statSummary: `${report.securityData?.isHttps ? 'HTTPS Enforced' : 'Plaintext HTTP'} · ${report.securityData?.hsts?.present ? 'HSTS Active' : 'Missing HSTS'}`,
      sourceTag: '[SERVER HEADERS]'
    }
  ];

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Top Banner: Overall Score & Executive Summary */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#D6B46A]/20">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D6B46A]/15 border border-[#D6B46A]/30 rounded-full text-xs font-mono font-bold text-[#85641C]">
              <span>Executive Health Score</span>
              <span>·</span>
              <span>Audited at {new Date(report.analyzedAt).toLocaleTimeString()}</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
              Diagnostic Audit Summary for {report.hostname}
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
              Comprehensive scan across performance, Core Web Vitals feasibility, JavaScript bundles, images, fonts, network origins, SEO crawlability, WCAG accessibility, and HTTP security headers.
            </p>

            {/* Quick Export & Comparison Actions */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => exportAuditAsJson(report)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              {onOpenCompare && (
                <button
                  type="button"
                  onClick={onOpenCompare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare Audits</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowScoringMath(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{showScoringMath ? 'Hide' : 'View'} Scoring Math</span>
                {showScoringMath ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Big Score Dial */}
          <div className="flex items-center gap-4 bg-[#111111] text-[#FFFDF8] p-6 rounded-2xl shadow-md shrink-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B46A] block font-bold">
                Overall Rating
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="font-display font-black text-4xl sm:text-5xl text-[#D6B46A]">
                  {report.scores?.overall || 0}
                </span>
                <span className="text-xs font-mono text-[#D6B46A]/70">/100</span>
              </div>
              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${gradeInfo.color}`}>
                <span>{gradeInfo.grade}</span>
                <span>·</span>
                <span>{gradeInfo.label}</span>
              </div>
            </div>

            <div className="border-l border-white/10 pl-4 space-y-1 text-right text-xs font-mono">
              <div className="text-[#D6B46A] font-bold">
                {report.findings?.filter(f => f.severity === 'critical').length || 0} Critical
              </div>
              <div className="text-amber-400">
                {report.findings?.filter(f => f.severity === 'warning').length || 0} Warnings
              </div>
              <div className="text-emerald-400">
                {report.findings?.filter(f => f.severity === 'passed').length || 0} Passed
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Scoring Transparency Panel */}
        {showScoringMath && (
          <div className="p-5 bg-white border border-[#D6B46A]/30 rounded-2xl space-y-4 animate-fade-in text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#85641C]">
              <Calculator className="w-4 h-4 text-[#D6B46A]" />
              <span>SamaXon Scoring Formula &amp; Weight Distribution</span>
            </div>
            <p className="text-[#8A8178]">
              The overall score is mathematically calculated as a weighted synthesis of 5 core category indices:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
              <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="text-[#8A8178] block">Performance (25%)</span>
                <span className="font-bold text-[#111111] text-sm">{report.scores?.performance ?? 0}</span>
              </div>
              <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="text-[#8A8178] block">Security (20%)</span>
                <span className="font-bold text-[#111111] text-sm">{report.scores?.security ?? 0}</span>
              </div>
              <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="text-[#8A8178] block">SEO (20%)</span>
                <span className="font-bold text-[#111111] text-sm">{report.scores?.seo ?? 0}</span>
              </div>
              <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="text-[#8A8178] block">WCAG A11y (15%)</span>
                <span className="font-bold text-[#111111] text-sm">{report.scores?.accessibility ?? 85}</span>
              </div>
              <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                <span className="text-[#8A8178] block">Code Quality (20%)</span>
                <span className="font-bold text-[#111111] text-sm">{report.scores?.code ?? 75}</span>
              </div>
            </div>
            <p className="text-[11px] font-mono text-[#85641C]">
              Formula: (0.25 × Perf) + (0.20 × Sec) + (0.20 × SEO) + (0.15 × A11y) + (0.20 × Code) = {report.scores?.overall || 0}/100
            </p>
          </div>
        )}

        {/* 8 Category Scorecards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map(cat => {
            const Icon = cat.icon;
            const isGood = cat.score >= 80;
            const isMid = cat.score >= 60 && cat.score < 80;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigateTab(cat.id)}
                className="p-4 bg-white hover:bg-[#F4EFE6]/40 border border-[#D6B46A]/20 hover:border-[#D6B46A]/60 rounded-2xl transition-all text-left group cursor-pointer shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#85641C] group-hover:bg-[#D6B46A] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-display font-black text-[#111111] group-hover:text-[#85641C] transition-colors">
                      {cat.title}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md ${
                    isGood ? 'bg-emerald-100 text-emerald-800' : isMid ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {cat.score}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 text-[11px] font-mono text-[#8A8178] truncate flex items-center justify-between">
                  <span className="truncate">{cat.statSummary}</span>
                  <span className="text-[9px] text-[#85641C] font-mono shrink-0 ml-1">{cat.sourceTag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Capabilities & Measurement Transparency Notice */}
      {report.capabilitiesDoc && (
        <div className="p-5 bg-white border border-[#D6B46A]/25 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#85641C]">
            <Info className="w-4 h-4 text-[#D6B46A]" />
            <span>Audit Engine Capabilities &amp; Verification Methodology</span>
          </div>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            Audit executed via full server-side HTTP/DOM inspection. Engine capabilities and active inspection modules are detailed below.
          </p>
          {Array.isArray(report.capabilitiesDoc) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
              {report.capabilitiesDoc.map((cap) => (
                <div key={cap.id} className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#111111] text-[11px] truncate">{cap.name}</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      cap.status === 'active' || cap.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cap.environment}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A8178] leading-snug">{cap.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Call to Action: Remediation */}
      <div className="p-6 bg-radial from-[#222222] to-[#111111] text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-black text-lg text-white">
            Ready to resolve high-priority vulnerabilities?
          </h3>
          <p className="text-xs text-white/70">
            View the actionable fixes checklist with copyable code snippets, or book an engineering sprint.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('findings')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Explore Findings
          </button>
          <button
            onClick={() => onRequestFix()}
            className="px-5 py-2.5 bg-[#D6B46A] hover:bg-[#E5C77F] text-[#111111] rounded-xl text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Request 48h Fix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
