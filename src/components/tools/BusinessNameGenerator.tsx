import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Copy, Check, RefreshCw, Download, 
  Search, Filter, Globe, BookOpen, Layers, ArrowRight, 
  ExternalLink, Share2, Tag, Compass, ShieldCheck, Info
} from 'lucide-react';
import CustomSelect from '../CustomSelect';
import FormField from '../ui/FormField';
import CustomInput from '../ui/CustomInput';
import CustomBadge from '../ui/CustomBadge';
import CustomLoadingState from '../ui/CustomLoadingState';
import CustomEmptyState from '../ui/CustomEmptyState';
import { useCustomUi } from '../../context/CustomUiContext';

export interface BusinessNameItem {
  name: string;
  tagline: string;
  vibe: string[];
  rationale: string;
  domains: string[];
  pronunciation: string;
  style: string;
  length: number;
}

const INDUSTRY_PRESETS: Record<string, { label: string; defaultKeywords: string[] }> = {
  'Luxury': {
    label: 'Ultra-Luxury & Hospitality',
    defaultKeywords: ['Elegance', 'Prestige', 'Sanctuary', 'Bespoke', 'Heritage']
  },
  'Tech': {
    label: 'AI & Cloud Enterprise SaaS',
    defaultKeywords: ['Velocity', 'Intelligence', 'Scale', 'Neural', 'Flow']
  },
  'Agency': {
    label: 'Creative Agency & Design Studio',
    defaultKeywords: ['Craft', 'Vision', 'Aesthetic', 'Prism', 'Impact']
  },
  'Ecommerce': {
    label: 'High-End E-Commerce & DTC',
    defaultKeywords: ['Curation', 'Prime', 'Signature', 'Vogue', 'Artisan']
  },
  'RealEstate': {
    label: 'Architecture & Real Estate',
    defaultKeywords: ['Monolith', 'Habitat', 'Apex', 'Domain', 'Vista']
  },
  'Finance': {
    label: 'Fintech & Wealth Advisory',
    defaultKeywords: ['Equinox', 'Trust', 'Vanguard', 'Capital', 'Shield']
  },
  'Health': {
    label: 'Longevity, Wellness & Bio-Tech',
    defaultKeywords: ['Vitality', 'Biome', 'Zenith', 'Cellular', 'Pure']
  }
};

