import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, ShieldCheck, Layers, ArrowRight, CheckCircle2, 
  HelpCircle, ChevronDown, DollarSign, AlertTriangle, Check, 
  Clock, Zap, Compass, Code, Smartphone, ExternalLink, Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';
import { getWhatsAppInquiryUrl } from '../config/siteConfig';

export default function Guides() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'cost';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['cost', 'contract', 'tech'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24 text-matte-black text-left" id="guides-knowledge-hub">
      <SEO 
        title="Knowledge Guides & Buyer's Intelligence | SamaXon"
        description="Comprehensive, transparent guides on website design & development costs in India, essential contract checklists, and technology stack comparisons (Next.js, Flutter, React Native)."
        canonicalPath="/guides"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HUB HEADER --- */}
        <div className="border-b border-champagne-gold/20 pb-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-gold/15 border border-champagne-gold/30 text-[#A68936] text-xs font-mono uppercase font-bold tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            BUYER'S INTELLIGENCE & GUIDES
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-matte-black tracking-tight leading-tight max-w-4xl">
            Clarity before you invest.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-matte-black">
              Zero fine print.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#4A433B] leading-relaxed max-w-3xl mt-4 font-normal">
            Whether you are calculating authentic development costs in India, auditing a vendor's contract clauses, or choosing between Next.js and Webflow — these deep-dive resources give you unfiltered real-world market intelligence.
          </p>

          {/* Guide Selector Tabs */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {[
              { id: 'cost', label: 'Website Cost Guide (2026)', icon: DollarSign, badge: 'Complete Guide' },
              { id: 'contract', label: 'Contract Checklist (12 Clauses)', icon: ShieldCheck, badge: 'Buyer Protection' },
              { id: 'tech', label: 'Stack: Webflow vs Next.js / Flutter', icon: Layers, badge: 'Architecture' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-3 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-matte-black text-soft-ivory border-champagne-gold/50 shadow-md'
                      : 'bg-white/80 text-[#595046] border-champagne-gold/25 hover:border-champagne-gold/45 hover:text-matte-black'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-champagne-gold' : 'text-[#8A8178]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: WEBSITE COST GUIDE 2026 */}
        {/* ========================================================================= */}
        {activeTab === 'cost' && (
          <div className="space-y-16 animate-fade-in" id="website-cost-guide-section">
            
            {/* Guide Title Header */}
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#8A8178] mb-3">
                <span className="px-2.5 py-1 bg-champagne-gold/20 text-[#8B6E23] font-bold rounded-md">
                  WEBSITE COST GUIDE
                </span>
                <span>·</span>
                <span>15 min read</span>
                <span>·</span>
                <span>Updated for 2026 Markets</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-matte-black leading-tight max-w-4xl">
                How Much Does a Website Design & Development Cost in India? (2026 Complete Guide)
              </h2>
              <p className="text-base sm:text-lg text-[#52493E] mt-4 max-w-3xl leading-relaxed">
                Ask five agencies for a quote and you get five completely different numbers. One says ₹10,000. Another says ₹2,00,000. Both could be right — they are just building two completely different things. This guide breaks down every cost factor clearly, giving you real INR numbers so you know exactly what you are paying for before you speak to anyone.
              </p>
            </div>

            {/* 4 Metric Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { top: '₹15K', title: 'Basic Website Starting', sub: 'Single-page landing framework' },
                { top: '₹5L+', title: 'E-commerce Max Range', sub: 'Custom multi-vendor & inventory' },
                { top: '20+', title: 'Cost Factors Covered', sub: 'Design, hosting, CMS, maintenance' },
                { top: '2026', title: 'Real Market Rates', sub: 'Delhi-NCR & pan-India benchmark' }
              ].map((b, idx) => (
                <div key={idx} className="bg-white border border-champagne-gold/25 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl sm:text-4xl font-display font-black text-matte-black mb-1">
                    {b.top}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#2E2822]">
                    {b.title}
                  </div>
                  <div className="text-[11px] text-[#7D7367] font-mono mt-1">
                    {b.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Section: Who Builds Your Website & What Do They Charge? */}
            <div className="bg-white border border-champagne-gold/25 rounded-3xl p-7 sm:p-10 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-1">
                  MARKET SPECTRUM
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-matte-black">
                  Who Builds Your Website — and What Do They Actually Charge?
                </h3>
                <p className="text-sm sm:text-base text-[#52493E] mt-2 max-w-3xl">
                  The single biggest factor that changes your website price is who you hire. A ₹15,000 quote and a ₹1,50,000 quote for the exact same website requirement are both real — they just come from very different execution structures.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-champagne-gold/25 text-xs font-mono uppercase tracking-wider text-[#7D7367]">
                      <th className="pb-4 font-bold">Who You Hire</th>
                      <th className="pb-4 font-bold">Typical Cost Range (INR)</th>
                      <th className="pb-4 font-bold">Best Suited For</th>
                      <th className="pb-4 font-bold">Hidden Risk Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-gold/15 text-sm">
                    <tr>
                      <td className="py-4 font-bold text-matte-black">DIY Builder (Wix / Squarespace)</td>
                      <td className="py-4 font-mono font-bold text-[#A68936]">₹4,000 – ₹15,000 / year</td>
                      <td className="py-4 text-[#52493E]">Zero budget startups, temporary holding pages</td>
                      <td className="py-4 text-[#7D7367]">Zero code ownership, poor custom SEO flexibility</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-matte-black">Freelancer (Junior to Mid)</td>
                      <td className="py-4 font-mono font-bold text-[#A68936]">₹8,000 – ₹60,000</td>
                      <td className="py-4 text-[#52493E]">Simple brochure sites with defined static scope</td>
                      <td className="py-4 text-[#7D7367]">Unreliable timelines, lack of post-launch SLA</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-matte-black">Small Boutique Agency (SamaXon)</td>
                      <td className="py-4 font-mono font-bold text-[#A68936]">₹30,000 – ₹2,00,000</td>
                      <td className="py-4 text-[#52493E]">High-growth businesses, high conversion, 48h speed</td>
                      <td className="py-4 text-[#2E8B57] font-bold">100% Hand-coded, guaranteed ownership & SLAs</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-matte-black">Mid-Size Traditional Agency</td>
                      <td className="py-4 font-mono font-bold text-[#A68936]">₹1,00,000 – ₹8,00,000</td>
                      <td className="py-4 text-[#52493E]">Complex enterprise portals, multi-tier e-commerce</td>
                      <td className="py-4 text-[#7D7367]">Slow bureaucratic cycles, inflated account management fees</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-matte-black">Large Enterprise IT House</td>
                      <td className="py-4 font-mono font-bold text-[#A68936]">₹5,00,000 – ₹50,00,000+</td>
                      <td className="py-4 text-[#52493E]">Government tenders, multi-national conglomerates</td>
                      <td className="py-4 text-[#7D7367]">Excessive overheads, lengthy 6-9 month release cycles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: Website Cost by Type */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A68936] font-bold block mb-1">
                  PROJECT SCOPE CATEGORIES
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-matte-black">
                  Website Cost by Type — What Kind Do You Actually Need?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Landing Page (Single Page)',
                    cost: '₹8,000 – ₹40,000',
                    timeline: '1 – 2 weeks (48h Express at SamaXon)',
                    desc: 'Laser-focused single page built around one outcome — ad campaign traffic, product launch, or lead gen. Designed to perform at 95+ Lighthouse speed.'
                  },
                  {
                    title: 'Standard Business Website',
                    cost: '₹20,000 – ₹1,50,000',
                    timeline: '3 – 6 weeks',
                    desc: 'The corporate backbone for small to medium enterprises. Home, About, Services, Case Studies, and Contact. Builds immediate credibility.'
                  },
                  {
                    title: 'E-Commerce Storefront',
                    cost: '₹75,000 – ₹5,00,000',
                    timeline: '6 – 12 weeks',
                    desc: 'Conversion-engineered storefront on Shopify or custom Next.js checkout. Inventory sync, Razorpay/Stripe, GST invoices, and order tracking.'
                  },
                  {
                    title: 'Portfolio & Creative Showcase',
                    cost: '₹12,000 – ₹60,000',
                    timeline: '2 – 4 weeks',
                    desc: 'Showcase work as carefully crafted as the work itself. High typography fidelity, curated media galleries, and smooth interactive pacing.'
                  },
                  {
                    title: 'Corporate Enterprise Portal',
                    cost: '₹2,00,000 – ₹15,00,000+',
                    timeline: '10 – 20 weeks',
                    desc: 'Multi-location corporate systems, investor relations, departmental sub-domains, and ISO/WCAG compliance standards.'
                  },
                  {
                    title: 'Web Application / Custom SaaS',
                    cost: '₹3,00,000 – ₹25,00,000+',
                    timeline: '3 – 9 months',
                    desc: 'Not a static website in the traditional sense — user authentication, real-time client dashboards, Supabase/PostgreSQL backends, and Stripe billing.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-champagne-gold/25 rounded-2xl p-7 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="text-xs font-mono uppercase text-[#A68936] font-bold mb-1">
                        TYPE 0{idx + 1}
                      </div>
                      <h4 className="font-display font-bold text-xl text-matte-black mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#595046] leading-relaxed mb-4">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-champagne-gold/15">
                      <div className="text-2xl font-display font-black text-matte-black">
                        {item.cost}
                      </div>
                      <div className="text-[11px] font-mono text-[#7D7367] mt-0.5">
                        Timeline: {item.timeline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Costs Warning */}
            <div className="bg-[#141414] text-soft-ivory rounded-3xl border border-champagne-gold/30 p-8 sm:p-10 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-champagne-gold shrink-0" />
                <h3 className="font-display text-xl sm:text-2xl font-black">
                  Hidden Website Costs Nobody Warns You About
                </h3>
              </div>
              <p className="text-sm text-[#A89F91] leading-relaxed max-w-3xl">
                This is the section most agencies skip. Your quoted project price is rarely the full picture. Here are the auxiliary costs that catch business owners completely off guard after signing contracts:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-white/10 text-xs">
                <div>
                  <div className="font-bold text-soft-ivory text-sm mb-1">Stock Photos & Licenses</div>
                  <p className="text-[#A89F91] leading-relaxed">Quality Shutterstock or Getty images cost ₹500 to ₹3,000 per asset. A rich site can easily add ₹10,000+ if not planned upfront.</p>
                </div>
                <div>
                  <div className="font-bold text-soft-ivory text-sm mb-1">Premium Plugins & Tools</div>
                  <p className="text-[#A89F91] leading-relaxed">WordPress plugins (Elementor Pro, WP Rocket, Form builders) charge $50–$250 yearly subscriptions per domain.</p>
                </div>
                <div>
                  <div className="font-bold text-soft-ivory text-sm mb-1">Copywriting & SEO Content</div>
                  <p className="text-[#A89F91] leading-relaxed">Agencies provide placeholder "Lorem Ipsum". Professional conversion copywriters charge ₹1,500–₹4,000 per page.</p>
                </div>
                <div>
                  <div className="font-bold text-soft-ivory text-sm mb-1">Ongoing Domain Renewal</div>
                  <p className="text-[#A89F91] leading-relaxed">A standard .com or .in domain costs ₹900 to ₹1,800 per year. Beware of registrars charging low 1st-year promo rates.</p>
                </div>
                <div>
                  <div className="font-bold text-soft-ivory text-sm mb-1">Managed Cloud Hosting</div>
                  <p className="text-[#A89F91] leading-relaxed">Cheap ₹99/mo shared hosting crashes on 50 simultaneous visitors. Quality cloud hosting runs ₹3,000 to ₹25,000/year.</p>
                </div>
                <div>
                  <div className="font-bold text-soft-ivory text-sm mb-1">Annual Maintenance & SLAs</div>
                  <p className="text-[#A89F91] leading-relaxed">Security patches, database backups, and framework updates typically cost 15–20% of the original build value annually.</p>
                </div>
              </div>
            </div>

            {/* India vs USA vs UK Table */}
            <div className="bg-white border border-champagne-gold/25 rounded-3xl p-7 sm:p-10 shadow-sm space-y-6">
              <h3 className="font-display text-2xl font-black text-matte-black">
                India vs USA vs UK — Why Costs Are So Different
              </h3>
              <p className="text-sm text-[#52493E] max-w-3xl leading-relaxed">
                A website that costs ₹80,000 in India would cost $8,000 to $15,000 in the USA for the exact same scope. That is a 10x difference. The difference comes down to lower operational overheads, not lower skill. Indian developers power the engineering backbones of major Silicon Valley tech companies.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-champagne-gold/25 text-xs font-mono uppercase text-[#7D7367]">
                      <th className="pb-3 font-bold">Website Type</th>
                      <th className="pb-3 font-bold">India (INR)</th>
                      <th className="pb-3 font-bold">USA (USD)</th>
                      <th className="pb-3 font-bold">UK (GBP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-gold/15">
                    <tr>
                      <td className="py-3.5 font-bold">Basic Business Site</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">₹20,000 – ₹80,000</td>
                      <td className="py-3.5 font-mono text-[#52493E]">$3,000 – $10,000</td>
                      <td className="py-3.5 font-mono text-[#52493E]">£2,500 – £8,000</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Professional E-Commerce</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">₹80,000 – ₹3,00,000</td>
                      <td className="py-3.5 font-mono text-[#52493E]">$8,000 – $25,000</td>
                      <td className="py-3.5 font-mono text-[#52493E]">£6,000 – £20,000</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Custom Web Application / SaaS</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">₹3,00,000 – ₹20,00,000</td>
                      <td className="py-3.5 font-mono text-[#52493E]">$30,000 – $150,000+</td>
                      <td className="py-3.5 font-mono text-[#52493E]">£25,000 – £120,000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONTRACT CHECKLIST (12 CLAUSES) */}
        {/* ========================================================================= */}
        {activeTab === 'contract' && (
          <div className="space-y-16 animate-fade-in" id="contract-checklist-section">
            
            {/* Guide Title Header */}
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#8A8178] mb-3">
                <span className="px-2.5 py-1 bg-champagne-gold/20 text-[#8B6E23] font-bold rounded-md">
                  BUYER'S PROTECTION GUIDE
                </span>
                <span>·</span>
                <span>10 min read</span>
                <span>·</span>
                <span>Enforceable Contract Checklist</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-matte-black leading-tight max-w-4xl">
                What Belongs in a Website Development Contract (Buyer's Checklist)
              </h2>
              <p className="text-base sm:text-lg text-[#52493E] mt-4 max-w-3xl leading-relaxed">
                We have inherited dozens of projects from other agencies. Almost every single dispute stemmed from a few missing clauses — or at the total absence of them. Here are the twelve clauses worth getting right before you sign any contract or wire a single rupee.
              </p>
            </div>

            {/* Short Answer Box */}
            <div className="bg-[#141414] text-soft-ivory rounded-3xl border border-champagne-gold/30 p-8 sm:p-10 shadow-xl space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold font-bold">
                SHORT ANSWER SUMMARY
              </span>
              <p className="text-sm sm:text-base text-[#D4CDC3] leading-relaxed">
                Twelve essential matters: <span className="text-champagne-gold font-bold">IP assignment</span>, domain and hosting ownership, a specific deliverables list, milestone-based payments, pre-agreed change rates, counted revision rounds, timeline with delay handling, a bug-fix warranty window, maintenance pricing, third-party licensing, a written handover runbook, and exit rights.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-center">
                <div>
                  <div className="text-3xl font-display font-black text-champagne-gold">12</div>
                  <div className="text-xs text-[#A89F91]">Clauses to verify</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-black text-champagne-gold">10%</div>
                  <div className="text-xs text-[#A89F91]">Retain until handover</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-black text-champagne-gold">30-90d</div>
                  <div className="text-xs text-[#A89F91]">Bug-fix window</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-black text-champagne-gold">100%</div>
                  <div className="text-xs text-[#A89F91]">Client IP ownership</div>
                </div>
              </div>
            </div>

            {/* 12 Clauses List */}
            <div className="space-y-4">
              {[
                {
                  num: '01',
                  title: 'Who owns the code, and from when?',
                  desc: 'Under Indian copyright law, the author of software owns the copyright unless assigned in writing. Your contract must explicitly state: "All code, design files, animations, and custom assets belong 100% to the client upon final invoice clearance."'
                },
                {
                  num: '02',
                  title: 'Who owns the domain and hosting accounts?',
                  desc: 'Separate from code, the most common trap is developers registering domains or hosting accounts in their own name "for convenience". The domain must be registered in your company name with your email as technical registrant.'
                },
                {
                  num: '03',
                  title: 'A deliverables list specific enough to argue with',
                  desc: '"A 10-page responsive website" is not a deliverable list. Name the exact pages, form endpoints, CRM integrations, CMS controls, and browser compatibility thresholds. Anything unnamed becomes a paid change request.'
                },
                {
                  num: '04',
                  title: 'Payment tied to milestones, not calendar dates',
                  desc: 'Never pay on calendar milestones (e.g. "50% on day 15"). Pay strictly on verifiable delivery: 30% advance on signing, 30% on design approval, 30% on staging delivery URL, and 10% on live handover.'
                },
                {
                  num: '05',
                  title: 'What a scope change costs, agreed upfront',
                  desc: 'Scope will evolve as you see live builds. Define the hourly change rate upfront (e.g. ₹1,500/hr) and require written quotes before any work outside the contract begins.'
                },
                {
                  num: '06',
                  title: 'Revision rounds, counted and defined',
                  desc: '"Unlimited revisions" is a red flag — it means the agency quotes defensively or plans to disappear. Two or three named revision rounds per stage with clear turnaround times is far healthier.'
                },
                {
                  num: '07',
                  title: 'Timeline with client-delay handling',
                  desc: 'Projects stall when clients take weeks to provide content or approvals. The contract should clarify what pauses the clock and what happens when materials are provided.'
                },
                {
                  num: '08',
                  title: 'A defined bug-fix window after launch (30–90 Days)',
                  desc: 'Without a clear 30–90 day post-launch bug warranty, every defect discovered after go-live turns into an expensive argument over whether it is a bug or a new feature.'
                },
                {
                  num: '09',
                  title: 'What maintenance costs, if you choose to keep it',
                  desc: 'Price it in the contract even if you are not sure you want it. Fixing renewal costs upfront prevents aggressive price hikes once your site is live and dependent on the vendor.'
                },
                {
                  num: '10',
                  title: 'Third-party accounts and font licensing',
                  desc: 'Who pays for premium fonts, stock photography, plugin licenses, and SMS gateway credits? Ensure all accounts are created under client ownership.'
                },
                {
                  num: '11',
                  title: 'A written handover checklist and runbook',
                  desc: 'GitHub repository access, database credentials, server API keys, font packages, and an administrator tutorial video must be provided before final milestone release.'
                },
                {
                  num: '12',
                  title: 'Termination and exit rights',
                  desc: 'How either side ends the engagement gracefully. How much is owed for work completed, and what assets the client receives on exit.'
                }
              ].map((clause) => (
                <div 
                  key={clause.num}
                  className="bg-white border border-champagne-gold/25 rounded-2xl p-6 sm:p-7 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-champagne-gold/15 text-[#A68936] font-display font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {clause.num}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-matte-black mb-1.5">
                      {clause.title}
                    </h4>
                    <p className="text-sm text-[#595046] leading-relaxed font-normal">
                      {clause.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Milestone Schedule Table */}
            <div className="bg-white border border-champagne-gold/25 rounded-3xl p-7 sm:p-10 shadow-sm space-y-6">
              <h3 className="font-display text-2xl font-black text-matte-black">
                A Milestone Schedule That Protects Both Sides
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-champagne-gold/25 text-xs font-mono uppercase text-[#7D7367]">
                      <th className="pb-3 font-bold">Milestone</th>
                      <th className="pb-3 font-bold">Share</th>
                      <th className="pb-3 font-bold">Triggered By</th>
                      <th className="pb-3 font-bold">Why It Protects You</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-gold/15">
                    <tr>
                      <td className="py-3.5 font-bold">Advance</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">30%</td>
                      <td className="py-3.5 text-[#52493E]">On contract signing</td>
                      <td className="py-3.5 text-[#7D7367]">Covers engineer sprint allocation & initial UX architecture</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Design Approval</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">30%</td>
                      <td className="py-3.5 text-[#52493E]">You approve full Figma visual layouts</td>
                      <td className="py-3.5 text-[#7D7367]">Ensures you do not pay for code until you love the visual look</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Staging Delivery</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">30%</td>
                      <td className="py-3.5 text-[#52493E]">Functional site live on testing URL</td>
                      <td className="py-3.5 text-[#7D7367]">Allows complete click-through QA before production release</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Go-Live + Handover</td>
                      <td className="py-3.5 font-mono font-bold text-[#A68936]">10%</td>
                      <td className="py-3.5 text-[#52493E]">Live on primary domain with credentials</td>
                      <td className="py-3.5 text-[#2E8B57] font-bold">Guarantees prompt delivery of all repository and admin keys</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Red Flags Callout */}
            <div className="bg-white border-2 border-red-500/20 rounded-3xl p-8 space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
                RED FLAGS
              </div>
              <h3 className="text-xl font-display font-black text-matte-black">
                Six Terms Worth Walking Away From
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#52493E] pt-2">
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40">
                  <span className="font-bold text-red-700 block mb-0.5">01. No written contract at all</span>
                  A WhatsApp chat or vague quote is not an enforceable development agreement.
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40">
                  <span className="font-bold text-red-700 block mb-0.5">02. Developer retains code IP</span>
                  The agency claims they "license" your custom website back to you. Never accept this.
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40">
                  <span className="font-bold text-red-700 block mb-0.5">03. 100% Advance Payment</span>
                  Demanding 100% upfront before any single line of code is produced.
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40">
                  <span className="font-bold text-red-700 block mb-0.5">04. Domain in developer's account</span>
                  The domain registered under the developer's personal email for convenience.
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40">
                  <span className="font-bold text-red-700 block mb-0.5">05. Zero handover documentation</span>
                  No repository access, no environment keys, and total lock-in to their hosting.
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40">
                  <span className="font-bold text-red-700 block mb-0.5">06. Vague subjective scope</span>
                  Deliverables described only as "modern", "premium", or "world-class" with no technical specs.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TECH DECISION GUIDES (WEBFLOW VS NEXT.JS / FLUTTER) */}
        {/* ========================================================================= */}
        {activeTab === 'tech' && (
          <div className="space-y-16 animate-fade-in" id="technology-comparison-section">
            
            {/* Guide Title Header */}
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#8A8178] mb-3">
                <span className="px-2.5 py-1 bg-champagne-gold/20 text-[#8B6E23] font-bold rounded-md">
                  ARCHITECTURE & PLATFORM DECISIONS
                </span>
                <span>·</span>
                <span>8 min read</span>
                <span>·</span>
                <span>Engineering Recommendations</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-matte-black leading-tight max-w-4xl">
                Webflow vs Next.js & React Native vs Flutter: What Actually Matters
              </h2>
              <p className="text-base sm:text-lg text-[#52493E] mt-4 max-w-3xl leading-relaxed">
                Founders spend weeks debating platform choices based on hypothetical scale. We cut through the hype to give you the honest practical tradeoffs between no-code speed and custom code power.
              </p>
            </div>

            {/* Webflow vs Next.js Breakdown */}
            <div className="bg-white border border-champagne-gold/25 rounded-3xl p-7 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-champagne-gold" />
                <h3 className="font-display text-2xl font-black text-matte-black">
                  Webflow vs Next.js — What Your Business Actually Needs
                </h3>
              </div>
              
              <div className="p-5 bg-champagne-gold/10 border border-champagne-gold/30 rounded-2xl">
                <span className="font-bold text-sm text-matte-black block mb-1">
                  The Short Rule of Thumb:
                </span>
                <p className="text-xs sm:text-sm text-[#4E4438] leading-relaxed">
                  Use <span className="font-bold text-matte-black">Webflow</span> for a marketing or brochure site under ~50 pages that your non-technical marketing team edits without developer assistance. Use <span className="font-bold text-matte-black">Next.js / React</span> when you need custom logic, user logins, interactive calculators, database middleware, or programmatic SEO generation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-soft-ivory/60 border border-champagne-gold/25 space-y-3">
                  <div className="font-display font-bold text-lg text-matte-black flex items-center justify-between">
                    <span>Webflow</span>
                    <span className="text-xs font-mono font-bold text-[#A68936]">No-Code / Visual</span>
                  </div>
                  <ul className="text-xs text-[#52493E] space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      Visual editor empowers marketing teams to publish without developers.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      Rapid launch cycles for standard marketing sites.
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      CMS item limits (typically 2,000–10,000 items on standard tiers).
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      Locked into Webflow’s proprietary hosting and pricing tiers.
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-matte-black text-soft-ivory border border-champagne-gold/35 space-y-3">
                  <div className="font-display font-bold text-lg text-soft-ivory flex items-center justify-between">
                    <span>Next.js & React</span>
                    <span className="text-xs font-mono font-bold text-champagne-gold">100% Hand-Coded</span>
                  </div>
                  <ul className="text-xs text-[#D4CDC3] space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-champagne-gold shrink-0" />
                      Infinite scalability: handles millions of dynamic database records.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-champagne-gold shrink-0" />
                      100% Code Ownership: deploy to Vercel, Cloud Run, AWS, or your own server.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-champagne-gold shrink-0" />
                      Zero licensing fees: open-source stack, no monthly platform rent.
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-champagne-gold shrink-0" />
                      Requires a senior developer or retainer for deep content updates.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* React Native vs Flutter Table */}
            <div className="bg-white border border-champagne-gold/25 rounded-3xl p-7 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-champagne-gold" />
                <h3 className="font-display text-2xl font-black text-matte-black">
                  React Native vs Flutter — Six Differences Worth Caring About
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-champagne-gold/25 text-xs font-mono uppercase text-[#7D7367]">
                      <th className="pb-3 font-bold">Criteria</th>
                      <th className="pb-3 font-bold">React Native</th>
                      <th className="pb-3 font-bold">Flutter</th>
                      <th className="pb-3 font-bold">What It Means For You</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-gold/15">
                    <tr>
                      <td className="py-3.5 font-bold">Language</td>
                      <td className="py-3.5 text-[#52493E]">JavaScript / TypeScript</td>
                      <td className="py-3.5 text-[#52493E]">Dart</td>
                      <td className="py-3.5 text-[#7D7367]">If your team knows React, React Native shares logic effortlessly.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Hiring Pool in India</td>
                      <td className="py-3.5 font-bold text-[#A68936]">Very large talent pool</td>
                      <td className="py-3.5 text-[#52493E]">Growing, but smaller</td>
                      <td className="py-3.5 text-[#7D7367]">Easier to replace developers or expand your team quickly in Delhi/Bangalore.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">UI Approach</td>
                      <td className="py-3.5 text-[#52493E]">Native Platform Components</td>
                      <td className="py-3.5 text-[#52493E]">Draws its own custom widgets</td>
                      <td className="py-3.5 text-[#7D7367]">React Native looks native by default; Flutter renders pixel-identical everywhere.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">Best For</td>
                      <td className="py-3.5 text-[#52493E]">B2B tools, e-commerce, CRM portals</td>
                      <td className="py-3.5 text-[#52493E]">Heavy animations, games, 2D canvases</td>
                      <td className="py-3.5 text-[#7D7367]">Both achieve 60fps when engineered by senior developers.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- BOTTOM PROPOSAL CTA --- */}
        <div className="mt-20 bg-matte-black text-soft-ivory rounded-3xl border border-champagne-gold/30 p-10 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold font-bold">
            WANT A SCOPED PROPOSAL YOU CAN ACTUALLY CHECK AGAINST THIS LIST?
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-black max-w-2xl mx-auto">
            Get an itemized proposal with guaranteed 48-hour prototype delivery.
          </h3>
          <p className="text-sm text-[#A89F91] max-w-xl mx-auto">
            Our scopes name every single page, every integration, and every handover deliverable before you pay anything.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-champagne-gold hover:bg-muted-gold text-matte-black text-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              Request a Scoped Proposal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getWhatsAppInquiryUrl('Guides Consultation')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-soft-ivory text-sm font-bold tracking-wider rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              WhatsApp Us Directly →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
