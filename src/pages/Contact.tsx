import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Mail, Sparkles, Loader2, MessageSquare, ShieldCheck, Send, Linkedin, Instagram, Crown } from 'lucide-react';
import SEO from '../components/SEO';
import { Lead } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';
import CustomSelect from '../components/CustomSelect';
import { useTheme } from '../context/ThemeContext';

interface ServiceOption {
  value: string;
  label: string;
  basePrice: number;
  badge: string;
}

const SERVICE_CATEGORIES: ServiceOption[] = [
  { value: 'Single Page Landing Website', label: 'Single Page Website (48h Express)', basePrice: 7000, badge: '✦ Patron Privilege (80% OFF)' },
  { value: 'Multi Page Business Website', label: 'Multi Page Business Website', basePrice: 15000, badge: '✦ Sovereign Corporate (80% OFF)' },
  { value: 'Elite E-Commerce Platform', label: 'Elite E-Commerce Platform', basePrice: 30000, badge: '✦ Sovereign Enterprise (80% OFF)' },
  { value: 'Custom Admin Control Dashboard', label: 'Custom Admin Dashboard System', basePrice: 24000, badge: '✦ Operator Console (80% OFF)' },
  { value: 'WebView Mobile Application', label: 'WebView Mobile Application Wrapper', basePrice: 12000, badge: '✦ Portal Wrapper (80% OFF)' },
  { value: 'Native Android & iOS Mobile App', label: 'Native iOS & Android Application', basePrice: 40000, badge: '✦ Sovereign Native (80% OFF)' },
  { value: 'Business Workflow Automation', label: 'Business Workflow Automation Layer', basePrice: 9000, badge: '✦ Algorithmic Stream (80% OFF)' },
  { value: 'Real-Time Informational Telegram Bot', label: 'Real-Time Telegram Alert Bot System', basePrice: 8000, badge: '✦ Instant Alert Bot (80% OFF)' },
  { value: 'Interactive AI Chatbot Integration', label: 'Interactive AI Chatbot (LLM-Grounded)', basePrice: 16000, badge: '✦ Cognitive AI Agent (80% OFF)' },
  { value: 'Premium Logo & Brand Identity', label: 'Premium Logo & Brand Identity Suite', basePrice: 6000, badge: '✦ Presidential Art (80% OFF)' },
  { value: 'Comprehensive 8K Graphic Pack', label: '8K Graphic & Social Launch Campaign Asset Pack', basePrice: 5000, badge: '✦ High Resolution Frame (80% OFF)' },
  { value: 'Extreme Speed & SEO Rank Optimization', label: 'Extreme Speed & SEO rank booster', basePrice: 4000, badge: '✦ Performance Booster (80% OFF)' },
  { value: 'Technical Audit & Security Hardening', label: 'Technical Audit & Security Hardening', basePrice: 3000, badge: '✦ Security Fortress (80% OFF)' },
  { value: 'Custom REST API & Database Middleware', label: 'Custom REST API & Database Middleware', basePrice: 18000, badge: '✦ High Scalability (80% OFF)' },
  { value: 'Bespoke SaaS Product MVP', label: 'Bespoke SaaS Product MVP', basePrice: 50000, badge: '✦ Royal Blue-Chip MVP (80% OFF)' }
];

interface TimelineOption {
  value: string;
  multiplier: number;
  badge: string;
  description: string;
}

const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: 'Under 48 Hours', multiplier: 1.3, badge: 'VIP Express Wing', description: 'Immediate sprint allocation, 48h staging delivery guarantees.' },
  { value: '3 - 7 Days', multiplier: 1.2, badge: 'Fast Track Wing', description: 'Accelerated development milestone steps.' },
  { value: '1 - 2 Weeks', multiplier: 1.0, badge: 'Standard Sprints', description: 'Coordinated milestone tracks.' },
  { value: 'Flexible Timeline', multiplier: 0.8, badge: 'Regular Queue', description: 'Fits standard background queue schedules.' }
];

interface ComplexityOption {
  value: string;
  multiplier: number;
  badge: string;
  description: string;
}

