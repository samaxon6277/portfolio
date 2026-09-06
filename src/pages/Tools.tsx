import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Minimize2, Crop, Sparkles, LayoutGrid, ArrowLeft, 
  ShieldCheck, Zap, Lock, Star, ChevronRight 
} from 'lucide-react';
import SEO from '../components/SEO';
import PhotoCompressor from '../components/tools/PhotoCompressor';
import PhotoResizer from '../components/tools/PhotoResizer';
import ToolsOverview from '../components/tools/ToolsOverview';

type ToolTab = 'overview' | 'compressor' | 'resizer';

export default function Tools() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on pathname or query
  const getTabFromPath = (): ToolTab => {
    if (location.pathname.includes('/tools/compressor')) return 'compressor';
    if (location.pathname.includes('/tools/resizer')) return 'resizer';
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'compressor' || tabParam === 'resizer') return tabParam;
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<ToolTab>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      navigate('/tools');
    } else {
      navigate(`/tools/${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-28 sm:pt-32 pb-24 text-left" id="samaxon-tools-hub">
      <SEO
        title={
          activeTab === 'compressor'
            ? 'Free Photo Compressor (Reduce Size in KB & Quality) | SamaXon AI Tools'
            : activeTab === 'resizer'
            ? 'Free Photo Resizer (Passport, Visa & 300 DPI) | SamaXon AI Tools'
            : 'Free Creator & Business Digital Tools Hub | SamaXon Studio'
        }
        description="Fast, 100% private, client-side digital tools. Compress images up to 95%, resize photos to exact dimensions or Indian/US Visa passport specs without uploading to any server."
        canonicalPath="/tools"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8178]">
            <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A]" />
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
                <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A]" />
                <span className="text-[#BFA15A] font-bold uppercase">
                  {activeTab === 'compressor' ? 'Photo Compressor' : 'Photo Resizer'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#D6B46A]/10 border border-[#D6B46A]/30 text-[#BFA15A] text-[10px] font-mono uppercase font-bold rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA15A]" />
              100% Client-Side Privacy
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 bg-[#111111] text-[#D6B46A] text-[10px] font-mono uppercase tracking-widest font-bold rounded-md">
              SMR CREATOR & BUSINESS LABS
            </span>
            <span className="text-xs font-mono text-[#8A8178]">· Zero Uploads · Free Forever</span>
          </div>

          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-[#111111] tracking-tight">
            {activeTab === 'compressor'
              ? 'Ultra-Fast Photo Compressor'
              : activeTab === 'resizer'
              ? 'Precision Photo Resizer & Transformer'
              : 'Digital Utilities & AI Tools Suite'}
          </h1>

          <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
            {activeTab === 'compressor'
              ? 'Reduce JPG, PNG, WEBP and AVIF image sizes by up to 95% while preserving pristine pixel clarity. Compare with an interactive split slider or target exact file sizes in KB.'
              : activeTab === 'resizer'
              ? 'Resize, crop, and convert images to exact pixels, cm, mm, or inches at 300 DPI. Includes one-click Indian & US Passport/Visa standards and creator social media crops.'
              : 'Engineered for founders, developers, creators, and applicants who demand world-class digital tools without intrusive ads, watermarks, or security leaks.'}
          </p>
        </div>

        {/* Tab Navigation Segmented Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#D6B46A]/25 rounded-2xl w-fit shadow-xs">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#8A8178] hover:text-[#111111]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Tools</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('compressor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'compressor'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#8A8178] hover:text-[#111111]'
            }`}
          >
            <Minimize2 className="w-4 h-4" />
            <span>Photo Compressor</span>
            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] rounded font-extrabold">
              NEW
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('resizer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'resizer'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#8A8178] hover:text-[#111111]'
            }`}
          >
            <Crop className="w-4 h-4" />
            <span>Photo Resizer</span>
            <span className="px-1.5 py-0.5 bg-[#D6B46A]/20 text-[#BFA15A] text-[9px] rounded font-extrabold">
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
