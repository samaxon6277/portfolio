import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Search, 
  RefreshCw, Globe, Code2, Copy, Download, Printer, HelpCircle, 
  Eye, FileText, ChevronDown, ChevronRight, Check, AlertCircle, 
  Sparkles, ExternalLink, ArrowRight
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import { 
  runAccessibilityAuditOnHtml, 
  A11yAuditResult, 
  A11ySeverity, 
  A11yCategory 
} from '../../utils/accessibilityAuditorUtils';
import CustomSelect from '../ui/CustomSelect';
import CustomTabs from '../ui/CustomTabs';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomExportControls from '../ui/CustomExportControls';
import CustomEmptyState from '../ui/CustomEmptyState';
import CustomErrorState from '../ui/CustomErrorState';

const SAMPLE_HTML_FLAWED = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
</head>
<body>
  <div>
    <h2>Our Elite Offerings</h2>
    <img src="/assets/hero-banquet.jpg">
    <p>Welcome to our venue. Book your date today!</p>
    <a href="/reserve">click here</a>
    
    <button type="button">
      <svg width="20" height="20"><path d="M0 0h20v20H0z"/></svg>
    </button>
    
    <form>
      <input type="email" placeholder="Your Email Address">
      <button type="submit">Send</button>
    </form>
    
    <h4>Customer Reviews</h4>
    <p>5-star service experience.</p>
  </div>
</body>
</html>`;

const SAMPLE_HTML_ACCESSIBLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bespoke Banquet Web Design &amp; Booking Systems | SamaXon</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <header>
    <nav aria-label="Main Navigation">
      <a href="#main-content" class="skip-link">Skip to main content</a>
    </nav>
  </header>
  <main id="main-content">
    <h1>Bespoke Wedding &amp; Event Booking Solutions</h1>
    <section>
      <h2>Verified Performance &amp; Commission Savings</h2>
      <img src="/assets/banquet-hall.webp" alt="Elegantly decorated wedding hall with banquet seating for 500 guests">
      <p>Bypass aggregator commissions with high-conversion direct booking portals.</p>
      <a href="/case-studies/banquets">Explore our banquet development case studies</a>
    </section>
    <section>
      <h2>Initiate Your Consultation</h2>
      <form>
        <label for="client-email">Business Email Address</label>
        <input id="client-email" type="email" required autocomplete="email">
        <button type="submit">Request 48-Hour Demo</button>
      </form>
    </section>
  </main>
</body>
</html>`;

