import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, 
  Copy, Download, Printer, Save, RotateCcw, Building2, Target, 
  Users, Layers, Cpu, Palette, FileSpreadsheet, Clock, Globe, 
  Mail, Check, HelpCircle, AlertCircle, ShoppingCart, Calendar, 
  Languages, Shield, Lock, FileText, Send, CheckSquare
} from 'lucide-react';
import { 
  DiscoveryFormData, 
  INITIAL_DISCOVERY_FORM, 
  BUSINESS_CATEGORIES, 
  STANDARD_PAGE_OPTIONS, 
  AVAILABLE_FEATURES, 
  ASSET_ITEMS, 
  BUDGET_TIERS, 
  LAUNCH_TIMELINES,
  calculateReadinessScore,
  generateDiscoveryMarkdownSummary,
  generateDiscoveryJson,
  saveQuestionnaireProgress,
  loadQuestionnaireProgress,
  clearQuestionnaireProgress,
  PageRequirementItem,
  AssetReadinessStatus
} from '../../utils/clientDiscoveryTypes';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomInput from '../ui/CustomInput';
import CustomTextarea from '../ui/CustomTextarea';
import CustomCheckbox from '../ui/CustomCheckbox';
import CustomSelect from '../CustomSelect';
import CustomSwitch from '../ui/CustomSwitch';
import FormField from '../ui/FormField';

const STEPS = [
  { num: 1, title: 'Business Overview', icon: Building2 },
  { num: 2, title: 'Project Objectives', icon: Target },
  { num: 3, title: 'Target Audience', icon: Users },
  { num: 4, title: 'Website Pages', icon: Layers },
  { num: 5, title: 'Features & Architecture', icon: Cpu },
  { num: 6, title: 'Design & Brand', icon: Palette },
  { num: 7, title: 'Content Readiness', icon: FileSpreadsheet },
  { num: 8, title: 'Timeline & Budget', icon: Clock },
  { num: 9, title: 'Current Presence', icon: Globe },
  { num: 10, title: 'Contact & Review', icon: Mail }
];

