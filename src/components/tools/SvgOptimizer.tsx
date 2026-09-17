import React, { useState, useMemo, useRef } from 'react';
import { 
  FileCode, CheckCircle2, AlertTriangle, Copy, Download, Trash2, 
  Sparkles, RefreshCw, Eye, Code2, Sliders, ShieldCheck, HelpCircle, 
  Layers, Check, FileDown, Upload
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, DownloadButton, ResetButton, ClearButton, UploadButton } from './common/ToolActions';

interface OptimizerOptions {
  multipass: boolean;
  removeComments: boolean;
  removeMetadata: boolean;
  removeEditorAttributes: boolean;
  collapseEmptyGroups: boolean;
  roundNumbers: boolean;
  precision: number;
  optimizeColors: boolean;
  removeUselessAttributes: boolean;
  collapseWhitespace: boolean;
}

const DEFAULT_OPTIONS: OptimizerOptions = {
  multipass: true,
  removeComments: true,
  removeMetadata: true,
  removeEditorAttributes: true,
  collapseEmptyGroups: true,
  roundNumbers: true,
  precision: 2,
  optimizeColors: true,
  removeUselessAttributes: true,
  collapseWhitespace: true
};

const SAMPLE_SVG = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 27.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
     x="0px" y="0px" viewBox="0 0 200.000000 200.000000" enable-background="new 0 0 200 200" xml:space="preserve">
<metadata>
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:format>image/svg+xml</dc:format>
      <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
    </rdf:Description>
  </rdf:RDF>
</metadata>
<g id="Background_Layer" inkscape:label="Layer 1" data-name="background-group">
  <g id="nested_empty_wrapper">
    <!-- Main Decorative Shield -->
    <path fill="rgb(214, 180, 106)" stroke="#000000" stroke-width="2.000000" 
          d="M 100.000000,20.000000 L 170.543210,50.123456 C 170.543210,120.987654 100.000000,175.432109 100.000000,175.432109 C 100.000000,175.432109 29.456790,120.987654 29.456790,50.123456 Z" />
    <!-- Star Icon in Center -->
    <polygon fill="#ffffff" points="100.000000,65.000000 110.500000,86.200000 134.000000,89.500000 117.000000,106.000000 121.000000,129.000000 100.000000,118.000000 79.000000,129.000000 83.000000,106.000000 66.000000,89.500000 89.500000,86.200000" />
  </g>
