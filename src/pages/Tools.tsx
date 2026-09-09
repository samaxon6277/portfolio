import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Minimize2, Crop, Sparkles, LayoutGrid, ArrowLeft, 
  ShieldCheck, Zap, Lock, ChevronRight, RefreshCw, Calculator,
  Wand2, FileText, Image as ImageIcon, ChevronDown, AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import PhotoCompressor from '../components/tools/PhotoCompressor';
import PhotoResizer from '../components/tools/PhotoResizer';
import ImageConverter from '../components/tools/ImageConverter';
import UniversalCalculator from '../components/tools/UniversalCalculator';
import PdfReducerSigner from '../components/tools/PdfReducerSigner';
import AiBackgroundRemover from '../components/tools/AiBackgroundRemover';
import AiImageUpscaler from '../components/tools/AiImageUpscaler';
import VectorSvgConverter from '../components/tools/VectorSvgConverter';
import ToolsOverview from '../components/tools/ToolsOverview';
import { getToolsConfig, ToolItemConfig } from '../utils/toolsConfig';

export type ToolTab = 
  | 'overview' 
  | 'compressor' 
  | 'resizer' 
  | 'converter' 
  | 'calculator'
  | 'bg-remover'
  | 'upscaler'
  | 'vectorizer'
  | 'pdf-tool';

