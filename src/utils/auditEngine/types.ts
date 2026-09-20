/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - Professional Website Health, Security & Performance Audit Engine
 * Type Definitions & Modular Architecture Interfaces
 */

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'passed' | 'info' | 'not_available' | 'warning';
export type AuditSeverity = SeverityLevel;

export type AuditCategory = 'performance' | 'security' | 'seo' | 'accessibility' | 'code' | 'network' | 'javascript' | 'images' | 'fonts';

export type CheckType = 'server' | 'browser' | 'static-rule' | 'api';

export type AvailabilityStatus = 'available' | 'not_available' | 'requires_server' | 'blocked_by_cors' | 'rate_limited';

export interface AuditFinding {
  id: string;
  category: AuditCategory;
  title: string;
  description: string;
  severity: SeverityLevel;
  impact: 'Critical' | 'High' | 'Moderate' | 'Low' | 'None' | string;
  confidence: 'verified' | 'heuristic' | 'inferred';
  status: 'fail' | 'warn' | 'pass' | 'not_available' | 'info';
  affectedUrl?: string;
  affectedResource?: string;
  fileOrSelector?: string;
  metric?: string;
  currentValue?: string | number | boolean | null;
  expectedValue?: string | number | boolean | null;
  evidence?: string;
  recommendation: string;
  technicalExplanation?: string;
  verificationMethod?: string;
  fixSnippet?: string;
  suggestedFix?: {
    language: 'html' | 'nginx' | 'apache' | 'javascript' | 'typescript' | 'json' | 'plaintext';
    code: string;
    description: string;
  };
  documentationUrl?: string;
  detectedAt: string;
  checkType: CheckType;
  availabilityStatus: AvailabilityStatus;
}

export interface ResourceItem {
  url: string;
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'media' | 'document' | 'other';
  status?: number;
  domain: string;
  isThirdParty: boolean;
  isRenderBlocking: boolean;
  sizeBytes?: number;
  sizeFormatted?: string;
  compression?: string | null;
  hasCacheControl?: boolean;
  durationMs?: number;
  issues?: string[];
}

export interface HeadingItem {
  level: number;
  text: string;
  length: number;
}

export interface SchemaJsonLdItem {
  raw: string;
  type?: string;
  name?: string;
  isValidJson: boolean;
  parseError?: string;
}

export type AuditCheckStatus = 'PASS' | 'WARNING' | 'FAIL' | 'NOT AVAILABLE';

export interface AuditEvaluationCheck {
  name: string;
  category: 'AEO' | 'GEO' | 'SEO';
  status: AuditCheckStatus;
  evidence: string;
  description: string;
  recommendation?: string;
}

export interface AeoData {
  directAnswerReadability: 'optimal' | 'moderate' | 'low';
  hasFaqSchema: boolean;
  hasQaSchema: boolean;
  hasDefinitionBlocks: boolean;
  definitionBlocksCount: number;
  listAndTableCount: number;
  hasTableOrListStructure: boolean;
  entityClarityScore: number;
  detectedEntities: string[];
  voiceSearchReadiness: 'High' | 'Medium' | 'Low';
  checks: AuditEvaluationCheck[];
  recommendations: string[];
}

export interface GeoData {
  aiBotsStatus: {
    gptBot: 'allowed' | 'disallowed' | 'unrestricted';
    claudeBot: 'allowed' | 'disallowed' | 'unrestricted';
    perplexityBot: 'allowed' | 'disallowed' | 'unrestricted';
    googleExtended: 'allowed' | 'disallowed' | 'unrestricted';
    applebotExtended: 'allowed' | 'disallowed' | 'unrestricted';
  };
  factualCiteabilityScore: number;
  hasAuthorOrPublisherMeta: boolean;
  hasPublicationDates: boolean;
  semanticHtmlStructureRatio: number;
  cleanTextToHtmlRatio: number;
  clientRenderDependency: 'low' | 'moderate' | 'heavy';
  aiReadinessLevel: 'AI-Ready' | 'Partially Optimized' | 'Blocked / Non-Semantic';
  llmsTxtStatus: {
    checked: boolean;
    exists: boolean;
    isOptional: true;
    note: string;
  };
  googleExtendedAnalysis: {
    status: 'allowed' | 'disallowed' | 'unrestricted';
    explanation: string;
    affectsSearchRanking: false;
  };
  checks: AuditEvaluationCheck[];
  aiVisibilityDisclaimer: string;
  recommendations: string[];
}

