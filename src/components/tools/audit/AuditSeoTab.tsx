import React from 'react';
import { 
  Search, FileText, CheckCircle2, AlertTriangle, 
  XCircle, Globe, Share2, Layers, Wrench, ExternalLink
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