export default function Tools() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toolsConfig, setToolsConfig] = useState<ToolItemConfig[]>(getToolsConfig());
  const [switchMenuOpen, setSwitchMenuOpen] = useState(false);
  const switchMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setToolsConfig(getToolsConfig());
    };
    window.addEventListener('samaxon_tools_status_updated', handleUpdate);
    return () => window.removeEventListener('samaxon_tools_status_updated', handleUpdate);
  }, []);

  // Close switch menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switchMenuRef.current && !switchMenuRef.current.contains(e.target as Node)) {
        setSwitchMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine active tab based on pathname or query
  const getTabFromPath = (): ToolTab => {
    if (location.pathname.includes('/tools/compressor')) return 'compressor';
    if (location.pathname.includes('/tools/resizer')) return 'resizer';
    if (location.pathname.includes('/tools/converter')) return 'converter';
    if (location.pathname.includes('/tools/calculator')) return 'calculator';
    if (location.pathname.includes('/tools/bg-remover')) return 'bg-remover';
    if (location.pathname.includes('/tools/upscaler')) return 'upscaler';
    if (location.pathname.includes('/tools/vectorizer')) return 'vectorizer';
    if (location.pathname.includes('/tools/pdf-tool')) return 'pdf-tool';

    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as ToolTab;
    const validTabs: ToolTab[] = [
      'compressor', 'resizer', 'converter', 'calculator',
      'bg-remover', 'upscaler', 'vectorizer', 'pdf-tool'
    ];
    if (validTabs.includes(tabParam)) {
      return tabParam;
    }
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<ToolTab>(getTabFromPath());

  useEffect(() => {
    const onPopState = () => {
      setActiveTab(getTabFromPath());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
    setSwitchMenuOpen(false);
    const targetUrl = tab === 'overview' ? '/tools' : `/tools?tab=${tab}`;
    window.history.pushState(null, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentToolConfig = toolsConfig.find(t => t.id === activeTab);

  const getToolTitle = () => {
    if (currentToolConfig) return currentToolConfig.name;
    return 'Digital Utilities & AI Tools Suite';
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-28 sm:pt-32 pb-24 text-left" id="samaxon-tools-hub">
      <SEO
        title={
          activeTab === 'compressor'
            ? 'Free Photo Compressor (Reduce Size in KB & Quality) | SamaXon AI Tools'
            : activeTab === 'resizer'
            ? 'Free Photo Resizer (Passport, Visa & 300 DPI) | SamaXon AI Tools'
            : activeTab === 'converter'
            ? 'Universal Batch Image Converter (PNG, JPG, WEBP, AVIF, ICO) | SamaXon AI Tools'
            : activeTab === 'calculator'
            ? 'Universal Advanced Multi-Paradigm Calculator (Scientific, EMI, GST, Units) | SamaXon AI Tools'
            : activeTab === 'bg-remover'
            ? 'Free AI Background Remover Studio (Zero Server Uploads) | SamaXon AI Tools'
            : activeTab === 'upscaler'
            ? 'Free AI Image 4K Upscaler & Super-Resolution | SamaXon AI Tools'
            : activeTab === 'vectorizer'
            ? 'Free Raster to Scalable Vector SVG Converter | SamaXon AI Tools'
            : activeTab === 'pdf-tool'
            ? 'Free PDF Reducer & Verified Digital Signer (Unlimited MB) | SamaXon AI Tools'
            : 'Free Creator & Business Digital Tools Hub | SamaXon Studio'
        }
        description="Fast, 100% private, client-side digital tools. Compress images, upscale to 4K, remove backgrounds, convert to SVG, reduce heavy PDFs and affix digital signatures with zero server uploads."
        canonicalPath="/tools"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-5">
          <div className="flex items-center gap-2.5 text-sm font-mono text-[#554F49]">
            <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-[#D6B46A]" />
            <button 
              onClick={() => handleTabChange('overview')}
              className={`hover:text-[#111111] transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'text-[#111111] font-bold' : ''
              }`}
            >
              AI Tools Suite
            </button>
            {activeTab !== 'overview' && (
              <>
                <ChevronRight className="w-4 h-4 text-[#D6B46A]" />
                <span className="text-[#A68936] font-bold uppercase truncate max-w-[200px] sm:max-w-none">
                  {currentToolConfig?.shortName || getToolTitle()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 px-3.5 py-1.5 bg-[#D6B46A]/15 border border-[#D6B46A]/35 text-[#A68936] text-xs font-mono uppercase font-bold rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#A68936]" />
              100% Client-Side Privacy
            </span>
          </div>
        </div>

        {/* View Header: Overview vs Active Tool */}
        {activeTab === 'overview' ? (
          <div className="max-w-3xl space-y-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
                SMR CREATOR & BUSINESS LABS
              </span>
              <span className="text-sm font-mono text-[#554F49]">· Zero Uploads · Free Forever</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tight">
              Digital Utilities & AI Tools Suite
            </h1>

            <p className="text-base sm:text-lg text-[#3D3731] leading-relaxed font-normal">
              Engineered for founders, developers, creators, and applicants who demand world-class digital tools without intrusive ads, watermarks, or security leaks.
            </p>
          </div>
        ) : (
          /* Active Tool Top Action Bar: Back to Tools + Switch Tool Dropdown */
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTabChange('overview')}
                className="group flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] border border-[#D6B46A]/40 rounded-2xl text-xs font-mono uppercase font-bold cursor-pointer transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>All Tools</span>
              </button>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#A68936] tracking-widest block">
                  Studio Tool
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-[#111111]">
                  {getToolTitle()}
                </h2>
              </div>
            </div>

            {/* Quick Tool Switcher Dropdown */}
            <div className="relative" ref={switchMenuRef}>
              <button
                type="button"
                onClick={() => setSwitchMenuOpen(prev => !prev)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/35 text-[#111111] rounded-2xl text-xs font-mono font-bold cursor-pointer transition-all"
              >
                <LayoutGrid className="w-4 h-4 text-[#A68936]" />
                <span>Switch Tool</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8A8178] transition-transform ${switchMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {switchMenuOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 max-w-[calc(100vw-2.5rem)] bg-white border border-[#D6B46A]/30 rounded-2xl shadow-2xl py-2 z-50 text-left">
                  <div className="px-3.5 py-1.5 border-b border-neutral-100 text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold">
                    Select a Studio Tool
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {toolsConfig.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTabChange(t.id)}
                        className={`w-full px-3.5 py-2.5 text-xs font-mono flex items-center justify-between hover:bg-[#FFFDF8] cursor-pointer transition-colors ${
                          activeTab === t.id ? 'bg-[#D6B46A]/15 text-[#111111] font-bold' : 'text-[#554F49]'
                        }`}
                      >
                        <span className="truncate pr-2">{t.name}</span>
                        {t.enabled ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold shrink-0">Maintenance</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <ToolsOverview 
              onSelectTool={(tool) => handleTabChange(tool)} 
            />
          )}

          {/* Maintenance Guard for Individual Tools */}
          {activeTab !== 'overview' && currentToolConfig && !currentToolConfig.enabled ? (
            <div className="bg-white border border-amber-300 rounded-[32px] p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-mono uppercase font-bold rounded-full">
                  Under Scheduled Maintenance
                </span>
                <h3 className="font-display font-bold text-2xl text-[#111111]">
                  {currentToolConfig.name} is Temporarily Offline
                </h3>
                <p className="text-sm text-[#8A8178] leading-relaxed">
                  {currentToolConfig.maintenanceNotice || 'Our engineers are currently updating the client-side engine for this tool. It will be restored shortly.'}
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTabChange('overview')}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono uppercase font-bold cursor-pointer transition-all shadow-md"
                >
                  Explore Other Available Tools
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'pdf-tool' && (
                <PdfReducerSigner />
              )}

              {activeTab === 'bg-remover' && (
                <AiBackgroundRemover />
              )}

              {activeTab === 'upscaler' && (
                <AiImageUpscaler />
              )}

              {activeTab === 'vectorizer' && (
                <VectorSvgConverter />
              )}

              {activeTab === 'converter' && (
                <ImageConverter />
              )}

              {activeTab === 'calculator' && (
                <UniversalCalculator />
              )}

              {activeTab === 'compressor' && (
                <PhotoCompressor />
              )}

              {activeTab === 'resizer' && (
                <PhotoResizer />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
