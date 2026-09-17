/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - Advanced Real-World Website Audit Engine
 * Sitemap Analyzer & Multi-Page Crawler Engine
 * Strictly Real Evidence - Zero Fabricated Data
 */

import { ScannedSubpageHealth } from './types';
import { isPrivateOrLocalHost } from './urlValidator';

export interface SitemapAuditResult {
  checked: boolean;
  exists: boolean;
  sitemapUrl?: string;
  totalUrls: number;
  sampleUrls: string[];
  mismatchedUrls: string[];
  unreachableUrls: string[];
  /** Internally linked pages discovered on site that are missing from sitemap.xml (NOT true orphans) */
  sitemapMissingUrls: string[];
  /** Legacy alias for backward compatibility */
  orphanedInternalLinks: string[];
  format: 'xml' | 'gzip' | 'sitemap_index' | 'none';
  isSitemapIndex?: boolean;
  childSitemapsFound?: string[];
  statusMessage: string;
}

export interface CrawlEngineOptions {
  maxPages?: number;
  timeoutPerSubpageMs?: number;
  respectRobots?: boolean;
}

/**
 * Fetch and parse robots.txt and discover declared XML sitemaps
 */
export async function analyzeRobotsAndSitemaps(
  targetOrigin: string,
  discoveredInternalLinks: string[]
): Promise<{
  robotsStatus: {
    checked: boolean;
    exists: boolean;
    status: number;
    allowsCrawl: boolean;
    sitemapUrlsFound: string[];
    userAgentGroups?: Array<{ userAgent: string; allowsCrawl: boolean; disallowRules: string[]; allowRules: string[] }>;
    rulesSummary: string;
  };
  sitemapResult: SitemapAuditResult;
}> {
  const robotsUrl = `${targetOrigin}/robots.txt`;
  let robotsText = '';
  let robotsStatus = 0;
  const sitemapUrlsFound: string[] = [];
  const userAgentGroups: Array<{ userAgent: string; allowsCrawl: boolean; disallowRules: string[]; allowRules: string[] }> = [];

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);

  try {
    const res = await fetch(robotsUrl, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    clearTimeout(timer);
    robotsStatus = res.status;
    if (res.ok) {
      robotsText = await res.text();
      const lines = robotsText.split('\n');
      let currentUa = '*';
      let currentDisallow: string[] = [];
      let currentAllow: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (/^sitemap:\s*/i.test(trimmed)) {
          const sUrl = trimmed.replace(/^sitemap:\s*/i, '').trim();
          if (sUrl && /^https?:\/\//i.test(sUrl) && !sitemapUrlsFound.includes(sUrl)) {
            sitemapUrlsFound.push(sUrl);
          }
        } else if (/^user-agent:\s*/i.test(trimmed)) {
          if (currentDisallow.length > 0 || currentAllow.length > 0) {
            userAgentGroups.push({
              userAgent: currentUa,
              allowsCrawl: !currentDisallow.includes('/'),
              disallowRules: [...currentDisallow],
              allowRules: [...currentAllow]
            });
            currentDisallow = [];
            currentAllow = [];
          }
          currentUa = trimmed.replace(/^user-agent:\s*/i, '').trim().toLowerCase();
        } else if (/^disallow:\s*/i.test(trimmed)) {
          const rule = trimmed.replace(/^disallow:\s*/i, '').trim();
          if (rule) currentDisallow.push(rule);
        } else if (/^allow:\s*/i.test(trimmed)) {
          const rule = trimmed.replace(/^allow:\s*/i, '').trim();
          if (rule) currentAllow.push(rule);
        }
      }

      if (currentDisallow.length > 0 || currentAllow.length > 0 || userAgentGroups.length === 0) {
        userAgentGroups.push({
          userAgent: currentUa,
          allowsCrawl: !currentDisallow.includes('/'),
          disallowRules: currentDisallow,
          allowRules: currentAllow
        });
      }
    }
  } catch {
    clearTimeout(timer);
  }

  // Determine crawl allowance for default * or googlebot
  const generalGroup = userAgentGroups.find(g => g.userAgent === '*' || g.userAgent.includes('googlebot')) || userAgentGroups[0];
  const allowsCrawl = generalGroup ? generalGroup.allowsCrawl : !/Disallow:\s*\/\s*$/m.test(robotsText);

  // If no sitemaps declared in robots.txt, test standard default /sitemap.xml
  const primarySitemapCandidate = sitemapUrlsFound[0] || `${targetOrigin}/sitemap.xml`;

  let sitemapResult: SitemapAuditResult = {
    checked: true,
    exists: false,
    sitemapUrl: primarySitemapCandidate,
    totalUrls: 0,
    sampleUrls: [],
    mismatchedUrls: [],
    unreachableUrls: [],
    sitemapMissingUrls: [],
    orphanedInternalLinks: [],
    format: 'none',
    statusMessage: 'No accessible sitemap.xml detected.'
  };

  const sCtrl = new AbortController();
  const sTimer = setTimeout(() => sCtrl.abort(), 6000);

  try {
    const sRes = await fetch(primarySitemapCandidate, {
      signal: sCtrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'application/xml,text/xml,*/*;q=0.9'
      }
    });
    clearTimeout(sTimer);

    if (sRes.ok) {
      const xml = await sRes.text();
      const isIndex = /<sitemapindex\b/i.test(xml);

      if (isIndex) {
        // Multi-level sitemap index
        const childSitemapMatches = Array.from(xml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/gi)).map(m => m[1].trim());
        const uniqueChildSitemaps = Array.from(new Set(childSitemapMatches)).filter(u => /^https?:\/\//i.test(u));

        let aggregatedUrls: string[] = [];

        // Safely probe first 2 child sitemaps
        for (const childUrl of uniqueChildSitemaps.slice(0, 2)) {
          try {
            const childCheck = new URL(childUrl);
            if (isPrivateOrLocalHost(childCheck.hostname)) continue;
            const childRes = await fetch(childUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
              signal: AbortSignal.timeout(4000)
            });
            if (childRes.ok) {
              const childXml = await childRes.text();
              const childLocs = Array.from(childXml.matchAll(/<loc>([^<]+)<\/loc>/gi)).map(m => m[1].trim());
              aggregatedUrls.push(...childLocs);
            }
          } catch {}
        }

        const uniqueAggregated = Array.from(new Set(aggregatedUrls)).filter(u => /^https?:\/\//i.test(u));
        const sitemapPathSet = new Set<string>();
        uniqueAggregated.forEach(u => {
          try { sitemapPathSet.add(new URL(u).pathname); } catch {}
        });

        const missing = discoveredInternalLinks.filter(p => !sitemapPathSet.has(p) && p !== '/');

        sitemapResult = {
          checked: true,
          exists: true,
          sitemapUrl: primarySitemapCandidate,
          totalUrls: uniqueAggregated.length || uniqueChildSitemaps.length,
          sampleUrls: (uniqueAggregated.length > 0 ? uniqueAggregated : uniqueChildSitemaps).slice(0, 15),
          mismatchedUrls: [],
          unreachableUrls: [],
          sitemapMissingUrls: missing.slice(0, 10),
          orphanedInternalLinks: missing.slice(0, 10),
          format: 'sitemap_index',
          isSitemapIndex: true,
          childSitemapsFound: uniqueChildSitemaps,
          statusMessage: `Valid XML Sitemap Index parsed with ${uniqueChildSitemaps.length} sub-sitemaps (${uniqueAggregated.length} indexable URLs sampled).`
        };
      } else {
        // Standard single XML sitemap
        const locMatches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gi)).map(m => m[1].trim());
        const uniqueUrls = Array.from(new Set(locMatches)).filter(u => /^https?:\/\//i.test(u));

        if (uniqueUrls.length > 0) {
          const sitemapPathSet = new Set<string>();
          uniqueUrls.forEach(u => {
            try {
              sitemapPathSet.add(new URL(u).pathname);
            } catch {}
          });

          const missing = discoveredInternalLinks.filter(p => !sitemapPathSet.has(p) && p !== '/');

          sitemapResult = {
            checked: true,
            exists: true,
            sitemapUrl: primarySitemapCandidate,
            totalUrls: uniqueUrls.length,
            sampleUrls: uniqueUrls.slice(0, 15),
            mismatchedUrls: [],
            unreachableUrls: [],
            sitemapMissingUrls: missing.slice(0, 10),
            orphanedInternalLinks: missing.slice(0, 10),
            format: 'xml',
            isSitemapIndex: false,
            statusMessage: `Valid XML Sitemap parsed with ${uniqueUrls.length} indexable URLs.`
          };
        } else {
          sitemapResult.statusMessage = 'Sitemap URL responded with 200 OK but contained 0 valid <loc> records.';
        }
      }
    } else {
      sitemapResult.statusMessage = `Sitemap endpoint responded with HTTP ${sRes.status}.`;
    }
  } catch (e: any) {
    clearTimeout(sTimer);
    sitemapResult.statusMessage = `Failed fetching sitemap: ${e?.message || 'Connection timeout'}`;
  }

  return {
    robotsStatus: {
      checked: true,
      exists: robotsStatus >= 200 && robotsStatus < 400,
      status: robotsStatus,
      allowsCrawl,
      sitemapUrlsFound,
      userAgentGroups,
      rulesSummary: robotsStatus === 200 
        ? (allowsCrawl ? `Public access allowed (${userAgentGroups.length} agent group${userAgentGroups.length === 1 ? '' : 's'} parsed)` : 'Restricts root path indexing') 
        : 'No robots.txt found'
    },
    sitemapResult
  };
}

