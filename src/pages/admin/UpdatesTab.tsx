import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, History, Plus, Edit2, Trash2, CheckCircle2, 
  Sparkles, RefreshCw, Layers, ShieldCheck, Tag, ArrowUpRight,
  Search, Filter, Check, X, AlertCircle, Info, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteUpdateLog } from '../../types';
import { 
  getSiteUpdates, saveSiteUpdates, addSiteUpdate, 
  updateSiteUpdate, deleteSiteUpdate, formatTimeAgo, 
  parseTimestampBreakdown, SITE_UPDATES_EVENT 
} from '../../utils/siteUpdatesManager';
import { useCustomUi } from '../../context/CustomUiContext';

interface UpdatesTabProps {
  currentUser?: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
}

export default function UpdatesTab({ currentUser }: UpdatesTabProps) {
  const { showToast } = useCustomUi();
  const [updates, setUpdates] = useState<WebsiteUpdateLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Real-time ticking system clock
  const [currentClock, setCurrentClock] = useState(parseTimestampBreakdown(new Date()));

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<WebsiteUpdateLog | null>(null);

  // Form states
  const [formVersion, setFormVersion] = useState('v2.5.3');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<WebsiteUpdateLog['category']>('Feature Release');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formHour, setFormHour] = useState(new Date().getHours());
  const [formMinute, setFormMinute] = useState(new Date().getMinutes());
  const [formSecond, setFormSecond] = useState(new Date().getSeconds());
  const [formAuthor, setFormAuthor] = useState(currentUser?.full_name || 'Salman Khan (Lead Architect)');
  const [formSummary, setFormSummary] = useState('');
  const [formChanges, setFormChanges] = useState<string[]>(['']);
  const [formModules, setFormModules] = useState<string>('Home, Navigation');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  // Load updates on mount and bind event listener
  useEffect(() => {
    const load = () => {
      setUpdates(getSiteUpdates());
    };
    load();

    window.addEventListener(SITE_UPDATES_EVENT, load);
    return () => window.removeEventListener(SITE_UPDATES_EVENT, load);
  }, []);

  // Update real-time clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClock(parseTimestampBreakdown(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Open modal for creating new update
  const handleOpenCreateModal = () => {
    const now = new Date();
    const breakdown = parseTimestampBreakdown(now);
    
    // Auto increment version
    const latest = updates[0];
    let nextVersion = 'v2.6.0';
    if (latest && latest.version) {
      const parts = latest.version.replace('v', '').split('.');
      if (parts.length === 3) {
        const patch = parseInt(parts[2], 10) + 1;
        nextVersion = `v${parts[0]}.${parts[1]}.${patch}`;
      }
    }

    setEditingUpdate(null);
    setFormVersion(nextVersion);
    setFormTitle('');
    setFormCategory('Feature Release');
    setFormDate(now.toISOString().split('T')[0]);
    setFormHour(breakdown.exactHour);
    setFormMinute(breakdown.exactMinute);
    setFormSecond(breakdown.exactSecond);
    setFormAuthor(currentUser?.full_name || 'Salman Khan (Executive Lead)');
    setFormSummary('');
    setFormChanges(['', '']);
    setFormModules('Website, Admin Panel');
    setFormStatus('published');
    setIsModalOpen(true);
  };

  // Open modal for editing existing update
  const handleOpenEditModal = (item: WebsiteUpdateLog) => {
    setEditingUpdate(item);
    setFormVersion(item.version);
    setFormTitle(item.title);
    setFormCategory(item.category);
    
    const d = new Date(item.timestamp);
    setFormDate(d.toISOString().split('T')[0]);
    setFormHour(item.exactHour ?? d.getHours());
    setFormMinute(item.exactMinute ?? d.getMinutes());
    setFormSecond(d.getSeconds());
    setFormAuthor(item.author);
    setFormSummary(item.summary);
    setFormChanges(item.changes && item.changes.length > 0 ? [...item.changes] : ['']);
    setFormModules((item.affectedModules || []).join(', '));
    setFormStatus(item.status === 'internal' ? 'draft' : item.status);
    setIsModalOpen(true);
  };

  // Quick helper to fill current exact timestamp into the form
  const handleSetCurrentTimestamp = () => {
    const now = new Date();
    const breakdown = parseTimestampBreakdown(now);
    setFormDate(now.toISOString().split('T')[0]);
    setFormHour(breakdown.exactHour);
    setFormMinute(breakdown.exactMinute);
    setFormSecond(breakdown.exactSecond);
    showToast(`Time set to exact current moment: ${breakdown.formatted12Hour}`, 'info');
  };

  // Dynamic change bullet handlers
  const handleAddChangeBullet = () => {
    setFormChanges(prev => [...prev, '']);
  };

  const handleUpdateChangeBullet = (index: number, val: string) => {
    setFormChanges(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveChangeBullet = (index: number) => {
    setFormChanges(prev => prev.filter((_, i) => i !== index));
  };

  // Save / Submit update
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showToast('Please enter an update title / headline.', 'error');
      return;
    }

    // Filter valid change items
    const validChanges = formChanges.map(c => c.trim()).filter(Boolean);
    if (validChanges.length === 0) {
      showToast('Please add at least one specific change point.', 'error');
      return;
    }

    // Build the exact timestamp
    const dateObj = new Date(formDate);
    dateObj.setHours(formHour);
    dateObj.setMinutes(formMinute);
    dateObj.setSeconds(formSecond);

    const breakdown = parseTimestampBreakdown(dateObj);

    const modulesList = formModules
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    if (editingUpdate) {
      // Updating
      updateSiteUpdate(editingUpdate.id, {
        version: formVersion,
        title: formTitle,
        category: formCategory,
        timestamp: breakdown.iso,
        displayDate: breakdown.displayDate,
        displayDay: breakdown.displayDay,
        displayTime: breakdown.displayTime,
        exactHour: breakdown.exactHour,
        exactMinute: breakdown.exactMinute,
        author: formAuthor,
        summary: formSummary || formTitle,
        changes: validChanges,
        affectedModules: modulesList,
        status: formStatus
      });
      showToast(`Website Update "${formVersion}" updated successfully.`, 'success');
    } else {
      // Adding new
      addSiteUpdate({
        version: formVersion,
        title: formTitle,
        category: formCategory,
        timestamp: breakdown.iso,
        displayDate: breakdown.displayDate,
        displayDay: breakdown.displayDay,
        displayTime: breakdown.displayTime,
        exactHour: breakdown.exactHour,
        exactMinute: breakdown.exactMinute,
        author: formAuthor,
        summary: formSummary || formTitle,
        changes: validChanges,
        affectedModules: modulesList,
        status: formStatus
      });
      showToast(`Website Update "${formVersion}" published to live changelog.`, 'success');
    }

    setIsModalOpen(false);
  };

  // Delete update handler
  const handleDelete = (id: string, version: string) => {
    if (window.confirm(`Are you sure you want to delete update log "${version}"?`)) {
      deleteSiteUpdate(id);
      showToast(`Update log "${version}" deleted.`, 'info');
    }
  };

  // Filtered updates
  const filteredUpdates = updates.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      item.version.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.displayDate.toLowerCase().includes(query) ||
      item.displayDay.toLowerCase().includes(query) ||
      item.displayTime.toLowerCase().includes(query) ||
      item.changes.some(c => c.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const latestUpdate = updates[0];

  return (
    <div className="space-y-8 text-left" id="admin-updates-engine">
      {/* 1. Header Bar with Real-Time Clock & Action */}
      <div className="bg-gradient-to-r from-[#111111] via-[#1A1A1A] to-[#111111] p-6 sm:p-8 rounded-3xl border border-[#D6B46A]/25 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6B46A]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Production Changelog Engine
              </span>
              <span className="text-white/40 text-xs font-mono">•</span>
              <span className="text-white/60 text-xs font-mono">Minute-Precision Auditing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              Website Updates & Upgrade History
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
              Real-time chronological timeline tracking when the website was updated, exact date, day, hour and minute, and full granular change points.
            </p>
          </div>

          {/* Action Button & Live Clock */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Live Clock Chip */}
            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-left">
              <Clock className="w-4 h-4 text-[#D6B46A] shrink-0 animate-spin-slow" />
              <div>
                <div className="text-[10px] font-mono uppercase text-[#D6B46A] font-bold tracking-wider">
                  Live System Clock
                </div>
                <div className="text-xs font-mono text-white font-bold tracking-wider">
                  {currentClock.displayDay}, {currentClock.displayDate} · <span className="text-emerald-400">{currentClock.formatted12Hour}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Record Website Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Kitni der pehle update hui thi */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8A8178]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Last Upgraded</span>
            <Clock className="w-4 h-4 text-[#D6B46A]" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-[#111111]">
            {latestUpdate ? formatTimeAgo(latestUpdate.timestamp) : 'N/A'}
          </div>
          <p className="text-[11px] text-[#8A8178]">
            Kitni der pehle website update hui thi
          </p>
        </div>

        {/* Metric 2: Kaunsi tareek ko update hui thi */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8A8178]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Exact Date</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-[#111111]">
            {latestUpdate ? latestUpdate.displayDate : 'N/A'}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            {latestUpdate ? `${latestUpdate.displayDay}` : 'N/A'}
          </p>
        </div>

        {/* Metric 3: Kis time / kitne baje / kitni minute pe */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8A8178]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Exact Time & Minute</span>
            <Sparkles className="w-4 h-4 text-[#D6B46A]" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-[#111111]">
            {latestUpdate ? latestUpdate.displayTime.split('(')[0].trim() : 'N/A'}
          </div>
          <p className="text-[11px] text-[#8A8178] font-mono">
            {latestUpdate ? `Hour: ${latestUpdate.exactHour} · Minute: ${latestUpdate.exactMinute}` : 'N/A'}
          </p>
        </div>

        {/* Metric 4: Total Logged Releases & Version */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6B46A]/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8A8178]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Active Version</span>
            <Layers className="w-4 h-4 text-[#111111]" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-[#111111] flex items-center gap-2">
            {latestUpdate ? latestUpdate.version : 'v2.5.0'}
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>
          <p className="text-[11px] text-[#8A8178]">
            {updates.length} total releases logged
          </p>
        </div>
      </div>

      {/* 3. Search and Category Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search updates by version, date, keyword, or change item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white border border-neutral-200 focus:border-[#D6B46A] rounded-xl text-xs font-medium text-neutral-900 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'Feature Release', label: 'Features' },
            { id: 'UI/UX Upgrade', label: 'Design' },
            { id: 'Core Architecture', label: 'Architecture' },
            { id: 'Performance & Speed', label: 'Speed' },
            { id: 'Security Patch', label: 'Security' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-[11px] font-mono uppercase font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#111111] text-[#D6B46A] shadow'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chronological Updates Timeline / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono uppercase tracking-widest font-black text-neutral-600">
            Complete Changelog Audit History ({filteredUpdates.length})
          </h3>
          <span className="text-[11px] text-neutral-500 font-mono">
            Chronological Order · High Precision
          </span>
        </div>

        {filteredUpdates.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-neutral-300 space-y-3">
            <Info className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No matching updates found</p>
            <p className="text-xs text-neutral-500">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUpdates.map((item, index) => {
              const timeAgo = formatTimeAgo(item.timestamp);
              const isLatest = index === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 sm:p-7 rounded-3xl bg-white border transition-all hover:shadow-md ${
                    isLatest 
                      ? 'border-[#D6B46A]/50 ring-2 ring-[#D6B46A]/15 shadow-sm' 
                      : 'border-neutral-200/80'
                  }`}
                >
                  {/* Top Bar: Version, Time badges & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Version Pill */}
                      <span className="px-3 py-1 rounded-xl bg-[#111111] text-[#D6B46A] font-mono font-black text-xs tracking-wider">
                        {item.version}
                      </span>

                      {/* Category Pill */}
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider ${
                        item.category === 'Feature Release'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : item.category === 'UI/UX Upgrade'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : item.category === 'Core Architecture'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : item.category === 'Performance & Speed'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}>
                        {item.category}
                      </span>

                      {/* Kitni der pehle badge */}
                      <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#D6B46A]" />
                        <span>{timeAgo}</span>
                      </span>

                      {isLatest && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-mono font-black uppercase tracking-wider">
                          Current Live Release
                        </span>
                      )}
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
                        title="Edit update details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.version)}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-700 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete update entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="py-4 space-y-2">
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                      {item.title}
                    </h4>
                    {item.summary && (
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {/* Comprehensive Timestamp Breakdown Card (Tareek, Day, Time, Baje, Minute) */}
                  <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D6B46A]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] block font-bold">
                        Date (Tareek)
                      </span>
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D6B46A]" />
                        {item.displayDate}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] block font-bold">
                        Day (Din)
                      </span>
                      <span className="font-bold text-neutral-900">
                        {item.displayDay}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] block font-bold">
                        Exact Time (Baje & Minute)
                      </span>
                      <span className="font-bold text-emerald-700 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {item.displayTime}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] block font-bold">
                        Publisher
                      </span>
                      <span className="font-bold text-neutral-800 truncate block">
                        {item.author}
                      </span>
                    </div>
                  </div>

                  {/* Detailed list of changes ("usmein kya-kya changes hue the") */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8178] font-bold block">
                      Granular Changes & Upgrades ({item.changes.length})
                    </span>
                    <ul className="space-y-1.5">
                      {item.changes.map((change, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Affected Modules Footer */}
                  {item.affectedModules && item.affectedModules.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                        Modules Affected:
                      </span>
                      {item.affectedModules.map((mod, mIdx) => (
                        <span 
                          key={mIdx}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-mono font-medium"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl border border-[#D6B46A]/40 shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 bg-[#111111] text-white flex items-center justify-between border-b border-[#D6B46A]/20">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
                      {editingUpdate ? 'Modify Log' : 'New Deployment'}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-black text-white">
                    {editingUpdate ? `Edit Update ${editingUpdate.version}` : 'Record Website Upgrade'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSubmitForm} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Version & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                      Version Code (e.g. v2.5.3) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formVersion}
                      onChange={(e) => setFormVersion(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold text-neutral-900 outline-none focus:border-[#D6B46A]"
                      placeholder="v2.5.3"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                      Upgrade Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 outline-none focus:border-[#D6B46A]"
                    >
                      <option value="Feature Release">Feature Release</option>
                      <option value="UI/UX Upgrade">UI/UX Upgrade</option>
                      <option value="Core Architecture">Core Architecture</option>
                      <option value="Performance & Speed">Performance & Speed</option>
                      <option value="Security Patch">Security Patch</option>
                      <option value="Bug Fix">Bug Fix</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                    Update Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#D6B46A]"
                    placeholder="e.g. Partner Commission Engine & Buyer's Intelligence Suite"
                  />
                </div>

                {/* Exact Date & Time Controls with Instant Right Now Button */}
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D6B46A]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-700 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D6B46A]" />
                      Exact Date, Time, Hour & Minute
                    </span>
                    <button
                      type="button"
                      onClick={handleSetCurrentTimestamp}
                      className="px-2.5 py-1 bg-[#D6B46A]/20 hover:bg-[#D6B46A]/30 text-[#8B6E23] text-[10px] font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Set Exact Current Time
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-500 font-bold">
                        Date (Tareek)
                      </label>
                      <input
                        type="date"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-500 font-bold">
                        Hour (0-23)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={23}
                        required
                        value={formHour}
                        onChange={(e) => setFormHour(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-neutral-900 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-neutral-500 font-bold">
                        Minute (0-59)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        required
                        value={formMinute}
                        onChange={(e) => setFormMinute(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-neutral-900 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Author & Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                      Publisher / Author
                    </label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none"
                      placeholder="e.g. Salman Khan (Lead Architect)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                      Affected Modules (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formModules}
                      onChange={(e) => setFormModules(e.target.value)}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none"
                      placeholder="e.g. Partner Hub, Buyer Guides, Navbar"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                    Summary Overview
                  </label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none resize-none"
                    placeholder="Brief description of this deployment..."
                  />
                </div>

                {/* Specific Change Points ("usmein kya-kya changes hue the") */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 font-bold">
                      Detailed Changes List (Har ek change point) *
                    </label>
                    <button
                      type="button"
                      onClick={handleAddChangeBullet}
                      className="text-[11px] font-mono text-[#8B6E23] hover:text-[#5C4814] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Change Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formChanges.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-neutral-400 w-5 text-center">
                          {bIdx + 1}.
                        </span>
                        <input
                          type="text"
                          required
                          value={bullet}
                          onChange={(e) => handleUpdateChangeBullet(bIdx, e.target.value)}
                          placeholder={`Change point #${bIdx + 1} (e.g. Added real-time tier calculator)`}
                          className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none focus:border-[#D6B46A]"
                        />
                        {formChanges.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveChangeBullet(bIdx)}
                            className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      Publish to Live Website
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Show in the public changelog and update tracker
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStatus('published')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formStatus === 'published'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      Published
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStatus('draft')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formStatus === 'draft'
                          ? 'bg-neutral-800 text-white shadow'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      Draft / Internal
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingUpdate ? 'Save Changes' : 'Record & Publish Upgrade'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
