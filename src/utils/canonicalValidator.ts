/**
 * Canonical URL Validator & Normalization Engine
 * Professional SEO and Technical URL Consistency Engine
 */

export type CheckSeverity = 'pass' | 'warning' | 'error' | 'info' | 'not-checked';

export interface ValidationCheckItem {
  id: string;
  category: 'syntax' | 'protocol' | 'domain' | 'path' | 'query' | 'html' | 'http';
  title: string;
  severity: CheckSeverity;
  message: string;
  recommendation?: string;
  technicalDetails?: string;
}

export interface NormalizationOptions {
  forceHttps: boolean;
  preferredDomainFormat: 'any' | 'non-www' | 'www';
  trailingSlashRule: 'preserve' | 'always' | 'never';
  stripTrackingParameters: boolean;
  stripFragments: boolean;
  stripSessionParameters: boolean;
  normalizeRepeatedSlashes: boolean;
  lowercaseHostname: boolean;
}

export interface NormalizationResult {
  originalUrl: string;
  normalizedUrl: string;
  differencesDetected: string[];
  recommendedCanonicalTag: string;
  reasons: string[];
}

export interface RemoteHttpInspectionResult {
  attempted: boolean;
  success: boolean;
  statusCode?: number;
  finalUrl?: string;
  redirectChain?: string[];
  contentType?: string;
  canonicalHeader?: string | null;
  canonicalInHtml?: string | null;
  robotsHeader?: string | null;
  errorMessage?: string;
  responseTimeMs?: number;
}

export interface HtmlInspectionResult {
  hasCanonicalTag: boolean;
  canonicalTagCount: number;
  isInsideHead: boolean;
  canonicalHref: string | null;
  isAbsolute: boolean;
  syntaxValid: boolean;
  issues: string[];
}

export interface FullCanonicalAnalysisReport {
  targetUrl: string;
  expectedCanonicalUrl?: string;
  isValidUrl: boolean;
  overallStatus: 'valid' | 'warning' | 'invalid' | 'incomplete';
  statusSummary: string;
  urlSyntax: {
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
  };
  checks: ValidationCheckItem[];
  normalization: NormalizationResult;
  htmlInspection?: HtmlInspectionResult;
  httpInspection?: RemoteHttpInspectionResult;
  analyzedAt: string;
}

// Configurable tracking parameters commonly removable from canonical target
export const COMMON_TRACKING_PARAMETERS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'msclkid',
  'dclid',
  'igshid',
  'ttclid',
  'twclid',
  'yclid',
  '_hsenc',
  '_hsmi',
  'mc_cid',
  'mc_eid'
];

// Session identifiers
export const COMMON_SESSION_PARAMETERS = [
  'phpsessid',
  'jsessionid',
  'aspsessionid',
  'sid',
  'sessionid',
  'cfid',
  'cftoken'
];

/**
 * Normalizes a URL based on specified configurable rules
 */
