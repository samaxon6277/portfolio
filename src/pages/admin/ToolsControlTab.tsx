import React, { useState, useEffect } from 'react';
import { 
  Wrench, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, 
  Power, PowerOff, ShieldCheck, Search, Filter, Info, Sparkles,
  Calculator, Minimize2, Crop, FileText, Wand2, RefreshCcw, Image as ImageIcon
} from 'lucide-react';
import { ToolItemConfig, getToolsConfig, saveToolStatus, resetToolsConfig } from '../../utils/toolsConfig';
import { useCustomUi } from '../../context/CustomUiContext';

const ICON_MAP: Record<string, React.ElementType> = {
  RefreshCw: RefreshCw,
  Calculator: Calculator,
  Minimize2: Minimize2,
  Crop: Crop,
  FileText: FileText,
  Wand2: Wand2,
  Sparkles: Sparkles,
  ImageIcon: ImageIcon
};

export default function ToolsControlTab() {
  const { showToast } = useCustomUi();
  const [tools, setTools] = useState<ToolItemConfig[]>(getToolsConfig());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Image' | 'Document' | 'Productivity' | 'AI Neural'>('All');
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [tempNotice, setTempNotice] = useState<string>('');

  useEffect(() => {
    const handleUpdate = () => {
      setTools(getToolsConfig());
    };
    window.addEventListener('samaxon_tools_status_updated', handleUpdate);
    return () => window.removeEventListener('samaxon_tools_status_updated', handleUpdate);
  }, []);

  const handleToggle = (tool: ToolItemConfig) => {
    const nextState = !tool.enabled;
    const updated = saveToolStatus(tool.id, nextState);
    setTools(updated);
    showToast(`${tool.name} is now ${nextState ? 'ENABLED and live for all visitors' : 'DISABLED (Maintenance Mode active)'}`, nextState ? 'success' : 'info');
  };

  const handleSaveNotice = (toolId: string) => {
    const updated = saveToolStatus(toolId, tools.find(t => t.id === toolId)?.enabled ?? true, tempNotice);
    setTools(updated);
    setEditingNoticeId(null);
    showToast('Maintenance message saved successfully.', 'success');
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all tool statuses to factory default (All Tools Active)?')) {
      const reset = resetToolsConfig();
      setTools(reset);
      showToast('All tools have been reset to Online status.', 'success');
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeCount = tools.filter(t => t.enabled).length;
  const disabledCount = tools.length - activeCount;

  return (
    <div className="space-y-8 text-left" id="admin-tools-control-tab">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-3xl border border-[#D6B46A]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D6B46A] shadow-[0_0_10px_#D6B46A] animate-pulse" />
                <span className="text-[10px] font-mono text-[#D6B46A] uppercase tracking-widest font-bold">
                  SMR Global Tools Switchboard
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Digital Tools Suite Master Control
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-[#D6B46A]" />
                <span>Reset All to Default</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Turn individual studio tools on or off instantly with one click. When a tool is paused, public visitors see an elegant maintenance notice, preventing broken interactions while you perform updates.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Tools</span>
              <span className="font-display font-black text-xl text-white mt-0.5 block">{tools.length}</span>
            </div>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block">Live & Active</span>
              <span className="font-display font-black text-xl text-emerald-400 mt-0.5 block">{activeCount}</span>
            </div>
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <span className="text-[10px] font-mono text-amber-400 uppercase block">In Maintenance</span>
              <span className="font-display font-black text-xl text-amber-400 mt-0.5 block">{disabledCount}</span>
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Processing Model</span>
              <span className="font-display font-bold text-xs text-[#D6B46A] mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Client In-Memory
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D6B46A]/20 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8A8178] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by tool name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#D6B46A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {(['All', 'Image', 'Document', 'Productivity', 'AI Neural'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase cursor-pointer transition-all ${
                categoryFilter === cat
                  ? 'bg-[#111111] text-[#D6B46A]'
                  : 'bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#554F49] hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Master Grid with Luxury Switches */}
      <div className="space-y-4">
        {filteredTools.map(tool => {
          const Icon = ICON_MAP[tool.iconName] || Wrench;
          const isNoticeOpen = editingNoticeId === tool.id;

          return (
            <div
              key={tool.id}
              className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-sm ${
                tool.enabled 
                  ? 'border-[#D6B46A]/30 hover:border-[#D6B46A] hover:shadow-md' 
                  : 'border-rose-300 bg-rose-50/20'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Icon & Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                    tool.enabled
                      ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A]/40'
                      : 'bg-neutral-200 text-neutral-500 border-neutral-300'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-[#111111]">
                        {tool.name}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-[#FFFDF8] border border-[#D6B46A]/30 text-[#A68936] text-[10px] font-mono uppercase font-bold rounded-lg">
                        {tool.category}
                      </span>
                      <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#8A6D25] text-[10px] font-mono uppercase font-bold rounded">
                        {tool.badge}
                      </span>
                      
                      {tool.enabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-bold rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono uppercase font-bold rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Disabled (Maintenance)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#554F49] max-w-2xl leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Right: Master Switch and Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#D6B46A]/15 justify-between lg:justify-end">
                  {/* Maintenance Notice Quick Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isNoticeOpen) {
                        setEditingNoticeId(null);
                      } else {
                        setEditingNoticeId(tool.id);
                        setTempNotice(tool.maintenanceNotice || '');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/30 text-[#554F49] hover:text-[#111111] text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    {tool.maintenanceNotice ? 'Edit Notice' : '+ Custom Notice'}
                  </button>

                  {/* Public Link */}
                  <a
                    href={`/tools?tab=${tool.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/30 text-[#554F49] hover:text-[#111111] transition-colors"
                    title="Open this tool in public website"
                  >
                    <ExternalLink className="w-4 h-4 text-[#A68936]" />
                  </a>

                  {/* iOS Style Luxury Gold Toggle Switch */}
                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-[11px] font-mono uppercase font-bold text-[#554F49]">
                      {tool.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tool.enabled}
                      onClick={() => handleToggle(tool)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                        tool.enabled 
                          ? 'bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] shadow-inner' 
                          : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                          tool.enabled ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Maintenance Notice Expandable Drawer */}
              {isNoticeOpen && (
                <div className="mt-4 pt-4 border-t border-[#D6B46A]/20 space-y-3 bg-[#FFFDF8] p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold text-[#A68936] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      Custom Maintenance Notice (shown to visitors when disabled)
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingNoticeId(null)}
                      className="text-xs font-mono text-[#8A8178] hover:text-black cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={tempNotice}
                      onChange={(e) => setTempNotice(e.target.value)}
                      placeholder="e.g., Temporarily paused for engine optimization. Back online shortly."
                      className="w-full px-3 py-2 bg-white border border-[#D6B46A]/30 rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#D6B46A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveNotice(tool.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono text-xs font-bold uppercase rounded-xl shrink-0 cursor-pointer"
                    >
                      Save Notice
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
