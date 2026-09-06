import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Download, Crop, Lock, Unlock, RotateCw, RotateCcw, 
  FlipHorizontal, FlipVertical, Image as ImageIcon, Sliders, 
  Check, RefreshCw, Layers, Sparkles, ShieldCheck, Zap, ArrowRight, 
  Maximize2, Eye
} from 'lucide-react';

interface PresetItem {
  name: string;
  category: 'document' | 'social' | 'web';
  width: number;
  height: number;
  description: string;
  badge: string;
}

const SMART_PRESETS: PresetItem[] = [
  // Official Documents
  { name: 'Indian Passport / Visa', category: 'document', width: 413, height: 531, description: '3.5 × 4.5 cm (300 DPI Official Standard)', badge: 'Govt / Visa' },
  { name: 'US Visa / Passport', category: 'document', width: 600, height: 600, description: '2 × 2 inches (Square 300 DPI)', badge: 'US Embassy' },
  { name: 'Official Exam Signature', category: 'document', width: 140, height: 60, description: 'UPSC / SSC / Govt Exam signature standard', badge: 'Signature' },
  { name: 'UPSC / Govt Job Photo', category: 'document', width: 200, height: 230, description: 'Standard recruitment portal photo dimensions', badge: 'Exam Portal' },
  { name: 'PAN / Aadhaar Card Photo', category: 'document', width: 295, height: 413, description: '2.5 × 3.5 cm high-density scan standard', badge: 'National ID' },
  
  // Social Media
  { name: 'Instagram Square Post', category: 'social', width: 1080, height: 1080, description: '1:1 ratio square post layout', badge: 'Instagram' },
  { name: 'Instagram Story / Reel', category: 'social', width: 1080, height: 1920, description: '9:16 vertical full-screen visual', badge: 'Reels / TikTok' },
  { name: 'YouTube Video Thumbnail', category: 'social', width: 1280, height: 720, description: '16:9 ultra-clickable high-contrast frame', badge: 'YouTube' },
  { name: 'YouTube Channel Banner', category: 'social', width: 2560, height: 1440, description: 'Desktop & TV safe zone banner', badge: 'YouTube TV' },
  { name: 'LinkedIn Company Banner', category: 'social', width: 1584, height: 396, description: 'Executive profile & company header', badge: 'LinkedIn' },
  { name: 'LinkedIn Profile Avatar', category: 'social', width: 400, height: 400, description: 'Crisp professional headshot crop', badge: 'Headshot' },
  { name: 'Twitter / X Header', category: 'social', width: 1500, height: 500, description: '3:1 widescreen header banner', badge: 'X / Twitter' },
  { name: 'Facebook Page Cover', category: 'social', width: 820, height: 312, description: 'Responsive business page banner', badge: 'Facebook' },

  // Web & Digital
  { name: 'Web Favicon / App Icon', category: 'web', width: 512, height: 512, description: 'High-res PWA & favicon source asset', badge: 'App Icon' },
  { name: 'Full HD Web Banner', category: 'web', width: 1920, height: 1080, description: '16:9 desktop presentation & website hero', badge: 'Web Hero' },
  { name: 'Ultra-HD 4K Asset', category: 'web', width: 3840, height: 2160, description: 'Crisp 4K canvas rendering', badge: '4K Ultra' }
];

