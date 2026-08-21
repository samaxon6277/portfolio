import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mail, Linkedin, Award, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_TEAM } from '../utils/defaultData';
import { DirectoryTeamMember, DepartmentType } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

  const displayedTeam = teamList
    .filter(member => member.status !== 'Hide')
    .filter(member => activeFilter === 'all' || member.department === activeFilter)
    .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

  return (
    <div className="pt-24 md:pt-32 pb-24 min-h-screen font-sans transition-colors duration-300 relative" id="team-viewport">
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-bold font-mono uppercase tracking-widest backdrop-blur-md ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
                : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ENGINEERING REGISTRY</span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            MEET THE BUILDERS
          </h1>
          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed">
            A tight, highly responsive squad of systems architects, creative directors, and background engineers who don't negotiate with average visual speed.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-black/5 dark:border-white/5 pb-6">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.value}
              onClick={() => setActiveFilter(dept.value)}
              className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-full transition-all cursor-pointer border ${
                activeFilter === dept.value
                  ? 'bg-[#D6B46A] text-[#0A0A0A] border-[#D6B46A] shadow-sm'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-[#8E8E93] hover:text-white'
                    : 'bg-black/5 border-black/10 text-[#6E6E73] hover:text-black'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Grid of Team Members */}
        {displayedTeam.length === 0 ? (
          <div className={`text-center py-16 border border-dashed rounded-3xl ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
          }`}>
            <p className="text-xs text-[#8E8E93] font-mono">No specialists matched under this category currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedTeam.map(member => (
                <motion.div
                  layout
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`rounded-3xl overflow-hidden border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Headshot area */}
                    <div className="relative group overflow-hidden bg-neutral-900 h-60 border-b border-black/5 dark:border-white/5">
                      <img 
                        src={member.photoUrl} 
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-[9px] font-mono uppercase bg-[#0A0A0A]/85 text-white rounded-full font-bold border border-white/10">
                          {member.department}
                        </span>
                      </div>
                    </div>

                    {/* Meta area */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-display font-bold text-base uppercase">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#D6B46A] font-mono font-bold uppercase tracking-tight">
                          <Award className="w-3.5 h-3.5" />
                          <span>{member.position}</span>
                          <span className="text-neutral-500 mx-1">•</span>
                          <span>{member.experience}</span>
                        </div>
                      </div>

                      {/* Skills listed */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.skills.map((skill, si) => (
                          <span 
                            key={si}
                            className={`text-[10px] px-2.5 py-0.5 rounded-md font-mono border ${
                              isDark ? 'bg-white/5 border-white/5 text-[#8E8E93]' : 'bg-black/5 border-black/5 text-[#6E6E73]'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer social connects */}
                  <div className="px-6 py-3.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#8E8E93]">Direct:</span>
                    <div className="flex items-center gap-3">
                      {member.socialLinks?.email && (
                        <a 
                          href={`mailto:${member.socialLinks.email}`}
                          className="text-[#8E8E93] hover:text-[#D6B46A] active:scale-95 transition-all"
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
                          className="text-[#8E8E93] hover:text-[#D6B46A] active:scale-95 transition-all"
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
        <div className={`mt-16 border p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-md'
        }`}>
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D6B46A]/10 text-[#D6B46A] text-[9px] font-mono uppercase tracking-widest font-bold">
              WE ARE HIRING
            </div>
            <h4 className="text-lg font-display font-bold uppercase tracking-wide">Want to build at pre-compiled speeds?</h4>
            <p className="text-xs text-[#8E8E93]">
              We are constantly seeking elite builders, Figma craftsmen, and local search optimizers who hate bloated workflows and value pure compilation craft.
            </p>
          </div>
          <button 
            onClick={() => {
              navigate('/careers');
              window.scrollTo(0, 0);
            }}
            className="px-6 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center shrink-0 gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>Apply for Roles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