export default function ClientDiscoveryQuestionnaire() {
  const { showToast, showConfirm } = useCustomUi();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DiscoveryFormData>(() => {
    return loadQuestionnaireProgress() || INITIAL_DISCOVERY_FORM;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    submittedAt: string;
    success: boolean;
  } | null>(null);

  const [customPageName, setCustomPageName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-save form progress to localStorage
  useEffect(() => {
    saveQuestionnaireProgress(formData);
  }, [formData]);

  const readinessResult = useMemo(() => {
    return calculateReadinessScore(formData.assetReadiness);
  }, [formData.assetReadiness]);

  // Form field updater
  const updateField = <K extends keyof DiscoveryFormData>(key: K, value: DiscoveryFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForm = () => {
    showConfirm({
      title: 'Reset Discovery Questionnaire',
      message: 'Are you sure you want to clear all questionnaire responses? This cannot be undone.',
      confirmText: 'Reset All',
      cancelText: 'Cancel',
      onConfirm: () => {
        clearQuestionnaireProgress();
        setFormData(INITIAL_DISCOVERY_FORM);
        setStep(1);
        setSubmissionResult(null);
        showToast('Questionnaire reset to default.', 'info');
      }
    });
  };

  // Step Validation logic before advancing
  const validateCurrentStep = (): boolean => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        showToast('Please specify your Business or Brand Name.', 'warning');
        return false;
      }
    } else if (step === 2) {
      if (formData.objectives.length === 0) {
        showToast('Please select at least one project objective.', 'warning');
        return false;
      }
    } else if (step === 4) {
      if (formData.selectedPages.length === 0) {
        showToast('Please select at least one page for your website sitemap.', 'warning');
        return false;
      }
    } else if (step === 10) {
      if (!formData.fullName.trim()) {
        showToast('Please enter your full name.', 'warning');
        return false;
      }
      if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) {
        showToast('Please enter a valid business email address.', 'warning');
        return false;
      }
      if (!formData.phone.trim()) {
        showToast('Please enter a contact phone or WhatsApp number.', 'warning');
        return false;
      }
      if (!formData.consentAgreed) {
        showToast('Please accept the consent checkbox before submitting.', 'warning');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => Math.min(STEPS.length, prev + 1));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Submit to Server endpoint
  const handleSubmitQuestionnaire = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tools/submit-questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        // Still generate client-side fallback if server fails
        const fallbackRef = `SMX-DISC-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmissionResult({
          referenceId: fallbackRef,
          submittedAt: new Date().toLocaleString(),
          success: true
        });
        showToast('Discovery questionnaire recorded locally with reference number.', 'success');
      } else {
        setSubmissionResult({
          referenceId: result.referenceId,
          submittedAt: result.submittedAt || new Date().toLocaleString(),
          success: true
        });
        showToast('Discovery brief submitted successfully to SamaXon!', 'success');
      }
    } catch (err) {
      const fallbackRef = `SMX-DISC-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionResult({
        referenceId: fallbackRef,
        submittedAt: new Date().toLocaleString(),
        success: true
      });
      showToast('Discovery questionnaire prepared successfully!', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle page in sitemap
  const togglePage = (pageName: string) => {
    const exists = formData.selectedPages.find(p => p.name === pageName);
    if (exists) {
      updateField('selectedPages', formData.selectedPages.filter(p => p.name !== pageName));
    } else {
      updateField('selectedPages', [
        ...formData.selectedPages,
        { id: `page-${Date.now()}`, name: pageName, quantity: 1, notes: '' }
      ]);
    }
  };

  const addCustomPage = () => {
    if (!customPageName.trim()) return;
    updateField('selectedPages', [
      ...formData.selectedPages,
      { id: `custom-${Date.now()}`, name: customPageName.trim(), quantity: 1, notes: '', isCustom: true }
    ]);
    setCustomPageName('');
    showToast(`Added "${customPageName.trim()}" to sitemap.`, 'success');
  };

  // Toggle feature in list
  const toggleFeature = (featureName: string) => {
    if (formData.selectedFeatures.includes(featureName)) {
      updateField('selectedFeatures', formData.selectedFeatures.filter(f => f !== featureName));
    } else {
      updateField('selectedFeatures', [...formData.selectedFeatures, featureName]);
    }
  };

  const hasEcommerce = formData.selectedFeatures.includes('E-Commerce / Online Store');
  const hasBooking = formData.selectedFeatures.includes('Online Booking');
  const hasMultilingual = formData.selectedFeatures.includes('Multilingual Support');
  const hasAdmin = formData.selectedFeatures.includes('Custom Admin Dashboard');
  const hasAi = formData.selectedFeatures.includes('AI-Powered Capabilities');

  return (
    <div className="space-y-10 text-left" id="client-discovery-questionnaire-root">
      {/* Top Banner */}
      <div className="bg-[#111111] text-[#FFFDF8] rounded-[28px] p-6 sm:p-10 border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/30 text-[#D6B46A] text-[11px] font-mono uppercase tracking-wider font-bold">
            <Target className="w-3.5 h-3.5" />
            <span>Executive Project Discovery · 10-Stage Strategic Blueprint</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Client Discovery Questionnaire
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Articulate your brand vision, operational requirements, aesthetic expectations, and functional dependencies prior to initiation. Generate an agency-grade discovery dossier with instant export and milestone alignment.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
            <span className="text-neutral-400">
              Readiness Score: <strong className="text-[#D6B46A]">{readinessResult.score}%</strong> ({readinessResult.rating})
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">
              Stage <strong className="text-white">{step} of {STEPS.length}</strong>
            </span>
            <span className="text-neutral-500">•</span>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Reset Answers
            </button>
          </div>
        </div>
      </div>

      {/* Submission Success Screen */}
      {submissionResult ? (
        <div className="bg-white rounded-[28px] border border-[#D6B46A]/30 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D6B46A]/15 text-[#85641C] text-xs font-mono uppercase font-bold">
              Reference: {submissionResult.referenceId}
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#111111]">
              Discovery Dossier Finalized
            </h3>
            <p className="text-sm text-[#8A8178] leading-relaxed">
              Your project blueprint has been compiled. You can now copy the strategic markdown summary, download the developer JSON specification, or export a printable client brief.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => handleCopy(generateDiscoveryMarkdownSummary(formData), 'summary-md', 'Markdown Summary')}
              className="px-5 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              {copiedKey === 'summary-md' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'summary-md' ? 'Copied Markdown!' : 'Copy Formatted Summary'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadFile(generateDiscoveryMarkdownSummary(formData), `discovery-summary-${formData.businessName || 'project'}.md`, 'text/markdown')}
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#85641C]" />
              <span>Download Brief (.MD)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadFile(generateDiscoveryJson(formData), `discovery-spec-${formData.businessName || 'project'}.json`, 'application/json')}
              className="px-5 py-2.5 bg-[#FFFDF8] hover:bg-[#FAF6F0] text-[#111111] border border-[#D6B46A]/40 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#85641C]" />
              <span>Download JSON Schema</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>
          </div>

          {/* Formatted Preview */}
          <div className="space-y-3 pt-6 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Live Document Preview
            </h4>
            <pre className="font-mono text-xs bg-[#FAF8F5] text-neutral-800 p-6 rounded-2xl border border-[#D6B46A]/20 overflow-x-auto max-h-[450px] leading-relaxed select-all">
              {generateDiscoveryMarkdownSummary(formData)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Progress Stepper Bar */}
          <div className="bg-white rounded-2xl border border-[#D6B46A]/25 p-4 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isCurrent = step === s.num;
                const isPassed = step > s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setStep(s.num)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-xl transition-all text-xs cursor-pointer ${
                      isCurrent
                        ? 'bg-[#111111] text-[#D6B46A] font-bold shadow-xs'
                        : isPassed
                        ? 'text-neutral-800 hover:bg-neutral-100 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-[#D6B46A] text-[#111111]'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {isPassed ? '✓' : s.num}
                    </div>
                    <span className="whitespace-nowrap">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Content Container */}
          <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-6 sm:p-10 shadow-sm space-y-8">
            {/* STEP 1: Business Overview */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    1. Business & Brand Overview
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Establish the commercial foundation, legal entity name, and operational footprint.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField id="disc-biz-name" label="Business or Venture Name" required>
                    <CustomInput
                      id="disc-biz-name-input"
                      placeholder="e.g. Apex Luxury Holdings"
                      value={formData.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                    />
                  </FormField>

                  <FormField id="disc-biz-cat" label="Industry Category" required>
                    <CustomSelect
                      value={formData.businessCategory}
                      onChange={(v) => updateField('businessCategory', v)}
                      options={BUSINESS_CATEGORIES}
                    />
                  </FormField>

                  {formData.businessCategory === 'Other (Custom Specify)' && (
                    <FormField id="disc-biz-custom-cat" label="Custom Industry Description" required className="md:col-span-2">
                      <CustomInput
                        placeholder="Specify your specialized niche..."
                        value={formData.customCategory || ''}
                        onChange={(e) => updateField('customCategory', e.target.value)}
                      />
                    </FormField>
                  )}

                  <FormField id="disc-biz-loc" label="Geographic Location / HQ">
                    <CustomInput
                      placeholder="e.g. Dubai, UAE / London, UK / Global Remote"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </FormField>

                  <FormField id="disc-biz-years" label="Years in Operation">
                    <CustomSelect
                      value={formData.yearsInOperation}
                      onChange={(v) => updateField('yearsInOperation', v)}
                      options={['Pre-launch Startup', 'Under 1 Year', '1 – 3 Years', '3 – 5 Years', '5 – 10 Years', '10+ Years Established']}
                      placeholder="Select duration..."
                    />
                  </FormField>
                </div>

                <FormField id="disc-biz-desc" label="Core Business Value Proposition & Overview" description="What makes your company exceptional? What unique advantage do you deliver?">
                  <CustomTextarea
                    rows={4}
                    placeholder="We provide executive wealth preservation advisory for ultra-high-net-worth family offices..."
                    value={formData.businessDescription}
                    onChange={(e) => updateField('businessDescription', e.target.value)}
                  />
                </FormField>

                <FormField id="disc-biz-offerings" label="Primary Products or Services Offered">
                  <CustomInput
                    placeholder="e.g. Architectural Design, Turnkey Interior Fitout, Engineering Consultation"
                    value={formData.mainProductsOrServices}
                    onChange={(e) => updateField('mainProductsOrServices', e.target.value)}
                  />
                </FormField>
              </div>
            )}

            {/* STEP 2: Project Objectives */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    2. Strategic Project Objectives
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Define measurable business outcomes and key performance targets.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                    Select All Desired Outcomes
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Build new website',
                      'Complete brand redesign',
                      'Improve speed & performance',
                      'Dominate search engine SEO',
                      'Generate more qualified leads',
                      'Direct online e-commerce sales',
                      'Appointment & booking flow',
                      'Executive portfolio showcase',
                      'Custom web application / portal',
                      'Automate internal inquiries',
                      'Integrate CRM / ERP pipeline',
                      'International market expansion'
                    ].map((obj) => {
                      const isSelected = formData.objectives.includes(obj);
                      return (
                        <div
                          key={obj}
                          onClick={() => {
                            if (isSelected) {
                              updateField('objectives', formData.objectives.filter(o => o !== obj));
                            } else {
                              updateField('objectives', [...formData.objectives, obj]);
                            }
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                            isSelected
                              ? 'bg-[#111111] border-[#D6B46A] text-white shadow-xs'
                              : 'bg-[#FFFDF8] border-neutral-200 text-neutral-800 hover:border-[#D6B46A]/50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center ${
                            isSelected ? 'bg-[#D6B46A] text-[#111111]' : 'border border-neutral-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-semibold">{obj}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                  <FormField id="disc-primary-obj" label="Single Most Important Project Goal" required>
                    <CustomSelect
                      value={formData.primaryObjective}
                      onChange={(v) => updateField('primaryObjective', v)}
                      options={formData.objectives.length > 0 ? formData.objectives : ['Generate more qualified leads']}
                    />
                  </FormField>

                  <FormField id="disc-obj-exp" label="Quantifiable Milestone Target" description="e.g. Increase monthly lead inquiries from 10 to 50 within 90 days.">
                    <CustomInput
                      placeholder="e.g. Double high-ticket conversion rate"
                      value={formData.objectiveExplanation}
                      onChange={(e) => updateField('objectiveExplanation', e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* STEP 3: Target Audience */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    3. Target Audience & Visitor Dynamics
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Calibrate tone, user journey friction, and behavioral triggers for your ideal customer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField id="disc-audience-prim" label="Who is your ideal paying client?" description="Job titles, demographics, net worth, purchasing power">
                    <CustomInput
                      placeholder="e.g. Managing Directors, VP of Engineering, Luxury Homeowners"
                      value={formData.primaryAudience}
                      onChange={(e) => updateField('primaryAudience', e.target.value)}
                    />
                  </FormField>

                  <FormField id="disc-service-area" label="Service Area Geography">
                    <CustomSelect
                      value={formData.serviceArea}
                      onChange={(v) => updateField('serviceArea', v as any)}
                      options={['Local (City / Region)', 'National (Country-wide)', 'International (Global)']}
                    />
                  </FormField>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                    Client Commercial Segment
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {(['B2B', 'B2C', 'D2C', 'Enterprise', 'High-Net-Worth', 'Government'] as const).map((seg) => {
                      const sel = formData.customerType.includes(seg);
                      return (
                        <button
                          key={seg}
                          type="button"
                          onClick={() => {
                            if (sel) updateField('customerType', formData.customerType.filter(c => c !== seg));
                            else updateField('customerType', [...formData.customerType, seg]);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            sel ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {seg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <FormField id="disc-customer-actions" label="Desired First Action Upon Landing">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      'Submit High-Ticket Inquiry Form',
                      'Instant WhatsApp Conversation',
                      'Book a Consultation Call',
                      'Direct Online Checkout',
                      'Download Whitepaper / Catalog',
                      'Call Directly via Telephone'
                    ].map((act) => {
                      const sel = formData.desiredCustomerActions.includes(act);
                      return (
                        <div
                          key={act}
                          onClick={() => {
                            if (sel) updateField('desiredCustomerActions', formData.desiredCustomerActions.filter(a => a !== act));
                            else updateField('desiredCustomerActions', [...formData.desiredCustomerActions, act]);
                          }}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
                            sel ? 'bg-[#FAF8F5] border-[#D6B46A] text-[#85641C]' : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {act}
                        </div>
                      );
                    })}
                  </div>
                </FormField>
              </div>
            )}

            {/* STEP 4: Website Pages */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    4. Required Page Architecture & Sitemap
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Select pages to include in your navigational structure. Add custom specialized pages if needed.
                  </p>
                </div>

                {/* Page Selection Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {STANDARD_PAGE_OPTIONS.map((page) => {
                    const isSelected = formData.selectedPages.some(p => p.name === page);
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => togglePage(page)}
                        className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A] shadow-xs'
                            : 'bg-[#FFFDF8] text-neutral-800 border-neutral-200 hover:border-[#D6B46A]/50'
                        }`}
                      >
                        <span className="truncate">{page}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Page Row */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1">
                    <CustomInput
                      placeholder="Add custom page (e.g. VIP Concierge, Investor Deck, Calculator)"
                      value={customPageName}
                      onChange={(e) => setCustomPageName(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCustomPage}
                    className="px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold rounded-xl cursor-pointer shadow-xs shrink-0"
                  >
                    Add Page
                  </button>
                </div>

                {/* Selected Sitemap List & Notes */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                    Configured Pages in Scope ({formData.selectedPages.length})
                  </span>
                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
                    {formData.selectedPages.map((pageItem) => (
                      <div key={pageItem.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-neutral-50">
                        <span className="text-xs font-bold text-[#111111] sm:w-1/3 truncate">
                          {pageItem.name}
                        </span>
                        <div className="sm:w-2/3 flex items-center gap-2">
                          <CustomInput
                            placeholder="Specific notes or key modules for this page..."
                            value={pageItem.notes}
                            onChange={(e) => {
                              const updated = formData.selectedPages.map(p => 
                                p.id === pageItem.id ? { ...p, notes: e.target.value } : p
                              );
                              updateField('selectedPages', updated);
                            }}
                            className="text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => togglePage(pageItem.name)}
                            className="text-neutral-400 hover:text-rose-600 p-1.5 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Features & Architecture */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    5. Technical Capabilities & Integrations
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Select dynamic features. Selecting advanced capabilities automatically reveals tailored architectural specifications.
                  </p>
                </div>

                {/* Features Multi-Select Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {AVAILABLE_FEATURES.map((feat) => {
                    const isSelected = formData.selectedFeatures.includes(feat.name);
                    return (
                      <div
                        key={feat.name}
                        onClick={() => toggleFeature(feat.name)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer select-none space-y-1 ${
                          isSelected
                            ? 'bg-[#111111] border-[#D6B46A] text-white shadow-xs'
                            : 'bg-[#FFFDF8] border-neutral-200 text-neutral-800 hover:border-[#D6B46A]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono uppercase font-bold ${
                            isSelected ? 'text-[#D6B46A]' : 'text-neutral-400'
                          }`}>
                            {feat.category}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D6B46A] stroke-[3]" />}
                        </div>
                        <h5 className="text-xs font-bold leading-snug">{feat.name}</h5>
                        <p className={`text-[11px] leading-relaxed ${
                          isSelected ? 'text-neutral-300' : 'text-[#8A8178]'
                        }`}>
                          {feat.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* SMART FOLLOW-UP 1: E-Commerce */}
                {hasEcommerce && (
                  <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#D6B46A]/20 pb-2">
                      <ShoppingCart className="w-4 h-4 text-[#85641C]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        E-Commerce Specification Parameters
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField id="ecom-count" label="Approximate Product Count">
                        <CustomSelect
                          value={formData.ecommerceDetails?.productCount || '1 – 20 items'}
                          onChange={(v) => updateField('ecommerceDetails', {
                            productCount: v,
                            categoriesCount: formData.ecommerceDetails?.categoriesCount || '1 – 5 categories',
                            paymentGateways: formData.ecommerceDetails?.paymentGateways || ['Stripe'],
                            shippingRequirements: formData.ecommerceDetails?.shippingRequirements || '',
                            inventoryManagement: formData.ecommerceDetails?.inventoryManagement || 'manual',
                            customerAccounts: formData.ecommerceDetails?.customerAccounts || 'optional'
                          })}
                          options={['1 – 20 items', '20 – 100 items', '100 – 1,000 items', '1,000+ Enterprise SKU']}
                        />
                      </FormField>

                      <FormField id="ecom-inventory" label="Inventory Management">
                        <CustomSelect
                          value={formData.ecommerceDetails?.inventoryManagement || 'manual'}
                          onChange={(v) => updateField('ecommerceDetails', {
                            ...(formData.ecommerceDetails || {
                              productCount: '1 – 20 items',
                              categoriesCount: '1 – 5 categories',
                              paymentGateways: ['Stripe'],
                              shippingRequirements: '',
                              customerAccounts: 'optional'
                            }),
                            inventoryManagement: v as any
                          })}
                          options={[
                            { value: 'manual', label: 'Manual Admin Entry' },
                            { value: 'automated', label: 'Automated Real-Time Stock' },
                            { value: 'external-erp', label: 'External ERP / Sync' },
                            { value: 'not-needed', label: 'Digital Products / Infinite Stock' }
                          ]}
                        />
                      </FormField>

                      <FormField id="ecom-accounts" label="Customer Accounts Policy">
                        <CustomSelect
                          value={formData.ecommerceDetails?.customerAccounts || 'optional'}
                          onChange={(v) => updateField('ecommerceDetails', {
                            ...(formData.ecommerceDetails || {
                              productCount: '1 – 20 items',
                              categoriesCount: '1 – 5 categories',
                              paymentGateways: ['Stripe'],
                              shippingRequirements: '',
                              inventoryManagement: 'manual'
                            }),
                            customerAccounts: v as any
                          })}
                          options={[
                            { value: 'optional', label: 'Guest or Optional Account' },
                            { value: 'required', label: 'Mandatory Client Account' },
                            { value: 'guest-only', label: 'Guest Checkout Only' }
                          ]}
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {/* SMART FOLLOW-UP 2: Online Booking */}
                {hasBooking && (
                  <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#D6B46A]/20 pb-2">
                      <Calendar className="w-4 h-4 text-[#85641C]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        Online Booking & Appointment Parameters
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="book-type" label="Booking Paradigm">
                        <CustomSelect
                          value={formData.bookingDetails?.bookingType || 'consultations'}
                          onChange={(v) => updateField('bookingDetails', {
                            bookingType: v as any,
                            dateTimeSlots: formData.bookingDetails?.dateTimeSlots || 'fixed',
                            staffAvailability: formData.bookingDetails?.staffAvailability || false,
                            cancellationRules: formData.bookingDetails?.cancellationRules || '',
                            requiresUpfrontPayment: formData.bookingDetails?.requiresUpfrontPayment || false
                          })}
                          options={[
                            { value: 'consultations', label: '1-on-1 Consultation Call' },
                            { value: 'appointments', label: 'Physical In-Office Appointment' },
                            { value: 'group-events', label: 'Group Workshop / Masterclass' },
                            { value: 'resource-rental', label: 'Venue or Equipment Rental' }
                          ]}
                        />
                      </FormField>

                      <div className="flex items-center pt-6">
                        <CustomSwitch
                          id="book-upfront-pay"
                          checked={formData.bookingDetails?.requiresUpfrontPayment || false}
                          onChange={(chk) => updateField('bookingDetails', {
                            ...(formData.bookingDetails || {
                              bookingType: 'consultations',
                              dateTimeSlots: 'fixed',
                              staffAvailability: false,
                              cancellationRules: ''
                            }),
                            requiresUpfrontPayment: chk
                          })}
                          label="Upfront Deposit / Payment Required"
                          description="Charge consultation fee during slot confirmation"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SMART FOLLOW-UP 3: AI Capabilities */}
                {hasAi && (
                  <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#D6B46A]/20 pb-2">
                      <Sparkles className="w-4 h-4 text-[#85641C]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        Artificial Intelligence Functionality Scope
                      </h4>
                    </div>

                    <FormField id="ai-reqs" label="Desired AI Task / Prompt Specification">
                      <CustomInput
                        placeholder="e.g. 24/7 intelligent concierge trained on our knowledge base to answer client pricing questions"
                        value={formData.aiDetails?.expectedInputsOutputs || ''}
                        onChange={(e) => updateField('aiDetails', {
                          aiFunctions: formData.aiDetails?.aiFunctions || ['chatbot'],
                          expectedInputsOutputs: e.target.value,
                          privacyConstraints: formData.aiDetails?.privacyConstraints || 'Strict server-side Gemini invocation'
                        })}
                      />
                    </FormField>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: Design & Brand */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    6. Creative Aesthetic & Brand Direction
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Inform the visual architecture, typography pairing, and emotional resonance of the site.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField id="disc-design-style" label="Visual Aesthetic Archetype">
                    <CustomSelect
                      value={formData.visualStyle}
                      onChange={(v) => updateField('visualStyle', v)}
                      options={[
                        'Luxury & Architectural (Champagne, Obsidian, Negative Space)',
                        'Ultra-Minimalist & Modern (Clean White, High Contrast Typography)',
                        'Corporate & Institutional (Deep Navy, Slate Gray, Structured Grid)',
                        'Bold & High-Energy (Vibrant Accents, Large Headlines, Bento Layout)',
                        'Warm Editorial & Humanist (Cream Backdrops, Serif Baselines)',
                        'Open to SamaXon Creative Recommendation'
                      ]}
                    />
                  </FormField>

                  <FormField id="disc-logo-status" label="Brand Logo Availability">
                    <CustomSelect
                      value={formData.hasLogo}
                      onChange={(v) => updateField('hasLogo', v as any)}
                      options={[
                        { value: 'yes-final', label: 'Yes, finalized vector logo available' },
                        { value: 'yes-needs-redesign', label: 'Yes, but requires modern redesign' },
                        { value: 'no-need-created', label: 'No logo yet, need new brand identity' }
                      ]}
                    />
                  </FormField>
                </div>

                <FormField id="disc-brand-colors" label="Brand Color Palette Preferences">
                  <CustomInput
                    placeholder="e.g. Deep Charcoal #111111, Brushed Gold #D6B46A, Off-White #FFFDF8"
                    value={formData.brandColors}
                    onChange={(e) => updateField('brandColors', e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField id="disc-liked-sites" label="Reference Websites You Admire (URLs)" description="What websites inspire you visually or functionally?">
                    <CustomInput
                      placeholder="https://example1.com, https://example2.com"
                      value={formData.referenceWebsitesLiked}
                      onChange={(e) => updateField('referenceWebsitesLiked', e.target.value)}
                    />
                  </FormField>

                  <FormField id="disc-disliked-sites" label="Design Elements to Strictly Avoid" description="e.g. No generic stock photos, no autoplay music, no cluttered sidebars">
                    <CustomInput
                      placeholder="e.g. Cluttered animations, neon colors, aggressive popups"
                      value={formData.websitesDisliked}
                      onChange={(e) => updateField('websitesDisliked', e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* STEP 7: Content Readiness */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-xl text-[#111111]">
                      7. Content & Asset Readiness Matrix
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold">
                        Readiness Score:
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                        readinessResult.score >= 70 ? 'bg-emerald-100 text-emerald-800' :
                        readinessResult.score >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {readinessResult.score}% ({readinessResult.rating})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8A8178]">
                    Evaluate content assets to determine whether copy sprint or photography acquisition is needed.
                  </p>
                </div>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
                  {ASSET_ITEMS.map((item) => {
                    const currentStatus = formData.assetReadiness[item.key] || 'need-help';
                    return (
                      <div key={item.key} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-neutral-50">
                        <div className="space-y-0.5 sm:w-1/2">
                          <span className="text-xs font-bold text-[#111111] block">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-[#8A8178] block">
                            {item.description}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 sm:w-1/2 justify-start sm:justify-end">
                          {[
                            { id: 'available', label: 'Ready', color: 'bg-emerald-100 text-emerald-800' },
                            { id: 'partial', label: 'Draft', color: 'bg-blue-100 text-blue-800' },
                            { id: 'need-help', label: 'Need Help', color: 'bg-amber-100 text-amber-800' },
                            { id: 'not-available', label: 'None', color: 'bg-neutral-100 text-neutral-600' }
                          ].map((pill) => (
                            <button
                              key={pill.id}
                              type="button"
                              onClick={() => {
                                updateField('assetReadiness', {
                                  ...formData.assetReadiness,
                                  [item.key]: pill.id as AssetReadinessStatus
                                });
                              }}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                                currentStatus === pill.id
                                  ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                              }`}
                            >
                              {pill.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 8: Timeline & Budget */}
            {step === 8 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    8. Timeline, Budget & Governance
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Align expectations on milestone delivery cadence and investment parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField id="disc-timeline" label="Desired Launch Milestone">
                    <CustomSelect
                      value={formData.desiredLaunchTimeline}
                      onChange={(v) => updateField('desiredLaunchTimeline', v)}
                      options={LAUNCH_TIMELINES}
                    />
                  </FormField>

                  <FormField id="disc-budget" label="Anticipated Investment Budget Tier">
                    <CustomSelect
                      value={formData.budgetTier}
                      onChange={(v) => updateField('budgetTier', v)}
                      options={BUDGET_TIERS}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <FormField id="disc-decision" label="Decision Making & Approval Cadence">
                    <CustomSelect
                      value={formData.decisionMakingStatus}
                      onChange={(v) => updateField('decisionMakingStatus', v)}
                      options={[
                        'Ready to proceed immediately upon approval of proposal',
                        'Internal board or committee review required',
                        'Comparing proposals from 2-3 design agencies',
                        'Preliminary research phase for upcoming quarter'
                      ]}
                    />
                  </FormField>

                  <FormField id="disc-comm-pref" label="Preferred Direct Communication Channel">
                    <CustomSelect
                      value={formData.preferredCommunicationChannel}
                      onChange={(v) => updateField('preferredCommunicationChannel', v)}
                      options={['WhatsApp Direct Priority', 'Email Correspondence', 'Scheduled Zoom / Google Meet Call']}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* STEP 9: Current Presence */}
            {step === 9 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    9. Existing Digital Footprint
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Audit legacy infrastructure to preserve search rankings, backlinks, and domain reputation.
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <CustomSwitch
                    id="has-existing-site-toggle"
                    checked={formData.hasExistingWebsite}
                    onChange={(checked) => updateField('hasExistingWebsite', checked)}
                    label="Does your business currently have an active website?"
                    description="Toggle on if this is a redesign or migration of an existing URL"
                  />
                </div>

                {formData.hasExistingWebsite ? (
                  <div className="space-y-5 pt-2">
                    <FormField id="disc-current-url" label="Current Website URL" required>
                      <CustomInput
                        placeholder="https://yourcurrentwebsite.com"
                        value={formData.existingWebsiteUrl || ''}
                        onChange={(e) => updateField('existingWebsiteUrl', e.target.value)}
                      />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField id="disc-works-well" label="What works well on your current site?">
                        <CustomInput
                          placeholder="e.g. Existing blog articles bring steady traffic"
                          value={formData.whatWorksWell || ''}
                          onChange={(e) => updateField('whatWorksWell', e.target.value)}
                        />
                      </FormField>

                      <FormField id="disc-pain-points" label="Main Frustrations / Pain Points">
                        <CustomInput
                          placeholder="e.g. Very slow load speed, poor mobile layout, low conversion"
                          value={formData.whatCausesProblems || ''}
                          onChange={(e) => updateField('whatCausesProblems', e.target.value)}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <FormField id="acc-domain" label="Domain Access (DNS)">
                        <CustomSelect
                          value={formData.accessToDomain}
                          onChange={(v) => updateField('accessToDomain', v as any)}
                          options={[
                            { value: 'yes', label: 'Yes, full login access' },
                            { value: 'unsure', label: 'Unsure / Need check' },
                            { value: 'no', label: 'No access / Managed by 3rd party' }
                          ]}
                        />
                      </FormField>

                      <FormField id="acc-hosting" label="Hosting Access">
                        <CustomSelect
                          value={formData.accessToHosting}
                          onChange={(v) => updateField('accessToHosting', v as any)}
                          options={[
                            { value: 'yes', label: 'Yes, full access' },
                            { value: 'unsure', label: 'Unsure' },
                            { value: 'no', label: 'No access' }
                          ]}
                        />
                      </FormField>

                      <FormField id="acc-analytics" label="Google Analytics Access">
                        <CustomSelect
                          value={formData.accessToAnalytics}
                          onChange={(v) => updateField('accessToAnalytics', v as any)}
                          options={[
                            { value: 'yes', label: 'Yes, full access' },
                            { value: 'unsure', label: 'Unsure' },
                            { value: 'no', label: 'Not currently installed' }
                          ]}
                        />
                      </FormField>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-[#8A8178] bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/20">
                    This will be a brand new digital platform built from the ground up on modern architecture.
                  </div>
                )}
              </div>
            )}

            {/* STEP 10: Contact & Review */}
            {step === 10 && (
              <div className="space-y-6">
                <div className="space-y-1 border-b border-neutral-100 pb-4">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    10. Contact Details & Review
                  </h3>
                  <p className="text-xs text-[#8A8178]">
                    Verify recipient information for proposal delivery and confirm review consent.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField id="disc-fullname" label="Full Name" required>
                    <CustomInput
                      id="disc-fullname-input"
                      placeholder="e.g. Jonathan Vance"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                    />
                  </FormField>

                  <FormField id="disc-email" label="Business Email" required>
                    <CustomInput
                      id="disc-email-input"
                      type="email"
                      placeholder="jonathan@company.com"
                      value={formData.businessEmail}
                      onChange={(e) => updateField('businessEmail', e.target.value)}
                    />
                  </FormField>

                  <FormField id="disc-phone" label="Phone / WhatsApp Number" required>
                    <CustomInput
                      id="disc-phone-input"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                  </FormField>
                </div>

                <FormField id="disc-notes" label="Additional Notes or Specific Expectations">
                  <CustomTextarea
                    rows={3}
                    placeholder="Any specific architectural preferences, deadline sensitivities, or executive notes..."
                    value={formData.additionalNotes}
                    onChange={(e) => updateField('additionalNotes', e.target.value)}
                  />
                </FormField>

                {/* Consent Checkbox */}
                <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl space-y-2">
                  <CustomCheckbox
                    id="disc-consent-checkbox"
                    checked={formData.consentAgreed}
                    onChange={(chk) => updateField('consentAgreed', chk)}
                    label="I authorize SamaXon Digital Solutions to review this project scope and prepare a tailored architectural proposal."
                    description="Your commercial information is strictly confidential and protected by our privacy charter."
                  />
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Continue to Step {step + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuestionnaire}
                  disabled={isSubmitting || !formData.consentAgreed}
                  className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all ${
                    isSubmitting || !formData.consentAgreed
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-[#111111] hover:bg-[#222222] text-[#D6B46A] cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <Sparkles className="w-4 h-4 animate-spin text-[#D6B46A]" />
                  ) : (
                    <Send className="w-4 h-4 text-[#D6B46A]" />
                  )}
                  <span>{isSubmitting ? 'Compiling Dossier...' : 'Submit Discovery Dossier'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
