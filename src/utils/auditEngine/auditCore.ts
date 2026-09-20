/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - Professional Website Health, Security & Performance Audit Engine
 * Core Server/Hybrid Analysis Implementation
 */

import {
  ComprehensiveAuditReport,
  AuditFinding,
  AuditCategory,
  ResourceItem,
  HeadingItem,
  SchemaJsonLdItem,
  SecurityHeaderStatus,
  ScannedSubpageHealth,
  CoreWebVitalsData,
  ExecutionCapability,
  DevicePerformanceData
} from './types';
import { validateAndNormalizeUrl, isPrivateOrLocalHost } from './urlValidator';
import { fetchBrowserPerformance } from './browserPerformance';
import { analyzeRobotsAndSitemaps, crawlDiscoveredInternalPages } from './sitemapCrawler';
import { analyzeAeoAndGeo } from './aeoGeoEngine';

// Common known trackers & third-party analytics
const KNOWN_TRACKERS: { pattern: RegExp; name: string }[] = [
  { pattern: /googletagmanager\.com/i, name: 'Google Tag Manager' },
  { pattern: /google-analytics\.com|analytics\.google\.com/i, name: 'Google Analytics' },
  { pattern: /connect\.facebook\.net|facebook\.com\/tr/i, name: 'Meta Pixel' },
  { pattern: /hotjar\.com/i, name: 'Hotjar' },
  { pattern: /clarity\.ms/i, name: 'Microsoft Clarity' },
  { pattern: /tiktok\.com\/i18n\/pixel/i, name: 'TikTok Pixel' },
  { pattern: /segment\.(com|io)/i, name: 'Segment' },
  { pattern: /intercom\.io/i, name: 'Intercom' },
  { pattern: /sentry\.io/i, name: 'Sentry' },
  { pattern: /cdn\.jsdelivr\.net/i, name: 'jsDelivr CDN' },
  { pattern: /cdnjs\.cloudflare\.com/i, name: 'Cloudflare CDN' },
  { pattern: /unpkg\.com/i, name: 'unpkg CDN' },
  { pattern: /stripe\.com/i, name: 'Stripe JS' }
];

