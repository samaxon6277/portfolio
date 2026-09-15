import React, { useState } from 'react';
import { 
  Sparkles, FileText, CheckCircle2, Copy, Check, Download, 
  Printer, ArrowUpRight, MessageCircle, Layers, Palette, 
  Cpu, Calendar, Target, Users, RefreshCw, AlertCircle, BookmarkPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppInquiryUrl } from '../../config/siteConfig';
import CustomSelect from '../CustomSelect';

interface BriefResult {
  executiveSummary: string;
  targetPersonas: Array<{
    title: string;
    needs: string;
    journey: string;
  }>;
  sitemap: Array<{
    page: string;
    path: string;
    purpose: string;
    keyElements: string[];
  }>;
  techStack: {
    frontend: string;
    styling: string;
    backend: string;
    database: string;
    hosting: string;
    security: string;
  };
  features: Array<{
    name: string;
    priority: 'Must Have' | 'Recommended' | 'Nice to Have';
    description: string;
  }>;
  designGuidelines: {
    styleName: string;
    colorPalette: string[];
    typography: string;
    layoutPrinciples: string[];
  };
  milestones: Array<{
    phase: string;
    timeline: string;
    deliverables: string[];
  }>;
  conversionStrategy: string[];
}

interface ApiResponse {
  success: boolean;
  businessName: string;
  industry: string;
  projectType: string;
  generatedAt: string;
  brief: BriefResult;
  rawMarkdown: string;
}

const INDUSTRIES = [
  'Luxury Real Estate & Architects',
  'Hospitality, Resorts & Banquet Halls',
  'Healthcare, Clinics & Specialists',
  'SaaS & High-Tech Startups',
  'Legal, Financial & Consulting',
  'Boutique eCommerce & Fashion',
  'Education & Training Institutes',
  'Interior Design & Home Decor',
  'Creative Agency & Media'
];

const PROJECT_TYPES = [
  'Custom High-Conversion Website',
  'Luxury Brand Portal & Showcase',
  'Lead Generation & Booking Platform',
  'SaaS Web Application Interface',
  'Enterprise Multi-Page Corporate Site'
];

const GOAL_OPTIONS = [
  'Accelerate Inbound Lead Volume',
  'Elevate Brand Prestige & Credibility',
  'Automate WhatsApp & CRM Inquiries',
  'Dominate Google Search (Core SEO)',
  'Streamline Client Booking & Intake',
  'Sub-0.4s Instant Page Load Speed'
];

const FEATURE_OPTIONS = [
  'Instant WhatsApp Lead Routing',
  'Interactive Pricing / Quote Calculator',
  'Client Testimonial & Case Study Sliders',
  'Multi-Step Contact & Intake Form',
  'Google Core Web Vitals 95+ Guarantee',
  'Schema.org JSON-LD Rich Snippets',
  'Mobile Floating Conversion Dock',
  'Automated Telegram / Email Alerts'
];

const AESTHETICS = [
  'SamaXon Ultra-Luxury Champagne & Matte Black',
  'Minimalist High-Contrast Off-White & Charcoal',
  'High-Tech Dark Studio with Subtle Accents',
  'Warm Editorial Neutral with Serif Display'
];

