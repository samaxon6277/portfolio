import React, { useState, useMemo, useRef } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, Clock, ShieldCheck, 
  ArrowRight, RefreshCw, Copy, Check, Info, Sparkles, 
  ChevronRight, BarChart3, PieChart, Layers, HelpCircle, FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend 
} from 'recharts';
import CustomSelect from '../CustomSelect';
import CustomSlider from '../ui/CustomSlider';
import FormField from '../ui/FormField';
import CustomInput from '../ui/CustomInput';
import CustomBadge from '../ui/CustomBadge';
import { useCustomUi } from '../../context/CustomUiContext';

export type BusinessModel = 'ecommerce' | 'leadgen' | 'service' | 'booking' | 'subscription';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface BusinessModelConfig {
  id: BusinessModel;
  name: string;
  unitLabel: string;
  defaultVisitors: number;
  defaultConvRate: number;
  defaultAvgValue: number;
  defaultCost: number;
  defaultUplift: number;
  description: string;
}

const BUSINESS_MODELS: BusinessModelConfig[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce / Direct-to-Consumer',
    unitLabel: 'Average Order Value (AOV)',
    defaultVisitors: 15000,
    defaultConvRate: 1.8,
    defaultAvgValue: 2400,
    defaultCost: 95000,
    defaultUplift: 65,
    description: 'Cart checkouts, transaction values, and product catalog conversions.'
  },
  {
    id: 'leadgen',
    name: 'B2B & High-Value Lead Generation',
    unitLabel: 'Average Deal / Lead Value',
    defaultVisitors: 4500,
    defaultConvRate: 2.2,
    defaultAvgValue: 45000,
    defaultCost: 120000,
    defaultUplift: 80,
    description: 'Qualified inquiries, enterprise quote requests, and sales consultation calls.'
  },
  {
    id: 'service',
    name: 'Luxury Professional Services',
    unitLabel: 'Average Client Engagement Value',
    defaultVisitors: 3000,
    defaultConvRate: 1.5,
    defaultAvgValue: 65000,
    defaultCost: 110000,
    defaultUplift: 75,
    description: 'Retainers, bespoke agency contracts, law, architecture & advisory firms.'
  },
  {
    id: 'booking',
    name: 'Banquets, Resorts & Event Venues',
    unitLabel: 'Average Booking Value',
    defaultVisitors: 6000,
    defaultConvRate: 2.0,
    defaultAvgValue: 180000,
    defaultCost: 140000,
    defaultUplift: 70,
    description: 'Wedding venue inquiries, luxury resort reservations, and corporate gala dates.'
  },
  {
    id: 'subscription',
    name: 'SaaS & Subscription Memberships',
    unitLabel: 'Customer Lifetime Value (LTV)',
    defaultVisitors: 8000,
    defaultConvRate: 3.0,
    defaultAvgValue: 12000,
    defaultCost: 130000,
    defaultUplift: 60,
    description: 'Recurring software plans, annual passes, and premium club memberships.'
  }
];

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED '
};

