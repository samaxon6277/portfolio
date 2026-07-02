import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileDown, Sparkles, TrendingUp, ThumbsUp, ArrowRight, LayoutGrid, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_CASE_STUDIES } from '../utils/defaultData';
import { CaseStudy } from '../types';
import { useNavigate } from 'react-router-dom';

export default function CaseStudies() {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<CaseStudy[]>(DEFAULT_CASE_STUDIES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_case_studies');
      if (stored) {
        setStudies(JSON.parse(stored));
      } else {
        localStorage.setItem('samaxon_case_studies', JSON.stringify(DEFAULT_CASE_STUDIES));
      }
    } catch (e) {
      console.warn('Failed to parse case studies.');
    }
  }, []);

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id="casestudies-viewport">
      <SEO 
        title="Client Case Studies & Commercial Success Stories | SamaXon"
        description="Explore how SamaXon engineers digital luxury platforms and custom pipeline automations resulting in massive direct reservation growth and commission savings."
        canonicalPath="/case-studies"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-bold font-mono uppercase tracking-widest"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Empirical Results
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-neutral-900 uppercase">
            CLIENT SUCCESS STORIES
          </h1>
          <p className="text-sm text-[#8A8178] leading-relaxed">
            Real architectures. Actual business numbers. Compare direct-checkout increases, performance score gains, and commission savings secured by our clients.
          </p>
        </div>

        {/* Case Studies Display Stack */}
        <div className="space-y-16">
          {studies.map((study, idx) => (
            <div 
              key={study.id} 
              className="bg-white border border-[#D6B46A]/15 rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row relative"
            >
              
              {/* Image and Industry Badge Column */}
              <div className="lg:w-1/2 relative bg-neutral-900 min-h-[350px]">
                <img 
                  src={study.screenshotUrl} 
                  alt={study.clientName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-[9px] font-mono bg-[#111111]/90 text-white border border-champagne-gold/20 font-bold uppercase tracking-wider">
                    {study.industry}
                  </span>
                </div>
              </div>

              {/* Empirical Text Content Column */}
              <div className="lg:w-1/2 p-8 lg:p-12 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#BFA15A] font-bold block">Enterprise Implementation</span>
                    <h3 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">
                      {study.clientName}
                    </h3>
                  </div>

                  {/* Before / After block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-1">
                      <span className="text-[9px] font-mono font-bold text-rose-800 uppercase block">Before implementation</span>
                      <p className="text-[#8A8178] leading-relaxed">{study.beforeState}</p>
                    </div>

                    <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-1">
                      <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase block">After SamaXon Build</span>
                      <p className="text-neutral-800 leading-relaxed">{study.afterState}</p>
                    </div>
                  </div>

                  {/* Operational Metrics list */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#111111]">Key Success Parameters:</h4>
                    <div className="space-y-2">
                      {study.results.map((res, ri) => (
                        <div key={ri} className="flex gap-2.5 items-start text-xs text-[#111111] font-semibold">
                          <CheckCircle className="w-4 h-4 text-[#BFA15A] shrink-0 mt-0.5" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial quotation */}
                <div className="pt-6 border-t border-neutral-100 space-y-4">
                  <p className="text-[11px] text-neutral-500 italic leading-relaxed">
                    "{study.testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {study.testimonial.photoUrl && (
                      <img 
                        src={study.testimonial.photoUrl} 
                        alt="Author Quote"
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-champagne-gold/25"
                      />
                    )}
                    <div className="text-[10px]">
                      <span className="font-bold text-neutral-900 block uppercase font-mono tracking-tight">{study.testimonial.author}</span>
                      <span className="text-[#8A8178] block font-mono">{study.testimonial.role}, {study.clientName}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Dynamic bottom action block */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-xs text-[#8A8178] font-mono">Want to map out custom-compiled results for your specific business sector?</p>
          <button 
            onClick={() => {
              navigate('/contact');
              window.scrollTo(0, 0);
            }}
            className="px-8 py-4 bg-matte-black hover:bg-[#1C1C1C] text-white font-bold uppercase tracking-widest text-[10px] rounded-full inline-flex items-center gap-2 transition-all cursor-pointer border border-[#D6B46A]/20"
          >
            Inquire For Free Analysis
            <ArrowRight className="w-3.5 h-3.5 text-champagne-gold" />
          </button>
        </div>

      </div>
    </div>
  );
}
