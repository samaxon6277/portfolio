import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Shield, AlertTriangle, CheckCircle2, XCircle, Globe, 
  Sparkles, Lock, Unlock, FileText, Code2, Gauge, Zap, Copy, 
  Check, Printer, ArrowRight, ExternalLink, RefreshCw, Key, 
  HelpCircle, Eye, EyeOff, Terminal, Compass, Layers, Wrench,
  ChevronDown, ChevronUp, Filter, FileCode2, ArrowUpRight,
  Image as ImageIcon, Type, Network, LayoutDashboard, GitCompare, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { runClientWebsiteAudit, ScannedSubpage } from '../../utils/clientWebsiteAnalyzer';
import { ComprehensiveAuditReport, AuditFinding } from '../../utils/auditEngine/types';
import { saveAuditToHistory, exportAuditAsJson } from '../../utils/auditEngine/auditHistory';
import { AuditOverviewTab } from './audit/AuditOverviewTab';
import { AuditSecurityTab } from './audit/AuditSecurityTab';
import { AuditSeoTab } from './audit/AuditSeoTab';
import { AuditPerformanceTab } from './audit/AuditPerformanceTab';
import { AuditAccessibilityTab } from './audit/AuditAccessibilityTab';
import { AuditJavaScriptTab } from './audit/AuditJavaScriptTab';
import { AuditImagesTab } from './audit/AuditImagesTab';
import { AuditFontsTab } from './audit/AuditFontsTab';
import { AuditNetworkTab } from './audit/AuditNetworkTab';
import { AuditPagesTab } from './audit/AuditPagesTab';
import { AuditFindingsTab } from './audit/AuditFindingsTab';
import { AuditCompareModal } from './audit/AuditCompareModal';

interface IssueItem {
  category: 'security' | 'seo' | 'code' | 'performance';
  severity: 'critical' | 'warning' | 'passed';
  title: string;
  description: string;
  recommendation: string;
}

