// Design system color generation & WCAG contrast calculation utilities

export interface ColorShade {
  step: number;
  hex: string;
  contrastOnWhite: number;
  contrastOnBlack: number;
}

// Convert Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Calculate relative luminance per WCAG 2.1
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Contrast ratio between two hex colors
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

// Mix two colors by percentage
export function mixColors(hex1: string, hex2: string, weight: number): string {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return hex1;

  const w = Math.max(0, Math.min(1, weight));
  const r = rgb1.r * (1 - w) + rgb2.r * w;
  const g = rgb1.g * (1 - w) + rgb2.g * w;
  const b = rgb1.b * (1 - w) + rgb2.b * w;

  return rgbToHex(r, g, b);
}

// Generate 11 Tailwind-standard shades from a primary base color
export function generateShadeScale(baseHex: string): Record<string, string> {
  const validHex = hexToRgb(baseHex) ? baseHex : '#D6B46A';

  return {
    '50': mixColors(validHex, '#FFFFFF', 0.94),
    '100': mixColors(validHex, '#FFFFFF', 0.85),
    '200': mixColors(validHex, '#FFFFFF', 0.70),
    '300': mixColors(validHex, '#FFFFFF', 0.50),
    '400': mixColors(validHex, '#FFFFFF', 0.25),
    '500': validHex,
    '600': mixColors(validHex, '#000000', 0.18),
    '700': mixColors(validHex, '#000000', 0.35),
    '800': mixColors(validHex, '#000000', 0.55),
    '900': mixColors(validHex, '#000000', 0.75),
    '950': mixColors(validHex, '#000000', 0.88)
  };
}

// Generate sophisticated neutrals with <5% warm or cool undertone
export function generateNeutrals(tone: 'warm' | 'cool' | 'slate'): Record<string, string> {
  const tint = tone === 'warm' ? '#F7F3EB' : tone === 'cool' ? '#EDF2F7' : '#F1F5F9';
  const darkTint = tone === 'warm' ? '#14120E' : tone === 'cool' ? '#0F172A' : '#111827';

  return {
    '50': mixColors('#FFFFFF', tint, 0.5),
    '100': mixColors('#F5F5F5', tint, 0.4),
    '200': mixColors('#E5E5E5', tint, 0.3),
    '300': mixColors('#D4D4D4', tint, 0.25),
    '400': mixColors('#A3A3A3', tint, 0.2),
    '500': mixColors('#737373', tint, 0.15),
    '600': mixColors('#525252', darkTint, 0.2),
    '700': mixColors('#404040', darkTint, 0.3),
    '800': mixColors('#262626', darkTint, 0.4),
    '900': mixColors('#171717', darkTint, 0.6),
    '950': darkTint
  };
}
