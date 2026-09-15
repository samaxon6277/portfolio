import React, { useState, useMemo } from 'react';
import { 
  GitCompare, Copy, Download, Trash2, ArrowRightLeft, Check, 
  Sparkles, ShieldCheck, HelpCircle, ArrowRight, AlertCircle, 
  FileText, Columns, AlignLeft, Eye, EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomUi } from '../../context/CustomUiContext';

type DiffMode = 'lines' | 'words';
type ViewLayout = 'split' | 'unified';

interface DiffItem {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNumOrig?: number;
  lineNumMod?: number;
}

const SAMPLE_ORIGINAL = `SamaXon Digital Solutions is a premier digital technology agency.
We engineer high-performance web systems and bespoke software.
Our commitment is zero telemetry, client-side privacy, and top speeds.
All utilities operate 100% in your browser.
Contact our engineering team for custom enterprise projects.`;

const SAMPLE_MODIFIED = `SamaXon Digital Solutions is a global digital architecture firm.
We engineer high-performance web applications and cloud software.
Our commitment is zero telemetry, client-side privacy, and top speeds.
All utilities operate 100% in your browser without server uploads.
Contact our senior engineering wing for custom enterprise deployments.`;

export default function TextDiffChecker() {
  const { showToast, showConfirm } = useCustomUi();

  const [originalText, setOriginalText] = useState<string>('');
  const [modifiedText, setModifiedText] = useState<string>('');
  const [diffMode, setDiffMode] = useState<DiffMode>('lines');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('split');
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Core LCS Diff Algorithm (Longest Common Subsequence)
  const diffResult = useMemo(() => {
    const orig = originalText;
    const mod = modifiedText;

    if (!orig && !mod) {
      return {
        items: [] as DiffItem[],
        addedCount: 0,
        removedCount: 0,
        unchangedCount: 0,
        similarityPercent: 100
      };
    }

    // Prepare tokens based on mode
    let origTokens: string[] = [];
    let modTokens: string[] = [];

    if (diffMode === 'lines') {
      origTokens = orig ? orig.split('\n') : [];
      modTokens = mod ? mod.split('\n') : [];
    } else {
      // Word mode: tokenize words and whitespace
      const wordRegex = /[\s\S]/;
      origTokens = orig.match(/\S+|\s+/g) || [];
      modTokens = mod.match(/\S+|\s+/g) || [];
    }

    // Comparison normalizer
    const normalize = (token: string) => {
      let t = token;
      if (ignoreWhitespace) t = t.trim();
      if (ignoreCase) t = t.toLowerCase();
      return t;
    };

    const n = origTokens.length;
    const m = modTokens.length;

    // Build LCS matrix (bounded to max 1200 tokens to avoid performance bottlenecks)
    const MAX_TOKENS = 1200;
    const safeN = Math.min(n, MAX_TOKENS);
    const safeM = Math.min(m, MAX_TOKENS);

    const dp: number[][] = Array.from({ length: safeN + 1 }, () => new Array(safeM + 1).fill(0));

    for (let i = 0; i < safeN; i++) {
      for (let j = 0; j < safeM; j++) {
        if (normalize(origTokens[i]) === normalize(modTokens[j])) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Backtrack to find diff
    let i = safeN;
    let j = safeM;
    const items: DiffItem[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(origTokens[i - 1]) === normalize(modTokens[j - 1])) {
        items.unshift({
          type: 'unchanged',
          value: origTokens[i - 1],
          lineNumOrig: i,
          lineNumMod: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        items.unshift({
          type: 'added',
          value: modTokens[j - 1],
          lineNumMod: j
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        items.unshift({
          type: 'removed',
          value: origTokens[i - 1],
          lineNumOrig: i
        });
        i--;
      }
    }

    // Counts
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    items.forEach(it => {
      if (it.type === 'added') addedCount++;
      else if (it.type === 'removed') removedCount++;
      else unchangedCount++;
    });

    const total = addedCount + removedCount + unchangedCount;
    const similarityPercent = total > 0 ? Math.round((unchangedCount / total) * 100) : 100;

    return {
      items,
      addedCount,
      removedCount,
      unchangedCount,
      similarityPercent
    };
  }, [originalText, modifiedText, diffMode, ignoreCase, ignoreWhitespace]);

  // Actions
  const handleSwap = () => {
    const prevOrig = originalText;
    setOriginalText(modifiedText);
    setModifiedText(prevOrig);
    showToast('Original and Modified texts swapped', 'info');
  };

  const handleClear = () => {
    if (!originalText && !modifiedText) return;
    showConfirm({
      title: 'Clear Comparison',
      message: 'Are you sure you want to clear both the original and modified text buffers?',
      confirmText: 'Yes, Clear All',
      cancelText: 'Cancel',
      onConfirm: () => {
        setOriginalText('');
        setModifiedText('');
        showToast('Both text editors cleared', 'info');
      }
    });
  };

  const handleLoadSample = () => {
    setOriginalText(SAMPLE_ORIGINAL);
    setModifiedText(SAMPLE_MODIFIED);
    showToast('Sample comparison text loaded', 'info');
  };

  const handleCopyReport = async () => {
    if (!originalText && !modifiedText) return;

    let report = `SAMAXON TEXT DIFF REPORT\nMode: ${diffMode}\nSimilarity: ${diffResult.similarityPercent}%\nChanges: +${diffResult.addedCount} additions, -${diffResult.removedCount} removals\n\n`;
    diffResult.items.forEach(it => {
      const prefix = it.type === 'added' ? '+ ' : it.type === 'removed' ? '- ' : '  ';
      report += `${prefix}${it.value}\n`;
    });

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      showToast('Diff report copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy diff', 'error');
    }
  };

  const handleDownloadReport = () => {
    if (!originalText && !modifiedText) return;
    let content = `--- Original Text ---\n${originalText}\n\n--- Modified Text ---\n${modifiedText}\n\n--- Unified Diff Report ---\n`;
    diffResult.items.forEach(it => {
      const prefix = it.type === 'added' ? '+ ' : it.type === 'removed' ? '- ' : '  ';
      content += `${prefix}${it.value}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `samaxon-diff-${Date.now()}.diff`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Diff file downloaded', 'success');
  };

  return (
    <div className="space-y-12 text-left" id="text-diff-checker-tool">
      {/* Header & Subtitle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
            TEXT & CODE REVISION ENGINE
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D6B46A]/15 text-[#A68936] text-[11px] font-mono font-bold rounded-md border border-[#D6B46A]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A68936]" />
            100% Client-Side · High-Fidelity LCS Algorithm
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111111] tracking-tight">
          Text Diff Checker
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
          Compare two pieces of text, contracts, or code side-by-side. Instantly highlight additions, deletions, and line-level changes with mathematical accuracy without sending your data anywhere.
        </p>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Mode: Lines vs Words */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setDiffMode('lines')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  diffMode === 'lines' ? 'bg-[#111111] text-[#D6B46A] shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Line-by-Line
              </button>
              <button
                type="button"
                onClick={() => setDiffMode('words')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  diffMode === 'words' ? 'bg-[#111111] text-[#D6B46A] shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Word-by-Word
              </button>
            </div>

            {/* Layout Toggle: Split vs Unified */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewLayout('split')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewLayout === 'split' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('unified')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewLayout === 'unified' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Unified</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ignore Toggles */}
            <button
              type="button"
              onClick={() => setIgnoreCase(!ignoreCase)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono border transition-colors cursor-pointer ${
                ignoreCase ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-neutral-50 text-neutral-600 border-neutral-200'
              }`}
            >
              Ignore Case
            </button>

            <button
              type="button"
              onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono border transition-colors cursor-pointer ${
                ignoreWhitespace ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-neutral-50 text-neutral-600 border-neutral-200'
              }`}
            >
              Ignore Spaces
            </button>

            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F9F5EC] border border-[#D6B46A]/30 text-[#A68936] text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample</span>
            </button>

            <button
              type="button"
              onClick={handleSwap}
              className="p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              title="Swap Texts"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Area Inputs (Dual Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Text Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Original Text (Before)
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {originalText.length} chars · {originalText ? originalText.split('\n').length : 0} lines
              </span>
            </div>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste original source text or code here..."
              rows={8}
              className="w-full p-3.5 bg-neutral-50 text-neutral-900 font-mono text-xs border border-neutral-200 rounded-2xl focus:outline-none focus:border-[#A68936] focus:bg-white resize-y"
            />
          </div>

          {/* Modified Text Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Modified Text (After)
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {modifiedText.length} chars · {modifiedText ? modifiedText.split('\n').length : 0} lines
              </span>
            </div>
            <textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Paste modified revised text or code here..."
              rows={8}
              className="w-full p-3.5 bg-neutral-50 text-neutral-900 font-mono text-xs border border-neutral-200 rounded-2xl focus:outline-none focus:border-[#A68936] focus:bg-white resize-y"
            />
          </div>
        </div>

        {/* Diff Metrics Badge Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Text Similarity</span>
            <p className="font-mono font-bold text-sm sm:text-base text-neutral-900">
              {diffResult.similarityPercent}% Match
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-600 uppercase font-bold">Additions (+)</span>
            <p className="font-mono font-bold text-sm sm:text-base text-emerald-700">
              +{diffResult.addedCount} {diffMode}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-rose-600 uppercase font-bold">Deletions (-)</span>
            <p className="font-mono font-bold text-sm sm:text-base text-rose-700">
              -{diffResult.removedCount} {diffMode}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Unchanged</span>
            <p className="font-mono font-bold text-sm sm:text-base text-neutral-700">
              {diffResult.unchangedCount} {diffMode}
            </p>
          </div>
        </div>

        {/* Comparison Output Display Box */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-900 uppercase flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-[#A68936]" />
              Diff Comparison Result
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyReport}
                disabled={diffResult.items.length === 0}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Diff!' : 'Copy Diff'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={diffResult.items.length === 0}
                className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] disabled:opacity-40 text-[#D6B46A] border border-[#D6B46A]/30 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .diff</span>
              </button>
            </div>
          </div>

          {diffResult.items.length > 0 ? (
            <div className="bg-neutral-900 text-neutral-100 rounded-2xl border border-neutral-800 overflow-hidden font-mono text-xs leading-relaxed max-h-[450px] overflow-y-auto">
              <div className="divide-y divide-neutral-800/60">
                {diffResult.items.map((it, idx) => {
                  if (it.type === 'added') {
                    return (
                      <div key={idx} className="flex items-start bg-emerald-950/40 text-emerald-200 px-3 py-1 gap-3">
                        <span className="w-6 text-emerald-400 font-bold shrink-0 select-none text-right font-mono">+</span>
                        <span className="flex-1 whitespace-pre-wrap break-all">{it.value}</span>
                      </div>
                    );
                  }
                  if (it.type === 'removed') {
                    return (
                      <div key={idx} className="flex items-start bg-rose-950/40 text-rose-200 px-3 py-1 gap-3">
                        <span className="w-6 text-rose-400 font-bold shrink-0 select-none text-right font-mono">-</span>
                        <span className="flex-1 whitespace-pre-wrap break-all line-through opacity-80">{it.value}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="flex items-start text-neutral-400 hover:text-neutral-200 px-3 py-1 gap-3">
                      <span className="w-6 text-neutral-600 shrink-0 select-none text-right font-mono">{it.lineNumOrig || ''}</span>
                      <span className="flex-1 whitespace-pre-wrap break-all">{it.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl text-xs font-mono text-neutral-500">
              Enter or paste text into both boxes above to see real-time line-by-line or word-by-word differences.
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">How does the comparison algorithm work?</p>
            <p className="text-neutral-600 mt-1">
              The tool uses a variant of the Longest Common Subsequence (LCS) algorithm similar to Unix <code>diff</code> and Git. It identifies identical sequences across both texts and flags insertions (+) and deletions (-) without altering surrounding unchanged context.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">When should I use Word-by-Word instead of Line-by-Line?</p>
            <p className="text-neutral-600 mt-1">
              Line-by-Line is ideal for source code, configuration files, and scripts where line structure matters. Word-by-Word is ideal for reviewing contractual agreements, essays, legal documents, and editorial copy where single words or phrases have been swapped inside a long paragraph.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Is my sensitive text stored or transmitted?</p>
            <p className="text-neutral-600 mt-1">
              No. Processing occurs 100% in your local browser memory. Text is never sent over any network socket or saved in any remote store.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Recommendations */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-[#A68936] font-bold uppercase tracking-wider">Related Text & Document Tools</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            to="/tools/word-counter"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Word Counter & Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Detailed word counts, reading speeds, and keyword density.</p>
          </Link>

          <Link
            to="/tools/json-formatter-validator"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>JSON Formatter & Validator</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Prettify and validate structured JSON payloads.</p>
          </Link>

          <Link
            to="/tools/website-privacy-policy-builder"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Privacy Policy Builder</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Generate compliant legal policies aligned with DPDPA & GDPR.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
