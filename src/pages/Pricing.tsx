import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BadgePercent, HelpCircle, ShieldCheck, Check, ArrowRight, Clock,
  Smartphone, Bot, Layers, LayoutGrid
} from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_PRICING } from '../utils/defaultData';
import { PricingPlan } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING);
  const [activeTab, setActiveTab] = useState<'website' | 'app' | 'bot' | 'automation'>('website');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_pricing_plans');
      if (stored) {
        const parsed: PricingPlan[] = JSON.parse(stored);
        // Verify if our new individual packages exist in the parsed list.
        // If not, we want to write DEFAULT_PRICING to override/upgrade the local storage!
        const hasIndividualCategories = parsed.some(plan => ['app', 'bot', 'automation'].includes(plan.category || ''));
        // If parsed doesn't have individual categories or has fewer than the 16 default plans, upgrade localStorage
        if (hasIndividualCategories && parsed.length >= DEFAULT_PRICING.length) {
          setPlans(parsed);
        } else {
          localStorage.setItem('samaxon_pricing_plans', JSON.stringify(DEFAULT_PRICING));
          setPlans(DEFAULT_PRICING);
        }
      } else {
        localStorage.setItem('samaxon_pricing_plans', JSON.stringify(DEFAULT_PRICING));
      }
    } catch (e) {
      console.warn('Failed to parse custom pricing packages.');
    }
  }, []);

  const sortedPlans = [...plans].sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

  // Filter plans based on active tab category
  const filteredPlans = sortedPlans.filter(plan => {
    if (activeTab === 'website') {
      return plan.category === 'website' || !plan.category;
    }
    return plan.category === activeTab;
  });

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id="pricing-viewport">
      <SEO 
        title="Bespoke Packages & Pricing Systems | SamaXon"
        description="Transparent packages for premium website creations, mobile apps, custom bots, and advanced background sync engines. Choose a plan or select your custom direction."
        canonicalPath="/pricing"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-bold font-mono uppercase tracking-widest"
          >
            <BadgePercent className="w-3.5 h-3.5" />
            Clear Terms
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-neutral-900 uppercase">
            INVESTMENT SCHEMAS
          </h1>
          <p className="text-sm text-[#8A8178] leading-relaxed">
            Flexible investment tiers engineered to match your scale. Zero monthly licensing fees, absolute source code files ownership, and high visual authority from day one.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center p-1.5 bg-white border border-neutral-200/80 rounded-2xl shadow-sm gap-2">
            
            {/* Website Packages Tab */}
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'website'
                  ? 'bg-matte-black text-white shadow-sm'
                  : 'text-[#8A8178] hover:text-matte-black hover:bg-neutral-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Websites
            </button>

            {/* Apps Tab */}
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'app'
                  ? 'bg-matte-black text-white shadow-sm'
                  : 'text-[#8A8178] hover:text-matte-black hover:bg-neutral-50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Apps
            </button>

            {/* Bots Tab */}
            <button
              onClick={() => setActiveTab('bot')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'bot'
                  ? 'bg-matte-black text-white shadow-sm'
                  : 'text-[#8A8178] hover:text-matte-black hover:bg-neutral-50'
              }`}
            >
              <Bot className="w-4 h-4" />
              Bots
            </button>

            {/* Automation Tab */}
            <button
              onClick={() => setActiveTab('automation')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'automation'
                  ? 'bg-matte-black text-white shadow-sm'
                  : 'text-[#8A8178] hover:text-matte-black hover:bg-neutral-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Automation
            </button>

          </div>
        </div>

        {/* Pricing Matrix Layout */}
        <div className={`grid grid-cols-1 gap-6 items-stretch ${
          filteredPlans.length === 1
            ? 'max-w-md mx-auto'
            : filteredPlans.length === 2
            ? 'md:grid-cols-2 max-w-3xl mx-auto'
            : filteredPlans.length === 3
            ? 'md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
            : 'md:grid-cols-2 lg:grid-cols-4 w-full'
        }`}>
          {filteredPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between relative shadow-sm transition-all hover:shadow-md ${
                plan.popular 
                  ? 'border-champagne-gold ring-1 ring-champagne-gold/50 bg-[#FFFDF8]' 
                  : 'border-neutral-200/60'
              }`}
            >
              
              {/* Popular stamp */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-matte-black text-white text-[8px] font-mono font-bold uppercase tracking-widest border border-champagne-gold/45">
                  RECOMMENDED PLATFORM
                </div>
              )}

              <div className="space-y-4">
                {/* Header package name */}
                <div className="space-y-1 text-center">
                  <h3 className="font-display font-bold text-sm uppercase text-neutral-900">
                    {plan.name}
                  </h3>
                  <span className="text-[10px] text-[#8A8178] block min-h-8">
                    {plan.subtitle}
                  </span>
                </div>

                {/* Price block */}
                <div className="py-4 border-y border-[#D6B46A]/10 text-center space-y-1">
                  <div className="text-2xl font-display font-black text-neutral-950">
                    {plan.price}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-[#BFA15A] uppercase font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deployment: {plan.deliveryTime}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-3 pt-2">
                  {plan.features.map((feat, fi) => (
                    <div key={fi} className="flex gap-2.5 items-start text-[11px] text-[#8A8178] leading-tight">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Direct Booking CTA */}
              <div className="pt-6">
                <button 
                  onClick={() => {
                    navigate('/select-direction', { state: { packageNeeded: plan.name, packageId: plan.id } });
                    window.scrollTo(0, 0);
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-colors cursor-pointer text-center block ${
                    plan.popular
                      ? 'bg-matte-black text-white hover:bg-[#1C1C1C]'
                      : 'bg-[#FFFDF8] border border-matte-black/15 text-matte-black hover:bg-neutral-50'
                  }`}
                >
                  Select This Direction
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic bottom FAQ row */}
        <div className="mt-20 border-t border-matte-black/5 pt-12">
          <div className="text-center max-w-sm mx-auto mb-12 space-y-1">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">PRICING CLARIFICATIONS</h4>
            <p className="text-[11px] text-[#8A8178]">Standard operations frameworks designed for premium systems builds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-[#8A8178] max-w-4xl mx-auto">
            <div className="space-y-2">
              <h5 className="font-display font-bold text-neutral-900 uppercase">Are there monthly licensing fees or subscription overheads?</h5>
              <p>
                Absolutely none. Unlike systems crafted on Shopify or Wix, we write custom compiled static files with zero database dependencies for the front-end, saving hundreds of monthly dollars. You own 100% of the files.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-display font-bold text-[#111111] uppercase">Does the 48-hour delivery timeline apply to customized setups?</h5>
              <p>
                Yes. Our Starter and Professional templates feature pre-compiled responsive modules. By preparing standard layout definitions before-hand, our squad can safely compile your final assets in under 48 hours.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
