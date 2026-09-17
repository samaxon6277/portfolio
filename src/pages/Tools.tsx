import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Minimize2, Crop, Sparkles, LayoutGrid, ArrowLeft, 
  ShieldCheck, Zap, Lock, ChevronRight, RefreshCw, Calculator,
  Wand2, FileText, Image as ImageIcon, ChevronDown, AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import ToolsOverview from '../components/tools/ToolsOverview';
import { CategoryDetailView } from '../components/tools/CategoryDetailView';
import { getCategoryBySlug, getCategoryForTool } from '../data/toolsCatalog';
import { getToolsConfig, ToolItemConfig } from '../utils/toolsConfig';
import { 
  getToolSeoMetadata, 
  generateToolJsonLdSchema, 
  generateToolFaqSchema, 
  generateToolHowToSchema 
} from '../data/toolsSeoKeywords';

// Code-split all heavy tool engines so they only load on demand
const PhotoCompressor = React.lazy(() => import('../components/tools/PhotoCompressor'));
const PhotoResizer = React.lazy(() => import('../components/tools/PhotoResizer'));
const ImageConverter = React.lazy(() => import('../components/tools/ImageConverter'));
const UniversalCalculator = React.lazy(() => import('../components/tools/UniversalCalculator'));
const PdfReducerSigner = React.lazy(() => import('../components/tools/PdfReducerSigner'));
const AiBackgroundRemover = React.lazy(() => import('../components/tools/AiBackgroundRemover'));
const AiImageUpscaler = React.lazy(() => import('../components/tools/AiImageUpscaler'));
const VectorSvgConverter = React.lazy(() => import('../components/tools/VectorSvgConverter'));
const WebsiteAnalyzer = React.lazy(() => import('../components/tools/WebsiteAnalyzer'));
const WebsiteSeoAudit = React.lazy(() => import('../components/tools/WebsiteSeoAudit'));
const WebsiteSpeedChecker = React.lazy(() => import('../components/tools/WebsiteSpeedChecker'));
const AiProjectBriefGenerator = React.lazy(() => import('../components/tools/AiProjectBriefGenerator'));
const WebsiteRoiCalculator = React.lazy(() => import('../components/tools/WebsiteRoiCalculator'));
const QrCodeGenerator = React.lazy(() => import('../components/tools/QrCodeGenerator'));
const BusinessNameGenerator = React.lazy(() => import('../components/tools/BusinessNameGenerator'));
const InvoiceGenerator = React.lazy(() => import('../components/tools/InvoiceGenerator'));
const CanonicalUrlValidator = React.lazy(() => import('../components/tools/CanonicalUrlValidator'));
const ApiRequestBuilder = React.lazy(() => import('../components/tools/ApiRequestBuilder'));
const ClientDiscoveryQuestionnaire = React.lazy(() => import('../components/tools/ClientDiscoveryQuestionnaire'));
const PdfTools = React.lazy(() => import('../components/tools/PdfTools'));
const PdfToWordConverter = React.lazy(() => import('../components/tools/PdfToWordConverter'));
const PasswordGenerator = React.lazy(() => import('../components/tools/PasswordGenerator'));
const WordCounter = React.lazy(() => import('../components/tools/WordCounter'));
const AgeCalculator = React.lazy(() => import('../components/tools/AgeCalculator'));
const JsonFormatterValidator = React.lazy(() => import('../components/tools/JsonFormatterValidator'));
const UtmCampaignUrlBuilder = React.lazy(() => import('../components/tools/UtmCampaignUrlBuilder'));
const TimeZoneConverter = React.lazy(() => import('../components/tools/TimeZoneConverter'));
const TextDiffChecker = React.lazy(() => import('../components/tools/TextDiffChecker'));
const UrlEncoderDecoder = React.lazy(() => import('../components/tools/UrlEncoderDecoder'));
const ImageSteganography = React.lazy(() => import('../components/tools/ImageSteganography'));
const WebsiteLaunchReadinessChecker = React.lazy(() => import('../components/tools/WebsiteLaunchReadinessChecker'));
const WebsiteProjectScopeBuilder = React.lazy(() => import('../components/tools/WebsiteProjectScopeBuilder'));
const DesignSystemGenerator = React.lazy(() => import('../components/tools/DesignSystemGenerator'));
const WebsiteAccessibilityAuditor = React.lazy(() => import('../components/tools/WebsiteAccessibilityAuditor'));
const WebsiteContentBriefGenerator = React.lazy(() => import('../components/tools/WebsiteContentBriefGenerator'));
const OpenGraphPreviewDesigner = React.lazy(() => import('../components/tools/OpenGraphPreviewDesigner'));
const InternalLinkPlanner = React.lazy(() => import('../components/tools/InternalLinkPlanner'));
const ResponsiveBreakpointTester = React.lazy(() => import('../components/tools/ResponsiveBreakpointTester'));
const SeoCompetitorGapAnalyzer = React.lazy(() => import('../components/tools/SeoCompetitorGapAnalyzer'));
const WebsitePrivacyInformationBuilder = React.lazy(() => import('../components/tools/WebsitePrivacyInformationBuilder'));

