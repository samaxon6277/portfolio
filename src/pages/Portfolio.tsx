import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, CheckSquare, Sparkles, Filter, Smile } from 'lucide-react';
import SEO from '../components/SEO';
import { PORTFOLIO_DATA } from '../data';
import { supabaseService } from '../utils/supabaseService';

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
    <div className={`w-full rounded-2xl overflow-hidden mb-5 border border-champagne-gold/15 relative bg-matte-black/5 transition-all duration-300 ${
      isPortrait
        ? 'aspect-[3/4] max-h-[380px] mx-auto'
        : 'aspect-[16/10] w-full'
    }`}>
      <img 
        src={src} 
        alt={alt} 
        onLoad={handleLoad}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500" 
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Portfolio({ setCurrentPage }: PortfolioProps) {
  const navigate = useNavigate();
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
        console.warn('Portfolio load failed, falling back to static presentation:', err);
        setProjectsList(PORTFOLIO_DATA);
      }
    };
    loadProjects();
  }, []);

  const filteredProjects = activeFilter === 'all'
    ? projectsList
    : projectsList.filter((p) => p.category === activeFilter);

  const handleInquire = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="portfolio-page">
      <SEO 
        title="Proof of Premium Execution & Case Studies"
        description="Browse our selected work: Premium corporate websites, custom monograms, WebView booking apps, and instant Telegram alert bot integrations."
        canonicalPath="/portfolio"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-12 max-w-4xl border-b border-champagne-gold/15 pb-10">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Elite Case Studies & Visual Proof
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            Proof of Premium Execution. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">
              Engineered to Perform.
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            Explore our real transformation chronicles. Every case study outlines the complex business pain point, SamaXon’s customized technical architecture, and the actual performance dividends paid.
          </p>
        </div>

        {/* --- PORTFOLIO CATEGORY FILTERS --- */}
        <div className="flex flex-wrap items-center gap-2 mb-12" id="portfolio-filters-list">
          <div className="flex items-center gap-1.5 text-xs text-[#BFA15A] font-mono uppercase tracking-widest mr-2">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          {[
            { label: 'All Cases', id: 'all' },
            { label: 'Websites', id: 'websites' },
            { label: 'Apps', id: 'apps' },
            { label: 'Brand Identity', id: 'brand-identity' },
            { label: 'Automations', id: 'automations' },
            { label: 'Telegram Bots', id: 'bots' },
            { label: 'Admin-Ready', id: 'admin-ready' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-matte-black text-soft-ivory border-champagne-gold/40'
                  : 'bg-white/55 text-warm-grey border-champagne-gold/15 hover:border-champagne-gold/40 hover:text-matte-black'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* --- PORTFOLIO CASE STUDY LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="portfolio-cases-grid">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white/60 border border-champagne-gold/15 p-8 rounded-[36px] hover:border-champagne-gold transition-all duration-300 flex flex-col justify-between h-full group select-none relative overflow-hidden"
            >
              {/* Dynamic ambient highlight based on accent color */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none rounded-full blur-[40px]" style={{ backgroundColor: project.accentColor || '#D6B46A' }} />

              <div>
                {project.thumbnailUrl && (
                  <SmartThumbnail src={project.thumbnailUrl} alt={project.title} />
                )}

                <div className="flex justify-between items-start border-b border-champagne-gold/10 pb-4 mb-6">
                  <span className="px-3.5 py-1.5 bg-matte-black/95 text-[9px] text-soft-ivory font-mono uppercase tracking-widest rounded-full border border-champagne-gold/20 font-bold">
                    {project.visualTag}
                  </span>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-2.5 h-2.5 text-champagne-gold fill-champagne-gold" />
                    ))}
                  </div>
                </div>

                <h3 className="font-display font-medium text-lg text-matte-black mb-4 flex items-center gap-1">
                  {project.title}
                  <Sparkles className="w-3.5 h-3.5 text-champagne-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <div className="space-y-4">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl leading-relaxed">
                    <span className="text-[8px] font-mono text-red-600 font-bold uppercase tracking-widest block mb-0.5">
                      1. Business Vulnerability:
                    </span>
                    <p className="text-xs text-charcoal/90 font-medium">
                      {project.problem}
                    </p>
                  </div>

                  <div className="p-3 bg-pearl-white border border-champagne-gold/10 rounded-xl leading-relaxed">
                    <span className="text-[8px] font-mono text-matte-black font-bold uppercase tracking-widest block mb-0.5">
                      2. SamaXon Execution:
                    </span>
                    <p className="text-xs text-warm-grey">
                      {project.solution}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl leading-relaxed">
                    <span className="text-[8px] font-mono text-emerald-600 font-bold uppercase tracking-widest block mb-0.5">
                      3. Transformation Result:
                    </span>
                    <p className="text-xs text-emerald-800 font-bold">
                      {project.result}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-champagne-gold/10">
                <button
                  onClick={handleInquire}
                  className="w-full py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold text-[10px] font-bold uppercase tracking-widest rounded-xl border border-champagne-gold/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Request Similar System
                  <ArrowRight className="w-3 h-3 text-champagne-gold" />
                </button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 bg-white/40 border border-dashed border-champagne-gold/25 rounded-[36px]">
              <Smile className="w-12 h-12 text-champagne-gold animate-bounce" />
              <div className="space-y-1">
                <p className="font-display font-bold text-matte-black">No cases categorized under this wing yet.</p>
                <p className="text-xs text-warm-grey">We build highly custom projects. Contact us to hear of unlisted bespoke assets.</p>
              </div>
              <button 
                onClick={handleInquire}
                className="px-6 py-2.5 bg-champagne-gold text-matte-black lowercase italic font-mono text-xs rounded-xl"
              >
                ask senior developer wing directly
              </button>
            </div>
          )}
        </div>

        {/* --- PORTFOLIO DEDICATED DIRECT CALL CTA --- */}
        <div className="mt-20 glass-panel max-w-5xl mx-auto rounded-[36px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left" id="spec-cases-banner">
          <div className="space-y-2 max-w-xl">
            <h4 className="font-display font-bold text-lg text-matte-black flex items-center gap-2">
              Looking for our NDA-Protected enterprise vaults?
              <ShieldCheck className="w-5 h-5 text-champagne-gold" />
            </h4>
            <p className="text-xs text-warm-grey leading-relaxed">
              We execute private systems for leading pharmaceutical companies, retail groups, and high-end brokerage houses. These cannot be listed publicly due to privacy covenants. Meet with us directly to review isolated mockups offline.
            </p>
          </div>
          <button 
            onClick={handleInquire}
            className="px-8 py-3.5 bg-matte-black hover:bg-charcoal text-white text-xs font-bold uppercase tracking-widest rounded-full shrink-0 border border-champagne-gold/20"
          >
            Access Vaults
          </button>
        </div>

      </div>
    </div>
  );
}
