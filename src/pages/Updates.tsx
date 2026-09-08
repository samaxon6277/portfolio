import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, Calendar, Sparkles, CheckCircle2, History, ArrowRight, 
  Layers, Shield, Zap, Search, Filter, RefreshCw, ChevronRight, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteUpdateLog } from '../types';
import { 
  getSiteUpdates, formatTimeAgo, SITE_UPDATES_EVENT, 
  parseTimestampBreakdown 
} from '../utils/siteUpdatesManager';
import SEO from '../components/SEO';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Updates() {
  const [updates, setUpdates] = useState<WebsiteUpdateLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [nowTime, setNowTime] = useState(Date.now());

  useEffect(() => {
    const load = () => {
      // Only show published updates on public site
      const all = getSiteUpdates();
      setUpdates(all.filter(u => u.status !== 'draft'));
    };
    load();

    window.addEventListener(SITE_UPDATES_EVENT, load);
    // Ticker to refresh relative time strings
    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 30000);

    return () => {
      window.removeEventListener(SITE_UPDATES_EVENT, load);
      clearInterval(interval);
    };
  }, []);

  const latestUpdate = updates[0];

  const filteredUpdates = updates.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      item.version.toLowerCase().includes(query) ||
      item.displayDate.toLowerCase().includes(query) ||
      item.displayDay.toLowerCase().includes(query) ||
      item.changes.some(c => c.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-matte-black pt-28 pb-20 selection:bg-champagne-gold/30">
      <SEO 
        title="Live System Changelog & Website Updates"
        description="Track real-time deployment history, website upgrades, release dates, exact timestamps down to the minute, and detailed changelogs for the SamaXon platform."
        canonicalPath="/updates"
      />

      <div className="max-w-6xl mx-auto px-6 space-y-16">
        
        {/* 1. Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-matte-black text-soft-ivory border border-champagne-gold/30 text-[11px] font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Public Telemetry & System Changelog</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-matte-black uppercase">
            Website Upgrades & Release History
          </h1>

          <p className="text-sm sm:text-base text-[#595046] leading-relaxed">
            Transparent, minute-by-minute deployment logs documenting when SamaXon was updated, exact calendar dates, days, hours, and complete granular release notes.
          </p>
        </div>

        {/* 2. Primary Spotlight Card: Latest Website Update */}
        {latestUpdate && (
          <div className="relative rounded-3xl p-8 sm:p-10 bg-[#111111] text-white border border-[#D6B46A]/40 shadow-2xl overflow-hidden text-left">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#D6B46A]/10 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              {/* Header tags */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3.5 py-1 rounded-xl bg-[#D6B46A] text-[#111111] text-xs font-mono font-black uppercase tracking-wider">
                    {latestUpdate.version}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider border border-[#D6B46A]/30">
                    {latestUpdate.category}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Latest Update: {formatTimeAgo(latestUpdate.timestamp)}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#D6B46A] uppercase font-bold tracking-widest">
                  Live Production Node
                </div>
              </div>

              {/* Title & Summary */}
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-xl sm:text-3xl font-display font-black text-white leading-tight">
                  {latestUpdate.title}
                </h2>
                <p className="text-sm text-[#D5CEC4] leading-relaxed">
                  {latestUpdate.summary}
                </p>
              </div>

              {/* Timestamp Exact Breakdown (Tareek, Day, Time, Minute) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B46A] font-bold block">
                    Update Date (Tareek)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D6B46A] shrink-0" />
                    <span>{latestUpdate.displayDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B46A] font-bold block">
                    Release Day
                  </span>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {latestUpdate.displayDay}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B46A] font-bold block">
                    Exact Time & Minute
                  </span>
                  <div className="text-sm sm:text-base font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{latestUpdate.displayTime}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B46A] font-bold block">
                    Time Elapsed
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#E5DBCF]">
                    {formatTimeAgo(latestUpdate.timestamp)}
                  </div>
                </div>
              </div>

              {/* Key Highlights of latest update */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] font-bold block">
                  What Changed in this Upgrade:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {latestUpdate.changes.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D5CEC4] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules Footer */}
              {latestUpdate.affectedModules && latestUpdate.affectedModules.length > 0 && (
                <div className="pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 font-bold">
                    Affected Architecture:
                  </span>
                  {latestUpdate.affectedModules.map((mod, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white/80 text-[10px] font-mono font-medium"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Search & Category Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-champagne-gold/20 shadow-sm text-left">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8178]" />
              <input
                type="text"
                placeholder="Search upgrade logs by title, date, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white border border-neutral-200 focus:border-[#D6B46A] rounded-xl text-xs font-medium text-neutral-900 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Releases' },
                { id: 'Feature Release', label: 'Features' },
                { id: 'Core Architecture', label: 'Architecture' },
                { id: 'UI/UX Upgrade', label: 'Design' },
                { id: 'Performance & Speed', label: 'Performance' },
                { id: 'Security Patch', label: 'Security' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-mono uppercase font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-matte-black text-[#D6B46A] shadow'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Complete Chronological Timeline List */}
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#7A7167] font-bold">
                Archived Upgrades & Version History ({filteredUpdates.length})
              </h3>
              <span className="text-[11px] font-mono text-[#8A8178]">
                Auto-Synchronized
              </span>
            </div>

            <div className="space-y-4">
              {filteredUpdates.map((item, index) => {
                const timeAgo = formatTimeAgo(item.timestamp);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-champagne-gold/25 hover:border-champagne-gold/60 shadow-sm hover:shadow-md transition-all space-y-5"
                  >
                    {/* Top Meta Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-matte-black text-soft-ivory font-mono font-bold text-xs">
                          {item.version}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-[#595046] text-[10px] font-mono font-bold uppercase tracking-wider">
                          {item.category}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-lg bg-[#D6B46A]/15 text-[#8B6E23] text-[10px] font-mono font-bold flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>Updated {timeAgo}</span>
                        </span>
                      </div>

                      {/* Tareek & Time Tag */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[#7A7167]">
                        <Calendar className="w-3.5 h-3.5 text-[#D6B46A]" />
                        <span className="font-bold text-neutral-800">{item.displayDate}</span>
                        <span>•</span>
                        <span>{item.displayDay}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{item.displayTime.split('(')[0].trim()}</span>
                      </div>
                    </div>

                    {/* Content Title & Summary */}
                    <div className="space-y-1.5">
                      <h4 className="text-base sm:text-xl font-bold text-matte-black">
                        {item.title}
                      </h4>
                      {item.summary && (
                        <p className="text-xs sm:text-sm text-[#595046] leading-relaxed">
                          {item.summary}
                        </p>
                      )}
                    </div>

                    {/* Exact Changes Bullet Points */}
                    <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-champagne-gold/20 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold block">
                        Changes Implemented ({item.changes.length})
                      </span>
                      <ul className="space-y-2">
                        {item.changes.map((change, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Affected Modules & Publisher */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] font-mono text-[#8A8178] pt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-neutral-400">Modules:</span>
                        {item.affectedModules?.map((mod, mIdx) => (
                          <span key={mIdx} className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px]">
                            {mod}
                          </span>
                        ))}
                      </div>

                      <div className="text-neutral-500">
                        Recorded by: <span className="font-bold text-neutral-800">{item.author}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Bottom Build CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-matte-black text-soft-ivory border border-champagne-gold/30 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Engineering Velocity
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
              Ready to Upgrade Your Digital Architecture?
            </h3>
            <p className="text-xs sm:text-sm text-[#D5CEC4] leading-relaxed">
              We ship enterprise-ready web applications, client portals, and bespoke websites in 48 hours with guaranteed SLA turnaround.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              Start 48-Hour Build
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/edge"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-soft-ivory hover:text-[#D6B46A] border border-white/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Explore SamaXon Edge
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