export function normalizeCanonicalUrl(
  inputUrl: string,
  options: NormalizationOptions
): NormalizationResult {
  const differences: string[] = [];
  const reasons: string[] = [];

  let trimmed = inputUrl.trim();
  if (!trimmed) {
    return {
      originalUrl: inputUrl,
      normalizedUrl: '',
      differencesDetected: ['Input URL is empty'],
      recommendedCanonicalTag: '',
      reasons: ['No URL provided to normalize.']
    };
  }

  // Prepend https:// if protocol missing for parser
  let hasMissingProtocol = false;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
    hasMissingProtocol = true;
    differences.push('Added missing https:// protocol scheme');
    reasons.push('Canonical URLs must include an explicit protocol.');
  }

  let urlObj: URL;
  try {
    urlObj = new URL(trimmed);
  } catch (err) {
    return {
      originalUrl: inputUrl,
      normalizedUrl: inputUrl,
      differencesDetected: ['Malformed URL structure - unable to parse cleanly'],
      recommendedCanonicalTag: '',
      reasons: ['URL cannot be parsed by standard WHATWG URL parser.']
    };
  }

  // 1. Protocol Normalization
  if (options.forceHttps && urlObj.protocol === 'http:') {
    urlObj.protocol = 'https:';
    differences.push('Changed protocol from insecure http: to secure https:');
    reasons.push('Modern search engines strongly favor HTTPS canonical destinations.');
  }

  // 2. Lowercase hostname
  if (options.lowercaseHostname && urlObj.hostname !== urlObj.hostname.toLowerCase()) {
    const originalHost = urlObj.hostname;
    urlObj.hostname = urlObj.hostname.toLowerCase();
    differences.push(`Converted hostname from "${originalHost}" to lowercase "${urlObj.hostname}"`);
    reasons.push('Hostnames in URLs are case-insensitive per RFC 3986 and should be lowercase.');
  }

  // 3. WWW vs Non-WWW domain format
  if (options.preferredDomainFormat === 'non-www' && urlObj.hostname.startsWith('www.')) {
    const oldHost = urlObj.hostname;
    urlObj.hostname = urlObj.hostname.replace(/^www\./i, '');
    differences.push(`Removed "www." subdomain (${oldHost} → ${urlObj.hostname})`);
    reasons.push('Configured preferred domain format is root non-www.');
  } else if (options.preferredDomainFormat === 'www' && !urlObj.hostname.startsWith('www.')) {
    // Avoid prepending www to localhost or IP addresses
    if (!/^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i.test(urlObj.hostname)) {
      urlObj.hostname = 'www.' + urlObj.hostname;
      differences.push(`Added "www." subdomain (${urlObj.hostname})`);
      reasons.push('Configured preferred domain format is www-prefixed.');
    }
  }

  // 4. Repeated path separators (// -> /)
  if (options.normalizeRepeatedSlashes && urlObj.pathname.includes('//')) {
    const oldPath = urlObj.pathname;
    urlObj.pathname = urlObj.pathname.replace(/\/+/g, '/');
    differences.push(`Collapsed redundant path slashes (${oldPath} → ${urlObj.pathname})`);
    reasons.push('Duplicate slashes in paths can cause duplicate content issues.');
  }

  // 5. Trailing slash rule
  if (options.trailingSlashRule === 'always') {
    // Only apply if path does not end with an extension (e.g. .html, .png, .pdf)
    const hasFileExtension = /\.[a-z0-9]{2,5}$/i.test(urlObj.pathname);
    if (!hasFileExtension && !urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname + '/';
      differences.push('Appended trailing slash to pathname');
      reasons.push('Enforcing consistent trailing slash format.');
    }
  } else if (options.trailingSlashRule === 'never') {
    if (urlObj.pathname.length > 1 && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.replace(/\/+$/, '');
      differences.push('Removed trailing slash from pathname');
      reasons.push('Enforcing consistent non-trailing slash format.');
    }
  }

  // 6. Query Parameters - Tracking and Session parameters removal
  const searchParams = new URLSearchParams(urlObj.search);
  const removedParams: string[] = [];

  if (options.stripTrackingParameters) {
    for (const key of Array.from(searchParams.keys())) {
      const lowerKey = key.toLowerCase();
      if (COMMON_TRACKING_PARAMETERS.includes(lowerKey)) {
        searchParams.delete(key);
        removedParams.push(key);
      }
    }
  }

  if (options.stripSessionParameters) {
    for (const key of Array.from(searchParams.keys())) {
      const lowerKey = key.toLowerCase();
      if (COMMON_SESSION_PARAMETERS.includes(lowerKey)) {
        searchParams.delete(key);
        removedParams.push(key);
      }
    }
  }

  if (removedParams.length > 0) {
    const searchString = searchParams.toString();
    urlObj.search = searchString ? `?${searchString}` : '';
    differences.push(`Stripped transient tracking/session parameters: ${removedParams.join(', ')}`);
    reasons.push('Marketing tags and session IDs must be excluded from canonical tags to prevent index fragmentation.');
  }

  // 7. Strip Fragment (#)
  if (options.stripFragments && urlObj.hash) {
    const oldHash = urlObj.hash;
    urlObj.hash = '';
    differences.push(`Removed URL fragment anchor (${oldHash})`);
    reasons.push('Canonical URLs must point to full document resources, never anchor fragments (#).');
  }

  const normalizedUrl = urlObj.toString();
  const recommendedCanonicalTag = `<link rel="canonical" href="${normalizedUrl}" />`;

  return {
    originalUrl: inputUrl,
    normalizedUrl,
    differencesDetected: differences,
    recommendedCanonicalTag,
    reasons: reasons.length > 0 ? reasons : ['URL is already fully normalized and conforms to standards.']
  };
}

