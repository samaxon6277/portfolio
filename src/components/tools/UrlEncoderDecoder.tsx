import React, { useState, useMemo } from 'react';
import { 
  Link, ArrowRightLeft, Copy, Download, Trash2, Check, 
  Sparkles, ShieldCheck, HelpCircle, ArrowRight, AlertTriangle, 
  Code2, CheckCircle2, FileText, Table
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useCustomUi } from '../../context/CustomUiContext';

type EncodeMode = 'encodeComponent' | 'encodeUri' | 'decode';

const SAMPLE_RAW = 'https://samaxon.site/search?q=luxury web design & development+2026#pricing & features';
const SAMPLE_ENCODED = 'https%3A%2F%2Fsamaxon.site%2Fsearch%3Fq%3Dluxury%20web%20design%20%26%20development%2B2026%23pricing%20%26%20features';

const COMMON_ENCODINGS = [
  { char: 'Space', code: '%20 or +' },
  { char: '!', code: '%21' },
  { char: '"', code: '%22' },
  { char: '#', code: '%23' },
  { char: '$', code: '%24' },
  { char: '%', code: '%25' },
  { char: '&', code: '%26' },
  { char: '\'', code: '%27' },
  { char: '(', code: '%28' },
  { char: ')', code: '%29' },
  { char: '*', code: '%2A' },
  { char: '+', code: '%2B' },
  { char: ',', code: '%2C' },
  { char: '/', code: '%2F' },
  { char: ':', code: '%3A' },
  { char: ';', code: '%3B' },
  { char: '=', code: '%3D' },
  { char: '?', code: '%3F' },
  { char: '@', code: '%40' },
  { char: '[', code: '%5B' },
  { char: ']', code: '%5D' }
];

