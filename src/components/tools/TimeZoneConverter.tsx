import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Clock, Globe, ArrowRightLeft, Calendar, Copy, Check, 
  RefreshCw, Sparkles, ShieldCheck, HelpCircle, ArrowRight,
  Search, ChevronDown, CheckCircle2, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomUi } from '../../context/CustomUiContext';

interface TimeZoneItem {
  id: string; // IANA identifier, e.g. "America/New_York"
  city: string;
  country: string;
  region: string;
  standardAbbr: string;
}

const POPULAR_TIMEZONES: TimeZoneItem[] = [
  { id: 'Asia/Kolkata', city: 'New Delhi / Mumbai', country: 'India', region: 'Asia', standardAbbr: 'IST' },
  { id: 'America/New_York', city: 'New York / Eastern', country: 'United States', region: 'Americas', standardAbbr: 'EST/EDT' },
  { id: 'America/Chicago', city: 'Chicago / Central', country: 'United States', region: 'Americas', standardAbbr: 'CST/CDT' },
  { id: 'America/Denver', city: 'Denver / Mountain', country: 'United States', region: 'Americas', standardAbbr: 'MST/MDT' },
  { id: 'America/Los_Angeles', city: 'Los Angeles / Pacific', country: 'United States', region: 'Americas', standardAbbr: 'PST/PDT' },
  { id: 'Europe/London', city: 'London', country: 'United Kingdom', region: 'Europe', standardAbbr: 'GMT/BST' },
  { id: 'Europe/Paris', city: 'Paris', country: 'France', region: 'Europe', standardAbbr: 'CET/CEST' },
  { id: 'Europe/Berlin', city: 'Berlin / Frankfurt', country: 'Germany', region: 'Europe', standardAbbr: 'CET/CEST' },
  { id: 'Asia/Dubai', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', standardAbbr: 'GST' },
  { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', region: 'Asia', standardAbbr: 'SGT' },
  { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', region: 'Asia', standardAbbr: 'JST' },
  { id: 'Australia/Sydney', city: 'Sydney / Melbourne', country: 'Australia', region: 'Oceania', standardAbbr: 'AEST/AEDT' },
  { id: 'Australia/Perth', city: 'Perth', country: 'Australia', region: 'Oceania', standardAbbr: 'AWST' },
  { id: 'America/Toronto', city: 'Toronto', country: 'Canada', region: 'Americas', standardAbbr: 'EST/EDT' },
  { id: 'America/Vancouver', city: 'Vancouver', country: 'Canada', region: 'Americas', standardAbbr: 'PST/PDT' },
  { id: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia', standardAbbr: 'HKT' },
  { id: 'Asia/Shanghai', city: 'Beijing / Shanghai', country: 'China', region: 'Asia', standardAbbr: 'CST' },
  { id: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands', region: 'Europe', standardAbbr: 'CET/CEST' },
  { id: 'Europe/Zurich', city: 'Zurich / Geneva', country: 'Switzerland', region: 'Europe', standardAbbr: 'CET/CEST' },
  { id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa', region: 'Africa', standardAbbr: 'SAST' },
  { id: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil', region: 'Americas', standardAbbr: 'BRT' },
  { id: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', region: 'Oceania', standardAbbr: 'NZST/NZDT' },
  { id: 'UTC', city: 'UTC / Universal Coordinated', country: 'International', region: 'UTC', standardAbbr: 'UTC' }
];

const MULTI_HUB_ZONES = [
  { id: 'America/New_York', name: 'New York (EDT/EST)' },
  { id: 'Europe/London', name: 'London (BST/GMT)' },
  { id: 'Europe/Berlin', name: 'Berlin (CEST/CET)' },
  { id: 'Asia/Dubai', name: 'Dubai (GST)' },
  { id: 'Asia/Kolkata', name: 'New Delhi (IST)' },
  { id: 'Asia/Singapore', name: 'Singapore (SGT)' },
  { id: 'Asia/Tokyo', name: 'Tokyo (JST)' },
  { id: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)' }
];

export default function TimeZoneConverter() {
  const { showToast } = useCustomUi();

  // Selected state
  const [sourceZone, setSourceZone] = useState<string>('Asia/Kolkata');
  const [targetZone, setTargetZone] = useState<string>('America/New_York');

  // Date and Time inputs
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const [dateStr, setDateStr] = useState<string>(
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  );
  const [hours, setHours] = useState<string>(pad(now.getHours()));
  const [minutes, setMinutes] = useState<string>(pad(Math.floor(now.getMinutes() / 5) * 5));
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Dropdown search states
  const [sourceSearch, setSourceSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);

  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  const targetDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(e.target as Node)) {
        setSourceDropdownOpen(false);
      }
      if (targetDropdownRef.current && !targetDropdownRef.current.contains(e.target as Node)) {
        setTargetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered lists
  const filteredSourceZones = useMemo(() => {
    const q = sourceSearch.toLowerCase().trim();
    if (!q) return POPULAR_TIMEZONES;
    return POPULAR_TIMEZONES.filter(
      z => z.city.toLowerCase().includes(q) || z.country.toLowerCase().includes(q) || z.id.toLowerCase().includes(q) || z.standardAbbr.toLowerCase().includes(q)
    );
  }, [sourceSearch]);

  const filteredTargetZones = useMemo(() => {
    const q = targetSearch.toLowerCase().trim();
    if (!q) return POPULAR_TIMEZONES;
    return POPULAR_TIMEZONES.filter(
      z => z.city.toLowerCase().includes(q) || z.country.toLowerCase().includes(q) || z.id.toLowerCase().includes(q) || z.standardAbbr.toLowerCase().includes(q)
    );
  }, [targetSearch]);

  // Helper to format UTC offset for any IANA time zone at the selected date/time
  const getZoneOffsetDetails = (ianaZone: string, refDate: Date) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: ianaZone,
        timeZoneName: 'shortOffset'
      });
      const parts = formatter.formatToParts(refDate);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      return offsetPart ? offsetPart.value : 'UTC';
    } catch {
      return 'UTC';
    }
  };

  // Helper to get formatted components in a specific time zone
  const getZonedParts = (date: Date, ianaZone: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: ianaZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: !use24Hour,
        timeZoneName: 'short'
      });
      return formatter.format(date);
    } catch {
      return date.toLocaleString();
    }
  };

  // Conversion computation
  const conversionResult = useMemo(() => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const h = parseInt(hours, 10) || 0;
      const m = parseInt(minutes, 10) || 0;

      // Construct instant using Intl approximation
      // In JS, to construct a Date that represents year, month, day, h, m in sourceZone:
      const utcString = `${year}-${pad(month)}-${pad(day)}T${pad(h)}:${pad(m)}:00Z`;
      const tempDate = new Date(utcString);

      // Determine offset difference between sourceZone and UTC
      const sourceFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: sourceZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      const parts = sourceFormatter.formatToParts(tempDate);
      const getVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      const zonedY = getVal('year');
      const zonedM = getVal('month');
      const zonedD = getVal('day');
      const zonedH = getVal('hour');
      const zonedMin = getVal('minute');

      const zonedAsUtc = Date.UTC(zonedY, zonedM - 1, zonedD, zonedH, zonedMin, 0);
      const diffMs = zonedAsUtc - tempDate.getTime();
      const actualSourceInstant = new Date(Date.UTC(year, month - 1, day, h, m, 0) - diffMs);

      // Source details
      const sourceOffset = getZoneOffsetDetails(sourceZone, actualSourceInstant);
      const targetOffset = getZoneOffsetDetails(targetZone, actualSourceInstant);

      // Formatter for full display
      const makeFormatter = (zone: string) => new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: !use24Hour,
        timeZoneName: 'short'
      });

      const sourceDisplay = makeFormatter(sourceZone).format(actualSourceInstant);
      const targetDisplay = makeFormatter(targetZone).format(actualSourceInstant);

      // Compute day comparison
      const dayFormatter = (zone: string) => new Intl.DateTimeFormat('en-CA', {
        timeZone: zone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(actualSourceInstant);

      const sourceDayStr = dayFormatter(sourceZone);
      const targetDayStr = dayFormatter(targetZone);

      let dayDifference: 'same' | 'next' | 'previous' = 'same';
      if (targetDayStr > sourceDayStr) dayDifference = 'next';
      else if (targetDayStr < sourceDayStr) dayDifference = 'previous';

      // Parse offset hour difference
      const parseOffsetMinutes = (offStr: string): number => {
        const match = offStr.match(/GMT([+-])(\d+)(?::(\d+))?/i);
        if (!match) return 0;
        const sign = match[1] === '-' ? -1 : 1;
        const h = parseInt(match[2], 10);
        const m = match[3] ? parseInt(match[3], 10) : 0;
        return sign * (h * 60 + m);
      };

      const sourceOffsetMin = parseOffsetMinutes(sourceOffset);
      const targetOffsetMin = parseOffsetMinutes(targetOffset);
      const totalDiffMinutes = targetOffsetMin - sourceOffsetMin;

      const diffHours = Math.floor(Math.abs(totalDiffMinutes) / 60);
      const diffRemMinutes = Math.abs(totalDiffMinutes) % 60;
      let diffExplanation = '';
      if (totalDiffMinutes === 0) {
        diffExplanation = 'Both zones have the identical local time.';
      } else {
        const direction = totalDiffMinutes > 0 ? 'ahead of' : 'behind';
        diffExplanation = `Destination is ${diffHours}h ${diffRemMinutes > 0 ? `${diffRemMinutes}m ` : ''}${direction} Source.`;
      }

      return {
        valid: true,
        sourceDisplay,
        targetDisplay,
        sourceOffset,
        targetOffset,
        dayDifference,
        diffExplanation,
        actualSourceInstant
      };
    } catch {
      return {
        valid: false,
        sourceDisplay: '',
        targetDisplay: '',
        sourceOffset: '',
        targetOffset: '',
        dayDifference: 'same',
        diffExplanation: '',
        actualSourceInstant: new Date()
      };
    }
  }, [dateStr, hours, minutes, sourceZone, targetZone, use24Hour]);

  // Quick actions
  const handleSwap = () => {
    const prevSource = sourceZone;
    setSourceZone(targetZone);
    setTargetZone(prevSource);
    showToast('Source and Destination zones swapped', 'info');
  };

  const handleSetCurrentTime = () => {
    const current = new Date();
    setDateStr(`${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`);
    setHours(pad(current.getHours()));
    setMinutes(pad(Math.floor(current.getMinutes() / 5) * 5));
    showToast('Updated to current local time', 'success');
  };

  const handleCopySummary = async () => {
    if (!conversionResult.valid) return;
    const summary = [
      `Source (${sourceZone}): ${conversionResult.sourceDisplay} (${conversionResult.sourceOffset})`,
      `Destination (${targetZone}): ${conversionResult.targetDisplay} (${conversionResult.targetOffset})`,
      `Disparity: ${conversionResult.diffExplanation}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      showToast('Time conversion summary copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const sourceZoneObj = POPULAR_TIMEZONES.find(z => z.id === sourceZone) || {
    id: sourceZone,
    city: sourceZone.split('/')[1] || sourceZone,
    country: sourceZone.split('/')[0] || '',
    region: '',
    standardAbbr: ''
  };

  const targetZoneObj = POPULAR_TIMEZONES.find(z => z.id === targetZone) || {
    id: targetZone,
    city: targetZone.split('/')[1] || targetZone,
    country: targetZone.split('/')[0] || '',
    region: '',
    standardAbbr: ''
  };

  return (
    <div className="space-y-12 text-left" id="time-zone-converter-tool">
      {/* Header & Subtitle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
            GLOBAL TIME & PRODUCTIVITY
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D6B46A]/15 text-[#A68936] text-[11px] font-mono font-bold rounded-md border border-[#D6B46A]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A68936]" />
            100% In-Browser · Accurate Daylight Saving (DST)
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111111] tracking-tight">
          Time Zone Converter
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
          Convert exact dates and times across international time zones with accurate Daylight Saving Time adjustments. Compare team working hours and schedule cross-border meetings with zero friction.
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Top Controls: Use Current Time + 12h/24h toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="px-3.5 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold rounded-xl border border-[#D6B46A]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Use Current Time</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUse24Hour(!use24Hour)}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer"
            >
              Format: {use24Hour ? '24-Hour' : '12-Hour (AM/PM)'}
            </button>
          </div>
        </div>

        {/* Date and Time Input Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#A68936]" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936]"
            />
          </div>

          {/* Hour Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#A68936]" />
              <span>Hour (00 - 23)</span>
            </label>
            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] cursor-pointer"
            >
              {Array.from({ length: 24 }).map((_, i) => {
                const val = pad(i);
                const displayH = use24Hour 
                  ? `${val}:00` 
                  : `${i % 12 === 0 ? 12 : i % 12} ${i >= 12 ? 'PM' : 'AM'} (${val}:00)`;
                return <option key={val} value={val}>{displayH}</option>;
              })}
            </select>
          </div>

          {/* Minute Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#A68936]" />
              <span>Minute</span>
            </label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] cursor-pointer"
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
                const val = pad(m);
                return <option key={val} value={val}>:{val}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Source & Destination Zone Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Source Time Zone Selector (5 cols) */}
          <div className="md:col-span-5 relative" ref={sourceDropdownRef}>
            <label className="text-xs font-bold text-neutral-900 mb-1.5 block">
              Source Time Zone (From)
            </label>
            <button
              type="button"
              onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
              className="w-full p-3.5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl text-left flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <div className="font-bold text-sm text-neutral-900">{sourceZoneObj.city}</div>
                <div className="text-[11px] font-mono text-neutral-500">
                  {sourceZoneObj.country} · {conversionResult.sourceOffset || 'UTC'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {/* Custom Searchable Dropdown */}
            {sourceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 space-y-2 max-h-72 flex flex-col">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={sourceSearch}
                    onChange={(e) => setSourceSearch(e.target.value)}
                    placeholder="Search city, country, or code..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936]"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto space-y-1 flex-1">
                  {filteredSourceZones.map(z => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => {
                        setSourceZone(z.id);
                        setSourceDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        sourceZone === z.id ? 'bg-[#111111] text-[#D6B46A]' : 'hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{z.city}</div>
                        <div className={`text-[10px] ${sourceZone === z.id ? 'text-[#D6B46A]/80' : 'text-neutral-400'}`}>
                          {z.country} · {z.standardAbbr}
                        </div>
                      </div>
                      {sourceZone === z.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button (1 col) */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 bg-neutral-100 hover:bg-[#111111] hover:text-[#D6B46A] border border-neutral-200 rounded-2xl transition-all cursor-pointer shadow-sm active:scale-90"
              title="Swap Source and Destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Time Zone Selector (5 cols) */}
          <div className="md:col-span-5 relative" ref={targetDropdownRef}>
            <label className="text-xs font-bold text-neutral-900 mb-1.5 block">
              Destination Time Zone (To)
            </label>
            <button
              type="button"
              onClick={() => setTargetDropdownOpen(!targetDropdownOpen)}
              className="w-full p-3.5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl text-left flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <div className="font-bold text-sm text-neutral-900">{targetZoneObj.city}</div>
                <div className="text-[11px] font-mono text-neutral-500">
                  {targetZoneObj.country} · {conversionResult.targetOffset || 'UTC'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {/* Custom Searchable Dropdown */}
            {targetDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 space-y-2 max-h-72 flex flex-col">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={targetSearch}
                    onChange={(e) => setTargetSearch(e.target.value)}
                    placeholder="Search city, country, or code..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936]"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto space-y-1 flex-1">
                  {filteredTargetZones.map(z => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => {
                        setTargetZone(z.id);
                        setTargetDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        targetZone === z.id ? 'bg-[#111111] text-[#D6B46A]' : 'hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{z.city}</div>
                        <div className={`text-[10px] ${targetZone === z.id ? 'text-[#D6B46A]/80' : 'text-neutral-400'}`}>
                          {z.country} · {z.standardAbbr}
                        </div>
                      </div>
                      {targetZone === z.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Big Converted Result Display Card */}
        <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-3xl border border-neutral-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-[#D6B46A] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Converted Result
            </span>

            {/* Day difference badge */}
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
              conversionResult.dayDifference === 'same'
                ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                : conversionResult.dayDifference === 'next'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : 'bg-amber-950/80 text-amber-400 border-amber-800'
            }`}>
              {conversionResult.dayDifference === 'same' 
                ? 'Same Calendar Day' 
                : conversionResult.dayDifference === 'next' 
                ? 'Next Calendar Day (+1 Day)' 
                : 'Previous Calendar Day (-1 Day)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Display */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                {sourceZoneObj.city} ({conversionResult.sourceOffset})
              </span>
              <div className="text-xl sm:text-2xl font-bold font-display text-white">
                {conversionResult.sourceDisplay}
              </div>
            </div>

            {/* Target Display */}
            <div className="p-4 bg-[#D6B46A]/10 rounded-2xl border border-[#D6B46A]/30 space-y-1">
              <span className="text-[11px] font-mono text-[#D6B46A] uppercase font-bold">
                {targetZoneObj.city} ({conversionResult.targetOffset})
              </span>
              <div className="text-xl sm:text-2xl font-bold font-display text-[#D6B46A]">
                {conversionResult.targetDisplay}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <span className="text-xs font-mono text-neutral-300">
              {conversionResult.diffExplanation}
            </span>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Business Hub Multi-City Quick Comparison Grid */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#A68936]" />
            Simultaneous Multi-City Office Time Matrix
          </h3>
          <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">Based on Selected Instant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MULTI_HUB_ZONES.map(hub => {
            const timeFormatted = getZonedParts(conversionResult.actualSourceInstant, hub.id);
            const isSelected = hub.id === sourceZone || hub.id === targetZone;

            return (
              <div
                key={hub.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-[#FFFDF8] border-[#D6B46A] shadow-sm' 
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <span className="text-xs font-bold text-neutral-900 block truncate">
                  {hub.name}
                </span>
                <span className="font-mono text-xs text-neutral-600 mt-1 block">
                  {timeFormatted}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">How does this tool handle Daylight Saving Time (DST)?</p>
            <p className="text-neutral-600 mt-1">
              The converter leverages the browser’s native IANA time zone database (tzdb) through <code>Intl.DateTimeFormat</code>. Because time is calculated against the selected calendar date, summer vs winter clock shifts (e.g. EST to EDT, GMT to BST) are calculated automatically and 100% accurately.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">What is the difference between UTC and GMT?</p>
            <p className="text-neutral-600 mt-1">
              UTC (Coordinated Universal Time) is the scientific atomic time standard used internationally. GMT (Greenwich Mean Time) is an actual geographic time zone used in the UK and parts of Europe/Africa during the winter months. For practical calculation purposes, UTC+00:00 and GMT share the exact same offset.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Does this tool track or send my location?</p>
            <p className="text-neutral-600 mt-1">
              No. When clicking "Use Current Time", the application reads the local system clock on your device. No geolocation permissions are requested, and zero data is sent to our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Recommendations */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-[#A68936] font-bold uppercase tracking-wider">Related Productivity Tools</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            to="/tools/age-calculator"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Age Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Calculate precision chronological milestones and birthdays.</p>
          </Link>

          <Link
            to="/tools/website-project-scope-builder"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Project Scope Builder</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Estimate timelines and sprint allocations across time zones.</p>
          </Link>

          <Link
            to="/tools/calculator"
            className="p-3 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Universal Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Scientific, financial, and unit conversions engine.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
