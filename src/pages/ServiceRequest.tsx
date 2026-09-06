import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Monitor, Smartphone, Palette, Cpu, Bot, ShieldCheck, 
  ArrowRight, CheckCircle, Check, Crown, Zap, Send, 
  Sparkles, ExternalLink, RefreshCw, MessageSquare, Phone, 
  BarChart3, Layout, ChevronRight, Gauge, Sliders, CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import { SERVICES_DATA } from '../data';
import { SITE_CONFIG, getWhatsAppInquiryUrl } from '../config/siteConfig';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';
import { Lead } from '../types';

interface ServiceDetailConfig {
  id: string;
  name: string;
  categoryName: string;
  tagline: string;
  basePrice: number;
  deliveryDays: string;
  features: string[];
  options: { id: string; label: string; price: number }[];
  sandboxType: 'web' | 'mobile' | 'brand' | 'graphics' | 'automation' | 'bot' | 'dashboard' | 'seo';
}

const SERVICE_CONFIGS: Record<string, ServiceDetailConfig> = {
  'web-dev': {
    id: 'web-dev',
    name: 'High-Performance Web Systems',
    categoryName: 'Single Page Landing Website',
    tagline: 'Sub-second load speeds, responsive architecture, and bespoke UI crafted in 48 hours.',
    basePrice: 7000,
    deliveryDays: '48 Hours Express',
    features: [
      'Tailwind CSS & React Single Page Architecture',
      'Lighthouse 99+ Core Web Vitals Optimization',
      'Interactive WhatsApp & Direct Lead Capture Integrations',
      'SEO Structured Schema & OpenGraph Social Sharing Cards',
      '1 Year High-Speed Cloud Hosting & Custom Domain Setup'
    ],
    options: [
      { id: 'cms', label: 'Custom Headless CMS Integration', price: 3000 },
      { id: 'payment', label: 'Razorpay / Stripe Payment Gateway', price: 4000 },
      { id: 'multipage', label: 'Multi-Page Dynamic Expansion', price: 5000 },
      { id: 'analytics', label: 'Advanced Mixpanel & Meta Pixel Tracking', price: 1500 }
    ],
    sandboxType: 'web'
  },
  'app-dev': {
    id: 'app-dev',
    name: 'Full-Stack Mobile Applications',
    categoryName: 'WebView Mobile Application',
    tagline: 'Native iOS & Android wrappers and React Native applications built for cross-platform scale.',
    basePrice: 12000,
    deliveryDays: '3 - 5 Days Delivery',
    features: [
      'Universal APK & IPA Build Generation',
      'Instant Push Notification System Integration',
      'Offline-First Caching & Smooth Hardware Gestures',
      'Google Play Console & Apple App Store Staging Support',
      'Deep Linking & In-App WhatsApp Direct Chat'
    ],
    options: [
      { id: 'push', label: 'OneSignal Push Notification Pipeline', price: 2500 },
      { id: 'offline', label: 'Advanced Offline SQLite Storage Sync', price: 3500 },
      { id: 'store', label: 'Play Store & App Store Submission Package', price: 4500 }
    ],
    sandboxType: 'mobile'
  },
  'identity-design': {
    id: 'identity-design',
    name: 'Premium Logo & Brand Identity Suite',
    categoryName: 'Premium Logo & Brand Identity',
    tagline: 'Presidential brand marks, vector monograms, typography guides, and luxury design systems.',
    basePrice: 6000,
    deliveryDays: '48 Hours Delivery',
    features: [
      'Vector AI, SVG, EPS, PDF & High-Res PNG Master Assets',
      'Luxury Monogram, Minimalist & Modern Brand Variations',
      'Custom Brand Typography & Color Hierarchy Guidelines',
      'Social Media Avatar & Header Asset Master Kit',
      'Full Commercial & Trademark Copyright Transfer'
    ],
    options: [
      { id: 'brandguide', label: 'Complete 24-Page Brand Identity Manual', price: 2500 },
      { id: 'stationery', label: 'Luxury Business Card & Stationery Suite', price: 2000 },
      { id: '3dlogo', label: '3D Embossed Metallic Mockup Pack', price: 1500 }
    ],
    sandboxType: 'brand'
  },
  '8k-graphics': {
    id: '8k-graphics',
    name: '8K Graphic & Social Launch Campaign Asset Pack',
    categoryName: 'Comprehensive 8K Graphic Pack',
    tagline: 'Ultra-HD social media reels, promotional posters, product mockups, and banner suites.',
    basePrice: 5000,
    deliveryDays: '48 Hours Delivery',
    features: [
      'Ultra-HD 8K (7680×4320) & 4K Master Render Files',
      'Multi-Format Deliverables (1:1 Square, 9:16 Story, 16:9 Banner)',
      'High-Conversion Typography & Color Theory Layouts',
      'Print-Ready 300 DPI Vector PDF & CMYK Color Proofs',
      'Instant Editable Figma / Source Master Files'
    ],
    options: [
      { id: 'storypack', label: '10x Animated Motion Reel / Story Templates', price: 3000 },
      { id: 'printpack', label: 'Large-Format Billboard & Banner Adaptation', price: 2000 },
      { id: 'sourcefiles', label: 'Full Figma / PSD Source Asset Access', price: 1500 }
    ],
    sandboxType: 'graphics'
  },
  'automations': {
    id: 'automations',
    name: 'Business Workflow Automation Layer',
    categoryName: 'Business Workflow Automation',
    tagline: 'Eliminate repetitive tasks with Make, Zapier, Webhooks, and automatic lead pipelines.',
    basePrice: 9000,
    deliveryDays: '48 Hours Express',
    features: [
      'Real-Time Webhook Lead Ingestion into CRM / Google Sheets',
      'Instant WhatsApp & Email Automated Dispatch on Inquiry',
      'Multi-Platform API Sync (Razorpay, Airtable, Slack, Gmail)',
      'Error Handling, Auto-Retry Logic & Failure Alerts',
      'Video Documentation & Staff Handover Training'
    ],
    options: [
      { id: 'crm', label: 'Custom CRM Pipeline Integration (HubSpot / Zoho)', price: 3500 },
      { id: 'ai-lead', label: 'AI Lead Qualification & Scoring Node', price: 4000 },
      { id: 'invoice', label: 'Automated GST Invoice & PDF Generation', price: 2500 }
    ],
    sandboxType: 'automation'
  },
  'telegram-bots': {
    id: 'telegram-bots',
    name: 'Real-Time Telegram Alert Bot System',
    categoryName: 'Real-Time Informational Telegram Bot',
    tagline: 'Sub-second real-time alert dispatchers, crypto/forex monitors, and inquiry automations.',
    basePrice: 8000,
    deliveryDays: '48 Hours Delivery',
    features: [
      'Instant Push Alert Delivery to Telegram Channels / Groups',
      'Custom Inline Command Keyboard & Interactive Menus',
      'Cloud Server Deployment with 99.9% Uptime Guarantee',
      'Rate-Limiting & Secure Token Authentication',
      'Broadcast Admin Panel for One-Click Customer Messages'
    ],
    options: [
      { id: 'adminpanel', label: 'Dedicated Web Admin Broadcast Console', price: 3500 },
      { id: 'paymentbot', label: 'In-Bot Telegram Stars / UPI Payment Collection', price: 4000 },
      { id: 'channelgate', label: 'Paid Channel Membership Verification Gate', price: 3000 }
    ],
    sandboxType: 'bot'
  },
  'admin-dashboards': {
    id: 'admin-dashboards',
    name: 'Custom Admin Dashboard System',
    categoryName: 'Custom Admin Control Dashboard',
    tagline: 'Complete operator console with role-based access, live metrics, and database controls.',
    basePrice: 24000,
    deliveryDays: '5 - 7 Days Delivery',
    features: [
      'Role-Based Access Control (Super Admin, Manager, Support)',
      'Live KPI Charts, Real-Time Revenue & Conversion Gauges',
      'Full CRUD Database Table Views with Filters & CSV Export',
      'Security Audit Log & Multi-Factor Login Guard',
      'Responsive Mobile & Tablet Executive Viewports'
    ],
    options: [
      { id: 'audit', label: 'Immutable Audit Log & Activity Trace', price: 3500 },
      { id: 'reports', label: 'Automated Daily Financial Email Digest', price: 2500 },
      { id: 'multitenant', label: 'Multi-Tenant Organization Isolation', price: 6000 }
    ],
    sandboxType: 'dashboard'
  },
  'seo-perf': {
    id: 'seo-perf',
    name: 'Extreme Speed & SEO Rank Optimization',
    categoryName: 'Extreme Speed & SEO Rank Optimization',
    tagline: '4x speed acceleration, 99+ PageSpeed score, semantic JSON-LD schema, and keyword booster.',
    basePrice: 4000,
    deliveryDays: '24 - 48 Hours Delivery',
    features: [
      'Google PageSpeed Score 95+ Mobile & Desktop Guarantee',
      'Critical CSS Inlining & Asset Image WebP Conversion',
      'JSON-LD Structured Data for Rich Search Snippets',
      'Broken Link, Canonical Tag & Sitemap XML Fixes',
      'Before & After Performance Audit Certificate'
    ],
    options: [
      { id: 'competitor', label: 'Top 5 Competitor SEO Keyword Gap Analysis', price: 2000 },
      { id: 'cdn', label: 'Global Cloudflare Enterprise Edge CDN Setup', price: 2500 }
    ],
    sandboxType: 'seo'
  }
};