export default function UrlEncoderDecoder() {
  const { showToast, showConfirm } = useCustomUi();

  const [inputVal, setInputVal] = useState<string>('');
  const [mode, setMode] = useState<EncodeMode>('encodeComponent');
  const [copied, setCopied] = useState<boolean>(false);

  // Process transformation
  const processedResult = useMemo(() => {
    const raw = inputVal;
    if (!raw.trim()) {
      return { output: '', error: null };
    }

    try {
      if (mode === 'encodeComponent') {
        const encoded = encodeURIComponent(raw);
        return { output: encoded, error: null };
      } else if (mode === 'encodeUri') {
        const encoded = encodeURI(raw);
        return { output: encoded, error: null };
      } else {
        // Decode mode: replace '+' with space if standard form encoding was used, then decodeURIComponent
        // Safe decoding with fallback
        try {
          const decoded = decodeURIComponent(raw.replace(/\+/g, ' '));
          return { output: decoded, error: null };
        } catch {
          const decoded = decodeURI(raw);
          return { output: decoded, error: null };
        }
      }
    } catch (err: any) {
      return {
        output: '',
        error: 'Malformed percent-encoded sequence. Ensure all "%" signs are followed by two valid hexadecimal digits (e.g. %20).'
      };
    }
  }, [inputVal, mode]);

  // Actions
  const handleCopy = async () => {
    if (!processedResult.output) return;
    try {
      await navigator.clipboard.writeText(processedResult.output);
      setCopied(true);
      showToast('Output copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleSwap = () => {
    if (!processedResult.output) return;
    setInputVal(processedResult.output);
    // Toggle mode
    if (mode === 'decode') {
      setMode('encodeComponent');
    } else {
      setMode('decode');
    }
    showToast('Input and output swapped', 'info');
  };

  const handleClear = () => {
    if (!inputVal) return;
    showConfirm({
      title: 'Clear Text Buffer',
      message: 'Are you sure you want to clear the input and output buffer?',
      confirmText: 'Yes, Clear All',
      cancelText: 'Cancel',
      onConfirm: () => {
        setInputVal('');
        showToast('Buffer cleared', 'info');
      }
    });
  };

  const handleLoadSampleRaw = () => {
    setInputVal(SAMPLE_RAW);
    setMode('encodeComponent');
    showToast('Sample URL loaded for encoding', 'info');
  };

  const handleLoadSampleEncoded = () => {
    setInputVal(SAMPLE_ENCODED);
    setMode('decode');
    showToast('Sample encoded string loaded for decoding', 'info');
  };

  return (
    <div className="space-y-12 text-left" id="url-encoder-decoder-tool">
      {/* Header & Subtitle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
            RFC 3986 COMPLIANT
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D6B46A]/15 text-[#A68936] text-[11px] font-mono font-bold rounded-md border border-[#D6B46A]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A68936]" />
            100% Client-Side · Zero Server Uploads
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111111] tracking-tight">
          URL Encoder & Decoder
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
          Safely convert special characters and query strings into percent-encoded RFC 3986 format or decode encoded URLs back to clean human text in your browser.
        </p>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => setMode('encodeComponent')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                mode === 'encodeComponent' ? 'bg-[#111111] text-[#D6B46A] shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Encode Component
            </button>
            <button
              type="button"
              onClick={() => setMode('encodeUri')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                mode === 'encodeUri' ? 'bg-[#111111] text-[#D6B46A] shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Encode Full URI
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                mode === 'decode' ? 'bg-[#111111] text-[#D6B46A] shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Decode
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleRaw}
              className="px-2.5 py-1.5 bg-[#FFFDF8] hover:bg-[#F9F5EC] border border-[#D6B46A]/30 text-[#A68936] text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample URL</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSampleEncoded}
              className="px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono rounded-xl transition-colors cursor-pointer"
            >
              <span>Sample Encoded</span>
            </button>

            <button
              type="button"
              onClick={handleSwap}
              disabled={!processedResult.output}
              className="p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 rounded-xl transition-colors cursor-pointer"
              title="Swap Input & Output"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!inputVal}
              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 rounded-xl transition-colors cursor-pointer"
              title="Clear Buffer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Text Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-900 font-mono flex items-center gap-1.5">
              <span>Input String</span>
              <span className="text-[11px] font-normal text-neutral-500">
                ({mode === 'decode' ? 'Paste percent-encoded string to decode' : 'Paste plain text or URL to encode'})
              </span>
            </label>
            <span className="text-[11px] font-mono text-neutral-400">
              {inputVal.length} chars · {new Blob([inputVal]).size} bytes
            </span>
          </div>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              mode === 'decode'
                ? 'https%3A%2F%2Fsamaxon.site%2Fsearch%3Fq%3Dluxury'
                : 'https://samaxon.site/search?q=luxury web design & development'
            }
            rows={5}
            className="w-full p-3.5 bg-neutral-50 text-neutral-900 font-mono text-xs border border-neutral-200 rounded-2xl focus:outline-none focus:border-[#A68936] focus:bg-white resize-y"
          />
        </div>

        {/* Error Banner if Malformed Input in Decode Mode */}
        {processedResult.error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono font-bold">URI Decoding Error</span>
              <p className="text-rose-800">{processedResult.error}</p>
            </div>
          </div>
        )}

        {/* Output Text Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-900 font-mono flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#A68936]" />
              <span>
                {mode === 'decode' ? 'Decoded Result' : mode === 'encodeComponent' ? 'Encoded Component Result' : 'Encoded Full URI Result'}
              </span>
            </label>
            {processedResult.output && (
              <span className="text-[11px] font-mono text-neutral-400">
                {processedResult.output.length} chars · {new Blob([processedResult.output]).size} bytes
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={processedResult.output}
              placeholder="Processed result will appear here automatically..."
              rows={5}
              className="w-full p-3.5 bg-neutral-900 text-neutral-100 font-mono text-xs border border-neutral-700 rounded-2xl focus:outline-none select-all resize-y"
            />
          </div>

          {/* Copy Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!processedResult.output}
              className="px-4 py-2 bg-[#D6B46A] hover:bg-[#c4a159] disabled:opacity-40 text-[#111111] text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Output!' : 'Copy Output'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Difference Explanation: encodeURIComponent vs encodeURI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#111111] font-mono uppercase tracking-wide">
            encodeURIComponent (Recommended for Parameters)
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Encodes all characters except letters, digits, and <code>- _ . ! ~ * ' ( )</code>. Characters with reserved URI meaning like <code>: / ? & = # +</code> are converted into percent escapes (e.g. <code>&</code> becomes <code>%26</code>).
          </p>
          <div className="p-2.5 bg-neutral-50 rounded-xl font-mono text-[11px] text-neutral-700">
            <strong>Use Case:</strong> Query parameter values (e.g. <code>?redirect=https%3A%2F%2Fexample.com</code>).
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#111111] font-mono uppercase tracking-wide">
            encodeURI (Preserves Full Web Addresses)
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Encodes only illegal URI characters (like spaces and Unicode glyphs), preserving URL protocol separators like <code>http://</code>, slashes <code>/</code>, question marks <code>?</code>, ampersands <code>&</code>, and hashes <code>#</code>.
          </p>
          <div className="p-2.5 bg-neutral-50 rounded-xl font-mono text-[11px] text-neutral-700">
            <strong>Use Case:</strong> Encoding an entire destination address without breaking its navigable protocol and path syntax.
          </div>
        </div>
      </div>

      {/* Common ASCII Percent-Encoding Reference Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[#A68936]" />
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide font-mono">
            Common ASCII Percent-Encoding Cheat Sheet
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs font-mono">
          {COMMON_ENCODINGS.map(item => (
            <div key={item.char} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
              <span className="text-neutral-600 font-bold">{item.char}</span>
              <span className="text-[#A68936] font-bold">{item.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">Why do URLs require percent-encoding?</p>
            <p className="text-neutral-600 mt-1">
              Under RFC 3986, URLs can only be sent over the Internet using the standard ASCII character set. Characters outside this set (including spaces, symbols, and non-Latin alphabets) must be converted into a valid percent-encoded format (<code>%</code> followed by two hexadecimal digits).
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">What is the difference between %20 and + for spaces?</p>
            <p className="text-neutral-600 mt-1">
              In standard URL query strings (<code>application/x-www-form-urlencoded</code>), spaces are frequently encoded as <code>+</code>. In strict RFC 3986 URI paths, spaces are encoded as <code>%20</code>. Our decoder transparently handles both variations.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Does this tool execute or request any encoded URLs?</p>
            <p className="text-neutral-600 mt-1">
              No. The tool performs pure string parsing inside your browser’s JavaScript runtime. It never makes outbound HTTP network requests or executes URL destinations.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Recommendations */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-[#A68936] font-bold uppercase tracking-wider">Related Developer Tools</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <RouterLink
            to="/tools/utm-campaign-url-builder"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>UTM Campaign URL Builder</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Build encoded marketing URLs for Google Analytics.</p>
          </RouterLink>

          <RouterLink
            to="/tools/canonical-url-validator"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Canonical URL Validator</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Audit URL normalization and canonical header rules.</p>
          </RouterLink>

          <RouterLink
            to="/tools/api-request-builder"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>API Request Builder</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Execute REST queries with custom encoded parameters.</p>
          </RouterLink>
        </div>
      </div>
    </div>
  );
}
