/**
 * Professional API Request Engine
 * Safe HTTP request construction, client-side & proxy execution,
 * CORS diagnostic classifier, code generator, and response parser.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

export type AuthType = 'none' | 'bearer' | 'basic' | 'apikey-header' | 'apikey-query';

export interface AuthConfig {
  type: AuthType;
  bearerToken: string;
  basicUsername: string;
  basicPassword: string;
  apiKeyName: string;
  apiKeyValue: string;
  apiKeyPlacement: 'header' | 'query';
}

export type BodyType = 'none' | 'json' | 'text' | 'form-urlencoded' | 'xml' | 'raw';

export interface RequestConfig {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  queryParams: KeyValuePair[];
  headers: KeyValuePair[];
  auth: AuthConfig;
  bodyType: BodyType;
  bodyContent: string;
  urlEncodedParams: KeyValuePair[];
  timeoutMs: number;
  useProxy: boolean;
}

export interface ApiResponseData {
  status: number;
  statusText: string;
  ok: boolean;
  timeMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  bodyText: string;
  contentType: string;
  isJson: boolean;
  parsedJson?: any;
  errorType?: 'none' | 'cors' | 'network' | 'timeout' | 'dns' | 'tls' | 'invalid-url' | 'abort' | 'other';
  errorMessage?: string;
  curlCommand: string;
  executedAt: string;
  viaProxy: boolean;
}

export interface RequestHistoryItem {
  id: string;
  timestamp: string;
  method: HttpMethod;
  url: string;
  status: number;
  timeMs: number;
  success: boolean;
  sanitizedConfig: RequestConfig;
}

export const COMMON_HEADER_SUGGESTIONS = [
  'Accept',
  'Content-Type',
  'Authorization',
  'Cache-Control',
  'X-Requested-With',
  'X-API-Key',
  'If-None-Match',
  'Accept-Language',
  'Accept-Encoding',
  'Pragma'
];

export const COMMON_CONTENT_TYPES = [
  'application/json',
  'application/x-www-form-urlencoded',
  'text/plain',
  'application/xml',
  'text/html'
];

/**
 * Builds the final URL including active query parameters and query-based authentication
 */