export interface SecurityHeaderStatus {
  name: string;
  present: boolean;
  value: string | null;
  status: 'pass' | 'warn' | 'fail';
  description: string;
  recommendedHeader: string;
}

export interface DevicePerformanceData {
  device: 'mobile' | 'desktop';
  available: boolean;
  source: 'LAB' | 'FIELD — CrUX' | 'SERVER' | 'NOT_AVAILABLE';
  statusMessage: string;
  score?: number;
  fcp?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' | 'FIELD — CrUX' };
  lcp?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' | 'FIELD — CrUX' };
  cls?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' | 'FIELD — CrUX' };
  inp?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' | 'FIELD — CrUX' };
  tbt?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' };
  speedIndex?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' };
  navigationTtfb?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' | 'FIELD — CrUX' };
  interactive?: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor'; source: 'LAB' };
  mainThreadWorkMs?: number;
  mainThreadWorkBreakdown?: Array<{ category: string; durationMs: number }>;
  longTasks?: Array<{ durationMs: number; startTimeMs?: number; url?: string }>;
  networkWaterfall?: Array<{
    url: string;
    mimeType: string;
    resourceType: string;
    transferSizeBytes: number;
    resourceSizeBytes: number;
    startTimeMs: number;
    durationMs: number;
    status: number;
    isRenderBlocking: boolean;
    isThirdParty: boolean;
    priority?: string;
  }>;
  cruxFieldData?: {
    available: boolean;
    fcp?: { value: number; unit: string; category: string };
    lcp?: { value: number; unit: string; category: string };
    cls?: { value: number; unit: string; category: string };
    inp?: { value: number; unit: string; category: string };
    ttfb?: { value: number; unit: string; category: string };
  };
}

export interface CoreWebVitalsData {
  available: boolean;
  source: 'pagespeed_api' | 'field_crux' | 'browser_observer' | 'unconfigured';
  message: string;
  fcp?: { value: number; unit: 'ms' | 's'; rating: 'good' | 'needs_improvement' | 'poor' };
  lcp?: { value: number; unit: 'ms' | 's'; rating: 'good' | 'needs_improvement' | 'poor' };
  cls?: { value: number; unit: ''; rating: 'good' | 'needs_improvement' | 'poor' };
  inp?: { value: number; unit: 'ms'; rating: 'good' | 'needs_improvement' | 'poor' };
  tbt?: { value: number; unit: 'ms'; rating: 'good' | 'needs_improvement' | 'poor' };
  speedIndex?: { value: number; unit: 's'; rating: 'good' | 'needs_improvement' | 'poor' };
}

export interface ScannedSubpageHealth {
  path: string;
  url: string;
  status: number;
  ok: boolean;
  responseTimeMs: number;
  title?: string;
  hasTitle?: boolean;
  hasMetaDescription?: boolean;
  h1Count?: number;
  h1Text?: string;
  totalImages?: number;
  imagesWithoutAltCount?: number;
  pageScore: number;
  pageGrade: 'Excellent' | 'Warning' | 'Critical';
  issues?: Array<{
    severity: 'critical' | 'warning' | 'passed';
    title: string;
    description: string;
  }>;
}

export interface ComprehensiveAuditReport {
  success: boolean;
  reachable: boolean;
  error?: string;
  url: string;
  finalUrl: string;
  hostname: string;
  ipAddress?: string;
  statusCode: number;
  responseTimeMs: number;
  analyzedAt: string;
  scanDurationMs: number;
  checkMode: 'full_server' | 'hybrid' | 'client_fallback';
  overallScore?: number;

  scores: {
    overall: number;
    performance: number;
    security: number;
    seo: number;
    accessibility: number;
    code: number;
  };

  categoryStats: Record<AuditCategory, {
    score: number;
    critical: number;
    warning: number;
    passed: number;
    notAvailable: number;
  }>;

