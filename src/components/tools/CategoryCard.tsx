import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Sliders, 
  Palette, 
  Sparkles, 
  SearchCode, 
  Layers, 
  Clock, 
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Wrench,
  LucideIcon
} from 'lucide-react';
import { ToolCategory } from '../../data/toolsCatalog';

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Sliders,
  Palette,
  Sparkles,
  SearchCode,
  Layers,
  Clock,
};

interface CategoryCardProps {
  category: ToolCategory;
  availableToolCount: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  availableToolCount
}) => {
  const IconComponent = CATEGORY_ICON_MAP[category.iconName] || Wrench;

  return (
    <Link
      to={`/tools/category/${category.slug}`}
      id={`category-card-${category.slug}`}
      className="group relative flex flex-col justify-between p-6 sm:p-7 bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#D6B46A]/25 hover:border-[#D6B46A] shadow-[0_4px_20px_rgba(17,17,17,0.03)] hover:shadow-[0_12px_32px_rgba(214,180,106,0.18)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D6B46A] focus:ring-offset-2 overflow-hidden h-full"
    >
      {/* Subtle gold corner ambient accent */}
      <div 
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#D6B46A]/15 to-transparent blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" 
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Header: Icon & Tool Count */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl sm:rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shadow-sm group-hover:scale-105 group-hover:border-[#D6B46A] transition-all duration-300 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/5 border border-[#D6B46A]/25 text-[11px] sm:text-xs font-mono font-bold text-[#8A6D3B] group-hover:border-[#D6B46A]/60 transition-colors shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
            {availableToolCount} {availableToolCount === 1 ? 'Tool' : 'Tools'}
          </span>
        </div>

        {/* Category Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-display text-[#111111] tracking-tight group-hover:text-[#8A6D3B] transition-colors mb-2.5">
          {category.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#554F49] leading-relaxed mb-5 line-clamp-3">
          {category.shortDescription}
        </p>

        {/* Example Tools List */}
        <div className="mt-auto pt-4 border-t border-[#D6B46A]/15 mb-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#8A8178] mb-2 font-semibold flex items-center gap-1">
            <span>Includes:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category.examples.map((example, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[11px] sm:text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100/80 text-[#33302C] border border-neutral-200/60"
              >
                {example}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: Explore Tools */}
        <div className="pt-2 flex items-center justify-between text-xs sm:text-sm font-bold font-mono text-[#111111] group-hover:text-[#8A6D3B] transition-colors">
          <span className="inline-flex items-center gap-1.5">
            Explore Tools
          </span>
          <div className="w-8 h-8 rounded-full bg-[#111111]/5 group-hover:bg-[#111111] text-[#111111] group-hover:text-[#D6B46A] flex items-center justify-center transition-all duration-300">
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