export default function PhotoResizer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);

  // Resize Controls
  const [unit, setUnit] = useState<'px' | 'cm' | 'mm' | 'in'>('px');
  const [targetWidth, setTargetWidth] = useState<number>(1080);
  const [targetHeight, setTargetHeight] = useState<number>(1080);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  
  // Percentage Mode
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage' | 'presets'>('presets');
  const [percentage, setPercentage] = useState<number>(100);

  // Fit and crop strategy
  const [fitMode, setFitMode] = useState<'cover' | 'contain' | 'stretch'>('cover');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // Transformations
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Output config
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [dpi, setDpi] = useState<number>(300);
  const [outputQuality, setOutputQuality] = useState<number>(92);

  // Real-time processed preview
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Convert unit to pixels based on chosen DPI
  const unitToPx = (val: number, u: 'px' | 'cm' | 'mm' | 'in', currentDpi: number): number => {
    if (u === 'px') return Math.round(val);
    if (u === 'in') return Math.round(val * currentDpi);
    if (u === 'cm') return Math.round((val / 2.54) * currentDpi);
    if (u === 'mm') return Math.round((val / 25.4) * currentDpi);
    return Math.round(val);
  };

  const pxToUnit = (px: number, u: 'px' | 'cm' | 'mm' | 'in', currentDpi: number): number => {
    if (u === 'px') return px;
    if (u === 'in') return Number((px / currentDpi).toFixed(2));
    if (u === 'cm') return Number(((px / currentDpi) * 2.54).toFixed(2));
    if (u === 'mm') return Number(((px / currentDpi) * 25.4).toFixed(1));
    return px;
  };

  // Handle uploaded image
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setImageFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setOriginalWidth(w);
        setOriginalHeight(h);
        setAspectRatio(w / h);
        setTargetWidth(w);
        setTargetHeight(h);
        setImageDataUrl(url);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  // Update width and handle aspect lock
  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(val / aspectRatio));
    }
  };

  // Update height and handle aspect lock
  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(val * aspectRatio));
    }
  };

  // Swap Dimensions
  const handleSwapDimensions = () => {
    const tempW = targetWidth;
    const tempH = targetHeight;
    setTargetWidth(tempH);
    setTargetHeight(tempW);
    setAspectRatio(tempH / tempW);
  };

  // Apply a preset
  const applyPreset = (preset: PresetItem) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setAspectRatio(preset.width / preset.height);
    setResizeMode('dimensions');
  };

  // Percentage change
  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    if (originalWidth > 0 && originalHeight > 0) {
      const factor = pct / 100;
      setTargetWidth(Math.round(originalWidth * factor));
      setTargetHeight(Math.round(originalHeight * factor));
    }
  };

  // Core Canvas Processing Engine
  const processCanvas = useCallback(async () => {
    if (!imageDataUrl || targetWidth <= 0 || targetHeight <= 0) return;

    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background color fill for contain mode or JPEG conversion
        if (fitMode === 'contain' || outputFormat === 'image/jpeg') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // Apply transformations (rotation, flip)
        ctx.save();
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        if (fitMode === 'cover') {
          // Crop to fill exactly
          const imgAspect = imgWidth / imgHeight;
          const targetAspect = targetWidth / targetHeight;
          let drawW = targetWidth;
          let drawH = targetHeight;

          if (imgAspect > targetAspect) {
            drawW = targetHeight * imgAspect;
          } else {
            drawH = targetWidth / imgAspect;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        } else if (fitMode === 'contain') {
          // Fit inside bounds with padding
          const imgAspect = imgWidth / imgHeight;
          const targetAspect = targetWidth / targetHeight;
          let drawW = targetWidth;
          let drawH = targetHeight;

          if (imgAspect > targetAspect) {
            drawH = targetWidth / imgAspect;
          } else {
            drawW = targetHeight * imgAspect;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          // Stretch exactly
          ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
        }

        ctx.restore();

        // Convert to Blob
        const qFactor = outputFormat === 'image/png' ? undefined : outputQuality / 100;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setPreviewBlob(blob);
              setPreviewDataUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          },
          outputFormat,
          qFactor
        );
      } catch (err) {
        console.error('Canvas processing error:', err);
        setIsProcessing(false);
      }
    };
    img.src = imageDataUrl;
  }, [
    imageDataUrl,
    targetWidth,
    targetHeight,
    fitMode,
    bgColor,
    rotation,
    flipH,
    flipV,
    outputFormat,
    outputQuality,
  ]);

  // Debounced real-time processing
  useEffect(() => {
    if (!imageDataUrl) return;
    const timer = setTimeout(processCanvas, 150);
    return () => clearTimeout(timer);
  }, [processCanvas]);

  // Download Resized Image
  const handleDownload = () => {
    if (!previewBlob) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const baseName = imageFile?.name.replace(/\.[^/.]+$/, '') || 'photo';
    const filename = `${baseName}-${targetWidth}x${targetHeight}-samaxon.${ext}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(previewBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 text-left" id="photo-resizer-engine">
      {/* Upload Zone */}
      {!imageDataUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleImageUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/80 border-2 border-dashed border-[#D6B46A]/35 hover:border-[#D6B46A] rounded-[32px] p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-[0_12px_32px_rgba(214,180,106,0.15)] group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/bmp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />

          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/30 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#D6B46A] transition-all">
              <Crop className="w-8 h-8 animate-bounce-slow" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                Upload image to resize, crop & transform
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
                Resize by pixels, cm, mm, inch, percentage or one-click official ID & social media presets.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[10px] font-mono font-bold uppercase rounded-full">
                ✦ Indian & US Visa Ready
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold uppercase rounded-full">
                ✦ 300 DPI Print Quality
              </span>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold uppercase rounded-full">
                ✦ Zero Blur Resampling
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Settings & Parameters (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#D6B46A]/20 rounded-[28px] p-6 sm:p-7 shadow-sm space-y-6">
            {/* Header / Replace file */}
            <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-4">
              <div>
                <h4 className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider">
                  Resize Engine
                </h4>
                <span className="text-[10px] text-[#8A8178] font-mono">
                  Original: {originalWidth} × {originalHeight} px ({formatFileSize(originalSize)})
                </span>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#111111] hover:text-[#D6B46A] text-[#111111] border border-[#D6B46A]/30 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
              >
                Change Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Mode Switcher: Presets vs Exact Dimensions vs Percentage */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                Resize Method
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#FFFDF8] p-1 border border-[#D6B46A]/20 rounded-xl">
                <button
                  type="button"
                  onClick={() => setResizeMode('presets')}
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    resizeMode === 'presets'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  Smart Presets
                </button>
                <button
                  type="button"
                  onClick={() => setResizeMode('dimensions')}
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    resizeMode === 'dimensions'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  Custom Size
                </button>
                <button
                  type="button"
                  onClick={() => setResizeMode('percentage')}
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    resizeMode === 'percentage'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#111111]'
                  }`}
                >
                  Percentage
                </button>
              </div>
            </div>

            {/* PRESETS LIST */}
            {resizeMode === 'presets' && (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                <span className="text-[9px] font-mono text-[#8A8178] uppercase font-bold block">
                  Click any standard to load exact dimensions:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {SMART_PRESETS.map((preset) => {
                    const isSelected = targetWidth === preset.width && targetHeight === preset.height;
                    return (
                      <div
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#D6B46A]'
                            : 'bg-[#FFFDF8] border-[#D6B46A]/15 hover:border-[#D6B46A]/50 text-[#111111]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{preset.name}</span>
                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              isSelected ? 'bg-[#D6B46A] text-black' : 'bg-[#D6B46A]/15 text-[#BFA15A]'
                            }`}>
                              {preset.badge}
                            </span>
                          </div>
                          <p className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-[#8A8178]'}`}>
                            {preset.description}
                          </p>
                        </div>

                        <span className={`text-xs font-mono font-bold shrink-0 ml-2 ${
                          isSelected ? 'text-[#D6B46A]' : 'text-[#111111]'
                        }`}>
                          {preset.width} × {preset.height}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CUSTOM DIMENSIONS INPUTS */}
            {resizeMode === 'dimensions' && (
              <div className="space-y-4 bg-[#FFFDF8] border border-[#D6B46A]/15 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">Dimension Units</span>
                  <div className="flex gap-1">
                    {(['px', 'cm', 'mm', 'in'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                          unit === u
                            ? 'bg-[#111111] text-[#D6B46A]'
                            : 'bg-white text-[#8A8178] border border-[#D6B46A]/20'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Width</label>
                    <input
                      type="number"
                      min="1"
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-[#D6B46A]/30 rounded-xl p-2.5 text-sm font-mono font-bold text-[#111111] outline-none focus:border-[#D6B46A]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Height</label>
                    <input
                      type="number"
                      min="1"
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-[#D6B46A]/30 rounded-xl p-2.5 text-sm font-mono font-bold text-[#111111] outline-none focus:border-[#D6B46A]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      lockAspectRatio
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-[#8A8178] border-[#D6B46A]/20'
                    }`}
                  >
                    {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{lockAspectRatio ? 'Ratio Locked' : 'Ratio Free'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSwapDimensions}
                    className="text-[10px] font-mono font-bold text-[#BFA15A] hover:underline cursor-pointer"
                  >
                    Swap (W ⇄ H)
                  </button>
                </div>
              </div>
            )}

            {/* PERCENTAGE RESIZE */}
            {resizeMode === 'percentage' && (
              <div className="space-y-3 bg-[#FFFDF8] border border-[#D6B46A]/15 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">Scale Ratio</span>
                  <span className="px-2.5 py-0.5 bg-[#111111] text-[#D6B46A] font-mono font-bold text-xs rounded-md">
                    {percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="5"
                  value={percentage}
                  onChange={(e) => handlePercentageChange(Number(e.target.value))}
                  className="w-full accent-[#D6B46A] cursor-pointer"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[25, 50, 75, 100, 150, 200].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePercentageChange(p)}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        percentage === p
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-[#8A8178] border-[#D6B46A]/20 hover:border-[#D6B46A]'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fit & Crop Strategy */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                Fit & Aspect Handling
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cover', label: 'Cover & Crop', desc: 'No distortion, fills box' },
                  { id: 'contain', label: 'Fit & Pad', desc: 'Adds border padding' },
                  { id: 'stretch', label: 'Direct Stretch', desc: 'Exact dimensions' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFitMode(m.id as any)}
                    className={`py-2 px-2 rounded-xl text-left border transition-all cursor-pointer ${
                      fitMode === m.id
                        ? 'bg-[#111111] text-white border-[#D6B46A]'
                        : 'bg-[#FFFDF8] text-[#111111] border-[#D6B46A]/20 hover:border-[#D6B46A]'
                    }`}
                  >
                    <span className="block text-[11px] font-bold leading-tight">{m.label}</span>
                    <span className="block text-[9px] text-[#8A8178] mt-0.5">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rotate & Flip Tools */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                Quick Transformations
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="p-2.5 bg-[#FFFDF8] hover:bg-white border border-[#D6B46A]/20 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Rotate -90°"
                >
                  <RotateCcw className="w-4 h-4 text-[#BFA15A]" />
                  <span>-90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2.5 bg-[#FFFDF8] hover:bg-white border border-[#D6B46A]/20 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Rotate +90°"
                >
                  <RotateCw className="w-4 h-4 text-[#BFA15A]" />
                  <span>+90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    flipH ? 'bg-[#111111] text-white border-black' : 'bg-[#FFFDF8] text-[#111111] border-[#D6B46A]/20'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Flip H</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    flipV ? 'bg-[#111111] text-white border-black' : 'bg-[#FFFDF8] text-[#111111] border-[#D6B46A]/20'
                  }`}
                  title="Flip Vertical"
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Flip V</span>
                </button>
              </div>
            </div>

            {/* Export Format & DPI Selection */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D6B46A]/15">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl p-2 text-xs font-mono font-bold text-[#111111] outline-none"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png lossless)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#8A8178] font-bold">Print DPI</label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl p-2 text-xs font-mono font-bold text-[#111111] outline-none"
                >
                  <option value={72}>72 DPI (Web Screen)</option>
                  <option value={150}>150 DPI (Standard)</option>
                  <option value={300}>300 DPI (Ultra Print)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Processed Canvas Preview (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white border border-[#D6B46A]/20 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-[#111111]">
                    Live Resized Output
                  </h3>
                  <p className="text-xs text-[#8A8178] font-mono mt-0.5">
                    Target: {targetWidth} × {targetHeight} px · {dpi} DPI
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {previewBlob && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Est. Size</span>
                      <span className="text-sm font-display font-black text-[#111111]">
                        {formatFileSize(previewBlob.size)}
                      </span>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="flex items-center gap-1.5 text-xs text-[#BFA15A] font-mono animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Rendering...
                    </div>
                  )}
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="w-full h-[360px] sm:h-[460px] bg-[#111111] rounded-2xl overflow-hidden border border-[#D6B46A]/20 flex items-center justify-center p-4 relative shadow-inner">
                {previewDataUrl ? (
                  <img
                    src={previewDataUrl}
                    alt="Resized Result"
                    className="max-w-full max-h-full object-contain rounded shadow-lg"
                  />
                ) : (
                  <div className="text-[#8A8178] text-xs font-mono">Generating render...</div>
                )}

                <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md text-[#D6B46A] text-[9px] font-mono uppercase font-bold rounded-lg border border-[#D6B46A]/30">
                  {targetWidth} × {targetHeight} PX · {fitMode.toUpperCase()}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDownload}
                disabled={!previewBlob || isProcessing}
                className="w-full py-4 bg-[#111111] text-[#D6B46A] hover:bg-black hover:text-white font-bold uppercase tracking-widest text-xs rounded-2xl border border-[#D6B46A]/40 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-display disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download Resized Image ({targetWidth} × {targetHeight})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Highlights Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#D6B46A]/15 text-left">
        <div className="p-4 bg-white/60 border border-[#D6B46A]/15 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-[#111111] font-display font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#BFA15A]" />
            Passport & Visa Spec Accurate
          </div>
          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            One-click presets for Indian 3.5×4.5cm photos, US 2×2 inch Visas, and exam portal signatures.
          </p>
        </div>

        <div className="p-4 bg-white/60 border border-[#D6B46A]/15 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-[#111111] font-display font-bold text-xs">
            <Zap className="w-4 h-4 text-[#BFA15A]" />
            High-Fidelity Resampling
          </div>
          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            Smooth bicubic canvas filtering preserves crisp edges, text legibility, and skin tone fidelity.
          </p>
        </div>

        <div className="p-4 bg-white/60 border border-[#D6B46A]/15 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-[#111111] font-display font-bold text-xs">
            <Maximize2 className="w-4 h-4 text-[#BFA15A]" />
            Aspect Ratio Safety
          </div>
          <p className="text-[11px] text-[#8A8178] leading-relaxed">
            Lock aspect ratio to prevent squashing or stretching, or use smart Cover Crop to fill target dimensions.
          </p>
        </div>
      </div>
    </div>
  );
}
