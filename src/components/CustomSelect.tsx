import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = ''
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label, group } structure
  const normalizedOptions: SelectOption[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  // Helper to render items with group headers sequentially
  const renderOptionsList = () => {
    let lastGroup = '';
    
    return normalizedOptions.map((opt, idx) => {
      const showHeader = opt.group && opt.group !== lastGroup;
      if (opt.group) {
        lastGroup = opt.group;
      }
      const isSelected = opt.value === value;

      return (
        <React.Fragment key={opt.value}>
          {showHeader && (
            <div className="px-3.5 py-1.5 bg-[#FAF6F0] text-[8px] font-mono uppercase tracking-widest text-[#BFA15A] font-extrabold border-b border-t border-[#D6B46A]/10 first:border-t-0 select-none">
              {opt.group}
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-matte-black text-[#D6B46A] font-bold'
                : 'text-matte-black hover:bg-[#F8F4EE] hover:text-[#BFA15A]'
            }`}
          >
            <span className="truncate">{opt.label}</span>
            {isSelected && <Check className="w-3.5 h-3.5 text-[#D6B46A]" />}
          </button>
        </React.Fragment>
      );
    });
  };

  return (
    <div ref={containerRef} className={`relative w-full text-left font-sans ${className}`} style={{ zIndex: isOpen ? 50 : 10 }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl text-xs font-semibold text-[#111111] hover:border-[#D6B46A]/60 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#D6B46A]/50 transition-all duration-200 cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#8A8178] ml-2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#D6B46A]' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200" style={{ zIndex: 100 }}>
          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-[#D6B46A]/5 custom-scrollbar">
            {renderOptionsList()}
          </div>
        </div>
      )}
    </div>
  );
}
