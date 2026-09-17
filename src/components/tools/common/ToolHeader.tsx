import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, LucideIcon } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  categoryName?: string;
  categorySlug?: string;
  badgeText?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  description,
  icon: Icon,
  categoryName,
  categorySlug,
  badgeText = '100% BROWSER-SIDE · ZERO SERVER UPLOADS',
}) => {
  return (
    <div className="space-y-4 text-left">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500 overflow-x-auto py-0.5">
        <Link to="/" className="hover:text-neutral-900 transition-colors shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />
        <Link to="/tools" className="hover:text-neutral-900 transition-colors shrink-0">Tools</Link>
        {categoryName && categorySlug && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />
            <Link to={`/tools/category/${categorySlug}`} className="hover:text-neutral-900 transition-colors shrink-0">
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />
        <span className="text-neutral-900 font-bold shrink-0 truncate">{title}</span>
      </nav>

      {/* Main Tool Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center shrink-0 border border-[#D6B46A]/30 shadow-xs">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-neutral-900 tracking-tight">
                {title}
              </h1>
              {badgeText && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolHeader;
