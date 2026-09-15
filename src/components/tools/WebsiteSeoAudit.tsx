import React, { useState } from 'react';
import { 
  Search, Globe, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, 
  Copy, Check, Share2, Printer, ShieldCheck, Sparkles, Smartphone,
  Laptop, ChevronDown, ChevronUp, Layers, RefreshCw, FileText,
  ExternalLink, Lock, Eye, Tag, AlertCircle, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppInquiryUrl } from '../../config/siteConfig';

interface SeoAuditData {
  success: boolean;
  reachable: boolean;
  url: string;
  finalUrl?: string;
  hostname: string;
  statusCode: number;
  responseTimeMs: number;
  analyzedAt?: string;
  error?: string;
  scores: {
    overall: number;
    technical: number;
    content: number;
    social: number;
    security: number;
    accessibility: number;
  };
  grade: string;
  meta: {
    title: string;
    titlePixelEstimate?: number;
    metaDescription: string;
    canonicalUrl: string;
    robots: string;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    ogUrl: string | null;
    twitterCard: string;
    twitterTitle: string | null;
    twitterImage: string | null;
    headings: {
      h1: string[];
      h2Count: number;
      h3Count: number;
      outline: Array<{ level: 'H1' | 'H2' | 'H3'; text: string }>;
    };
    images: {
      total: number;
      missingAlt: number;
      missingAltSample: string[];
    };
    content: {
      wordCount: number;
      readingTimeMinutes: number;
      textToHtmlRatio: number;
    };
    technical: {
      isHttps: boolean;
      hasDoctype: boolean;
      hasViewport: boolean;
      hasCharset: boolean;
      hasLang: boolean;
      hasJsonLd: boolean;
    };
  };
  keywords: {
    top: Array<{ keyword: string; count: number; density: number }>;
    missingCommercial: string[];
  };
  issues: {
    critical: Array<{ title: string; description: string; recommendation: string; fixCode?: string }>;
    warning: Array<{ title: string; description: string; recommendation: string; fixCode?: string }>;
    passed: Array<{ title: string; description: string; recommendation: string }>;
  };
}

