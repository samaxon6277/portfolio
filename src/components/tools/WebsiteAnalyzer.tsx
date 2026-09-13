import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Shield, AlertTriangle, CheckCircle2, XCircle, Globe, 
  Sparkles, Lock, Unlock, FileText, Code2, Gauge, Zap, Copy, 
  Check, Printer, ArrowRight, ExternalLink, RefreshCw, Key, 
  HelpCircle, Eye, EyeOff, Terminal, Compass, Layers, Wrench,
  ChevronDown, ChevronUp, Filter, FileCode2, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { runClientWebsiteAudit, ScannedSubpage } from '../../utils/clientWebsiteAnalyzer';

interface IssueItem {
  category: 'security' | 'seo' | 'code' | 'performance';
  severity: 'critical' | 'warning' | 'passed';
  title: string;
  description: string;
  recommendation: string;
}

interface AuditReport {
  success: boolean;
  reachable: boolean;
  error?: string;
  url: string;
  finalUrl?: string;
  hostname: string;
  statusCode?: number;
  responseTimeMs?: number;
  analyzedAt: string;
  scores?: {
    overall: number;
    security: number;
    seo: number;
    code: number;
    performance: number;
  };
  meta?: {
    title: string;
    metaDescription: string;
    canonicalUrl: string;
    robotsContent: string;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    h1List: string[];
    h2Count: number;
    h3Count: number;
    totalImages: number;
    imagesWithoutAltCount: number;
    missingAltImages: string[];
    scriptTags: number;
    stylesheetTags: number;
    htmlSizeKb: number;
    isHttps: boolean;
    hasDoctype: boolean;
    hasViewport: boolean;
    isZoomLocked: boolean;
    hasCharset: boolean;
  };
  internalPages?: ScannedSubpage[];
  animationAnalysis?: {
    keyframeMatches: number;
    transitionAllCount: number;
    nonCompositedFound: string[];
    hasReducedMotion: boolean;
    animationJankRisk: 'Low' | 'Moderate' | 'High';
    detectedAnimationLibraries: string[];
  };
  deepHealth?: {
    mixedContentCount: number;
    renderBlockingScriptsCount: number;
    hasJsonLd: boolean;
    hasHtmlLang: boolean;
    imagesMissingDimensions: number;
  };
  keywords?: {
    topKeywords: { keyword: string; count: number; density: number }[];
    missingKeywords: string[];
  };
  issues?: {
    critical: IssueItem[];
    warning: IssueItem[];
    passed: IssueItem[];
  };
}

