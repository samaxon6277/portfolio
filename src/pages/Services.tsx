import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Layers, Crown, Sparkles, FileSpreadsheet, MessageCircle, BarChart3, Database, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';
import { SERVICES_DATA } from '../data';

interface ServicesProps {
  setCurrentPage?: (page: string) => void;
}

export default function Services({ setCurrentPage }: ServicesProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleAction = (serviceId: string) => {
    navigate(`/service-request?service=${serviceId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredServices = selectedCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => {
        if (selectedCategory === 'websites') return s.category === 'websites' || s.id === 'seo-perf';
        if (selectedCategory === 'apps') return s.category === 'apps';
        if (selectedCategory === 'brand-identity') return s.category === 'brand-identity' || s.category === 'graphics' || s.id === '8k-graphics';
        if (selectedCategory === 'automations') return s.category === 'automations' || s.category === 'bots' || s.id === 'telegram-bots';
        if (selectedCategory === 'admin-ready') return s.category === 'admin-ready' || s.id === 'admin-dashboards';
        return s.category === selectedCategory;
      });

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="services-page">
      <SEO 
        title="Complete Digital Execution & Capabilities"
        description="Explore our elite services: Web development, WebView mobile apps, custom monogram branding, task automations, and custom Telegram alert bots."
        canonicalPath="/services"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-12 max-w-4xl border-b border-champagne-gold/15 pb-10">
          <div className="px-4 py-2 bg-champagne-gold/15 border border-champagne-gold/30 text-[#A68936] text-xs font-mono uppercase font-bold tracking-widest rounded-full">
            Elite Studio Capabilities
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-matte-black leading-tight">
            Complete Digital Execution <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">
              Under One Premium Roof.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#3D3731] leading-relaxed mt-2 max-w-2xl font-normal">
            SamaXon executes your digital infrastructure under unified senior direction. No mismatched freelancers. No slow agency chains. Web development, app deployment, custom branding, bots, and automations delivered elegantly.
          </p>

          {/* Quick AI Tools Highlight Banner */}
          <div className="w-full bg-[#111111] text-soft-ivory p-5 sm:p-6 rounded-2xl border border-[#D6B46A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center font-bold text-lg">
                ✦
              </div>
              <div className="text-left">
                <span className="text-xs font-mono text-[#D6B46A] uppercase font-bold tracking-wider block">
                  Free Digital Creator Tools Live
                </span>
                <p className="text-sm text-[#D1CCC4] mt-0.5">
                  Compress photos up to 95% and resize images to official Visa/Passport 300 DPI standards for free.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/tools')}
              className="px-5 py-2.5 bg-[#D6B46A] hover:bg-white text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 shadow-md"
            >
              Open Tools Hub →
            </button>
          </div>
        </div>

        {/* --- CATEGORY FILTERS --- */}
        <div className="flex flex-wrap gap-3 mb-12" id="services-cats">
          {[
            { label: 'All Capabilities', id: 'all' },
            { label: 'Websites & SEO', id: 'websites' },
            { label: 'Mobile Apps', id: 'apps' },
            { label: 'Brand & 8K Graphics', id: 'brand-identity' },
            { label: 'Automations & Bots', id: 'automations' },
            { label: 'Admin Dashboard Power', id: 'admin-ready' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-matte-black text-soft-ivory border-champagne-gold/40 shadow-md'
                  : 'bg-white/70 text-[#423C36] border-champagne-gold/20 hover:border-champagne-gold/50 hover:text-matte-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* --- DETAILED SERVICES VIRTUAL STACK --- */}
        <div className="space-y-12" id="services-detail-list">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white/90 border border-[#D6B46A]/25 rounded-[36px] p-8 sm:p-12 text-left relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start hover:border-[#D6B46A]/60 duration-300 transition-all shadow-[0_4px_20px_-2px_rgba(17,17,17,0.05),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_18px_42px_-6px_rgba(17,17,17,0.1),0_4px_14px_-2px_rgba(214,180,106,0.18)] hover:-translate-y-1"
              id={`service-card-${service.id}`}
            >
              {/* Card visual ambient lighting */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-gold/5 rounded-full blur-3xl pointer-events-none" />

              {/* Left column: Overview / Pain and Solution */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-matte-black text-champagne-gold border border-champagne-gold/30 flex items-center justify-center shadow-md">
                    {service.id === 'web-dev' && <Code className="w-6 h-6" />}
                    {service.id === 'app-dev' && <Layers className="w-6 h-6" />}
                    {service.id === 'identity-design' && <Crown className="w-6 h-6" />}
                    {service.id === '8k-graphics' && <Sparkles className="w-6 h-6" />}
                    {service.id === 'automations' && <FileSpreadsheet className="w-6 h-6" />}
                    {service.id === 'telegram-bots' && <MessageCircle className="w-6 h-6" />}
                    {service.id === 'admin-dashboards' && <Database className="w-6 h-6" />}
                    {service.id === 'seo-perf' && <BarChart3 className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6A6359] block font-bold">
                      Capabilities Wing {index + 1}
                    </span>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-matte-black tracking-tight mt-0.5">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex gap-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono text-red-600 uppercase font-bold tracking-wider">Pain Point Highlight:</h4>
                    <p className="text-sm text-[#181614] leading-relaxed font-semibold mt-0.5">{service.painPoint}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-mono text-[#A68936] uppercase font-bold tracking-wider">Our Custom System Solution:</h4>
                  <p className="text-sm sm:text-base text-[#38332D] leading-relaxed font-normal">{service.solutionCopy}</p>
                </div>

                <ul className="space-y-2.5 pt-2 list-none">
                  {service.benefitPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm font-bold text-[#1F1C1A] leading-normal">
                      <span className="w-2 h-2 rounded-full bg-champagne-gold mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right column: Deliverables / Specs / Forms Action */}
              <div className="lg:col-span-5 bg-pearl-white/95 border border-champagne-gold/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full hover:border-champagne-gold/50 shadow-xs duration-200">
                <div className="space-y-4">
                  <span className="text-xs font-mono text-[#5A534B] uppercase tracking-wider block font-bold border-b border-champagne-gold/20 pb-2">
                    Verified Deliverables Included
                  </span>
                  
                  <ul className="space-y-3 list-none">
                    {service.deliverables.map((deliv, index) => (
                      <li key={index} className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-champagne-gold shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#1F1C1A] font-semibold uppercase tracking-wider font-mono select-none">
                          {deliv}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-champagne-gold/20">
                  <button
                    onClick={() => handleAction(service.id)}
                    className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold uppercase tracking-wider text-xs sm:text-sm rounded-xl border border-champagne-gold/30 shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_22px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    <span>Launch Service Sandbox & Request</span>
                    <ArrowRight className="w-4 h-4 ml-0.5 text-[#D6B46A]" />
                  </button>
                  <p className="text-xs text-[#9E823E] text-center mt-2.5 uppercase tracking-wider font-mono font-bold">
                    ✦ Test Drive In Live Sandbox · 48H Staging Guarantee
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* --- DEMO CONSULTATION CTA BANNER --- */}
        <section className="mt-20 bg-matte-black text-soft-ivory border border-champagne-gold/25 p-8 sm:p-12 rounded-[40px] text-center relative overflow-hidden" id="demo-consult-cta">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-champagne-gold/10 to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-5 relative z-10">
            <Crown className="w-8 h-8 text-champagne-gold" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-soft-ivory">
              Need Something Heavily Tailored?
            </h3>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed max-w-xl">
              We specialize in custom operational automation pipelines, real-time alert modules, complex graphic sequences, and scalable enterprise setups.
            </p>
            <button
              onClick={() => handleAction('custom')}
              className="px-8 py-3.5 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center gap-1.5 cursor-pointer mt-2"
            >
              Request Elite Consultation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
