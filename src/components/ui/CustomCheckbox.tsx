import React from 'react';
import { Check } from 'lucide-react';

export interface CustomCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomCheckbox({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = ''
}: CustomCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-start gap-3 cursor-pointer select-none group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'bg-[#111111] border-[#D6B46A] shadow-[0_0_0_2px_rgba(214,180,106,0.25)]'
              : 'bg-[#FFFDF8] border-[#D6B46A]/40 group-hover:border-[#D6B46A]'
          } ${disabled ? 'bg-neutral-100' : ''}`}
        >
          {checked && (
            <Check className="w-3.5 h-3.5 text-[#D6B46A] stroke-[3]" />
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="text-left leading-tight">
          {label && (
            <span className="text-xs font-semibold text-[#111111] block group-hover:text-[#85641C] transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-[#8A8178] block mt-0.5 leading-normal font-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
