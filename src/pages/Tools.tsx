import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Minimize2, Crop, Sparkles, LayoutGrid, ArrowLeft, 
  ShieldCheck, Zap, Lock, Star, ChevronRight, RefreshCw, Calculator 
} from 'lucide-react';
import SEO from '../components/SEO';
import PhotoCompressor from '../components/tools/PhotoCompressor';
import PhotoResizer from '../components/tools/PhotoResizer';
import ImageConverter from '../components/tools/ImageConverter';
import UniversalCalculator from '../components/tools/UniversalCalculator';
import ToolsOverview from '../components/tools/ToolsOverview';

type ToolTab = 'overview' | 'compressor' | 'resizer' | 'converter' | 'calculator';

export default function Tools() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on pathname or query
  const getTabFromPath = (): ToolTab => {
    if (location.pathname.includes('/tools/compressor')) return 'compressor';
    if (location.pathname.includes('/tools/resizer')) return 'resizer';
    if (location.pathname.includes('/tools/converter')) return 'converter';
    if (location.pathname.includes('/tools/calculator')) return 'calculator';
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'compressor' || tabParam === 'resizer' || tabParam === 'converter' || tabParam === 'calculator') {
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
    const targetUrl = tab === 'overview' ? '/tools' : `/tools?tab=${tab}`;
    window.history.pushState(null, '', targetUrl);
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
            : 'Free Creator & Business Digital Tools Hub | SamaXon Studio'
        }
        description="Fast, 100% private, client-side digital tools. Compress images up to 95%, convert formats, resize photos to exact dimensions, and solve complex scientific, financial and unit calculations with zero uploads."
        canonicalPath="/tools"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
                <span className="text-[#A68936] font-bold uppercase">
                  {activeTab === 'compressor' ? 'Photo Compressor' : 
                   activeTab === 'resizer' ? 'Photo Resizer' : 
                   activeTab === 'converter' ? 'Image Converter' : 'Universal Calculator'}
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

        {/* Hero Section */}
        <div className="max-w-3xl space-y-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
              SMR CREATOR & BUSINESS LABS
            </span>
            <span className="text-sm font-mono text-[#554F49]">· Zero Uploads · Free Forever</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tight">
            {activeTab === 'compressor'
              ? 'Ultra-Fast Photo Compressor'
              : activeTab === 'resizer'
              ? 'Precision Photo Resizer & Transformer'
              : activeTab === 'converter'
              ? 'Universal Batch Image Converter'
              : activeTab === 'calculator'
              ? 'Universal Multi-Paradigm Calculator'
              : 'Digital Utilities & AI Tools Suite'}
          </h1>

          <p className="text-base sm:text-lg text-[#3D3731] leading-relaxed font-normal">
            {activeTab === 'compressor'
              ? 'Reduce JPG, PNG, WEBP and AVIF image sizes by up to 95% while preserving pristine pixel clarity. Compare with an interactive split slider or target exact file sizes in KB.'
              : activeTab === 'resizer'
              ? 'Resize, crop, and convert images to exact pixels, cm, mm, or inches at 300 DPI. Includes one-click Indian & US Passport/Visa standards and creator social media crops.'
              : activeTab === 'converter'
              ? 'Convert PNG, JPG, WEBP, AVIF, BMP, GIF, and ICO formats instantly in your browser. Batch processing with 1-click ZIP export and customizable quality.'
              : activeTab === 'calculator'
              ? 'Master calculation engine featuring full scientific trigonometry & calculus, bank loan EMI & GST planners, SIP compound wealth forecaster, unit converter, and programmer base systems.'
              : 'Engineered for founders, developers, creators, and applicants who demand world-class digital tools without intrusive ads, watermarks, or security leaks.'}
          </p>
        </div>

        {/* Tab Navigation Segmented Bar */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-white border border-[#D6B46A]/30 rounded-2xl w-fit shadow-xs">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Tools</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('converter')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'converter'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Image Converter</span>
            <span className="px-2 py-0.5 bg-[#D6B46A]/25 text-[#A68936] text-[10px] rounded font-bold">
              BATCH
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Universal Calculator</span>
            <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 text-[10px] rounded font-bold">
              PRO
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('compressor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'compressor'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
            }`}
          >
            <Minimize2 className="w-4 h-4" />
            <span>Photo Compressor</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('resizer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'resizer'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
            }`}
          >
            <Crop className="w-4 h-4" />
            <span>Photo Resizer</span>
            <span className="px-2 py-0.5 bg-[#D6B46A]/25 text-[#A68936] text-[10px] rounded font-bold">
              300 DPI
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <ToolsOverview 
              onSelectTool={(tool) => handleTabChange(tool)} 
            />
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
        </div>
      </div>
    </div>
  );
}