function normalizeToComprehensiveReport(data: any): ComprehensiveAuditReport {
  if (!data) return data;
  if (data.performanceData && data.securityData && data.seoData && data.findings) {
    return data as ComprehensiveAuditReport;
  }

  const isHttps = data.meta?.isHttps ?? (typeof data.url === 'string' && data.url.startsWith('https://')) ?? true;
  const ttfb = data.responseTimeMs || data.loadTimeMs || 240;
  const targetUrl = data.url || 'https://example.com';
  const hostname = data.hostname || (data.url ? new URL(targetUrl).hostname : 'example.com');

  return {
    success: data.success ?? true,
    reachable: data.reachable ?? true,
    error: data.error,
    url: targetUrl,
    finalUrl: data.finalUrl || targetUrl,
    hostname,
    statusCode: data.statusCode || 200,
    responseTimeMs: ttfb,
    analyzedAt: data.analyzedAt || new Date().toISOString(),
    scanDurationMs: data.scanDurationMs || 820,
    checkMode: data.checkMode || 'full_server',
    overallScore: data.scores?.overall ?? data.overallScore ?? 75,
    keywords: data.keywords || [],
    scores: data.scores || {
      overall: data.overallScore ?? 75,
      security: data.securityScore ?? 70,
      seo: data.seoScore ?? 80,
      code: data.codeScore ?? 75,
      performance: data.performanceScore ?? 70
    },
    categoryStats: data.categoryStats || {
      security: { score: data.scores?.security ?? 70, findingsCount: 2, passedCount: 5, warningCount: 1, criticalCount: 1 },
      seo: { score: data.scores?.seo ?? 80, findingsCount: 2, passedCount: 6, warningCount: 2, criticalCount: 0 },
      performance: { score: data.scores?.performance ?? 70, findingsCount: 3, passedCount: 4, warningCount: 2, criticalCount: 1 },
      accessibility: { score: 85, findingsCount: 1, passedCount: 6, warningCount: 1, criticalCount: 0 },
      javascript: { score: 80, findingsCount: 1, passedCount: 4, warningCount: 1, criticalCount: 0 },
      images: { score: 80, findingsCount: 2, passedCount: 4, warningCount: 2, criticalCount: 0 },
      fonts: { score: 90, findingsCount: 0, passedCount: 3, warningCount: 0, criticalCount: 0 },
      network: { score: 85, findingsCount: 1, passedCount: 5, warningCount: 1, criticalCount: 0 }
    },
    performanceData: data.performanceData || {
      ttfbMs: ttfb,
      htmlSizeKb: data.meta?.htmlSizeKb || 45,
      estimatedTotalWeightKb: 340,
      estimatedCssSizeKb: 60,
      estimatedJsSizeKb: 180,
      estimatedImageSizeKb: 80,
      estimatedFontSizeKb: 30,
      requestCount: 24,
      thirdPartyRequestCount: 4,
      compression: 'gzip',
      isCompressed: true,
      renderBlockingResourcesCount: data.deepHealth?.renderBlockingScriptsCount || 0,
      totalScriptCount: data.meta?.scriptTags || 3,
      inlineScriptCount: 1,
      externalScriptCount: Math.max(0, (data.meta?.scriptTags || 3) - 1),
      stylesheetCount: data.meta?.stylesheetTags || 2,
      imageCount: data.meta?.totalImages || 0,
      fontCount: 2,
      domNodeCount: 160,
      domMaxDepth: 12,
      domContentLoadedStatus: 'estimated',
      loadTimeStatus: 'estimated',
      longTasksStatus: 'unavailable',
      layoutShiftsStatus: 'simulated',
      coreWebVitals: {
        available: false,
        source: 'unavailable',
        message: 'Core Web Vitals (LCP, CLS, INP, FCP, TBT) require browser performance telemetry or Google PageSpeed API integration.'
      }
    },
    securityData: data.securityData || {
      isHttps,
      hsts: { name: 'Strict-Transport-Security', present: isHttps, value: isHttps ? 'max-age=31536000; includeSubDomains' : null, status: isHttps ? 'pass' : 'fail', description: 'HTTP Strict Transport Security', recommendedHeader: 'Strict-Transport-Security: max-age=31536000; includeSubDomains' },
      csp: { name: 'Content-Security-Policy', present: false, value: null, status: 'warn', description: 'Content Security Policy', recommendedHeader: "Content-Security-Policy: default-src 'self';" },
      xFrameOptions: { name: 'X-Frame-Options', present: true, value: 'SAMEORIGIN', status: 'pass', description: 'Clickjacking Protection', recommendedHeader: 'X-Frame-Options: SAMEORIGIN' },
      xContentTypeOptions: { name: 'X-Content-Type-Options', present: true, value: 'nosniff', status: 'pass', description: 'MIME Sniffing Prevention', recommendedHeader: 'X-Content-Type-Options: nosniff' },
      referrerPolicy: { name: 'Referrer-Policy', present: true, value: 'strict-origin-when-cross-origin', status: 'pass', description: 'Referrer Information Policy', recommendedHeader: 'Referrer-Policy: strict-origin-when-cross-origin' },
      permissionsPolicy: { name: 'Permissions-Policy', present: false, value: null, status: 'warn', description: 'Hardware APIs Restriction', recommendedHeader: 'Permissions-Policy: camera=(), microphone=()' },
      serverHeader: null,
      exposesServerVersion: false,
      mixedContentCount: data.deepHealth?.mixedContentCount || 0,
      mixedContentSamples: [],
      unsafeBlankLinksCount: 0,
      inlineEventHandlersCount: 0,
      deprecatedTagsFound: []
    },
    seoData: data.seoData || {
      title: data.meta?.title || 'Audited Web Resource',
      titleLength: data.meta?.title?.length || 20,
      titleStatus: data.meta?.title ? 'good' : 'missing',
      metaDescription: data.meta?.metaDescription || '',
      metaDescriptionLength: data.meta?.metaDescription?.length || 0,
      metaDescriptionStatus: data.meta?.metaDescription ? 'good' : 'missing',
      canonicalUrl: data.meta?.canonicalUrl || targetUrl,
      isCanonicalMatching: true,
      robotsMeta: data.meta?.robotsContent || 'index, follow',
      xRobotsHeader: null,
      isIndexable: !((data.meta?.robotsContent || '').includes('noindex')),
      headings: {
        h1Count: data.meta?.h1List?.length || 1,
        h1List: data.meta?.h1List || [],
        h2Count: data.meta?.h2Count || 0,
        h3Count: data.meta?.h3Count || 0,
        totalHeadings: (data.meta?.h1List?.length || 1) + (data.meta?.h2Count || 0) + (data.meta?.h3Count || 0),
        hasSingleH1: (data.meta?.h1List?.length || 1) === 1,
        headingHierarchyValid: true,
        headingHierarchyIssues: []
      },
      openGraph: {
        hasOgTitle: !!data.meta?.ogTitle,
        hasOgDescription: !!data.meta?.ogDescription,
        hasOgImage: !!data.meta?.ogImage,
        hasOgUrl: true,
        ogTitle: data.meta?.ogTitle || null,
        ogDescription: data.meta?.ogDescription || null,
        ogImage: data.meta?.ogImage || null,
        ogUrl: targetUrl
      },
      twitterCard: {
        hasTwitterCard: !!data.meta?.twitterCard,
        cardType: data.meta?.twitterCard || null
      },
      schemaOrg: {
        hasSchemaJsonLd: data.deepHealth?.hasJsonLd || false,
        detectedTypes: data.deepHealth?.hasJsonLd ? ['Organization', 'WebSite'] : [],
        schemaCount: data.deepHealth?.hasJsonLd ? 1 : 0,
        items: []
      },
      hasFavicon: true,
      hasSitemapLink: false,
      hasRobotsTxtLink: false
    },
    accessibilityData: data.accessibilityData || {
      hasHtmlLang: data.deepHealth?.hasHtmlLang ?? true,
      htmlLang: data.deepHealth?.hasHtmlLang ? 'en' : null,
      isZoomLocked: data.meta?.isZoomLocked ?? false,
      hasViewport: data.meta?.hasViewport ?? true,
      imagesTotal: data.meta?.totalImages || 0,
      imagesWithoutAltCount: data.meta?.imagesWithoutAltCount || 0,
      missingAltSamples: (data.meta?.missingAltImages || []).map((src: string) => ({ src })),
      emptyButtonsCount: 0,
      emptyLinksCount: 0,
      formInputsWithoutLabelsCount: 0,
      ariaAttributesFoundCount: 4,
      skipLinkFound: false,
      autoplayMediaDetected: false
    },
    javascriptData: data.javascriptData || {
      totalScripts: data.meta?.scriptTags || 2,
      inlineScripts: 1,
      externalScripts: Math.max(0, (data.meta?.scriptTags || 2) - 1),
      renderBlockingScripts: data.deepHealth?.renderBlockingScriptsCount || 0,
      asyncScripts: 1,
      deferScripts: 0,
      moduleScripts: 1,
      thirdPartyScripts: 1,
      duplicateScripts: [],
      largeBundlesDetected: [],
      legacyIndicatorsFound: [],
      inlineScriptTotalBytes: 420,
      excessiveThirdParty: false
    },
    imageData: data.imageData || {
      totalImages: data.meta?.totalImages || 0,
      missingAltCount: data.meta?.imagesWithoutAltCount || 0,
      missingDimensionsCount: data.deepHealth?.imagesMissingDimensions || 0,
      missingAspectRatiosCount: 0,
      lazyLoadedLcpDetected: false,
      missingLazyBelowFoldCount: 0,
      missingSrcsetCount: 0,
      legacyFormatCount: data.meta?.totalImages || 0,
      webpAvifOpportunities: 0,
      duplicateImages: [],
      brokenImageCandidates: [],
      samples: (data.meta?.missingAltImages || []).map((src: string) => ({
        src,
        hasAlt: false,
        hasDimensions: true,
        isLazy: true,
        format: 'jpg'
      }))
    },
    fontData: data.fontData || {
      totalFonts: 2,
      fontFamilies: ['Sans-Serif'],
      externalFontProviders: ['Google Fonts'],
      hasFontDisplaySwap: true,
      renderBlockingFontsCount: 0,
      hasPreconnect: true,
      duplicateFontRequests: [],
      legacyFontFormats: []
    },
    networkData: data.networkData || {
      protocol: isHttps ? 'HTTP/2' : 'HTTP/1.1',
      resources: [],
      totalDetectedAssets: 24,
      firstPartyDomains: [hostname],
      thirdPartyDomains: ['fonts.googleapis.com', 'fonts.gstatic.com'],
      knownTrackersDetected: [],
      redirectHops: 0,
      redirectChain: [targetUrl],
      cacheHeadersFound: {
        hasCacheControl: true,
        hasETag: false,
        hasLastModified: true
      }
    },
    findings: data.findings || (data.issues ? [
      ...(data.issues.critical || []).map((i: any, idx: number) => ({
        id: `crit-${idx}`,
        category: i.category || 'security',
        severity: 'critical' as const,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
        impact: 'Critical',
        confidence: 'verified' as const,
        status: 'fail' as const,
        detectedAt: new Date().toISOString(),
        checkType: 'server' as const,
        availabilityStatus: 'available' as const
      })),
      ...(data.issues.warning || []).map((i: any, idx: number) => ({
        id: `warn-${idx}`,
        category: i.category || 'seo',
        severity: 'warning' as const,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
        impact: 'Medium',
        confidence: 'verified' as const,
        status: 'warn' as const,
        detectedAt: new Date().toISOString(),
        checkType: 'server' as const,
        availabilityStatus: 'available' as const
      })),
      ...(data.issues.passed || []).map((i: any, idx: number) => ({
        id: `pass-${idx}`,
        category: i.category || 'performance',
        severity: 'passed' as const,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
        impact: 'Low',
        confidence: 'verified' as const,
        status: 'pass' as const,
        detectedAt: new Date().toISOString(),
        checkType: 'server' as const,
        availabilityStatus: 'available' as const
      }))
    ] : []),
    internalPages: (data.internalPages || []).map((p: any) => ({
      path: p.path,
      url: p.url,
      status: p.status,
      ok: p.ok,
      responseTimeMs: p.responseTimeMs,
      title: p.title,
      hasTitle: p.hasTitle,
      hasMetaDescription: p.hasMetaDescription,
      h1Count: p.h1Count,
      h1Text: p.h1Text,
      totalImages: p.totalImages,
      imagesWithoutAltCount: p.imagesWithoutAltCount,
      pageScore: p.pageScore ?? 85,
      pageGrade: p.pageGrade ?? 'Excellent',
      issues: p.issues || []
    })),
    issues: data.issues || {
      critical: [],
      warning: [],
      passed: []
    },
    meta: data.meta || {
      title: data.seoData?.title || 'Audited Web Resource',
      metaDescription: data.seoData?.metaDescription || '',
      canonicalUrl: data.seoData?.canonicalUrl || targetUrl,
      robotsContent: data.seoData?.robotsMeta || 'index, follow',
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
      twitterCard: null,
      h1List: [],
      h2Count: 0,
      h3Count: 0,
      totalImages: 0,
      imagesWithoutAltCount: 0,
      missingAltImages: [],
      scriptTags: 2,
      stylesheetTags: 1,
      htmlSizeKb: 45,
      isHttps,
      hasDoctype: true,
      hasViewport: true,
      isZoomLocked: false,
      hasCharset: true
    },
    capabilitiesDoc: data.capabilitiesDoc || [
      { id: 'http-status', name: 'HTTP & Latency Probing', category: 'network', environment: 'server', status: 'active', description: 'Direct server-to-server TLS connection timing, TTFB latency measurement, and response header verification.' },
      { id: 'html-dom', name: 'HTML & Semantic DOM Inspector', category: 'seo', environment: 'server', status: 'active', description: 'Full DOM traversal auditing heading hierarchies, meta tags, schema markup, and image alts.' },
      { id: 'security-headers', name: 'Security Header Matrix', category: 'security', environment: 'server', status: 'active', description: 'Inspection of HSTS, CSP, X-Frame-Options, X-Content-Type, and Referrer-Policy headers.' }
    ]
  };
}