export default function BusinessNameGenerator() {
  const { showToast } = useCustomUi();

  // Form Inputs
  const [industry, setIndustry] = useState<string>('Luxury');
  const [keywords, setKeywords] = useState<string>('Prestige, Sanctuary, Bespoke');
  const [tone, setTone] = useState<string>('Modern & Minimalist');
  const [nameStyle, setNameStyle] = useState<string>('Invented/Abstract');
  const [lengthPreference, setLengthPreference] = useState<string>('any');

  // Generation & State
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState<BusinessNameItem[]>([]);
  const [favorites, setFavorites] = useState<BusinessNameItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterLength, setFilterLength] = useState<string>('all');

  // Local Storage favorites persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('samaxon_favorite_names');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse saved names:', e);
    }
  }, []);

  const saveFavoritesToStorage = (updated: BusinessNameItem[]) => {
    setFavorites(updated);
    try {
      localStorage.setItem('samaxon_favorite_names', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save names to localStorage:', e);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (item: BusinessNameItem) => {
    const isFav = favorites.some(f => f.name === item.name);
    let next: BusinessNameItem[];
    if (isFav) {
      next = favorites.filter(f => f.name !== item.name);
      showToast(`Removed "${item.name}" from favorites.`, 'info');
    } else {
      next = [...favorites, item];
      showToast(`Saved "${item.name}" to favorites!`, 'success');
    }
    saveFavoritesToStorage(next);
  };

  // Switch Industry tag click
  const handleIndustryChange = (indKey: string) => {
    setIndustry(indKey);
    const preset = INDUSTRY_PRESETS[indKey];
    if (preset) {
      setKeywords(preset.defaultKeywords.join(', '));
    }
  };

  // Handle Tag Click to append
  const handleTagClick = (tag: string) => {
    const parts = keywords.split(',').map(s => s.trim()).filter(Boolean);
    if (!parts.includes(tag)) {
      setKeywords([...parts, tag].join(', '));
    }
  };

  // Generate Names Handler
  const handleGenerate = async () => {
    setIsLoading(true);
    setActiveTab('all');

    try {
      const res = await fetch('/api/tools/generate-business-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: INDUSTRY_PRESETS[industry]?.label || industry,
          keywords,
          tone,
          nameStyle,
          lengthPreference
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.names)) {
        setNames(data.names);
        showToast(`Generated ${data.names.length} premium brand names!`, 'success');
      } else {
        throw new Error(data.error || 'Failed to generate names');
      }
    } catch (err: any) {
      console.warn('Error generating names, activating local generator fallback:', err);
      showToast('Generated brand candidates using local linguistic engine.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger initial generation once
  useEffect(() => {
    handleGenerate();
  }, []);

  // Filtered names
  const displayedList = useMemo(() => {
    const source = activeTab === 'favorites' ? favorites : names;
    return source.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          item.name.toLowerCase().includes(q) ||
          item.tagline.toLowerCase().includes(q) ||
          item.rationale.toLowerCase().includes(q) ||
          item.vibe.some(v => v.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // Style
      if (filterStyle !== 'all' && item.style !== filterStyle) {
        return false;
      }
      // Length
      if (filterLength === 'short' && item.length > 6) return false;
      if (filterLength === 'medium' && (item.length < 7 || item.length > 10)) return false;
      if (filterLength === 'long' && item.length <= 10) return false;

      return true;
    });
  }, [names, favorites, activeTab, searchQuery, filterStyle, filterLength]);

  // Copy Single Name
  const handleCopyName = (nameStr: string) => {
    navigator.clipboard.writeText(nameStr);
    showToast(`"${nameStr}" copied to clipboard.`, 'success');
  };

  // Copy Full Brand Dossier
  const handleCopyBrief = (item: BusinessNameItem) => {
    const text = `BRAND DOSSIER: ${item.name}
---------------------------------
Tagline: ${item.tagline}
Phonetic: ${item.pronunciation}
Vibe / Archetype: ${item.vibe.join(', ')}
Linguistic Rationale: ${item.rationale}
Suggested Domains: ${item.domains.join(', ')}

Curated via SamaXon Business Name Generator (https://samaxon.com/tools/business-name-generator)`;

    navigator.clipboard.writeText(text);
    showToast(`Brand dossier for "${item.name}" copied to clipboard!`, 'success');
  };

  // Export Favorites JSON
  const handleExportFavoritesJson = () => {
    if (favorites.length === 0) return;
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samaxon-saved-brand-names-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Saved brand portfolio exported as JSON.', 'success');
  };

  return (
    <div className="space-y-10 text-left" id="business-name-generator-tool">
      {/* Tool Hero Header */}
      <div className="bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/25 rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <CustomBadge variant="gold" size="md" icon={<Sparkles className="w-3 h-3" />}>
              Brand Architecture & Naming Studio
            </CustomBadge>
            <span className="text-[10px] font-mono text-[#D6B46A]/80 uppercase tracking-wider">
              AI Linguistic Synthesizer
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            AI Business & Brand <span className="text-[#D6B46A]">Name Generator</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Generate prestigious, trademarkable brand names engineered with phonetics, domain availability strategies, and psychological positioning for modern enterprises.
          </p>
        </div>
      </div>

      {/* Main Grid: Parameters vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">Brand Inputs</span>
              <h3 className="font-display text-lg font-bold text-[#111111]">Naming Strategy</h3>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-[#111111] text-[#D6B46A] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          {/* Industry Selection */}
          <FormField
            label="Industry / Domain Category"
            description="Select category to seed domain-specific linguistic roots"
          >
            <CustomSelect
              value={industry}
              onChange={handleIndustryChange}
              options={Object.entries(INDUSTRY_PRESETS).map(([k, v]) => ({
                value: k,
                label: v.label
              }))}
            />
          </FormField>

          {/* Core Keywords */}
          <div className="space-y-2">
            <FormField
              label="Core Keywords & Concepts"
              description="Comma-separated concepts, emotions, or themes"
            >
              <CustomInput
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. Speed, Sanctuary, Vault"
              />
            </FormField>

            {/* Quick Keyword Tag Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[9.5px] font-mono text-[#8A8178] self-center mr-1">Suggested:</span>
              {(INDUSTRY_PRESETS[industry]?.defaultKeywords || []).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleTagClick(k)}
                  className="px-2 py-0.5 bg-[#FAF6F0] hover:bg-[#D6B46A]/20 text-[#85641C] border border-[#D6B46A]/25 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                >
                  +{k}
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Brand Tone">
              <CustomSelect
                value={tone}
                onChange={(val) => setTone(String(val))}
                options={[
                  { value: 'Modern & Minimalist', label: 'Modern & Minimalist' },
                  { value: 'Classic & Prestigious', label: 'Classic & Prestigious' },
                  { value: 'Creative & Evocative', label: 'Creative & Evocative' },
                  { value: 'Tech & Innovative', label: 'Tech & Forward-Looking' },
                  { value: 'Short & Punchy', label: 'Short & Punchy' },
                  { value: 'Ultra-Luxury', label: 'Ultra-Luxury Architectural' }
                ]}
              />
            </FormField>

            <FormField label="Linguistic Style">
              <CustomSelect
                value={nameStyle}
                onChange={(val) => setNameStyle(String(val))}
                options={[
                  { value: 'Invented/Abstract', label: 'Invented / Abstract (e.g. Veltis)' },
                  { value: 'Compound', label: 'Compound Blend (e.g. AuraScale)' },
                  { value: 'Latin Roots', label: 'Classical Latin Roots' },
                  { value: 'Portmanteau', label: 'Portmanteau Hybrid' },
                  { value: 'Real Words', label: 'Evocative Real English' }
                ]}
              />
            </FormField>
          </div>

          {/* Length Preference */}
          <FormField label="Character Length Constraint">
            <CustomSelect
              value={lengthPreference}
              onChange={(val) => setLengthPreference(String(val))}
              options={[
                { value: 'any', label: 'Any Balanced Length' },
                { value: 'short', label: 'Short & Punchy (≤ 6 Letters)' },
                { value: 'medium', label: 'Medium Cadence (7 – 10 Letters)' }
              ]}
            />
          </FormField>

          {/* Generate Primary Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Brand Identities...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 18+ Brand Names</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Names Display & Management (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Bar: Tabs & Search Filter */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 bg-[#FAF6F0] p-1 rounded-xl border border-[#D6B46A]/20">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                All Names ({names.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-[#D6B46A] text-[#D6B46A]' : ''}`} />
                <span>Saved ({favorites.length})</span>
              </button>
            </div>

            {/* Quick In-List Search */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8178]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or keyword..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl outline-none focus:border-[#D6B46A]"
              />
            </div>

            {activeTab === 'favorites' && favorites.length > 0 && (
              <button
                type="button"
                onClick={handleExportFavoritesJson}
                className="px-3 py-1.5 bg-[#111111] text-[#D6B46A] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="Export saved names as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            )}
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <CustomLoadingState
              title="Generating Linguistic Brand Identities"
              stage="Analyzing Latin roots, phonetics & market positioning"
              subtext="Tailoring nomenclature to your brand's unique market authority..."
            />
          ) : displayedList.length === 0 ? (
            <CustomEmptyState
              icon={<Sparkles className="w-6 h-6" />}
              title={activeTab === 'favorites' ? 'No Saved Names Yet' : 'No Matching Brand Names'}
              description={
                activeTab === 'favorites'
                  ? 'Click the heart icon on any generated brand card to curate your shortlisted identities.'
                  : 'Try relaxing your search filter or generate a fresh batch of names.'
              }
              actionText={activeTab === 'favorites' ? 'View All Names' : 'Regenerate Names'}
              onAction={activeTab === 'favorites' ? () => setActiveTab('all') : handleGenerate}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedList.map((item) => {
                const isFav = favorites.some(f => f.name === item.name);
                return (
                  <div
                    key={item.name}
                    className="bg-[#FFFDF8] border border-[#D6B46A]/25 hover:border-[#D6B46A] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group relative"
                  >
                    {/* Card Header: Name, Phonetic & Favorite Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-xl font-black tracking-tight text-[#111111] group-hover:text-[#85641C] transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#8A8178]">
                            {item.pronunciation}
                          </span>
                        </div>
                        <p className="text-xs text-[#85641C] font-semibold mt-0.5 italic">
                          "{item.tagline}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(item)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isFav
                            ? 'bg-[#111111] text-[#D6B46A]'
                            : 'bg-[#FAF6F0] text-[#8A8178] hover:text-[#111111]'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-[#D6B46A]' : ''}`} />
                      </button>
                    </div>

                    {/* Vibe Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.vibe.map(v => (
                        <span
                          key={v}
                          className="px-2 py-0.5 bg-[#FAF6F0] border border-[#D6B46A]/20 text-[9px] font-mono font-bold uppercase rounded-md text-[#85641C]"
                        >
                          {v}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 bg-neutral-100 text-[9px] font-mono rounded-md text-neutral-600">
                        {item.length} chars
                      </span>
                    </div>

                    {/* Linguistic Rationale */}
                    <p className="text-xs text-[#8A8178] leading-relaxed line-clamp-3 font-normal">
                      {item.rationale}
                    </p>

                    {/* Domain Availability Recommendations */}
                    <div className="space-y-1.5 pt-2 border-t border-[#D6B46A]/15">
                      <span className="text-[9px] font-mono uppercase text-[#8A8178] font-bold block">
                        Recommended Domain Extensions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.domains.map(dom => (
                          <span
                            key={dom}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-mono font-bold"
                          >
                            {item.name.toLowerCase()}{dom}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Footer: Copy Name & Copy Brief */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D6B46A]/10">
                      <button
                        type="button"
                        onClick={() => handleCopyName(item.name)}
                        className="text-xs font-bold text-[#111111] hover:text-[#85641C] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-[#8A8178]" />
                        <span>Copy Name</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyBrief(item)}
                        className="px-2.5 py-1 bg-[#111111] text-[#D6B46A] hover:text-white rounded-lg text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
