import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    
    return normalizedOptions.map((opt) => {
      const showHeader = opt.group && opt.group !== lastGroup;
      if (opt.group) {
        lastGroup = opt.group;
      }
      const isSelected = opt.value === value;

      return (
        <React.Fragment key={opt.value}>
          {showHeader && (
            <div className="px-3.5 py-1.5 bg-[#FAF6F0] text-[8.5px] font-mono uppercase tracking-widest text-[#BFA15A] font-extrabold border-b border-t border-[#D6B46A]/10 first:border-t-0 select-none">
              {opt.group}
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
              isSelected
                ? 'bg-matte-black text-[#D6B46A] font-semibold'
                : 'text-matte-black hover:bg-[#F8F4EE] hover:text-[#BFA15A]'
            }`}
          >
            <span className="truncate">{opt.label}</span>
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
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FFFDF8] border rounded-xl text-xs font-semibold text-[#111111] transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-champagne-gold shadow-[0_0_0_3.5px_rgba(214,180,106,0.18)]'
            : 'border-[#D6B46A]/25 hover:border-[#D6B46A]/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]'
        }`}
      >
        <span className={`truncate ${!selectedOption ? 'text-warm-grey/70 font-normal' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
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
            className="absolute left-0 mt-2 w-full bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl shadow-[0_12px_32px_-4px_rgba(17,17,17,0.12),0_4px_12px_-2px_rgba(214,180,106,0.14)] overflow-hidden"
            style={{ zIndex: 100 }}
          >
            <div className="max-h-60 overflow-y-auto py-1 divide-y divide-[#D6B46A]/5 custom-scrollbar">
              {renderOptionsList()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