/**
 * Validates URL syntax and analyzes potential canonical issues
 */
export function validateUrlSyntax(
  rawUrl: string,
  expectedCanonical?: string,
  options?: Partial<NormalizationOptions>
): { isValid: boolean; parsedUrl: URL | null; checks: ValidationCheckItem[] } {
  const checks: ValidationCheckItem[] = [];
  const trimmed = (rawUrl || '').trim();

  if (!trimmed) {
    checks.push({
      id: 'empty-url',
      category: 'syntax',
      title: 'Target URL is Required',
      severity: 'error',
      message: 'No URL was provided for analysis.',
      recommendation: 'Enter an absolute URL starting with https:// or http://.'
    });
    return { isValid: false, parsedUrl: null, checks };
  }

  // Spaces check
  if (/\s/.test(trimmed)) {
    checks.push({
      id: 'url-spaces',
      category: 'syntax',
      title: 'Whitespace Characters Detected',
      severity: 'error',
      message: 'The URL contains unencoded space characters.',
      recommendation: 'Replace whitespace with hyphens or %20 encoding.'
    });
  }

  // Missing or invalid protocol
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    checks.push({
      id: 'missing-protocol',
      category: 'protocol',
      title: 'Protocol Scheme Missing',
      severity: 'warning',
      message: 'The URL does not specify a protocol (e.g. https://).',
      recommendation: 'Always explicitly specify https:// for canonical tags.'
    });
  }

  let parsed: URL;
  try {
    const urlToParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(urlToParse);
  } catch (err: any) {
    checks.push({
      id: 'invalid-url-structure',
      category: 'syntax',
      title: 'Invalid URL Format',
      severity: 'error',
      message: 'The URL could not be parsed according to the WHATWG URL specification.',
      recommendation: 'Check for invalid characters, missing dots, or malformed domain structures.'
    });
    return { isValid: false, parsedUrl: null, checks };
  }

  // Protocol Checks
  if (parsed.protocol === 'http:') {
    checks.push({
      id: 'http-insecure',
      category: 'protocol',
      title: 'Insecure HTTP Protocol',
      severity: 'warning',
      message: 'The target URL uses insecure HTTP rather than HTTPS.',
      recommendation: 'Canonical tags should reference the encrypted https:// version unless testing locally.'
    });
  } else if (parsed.protocol === 'https:') {
    checks.push({
      id: 'https-secure',
      category: 'protocol',
      title: 'Secure HTTPS Protocol',
      severity: 'pass',
      message: 'URL properly specifies encrypted HTTPS protocol.'
    });
  } else {
    checks.push({
      id: 'unsupported-protocol',
      category: 'protocol',
      title: 'Unsupported Protocol Scheme',
      severity: 'error',
      message: `Protocol "${parsed.protocol}" is not supported for canonical tags.`,
      recommendation: 'Use https:// or http:// only.'
    });
  }

  // Hostname Analysis
  const host = parsed.hostname;
  if (!host) {
    checks.push({
      id: 'missing-hostname',
      category: 'domain',
      title: 'Missing Hostname',
      severity: 'error',
      message: 'The URL is missing a valid domain hostname.'
    });
  } else {
    // Uppercase in host
    if (/[A-Z]/.test(host)) {
      checks.push({
        id: 'uppercase-hostname',
        category: 'domain',
        title: 'Uppercase Characters in Hostname',
        severity: 'warning',
        message: 'The hostname contains uppercase letters.',
        recommendation: 'Normalize the hostname to lowercase.'
      });
    }

    // Localhost or Private IP
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      checks.push({
        id: 'local-private-host',
        category: 'domain',
        title: 'Localhost or Private Network Address',
        severity: 'info',
        message: `Hostname "${host}" is a loopback or private network address.`,
        recommendation: 'Local addresses are suitable for development testing only, not live production canonicals.'
      });
    } else if (host.includes('.')) {
      checks.push({
        id: 'valid-domain',
        category: 'domain',
        title: 'Valid Public Hostname',
        severity: 'pass',
        message: `Hostname "${host}" is well-formed.`
      });
    }

    // Port check
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      checks.push({
        id: 'explicit-port',
        category: 'domain',
        title: `Non-Standard Port Specified (:${parsed.port})`,
        severity: 'warning',
        message: `URL explicitly references port :${parsed.port}.`,
        recommendation: 'Production canonical tags rarely include non-standard port numbers unless specifically required.'
      });
    }
  }

  // Path Analysis
  if (parsed.pathname.includes('//')) {
    checks.push({
      id: 'double-slashes-path',
      category: 'path',
      title: 'Repeated Slashes in URL Path',
      severity: 'warning',
      message: 'The path contains double slashes (e.g. /category//item).',
      recommendation: 'Collapse duplicate slashes to a single slash.'
    });
  } else {
    checks.push({
      id: 'clean-path',
      category: 'path',
      title: 'Clean Path Structure',
      severity: 'pass',
      message: 'Path contains no redundant slashes.'
    });
  }

  // Trailing slash status
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(parsed.pathname);
  if (!hasExt) {
    if (parsed.pathname.endsWith('/')) {
      checks.push({
        id: 'has-trailing-slash',
        category: 'path',
        title: 'Path Ends With Trailing Slash',
        severity: 'info',
        message: 'The URL path terminates with a trailing slash.',
        recommendation: 'Ensure your server does not serve identical content at both with-slash and without-slash URLs.'
      });
    } else {
      checks.push({
        id: 'no-trailing-slash',
        category: 'path',
        title: 'Path Has No Trailing Slash',
        severity: 'info',
        message: 'The URL path does not terminate with a trailing slash.'
      });
    }
  }

  // Fragment Check
  if (parsed.hash) {
    checks.push({
      id: 'url-fragment',
      category: 'syntax',
      title: 'Fragment Anchor Present in Target',
      severity: 'warning',
      message: `The URL contains a fragment anchor "${parsed.hash}".`,
      recommendation: 'Search engine crawlers ignore URL fragments. Canonical tags MUST NOT include fragments (#).'
    });
  } else {
    checks.push({
      id: 'no-fragment',
      category: 'syntax',
      title: 'No Fragment Anchor',
      severity: 'pass',
      message: 'URL is cleanly scoped to the document resource with no fragment.'
    });
  }

  // Query Parameters Analysis
  const searchParams = parsed.searchParams;
  const paramKeys = Array.from(searchParams.keys());

  if (paramKeys.length === 0) {
    checks.push({
      id: 'no-query-params',
      category: 'query',
      title: 'Clean Query String',
      severity: 'pass',
      message: 'URL contains no query parameters.'
    });
  } else {
    const foundTracking = paramKeys.filter(k => COMMON_TRACKING_PARAMETERS.includes(k.toLowerCase()));
    const foundSession = paramKeys.filter(k => COMMON_SESSION_PARAMETERS.includes(k.toLowerCase()));
    const functionalParams = paramKeys.filter(
      k => !COMMON_TRACKING_PARAMETERS.includes(k.toLowerCase()) && !COMMON_SESSION_PARAMETERS.includes(k.toLowerCase())
    );

    if (foundTracking.length > 0) {
      checks.push({
        id: 'tracking-parameters',
        category: 'query',
        title: 'Marketing Tracking Parameters Detected',
        severity: 'warning',
        message: `Found tracking parameters: ${foundTracking.join(', ')}.`,
        recommendation: 'Strip analytics tracking parameters (UTM, gclid, fbclid) from canonical destinations to prevent index dilution.'
      });
    }

    if (foundSession.length > 0) {
      checks.push({
        id: 'session-parameters',
        category: 'query',
        title: 'Session ID Parameter Detected',
        severity: 'error',
        message: `Found session tracking parameters: ${foundSession.join(', ')}.`,
        recommendation: 'Never include session IDs in canonical URLs; this causes search engines to index duplicate URLs per visitor.'
      });
    }

    if (functionalParams.length > 0) {
      checks.push({
        id: 'functional-query-params',
        category: 'query',
        title: 'Functional Query Parameters Present',
        severity: 'info',
        message: `Parameters present: ${functionalParams.join(', ')}.`,
        recommendation: 'Verify whether these parameters change page content. If they represent distinct filter states or pages, they may be valid in the canonical.'
      });
    }
  }

  // Comparison against Expected Canonical URL
  if (expectedCanonical && expectedCanonical.trim()) {
    try {
      const expParsed = new URL(expectedCanonical.trim());
      if (expParsed.toString() === parsed.toString()) {
        checks.push({
          id: 'expected-canonical-match',
          category: 'domain',
          title: 'Matches Expected Canonical URL',
          severity: 'pass',
          message: 'The target URL exactly matches the expected canonical URL provided.'
        });
      } else {
        const diffs: string[] = [];
        if (expParsed.protocol !== parsed.protocol) diffs.push(`Protocol: ${parsed.protocol} vs ${expParsed.protocol}`);
        if (expParsed.hostname !== parsed.hostname) diffs.push(`Hostname: ${parsed.hostname} vs ${expParsed.hostname}`);
        if (expParsed.pathname !== parsed.pathname) diffs.push(`Path: ${parsed.pathname} vs ${expParsed.pathname}`);
        if (expParsed.search !== parsed.search) diffs.push(`Query: "${parsed.search}" vs "${expParsed.search}"`);

        checks.push({
          id: 'expected-canonical-mismatch',
          category: 'domain',
          title: 'Mismatch with Expected Canonical',
          severity: 'warning',
          message: `URL differs from expected canonical: ${diffs.join('; ')}`,
          recommendation: 'Align the page URL and expected canonical URL to avoid search engine confusion.'
        });
      }
    } catch {
      checks.push({
        id: 'expected-canonical-invalid',
        category: 'syntax',
        title: 'Expected Canonical URL is Malformed',
        severity: 'warning',
        message: 'The optional expected canonical URL provided is not a valid URL.'
      });
    }
  }

  return { isValid: true, parsedUrl: parsed, checks };
}

