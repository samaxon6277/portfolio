import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Sparkles, Image as ImageIcon, Upload, Download, Copy, RotateCcw, 
  Eye, Check, Smartphone, Monitor, ShieldCheck, FileArchive, Sliders
} from 'lucide-react';
import JSZip from 'jszip';
import ToolHeader from './common/ToolHeader';
import { CopyButton, DownloadButton, ResetButton, UploadButton } from './common/ToolActions';

type FitMode = 'contain' | 'cover' | 'stretch';

interface IconSpec {
  name: string;
  size: number;
  type: string;
  purpose: string;
}

const ICON_SPECS: IconSpec[] = [
  { name: 'favicon-16x16.png', size: 16, type: 'image/png', purpose: 'Standard browser tab' },
  { name: 'favicon-32x32.png', size: 32, type: 'image/png', purpose: 'High-DPI browser tab' },
  { name: 'favicon-48x48.png', size: 48, type: 'image/png', purpose: 'Desktop shortcut / Windows' },
  { name: 'apple-touch-icon.png', size: 180, type: 'image/png', purpose: 'iOS Safari home screen icon' },
  { name: 'android-chrome-192x192.png', size: 192, type: 'image/png', purpose: 'Android PWA home screen' },
  { name: 'android-chrome-512x512.png', size: 512, type: 'image/png', purpose: 'PWA splash screen / store' }
];

// Helper to create a true binary .ico file with 16x16 and 32x32 PNG entries
async function generateIcoBlob(canvas16: HTMLCanvasElement, canvas32: HTMLCanvasElement): Promise<Blob> {
  const getBlobData = (canvas: HTMLCanvasElement): Promise<Uint8Array> => {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(new Uint8Array(0));
          return;
        }
        const buffer = await blob.arrayBuffer();
        resolve(new Uint8Array(buffer));
      }, 'image/png');
    });
  };

  const png16 = await getBlobData(canvas16);
  const png32 = await getBlobData(canvas32);

  const numImages = 2;
  const headerSize = 6;
  const dirEntrySize = 16;
  const offset0 = headerSize + numImages * dirEntrySize;
  const offset1 = offset0 + png16.length;

  const totalSize = offset1 + png32.length;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // ICONDIR Header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type 1 = ICO
  view.setUint16(4, numImages, true); // Count = 2

  // Entry 0: 16x16
  view.setUint8(6, 16); // Width
  view.setUint8(7, 16); // Height
  view.setUint8(8, 0);  // Colors
  view.setUint8(9, 0);  // Reserved
  view.setUint16(10, 1, true); // Planes
  view.setUint16(12, 32, true); // BPP
  view.setUint32(14, png16.length, true); // Size
  view.setUint32(18, offset0, true); // Offset

  // Entry 1: 32x32
  view.setUint8(22, 32); // Width
  view.setUint8(23, 32); // Height
  view.setUint8(24, 0);  // Colors
  view.setUint8(25, 0);  // Reserved
  view.setUint16(26, 1, true); // Planes
  view.setUint16(28, 32, true); // BPP
  view.setUint32(30, png32.length, true); // Size
  view.setUint32(34, offset1, true); // Offset

  // Copy PNG image buffers
  buffer.set(png16, offset0);
  buffer.set(png32, offset1);

  return new Blob([buffer], { type: 'image/x-icon' });
}