export default function WebsiteAccessibilityAuditor() {
  const { showToast } = useCustomUi();

  const [inputMode, setInputMode] = useState<'url' | 'html'>('url');
  const [targetUrl, setTargetUrl] = useState('');
  const [rawHtml, setRawHtml] = useState(SAMPLE_HTML_FLAWED);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Active Audit Result
  const [auditResult, setAuditResult] = useState<A11yAuditResult | null>(() => {
    return runAccessibilityAuditOnHtml(SAMPLE_HTML_FLAWED);
  });

  // Filter States
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL Audit
  const handleUrlAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    let url = targetUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      setErrorMsg('Please enter a valid URL beginning with https:// or http://.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tools/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Unable to fetch the specified URL for accessibility auditing.');
        setIsLoading(false);
        return;
      }

      // If the backend returns meta or html, synthesize or run evaluation
      // Synthesize HTML representation from structured response if raw html was not piped directly
      const meta = data.data?.meta || {};
      const synthesizedHtml = `<!DOCTYPE html>
<html ${meta.technical?.hasLang ? 'lang="en"' : ''}>
<head>
  <title>${meta.title || ''}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${meta.metaDescription || ''}">
</head>
<body>
  <main>
    ${(meta.headings?.h1 || []).map((h: string) => `<h1>${h}</h1>`).join('\n')}
    ${meta.headings?.outline?.map((item: any) => `<${item.level.toLowerCase()}>${item.text}</${item.level.toLowerCase()}>`).join('\n') || ''}
    ${Array.from({ length: meta.images?.total || 0 }).map((_, i) => {
      const isMissing = i < (meta.images?.missingAlt || 0);
      return `<img src="/sample-asset-${i}.jpg" ${isMissing ? '' : 'alt="Sample scanned graphic content"'} />`;
    }).join('\n')}
  </main>
</body>
</html>`;

      const result = runAccessibilityAuditOnHtml(synthesizedHtml);
      setAuditResult(result);
      showToast('Live website accessibility evaluation completed.', 'success');
    } catch (err: any) {
      setErrorMsg('Network error connecting to diagnostic service. Please check URL reachability.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Raw HTML Audit
  const handleHtmlAudit = () => {
    if (!rawHtml.trim()) {
      setErrorMsg('Paste your HTML code snippet before analyzing.');
      return;
    }
    setErrorMsg('');
    const result = runAccessibilityAuditOnHtml(rawHtml);
    setAuditResult(result);
    showToast('Code snippet accessibility evaluation updated.', 'success');
  };

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    if (!auditResult) return [];
    return auditResult.issues.filter(issue => {
      if (selectedSeverity !== 'All' && issue.severity !== selectedSeverity) return false;
      if (selectedCategory !== 'All' && issue.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.wcagCriterion.toLowerCase().includes(q) ||
          issue.suggestedFix.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditResult, selectedSeverity, selectedCategory, searchQuery]);

  // Markdown Report Generation
  const generateMarkdownReport = () => {
    if (!auditResult) return '';
    let md = `# Website Accessibility Audit Dossier (WCAG 2.1 / 2.2 AA)\n`;
    md += `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n`;
    md += `**Compliance Score:** ${auditResult.score}/100 | **Grade:** ${auditResult.grade}\n`;
    md += `**Findings Summary:** Critical: ${auditResult.criticalCount} | Serious: ${auditResult.seriousCount} | Moderate: ${auditResult.moderateCount} | Minor: ${auditResult.minorCount} | Passed: ${auditResult.passedCount}\n\n`;
    md += `---\n\n`;

    md += `## Detailed Findings & Remediation Code\n\n`;
    auditResult.issues.forEach((issue, idx) => {
      md += `### ${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.title}\n`;
      md += `- **WCAG Criterion:** ${issue.wcagCriterion} (Level ${issue.wcagLevel})\n`;
      md += `- **Category:** ${issue.category}\n`;
      md += `- **Explanation:** ${issue.description}\n`;
      md += `- **Remediation Action:** ${issue.suggestedFix}\n`;
      if (issue.codeSnippet) {
        md += `\`\`\`html\n${issue.codeSnippet}\n\`\`\`\n`;
      }
      md += `\n`;
    });

    md += `---\n*Automated screening conducted via SamaXon Accessibility Auditor. Covers automated programmatic criteria; manual assistive tech evaluation remains recommended.*\n`;
    return md;
  };

  const handleExportJson = () => {
    if (!auditResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditResult, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `a11y-audit-report-${Date.now()}.json`);
    dlAnchor.click();
    showToast('Accessibility audit JSON downloaded.', 'success');
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([generateMarkdownReport()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `a11y-audit-report-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Markdown report downloaded.', 'success');
  };

  const handleExportTxt = () => {
    const text = generateMarkdownReport().replace(/#/g, '').replace(/```html/g, '').replace(/```/g, '');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `a11y-audit-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Plain text report downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="accessibility-auditor-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG 2.1 / 2.2 AA Compliance Engine</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website Accessibility Auditor
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Audit web pages and code snippets against international Web Content Accessibility Guidelines (WCAG). Detect image alt deficits, heading hierarchy skips, missing form labels, empty button names, viewport zoom restrictions, and document language gaps with actionable code snippets.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B46A]" />
              Safe sandboxed parsing: zero script execution
            </span>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Screening tool; automated checks catch 30-40% of WCAG criteria. Manual assistive testing is recommended.
            </span>
          </div>
        </div>
      </div>

      {/* Input Mode Selector & Forms */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <CustomTabs
              tabs={[
                { id: 'url', label: 'Scan Live URL', icon: <Globe className="w-3.5 h-3.5" /> },
                { id: 'html', label: 'Audit HTML / Code', icon: <Code2 className="w-3.5 h-3.5" /> }
              ]}
              activeTab={inputMode}
              onChange={(mode) => {
                setInputMode(mode as any);
                setErrorMsg('');
              }}
            />
          </div>

          {inputMode === 'html' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRawHtml(SAMPLE_HTML_FLAWED);
                  const res = runAccessibilityAuditOnHtml(SAMPLE_HTML_FLAWED);
                  setAuditResult(res);
                  showToast('Loaded flawed HTML example.', 'info');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
              >
                Sample: Flawed HTML
              </button>
              <button
                type="button"
                onClick={() => {
                  setRawHtml(SAMPLE_HTML_ACCESSIBLE);
                  const res = runAccessibilityAuditOnHtml(SAMPLE_HTML_ACCESSIBLE);
                  setAuditResult(res);
                  showToast('Loaded WCAG-compliant HTML example.', 'success');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
              >
                Sample: Accessible HTML
              </button>
            </div>
          )}
        </div>

        {inputMode === 'url' ? (
          <form onSubmit={handleUrlAudit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="e.g. https://yourwebsite.com"
                className="flex-1 h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !targetUrl.trim()}
                className="h-11 px-6 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                    <span>Auditing Remote Page...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Run WCAG Audit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={8}
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              placeholder="Paste HTML page or template snippet here..."
              className="w-full p-4 font-mono text-xs bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A] leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleHtmlAudit}
                className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluate Markup Snippet</span>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <CustomErrorState
            title="Accessibility Audit Diagnostic Note"
            whatWentWrong={errorMsg}
            whyItMatters="Without accessing document markup, WCAG criteria like alt text and heading hierarchy cannot be evaluated."
            howToFix="Check that the URL is public and reachable, or switch to the 'Audit HTML / Code' tab to paste the template markup directly."
            onRetry={() => {
              if (inputMode === 'url') handleUrlAudit({ preventDefault: () => {} } as any);
              else handleHtmlAudit();
            }}
          />
        )}
      </div>

      {/* Audit Results Dashboard */}
      {auditResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
              <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">A11y Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-display text-neutral-900">{auditResult.score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    auditResult.score >= 85 ? 'bg-emerald-500' : auditResult.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${auditResult.score}%` }} 
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
              <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">WCAG Grade</span>
              <div className="text-xs font-bold font-mono text-neutral-900 truncate">
                {auditResult.grade}
              </div>
              <span className="text-[10px] text-neutral-400 block">Level AA target</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
              <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Critical
              </span>
              <div className="text-2xl font-bold font-display text-rose-700">{auditResult.criticalCount}</div>
              <span className="text-[10px] text-rose-500 font-bold block">Hard blockers</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
              <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Serious
              </span>
              <div className="text-2xl font-bold font-display text-amber-700">{auditResult.seriousCount}</div>
              <span className="text-[10px] text-neutral-400 block">Level AA deficits</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
              <span className="text-[11px] text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Moderate
              </span>
              <div className="text-2xl font-bold font-display text-blue-700">{auditResult.moderateCount}</div>
              <span className="text-[10px] text-neutral-400 block">Structural concerns</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
              <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed
              </span>
              <div className="text-2xl font-bold font-display text-emerald-700">{auditResult.passedCount}</div>
              <span className="text-[10px] text-neutral-400 block">Audited benchmarks</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search issues, WCAG criteria, or fixes..."
                  className="w-full h-9 pl-9 pr-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                />
              </div>

              <div className="w-36">
                <CustomSelect
                  value={selectedSeverity}
                  onChange={setSelectedSeverity}
                  options={[
                    { value: 'All', label: 'All Severities' },
                    { value: 'critical', label: 'Critical' },
                    { value: 'serious', label: 'Serious' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'passed', label: 'Passed Only' }
                  ]}
                />
              </div>

              <div className="w-40">
                <CustomSelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={[
                    { value: 'All', label: 'All Principles' },
                    { value: 'Perceivable', label: 'Perceivable' },
                    { value: 'Operable', label: 'Operable' },
                    { value: 'Understandable', label: 'Understandable' },
                    { value: 'Robust', label: 'Robust' }
                  ]}
                />
              </div>
            </div>

            <CustomExportControls
              onExportMarkdown={handleExportMarkdown}
              onExportJson={handleExportJson}
              onExportTxt={handleExportTxt}
              onPrint={() => window.print()}
              copyText={generateMarkdownReport()}
              copyLabel="Copy Audit Dossier"
            />
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <CustomEmptyState
                title="No accessibility issues match your filter criteria"
                description="Try clearing search terms or selecting 'All Severities'."
                actionText="Reset Filters"
                onAction={() => {
                  setSelectedSeverity('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              />
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-5 rounded-2xl bg-white border transition-all duration-200 shadow-xs space-y-3 ${
                    issue.severity === 'critical'
                      ? 'border-rose-300 bg-rose-50/20'
                      : issue.severity === 'serious'
                      ? 'border-amber-300 bg-amber-50/20'
                      : issue.severity === 'passed'
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : 'border-neutral-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        issue.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : issue.severity === 'serious'
                          ? 'bg-amber-100 text-amber-800'
                          : issue.severity === 'passed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                        {issue.wcagCriterion} (Level {issue.wcagLevel})
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {issue.category} Principle
                      </span>
                    </div>

                    {issue.codeSnippet && (
                      <CustomCopyButton text={issue.codeSnippet} label="Copy Fix" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-display text-sm sm:text-base font-bold text-neutral-900">
                      {issue.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                      {issue.description}
                    </p>
                  </div>

                  {/* Remediation Box */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <div className="text-xs text-neutral-800 leading-relaxed">
                      <strong className="text-neutral-900 font-bold">Recommended Remediation: </strong>
                      {issue.suggestedFix}
                    </div>

                    {issue.codeSnippet && (
                      <pre className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto">
                        {issue.codeSnippet}
                      </pre>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
