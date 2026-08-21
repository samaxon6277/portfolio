import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  const renderOptionsList = () => {
    let lastGroup = '';
    
    return normalizedOptions.map((opt) => {
      const showHeader = opt.group && opt.group !== lastGroup;
      if (opt.group) {
        lastGroup = opt.group;
      }
      const isSelected = opt.value === value;

      return (
        <React.Fragment key={opt.value}>
          {showHeader && (
            <div className={`px-3.5 py-1.5 text-[9px] font-mono uppercase tracking-widest font-bold select-none ${
              isDark ? 'bg-white/[0.04] text-[#D6B46A]' : 'bg-black/[0.03] text-[#8E8E93]'
            }`}>
              {opt.group}
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
              isSelected
                ? isDark
                  ? 'bg-white/10 text-[#D6B46A] font-bold'
                  : 'bg-black/5 text-[#D6B46A] font-bold'
                : isDark
                  ? 'text-[#F5F5F7] hover:bg-white/5 hover:text-white'
                  : 'text-[#1D1D1F] hover:bg-black/5 hover:text-black'
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
        className={`w-full relative overflow-hidden flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-gradient-to-r from-[#1E1E22]/80 to-[#141416]/80 backdrop-blur-2xl border-white/15 text-white hover:border-white/30 focus:border-[#D6B46A] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15)]'
            : 'bg-gradient-to-r from-white/70 via-white/45 to-white/65 backdrop-blur-2xl backdrop-saturate-180 border-white/85 text-[#1D1D1F] hover:border-[#D6B46A]/70 focus:border-[#D6B46A] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(255,255,255,0.4)]'
        }`}
      >
        {/* Top Meniscus Water Gloss Line */}
        <span 
          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none rounded-t-2xl bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-80" 
          aria-hidden="true" 
        />

        <span className="truncate relative z-10 font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 shrink-0 relative z-10 ${
          isOpen ? 'rotate-180 text-[#D6B46A]' : 'text-[#8E8E93]'
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute left-0 mt-2 w-full rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-3xl backdrop-saturate-200 animate-in fade-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-gradient-to-b from-[#1E1E22]/95 to-[#121214]/95 border-white/20 divide-y divide-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.2)]'
            : 'bg-gradient-to-b from-white/92 via-white/80 to-white/90 border-white/90 divide-y divide-black/5 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.04),inset_0_1.5px_2.5px_rgba(255,255,255,1)]'
        }`} style={{ zIndex: 100 }}>
          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
            {renderOptionsList()}
          </div>
        </div>
      )}
    </div>
  );
}