const COMPLEXITY_OPTIONS: ComplexityOption[] = [
  { value: 'Basic', multiplier: 1.0, badge: 'Lite Build', description: 'Clean MVP framework, essential features.' },
  { value: 'Standard', multiplier: 1.2, badge: 'Balanced Core', description: 'Sophisticated design, full responsiveness.' },
  { value: 'Premium', multiplier: 1.3, badge: 'Luxury Finish', description: 'High-end layout animations, custom components.' }
];

interface AddonOption {
  id: string;
  label: string;
  price: number;
  description: string;
}

const ADDON_OPTIONS: AddonOption[] = [
  { id: 'seo-schema', label: 'Advanced SEO Structured Schema script injection', price: 2000, description: 'Optimizes rich indexing metadata tags for Page 1 ranks. [✦ Special Commission Rate]' },
  { id: 'maintenance', label: '12-Month Senior Maintenance retainer SLA', price: 15000, description: 'Continuous protection, system upgrades, and minor layout modifications. [✦ Special Commission Rate]' }
];

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [websiteSettings, setWebsiteSettings] = useState<any>({
    contactEmail: 'build@samaxon.pro',
    phoneWhatsapp: '+91 80000 00000',
    telegramLink: 'https://t.me/samaxon_studio',
    instagramLink: 'https://instagram.com/samaxon_studio',
    linkedinLink: 'https://linkedin.com/company/samaxon'
  });

  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('samaxon_website_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWebsiteSettings({
            contactEmail: parsed.contactEmail || 'build@samaxon.pro',
            phoneWhatsapp: parsed.phoneWhatsapp || '+91 80000 00000',
            telegramLink: parsed.telegramLink || 'https://t.me/samaxon_studio',
            instagramLink: parsed.instagramLink || 'https://instagram.com/samaxon_studio',
            linkedinLink: parsed.linkedinLink || 'https://linkedin.com/company/samaxon'
          });
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    };

    loadSettings();
    window.addEventListener('samaxon_website_settings_updated', loadSettings);
    return () => {
      window.removeEventListener('samaxon_website_settings_updated', loadSettings);
    };
  }, []);

  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    serviceNeeded: 'Single Page Landing Website',
    complexity: 'Standard',
    desiredTimeline: '1 - 2 Weeks',
    selectedAddons: [] as string[],
    userBudgetPreference: 'Looks good',
    currentProblem: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedService = SERVICE_CATEGORIES.find(s => s.value === formData.serviceNeeded) || SERVICE_CATEGORIES[0];
  const selectedTimeline = TIMELINE_OPTIONS.find(t => t.value === formData.desiredTimeline) || TIMELINE_OPTIONS[0];
  const selectedComplexity = COMPLEXITY_OPTIONS.find(c => c.value === formData.complexity) || COMPLEXITY_OPTIONS[1];

  const baseCalculated = selectedService.basePrice * selectedTimeline.multiplier * selectedComplexity.multiplier;
  const addonsTotal = formData.selectedAddons.reduce((sum, id) => {
    const matched = ADDON_OPTIONS.find(a => a.id === id);
    return sum + (matched ? matched.price : 0);
  }, 0);

  const minCalculatedPrice = Math.round(baseCalculated + addonsTotal);
  const maxCalculatedPrice = Math.round(minCalculatedPrice * 1.35);

  const getSubmitButtonText = () => {
    switch (formData.desiredTimeline) {
      case 'Under 48 Hours':
        return 'Initiate VIP Express 48h Campaign';
      case '3 - 7 Days':
        return 'Start Staging Build (Fast Track)';
      case '1 - 2 Weeks':
        return 'Launch Standard Staging Build';
      default:
        return 'Queue My Custom Build Proposal';
    }
  };

  const toggleAddon = (addonId: string) => {
    setFormData(prev => {
      const alreadyHas = prev.selectedAddons.includes(addonId);
      const updated = alreadyHas 
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId];
      return { ...prev, selectedAddons: updated };
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Your full name is required';
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (!formData.phone.trim()) errors.phone = 'WhatsApp number is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email address is required';
    if (!formData.city.trim()) errors.city = 'Please indicate your city name';
    if (!formData.currentProblem.trim()) errors.currentProblem = 'Please brief your current digital problem';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!hasTrackedFormStart) {
      analytics.trackFormStart();
      setHasTrackedFormStart(true);
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const formattedMessage = `Project Summary Details:
- Complexity Select: ${formData.complexity}
- Core Build Formula: Service(${selectedService.value}, Base: ₹${selectedService.basePrice.toLocaleString('en-IN')}), Timeline(${selectedTimeline.value}, ${selectedTimeline.multiplier}x), Complexity(${selectedComplexity.value}, ${selectedComplexity.multiplier}x)
- Active Paid Plugins/Add-ons: ${formData.selectedAddons.length > 0 ? formData.selectedAddons.map(id => ADDON_OPTIONS.find(a => a.id === id)?.label).join(', ') : 'None'}
- Selected Response Preference: ${formData.userBudgetPreference}
- Supplementary Notes: ${formData.message || 'None'}`;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.name,
      businessName: formData.businessName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      serviceNeeded: formData.serviceNeeded,
      currentProblem: formData.currentProblem,
      desiredTimeline: formData.desiredTimeline,
      budgetRange: `Calculated: ₹${minCalculatedPrice.toLocaleString('en-IN')} - ₹${maxCalculatedPrice.toLocaleString('en-IN')} [${formData.userBudgetPreference}]`,
      message: formattedMessage,
      status: 'new',
      createdAt: new Date().toISOString(),
      complexity: formData.complexity,
      selected_addons: formData.selectedAddons.map(id => ADDON_OPTIONS.find(a => a.id === id)?.label || id),
      estimated_min_price: minCalculatedPrice,
      estimated_max_price: maxCalculatedPrice,
      user_budget_preference: formData.userBudgetPreference,
      priority: selectedTimeline.value === 'Under 48 Hours' ? 'high' : selectedTimeline.value === '3 - 7 Days' ? 'high' : 'medium'
    } as any;

    try {
      await supabaseService.upsertLead(newLead);
      analytics.trackFormSubmit();

      try {
        const storedLeadsStr = localStorage.getItem('samaxon_leads');
        const storedLeads = storedLeadsStr ? JSON.parse(storedLeadsStr) : [];
        storedLeads.unshift(newLead);
        localStorage.setItem('samaxon_leads', JSON.stringify(storedLeads));
        window.dispatchEvent(new Event('samaxon_leads_updated'));
      } catch (errLocal) {
        console.warn('Backup local storage lead sync failed:', errLocal);
      }

    } catch (err) {
      console.error('Direct Supabase insert failed:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        city: '',
        serviceNeeded: 'Single Page Landing Website',
        complexity: 'Standard',
        desiredTimeline: '1 - 2 Weeks',
        selectedAddons: [],
        userBudgetPreference: 'Looks good',
        currentProblem: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 transition-colors duration-300 font-sans" id="contact-page">
      <SEO 
        title="Start Your 48-Hour Build - Direct Contact"
        description="Aap apna business goal share kijiye. Submit our premium inquiry form to schedule your demo direction or reach us instantly via WhatsApp/Telegram."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-black/5 dark:border-white/5 pb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
              : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
            <span>Direct Project Initiation</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            Ready to Build <br />
            <span className="text-[#D6B46A]">Something Premium?</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            Tell us what your enterprise needs. SamaXon will move from high-level idea structures to pristine digital execution with speed, strict validation, and visual authority.
          </p>
        </div>

        {/* --- CONTENT grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Quick actions sidebar columns */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#D6B46A] tracking-wider block font-bold uppercase">
                Project Guideline
              </span>
              <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                "Aap apna business goal share kijiye. Our team will decode the requirement immediately and suggest the fastest premium execution plan."
              </p>
            </div>

            {/* Verification box */}
            <div className={`border rounded-2xl p-5 space-y-3 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider">NDA Protected &amp; Secured:</h4>
                  <p className="text-xs text-[#8E8E93] leading-relaxed mt-1">
                    Your personal particulars, business details, and trade challenges are kept absolutely confidential on isolated local frameworks. No third-party data tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Instant Channels Card */}
            <div className={`rounded-3xl border p-7 space-y-5 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-md'
            }`}>
              
              <div className="border-b border-black/5 dark:border-white/5 pb-3">
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] block font-bold">DIRECT ACCESS CHANNELS</span>
                <h3 className="font-display font-bold text-base mt-0.5">Connect With Us Directly</h3>
              </div>

              <div className="space-y-2.5" id="social-cta-stack">
                {/* WHATSAPP CTA */}
                <a 
                  href={`https://wa.me/${(websiteSettings.phoneWhatsapp || '918000000000').replace(/[^\d]/g, '') || '918000000000'}?text=SamaXon%20Start%20Build`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => analytics.trackWhatsAppClick()}
                  className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white/40 backdrop-blur-xl border border-white/80 rounded-2xl flex items-center justify-between hover:bg-emerald-500/15 transition-all cursor-pointer block text-left shadow-[0_4px_16px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Talk on WhatsApp</h4>
                      <p className="text-[10px] text-[#8E8E93]">Connect with Lead Consultant instantly</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                </a>

                {/* TELEGRAM CTA */}
                <a 
                  href={websiteSettings.telegramLink || 'https://t.me/samaxon_studio'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-white/40 backdrop-blur-xl border border-white/80 rounded-2xl flex items-center justify-between hover:bg-sky-500/15 transition-all cursor-pointer block text-left shadow-[0_4px_16px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Connect on Telegram</h4>
                      <p className="text-[10px] text-[#8E8E93]">Alert bot triggers demo pipelines</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-sky-500" />
                </a>

                {/* LINKEDIN CTA */}
                <a 
                  href={websiteSettings.linkedinLink || 'https://linkedin.com/company/samaxon'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-white/40 backdrop-blur-xl border border-white/80 rounded-2xl flex items-center justify-between hover:bg-blue-500/15 transition-all cursor-pointer block text-left shadow-[0_4px_16px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">LinkedIn</h4>
                      <p className="text-[10px] text-[#8E8E93]">View verified company details</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </a>

                {/* INSTAGRAM CTA */}
                <a 
                  href={websiteSettings.instagramLink || 'https://instagram.com/samaxon_studio'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-white/40 backdrop-blur-xl border border-white/80 rounded-2xl flex items-center justify-between hover:bg-pink-500/15 transition-all cursor-pointer block text-left shadow-[0_4px_16px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Instagram Studio</h4>
                      <p className="text-[10px] text-[#8E8E93]">Visual design portfolio reels</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-pink-500" />
                </a>

                {/* EMAIL CTA */}
                <a 
                  href={`mailto:${websiteSettings.contactEmail || 'build@samaxon.pro'}`}
                  className="p-3.5 bg-gradient-to-r from-[#D6B46A]/10 via-[#D6B46A]/5 to-white/40 backdrop-blur-xl border border-white/80 rounded-2xl flex items-center justify-between hover:bg-[#D6B46A]/15 transition-all cursor-pointer block text-left shadow-[0_4px_16px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D6B46A] text-[#0A0A0A] flex items-center justify-center shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Send Project Brief</h4>
                      <p className="text-[10px] text-[#8E8E93]">Email detailed requirements</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D6B46A]" />
                </a>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-9 text-left transition-all relative overflow-hidden backdrop-blur-3xl backdrop-saturate-200 bg-gradient-to-br from-white/80 via-white/45 to-white/70 border border-white/90 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.02),inset_0_1.5px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(255,255,255,0.4)]" id="contact-form-container">
              
              {/* Convex Top Meniscus Reflection */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none rounded-t-3xl bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-80" 
                aria-hidden="true" 
              />
              
              <div className="border-b border-black/5 pb-5 mb-6 relative z-10">
                <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
                  <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">SMART ESTIMATION INQUIRY SYSTEM</span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full select-none flex items-center gap-1.5 border border-white/80 bg-white/60 text-[#BFA15A] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                    <Crown className="w-3 h-3 text-[#D6B46A]" /> 80% PLATINUM RATE ACTIVE
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mt-1 text-[#1D1D1F]">Staging Allocation Brief</h3>
                <p className="text-xs text-[#8E8E93] mt-0.5">Specify your parameters below. Our real-time formula will propose an upfront pricing schedule.</p>
              </div>

              {isSubmitted ? (
                <div className="py-16 text-center space-y-4 relative z-10" id="contact-form-success">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#1D1D1F]">Inquiry Logged Securely</h4>
                  <p className="text-xs text-[#8E8E93] max-w-sm mx-auto leading-relaxed">
                    Submission complete! Our Senior Developer Wing will isolate your project parameters and map the staging visual template in the next 12 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] hover:shadow-lg text-[#0A0A0A] text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md border border-white/60"
                  >
                    Initiate Another Project
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10" id="contact-inquiry-form">
                  
                  {/* Name Fields */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Your Full Name *</label>
                    <input 
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sameer Khan"
                      className={`w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all ${formErrors.name ? '!border-red-400' : ''}`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500 font-mono">{formErrors.name}</span>}
                  </div>

                  {/* Business Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Business / Enterprise Name *</label>
                    <input 
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g. Khan Premium Agro India"
                      className={`w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all ${formErrors.businessName ? '!border-red-400' : ''}`}
                    />
                    {formErrors.businessName && <span className="text-[10px] text-red-500 font-mono">{formErrors.businessName}</span>}
                  </div>

                  {/* Contacts fields: phone and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 91234 56789"
                        className={`w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all ${formErrors.phone ? '!border-red-400' : ''}`}
                      />
                      {formErrors.phone && <span className="text-[10px] text-red-500 font-mono">{formErrors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Business Email *</label>
                      <input 
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. contact@khanagro.com"
                        className={`w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all ${formErrors.email ? '!border-red-400' : ''}`}
                      />
                      {formErrors.email && <span className="text-[10px] text-red-500 font-mono">{formErrors.email}</span>}
                    </div>
                  </div>

                  {/* Location Area & Service Capability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Base City, India *</label>
                      <input 
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Kolkata"
                        className={`w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all ${formErrors.city ? '!border-red-400' : ''}`}
                      />
                      {formErrors.city && <span className="text-[10px] text-red-500 font-mono">{formErrors.city}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Required Service Capability *</label>
                      <CustomSelect 
                        value={formData.serviceNeeded}
                        onChange={(val) => setFormData(prev => ({ ...prev, serviceNeeded: val }))}
                        options={SERVICE_CATEGORIES.map(s => ({
                          value: s.value,
                          label: `${s.value} (Base: ₹${s.basePrice.toLocaleString('en-IN')})`
                        }))}
                      />
                    </div>
                  </div>

                  {/* COMPLEXITY SELECTOR */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-[#D6B46A] block tracking-wide font-bold select-none">Project Type &amp; Complexity Class</label>
                    <div className="grid grid-cols-3 gap-2">
                      {COMPLEXITY_OPTIONS.map((c) => {
                        const isSelected = formData.complexity === c.value;
                        return (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, complexity: c.value }))}
                            className={`p-3 text-left rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                              isSelected 
                                ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] border-white/60 font-bold shadow-[0_4px_16px_rgba(214,180,106,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.95)]' 
                                : 'bg-white/50 backdrop-blur-md border-white/80 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]'
                            }`}
                          >
                            <span className="text-xs font-bold block">{c.value}</span>
                            <span className="text-[8px] font-mono block opacity-80 mt-0.5">{c.multiplier}x multiplier</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADD-ONS */}
                  <div className="p-4 rounded-2xl border border-white/80 bg-white/40 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.02),inset_0_1px_1.5px_rgba(255,255,255,1)]">
                    <span className="text-[10px] font-mono uppercase text-[#D6B46A] block tracking-wider font-bold select-none mb-2">Optional Strategic Add-Ons</span>
                    <div className="space-y-2">
                      {ADDON_OPTIONS.map((a) => {
                        const isChecked = formData.selectedAddons.includes(a.id);
                        return (
                          <div 
                            key={a.id}
                            onClick={() => toggleAddon(a.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                              isChecked 
                                ? 'bg-white/80 border-[#D6B46A] shadow-[0_2px_10px_rgba(214,180,106,0.2),inset_0_1px_1.5px_rgba(255,255,255,1)]' 
                                : 'bg-white/30 border-white/70 hover:bg-white/50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-[#D6B46A] border-[#D6B46A] text-[#0A0A0A]' : 'border-neutral-400'
                            }`}>
                              {isChecked && <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-sm" />}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-x-2 text-xs">
                                <span className="font-semibold text-[#1D1D1F]">{a.label}</span>
                                <span className="font-mono text-[9px] text-[#D6B46A] font-bold">+₹{a.price.toLocaleString('en-IN')}</span>
                              </div>
                              <p className="text-[10px] text-[#8E8E93] leading-tight">{a.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DYNAMIC ESTIMATE CARD */}
                  <div className="p-5 rounded-2xl border border-white/85 bg-white/50 backdrop-blur-xl space-y-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,1)]" id="price-estimator-card">
                    <div className="flex items-center justify-between border-b border-black/5 pb-2">
                      <span className="text-[8px] font-mono uppercase text-[#D6B46A] tracking-wider font-bold">AUTOMATED ESTIMATE</span>
                      <span className="px-2.5 py-0.5 bg-[#D6B46A]/15 text-[#BFA15A] text-[8px] font-mono uppercase tracking-widest rounded-full font-bold border border-[#D6B46A]/20">
                        {selectedComplexity.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center py-1">
                      <div>
                        <span className="text-[10px] text-[#8E8E93] block">Recommended Staging Budget:</span>
                        <div className="text-xs text-rose-500 line-through font-mono opacity-80">
                          ₹{Math.round(minCalculatedPrice * 5).toLocaleString('en-IN')} - ₹{Math.round(maxCalculatedPrice * 5).toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-display font-bold text-[#D6B46A]">
                            ₹{minCalculatedPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#8E8E93] font-mono">-</span>
                          <span className="text-xl font-display font-bold text-[#1D1D1F]">
                             ₹{maxCalculatedPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-white/80 bg-white/60 text-[9px] font-mono text-[#8E8E93] space-y-1 shadow-sm">
                        <div className="flex justify-between">
                          <span>Base level (80% OFF):</span>
                          <span className="font-semibold text-neutral-800">₹{selectedService.basePrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Multiplier:</span>
                          <span className="font-semibold text-neutral-800">{selectedComplexity.multiplier}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Add-ons:</span>
                          <span className="text-[#D6B46A] font-bold">+₹{addonsTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* BUDGET PREFERENCE */}
                    <div className="border-t border-black/5 pt-3 space-y-1.5">
                      <span className="text-[9px] text-[#8E8E93] block uppercase font-mono tracking-widest font-bold">Budget Fit:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { value: 'Looks good', label: 'Looks good' },
                          { value: 'Need cheaper plan', label: 'Cheaper build' },
                          { value: 'Need premium plan', label: 'Scale premium' },
                          { value: 'Need custom quote', label: 'Custom query' }
                        ].map((opt) => {
                          const active = formData.userBudgetPreference === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, userBudgetPreference: opt.value }))}
                              className={`py-1.5 px-1 text-center rounded-xl border text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${
                                active 
                                  ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] border-white/60 shadow-[0_2px_8px_rgba(214,180,106,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.95)]' 
                                  : 'bg-white/50 border-white/80 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/70'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Current Problem / Digital Gap *</label>
                    <textarea 
                      name="currentProblem"
                      required
                      value={formData.currentProblem}
                      onChange={handleInputChange}
                      placeholder="e.g. Our current landing page is slow and is losing hot buyer leads..."
                      rows={3}
                      className={`w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all ${formErrors.currentProblem ? '!border-red-400' : ''}`}
                    />
                    {formErrors.currentProblem && <span className="text-[10px] text-red-500 font-mono">{formErrors.currentProblem}</span>}
                  </div>

                  {/* Optional message fields */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold select-none">Subsequent Notes (Optional)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify any localized design preferences or auxiliary tool setups..."
                      rows={2}
                      className="w-full p-3.5 text-xs rounded-2xl focus:outline-none transition-all"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] hover:shadow-[0_12px_32px_rgba(214,180,106,0.45)] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_8px_24px_rgba(214,180,106,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.95)] border border-white/60 relative overflow-hidden"
                  >
                    {/* Top Meniscus Button Gloss */}
                    <span 
                      className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-2xl bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-90" 
                      aria-hidden="true" 
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing Blueprint...</span>
                        </>
                      ) : (
                        <>
                          <span>{getSubmitButtonText()}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
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
