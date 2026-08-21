import { useNavigate } from 'react-router-dom';
import { Crown, Terminal, Eye, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';

interface AboutProps {
  setCurrentPage?: (page: string) => void;
}

export default function About({ setCurrentPage }: AboutProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleAction = (page: string) => {
    const target = page === 'home' ? '/' : `/${page}`;
    navigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 transition-colors duration-300 font-sans" id="about-page">
      <SEO 
        title="Who We Are - Elite Technical Powerhouse"
        description="SamaXon is built for founders who move fast. Discover our specialized Design Studio, Senior Developer Wing, and our legendary 48-Hour Execution Culture."
        canonicalPath="/about"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-20 max-w-4xl border-b border-black/5 dark:border-white/5 pb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
              : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
            <span>Elite Technical Powerhouse</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            SamaXon is Built for Founders <br />
            <span className="text-[#D6B46A]">Who Move Fast.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            We are a premium technical powerhouse combining senior systems development, pixel-perfect design precision, advanced automation thinking, and business-first execution.
          </p>
        </div>

        {/* --- BRAND STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24" id="brand-story-section">
          <div className="lg:col-span-7 text-left space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              The Genesis
            </span>
            <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#1D1D1F]'
            }`}>
              Why SamaXon Exists
            </h2>
            <p className="text-sm text-[#8E8E93] leading-relaxed">
              Most business owners do not fail because their offline product or internal service is weak. They lose attention because their online presence looks slow, outdated, or generic. Traditional digital agencies operate on endless meetings, delayed sprints, and basic off-the-shelf templates.
            </p>
            <p className="text-sm text-[#8E8E93] leading-relaxed">
              SamaXon was designed to completely short-circuit that slow model. We merge the aesthetic sensitivity of a high-end design house with the direct execution velocity of senior developers.
            </p>

            <div className={`border-l-2 border-[#D6B46A] pl-4 py-2.5 rounded-r-2xl max-w-2xl ${
              isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'
            }`}>
              <p className="text-xs sm:text-sm font-medium italic leading-relaxed text-[#8E8E93]">
                “Hum simple websites nahi banate. We build digital confidence. Premium speed with luxurious aesthetics so your brand commands immediate premium posture.”
              </p>
            </div>
          </div>

          <div className={`lg:col-span-5 rounded-3xl border p-8 space-y-5 text-left relative overflow-hidden transition-all ${
            isDark 
              ? 'bg-[#121212] border-white/10 text-white' 
              : 'bg-white border-black/10 text-[#1D1D1F] shadow-lg'
          }`}>
            <Crown className="w-8 h-8 text-[#D6B46A]" />
            <h3 className="font-display font-bold text-lg">
              Elite Standard Only
            </h3>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Every system we deliver has undergone deep visual alignment grids, loading optimizations, security checks, and SEO indexing configurations.
            </p>
            <div className="space-y-2.5 pt-2">
              {['No random trial-and-error work', 'No slow agency chains', '100% Senior Engineers'].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D6B46A]" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- THE TWO CORE WINGS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24" id="core-wings-section">
          {/* Developer Wing */}
          <motion.div 
            whileHover={{ y: -3 }}
            className={`rounded-3xl border p-8 md:p-10 text-left flex flex-col justify-between transition-all ${
              isDark 
                ? 'bg-[#121212] border-white/10 text-[#F5F5F7]' 
                : 'bg-white border-black/10 text-[#1D1D1F] shadow-md'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center mb-6">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                Senior Developer Wing
              </h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed mb-4">
                Our heavy engineering side is engineered strictly for speed and custom functionality. We avoid bloated frameworks, excessive code dependencies, or unoptimized rendering scripts.
              </p>
              <p className="text-xs text-[#8E8E93] leading-relaxed mb-6">
                Every website, application, automation bot, and interface layout we design is handcrafted using typing safeguards, fast-loading compression, and prepared scaffolding for content-rich admin dashboards.
              </p>
            </div>
            
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] border-t border-black/5 dark:border-white/5 pt-4 font-semibold">
              PERFORMANCE · SECURITY · CODE HYGIENE
            </div>
          </motion.div>

          {/* Design Studio Wing */}
          <motion.div 
            whileHover={{ y: -3 }}
            className={`rounded-3xl border p-8 md:p-10 text-left flex flex-col justify-between transition-all ${
              isDark 
                ? 'bg-[#121212] border-white/10 text-[#F5F5F7]' 
                : 'bg-white border-black/10 text-[#1D1D1F] shadow-md'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center mb-6">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                Specialized Design Studio
              </h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed mb-4">
                Premium digital assets start with supreme visual hierarchy. Our specialized Design Studio rejects average layouts. We align your color aesthetics, type layouts, and visual hierarchy to feel like an expensive, international luxury establishment.
              </p>
              <p className="text-xs text-[#8E8E93] leading-relaxed mb-6">
                We craft custom monograms, premium 8K graphic banners, and responsive layouts that look structurally clean, highly memorable, and incredibly eye-safe on premium smart screens.
              </p>
            </div>

            <div className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] border-t border-black/5 dark:border-white/5 pt-4 font-semibold">
              TYPOGRAPHY PAIRINGS · SPACING RIGOR · LUXURY COLOR
            </div>
          </motion.div>
        </section>

        {/* --- CULTURE SECTION --- */}
        <section className={`border rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden transition-all ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-lg'
        }`} id="culture-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
                No Freelancer Workflow
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight">
                48-Hour Execution Culture
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                Fast delivery is not an accident of working longer hours. It stems from absolute clarity in client onboarding, modular component architecture, robust pre-engineered scaffolding, and disciplined execution.
              </p>
              <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                We do not play games with your timelines. When you trust us with your brand presence, our entire team aligns to ship a highly responsive, customized premium digital asset within 48 hours. No delays, no excuses.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleAction('contact')}
                  className="px-6 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Start Build Now</span>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => handleAction('contact')}
                  className={`px-6 py-3 font-bold uppercase tracking-wider text-xs rounded-xl border transition-all cursor-pointer ${
                    isDark 
                      ? 'border-white/10 text-white hover:bg-white/5' 
                      : 'border-black/10 text-[#1D1D1F] hover:bg-black/5'
                  }`}
                >
                  Request A Meeting
                </button>
              </div>
            </div>

            <div className={`lg:col-span-4 rounded-2xl border p-6 space-y-3.5 ${
              isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'
            }`}>
              <span className="text-[9px] font-mono uppercase text-[#D6B46A] block tracking-wider font-bold">
                Our Rigidity Quality Checklist
              </span>
              
              <div className="space-y-2.5">
                {[
                  "Mobile Load In < 2.2 Secs",
                  "Lighthouse SEO Score 95+",
                  "Semantic Tag Compliance",
                  "Pixel-Perfect Soft UI Standards",
                  "Admin-Ready Data Structure Schema"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />
                    <span className="text-xs font-semibold truncate uppercase tracking-wider font-mono">
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
