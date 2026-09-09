import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calculator, Percent, ArrowRightLeft, DollarSign, Binary, 
  Calendar, Volume2, VolumeX, History, RotateCcw, Copy, 
  Check, ShieldCheck, Sparkles, TrendingUp, Info, ChevronRight, Zap,
  Maximize2, Minimize2, X, Trash2, ArrowUpRight
} from 'lucide-react';
import SleekLuxurySlider from './SleekLuxurySlider';
import CustomUnitDropdown from './CustomUnitDropdown';

type CalcMode = 'scientific' | 'financial' | 'units' | 'programmer' | 'date';

// Simple click sound using Web Audio API
const playKeyAudio = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore audio error if not allowed by browser autoplay policy
  }
};

export default function UniversalCalculator() {
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Trigger sound if enabled
  const triggerAudio = () => {
    if (soundEnabled) playKeyAudio();
  };

  const content = (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D6B46A]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#111111]">
              Universal Multi-Paradigm Calculator
            </h2>
            <p className="text-xs text-[#8A8178]">
              Scientific, Financial EMI & GST, Precision Unit Converter, Programmer Hex/Bin & Date Math.
            </p>
          </div>
        </div>

        {/* Audio feedback & Status */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer border ${
              soundEnabled 
                ? 'bg-[#111111] text-[#D6B46A] border-[#111111]' 
                : 'bg-white text-[#8A8178] border-[#D6B46A]/25 hover:text-[#111111]'
            }`}
            title="Toggle mechanical key audio feedback"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
            <span className="hidden sm:inline">Sound</span> {soundEnabled ? 'ON' : 'OFF'}
          </button>

          <span className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Active
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#D6B46A]/30 rounded-2xl w-full sm:w-fit shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('scientific'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            mode === 'scientific'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Scientific Pro</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('financial'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            mode === 'financial'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Financial & EMI</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('units'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            mode === 'units'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Unit Converter</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('programmer'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            mode === 'programmer'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>Programmer</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('date'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            mode === 'date'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Age & Date</span>
        </button>
      </div>

      {/* Calculator Body Rendering */}
      <div className="w-full">
        {mode === 'scientific' && <ScientificCalculator soundEnabled={soundEnabled} />}
        {mode === 'financial' && <FinancialCalculator soundEnabled={soundEnabled} />}
        {mode === 'units' && <UnitConverterCalculator soundEnabled={soundEnabled} />}
        {mode === 'programmer' && <ProgrammerCalculator soundEnabled={soundEnabled} />}
        {mode === 'date' && <DateAgeCalculator soundEnabled={soundEnabled} />}
      </div>
      {/* Search-optimized suite capability index */}
      <div className="w-full max-w-6xl mx-auto p-5 sm:p-6 rounded-2xl bg-white border border-[#D6B46A]/20 text-xs font-mono space-y-3">
        <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-2.5">
          <div className="flex items-center gap-2 text-[#111111] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B46A]" />
            <span>High-Precision Calculation Engine Suite</span>
          </div>
          <span className="text-[10px] text-[#8A8178]">All 5 Modules Synchronized</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-[11px] text-[#554F49]">
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D6B46A]/15 space-y-1">
            <strong className="text-[#111111] block">🔬 Scientific Pro</strong>
            <p className="text-[10px] text-[#8A8178]">Trig (sin, cos, tan), log, ln, roots, powers, parentheses, DEG/RAD mode, calculation history tape & full-screen workbench.</p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D6B46A]/15 space-y-1">
            <strong className="text-[#111111] block">💰 Loan EMI & GST</strong>
            <p className="text-[10px] text-[#8A8178]">Home, Car & Personal Loan EMI with tactile luxury sliders, GST inclusive/exclusive rates (5%, 12%, 18%, 28%) and SIP wealth forecaster.</p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D6B46A]/15 space-y-1">
            <strong className="text-[#111111] block">📏 Unit Converter</strong>
            <p className="text-[10px] text-[#8A8178]">Real-time Length, Weight/Mass, Temperature, Digital Storage (GB/MB), Speed and Area conversion matrix.</p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D6B46A]/15 space-y-1">
            <strong className="text-[#111111] block">💻 Programmer Math</strong>
            <p className="text-[10px] text-[#8A8178]">Live Decimal, Hexadecimal, Binary, Octal conversion, bitwise AND, OR, XOR, NOT, shift operators & 32-bit register viewer.</p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D6B46A]/15 space-y-1">
            <strong className="text-[#111111] block">🎂 Age & Date Chronometer</strong>
            <p className="text-[10px] text-[#8A8178]">Exact chronological age from DOB, exam cutoff eligibility date, next birthday countdown, working days & date differences.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8" id="universal-calculator-suite">
      {content}
    </div>
  );
}

// -------------------------------------------------------------
// HELPER: ROBUST MATHEMATICAL EVALUATOR
// Handles implicit multiplication (5sqrt(8), 58π5, 85tan(85)),
// unclosed parentheses, DEG/RAD trig, powers, roots, logs, factorial
// -------------------------------------------------------------
function evaluateMathExpression(rawExpr: string, isRad: boolean): string {
  if (!rawExpr || !rawExpr.trim()) return '0';

  try {
    let sanitized = rawExpr
      .replace(/\s+/g, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    // 0. Handle cases where function is attached after number like 85tan -> tan(85)
    sanitized = sanitized.replace(/(\d+(?:\.\d+)?)(sin|cos|tan|sqrt|cbrt|ln|log)(?!\()/g, '$2($1)');

    // Strip trailing operators that cannot end an expression
    sanitized = sanitized.replace(/[+\-*/^]+$/, '');
    if (!sanitized) return '0';

    // 1. Auto-insert implicit multiplication
    // E.g.: 5sqrt -> 5*sqrt, 5( -> 5*(, )5 -> )*5, )( -> )*(
    sanitized = sanitized.replace(/(\d+|\)|π|e)\(/g, '$1*(');
    sanitized = sanitized.replace(/\)(\d+|π|e)/g, ')*$1');
    sanitized = sanitized.replace(/\)(sin|cos|tan|sqrt|cbrt|ln|log)/g, ')*$1');
    sanitized = sanitized.replace(/(\d+)(π|e)/g, '$1*$2');
    sanitized = sanitized.replace(/(π|e)(\d+)/g, '$1*$2');
    sanitized = sanitized.replace(/(π|e)(π|e)/g, '$1*$2');
    sanitized = sanitized.replace(/(\d+)(sin|cos|tan|sqrt|cbrt|ln|log)/g, '$1*$2');
    sanitized = sanitized.replace(/(π|e)(sin|cos|tan|sqrt|cbrt|ln|log)/g, '$1*$2');

    // 2. Auto-balance parentheses
    let openCount = (sanitized.match(/\(/g) || []).length;
    let closeCount = (sanitized.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      sanitized += ')'.repeat(openCount - closeCount);
    }

    // 3. Constants replacement
    sanitized = sanitized
      .replace(/π/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');

    // 4. Powers: x^y -> x**y
    sanitized = sanitized.replace(/\^/g, '**');

    // 5. Factorial: n! -> factorial function
    sanitized = sanitized.replace(/(\d+)!/g, (_, n) => {
      let num = parseInt(n, 10);
      if (num > 170) return 'Infinity';
      let res = 1;
      for (let i = 2; i <= num; i++) res *= i;
      return res.toString();
    });

    // 6. Trigonometric function replacement (bracket-matching for DEG/RAD)
    const trigFuncs = ['sin', 'cos', 'tan'];
    for (const fn of trigFuncs) {
      const search = fn + '(';
      let idx = sanitized.indexOf(search);
      while (idx !== -1) {
        const openPos = idx + search.length - 1;
        let depth = 1;
        let closePos = -1;
        for (let i = openPos + 1; i < sanitized.length; i++) {
          if (sanitized[i] === '(') depth++;
          else if (sanitized[i] === ')') {
            depth--;
            if (depth === 0) {
              closePos = i;
              break;
            }
          }
        }
        if (closePos !== -1) {
          const innerRaw = sanitized.slice(openPos + 1, closePos).trim();
          const innerArg = innerRaw ? innerRaw : '0';
          const replacement = !isRad
            ? `Math.${fn}((${innerArg}) * Math.PI / 180)`
            : `Math.${fn}(${innerArg})`;
          sanitized = sanitized.slice(0, idx) + replacement + sanitized.slice(closePos + 1);
          idx = sanitized.indexOf(search, idx + replacement.length);
        } else {
          break;
        }
      }
    }

    // 7. Math roots and logarithms
    sanitized = sanitized
      .replace(/sqrt\(\s*\)/g, 'Math.sqrt(0)')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/cbrt\(\s*\)/g, 'Math.cbrt(0)')
      .replace(/cbrt\(/g, 'Math.cbrt(')
      .replace(/ln\(\s*\)/g, 'Math.log(1)')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/log\(\s*\)/g, 'Math.log10(1)')
      .replace(/log\(/g, 'Math.log10(');

    // 8. Percentages: e.g. 50% -> (50/100)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // 9. Execute safely
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)();

    if (typeof result === 'number') {
      if (isNaN(result)) return 'Error';
      if (!isFinite(result)) return 'Undefined';
      const precision = Number(result.toFixed(10));
      return precision.toString();
    }

    return 'Error';
  } catch (err) {
    console.warn('Math evaluation parse warning:', err);
    return 'Error';
  }
}

// -------------------------------------------------------------
// 1. SCIENTIFIC CALCULATOR COMPONENT
// -------------------------------------------------------------
function ScientificCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [isRad, setIsRad] = useState(true);
  const [isBasicMode, setIsBasicMode] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<{ expr: string; result: string; time: string }[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSciFullscreen, setIsSciFullscreen] = useState(false);

  // When user presses a key, if display was 'Error' or 'Undefined', reset it first
  const press = (val: string) => {
    if (soundEnabled) playKeyAudio();

    if (displayValue === 'Error' || displayValue === 'Undefined') {
      setDisplayValue(val);
      setExpression(val);
      return;
    }

    if (displayValue === '0' && !isNaN(Number(val))) {
      setDisplayValue(val);
      setExpression(val);
    } else {
      setDisplayValue(prev => (prev === '0' && val !== '.' ? val : prev + val));
      setExpression(prev => prev + val);
    }
  };

  const clearAll = () => {
    if (soundEnabled) playKeyAudio();
    setDisplayValue('0');
    setExpression('');
  };

  const backspace = () => {
    if (soundEnabled) playKeyAudio();
    if (displayValue === 'Error' || displayValue === 'Undefined') {
      clearAll();
      return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(prev => prev.slice(0, -1));
      setExpression(prev => prev.slice(0, -1));
    } else {
      setDisplayValue('0');
      setExpression('');
    }
  };

  // Evaluate math expression safely
  const calculateResult = () => {
    if (soundEnabled) playKeyAudio();
    if (!expression && displayValue === '0') return;

    const targetExpr = expression || displayValue;
    try {
      const formattedResult = evaluateMathExpression(targetExpr, isRad);
      
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory(prev => [
        { expr: targetExpr, result: formattedResult, time: nowTime },
        ...prev.slice(0, 29)
      ]);

      setDisplayValue(formattedResult);
      if (formattedResult !== 'Error' && formattedResult !== 'Undefined') {
        setExpression(formattedResult);
      }
    } catch (err) {
      setDisplayValue('Error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const restoreHistoryItem = (item: { expr: string; result: string }) => {
    if (soundEnabled) playKeyAudio();
    setDisplayValue(item.result);
    setExpression(item.result);
    setShowHistoryModal(false);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing when inputs are focused
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key >= '0' && e.key <= '9') press(e.key);
      else if (e.key === '.') press('.');
      else if (e.key === '+') press('+');
      else if (e.key === '-') press('-');
      else if (e.key === '*') press('×');
      else if (e.key === '/') { e.preventDefault(); press('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculateResult(); }
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') {
        if (isSciFullscreen) {
          setIsSciFullscreen(false);
          return;
        }
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Clean, responsive 6-column scientific keypad matrix
  const keypadGrid = (
    <div className="grid grid-cols-6 gap-2 sm:gap-2.5 select-none text-xs sm:text-sm">
      {/* Row 1: Memory & Clear */}
      <button type="button" onClick={() => { setMemory(0); if (soundEnabled) playKeyAudio(); }} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">MC</button>
      <button type="button" onClick={() => { setDisplayValue(memory.toString()); setExpression(prev => prev + memory.toString()); if (soundEnabled) playKeyAudio(); }} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">MR</button>
      <button type="button" onClick={() => { const val = parseFloat(displayValue || '0'); if (!isNaN(val)) setMemory(prev => prev + val); if (soundEnabled) playKeyAudio(); }} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">M+</button>
      <button type="button" onClick={() => { const val = parseFloat(displayValue || '0'); if (!isNaN(val)) setMemory(prev => prev - val); if (soundEnabled) playKeyAudio(); }} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">M-</button>
      <button type="button" onClick={backspace} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center text-amber-300 font-bold" title="Backspace">⌫</button>
      <button type="button" onClick={clearAll} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center bg-rose-950/60 border-rose-600/40 text-rose-300 font-bold hover:bg-rose-900/80" title="Clear All">AC</button>

      {/* Row 2: Trig & Core Operations */}
      <button type="button" onClick={() => press('sin(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">sin</button>
      <button type="button" onClick={() => press('cos(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">cos</button>
      <button type="button" onClick={() => press('tan(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">tan</button>
      <button type="button" onClick={() => press('ln(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">ln</button>
      <button type="button" onClick={() => press('log(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">log</button>
      <button type="button" onClick={() => press('÷')} className="calc-op-key h-11 sm:h-12 flex items-center justify-center font-black text-lg">÷</button>

      {/* Row 3: Roots, Powers & Parentheses */}
      <button type="button" onClick={() => press('sqrt(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">√x</button>
      <button type="button" onClick={() => press('^2')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">x²</button>
      <button type="button" onClick={() => press('^')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">xʸ</button>
      <button type="button" onClick={() => press('(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-bold">(</button>
      <button type="button" onClick={() => press(')')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-bold">)</button>
      <button type="button" onClick={() => press('×')} className="calc-op-key h-11 sm:h-12 flex items-center justify-center font-black text-lg">×</button>

      {/* Row 4: Constants & 7 8 9 - */}
      <button type="button" onClick={() => press('π')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-serif italic text-base">π</button>
      <button type="button" onClick={() => press('e')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-serif italic text-base">e</button>
      <button type="button" onClick={() => press('7')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">7</button>
      <button type="button" onClick={() => press('8')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">8</button>
      <button type="button" onClick={() => press('9')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">9</button>
      <button type="button" onClick={() => press('-')} className="calc-op-key h-11 sm:h-12 flex items-center justify-center font-black text-lg">-</button>

      {/* Row 5: Factorials & 4 5 6 + */}
      <button type="button" onClick={() => press('!')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-bold">n!</button>
      <button type="button" onClick={() => press('%')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-bold">%</button>
      <button type="button" onClick={() => press('4')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">4</button>
      <button type="button" onClick={() => press('5')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">5</button>
      <button type="button" onClick={() => press('6')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">6</button>
      <button type="button" onClick={() => press('+')} className="calc-op-key h-11 sm:h-12 flex items-center justify-center font-black text-lg">+</button>

      {/* Row 6: Reciprocal, Sign, 1 2 3 and = (Row-spanning) */}
      <button type="button" onClick={() => press('1/(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">1/x</button>
      <button 
        type="button" 
        onClick={() => {
          if (displayValue === 'Error' || displayValue === 'Undefined') return;
          if (displayValue.startsWith('-')) {
            setDisplayValue(displayValue.substring(1));
          } else {
            setDisplayValue('-' + displayValue);
          }
        }} 
        className="calc-fn-key h-11 sm:h-12 flex items-center justify-center font-bold"
      >
        ±
      </button>
      <button type="button" onClick={() => press('1')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">1</button>
      <button type="button" onClick={() => press('2')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">2</button>
      <button type="button" onClick={() => press('3')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">3</button>
      <button 
        type="button" 
        onClick={calculateResult} 
        className="row-span-2 rounded-2xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] text-[#111111] font-mono font-black text-2xl sm:text-3xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center justify-center border border-[#D6B46A]"
        title="Calculate Result (Enter)"
      >
        =
      </button>

      {/* Row 7: Powers & 0 . (with = spanning above on the right) */}
      <button type="button" onClick={() => press('cbrt(')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center">∛x</button>
      <button type="button" onClick={() => press('*0.01')} className="calc-fn-key h-11 sm:h-12 flex items-center justify-center text-[10px] sm:text-xs">0.01x</button>
      <button type="button" onClick={() => press('0')} className="calc-num-key col-span-2 h-11 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">0</button>
      <button type="button" onClick={() => press('.')} className="calc-num-key h-11 sm:h-12 flex items-center justify-center font-bold text-lg">.</button>
    </div>
  );

  // High-Comfort 4-Column Standard Keypad for Rapid Everyday Arithmetic
  const basicKeypadGrid = (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 select-none text-base sm:text-lg">
      <button type="button" onClick={clearAll} className="calc-fn-key h-13 sm:h-14 flex items-center justify-center bg-rose-950/60 border-rose-600/40 text-rose-300 font-bold hover:bg-rose-900/80">AC</button>
      <button type="button" onClick={backspace} className="calc-fn-key h-13 sm:h-14 flex items-center justify-center text-amber-300 font-bold">⌫</button>
      <button type="button" onClick={() => press('%')} className="calc-fn-key h-13 sm:h-14 flex items-center justify-center font-bold">%</button>
      <button type="button" onClick={() => press('÷')} className="calc-op-key h-13 sm:h-14 flex items-center justify-center font-black text-2xl">÷</button>

      <button type="button" onClick={() => press('7')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">7</button>
      <button type="button" onClick={() => press('8')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">8</button>
      <button type="button" onClick={() => press('9')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">9</button>
      <button type="button" onClick={() => press('×')} className="calc-op-key h-13 sm:h-14 flex items-center justify-center font-black text-2xl">×</button>

      <button type="button" onClick={() => press('4')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">4</button>
      <button type="button" onClick={() => press('5')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">5</button>
      <button type="button" onClick={() => press('6')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">6</button>
      <button type="button" onClick={() => press('-')} className="calc-op-key h-13 sm:h-14 flex items-center justify-center font-black text-2xl">-</button>

      <button type="button" onClick={() => press('1')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">1</button>
      <button type="button" onClick={() => press('2')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">2</button>
      <button type="button" onClick={() => press('3')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">3</button>
      <button type="button" onClick={() => press('+')} className="calc-op-key h-13 sm:h-14 flex items-center justify-center font-black text-2xl">+</button>

      <button 
        type="button" 
        onClick={() => {
          if (displayValue === 'Error' || displayValue === 'Undefined') return;
          setDisplayValue(prev => prev.startsWith('-') ? prev.substring(1) : '-' + prev);
        }} 
        className="calc-fn-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl"
      >
        ±
      </button>
      <button type="button" onClick={() => press('0')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">0</button>
      <button type="button" onClick={() => press('.')} className="calc-num-key h-13 sm:h-14 flex items-center justify-center font-bold text-xl">.</button>
      <button 
        type="button" 
        onClick={calculateResult} 
        className="h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] text-[#111111] font-mono font-black text-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center justify-center border border-[#D6B46A]"
      >
        =
      </button>
    </div>
  );

  const mainCalculatorBody = (
    <div className="bg-[#161616] p-5 sm:p-8 rounded-[36px] border border-[#D6B46A]/35 shadow-2xl relative overflow-hidden lg:col-span-8 w-full">
      {/* Soft Gold Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Metallic Branding */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D6B46A]/15 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A]" />
          <span className="font-bold text-white uppercase tracking-widest text-[11px]">
            SAMAXON FX-991 {isBasicMode ? 'BASIC' : 'PRO'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Mode Switcher: Standard Basic vs Scientific Pro */}
          <div className="flex items-center bg-[#222222] border border-[#D6B46A]/30 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => { if (soundEnabled) playKeyAudio(); setIsBasicMode(false); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                !isBasicMode ? 'bg-[#D6B46A] text-[#111111]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Scientific
            </button>
            <button
              type="button"
              onClick={() => { if (soundEnabled) playKeyAudio(); setIsBasicMode(true); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                isBasicMode ? 'bg-[#D6B46A] text-[#111111]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Standard
            </button>
          </div>

          {!isBasicMode && (
            <button
              type="button"
              onClick={() => { if (soundEnabled) playKeyAudio(); setIsRad(!isRad); }}
              className="px-2.5 py-1 rounded bg-[#222222] border border-[#D6B46A]/30 text-[11px] uppercase font-bold text-[#D6B46A] hover:bg-[#2a2a2a] cursor-pointer active:scale-95 transition-all shadow-xs"
              title="Toggle Radians / Degrees"
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>
          )}

          {/* History Toggle Button with Badge */}
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setShowHistoryModal(true); }}
            className="px-2.5 py-1 rounded bg-[#222222] border border-[#D6B46A]/30 text-[11px] font-bold text-white hover:text-[#D6B46A] hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
            title="View Calculation History Tape"
          >
            <History className="w-3.5 h-3.5 text-[#D6B46A]" />
            <span>History</span>
            {history.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D6B46A] text-[#111111] text-[9px] font-black flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>

          {/* Scientific Fullscreen Button */}
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playKeyAudio();
              setIsSciFullscreen(true);
            }}
            className="p-1.5 rounded bg-[#222222] border border-[#D6B46A]/30 text-[#D6B46A] hover:bg-[#2a2a2a] hover:text-white cursor-pointer flex items-center justify-center active:scale-95 transition-all shadow-xs"
            title="Scientific Fullscreen Workbench (Esc to exit)"
            aria-label="Scientific Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Realistic High-Contrast Display Screen */}
      <div className="my-5 p-5 sm:p-6 rounded-2xl bg-[#080808] border border-[#D6B46A]/30 text-right shadow-inner relative group">
        <div className="min-h-5 text-xs sm:text-sm font-mono text-[#8A8178] tracking-wider truncate mb-1">
          {expression || '0'}
        </div>
        <div className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none">
          {displayValue}
        </div>

        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute top-3 left-3 p-1.5 rounded-lg bg-[#161616] text-[#8A8178] hover:text-[#D6B46A] opacity-75 hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 text-[10px] font-mono border border-white/5"
          title="Copy Result"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Dynamic Keypad Grid (Basic vs Scientific) */}
      {isBasicMode ? basicKeypadGrid : keypadGrid}
    </div>
  );

  const historyModalContent = showHistoryModal && (
    <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#141414] border border-[#D6B46A]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 text-white animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#222222] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Calculation History
              </h3>
              <span className="text-[11px] font-mono text-[#8A8178]">
                {history.length} operations recorded
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHistoryModal(false)}
            className="w-8 h-8 rounded-full bg-[#222222] text-[#8A8178] hover:text-white hover:bg-[#333333] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* History Items List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {history.length === 0 ? (
            <div className="text-center py-10 text-xs font-mono text-[#8A8178] space-y-1">
              <p>No calculations recorded yet.</p>
              <p className="text-[11px] text-[#554F49]">Enter any formula and press = to see history.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => restoreHistoryItem(item)}
                className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-[#D6B46A]/20 hover:border-[#D6B46A] transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="space-y-1 overflow-hidden pr-2">
                  <div className="text-xs font-mono text-[#8A8178] truncate">{item.expr} =</div>
                  <div className="text-base font-mono font-bold text-[#D6B46A] group-hover:text-white transition-colors">
                    {item.result}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-[#554F49]">{item.time}</span>
                  <div className="w-7 h-7 rounded-lg bg-[#252525] text-[#D6B46A] flex items-center justify-center group-hover:bg-[#D6B46A] group-hover:text-[#111111] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="flex justify-between items-center pt-3 border-t border-[#D6B46A]/15">
            <button
              type="button"
              onClick={() => setHistory([])}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-mono hover:bg-rose-900/60 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHistoryModal(false)}
              className="px-4 py-1.5 rounded-xl bg-[#222222] text-white text-xs font-mono font-bold hover:bg-[#333333] cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isSciFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0c0c0c]/98 backdrop-blur-md text-soft-ivory p-3 sm:p-6 overflow-y-auto w-screen h-screen flex flex-col items-center justify-start">
        {/* Minimalist Floating Exit Bar */}
        <div className="w-full max-w-5xl xl:max-w-6xl flex items-center justify-between pb-3 border-b border-[#D6B46A]/20 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6B46A] shadow-[0_0_10px_#D6B46A]" />
            <span className="font-mono font-bold text-xs sm:text-sm uppercase tracking-widest text-[#D6B46A]">
              SAMAXON FX-991 PRO · FULLSCREEN WORKBENCH
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#D6B46A]/15 text-[#D6B46A] text-[10px] font-mono font-bold">
              PC & Tablet Responsive
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { if (soundEnabled) playKeyAudio(); setIsRad(!isRad); }}
              className="px-2.5 py-1 rounded bg-[#222222] border border-[#D6B46A]/30 text-xs uppercase font-bold text-[#D6B46A] hover:bg-[#2a2a2a] cursor-pointer"
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playKeyAudio();
                setIsSciFullscreen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#D6B46A]/40 text-[#D6B46A] hover:bg-[#D6B46A] hover:text-[#111111] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold shadow-lg"
              title="Exit Fullscreen (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </div>

        {/* Widescreen Responsive Dual-Pane Container in Fullscreen */}
        <div className="w-full max-w-5xl xl:max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
          {/* Left Column on Desktop / Top on Mobile: Screen & History Tape */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#080808] border border-[#D6B46A]/35 text-right shadow-inner relative group">
              <div className="min-h-6 text-xs sm:text-sm font-mono text-[#8A8178] tracking-wider truncate mb-1">
                {expression || '0'}
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none">
                {displayValue}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#8A8178]">
                <div className="flex items-center gap-2">
                  <span className="text-[#D6B46A] font-bold">MODE:</span>
                  <span className="text-neutral-300">{isRad ? 'Radians' : 'Degrees'}</span>
                  {memory !== 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#D6B46A]/20 text-[#D6B46A] font-bold">
                      M = {memory}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-2 py-1 rounded-md bg-[#161616] text-[#8A8178] hover:text-[#D6B46A] transition-colors cursor-pointer flex items-center gap-1 border border-white/5"
                  title="Copy Result"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Embedded Live History Reel in Fullscreen Desktop */}
            <div className="bg-[#161616] border border-[#D6B46A]/25 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-2">
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-[#D6B46A]" />
                  <span className="font-display font-bold text-xs uppercase text-white tracking-wider">
                    Session History
                  </span>
                </div>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistory([])}
                    className="text-[10px] font-mono text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 scrollbar-thin pr-1 text-left">
                {history.length === 0 ? (
                  <div className="text-center py-6 text-xs font-mono text-[#8A8178]">
                    No previous operations yet
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => restoreHistoryItem(item)}
                      className="p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-white/5 hover:border-[#D6B46A]/30 cursor-pointer transition-all flex items-center justify-between text-xs font-mono"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[#8A8178] block text-[10px] truncate">{item.expr}</span>
                        <span className="text-[#D6B46A] font-bold">{item.result}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#8A8178] shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column on Desktop: Full Keypad Grid */}
          <div className="lg:col-span-7 bg-[#161616] p-4 sm:p-6 rounded-3xl border border-[#D6B46A]/35 shadow-xl">
            {keypadGrid}
          </div>
        </div>

        {historyModalContent}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {mainCalculatorBody}

      {/* Side History & Formulas Reel on Desktop */}
      <div className="lg:col-span-4 space-y-6">
        {/* Desktop History Tape Box */}
        <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#D6B46A]" />
              <h3 className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider">
                Calculation History
              </h3>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[11px] font-mono text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-[#8A8178]">
                No calculations recorded yet. Key in numbers to begin.
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => restoreHistoryItem(item)}
                  className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#D6B46A]/20 hover:border-[#D6B46A] transition-colors cursor-pointer text-right space-y-0.5 group"
                  title="Click to restore to calculator"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8178]">
                    <span>{item.time}</span>
                    <span className="truncate max-w-[160px]">{item.expr} =</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-[#111111] group-hover:text-[#BFA15A] transition-colors">
                    {item.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Keyboard Quick Guide */}
        <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-3xl p-6 space-y-3">
          <span className="text-[10px] font-mono uppercase font-bold text-[#A68936] tracking-wider block">
            Keyboard Shortcuts Active
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#554F49]">
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">0-9</kbd> Numbers</div>
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">+-*/</kbd> Operators</div>
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">Enter</kbd> Equals (=)</div>
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">Esc</kbd> Clear All</div>
          </div>
        </div>
      </div>

      {historyModalContent}
    </div>
  );
}

// -------------------------------------------------------------
// 2. FINANCIAL CALCULATOR COMPONENT (LOAN, EMI, GST, SIP)
// Featuring custom tactile liquid sliders inspired by Video 2
// -------------------------------------------------------------
function FinancialCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [finTab, setFinTab] = useState<'emi' | 'gst' | 'sip'>('emi');

  // EMI States
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(15);

  // GST States
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'add' | 'remove'>('add');

  // SIP States
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [sipReturnRate, setSipReturnRate] = useState<number>(14);
  const [sipYears, setSipYears] = useState<number>(10);

  // EMI Calculations
  const emiData = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0 || n === 0) return { emi: 0, totalInterest: 0, totalPayment: P, principalPercent: 100, interestPercent: 0 };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalPercent: Math.round((P / totalPayment) * 100),
      interestPercent: Math.round((totalInterest / totalPayment) * 100)
    };
  }, [loanAmount, interestRate, tenureYears]);

  // GST Calculations
  const gstData = useMemo(() => {
    if (gstType === 'add') {
      const tax = (gstAmount * gstRate) / 100;
      return {
        base: gstAmount,
        cgst: tax / 2,
        sgst: tax / 2,
        totalTax: tax,
        finalTotal: gstAmount + tax
      };
    } else {
      const base = (gstAmount * 100) / (100 + gstRate);
      const tax = gstAmount - base;
      return {
        base: Math.round(base * 100) / 100,
        cgst: Math.round((tax / 2) * 100) / 100,
        sgst: Math.round((tax / 2) * 100) / 100,
        totalTax: Math.round(tax * 100) / 100,
        finalTotal: gstAmount
      };
    }
  }, [gstAmount, gstRate, gstType]);

  // SIP Calculations
  const sipData = useMemo(() => {
    const P = monthlyInvestment;
    const i = sipReturnRate / 12 / 100;
    const n = sipYears * 12;

    const totalInvested = P * n;
    const maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const wealthGain = maturity - totalInvested;

    return {
      invested: Math.round(totalInvested),
      returns: Math.round(wealthGain),
      maturity: Math.round(maturity)
    };
  }, [monthlyInvestment, sipReturnRate, sipYears]);

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-[#D6B46A]/20 pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setFinTab('emi')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer shrink-0 ${
            finTab === 'emi' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-white text-[#554F49] hover:text-[#111111]'
          }`}
        >
          Home & Personal Loan EMI
        </button>
        <button
          type="button"
          onClick={() => setFinTab('gst')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer shrink-0 ${
            finTab === 'gst' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-white text-[#554F49] hover:text-[#111111]'
          }`}
        >
          GST & Tax Calculator
        </button>
        <button
          type="button"
          onClick={() => setFinTab('sip')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer shrink-0 ${
            finTab === 'sip' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-white text-[#554F49] hover:text-[#111111]'
          }`}
        >
          SIP & Compound Wealth
        </button>
      </div>

      {/* 1. EMI CALCULATOR */}
      {finTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-display font-bold text-xl text-[#111111]">
              Loan Parameters & Tenure
            </h3>

            {/* Custom Luxury Slider: Loan Amount */}
            <SleekLuxurySlider
              label="Loan Amount"
              value={loanAmount}
              min={50000}
              max={50000000}
              step={50000}
              onChange={setLoanAmount}
              formatValue={(val) => `₹${val.toLocaleString('en-IN')}`}
              minLabel="₹50K"
              midLabel="₹2.5 Cr"
              maxLabel="₹5 Cr"
            />

            {/* Custom Luxury Slider: Interest Rate */}
            <SleekLuxurySlider
              label="Interest Rate (% P.A.)"
              value={interestRate}
              min={1}
              max={25}
              step={0.1}
              onChange={setInterestRate}
              formatValue={(val) => `${val}%`}
              minLabel="1%"
              midLabel="8.5% (Prime)"
              maxLabel="25%"
            />

            {/* Custom Luxury Slider: Tenure */}
            <SleekLuxurySlider
              label="Loan Tenure (Years)"
              value={tenureYears}
              min={1}
              max={30}
              step={1}
              onChange={setTenureYears}
              formatValue={(val) => `${val} Years (${val * 12} Months)`}
              minLabel="1 Yr"
              midLabel="15 Yrs"
              maxLabel="30 Yrs"
            />
          </div>

          {/* EMI Result Cards */}
          <div className="lg:col-span-5 bg-[#111111] text-soft-ivory p-6 sm:p-8 rounded-[32px] border border-[#D6B46A]/35 shadow-xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
              Loan Payment Summary
            </span>

            <div className="space-y-1">
              <span className="text-xs text-[#8A8178] block">Monthly Loan EMI:</span>
              <div className="text-4xl font-display font-black text-white">
                ₹{emiData.emi.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Fixed monthly installment</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#D6B46A]/20 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Principal Loan:</span>
                <span className="text-white font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Total Interest:</span>
                <span className="text-[#D6B46A] font-bold">₹{emiData.totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D6B46A]/10 text-sm">
                <span className="text-white font-bold">Total Amount Payable:</span>
                <span className="text-white font-black">₹{emiData.totalPayment.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white">Principal ({emiData.principalPercent}%)</span>
                <span className="text-[#D6B46A]">Interest ({emiData.interestPercent}%)</span>
              </div>
              <div className="h-3 w-full bg-[#222222] rounded-full overflow-hidden flex">
                <div 
                  className="bg-white transition-all duration-300" 
                  style={{ width: `${emiData.principalPercent}%` }} 
                />
                <div 
                  className="bg-[#D6B46A] transition-all duration-300" 
                  style={{ width: `${emiData.interestPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GST CALCULATOR */}
      {finTab === 'gst' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-display font-bold text-xl text-[#111111]">
              Goods & Services Tax (GST) Calculator
            </h3>

            {/* Add vs Remove switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setGstType('add')}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  gstType === 'add' ? 'bg-[#111111] text-[#D6B46A] shadow-xs' : 'text-[#554F49]'
                }`}
              >
                + Add GST (Exclusive)
              </button>
              <button
                type="button"
                onClick={() => setGstType('remove')}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  gstType === 'remove' ? 'bg-[#111111] text-[#D6B46A] shadow-xs' : 'text-[#554F49]'
                }`}
              >
                - Remove GST (Inclusive)
              </button>
            </div>

            {/* Custom Luxury Slider: GST Amount */}
            <SleekLuxurySlider
              label={gstType === 'add' ? 'Net Price / Base Amount' : 'Gross Total Bill (With GST)'}
              value={gstAmount}
              min={500}
              max={1000000}
              step={500}
              onChange={setGstAmount}
              formatValue={(val) => `₹${val.toLocaleString('en-IN')}`}
              minLabel="₹500"
              midLabel="₹5 Lakh"
              maxLabel="₹10 Lakh"
            />

            {/* GST Rate Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-[#554F49]">
                GST Slab Rate
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 5, 12, 18, 28].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      gstRate === rate
                        ? 'bg-[#D6B46A] text-[#111111] border-[#D6B46A] shadow-sm'
                        : 'bg-[#FFFDF8] text-[#554F49] border-[#D6B46A]/25 hover:border-[#D6B46A]'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GST Result Summary */}
          <div className="lg:col-span-5 bg-[#111111] text-soft-ivory p-6 sm:p-8 rounded-[32px] border border-[#D6B46A]/35 shadow-xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
              GST Tax Breakdown
            </span>

            <div className="space-y-1">
              <span className="text-xs text-[#8A8178] block">Final Total Invoice Value:</span>
              <div className="text-4xl font-display font-black text-white">
                ₹{gstData.finalTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#D6B46A]/20 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Base Net Amount:</span>
                <span className="text-white font-bold">₹{gstData.base.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">CGST ({gstRate / 2}%):</span>
                <span className="text-[#D6B46A] font-bold">₹{gstData.cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">SGST ({gstRate / 2}%):</span>
                <span className="text-[#D6B46A] font-bold">₹{gstData.sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D6B46A]/10 text-sm">
                <span className="text-white font-bold">Total GST Tax:</span>
                <span className="text-emerald-400 font-bold">₹{gstData.totalTax.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SIP CALCULATOR */}
      {finTab === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-display font-bold text-xl text-[#111111]">
              Mutual Fund & Stock SIP Wealth Projector
            </h3>

            {/* Custom Luxury Slider: Monthly Investment */}
            <SleekLuxurySlider
              label="Monthly SIP Investment (₹)"
              value={monthlyInvestment}
              min={500}
              max={300000}
              step={500}
              onChange={setMonthlyInvestment}
              formatValue={(val) => `₹${val.toLocaleString('en-IN')}`}
              minLabel="₹500"
              midLabel="₹1.5 Lakh"
              maxLabel="₹3 Lakh"
            />

            {/* Custom Luxury Slider: Return Rate */}
            <SleekLuxurySlider
              label="Expected Annual Return (%)"
              value={sipReturnRate}
              min={5}
              max={30}
              step={0.5}
              onChange={setSipReturnRate}
              formatValue={(val) => `${val}%`}
              minLabel="5%"
              midLabel="14% (Avg Nifty)"
              maxLabel="30%"
            />

            {/* Custom Luxury Slider: Horizon */}
            <SleekLuxurySlider
              label="Investment Horizon"
              value={sipYears}
              min={1}
              max={40}
              step={1}
              onChange={setSipYears}
              formatValue={(val) => `${val} Years`}
              minLabel="1 Yr"
              midLabel="20 Yrs"
              maxLabel="40 Yrs"
            />
          </div>

          {/* SIP Results */}
          <div className="lg:col-span-5 bg-[#111111] text-soft-ivory p-6 sm:p-8 rounded-[32px] border border-[#D6B46A]/35 shadow-xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
              Compound Wealth Forecast
            </span>

            <div className="space-y-1">
              <span className="text-xs text-[#8A8178] block">Projected Maturity Value:</span>
              <div className="text-4xl font-display font-black text-emerald-400">
                ₹{sipData.maturity.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#D6B46A]/20 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Total Invested:</span>
                <span className="text-white font-bold">₹{sipData.invested.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8178]">Estimated Capital Gain:</span>
                <span className="text-[#D6B46A] font-bold">+₹{sipData.returns.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. UNIT CONVERTER CALCULATOR
// Powered by CustomUnitDropdown (Zero browser-default selects!)
// -------------------------------------------------------------
const UNIT_CATEGORIES: Record<string, { label: string; units: { id: string; name: string; toBase: number }[] }> = {
  length: {
    label: 'Length & Distance',
    units: [
      { id: 'm', name: 'Metre (m)', toBase: 1 },
      { id: 'km', name: 'Kilometre (km)', toBase: 1000 },
      { id: 'cm', name: 'Centimetre (cm)', toBase: 0.01 },
      { id: 'mm', name: 'Millimetre (mm)', toBase: 0.001 },
      { id: 'mi', name: 'Mile (mi)', toBase: 1609.344 },
      { id: 'yd', name: 'Yard (yd)', toBase: 0.9144 },
      { id: 'ft', name: 'Foot (ft)', toBase: 0.3048 },
      { id: 'in', name: 'Inch (in)', toBase: 0.0254 }
    ]
  },
  weight: {
    label: 'Mass & Weight',
    units: [
      { id: 'kg', name: 'Kilogram (kg)', toBase: 1 },
      { id: 'g', name: 'Gram (g)', toBase: 0.001 },
      { id: 'mg', name: 'Milligram (mg)', toBase: 0.000001 },
      { id: 'lb', name: 'Pound (lb)', toBase: 0.45359237 },
      { id: 'oz', name: 'Ounce (oz)', toBase: 0.028349523125 },
      { id: 'ton', name: 'Metric Ton (t)', toBase: 1000 }
    ]
  },
  data: {
    label: 'Digital Data Storage',
    units: [
      { id: 'B', name: 'Byte (B)', toBase: 1 },
      { id: 'KB', name: 'Kilobyte (KB)', toBase: 1024 },
      { id: 'MB', name: 'Megabyte (MB)', toBase: 1048576 },
      { id: 'GB', name: 'Gigabyte (GB)', toBase: 1073741824 },
      { id: 'TB', name: 'Terabyte (TB)', toBase: 1099511627776 }
    ]
  },
  speed: {
    label: 'Speed & Velocity',
    units: [
      { id: 'km/h', name: 'Km/h', toBase: 1 },
      { id: 'm/s', name: 'Metre/sec (m/s)', toBase: 3.6 },
      { id: 'mph', name: 'Miles/hour (mph)', toBase: 1.60934 },
      { id: 'knots', name: 'Knots', toBase: 1.852 }
    ]
  }
};

function UnitConverterCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [category, setCategory] = useState<string>('length');
  const [valFrom, setValFrom] = useState<number>(1);
  const currentUnits = UNIT_CATEGORIES[category].units;
  const [unitFrom, setUnitFrom] = useState<string>(currentUnits[0].id);
  const [unitTo, setUnitTo] = useState<string>(currentUnits[1]?.id || currentUnits[0].id);

  // When category changes, reset units
  useEffect(() => {
    const list = UNIT_CATEGORIES[category].units;
    setUnitFrom(list[0].id);
    setUnitTo(list[1]?.id || list[0].id);
  }, [category]);

  const convertedValue = useMemo(() => {
    const fromMeta = currentUnits.find(u => u.id === unitFrom);
    const toMeta = currentUnits.find(u => u.id === unitTo);
    if (!fromMeta || !toMeta) return 0;

    const baseVal = valFrom * fromMeta.toBase;
    const res = baseVal / toMeta.toBase;
    return Number(res.toFixed(8));
  }, [valFrom, unitFrom, unitTo, currentUnits]);

  return (
    <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-4">
        <h3 className="font-display font-bold text-xl text-[#111111]">
          Two-Way High-Precision Unit Converter
        </h3>

        {/* Category selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(UNIT_CATEGORIES).map(([key, data]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                category === key
                  ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                  : 'bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#554F49] hover:text-[#111111]'
              }`}
            >
              {data.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* From Side */}
        <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D6B46A]/30 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono uppercase font-bold text-[#8A8178]">
              From Value
            </label>
            <span className="text-[10px] font-mono text-[#A68936] font-bold uppercase">
              Input
            </span>
          </div>

          <input
            type="number"
            value={valFrom}
            onChange={(e) => setValFrom(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-white border border-[#D6B46A]/35 rounded-2xl font-mono text-2xl font-black text-[#111111] focus:outline-none focus:border-[#D6B46A]"
          />

          {/* Custom Bespoke Unit Dropdown (No default OS radio popup!) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-[#8A8178]">
              Select Source Unit:
            </label>
            <CustomUnitDropdown
              label="Source Unit"
              selectedId={unitFrom}
              options={currentUnits}
              onSelect={setUnitFrom}
              variant="light"
            />
          </div>
        </div>

        {/* To Side */}
        <div className="p-6 rounded-3xl bg-[#111111] text-soft-ivory border border-[#D6B46A]/35 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono uppercase font-bold text-[#D6B46A]">
              Equals To
            </label>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
              Calculated
            </span>
          </div>

          <div className="w-full px-4 py-3 bg-[#080808] border border-[#D6B46A]/30 rounded-2xl font-mono text-2xl font-black text-white overflow-x-auto select-all">
            {convertedValue}
          </div>

          {/* Custom Bespoke Unit Dropdown (No default OS radio popup!) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-[#8A8178]">
              Select Target Unit:
            </label>
            <CustomUnitDropdown
              label="Target Unit"
              selectedId={unitTo}
              options={currentUnits}
              onSelect={setUnitTo}
              variant="dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. PROGRAMMER CALCULATOR (HEX, DEC, OCT, BIN)
// High contrast, guaranteed visible dark input with quick keypad
// -------------------------------------------------------------
function ProgrammerCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [val, setVal] = useState<number>(42);

  const hexStr = (val >>> 0).toString(16).toUpperCase();
  const decStr = val.toString(10);
  const octStr = (val >>> 0).toString(8);
  const binStr = (val >>> 0).toString(2).padStart(16, '0');

  const addVal = (delta: number) => {
    if (soundEnabled) playKeyAudio();
    setVal(prev => prev + delta);
  };

  return (
    <div className="bg-[#111111] text-soft-ivory border border-[#D6B46A]/35 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
      <div className="border-b border-[#D6B46A]/20 pb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
          Computer Science & Bitwise Arithmetic
        </span>
        <h3 className="font-display font-bold text-xl text-white">
          Multi-Base Synchronized Machine
        </h3>
      </div>

      {/* Synchronized Multi-Base Readout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-[#080808] border border-[#D6B46A]/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#D6B46A]">HEX (Hexadecimal)</span>
          <div className="text-xl font-bold text-white tracking-wider">0x{hexStr}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080808] border border-[#D6B46A]/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">DEC (Decimal)</span>
          <div className="text-xl font-bold text-white tracking-wider">{decStr}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080808] border border-[#D6B46A]/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-400">OCT (Octal)</span>
          <div className="text-xl font-bold text-white tracking-wider">0o{octStr}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080808] border border-[#D6B46A]/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">BIN (Binary 16-Bit)</span>
          <div className="text-sm font-bold text-white tracking-widest break-all">{binStr}</div>
        </div>
      </div>

      {/* Input controls & bit shifts */}
      <div className="space-y-4">
        <label className="text-xs font-mono uppercase font-bold text-[#D6B46A] block">
          Modify Value (Decimal Input)
        </label>
        
        {/* Guaranteed High-Contrast Dark Input (Fix for white-on-white invisible text) */}
        <div className="relative">
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(parseInt(e.target.value, 10) || 0)}
            className="dark-calc-input w-full px-5 py-4 rounded-2xl font-mono text-2xl font-black !bg-[#0a0a0a] !text-[#D6B46A] !border-2 !border-[#D6B46A]/40 focus:!border-[#D6B46A] focus:!bg-[#141414] focus:!text-white shadow-inner"
            placeholder="Enter integer..."
          />
        </div>

        {/* Quick Tweak Keypad */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => addVal(1)}
            className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2c2c2c] border border-white/10 rounded-xl text-xs font-mono text-white cursor-pointer"
          >+1</button>
          <button
            type="button"
            onClick={() => addVal(-1)}
            className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2c2c2c] border border-white/10 rounded-xl text-xs font-mono text-white cursor-pointer"
          >-1</button>
          <button
            type="button"
            onClick={() => addVal(10)}
            className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2c2c2c] border border-white/10 rounded-xl text-xs font-mono text-white cursor-pointer"
          >+10</button>
          <button
            type="button"
            onClick={() => addVal(-10)}
            className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2c2c2c] border border-white/10 rounded-xl text-xs font-mono text-white cursor-pointer"
          >-10</button>
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setVal(v => v << 1); }}
            className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold text-[#D6B46A] cursor-pointer"
          >
            LSH (&lt;&lt; 1)
          </button>
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setVal(v => v >> 1); }}
            className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold text-[#D6B46A] cursor-pointer"
          >
            RSH (&gt;&gt; 1)
          </button>
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setVal(v => ~v); }}
            className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold text-[#D6B46A] cursor-pointer"
          >
            NOT (~)
          </button>
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setVal(0); }}
            className="px-3.5 py-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 rounded-xl text-xs font-mono font-bold text-rose-300 cursor-pointer"
          >
            Reset 0
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. DATE & AGE CALCULATOR (DEEP SEARCH OPTIMIZED)
// -------------------------------------------------------------
function DateAgeCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [subTab, setSubTab] = useState<'dob' | 'diff'>('dob');

  // Mode 1: Age from DOB
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [asOfDate, setAsOfDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Mode 2: Difference between two dates
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(true);

  // Live seconds ticker
  const [currentSeconds, setCurrentSeconds] = useState<number>(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSeconds(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Zodiac calculation helper
  const getZodiac = (month: number, day: number) => {
    const signs = [
      { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [1, 1], end: [1, 19] },
      { name: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20] },
      { name: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22] },
      { name: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22] },
      { name: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21] },
      { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [12, 31] },
    ];
    for (const s of signs) {
      if (
        (month === s.start[0] && day >= s.start[1]) ||
        (month === s.end[0] && day <= s.end[1])
      ) {
        return s;
      }
    }
    return { name: 'Aries', symbol: '♈', element: 'Fire' };
  };

  // Chinese Zodiac
  const getChineseZodiac = (year: number) => {
    const animals = [
      'Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍',
      'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'
    ];
    const index = (year - 4) % 12;
    return animals[index >= 0 ? index : index + 12];
  };

  // Calculations for Mode 1: Age from DOB
  const ageData = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(asOfDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;

    if (target < birth) {
      return { error: 'Target date must be after birth date.' };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalWeeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const totalMonths = years * 12 + months;

    // Next Birthday Countdown
    const today = new Date();
    let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const diffNextBdayMs = nextBday.getTime() - today.getTime();
    const daysToNextBday = Math.ceil(diffNextBdayMs / (1000 * 60 * 60 * 24));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextBdayDayName = dayNames[nextBday.getDay()];
    const turningAge = nextBday.getFullYear() - birth.getFullYear();

    // Astrology
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    const chinese = getChineseZodiac(birth.getFullYear());

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalWeeks,
      remDays,
      totalMonths,
      daysToNextBday,
      nextBdayDayName,
      turningAge,
      zodiac,
      chinese,
    };
  }, [birthDate, asOfDate]);

  // Calculations for Mode 2: Difference between two dates
  const dateDiffData = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;

    const start = s <= e ? s : e;
    const end = s <= e ? e : s;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    let diffMs = end.getTime() - start.getTime();
    if (includeEndDay) {
      diffMs += 24 * 60 * 60 * 1000;
    }
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // Working days (Monday to Friday)
    let workingDays = 0;
    const cur = new Date(start);
    const limit = new Date(end);
    if (includeEndDay) limit.setDate(limit.getDate() + 1);

    while (cur < limit) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      years,
      months,
      days: includeEndDay ? days + 1 : days,
      totalDays,
      totalWeeks,
      workingDays,
    };
  }, [startDate, endDate, includeEndDay]);

  return (
    <div className="space-y-8">
      {/* Top Mode Tabs: DOB vs Date Difference */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D6B46A]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-[#111111]">
              Age & Date Chronometer
            </h3>
            <p className="text-xs text-[#8A8178]">
              Calculate exact age in years, months, and days, cutoff dates for exams, next birthday countdown & zodiac.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F9F7F1] border border-[#D6B46A]/30 rounded-xl">
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setSubTab('dob'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              subTab === 'dob'
                ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                : 'text-[#554F49] hover:text-[#111111]'
            }`}
          >
            Chronological Age (DOB)
          </button>
          <button
            type="button"
            onClick={() => { if (soundEnabled) playKeyAudio(); setSubTab('diff'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              subTab === 'diff'
                ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
                : 'text-[#554F49] hover:text-[#111111]'
            }`}
          >
            Date Span & Difference
          </button>
        </div>
      </div>

      {/* MODE 1: AGE FROM DOB */}
      {subTab === 'dob' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-6 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase font-bold text-[#554F49] block mb-1">
                  1. Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D6B46A]/35 rounded-2xl font-mono text-base font-bold text-[#111111] focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              {/* Quick presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[#8A8178] block">Quick Age Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '18 Yrs', years: 18 },
                    { label: '21 Yrs', years: 21 },
                    { label: '25 Yrs', years: 25 },
                    { label: '30 Yrs', years: 30 },
                    { label: '40 Yrs', years: 40 },
                    { label: '50 Yrs', years: 50 },
                  ].map(p => {
                    const d = new Date();
                    d.setFullYear(d.getFullYear() - p.years);
                    const iso = d.toISOString().split('T')[0];
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => { if (soundEnabled) playKeyAudio(); setBirthDate(iso); }}
                        className="px-2.5 py-1 bg-[#FFFDF8] hover:bg-[#F4EEDC] border border-[#D6B46A]/30 rounded-xl text-xs font-mono text-[#554F49] cursor-pointer transition-colors"
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age As Of Date (Cutoff date for exams/jobs) */}
              <div className="pt-2 border-t border-[#D6B46A]/20">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#554F49] block">
                    2. Age As Of Date (Cutoff Target)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playKeyAudio();
                      setAsOfDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="text-[11px] font-mono text-[#A68936] hover:underline cursor-pointer"
                  >
                    Reset to Today
                  </button>
                </div>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D6B46A]/35 rounded-2xl font-mono text-base font-bold text-[#111111] focus:outline-none focus:border-[#D6B46A]"
                />
                <p className="text-[11px] font-mono text-[#8A8178] mt-1">
                  *Crucial for Govt Exam Age Cutoffs (e.g. UPSC, SSC CGL 01-08-2024 or 01-01-2025).
                </p>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#111111] text-soft-ivory p-6 sm:p-8 rounded-[32px] border border-[#D6B46A]/35 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
                  Chronological Age Precision
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  Verified Accurate
                </span>
              </div>

              {ageData && !('error' in ageData) && (
                <div className="space-y-6">
                  {/* Primary Big Metric */}
                  <div className="p-4 rounded-2xl bg-[#161616] border border-[#D6B46A]/25">
                    <div className="text-xs font-mono text-[#8A8178] uppercase mb-1">Exact Current Age</div>
                    <div className="flex flex-wrap items-baseline gap-2 text-white">
                      <span className="text-4xl sm:text-5xl font-display font-black text-[#D6B46A]">
                        {ageData.years}
                      </span>
                      <span className="text-sm font-mono text-neutral-300">Years</span>
                      <span className="text-3xl sm:text-4xl font-display font-black text-white ml-2">
                        {ageData.months}
                      </span>
                      <span className="text-sm font-mono text-neutral-300">Months</span>
                      <span className="text-2xl sm:text-3xl font-display font-black text-white ml-2">
                        {ageData.days}
                      </span>
                      <span className="text-sm font-mono text-neutral-300">Days</span>
                    </div>
                  </div>

                  {/* Secondary Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                      <span className="text-[#8A8178] block text-[10px] uppercase">Total Months</span>
                      <span className="text-white font-bold text-base">{ageData.totalMonths.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                      <span className="text-[#8A8178] block text-[10px] uppercase">Weeks & Days</span>
                      <span className="text-white font-bold text-sm">{ageData.totalWeeks} Wks + {ageData.remDays} D</span>
                    </div>
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                      <span className="text-[#8A8178] block text-[10px] uppercase">Total Days</span>
                      <span className="text-[#D6B46A] font-bold text-base">{ageData.totalDays.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                      <span className="text-[#8A8178] block text-[10px] uppercase">Total Hours</span>
                      <span className="text-white font-bold text-sm">{ageData.totalHours.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                      <span className="text-[#8A8178] block text-[10px] uppercase">Total Minutes</span>
                      <span className="text-white font-bold text-sm">{ageData.totalMinutes.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                      <span className="text-[#8A8178] block text-[10px] uppercase">Seconds Lived</span>
                      <span className="text-emerald-400 font-bold text-sm font-mono">
                        {(ageData.totalDays * 86400 + (currentSeconds % 86400)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Next Birthday & Astrology Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#D6B46A]/20 text-xs font-mono">
                    <div className="p-3.5 bg-[#181818] rounded-2xl border border-[#D6B46A]/25 space-y-1">
                      <span className="text-[#D6B46A] font-bold block text-[11px] uppercase">
                        🎂 Next Birthday
                      </span>
                      <div className="text-white font-bold text-sm">
                        {ageData.daysToNextBday} Days Left
                      </div>
                      <div className="text-[10px] text-[#8A8178]">
                        Falls on a <span className="text-white font-bold">{ageData.nextBdayDayName}</span> (Turning {ageData.turningAge})
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#181818] rounded-2xl border border-[#D6B46A]/25 space-y-1">
                      <span className="text-[#D6B46A] font-bold block text-[11px] uppercase">
                        ✨ Sun Sign & Zodiac
                      </span>
                      <div className="text-white font-bold text-sm flex items-center gap-1.5">
                        <span>{ageData.zodiac.symbol}</span>
                        <span>{ageData.zodiac.name}</span>
                        <span className="text-[10px] text-[#8A8178]">({ageData.zodiac.element})</span>
                      </div>
                      <div className="text-[10px] text-[#8A8178]">
                        Chinese: <span className="text-white font-bold">{ageData.chinese}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {ageData && 'error' in ageData && (
                <div className="p-4 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-mono">
                  {ageData.error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DATE DIFFERENCE */}
      {subTab === 'diff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h4 className="font-display font-bold text-lg text-[#111111]">
              Difference Between Two Dates
            </h4>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase font-bold text-[#554F49] block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D6B46A]/35 rounded-2xl font-mono text-base font-bold text-[#111111] focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-bold text-[#554F49] block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D6B46A]/35 rounded-2xl font-mono text-base font-bold text-[#111111] focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-mono text-[#554F49] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={includeEndDay}
                  onChange={(e) => setIncludeEndDay(e.target.checked)}
                  className="rounded border-[#D6B46A]/40 text-[#D6B46A] focus:ring-[#D6B46A]"
                />
                <span>Include end date in calculation (1 extra day)</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#111111] text-soft-ivory p-6 sm:p-8 rounded-[32px] border border-[#D6B46A]/35 shadow-xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
              Calculated Duration Span
            </span>

            {dateDiffData && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#161616] border border-[#D6B46A]/25">
                  <div className="text-xs font-mono text-[#8A8178] uppercase mb-1">Total Duration</div>
                  <div className="flex flex-wrap items-baseline gap-2 text-white">
                    <span className="text-3xl sm:text-4xl font-display font-black text-[#D6B46A]">
                      {dateDiffData.years}
                    </span>
                    <span className="text-xs font-mono text-neutral-300">Yrs</span>
                    <span className="text-3xl sm:text-4xl font-display font-black text-white ml-2">
                      {dateDiffData.months}
                    </span>
                    <span className="text-xs font-mono text-neutral-300">Mos</span>
                    <span className="text-3xl sm:text-4xl font-display font-black text-white ml-2">
                      {dateDiffData.days}
                    </span>
                    <span className="text-xs font-mono text-neutral-300">Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                    <span className="text-[#8A8178] block text-[10px] uppercase">Total Days</span>
                    <span className="text-[#D6B46A] font-bold text-base">{dateDiffData.totalDays.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                    <span className="text-[#8A8178] block text-[10px] uppercase">Total Weeks</span>
                    <span className="text-white font-bold text-base">{dateDiffData.totalWeeks.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#D6B46A]/20">
                    <span className="text-[#8A8178] block text-[10px] uppercase">Work Days (M-F)</span>
                    <span className="text-emerald-400 font-bold text-base">{dateDiffData.workingDays.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEO Knowledge & High-Precision Chronometer Guide */}
      <div className="p-6 rounded-3xl bg-white border border-[#D6B46A]/20 space-y-4 text-xs font-mono text-[#554F49] shadow-xs">
        <div className="flex items-center gap-2 text-[#A68936] font-bold uppercase tracking-wider text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-[#D6B46A]" />
          <span>High-Precision Age & Calendar Calculation Guide</span>
        </div>
        <p className="text-[12px] leading-relaxed text-[#333333]">
          Whether you are calculating exact age eligibility for competitive recruitment exams like <strong className="text-[#111111]">UPSC, SSC CGL, Banking, or Defense services</strong>, or determining age for visa and insurance applications, this chronometer computes exact calendar age down to the day, month, and year with leap year calibration.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
          {[
            'online age calculator', 'dob age calculator', 'age in years months days',
            'exact age cutoff', 'next birthday countdown', 'date difference calculator', 
            'working days calculator', 'zodiac sign by date of birth'
          ].map(k => (
            <span key={k} className="px-2.5 py-1 bg-[#F9F7F1] border border-[#D6B46A]/25 rounded-lg text-[#665D53]">
              #{k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
