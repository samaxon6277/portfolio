import React from 'react';

export interface CustomSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSwitch({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = ''
}: CustomSwitchProps) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center justify-between gap-4 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {(label || description) && (
        <div className="text-left">
          {label && (
            <span className="text-xs font-bold text-[#111111] block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-[#8A8178] block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}

      <div className="relative inline-block w-11 h-6 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out border ${
            checked
              ? 'bg-[#111111] border-[#D6B46A]'
              : 'bg-neutral-200 border-neutral-300'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full transition-transform duration-200 ease-in-out mt-[3px] ml-[3px] shadow-sm ${
              checked
                ? 'translate-x-5 bg-[#D6B46A]'
                : 'translate-x-0 bg-white'
            }`}
          />
        </div>
      </div>
    </label>
  );
}
