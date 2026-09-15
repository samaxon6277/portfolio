import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, CheckCircle2, AlertTriangle, XCircle, HelpCircle, 
  Search, Filter, RotateCcw, Download, Upload, ShieldCheck, 
  ExternalLink, FileText, Check, AlertCircle, Eye, RefreshCw, Printer
} from 'lucide-react';
import { 
  ChecklistItem, 
  ChecklistCategory, 
  CheckItemStatus, 
  DEFAULT_LAUNCH_CHECKLIST 
} from '../../utils/launchReadinessData';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomTabs from '../ui/CustomTabs';
import CustomSelect from '../ui/CustomSelect';
import CustomExportControls from '../ui/CustomExportControls';
import CustomEmptyState from '../ui/CustomEmptyState';
import CustomBadge from '../ui/CustomBadge';

const STORAGE_KEY = 'samaxon_launch_readiness_checklist_v1';

export default function WebsiteLaunchReadinessChecker() {
  const { showToast, showConfirm } = useCustomUi();
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_LAUNCH_CHECKLIST;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  // Automated probe state
  const [probeUrl, setProbeUrl] = useState('');
  const [isProbing, setIsProbing] = useState(false);
  const [probeError, setProbeError] = useState('');

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Status Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const passed = items.filter(i => i.status === 'passed').length;
    const failed = items.filter(i => i.status === 'failed').length;
    const needsReview = items.filter(i => i.status === 'needs_review').length;
    const notChecked = items.filter(i => i.status === 'not_checked').length;
    const notApplicable = items.filter(i => i.status === 'not_applicable').length;
    const evaluatedCount = total - notChecked - notApplicable;
    const completionPercent = Math.round(((total - notChecked) / total) * 100);
    const criticalPending = items.filter(i => (i.priority === 'critical' || i.priority === 'high') && (i.status === 'failed' || i.status === 'needs_review')).length;

    return {
      total,
      passed,
      failed,
      needsReview,
      notChecked,
      notApplicable,
      completionPercent,
      criticalPending,
      score: evaluatedCount > 0 ? Math.round((passed / evaluatedCount) * 100) : 0
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q)) ||
          item.suggestedFix.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedCategory, selectedStatus, searchQuery]);

  const handleUpdateStatus = (id: string, newStatus: CheckItemStatus) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  };

  const handleUpdateEvidence = (id: string, evidence: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, evidence } : item));
  };

  const handleReset = () => {
    showConfirm({
      title: 'Reset Launch Checklist?',
      message: 'This will reset all item statuses, notes, and evidence to default not-checked states. This action cannot be undone.',
      confirmText: 'Reset Everything',
      cancelText: 'Keep Data',
      onConfirm: () => {
        setItems(DEFAULT_LAUNCH_CHECKLIST);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        showToast('Launch checklist reset to default state.', 'info');
      }
    });
  };

  const handleQuickProbe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!probeUrl.trim()) return;

    let target = probeUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      new URL(target);
    } catch {
      setProbeError('Enter a complete URL beginning with https:// or http://.');
      return;
    }

    setProbeError('');
    setIsProbing(true);

    try {
      const res = await fetch('/api/tools/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });

      const data = await res.json();
      if (!data.success) {
        setProbeError(data.error || 'Could not access the remote URL for automated probing.');
        setIsProbing(false);
        return;
      }

      // Safely apply verified evidence to checklist items without marking unchecked ones as passed
      setItems(prev => prev.map(item => {
        const meta = data.data?.meta;
        if (!meta) return item;

        if (item.id === 'sec-https') {
          return {
            ...item,
            status: meta.technical?.isHttps ? 'passed' : 'failed',
            evidence: `Verified protocol: ${meta.technical?.isHttps ? 'HTTPS enforced' : 'Insecure HTTP detected'}`
          };
        }
        if (item.id === 'seo-title') {
          const hasTitle = Boolean(meta.title && meta.title.length > 5);
          return {
            ...item,
            status: hasTitle ? 'passed' : 'failed',
            evidence: `Page Title: "${meta.title || '(missing)'}" (${meta.title ? meta.title.length : 0} chars)`
          };
        }
        if (item.id === 'seo-desc') {
          const hasDesc = Boolean(meta.metaDescription && meta.metaDescription.length > 20);
          return {
            ...item,
            status: hasDesc ? 'passed' : 'needs_review',
            evidence: meta.metaDescription ? `Description: "${meta.metaDescription}"` : 'No meta description tag detected in HTML head.'
          };
        }
        if (item.id === 'seo-h1') {
          const h1Count = meta.headings?.h1?.length || 0;
          return {
            ...item,
            status: h1Count === 1 ? 'passed' : 'failed',
            evidence: `Detected ${h1Count} <h1> heading tag(s): ${meta.headings?.h1?.join(' | ') || 'None'}`
          };
        }
        if (item.id === 'seo-canonical') {
          return {
            ...item,
            status: meta.canonicalUrl ? 'passed' : 'needs_review',
            evidence: meta.canonicalUrl ? `Canonical tag: ${meta.canonicalUrl}` : 'No rel="canonical" tag detected in HTML head.'
          };
        }
        if (item.id === 'seo-alt') {
          const missing = meta.images?.missingAlt || 0;
          const total = meta.images?.total || 0;
          return {
            ...item,
            status: missing === 0 ? 'passed' : 'failed',
            evidence: `Found ${total} image(s); ${missing} missing alt attribute.`
          };
        }
        if (item.id === 'a11y-lang') {
          return {
            ...item,
            status: meta.technical?.hasLang ? 'passed' : 'failed',
            evidence: meta.technical?.hasLang ? '<html> tag includes lang attribute.' : 'Missing lang attribute on <html> element.'
          };
        }
        return item;
      }));

      showToast('Automated diagnostic data gathered and mapped to checklist evidence.', 'success');
    } catch (err: any) {
      setProbeError('Diagnostic probe timed out or could not reach server. Verify domain reachability.');
    } finally {
      setIsProbing(false);
    }
  };

  // Export handlers
  const generateMarkdownReport = () => {
    let md = `# Website Launch Readiness Dossier\n`;
    md += `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n`;
    md += `**Overall Score:** ${metrics.score}% | **Evaluated Items:** ${metrics.total - metrics.notChecked}/${metrics.total}\n`;
    md += `**Status Breakdown:** Passed: ${metrics.passed} | Failed: ${metrics.failed} | Needs Review: ${metrics.needsReview} | Pending: ${metrics.notChecked}\n\n`;
    md += `---\n\n`;

    const categories: ChecklistCategory[] = [
      'Core Functionality',
      'Responsive Design',
      'SEO',
      'Performance',
      'Accessibility',
      'Security',
      'Analytics & Operations',
      'Legal & Content'
    ];

    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat);
      md += `## ${cat}\n\n`;
      catItems.forEach(item => {
        const statusIcon = item.status === 'passed' ? 'PASS' : item.status === 'failed' ? 'FAIL' : item.status === 'needs_review' ? 'REVIEW' : 'UNCHECKED';
        md += `### [${statusIcon}] ${item.title} (Priority: ${item.priority.toUpperCase()})\n`;
        md += `- **Requirement:** ${item.description}\n`;
        if (item.evidence) md += `- **Technical Evidence:** ${item.evidence}\n`;
        if (item.notes) md += `- **Auditor Notes:** ${item.notes}\n`;
        md += `- **Remediation Fix:** ${item.suggestedFix}\n\n`;
      });
    });

    md += `---\n*Report generated via SamaXon Launch Readiness Checker. Not a formal legal or regulatory certification.*\n`;
    return md;
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      exportDate: new Date().toISOString(),
      metrics,
      items
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `website-launch-readiness-${Date.now()}.json`);
    dlAnchor.click();
    showToast('Checklist JSON exported successfully.', 'success');
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([generateMarkdownReport()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `launch-readiness-report-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Markdown report downloaded.', 'success');
  };

  const handleExportTxt = () => {
    const textContent = generateMarkdownReport().replace(/#/g, '').replace(/\*\*/g, '');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `launch-readiness-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Plain text report downloaded.', 'success');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedItems = parsed.items || parsed;
        if (Array.isArray(importedItems) && importedItems.length > 0) {
          setItems(importedItems);
          showToast(`Imported ${importedItems.length} checklist items.`, 'success');
        } else {
          showToast('Invalid JSON structure: missing checklist items array.', 'error');
        }
      } catch {
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const categoriesList = [
    'All',
    'Core Functionality',
    'Responsive Design',
    'SEO',
    'Performance',
    'Accessibility',
    'Security',
    'Analytics & Operations',
    'Legal & Content'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="launch-readiness-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
              <Rocket className="w-3.5 h-3.5" />
              <span>Production Deployment Pre-Flight</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15">
                <Upload className="w-3.5 h-3.5 text-[#D6B46A]" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15"
                title="Reset all checklist items"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website Launch Readiness Checker
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Execute an exhaustive pre-launch inspection across Core Functionality, Responsive Usability, Technical SEO, Core Web Vitals, Web Accessibility (WCAG), Security Hardening, and Legal Disclosures prior to deploying to production.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B46A]" />
              Client-side private storage (no credentials uploaded)
            </span>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Technical checklist & diagnostic utility, not legal certification
            </span>
          </div>
        </div>
      </div>

      {/* Optional Automated Probe Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#D6B46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Automated Diagnostic Ingestion (Optional)
            </h3>
          </div>
          <span className="text-[11px] text-[#8A8178]">
            Probes remote URL for automated SEO & SSL evidence mapping
          </span>
        </div>

        <form onSubmit={handleQuickProbe} className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <input
              type="text"
              value={probeUrl}
              onChange={(e) => setProbeUrl(e.target.value)}
              placeholder="e.g. https://yourbrand.com"
              className="w-full h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6B46A]/40 focus:border-[#D6B46A]"
              disabled={isProbing}
            />
          </div>
          <button
            type="submit"
            disabled={isProbing || !probeUrl.trim()}
            className="h-11 px-6 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            {isProbing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                <span>Probing Target...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Fetch Evidence</span>
              </>
            )}
          </button>
        </form>

        {probeError && (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5" role="alert">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{probeError}</span>
          </p>
        )}
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Readiness Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-neutral-900">{metrics.score}%</span>
            <span className="text-[10px] font-mono text-[#8F722E] font-bold">Passing</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#D6B46A] transition-all duration-300" style={{ width: `${metrics.score}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-bold font-display text-neutral-900">{metrics.completionPercent}%</div>
          <span className="text-[10px] text-neutral-400 block">{metrics.total - metrics.notChecked} of {metrics.total} items</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed
          </span>
          <div className="text-2xl font-bold font-display text-emerald-700">{metrics.passed}</div>
          <span className="text-[10px] text-neutral-400 block">Verified production ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Failed
          </span>
          <div className="text-2xl font-bold font-display text-rose-700">{metrics.failed}</div>
          <span className="text-[10px] text-rose-500 font-bold block">Action required</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Review
          </span>
          <div className="text-2xl font-bold font-display text-amber-700">{metrics.needsReview}</div>
          <span className="text-[10px] text-neutral-400 block">Needs manual check</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Unchecked</span>
          <div className="text-2xl font-bold font-display text-neutral-400">{metrics.notChecked}</div>
          <span className="text-[10px] text-neutral-400 block">Awaiting evaluation</span>
        </div>
      </div>

      {/* Critical Pending Alert */}
      {metrics.criticalPending > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-4 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {metrics.criticalPending} Critical or High-Priority Checkpoints Require Remediation
              </p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Review failed and flagged items in Red before initiating public DNS propagation or customer traffic.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('failed');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shrink-0 hover:bg-rose-700 transition-colors cursor-pointer"
          >
            View Blockers
          </button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        {/* Category Scroll Tabs */}
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {categoriesList.map(cat => {
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                      : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-[#D6B46A]/20 text-[#D6B46A]' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Status Filter & Export Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search checklist items, descriptions, or notes..."
                className="w-full h-9 pl-9 pr-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              />
            </div>

            <div className="w-40">
              <CustomSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'passed', label: 'Passed Only' },
                  { value: 'failed', label: 'Failed Blockers' },
                  { value: 'needs_review', label: 'Needs Review' },
                  { value: 'not_checked', label: 'Not Checked' },
                  { value: 'not_applicable', label: 'Not Applicable' }
                ]}
              />
            </div>
          </div>

          <CustomExportControls
            onExportJson={handleExportJson}
            onExportMarkdown={handleExportMarkdown}
            onExportTxt={handleExportTxt}
            onPrint={() => window.print()}
            copyText={generateMarkdownReport()}
            copyLabel="Copy Dossier"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3" id="checklist-items-container">
        {filteredItems.length === 0 ? (
          <CustomEmptyState
            title="No checklist items match your filters"
            description="Try clearing your search keyword or switching category and status filters."
            actionText="Clear Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }}
          />
        ) : (
          filteredItems.map(item => {
            const isNotesExpanded = expandedNotesId === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 shadow-xs space-y-3.5 ${
                  item.status === 'passed'
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : item.status === 'failed'
                    ? 'border-rose-300 bg-rose-50/20'
                    : item.status === 'needs_review'
                    ? 'border-amber-300 bg-amber-50/15'
                    : 'border-neutral-200 hover:border-[#D6B46A]/50'
                }`}
              >
                {/* Header & Status Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                        {item.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${
                        item.priority === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {item.priority} Priority
                      </span>
                    </div>

                    <h4 className="font-display text-sm sm:text-base font-bold text-neutral-900">
                      {item.title}
                    </h4>

                    <p className="text-xs text-neutral-600 leading-relaxed max-w-4xl">
                      {item.description}
                    </p>
                  </div>

                  {/* Status Toggle Button Group */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-neutral-50 p-1 rounded-xl border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'passed')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        item.status === 'passed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'failed')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        item.status === 'failed'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Fail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'needs_review')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        item.status === 'needs_review'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'not_applicable')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        item.status === 'not_applicable'
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-neutral-700'
                      }`}
                    >
                      N/A
                    </button>
                  </div>
                </div>

                {/* Remediation Fix Banner */}
                <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-700 leading-relaxed flex-1">
                    <strong className="text-neutral-900 font-bold">Suggested Remediation: </strong>
                    {item.suggestedFix}
                  </div>
                </div>

                {/* Evidence & Notes Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.evidence && (
                        <span className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          Evidence: {item.evidence}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedNotesId(isNotesExpanded ? null : item.id)}
                      className="text-xs font-bold text-[#8F722E] hover:text-[#111111] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isNotesExpanded ? 'Hide Notes' : item.notes ? 'Edit Notes' : '+ Add Notes & Evidence'}</span>
                    </button>
                  </div>

                  {isNotesExpanded && (
                    <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Audit Notes & Observations
                        </label>
                        <textarea
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                          placeholder="e.g. Tested on iPhone 15 Safari; CTA modal opens smoothly."
                          rows={2}
                          className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Technical Evidence / Link / Selector
                        </label>
                        <textarea
                          value={item.evidence || ''}
                          onChange={(e) => handleUpdateEvidence(item.id, e.target.value)}
                          placeholder="e.g. Header nav inspected at commit 4f2a1b; response headers include HSTS."
                          rows={2}
                          className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
