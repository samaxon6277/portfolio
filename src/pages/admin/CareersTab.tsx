import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Filter, Mail, Phone, Briefcase, Calendar, Check, X,
  ExternalLink, FileText, ChevronRight, MessageSquare, AlertCircle, Bookmark, Clipboard
} from 'lucide-react';
import { CareerApplication } from '../../types';

interface CareersTabProps {
  careers: CareerApplication[];
  onUpdateCareer: (updatedCareer: CareerApplication) => void;
  onDeleteCareer: (appId: string) => void;
}

export default function CareersTab({ careers, onUpdateCareer, onDeleteCareer }: CareersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeCareer, setActiveCareer] = useState<CareerApplication | null>(null);

  // Available filters
  const rolesList = ['All', 'Digital Growth Consultant', 'Senior Brand Identity Designer', 'Custom Systems & Automation Architect', 'Full Stack Developer'];
  const statusesList = [
    { value: 'All', label: 'All Candidates' },
    { value: 'submitted', label: 'New / Just Submitted' },
    { value: 'reviewing', label: 'Shortlisted / Pre-Review' },
    { value: 'interviewed', label: 'Interview Scheduled' },
    { value: 'accepted', label: 'Approved Specialist' },
    { value: 'declined', label: 'Rejected / Archived' }
  ];

  // Helper mappings
  const getInterviewNotes = (app: any) => app.interviewNotes || '';
  const getReviewedBy = (app: any) => app.reviewedBy || '';

  // Filter application dataset
  const filteredCareers = careers.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    
    const matchesRole = selectedRole === 'All' || app.roleInterestedIn === selectedRole;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Action helper triggers
  const handleUpdateStatus = (app: CareerApplication, status: any) => {
    onUpdateCareer({
      ...app,
      status
    });
  };

  // Status visual themes
  const statusLabels: Record<string, string> = {
    submitted: 'New',
    reviewing: 'Shortlisted',
    interviewed: 'Interview Scheduled',
    accepted: 'Approved',
    declined: 'Rejected'
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reviewing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'interviewed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'declined':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6" id="careers-tab-manager">
      
      {/* Tab Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Talent Acquisition Portal</span>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">Career Applications Manager</h2>
        </div>
        <div className="text-xs font-mono font-bold text-[#8A8178]">
          Active Consultant Submissions: <span className="text-[#111111] font-black">{careers.length}</span>
        </div>
      </div>

      {/* Query Filter Area */}
      <div className="bg-white border border-[#D6B46A]/15 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8A8178]">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search prospects by Name, Email, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all placeholder:text-[#8A8178]/70"
            />
          </div>

          {/* Role Interested In */}
          <div className="md:col-span-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all cursor-pointer"
            >
              <option value="All">All Job Roles</option>
              {rolesList.slice(1).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status Selection */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all cursor-pointer"
            >
              {statusesList.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main candidate catalog grid split with details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Candidates Listing Side */}
        <div className="lg:col-span-7 space-y-4">
          {filteredCareers.length === 0 ? (
            <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-12 text-center text-[#8A8178]">
              No candidate submissions found inside selected talent filter queries.
            </div>
          ) : (
            filteredCareers.map((app) => (
              <div 
                key={app.id} 
                onClick={() => setActiveCareer(app)}
                className={`bg-white border transition-all duration-300 rounded-2xl p-5 cursor-pointer shadow-sm relative group text-left ${
                  activeCareer?.id === app.id 
                    ? 'border-[#D6B46A] bg-[#FFFDF8]' 
                    : 'border-[#D6B46A]/12 hover:border-[#D6B46A]/45 hover:bg-[#FFFDF8]/20'
                }`}
              >
                {/* Active selection accent line */}
                {activeCareer?.id === app.id && (
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#D6B46A] rounded-l-2xl" />
                )}

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-display font-black text-sm text-[#111111] group-hover:text-[#BFA15A] transition-colors">{app.name}</h4>
                    <span className="text-[11px] font-mono font-bold text-[#8A8178] block mt-0.5">{app.roleInterestedIn}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded-full border ${getStatusStyle(app.status)}`}>
                    {statusLabels[app.status] || app.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#8A8178] font-medium border-t border-[#D6B46A]/10 pt-3.5">
                  <span>Current City: <strong className="text-[#111111]">{app.city}</strong></span>
                  <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                  <span>Posted: <strong className="text-[#111111]">{new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Candidate Diagnostics Details Panel */}
        <div className="lg:col-span-5 bg-white border border-[#D6B46A]/15 rounded-3xl shadow-sm overflow-hidden text-left">
          {activeCareer ? (
            <div id="career-details-panel">
              {/* Profile Card Header */}
              <div className="bg-[#111111] text-[#FFFDF8] p-6 border-b border-[#D6B46A]/25">
                <span className="text-[9px] font-mono text-[#D6B46A] uppercase tracking-widest font-black block">Specialist Dossier</span>
                <h3 className="font-display text-lg font-black tracking-tight mt-0.5">{activeCareer.name}</h3>
                <p className="text-xs text-white/70 mt-1">{activeCareer.roleInterestedIn} — ({activeCareer.city})</p>
                
                {/* Visual direct contact link buttons */}
                <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase">
                  <a 
                    href={`mailto:${activeCareer.email}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-[#FFFDF8] hover:text-[#D6B46A] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3 h-3" />
                    Mail
                  </a>
                  <a 
                    href={`tel:${activeCareer.phone}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-[#FFFDF8] hover:text-[#D6B46A] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3 h-3" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Dossier contents info */}
              <div className="p-6 space-y-6">
                
                {/* External Links Block */}
                <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl p-4 space-y-3">
                  <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-wider block font-black">Online Portals & Credentials</span>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {activeCareer.portfolioUrl ? (
                      <a 
                        href={activeCareer.portfolioUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#111111] hover:text-[#D6B46A] font-bold hover:underline flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Aesthetic Portfolio
                      </a>
                    ) : (
                      <span className="text-[#8A8178] italic">No Portfolio Link</span>
                    )}

                    {activeCareer.resumeUrl ? (
                      <a 
                        href={activeCareer.resumeUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#111111] hover:text-[#D6B46A] font-bold hover:underline flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Executive CV/Resume
                      </a>
                    ) : (
                      <span className="text-[#8A8178] italic">No CV Document</span>
                    )}
                  </div>
                </div>

                {/* Questionnaires responses */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A8178] block">Corporate Experience Details:</span>
                    <p className="text-xs text-[#111111] mt-1 p-3 bg-neutral-50 rounded-xl border border-neutral-100 leading-relaxed italic">
                      “{activeCareer.experience}”
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A8178] block">Reason for joining SamaXon Studio:</span>
                    <p className="text-xs text-[#111111] mt-1 p-3 bg-neutral-50 rounded-xl border border-neutral-100 leading-relaxed font-sans">
                      {activeCareer.whySamaXon}
                    </p>
                  </div>
                </div>

                {/* Interactive Decisions Controls Form */}
                <div className="border-t border-[#D6B46A]/15 pt-5 space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block">Aquisition Board Controls</span>
                  
                  {/* Status selection widget panel */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(activeCareer, 'reviewing')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        activeCareer.status === 'reviewing'
                          ? 'bg-amber-100 border-[#D6B46A]/50 text-amber-800'
                          : 'bg-[#FFFDF8] hover:bg-neutral-50 border-neutral-200 text-[#8A8178]'
                      }`}
                    >
                      Shortlist Candidate
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(activeCareer, 'interviewed')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        activeCareer.status === 'interviewed'
                          ? 'bg-purple-100 border-purple-300 text-purple-800'
                          : 'bg-[#FFFDF8] hover:bg-neutral-50 border-neutral-200 text-[#8A8178]'
                      }`}
                    >
                      Schedule Interview
                    </button>
                  </div>

                  {/* Approve or Reject absolute operations */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to officially APPROVE and recruit ${activeCareer.name}?`)) {
                          handleUpdateStatus(activeCareer, 'accepted');
                        }
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-md active:scale-95 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Specialist
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to DECLINE/REJECT application from ${activeCareer.name}?`)) {
                          handleUpdateStatus(activeCareer, 'declined');
                        }
                      }}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject / Decline
                    </button>
                  </div>

                  {/* Interview Notes text annotation log block */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8A8178] uppercase block">Recruitment Interviewer Evaluation Notes</label>
                    <textarea
                      value={getInterviewNotes(activeCareer)}
                      onChange={(e) => {
                        onUpdateCareer({
                          ...activeCareer,
                          ...{ interviewNotes: e.target.value, reviewedBy: 'Raj Patel (Super Admin)' }
                        });
                      }}
                      placeholder="Add technical comments on typography sensibilities, logic formulation speed, coding standards alignment, or final package terms..."
                      rows={3}
                      className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#D6B46A]/25 text-xs text-[#111111] rounded-xl outline-none placeholder:text-[#8A8178]/60"
                    />
                    {getReviewedBy(activeCareer) && (
                      <span className="text-[9px] font-mono block text-[#8A8178] text-right">
                        Last evaluation notes appended by: <strong>{getReviewedBy(activeCareer)}</strong>
                      </span>
                    )}
                  </div>

                  {/* Deletion actions trigger */}
                  <div className="bg-red-50/50 rounded-xl p-3 border border-red-100 flex items-center justify-between gap-3 text-xs text-red-700 mt-6">
                    <span>Destructive operation block</span>
                    <button
                      onClick={() => {
                        if (confirm(`Are you absolutely sure you want to permanently delete application of ${activeCareer.name}?`)) {
                          onDeleteCareer(activeCareer.id);
                          setActiveCareer(null);
                        }
                      }}
                      className="text-xs font-bold uppercase tracking-wider hover:underline text-red-700"
                    >
                      Delete application
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ) : (
            <div className="py-24 text-center px-8 flex flex-col items-center justify-center gap-3">
              <Users className="w-10 h-10 text-[#D6B46A]/40" />
              <div className="space-y-1">
                <h4 className="font-display font-medium text-xs uppercase tracking-wider text-[#111111]">Prospect Insight Viewer</h4>
                <p className="text-[11px] text-[#8A8178] max-w-xs leading-normal">
                  Select a candidate resume profile card from the list to preview their dossier, access LinkedIn portfolio anchors, and manage board steps.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
