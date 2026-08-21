import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, MessageSquare, Award, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_FOUNDER } from '../utils/defaultData';
import { FounderDetails } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Founder() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [founder, setFounder] = useState<FounderDetails>(DEFAULT_FOUNDER);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_founder_details');
      if (stored) {
        setFounder(JSON.parse(stored));
      } else {
        localStorage.setItem('samaxon_founder_details', JSON.stringify(DEFAULT_FOUNDER));
      }
    } catch (e) {
      console.warn('Failed to parse founder details, using defaults.');
    }
  }, []);

  return (
    <div className="pt-24 md:pt-32 pb-24 min-h-screen font-sans transition-colors duration-300 relative" id="founder-viewport">
      <SEO 
        title={`${founder.name} | ${founder.designation} | SamaXon`}
        description={founder.bio}
        canonicalPath="/founder"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-bold font-mono uppercase tracking-widest backdrop-blur-md ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
                : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Leadership Profile</span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            Meet the Founder
          </h1>
          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed">
            The technical precision, philosophy, and dedication powering SamaXon’s 48-hour high-performance systems engineering.
          </p>
        </div>

        {/* Founder Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Column Left: High-End Photo, Designation Card & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`relative group overflow-hidden rounded-3xl border transition-all ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-neutral-900 border-black/10 shadow-lg'
            }`}>
              <img 
                src={founder.photoUrl} 
                alt={founder.name}
                referrerPolicy="no-referrer"
                className="w-full h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
              
              {/* Bottom Label card overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#0A0A0A]/90 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">Principal Systems Architect</span>
                <h3 className="text-xl font-display font-bold text-white uppercase">{founder.name}</h3>
                <p className="text-xs text-[#8E8E93]">{founder.designation}</p>
              </div>
            </div>

            {/* Quick Experience / Achievement Chips */}
            <div className={`p-6 rounded-3xl space-y-4 border ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D6B46A]" />
                <span>Proven Track Record</span>
              </h4>
              <div className="space-y-2.5">
                {founder.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-[#8E8E93]">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[#D6B46A] shrink-0" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>

              {founder.socialLinks?.email && (
                <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93]">Direct Channel:</span>
                  <a 
                    href={`mailto:${founder.socialLinks.email}`}
                    className="font-mono font-bold text-[#D6B46A] hover:underline"
                  >
                    {founder.socialLinks.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column Right: Biography & Brand Vision Story */}
          <div className="lg:col-span-7 space-y-7">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-wide">
                  The Story of SamaXon
                </h2>
              </div>
              
              {/* Main bio */}
              <p className="text-sm font-medium leading-relaxed font-sans pr-4 border-l-2 border-[#D6B46A] pl-4 text-neutral-800 dark:text-neutral-200">
                {founder.bio}
              </p>

              {/* Long Story paragraphs */}
              <div className="text-xs text-[#8E8E93] leading-relaxed space-y-3 pr-2 font-sans">
                {founder.story.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl space-y-2 border ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">Core Mission</span>
                <h4 className="text-xs font-display font-bold uppercase">High Performance focus</h4>
                <p className="text-xs text-[#8E8E93] leading-relaxed">{founder.mission}</p>
              </div>

              <div className={`p-6 rounded-3xl space-y-2 border ${
                isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">Core Vision</span>
                <h4 className="text-xs font-display font-bold uppercase">Prestige &amp; Speed Scalability</h4>
                <p className="text-xs text-[#8E8E93] leading-relaxed">{founder.vision}</p>
              </div>
            </div>

            {/* Quote block: Personal Message */}
            <div className={`p-7 rounded-3xl relative overflow-hidden space-y-3 border ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className="absolute top-0 right-0 p-8 text-neutral-500/10 pointer-events-none translate-x-4 -translate-y-4">
                <MessageSquare className="w-28 h-28 opacity-15 rotate-12" />
              </div>

              <div className="space-y-0.5 relative z-10">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">Personal Directive</span>
                <h4 className="text-sm font-display font-bold uppercase tracking-wide">A Message From {founder.name}</h4>
              </div>

              <p className="text-xs text-[#8E8E93] italic leading-relaxed relative z-10 font-mono pr-8">
                "{founder.message}"
              </p>
            </div>

            {/* Action Section */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
              <button 
                onClick={() => {
                  navigate('/contact');
                  window.scrollTo(0, 0);
                }}
                className="w-full sm:w-auto px-7 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Inquire For A Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              <button 
                onClick={() => {
                  navigate('/team');
                  window.scrollTo(0, 0);
                }}
                className={`w-full sm:w-auto px-7 py-3 font-bold uppercase tracking-wider text-xs rounded-full border transition-all text-center cursor-pointer ${
                  isDark 
                    ? 'border-white/15 text-white hover:bg-white/5' 
                    : 'border-black/15 text-neutral-900 hover:bg-black/5'
                }`}
              >
                Explore Team Directory
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
