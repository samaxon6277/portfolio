import React from 'react';
import {
  CalendarCheck,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { SandboxState, AccentColorToken, CurrencyCode } from '../types';
import { CURRENCIES } from '../constants/currencies';

interface TabOperationsProps {
  state: SandboxState;
  accent: AccentColorToken;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onBookingStatusChange: (status: 'available' | 'urgency_2_slots' | 'waitlist_only') => void;
  onPricingChange: (price: number) => void;
  onMaintenanceToggle: (maintenance: boolean) => void;
}

export const TabOperations: React.FC<TabOperationsProps> = ({
  state,
  accent,
  onCurrencyChange,
  onBookingStatusChange,
  onPricingChange,
  onMaintenanceToggle,
}) => {
  const currencies = Object.values(CURRENCIES);
  const activeCurrencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 0. Multi-Currency & Global Market Switcher */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5" />
          <span>Multi-Currency &amp; Global Market:</span>
        </label>

        <div className="grid grid-cols-4 gap-2">
          {currencies.map((curr) => {
            const isSelected = state.currency === curr.code;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => onCurrencyChange(curr.code)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 border-champagne-gold text-white font-bold shadow-sm'
                    : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:border-white/20'
                }`}
                style={isSelected ? { borderColor: accent.hex } : {}}
              >
                <span className="text-xs font-bold block text-soft-ivory">
                  {curr.symbol}
                </span>
                <span className="text-[9px] font-mono text-warm-grey block mt-0.5">
                  {curr.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Dynamic Pricing Engine */}
      <div className="space-y-3 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Dynamic Revenue / Ticket Slider:</span>
          </label>
          <span
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-neutral-900 border border-white/10"
            style={{ color: accent.hex }}
          >
            {activeCurrencyConfig.format(state.pricingValue)}
          </span>
        </div>

        <div className="space-y-2 bg-neutral-900/70 p-4 rounded-xl border border-white/5">
          <input
            type="range"
            min={25000}
            max={250000}
            step={5000}
            value={state.pricingValue}
            onChange={(e) => onPricingChange(Number(e.target.value))}
            id="pricing-slider"
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: accent.hex }}
          />

          <div className="flex justify-between text-[9px] font-mono text-warm-grey">
            <span>{activeCurrencyConfig.format(25000)}</span>
            <span>Target Ticket Floor ({state.currency})</span>
            <span>{activeCurrencyConfig.format(250000)}</span>
          </div>
        </div>
      </div>

      {/* 2. Booking Availability Engine */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Operational Capacity &amp; Urgency Trigger:</span>
        </label>

        <div className="space-y-2">
          {/* Button 1: Open */}
          <button
            type="button"
            onClick={() => onBookingStatusChange('available')}
            id="booking-status-available"
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
              state.bookingStatus === 'available'
                ? 'bg-emerald-950/40 border-emerald-500/80 text-soft-ivory shadow-sm'
                : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:bg-neutral-900/80 hover:text-soft-ivory'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
              <div>
                <span className="text-xs font-bold text-soft-ivory block font-sans">
                  Open for Allocations
                </span>
                <span className="text-[9px] font-mono text-emerald-400/90">
                  System Status: Online • Instant Confirmation
                </span>
              </div>
            </div>
            {state.bookingStatus === 'available' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
          </button>

          {/* Button 2: Urgency */}
          <button
            type="button"
            onClick={() => onBookingStatusChange('urgency_2_slots')}
            id="booking-status-urgency"
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
              state.bookingStatus === 'urgency_2_slots'
                ? 'bg-amber-950/40 border-amber-500/80 text-soft-ivory shadow-sm'
                : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:bg-neutral-900/80 hover:text-soft-ivory'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-sm animate-pulse" />
              <div>
                <span className="text-xs font-bold text-soft-ivory block font-sans">
                  Only 2 Slots Left (Urgency Engine)
                </span>
                <span className="text-[9px] font-mono text-amber-400/90">
                  Urgency: High Demand • 2 Slots Remaining
                </span>
              </div>
            </div>
            {state.bookingStatus === 'urgency_2_slots' && (
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </button>

          {/* Button 3: Waitlist */}
          <button
            type="button"
            onClick={() => onBookingStatusChange('waitlist_only')}
            id="booking-status-waitlist"
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
              state.bookingStatus === 'waitlist_only'
                ? 'bg-rose-950/40 border-rose-500/80 text-soft-ivory shadow-sm'
                : 'bg-neutral-900/50 border-white/5 text-warm-grey hover:bg-neutral-900/80 hover:text-soft-ivory'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0 shadow-sm" />
              <div>
                <span className="text-xs font-bold text-soft-ivory block font-sans">
                  Waitlist Only (Scarcity Trigger)
                </span>
                <span className="text-[9px] font-mono text-rose-400/90">
                  Capacity Reached • Priority Application Review
                </span>
              </div>
            </div>
            {state.bookingStatus === 'waitlist_only' && (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Maintenance Mode Security Override */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${state.maintenanceMode ? 'text-amber-400' : 'text-warm-grey'}`} />
              <span className="text-xs font-bold text-soft-ivory font-sans">
                1-Click Maintenance Mode
              </span>
            </div>
            <p className="text-[10px] text-warm-grey leading-relaxed">
              Instantly lock public access and display a frosted luxury maintenance shield.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onMaintenanceToggle(!state.maintenanceMode)}
            id="toggle-maintenance-mode-btn"
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative cursor-pointer shrink-0 ${
              state.maintenanceMode ? 'bg-amber-500' : 'bg-neutral-700'
            }`}
          >
            <span
              className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform duration-200 shadow-md ${
                state.maintenanceMode ? 'left-6.5' : 'left-1'
              }`}
            />
          </button>
        </div>

        {state.maintenanceMode && (
          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[9.5px] font-mono text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Staging Lock Engaged • End-users blocked from checkout</span>
          </div>
        )}
      </div>
    </div>
  );
};
