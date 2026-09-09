import React, { useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

interface SleekLuxurySliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
  unit?: string;
}

export default function SleekLuxurySlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  minLabel,
  midLabel,
  maxLabel,
  unit = ''
}: SleekLuxurySliderProps) {
  // Compute percentage 0 - 100
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    onChange(newVal);
  }, [onChange]);

  const stepDown = () => {
    const next = Math.max(min, value - step);
    const precision = step.toString().split('.')[1]?.length || 0;
    onChange(Number(next.toFixed(precision)));
  };

  const stepUp = () => {
    const next = Math.min(max, value + step);
    const precision = step.toString().split('.')[1]?.length || 0;
    onChange(Number(next.toFixed(precision)));
  };

  const displayValStr = formatValue ? formatValue(value) : `${value} ${unit}`;

  return (
    <div className="space-y-3 select-none" id={`sleek-slider-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Top Row: Label & Highlighted Live Output */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono uppercase font-bold text-[#4A443E] tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#8A8178] bg-[#F7F5EE] px-2 py-0.5 rounded-md border border-[#D6B46A]/20">
            {Math.round(percentage)}%
          </span>
          <span className="text-sm sm:text-base font-mono font-black text-[#111111] bg-[#FFFDF8] px-3 py-1 rounded-xl border border-[#D6B46A]/35 shadow-xs">
            {displayValStr}
          </span>
        </div>
      </div>

      {/* Main Track & Native-Synced Interactive Control */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Subtle Stepper Minus */}
        <button
          type="button"
          onClick={stepDown}
          disabled={value <= min}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EDE1] disabled:opacity-40 disabled:cursor-not-allowed border border-[#D6B46A]/30 text-[#4A443E] hover:text-[#111111] active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
          title="Decrease"
          aria-label="Decrease value"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Custom Visual Track + HTML5 Range Layer */}
        <div className="flex-1 relative py-3 flex items-center group cursor-pointer touch-none">
          {/* Background Groove */}
          <div className="w-full h-2 sm:h-2.5 bg-[#EAE5D9] group-hover:bg-[#E2DDD0] rounded-full overflow-hidden transition-colors">
            {/* Glowing Golden Filled Bar */}
            <div
              className="h-full bg-gradient-to-r from-[#C29E4D] via-[#D6B46A] to-[#F0DC9D] transition-all duration-75 ease-out rounded-full shadow-[0_0_8px_rgba(214,180,106,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Precision Metallic Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `${percentage}%` }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFFDF8] border-2 border-[#A68936] shadow-[0_2px_8px_rgba(0,0,0,0.25),0_0_0_3px_rgba(214,180,106,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A68936]" />
            </div>
          </div>

          {/* Invisible Native Input for Flawless Native Touch/Mouse & Accessibility */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label={label}
          />
        </div>

        {/* Subtle Stepper Plus */}
        <button
          type="button"
          onClick={stepUp}
          disabled={value >= max}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EDE1] disabled:opacity-40 disabled:cursor-not-allowed border border-[#D6B46A]/30 text-[#4A443E] hover:text-[#111111] active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
          title="Increase"
          aria-label="Increase value"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Boundary Marks */}
      <div className="flex justify-between text-[11px] font-mono text-[#8A8178] px-1">
        <span>{minLabel || `${min} ${unit}`}</span>
        {midLabel && <span className="hidden sm:inline">{midLabel}</span>}
        <span>{maxLabel || `${max} ${unit}`}</span>
      </div>
    </div>
  );
}