/**
 * Parses user-provided HTML source and analyzes the <link rel="canonical"> tag
 */
export function inspectHtmlSource(
  html: string,
  targetPageUrl?: string
): { result: HtmlInspectionResult; checks: ValidationCheckItem[] } {
  const checks: ValidationCheckItem[] = [];
  const issues: string[] = [];

  if (!html || !html.trim()) {
    return {
      result: {
        hasCanonicalTag: false,
        canonicalTagCount: 0,
        isInsideHead: false,
        canonicalHref: null,
        isAbsolute: false,
        syntaxValid: false,
        issues: ['No HTML source provided for inspection.']
      },
      checks: [
        {
          id: 'html-empty',
          category: 'html',
          title: 'HTML Source Code Empty',
          severity: 'info',
          message: 'Paste HTML source to inspect canonical link element structure.'
        }
      ]
    };
  }

  // Regex analysis for canonical tags to avoid browser DOM parsing altering raw syntax
  const canonicalTagRegex = /<link\b(?=[^>]*\brel=["']?canonical["']?)(?=[^>]*\bhref=["']?([^"'>\s]+)["']?)[^>]*>/gi;
  const matches: { fullTag: string; href: string }[] = [];
  let match;

  while ((match = canonicalTagRegex.exec(html)) !== null) {
    matches.push({
      fullTag: match[0],
      href: match[1] || ''
    });
  }

  // Also check if any rel="canonical" tag has no href attribute
  const emptyHrefRegex = /<link\b(?=[^>]*\brel=["']?canonical["']?)(?![^>]*\bhref\b)[^>]*>/gi;
  let emptyMatch;
  while ((emptyMatch = emptyHrefRegex.exec(html)) !== null) {
    matches.push({
      fullTag: emptyMatch[0],
      href: ''
    });
  }

  const tagCount = matches.length;

  if (tagCount === 0) {
    issues.push('No <link rel="canonical"> tag found in the provided HTML.');
    checks.push({
      id: 'no-canonical-in-html',
      category: 'html',
      title: 'Missing Canonical Tag',
      severity: 'error',
      message: 'The HTML source does not contain any <link rel="canonical"> element.',
      recommendation: 'Add a <link rel="canonical" href="https://example.com/page" /> inside the <head> section.'
    });

    return {
      result: {
        hasCanonicalTag: false,
        canonicalTagCount: 0,
        isInsideHead: false,
        canonicalHref: null,
        isAbsolute: false,
        syntaxValid: false,
        issues
      },
      checks
    };
  }

  if (tagCount > 1) {
    issues.push(`Multiple (${tagCount}) canonical tags detected.`);
    checks.push({
      id: 'multiple-canonical-tags',
      category: 'html',
      title: `Multiple Canonical Tags Detected (${tagCount})`,
      severity: 'error',
      message: `The HTML contains ${tagCount} canonical link elements. Search engines will ignore all canonical tags when duplicates or conflicting tags exist!`,
      recommendation: 'Ensure exactly ONE canonical tag is generated per page.'
    });
  } else {
    checks.push({
      id: 'single-canonical-tag',
      category: 'html',
      title: 'Single Canonical Tag Found',
      severity: 'pass',
      message: 'HTML contains exactly one canonical link element.'
    });
  }

  const primary = matches[0];
  const rawHref = primary.href.trim();

  // Check if inside <head>
  const headMatch = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html);
  let isInsideHead = false;

  if (headMatch) {
    isInsideHead = headMatch[1].includes(primary.fullTag) || /rel=["']?canonical["']?/i.test(headMatch[1]);
  } else {
    // If user only pasted a head snippet
    isInsideHead = !/<body\b/i.test(html) || html.indexOf(primary.fullTag) < (html.indexOf('<body') === -1 ? 999999 : html.indexOf('<body'));
  }

  if (isInsideHead) {
    checks.push({
      id: 'canonical-inside-head',
      category: 'html',
      title: 'Canonical Tag Inside <head>',
      severity: 'pass',
      message: 'The canonical link element is placed correctly inside the <head> container.'
    });
  } else {
    issues.push('Canonical tag appears outside of the <head> container.');
    checks.push({
      id: 'canonical-outside-head',
      category: 'html',
      title: 'Canonical Tag Outside of <head>',
      severity: 'error',
      message: 'The canonical link is located in the <body> or outside the <head> section. Search engines will not respect canonical tags outside <head>.',
      recommendation: 'Move the <link rel="canonical"> tag into the <head> section of the document.'
    });
  }

  // Check href value
  if (!rawHref) {
    issues.push('Canonical tag href attribute is empty.');
    checks.push({
      id: 'empty-canonical-href',
      category: 'html',
      title: 'Empty Canonical href Attribute',
      severity: 'error',
      message: 'The canonical tag href attribute is empty or missing.',
      recommendation: 'Specify the full absolute URL in the href attribute.'
    });

    return {
      result: {
        hasCanonicalTag: true,
        canonicalTagCount: tagCount,
        isInsideHead,
        canonicalHref: '',
        isAbsolute: false,
        syntaxValid: false,
        issues
      },
      checks
    };
  }

  // Absolute vs Relative URL check
  const isAbsolute = /^https?:\/\//i.test(rawHref);

  if (isAbsolute) {
    checks.push({
      id: 'canonical-is-absolute',
      category: 'html',
      title: 'Absolute Canonical URL Specified',
      severity: 'pass',
      message: `Canonical href is an absolute URL (${rawHref}).`
    });
  } else {
    issues.push(`Relative canonical URL detected ("${rawHref}").`);
    checks.push({
      id: 'canonical-is-relative',
      category: 'html',
      title: 'Relative URL in Canonical Tag',
      severity: 'warning',
      message: `Canonical href uses a relative path "${rawHref}". While technically resolved by some parsers, search engines recommend absolute URLs to prevent parsing ambiguity.`,
      recommendation: 'Change relative URL to an absolute URL beginning with https://'
    });
  }

  // Verify protocol in href if absolute
  if (isAbsolute && rawHref.startsWith('http://')) {
    issues.push('Canonical tag specifies insecure http:// protocol.');
    checks.push({
      id: 'canonical-http-insecure',
      category: 'html',
      title: 'Canonical Points to Insecure HTTP',
      severity: 'warning',
      message: 'The canonical tag href points to an unencrypted http:// URL.',
      recommendation: 'Update canonical href to https://.'
    });
  }

  // Check for fragment in canonical href
  if (rawHref.includes('#')) {
    issues.push('Canonical href contains a fragment identifier (#).');
    checks.push({
      id: 'canonical-has-fragment',
      category: 'html',
      title: 'Canonical href Contains Fragment Anchor',
      severity: 'error',
      message: 'Canonical URLs must not contain fragment anchors (#).',
      recommendation: 'Strip the #anchor part from the canonical href.'
    });
  }

  // Target page URL mismatch check
  if (targetPageUrl && isAbsolute) {
    try {
      const targetObj = new URL(targetPageUrl.trim());
      const canonObj = new URL(rawHref);

      if (targetObj.hostname !== canonObj.hostname) {
        issues.push(`Cross-domain canonical detected (${targetObj.hostname} → ${canonObj.hostname}).`);
        checks.push({
          id: 'cross-domain-canonical',
          category: 'html',
          title: 'Cross-Domain Canonical Tag',
          severity: 'info',
          message: `The canonical points to a different domain (${canonObj.hostname}) than the page (${targetObj.hostname}).`,
          recommendation: 'Verify whether cross-domain syndication is intentional. If this is original content, point canonical to your own domain.'
        });
      } else if (targetObj.pathname !== canonObj.pathname) {
        checks.push({
          id: 'canonical-path-difference',
          category: 'html',
          title: 'Non-Self-Referential Canonical Tag',
          severity: 'info',
          message: `Canonical points to path "${canonObj.pathname}" while target page is "${targetObj.pathname}".`,
          recommendation: 'If this page is unique, canonical should usually point to itself (self-referential).'
        });
      } else {
        checks.push({
          id: 'self-referential-canonical',
          category: 'html',
          title: 'Self-Referential Canonical Match',
          severity: 'pass',
          message: 'The canonical URL path matches the target page.'
        });
      }
    } catch {}
  }

  return {
    result: {
      hasCanonicalTag: true,
      canonicalTagCount: tagCount,
      isInsideHead,
      canonicalHref: rawHref,
      isAbsolute,
      syntaxValid: issues.length === 0,
      issues
    },
    checks
  };
}

/**
 * Combines all checks and generates comprehensive diagnostic report
 */
export function generateDiagnosticText(report: FullCanonicalAnalysisReport): string {
  const lines: string[] = [];
  lines.push('=====================================================');
  lines.push('SAMAXON CANONICAL URL VALIDATOR — DIAGNOSTIC REPORT');
  lines.push('=====================================================');
  lines.push(`Generated: ${report.analyzedAt}`);
  lines.push(`Target URL: ${report.targetUrl}`);
  if (report.expectedCanonicalUrl) {
    lines.push(`Expected Canonical: ${report.expectedCanonicalUrl}`);
  }
  lines.push(`Overall Status: ${report.overallStatus.toUpperCase()} — ${report.statusSummary}`);
  lines.push('');

  lines.push('--- 1. NORMALIZATION & RECOMMENDATION ---');
  lines.push(`Original:   ${report.normalization.originalUrl}`);
  lines.push(`Normalized: ${report.normalization.normalizedUrl}`);
  lines.push(`Recommended Tag:\n  ${report.normalization.recommendedCanonicalTag}`);
  if (report.normalization.differencesDetected.length > 0) {
    lines.push('Modifications Detected:');
    report.normalization.differencesDetected.forEach(d => lines.push(`  • ${d}`));
  }
  lines.push('');

  lines.push('--- 2. DETAILED AUDIT CHECKLIST ---');
  const errorCount = report.checks.filter(c => c.severity === 'error').length;
  const warnCount = report.checks.filter(c => c.severity === 'warning').length;
  const passCount = report.checks.filter(c => c.severity === 'pass').length;
  const infoCount = report.checks.filter(c => c.severity === 'info').length;

  lines.push(`Summary: ${passCount} Passed | ${warnCount} Warnings | ${errorCount} Errors | ${infoCount} Informational`);
  lines.push('');

  report.checks.forEach((check, i) => {
    const icon = check.severity === 'pass' ? '[PASS]' : check.severity === 'error' ? '[ERROR]' : check.severity === 'warning' ? '[WARN]' : '[INFO]';
    lines.push(`${i + 1}. ${icon} ${check.title}`);
    lines.push(`   ${check.message}`);
    if (check.recommendation) {
      lines.push(`   Fix: ${check.recommendation}`);
    }
  });

  if (report.htmlInspection) {
    lines.push('');
    lines.push('--- 3. HTML SOURCE AUDIT ---');
    lines.push(`Canonical Tag Found: ${report.htmlInspection.hasCanonicalTag ? 'YES' : 'NO'}`);
    lines.push(`Canonical Tag Count: ${report.htmlInspection.canonicalTagCount}`);
    lines.push(`Inside <head>:        ${report.htmlInspection.isInsideHead ? 'YES' : 'NO'}`);
    lines.push(`Canonical href:       ${report.htmlInspection.canonicalHref || '(none)'}`);
    lines.push(`Absolute URL:         ${report.htmlInspection.isAbsolute ? 'YES' : 'NO'}`);
  }

  if (report.httpInspection && report.httpInspection.attempted) {
    lines.push('');
    lines.push('--- 4. REMOTE HTTP INSPECTION ---');
    lines.push(`Inspection Status:    ${report.httpInspection.success ? 'COMPLETED' : 'FAILED / RESTRICTED'}`);
    if (report.httpInspection.statusCode) lines.push(`HTTP Status:          ${report.httpInspection.statusCode}`);
    if (report.httpInspection.finalUrl) lines.push(`Final Response URL:   ${report.httpInspection.finalUrl}`);
    if (report.httpInspection.canonicalHeader) lines.push(`HTTP Header Link:     ${report.httpInspection.canonicalHeader}`);
    if (report.httpInspection.robotsHeader) lines.push(`Robots Header:        ${report.httpInspection.robotsHeader}`);
  }

  lines.push('');
  lines.push('=====================================================');
  lines.push('Report verified by SamaXon Digital Solutions Labs');
  lines.push('=====================================================');

  return lines.join('\n');
}
