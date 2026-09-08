import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calculator, Percent, ArrowRightLeft, DollarSign, Binary, 
  Calendar, Volume2, VolumeX, History, RotateCcw, Copy, 
  Check, ShieldCheck, Sparkles, TrendingUp, Info, ChevronRight, Zap
} from 'lucide-react';

type CalcMode = 'scientific' | 'financial' | 'units' | 'programmer' | 'date';

// Simple click sound using Web Audio API
const playKeyAudio = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore audio error
  }
};

export default function UniversalCalculator() {
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Trigger sound if enabled
  const triggerAudio = () => {
    if (soundEnabled) playKeyAudio();
  };

  return (
    <div className="space-y-8" id="universal-calculator-suite">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D6B46A]/25 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#D6B46A] flex items-center justify-center border border-[#D6B46A]/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">
              Universal Multi-Paradigm Calculator
            </h2>
            <p className="text-xs text-[#8A8178]">
              Scientific, Financial & EMI, Universal Unit Converter, Programmer Hex/Bin & Date Math.
            </p>
          </div>
        </div>

        {/* Audio click feedback toggle & Status */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer border ${
              soundEnabled 
                ? 'bg-[#111111] text-[#D6B46A] border-[#111111]' 
                : 'bg-white text-[#8A8178] border-[#D6B46A]/25 hover:text-[#111111]'
            }`}
            title="Toggle mechanical key audio feedback"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Precision Math Engine
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#D6B46A]/30 rounded-2xl w-fit shadow-xs">
        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('scientific'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            mode === 'financial'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Financial & EMI & GST</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('units'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            mode === 'programmer'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>Programmer (Hex/Bin)</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerAudio(); setMode('date'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            mode === 'date'
              ? 'bg-[#111111] text-[#D6B46A] shadow-xs'
              : 'text-[#554F49] hover:text-[#111111] hover:bg-neutral-100/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Age & Date Math</span>
        </button>
      </div>

      {/* Calculator Body Rendering */}
      <div>
        {mode === 'scientific' && <ScientificCalculator soundEnabled={soundEnabled} />}
        {mode === 'financial' && <FinancialCalculator soundEnabled={soundEnabled} />}
        {mode === 'units' && <UnitConverterCalculator soundEnabled={soundEnabled} />}
        {mode === 'programmer' && <ProgrammerCalculator soundEnabled={soundEnabled} />}
        {mode === 'date' && <DateAgeCalculator soundEnabled={soundEnabled} />}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. SCIENTIFIC CALCULATOR COMPONENT
// -------------------------------------------------------------
function ScientificCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [isRad, setIsRad] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const press = (val: string) => {
    if (soundEnabled) playKeyAudio();
    if (displayValue === '0' && !isNaN(Number(val))) {
      setDisplayValue(val);
      setExpression(val);
    } else {
      setDisplayValue(prev => prev + val);
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
    try {
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**');

      // Factorial parsing: n!
      sanitized = sanitized.replace(/(\d+)!/g, (_, n) => {
        let num = parseInt(n, 10);
        if (num > 170) return 'Infinity';
        let res = 1;
        for (let i = 2; i <= num; i++) res *= i;
        return res.toString();
      });

      // Handle trig
      if (!isRad) {
        // DEG mode
        sanitized = sanitized
          .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      } else {
        sanitized = sanitized
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(');
      }

      // sqrt & logs
      sanitized = sanitized
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/cbrt\(/g, 'Math.cbrt(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(');

      // Safe evaluation with math tokens only
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      let formattedResult = '';
      if (typeof result === 'number') {
        if (isNaN(result) || !isFinite(result)) {
          formattedResult = 'Error';
        } else {
          // Format reasonable decimal digits
          formattedResult = Number(result.toFixed(10)).toString();
        }
      } else {
        formattedResult = 'Error';
      }

      setHistory(prev => [{ expr: expression, result: formattedResult }, ...prev.slice(0, 19)]);
      setDisplayValue(formattedResult);
      setExpression(formattedResult);
    } catch (err) {
      setDisplayValue('Error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing when inputs are focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key >= '0' && e.key <= '9') press(e.key);
      else if (e.key === '.') press('.');
      else if (e.key === '+') press('+');
      else if (e.key === '-') press('-');
      else if (e.key === '*') press('×');
      else if (e.key === '/') { e.preventDefault(); press('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculateResult(); }
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clearAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Main Realistic Calculator Body */}
      <div className="lg:col-span-8 bg-[#161616] p-6 sm:p-8 rounded-[36px] border border-[#D6B46A]/35 shadow-2xl relative overflow-hidden">
        {/* Soft Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Metallic Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D6B46A]/15 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A]" />
            <span className="font-bold text-white uppercase tracking-widest text-[11px]">
              SAMAXON FX-991 PRO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRad(!isRad)}
              className="px-2.5 py-1 rounded bg-[#222222] border border-[#D6B46A]/20 text-[10px] uppercase font-bold text-[#D6B46A] hover:bg-[#2a2a2a] cursor-pointer"
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>

            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-[#8A8178] hover:text-[#D6B46A] transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px]"
              title="Toggle History Tape"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Realistic High-Contrast Display Screen */}
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#080808] border border-[#D6B46A]/30 text-right shadow-inner relative group">
          <div className="min-h-5 text-xs sm:text-sm font-mono text-[#8A8178] tracking-wider truncate mb-1">
            {expression || '0'}
          </div>
          <div className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none">
            {displayValue}
          </div>

          <button
            type="button"
            onClick={copyToClipboard}
            className="absolute top-3 left-3 p-1.5 rounded-lg bg-[#161616] text-[#8A8178] hover:text-[#D6B46A] opacity-70 hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 text-[10px] font-mono"
            title="Copy Result"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Scientific Button Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5 select-none">
          {/* Row 1: Memory & Function switches */}
          <button 
            type="button"
            onClick={() => { setMemory(0); if (soundEnabled) playKeyAudio(); }} 
            className="calc-fn-key"
          >MC</button>
          <button 
            type="button"
            onClick={() => { setDisplayValue(memory.toString()); setExpression(prev => prev + memory.toString()); if (soundEnabled) playKeyAudio(); }} 
            className="calc-fn-key"
          >MR</button>
          <button 
            type="button"
            onClick={() => { setMemory(prev => prev + parseFloat(displayValue || '0')); if (soundEnabled) playKeyAudio(); }} 
            className="calc-fn-key"
          >M+</button>
          <button 
            type="button"
            onClick={() => { setMemory(prev => prev - parseFloat(displayValue || '0')); if (soundEnabled) playKeyAudio(); }} 
            className="calc-fn-key"
          >M-</button>
          <button 
            type="button"
            onClick={clearAll} 
            className="col-span-2 sm:col-span-2 py-3 px-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-300 font-mono font-bold text-xs sm:text-sm hover:bg-rose-900/50 active:scale-95 transition-all cursor-pointer"
          >AC / Clear</button>

          {/* Row 2: Trig & Powers */}
          <button type="button" onClick={() => press('sin(')} className="calc-fn-key">sin</button>
          <button type="button" onClick={() => press('cos(')} className="calc-fn-key">cos</button>
          <button type="button" onClick={() => press('tan(')} className="calc-fn-key">tan</button>
          <button type="button" onClick={() => press('π')} className="calc-fn-key">π</button>
          <button type="button" onClick={() => press('e')} className="calc-fn-key">e</button>
          <button type="button" onClick={backspace} className="calc-fn-key text-amber-300">⌫</button>

          {/* Row 3: Advanced Math */}
          <button type="button" onClick={() => press('sqrt(')} className="calc-fn-key">√x</button>
          <button type="button" onClick={() => press('^2')} className="calc-fn-key">x²</button>
          <button type="button" onClick={() => press('^')} className="calc-fn-key">xʸ</button>
          <button type="button" onClick={() => press('ln(')} className="calc-fn-key">ln</button>
          <button type="button" onClick={() => press('log(')} className="calc-fn-key">log</button>
          <button type="button" onClick={() => press('!')} className="calc-fn-key">n!</button>

          {/* Row 4: Numbers & Core Operators */}
          <button type="button" onClick={() => press('(')} className="calc-fn-key">(</button>
          <button type="button" onClick={() => press(')')} className="calc-fn-key">)</button>
          <button type="button" onClick={() => press('%')} className="calc-fn-key">%</button>
          <button type="button" onClick={() => press('÷')} className="calc-op-key">÷</button>
          <button type="button" onClick={() => press('×')} className="calc-op-key">×</button>
          <button type="button" onClick={() => press('-')} className="calc-op-key">-</button>

          {/* Row 5: 7 8 9 + */}
          <button type="button" onClick={() => press('7')} className="calc-num-key">7</button>
          <button type="button" onClick={() => press('8')} className="calc-num-key">8</button>
          <button type="button" onClick={() => press('9')} className="calc-num-key">9</button>
          <button type="button" onClick={() => press('+')} className="calc-op-key sm:col-span-3">+</button>

          {/* Row 6: 4 5 6 */}
          <button type="button" onClick={() => press('4')} className="calc-num-key">4</button>
          <button type="button" onClick={() => press('5')} className="calc-num-key">5</button>
          <button type="button" onClick={() => press('6')} className="calc-num-key">6</button>
          <button type="button" onClick={() => press('1/(')} className="calc-fn-key">1/x</button>
          <button type="button" onClick={() => press('cbrt(')} className="calc-fn-key">∛x</button>
          <button type="button" onClick={() => press('*0.01')} className="calc-fn-key">0.01x</button>

          {/* Row 7: 1 2 3 */}
          <button type="button" onClick={() => press('1')} className="calc-num-key">1</button>
          <button type="button" onClick={() => press('2')} className="calc-num-key">2</button>
          <button type="button" onClick={() => press('3')} className="calc-num-key">3</button>
          <button 
            type="button" 
            onClick={calculateResult} 
            className="row-span-2 col-span-3 py-4 rounded-2xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] text-[#111111] font-mono font-black text-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center justify-center border border-[#D6B46A]"
          >
            =
          </button>

          {/* Row 8: 0 . ± */}
          <button type="button" onClick={() => press('0')} className="calc-num-key col-span-1">0</button>
          <button type="button" onClick={() => press('.')} className="calc-num-key">.</button>
          <button 
            type="button" 
            onClick={() => {
              if (displayValue.startsWith('-')) {
                setDisplayValue(displayValue.substring(1));
              } else {
                setDisplayValue('-' + displayValue);
              }
            }} 
            className="calc-num-key"
          >
            ±
          </button>
        </div>
      </div>

      {/* Side History & Formulas Reel */}
      <div className="lg:col-span-4 space-y-6">
        {/* History Tape Box */}
        <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#D6B46A]" />
              <h3 className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider">
                Calculation History Tape
              </h3>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-[#8A8178]">
                No calculations recorded yet. Key in numbers to begin.
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setDisplayValue(item.result);
                    setExpression(item.result);
                    if (soundEnabled) playKeyAudio();
                  }}
                  className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#D6B46A]/20 hover:border-[#D6B46A] transition-colors cursor-pointer text-right space-y-0.5"
                  title="Click to restore to calculator"
                >
                  <div className="text-[11px] font-mono text-[#8A8178] truncate">{item.expr} =</div>
                  <div className="text-sm font-mono font-bold text-[#111111]">{item.result}</div>
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
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">0-9</kbd> Enter Numbers</div>
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">+-*/</kbd> Operators</div>
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">Enter</kbd> Equals (=)</div>
            <div><kbd className="px-1.5 py-0.5 bg-white border border-[#D6B46A]/30 rounded text-[10px]">Esc</kbd> Clear All</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. FINANCIAL CALCULATOR COMPONENT (LOAN, EMI, GST, SIP)
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
    if (r === 0 || n === 0) return { emi: 0, totalInterest: 0, totalPayment: P };

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
      <div className="flex gap-2 border-b border-[#D6B46A]/20 pb-4">
        <button
          type="button"
          onClick={() => setFinTab('emi')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
            finTab === 'emi' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-white text-[#554F49] hover:text-[#111111]'
          }`}
        >
          Home & Personal Loan EMI
        </button>
        <button
          type="button"
          onClick={() => setFinTab('gst')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
            finTab === 'gst' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-white text-[#554F49] hover:text-[#111111]'
          }`}
        >
          GST & Tax Calculator
        </button>
        <button
          type="button"
          onClick={() => setFinTab('sip')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
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

            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <label className="text-[#554F49] uppercase">Loan Amount</label>
                <span className="text-[#111111] text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="50000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8A8178]">
                <span>₹50K</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <label className="text-[#554F49] uppercase">Interest Rate (% P.A.)</label>
                <span className="text-[#111111] text-sm">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8A8178]">
                <span>1%</span>
                <span>8.5% (Prime)</span>
                <span>25%</span>
              </div>
            </div>

            {/* Tenure Years */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <label className="text-[#554F49] uppercase">Loan Tenure (Years)</label>
                <span className="text-[#111111] text-sm">{tenureYears} Years ({tenureYears * 12} Months)</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8A8178]">
                <span>1 Yr</span>
                <span>15 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>
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
              Indian GST & Reverse Tax Solver
            </h3>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-[#554F49]">
                Base Invoice / Transaction Amount (₹)
              </label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl font-mono text-lg font-bold text-[#111111]"
              />
            </div>

            {/* Add vs Remove GST */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-[#554F49]">
                Calculation Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGstType('add')}
                  className={`py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                    gstType === 'add'
                      ? 'bg-[#111111] text-[#D6B46A] border-[#111111]'
                      : 'bg-white text-[#554F49] border-[#D6B46A]/25'
                  }`}
                >
                  Add GST (Net → Gross)
                </button>
                <button
                  type="button"
                  onClick={() => setGstType('remove')}
                  className={`py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                    gstType === 'remove'
                      ? 'bg-[#111111] text-[#D6B46A] border-[#111111]'
                      : 'bg-white text-[#554F49] border-[#D6B46A]/25'
                  }`}
                >
                  Remove GST (Gross → Net)
                </button>
              </div>
            </div>

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
                        ? 'bg-[#D6B46A] text-[#111111] border-[#D6B46A]'
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

            {/* Monthly Investment */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <label className="text-[#554F49] uppercase">Monthly SIP Investment (₹)</label>
                <span className="text-[#111111] text-sm">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="200000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
            </div>

            {/* Return Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <label className="text-[#554F49] uppercase">Expected Annual Return (%)</label>
                <span className="text-[#111111] text-sm">{sipReturnRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="0.5"
                value={sipReturnRate}
                onChange={(e) => setSipReturnRate(Number(e.target.value))}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
            </div>

            {/* Tenure Years */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <label className="text-[#554F49] uppercase">Investment Horizon</label>
                <span className="text-[#111111] text-sm">{sipYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full accent-[#D6B46A] cursor-pointer"
              />
            </div>
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
      { id: 'b', name: 'Byte (B)', toBase: 1 },
      { id: 'kb', name: 'Kilobyte (KB)', toBase: 1024 },
      { id: 'mb', name: 'Megabyte (MB)', toBase: 1048576 },
      { id: 'gb', name: 'Gigabyte (GB)', toBase: 1073741824 },
      { id: 'tb', name: 'Terabyte (TB)', toBase: 1099511627776 }
    ]
  },
  speed: {
    label: 'Speed & Velocity',
    units: [
      { id: 'kmh', name: 'Km/h', toBase: 1 },
      { id: 'ms', name: 'Metre/sec (m/s)', toBase: 3.6 },
      { id: 'mph', name: 'Miles/hour (mph)', toBase: 1.60934 },
      { id: 'knot', name: 'Knots', toBase: 1.852 }
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
                  ? 'bg-[#111111] text-[#D6B46A]'
                  : 'bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#554F49] hover:text-[#111111]'
              }`}
            >
              {data.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* From Side */}
        <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 space-y-3">
          <label className="text-xs font-mono uppercase font-bold text-[#8A8178]">From</label>
          <input
            type="number"
            value={valFrom}
            onChange={(e) => setValFrom(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-white border border-[#D6B46A]/30 rounded-xl font-mono text-2xl font-bold text-[#111111]"
          />
          <select
            value={unitFrom}
            onChange={(e) => setUnitFrom(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold text-[#111111]"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* To Side */}
        <div className="p-6 rounded-2xl bg-[#111111] text-soft-ivory border border-[#D6B46A]/30 space-y-3">
          <label className="text-xs font-mono uppercase font-bold text-[#D6B46A]">Equals To</label>
          <div className="w-full px-4 py-3 bg-[#080808] border border-[#D6B46A]/30 rounded-xl font-mono text-2xl font-black text-white overflow-x-auto">
            {convertedValue}
          </div>
          <select
            value={unitTo}
            onChange={(e) => setUnitTo(e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#D6B46A]/30 rounded-xl text-xs font-mono font-bold text-[#D6B46A]"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. PROGRAMMER CALCULATOR (HEX, DEC, OCT, BIN)
// -------------------------------------------------------------
function ProgrammerCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [val, setVal] = useState<number>(42);

  const hexStr = val.toString(16).toUpperCase();
  const decStr = val.toString(10);
  const octStr = val.toString(8);
  const binStr = (val >>> 0).toString(2).padStart(16, '0');

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
        <div className="p-4 rounded-xl bg-[#080808] border border-[#D6B46A]/25 space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#D6B46A]">HEX (Hexadecimal)</span>
          <div className="text-xl font-bold text-white tracking-wider">0x{hexStr}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#080808] border border-[#D6B46A]/25 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">DEC (Decimal)</span>
          <div className="text-xl font-bold text-white tracking-wider">{decStr}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#080808] border border-[#D6B46A]/25 space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-400">OCT (Octal)</span>
          <div className="text-xl font-bold text-white tracking-wider">0o{octStr}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#080808] border border-[#D6B46A]/25 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">BIN (Binary 16-Bit)</span>
          <div className="text-sm font-bold text-white tracking-widest break-all">{binStr}</div>
        </div>
      </div>

      {/* Input controls & bit shifts */}
      <div className="space-y-4">
        <label className="text-xs font-mono uppercase font-bold text-[#8A8178] block">
          Modify Value (Decimal Input)
        </label>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(parseInt(e.target.value, 10) || 0)}
          className="w-full px-4 py-3 bg-[#080808] border border-[#D6B46A]/30 rounded-xl font-mono text-xl font-bold text-white"
        />

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setVal(v => v << 1)}
            className="px-4 py-2 bg-[#222222] hover:bg-[#333333] border border-[#D6B46A]/20 rounded-xl text-xs font-mono font-bold text-[#D6B46A] cursor-pointer"
          >
            LSH (&lt;&lt; 1)
          </button>
          <button
            type="button"
            onClick={() => setVal(v => v >> 1)}
            className="px-4 py-2 bg-[#222222] hover:bg-[#333333] border border-[#D6B46A]/20 rounded-xl text-xs font-mono font-bold text-[#D6B46A] cursor-pointer"
          >
            RSH (&gt;&gt; 1)
          </button>
          <button
            type="button"
            onClick={() => setVal(v => ~v)}
            className="px-4 py-2 bg-[#222222] hover:bg-[#333333] border border-[#D6B46A]/20 rounded-xl text-xs font-mono font-bold text-[#D6B46A] cursor-pointer"
          >
            NOT (~)
          </button>
          <button
            type="button"
            onClick={() => setVal(0)}
            className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 rounded-xl text-xs font-mono font-bold text-rose-300 cursor-pointer"
          >
            Reset 0
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. DATE & AGE CALCULATOR
// -------------------------------------------------------------
function DateAgeCalculator({ soundEnabled }: { soundEnabled: boolean }) {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');

  const ageData = useMemo(() => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    return { years, months, days, totalDays, totalHours };
  }, [birthDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-6 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h3 className="font-display font-bold text-xl text-[#111111]">
          Exact Age & Milestone Chronometer
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase font-bold text-[#554F49]">
            Select Date of Birth / Event Origin
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-xl font-mono text-base font-bold text-[#111111]"
          />
        </div>
      </div>

      <div className="lg:col-span-6 bg-[#111111] text-soft-ivory p-6 sm:p-8 rounded-[32px] border border-[#D6B46A]/35 shadow-xl space-y-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
          Chronological Age Precision
        </span>

        {ageData && (
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-black text-white">{ageData.years}</span>
              <span className="text-lg font-mono text-[#D6B46A]">Years</span>
              <span className="text-3xl font-display font-black text-white ml-2">{ageData.months}</span>
              <span className="text-sm font-mono text-[#8A8178]">Months</span>
              <span className="text-2xl font-display font-black text-white ml-2">{ageData.days}</span>
              <span className="text-xs font-mono text-[#8A8178]">Days</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#D6B46A]/20 font-mono text-xs">
              <div className="p-3 bg-[#080808] rounded-xl border border-[#D6B46A]/20">
                <span className="text-[#8A8178] block text-[10px] uppercase">Total Days</span>
                <span className="text-white font-bold text-base">{ageData.totalDays.toLocaleString('en-IN')} Days</span>
              </div>
              <div className="p-3 bg-[#080808] rounded-xl border border-[#D6B46A]/20">
                <span className="text-[#8A8178] block text-[10px] uppercase">Total Hours</span>
                <span className="text-[#D6B46A] font-bold text-base">{ageData.totalHours.toLocaleString('en-IN')} Hours</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