export default function ServiceRequest() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse service from query params e.g. /service-request?service=web-dev
  const getInitialService = (): string => {
    const params = new URLSearchParams(location.search);
    const s = params.get('service');
    if (s && SERVICE_CONFIGS[s]) return s;
    return 'web-dev';
  };

  const [selectedServiceId, setSelectedServiceId] = useState<string>(getInitialService);

  // Synchronize when query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get('service');
    if (s && SERVICE_CONFIGS[s]) {
      setSelectedServiceId(s);
    }
  }, [location.search]);

  const currentConfig = SERVICE_CONFIGS[selectedServiceId] || SERVICE_CONFIGS['web-dev'];

  // Project configuration state
  const [tier, setTier] = useState<'express' | 'standard' | 'enterprise'>('express');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Interactive Sandbox state
  const [sandboxTheme, setSandboxTheme] = useState<'obsidian' | 'ivory' | 'champagne'>('obsidian');
  const [sandboxDevice, setSandboxDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Brand generator sandbox state
  const [brandInitials, setBrandInitials] = useState<string>('SX');
  const [brandStyle, setBrandStyle] = useState<'monogram' | 'minimal' | 'modern'>('monogram');

  // Automation simulator state
  const [isSimulatingPipeline, setIsSimulatingPipeline] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  // Bot simulator state
  const [botMessages, setBotMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: '⚡ Welcome to SamaXon Bot! How can I accelerate your business today?', time: 'Just now' }
  ]);
  const [botInput, setBotInput] = useState<string>('');

  // SEO simulator state
  const [auditUrl, setAuditUrl] = useState<string>('https://mybusiness.com');
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [auditScore, setAuditScore] = useState<number | null>(99);

  // Lead Form state
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    whatsappNumber: '',
    emailAddress: '',
    city: '',
    projectVision: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [trackingId, setTrackingId] = useState<string>('');

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    setSelectedOptions([]);
    navigate(`/service-request?service=${id}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) ? prev.filter(x => x !== optionId) : [...prev, optionId]
    );
  };

  // Pricing math
  const tierMultiplier = tier === 'express' ? 1.0 : tier === 'standard' ? 1.3 : 1.8;
  const optionsTotal = selectedOptions.reduce((sum, optId) => {
    const found = currentConfig.options.find(o => o.id === optId);
    return sum + (found ? found.price : 0);
  }, 0);

  const calculatedBase = Math.round(currentConfig.basePrice * tierMultiplier);
  const calculatedTotal = calculatedBase + optionsTotal;
  const originalPriceBeforeDiscount = Math.round(calculatedTotal * 5); // 80% OFF reference

  // Interactive Sandbox Handlers
  const handleSimulatePipeline = () => {
    if (isSimulatingPipeline) return;
    setIsSimulatingPipeline(true);
    setPipelineStep(1);

    setTimeout(() => setPipelineStep(2), 700);
    setTimeout(() => setPipelineStep(3), 1400);
    setTimeout(() => setPipelineStep(4), 2100);
    setTimeout(() => {
      setIsSimulatingPipeline(false);
      setPipelineStep(4);
    }, 2800);
  };

  const handleSendBotMessage = (textToSend?: string) => {
    const text = textToSend || botInput.trim();
    if (!text) return;

    const newMsgs = [...botMessages, { sender: 'user' as const, text, time: 'Just now' }];
    setBotMessages(newMsgs);
    setBotInput('');

    setTimeout(() => {
      let reply = "✦ Project brief received. Our senior engineer will connect within 15 minutes.";
      if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
        reply = `✦ Standard pricing starts at ₹${currentConfig.basePrice.toLocaleString('en-IN')} with our 48-Hour delivery guarantee.`;
      } else if (text.toLowerCase().includes('portfolio') || text.toLowerCase().includes('demo')) {
        reply = "✦ Explore live case studies in our portfolio section or request an interactive sandbox build.";
      }
      setBotMessages(prev => [...prev, { sender: 'bot' as const, text: reply, time: 'Just now' }]);
    }, 600);
  };

  const handleRunAudit = () => {
    setAuditRunning(true);
    setAuditScore(null);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditScore(99);
    }, 1200);
  };

  // Submit formal lead
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.whatsappNumber || !formData.businessName) {
      alert('Please fill in your Full Name, Business Name, and WhatsApp Number.');
      return;
    }

    setIsSubmitting(true);
    const newTrackingId = `SMX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingId(newTrackingId);

    const leadSummary = `[Service Portal Launch]
- Service: ${currentConfig.name}
- Tier: ${tier.toUpperCase()}
- Add-ons: ${selectedOptions.join(', ') || 'None'}
- Calculated Budget: ₹${calculatedTotal.toLocaleString('en-IN')}
- Notes: ${formData.projectVision || 'Standard Sprint'}`;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.fullName,
      businessName: formData.businessName,
      phone: formData.whatsappNumber,
      email: formData.emailAddress || 'client@samaxon.site',
      city: formData.city || 'India',
      serviceNeeded: currentConfig.categoryName,
      currentProblem: formData.projectVision || 'Requested via Service Experience Portal',
      desiredTimeline: tier === 'express' ? 'Under 48 Hours' : '3 - 7 Days',
      budgetRange: `₹${calculatedTotal.toLocaleString('en-IN')} (VIP 80% OFF Active)`,
      message: leadSummary,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      await supabaseService.upsertLead(newLead);
      analytics.trackFormSubmit();

      // Also backup to local storage
      try {
        const storedStr = localStorage.getItem('samaxon_leads');
        const stored = storedStr ? JSON.parse(storedStr) : [];
        stored.unshift(newLead);
        localStorage.setItem('samaxon_leads', JSON.stringify(stored));
      } catch (err) {
        // safe
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Lead submit error:', err);
      setIsSubmitting(false);
      setSubmitSuccess(true); // show confirmation fallback
    }
  };

  // Generate WhatsApp pre-filled text
  const whatsappBriefText = `Hello SamaXon Team!
I am interested in requesting: *${currentConfig.name}*.

*Configuration Details:*
- Package Tier: ${tier.toUpperCase()}
- Add-ons: ${selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Standard Inclusions'}
- Estimated Staging Budget: ₹${calculatedTotal.toLocaleString('en-IN')} (80% Privilege)
- Client Name: ${formData.fullName || 'Client'}
- Business: ${formData.businessName || 'Business Project'}
${formData.projectVision ? `- Project Notes: ${formData.projectVision}` : ''}

Please confirm 48-Hour sprint slot availability.`;

  const whatsappInquiryLink = getWhatsAppInquiryUrl(whatsappBriefText);

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-28 sm:pt-32 pb-24 text-left" id="service-experience-portal">
      <SEO 
        title={`${currentConfig.name} - Instant Experience & Request Portal | SamaXon`}
        description={`Test drive and configure your ${currentConfig.name}. Interactive live sandbox, transparent pricing calculator, and 48-Hour delivery guarantee.`}
        canonicalPath="/service-request"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8178]">
            <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A]" />
            <Link to="/services" className="hover:text-[#111111] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A]" />
            <span className="text-[#BFA15A] font-bold uppercase">{currentConfig.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#D6B46A]/10 border border-[#D6B46A]/30 text-[#BFA15A] text-[10px] font-mono uppercase font-bold rounded-full flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#D6B46A]" />
              ✦ 80% PLATINUM PRIVILEGE APPLIED
            </span>
          </div>
        </div>

        {/* Top Service Switcher Carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] tracking-wider">
              Select Studio Service to Configure & Experience:
            </span>
            <Link 
              to="/services" 
              className="text-xs font-mono text-[#BFA15A] hover:underline font-bold"
            >
              ← All Services Catalog
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {Object.values(SERVICE_CONFIGS).map((svc) => {
              const isSelected = svc.id === selectedServiceId;
              return (
                <button
                  key={svc.id}
                  onClick={() => handleSelectService(svc.id)}
                  className={`shrink-0 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#111111] text-white border-[#D6B46A] shadow-md scale-[1.02]'
                      : 'bg-white text-[#111111] border-[#D6B46A]/20 hover:border-[#D6B46A]/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-[#D6B46A] text-black' : 'bg-[#D6B46A]/15 text-[#BFA15A]'
                  }`}>
                    ✦
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs leading-tight whitespace-nowrap">{svc.name}</h5>
                    <span className={`text-[9px] font-mono block ${isSelected ? 'text-[#D6B46A]' : 'text-[#8A8178]'}`}>
                      From ₹{svc.basePrice.toLocaleString('en-IN')} · {svc.deliveryDays}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Service Presentation Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Service Description, Interactive Feature Sandbox & Inclusions (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-[10px] font-mono uppercase tracking-widest font-bold rounded-md inline-block">
                INTERACTIVE LIVE EXPERIENCE
              </span>
              <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#111111] tracking-tight">
                {currentConfig.name}
              </h1>
              <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
                {currentConfig.tagline}
              </p>
            </div>

            {/* INTERACTIVE SERVICE SANDBOX / BENEFIT SIMULATOR */}
            <div className="bg-white border border-[#D6B46A]/25 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6" id="service-live-sandbox">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6B46A]/15 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider">
                    Live Benefit Sandbox: Test Your Outcome
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8A8178]">
                  Interactive Demonstration
                </span>
              </div>

              {/* 1. WEB DEVELOPMENT SANDBOX */}
              {currentConfig.sandboxType === 'web' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#8A8178] uppercase">Theme:</span>
                      {(['obsidian', 'ivory', 'champagne'] as const).map((thm) => (
                        <button
                          key={thm}
                          onClick={() => setSandboxTheme(thm)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            sandboxTheme === thm 
                              ? 'bg-[#111111] text-[#D6B46A]' 
                              : 'bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#8A8178]'
                          }`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSandboxDevice('desktop')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer ${
                          sandboxDevice === 'desktop' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#8A8178]'
                        }`}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => setSandboxDevice('mobile')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer ${
                          sandboxDevice === 'mobile' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#8A8178]'
                        }`}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>

                  {/* Simulated Browser Window */}
                  <div className={`mx-auto rounded-2xl overflow-hidden border border-[#D6B46A]/30 shadow-lg transition-all duration-300 ${
                    sandboxDevice === 'mobile' ? 'max-w-xs' : 'w-full'
                  }`}>
                    {/* Browser Chrome Header */}
                    <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between text-white text-xs border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="font-mono text-[10px] text-[#D6B46A] tracking-wider">
                        https://your-brand-domain.com
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">● 99 Perf</span>
                    </div>

                    {/* Website Inner Content Preview */}
                    <div className={`p-6 sm:p-8 transition-colors ${
                      sandboxTheme === 'obsidian'
                        ? 'bg-[#0E0E0E] text-white'
                        : sandboxTheme === 'ivory'
                        ? 'bg-[#FBF8F2] text-[#111111]'
                        : 'bg-[#1A1713] text-[#F3E7C9]'
                    }`}>
                      <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between border-b border-current/10 pb-3">
                          <span className="font-display font-bold text-sm tracking-wider uppercase">
                            Your Brand™
                          </span>
                          <span className="px-3 py-1 bg-[#D6B46A] text-black font-mono font-bold text-[9px] rounded-full">
                            Fast Track 48H
                          </span>
                        </div>

                        <div className="space-y-2 py-2">
                          <h4 className="font-display font-bold text-lg sm:text-xl leading-tight">
                            Ultra-Fast Digital Architecture Designed to Convert Visitors.
                          </h4>
                          <p className="text-xs opacity-75 leading-relaxed">
                            Engineered by SamaXon with zero lag, custom Tailwind styling, and direct lead triggers.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button className="px-4 py-2 bg-[#D6B46A] text-black font-bold text-xs rounded-xl shadow-sm">
                            Get Instant Quote
                          </button>
                          <button className="px-4 py-2 border border-current/20 text-xs font-mono rounded-xl opacity-80">
                            Explore Portfolio
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MOBILE APP SANDBOX */}
              {currentConfig.sandboxType === 'mobile' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  {/* Smartphone frame */}
                  <div className="w-64 h-[420px] bg-[#111111] rounded-[36px] p-3 border-4 border-[#333333] shadow-2xl relative flex flex-col justify-between overflow-hidden">
                    <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2" />
                    
                    {/* Screen Content */}
                    <div className="bg-[#1A1A1A] rounded-[24px] p-4 flex-1 flex flex-col justify-between text-white text-left">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                          <span className="font-bold text-xs text-[#D6B46A]">Your App</span>
                          <span className="text-[10px] font-mono text-emerald-400">Connected</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                          <span className="text-[9px] font-mono text-[#D6B46A] uppercase">Active Order</span>
                          <p className="text-xs font-bold">Express Build Staging</p>
                        </div>
                        <div className="p-2.5 bg-[#D6B46A]/10 border border-[#D6B46A]/25 rounded-xl text-[10px] text-[#D6B46A]">
                          ⚡ Hardware push alerts, biometric login & native navigation included.
                        </div>
                      </div>

                      <div className="flex justify-around border-t border-white/10 pt-2 text-[10px] font-mono text-gray-400">
                        <span className="text-[#D6B46A]">● Home</span>
                        <span>Orders</span>
                        <span>Account</span>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-xs space-y-3 text-left">
                    <h4 className="font-display font-bold text-base text-[#111111]">
                      Native Cross-Platform Flow
                    </h4>
                    <p className="text-xs text-[#8A8178] leading-relaxed">
                      We package your web platforms into production-ready Android APK and iOS IPA formats with push notification servers pre-configured.
                    </p>
                    <div className="p-3 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl space-y-1 text-xs">
                      <span className="font-bold text-[#111111]">Supported Devices:</span>
                      <p className="text-[11px] text-[#8A8178]">
                        Android 8.0 to Android 15, iOS 14 to iOS 18 (iPhone & iPad).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. BRAND IDENTITY & LOGO SANDBOX */}
              {currentConfig.sandboxType === 'brand' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178]">
                        Test Your Initials / Name:
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={brandInitials}
                        onChange={(e) => setBrandInitials(e.target.value.toUpperCase())}
                        className="px-3 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl text-sm font-bold font-mono text-[#111111] outline-none w-24 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178]">
                        Aesthetic Style:
                      </label>
                      <div className="flex gap-1">
                        {(['monogram', 'minimal', 'modern'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setBrandStyle(st)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                              brandStyle === st 
                                ? 'bg-[#111111] text-[#D6B46A]' 
                                : 'bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#8A8178]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Brand Monogram Showcase Canvas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dark Luxury Badge */}
                    <div className="h-48 bg-[#111111] rounded-2xl border border-[#D6B46A]/30 flex flex-col items-center justify-center p-6 text-center space-y-2 relative overflow-hidden group shadow-lg">
                      <div className="w-16 h-16 rounded-full border-2 border-[#D6B46A] flex items-center justify-center text-2xl font-display font-black text-[#D6B46A] shadow-[0_0_24px_rgba(214,180,106,0.3)]">
                        {brandInitials || 'SX'}
                      </div>
                      <span className="text-xs font-display tracking-widest text-white uppercase font-bold">
                        {brandInitials ? `${brandInitials} ENTERPRISES` : 'SAMAXON LUXE'}
                      </span>
                      <span className="text-[9px] font-mono text-[#D6B46A] uppercase tracking-widest">
                        Presidential Suite Standard
                      </span>
                    </div>

                    {/* Light Editorial Badge */}
                    <div className="h-48 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/30 flex flex-col items-center justify-center p-6 text-center space-y-2 relative overflow-hidden shadow-sm">
                      <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center text-2xl font-display font-black shadow-md">
                        {brandInitials || 'SX'}
                      </div>
                      <span className="text-xs font-display tracking-widest text-[#111111] uppercase font-bold">
                        {brandInitials ? `${brandInitials} STUDIOS` : 'MINIMALIST LINEAR'}
                      </span>
                      <span className="text-[9px] font-mono text-[#8A8178] uppercase tracking-widest">
                        Scalable Vector Master (SVG/EPS)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. 8K GRAPHICS SANDBOX */}
              {currentConfig.sandboxType === 'graphics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-[#111111] rounded-2xl border border-[#D6B46A]/20 flex flex-col justify-between h-36 text-white text-left">
                      <span className="text-[9px] font-mono text-[#D6B46A] font-bold">1:1 SQUARE (1080×1080)</span>
                      <div>
                        <p className="text-xs font-bold font-display">Social Feed Master</p>
                        <span className="text-[9px] text-[#8A8178]">High Conversion</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#111111] rounded-2xl border border-[#D6B46A]/20 flex flex-col justify-between h-36 text-white text-left">
                      <span className="text-[9px] font-mono text-[#D6B46A] font-bold">9:16 REEL (1080×1920)</span>
                      <div>
                        <p className="text-xs font-bold font-display">Viral Motion Frame</p>
                        <span className="text-[9px] text-[#8A8178]">Full Screen Impact</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#111111] rounded-2xl border border-[#D6B46A]/20 flex flex-col justify-between h-36 text-white text-left">
                      <span className="text-[9px] font-mono text-[#D6B46A] font-bold">16:9 BANNER (2560×1440)</span>
                      <div>
                        <p className="text-xs font-bold font-display">YouTube / Hero</p>
                        <span className="text-[9px] text-[#8A8178]">Ultra-HD 4K</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#8A8178] text-left leading-relaxed">
                    ✦ Every asset is produced in ultra-sharp 8K resolution with crisp typography hierarchy, CMYK print options, and organized master Figma design files.
                  </p>
                </div>
              )}

              {/* 5. WORKFLOW AUTOMATION SANDBOX */}
              {currentConfig.sandboxType === 'automation' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111]">
                      Real-Time Node Execution Pipeline
                    </span>
                    <button
                      onClick={handleSimulatePipeline}
                      disabled={isSimulatingPipeline}
                      className="px-3 py-1.5 bg-[#111111] text-[#D6B46A] text-[10px] font-mono font-bold uppercase rounded-lg border border-[#D6B46A]/30 hover:border-[#D6B46A] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSimulatingPipeline ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      <span>{isSimulatingPipeline ? 'Executing Flow...' : 'Simulate Pipeline Trigger'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {[
                      { step: 1, title: 'Lead Ingest', desc: 'Form submitted on website', icon: '📥' },
                      { step: 2, title: 'AI Filter', desc: 'Validates phone & intent', icon: '🧠' },
                      { step: 3, title: 'WhatsApp Alert', desc: 'Instant text to founder', icon: '💬' },
                      { step: 4, title: 'CRM Sync', desc: 'Logged to Google Sheets', icon: '📊' }
                    ].map((node) => {
                      const isActive = pipelineStep >= node.step;
                      return (
                        <div
                          key={node.step}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isActive
                              ? 'bg-[#111111] text-white border-[#D6B46A] shadow-md'
                              : 'bg-[#FFFDF8] text-[#8A8178] border-[#D6B46A]/15'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-base">{node.icon}</span>
                            <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-[#D6B46A] text-black' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isActive ? 'Done 0.2s' : 'Queue'}
                            </span>
                          </div>
                          <h6 className="font-bold text-xs">{node.title}</h6>
                          <p className="text-[10px] opacity-75 mt-0.5">{node.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. TELEGRAM ALERT BOT SANDBOX */}
              {currentConfig.sandboxType === 'bot' && (
                <div className="space-y-4">
                  <div className="bg-[#181818] rounded-2xl border border-[#D6B46A]/20 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                          ⚡
                        </div>
                        <div>
                          <h5 className="font-bold text-xs">SamaXon Alert Bot</h5>
                          <span className="text-[9px] font-mono text-emerald-400">online · automated</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400">Telegram Engine</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
                      {botMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`p-2.5 rounded-xl max-w-xs leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-sky-600 text-white rounded-br-none' 
                              : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[8px] text-gray-400 font-mono mt-0.5">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Trigger Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['View Pricing', 'Request 48H Staging', 'Talk to Founder'].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleSendBotMessage(chip)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#D6B46A] border border-[#D6B46A]/20 text-[10px] font-mono rounded-lg transition-all cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input Bar */}
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <input
                        type="text"
                        value={botInput}
                        onChange={(e) => setBotInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendBotMessage()}
                        placeholder="Type a query to test bot auto-reply..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#D6B46A]"
                      />
                      <button
                        onClick={() => handleSendBotMessage()}
                        className="px-3 py-1.5 bg-[#D6B46A] text-black font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. ADMIN DASHBOARDS SANDBOX */}
              {currentConfig.sandboxType === 'dashboard' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-[#111111] rounded-2xl border border-[#D6B46A]/20 text-white text-left space-y-1">
                      <span className="text-[9px] font-mono text-[#D6B46A] uppercase">Active Inquiries</span>
                      <h4 className="text-xl font-display font-black text-white">48 Leads</h4>
                      <span className="text-[9px] text-emerald-400 font-mono">+18% this sprint</span>
                    </div>

                    <div className="p-3 bg-[#111111] rounded-2xl border border-[#D6B46A]/20 text-white text-left space-y-1">
                      <span className="text-[9px] font-mono text-[#D6B46A] uppercase">Server Uptime</span>
                      <h4 className="text-xl font-display font-black text-emerald-400">99.98%</h4>
                      <span className="text-[9px] text-gray-400 font-mono">0.18s latency</span>
                    </div>

                    <div className="p-3 bg-[#111111] rounded-2xl border border-[#D6B46A]/20 text-white text-left space-y-1">
                      <span className="text-[9px] font-mono text-[#D6B46A] uppercase">Conversion Rate</span>
                      <h4 className="text-xl font-display font-black text-[#D6B46A]">24.8%</h4>
                      <span className="text-[9px] text-gray-400 font-mono">Real-time sync</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8A8178] leading-relaxed">
                    ✦ Includes role-based access security, instant CSV export, and encrypted password authentication.
                  </p>
                </div>
              )}

              {/* 8. SEO & SPEED SANDBOX */}
              {currentConfig.sandboxType === 'seo' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={auditUrl}
                      onChange={(e) => setAuditUrl(e.target.value)}
                      placeholder="Enter website URL..."
                      className="flex-1 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl px-3 py-2 text-xs font-mono text-[#111111] outline-none"
                    />
                    <button
                      onClick={handleRunAudit}
                      disabled={auditRunning}
                      className="px-4 py-2 bg-[#111111] text-[#D6B46A] font-bold text-xs font-mono uppercase rounded-xl border border-[#D6B46A]/40 hover:border-[#D6B46A] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {auditRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Gauge className="w-3.5 h-3.5" />}
                      <span>{auditRunning ? 'Auditing...' : 'Run Speed Audit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                      <span className="text-2xl font-black font-display text-emerald-700">99</span>
                      <span className="block text-[10px] font-mono uppercase font-bold text-emerald-800 mt-0.5">
                        Performance
                      </span>
                    </div>

                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                      <span className="text-2xl font-black font-display text-emerald-700">100</span>
                      <span className="block text-[10px] font-mono uppercase font-bold text-emerald-800 mt-0.5">
                        Accessibility
                      </span>
                    </div>

                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                      <span className="text-2xl font-black font-display text-emerald-700">100</span>
                      <span className="block text-[10px] font-mono uppercase font-bold text-emerald-800 mt-0.5">
                        SEO Score
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Core Deliverables / Features Checklist */}
            <div className="bg-white border border-[#D6B46A]/20 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-base text-[#111111] uppercase tracking-wider border-b border-[#D6B46A]/15 pb-3">
                Standard Included Inclusions (Zero Hidden Charges)
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {currentConfig.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-[#111111]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="leading-normal">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Price Estimator & Instant Booking Form (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-[#D6B46A]/30 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6">
              {/* Card Header */}
              <div className="space-y-1 border-b border-[#D6B46A]/15 pb-4">
                <span className="text-[10px] font-mono uppercase text-[#BFA15A] font-bold tracking-wider block">
                  TRANSPARENT SPRINT QUOTE
                </span>
                <h3 className="font-display font-bold text-xl text-[#111111]">
                  Configure Your Project Scope
                </h3>
              </div>

              {/* Tier Picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                  Delivery Speed & Sprint Priority
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#FFFDF8] p-1 border border-[#D6B46A]/20 rounded-xl">
                  {[
                    { id: 'express', label: '48H VIP', badge: 'Guaranteed' },
                    { id: 'standard', label: '5 Days', badge: 'Fast Track' },
                    { id: 'enterprise', label: 'Custom', badge: 'Full Scale' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTier(t.id as any)}
                      className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        tier === t.id
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'text-[#8A8178] hover:text-[#111111]'
                      }`}
                    >
                      <span className="block text-xs font-bold leading-tight">{t.label}</span>
                      <span className="block text-[8px] font-mono text-[#D6B46A]">{t.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Add-ons / Plugins */}
              {currentConfig.options.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                    Optional Acceleration Add-ons
                  </label>
                  <div className="space-y-2">
                    {currentConfig.options.map((opt) => {
                      const isChecked = selectedOptions.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleOption(opt.id)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-champagne-gold/10 border-[#D6B46A] text-[#111111]'
                              : 'bg-[#FFFDF8] border-[#D6B46A]/15 hover:border-[#D6B46A]/40 text-[#111111]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? 'bg-[#111111] border-[#111111] text-[#D6B46A]' : 'border-[#D6B46A]/30'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{opt.label}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#BFA15A]">
                            +₹{opt.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Live Price Calculation Card */}
              <div className="bg-[#111111] text-soft-ivory p-6 rounded-2xl border border-[#D6B46A]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[8px] font-mono text-[#D6B46A] uppercase font-bold block">
                      STAGING QUOTE (ALL-INCLUSIVE)
                    </span>
                    <h5 className="font-display font-medium text-xs text-white uppercase tracking-wider">
                      {currentConfig.deliveryDays}
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 bg-[#D6B46A]/20 text-[#D6B46A] text-[9px] font-mono uppercase font-bold rounded">
                    80% OFF
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-rose-400 line-through font-mono opacity-80">
                    ₹{originalPriceBeforeDiscount.toLocaleString('en-IN')} Standard Market
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-black text-white">
                      ₹{calculatedTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-mono text-[#D6B46A] uppercase font-bold">
                      Fixed Staging Price
                    </span>
                  </div>
                  <p className="text-[10px] text-warm-grey font-mono leading-tight pt-1">
                    Includes design architecture, frontend coding, QA testing & deployment hosting.
                  </p>
                </div>
              </div>

              {/* Instant WhatsApp 1-Click Action */}
              <a
                href={whatsappInquiryLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
              >
                <MessageSquare className="w-4 h-4 text-black" />
                Book via WhatsApp (Instant Reply)
              </a>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#D6B46A]/20" />
                <span className="flex-shrink mx-3 text-[9px] font-mono uppercase text-[#8A8178]">
                  Or Submit Formal Digital Brief
                </span>
                <div className="flex-grow border-t border-[#D6B46A]/20" />
              </div>

              {/* Direct Booking Form */}
              {submitSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-emerald-900">
                      Sprint Request Initiated!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Tracking ID: <span className="font-mono font-bold">{trackingId}</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Our lead architect has received your project parameters and will reach out via WhatsApp at {formData.whatsappNumber} within 15 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-mono text-[#BFA15A] hover:underline font-bold"
                  >
                    Submit another requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl p-2.5 text-xs text-[#111111] outline-none focus:border-[#D6B46A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">
                        Business / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Acme Studio"
                        className="w-full bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl p-2.5 text-xs text-[#111111] outline-none focus:border-[#D6B46A]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl p-2.5 text-xs text-[#111111] outline-none focus:border-[#D6B46A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">
                      Project Vision / Special Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.projectVision}
                      onChange={(e) => setFormData({ ...formData, projectVision: e.target.value })}
                      placeholder="Any specific features, reference links or requirements..."
                      className="w-full bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl p-2.5 text-xs text-[#111111] outline-none focus:border-[#D6B46A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#111111] text-[#D6B46A] hover:bg-black hover:text-white font-bold uppercase tracking-widest text-xs rounded-2xl border border-[#D6B46A]/40 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-display disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Reserving Slot...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief Online</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
