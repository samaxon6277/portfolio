import React, { useState } from 'react';
import { 
  Zap, Gauge, AlertTriangle, CheckCircle2, Clock, 
  FileCode, Layers, Info, Wrench, Smartphone, Monitor,
  Activity, ArrowDownRight, Filter, ChevronRight, ShieldCheck, AlertCircle
} from 'lucide-react';
import { ComprehensiveAuditReport, DevicePerformanceData } from '../../../utils/auditEngine/types';

interface AuditPerformanceTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditPerformanceTab: React.FC<AuditPerformanceTabProps> = ({
  report,
  onRequestFix
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [waterfallFilter, setWaterfallFilter] = useState<'all' | 'script' | 'stylesheet' | 'image' | 'font'>('all');

  const perf = report.performanceData;
  const ttfb = perf?.ttfbMs ?? report.responseTimeMs ?? 0;
  const htmlSize = perf?.htmlSizeKb ?? report.meta?.htmlSizeKb ?? 0;
  const compressionVal = perf?.compression || 'None';
  const domCount = perf?.domNodeCount ?? 0;
  const domDepth = perf?.domMaxDepth ?? 0;
  const totalResources = perf?.requestCount ?? (report.networkData?.totalDetectedAssets ?? 0);

  // Active device profile
  const activeDeviceData: DevicePerformanceData | undefined = 
    selectedStrategy === 'mobile' ? perf?.mobile : perf?.desktop;

  const hasDevicePerf = !!activeDeviceData?.available;
  const cwvSource = activeDeviceData?.source || (perf?.coreWebVitals?.available ? 'pagespeed_api' : 'unconfigured');

  const getTtfbRating = (ms: number) => {
    if (ms <= 200) return { label: 'Good (<200ms)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (ms <= 600) return { label: 'Needs Improvement (200-600ms)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Poor (>600ms)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const ttfbInfo = getTtfbRating(ttfb);

  // Active CWV metrics
  const activeFcp = activeDeviceData?.fcp ?? (perf?.coreWebVitals?.fcp ? { value: perf.coreWebVitals.fcp.value, unit: 'ms', rating: perf.coreWebVitals.fcp.rating } : null);
  const activeLcp = activeDeviceData?.lcp ?? (perf?.coreWebVitals?.lcp ? { value: perf.coreWebVitals.lcp.value, unit: 's', rating: perf.coreWebVitals.lcp.rating } : null);
  const activeCls = activeDeviceData?.cls ?? (perf?.coreWebVitals?.cls ? { value: perf.coreWebVitals.cls.value, unit: '', rating: perf.coreWebVitals.cls.rating } : null);
  const activeInp = activeDeviceData?.inp ?? (perf?.coreWebVitals?.inp ? { value: perf.coreWebVitals.inp.value, unit: 'ms', rating: perf.coreWebVitals.inp.rating } : null);
  const activeTbt = activeDeviceData?.tbt ?? (perf?.coreWebVitals?.tbt ? { value: perf.coreWebVitals.tbt.value, unit: 'ms', rating: perf.coreWebVitals.tbt.rating } : null);
  const activeSpeedIndex = activeDeviceData?.speedIndex ?? (perf?.coreWebVitals?.speedIndex ? { value: perf.coreWebVitals.speedIndex.value, unit: 's', rating: perf.coreWebVitals.speedIndex.rating } : null);

  // Real measured waterfall items (from Google PageSpeed API / Lighthouse network-requests audit)
  const isRealWaterfallAvailable = !!(activeDeviceData?.networkWaterfall && activeDeviceData.networkWaterfall.length > 0);

  const realWaterfall = isRealWaterfallAvailable
    ? activeDeviceData!.networkWaterfall!.map(w => ({
        url: w.url,
        resourceType: w.resourceType,
        transferSizeKb: Math.round(w.transferSizeBytes / 102.4) / 10,
        durationMs: Math.round(w.durationMs),
        startTimeMs: Math.round(w.startTimeMs),
        isRenderBlocking: w.isRenderBlocking,
        isThirdParty: w.isThirdParty,
        statusCode: w.status
      }))
    : [];

  const domResources = (report.networkData?.resources || []).map(r => ({
    url: r.url,
    resourceType: r.type,
    transferSizeKb: r.sizeBytes ? Math.round(r.sizeBytes / 102.4) / 10 : null,
    durationMs: r.durationMs ?? null,
    isRenderBlocking: r.isRenderBlocking,
    isThirdParty: r.isThirdParty,
    statusCode: r.status || 200
  }));

  const filteredRealWaterfall = realWaterfall.filter(item => {
    if (waterfallFilter === 'all') return true;
    return item.resourceType === waterfallFilter;
  });

  const filteredDomResources = domResources.filter(item => {
    if (waterfallFilter === 'all') return true;
    return item.resourceType === waterfallFilter;
  });

  const maxWaterfallDuration = realWaterfall.length > 0 
    ? Math.max(...realWaterfall.map(w => w.startTimeMs + w.durationMs), 800)
    : 800;

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Top Banner: Real Latency & Diagnostic Metrics */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Zap className="w-4 h-4 text-[#D6B46A]" />
              <span>Speed &amp; Loading Performance Matrix</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Direct Server Latency &amp; Document Health
            </h3>
            <p className="text-xs text-[#8A8178]">
              Direct network timings collected over HTTPS connection with compression, resource weights, and DOM complexity.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile / Desktop Switcher */}
            <div className="flex items-center bg-[#F4EFE6] p-1 rounded-2xl border border-[#D6B46A]/30">
              <button
                type="button"
                onClick={() => setSelectedStrategy('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedStrategy === 'mobile'
                    ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStrategy('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedStrategy === 'desktop'
                    ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            <div className="text-right pl-2 border-l border-[#D6B46A]/20">
              <span className="text-[10px] uppercase font-mono text-[#8A8178] block">Performance</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
                {activeDeviceData?.score ?? report.categoryStats?.performance?.score ?? report.scores?.performance ?? 0}
              </span>
              <span className="text-xs font-mono text-[#8A8178]">/100</span>
            </div>
          </div>
        </div>

        {/* 4 Core Directly-Measured Timings & Weights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Server TTFB (Latency)</span>
              <Clock className="w-4 h-4 text-[#D6B46A]" />
            </div>
            <div className="font-display font-black text-2xl text-[#111111]">
              {ttfb} <span className="text-xs font-mono font-normal">ms</span>
            </div>
            <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border inline-block ${ttfbInfo.color}`}>
              {ttfbInfo.label}
            </div>
            <span className="block text-[10px] text-emerald-700 font-mono">[SERVER] Direct HTTPS</span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">HTML Document Weight</span>
              <FileCode className="w-4 h-4 text-[#D6B46A]" />
            </div>
            <div className="font-display font-black text-2xl text-[#111111]">
              {htmlSize} <span className="text-xs font-mono font-normal">KB</span>
            </div>
            <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
              {htmlSize < 100 ? 'Lightweight (<100KB)' : 'Heavy Document'}
            </div>
            <span className="block text-[10px] text-emerald-700 font-mono">[SERVER] Byte Count</span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Compression Enforced</span>
              <Layers className="w-4 h-4 text-[#D6B46A]" />
            </div>
            <div className="font-display font-black text-2xl text-[#111111]">
              {compressionVal}
            </div>
            <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border inline-block ${
              compressionVal && compressionVal !== 'None' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {compressionVal && compressionVal !== 'None' ? 'Active' : 'Uncompressed'}
            </div>
            <span className="block text-[10px] text-emerald-700 font-mono">[SERVER] Header Probe</span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Discovered Resources</span>
              <Gauge className="w-4 h-4 text-[#D6B46A]" />
            </div>
            <div className="font-display font-black text-2xl text-[#111111]">
              {totalResources} <span className="text-xs font-mono font-normal">assets</span>
            </div>
            <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 inline-block">
              {perf?.renderBlockingResourcesCount || 0} render-blocking
            </div>
            <span className="block text-[10px] text-emerald-700 font-mono">[SERVER] DOM Scanned</span>
          </div>
        </div>
      </div>

      {/* Core Web Vitals Dual Profile Grid (Mobile / Desktop) */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Activity className="w-4 h-4 text-[#D6B46A]" />
              <span>Core Web Vitals &amp; PageSpeed Metrics ({selectedStrategy.toUpperCase()})</span>
            </div>
            <h4 className="font-display font-black text-lg sm:text-xl text-[#111111]">
              Lighthouse Lab &amp; Chrome UX Report (CrUX)
            </h4>
            <p className="text-xs text-[#8A8178]">
              Transparent attribution of real-world user metrics versus simulated lab throttling. Zero fabricated data.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4EFE6] border border-[#D6B46A]/30 rounded-full text-[11px] font-mono text-[#85641C]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Source: {(cwvSource as string) === 'field_crux' || cwvSource === 'FIELD — CrUX' ? 'FIELD — CrUX 28d' : (cwvSource as string) === 'pagespeed_api' || cwvSource === 'LAB' ? 'LAB — Lighthouse' : 'Not Configured (PAGESPEED_API_KEY)'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LCP */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#111111]">Largest Contentful Paint (LCP)</span>
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                activeLcp ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {activeLcp ? `${activeLcp.value}${activeLcp.unit}` : 'Not Available'}
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              {activeLcp
                ? `Measured viewport LCP: ${activeLcp.value}${activeLcp.unit} (${activeLcp.rating})`
                : 'Requires browser paint telemetry or Google PageSpeed API to record viewport render.'}
            </p>
            <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
              {activeLcp ? `Good: <2.5s · Strategy: ${selectedStrategy}` : 'Zero fake values: server-side HTTP cannot measure screen paints'}
            </div>
          </div>

          {/* CLS */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#111111]">Cumulative Layout Shift (CLS)</span>
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                activeCls ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {activeCls ? `${activeCls.value}` : 'Not Available'}
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              {activeCls
                ? `Layout visual stability: ${activeCls.value} (${activeCls.rating})`
                : 'Requires real viewport layout calculation during runtime document rendering.'}
            </p>
            <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
              {activeCls ? 'Good: <0.1 · Calculated across viewport' : 'Missing image width/height attributes flagged in Images tab'}
            </div>
          </div>

          {/* INP / TBT */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#111111]">Interaction / Blocking (INP/TBT)</span>
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                activeInp || activeTbt ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {activeInp ? `${activeInp.value}ms (INP)` : activeTbt ? `${activeTbt.value}ms (TBT)` : 'Not Available'}
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              {activeInp
                ? `Real user click responsiveness: ${activeInp.value}ms (${activeInp.rating})`
                : activeTbt
                ? `Lab Total Blocking Time: ${activeTbt.value}ms (${activeTbt.rating})`
                : 'Cannot be measured via HTTP fetch. Requires physical user taps or Lighthouse thread simulation.'}
            </p>
            <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
              {activeInp || activeTbt ? 'Good: <200ms · Evaluated on main thread' : 'Browser-bound interaction metric'}
            </div>
          </div>

          {/* FCP */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#111111]">First Contentful Paint (FCP)</span>
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                activeFcp ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {activeFcp ? `${activeFcp.value}${activeFcp.unit}` : 'Not Available'}
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              {activeFcp
                ? `Initial paint duration: ${activeFcp.value}${activeFcp.unit} (${activeFcp.rating})`
                : 'Requires browser paint engine to record first DOM element render.'}
            </p>
            <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
              Good: &lt;1.8s · Includes TTFB + CSSOM render
            </div>
          </div>

          {/* Speed Index */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#111111]">Speed Index</span>
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                activeSpeedIndex ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {activeSpeedIndex ? `${activeSpeedIndex.value}${activeSpeedIndex.unit}` : 'Not Available'}
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              {activeSpeedIndex
                ? `Visual progression rate: ${activeSpeedIndex.value}${activeSpeedIndex.unit} (${activeSpeedIndex.rating})`
                : 'Requires video frame comparison during load.'}
            </p>
            <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
              Good: &lt;3.4s · Lower is faster
            </div>
          </div>

          {/* DOM Complexity */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#111111]">DOM Node Complexity</span>
              <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {domCount} nodes
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              Directly measured document tree depth: {domDepth} levels deep.
            </p>
            <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
              Target: &lt;1,500 nodes · Maximum depth &lt;32
            </div>
          </div>
        </div>
      </div>

      {/* Network Waterfall / Resource Discovery Section */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-black text-lg sm:text-xl text-[#111111]">
                {isRealWaterfallAvailable ? 'Network Waterfall Timeline' : 'Discovered Page Resources'}
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F4EFE6] text-[#85641C]">
                {isRealWaterfallAvailable ? 'LAB — PageSpeed Insights' : 'DOM STATIC DISCOVERY'}
              </span>
            </div>
            <p className="text-xs text-[#8A8178]">
              {isRealWaterfallAvailable
                ? 'Chronological sequence of documents, scripts, stylesheets, and assets captured by Lighthouse browser trace.'
                : 'Static resources extracted from the parsed HTML document. Runtime network timeline (start offsets and transfer durations) requires Google PageSpeed Insights API.'}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'script', 'stylesheet', 'image', 'font'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setWaterfallFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  waterfallFilter === type
                    ? 'bg-[#111111] text-[#D6B46A]'
                    : 'bg-[#F4EFE6] text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Real Waterfall Bars (When Available) */}
        {isRealWaterfallAvailable ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8178] pb-1 border-b border-zinc-100 px-2">
              <span className="w-1/3">Resource Name &amp; Origin</span>
              <span className="w-1/6 text-right">Transfer</span>
              <span className="w-1/2 text-right">Timeline (0ms → {maxWaterfallDuration}ms)</span>
            </div>

            {filteredRealWaterfall.slice(0, 18).map((item, idx) => {
              const parsedName = item.url.split('/').pop()?.split('?')[0] || item.url;
              const leftPct = Math.min(85, (item.startTimeMs / maxWaterfallDuration) * 100);
              const widthPct = Math.max(8, Math.min(100 - leftPct, (item.durationMs / maxWaterfallDuration) * 100));

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FFFDF8] hover:bg-[#F9F6EE] border border-[#D6B46A]/20 text-xs transition-colors gap-2"
                >
                  <div className="w-1/3 min-w-0 flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 uppercase ${
                      item.resourceType === 'script' ? 'bg-amber-100 text-amber-900' :
                      item.resourceType === 'stylesheet' ? 'bg-blue-100 text-blue-900' :
                      item.resourceType === 'image' ? 'bg-emerald-100 text-emerald-900' :
                      item.resourceType === 'font' ? 'bg-purple-100 text-purple-900' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {item.resourceType}
                    </span>
                    <span className="truncate font-mono text-[11px] text-[#111111]" title={item.url}>
                      {parsedName || item.url}
                    </span>
                    {item.isRenderBlocking && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-100 text-rose-800 shrink-0">
                        BLOCKING
                      </span>
                    )}
                  </div>

                  <div className="w-1/6 text-right font-mono text-[10px] text-[#8A8178] shrink-0">
                    {item.transferSizeKb} KB
                  </div>

                  <div className="w-1/2 relative h-4 bg-zinc-100 rounded-full overflow-hidden shrink-0">
                    <div
                      className={`absolute top-0 bottom-0 rounded-full ${
                        item.isRenderBlocking ? 'bg-rose-500' :
                        item.resourceType === 'script' ? 'bg-amber-500' :
                        item.resourceType === 'stylesheet' ? 'bg-blue-500' :
                        item.resourceType === 'image' ? 'bg-emerald-500' :
                        'bg-[#D6B46A]'
                      }`}
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`
                      }}
                      title={`Start: ${item.startTimeMs}ms, Duration: ${item.durationMs}ms`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DOM Discovered Resources (Zero-Fabrication Fallback) */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8178] pb-1 border-b border-zinc-100 px-2">
              <span className="w-2/3">Resource URL &amp; DOM Reference</span>
              <span className="w-1/3 text-right">Attributes &amp; Status</span>
            </div>

            {filteredDomResources.length > 0 ? (
              filteredDomResources.slice(0, 15).map((item, idx) => {
                const parsedName = item.url.split('/').pop()?.split('?')[0] || item.url;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FFFDF8] hover:bg-[#F9F6EE] border border-[#D6B46A]/20 text-xs transition-colors gap-2"
                  >
                    <div className="w-2/3 min-w-0 flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 uppercase ${
                        item.resourceType === 'script' ? 'bg-amber-100 text-amber-900' :
                        item.resourceType === 'stylesheet' ? 'bg-blue-100 text-blue-900' :
                        item.resourceType === 'image' ? 'bg-emerald-100 text-emerald-900' :
                        item.resourceType === 'font' ? 'bg-purple-100 text-purple-900' :
                        'bg-zinc-100 text-zinc-800'
                      }`}>
                        {item.resourceType}
                      </span>
                      <span className="truncate font-mono text-[11px] text-[#111111]" title={item.url}>
                        {parsedName || item.url}
                      </span>
                    </div>

                    <div className="w-1/3 text-right flex items-center justify-end gap-1.5 shrink-0">
                      {item.isRenderBlocking && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-100 text-rose-800">
                          BLOCKING
                        </span>
                      )}
                      {item.isThirdParty && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                          3RD PARTY
                        </span>
                      )}
                      {item.transferSizeKb !== null && (
                        <span className="font-mono text-[10px] text-[#8A8178]">
                          {item.transferSizeKb} KB
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[#8A8178] font-mono">
                No matching resources found for filter "{waterfallFilter}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Thread & Long Tasks Breakdown */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <h4 className="font-display font-black text-lg sm:text-xl text-[#111111]">
              Main Thread Profiling &amp; Long Tasks (&gt;50ms)
            </h4>
            <p className="text-xs text-[#8A8178]">
              Long tasks block user interactions like tapping, typing, or scrolling. Keep individual task slices under 50ms.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-auto bg-[#F4EFE6] text-[#85641C]">
            {activeDeviceData?.available ? 'LAB — Lighthouse' : 'NOT AVAILABLE'}
          </span>
        </div>

        {activeDeviceData?.available ? (
          activeDeviceData.longTasks && activeDeviceData.longTasks.length > 0 ? (
            <div className="space-y-3">
              {activeDeviceData.longTasks.map((task, i) => (
                <div key={i} className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-rose-900 block">
                      Long Task #{i + 1}: {Math.round(task.durationMs)}ms duration
                    </span>
                    <span className="text-[11px] font-mono text-rose-700 truncate block max-w-lg">
                      Culprit: {task.url || 'Evaluated Script Bundle'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-mono text-[10px] font-bold">
                    Blocks UI Thread
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-[#FFFDF8] border border-dashed border-[#D6B46A]/30 rounded-2xl text-center text-xs text-[#8A8178] space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-bold text-[#111111]">No Excessive Long Tasks Detected on Main Thread</p>
              <p className="text-[11px] max-w-md mx-auto">
                Lighthouse audit confirmed all evaluated main-thread JavaScript slices were completed under the 50ms blocking threshold.
              </p>
            </div>
          )
        ) : (
          <div className="p-6 bg-[#FFFDF8] border border-dashed border-zinc-200 rounded-2xl text-center text-xs text-[#8A8178] space-y-2">
            <AlertCircle className="w-6 h-6 text-[#8A8178] mx-auto" />
            <p className="font-bold text-[#111111]">Main-Thread Task Profiling Not Available</p>
            <p className="text-[11px] max-w-md mx-auto">
              Main-thread execution telemetry requires Google PageSpeed Insights API or a live browser execution trace. In adherence to strict zero-fabrication guidelines, execution times are not simulated.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Timing vs Server TTFB Explanation */}
      <div className="p-6 bg-[#F4EFE6]/60 border border-[#D6B46A]/30 rounded-3xl space-y-3 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#111111]">
          <Info className="w-4 h-4 text-[#D6B46A]" />
          <span>Server-to-Target TTFB vs Browser Navigation Timing (Engineering Notice)</span>
        </div>
        <p className="text-[#8A8178] leading-relaxed">
          The <strong>{ttfb}ms Server TTFB</strong> reported above reflects the direct network latency measured between SamaXon’s audit engine and your origin server over TLS. In contrast, a real browser navigating to your site additionally accumulates DNS lookup, TCP handshakes, TLS negotiation, client cache resolution, and redirect chain latency.
        </p>
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onRequestFix('Performance & TTFB Optimization')}
            className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Request Performance Optimization</span>
          </button>
        </div>
      </div>
    </div>
  );
};
