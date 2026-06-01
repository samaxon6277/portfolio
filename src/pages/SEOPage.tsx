import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, BadgeCheck, AlertCircle, Quote, Sparkles, LayoutDashboard, Share2, Star, Calendar, MessageSquare, Flame } from 'lucide-react';
import SEO from '../components/SEO';
import { supabaseService } from '../utils/supabaseService';

interface FAQ {
  q: string;
  a: string;
}

interface NicheConfig {
  title: string;
  description: string;
  canonicalPath: string;
  headline: string;
  painPoint: string;
  sol: string;
  keywords: string[];
  faqs: FAQ[];
}

export const NICHE_DATA: Record<string, NicheConfig> = {
  banquet: {
    title: 'Premium Banquet Hall Website Design & Booking System',
    description: 'SamaXon creates elegant, high-converting banquet hall websites with interactive slot calendars, plate cost calculators, virtual 3D tour panels, and direct-closing CRM systems with zero monthly commissions.',
    canonicalPath: '/banquet-hall-website-design',
    headline: 'Secure Wedding Bookings with Custom Banquet Portals',
    painPoint: 'Tired of paying massive listing platform subscriptions or losing premium wedding leads to commission brokers and outdated photo galleries?',
    sol: 'Our premium wedding and banquet hall portals feature luxury photography grids, real-time date availability checkers, interactive banqueting menu estimators, and down-payment systems curated for highest conversion rates.',
    keywords: ['marriage hall booking web systems', 'banquet hall website designer', 'party lawn portal designs', 'corporate banquet event panels'],
    faqs: [
      { q: "How does the wedding date availability check function?", a: "Your website features a direct calendar slot dashboard synced directly to your administration app, avoiding double-bookings while letting guests reserve slots." },
      { q: "Can we integrate instant menu cost calculators?", a: "Yes. Wedding party clients enter client counts, choose veg/non-veg plate grades, decorate tiers, and retrieve a beautiful PDF cost estimate instantly." }
    ]
  },
  resort: {
    title: 'Luxury Resorts & Nature Retreat Website Design Agency',
    description: 'SamaXon designs immersive resort websites with interactive room reservation systems, experience packaging grids, activity highlights, and direct billing integration with 100% cloud ownership.',
    canonicalPath: '/resort-website-design',
    headline: 'Immersive Retreat Portals For Elite Luxury Resorts',
    painPoint: 'Losing 15% to 25% room-rate commission shares to OTAs and third-party booking travel portals every month?',
    sol: 'We develop beautiful, visual-heavy resort portals utilizing cinematic video backgrounds, touch-native room calendars, customizable package booking calculators, and zero-commission booking pipelines.',
    keywords: ['spa resort website development', 'eco resort custom web design', 'resort room reservation system', 'wellness retreat booking site'],
    faqs: [
      { q: "Can we override seasonal peak resort rates and customize holiday packages?", a: "Yes. The administrative CRM allows overriding pricing tier systems, weekend premium slots, wellness package durations, and breakfast configurations in real-time." },
      { q: "Is there synchronizations for multi-OTA channel bookings?", a: "Absolutely. We sync your direct website reservation calendar with Booking, Agoda, and Airbnb using iCal standard protocols, preventing overbooking." }
    ]
  },
  hotel: {
    title: 'Boutique & Heritage Hotel Website Design Agency',
    description: 'Premium boutique and heritage hotel web development. Features rooms list matrices, instant speed booking check-outs, local maps SEO integrations, and automatic GST compliant invoice generations.',
    canonicalPath: '/hotel-website-design',
    headline: 'Multiply Heritage and Boutique Hotel Direct Room bookings',
    painPoint: 'Struggling with slow website loads, low direct bookings, or booking portals failing on mobile devices?',
    sol: 'Our heritage hotel packages compile highly visual, fast-loading room galleries, transparent guest tax estimators, custom travel guide grids, and payment systems loading under 1.2s.',
    keywords: ['heritage boutique hotel site designs', 'boutique room reserving softwares', 'speedy reservation checkouts', 'hotel marketing web development'],
    faqs: [
      { q: "Does the booking form support commercial billing details & GST invoices?", a: "Yes, corporate travelers can enter specific company GST details to receive auto-generated compliance invoices directly." },
      { q: "Why is website speed important for luxury hotel bookings?", a: "Our hotels load within 1.2 seconds, resulting in a 40% bounce rate decrease compared to heavy heritage themes, retaining high-budget users." }
    ]
  },
  gym: {
    title: 'Exclusive Fitness Clubs, Gym & Pilates Web Design Provider',
    description: 'Bespoke fitness clubs and gym branding web solutions. Includes membership selector cards, real-time scheduler integrations, trainers bios, and automated monthly subscription payment paths.',
    canonicalPath: '/gym-website-design',
    headline: 'Slick Member Portals for High-Budget Gyms & Yoga Hubs',
    painPoint: 'Members calling repeatedly to schedule sessions or buy crossfit memberships through confusing external application stores?',
    sol: 'We build direct web membership flows, online registration gateways, trainer appointment schedulers, and slick scan-to-enter QR code generators optimized for all major browsers.',
    keywords: ['fitness club portal developer', 'crossfit gym custom web', 'pilates studio schedule tracker', 'recurring subscription pay gym'],
    faqs: [
      { q: "Does the gym website support automated monthly UPI autopay subscription?", a: "Yes. We configure recurring UPI autopay or card mandate authentications so your club secures monthly renewal fees without manual collection stress." },
      { q: "Can members book private classes with personal trainers directly?", a: "Members select the trainer profile card, view available 1-on-1 slots, make session payments, and secure their training appointment instantly." }
    ]
  },
  restaurant: {
    title: 'Fine-Dining Restaurants, Lounge & Bistro Web Design Studio',
    description: 'Stunning interactively visual menu interfaces, reservation seat calendars with deposit support, corporate catering estimate engines, and WhatsApp direct delivery integrations.',
    canonicalPath: '/restaurant-website-design',
    headline: 'Indulgent Culinary Web Experiences for Fine Dining Bistros',
    painPoint: 'Surrendering 30% food transaction fees to heavy delivery platforms, and relying on obsolete, static download PDF menus?',
    sol: 'Our gourmet restaurant blueprints build premium, responsive menu items, table seating reservation grids, catering estimate forms, and direct WhatsApp delivery models.',
    keywords: ['interactive restaurant bill menus', 'table reservation web engine', 'commissions free food order site', 'bistro custom web develop'],
    faqs: [
      { q: "How do table reservations alert the dining floor?", a: "Every table booking sends instant alerts to the host desk via email or automated Google Sheets/WhatsApp integrations for real-time guest seating management." },
      { q: "Can customers order catering and set backend specifications?", a: "Clients customize plate plans, add special catering items (veg/non-veg ratios, live counters) and receive automatic estimates." }
    ]
  },
  business: {
    title: 'Bespoke Premium Corporate & Brand Web Design Agency',
    description: 'We construct lightweight, speed-optimized custom corporate and business websites with built-in leads capturing panels, consultation scheduler cards, and dynamic SEO pages.',
    canonicalPath: '/business-website-design',
    headline: 'Accelerate Authority with Distinctive Corporate Portals',
    painPoint: 'Using generic, slow-loading WordPress or Wix widgets that dilute your authority and look identical to lower-tier competitors?',
    sol: 'SamaXon designs bespoke, hand-crafted corporate solutions that match your exact visual framework. We deliver ultra-low page weights, premium typography, custom lead-capture pipelines, and fast API integration structures.',
    keywords: ['premium corporate web agencies', 'bespoke brand website developer', 'speed consulting web builder', 'b2b corporate lead funnels'],
    faqs: [
      { q: "What is the speed guarantee of SamaXon custom engines?", a: "WordPress or elementor sites depend on heavy databases. We deploy compiled, hand-written static files, consistently score 99%+ on Google Lighthouse Vitals, and load within a blink." },
      { q: "Do we receive an administrative panel to review submissions?", a: "Yes. Every client receives credentials to our robust Admin panel, enabling you to inspect incoming client inquiries, update portfolio cards, and handle lead logs." }
    ]
  },
  school: {
    title: 'Premium School, Academy & K12 Portal Design Agency',
    description: 'SamaXon designs beautiful, high-converting school and educational institution websites with interactive academic calendars, fee calculators, admission inquiry systems, and custom content management zero monthly commissions.',
    canonicalPath: '/school-website-design',
    headline: 'Secure Student Enrollments with Custom Academy Portals',
    painPoint: 'Tired of losing parent attention to slow-loading school portals, or struggles with endless manual paperwork?',
    sol: 'Our bespoke educational portals feature dynamic academic highlights, fast online admission forms, teacher-parent communication modules, and real-time inquiry management matrices.',
    keywords: ['school portal development', 'academy web designs', 'college admissions sites', 'student management setups'],
    faqs: [
      { q: "How are student admission inquiries tracked?", a: "All submissions load instantly in your central administrative panel. Admins can view complete contact data, parent details, and targeted grades." },
      { q: "Can we publish digital newsletters and school event calendars?", a: "Yes. Adding newsletters, upcoming sports events, and exam timetables is simple and can be done instantly in the administration console." }
    ]
  },
  clinic: {
    title: 'Specialized Medical Clinics, Doctors & Wellness Web Design',
    description: 'Bespoke medical clinic, diagnostic center, and doctor practice branding web solutions. Includes patient slot booking calendars, therapist profiles, and automated WhatsApp healthcare inquiry routers.',
    canonicalPath: '/clinic-website-design',
    headline: 'Multiply Patient Bookings with Secure Healthcare Portals',
    painPoint: 'Losing valued patients to expensive hospital booking aggregators, or managing patient schedules with phone calls and spreadsheets?',
    sol: 'We develop beautiful, HIPAA-ready doctor and clinic websites with premium doctors cards, direct appointments calendars, healthcare packages cost estimators, and direct patient acquisition panels.',
    keywords: ['doctor clinic websites', 'medical facility custom design', 'wellness center slots system', 'physiotherapist schedule web'],
    faqs: [
      { q: "Does the booking form connect to our WhatsApp or email?", a: "Yes. Patients can submit booking details which immediately fire alerts to your clinic's WhatsApp line and emails for easy verification." },
      { q: "Can we showcase specialized medical packages?", a: "Yes. Show health checkup packages with full cost details and let patients secure their clinic slot online." }
    ]
  },
  interior: {
    title: 'Interior Designers, Architecture Studios & Decors Web Design',
    description: 'Immersive interior designer and architecture brand websites. Features luxury cinematic portfolio matrices, projects catalog folder downloads, and consultation scheduler integrations.',
    canonicalPath: '/interior-designer-website-design',
    headline: 'Secure Premium Clients with Immersive Architectural Portals',
    painPoint: 'Failing to display high-resolution visual mastery, or losing high-ticket design contracts to lower-tier competitors?',
    sol: 'Our design studio packages feature ultra-low weight 8K graphics capabilities, project categories filters, budget calculators, and booking systems built to convert high-budget leads.',
    keywords: ['interior design portfolio sites', 'architect web development', 'premium decoration portfolios', 'high-ticket design funnels'],
    faqs: [
      { q: "Can clients filter your portfolio by design style or project type?", a: "Yes. Your dynamic project filter lets clients view residential, commercial, or modular kitchen segments instantly without page reloads." },
      { q: "How do potential clients schedule an initial consultation?", a: "We place clean consultation cards throughout the portal, scheduling direct project calls on your team's calendar slot." }
    ]
  }
};

