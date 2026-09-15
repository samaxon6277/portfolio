import React, { useState, useMemo } from 'react';
import { 
  FileEdit, Sparkles, Copy, Download, Printer, RotateCcw, 
  HelpCircle, CheckCircle2, ChevronRight, Eye, Layers, Type, 
  Search, ArrowRight, BookOpen, Target, Check, RefreshCw
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomSelect from '../ui/CustomSelect';
import FormField from '../ui/FormField';
import CustomExportControls from '../ui/CustomExportControls';
import CustomTabs from '../ui/CustomTabs';

interface ContentBriefInputs {
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  searchIntent: string;
  targetAudience: string;
  industry: string;
  wordCountTarget: string;
  uniqueValueProp: string;
  callToAction: string;
  toneOfVoice: string;
  competitorReferences: string;
}

const INITIAL_INPUTS: ContentBriefInputs = {
  topic: 'Best Banquet Hall Website Design & Online Booking Engines in Noida',
  primaryKeyword: 'banquet hall website design noida',
  secondaryKeywords: 'wedding venue booking portal, party lawn web developers, banquet plate calculator website, direct venue booking software',
  searchIntent: 'Commercial Investigation & High-Intent Transactional',
  targetAudience: 'Banquet hall proprietors, luxury resort managers, and wedding event venue directors losing revenue to wedding aggregators.',
  industry: 'Hospitality & Luxury Event Venues',
  wordCountTarget: '1,500 – 2,200 Words',
  uniqueValueProp: 'Commission-free direct booking systems that save ₹15–20 Lakhs in broker commissions, deployed with 48-hour turnarounds.',
  callToAction: 'Request Free 48-Hour Live Demo or Book Direct Consultation via WhatsApp',
  toneOfVoice: 'Authoritative, Commercial, & High-Prestige',
  competitorReferences: 'weddingwire.in, wedmegood.com'
};

export default function WebsiteContentBriefGenerator() {
  const { showToast, showConfirm } = useCustomUi();
  const [inputs, setInputs] = useState<ContentBriefInputs>(INITIAL_INPUTS);
  const [activeTab, setActiveTab] = useState<'brief' | 'outline' | 'seo-matrix'>('brief');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.topic.trim() || !inputs.primaryKeyword.trim()) {
      showToast('Please provide both page topic and primary keyword.', 'warning');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('Comprehensive editorial content brief compiled.', 'success');
    }, 300);
  };

  const handleReset = () => {
    showConfirm({
      title: 'Reset Brief Inputs?',
      message: 'All custom inputs will be reverted to default. Proceed?',
      confirmText: 'Reset',
      cancelText: 'Cancel',
      onConfirm: () => {
        setInputs(INITIAL_INPUTS);
        showToast('Brief generator reset to default template.', 'info');
      }
    });
  };

  // Structured Content Brief Generation
  const generatedBrief = useMemo(() => {
    const slug = inputs.primaryKeyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const secondaryList = inputs.secondaryKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const metaTitle = `${inputs.topic.slice(0, 48)} | SamaXon`;
    const metaDescription = `Looking for ${inputs.primaryKeyword}? Discover how SamaXon builds high-converting ${inputs.industry.toLowerCase()} websites with direct booking engines in 48 hours.`;

    const questionsToAnswer = [
      `Why do traditional ${inputs.industry.toLowerCase()} websites fail to capture high-intent inbound leads?`,
      `How does an interactive quote/booking calculator increase conversion rates by 30%+?`,
      `What are the technical advantages of direct booking over listing on third-party aggregators?`,
      `What is the implementation timeline and what credentials does the client need to provide?`,
      `How does local schema markup (LocalBusiness) secure Google Map Pack rankings?`
    ];

    const outline = [
      {
        level: 'H1',
        title: `${inputs.topic}`,
        notes: 'Include primary keyword prominently. State immediate commercial proposition.'
      },
      {
        level: 'H2',
        title: `The High Cost of Aggregator Reliance in ${inputs.industry}`,
        notes: 'Break down the percentage of revenue lost to middleman platforms and broker commissions.'
      },
      {
        level: 'H3',
        title: 'Hidden Commission Fees vs. Direct Commission-Free Ownership',
        notes: 'Provide a direct contrast table highlighting long-term ROI of custom web portals.'
      },
      {
        level: 'H2',
        title: `Core Architectural Capabilities of a Modern ${inputs.industry} Platform`,
        notes: 'Walk through interactive features: real-time calendar reservations, cost estimators, and WhatsApp alert integration.'
      },
      {
        level: 'H3',
        title: 'Instant Inbound Lead Routing via WhatsApp & CRM Webhooks',
        notes: 'Explain why sub-2-minute response times win 78% of commercial wedding/event inquiries.'
      },
      {
        level: 'H3',
        title: 'Bespoke Client Administration Panels for Zero-Code Management',
        notes: 'Describe intuitive control: blocking unavailable calendar dates, adjusting plate pricing, and exporting lead CSVs.'
      },
      {
        level: 'H2',
        title: 'Local SEO Strategy & Google Map Pack Domination',
        notes: 'Explain geo-targeted landing page structure, local citations, review collection funnels, and mobile speed scores.'
      },
      {
        level: 'H2',
        title: 'Frequently Asked Technical Questions',
        notes: 'Address security, hosting ownership, timeline adherence, and payment gateway configuration.'
      },
      {
        level: 'H2',
        title: 'Initiate Your High-Conversion Digital Asset',
        notes: `Reinforce primary CTA: ${inputs.callToAction}. Highlight risk-free demo-first policy.`
      }
    ];

    let fullMarkdown = `# Editorial & SEO Content Brief\n`;
    fullMarkdown += `**Topic / Focus:** ${inputs.topic}\n`;
    fullMarkdown += `**Primary Keyword:** \`${inputs.primaryKeyword}\`\n`;
    fullMarkdown += `**Target Word Count:** ${inputs.wordCountTarget}\n`;
    fullMarkdown += `**Search Intent:** ${inputs.searchIntent}\n`;
    fullMarkdown += `**Tone of Voice:** ${inputs.toneOfVoice}\n\n`;
    fullMarkdown += `---\n\n`;

    fullMarkdown += `## 1. Metadata & Indexing Directives\n`;
    fullMarkdown += `- **Suggested Meta Title:** ${metaTitle} (${metaTitle.length} chars)\n`;
    fullMarkdown += `- **Suggested Meta Description:** ${metaDescription} (${metaDescription.length} chars)\n`;
    fullMarkdown += `- **Canonical URL Slug:** \`/${slug}\`\n\n`;

    fullMarkdown += `## 2. Target Reader Persona & Commercial Context\n`;
    fullMarkdown += `${inputs.targetAudience}\n\n`;
    fullMarkdown += `**Core Value Proposition to Anchor:**\n`;
    fullMarkdown += `> ${inputs.uniqueValueProp}\n\n`;

    fullMarkdown += `## 3. Structural Heading Outline & Section Mandates\n`;
    outline.forEach((sec, idx) => {
      fullMarkdown += `### ${idx + 1}. [${sec.level}] ${sec.title}\n`;
      fullMarkdown += `- **Content Mandate:** ${sec.notes}\n\n`;
    });

    fullMarkdown += `## 4. Keyword Distribution & Search Matrix\n`;
    fullMarkdown += `- **Primary Keyword (1.2–1.8% Density):** \`${inputs.primaryKeyword}\`\n`;
    fullMarkdown += `  - Required in: Title Tag, H1, First 100 words, at least one H2, and Conclusion.\n`;
    fullMarkdown += `- **Secondary Keywords (Natural Ingestion):**\n`;
    secondaryList.forEach(k => {
      fullMarkdown += `  - \`${k}\`\n`;
    });
    fullMarkdown += `\n`;

    fullMarkdown += `## 5. Must-Answer Questions (FAQ / Schema Integration)\n`;
    questionsToAnswer.forEach((q, idx) => {
      fullMarkdown += `${idx + 1}. **${q}**\n`;
    });
    fullMarkdown += `\n`;

    fullMarkdown += `## 6. Conversion Action & Call-to-Action Strategy\n`;
    fullMarkdown += `- **Primary CTA Goal:** ${inputs.callToAction}\n`;
    fullMarkdown += `- **Placement:** Sticky floating bar on mobile + Hero section + Mid-article highlight box + Final closing banner.\n\n`;

    fullMarkdown += `## 7. Editorial Guardrails (Do's & Don'ts)\n`;
    fullMarkdown += `- **DO:** Cite tangible numbers, timelines (e.g. 48 hours), and verified technical stacks.\n`;
    fullMarkdown += `- **DO:** Use active voice and short scannable paragraphs (2–3 sentences max).\n`;
    fullMarkdown += `- **DON'T:** Use generic marketing fluff like "supercharge", "synergistic", or "game-changer".\n`;
    fullMarkdown += `- **DON'T:** Write vague descriptions of services without detailing actionable outcomes.\n\n`;

    fullMarkdown += `---\n*Compiled via SamaXon Content Brief Generator. Ready for copywriter execution or CMS drafting.*\n`;

    return {
      slug,
      metaTitle,
      metaDescription,
      secondaryList,
      questionsToAnswer,
      outline,
      fullMarkdown
    };
  }, [inputs]);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      inputs,
      brief: generatedBrief
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `content-brief-${inputs.primaryKeyword.replace(/[^a-z0-9]/g, '-')}.json`);
    dlAnchor.click();
    showToast('Content brief JSON exported.', 'success');
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([generatedBrief.fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-brief-${inputs.primaryKeyword.replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Content brief Markdown downloaded.', 'success');
  };

  const handleExportTxt = () => {
    const text = generatedBrief.fullMarkdown.replace(/#/g, '').replace(/\*\*/g, '').replace(/`/g, '');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-brief-${inputs.primaryKeyword.replace(/[^a-z0-9]/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Content brief text file downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="content-brief-generator-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
              <FileEdit className="w-3.5 h-3.5" />
              <span>Editorial Strategy & SEO Briefing</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset</span>
            </button>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website Content Brief Generator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Generate high-performance content briefs with precise search intent calibration, structured H1/H2/H3 outlines, keyword distribution matrices, People-Also-Ask targets, and conversion anchor guidelines for copywriters and digital agencies.
          </p>
        </div>
      </div>

      {/* Input Parameters Form */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-display text-base font-bold text-neutral-900">
            Page Strategy & Keyword Anchors
          </h3>
          <p className="text-xs text-neutral-500">Provide topic parameters to generate the comprehensive brief.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FormField
              label="Page Working Title / Article Topic"
              required
              description="Primary focus of the webpage or editorial guide."
            >
              <input
                type="text"
                value={inputs.topic}
                onChange={(e) => setInputs({ ...inputs, topic: e.target.value })}
                className="w-full h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                required
              />
            </FormField>
          </div>

          <FormField
            label="Primary Focus Keyword"
            required
            description="The exact main target keyword for search rankings."
          >
            <input
              type="text"
              value={inputs.primaryKeyword}
              onChange={(e) => setInputs({ ...inputs, primaryKeyword: e.target.value })}
              className="w-full h-11 px-4 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              required
            />
          </FormField>

          <CustomSelect
            label="Search Intent Classification"
            value={inputs.searchIntent}
            onChange={(val) => setInputs({ ...inputs, searchIntent: val })}
            options={[
              { value: 'Commercial Investigation & High-Intent Transactional', label: 'Commercial Investigation (Buying Comparison)' },
              { value: 'Transactional (Direct Closing / Booking)', label: 'Transactional (Direct Purchase / Sign-up)' },
              { value: 'Informational (Educational Authority Guide)', label: 'Informational (Deep Educational Guide)' },
              { value: 'Navigational (Brand Service Gateway)', label: 'Navigational (Brand Gateway)' }
            ]}
          />

          <div className="md:col-span-2">
            <FormField
              label="Secondary & LSI Keywords (Comma-separated)"
              description="Related semantic search phrases and question modifiers."
            >
              <textarea
                rows={2}
                value={inputs.secondaryKeywords}
                onChange={(e) => setInputs({ ...inputs, secondaryKeywords: e.target.value })}
                className="w-full p-3 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              />
            </FormField>
          </div>

          <FormField
            label="Target Audience & Reader Profile"
            description="Who will read this and what problem are they trying to solve?"
          >
            <input
              type="text"
              value={inputs.targetAudience}
              onChange={(e) => setInputs({ ...inputs, targetAudience: e.target.value })}
              className="w-full h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <CustomSelect
            label="Target Word Count Range"
            value={inputs.wordCountTarget}
            onChange={(val) => setInputs({ ...inputs, wordCountTarget: val })}
            options={[
              { value: '800 – 1,200 Words (Focused Landing Page)', label: '800 – 1,200 Words (Focused Landing Page)' },
              { value: '1,500 – 2,200 Words (Comprehensive Authority)', label: '1,500 – 2,200 Words (Comprehensive Pillar)' },
              { value: '2,500 – 3,500 Words (Ultimate Industry Guide)', label: '2,500 – 3,500 Words (Ultimate Guide)' }
            ]}
          />

          <div className="md:col-span-2">
            <FormField
              label="Core Value Proposition (Must be communicated)"
              description="The unignorable competitive advantage the copy must establish."
            >
              <input
                type="text"
                value={inputs.uniqueValueProp}
                onChange={(e) => setInputs({ ...inputs, uniqueValueProp: e.target.value })}
                className="w-full h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              />
            </FormField>
          </div>

          <FormField
            label="Primary Call to Action (CTA) Trigger"
            description="What action should the reader take upon finishing the piece?"
          >
            <input
              type="text"
              value={inputs.callToAction}
              onChange={(e) => setInputs({ ...inputs, callToAction: e.target.value })}
              className="w-full h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <CustomSelect
            label="Brand Tone of Voice"
            value={inputs.toneOfVoice}
            onChange={(val) => setInputs({ ...inputs, toneOfVoice: val })}
            options={[
              { value: 'Authoritative, Commercial, & High-Prestige', label: 'Authoritative & High-Prestige (SamaXon Standard)' },
              { value: 'Direct, Data-Backed, & Punchy', label: 'Direct, Data-Backed, & Punchy' },
              { value: 'Educational, Reassuring, & Friendly', label: 'Educational & Reassuring' },
              { value: 'Bold, Disruptive, & High-Energy', label: 'Bold & Disruptive' }
            ]}
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                <span>Compiling Brief...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Content Brief</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Brief Dashboard */}
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div>
            <h3 className="font-display text-base font-bold text-neutral-900">
              Content Brief & Editorial Specification
            </h3>
            <p className="text-xs text-neutral-500">
              Targeting: <span className="font-mono font-bold text-[#8F722E]">{inputs.primaryKeyword}</span>
            </p>
          </div>

          <CustomExportControls
            onExportMarkdown={handleExportMarkdown}
            onExportJson={handleExportJson}
            onExportTxt={handleExportTxt}
            onPrint={() => window.print()}
            copyText={generatedBrief.fullMarkdown}
            copyLabel="Copy Complete Brief"
          />
        </div>

        {/* View Tabs */}
        <CustomTabs
          tabs={[
            { id: 'brief', label: 'Executive Dossier', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'outline', label: 'Heading Outline (H1–H3)', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'seo-matrix', label: 'SEO & Metadata Matrix', icon: <Target className="w-3.5 h-3.5" /> }
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />

        {/* Tab 1: Executive Dossier */}
        {activeTab === 'brief' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Target Word Count</span>
                <p className="text-sm font-bold text-neutral-900 mt-1">{inputs.wordCountTarget}</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Search Intent</span>
                <p className="text-sm font-bold text-neutral-900 mt-1 truncate">{inputs.searchIntent.split('(')[0]}</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Voice & Tone</span>
                <p className="text-sm font-bold text-neutral-900 mt-1">{inputs.toneOfVoice.split(',')[0]}</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Slug Target</span>
                <p className="text-xs font-mono text-[#8F722E] font-bold mt-1 truncate">/{generatedBrief.slug}</p>
              </div>
            </div>

            {/* Markdown Viewer */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 font-sans text-xs leading-relaxed text-neutral-800 space-y-4">
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {generatedBrief.fullMarkdown}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Outline */}
        {activeTab === 'outline' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4 animate-fade-in">
            <div>
              <h4 className="font-display text-base font-bold text-neutral-900">
                Sequential Heading Hierarchy (H1 &rarr; H2 &rarr; H3)
              </h4>
              <p className="text-xs text-neutral-500">
                Structured to satisfy user search queries with logical progressive depth.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {generatedBrief.outline.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.level === 'H1'
                      ? 'bg-[#111111] text-white border-[#D6B46A]/40 shadow-sm'
                      : item.level === 'H2'
                      ? 'bg-neutral-50 border-neutral-200 ml-0 sm:ml-4'
                      : 'bg-white border-neutral-200 ml-0 sm:ml-8'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.level === 'H1'
                        ? 'bg-[#D6B46A] text-[#111111]'
                        : item.level === 'H2'
                        ? 'bg-neutral-200 text-neutral-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {item.level}
                    </span>
                    <h5 className={`font-bold text-xs sm:text-sm ${item.level === 'H1' ? 'text-white' : 'text-neutral-900'}`}>
                      {item.title}
                    </h5>
                  </div>
                  <p className={`text-xs mt-1.5 ${item.level === 'H1' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    <strong>Mandate: </strong>{item.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: SEO Matrix */}
        {activeTab === 'seo-matrix' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h4 className="font-display text-base font-bold text-neutral-900">
                Metadata & Keyword Placement Matrix
              </h4>
              <p className="text-xs text-neutral-500">
                Ensure strict alignment with Google search ranking guidelines.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Recommended Title Tag</span>
                <p className="text-xs font-bold text-neutral-900">{generatedBrief.metaTitle}</p>
                <span className="text-[10px] font-mono text-neutral-400 block">{generatedBrief.metaTitle.length} characters</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Recommended Meta Description</span>
                <p className="text-xs text-neutral-700 leading-relaxed">{generatedBrief.metaDescription}</p>
                <span className="text-[10px] font-mono text-neutral-400 block">{generatedBrief.metaDescription.length} characters</span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block mb-2">
                  People Also Ask / FAQ Section Targets
                </span>
                <div className="space-y-2">
                  {generatedBrief.questionsToAnswer.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-neutral-200 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#111111] text-[#D6B46A] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-neutral-800 font-medium">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
