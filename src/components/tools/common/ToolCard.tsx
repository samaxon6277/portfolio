import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Sparkles, 
  CheckSquare, 
  Sliders, 
  Palette, 
  Eye, 
  FileText, 
  Layers, 
  Network, 
  Smartphone, 
  GitCompare, 
  ShieldCheck, 
  SearchCode, 
  Terminal, 
  HelpCircle, 
  Lock, 
  Hash, 
  Calendar, 
  Code, 
  Globe, 
  Clock, 
  Percent, 
  QrCode, 
  Briefcase, 
  Scissors, 
  Maximize2, 
  Shapes, 
  RefreshCw, 
  Calculator, 
  Minimize2, 
  Crop,
  Zap,
  Cpu
} from 'lucide-react';
import type { CatalogTool } from '../../../data/toolsCatalog';
import { ToolMiniVisualizer } from './ToolMiniVisualizer';

// Dynamic Lucide Icon Resolver
const ICON_MAP: Record<string, React.ElementType> = {
  CheckSquare,
  Sliders,
  Palette,
  Eye,
  FileText,
  Layers,
  Network,
  Smartphone,
  GitCompare,
  ShieldCheck,
  SearchCode,
  Terminal,
  HelpCircle,
  Lock,
  Hash,
  Calendar,
  Code,
  Globe,
  Clock,
  Percent,
  QrCode,
  Briefcase,
  Scissors,
  Maximize2,
  Shapes,
  RefreshCw,
  Calculator,
  Minimize2,
  Crop,
  Zap,
  Cpu,
  Sparkles
};

interface ToolCardProps {
  tool: CatalogTool;
  onClick?: () => void;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, featured = false }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const IconComponent = ICON_MAP[tool.iconName] || Sparkles;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--spotlight-x', `${e.nativeEvent.offsetX}px`);
    cardRef.current.style.setProperty('--spotlight-y', `${e.nativeEvent.offsetY}px`);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem('samaxon_tools_scroll_pos', scrollPos.toString());
      sessionStorage.setItem('samaxon_last_tool_id', tool.id);
    } catch {}
    onClick?.();
  };

  return (
    <Link
      ref={cardRef}
      id={`tool-card-${tool.id}`}
      to={tool.route}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#FFFDF8] border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B46A] focus-visible:ring-offset-2 overflow-hidden cursor-pointer ${
        featured 
          ? 'border-[#D6B46A]/60 shadow-md shadow-[#D6B46A]/10 hover:border-[#D6B46A]' 
          : 'border-neutral-200/90 hover:border-[#D6B46A]/60 hover:shadow-lg hover:shadow-neutral-900/5'
      } hover:-translate-y-1 active:translate-y-0`}
    >
      {/* GPU Accelerated Spotlight Layer via CSS Variables */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(350px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(214, 180, 106, 0.09), transparent 80%)'
        }}
      />
      {/* Top Section */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-neutral-800 shadow-xs transition-transform duration-200 group-hover:scale-105">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#85641C] block">
                {tool.badge || 'PRO INSTRUMENT'}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                CLIENT SANDBOX
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-lg bg-neutral-100 group-hover:bg-[#111111] group-hover:text-[#D6B46A] text-neutral-400 flex items-center justify-center transition-colors duration-200">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <h3 className="font-display font-bold text-base text-[#111111] group-hover:text-[#85641C] transition-colors duration-150 line-clamp-1 mb-1.5">
          {tool.name}
        </h3>

        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 h-9 mb-3">
          {tool.description}
        </p>

        {/* Feature Pills */}
        {tool.featurePills && tool.featurePills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.featurePills.slice(0, 2).map((pill, idx) => (
              <span 
                key={idx} 
                className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 truncate max-w-[150px]"
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Miniature Interactive Function Visualizer */}
      <div className="px-5 pb-4">
        <ToolMiniVisualizer toolId={tool.id} />
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono">
        <span className="text-neutral-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Instant Run
        </span>
        <span className="font-bold text-[#111111] group-hover:text-[#85641C] flex items-center gap-1 transition-colors">
          Launch
          <span className="text-xs">→</span>
        </span>
      </div>
    </Link>
  );
};
