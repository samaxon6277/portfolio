import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Sparkles, Smile, Loader2, Award, Briefcase, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import { CAREER_EXPECTATIONS } from '../data';
import { CareerApplication } from '../types';
import { supabaseService } from '../utils/supabaseService';

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    roleInterestedIn: 'Digital Growth Consultant',
    experience: '',
    whySamaXon: '',
    portfolioUrl: '',
    resumeUrl: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'WhatsApp phone number is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email address is required';
    if (!formData.city.trim()) errors.city = 'Your current location is required';
    if (!formData.experience.trim()) errors.experience = 'Please indicate your experience details';
    if (!formData.whySamaXon.trim()) errors.whySamaXon = 'Please tell us why you wish to join SamaXon';
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const newApplication: CareerApplication = {
      id: `apps-${Date.now()}`,
      ...formData,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    // Save synchronously to local database fallback and asynchronously to Supabase
    try {
      await supabaseService.upsertCareer(newApplication);
    } catch (err) {
      console.error('Direct Supabase career application insert failed, but saved locally:', err);
    }

    // Commits brief premium feedback loader timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        roleInterestedIn: 'Digital Growth Consultant',
        experience: '',
        whySamaXon: '',
        portfolioUrl: '',
        resumeUrl: ''
      });
    }, 1000);
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="careers-page">
      <SEO 
        title="Join Us - Digital Growth Consultant Roles"
        description="We are building a remote-first team of sharp, disciplined, growth-minded people. Review role details and submit your SamaXon application."
        canonicalPath="/careers"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-champagne-gold/15 pb-12">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Remote-First Elite Careers
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            Join SamaXon as <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-matte-black">
              A Digital Growth Consultant.
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            We are building a highly curated team of sharp, disciplined, performance-minded professionals across India to help enterprise founders upgrade their obsolete digital footprints.
          </p>
        </div>

        {/* --- MAIN STRUCTURE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details column */}
          <div className="lg:col-span-6 text-left space-y-10">
            
            {/* Role Introduction */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-champagne-gold uppercase tracking-wider font-bold block">
                The Mission
              </span>
              <h2 className="font-display text-2xl font-bold text-matte-black">
                Who is a Digital Growth Consultant?
              </h2>
              <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
                As a Growth Consultant with SamaXon, you sit on the frontline of consultative transformation. You engage with ambitious enterprise business owners, diagnose vulnerabilities in their online presence, explain the immense advantages of speed, and coordinate their customized mockup briefs with our Senior engineering pipeline.
              </p>
            </div>

            {/* Who and Expectations list */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-champagne-gold uppercase tracking-wider font-bold block">
                What We Look For
              </span>
              <h2 className="font-display text-2xl font-bold text-matte-black">
                Role Expectations
              </h2>
              
              <div className="space-y-4" id="expectations-stack">
                {CAREER_EXPECTATIONS.map((exp, idx) => (
                  <div key={idx} className="p-5 bg-white border border-champagne-gold/15 rounded-2xl">
                    <h4 className="font-display font-semibold text-sm text-matte-black uppercase tracking-wide flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-champagne-gold" />
                      {exp.title}
                    </h4>
                    <p className="text-xs text-warm-grey leading-relaxed mt-1">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional info badge */}
            <div className="p-6 bg-matte-black text-soft-ivory rounded-3xl border border-champagne-gold/25 flex gap-3">
              <Briefcase className="w-6 h-6 text-champagne-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wide text-soft-ivory">Self-Driven compensation Structures:</h4>
                <p className="text-xs text-[#C5BCAE] leading-relaxed mt-1">
                  We reward pure discipline and closure volume. Growth Consultants receive high recurring margins on builds concluded, alongside custom accelerators for monthly milestones.
                </p>
              </div>
            </div>

          </div>

          {/* Form Column */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[40px] border border-champagne-gold/15 p-8 sm:p-10 text-left relative overflow-hidden shadow-xl" id="career-form-container">
              
              <div className="border-b border-champagne-gold/10 pb-6 mb-8">
                <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest font-bold">RECRUITMENT PIPELINE</span>
                <h3 className="font-display font-semibold text-xl text-matte-black mt-1">Apply to Join SamaXon</h3>
                <p className="text-[11px] text-warm-grey">Complete the questions below. Back-end structures will catalog your submission.</p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4" id="career-form-success">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-matte-black">Application Received</h4>
                  <p className="text-xs text-warm-grey max-w-sm mx-auto leading-relaxed">
                    Our Senior team will review your responses and portfolio links. If your discipline aligns with SamaXon's culture, we will trigger a direct consultation pipeline.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-matte-black text-[#F8F4EE] hover:text-champagne-gold text-xs font-mono uppercase tracking-widest rounded-xl"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" id="careers-form">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Full Name *</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Advait Nair"
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                        formErrors.name ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.name}</span>}
                  </div>

                  {/* WhatsApp/Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">WhatsApp Number *</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                          formErrors.phone ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.phone && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Email Address *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. advis@gmail.com"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                          formErrors.email ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.email && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.email}</span>}
                    </div>
                  </div>

                  {/* City and Role Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Current City, India *</label>
                      <input 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                        className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                          formErrors.city ? 'border-red-400' : 'border-champagne-gold/15'
                        }`}
                      />
                      {formErrors.city && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.city}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Interested Role</label>
                      <select 
                        name="roleInterestedIn"
                        value={formData.roleInterestedIn}
                        onChange={handleInputChange}
                        className="w-full bg-pearl-white p-3.5 border border-champagne-gold/15 text-xs text-matte-black rounded-xl cursor-pointer"
                      >
                        <option value="Digital Growth Consultant">Digital Growth Consultant</option>
                        <option value="Associate Partner Consultant">Associate Partner Consultant</option>
                      </select>
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Outline Your Experience *</label>
                    <textarea 
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Specify your background in sales, marketing, consulting or tech client management..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                        formErrors.experience ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.experience && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.experience}</span>}
                  </div>

                  {/* Why do you want to join */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Why do you want to join SamaXon? *</label>
                    <textarea 
                      name="whySamaXon"
                      value={formData.whySamaXon}
                      onChange={handleInputChange}
                      placeholder="Tell us what drives you most to move with speed alongside senior tech builders..."
                      rows={3}
                      className={`w-full bg-pearl-white/40 border p-3.5 text-xs text-matte-black rounded-xl ${
                        formErrors.whySamaXon ? 'border-red-400' : 'border-champagne-gold/15'
                      }`}
                    />
                    {formErrors.whySamaXon && <span className="text-[10px] text-red-500 font-mono font-medium">{formErrors.whySamaXon}</span>}
                  </div>

                  {/* LinkedIn / Portfolio */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Portfolio / LinkedIn Profile Link</label>
                    <input 
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className="w-full bg-pearl-white/40 border border-champagne-gold/15 p-3.5 text-xs text-matte-black rounded-xl"
                    />
                  </div>

                  {/* Resume URL placeholder */}
                  <div className="flex flex-col gap-2 pb-2">
                    <label className="text-[10px] font-mono uppercase text-charcoal font-bold">Resume Link (PDF URL or Google Drive Link)</label>
                    <input 
                      type="text"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="Upload your resume to Drive or Dropbox and paste the public link here"
                      className="w-full bg-pearl-white/40 border border-champagne-gold/15 p-3.5 text-xs text-matte-black rounded-xl"
                    />
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-warm-grey uppercase">
                      <FileText className="w-3.5 h-3.5 text-champagne-gold" />
                      <span>Resume Link should be publicly accessible</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold uppercase tracking-widest text-[10px] rounded-xl border border-champagne-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-champagne-gold" />
                        Processing Application Structures...
                      </>
                    ) : (
                      <>
                        Apply to Join SamaXon
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
