import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Code, Terminal, Eye, Hammer, ShieldAlert, CheckCircle, Zap } from 'lucide-react';
import SEO from '../components/SEO';

interface AboutProps {
  setCurrentPage?: (page: string) => void;
}

export default function About({ setCurrentPage }: AboutProps) {
  const navigate = useNavigate();
  const handleAction = (page: string) => {
    const target = page === 'home' ? '/' : `/${page}`;
    navigate(target);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="about-page">
      <SEO 
        title="Who We Are - Elite Technical Powerhouse"
        description="SamaXon is built for founders who move fast. Discover our specialized Design Studio, Senior Developer Wing, and our legendary 48-Hour Execution Culture."
        canonicalPath="/about"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-champagne-gold/15 pb-12">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Elite Technical Powerhouse
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            SamaXon is Built for Founders <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">
              Who Move Fast.
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            We are a premium technical powerhouse combining senior systems development, pixel-perfect design precision, advanced automation thinking, and business-first execution.
          </p>
        </div>

        {/* --- BRAND STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24" id="brand-story-section">
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
              The Genesis
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-matte-black">
              Why SamaXon Exists
            </h2>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              Most business owners do not fail because their offline product or internal service is weak. They lose attention because their online presence looks slow, outdated, or generic. Traditional digital agencies operate on endless meetings, delayed sprints, and basic off-the-shelf templates.
            </p>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              SamaXon was designed to completely short-circuit that slow model. We merge the aesthetic sensitivity of a high-end design house with the direct execution velocity of senior developers.
            </p>

            <div className="border-l-4 border-champagne-gold pl-4 py-2 bg-champagne-gold/5 rounded-r-xl max-w-2xl">
              <p className="text-xs sm:text-sm font-semibold text-matte-black italic leading-relaxed">
                “Hum simple websites nahi banate. We build digital confidence. Premium speed with luxurious aesthetics so your brand commands immediate premium posture.”
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-champagne-gold/15 p-8 gold-shadow space-y-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-gold/5 rounded-full blur-2xl" />
            <Crown className="w-8 h-8 text-champagne-gold" />
            <h3 className="font-display font-bold text-lg text-matte-black">
              Elite Standard Only
            </h3>
            <p className="text-xs text-warm-grey leading-relaxed">
              Every system we deliver has undergone deep visual alignment grids, loading optimizations, security checks, and SEO indexing configurations.
            </p>
            <div className="space-y-2 mt-4">
              {['No random trial-and-error work', 'No slow agency chains', '100% Senior Engineers'].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-matte-black uppercase tracking-wider font-mono">
                  <CheckCircle className="w-4 h-4 text-champagne-gold" />
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- THE TWO CORE WINGS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24" id="core-wings-section">
          {/* Developer Wing */}
          <div className="bg-matte-black text-soft-ivory rounded-[34px] border border-champagne-gold/25 p-10 text-left relative overflow-hidden flex flex-col justify-between gold-shadow">
            <div className="absolute top-0 right-0 w-48 h-48 bg-champagne-gold/5 rounded-full blur-3xl" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-charcoal text-champagne-gold border border-champagne-gold/30 flex items-center justify-center mb-8">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-soft-ivory mb-4">
                Senior Developer Wing
              </h3>
              <p className="text-xs text-[#C5BCAE] leading-relaxed mb-6 font-medium">
                Our heavy engineering side is engineered strictly for speed and custom functionality. We avoid bloated frameworks, excessive code dependencies, or unoptimized rendering scripts. 
              </p>
              <p className="text-xs text-[#A69C91] leading-relaxed mb-8">
                Every website, application, automation bot, and interface layout we design is handcrafted using typing safeguards, fast-loading compression, and prepared scaffolding for content-rich admin dashboards.
              </p>
            </div>
            
            <div className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold border-t border-champagne-gold/15 pt-4">
              PERFORMANCE · SECURITY · CODE HYGIENE
            </div>
          </div>

          {/* Design Studio Wing */}
          <div className="bg-white text-matte-black rounded-[34px] border border-champagne-gold/25 p-10 text-left relative overflow-hidden flex flex-col justify-between gold-shadow-sm">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-champagne-gold/3 rounded-full blur-3xl" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pearl-white text-matte-black border border-champagne-gold/30 flex items-center justify-center mb-8">
                <Eye className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-matte-black mb-4">
                Specialized Design Studio
              </h3>
              <p className="text-xs text-warm-grey leading-relaxed mb-6">
                Premium digital assets start with supreme visual hierarchy. Our specialized Design Studio rejects average layouts. We align your color aesthetics, type layouts, and visual hierarchy to feel like an expensive, international luxury establishment.
              </p>
              <p className="text-xs text-warm-grey leading-relaxed mb-8">
                We craft custom monograms, premium 8K graphic banners, and responsive layouts that look structurally clean, highly memorable, and incredibly eye-safe on premium smart screens.
              </p>
            </div>

            <div className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] border-t border-champagne-gold/15 pt-4">
              TYPOGRAPHY PAIRINGS · SPACING RIGOR · LUXURY COLOR
            </div>
          </div>
        </section>

        {/* --- CULTURE SECTION --- */}
        <section className="bg-white border border-champagne-gold/15 rounded-[40px] p-8 sm:p-12 text-left relative overflow-hidden" id="culture-section">
          {/* Decorative fluid elements */}
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-champagne-gold/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
                No Freelancer Workflow
              </span>
              <h2 className="font-display text-3xl font-bold text-matte-black select-none">
                48-Hour Execution Culture
              </h2>
              <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
                Fast delivery is not an accident of working longer hours. It stems from absolute clarity in client onboarding, modular component architecture, robust pre-engineered scaffolding, and disciplined execution.
              </p>
              <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
                We do not play games with your timelines. When you trust us with your brand presence, our entire team aligns to ship a highly responsive, customized premium digital asset within 48 hours. No delays, no excuses.
              </p>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleAction('contact')}
                  className="px-6 py-3.5 bg-matte-black hover:bg-charcoal text-white font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer border border-champagne-gold/20 font-mono"
                >
                  Start Build Now
                  <Zap className="w-3.5 h-3.5 text-champagne-gold" />
                </button>
                <button
                  onClick={() => handleAction('contact')}
                  className="px-6 py-3.5 bg-transparent text-matte-black hover:bg-[#F0EAE1] font-bold uppercase tracking-widest text-[10px] rounded-full border border-matte-black/10 transition-colors font-mono"
                >
                  Request A Meeting
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-pearl-white/80 rounded-2xl border border-champagne-gold/15 p-6 space-y-4">
              <span className="text-[9px] font-mono uppercase text-[#BFA15A] block tracking-wider font-bold">
                Our Rigidity Quality Checklist
              </span>
              
              <div className="space-y-3">
                {[
                  "Mobile Load In &lt; 2.2 Secs",
                  "Lighthouse SEO Score 95+",
                  "Semantic Tag Compliance",
                  "Pixel-Perfect Soft UI Standards",
                  "Admin-Ready Data Structure Schema"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-matte-black flex items-center justify-center shrink-0 border border-champagne-gold/20">
                      <CheckCircle className="w-3 h-3 text-champagne-gold" />
                    </div>
                    <span className="text-xs text-charcoal font-semibold truncate uppercase tracking-wider font-mono">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
