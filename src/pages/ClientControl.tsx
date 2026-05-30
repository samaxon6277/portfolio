import { useState } from 'react';
import { ArrowRight, CheckCircle, Smartphone, Database, Shield, Layout, Sparkles, CheckSquare, Edit3, MessageCircle, BarChart3, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import CustomSelect from '../components/CustomSelect';

interface ClientControlProps {
  setCurrentPage: (page: string) => void;
}

export default function ClientControl({ setCurrentPage }: ClientControlProps) {
  // Interactive Simulator States
  const [promoBanner, setPromoBanner] = useState<string>("SamaXon Special Offer: 48-Hour Web Launch");
  const [webHeadline, setWebHeadline] = useState<string>("Premium Luxury Estate Builders India");
  const [activeServices, setActiveServices] = useState<number>(4);
  const [leadSimStatus, setLeadSimStatus] = useState<'idle' | 'submitted' | 'processing'>('idle');

  const handleInquire = () => {
    setCurrentPage('contact');
    window.location.hash = 'contact';
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="client-control-overview">
      <SEO 
        title="Digital Remote Control - Your Future Admin Hub"
        description="Every serious web build can include the Client Control Admin layer. Learn how to update banners, track incoming leads, and control services independently."
        canonicalPath="/control"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-champagne-gold/15 pb-10">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Future-Ready Admin Architecture
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            Every Serious Business Needs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">
              A Digital Remote Control.
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            A beautiful front page represents your online stature. But you shouldn't have to hire coder hours for simple day-to-day business adjustments. SameXon isolates data layers to prepare for a customizable admin dashboard.
          </p>
        </div>

        {/* --- CORE BENEFITS SYSTEM --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24" id="benefits-grid">
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
            <div 
              key={idx}
              className="bg-white/60 border border-champagne-gold/15 p-8 rounded-3xl hover:border-champagne-gold transition-colors duration-200 text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-wider block mb-4 font-bold">
                  Administrative Wing {idx + 1}
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-matte-black mb-2 uppercase tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-xs text-warm-grey leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
              <div className="h-0.5 bg-champagne-gold/20 w-1/4 mt-6" />
            </div>
          ))}
        </section>

        {/* --- INTERACTIVE SIMULATOR (SHOWCASE CONFLICT) --- */}
        <section className="bg-white border border-champagne-gold/15 rounded-[40px] p-8 sm:p-12 text-left relative overflow-hidden mb-24 gold-shadow-sm">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
              Interactive Dashboard Sandbox
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-matte-black mt-2">
              Experience the Control Simulator
            </h2>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed mt-2">
              See how our Client Control layer handles information. Toggle settings in the left simulator and notice the live front-end staging layout update instantly on the right. No development lines required.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="control-simulator">
            
            {/* Control Column */}
            <div className="lg:col-span-5 bg-matte-black text-soft-ivory p-6 rounded-3xl border border-champagne-gold/20 space-y-6">
              <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest block border-b border-champagne-gold/15 pb-2 font-bold flex items-center justify-between">
                <span>SIMULATED ADMIN PANEL</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>

              {/* Action 1: Banner Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-[#C5BCAE] font-bold">1. Manage Announcement Header:</label>
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
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-[#C5BCAE] font-bold">2. Edit Landing Tagline:</label>
                <input 
                  type="text" 
                  value={webHeadline}
                  onChange={(e) => setWebHeadline(e.target.value)}
                  className="bg-charcoal border border-champagne-gold/20 text-xs text-soft-ivory p-3.5 rounded-xl font-sans"
                />
              </div>

              {/* Action 3: Services count slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#C5BCAE] font-bold">
                  <span>3. Active Services Toggles:</span>
                  <span className="text-champagne-gold font-bold">{activeServices} Live</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  value={activeServices} 
                  onChange={(e) => setActiveServices(Number(e.target.value))}
                  className="w-full accent-champagne-gold cursor-pointer"
                />
              </div>

              {/* Action 4: Lead generation demo */}
              <div className="pt-2 border-t border-champagne-gold/10">
                <button
                  onClick={() => {
                    setLeadSimStatus('processing');
                    setTimeout(() => setLeadSimStatus('submitted'), 1200);
                  }}
                  disabled={leadSimStatus === 'processing'}
                  className="w-full py-3 bg-champagne-gold text-matte-black font-bold uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 duration-200 cursor-pointer disabled:opacity-50"
                >
                  {leadSimStatus === 'idle' && "Simulate Client Submitting Lead"}
                  {leadSimStatus === 'processing' && "Simulating Automation Trigger..."}
                  {leadSimStatus === 'submitted' && "Success: Alert Hit Telegram!"}
                </button>
                {leadSimStatus === 'submitted' && (
                  <p className="text-[9px] text-[#A6FCB8] text-center mt-2 italic font-sans font-medium">
                    (In real setup, customer submits lead → bot immediately alerts phone)
                  </p>
                )}
              </div>
            </div>

            {/* Render Output staging column */}
            <div className="lg:col-span-7 bg-pearl-white/80 p-6 rounded-3xl border border-champagne-gold/15 space-y-4">
              <span className="text-[9px] font-mono uppercase text-warm-grey tracking-widest block border-b border-champagne-gold/10 pb-2">
                LIVE FRONT-END STAGING VIEW
              </span>

              {/* Simulated browser framework */}
              <div className="bg-white rounded-2xl border border-champagne-gold/10 overflow-hidden shadow-lg">
                
                {/* Browser top indicators */}
                <div className="bg-pearl-white px-4 py-2 border-b border-champagne-gold/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[8px] font-mono text-warm-grey uppercase tracking-widest select-none ml-2 bg-white px-5 py-0.5 rounded border border-champagne-gold/5">
                    https://client-staging-452.samaxon.pro
                  </span>
                </div>

                {/* Live Output content rendering */}
                <div className="p-5 text-left space-y-4 font-sans select-none">
                  
                  {/* Staged header announcement */}
                  <div className="py-2.5 px-4 bg-matte-black text-soft-ivory font-mono text-[9px] text-center uppercase tracking-widest rounded-lg border border-champagne-gold/10 transition-all font-bold flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-champagne-gold shrink-0 animate-pulse" />
                    <span>{promoBanner}</span>
                  </div>

                  {/* Staged Navbar */}
                  <div className="flex justify-between items-center bg-pearl-white/50 border border-champagne-gold/5 p-3.5 rounded-xl">
                    <span className="font-display font-bold text-xs uppercase">SamaXon Client ID #4592</span>
                    <span className="text-[8px] font-mono text-[#BFA15A] uppercase tracking-wider font-extrabold border border-champagne-gold/20 px-2 py-0.5 rounded">
                      Demo Mode
                    </span>
                  </div>

                  {/* Staged Headline */}
                  <div className="py-8 text-center space-y-2">
                    <h3 className="font-display font-medium text-lg leading-tight text-matte-black capitalize">
                      {webHeadline}
                    </h3>
                    <p className="text-[10px] text-warm-grey max-w-sm mx-auto leading-normal">
                      We build elite systems that command immediate premium posture in client sectors.
                    </p>
                  </div>

                  {/* Staged grid count */}
                  <div className="grid grid-cols-2 gap-3" id="simulated-services-count">
                    {Array.from({ length: activeServices }).map((_, i) => (
                      <div key={i} className="p-3 bg-pearl-white/80 border border-champagne-gold/10 rounded-xl">
                        <span className="text-[8px] font-mono text-[#BFA15A] uppercase block">Service Module 0{i + 1}</span>
                        <span className="text-[10px] font-bold text-matte-black uppercase mt-0.5 block">Premium Tier Asset</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation feedback text */}
              <div className="p-4 bg-[#FFFDF8] border border-champagne-gold/15 rounded-2xl flex items-start gap-2 text-xs text-matte-black">
                <AlertCircle className="w-5 h-5 text-champagne-gold shrink-0" />
                <p className="leading-relaxed">
                  <strong>Staging feedback:</strong> This simulator represents our decoupled architecture approach. Our frontend layout is connected entirely to data structures, allowing seamless administrative edits downstream with zero hardcoded layouts.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- BLUEPRINT ROADMAP INFO SEC --- */}
        <section className="bg-matte-black text-[#E5DBCF] rounded-[40px] border border-champagne-gold/20 p-8 sm:p-12 text-left" id="framework-info">
          <div className="max-w-3xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] block font-bold">
              Architctural Preparation
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-soft-ivory leading-tight">
              Phase 1: Public Base &amp; Decoupled Scaffolding
            </h3>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              We compile clean database types, structural inputs, schema bounds, and automated pipelines first. This ensures you launch and capture business inquiries in 48 hours immediately.
            </p>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              In later stages of your enterprise journey, mounting our secure administrative controller becomes a 24-hour drop-in modular addition, rather than requiring expensive code modifications or page refactorings. That is the luxury of foresight.
            </p>
            <button
              onClick={handleInquire}
              className="px-8 py-3.5 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-widest text-[9px] rounded-full flex items-center justify-center gap-1.5 duration-200 cursor-pointer"
            >
              Secure Future Architecture
              <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
