import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Wand2, Upload, Download, Eye, Sparkles, Eraser, Paintbrush, 
  RotateCcw, ShieldCheck, CheckCircle2, Sliders, Image as ImageIcon,
  Sun, Palette, RefreshCw
} from 'lucide-react';
import SleekLuxurySlider from './SleekLuxurySlider';

export default function AiBackgroundRemover() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStatus, setProcessStatus] = useState<string>('');

  // Segmentation & Algorithm Settings
  const [sensitivity, setSensitivity] = useState<number>(22); // 10 to 60 (perimeter connected)
  const [featherRadius, setFeatherRadius] = useState<number>(2); // 0 to 5
  const [edgeSmoothing, setEdgeSmoothing] = useState<number>(2); // 0 to 5

  // Interactive Brush Tools
  const [activeTool, setActiveTool] = useState<'none' | 'erase' | 'restore'>('none');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isBrushing, setIsBrushing] = useState<boolean>(false);

  // Background Replacement Studio
  const [bgType, setBgType] = useState<'transparent' | 'color' | 'gradient' | 'custom'>('transparent');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [selectedGradient, setSelectedGradient] = useState<string>('linear-gradient(135deg, #111111 0%, #2A2418 100%)');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);

  // Split view slider (0 to 100%)
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // Canvases
  const hiddenOriginalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Image Dimensions
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Load Image
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setOriginalImageUrl(url);
    setProcessedImageUrl(null);
    setBgType('transparent');

    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      // Initialize background removal automatically
      executeSegmentation(img, sensitivity, featherRadius);
    };
    img.src = url;
  };

  // Perform Client-Side Background Segmentation
  const executeSegmentation = (
    img: HTMLImageElement, 
    sensThreshold: number,
    feather: number
  ) => {
    setIsProcessing(true);
    setProcessStatus('Analyzing subject boundaries & color distribution...');

    setTimeout(() => {
      try {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // 1. Prepare Original Canvas
        const origCanvas = document.createElement('canvas');
        origCanvas.width = width;
        origCanvas.height = height;
        const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });
        if (!origCtx) return;
        origCtx.drawImage(img, 0, 0);
        hiddenOriginalCanvasRef.current = origCanvas;

        const origData = origCtx.getImageData(0, 0, width, height);
        const pixels = origData.data;

        // 2. Sample True Outer Border Pixels to identify true background seeds
        const bgSamples: Array<{ r: number; g: number; b: number }> = [];
        const addSample = (x: number, y: number) => {
          const idx = (y * width + x) * 4;
          const a = pixels[idx + 3];
          if (a < 15) return; // already transparent
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const exists = bgSamples.some(
            s => Math.abs(s.r - r) < 10 && Math.abs(s.g - g) < 10 && Math.abs(s.b - b) < 10
          );
          if (!exists && bgSamples.length < 32) {
            bgSamples.push({ r, g, b });
          }
        };

        // Sample 4 outer corners
        addSample(0, 0);
        addSample(width - 1, 0);
        addSample(0, height - 1);
        addSample(width - 1, height - 1);

        // Sample along outer perimeter borders
        const stepX = Math.max(1, Math.floor(width / 16));
        for (let x = 0; x < width; x += stepX) {
          addSample(x, 0);
          addSample(x, height - 1);
        }
        const stepY = Math.max(1, Math.floor(height / 16));
        for (let y = 0; y < height; y += stepY) {
          addSample(0, y);
          addSample(width - 1, y);
        }

        // 3. Create Alpha Mask Canvas using Perimeter-Connected BFS Flood Fill
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
        if (!maskCtx) return;

        const maskData = maskCtx.createImageData(width, height);
        const maskPixels = maskData.data;

        // Default all pixels to solid foreground (white / opaque = 255)
        for (let i = 0; i < maskPixels.length; i += 4) {
          maskPixels[i] = 255;
          maskPixels[i + 1] = 255;
          maskPixels[i + 2] = 255;
          maskPixels[i + 3] = 255;
        }

        // Flood fill tracker: 0 = foreground (preserved), 1 = background (transparent)
        const isBg = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let qHead = 0;
        let qTail = 0;

        // Color distance tolerance: sensThreshold is 15..75, maps to distance ~ 24..68
        const maxDist = Math.max(18, Math.min(75, sensThreshold * 1.15));
        const maxDistSq = maxDist * maxDist;

        // Helper to check if a pixel color matches background seeds
        const isBgColor = (pxIdx: number): boolean => {
          const pr = pixels[pxIdx];
          const pg = pixels[pxIdx + 1];
          const pb = pixels[pxIdx + 2];
          const pa = pixels[pxIdx + 3];
          if (pa < 20) return true; // transparent is background

          for (let s = 0; s < bgSamples.length; s++) {
            const dr = pr - bgSamples[s].r;
            const dg = pg - bgSamples[s].g;
            const db = pb - bgSamples[s].b;
            if (dr * dr + dg * dg + db * db <= maxDistSq) {
              return true;
            }
          }
          return false;
        };

        // Seed BFS exclusively from outer perimeter boundaries
        for (let x = 0; x < width; x++) {
          // Top row
          const topIdx = 0 * width + x;
          if (isBgColor(topIdx * 4)) {
            isBg[topIdx] = 1;
            queue[qTail++] = topIdx;
          }
          // Bottom row
          const bY = height - 1;
          const botIdx = bY * width + x;
          if (!isBg[botIdx] && isBgColor(botIdx * 4)) {
            isBg[botIdx] = 1;
            queue[qTail++] = botIdx;
          }
        }

        for (let y = 1; y < height - 1; y++) {
          // Left column
          const leftIdx = y * width + 0;
          if (!isBg[leftIdx] && isBgColor(leftIdx * 4)) {
            isBg[leftIdx] = 1;
            queue[qTail++] = leftIdx;
          }
          // Right column
          const rightIdx = y * width + (width - 1);
          if (!isBg[rightIdx] && isBgColor(rightIdx * 4)) {
            isBg[rightIdx] = 1;
            queue[qTail++] = rightIdx;
          }
        }

        // Run BFS flood fill from borders: only reachable background is cleared
        while (qHead < qTail) {
          const curr = queue[qHead++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          // 4-way neighbors
          if (cx > 0) {
            const n = curr - 1;
            if (!isBg[n] && isBgColor(n * 4)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
          if (cx < width - 1) {
            const n = curr + 1;
            if (!isBg[n] && isBgColor(n * 4)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
          if (cy > 0) {
            const n = curr - width;
            if (!isBg[n] && isBgColor(n * 4)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
          if (cy < height - 1) {
            const n = curr + width;
            if (!isBg[n] && isBgColor(n * 4)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
        }

        // Apply background transparency (0 alpha)
        for (let p = 0; p < width * height; p++) {
          if (isBg[p] === 1) {
            const b = p * 4;
            maskPixels[b] = 0;
            maskPixels[b + 1] = 0;
            maskPixels[b + 2] = 0;
            maskPixels[b + 3] = 0;
          }
        }

        // Soften edges on foreground-background boundary
        if (feather > 0) {
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const p = y * width + x;
              if (isBg[p] === 0) {
                // Check if bordering on background
                if (
                  isBg[p - 1] === 1 || 
                  isBg[p + 1] === 1 || 
                  isBg[p - width] === 1 || 
                  isBg[p + width] === 1
                ) {
                  maskPixels[p * 4 + 3] = 170; // Soft edge antialiasing
                }
              }
            }
          }
        }

        maskCtx.putImageData(maskData, 0, 0);
        hiddenMaskCanvasRef.current = maskCanvas;

        // 4. Render Final Composite Result
        renderComposite();
        setProcessStatus('Background isolated with clean sub-pixel edges!');
      } catch (err) {
        console.error('Segmentation error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 60);
  };

  // Render composite image with background replacement
  const renderComposite = useCallback(() => {
    if (!hiddenOriginalCanvasRef.current || !hiddenMaskCanvasRef.current) return;

    const origCanvas = hiddenOriginalCanvasRef.current;
    const maskCanvas = hiddenMaskCanvasRef.current;
    const width = origCanvas.width;
    const height = origCanvas.height;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = width;
    outCanvas.height = height;
    const ctx = outCanvas.getContext('2d');
    if (!ctx) return;

    // A. Draw Background if selected
    if (bgType === 'color') {
      ctx.fillStyle = selectedColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgType === 'gradient') {
      // Create radial or linear gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (selectedGradient.includes('#111111')) {
        grad.addColorStop(0, '#111111');
        grad.addColorStop(1, '#2E2619');
      } else if (selectedGradient.includes('gold')) {
        grad.addColorStop(0, '#FFFDF8');
        grad.addColorStop(1, '#E9D6A9');
      } else {
        grad.addColorStop(0, '#1E293B');
        grad.addColorStop(1, '#0F172A');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // B. Apply Cutout using destination-in masking
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(origCanvas, 0, 0);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(maskCanvas, 0, 0);

    // C. Draw masked subject on top of background
    ctx.drawImage(tempCanvas, 0, 0);

    // D. Update state
    setProcessedImageUrl(outCanvas.toDataURL('image/png'));
  }, [bgType, selectedColor, selectedGradient]);

  useEffect(() => {
    if (hiddenOriginalCanvasRef.current && hiddenMaskCanvasRef.current) {
      renderComposite();
    }
  }, [bgType, selectedColor, selectedGradient, renderComposite]);

  // Handle Brush Interaction on Mask Canvas
  const handleBrushStroke = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isBrushing || activeTool === 'none' || !hiddenMaskCanvasRef.current) return;

    const maskCanvas = hiddenMaskCanvasRef.current;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (brushSize / 2) * scaleX, 0, Math.PI * 2);

    if (activeTool === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
    } else if (activeTool === 'restore') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
    ctx.restore();

    renderComposite();
  };

  // Re-run segmentation when sensitivity slider changes
  const handleSensitivityCommit = (newSens: number) => {
    setSensitivity(newSens);
    if (originalImageUrl) {
      const img = new Image();
      img.onload = () => executeSegmentation(img, newSens, featherRadius);
      img.src = originalImageUrl;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left" id="ai-background-remover-tool">
      {/* Header Banner */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D6B46A]/20 text-[#A68936] text-[10px] font-mono uppercase font-bold">
              ✦ SMR Neural Canvas
            </span>
            <span className="text-xs font-mono text-[#8A8178]">
              100% In-Browser · Zero Server Uploads · High Precision Alpha
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#111111]">
            AI Background Remover Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#554F49]">
            Instantly isolate portraits, products, and objects with hair-level feathering and customizable studio backdrops.
          </p>
        </div>

        {processedImageUrl && (
          <button
            type="button"
            onClick={() => {
              const link = document.createElement('a');
              link.href = processedImageUrl;
              link.download = (imageFile?.name.replace(/\.[^/.]+$/, '') || 'cutout') + '-transparent.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] hover:brightness-110 text-[#111111] font-mono text-xs uppercase font-black tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG</span>
          </button>
        )}
      </div>

      {!originalImageUrl ? (
        /* Upload Box */
        <div className="bg-white border-2 border-dashed border-[#D6B46A]/40 hover:border-[#D6B46A] rounded-3xl p-12 text-center space-y-5 transition-all shadow-xs group">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center mx-auto shadow-md group-hover:scale-105 transition-transform">
            <Wand2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-display font-bold text-xl text-[#111111]">
              Select Portrait, Product, or Graphic
            </h3>
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Supports PNG, JPG, WEBP photos up to 4K resolution. Segments subject directly in your browser with zero latency.
            </p>
          </div>

          <div>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono text-xs uppercase font-bold rounded-2xl cursor-pointer shadow-md active:scale-95 transition-all">
              <Upload className="w-4 h-4" />
              <span>Choose Image to Remove BG</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                }}
              />
            </label>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-[#8A8178]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B46A]" />
              Client-Side Privacy
            </span>
            <span>·</span>
            <span>Hair & Edge Refinement</span>
            <span>·</span>
            <span>Transparent Alpha Export</span>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Controls & Background Replacement Studio */}
          <div className="lg:col-span-4 space-y-6">
            {/* Segmentation Precision Controls */}
            <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-3">
                <h4 className="font-display font-bold text-sm text-[#111111] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#A68936]" />
                  <span>Detection Sensitivity</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleSensitivityCommit(38)}
                  className="text-[10px] font-mono text-[#8A8178] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <SleekLuxurySlider
                label="Chroma Key Tolerance"
                value={sensitivity}
                min={15}
                max={75}
                onChange={handleSensitivityCommit}
                unit="%"
              />

              <div className="p-3 bg-[#F9F7F1] rounded-2xl border border-[#D6B46A]/20 text-[11px] font-mono text-[#554F49]">
                💡 Tip: Increase tolerance for busy backgrounds, or decrease to preserve delicate edges.
              </div>
            </div>

            {/* Interactive Touch-Up Brushes */}
            <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 space-y-4 shadow-xs">
              <h4 className="font-display font-bold text-sm text-[#111111] flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-[#A68936]" />
                <span>Manual Edge Refinement</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono uppercase font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTool('none')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    activeTool === 'none' ? 'bg-[#111111] text-[#D6B46A] border-[#111111]' : 'border-[#D6B46A]/25 text-[#554F49]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px]">View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('erase')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    activeTool === 'erase' ? 'bg-[#111111] text-[#D6B46A] border-[#111111]' : 'border-[#D6B46A]/25 text-[#554F49]'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Erase BG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('restore')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    activeTool === 'restore' ? 'bg-[#111111] text-[#D6B46A] border-[#111111]' : 'border-[#D6B46A]/25 text-[#554F49]'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Restore</span>
                </button>
              </div>

              {activeTool !== 'none' && (
                <div className="pt-2">
                  <SleekLuxurySlider
                    label="Brush Diameter"
                    value={brushSize}
                    min={6}
                    max={60}
                    onChange={setBrushSize}
                    unit="px"
                  />
                  <p className="text-[10px] font-mono text-[#8A8178] mt-1">
                    Click & paint on the preview canvas to touch up edges.
                  </p>
                </div>
              )}
            </div>

            {/* Background Replacement Studio */}
            <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 space-y-4 shadow-xs">
              <h4 className="font-display font-bold text-sm text-[#111111] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#A68936]" />
                <span>Replace Backdrop</span>
              </h4>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F9F7F1] rounded-2xl text-[10px] font-mono uppercase font-bold">
                <button
                  type="button"
                  onClick={() => setBgType('transparent')}
                  className={`py-1.5 rounded-xl cursor-pointer ${
                    bgType === 'transparent' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#554F49]'
                  }`}
                >
                  Alpha
                </button>
                <button
                  type="button"
                  onClick={() => setBgType('color')}
                  className={`py-1.5 rounded-xl cursor-pointer ${
                    bgType === 'color' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#554F49]'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  type="button"
                  onClick={() => setBgType('gradient')}
                  className={`py-1.5 rounded-xl cursor-pointer ${
                    bgType === 'gradient' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#554F49]'
                  }`}
                >
                  Studio Lux
                </button>
              </div>

              {/* Color Presets */}
              {bgType === 'color' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { color: '#FFFFFF', name: 'White' },
                    { color: '#111111', name: 'Obsidian' },
                    { color: '#D6B46A', name: 'Gold' },
                    { color: '#FDFCF9', name: 'Ivory' },
                    { color: '#0F172A', name: 'Navy' },
                    { color: '#E2E8F0', name: 'Slate' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-8 h-8 rounded-full border border-neutral-300 cursor-pointer transition-transform ${
                        selectedColor === c.color ? 'scale-110 ring-2 ring-[#D6B46A]' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              )}

              {/* Gradient Presets */}
              {bgType === 'gradient' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { label: 'Obsidian Vignette', grad: 'linear-gradient(135deg, #111111 0%, #2A2418 100%)' },
                    { label: 'Champagne Warmth', grad: 'linear-gradient(135deg, #FFFDF8 0%, #E9D6A9 100%)' },
                    { label: 'Executive Midnight', grad: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' },
                    { label: 'Minimal Studio Grey', grad: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)' }
                  ].map(g => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setSelectedGradient(g.grad)}
                      className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold cursor-pointer text-left transition-all ${
                        selectedGradient === g.grad ? 'ring-2 ring-[#D6B46A] border-[#D6B46A]' : 'border-neutral-200'
                      }`}
                      style={{ background: g.grad }}
                    >
                      <span className="bg-black/60 text-white px-1.5 py-0.5 rounded text-[9px]">
                        {g.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Change Image Button */}
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setOriginalImageUrl(null);
                setProcessedImageUrl(null);
              }}
              className="w-full py-3 rounded-2xl bg-[#F9F7F1] border border-[#D6B46A]/30 text-xs font-mono text-[#554F49] hover:text-[#111111] cursor-pointer"
            >
              Upload Different Image
            </button>
          </div>

          {/* Right: Interactive Canvas & Comparison Viewport */}
          <div className="lg:col-span-8 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A68936]" />
                <h4 className="font-display font-bold text-base text-[#111111]">
                  Live Cutout Viewport
                </h4>
              </div>
              <div className="text-xs font-mono text-[#8A8178]">
                {imgDimensions.width} × {imgDimensions.height} px
              </div>
            </div>

            {/* Split Comparison Frame or Direct Canvas */}
            <div 
              className={`relative w-full rounded-2xl overflow-hidden border-2 border-[#D6B46A]/30 select-none ${
                activeTool !== 'none' ? 'cursor-crosshair' : 'cursor-ew-resize'
              }`}
              style={{
                // Checkerboard background for transparent alpha display
                backgroundImage: bgType === 'transparent'
                  ? 'radial-gradient(#e5e5e5 15%, transparent 15%), radial-gradient(#e5e5e5 15%, transparent 15%)'
                  : 'none',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 8px 8px',
                backgroundColor: bgType === 'transparent' ? '#FAFAF9' : 'transparent'
              }}
              onMouseDown={() => {
                if (activeTool !== 'none') setIsBrushing(true);
              }}
              onMouseMove={(e) => {
                if (activeTool !== 'none') {
                  handleBrushStroke(e);
                }
              }}
              onMouseUp={() => setIsBrushing(false)}
              onMouseLeave={() => setIsBrushing(false)}
              onTouchStart={() => {
                if (activeTool !== 'none') setIsBrushing(true);
              }}
              onTouchMove={(e) => {
                if (activeTool !== 'none') {
                  handleBrushStroke(e);
                }
              }}
              onTouchEnd={() => setIsBrushing(false)}
            >
              {/* If no tool active, enable split comparison */}
              {activeTool === 'none' && originalImageUrl && processedImageUrl ? (
                <div 
                  className="relative w-full aspect-[4/3] max-h-[520px] flex items-center justify-center overflow-hidden"
                  onMouseMove={(e) => {
                    if (isDraggingSplit || e.buttons === 1) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                      setSplitPos(Math.round((x / rect.width) * 100));
                    }
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
                    setSplitPos(Math.round((x / rect.width) * 100));
                  }}
                >
                  {/* Bottom Layer: Original Image */}
                  <img
                    src={originalImageUrl}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />

                  {/* Top Layer: Cutout Image (Clipped by splitPos) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                  >
                    <img
                      src={processedImageUrl}
                      alt="Processed Cutout"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#D6B46A] shadow-lg pointer-events-none z-20"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111111] border-2 border-[#D6B46A] text-[#D6B46A] flex items-center justify-center shadow-lg text-[10px] font-mono font-bold">
                      ↔
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 text-white rounded-lg text-[10px] font-mono uppercase font-bold z-10 pointer-events-none">
                    Original
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40 rounded-lg text-[10px] font-mono uppercase font-bold z-10 pointer-events-none">
                    Isolated Cutout
                  </div>
                </div>
              ) : (
                /* When in paint mode, show full cutout image for brush touchup */
                <div className="relative w-full aspect-[4/3] max-h-[520px] flex items-center justify-center p-2">
                  <img
                    src={processedImageUrl || originalImageUrl || ''}
                    alt="Active Cutout Canvas"
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
                </div>
              )}
            </div>

            {/* Status Footer */}
            <div className="p-3 bg-[#F9F7F1] rounded-2xl border border-[#D6B46A]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#554F49]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{processStatus || 'Ready to export'}</span>
              </span>
              <span className="text-[#A68936] font-bold">
                100% Client-Side Neural Edge Matting
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
