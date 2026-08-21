import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import CustomSelect from '../components/CustomSelect';
import { useTheme } from '../context/ThemeContext';

interface ClientControlProps {
  setCurrentPage?: (page: string) => void;
}

export default function ClientControl({ setCurrentPage }: ClientControlProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Interactive Simulator States
  const [promoBanner, setPromoBanner] = useState<string>("SamaXon Special Offer: 48-Hour Web Launch");
  const [webHeadline, setWebHeadline] = useState<string>("Premium Luxury Estate Builders India");
  const [activeServices, setActiveServices] = useState<number>(4);
  const [leadSimStatus, setLeadSimStatus] = useState<'idle' | 'submitted' | 'processing'>('idle');

  const handleInquire = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 transition-colors duration-300 font-sans" id="client-control-overview">
      <SEO 
        title="Digital Remote Control - Your Future Admin Hub"
        description="Every serious web build can include the Client Control Admin layer. Learn how to update banners, track incoming leads, and control services independently."
        canonicalPath="/control"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-black/5 dark:border-white/5 pb-10">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
              : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
            <span>Future-Ready Admin Architecture</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            Every Serious Business Needs <br />
            <span className="text-[#D6B46A]">A Digital Remote Control.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            A beautiful front page represents your online stature. But you shouldn't have to hire coder hours for simple day-to-day business adjustments. SamaXon isolates data layers to prepare for a customizable admin dashboard.
          </p>
        </div>

        {/* --- CORE BENEFITS SYSTEM --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" id="benefits-grid">
          {[
            {
              title: "Update Brand Banners",
              desc: "Toggle promo banners, slide visuals, event headers, and flash announcements at will without touching core system code."
            },
            {
              title: "Leads Consolidation Hub",
              desc: "Every inquiry from your customer touchpoints gets unified, categorized, and made accessible for direct team actions."
            },
            {
              title: "Manage Services & Pricing",
              desc: "Quickly edit service lists, package items, discount triggers, and localized pricing notes instantly from a luxury panel."
            },
            {
              title: "Bookings Configuration",
              desc: "Structure is fully prepared. Toggle slots, room schedules, salon appointments, and clinical hours when administrative modules activate."
            }
          ].map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-6 sm:p-7 rounded-3xl border text-left flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#121212] border-white/10 hover:border-[#D6B46A]/40' : 'bg-white border-black/10 hover:border-[#D6B46A]/50 shadow-sm'
              }`}
            >
              <div>
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-wider block mb-3 font-bold">
                  Administrative Wing {idx + 1}
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base mb-2 uppercase tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
              <div className="h-0.5 bg-[#D6B46A]/20 w-1/4 mt-5" />
            </motion.div>
          ))}
        </section>

        {/* --- INTERACTIVE SIMULATOR --- */}
        <section className={`border rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden mb-20 transition-all ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-lg'
        }`}>
          <div className="max-w-3xl mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Interactive Dashboard Sandbox
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2">
              Experience the Control Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mt-1">
              See how our Client Control layer handles information. Toggle settings in the left simulator and notice the live front-end staging layout update instantly on the right. No development lines required.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="control-simulator">
            
            {/* Control Column */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-5 ${
              isDark ? 'bg-[#0A0A0A] border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest block border-b border-black/5 dark:border-white/5 pb-2 font-bold flex items-center justify-between">
                <span>SIMULATED ADMIN PANEL</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>

              {/* Action 1: Banner Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold">1. Announcement Header:</label>
                <CustomSelect 
                  value={promoBanner}
                  onChange={(val) => setPromoBanner(val)}
                  options={[
                    { value: "SamaXon Special Offer: 48-Hour Web Launch", label: "48-Hour Premium Promo Header" },
                    { value: "Mega Independence Launch Deal: Get Free Bot", label: "Independence Special Bot Promo" },
                    { value: "Staging Notice: Maintenance at 02:00 UTC", label: "Maintenance System Broadcast Alert" }
                  ]}
                />
              </div>

              {/* Action 2: Text Modifier */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] font-bold">2. Landing Tagline:</label>
                <input 
                  type="text" 
                  value={webHeadline}
                  onChange={(e) => setWebHeadline(e.target.value)}
                  className={`border text-xs p-3 rounded-xl font-sans focus:outline-none focus:border-[#D6B46A] ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/10 text-black'
                  }`}
                />
              </div>

              {/* Action 3: Services count slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#8E8E93] font-bold">
                  <span>3. Active Services:</span>
                  <span className="text-[#D6B46A] font-bold">{activeServices} Live</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  value={activeServices} 
                  onChange={(e) => setActiveServices(Number(e.target.value))}
                  className="w-full accent-[#D6B46A] cursor-pointer"
                />
              </div>

              {/* Action 4: Lead generation demo */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={() => {
                    setLeadSimStatus('processing');
                    setTimeout(() => setLeadSimStatus('submitted'), 1000);
                  }}
                  disabled={leadSimStatus === 'processing'}
                  className="w-full py-2.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-[9px] rounded-xl flex items-center justify-center gap-2 duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {leadSimStatus === 'idle' && "Simulate Client Submitting Lead"}
                  {leadSimStatus === 'processing' && "Triggering Alert..."}
                  {leadSimStatus === 'submitted' && "Success: Alert Sent to Telegram!"}
                </button>
                {leadSimStatus === 'submitted' && (
                  <p className="text-[9px] text-emerald-500 text-center mt-2 italic font-sans font-medium">
                    (In real setup, customer submits lead → bot immediately alerts phone)
                  </p>
                )}
              </div>
            </div>

            {/* Render Output staging column */}
            <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0A0A0A] border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <span className="text-[9px] font-mono uppercase text-[#8E8E93] tracking-widest block border-b border-black/5 dark:border-white/5 pb-2">
                LIVE FRONT-END STAGING VIEW
              </span>

              {/* Browser framework */}
              <div className={`rounded-2xl border overflow-hidden shadow-md ${
                isDark ? 'bg-[#141414] border-white/10' : 'bg-white border-black/10'
              }`}>
                
                {/* Browser top */}
                <div className={`px-4 py-2 border-b flex items-center gap-2 ${
                  isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className={`text-[8px] font-mono uppercase tracking-widest select-none ml-2 px-3 py-0.5 rounded border ${
                    isDark ? 'bg-white/5 border-white/5 text-[#8E8E93]' : 'bg-white border-black/5 text-[#8E8E93]'
                  }`}>
                    https://client-staging-452.samaxon.pro
                  </span>
                </div>

                {/* Live Output */}
                <div className="p-5 text-left space-y-4 font-sans select-none">
                  
                  {/* Announcement */}
                  <div className={`py-2 px-3 font-mono text-[9px] text-center uppercase tracking-widest rounded-lg border flex items-center justify-center gap-1.5 ${
                    isDark ? 'bg-white/5 border-white/10 text-[#D6B46A]' : 'bg-black/5 border-black/10 text-[#BFA15A]'
                  }`}>
                    <Sparkles className="w-3 h-3 text-[#D6B46A] shrink-0 animate-pulse" />
                    <span>{promoBanner}</span>
                  </div>

                  {/* Headline */}
                  <div className="py-4 text-center space-y-1">
                    <h3 className="font-display font-bold text-base leading-tight">
                      {webHeadline}
                    </h3>
                    <p className="text-[10px] text-[#8E8E93] max-w-sm mx-auto">
                      We build elite systems that command immediate premium posture in client sectors.
                    </p>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-2" id="simulated-services-count">
                    {Array.from({ length: activeServices }).map((_, i) => (
                      <div key={i} className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'
                      }`}>
                        <span className="text-[8px] font-mono text-[#D6B46A] uppercase block">Module 0{i + 1}</span>
                        <span className="text-[10px] font-bold uppercase mt-0.5 block">Premium Asset</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation feedback */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-2 text-xs ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
              }`}>
                <AlertCircle className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <p className="text-[#8E8E93] leading-relaxed">
                  <strong>Staging feedback:</strong> This simulator represents our decoupled architecture approach. Our frontend layout is connected entirely to data structures, allowing seamless administrative edits downstream with zero hardcoded layouts.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- BLUEPRINT ROADMAP INFO SEC --- */}
        <section className={`rounded-3xl border p-8 sm:p-12 text-left transition-all ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-lg'
        }`} id="framework-info">
          <div className="max-w-3xl space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] block font-bold">
              Architectural Preparation
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
              Phase 1: Public Base &amp; Decoupled Scaffolding
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
              We compile clean database types, structural inputs, schema bounds, and automated pipelines first. This ensures you launch and capture business inquiries in 48 hours immediately.
            </p>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
              In later stages of your enterprise journey, mounting our secure administrative controller becomes a 24-hour drop-in modular addition, rather than requiring expensive code modifications or page refactorings. That is the luxury of foresight.
            </p>
            <button
              onClick={handleInquire}
              className="px-7 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-full flex items-center justify-center gap-1.5 duration-200 cursor-pointer shadow-md"
            >
              <span>Secure Future Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
