import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, FileText, Download, Copy, Printer, Check, 
  HelpCircle, Eye, RefreshCw, Lock, Globe, AlertCircle, Sparkles
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomSelect from '../ui/CustomSelect';
import CustomTabs from '../ui/CustomTabs';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomExportControls from '../ui/CustomExportControls';
import FormField from '../ui/FormField';

interface PrivacyPolicyInputs {
  companyName: string;
  websiteName: string;
  websiteUrl: string;
  contactEmail: string;
  physicalAddress: string;
  jurisdiction: string;
  effectiveDate: string;
  collectsPersonalData: boolean;
  collectsDeviceLogs: boolean;
  collectsPaymentInfo: boolean;
  collectsLocationData: boolean;
  usesAnalytics: boolean;
  analyticsTool: string;
  usesPaymentGateways: boolean;
  paymentGateways: string;
  usesEmailProviders: boolean;
  retentionPeriod: string;
  hasDpo: boolean;
  dpoEmail: string;
}

const DEFAULT_INPUTS: PrivacyPolicyInputs = {
  companyName: 'SamaXon Digital Solutions LLP',
  websiteName: 'SamaXon Digital',
  websiteUrl: 'https://samaxon.site',
  contactEmail: 'contact@samaxon.site',
  physicalAddress: 'Sector 62, Noida, Uttar Pradesh 201301, India',
  jurisdiction: 'India (Digital Personal Data Protection Act & Global Standards)',
  effectiveDate: new Date().toISOString().split('T')[0],
  collectsPersonalData: true,
  collectsDeviceLogs: true,
  collectsPaymentInfo: true,
  collectsLocationData: false,
  usesAnalytics: true,
  analyticsTool: 'Google Analytics 4 & Internal Telemetry',
  usesPaymentGateways: true,
  paymentGateways: 'Razorpay, Stripe, and Direct Bank Transfers',
  usesEmailProviders: true,
  retentionPeriod: '24 months following conclusion of service engagement',
  hasDpo: true,
  dpoEmail: 'privacy@samaxon.site'
};

