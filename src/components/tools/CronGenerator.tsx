import React, { useState, useMemo } from 'react';
import { 
  Clock, CheckCircle2, AlertTriangle, Copy, RotateCcw, 
  Sparkles, Calendar, ArrowRight, Play, Info, HelpCircle
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, ResetButton } from './common/ToolActions';

interface CronPreset {
  name: string;
  expression: string;
  description: string;
}

const PRESETS: CronPreset[] = [
  { name: 'Every Minute', expression: '* * * * *', description: 'Runs every single minute' },
  { name: 'Every 5 Minutes', expression: '*/5 * * * *', description: 'Runs every 5th minute' },
  { name: 'Every 15 Minutes', expression: '*/15 * * * *', description: 'Runs every 15th minute' },
  { name: 'Every 30 Minutes', expression: '*/30 * * * *', description: 'Runs every 30th minute' },
  { name: 'Every Hour', expression: '0 * * * *', description: 'Runs at minute 0 of every hour' },
  { name: 'Every 6 Hours', expression: '0 */6 * * *', description: 'Runs every 6 hours on the hour' },
  { name: 'Daily at Midnight', expression: '0 0 * * *', description: 'Runs every day at 00:00 (12:00 AM)' },
  { name: 'Daily at 9:00 AM', expression: '0 9 * * *', description: 'Runs every morning at 09:00 AM' },
  { name: 'Weekdays at 9:00 AM', expression: '0 9 * * 1-5', description: 'Runs Monday through Friday at 09:00 AM' },
  { name: 'Weekly on Sunday', expression: '0 0 * * 0', description: 'Runs every Sunday at midnight' },
  { name: 'Monthly (1st at Midnight)', expression: '0 0 1 * *', description: 'Runs on day 1 of every month at midnight' },
  { name: 'Quarterly', expression: '0 0 1 1,4,7,10 *', description: 'Runs on 1st of Jan, Apr, Jul, Oct' }
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Deterministic Cron Field Validation & Explanation
function parseCronField(val: string, min: number, max: number, name: string): { valid: boolean; text: string; error?: string; matches: (n: number) => boolean } {
  const trimmed = val.trim();
  if (trimmed === '*') {
    return { valid: true, text: `every ${name}`, matches: () => true };
  }

  // Step */n or m/n
  if (trimmed.includes('/')) {
    const [startPart, stepPart] = trimmed.split('/');
    const step = parseInt(stepPart, 10);
    if (isNaN(step) || step <= 0) {
      return { valid: false, text: '', error: `Invalid step in ${name}: /${stepPart}`, matches: () => false };
    }
    const start = startPart === '*' ? min : parseInt(startPart, 10);
    if (isNaN(start) || start < min || start > max) {
      return { valid: false, text: '', error: `Invalid start value in ${name}: ${startPart}`, matches: () => false };
    }
    return {
      valid: true,
      text: `every ${step} ${name}s starting at ${start}`,
      matches: (n) => n >= start && n <= max && (n - start) % step === 0
    };
  }

  // Range x-y
  if (trimmed.includes('-')) {
    const [startStr, endStr] = trimmed.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
      return { valid: false, text: '', error: `Invalid range in ${name}: ${trimmed}`, matches: () => false };
    }
    return {
      valid: true,
      text: `every ${name} from ${start} through ${end}`,
      matches: (n) => n >= start && n <= end
    };
  }

  // Comma-separated list x,y,z
  const parts = trimmed.split(',');
  const numbers: number[] = [];
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (isNaN(n) || n < min || n > max) {
      return { valid: false, text: '', error: `Value ${p} out of range (${min}-${max}) in ${name}`, matches: () => false };
    }
    numbers.push(n);
  }

  return {
    valid: true,
    text: `at ${name} ${numbers.join(', ')}`,
    matches: (n) => numbers.includes(n)
  };
}

