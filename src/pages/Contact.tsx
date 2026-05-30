import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Sparkles, AlertCircle, Loader2, MessageSquare, ShieldCheck, Send, Linkedin, Instagram, Crown } from 'lucide-react';
import SEO from '../components/SEO';
import { Lead } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';
import CustomSelect from '../components/CustomSelect';

// 15 Standard Premium Service Options with upfront Base Prices (₹ - INR)
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
  { value: 'Premium', multiplier: 1.3, badge: 'Luxury Finish', description: 'High-end layout animations, custom components.' },
  { value: 'Advanced', multiplier: 1.4, badge: 'Industrial Tier', description: 'Complex data models, custom hooks, heavy integrations.' },
  { value: 'Enterprise', multiplier: 1.5, badge: 'Elite Standard', description: 'Multi-agent systems, VIP speed compliance, maximum security.' }
];

interface AddonOption {
  id: string;
  label: string;
  price: number;
  description: string;
}

const ADDON_OPTIONS: AddonOption[] = [
  { id: 'ai-chat', label: 'Interactive AI Chat core integration', price: 6000, description: 'Grounds your domain knowledge on responsive conversational AI. [✦ Royal 80% Partner Rate]' },
  { id: 'cdn-ddos', label: 'Ultra-Secure CDN & DDOS Hardening', price: 3500, description: 'Protects customer access with rapid global servers and web-firewall locks. [✦ Special Commission Rate]' },
  { id: 'seo-schema', label: 'Advanced SEO Structured Schema script injection', price: 2000, description: 'Optimizes rich indexing metadata tags for Page 1 ranks. [✦ Special Commission Rate]' },
  { id: 'whatsapp-alert', label: 'Dedicated WhatsApp Instant Webhook alert module', price: 3000, description: 'Sends automated receipts, team notifications, and alerts. [✦ Special Commission Rate]' },
  { id: 'maintenance', label: '12-Month Senior Maintenance retainer SLA', price: 15000, description: 'Continuous protection, system upgrades, and minor layout modifications. [✦ Special Commission Rate]' }
];

