import React, { useState, useRef } from 'react';
import { 
  Smartphone, Tablet, Monitor, RotateCw, ZoomIn, ZoomOut, 
  ExternalLink, Copy, Check, Maximize2, Minimize2, Eye, 
  Layers, Sliders, RefreshCw, Sparkles, Globe
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomSelect from '../ui/CustomSelect';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomTabs from '../ui/CustomTabs';

interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'mobile' | 'tablet' | 'desktop';
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-15', name: 'iPhone 15 Pro', width: 393, height: 852, category: 'mobile' },
  { id: 'galaxy-s24', name: 'Samsung Galaxy S24', width: 412, height: 915, category: 'mobile' },
  { id: 'pixel-8', name: 'Google Pixel 8', width: 412, height: 892, category: 'mobile' },
  { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, category: 'tablet' },
  { id: 'ipad-pro', name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet' },
  { id: 'macbook-air', name: 'MacBook Air / Laptop', width: 1440, height: 900, category: 'desktop' },
  { id: 'fhd-desktop', name: 'Full HD Desktop (1080p)', width: 1920, height: 1080, category: 'desktop' },
  { id: '2k-qhd', name: '2K QHD Display', width: 2560, height: 1440, category: 'desktop' }
];

export default function ResponsiveBreakpointTester() {
  const { showToast } = useCustomUi();
  const [targetUrl, setTargetUrl] = useState('/');
  const [inputUrl, setInputUrl] = useState('/');
  const [selectedDevice, setSelectedDevice] = useState<string>('iphone-15');
  const [width, setWidth] = useState<number>(393);
  const [height, setHeight] = useState<number>(852);
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Active Dimensions considering orientation
  const activeWidth = isLandscape ? height : width;
  const activeHeight = isLandscape ? width : height;

  // Active Tailwind breakpoint
  const getTailwindBreakpoint = (w: number) => {
    if (w < 640) return { name: 'xs (< 640px)', class: 'Mobile / Extra Small' };
    if (w < 768) return { name: 'sm (640px)', class: 'Small devices' };
    if (w < 1024) return { name: 'md (768px)', class: 'Medium / Tablet' };
    if (w < 1280) return { name: 'lg (1024px)', class: 'Large / Small Laptops' };
    if (w < 1536) return { name: 'xl (1280px)', class: 'Extra Large Desktops' };
    return { name: '2xl (1536px+)', class: 'Ultra-wide / High Resolution' };
  };

  const breakpoint = getTailwindBreakpoint(activeWidth);

  // Handle Device Change
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    const found = DEVICE_PRESETS.find(d => d.id === deviceId);
    if (found) {
      setWidth(found.width);
      setHeight(found.height);
      setIsLandscape(false);
      showToast(`Viewport calibrated to ${found.name} (${found.width}x${found.height}px)`, 'info');
    }
  };

  // Toggle Orientation
  const handleRotate = () => {
    setIsLandscape(!isLandscape);
    showToast(`Orientation switched to ${!isLandscape ? 'Landscape' : 'Portrait'}`, 'info');
  };

  // Reload iframe
  const handleReloadFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      showToast('Viewport preview refreshed.', 'info');
    }
  };

  // Media Query CSS Snippet
  const cssMediaQuerySnippet = `@media (min-width: ${activeWidth}px) {\n  /* Rules targeted for ${activeWidth}px and above */\n  .custom-layout {\n    /* adjust grid, typography, padding */\n  }\n}`;

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 animate-fade-in text-neutral-900 ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-950 p-6 overflow-auto max-w-none' : ''}`} id="responsive-tester-tool">
      {/* Header Banner (Hidden in fullscreen) */}
      {!isFullscreen && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Multi-Device Viewport Simulation</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Responsive Breakpoint Tester
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
              Verify mobile responsiveness, fluid grid behavior, navigation drawer transitions, and CSS media queries in real-time across smartphones, tablets, laptops, and ultra-wide screens.
            </p>
          </div>
        </div>
      )}

      {/* Control Console */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        {/* URL Navigator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex-1 flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
            <Globe className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. / or /banquet-hall-website-design or https://example.com"
              className="w-full text-xs font-mono bg-transparent border-none focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTargetUrl(inputUrl);
                showToast(`Navigating viewport to ${inputUrl}`, 'info');
              }}
              className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Load URL
            </button>

            {/* Quick Internal Presets */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Home', path: '/' },
                { label: 'Banquets', path: '/banquet-hall-website-design' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Contact', path: '/contact' }
              ].map(p => (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => {
                    setInputUrl(p.path);
                    setTargetUrl(p.path);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport & Device Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <CustomSelect
                value={selectedDevice}
                onChange={handleSelectDevice}
                options={DEVICE_PRESETS.map(d => ({
                  value: d.id,
                  label: `${d.name} (${d.width}x${d.height})`
                }))}
              />
            </div>

            <button
              type="button"
              onClick={handleRotate}
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Toggle Portrait / Landscape"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">{isLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>

            <button
              type="button"
              onClick={handleReloadFrame}
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              title="Refresh Viewport"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Scale Control */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono">
              <button
                type="button"
                onClick={() => setScale(Math.max(25, scale - 15))}
                className="p-1 hover:text-[#8F722E] cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-neutral-800">{scale}%</span>
              <button
                type="button"
                onClick={() => setScale(Math.min(150, scale + 15))}
                className="p-1 hover:text-[#8F722E] cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Breakpoint Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D6B46A]/15 border border-[#D6B46A]/30 text-xs font-mono font-bold text-[#8F722E]">
              <span className="w-2 h-2 rounded-full bg-[#D6B46A] animate-pulse" />
              <span>Tailwind: {breakpoint.name}</span>
            </div>

            {/* View Mode Toggle */}
            <CustomTabs
              tabs={[
                { id: 'single', label: 'Single View' },
                { id: 'multi', label: '3-Device Matrix' }
              ]}
              activeTab={viewMode}
              onChange={(m) => setViewMode(m as any)}
            />

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              title="Toggle Fullscreen Canvas"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Frame Area */}
      {viewMode === 'single' ? (
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-inner flex flex-col items-center justify-center min-h-[600px] overflow-auto">
          <div className="text-[11px] font-mono text-neutral-400 mb-2 flex items-center gap-3">
            <span>Viewport Dimensions: <strong className="text-[#D6B46A]">{activeWidth}px &times; {activeHeight}px</strong></span>
            <span>&bull;</span>
            <span>Zoom: <strong>{scale}%</strong></span>
            <span>&bull;</span>
            <span>Category: <strong className="uppercase">{breakpoint.class}</strong></span>
          </div>

          <div 
            className="transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border-4 border-neutral-700 bg-white relative"
            style={{
              width: `${activeWidth}px`,
              height: `${activeHeight}px`,
              transform: scale !== 100 ? `scale(${scale / 100})` : undefined,
              transformOrigin: 'top center'
            }}
          >
            <iframe
              ref={iframeRef}
              src={targetUrl}
              title="Responsive Viewport Preview"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      ) : (
        /* Multi-Device Simultaneous Preview (Mobile, Tablet, Desktop) */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
            <span className="font-bold text-neutral-900">Multi-Device Matrix: Simultaneous live rendering</span>
            <span className="font-mono text-neutral-400">Mobile (390px) &bull; Tablet (820px) &bull; Desktop (1200px)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Mobile */}
            <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center shadow-lg">
              <div className="text-xs font-mono text-[#D6B46A] mb-2 font-bold">Mobile (390 &times; 720px)</div>
              <div className="w-[390px] h-[620px] rounded-xl overflow-hidden border-2 border-neutral-700 bg-white max-w-full">
                <iframe src={targetUrl} title="Mobile Preview" className="w-full h-full border-0" />
              </div>
            </div>

            {/* 2. Tablet */}
            <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center shadow-lg">
              <div className="text-xs font-mono text-[#D6B46A] mb-2 font-bold">Tablet (768 &times; 620px)</div>
              <div className="w-[768px] h-[620px] rounded-xl overflow-hidden border-2 border-neutral-700 bg-white max-w-full">
                <iframe src={targetUrl} title="Tablet Preview" className="w-full h-full border-0" />
              </div>
            </div>

            {/* 3. Desktop */}
            <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center shadow-lg">
              <div className="text-xs font-mono text-[#D6B46A] mb-2 font-bold">Desktop (1024 &times; 620px)</div>
              <div className="w-[1024px] h-[620px] rounded-xl overflow-hidden border-2 border-neutral-700 bg-white max-w-full">
                <iframe src={targetUrl} title="Desktop Preview" className="w-full h-full border-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Query Code Export Helper */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider">
              CSS Media Query for Current Width ({activeWidth}px)
            </h4>
            <p className="text-xs text-neutral-500">Copy this media query to target exact responsive styles.</p>
          </div>
          <CustomCopyButton text={cssMediaQuerySnippet} label="Copy CSS Rule" />
        </div>

        <pre className="p-3.5 rounded-xl bg-neutral-900 text-neutral-200 text-xs font-mono overflow-x-auto">
          {cssMediaQuerySnippet}
        </pre>
      </div>
    </div>
  );
}
