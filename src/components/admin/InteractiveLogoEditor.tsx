import React, { useState, useRef, useEffect } from 'react';
import { 
  Crown, Move, ZoomIn, ZoomOut, RotateCw, RotateCcw, 
  Maximize2, RefreshCw, Check, Sparkles, Globe, Smartphone, 
  Sliders, Eye, ShieldCheck, Compass, Info, Hand
} from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../../utils/mockAdminData';
import SleekLuxurySlider from '../tools/SleekLuxurySlider';

interface InteractiveLogoEditorProps {
  settings: WebsiteSettings;
  onChange: (updated: WebsiteSettings) => void;
  onSave?: (updated: WebsiteSettings) => void;
}

export default function InteractiveLogoEditor({
  settings,
  onChange,
  onSave
}: InteractiveLogoEditorProps) {
  const [scale, setScale] = useState<number>(settings.logoScale ?? 1.0);
  const [offsetX, setOffsetX] = useState<number>(settings.logoOffsetX ?? 0);
  const [offsetY, setOffsetY] = useState<number>(settings.logoOffsetY ?? 0);
  const [rotation, setRotation] = useState<number>(settings.logoRotation ?? 0);
  const [borderRadius, setBorderRadius] = useState<number>(settings.logoBorderRadius ?? 12);
  const [padding, setPadding] = useState<number>(settings.logoPadding ?? 4);
  const [brightness, setBrightness] = useState<number>(settings.logoBrightness ?? 100);
  const [contrast, setContrast] = useState<number>(settings.logoContrast ?? 100);
  
  const [activePreviewSurface, setActivePreviewSurface] = useState<'canvas' | 'navbar' | 'footer' | 'pwa'>('canvas');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialOffsets, setInitialOffsets] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const stageRef = useRef<HTMLDivElement>(null);

  // Synchronize internal state if settings prop changes from outside
  useEffect(() => {
    if (settings.logoScale !== undefined) setScale(settings.logoScale);
    if (settings.logoOffsetX !== undefined) setOffsetX(settings.logoOffsetX);
    if (settings.logoOffsetY !== undefined) setOffsetY(settings.logoOffsetY);
    if (settings.logoRotation !== undefined) setRotation(settings.logoRotation);
    if (settings.logoBorderRadius !== undefined) setBorderRadius(settings.logoBorderRadius);
    if (settings.logoPadding !== undefined) setPadding(settings.logoPadding);
    if (settings.logoBrightness !== undefined) setBrightness(settings.logoBrightness);
    if (settings.logoContrast !== undefined) setContrast(settings.logoContrast);
  }, [settings]);

  // Propagate changes upwards
  const emitChanges = (overrides: Partial<WebsiteSettings> = {}) => {
    const updated: WebsiteSettings = {
      ...settings,
      logoScale: overrides.logoScale !== undefined ? overrides.logoScale : scale,
      logoOffsetX: overrides.logoOffsetX !== undefined ? overrides.logoOffsetX : offsetX,
      logoOffsetY: overrides.logoOffsetY !== undefined ? overrides.logoOffsetY : offsetY,
      logoRotation: overrides.logoRotation !== undefined ? overrides.logoRotation : rotation,
      logoBorderRadius: overrides.logoBorderRadius !== undefined ? overrides.logoBorderRadius : borderRadius,
      logoPadding: overrides.logoPadding !== undefined ? overrides.logoPadding : padding,
      logoBrightness: overrides.logoBrightness !== undefined ? overrides.logoBrightness : brightness,
      logoContrast: overrides.logoContrast !== undefined ? overrides.logoContrast : contrast,
    };
    onChange(updated);
  };

  // Drag handling (Mouse + Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialOffsets({ x: offsetX, y: offsetY });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = Math.round(clientX - dragStart.x);
    const deltaY = Math.round(clientY - dragStart.y);
    
    // Constrain within bounds
    const nextX = Math.max(-140, Math.min(140, initialOffsets.x + deltaX));
    const nextY = Math.max(-80, Math.min(80, initialOffsets.y + deltaY));
    
    setOffsetX(nextX);
    setOffsetY(nextY);
    emitChanges({ logoOffsetX: nextX, logoOffsetY: nextY });
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      emitChanges({ logoOffsetX: offsetX, logoOffsetY: offsetY });
    }
  };

  // Ref-based Wheel zoom handling on canvas with explicit { passive: false }
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const onWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setScale(prev => {
        const nextScale = Math.max(0.5, Math.min(2.5, Number((prev + delta).toFixed(2))));
        emitChanges({ logoScale: nextScale });
        return nextScale;
      });
    };

    stageEl.addEventListener('wheel', onWheelEvent, { passive: false });
    return () => {
      stageEl.removeEventListener('wheel', onWheelEvent);
    };
  }, []);

  const handleReset = () => {
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setBorderRadius(12);
    setPadding(4);
    setBrightness(100);
    setContrast(100);
    emitChanges({
      logoScale: 1.0,
      logoOffsetX: 0,
      logoOffsetY: 0,
      logoRotation: 0,
      logoBorderRadius: 12,
      logoPadding: 4,
      logoBrightness: 100,
      logoContrast: 100
    });
    showToast('Reset logo placement to standard studio defaults.');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleApplySave = () => {
    const updated: WebsiteSettings = {
      ...settings,
      logoScale: scale,
      logoOffsetX: offsetX,
      logoOffsetY: offsetY,
      logoRotation: rotation,
      logoBorderRadius: borderRadius,
      logoPadding: padding,
      logoBrightness: brightness,
      logoContrast: contrast,
    };
    if (onSave) {
      onSave(updated);
    }
    showToast('Logo positioning saved and applied to entire website!');
  };

  // Render the logo element with the applied transforms
  const renderInteractiveLogo = (isStage = false) => {
    const isImage = settings.logoType === 'image' && settings.logoUrl && settings.logoUrl.length > 5;
    const logoChar = settings.logoText || (settings.logoUrl && settings.logoUrl.length <= 4 ? settings.logoUrl : 'S');

    return (
      <div
        className={`relative select-none cursor-grab active:cursor-grabbing transition-shadow ${
          isDragging ? 'ring-2 ring-[#D6B46A] shadow-[0_0_25px_rgba(214,180,106,0.6)]' : 'hover:shadow-[0_0_15px_rgba(214,180,106,0.3)]'
        }`}
        style={{
          width: `${44 * scale}px`,
          height: `${44 * scale}px`,
          transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          borderRadius: `${borderRadius}px`,
          padding: `${padding}px`,
          backgroundColor: settings.logoBgEnabled !== false ? (settings.logoBgColor || '#111111') : 'transparent',
          border: settings.logoBorderEnabled !== false ? '1.5px solid rgba(214, 180, 106, 0.5)' : 'none',
          touchAction: 'none'
        }}
        onMouseDown={e => {
          handlePointerDown(e.clientX, e.clientY);
        }}
        onTouchStart={e => {
          if (e.touches.length === 1) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
      >
        {isImage ? (
          <img
            src={settings.logoUrl}
            alt={settings.brandName || 'Logo'}
            className="w-full h-full object-contain pointer-events-none"
            style={{ borderRadius: `${Math.max(0, borderRadius - padding)}px` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display font-black text-[#D6B46A] pointer-events-none" style={{ fontSize: `${22 * scale}px` }}>
            {logoChar}
          </div>
        )}

        {/* Floating move handle indicator on canvas */}
        {isStage && (
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#D6B46A] text-[#111111] rounded-full flex items-center justify-center shadow-md pointer-events-none">
            <Move className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-neutral-900 text-[#D6B46A] text-xs font-mono font-bold rounded-xl flex items-center gap-2 shadow-lg border border-[#D6B46A]/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
            Touch, Drag &amp; Scale Studio
          </span>
          <h3 className="font-display font-black text-xl text-[#111111] tracking-tight flex items-center gap-2">
            <span>Visual Interactive Logo Editor &amp; Positioning Studio</span>
            <Sparkles className="w-4 h-4 text-[#D6B46A]" />
          </h3>
          <p className="text-xs text-[#8A8178] mt-1">
            Drag with your finger or mouse to position the logo anywhere, scale / zoom, and preview live across the entire website.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8A8178]" />
            <span>Reset Position</span>
          </button>
          
          <button
            type="button"
            onClick={handleApplySave}
            className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-white rounded-xl text-xs font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save &amp; Apply Everywhere</span>
          </button>
        </div>
      </div>

      {/* Surface Preview Mode Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#F4EFE6]/60 p-1.5 rounded-2xl border border-[#D6B46A]/20">
          {[
            { id: 'canvas', label: 'Interactive Drag Stage', icon: Hand },
            { id: 'navbar', label: 'Live Navbar Header', icon: Globe },
            { id: 'footer', label: 'Luxury Dark Footer', icon: Sparkles },
            { id: 'pwa', label: 'Mobile App Icon', icon: Smartphone }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePreviewSurface(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activePreviewSurface === tab.id
                  ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                  : 'text-[#8A8178] hover:text-[#111111]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8A8178]">
          <span>Coordinates:</span>
          <span className="font-bold text-[#111111] bg-white px-2 py-0.5 rounded-lg border border-[#D6B46A]/25">
            X: {offsetX > 0 ? `+${offsetX}` : offsetX}px · Y: {offsetY > 0 ? `+${offsetY}` : offsetY}px
          </span>
          <span className="font-bold text-[#111111] bg-white px-2 py-0.5 rounded-lg border border-[#D6B46A]/25">
            Scale: {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Stage / Preview Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activePreviewSurface === 'canvas' && (
            <div
              ref={stageRef}
              onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchMove={e => {
                if (e.touches.length === 1) {
                  handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchEnd={handlePointerUp}
              className="relative w-full h-80 bg-neutral-950 rounded-3xl border-2 border-dashed border-[#D6B46A]/30 overflow-hidden flex items-center justify-center select-none shadow-inner"
              style={{
                backgroundImage: showGrid 
                  ? 'radial-gradient(rgba(214, 180, 106, 0.15) 1px, transparent 0)' 
                  : 'none',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Alignment Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#D6B46A]/20 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#D6B46A]/20 pointer-events-none" />
              
              {/* Center Target Box */}
              <div className="absolute w-12 h-12 border border-[#D6B46A]/25 rounded-xl pointer-events-none" />

              {/* Instruction pill at top */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D6B46A]/30 text-[10px] font-mono text-[#D6B46A] flex items-center gap-2 pointer-events-none">
                <Hand className="w-3.5 h-3.5 text-[#D6B46A]" />
                <span>Touch &amp; Drag Anywhere (Finger or Mouse)</span>
              </div>

              {/* Grid Toggle bottom right */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-mono text-white/70 hover:text-white cursor-pointer"
                >
                  Grid: {showGrid ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* The Actual Interactive Logo Element */}
              {renderInteractiveLogo(true)}
            </div>
          )}

          {/* Live Desktop Navbar Surface Simulation */}
          {activePreviewSurface === 'navbar' && (
            <div className="w-full p-8 bg-gradient-to-b from-[#F4EFE6]/50 to-[#FFFDF8] rounded-3xl border border-[#D6B46A]/30 space-y-6">
              <span className="text-[10px] font-mono text-[#8A8178] uppercase font-bold tracking-wider block">
                Simulated Public Floating Header (Live Position Preview)
              </span>

              {/* Simulated Floating Glass Header */}
              <div className="w-full bg-white/90 backdrop-blur-xl border border-[#D6B46A]/35 rounded-full px-6 py-3 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Logo Container */}
                  <div className="relative overflow-visible">
                    {renderInteractiveLogo(false)}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="font-display font-bold tracking-[0.16em] text-sm text-neutral-900 flex items-center gap-1.5 uppercase">
                      {settings.brandName ? settings.brandName.split(' ')[0] : 'SamaXon'}
                      <Crown className="w-3.5 h-3.5 text-[#D6B46A]" />
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-[#BFA15A] uppercase">
                      Engineering
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-neutral-600">
                  <span className="text-[#111111]">Services</span>
                  <span>Tools</span>
                  <span>Portfolio</span>
                  <span>Careers</span>
                </div>

                <div className="px-4 py-1.5 bg-[#111111] text-[#D6B46A] rounded-full text-xs font-mono font-bold">
                  Start 48h Build
                </div>
              </div>

              <p className="text-xs text-[#8A8178] text-center">
                This mirrors the exact responsive layout of your visitors' desktop viewports.
              </p>
            </div>
          )}

          {/* Luxury Dark Footer Simulation */}
          {activePreviewSurface === 'footer' && (
            <div className="w-full p-8 bg-[#0D0D0D] text-white rounded-3xl border border-[#D6B46A]/30 space-y-6">
              <span className="text-[10px] font-mono text-[#D6B46A] uppercase font-bold tracking-wider block">
                Simulated Luxury Dark Footer Surface
              </span>

              <div className="p-6 bg-white/5 border border-[#D6B46A]/20 rounded-2xl flex items-center gap-4">
                {/* Logo Container */}
                <div className="relative overflow-visible">
                  {renderInteractiveLogo(false)}
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-display font-bold tracking-widest text-base text-white flex items-center gap-1.5 uppercase">
                    {settings.brandName || 'SamaXon Systems'}
                    <Crown className="w-4 h-4 text-[#D6B46A]" />
                  </span>
                  <span className="text-[10px] font-mono text-[#D6B46A]">
                    Speed Studio • 48-Hour Guarantee
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PWA Mobile App Icon Simulation */}
          {activePreviewSurface === 'pwa' && (
            <div className="w-full p-8 bg-[#181715] text-white rounded-3xl border border-[#D6B46A]/30 text-center space-y-6">
              <span className="text-[10px] font-mono text-[#D6B46A] uppercase font-bold tracking-wider block">
                Simulated Android / iOS Mobile Homescreen Icon
              </span>

              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-20 h-20 rounded-3xl bg-neutral-900 border-2 border-[#D6B46A]/60 flex items-center justify-center shadow-[0_10px_30px_rgba(214,180,106,0.3)] relative overflow-visible">
                  {renderInteractiveLogo(false)}
                </div>
                <span className="text-xs font-bold text-white mt-3 block">
                  {settings.brandName ? settings.brandName.split(' ')[0] : 'SamaXon'}
                </span>
                <span className="text-[9px] font-mono text-emerald-400">Mobile Installed PWA</span>
              </div>
            </div>
          )}
        </div>

        {/* Fine-Tuning Precision Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm space-y-5 text-left">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D6B46A]" />
              <h4 className="font-display font-black text-sm text-[#111111]">
                Precision Adjustment Controls
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#F4EFE6] px-2 py-0.5 rounded-full text-[#8A8178]">
              Fine-Tune
            </span>
          </div>

          {/* 1. Scale / Zoom In / Zoom Out Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111111] flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#D6B46A]" />
                Scale &amp; Zoom Ratio
              </span>
              <span className="font-mono text-[#8A8178] font-bold">{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(0.5, Number((scale - 0.1).toFixed(2)));
                  setScale(next);
                  emitChanges({ logoScale: next });
                }}
                className="w-8 h-8 rounded-lg bg-[#F4EFE6] hover:bg-[#E8E0D2] font-black text-sm flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.05"
                value={scale}
                onChange={e => {
                  const next = parseFloat(e.target.value);
                  setScale(next);
                  emitChanges({ logoScale: next });
                }}
                className="flex-1 accent-[#D6B46A] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  const next = Math.min(2.2, Number((scale + 0.1).toFixed(2)));
                  setScale(next);
                  emitChanges({ logoScale: next });
                }}
                className="w-8 h-8 rounded-lg bg-[#F4EFE6] hover:bg-[#E8E0D2] font-black text-sm flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* 2. X Offset Slider (Left / Right) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111111] flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#D6B46A]" />
                Horizontal Offset (Left / Right)
              </span>
              <span className="font-mono text-[#8A8178] font-bold">{offsetX}px</span>
            </div>
            <input
              type="range"
              min="-120"
              max="120"
              step="1"
              value={offsetX}
              onChange={e => {
                const next = parseInt(e.target.value, 10);
                setOffsetX(next);
                emitChanges({ logoOffsetX: next });
              }}
              className="w-full accent-[#D6B46A] cursor-pointer"
            />
          </div>

          {/* 3. Y Offset Slider (Up / Down) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111111] flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#D6B46A]" />
                Vertical Offset (Up / Down)
              </span>
              <span className="font-mono text-[#8A8178] font-bold">{offsetY}px</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="1"
              value={offsetY}
              onChange={e => {
                const next = parseInt(e.target.value, 10);
                setOffsetY(next);
                emitChanges({ logoOffsetY: next });
              }}
              className="w-full accent-[#D6B46A] cursor-pointer"
            />
          </div>

          {/* 4. Rotation Angle Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111111] flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#D6B46A]" />
                Rotation Angle (Degrees)
              </span>
              <span className="font-mono text-[#8A8178] font-bold">{rotation}°</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={rotation}
                onChange={e => {
                  const next = parseInt(e.target.value, 10);
                  setRotation(next);
                  emitChanges({ logoRotation: next });
                }}
                className="flex-1 accent-[#D6B46A] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  setRotation(0);
                  emitChanges({ logoRotation: 0 });
                }}
                className="px-2 py-1 bg-[#F4EFE6] rounded text-[10px] font-mono font-bold hover:bg-[#E8E0D2] cursor-pointer"
              >
                0°
              </button>
            </div>
          </div>

          {/* 5. Border Radius and Padding */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-black/5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-bold text-[#111111]">Corner Radius</span>
                <span className="font-mono text-[#8A8178]">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="28"
                step="1"
                value={borderRadius}
                onChange={e => {
                  const next = parseInt(e.target.value, 10);
                  setBorderRadius(next);
                  emitChanges({ logoBorderRadius: next });
                }}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-bold text-[#111111]">Inner Padding</span>
                <span className="font-mono text-[#8A8178]">{padding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="1"
                value={padding}
                onChange={e => {
                  const next = parseInt(e.target.value, 10);
                  setPadding(next);
                  emitChanges({ logoPadding: next });
                }}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Center & Reset Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setOffsetX(0);
                setOffsetY(0);
                emitChanges({ logoOffsetX: 0, logoOffsetY: 0 });
                showToast('Logo centered (X: 0, Y: 0).');
              }}
              className="py-2 px-3 bg-[#F4EFE6] hover:bg-[#E8E0D2] text-[#111111] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-[#BFA15A]" />
              <span>Snap Center (0, 0)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScale(1.0);
                emitChanges({ logoScale: 1.0 });
                showToast('Zoom set to 100%.');
              }}
              className="py-2 px-3 bg-[#F4EFE6] hover:bg-[#E8E0D2] text-[#111111] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#BFA15A]" />
              <span>100% Size</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