/**
 * Deep Crawl internal links with real parallel HTTP execution and SSRF validation
 */
export async function crawlDiscoveredInternalPages(
  finalOrigin: string,
  discoveredPaths: string[],
  maxPages: number = 6
): Promise<ScannedSubpageHealth[]> {
  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 (SamaXon-SiteAudit-Engine/2.5; +https://samaxon.site)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Cache-Control': 'no-cache'
  };

  const pathsToCrawl = discoveredPaths.slice(0, maxPages);
  const results: ScannedSubpageHealth[] = [];

  await Promise.all(
    pathsToCrawl.map(async (pathStr) => {
      let subUrl = '';
      try {
        const resolved = new URL(pathStr, finalOrigin);
        if (isPrivateOrLocalHost(resolved.hostname)) return;
        subUrl = resolved.toString();
      } catch {
        return;
      }

      const sStart = Date.now();
      const sCtrl = new AbortController();
      const sTimer = setTimeout(() => sCtrl.abort(), 5000);

      try {
        const sRes = await fetch(subUrl, {
          method: 'GET',
          headers: browserHeaders,
          redirect: 'follow',
          signal: sCtrl.signal
        });
        clearTimeout(sTimer);
        const subDuration = Date.now() - sStart;
        const subHtml = await sRes.text();

        const subTitleMatch = subHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const subTitle = subTitleMatch ? subTitleMatch[1].trim().replace(/\s+/g, ' ') : '';
        const subDescMatch = subHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
        const subH1Matches = subHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
        const subImgs = subHtml.match(/<img[^>]+>/gi) || [];
        let subMissingAlt = 0;
        for (const imgTag of subImgs) {
          const aMatch = imgTag.match(/\balt=(["'])(.*?)\1/i);
          if (!aMatch || !aMatch[2].trim()) subMissingAlt++;
        }

        const subIssues: Array<{ severity: 'critical' | 'warning' | 'passed'; title: string; description: string }> = [];
        let subScore = 100;

        if (sRes.status >= 400) {
          subIssues.push({ severity: 'critical', title: `HTTP ${sRes.status} Error`, description: 'Page responded with an HTTP client/server error code.' });
          subScore -= 45;
        }
        if (subDuration > 1500) {
          subIssues.push({ severity: 'warning', title: `Slow Server Response (${subDuration}ms)`, description: 'Subpage response exceeded 1.5 seconds.' });
          subScore -= 15;
        }
        if (!subTitle) {
          subIssues.push({ severity: 'warning', title: 'Missing Title Tag', description: 'Page lacks an HTML document title.' });
          subScore -= 15;
        }
        if (subH1Matches.length === 0) {
          subIssues.push({ severity: 'warning', title: 'Missing <h1> Tag', description: 'No primary topical heading found.' });
          subScore -= 10;
        } else if (subH1Matches.length > 1) {
          subIssues.push({ severity: 'warning', title: 'Multiple <h1> Tags', description: `Found ${subH1Matches.length} H1 tags on page.` });
          subScore -= 5;
        }
        if (subMissingAlt > 0) {
          subIssues.push({ severity: 'warning', title: `${subMissingAlt} Images Missing Alt`, description: 'Images on this subpage lack alt tags.' });
          subScore -= Math.min(15, subMissingAlt * 3);
        }

        subScore = Math.max(20, Math.min(100, subScore));
        const subGrade = subIssues.some(i => i.severity === 'critical') ? 'Critical' : subScore < 80 ? 'Warning' : 'Excellent';

        results.push({
          path: pathStr,
          url: subUrl,
          status: sRes.status,
          ok: sRes.status >= 200 && sRes.status < 400,
          responseTimeMs: subDuration,
          title: subTitle || `${pathStr} page`,
          hasTitle: !!subTitle,
          hasMetaDescription: !!subDescMatch,
          h1Count: subH1Matches.length,
          h1Text: subH1Matches[0] ? subH1Matches[0].replace(/<[^>]+>/g, '').trim() : 'None',
          totalImages: subImgs.length,
          imagesWithoutAltCount: subMissingAlt,
          pageScore: subScore,
          pageGrade: subGrade,
          issues: subIssues
        });
      } catch {
        clearTimeout(sTimer);
        results.push({
          path: pathStr,
          url: subUrl,
          status: 0,
          ok: false,
          responseTimeMs: Date.now() - sStart,
          title: `${pathStr} (Unreachable)`,
          hasTitle: false,
          hasMetaDescription: false,
          h1Count: 0,
          h1Text: 'None',
          totalImages: 0,
          imagesWithoutAltCount: 0,
          pageScore: 20,
          pageGrade: 'Critical',
          issues: [{ severity: 'critical', title: 'Connection Timeout', description: 'Subpage request failed to connect or timed out.' }]
        });
      }
    })
  );

  return results;
}
