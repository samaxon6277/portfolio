import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

interface UnitOption {
  id: string;
  name: string;
  toBase: number;
}

interface CustomUnitDropdownProps {
  label: string;
  selectedId: string;
  options: UnitOption[];
  onSelect: (id: string) => void;
  variant?: 'dark' | 'light';
}

export default function CustomUnitDropdown({
  label,
  selectedId,
  options,
  onSelect,
  variant = 'light'
}: CustomUnitDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedUnit = options.find(o => o.id === selectedId) || options[0];

  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isDark = variant === 'dark';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer select-none text-left shadow-xs ${
          isDark
            ? 'bg-[#181818] border-[#D6B46A]/35 text-[#D6B46A] hover:border-[#D6B46A] hover:bg-[#202020]'
            : 'bg-[#FFFDF8] border-[#D6B46A]/30 text-[#111111] hover:border-[#D6B46A] hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-black uppercase ${
            isDark ? 'bg-[#D6B46A]/20 text-[#D6B46A]' : 'bg-[#111111] text-[#D6B46A]'
          }`}>
            {selectedUnit?.id}
          </span>
          <span className="font-mono text-sm font-bold truncate">
            {selectedUnit?.name}
          </span>
        </div>

        <ChevronDown 
          className={`w-4 h-4 transition-transform shrink-0 ${
            isOpen ? 'rotate-180 text-[#D6B46A]' : isDark ? 'text-[#8A8178]' : 'text-[#8A8178]'
          }`} 
        />
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#141414] border border-[#D6B46A]/40 rounded-2xl shadow-2xl p-2.5 space-y-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Quick Search */}
          {options.length > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8178]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search unit..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#222222] border border-[#D6B46A]/20 text-xs font-mono text-white placeholder-[#8A8178] focus:outline-none focus:border-[#D6B46A]"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8178] hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs font-mono text-[#8A8178]">
                No matching unit found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === selectedId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelect(opt.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#D6B46A] text-[#111111] font-bold shadow-xs'
                        : 'text-neutral-200 hover:bg-[#252525] hover:text-[#D6B46A]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        isSelected ? 'bg-[#111111] text-[#D6B46A]' : 'bg-[#222222] text-[#8A8178]'
                      }`}>
                        {opt.id}
                      </span>
                      <span>{opt.name}</span>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-[#111111] stroke-[3]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
