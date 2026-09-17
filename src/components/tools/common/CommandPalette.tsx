import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  Sliders, 
  Palette, 
  FileText, 
  Clock, 
  Lock, 
  Code,
  CornerDownLeft
} from 'lucide-react';
import { getAllCatalogTools, getAllCategories, type CatalogTool } from '../../../data/toolsCatalog';
import { VARIANTS } from './toolOsMotion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allTools = useMemo(() => getAllCatalogTools(), []);
  const allCategories = useMemo(() => getAllCategories(), []);

  // Filter tools based on query and selected category
  const filteredTools = useMemo(() => {
    let tools = allTools;
    if (selectedCategory !== 'all') {
      tools = tools.filter(t => t.categoryId === selectedCategory);
    }
    if (!query.trim()) return tools.slice(0, 10);

    const q = query.toLowerCase().trim();
    return tools.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.badge?.toLowerCase().includes(q) ||
      t.featurePills?.some(pill => pill.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [allTools, query, selectedCategory]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Focus input when opened, and restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen]);

  // Keyboard navigation listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredTools.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          navigate(filteredTools[selectedIndex].route);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, navigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeItem = listRef.current.children[selectedIndex] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 pb-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Tool Command Palette"
            variants={VARIANTS.commandPalette}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-2xl border border-neutral-300 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-neutral-200 flex items-center gap-3 bg-white">
              <Search className="w-5 h-5 text-[#85641C] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, syntax, calculations, or tokens..."
                className="w-full text-base bg-transparent border-none outline-none text-[#111111] placeholder:text-neutral-400 font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                ESC
              </kbd>
            </div>

            {/* Quick Category Filter Chips */}
            <div className="px-4 py-2 bg-neutral-50/80 border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-full font-mono text-[11px] whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#111111] text-[#D6B46A] font-bold'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200/80 border border-neutral-200'
                }`}
              >
                All Tools ({allTools.length})
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full font-mono text-[11px] whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#111111] text-[#D6B46A] font-bold'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200/80 border border-neutral-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div ref={listRef} className="p-2 overflow-y-auto max-h-96 divide-y divide-neutral-100">
              {filteredTools.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Terminal className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-700">No matching tools found</p>
                  <p className="text-xs text-neutral-500">Try searching for keywords like "svg", "regex", "cron", or "contrast".</p>
                </div>
              ) : (
                filteredTools.map((tool, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        navigate(tool.route);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-neutral-100/90 text-[#111111]' : 'hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm truncate">{tool.name}</h4>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700">
                              {tool.badge || 'PRO'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 truncate">{tool.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#85641C] font-bold">
                            <span>Open</span>
                            <CornerDownLeft className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-[#85641C]' : 'text-neutral-400'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 shadow-2xs">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 shadow-2xs">↓</kbd>
                  to navigate
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 shadow-2xs">↵</kbd>
                  to select
                </span>
              </div>
              <span>100% In-Browser Privacy</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
