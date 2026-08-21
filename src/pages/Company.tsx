import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building, ShieldCheck, Zap, Target, Cpu, Eye, BookOpen, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_COMPANY } from '../utils/defaultData';
import { CompanyDetails } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Company() {
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyDetails>(DEFAULT_COMPANY);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_company_details');
      if (stored) {
        setCompany(JSON.parse(stored));
      } else {
        localStorage.setItem('samaxon_company_details', JSON.stringify(DEFAULT_COMPANY));
      }
    } catch (e) {
      console.warn('Failed to parse company details, using defaults.');
    }
  }, []);

  // Helper to map icon names to icons dynamically
  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'shield': return <ShieldCheck className="w-5 h-5 text-champagne-gold" />;
      case 'zap': return <Zap className="w-5 h-5 text-champagne-gold" />;
      case 'target': return <Target className="w-5 h-5 text-champagne-gold" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-champagne-gold" />;
      default: return <Building className="w-5 h-5 text-champagne-gold" />;
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id="company-viewport">
      <SEO 
        title="About SamaXon | Real Company, Structure & Core Processes"
        description="SamaXon is an elite Technology Studio based in Gurugram, India. We engineer bespoke web platforms and background automations based on our rigid 5-step compilation process."
        canonicalPath="/company"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-bold font-mono uppercase tracking-widest"
          >
            <Building className="w-3 h-3" />
            STUDIO PROPOSITION
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-neutral-900 uppercase">
            WHO WE ARE
          </h1>
          <p className="text-sm text-[#8A8178] leading-relaxed">
            Unpacking the operational infrastructure, standard systems processes, and core values that keep SamaXon executing with surgical speeds and high visual authority.
          </p>
        </div>

        {/* Grid Overview Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-wide">
              Elite Digital & Systems Studio
            </h2>
            <p className="text-sm text-[#8A8178] leading-relaxed">
              {company.overview}
            </p>
            
            {/* Mission & Vision Rows */}
            <div className="space-y-4 pt-2">
              <div className="p-5 bg-white border border-[#D6B46A]/15 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-champagne-gold/15 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-champagne-gold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-black">Our Absolute Mission</h4>
                  <p className="text-[11px] text-[#8A8178] leading-normal">{company.mission}</p>
                </div>
              </div>

              <div className="p-5 bg-white border border-[#D6B46A]/15 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-champagne-gold/15 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-champagne-gold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#BFA15A] font-black">Our Future Vision</h4>
                  <p className="text-[11px] text-[#8A8178] leading-normal">{company.vision}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical decorative grid column */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900 text-white p-8 rounded-3xl min-h-48 border border-[#D6B46A]/20 flex flex-col justify-between">
                <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest">PERFORMANCE TARGETS</span>
                <div>
                  <h3 className="text-3xl font-display font-black text-white">&lt; 1.2s</h3>
                  <p className="text-[10px] text-neutral-400 mt-1">Average Page Load Speed across India</p>
                </div>
              </div>
              <div className="bg-white border border-[#D6B46A]/15 p-8 rounded-3xl min-h-48 flex flex-col justify-between">
                <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-widest">QUALITY CORE VITALS</span>
                <div>
                  <h3 className="text-3xl font-display font-black text-neutral-900">99%+</h3>
                  <p className="text-[10px] text-neutral-500 mt-1">Lighthouse Speed & Performance Index</p>
                </div>
              </div>
              <div className="bg-[#FFFDF8] border border-neutral-200/60 p-8 rounded-3xl min-h-48 col-span-2 flex flex-col justify-between">
                <span className="text-[9px] font-mono uppercase text-neutral-400 tracking-widest">COMPANY STATURE</span>
                <div>
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-neutral-800">Operational Integrity</h4>
                  <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                    Registered office operations, professional development tracks, role-based safety structures, and zero reliance on outsourced third-party code libraries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center max-w-lg mx-auto mb-12 space-y-2">
            <h3 className="text-xl font-display font-bold text-neutral-900 uppercase">OUR OPERATING POLICIES</h3>
            <p className="text-xs text-[#8A8178]">The rigid guidelines that keep our agency at peak reliability and visual supremacy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {company.coreValues.map((value, idx) => (
              <div key={idx} className="bg-white border border-[#D6B46A]/15 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-champagne-gold/10 flex items-center justify-center">
                    {renderIcon(value.iconName)}
                  </div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-wide text-neutral-900">{value.title}</h4>
                </div>
                <p className="text-[11px] text-[#8A8178] leading-relaxed pt-2 border-t border-neutral-100">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Working Process */}
        <div className="mb-20">
          <div className="text-center max-w-lg mx-auto mb-12 space-y-2">
            <h3 className="text-xl font-display font-bold text-neutral-900 uppercase">THE 5-STEP ENGINEERING PROCESS</h3>
            <p className="text-xs text-[#8A8178]">How we take an abstract concept and deploy an enterprise ecosystem in under 48 hours.</p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {company.workingProcess.map((proc, index) => (
              <div key={index} className="bg-white border border-neutral-200/50 hover:border-champagne-gold/35 rounded-3xl p-6 transition-colors flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 font-display font-black text-8xl text-neutral-100/50 translate-x-4 pointer-events-none group-hover:text-champagne-gold/5 transition-colors">
                  {proc.step}
                </div>
                <div className="w-12 h-12 rounded-full border border-champagne-gold/30 bg-champagne-gold/10 flex items-center justify-center font-mono font-bold text-[11px] text-champagne-gold shrink-0">
                  {proc.step}
                </div>
                <div className="space-y-1 block max-w-2xl relative z-10">
                  <h4 className="font-display font-bold text-sm uppercase tracking-wide text-neutral-900">{proc.title}</h4>
                  <p className="text-[11px] text-[#8A8178] leading-relaxed pr-8">{proc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industries Served */}
        <div className="bg-neutral-900 text-white p-10 rounded-3xl border border-[#D6B46A]/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[9px] font-mono uppercase tracking-widest text-champagne-gold font-bold">COMMERCIAL VERSATILITY</span>
              <h3 className="text-2xl font-display font-bold uppercase tracking-normal">INDUSTRIES WE SERVE</h3>
              <p className="text-xs text-[#A89F91] leading-relaxed">
                By specializing in niche industries, we deploy pre-configured visual logic, industry estimators, and compliance schemas that avoid structural trial-and-error.
              </p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {company.industriesServed.map((ind, ii) => (
                <div key={ii} className="flex gap-2.5 items-center p-3 bg-white/5 border border-[#D6B46A]/10 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold" />
                  <span className="text-neutral-200 font-medium">{ind}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Direct CTA */}
        <div className="mt-16 text-center">
          <button 
            onClick={() => {
              navigate('/contact');
              window.scrollTo(0, 0);
            }}
            className="px-8 py-4 bg-matte-black hover:bg-[#1C1C1C] text-white font-bold uppercase tracking-widest text-[10px] rounded-full inline-flex items-center gap-2 transition-colors cursor-pointer border border-[#D6B46A]/20"
          >
            Start An Architectural Audit Now
            <Zap className="w-3.5 h-3.5 text-champagne-gold" />
          </button>
        </div>

      </div>
    </div>
  );
}