export default function WebsiteSeoAudit() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SeoAuditData | null>(null);
  
  // UI Tabs & Filters
  const [activeTab, setActiveTab] = useState<'overview' | 'serp' | 'headings' | 'social' | 'checklist'>('overview');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'passed'>('all');
  const [expandedIssueIdx, setExpandedIssueIdx] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Fast demo test domains
  const sampleDomains = ['stripe.com', 'linear.app', 'airbnb.com'];

  const handleRunAudit = async (targetUrl?: string) => {
    const urlToTest = (targetUrl || urlInput).trim();
    if (!urlToTest) {
      setError('Please enter a website domain or URL to audit.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const endpoint = '/api/tools/seo-audit';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete SEO audit.');
      }

      setData(json);
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.message || 'Error communicating with SEO diagnostic engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopySummary = () => {
    if (!data) return;
    const summary = `SamaXon SEO Audit Report for ${data.hostname}
Overall SEO Score: ${data.scores.overall}/100 (Grade: ${data.grade})
- Technical: ${data.scores.technical}/100
- Content & Meta: ${data.scores.content}/100
- Social & OG: ${data.scores.social}/100
- Accessibility: ${data.scores.accessibility}/100
- Security: ${data.scores.security}/100
Critical Issues: ${data.issues.critical.length}
Warnings: ${data.issues.warning.length}
Passed Checks: ${data.issues.passed.length}
Generated via SamaXon SEO Audit Tool (https://samaxon.site/tools/website-seo-audit)`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for score gauge color
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Emerald
    if (score >= 75) return '#D6B46A'; // Champagne Gold
    if (score >= 60) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <div id="website-seo-audit-app" className="w-full max-w-7xl mx-auto space-y-8">
      {/* 1. Header & Search Input Box */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-lg space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/40 text-[#85641C] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#85641C]" />
            Flagship Technical SEO Audit Engine
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
            Website SEO Audit & SERP Simulator
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base leading-relaxed">
            Inspect real-time on-page meta tags, heading hierarchies, image alt accessibility, canonical status, social share cards, and keyword density with instant copyable fixes.
          </p>
        </div>

        {/* Search Bar */}
        <form 
          id="seo-audit-search-form"
          onSubmit={(e) => { e.preventDefault(); handleRunAudit(); }} 
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E857B]" />
              <input
                id="seo-audit-url-input"
                type="text"
                placeholder="Enter domain or URL (e.g. yourwebsite.com or https://...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-[#F8F4EE] border border-[#D6B46A]/30 rounded-2xl text-[#111111] placeholder:text-[#8E857B] text-base focus:outline-none focus:border-[#D6B46A] focus:ring-2 focus:ring-[#D6B46A]/20 transition-all font-mono"
              />
            </div>
            <button
              id="seo-audit-submit-btn"
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 sm:py-4 bg-[#111111] hover:bg-[#262626] text-[#FFFDF8] font-semibold rounded-2xl transition-all duration-200 shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer text-base"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#D6B46A]" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-[#D6B46A]" />
                  <span>Run SEO Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo links */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#8E857B]">Try sample domain:</span>
            {sampleDomains.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => { setUrlInput(d); handleRunAudit(d); }}
                className="text-xs px-2.5 py-1 bg-[#F8F4EE] hover:bg-[#D6B46A]/15 border border-[#D6B46A]/20 hover:border-[#D6B46A]/50 rounded-lg text-[#4A443E] transition-all font-mono"
              >
                {d}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Audit Diagnostic Notice</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton Simulation */}
      {loading && (
        <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-3xl p-10 text-center space-y-4 shadow-soft-sm">
          <div className="inline-block p-4 rounded-2xl bg-[#F8F4EE] animate-pulse">
            <RefreshCw className="w-8 h-8 text-[#D6B46A] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-[#111111]">Scanning Real-Time SEO Architecture...</h3>
          <p className="text-sm text-[#6B635B] max-w-md mx-auto">
            Extracting HTTP status, title tags, SERP pixel widths, heading hierarchy, OpenGraph cards, image accessibility, and keyword density.
          </p>
        </div>
      )}

      {/* 2. Audit Results Presentation */}
      {data && !loading && (
        <div id="seo-audit-results" className="space-y-8 animate-fadeIn">
          {/* Top Bar: Action Bar & Hostname Banner */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#85641C]">Live Audit Report</span>
                <span className="text-xs text-[#8E857B]">• {data.statusCode ? `HTTP ${data.statusCode}` : 'Analyzed'} • {data.responseTimeMs}ms</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] break-all font-mono">
                {data.hostname}
              </h3>
              <p className="text-xs text-[#8E857B]">
                Canonical Target: <span className="font-mono text-[#4A443E]">{data.url}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                id="copy-summary-btn"
                onClick={handleCopySummary}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#85641C]" />}
                <span>{copiedSummary ? 'Copied Report!' : 'Copy Summary'}</span>
              </button>
              <button
                id="print-report-btn"
                onClick={handlePrint}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#85641C]" />
                <span>Print / PDF</span>
              </button>
              <a
                id="fix-seo-cta-top"
                href={getWhatsAppInquiryUrl(`Hi SamaXon, I audited my site (${data.hostname}) with your SEO tool. Score: ${data.scores.overall}/100. I need your 48-hour engineering fix.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#262626] text-[#FFFDF8] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-soft-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                <span>Fix My SEO in 48 Hours</span>
              </a>
            </div>
          </div>

          {/* Primary Score Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Score & Grade */}
            <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-soft-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-2 relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#D6B46A] font-semibold">Overall SEO Health</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-[#FFFDF8]">
                    {data.scores.overall}
                  </span>
                  <span className="text-2xl font-mono text-[#8E857B]">/100</span>
                  <span className="ml-auto px-3.5 py-1.5 rounded-xl bg-[#D6B46A] text-[#111111] text-lg font-black font-mono shadow-gold-soft">
                    Grade {data.grade}
                  </span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="my-6 space-y-2 relative z-10">
                <div className="w-full h-3 bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${data.scores.overall}%`,
                      backgroundColor: getScoreColor(data.scores.overall)
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#8E857B] font-mono">
                  <span>Critical (0)</span>
                  <span>Average (60)</span>
                  <span>Optimized (90+)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#8E857B] relative z-10">
                <span>{data.issues.critical.length} Critical Bugs</span>
                <span>{data.issues.warning.length} Warnings</span>
                <span className="text-emerald-400">{data.issues.passed.length} Passed</span>
              </div>
            </div>

            {/* Sub-Scores Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-2 shadow-soft-xs">
                <span className="text-xs text-[#8E857B] block">Technical & Index</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#111111]">{data.scores.technical}</span>
                  <span className="text-xs text-[#8E857B]">/100</span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D6B46A] rounded-full" style={{ width: `${data.scores.technical}%` }} />
                </div>
                <p className="text-[11px] text-[#6B635B] pt-1">Canonical, Robots, Schema</p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-2 shadow-soft-xs">
                <span className="text-xs text-[#8E857B] block">Content & Meta</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#111111]">{data.scores.content}</span>
                  <span className="text-xs text-[#8E857B]">/100</span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D6B46A] rounded-full" style={{ width: `${data.scores.content}%` }} />
                </div>
                <p className="text-[11px] text-[#6B635B] pt-1">Title, Description, H1/H2</p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-2 shadow-soft-xs">
                <span className="text-xs text-[#8E857B] block">Social & OpenGraph</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#111111]">{data.scores.social}</span>
                  <span className="text-xs text-[#8E857B]">/100</span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D6B46A] rounded-full" style={{ width: `${data.scores.social}%` }} />
                </div>
                <p className="text-[11px] text-[#6B635B] pt-1">og:image, Twitter Card</p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-2 shadow-soft-xs">
                <span className="text-xs text-[#8E857B] block">Accessibility & Img</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#111111]">{data.scores.accessibility}</span>
                  <span className="text-xs text-[#8E857B]">/100</span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D6B46A] rounded-full" style={{ width: `${data.scores.accessibility}%` }} />
                </div>
                <p className="text-[11px] text-[#6B635B] pt-1">Alt Tags, Lang attribute</p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-2 shadow-soft-xs">
                <span className="text-xs text-[#8E857B] block">Security & Trust</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#111111]">{data.scores.security}</span>
                  <span className="text-xs text-[#8E857B]">/100</span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D6B46A] rounded-full" style={{ width: `${data.scores.security}%` }} />
                </div>
                <p className="text-[11px] text-[#6B635B] pt-1">HTTPS, HSTS, Frame Guard</p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-2 shadow-soft-xs">
                <span className="text-xs text-[#8E857B] block">Content Volume</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#111111]">{data.meta.content.wordCount}</span>
                  <span className="text-xs text-[#8E857B]">words</span>
                </div>
                <p className="text-[11px] text-[#6B635B] pt-2 font-mono">
                  ~{data.meta.content.readingTimeMinutes} min read • {data.meta.content.textToHtmlRatio}% text ratio
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#D6B46A]/30 pb-3">
            {[
              { id: 'overview', label: 'Overview & Highlights' },
              { id: 'serp', label: 'Google SERP Preview' },
              { id: 'headings', label: 'Heading Outline' },
              { id: 'social', label: 'Social Share Cards' },
              { id: 'checklist', label: `Actionable Checklist (${data.issues.critical.length + data.issues.warning.length})` }
            ].map(t => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-[#111111] text-[#FFFDF8] shadow-soft-xs'
                    : 'bg-[#FFFDF8] text-[#6B635B] hover:text-[#111111] hover:bg-[#F8F4EE] border border-[#D6B46A]/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & HIGHLIGHTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Core Meta Tag Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#111111]">Document & Meta Tags</h4>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#D6B46A]/15 text-[#85641C] font-mono font-semibold">
                      {data.meta.title ? `${data.meta.title.length} chars` : 'Missing'}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-[#8E857B] block mb-1">Page Title (&lt;title&gt;)</span>
                      <p className="font-semibold text-[#111111] bg-[#F8F4EE] p-3 rounded-xl border border-[#D6B46A]/20 text-xs sm:text-sm font-mono">
                        {data.meta.title || <span className="text-red-500 italic">No &lt;title&gt; found on page</span>}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-[#8E857B] block mb-1">Meta Description</span>
                      <p className="text-[#4A443E] bg-[#F8F4EE] p-3 rounded-xl border border-[#D6B46A]/20 text-xs leading-relaxed">
                        {data.meta.metaDescription || <span className="text-red-500 italic">No meta description found. Google will construct auto-snippets.</span>}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-[#F8F4EE] p-2.5 rounded-xl border border-[#D6B46A]/20">
                        <span className="text-[#8E857B] block">Canonical Status</span>
                        <span className="font-semibold text-[#111111] truncate block">{data.meta.canonicalUrl ? 'Configured' : 'Missing'}</span>
                      </div>
                      <div className="bg-[#F8F4EE] p-2.5 rounded-xl border border-[#D6B46A]/20">
                        <span className="text-[#8E857B] block">Robots Directives</span>
                        <span className="font-semibold text-[#111111]">{data.meta.robots}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyword Density & Commercial Gaps */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#111111]">Keywords & Density</h4>
                    <span className="text-xs text-[#8E857B]">Top Extracted Terms</span>
                  </div>

                  <div className="space-y-2">
                    {data.keywords.top.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {data.keywords.top.map((kw, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 bg-[#F8F4EE] rounded-xl text-xs border border-[#D6B46A]/20 font-mono">
                            <span className="font-medium text-[#111111] truncate">{kw.keyword}</span>
                            <span className="text-[#85641C] font-semibold shrink-0">{kw.density}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8E857B] italic">No significant keywords extracted from HTML payload.</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#D6B46A]/20 space-y-2">
                    <span className="text-xs font-semibold text-[#111111] block">High-Intent Conversion Gaps:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.keywords.missingCommercial.map((gap, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg">
                          + {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SERP PREVIEW */}
          {activeTab === 'serp' && (
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 shadow-soft-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-[#111111]">Live Google Search Snippet Preview</h4>
                  <p className="text-xs text-[#6B635B] mt-0.5">
                    Preview how your title, URL breadcrumb, and meta description render inside real Google search results.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8F4EE] p-1 rounded-xl border border-[#D6B46A]/30">
                  <button
                    onClick={() => setSerpDevice('desktop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      serpDevice === 'desktop' ? 'bg-[#111111] text-[#FFFDF8]' : 'text-[#6B635B] hover:text-[#111111]'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Desktop SERP</span>
                  </button>
                  <button
                    onClick={() => setSerpDevice('mobile')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      serpDevice === 'mobile' ? 'bg-[#111111] text-[#FFFDF8]' : 'text-[#6B635B] hover:text-[#111111]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile SERP</span>
                  </button>
                </div>
              </div>

              {/* SERP Card Box */}
              <div className="p-6 sm:p-8 bg-white border border-[#111111]/10 rounded-2xl shadow-soft-sm max-w-2xl">
                {/* Simulated Google Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#F8F4EE] border border-[#D6B46A]/30 flex items-center justify-center text-[10px] font-bold text-[#85641C]">
                    {data.hostname.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs font-sans text-[#202124] flex flex-col">
                    <span className="font-normal text-[14px] leading-tight">{data.hostname}</span>
                    <span className="text-[12px] text-[#4d5156] font-mono leading-tight truncate">https://{data.hostname} › ...</span>
                  </div>
                </div>

                {/* Title */}
                <h5 className="text-[18px] sm:text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-sans leading-snug break-words">
                  {data.meta.title || `${data.hostname} - Official Portal`}
                </h5>

                {/* Description */}
                <p className="text-[13px] sm:text-[14px] text-[#4d5156] mt-1.5 leading-relaxed font-sans">
                  {data.meta.metaDescription || `${data.hostname} provides digital services. Discover capabilities, portfolio, and direct inquiries.`}
                </p>
              </div>

              {/* Pixel Width & Guidance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 space-y-1">
                  <span className="text-[#8E857B] block font-semibold">Title Width Calculation</span>
                  <p className="text-[#111111] font-mono">
                    ~{data.meta.titlePixelEstimate || 420}px / 600px max limit ({data.meta.title?.length || 0} characters)
                  </p>
                  <p className="text-[11px] text-[#6B635B]">
                    {(data.meta.title?.length || 0) <= 60 ? '✓ Within safe limits; will not be truncated with ellipsis.' : '⚠️ Exceeds 60 characters; Google may cut off with "..."'}
                  </p>
                </div>

                <div className="p-4 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 space-y-1">
                  <span className="text-[#8E857B] block font-semibold">Description Length</span>
                  <p className="text-[#111111] font-mono">
                    {data.meta.metaDescription?.length || 0} characters (sweet spot: 120–160 chars)
                  </p>
                  <p className="text-[11px] text-[#6B635B]">
                    {(data.meta.metaDescription?.length || 0) >= 120 && (data.meta.metaDescription?.length || 0) <= 165
                      ? '✓ Optimal snippet visibility on both desktop and mobile.'
                      : '⚠️ Consider writing between 120 and 160 characters for maximum CTR.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEADINGS OUTLINE */}
          {activeTab === 'headings' && (
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-[#111111]">Document Heading Architecture</h4>
                  <p className="text-xs text-[#6B635B]">
                    Inspect how search crawlers interpret your document outline. Exactly 1 primary &lt;h1&gt; is recommended.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 bg-[#111111] text-[#FFFDF8] rounded-lg">
                    H1: {data.meta.headings.h1.length}
                  </span>
                  <span className="px-2.5 py-1 bg-[#F8F4EE] border border-[#D6B46A]/30 text-[#4A443E] rounded-lg">
                    H2: {data.meta.headings.h2Count}
                  </span>
                  <span className="px-2.5 py-1 bg-[#F8F4EE] border border-[#D6B46A]/30 text-[#4A443E] rounded-lg">
                    H3: {data.meta.headings.h3Count}
                  </span>
                </div>
              </div>

              {/* Headings Outline Tree */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {data.meta.headings.outline.length > 0 ? (
                  data.meta.headings.outline.map((h, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-mono flex items-start gap-3 ${
                        h.level === 'H1'
                          ? 'bg-[#111111] text-[#FFFDF8] border-[#111111]'
                          : h.level === 'H2'
                          ? 'bg-[#F8F4EE] text-[#111111] border-[#D6B46A]/30 ml-4'
                          : 'bg-[#FFFDF8] text-[#4A443E] border-[#111111]/10 ml-8'
                      }`}
                    >
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        h.level === 'H1' ? 'bg-[#D6B46A] text-[#111111]' : 'bg-[#D6B46A]/20 text-[#85641C]'
                      }`}>
                        {h.level}
                      </span>
                      <span className="break-words font-sans">{h.text}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8E857B] italic">No &lt;h1&gt;, &lt;h2&gt;, or &lt;h3&gt; tags detected in HTML body.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL SHARE CARDS */}
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook / LinkedIn OpenGraph Card */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 space-y-4 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#111111]">OpenGraph (Facebook / LinkedIn)</h4>
                  <span className="text-xs text-[#85641C] font-mono">og:image preview</span>
                </div>

                <div className="border border-[#111111]/15 rounded-2xl overflow-hidden bg-white shadow-soft-xs">
                  {data.meta.ogImage ? (
                    <img
                      src={data.meta.ogImage}
                      alt="OG Preview"
                      className="w-full h-44 object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-44 bg-[#F8F4EE] flex items-center justify-center text-[#8E857B] text-xs font-mono">
                      No og:image tag configured
                    </div>
                  )}
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#8E857B] block truncate">
                      {data.hostname}
                    </span>
                    <p className="text-sm font-bold text-[#111111] line-clamp-1">
                      {data.meta.ogTitle || data.meta.title || data.hostname}
                    </p>
                    <p className="text-xs text-[#6B635B] line-clamp-2">
                      {data.meta.ogDescription || data.meta.metaDescription || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Twitter Card */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 space-y-4 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#111111]">Twitter / X Card Preview</h4>
                  <span className="text-xs text-[#85641C] font-mono">{data.meta.twitterCard || 'summary'}</span>
                </div>

                <div className="border border-[#111111]/15 rounded-2xl overflow-hidden bg-white shadow-soft-xs">
                  {data.meta.twitterImage || data.meta.ogImage ? (
                    <img
                      src={data.meta.twitterImage || data.meta.ogImage || ''}
                      alt="Twitter Preview"
                      className="w-full h-44 object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-44 bg-[#F8F4EE] flex items-center justify-center text-[#8E857B] text-xs font-mono">
                      No twitter:image tag detected
                    </div>
                  )}
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-mono text-[#8E857B] block truncate">
                      {data.hostname}
                    </span>
                    <p className="text-sm font-bold text-[#111111] line-clamp-1">
                      {data.meta.twitterTitle || data.meta.ogTitle || data.meta.title || data.hostname}
                    </p>
                    <p className="text-xs text-[#6B635B] line-clamp-2">
                      {data.meta.ogDescription || data.meta.metaDescription || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIONABLE CHECKLIST & FIXES */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              {/* Severity Filter Controls */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `All Checks (${data.issues.critical.length + data.issues.warning.length + data.issues.passed.length})` },
                  { id: 'critical', label: `Critical (${data.issues.critical.length})`, count: data.issues.critical.length },
                  { id: 'warning', label: `Warnings (${data.issues.warning.length})`, count: data.issues.warning.length },
                  { id: 'passed', label: `Passed (${data.issues.passed.length})`, count: data.issues.passed.length }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterSeverity(f.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      filterSeverity === f.id
                        ? 'bg-[#111111] text-[#FFFDF8]'
                        : 'bg-[#FFFDF8] text-[#6B635B] hover:text-[#111111] border border-[#D6B46A]/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                {/* 1. Critical Issues */}
                {(filterSeverity === 'all' || filterSeverity === 'critical') &&
                  data.issues.critical.map((issue, idx) => {
                    const key = `crit-${idx}`;
                    const isExp = expandedIssueIdx === key;
                    return (
                      <div key={key} className="bg-[#FFFDF8] border-l-4 border-l-red-500 border border-[#D6B46A]/30 rounded-2xl p-4 sm:p-5 shadow-soft-xs space-y-3">
                        <div 
                          className="flex items-start justify-between cursor-pointer"
                          onClick={() => setExpandedIssueIdx(isExp ? null : key)}
                        >
                          <div className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">Critical Deficit</span>
                                <h5 className="font-bold text-[#111111] text-sm">{issue.title}</h5>
                              </div>
                              <p className="text-xs text-[#6B635B] mt-1">{issue.description}</p>
                            </div>
                          </div>
                          <button className="text-[#8E857B] p-1">
                            {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Collapsible Action & Copyable Code */}
                        <AnimatePresence>
                          {isExp && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-3 border-t border-[#111111]/10 space-y-3"
                            >
                              <div className="p-3 bg-red-50/70 rounded-xl text-xs text-red-900">
                                <span className="font-semibold block mb-0.5">Recommended Remediation:</span>
                                {issue.recommendation}
                              </div>

                              {issue.fixCode && (
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs text-[#8E857B]">
                                    <span className="font-mono text-[11px]">Drop-in HTML / Server Fix:</span>
                                    <button
                                      onClick={() => handleCopyCode(issue.fixCode!, key)}
                                      className="text-xs text-[#85641C] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                                    >
                                      {copiedCode === key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                      <span>{copiedCode === key ? 'Copied Snippet!' : 'Copy Code'}</span>
                                    </button>
                                  </div>
                                  <pre className="p-3 bg-[#111111] text-[#FFFDF8] rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                    {issue.fixCode}
                                  </pre>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                {/* 2. Warning Issues */}
                {(filterSeverity === 'all' || filterSeverity === 'warning') &&
                  data.issues.warning.map((issue, idx) => {
                    const key = `warn-${idx}`;
                    const isExp = expandedIssueIdx === key;
                    return (
                      <div key={key} className="bg-[#FFFDF8] border-l-4 border-l-amber-500 border border-[#D6B46A]/30 rounded-2xl p-4 sm:p-5 shadow-soft-xs space-y-3">
                        <div 
                          className="flex items-start justify-between cursor-pointer"
                          onClick={() => setExpandedIssueIdx(isExp ? null : key)}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">Optimization Warning</span>
                                <h5 className="font-bold text-[#111111] text-sm">{issue.title}</h5>
                              </div>
                              <p className="text-xs text-[#6B635B] mt-1">{issue.description}</p>
                            </div>
                          </div>
                          <button className="text-[#8E857B] p-1">
                            {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        <AnimatePresence>
                          {isExp && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-3 border-t border-[#111111]/10 space-y-3"
                            >
                              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900">
                                <span className="font-semibold block mb-0.5">Recommended Remediation:</span>
                                {issue.recommendation}
                              </div>

                              {issue.fixCode && (
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs text-[#8E857B]">
                                    <span className="font-mono text-[11px]">Copyable Code Snippet:</span>
                                    <button
                                      onClick={() => handleCopyCode(issue.fixCode!, key)}
                                      className="text-xs text-[#85641C] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                                    >
                                      {copiedCode === key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                      <span>{copiedCode === key ? 'Copied Snippet!' : 'Copy Code'}</span>
                                    </button>
                                  </div>
                                  <pre className="p-3 bg-[#111111] text-[#FFFDF8] rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                    {issue.fixCode}
                                  </pre>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                {/* 3. Passed Checks */}
                {(filterSeverity === 'all' || filterSeverity === 'passed') &&
                  data.issues.passed.map((issue, idx) => (
                    <div key={`pass-${idx}`} className="bg-[#FFFDF8] border-l-4 border-l-emerald-500 border border-[#D6B46A]/30 rounded-2xl p-4 sm:p-5 shadow-soft-xs flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Passed</span>
                          <h5 className="font-bold text-[#111111] text-sm">{issue.title}</h5>
                        </div>
                        <p className="text-xs text-[#6B635B] mt-0.5">{issue.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Bottom Conversion CTA: Request 48-Hour Professional SEO Overhaul */}
          <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-soft-xl">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#D6B46A]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D6B46A]">Guaranteed 48-Hour Resolution</span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDF8]">
                Need these SEO issues fixed professionally on your domain?
              </h3>
              <p className="text-[#8E857B] text-sm sm:text-base leading-relaxed">
                SamaXon delivers comprehensive technical SEO remediation, JSON-LD rich snippet schema integration, meta tag overhauls, and sub-0.4s performance acceleration in under 48 hours. Zero monthly retainers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  id="seo-audit-whatsapp-cta"
                  href={getWhatsAppInquiryUrl(`Hi SamaXon, I completed an SEO audit on ${data.hostname} (Score: ${data.scores.overall}/100). Please share your 48-hour fix proposal.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-bold rounded-2xl transition-all shadow-gold-soft flex items-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#111111]" />
                  <span>Request 48-Hour SEO Fix via WhatsApp</span>
                </a>
                <a
                  id="seo-audit-portal-cta"
                  href="/contact"
                  className="px-6 py-3.5 bg-transparent hover:bg-white/5 border border-[#D6B46A]/40 text-[#FFFDF8] font-semibold rounded-2xl transition-all text-sm flex items-center gap-2"
                >
                  <span>Open Direct Service Ticket</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D6B46A]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