  // Real performance telemetry
  performanceData: {
    ttfbMs: number;
    htmlSizeKb: number;
    estimatedTotalWeightKb: number;
    estimatedCssSizeKb: number;
    estimatedJsSizeKb: number;
    estimatedImageSizeKb: number;
    estimatedFontSizeKb: number;
    requestCount: number;
    thirdPartyRequestCount: number;
    compression: string | null;
    isCompressed: boolean;
    renderBlockingResourcesCount: number;
    totalScriptCount: number;
    inlineScriptCount: number;
    externalScriptCount: number;
    stylesheetCount: number;
    imageCount: number;
    fontCount: number;
    domNodeCount: number;
    domMaxDepth: number;
    domContentLoadedStatus: string;
    loadTimeStatus: string;
    longTasksStatus: string;
    layoutShiftsStatus: string;
    coreWebVitals: CoreWebVitalsData;
    mobile?: DevicePerformanceData;
    desktop?: DevicePerformanceData;
    activeStrategy?: 'mobile' | 'desktop';
  };

  // Dedicated JavaScript Analysis
  javascriptData: {
    totalScripts: number;
    externalScripts: number;
    inlineScripts: number;
    renderBlockingScripts: number;
    asyncScripts: number;
    deferScripts: number;
    moduleScripts: number;
    thirdPartyScripts: number;
    duplicateScripts: string[];
    largeBundlesDetected: string[];
    legacyIndicatorsFound: string[];
    inlineScriptTotalBytes: number;
    excessiveThirdParty: boolean;
  };

  // Dedicated Image Analysis
  imageData: {
    totalImages: number;
    missingAltCount: number;
    missingDimensionsCount: number;
    missingAspectRatiosCount: number;
    lazyLoadedLcpDetected: boolean;
    lcpImageCandidate?: string;
    missingLazyBelowFoldCount: number;
    missingSrcsetCount: number;
    legacyFormatCount: number;
    webpAvifOpportunities: number;
    duplicateImages: string[];
    brokenImageCandidates: string[];
    samples: Array<{
      src: string;
      hasAlt: boolean;
      hasDimensions: boolean;
      isLazy: boolean;
      format: string;
    }>;
  };

  // Dedicated Font Analysis
  fontData: {
    totalFonts: number;
    fontFamilies: string[];
    externalFontProviders: string[];
    hasFontDisplaySwap: boolean;
    renderBlockingFontsCount: number;
    hasPreconnect: boolean;
    duplicateFontRequests: string[];
    legacyFontFormats: string[];
  };

  // Resources breakdown
  networkData: {
    resources: ResourceItem[];
    firstPartyDomains: string[];
    thirdPartyDomains: string[];
    totalDetectedAssets: number;
    knownTrackersDetected: string[];
    redirectHops: number;
    redirectChain: string[];
    cacheHeadersFound: {
      hasCacheControl: boolean;
      cacheControlValue: string | null;
      hasEtag: boolean;
      hasExpires: boolean;
    };
    contentEncoding: string | null;
    failedResources: string[];
    slowResources: string[];
    duplicateResources: string[];
  };

  // SEO & Structure
  seoData: {
    title: string;
    titleLength: number;
    metaDescription: string;
    metaDescriptionLength: number;
    canonicalUrl: string | null;
    isCanonicalMatching: boolean;
    robotsMeta: string | null;
    xRobotsHeader: string | null;
    robotsTxtStatus: {
      checked: boolean;
      exists: boolean;
      status: number;
      allowsCrawl: boolean;
      sitemapUrlsFound: string[];
      userAgentGroups?: Array<{ userAgent: string; allowsCrawl: boolean; disallowRules: string[]; allowRules: string[] }>;
      rulesSummary?: string;
    };
    sitemapStatus: {
      checked: boolean;
      exists: boolean;
      status: number;
      urlCountEstimate: number;
      sitemapUrl?: string;
      sampleUrls?: string[];
      mismatchedUrls?: string[];
      unreachableUrls?: string[];
      sitemapMissingUrls?: string[];
      orphanedInternalLinks?: string[];
      format?: 'xml' | 'gzip' | 'sitemap_index' | 'none';
      isSitemapIndex?: boolean;
      childSitemapsFound?: string[];
      statusMessage?: string;
    };
    headings: {
      h1List: string[];
      h2Count: number;
      h3Count: number;
      totalHeadings: number;
      isHierarchyValid: boolean;
      hierarchyIssues: string[];
    };
    openGraph: {
      hasOgTitle: boolean;
      ogTitle: string | null;
      hasOgDescription: boolean;
      ogDescription: string | null;
      hasOgImage: boolean;
      ogImage: string | null;
      twitterCard: string | null;
    };
    schemaJsonLd: {
      count: number;
      items: SchemaJsonLdItem[];
      detectedTypes: string[];
    };
    langAttribute: string | null;
    aeoData?: AeoData;
    geoData?: GeoData;
  };