export default function WebsiteRoiCalculator() {
  const { showToast } = useCustomUi();
  const [model, setModel] = useState<BusinessModel>('leadgen');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Core Inputs
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(4500);
  const [currentConvRate, setCurrentConvRate] = useState<number>(2.2);
  const [avgValue, setAvgValue] = useState<number>(45000);
  const [projectCost, setProjectCost] = useState<number>(120000);
  const [expectedUpliftPercent, setExpectedUpliftPercent] = useState<number>(75);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(5000);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(12);

  // Active scenario tab
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'moderate' | 'optimistic'>('moderate');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Currency symbol
  const symbol = CURRENCY_SYMBOLS[currency];

  // Helper formatter
  const formatMoney = (amount: number): string => {
    return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
  };

  // Switch model presets
  const handleModelChange = (newModelId: BusinessModel) => {
    setModel(newModelId);
    const preset = BUSINESS_MODELS.find(m => m.id === newModelId);
    if (preset) {
      setMonthlyVisitors(preset.defaultVisitors);
      setCurrentConvRate(preset.defaultConvRate);
      setAvgValue(preset.defaultAvgValue);
      setProjectCost(preset.defaultCost);
      setExpectedUpliftPercent(preset.defaultUplift);
    }
  };

  // Reset to current model defaults
  const handleReset = () => {
    const preset = BUSINESS_MODELS.find(m => m.id === model);
    if (preset) {
      setMonthlyVisitors(preset.defaultVisitors);
      setCurrentConvRate(preset.defaultConvRate);
      setAvgValue(preset.defaultAvgValue);
      setProjectCost(preset.defaultCost);
      setExpectedUpliftPercent(preset.defaultUplift);
      setMonthlyMaintenance(5000);
      setTimeHorizonMonths(12);
    }
    showToast('Calculator assumptions reset to standard baseline.', 'info');
  };

  // Calculations for scenarios
  const calculations = useMemo(() => {
    const safeVisitors = Math.max(0, monthlyVisitors);
    const safeConvRate = Math.max(0, currentConvRate);
    const safeAvgValue = Math.max(0, avgValue);
    const safeProjectCost = Math.max(0, projectCost);
    const safeMaintenance = Math.max(0, monthlyMaintenance);
    const safeMonths = Math.max(1, timeHorizonMonths);

    // Current Monthly Baseline
    const currentMonthlyConversions = (safeVisitors * (safeConvRate / 100));
    const currentMonthlyRevenue = currentMonthlyConversions * safeAvgValue;

    // Scenarios multiplier:
    // Conservative: 50% of expected uplift
    // Moderate: 100% of expected uplift
    // Optimistic: 150% of expected uplift
    const scenarios = {
      conservative: {
        name: 'Conservative Projection',
        upliftMultiplier: 0.5,
        badge: 'Defensive (-50% Uplift)'
      },
      moderate: {
        name: 'Target Moderate Projection',
        upliftMultiplier: 1.0,
        badge: 'Baseline Target'
      },
      optimistic: {
        name: 'Optimistic Projection',
        upliftMultiplier: 1.5,
        badge: 'High Performance (+50% Uplift)'
      }
    };

    const scenarioResults = Object.entries(scenarios).map(([key, config]) => {
      const uplift = expectedUpliftPercent * config.upliftMultiplier;
      const improvedConvRate = safeConvRate * (1 + uplift / 100);
      const improvedMonthlyConversions = (safeVisitors * (improvedConvRate / 100));
      const additionalMonthlyConversions = Math.max(0, improvedMonthlyConversions - currentMonthlyConversions);

      const additionalMonthlyRevenue = additionalMonthlyConversions * safeAvgValue;
      const totalAdditionalRevenue = additionalMonthlyRevenue * safeMonths;

      const totalInvestment = safeProjectCost + (safeMaintenance * safeMonths);
      const netProfit = totalAdditionalRevenue - totalInvestment;
      const roiPercent = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

      // Break-even in months (Project Cost / Additional Monthly Net Cash Flow)
      const monthlyNetCashFlow = additionalMonthlyRevenue - safeMaintenance;
      const breakEvenMonths = monthlyNetCashFlow > 0 
        ? Math.max(0.1, safeProjectCost / monthlyNetCashFlow)
        : Infinity;

      return {
        key: key as 'conservative' | 'moderate' | 'optimistic',
        name: config.name,
        badge: config.badge,
        upliftPercent: uplift,
        improvedConvRate,
        currentMonthlyConversions,
        improvedMonthlyConversions,
        additionalMonthlyConversions,
        currentMonthlyRevenue,
        additionalMonthlyRevenue,
        totalAdditionalRevenue,
        totalInvestment,
        netProfit,
        roiPercent,
        breakEvenMonths: isFinite(breakEvenMonths) ? Number(breakEvenMonths.toFixed(1)) : null
      };
    });

    // Active scenario result
    const activeResult = scenarioResults.find(s => s.key === activeScenario) || scenarioResults[1];

    // Build timeline chart points for 1..safeMonths
    const chartData = [];
    let cumulativeInvestment = safeProjectCost;
    let cumulativeGrossGain = 0;

    for (let month = 1; month <= safeMonths; month++) {
      cumulativeInvestment += safeMaintenance;
      cumulativeGrossGain += activeResult.additionalMonthlyRevenue;
      const cumulativeNet = cumulativeGrossGain - cumulativeInvestment;

      chartData.push({
        month: `Month ${month}`,
        investment: Math.round(cumulativeInvestment),
        grossRevenue: Math.round(cumulativeGrossGain),
        netProfit: Math.round(cumulativeNet)
      });
    }

    return {
      currentMonthlyConversions,
      currentMonthlyRevenue,
      scenarioResults,
      activeResult,
      chartData
    };
  }, [
    monthlyVisitors, currentConvRate, avgValue, projectCost, 
    expectedUpliftPercent, monthlyMaintenance, timeHorizonMonths, activeScenario
  ]);

  const activeRes = calculations.activeResult;

  // Copy structured summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `SamaXon Website ROI Calculation Summary (${model.toUpperCase()} Business Model):
--------------------------------------------------
Monthly Visitors: ${monthlyVisitors.toLocaleString()}
Current Conversion Rate: ${currentConvRate}% (${calculations.currentMonthlyConversions.toFixed(1)} conv/mo)
Average Value: ${formatMoney(avgValue)}
Website Capital Investment: ${formatMoney(projectCost)}
Projected Horizon: ${timeHorizonMonths} Months
Scenario: ${activeRes.name} (+${activeRes.upliftPercent.toFixed(1)}% Conversion Uplift)

PROJECTED OUTCOMES:
- Improved Conversion Rate: ${activeRes.improvedConvRate.toFixed(2)}%
- Additional Conversions / Month: +${activeRes.additionalMonthlyConversions.toFixed(1)}
- Additional Monthly Revenue: ${formatMoney(activeRes.additionalMonthlyRevenue)}
- Total Additional Value (${timeHorizonMonths} Mos): ${formatMoney(activeRes.totalAdditionalRevenue)}
- Total Capital & Maintenance: ${formatMoney(activeRes.totalInvestment)}
- Net Financial Gain: ${formatMoney(activeRes.netProfit)}
- Projected ROI: ${activeRes.roiPercent.toFixed(0)}%
- Estimated Break-Even: ${activeRes.breakEvenMonths ? `${activeRes.breakEvenMonths} Months` : 'N/A'}

Generated via SamaXon Website ROI Calculator (https://samaxon.com/tools/website-roi-calculator)`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    showToast('ROI Summary copied to clipboard.', 'success');
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="space-y-10 text-left" id="website-roi-calculator-tool">
      {/* Tool Hero Header */}
      <div className="bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/25 rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <CustomBadge variant="gold" size="md" icon={<TrendingUp className="w-3 h-3" />}>
              Financial Modeling Engine
            </CustomBadge>
            <span className="text-[10px] font-mono text-[#D6B46A]/80 uppercase tracking-wider">
              100% Client-Side Calculations
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Website Return on Investment <span className="text-[#D6B46A]">(ROI)</span> Calculator
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Quantify the precise revenue impact of improving your website’s conversion architecture. Compare conservative, target, and high-performance trajectories with automated break-even modeling.
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-Time Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">Parameters</span>
              <h3 className="font-display text-lg font-bold text-[#111111]">Business Assumptions</h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to defaults"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Business Model Selector */}
          <FormField
            label="Business Model Archetype"
            description="Select your commercial structure to calibrate baseline metrics"
          >
            <CustomSelect
              value={model}
              onChange={(val) => handleModelChange(val as BusinessModel)}
              options={BUSINESS_MODELS.map(m => ({
                value: m.id,
                label: m.name,
                sublabel: m.description
              }))}
            />
          </FormField>

          {/* Currency Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Currency Standard">
              <CustomSelect
                value={currency}
                onChange={(val) => setCurrency(val as CurrencyCode)}
                options={[
                  { value: 'INR', label: 'INR (₹ - Indian Rupee)' },
                  { value: 'USD', label: 'USD ($ - US Dollar)' },
                  { value: 'EUR', label: 'EUR (€ - Euro)' },
                  { value: 'GBP', label: 'GBP (£ - British Pound)' },
                  { value: 'AED', label: 'AED (د.إ - UAE Dirham)' }
                ]}
              />
            </FormField>

            <FormField label="Investment Horizon">
              <CustomSelect
                value={String(timeHorizonMonths)}
                onChange={(val) => setTimeHorizonMonths(Number(val))}
                options={[
                  { value: '6', label: '6 Months' },
                  { value: '12', label: '12 Months (Standard)' },
                  { value: '24', label: '24 Months' },
                  { value: '36', label: '36 Months' }
                ]}
              />
            </FormField>
          </div>

          {/* Numeric Inputs */}
          <div className="space-y-4 pt-2">
            <FormField
              label="Monthly Website Visitors"
              description="Current unique visitor sessions across all marketing channels"
            >
              <CustomInput
                type="number"
                min="100"
                step="500"
                value={monthlyVisitors}
                onChange={(e) => setMonthlyVisitors(Math.max(0, Number(e.target.value)))}
                placeholder="e.g. 10000"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Current Conversion Rate (%)"
                description="Percentage of visitors who buy or submit leads"
              >
                <CustomInput
                  type="number"
                  min="0.1"
                  max="50"
                  step="0.1"
                  value={currentConvRate}
                  onChange={(e) => setCurrentConvRate(Math.max(0.01, Number(e.target.value)))}
                  placeholder="e.g. 2.0"
                />
              </FormField>

              <FormField
                label={BUSINESS_MODELS.find(m => m.id === model)?.unitLabel || 'Average Deal Value'}
                description={`Average monetary value per conversion in ${currency}`}
              >
                <CustomInput
                  type="number"
                  min="10"
                  step="1000"
                  value={avgValue}
                  onChange={(e) => setAvgValue(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 50000"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Website Project Cost"
                description="One-time development, UI redesign & copywriting cost"
              >
                <CustomInput
                  type="number"
                  min="0"
                  step="5000"
                  value={projectCost}
                  onChange={(e) => setProjectCost(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 120000"
                />
              </FormField>

              <FormField
                label="Monthly Maintenance / Retainer"
                description="Optional hosting, monitoring & growth optimization"
              >
                <CustomInput
                  type="number"
                  min="0"
                  step="1000"
                  value={monthlyMaintenance}
                  onChange={(e) => setMonthlyMaintenance(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 5000"
                />
              </FormField>
            </div>

            {/* Expected Uplift Slider */}
            <div className="pt-2">
              <CustomSlider
                min={10}
                max={300}
                step={5}
                value={expectedUpliftPercent}
                onChange={setExpectedUpliftPercent}
                label="Target Conversion Rate Uplift"
                unit="%"
                minLabel="+10% Modest"
                maxLabel="+300% Multi-Fold"
              />
              <p className="text-[11px] text-[#8A8178] mt-1.5">
                Target conversion rate will become: <strong className="text-[#111111]">{(currentConvRate * (1 + expectedUpliftPercent / 100)).toFixed(2)}%</strong> (from {currentConvRate}%)
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Projections & Visuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Scenario Tabs */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl p-2 flex items-center gap-1.5 shadow-sm">
            {(['conservative', 'moderate', 'optimistic'] as const).map((scKey) => {
              const sc = calculations.scenarioResults.find(s => s.key === scKey)!;
              const isSelected = activeScenario === scKey;
              return (
                <button
                  key={scKey}
                  type="button"
                  onClick={() => setActiveScenario(scKey)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center select-none ${
                    isSelected
                      ? 'bg-[#111111] text-[#D6B46A] shadow-md'
                      : 'text-[#8A8178] hover:text-[#111111] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <span className="block truncate capitalize">{scKey} Scenario</span>
                  <span className={`text-[9px] font-mono block ${isSelected ? 'text-neutral-300' : 'text-[#8A8178]'}`}>
                    +{sc.upliftPercent.toFixed(0)}% uplift
                  </span>
                </button>
              );
            })}
          </div>

          {/* Primary ROI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Projected ROI */}
            <div className="bg-[#111111] text-white border border-[#D6B46A]/30 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
                  Estimated ROI
                </span>
                <TrendingUp className="w-4 h-4 text-[#D6B46A]" />
              </div>
              <div>
                <span className="text-3xl font-display font-black text-white">
                  {activeRes.roiPercent.toFixed(0)}%
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  Over {timeHorizonMonths} months
                </span>
              </div>
            </div>

            {/* Net Financial Gain */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/35 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">
                  Net Financial Gain
                </span>
                <DollarSign className="w-4 h-4 text-[#85641C]" />
              </div>
              <div>
                <span className={`text-2xl font-display font-black ${activeRes.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatMoney(activeRes.netProfit)}
                </span>
                <span className="text-[11px] text-[#8A8178] block mt-0.5">
                  Gross Return - Total Cost
                </span>
              </div>
            </div>

            {/* Break-Even Period */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/35 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">
                  Break-Even Window
                </span>
                <Clock className="w-4 h-4 text-[#85641C]" />
              </div>
              <div>
                <span className="text-2xl font-display font-black text-[#111111]">
                  {activeRes.breakEvenMonths ? `${activeRes.breakEvenMonths} Mos` : 'N/A'}
                </span>
                <span className="text-[11px] text-[#8A8178] block mt-0.5">
                  To recover initial capital
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Trajectory Chart */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">Visual Cashflow</span>
                <h4 className="font-display text-sm font-bold text-[#111111]">Cumulative Revenue vs Total Investment</h4>
              </div>
              <span className="text-[10px] font-mono text-[#8A8178] font-bold">
                {activeRes.name}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculations.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D6B46A" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D6B46A" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="blackGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#111111" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE4D9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A8178' }} />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#8A8178' }}
                    tickFormatter={(val) => `${symbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [formatMoney(Number(value)), name === 'grossRevenue' ? 'Cumulative Revenue' : 'Cumulative Cost']}
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#D6B46A', borderRadius: 12, color: '#FFFDF8', fontSize: 12 }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    formatter={(value) => <span className="text-[11px] font-semibold text-[#111111]">{value === 'grossRevenue' ? 'Cumulative Revenue' : 'Cumulative Investment'}</span>} 
                  />
                  <Area type="monotone" dataKey="grossRevenue" stroke="#D6B46A" strokeWidth={2.5} fillOpacity={1} fill="url(#goldGradient)" />
                  <Area type="monotone" dataKey="investment" stroke="#111111" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#blackGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Granular Breakdown Table */}
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-display text-sm font-bold text-[#111111] border-b border-[#D6B46A]/15 pb-2">
              Monthly & Aggregate Impact Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAF6F0] rounded-xl space-y-2">
                <div className="flex justify-between text-[#8A8178]">
                  <span>Current Monthly Conversions:</span>
                  <strong className="text-[#111111]">{calculations.currentMonthlyConversions.toFixed(1)}</strong>
                </div>
                <div className="flex justify-between text-[#8A8178]">
                  <span>Projected Monthly Conversions:</span>
                  <strong className="text-[#85641C]">+{activeRes.additionalMonthlyConversions.toFixed(1)} / mo</strong>
                </div>
                <div className="flex justify-between border-t border-[#D6B46A]/20 pt-1.5 font-bold">
                  <span className="text-[#111111]">New Total Conversions:</span>
                  <span className="text-[#111111]">{activeRes.improvedMonthlyConversions.toFixed(1)} / mo</span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xl space-y-2">
                <div className="flex justify-between text-[#8A8178]">
                  <span>Current Monthly Run-Rate:</span>
                  <strong className="text-[#111111]">{formatMoney(calculations.currentMonthlyRevenue)}</strong>
                </div>
                <div className="flex justify-between text-[#8A8178]">
                  <span>Additional Monthly Revenue:</span>
                  <strong className="text-emerald-700">+{formatMoney(activeRes.additionalMonthlyRevenue)}</strong>
                </div>
                <div className="flex justify-between border-t border-[#D6B46A]/20 pt-1.5 font-bold">
                  <span className="text-[#111111]">Total Additional ({timeHorizonMonths} Mo):</span>
                  <span className="text-[#111111]">{formatMoney(activeRes.totalAdditionalRevenue)}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D6B46A]/15">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2.5 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSummary ? 'Summary Copied' : 'Copy Executive Summary'}</span>
              </button>

              <a
                href="/service-request"
                className="px-4 py-2.5 bg-[#FFFDF8] border border-[#D6B46A] text-[#111111] hover:bg-[#FAF6F0] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Request Custom Conversion Build</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Professional Mathematical Disclaimer */}
          <div className="p-4 bg-[#FAF6F0] border border-[#D6B46A]/20 rounded-2xl flex items-start gap-3 text-xs text-[#8A8178] leading-relaxed">
            <Info className="w-4 h-4 text-[#85641C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111111] block mb-0.5">Transparent Projection Assumptions:</strong>
              Calculations assume uniform visitor traffic distribution throughout the selected period. Real-world conversion gains correlate directly with mobile responsiveness, Core Web Vitals speed (sub-0.5s TTFB), copy clarity, and traffic qualification. These models do not guarantee sales outcomes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
