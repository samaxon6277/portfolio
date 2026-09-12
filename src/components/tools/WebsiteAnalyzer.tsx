import React, { useState } from 'react';
import { 
  Search, Shield, AlertTriangle, CheckCircle2, XCircle, Globe, 
  Sparkles, Lock, Unlock, FileText, Code2, Gauge, Zap, Copy, 
  Check, Printer, ArrowRight, ExternalLink, RefreshCw, Key, 
  HelpCircle, Eye, EyeOff, Terminal, Compass, Layers, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { runClientWebsiteAudit } from '../../utils/clientWebsiteAnalyzer';

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
  internalPages?: Array<{
    path: string;
    url: string;
    status: number;
    ok: boolean;
    responseTimeMs: number;
  }>;
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
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'security' | 'seo' | 'code' | 'performance'>('all');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleUrls = [
    { label: 'SamaXon Official', url: 'https://samaxon.site' },
    { label: 'Stripe', url: 'https://stripe.com' },
    { label: 'Apple', url: 'https://apple.com' },
    { label: 'Wikipedia', url: 'https://wikipedia.org' }
  ];

  const loadingSteps = [
    'Connecting to remote host and validating SSL handshake...',
    'Inspecting HTTP security headers (HSTS, CSP, X-Frame)...',
    'Analyzing HTML structure, headings, viewport & image alt tags...',
    'Extracting search keyword density & identifying missing keywords...',
    'Calculating Core Web Vitals, server latency & computing final score...'
  ];

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

    // Step cycle animation
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      let data: any = null;
      try {
        const response = await fetch('/api/analyze-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: target })
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (networkErr) {
        console.warn('Direct /api/analyze-website call bypassed, using client deep diagnostic engine:', networkErr);
      }

      // If backend returned error, 405 Method Not Allowed, or failed, seamlessly run client audit engine
      if (!data || !data.success) {
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

  const handleRequestFix = (issue?: IssueItem) => {
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
    return { grade: 'D', label: 'Critical Bugs & Security Risks', ring: '#EF4444' };
  };

  const handleCopySummary = () => {
    if (!report || !report.scores) return;
    const summary = `=== SAMAXON WEBSITE AUDIT REPORT ===
Target URL: ${report.url}
Overall Health Score: ${report.scores.overall}/100 (${getScoreGrade(report.scores.overall).grade})
- Security Score: ${report.scores.security}/100
- SEO Score: ${report.scores.seo}/100
- Code & Bug Score: ${report.scores.code}/100
- Performance Score: ${report.scores.performance}/100
Critical Issues: ${report.issues?.critical.length || 0}
Warnings: ${report.issues?.warning.length || 0}
Checks Passed: ${report.issues?.passed.length || 0}
Missing SEO Keywords: ${(report.keywords?.missingKeywords || []).join(', ')}
Audited via SamaXon Digital Tools (samaxon.site)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="space-y-10 text-left max-w-6xl mx-auto" id="website-analyzer-suite">
      {/* Header Introduction */}
      <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D6B46A]/10 border border-[#D6B46A]/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#BFA15A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Website Technical Audit</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
              Website Security, Bug &amp; SEO Health Analyzer
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8178] max-w-2xl leading-relaxed">
              Enter any website URL to perform a comprehensive diagnostic inspection: detect security vulnerabilities, missing SSL &amp; headers, code bugs, broken tags, and identify missing high-converting SEO keywords.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-[#8A8178] uppercase font-bold tracking-wider">
              100% Free · Real-Time Deep Engine
            </span>
          </div>
        </div>

        {/* Input Bar Form */}
        <div className="mt-8 space-y-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-3"
          >
            <div className="relative flex-1">
              <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#D6B46A]" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter domain or URL (e.g., https://mybusiness.com or mywebsite.in)"
                className="w-full pl-12 pr-4 py-3.5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl text-xs sm:text-sm font-mono text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#D6B46A] focus:ring-2 focus:ring-[#D6B46A]/20 transition-all shadow-sm"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 sm:px-8 py-3.5 bg-[#111111] hover:bg-[#D6B46A] text-white hover:text-[#111111] font-display font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 shrink-0 min-h-[46px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Audit Website Now</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Sample URLs */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">Quick Test Samples:</span>
            {sampleUrls.map(item => (
              <button
                key={item.url}
                type="button"
                onClick={() => {
                  setInputUrl(item.url);
                  handleAnalyze(item.url);
                }}
                disabled={loading}
                className="px-2.5 py-1 bg-[#FFFDF8] hover:bg-[#D6B46A]/15 border border-[#D6B46A]/20 rounded-lg text-[10px] font-mono text-[#111111] hover:border-[#D6B46A]/40 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading Scanning State */}
      {loading && (
        <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D6B46A]/10 border border-[#D6B46A]/30 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#D6B46A] animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-black text-lg text-[#111111] tracking-tight">
              Executing Multi-Vector Website Inspection
            </h3>
            <p className="text-xs font-mono text-[#BFA15A] tracking-wider animate-pulse">
              {loadingSteps[loadingStep]}
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="max-w-md mx-auto h-2 bg-[#F4EFE6] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D6B46A] transition-all duration-500 rounded-full"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Audit Report Results View */}
      {report && !loading && (
        <div className="space-y-8 print:space-y-4" id="audit-results-container">
          {/* Top Executive KPI Scoreboard */}
          <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#D6B46A]/15">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#BFA15A]">
                    Audit Completed
                  </span>
                  <span className="text-xs text-[#8A8178]">·</span>
                  <span className="text-xs font-mono text-[#8A8178]">
                    {new Date(report.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {report.statusCode && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold">
                      HTTP {report.statusCode} OK
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111] flex items-center gap-2 break-all">
                  <Globe className="w-5 h-5 shrink-0 text-[#D6B46A]" />
                  <span>{report.hostname}</span>
                  <a 
                    href={report.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#8A8178] hover:text-[#111111] transition-colors inline-block"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>

                <p className="text-xs text-[#8A8178] font-mono break-all">
                  Target URL: {report.finalUrl || report.url}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap print:hidden">
                <button
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 bg-[#FFFDF8] hover:bg-[#F4EFE6] border border-[#D6B46A]/30 text-[#111111] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-[#FFFDF8] hover:bg-[#F4EFE6] border border-[#D6B46A]/30 text-[#111111] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF Report</span>
                </button>
              </div>
            </div>

            {/* Overall Score Badge + Categories */}
            {report.scores && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
                {/* Master Health Grade */}
                <div className="sm:col-span-2 lg:col-span-1 bg-[#111111] text-white p-5 rounded-2xl flex flex-col justify-between items-center text-center shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
                    Overall Health
                  </span>
                  <div className="my-2">
                    <span className="font-display font-black text-5xl tracking-tight text-white">
                      {report.scores.overall}
                    </span>
                    <span className="text-xs font-mono text-[#D6B46A]/80">/100</span>
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono font-bold tracking-wider text-[#FFFDF8]">
                    {getScoreGrade(report.scores.overall).label}
                  </div>
                </div>

                {/* Category 1: Security */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">Security</span>
                    <Lock className="w-4 h-4 text-[#D6B46A]" />
                  </div>
                  <div className="my-2">
                    <span className="font-display font-black text-2xl text-[#111111]">
                      {report.scores.security}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#8A8178]">
                    {report.meta?.isHttps ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> HTTPS Verified
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Insecure HTTP
                      </span>
                    )}
                  </div>
                </div>

                {/* Category 2: SEO */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">SEO &amp; Ranking</span>
                    <FileText className="w-4 h-4 text-[#D6B46A]" />
                  </div>
                  <div className="my-2">
                    <span className="font-display font-black text-2xl text-[#111111]">
                      {report.scores.seo}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                  </div>
                  <div className="text-[10px] text-[#8A8178] truncate">
                    {report.meta?.title ? `${report.meta.title.length} char title` : 'Missing title'}
                  </div>
                </div>

                {/* Category 3: Code & Bugs */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 p-4 rounded-2xl flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8A8178]">Code &amp; Bugs</span>
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

          {/* Deep Code, Multi-Page & Animation Health Suite */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Multi-Page Crawler Subpages */}
            <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#D6B46A]" />
                  <h4 className="font-display font-black text-sm text-[#111111]">Multi-Page Crawler</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#F4EFE6] px-2 py-0.5 rounded-full text-[#8A8178]">
                  {report.internalPages?.length || 1} Pages Scanned
                </span>
              </div>
              <p className="text-xs text-[#8A8178]">
                Discovered internal routes and tested subpage HTTP response integrity:
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {report.internalPages && report.internalPages.length > 0 ? (
                  report.internalPages.map((page, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between p-2 bg-[#F4EFE6]/40 rounded-xl border border-[#D6B46A]/20 text-xs font-mono">
                      <span className="truncate max-w-[150px] font-bold text-[#111111]">{page.path}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${page.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {page.status} {page.ok ? 'OK' : 'ERR'} · {page.responseTimeMs}ms
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#8A8178] italic">Single page scan verified.</div>
                )}
              </div>
            </div>

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
                  <span className="font-mono text-[11px] text-rose-600 font-bold truncate max-w-[140px]">
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
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#BFA15A]">
                  <Key className="w-3.5 h-3.5" />
                  <span>Keyword Intelligence &amp; Gap Detection</span>
                </div>
                <h4 className="font-display font-black text-lg text-[#111111]">
                  Extracted Keywords vs. Missing High-Intent Search Queries
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <span className="text-[10px] text-[#BFA15A]">({kw.count}x · {kw.density}%)</span>
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
              <div className="space-y-1">
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