interface SEOPageProps {
  niche: string;
  setCurrentPage?: (page: string) => void;
}

export default function SEOPage({ niche = 'business', setCurrentPage }: SEOPageProps) {
  const config = NICHE_DATA[niche] || NICHE_DATA.business;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    nicheReq: config.title,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim() || !leadForm.email.trim()) {
      setFormError('Please fill in Name, Phone, and Email');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const leadRecord = {
        id: `lead-${Date.now()}`,
        name: leadForm.name,
        businessName: `${niche.toUpperCase()} - Direct Landing Lead`,
        email: leadForm.email,
        phone: leadForm.phone,
        city: 'Online Organic',
        serviceNeeded: `${config.headline} [${niche.toUpperCase()}]`,
        currentProblem: 'Prospect requested free consultation demo layout for ' + niche,
        desiredTimeline: 'Within 2 Weeks',
        budgetRange: 'Premium Segment',
        message: leadForm.message || `Prospect applied directly from localized SEO rank page: ${config.canonicalPath}`,
        status: 'new' as const,
        createdAt: new Date().toISOString()
      };

      const success = await supabaseService.upsertLead(leadRecord);
      if (success) {
        setIsSuccess(true);
        setLeadForm({
          name: '',
          phone: '',
          email: '',
          nicheReq: config.title,
          message: ''
        });
      } else {
        setFormError('Failed to capture lead. Please attempt direct contact instead.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An error occurred during submission. Placed locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Construct schemas for this page to inject into our upgraded SEO component
  const pageSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": config.title,
      "description": config.description,
      "provider": {
        "@type": "LocalBusiness",
        "name": "SamaXon Digital Solutions",
        "image": "https://samaxon.site/og-image.png",
        "url": "https://samaxon.site"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": config.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "SamaXon Solutions",
          "item": "https://samaxon.site"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": config.title,
          "item": `https://samaxon.site${config.canonicalPath}`
        }
      ]
    }
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-32 pb-20 text-left" id={`seo-landing-${niche}`}>
      <SEO 
        title={config.title}
        description={config.description}
        canonicalPath={config.canonicalPath}
        schemas={pageSchemas}
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP PATH TRACE / SUB-HEADER */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-[10px] font-mono tracking-wider text-warm-grey uppercase font-bold">
          <Link to="/" className="hover:text-champagne-gold transition-colors">SamaXon</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-champagne-gold transition-colors">Services</Link>
          <span>/</span>
          <span className="text-matte-black">{niche} Web Development</span>
        </div>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 border-b border-champagne-gold/15 pb-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9.5px] font-mono uppercase font-black tracking-widest rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Niche Service Excellence
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-matte-black leading-tight">
              {config.headline}
            </h1>
            
            <p className="text-sm text-warm-grey leading-relaxed max-w-2xl font-sans">
              {config.description}
            </p>

            {/* Pain Point Indicator Block */}
            <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl space-y-2 mt-4">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-700 shrink-0" />
                The Market Pain-Point:
              </h4>
              <p className="text-xs text-rose-700/90 font-sans leading-relaxed">
                {config.painPoint}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-3">
              {config.keywords.map((word, idx) => (
                <span key={idx} className="text-[10px] uppercase tracking-wider font-mono font-bold bg-[#FAF8F5] border border-champagne-gold/15 text-warm-grey px-3 py-1 rounded-full">
                  #{word}
                </span>
              ))}
            </div>
          </div>

          {/* VISUAL MOCKUP PREVIEW SIDE */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-champagne-gold/5 via-muted-gold/5 to-transparent rounded-3xl blur-2xl transform rotate-6 pointer-events-none" />
            
            <div className="relative bg-[#111111] border border-champagne-gold/25 rounded-3xl p-6 shadow-2xl space-y-5 text-[#FFFDF8]">
              {/* Fake web layout indicator */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-white/5 border border-white/10 text-[8px] font-mono text-white/50 px-3 py-1 rounded-full">
                  https://samaxon.site{config.canonicalPath}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-mono text-[#D6B46A] uppercase font-bold tracking-widest block">Live Precompiled Build Preview</span>
                <h3 className="font-display font-black text-lg text-white leading-snug">
                  Uncapped Direct Leads. <br />
                  <span className="text-[#D6B46A]">No Recurring commissions.</span>
                </h3>
                <p className="text-[10px] text-white/60 leading-relaxed font-sans">
                  {config.sol}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[8px] font-mono text-white/40 block uppercase">COMPILE SPEED</span>
                  <strong className="text-emerald-400 font-mono">0.68 Seconds</strong>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-[8px] font-mono text-white/40 block uppercase font-bold">LIGHTHOUSE</span>
                  <strong className="text-emerald-400 font-mono">100/100 Perfect</strong>
                </div>
              </div>

              <div className="pt-2 text-[9px] font-mono text-[#D6B46A] text-center border-t border-white/5 block">
                SamaXon High Fidelity Blueprint Grid • Click to demo
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED FEATURES / PROPOSAL */}
        <div className="mb-20">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold block mb-1">System Core Features</span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-matte-black tracking-tight">
              Bespoke {niche.toUpperCase()} Platforms Equipped with Complete Administrative Controllers
            </h2>
            <p className="text-xs text-warm-grey mt-2">
              We do not utilize generic WordPress templates. Your portal is coded exclusively using fast static files and headless pipelines, yielding unprecedented search index authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-champagne-gold/15 p-6 rounded-2xl space-y-3">
              <span className="w-8 h-8 font-mono font-bold bg-[#FAF8F5] border border-champagne-gold/15 rounded-full flex items-center justify-center text-champagne-gold text-xs leading-none">01</span>
              <h4 className="font-display font-medium text-matte-black text-sm">Commission-Free Systems</h4>
              <p className="text-xs text-warm-grey leading-relaxed font-sans">
                Stop paying 15-30% fees on every customer booking slot. Own your client base, capture deposits directly to your bank account, and steady retention.
              </p>
            </div>

            <div className="bg-white border border-champagne-gold/15 p-6 rounded-2xl space-y-3">
              <span className="w-8 h-8 font-mono font-bold bg-[#FAF8F5] border border-champagne-gold/15 rounded-full flex items-center justify-center text-champagne-gold text-xs leading-none">02</span>
              <h4 className="font-display font-medium text-matte-black text-sm">Curated CRM Controllers</h4>
              <p className="text-xs text-warm-grey leading-relaxed font-sans">
                Manage all date inquiries, customer reservations, menu plates pricing, membership plans, and system logs yourself inside our simple web dashboard.
              </p>
            </div>

            <div className="bg-white border border-[#D6B46A]/25 p-6 bg-gradient-to-br from-champagne-gold/5 via-transparent to-transparent rounded-2xl space-y-3">
              <span className="w-8 h-8 font-mono font-bold bg-white border border-[#D6B46A] rounded-full flex items-center justify-center text-matte-black text-xs leading-none">03</span>
              <h4 className="font-display font-medium text-matte-black text-sm">Search Engine Authority</h4>
              <p className="text-xs text-warm-grey leading-relaxed font-sans">
                Static source files optimize local SEO. Rank first on Google search maps in your city for category queries, securing regular direct calls.
              </p>
            </div>
          </div>
        </div>

        {/* LEAD CAPTURE SECTION & FAQS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-champagne-gold/15 rounded-3xl p-8 sm:p-12 shadow-md">
          
          {/* FAQs list (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider">Expert Consultations</span>
              <h3 className="font-display font-black text-xl text-matte-black">Frequently Answered Queries</h3>
              <p className="text-xs text-warm-grey mt-1">Get precise details regarding billing schedules, delivery phases, and customization limits.</p>
            </div>

            <div className="space-y-4" id="faq-accordions">
              {config.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border-b border-champagne-gold/15 pb-4"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-2 font-display font-bold text-xs text-matte-black hover:text-[#BFA15A] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-champagne-gold font-mono">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="text-xs text-warm-grey leading-relaxed pt-2 pl-2 border-l border-champagne-gold/10 font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Quick trust metrics */}
            <div className="p-4 bg-pearl-white/40 border border-champagne-gold/10 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-champagne-gold uppercase tracking-wider font-bold block">100% Satisfaction SLA Contract</span>
              <p className="text-[11px] text-warm-grey font-sans">SamaXon operates high SLA direct commitments. If your pre-built layout does close a pipeline load according to specifications, we adjust configurations with zero additional levies.</p>
            </div>
          </div>

          {/* Lead capture form (Right) */}
          <div className="lg:col-span-5 w-full bg-[#FAF8F5] border border-champagne-gold/25 p-6 rounded-2xl text-left relative">
            
            <div className="border-b border-champagne-gold/15 pb-4 mb-4">
              <span className="text-[9px] font-mono text-champagne-gold uppercase tracking-wider block font-bold">CONSULTATION SECURING FORM</span>
              <h4 className="font-display font-bold text-sm text-matte-black mt-0.5">Capture Pre-Built Live Demo</h4>
              <p className="text-[10px] text-warm-grey font-sans leading-normal">Our digital consultants sync back within 24 hours to showcase custom blueprints targeting your brand.</p>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4" id="seo-lead-success">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h5 className="font-display font-bold text-sm text-matte-black">Consultation Agenda Secured</h5>
                <p className="text-[11px] text-warm-grey max-w-xs mx-auto">Our lead website consultant will contact your WhatsApp terminal to coordinate slot preview options. Thank you!</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 text-[10px] font-mono bg-matte-black text-[#FFFDF8] hover:text-[#D6B46A] uppercase tracking-wider rounded-lg transition-all"
                >
                  Apply Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4" id="seo-niche-form">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-charcoal font-bold">Your Name *</label>
                  <input 
                    type="text"
                    name="name"
                    value={leadForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Advait Kumar"
                    className="w-full bg-white border border-champagne-gold/15 p-2.5 text-xs text-matte-black rounded-lg"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-charcoal font-bold">Phone (WhatsApp Recommended) *</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={leadForm.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 91234 56789"
                    className="w-full bg-white border border-champagne-gold/15 p-2.5 text-xs text-matte-black rounded-lg"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-charcoal font-bold">Email Address *</label>
                  <input 
                    type="email"
                    name="email"
                    value={leadForm.email}
                    onChange={handleInputChange}
                    placeholder="e.g. advait@hotelbrand.com"
                    className="w-full bg-white border border-champagne-gold/15 p-2.5 text-xs text-matte-black rounded-lg"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-charcoal font-bold">Describe Custom Specs (Optional)</label>
                  <textarea 
                    name="message"
                    value={leadForm.message}
                    onChange={handleInputChange}
                    placeholder={`e.g. Tell us your banquet capacity, hotel room counts, or fitness hub schedules...`}
                    rows={3}
                    className="w-full bg-white border border-champagne-gold/15 p-2.5 text-xs text-matte-black rounded-lg"
                  />
                </div>

                {formError && (
                  <div className="p-2 bg-red-100 text-red-700 text-[10.5px] rounded border border-red-200 font-semibold">{formError}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-matte-black hover:bg-charcoal text-white hover:text-champagne-gold font-bold uppercase tracking-widest text-[9.5px] rounded-xl border border-champagne-gold/20 flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  {isSubmitting ? 'Securing Live Blueprint...' : 'Capture pre-built demonstration'}
                  <ArrowRight className="w-4 h-4 text-champagne-gold" />
                </button>

              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
