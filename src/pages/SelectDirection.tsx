import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Send, MessageSquare, Mail, Phone, ArrowLeft, 
  Clock, Sparkles, CheckCircle, ShieldCheck, HelpCircle,
  FileText, User, Layers
} from 'lucide-react';
import SEO from '../components/SEO';
import CustomSelect from '../components/CustomSelect';
import { DEFAULT_PRICING } from '../utils/defaultData';
import { PricingPlan, Lead } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';

export default function SelectDirection() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load plans
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    businessName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitType, setSubmitType] = useState<'site' | 'whatsapp' | 'email'>('site');

  // Contact settings (WhatsApp number & email)
  const [contactSettings, setContactSettings] = useState({
    contactEmail: 'build@samaxon.pro',
    phoneWhatsapp: '+91 80000 00000',
  });

  // Identify pre-selected values from state primitives to avoid infinite render loops on object references
  const statePlanName = location.state?.packageNeeded;
  const statePlanId = location.state?.packageId;

  useEffect(() => {
    let currentPlans = DEFAULT_PRICING;
    // Load custom pricing from localStorage if present
    try {
      const storedPlans = localStorage.getItem('samaxon_pricing_plans');
      if (storedPlans) {
        const parsed = JSON.parse(storedPlans);
        if (parsed.length >= DEFAULT_PRICING.length) {
          currentPlans = parsed;
        } else {
          localStorage.setItem('samaxon_pricing_plans', JSON.stringify(DEFAULT_PRICING));
          currentPlans = DEFAULT_PRICING;
        }
        setPlans(currentPlans);
      }
    } catch (e) {
      console.warn('Failed to parse pricing plans for SelectDirection:', e);
    }

    // Load contact settings
    try {
      const storedSettings = localStorage.getItem('samaxon_website_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setContactSettings({
          contactEmail: parsed.contactEmail || 'build@samaxon.pro',
          phoneWhatsapp: parsed.phoneWhatsapp || '+91 80000 00000',
        });
      }
    } catch (e) {
      console.warn('Failed to parse contact settings in SelectDirection:', e);
    }

    if (statePlanId) {
      setSelectedPlanId(statePlanId);
    } else if (statePlanName) {
      const matched = currentPlans.find(p => p.name.toLowerCase() === statePlanName.toLowerCase());
      if (matched) {
        setSelectedPlanId(matched.id);
      } else {
        setSelectedPlanId(currentPlans[0]?.id || '');
      }
    } else {
      // Default to Pro if nothing passed
      setSelectedPlanId(currentPlans[1]?.id || currentPlans[0]?.id || '');
    }
  }, [statePlanId, statePlanName]);

  const activePlan = plans.find(p => p.id === selectedPlanId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name';
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your WhatsApp / mobile number';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Common lead recording logic to display in Admin Panel
  const recordLeadInBackend = async () => {
    if (!activePlan) return null;

    const formattedMessage = `Checkout Direction Selection Details:
- Chosen Package: ${activePlan.name}
- Package Price: ${activePlan.price}
- Guaranteed Delivery: ${activePlan.deliveryTime}
- User Provided Message: ${formData.description || 'No supplementary requirements provided.'}`;

    const newLead: Lead = {
      id: `lead-checkout-${Date.now()}`,
      name: formData.name,
      businessName: formData.businessName || 'Not Specified',
      phone: formData.phone,
      email: formData.email,
      city: 'Website Checkout Integration',
      serviceNeeded: `${activePlan.name} (${activePlan.price})`,
      currentProblem: `Selected Package: ${activePlan.name}. Needs implementation support.`,
      desiredTimeline: activePlan.deliveryTime,
      budgetRange: activePlan.price,
      message: formattedMessage,
      status: 'new',
      createdAt: new Date().toISOString(),
      priority: 'high'
    } as any;

    try {
      // Save directly to Supabase so it triggers sync workflows
      await supabaseService.upsertLead(newLead);
      analytics.trackFormSubmit();
    } catch (err) {
      console.warn('Direct database lead logging failed, falling back to local:', err);
    }

    // Always fallback to localStorage so Admin sees it in real-time
    try {
      const storedLeadsStr = localStorage.getItem('samaxon_leads');
      const storedLeads = storedLeadsStr ? JSON.parse(storedLeadsStr) : [];
      storedLeads.unshift(newLead);
      localStorage.setItem('samaxon_leads', JSON.stringify(storedLeads));
      window.dispatchEvent(new Event('samaxon_leads_updated'));
    } catch (errLocal) {
      console.warn('Backup local storage lead sync failed:', errLocal);
    }

    return newLead;
  };

  const handleSubscribedThroughSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitType('site');

    await recordLeadInBackend();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleWhatsAppSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitType('whatsapp');

    await recordLeadInBackend();

    // Prepare WhatsApp text
    const planName = activePlan?.name || 'Selected Package';
    const planPrice = activePlan?.price || 'Best Quote';
    const cleanPhone = contactSettings.phoneWhatsapp.replace(/[^+\d]/g, ''); // strip spaces, brackets, etc.
    
    const messageText = `Hello SamaXon, I am interested in your *${planName}* (${planPrice}). Here are my details:

👤 *Name*: ${formData.name}
📱 *Phone*: ${formData.phone}
✉️ *Email*: ${formData.email}
🏢 *Business Name*: ${formData.businessName || 'Not Provided'}
📝 *Requirements*: ${formData.description || 'I want to build this package with you.'}

Please guide me with the next steps.`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const handleEmailSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitType('email');

    await recordLeadInBackend();

    // Prepare mailto link
    const planName = activePlan?.name || 'Selected Package';
    const planPrice = activePlan?.price || 'Best Quote';
    const emailSubject = `Project Initiation Request: ${planName} - SamaXon`;
    const emailBody = `Hello SamaXon Team,

I would like to start working on the ${planName} (${planPrice}) with you.

My Contact Details:
- Name: ${formData.name}
- Phone/WhatsApp: ${formData.phone}
- Email: ${formData.email}
- Business Name: ${formData.businessName || 'N/A'}

Project Details/Description:
${formData.description || 'Standard package implementation.'}

Please reach back to establish the next steps.

Best regards,
${formData.name}`;

    const mailtoUrl = `mailto:${contactSettings.contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.location.href = mailtoUrl;
    }, 800);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id="select-direction-viewport">
      <SEO 
        title="Initiate Your Selected Direction | SamaXon"
        description="Share your requirements for your chosen package. Connect instantly via standard portal submission, direct WhatsApp chat, or direct professional email."
        canonicalPath="/select-direction"
      />

      {/* Background Decorative Rings */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(214, 180, 106, 0.12) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(214, 180, 106, 0.08) 0%, transparent 50%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/pricing"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8A8178] hover:text-[#BFA15A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing Packages
          </Link>
        </div>

        {/* Header Block */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-bold font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Project Activation Node
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-neutral-900 uppercase">
            CHOOSE YOUR PROJECT PATH
          </h1>
          <p className="text-xs text-[#8A8178] max-w-2xl">
            You are initiating a direct workflow. Fill in your communication channels and choose how you want to connect—submit through the site, chat instantly on WhatsApp, or send a direct project mail.
          </p>
        </div>

        {/* Main Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Selected Package Overview & Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 shadow-sm space-y-6">
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#BFA15A] font-bold uppercase tracking-wider block">Currently Selected</span>
                <div className="relative">
                  <CustomSelect
                    value={selectedPlanId}
                    onChange={(val) => setSelectedPlanId(val)}
                    options={[
                      ...plans.filter(p => p.category === 'website' || !p.category).map(plan => ({
                        value: plan.id,
                        label: `${plan.name} (${plan.price})`,
                        group: 'Website Packages'
                      })),
                      ...plans.filter(p => p.category === 'apps-bots-automation').map(plan => ({
                        value: plan.id,
                        label: `${plan.name} (${plan.price})`,
                        group: 'Mobile, Bots & Automation'
                      }))
                    ]}
                  />
                </div>
              </div>

              {activePlan && (
                <motion.div
                  key={activePlan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-4 border-t border-neutral-100"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-display font-black text-neutral-900 uppercase">
                      {activePlan.name}
                    </h3>
                    <p className="text-xs text-[#8A8178]">
                      {activePlan.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-[#8A8178] uppercase block">Estimated Investment</span>
                      <span className="text-xl font-display font-black text-neutral-950">{activePlan.price}</span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] font-mono text-[#8A8178] uppercase block">Guaranteed Delivery</span>
                      <span className="text-xs font-bold font-mono text-[#BFA15A] uppercase flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {activePlan.deliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-[#BFA15A] font-bold uppercase tracking-wider block">What's Included:</span>
                    <div className="space-y-2.5">
                      {activePlan.features.map((feature, fi) => (
                        <div key={fi} className="flex gap-2.5 items-start text-[11px] text-[#605850] leading-tight">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/5 rounded-2xl border border-[#D6B46A]/10 text-[10px] text-[#8A8178] space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-1 text-[#BFA15A] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      SamaXon Direct Assurances
                    </div>
                    <p>
                      Sovereign source file ownership, clean custom compilation, zero recurring builder overheads, and live deployment sync.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Side: High-End Direction Selection Checkout Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6"
                >
                  <h3 className="font-display font-bold text-lg text-neutral-900 uppercase border-b border-neutral-100 pb-3">
                    Contact & Routing Channels
                  </h3>

                  <form onSubmit={handleSubscribedThroughSite} className="space-y-5">
                    
                    {/* Name field */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-[#8A8178] uppercase font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#BFA15A]" />
                        Full Name / Naam *
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Samar Khan"
                        className={`w-full px-4 py-3 bg-[#FFFDF8] border rounded-xl text-xs focus:outline-none transition-colors ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-[#D6B46A]'
                        }`}
                      />
                      {errors.name && <span className="text-[10px] text-red-500 font-medium block">{errors.name}</span>}
                    </div>

                    {/* Contact Number field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-[#8A8178] uppercase font-bold flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#BFA15A]" />
                          WhatsApp / Phone Number *
                        </label>
                        <input 
                          type="text" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 98765 43210"
                          className={`w-full px-4 py-3 bg-[#FFFDF8] border rounded-xl text-xs focus:outline-none transition-colors ${
                            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-[#D6B46A]'
                          }`}
                        />
                        {errors.phone && <span className="text-[10px] text-red-500 font-medium block">{errors.phone}</span>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-[#8A8178] uppercase font-bold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#BFA15A]" />
                          Email Address / Mail ID *
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. build@samaxon.pro"
                          className={`w-full px-4 py-3 bg-[#FFFDF8] border rounded-xl text-xs focus:outline-none transition-colors ${
                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-[#D6B46A]'
                          }`}
                        />
                        {errors.email && <span className="text-[10px] text-red-500 font-medium block">{errors.email}</span>}
                      </div>
                    </div>

                    {/* Business Name optional */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-[#8A8178] uppercase font-bold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#BFA15A]" />
                        Business Name / Agency Name (Optional)
                      </label>
                      <input 
                        type="text" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="e.g. Roy Capital"
                        className="w-full px-4 py-3 bg-[#FFFDF8] border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#D6B46A] transition-colors"
                      />
                    </div>

                    {/* Optional description */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-[#8A8178] uppercase font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#BFA15A]" />
                        Short Description / Custom Requirements (Optional)
                      </label>
                      <textarea 
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Aap apni custom requirement ya dynamic details share kar sakte hain (e.g., custom features needed, integrations, desired design language)."
                        className="w-full px-4 py-3 bg-[#FFFDF8] border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#D6B46A] transition-colors resize-none"
                      />
                    </div>

                    {/* Action Panel: Three Direct Ways to Proceed */}
                    <div className="pt-4 border-t border-neutral-100 space-y-4">
                      <span className="text-[10px] font-mono text-[#BFA15A] font-bold uppercase tracking-wider block">Select Your Action Channel:</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        
                        {/* Option 1: Direct WhatsApp */}
                        <button
                          type="button"
                          onClick={handleWhatsAppSubmit}
                          disabled={isSubmitting}
                          className="flex flex-col items-center justify-center p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl hover:bg-[#25D366]/15 transition-all text-center cursor-pointer group space-y-2 h-full"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#25D366] uppercase block">Instant Connect</span>
                            <span className="text-xs font-black text-neutral-900 font-display">DIRECT WHATSAPP</span>
                          </div>
                        </button>

                        {/* Option 2: Direct Mail */}
                        <button
                          type="button"
                          onClick={handleEmailSubmit}
                          disabled={isSubmitting}
                          className="flex flex-col items-center justify-center p-4 bg-[#D6B46A]/10 border border-[#D6B46A]/30 rounded-2xl hover:bg-[#D6B46A]/15 transition-all text-center cursor-pointer group space-y-2 h-full"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#D6B46A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#BFA15A] uppercase block">Professional Channel</span>
                            <span className="text-xs font-black text-neutral-900 font-display">DIRECT EMAIL</span>
                          </div>
                        </button>

                        {/* Option 3: Site Portal Submission */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex flex-col items-center justify-center p-4 bg-matte-black text-white border border-matte-black rounded-2xl hover:bg-[#1A1A1A] transition-all text-center cursor-pointer group space-y-2 h-full"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#FFFDF8] text-matte-black flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Send className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#BFA15A] uppercase block">Submit proposal</span>
                            <span className="text-xs font-black text-white font-display">SUBMIT THROUGH SITE</span>
                          </div>
                        </button>

                      </div>

                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] border border-neutral-200/60 p-8 md:p-12 text-center shadow-lg space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <h3 className="text-2xl font-display font-black text-neutral-950 uppercase">
                      PROJECT INITIATED SUCCESSFULLY!
                    </h3>
                    
                    {submitType === 'whatsapp' && (
                      <p className="text-xs text-[#8A8178] leading-relaxed">
                        Humne aapka project design lead secure kar liya hai, aur direct WhatsApp open kar diya hai. Agar link automatic generate nahi hua hai, toh hum aapko instant direct WhatsApp par response karenge.
                      </p>
                    )}

                    {submitType === 'email' && (
                      <p className="text-xs text-[#8A8178] leading-relaxed">
                        Humne aapka data record kar liya hai aur default email client trigger kar diya hai. Samar Khan directly aapki details check kar ke proper proposal outline send karenge.
                      </p>
                    )}

                    {submitType === 'site' && (
                      <p className="text-xs text-[#8A8178] leading-relaxed">
                        Thank you for registering through SamaXon. Humne aapki requirements secure kar di hain. Technical Team is analyzing your selected package and will call/email you in under 12 hours.
                      </p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row justify-center gap-3">
                    <Link
                      to="/pricing"
                      className="px-6 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Pricing Table
                    </Link>
                    <Link
                      to="/"
                      className="px-6 py-3 bg-matte-black text-white hover:bg-neutral-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
