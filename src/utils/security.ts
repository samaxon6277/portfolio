/**
 * Security & Data Sanitization Library
 * SamaXon Digital Solutions Core Architecture
 * 
 * Protects against XSS, injection vectors, malicious parameter pollution,
 * and normalizes user input before persistence or network transit.
 */

// HTML entity map for escaping untrusted characters
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * Escapes characters that can break HTML or script contexts
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=\/]/g, (s) => HTML_ESCAPE_MAP[s] || s);
}

/**
 * Strips script tags, javascript: pseudo-protocols, event attributes (e.g. onerror=),
 * and bounds maximum string length to prevent memory amplification attacks.
 */
export function sanitizeString(input: unknown, maxLength = 500): string {
  if (input === null || input === undefined) return '';
  let str = String(input).trim();

  // Strip control characters & null bytes
  str = str.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '');

  // Strip HTML tag structures (<...>)
  str = str.replace(/<[^>]*>?/gm, '');

  // Strip javascript:, data:, vbscript: protocol prefixes
  str = str.replace(/(javascript|vbscript|data):/gi, '');

  // Strip inline event handler patterns like onload=, onerror=, onclick=
  str = str.replace(/on\w+\s*=/gi, '');

  // Bound string length
  if (str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  return str;
}

/**
 * Validates and strictly sanitizes an email address against RFC 5322 compliance
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase();
  
  // RFC compliant standard email check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed) || trimmed.length > 254) {
    return '';
  }
  return trimmed;
}

/**
 * Validates and sanitizes a phone / WhatsApp number, stripping unwanted symbols
 */
export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  // Keep digits and leading plus sign
  const cleaned = phone.replace(/[^0-9+]/g, '').trim();
  if (cleaned.length < 8 || cleaned.length > 18) {
    return '';
  }
  return cleaned;
}

/**
 * Sanitizes URLs to ensure they only use http or https protocols (prevents javascript: URLs)
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // If relative URL starting with '/', verify no double-slash protocol hijacking
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed;
    }
  }
  return '';
}
