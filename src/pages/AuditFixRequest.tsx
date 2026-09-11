import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Shield, AlertTriangle, CheckCircle2, XCircle, ArrowRight, 
  Clock, Check, Sparkles, Phone, Mail, Globe, Lock, Code2, 
  Terminal, ExternalLink, HelpCircle, ArrowLeft, MessageSquare 
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabaseService } from '../utils/supabaseService';
import { SITE_CONFIG } from '../config/siteConfig';
import { WebsiteAuditLead } from '../types';

export default function AuditFixRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load audit data from navigation state, query params, or session storage
  const [auditData, setAuditData] = useState<any>(() => {
    if (location.state?.report) return location.state.report;
    try {
      const stored = sessionStorage.getItem('samaxon_last_audit');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const targetUrl = auditData?.url || searchParams.get('url') || '';
  const initialScore = auditData?.scores?.overall || Number(searchParams.get('score')) || 58;

  // Selected issues state
  const criticalIssues = auditData?.issues?.critical || [];
  const warningIssues = auditData?.issues?.warning || [];
  const rawIssues = [...criticalIssues, ...warningIssues];

  const defaultTopIssues = rawIssues.length > 0 ? rawIssues : (!auditData ? [
    {
      category: 'security',
      severity: 'critical',
      title: 'Missing Content Security Policy & Insecure Headers',
      description: 'Host lacks CSP and HSTS headers, exposing client sessions to XSS and Clickjacking.',
      recommendation: 'Deploy strict Content-Security-Policy and HSTS headers.'
    },
    {
      category: 'code',
      severity: 'warning',
      title: 'CSS Animation Jank & Layout Thrashing',
      description: 'Geometric animation properties (top, left, width, height) trigger continuous browser reflows.',
      recommendation: 'Replace layout animations with GPU transform & opacity; add prefers-reduced-motion.'
    },
    {
      category: 'performance',
      severity: 'critical',
      title: 'Slow Server Response Latency (TTFB)',
      description: 'Server Time to First Byte exceeds thresholds, hurting Core Web Vitals and conversions.',
      recommendation: 'Enable edge caching, query optimization, and Gzip/Brotli compression.'
    },
    {
      category: 'seo',
      severity: 'warning',
      title: 'Missing JSON-LD Structured Data Schema',
      description: 'Lacks schema.org structured markup for rich search engine snippets.',
      recommendation: 'Implement Organization and LocalBusiness schema markup.'
    }
  ] : []);

  const preselectedTitle = location.state?.preselectedIssue;
  const [selectedIssues, setSelectedIssues] = useState<string[]>(() => {
    if (preselectedTitle) {
      return [preselectedTitle];
    }
    return defaultTopIssues.map(i => i.title);
  });

  // Form states
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState(targetUrl);
  const [priority, setPriority] = useState<'urgent_48h' | 'high' | 'standard'>('urgent_48h');
  const [clientNotes, setClientNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketNumber: string;
    leadId: string;
    websiteUrl: string;
  } | null>(null);

  useEffect(() => {
    if (targetUrl && !websiteUrl) {
      setWebsiteUrl(targetUrl);
    }
  }, [targetUrl]);

  const toggleIssue = (title: string) => {
    setSelectedIssues(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const selectAllIssues = () => {
    setSelectedIssues(defaultTopIssues.map(i => i.title));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!clientName.trim() || !email.trim() || !phone.trim() || !websiteUrl.trim()) {
      setSubmitError('Please fill in your name, email, phone/WhatsApp, and target website URL.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    const issuesToFix = defaultTopIssues.filter(i => selectedIssues.includes(i.title));
    const randomTicket = `AUDIT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const leadRecord: WebsiteAuditLead = {
      id: newId,
      ticketNumber: randomTicket,
      clientName: clientName.trim(),
      businessName: businessName.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      websiteUrl: websiteUrl.trim(),
      overallScore: auditData?.scores?.overall || initialScore,
      securityScore: auditData?.scores?.security || 60,
      seoScore: auditData?.scores?.seo || 65,
      codeScore: auditData?.scores?.code || 55,
      performanceScore: auditData?.scores?.performance || 50,
      criticalIssuesCount: auditData?.issues?.critical?.length || 1,
      warningIssuesCount: auditData?.issues?.warning?.length || 3,
      topIssues: issuesToFix,
      missingKeywords: auditData?.keywords?.missingKeywords || [],
      animationIssues: auditData?.animationAnalysis?.nonCompositedFound || [],
      internalPages: auditData?.internalPages || [],
      clientNotes: clientNotes.trim() || `Requested remediation for ${selectedIssues.length} identified issues.`,
      priority,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Dual persistence via supabaseService
      await supabaseService.upsertWebsiteAuditLead(leadRecord);

      // 2. Server-side ingestion & instant Telegram alerting
      try {
        const res = await fetch('/api/submit-audit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord)
        });
        const json = await res.json();
        if (json.ticketNumber) {
          leadRecord.ticketNumber = json.ticketNumber;
        }
      } catch (srvErr) {
        console.warn('Server-side lead dispatch notice:', srvErr);
      }

      setSubmittedTicket({
        ticketNumber: leadRecord.ticketNumber,
        leadId: leadRecord.id,
        websiteUrl: leadRecord.websiteUrl
      });
    } catch (err: any) {
      console.error('Audit lead submission failed:', err);
      setSubmitError('Submission failed. Please check your connection or contact us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhoneForWa = (phone || SITE_CONFIG.phoneWhatsapp).replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/919999999999?text=${encodeURIComponent(
    `Hello SamaXon Team, I submitted Audit Fix Request Ticket #${submittedTicket?.ticketNumber || 'NEW'} for website: ${websiteUrl}. Please inspect and guide next steps.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-28 pb-24 text-[#111111] relative selection:bg-[#D6B46A]/30">
      {/* Background radial glow */}
      <div className="absolute top-0 inset-x-0 h-96 pointer-events-none bg-gradient-to-b from-[#D6B46A]/10 via-transparent to-transparent -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8A8178] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Audit Results</span>
          </button>

          <span className="text-[11px] font-mono text-[#D6B46A] bg-[#111111] px-3 py-1 rounded-full font-bold">
            SamaXon 48-Hour Remediation Portal
          </span>
        </div>

        {!submittedTicket ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-left space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
                Technical Vulnerability &amp; Bug Remediation
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
                Fix Website Problems &amp; Optimize Code
              </h1>
              <p className="text-sm text-[#8A8178] max-w-2xl leading-relaxed">
                Submit your website audit details below. Our senior engineers will resolve security vulnerabilities, eliminate animation jank, accelerate server latency, and configure proper SEO architecture in 48 hours.
              </p>
            </div>

            {/* Diagnostic Target Card */}
            <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] tracking-wider block">
                  Target Website Under Review
                </span>
                <div className="flex items-center gap-2 font-display font-black text-lg text-[#111111] break-all">
                  <Globe className="w-4 h-4 text-[#D6B46A] shrink-0" />
                  <span>{websiteUrl || 'Pending URL Input'}</span>
                </div>
                <div className="text-xs text-[#8A8178] flex items-center gap-3 pt-1">
                  <span>Audit Grade: <strong className="text-[#111111]">{initialScore}/100</strong></span>
                  <span>·</span>
                  <span className={criticalIssues.length > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-semibold"}>
                    {criticalIssues.length} Critical
                  </span>
                  <span>·</span>
                  <span className={warningIssues.length > 0 ? "text-amber-600 font-bold" : "text-emerald-600 font-semibold"}>
                    {warningIssues.length} Warnings
                  </span>
                </div>
              </div>

              <div className="shrink-0 bg-[#F4EFE6] px-4 py-2.5 rounded-2xl border border-[#D6B46A]/30 text-center">
                <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Turnaround SLA</span>
                <span className="font-display font-black text-sm text-[#111111] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D6B46A]" /> Under 48 Hours
                </span>
              </div>
            </div>

            {/* Detected Issues Selection Checklist */}
            <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6B46A]/15 pb-4">
                <div>
                  <h3 className="font-display font-black text-base text-[#111111]">
                    Select Problems to Be Resolved
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Check the items you want our engineering team to inspect and fix on your website.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={selectAllIssues}
                  className="text-xs font-mono font-bold text-[#BFA15A] hover:text-[#111111] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  ✓ Select All Detected Issues
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {defaultTopIssues.length > 0 ? (
                  defaultTopIssues.map((issue, idx) => {
                    const isChecked = selectedIssues.includes(issue.title);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIssue(issue.title)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                          isChecked 
                            ? 'bg-[#F4EFE6]/50 border-[#D6B46A]' 
                            : 'bg-white border-black/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIssue(issue.title)}
                          className="mt-1 w-4 h-4 rounded text-[#111111] border-[#D6B46A] focus:ring-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-black text-sm text-[#111111]">
                              {issue.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                              issue.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {issue.severity}
                            </span>
                            <span className="text-[10px] font-mono uppercase text-[#8A8178]">
                              {issue.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#8A8178] leading-relaxed">
                            {issue.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center bg-[#F4EFE6]/40 rounded-2xl border border-[#D6B46A]/20 space-y-1">
                    <p className="font-display font-bold text-sm text-[#111111]">
                      No Critical or Warning Issues Detected in Scan
                    </p>
                    <p className="text-xs text-[#8A8178]">
                      Your website passed all baseline checks. You can describe custom optimization, speed, or security requirements in the notes below.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#D6B46A]/15 pb-4 text-left">
                <h3 className="font-display font-black text-lg text-[#111111]">
                  Your Contact &amp; Business Information
                </h3>
                <p className="text-xs text-[#8A8178]">
                  Where should we send the technical diagnosis and fix proposal?
                </p>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-sm text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#111111] transition-all"
                  />
                </div>

                {/* Business / Brand Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-4 py-3 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-sm text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#111111] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-sm text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#111111] transition-all"
                  />
                </div>

                {/* WhatsApp / Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    WhatsApp / Direct Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-sm text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#111111] transition-all"
                  />
                </div>

                {/* Website URL */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    Website URL to Fix <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={websiteUrl}
                    onChange={e => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-sm text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#111111] transition-all font-mono"
                  />
                </div>

                {/* Priority Selection */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    Desired Fix Timeline
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'urgent_48h', label: 'Emergency (Under 48h)', tag: 'Priority Escalation' },
                      { id: 'high', label: 'High Priority (3-4 Days)', tag: 'Standard Sprint' },
                      { id: 'standard', label: 'Regular Fix (1 Week)', tag: 'Standard Queue' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          priority === p.id 
                            ? 'bg-[#111111] text-white border-[#111111] shadow-sm' 
                            : 'bg-[#F4EFE6]/30 border-[#D6B46A]/30 text-[#111111] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                          {p.tag}
                        </span>
                        <span className="font-display font-black text-xs block mt-0.5">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Client Notes */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111111] block">
                    Additional Instructions or Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={clientNotes}
                    onChange={e => setClientNotes(e.target.value)}
                    placeholder="Provide any additional context, hosting environment (WordPress, Next.js, PHP), or specific bugs noticed..."
                    className="w-full px-4 py-3 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-sm text-[#111111] placeholder:text-[#8A8178]/60 focus:outline-none focus:border-[#111111] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] font-display font-black text-sm uppercase tracking-widest rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Remediation Queue...</span>
                ) : (
                  <>
                    <span>Submit Website for 48-Hour Engineering Fix</span>
                    <ArrowRight className="w-4 h-4 text-[#D6B46A]" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-[11px] text-[#8A8178] pt-1">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> Non-Disclosure Protected
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B46A]" /> Zero Downtime Guarantee
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation View */
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
                Ticket Ingested Successfully
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
                Your 48-Hour Remediation Ticket Is Active
              </h2>
              <p className="text-sm text-[#8A8178] max-w-md mx-auto leading-relaxed">
                We have assigned ticket <strong className="font-mono text-[#111111]">#{submittedTicket.ticketNumber}</strong> for <span className="font-mono text-[#111111]">{submittedTicket.websiteUrl}</span>. Our engineering team has received your detected issue report.
              </p>
            </div>

            {/* Ticket Info Card */}
            <div className="max-w-md mx-auto p-5 bg-[#F4EFE6]/60 border border-[#D6B46A]/30 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Reference Ticket:</span>
                <span className="font-mono font-bold text-[#111111]">#{submittedTicket.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Website URL:</span>
                <span className="font-mono font-bold text-[#111111] truncate max-w-[200px]">{submittedTicket.websiteUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Priority SLA:</span>
                <span className="font-bold text-emerald-700 uppercase">{priority.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Admin Notification:</span>
                <span className="font-bold text-emerald-700">Dispatched &amp; Queued</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>

              <button
                onClick={() => navigate('/tools/analyzer')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] font-display font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Run Another Website Audit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
