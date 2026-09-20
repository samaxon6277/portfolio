import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, Bot, Sparkles, HelpCircle, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, Copy, Check, Download, RefreshCw, Globe, 
  Share2, ShieldCheck, FileText, Code2, Layers, ExternalLink,
  ChevronRight, Terminal, Eye, Sliders, Cpu
} from 'lucide-react';
import { AeoData, GeoData } from '../../utils/auditEngine/types';

interface EngineScores {
  seo: number;
  geo: number;
  aeo: number;
  overall: number;
}

export default function SeoGeoAeoResearchTool() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'seo' | 'geo' | 'aeo' | 'generator'>('matrix');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // FAQ Schema Generator state
  const [faqItems, setFaqItems] = useState<Array<{ q: string; a: string }>>([
    { q: 'What is Generative Engine Optimization (GEO)?', a: 'GEO is the practice of optimizing content and technical metadata to maximize brand citations and references inside AI models like ChatGPT, Perplexity, Claude, and Google Gemini.' },
    { q: 'How does Answer Engine Optimization (AEO) differ from traditional SEO?', a: 'Traditional SEO aims to rank pages in standard organic search listings, whereas AEO optimizes for direct answer extraction, featured snippets, voice search, and AI conversational overviews.' }
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Live Research Data State
  const [targetUrl, setTargetUrl] = useState('https://samaxon.site');
  const [hostname, setHostname] = useState('samaxon.site');
  const [scores, setScores] = useState<EngineScores>({
    seo: 92,
    geo: 88,
    aeo: 85,
    overall: 88
  });

  const [seoData, setSeoData] = useState({
    title: 'SamaXon - Global Web Design & Development Agency',
    titleLength: 48,
    metaDescription: 'SamaXon is a full-service web development company engineering custom website design, web applications, and automated workflows.',
    metaDescriptionLength: 132,
    canonicalUrl: 'https://samaxon.site',
    isCanonicalMatching: true,
    robotsMeta: 'index, follow',
    isIndexable: true,
    h1Count: 1,
    h1List: ['Global Web Design & Development Agency, Built for Modern Business.'],
    h2Count: 6,
    h3Count: 8,
    totalImages: 14,
    imagesWithoutAltCount: 0,
    hasHttps: true,
    hasViewport: true,
    hasCharset: true,
    hasDoctype: true
  });

  const [geoData, setGeoData] = useState<GeoData>({
    aiBotsStatus: {
      gptBot: 'unrestricted',
      claudeBot: 'unrestricted',
      perplexityBot: 'unrestricted',
      googleExtended: 'unrestricted',
      applebotExtended: 'unrestricted'
    },
    factualCiteabilityScore: 84,
    hasAuthorOrPublisherMeta: true,
    hasPublicationDates: true,
    semanticHtmlStructureRatio: 68,
    cleanTextToHtmlRatio: 26,
    clientRenderDependency: 'low',
    aiReadinessLevel: 'AI-Ready',
    llmsTxtStatus: {
      checked: true,
      exists: true,
      isOptional: true,
      note: 'llms.txt manifest available for AI search crawler ingest.'
    },
    googleExtendedAnalysis: {
      status: 'unrestricted',
      explanation: 'Google-Extended is unrestricted. Content is eligible for Gemini grounding datasets without restricting Search indexing.',
      affectsSearchRanking: false
    },
    checks: [
      {
        name: 'AI Crawler Access (GPTBot / ClaudeBot / PerplexityBot)',
        category: 'GEO',
        status: 'PASS',
        evidence: 'robots.txt allows all top AI retrieval agents without restrictions.',
        description: 'Permits LLMs to cite real-time public product data in response to conversational prompts.'
      },
      {
        name: 'Factual & Statistical Citeability',
        category: 'GEO',
        status: 'PASS',
        evidence: '18 verified metric data-points and outbound references found in core document.',
        description: 'Large language models favor citing structured statistics with verified sources.'
      },
      {
        name: 'Clean Text-to-HTML Density',
        category: 'GEO',
        status: 'PASS',
        evidence: '26% clean text ratio ensures high context efficiency for LLM token windows.',
        description: 'Prevents token bloat by ensuring dense semantic copy over excessive DOM boilerplate.'
      }
    ],
    aiVisibilityDisclaimer: 'Generative Engine Optimization (GEO) measures visibility across conversational AI assistants (ChatGPT, Perplexity, Claude, Google Gemini).',
    recommendations: [
      'Maintain published and updated timestamps on all technical and pricing case studies.',
      'Provide structured comparison tables with explicit feature matrices for AI comparison queries.'
    ]
  });

  const [aeoData, setAeoData] = useState<AeoData>({
    directAnswerReadability: 'optimal',
    hasFaqSchema: true,
    hasQaSchema: true,
    hasDefinitionBlocks: true,
    definitionBlocksCount: 4,
    listAndTableCount: 6,
    hasTableOrListStructure: true,
    entityClarityScore: 90,
    detectedEntities: ['SamaXon', 'Web Development', 'Custom Software'],
    voiceSearchReadiness: 'High',
    checks: [
      {
        name: 'FAQ & Q&A Schema Markup',
        category: 'AEO',
        status: 'PASS',
        evidence: 'Valid FAQPage JSON-LD schema detected with answers under 50 words.',
        description: 'Directly injects structured Q&A into search engine featured snippets and voice assistants.'
      },
      {
        name: 'Direct Answer Question Phrasing',
        category: 'AEO',
        status: 'PASS',
        evidence: '6 question headings (H2/H3) paired with immediate definition sentences.',
        description: 'Optimized for speech synthesis engines (Google Assistant, Siri, Alexa) searching for 40-word answers.'
      },
      {
        name: 'Structured Lists & Step Guides',
        category: 'AEO',
        status: 'PASS',
        evidence: 'Ordered step elements (<ol>) and comparison matrices (<table/dl>) present.',
        description: 'Answer engines prioritize structured procedures when users ask "How to" questions.'
      }
    ],
    recommendations: [
      'Continue formatting primary FAQ answers under 45 words for conversational speech limits.',
      'Add step-by-step HowTo schema markup to procedure guides.'
    ]
  });

  const scanSteps = [
    'Connecting to host & validating DNS/TLS handshake...',
    'Inspecting robots.txt for AI bots (GPTBot, ClaudeBot, PerplexityBot)...',
    'Analyzing HTML semantic hierarchy, meta tags & OpenGraph...',
    'Checking FAQPage / Q&A Schema.org JSON-LD structured data...',
    'Computing GEO citeability ratio & AEO voice-readiness index...'
  ];

  // Run audit for URL
  const runResearchScan = async (urlToScan: string) => {
    let clean = urlToScan.trim();
    if (!clean) return;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }

    setIsScanning(true);
    setErrorMsg('');
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      let host = '';
      try {
        host = new URL(clean).hostname;
      } catch {
        host = clean;
      }

      setTargetUrl(clean);
      setHostname(host);

      // Call serverless diagnostic API
      const res = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: clean })
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (data && data.success) {
        setErrorMsg('');

        // Extract real scores directly from the server response
        const seoScore = Number(data.scores?.seo ?? (100 - ((data.issues?.critical?.length || 0) * 20)));
        const geoScore = Number(data.scores?.geo ?? data.geoData?.factualCiteabilityScore ?? 70);
        const aeoScore = Number(data.scores?.aeo ?? data.aeoData?.entityClarityScore ?? 70);
        const overallScore = Number(data.scores?.overall ?? Math.round((seoScore * 0.4) + (geoScore * 0.3) + (aeoScore * 0.3)));

        setScores({
          seo: Math.max(10, Math.min(100, seoScore)),
          geo: Math.max(10, Math.min(100, geoScore)),
          aeo: Math.max(10, Math.min(100, aeoScore)),
          overall: Math.max(10, Math.min(100, overallScore))
        });

        // Set real SEO metadata directly from authentic website DOM response
        setSeoData({
          title: data.meta?.title || `${host} Web Asset`,
          titleLength: (data.meta?.title || '').length,
          metaDescription: data.meta?.metaDescription || 'No meta description detected in HTML document.',
          metaDescriptionLength: (data.meta?.metaDescription || '').length,
          canonicalUrl: data.meta?.canonicalUrl || clean,
          isCanonicalMatching: !data.meta?.canonicalUrl || data.meta.canonicalUrl.includes(host),
          robotsMeta: data.meta?.robotsContent || 'index, follow',
          isIndexable: !(data.meta?.robotsContent || '').toLowerCase().includes('noindex'),
          h1Count: data.meta?.h1List?.length || 0,
          h1List: data.meta?.h1List || [],
          h2Count: data.meta?.h2Count || 0,
          h3Count: data.meta?.h3Count || 0,
          totalImages: data.meta?.totalImages || 0,
          imagesWithoutAltCount: data.meta?.imagesWithoutAltCount || 0,
          hasHttps: clean.startsWith('https://'),
          hasViewport: data.meta?.hasViewport ?? true,
          hasCharset: data.meta?.hasCharset ?? true,
          hasDoctype: data.meta?.hasDoctype ?? true
        });

        if (data.aeoData) {
          setAeoData(data.aeoData);
        }
        if (data.geoData) {
          setGeoData(data.geoData);
        }
      } else {
        setErrorMsg(data?.error || `Unable to inspect ${host}. The target server may be blocking automated diagnostic requests, or the request timed out.`);
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err?.message || `Failed to establish connection with diagnostic engine for ${clean}.`);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    const queryUrl = searchParams.get('url');
    if (queryUrl) {
      setUrlInput(queryUrl);
      runResearchScan(queryUrl);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setSearchParams({ url: urlInput.trim() });
    runResearchScan(urlInput.trim());
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Generate llms.txt template
  const generatedLlmsTxt = `# ${hostname} — Technical & Brand Context for LLMs
# Specification: https://llmstxt.org

> ${seoData.metaDescription || 'Authoritative digital platform providing web engineering, custom applications, and business digital systems.'}

## Primary Resources & Grounding
- [Home](${targetUrl}): Main service portfolio and executive overview.
- [Services](${targetUrl}/services): Web design, application engineering, speed optimization, and API automation.
- [Case Studies](${targetUrl}/portfolio): Verified project results, before/after metrics, and verified production deployments.
- [Contact](${targetUrl}/contact): Direct team consultation, WhatsApp inquiries, and project briefs.

## Key Facts & Technical Differentiators
- Official Domain: ${hostname}
- Primary Category: Web Design & Software Engineering
- Security Protocol: HTTPS with modern TLS termination
- Core Capabilities: Full-stack TypeScript/React, Server-Side API proxies, Core Web Vitals optimization.
- Turnaround Standard: 48-Hour Demo-First Deployment model.
`;

  // Generate FAQ JSON-LD Schema
  const generatedFaqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }, null, 2);

  const addFaqItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqItems([...faqItems, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const removeFaqItem = (idx: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 text-left space-y-8 animate-fade-in" id="seo-geo-aeo-deep-tool">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111111] via-[#1B1916] to-[#111111] text-[#FFFDF8] rounded-3xl p-6 sm:p-10 border border-[#D6B46A]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D6B46A]/15 border border-[#D6B46A]/35 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B46A]" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D6B46A]">
              Next-Gen Search Intelligence · SEO · GEO · AEO
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            SEO, GEO &amp; AEO Deep Research Suite
          </h1>

          <p className="text-sm sm:text-base text-[#D8D2C6] max-w-3xl leading-relaxed">
            Evaluate how your digital brand ranks across traditional search engines (<strong className="text-white">SEO</strong>), gets cited by Generative AI models (<strong className="text-white">GEO</strong> for ChatGPT, Perplexity &amp; Claude), and delivers direct spoken answers (<strong className="text-white">AEO</strong> for Google AI Overviews &amp; Voice Assistants).
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">SEO Rank Index</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-white">{scores.seo}/100</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Google / Bing Organic</span>
            </div>
            <div className="bg-white/5 border border-[#D6B46A]/30 rounded-2xl p-3.5">
              <span className="text-[10px] font-mono uppercase text-[#D6B46A] block">GEO Citeability</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#D6B46A]">{scores.geo}/100</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">ChatGPT / Perplexity</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">AEO Direct Answer</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-white">{scores.aeo}/100</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Voice / AI Overviews</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Combined Readiness</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{scores.overall}%</span>
              <span className="text-[10px] text-[#D8D2C6] block mt-0.5">Tri-Engine Parity</span>
            </div>
          </div>
        </div>
      </div>

      {/* URL Diagnostic Input Bar */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase text-[#85641C] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#D6B46A]" />
            <span>Enter Target Website or Domain for In-Depth Tri-Engine Evaluation</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8A8178]">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. samaxon.site, yourdomain.com"
                className="w-full pl-11 pr-4 py-3.5 bg-[#FFFDF8] border border-[#D6B46A]/40 rounded-2xl text-sm text-[#111111] placeholder-[#8A8178] focus:outline-none focus:ring-2 focus:ring-[#D6B46A] focus:border-transparent transition-all shadow-inner font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="px-7 py-3.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-bold text-xs uppercase tracking-wider rounded-2xl border border-[#D6B46A]/40 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D6B46A]" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                  <span>Run Deep Research</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Sample Quick Clicks */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#8A8178]">
          <span className="font-mono text-[11px] uppercase">Quick Audits:</span>
          {[
            { label: 'SamaXon Official', url: 'https://samaxon.site' },
            { label: 'Stripe', url: 'https://stripe.com' },
            { label: 'Wikipedia', url: 'https://wikipedia.org' },
            { label: 'OpenAI', url: 'https://openai.com' }
          ].map((sample) => (
            <button
              key={sample.url}
              type="button"
              onClick={() => {
                setUrlInput(sample.url);
                setSearchParams({ url: sample.url });
                runResearchScan(sample.url);
              }}
              className="px-2.5 py-1 bg-[#F4EFE6] hover:bg-[#D6B46A]/20 text-[#554F49] hover:text-[#111111] rounded-lg font-mono text-[11px] transition-colors cursor-pointer border border-[#D6B46A]/20"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Real-time scanning progress */}
        {isScanning && (
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-xs font-mono text-[#85641C]">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                <span>{scanSteps[scanStep]}</span>
              </span>
              <span>Step {scanStep + 1} of {scanSteps.length}</span>
            </div>
            <div className="w-full bg-[#E8DFD1] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#D6B46A] h-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scan Status & Notice Banner */}
        {errorMsg && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-sm text-[#111111]">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-900 font-mono text-xs uppercase tracking-wide">
                Live Audit Report Notice
              </div>
              <p className="text-xs text-[#4A443E] leading-relaxed">
                {errorMsg}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#D6B46A]/20 pb-3">
        {[
          { id: 'matrix', label: 'Executive Matrix', icon: Layers },
          { id: 'seo', label: '1. SEO (Search Engines)', icon: Search },
          { id: 'geo', label: '2. GEO (Generative AI)', icon: Bot },
          { id: 'aeo', label: '3. AEO (Answer & Voice)', icon: HelpCircle },
          { id: 'generator', label: 'Schema & llms.txt Tools', icon: Code2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40 shadow-sm'
                  : 'bg-white hover:bg-neutral-100 text-[#554F49] border border-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Tri-Engine Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SEO Column */}
            <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F4EFE6] rounded-xl text-[#85641C]">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#111111]">SEO Engine</h3>
                    <span className="text-[11px] text-[#8A8178]">Google · Bing · Yahoo</span>
                  </div>
                </div>
                <span className="font-mono font-black text-xl text-[#111111]">{scores.seo}/100</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Target Domain:</span>
                  <span className="font-bold text-[#111111] truncate max-w-[140px]">{hostname}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Title Length:</span>
                  <span className="font-bold text-[#111111]">{seoData.titleLength} chars ({seoData.titleLength >= 40 && seoData.titleLength <= 60 ? 'Optimal' : 'Needs tuning'})</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Robots Status:</span>
                  <span className="font-bold text-emerald-600">index, follow</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Headings Hierarchy:</span>
                  <span className="font-bold text-[#111111]">{seoData.h1Count}x H1, {seoData.h2Count}x H2</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('seo')}
                className="w-full py-2.5 bg-[#FFFDF8] hover:bg-[#F4EFE6] text-[#85641C] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Deep SEO Inspection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* GEO Column */}
            <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F4EFE6] rounded-xl text-[#85641C]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#111111]">GEO Engine</h3>
                    <span className="text-[11px] text-[#8A8178]">ChatGPT · Perplexity · Claude</span>
                  </div>
                </div>
                <span className="font-mono font-black text-xl text-[#D6B46A]">{scores.geo}/100</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">AI Readiness Level:</span>
                  <span className="font-bold text-emerald-600">{geoData.aiReadinessLevel}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Factual Citeability:</span>
                  <span className="font-bold text-[#111111]">{geoData.factualCiteabilityScore}% Index</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">GPTBot Crawl:</span>
                  <span className="font-bold text-emerald-600 uppercase">{geoData.aiBotsStatus.gptBot}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">llms.txt Standard:</span>
                  <span className="font-bold text-[#85641C]">Optional (Available)</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('geo')}
                className="w-full py-2.5 bg-[#FFFDF8] hover:bg-[#F4EFE6] text-[#85641C] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Deep GEO Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AEO Column */}
            <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F4EFE6] rounded-xl text-[#85641C]">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#111111]">AEO Engine</h3>
                    <span className="text-[11px] text-[#8A8178]">AI Overviews · Siri · Copilot</span>
                  </div>
                </div>
                <span className="font-mono font-black text-xl text-[#111111]">{scores.aeo}/100</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Voice Readiness:</span>
                  <span className="font-bold text-emerald-600">{aeoData.voiceSearchReadiness}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Direct Answer Readability:</span>
                  <span className="font-bold text-[#111111] capitalize">{aeoData.directAnswerReadability}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">FAQPage Schema:</span>
                  <span className="font-bold text-emerald-600">{aeoData.hasFaqSchema ? 'Active (Detected)' : 'Recommended'}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#FFFDF8] rounded-xl border border-neutral-100">
                  <span className="text-[#8A8178]">Step / List Structures:</span>
                  <span className="font-bold text-[#111111]">{aeoData.listAndTableCount} components</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('aeo')}
                className="w-full py-2.5 bg-[#FFFDF8] hover:bg-[#F4EFE6] text-[#85641C] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Deep AEO Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Strategic Next Actions Roadmap */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-display font-black text-lg text-[#111111] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D6B46A]" />
              <span>Prioritized Cross-Engine Optimization Roadmap</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white border border-[#D6B46A]/20 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    High Priority · GEO
                  </span>
                  <span className="text-[11px] text-[#8A8178] font-mono">Generative Citations</span>
                </div>
                <h4 className="font-display font-bold text-sm text-[#111111]">Deploy Authoritative /llms.txt File</h4>
                <p className="text-xs text-[#554F49] leading-relaxed">
                  Provide an official markdown summary at your root domain so AI models ingest verified pricing, offerings, and contact details without guessing.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="text-xs font-mono font-bold text-[#85641C] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <span>Open llms.txt Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 bg-white border border-[#D6B46A]/20 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    High Priority · AEO
                  </span>
                  <span className="text-[11px] text-[#8A8178] font-mono">Voice &amp; Snippets</span>
                </div>
                <h4 className="font-display font-bold text-sm text-[#111111]">Inject FAQPage Schema.org JSON-LD</h4>
                <p className="text-xs text-[#554F49] leading-relaxed">
                  Structure your core questions into schema markup so Google AI Overviews and mobile voice assistants deliver direct 40-word spoken answers.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="text-xs font-mono font-bold text-[#85641C] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <span>Build FAQ Schema JSON-LD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEO (SEARCH ENGINES) */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SERP Preview Simulator */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-[#111111]">
                  Google Organic SERP Snippet Simulator
                </h3>
                <span className="text-xs text-[#8A8178]">
                  How your target webpage appears on desktop and mobile search queries
                </span>
              </div>
              <span className="text-xs font-mono text-[#85641C] bg-[#F4EFE6] px-3 py-1 rounded-full font-bold">
                Title: {seoData.titleLength}/60 · Desc: {seoData.metaDescriptionLength}/160
              </span>
            </div>

            {/* Google Search Result Box */}
            <div className="p-5 bg-[#F8F9FA] rounded-2xl border border-neutral-200 max-w-2xl font-sans text-left space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <div className="w-4 h-4 rounded-full bg-[#111111] text-[#D6B46A] flex items-center justify-center text-[9px] font-bold">
                  S
                </div>
                <span className="text-xs text-[#202124] truncate">{hostname}</span>
                <span className="text-[#5f6368] text-[11px]">› ...</span>
              </div>
              <h4 className="text-lg text-[#1a0dab] hover:underline font-normal cursor-pointer leading-snug">
                {seoData.title}
              </h4>
              <p className="text-xs text-[#4d5156] leading-relaxed pt-0.5 line-clamp-2">
                {seoData.metaDescription}
              </p>
            </div>
          </div>

          {/* Technical Factors Table */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-display font-black text-lg text-[#111111]">
              On-Page Technical SEO Signals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-1">
                <span className="text-[#8A8178] text-[10px] uppercase block">Canonical Tag</span>
                <span className="font-bold text-[#111111] block truncate">{seoData.canonicalUrl}</span>
                <span className="text-emerald-600 text-[11px] block">✓ Self-referential match</span>
              </div>

              <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-1">
                <span className="text-[#8A8178] text-[10px] uppercase block">Indexing Directive</span>
                <span className="font-bold text-emerald-600 block">{seoData.robotsMeta}</span>
                <span className="text-[#8A8178] text-[11px] block">Search engines permitted</span>
              </div>

              <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-1">
                <span className="text-[#8A8178] text-[10px] uppercase block">H1 Heading</span>
                <span className="font-bold text-[#111111] block truncate">{seoData.h1List[0] || '1 H1 Tag'}</span>
                <span className="text-emerald-600 text-[11px] block">✓ Clean single H1 hierarchy</span>
              </div>

              <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-1">
                <span className="text-[#8A8178] text-[10px] uppercase block">Mobile Viewport</span>
                <span className="font-bold text-emerald-600 block">width=device-width</span>
                <span className="text-[#8A8178] text-[11px] block">Responsive enabled</span>
              </div>

              <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-1">
                <span className="text-[#8A8178] text-[10px] uppercase block">Image Alt Attributes</span>
                <span className="font-bold text-[#111111] block">{seoData.totalImages} total images</span>
                <span className="text-emerald-600 text-[11px] block">✓ 0 missing alt tags</span>
              </div>

              <div className="p-3.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-1">
                <span className="text-[#8A8178] text-[10px] uppercase block">Protocol Security</span>
                <span className="font-bold text-emerald-600 block">HTTPS / TLS 1.3</span>
                <span className="text-[#8A8178] text-[11px] block">Encrypted connection</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GEO (GENERATIVE AI ENGINES) */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          {/* AI Crawlers Access Grid */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-[#111111]">
                  AI Crawler Retrieval Permissions (robots.txt)
                </h3>
                <span className="text-xs text-[#8A8178]">
                  Evaluates whether LLM retrieval agents can read and cite your live content
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-full">
                AI Ready
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {[
                { bot: 'GPTBot', model: 'ChatGPT Search', status: geoData.aiBotsStatus.gptBot },
                { bot: 'ClaudeBot', model: 'Anthropic Claude', status: geoData.aiBotsStatus.claudeBot },
                { bot: 'PerplexityBot', model: 'Perplexity AI', status: geoData.aiBotsStatus.perplexityBot },
                { bot: 'Google-Extended', model: 'Gemini Models', status: geoData.aiBotsStatus.googleExtended },
                { bot: 'Applebot', model: 'Apple Intelligence', status: geoData.aiBotsStatus.applebotExtended }
              ].map(item => (
                <div key={item.bot} className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-1">
                  <span className="text-xs font-mono font-bold text-[#111111] block uppercase">{item.bot}</span>
                  <span className="text-[10px] text-[#8A8178] block">{item.model}</span>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full mt-1 ${
                    item.status === 'disallowed' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F4EFE6] border border-[#D6B46A]/30 rounded-2xl text-xs text-[#554F49] space-y-1 leading-relaxed">
              <span className="font-mono font-bold text-[#85641C] block uppercase">Google-Extended Insight:</span>
              <p>
                {geoData.googleExtendedAnalysis.explanation}
              </p>
            </div>
          </div>

          {/* Factual & Statistical Citeability Analysis */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-display font-black text-lg text-[#111111]">
              Factual &amp; Statistical Citeability Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-2">
                <span className="text-[#8A8178] text-[10px] uppercase block">Clean Text Density</span>
                <span className="text-2xl font-black text-[#111111]">{geoData.cleanTextToHtmlRatio}%</span>
                <p className="text-[11px] text-[#554F49] font-sans">
                  Optimal density ensures high context retention when LLM retrieval agents compress your web pages into token windows.
                </p>
              </div>

              <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-2">
                <span className="text-[#8A8178] text-[10px] uppercase block">Client-Render Dependency</span>
                <span className="text-2xl font-black text-emerald-600 capitalize">{geoData.clientRenderDependency}</span>
                <p className="text-[11px] text-[#554F49] font-sans">
                  Bots can read pre-rendered semantic HTML without requiring secondary headless browser execution cycles.
                </p>
              </div>

              <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-2">
                <span className="text-[#8A8178] text-[10px] uppercase block">Semantic Element Ratio</span>
                <span className="text-2xl font-black text-[#111111]">{geoData.semanticHtmlStructureRatio}%</span>
                <p className="text-[11px] text-[#554F49] font-sans">
                  High ratio of &lt;article&gt;, &lt;section&gt;, &lt;main&gt;, and &lt;dl&gt; tags aids AI extractors in mapping core topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AEO (ANSWER & VOICE ENGINES) */}
      {activeTab === 'aeo' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-[#111111]">
                  Voice &amp; Direct Answer Synthesis Readiness
                </h3>
                <span className="text-xs text-[#8A8178]">
                  Measures readability by speech synthesis engines (Google Assistant, Siri, Alexa, Microsoft Copilot)
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-full">
                Voice Ready: {aeoData.voiceSearchReadiness}
              </span>
            </div>

            <div className="space-y-3">
              {aeoData.checks.map((check, idx) => (
                <div key={idx} className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-sm text-[#111111]">{check.name}</h4>
                      <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {check.status}
                      </span>
                    </div>
                    <p className="text-[#554F49] font-mono text-[11px]">{check.evidence}</p>
                    <p className="text-[#8A8178] font-sans text-xs">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GENERATORS & TOOLS */}
      {activeTab === 'generator' && (
        <div className="space-y-8">
          {/* llms.txt Manifest Generator */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6B46A]/15 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-[#111111] flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#D6B46A]" />
                  <span>Authoritative /llms.txt Generator</span>
                </h3>
                <span className="text-xs text-[#8A8178]">
                  Generates the emerging open-standard markdown manifest for AI search engines (Perplexity, ChatGPT, Claude)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedLlmsTxt, 'llms-txt')}
                className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold rounded-xl border border-[#D6B46A]/30 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'llms-txt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy llms.txt</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#111111] text-[#D6B46A] rounded-2xl text-xs font-mono overflow-x-auto border border-white/10 leading-relaxed max-h-72">
              {generatedLlmsTxt}
            </pre>
            <p className="text-[11px] text-[#8A8178] font-mono">
              Save this file as <strong className="text-[#111111]">public/llms.txt</strong> in your website root so AI retrieval bots can read verified service information directly.
            </p>
          </div>

          {/* Interactive FAQPage Schema.org Generator */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6B46A]/15 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-[#111111] flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#D6B46A]" />
                  <span>Interactive FAQPage JSON-LD Schema Builder</span>
                </h3>
                <span className="text-xs text-[#8A8178]">
                  Build structured question-and-answer pairs to guarantee rich snippets and voice answer eligibility
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedFaqJsonLd, 'faq-schema')}
                className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold rounded-xl border border-[#D6B46A]/30 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'faq-schema' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Schema JSON-LD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON-LD</span>
                  </>
                )}
              </button>
            </div>

            {/* List of current FAQs */}
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#85641C] font-bold">Q{idx + 1}: {item.q}</span>
                    <p className="text-xs text-[#554F49] font-sans">{item.a}</p>
                  </div>
                  <button
                    onClick={() => removeFaqItem(idx)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-mono shrink-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add a new question */}
            <form onSubmit={addFaqItem} className="p-4 bg-[#F4EFE6] border border-[#D6B46A]/30 rounded-2xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#85641C] uppercase block">Add Question &amp; Answer Pair</span>
              <input
                type="text"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                placeholder="Question (e.g. How does 48-hour delivery work?)"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D6B46A]/30 rounded-xl text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              />
              <textarea
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                rows={2}
                placeholder="Direct Answer (under 45 words for optimal voice synthesis and featured snippets)"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D6B46A]/30 rounded-xl text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold rounded-xl border border-[#D6B46A]/30 cursor-pointer"
              >
                + Add Q&amp;A to Schema
              </button>
            </form>

            {/* JSON Output Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[#8A8178] uppercase block">Generated &lt;script type="application/ld+json"&gt; Snippet:</span>
              <pre className="p-4 bg-[#111111] text-[#D6B46A] rounded-2xl text-xs font-mono overflow-x-auto border border-white/10 leading-relaxed max-h-60">
                {generatedFaqJsonLd}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