export function buildComputedUrl(url: string, params: KeyValuePair[], auth?: AuthConfig): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  let baseUrl = trimmed;
  let parsed: URL;

  try {
    // Add temporary protocol if missing to allow WHATWG URL parsing
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
    const urlWithScheme = hasScheme ? trimmed : `https://${trimmed}`;
    parsed = new URL(urlWithScheme);

    // Merge active user query params
    params.forEach(param => {
      if (param.enabled && param.key.trim()) {
        parsed.searchParams.append(param.key.trim(), param.value);
      }
    });

    // Add API key query param if selected
    if (auth && auth.type === 'apikey-query' && auth.apiKeyName.trim()) {
      parsed.searchParams.append(auth.apiKeyName.trim(), auth.apiKeyValue || '');
    }

    // Restore without artificial https:// if user entered relative or protocol-less
    if (!hasScheme && !trimmed.startsWith('//')) {
      return parsed.origin.replace('https://', '') + parsed.pathname + parsed.search + parsed.hash;
    }

    return parsed.toString();
  } catch (err) {
    // Fallback simple query append if URL is a template or unparseable
    const activeParams = params.filter(p => p.enabled && p.key.trim());
    if (activeParams.length === 0) return trimmed;

    const queryString = activeParams
      .map(p => `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value)}`)
      .join('&');

    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}${queryString}`;
  }
}

/**
 * Validates and formats JSON string, returning line/column on error
 */
export function validateAndFormatJson(rawJson: string): {
  valid: boolean;
  formatted?: string;
  minified?: string;
  errorLine?: number;
  errorColumn?: number;
  errorMessage?: string;
} {
  const trimmed = rawJson.trim();
  if (!trimmed) return { valid: true, formatted: '', minified: '' };

  try {
    const parsed = JSON.parse(trimmed);
    return {
      valid: true,
      formatted: JSON.stringify(parsed, null, 2),
      minified: JSON.stringify(parsed)
    };
  } catch (err: any) {
    let errorLine: number | undefined;
    let errorColumn: number | undefined;
    const msg = err?.message || 'Invalid JSON syntax';

    // Parse V8 error position: "at position 42" or "line 2 column 5"
    const posMatch = msg.match(/position\s+(\d+)/i);
    if (posMatch) {
      const position = parseInt(posMatch[1], 10);
      const lines = trimmed.substring(0, position).split('\n');
      errorLine = lines.length;
      errorColumn = lines[lines.length - 1].length + 1;
    }

    const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColMatch) {
      errorLine = parseInt(lineColMatch[1], 10);
      errorColumn = parseInt(lineColMatch[2], 10);
    }

    return {
      valid: false,
      errorMessage: msg,
      errorLine,
      errorColumn
    };
  }
}

/**
 * Computes the payload body to be sent based on bodyType
 */
export function computeFinalRequestBody(config: RequestConfig): string | undefined {
  if (['GET', 'HEAD'].includes(config.method)) {
    return undefined;
  }

  if (config.bodyType === 'none') {
    return undefined;
  }

  if (config.bodyType === 'json' || config.bodyType === 'text' || config.bodyType === 'xml' || config.bodyType === 'raw') {
    return config.bodyContent;
  }

  if (config.bodyType === 'form-urlencoded') {
    const active = config.urlEncodedParams.filter(p => p.enabled && p.key.trim());
    return active.map(p => `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value)}`).join('&');
  }

  return undefined;
}

/**
 * Collects effective headers including auth and Content-Type
 */
export function computeEffectiveHeaders(config: RequestConfig, redactSecrets = false): Record<string, string> {
  const headers: Record<string, string> = {};

  // Custom headers from table
  config.headers.forEach(h => {
    if (h.enabled && h.key.trim()) {
      headers[h.key.trim()] = h.value;
    }
  });

  // Content-Type based on body type if not manually overridden
  const hasContentType = Object.keys(headers).some(k => k.toLowerCase() === 'content-type');
  if (!hasContentType && !['GET', 'HEAD'].includes(config.method)) {
    if (config.bodyType === 'json') {
      headers['Content-Type'] = 'application/json';
    } else if (config.bodyType === 'form-urlencoded') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    } else if (config.bodyType === 'xml') {
      headers['Content-Type'] = 'application/xml';
    } else if (config.bodyType === 'text') {
      headers['Content-Type'] = 'text/plain; charset=UTF-8';
    }
  }

  // Authentication Headers
  if (config.auth) {
    if (config.auth.type === 'bearer' && config.auth.bearerToken.trim()) {
      headers['Authorization'] = redactSecrets ? 'Bearer ••••••••' : `Bearer ${config.auth.bearerToken.trim()}`;
    } else if (config.auth.type === 'basic' && (config.auth.basicUsername || config.auth.basicPassword)) {
      if (redactSecrets) {
        headers['Authorization'] = 'Basic ••••••••';
      } else {
        const creds = `${config.auth.basicUsername}:${config.auth.basicPassword}`;
        try {
          headers['Authorization'] = `Basic ${btoa(creds)}`;
        } catch {
          headers['Authorization'] = `Basic ${creds}`;
        }
      }
    } else if (config.auth.type === 'apikey-header' && config.auth.apiKeyName.trim()) {
      headers[config.auth.apiKeyName.trim()] = redactSecrets ? '••••••••' : config.auth.apiKeyValue;
    }
  }

  return headers;
}

/**
 * Executes API Request either directly via fetch or through secure server proxy
 */
export async function executeApiRequest(config: RequestConfig): Promise<ApiResponseData> {
  const finalUrl = buildComputedUrl(config.url, config.queryParams, config.auth);
  const effectiveHeaders = computeEffectiveHeaders(config, false);
  const body = computeFinalRequestBody(config);
  const startTime = performance.now();

  // Basic URL Validation
  try {
    new URL(finalUrl);
  } catch {
    return {
      status: 0,
      statusText: 'Invalid URL',
      ok: false,
      timeMs: 0,
      sizeBytes: 0,
      headers: {},
      bodyText: '',
      contentType: '',
      isJson: false,
      errorType: 'invalid-url',
      errorMessage: 'The provided Request URL is malformed. Please enter a valid URL including http:// or https://.',
      curlCommand: generateCurlCommand(config, false),
      executedAt: new Date().toISOString(),
      viaProxy: false
    };
  }

  // Use Proxy path if selected
  if (config.useProxy) {
    try {
      const proxyRes = await fetch('/api/tools/api-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: finalUrl,
          method: config.method,
          headers: effectiveHeaders,
          body: body,
          timeoutMs: config.timeoutMs || 10000
        })
      });

      const proxyData = await proxyRes.json();
      const elapsed = Math.round(performance.now() - startTime);

      if (!proxyRes.ok || !proxyData.success) {
        return {
          status: proxyData.status || 0,
          statusText: proxyData.statusText || 'Proxy Error',
          ok: false,
          timeMs: elapsed,
          sizeBytes: 0,
          headers: proxyData.headers || {},
          bodyText: proxyData.error || proxyData.body || 'Proxy request rejected by security boundary.',
          contentType: 'text/plain',
          isJson: false,
          errorType: 'other',
          errorMessage: proxyData.error || 'Server proxy could not complete request.',
          curlCommand: generateCurlCommand(config, false),
          executedAt: new Date().toISOString(),
          viaProxy: true
        };
      }

      const bodyText = typeof proxyData.body === 'string' ? proxyData.body : JSON.stringify(proxyData.body, null, 2);
      let isJson = false;
      let parsedJson: any = null;

      try {
        parsedJson = JSON.parse(bodyText);
        isJson = true;
      } catch {}

      return {
        status: proxyData.status,
        statusText: proxyData.statusText || (proxyData.status === 200 ? 'OK' : ''),
        ok: proxyData.status >= 200 && proxyData.status < 300,
        timeMs: proxyData.timeMs || elapsed,
        sizeBytes: proxyData.sizeBytes || new Blob([bodyText]).size,
        headers: proxyData.headers || {},
        bodyText,
        contentType: proxyData.contentType || (isJson ? 'application/json' : 'text/plain'),
        isJson,
        parsedJson,
        curlCommand: generateCurlCommand(config, false),
        executedAt: new Date().toISOString(),
        viaProxy: true
      };
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      return {
        status: 0,
        statusText: 'Proxy Unreachable',
        ok: false,
        timeMs: elapsed,
        sizeBytes: 0,
        headers: {},
        bodyText: '',
        contentType: 'text/plain',
        isJson: false,
        errorType: 'network',
        errorMessage: `Failed to contact SamaXon proxy: ${err.message}`,
        curlCommand: generateCurlCommand(config, false),
        executedAt: new Date().toISOString(),
        viaProxy: true
      };
    }
  }

  // Direct Browser Fetch Mode
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 15000);

  try {
    const fetchOptions: RequestInit = {
      method: config.method,
      headers: effectiveHeaders,
      signal: controller.signal
    };

    if (body && !['GET', 'HEAD'].includes(config.method)) {
      fetchOptions.body = body;
    }

    const response = await fetch(finalUrl, fetchOptions);
    clearTimeout(timeoutId);
    const elapsed = Math.round(performance.now() - startTime);

    const resHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      resHeaders[key] = val;
    });

    const rawBodyText = await response.text();
    const sizeBytes = new Blob([rawBodyText]).size;
    const contentType = response.headers.get('content-type') || '';

    let isJson = false;
    let parsedJson: any = null;

    if (contentType.includes('application/json') || rawBodyText.trim().startsWith('{') || rawBodyText.trim().startsWith('[')) {
      try {
        parsedJson = JSON.parse(rawBodyText);
        isJson = true;
      } catch {}
    }

    return {
      status: response.status,
      statusText: response.statusText || (response.status === 200 ? 'OK' : ''),
      ok: response.ok,
      timeMs: elapsed,
      sizeBytes,
      headers: resHeaders,
      bodyText: rawBodyText,
      contentType,
      isJson,
      parsedJson,
      curlCommand: generateCurlCommand(config, false),
      executedAt: new Date().toISOString(),
      viaProxy: false
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const elapsed = Math.round(performance.now() - startTime);

    if (err.name === 'AbortError') {
      return {
        status: 0,
        statusText: 'Timeout',
        ok: false,
        timeMs: elapsed,
        sizeBytes: 0,
        headers: {},
        bodyText: '',
        contentType: '',
        isJson: false,
        errorType: 'timeout',
        errorMessage: `Request timed out after ${config.timeoutMs || 15000}ms.`,
        curlCommand: generateCurlCommand(config, false),
        executedAt: new Date().toISOString(),
        viaProxy: false
      };
    }

    // Classify CORS vs Network error
    // Browsers intentionally mask CORS errors behind a generic TypeError: Failed to fetch
    const isTypeError = err instanceof TypeError || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');

    return {
      status: 0,
      statusText: isTypeError ? 'CORS / Network Error' : 'Request Failed',
      ok: false,
      timeMs: elapsed,
      sizeBytes: 0,
      headers: {},
      bodyText: '',
      contentType: '',
      isJson: false,
      errorType: isTypeError ? 'cors' : 'network',
      errorMessage: isTypeError
        ? 'Cross-Origin Resource Sharing (CORS) restriction or network disconnect. Browsers block client-side fetch requests to origins that do not return Access-Control-Allow-Origin headers. Switch to "SamaXon Proxy" mode above to test public APIs.'
        : err.message || 'Unknown network error',
      curlCommand: generateCurlCommand(config, false),
      executedAt: new Date().toISOString(),
      viaProxy: false
    };
  }
}

/**
 * Generates cURL command with safe placeholder option
 */
export function generateCurlCommand(config: RequestConfig, redactSecrets = true): string {
  const finalUrl = buildComputedUrl(config.url, config.queryParams, config.auth);
  const effectiveHeaders = computeEffectiveHeaders(config, redactSecrets);
  const body = computeFinalRequestBody(config);

  const parts: string[] = ['curl', '-X', config.method];

  Object.entries(effectiveHeaders).forEach(([k, v]) => {
    parts.push('-H', `'${k}: ${v.replace(/'/g, "\\'")}'`);
  });

  if (body && !['GET', 'HEAD'].includes(config.method)) {
    // Escape single quotes for bash
    const escaped = body.replace(/'/g, "'\\''");
    parts.push('--data-raw', `'${escaped}'`);
  }

  parts.push(`'${finalUrl}'`);
  return parts.join(' ');
}