export default function WebsitePrivacyInformationBuilder() {
  const { showToast, showConfirm } = useCustomUi();
  const [inputs, setInputs] = useState<PrivacyPolicyInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<'policy' | 'summary' | 'html'>('policy');

  const generatedPolicy = useMemo(() => {
    let text = `# Privacy Policy for ${inputs.websiteName}\n\n`;
    text += `**Effective Date:** ${inputs.effectiveDate}\n`;
    text += `**Last Updated:** ${inputs.effectiveDate}\n\n`;
    text += `---\n\n`;

    text += `## 1. Introduction & Organizational Commitment\n`;
    text += `${inputs.companyName} ("we", "our", or "us"), operating the digital platform located at [${inputs.websiteUrl}](${inputs.websiteUrl}), is strictly committed to protecting the privacy, confidentiality, and integrity of the personal data shared by our users, clients, and visitors ("you" or "user").\n\n`;
    text += `This Privacy Policy outlines the categories of data we collect, our lawful bases for processing, data storage and security measures, third-party sub-processors, and your individual statutory rights in compliance with applicable privacy regulations, including the Digital Personal Data Protection Act (DPDPA), the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).\n\n`;

    text += `## 2. Information We Collect\n`;
    text += `We collect information directly provided by you as well as technical data automatically generated through your interaction with our platform:\n\n`;
    if (inputs.collectsPersonalData) {
      text += `- **Directly Provided Personal Identifiers:** Full name, business email address, phone/WhatsApp number, physical billing address, job title, and project specification notes submitted via discovery questionnaires or contact forms.\n`;
    }
    if (inputs.collectsDeviceLogs) {
      text += `- **Technical & Device Telemetry:** Internet Protocol (IP) address, operating system, browser type and version, language preferences, referring URLs, request timestamps, and interaction telemetry.\n`;
    }
    if (inputs.collectsPaymentInfo) {
      text += `- **Commercial & Transactional Records:** Contract amounts, invoice histories, and payment status indicators. *Note: We never directly store or process raw credit card numbers or banking credentials; all transactions are tokenized through our PCI-DSS Level 1 certified processors (${inputs.paymentGateways}).*\n`;
    }
    if (inputs.collectsLocationData) {
      text += `- **Geolocation Data:** Approximate geographic location derived from IP address to provide localized rate sheets and currency displays.\n`;
    }
    text += `\n`;

    text += `## 3. Purpose & Legal Basis for Processing\n`;
    text += `We process your data strictly under recognized legal bases:\n`;
    text += `- **Contractual Performance:** To fulfill contractual obligations, deliver web architecture services, deploy software, and provide customer support.\n`;
    text += `- **Legitimate Business Interests:** To protect our platform from cyber threats, diagnose infrastructure performance, and optimize user experience.\n`;
    text += `- **Legal Compliance:** To maintain accounting records, tax filings, and satisfy statutory reporting duties.\n`;
    text += `- **Consent:** Where you provide explicit opt-in consent for project newsletters or case study updates.\n\n`;

    text += `## 4. Cookies & Tracking Technologies\n`;
    text += `Our platform utilizes essential cookies necessary for site security, session maintenance, and responsive layout preferences. `;
    if (inputs.usesAnalytics) {
      text += `We also deploy non-intrusive analytics cookies (${inputs.analyticsTool}) to aggregate traffic statistics and monitor error rates without profiling individual users.\n\n`;
    } else {
      text += `We do not employ non-essential tracking cookies or third-party behavioral advertising pixels.\n\n`;
    }

    text += `## 5. Third-Party Sub-Processors & Data Sharing\n`;
    text += `We never sell, rent, or trade your personal information. Data may be shared strictly with vetted enterprise infrastructure providers:\n`;
    if (inputs.usesPaymentGateways) {
      text += `- **Payment Gateways:** ${inputs.paymentGateways} for billing.\n`;
    }
    if (inputs.usesAnalytics) {
      text += `- **Analytics Providers:** ${inputs.analyticsTool} for server telemetry.\n`;
    }
    text += `- **Cloud Infrastructure:** Google Cloud Platform (Cloud Run) for hosting under encrypted protocols.\n\n`;

    text += `## 6. Data Retention & Security Standards\n`;
    text += `We retain your personal information for ${inputs.retentionPeriod} or as required by statutory financial regulations. All data transmitted between your browser and our servers is encrypted in transit using Transport Layer Security (TLS 1.3 / HTTPS). Data stored in our databases is encrypted at rest using industry-standard AES-256 encryption.\n\n`;

    text += `## 7. Your Statutory Privacy Rights\n`;
    text += `Depending on your geographic location, you hold the following rights regarding your personal information:\n`;
    text += `- **Right of Access:** Request confirmation and a machine-readable copy of your personal data.\n`;
    text += `- **Right to Rectification:** Request correction of inaccurate or incomplete records.\n`;
    text += `- **Right to Erasure ("Right to be Forgotten"):** Request deletion of your data where no overriding legal obligation exists.\n`;
    text += `- **Right to Withdraw Consent:** Revoke previously granted processing consents at any time.\n`;
    text += `- **Non-Discrimination:** We will never penalize or alter service terms for exercising your privacy rights.\n\n`;

    text += `## 8. Contact Information & Data Protection Inquiries\n`;
    text += `To exercise your rights or submit a formal inquiry, contact our team:\n\n`;
    text += `- **Legal Entity:** ${inputs.companyName}\n`;
    text += `- **Registered Address:** ${inputs.physicalAddress}\n`;
    text += `- **Privacy Inquiries Email:** [${inputs.contactEmail}](mailto:${inputs.contactEmail})\n`;
    if (inputs.hasDpo && inputs.dpoEmail) {
      text += `- **Data Protection Officer (DPO):** [${inputs.dpoEmail}](mailto:${inputs.dpoEmail})\n`;
    }
    text += `\n---\n*This policy was constructed using the SamaXon Privacy Information Builder. For specific regulatory counsel, consultation with qualified legal counsel is advised.*\n`;

    return text;
  }, [inputs]);

  // Generate Clean HTML version
  const generatedHtml = useMemo(() => {
    return `<article class="privacy-policy-document">
  <header>
    <h1>Privacy Policy for ${inputs.websiteName}</h1>
    <p><strong>Effective Date:</strong> ${inputs.effectiveDate}</p>
  </header>
  <section>
    <h2>1. Introduction</h2>
    <p>${inputs.companyName} ("we", "our", or "us") operates ${inputs.websiteUrl}. We are committed to safeguarding your personal data in accordance with applicable privacy regulations.</p>
  </section>
  <section>
    <h2>2. Data Collection &amp; Usage</h2>
    <p>We process information submitted through forms, technical logs, and transaction records solely to provide web development services, fulfill contracts, and maintain secure infrastructure.</p>
  </section>
  <section>
    <h2>3. Security &amp; Encryption</h2>
    <p>All data is transmitted via TLS 1.3 (HTTPS) and stored using AES-256 encrypted storage. We do not sell user data.</p>
  </section>
  <section>
    <h2>4. Contact &amp; Privacy Requests</h2>
    <p>For inquiries or data deletion requests, contact: <a href="mailto:${inputs.contactEmail}">${inputs.contactEmail}</a></p>
    <address>${inputs.physicalAddress}</address>
  </section>
</article>`;
  }, [inputs]);

  const handleExportMarkdown = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-policy-${inputs.websiteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Privacy policy Markdown downloaded.', 'success');
  };

  const handleExportTxt = () => {
    const text = generatedPolicy.replace(/#/g, '').replace(/\*\*/g, '').replace(/`/g, '');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-policy-${inputs.websiteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Privacy policy text file downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="privacy-builder-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Governance & Legal Compliance Engine</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website Privacy Policy Information Builder
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Construct complete, legally structured privacy policies aligned with the Digital Personal Data Protection Act (DPDPA), GDPR, and global data privacy standards. Specify sub-processors, cookie directives, encryption safeguards, and user rights.
          </p>
        </div>
      </div>

      {/* Input Configuration Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-display text-base font-bold text-neutral-900">
            Organization & Privacy Directives
          </h3>
          <p className="text-xs text-neutral-500">Configure parameters to generate your tailored privacy disclosure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Legal Entity / Company Name" required>
            <input
              type="text"
              value={inputs.companyName}
              onChange={(e) => setInputs({ ...inputs, companyName: e.target.value })}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField label="Website Name" required>
            <input
              type="text"
              value={inputs.websiteName}
              onChange={(e) => setInputs({ ...inputs, websiteName: e.target.value })}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField label="Website URL" required>
            <input
              type="text"
              value={inputs.websiteUrl}
              onChange={(e) => setInputs({ ...inputs, websiteUrl: e.target.value })}
              className="w-full h-10 px-3.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField label="Privacy Inquiries Email" required>
            <input
              type="email"
              value={inputs.contactEmail}
              onChange={(e) => setInputs({ ...inputs, contactEmail: e.target.value })}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField label="Physical Registered Address" required>
            <input
              type="text"
              value={inputs.physicalAddress}
              onChange={(e) => setInputs({ ...inputs, physicalAddress: e.target.value })}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField label="Primary Legal Jurisdiction" required>
            <input
              type="text"
              value={inputs.jurisdiction}
              onChange={(e) => setInputs({ ...inputs, jurisdiction: e.target.value })}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>
        </div>

        {/* Data Collection Checkboxes */}
        <div className="pt-2 border-t border-neutral-100">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block mb-3">
            Data Collection & Sub-Processor Scope
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.collectsPersonalData}
                onChange={(e) => setInputs({ ...inputs, collectsPersonalData: e.target.checked })}
                className="rounded text-[#D6B46A] focus:ring-[#D6B46A]"
              />
              <span className="text-xs font-bold text-neutral-800">Direct Contact Details</span>
            </label>

            <label className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.collectsPaymentInfo}
                onChange={(e) => setInputs({ ...inputs, collectsPaymentInfo: e.target.checked })}
                className="rounded text-[#D6B46A] focus:ring-[#D6B46A]"
              />
              <span className="text-xs font-bold text-neutral-800">Tokenized Payment Gateways</span>
            </label>

            <label className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.collectsDeviceLogs}
                onChange={(e) => setInputs({ ...inputs, collectsDeviceLogs: e.target.checked })}
                className="rounded text-[#D6B46A] focus:ring-[#D6B46A]"
              />
              <span className="text-xs font-bold text-neutral-800">Server & IP Logs</span>
            </label>

            <label className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.usesAnalytics}
                onChange={(e) => setInputs({ ...inputs, usesAnalytics: e.target.checked })}
                className="rounded text-[#D6B46A] focus:ring-[#D6B46A]"
              />
              <span className="text-xs font-bold text-neutral-800">Analytics Telemetry</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Output Dashboard */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
          <CustomTabs
            tabs={[
              { id: 'policy', label: 'Full Privacy Policy (Markdown)', icon: <FileText className="w-3.5 h-3.5" /> },
              { id: 'summary', label: 'Executive Customer Summary', icon: <Eye className="w-3.5 h-3.5" /> },
              { id: 'html', label: 'HTML Embed Code', icon: <Globe className="w-3.5 h-3.5" /> }
            ]}
            activeTab={activeTab}
            onChange={(t) => setActiveTab(t as any)}
          />

          <CustomExportControls
            onExportMarkdown={handleExportMarkdown}
            onExportTxt={handleExportTxt}
            onPrint={() => window.print()}
            copyText={generatedPolicy}
            copyLabel="Copy Policy Text"
          />
        </div>

        {/* Tab 1: Full Policy */}
        {activeTab === 'policy' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-fade-in">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-neutral-800 p-4 bg-neutral-50/80 rounded-2xl border border-neutral-200">
              {generatedPolicy}
            </pre>
          </div>
        )}

        {/* Tab 2: Executive Summary */}
        {activeTab === 'summary' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-fade-in">
            <h4 className="font-display text-base font-bold text-neutral-900">
              At-A-Glance Privacy Commitments
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Zero Selling</span>
                <h5 className="font-bold text-sm text-neutral-900">No Data Monetization</h5>
                <p className="text-xs text-neutral-600">We do not sell, rent, or trade your contact or usage data to third-party ad brokers.</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Encryption</span>
                <h5 className="font-bold text-sm text-neutral-900">TLS 1.3 & AES-256</h5>
                <p className="text-xs text-neutral-600">All data in transit is encrypted with modern TLS; server storage uses encrypted block devices.</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">User Rights</span>
                <h5 className="font-bold text-sm text-neutral-900">Right to be Forgotten</h5>
                <p className="text-xs text-neutral-600">Request complete data extraction or permanent deletion anytime via email.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: HTML Embed */}
        {activeTab === 'html' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-neutral-900">
                  Ready-to-Embed HTML Snippet
                </h4>
                <p className="text-xs text-neutral-500">Drop into your custom /privacy route or template.</p>
              </div>
              <CustomCopyButton text={generatedHtml} label="Copy HTML" />
            </div>

            <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed">
              {generatedHtml}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
