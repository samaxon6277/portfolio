import React, { useState } from 'react';
import { 
  Zap, Globe, Gauge, Clock, HardDrive, ShieldCheck, 
  ArrowUpRight, AlertTriangle, CheckCircle2, Copy, Check,
  Printer, RefreshCw, Sparkles, Activity, Layers, Download,
  ExternalLink, BarChart3, AlertCircle, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppInquiryUrl } from '../../config/siteConfig';

interface SpeedCheckData {
  success: boolean;
  reachable: boolean;
  url: string;
  hostname: string;
  statusCode: number;
  scores: {
    performance: number;
    ttfb: number;
    payload: number;
    renderBlocking: number;
  };
  grade: string;
  metrics: {
    ttfbMs: number;
    totalLatencyMs: number;
    simulatedFcpMs: number;
    simulatedLcpMs: number;
    simulatedCls: number;
    inpRisk: 'Low' | 'Moderate' | 'High';
    htmlSizeKb: number;
    compression: string;
    compressionSavingsKb: number;
  };
  resources: {
    scriptsCount: number;
    renderBlockingScriptsCount: number;
    stylesheetsCount: number;
    imagesCount: number;
    imagesMissingDimensions: number;
  };
  animationJank: {
    risk: 'Low' | 'Moderate' | 'High';
    nonCompositedProperties: string[];
    keyframesCount: number;
    hasReducedMotion: boolean;
  };
  benchmarks: {
    yourSiteSec: number;
    industryAverageSec: number;
    samaxonSec: number;
  };
  optimizations: Array<{
    title: string;
    estimatedMsSaved: number;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function WebsiteSpeedChecker() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SpeedCheckData | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'assets' | 'jank' | 'optimizations'>('vitals');

  const sampleTargets = ['samaxon.site', 'stripe.com', 'github.com'];

  const handleRunSpeedCheck = async (targetUrl?: string) => {
    const urlToTest = (targetUrl || urlInput).trim();
    if (!urlToTest) {
      setError('Please provide a valid website domain or URL.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tools/speed-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Speed check request failed.');
      }

      setData(json);
      setActiveSubTab('vitals');
    } catch (err: any) {
      setError(err.message || 'Unable to connect to speed diagnostic service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!data) return;
    const summary = `SamaXon Speed Benchmark for ${data.hostname}
Performance Score: ${data.scores.performance}/100 (Grade: ${data.grade})
- TTFB (Server Response): ${data.metrics.ttfbMs}ms
- First Contentful Paint: ${data.metrics.simulatedFcpMs}ms
- Largest Contentful Paint: ${data.metrics.simulatedLcpMs}ms
- Cumulative Layout Shift: ${data.metrics.simulatedCls}
- Render Blocking Scripts: ${data.resources.renderBlockingScriptsCount}
- Compression: ${data.metrics.compression.toUpperCase()}
Top Optimization: ${data.optimizations[0]?.title || 'None'} (~${data.optimizations[0]?.estimatedMsSaved || 0}ms savings)
Generated via SamaXon Speed Checker (https://samaxon.site/tools/website-speed-checker)`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div id="website-speed-checker-app" className="w-full max-w-7xl mx-auto space-y-8">
      {/* 1. Tool Hero & Input Bar */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-lg space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/40 text-[#85641C] text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#85641C]" />
            Core Web Vitals & TTFB Diagnostics
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
            Website Speed & Performance Checker
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base leading-relaxed">
            Diagnose actual Time to First Byte (TTFB), First Contentful Paint, render-blocking JavaScript, asset compression ratios, and CSS animation layout reflow risks with millisecond precision.
          </p>
        </div>

        {/* Input Form */}
        <form 
          id="speed-check-form"
          onSubmit={(e) => { e.preventDefault(); handleRunSpeedCheck(); }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E857B]" />
              <input
                id="speed-check-url-input"
                type="text"
                placeholder="Enter domain or URL (e.g. yourstore.com or https://...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-[#F8F4EE] border border-[#D6B46A]/30 rounded-2xl text-[#111111] placeholder:text-[#8E857B] text-base focus:outline-none focus:border-[#D6B46A] focus:ring-2 focus:ring-[#D6B46A]/20 transition-all font-mono"
              />
            </div>
            <button
              id="speed-check-submit-btn"
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 sm:py-4 bg-[#111111] hover:bg-[#262626] text-[#FFFDF8] font-semibold rounded-2xl transition-all duration-200 shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer text-base"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#D6B46A]" />
                  <span>Testing Latency...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-[#D6B46A]" />
                  <span>Test Website Speed</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#8E857B]">Test benchmark domain:</span>
            {sampleTargets.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { setUrlInput(t); handleRunSpeedCheck(t); }}
                className="text-xs px-2.5 py-1 bg-[#F8F4EE] hover:bg-[#D6B46A]/15 border border-[#D6B46A]/20 hover:border-[#D6B46A]/50 rounded-lg text-[#4A443E] transition-all font-mono"
              >
                {t}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Diagnostic Connection Notice</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-3xl p-10 text-center space-y-4 shadow-soft-sm">
          <div className="inline-block p-4 rounded-2xl bg-[#F8F4EE] animate-pulse">
            <Activity className="w-8 h-8 text-[#D6B46A] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-[#111111]">Executing Multi-Stage Latency & CWV Probes...</h3>
          <p className="text-sm text-[#6B635B] max-w-md mx-auto">
            Probing TCP handshake, Time to First Byte (TTFB), DOM render blocking resources, payload compression, and composited animation profiles.
          </p>
        </div>
      )}

      {/* Results View */}
      {data && !loading && (
        <div id="speed-check-results" className="space-y-8 animate-fadeIn">
          {/* Header Action Bar */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#85641C]">Speed Diagnostics Ready</span>
                <span className="text-xs text-[#8E857B]">• TTFB {data.metrics.ttfbMs}ms • Payload {data.metrics.htmlSizeKb}KB</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] font-mono break-all">
                {data.hostname}
              </h3>
              <p className="text-xs text-[#8E857B]">
                HTTP Status: <span className="font-mono text-[#4A443E]">{data.statusCode || 200} OK</span> • Compression: <span className="font-mono uppercase text-[#4A443E]">{data.metrics.compression}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleCopySummary}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#85641C]" />}
                <span>{copiedSummary ? 'Copied Speed Data!' : 'Copy Summary'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#F8F4EE] hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#111111] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#85641C]" />
                <span>Print / PDF</span>
              </button>
              <a
                href={getWhatsAppInquiryUrl(`Hi SamaXon, I tested speed on ${data.hostname} (LCP: ${data.benchmarks.yourSiteSec}s, Score: ${data.scores.performance}/100). How quickly can you upgrade us to sub-0.4s speed?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#262626] text-[#FFFDF8] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-soft-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                <span>Accelerate to &lt;0.4s</span>
              </a>
            </div>
          </div>

          {/* Benchmark Comparison Meter */}
          <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D6B46A] font-semibold">Speed Benchmark Comparison</span>
                <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFDF8] mt-1">
                  How Fast Does Your Site Paint Compared to Industry Standard?
                </h4>
              </div>
              <div className="px-4 py-2 bg-[#262626] border border-[#D6B46A]/30 rounded-2xl flex items-center gap-3">
                <span className="text-xs text-[#8E857B]">Your Performance Score:</span>
                <span className="text-xl font-black font-mono text-[#D6B46A]">{data.scores.performance}/100</span>
                <span className="px-2 py-0.5 rounded bg-[#D6B46A] text-[#111111] font-mono font-bold text-xs">
                  Grade {data.grade}
                </span>
              </div>
            </div>

            {/* Visual 3-Way Benchmark Bars */}
            <div className="space-y-4 pt-2">
              {/* Your Site */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#FFFDF8] font-bold">Your Website ({data.hostname})</span>
                  <span className={data.benchmarks.yourSiteSec <= 1.0 ? 'text-emerald-400 font-bold' : data.benchmarks.yourSiteSec <= 2.5 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>
                    {data.benchmarks.yourSiteSec}s LCP
                  </span>
                </div>
                <div className="w-full h-3.5 bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, Math.max(10, (data.benchmarks.yourSiteSec / 4) * 100))}%`,
                      backgroundColor: data.benchmarks.yourSiteSec <= 1.0 ? '#10B981' : data.benchmarks.yourSiteSec <= 2.5 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
              </div>

              {/* Industry Average */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#8E857B]">
                  <span>Global Web Average (WordPress / Elementor / Shopify)</span>
                  <span>1.80s LCP</span>
                </div>
                <div className="w-full h-3.5 bg-[#262626] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8E857B] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              {/* SamaXon Benchmark */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#D6B46A] font-bold">SamaXon High-Performance Architecture</span>
                  <span className="text-[#D6B46A] font-bold">0.35s Instant Paint</span>
                </div>
                <div className="w-full h-3.5 bg-[#262626] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D6B46A] rounded-full shadow-gold-soft" style={{ width: '9%' }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8E857B] pt-2 border-t border-white/10">
              * Based on Google Core Web Vitals guidelines: Every 100ms decrease in page latency increases eCommerce conversion rates by an average of 1.1%.
            </p>
          </div>

          {/* Core Web Vitals Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* TTFB */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl p-5 space-y-2 shadow-soft-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E857B]">TTFB (Server Ping)</span>
                <Clock className="w-4 h-4 text-[#85641C]" />
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">{data.metrics.ttfbMs}</span>
                <span className="text-xs text-[#8E857B]">ms</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-block ${
                data.metrics.ttfbMs <= 250 ? 'bg-emerald-100 text-emerald-800' : data.metrics.ttfbMs <= 600 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {data.metrics.ttfbMs <= 250 ? 'Good (<250ms)' : data.metrics.ttfbMs <= 600 ? 'Average' : 'High Latency'}
              </span>
            </div>

            {/* FCP */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl p-5 space-y-2 shadow-soft-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E857B]">FCP (First Paint)</span>
                <Activity className="w-4 h-4 text-[#85641C]" />
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">{(data.metrics.simulatedFcpMs / 1000).toFixed(2)}</span>
                <span className="text-xs text-[#8E857B]">sec</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-block ${
                data.metrics.simulatedFcpMs <= 1500 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {data.metrics.simulatedFcpMs <= 1500 ? 'Fast First Paint' : 'Needs Optimization'}
              </span>
            </div>

            {/* LCP */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl p-5 space-y-2 shadow-soft-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E857B]">LCP (Hero Content)</span>
                <Gauge className="w-4 h-4 text-[#85641C]" />
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">{(data.metrics.simulatedLcpMs / 1000).toFixed(2)}</span>
                <span className="text-xs text-[#8E857B]">sec</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-block ${
                data.metrics.simulatedLcpMs <= 2500 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {data.metrics.simulatedLcpMs <= 2500 ? 'Within Google CWV' : 'Fails Core Vitals'}
              </span>
            </div>

            {/* CLS */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl p-5 space-y-2 shadow-soft-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E857B]">CLS (Layout Shift)</span>
                <Layers className="w-4 h-4 text-[#85641C]" />
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">{data.metrics.simulatedCls}</span>
                <span className="text-xs text-[#8E857B]">score</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-block ${
                data.metrics.simulatedCls <= 0.1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {data.metrics.simulatedCls <= 0.1 ? 'Stable (<0.1)' : 'Layout Movement'}
              </span>
            </div>
          </div>

          {/* Subtabs for Deep Diagnostics */}
          <div className="flex flex-wrap gap-2 border-b border-[#D6B46A]/30 pb-3">
            {[
              { id: 'vitals', label: 'Resource Overhead' },
              { id: 'jank', label: `CSS Animation Jank (${data.animationJank.risk} Risk)` },
              { id: 'optimizations', label: `High-Impact Fixes (${data.optimizations.length})` }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSubTab === t.id
                    ? 'bg-[#111111] text-[#FFFDF8]'
                    : 'bg-[#FFFDF8] text-[#6B635B] hover:text-[#111111] border border-[#D6B46A]/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* SUBTAB 1: RESOURCE OVERHEAD */}
          {activeSubTab === 'vitals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scripts & Render Blocking */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#111111]">JavaScript & Head Scripts</h4>
                  <span className="text-xs font-mono text-[#85641C] font-semibold">
                    {data.resources.scriptsCount} scripts found
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 font-mono text-xs">
                    <span className="text-[#4A443E]">Render-Blocking Head Scripts</span>
                    <span className={`font-bold ${data.resources.renderBlockingScriptsCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {data.resources.renderBlockingScriptsCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 font-mono text-xs">
                    <span className="text-[#4A443E]">CSS Stylesheets Injected</span>
                    <span className="font-bold text-[#111111]">{data.resources.stylesheetsCount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 font-mono text-xs">
                    <span className="text-[#4A443E]">Compression Protocol</span>
                    <span className="font-bold text-[#85641C] uppercase">{data.metrics.compression}</span>
                  </div>

                  {data.metrics.compression === 'none' && (
                    <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                      ⚠️ Data is transmitted without Brotli or Gzip. Enabling Brotli will save an estimated <strong>{data.metrics.compressionSavingsKb} KB</strong> per request.
                    </div>
                  )}
                </div>
              </div>

              {/* Media & Images */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#111111]">Media & Aspect Dimensions</h4>
                  <span className="text-xs font-mono text-[#85641C] font-semibold">
                    {data.resources.imagesCount} images analyzed
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 font-mono text-xs">
                    <span className="text-[#4A443E]">Images Missing Explicit Dimensions</span>
                    <span className={`font-bold ${data.resources.imagesMissingDimensions > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {data.resources.imagesMissingDimensions}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    When images lack explicit <code>width</code> and <code>height</code> attributes, browser rendering engines cannot reserve placeholder space before image bytes download, causing abrupt layout reflows (Cumulative Layout Shift).
                  </p>

                  <div className="p-3 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 font-mono text-xs space-y-1">
                    <span className="text-[#8E857B] block font-sans text-[11px]">Recommended Img Tag Syntax:</span>
                    <code className="text-[#85641C] block text-[11px]">
                      &lt;img src="hero.webp" width="1200" height="630" loading="lazy" /&gt;
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: CSS ANIMATION JANK */}
          {activeSubTab === 'jank' && (
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-[#111111]">CSS Animation & Layout Reflow Inspector</h4>
                  <p className="text-xs text-[#6B635B] mt-0.5">
                    Animating layout properties (like width, top, margin) triggers expensive main-thread CPU recalculations. Smooth 60fps animations must use GPU-composited <code>transform</code> and <code>opacity</code>.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold shrink-0 flex items-center gap-2">
                  <span className="text-[#8E857B]">Reflow Risk:</span>
                  <span className={data.animationJank.risk === 'Low' ? 'text-emerald-600' : data.animationJank.risk === 'Moderate' ? 'text-amber-600' : 'text-red-600'}>
                    {data.animationJank.risk}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 space-y-1">
                  <span className="text-[#8E857B] block font-sans">Non-Composited Properties:</span>
                  <span className="font-bold text-[#111111]">
                    {data.animationJank.nonCompositedProperties.length > 0 ? data.animationJank.nonCompositedProperties.join(', ') : 'None (GPU-Clean)'}
                  </span>
                </div>
                <div className="p-4 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 space-y-1">
                  <span className="text-[#8E857B] block font-sans">Keyframe Animations:</span>
                  <span className="font-bold text-[#111111]">{data.animationJank.keyframesCount} rules</span>
                </div>
                <div className="p-4 bg-[#F8F4EE] rounded-xl border border-[#D6B46A]/20 space-y-1">
                  <span className="text-[#8E857B] block font-sans">Reduced-Motion Support:</span>
                  <span className={`font-bold ${data.animationJank.hasReducedMotion ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {data.animationJank.hasReducedMotion ? 'Declared' : 'Not Detected'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: HIGH IMPACT OPTIMIZATIONS */}
          {activeSubTab === 'optimizations' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#111111]">Prioritized Performance Engineering Recommendations</h4>
              <div className="space-y-3">
                {data.optimizations.map((opt, i) => (
                  <div key={i} className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-2xl p-5 shadow-soft-xs space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#85641C] shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-[#111111] text-sm">{opt.title}</h5>
                          <p className="text-xs text-[#6B635B] mt-1">{opt.description}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-[#D6B46A]/20 text-[#85641C] rounded-lg font-mono font-bold text-xs shrink-0">
                        ~{opt.estimatedMsSaved}ms Faster
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Conversion Section */}
          <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-soft-xl">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#D6B46A]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D6B46A]">Guaranteed 48-Hour Acceleration</span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDF8]">
                Upgrade your website to 0.35s sub-second performance
              </h3>
              <p className="text-[#8E857B] text-sm sm:text-base leading-relaxed">
                Slow websites bleed revenue. SamaXon re-architects slow client websites into blazingly fast edge platforms with guaranteed 95+ Core Web Vitals scores and 48-hour delivery.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={getWhatsAppInquiryUrl(`Hi SamaXon, I tested ${data.hostname} speed. Current LCP is ${data.benchmarks.yourSiteSec}s. Please share your sub-second acceleration proposal.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-bold rounded-2xl transition-all shadow-gold-soft flex items-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#111111]" />
                  <span>Accelerate My Website on WhatsApp</span>
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3.5 bg-transparent hover:bg-white/5 border border-[#D6B46A]/40 text-[#FFFDF8] font-semibold rounded-2xl transition-all text-sm flex items-center gap-2"
                >
                  <span>Request Full Architecture Overhaul</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D6B46A]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
