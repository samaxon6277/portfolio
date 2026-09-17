import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  Sparkles, 
  Search,
  Command,
  LayoutGrid,
  Layers,
  Cpu,
  Terminal,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { TOOL_CATEGORIES, getAllCatalogTools, ToolCategory, CatalogTool } from '../../data/toolsCatalog';
import { getToolsConfig, ToolItemConfig } from '../../utils/toolsConfig';
import { CategoryCard } from './CategoryCard';
import { ToolCard } from './common/ToolCard';
import { CommandPalette } from './common/CommandPalette';

interface ToolsOverviewProps {
  onSelectTool?: (toolId: any) => void;
}

export default function ToolsOverview({ onSelectTool }: ToolsOverviewProps) {
  const [toolsConfig, setToolsConfig] = useState<ToolItemConfig[]>(getToolsConfig());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tools' | 'categories'>('tools');

  useEffect(() => {
    const handleUpdate = () => {
      setToolsConfig(getToolsConfig());
    };
    window.addEventListener('samaxon_tools_status_updated', handleUpdate);
    return () => window.removeEventListener('samaxon_tools_status_updated', handleUpdate);
  }, []);

  // Global Keyboard Listener for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // All catalog tools
  const allTools = useMemo(() => getAllCatalogTools(), []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      // Category match
      if (selectedCategory !== 'all' && tool.categoryId !== selectedCategory) {
        return false;
      }
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tool.name.toLowerCase().includes(q) || tool.shortName.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesBadge = tool.badge?.toLowerCase().includes(q);
        const matchesPills = tool.featurePills?.some(p => p.toLowerCase().includes(q));
        return matchesName || matchesDesc || matchesBadge || matchesPills;
      }
      return true;
    });
  }, [allTools, selectedCategory, searchQuery]);

  // Compute live available tool count for each category
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOL_CATEGORIES.forEach(category => {
      const count = category.toolIds.filter(toolId => {
        const config = toolsConfig.find(t => t.id === toolId);
        return config ? config.enabled : true;
      }).length;
      counts[category.id] = count;
    });
    return counts;
  }, [toolsConfig]);

  // Active category object
  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return TOOL_CATEGORIES.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-10 sm:space-y-12 text-left" id="tools-overview-workspace">
      {/* Command Palette Modal */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      {/* Digital Instrument OS HUD Header */}
      <section 
        aria-label="Digital Instrument OS HUD" 
        className="relative rounded-3xl bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/35 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden"
      >
        {/* Subtle instrument background grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(#D6B46A 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Telemetry Status Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D6B46A]/15 text-[#D6B46A] border border-[#D6B46A]/30 font-bold uppercase tracking-wider text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SAMAXON TOOL OS · v3.3
              </span>
              <span className="text-neutral-400 text-[11px] hidden sm:inline">
                {allTools.length} Live Instruments · 100% In-Browser Execution
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              TOOLS
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Precision digital instruments for engineers, designers, creators, and analysts. Real-time client-side computation with zero server storage.
            </p>
          </div>

          {/* Quick Search & Command Palette Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 hover:border-[#D6B46A]/60 transition-all cursor-pointer shadow-inner group active:scale-95"
            >
              <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-400 group-hover:text-neutral-200">
                <Search className="w-4 h-4 text-[#D6B46A]" />
                <span>Search instruments...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                <Command className="w-3 h-3" />
                K
              </kbd>
            </button>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-2xl bg-neutral-900 p-1 border border-neutral-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('tools')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'tools'
                    ? 'bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>All Tools ({allTools.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('categories')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'categories'
                    ? 'bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Categories ({TOOL_CATEGORIES.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Discovery Section */}
      {viewMode === 'tools' ? (
        <div className="space-y-6">
          {/* Controls Bar: In-page filter & Category Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FFFDF8] p-4 rounded-2xl border border-neutral-200 shadow-xs">
            {/* In-page live query search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tools by name, feature, or keyword..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#D6B46A] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results count & quick reset */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-mono">
              <span className="text-neutral-500">
                Showing <strong className="text-[#111111]">{filteredTools.length}</strong> of {allTools.length} tools
              </span>
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#85641C] hover:underline cursor-pointer font-bold"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#111111] text-[#D6B46A] font-bold shadow-xs'
                  : 'bg-[#FFFDF8] text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              All Instruments ({allTools.length})
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-[#D6B46A] font-bold shadow-xs'
                    : 'bg-[#FFFDF8] text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat.name} ({toolCounts[cat.id] ?? cat.toolIds.length})
              </button>
            ))}
          </div>

          {/* Active Category Banner if filtered */}
          {activeCategoryObj && (
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono font-bold text-[#85641C] uppercase text-[10px] tracking-wider block">
                  Category Selected
                </span>
                <h2 className="font-display font-bold text-base text-[#111111]">
                  {activeCategoryObj.name}
                </h2>
                <p className="text-neutral-600 mt-0.5">{activeCategoryObj.shortDescription}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono text-xs font-bold cursor-pointer transition-colors"
              >
                Clear Category
              </button>
            </div>
          )}

          {/* Tool Cards Grid */}
          {filteredTools.length === 0 ? (
            <div className="bg-[#FFFDF8] border border-neutral-200 rounded-3xl p-12 text-center space-y-4">
              <Terminal className="w-10 h-10 text-neutral-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#111111]">No matching tools found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  No digital instruments matched your filter "{searchQuery}". Try a different keyword or reset filters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold rounded-xl cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                Show All Tools
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => onSelectTool?.(tool.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Categories View */
        <section aria-label="Tool Categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {TOOL_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                availableToolCount={toolCounts[category.id] ?? category.toolIds.length}
              />
            ))}
          </div>
        </section>
      )}

      {/* Supporting Architecture & Client-Side Sandbox Guarantee */}
      <section 
        aria-label="Client-Side Privacy Guarantee" 
        className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#111111]">
                100% In-Browser Privacy
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tools run directly in your local browser sandbox. Your tokens, regex expressions, code, and images never touch external servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#111111]">
                Zero Upload Latency
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Instant execution powered by Web Crypto, Canvas, and browser DOM APIs with sub-millisecond responsiveness.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#111111]">
                No Logins or Paywalls
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Open, unrestricted access to all digital instruments with zero marketing traps, watermarks, or account walls.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
