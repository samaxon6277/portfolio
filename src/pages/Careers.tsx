import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Briefcase, Upload, AlertCircle, 
  Heart, MapPin, Loader2
} from 'lucide-react';
import SEO from '../components/SEO';
import CustomSelect from '../components/CustomSelect';
import { JobApplication, JobListing, DepartmentType } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';
import { DEFAULT_JOBS } from '../utils/defaultData';
import { useTheme } from '../context/ThemeContext';

export default function Careers() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    expected_salary: '₹40,000 - ₹60,000/mo',
    position: 'Digital Growth Consultant (Remote)',
    why_hire: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_job_listings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
        } else {
          setJobs(DEFAULT_JOBS);
        }
      } else {
        setJobs(DEFAULT_JOBS);
      }
    } catch {
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
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let resume_url = '';
      if (resumeFile) {
        resume_url = await supabaseService.uploadResumePDF(resumeFile);
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
        analytics.trackFormSubmit();
        setIsSubmitted(true);
        setFormData({
          full_name: '',
          whatsapp: '',
          email: '',
          education: '',
          experience: 'Fresher',
          expected_salary: '₹40,000 - ₹60,000/mo',
          position: 'Digital Growth Consultant (Remote)',
          why_hire: '',
        });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setFormErrors(prev => ({ ...prev, form: 'Failed to transfer application. Please retry.' }));
      }

    } catch (err) {
      setFormErrors(prev => ({ ...prev, form: 'An error occurred. Please retry.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openJobs = jobs.filter(job => job.status === 'Open' && (deptFilter === 'all' || job.department === deptFilter));

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 text-left transition-colors duration-300 font-sans" id="careers-directory-page">
      <SEO 
        title="Careers & Open Engineering Positions | SamaXon"
        description="Join SamaXon. We are hire senior full-stack developers, creative brand directors, local SEO specialists and digital consultants. Competitive packages."
        canonicalPath="/careers"
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- HERO BANNER SECTION --- */}
        <div className="flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-black/5 dark:border-white/5 pb-10">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
              : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
          }`}>
            <Briefcase className="w-3.5 h-3.5" />
            <span>WORK WITH US</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] uppercase ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            WE ARE HIRING BUILDERS
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            We are building a highly motivated technology studio and consulting arm across India. Work remotely with professional creators who value clean compilation, precision UI styling, and real-time business integrations.
          </p>
        </div>

        {/* --- DYNAMIC JOB GRID FILTER BOARDS --- */}
        <div className="space-y-6 mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-black/5 dark:border-white/5 pb-4 gap-4">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">Current Openings</h2>
              <p className="text-xs text-[#8E8E93]">Select an opportunity below to view requirements and directly apply.</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'Leadership', 'Development', 'Design', 'SEO', 'Sales', 'HR', 'Operations'] as const).map(dept => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-mono uppercase font-bold transition-all cursor-pointer border ${
                    deptFilter === dept 
                      ? 'bg-[#D6B46A] text-[#0A0A0A] border-[#D6B46A]' 
                      : isDark
                        ? 'bg-white/5 border-white/10 text-[#8E8E93] hover:text-white'
                        : 'bg-black/5 border-black/10 text-[#6E6E73] hover:text-black'
                  }`}
                >
                  {dept === 'all' ? 'All' : dept}
                </button>
              ))}
            </div>
          </div>

          {openJobs.length === 0 ? (
            <div className={`p-12 text-center border border-dashed rounded-3xl ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
            }`}>
              <p className="text-xs text-[#8E8E93] font-mono leading-relaxed">No current open roles matched under this selector active.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openJobs.map((job) => (
                <div 
                  key={job.id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all space-y-4 ${
                    isDark 
                      ? 'bg-[#121212] border-white/10 hover:border-[#D6B46A]/40' 
                      : 'bg-white border-black/10 hover:border-[#D6B46A]/50 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-mono bg-[#D6B46A]/10 text-[#D6B46A] px-2.5 py-0.5 rounded-md uppercase font-bold tracking-wide">
                          {job.department} • {job.type}
                        </span>
                        <h3 className="text-base font-display font-bold uppercase tracking-tight mt-1.5">{job.title}</h3>
                      </div>
                      
                      <span className="text-[9.5px] font-mono text-[#8E8E93] font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />
                        <span>{job.location}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#8E8E93] leading-relaxed pr-2 font-sans">
                      {job.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] font-mono uppercase text-[#8E8E93] tracking-wider font-bold block">Key Focus Areas:</span>
                      <div className="space-y-1">
                        {job.requirements.slice(0, 3).map((req, ri) => (
                          <div key={ri} className="flex gap-2 text-xs text-[#8E8E93]">
                            <span className="text-[#D6B46A] shrink-0 font-bold">•</span>
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="text-[10px]">
                      <span className="text-[#8E8E93] block">Compensation Pack:</span>
                      <strong className="text-xs font-mono font-bold">{job.salaryRange}</strong>
                    </div>

                    <button
                      onClick={() => initiateApply(job)}
                      className="px-4 py-2 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <span>Apply For Role</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MAIN SPLIT ACTION MODULE --- */}
        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-10 border-t border-black/5 dark:border-white/5">
          
          {/* Form */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-all ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-md'
            }`}>
              <div className="border-b border-black/5 dark:border-white/5 pb-4 mb-5">
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">RECRUITMENT TERMINAL</span>
                <h3 className="font-display font-bold text-xl mt-1 uppercase">Application Questionnaire</h3>
                {formData.position ? (
                  <p className="text-xs text-emerald-500 font-semibold font-mono bg-emerald-500/10 px-3 py-1 rounded-md inline-block mt-1">
                     Applying for: {formData.position}
                  </p>
                ) : (
                  <p className="text-xs text-[#8E8E93] mt-0.5">Fill your professional metrics below to trigger our direct review.</p>
                )}
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg uppercase">Application Registered</h4>
                  <p className="text-xs text-[#8E8E93] max-w-sm mx-auto leading-relaxed">
                    SamaXon HR panel has indexed your details and resume PDF. If selected, our recruiters will connect directly via WhatsApp/Email.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Submit Another CV
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Full Name *</label>
                      <input 
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Advait Sharma"
                        className={`w-full border p-3 text-xs rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                        } ${formErrors.full_name ? 'border-red-400' : ''}`}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#D6B46A] font-bold tracking-wide">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 91234 56789"
                        className={`w-full border p-3 text-xs rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                        } ${formErrors.whatsapp ? 'border-red-400' : ''}`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Email Address *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. advait@example.com"
                        className={`w-full border p-3 text-xs rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                        }`}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Highest Qualification *</label>
                      <input 
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="e.g. BTech CSE / Graduate"
                        className={`w-full border p-3 text-xs rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Position Interested In *</label>
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

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Years of Experience *</label>
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

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Why should we select you? *</label>
                    <textarea 
                      name="why_hire"
                      value={formData.why_hire}
                      onChange={handleInputChange}
                      placeholder="Discuss your speed, core specialties, or communication comfort..."
                      rows={3}
                      className={`w-full border p-3 text-xs rounded-xl focus:border-[#D6B46A] focus:outline-none transition-colors ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                      }`}
                      required
                    />
                  </div>

                  {/* Drag-and-Drop Resume PDF */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono uppercase text-[#8E8E93] font-bold">Resume Upload (PDF Format only) *</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
                        isDragging 
                          ? 'border-[#D6B46A] bg-[#D6B46A]/10' 
                          : isDark ? 'border-white/15 bg-white/[0.02]' : 'border-black/15 bg-black/[0.02]'
                      }`}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-6 h-6 text-[#D6B46A] mb-2" />
                      
                      {resumeFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-500">{resumeFile.name}</p>
                          <span className="text-[9px] text-[#8E8E93]">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Drag to replace</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold">Drag &amp; Drop Resume CV here</p>
                          <span className="text-[10px] text-[#8E8E93] block">Or click to browse storage</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {formErrors.form && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formErrors.form}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transcribing resume attachments...</span>
                      </>
                    ) : (
                      <>
                        <span>Transfer Career Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Perks & Culture details */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`border p-6 rounded-3xl space-y-4 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Working At SamaXon</span>
              </h4>
              
              <div className="space-y-3 text-xs text-[#8E8E93] leading-relaxed">
                <p>
                  SamaXon is built as an elite, virtual-first community of builders. We reject slow meetings, endless email threads, and corporate play-acting. We measure success strictly by visual precision, page load speeds, and real-time database integrity.
                </p>
                
                <div className="space-y-2.5 pt-2">
                  <div className="flex gap-2">
                    <span className="font-bold text-[#D6B46A] shrink-0">1.</span>
                    <div>
                      <strong className="block font-semibold text-neutral-900 dark:text-white">100% Remote Architecture</strong>
                      <span>Work from wherever you are most efficient. No clock-in trackers. Deliver pristine files.</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-bold text-[#D6B46A] shrink-0">2.</span>
                    <div>
                      <strong className="block font-semibold text-neutral-900 dark:text-white">Developer-driven Philosophy</strong>
                      <span>We prioritize clean variables, lightweight payloads, and proper index parameters.</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-bold text-[#D6B46A] shrink-0">3.</span>
                    <div>
                      <strong className="block font-semibold text-neutral-900 dark:text-white">Prestige Branding Systems</strong>
                      <span>We align our clients alongside world-class enterprises. Every asset compiled must represent absolute authority.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">QUESTIONS?</span>
              <h4 className="text-sm font-display font-bold uppercase block mt-1">Direct HR Contact Handlers</h4>
              <p className="text-xs text-[#8E8E93] mt-1.5">
                For corporate partner inquiries, executive internships, or general help regarding submission files:
              </p>
              
              <div className="pt-3 space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Talent Desk:</span>
                  <a href="mailto:careers@samaxon.com" className="text-[#D6B46A] hover:underline">careers@samaxon.com</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">WhatsApp:</span>
                  <span className="font-semibold">+91 80000 00000</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
