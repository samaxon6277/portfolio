import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, DollarSign, ArrowRight, CheckCircle2, ShieldCheck, 
  Clock, Sparkles, Building2, UserCheck, Briefcase, Server, 
  PenTool, Code2, Calculator, HelpCircle, ChevronDown, Check, X
} from 'lucide-react';
import SEO from '../components/SEO';
import { SITE_CONFIG, getWhatsAppInquiryUrl } from '../config/siteConfig';

export default function Partner() {
  const [projectValue, setProjectValue] = useState<number>(500000);
  const [selectedService, setSelectedService] = useState<'standard' | 'ai'>('standard');
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    category: 'Freelancer',
    portfolioOrWebsite: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Commission calculation
  const commissionRate = selectedService === 'ai' ? 0.20 : 0.15;
  const estimatedCommission = Math.round(projectValue * commissionRate);

  const presets = [
    { value: 100000, label: '₹1,00,000', popular: false },
    { value: 500000, label: '₹5,00,000', popular: true },
    { value: 1000000, label: '₹10,00,000', popular: false },
    { value: 2000000, label: '₹20,00,000', popular: false }
  ];

  const whoCanJoin = [
    {
      num: '01',
      title: 'Digital Marketing Agencies',
      desc: 'Add high-end web, app, and automation development to your client offerings without hiring or managing a dedicated engineering team.',
      tag: 'Agency Partner'
    },
    {
      num: '02',
      title: 'Freelancers & Designers',
      desc: 'Pass on projects that are too large or technically complex — and still receive a guaranteed 15-20% commission on the entire closed project value.',
      tag: 'Creative Partner'
    },
    {
      num: '03',
      title: 'Business Consultants',
      desc: 'Recommend an engineering delivery team that your corporate clients can truly rely upon for rapid 48-hour sprints and enterprise stability.',
      tag: 'Consultant Partner'
    },
    {
      num: '04',
      title: 'Hosting & Domain Providers',
      desc: 'Turn your server and domain purchasers into high-ticket referral revenue by introducing them to modern hand-coded website and app builds.',
      tag: 'Infrastructure Partner'
    },
    {
      num: '05',
      title: 'Bloggers & Content Creators',
      desc: 'Monetize an audience that constantly asks you who to hire for tech development, Telegram bots, or custom business software.',
      tag: 'Creator Partner'
    },
    {
      num: '06',
      title: 'IT & Software Companies',
      desc: 'Fill capability gaps in web, mobile, Telegram bots, and automated AI systems with an accountable, NDA-backed technical partner.',
      tag: 'Tech Partner'
    }
  ];

  const commissionRates = [
    { service: 'Website Development', rate: '15%', note: 'Landing pages, corporate portals, e-commerce stores' },
    { service: 'E-commerce & Storefronts', rate: '15%', note: 'Custom Shopify, WooCommerce, headless checkouts' },
    { service: 'Custom Software & CRMs', rate: '15%', note: 'SaaS MVPs, client portals, internal operational tools' },
    { service: 'Mobile App Development', rate: '15%', note: 'iOS & Android native and WebView hybrid wrappers' },
    { service: 'AI Solutions & Automation', rate: '20%', note: 'Agentic workflows, Telegram alert bots, LLM grounding', topTier: true }
  ];

  const whyPartner = [
    {
      num: '01',
      title: 'Full Stack Development Team',
      desc: 'Web, mobile, and backend under one roof — no scope falls through the cracks and no third-party outsourcing.'
    },
    {
      num: '02',
      title: 'AI & Automation Specialists',
      desc: 'Custom bots, intelligent CRM syncs, and workflow integrations your clients are actively searching for.'
    },
    {
      num: '03',
      title: 'Dedicated Project Managers',
      desc: 'A single, responsive point of contact keeps every technical sprint moving on schedule with zero drama.'
    },
    {
      num: '04',
      title: 'Transparent Commission Reporting',
      desc: 'Live tracking of where your referred lead stands in the pipeline and exact payout calculations.'
    },
    {
      num: '05',
      title: 'Fast 15-Day Payouts',
      desc: 'Your commission is transferred directly to your bank account within 15 days of client milestone clearance.'
    },
    {
      num: '06',
      title: 'Global Delivery Capability',
      desc: 'Refer clients from India, UAE, UK, or the USA — we deliver to international code and design standards.'
    }
  ];

  const faqs = [
    {
      q: 'When do I receive my commission payout?',
      a: 'Commissions are calculated and paid directly to your registered bank account or UPI within 15 days of the client invoice clearance. For milestone-based projects, your commission is released with each milestone cleared.'
    },
    {
      q: 'Is there any joining fee or monthly sales target?',
      a: 'Absolutely none. The SamaXon Partner Program is completely free to join. There are no minimum sales quotas, no lock-in periods, and no recurring targets. You earn whether you refer 1 project a year or 10 a month.'
    },
    {
      q: 'Is there any minimum payout threshold?',
      a: 'No minimum payout. Even for smaller builds of ₹30,000, your 15% commission (₹4,500) is paid out in full without any retention or hidden processing fees.'
    },
    {
      q: 'Can marketing agencies white-label our services?',
      a: 'Yes. We offer both direct referral (we handle client communication and you earn commission) and white-label fulfillment (we work behind the scenes as your engineering back-office under your brand).'
    },
    {
      q: 'Can individual freelancers or developers join?',
      a: 'Yes, freelancers make up a large portion of our partner network. If a client needs a tech stack outside your core expertise or a project scope is too demanding, pass it to us and secure your commission effortlessly.'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.whatsapp) return;

    try {
      const storedPartners = JSON.parse(localStorage.getItem('samaxon_partner_applications') || '[]');
      storedPartners.unshift({
        ...partnerForm,
        submittedAt: new Date().toISOString(),
        id: 'PRT-' + Date.now()
      });
      localStorage.setItem('samaxon_partner_applications', JSON.stringify(storedPartners));
    } catch (e) {
      console.warn('Local partner storage backup failed', e);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24 text-matte-black" id="partner-program-page">
      <SEO 
        title="Partner & Affiliate Program - Refer a Project, Earn 20% | SamaXon"
        description="Partner with SamaXon Studio. Refer businesses needing custom websites, apps, and AI automations and earn up to 20% commission on every closed deal. No fees, no targets."
        canonicalPath="/partner"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="border-b border-champagne-gold/20 pb-16 mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-gold/15 border border-champagne-gold/30 text-[#A68936] text-xs font-mono uppercase font-bold tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            SAMAXON PARTNER NETWORK
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-matte-black tracking-tight leading-[1.08] max-w-4xl">
            Refer a project, earn up to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-matte-black">
              20% of its value.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A433B] leading-relaxed max-w-3xl mt-6 font-normal">
            Know a business that needs a high-performance website, an iOS/Android app, or custom workflow automation? Send them our way. You get paid on every project they run with us — no cap, no lock-in, no sales targets.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-8 py-4 bg-matte-black hover:bg-black text-soft-ivory text-sm font-bold uppercase tracking-wider rounded-xl border border-champagne-gold/40 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              Apply in two minutes
              <ArrowRight className="w-4 h-4 text-champagne-gold" />
            </button>

            <a
              href="#how-it-works"
              className="px-6 py-4 bg-white/80 hover:bg-white text-matte-black text-sm font-bold tracking-wider rounded-xl border border-champagne-gold/25 hover:border-champagne-gold/50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              See how it works
            </a>
          </div>

          {/* 4 Trust points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-champagne-gold/15">
            {[
              { label: 'No joining fee', sub: '100% Free forever' },
              { label: 'No sales target', sub: 'Refer at your pace' },
              { label: '15-Day payouts', sub: 'Direct bank transfer' },
              { label: 'Lifetime partnership', sub: 'Recurring client cuts' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-champagne-gold shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-matte-black">{item.label}</div>
                  <div className="text-xs text-[#7A7167] font-mono">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Card */}
          <div className="mt-12 bg-[#141414] text-soft-ivory rounded-2xl border border-champagne-gold/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
                WHAT YOU EARN
              </span>
              <div className="text-xl sm:text-2xl font-display font-black">
                15% on websites, software & apps · 20% on AI automations
              </div>
              <p className="text-xs sm:text-sm text-[#A89F91]">
                Paid within 15 days of client payment clearance · Direct INR / USD wire transfer · Zero minimum payout threshold.
              </p>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="shrink-0 px-6 py-3 bg-champagne-gold text-matte-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-muted-gold transition-all cursor-pointer shadow-md"
            >
              Join Network
            </button>
          </div>
        </div>

        {/* --- WHO CAN JOIN SECTION --- */}
        <section className="mb-24 text-left">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-2">
              WHO CAN JOIN
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-matte-black tracking-tight">
              Built for anyone with the right network.
            </h2>
            <p className="text-[#595046] text-base mt-2 max-w-2xl font-normal">
              If you talk to businesses that need digital products, you already have everything you need to earn continuous referral income with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whoCanJoin.map((card, idx) => (
              <div 
                key={idx}
                className="bg-white/90 border border-champagne-gold/25 hover:border-champagne-gold/55 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-champagne-gold px-2.5 py-1 bg-champagne-gold/10 rounded-lg">
                      {card.tag}
                    </span>
                    <span className="text-2xl font-display font-bold text-matte-black/25 group-hover:text-champagne-gold transition-colors">
                      {card.num}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-matte-black mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#595046] leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works" className="mb-24 text-left border-t border-champagne-gold/20 pt-16">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-2">
              HOW IT WORKS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-matte-black tracking-tight">
              Three steps between you and a payout.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Refer a Lead',
                desc: 'Share a company or prospect with us — a name, contact details, and what they need. That is the whole job on your end.'
              },
              {
                step: '02',
                title: 'We Close the Deal',
                desc: 'Our senior team handles discovery, architecture design, and proposal presentation. You stay in the loop without doing the heavy lifting.'
              },
              {
                step: '03',
                title: 'You Earn Commission',
                desc: 'Once the client pays their milestone invoices, your 15-20% commission is calculated and paid out directly. Clean, transparent, and on schedule.'
              }
            ].map((st, idx) => (
              <div 
                key={idx}
                className="bg-white border border-champagne-gold/25 rounded-2xl p-8 relative overflow-hidden shadow-sm"
              >
                <div className="text-4xl sm:text-5xl font-display font-black text-champagne-gold/30 mb-4">
                  {st.step}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#A68936] font-bold mb-1">
                  STEP {st.step}
                </div>
                <h3 className="text-xl font-display font-bold text-matte-black mb-3">
                  {st.title}
                </h3>
                <p className="text-sm text-[#595046] leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- COMMISSION STRUCTURE SECTION --- */}
        <section className="mb-24 text-left border-t border-champagne-gold/20 pt-16">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-2">
              COMMISSION STRUCTURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-matte-black tracking-tight">
              Clear rates on every project type.
            </h2>
            <p className="text-[#595046] text-base mt-2 max-w-2xl font-normal">
              The same percentage applies whether the project is ₹50,000 or ₹25 Lakhs. The bigger the project scope, the bigger your cheque.
            </p>
          </div>

          <div className="bg-white border border-champagne-gold/25 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-champagne-gold/15">
              {commissionRates.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    item.topTier ? 'bg-champagne-gold/10' : 'hover:bg-soft-ivory/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-display font-bold text-lg text-matte-black">
                        {item.service}
                      </span>
                      {item.topTier && (
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-champagne-gold text-black">
                          TOP TIER 20%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6E6459]">
                      {item.note}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl sm:text-3xl font-display font-black text-matte-black">
                      {item.rate}
                    </span>
                    <span className="text-[11px] font-mono text-[#7A7167] block">
                      of project value
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- EARNINGS CALCULATOR --- */}
        <section className="mb-24 text-left border-t border-champagne-gold/20 pt-16">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-2">
              EARNINGS CALCULATOR
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-matte-black tracking-tight">
              See what a single referral can pay.
            </h2>
            <p className="text-[#595046] text-base mt-2 max-w-2xl font-normal">
              Based on our transparent rates. Standard builds pay 15%, while AI and custom automation projects pay a full 20%.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Presets Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {presets.map((preset) => {
                const isSelected = projectValue === preset.value;
                const calcPayout = Math.round(preset.value * commissionRate);
                return (
                  <button
                    key={preset.value}
                    onClick={() => setProjectValue(preset.value)}
                    className={`p-6 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-matte-black text-soft-ivory border-champagne-gold/60 shadow-xl scale-[1.02]' 
                        : 'bg-white border-champagne-gold/25 hover:border-champagne-gold/50 text-matte-black'
                    }`}
                  >
                    {preset.popular && (
                      <span className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-champagne-gold text-black">
                        MOST POPULAR
                      </span>
                    )}

                    <div>
                      <span className={`text-xs font-mono uppercase tracking-wider block mb-1 ${
                        isSelected ? 'text-champagne-gold' : 'text-[#7A7167]'
                      }`}>
                        PROJECT VALUE
                      </span>
                      <div className="text-2xl font-display font-black">
                        {preset.label}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-champagne-gold/20">
                      <span className={`text-[11px] font-mono uppercase tracking-wider block ${
                        isSelected ? 'text-soft-ivory/70' : 'text-[#7A7167]'
                      }`}>
                        YOU EARN
                      </span>
                      <div className={`text-2xl font-display font-black ${
                        isSelected ? 'text-champagne-gold' : 'text-matte-black'
                      }`}>
                        ₹{calcPayout.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] font-mono opacity-80">
                        ● {commissionRate * 100}% commission
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Interactive Payout Box */}
            <div className="lg:col-span-5 bg-matte-black text-soft-ivory rounded-2xl border border-champagne-gold/30 p-8 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold font-bold">
                    CUSTOM CALCULATOR
                  </span>
                  <Calculator className="w-5 h-5 text-champagne-gold" />
                </div>

                {/* Service Type Switcher */}
                <div className="flex gap-2 p-1 bg-white/10 rounded-xl border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setSelectedService('standard')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      selectedService === 'standard'
                        ? 'bg-champagne-gold text-black font-black'
                        : 'text-[#A89F91] hover:text-white'
                    }`}
                  >
                    Web / Apps (15%)
                  </button>
                  <button
                    onClick={() => setSelectedService('ai')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      selectedService === 'ai'
                        ? 'bg-champagne-gold text-black font-black'
                        : 'text-[#A89F91] hover:text-white'
                    }`}
                  >
                    AI Solutions (20%)
                  </button>
                </div>

                {/* Slider and Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#A89F91]">Project Estimate</span>
                    <span className="text-soft-ivory font-bold font-display text-base">
                      ₹{projectValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={2500000}
                    step={25000}
                    value={projectValue}
                    onChange={(e) => setProjectValue(Number(e.target.value))}
                    className="w-full accent-[#D6B46A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#7A7167]">
                    <span>₹50,000</span>
                    <span>₹25,00,000+</span>
                  </div>
                </div>

                {/* Calculated Result Display */}
                <div className="p-5 bg-white/5 border border-champagne-gold/20 rounded-xl">
                  <span className="text-[11px] font-mono text-champagne-gold uppercase tracking-wider block mb-1 font-bold">
                    ESTIMATED PARTNER PAYOUT
                  </span>
                  <div className="text-4xl font-display font-black text-soft-ivory">
                    ₹{estimatedCommission.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-[#A89F91] mt-1 font-mono">
                    Direct wire payment within 15 days of client milestone completion.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full mt-6 py-4 bg-champagne-gold hover:bg-muted-gold text-matte-black text-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Become a Partner
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* --- WHY PARTNER WITH SAMAXON --- */}
        <section className="mb-24 text-left border-t border-champagne-gold/20 pt-16">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-2">
              WHY PARTNER WITH SAMAXON
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-matte-black tracking-tight">
              Refer with complete confidence.
            </h2>
            <p className="text-[#595046] text-base mt-2 max-w-2xl font-normal">
              Your reputation is on the line with every referral. We treat your clients like our own, ensuring flawless communication, 48-hour prototype delivery, and strict NDA compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartner.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-champagne-gold/25 rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#A68936]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-matte-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#595046] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="mb-24 text-left border-t border-champagne-gold/20 pt-16 max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-2">
              FAQ
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-matte-black tracking-tight">
              The honest answers.
            </h2>
            <p className="text-[#595046] text-base mt-2 max-w-xl mx-auto font-normal">
              Still have a question about the partner program? Reach out and we will walk you through it directly.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-champagne-gold/25 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-soft-ivory/40 transition-colors"
                >
                  <span className="font-display font-bold text-base text-matte-black flex items-center gap-3">
                    <span className="text-xs font-mono text-champagne-gold">0{idx + 1}</span>
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full border border-champagne-gold/30 transition-transform ${openFaq === idx ? 'rotate-180 bg-champagne-gold text-black' : 'text-matte-black'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#595046] leading-relaxed border-t border-champagne-gold/15">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- BOTTOM CTA BANNER --- */}
        <div className="bg-matte-black text-soft-ivory rounded-3xl border border-champagne-gold/30 p-10 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold font-bold">
              GET STARTED TODAY
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black max-w-2xl mx-auto">
              Start earning with the SamaXon Partner Program.
            </h2>
            <p className="text-sm sm:text-base text-[#A89F91] max-w-xl mx-auto">
              Help businesses build great digital products and earn commissions for every successful referral. No fees to join, no targets to hit — just a partnership that pays.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-8 py-4 bg-champagne-gold hover:bg-muted-gold text-matte-black text-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Become a Partner
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={getWhatsAppInquiryUrl('Partner Program Query')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-soft-ivory text-sm font-bold tracking-wider rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                Schedule a Call →
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* --- APPLICATION MODAL --- */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-matte-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-champagne-gold/35 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setIsSubmitted(false);
                }}
                className="absolute top-6 right-6 p-2 text-[#7A7167] hover:text-matte-black cursor-pointer rounded-lg hover:bg-soft-ivory"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="mb-6">
                    <span className="text-[11px] font-mono text-champagne-gold uppercase tracking-widest font-bold">
                      2-MINUTE APPLICATION
                    </span>
                    <h3 className="text-2xl font-display font-black text-matte-black mt-1">
                      Join SamaXon Partner Network
                    </h3>
                    <p className="text-xs text-[#6E6459] mt-1">
                      Fill out your details to receive your official partner code and referral dashboard access.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4A433B] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.name}
                        onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        placeholder="Aman Sharma"
                        className="w-full px-4 py-3 bg-soft-ivory border border-champagne-gold/30 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4A433B] mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={partnerForm.email}
                          onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full px-4 py-3 bg-soft-ivory border border-champagne-gold/30 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4A433B] mb-1.5">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={partnerForm.whatsapp}
                          onChange={(e) => setPartnerForm({ ...partnerForm, whatsapp: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 bg-soft-ivory border border-champagne-gold/30 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4A433B] mb-1.5">
                        Your Background / Category
                      </label>
                      <select
                        value={partnerForm.category}
                        onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-soft-ivory border border-champagne-gold/30 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold cursor-pointer"
                      >
                        <option value="Freelancer">Freelancer / Independent Developer</option>
                        <option value="Agency">Digital Marketing / Creative Agency</option>
                        <option value="Consultant">Business Consultant / Advisor</option>
                        <option value="Hosting">Hosting / Domain Provider</option>
                        <option value="Creator">Content Creator / Blogger</option>
                        <option value="Other">Other Enterprise Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4A433B] mb-1.5">
                        Website / LinkedIn / Portfolio (Optional)
                      </label>
                      <input
                        type="url"
                        value={partnerForm.portfolioOrWebsite}
                        onChange={(e) => setPartnerForm({ ...partnerForm, portfolioOrWebsite: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3 bg-soft-ivory border border-champagne-gold/30 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4A433B] mb-1.5">
                        Tell us about your referral network (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={partnerForm.message}
                        onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                        placeholder="I run an SEO agency in Delhi with 15 active e-commerce clients who frequently request custom Next.js builds..."
                        className="w-full px-4 py-3 bg-soft-ivory border border-champagne-gold/30 rounded-xl text-sm text-matte-black focus:outline-none focus:border-champagne-gold resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-matte-black hover:bg-black text-soft-ivory font-bold uppercase tracking-wider text-sm rounded-xl border border-champagne-gold/40 shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      Submit Partner Application
                      <ArrowRight className="w-4 h-4 text-champagne-gold" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-champagne-gold/20 border border-champagne-gold/40 rounded-full flex items-center justify-center mx-auto text-champagne-gold">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-matte-black">
                    Application Received!
                  </h3>
                  <p className="text-sm text-[#595046] max-w-md mx-auto">
                    Thank you, <span className="font-bold text-matte-black">{partnerForm.name}</span>. Our partnership director will reach out to you via WhatsApp at <span className="font-bold text-matte-black">{partnerForm.whatsapp}</span> within 2 hours with your partner onboarding agreement and commission channel.
                  </p>
                  <button
                    onClick={() => {
                      setShowApplyModal(false);
                      setIsSubmitted(false);
                    }}
                    className="mt-4 px-6 py-2.5 bg-matte-black text-soft-ivory text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