/**
 * Generates JavaScript Fetch snippet
 */
export function generateFetchSnippet(config: RequestConfig, redactSecrets = true): string {
  const finalUrl = buildComputedUrl(config.url, config.queryParams, config.auth);
  const headers = computeEffectiveHeaders(config, redactSecrets);
  const body = computeFinalRequestBody(config);

  const optionsObj: any = {
    method: config.method,
    headers: headers
  };

  if (body && !['GET', 'HEAD'].includes(config.method)) {
    optionsObj.body = body;
  }

  return `// JavaScript Fetch
const url = "${finalUrl}";
const options = ${JSON.stringify(optionsObj, null, 2)};

fetch(url, options)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Request failed:', err));`;
}

/**
 * Generates JavaScript Axios snippet
 */
export function generateAxiosSnippet(config: RequestConfig, redactSecrets = true): string {
  const finalUrl = buildComputedUrl(config.url, config.queryParams, config.auth);
  const headers = computeEffectiveHeaders(config, redactSecrets);
  const body = computeFinalRequestBody(config);

  return `// JavaScript (Axios)
import axios from 'axios';

axios({
  method: '${config.method.toLowerCase()}',
  url: '${finalUrl}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${body && !['GET', 'HEAD'].includes(config.method) ? `data: ${config.bodyType === 'json' ? body : JSON.stringify(body)},` : ''}
})
  .then(response => {
    console.log(response.status, response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });`;
}

