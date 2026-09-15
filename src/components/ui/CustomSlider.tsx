import React from 'react';

export interface CustomSliderProps {
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSlider({
  id,
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  unit = '',
  minLabel,
  maxLabel,
  disabled = false,
  className = ''
}: CustomSliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full space-y-2 text-left ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <label htmlFor={id} className="font-bold text-[#111111] uppercase tracking-wider">
              {label}
            </label>
          )}
          <span className="font-mono font-bold text-[#85641C] bg-[#FAF6F0] border border-[#D6B46A]/25 px-2 py-0.5 rounded-md text-[11px]">
            {value}{unit}
          </span>
        </div>
      )}

      <div className="relative flex items-center py-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none bg-neutral-200 accent-[#D6B46A]"
          style={{
            background: `linear-gradient(to right, #D6B46A 0%, #D6B46A ${percentage}%, #E5E5E5 ${percentage}%, #E5E5E5 100%)`
          }}
        />
      </div>

      {(minLabel || maxLabel) && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8178]">
          <span>{minLabel || `${min}${unit}`}</span>
          <span>{maxLabel || `${max}${unit}`}</span>
        </div>
      )}
    </div>
  );
}
