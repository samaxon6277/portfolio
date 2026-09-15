import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Wrench, 
  Layers, 
  Code2, 
  Sliders, 
  Palette, 
  SearchCode, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Info,
  Terminal,
  FileText,
  FileEdit,
  TrendingUp,
  Minimize2,
  Crop,
  RefreshCw,
  Wand2,
  Image as ImageIcon,
  QrCode,
  Share2,
  Gauge,
  Link2,
  Network,
  GitCompare,
  FileCheck,
  KeyRound,
  Calendar,
  Calculator,
  Smartphone,
  CheckSquare,
  LucideIcon
} from 'lucide-react';
import { ToolCategory, CatalogTool, getAllCategories, getToolsForCategory } from '../../data/toolsCatalog';
import { ToolItemConfig, getToolsConfig } from '../../utils/toolsConfig';
import SEO from '../SEO';
import { generateCategoryBreadcrumbSchema, generateCategoryCollectionSchema } from '../../data/toolsCatalog';

// Map icon strings to Lucide components
const TOOL_ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Sliders,
  Palette,
  Sparkles,
  SearchCode,
  Layers,
  Clock,
  Terminal,
  FileText,
  FileEdit,
  TrendingUp,
  Minimize2,
  Crop,
  RefreshCw,
  Wand2,
  ImageIcon,
  Lock,
  QrCode,
  Share2,
  Gauge,
  Link2,
  Network,
  GitCompare,
  FileCheck,
  KeyRound,
  Calendar,
  Calculator,
  Smartphone,
  CheckSquare,
  ShieldCheck,
};

