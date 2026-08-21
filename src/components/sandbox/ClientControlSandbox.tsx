import React, { useState, useCallback } from 'react';
import {
  SandboxState,
  IndustryKey,
  BrandAccentKey,
  InboundLead,
  LayoutStyle,
  FontPairing,
  CurrencyCode,
  PreviewMode,
} from './types';
import { INDUSTRY_PRESETS, INITIAL_INDUSTRY } from './constants/industryPresets';
import { THEME_ACCENTS, INITIAL_ACCENT } from './constants/themeColors';
import { CURRENCIES, INITIAL_CURRENCY } from './constants/currencies';
import { SandboxController } from './controller/SandboxController';
import { SandboxPreview } from './preview/SandboxPreview';
import { TelegramAlertDrawer } from './components/TelegramAlertDrawer';
import { ArchitectureSpecModal } from './components/ArchitectureSpecModal';
import { SandboxFooterBar } from './components/SandboxFooterBar';

export const ClientControlSandbox: React.FC = () => {
  const initialPreset = INDUSTRY_PRESETS[INITIAL_INDUSTRY];

  // Initial dummy leads for realistic staging feel
  const initialLeads: InboundLead[] = [
    {
      id: 'lead-init-1',
      customerName: 'Singhania Family Trust',
      phoneNumber: '+91 98110-XXXXX',
      inquiryType: 'Ultra-Luxury Penthouse Inventory',
      estimatedBudget: '₹1,20,000',
      timestamp: '2 mins ago',
      status: 'HOT_LEAD',
      rawWebhookPayload: {
        event: 'lead.inbound_captured',
        lead_id: 'lead-init-1',
        name: 'Singhania Family Trust',
        industry: 'real-estate',
        currency: 'INR',
        budget_value: 120000,
        source: 'Landing_Hero_CTA',
        edge_route: 'del-01.cdn.samaxon.site',
        edge_latency_ms: 280,
      },
    },
    {
      id: 'lead-init-2',
      customerName: 'Oberoi Ventures Mumbai',
      phoneNumber: '+91 97234-XXXXX',
      inquiryType: 'Private Investor Allocation',
      estimatedBudget: '₹1,20,000',
      timestamp: '14 mins ago',
      status: 'DISPATCHED_TO_CRM',
      rawWebhookPayload: {
        event: 'lead.crm_dispatched',
        lead_id: 'lead-init-2',
        name: 'Oberoi Ventures Mumbai',
        industry: 'real-estate',
        currency: 'INR',
        budget_value: 120000,
        crm_status: 'SYNCED_SALESFORCE',
        edge_latency_ms: 280,
      },
    },
  ];

  const [state, setState] = useState<SandboxState>({
    industry: INITIAL_INDUSTRY,
    brandAccent: INITIAL_ACCENT,
    layoutStyle: 'bespoke-luxury',
    fontPairing: 'editorial-serif',
    currency: INITIAL_CURRENCY,
    previewMode: 'live-site',
    deviceView: 'desktop',
    headline: initialPreset.defaultHeadline,
    subheadline: initialPreset.defaultSubheadline,
    ctaText: initialPreset.defaultCtaText,
    showPromoBanner: true,
    promoBannerText: initialPreset.promoText,
    bookingStatus: 'available',
    pricingValue: initialPreset.defaultPrice,
    maintenanceMode: false,
    isWhatsAppChatOpen: false,
    isBookingModalOpen: false,
    leads: initialLeads,
    activeTab: 'brand',
    isSimulatingLead: false,
    lastSimulatedLatencyMs: 280,
  });

  const [telegramDrawerOpen, setTelegramDrawerOpen] = useState<boolean>(false);
  const [specModalOpen, setSpecModalOpen] = useState<boolean>(false);
  const [latestLead, setLatestLead] = useState<InboundLead | null>(initialLeads[0]);

  const activePreset = INDUSTRY_PRESETS[state.industry];
  const activeAccent = THEME_ACCENTS[state.brandAccent];
  const activeCurrencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;

  // 1. Industry Preset Change Handler
  const handleIndustryChange = useCallback((id: IndustryKey) => {
    const newPreset = INDUSTRY_PRESETS[id];
    setState((prev) => ({
      ...prev,
      industry: id,
      headline: newPreset.defaultHeadline,
      subheadline: newPreset.defaultSubheadline,
      ctaText: newPreset.defaultCtaText,
      promoBannerText: newPreset.promoText,
      pricingValue: newPreset.defaultPrice,
    }));
  }, []);

  // 2. Accent Theme Change Handler
  const handleAccentChange = useCallback((accent: BrandAccentKey) => {
    setState((prev) => ({ ...prev, brandAccent: accent }));
  }, []);

  // 3. Layout Style & Typography Handlers
  const handleLayoutStyleChange = useCallback((layout: LayoutStyle) => {
    setState((prev) => ({ ...prev, layoutStyle: layout }));
  }, []);

  const handleFontPairingChange = useCallback((font: FontPairing) => {
    setState((prev) => ({ ...prev, fontPairing: font }));
  }, []);

  // 4. Currency Switcher Handler
  const handleCurrencyChange = useCallback((currency: CurrencyCode) => {
    setState((prev) => ({ ...prev, currency }));
  }, []);

  // 5. Preview Mode Handler
  const handlePreviewModeChange = useCallback((previewMode: PreviewMode) => {
    setState((prev) => ({ ...prev, previewMode }));
  }, []);

  // 6. Tab Change Handler
  const handleTabChange = useCallback((tab: 'brand' | 'ops' | 'leads' | 'telemetry') => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  // 7. Inbound Lead Simulation Lifecycle with Live Status Transitions
  const handleSimulateLead = useCallback(() => {
    const randomLatency = Math.floor(240 + Math.random() * 80); // e.g. 280ms
    setState((prev) => ({
      ...prev,
      isSimulatingLead: true,
      lastSimulatedLatencyMs: randomLatency,
    }));

    const randomNames = activePreset.leadSampleNames;
    const chosenName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const phone = `+91 98${Math.floor(10 + Math.random() * 89)}-${randomDigits}`;
    const newLeadId = `lead-${Date.now()}`;
    const formattedBudget = activeCurrencyConfig.format(state.pricingValue);

    const initialIngestingLead: InboundLead = {
      id: newLeadId,
      customerName: chosenName,
      phoneNumber: phone,
      inquiryType: `${activePreset.label} Private Inquiry`,
      estimatedBudget: formattedBudget,
      timestamp: 'Just now',
      status: 'INGESTING',
      rawWebhookPayload: {
        event: 'lead.inbound_captured',
        lead_id: newLeadId,
        customer_name: chosenName,
        phone_number: phone,
        industry: state.industry,
        currency: state.currency,
        projected_ticket: state.pricingValue,
        formatted_budget: formattedBudget,
        booking_state: state.bookingStatus,
        timestamp: new Date().toISOString(),
        edge_latency_ms: randomLatency,
        source_origin: 'Client_OS_Interactive_Sandbox',
      },
    };

    setLatestLead(initialIngestingLead);
    setState((prev) => ({
      ...prev,
      leads: [initialIngestingLead, ...prev.leads],
    }));

    // Transition 1: Verified HOT_LEAD
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isSimulatingLead: false,
        leads: prev.leads.map((l) =>
          l.id === newLeadId ? { ...l, status: 'HOT_LEAD' } : l
        ),
      }));

      // Slide open Telegram Drawer to showcase instant push channel
      setTelegramDrawerOpen(true);

      // Transition 2: Dispatched to CRM
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === newLeadId ? { ...l, status: 'DISPATCHED_TO_CRM' } : l
          ),
        }));
      }, 1500);
    }, 450);
  }, [activePreset, state.industry, state.pricingValue, state.bookingStatus, state.currency, activeCurrencyConfig]);

  // 8. Reset to Industry Defaults
  const handleReset = useCallback(() => {
    const currentPreset = INDUSTRY_PRESETS[state.industry];
    setState((prev) => ({
      ...prev,
      brandAccent: INITIAL_ACCENT,
      layoutStyle: 'bespoke-luxury',
      fontPairing: 'editorial-serif',
      currency: INITIAL_CURRENCY,
      previewMode: 'live-site',
      headline: currentPreset.defaultHeadline,
      subheadline: currentPreset.defaultSubheadline,
      ctaText: currentPreset.defaultCtaText,
      showPromoBanner: true,
      promoBannerText: currentPreset.promoText,
      bookingStatus: 'available',
      pricingValue: currentPreset.defaultPrice,
      maintenanceMode: false,
      deviceView: 'desktop',
    }));
  }, [state.industry]);

  return (
    <div className="w-full space-y-6 sm:space-y-8" id="enterprise-client-os-sandbox">
      {/* Side-by-Side Responsive Layout Grid (5 cols Controller / 7 cols Preview on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Admin Controller Deck (5 cols) */}
        <div className="lg:col-span-5 w-full order-2 lg:order-1">
          <SandboxController
            state={state}
            accent={activeAccent}
            preset={activePreset}
            onTabChange={handleTabChange}
            onIndustryChange={handleIndustryChange}
            onAccentChange={handleAccentChange}
            onLayoutStyleChange={handleLayoutStyleChange}
            onFontPairingChange={handleFontPairingChange}
            onCurrencyChange={handleCurrencyChange}
            onPreviewModeChange={handlePreviewModeChange}
            onHeadlineChange={(headline) => setState((p) => ({ ...p, headline }))}
            onSubheadlineChange={(subheadline) => setState((p) => ({ ...p, subheadline }))}
            onCtaChange={(ctaText) => setState((p) => ({ ...p, ctaText }))}
            onTogglePromo={(showPromoBanner) => setState((p) => ({ ...p, showPromoBanner }))}
            onPromoTextChange={(promoBannerText) => setState((p) => ({ ...p, promoBannerText }))}
            onBookingStatusChange={(bookingStatus) => setState((p) => ({ ...p, bookingStatus }))}
            onPricingChange={(pricingValue) => setState((p) => ({ ...p, pricingValue }))}
            onMaintenanceToggle={(maintenanceMode) => setState((p) => ({ ...p, maintenanceMode }))}
            onSimulateLead={handleSimulateLead}
            onOpenTelegramDrawer={() => setTelegramDrawerOpen(true)}
            onOpenSpecModal={() => setSpecModalOpen(true)}
          />
        </div>

        {/* Right Column: Live Viewport Staging Frame (7 cols) */}
        <div className="lg:col-span-7 w-full order-1 lg:order-2 sticky top-28">
          <SandboxPreview
            state={state}
            accent={activeAccent}
            preset={activePreset}
            onDeviceChange={(deviceView) => setState((p) => ({ ...p, deviceView }))}
            onPreviewModeChange={handlePreviewModeChange}
            onCtaClick={handleSimulateLead}
            onReset={handleReset}
            onSimulateLead={handleSimulateLead}
          />
        </div>
      </div>

      {/* Conversion Dock & WhatsApp Generator */}
      <div className="w-full">
        <SandboxFooterBar
          state={state}
          accent={activeAccent}
          preset={activePreset}
          onReset={handleReset}
          onOpenSpecModal={() => setSpecModalOpen(true)}
        />
      </div>

      {/* Telegram Alert Modal Drawer */}
      <TelegramAlertDrawer
        isOpen={telegramDrawerOpen}
        onClose={() => setTelegramDrawerOpen(false)}
        state={state}
        accent={activeAccent}
        preset={activePreset}
        latestLead={latestLead}
      />

      {/* Architecture Spec Sheet Export Modal */}
      <ArchitectureSpecModal
        isOpen={specModalOpen}
        onClose={() => setSpecModalOpen(false)}
        state={state}
        accent={activeAccent}
        preset={activePreset}
      />
    </div>
  );
};
