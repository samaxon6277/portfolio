import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Sparkles, Filter, Smile } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { PORTFOLIO_DATA } from '../data';
import { supabaseService } from '../utils/supabaseService';
import { useTheme } from '../context/ThemeContext';

interface PortfolioProps {
  setCurrentPage?: (page: string) => void;
}

function SmartThumbnail({ src, alt }: { src: string; alt: string }) {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight > naturalWidth * 1.05) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };

  return (
    <div className={`w-full rounded-2xl overflow-hidden mb-4 border border-black/5 dark:border-white/5 relative bg-black/5 transition-all duration-300 ${
      isPortrait
        ? 'aspect-[3/4] max-h-[380px] mx-auto'
        : 'aspect-[16/10] w-full'
    }`}>
      <img 
        src={src} 
        alt={alt} 
        onLoad={handleLoad}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Portfolio({ setCurrentPage }: PortfolioProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [projectsList, setProjectsList] = useState<any[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const dynamicProjs = await supabaseService.getPortfolioProjects();
        if (dynamicProjs && dynamicProjs.length > 0) {
          const formatted = dynamicProjs.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type,
            category: p.category,
            problem: p.problem,
            solution: p.solution,
            result: p.result,
            visualTag: p.type || 'Custom Built',
            accentColor: '#D6B46A',
            thumbnailUrl: p.thumbnailUrl
          }));
          setProjectsList(formatted);
        } else {
          setProjectsList(PORTFOLIO_DATA);
        }
      } catch (err) {
        setProjectsList(PORTFOLIO_DATA);
      }
    };
    loadProjects();
  }, []);

  const filteredProjects = (activeFilter === 'all'
    ? projectsList
    : projectsList.filter((p) => p.category === activeFilter)
  ).filter(p => !!p.thumbnailUrl);

  const handleInquire = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 transition-colors duration-300 font-sans" id="portfolio-page">
      <SEO 
        title="Proof of Premium Execution & Case Studies"
        description="Browse our selected work: Premium corporate websites, custom monograms, WebView booking apps, and instant Telegram alert bot integrations."
        canonicalPath="/portfolio"
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
            <span>Elite Case Studies & Visual Proof</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            Proof of Premium Execution. <br />
            <span className="text-[#D6B46A]">Engineered to Perform.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            Explore our real transformation chronicles. Every case study outlines the complex business pain point, SamaXon’s customized technical architecture, and the actual performance dividends paid.
          </p>
        </div>

        {/* --- PORTFOLIO CATEGORY FILTERS --- */}
        <div className="flex flex-wrap items-center gap-2 mb-12" id="portfolio-filters-list">
          <div className="flex items-center gap-1.5 text-xs text-[#D6B46A] font-mono uppercase tracking-widest mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {[
            { label: 'All Cases', id: 'all' },
            { label: 'Websites', id: 'websites' },
            { label: 'Apps', id: 'apps' },
            { label: 'Brand Identity', id: 'brand-identity' },
            { label: 'Graphics', id: 'graphics' },
            { label: 'Automations', id: 'automations' },
            { label: 'Telegram Bots', id: 'bots' },
            { label: 'Admin-Ready', id: 'admin-ready' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-[#D6B46A] text-[#0A0A0A] border-[#D6B46A] shadow-sm'
                  : isDark
                    ? 'bg-white/5 text-[#8E8E93] border-white/10 hover:border-white/20 hover:text-white'
                    : 'bg-black/5 text-[#6E6E73] border-black/10 hover:border-black/20 hover:text-black'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* --- PORTFOLIO CASE STUDY LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="portfolio-cases-grid">
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between h-full group select-none relative overflow-hidden transition-all ${
                isDark 
                  ? 'bg-[#121212] border-white/10 hover:border-[#D6B46A]/40' 
                  : 'bg-white border-black/10 hover:border-[#D6B46A]/50 shadow-md'
              }`}
            >
              <div>
                {project.thumbnailUrl && (
                  <SmartThumbnail src={project.thumbnailUrl} alt={project.title} />
                )}

                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3 mb-4">
                  <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border ${
                    isDark 
                      ? 'bg-white/10 border-white/15 text-white' 
                      : 'bg-black/5 border-black/10 text-[#1D1D1F]'
                  }`}>
                    {project.visualTag}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-2.5 h-2.5 text-[#D6B46A] fill-[#D6B46A]" />
                    ))}
                  </div>
                </div>

                <h3 className="font-display font-bold text-base mb-3 flex items-center gap-1.5">
                  <span>{project.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D6B46A] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <div className="space-y-2.5">
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-red-500/5 border-red-500/15' : 'bg-red-500/5 border-red-500/10'
                  }`}>
                    <span className="text-[8px] font-mono text-red-500 font-bold uppercase tracking-widest block mb-0.5">
                      1. Business Vulnerability:
                    </span>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      {project.problem}
                    </p>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'
                  }`}>
                    <span className="text-[8px] font-mono text-[#D6B46A] font-bold uppercase tracking-widest block mb-0.5">
                      2. SamaXon Execution:
                    </span>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      {project.solution}
                    </p>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-emerald-500/5 border-emerald-500/10'
                  }`}>
                    <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-0.5">
                      3. Transformation Result:
                    </span>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed">
                      {project.result}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={handleInquire}
                  className="w-full py-2.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>Request Similar System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className={`col-span-full py-16 text-center flex flex-col items-center gap-3 rounded-3xl border border-dashed ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
            }`}>
              <Smile className="w-10 h-10 text-[#D6B46A]" />
              <div className="space-y-1">
                <p className="font-display font-bold">No cases categorized under this wing yet.</p>
                <p className="text-xs text-[#8E8E93]">We build highly custom projects. Contact us to hear of unlisted bespoke assets.</p>
              </div>
              <button 
                onClick={handleInquire}
                className="px-5 py-2 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-mono text-xs rounded-xl font-bold uppercase tracking-wider"
              >
                Ask Senior Dev Wing
              </button>
            </div>
          )}
        </div>

        {/* --- PORTFOLIO DEDICATED DIRECT CALL CTA --- */}
        <div className={`mt-16 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left border ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-md'
        }`} id="spec-cases-banner">
          <div className="space-y-1.5 max-w-xl">
            <h4 className="font-display font-bold text-base flex items-center gap-2">
              <span>Looking for our NDA-Protected enterprise vaults?</span>
              <ShieldCheck className="w-4 h-4 text-[#D6B46A]" />
            </h4>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              We execute private systems for leading pharmaceutical companies, retail groups, and high-end brokerage houses. These cannot be listed publicly due to privacy covenants. Meet with us directly to review isolated mockups offline.
            </p>
          </div>
          <button 
            onClick={handleInquire}
            className="px-6 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider rounded-xl shrink-0 transition-all cursor-pointer shadow-md"
          >
            Access Vaults
          </button>
        </div>

      </div>
    </div>
  );
}
