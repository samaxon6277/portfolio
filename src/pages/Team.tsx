import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mail, Linkedin, Sparkles, SlidersHorizontal, Award, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_TEAM } from '../utils/defaultData';
import { DirectoryTeamMember, DepartmentType } from '../types';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS: { value: 'all' | DepartmentType; label: string }[] = [
  { value: 'all', label: 'All Specialists' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Development', label: 'Development' },
  { value: 'Design', label: 'Design' },
  { value: 'SEO', label: 'SEO & Growth' },
  { value: 'Sales', label: 'Strategy & Sales' },
  { value: 'Operations', label: 'Operations & SRE' },
  { value: 'HR', label: 'Talent & Culture' }
];

export default function Team() {
  const navigate = useNavigate();
  const [teamList, setTeamList] = useState<DirectoryTeamMember[]>(DEFAULT_TEAM);
  const [activeFilter, setActiveFilter] = useState<'all' | DepartmentType>('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_team_directory');
      if (stored) {
        setTeamList(JSON.parse(stored));
      } else {
        localStorage.setItem('samaxon_team_directory', JSON.stringify(DEFAULT_TEAM));
      }
    } catch (e) {
      console.warn('Failed to fetch team from storage, utilising defaults.');
    }
  }, []);

  // Filter and sort team members (only display members marked with Show status)
  const displayedTeam = teamList
    .filter(member => member.status !== 'Hide')
    .filter(member => activeFilter === 'all' || member.department === activeFilter)
    .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id="team-viewport">
      <SEO 
        title="Meet our Team of Builders & Systems Engineers | SamaXon"
        description="Our elite, multi-disciplinary team consists of handpicked systems architects, Figma design artists, automation developers, and technical localized SEO specialists."
        canonicalPath="/team"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Head Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-bold font-mono uppercase tracking-widest"
          >
            <Users className="w-3 h-3" />
            ENGINEERING REGISTRY
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-neutral-900 uppercase">
            MEET THE BUILDERS
          </h1>
          <p className="text-sm text-[#8A8178] leading-relaxed">
            A tight, highly responsive squad of systems architects, creative directors, and background engineers who don't negotiate with average visual speed.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-matte-black/5 pb-6">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.value}
              onClick={() => setActiveFilter(dept.value)}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer ${
                activeFilter === dept.value
                  ? 'bg-matte-black text-white border border-matte-black shadow-sm'
                  : 'bg-white text-[#8A8178] border border-neutral-200/60 hover:text-matte-black hover:border-matte-black/25'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Grid of Team Members */}
        {displayedTeam.length === 0 ? (
          <div className="text-center py-16 bg-white/40 border border-dashed border-[#D6B46A]/20 rounded-3xl">
            <p className="text-xs text-[#8A8178] font-mono">No specialists matched under this category currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {displayedTeam.map(member => (
                <motion.div
                  layout
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-[#D6B46A]/15 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Headshot area */}
                    <div className="relative group overflow-hidden bg-neutral-900 h-64 border-b border-[#D6B46A]/10">
                      <img 
                        src={member.photoUrl} 
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-[9px] font-mono uppercase bg-matte-black/85 text-white rounded-full font-bold border border-champagne-gold/25">
                          {member.department}
                        </span>
                      </div>
                    </div>

                    {/* Meta area */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-display font-medium text-base text-neutral-900 uppercase">
                            {member.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#BFA15A] font-mono font-bold uppercase tracking-tight">
                          <Award className="w-3.5 h-3.5" />
                          <span>{member.position}</span>
                          <span className="text-neutral-350 mx-1">•</span>
                          <span>{member.experience}</span>
                        </div>
                      </div>

                      {/* Skills listed */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.skills.map((skill, si) => (
                          <span 
                            key={si}
                            className="bg-[#FFFDF8] border border-neutral-200/50 text-[10px] px-2.5 py-0.5 rounded font-mono text-neutral-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer social connects */}
                  <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-[#FFFDF8]/40">
                    <span className="text-[10px] font-mono uppercase text-[#A89F91]">Direct Channels:</span>
                    <div className="flex items-center gap-3">
                      {member.socialLinks?.email && (
                        <a 
                          href={`mailto:${member.socialLinks.email}`}
                          className="text-neutral-400 hover:text-champagne-gold active:scale-95 transition-all"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {member.socialLinks?.linkedin && (
                        <a 
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-champagne-gold active:scale-95 transition-all"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Corporate bottom banner */}
        <div className="mt-16 bg-neutral-900 text-[#FFFDF8] border border-[#D6B46A]/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-champagne-gold/15 text-champagne-gold text-[8px] font-mono uppercase tracking-widest font-black">
              WE ARE HIRING
            </div>
            <h4 className="text-lg font-display uppercase tracking-wide">Want to build at pre-compiled speeds?</h4>
            <p className="text-xs text-[#A89F91]">
              We are constantly seeking elite builders, Figma craftsmen, and local search optimizers who hate bloated workflows and value pure compilation craft.
            </p>
          </div>
          <button 
            onClick={() => {
              navigate('/careers');
              window.scrollTo(0, 0);
            }}
            className="px-6 py-3 bg-[#FFFDF8] text-[#111111] hover:bg-champagne-gold font-bold uppercase tracking-widest text-[9px] rounded-xl flex items-center shrink-0 gap-1.5 transition-colors cursor-pointer"
          >
            Apply for Roles
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
