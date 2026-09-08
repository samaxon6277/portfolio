import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { WebsiteUpdateLog } from '../types';
import { getSiteUpdates, formatTimeAgo, SITE_UPDATES_EVENT } from '../utils/siteUpdatesManager';

export default function LiveUpdateSection() {
  const [updates, setUpdates] = useState<WebsiteUpdateLog[]>([]);

  useEffect(() => {
    const load = () => {
      const all = getSiteUpdates();
      setUpdates(all.filter(u => u.status !== 'draft'));
    };
    load();

    window.addEventListener(SITE_UPDATES_EVENT, load);
    return () => window.removeEventListener(SITE_UPDATES_EVENT, load);
  }, []);

  const latestUpdate = updates[0];
  if (!latestUpdate) return null;

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-champagne-gold/20" id="website-live-updates-section">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-matte-black text-soft-ivory border border-champagne-gold/30 text-[10px] font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Website Deployment Telemetry</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-matte-black uppercase">
              Recent Website Upgrades & Changes
            </h2>
            <p className="text-xs sm:text-sm text-[#595046] leading-relaxed">
              Transparent, minute-by-minute changelog tracking when our platform was upgraded, exact calendar dates, hours, minutes, and all architectural updates.
            </p>
          </div>

          <Link
            to="/updates"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-matte-black hover:bg-[#222222] text-[#D6B46A] text-xs font-mono uppercase font-bold tracking-wider transition-all border border-champagne-gold/30 shadow-md hover:border-champagne-gold self-start md:self-auto cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>View Full Changelog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Spotlight Showcase Card */}
        <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#D6B46A]/30 shadow-lg text-left space-y-7 relative overflow-hidden">
          {/* Subtle Ambient Gold Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6B46A]/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Top Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3.5 py-1 rounded-xl bg-matte-black text-[#D6B46A] font-mono font-black text-xs">
                {latestUpdate.version}
              </span>
              <span className="px-3 py-0.5 rounded-lg bg-[#D6B46A]/15 text-[#8B6E23] text-xs font-mono font-bold uppercase tracking-wider">
                {latestUpdate.category}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Updated {formatTimeAgo(latestUpdate.timestamp)}</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#8A8178] uppercase font-bold tracking-wider">
              Production Verified Node
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-display font-black text-matte-black">
              {latestUpdate.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#595046] leading-relaxed max-w-3xl">
              {latestUpdate.summary}
            </p>
          </div>

          {/* Explicit Tareek, Day, Time, Hour & Minute Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#D6B46A]/20">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold block">
                Update Date (Tareek)
              </span>
              <div className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D6B46A] shrink-0" />
                <span>{latestUpdate.displayDate}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold block">
                Release Day
              </span>
              <div className="text-sm sm:text-base font-bold text-neutral-900">
                {latestUpdate.displayDay}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold block">
                Exact Time & Minute
              </span>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{latestUpdate.displayTime.split('(')[0].trim()}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold block">
                Time Elapsed
              </span>
              <div className="text-sm sm:text-base font-bold text-[#8B6E23]">
                {formatTimeAgo(latestUpdate.timestamp)}
              </div>
            </div>
          </div>

          {/* Granular Changes List */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A7167] font-bold block">
              What Changed in this Upgrade ({latestUpdate.changes.length} Points):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {latestUpdate.changes.map((change, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                  <span>{change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Modules Tag */}
          {latestUpdate.affectedModules && latestUpdate.affectedModules.length > 0 && (
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] font-mono text-[#8A8178]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Modules Updated:</span>
                {latestUpdate.affectedModules.map((mod, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-medium">
                    {mod}
                  </span>
                ))}
              </div>

              <Link 
                to="/updates" 
                className="text-[#8B6E23] hover:text-matte-black font-bold flex items-center gap-1 transition-colors"
              >
                <span>Read entire {updates.length} release history</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