// Full Deterministic Cron Parser
function explainCron(expression: string) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      error: `Standard cron requires exactly 5 fields (minute, hour, day of month, month, day of week). Found ${parts.length} parts.`,
      fields: null,
      summary: '',
      nextDates: []
    };
  }

  const [minStr, hourStr, domStr, monStr, dowStr] = parts;
  const minute = parseCronField(minStr, 0, 59, 'minute');
  const hour = parseCronField(hourStr, 0, 23, 'hour');
  const dom = parseCronField(domStr, 1, 31, 'day of month');
  const month = parseCronField(monStr, 1, 12, 'month');
  const dow = parseCronField(dowStr, 0, 6, 'day of week');

  const error = minute.error || hour.error || dom.error || month.error || dow.error;
  if (error) {
    return { valid: false, error, fields: null, summary: '', nextDates: [] };
  }

  // Human-readable summary
  let summary = '';
  if (minStr === '*' && hourStr === '*' && domStr === '*' && monStr === '*' && dowStr === '*') {
    summary = 'At every minute of every day.';
  } else if (minStr.startsWith('*/') && hourStr === '*' && domStr === '*' && monStr === '*' && dowStr === '*') {
    summary = `At every ${minStr.split('/')[1]}th minute past every hour.`;
  } else if (domStr === '*' && dowStr === '1-5' && monStr === '*') {
    summary = `At ${hourStr.padStart(2, '0')}:${minStr.padStart(2, '0')}, Monday through Friday.`;
  } else {
    summary = `${minute.text}, ${hour.text}, on ${dom.text}, in ${month.text}, on ${dow.text}.`;
  }

  // Calculate Next 5 Execution Times Deterministically
  const nextDates: Date[] = [];
  const curr = new Date();
  curr.setSeconds(0, 0);
  // Add 1 minute to start looking from future
  curr.setMinutes(curr.getMinutes() + 1);

  let iterations = 0;
  // Look up to 366 days in 1-minute steps
  while (nextDates.length < 5 && iterations < 525600) {
    iterations++;
    const m = curr.getMinutes();
    const h = curr.getHours();
    const d = curr.getDate();
    const mo = curr.getMonth() + 1;
    const dw = curr.getDay();

    if (
      minute.matches(m) &&
      hour.matches(h) &&
      dom.matches(d) &&
      month.matches(mo) &&
      dow.matches(dw)
    ) {
      nextDates.push(new Date(curr));
      // jump 1 minute
      curr.setMinutes(curr.getMinutes() + 1);
    } else {
      curr.setMinutes(curr.getMinutes() + 1);
    }
  }

  return {
    valid: true,
    error: null,
    summary,
    fields: {
      minute: { raw: minStr, explanation: minute.text },
      hour: { raw: hourStr, explanation: hour.text },
      dom: { raw: domStr, explanation: dom.text },
      month: { raw: monStr, explanation: month.text },
      dow: { raw: dowStr, explanation: dow.text }
    },
    nextDates
  };
}

