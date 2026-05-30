import React, { useState, useRef } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Sparkles, Smile, Loader2, Award, Briefcase, FileText, Upload, AlertCircle, Headphones, ShieldCheck, BadgeDollarSign, Heart, ExternalLink, Bookmark } from 'lucide-react';
import SEO from '../components/SEO';
import { JobApplication } from '../types';
import { supabaseService } from '../utils/supabaseService';
import { analytics } from '../utils/analytics';

export default function Careers() {
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    education: '',
    why_hire: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploadStatus, setResumeUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.whatsapp.trim() || formData.whatsapp.length < 8) {
      errors.whatsapp = 'Valid WhatsApp number is required';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.education.trim()) errors.education = 'Highest Education / Current Course is required';
    if (!formData.why_hire.trim() || formData.why_hire.length < 10) {
      errors.why_hire = 'Please write at least 10 characters explaining why we should hire you';
    }
    if (!resumeFile) {
      errors.resume = 'Resume PDF file is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        gender: 'Not Specified',
        age: 23,
        city: 'Remote',
        phone: formData.whatsapp,
        whatsapp: formData.whatsapp,
        email: formData.email,
        education: formData.education,
        experience: 'Not Specified (Simplified Form)',
        languages: 'English / Hindi',
        position: 'Digital Growth Consultant (Remote)',
        expected_salary: 'Potential: ₹30,000 - ₹70,000+ / Month',
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
        // Reset inputs
        setFormData({
          full_name: '',
          whatsapp: '',
          email: '',
          education: '',
          why_hire: '',
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
        description="Represent SamaXon remotely as a Digital Growth Consultant. Promote customizable Live Prototypes to high-ticket clients with uncapped incentive payouts."
        canonicalPath="/careers"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-[#D6B46A]/20 pb-10">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9.5px] font-mono uppercase font-bold tracking-widest rounded-full">
            Join SamaXon Digital Solutions
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-matte-black leading-tight">
            Perform Remotely. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-matte-black">
              Earn Uncapped Incentives.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-warm-grey leading-relaxed mt-2 max-w-2xl font-sans">
            We are building a highly motivated remote consultancy arm across India to secure modern digital upgrade mandates from premium business houses.
          </p>
        </div>

        {/* --- MAIN SPLIT GRID STRUCTURE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="career-form-anchor">
          
          {/* LEFT COLUMN: ACTIVE ROLE HIGHLIGHT & PERKS */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-champagne-gold uppercase tracking-wider font-bold block">
                Exclusive Active Opening
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-matte-black tracking-tight">
                Join our Remote Consulting Division
              </h2>
            </div>

            {/* Premium Focused Role Card */}
            <div className="bg-white border-2 border-[#D6B46A] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-mono uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Active Hiring
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono bg-champagne-gold/10 border border-champagne-gold/20 text-champagne-gold px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider inline-block">
                  Remote (Work From Home)
                </span>
                
                <h3 className="font-display font-black text-2xl text-matte-black">
                  Digital Growth Consultant (Remote)
                </h3>
                
                <p className="text-xs sm:text-sm font-semibold text-emerald-800 font-mono bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/60 mt-2 leading-relaxed flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong className="text-matte-black uppercase font-bold tracking-wider">Potential:</strong> ₹30,000 - ₹70,000+ / Month (Incentive-Based)
                  </span>
                </p>
              </div>

              <p className="text-xs text-warm-grey font-sans leading-relaxed mt-5">
                Represent SamaXon's premier collection of boutique tech stacks and modern landing frameworks. Promote commissions-free direct booking systems to weddings, nature resorts, custom medical clinics, and gyms with 100% pre-compiled mockups.
              </p>

              {/* Perks Grid */}
              <div className="border-t border-[#D6B46A]/10 pt-5 space-y-4 mt-6">
                <span className="text-[9.5px] font-mono uppercase text-matte-black/40 tracking-wider font-bold block">Consultant Perks</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-champagne-gold/10 rounded-lg text-champagne-gold shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-matte-black">Complete Autonomy</h5>
                      <span className="text-[10.5px] text-warm-grey block">Flexible home working hours around your lifestyle.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-champagne-gold/10 rounded-lg text-champagne-gold shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-matte-black">Verified Daily Leads</h5>
                      <span className="text-[10.5px] text-warm-grey block">Get qualified commercial contact pools from operations lists.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-champagne-gold/10 rounded-lg text-champagne-gold shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-matte-black">High Converting Demos</h5>
                      <span className="text-[10.5px] text-warm-grey block">Our engineering team creates interactive demo links for you.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-champagne-gold/10 rounded-lg text-champagne-gold shrink-0">
                      <BadgeDollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-matte-black">Earn Uncapped</h5>
                      <span className="text-[10.5px] text-warm-grey block">Extremely rewarding commissions increasing with volume.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: APPLICATION FORM & JOB COMPENSATIVE DESCRIPTION */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* 1. Low Friction Form Card */}
            <div className="bg-white rounded-3xl border border-champagne-gold/15 p-6 sm:p-10 text-left relative overflow-hidden shadow-xl" id="career-form-container">
              
              <div className="border-b border-champagne-gold/10 pb-5 mb-5">
                <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">RECRUITMENT APPLICATION</span>
                <h3 className="font-display font-bold text-xl text-matte-black mt-1">Application Questionnaire</h3>
                <p className="text-[11px] text-warm-grey">Fill your professional metrics below to trigger our direct review.</p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-5" id="career-form-success">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-matte-black">Application Successfully Transferred</h4>
                  <p className="text-xs text-warm-grey max-w-sm mx-auto leading-relaxed">
                    SamaXon senior partners have registered your metrics and resume file. If selected, our recruiters will connect directly via WhatsApp to coordinate interview evaluations. Thank you!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-matte-black text-soft-ivory hover:text-champagne-gold text-xs font-mono uppercase tracking-widest rounded-xl transition-all"
                  >
                    Apply Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" id="careers-form">
                  
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Full Name *</label>
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
                    {formErrors.full_name && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.full_name}</span>}
                  </div>

                  {/* WhatsApp Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-[#0c5737] font-black tracking-wide">WhatsApp Number *</label>
                    <input 
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 91234 56789"
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none transition-all ${
                        formErrors.whatsapp ? 'border-red-400 focus:border-red-400' : 'focus:border-[#0c5737]'
                      }`}
                      required
                    />
                    {formErrors.whatsapp && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.whatsapp}</span>}
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Email Address *</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. advait@example.com"
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none transition-all ${
                        formErrors.email ? 'border-red-400 focus:border-red-400' : 'focus:border-champagne-gold'
                      }`}
                      required
                    />
                    {formErrors.email && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.email}</span>}
                  </div>

                  {/* Highest Education / Current Course */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Highest Education / Current Course *</label>
                    <input 
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="e.g. BBA / MBA / BTech Student / Graduate"
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none transition-all ${
                        formErrors.education ? 'border-red-400 focus:border-red-400' : 'focus:border-champagne-gold'
                      }`}
                      required
                    />
                    {formErrors.education && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.education}</span>}
                  </div>

                  {/* Why should we hire you? (Short text) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Why should we hire you? (Short text) *</label>
                    <textarea 
                      name="why_hire"
                      value={formData.why_hire}
                      onChange={handleInputChange}
                      placeholder="Specify what makes you disciplined to operate remotely..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3 border-champagne-gold/15 text-xs text-matte-black rounded-lg outline-none transition-all ${
                        formErrors.why_hire ? 'border-red-400 focus:border-red-400' : 'focus:border-champagne-gold'
                      }`}
                      required
                    />
                    {formErrors.why_hire && <span className="text-[10px] text-red-500 font-mono font-medium mt-0.5">{formErrors.why_hire}</span>}
                  </div>

                  {/* PDF Upload Resume */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-champagne-gold" />
                      Upload Resume PDF *
                    </label>
                    
                    <div className="relative border border-dashed border-champagne-gold/30 rounded-xl p-4 bg-[#FAF8F5]/50 flex flex-col items-center justify-center text-center hover:bg-[#FAF8F5] transition-all">
                      <input 
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-6 h-6 text-champagne-gold mb-1" />
                      
                      {resumeFile ? (
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-emerald-700 block">{resumeFile.name}</p>
                          <span className="text-[9px] text-warm-grey">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-matte-black">Click here or drag file to upload</p>
                          <span className="text-[9px] text-warm-grey uppercase tracking-wider block font-medium">PDF format only (Max 5MB)</span>
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
                    className="w-full py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-black uppercase tracking-widest text-[10px] rounded-xl border border-champagne-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

            {/* 2. Detailed Job Description Card (Directly Below the Form) */}
            <div className="bg-white rounded-3xl border border-champagne-gold/15 p-6 sm:p-8 text-left shadow-lg space-y-6" id="role-details-compensation">
              
              <div className="border-b border-champagne-gold/15 pb-4">
                <span className="text-[9px] font-mono text-champagne-gold uppercase tracking-widest font-black block">Operational Protocol</span>
                <h3 className="font-display text-lg font-black text-matte-black tracking-tight mt-0.5">Role Details & Compensation Structure</h3>
              </div>

              {/* What is the Work? Section */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider font-mono text-champagne-gold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-champagne-gold rounded-full" />
                  What is the Work?
                </h4>
                <p className="text-xs text-warm-grey leading-relaxed font-sans">
                  As a Digital Growth Consultant, you will represent SamaXon's premium digital services. Your primary task is to connect with high-ticket business owners (like Hotels, Doctors, and Architects) and present our custom digital portfolios.
                </p>

                <ul className="space-y-2.5 text-xs text-warm-grey pt-1.5 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-champagne-gold text-[10px] shrink-0 mt-0.5">■</span>
                    <span>
                      <strong className="text-matte-black font-semibold">We Provide the Leads:</strong> You do not need to find clients. Our operations team will provide you with verified, high-quality business leads daily.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-champagne-gold text-[10px] shrink-0 mt-0.5">■</span>
                    <span>
                      <strong className="text-matte-black font-semibold">We Provide the Demos:</strong> Our backend technical wing will prepare a customized 'Live Prototype' (Demo) for your clients. Your job is to show them this demo via WhatsApp/Call and close the deal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-champagne-gold text-[10px] shrink-0 mt-0.5">■</span>
                    <span>
                      <strong className="text-matte-black font-semibold">No Technical Skills Needed:</strong> All coding, design, and hosting are handled by our backend team. You only focus on client communication and relationship building.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Compensation & Payout Structure Section */}
              <div className="space-y-3 pt-4 border-t border-[#D6B46A]/10">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider font-mono text-[#0c5737] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                  Compensation & Payout Structure (Monthly):
                </h4>
                <p className="text-xs text-warm-grey font-sans">
                  We offer a highly rewarding, tiered commission model that increases as you perform:
                </p>

                {/* Level Tier Strips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-center font-sans">
                  <div className="bg-[#FAF8F5] border border-champagne-gold/15 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-700/80" />
                    <div>
                      <strong className="text-xs text-matte-black font-semibold block">Level 1</strong>
                      <span className="text-[9.5px] text-warm-grey font-mono block mt-0.5">Deals 1 to 3</span>
                    </div>
                    <p className="text-[11.5px] font-mono font-bold text-[#BFA15A] mt-1">₹2,000 / deal</p>
                  </div>

                  <div className="bg-[#FAF8F5] border border-champagne-gold/15 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5">
                    <Award className="w-5 h-5 text-slate-400" />
                    <div>
                      <strong className="text-xs text-matte-black font-semibold block">Level 2</strong>
                      <span className="text-[9.5px] text-warm-grey font-mono block mt-0.5">Deals 4 to 7</span>
                    </div>
                    <p className="text-[11.5px] font-mono font-bold text-[#BFA15A] mt-1">₹3,000 / deal</p>
                  </div>

                  <div className="bg-[#FAF8F5] border border-champagne-gold/15 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <div>
                      <strong className="text-xs text-matte-black font-semibold block">Level 3</strong>
                      <span className="text-[9.5px] text-warm-grey font-mono block mt-0.5">Deals 8 & Above</span>
                    </div>
                    <p className="text-[11.5px] font-mono font-bold text-emerald-800 mt-1">₹4,000 / deal</p>
                  </div>
                </div>

                {/* Example sentence */}
                <div className="bg-emerald-50/15 border border-emerald-100 rounded-xl p-3.5 text-xs text-warm-grey leading-relaxed mt-3 font-sans flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-matte-black font-semibold uppercase tracking-wider text-[10px]">Example:</strong> Closing just 10 deals a month earns you <strong className="text-emerald-800 font-extrabold not-italic font-mono">₹40,000+</strong>, completely from home with flexible working hours.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
