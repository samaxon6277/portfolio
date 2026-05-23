import { useState } from 'react';
import { ArrowRight, CheckCircle, Code, Layers, Crown, Sparkles, FileSpreadsheet, MessageCircle, BarChart3, Database, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';
import { SERVICES_DATA } from '../data';

interface ServicesProps {
  setCurrentPage: (page: string) => void;
}

export default function Services({ setCurrentPage }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleAction = (serviceId: string) => {
    // Keep it integrated, route directly to contact or pre-fill query
    setCurrentPage('contact');
    window.location.hash = 'contact';
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const filteredServices = selectedCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.category === selectedCategory || s.id === 'seo-perf');

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
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Elite Studio Capabilities
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            Complete Digital Execution <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">
              Under One Premium Roof.
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            SamaXon executes your digital infrastructure under unified senior direction. No mismatched freelancers. No slow agency chains. Web development, app deployment, custom branding, bots, and automations delivered elegantly.
          </p>
        </div>

        {/* --- CATEGORY FILTERS --- */}
        <div className="flex flex-wrap gap-2.5 mb-12" id="services-cats">
          {[
            { label: 'All Capabilities', id: 'all' },
            { label: 'Websites & SEO', id: 'websites' },
            { label: 'Mobile Apps', id: 'apps' },
            { label: 'Brand Identity', id: 'brand-identity' },
            { label: 'Automations & Bots', id: 'automations' },
            { label: 'Admin Dashboard Power', id: 'admin-ready' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-matte-black text-soft-ivory border-champagne-gold/40 shadow-md'
                  : 'bg-white/55 text-warm-grey border-champagne-gold/15 hover:border-champagne-gold/40 hover:text-matte-black'
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
              className="bg-white/60 border border-champagne-gold/15 rounded-[40px] p-8 sm:p-12 text-left relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-start hover:border-champagne-gold duration-300 transition-all gold-shadow-sm"
              id={`service-card-${service.id}`}
            >
              {/* Card visual ambient lighting */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-gold/3 rounded-full blur-3xl pointer-events-none" />

              {/* Left column: Overview / Pain and Solution */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-matte-black text-champagne-gold border border-champagne-gold/30 flex items-center justify-center">
                    {service.id === 'web-dev' && <Code className="w-5.5 h-5.5" />}
                    {service.id === 'app-dev' && <Layers className="w-5.5 h-5.5" />}
                    {service.id === 'identity-design' && <Crown className="w-5.5 h-5.5" />}
                    {service.id === '8k-graphics' && <Sparkles className="w-5.5 h-5.5" />}
                    {service.id === 'automations' && <FileSpreadsheet className="w-5.5 h-5.5" />}
                    {service.id === 'telegram-bots' && <MessageCircle className="w-5.5 h-5.5" />}
                    {service.id === 'admin-dashboards' && <Database className="w-5.5 h-5.5" />}
                    {service.id === 'seo-perf' && <BarChart3 className="w-5.5 h-5.5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-warm-grey block">
                      Capabilities Wing {index + 1}
                    </span>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-matte-black">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-mono text-red-600 uppercase font-bold tracking-widest">Pain Point Highlight:</h4>
                    <p className="text-xs text-charcoal/90 leading-relaxed font-semibold mt-0.5">{service.painPoint}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-mono text-champagne-gold uppercase font-bold tracking-widest">Our Custom System Solution:</h4>
                  <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">{service.solutionCopy}</p>
                </div>

                <div className="space-y-2 pt-2">
                  {service.benefitPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-matte-black leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: Deliverables / Specs / Forms Action */}
              <div className="lg:col-span-5 bg-pearl-white/80 border border-champagne-gold/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full hover:border-champagne-gold duration-200">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono text-warm-grey uppercase tracking-widest block font-bold border-b border-champagne-gold/10 pb-2">
                    Verified Deliverables Included
                  </span>
                  
                  <div className="space-y-3">
                    {service.deliverables.map((deliv, index) => (
                      <div key={index} className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-champagne-gold shrink-0 mt-0.5" />
                        <span className="text-xs text-charcoal font-medium uppercase tracking-wider font-mono select-none truncate">
                          {deliv}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-champagne-gold/10">
                  <button
                    onClick={() => handleAction(service.id)}
                    className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold uppercase tracking-widest text-[10px] rounded-xl border border-champagne-gold/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {service.ctaText}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] text-warm-grey text-center mt-3 uppercase tracking-widest font-mono">
                    Demo-First approach · Build begins in 24 hours
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