export default function FaviconGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [appName, setAppName] = useState('SamaXon App');
  const [basePath, setBasePath] = useState('/');
  const [fitMode, setFitMode] = useState<FitMode>('contain');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [paddingPercent, setPaddingPercent] = useState(0);
  const [generatingZip, setGeneratingZip] = useState(false);
  const [generatedBlobs, setGeneratedBlobs] = useState<{ [name: string]: string }>({});

  const sourceImgRef = useRef<HTMLImageElement | null>(null);

  // Generate initial demo icon if none uploaded
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.roundRect(0, 0, 512, 512, 96);
      ctx.fill();

      // Gold border
      ctx.strokeStyle = '#D6B46A';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.roundRect(8, 8, 496, 496, 88);
      ctx.stroke();

      // Letter "S" in Gold
      ctx.fillStyle = '#D6B46A';
      ctx.font = 'bold 300px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', 256, 260);

      setImageSrc(canvas.toDataURL('image/png'));
    }
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Render icons to canvases whenever settings or image changes
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sourceImgRef.current = img;
      const blobs: { [name: string]: string } = {};

      ICON_SPECS.forEach(spec => {
        const canvas = document.createElement('canvas');
        canvas.width = spec.size;
        canvas.height = spec.size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill background if specified
        if (bgColor && bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, spec.size, spec.size);
        }

        const p = (spec.size * paddingPercent) / 100;
        const destW = spec.size - p * 2;
        const destH = spec.size - p * 2;

        if (fitMode === 'contain') {
          const scale = Math.min(destW / img.width, destH / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = p + (destW - w) / 2;
          const y = p + (destH - h) / 2;
          ctx.drawImage(img, x, y, w, h);
        } else if (fitMode === 'cover') {
          const scale = Math.max(destW / img.width, destH / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = p + (destW - w) / 2;
          const y = p + (destH - h) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.rect(p, p, destW, destH);
          ctx.clip();
          ctx.drawImage(img, x, y, w, h);
          ctx.restore();
        } else {
          ctx.drawImage(img, p, p, destW, destH);
        }

        blobs[spec.name] = canvas.toDataURL('image/png');
      });

      setGeneratedBlobs(blobs);
    };
    img.src = imageSrc;
  }, [imageSrc, fitMode, bgColor, paddingPercent]);

  // Generated Webmanifest
  const webManifestJson = useMemo(() => {
    return JSON.stringify({
      name: appName,
      short_name: appName,
      icons: [
        {
          src: `${basePath}android-chrome-192x192.png`,
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: `${basePath}android-chrome-512x512.png`,
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      theme_color: bgColor,
      background_color: bgColor,
      display: 'standalone'
    }, null, 2);
  }, [appName, basePath, bgColor]);

  // HTML Head Snippet
  const htmlSnippet = useMemo(() => {
    return `<!-- Favicon & Touch Icon Suite -->
<link rel="icon" type="image/x-icon" href="${basePath}favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="${basePath}favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${basePath}favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="${basePath}apple-touch-icon.png">
<link rel="manifest" href="${basePath}site.webmanifest">`;
  }, [basePath]);

  // Real ZIP Compilation & Download
  const handleDownloadZip = async () => {
    if (!imageSrc) return;
    setGeneratingZip(true);

    try {
      const zip = new JSZip();

      // Render individual canvases for ZIP
      const canvas16 = document.createElement('canvas');
      canvas16.width = 16;
      canvas16.height = 16;
      const ctx16 = canvas16.getContext('2d');

      const canvas32 = document.createElement('canvas');
      canvas32.width = 32;
      canvas32.height = 32;
      const ctx32 = canvas32.getContext('2d');

      for (const spec of ICON_SPECS) {
        const c = document.createElement('canvas');
        c.width = spec.size;
        c.height = spec.size;
        const ctx = c.getContext('2d');
        if (ctx && sourceImgRef.current) {
          if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, spec.size, spec.size);
          }
          const p = (spec.size * paddingPercent) / 100;
          ctx.drawImage(sourceImgRef.current, p, p, spec.size - p * 2, spec.size - p * 2);

          if (spec.size === 16 && ctx16) ctx16.drawImage(c, 0, 0);
          if (spec.size === 32 && ctx32) ctx32.drawImage(c, 0, 0);

          const dataUrl = c.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(spec.name, base64Data, { base64: true });
        }
      }

      // Generate true binary favicon.ico
      const icoBlob = await generateIcoBlob(canvas16, canvas32);
      const icoBuffer = await icoBlob.arrayBuffer();
      zip.file('favicon.ico', icoBuffer);

      // site.webmanifest
      zip.file('site.webmanifest', webManifestJson);

      // HTML Integration Readme
      zip.file('README-INTEGRATION.html', `<!DOCTYPE html>
<html>
<head><title>SamaXon Favicon Suite Instructions</title></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2>Installation Guide</h2>
  <p>1. Copy all generated icon files and <code>site.webmanifest</code> into your website's root directory (or your <code>public/</code> folder).</p>
  <p>2. Paste the following HTML tags inside the <code>&lt;head&gt;</code> of your pages:</p>
  <pre style="background: #222; color: #fff; padding: 15px; border-radius: 8px;">${htmlSnippet}</pre>
</body>
</html>`);

      // Download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'samaxon-favicon-suite.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation error:', err);
      alert('Error generating icon package.');
    } finally {
      setGeneratingZip(false);
    }
  };

  return (
    <div className="space-y-8 text-left" id="favicon-generator">
      <ToolHeader
        title="Favicon & App Icon Suite Generator"
        description="Generate complete multi-platform browser favicons, Apple touch icons, Android PWA manifests, and binary ICO files with live device simulation."
        icon={Smartphone}
        categoryName="Branding & Identity"
        categorySlug="branding-identity"
        badgeText="100% IN-BROWSER · COMPLETE ASSET SUITE"
      />

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Options */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A68936]" />
              Icon Source & Config
            </h3>
            <UploadButton onFileSelect={handleFileUpload} accept="image/*" label="Upload Artwork" />
          </div>

          <div className="space-y-4">
            {/* App Name */}
            <div className="space-y-1.5">
              <label htmlFor="app-name-input" className="text-xs font-mono font-bold text-neutral-800 block">App / Brand Name</label>
              <input
                id="app-name-input"
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs font-mono"
              />
            </div>

            {/* Base Path */}
            <div className="space-y-1.5">
              <label htmlFor="base-path-input" className="text-xs font-mono font-bold text-neutral-800 block">Assets Base Path</label>
              <input
                id="base-path-input"
                type="text"
                value={basePath}
                onChange={(e) => setBasePath(e.target.value)}
                placeholder="/"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs font-mono"
              />
              <span className="text-[10px] font-mono text-neutral-400">e.g. / or /assets/icons/</span>
            </div>

            {/* Background Color */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="bg-color-picker" className="text-neutral-700 font-bold">Icon Background Color</label>
                <span className="text-neutral-500">{bgColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="bg-color-picker"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-8 rounded-lg cursor-pointer border border-neutral-300"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono uppercase"
                />
              </div>
            </div>

            {/* Fit Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-800 block">Aspect Fit Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['contain', 'cover', 'stretch'] as FitMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFitMode(mode)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                      fitMode === mode
                        ? 'bg-[#111111] text-[#D6B46A]'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Padding Slider */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="padding-slider" className="text-neutral-700">Inner Padding ({paddingPercent}%)</label>
              </div>
              <input
                id="padding-slider"
                type="range"
                min="0"
                max="30"
                value={paddingPercent}
                onChange={(e) => setPaddingPercent(Number(e.target.value))}
                className="w-full accent-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Previews & Download */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real Live Device Simulation Previews */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#A68936]" />
                Live In-Context Simulation
              </span>
              <DownloadButton
                onDownload={handleDownloadZip}
                loading={generatingZip}
                label="Download ZIP Suite"
              />
            </div>

            {/* Desktop Browser Tab Mockup */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Desktop Browser Tab</span>
              <div className="bg-neutral-100 p-2 rounded-2xl border border-neutral-200">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-2xs border border-neutral-200/60 max-w-xs">
                  {generatedBlobs['favicon-16x16.png'] ? (
                    <img src={generatedBlobs['favicon-16x16.png']} alt="Tab Favicon" className="w-4 h-4 rounded-xs" />
                  ) : (
                    <div className="w-4 h-4 bg-neutral-300 rounded-xs" />
                  )}
                  <span className="text-xs font-sans font-bold text-neutral-900 truncate">
                    {appName} — SamaXon
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Devices Mockup Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Apple iOS Home Screen */}
              <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-2 text-center flex flex-col items-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">iOS Touch Icon (180x180)</span>
                <div className="w-16 h-16 rounded-[14px] overflow-hidden shadow-lg border border-white/20 my-2">
                  {generatedBlobs['apple-touch-icon.png'] ? (
                    <img src={generatedBlobs['apple-touch-icon.png']} alt="iOS Icon" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800" />
                  )}
                </div>
                <span className="text-xs font-sans text-neutral-200 truncate max-w-[100px]">{appName}</span>
              </div>

              {/* Android Chrome PWA Icon */}
              <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-2 text-center flex flex-col items-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Android PWA (192x192)</span>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border border-white/20 my-2">
                  {generatedBlobs['android-chrome-192x192.png'] ? (
                    <img src={generatedBlobs['android-chrome-192x192.png']} alt="Android Icon" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800" />
                  )}
                </div>
                <span className="text-xs font-sans text-neutral-200 truncate max-w-[100px]">{appName}</span>
              </div>
            </div>
          </div>

          {/* HTML & WebManifest Snippet */}
          <div className="bg-[#111111] text-[#FFFDF8] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D6B46A]">
                Required HTML &lt;head&gt; Code
              </span>
              <CopyButton textToCopy={htmlSnippet} label="Copy HTML" />
            </div>
            <pre className="p-3 bg-black/50 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed selection:bg-[#D6B46A]/30">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
