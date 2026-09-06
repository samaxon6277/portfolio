import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Filter, Mail, Phone, Briefcase, Calendar, Check, X,
  ExternalLink, FileText, ChevronRight, MessageSquare, AlertCircle, Bookmark, Clipboard,
  Download, Award, Sparkles, User, HelpCircle, GraduationCap, Clock, CheckCircle2, MinusCircle, Info,
  Code2
} from 'lucide-react';
import { JobApplication } from '../../types';
import CustomSelect from '../../components/CustomSelect';
import { useCustomUi } from '../../context/CustomUiContext';

interface CareersTabProps {
  jobApplications: JobApplication[];
  onUpdateJobApplication: (updatedApp: JobApplication) => void;
  onDeleteJobApplication: (appId: string) => void;
}

export default function CareersTab({ 
  jobApplications = [], 
  onUpdateJobApplication, 
  onDeleteJobApplication 
}: CareersTabProps) {
  const { showConfirm, showToast } = useCustomUi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeApp, setActiveApp] = useState<JobApplication | null>(null);

  // Positions list
  const positionsList = [
    'All', 
    'Digital Growth Consultant'
  ];

  // Statuses list
  const statusesList = [
    { value: 'All', label: 'All Statuses' },
    { value: 'New', label: 'New / Unreviewed' },
    { value: 'Shortlisted', label: 'Shortlisted' },
    { value: 'Interview Scheduled', label: 'Interview Scheduled' },
    { value: 'Hired', label: 'Hired' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  // Compute metrics for dashboard cards
  const totalApps = jobApplications.length;
  const newApps = jobApplications.filter(a => a.status === 'New').length;
  const shortlistedApps = jobApplications.filter(a => a.status === 'Shortlisted').length;
  const interviewScheduledApps = jobApplications.filter(a => a.status === 'Interview Scheduled').length;
  const hiredApps = jobApplications.filter(a => a.status === 'Hired').length;
  const rejectedApps = jobApplications.filter(a => a.status === 'Rejected').length;

  const getCandidateWhatsAppLink = (whatsappOrPhone: string, candidateName: string, position: string) => {
    const cleanPhone = (whatsappOrPhone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi ${candidateName}, this is the SamaXon Talent Acquisition Team regarding your application for the ${position || 'role'} position. Are you available for a preliminary conversation?`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getCandidateInterviewEmailLink = (email: string, candidateName: string, position: string) => {
    const subject = encodeURIComponent(`Interview Invitation: ${position || 'Role'} at SamaXon`);
    const body = encodeURIComponent(`Dear ${candidateName},\n\nThank you for applying to SamaXon Digital Solutions. We were impressed by your background and would like to invite you for an interview.\n\nPlease let us know your availability over the coming days.\n\nBest regards,\nSamaXon Talent Acquisition Team\ncareers@samaxon.site`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // Filter application dataset
  const filteredApplications = jobApplications.filter(app => {
    const nameStr = app.full_name || '';
    const cityStr = app.city || '';
    const phoneStr = app.phone || '';
    const positionStr = app.position || '';
    const statusStr = app.status || 'New';

    const matchesSearch = 
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cityStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneStr.includes(searchTerm);
    
    const matchesPosition = selectedPosition === 'All' || positionStr === selectedPosition;
    const matchesStatus = selectedStatus === 'All' || statusStr === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  // Action status helpers
  const handleUpdateStatus = (app: JobApplication, nextStatus: JobApplication['status']) => {
    onUpdateJobApplication({
      ...app,
      status: nextStatus
    });
    // Sync the local selected display item
    if (activeApp && activeApp.id === app.id) {
      setActiveApp({ ...app, status: nextStatus });
    }
  };

  // Status color helpers
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Interview Scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  // CSV Generator function
  const exportToCSV = () => {
    if (filteredApplications.length === 0) return;
    
    const headers = [
      'ID', 'Full Name', 'Gender', 'Age', 'City', 'Phone', 'WhatsApp', 'Email', 
      'Education', 'Experience', 'Languages', 'Position', 'Expected Salary', 
      'Why Hire', 'Voice Sample Link', 'Resume URL', 'Status', 'Created At'
    ];
    
    const rows = filteredApplications.map(app => [
      app.id,
      `"${(app.full_name || '').replace(/"/g, '""')}"`,
      app.gender || 'Female',
      app.age || '',
      `"${(app.city || '').replace(/"/g, '""')}"`,
      `"${app.phone || ''}"`,
      `"${app.whatsapp || ''}"`,
      app.email || '',
      `"${(app.education || '').replace(/"/g, '""')}"`,
      `"${(app.experience || '').replace(/"/g, '""')}"`,
      `"${(app.languages || '').replace(/"/g, '""')}"`,
      `"${(app.position || '').replace(/"/g, '""')}"`,
      `"${(app.expected_salary || '').replace(/"/g, '""')}"`,
      `"${(app.why_hire || '').replace(/"/g, '""')}"`,
      app.voice_sample_link || '',
      app.resume_url || '',
      app.status || 'New',
      app.created_at || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `samaxon_job_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Candidates exported to CSV', 'success');
  };

  const exportToJSON = () => {
    if (filteredApplications.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredApplications, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `samaxon_job_applications_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Candidates exported to JSON', 'success');
  };

  return (
    <div className="space-y-6 text-left" id="careers-tab-manager">
      
      {/* 1. Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Talent Acquisition Portals</span>
          <h2 className="font-display text-2xl font-black text-matte-black tracking-tight mt-0.5">Job Applications</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            disabled={filteredApplications.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-all text-xs font-mono uppercase font-bold tracking-wider rounded-xl cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportToJSON}
            disabled={filteredApplications.length === 0}
            className="px-4 py-2 bg-[#111111] text-[#D6B46A] hover:bg-[#1a1a1a] border border-[#D6B46A]/30 disabled:opacity-40 transition-all text-xs font-mono uppercase font-bold tracking-wider rounded-xl cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Code2 className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* 2. Interactive Stage Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'All', label: 'All Applicants', count: totalApps, color: 'border-[#D6B46A]/30 text-[#111111]' },
          { id: 'New', label: 'New / Unreviewed', count: newApps, color: 'border-blue-300 text-blue-800' },
          { id: 'Shortlisted', label: 'Shortlisted', count: shortlistedApps, color: 'border-amber-300 text-amber-800' },
          { id: 'Interview Scheduled', label: 'Interview Scheduled', count: interviewScheduledApps, color: 'border-purple-300 text-purple-800' },
          { id: 'Hired', label: 'Hired Specialists', count: hiredApps, color: 'border-emerald-300 text-emerald-800' },
          { id: 'Rejected', label: 'Archived / Rejected', count: rejectedApps, color: 'border-rose-300 text-rose-800' },
        ].map(stage => {
          const isActive = selectedStatus === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStatus(stage.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                isActive 
                  ? 'bg-[#111111] text-[#D6B46A] border-[#111111] shadow-sm' 
                  : `bg-white hover:bg-neutral-50 ${stage.color}`
              }`}
            >
              <span>{stage.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-[#D6B46A] text-[#111111] font-black' : 'bg-neutral-100 text-neutral-700'
              }`}>
                {stage.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search and Filters Row */}
      <div className="bg-white border border-[#D6B46A]/15 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div className="md:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8A8178]">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search prospects by Name, Phone, City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/15 focus:border-[#D6B46A] text-xs font-semibold text-matte-black rounded-xl outline-none transition-all placeholder:text-[#8A8178]/70"
            />
          </div>

          <div className="md:col-span-3">
            <CustomSelect
              value={selectedPosition}
              onChange={setSelectedPosition}
              options={[
                { value: 'All', label: 'All Positions' },
                ...positionsList.slice(1).map(role => ({ value: role, label: role }))
              ]}
            />
          </div>

          <div className="md:col-span-3">
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusesList}
            />
          </div>

        </div>

        <div className="text-[11px] font-mono font-bold text-[#8A8178] flex items-center justify-between">
          <span>Active filter query matches: {filteredApplications.length} candidates listed</span>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedPosition('All');
              setSelectedStatus('All');
            }} 
            className="text-[#BFA15A] hover:text-[#111111] transition-colors uppercase tracking-wider cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* 4. Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Candidates Listing (Left) */}
        <div className="lg:col-span-6 space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-12 text-center text-[#8A8178] font-medium text-xs">
              No matching job applications found.
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div 
                key={app.id} 
                onClick={() => setActiveApp(app)}
                className={`bg-white border transition-all duration-300 rounded-2xl p-5 cursor-pointer shadow-sm relative group text-left ${
                  activeApp?.id === app.id 
                    ? 'border-champagne-gold bg-[#FFFDF8]' 
                    : 'border-champagne-gold/10 hover:border-champagne-gold/45 hover:bg-[#FFFDF8]/20'
                }`}
              >
                {activeApp?.id === app.id && (
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#D6B46A] rounded-l-2xl" />
                )}

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-display font-black text-sm text-matte-black group-hover:text-[#BFA15A] transition-colors">
                      {app.full_name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-[#8A8178] block mt-0.5">
                      {app.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded-full border ${getStatusStyle(app.status)}`}>
                      {app.status || 'New'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2 text-[10px] text-warm-grey font-medium border-t border-[#D6B46A]/10 pt-3.5">
                  <div className="flex items-center gap-x-3">
                    <span>City: <strong className="text-matte-black">{app.city}</strong></span>
                    <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>Age: <strong className="text-matte-black">{app.age}</strong></span>
                    <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>{new Date(app.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>

                  {/* Direct Contact triggers right on the card */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {(app.whatsapp || app.phone) && (
                      <a
                        href={getCandidateWhatsAppLink(app.whatsapp || app.phone, app.full_name, app.position)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-all"
                        title="Direct WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </a>
                    )}
                    {app.email && (
                      <a
                        href={getCandidateInterviewEmailLink(app.email, app.full_name, app.position)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-all"
                        title="Send Interview Invitation"
                      >
                        <Mail className="w-3 h-3" />
                      </a>
                    )}
                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-all"
                        title="View Resume PDF"
                      >
                        <FileText className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Panel (Right) */}
        <div className="lg:col-span-6 bg-white border border-[#D6B46A]/15 rounded-3xl shadow-sm overflow-hidden text-left">
          {activeApp ? (
            <div id="jobapp-details-panel">
              {/* Card Header */}
              <div className="bg-[#111111] text-[#FFFDF8] p-6 border-b border-[#D6B46A]/25">
                <span className="text-[9px] font-mono text-[#D6B46A] uppercase tracking-widest font-black block">Applicant Dossier</span>
                <h3 className="font-display text-lg font-black tracking-tight mt-0.5">{activeApp.full_name}</h3>
                <p className="text-xs text-white/70 mt-1">{activeApp.position} — {activeApp.city}</p>
                
                {/* Contact triggers */}
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase font-bold">
                  <a 
                    href={getCandidateInterviewEmailLink(activeApp.email, activeApp.full_name, activeApp.position)}
                    className="px-3.5 py-2 bg-[#D6B46A] hover:bg-[#c4a157] text-[#111111] rounded-lg transition-colors flex items-center gap-1.5 font-black shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Invite for Interview
                  </a>
                  <a 
                    href={getCandidateWhatsAppLink(activeApp?.whatsapp || activeApp?.phone, activeApp.full_name, activeApp.position)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-600/35 hover:bg-emerald-600 border border-emerald-500/40 text-[#FFFDF8] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                    WhatsApp
                  </a>
                  <a 
                    href={`tel:${activeApp.phone}`}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[#FFFDF8] hover:text-[#D6B46A] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-champagne-gold" />
                    Call Phone
                  </a>
                </div>
              </div>

              {/* Questionnaire details */}
              <div className="p-6 space-y-6">
                
                {/* Resume block */}
                <div className="p-4 bg-champagne-gold/5 border border-champagne-gold/15 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-champagne-gold/10 flex items-center justify-center text-[#BFA15A]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-warm-grey">Candidate Resume</span>
                      <p className="text-xs font-bold text-matte-black">Uploaded Curriculum Vitae (PDF)</p>
                    </div>
                  </div>
                  {activeApp.resume_url ? (
                    <a 
                      href={activeApp.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-matte-black hover:bg-charcoal text-white hover:text-champagne-gold text-[10px] font-mono font-bold tracking-wider uppercase rounded-xl border border-champagne-gold/20 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View PDF
                    </a>
                  ) : (
                    <span className="text-xs text-rose-600 font-mono font-bold">No Resume Found</span>
                  )}
                </div>

                {/* Candidate stats list grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-[9px] font-mono text-warm-grey block uppercase">Education Level</span>
                    <strong className="text-matte-black font-semibold">{activeApp.education}</strong>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-[9px] font-mono text-warm-grey block uppercase">Languages Known</span>
                    <strong className="text-matte-black font-semibold">{activeApp.languages}</strong>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-[9px] font-mono text-warm-grey block uppercase">Age & Gender</span>
                    <strong className="text-matte-black font-semibold">{activeApp.gender} ({activeApp.age} years)</strong>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-[9px] font-mono text-warm-grey block uppercase">Expected Salary</span>
                    <strong className="text-matte-black font-semibold text-emerald-800">{activeApp.expected_salary}</strong>
                  </div>
                </div>

                {/* Voice sample */}
                {activeApp.voice_sample_link && (
                  <div className="p-3.5 bg-purple-50/40 border border-purple-100 rounded-xl">
                    <span className="text-[9px] font-mono text-purple-700 block uppercase font-bold tracking-wide">Audio Voice Sample Link</span>
                    <a 
                      href={activeApp.voice_sample_link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-purple-900 underline hover:text-purple-700 mt-1 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      Listen Candidate Audition URL
                    </a>
                  </div>
                )}

                {/* Text responses */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A8178] block">Experience Breakdown:</span>
                    <p className="text-xs text-[#111111] mt-1 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 leading-relaxed italic">
                      “{activeApp.experience}”
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A8178] block">Why should SamaXon hire this candidate:</span>
                    <p className="text-xs text-[#111111] mt-1 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 leading-relaxed font-sans">
                      {activeApp.why_hire}
                    </p>
                  </div>
                </div>

                {/* Interactive Decision buttons */}
                <div className="border-t border-[#D6B46A]/15 pt-5 space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block">Aquisition Board Controls</span>
                  
                  {/* Status selection strip */}
                  <div className="flex flex-wrap gap-2">
                    {['New', 'Shortlisted', 'Interview Scheduled'].map((statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() => handleUpdateStatus(activeApp, statusOption as any)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                          activeApp.status === statusOption
                            ? 'bg-[#111111] border-[#111111] text-[#D6B46A]'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-[#8A8178]'
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>

                  {/* Hire or Reject absolute values */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        showConfirm({
                          title: 'Hire Candidate?',
                          message: `Confirm you want to hire applicant "${activeApp.full_name}"? This action flags them as a selected onboarding specialist.`,
                          confirmText: 'Confirm Hire',
                          onConfirm: () => {
                            handleUpdateStatus(activeApp, 'Hired');
                            showToast(`Applicant ${activeApp.full_name} is officially hired!`, 'success');
                          }
                        });
                      }}
                      className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Officially Hire
                    </button>

                    <button
                      onClick={() => {
                        showConfirm({
                          title: 'Reject Applications?',
                          message: `Confirm you want to reject applicant "${activeApp.full_name}"? This will move them to the Rejected stage.`,
                          confirmText: 'Reject Prospect',
                          onConfirm: () => {
                            handleUpdateStatus(activeApp, 'Rejected');
                            showToast(`Applicant ${activeApp.full_name} marked as rejected.`, 'info');
                          }
                        });
                      }}
                      className="px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 border-rose-400" />
                      Mark Rejected
                    </button>
                  </div>

                  {/* Deletion action */}
                  <div className="bg-red-50/40 rounded-xl p-3 border border-red-100 flex items-center justify-between gap-3 text-xs text-red-700 mt-6">
                    <span className="font-mono text-[10px] text-warm-grey">Danger Zone operations</span>
                    <button
                      onClick={() => {
                        showConfirm({
                          title: 'Delete Job Application Permanently?',
                          message: `Are you absolutely sure you want to permanently delete the application of "${activeApp.full_name}"? This behavior is irreversible.`,
                          confirmText: 'Proceed and Delete',
                          onConfirm: () => {
                            onDeleteJobApplication(activeApp.id);
                            setActiveApp(null);
                            showToast(`Application deleted successfully.`, 'success');
                          }
                        });
                      }}
                      className="text-xs font-bold uppercase tracking-wider hover:underline text-red-700"
                    >
                      Delete Application
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ) : (
            <div className="py-24 text-center px-8 flex flex-col items-center justify-center gap-4">
              <Users className="w-12 h-12 text-[#D6B46A]/20" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-matte-black">Candidate Dashboard Previewer</h4>
                <p className="text-[11px] text-[#8A8178] max-w-xs leading-normal font-sans">
                  Select an applicant from the left list to review their full credentials questionnaire, listen to the audition link, open the PDF curriculum vitae, and change acquisition status.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