export default function WebsiteAnalyzer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'security' | 'seo' | 'code' | 'performance'>('all');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Subpage Deep Crawler Filter & State
  const [subpageSearch, setSubpageSearch] = useState('');
  const [subpageFilter, setSubpageFilter] = useState<'all' | 'issues' | 'clean' | 'slow'>('all');
  const [expandedSubpagePath, setExpandedSubpagePath] = useState<string | null>(null);

  const sampleUrls = [
    { label: 'SamaXon Official', url: 'https://samaxon.site' },
    { label: 'Stripe', url: 'https://stripe.com' },
    { label: 'Apple', url: 'https://apple.com' },
    { label: 'Wikipedia', url: 'https://wikipedia.org' }
  ];

  const loadingSteps = [
    'Connecting to remote host and validating SSL handshake...',
    'Inspecting HTTP security headers (HSTS, CSP, X-Frame)...',
    'Crawling all internal website subpages and checking route health...',
    'Analyzing HTML structure, headings, viewport & image alt tags...',
    'Scanning 1,000+ SEO keywords and computing performance index...'
  ];

  // Auto-analyze if URL query parameter provided (?url=example.com)
  useEffect(() => {
    const urlFromQuery = searchParams.get('url');
    if (urlFromQuery && urlFromQuery.trim()) {
      setInputUrl(urlFromQuery);
      handleAnalyze(urlFromQuery);
    }
  }, [searchParams]);

  const handleAnalyze = async (overrideUrl?: string) => {
    const target = overrideUrl || inputUrl;
    if (!target.trim()) {
      setErrorMessage('Please enter a website URL (e.g. example.com).');
      return;
    }

    setErrorMessage('');
    setLoading(true);
    setLoadingStep(0);
    setReport(null);
    setExpandedSubpagePath(null);

    // Step cycle animation
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 850);

    try {
      let data: any = null;

      // 1. Try POST to /api/analyze-website
      try {
        const response = await fetch('/api/analyze-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: target })
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson && resJson.success && resJson.scores) {
            data = resJson;
          }
        }
      } catch (postErr) {
        console.warn('POST /api/analyze-website failed, trying GET fallback:', postErr);
      }

      // 2. Try GET to /api/analyze-website?url=... fallback (handles strict CORS / Vercel rewrite)
      if (!data) {
        try {
          const getRes = await fetch(`/api/analyze-website?url=${encodeURIComponent(target)}`);
          if (getRes.ok) {
            const resJson = await getRes.json();
            if (resJson && resJson.success && resJson.scores) {
              data = resJson;
            }
          }
        } catch (getErr) {
          console.warn('GET /api/analyze-website failed:', getErr);
        }
      }

      // 3. Resilient Client-side Engine fallback with DOMParser & multi-proxy crawler
      if (!data || !data.success || !data.scores) {
        data = await runClientWebsiteAudit(target);
      }

      clearInterval(stepInterval);
      setReport(data);
      try {
        sessionStorage.setItem('samaxon_last_audit', JSON.stringify(data));
      } catch {}
    } catch (err: any) {
      clearInterval(stepInterval);
      try {
        const fallbackData = await runClientWebsiteAudit(target);
        setReport(fallbackData);
        try {
          sessionStorage.setItem('samaxon_last_audit', JSON.stringify(fallbackData));
        } catch {}
      } catch {
        setErrorMessage('Failed to execute website inspection. Please verify the URL.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFix = (issue?: IssueItem | { title: string }) => {
    if (!report) return;
    try {
      sessionStorage.setItem('samaxon_last_audit', JSON.stringify(report));
    } catch {}
    navigate('/audit-fix-request', {
      state: {
        report,
        preselectedIssue: issue?.title
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Exceptional Health', ring: '#10B981' };
    if (score >= 80) return { grade: 'A', label: 'Good Health', ring: '#10B981' };
    if (score >= 70) return { grade: 'B', label: 'Needs Optimization', ring: '#F59E0B' };
    if (score >= 55) return { grade: 'C', label: 'Warning / Fixes Required', ring: '#EF4444' };
    return { grade: 'F', label: 'Critical Vulnerabilities', ring: '#DC2626' };
  };

  const filteredIssues = () => {
    if (!report || !report.issues) return [];
    const all = [
      ...(report.issues.critical || []),
      ...(report.issues.warning || []),
      ...(report.issues.passed || [])
    ];
    if (activeCategory === 'all') return all;
    return all.filter(i => i.category === activeCategory);
  };

  // Subpage crawler filtering logic
  const filteredSubpages = useMemo(() => {
    if (!report?.internalPages) return [];
    return report.internalPages.filter(page => {
      // Search filter
      if (subpageSearch.trim()) {
        const query = subpageSearch.toLowerCase();
        const matchesPath = page.path.toLowerCase().includes(query);
        const matchesTitle = page.title?.toLowerCase().includes(query);
        if (!matchesPath && !matchesTitle) return false;
      }

      // Status / health filter
      if (subpageFilter === 'issues') {
        const hasIssue = !page.ok || (page.pageScore !== undefined && page.pageScore < 85) || (page.issues && page.issues.some(i => i.severity !== 'passed'));
        return hasIssue;
      }
      if (subpageFilter === 'clean') {
        const isClean = page.ok && (page.pageScore === undefined || page.pageScore >= 85) && (!page.issues || !page.issues.some(i => i.severity === 'critical'));
        return isClean;
      }
      if (subpageFilter === 'slow') {
        return page.responseTimeMs > 900;
      }
      return true;
    });
  }, [report?.internalPages, subpageSearch, subpageFilter]);

  const copyReportSummary = () => {
    if (!report) return;
    const summary = `
SamaXon Website Health & Multi-Page Audit Report
Target: ${report.url}
Overall Health Score: ${report.scores?.overall || 0}/100
Security Score: ${report.scores?.security || 0}/100
SEO Score: ${report.scores?.seo || 0}/100
Code & Bug Score: ${report.scores?.code || 0}/100
Performance Score: ${report.scores?.performance || 0}/100
Pages Audited: ${report.internalPages?.length || 1} pages
Latency: ${report.responseTimeMs || 0}ms
Generated by: SamaXon Digital Studio (https://samaxon.site/analyzer)
    `.trim();
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10" id="website-analyzer-tool">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D6B46A]/15 border border-[#D6B46A]/35 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#85641C]">
            Live Multi-Page Crawler &amp; Security Auditor
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#111111] tracking-tight">
          Website Health, Security &amp; Subpage Inspector
        </h1>

        <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
          Deep diagnostic crawler that scans every internal subpage of your domain. Audits SSL protocols, HTTP response times, broken image alt tags, missing meta descriptions, animation jank, and 1,000+ high-intent search keywords.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8A8178]">
                <Globe className="w-5 h-5 text-[#BFA15A]" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter domain or URL (e.g. yourbusiness.com, stripe.com)"
                className="w-full pl-12 pr-4 py-4 bg-[#FFFDF8] border border-[#D6B46A]/40 focus:border-[#D6B46A] rounded-2xl text-xs sm:text-sm font-mono text-[#111111] placeholder:text-[#8A8178] focus:outline-none focus:ring-2 focus:ring-[#D6B46A]/20 transition-all shadow-xs"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] hover:text-[#D6B46A] font-display font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D6B46A]" />
                  <span>Scanning Site...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#D6B46A]" />
                  <span>Scan Entire Website</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preset Sample URLs */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-left">
            <span className="text-[11px] font-mono font-bold uppercase text-[#8A8178]">
              Quick Test:
            </span>
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputUrl(s.url);
                  handleAnalyze(s.url);
                }}
                className="px-3 py-1 bg-[#F4EFE6]/60 hover:bg-[#F4EFE6] border border-[#D6B46A]/25 rounded-lg text-xs font-mono text-[#111111] hover:text-[#85641C] transition-all cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </form>

        {/* Loading Progress State */}
        {loading && (
          <div className="pt-6 border-t border-[#D6B46A]/20 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A8178]">
              <span className="flex items-center gap-2 text-[#111111] font-bold">
                <Compass className="w-4 h-4 text-[#D6B46A] animate-spin" />
                Crawling domain architecture &amp; inspecting every subpage...
              </span>
              <span className="text-[#85641C] font-bold">Step {loadingStep + 1} of {loadingSteps.length}</span>
            </div>

            <div className="w-full bg-[#F4EFE6] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#D6B46A] h-full transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>

            <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl font-mono text-xs text-[#85641C] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{loadingSteps[loadingStep]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Audit Report Presentation */}
      {report && (
        <div className="space-y-10 animate-fade-in">
          {/* Top Scorecard Banner */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-6">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
                    {report.hostname}
                  </h3>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#85641C] hover:underline"
                  >
                    <span>Visit Target</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#8A8178] flex-wrap">
                  <span>Audited on: {new Date(report.analyzedAt).toLocaleTimeString()}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">{report.internalPages?.length || 1} Pages Scanned</span>
                  <span>·</span>
                  <span>Status: {report.statusCode || 200} OK</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={copyReportSummary}
                  className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#BFA15A]" />}
                  <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-[#BFA15A]" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => handleRequestFix()}
                  className="px-5 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-display font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Fix Website Issues</span>
                </button>
              </div>
            </div>

            {/* Overall Score Dial & Metric Breakdown */}
            {report.scores && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Dial: Overall */}
                <div className="bg-[#111111] text-[#FFFDF8] p-5 rounded-2xl flex flex-col justify-between items-center text-center shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D6B46A]/10 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B46A] font-bold">
                    Overall Health
                  </span>
                  <div className="my-2">
                    <span className="font-display font-black text-4xl sm:text-5xl text-[#D6B46A]">
                      {report.scores.overall}
                    </span>
                    <span className="text-xs font-mono text-[#D6B46A]/70">/100</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono font-bold">
                    <span className="text-[#D6B46A]">{getScoreGrade(report.scores.overall).grade}</span>
                    <span>·</span>
                    <span className="text-[#FFFDF8]">{getScoreGrade(report.scores.overall).label}</span>
                  </div>
                </div>

                {/* Category 1: Security */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">Security &amp; SSL</span>
                    <Shield className="w-4 h-4 text-[#D6B46A]" />
                  </div>
                  <div className="my-2">
                    <span className="font-display font-black text-2xl text-[#111111]">
                      {report.scores.security}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#8A8178] flex items-center gap-1">
                    {report.meta?.isHttps ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> HTTPS Verified
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Plaintext HTTP
                      </span>
                    )}
                  </div>
                </div>

                {/* Category 2: SEO */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">SEO &amp; Snippets</span>
                    <FileText className="w-4 h-4 text-[#D6B46A]" />
                  </div>
                  <div className="my-2">
                    <span className="font-display font-black text-2xl text-[#111111]">
                      {report.scores.seo}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                  </div>
                  <div className="text-[10px] text-[#8A8178] truncate">
                    Title: {report.meta?.title ? `${report.meta.title.length} chars` : 'Missing'}
                  </div>
                </div>

                {/* Category 3: Bugs & Code */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">Code &amp; Images</span>
                    <Code2 className="w-4 h-4 text-[#D6B46A]" />
                  </div>
                  <div className="my-2">
                    <span className="font-display font-black text-2xl text-[#111111]">
                      {report.scores.code}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                  </div>
                  <div className="text-[10px] text-[#8A8178]">
                    {report.meta?.imagesWithoutAltCount === 0 ? 'No broken alts' : `${report.meta?.imagesWithoutAltCount} missing alts`}
                  </div>
                </div>

                {/* Category 4: Performance */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">Performance</span>
                    <Zap className="w-4 h-4 text-[#D6B46A]" />
                  </div>
                  <div className="my-2">
                    <span className="font-display font-black text-2xl text-[#111111]">
                      {report.scores.performance}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#8A8178]">
                    TTFB: {report.responseTimeMs}ms · {report.meta?.htmlSizeKb}KB
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* DEDICATED DEEP CRAWLER: PAGE-BY-PAGE HEALTH INSPECTION SUITE */}
          {/* ============================================================ */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left" id="crawler-page-by-page-suite">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#85641C]">
                  <Compass className="w-4 h-4 text-[#D6B46A]" />
                  <span>Deep Multi-Page Crawler · Subpage Diagnostic Matrix</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
                  Every Discovered Subpage: Detailed Health &amp; Issue Report
                </h3>
                <p className="text-xs text-[#8A8178]">
                  Every page was individually fetched, crawled, and tested for HTTP status codes, latency, heading tags, image alts, and metadata health.
                </p>
              </div>

              {/* Crawler Quick Metrics */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1.5 bg-[#F4EFE6] border border-[#D6B46A]/20 rounded-xl text-center">
                  <span className="text-[9px] font-mono uppercase text-[#8A8178] block">Total Pages</span>
                  <span className="font-display font-black text-sm text-[#111111]">{report.internalPages?.length || 1}</span>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-[9px] font-mono uppercase text-emerald-700 block">Healthy 200</span>
                  <span className="font-display font-black text-sm text-emerald-700">
                    {report.internalPages?.filter(p => p.ok).length || 1}
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-center">
                  <span className="text-[9px] font-mono uppercase text-rose-700 block">Errors / 404</span>
                  <span className="font-display font-black text-sm text-rose-700">
                    {report.internalPages?.filter(p => !p.ok).length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto">
                {[
                  { id: 'all', label: `All Pages (${report.internalPages?.length || 1})` },
                  { id: 'issues', label: 'Issues Detected' },
                  { id: 'clean', label: 'Clean (100%)' },
                  { id: 'slow', label: 'Slow (>900ms)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSubpageFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      subpageFilter === tab.id
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-[#F4EFE6]/60 text-[#8A8178] hover:text-[#111111] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Subpage Route Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8178]" />
                <input
                  type="text"
                  value={subpageSearch}
                  onChange={(e) => setSubpageSearch(e.target.value)}
                  placeholder="Filter by path (e.g. /about)..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/30 focus:border-[#D6B46A] rounded-xl text-xs font-mono text-[#111111] placeholder:text-[#8A8178] focus:outline-none"
                />
              </div>
            </div>

            {/* Subpages Interactive Accordion Grid */}
            <div className="space-y-3">
              {filteredSubpages.length > 0 ? (
                filteredSubpages.map((page, pIdx) => {
                  const isExpanded = expandedSubpagePath === page.path;
                  const hasPageIssues = !page.ok || (page.issues && page.issues.some(i => i.severity !== 'passed'));

                  return (
                    <div 
                      key={pIdx}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        !page.ok 
                          ? 'border-rose-300 bg-rose-50/20'
                          : hasPageIssues 
                          ? 'border-[#D6B46A]/35 bg-[#FFFDF8]' 
                          : 'border-emerald-200 bg-emerald-50/10'
                      }`}
                    >
                      {/* Header Bar */}
                      <button
                        type="button"
                        onClick={() => setExpandedSubpagePath(isExpanded ? null : page.path)}
                        className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer hover:bg-black/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-black ${
                            page.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {page.status}
                          </span>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-black text-sm text-[#111111]">
                                {page.path}
                              </span>
                              {page.path === '/' && (
                                <span className="px-2 py-0.5 bg-[#D6B46A]/20 text-[#85641C] text-[9px] font-mono font-bold uppercase rounded-md">
                                  Root Homepage
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                page.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {page.ok ? 'HTTP 200 OK' : 'Broken Route'}
                              </span>
                            </div>

                            <p className="text-xs text-[#8A8178] truncate max-w-md sm:max-w-xl">
                              {page.title || 'No HTML Title Configured'}
                            </p>
                          </div>
                        </div>

                        {/* Right quick stats & expand icon */}
                        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                          <span className="text-xs font-mono text-[#8A8178] bg-[#F4EFE6] px-2.5 py-1 rounded-lg">
                            ⚡ {page.responseTimeMs}ms
                          </span>

                          <div className="text-right">
                            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Page Health</span>
                            <span className={`text-xs font-mono font-black ${
                              (page.pageScore || 100) >= 80 ? 'text-emerald-700' : (page.pageScore || 100) >= 60 ? 'text-amber-700' : 'text-rose-700'
                            }`}>
                              {page.pageScore || 90}/100
                            </span>
                          </div>

                          <div className="w-6 h-6 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#8A8178]">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Expandable Page-Specific Diagnostic Details */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 bg-white border-t border-black/5 space-y-4 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 bg-[#F4EFE6]/40 rounded-xl border border-[#D6B46A]/20">
                              <span className="text-[#8A8178] block font-mono text-[10px] uppercase">Page Title Tag</span>
                              <span className="font-bold text-[#111111] block mt-0.5 truncate">
                                {page.title || 'None'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#F4EFE6]/40 rounded-xl border border-[#D6B46A]/20">
                              <span className="text-[#8A8178] block font-mono text-[10px] uppercase">Meta Description</span>
                              <span className={`font-bold block mt-0.5 ${page.hasMetaDescription ? 'text-emerald-700' : 'text-rose-600'}`}>
                                {page.hasMetaDescription ? 'Configured' : 'Missing Tag'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#F4EFE6]/40 rounded-xl border border-[#D6B46A]/20">
                              <span className="text-[#8A8178] block font-mono text-[10px] uppercase">Primary Heading (H1)</span>
                              <span className="font-bold text-[#111111] block mt-0.5 truncate">
                                {page.h1Count ? `${page.h1Count} tags · "${page.h1Text}"` : 'Missing <h1>'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#F4EFE6]/40 rounded-xl border border-[#D6B46A]/20">
                              <span className="text-[#8A8178] block font-mono text-[10px] uppercase">Images on Page</span>
                              <span className={`font-bold block mt-0.5 ${(page.imagesWithoutAltCount || 0) > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                {page.totalImages || 0} images · {(page.imagesWithoutAltCount || 0)} missing alt
                              </span>
                            </div>
                          </div>

                          {/* Specific issues detected on this page */}
                          <div className="space-y-2 pt-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                              Page Diagnostic Status &amp; Recommendations:
                            </span>

                            {page.issues && page.issues.length > 0 ? (
                              page.issues.map((iss, iIdx) => (
                                <div 
                                  key={iIdx}
                                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                                    iss.severity === 'critical'
                                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                                      : iss.severity === 'warning'
                                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {iss.severity === 'critical' && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                                    {iss.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                                    {iss.severity === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                                    <div>
                                      <span className="font-bold block">{iss.title}</span>
                                      <span className="text-[11px] opacity-90">{iss.description}</span>
                                    </div>
                                  </div>

                                  {iss.severity !== 'passed' && (
                                    <button
                                      onClick={() => handleRequestFix({ title: `${page.path}: ${iss.title}` })}
                                      className="shrink-0 px-2.5 py-1 bg-[#111111] text-[#D6B46A] hover:text-[#FFFDF8] rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer"
                                    >
                                      Fix Route
                                    </button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>All health checks for this subpage passed with status 200 OK.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#8A8178] border border-dashed border-[#D6B46A]/30 rounded-2xl">
                  No subpages match your filter query "{subpageSearch || subpageFilter}".
                </div>
              )}
            </div>
          </div>

          {/* Deep Code, Multi-Page & Animation Health Suite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Animation & Jank Risk Analysis */}
            <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                  <h4 className="font-display font-black text-sm text-[#111111]">Animation &amp; Jank Risk</h4>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  report.animationAnalysis?.animationJankRisk === 'High'
                    ? 'bg-rose-100 text-rose-800'
                    : report.animationAnalysis?.animationJankRisk === 'Moderate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {report.animationAnalysis?.animationJankRisk || 'Low'} Risk
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#8A8178]">CSS Keyframe Rules:</span>
                  <span className="font-mono font-bold text-[#111111]">{report.animationAnalysis?.keyframeMatches || 0} blocks</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#8A8178]">Hazardous transition: all:</span>
                  <span className="font-mono font-bold text-[#111111]">{report.animationAnalysis?.transitionAllCount || 0} rules</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#8A8178]">prefers-reduced-motion:</span>
                  <span className={`font-mono font-bold ${report.animationAnalysis?.hasReducedMotion ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {report.animationAnalysis?.hasReducedMotion ? 'Configured' : 'Missing Fallback'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8A8178]">Non-Composited Props:</span>
                  <span className="font-mono text-[11px] text-rose-600 font-bold truncate max-w-[180px]">
                    {report.animationAnalysis?.nonCompositedFound?.length 
                      ? report.animationAnalysis.nonCompositedFound.join(', ')
                      : 'None (Clean)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Deep Technical & DOM Health */}
            <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#D6B46A]" />
                  <h4 className="font-display font-black text-sm text-[#111111]">Deep DOM &amp; Security</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#F4EFE6] px-2 py-0.5 rounded-full text-[#8A8178]">
                  Core Health
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#8A8178]">Mixed-Content Links:</span>
                  <span className={`font-mono font-bold ${(report.deepHealth?.mixedContentCount || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {report.deepHealth?.mixedContentCount || 0} insecure
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#8A8178]">Render-Blocking Head Scripts:</span>
                  <span className={`font-mono font-bold ${(report.deepHealth?.renderBlockingScriptsCount || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {report.deepHealth?.renderBlockingScriptsCount || 0} scripts
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#8A8178]">Schema.org JSON-LD:</span>
                  <span className={`font-mono font-bold ${report.deepHealth?.hasJsonLd ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {report.deepHealth?.hasJsonLd ? 'Detected' : 'Missing'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8A8178]">HTML lang Attribute:</span>
                  <span className={`font-mono font-bold ${report.deepHealth?.hasHtmlLang ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {report.deepHealth?.hasHtmlLang ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Missing SEO Keywords & Keyword Density Engine */}
          <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D6B46A]/15 pb-4">
              <div className="space-y-1 text-left">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#85641C]">
                  <Key className="w-3.5 h-3.5" />
                  <span>Keyword Intelligence &amp; Gap Detection</span>
                </div>
                <h4 className="font-display font-black text-lg text-[#111111]">
                  Extracted Keywords vs. Missing High-Intent Search Queries
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              {/* Missing High-Value Keywords */}
              <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Missing High-Value Keywords
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Recommended Gap Fixes
                  </span>
                </div>
                <p className="text-xs text-[#8A8178] leading-relaxed">
                  These high-intent search terms are critical for conversions but were <strong>not found</strong> in the page headings or body copy:
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {report.keywords?.missingKeywords && report.keywords.missingKeywords.length > 0 ? (
                    report.keywords.missingKeywords.map(keyword => (
                      <span 
                        key={keyword}
                        className="px-3 py-1.5 bg-white border border-amber-300 text-[#111111] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#8A8178] italic">No major keyword gaps identified.</span>
                  )}
                </div>
              </div>

              {/* Identified Top Keywords */}
              <div className="p-5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Top Page Keywords Found
                  </span>
                  <span className="text-[10px] font-mono text-[#8A8178]">
                    Density &amp; Frequency
                  </span>
                </div>
                <p className="text-xs text-[#8A8178]">
                  Prominent terms currently indexed from your document body:
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {report.keywords?.topKeywords && report.keywords.topKeywords.length > 0 ? (
                    report.keywords.topKeywords.slice(0, 8).map(kw => (
                      <span 
                        key={kw.keyword}
                        className="px-2.5 py-1 bg-white border border-[#D6B46A]/30 text-[#111111] rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 shadow-xs"
                      >
                        <span className="font-bold">{kw.keyword}</span>
                        <span className="text-[10px] text-[#85641C]">({kw.count}x · {kw.density}%)</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#8A8178] italic">No text content detected.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Issues & Bug Checklist */}
          <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
              <div className="space-y-1 text-left">
                <h4 className="font-display font-black text-lg text-[#111111]">
                  Diagnostic Audit Checklist &amp; Remediation Plan
                </h4>
                <p className="text-xs text-[#8A8178]">
                  Detailed breakdown of vulnerabilities, missing parameters, and passed verifications.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Checks' },
                  { id: 'security', label: 'Security' },
                  { id: 'seo', label: 'SEO' },
                  { id: 'code', label: 'Bugs & Code' },
                  { id: 'performance', label: 'Performance' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'text-[#8A8178] hover:text-[#111111] hover:bg-[#F4EFE6]/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Issues List */}
            <div className="space-y-4">
              {filteredIssues().length > 0 ? (
                filteredIssues().map((issue, idx) => {
                  const isCritical = issue.severity === 'critical';
                  const isWarning = issue.severity === 'warning';
                  const isPassed = issue.severity === 'passed';

                  return (
                    <div 
                      key={idx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all text-left space-y-3 ${
                        isCritical 
                          ? 'bg-rose-500/5 border-rose-500/30' 
                          : isWarning 
                          ? 'bg-amber-500/5 border-amber-500/30' 
                          : 'bg-emerald-500/5 border-emerald-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {isCritical && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                          {isPassed && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display font-black text-sm text-[#111111]">
                                {issue.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                                isCritical ? 'bg-rose-100 text-rose-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {issue.severity}
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">
                                {issue.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#8A8178] leading-relaxed">
                              {issue.description}
                            </p>
                          </div>
                        </div>

                        {!isPassed && (
                          <button
                            onClick={() => handleRequestFix(issue)}
                            className="shrink-0 px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                            title="Request engineering team to fix this issue"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Fix Problem</span>
                          </button>
                        )}
                      </div>

                      {/* Remediation code / advice */}
                      {issue.recommendation && (
                        <div className="mt-2 pt-2.5 border-t border-black/5 flex items-start gap-2 text-xs">
                          <Terminal className="w-3.5 h-3.5 text-[#BFA15A] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#111111] text-[11px] uppercase tracking-wider block">Recommended Fix:</span>
                            <span className="text-[#8A8178] font-mono text-[11px]">{issue.recommendation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#8A8178]">
                  No items found for category "{activeCategory}".
                </div>
              )}
            </div>
          </div>

          {/* CTA Banner: Fix Issues with SamaXon */}
          <div className="bg-radial from-[#222222] to-[#111111] text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
            <div className="space-y-2 max-w-xl text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
                Professional Engineering Resolution
              </span>
              <h4 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                Need These Security Bugs &amp; SEO Gaps Fixed in 48 Hours?
              </h4>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                SamaXon senior engineers resolve critical vulnerabilities, eliminate animation jank, optimize server latency, and configure proper schema &amp; high-converting keyword architectures with a zero downtime guarantee.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => handleRequestFix()}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#D6B46A] hover:bg-[#E5C77F] text-[#111111] font-display font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
              >
                <Wrench className="w-4 h-4" />
                <span>Fix All Issues (48h SLA)</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-display font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Consult Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
