import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  sublabel?: string;
  group?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps<T extends string | number = string> {
  value: T;
  onChange: (value: T) => void;
  options: (string | SelectOption<T>)[];
  placeholder?: string;
  className?: string;
  dark?: boolean;
}

export default function CustomSelect<T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  dark = false
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to SelectOption structure
  const normalizedOptions: SelectOption<T>[] = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt as unknown as T, label: String(opt) };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (optValue: T) => {
    onChange(optValue);
    setIsOpen(false);
  };

  // Helper to render items with group headers sequentially
  const renderOptionsList = () => {
    let lastGroup = '';
    
    return normalizedOptions.map((opt) => {
      const showHeader = opt.group && opt.group !== lastGroup;
      if (opt.group) {
        lastGroup = opt.group;
      }
      const isSelected = opt.value === value;

      return (
        <React.Fragment key={String(opt.value)}>
          {showHeader && (
            <div className={`px-3.5 py-1.5 text-[8.5px] font-mono uppercase tracking-widest font-extrabold select-none ${
              dark 
                ? 'bg-white/5 text-[#D6B46A] border-b border-t border-white/5 first:border-t-0' 
                : 'bg-[#FAF6F0] text-[#BFA15A] border-b border-t border-[#D6B46A]/10 first:border-t-0'
            }`}>
              {opt.group}
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
              isSelected
                ? dark 
                  ? 'bg-white/10 text-[#D6B46A] font-semibold' 
                  : 'bg-matte-black text-[#D6B46A] font-semibold'
                : dark
                  ? 'text-neutral-200 hover:bg-white/5 hover:text-[#D6B46A]'
                  : 'text-matte-black hover:bg-[#F8F4EE] hover:text-[#BFA15A]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <div className="min-w-0">
                <span className="truncate block font-medium">{opt.label}</span>
                {opt.sublabel && (
                  <span className={`text-[10px] font-mono block truncate ${
                    isSelected 
                      ? 'text-[#D6B46A]/80' 
                      : dark ? 'text-neutral-400' : 'text-[#8A8178]'
                  }`}>
                    {opt.sublabel}
                  </span>
                )}
              </div>
            </div>
            {isSelected && <Check className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />}
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
        className={`w-full flex items-center justify-between px-3.5 py-2.5 border rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
          dark
            ? isOpen
              ? 'bg-[#181818] border-champagne-gold text-white shadow-[0_0_0_3.5px_rgba(214,180,106,0.2)]'
              : 'bg-[#181818] border-white/15 hover:border-[#D6B46A]/50 text-white'
            : isOpen
              ? 'bg-[#FFFDF8] border-champagne-gold text-[#111111] shadow-[0_0_0_3.5px_rgba(214,180,106,0.18)]'
              : 'bg-[#FFFDF8] border-[#D6B46A]/25 hover:border-[#D6B46A]/50 text-[#111111] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate ${!selectedOption ? (dark ? 'text-neutral-400' : 'text-warm-grey/70 font-normal') : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#8A8178] ml-2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#D6B46A]' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute left-0 mt-2 w-full border rounded-xl overflow-hidden ${
              dark
                ? 'bg-[#161616] border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.6)] divide-y divide-white/5'
                : 'bg-[#FFFDF8] border-[#D6B46A]/25 shadow-[0_12px_32px_-4px_rgba(17,17,17,0.12),0_4px_12px_-2px_rgba(214,180,106,0.14)] divide-y divide-[#D6B46A]/5'
            }`}
            style={{ zIndex: 100 }}
          >
            <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
              {renderOptionsList()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
