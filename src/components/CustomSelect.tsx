import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
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
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function CustomSelect<T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  dark = false,
  searchable,
  clearable = false,
  disabled = false,
  id
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to SelectOption structure
  const normalizedOptions: SelectOption<T>[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { value: opt as unknown as T, label: String(opt) };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Determine if search should be active
  const isSearchActive = searchable ?? normalizedOptions.length > 7;

  // Filter options based on query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
        (opt.group && opt.group.toLowerCase().includes(q))
    );
  }, [normalizedOptions, searchQuery]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && isSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isOpen, isSearchActive]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
      } else if (event.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        event.preventDefault();
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredOptions, highlightedIndex]);

  const handleSelect = (optValue: T) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('' as unknown as T);
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full text-left font-sans ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      style={{ zIndex: isOpen ? 60 : 10 }}
    >
      {/* Custom Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 border rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
          dark
            ? isOpen
              ? 'bg-[#181818] border-[#D6B46A] text-white shadow-[0_0_0_3.5px_rgba(214,180,106,0.2)]'
              : 'bg-[#181818] border-white/15 hover:border-[#D6B46A]/50 text-white'
            : isOpen
              ? 'bg-[#FFFDF8] border-[#D6B46A] text-[#111111] shadow-[0_0_0_3.5px_rgba(214,180,106,0.18)]'
              : 'bg-[#FFFDF8] border-[#D6B46A]/25 hover:border-[#D6B46A]/50 text-[#111111] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate ${!selectedOption ? (dark ? 'text-neutral-400' : 'text-[#8A8178]/70 font-normal') : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {clearable && value && (
            <span
              role="button"
              onClick={handleClear}
              className="p-1 hover:bg-neutral-200/50 rounded-md text-[#8A8178] hover:text-[#111111] transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#8A8178] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D6B46A]' : ''}`}
          />
        </div>
      </button>

      {/* Custom Dropdown Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            className={`absolute left-0 mt-2 w-full border rounded-xl overflow-hidden shadow-2xl ${
              dark
                ? 'bg-[#161616] border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.6)] divide-y divide-white/5'
                : 'bg-[#FFFDF8] border-[#D6B46A]/30 shadow-[0_16px_40px_-4px_rgba(17,17,17,0.12),0_4px_16px_-2px_rgba(214,180,106,0.16)] divide-y divide-[#D6B46A]/10'
            }`}
            style={{ zIndex: 100 }}
          >
            {/* Search Box if Search Active */}
            {isSearchActive && (
              <div className={`p-2 border-b ${dark ? 'border-white/10 bg-[#1a1a1a]' : 'border-[#D6B46A]/15 bg-[#FAF6F0]'}`}>
                <div className="relative flex items-center">
                  <Search className={`w-3.5 h-3.5 absolute left-2.5 ${dark ? 'text-neutral-400' : 'text-[#8A8178]'}`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    placeholder="Search options..."
                    className={`w-full text-xs font-semibold pl-8 pr-3 py-1.5 rounded-lg border outline-none ${
                      dark
                        ? 'bg-[#222222] text-white border-white/10 focus:border-[#D6B46A]'
                        : 'bg-[#FFFDF8] text-[#111111] border-[#D6B46A]/25 focus:border-[#D6B46A]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 text-neutral-400 hover:text-neutral-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-[#8A8178] font-medium">No matching options found</p>
                  <p className="text-[10px] text-[#8A8178]/70 mt-0.5">Try searching with different terms</p>
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? dark
                            ? 'bg-white/10 text-[#D6B46A] font-bold'
                            : 'bg-[#111111] text-[#D6B46A] font-bold'
                          : isHighlighted
                          ? dark
                            ? 'bg-white/5 text-white'
                            : 'bg-[#FAF6F0] text-[#111111]'
                          : dark
                          ? 'text-neutral-200 hover:bg-white/5 hover:text-[#D6B46A]'
                          : 'text-[#111111] hover:bg-[#FAF6F0] hover:text-[#85641C]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <div className="min-w-0">
                          <span className="truncate block font-semibold">{opt.label}</span>
                          {opt.sublabel && (
                            <span
                              className={`text-[10px] font-mono block truncate ${
                                isSelected ? 'text-[#D6B46A]/80' : dark ? 'text-neutral-400' : 'text-[#8A8178]'
                              }`}
                            >
                              {opt.sublabel}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