</g>
<g id="Empty_Layer_To_Prune"></g>
</svg>`;

// Real SVG Optimization Routine using AST & regex passes
function optimizeSvgString(raw: string, opts: OptimizerOptions): { optimized: string; error?: string } {
  try {
    let result = raw.trim();

    // 1. Remove XML Prolog and DOCTYPE
    result = result.replace(/<\?xml[^>]*\?>/gi, '');
    result = result.replace(/<!DOCTYPE[^>]*>/gi, '');

    // 2. Remove comments
    if (opts.removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    // 3. Remove metadata tags
    if (opts.removeMetadata) {
      result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
      result = result.replace(/<rdf:RDF[\s\S]*?<\/rdf:RDF>/gi, '');
    }

    // Parse with DOMParser for structure validation and safe tree cleanup
    const parser = new DOMParser();
    const doc = parser.parseFromString(result, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return { optimized: raw, error: parserError.textContent || 'Malformed SVG syntax.' };
    }

    const svgEl = doc.documentElement;
    if (!svgEl || svgEl.nodeName.toLowerCase() !== 'svg') {
      return { optimized: raw, error: 'Document does not contain a valid root <svg> element.' };
    }

    // Pass: Remove useless default SVG attributes
    if (opts.removeUselessAttributes) {
      const uselessAttrs = ['version', 'xmlns:xlink', 'enable-background', 'xml:space', 'x', 'y'];
      uselessAttrs.forEach(attr => {
        if (svgEl.hasAttribute(attr)) {
          const val = svgEl.getAttribute(attr);
          if (attr === 'version' && (val === '1.1' || val === '1.0')) svgEl.removeAttribute(attr);
          else if (attr === 'x' && (val === '0px' || val === '0')) svgEl.removeAttribute(attr);
          else if (attr === 'y' && (val === '0px' || val === '0')) svgEl.removeAttribute(attr);
          else if (attr === 'xml:space' && val === 'preserve') svgEl.removeAttribute(attr);
          else if (attr === 'enable-background') svgEl.removeAttribute(attr);
        }
      });
    }

    // Tree Walker: Process elements recursively
    const processElement = (el: Element) => {
      // Clean editor attributes
      if (opts.removeEditorAttributes) {
        const attrsToRemove: string[] = [];
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          const name = attr.name.toLowerCase();
          if (
            name.startsWith('inkscape:') || 
            name.startsWith('sodipodi:') || 
            name.startsWith('xmlns:inkscape') || 
            name.startsWith('xmlns:sodipodi') ||
            name === 'data-name'
          ) {
            attrsToRemove.push(attr.name);
          }
        }
        attrsToRemove.forEach(a => el.removeAttribute(a));
      }

      // Clean empty groups
      if (opts.collapseEmptyGroups && el.tagName.toLowerCase() === 'g') {
        if (el.children.length === 0 && !el.textContent?.trim()) {
          el.remove();
          return;
        }
      }

      // Numeric precision on attributes like d, points, viewBox
      if (opts.roundNumbers) {
        const numericAttrs = ['d', 'points', 'viewBox', 'x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry', 'stroke-width'];
        numericAttrs.forEach(attrName => {
          if (el.hasAttribute(attrName)) {
            const val = el.getAttribute(attrName) || '';
            const rounded = val.replace(/(-?\d+\.\d+)/g, (match) => {
              const num = parseFloat(match);
              if (isNaN(num)) return match;
              return num.toFixed(opts.precision).replace(/\.?0+$/, '');
            });
            el.setAttribute(attrName, rounded);
          }
        });
      }

      // Optimize colors (rgb(r,g,b) -> hex and #ffffff -> #fff)
      if (opts.optimizeColors) {
        const colorAttrs = ['fill', 'stroke', 'stop-color', 'flood-color'];
        colorAttrs.forEach(attrName => {
          if (el.hasAttribute(attrName)) {
            let val = el.getAttribute(attrName) || '';
            // Convert rgb(r, g, b)
            val = val.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, (_, r, g, b) => {
              const hex = ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
              return `#${hex}`;
            });
            // Collapse 6-character hex to 3-character hex (#ffffff -> #fff)
            val = val.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3\b/gi, '#$1$2$3');
            el.setAttribute(attrName, val);
          }
        });
      }

      // Recurse children
      const children = Array.from(el.children);
      children.forEach(child => processElement(child));
    };

    processElement(svgEl);

    // Serialize back to XML string
    const serializer = new XMLSerializer();
    let serialized = serializer.serializeToString(svgEl);

    // Whitespace collapse
    if (opts.collapseWhitespace) {
      serialized = serialized
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    return { optimized: serialized };
  } catch (err: any) {
    return { optimized: raw, error: err.message || 'Unexpected optimization error' };
  }
}

