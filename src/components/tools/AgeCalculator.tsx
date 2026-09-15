import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, Cake, Sparkles, RefreshCw, 
  ShieldCheck, AlertCircle, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalYears: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  nextBirthdayDate: Date;
  daysUntilNextBirthday: number;
  monthsUntilNextBirthday: number;
  nextBirthdayWeekday: string;
  birthWeekday: string;
  referenceWeekday: string;
  isBirthdayToday: boolean;
  isLeapYearBirth: boolean;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to determine if year is leap year
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Days in month
function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate();
}

export default function AgeCalculator() {
  const { showToast } = useCustomUi();

  // Today's date formatted as YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [birthDateStr, setBirthDateStr] = useState<string>('2000-01-01');
  const [referenceDateStr, setReferenceDateStr] = useState<string>(todayStr);
  const [feb29Convention, setFeb29Convention] = useState<'feb28' | 'mar1'>('feb28');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Validation
  const validationError = useMemo<string | null>(() => {
    if (!birthDateStr) return 'Please enter your date of birth.';
    if (!referenceDateStr) return 'Please select a reference date.';

    const birth = new Date(birthDateStr + 'T00:00:00');
    const ref = new Date(referenceDateStr + 'T00:00:00');

    if (isNaN(birth.getTime())) return 'Date of birth is invalid.';
    if (isNaN(ref.getTime())) return 'Reference date is invalid.';

    if (birth > ref) {
      return 'Choose a reference date that is on or after the date of birth.';
    }

    if (birth.getFullYear() < 1900) {
      return 'Please enter a birth year after 1900.';
    }

    return null;
  }, [birthDateStr, referenceDateStr]);

  // Comprehensive age calculation
  const calculation = useMemo<AgeBreakdown | null>(() => {
    if (validationError) return null;

    const birth = new Date(birthDateStr + 'T00:00:00');
    const ref = new Date(referenceDateStr + 'T00:00:00');

    const birthYear = birth.getFullYear();
    const birthMonth = birth.getMonth(); // 0-11
    const birthDay = birth.getDate();

    const refYear = ref.getFullYear();
    const refMonth = ref.getMonth();
    const refDay = ref.getDate();

    const isLeapBirth = birthMonth === 1 && birthDay === 29;

    // 1. Calculate Exact Years, Months, Days
    let years = refYear - birthYear;
    let months = refMonth - birthMonth;
    let days = refDay - birthDay;

    if (days < 0) {
      // Borrow days from previous month
      months -= 1;
      const prevMonth = refMonth === 0 ? 11 : refMonth - 1;
      const prevYear = refMonth === 0 ? refYear - 1 : refYear;
      days += getDaysInMonth(prevYear, prevMonth);
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // 2. Total Days and Hours
    const diffTimeMs = ref.getTime() - birth.getTime();
    const totalDays = Math.floor(diffTimeMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMonths = years * 12 + months;

    // 3. Next Birthday Calculation
    let nextBdayYear = refYear;
    let targetMonth = birthMonth;
    let targetDay = birthDay;

    // If born on Feb 29 and target year is not leap year
    if (isLeapBirth && !isLeapYear(nextBdayYear)) {
      if (feb29Convention === 'mar1') {
        targetMonth = 2; // March
        targetDay = 1;
      } else {
        targetMonth = 1; // February
        targetDay = 28;
      }
    }

    let nextBirthday = new Date(nextBdayYear, targetMonth, targetDay);

    // If birthday already passed in refYear, move to next year
    if (nextBirthday < ref) {
      nextBdayYear += 1;
      if (isLeapBirth && !isLeapYear(nextBdayYear)) {
        if (feb29Convention === 'mar1') {
          targetMonth = 2;
          targetDay = 1;
        } else {
          targetMonth = 1;
          targetDay = 28;
        }
      } else if (isLeapBirth) {
        targetMonth = 1;
        targetDay = 29;
      }
      nextBirthday = new Date(nextBdayYear, targetMonth, targetDay);
    }

    const isBirthdayToday = (birthMonth === refMonth && birthDay === refDay) ||
      (isLeapBirth && !isLeapYear(refYear) && (
        (feb29Convention === 'feb28' && refMonth === 1 && refDay === 28) ||
        (feb29Convention === 'mar1' && refMonth === 2 && refDay === 1)
      ));

    const diffToNextBdayMs = nextBirthday.getTime() - ref.getTime();
    const daysUntilNextBirthday = Math.ceil(diffToNextBdayMs / (1000 * 60 * 60 * 24));
    const monthsUntilNextBirthday = Math.floor(daysUntilNextBirthday / 30.4375);

    return {
      years,
      months,
      days,
      totalYears: years,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      nextBirthdayDate: nextBirthday,
      daysUntilNextBirthday,
      monthsUntilNextBirthday,
      nextBirthdayWeekday: WEEKDAYS[nextBirthday.getDay()],
      birthWeekday: WEEKDAYS[birth.getDay()],
      referenceWeekday: WEEKDAYS[ref.getDay()],
      isBirthdayToday,
      isLeapYearBirth: isLeapBirth
    };
  }, [birthDateStr, referenceDateStr, feb29Convention, validationError]);

  // Copy Summary
  const handleCopySummary = async () => {
    if (!calculation) return;
    const summary = `Age Calculation: ${calculation.years} years, ${calculation.months} months, and ${calculation.days} days old. Total days lived: ${calculation.totalDays.toLocaleString()}. Born on a ${calculation.birthWeekday}. Next birthday in ${calculation.daysUntilNextBirthday} days (${calculation.nextBirthdayWeekday}).`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      showToast('Age summary copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  // Reset
  const handleReset = () => {
    setBirthDateStr('2000-01-01');
    setReferenceDateStr(todayStr);
    setFeb29Convention('feb28');
    showToast('Reset to default dates.', 'info');
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto" id="age-calculator-tool">
      {/* 1. Header & Privacy Note */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-[#111111] text-[#D6B46A] rounded-lg">
            <Calendar className="w-5 h-5" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display">
            Age Calculator
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#554F49]">
          Calculate your exact age in years, months, and days, count down to your next birthday, and explore date milestones.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-md w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side: Dates are calculated strictly in your browser. Personal dates are never sent to a server or stored.</span>
        </div>
      </div>

      {/* 2. Main Workspace Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Date Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Date of Birth */}
          <div className="space-y-2">
            <label htmlFor="birth-date" className="block text-xs font-bold font-mono uppercase tracking-wider text-[#111111]">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="birth-date"
                type="date"
                value={birthDateStr}
                max={todayStr}
                onChange={(e) => setBirthDateStr(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-sm sm:text-base text-[#111111] focus:outline-none focus:border-[#A68936] focus:bg-white"
              />
            </div>
            {calculation && (
              <p className="text-xs text-neutral-500 font-mono">
                Born on a <span className="font-bold text-neutral-800">{calculation.birthWeekday}</span>
              </p>
            )}
          </div>

          {/* Reference Date */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="ref-date" className="block text-xs font-bold font-mono uppercase tracking-wider text-[#111111]">
                Calculate Age On <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setReferenceDateStr(todayStr)}
                className="text-xs text-[#A68936] hover:underline font-mono cursor-pointer"
              >
                Set to Today
              </button>
            </div>
            <div className="relative">
              <input
                id="ref-date"
                type="date"
                value={referenceDateStr}
                onChange={(e) => setReferenceDateStr(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-sm sm:text-base text-[#111111] focus:outline-none focus:border-[#A68936] focus:bg-white"
              />
            </div>
            {calculation && (
              <p className="text-xs text-neutral-500 font-mono">
                Reference day: <span className="font-bold text-neutral-800">{calculation.referenceWeekday}</span>
              </p>
            )}
          </div>
        </div>

        {/* Leap Year Feb 29 Birthday Notice & Convention */}
        {calculation?.isLeapYearBirth && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Cake className="w-4 h-4 text-amber-700" />
              <span>Leap Year Birthday Detected (February 29)</span>
            </div>
            <p>
              In non-leap years, February has only 28 days. Choose your preferred convention for calculating upcoming birthdays:
            </p>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="feb29Convention"
                  checked={feb29Convention === 'feb28'}
                  onChange={() => setFeb29Convention('feb28')}
                  className="accent-[#A68936]"
                />
                <span>Celebrate on February 28</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="feb29Convention"
                  checked={feb29Convention === 'mar1'}
                  onChange={() => setFeb29Convention('mar1')}
                  className="accent-[#A68936]"
                />
                <span>Celebrate on March 1</span>
              </label>
            </div>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        {/* Primary Result Banner */}
        {calculation && (
          <div className="space-y-4 pt-2">
            {calculation.isBirthdayToday && (
              <div className="p-4 bg-[#D6B46A]/20 border border-[#D6B46A]/50 rounded-xl flex items-center gap-3 text-[#A68936] text-sm font-bold">
                <Sparkles className="w-5 h-5 text-[#A68936]" />
                <span>Happy Birthday! Today is your birthday!</span>
              </div>
            )}

            <div className="p-6 sm:p-8 bg-[#FFFDF8] border border-[#D6B46A]/40 rounded-2xl text-center space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-[#554F49] font-bold">
                Your Exact Age Is
              </p>
              <h3 className="text-2xl sm:text-4xl font-display font-black text-[#111111] tracking-tight">
                {calculation.years} <span className="text-base sm:text-xl font-normal text-neutral-500">years,</span>{' '}
                {calculation.months} <span className="text-base sm:text-xl font-normal text-neutral-500">months,</span>{' '}
                <span className="text-base sm:text-xl font-normal text-neutral-500">and</span> {calculation.days}{' '}
                <span className="text-base sm:text-xl font-normal text-neutral-500">days</span>
              </h3>
              <p className="text-xs text-neutral-500 font-mono pt-1">
                Calculated as of {new Date(referenceDateStr + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Key Milestone Secondary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
                <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Next Birthday</p>
                <p className="text-lg font-bold text-[#111111] font-mono mt-1">
                  {calculation.daysUntilNextBirthday === 0 ? 'Today!' : `In ${calculation.daysUntilNextBirthday} days`}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  {calculation.nextBirthdayWeekday}, {calculation.nextBirthdayDate.toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
                <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Total Days Lived</p>
                <p className="text-lg font-bold text-[#111111] font-mono mt-1">
                  {calculation.totalDays.toLocaleString()}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  {calculation.totalWeeks.toLocaleString()} weeks
                </p>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
                <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Total Months Lived</p>
                <p className="text-lg font-bold text-[#111111] font-mono mt-1">
                  {calculation.totalMonths.toLocaleString()}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Across {calculation.totalYears} completed years
                </p>
              </div>
            </div>

            {/* Expandable Advanced Statistics Panel */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-5 py-3.5 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
              >
                <span>Detailed Time Units & Date Breakdown</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="p-5 bg-white space-y-3 text-xs border-t border-neutral-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-500 font-mono text-[10px] uppercase">Hours (Approx)</p>
                      <p className="text-sm font-bold text-neutral-900 font-mono mt-0.5">{calculation.totalHours.toLocaleString()} hrs</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-500 font-mono text-[10px] uppercase">Minutes (Approx)</p>
                      <p className="text-sm font-bold text-neutral-900 font-mono mt-0.5">{(calculation.totalHours * 60).toLocaleString()} mins</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-500 font-mono text-[10px] uppercase">Seconds (Approx)</p>
                      <p className="text-sm font-bold text-neutral-900 font-mono mt-0.5">{(calculation.totalHours * 3600).toLocaleString()} s</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-500 font-mono text-[10px] uppercase">Days to Next Bday</p>
                      <p className="text-sm font-bold text-neutral-900 font-mono mt-0.5">{calculation.daysUntilNextBirthday} days</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 italic pt-1">
                    * Exact hours, minutes, and seconds are calculated assuming standard 24-hour solar days without local daylight saving time (DST) shifts.
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Copy & Reset */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2.5 bg-[#111111] hover:bg-black text-[#D6B46A] text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Age Summary'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset Dates
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-3 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">How does the calculator handle leap years?</p>
            <p className="text-neutral-600 mt-0.5">The calendar algorithm accounts for leap years (including century leap year exceptions under the Gregorian system). If you were born on February 29, you can choose whether your birthday is counted on February 28 or March 1 during non-leap years.</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Is my birth date stored or transmitted?</p>
            <p className="text-neutral-600 mt-0.5">No. All date math is executed entirely inside your web browser's local JavaScript engine. No data is stored, cached, or sent to any server.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
