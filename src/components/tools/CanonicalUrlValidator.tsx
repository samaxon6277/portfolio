import React, { useState, useMemo } from 'react';
import { 
  SearchCode, CheckCircle2, AlertTriangle, XCircle, Info, Copy, 
  RotateCcw, Globe, Code, ArrowRight, ExternalLink, ShieldCheck, 
  Sparkles, FileText, Check, Settings2, Sliders, RefreshCw, HelpCircle
} from 'lucide-react';
import { 
  validateUrlSyntax, 
  normalizeCanonicalUrl, 
  inspectHtmlSource, 
  generateDiagnosticText, 
  FullCanonicalAnalysisReport, 
  NormalizationOptions, 
  ValidationCheckItem,
  CheckSeverity
} from '../../utils/canonicalValidator';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomInput from '../ui/CustomInput';
import CustomSwitch from '../ui/CustomSwitch';
import CustomTextarea from '../ui/CustomTextarea';
import CustomSelect from '../CustomSelect';
import FormField from '../ui/FormField';

export default function CanonicalUrlValidator() {
  const { showToast, showConfirm } = useCustomUi();

  // Mode Selection: 'url' | 'html' | 'both'
  const [activeMode, setActiveMode] = useState<'url' | 'html'>('url');

  // URL Input State
  const [targetUrl, setTargetUrl] = useState('');
  const [expectedCanonical, setExpectedCanonical] = useState('');

  // Configurable Normalization Rules
  const [options, setOptions] = useState<NormalizationOptions>({
    forceHttps: true,
    preferredDomainFormat: 'non-www',
    trailingSlashRule: 'preserve',
    stripTrackingParameters: true,
    stripFragments: true,
    stripSessionParameters: true,
    normalizeRepeatedSlashes: true,
    lowercaseHostname: true
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // HTML Source Input State
  const [htmlSource, setHtmlSource] = useState('');

  // Remote HTTP Check State
  const [isCheckingRemote, setIsCheckingRemote] = useState(false);
  const [remoteResult, setRemoteResult] = useState<any>(null);

  // Filter for checks display: 'all' | 'error' | 'warning' | 'pass'
  const [checkFilter, setCheckFilter] = useState<'all' | 'error' | 'warning' | 'pass'>('all');

  // Copied states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Perform Analysis
  const analysisReport = useMemo<FullCanonicalAnalysisReport | null>(() => {
    if (!targetUrl.trim() && !htmlSource.trim()) return null;

    const urlToAnalyze = targetUrl.trim() || 'https://example.com';
    const syntaxAnalysis = validateUrlSyntax(urlToAnalyze, expectedCanonical, options);
    const normalization = normalizeCanonicalUrl(urlToAnalyze, options);

    let htmlAnalysis = undefined;
    let htmlChecks: ValidationCheckItem[] = [];

    if (htmlSource.trim()) {
      const parsedHtml = inspectHtmlSource(htmlSource, targetUrl.trim());
      htmlAnalysis = parsedHtml.result;
      htmlChecks = parsedHtml.checks;
    }

    const allChecks = [...syntaxAnalysis.checks, ...htmlChecks];

    const hasError = allChecks.some(c => c.severity === 'error');
    const hasWarning = allChecks.some(c => c.severity === 'warning');

    let overallStatus: 'valid' | 'warning' | 'invalid' | 'incomplete' = 'valid';
    let statusSummary = 'All canonical syntax checks passed without critical defects.';

    if (hasError) {
      overallStatus = 'invalid';
      statusSummary = 'Critical canonical configuration errors detected that require remediation.';
    } else if (hasWarning) {
      overallStatus = 'warning';
      statusSummary = 'Canonical URL is functional but contains potential SEO inconsistencies.';
    }

    const urlObj = syntaxAnalysis.parsedUrl || new URL('https://example.com');

    return {
      targetUrl: urlToAnalyze,
      expectedCanonicalUrl: expectedCanonical.trim() || undefined,
      isValidUrl: syntaxAnalysis.isValid,
      overallStatus,
      statusSummary,
      urlSyntax: {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || 'default',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash
      },
      checks: allChecks,
      normalization,
      htmlInspection: htmlAnalysis,
      httpInspection: remoteResult,
      analyzedAt: new Date().toLocaleString()
    };
  }, [targetUrl, expectedCanonical, options, htmlSource, remoteResult]);

  // Execute Remote Server Check
  const handleRemoteCheck = async () => {
    if (!targetUrl.trim()) {
      showToast('Please enter a target URL before triggering remote inspection.', 'warning');
      return;
    }

    setIsCheckingRemote(true);
    setRemoteResult(null);

    try {
      const res = await fetch('/api/tools/canonical-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Remote HTTP inspection could not be completed.', 'warning');
        setRemoteResult({
          attempted: true,
          success: false,
          errorMessage: data.error || 'Remote check failed.'
        });
      } else {
        setRemoteResult({
          attempted: true,
          success: true,
          statusCode: data.statusCode,
          finalUrl: data.finalUrl,
          redirectChain: data.redirectChain,
          contentType: data.contentType,
          canonicalHeader: data.canonicalHeader,
          canonicalInHtml: data.canonicalInHtml,
          robotsHeader: data.robotsHeader,
          responseTimeMs: data.responseTimeMs
        });
        showToast('Remote server inspection completed successfully!', 'success');
      }
    } catch (err: any) {
      setRemoteResult({
        attempted: true,
        success: false,
        errorMessage: 'Network error contacting verification endpoint.'
      });
      showToast('Verification endpoint unreachable.', 'error');
    } finally {
      setIsCheckingRemote(false);
    }
  };

  const handleReset = () => {
    showConfirm({
      title: 'Reset Analysis',
      message: 'Are you sure you want to clear all inputs, configurations, and inspection reports?',
      confirmText: 'Reset All',
      cancelText: 'Cancel',
      onConfirm: () => {
        setTargetUrl('');
        setExpectedCanonical('');
        setHtmlSource('');
        setRemoteResult(null);
        showToast('Canonical validator reset to initial state.', 'info');
      }
    });
  };

  const loadSample = () => {
    setTargetUrl('https://WWW.Example.com//blog//seo-guide/?utm_source=twitter&utm_medium=social&fbclid=12345#overview');
    setExpectedCanonical('https://example.com/blog/seo-guide');
    setHtmlSource(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Complete SEO Guide | Example</title>
  <link rel="canonical" href="https://example.com/blog/seo-guide" />
</head>
<body>
  <h1>Search Engine Optimization Masterclass</h1>
</body>
</html>`);
    showToast('Loaded sample URL and HTML source for testing.', 'info');
  };

  const filteredChecks = useMemo(() => {
    if (!analysisReport) return [];
    if (checkFilter === 'all') return analysisReport.checks;
    return analysisReport.checks.filter(c => c.severity === checkFilter);
  }, [analysisReport, checkFilter]);

  return (
    <div className="space-y-10 text-left" id="canonical-validator-root">
      {/* Header Banner */}
      <div className="bg-[#111111] text-[#FFFDF8] rounded-[28px] p-6 sm:p-10 border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/30 text-[#D6B46A] text-[11px] font-mono uppercase tracking-wider font-bold">
            <SearchCode className="w-3.5 h-3.5" />
            <span>Technical SEO Suite · RFC 6596 Engine</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Canonical URL Validator
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Audit canonical configurations, evaluate URL syntax consistency, detect tracking tag contamination, inspect HTML source tags, and generate search-engine recommended canonical directives.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={loadSample}
              className="px-4 py-2 bg-[#D6B46A] hover:bg-[#c4a259] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Realistic Sample</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Validator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D6B46A]/20 pb-4">
        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'url'
              ? 'bg-[#111111] text-[#D6B46A] shadow-md'
              : 'text-[#8A8178] hover:text-[#111111] hover:bg-neutral-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>URL Syntax & Normalization</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('html')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'html'
              ? 'bg-[#111111] text-[#D6B46A] shadow-md'
              : 'text-[#8A8178] hover:text-[#111111] hover:bg-neutral-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>HTML Source Inspection</span>
        </button>
      </div>

      {/* Main Input Card */}
      <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-6 sm:p-8 shadow-sm space-y-6">
        {activeMode === 'url' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <FormField
                id="canonical-target-url"
                label="Target Webpage URL"
                required
                description="The live or staging URL you are auditing (e.g. https://example.com/blog/article?utm_source=x)"
              >
                <CustomInput
                  id="canonical-target-url-input"
                  placeholder="https://example.com/page-to-test"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  startIcon={<Globe className="w-4 h-4" />}
                />
              </FormField>

              <FormField
                id="canonical-expected-url"
                label="Expected Canonical Destination (Optional)"
                description="The target canonical URL you intend search engines to index (e.g. https://example.com/blog/article)"
              >
                <CustomInput
                  id="canonical-expected-url-input"
                  placeholder="https://example.com/canonical-target"
                  value={expectedCanonical}
                  onChange={(e) => setExpectedCanonical(e.target.value)}
                  startIcon={<SearchCode className="w-4 h-4" />}
                />
              </FormField>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#111111] bg-neutral-100 hover:bg-neutral-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#85641C]" />
                  <span>{showAdvancedSettings ? 'Hide Normalization Rules' : 'Configure Normalization Rules'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRemoteCheck}
                  disabled={isCheckingRemote || !targetUrl.trim()}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                    isCheckingRemote || !targetUrl.trim()
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-[#111111] text-[#D6B46A] hover:bg-[#222222] cursor-pointer'
                  }`}
                >
                  {isCheckingRemote ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  <span>{isCheckingRemote ? 'Verifying Live HTTP...' : 'Verify Live Server Headers'}</span>
                </button>
              </div>
            </div>

            {/* Advanced Normalization Settings Drawer */}
            {showAdvancedSettings && (
              <div className="bg-[#FAF8F5] border border-[#D6B46A]/20 rounded-2xl p-5 space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-2">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-[#85641C]" />
                    <span>Canonical Normalization Policy</span>
                  </h4>
                  <span className="text-[11px] text-[#8A8178]">Tailor recommendations to your brand standard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1.5">
                      Preferred Subdomain
                    </label>
                    <CustomSelect
                      value={options.preferredDomainFormat}
                      onChange={(val) => setOptions({ ...options, preferredDomainFormat: val as any })}
                      options={[
                        { value: 'non-www', label: 'Root Domain (example.com)' },
                        { value: 'www', label: 'WWW Domain (www.example.com)' },
                        { value: 'any', label: 'Preserve Input Domain' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1.5">
                      Trailing Slash Policy
                    </label>
                    <CustomSelect
                      value={options.trailingSlashRule}
                      onChange={(val) => setOptions({ ...options, trailingSlashRule: val as any })}
                      options={[
                        { value: 'preserve', label: 'Preserve Input Format' },
                        { value: 'always', label: 'Enforce Trailing Slash (/)' },
                        { value: 'never', label: 'Strictly No Trailing Slash' }
                      ]}
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <CustomSwitch
                      id="opt-force-https"
                      checked={options.forceHttps}
                      onChange={(checked) => setOptions({ ...options, forceHttps: checked })}
                      label="Enforce HTTPS Protocol"
                      description="Upgrades insecure http:// to https://"
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <CustomSwitch
                      id="opt-strip-tracking"
                      checked={options.stripTrackingParameters}
                      onChange={(checked) => setOptions({ ...options, stripTrackingParameters: checked })}
                      label="Strip Marketing Tracking Tags"
                      description="Removes utm_*, gclid, fbclid, etc."
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <CustomSwitch
                      id="opt-strip-fragments"
                      checked={options.stripFragments}
                      onChange={(checked) => setOptions({ ...options, stripFragments: checked })}
                      label="Strip Fragment Anchors (#)"
                      description="Removes #hash navigation markers"
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <CustomSwitch
                      id="opt-normalize-slashes"
                      checked={options.normalizeRepeatedSlashes}
                      onChange={(checked) => setOptions({ ...options, normalizeRepeatedSlashes: checked })}
                      label="Collapse Redundant Slashes"
                      description="Fixes // accidentally in paths"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <FormField
              id="canonical-html-source"
              label="HTML Source Code (<head> section or full page)"
              required
              description="Paste raw HTML markup to inspect the <link rel='canonical'> tag syntax, placement, duplicate tags, and href validity."
            >
              <CustomTextarea
                id="canonical-html-source-input"
                rows={8}
                placeholder="<head>&#10;  <title>Page Title</title>&#10;  <link rel='canonical' href='https://example.com/page' />&#10;</head>"
                value={htmlSource}
                onChange={(e) => setHtmlSource(e.target.value)}
                className="font-mono text-xs"
              />
            </FormField>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8A8178]">
                {htmlSource.trim() ? `${new Blob([htmlSource]).size} bytes of HTML code` : 'Zero HTML code entered'}
              </span>
              <button
                type="button"
                onClick={() => setHtmlSource('')}
                disabled={!htmlSource}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer disabled:opacity-40"
              >
                Clear HTML
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysisReport && (
        <div className="space-y-8">
          {/* Overall Health Status Bar */}
          <div className={`p-6 sm:p-7 rounded-[24px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm ${
            analysisReport.overallStatus === 'valid'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
              : analysisReport.overallStatus === 'warning'
              ? 'bg-amber-50/70 border-amber-300 text-amber-900'
              : 'bg-rose-50/70 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                analysisReport.overallStatus === 'valid'
                  ? 'bg-emerald-600 text-white'
                  : analysisReport.overallStatus === 'warning'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {analysisReport.overallStatus === 'valid' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : analysisReport.overallStatus === 'warning' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">
                    Canonical Audit Result:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 shadow-xs">
                    {analysisReport.overallStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {analysisReport.statusSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                onClick={() => handleCopy(generateDiagnosticText(analysisReport), 'diagnostic-report', 'Full Diagnostic Report')}
                className="px-4 py-2 bg-white hover:bg-neutral-50 text-[#111111] text-xs font-bold rounded-xl border border-neutral-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {copiedKey === 'diagnostic-report' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-[#85641C]" />}
                <span>{copiedKey === 'diagnostic-report' ? 'Report Copied!' : 'Copy Full Audit Report'}</span>
              </button>
            </div>
          </div>

          {/* Normalization & Recommended Directive Card */}
          <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-[#111111] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D6B46A]" />
                  <span>Canonical Normalization & Recommended Directive</span>
                </h3>
                <p className="text-xs text-[#8A8178]">
                  Comparison between raw input and RFC-compliant canonical URL
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(analysisReport.normalization.recommendedCanonicalTag, 'rec-tag', 'Canonical Tag')}
                className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {copiedKey === 'rec-tag' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'rec-tag' ? 'Tag Copied!' : 'Copy Canonical Tag'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Original URL */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-500">
                    Original Analyzed URL
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(analysisReport.normalization.originalUrl, 'orig-url', 'Original URL')}
                    className="text-[11px] text-neutral-600 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-neutral-800 break-all p-2.5 bg-white rounded-lg border border-neutral-200/70 select-all">
                  {analysisReport.normalization.originalUrl}
                </div>
              </div>

              {/* Normalized Canonical Target */}
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#D6B46A]/40 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#85641C]">
                    Clean Normalized Canonical URL
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(analysisReport.normalization.normalizedUrl, 'norm-url', 'Normalized URL')}
                    className="text-[11px] text-[#85641C] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-[#111111] font-semibold break-all p-2.5 bg-white rounded-lg border border-[#D6B46A]/30 select-all">
                  {analysisReport.normalization.normalizedUrl}
                </div>
              </div>
            </div>

            {/* Recommended Tag Code Block */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                Standard HTML Document Head Directive
              </label>
              <div className="relative group">
                <pre className="font-mono text-xs bg-[#111111] text-[#FFFDF8] p-4 rounded-xl overflow-x-auto border border-white/10 select-all">
                  {analysisReport.normalization.recommendedCanonicalTag}
                </pre>
              </div>
            </div>

            {/* Modifications Detected */}
            {analysisReport.normalization.differencesDetected.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-xs font-bold text-[#111111] block">
                  Detected Normalization Adjustments:
                </span>
                <ul className="space-y-1.5">
                  {analysisReport.normalization.differencesDetected.map((diff, i) => (
                    <li key={i} className="text-xs text-[#8A8178] flex items-start gap-2">
                      <span className="text-[#D6B46A] mt-0.5">•</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Live Server Inspection Result if performed */}
          {analysisReport.httpInspection && analysisReport.httpInspection.attempted && (
            <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-display font-bold text-base text-[#111111] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Live Server Inspection Findings</span>
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                  analysisReport.httpInspection.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {analysisReport.httpInspection.success ? 'Verified Live' : 'Inspection Incomplete'}
                </span>
              </div>

              {analysisReport.httpInspection.success ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">HTTP Status Code</span>
                    <span className="text-sm font-mono font-bold text-[#111111]">{analysisReport.httpInspection.statusCode || 200} OK</span>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">Response Latency</span>
                    <span className="text-sm font-mono font-bold text-[#111111]">{analysisReport.httpInspection.responseTimeMs || 120} ms</span>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">Canonical in HTTP Header</span>
                    <span className="text-xs font-mono font-semibold text-[#111111] break-all">
                      {analysisReport.httpInspection.canonicalHeader || 'None detected in HTTP Link header'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-xl sm:col-span-2 lg:col-span-3">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">Final Resolved Destination</span>
                    <span className="text-xs font-mono font-semibold text-[#111111] break-all">
                      {analysisReport.httpInspection.finalUrl || analysisReport.targetUrl}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                  <p className="font-bold">Notice regarding live server probe:</p>
                  <p>{analysisReport.httpInspection.errorMessage || 'Remote inspection could not connect to this server. The audit remains restricted to client-side syntax analysis.'}</p>
                </div>
              )}
            </div>
          )}

          {/* Detailed Verification Checklist */}
          <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-[#111111]">
                  Technical Audit Checklist ({filteredChecks.length})
                </h3>
                <p className="text-xs text-[#8A8178]">
                  Detailed itemized breakdown of syntax, protocol, domain, and tag hygiene
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
                {(['all', 'error', 'warning', 'pass'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setCheckFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      checkFilter === f
                        ? 'bg-white text-[#111111] shadow-xs'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist Table */}
            <div className="divide-y divide-neutral-100">
              {filteredChecks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8A8178]">
                  No verification items match the selected severity filter.
                </div>
              ) : (
                filteredChecks.map((check) => (
                  <div key={check.id} className="py-4 flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0">
                      {check.severity === 'pass' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {check.severity === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {check.severity === 'error' && (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      {check.severity === 'info' && (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111111]">
                          {check.title}
                        </span>
                        <span className={`px-2 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
                          check.severity === 'pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : check.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : check.severity === 'error'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {check.severity}
                        </span>
                        <span className="text-[10px] font-mono text-[#8A8178] uppercase">
                          {check.category}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {check.message}
                      </p>

                      {check.recommendation && (
                        <div className="mt-1 p-2 rounded-lg bg-[#FAF8F5] border border-[#D6B46A]/20 text-[11px] text-[#85641C] flex items-center gap-1.5">
                          <ArrowRight className="w-3 h-3 shrink-0" />
                          <span><strong>Fix:</strong> {check.recommendation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Educational & Technical Guidance Accordion */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-[24px] p-6 sm:p-8 space-y-4">
        <h4 className="font-display font-bold text-base text-[#111111] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#85641C]" />
          <span>Canonical Tag Best Practices & SEO Standards</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#8A8178] leading-relaxed pt-2">
          <div className="space-y-1.5 p-4 bg-white rounded-xl border border-neutral-100 shadow-xs">
            <span className="font-bold text-[#111111] block">1. Self-Referential Canonicalization</span>
            <p>
              Every unique page on your domain should include a self-referential canonical tag pointing directly to its own clean, absolute URL. This prevents accidental duplicate indexing from trailing slashes or marketing query parameters.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-white rounded-xl border border-neutral-100 shadow-xs">
            <span className="font-bold text-[#111111] block">2. Strip Tracking & Session IDs</span>
            <p>
              Parameters such as <code className="font-mono text-neutral-800">utm_*</code>, <code className="font-mono text-neutral-800">gclid</code>, and <code className="font-mono text-neutral-800">fbclid</code> are valuable for analytics but degrade search rank if included in canonical tags.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-white rounded-xl border border-neutral-100 shadow-xs">
            <span className="font-bold text-[#111111] block">3. Never Duplicate Canonical Tags</span>
            <p>
              A webpage must contain exactly ONE canonical tag inside the <code className="font-mono text-neutral-800">&lt;head&gt;</code>. If duplicate or conflicting tags are encountered, Google will disregard all of them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
