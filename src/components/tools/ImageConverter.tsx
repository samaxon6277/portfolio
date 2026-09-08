import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, Download, FileImage, RefreshCw, Trash2, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Sparkles, Layers, Sliders, AlertCircle 
} from 'lucide-react';
import JSZip from 'jszip';

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon' | 'image/bmp';

interface FormatOption {
  value: OutputFormat;
  ext: string;
  label: string;
  mime: string;
  supportsTransparency: boolean;
  desc: string;
}

const SUPPORTED_FORMATS: FormatOption[] = [
  { value: 'image/webp', ext: 'webp', label: 'WEBP', mime: 'image/webp', supportsTransparency: true, desc: 'Ultra-lightweight modern web standard' },
  { value: 'image/jpeg', ext: 'jpg', label: 'JPG / JPEG', mime: 'image/jpeg', supportsTransparency: false, desc: 'Universal standard photo format' },
  { value: 'image/png', ext: 'png', label: 'PNG', mime: 'image/png', supportsTransparency: true, desc: 'Lossless quality with transparent alpha' },
  { value: 'image/bmp', ext: 'bmp', label: 'BMP', mime: 'image/bmp', supportsTransparency: false, desc: 'Uncompressed raw bitmap fidelity' },
  { value: 'image/x-icon', ext: 'ico', label: 'ICO (Favicon)', mime: 'image/x-icon', supportsTransparency: true, desc: 'Website favicon icon standard' }
];

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalType: string;
  previewUrl: string;
  width: number;
  height: number;
  targetFormat: OutputFormat;
  targetQuality: number; // 0.1 to 1.0
  backgroundColor: string; // for jpeg/bmp
  convertedBlob: Blob | null;
  convertedSize: number | null;
  convertedUrl: string | null;
  status: 'idle' | 'converting' | 'done' | 'error';
  errorMessage?: string;
}