// 10 Production-Ready SamaXon Suite Tools
const GlassmorphismNeumorphismGenerator = React.lazy(() => import('../components/tools/GlassmorphismNeumorphismGenerator'));
const SvgOptimizer = React.lazy(() => import('../components/tools/SvgOptimizer'));
const CronGenerator = React.lazy(() => import('../components/tools/CronGenerator'));
const RegexTester = React.lazy(() => import('../components/tools/RegexTester'));
const MarkdownToHtml = React.lazy(() => import('../components/tools/MarkdownToHtml'));
const JwtDebugger = React.lazy(() => import('../components/tools/JwtDebugger'));
const FaviconGenerator = React.lazy(() => import('../components/tools/FaviconGenerator'));
const WhatsAppLinkGenerator = React.lazy(() => import('../components/tools/WhatsAppLinkGenerator'));
const CssAnimationBuilder = React.lazy(() => import('../components/tools/CssAnimationBuilder'));
const ColorContrastChecker = React.lazy(() => import('../components/tools/ColorContrastChecker'));

function ToolLoadingSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#D6B46A]/20 rounded-[32px] p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-[#D6B46A]/15 mx-auto flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-[#D6B46A]/60 animate-spin" />
      </div>
      <div className="h-5 bg-neutral-200 rounded-full w-48 mx-auto" />
      <div className="h-3 bg-neutral-100 rounded-full w-64 mx-auto" />
    </div>
  );
}

