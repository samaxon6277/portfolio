import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, CheckCircle2, AlertTriangle, Copy, RotateCcw, 
  Sparkles, Layers, ListFilter, HelpCircle, Code2, Check, ArrowRight
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, ResetButton, ClearButton } from './common/ToolActions';

interface RegexPatternPreset {
  title: string;
  pattern: string;
  flags: string;
  description: string;
  sampleText: string;
}

const CHEAT_SHEET_PATTERNS: RegexPatternPreset[] = [
  {
    title: 'Email Address (Standard)',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    description: 'Matches standard RFC-compliant corporate and personal email addresses.',
    sampleText: 'Contact support@samaxon.com or john.doe+dev@sub.company.org for inquiries.'
  },
  {
    title: 'URL (HTTP / HTTPS)',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'g',
    description: 'Captures full HTTP/HTTPS web links including paths, queries, and ports.',
    sampleText: 'Visit https://samaxon.com/tools and http://localhost:3000/test?query=alpha#anchor.'
  },
  {
    title: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    description: 'Matches valid IPv4 addresses in dotted-decimal format (0.0.0.0 to 255.255.255.255).',
    sampleText: 'Target servers: 192.168.1.1, 10.0.0.254, and external gateway 8.8.8.8.'
  },
  {
    title: 'ISO 8601 Date (YYYY-MM-DD)',
    pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    description: 'Matches standard calendar dates in Year-Month-Day order.',
    sampleText: 'Release dates: 2026-09-16, 2025-12-31, but excludes invalid 2026-13-40.'
  },
  {
    title: 'Hex Color Codes',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'g',
    description: 'Matches 3-character and 6-character hexadecimal color codes.',
    sampleText: 'Brand colors include #D6B46A, #111111, #fff, and accent #A68936.'
  },
  {
    title: 'Username (Alphanumeric)',
    pattern: '^[a-zA-Z0-9_]{3,16}$',
    flags: 'm',
    description: 'Ensures usernames are 3 to 16 characters long using letters, numbers, and underscores.',
    sampleText: 'samaxon_dev\nuser123\na\ninvalid-user!'
  }
];

const DEFAULT_PATTERN = '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})';
const DEFAULT_TEXT = `Welcome to the SamaXon Studio Regex Engine!
You can reach our engineering team at dev-lead@samaxon.com or inquiries@digital.org.
Secondary contact: hello.world@subdomain.example.co.uk.
Feel free to test any pattern, capture groups, and flags in real time.`;

