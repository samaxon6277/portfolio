import React from 'react';

export interface RadioOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
}

export interface CustomRadioGroupProps<T extends string | number = string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  layout?: 'horizontal' | 'vertical' | 'grid-2' | 'grid-3';
  className?: string;
}

export default function CustomRadioGroup<T extends string | number = string>({
  name,
  value,
  onChange,
  options,
  layout = 'vertical',
  className = ''
}: CustomRadioGroupProps<T>) {
  const getLayoutClass = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-3';
      case 'grid-2':
        return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
      case 'grid-3':
        return 'grid grid-cols-1 sm:grid-cols-3 gap-3';
      case 'vertical':
      default:
        return 'flex flex-col gap-2.5';
    }
  };

  return (
    <div className={`${getLayoutClass()} ${className}`} role="radiogroup" aria-labelledby={name}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <label
            key={String(opt.value)}
            className={`relative flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left ${
              isSelected
                ? 'bg-[#111111] border-[#D6B46A] text-[#FFFDF8] shadow-[0_4px_16px_rgba(214,180,106,0.15)]'
                : 'bg-[#FFFDF8] border-[#D6B46A]/25 text-[#111111] hover:border-[#D6B46A]/50 hover:bg-[#FAF6F0]'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={String(opt.value)}
              checked={isSelected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />

            {/* Custom Luxury Radio Indicator */}
            <div className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
              isSelected
                ? 'border-[#D6B46A] bg-transparent'
                : 'border-[#8A8178]/50 bg-transparent'
            }`}>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-bold ${isSelected ? 'text-[#FFFDF8]' : 'text-[#111111]'}`}>
                  {opt.label}
                </span>
                {opt.badge && (
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#D6B46A] text-[#111111]'
                      : 'bg-[#FAF6F0] text-[#BFA15A] border border-[#D6B46A]/20'
                  }`}>
                    {opt.badge}
                  </span>
                )}
              </div>
              {opt.description && (
                <p className={`text-[11px] leading-relaxed mt-0.5 ${
                  isSelected ? 'text-neutral-300' : 'text-[#8A8178]'
                }`}>
                  {opt.description}
                </p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
