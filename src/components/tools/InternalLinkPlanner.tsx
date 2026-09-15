import React, { useState, useMemo } from 'react';
import { 
  Network, Plus, Trash2, ArrowRight, ShieldCheck, Download, 
  Copy, RefreshCw, Layers, ExternalLink, HelpCircle, CheckCircle2, 
  AlertTriangle, FileText, Table, Sparkles, Eye, Share2
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomSelect from '../ui/CustomSelect';
import CustomTabs from '../ui/CustomTabs';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomExportControls from '../ui/CustomExportControls';
import CustomEmptyState from '../ui/CustomEmptyState';
import FormField from '../ui/FormField';

export type PageRole = 'Pillar Hub' | 'Cluster Topic' | 'Transactional Closing' | 'Supporting Resource';

export interface PlannedPage {
  id: string;
  url: string;
  title: string;
  role: PageRole;
  category: string;
  inboundLinkIds: string[];
  outboundLinkIds: string[];
  recommendedAnchor: string;
}

const PRESET_ARCHITECTURES: Record<string, PlannedPage[]> = {
  'Banquet & Event Portals': [
    {
      id: 'p-home',
      url: '/',
      title: 'SamaXon Banquet & Event Venue Digital Engineering',
      role: 'Pillar Hub',
      category: 'Core',
      inboundLinkIds: ['p-banquets', 'p-calc', 'p-cases', 'p-contact'],
      outboundLinkIds: ['p-banquets', 'p-calc', 'p-cases', 'p-contact'],
      recommendedAnchor: 'SamaXon Banquet Engineering'
    },
    {
      id: 'p-banquets',
      url: '/banquet-hall-website-design',
      title: 'Banquet Hall Website Design & Booking Systems Noida',
      role: 'Pillar Hub',
      category: 'Services',
      inboundLinkIds: ['p-home', 'p-calc', 'p-cases'],
      outboundLinkIds: ['p-home', 'p-calc', 'p-contact'],
      recommendedAnchor: 'banquet hall website design'
    },
    {
      id: 'p-calc',
      url: '/banquet-plate-calculator-demo',
      title: 'Interactive Plate Cost & Menu Estimator Engine',
      role: 'Cluster Topic',
      category: 'Interactive',
      inboundLinkIds: ['p-banquets', 'p-home'],
      outboundLinkIds: ['p-banquets', 'p-contact'],
      recommendedAnchor: 'banquet plate calculator'
    },
    {
      id: 'p-cases',
      url: '/projects/wedding-lawn-portal',
      title: 'Khaas Banquet Case Study: 41% Direct Bookings Growth',
      role: 'Supporting Resource',
      category: 'Proof',
      inboundLinkIds: ['p-home', 'p-banquets'],
      outboundLinkIds: ['p-banquets', 'p-contact'],
      recommendedAnchor: 'wedding venue case study'
    },
    {
      id: 'p-contact',
      url: '/contact',
      title: 'Initiate 48-Hour Deployment Consultation',
      role: 'Transactional Closing',
      category: 'Conversion',
      inboundLinkIds: ['p-home', 'p-banquets', 'p-calc', 'p-cases'],
      outboundLinkIds: ['p-home'],
      recommendedAnchor: 'schedule demo consultation'
    }
  ],
  'SaaS & Web Engineering': [
    {
      id: 's-home',
      url: '/',
      title: 'High-Performance Web Solutions & Architecture',
      role: 'Pillar Hub',
      category: 'Core',
      inboundLinkIds: ['s-services', 's-tools', 's-pricing'],
      outboundLinkIds: ['s-services', 's-tools', 's-pricing'],
      recommendedAnchor: 'SamaXon Digital Home'
    },
    {
      id: 's-services',
      url: '/services/custom-web-applications',
      title: 'Full-Stack TypeScript & Cloud Run Development',
      role: 'Pillar Hub',
      category: 'Services',
      inboundLinkIds: ['s-home', 's-tools'],
      outboundLinkIds: ['s-pricing', 's-contact'],
      recommendedAnchor: 'custom web development services'
    },
    {
      id: 's-tools',
      url: '/tools',
      title: 'Free Digital Utilities & Web Architecture Suite',
      role: 'Cluster Topic',
      category: 'Utilities',
      inboundLinkIds: ['s-home'],
      outboundLinkIds: ['s-services', 's-pricing'],
      recommendedAnchor: 'free web engineering tools'
    },
    {
      id: 's-pricing',
      url: '/pricing',
      title: 'Transparent 48-Hour Investment Packages',
      role: 'Transactional Closing',
      category: 'Conversion',
      inboundLinkIds: ['s-services', 's-tools', 's-home'],
      outboundLinkIds: ['s-contact'],
      recommendedAnchor: 'explore development pricing'
    },
    {
      id: 's-contact',
      url: '/contact',
      title: 'Direct Client Ingestion & Technical Discovery',
      role: 'Transactional Closing',
      category: 'Conversion',
      inboundLinkIds: ['s-pricing', 's-services'],
      outboundLinkIds: ['s-home'],
      recommendedAnchor: 'initiate client discovery'
    }
  ]
};

export default function InternalLinkPlanner() {
  const { showToast, showConfirm } = useCustomUi();
  const [pages, setPages] = useState<PlannedPage[]>(PRESET_ARCHITECTURES['Banquet & Event Portals']);
  const [activeTab, setActiveTab] = useState<'matrix' | 'visual' | 'schema'>('matrix');

  // New Page State
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<PageRole>('Cluster Topic');
  const [newCategory, setNewCategory] = useState('Services');
  const [newAnchor, setNewAnchor] = useState('');

  // Handle Preset Architecture Selection
  const handleLoadPreset = (presetName: string) => {
    if (PRESET_ARCHITECTURES[presetName]) {
      setPages(PRESET_ARCHITECTURES[presetName]);
      showToast(`Loaded "${presetName}" internal linking architecture.`, 'info');
    }
  };

  // Add Page
  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) {
      showToast('Please specify both page URL path and title.', 'warning');
      return;
    }

    const cleanUrl = newUrl.startsWith('/') ? newUrl.trim() : '/' + newUrl.trim();
    const newPage: PlannedPage = {
      id: `page-${Date.now()}`,
      url: cleanUrl,
      title: newTitle.trim(),
      role: newRole,
      category: newCategory.trim() || 'General',
      inboundLinkIds: [],
      outboundLinkIds: [],
      recommendedAnchor: newAnchor.trim() || newTitle.trim().toLowerCase()
    };

    setPages(prev => [...prev, newPage]);
    setNewUrl('');
    setNewTitle('');
    setNewAnchor('');
    showToast(`Added page ${cleanUrl} to linking blueprint.`, 'success');
  };

  // Delete Page
  const handleDeletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id).map(p => ({
      ...p,
      inboundLinkIds: p.inboundLinkIds.filter(lid => lid !== id),
      outboundLinkIds: p.outboundLinkIds.filter(lid => lid !== id)
    })));
    showToast('Page removed from architecture.', 'info');
  };

  // Link / Unlink toggle
  const handleToggleLink = (sourceId: string, destId: string) => {
    if (sourceId === destId) return;

    setPages(prev => prev.map(page => {
      if (page.id === sourceId) {
        const hasOutbound = page.outboundLinkIds.includes(destId);
        return {
          ...page,
          outboundLinkIds: hasOutbound
            ? page.outboundLinkIds.filter(id => id !== destId)
            : [...page.outboundLinkIds, destId]
        };
      }
      if (page.id === destId) {
        const hasInbound = page.inboundLinkIds.includes(sourceId);
        return {
          ...page,
          inboundLinkIds: hasInbound
            ? page.inboundLinkIds.filter(id => id !== sourceId)
            : [...page.inboundLinkIds, sourceId]
        };
      }
      return page;
    }));
  };

  // Metrics: Orphan detection
  const orphanPages = useMemo(() => {
    return pages.filter(p => p.url !== '/' && p.inboundLinkIds.length === 0);
  }, [pages]);

  // Generate BreadcrumbList JSON-LD Schema
  const breadcrumbSchemaJson = useMemo(() => {
    const listItems = pages.map((page, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": page.title,
      "item": `https://samaxon.site${page.url}`
    }));

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": listItems
    }, null, 2);
  }, [pages]);

  // Generate Link Matrix CSV
  const linkMatrixCsv = useMemo(() => {
    let csv = 'Source URL,Source Title,Destination URL,Destination Title,Anchor Text,Link Role\n';
    pages.forEach(source => {
      source.outboundLinkIds.forEach(destId => {
        const dest = pages.find(p => p.id === destId);
        if (dest) {
          csv += `"${source.url}","${source.title}","${dest.url}","${dest.title}","${dest.recommendedAnchor}","${dest.role}"\n`;
        }
      });
    });
    return csv;
  }, [pages]);

  // Generate Markdown Summary
  const markdownReport = useMemo(() => {
    let md = `# Internal Linking Architecture Blueprint\n`;
    md += `**Total Planned Pages:** ${pages.length} | **Detected Orphan Risks:** ${orphanPages.length}\n`;
    md += `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n\n`;
    md += `---\n\n`;

    md += `## 1. Page Inventory & Role Classifications\n\n`;
    pages.forEach(p => {
      md += `### ${p.title} (\`${p.url}\`)\n`;
      md += `- **Role:** ${p.role}\n`;
      md += `- **Primary Anchor Text:** "${p.recommendedAnchor}"\n`;
      md += `- **Inbound Internal Links (${p.inboundLinkIds.length}):** ${p.inboundLinkIds.map(id => pages.find(x => x.id === id)?.url).filter(Boolean).join(', ') || 'None (Orphan Risk)'}\n`;
      md += `- **Outbound Target Links (${p.outboundLinkIds.length}):** ${p.outboundLinkIds.map(id => pages.find(x => x.id === id)?.url).filter(Boolean).join(', ') || 'None'}\n\n`;
    });

    if (orphanPages.length > 0) {
      md += `## 2. Orphan Page Remediation Alerts\n\n`;
      orphanPages.forEach(op => {
        md += `- **Warning:** Page \`${op.url}\` receives 0 internal links. Link to this page from the homepage or relevant Pillar Hub using the anchor "${op.recommendedAnchor}".\n`;
      });
      md += `\n`;
    }

    md += `---\n*Generated by SamaXon Internal Link Planner.*\n`;
    return md;
  }, [pages, orphanPages]);

  const handleExportCsv = () => {
    const blob = new Blob([linkMatrixCsv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `internal-links-matrix-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Internal link matrix CSV downloaded.', 'success');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pages, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `internal-link-plan-${Date.now()}.json`);
    dlAnchor.click();
    showToast('Link plan JSON downloaded.', 'success');
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `internal-link-plan-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Markdown link blueprint downloaded.', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="internal-link-planner-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5" />
            <span>Pillar-Cluster & Internal Equity Mapping</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Internal Link Planner
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Architect topical authority with intentional pillar-cluster models. Eliminate orphan pages, optimize keyword-rich anchor text distribution, establish contextual inbound pathways, and generate valid JSON-LD Breadcrumb schemas.
          </p>
        </div>
      </div>

      {/* Preset Archetype Loader Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D6B46A]" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Pre-Built Topic Cluster Architectures:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(PRESET_ARCHITECTURES).map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Orphan Page Alert (If Any) */}
      {orphanPages.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-4 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {orphanPages.length} Orphan Page(s) Detected with Zero Inbound Internal Links
              </p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                {orphanPages.map(p => p.url).join(', ')} cannot receive Google PageRank equity. Link to them from relevant parent hub pages.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Planned Pages</span>
          <div className="text-2xl font-bold font-display text-neutral-900">{pages.length}</div>
          <span className="text-[10px] text-neutral-400">Total in blueprint</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Pillar Hubs</span>
          <div className="text-2xl font-bold font-display text-[#8F722E]">
            {pages.filter(p => p.role === 'Pillar Hub').length}
          </div>
          <span className="text-[10px] text-neutral-400">Topical authority anchors</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Cluster Subtopics</span>
          <div className="text-2xl font-bold font-display text-neutral-900">
            {pages.filter(p => p.role === 'Cluster Topic').length}
          </div>
          <span className="text-[10px] text-neutral-400">Supporting deep articles</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Orphan Risks</span>
          <div className={`text-2xl font-bold font-display ${orphanPages.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {orphanPages.length}
          </div>
          <span className="text-[10px] text-neutral-400">Pages with 0 inbound links</span>
        </div>
      </div>

      {/* Add Page Form */}
      <form onSubmit={handleAddPage} className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <h4 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider">
          + Add New Page to Link Architecture
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">Path / URL Slug</label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="e.g. /resort-wedding-lawn"
              className="w-full h-10 px-3 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">Page Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Luxury Resort Wedding Lawns"
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </div>

          <div>
            <CustomSelect
              label="Architectural Role"
              value={newRole}
              onChange={(r) => setNewRole(r as PageRole)}
              options={[
                { value: 'Pillar Hub', label: 'Pillar Hub (Core Authority)' },
                { value: 'Cluster Topic', label: 'Cluster Topic (Supporting Deep)' },
                { value: 'Transactional Closing', label: 'Transactional Closing' },
                { value: 'Supporting Resource', label: 'Supporting Resource' }
              ]}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">Recommended Anchor</label>
            <input
              type="text"
              value={newAnchor}
              onChange={(e) => setNewAnchor(e.target.value)}
              placeholder="e.g. resort wedding lawns"
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-10 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page</span>
            </button>
          </div>
        </div>
      </form>

      {/* Main Tabs Area */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
          <CustomTabs
            tabs={[
              { id: 'matrix', label: 'Interactive Link Matrix', icon: <Table className="w-3.5 h-3.5" /> },
              { id: 'visual', label: 'Visual Linking Cards', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'schema', label: 'JSON-LD Breadcrumb Schema', icon: <FileText className="w-3.5 h-3.5" /> }
            ]}
            activeTab={activeTab}
            onChange={(t) => setActiveTab(t as any)}
          />

          <CustomExportControls
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            onExportMarkdown={handleExportMarkdown}
            onPrint={() => window.print()}
            copyText={markdownReport}
            copyLabel="Copy Link Plan"
          />
        </div>

        {/* Tab 1: Link Matrix */}
        {activeTab === 'matrix' && (
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-neutral-200 text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Page / Path</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Target Anchor Text</th>
                  <th className="py-3 px-3 text-center">Inbound Links</th>
                  <th className="py-3 px-3 text-center">Outbound Links</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900">{page.title}</div>
                      <div className="font-mono text-[11px] text-neutral-500">{page.url}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        page.role === 'Pillar Hub'
                          ? 'bg-[#D6B46A]/20 text-[#8F722E]'
                          : page.role === 'Cluster Topic'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {page.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-700">
                      "{page.recommendedAnchor}"
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        page.inboundLinkIds.length === 0 && page.url !== '/'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {page.inboundLinkIds.length}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-neutral-800">
                      {page.outboundLinkIds.length}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Visual Card Link Modeler */}
        {activeTab === 'visual' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {pages.map((page) => (
              <div 
                key={page.id}
                className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {page.role}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {page.inboundLinkIds.length} in / {page.outboundLinkIds.length} out
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-neutral-900 line-clamp-1">
                    {page.title}
                  </h5>
                  <p className="text-[11.5px] font-mono text-[#8F722E] truncate">
                    {page.url}
                  </p>

                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Target Link Destinations:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {pages.filter(p => p.id !== page.id).map(targetPage => {
                        const isLinked = page.outboundLinkIds.includes(targetPage.id);
                        return (
                          <button
                            key={targetPage.id}
                            type="button"
                            onClick={() => handleToggleLink(page.id, targetPage.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                              isLinked
                                ? 'bg-[#111111] text-[#D6B46A] font-bold shadow-xs'
                                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                            }`}
                            title={`Toggle link to ${targetPage.url}`}
                          >
                            {targetPage.url} {isLinked ? '✓' : '+'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
                  <span>Anchor: <strong>"{page.recommendedAnchor}"</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: JSON-LD Breadcrumbs */}
        {activeTab === 'schema' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-neutral-900">
                  JSON-LD BreadcrumbList Schema
                </h4>
                <p className="text-xs text-neutral-500">
                  Google rich snippet schema generated directly from your page hierarchy.
                </p>
              </div>
              <CustomCopyButton text={breadcrumbSchemaJson} label="Copy JSON-LD" />
            </div>

            <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
              {breadcrumbSchemaJson}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
