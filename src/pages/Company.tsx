import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building, ShieldCheck, Zap, Target, Cpu, Eye } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_COMPANY } from '../utils/defaultData';
import { CompanyDetails } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Company() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'shield': return <ShieldCheck className="w-5 h-5 text-[#D6B46A]" />;
      case 'zap': return <Zap className="w-5 h-5 text-[#D6B46A]" />;
      case 'target': return <Target className="w-5 h-5 text-[#D6B46A]" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-[#D6B46A]" />;
      default: return <Building className="w-5 h-5 text-[#D6B46A]" />;
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 min-h-screen font-sans transition-colors duration-300 relative" id="company-viewport">
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-bold font-mono uppercase tracking-widest backdrop-blur-md ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
                : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>STUDIO PROPOSITION</span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            WHO WE ARE
          </h1>
          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed">
            Unpacking the operational infrastructure, standard systems processes, and core values that keep SamaXon executing with surgical speeds and high visual authority.
          </p>
        </div>

        {/* Grid Overview Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-display font-bold uppercase tracking-wide">
              Elite Digital &amp; Systems Studio
            </h2>
            <p className="text-sm text-[#8E8E93] leading-relaxed">
              {company.overview}
            </p>
            
            {/* Mission & Vision Rows */}
            <div className="space-y-4 pt-2">
              <div className={`p-5 border rounded-2xl flex gap-4 ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-[#D6B46A]/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-[#D6B46A]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">Our Absolute Mission</h4>
                  <p className="text-xs text-[#8E8E93] leading-relaxed">{company.mission}</p>
                </div>
              </div>

              <div className={`p-5 border rounded-2xl flex gap-4 ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-[#D6B46A]/10 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-[#D6B46A]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">Our Future Vision</h4>
                  <p className="text-xs text-[#8E8E93] leading-relaxed">{company.vision}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical decorative grid column */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-7 rounded-3xl min-h-44 border flex flex-col justify-between ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">PERFORMANCE TARGETS</span>
                <div>
                  <h3 className="text-3xl font-display font-bold text-[#D6B46A]">&lt; 1.2s</h3>
                  <p className="text-xs text-[#8E8E93] mt-1">Average Page Load Speed across India</p>
                </div>
              </div>
              <div className={`p-7 rounded-3xl min-h-44 border flex flex-col justify-between ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">QUALITY CORE VITALS</span>
                <div>
                  <h3 className="text-3xl font-display font-bold">99%+</h3>
                  <p className="text-xs text-[#8E8E93] mt-1">Lighthouse Speed &amp; Performance Index</p>
                </div>
              </div>
              <div className={`p-7 rounded-3xl min-h-44 col-span-2 border flex flex-col justify-between ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[9px] font-mono uppercase text-[#8E8E93] tracking-widest font-bold">COMPANY STATURE</span>
                <div>
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider">Operational Integrity</h4>
                  <p className="text-xs text-[#8E8E93] leading-relaxed mt-1">
                    Registered office operations, professional development tracks, role-based safety structures, and zero reliance on outsourced third-party code libraries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center max-w-lg mx-auto mb-10 space-y-2">
            <h3 className="text-xl font-display font-bold uppercase">OUR OPERATING POLICIES</h3>
            <p className="text-xs text-[#8E8E93]">The rigid guidelines that keep our agency at peak reliability and visual supremacy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {company.coreValues.map((value, idx) => (
              <div key={idx} className={`p-6 rounded-3xl space-y-4 flex flex-col justify-between border ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D6B46A]/10 flex items-center justify-center">
                    {renderIcon(value.iconName)}
                  </div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-wide">{value.title}</h4>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed pt-3 border-t border-black/5 dark:border-white/5">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Working Process */}
        <div className="mb-20">
          <div className="text-center max-w-lg mx-auto mb-10 space-y-2">
            <h3 className="text-xl font-display font-bold uppercase">THE 5-STEP ENGINEERING PROCESS</h3>
            <p className="text-xs text-[#8E8E93]">How we take an abstract concept and deploy an enterprise ecosystem in under 48 hours.</p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {company.workingProcess.map((proc, index) => (
              <div key={index} className={`rounded-3xl p-6 border transition-all flex flex-col md:flex-row gap-5 relative overflow-hidden group ${
                isDark 
                  ? 'bg-[#121212] border-white/10 hover:border-[#D6B46A]/40' 
                  : 'bg-white border-black/10 hover:border-[#D6B46A]/50 shadow-sm'
              }`}>
                <div className="w-10 h-10 rounded-full border border-[#D6B46A]/30 bg-[#D6B46A]/10 flex items-center justify-center font-mono font-bold text-xs text-[#D6B46A] shrink-0">
                  {proc.step}
                </div>
                <div className="space-y-1 block max-w-2xl relative z-10">
                  <h4 className="font-display font-bold text-sm uppercase tracking-wide">{proc.title}</h4>
                  <p className="text-xs text-[#8E8E93] leading-relaxed">{proc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industries Served */}
        <div className={`p-8 md:p-10 rounded-3xl border ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-md'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">COMMERCIAL VERSATILITY</span>
              <h3 className="text-2xl font-display font-bold uppercase">INDUSTRIES WE SERVE</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                By specializing in niche industries, we deploy pre-configured visual logic, industry estimators, and compliance schemas that avoid structural trial-and-error.
              </p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {company.industriesServed.map((ind, ii) => (
                <div key={ii} className={`flex gap-2.5 items-center p-3 border rounded-xl ${
                  isDark ? 'bg-white/5 border-white/5 text-neutral-200' : 'bg-black/5 border-black/5 text-neutral-800'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
                  <span className="font-medium">{ind}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Direct CTA */}
        <div className="mt-14 text-center">
          <button 
            onClick={() => {
              navigate('/contact');
              window.scrollTo(0, 0);
            }}
            className="px-8 py-3.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-full inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Start An Architectural Audit Now</span>
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