/**
 * Generates Python Requests snippet
 */
export function generatePythonSnippet(config: RequestConfig, redactSecrets = true): string {
  const finalUrl = buildComputedUrl(config.url, config.queryParams, config.auth);
  const headers = computeEffectiveHeaders(config, redactSecrets);
  const body = computeFinalRequestBody(config);

  const headersPy = JSON.stringify(headers, null, 4);

  return `# Python 3 (Requests)
import requests

url = "${finalUrl}"
headers = ${headersPy}

${body && !['GET', 'HEAD'].includes(config.method) ? `payload = """${body.replace(/"""/g, '\\"\\"\\"')}"""\n` : ''}
response = requests.${config.method.toLowerCase()}(
    url,
    headers=headers${body && !['GET', 'HEAD'].includes(config.method) ? ', data=payload' : ''}
)

print(f"Status: {response.status_code}")
print(response.text)
`;
}

/**
 * Generates HTTP 1.1 raw request format
 */
export function generateRawHttpSnippet(config: RequestConfig, redactSecrets = true): string {
  const finalUrl = buildComputedUrl(config.url, config.queryParams, config.auth);
  let host = 'example.com';
  let path = '/';

  try {
    const u = new URL(finalUrl);
    host = u.host;
    path = u.pathname + u.search;
  } catch {}

  const headers = computeEffectiveHeaders(config, redactSecrets);
  const body = computeFinalRequestBody(config);

  const lines: string[] = [
    `${config.method} ${path} HTTP/1.1`,
    `Host: ${host}`
  ];

  Object.entries(headers).forEach(([k, v]) => {
    lines.push(`${k}: ${v}`);
  });

  if (body && !['GET', 'HEAD'].includes(config.method)) {
    lines.push(`Content-Length: ${new Blob([body]).size}`);
    lines.push('');
    lines.push(body);
  } else {
    lines.push('');
  }

  return lines.join('\r\n');
}

/**
 * Creates a sanitized copy of a request config for safe storage without persisting actual credentials
 */
export function sanitizeRequestConfigForStorage(config: RequestConfig): RequestConfig {
  return {
    ...config,
    auth: {
      ...config.auth,
      bearerToken: config.auth.bearerToken ? '••••••••' : '',
      basicPassword: config.auth.basicPassword ? '••••••••' : '',
      apiKeyValue: config.auth.apiKeyValue ? '••••••••' : ''
    },
    headers: config.headers.map(h => {
      if (/authorization|api-key|secret|token|password/i.test(h.key)) {
        return { ...h, value: '••••••••' };
      }
      return h;
    })
  };
}
