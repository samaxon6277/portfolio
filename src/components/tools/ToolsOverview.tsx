import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { TOOL_CATEGORIES, ToolCategory } from '../../data/toolsCatalog';
import { getToolsConfig, ToolItemConfig } from '../../utils/toolsConfig';
import { CategoryCard } from './CategoryCard';

interface ToolsOverviewProps {
  onSelectTool?: (toolId: any) => void;
}

export default function ToolsOverview({ onSelectTool }: ToolsOverviewProps) {
  const [toolsConfig, setToolsConfig] = useState<ToolItemConfig[]>(getToolsConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setToolsConfig(getToolsConfig());
    };
    window.addEventListener('samaxon_tools_status_updated', handleUpdate);
    return () => window.removeEventListener('samaxon_tools_status_updated', handleUpdate);
  }, []);

  // Compute live available tool count for each category
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOL_CATEGORIES.forEach(category => {
      // Count tools that are present in this category and enabled
      const count = category.toolIds.filter(toolId => {
        const config = toolsConfig.find(t => t.id === toolId);
        return config ? config.enabled : true;
      }).length;
      counts[category.id] = count;
    });
    return counts;
  }, [toolsConfig]);

  return (
    <div className="space-y-12 sm:space-y-14 text-left" id="tools-overview-categories">
      {/* Category Cards Grid */}
      <section aria-label="Tool Categories" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {TOOL_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              availableToolCount={toolCounts[category.id] ?? category.toolIds.length}
            />
          ))}
        </div>
      </section>

      {/* Supporting Trust & Privacy Information */}
      <section 
        aria-label="Client-Side Privacy Guarantee" 
        className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(17,17,17,0.02)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#111111]">
                100% In-Browser Privacy
              </h3>
              <p className="text-xs text-[#554F49] leading-relaxed">
                Tools run directly in your local browser sandbox. Your images, documents, and code never touch our servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#111111]">
                Zero Upload Latency
              </h3>
              <p className="text-xs text-[#554F49] leading-relaxed">
                Instant execution powered by WebAssembly and Canvas APIs without network wait times or file queue delays.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#111111]">
                No Logins or Subscriptions
              </h3>
              <p className="text-xs text-[#554F49] leading-relaxed">
                Open access to all utilities with zero forced accounts, paywalls, watermarks, or intrusive marketing traps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
