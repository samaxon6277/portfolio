import React, { useState, useMemo, useRef } from 'react';
import { 
  Code2, CheckCircle2, AlertTriangle, Copy, Download, Trash2, 
  FileCode, Sparkles, ArrowRight, ShieldCheck, HelpCircle, RefreshCw, 
  Minimize2, Maximize2, FileJson, Check, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomUi } from '../../context/CustomUiContext';

type IndentType = '2' | '4' | 'tab';

interface JsonStats {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
    snippet?: string;
  };
  sizeBytes: number;
  charCount: number;
  lineCount: number;
  type: 'object' | 'array' | 'primitive' | 'empty';
  elementCount: number;
  maxDepth: number;
}

const SAMPLE_JSON = `{
  "projectName": "SamaXon Studio",
  "version": "2.4.0",
  "status": "production",
  "features": [
    "100% Client-Side Processing",
    "Zero Server Uploads",
    "Instant Verification"
  ],
  "author": {
    "organization": "SamaXon Digital Solutions",
    "location": "Global",
    "verified": true
  },
  "metrics": {
    "toolsActive": 35,
    "uptimePercent": 99.99
  }
}`;

export default function JsonFormatterValidator() {
  const { showToast, showConfirm } = useCustomUi();
  const [inputJson, setInputJson] = useState<string>('');
  const [indentation, setIndentation] = useState<IndentType>('2');
  const [copiedType, setCopiedType] = useState<'formatted' | 'minified' | null>(null);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to compute JSON nesting depth
  const computeDepth = (obj: any, currentDepth = 1): number => {
    if (obj === null || typeof obj !== 'object') return currentDepth;
    let max = currentDepth;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const d = computeDepth(obj[key], currentDepth + 1);
        if (d > max) max = d;
      }
    }
    return max;
  };

  // Helper to locate error line and column from JSON.parse error
  const parseJsonWithDiagnostics = (raw: string): JsonStats => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return {
        valid: false,
        sizeBytes: 0,
        charCount: 0,
        lineCount: 0,
        type: 'empty',
        elementCount: 0,
        maxDepth: 0
      };
    }

    const lines = raw.split('\n');
    const sizeBytes = new Blob([raw]).size;

    try {
      const parsed = JSON.parse(trimmed);
      const isArray = Array.isArray(parsed);
      const isObject = parsed !== null && typeof parsed === 'object' && !isArray;
      const type: JsonStats['type'] = isArray ? 'array' : isObject ? 'object' : 'primitive';

      let elementCount = 0;
      if (isArray) elementCount = parsed.length;
      else if (isObject) elementCount = Object.keys(parsed).length;
      else elementCount = 1;

      const maxDepth = computeDepth(parsed);

      return {
        valid: true,
        sizeBytes,
        charCount: raw.length,
        lineCount: lines.length,
        type,
        elementCount,
        maxDepth
      };
    } catch (err: any) {
      let message = err.message || 'Invalid JSON syntax';
      let line: number | undefined;
      let column: number | undefined;
      let snippet: string | undefined;

      // Extract line & column information if available in message (e.g., "at position 45" or "line 2 column 5")
      const posMatch = message.match(/position\s+(\d+)/i);
      const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);

      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      } else if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        let charsCounted = 0;
        for (let i = 0; i < lines.length; i++) {
          const lineLen = lines[i].length + 1; // including newline
          if (charsCounted + lineLen >= pos) {
            line = i + 1;
            column = Math.max(1, pos - charsCounted + 1);
            break;
          }
          charsCounted += lineLen;
        }
      }

      // If line is identified, extract snippet
      if (line && line <= lines.length) {
        snippet = lines[line - 1].trim();
      }

      // Friendly explanation for common pitfalls
      if (message.includes('Expected property name') || message.includes('key string')) {
        message += ' (Make sure all object keys are wrapped in double quotes "")';
      } else if (message.includes('Unexpected token \'')) {
        message += ' (JSON strictly requires double quotes "", single quotes are not permitted)';
      } else if (message.includes('Unexpected token ,') || message.includes('trailing comma')) {
        message += ' (JSON does not permit trailing commas after the last array item or object key)';
      }

      return {
        valid: false,
        error: { message, line, column, snippet },
        sizeBytes,
        charCount: raw.length,
        lineCount: lines.length,
        type: 'empty',
        elementCount: 0,
        maxDepth: 0
      };
    }
  };

  const stats = useMemo(() => parseJsonWithDiagnostics(inputJson), [inputJson]);

  // Format / Prettify Action
  const handlePrettify = () => {
    if (!inputJson.trim()) {
      showToast('Please enter or paste JSON to format', 'info');
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      const indent = indentation === 'tab' ? '\t' : parseInt(indentation, 10);
      const formatted = JSON.stringify(parsed, null, indent);
      setInputJson(formatted);
      showToast(`JSON formatted successfully (${indentation === 'tab' ? 'Tabs' : indentation + ' spaces'})`, 'success');
    } catch {
      showToast('Cannot format invalid JSON. Please resolve the syntax error below.', 'error');
    }
  };

  // Minify Action
  const handleMinify = () => {
    if (!inputJson.trim()) {
      showToast('Please enter or paste JSON to minify', 'info');
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
      showToast('JSON minified into a single compact line', 'success');
    } catch {
      showToast('Cannot minify invalid JSON. Please resolve the syntax error below.', 'error');
    }
  };

  // Copy Formatted
  const handleCopyFormatted = async () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      const indent = indentation === 'tab' ? '\t' : parseInt(indentation, 10);
      const formatted = JSON.stringify(parsed, null, indent);
      await navigator.clipboard.writeText(formatted);
      setCopiedType('formatted');
      showToast('Formatted JSON copied to clipboard', 'success');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      await navigator.clipboard.writeText(inputJson);
      setCopiedType('formatted');
      showToast('JSON copied to clipboard', 'success');
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  // Copy Minified
  const handleCopyMinified = async () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      await navigator.clipboard.writeText(minified);
      setCopiedType('minified');
      showToast('Minified JSON copied to clipboard', 'success');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      showToast('Cannot minify invalid JSON. Resolve syntax error before copying.', 'error');
    }
  };

  // Download .json
  const handleDownload = () => {
    if (!inputJson.trim()) {
      showToast('No JSON data to download', 'info');
      return;
    }
    const blob = new Blob([inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samaxon-formatted-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('JSON file downloaded successfully', 'success');
  };

  // Clear with confirmation if non-empty
  const handleClear = () => {
    if (!inputJson.trim()) return;
    showConfirm({
      title: 'Clear JSON Editor',
      message: 'Are you sure you want to clear the editor? All unsaved JSON text will be removed.',
      confirmText: 'Yes, Clear Editor',
      cancelText: 'Cancel',
      onConfirm: () => {
        setInputJson('');
        showToast('Editor cleared', 'info');
      }
    });
  };

  // Load Example
  const handleLoadExample = () => {
    setInputJson(SAMPLE_JSON);
    showToast('Sample JSON loaded for demonstration', 'info');
  };

  return (
    <div className="space-y-12 text-left" id="json-formatter-validator-tool">
      {/* Header & Subtitle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
            DEVELOPER & API UTILITIES
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D6B46A]/15 text-[#A68936] text-[11px] font-mono font-bold rounded-md border border-[#D6B46A]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A68936]" />
            100% Client-Side · Zero Server Uploads
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111111] tracking-tight">
          JSON Formatter & Validator
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
          Prettify, minify, validate, and inspect JSON payloads with real-time syntax checking. Processed entirely inside your local browser memory — no data is ever transmitted to a server or stored.
        </p>
      </div>

      {/* Main Interactive Workspace Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Editor Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          {/* Left Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrettify}
              disabled={!inputJson.trim()}
              className="px-4 py-2 bg-[#111111] hover:bg-[#222222] disabled:opacity-40 text-[#D6B46A] text-xs font-mono font-bold rounded-xl border border-[#D6B46A]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Format / Prettify</span>
            </button>

            <button
              type="button"
              onClick={handleMinify}
              disabled={!inputJson.trim()}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 text-xs font-mono font-semibold rounded-xl border border-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Minimize2 className="w-3.5 h-3.5 text-neutral-600" />
              <span>Minify</span>
            </button>

            {/* Indentation Selector */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono">
              <span className="text-neutral-500 text-[11px]">Indent:</span>
              <button
                type="button"
                onClick={() => setIndentation('2')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  indentation === '2' ? 'bg-[#111111] text-[#D6B46A]' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setIndentation('4')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  indentation === '4' ? 'bg-[#111111] text-[#D6B46A]' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                4
              </button>
              <button
                type="button"
                onClick={() => setIndentation('tab')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  indentation === 'tab' ? 'bg-[#111111] text-[#D6B46A]' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Tab
              </button>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setWordWrap(!wordWrap)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors border cursor-pointer ${
                wordWrap 
                  ? 'bg-neutral-100 border-neutral-300 text-neutral-800 font-bold' 
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Wrap: {wordWrap ? 'On' : 'Off'}
            </button>

            <button
              type="button"
              onClick={handleLoadExample}
              className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F9F5EC] border border-[#D6B46A]/30 text-[#A68936] text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Load Example</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!inputJson.trim()}
              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 rounded-xl transition-colors cursor-pointer"
              title="Clear Editor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Validation Status Banner */}
        {inputJson.trim() ? (
          stats.valid ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono font-bold">Valid JSON Syntax</span>
                <span className="text-emerald-700 hidden sm:inline">· Structure parsed successfully with zero errors</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-700">
                <span>Type: <strong className="text-emerald-900 capitalize">{stats.type}</strong></span>
                <span>Depth: <strong className="text-emerald-900">{stats.maxDepth}</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs text-rose-900">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-mono font-bold text-rose-800">
                    Syntax Error Detected: {stats.error?.message}
                  </div>
                  {stats.error?.line && (
                    <div className="font-mono text-[11px] text-rose-700">
                      Location: Line <strong>{stats.error.line}</strong>{stats.error.column ? `, Column ${stats.error.column}` : ''}
                    </div>
                  )}
                  {stats.error?.snippet && (
                    <div className="mt-1.5 p-2 bg-rose-100/70 rounded-lg font-mono text-[11px] text-rose-950 overflow-x-auto">
                      Line {stats.error.line}: {stats.error.snippet}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="p-3 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl flex items-center justify-between text-xs text-neutral-500">
            <span className="font-mono">Paste or type JSON below to validate and format in real time.</span>
            <span className="text-[11px] font-mono text-neutral-400">Strict RFC 8259 Standard</span>
          </div>
        )}

        {/* Text Area Code Editor */}
        <div className="relative rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-900 focus-within:border-[#D6B46A] transition-colors">
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 text-[11px] font-mono text-neutral-300 border-b border-neutral-700">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>JSON Input / Output Buffer</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Lines: {stats.lineCount}</span>
              <span>Chars: {stats.charCount}</span>
              <span>Size: {(stats.sizeBytes / 1024).toFixed(2)} KB</span>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='{\n  "status": "ready",\n  "message": "Paste your JSON here..."\n}'
            wrap={wordWrap ? 'soft' : 'off'}
            spellCheck={false}
            rows={14}
            className="w-full p-4 bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y selection:bg-[#D6B46A]/30"
          />
        </div>

        {/* Actions & Export Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyFormatted}
              disabled={!inputJson.trim()}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {copiedType === 'formatted' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'formatted' ? 'Copied Formatted!' : 'Copy Formatted'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMinified}
              disabled={!inputJson.trim() || !stats.valid}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {copiedType === 'minified' ? <Check className="w-4 h-4 text-emerald-600" /> : <Minimize2 className="w-4 h-4" />}
              <span>{copiedType === 'minified' ? 'Copied Minified!' : 'Copy Minified'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!inputJson.trim()}
            className="px-5 py-2.5 bg-[#111111] hover:bg-[#222222] disabled:opacity-40 text-[#D6B46A] border border-[#D6B46A]/40 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Real-time Payload Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Payload Status</span>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${inputJson.trim() ? (stats.valid ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-neutral-300'}`} />
            <span className="font-mono font-bold text-sm sm:text-base text-neutral-900">
              {!inputJson.trim() ? 'Empty Buffer' : stats.valid ? 'Valid JSON' : 'Syntax Error'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Elements / Keys</span>
          <p className="font-mono font-bold text-sm sm:text-base text-neutral-900">
            {stats.valid ? `${stats.elementCount} ${stats.type === 'array' ? 'items' : 'keys'}` : '—'}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Max Nesting Depth</span>
          <p className="font-mono font-bold text-sm sm:text-base text-neutral-900">
            {stats.valid ? `Level ${stats.maxDepth}` : '—'}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Memory Footprint</span>
          <p className="font-mono font-bold text-sm sm:text-base text-[#A68936]">
            {stats.sizeBytes > 0 ? `${stats.sizeBytes.toLocaleString()} bytes` : '0 bytes'}
          </p>
        </div>
      </div>

      {/* Educational & Common Pitfalls Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide font-mono flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#A68936]" />
            Common JSON Syntax Pitfalls
          </h3>
          <ul className="space-y-2.5 text-xs text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-rose-600 font-mono">1.</span>
              <span><strong>Trailing Commas:</strong> Unlike JavaScript objects, JSON strictly forbids a comma after the final key or array item (e.g., <code>&#123;"a": 1,&#125;</code> is invalid).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-rose-600 font-mono">2.</span>
              <span><strong>Single Quotes:</strong> All JSON keys and string values must be enclosed in double quotes (<code>"key"</code>). Single quotes (<code>'key'</code>) will trigger syntax errors.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-rose-600 font-mono">3.</span>
              <span><strong>Unquoted Object Keys:</strong> Every dictionary key in JSON must be a quoted string. Unquoted keys like <code>&#123;name: "John"&#125;</code> are not permitted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-rose-600 font-mono">4.</span>
              <span><strong>Non-JSON Values:</strong> <code>undefined</code>, functions, and <code>NaN</code> cannot be represented in standard JSON format.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide font-mono flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#A68936]" />
            Minify vs. Prettify
          </h3>
          <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
            <p>
              <strong>Prettify (Formatting):</strong> Inserts consistent indentation (2 spaces, 4 spaces, or tabs) and line breaks to make hierarchical data human-readable for debugging, code reviews, and API documentation.
            </p>
            <p>
              <strong>Minify (Compression):</strong> Strips all non-essential whitespace, line breaks, and indentation outside of quoted string values. Minified JSON significantly reduces network payload sizes and optimizes database storage.
            </p>
            <p className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
              Both transformations preserve 100% of data types, keys, numbers, and boolean states identically.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">Is my JSON data uploaded or stored on your servers?</p>
            <p className="text-neutral-600 mt-1">
              No. SamaXon’s JSON Formatter & Validator executes 100% on the client side inside your web browser. Neither your text, API keys, customer records, nor payloads are ever transmitted over the network or persisted to any cloud database.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">What is the maximum JSON file size supported?</p>
            <p className="text-neutral-600 mt-1">
              Because parsing runs entirely in-memory using JavaScript’s native <code>JSON.parse()</code> and <code>JSON.stringify()</code>, it comfortably handles files up to tens of megabytes depending on your device’s available RAM.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">How does the validator locate syntax errors?</p>
            <p className="text-neutral-600 mt-1">
              When a syntax error occurs, our diagnostic parser calculates the exact character byte offset, computes the corresponding line and column number, and displays the exact offending line for quick remediation.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Recommendations */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-[#A68936] font-bold uppercase tracking-wider">Related Developer Tools</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            to="/tools/api-request-builder"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>API Request Builder</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Build and execute HTTP REST requests with custom JSON headers.</p>
          </Link>

          <Link
            to="/tools/url-encoder-decoder"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>URL Encoder & Decoder</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Encode URI components and query strings safely.</p>
          </Link>

          <Link
            to="/tools/text-diff-checker"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Text Diff Checker</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Compare two JSON payloads side-by-side to highlight changes.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