  // Accessibility (WCAG 2.1 AA)
  accessibilityData: {
    hasHtmlLang: boolean;
    htmlLang: string | null;
    hasViewport: boolean;
    isZoomLocked: boolean;
    imagesTotal: number;
    imagesWithoutAltCount: number;
    missingAltSamples: Array<{ src: string; selector?: string }>;
    emptyButtonsCount: number;
    emptyButtonSamples: string[];
    emptyLinksCount: number;
    emptyLinkSamples: string[];
    formInputsWithoutLabelCount: number;
    hasMainLandmark: boolean;
    hasNavLandmark: boolean;
    hasHeaderLandmark: boolean;
    hasFooterLandmark: boolean;
    hasSkipLink: boolean;
    hasReducedMotionQuery: boolean;
  };

  // Security Architecture
  securityData: {
    isHttps: boolean;
    hsts: SecurityHeaderStatus;
    csp: SecurityHeaderStatus;
    xFrameOptions: SecurityHeaderStatus;
    xContentTypeOptions: SecurityHeaderStatus;
    referrerPolicy: SecurityHeaderStatus;
    permissionsPolicy: SecurityHeaderStatus;
    serverHeader: string | null;
    exposesServerVersion: boolean;
    mixedContentCount: number;
    mixedContentSamples: string[];
    unsafeBlankLinksCount: number;
    inlineEventHandlersCount: number;
    deprecatedTagsFound: string[];
  };

  // Discovered subpages
  internalPages: ScannedSubpageHealth[];

  // Keywords
  keywords: {
    topKeywords: Array<{ keyword: string; count: number; density: number }>;
    missingKeywords: string[];
  };

  // Granular findings list
  findings: AuditFinding[];

  // Backward-compatible issue structure (keeps compatibility with existing UI & AuditFixRequest)
  issues: {
    critical: Array<{
      category: 'security' | 'seo' | 'code' | 'performance';
      severity: 'critical';
      title: string;
      description: string;
      recommendation: string;
      suggestedFix?: { language: string; code: string; description: string };
    }>;
    warning: Array<{
      category: 'security' | 'seo' | 'code' | 'performance';
      severity: 'warning';
      title: string;
      description: string;
      recommendation: string;
      suggestedFix?: { language: string; code: string; description: string };
    }>;
    passed: Array<{
      category: 'security' | 'seo' | 'code' | 'performance';
      severity: 'passed';
      title: string;
      description: string;
      recommendation: string;
    }>;
  };

  // Backward-compatible meta object
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

  aeoData?: AeoData;
  geoData?: GeoData;

  capabilitiesDoc?: ExecutionCapability[];
}

export interface ExecutionCapability {
  id: string;
  name: string;
  category: string;
  environment: 'server' | 'browser' | 'pagespeed_api' | 'unavailable';
  status: 'active' | 'available' | 'requires_server' | 'requires_api_key' | 'not_supported';
  description: string;
  technicalDetails: string;
}

export interface AuditHistoryEntry {
  id: string;
  url: string;
  hostname: string;
  analyzedAt: string;
  overallScore: number;
  scores: {
    overall: number;
    performance: number;
    security: number;
    seo: number;
    accessibility: number;
    code: number;
  };
  criticalCount: number;
  warningCount: number;
  passedCount: number;
}

export interface AuditComparisonResult {
  previousId: string;
  currentId: string;
  url: string;
  previousDate: string;
  currentDate: string;
  overallScoreDiff: number;
  performanceScoreDiff: number;
  securityScoreDiff: number;
  seoScoreDiff: number;
  accessibilityScoreDiff: number;
  ttfbDiffMs: number;
  htmlSizeDiffKb: number;
  criticalIssuesDiff: number;
  warningIssuesDiff: number;
}