interface MatchResult {
  matchIndex: number;
  fullMatch: string;
  index: number;
  length: number;
  groups: { name?: string; value: string; index: number }[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [testText, setTestText] = useState(DEFAULT_TEXT);
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    g: true,
    i: false,
    m: true,
    s: false,
    u: true,
    y: false
  });
  const [selectedMatchIdx, setSelectedMatchIdx] = useState<number | null>(null);

  const activeFlagsString = useMemo(() => {
    return Object.keys(flags)
      .filter(k => flags[k])
      .join('');
  }, [flags]);

  // Real execution with safety bounds (max 500 matches)
  const { matches, error, executionTimeMs } = useMemo(() => {
    if (!pattern) return { matches: [], error: null, executionTimeMs: 0 };

    const startTime = performance.now();
    try {
      const reg = new RegExp(pattern, activeFlagsString);
      const results: MatchResult[] = [];

      if (!flags.g && !flags.y) {
        const m = reg.exec(testText);
        if (m && m.index !== undefined) {
          const groups = [];
          if (m.length > 1) {
            for (let i = 1; i < m.length; i++) {
              groups.push({ value: m[i] || '', index: i });
            }
          }
          results.push({
            matchIndex: 0,
            fullMatch: m[0],
            index: m.index,
            length: m[0].length,
            groups
          });
        }
      } else {
        let match: RegExpExecArray | null;
        let count = 0;
        const maxMatches = 500;

        while ((match = reg.exec(testText)) !== null && count < maxMatches) {
          count++;
          const groups = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              groups.push({ value: match[i] || '', index: i });
            }
          }
          results.push({
            matchIndex: count - 1,
            fullMatch: match[0],
            index: match.index,
            length: match[0].length,
            groups
          });

          // Prevent zero-length infinite loop
          if (match.index === reg.lastIndex) {
            reg.lastIndex++;
          }
        }
      }

      const elapsed = performance.now() - startTime;
      return { matches: results, error: null, executionTimeMs: parseFloat(elapsed.toFixed(2)) };
    } catch (err: any) {
      return { matches: [], error: err.message || 'Invalid regular expression', executionTimeMs: 0 };
    }
  }, [pattern, activeFlagsString, testText, flags]);

  // Render Highlighted Text
  const renderedHighlightedText = useMemo(() => {
    if (!matches.length || error) return testText;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      // Unmatched leading text
      if (m.index > lastIndex) {
        parts.push(testText.slice(lastIndex, m.index));
      }

      // Matched text
      const isSelected = selectedMatchIdx === m.matchIndex;
      parts.push(
        <mark
          key={`match-${idx}`}
          onClick={() => setSelectedMatchIdx(m.matchIndex)}
          className={`px-1 py-0.5 rounded cursor-pointer transition-all font-mono font-bold ${
            isSelected
              ? 'bg-[#D6B46A] text-neutral-900 ring-2 ring-[#111111]'
              : idx % 2 === 0
              ? 'bg-amber-200/90 text-amber-950 hover:bg-amber-300'
              : 'bg-emerald-200/90 text-emerald-950 hover:bg-emerald-300'
          }`}
          title={`Match #${m.matchIndex + 1} at offset ${m.index}`}
        >
          {m.fullMatch}
        </mark>
      );

      lastIndex = m.index + m.length;
    });

    if (lastIndex < testText.length) {
      parts.push(testText.slice(lastIndex));
    }

    return parts;
  }, [testText, matches, error, selectedMatchIdx]);

  return (
    <div className="space-y-8 text-left" id="regex-tester">
      <ToolHeader
        title="Regex Tester & Real-Time Pattern Visualizer"
        description="Test and debug JavaScript regular expressions with instant capture group parsing, match telemetry, and syntax error diagnosis."
        icon={Search}
        categoryName="Development & QA"
        categorySlug="development-qa"
        badgeText="100% IN-BROWSER · REAL-TIME REGEX"
      />

      {/* Pattern & Flags Workspace */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="regex-pattern" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
              Regular Expression Pattern
            </label>
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
              {(['g', 'i', 'm', 's', 'u'] as const).map(flag => (
                <button
                  key={flag}
                  type="button"
                  onClick={() => setFlags(f => ({ ...f, [flag]: !f[flag] }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    flags[flag] ? 'bg-[#111111] text-[#D6B46A]' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title={`Toggle flag /${flag}/`}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900 text-neutral-100 rounded-2xl p-2 px-4 border border-neutral-800">
            <span className="font-mono text-neutral-500 text-lg">/</span>
            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([a-z]+)@([a-z]+)"
              spellCheck={false}
              className="flex-1 bg-transparent font-mono text-sm sm:text-base text-neutral-100 focus:outline-none selection:bg-[#D6B46A]/30"
            />
            <span className="font-mono text-neutral-500 text-lg">/{activeFlagsString}</span>
          </div>

          {error ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-mono">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Valid Regex · {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </span>
              <span>Execution: {executionTimeMs} ms</span>
            </div>
          )}
        </div>

        {/* Test Text & Highlighted Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Editor Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-neutral-600">
              <label htmlFor="test-text-input" className="font-bold uppercase">Test Text Input</label>
              <ClearButton onClear={() => setTestText('')} />
            </div>
            <textarea
              id="test-text-input"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full p-4 bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-sm rounded-2xl resize-y focus:outline-none selection:bg-[#D6B46A]/30 leading-relaxed border border-neutral-800"
            />
          </div>

          {/* Real-time Match Visualizer */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-neutral-600 block">
              Match Highlights & Offsets
            </span>
            <div className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl min-h-[260px] max-h-[360px] overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 select-text">
              {renderedHighlightedText}
            </div>
          </div>
        </div>
      </div>

      {/* Match Inspector & Capture Groups Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <ListFilter className="w-4 h-4 text-[#A68936]" />
            Match Inspector ({matches.length})
          </h3>

          {matches.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 py-6 text-center">
              No matches found in the current text buffer.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {matches.map((m) => (
                <div
                  key={m.matchIndex}
                  onClick={() => setSelectedMatchIdx(m.matchIndex)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedMatchIdx === m.matchIndex
                      ? 'bg-[#111111] text-[#FFFDF8] border-neutral-800 shadow-xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold">Match #{m.matchIndex + 1}</span>
                    <span className="opacity-70 text-[11px]">Offset: {m.index}..{m.index + m.length} ({m.length} chars)</span>
                  </div>
                  <div className="mt-1.5 p-2 bg-black/20 rounded font-mono text-xs truncate">
                    <code>{m.fullMatch}</code>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                      {m.groups.map(g => (
                        <div key={g.index} className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="opacity-60">Group {g.index}:</span>
                          <span className="font-bold text-[#D6B46A] truncate">{g.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practical Cheat Sheet Presets */}
        <div className="lg:col-span-6 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Sparkles className="w-4 h-4 text-[#A68936]" />
            Practical Regex Presets Library
          </h3>
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {CHEAT_SHEET_PATTERNS.map((p) => (
              <div key={p.title} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-neutral-900">{p.title}</span>
                  <div className="flex items-center gap-2">
                    <CopyButton textToCopy={p.pattern} label="Copy" />
                    <button
                      type="button"
                      onClick={() => {
                        setPattern(p.pattern);
                        setTestText(p.sampleText);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#111111] text-[#D6B46A] hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Use Pattern
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-600">{p.description}</p>
                <div className="p-2 bg-neutral-900 text-neutral-100 rounded font-mono text-[11px] overflow-x-auto">
                  <code>{p.pattern}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