interface CategoryDetailViewProps {
  category: ToolCategory;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category }) => {
  const navigate = useNavigate();
  const tools = getToolsForCategory(category.id);
  const runtimeConfigs = getToolsConfig();

  // Create lookup for admin enablement status
  const configMap = React.useMemo(() => {
    const map = new Map<string, ToolItemConfig>();
    runtimeConfigs.forEach(c => map.set(c.id, c));
    return map;
  }, [runtimeConfigs]);

  const allCategories = getAllCategories();
  const otherCategories = allCategories.filter(c => c.id !== category.id);

  // SEO Schemas
  const breadcrumbSchema = generateCategoryBreadcrumbSchema(category);
  const collectionSchema = generateCategoryCollectionSchema(category, tools);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={category.seoTitle}
        description={category.seoDescription}
        canonicalPath={`/tools/category/${category.slug}`}
        keywords={category.seoKeywords}
        schemas={[breadcrumbSchema, collectionSchema]}
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation Breadcrumbs & Back Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#736B63] overflow-x-auto py-1">
            <Link 
              to="/" 
              className="hover:text-[#111111] transition-colors flex items-center gap-1 shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A3998E] shrink-0" />
            <Link 
              to="/tools" 
              className="hover:text-[#111111] font-bold text-[#8A6D3B] transition-colors shrink-0"
            >
              TOOLS
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A3998E] shrink-0" />
            <span className="font-bold text-[#111111] shrink-0">
              {category.name}
            </span>
          </nav>

          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/5 hover:bg-[#111111] text-[#111111] hover:text-[#D6B46A] border border-[#D6B46A]/25 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Categories
          </Link>
        </div>

        {/* Category Header Banner */}
        <header className="bg-[#FFFDF8] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#D6B46A]/30 shadow-[0_4px_24px_rgba(17,17,17,0.03)] relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Category
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/5 border border-[#D6B46A]/30 text-xs font-mono font-bold text-[#8A6D3B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                {tools.length} Practical {tools.length === 1 ? 'Tool' : 'Tools'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6B46A]/15 text-xs font-mono font-bold text-[#634E27]">
                <Lock className="w-3 h-3" />
                100% Client-Side Privacy
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-[#111111] tracking-tight">
              {category.name}
            </h1>

            <p className="text-base sm:text-lg text-[#554F49] leading-relaxed max-w-3xl font-sans">
              {category.shortDescription}
            </p>

            <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed max-w-3xl pt-1">
              {category.purpose}
            </p>
          </div>

          {/* Decorative ambient gold glow */}
          <div 
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#D6B46A]/20 to-transparent blur-3xl pointer-events-none" 
            aria-hidden="true" 
          />
        </header>

        {/* Tools Grid Section */}
        <section aria-labelledby="category-tools-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 id="category-tools-heading" className="text-xl sm:text-2xl font-bold font-display text-[#111111]">
                Available Tools in {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#736B63] font-mono mt-1">
                Select any tool below to launch it instantly in your browser sandbox.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const runtimeConfig = configMap.get(tool.id);
              const isEnabled = runtimeConfig ? runtimeConfig.enabled : true;
              const IconComp = TOOL_ICON_MAP[tool.iconName] || Wrench;

              return (
                <article
                  key={tool.id}
                  id={`tool-card-${tool.id}`}
                  className="group relative flex flex-col justify-between p-6 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25 hover:border-[#D6B46A] shadow-[0_2px_12px_rgba(17,17,17,0.02)] hover:shadow-[0_8px_24px_rgba(214,180,106,0.16)] transition-all duration-300 overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:scale-105 transition-transform shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEnabled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-mono font-bold text-amber-700">
                            <AlertTriangle className="w-3 h-3" />
                            Maintenance
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tool Name & Badge */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A6D3B] font-bold">
                        {tool.badge}
                      </span>
                      <h3 className="text-lg font-bold font-display text-[#111111] group-hover:text-[#8A6D3B] transition-colors leading-snug mt-0.5">
                        {tool.name}
                      </h3>
                    </div>

                    {/* Tool Practical Description */}
                    <p className="text-xs sm:text-sm text-[#554F49] leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tool.featurePills.map((pill, pIdx) => (
                        <span 
                          key={pIdx} 
                          className="inline-flex items-center text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-[#443E38] border border-neutral-200/60"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-6 mt-4 border-t border-[#D6B46A]/15 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#8A8178]">
                      {tool.footerBadge}
                    </span>

                    <Link
                      to={tool.route}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold transition-all shadow-sm group-hover:shadow hover:scale-[1.02] cursor-pointer"
                      aria-label={`Open ${tool.name}`}
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Related Categories Navigation */}
        <section aria-labelledby="other-categories-heading" className="pt-8 border-t border-[#D6B46A]/20 space-y-5">
          <div className="flex items-center justify-between">
            <h2 id="other-categories-heading" className="text-lg sm:text-xl font-bold font-display text-[#111111]">
              Explore Other Categories
            </h2>
            <Link 
              to="/tools" 
              className="text-xs font-mono font-bold text-[#8A6D3B] hover:text-[#111111] inline-flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherCategories.map((otherCat) => (
              <Link
                key={otherCat.id}
                to={`/tools/category/${otherCat.slug}`}
                className="p-4 rounded-xl bg-[#FFFDF8] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:bg-[#FAF6EC] transition-all flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold font-display text-[#111111] group-hover:text-[#8A6D3B] transition-colors">
                    {otherCat.name}
                  </h3>
                  <p className="text-[11px] font-mono text-[#736B63] mt-0.5">
                    {otherCat.toolIds.length} Tools Available
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A3998E] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Compact SEO & Educational Footnote */}
        <footer className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/20 text-xs text-[#736B63] space-y-3">
          <div className="flex items-center gap-2 text-[#8A6D3B] font-mono font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Server Footprint & Client-Side Privacy Guarantee</span>
          </div>
          <p className="leading-relaxed">
            All tools in the <strong>{category.name}</strong> category operate directly inside your browser using modern WebAssembly, Canvas API, and HTML5 sandbox architectures. Your files, documents, code payloads, and credentials never upload to third-party servers or leave your local machine.
          </p>
        </footer>
      </div>
    </div>
  );
};