export type ToolTab = 
  | 'overview' 
  | 'website-launch-readiness'
  | 'website-project-scope-builder'
  | 'design-system-generator'
  | 'website-accessibility-auditor'
  | 'website-content-brief-generator'
  | 'open-graph-preview-designer'
  | 'internal-link-planner'
  | 'responsive-breakpoint-tester'
  | 'seo-competitor-gap-analyzer'
  | 'website-privacy-policy-builder'
  | 'canonical-url-validator'
  | 'api-request-builder'
  | 'client-discovery-questionnaire'
  | 'pdf-tools'
  | 'pdf-to-word-converter'
  | 'password-generator'
  | 'word-counter'
  | 'age-calculator'
  | 'json-formatter-validator'
  | 'utm-campaign-url-builder'
  | 'time-zone-converter'
  | 'text-diff-checker'
  | 'url-encoder-decoder'
  | 'image-steganography'
  | 'analyzer'
  | 'website-seo-audit'
  | 'website-speed-checker'
  | 'website-project-brief'
  | 'roi-calculator'
  | 'qr-generator'
  | 'business-name-generator'
  | 'invoice-generator'
  | 'compressor' 
  | 'resizer' 
  | 'converter' 
  | 'calculator'
  | 'bg-remover'
  | 'upscaler'
  | 'vectorizer'
  | 'pdf-tool'
  | 'glassmorphism-neumorphism-generator'
  | 'svg-optimizer'
  | 'cron-generator'
  | 'regex-tester'
  | 'markdown-to-html'
  | 'jwt-debugger'
  | 'favicon-generator'
  | 'whatsapp-link-generator'
  | 'css-animation-builder'
  | 'color-contrast-checker';

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

  const { toolId, categoryId } = useParams<{ toolId?: string; categoryId?: string }>();

  // Determine if URL is targeting a category view
  const categorySlug = categoryId || (
    location.pathname.startsWith('/tools/category/')
      ? location.pathname.replace('/tools/category/', '').split('/')[0].split('?')[0]
      : null
  );

  const matchedCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;

  // Determine active tab based on pathname or query
  const getTabFromPath = (): ToolTab => {
    const validTabs: ToolTab[] = [
      'website-launch-readiness', 'website-project-scope-builder', 'design-system-generator',
      'website-accessibility-auditor', 'website-content-brief-generator', 'open-graph-preview-designer',
      'internal-link-planner', 'responsive-breakpoint-tester', 'seo-competitor-gap-analyzer',
      'website-privacy-policy-builder',
      'canonical-url-validator', 'api-request-builder', 'client-discovery-questionnaire',
      'pdf-tools', 'pdf-to-word-converter', 'password-generator', 'word-counter', 'age-calculator',
      'json-formatter-validator', 'utm-campaign-url-builder', 'time-zone-converter', 'text-diff-checker', 'url-encoder-decoder',
      'image-steganography',
      'website-seo-audit', 'website-speed-checker', 'website-project-brief',
      'roi-calculator', 'qr-generator', 'business-name-generator', 'invoice-generator',
      'analyzer', 'compressor', 'resizer', 'converter', 'calculator',
      'bg-remover', 'upscaler', 'vectorizer', 'pdf-tool',
      'glassmorphism-neumorphism-generator', 'svg-optimizer', 'cron-generator', 'regex-tester',
      'markdown-to-html', 'jwt-debugger', 'favicon-generator', 'whatsapp-link-generator',
      'css-animation-builder', 'color-contrast-checker'
    ];

    if (toolId && validTabs.includes(toolId as ToolTab)) {
      return toolId as ToolTab;
    }

    if (location.pathname.includes('glassmorphism') || location.pathname.includes('neumorphism')) return 'glassmorphism-neumorphism-generator';
    if (location.pathname.includes('svg-optimizer') || location.pathname.includes('svg-minifier')) return 'svg-optimizer';
    if (location.pathname.includes('cron-generator') || location.pathname.includes('cron-explainer')) return 'cron-generator';
    if (location.pathname.includes('regex-tester') || location.pathname.includes('/tools/regex')) return 'regex-tester';
    if (location.pathname.includes('markdown-to-html') || location.pathname.includes('/tools/markdown')) return 'markdown-to-html';
    if (location.pathname.includes('jwt-debugger') || location.pathname.includes('jwt-decoder') || location.pathname.includes('/tools/jwt')) return 'jwt-debugger';
    if (location.pathname.includes('favicon-generator') || location.pathname.includes('/tools/favicon') || location.pathname.includes('app-icon-generator')) return 'favicon-generator';
    if (location.pathname.includes('whatsapp-link-generator') || location.pathname.includes('whatsapp-link') || location.pathname.includes('whatsapp-qr')) return 'whatsapp-link-generator';
    if (location.pathname.includes('css-animation-builder') || location.pathname.includes('css-animation') || location.pathname.includes('keyframe-generator')) return 'css-animation-builder';
    if (location.pathname.includes('color-contrast-checker') || location.pathname.includes('contrast-checker') || location.pathname.includes('wcag-contrast')) return 'color-contrast-checker';

    if (location.pathname.includes('/tools/website-launch-readiness') || location.pathname.includes('/tools/launch-readiness') || location.pathname === '/launch-readiness') return 'website-launch-readiness';
    if (location.pathname.includes('/tools/website-project-scope-builder') || location.pathname.includes('/tools/project-scope') || location.pathname === '/project-scope') return 'website-project-scope-builder';
    if (location.pathname.includes('/tools/design-system-generator') || location.pathname.includes('/tools/design-system') || location.pathname === '/design-system') return 'design-system-generator';
    if (location.pathname.includes('/tools/website-accessibility-auditor') || location.pathname.includes('/tools/accessibility-auditor') || location.pathname === '/accessibility-auditor') return 'website-accessibility-auditor';
    if (location.pathname.includes('/tools/website-content-brief-generator') || location.pathname.includes('/tools/content-brief') || location.pathname === '/content-brief') return 'website-content-brief-generator';
    if (location.pathname.includes('/tools/open-graph-preview-designer') || location.pathname.includes('/tools/open-graph') || location.pathname === '/open-graph') return 'open-graph-preview-designer';
    if (location.pathname.includes('/tools/internal-link-planner') || location.pathname.includes('/tools/internal-links') || location.pathname === '/internal-links') return 'internal-link-planner';
    if (location.pathname.includes('/tools/responsive-breakpoint-tester') || location.pathname.includes('/tools/responsive-tester') || location.pathname === '/responsive-tester') return 'responsive-breakpoint-tester';
    if (location.pathname.includes('/tools/seo-competitor-gap-analyzer') || location.pathname.includes('/tools/competitor-analyzer') || location.pathname === '/competitor-analyzer') return 'seo-competitor-gap-analyzer';
    if (location.pathname.includes('/tools/website-privacy-policy-builder') || location.pathname.includes('/tools/privacy-builder') || location.pathname === '/privacy-builder') return 'website-privacy-policy-builder';

    if (location.pathname.includes('/tools/canonical-url-validator') || location.pathname.includes('/tools/canonical-validator') || location.pathname === '/canonical-url-validator') return 'canonical-url-validator';
    if (location.pathname.includes('/tools/api-request-builder') || location.pathname.includes('/tools/api-builder') || location.pathname === '/api-request-builder') return 'api-request-builder';
    if (location.pathname.includes('/tools/client-discovery-questionnaire') || location.pathname.includes('/tools/client-discovery') || location.pathname === '/client-discovery') return 'client-discovery-questionnaire';
    if (location.pathname.includes('/tools/pdf-tools') || location.pathname.includes('/tools/pdf-tool') || location.pathname === '/pdf-tools' || location.pathname === '/tools/pdf-tool') return 'pdf-tools';
    if (location.pathname.includes('/tools/pdf-to-word-converter') || location.pathname.includes('/tools/pdf-to-word') || location.pathname === '/pdf-to-word') return 'pdf-to-word-converter';
    if (location.pathname.includes('/tools/password-generator') || location.pathname.includes('/tools/password') || location.pathname === '/password-generator') return 'password-generator';
    if (location.pathname.includes('/tools/word-counter') || location.pathname.includes('/tools/wordcount') || location.pathname === '/word-counter') return 'word-counter';
    if (location.pathname.includes('/tools/age-calculator') || location.pathname.includes('/tools/age') || location.pathname === '/age-calculator') return 'age-calculator';
    if (location.pathname.includes('/tools/json-formatter-validator') || location.pathname.includes('/tools/json-formatter') || location.pathname === '/tools/json-formatter' || location.pathname === '/tools/json-validator') return 'json-formatter-validator';
    if (location.pathname.includes('/tools/utm-campaign-url-builder') || location.pathname.includes('/tools/utm-builder') || location.pathname === '/tools/utm-builder') return 'utm-campaign-url-builder';
    if (location.pathname.includes('/tools/time-zone-converter') || location.pathname.includes('/tools/timezone-converter') || location.pathname === '/tools/timezone-converter') return 'time-zone-converter';
    if (location.pathname.includes('/tools/text-diff-checker') || location.pathname.includes('/tools/diff-checker') || location.pathname === '/tools/diff-checker') return 'text-diff-checker';
    if (location.pathname.includes('/tools/url-encoder-decoder') || location.pathname.includes('/tools/url-encoder') || location.pathname.includes('/tools/url-decoder')) return 'url-encoder-decoder';
    if (location.pathname.includes('/tools/image-steganography') || location.pathname.includes('/tools/steganography') || location.pathname === '/image-steganography' || location.pathname === '/steganography') return 'image-steganography';
    if (location.pathname.includes('/tools/website-seo-audit') || location.pathname.includes('/tools/seo-audit')) return 'website-seo-audit';
    if (location.pathname.includes('/tools/website-speed-checker') || location.pathname.includes('/tools/speed-checker')) return 'website-speed-checker';
    if (location.pathname.includes('/tools/website-project-brief') || location.pathname.includes('/tools/project-brief')) return 'website-project-brief';
    if (location.pathname.includes('/tools/roi-calculator') || location.pathname.includes('/tools/website-roi')) return 'roi-calculator';
    if (location.pathname.includes('/tools/qr-generator') || location.pathname.includes('/tools/qr-code')) return 'qr-generator';
    if (location.pathname.includes('/tools/business-name-generator') || location.pathname.includes('/tools/name-generator')) return 'business-name-generator';
    if (location.pathname.includes('/tools/invoice-generator') || location.pathname.includes('/tools/invoice')) return 'invoice-generator';
    if (location.pathname.includes('/tools/analyzer') || location.pathname === '/analyzer' || location.pathname === '/website-analyzer') return 'analyzer';
    if (location.pathname.includes('/tools/compressor') || location.pathname.includes('/tools/image-compressor')) return 'compressor';
    if (location.pathname.includes('/tools/resizer')) return 'resizer';
    if (location.pathname.includes('/tools/converter')) return 'converter';
    if (location.pathname.includes('/tools/calculator')) return 'calculator';
    if (location.pathname.includes('/tools/bg-remover')) return 'bg-remover';
    if (location.pathname.includes('/tools/upscaler')) return 'upscaler';
    if (location.pathname.includes('/tools/vectorizer')) return 'vectorizer';
    if (location.pathname.includes('/tools/pdf-tool')) return 'pdf-tool';

    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as ToolTab;
    if (validTabs.includes(tabParam)) {
      return tabParam;
    }
    return 'overview';
  };

  const activeTab = getTabFromPath();

  // If viewing a category detail page, render CategoryDetailView
  if (categorySlug) {
    if (matchedCategory) {
      return <CategoryDetailView category={matchedCategory} />;
    }
    return (
      <div className="min-h-screen bg-[#FFFDF8] pt-28 sm:pt-32 pb-24 text-left" id="samaxon-tools-category-not-found">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6 py-20">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center mx-auto border border-[#D6B46A]/30">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl text-[#111111]">Category Not Found</h1>
            <p className="text-sm text-[#554F49]">The requested tool category could not be located or may have been reorganized.</p>
          </div>
          <div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase font-bold hover:bg-[#222222] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore All Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: ToolTab) => {
    setSwitchMenuOpen(false);
    const targetUrl = tab === 'overview' ? '/tools' : `/tools/${tab}`;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate(targetUrl);
  };

  const currentToolConfig = toolsConfig.find(t => t.id === activeTab);
  const currentToolSeo = getToolSeoMetadata(activeTab);
  const toolSchemas = [
    generateToolJsonLdSchema(currentToolSeo),
    generateToolFaqSchema(currentToolSeo),
    generateToolHowToSchema(currentToolSeo)
  ];

  const getToolTitle = () => {
    if (currentToolConfig) return currentToolConfig.name;
    return 'Tools';
  };

  const toolCategory = activeTab !== 'overview' ? getCategoryForTool(activeTab) : null;

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-28 sm:pt-32 pb-24 text-left" id="samaxon-tools-hub">
      <SEO
        title={currentToolSeo.pageTitle}
        description={currentToolSeo.metaDescription}
        canonicalPath={currentToolSeo.urlPath}
        keywords={currentToolSeo.topMetaKeywords}
        schemas={toolSchemas}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#554F49] overflow-x-auto py-1">
            <Link to="/" className="hover:text-[#111111] transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-4 h-4 text-[#D6B46A] shrink-0" />
            <Link 
              to="/tools"
              className={`hover:text-[#111111] transition-colors shrink-0 ${
                activeTab === 'overview' ? 'text-[#111111] font-bold' : 'text-[#8A6D3B] font-bold'
              }`}
            >
              TOOLS
            </Link>
            {activeTab !== 'overview' && toolCategory && (
              <>
                <ChevronRight className="w-4 h-4 text-[#D6B46A] shrink-0" />
                <Link 
                  to={`/tools/category/${toolCategory.slug}`}
                  className="hover:text-[#111111] transition-colors shrink-0 max-w-[180px] sm:max-w-none truncate"
                >
                  {toolCategory.name}
                </Link>
              </>
            )}
            {activeTab !== 'overview' && (
              <>
                <ChevronRight className="w-4 h-4 text-[#D6B46A] shrink-0" />
                <span className="text-[#111111] font-bold uppercase truncate max-w-[180px] sm:max-w-none shrink-0">
                  {currentToolConfig?.shortName || getToolTitle()}
                </span>
              </>
            )}
          </nav>

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
              TOOLS
            </h1>

            <p className="text-base sm:text-lg text-[#3D3731] leading-relaxed font-normal">
              Explore practical tools for development, design, branding, SEO, and everyday digital work.
            </p>
          </div>
        ) : (
          /* Active Tool Top Action Bar: Back to Category/Tools + Switch Tool Dropdown */
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {toolCategory ? (
                <Link
                  to={`/tools/category/${toolCategory.slug}`}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] border border-[#D6B46A]/40 rounded-2xl text-xs font-mono uppercase font-bold cursor-pointer transition-all shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to {toolCategory.name}</span>
                </Link>
              ) : (
                <Link
                  to="/tools"
                  className="group flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] border border-[#D6B46A]/40 rounded-2xl text-xs font-mono uppercase font-bold cursor-pointer transition-all shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>All Tools</span>
                </Link>
              )}

              <Link
                to="/tools"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-100 text-[#554F49] border border-neutral-200 rounded-2xl text-xs font-mono transition-colors"
                title="View All Categories"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All Categories</span>
              </Link>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#A68936] tracking-widest block">
                  {toolCategory ? toolCategory.name : 'Studio Tool'}
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
            <React.Suspense fallback={<ToolLoadingSkeleton />}>
              {activeTab === 'website-launch-readiness' && (
                <WebsiteLaunchReadinessChecker />
              )}

              {activeTab === 'website-project-scope-builder' && (
                <WebsiteProjectScopeBuilder />
              )}

              {activeTab === 'design-system-generator' && (
                <DesignSystemGenerator />
              )}

              {activeTab === 'website-accessibility-auditor' && (
                <WebsiteAccessibilityAuditor />
              )}

              {activeTab === 'website-content-brief-generator' && (
                <WebsiteContentBriefGenerator />
              )}

              {activeTab === 'open-graph-preview-designer' && (
                <OpenGraphPreviewDesigner />
              )}

              {activeTab === 'internal-link-planner' && (
                <InternalLinkPlanner />
              )}

              {activeTab === 'responsive-breakpoint-tester' && (
                <ResponsiveBreakpointTester />
              )}

              {activeTab === 'seo-competitor-gap-analyzer' && (
                <SeoCompetitorGapAnalyzer />
              )}

              {activeTab === 'website-privacy-policy-builder' && (
                <WebsitePrivacyInformationBuilder />
              )}

              {activeTab === 'canonical-url-validator' && (
                <CanonicalUrlValidator />
              )}

              {activeTab === 'api-request-builder' && (
                <ApiRequestBuilder />
              )}

              {activeTab === 'client-discovery-questionnaire' && (
                <ClientDiscoveryQuestionnaire />
              )}

              {activeTab === 'pdf-tools' && (
                <PdfTools />
              )}

              {activeTab === 'pdf-to-word-converter' && (
                <PdfToWordConverter />
              )}

              {activeTab === 'password-generator' && (
                <PasswordGenerator />
              )}

              {activeTab === 'word-counter' && (
                <WordCounter />
              )}

              {activeTab === 'age-calculator' && (
                <AgeCalculator />
              )}

              {activeTab === 'json-formatter-validator' && (
                <JsonFormatterValidator />
              )}

              {activeTab === 'utm-campaign-url-builder' && (
                <UtmCampaignUrlBuilder />
              )}

              {activeTab === 'time-zone-converter' && (
                <TimeZoneConverter />
              )}

              {activeTab === 'text-diff-checker' && (
                <TextDiffChecker />
              )}

              {activeTab === 'url-encoder-decoder' && (
                <UrlEncoderDecoder />
              )}

              {activeTab === 'image-steganography' && (
                <ImageSteganography />
              )}

              {activeTab === 'website-seo-audit' && (
                <WebsiteSeoAudit />
              )}

              {activeTab === 'website-speed-checker' && (
                <WebsiteSpeedChecker />
              )}

              {activeTab === 'website-project-brief' && (
                <AiProjectBriefGenerator />
              )}

              {activeTab === 'roi-calculator' && (
                <WebsiteRoiCalculator />
              )}

              {activeTab === 'qr-generator' && (
                <QrCodeGenerator />
              )}

              {activeTab === 'business-name-generator' && (
                <BusinessNameGenerator />
              )}

              {activeTab === 'invoice-generator' && (
                <InvoiceGenerator />
              )}

              {activeTab === 'analyzer' && (
                <WebsiteAnalyzer />
              )}

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

              {activeTab === 'glassmorphism-neumorphism-generator' && (
                <GlassmorphismNeumorphismGenerator />
              )}

              {activeTab === 'svg-optimizer' && (
                <SvgOptimizer />
              )}

              {activeTab === 'cron-generator' && (
                <CronGenerator />
              )}

              {activeTab === 'regex-tester' && (
                <RegexTester />
              )}

              {activeTab === 'markdown-to-html' && (
                <MarkdownToHtml />
              )}

              {activeTab === 'jwt-debugger' && (
                <JwtDebugger />
              )}

              {activeTab === 'favicon-generator' && (
                <FaviconGenerator />
              )}

              {activeTab === 'whatsapp-link-generator' && (
                <WhatsAppLinkGenerator />
              )}

              {activeTab === 'css-animation-builder' && (
                <CssAnimationBuilder />
              )}

              {activeTab === 'color-contrast-checker' && (
                <ColorContrastChecker />
              )}
            </React.Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
