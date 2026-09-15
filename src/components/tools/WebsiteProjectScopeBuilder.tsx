import React, { useState, useMemo } from 'react';
import { 
  FileText, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, 
  Layers, ShoppingBag, Calendar, ShieldCheck, Globe, Database, 
  RotateCcw, Copy, Download, Printer, AlertTriangle, HelpCircle, Check, 
  DollarSign, Clock, Users, ArrowRight, Eye, Edit3
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomStepper from '../ui/CustomStepper';
import CustomSelect from '../ui/CustomSelect';
import FormField from '../ui/FormField';
import CustomExportControls from '../ui/CustomExportControls';
import CustomEmptyState from '../ui/CustomEmptyState';
import CustomErrorState from '../ui/CustomErrorState';

interface ScopeFormData {
  // Step 1: Identity & Objectives
  businessName: string;
  businessCategory: string;
  projectType: string;
  mainObjective: string;
  targetAudience: string;
  timelinePreference: string;
  budgetRange: string;

  // Step 2: Architecture & Pages
  pageCount: string;
  selectedPages: string[];
  customPages: string;

  // Step 3: Features & Capabilities
  selectedFeatures: string[];
  selectedIntegrations: string[];
  hasEcommerce: boolean;
  hasBooking: boolean;
  hasAdminPanel: boolean;
  hasMultilingual: boolean;

  // Conditional: E-commerce
  ecommerceProductsCount: string;
  ecommercePaymentGateway: string;
  ecommerceShipping: string;
  ecommerceInventory: string;

  // Conditional: Booking
  bookingType: string;
  bookingStaff: string;
  bookingPayment: string;

  // Conditional: Admin
  adminRoles: string;
  adminCapabilities: string[];

  // Conditional: Multilingual
  targetLanguages: string;
  translationResponsibility: string;

  // Step 4: Assets & Responsibilities
  contentResponsibility: string;
  assetAvailability: string;
  hostingStatus: string;
  excludedItems: string;
  specialRequirements: string;
}

const INITIAL_DATA: ScopeFormData = {
  businessName: '',
  businessCategory: '',
  projectType: 'New website',
  mainObjective: 'Inbound Qualified Lead Generation',
  targetAudience: '',
  timelinePreference: '48-Hour Rapid Delivery',
  budgetRange: '$2,000 – $5,000',

  pageCount: '5–10 Pages',
  selectedPages: ['Homepage / Hero Experience', 'About / Pedigree', 'Core Services & Offerings', 'Portfolio / Case Studies', 'Contact & Ingestion'],
  customPages: '',

  selectedFeatures: ['Instant Lead Dispatch (WhatsApp / Email)', 'Mobile-First Responsive Layout', 'Core Web Vitals Optimization', 'High-Contrast Luxury Styling'],
  selectedIntegrations: ['Google Analytics 4', 'WhatsApp Business Link', 'Custom Lead Routing Webhook'],
  hasEcommerce: false,
  hasBooking: false,
  hasAdminPanel: false,
  hasMultilingual: false,

  ecommerceProductsCount: '1–25 Products',
  ecommercePaymentGateway: 'Stripe & Razorpay',
  ecommerceShipping: 'Flat Rate & Regional Courier Rules',
  ecommerceInventory: 'Basic Stock Count with Out-of-Stock Badges',

  bookingType: 'Service Appointments & Consultations',
  bookingStaff: 'Single Staff / Unified Calendar',
  bookingPayment: 'Free Consultation with Verification',

  adminRoles: 'Super Admin & Content Editor',
  adminCapabilities: ['Edit Page Copy & Images', 'View & Export Inbound Leads', 'Manage Blog Articles'],

  targetLanguages: 'English, Hindi',
  translationResponsibility: 'Client Provides Verified Translations',

  contentResponsibility: 'Hybrid (Client supplies outline, Agency polishes copy)',
  assetAvailability: 'Logo & brand colors ready, Photography needed',
  hostingStatus: 'Domain active, Needs high-performance Cloud Run setup',
  excludedItems: 'Mobile native app development, ongoing monthly PPC ad management, photography photoshoots.',
  specialRequirements: ''
};

export default function WebsiteProjectScopeBuilder() {
  const { showToast, showConfirm } = useCustomUi();
  const [formData, setFormData] = useState<ScopeFormData>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'identity', label: '1. Foundation', description: 'Business & Type' },
    { id: 'sitemap', label: '2. Architecture', description: 'Pages & Hierarchy' },
    { id: 'features', label: '3. Features', description: 'Modules & Logic' },
    { id: 'responsibilities', label: '4. Boundaries', description: 'Assets & Exclusions' },
    { id: 'review', label: '5. Scope Dossier', description: 'Generated Statement' }
  ];

  const standardPagesList = [
    'Homepage / Hero Experience',
    'About / Pedigree',
    'Core Services & Offerings',
    'Portfolio / Case Studies',
    'Pricing & Investment Plans',
    'Contact & Ingestion',
    'Blog & Knowledge Base',
    'Client Reviews / Testimonials',
    'FAQ / Discovery Information',
    'Careers / Team Portal',
    'Privacy Policy & Legal Terms'
  ];

  const standardFeaturesList = [
    'Instant Lead Dispatch (WhatsApp / Email)',
    'Mobile-First Responsive Layout',
    'Core Web Vitals Optimization',
    'High-Contrast Luxury Styling',
    'Interactive Cost / ROI Calculator',
    'Search & Advanced Filters',
    'Dark / Light Theme Toggle',
    'Interactive Service Sandbox'
  ];

  const standardIntegrationsList = [
    'Google Analytics 4',
    'Google Search Console',
    'WhatsApp Business Link',
    'Telegram Alert Bot',
    'Stripe / Razorpay Checkout',
    'Supabase Database Leads',
    'Custom CRM Webhooks'
  ];

  const togglePageSelection = (page: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPages: prev.selectedPages.includes(page)
        ? prev.selectedPages.filter(p => p !== page)
        : [...prev.selectedPages, page]
    }));
  };

  const toggleFeatureSelection = (feat: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feat)
        ? prev.selectedFeatures.filter(f => f !== feat)
        : [...prev.selectedFeatures, feat]
    }));
  };

  const toggleIntegrationSelection = (integ: string) => {
    setFormData(prev => ({
      ...prev,
      selectedIntegrations: prev.selectedIntegrations.includes(integ)
        ? prev.selectedIntegrations.filter(i => i !== integ)
        : [...prev.selectedIntegrations, integ]
    }));
  };

  // Validation
  const validateStep = (stepIndex: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!formData.businessName.trim()) {
        errors.businessName = 'Enter the client or project business name.';
      }
      if (!formData.businessCategory.trim()) {
        errors.businessCategory = 'Select or enter the primary industry/category.';
      }
      if (!formData.targetAudience.trim()) {
        errors.targetAudience = 'Describe the target customer or user profile.';
      }
    }

    if (stepIndex === 1) {
      if (formData.selectedPages.length === 0 && !formData.customPages.trim()) {
        errors.selectedPages = 'Select at least one page or list custom pages.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setActiveView('preview');
      }
    } else {
      showToast('Please resolve the required fields before continuing.', 'warning');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleReset = () => {
    showConfirm({
      title: 'Reset Project Scope Builder?',
      message: 'All questionnaire responses will be cleared. Do you wish to restart?',
      confirmText: 'Reset All',
      cancelText: 'Continue Editing',
      onConfirm: () => {
        setFormData(INITIAL_DATA);
        setCurrentStep(0);
        setActiveView('editor');
        setValidationErrors({});
        showToast('Scope builder cleared.', 'info');
      }
    });
  };

  // Generate Scope Document (Markdown)
  const generatedScopeMarkdown = useMemo(() => {
    const allPages = [
      ...formData.selectedPages,
      ...formData.customPages.split('\n').map(p => p.trim()).filter(Boolean)
    ];

    let md = `# Statement of Work & Technical Project Scope\n`;
    md += `**Client / Business:** ${formData.businessName || '[Client Organization]'}\n`;
    md += `**Industry Domain:** ${formData.businessCategory || '[Industry]'}\n`;
    md += `**Engagement Type:** ${formData.projectType}\n`;
    md += `**Target Completion Timeline:** ${formData.timelinePreference}\n`;
    md += `**Target Investment Framework:** ${formData.budgetRange}\n`;
    md += `**Date of Execution:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}\n\n`;
    md += `---\n\n`;

    md += `## 1. Executive Summary & Core Business Objectives\n`;
    md += `The primary engagement mandate is to engineer a high-performance, conversion-engineered digital asset for **${formData.businessName || 'the Client'}**. `;
    md += `The platform is calibrated specifically to achieve: **${formData.mainObjective}**.\n\n`;
    md += `- **Primary Strategic Objective:** ${formData.mainObjective}\n`;
    md += `- **Target Audience Persona:** ${formData.targetAudience || 'Modern commercial decision-makers seeking speed and reliability.'}\n\n`;

    md += `## 2. In-Scope Deliverables & Page Architecture\n`;
    md += `The scoped deployment consists of approximately **${formData.pageCount}**, structured with responsive accessibility, high-contrast typography, and sub-second page performance:\n\n`;
    allPages.forEach((page, idx) => {
      md += `${idx + 1}. **${page}**\n`;
    });
    md += `\n`;

    md += `## 3. Functional Modules & Technical Specifications\n`;
    formData.selectedFeatures.forEach(feat => {
      md += `- **${feat}**: Implemented using modular component architecture, server-side validation, and instant feedback.\n`;
    });
    md += `\n`;

    if (formData.hasEcommerce) {
      md += `### E-Commerce Infrastructure Addendum\n`;
      md += `- **Product Catalog Depth:** ${formData.ecommerceProductsCount}\n`;
      md += `- **Payment Processing Gateway:** ${formData.ecommercePaymentGateway}\n`;
      md += `- **Logistics & Shipping Rules:** ${formData.ecommerceShipping}\n`;
      md += `- **Inventory Control:** ${formData.ecommerceInventory}\n\n`;
    }

    if (formData.hasBooking) {
      md += `### Real-Time Scheduling Engine Addendum\n`;
      md += `- **Booking Mechanism:** ${formData.bookingType}\n`;
      md += `- **Staff / Calendar Allocation:** ${formData.bookingStaff}\n`;
      md += `- **Payment / Reservation Confirmation:** ${formData.bookingPayment}\n\n`;
    }

    if (formData.hasAdminPanel) {
      md += `### Client Administration Portal Addendum\n`;
      md += `- **Role-Based Access Control:** ${formData.adminRoles}\n`;
      md += `- **Permitted Administrative Operations:** ${formData.adminCapabilities.join(', ')}\n\n`;
    }

    if (formData.hasMultilingual) {
      md += `### Multilingual Architecture Addendum\n`;
      md += `- **Configured Locales:** ${formData.targetLanguages}\n`;
      md += `- **Translation Responsibility:** ${formData.translationResponsibility}\n\n`;
    }

    md += `## 4. Third-Party Integrations & External Webhooks\n`;
    formData.selectedIntegrations.forEach(integ => {
      md += `- **${integ}**: Verified credentials and webhook dispatch pipelines configured.\n`;
    });
    md += `\n`;

    md += `## 5. Content Responsibilities & Asset Roadmap\n`;
    md += `- **Copywriting Responsibility:** ${formData.contentResponsibility}\n`;
    md += `- **Visual Asset Readiness:** ${formData.assetAvailability}\n`;
    md += `- **Hosting & Infrastructure Environment:** ${formData.hostingStatus}\n\n`;

    md += `## 6. Out-of-Scope Items (Strict Functional Boundaries)\n`;
    md += `To ensure timeline adherence and transparent delivery standards, the following services are explicitly excluded from this contract unless commissioned via a formal amendment:\n\n`;
    md += `${formData.excludedItems}\n\n`;

    md += `## 7. Client Responsibilities & Critical Dependencies\n`;
    md += `1. Provide domain DNS access or nameserver delegation within 24 hours of staging approval.\n`;
    md += `2. Supply all third-party API keys (payment gateways, CRM webhooks) via secure communication channels.\n`;
    md += `3. Appoint a single authorized stakeholder with final milestone sign-off authority to avoid review delays.\n\n`;

    md += `## 8. Milestone Suggestions & Approval Checkpoints\n`;
    md += `- **Sprint 1: Clickable Prototype & Technical Architecture** (0–48 Hours) -> Milestone Checkpoint 1\n`;
    md += `- **Sprint 2: Module Assembly & Third-Party Integration** (Days 3–5) -> Milestone Checkpoint 2\n`;
    md += `- **Sprint 3: Core Web Vitals Auditing & Production Launch** (Days 6–7) -> Final Deployment Sign-Off\n\n`;

    md += `## 9. Discovery Call Discussion Points\n`;
    md += `1. Confirm exact merchant account onboarding status for payment processing.\n`;
    md += `2. Verify existing domain registrar provider (GoDaddy, Cloudflare, Namecheap) to plan DNS cutover.\n`;
    md += `3. Finalize transactional email sender address (e.g. hello@${formData.businessName ? formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'brand'}.com).\n\n`;

    md += `---\n*Generated by SamaXon Digital Solutions Project Scope Engine. Formal execution requires signature by authorized representatives of both parties.*\n`;
    return md;
  }, [formData]);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `website-project-scope-${Date.now()}.json`);
    dlAnchor.click();
    showToast('Project scope JSON exported.', 'success');
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([generatedScopeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-project-scope-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Markdown scope downloaded.', 'success');
  };

  const handleExportTxt = () => {
    const textContent = generatedScopeMarkdown.replace(/#/g, '').replace(/\*\*/g, '');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-project-scope-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Plain text scope downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="project-scope-builder-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Statement of Work Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView(activeView === 'editor' ? 'preview' : 'editor')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15"
              >
                {activeView === 'editor' ? <Eye className="w-3.5 h-3.5 text-[#D6B46A]" /> : <Edit3 className="w-3.5 h-3.5 text-[#D6B46A]" />}
                <span>{activeView === 'editor' ? 'Preview Dossier' : 'Edit Inputs'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15"
                title="Reset all inputs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website Project Scope Builder
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Translate client requirements into an ironclad Statement of Work (SOW) detailing deliverable hierarchies, feature specifications, third-party integrations, asset obligations, and boundary exclusions.
          </p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <CustomStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => {
          setCurrentStep(step);
          setActiveView('editor');
        }}
        allowStepClick={true}
      />

      {/* Workspace Area */}
      {activeView === 'preview' || currentStep === 4 ? (
        /* Preview / Result Mode */
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900">
                Generated Statement of Work & Technical Scope
              </h3>
              <p className="text-xs text-neutral-500">
                Structured specification ready for client discovery sign-off or agency quotation.
              </p>
            </div>

            <CustomExportControls
              onExportMarkdown={handleExportMarkdown}
              onExportJson={handleExportJson}
              onExportTxt={handleExportTxt}
              onPrint={() => window.print()}
              copyText={generatedScopeMarkdown}
              copyLabel="Copy Scope Document"
            />
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-sm text-neutral-800 leading-relaxed space-y-6">
            <div className="prose prose-sm max-w-none font-sans space-y-4">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-neutral-800 bg-neutral-50/70 p-6 rounded-2xl border border-neutral-100">
                {generatedScopeMarkdown}
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                setActiveView('editor');
                setCurrentStep(3);
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step 4: Boundaries</span>
            </button>
          </div>
        </div>
      ) : (
        /* Editor Mode */
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-8 animate-fade-in">
          {/* STEP 1: Foundation */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Step 1: Project Identity & Business Foundation
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Define the core entity, strategic ambition, and delivery parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Business or Brand Name"
                  required
                  error={validationErrors.businessName}
                  description="Legal or commercial name of the client organization."
                >
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Royal Mirage Luxury Banquets"
                    className="w-full h-11 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                  />
                </FormField>

                <FormField
                  label="Industry & Sector"
                  required
                  error={validationErrors.businessCategory}
                  description="Primary business domain."
                >
                  <input
                    type="text"
                    value={formData.businessCategory}
                    onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                    placeholder="e.g. Hospitality & Event Venues"
                    className="w-full h-11 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                  />
                </FormField>

                <CustomSelect
                  label="Engagement / Project Type"
                  value={formData.projectType}
                  onChange={(val) => setFormData({ ...formData, projectType: val })}
                  options={[
                    { value: 'New website', label: 'New Website (Greenfield Architecture)' },
                    { value: 'Website redesign', label: 'Website Redesign (Modernization & Speed)' },
                    { value: 'Landing page', label: 'High-Conversion Landing Page' },
                    { value: 'E-commerce website', label: 'E-Commerce Online Store' },
                    { value: 'Booking website', label: 'Appointment & Reservation Platform' },
                    { value: 'Corporate website', label: 'Corporate B2B Authority Portal' },
                    { value: 'Web application', label: 'Custom Full-Stack Web Application' },
                    { value: 'CMS website', label: 'Editorial / Media CMS Portal' }
                  ]}
                />

                <CustomSelect
                  label="Primary Conversion Mandate"
                  value={formData.mainObjective}
                  onChange={(val) => setFormData({ ...formData, mainObjective: val })}
                  options={[
                    { value: 'Inbound Qualified Lead Generation', label: 'Inbound Qualified Lead Generation' },
                    { value: 'Direct Transactional Checkout & Sales', label: 'Direct Transactional Checkout & Sales' },
                    { value: 'Client Appointment & Table Reservations', label: 'Client Appointment & Table Reservations' },
                    { value: 'Brand Prestige & Domain Authority', label: 'Brand Prestige & Domain Authority' },
                    { value: 'Interactive Product Catalog & Quote Requests', label: 'Interactive Product Catalog & Quote Requests' }
                  ]}
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Target Customer Profile & Personas"
                    required
                    error={validationErrors.targetAudience}
                    description="Who is the end user and what are their primary expectations?"
                  >
                    <textarea
                      rows={2}
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      placeholder="e.g. High-net-worth wedding planners and corporate event coordinators who demand rapid response and transparent venue specifications."
                      className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                    />
                  </FormField>
                </div>

                <CustomSelect
                  label="Target Delivery Timeline"
                  value={formData.timelinePreference}
                  onChange={(val) => setFormData({ ...formData, timelinePreference: val })}
                  options={[
                    { value: '48-Hour Rapid Delivery', label: '48-Hour Rapid Delivery (SamaXon Standard)', badge: 'Express' },
                    { value: '1–2 Weeks', label: '1–2 Weeks (Standard Sprint)' },
                    { value: '3–4 Weeks', label: '3–4 Weeks (Extended Multi-Phase)' },
                    { value: 'Flexible / Discovery First', label: 'Flexible / Discovery Phase First' }
                  ]}
                />

                <CustomSelect
                  label="Target Investment Tier"
                  value={formData.budgetRange}
                  onChange={(val) => setFormData({ ...formData, budgetRange: val })}
                  options={[
                    { value: 'Under $2,000', label: 'Under $2,000 (Essential Launchpad)' },
                    { value: '$2,000 – $5,000', label: '$2,000 – $5,000 (Professional Growth)' },
                    { value: '$5,000 – $12,000', label: '$5,000 – $12,000 (Enterprise Custom)' },
                    { value: '$12,000+', label: '$12,000+ (Comprehensive Platform)' }
                  ]}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Architecture & Pages */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Step 2: Information Architecture & Page Inventory
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Select core templates and specify required structural pages.
                </p>
              </div>

              <div className="space-y-4">
                <CustomSelect
                  label="Estimated Total Page Count"
                  value={formData.pageCount}
                  onChange={(val) => setFormData({ ...formData, pageCount: val })}
                  options={[
                    { value: '1–3 Pages (Single Page / Micro)', label: '1–3 Pages (High-Conversion Micro)' },
                    { value: '5–10 Pages (Standard Corporate)', label: '5–10 Pages (Standard Corporate)' },
                    { value: '10–25 Pages (Comprehensive Portal)', label: '10–25 Pages (Comprehensive Portal)' },
                    { value: '25+ Pages (Multi-Category Catalog)', label: '25+ Pages (Enterprise Catalog)' }
                  ]}
                />

                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                    Select In-Scope Page Templates
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {standardPagesList.map(page => {
                      const isSelected = formData.selectedPages.includes(page);
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => togglePageSelection(page)}
                          className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A] shadow-xs'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          <span className="truncate">{page}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {validationErrors.selectedPages && (
                    <p className="text-xs text-rose-600 font-medium mt-2" role="alert">
                      {validationErrors.selectedPages}
                    </p>
                  )}
                </div>

                <FormField
                  label="Custom Pages or Niche URLs (One per line)"
                  description="List any proprietary or niche pages unique to this client."
                >
                  <textarea
                    rows={3}
                    value={formData.customPages}
                    onChange={(e) => setFormData({ ...formData, customPages: e.target.value })}
                    placeholder="e.g. VIP Banquet Booking Portal&#10;Catering Menu Interactive Viewer&#10;Virtual 3D Tour Showcase"
                    className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 3: Features & Conditional Logic */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Step 3: Functional Modules & Third-Party Integrations
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Activate custom capability modules and external SaaS connections.
                </p>
              </div>

              {/* Core Features */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Core Interactive Features
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {standardFeaturesList.map(feat => {
                    const isSelected = formData.selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeatureSelection(feat)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A] shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        <span>{feat}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Major Conditional Modules */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                  Complex Modules (Select to reveal specific questions)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer text-center transition-all ${
                    formData.hasEcommerce ? 'bg-white border-[#D6B46A] shadow-xs' : 'bg-neutral-100/60 border-neutral-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasEcommerce}
                      onChange={(e) => setFormData({ ...formData, hasEcommerce: e.target.checked })}
                      className="hidden"
                    />
                    <ShoppingBag className={`w-5 h-5 ${formData.hasEcommerce ? 'text-[#D6B46A]' : 'text-neutral-400'}`} />
                    <span className="text-xs font-bold">E-Commerce</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer text-center transition-all ${
                    formData.hasBooking ? 'bg-white border-[#D6B46A] shadow-xs' : 'bg-neutral-100/60 border-neutral-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasBooking}
                      onChange={(e) => setFormData({ ...formData, hasBooking: e.target.checked })}
                      className="hidden"
                    />
                    <Calendar className={`w-5 h-5 ${formData.hasBooking ? 'text-[#D6B46A]' : 'text-neutral-400'}`} />
                    <span className="text-xs font-bold">Reservations</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer text-center transition-all ${
                    formData.hasAdminPanel ? 'bg-white border-[#D6B46A] shadow-xs' : 'bg-neutral-100/60 border-neutral-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasAdminPanel}
                      onChange={(e) => setFormData({ ...formData, hasAdminPanel: e.target.checked })}
                      className="hidden"
                    />
                    <Database className={`w-5 h-5 ${formData.hasAdminPanel ? 'text-[#D6B46A]' : 'text-neutral-400'}`} />
                    <span className="text-xs font-bold">Admin Portal</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer text-center transition-all ${
                    formData.hasMultilingual ? 'bg-white border-[#D6B46A] shadow-xs' : 'bg-neutral-100/60 border-neutral-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasMultilingual}
                      onChange={(e) => setFormData({ ...formData, hasMultilingual: e.target.checked })}
                      className="hidden"
                    />
                    <Globe className={`w-5 h-5 ${formData.hasMultilingual ? 'text-[#D6B46A]' : 'text-neutral-400'}`} />
                    <span className="text-xs font-bold">Multilingual</span>
                  </label>
                </div>
              </div>

              {/* Dynamic Questions: E-commerce */}
              {formData.hasEcommerce && (
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>E-Commerce Scope Specifics</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                      label="Initial SKU / Product Quantity"
                      value={formData.ecommerceProductsCount}
                      onChange={(val) => setFormData({ ...formData, ecommerceProductsCount: val })}
                      options={[
                        { value: '1–25 Products', label: '1–25 Products' },
                        { value: '26–100 Products', label: '26–100 Products' },
                        { value: '100–500 Products', label: '100–500 Products' },
                        { value: '500+ Large Inventory', label: '500+ Large Inventory' }
                      ]}
                    />
                    <CustomSelect
                      label="Payment Processing Gateway"
                      value={formData.ecommercePaymentGateway}
                      onChange={(val) => setFormData({ ...formData, ecommercePaymentGateway: val })}
                      options={[
                        { value: 'Stripe & Razorpay', label: 'Stripe & Razorpay (Cards, UPI, Netbanking)' },
                        { value: 'PayPal & Stripe', label: 'PayPal & Stripe (Global Credit Cards)' },
                        { value: 'Cash On Delivery / Offline Invoice', label: 'Cash on Delivery with Phone Verification' }
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Questions: Booking */}
              {formData.hasBooking && (
                <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Reservation & Booking Parameters</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                      label="Booking Nature"
                      value={formData.bookingType}
                      onChange={(val) => setFormData({ ...formData, bookingType: val })}
                      options={[
                        { value: 'Service Appointments & Consultations', label: 'Service Appointments (Time-slot based)' },
                        { value: 'Banquet & Venue Full-Day Reservations', label: 'Banquet / Venue (Date-range or Hall based)' },
                        { value: 'Multi-seat Workshop / Event Tickets', label: 'Event Ticketing with Capacity Caps' }
                      ]}
                    />
                    <CustomSelect
                      label="Staff & Resource Allocation"
                      value={formData.bookingStaff}
                      onChange={(val) => setFormData({ ...formData, bookingStaff: val })}
                      options={[
                        { value: 'Single Staff / Unified Calendar', label: 'Single Unified Venue Calendar' },
                        { value: 'Multi-staff / Individual Specialists', label: 'Multi-Staff Routing' }
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Third-party Integrations */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Third-Party Integrations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {standardIntegrationsList.map(integ => {
                    const isSelected = formData.selectedIntegrations.includes(integ);
                    return (
                      <button
                        key={integ}
                        type="button"
                        onClick={() => toggleIntegrationSelection(integ)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A] shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        <span className="truncate">{integ}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Responsibilities & Boundaries */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Step 4: Asset Responsibilities & Out-of-Scope Exclusions
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Clarify client vs agency duties to avoid scope creep.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CustomSelect
                  label="Content & Copywriting Responsibility"
                  value={formData.contentResponsibility}
                  onChange={(val) => setFormData({ ...formData, contentResponsibility: val })}
                  options={[
                    { value: 'Hybrid (Client supplies outline, Agency polishes copy)', label: 'Hybrid (Client outline + Agency polish)' },
                    { value: 'Client Provides 100% Final Copy', label: 'Client Provides 100% Final Copy' },
                    { value: 'Agency Full Copywriting Engagement', label: 'Agency Writes Full Copy from Interviews' }
                  ]}
                />

                <CustomSelect
                  label="Graphic & Brand Asset Readiness"
                  value={formData.assetAvailability}
                  onChange={(val) => setFormData({ ...formData, assetAvailability: val })}
                  options={[
                    { value: 'Logo & brand colors ready, Photography needed', label: 'Logo ready, Stock photos needed' },
                    { value: 'Complete Brand Identity Pack (Vector logo, typography, high-res photos)', label: 'Complete brand pack ready' },
                    { value: 'Needs Logo & Identity Design as well', label: 'Requires brand design from scratch' }
                  ]}
                />

                <CustomSelect
                  label="Hosting & Production Infrastructure"
                  value={formData.hostingStatus}
                  onChange={(val) => setFormData({ ...formData, hostingStatus: val })}
                  options={[
                    { value: 'Domain active, Needs high-performance Cloud Run setup', label: 'Domain active, needs Cloud Run setup' },
                    { value: 'Client has existing cPanel / VPS hosting', label: 'Client has existing cPanel / VPS' },
                    { value: 'Brand new project, needs domain & hosting procurement', label: 'Needs domain & hosting procurement' }
                  ]}
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Explicit Out-of-Scope Exclusions"
                    description="Items specifically NOT included in this engagement to avoid misunderstandings."
                  >
                    <textarea
                      rows={3}
                      value={formData.excludedItems}
                      onChange={(e) => setFormData({ ...formData, excludedItems: e.target.value })}
                      placeholder="e.g. Mobile app development (iOS/Android), ongoing ad spend, content migration for legacy 500 blog posts."
                      className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>{currentStep === 3 ? 'Generate Statement of Work' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