export default function Contact() {
  const [websiteSettings, setWebsiteSettings] = useState<any>({
    contactEmail: 'build@samaxon.pro',
    phoneWhatsapp: '+91 80000 00000',
    telegramLink: 'https://t.me/samaxon_studio',
    instagramLink: 'https://instagram.com/samaxon_studio',
    linkedinLink: 'https://linkedin.com/company/samaxon'
  });

  useEffect(() => {
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
    desiredTimeline: 'Under 48 Hours',
    selectedAddons: [] as string[],
    userBudgetPreference: 'Looks good',
    currentProblem: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Derive and calculate precise price quotes in real-time
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
      // Smart metadata
      complexity: formData.complexity,
      selected_addons: formData.selectedAddons.map(id => ADDON_OPTIONS.find(a => a.id === id)?.label || id),
      estimated_min_price: minCalculatedPrice,
      estimated_max_price: maxCalculatedPrice,
      user_budget_preference: formData.userBudgetPreference,
      priority: selectedTimeline.value === 'Under 48 Hours' ? 'high' : selectedTimeline.value === '3 - 7 Days' ? 'high' : 'medium'
    } as any;

    try {
      // Save live Supabase pipeline
      await supabaseService.upsertLead(newLead);
      analytics.trackFormSubmit();

      // Backup save to mock storage so it updates instantly in client local dashboard fallback
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
      console.error('Direct Supabase insert failed, but saved locally:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form variables
      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        city: '',
        serviceNeeded: 'Single Page Landing Website',
        complexity: 'Standard',
        desiredTimeline: 'Under 48 Hours',
        selectedAddons: [],
        userBudgetPreference: 'Looks good',
        currentProblem: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="contact-page">
      <SEO 
        title="Start Your 48-Hour Build - Direct Contact"
        description="Aap apna business goal share kijiye. Submit our premium inquiry form to schedule your demo direction or reach us instantly via WhatsApp/Telegram."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-champagne-gold/15 pb-12">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Direct Project Initiation
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            Ready to Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-matte-black">
              Something Premium?
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            Tell us what your enterprise needs. SamaXon will move from high-level idea structures to pristine digital execution with speed, strict validation, and visual authority.
          </p>
        </div>

        {/* --- CONTENT grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick actions sidebar columns */}
          <div className="lg:col-span-5 text-left space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-[#BFA15A] tracking-wider block font-bold uppercase">
                Hinglish Project Guideline
              </span>
              <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
                "Aap apna business goal share kijiye. Our team will decode the requirement immediately and suggest the fastest premium execution plan."
              </p>
            </div>

            {/* Verification box */}
            <div className="bg-white border border-champagne-gold/15 rounded-3xl p-6 space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5.5 h-5.5 text-champagne-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-medium text-xs uppercase tracking-wider text-matte-black">NDA Protected & Secured:</h4>
                  <p className="text-xs text-warm-grey leading-relaxed mt-1">
                    Your personal particulars, business details, and trade challenges are kept absolutely confidential on isolated local frameworks. No third-party data tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Instant Channels Card */}
            <div className="bg-matte-black text-soft-ivory rounded-[32px] border border-champagne-gold/25 p-8 space-y-6">
              
              <div className="border-b border-champagne-gold/15 pb-4">
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] block font-bold">BYPASS THE INQUIRY GRID</span>
                <h3 className="font-display font-bold text-base text-soft-ivory mt-1">Direct Instant Access Channels</h3>
              </div>

              <div className="space-y-3" id="social-cta-stack">
                {/* WHATSAPP CTA */}
                <a 
                  href={`https://wa.me/${(websiteSettings.phoneWhatsapp || '918000000000').replace(/[^\d]/g, '') || '918000000000'}?text=SamaXon%20Start%20Build`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => analytics.trackWhatsAppClick()}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between hover:bg-emerald-500/15 duration-200 transition-all cursor-pointer block text-left hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-soft-ivory uppercase tracking-wider">Talk on WhatsApp</h4>
                      <p className="text-[10px] text-warm-grey">Connect with Lead Consultant instantly</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A6FCB8]" />
                </a>

                {/* TELEGRAM CTA */}
                <a 
                  href={websiteSettings.telegramLink || 'https://t.me/samaxon_studio'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-between hover:bg-sky-500/15 duration-200 transition-all cursor-pointer block text-left hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-soft-ivory uppercase tracking-wider">Connect on Telegram</h4>
                      <p className="text-[10px] text-warm-grey">Alert bot triggers demo pipelines</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A1D6FC]" />
                </a>

                {/* LINKEDIN CTA */}
                <a 
                  href={websiteSettings.linkedinLink || 'https://linkedin.com/company/samaxon'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between hover:bg-blue-500/15 duration-200 transition-all cursor-pointer block text-left hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-soft-ivory uppercase tracking-wider">LinkedIn Profiles</h4>
                      <p className="text-[10px] text-warm-grey">View our verified company wing details</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C1DBFF]" />
                </a>

                {/* INSTAGRAM CTA */}
                <a 
                  href={websiteSettings.instagramLink || 'https://instagram.com/samaxon_studio'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-between hover:bg-pink-500/15 duration-200 transition-all cursor-pointer block text-left hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-soft-ivory uppercase tracking-wider">Instagram Studio</h4>
                      <p className="text-[10px] text-warm-grey">Examine scroll-stopping visual design feeds</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FFD0EA]" />
                </a>

                {/* EMAIL CTA */}
                <a 
                  href={`mailto:${websiteSettings.contactEmail || 'build@samaxon.pro'}`}
                  className="p-4 bg-[#BFA15A]/10 border border-[#BFA15A]/20 rounded-2xl flex items-center justify-between hover:bg-[#BFA15A]/15 duration-200 transition-all cursor-pointer block text-left hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#BFA15A] text-white flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-soft-ivory uppercase tracking-wider">Send Project Brief</h4>
                      <p className="text-[10px] text-warm-grey">Email detailed structural requirements</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FFFDF8]" />
                </a>
              </div>

              <p className="text-[9px] font-mono text-warm-grey tracking-widest text-center uppercase border-t border-champagne-gold/15 pt-4">
                "No confusing agency circles. Direct core systems, elite speed."
              </p>
            </div>
          </div>

          {/* Core Build Inquiry form columns */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] border border-champagne-gold/15 p-6 sm:p-10 text-left shadow-xl" id="contact-form-container">
              
              <div className="border-b border-champagne-gold/10 pb-6 mb-8">
                <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
                  <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">SMART ESTIMATION INQUIRY SYSTEM</span>
                  <span className="bg-gradient-to-r from-[#181512] to-[#0A0908] text-[#D6B46A] font-mono text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg select-none flex items-center gap-2 shadow-xl border border-[#D6B46A]/35 hover:border-[#D6B46A]/60 transition-all duration-350">
                    <Crown className="w-3.5 h-3.5 text-[#D6B46A] fill-[#D6B46A]/20 animate-pulse" /> ✦ ROYAL COVENANT: 80% PLATINUM RATE ACTIVE
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-matte-black mt-1">Staging Allocation Brief</h3>
                <p className="text-[11px] text-[#8A8178]">Specify your parameters below. Our real-time formula will propose an upfront pricing schedule (Exclusive 80% VIP Platinum rate applied automatically to all builds).</p>
              </div>

              {isSubmitted ? (
                <div className="py-16 text-center space-y-6" id="contact-form-success">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-matte-black">Inquiry Logged Securely</h4>
                  <p className="text-xs text-warm-grey max-w-sm mx-auto leading-relaxed">
                    Submission complete! The data models have cataloged the record. Our Senior Developer Wing will isolate your project parameters and map the staging visual template in the next 12 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-8 py-3 bg-matte-black text-white hover:text-champagne-gold text-xs font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Initiate Another Project
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" id="contact-inquiry-form">
                  
                  {/* Name Fields */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Your Full Name *</label>
                    <input 
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sameer Khan"
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                        formErrors.name ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.name}</span>}
                  </div>

                  {/* Business Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Business / Enterprise Name *</label>
                    <input 
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g. Khan Premium Agro India"
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                        formErrors.businessName ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.businessName && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.businessName}</span>}
                  </div>

                  {/* Contacts fields: phone and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 91234 56789"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          formErrors.phone ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.phone && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Business Email *</label>
                      <input 
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. contact@khanagro.com"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          formErrors.email ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.email && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.email}</span>}
                    </div>
                  </div>

                  {/* Location Area & Service Capability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Base City, India *</label>
                      <input 
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Kolkata"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          formErrors.city ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.city && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.city}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Required Service Capability *</label>
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

                  {/* PROJECT COMPLEXITY SELECTOR CARD GRID */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-[#BFA15A] block tracking-wide font-extrabold select-none">Project Type & Complexity Class</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {COMPLEXITY_OPTIONS.map((c) => {
                        const isSelected = formData.complexity === c.value;
                        return (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, complexity: c.value }))}
                            className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-matte-black text-soft-ivory border-champagne-gold/50 shadow-md ring-1 ring-[#D6B46A]/30' 
                                : 'bg-pearl-white/20 border-champagne-gold/10 text-charcoal hover:border-champagne-gold/30 hover:bg-[#FFFDF8]'
                            }`}
                          >
                            <span className="text-[10px] font-bold block">{c.value}</span>
                            <span className="text-[8px] opacity-75 block font-mono mt-0.5">{c.multiplier}x multiplier</span>
                            <span className="text-[8px] text-[#A6A29E] sm:hidden block mt-1 leading-tight">{c.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* DESIRED TIMELINE SECTOR */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-[#BFA15A] block tracking-wide font-extrabold select-none">Requested Sprint Duration</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TIMELINE_OPTIONS.map((t) => {
                        const isSelected = formData.desiredTimeline === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, desiredTimeline: t.value }))}
                            className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-matte-black text-soft-ivory border-rose-500/40 shadow-md ring-1 ring-rose-500/20' 
                                : 'bg-pearl-white/20 border-champagne-gold/10 text-charcoal hover:border-champagne-gold/30 hover:bg-[#FFFDF8]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold block">{t.value}</span>
                              {t.multiplier > 1.2 && (
                                <span className="text-[7px] font-mono uppercase px-1 py-0.5 bg-rose-500/20 text-rose-300 rounded">
                                  Prioritized
                                </span>
                              )}
                            </div>
                            <span className="text-[8px] opacity-75 block font-mono mt-0.5">{t.multiplier}x Scale</span>
                            <p className="text-[8px] text-[#A6A29E] mt-1 leading-tight min-h-[24px] hidden sm:block">{t.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* OPTIONAL PREMIUM ADD-ONS LIST */}
                  <div className="flex flex-col gap-2 bg-[#FFFDF8] border border-champagne-gold/15 p-4 rounded-3xl">
                    <span className="text-[10px] font-mono uppercase text-[#BFA15A] block tracking-wider font-extrabold select-none">Optional Strategic Add-Ons</span>
                    <div className="space-y-2 mt-1">
                      {ADDON_OPTIONS.map((a) => {
                        const isChecked = formData.selectedAddons.includes(a.id);
                        return (
                          <div 
                            key={a.id}
                            onClick={() => toggleAddon(a.id)}
                            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                              isChecked 
                                ? 'bg-champagne-gold/5 border-champagne-gold/45' 
                                : 'bg-pearl-white/10 border-[#D6B46A]/10 hover:border-[#D6B46A]/30'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                              isChecked ? 'bg-matte-black border-champagne-gold text-champagne-gold' : 'border-[#D6B46A]/30'
                            }`}>
                              {isChecked && <div className="w-1.5 h-1.5 bg-champagne-gold rounded-sm" />}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-x-2 text-xs">
                                <span className="font-semibold text-matte-black">{a.label}</span>
                                <span className="font-mono text-[9px] text-[#BFA15A] font-bold">+₹{a.price.toLocaleString('en-IN')}</span>
                              </div>
                              <p className="text-[10px] text-warm-grey leading-tight">{a.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* REAL-TIME DYNAMIC AUTO PRICE ESTIMATE CARD */}
                  <div className="bg-matte-black text-soft-ivory p-6 rounded-[28px] border border-champagne-gold/30 mt-8 space-y-4 shadow-xl" id="price-estimator-card">
                    <div className="flex items-center justify-between border-b border-champagne-gold/15 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono uppercase text-[#D6B46A] tracking-wider block font-bold">AUTOMATED ALGORITHMIC QUOTE</span>
                        <h4 className="font-display font-medium text-xs text-soft-ivory uppercase tracking-wider">Dynamic Staging Estimate</h4>
                      </div>
                      <span className="px-2.5 py-0.5 bg-champagne-gold/10 border border-champagne-gold/20 text-[#BFA15A] text-[8px] font-mono uppercase tracking-widest rounded-md">
                        {selectedTimeline.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-2" id="price-range-nums">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] text-warm-grey block">Recommended Staging Budget:</span>
                          <span className="px-2 py-1 bg-[#D6B46A]/10 border border-[#D6B46A]/35 text-[#D6B46A] tracking-wider text-[8px] font-mono uppercase rounded-md font-bold flex items-center gap-1 shadow-sm select-none">
                            <Crown className="w-2.5 h-2.5 text-[#D6B46A] fill-[#D6B46A]/20" /> ✦ 80% PLATINUM PRIVILEGE ACTIVE
                          </span>
                        </div>
                        <div className="text-xs text-rose-400 line-through font-mono opacity-85 tracking-widest decoration-1">
                          ₹{Math.round(minCalculatedPrice * 5).toLocaleString('en-IN')} - ₹{Math.round(maxCalculatedPrice * 5).toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                            ₹{minCalculatedPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-warm-grey font-mono">-</span>
                          <span className="text-xl sm:text-2xl font-display font-extrabold text-[#D6B46A]">
                             ₹{maxCalculatedPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[9px] text-warm-grey font-mono block mt-1 leading-snug">
                          All-inclusive of build, QA auditing, and staging hosting parameters under {formData.desiredTimeline}.
                        </span>
                      </div>

                      <div className="bg-[#111111] p-3 rounded-xl border border-[#D6B46A]/10 text-[9px] font-mono text-warm-grey space-y-1">
                        <div className="flex justify-between">
                          <span>Base level (80% OFF):</span>
                          <span className="text-soft-ivory">₹{selectedService.basePrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service category:</span>
                          <span className="text-[#D6B46A] truncate max-w-[100px]" title={selectedService.value}>{selectedService.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Timeline scale:</span>
                          <span className="text-soft-ivory">{selectedTimeline.multiplier}x ({formData.desiredTimeline})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Complexity scale:</span>
                          <span className="text-soft-ivory">{selectedComplexity.multiplier}x ({formData.complexity})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Paid add-ons total:</span>
                          <span className="text-[#D6B46A] font-bold">+₹{addonsTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* BUDGET PREFERENCE SEGMENT CONTROL */}
                    <div className="border-t border-champagne-gold/10 pt-4 space-y-2">
                      <span className="text-[10px] text-warm-grey block uppercase font-mono tracking-widest font-bold">How does this recommended estimate fit?</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
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
                              className={`py-2 px-1 text-center rounded-lg border text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#D6B46A] text-matte-black border-[#D6B46A] font-extrabold shadow-sm' 
                                  : 'bg-[#111111] border-neutral-800 text-warm-grey hover:border-[#D6B46A]/30 hover:text-soft-ivory'
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Define Your Current Problem / Digital Gap *</label>
                    <textarea 
                      name="currentProblem"
                      required
                      value={formData.currentProblem}
                      onChange={handleInputChange}
                      placeholder="e.g. Our current landing page is extremely slow, looks template-made, and is losing hot buyer leads..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                        formErrors.currentProblem ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.currentProblem && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.currentProblem}</span>}
                  </div>

                  {/* Optional message fields */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold select-none">Subsequent Notes / Supplementary Requests (Optional)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify any localized design preferences or auxiliary tool setups..."
                      rows={2}
                      className="w-full bg-pearl-white/40 border border-champagne-gold/15 p-3.5 text-xs text-matte-black rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* SUBMIT SPRINT TRIGGER */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold uppercase tracking-widest text-[10px] rounded-xl border border-champagne-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-champagne-gold" />
                        Logging Sprint &amp; Triggering Automations...
                      </>
                    ) : (
                      <>
                        {getSubmitButtonText()}
                        <ArrowRight className="w-4 h-4 text-champagne-gold" />
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
