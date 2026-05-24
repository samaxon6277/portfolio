import React, { useState, useRef } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Sparkles, Smile, Loader2, Award, Briefcase, FileText, Upload, AlertCircle, Headphones, ShieldCheck, Languages, BadgeDollarSign } from 'lucide-react';
import SEO from '../components/SEO';
import { JobApplication } from '../types';
import { supabaseService } from '../utils/supabaseService';

const AVAILABLE_JOBS = [
  {
    title: 'Female Telecaller',
    type: 'Remote / Work From Home',
    commitment: 'Part-time / Full-time',
    salary: '₹12,000 - ₹25,000 / month + high closing incentives',
    skills: ['Fluent Hindi/English speaking', 'Basic negotiation', 'Cold outbound calling', 'Confidence'],
    desc: 'Conduct descriptive outbound consult calls to warm lead pools of banquet halls, resort owners & luxury gyms. Explain the pre-built demo benefit and log client inquiries.'
  },
  {
    title: 'Sales Executive',
    type: 'Remote / Hybrid WFH',
    commitment: 'Full-time',
    salary: '₹18,000 - ₹35,000 / month + 10% direct closing commissions',
    skills: ['Client acquisition', 'Follow-up discipline', 'Persuasiveness', 'Sales closure'],
    desc: 'Identify outdated digital footprints of hotels, restaurants across cities, showcase SamaXon premium high-fidelity live demos, and secure contract handovers.'
  },
  {
    title: 'Business Development Intern',
    type: 'Remote / Work From Home',
    commitment: 'Part-time / Full-time',
    salary: '₹8,000 - ₹15,000 / month stipend + milestones accelerators',
    skills: ['Market research', 'Social outreach', 'Lead qualification', 'Disciplined scraping'],
    desc: 'Perfect for fast-learning graduates or freshers wanting real premium tech-sales experience. Qualify hospitality leads, initiate touchpoints, and route them to digital consultants.'
  },
  {
    title: 'Website Consultant',
    type: 'Remote / Work From Home',
    commitment: 'Part-time / Full-time',
    salary: '₹22,000 - ₹45,000 / month + recursive retainer margins',
    skills: ['Consultative pitch', 'UI/UX basics understanding', 'Client relationship', 'Expectation mapping'],
    desc: 'Act as the expert advisor mapping the owner’s custom booking & booking admin panel requirement into technical design sheets for the engineering pipeline.'
  },
  {
    title: 'Lead Generation Executive',
    type: 'Remote / Work From Home',
    commitment: 'Part-time / Full-time',
    salary: '₹15,000 - ₹30,000 / month + recurring bounties per lead',
    skills: ['LinkedIn Sales Navigator', 'Targeted outreach', 'Scraping automation', 'List curation'],
    desc: 'Develop high-quality corporate databases of active hotels, banquet halls, high-budget gyms and health spas looking to modernize their speed profiles.'
  }
];

