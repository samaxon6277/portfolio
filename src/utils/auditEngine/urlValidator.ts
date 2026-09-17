/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - URL Validation & SSRF Guard
 */

export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  parsedUrl?: URL;
  hostname?: string;
  error?: string;
}

const FORBIDDEN_PROTOCOLS = new Set(['javascript:', 'data:', 'file:', 'ftp:', 'blob:', 'ws:', 'wss:', 'mailto:', 'gopher:']);

const FORBIDDEN_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '::',
  '169.254.169.254',
  'metadata.google.internal',
  'instance-data',
  'metadata',
  'ip6-localhost',
  'ip6-loopback'
]);

export function isPrivateOrLocalHost(hostname: string): boolean {
  let norm = hostname.toLowerCase().trim();
  // Strip IPv6 brackets [::1] -> ::1
  if (norm.startsWith('[') && norm.endsWith(']')) {
    norm = norm.slice(1, -1);
  }

  if (FORBIDDEN_HOSTS.has(norm)) {
    return true;
  }

  // IPv6 loopback, link-local, unique local address
  if (norm === '::1' || norm === '::' || norm.startsWith('fe80:') || norm.startsWith('fc00:') || norm.startsWith('fd')) {
    return true;
  }

  // Common local domains
  if (
    norm.endsWith('.local') ||
    norm.endsWith('.localhost') ||
    norm.endsWith('.internal') ||
    norm.endsWith('.lan') ||
    norm.endsWith('.home.arpa') ||
    norm.endsWith('.corp')
  ) {
    return true;
  }

  // Decimal / hex / octal IP representation bypass (e.g. 2130706433, 0x7f000001)
  if (/^\d+$/.test(norm) || /^0x[0-9a-f]+$/i.test(norm)) {
    return true;
  }

  // IPv4 Private Range checks:
  // 10.0.0.0/8
  // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
  // 192.168.0.0/16
  // 127.0.0.0/8 (loopback)
  // 169.254.0.0/16 (link-local / cloud metadata)
  // 100.64.0.0/10 (carrier-grade NAT)
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = norm.match(ipv4Regex);
  if (match) {
    const oct1 = parseInt(match[1], 10);
    const oct2 = parseInt(match[2], 10);
    const oct3 = parseInt(match[3], 10);
    const oct4 = parseInt(match[4], 10);

    if (oct1 > 255 || oct2 > 255 || oct3 > 255 || oct4 > 255) {
      return true; // invalid IP
    }

    if (oct1 === 10) return true;
    if (oct1 === 127) return true;
    if (oct1 === 0) return true;
    if (oct1 === 169 && oct2 === 254) return true;
    if (oct1 === 192 && oct2 === 168) return true;
    if (oct1 === 172 && oct2 >= 16 && oct2 <= 31) return true;
    if (oct1 === 100 && oct2 >= 64 && oct2 <= 127) return true;
  }

  return false;
}

export function validateAndNormalizeUrl(rawInput: string): UrlValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isValid: false, error: 'Target website URL is required.' };
  }

  let cleaned = rawInput.trim();

  // Basic sanity length
  if (cleaned.length < 3 || cleaned.length > 2048) {
    return { isValid: false, error: 'URL length must be between 3 and 2048 characters.' };
  }

  // Reject dangerous protocols
  for (const protocol of FORBIDDEN_PROTOCOLS) {
    if (cleaned.toLowerCase().startsWith(protocol)) {
      return { isValid: false, error: `Protocol "${protocol}" is strictly prohibited for security.` };
    }
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    return { isValid: false, error: 'Invalid URL format. Please enter a valid domain (e.g., example.com).' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Only HTTP and HTTPS websites can be audited.' };
  }

  if (!parsed.hostname || parsed.hostname.length < 3 || !parsed.hostname.includes('.')) {
    return { isValid: false, error: 'Please specify a valid public top-level domain (e.g., mysite.com).' };
  }

  if (isPrivateOrLocalHost(parsed.hostname)) {
    return { isValid: false, error: 'Security restriction: Private, loopback, and internal addresses cannot be audited.' };
  }

  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
    parsedUrl: parsed,
    hostname: parsed.hostname
  };
}
