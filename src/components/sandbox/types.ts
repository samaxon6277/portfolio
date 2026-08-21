import type { Dispatch, SetStateAction } from 'react';

export type IndustryKey = 'real-estate' | 'luxury-hospitality' | 'aesthetic-clinic' | 'd2c-luxury';

export type BrandAccentKey = 'champagne-gold' | 'cyber-emerald' | 'deep-sapphire' | 'rose-titanium';

export type LayoutStyle = 'bespoke-luxury' | 'high-velocity-saas' | 'minimalist-dark';

export type FontPairing = 'modern-sans' | 'editorial-serif';

export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'EUR';

export type PreviewMode = 'live-site' | 'google-serp' | 'social-og';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateMultiplier: number;
  format: (amount: number) => string;
}

export interface AccentColorToken {
  id: BrandAccentKey;
  name: string;
  hex: string;
  rgb: string;
  glow: string;
  borderHover: string;
  bgGrad: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonText: string;
}

export interface IndustryPreset {
  id: IndustryKey;
  label: string;
  badge: string;
  defaultHeadline: string;
  defaultSubheadline: string;
  defaultCtaText: string;
  defaultPrice: number;
  promoText: string;
  heroTagline: string;
  leadSampleNames: string[];
  metaDescription: string;
  serviceCards: Array<{
    title: string;
    subtitle: string;
    badge: string;
  }>;
}

export interface InboundLead {
  id: string;
  customerName: string;
  phoneNumber: string;
  inquiryType: string;
  estimatedBudget: string;
  timestamp: string;
  status: 'HOT_LEAD' | 'DISPATCHED_TO_CRM' | 'INGESTING';
  rawWebhookPayload: Record<string, unknown>;
}

export interface SandboxState {
  industry: IndustryKey;
  brandAccent: BrandAccentKey;
  layoutStyle: LayoutStyle;
  fontPairing: FontPairing;
  currency: CurrencyCode;
  previewMode: PreviewMode;
  deviceView: 'desktop' | 'mobile';
  headline: string;
  subheadline: string;
  ctaText: string;
  showPromoBanner: boolean;
  promoBannerText: string;
  bookingStatus: 'available' | 'urgency_2_slots' | 'waitlist_only';
  pricingValue: number;
  maintenanceMode: boolean;
  isWhatsAppChatOpen: boolean;
  isBookingModalOpen: boolean;
  leads: InboundLead[];
  activeTab: 'brand' | 'ops' | 'leads' | 'telemetry';
  isSimulatingLead: boolean;
  lastSimulatedLatencyMs: number;
}

export interface SandboxContextValue {
  state: SandboxState;
  setState: Dispatch<SetStateAction<SandboxState>>;
  setIndustry: (id: IndustryKey) => void;
  setBrandAccent: (accent: BrandAccentKey) => void;
  setLayoutStyle: (layout: LayoutStyle) => void;
  setFontPairing: (font: FontPairing) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setHeadline: (headline: string) => void;
  setSubheadline: (subheadline: string) => void;
  setCtaText: (ctaText: string) => void;
  setShowPromoBanner: (show: boolean) => void;
  setPromoBannerText: (text: string) => void;
  setBookingStatus: (status: 'available' | 'urgency_2_slots' | 'waitlist_only') => void;
  setPricingValue: (price: number) => void;
  setMaintenanceMode: (maintenance: boolean) => void;
  setDeviceView: (device: 'desktop' | 'mobile') => void;
  setActiveTab: (tab: 'brand' | 'ops' | 'leads' | 'telemetry') => void;
  simulateLeadSubmission: () => void;
  resetToDefaults: () => void;
  telegramDrawerOpen: boolean;
  setTelegramDrawerOpen: (open: boolean) => void;
  specModalOpen: boolean;
  setSpecModalOpen: (open: boolean) => void;
  latestLead: InboundLead | null;
}