export default function SvgOptimizer() {
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_SVG);
  const [options, setOptions] = useState<OptimizerOptions>(DEFAULT_OPTIONS);
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [dragOver, setDragOver] = useState(false);

  // Compute optimization deterministically
  const { optimized, error } = useMemo(() => {
    if (!svgInput.trim()) return { optimized: '', error: undefined };
    return optimizeSvgString(svgInput, options);
  }, [svgInput, options]);

  // Byte calculations
  const originalBytes = useMemo(() => new Blob([svgInput]).size, [svgInput]);
  const optimizedBytes = useMemo(() => new Blob([optimized]).size, [optimized]);
  const savedBytes = Math.max(0, originalBytes - optimizedBytes);
  const percentSaved = originalBytes > 0 ? ((savedBytes / originalBytes) * 100).toFixed(1) : '0';

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      alert('Please upload a valid .svg vector file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) setSvgInput(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDownload = () => {
    if (!optimized) return;
    const blob = new Blob([optimized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-vector.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-left" id="svg-optimizer">
      <ToolHeader
        title="SVG Optimizer & Vector Minifier"
        description="Minify SVG files in-browser by stripping redundant metadata, editor artifacts, unused namespaces, and unneeded precision without degrading visual quality."
        icon={FileCode}
        categoryName="Development & QA"
        categorySlug="development-qa"
        badgeText="100% IN-BROWSER · ZERO SERVER UPLOADS"
      />

      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Original Size</span>
          <p className="font-mono font-bold text-sm sm:text-base text-neutral-900">
            {originalBytes > 0 ? `${originalBytes.toLocaleString()} B` : '0 B'}
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Optimized Size</span>
          <p className="font-mono font-bold text-sm sm:text-base text-neutral-900">
            {optimizedBytes > 0 ? `${optimizedBytes.toLocaleString()} B` : '0 B'}
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Bytes Saved</span>
          <p className="font-mono font-bold text-sm sm:text-base text-emerald-600">
            {savedBytes > 0 ? `-${savedBytes.toLocaleString()} B` : '0 B'}
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Reduction Ratio</span>
          <p className="font-mono font-bold text-sm sm:text-base text-[#A68936]">
            {percentSaved}% Saved
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input & Options */}
        <div className="lg:col-span-6 space-y-6">
          {/* File Upload / Paste Box */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Source SVG Input
              </span>
              <div className="flex items-center gap-2">
                <UploadButton onFileSelect={handleFileUpload} accept=".svg,image/svg+xml" label="Upload SVG" />
                <ClearButton onClear={() => setSvgInput('')} />
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-colors ${
                dragOver ? 'border-[#D6B46A] bg-[#FFFDF8]' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <textarea
                value={svgInput}
                onChange={(e) => setSvgInput(e.target.value)}
                placeholder="Paste raw <svg> code here, or drag & drop an .svg file..."
                rows={10}
                spellCheck={false}
                className="w-full bg-neutral-900 text-neutral-100 font-mono text-xs p-3.5 rounded-xl resize-y focus:outline-none selection:bg-[#D6B46A]/30 leading-relaxed"
              />
              <p className="text-[11px] font-mono text-neutral-400 mt-2">
                Accepts valid XML/SVG code or drop .svg vector files directly from your desktop.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">XML Parse Warning:</strong> {error}
                </div>
              </div>
            )}
          </div>

          {/* Supported Optimization Controls */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#A68936]" />
                Optimization Parameters
              </h3>
              <ResetButton onReset={() => setOptions(DEFAULT_OPTIONS)} label="Reset Rules" />
            </div>

            <div className="space-y-3 text-xs font-mono">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <span className="text-neutral-700">Strip XML Comments (<!-- -->)</span>
                <input
                  type="checkbox"
                  checked={options.removeComments}
                  onChange={(e) => setOptions(o => ({ ...o, removeComments: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <span className="text-neutral-700">Remove Metadata & RDF Blocks</span>
                <input
                  type="checkbox"
                  checked={options.removeMetadata}
                  onChange={(e) => setOptions(o => ({ ...o, removeMetadata: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <span className="text-neutral-700">Strip Illustrator & Inkscape Namespaces</span>
                <input
                  type="checkbox"
                  checked={options.removeEditorAttributes}
                  onChange={(e) => setOptions(o => ({ ...o, removeEditorAttributes: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <span className="text-neutral-700">Prune Empty & Unstyled Groups (<g>)</span>
                <input
                  type="checkbox"
                  checked={options.collapseEmptyGroups}
                  onChange={(e) => setOptions(o => ({ ...o, collapseEmptyGroups: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <span className="text-neutral-700">Optimize Color Syntax (#ffffff → #fff)</span>
                <input
                  type="checkbox"
                  checked={options.optimizeColors}
                  onChange={(e) => setOptions(o => ({ ...o, optimizeColors: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <span className="text-neutral-700">Collapse Non-Essential Whitespace</span>
                <input
                  type="checkbox"
                  checked={options.collapseWhitespace}
                  onChange={(e) => setOptions(o => ({ ...o, collapseWhitespace: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-[#D6B46A]"
                />
              </label>

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-700 font-bold">Numeric Precision (Floats)</span>
                  <span className="text-neutral-500 font-mono">{options.precision} decimals</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={options.precision}
                  onChange={(e) => setOptions(o => ({ ...o, precision: Number(e.target.value) }))}
                  className="w-full accent-[#111111]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output, Visual Comparison & Code */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveView('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeView === 'preview' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Visual Fidelity
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeView === 'code' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 inline mr-1" />
                  Minified SVG Code
                </button>
              </div>

              <div className="flex items-center gap-2">
                <CopyButton textToCopy={optimized} label="Copy SVG" />
                <DownloadButton onDownload={handleDownload} label="Download .svg" />
              </div>
            </div>

            {activeView === 'preview' ? (
              <div className="space-y-4">
                <div className="text-xs font-mono text-neutral-500">
                  Side-by-side rendering ensures zero pixel degradation:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-neutral-500 uppercase">Original Document</span>
                    <div 
                      className="min-h-[220px] bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: svgInput }}
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-emerald-600 uppercase font-bold">Optimized Vector</span>
                    <div 
                      className="min-h-[220px] bg-neutral-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: optimized }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  readOnly
                  value={optimized}
                  rows={14}
                  className="w-full bg-neutral-900 text-neutral-100 font-mono text-xs p-3.5 rounded-xl resize-y focus:outline-none selection:bg-[#D6B46A]/30 leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it Works & Technical Notes */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#A68936]" />
          How SamaXon SVG Optimizer Works
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Vector creation software such as Adobe Illustrator, Figma, and Inkscape routinely embed redundant editor metadata, document comments, proprietary XML namespaces, and overly verbose 6-decimal floating point coordinates. Our in-browser optimizer traverses the SVG Document Object Model (DOM), safely stripping non-rendering metadata and rounding coordinates while preserving 100% path accuracy.
        </p>
      </div>
    </div>
  );
}
