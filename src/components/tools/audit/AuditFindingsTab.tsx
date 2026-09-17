import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, AlertTriangle, CheckCircle2, XCircle, 
  Info, ChevronDown, ChevronUp, Copy, Check, Terminal, 
  Wrench, Layers, ExternalLink, ArrowUpDown
} from 'lucide-react';
import { AuditFinding, AuditCategory, AuditSeverity } from '../../../utils/auditEngine/types';

interface AuditFindingsTabProps {
  findings: AuditFinding[];
  onRequestFix: (issueTitle: string) => void;
}

export const AuditFindingsTab: React.FC<AuditFindingsTabProps> = ({
  findings = [],
  onRequestFix
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'severity-desc' | 'severity-asc' | 'category' | 'title'>('severity-desc');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedEvidenceId, setCopiedEvidenceId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    findings.forEach(f => { all[f.id] = true; });
    setExpandedIds(all);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const copyFixSnippet = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const copyEvidence = (id: string, evidence: string) => {
    navigator.clipboard.writeText(evidence);
    setCopiedEvidenceId(id);
    setTimeout(() => setCopiedEvidenceId(null), 2000);
  };

  const severityWeight = (sev: AuditSeverity) => {
    switch (sev) {
      case 'critical': return 4;
      case 'warning': return 3;
      case 'info': return 2;
      case 'passed': return 1;
      default: return 0;
    }
  };

  const filteredAndSortedFindings = useMemo(() => {
    return findings
      .filter(finding => {
        // Category filter
        if (selectedCategory !== 'all' && finding.category !== selectedCategory) {
          return false;
        }

        // Severity filter
        if (selectedSeverity !== 'all' && finding.severity !== selectedSeverity) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = finding.title.toLowerCase().includes(q);
          const matchDesc = finding.description.toLowerCase().includes(q);
          const matchRec = finding.recommendation?.toLowerCase().includes(q);
          const matchEv = finding.evidence?.toLowerCase().includes(q);
          const matchFix = finding.fixSnippet?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchRec && !matchEv && !matchFix) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'severity-desc') {
          return severityWeight(b.severity) - severityWeight(a.severity);
        }
        if (sortBy === 'severity-asc') {
          return severityWeight(a.severity) - severityWeight(b.severity);
        }
        if (sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
  }, [findings, selectedCategory, selectedSeverity, searchQuery, sortBy]);

  const counts = useMemo(() => {
    return {
      all: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      warning: findings.filter(f => f.severity === 'warning').length,
      passed: findings.filter(f => f.severity === 'passed').length,
      info: findings.filter(f => f.severity === 'info').length
    };
  }, [findings]);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header & Metric Tally */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              Actionable Findings &amp; Technical Fixes
            </h3>
            <p className="text-xs text-[#8A8178]">
              Evidence-based issues identified across all categories with exact diagnostic snippets and developer remediation steps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#111111] rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Severity Count Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All (${counts.all})`, color: 'bg-[#111111] text-white' },
            { id: 'critical', label: `Critical (${counts.critical})`, color: 'bg-rose-100 text-rose-800' },
            { id: 'warning', label: `Warnings (${counts.warning})`, color: 'bg-amber-100 text-amber-800' },
            { id: 'passed', label: `Passed (${counts.passed})`, color: 'bg-emerald-100 text-emerald-800' },
            { id: 'info', label: `Info / N/A (${counts.info})`, color: 'bg-blue-100 text-blue-800' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSeverity(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedSeverity === tab.id
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[#F4EFE6]/60 text-[#8A8178] hover:text-[#111111] hover:bg-[#F4EFE6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Category & Sort Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8178]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings by title, evidence, fix..."
              className="w-full pl-10 pr-3 py-2 bg-[#FFFDF8] border border-[#D6B46A]/30 focus:border-[#D6B46A] rounded-xl text-xs font-mono text-[#111111] placeholder:text-[#8A8178] focus:outline-none"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#D6B46A]/30 focus:border-[#D6B46A] rounded-xl text-xs font-mono text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="performance">Performance &amp; Vitals</option>
              <option value="javascript">JavaScript &amp; Bundles</option>
              <option value="images">Images &amp; Media</option>
              <option value="fonts">Fonts &amp; Typography</option>
              <option value="network">Network &amp; Resources</option>
              <option value="seo">SEO &amp; Crawlability</option>
              <option value="accessibility">Accessibility (WCAG)</option>
              <option value="security">Security &amp; Headers</option>
              <option value="code">Code &amp; Markup</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#D6B46A]/30 focus:border-[#D6B46A] rounded-xl text-xs font-mono text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value="severity-desc">Sort: Severity (High to Low)</option>
              <option value="severity-asc">Sort: Severity (Low to High)</option>
              <option value="category">Sort: Category (A-Z)</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredAndSortedFindings.length > 0 ? (
          filteredAndSortedFindings.map(finding => {
            const isExpanded = !!expandedIds[finding.id];
            const isCritical = finding.severity === 'critical';
            const isWarning = finding.severity === 'warning';
            const isPassed = finding.severity === 'passed';

            return (
              <div
                key={finding.id}
                className={`border rounded-2xl transition-all overflow-hidden bg-white shadow-xs ${
                  isCritical 
                    ? 'border-rose-300' 
                    : isWarning 
                    ? 'border-amber-300' 
                    : isPassed 
                    ? 'border-emerald-200' 
                    : 'border-blue-200'
                }`}
              >
                {/* Clickable Header Bar */}
                <div 
                  onClick={() => toggleExpand(finding.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-black/[0.01] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {isCritical && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                    {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                    {isPassed && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                    {!isCritical && !isWarning && !isPassed && <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-black text-sm text-[#111111]">
                          {finding.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                          isCritical ? 'bg-rose-100 text-rose-800' : isWarning ? 'bg-amber-100 text-amber-800' : isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {finding.severity}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#85641C] font-bold bg-[#D6B46A]/15 px-2 py-0.5 rounded-md">
                          {finding.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A8178] leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isPassed && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestFix(finding.title);
                        }}
                        className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Fix</span>
                      </button>
                    )}

                    <div className="w-7 h-7 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#8A8178]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-[#FFFDF8] border-t border-black/5 space-y-4 animate-fade-in text-xs">
                    {/* Recommendation & Impact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {finding.recommendation && (
                        <div className="p-3.5 bg-white border border-[#D6B46A]/25 rounded-xl space-y-1">
                          <span className="font-mono font-bold uppercase text-[10px] text-[#85641C] block">
                            Recommended Action:
                          </span>
                          <p className="text-[#111111] leading-relaxed">
                            {finding.recommendation}
                          </p>
                        </div>
                      )}

                      {finding.impact && (
                        <div className="p-3.5 bg-white border border-[#D6B46A]/25 rounded-xl space-y-1">
                          <span className="font-mono font-bold uppercase text-[10px] text-[#8A8178] block">
                            Business / User Impact:
                          </span>
                          <p className="text-[#111111] leading-relaxed">
                            {finding.impact}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Evidence Snippet */}
                    {finding.evidence && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold uppercase text-[10px] text-[#8A8178]">
                            Observed Technical Evidence:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyEvidence(finding.id, finding.evidence!)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-[#85641C] hover:underline cursor-pointer"
                          >
                            {copiedEvidenceId === finding.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedEvidenceId === finding.id ? 'Copied' : 'Copy Evidence'}</span>
                          </button>
                        </div>
                        <pre className="p-3 bg-[#111111] text-[#FFFDF8] rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-40 border border-white/10">
                          {finding.evidence}
                        </pre>
                      </div>
                    )}

                    {/* Developer Fix Snippet */}
                    {finding.fixSnippet && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold uppercase text-[10px] text-emerald-800 flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5" />
                            Developer Code Snippet / Fix Template:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyFixSnippet(finding.id, finding.fixSnippet!)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            {copiedSnippetId === finding.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSnippetId === finding.id ? 'Copied Snippet' : 'Copy Fix Code'}</span>
                          </button>
                        </div>
                        <pre className="p-3.5 bg-[#18181B] text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-emerald-900/40">
                          {finding.fixSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-[#8A8178] bg-white border border-dashed border-[#D6B46A]/30 rounded-3xl space-y-2">
            <p className="font-bold text-[#111111]">No findings matched your criteria.</p>
            <p>Try clearing your search query or selecting "All Categories" / "All Severities".</p>
          </div>
        )}
      </div>
    </div>
  );
};
