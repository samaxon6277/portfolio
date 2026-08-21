import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Mail, Sparkles, Smile, Loader2, Award, 
  Briefcase, FileText, Upload, AlertCircle, Headphones, ShieldCheck, 
  BadgeDollarSign, Heart, ExternalLink, Bookmark, MapPin, Calendar, Clock
} from 'lucide-react';
import SEO from '../components/SEO';
import CustomSelect from '../components/CustomSelect';
import { JobApplication, JobListing, DepartmentType } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';
import { DEFAULT_JOBS } from '../utils/defaultData';

export default function Careers() {
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>(DEFAULT_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [deptFilter, setDeptFilter] = useState<'all' | DepartmentType>('all');
  
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    education: '',
    experience: 'Fresher',
    expected_salary: '₹40,000 - ₹60,005/mo',
    position: 'Digital Growth Consultant (Remote)',
    why_hire: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeUploadStatus, setResumeUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Load Job listings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_job_listings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 1 && parsed[0].id === 'job-consultant') {
          setJobs(parsed);
        } else {
          localStorage.setItem('samaxon_job_listings', JSON.stringify(DEFAULT_JOBS));
          setJobs(DEFAULT_JOBS);
        }
      } else {
        localStorage.setItem('samaxon_job_listings', JSON.stringify(DEFAULT_JOBS));
        setJobs(DEFAULT_JOBS);
      }
    } catch {
      console.warn('Utilising default careers openings.');
      setJobs(DEFAULT_JOBS);
    }
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.whatsapp.trim() || formData.whatsapp.length < 8) {
      errors.whatsapp = 'Valid WhatsApp number is required';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.education.trim()) errors.education = 'Highest Education detail is required';
    if (!formData.why_hire.trim() || formData.why_hire.length < 10) {
      errors.why_hire = 'Please write at least 10 characters explaining why we should partner';
    }
    if (!resumeFile) {
      errors.resume = 'Resume PDF file is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!hasTrackedFormStart) {
      analytics.trackFormStart();
      setHasTrackedFormStart(true);
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Drag and Drop Resume handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const processResumeFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFormErrors(prev => ({ ...prev, resume: 'Only PDF files are accepted' }));
      setResumeFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFormErrors(prev => ({ ...prev, resume: 'File exceeds 5MB limit. Please upload a compressed PDF' }));
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setResumeUploadStatus('idle');
    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const initiateApply = (job: JobListing) => {
    setSelectedJob(job);
    setFormData(prev => ({
      ...prev,
      position: `${job.title} (${job.location})`
    }));
    
    // Smooth scroll to form element
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setResumeUploadStatus('uploading');

    try {
      let resume_url = '';
      if (resumeFile) {
        resume_url = await supabaseService.uploadResumePDF(resumeFile);
        setResumeUploadStatus('success');
      }

      const jobAppRecord: JobApplication = {
        id: `jobapp-${Date.now()}`,
        full_name: formData.full_name,
        gender: 'Not Specified',
        age: 24,
        city: 'Remote',
        phone: formData.whatsapp,
        whatsapp: formData.whatsapp,
        email: formData.email,
        education: formData.education,
        experience: formData.experience,
        languages: 'English / Hindi',
        position: formData.position,
        expected_salary: formData.expected_salary,
        why_hire: formData.why_hire,
        voice_sample_link: '',
        resume_url: resume_url,
        status: 'New',
        created_at: new Date().toISOString()
      };

      const success = await supabaseService.upsertJobApplication(jobAppRecord);
      
      if (success) {
        // Track the submission
        analytics.trackFormSubmit();
        setIsSubmitted(true);
        // Reset inputs
        setFormData({
          full_name: '',
          whatsapp: '',
          email: '',
          education: '',
          experience: 'Fresher',
          expected_salary: '₹40,000 - ₹60,005/mo',
          position: 'Digital Growth Consultant (Remote)',
          why_hire: '',
        });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setFormErrors(prev => ({ ...prev, form: 'Failed to transfer application. Please retry.' }));
      }

    } catch (err) {
      console.error('Submission pipeline failed:', err);
      setFormErrors(prev => ({ ...prev, form: 'An error occurred. Dynamic uploader saved.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter open jobs
  const openJobs = jobs.filter(job => job.status === 'Open' && (deptFilter === 'all' || job.department === deptFilter));

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-32 pb-24 text-left" id="careers-directory-page">
      <SEO 
        title="Careers & Open Engineering Positions | SamaXon"
        description="Join SamaXon. We are hire senior full-stack developers, creative brand directors, local SEO specialists and digital consultants. Competitive packages."
        canonicalPath="/careers"
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- HERO BANNER SECTION --- */}
        <div className="flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-[#D6B46A]/20 pb-10">
          <div className="px-3 py-1 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-champagne-gold" />
            WORK WITH US
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-matte-black leading-tight uppercase">
            WE ARE HIRING BUILDERS
          </h1>
          <p className="text-sm text-[#8A8178] leading-relaxed max-w-2xl font-sans">
            We are building a highly motivated technology studio and consulting arm across India. Work remotely with professional creators who value clean compilation, precision UI styling, and real-time business integrations.
          </p>
        </div>

        {/* --- DYNAMIC JOB GRID FILTER BOARDS --- */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-4 gap-4">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-neutral-900">Current Openings</h2>
              <p className="text-[11px] text-[#8A8178]">Select an opportunity below to view requirements and directly apply.</p>
            </div>
            
            {/* Department mini selector */}
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'Leadership', 'Development', 'Design', 'SEO', 'Sales', 'HR', 'Operations'] as const).map(dept => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={`px-3 py-1 rounded text-[9px] font-mono uppercase font-extrabold transition-all cursor-pointer ${
                    deptFilter === dept 
                      ? 'bg-matte-black text-white' 
                      : 'bg-white border border-neutral-200 text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  {dept === 'all' ? 'All' : dept}
                </button>
              ))}
            </div>
          </div>

          {openJobs.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF8] border border-dashed border-[#D6B46A]/20 rounded-3xl">
              <p className="text-xs text-[#8A8178] font-mono leading-relaxed">No current open roles matched under this selector active.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openJobs.map((job) => (
                <div 
                  key={job.id}
                  className="bg-white border border-[#D6B46A]/15 hover:border-champagne-gold/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-mono bg-champagne-gold/10 text-champagne-gold px-2.5 py-0.5 rounded uppercase font-bold tracking-wide">
                          {job.department} • {job.type}
                        </span>
                        <h3 className="text-base font-display font-medium text-neutral-900 uppercase tracking-tight mt-1.5">{job.title}</h3>
                      </div>
                      
                      <span className="text-[9.5px] font-mono text-[#8A8178] font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                        {job.location}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8A8178] leading-relaxed pr-2 font-sans">
                      {job.description}
                    </p>

                    {/* Requirements checklist preview */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] font-mono uppercase text-[#A89F91] tracking-wider font-bold block">Key Focus Areas:</span>
                      <div className="space-y-1">
                        {job.requirements.slice(0, 3).map((req, ri) => (
                          <div key={ri} className="flex gap-2 text-[10.5px] text-neutral-700">
                            <span className="text-[#BFA15A] shrink-0 font-bold">•</span>
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing / Salary details and Apply button row */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="text-[10px]">
                      <span className="text-[#8A8178] block">Compensation Pack:</span>
                      <strong className="text-neutral-900 text-xs font-mono font-bold">{job.salaryRange}</strong>
                    </div>

                    <button
                      onClick={() => initiateApply(job)}
                      className="px-4 py-2 bg-matte-black hover:bg-neutral-800 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                    >
                      Apply For Role
                      <ArrowRight className="w-3 h-3 text-champagne-gold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MAIN SPLIT ACTION MODULE --- */}
        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-10 border-t border-matte-black/5">
          
          {/* Left Column: Form Questionnaire & Drag Drop */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-champagne-gold/15 p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="border-b border-champagne-gold/10 pb-5 mb-5">
                <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">RECRUITMENT TERMINAL</span>
                <h3 className="font-display font-bold text-xl text-matte-black mt-1 uppercase">Application Questionnaire</h3>
                {formData.position ? (
                  <p className="text-xs text-[#0c5737] font-semibold font-mono bg-emerald-50 px-3 py-1 rounded inline-block mt-1">
                     Applying for: {formData.position}
                  </p>
                ) : (
                  <p className="text-[11px] text-warm-grey">Fill your professional metrics below to trigger our direct review.</p>
                )}
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-medium text-lg text-matte-black uppercase">Application Registered</h4>
                  <p className="text-xs text-[#8A8178] max-w-sm mx-auto leading-relaxed font-sans">
                    SamaXon hr panel has indexed your details and resume PDF. If selected, our recruiters will connect directly via WhatsApp/Email to schedule evaluation rounds.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-matte-black text-soft-ivory hover:text-champagne-gold text-xs font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Submit Another CV
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Full Name *</label>
                      <input 
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Advait Sharma"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none transition-all ${
                          formErrors.full_name ? 'border-red-400 focus:border-red-400' : 'focus:border-champagne-gold'
                        }`}
                        required
                      />
                    </div>

                    {/* WhatsApp fields */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#0c5737] font-extrabold tracking-wide">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 91234 56789"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none transition-all ${
                          formErrors.whatsapp ? 'border-red-400' : 'focus:border-emerald-600'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Email Address *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. advait@example.com"
                        className="w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none focus:border-champagne-gold"
                        required
                      />
                    </div>

                    {/* Education */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Highest Qualification *</label>
                      <input 
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="e.g. BTech CSE / Graduate"
                        className="w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none focus:border-champagne-gold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Position Selector */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Position Interested In *</label>
                      <CustomSelect
                        value={formData.position}
                        onChange={(val) => {
                          if (!hasTrackedFormStart) {
                            analytics.trackFormStart();
                            setHasTrackedFormStart(true);
                          }
                          setFormData(prev => ({ ...prev, position: val }));
                        }}
                        options={Array.from(new Set([
                          "Digital Growth Consultant (Remote)",
                          ...jobs.map(j => `${j.title} (${j.location})`)
                        ])).map(pos => ({ value: pos, label: pos }))}
                      />
                    </div>

                    {/* Experience level */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Years of Experience *</label>
                      <CustomSelect
                        value={formData.experience}
                        onChange={(val) => {
                          if (!hasTrackedFormStart) {
                            analytics.trackFormStart();
                            setHasTrackedFormStart(true);
                          }
                          setFormData(prev => ({ ...prev, experience: val }));
                        }}
                        options={[
                          { value: "Fresher / Learner", label: "Fresher / Learner" },
                          { value: "1 to 3 Years", label: "1 - 3 Years" },
                          { value: "4+ Years (Senior)", label: "4+ Years (Senior)" }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Why Hire */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Why should we select you? (Short summary) *</label>
                    <textarea 
                      name="why_hire"
                      value={formData.why_hire}
                      onChange={handleInputChange}
                      placeholder="Discuss your speed, core specialties, or communication comfort..."
                      rows={3}
                      className="w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none focus:border-champagne-gold"
                      required
                    />
                  </div>

                  {/* Drag-and-Drop Resume PDF */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Resume Upload (PDF Format only) *</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
                        isDragging 
                          ? 'border-champagne-gold bg-champagne-gold/10' 
                          : 'border-champagne-gold/25 bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/60'
                      }`}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-7 h-7 text-champagne-gold mb-2" />
                      
                      {resumeFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-700">{resumeFile.name}</p>
                          <span className="text-[9px] text-[#8A8178]">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Drag to replace</span>
                        </div>
                      ) : (
                        <div className="space-y-1 font-sans">
                          <p className="text-xs font-bold text-neutral-900">Drag & Drop Resume CV here</p>
                          <span className="text-[9.5px] text-[#8A8178] block">Or click to browse storage</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {formErrors.form && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 text-xs rounded-lg font-medium flex items-center gap-1.5 font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {formErrors.form}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-matte-black text-white hover:text-champagne-gold hover:bg-neutral-800 font-black uppercase tracking-widest text-[9.5px] rounded-xl border border-champagne-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-champagne-gold" />
                        Transcribing resume attachments...
                      </>
                    ) : (
                      <>
                        Transfer Career Application
                        <ArrowRight className="w-4 h-4 text-champagne-gold" />
                      </>
                    )}
                  </button>
                  
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Perks & Culture details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#D6B46A]/15 p-6 rounded-3xl space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 font-mono">
                <Heart className="w-4 h-4 text-rose-500" />
                Working At SamaXon
              </h4>
              
              <div className="space-y-4 text-xs font-sans text-[#8A8178]">
                <p>
                  SamaXon is built as an elite, virtual-first community of builders. We reject slow meetings, endless email threads, and corporate play-acting. We measure success strictly by visual precision, page load speeds, and real-time database integrity.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2.5">
                    <span className="font-bold text-neutral-900 shrink-0">1.</span>
                    <div>
                      <strong className="text-neutral-900 block font-semibold">100% Remote Architecture</strong>
                      <span>Work from wherever you are most efficient. No clock-in trackers or keyboard spywares. Deliver pristine files.</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <span className="font-bold text-neutral-900 shrink-0">2.</span>
                    <div>
                      <strong className="text-neutral-900 block font-semibold">Developer-driven Philosophy</strong>
                      <span>We prioritize clean variables, lightweight payloads, and proper index parameters. No bloated WP plug-ins permitted.</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <span className="font-bold text-neutral-900 shrink-0">3.</span>
                    <div>
                      <strong className="text-neutral-900 block font-semibold">Prestige Branding Systems</strong>
                      <span>We align our clients alongside world-class enterprises. Every asset compiled must represent absolute authority.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 text-white p-6 rounded-3xl border border-[#D6B46A]/20">
              <span className="text-[8px] font-mono uppercase tracking-widest text-champagne-gold font-bold block">QUESTIONS?</span>
              <h4 className="text-sm font-display font-bold uppercase block mt-1">Direct HR Contact Handlers</h4>
              <p className="text-[11px] text-neutral-400 mt-2 font-sans">
                For corporate partner inquiries, executive internships program, or general help regarding submission files:
              </p>
              
              <div className="pt-4 space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Talent Desk Email:</span>
                  <a href="mailto:careers@samaxon.com" className="text-champagne-gold hover:underline">careers@samaxon.com</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-mono">Whatsapp Helpline:</span>
                  <span className="text-neutral-200">+91 80000 00000</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
