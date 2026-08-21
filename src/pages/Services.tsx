import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Layers, Crown, Sparkles, FileSpreadsheet, MessageCircle, BarChart3, Database, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { SERVICES_DATA } from '../data';
import { useTheme } from '../context/ThemeContext';

interface ServicesProps {
  setCurrentPage?: (page: string) => void;
}

export default function Services({ setCurrentPage }: ServicesProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleAction = (serviceId: string) => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredServices = selectedCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.category === selectedCategory || s.id === 'seo-perf');

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 transition-colors duration-300 font-sans" id="services-page">
      <SEO 
        title="Complete Digital Execution & Capabilities"
        description="Explore our elite services: Web development, WebView mobile apps, custom monogram branding, task automations, and custom Telegram alert bots."
        canonicalPath="/services"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-12 max-w-4xl border-b border-black/5 dark:border-white/5 pb-10">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
              : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
            <span>Elite Studio Capabilities</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            Complete Digital Execution <br />
            <span className="text-[#D6B46A]">Under One Premium Roof.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            SamaXon executes your digital infrastructure under unified senior direction. No mismatched freelancers. No slow agency chains. Web development, app deployment, custom branding, bots, and automations delivered elegantly.
          </p>
        </div>

        {/* --- CATEGORY FILTERS --- */}
        <div className="flex flex-wrap gap-2 mb-12" id="services-cats">
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
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#D6B46A] text-[#0A0A0A] border-[#D6B46A] shadow-sm'
                  : isDark
                    ? 'bg-white/5 text-[#8E8E93] border-white/10 hover:border-white/20 hover:text-white'
                    : 'bg-black/5 text-[#6E6E73] border-black/10 hover:border-black/20 hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* --- DETAILED SERVICES VIRTUAL STACK --- */}
        <div className="space-y-8" id="services-detail-list">
          {filteredServices.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border p-7 sm:p-10 text-left relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all ${
                isDark 
                  ? 'bg-[#121212] border-white/10 hover:border-[#D6B46A]/40' 
                  : 'bg-white border-black/10 hover:border-[#D6B46A]/50 shadow-md'
              }`}
              id={`service-card-${service.id}`}
            >
              {/* Left column: Overview / Pain and Solution */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center">
                    {service.id === 'web-dev' && <Code className="w-5 h-5" />}
                    {service.id === 'app-dev' && <Layers className="w-5 h-5" />}
                    {service.id === 'identity-design' && <Crown className="w-5 h-5" />}
                    {service.id === '8k-graphics' && <Sparkles className="w-5 h-5" />}
                    {service.id === 'automations' && <FileSpreadsheet className="w-5 h-5" />}
                    {service.id === 'telegram-bots' && <MessageCircle className="w-5 h-5" />}
                    {service.id === 'admin-dashboards' && <Database className="w-5 h-5" />}
                    {service.id === 'seo-perf' && <BarChart3 className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8E93] block">
                      Capabilities Wing {index + 1}
                    </span>
                    <h2 className="font-display font-bold text-xl sm:text-2xl">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border flex gap-3 ${
                  isDark ? 'bg-red-500/5 border-red-500/15' : 'bg-red-500/5 border-red-500/10'
                }`}>
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[9px] font-mono text-red-500 uppercase font-bold tracking-widest">Pain Point Highlight:</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed mt-0.5">{service.painPoint}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h4 className="text-[10px] font-mono text-[#D6B46A] uppercase font-bold tracking-widest">Our Custom System Solution:</h4>
                  <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">{service.solutionCopy}</p>
                </div>

                <ul className="space-y-1.5 pt-1 list-none">
                  {service.benefitPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-medium leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right column: Deliverables / Specs / Forms Action */}
              <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-7 flex flex-col justify-between h-full ${
                isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'
              }`}>
                <div className="space-y-3.5">
                  <span className="text-[9px] font-mono text-[#8E8E93] uppercase tracking-widest block font-bold border-b border-black/5 dark:border-white/5 pb-2">
                    Verified Deliverables Included
                  </span>
                  
                  <ul className="space-y-2.5 list-none">
                    {service.deliverables.map((deliv, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <CheckCircle className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                        <span className="text-xs font-mono uppercase tracking-wider select-none text-[#8E8E93]">
                          {deliv}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={() => handleAction(service.id)}
                    className="w-full py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] text-[#8E8E93] text-center mt-2.5 uppercase tracking-widest font-mono">
                    Demo-First approach · Build begins in 24 hours
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* --- CUSTOM CONSULTATION CTA --- */}
        <section className={`mt-16 border p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden transition-all ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-lg'
        }`} id="demo-consult-cta">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 relative z-10">
            <Crown className="w-7 h-7 text-[#D6B46A]" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Need Something Heavily Tailored?
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
              We specialize in custom operational automation pipelines, real-time alert modules, complex graphic sequences, and scalable enterprise setups.
            </p>
            <button
              onClick={() => handleAction('custom')}
              className="px-7 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-full flex items-center gap-1.5 cursor-pointer mt-1 shadow-md transition-all"
            >
              <span>Request Elite Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