export default function AiProjectBriefGenerator() {
  // Form State
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([GOAL_OPTIONS[0], GOAL_OPTIONS[1], GOAL_OPTIONS[2]]);
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([FEATURE_OPTIONS[0], FEATURE_OPTIONS[1], FEATURE_OPTIONS[4]]);
  const [designAesthetic, setDesignAesthetic] = useState(AESTHETICS[0]);
  const [timeline, setTimeline] = useState('Under 48 Hours Rapid Prototype');
  const [budgetRange, setBudgetRange] = useState('Professional Growth Tier');
  const [referenceWebsites, setReferenceWebsites] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Generation State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  // Copy & Action states
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'sitemap' | 'features' | 'roadmap' | 'markdown'>('architecture');

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => 
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
  };

  const toggleFeature = (f: string) => {
    setSelectedFeatures(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Please enter a business or project name.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tools/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          industry,
          projectType,
          projectGoals: selectedGoals,
          targetAudience: targetAudience || 'Corporate Decision Makers and High-Intent Inquirers',
          keyFeatures: selectedFeatures,
          designAesthetic,
          referenceWebsites,
          timeline,
          budgetRange,
          specialRequirements
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate project brief.');
      }

      setData(json);
      setActiveTab('architecture');
    } catch (err: any) {
      setError(err.message || 'Error executing AI specification engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!data?.rawMarkdown) return;
    navigator.clipboard.writeText(data.rawMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    if (!data?.rawMarkdown) return;
    const blob = new Blob([data.rawMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-project-brief.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="ai-project-brief-generator-app" className="w-full max-w-7xl mx-auto space-y-8">
      {/* 1. Header Box */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-lg space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/40 text-[#85641C] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#85641C]" />
            AI Specification & Architecture Engine
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
            AI Website Project Brief Generator
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base leading-relaxed">
            Generate an executive-ready, enterprise-grade digital specification document complete with user personas, full sitemap, technical stack recommendations, milestone timelines, and high-conversion UX architecture.
          </p>
        </div>

        {/* Questionnaire Form */}
        <form 
          id="project-brief-form"
          onSubmit={handleGenerateBrief} 
          className="space-y-6 pt-2"
        >
          {/* Row 1: Business Name, Industry, Project Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Business / Brand Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Obsidian Luxury Estates"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F4EE] border border-[#D6B46A]/30 rounded-xl text-[#111111] text-sm focus:outline-none focus:border-[#D6B46A] focus:ring-2 focus:ring-[#D6B46A]/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Industry Vertical
              </label>
              <CustomSelect
                value={industry}
                onChange={(val) => setIndustry(String(val))}
                options={INDUSTRIES}
                placeholder="Select Industry"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Project Scope & Type
              </label>
              <CustomSelect
                value={projectType}
                onChange={(val) => setProjectType(String(val))}
                options={PROJECT_TYPES}
                placeholder="Select Project Type"
              />
            </div>
          </div>

          {/* Row 2: Target Audience & Reference Sites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Target Audience & Ideal Buyer
              </label>
              <input
                type="text"
                placeholder="e.g. Ultra-high-net-worth investors, commercial buyers, wedding planners"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F4EE] border border-[#D6B46A]/30 rounded-xl text-[#111111] text-sm focus:outline-none focus:border-[#D6B46A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Reference / Competitor Websites (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. stripe.com, apple.com/vision, competitor.com"
                value={referenceWebsites}
                onChange={(e) => setReferenceWebsites(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F4EE] border border-[#D6B46A]/30 rounded-xl text-[#111111] text-sm focus:outline-none focus:border-[#D6B46A] transition-all font-mono"
              />
            </div>
          </div>

          {/* Row 3: Strategic Goals (Multi-select Chips) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">
              Primary Strategic Goals (Select 2–4)
            </label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map(g => {
                const isSelected = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-[#FFFDF8] shadow-soft-xs'
                        : 'bg-[#F8F4EE] text-[#4A443E] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D6B46A]" />}
                    <span>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Essential Features (Multi-select Chips) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">
              Essential Functional Modules & Deliverables
            </label>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map(f => {
                const isSelected = selectedFeatures.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-[#FFFDF8] shadow-soft-xs'
                        : 'bg-[#F8F4EE] text-[#4A443E] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D6B46A]" />}
                    <span>{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Aesthetic & Timeline Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Design Tone & Aesthetics
              </label>
              <CustomSelect
                value={designAesthetic}
                onChange={(val) => setDesignAesthetic(String(val))}
                options={AESTHETICS}
                placeholder="Select Aesthetic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Timeline Target
              </label>
              <CustomSelect
                value={timeline}
                onChange={(val) => setTimeline(String(val))}
                options={[
                  { value: 'Under 48 Hours Rapid Prototype', label: 'Under 48 Hours (SamaXon Rapid Delivery)' },
                  { value: '1–2 Weeks Full Production', label: '1–2 Weeks (Production Polish)' },
                  { value: '3–4 Weeks Complex System', label: '3–4 Weeks (Enterprise Modules)' }
                ]}
                placeholder="Select Timeline"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Investment Tier
              </label>
              <CustomSelect
                value={budgetRange}
                onChange={(val) => setBudgetRange(String(val))}
                options={[
                  'Startup / Essential Tier',
                  'Professional Growth Tier',
                  'Enterprise Custom Architecture'
                ]}
                placeholder="Select Tier"
              />
            </div>
          </div>

          {/* Row 6: Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#8E857B]">
              Powered by Google Gemini 3.8 Flash & SamaXon Digital Architectural Engine.
            </p>

            <button
              id="generate-brief-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-[#111111] hover:bg-[#262626] text-[#FFFDF8] font-bold rounded-2xl transition-all duration-200 shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer text-base"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#D6B46A]" />
                  <span>Synthesizing Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#D6B46A]" />
                  <span>Generate Full Project Brief</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Generation Notice</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-3xl p-10 text-center space-y-4 shadow-soft-sm">
          <div className="inline-block p-4 rounded-2xl bg-[#F8F4EE] animate-pulse">
            <Sparkles className="w-8 h-8 text-[#D6B46A] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-[#111111]">Architecting Enterprise Website Specification...</h3>
          <p className="text-sm text-[#6B635B] max-w-md mx-auto">
            Structuring user personas, conversion journeys, sitemap hierarchy, production tech stack, and 48-hour delivery milestones.
          </p>
        </div>
      )}

      {/* 2. Results Presentation */}
      {data && !loading && (
        <div id="project-brief-results" className="space-y-8 animate-fadeIn">
          {/* Header Action Bar */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#85641C]">Project Specification Brief</span>
                <span className="text-xs text-[#8E857B]">• Generated {new Date(data.generatedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
                {data.businessName}
              </h3>
              <p className="text-xs text-[#8E857B]">
                Industry: <span className="text-[#4A443E] font-medium">{data.industry}</span> • Scope: <span className="text-[#4A443E] font-medium">{data.projectType}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                id="copy-brief-markdown-btn"
                onClick={handleCopyMarkdown}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedMd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#85641C]" />}
                <span>{copiedMd ? 'Copied Markdown!' : 'Copy Markdown'}</span>
              </button>
              <button
                id="download-brief-btn"
                onClick={handleDownloadMarkdown}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#85641C]" />
                <span>Export .MD</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#85641C]" />
                <span>Print Brief</span>
              </button>
              <a
                href={getWhatsAppInquiryUrl(`Hi SamaXon, I generated a project brief for "${data.businessName}" (${data.industry}). Let's start the 48-hour prototype.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#262626] text-[#FFFDF8] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-soft-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                <span>Build in 48 Hours</span>
              </a>
            </div>
          </div>

          {/* Navigation Subtabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#D6B46A]/30 pb-3">
            {[
              { id: 'architecture', label: 'Executive & Strategy' },
              { id: 'sitemap', label: `Sitemap Architecture (${data.brief.sitemap.length} Pages)` },
              { id: 'features', label: `Features & Tech Stack (${data.brief.features.length})` },
              { id: 'roadmap', label: 'Roadmap & Milestones' },
              { id: 'markdown', label: 'Raw Markdown View' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-[#111111] text-[#FFFDF8]'
                    : 'bg-[#FFFDF8] text-[#6B635B] hover:text-[#111111] border border-[#D6B46A]/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: EXECUTIVE & STRATEGY */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#85641C] uppercase tracking-wider">
                  <BookmarkPlus className="w-4 h-4 text-[#85641C]" />
                  <span>1. Executive Summary & Conversion Mandate</span>
                </div>
                <div className="text-sm text-[#4A443E] leading-relaxed whitespace-pre-line">
                  {data.brief.executiveSummary}
                </div>
              </div>

              {/* Target Personas & Journeys */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.brief.targetPersonas.map((persona, i) => (
                  <div key={i} className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 space-y-3 shadow-soft-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#85641C]" />
                      <h4 className="text-sm font-bold text-[#111111]">{persona.title}</h4>
                    </div>
                    <div className="space-y-2 text-xs text-[#4A443E]">
                      <div className="p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20">
                        <span className="font-semibold text-[#111111] block mb-1">Core Needs & Pain Points:</span>
                        <p>{persona.needs}</p>
                      </div>
                      <div className="p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20">
                        <span className="font-semibold text-[#111111] block mb-1">Optimal Conversion Journey:</span>
                        <p>{persona.journey}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversion Strategy */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#85641C] uppercase tracking-wider">
                  <Target className="w-4 h-4 text-[#85641C]" />
                  <span>Conversion Mechanics</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {data.brief.conversionStrategy.map((strat, i) => (
                    <div key={i} className="p-4 bg-[#F8F4EE] rounded-2xl border border-[#D6B46A]/20 text-xs text-[#4A443E] leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#85641C] shrink-0 mt-0.5" />
                      <span>{strat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SITEMAP ARCHITECTURE */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#111111]">Recommended Page Sitemap & Wireframe Objectives</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.brief.sitemap.map((page, i) => (
                  <div key={i} className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl p-5 shadow-soft-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-[#111111] text-sm">{page.page}</h5>
                      <code className="text-xs px-2 py-0.5 rounded bg-[#111111] text-[#D6B46A] font-mono">
                        {page.path}
                      </code>
                    </div>
                    <p className="text-xs text-[#6B635B] leading-relaxed">
                      {page.purpose}
                    </p>
                    <div className="pt-2 border-t border-[#111111]/10">
                      <span className="text-[11px] font-semibold text-[#8E857B] block mb-1.5">Key Components:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {page.keyElements.map((el, j) => (
                          <span key={j} className="text-[11px] px-2 py-0.5 bg-[#F8F4EE] text-[#4A443E] border border-[#D6B46A]/20 rounded-md">
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & TECH STACK */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Technical Stack Architecture */}
              <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-lg space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-[#D6B46A] font-semibold">Production Architecture</span>
                    <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFDF8]">Recommended Technology Blueprint</h4>
                  </div>
                  <Cpu className="w-8 h-8 text-[#D6B46A]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 bg-[#262626] rounded-xl border border-white/10 space-y-1">
                    <span className="text-[#8E857B] block font-sans">Frontend Platform:</span>
                    <span className="text-[#FFFDF8] font-bold">{data.brief.techStack.frontend}</span>
                  </div>
                  <div className="p-4 bg-[#262626] rounded-xl border border-white/10 space-y-1">
                    <span className="text-[#8E857B] block font-sans">CSS & Micro-Interactions:</span>
                    <span className="text-[#FFFDF8] font-bold">{data.brief.techStack.styling}</span>
                  </div>
                  <div className="p-4 bg-[#262626] rounded-xl border border-white/10 space-y-1">
                    <span className="text-[#8E857B] block font-sans">Microservice Backend:</span>
                    <span className="text-[#FFFDF8] font-bold">{data.brief.techStack.backend}</span>
                  </div>
                  <div className="p-4 bg-[#262626] rounded-xl border border-white/10 space-y-1">
                    <span className="text-[#8E857B] block font-sans">Database Engine:</span>
                    <span className="text-[#FFFDF8] font-bold">{data.brief.techStack.database}</span>
                  </div>
                  <div className="p-4 bg-[#262626] rounded-xl border border-white/10 space-y-1">
                    <span className="text-[#8E857B] block font-sans">Edge CDN Hosting:</span>
                    <span className="text-[#FFFDF8] font-bold">{data.brief.techStack.hosting}</span>
                  </div>
                  <div className="p-4 bg-[#262626] rounded-xl border border-white/10 space-y-1">
                    <span className="text-[#8E857B] block font-sans">Security & SSL:</span>
                    <span className="text-[#FFFDF8] font-bold">{data.brief.techStack.security}</span>
                  </div>
                </div>
              </div>

              {/* Functional Modules List */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#111111]">Key Functional Modules</h4>
                <div className="space-y-2.5">
                  {data.brief.features.map((feat, i) => (
                    <div key={i} className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl flex items-start justify-between gap-4 shadow-soft-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            feat.priority === 'Must Have' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {feat.priority}
                          </span>
                          <h5 className="font-bold text-[#111111] text-sm">{feat.name}</h5>
                        </div>
                        <p className="text-xs text-[#6B635B] mt-1">{feat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROADMAP & MILESTONES */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#111111]">Rapid Phased Delivery Schedule</h4>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#D6B46A]/20 text-[#85641C] font-mono font-bold">
                    {timeline}
                  </span>
                </div>

                <div className="space-y-4">
                  {data.brief.milestones.map((m, i) => (
                    <div key={i} className="p-5 bg-[#F8F4EE] rounded-2xl border border-[#D6B46A]/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-[#111111] text-sm">{m.phase}</h5>
                        <span className="text-xs font-mono font-bold text-[#85641C] bg-[#FFFDF8] px-2.5 py-1 rounded-lg border border-[#D6B46A]/30">
                          {m.timeline}
                        </span>
                      </div>
                      <div className="pt-2 space-y-1">
                        {m.deliverables.map((d, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-[#4A443E]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RAW MARKDOWN */}
          {activeTab === 'markdown' && (
            <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D6B46A]">project-specification-brief.md</span>
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-xs font-mono text-[#FFFDF8] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D6B46A]" />}
                  <span>{copiedMd ? 'Copied!' : 'Copy Raw'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono p-4 bg-[#1A1A1A] rounded-2xl overflow-x-auto whitespace-pre-wrap max-h-96 leading-relaxed text-[#D6D0C7]">
                {data.rawMarkdown}
              </pre>
            </div>
          )}

          {/* Bottom Conversion CTA */}
          <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-soft-xl">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#D6B46A]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D6B46A]">Ready for Implementation</span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDF8]">
                Turn this specification into a live clickable demo in under 48 hours
              </h3>
              <p className="text-[#8E857B] text-sm sm:text-base leading-relaxed">
                SamaXon builds and delivers custom high-performance digital platforms with zero upfront friction. We provide an interactive clickable demo within 48 hours — love the architecture before spending a rupee.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={getWhatsAppInquiryUrl(`Hi SamaXon, here is my generated project brief for "${data.businessName}". I want to proceed with your 48-Hour Demo build.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-bold rounded-2xl transition-all shadow-gold-soft flex items-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#111111]" />
                  <span>Start 48-Hour Demo on WhatsApp</span>
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3.5 bg-transparent hover:bg-white/5 border border-[#D6B46A]/40 text-[#FFFDF8] font-semibold rounded-2xl transition-all text-sm flex items-center gap-2"
                >
                  <span>Submit Custom Specification Ticket</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D6B46A]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
