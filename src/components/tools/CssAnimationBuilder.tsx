import React, { useState, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, Copy, Download, Sliders, 
  Sparkles, Layers, Box, Circle, Eye, Plus, Trash2, HelpCircle
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, DownloadButton, ResetButton } from './common/ToolActions';

interface KeyframeStep {
  id: string;
  percentage: number;
  translateX: number;
  translateY: number;
  scale: number;
  rotate: number;
  opacity: number;
  borderRadius: number;
  bgColor: string;
}

const DEFAULT_KEYFRAMES: KeyframeStep[] = [
  { id: '1', percentage: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, borderRadius: 16, bgColor: '#111111' },
  { id: '2', percentage: 50, translateX: 0, translateY: -40, scale: 1.15, rotate: 180, opacity: 0.9, borderRadius: 32, bgColor: '#D6B46A' },
  { id: '3', percentage: 100, percentage: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, opacity: 1, borderRadius: 16, bgColor: '#111111' }
];

export default function CssAnimationBuilder() {
  const [animationName, setAnimationName] = useState('samaxonPulse');
  const [duration, setDuration] = useState(2.0);
  const [iteration, setIteration] = useState<'infinite' | '1' | '2' | '3'>('infinite');
  const [direction, setDirection] = useState<'normal' | 'alternate' | 'reverse'>('alternate');
  const [timingPreset, setTimingPreset] = useState<'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'custom'>('cubic-bezier(0.4, 0, 0.2, 1)');
  const [isPlaying, setIsPlaying] = useState(true);
  const [previewShape, setPreviewShape] = useState<'card' | 'circle' | 'button'>('card');
  const [keyframes, setKeyframes] = useState<KeyframeStep[]>(DEFAULT_KEYFRAMES);
  const [activeStepId, setActiveStepId] = useState<string>('2');

  const activeStep = keyframes.find(k => k.id === activeStepId) || keyframes[0];

  const updateActiveStep = (partial: Partial<KeyframeStep>) => {
    setKeyframes(prev => prev.map(k => k.id === activeStepId ? { ...k, ...partial } : k));
  };

  const addKeyframe = () => {
    const newId = String(Date.now());
    const newStep: KeyframeStep = {
      id: newId,
      percentage: 75,
      translateX: 0,
      translateY: -20,
      scale: 1.05,
      rotate: 90,
      opacity: 1,
      borderRadius: 20,
      bgColor: '#A68936'
    };
    const updated = [...keyframes, newStep].sort((a, b) => a.percentage - b.percentage);
    setKeyframes(updated);
    setActiveStepId(newId);
  };

  const deleteKeyframe = (id: string) => {
    if (keyframes.length <= 2) {
      alert('An animation must have at least 2 keyframes (e.g. 0% and 100%).');
      return;
    }
    const filtered = keyframes.filter(k => k.id !== id);
    setKeyframes(filtered);
    if (activeStepId === id) setActiveStepId(filtered[0].id);
  };

  // Generate CSS Code
  const generatedCss = useMemo(() => {
    const sorted = [...keyframes].sort((a, b) => a.percentage - b.percentage);
    const keyframeLines = sorted.map(k => {
      return `  ${k.percentage}% {
    transform: translate(${k.translateX}px, ${k.translateY}px) scale(${k.scale}) rotate(${k.rotate}deg);
    opacity: ${k.opacity};
    border-radius: ${k.borderRadius}px;
    background-color: ${k.bgColor};
  }`;
    }).join('\n');

    return `/* SamaXon Production Keyframe Animation */
@keyframes ${animationName} {
${keyframeLines}
}

.animated-element {
  animation-name: ${animationName};
  animation-duration: ${duration}s;
  animation-timing-function: ${timingPreset};
  animation-iteration-count: ${iteration};
  animation-direction: ${direction};
  animation-fill-mode: both;
}`;
  }, [keyframes, animationName, duration, timingPreset, iteration, direction]);

  const handleDownloadCss = () => {
    const blob = new Blob([generatedCss], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animationName}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-left" id="css-animation-builder">
      {/* Dynamic Style Injection for Preview */}
      <style>{generatedCss}</style>

      <ToolHeader
        title="CSS Keyframe Animation & Cubic-Bezier Builder"
        description="Design fluid CSS keyframe sequences and cubic-bezier easing curves with interactive timeline editing and live multi-shape canvas simulation."
        icon={Sliders}
        categoryName="Design & UX"
        categorySlug="design-ux"
        badgeText="100% IN-BROWSER · HARDWARE ACCELERATED"
      />

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline & Keyframe Property Inspector */}
        <div className="lg:col-span-6 bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A68936]" />
              Timeline Keyframes
            </h3>
            <button
              type="button"
              onClick={addKeyframe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#111111] text-[#D6B46A] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Keyframe
            </button>
          </div>

          {/* Timeline Step Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {keyframes.sort((a,b)=>a.percentage - b.percentage).map((k) => (
              <div
                key={k.id}
                onClick={() => setActiveStepId(k.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer shrink-0 ${
                  activeStepId === k.id
                    ? 'bg-[#111111] text-[#D6B46A] border-neutral-800 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                <span>{k.percentage}%</span>
                {keyframes.length > 2 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteKeyframe(k.id);
                    }}
                    className="opacity-50 hover:opacity-100 text-rose-500"
                    title="Delete step"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Step Property Controls */}
          {activeStep && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-neutral-800">Editing Step @ {activeStep.percentage}%</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Timeline %</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activeStep.percentage}
                    onChange={(e) => updateActiveStep({ percentage: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded bg-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Translate X & Y */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-neutral-700">Translate X</label>
                    <span className="text-neutral-500">{activeStep.translateX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    value={activeStep.translateX}
                    onChange={(e) => updateActiveStep({ translateX: Number(e.target.value) })}
                    className="w-full accent-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-neutral-700">Translate Y</label>
                    <span className="text-neutral-500">{activeStep.translateY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    value={activeStep.translateY}
                    onChange={(e) => updateActiveStep({ translateY: Number(e.target.value) })}
                    className="w-full accent-[#111111]"
                  />
                </div>
              </div>

              {/* Scale & Rotate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-neutral-700">Scale</label>
                    <span className="text-neutral-500">{activeStep.scale}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    value={activeStep.scale}
                    onChange={(e) => updateActiveStep({ scale: Number(e.target.value) })}
                    className="w-full accent-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-neutral-700">Rotation</label>
                    <span className="text-neutral-500">{activeStep.rotate}°</span>
                  </div>
                  <input
                    type="range"
                    min="-360"
                    max="360"
                    value={activeStep.rotate}
                    onChange={(e) => updateActiveStep({ rotate: Number(e.target.value) })}
                    className="w-full accent-[#111111]"
                  />
                </div>
              </div>

              {/* Opacity & Border Radius */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-neutral-700">Opacity</label>
                    <span className="text-neutral-500">{activeStep.opacity}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={activeStep.opacity}
                    onChange={(e) => updateActiveStep({ opacity: Number(e.target.value) })}
                    className="w-full accent-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-neutral-700">Border Radius</label>
                    <span className="text-neutral-500">{activeStep.borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={activeStep.borderRadius}
                    onChange={(e) => updateActiveStep({ borderRadius: Number(e.target.value) })}
                    className="w-full accent-[#111111]"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <label className="text-neutral-700">Fill Color</label>
                  <span className="text-neutral-500">{activeStep.bgColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeStep.bgColor}
                    onChange={(e) => updateActiveStep({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded border border-neutral-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={activeStep.bgColor}
                    onChange={(e) => updateActiveStep({ bgColor: e.target.value })}
                    className="flex-1 px-3 py-1.5 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Stage & Code Output */}
        <div className="lg:col-span-6 space-y-6">
          {/* Live Stage */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-xl bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>

              {/* Shape Selector */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                {(['card', 'circle', 'button'] as const).map(shape => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setPreviewShape(shape)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold capitalize cursor-pointer ${
                      previewShape === shape ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Stage Canvas */}
            <div className="h-[280px] bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div
                className="animated-element flex items-center justify-center p-6 text-center shadow-lg transition-all"
                style={{
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  width: previewShape === 'card' ? '180px' : previewShape === 'circle' ? '140px' : '200px',
                  height: previewShape === 'circle' ? '140px' : 'auto'
                }}
              >
                <div className="text-white font-mono text-xs font-bold space-y-1 select-none pointer-events-none">
                  <Sparkles className="w-5 h-5 mx-auto text-[#D6B46A]" />
                  <span>SamaXon FX</span>
                </div>
              </div>
            </div>

            {/* Timing & Easing Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[
                { label: 'Ease', val: 'ease' },
                { label: 'Smooth Bezier', val: 'cubic-bezier(0.4, 0, 0.2, 1)' },
                { label: 'Bounce Out', val: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
                { label: 'Linear', val: 'linear' }
              ].map(t => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTimingPreset(t.val as any)}
                  className={`p-2 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                    timingPreset === t.val ? 'bg-[#111111] text-[#D6B46A] border-neutral-800' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generated CSS Panel */}
          <div className="bg-[#111111] text-[#FFFDF8] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D6B46A]">
                Generated Keyframes CSS
              </span>
              <div className="flex items-center gap-2">
                <CopyButton textToCopy={generatedCss} label="Copy CSS" />
                <DownloadButton onDownload={handleDownloadCss} label="Download .css" />
              </div>
            </div>
            <pre className="p-3.5 bg-black/50 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed max-h-[220px] selection:bg-[#D6B46A]/30">
              {generatedCss}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