export default function Careers() {
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'Female',
    age: '',
    city: '',
    phone: '',
    whatsapp: '',
    email: '',
    education: '',
    experience: '',
    languages: '',
    position: 'Female Telecaller',
    expected_salary: '',
    why_hire: '',
    voice_sample_link: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploadStatus, setResumeUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  const handleRoleSelect = (jobTitle: string, index: number) => {
    setSelectedJobIndex(index);
    setFormData(prev => ({ ...prev, position: jobTitle }));
    const formEl = document.getElementById('career-form-anchor');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 15) {
      errors.age = 'Provide a valid age (above 15)';
    }
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errors.phone = 'Valid phone number is required';
    }
    if (!formData.whatsapp.trim() || formData.whatsapp.length < 8) {
      errors.whatsapp = 'Valid WhatsApp number is required';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.education.trim()) errors.education = 'Education background is required';
    if (!formData.experience.trim()) errors.experience = 'Provide a summary of your experience';
    if (!formData.languages.trim()) errors.languages = 'Languages known (e.g. Hindi, English) are required';
    if (!formData.expected_salary.trim()) errors.expected_salary = 'Expected salary details required';
    if (!formData.why_hire.trim() || formData.why_hire.length < 15) {
      errors.why_hire = 'Please write at least 15 characters on why we should hire you';
    }
    if (!resumeFile) {
      errors.resume = 'Resume PDF file is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it is PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFormErrors(prev => ({ ...prev, resume: 'Only PDF files are accepted' }));
      setResumeFile(null);
      return;
    }

    // Validate size - 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFormErrors(prev => ({ ...prev, resume: 'File exceeds 5MB limit. Please upload a compressed PDF' }));
      setResumeFile(null);
      return;
    }

    // Success clearing errors
    setResumeFile(file);
    setResumeUploadStatus('idle');
    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setResumeUploadStatus('uploading');

    try {
      // 1. Upload PDF to Supabase Storage
      let resume_url = '';
      if (resumeFile) {
        resume_url = await supabaseService.uploadResumePDF(resumeFile);
        setResumeUploadStatus('success');
      }

      // 2. Save Application Record to Database (Table: job_applications)
      const jobAppRecord: JobApplication = {
        id: `jobapp-${Date.now()}`,
        full_name: formData.full_name,
        gender: formData.gender,
        age: parseInt(formData.age) || formData.age,
        city: formData.city,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        education: formData.education,
        experience: formData.experience,
        languages: formData.languages,
        position: formData.position,
        expected_salary: formData.expected_salary,
        why_hire: formData.why_hire,
        voice_sample_link: formData.voice_sample_link,
        resume_url: resume_url,
        status: 'New',
        created_at: new Date().toISOString()
      };

      const success = await supabaseService.upsertJobApplication(jobAppRecord);
      
      if (success) {
        setIsSubmitted(true);
        // Reset inputs
        setFormData({
          full_name: '',
          gender: 'Female',
          age: '',
          city: '',
          phone: '',
          whatsapp: '',
          email: '',
          education: '',
          experience: '',
          languages: '',
          position: 'Female Telecaller',
          expected_salary: '',
          why_hire: '',
          voice_sample_link: '',
        });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setFormErrors(prev => ({ ...prev, form: 'Failed to save application structure. Please attempt again.' }));
      }

    } catch (err) {
      console.error('Submission pipeline failed:', err);
      setFormErrors(prev => ({ ...prev, form: 'An error occurred during submission. Fallback saving used.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-32 pb-24" id="careers-page">
      <SEO 
        title="Careers - Join Our Premium Tech Sales Agency"
        description="SamaXon is expanding India's elite remote consulting team. Apply for Telecaller, Sales Executive, Intern and Consultant roles with great compensation."
        canonicalPath="/careers"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-20 max-w-4xl border-b border-champagne-gold/15 pb-10">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Join SamaXon Digital Solutions
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-matte-black leading-tight">
            Perform Remotely. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-matte-black">
              Earn Uncapped Incentives.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-warm-grey leading-relaxed mt-2 max-w-2xl font-sans">
            We are building a highly curated team of sharp, disciplined, performance-minded professionals across India to secure digital upgrade mandates from Hotels, Banquet Halls, Gyms, and local Business Founders.
          </p>
        </div>

        {/* --- ROLE EXPECTATION & HIGH COMMISSIONS METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-champagne-gold/10 p-6 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold text-champagne-gold h-5 flex items-center gap-1.5 uppercase font-mono tracking-wider"><ShieldCheck className="w-4 h-4" /> Fully Remote / Work from Home</span>
            <p className="text-xs text-warm-grey font-sans">Zero commute stress. Manage your client consultations, calls and follow-ups perfectly from home with senior backup and ready mockups.</p>
          </div>
          <div className="bg-white border border-champagne-gold/10 p-6 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold text-champagne-gold h-5 flex items-center gap-1.5 uppercase font-mono tracking-wider"><BadgeDollarSign className="w-4 h-4" /> Premium Commission Schemes</span>
            <p className="text-xs text-warm-grey font-sans">Receive high fixed stipends or salaries, supplemented by direct commissions per build closed, yielding ₹20k - ₹50k+ recurring earnings.</p>
          </div>
          <div className="bg-white border border-[#D6B46A]/30 p-6 bg-gradient-to-r from-[#D6B46A]/5 to-transparent rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold text-matte-black h-5 flex items-center gap-1.5 uppercase font-mono tracking-wider"><Sparkles className="w-4 h-4" /> 48-Hour Execution Model</span>
            <p className="text-xs text-warm-grey font-sans">Selling custom software is easy when delivery is guaranteed within 48 hours. No dealing with slow, unreliable engineering circles.</p>
          </div>
        </div>

        {/* --- MAIN STRUCTURE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="career-form-anchor">
          
          {/* LEFT: JOB LISTINGS */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-champagne-gold uppercase tracking-wider font-bold block">
                Active Openings
              </span>
              <h2 className="font-display text-2xl font-black text-matte-black tracking-tight">
                Select Your Role to Apply
              </h2>
              <p className="text-xs text-warm-grey">
                Click a card below to select it. The application form on the right will auto-focus and pre-populate with the correct position.
              </p>
            </div>

            <div className="space-y-4" id="available-roles-wrapper">
              {AVAILABLE_JOBS.map((job, idx) => {
                const isSelected = formData.position === job.title;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleRoleSelect(job.title, idx)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all border text-left ${
                      isSelected 
                        ? 'bg-white border-champagne-gold shadow-lg ring-1 ring-champagne-gold/30' 
                        : 'bg-white/60 hover:bg-white border-champagne-gold/15 hover:border-champagne-gold/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div>
                        <h4 className="font-display font-bold text-base text-matte-black flex items-center gap-2">
                          {job.title}
                          {isSelected && <span className="inline-block w-2-h-2 bg-emerald-500 rounded-full animate-ping" style={{width: 6, height: 6}} />}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-[9px] font-mono bg-champagne-gold/10 text-[#a38036] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{job.type}</span>
                          <span className="text-[9px] font-mono bg-matte-black/5 text-matte-black/70 px-2 py-0.5 rounded font-semibold">{job.commitment}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-champagne-gold whitespace-nowrap">{job.salary.split(' +')[0]}</span>
                    </div>

                    <p className="text-xs text-warm-grey font-sans leading-relaxed mb-4">
                      {job.desc}
                    </p>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-matte-black/40 tracking-wider font-bold block mb-1.5">Required Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[9px] bg-[#FAF8F5] border border-champagne-gold/5 text-warm-grey px-2 py-1 rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: JOB APPLICATION FORM */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-champagne-gold/15 p-8 sm:p-10 text-left relative overflow-hidden shadow-xl" id="career-form-container">
              
              <div className="border-b border-champagne-gold/10 pb-6 mb-6">
                <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">RECRUITMENT APPLICATION</span>
                <h3 className="font-display font-bold text-xl text-matte-black mt-1">Application Questionnaire</h3>
                <p className="text-[11px] text-warm-grey">Fill your professional metrics below to trigger our direct consulting review.</p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-5" id="career-form-success">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-matte-black">Application Successfully Transferred</h4>
                  <p className="text-xs text-warm-grey max-w-sm mx-auto leading-relaxed">
                    Senior partners have registered your data and resume file. If selected, our HR team will connect on WhatsApp to schedule an voice interview consultation. Thank you!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 bg-matte-black text-soft-ivory hover:text-champagne-gold text-xs font-mono uppercase tracking-widest rounded-xl transition-all"
                  >
                    Apply for Another Role
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" id="careers-form">
                  
                  {/* POSITION CHOSEN DETAILED STATS */}
                  <div className="p-4 bg-[#FAF8F5] border border-champagne-gold/20 rounded-xl mb-4">
                    <span className="text-[9px] font-mono text-warm-grey uppercase font-bold tracking-wider">Applying For Position:</span>
                    <h4 className="font-display font-bold text-sm text-matte-black mt-0.5">{formData.position}</h4>
                    <span className="text-[10px] text-champagne-gold font-mono font-medium block mt-1">
                      {AVAILABLE_JOBS.find(j => j.title === formData.position)?.salary}
                    </span>
                  </div>

                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Full Name *</label>
                    <input 
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Advait Sharma"
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                        formErrors.full_name ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                      }`}
                    />
                    {formErrors.full_name && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.full_name}</span>}
                  </div>

                  {/* Gender and Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Gender *</label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-white p-3 border border-champagne-gold/15 text-xs text-matte-black rounded-lg cursor-pointer focus:ring-1 focus:ring-champagne-gold"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Age *</label>
                      <input 
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="e.g. 23"
                        min="16"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.age ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.age && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.age}</span>}
                    </div>
                  </div>

                  {/* City and Education */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Current City *</label>
                      <input 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Bengaluru"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.city ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.city && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.city}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Highest Education *</label>
                      <input 
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="e.g. BBA / MBA / BTech / Higher Secondary"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.education ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.education && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.education}</span>}
                    </div>
                  </div>

                  {/* Phone and WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Call Phone Number *</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 9123456789"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.phone ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.phone && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold font-semibold text-emerald-800">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 9123456789"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.whatsapp ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.whatsapp && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.whatsapp}</span>}
                    </div>
                  </div>

                  {/* Email and Expected Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Email Address *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. example@gmail.com"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.email && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Expected Salary (Monthly / Incentive) *</label>
                      <input 
                        type="text"
                        name="expected_salary"
                        value={formData.expected_salary}
                        onChange={handleInputChange}
                        placeholder="e.g. ₹25,000 + Commissions"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.expected_salary ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.expected_salary && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.expected_salary}</span>}
                    </div>
                  </div>

                  {/* Languages known and position override */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold flex items-center gap-1"><Languages className="w-3.5 h-3.5 text-champagne-gold" /> Languages Known *</label>
                      <input 
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        placeholder="e.g. Hindi, English, Kannada"
                        className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                          formErrors.languages ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                        }`}
                      />
                      {formErrors.languages && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.languages}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Override Position</label>
                      <select 
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full bg-white p-3 border border-champagne-gold/15 text-xs text-matte-black rounded-lg cursor-pointer focus:ring-1 focus:ring-champagne-gold"
                      >
                        {AVAILABLE_JOBS.map((j, i) => (
                          <option key={i} value={j.title}>{j.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Outline Your Experience Summary *</label>
                    <textarea 
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Specify your background in calling, sales, customer handling or any fresh attributes here..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                        formErrors.experience ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                      }`}
                    />
                    {formErrors.experience && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.experience}</span>}
                  </div>

                  {/* Why do you want to join */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Why should we hire you? *</label>
                    <textarea 
                      name="why_hire"
                      value={formData.why_hire}
                      onChange={handleInputChange}
                      placeholder="Tell us what makes you disciplined to work from home and why you will be successful..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg ${
                        formErrors.why_hire ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-champagne-gold'
                      }`}
                    />
                    {formErrors.why_hire && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.why_hire}</span>}
                  </div>

                  {/* Optional Voice sample link */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5 text-champagne-gold" />
                      Voice Sample Audio / Video Link (Optional)
                    </label>
                    <input 
                      type="url"
                      name="voice_sample_link"
                      value={formData.voice_sample_link}
                      onChange={handleInputChange}
                      placeholder="e.g. Drive Link / Veed / YouTube / SoundCloud URL showing communication style"
                      className="w-full bg-pearl-white/40 border border-champagne-gold/15 p-3 text-xs text-matte-black rounded-lg"
                    />
                  </div>

                  {/* PDF Upload Resume */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-champagne-gold" />
                      Upload Resume PDF *
                    </label>
                    
                    <div className="relative border border-dashed border-champagne-gold/30 rounded-xl p-5 bg-[#FAF8F5]/50 flex flex-col items-center justify-center text-center hover:bg-[#FAF8F5] transition-all">
                      <input 
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-6 h-6 text-champagne-gold mb-2" />
                      
                      {resumeFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-700 block">{resumeFile.name}</p>
                          <span className="text-[10px] text-warm-grey">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-matte-black">Click here or drag-and-drop to upload resume</p>
                          <span className="text-[10px] text-warm-grey uppercase tracking-wider block font-medium">Accept Only PDF files (Max 5MB)</span>
                        </div>
                      )}
                    </div>
                    {formErrors.resume && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /> {formErrors.resume}</span>}
                  </div>

                  {formErrors.form && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 text-xs rounded-lg font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {formErrors.form}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-black uppercase tracking-widest text-[10px] rounded-xl border border-champagne-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-champagne-gold" />
                        Saving & Uploading PDF CV...
                      </>
                    ) : (
                      <>
                        Submit Career Application
                        <ArrowRight className="w-4 h-4 text-champagne-gold" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