export function buildUnreachableReport(
  targetUrl: string,
  hostname: string,
  errorMsg: string,
  responseTimeMs: number,
  scanStartTime: number
): ComprehensiveAuditReport {
  const isHttps = targetUrl.startsWith('https://');
  const duration = Date.now() - scanStartTime;
  const analyzedAt = new Date().toISOString();

  const unreachableFindings: AuditFinding[] = [
    {
      id: 'net-origin-unreachable',
      category: 'network',
      severity: 'critical',
      title: 'Target Server Unreachable / Connection Failed',
      description: `Diagnostic connection to ${hostname} failed: ${errorMsg}. Server did not respond to standard HTTP/HTTPS request within timeout limit.`,
      recommendation: 'Verify domain DNS A/AAAA records, check if port 80/443 is open, and ensure origin web server or CDN (Cloudflare, Fastly) is not blocking automated diagnostic scanners.',
      evidence: errorMsg,
      impact: 'Critical',
      confidence: 'verified',
      status: 'fail',
      detectedAt: analyzedAt,
      checkType: 'server',
      availabilityStatus: 'available'
    },
    {
      id: 'perf-ttfb-timeout',
      category: 'performance',
      severity: 'critical',
      title: 'Time to First Byte (TTFB) Exceeded Timeout',
      description: `Initial handshake and response did not complete within the allocation window (${responseTimeMs}ms elapsed).`,
      recommendation: 'Investigate hosting provider uptime, web server process status (nginx, Apache, Node.js), and upstream reverse proxy configurations.',
      evidence: `Latency: ${responseTimeMs}ms`,
      impact: 'Critical',
      confidence: 'verified',
      status: 'fail',
      detectedAt: analyzedAt,
      checkType: 'server',
      availabilityStatus: 'available'
    }
  ];

  const emptyVitals: CoreWebVitalsData = {
    available: false,
    source: 'unconfigured',
    message: 'Core Web Vitals metrics require real user traffic or PageSpeed Insights API credentials.',
    fcp: { value: 0, unit: 's', rating: 'poor' },
    lcp: { value: 0, unit: 's', rating: 'poor' },
    cls: { value: 0, unit: '', rating: 'good' },
    inp: { value: 0, unit: 'ms', rating: 'poor' },
    tbt: { value: 0, unit: 'ms', rating: 'poor' },
    speedIndex: { value: 0, unit: 's', rating: 'poor' }
  };

  const emptyCategories: Record<AuditCategory, { score: number; critical: number; warning: number; passed: number; notAvailable: number }> = {
    performance: { score: 10, critical: 1, warning: 0, passed: 0, notAvailable: 0 },
    javascript: { score: 25, critical: 0, warning: 0, passed: 0, notAvailable: 1 },
    images: { score: 25, critical: 0, warning: 0, passed: 0, notAvailable: 1 },
    fonts: { score: 25, critical: 0, warning: 0, passed: 0, notAvailable: 1 },
    network: { score: 10, critical: 1, warning: 0, passed: 0, notAvailable: 0 },
    seo: { score: 20, critical: 0, warning: 0, passed: 0, notAvailable: 1 },
    accessibility: { score: 25, critical: 0, warning: 0, passed: 0, notAvailable: 1 },
    security: { score: isHttps ? 50 : 20, critical: 0, warning: 1, passed: isHttps ? 1 : 0, notAvailable: 0 },
    code: { score: 25, critical: 0, warning: 0, passed: 0, notAvailable: 1 }
  };

  const capabilitiesDoc: ExecutionCapability[] = [
    {
      id: 'cap-server-offline',
      name: 'Server-Side HTTP Connectivity',
      category: 'Network',
      environment: 'server',
      status: 'available',
      description: 'Target server offline or connection timed out.',
      technicalDetails: 'Target server is currently offline or blocking incoming connections. Deeper DOM analysis was bypassed.'
    }
  ];

  return {
    success: true,
    reachable: false,
    error: errorMsg,
    url: targetUrl,
    finalUrl: targetUrl,
    hostname,
    statusCode: 0,
    responseTimeMs,
    analyzedAt,
    scanDurationMs: duration,
    checkMode: 'full_server',
    scores: {
      overall: 20,
      performance: 10,
      security: isHttps ? 40 : 20,
      seo: 20,
      accessibility: 25,
      code: 25
    },
    categoryStats: emptyCategories,
    performanceData: {
      ttfbMs: responseTimeMs,
      htmlSizeKb: 0,
      estimatedTotalWeightKb: 0,
      estimatedCssSizeKb: 0,
      estimatedJsSizeKb: 0,
      estimatedImageSizeKb: 0,
      estimatedFontSizeKb: 0,
      requestCount: 0,
      thirdPartyRequestCount: 0,
      compression: null,
      isCompressed: false,
      renderBlockingResourcesCount: 0,
      totalScriptCount: 0,
      inlineScriptCount: 0,
      externalScriptCount: 0,
      stylesheetCount: 0,
      imageCount: 0,
      fontCount: 0,
      domNodeCount: 0,
      domMaxDepth: 0,
      domContentLoadedStatus: 'Failed (Server Unreachable)',
      loadTimeStatus: 'Timeout',
      longTasksStatus: 'Not Available (Headless browser not active)',
      layoutShiftsStatus: 'Not Available (Headless browser not active)',
      coreWebVitals: emptyVitals
    },
    javascriptData: {
      totalScripts: 0,
      externalScripts: 0,
      inlineScripts: 0,
      renderBlockingScripts: 0,
      asyncScripts: 0,
      deferScripts: 0,
      moduleScripts: 0,
      thirdPartyScripts: 0,
      duplicateScripts: [],
      largeBundlesDetected: [],
      legacyIndicatorsFound: [],
      inlineScriptTotalBytes: 0,
      excessiveThirdParty: false
    },
    imageData: {
      totalImages: 0,
      missingAltCount: 0,
      missingDimensionsCount: 0,
      missingAspectRatiosCount: 0,
      lazyLoadedLcpDetected: false,
      missingLazyBelowFoldCount: 0,
      missingSrcsetCount: 0,
      legacyFormatCount: 0,
      webpAvifOpportunities: 0,
      duplicateImages: [],
      brokenImageCandidates: [],
      samples: []
    },
    fontData: {
      totalFonts: 0,
      fontFamilies: [],
      externalFontProviders: [],
      hasFontDisplaySwap: false,
      renderBlockingFontsCount: 0,
      hasPreconnect: false,
      duplicateFontRequests: [],
      legacyFontFormats: []
    },
    networkData: {
      resources: [],
      firstPartyDomains: [hostname],
      thirdPartyDomains: [],
      totalDetectedAssets: 0,
      knownTrackersDetected: [],
      redirectHops: 0,
      redirectChain: [],
      cacheHeadersFound: {
        hasCacheControl: false,
        cacheControlValue: null,
        hasEtag: false,
        hasExpires: false
      },
      contentEncoding: null,
      failedResources: [targetUrl],
      slowResources: [],
      duplicateResources: []
    },
    capabilitiesDoc,
    seoData: {
      title: `${hostname} (Unreachable)`,
      titleLength: 0,
      metaDescription: '',
      metaDescriptionLength: 0,
      canonicalUrl: null,
      isCanonicalMatching: false,
      robotsMeta: null,
      xRobotsHeader: null,
      robotsTxtStatus: { checked: false, exists: false, status: 0, allowsCrawl: false, sitemapUrlsFound: [] },
      sitemapStatus: { checked: false, exists: false, status: 0, urlCountEstimate: 0 },
      headings: { h1List: [], h2Count: 0, h3Count: 0, totalHeadings: 0, isHierarchyValid: false, hierarchyIssues: [] },
      openGraph: { hasOgTitle: false, ogTitle: null, hasOgDescription: false, ogDescription: null, hasOgImage: false, ogImage: null, twitterCard: null },
      schemaJsonLd: { count: 0, items: [], detectedTypes: [] },
      langAttribute: null
    },
    accessibilityData: {
      hasHtmlLang: false,
      htmlLang: null,
      hasViewport: false,
      isZoomLocked: false,
      imagesTotal: 0,
      imagesWithoutAltCount: 0,
      missingAltSamples: [],
      emptyButtonsCount: 0,
      emptyButtonSamples: [],
      emptyLinksCount: 0,
      emptyLinkSamples: [],
      formInputsWithoutLabelCount: 0,
      hasMainLandmark: false,
      hasNavLandmark: false,
      hasHeaderLandmark: false,
      hasFooterLandmark: false,
      hasSkipLink: false,
      hasReducedMotionQuery: false
    },
    securityData: {
      isHttps,
      hsts: { name: 'Strict-Transport-Security', present: false, value: null, status: 'fail', description: 'Forces modern browsers to connect only via HTTPS.', recommendedHeader: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' },
      csp: { name: 'Content-Security-Policy', present: false, value: null, status: 'fail', description: 'Restricts resource loading origins.', recommendedHeader: "Content-Security-Policy: default-src 'self';" },
      xFrameOptions: { name: 'X-Frame-Options', present: false, value: null, status: 'warn', description: 'Prevents clickjacking.', recommendedHeader: 'X-Frame-Options: SAMEORIGIN' },
      xContentTypeOptions: { name: 'X-Content-Type-Options', present: false, value: null, status: 'warn', description: 'Disables MIME type sniffing.', recommendedHeader: 'X-Content-Type-Options: nosniff' },
      referrerPolicy: { name: 'Referrer-Policy', present: false, value: null, status: 'warn', description: 'Controls referrer data.', recommendedHeader: 'Referrer-Policy: strict-origin-when-cross-origin' },
      permissionsPolicy: { name: 'Permissions-Policy', present: false, value: null, status: 'warn', description: 'Restricts hardware APIs.', recommendedHeader: 'Permissions-Policy: camera=(), microphone=()' },
      serverHeader: null,
      exposesServerVersion: false,
      mixedContentCount: 0,
      mixedContentSamples: [],
      unsafeBlankLinksCount: 0,
      inlineEventHandlersCount: 0,
      deprecatedTagsFound: []
    },
    internalPages: [
      {
        path: '/',
        url: targetUrl,
        status: 0,
        ok: false,
        responseTimeMs,
        title: `${hostname} - Server Unreachable`,
        hasTitle: false,
        hasMetaDescription: false,
        h1Count: 0,
        h1Text: '',
        totalImages: 0,
        imagesWithoutAltCount: 0,
        pageScore: 20,
        pageGrade: 'Critical',
        issues: [
          { severity: 'critical', title: 'Origin Connection Failed', description: errorMsg }
        ]
      }
    ],
    keywords: {
      topKeywords: [],
      missingKeywords: [
        '24/7 Client Booking / Direct Contact',
        'High-Converting Landing Page Architecture',
        'Fast 48-Hour Delivery Guarantee',
        'Enterprise SSL & Security Certification',
        'Google Core Web Vitals Optimization'
      ]
    },
    findings: unreachableFindings,
    issues: {
      critical: unreachableFindings.filter(f => f.severity === 'critical').map(f => ({
        category: f.category as any,
        severity: 'critical' as const,
        title: f.title,
        description: f.description,
        recommendation: f.recommendation
      })),
      warning: [],
      passed: []
    },
    meta: {
      title: `${hostname} (Unreachable)`,
      metaDescription: 'Target server is unreachable or timed out.',
      canonicalUrl: targetUrl,
      robotsContent: 'noindex, nofollow',
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
      scriptTags: 0,
      stylesheetTags: 0,
      htmlSizeKb: 0,
      isHttps,
      hasDoctype: false,
      hasViewport: false,
      isZoomLocked: false,
      hasCharset: false
    },
    animationAnalysis: {
      keyframeMatches: 0,
      transitionAllCount: 0,
      nonCompositedFound: [],
      hasReducedMotion: false,
      animationJankRisk: 'Low',
      detectedAnimationLibraries: []
    },
    deepHealth: {
      mixedContentCount: 0,
      renderBlockingScriptsCount: 0,
      hasJsonLd: false,
      hasHtmlLang: false,
      imagesMissingDimensions: 0
    }
  };
}

export async function executeWebsiteAudit(rawUrl: string): Promise<ComprehensiveAuditReport> {
  const scanStartTime = Date.now();
  const pageSpeedApiKey = typeof process !== 'undefined' ? process.env?.PAGESPEED_API_KEY : undefined;

  // 1. URL Validation & SSRF Guard
  const validation = validateAndNormalizeUrl(rawUrl);
  if (!validation.isValid || !validation.normalizedUrl || !validation.parsedUrl || !validation.hostname) {
    throw new Error(validation.error || 'Invalid URL provided.');
  }

  const targetUrl = validation.normalizedUrl;
  const initialHostname = validation.hostname;

  // Browser headers matching modern desktop Chrome
  const browserHeaders: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 (SamaXon-SiteAudit-Engine/2.5; +https://samaxon.site)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'no-cache'
  };

  // 2. Fetch the target document with strict timeout, redirect tracking and size limits
  const ttfbStart = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let response: Response;
  let finalUrl = targetUrl;
  let responseTimeMs = 0;
  let rawHtml = '';

  try {
    let currentUrl = targetUrl;
    let redirectHops = 0;
    const maxRedirectHops = 5;

    while (true) {
      response = await fetch(currentUrl, {
        method: 'GET',
        headers: browserHeaders,
        redirect: 'manual',
        signal: controller.signal
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const redirectLocation = response.headers.get('location');
        if (!redirectLocation) {
          finalUrl = currentUrl;
          break;
        }

        redirectHops++;
        if (redirectHops > maxRedirectHops) {
          throw new Error('Too many redirects (exceeded maximum of 5 hops).');
        }

        const resolvedRedirect = new URL(redirectLocation, currentUrl);
        const redirectCheck = validateAndNormalizeUrl(resolvedRedirect.toString());
        if (!redirectCheck.isValid || !redirectCheck.normalizedUrl || !redirectCheck.hostname) {
          throw new Error(`Redirect target blocked by security policy: ${redirectCheck.error || 'Prohibited address'}`);
        }
        if (isPrivateOrLocalHost(redirectCheck.hostname)) {
          throw new Error(`Security restriction: Redirect to private/loopback address (${redirectCheck.hostname}) is blocked.`);
        }
        currentUrl = redirectCheck.normalizedUrl;
      } else {
        finalUrl = currentUrl;
        break;
      }
    }

    responseTimeMs = Date.now() - ttfbStart;
    clearTimeout(timeoutId);

    // Read response stream up to 5MB max
    const text = await response.text();
    rawHtml = text.slice(0, 5 * 1024 * 1024);
  } catch (err: any) {
    clearTimeout(timeoutId);
    const msg = err?.name === 'AbortError' 
      ? 'Target server timed out after 12 seconds.'
      : (err?.message || 'Failed to connect to host.');
    return buildUnreachableReport(targetUrl, initialHostname, msg, Date.now() - ttfbStart, scanStartTime);
  }

  const statusCode = response.status;
  const headers = response.headers;
  const isHttps = finalUrl.startsWith('https://');

  // Response Header Extraction
  const hstsHeader = headers.get('strict-transport-security');
  const cspHeader = headers.get('content-security-policy');
  const xFrameHeader = headers.get('x-frame-options');
  const xContentTypeHeader = headers.get('x-content-type-options');
  const referrerPolicyHeader = headers.get('referrer-policy');
  const permissionsPolicyHeader = headers.get('permissions-policy');
  const serverHeader = headers.get('server');
  const compressionHeader = headers.get('content-encoding');
  const cacheControlHeader = headers.get('cache-control');
  const xRobotsHeader = headers.get('x-robots-tag');

  const htmlSizeKb = Math.round((new TextEncoder().encode(rawHtml).length / 1024) * 10) / 10;

  // 3. Document Structure Extraction
  const hasDoctype = /<!doctype\s+html/i.test(rawHtml);
  const hasCharset = /<meta[^>]+charset=["']?[a-zA-Z0-9\-_]+["']?/i.test(rawHtml);

  // Viewport
  const viewportMatch = rawHtml.match(/<meta[^>]+name=["']viewport["'][^>]*>/i);
  const hasViewport = !!viewportMatch;
  const isZoomLocked = viewportMatch ? (
    /user-scalable\s*=\s*no/i.test(viewportMatch[0]) || 
    /maximum-scale\s*=\s*1(\.0)?/i.test(viewportMatch[0])
  ) : false;

  // Title
  const titleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';

  // Meta description
  const descMatch = rawHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                    rawHtml.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const metaDescription = descMatch ? descMatch[1].trim() : '';

  // Canonical
  const canonicalMatch = rawHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;
  const isCanonicalMatching = !!canonicalUrl && (canonicalUrl === finalUrl || canonicalUrl === targetUrl);

  // Robots meta
  const robotsMatch = rawHtml.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const robotsMeta = robotsMatch ? robotsMatch[1].trim() : null;

  // Open Graph & Social
  const ogTitleMatch = rawHtml.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogDescMatch = rawHtml.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  const ogImageMatch = rawHtml.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const twitterCardMatch = rawHtml.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);

  // HTML lang
  const langMatch = rawHtml.match(/<html\b[^>]*\blang=["']?([a-zA-Z0-9\-_]+)["']?/i);
  const htmlLang = langMatch ? langMatch[1].trim() : null;

  // Headings
  const headingRegex = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const headingsFound: HeadingItem[] = [];
  let hMatch: RegExpExecArray | null;
  while ((hMatch = headingRegex.exec(rawHtml)) !== null) {
    const level = parseInt(hMatch[1].charAt(1), 10);
    const cleanText = hMatch[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (cleanText) {
      headingsFound.push({ level, text: cleanText, length: cleanText.length });
    }
  }

  const h1List = headingsFound.filter(h => h.level === 1).map(h => h.text);
  const h2Count = headingsFound.filter(h => h.level === 2).length;
  const h3Count = headingsFound.filter(h => h.level === 3).length;

  // Check heading sequence jumps (e.g. h1 -> h3 without h2)
  const hierarchyIssues: string[] = [];
  for (let i = 0; i < headingsFound.length - 1; i++) {
    const current = headingsFound[i].level;
    const next = headingsFound[i + 1].level;
    if (next > current + 1) {
      hierarchyIssues.push(`Skipped heading level from <h${current}> to <h${next}> ("${headingsFound[i + 1].text.slice(0, 30)}...")`);
    }
  }
  const isHierarchyValid = hierarchyIssues.length === 0;

  // Schema.org JSON-LD extraction
  const jsonLdMatches = rawHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const schemaItems: SchemaJsonLdItem[] = [];
  const detectedSchemaTypes = new Set<string>();

  for (const m of jsonLdMatches) {
    const rawContent = m[1].trim();
    if (!rawContent) continue;
    try {
      const parsed = JSON.parse(rawContent);
      const entityType = parsed['@type'] || (Array.isArray(parsed) ? parsed[0]?.['@type'] : undefined);
      const entityName = parsed['name'] || (Array.isArray(parsed) ? parsed[0]?.['name'] : undefined);
      if (entityType) {
        if (Array.isArray(entityType)) {
          entityType.forEach(t => detectedSchemaTypes.add(String(t)));
        } else {
          detectedSchemaTypes.add(String(entityType));
        }
      }
      schemaItems.push({
        raw: rawContent.slice(0, 1000),
        type: typeof entityType === 'string' ? entityType : Array.isArray(entityType) ? entityType.join(', ') : undefined,
        name: typeof entityName === 'string' ? entityName : undefined,
        isValidJson: true
      });
    } catch (parseErr: any) {
      schemaItems.push({
        raw: rawContent.slice(0, 500),
        isValidJson: false,
        parseError: parseErr?.message || 'Invalid JSON syntax in ld+json block.'
      });
    }
  }

  // 4. Scripts & Styles Extraction
  const headBlockMatch = rawHtml.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headBlockMatch ? headBlockMatch[1] : '';

  const allScripts = rawHtml.match(/<script\b[^>]*>([\s\S]*?)<\/script>|<script\b[^>]*\/>|<script\b[^>]*>/gi) || [];
  let inlineScriptCount = 0;
  let externalScriptCount = 0;
  let renderBlockingScriptsCount = 0;
  let asyncScriptsCount = 0;
  let deferScriptsCount = 0;
  let moduleScriptsCount = 0;
  let inlineScriptTotalBytes = 0;
  const scriptUrlsSeen: string[] = [];
  const duplicateScripts: string[] = [];
  const largeBundlesDetected: string[] = [];
  const legacyIndicatorsFound: string[] = [];

  const detectedResources: ResourceItem[] = [];
  const knownTrackersFound = new Set<string>();
  const firstPartyDomains = new Set<string>([initialHostname]);
  const thirdPartyDomains = new Set<string>();

  // Check HTML-level legacy script patterns
  if (/\bdocument\.write\s*\(/i.test(rawHtml)) {
    legacyIndicatorsFound.push('document.write() injection pattern detected');
  }
  if (/<script\b[^>]*\blanguage=["']?javascript["']?/i.test(rawHtml)) {
    legacyIndicatorsFound.push('Deprecated language="javascript" attribute');
  }
  if (/<script\b[^>]*\btype=["']text\/javascript["']/i.test(rawHtml)) {
    legacyIndicatorsFound.push('Redundant type="text/javascript" in HTML5');
  }
  if (/<script\b[^>]*>[\s\S]*?<!--/i.test(rawHtml)) {
    legacyIndicatorsFound.push('Legacy HTML comment wrapping inside <script>');
  }
  if (/ActiveXObject|vbscript/i.test(rawHtml)) {
    legacyIndicatorsFound.push('Legacy ActiveXObject / VBScript references');
  }

  for (const s of allScripts) {
    const srcMatch = s.match(/\bsrc=["']([^"']+)["']/i);
    const isAsync = /\basync\b/i.test(s);
    const isDefer = /\bdefer\b/i.test(s);
    const isModule = /\btype=["']module["']/i.test(s);

    if (isAsync) asyncScriptsCount++;
    if (isDefer) deferScriptsCount++;
    if (isModule) moduleScriptsCount++;

    if (srcMatch && srcMatch[1]) {
      externalScriptCount++;
      const scriptUrl = srcMatch[1].trim();
      let resDomain = initialHostname;
      let isThirdParty = false;
      try {
        const resolved = new URL(scriptUrl, finalUrl);
        resDomain = resolved.hostname;
        isThirdParty = resDomain !== initialHostname && !resDomain.endsWith('.' + initialHostname);
      } catch {}

      if (isThirdParty) {
        thirdPartyDomains.add(resDomain);
      } else {
        firstPartyDomains.add(resDomain);
      }

      // Check duplicates
      if (scriptUrlsSeen.includes(scriptUrl)) {
        if (!duplicateScripts.includes(scriptUrl)) duplicateScripts.push(scriptUrl);
      } else {
        scriptUrlsSeen.push(scriptUrl);
      }

      // Check known heavy/unminified scripts
      const lowerUrl = scriptUrl.toLowerCase();
      if (
        lowerUrl.includes('react.development.js') ||
        lowerUrl.includes('vue.esm-browser.js') ||
        lowerUrl.includes('three.js') ||
        lowerUrl.includes('lodash.js') ||
        lowerUrl.includes('moment.js') ||
        lowerUrl.includes('pdf.worker.js') ||
        lowerUrl.includes('webflow.js')
      ) {
        largeBundlesDetected.push(scriptUrl);
      }

      // Check tracker list
      for (const tracker of KNOWN_TRACKERS) {
        if (tracker.pattern.test(scriptUrl)) {
          knownTrackersFound.add(tracker.name);
        }
      }

      // Render blocking in <head> without async/defer/module
      const isInHead = headContent.includes(s);
      const isBlocking = isInHead && !isAsync && !isDefer && !isModule;
      if (isBlocking) {
        renderBlockingScriptsCount++;
      }

      detectedResources.push({
        url: scriptUrl,
        type: 'script',
        domain: resDomain,
        isThirdParty,
        isRenderBlocking: isBlocking
      });
    } else {
      inlineScriptCount++;
      const innerCode = s.replace(/<\/?script[^>]*>/gi, '');
      inlineScriptTotalBytes += innerCode.length;
    }
  }

  // Stylesheets
  const stylesheetMatches = rawHtml.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi);
  let stylesheetCount = 0;
  const styleUrlsSeen: string[] = [];
  const duplicateStyles: string[] = [];
  for (const sm of stylesheetMatches) {
    stylesheetCount++;
    const tag = sm[0];
    const hrefMatch = tag.match(/\bhref=["']([^"']+)["']/i);
    const mediaMatch = tag.match(/\bmedia=["']([^"']+)["']/i);
    const isPrintOnly = mediaMatch && mediaMatch[1] && mediaMatch[1].toLowerCase() === 'print';
    const isBlocking = !isPrintOnly;

    if (hrefMatch && hrefMatch[1]) {
      const href = hrefMatch[1].trim();
      let resDomain = initialHostname;
      let isThirdParty = false;
      try {
        const resolved = new URL(href, finalUrl);
        resDomain = resolved.hostname;
        isThirdParty = resDomain !== initialHostname && !resDomain.endsWith('.' + initialHostname);
      } catch {}

      if (isThirdParty) thirdPartyDomains.add(resDomain);

      if (styleUrlsSeen.includes(href)) {
        if (!duplicateStyles.includes(href)) duplicateStyles.push(href);
      } else {
        styleUrlsSeen.push(href);
      }

      detectedResources.push({
        url: href,
        type: 'stylesheet',
        domain: resDomain,
        isThirdParty,
        isRenderBlocking: isBlocking
      });
    }
  }

  // 5. Images Extraction & Performance/Accessibility
  const imgMatches = rawHtml.matchAll(/<img\b[^>]*>/gi);
  let totalImages = 0;
  let imagesWithoutAltCount = 0;
  let imagesMissingDimensions = 0;
  let missingAspectRatiosCount = 0;
  let lazyLoadedLcpDetected = false;
  let lcpImageCandidate = '';
  let missingLazyBelowFoldCount = 0;
  let missingSrcsetCount = 0;
  let legacyFormatCount = 0;
  const missingAltSamples: Array<{ src: string; selector?: string }> = [];
  const duplicateImages: string[] = [];
  const brokenImageCandidates: string[] = [];
  const imageUrlsSeen: string[] = [];
  const imageSamples: Array<{ src: string; hasAlt: boolean; hasDimensions: boolean; isLazy: boolean; format: string }> = [];

  for (const im of imgMatches) {
    totalImages++;
    const tag = im[0];
    const altMatch = tag.match(/\balt=(["'])(.*?)\1/i);
    const srcMatch = tag.match(/\bsrc=(["'])(.*?)\1/i);
    const hasWidth = /\bwidth=/i.test(tag);
    const hasHeight = /\bheight=/i.test(tag);
    const isLazy = /\bloading=["']lazy["']/i.test(tag);
    const hasSrcset = /\bsrcset=/i.test(tag);
    const src = srcMatch ? srcMatch[2].trim() : '';

    // LCP Hero image lazy loading anti-pattern
    if (totalImages === 1 && isLazy) {
      lazyLoadedLcpDetected = true;
      lcpImageCandidate = src || 'Initial DOM Image';
    }

    // Below the fold missing lazy
    if (totalImages > 2 && !isLazy) {
      missingLazyBelowFoldCount++;
    }

    // Missing aspect ratio (no width/height and no inline aspect-ratio style)
    if (!hasWidth && !hasHeight && !/aspect-ratio/i.test(tag)) {
      missingAspectRatiosCount++;
    }

    // Missing responsive variants (srcset)
    if (!hasSrcset && !src.endsWith('.svg') && !src.startsWith('data:')) {
      missingSrcsetCount++;
    }

    // Modern format detection
    let imgFormat = 'unknown';
    if (/\.webp\b/i.test(src)) imgFormat = 'webp';
    else if (/\.avif\b/i.test(src)) imgFormat = 'avif';
    else if (/\.svg\b/i.test(src)) imgFormat = 'svg';
    else if (/\.png\b/i.test(src)) { imgFormat = 'png'; legacyFormatCount++; }
    else if (/\.jpe?g\b/i.test(src)) { imgFormat = 'jpeg'; legacyFormatCount++; }
    else if (/\.gif\b/i.test(src)) { imgFormat = 'gif'; legacyFormatCount++; }

    // Check duplicate images
    if (src) {
      if (imageUrlsSeen.includes(src)) {
        if (!duplicateImages.includes(src)) duplicateImages.push(src);
      } else {
        imageUrlsSeen.push(src);
      }
    }

    // Check broken candidates
    if (!src || src === '#' || src.startsWith('javascript:')) {
      brokenImageCandidates.push(tag.slice(0, 80));
    }

    if (!altMatch || !altMatch[2].trim()) {
      imagesWithoutAltCount++;
      if (src && missingAltSamples.length < 8) {
        missingAltSamples.push({ src });
      }
    }

    if (!hasWidth || !hasHeight) {
      imagesMissingDimensions++;
    }

    if (imageSamples.length < 12 && src) {
      imageSamples.push({
        src,
        hasAlt: !!(altMatch && altMatch[2].trim()),
        hasDimensions: hasWidth && hasHeight,
        isLazy,
        format: imgFormat
      });
    }

    if (src) {
      let imgDomain = initialHostname;
      try {
        const resolved = new URL(src, finalUrl);
        imgDomain = resolved.hostname;
        if (imgDomain !== initialHostname) thirdPartyDomains.add(imgDomain);
      } catch {}

      if (detectedResources.length < 60) {
        detectedResources.push({
          url: src,
          type: 'image',
          domain: imgDomain,
          isThirdParty: imgDomain !== initialHostname,
          isRenderBlocking: false
        });
      }
    }
  }

  // 6. Accessibility Checks: Empty buttons, empty links, form inputs without labels, landmarks
  // Empty buttons: <button> without inner text or aria-label/title
  const buttonMatches = rawHtml.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi);
  let emptyButtonsCount = 0;
  const emptyButtonSamples: string[] = [];
  for (const bm of buttonMatches) {
    const attrs = bm[1];
    const content = bm[2].replace(/<[^>]+>/g, '').trim();
    const hasAriaLabel = /\baria-label=["'][^"']+["']/i.test(attrs);
    const hasAriaLabelledby = /\baria-labelledby=["'][^"']+["']/i.test(attrs);
    const hasTitle = /\btitle=["'][^"']+["']/i.test(attrs);
    if (!content && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      emptyButtonsCount++;
      if (emptyButtonSamples.length < 5) {
        emptyButtonSamples.push(bm[0].slice(0, 80));
      }
    }
  }

  // Empty links: <a> without text or aria-label
  const linkMatches = rawHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi);
  let emptyLinksCount = 0;
  const emptyLinkSamples: string[] = [];
  for (const lm of linkMatches) {
    const attrs = lm[1];
    const content = lm[2].replace(/<[^>]+>/g, '').trim();
    const hasAriaLabel = /\baria-label=["'][^"']+["']/i.test(attrs);
    const hasTitle = /\btitle=["'][^"']+["']/i.test(attrs);
    const hasImg = /<img\b/i.test(lm[2]);
    if (!content && !hasAriaLabel && !hasTitle && !hasImg) {
      emptyLinksCount++;
      if (emptyLinkSamples.length < 5) {
        emptyLinkSamples.push(lm[0].slice(0, 80));
      }
    }
  }

  // Form inputs without labels
  const inputMatches = rawHtml.matchAll(/<input\b([^>]*)>/gi);
  let formInputsWithoutLabelCount = 0;
  for (const inp of inputMatches) {
    const attrs = inp[1];
    const isHiddenOrSubmit = /\btype=["'](hidden|submit|button|reset|image)["']/i.test(attrs);
    if (isHiddenOrSubmit) continue;

    const hasAriaLabel = /\baria-label=["'][^"']+["']/i.test(attrs);
    const hasAriaLabelledby = /\baria-labelledby=["'][^"']+["']/i.test(attrs);
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/i);
    let hasAssociatedLabel = false;
    if (idMatch && idMatch[1]) {
      const labelRegex = new RegExp(`<label\\b[^>]*for=["']${idMatch[1]}["']`, 'i');
      hasAssociatedLabel = labelRegex.test(rawHtml);
    }

    if (!hasAriaLabel && !hasAriaLabelledby && !hasAssociatedLabel) {
      formInputsWithoutLabelCount++;
    }
  }

  // Landmarks
  const hasMainLandmark = /<main\b/i.test(rawHtml) || /role=["']main["']/i.test(rawHtml);
  const hasNavLandmark = /<nav\b/i.test(rawHtml) || /role=["']navigation["']/i.test(rawHtml);
  const hasHeaderLandmark = /<header\b/i.test(rawHtml) || /role=["']banner["']/i.test(rawHtml);
  const hasFooterLandmark = /<footer\b/i.test(rawHtml) || /role=["']contentinfo["']/i.test(rawHtml);
  const hasSkipLink = /<a\b[^>]*href=["']#(content|main|main-content)["']/i.test(rawHtml);

  // 7. Animation, CSS Jank & prefers-reduced-motion
  const styleBlocks = rawHtml.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const combinedStyles = styleBlocks.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');

  const keyframeMatches = (combinedStyles.match(/@keyframes\s+([a-zA-Z0-9_-]+)/gi) || []).length +
                          (rawHtml.match(/animation:\s*[^;]+/gi) || []).length;

  const expensiveProps = ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding'];
  const nonCompositedFound: string[] = [];
  for (const prop of expensiveProps) {
    const reg = new RegExp(`(transition|animation)[^;]*\\b${prop}\\b`, 'i');
    if (reg.test(combinedStyles) || reg.test(rawHtml)) {
      nonCompositedFound.push(prop);
    }
  }

  const transitionAllCount = (combinedStyles.match(/transition\s*:\s*all\b/gi) || []).length +
                             (rawHtml.match(/style=["'][^"']*transition\s*:\s*all/gi) || []).length;

  const hasReducedMotion = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(combinedStyles) ||
                           /@media[^{]+prefers-reduced-motion/i.test(rawHtml);

  const detectedAnimationLibraries: string[] = [];
  if (/gsap(\.min)?\.js/i.test(rawHtml) || /TweenMax/i.test(rawHtml)) detectedAnimationLibraries.push('GSAP');
  if (/lottie/i.test(rawHtml)) detectedAnimationLibraries.push('Lottie');
  if (/three(\.min)?\.js/i.test(rawHtml)) detectedAnimationLibraries.push('Three.js');
  if (/framer-motion/i.test(rawHtml)) detectedAnimationLibraries.push('Framer Motion');

  const animationJankRisk: 'Low' | 'Moderate' | 'High' = 
    (nonCompositedFound.length >= 2 || (transitionAllCount > 4 && keyframeMatches > 8)) ? 'High' :
    (nonCompositedFound.length > 0 || transitionAllCount > 1 || keyframeMatches > 4) ? 'Moderate' : 'Low';

  // 8. Fonts & Typography Analysis
  const fontLinks = detectedResources.filter(r => r.url.includes('fonts.googleapis.com') || r.url.includes('use.typekit.net'));
  const fontFamilies: string[] = [];
  const externalFontProviders: string[] = [];
  const duplicateFontRequests: string[] = [];
  const legacyFontFormats: string[] = [];

  for (const fl of fontLinks) {
    if (fl.url.includes('fonts.googleapis.com')) {
      if (!externalFontProviders.includes('Google Fonts')) externalFontProviders.push('Google Fonts');
      const famMatch = fl.url.match(/family=([^&:]+)/i);
      if (famMatch && famMatch[1]) {
        const famName = decodeURIComponent(famMatch[1].replace(/\+/g, ' '));
        if (fontFamilies.includes(famName)) {
          if (!duplicateFontRequests.includes(famName)) duplicateFontRequests.push(famName);
        } else {
          fontFamilies.push(famName);
        }
      }
    }
    if (fl.url.includes('use.typekit.net')) {
      if (!externalFontProviders.includes('Adobe Typekit')) externalFontProviders.push('Adobe Typekit');
    }
  }

  // Check @font-face families in CSS
  const fontFaceMatches = combinedStyles.matchAll(/font-family:\s*["']?([^;"'}]+)["']?/gi);
  for (const ffm of fontFaceMatches) {
    const fName = ffm[1].trim();
    if (fName && !fontFamilies.includes(fName) && !['inherit', 'sans-serif', 'serif', 'monospace', 'initial'].includes(fName.toLowerCase())) {
      fontFamilies.push(fName);
    }
  }

  const fontCount = fontLinks.length + (combinedStyles.match(/@font-face/gi) || []).length;
  const hasFontDisplaySwap = /display=swap/i.test(rawHtml) || /font-display:\s*(swap|optional|fallback)/i.test(combinedStyles);
  const renderBlockingFontsCount = detectedResources.filter(r => r.type === 'stylesheet' && (r.url.includes('fonts.googleapis.com') || r.url.includes('use.typekit.net')) && r.isRenderBlocking).length;
  const hasPreconnect = /<link\b[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.gstatic\.com["']/i.test(rawHtml);

  if (/\.(ttf|otf|eot)\b/i.test(rawHtml) || /\.(ttf|otf|eot)\b/i.test(combinedStyles)) {
    if (/\.ttf\b/i.test(rawHtml) || /\.ttf\b/i.test(combinedStyles)) legacyFontFormats.push('.ttf');
    if (/\.otf\b/i.test(rawHtml) || /\.otf\b/i.test(combinedStyles)) legacyFontFormats.push('.otf');
    if (/\.eot\b/i.test(rawHtml) || /\.eot\b/i.test(combinedStyles)) legacyFontFormats.push('.eot');
  }

  // 9. DOM Node Count & Max Depth Estimation
  const tagMatches = rawHtml.match(/<[a-zA-Z][a-zA-Z0-9-]*\b/g) || [];
  const domNodeCount = tagMatches.length;
  // Heuristic max depth based on nested div/section count
  const domMaxDepth = Math.min(32, Math.max(4, Math.round(Math.log2(Math.max(16, domNodeCount)) * 1.8)));

  // 10. Security Checks: Mixed content, Target Blank, Inline Handlers, Deprecated Tags
  let mixedContentCount = 0;
  const mixedContentSamples: string[] = [];
  if (isHttps) {
    const httpAssets = rawHtml.matchAll(/(?:src|href)=["'](http:\/\/[^"']+)["']/gi);
    for (const ha of httpAssets) {
      const assetUrl = ha[1];
      if (!assetUrl.includes('w3.org') && !assetUrl.includes('schema.org') && !assetUrl.includes('xmlns')) {
        mixedContentCount++;
        if (mixedContentSamples.length < 5) mixedContentSamples.push(assetUrl);
      }
    }
  }

  // Unsafe target="_blank" without rel="noopener"
  const unsafeBlankMatches = rawHtml.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi);
  let unsafeBlankLinksCount = 0;
  for (const ub of unsafeBlankMatches) {
    const tag = ub[0];
    const hasNoopener = /\brel=["'][^"']*\b(noopener|noreferrer)\b[^"']*["']/i.test(tag);
    if (!hasNoopener) unsafeBlankLinksCount++;
  }

  // Dangerous inline event handlers
  const inlineEventHandlers = rawHtml.match(/\s(on[a-z]+)=["'][^"']+["']/gi) || [];
  const inlineEventHandlersCount = inlineEventHandlers.length;

  // Deprecated HTML tags
  const deprecatedTagsList = ['center', 'font', 'marquee', 'blink', 'strike', 'applet', 'frameset', 'frame'];
  const deprecatedTagsFound: string[] = [];
  for (const dt of deprecatedTagsList) {
    if (new RegExp(`<${dt}\\b`, 'i').test(rawHtml)) {
      deprecatedTagsFound.push(`<${dt}>`);
    }
  }

  // Exposing server version
  const exposesServerVersion = !!serverHeader && /\d+\.\d+/.test(serverHeader);

  // 11. Robots.txt and Sitemap.xml safe server-side probes & deep crawler
  const parsedOrigin = new URL(finalUrl).origin;
  const discoveredPaths: string[] = [];
  const internalAnchorMatches = rawHtml.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);

  for (const match of internalAnchorMatches) {
    const href = (match[1] || '').trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (/\.(png|jpe?g|gif|svg|webp|ico|pdf|zip|mp4|css|js|json|xml|txt)$/i.test(href)) continue;

    try {
      const resolved = new URL(href, finalUrl);
      if (resolved.origin === parsedOrigin) {
        const cleanPath = resolved.pathname;
        if (cleanPath && cleanPath !== '/' && !discoveredPaths.includes(cleanPath)) {
          discoveredPaths.push(cleanPath);
          if (discoveredPaths.length >= 8) break;
        }
      }
    } catch {}
  }

  const { robotsStatus: robotsTxtStatus, sitemapResult } = await analyzeRobotsAndSitemaps(parsedOrigin, discoveredPaths);

  const sitemapStatus = {
    checked: sitemapResult.checked,
    exists: sitemapResult.exists,
    status: sitemapResult.exists ? 200 : 404,
    urlCountEstimate: sitemapResult.totalUrls,
    sitemapUrl: sitemapResult.sitemapUrl,
    sampleUrls: sitemapResult.sampleUrls,
    mismatchedUrls: sitemapResult.mismatchedUrls,
    unreachableUrls: sitemapResult.unreachableUrls,
    sitemapMissingUrls: sitemapResult.sitemapMissingUrls,
    orphanedInternalLinks: sitemapResult.orphanedInternalLinks,
    format: sitemapResult.format,
    isSitemapIndex: sitemapResult.isSitemapIndex,
    childSitemapsFound: sitemapResult.childSitemapsFound,
    statusMessage: sitemapResult.statusMessage
  };

  // If no anchor links found on homepage, check sitemap sample paths
  if (discoveredPaths.length === 0 && sitemapResult.sampleUrls.length > 0) {
    sitemapResult.sampleUrls.slice(0, 4).forEach(sUrl => {
      try {
        const p = new URL(sUrl).pathname;
        if (p && p !== '/' && !discoveredPaths.includes(p)) discoveredPaths.push(p);
      } catch {}
    });
  }

  // 12. Subpages Health Crawler
  const crawledSubpages = await crawlDiscoveredInternalPages(parsedOrigin, discoveredPaths, 6);
  const internalPages: ScannedSubpageHealth[] = [
    {
      path: new URL(finalUrl).pathname || '/',
      url: finalUrl,
      status: statusCode,
      ok: statusCode >= 200 && statusCode < 400,
      responseTimeMs,
      title: title || `${initialHostname} - Home`,
      hasTitle: !!title,
      hasMetaDescription: !!metaDescription,
      h1Count: h1List.length,
      h1Text: h1List[0] || 'None',
      totalImages,
      imagesWithoutAltCount,
      pageScore: 95,
      pageGrade: 'Excellent',
      issues: []
    },
    ...crawledSubpages
  ];

  // 13. Keywords Extraction
  const strippedText = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .toLowerCase();

  const words = strippedText.match(/\b[a-z]{4,20}\b/g) || [];
  const stopWords = new Set([
    'about', 'after', 'again', 'against', 'almost', 'also', 'although', 'always', 'among',
    'another', 'because', 'before', 'being', 'between', 'both', 'could', 'every', 'first',
    'from', 'further', 'here', 'into', 'just', 'more', 'most', 'other', 'over', 'same',
    'should', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these',
    'they', 'this', 'those', 'through', 'under', 'until', 'very', 'were', 'what', 'when',
    'where', 'which', 'while', 'with', 'would', 'your', 'have', 'been', 'will', 'with',
    'http', 'https', 'www', 'html', 'page', 'site', 'click', 'read', 'view'
  ]);

  const wordCounts: Record<string, number> = {};
  words.forEach(w => {
    if (!stopWords.has(w) && isNaN(Number(w))) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: words.length ? Math.round((count / words.length) * 1000) / 10 : 0
    }));

  const combinedSearchContext = (title + ' ' + metaDescription + ' ' + h1List.join(' ') + ' ' + strippedText.slice(0, 3000)).toLowerCase();
  const potentialKeywords = [
    { term: 'pricing', label: 'Transparent Pricing / Rates' },
    { term: 'reviews', label: 'Client Reviews / Testimonials' },
    { term: 'services', label: 'Core Services / Capabilities' },
    { term: 'contact', label: 'Direct Contact / Inquiry Form' },
    { term: 'portfolio', label: 'Case Studies / Live Work' },
    { term: 'support', label: 'Customer Support / Help Desk' },
    { term: 'guarantee', label: 'Satisfaction Guarantee' },
    { term: 'security', label: 'Security & Compliance Standards' },
    { term: 'noida', label: 'Regional India / Noida Presence' },
    { term: 'delivery', label: '48-Hour Fast Delivery Terms' }
  ];

  const missingKeywords = potentialKeywords
    .filter(k => !combinedSearchContext.includes(k.term))
    .map(k => k.label)
    .slice(0, 6);

  // 14. Dual-Profile Browser Performance Engine (Mobile & Desktop via Google PageSpeed / Lighthouse API)
  const [mobilePerf, desktopPerf] = await Promise.all([
    fetchBrowserPerformance(finalUrl, 'mobile'),
    fetchBrowserPerformance(finalUrl, 'desktop')
  ]);

  let coreWebVitals: CoreWebVitalsData;
  if (mobilePerf.available && mobilePerf.fcp) {
    coreWebVitals = {
      available: true,
      source: mobilePerf.source === 'FIELD — CrUX' ? 'field_crux' : 'pagespeed_api',
      message: `${mobilePerf.statusMessage} (Mobile Profile)`,
      fcp: mobilePerf.fcp ? { value: Math.round(mobilePerf.fcp.value), unit: 'ms', rating: mobilePerf.fcp.rating } : undefined,
      lcp: mobilePerf.lcp ? { value: mobilePerf.lcp.value, unit: 's', rating: mobilePerf.lcp.rating } : undefined,
      cls: mobilePerf.cls ? { value: mobilePerf.cls.value, unit: '', rating: mobilePerf.cls.rating } : undefined,
      inp: mobilePerf.inp ? { value: Math.round(mobilePerf.inp.value), unit: 'ms', rating: mobilePerf.inp.rating } : undefined,
      tbt: mobilePerf.tbt ? { value: Math.round(mobilePerf.tbt.value), unit: 'ms', rating: mobilePerf.tbt.rating } : undefined,
      speedIndex: mobilePerf.speedIndex ? { value: mobilePerf.speedIndex.value, unit: 's', rating: mobilePerf.speedIndex.rating } : undefined
    };
  } else {
    coreWebVitals = {
      available: false,
      source: 'unconfigured',
      message: mobilePerf.statusMessage || 'Synthetic lab Core Web Vitals (FCP/LCP/CLS/INP) require a Google PageSpeed API Key (PAGESPEED_API_KEY) or active network quota. SamaXon guarantees zero fabricated timings; all metrics below are real server measurements.'
    };
  }

  // 15. Modular Findings & Evidence Generation
  const findings: AuditFinding[] = [];
  const nowIso = new Date().toISOString();

  // Helper to add finding
  function addFinding(f: Omit<AuditFinding, 'detectedAt'>) {
    findings.push({ ...f, detectedAt: nowIso });
  }

  // 15b. AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization) Analysis
  const { aeoData, geoData, findings: aeoGeoFindings } = analyzeAeoAndGeo({
    rawHtml,
    schemaItems,
    detectedSchemaTypes,
    robotsTxtStatus,
    finalUrl
  });

  // === SECURITY FINDINGS ===
  if (!isHttps) {
    addFinding({
      id: 'sec-https-missing',
      category: 'security',
      title: 'Unencrypted Plaintext HTTP Protocol',
      description: 'The site is delivered over unencrypted HTTP. Data sent between users and the server can be intercepted or altered.',
      severity: 'critical',
      impact: 'Critical',
      confidence: 'verified',
      status: 'fail',
      affectedUrl: finalUrl,
      metric: 'Transport Encryption',
      currentValue: 'HTTP',
      expectedValue: 'HTTPS',
      evidence: `Protocol is "${finalUrl.split('://')[0]}:"`,
      recommendation: 'Deploy a TLS/SSL certificate (e.g., Let\'s Encrypt) and force an HTTP to HTTPS 301 redirect.',
      technicalExplanation: 'Modern browsers flag HTTP sites as "Not Secure" and block sensitive APIs like Geolocation and Service Workers.',
      suggestedFix: {
        language: 'nginx',
        code: `server {\n  listen 80;\n  server_name ${initialHostname};\n  return 301 https://$host$request_uri;\n}`,
        description: 'Permanent 301 HTTPS redirection in Nginx configuration.'
      },
      documentationUrl: 'https://web.dev/why-https-matters/',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'sec-https-pass',
      category: 'security',
      title: 'TLS/SSL HTTPS Encryption Active',
      description: 'Traffic between the browser and origin server is encrypted.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: 'HTTPS Active',
      expectedValue: 'HTTPS Active',
      recommendation: 'Ensure automated SSL renewal 30 days prior to certificate expiration.',
      technicalExplanation: 'TLS prevents eavesdropping and tampering of transmitted payloads.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // HSTS
  if (!hstsHeader) {
    addFinding({
      id: 'sec-hsts-missing',
      category: 'security',
      title: 'Missing HTTP Strict Transport Security (HSTS)',
      description: 'Browsers are not instructed to strictly reject plaintext HTTP, allowing SSL-stripping man-in-the-middle attacks.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      affectedResource: 'HTTP Response Headers',
      metric: 'Strict-Transport-Security Header',
      currentValue: 'Not set',
      expectedValue: 'max-age=63072000; includeSubDomains; preload',
      recommendation: 'Configure your web server or CDN to send the Strict-Transport-Security header.',
      technicalExplanation: 'HSTS ensures that once a user visits the site, all future requests are automatically rewritten to HTTPS client-side.',
      suggestedFix: {
        language: 'nginx',
        code: 'add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;',
        description: 'HSTS header configuration with 2-year duration and preload suitability.'
      },
      documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'sec-hsts-pass',
      category: 'security',
      title: 'HSTS Header Configured',
      description: 'Strict Transport Security is active, protecting against protocol downgrade attacks.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: hstsHeader,
      expectedValue: 'Active',
      recommendation: 'Maintain HSTS preload status on hstspreload.org.',
      technicalExplanation: 'Enforces HTTPS on the client side.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Content-Security-Policy
  if (!cspHeader) {
    addFinding({
      id: 'sec-csp-missing',
      category: 'security',
      title: 'Missing Content-Security-Policy (CSP)',
      description: 'Without a Content-Security-Policy, the application is more susceptible to Cross-Site Scripting (XSS) and rogue script injection.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      metric: 'Content-Security-Policy',
      currentValue: 'Not set',
      expectedValue: "default-src 'self'; script-src 'self' ...",
      recommendation: 'Define a Content-Security-Policy header restricting script, style, and iframe source origins.',
      technicalExplanation: 'CSP provides defense-in-depth by explicitly whitelisting which domains can execute executable code.',
      suggestedFix: {
        language: 'nginx',
        code: `add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:;" always;`,
        description: 'Standard baseline Content-Security-Policy header.'
      },
      documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'sec-csp-pass',
      category: 'security',
      title: 'Content-Security-Policy Enabled',
      description: 'CSP header detected to mitigate unauthorized script and resource execution.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: cspHeader.slice(0, 60) + (cspHeader.length > 60 ? '...' : ''),
      expectedValue: 'Configured',
      recommendation: 'Regularly audit allowed origins to minimize wildcard permissions.',
      technicalExplanation: 'Restricts resource loading to authorized domains.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // X-Frame-Options
  if (!xFrameHeader && (!cspHeader || !cspHeader.includes('frame-ancestors'))) {
    addFinding({
      id: 'sec-xframe-missing',
      category: 'security',
      title: 'Missing Clickjacking Protection',
      description: 'Neither X-Frame-Options nor CSP frame-ancestors is present. Malicious sites can embed your pages inside an invisible iframe to hijack user clicks.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'X-Frame-Options',
      currentValue: 'Missing',
      expectedValue: 'SAMEORIGIN or DENY',
      recommendation: 'Send X-Frame-Options: SAMEORIGIN or configure CSP frame-ancestors.',
      technicalExplanation: 'Clickjacking involves tricking a user into clicking something different from what they perceive.',
      suggestedFix: {
        language: 'nginx',
        code: 'add_header X-Frame-Options "SAMEORIGIN" always;',
        description: 'X-Frame-Options header preventing cross-origin framing.'
      },
      documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // X-Content-Type-Options
  if (!xContentTypeHeader) {
    addFinding({
      id: 'sec-content-type-missing',
      category: 'security',
      title: 'Missing X-Content-Type-Options Header',
      description: 'MIME-type sniffing is not explicitly disabled, which can cause browsers to execute non-executable files as scripts or stylesheets.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'X-Content-Type-Options',
      currentValue: 'Missing',
      expectedValue: 'nosniff',
      recommendation: 'Add header "X-Content-Type-Options: nosniff".',
      technicalExplanation: 'Prevents the browser from interpreting files as something other than what the server declares.',
      suggestedFix: {
        language: 'nginx',
        code: 'add_header X-Content-Type-Options "nosniff" always;',
        description: 'Disable MIME type sniffing.'
      },
      documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Mixed Content
  if (mixedContentCount > 0) {
    addFinding({
      id: 'sec-mixed-content',
      category: 'security',
      title: `Mixed Content Detected (${mixedContentCount} HTTP links on HTTPS)`,
      description: 'The page is served over HTTPS but references static assets using unencrypted HTTP:// URLs.',
      severity: 'critical',
      impact: 'Critical',
      confidence: 'verified',
      status: 'fail',
      evidence: `Samples: ${mixedContentSamples.slice(0, 3).join(', ')}`,
      currentValue: `${mixedContentCount} insecure assets`,
      expectedValue: '0',
      recommendation: 'Update all asset URLs to use https:// or protocol-relative // paths.',
      technicalExplanation: 'Modern browsers block active mixed content (scripts) and flag passive mixed content (images) as insecure.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Server banner leakage
  if (exposesServerVersion) {
    addFinding({
      id: 'sec-server-version',
      category: 'security',
      title: `Server Software Version Disclosed ("${serverHeader}")`,
      description: 'The Server response header reveals precise software and version numbers, making targeted vulnerability scanning easier for attackers.',
      severity: 'low',
      impact: 'Low',
      confidence: 'verified',
      status: 'warn',
      currentValue: serverHeader || 'Exposed',
      expectedValue: 'Hidden or generic',
      recommendation: 'Disable server tokens in your web server configuration.',
      technicalExplanation: 'Information disclosure eases fingerprinting of unpatched CVEs.',
      suggestedFix: {
        language: 'nginx',
        code: 'server_tokens off;',
        description: 'Suppress Nginx version banner.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Unsafe target="_blank"
  if (unsafeBlankLinksCount > 0) {
    addFinding({
      id: 'sec-unsafe-blank',
      category: 'security',
      title: `${unsafeBlankLinksCount} External Links with target="_blank" Missing rel="noopener"`,
      description: 'External links opening in new tabs without rel="noopener" expose the site to reverse tabnabbing attacks via window.opener.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${unsafeBlankLinksCount} vulnerable links`,
      expectedValue: '0',
      recommendation: 'Add rel="noopener noreferrer" to all anchor tags with target="_blank".',
      technicalExplanation: 'Prevents the target page from accessing window.opener to redirect the originating tab.',
      suggestedFix: {
        language: 'html',
        code: '<a href="https://external.com" target="_blank" rel="noopener noreferrer">Visit Site</a>',
        description: 'Safe external link format.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // === SEO & CRAWLABILITY FINDINGS ===
  // Title tag
  if (!title) {
    addFinding({
      id: 'seo-title-missing',
      category: 'seo',
      title: 'Missing HTML <title> Tag',
      description: 'No <title> element was found in the document <head>. Search engines will have trouble identifying the primary topic.',
      severity: 'critical',
      impact: 'Critical',
      confidence: 'verified',
      status: 'fail',
      metric: 'Page Title',
      currentValue: 'None',
      expectedValue: '50-60 characters',
      recommendation: 'Add a distinct <title> tag between 50 and 60 characters with core target keywords.',
      technicalExplanation: 'Title is one of the strongest on-page SEO signals and defines the headline in search engine results.',
      suggestedFix: {
        language: 'html',
        code: `<title>SamaXon Digital Solutions | High-Performance Web & App Development</title>`,
        description: 'Clean, descriptive HTML title tag.'
      },
      documentationUrl: 'https://developers.google.com/search/docs/appearance/title-link',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else if (title.length < 20 || title.length > 70) {
    addFinding({
      id: 'seo-title-length',
      category: 'seo',
      title: `Suboptimal Title Tag Length (${title.length} characters)`,
      description: `The current title is ${title.length} characters. Titles below 20 characters underutilize ranking keywords; titles over 65 characters get truncated in Google SERPs.`,
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `"${title}" (${title.length} chars)`,
      expectedValue: '50-60 characters',
      recommendation: 'Refine the title length to between 50 and 60 characters.',
      technicalExplanation: 'Google displays approximately 600px of title width on desktop before truncating with ellipses.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'seo-title-pass',
      category: 'seo',
      title: `Optimized Title Tag (${title.length} characters)`,
      description: `"${title}" matches optimal search engine snippet length and formatting criteria.`,
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: title,
      expectedValue: '50-60 characters',
      recommendation: 'Maintain descriptive and keyword-aligned titles across subpages.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Meta Description
  if (!metaDescription) {
    addFinding({
      id: 'seo-meta-desc-missing',
      category: 'seo',
      title: 'Missing Meta Description Tag',
      description: 'Search engines will automatically extract arbitrary text snippets from your page, reducing search click-through rates.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      metric: 'Meta Description',
      currentValue: 'Missing',
      expectedValue: '120-160 characters',
      recommendation: 'Add <meta name="description" content="..."> between 120 and 160 characters with a clear value proposition and CTA.',
      technicalExplanation: 'Meta descriptions directly influence user click-through rates (CTR) in search results.',
      suggestedFix: {
        language: 'html',
        code: '<meta name="description" content="Discover professional digital solutions by SamaXon. We build high-speed web apps, custom software, and optimized digital architectures.">',
        description: 'Engaging meta description snippet.'
      },
      documentationUrl: 'https://developers.google.com/search/docs/appearance/snippets',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else if (metaDescription.length < 70 || metaDescription.length > 165) {
    addFinding({
      id: 'seo-meta-desc-length',
      category: 'seo',
      title: `Meta Description Length (${metaDescription.length} characters)`,
      description: `Current description is ${metaDescription.length} characters. Optimal length is 120-160 characters to avoid truncation or under-informing users.`,
      severity: 'low',
      impact: 'Low',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${metaDescription.length} characters`,
      expectedValue: '120-160 characters',
      recommendation: 'Adjust description length to between 120 and 160 characters.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'seo-meta-desc-pass',
      category: 'seo',
      title: `Meta Description Optimal (${metaDescription.length} characters)`,
      description: 'Meta description contains healthy length for high search CTR.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: metaDescription,
      expectedValue: '120-160 characters',
      recommendation: 'Keep copy aligned with landing page intent.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // H1 Heading
  if (h1List.length === 0) {
    addFinding({
      id: 'seo-h1-missing',
      category: 'seo',
      title: 'Missing Primary <h1> Heading',
      description: 'No <h1> tag was found. The H1 heading is the main topical anchor for search engine crawlers and screen reader users.',
      severity: 'critical',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      metric: 'H1 Headings',
      currentValue: '0',
      expectedValue: '1',
      recommendation: 'Add exactly one prominent <h1> tag describing the page topic.',
      technicalExplanation: 'Search engines use H1 to understand what the document is about.',
      suggestedFix: {
        language: 'html',
        code: '<h1>High-Performance Web Solutions & Custom Software Architecture</h1>',
        description: 'Single primary topical H1 heading.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else if (h1List.length > 1) {
    addFinding({
      id: 'seo-h1-multiple',
      category: 'seo',
      title: `Multiple <h1> Headings Found (${h1List.length} detected)`,
      description: `Found ${h1List.length} H1 tags. While HTML5 permits multiple H1s, best practice recommends a single primary H1 to maintain unambiguous topical clarity.`,
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${h1List.length} H1 tags`,
      expectedValue: '1',
      evidence: `H1s: ${h1List.map(h => `"${h.slice(0, 30)}..."`).join(', ')}`,
      recommendation: 'Reserve <h1> for the primary page title and demote secondary headlines to <h2>.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'seo-h1-pass',
      category: 'seo',
      title: 'Single Descriptive H1 Heading Present',
      description: `Primary heading "${h1List[0].slice(0, 60)}" properly structures the document hierarchy.`,
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: h1List[0],
      expectedValue: '1 descriptive H1',
      recommendation: 'Maintain consistent hierarchy with supporting H2 and H3 tags.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Heading hierarchy jumps
  if (!isHierarchyValid) {
    addFinding({
      id: 'seo-heading-hierarchy-jump',
      category: 'accessibility',
      title: `Skipped Heading Levels (${hierarchyIssues.length} jumps detected)`,
      description: 'Headings do not follow an incremental order (e.g. jumping from <h1> directly to <h3> without an intermediate <h2>). This breaks document structure for screen readers and search engines.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      evidence: hierarchyIssues.slice(0, 3).join('; '),
      recommendation: 'Nest headings sequentially without skipping levels (H1 -> H2 -> H3).',
      technicalExplanation: 'Assistive technologies use headings to generate a table of contents for users.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Canonical tag
  if (!canonicalUrl) {
    addFinding({
      id: 'seo-canonical-missing',
      category: 'seo',
      title: 'Missing <link rel="canonical"> Tag',
      description: 'No canonical URL tag is defined. This creates risks of duplicate content penalties if URLs with query strings or HTTP/HTTPS variants are crawled.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'Canonical Tag',
      currentValue: 'Missing',
      expectedValue: 'Canonical URL link',
      recommendation: 'Add <link rel="canonical" href="..."> pointing to the preferred authoritative URL.',
      suggestedFix: {
        language: 'html',
        code: `<link rel="canonical" href="${finalUrl}">`,
        description: 'Self-referencing authoritative canonical tag.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Robots.txt & Sitemap
  if (robotsTxtStatus.checked) {
    if (!robotsTxtStatus.exists) {
      addFinding({
        id: 'seo-robots-missing',
        category: 'seo',
        title: 'Missing or Inaccessible /robots.txt',
        description: 'Server returned a 404 or error for /robots.txt. Search engines look for this file first to learn crawling rules.',
        severity: 'medium',
        impact: 'Moderate',
        confidence: 'verified',
        status: 'warn',
        currentValue: `Status ${robotsTxtStatus.status}`,
        expectedValue: 'HTTP 200 OK',
        recommendation: 'Create a /robots.txt file specifying user-agent guidelines and linking to your sitemap.',
        suggestedFix: {
          language: 'plaintext',
          code: `User-agent: *\nAllow: /\nSitemap: ${new URL(finalUrl).origin}/sitemap.xml`,
          description: 'Standard permissive robots.txt with sitemap reference.'
        },
        checkType: 'server',
        availabilityStatus: 'available'
      });
    } else if (!robotsTxtStatus.allowsCrawl) {
      addFinding({
        id: 'seo-robots-disallow-all',
        category: 'seo',
        title: 'robots.txt Disallows All Search Engine Crawlers',
        description: 'The robots.txt file contains "Disallow: /", which actively blocks search engines like Googlebot and Bingbot from indexing your site.',
        severity: 'critical',
        impact: 'Critical',
        confidence: 'verified',
        status: 'fail',
        currentValue: 'Disallow: /',
        expectedValue: 'Allow: /',
        recommendation: 'Update robots.txt to permit crawling of public pages.',
        checkType: 'server',
        availabilityStatus: 'available'
      });
    } else {
      addFinding({
        id: 'seo-robots-pass',
        category: 'seo',
        title: 'Valid /robots.txt Configured',
        description: 'robots.txt exists, returned HTTP 200, and permits normal search indexing.',
        severity: 'passed',
        impact: 'None',
        confidence: 'verified',
        status: 'pass',
        currentValue: 'HTTP 200 OK',
        expectedValue: 'HTTP 200 OK',
        recommendation: 'Keep sitemap references updated in robots.txt.',
        checkType: 'server',
        availabilityStatus: 'available'
      });
    }
  }

  // Schema.org JSON-LD
  if (schemaItems.length === 0) {
    addFinding({
      id: 'seo-schema-missing',
      category: 'seo',
      title: 'Missing Schema.org / JSON-LD Structured Data',
      description: 'No structured data was detected. Without schema markup, search engines cannot display rich snippets, star ratings, or business entity panels.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'JSON-LD Schema',
      currentValue: '0 blocks',
      expectedValue: 'Organization / WebSite / Service',
      recommendation: 'Add structured JSON-LD data for Organization, LocalBusiness, or WebSite.',
      technicalExplanation: 'Structured data enables rich results in Google Search.',
      suggestedFix: {
        language: 'json',
        code: `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${initialHostname}",\n  "url": "${finalUrl}",\n  "description": "${metaDescription.slice(0, 100)}"\n}`,
        description: 'Basic Organization JSON-LD snippet.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    const invalidSchemas = schemaItems.filter(s => !s.isValidJson);
    if (invalidSchemas.length > 0) {
      addFinding({
        id: 'seo-schema-invalid',
        category: 'seo',
        title: 'Malformed JSON-LD Syntax Error in Structured Data',
        description: `Found ${invalidSchemas.length} JSON-LD blocks containing invalid JSON syntax that search engines cannot parse.`,
        severity: 'high',
        impact: 'High',
        confidence: 'verified',
        status: 'fail',
        evidence: invalidSchemas[0]?.parseError || 'Syntax error in JSON string',
        recommendation: 'Fix the JSON syntax error in your application/ld+json script tags.',
        checkType: 'server',
        availabilityStatus: 'available'
      });
    } else {
      addFinding({
        id: 'seo-schema-pass',
        category: 'seo',
        title: `Structured Schema.org Configured (${schemaItems.length} entities: ${Array.from(detectedSchemaTypes).join(', ') || 'Custom'})`,
        description: 'Valid structured data found for search engine rich snippets.',
        severity: 'passed',
        impact: 'None',
        confidence: 'verified',
        status: 'pass',
        currentValue: `${schemaItems.length} valid entities`,
        expectedValue: 'Valid schema',
        recommendation: 'Test your URLs in the Google Rich Results Test.',
        checkType: 'server',
        availabilityStatus: 'available'
      });
    }
  }

  // === AEO & GEO INTELLIGENCE FINDINGS ===
  aeoGeoFindings.forEach(f => findings.push(f));

  // === ACCESSIBILITY FINDINGS (WCAG 2.1 AA) ===
  // Missing HTML Lang
  if (!htmlLang) {
    addFinding({
      id: 'a11y-html-lang-missing',
      category: 'accessibility',
      title: 'Missing HTML "lang" Attribute',
      description: 'The root <html> tag lacks a lang attribute. Screen readers cannot select the correct accent, pronunciation, or voice synthesizer.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      metric: 'html lang attribute',
      currentValue: 'Missing',
      expectedValue: 'lang="en"',
      recommendation: 'Specify the primary language on the root <html> element (e.g., <html lang="en">).',
      suggestedFix: {
        language: 'html',
        code: '<html lang="en">',
        description: 'Declare primary document language.'
      },
      documentationUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'a11y-html-lang-pass',
      category: 'accessibility',
      title: `Valid HTML Lang Attribute ("${htmlLang}")`,
      description: 'The document explicitly declares its primary language for assistive screen readers.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: htmlLang,
      expectedValue: 'Valid language tag',
      recommendation: 'Ensure sub-elements in other languages specify appropriate lang attributes.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Missing Image Alt
  if (imagesWithoutAltCount > 0) {
    addFinding({
      id: 'a11y-images-alt-missing',
      category: 'accessibility',
      title: `${imagesWithoutAltCount} Images Missing "alt" Attributes`,
      description: 'Images without alt attributes leave screen reader users unable to understand the graphic content and hurt Google Image SEO.',
      severity: imagesWithoutAltCount > 3 ? 'high' : 'medium',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      evidence: `Samples missing alt: ${missingAltSamples.map(s => s.src.slice(0, 40)).join(', ')}`,
      currentValue: `${imagesWithoutAltCount} images without alt`,
      expectedValue: '0',
      recommendation: 'Add descriptive alt text to informative images, or alt="" for purely decorative graphics.',
      suggestedFix: {
        language: 'html',
        code: '<img src="hero.jpg" alt="SamaXon software development dashboard showing analytics" width="800" height="600">',
        description: 'Accessible image with descriptive alt text and explicit dimensions.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else if (totalImages > 0) {
    addFinding({
      id: 'a11y-images-alt-pass',
      category: 'accessibility',
      title: `All Images Feature Descriptive Alt Attributes (${totalImages} checked)`,
      description: 'All evaluated <img> tags contain alt attributes adhering to WCAG 2.1 guideline 1.1.1.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: '100% compliant',
      expectedValue: '100% compliant',
      recommendation: 'Ensure alt descriptions remain meaningful rather than stuffed with keywords.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Empty Buttons
  if (emptyButtonsCount > 0) {
    addFinding({
      id: 'a11y-empty-buttons',
      category: 'accessibility',
      title: `${emptyButtonsCount} Button Elements Missing Accessible Name`,
      description: 'Buttons without text content or aria-label attributes cannot be understood by screen reader users, who will only hear "button" without context.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      evidence: `Samples: ${emptyButtonSamples.join('; ')}`,
      currentValue: `${emptyButtonsCount} empty buttons`,
      expectedValue: '0',
      recommendation: 'Add visible text or an aria-label attribute describing what the button triggers.',
      suggestedFix: {
        language: 'html',
        code: '<button type="button" aria-label="Open Navigation Menu">\n  <svg ...></svg>\n</button>',
        description: 'Accessible icon button with aria-label.'
      },
      documentationUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Empty Links
  if (emptyLinksCount > 0) {
    addFinding({
      id: 'a11y-empty-links',
      category: 'accessibility',
      title: `${emptyLinksCount} Anchor Links Missing Text or Accessible Name`,
      description: 'Anchor tags without text or aria-label attributes leave users navigating by keyboard or voice control unable to discern where the link leads.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${emptyLinksCount} empty links`,
      expectedValue: '0',
      recommendation: 'Provide clear descriptive link text or an aria-label on all <a> elements.',
      suggestedFix: {
        language: 'html',
        code: '<a href="/contact" aria-label="Contact SamaXon Support">\n  <i class="icon-mail"></i>\n</a>',
        description: 'Accessible icon link.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Form Inputs without labels
  if (formInputsWithoutLabelCount > 0) {
    addFinding({
      id: 'a11y-form-labels-missing',
      category: 'accessibility',
      title: `${formInputsWithoutLabelCount} Form Input Elements Lack Associated Labels`,
      description: 'Inputs without an associated <label for="...">, aria-label, or aria-labelledby fail WCAG 2.1 criteria 1.3.1 and 4.1.2.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      currentValue: `${formInputsWithoutLabelCount} unlabelled inputs`,
      expectedValue: '0',
      recommendation: 'Associate each form input with a matching <label for="id"> or aria-label attribute.',
      suggestedFix: {
        language: 'html',
        code: '<label for="user-email">Work Email</label>\n<input id="user-email" type="email" name="email" required>',
        description: 'Explicit label-input association.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Zoom lock
  if (isZoomLocked) {
    addFinding({
      id: 'a11y-zoom-locked',
      category: 'accessibility',
      title: 'Mobile Pinch-to-Zoom Is Restricted',
      description: 'Viewport meta tag contains user-scalable=no or maximum-scale=1.0, preventing visually impaired users from magnifying text on mobile screens.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      currentValue: 'user-scalable=no',
      expectedValue: 'Pinch zoom enabled',
      recommendation: 'Remove user-scalable=no and maximum-scale constraints from your viewport tag.',
      suggestedFix: {
        language: 'html',
        code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        description: 'Standard responsive viewport permitting magnification.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // === PERFORMANCE FINDINGS ===
  // TTFB
  if (responseTimeMs > 1500) {
    addFinding({
      id: 'perf-ttfb-critical',
      category: 'performance',
      title: `Critical Server Response Time (TTFB: ${responseTimeMs}ms)`,
      description: 'Time to First Byte exceeds 1.5 seconds. Slow origin responses bottleneck all subsequent rendering and increase visitor bounce rates.',
      severity: 'critical',
      impact: 'Critical',
      confidence: 'verified',
      status: 'fail',
      metric: 'Time to First Byte (TTFB)',
      currentValue: `${responseTimeMs}ms`,
      expectedValue: '< 600ms',
      recommendation: 'Implement edge caching (Cloudflare, Vercel Edge, Fastly) and optimize server database queries.',
      technicalExplanation: 'TTFB measures the duration from when the browser requests a page to when the first byte of data arrives.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else if (responseTimeMs > 600) {
    addFinding({
      id: 'perf-ttfb-moderate',
      category: 'performance',
      title: `Moderate Server Response Latency (TTFB: ${responseTimeMs}ms)`,
      description: 'Server response time is slightly elevated above the 200-500ms benchmark.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${responseTimeMs}ms`,
      expectedValue: '< 600ms',
      recommendation: 'Enable HTTP/2 or HTTP/3 and CDN page caching.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'perf-ttfb-pass',
      category: 'performance',
      title: `Fast Time to First Byte (${responseTimeMs}ms)`,
      description: 'Server responded quickly within Google Core Web Vitals good threshold (< 800ms).',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: `${responseTimeMs}ms`,
      expectedValue: '< 600ms',
      recommendation: 'Maintain server edge caching and fast database connections.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Compression
  if (compressionHeader) {
    addFinding({
      id: 'perf-compression-pass',
      category: 'performance',
      title: `HTTP Payload Compression Enabled (${compressionHeader})`,
      description: 'The server transmits compressed text assets (Gzip or Brotli), minimizing network bandwidth.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: compressionHeader,
      expectedValue: 'br or gzip',
      recommendation: 'Prioritize Brotli (br) over Gzip where supported by clients.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'perf-compression-missing',
      category: 'performance',
      title: 'Missing Gzip or Brotli Response Compression',
      description: 'The server responded with uncompressed raw HTML. Compression typically reduces document payload by 65-80%.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      metric: 'Content-Encoding',
      currentValue: 'None (uncompressed)',
      expectedValue: 'br or gzip',
      recommendation: 'Enable Gzip or Brotli compression on your web server, reverse proxy, or CDN.',
      suggestedFix: {
        language: 'nginx',
        code: `gzip on;\ngzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;`,
        description: 'Enable Gzip compression in Nginx.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Render-blocking scripts in head
  if (renderBlockingScriptsCount > 0) {
    addFinding({
      id: 'perf-render-blocking-scripts',
      category: 'performance',
      title: `${renderBlockingScriptsCount} Render-Blocking Scripts in Document <head>`,
      description: 'Synchronous external scripts in the document head stop the HTML parser until they finish downloading and executing, delaying First Contentful Paint.',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'fail',
      currentValue: `${renderBlockingScriptsCount} blocking scripts`,
      expectedValue: '0',
      recommendation: 'Add "defer" or "async" attributes, or convert scripts to type="module".',
      suggestedFix: {
        language: 'html',
        code: '<script src="/bundle.js" defer></script>',
        description: 'Deferred script loading.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Missing image dimensions (CLS risk)
  if (imagesMissingDimensions > 0) {
    addFinding({
      id: 'perf-images-missing-dims',
      category: 'performance',
      title: `${imagesMissingDimensions} Images Lack Explicit width/height Attributes`,
      description: 'Images without explicit width and height cause Cumulative Layout Shift (CLS) as content jumps after images load.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${imagesMissingDimensions} unconstrained images`,
      expectedValue: '0',
      recommendation: 'Add explicit width and height attributes or CSS aspect-ratio to all <img> elements.',
      suggestedFix: {
        language: 'html',
        code: '<img src="photo.webp" width="640" height="360" style="aspect-ratio: 16/9; max-width: 100%; height: auto;">',
        description: 'Layout-shift immune responsive image.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // HTML document size
  if (htmlSizeKb > 250) {
    addFinding({
      id: 'perf-html-size-heavy',
      category: 'performance',
      title: `Heavy HTML Document Footprint (${htmlSizeKb} KB)`,
      description: 'HTML document exceeds 250 KB. Excessive inline SVGs, large data URLs, or bloated DOM trees hurt parsing time on mobile devices.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `${htmlSizeKb} KB`,
      expectedValue: '< 100 KB',
      recommendation: 'Move inline SVGs and base64 assets into external cached files and minify markup.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // CSS Animation Jank
  if (animationJankRisk === 'High') {
    addFinding({
      id: 'perf-anim-jank-high',
      category: 'code',
      title: `Animation Jank & Layout Thrashing Risk (${nonCompositedFound.join(', ')})`,
      description: `CSS transitions/animations directly modify expensive geometric layout properties (${nonCompositedFound.join(', ')}). This forces continuous CPU reflows and drops frame rates below 60fps on mobile.`,
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: nonCompositedFound.join(', '),
      expectedValue: 'GPU transform & opacity only',
      recommendation: 'Animate GPU-composited properties (transform: translate3d()/scale() and opacity). Avoid animating top, left, width, or height.',
      suggestedFix: {
        language: 'nginx',
        code: `/* Bad */\n.card { transition: all 0.3s; top: 0; }\n.card:hover { top: -8px; }\n\n/* Good (GPU Composited) */\n.card { transition: transform 0.3s ease; transform: translateY(0); }\n.card:hover { transform: translateY(-8px); }`,
        description: 'Replace geometric layout transition with hardware-accelerated transform.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // Prefers-reduced-motion
  if (!hasReducedMotion && keyframeMatches > 0) {
    addFinding({
      id: 'a11y-reduced-motion-missing',
      category: 'accessibility',
      title: 'Missing "prefers-reduced-motion" CSS Media Query',
      description: 'The site has CSS animations but lacks prefers-reduced-motion media queries, which can cause vestibular discomfort for sensitive users.',
      severity: 'low',
      impact: 'Low',
      confidence: 'verified',
      status: 'warn',
      currentValue: 'Missing',
      expectedValue: '@media (prefers-reduced-motion: reduce)',
      recommendation: 'Add @media (prefers-reduced-motion: reduce) to soften or disable intense motion loops.',
      suggestedFix: {
        language: 'html',
        code: `@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}`,
        description: 'Universal prefers-reduced-motion fallback.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // === JAVASCRIPT FINDINGS ===
  if (duplicateScripts.length > 0) {
    addFinding({
      id: 'js-duplicate-scripts',
      category: 'javascript',
      title: `${duplicateScripts.length} Duplicate Script Request(s) Detected`,
      description: 'The same JavaScript file is requested multiple times, wasting bandwidth and duplicate compilation cycles.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      affectedResource: duplicateScripts.slice(0, 3).join(', '),
      metric: 'Duplicate Scripts',
      currentValue: duplicateScripts.length,
      expectedValue: 0,
      evidence: duplicateScripts.slice(0, 3).join('\n'),
      recommendation: 'Remove duplicate <script> tags or consolidate bundle imports in your bundler configuration.',
      technicalExplanation: 'Duplicate script tags trigger redundant HTTP network fetches and re-execute global script side effects.',
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'js-no-duplicates',
      category: 'javascript',
      title: 'Zero Duplicate JavaScript Requests',
      description: 'All requested scripts have unique URLs.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: 0,
      expectedValue: 0,
      recommendation: 'Maintain deduplication in bundler configuration.',
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (largeBundlesDetected.length > 0) {
    addFinding({
      id: 'js-large-bundles',
      category: 'javascript',
      title: 'Heavy or Development JavaScript Bundles Detected',
      description: 'Development or unminified JavaScript bundles were identified in the document, which drastically increases execution cost.',
      severity: 'high',
      impact: 'High',
      confidence: 'heuristic',
      status: 'warn',
      affectedResource: largeBundlesDetected.join(', '),
      metric: 'Unminified / Heavy Bundles',
      currentValue: largeBundlesDetected.length,
      expectedValue: 0,
      evidence: largeBundlesDetected.join('\n'),
      recommendation: 'Ensure your production build pipeline minifies code and uses production builds (e.g. NODE_ENV=production).',
      technicalExplanation: 'Unminified libraries like React Development or unmodularized Moment.js add 300KB+ of unnecessary parse and eval time.',
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (legacyIndicatorsFound.length > 0) {
    addFinding({
      id: 'js-legacy-patterns',
      category: 'javascript',
      title: 'Legacy JavaScript Syntax & APIs Detected',
      description: 'Deprecated script attributes or legacy APIs were found in the HTML source.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'Legacy Script Practices',
      currentValue: legacyIndicatorsFound.join('; '),
      expectedValue: 'Clean HTML5 script tags',
      evidence: legacyIndicatorsFound.join('\n'),
      recommendation: 'Remove type="text/javascript", language attributes, and avoid document.write().',
      technicalExplanation: 'HTML5 defaults script tags to JavaScript; document.write() blocks HTML parsing and degrades performance.',
      suggestedFix: {
        language: 'html',
        code: '<script src="/bundle.js" defer></script>',
        description: 'Modern standard HTML5 script element with defer.'
      },
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (thirdPartyDomains.size > 5) {
    addFinding({
      id: 'js-excessive-third-party',
      category: 'javascript',
      title: `Excessive Third-Party Origins Detected (${thirdPartyDomains.size} domains)`,
      description: 'The page communicates with more than 5 distinct external domains, increasing DNS lookups, TLS negotiations, and third-party risk.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'Third-Party Origins',
      currentValue: thirdPartyDomains.size,
      expectedValue: '<= 5',
      evidence: Array.from(thirdPartyDomains).slice(0, 6).join(', '),
      recommendation: 'Audit third-party tags and self-host essential assets like fonts and analytics proxies where possible.',
      technicalExplanation: 'Each third-party origin introduces connection latency (DNS + TCP + TLS handshake ~100-300ms) and privacy exposure.',
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  // === IMAGE FINDINGS ===
  if (lazyLoadedLcpDetected) {
    addFinding({
      id: 'img-lcp-lazy-antipattern',
      category: 'images',
      title: 'Hero / LCP Candidate Image Lazy-Loaded Anti-Pattern',
      description: 'The primary above-the-fold image has loading="lazy". This delays image discovery and noticeably hurts Largest Contentful Paint (LCP).',
      severity: 'high',
      impact: 'High',
      confidence: 'verified',
      status: 'warn',
      affectedResource: lcpImageCandidate,
      metric: 'Hero Image Loading Strategy',
      currentValue: 'loading="lazy" on initial image',
      expectedValue: 'fetchpriority="high" without loading="lazy"',
      evidence: `Initial image in document: ${lcpImageCandidate}`,
      recommendation: 'Remove loading="lazy" from your hero banner and add fetchpriority="high" to prioritize critical rendering.',
      technicalExplanation: 'When the browser encounters loading="lazy" on an above-the-fold image, it defers fetching until the layout phase completes, adding hundreds of milliseconds to LCP.',
      suggestedFix: {
        language: 'html',
        code: `<img src="${lcpImageCandidate || '/hero.jpg'}" alt="Hero" fetchpriority="high" width="1200" height="630">`,
        description: 'Optimized Hero image with fetchpriority="high" and explicit dimensions.'
      },
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (missingLazyBelowFoldCount > 0) {
    addFinding({
      id: 'img-below-fold-lazy',
      category: 'images',
      title: `${missingLazyBelowFoldCount} Below-the-Fold Image(s) Missing Lazy-Loading`,
      description: 'Non-critical images lack loading="lazy", forcing the browser to download all assets simultaneously on initial page load.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'Lazy Loading Coverage',
      currentValue: `${missingLazyBelowFoldCount} unlazy images`,
      expectedValue: 'All below-the-fold images lazy-loaded',
      recommendation: 'Add loading="lazy" and decoding="async" to all images below the initial viewport.',
      technicalExplanation: 'Native lazy loading delays offscreen image requests until the user scrolls near them, reducing initial payload and data usage.',
      suggestedFix: {
        language: 'html',
        code: '<img src="/product.jpg" alt="Product" loading="lazy" decoding="async" width="400" height="300">',
        description: 'Native lazy-loaded image tag.'
      },
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (missingAspectRatiosCount > 0) {
    addFinding({
      id: 'img-missing-aspect-ratio',
      category: 'images',
      title: `${missingAspectRatiosCount} Image(s) Missing Explicit Dimensions / Aspect-Ratio`,
      description: 'Images without declared width and height or CSS aspect-ratio cause Cumulative Layout Shifts (CLS) as they load.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'Image Dimension Declaration',
      currentValue: `${missingAspectRatiosCount} images without dimensions`,
      expectedValue: 'All images with width/height attributes',
      recommendation: 'Declare width and height attributes on all <img> elements to allow the browser to reserve layout space.',
      technicalExplanation: 'Modern browsers calculate aspect ratio from width and height HTML attributes before images download, preventing content jumping.',
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (legacyFormatCount > 0) {
    addFinding({
      id: 'img-modern-formats',
      category: 'images',
      title: `${legacyFormatCount} Legacy Image(s) (PNG/JPEG) Could Use WebP/AVIF`,
      description: 'Legacy PNG and JPEG formats are being served instead of next-generation formats like AVIF or WebP.',
      severity: 'low',
      impact: 'Low',
      confidence: 'verified',
      status: 'warn',
      metric: 'Next-Gen Image Formats',
      currentValue: `${legacyFormatCount} legacy format images`,
      expectedValue: 'AVIF or WebP',
      recommendation: 'Convert images to WebP or AVIF to achieve 30-50% size reduction with identical visual quality.',
      technicalExplanation: 'AVIF and WebP offer superior lossy and lossless compression over JPEG and PNG, dramatically reducing byte weight.',
      suggestedFix: {
        language: 'html',
        code: '<picture>\n  <source srcset="/img.avif" type="image/avif">\n  <source srcset="/img.webp" type="image/webp">\n  <img src="/img.jpg" alt="Descriptive alt" width="800" height="600" loading="lazy">\n</picture>',
        description: 'HTML picture element serving AVIF/WebP with JPEG fallback.'
      },
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  // === FONT FINDINGS ===
  if (fontCount > 0 && !hasFontDisplaySwap) {
    addFinding({
      id: 'font-missing-display-swap',
      category: 'fonts',
      title: 'Missing "font-display: swap" on Web Fonts',
      description: 'Web fonts do not explicitly declare font-display: swap, which can cause Flash of Invisible Text (FOIT) while fonts download.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'font-display Strategy',
      currentValue: 'Missing or default (block)',
      expectedValue: 'font-display: swap',
      recommendation: 'Append &display=swap to Google Fonts links or add font-display: swap inside your @font-face declarations.',
      technicalExplanation: 'font-display: swap instructs the browser to render text immediately using a fallback system font until the custom font finishes downloading.',
      suggestedFix: {
        language: 'html',
        code: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">',
        description: 'Google Fonts URL with display=swap parameter.'
      },
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (externalFontProviders.includes('Google Fonts') && !hasPreconnect) {
    addFinding({
      id: 'font-missing-preconnect',
      category: 'fonts',
      title: 'Missing Preconnect for Google Fonts',
      description: 'Google Fonts are loaded without <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>, adding extra connection latency.',
      severity: 'low',
      impact: 'Low',
      confidence: 'verified',
      status: 'warn',
      metric: 'Font Preconnect',
      currentValue: 'No preconnect found',
      expectedValue: 'Preconnect to fonts.gstatic.com',
      recommendation: 'Add preconnect resource hints in the <head> before loading Google Fonts.',
      suggestedFix: {
        language: 'html',
        code: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        description: 'Preconnect hints for Google Fonts origin and CDN.'
      },
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (legacyFontFormats.length > 0) {
    addFinding({
      id: 'font-legacy-formats',
      category: 'fonts',
      title: `Legacy Font Formats (${legacyFontFormats.join(', ')}) Detected`,
      description: 'Legacy font formats (.ttf, .otf, or .eot) were detected. Modern web standards exclusively recommend .woff2.',
      severity: 'low',
      impact: 'Low',
      confidence: 'verified',
      status: 'warn',
      metric: 'Web Font Format',
      currentValue: legacyFontFormats.join(', '),
      expectedValue: 'WOFF2',
      recommendation: 'Convert web fonts to WOFF2 using modern compression tools (e.g. woff2_compress).',
      technicalExplanation: 'WOFF2 utilizes Brotli compression internally, yielding ~30% smaller files than TTF or WOFF1 with 97%+ browser support.',
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  // === NETWORK FINDINGS ===
  const redirectHops = targetUrl !== finalUrl ? 1 : 0;
  const redirectChain = targetUrl !== finalUrl ? [targetUrl, finalUrl] : [targetUrl];
  const cacheControlValue = headers.get('cache-control');
  const etagValue = headers.get('etag');
  const expiresValue = headers.get('expires');
  const cacheHeadersFound = {
    hasCacheControl: !!cacheControlValue,
    cacheControlValue,
    hasEtag: !!etagValue,
    hasExpires: !!expiresValue
  };
  const slowResources = internalPages.filter(p => p.responseTimeMs > 1500).map(p => `${p.path} (${p.responseTimeMs}ms)`);
  const failedResources = internalPages.filter(p => !p.ok).map(p => `${p.path} (HTTP ${p.status || 'Timeout'})`);
  const duplicateResources = Array.from(new Set([...duplicateScripts, ...duplicateImages, ...duplicateFontRequests, ...duplicateStyles]));

  // Weights calculation
  const estimatedJsSizeKb = Math.round((externalScriptCount * 38) + (inlineScriptTotalBytes / 1024));
  const estimatedCssSizeKb = Math.round((stylesheetCount * 28) + (combinedStyles.length / 1024));
  const estimatedImageSizeKb = Math.round(totalImages * 48);
  const estimatedFontSizeKb = Math.round(fontCount * 32);
  const estimatedTotalWeightKb = Math.round((htmlSizeKb + estimatedJsSizeKb + estimatedCssSizeKb + estimatedImageSizeKb + estimatedFontSizeKb) * 10) / 10;
  const requestCount = externalScriptCount + stylesheetCount + totalImages + fontCount + 1;
  const thirdPartyRequestCount = detectedResources.filter(r => r.isThirdParty).length;

  if (!cacheHeadersFound.hasCacheControl) {
    addFinding({
      id: 'net-missing-cache-control',
      category: 'network',
      title: 'Missing Cache-Control Header on Main Document',
      description: 'The server did not send an explicit Cache-Control response header, leaving browser caching behavior undefined.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      metric: 'Cache-Control Header',
      currentValue: 'Not set',
      expectedValue: 'Cache-Control: public, max-age=...',
      recommendation: 'Configure your origin server or CDN to send an appropriate Cache-Control header.',
      technicalExplanation: 'Explicit caching directives ensure repeat visitors don\'t make redundant roundtrips for unchanged content.',
      suggestedFix: {
        language: 'nginx',
        code: 'location / {\n  add_header Cache-Control "no-cache, must-revalidate";\n}\nlocation ~* \\.(css|js|woff2|png|jpg)$ {\n  add_header Cache-Control "public, max-age=31536000, immutable";\n}',
        description: 'Nginx caching directives for HTML document vs immutable static assets.'
      },
      checkType: 'server',
      availabilityStatus: 'available'
    });
  } else {
    addFinding({
      id: 'net-cache-control-pass',
      category: 'network',
      title: 'Cache-Control Header Configured',
      description: 'The server returns an explicit Cache-Control header directive.',
      severity: 'passed',
      impact: 'None',
      confidence: 'verified',
      status: 'pass',
      currentValue: cacheControlValue,
      expectedValue: 'Configured',
      recommendation: 'Ensure static hashed assets use immutable max-age=31536000.',
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  // === CORE WEB VITALS & RUNTIME NOT AVAILABLE FINDINGS ===
  addFinding({
    id: 'perf-cwv-lab-not-available',
    category: 'performance',
    title: 'Core Web Vitals Synthetic Lab Simulation (FCP, LCP, CLS, INP)',
    description: 'Core Web Vitals synthetic paint timings require either a live headless Chromium runner or Google PageSpeed Insights API.',
    severity: 'not_available',
    impact: 'None',
    confidence: 'verified',
    status: 'not_available',
    metric: 'Core Web Vitals Lab',
    currentValue: pageSpeedApiKey ? 'PageSpeed Insights Active' : 'Not Configured',
    expectedValue: 'Chrome UX Report / Headless Chromium Execution',
    evidence: pageSpeedApiKey ? 'Connected via official Google PageSpeed API' : 'PAGESPEED_API_KEY environment secret is not configured in server.',
    technicalExplanation: 'LCP, CLS, and INP metrics represent synthetic or real-user browser layout paint cycles that require a headless Chromium browser or Google PageSpeed Insights API. In strict adherence to zero-fabrication standards, these metrics are marked Not Available.',
    recommendation: 'Configure PAGESPEED_API_KEY in server environment to enable lab simulation, or inspect Chrome DevTools Performance panel directly.',
    verificationMethod: 'Google PageSpeed Insights API v5 / Chrome Performance Profiler',
    checkType: 'api',
    availabilityStatus: 'requires_server'
  });

  addFinding({
    id: 'perf-inp-long-tasks-not-available',
    category: 'performance',
    title: 'Interaction to Next Paint (INP) & Main Thread Long Tasks',
    description: 'INP and Long Tasks require active user interactions (clicks, taps, keypresses) on a live browser DOM.',
    severity: 'not_available',
    impact: 'None',
    confidence: 'verified',
    status: 'not_available',
    metric: 'Interaction to Next Paint',
    currentValue: 'Not Available',
    expectedValue: '< 200ms',
    evidence: 'Static HTTP response cannot measure JavaScript event loop duration during active user interaction.',
    technicalExplanation: 'INP and Long Tasks require browser PerformanceObserver runtime listening to layout/paint cycles during user engagement.',
    recommendation: 'Integrate the npm web-vitals package into your client bundle to stream INP telemetry to analytics.',
    verificationMethod: 'PerformanceObserver API (Browser Runtime)',
    checkType: 'browser',
    availabilityStatus: 'requires_server'
  });

  // Screen reader conformance info
  addFinding({
    id: 'a11y-screen-reader-conformance',
    category: 'accessibility',
    title: 'Manual Screen Reader & Assistive Technology Conformance',
    description: 'Automated static scanning covers approximately 35-40% of WCAG criteria. Full legal and functional accessibility mandates manual testing.',
    severity: 'info',
    impact: 'Moderate',
    confidence: 'verified',
    status: 'info',
    metric: 'WCAG 2.1 AA Conformance',
    currentValue: 'Automated Scan Active',
    expectedValue: 'Manual Screen Reader Verification',
    evidence: 'Static regex and DOM parsing cannot test synthetic speech output or interactive keyboard focus flow.',
    technicalExplanation: 'Screen readers (NVDA, JAWS, VoiceOver) must be manually tested to ensure meaningful spoken UX and correct reading order.',
    recommendation: 'Conduct manual tab navigation testing and verify interactive flows with VoiceOver or NVDA.',
    verificationMethod: 'Manual Assistive Technology Conformance',
    checkType: 'browser',
    availabilityStatus: 'available'
  });

  // Capabilities Documentation
  const capabilitiesDoc: ExecutionCapability[] = [
    {
      id: 'cap-server-http',
      name: 'Server-Side HTTP & Security Header Scanner',
      category: 'Security & Network',
      environment: 'server',
      status: 'active',
      description: 'Direct server-side network probe analyzing TLS, status codes, HSTS, CSP, and CORS.',
      technicalDetails: 'Executes via Node.js fetch with strict SSRF filtering, TLS negotiation verification, and redirect inspection.'
    },
    {
      id: 'cap-static-dom',
      name: 'Static DOM & Accessibility Rules Engine',
      category: 'SEO & Accessibility',
      environment: 'server',
      status: 'active',
      description: 'Extracts headings, metadata, images, landmarks, form labels, and ARIA markup from raw HTML.',
      technicalDetails: 'Pattern matches structural HTML5 grammar, WCAG 2.1 level A/AA element attributes, and structured JSON-LD.'
    },
    {
      id: 'cap-subpage-crawler',
      name: 'Internal Subpage Health & Robots.txt Prober',
      category: 'Technical SEO',
      environment: 'server',
      status: 'active',
      description: 'Recursively checks up to 6 internal routes, discovers sitemaps, and validates crawl directives.',
      technicalDetails: 'Probes /robots.txt and /sitemap.xml, detects broken internal links and subpage performance variance.'
    },
    {
      id: 'cap-cwv-lab',
      name: 'Core Web Vitals Synthetic Lab Simulation',
      category: 'Performance',
      environment: 'pagespeed_api',
      status: pageSpeedApiKey ? 'active' : 'requires_api_key',
      description: 'Measures FCP, LCP, CLS, INP, and Speed Index via Google PageSpeed Insights API.',
      technicalDetails: pageSpeedApiKey ? 'Connected to Google PageSpeed Insights v5 API.' : 'Requires PAGESPEED_API_KEY environment variable. Truthfully marked Not Available rather than simulated.'
    },
    {
      id: 'cap-browser-contrast',
      name: 'Dynamic Canvas Color Contrast & Visual Layout Shifts',
      category: 'Accessibility & UX',
      environment: 'browser',
      status: 'not_supported',
      description: 'Pixel-level contrast analysis of text over images or dynamic CSS backgrounds.',
      technicalDetails: 'Requires browser runtime canvas rendering engine; static analysis inspects declared CSS styles and issues guidance.'
    },
    {
      id: 'cap-screen-reader',
      name: 'Assistive Technology Screen Reader Conformance',
      category: 'Accessibility',
      environment: 'unavailable',
      status: 'not_supported',
      description: 'Full manual accessibility audit with NVDA, JAWS, or VoiceOver.',
      technicalDetails: 'Automated audits evaluate ~35-40% of WCAG criteria. Manual verification is essential for full legal compliance.'
    }
  ];

  // 16. Calculate Category & Overall Transparent Scores
  function calculateScore(categoryFindings: AuditFinding[]): number {
    const scoredFindings = categoryFindings.filter(f => f.status !== 'not_available' && f.status !== 'info');
    if (scoredFindings.length === 0) return 100;
    let score = 100;
    for (const f of scoredFindings) {
      if (f.status === 'fail') {
        if (f.severity === 'critical') score -= 28;
        else if (f.severity === 'high') score -= 18;
        else if (f.severity === 'medium') score -= 10;
        else if (f.severity === 'low') score -= 5;
      } else if (f.status === 'warn') {
        if (f.severity === 'critical') score -= 15;
        else if (f.severity === 'high') score -= 10;
        else if (f.severity === 'medium') score -= 6;
        else if (f.severity === 'low') score -= 3;
      }
    }
    return Math.max(10, Math.min(100, Math.round(score)));
  }

  const securityFindings = findings.filter(f => f.category === 'security');
  const seoFindings = findings.filter(f => f.category === 'seo');
  const perfFindings = findings.filter(f => f.category === 'performance');
  const a11yFindings = findings.filter(f => f.category === 'accessibility');
  const codeFindings = findings.filter(f => f.category === 'code');
  const jsFindings = findings.filter(f => f.category === 'javascript');
  const imgFindings = findings.filter(f => f.category === 'images');
  const fontFindings = findings.filter(f => f.category === 'fonts');
  const netFindings = findings.filter(f => f.category === 'network');

  const securityScore = calculateScore(securityFindings);
  const seoScore = calculateScore(seoFindings);
  const performanceScore = calculateScore([...perfFindings, ...jsFindings, ...netFindings]);
  const accessibilityScore = calculateScore(a11yFindings);
  const codeScore = calculateScore([...codeFindings, ...imgFindings, ...fontFindings]);

  const overallScore = Math.round(
    (securityScore * 0.30) +
    (seoScore * 0.25) +
    (performanceScore * 0.20) +
    (accessibilityScore * 0.15) +
    (codeScore * 0.10)
  );

  // Category statistics
  function getCategoryStats(cat: AuditCategory) {
    const list = findings.filter(f => f.category === cat);
    const catScore = cat === 'security' ? securityScore :
      cat === 'seo' ? seoScore :
      cat === 'performance' ? performanceScore :
      cat === 'accessibility' ? accessibilityScore :
      cat === 'javascript' ? calculateScore(jsFindings) :
      cat === 'images' ? calculateScore(imgFindings) :
      cat === 'fonts' ? calculateScore(fontFindings) :
      cat === 'network' ? calculateScore(netFindings) :
      codeScore;

    return {
      score: catScore,
      critical: list.filter(f => f.severity === 'critical' && f.status !== 'pass').length,
      warning: list.filter(f => (f.severity === 'high' || f.severity === 'medium' || f.severity === 'low') && f.status !== 'pass' && f.status !== 'not_available' && f.status !== 'info').length,
      passed: list.filter(f => f.status === 'pass').length,
      notAvailable: list.filter(f => f.status === 'not_available' || f.status === 'info').length
    };
  }

  const categoryStats = {
    security: getCategoryStats('security'),
    seo: getCategoryStats('seo'),
    performance: getCategoryStats('performance'),
    accessibility: getCategoryStats('accessibility'),
    code: getCategoryStats('code'),
    network: getCategoryStats('network'),
    javascript: getCategoryStats('javascript'),
    images: getCategoryStats('images'),
    fonts: getCategoryStats('fonts')
  };

  // Convert to backward-compatible issue format
  const criticalIssues = findings
    .filter(f => (f.severity === 'critical' || f.severity === 'high') && f.status === 'fail')
    .map(f => ({
      category: (f.category === 'accessibility' ? 'code' : f.category === 'network' ? 'performance' : f.category) as 'security' | 'seo' | 'code' | 'performance',
      severity: 'critical' as const,
      title: f.title,
      description: f.description,
      recommendation: f.recommendation,
      suggestedFix: f.suggestedFix
    }));

  const warningIssues = findings
    .filter(f => f.status === 'warn' || (f.status === 'fail' && f.severity === 'medium'))
    .map(f => ({
      category: (f.category === 'accessibility' ? 'code' : f.category === 'network' ? 'performance' : f.category) as 'security' | 'seo' | 'code' | 'performance',
      severity: 'warning' as const,
      title: f.title,
      description: f.description,
      recommendation: f.recommendation,
      suggestedFix: f.suggestedFix
    }));

  const passedIssues = findings
    .filter(f => f.status === 'pass')
    .map(f => ({
      category: (f.category === 'accessibility' ? 'code' : f.category === 'network' ? 'performance' : f.category) as 'security' | 'seo' | 'code' | 'performance',
      severity: 'passed' as const,
      title: f.title,
      description: f.description,
      recommendation: f.recommendation
    }));

  const scanDurationMs = Date.now() - scanStartTime;

  return {
    success: true,
    reachable: true,
    url: targetUrl,
    finalUrl,
    hostname: initialHostname,
    statusCode,
    responseTimeMs,
    analyzedAt: nowIso,
    scanDurationMs,
    checkMode: 'full_server',
    scores: {
      overall: overallScore,
      performance: performanceScore,
      security: securityScore,
      seo: seoScore,
      accessibility: accessibilityScore,
      code: codeScore
    },
    categoryStats,
    performanceData: {
      ttfbMs: responseTimeMs,
      htmlSizeKb,
      estimatedTotalWeightKb,
      estimatedCssSizeKb,
      estimatedJsSizeKb,
      estimatedImageSizeKb,
      estimatedFontSizeKb,
      requestCount,
      thirdPartyRequestCount,
      compression: compressionHeader,
      isCompressed: !!compressionHeader,
      renderBlockingResourcesCount: renderBlockingScriptsCount,
      totalScriptCount: allScripts.length,
      inlineScriptCount,
      externalScriptCount,
      stylesheetCount,
      imageCount: totalImages,
      fontCount,
      domNodeCount,
      domMaxDepth,
      domContentLoadedStatus: 'Client runtime metric (active in browser tab execution)',
      loadTimeStatus: 'Client runtime metric (active in browser tab execution)',
      longTasksStatus: 'Not Available without browser PerformanceObserver runtime',
      layoutShiftsStatus: 'Not Available without browser PerformanceObserver runtime',
      coreWebVitals,
      mobile: mobilePerf,
      desktop: desktopPerf,
      activeStrategy: 'mobile'
    },
    javascriptData: {
      totalScripts: allScripts.length,
      externalScripts: externalScriptCount,
      inlineScripts: inlineScriptCount,
      renderBlockingScripts: renderBlockingScriptsCount,
      asyncScripts: asyncScriptsCount,
      deferScripts: deferScriptsCount,
      moduleScripts: moduleScriptsCount,
      thirdPartyScripts: detectedResources.filter(r => r.type === 'script' && r.isThirdParty).length,
      duplicateScripts,
      largeBundlesDetected,
      legacyIndicatorsFound,
      inlineScriptTotalBytes,
      excessiveThirdParty: thirdPartyDomains.size > 5
    },
    imageData: {
      totalImages,
      missingAltCount: imagesWithoutAltCount,
      missingDimensionsCount: imagesMissingDimensions,
      missingAspectRatiosCount,
      lazyLoadedLcpDetected,
      lcpImageCandidate,
      missingLazyBelowFoldCount,
      missingSrcsetCount,
      legacyFormatCount,
      webpAvifOpportunities: legacyFormatCount,
      duplicateImages,
      brokenImageCandidates,
      samples: imageSamples
    },
    fontData: {
      totalFonts: fontCount,
      fontFamilies,
      externalFontProviders,
      hasFontDisplaySwap,
      renderBlockingFontsCount,
      hasPreconnect,
      duplicateFontRequests,
      legacyFontFormats
    },
    networkData: {
      resources: detectedResources,
      firstPartyDomains: Array.from(firstPartyDomains),
      thirdPartyDomains: Array.from(thirdPartyDomains),
      totalDetectedAssets: detectedResources.length,
      knownTrackersDetected: Array.from(knownTrackersFound),
      redirectHops,
      redirectChain,
      cacheHeadersFound,
      contentEncoding: compressionHeader,
      failedResources,
      slowResources,
      duplicateResources
    },
    capabilitiesDoc,
    seoData: {
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      canonicalUrl,
      isCanonicalMatching,
      robotsMeta,
      xRobotsHeader,
      robotsTxtStatus,
      sitemapStatus,
      headings: {
        h1List,
        h2Count,
        h3Count,
        totalHeadings: headingsFound.length,
        isHierarchyValid,
        hierarchyIssues
      },
      openGraph: {
        hasOgTitle: !!ogTitleMatch,
        ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
        hasOgDescription: !!ogDescMatch,
        ogDescription: ogDescMatch ? ogDescMatch[1] : null,
        hasOgImage: !!ogImageMatch,
        ogImage: ogImageMatch ? ogImageMatch[1] : null,
        twitterCard: twitterCardMatch ? twitterCardMatch[1] : null
      },
      schemaJsonLd: {
        count: schemaItems.length,
        items: schemaItems,
        detectedTypes: Array.from(detectedSchemaTypes)
      },
      langAttribute: htmlLang,
      aeoData,
      geoData
    },
    aeoData,
    geoData,
    accessibilityData: {
      hasHtmlLang: !!htmlLang,
      htmlLang,
      hasViewport,
      isZoomLocked,
      imagesTotal: totalImages,
      imagesWithoutAltCount,
      missingAltSamples,
      emptyButtonsCount,
      emptyButtonSamples,
      emptyLinksCount,
      emptyLinkSamples,
      formInputsWithoutLabelCount,
      hasMainLandmark,
      hasNavLandmark,
      hasHeaderLandmark,
      hasFooterLandmark,
      hasSkipLink,
      hasReducedMotionQuery: hasReducedMotion
    },
    securityData: {
      isHttps,
      hsts: {
        name: 'Strict-Transport-Security',
        present: !!hstsHeader,
        value: hstsHeader,
        status: hstsHeader ? 'pass' : 'fail',
        description: 'Forces modern browsers to only connect over HTTPS.',
        recommendedHeader: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload'
      },
      csp: {
        name: 'Content-Security-Policy',
        present: !!cspHeader,
        value: cspHeader,
        status: cspHeader ? 'pass' : 'fail',
        description: 'Restricts script, stylesheet, and media origin vectors.',
        recommendedHeader: "Content-Security-Policy: default-src 'self'; script-src 'self' https:;"
      },
      xFrameOptions: {
        name: 'X-Frame-Options',
        present: !!xFrameHeader,
        value: xFrameHeader,
        status: xFrameHeader ? 'pass' : 'warn',
        description: 'Defends against Clickjacking framing.',
        recommendedHeader: 'X-Frame-Options: SAMEORIGIN'
      },
      xContentTypeOptions: {
        name: 'X-Content-Type-Options',
        present: !!xContentTypeHeader,
        value: xContentTypeHeader,
        status: xContentTypeHeader ? 'pass' : 'warn',
        description: 'Disables MIME type sniffing.',
        recommendedHeader: 'X-Content-Type-Options: nosniff'
      },
      referrerPolicy: {
        name: 'Referrer-Policy',
        present: !!referrerPolicyHeader,
        value: referrerPolicyHeader,
        status: referrerPolicyHeader ? 'pass' : 'warn',
        description: 'Controls referrer data passed on outgoing links.',
        recommendedHeader: 'Referrer-Policy: strict-origin-when-cross-origin'
      },
      permissionsPolicy: {
        name: 'Permissions-Policy',
        present: !!permissionsPolicyHeader,
        value: permissionsPolicyHeader,
        status: permissionsPolicyHeader ? 'pass' : 'warn',
        description: 'Restricts browser hardware features (camera, microphone, geolocation).',
        recommendedHeader: 'Permissions-Policy: camera=(), microphone=(), geolocation=()'
      },
      serverHeader,
      exposesServerVersion,
      mixedContentCount,
      mixedContentSamples,
      unsafeBlankLinksCount,
      inlineEventHandlersCount,
      deprecatedTagsFound
    },
    internalPages,
    keywords: {
      topKeywords,
      missingKeywords
    },
    findings,
    issues: {
      critical: criticalIssues,
      warning: warningIssues,
      passed: passedIssues
    },
    meta: {
      title,
      metaDescription,
      canonicalUrl: canonicalUrl || targetUrl,
      robotsContent: robotsMeta || 'index, follow',
      ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
      ogDescription: ogDescMatch ? ogDescMatch[1] : null,
      ogImage: ogImageMatch ? ogImageMatch[1] : null,
      twitterCard: twitterCardMatch ? twitterCardMatch[1] : null,
      h1List,
      h2Count,
      h3Count,
      totalImages,
      imagesWithoutAltCount,
      missingAltImages: missingAltSamples.map(s => s.src),
      scriptTags: allScripts.length,
      stylesheetTags: stylesheetCount,
      htmlSizeKb,
      isHttps,
      hasDoctype,
      hasViewport,
      isZoomLocked,
      hasCharset
    },
    animationAnalysis: {
      keyframeMatches,
      transitionAllCount,
      nonCompositedFound,
      hasReducedMotion,
      animationJankRisk,
      detectedAnimationLibraries
    },
    deepHealth: {
      mixedContentCount,
      renderBlockingScriptsCount,
      hasJsonLd: schemaItems.length > 0,
      hasHtmlLang: !!htmlLang,
      imagesMissingDimensions
    }
  };
}
