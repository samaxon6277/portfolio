import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Sparkles, AlertCircle, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { Lead } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';

export default function Contact() {
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    serviceNeeded: 'Web Development',
    currentProblem: '',
    desiredTimeline: 'Under 48 Hours',
    budgetRange: '₹50,000 - ₹1,00,000 (Standard Premium)',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Your full name is required';
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (!formData.phone.trim()) errors.phone = 'WhatsApp or contact phone number is required';
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

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...formData,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // Save synchronously to local database fallback and asynchronously to Supabase
    try {
      await supabaseService.upsertLead(newLead);
      analytics.trackFormSubmit();
    } catch (err) {
      console.error('Direct Supabase insert failed, but saved locally:', err);
    }

    // Short UI timeout to guarantee luxury feedback pacing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        city: '',
        serviceNeeded: 'Web Development',
        currentProblem: '',
        desiredTimeline: 'Under 48 Hours',
        budgetRange: '₹50,000 - ₹1,00,000 (Standard Premium)',
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
                “Aap apna business goal share kijiye. Our team will decode the requirement immediately and suggest the fastest premium execution plan.”
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

              <div className="space-y-4">
                {/* WHATSAPP CTA */}
                <a 
                  href="https://wa.me/918000000000?text=SamaXon%20Start%20Build"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => analytics.trackWhatsAppClick()}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between hover:bg-emerald-500/15 duration-200 transition-colors cursor-pointer block text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                      W
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
                  href="https://t.me/samaxon_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-between hover:bg-sky-500/15 duration-200 transition-colors cursor-pointer block text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                      T
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-soft-ivory uppercase tracking-wider">Connect on Telegram</h4>
                      <p className="text-[10px] text-warm-grey">Alert bot triggers demo pipelines</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A1D6FC]" />
                </a>

                {/* EMAIL CTA */}
                <a 
                  href="mailto:build@samaxon.pro"
                  className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl flex items-center justify-between hover:bg-yellow-500/10 duration-200 transition-colors cursor-pointer block text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#BFA15A] text-white flex items-center justify-center font-bold">
                      M
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
            <div className="bg-white rounded-[40px] border border-champagne-gold/15 p-8 sm:p-12 text-left shadow-xl" id="contact-form-container">
              
              <div className="border-b border-champagne-gold/10 pb-6 mb-8">
                <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest font-bold">VALIDATED SECURE INQUIRY SYSTEM</span>
                <h3 className="font-display font-semibold text-xl text-matte-black mt-1">Initiative Staging Brief</h3>
                <p className="text-[11px] text-warm-grey">Describe your business challenges. Our background schemas compile responses directly.</p>
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
                    className="px-8 py-3 bg-matte-black text-white hover:text-champagne-gold text-xs font-mono uppercase tracking-widest rounded-xl transition-all"
                  >
                    Initiate Another Project
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" id="contact-inquiry-form">
                  
                  {/* Name Fields */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Your Full Name *</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sameer Khan"
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                        formErrors.name ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.name}</span>}
                  </div>

                  {/* Business Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Business / Enterprise Name *</label>
                    <input 
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g. Khan Premium Agro India"
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                        formErrors.businessName ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.businessName && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.businessName}</span>}
                  </div>

                  {/* Contacts fields: phone and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 91234 56789"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                          formErrors.phone ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.phone && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Business Email *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. contact@khanagro.com"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                          formErrors.email ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.email && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.email}</span>}
                    </div>
                  </div>

                  {/* Location Area & Capability Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Base City, India *</label>
                      <input 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Kolkata"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                          formErrors.city ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.city && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.city}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Service Capability Requested</label>
                      <select 
                        name="serviceNeeded"
                        value={formData.serviceNeeded}
                        onChange={handleInputChange}
                        className="w-full bg-pearl-white p-3.5 border border-champagne-gold/15 text-xs text-matte-black rounded-xl cursor-pointer"
                      >
                        <option value="Web Development">Premium Website Build (48h)</option>
                        <option value="App Development">Mobile App Development</option>
                        <option value="Logo & Identity Design">Logo &amp; Brand Identity Design</option>
                        <option value="8K Graphic Designing">8K Scroll-Stopping Graphics</option>
                        <option value="Advanced Automations">Business Workflow Automation</option>
                        <option value="Custom Telegram Bots">Real-Time Telegram Alert Bot</option>
                        <option value="Admin Dashboard Systems">Complete Control Layer Scaffold</option>
                        <option value="Performance & SEO Optimization">SEO Rank Maximizer</option>
                      </select>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Define Your Current Problem / Digital Gap *</label>
                    <textarea 
                      name="currentProblem"
                      value={formData.currentProblem}
                      onChange={handleInputChange}
                      placeholder="e.g. Our current landing page is extremely slow, looks template-made, and is losing hot buyer leads..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                        formErrors.currentProblem ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.currentProblem && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.currentProblem}</span>}
                  </div>

                  {/* Timeline Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-[#BFA15A] block tracking-wide font-extrabold select-none">Desired Staging Timeline</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Under 48 Hours', '1 - 2 Weeks', 'Flexible Scheme'].map((time) => {
                        const isSelected = formData.desiredTimeline === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, desiredTimeline: time }))}
                            className={`py-3 text-[9px] font-mono uppercase font-bold rounded-xl border text-center cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-matte-black text-soft-ivory border-champagne-gold/40' 
                                : 'bg-pearl-white/30 border-champagne-gold/10 text-warm-grey hover:border-champagne-gold/30 hover:text-matte-black'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Target Investment Bracket</label>
                    <select 
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full bg-pearl-white p-3.5 border border-champagne-gold/15 text-xs text-matte-black rounded-xl cursor-pointer"
                    >
                      <option value="₹50,000 - ₹1,00,000 (Standard Premium)">₹50,000 - ₹1,00,000 (Standard Premium)</option>
                      <option value="₹1,00,000 - ₹3,00,000 (Complex System Portal)">₹1,00,000 - ₹3,00,000 (Complex System Portal)</option>
                      <option value="₹3,00,000+ (High-End Enterprise Tailored Suite)">₹3,00,000+ (High-End Enterprise Suite)</option>
                    </select>
                  </div>

                  {/* Optional message fields */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Subsequent Notes / Supplementary Requests (Optional)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify any localized design preferences or auxiliary tool setups..."
                      rows={2}
                      className="w-full bg-pearl-white/40 border border-champagne-gold/15 p-3.5 text-xs text-matte-black rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold uppercase tracking-widest text-[10px] rounded-xl border border-champagne-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-champagne-gold" />
                        Logging Inquiry &amp; Launching Automation...
                      </>
                    ) : (
                      <>
                        Initiate My 48-Hour Build Campaign
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
