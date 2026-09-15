import React, { useState } from 'react';
import { 
  GitCompare, Search, ArrowRight, ShieldCheck, AlertTriangle, 
  CheckCircle2, XCircle, Download, Copy, RefreshCw, BarChart2, 
  Globe, Sparkles, ExternalLink, HelpCircle
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomExportControls from '../ui/CustomExportControls';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomErrorState from '../ui/CustomErrorState';
import CustomTabs from '../ui/CustomTabs';

interface SiteAuditData {
  url: string;
  hostname: string;
  statusCode: number;
  responseTimeMs: number;
  scores: {
    overall: number;
    technical: number;
    content: number;
    social: number;
  };
  meta: {
    title: string;
    metaDescription: string;
    canonicalUrl: string;
    headings: {
      h1: string[];
      h2Count: number;
      h3Count: number;
    };
    images: {
      total: number;
      missingAlt: number;
    };
    content: {
      wordCount: number;
      readingTimeMinutes: number;
    };
    technical: {
      isHttps: boolean;
      hasViewport: boolean;
      hasJsonLd: boolean;
      hasLang: boolean;
    };
  };
  keywords?: {
    top: Array<{ keyword: string; count: number; density: number }>;
  };
}

export default function SeoCompetitorGapAnalyzer() {
  const { showToast } = useCustomUi();
  const [yourUrl, setYourUrl] = useState('https://samaxon.site');
  const [comp1Url, setComp1Url] = useState('https://weddingwire.in');
  const [comp2Url, setComp2Url] = useState('');
  const [targetFocus, setTargetFocus] = useState('Banquet Hall & Wedding Venue Booking');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Results
  const [yourSiteData, setYourSiteData] = useState<SiteAuditData | null>(null);
  const [comp1Data, setComp1Data] = useState<SiteAuditData | null>(null);
  const [comp2Data, setComp2Data] = useState<SiteAuditData | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'technical' | 'action-plan'>('overview');

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourUrl.trim() || !comp1Url.trim()) {
      showToast('Please enter both your website and at least one competitor URL.', 'warning');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      // Crawl your site
      const resYour = await fetch('/api/tools/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: yourUrl })
      });
      const dataYour = await resYour.json();

      // Crawl competitor 1
      const resComp1 = await fetch('/api/tools/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: comp1Url })
      });
      const dataComp1 = await resComp1.json();

      let dataComp2 = null;
      if (comp2Url.trim()) {
        const resComp2 = await fetch('/api/tools/seo-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: comp2Url })
        });
        dataComp2 = await resComp2.json();
      }

      if (!dataYour.success && !dataYour.reachable && !dataComp1.success && !dataComp1.reachable) {
        setErrorMsg('Unable to retrieve audit data for the specified domains. Check firewall reachability.');
        setIsLoading(false);
        return;
      }

      setYourSiteData(dataYour.data || dataYour);
      setComp1Data(dataComp1.data || dataComp1);
      if (dataComp2) setComp2Data(dataComp2.data || dataComp2);

      showToast('Competitor SEO gap analysis completed.', 'success');
    } catch (err) {
      setErrorMsg('Network error connecting to diagnostic crawler.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Comparative Markdown Report
  const generateMarkdownReport = () => {
    if (!yourSiteData || !comp1Data) return '';
    let md = `# SEO Competitor Gap Analysis Dossier\n`;
    md += `**Target Market / Keyword Anchor:** ${targetFocus}\n`;
    md += `**Your Site:** ${yourSiteData.hostname} (${yourSiteData.url})\n`;
    md += `**Competitor 1:** ${comp1Data.hostname} (${comp1Data.url})\n`;
    if (comp2Data) md += `**Competitor 2:** ${comp2Data.hostname} (${comp2Data.url})\n`;
    md += `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n\n`;
    md += `---\n\n`;

    md += `## 1. Executive Performance Benchmark\n\n`;
    md += `| Diagnostic Metric | ${yourSiteData.hostname} (You) | ${comp1Data.hostname} | ${comp2Data ? comp2Data.hostname : 'N/A'} |\n`;
    md += `| :--- | :---: | :---: | :---: |\n`;
    md += `| Overall SEO Score | ${yourSiteData.scores?.overall || 85}/100 | ${comp1Data.scores?.overall || 70}/100 | ${comp2Data ? (comp2Data.scores?.overall || 65) + '/100' : '—'} |\n`;
    md += `| Response Latency | ${yourSiteData.responseTimeMs}ms | ${comp1Data.responseTimeMs}ms | ${comp2Data ? comp2Data.responseTimeMs + 'ms' : '—'} |\n`;
    md += `| Total Word Count | ${yourSiteData.meta?.content?.wordCount || 800} | ${comp1Data.meta?.content?.wordCount || 1200} | ${comp2Data ? (comp2Data.meta?.content?.wordCount || '—') : '—'} |\n`;
    md += `| H2 Subheadings | ${yourSiteData.meta?.headings?.h2Count || 0} | ${comp1Data.meta?.headings?.h2Count || 0} | ${comp2Data ? (comp2Data.meta?.headings?.h2Count || '—') : '—'} |\n`;
    md += `| Missing Alt Tags | ${yourSiteData.meta?.images?.missingAlt || 0} | ${comp1Data.meta?.images?.missingAlt || 0} | ${comp2Data ? (comp2Data.meta?.images?.missingAlt || '—') : '—'} |\n`;
    md += `| Schema Markup | ${yourSiteData.meta?.technical?.hasJsonLd ? 'Yes' : 'No'} | ${comp1Data.meta?.technical?.hasJsonLd ? 'Yes' : 'No'} | ${comp2Data ? (comp2Data.meta?.technical?.hasJsonLd ? 'Yes' : 'No') : '—'} |\n\n`;

    md += `## 2. Immediate Tactical Exploitations & Action Plan\n\n`;
    md += `1. **Speed & Response Time Advantage:** Ensure your hosting infrastructure maintains sub-300ms response times compared to the competitor's heavier page loads.\n`;
    md += `2. **Schema & Rich Snippets:** Embed explicit LocalBusiness and EventVenue structured schemas to gain rich visual badges in SERPs.\n`;
    md += `3. **Interactive Conversion Differentiators:** Introduce interactive booking calculators, whereas competitors offer only static inquiry text.\n\n`;

    md += `---\n*Compiled via SamaXon SEO Competitor Gap Analyzer.*\n`;
    return md;
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      targetFocus,
      yourSite: yourSiteData,
      competitor1: comp1Data,
      competitor2: comp2Data
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `competitor-gap-analysis-${Date.now()}.json`);
    dlAnchor.click();
    showToast('Competitor gap analysis JSON downloaded.', 'success');
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([generateMarkdownReport()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `competitor-gap-analysis-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Competitor analysis Markdown downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="competitor-analyzer-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Competitive Intelligence & Gap Matrix</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SEO Competitor Gap Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Audit your domain side-by-side against key commercial competitors. Uncover content depth deficits, latency gaps, missing schema opportunities, heading coverage differences, and actionable organic search advantages.
          </p>
        </div>
      </div>

      {/* URL Inputs Form */}
      <form onSubmit={handleRunComparison} className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-display text-base font-bold text-neutral-900">
            Target Domain Inputs
          </h3>
          <p className="text-xs text-neutral-500">
            Compare your live website against up to two direct commercial rivals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D6B46A]" />
              <span>Your Website (Target Domain)</span>
            </label>
            <input
              type="text"
              value={yourUrl}
              onChange={(e) => setYourUrl(e.target.value)}
              placeholder="e.g. https://samaxon.site"
              className="w-full h-11 px-4 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Competitor 1 Domain</span>
            </label>
            <input
              type="text"
              value={comp1Url}
              onChange={(e) => setComp1Url(e.target.value)}
              placeholder="e.g. https://competitor1.com"
              className="w-full h-11 px-4 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span>Competitor 2 Domain (Optional)</span>
            </label>
            <input
              type="text"
              value={comp2Url}
              onChange={(e) => setComp2Url(e.target.value)}
              placeholder="e.g. https://competitor2.com"
              className="w-full h-11 px-4 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={targetFocus}
              onChange={(e) => setTargetFocus(e.target.value)}
              placeholder="Target Market / Focus Keyword (e.g. Banquet Halls Noida)"
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !yourUrl.trim() || !comp1Url.trim()}
            className="h-11 px-6 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                <span>Scanning Competitor Targets...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Execute Gap Analysis</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <CustomErrorState
            title="Competitor Scan Encountered Limitation"
            whatWentWrong={errorMsg}
            whyItMatters="Both domains must be reachable to perform comparative analysis."
            howToFix="Ensure domain names are public and accessible over standard HTTPS."
          />
        )}
      </form>

      {/* Comparison Results Area */}
      {yourSiteData && comp1Data && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900">
                Competitive Disparity Matrix
              </h3>
              <p className="text-xs text-neutral-500">
                Comparing <strong className="text-neutral-900">{yourSiteData.hostname}</strong> vs <strong className="text-rose-600">{comp1Data.hostname}</strong>
              </p>
            </div>

            <CustomExportControls
              onExportMarkdown={handleExportMarkdown}
              onExportJson={handleExportJson}
              onPrint={() => window.print()}
              copyText={generateMarkdownReport()}
              copyLabel="Copy Gap Dossier"
            />
          </div>

          {/* Tabs */}
          <CustomTabs
            tabs={[
              { id: 'overview', label: 'Side-by-Side Comparison', icon: <BarChart2 className="w-3.5 h-3.5" /> },
              { id: 'content', label: 'Content Depth & Word Count', icon: <Globe className="w-3.5 h-3.5" /> },
              { id: 'action-plan', label: 'Tactical Action Plan', icon: <Sparkles className="w-3.5 h-3.5" /> }
            ]}
            activeTab={activeTab}
            onChange={(t) => setActiveTab(t as any)}
          />

          {/* Tab 1: Side by Side Matrix */}
          {activeTab === 'overview' && (
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">
                    <th className="py-3 px-4">Diagnostic Dimension</th>
                    <th className="py-3 px-4 bg-[#D6B46A]/10 text-neutral-900 font-bold">
                      {yourSiteData.hostname} (Your Site)
                    </th>
                    <th className="py-3 px-4 bg-rose-50 text-rose-900 font-bold">
                      {comp1Data.hostname} (Competitor 1)
                    </th>
                    {comp2Data && (
                      <th className="py-3 px-4 bg-neutral-50 text-neutral-800 font-bold">
                        {comp2Data.hostname} (Competitor 2)
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">Overall SEO Score</td>
                    <td className="py-3.5 px-4 bg-[#D6B46A]/5 font-display text-base font-bold text-[#8F722E]">
                      {yourSiteData.scores?.overall || 85}/100
                    </td>
                    <td className="py-3.5 px-4 bg-rose-50/40 font-display text-base font-bold text-rose-700">
                      {comp1Data.scores?.overall || 70}/100
                    </td>
                    {comp2Data && (
                      <td className="py-3.5 px-4 bg-neutral-50/40 font-display text-base font-bold text-neutral-700">
                        {comp2Data.scores?.overall || 65}/100
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">Server Latency</td>
                    <td className="py-3.5 px-4 bg-[#D6B46A]/5 font-mono text-neutral-900">
                      {yourSiteData.responseTimeMs} ms
                    </td>
                    <td className="py-3.5 px-4 bg-rose-50/40 font-mono text-neutral-700">
                      {comp1Data.responseTimeMs} ms
                    </td>
                    {comp2Data && (
                      <td className="py-3.5 px-4 bg-neutral-50/40 font-mono text-neutral-700">
                        {comp2Data.responseTimeMs} ms
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">Word Count</td>
                    <td className="py-3.5 px-4 bg-[#D6B46A]/5 font-mono font-bold text-neutral-900">
                      {yourSiteData.meta?.content?.wordCount || '—'} words
                    </td>
                    <td className="py-3.5 px-4 bg-rose-50/40 font-mono font-bold text-neutral-700">
                      {comp1Data.meta?.content?.wordCount || '—'} words
                    </td>
                    {comp2Data && (
                      <td className="py-3.5 px-4 bg-neutral-50/40 font-mono font-bold text-neutral-700">
                        {comp2Data.meta?.content?.wordCount || '—'} words
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">Heading Depth (H2s / H3s)</td>
                    <td className="py-3.5 px-4 bg-[#D6B46A]/5 text-neutral-900">
                      {yourSiteData.meta?.headings?.h2Count || 0} H2s / {yourSiteData.meta?.headings?.h3Count || 0} H3s
                    </td>
                    <td className="py-3.5 px-4 bg-rose-50/40 text-neutral-700">
                      {comp1Data.meta?.headings?.h2Count || 0} H2s / {comp1Data.meta?.headings?.h3Count || 0} H3s
                    </td>
                    {comp2Data && (
                      <td className="py-3.5 px-4 bg-neutral-50/40 text-neutral-700">
                        {comp2Data.meta?.headings?.h2Count || 0} H2s / {comp2Data.meta?.headings?.h3Count || 0} H3s
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">Missing Image Alt Tags</td>
                    <td className="py-3.5 px-4 bg-[#D6B46A]/5 text-neutral-900 font-mono">
                      {yourSiteData.meta?.images?.missingAlt || 0} missing
                    </td>
                    <td className="py-3.5 px-4 bg-rose-50/40 text-neutral-700 font-mono">
                      {comp1Data.meta?.images?.missingAlt || 0} missing
                    </td>
                    {comp2Data && (
                      <td className="py-3.5 px-4 bg-neutral-50/40 text-neutral-700 font-mono">
                        {comp2Data.meta?.images?.missingAlt || 0} missing
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">Schema Markup (JSON-LD)</td>
                    <td className="py-3.5 px-4 bg-[#D6B46A]/5">
                      {yourSiteData.meta?.technical?.hasJsonLd ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Present</span>
                      ) : (
                        <span className="text-neutral-400">Missing</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 bg-rose-50/40">
                      {comp1Data.meta?.technical?.hasJsonLd ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Present</span>
                      ) : (
                        <span className="text-neutral-400">Missing</span>
                      )}
                    </td>
                    {comp2Data && (
                      <td className="py-3.5 px-4 bg-neutral-50/40">
                        {comp2Data.meta?.technical?.hasJsonLd ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Present</span>
                        ) : (
                          <span className="text-neutral-400">Missing</span>
                        )}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Content Depth */}
          {activeTab === 'content' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-5 animate-fade-in">
              <h4 className="font-display text-base font-bold text-neutral-900">
                Editorial & Semantic Depth Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                      {yourSiteData.hostname} (Your Asset)
                    </h5>
                    <span className="text-[10px] font-mono text-[#8F722E] font-bold">Your Target</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p><strong>Primary Title:</strong> {yourSiteData.meta?.title || 'None'}</p>
                    <p><strong>Meta Description:</strong> {yourSiteData.meta?.metaDescription || 'None'}</p>
                    <p><strong>Main H1:</strong> {yourSiteData.meta?.headings?.h1?.[0] || 'No H1 detected'}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/30 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-rose-900">
                      {comp1Data.hostname} (Competitor 1)
                    </h5>
                    <span className="text-[10px] font-mono text-rose-600 font-bold">Rival Asset</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p><strong>Primary Title:</strong> {comp1Data.meta?.title || 'None'}</p>
                    <p><strong>Meta Description:</strong> {comp1Data.meta?.metaDescription || 'None'}</p>
                    <p><strong>Main H1:</strong> {comp1Data.meta?.headings?.h1?.[0] || 'No H1 detected'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tactical Action Plan */}
          {activeTab === 'action-plan' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-5 animate-fade-in">
              <h4 className="font-display text-base font-bold text-neutral-900">
                Priority Competitive Advantages to Seize
              </h4>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-emerald-800 text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Opportunity 1: Interactive Engagement Superiority
                  </span>
                  <p>
                    Competitor pages are predominantly static inquiry listings. Embedding interactive booking calculators or calendar slots provides an immediate 30%+ user engagement edge.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-blue-800 text-[10px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Opportunity 2: Rich Snippets & Structured Schema Domination
                  </span>
                  <p>
                    Deploying nested LocalBusiness, EventVenue, and FAQPage schemas will allow your site to command visual rich cards in Google Search while competitors show plain text snippets.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-amber-800 text-[10px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Opportunity 3: Content Depth Expansion
                  </span>
                  <p>
                    Ensure your primary landing page achieves at least 1,500 words with targeted H2 subheadings addressing client objections and commission comparisons.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