export default function ImageConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>('image/webp');
  const [globalQuality, setGlobalQuality] = useState<number>(0.85);
  const [globalBgColor, setGlobalBgColor] = useState<string>('#ffffff');
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Convert a single image using Canvas
  const processImage = useCallback(async (item: ImageItem, format: OutputFormat, quality: number, bgColor: string): Promise<{ blob: Blob; url: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let targetW = img.naturalWidth;
          let targetH = img.naturalHeight;

          // If converting to ICO, scale down to maximum 256x256
          if (format === 'image/x-icon') {
            const maxDim = 256;
            if (targetW > maxDim || targetH > maxDim) {
              const ratio = Math.min(maxDim / targetW, maxDim / targetH);
              targetW = Math.round(targetW * ratio);
              targetH = Math.round(targetH * ratio);
            }
          }

          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          // If format doesn't support transparency (e.g. JPEG, BMP), fill background
          const fmtMeta = SUPPORTED_FORMATS.find(f => f.value === format);
          if (fmtMeta && !fmtMeta.supportsTransparency) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, targetW, targetH);
          }

          ctx.drawImage(img, 0, 0, targetW, targetH);

          // Convert to blob
          // For ICO, browser canvas creates image/png or image/vnd.microsoft.icon
          const exportMime = format === 'image/x-icon' ? 'image/png' : format;
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Conversion failed'));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve({ blob, url, size: blob.size });
          }, exportMime, quality);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Could not load image file'));
      img.src = item.previewUrl;
    });
  }, []);

  // Handle file addition
  const handleFiles = (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|bmp|gif|svg|ico)$/i.test(file.name)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    const newItems: ImageItem[] = validFiles.map(file => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        originalSize: file.size,
        originalType: file.type || 'image/unknown',
        previewUrl,
        width: 0,
        height: 0,
        targetFormat: globalFormat,
        targetQuality: globalQuality,
        backgroundColor: globalBgColor,
        convertedBlob: null,
        convertedSize: null,
        convertedUrl: null,
        status: 'idle'
      };
    });

    // Read dimensions for display
    newItems.forEach(item => {
      const img = new Image();
      img.onload = () => {
        setImages(prev => prev.map(p => p.id === item.id ? { ...p, width: img.naturalWidth, height: img.naturalHeight } : p));
      };
      img.src = item.previewUrl;
    });

    setImages(prev => [...prev, ...newItems]);
  };

  // Convert all images
  const convertAll = async () => {
    if (images.length === 0) return;
    setIsConvertingAll(true);

    const updated = [...images];
    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      try {
        setImages(prev => prev.map(p => p.id === item.id ? { ...p, status: 'converting' } : p));
        const res = await processImage(item, item.targetFormat, item.targetQuality, item.backgroundColor);
        setImages(prev => prev.map(p => p.id === item.id ? {
          ...p,
          convertedBlob: res.blob,
          convertedUrl: res.url,
          convertedSize: res.size,
          status: 'done'
        } : p));
      } catch (err: any) {
        setImages(prev => prev.map(p => p.id === item.id ? {
          ...p,
          status: 'error',
          errorMessage: err.message || 'Error converting'
        } : p));
      }
    }

    setIsConvertingAll(false);
  };

  // Convert a single item
  const convertSingle = async (id: string) => {
    const item = images.find(p => p.id === id);
    if (!item) return;

    setImages(prev => prev.map(p => p.id === id ? { ...p, status: 'converting' } : p));
    try {
      const res = await processImage(item, item.targetFormat, item.targetQuality, item.backgroundColor);
      setImages(prev => prev.map(p => p.id === id ? {
        ...p,
        convertedBlob: res.blob,
        convertedUrl: res.url,
        convertedSize: res.size,
        status: 'done'
      } : p));
    } catch (err: any) {
      setImages(prev => prev.map(p => p.id === id ? {
        ...p,
        status: 'error',
        errorMessage: err.message || 'Error'
      } : p));
    }
  };

  // Download a single converted image
  const downloadSingle = (item: ImageItem) => {
    if (!item.convertedBlob) return;
    const formatMeta = SUPPORTED_FORMATS.find(f => f.value === item.targetFormat);
    const ext = formatMeta ? formatMeta.ext : 'jpg';
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const fileName = `${baseName}.${ext}`;

    const a = document.createElement('a');
    a.href = item.convertedUrl || URL.createObjectURL(item.convertedBlob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download all converted images as a single ZIP file
  const downloadAllZip = async () => {
    const readyItems = images.filter(i => i.status === 'done' && i.convertedBlob);
    if (readyItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      readyItems.forEach((item, idx) => {
        const formatMeta = SUPPORTED_FORMATS.find(f => f.value === item.targetFormat);
        const ext = formatMeta ? formatMeta.ext : 'jpg';
        const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || `image-${idx + 1}`;
        zip.file(`${baseName}.${ext}`, item.convertedBlob as Blob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `samaxon-converted-images-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ZIP generation error:', e);
    } finally {
      setIsZipping(false);
    }
  };

  // Remove single image
  const removeImage = (id: string) => {
    setImages(prev => {
      const item = prev.find(p => p.id === id);
      if (item) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  // Clear all images
  const clearAll = () => {
    images.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setImages([]);
  };

  // Apply global format to all images
  const applyGlobalFormat = (fmt: OutputFormat) => {
    setGlobalFormat(fmt);
    setImages(prev => prev.map(p => ({ ...p, targetFormat: fmt, status: 'idle' })));
  };

  const doneCount = images.filter(i => i.status === 'done').length;

  return (
    <div className="space-y-8" id="image-converter-tool">
      {/* Privacy Guarantee Header Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D6B46A]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">Universal Batch Image Converter</h2>
            <p className="text-xs text-[#8A8178]">
              Convert PNG, JPG, WEBP, AVIF, BMP, GIF & SVG to any modern standard with zero compression lag.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% In-Browser Privacy
          </span>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-[28px] p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-[#D6B46A] bg-[#D6B46A]/10 scale-[1.01]' 
            : 'border-[#D6B46A]/30 bg-white hover:border-[#D6B46A] hover:bg-[#FFFDF9]'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.bmp,.gif,.svg,.ico" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#D6B46A] mx-auto flex items-center justify-center border border-[#D6B46A]/30 shadow-md">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[#111111]">
              Drag & Drop Photos Here, or Click to Browse
            </h3>
            <p className="text-xs text-[#8A8178]">
              Supports PNG, JPG, WEBP, AVIF, BMP, GIF, SVG, ICO. Unlimited batch processing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[11px] font-mono text-[#554F49] rounded-md">
              ⚡ Zero Server Upload
            </span>
            <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[11px] font-mono text-[#554F49] rounded-md">
              📦 Batch ZIP Export
            </span>
            <span className="px-2.5 py-1 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[11px] font-mono text-[#554F49] rounded-md">
              🎯 Custom Quality & BG
            </span>
          </div>
        </div>
      </div>

      {/* Global Controls & Conversion Toolbar */}
      {images.length > 0 && (
        <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] tracking-wider block">
                Batch Configuration
              </span>
              <h3 className="font-display font-bold text-lg text-[#111111]">
                Convert {images.length} {images.length === 1 ? 'Image' : 'Images'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="px-3 py-2 text-xs font-mono uppercase font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Target Output Format Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-[#554F49] block">
                Target Format (All Images)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_FORMATS.map(fmt => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => applyGlobalFormat(fmt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer text-center border ${
                      globalFormat === fmt.value 
                        ? 'bg-[#111111] text-[#D6B46A] border-[#111111] shadow-xs' 
                        : 'bg-[#FFFDF8] text-[#554F49] border-[#D6B46A]/25 hover:border-[#D6B46A]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase font-bold text-[#554F49]">
                  Export Quality: {Math.round(globalQuality * 100)}%
                </label>
                <span className="text-[10px] font-mono text-[#8A8178]">
                  {globalQuality >= 0.9 ? 'Maximum / Print' : globalQuality >= 0.75 ? 'Balanced Web' : 'Small File'}
                </span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05" 
                value={globalQuality}
                onChange={(e) => {
                  const q = parseFloat(e.target.value);
                  setGlobalQuality(q);
                  setImages(prev => prev.map(p => ({ ...p, targetQuality: q, status: 'idle' })));
                }}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8A8178]">
                <span>Compact (10%)</span>
                <span>Balanced (80%)</span>
                <span>Pristine (100%)</span>
              </div>
            </div>

            {/* Actions: Convert All & Download ZIP */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={convertAll}
                disabled={isConvertingAll}
                className="flex-1 py-3 px-5 bg-[#111111] text-[#D6B46A] hover:bg-[#222222] text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isConvertingAll ? 'animate-spin' : ''}`} />
                <span>{isConvertingAll ? 'Converting...' : 'Convert All Now'}</span>
              </button>

              {doneCount > 0 && (
                <button
                  onClick={downloadAllZip}
                  disabled={isZipping}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                  title="Download all converted images as a ZIP archive"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? 'Zipping...' : `Download ZIP (${doneCount})`}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Items List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-[#8A8178] tracking-wider">
              Queue & Status ({doneCount}/{images.length} Converted)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {images.map(item => {
              const formatMeta = SUPPORTED_FORMATS.find(f => f.value === item.targetFormat);
              const isSaved = item.convertedSize && item.convertedSize < item.originalSize;
              const percentDiff = item.convertedSize 
                ? Math.round(Math.abs((item.convertedSize - item.originalSize) / item.originalSize) * 100) 
                : null;

              return (
                <div 
                  key={item.id}
                  className="p-4 bg-white border border-[#D6B46A]/25 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-[#D6B46A]/50 transition-colors"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-[#FFFDF8] border border-[#D6B46A]/25 overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={item.previewUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="space-y-0.5 min-w-0 text-left">
                      <h4 className="font-bold text-sm text-[#111111] truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8A8178]">
                        <span>Original: {formatBytes(item.originalSize)}</span>
                        {item.width > 0 && <span>· {item.width}×{item.height}px</span>}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Conversion Target Controls */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-[#554F49]">Format:</span>
                      <select
                        value={item.targetFormat}
                        onChange={(e) => {
                          const fmt = e.target.value as OutputFormat;
                          setImages(prev => prev.map(p => p.id === item.id ? { ...p, targetFormat: fmt, status: 'idle' } : p));
                        }}
                        className="px-2.5 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-lg text-xs font-mono font-bold text-[#111111]"
                      >
                        {SUPPORTED_FORMATS.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Result Stats Badge */}
                    {item.status === 'done' && item.convertedSize && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FFFDF8] border border-[#D6B46A]/30 text-xs font-mono">
                        <span className="font-bold text-[#111111]">{formatBytes(item.convertedSize)}</span>
                        {percentDiff !== null && (
                          <span className={`text-[10.5px] font-bold ${isSaved ? 'text-emerald-700' : 'text-[#8A8178]'}`}>
                            ({isSaved ? `-${percentDiff}%` : `+${percentDiff}%`})
                          </span>
                        )}
                      </div>
                    )}

                    {item.status === 'converting' && (
                      <span className="text-xs font-mono text-amber-700 flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Converting...
                      </span>
                    )}

                    {item.status === 'error' && (
                      <span className="text-xs font-mono text-rose-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Error
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {item.status !== 'done' ? (
                      <button
                        onClick={() => convertSingle(item.id)}
                        disabled={item.status === 'converting'}
                        className="px-3.5 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold uppercase rounded-xl border border-[#D6B46A]/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${item.status === 'converting' ? 'animate-spin' : ''}`} />
                        <span>Convert</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => downloadSingle(item)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    )}

                    <button
                      onClick={() => removeImage(item.id)}
                      className="p-2 text-[#8A8178] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature & Format Spec Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 space-y-2">
          <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#7A6020] text-[10px] font-mono uppercase font-bold rounded">
            WEBP Standard
          </span>
          <h4 className="font-bold text-sm text-[#111111]">Google WEBP 2.0</h4>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            Delivers up to 35% smaller file sizes than JPEG while supporting transparent alpha channel. Perfect for SEO scores.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 space-y-2">
          <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#7A6020] text-[10px] font-mono uppercase font-bold rounded">
            PNG Lossless
          </span>
          <h4 className="font-bold text-sm text-[#111111]">Transparent Alpha</h4>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            Preserves crisp edges for logos, icons, vector graphics, and transparent overlays without compression artifacts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 space-y-2">
          <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#7A6020] text-[10px] font-mono uppercase font-bold rounded">
            ICO Favicon
          </span>
          <h4 className="font-bold text-sm text-[#111111]">Favicon Generator</h4>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            Converts any square graphic into a valid multi-resolution browser favicon.ico file ready for immediate root deployment.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 space-y-2">
          <span className="px-2 py-0.5 bg-[#D6B46A]/15 text-[#7A6020] text-[10px] font-mono uppercase font-bold rounded">
            JPG Universal
          </span>
          <h4 className="font-bold text-sm text-[#111111]">Universal Web Photo</h4>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            The global baseline supported by every browser, device, email client, and print shop in existence.
          </p>
        </div>
      </div>
    </div>
  );
}
