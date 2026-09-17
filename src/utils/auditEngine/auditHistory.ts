/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - Advanced Real-World Website Audit Engine
 * Audit History Persistence, Before/After Comparison & Export
 */

import { ComprehensiveAuditReport, AuditHistoryEntry, AuditComparisonResult } from './types';

const STORAGE_KEY = 'samaxon_audit_history_v3';

/**
 * Save an audit report to local storage history (and Supabase if client initialized)
 */
export function saveAuditToHistory(report: ComprehensiveAuditReport): AuditHistoryEntry {
  const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const entry: AuditHistoryEntry = {
    id,
    url: report.url,
    hostname: report.hostname,
    analyzedAt: report.analyzedAt || new Date().toISOString(),
    overallScore: report.scores?.overall || 0,
    scores: {
      overall: report.scores?.overall || 0,
      performance: report.scores?.performance || 0,
      security: report.scores?.security || 0,
      seo: report.scores?.seo || 0,
      accessibility: report.scores?.accessibility || 0,
      code: report.scores?.code || 0
    },
    criticalCount: report.findings?.filter(f => f.severity === 'critical').length || 0,
    warningCount: report.findings?.filter(f => f.severity === 'warning').length || 0,
    passedCount: report.findings?.filter(f => f.severity === 'passed').length || 0
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: AuditHistoryEntry[] = raw ? JSON.parse(raw) : [];
    // Prepend and limit to 25 items
    const updated = [entry, ...history.filter(h => h.id !== id)].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also store full report keyed by ID for deep comparison
    localStorage.setItem(`samaxon_report_${id}`, JSON.stringify(report));
  } catch (e) {
    console.warn('Local storage audit write failed:', e);
  }

  return entry;
}

/**
 * Retrieve audit history list
 */
export function getAuditHistory(domainFilter?: string): AuditHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries: AuditHistoryEntry[] = JSON.parse(raw);
    if (domainFilter) {
      return entries.filter(e => e.hostname.toLowerCase() === domainFilter.toLowerCase());
    }
    return entries;
  } catch {
    return [];
  }
}

/**
 * Retrieve a stored full report by ID
 */
export function getStoredAuditReport(id: string): ComprehensiveAuditReport | null {
  try {
    const raw = localStorage.getItem(`samaxon_report_${id}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Compare two audits (Previous vs Current)
 */
export function compareAuditReports(
  prev: ComprehensiveAuditReport,
  curr: ComprehensiveAuditReport
): AuditComparisonResult {
  const prevDate = new Date(prev.analyzedAt || Date.now()).toLocaleDateString();
  const currDate = new Date(curr.analyzedAt || Date.now()).toLocaleDateString();

  const prevCrit = prev.findings?.filter(f => f.severity === 'critical').length || 0;
  const currCrit = curr.findings?.filter(f => f.severity === 'critical').length || 0;

  const prevWarn = prev.findings?.filter(f => f.severity === 'warning').length || 0;
  const currWarn = curr.findings?.filter(f => f.severity === 'warning').length || 0;

  const prevTtfb = prev.performanceData?.ttfbMs ?? prev.responseTimeMs ?? 0;
  const currTtfb = curr.performanceData?.ttfbMs ?? curr.responseTimeMs ?? 0;

  const prevHtml = prev.performanceData?.htmlSizeKb ?? prev.meta?.htmlSizeKb ?? 0;
  const currHtml = curr.performanceData?.htmlSizeKb ?? curr.meta?.htmlSizeKb ?? 0;

  return {
    previousId: prev.analyzedAt || 'prev',
    currentId: curr.analyzedAt || 'curr',
    url: curr.url,
    previousDate: prevDate,
    currentDate: currDate,
    overallScoreDiff: (curr.scores?.overall || 0) - (prev.scores?.overall || 0),
    performanceScoreDiff: (curr.scores?.performance || 0) - (prev.scores?.performance || 0),
    securityScoreDiff: (curr.scores?.security || 0) - (prev.scores?.security || 0),
    seoScoreDiff: (curr.scores?.seo || 0) - (prev.scores?.seo || 0),
    accessibilityScoreDiff: (curr.scores?.accessibility || 0) - (prev.scores?.accessibility || 0),
    ttfbDiffMs: currTtfb - prevTtfb,
    htmlSizeDiffKb: Math.round((currHtml - prevHtml) * 10) / 10,
    criticalIssuesDiff: currCrit - prevCrit,
    warningIssuesDiff: currWarn - prevWarn
  };
}

/**
 * Export audit report as formatted JSON file download
 */
export function exportAuditAsJson(report: ComprehensiveAuditReport) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const sanitizedHost = report.hostname.replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('download', `samaxon_audit_${sanitizedHost}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
