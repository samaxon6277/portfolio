/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - Advanced Real-World Website Audit Engine
 * Browser Performance Engine (Mobile & Desktop via Google PageSpeed Insights / Lighthouse API)
 * Strictly Real Evidence - Zero Fabricated Data
 */

import { DevicePerformanceData } from './types';

interface PageSpeedAuditRef {
  id: string;
  title: string;
  description?: string;
  score?: number | null;
  numericValue?: number;
  displayValue?: string;
  details?: any;
}

/**
 * Fetch real browser performance from Google PageSpeed Insights API (Lighthouse & CrUX).
 * Runs server-side only; API key is never exposed to browser.
 */
export async function fetchBrowserPerformance(
  targetUrl: string,
  strategy: 'mobile' | 'desktop'
): Promise<DevicePerformanceData> {
  const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY;
  let endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${strategy}&category=PERFORMANCE`;
  if (apiKey) {
    endpoint += `&key=${apiKey}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 16000);

  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timer);

    if (!res.ok) {
      const errorText = await res.text();
      let errorReason = `PageSpeed API responded with HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error?.message) {
          errorReason = parsed.error.message;
        }
      } catch {}

      return {
        device: strategy,
        available: false,
        source: 'NOT_AVAILABLE',
        statusMessage: errorReason.includes('Quota exceeded') || res.status === 429
          ? 'Google PageSpeed API rate limit reached. To enable unlimited browser testing, configure PAGESPEED_API_KEY in server environment.'
          : errorReason.includes('disabled') || res.status === 403
          ? 'PageSpeed Insights API is unconfigured on server project. Configure PAGESPEED_API_KEY in server environment.'
          : `Browser performance audit unavailable: ${errorReason}`
      };
    }

    const data = await res.json();
    const lh = data.lighthouseResult;
    if (!lh || !lh.audits) {
      return {
        device: strategy,
        available: false,
        source: 'NOT_AVAILABLE',
        statusMessage: 'Lighthouse audit data missing from API response.'
      };
    }

    const audits = lh.audits as Record<string, PageSpeedAuditRef>;
    const perfCategory = lh.categories?.performance;
    const score = perfCategory?.score !== null && perfCategory?.score !== undefined 
      ? Math.round(perfCategory.score * 100) 
      : undefined;

    // --- 1. LAB DATA (Lighthouse) ---
    const fcpAudit = audits['first-contentful-paint'];
    const lcpAudit = audits['largest-contentful-paint'];
    const clsAudit = audits['cumulative-layout-shift'];
    const tbtAudit = audits['total-blocking-time'];
    const siAudit = audits['speed-index'];
    const srtAudit = audits['server-response-time'];
    const ttiAudit = audits['interactive'];

    const getRating = (scoreVal: number | null | undefined): 'good' | 'needs_improvement' | 'poor' => {
      if (scoreVal === null || scoreVal === undefined) return 'needs_improvement';
      if (scoreVal >= 0.9) return 'good';
      if (scoreVal >= 0.5) return 'needs_improvement';
      return 'poor';
    };

    // --- 2. FIELD DATA (Chrome User Experience Report - CrUX) ---
    const loadingExp = data.loadingExperience;
    let cruxFieldData = undefined;
    if (loadingExp && loadingExp.metrics) {
      const metrics = loadingExp.metrics;
      const getCrUX = (key: string) => {
        const item = metrics[key];
        if (!item || item.percentile === undefined) return undefined;
        return {
          value: item.percentile,
          unit: key.includes('CLS') ? '' : 'ms',
          category: item.category || 'AVERAGE'
        };
      };

      cruxFieldData = {
        available: true,
        fcp: getCrUX('FIRST_CONTENTFUL_PAINT_MS'),
        lcp: getCrUX('LARGEST_CONTENTFUL_PAINT_MS'),
        cls: getCrUX('CUMULATIVE_LAYOUT_SHIFT_SCORE'),
        inp: getCrUX('INTERACTION_TO_NEXT_PAINT') || getCrUX('FIRST_INPUT_DELAY_MS'),
        ttfb: getCrUX('EXPERIMENTAL_TIME_TO_FIRST_BYTE')
      };
    }

    // --- 3. MAIN THREAD BREAKDOWN & LONG TASKS ---
    const mainThreadAudit = audits['mainthread-work-breakdown'];
    let mainThreadWorkMs = undefined;
    let mainThreadWorkBreakdown = undefined;
    if (mainThreadAudit && mainThreadAudit.details?.items) {
      mainThreadWorkMs = Math.round(mainThreadAudit.numericValue || 0);
      mainThreadWorkBreakdown = (mainThreadAudit.details.items as any[]).map(item => ({
        category: item.groupLabel || item.group || 'Other',
        durationMs: Math.round(item.duration || 0)
      }));
    }

    const longTasksAudit = audits['long-tasks'];
    let longTasks = undefined;
    if (longTasksAudit && longTasksAudit.details?.items) {
      longTasks = (longTasksAudit.details.items as any[]).map(item => ({
        durationMs: Math.round(item.duration || 0),
        startTimeMs: Math.round(item.startTime || 0),
        url: item.url || undefined
      }));
    }

    // --- 4. NETWORK WATERFALL (from Lighthouse network-requests audit) ---
    const networkAudit = audits['network-requests'];
    let networkWaterfall = undefined;
    if (networkAudit && networkAudit.details?.items) {
      networkWaterfall = (networkAudit.details.items as any[]).slice(0, 40).map(item => ({
        url: item.url || '',
        mimeType: item.mimeType || 'unknown',
        resourceType: item.resourceType || 'other',
        transferSizeBytes: item.transferSize || 0,
        resourceSizeBytes: item.resourceSize || 0,
        startTimeMs: Math.round(item.startTime * 1000 || 0),
        durationMs: Math.round((item.endTime - item.startTime) * 1000 || 0),
        status: item.statusCode || 200,
        isRenderBlocking: !!item.renderBlocking,
        isThirdParty: !!item.isThirdParty,
        priority: item.priority || 'Medium'
      }));
    }

    return {
      device: strategy,
      available: true,
      source: cruxFieldData?.available ? 'FIELD — CrUX' : 'LAB',
      statusMessage: `Lighthouse Lab Engine v${lh.lighthouseVersion || '12'} (${strategy.toUpperCase()})`,
      score,
      fcp: fcpAudit?.numericValue !== undefined ? {
        value: Math.round(fcpAudit.numericValue) / 1000,
        unit: 's',
        rating: getRating(fcpAudit.score),
        source: 'LAB'
      } : undefined,
      lcp: lcpAudit?.numericValue !== undefined ? {
        value: Math.round(lcpAudit.numericValue) / 1000,
        unit: 's',
        rating: getRating(lcpAudit.score),
        source: 'LAB'
      } : undefined,
      cls: clsAudit?.numericValue !== undefined ? {
        value: Math.round(clsAudit.numericValue * 1000) / 1000,
        unit: '',
        rating: getRating(clsAudit.score),
        source: 'LAB'
      } : undefined,
      tbt: tbtAudit?.numericValue !== undefined ? {
        value: Math.round(tbtAudit.numericValue),
        unit: 'ms',
        rating: getRating(tbtAudit.score),
        source: 'LAB'
      } : undefined,
      speedIndex: siAudit?.numericValue !== undefined ? {
        value: Math.round(siAudit.numericValue) / 1000,
        unit: 's',
        rating: getRating(siAudit.score),
        source: 'LAB'
      } : undefined,
      navigationTtfb: srtAudit?.numericValue !== undefined ? {
        value: Math.round(srtAudit.numericValue),
        unit: 'ms',
        rating: getRating(srtAudit.score),
        source: 'LAB'
      } : undefined,
      interactive: ttiAudit?.numericValue !== undefined ? {
        value: Math.round(ttiAudit.numericValue) / 1000,
        unit: 's',
        rating: getRating(ttiAudit.score),
        source: 'LAB'
      } : undefined,
      mainThreadWorkMs,
      mainThreadWorkBreakdown,
      longTasks,
      networkWaterfall,
      cruxFieldData
    };

  } catch (err: any) {
    clearTimeout(timer);
    return {
      device: strategy,
      available: false,
      source: 'NOT_AVAILABLE',
      statusMessage: err?.name === 'AbortError'
        ? 'Google PageSpeed API request timed out after 16s.'
        : `Browser execution error: ${err?.message || 'Network request failed'}`
    };
  }
}
