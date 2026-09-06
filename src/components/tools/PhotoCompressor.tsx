import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Download, Image as ImageIcon, Sliders, Check, 
  Trash2, Copy, FileCheck, ArrowRight, ShieldCheck, Zap, 
  RefreshCw, Layers, Sparkles, ChevronRight, Eye
} from 'lucide-react';
import JSZip from 'jszip';

interface CompressedImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalDataUrl: string;
  compressedBlob: Blob | null;
  compressedDataUrl: string | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  savingsPercent: number;
  isProcessing: boolean;
}

export default function PhotoCompressor() {
  const [images, setImages] = useState<CompressedImageItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Compression Settings
  const [mode, setMode] = useState<'quality' | 'targetSize'>('quality');
  const [quality, setQuality] = useState<number>(75); // 5 to 100
  const [targetKb, setTargetKb] = useState<number>(100); // in KB
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original, else cap width/height
  
  // View Comparison mode
  const [viewMode, setViewMode] = useState<'split' | 'sideBySide'>('split');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef<boolean>(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Helper to compress an HTMLImageElement using canvas
  const compressImage = useCallback(async (
    img: HTMLImageElement, 
    mimeType: string, 
    qFactor: number,
    maxDim: number
  ): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> => {
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (maxDim > 0 && (width > maxDim || height > maxDim)) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) throw new Error('Canvas context unavailable');

    // High quality canvas rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If converting to JPEG, draw solid white background to avoid black transparency
    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob failed'));
            return;
          }
          const dataUrl = URL.createObjectURL(blob);
          resolve({ blob, dataUrl, width, height });
        },
        mimeType,
        mimeType === 'image/png' ? undefined : qFactor
      );
    });
  }, []);

  // Binary search optimizer for target file size
  const compressToTargetSize = useCallback(async (
    img: HTMLImageElement,
    mimeType: string,
    targetBytes: number,
    maxDim: number
  ): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> => {
    // If target is very small, start with reduced dimensions if needed
    let dim = maxDim;
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    // Binary search quality factor between 0.05 and 0.98
    let low = 0.05;
    let high = 0.98;
    let bestResult: { blob: Blob; dataUrl: string; width: number; height: number } | null = null;
    let attempts = 0;

    while (low <= high && attempts < 7) {
      attempts++;
      const mid = (low + high) / 2;
      const res = await compressImage(img, mimeType, mid, dim);

      if (res.blob.size <= targetBytes) {
        bestResult = res;
        // Try higher quality to see if we can get closer to target
        low = mid + 0.05;
      } else {
        // Exceeded target, reduce quality
        high = mid - 0.05;
      }
    }

    // If even lowest quality is larger than target, downscale dimensions proportionally
    if (!bestResult || bestResult.blob.size > targetBytes) {
      let scale = 0.8;
      while (scale >= 0.25) {
        const scaledDim = Math.round(Math.max(width, height) * scale);
        const res = await compressImage(img, mimeType, 0.6, scaledDim);
        if (res.blob.size <= targetBytes || scale <= 0.3) {
          bestResult = res;
          break;
        }
        scale -= 0.15;
      }
    }

    return bestResult || (await compressImage(img, mimeType, 0.4, dim));
  }, [compressImage]);

  // Process a single item
  const processItem = useCallback(async (item: CompressedImageItem) => {
    return new Promise<CompressedImageItem>((resolve) => {
      const img = new Image();
      img.onload = async () => {
        try {
          let result;
          if (mode === 'targetSize') {
            const targetBytes = targetKb * 1024;
            result = await compressToTargetSize(img, outputFormat, targetBytes, maxDimension);
          } else {
            const q = Math.max(0.05, Math.min(1.0, quality / 100));
            result = await compressImage(img, outputFormat, q, maxDimension);
          }

          const savings = Math.max(
            0,
            Math.round(((item.originalSize - result.blob.size) / item.originalSize) * 100)
          );

          resolve({
            ...item,
            compressedBlob: result.blob,
            compressedDataUrl: result.dataUrl,
            compressedSize: result.blob.size,
            compressedWidth: result.width,
            compressedHeight: result.height,
            savingsPercent: savings,
            isProcessing: false,
          });
        } catch (err) {
          console.error('Compression error:', err);
          resolve({ ...item, isProcessing: false });
        }
      };
      img.onerror = () => {
        resolve({ ...item, isProcessing: false });
      };
      img.src = item.originalDataUrl;
    });
  }, [mode, targetKb, quality, outputFormat, maxDimension, compressToTargetSize, compressImage]);

  // Trigger compression whenever settings change
  useEffect(() => {
    if (images.length === 0) return;

    let isMounted = true;
    const runRecompression = async () => {
      setImages((prev) => prev.map((img) => ({ ...img, isProcessing: true })));

      const updated = await Promise.all(
        images.map((item) => processItem(item))
      );

      if (isMounted) {
        setImages(updated);
      }
    };

    const timer = setTimeout(runRecompression, 180);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [quality, targetKb, mode, outputFormat, maxDimension]);

  // Handle file uploads
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: CompressedImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const item: CompressedImageItem = {
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            originalDataUrl: dataUrl,
            compressedBlob: null,
            compressedDataUrl: null,
            compressedSize: 0,
            compressedWidth: img.naturalWidth,
            compressedHeight: img.naturalHeight,
            savingsPercent: 0,
            isProcessing: true,
          };

          setImages((prev) => {
            const next = [...prev, item];
            if (!selectedId) setSelectedId(item.id);
            return next;
          });

          // Process immediately
          processItem(item).then((processed) => {
            setImages((prev) => prev.map((p) => (p.id === processed.id ? processed : p)));
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const activeItem = images.find((i) => i.id === selectedId) || images[0] || null;

  // Single download
  const handleDownload = (item: CompressedImageItem) => {
    if (!item.compressedBlob) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}-compressed-samaxon.${ext}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(item.compressedBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    if (images.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';

      images.forEach((item, index) => {
        if (item.compressedBlob) {
          const baseName = item.name.replace(/\.[^/.]+$/, '');
          zip.file(`${index + 1}-${baseName}-compressed.${ext}`, item.compressedBlob);
        }
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `SamaXon-Compressed-Pack-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('ZIP error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = async (item: CompressedImageItem) => {
    if (!item.compressedBlob) return;
    try {
      // Browsers generally require image/png for navigator.clipboard.write
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = item.compressedWidth;
        canvas.height = item.compressedHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob && navigator.clipboard && (window as any).ClipboardItem) {
              await navigator.clipboard.write([
                new (window as any).ClipboardItem({ 'image/png': blob })
              ]);
              setCopiedNotification(true);
              setTimeout(() => setCopiedNotification(false), 2400);
            }
          }, 'image/png');
        }
      };
      img.src = item.compressedDataUrl || '';
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (selectedId === id) {
        setSelectedId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  // Slider dragging handlers
  const handleSplitTouchMove = (clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div className="space-y-8 text-left" id="photo-compressor-engine">
      {/* Upload Zone / Drop area */}
      {images.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/80 border-2 border-dashed border-[#D6B46A]/35 hover:border-[#D6B46A] rounded-[32px] p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-[0_12px_32px_rgba(214,180,106,0.15)] group relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/bmp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/30 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#D6B46A] transition-all">
              <Upload className="w-8 h-8 animate-bounce-slow" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                Drop your photos here or click to browse
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
                Supports JPG, PNG, WEBP, and AVIF. Unlimited batch files with zero watermarks.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[10px] font-mono font-bold uppercase rounded-full">
                ✦ 100% Client-Side Privacy
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold uppercase rounded-full">
                ✦ Up to 95% Size Reduction
              </span>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold uppercase rounded-full">
                ✦ Target KB Mode Available
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Controls & Settings Rail (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#D6B46A]/20 rounded-[28px] p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#D6B46A] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider">
                    Compression Parameters
                  </h4>
                  <span className="text-[10px] text-[#8A8178] font-mono">
                    Adjust quality, target size & format
                  </span>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#111111] hover:text-[#D6B46A] text-[#111111] border border-[#D6B46A]/30 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
              >
                + Add More
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Mode Switcher: Quality vs Target KB */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                Compression Strategy
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#FFFDF8] p-1 border border-[#D6B46A]/20 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('quality')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'quality'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  Quality Factor
                </button>
                <button
                  type="button"
                  onClick={() => setMode('targetSize')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'targetSize'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  Exact Target KB
                </button>
              </div>
            </div>

            {/* MODE A: Quality Slider */}
            {mode === 'quality' ? (
              <div className="space-y-3 bg-[#FFFDF8] border border-[#D6B46A]/15 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">Image Quality Level</span>
                  <span className="px-2.5 py-0.5 bg-[#111111] text-[#D6B46A] font-mono font-bold text-xs rounded-md">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#D6B46A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8A8178]">
                  <span>5% (Max Reduction)</span>
                  <span>75% (Recommended)</span>
                  <span>100% (Lossless)</span>
                </div>
              </div>
            ) : (
              /* MODE B: Exact Target Size in KB */
              <div className="space-y-3 bg-[#FFFDF8] border border-[#D6B46A]/15 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">Target Max File Size</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={targetKb}
                      onChange={(e) => setTargetKb(Math.max(10, Number(e.target.value)))}
                      className="w-20 px-2 py-1 bg-white border border-[#D6B46A]/30 rounded-md text-xs font-mono font-bold text-right outline-none focus:border-[#D6B46A]"
                    />
                    <span className="text-xs font-mono font-bold text-[#111111]">KB</span>
                  </div>
                </div>

                {/* Popular Quick Target Presets for Govt & Exam forms */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-mono text-[#8A8178] uppercase">
                    One-Click Official Target Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '20 KB (Signatures)', kb: 20 },
                      { label: '50 KB (Govt Portals)', kb: 50 },
                      { label: '100 KB (Passport/Visa)', kb: 100 },
                      { label: '200 KB (UPSC/SSC)', kb: 200 },
                      { label: '500 KB (Web/Email)', kb: 500 },
                      { label: '1 MB (High-Res)', kb: 1024 },
                    ].map((p) => (
                      <button
                        key={p.kb}
                        type="button"
                        onClick={() => setTargetKb(p.kb)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                          targetKb === p.kb
                            ? 'bg-[#D6B46A] text-black border-[#D6B46A]'
                            : 'bg-white border-[#D6B46A]/20 text-[#8A8178] hover:border-[#D6B46A]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Output Format Converter */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                Output Format Conversion
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'JPEG (.jpg)', mime: 'image/jpeg' },
                  { label: 'WebP (.webp)', mime: 'image/webp' },
                  { label: 'PNG (.png)', mime: 'image/png' },
                ].map((fmt) => (
                  <button
                    key={fmt.mime}
                    type="button"
                    onClick={() => setOutputFormat(fmt.mime as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold uppercase font-mono tracking-wider border transition-all cursor-pointer ${
                      outputFormat === fmt.mime
                        ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A] shadow-xs'
                        : 'bg-[#FFFDF8] text-[#8A8178] border-[#D6B46A]/20 hover:border-[#D6B46A]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Resolution / Dimension limiter */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                Max Dimension Cap (Optional)
              </label>
              <select
                value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                className="w-full bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl p-2.5 text-xs text-[#111111] font-mono outline-none focus:border-[#D6B46A]"
              >
                <option value={0}>Original Dimensions (No Rescaling)</option>
                <option value={2560}>2560 px (Quad HD)</option>
                <option value={1920}>1920 px (Full HD 1080p)</option>
                <option value={1280}>1280 px (HD 720p)</option>
                <option value={800}>800 px (Standard Web Banner)</option>
                <option value={400}>400 px (Avatar / Profile)</option>
              </select>
            </div>

            {/* Uploaded Images Thumbnail Strip */}
            <div className="space-y-2 pt-2 border-t border-[#D6B46A]/15">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178]">
                  Batch Queue ({images.length} image{images.length > 1 ? 's' : ''})
                </span>
                {images.length > 1 && (
                  <button
                    onClick={handleDownloadAllZip}
                    disabled={isZipping}
                    className="text-[10px] font-mono text-[#BFA15A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isZipping ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    Download All as ZIP
                  </button>
                )}
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedId(img.id)}
                    className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedId === img.id
                        ? 'border-[#D6B46A] shadow-md scale-105'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.originalDataUrl}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(img.id);
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] hover:bg-red-700"
                    >
                      ×
                    </button>
                    {img.savingsPercent > 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[#D6B46A] text-[8px] font-mono text-center font-bold">
                        -{img.savingsPercent}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Interactive Preview & Comparison (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            {activeItem && (
              <div className="bg-white border border-[#D6B46A]/20 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header Stats Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#111111] truncate max-w-sm" title={activeItem.name}>
                      {activeItem.name}
                    </h3>
                    <p className="text-xs text-[#8A8178] font-mono mt-0.5">
                      {activeItem.originalWidth} × {activeItem.originalHeight} px · {formatFileSize(activeItem.originalSize)}
                    </p>
                  </div>

                  {/* Savings Badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Compressed Size</span>
                      <span className="text-lg font-display font-black text-[#111111]">
                        {formatFileSize(activeItem.compressedSize)}
                      </span>
                    </div>

                    <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 font-mono font-extrabold text-sm rounded-xl">
                      -{activeItem.savingsPercent}% SAVED
                    </div>
                  </div>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('split')}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        viewMode === 'split'
                          ? 'bg-[#111111] text-[#D6B46A]'
                          : 'bg-[#FFFDF8] text-[#8A8178] border border-[#D6B46A]/20'
                      }`}
                    >
                      Interactive Split Slider
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('sideBySide')}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        viewMode === 'sideBySide'
                          ? 'bg-[#111111] text-[#D6B46A]'
                          : 'bg-[#FFFDF8] text-[#8A8178] border border-[#D6B46A]/20'
                      }`}
                    >
                      Side by Side
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[#8A8178] hidden sm:inline">
                    Drag slider to compare sharpness
                  </span>
                </div>

                {/* Interactive Split View / Canvas Container */}
                {viewMode === 'split' ? (
                  <div
                    ref={splitContainerRef}
                    onMouseDown={() => { isDraggingSlider.current = true; }}
                    onMouseUp={() => { isDraggingSlider.current = false; }}
                    onMouseLeave={() => { isDraggingSlider.current = false; }}
                    onMouseMove={(e) => {
                      if (isDraggingSlider.current) handleSplitTouchMove(e.clientX);
                    }}
                    onTouchMove={(e) => {
                      if (e.touches.length > 0) handleSplitTouchMove(e.touches[0].clientX);
                    }}
                    className="relative w-full h-[360px] sm:h-[440px] bg-[#111111] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-[#D6B46A]/20 shadow-inner"
                  >
                    {/* Background: Compressed Image (Right Side) */}
                    <img
                      src={activeItem.compressedDataUrl || activeItem.originalDataUrl}
                      alt="Compressed Preview"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/75 backdrop-blur-md text-[#D6B46A] text-[9px] font-mono uppercase font-bold rounded-lg border border-[#D6B46A]/30">
                      Compressed ({formatFileSize(activeItem.compressedSize)})
                    </div>

                    {/* Foreground: Original Image clipped to sliderPosition (Left Side) */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={activeItem.originalDataUrl}
                        alt="Original Preview"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        style={{
                          width: splitContainerRef.current?.clientWidth || '100%',
                          maxWidth: 'none',
                        }}
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[9px] font-mono uppercase font-bold rounded-lg border border-white/20">
                        Original ({formatFileSize(activeItem.originalSize)})
                      </div>
                    </div>

                    {/* Divider Line & Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#D6B46A] shadow-[0_0_12px_rgba(214,180,106,0.8)] pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111111] border-2 border-[#D6B46A] flex items-center justify-center text-[#D6B46A] text-xs shadow-xl">
                        ↔
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Side by Side View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                        <span className="text-[#8A8178] uppercase">Original</span>
                        <span className="text-[#111111]">{formatFileSize(activeItem.originalSize)}</span>
                      </div>
                      <div className="w-full h-64 bg-[#111111] rounded-2xl overflow-hidden border border-[#D6B46A]/20 flex items-center justify-center p-2">
                        <img
                          src={activeItem.originalDataUrl}
                          alt="Original"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                        <span className="text-[#BFA15A] uppercase">Compressed</span>
                        <span className="text-[#111111]">{formatFileSize(activeItem.compressedSize)}</span>
                      </div>
                      <div className="w-full h-64 bg-[#111111] rounded-2xl overflow-hidden border border-[#D6B46A]/20 flex items-center justify-center p-2">
                        <img
                          src={activeItem.compressedDataUrl || activeItem.originalDataUrl}
                          alt="Compressed"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => handleDownload(activeItem)}
                    className="w-full sm:flex-1 py-4 bg-[#111111] text-[#D6B46A] hover:bg-black hover:text-white font-bold uppercase tracking-widest text-xs rounded-2xl border border-[#D6B46A]/40 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
                  >
                    <Download className="w-4 h-4" />
                    Download Compressed ({formatFileSize(activeItem.compressedSize)})
                  </button>

                  <button
                    onClick={() => handleCopyToClipboard(activeItem)}
                    className="w-full sm:w-auto px-5 py-4 bg-[#FFFDF8] hover:bg-white text-[#111111] border border-[#D6B46A]/30 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#8A8178]" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature Highlights Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#D6B46A]/15 text-left">
        <div className="p-4 bg-white/60 border border-[#D6B46A]/15 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-[#111111] font-display font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#BFA15A]" />
            100% Client-Side Private
          </div>
          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            Your photos never leave your device. All compression happens directly inside your web browser’s GPU canvas.
          </p>
        </div>

        <div className="p-4 bg-white/60 border border-[#D6B46A]/15 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-[#111111] font-display font-bold text-xs">
            <Zap className="w-4 h-4 text-[#BFA15A]" />
            Exact Target KB Engine
          </div>
          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            Need an image under 50KB or 100KB for government forms or job portals? Our binary search algorithm nails it without blur.
          </p>
        </div>

        <div className="p-4 bg-white/60 border border-[#D6B46A]/15 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-[#111111] font-display font-bold text-xs">
            <Layers className="w-4 h-4 text-[#BFA15A]" />
            Batch Zip Downloads
          </div>
          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            Drop 20 images at once, apply unified compression, and export everything into a single organized ZIP package in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
