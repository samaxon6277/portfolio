import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface CustomSelectProps<T = string> {
  id?: string;
  label?: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
  description?: string;
}

export default function CustomSelect<T extends string = string>({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = false,
  disabled = false,
  error,
  className = '',
  required = false,
  description
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter(o => 
        o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.description && o.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const opt = filteredOptions[focusedIndex];
          if (!opt.disabled) {
            onChange(opt.value);
            setIsOpen(false);
            setSearchQuery('');
          }
        }
        break;
    }
  };

  return (
    <div className={`space-y-1.5 text-left relative ${className}`} ref={containerRef} id={id ? `${id}-wrapper` : undefined}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-bold text-[#111111] uppercase tracking-wider select-none"
        >
          {label}
          {required && <span className="text-[#D6B46A] ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="text-[11px] text-[#8A8178] leading-relaxed">
          {description}
        </p>
      )}

      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(prev => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer ${
            disabled 
              ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-70'
              : error 
              ? 'bg-white border-rose-400 text-neutral-900 shadow-sm shadow-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400'
              : isOpen
              ? 'bg-white border-[#D6B46A] ring-2 ring-[#D6B46A]/20 text-neutral-900 shadow-sm'
              : 'bg-white border-neutral-200 hover:border-[#D6B46A]/60 text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D6B46A]/30'
          }`}
        >
          <span className="truncate text-xs font-medium">
            {selectedOption ? (
              <span className="flex items-center gap-2">
                <span>{selectedOption.label}</span>
                {selectedOption.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#D6B46A]/15 text-[#8F722E] font-bold">
                    {selectedOption.badge}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-neutral-400">{placeholder}</span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 text-[#8A8178] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div 
            role="listbox"
            className="absolute z-50 mt-1.5 w-full bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden animate-fade-in text-neutral-900 max-h-64 flex flex-col"
          >
            {searchable && (
              <div className="p-2 border-b border-neutral-100 bg-neutral-50/70">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFocusedIndex(0);
                    }}
                    placeholder="Search options..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D6B46A] focus:border-[#D6B46A]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-y-auto py-1 divide-y divide-neutral-50 max-h-56">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-xs text-neutral-400 text-center">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isFocused = idx === focusedIndex;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        if (!opt.disabled) {
                          onChange(opt.value);
                          setIsOpen(false);
                          setSearchQuery('');
                        }
                      }}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed bg-neutral-50'
                          : isSelected
                          ? 'bg-[#D6B46A]/15 text-[#111111] font-bold'
                          : isFocused
                          ? 'bg-neutral-100 text-neutral-900'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{opt.label}</span>
                          {opt.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-[#111111]/5 text-[#8F722E] font-medium">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="text-[10.5px] text-neutral-500 truncate mt-0.5 font-normal">
                            {opt.description}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#D6B46A] shrink-0 font-bold" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-600 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
