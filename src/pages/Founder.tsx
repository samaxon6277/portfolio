import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, MessageSquare, Award, ArrowRight, AppWindow, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_FOUNDER } from '../utils/defaultData';
import { FounderDetails } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Founder() {
  const navigate = useNavigate();
  const [founder, setFounder] = useState<FounderDetails>(DEFAULT_FOUNDER);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_founder_details');
      if (stored) {
        setFounder(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse founder details, using defaults.');
    }
  }, []);

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id="founder-viewport">
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-bold font-mono uppercase tracking-widest"
          >
            <Crown className="w-3 h-3" />
            Leadership Profile
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-neutral-900 uppercase">
            Meet the Founder
          </h1>
          <p className="text-sm text-[#8A8178] leading-relaxed">
            The technical precision, philosophy, and dedication powering SamaXon’s 48-hour high-performance systems engineering.
          </p>
        </div>

        {/* Founder Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column Left: High-End Photo, Designation Card & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group overflow-hidden rounded-3xl border border-champagne-gold/20 shadow-xl bg-neutral-900">
              <img 
                src={founder.photoUrl} 
                alt={founder.name}
                referrerPolicy="no-referrer"
                className="w-full h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
              
              {/* Bottom Label card overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-matte-black/90 backdrop-blur-md rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Principal Systems Architect</span>
                <h3 className="text-xl font-display font-bold text-white uppercase">{founder.name}</h3>
                <p className="text-xs text-[#A89F91]">{founder.designation}</p>
              </div>
            </div>

            {/* Quick Experience / Achievement Chips */}
            <div className="bg-white border border-[#D6B46A]/15 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-[#111111] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-champagne-gold" />
                Proven Track Record
              </h4>
              <div className="space-y-3">
                {founder.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-[#8A8178]">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-champagne-gold shrink-0" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>

              {founder.socialLinks?.email && (
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[#8A8178]">Direct Channel:</span>
                  <a 
                    href={`mailto:${founder.socialLinks.email}`}
                    className="font-mono font-bold text-[#111111] hover:text-champagne-gold hover:underline"
                  >
                    {founder.socialLinks.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column Right: Biography & Brand Vision Story */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-champagne-gold" />
                <h2 className="text-2xl font-display font-medium text-neutral-900 uppercase tracking-wide">
                  The Story of SamaXon
                </h2>
              </div>
              
              {/* Main bio */}
              <p className="text-sm font-semibold text-neutral-800 leading-relaxed font-sans pr-4 border-l-2 border-champagne-gold pl-4">
                {founder.bio}
              </p>

              {/* Long Story paragraphs */}
              <div className="text-xs text-[#8A8178] leading-relaxed space-y-4 pr-2 font-sans">
                {founder.story.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-[#D6B46A]/15 rounded-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-black block">Core Mission</span>
                <h4 className="text-xs font-display font-bold text-[#111111] uppercase">High Performance focus</h4>
                <p className="text-[11px] text-[#8A8178] leading-relaxed">{founder.mission}</p>
              </div>

              <div className="p-6 bg-white border border-[#D6B46A]/15 rounded-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-black block">Core Vision</span>
                <h4 className="text-xs font-display font-bold text-[#111111] uppercase">Prestige & Speed Scalability</h4>
                <p className="text-[11px] text-[#8A8178] leading-relaxed">{founder.vision}</p>
              </div>
            </div>

            {/* Quote block: Personal Message */}
            <div className="p-8 bg-neutral-900 text-[#FFFDF8] border border-[#D6B46A]/20 rounded-3xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 p-8 text-neutral-800 pointer-events-none translate-x-4 -translate-y-4">
                <MessageSquare className="w-32 h-32 opacity-15 rotate-12" />
              </div>

              <div className="space-y-1 relative z-10">
                <span className="text-[9px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Personal Directive</span>
                <h4 className="text-sm font-display font-bold uppercase tracking-wide">A Message From {founder.name}</h4>
              </div>

              <p className="text-xs text-[#A89F91] italic leading-relaxed relative z-10 font-mono pr-12">
                "{founder.message}"
              </p>
            </div>

            {/* Action Section */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={() => {
                  navigate('/contact');
                  window.scrollTo(0, 0);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-matte-black hover:bg-[#1C1C1C] text-white font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#D6B46A]/20"
              >
                Inquire For A Consultation
                <ArrowRight className="w-3.5 h-3.5 text-champagne-gold" />
              </button>
              
              <button 
                onClick={() => {
                  navigate('/team');
                  window.scrollTo(0, 0);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-matte-black hover:bg-neutral-100 font-bold uppercase tracking-widest text-[10px] rounded-full border border-matte-black/15 transition-all text-center cursor-pointer"
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
