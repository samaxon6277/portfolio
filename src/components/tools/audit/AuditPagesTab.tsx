import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, AlertTriangle, XCircle, 
  ExternalLink, Wrench, Clock, Search, Map, ShieldAlert,
  Copy, Check, FileCheck, Layers, ArrowRight
} from 'lucide-react';
import { ComprehensiveAuditReport, ScannedSubpageHealth } from '../../../utils/auditEngine/types';

interface AuditPagesTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditPagesTab: React.FC<AuditPagesTabProps> = ({
  report,
  onRequestFix
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'issues' | 'slow'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const pages: ScannedSubpageHealth[] = report.internalPages || [];
  const seo = report.seoData;
  const sitemap = seo?.sitemapStatus;
  const robots = seo?.robotsTxtStatus;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredPages = pages.filter(p => {
    if (filterMode === 'issues') return p.issues && p.issues.length > 0;
    if (filterMode === 'slow') return p.responseTimeMs > 800;
    return true;
  });

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <FileText className="w-4 h-4 text-[#D6B46A]" />
              <span>Multi-Page Crawl &amp; Sitemap Architecture</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Internal Route Health &amp; XML Sitemaps
            </h3>
            <p className="text-xs text-[#8A8178]">
              Automated crawler verifying discovered internal routes, robots.txt crawl permissions, and XML sitemap indexability.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">Crawled Routes</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {pages.length}
            </span>
            <span className="text-xs font-mono text-[#8A8178]"> Pages</span>
          </div>
        </div>

        {/* XML Sitemap & Robots.txt Diagnostic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sitemap Card */}
          <div className="p-5 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-[#D6B46A]" />
                <span className="font-mono font-bold text-xs text-[#111111]">XML Sitemap Index</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                sitemap?.exists ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {sitemap?.exists ? 'Active & Discovered' : 'Missing (404)'}
              </span>
            </div>

            <p className="text-xs text-[#8A8178]">
              {sitemap?.exists
                ? `Discovered ${sitemap.urlCountEstimate || 0} indexable URLs in ${sitemap.sitemapUrl || 'sitemap.xml'}.`
                : 'No valid XML sitemap found at standard root or referenced in robots.txt.'}
            </p>

            {sitemap?.sitemapUrl && (
              <div className="flex items-center justify-between text-[11px] font-mono bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                <span className="truncate max-w-[260px] text-zinc-700">{sitemap.sitemapUrl}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(sitemap.sitemapUrl!)}
                  className="text-[#85641C] hover:text-[#111111] p-1 cursor-pointer"
                  title="Copy Sitemap URL"
                >
                  {copiedUrl === sitemap.sitemapUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {(sitemap?.sitemapMissingUrls || sitemap?.orphanedInternalLinks) && (sitemap.sitemapMissingUrls?.length || sitemap.orphanedInternalLinks?.length || 0) > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <span className="font-bold block">Sitemap Coverage Gap:</span>
                <span className="text-amber-800 block">
                  {(sitemap.sitemapMissingUrls || sitemap.orphanedInternalLinks)!.length} internally linked page(s) discovered in HTML navigation are absent from your XML sitemap.
                </span>
                <span className="text-[10px] text-amber-700 block">
                  Distinction: These are internally linked pages missing from the sitemap, not true orphan pages (since they have incoming links from the homepage).
                </span>
              </div>
            )}
          </div>

          {/* Robots.txt Card */}
          <div className="p-5 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#D6B46A]" />
                <span className="font-mono font-bold text-xs text-[#111111]">Robots.txt Crawl Directive</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                robots?.exists && robots?.allowsCrawl ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {robots?.exists ? (robots.allowsCrawl ? 'Permits Crawlers' : 'Disallows All (Disallow: /)') : 'Missing'}
              </span>
            </div>

            <p className="text-xs text-[#8A8178]">
              {robots?.exists
                ? `HTTP status ${robots.status}. ${robots.sitemapUrlsFound?.length ? `${robots.sitemapUrlsFound.length} sitemaps declared.` : 'No sitemap declaration inside robots.txt.'}`
                : 'Robots.txt is missing from server root; search crawlers will use default unguided crawling.'}
            </p>

            <div className="text-[11px] font-mono text-[#85641C] space-y-1">
              <span>Status: {robots?.exists ? `HTTP ${robots.status}` : 'Not Found (404)'}</span>
              {robots?.sitemapUrlsFound && robots.sitemapUrlsFound.length > 0 && (
                <span className="block truncate">Referenced Sitemap: {robots.sitemapUrlsFound[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs & Subpages Table */}
        <div className="space-y-4 pt-4 border-t border-[#D6B46A]/15">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#F4EFE6] p-1 rounded-xl border border-[#D6B46A]/25">
              {(['all', 'issues', 'slow'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                    filterMode === mode
                      ? 'bg-[#111111] text-[#D6B46A]'
                      : 'text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  {mode === 'all' ? `All (${pages.length})` : mode === 'issues' ? 'With Issues' : 'Slow (>800ms)'}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-[#8A8178]">
              Showing {filteredPages.length} routes
            </span>
          </div>

          {filteredPages.length > 0 ? (
            <div className="space-y-3">
              {filteredPages.map((page, idx) => {
                const isGood = page.pageScore >= 85;
                const isMid = page.pageScore >= 65 && page.pageScore < 85;

                return (
                  <div
                    key={idx}
                    className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#111111] truncate">
                          {page.path}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          page.status >= 200 && page.status < 400 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          HTTP {page.status}
                        </span>
                        <span className="text-[10px] font-mono text-[#8A8178] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D6B46A]" />
                          {page.responseTimeMs}ms
                        </span>
                      </div>

                      <p className="text-xs text-[#8A8178] truncate">
                        {page.title || '<Missing Title Tag>'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#85641C]">
                        <span>H1: {page.h1Count || 0}</span>
                        <span>·</span>
                        <span>Images: {page.totalImages || 0} ({page.imagesWithoutAltCount || 0} missing alt)</span>
                      </div>

                      {page.issues && page.issues.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {page.issues.map((iss, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {iss.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Score & Action */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <div className="text-right">
                        <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl block ${
                          isGood ? 'bg-emerald-100 text-emerald-800' : isMid ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {page.pageScore}/100
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRequestFix(`Optimize Subpage Route: ${page.path}`)}
                        className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Audit Fix</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#8A8178] bg-[#FFFDF8] border border-dashed border-[#D6B46A]/30 rounded-2xl">
              No pages match the active filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
