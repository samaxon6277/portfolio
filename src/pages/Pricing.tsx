import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BadgePercent, Check, Clock,
  Smartphone, Bot, Layers, LayoutGrid
} from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_PRICING } from '../utils/defaultData';
import { PricingPlan } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Pricing() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING);
  const [activeTab, setActiveTab] = useState<'website' | 'app' | 'bot' | 'automation'>('website');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_pricing_plans');
      if (stored) {
        const parsed: PricingPlan[] = JSON.parse(stored);
        const hasIndividualCategories = parsed.some(plan => ['app', 'bot', 'automation'].includes(plan.category || ''));
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
      // Safe fallback
    }
  }, []);

  const sortedPlans = [...plans].sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

  const filteredPlans = sortedPlans.filter(plan => {
    if (activeTab === 'website') {
      return plan.category === 'website' || !plan.category;
    }
    return plan.category === activeTab;
  });

  return (
    <div className="pt-24 md:pt-32 pb-24 min-h-screen transition-colors duration-300 font-sans" id="pricing-viewport">
      <SEO 
        title="Bespoke Packages & Pricing Systems | SamaXon"
        description="Transparent packages for premium website creations, mobile apps, custom bots, and advanced background sync engines. Choose a plan or select your custom direction."
        canonicalPath="/pricing"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
                : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
            }`}
          >
            <BadgePercent className="w-3.5 h-3.5" />
            <span>Clear Terms</span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-5xl font-display font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            INVESTMENT SCHEMAS
          </h1>
          <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
            Flexible investment tiers engineered to match your scale. Zero monthly licensing fees, absolute source code files ownership, and high visual authority from day one.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center p-1.5 rounded-full border border-white/85 bg-gradient-to-r from-white/75 via-white/50 to-white/70 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(255,255,255,0.4)] gap-1">
            
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative overflow-hidden ${
                activeTab === 'website'
                  ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] shadow-[0_4px_16px_rgba(214,180,106,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.95)] border border-white/50'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/40'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Websites</span>
            </button>

            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative overflow-hidden ${
                activeTab === 'app'
                  ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] shadow-[0_4px_16px_rgba(214,180,106,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.95)] border border-white/50'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/40'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Apps</span>
            </button>

            <button
              onClick={() => setActiveTab('bot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative overflow-hidden ${
                activeTab === 'bot'
                  ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] shadow-[0_4px_16px_rgba(214,180,106,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.95)] border border-white/50'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/40'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Bots</span>
            </button>

            <button
              onClick={() => setActiveTab('automation')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative overflow-hidden ${
                activeTab === 'automation'
                  ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] shadow-[0_4px_16px_rgba(214,180,106,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.95)] border border-white/50'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Automation</span>
            </button>

          </div>
        </div>

        {/* Pricing Matrix Layout */}
        <div className={`grid grid-cols-1 gap-6 pt-2 items-stretch ${
          filteredPlans.length === 1
            ? 'max-w-md mx-auto'
            : filteredPlans.length === 2
            ? 'md:grid-cols-2 max-w-3xl mx-auto'
            : filteredPlans.length === 3
            ? 'md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
            : 'md:grid-cols-2 lg:grid-cols-4 w-full'
        }`}>
          {filteredPlans.map((plan) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all overflow-hidden backdrop-blur-2xl backdrop-saturate-180 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-white/85 via-white/50 to-white/70 border border-[#D6B46A]/60 shadow-[0_24px_60px_-10px_rgba(214,180,106,0.2),0_6px_20px_rgba(214,180,106,0.08),inset_0_1.5px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(214,180,106,0.2)]'
                  : 'bg-gradient-to-br from-white/75 via-white/40 to-white/65 border border-white/85 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.02),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(255,255,255,0.4)] hover:border-[#D6B46A]/40'
              }`}
            >
              {/* Top Meniscus Convex Water Gloss Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-3xl bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-80" 
                aria-hidden="true" 
              />
              
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] text-[9px] font-mono font-bold uppercase tracking-widest whitespace-nowrap z-20 shadow-[0_4px_16px_rgba(214,180,106,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.9)] border border-white/60">
                  RECOMMENDED PLATFORM
                </div>
              )}

              <div className="space-y-4 relative z-10">
                {/* Header package name */}
                <div className="space-y-1 text-center">
                  <h3 className="font-display font-bold text-base uppercase text-[#1D1D1F]">
                    {plan.name}
                  </h3>
                  <span className="text-xs text-[#8E8E93] block min-h-6">
                    {plan.subtitle}
                  </span>
                </div>

                {/* Price block */}
                <div className="py-4 border-y border-black/5 text-center space-y-1 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-[#D6B46A]">
                    {plan.price}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-[#8E8E93] uppercase font-bold">
                    <Clock className="w-3 h-3 text-[#D6B46A]" />
                    <span>Deployment: {plan.deliveryTime}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2.5 pt-2">
                  {plan.features.map((feat, fi) => (
                    <div key={fi} className="flex gap-2 items-start text-xs text-[#6E6E73] leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Direct Booking CTA */}
              <div className="pt-6 relative z-10">
                <button 
                  onClick={() => {
                    navigate('/select-direction', { state: { packageNeeded: plan.name, packageId: plan.id } });
                    window.scrollTo(0, 0);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer text-center block relative overflow-hidden ${
                    plan.popular
                      ? 'bg-gradient-to-b from-[#F2D898] via-[#D6B46A] to-[#BD9D54] text-[#0A0A0A] shadow-[0_6px_20px_rgba(214,180,106,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.95)] border border-white/60 hover:shadow-[0_8px_24px_rgba(214,180,106,0.55)]'
                      : 'bg-white/60 hover:bg-white/80 border border-white/85 text-[#1D1D1F] shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,1)] hover:border-[#D6B46A]/60'
                  }`}
                >
                  {/* Top Meniscus Button Shine */}
                  <span 
                    className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-2xl bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-80" 
                    aria-hidden="true" 
                  />
                  <span className="relative z-10">Select This Direction</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 border-t border-black/5 dark:border-white/5 pt-12">
          <div className="text-center max-w-sm mx-auto mb-10 space-y-1">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#D6B46A]">PRICING CLARIFICATIONS</h4>
            <p className="text-xs text-[#8E8E93]">Standard operations frameworks designed for premium systems builds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-[#8E8E93] max-w-4xl mx-auto">
            <div className="space-y-1.5">
              <h5 className="font-display font-bold uppercase text-neutral-900 dark:text-neutral-100">Are there monthly licensing fees or subscription overheads?</h5>
              <p>
                Absolutely none. Unlike systems crafted on Shopify or Wix, we write custom compiled static files with zero database dependencies for the front-end, saving hundreds of monthly dollars. You own 100% of the files.
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-display font-bold uppercase text-neutral-900 dark:text-neutral-100">Does the 48-hour delivery timeline apply to customized setups?</h5>
              <p>
                Yes. Our Starter and Professional templates feature pre-compiled responsive modules. By preparing standard layout definitions beforehand, our squad can safely compile your final assets in under 48 hours.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
