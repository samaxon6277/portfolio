import React from 'react';
import { 
  Search, FileText, CheckCircle2, AlertTriangle, 
  XCircle, Globe, Share2, Layers, Wrench, ExternalLink,
  Bot, Sparkles, Brain, HelpCircle, ShieldCheck
} from 'lucide-react';
import { ComprehensiveAuditReport } from '../../../utils/auditEngine/types';

interface AuditSeoTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditSeoTab: React.FC<AuditSeoTabProps> = ({
  report,
  onRequestFix
}) => {
  const seo = report.seoData || {
    title: report.meta?.title || '',
    titleLength: report.meta?.title?.length || 0,
    metaDescription: report.meta?.metaDescription || '',
    metaDescriptionLength: report.meta?.metaDescription?.length || 0,
    canonicalUrl: report.meta?.canonicalUrl || '',
    isCanonicalMatching: true,
    robotsMeta: report.meta?.robotsContent || 'index, follow',
    xRobotsHeader: null,
    robotsTxtStatus: { checked: false, exists: false, status: 0, allowsCrawl: true, sitemapUrlsFound: [] },
    sitemapStatus: { checked: false, exists: false, status: 0, urlCountEstimate: 0 },
    headings: {
      h1List: report.meta?.h1List || [],
      h2Count: report.meta?.h2Count || 0,
      h3Count: report.meta?.h3Count || 0,
      totalHeadings: (report.meta?.h1List?.length || 0) + (report.meta?.h2Count || 0) + (report.meta?.h3Count || 0),
      isHierarchyValid: (report.meta?.h1List?.length || 0) === 1,
      hierarchyIssues: []
    },
    openGraph: {
      hasOgTitle: !!report.meta?.ogTitle,
      ogTitle: report.meta?.ogTitle || null,
      hasOgDescription: !!report.meta?.ogDescription,
      ogDescription: report.meta?.ogDescription || null,
      hasOgImage: !!report.meta?.ogImage,
      ogImage: report.meta?.ogImage || null,
      twitterCard: report.meta?.twitterCard || null
    },
    schemaJsonLd: { count: report.deepHealth?.hasJsonLd ? 1 : 0, items: [], detectedTypes: [] },
    langAttribute: 'en'
  };

  const aeo = report.aeoData || seo.aeoData;
  const geo = report.geoData || seo.geoData;

  const titleLength = seo.titleLength;
  const isTitleIdeal = titleLength >= 50 && titleLength <= 60;
  const descLength = seo.metaDescriptionLength;
  const isDescIdeal = descLength >= 120 && descLength <= 160;
  const h1Count = seo.headings.h1List.length;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Search className="w-4 h-4 text-[#D6B46A]" />
              <span>Technical SEO, Crawlability &amp; Social Snippets</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Search Engine &amp; Social Graph Inspection
            </h3>
            <p className="text-xs text-[#8A8178]">
              Validates page titles, meta descriptions, canonical targets, heading hierarchy, OpenGraph social cards, and Schema.org JSON-LD.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">SEO Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.seo?.score ?? report.scores?.seo ?? 0}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* Title & Description Quality Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Meter */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111]">HTML &lt;title&gt; Tag</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isTitleIdeal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {titleLength} characters {isTitleIdeal ? '(Ideal: 50-60)' : '(Needs Adjustment)'}
              </span>
            </div>
            <p className="font-mono text-xs text-[#111111] bg-white p-2.5 rounded-xl border border-[#D6B46A]/20">
              {seo.title || '<Missing Title Tag>'}
            </p>
          </div>

          {/* Meta Description Meter */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111]">Meta Description</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isDescIdeal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {descLength} characters {isDescIdeal ? '(Ideal: 120-160)' : '(Needs Adjustment)'}
              </span>
            </div>
            <p className="font-mono text-xs text-[#111111] bg-white p-2.5 rounded-xl border border-[#D6B46A]/20">
              {seo.metaDescription || '<Missing Meta Description>'}
            </p>
          </div>
        </div>
      </div>

      {/* AEO & GEO Intelligence Panels */}
      {(aeo || geo) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AEO: Answer Engine Optimization */}
          {aeo && (
            <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F4EFE6] rounded-xl text-[#85641C]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-[#111111]">
                      AEO (Answer Engine Optimization)
                    </h4>
                    <span className="text-[11px] text-[#8A8178]">
                      Voice search, featured snippets &amp; AI answers
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                  aeo.voiceSearchReadiness === 'High' ? 'bg-emerald-100 text-emerald-800' :
                  aeo.voiceSearchReadiness === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  Voice: {aeo.voiceSearchReadiness}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Entity Clarity</span>
                  <span className="font-display font-black text-lg text-[#111111]">{aeo.entityClarityScore}</span>
                  <span className="text-[10px] font-mono text-[#8A8178]">/100</span>
                </div>
                <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">FAQ Schema</span>
                  <span className="font-display font-black text-sm text-[#111111] block mt-1">
                    {aeo.hasFaqSchema ? 'Present' : 'Missing'}
                  </span>
                </div>
                <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Answer Readability</span>
                  <span className="font-display font-black text-sm text-[#111111] capitalize block mt-1">
                    {aeo.directAnswerReadability}
                  </span>
                </div>
              </div>

              {aeo.detectedEntities.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Detected Knowledge Graph Entities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {aeo.detectedEntities.map((ent, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 bg-[#F4EFE6] text-[#111111] rounded-lg border border-[#D6B46A]/25">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence-Based AEO Checks */}
              {aeo.checks && aeo.checks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#D6B46A]/15">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">AEO Verification Checklist:</span>
                  <div className="space-y-1.5">
                    {aeo.checks.map((chk, idx) => (
                      <div key={idx} className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/15 rounded-xl text-left space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#111111]">{chk.name}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                            chk.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                            chk.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                            chk.status === 'NOT AVAILABLE' ? 'bg-zinc-100 text-zinc-700' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {chk.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#8A8178]">{chk.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aeo.recommendations.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#D6B46A]/15">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">AEO Priorities:</span>
                  {aeo.recommendations.slice(0, 2).map((rec, idx) => (
                    <div key={idx} className="text-xs text-[#111111] flex items-start gap-1.5 bg-[#FFFDF8] p-2 rounded-xl border border-[#D6B46A]/15">
                      <HelpCircle className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GEO: Generative Engine Optimization */}
          {geo && (
            <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F4EFE6] rounded-xl text-[#85641C]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-[#111111]">
                      GEO (Generative Engine Optimization)
                    </h4>
                    <span className="text-[11px] text-[#8A8178]">
                      AI search citations (ChatGPT, Perplexity, Claude)
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                  geo.aiReadinessLevel === 'AI-Ready' ? 'bg-emerald-100 text-emerald-800' :
                  geo.aiReadinessLevel === 'Partially Optimized' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {geo.aiReadinessLevel}
                </span>
              </div>

              {/* AI Bots Status Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#8A8178] block">robots.txt AI Crawlers Access:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-center">
                  {Object.entries(geo.aiBotsStatus).map(([bot, status]) => (
                    <div key={bot} className="p-2 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                      <span className="text-[9px] font-mono text-[#8A8178] block truncate uppercase">
                        {bot.replace('Bot', '').replace('Extended', '+')}
                      </span>
                      <span className={`text-[10px] font-mono font-bold capitalize block mt-0.5 ${
                        status === 'disallowed' ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                  <span className="text-[9px] font-mono uppercase text-[#8A8178] block">Citeability</span>
                  <span className="font-display font-black text-base text-[#111111]">{geo.factualCiteabilityScore}</span>
                  <span className="text-[9px] font-mono text-[#8A8178]">/100</span>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                  <span className="text-[9px] font-mono uppercase text-[#8A8178] block">Text/HTML</span>
                  <span className="font-display font-black text-base text-[#111111]">{geo.cleanTextToHtmlRatio}%</span>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
                  <span className="text-[9px] font-mono uppercase text-[#8A8178] block">JS Dependency</span>
                  <span className="font-display font-black text-xs text-[#111111] capitalize block mt-1">{geo.clientRenderDependency}</span>
                </div>
              </div>

              {/* llms.txt and Google-Extended Technical Disclosure Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#D6B46A]/15 text-left">
                <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/15 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#111111]">llms.txt</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-zinc-100 text-zinc-700 rounded font-bold">
                      Optional
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8A8178] leading-tight">
                    {geo.llmsTxtStatus?.note || 'Optional markdown summary for LLMs; not required for Google search ranking.'}
                  </p>
                </div>
                <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/15 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#111111]">Google-Extended</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      geo.googleExtendedAnalysis?.status === 'disallowed' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {geo.googleExtendedAnalysis?.status || 'Allowed'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8A8178] leading-tight">
                    Controls Gemini training grounding only. Does not influence standard Google Search indexing.
                  </p>
                </div>
              </div>

              {/* Evidence-Based GEO Checks */}
              {geo.checks && geo.checks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#D6B46A]/15">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">GEO Technical Evidence:</span>
                  <div className="space-y-1.5">
                    {geo.checks.map((chk, idx) => (
                      <div key={idx} className="p-2 bg-[#FFFDF8] border border-[#D6B46A]/15 rounded-xl text-left space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#111111]">{chk.name}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                            chk.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                            chk.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                            chk.status === 'NOT AVAILABLE' ? 'bg-zinc-100 text-zinc-700' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {chk.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-[#8A8178]">{chk.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Visibility vs Readiness Disclaimer */}
              <div className="p-2.5 bg-[#F4EFE6]/60 rounded-xl border border-[#D6B46A]/20 text-[10px] text-[#8A8178] text-left leading-relaxed">
                <span className="font-bold text-[#111111] block mb-0.5">Readiness vs. Observed Visibility:</span>
                This audit analyzes on-page HTML, structured data, and crawler policies. Real-world AI search citations depend on external LLM indexing and live user query relevance.
              </div>

              {geo.recommendations.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#D6B46A]/15">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] block">GEO Priorities:</span>
                  {geo.recommendations.slice(0, 2).map((rec, idx) => (
                    <div key={idx} className="text-xs text-[#111111] flex items-start gap-1.5 bg-[#FFFDF8] p-2 rounded-xl border border-[#D6B46A]/15">
                      <Brain className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Heading Hierarchy & Social Graph Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Headings Hierarchy */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <h4 className="font-display font-black text-sm text-[#111111]">
              Document Heading Structure
            </h4>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              h1Count === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {h1Count === 1 ? '1 H1 (Valid)' : `${h1Count} H1 Tags`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">&lt;h1&gt;</span>
              <span className="font-display font-black text-lg text-[#111111]">{h1Count}</span>
            </div>
            <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">&lt;h2&gt;</span>
              <span className="font-display font-black text-lg text-[#111111]">{seo.headings.h2Count}</span>
            </div>
            <div className="p-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">&lt;h3&gt;</span>
              <span className="font-display font-black text-lg text-[#111111]">{seo.headings.h3Count}</span>
            </div>
          </div>

          {seo.headings.h1List.length > 0 && (
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] block">H1 Tag Content:</span>
              {seo.headings.h1List.map((h1, idx) => (
                <div key={idx} className="p-2.5 bg-[#F4EFE6]/50 rounded-xl font-mono text-[#111111]">
                  "{h1}"
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social Card / OpenGraph Preview */}
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <h4 className="font-display font-black text-sm text-[#111111] flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-[#D6B46A]" />
              Social Card Preview (og:image &amp; Twitter)
            </h4>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              seo.openGraph.hasOgTitle ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {seo.openGraph.hasOgTitle ? 'OG Tags Active' : 'Missing OG Tags'}
            </span>
          </div>

          <div className="border border-[#D6B46A]/30 rounded-2xl overflow-hidden bg-[#FFFDF8]">
            <div className="h-28 bg-[#F4EFE6] flex items-center justify-center text-[#8A8178] text-xs font-mono">
              {seo.openGraph.ogImage ? (
                <img src={seo.openGraph.ogImage} alt="OG Preview" className="h-full w-full object-cover" />
              ) : (
                'No og:image Specified'
              )}
            </div>
            <div className="p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-[#8A8178] block uppercase">
                {report.hostname}
              </span>
              <h5 className="font-bold text-xs text-[#111111] truncate">
                {seo.openGraph.ogTitle || seo.title || 'No Title'}
              </h5>
              <p className="text-[11px] text-[#8A8178] line-clamp-2">
                {seo.openGraph.ogDescription || seo.metaDescription || 'No description provided.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRequestFix('SEO & OpenGraph Configuration')}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Configure Rich Meta Tags &amp; JSON-LD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