export default function CronGenerator() {
  const [expression, setExpression] = useState('*/15 0 1,15 * *');
  const [activeBuilderTab, setActiveBuilderTab] = useState<'minutes' | 'hours' | 'days' | 'months' | 'weekdays'>('minutes');

  // Interactive Builder State
  const [minuteMode, setMinuteMode] = useState<'every' | 'step' | 'specific'>('every');
  const [minuteStep, setMinuteStep] = useState(5);
  const [minuteSpecific, setMinuteSpecific] = useState<number[]>([0]);

  const [hourMode, setHourMode] = useState<'every' | 'specific'>('every');
  const [hourSpecific, setHourSpecific] = useState<number[]>([0]);

  const [dayMode, setDayMode] = useState<'every' | 'specific'>('every');
  const [daySpecific, setDaySpecific] = useState<number[]>([1]);

  const [monthMode, setMonthMode] = useState<'every' | 'specific'>('every');
  const [monthSpecific, setMonthSpecific] = useState<number[]>([1]);

  const [dowMode, setDowMode] = useState<'every' | 'specific'>('every');
  const [dowSpecific, setDowSpecific] = useState<number[]>([1]);

  // Sync Visual Builder to Expression
  const syncBuilderToExpression = () => {
    const minVal = minuteMode === 'every' ? '*' : minuteMode === 'step' ? `*/${minuteStep}` : minuteSpecific.sort((a,b)=>a-b).join(',') || '*';
    const hourVal = hourMode === 'every' ? '*' : hourSpecific.sort((a,b)=>a-b).join(',') || '*';
    const dayVal = dayMode === 'every' ? '*' : daySpecific.sort((a,b)=>a-b).join(',') || '*';
    const monVal = monthMode === 'every' ? '*' : monthSpecific.sort((a,b)=>a-b).join(',') || '*';
    const dowVal = dowMode === 'every' ? '*' : dowSpecific.sort((a,b)=>a-b).join(',') || '*';

    setExpression(`${minVal} ${hourVal} ${dayVal} ${monVal} ${dowVal}`);
  };

  const parsed = useMemo(() => explainCron(expression), [expression]);

  return (
    <div className="space-y-8 text-left" id="cron-generator">
      <ToolHeader
        title="Cron Expression Generator & Explainer"
        description="Generate, inspect, and decode standard 5-field crontab schedules into plain English with deterministic validation and upcoming execution timelines."
        icon={Clock}
        categoryName="Development & QA"
        categorySlug="development-qa"
        badgeText="100% DETERMINISTIC · REAL-TIME"
      />

      {/* Main Interactive Expression Workspace */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-2">
          <label htmlFor="cron-input" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 block">
            Cron Expression (5 Standard Fields)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              id="cron-input"
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. */15 0 1,15 * *"
              spellCheck={false}
              className="flex-1 px-4 py-3.5 bg-neutral-900 text-neutral-100 font-mono text-base sm:text-lg rounded-2xl focus:outline-none selection:bg-[#D6B46A]/30 border border-neutral-800"
            />
            <div className="flex items-center gap-2">
              <CopyButton textToCopy={expression} label="Copy Cron" />
              <ResetButton onReset={() => setExpression('0 0 * * *')} label="Reset" />
            </div>
          </div>
        </div>

        {/* Diagnostic Status */}
        {parsed.valid ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Valid Crontab Schedule</span>
            </div>
            <p className="text-sm font-display font-bold text-neutral-900 capitalize">
              {parsed.summary}
            </p>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Syntax Error:</strong> {parsed.error}
            </div>
          </div>
        )}

        {/* 5 Field Breakdown Cards */}
        {parsed.fields && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {[
              { label: 'Minute (0-59)', data: parsed.fields.minute },
              { label: 'Hour (0-23)', data: parsed.fields.hour },
              { label: 'Day of Month (1-31)', data: parsed.fields.dom },
              { label: 'Month (1-12)', data: parsed.fields.month },
              { label: 'Day of Week (0-6)', data: parsed.fields.dow }
            ].map((f, i) => (
              <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block truncate">{f.label}</span>
                <p className="font-mono font-bold text-base text-[#111111]">{f.data.raw}</p>
                <p className="text-[11px] text-neutral-600 truncate capitalize">{f.data.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Generator & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Presets List */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Sparkles className="w-4 h-4 text-[#A68936]" />
            Common Schedules Presets
          </h3>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setExpression(preset.expression)}
                className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  expression === preset.expression
                    ? 'bg-[#111111] text-[#FFFDF8] border-neutral-800 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{preset.name}</span>
                  <code className="text-[11px] font-mono text-[#D6B46A]">{preset.expression}</code>
                </div>
                <p className={`text-[11px] mt-1 ${expression === preset.expression ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Next 5 Execution Times */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Calendar className="w-4 h-4 text-[#A68936]" />
            Upcoming Next 5 Executions (Deterministic Calculation)
          </h3>

          {parsed.nextDates.length > 0 ? (
            <div className="space-y-2.5">
              {parsed.nextDates.map((date, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                      {date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[#A68936] font-bold">
                    {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-neutral-500 py-6 text-center">
              No matching upcoming dates found within a 365-day calendar horizon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