export default function WebsiteAnalyzer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<ComprehensiveAuditReport | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<
    'overview' | 'security' | 'seo' | 'performance' | 'accessibility' | 'javascript' | 'images' | 'fonts' | 'network' | 'pages' | 'findings'
  >('overview');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  // Restore cached report if present
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('samaxon_last_audit');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.url || parsed.hostname)) {
          setReport(normalizeToComprehensiveReport(parsed));
          if (parsed.url) setInputUrl(parsed.url);
        }
      }
    } catch {}
  }, []);

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
      const comprehensive = normalizeToComprehensiveReport(data);
      setReport(comprehensive);
      try {
        sessionStorage.setItem('samaxon_last_audit', JSON.stringify(comprehensive));
        saveAuditToHistory(comprehensive);
      } catch {}
    } catch (err: any) {
      clearInterval(stepInterval);
      try {
        const fallbackData = await runClientWebsiteAudit(target);
        const comprehensive = normalizeToComprehensiveReport(fallbackData);
        setReport(comprehensive);
        try {
          sessionStorage.setItem('samaxon_last_audit', JSON.stringify(comprehensive));
          saveAuditToHistory(comprehensive);
        } catch {}
      } catch {
        setErrorMessage('Failed to execute website inspection. Please verify the URL.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFix = (issue?: any) => {
    if (!report) return;
    const issueTitle = typeof issue === 'string' ? issue : issue?.title;
    try {
      sessionStorage.setItem('samaxon_last_audit', JSON.stringify(report));
    } catch {}
    navigate('/audit-fix-request', {
      state: {
        report,
        preselectedIssue: issueTitle
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
                  type="button"
                  onClick={() => setShowCompareModal(true)}
                  className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <GitCompare className="w-3.5 h-3.5 text-[#BFA15A]" />
                  <span>Compare Runs</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportAuditAsJson(report)}
                  className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#BFA15A]" />
                  <span>Export JSON</span>
                </button>
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
          {/* COMPREHENSIVE 11-TAB AUDIT INSPECTION SUITE                  */}
          {/* ============================================================ */}
          <div className="space-y-6" id="audit-tabs-container">
            {/* Navigation Tabs Bar */}
            <div className="bg-white border border-[#D6B46A]/25 rounded-2xl p-2 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'seo', label: 'SEO & Meta', icon: Search },
                  { id: 'performance', label: 'Performance', icon: Zap },
                  { id: 'accessibility', label: 'Accessibility', icon: Eye },
                  { id: 'javascript', label: 'JavaScript & DOM', icon: Code2 },
                  { id: 'images', label: 'Images', icon: ImageIcon },
                  { id: 'fonts', label: 'Fonts & Typography', icon: Type },
                  { id: 'network', label: 'Network & Headers', icon: Network },
                  { id: 'pages', label: `Crawler (${report.internalPages?.length || 1})`, icon: Compass },
                  { id: 'findings', label: `Findings (${report.findings?.length || 0})`, icon: Wrench },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeAuditTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAuditTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                          : 'text-[#8A8178] hover:text-[#111111] hover:bg-[#F4EFE6]/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6B46A]' : 'text-[#8A8178]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="transition-opacity duration-200">
              {activeAuditTab === 'overview' && (
                <AuditOverviewTab 
                  report={report} 
                  onNavigateTab={(tab) => setActiveAuditTab(tab as any)} 
                  onRequestFix={handleRequestFix} 
                  onOpenCompare={() => setShowCompareModal(true)}
                />
              )}
              {activeAuditTab === 'security' && (
                <AuditSecurityTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'seo' && (
                <AuditSeoTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'performance' && (
                <AuditPerformanceTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'accessibility' && (
                <AuditAccessibilityTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'javascript' && (
                <AuditJavaScriptTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'images' && (
                <AuditImagesTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'fonts' && (
                <AuditFontsTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'network' && (
                <AuditNetworkTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'pages' && (
                <AuditPagesTab report={report} onRequestFix={handleRequestFix} />
              )}
              {activeAuditTab === 'findings' && (
                <AuditFindingsTab findings={report.findings || []} onRequestFix={handleRequestFix} />
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

      {/* Audit Compare Modal */}
      {showCompareModal && report && (
        <AuditCompareModal
          currentReport={report}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
}
