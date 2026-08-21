import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';
import { CURRENCIES } from '../constants/currencies';

interface PreviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onConfirmBooking: (dateStr: string, slotStr: string) => void;
}

export const PreviewBookingModal: React.FC<PreviewBookingModalProps> = ({
  isOpen,
  onClose,
  state,
  accent,
  preset,
  onConfirmBooking,
}) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const dates = [
    { day: 'Tomorrow', date: 'Aug 23', available: true },
    { day: 'Sunday', date: 'Aug 24', available: true },
    { day: 'Monday', date: 'Aug 25', available: state.bookingStatus !== 'urgency_2_slots' },
    { day: 'Tuesday', date: 'Aug 26', available: true },
  ];

  const slots = ['11:00 AM', '02:30 PM', '05:00 PM', '07:30 PM'];

  const currencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;
  const formattedPrice = currencyConfig.format(state.pricingValue);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmed(true);
      setTimeout(() => {
        onConfirmBooking(
          `${dates[selectedDateIndex].day}, ${dates[selectedDateIndex].date}`,
          slots[selectedSlotIndex]
        );
        setConfirmed(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-md bg-neutral-900 border border-white/15 rounded-3xl p-5 sm:p-6 text-left shadow-2xl text-soft-ivory relative overflow-hidden"
          >
            {/* Ambient Corner Flare */}
            <div
              className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: accent.hex }}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-display"
                  style={{ backgroundColor: accent.hex, color: accent.buttonText }}
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-soft-ivory">
                    {state.bookingStatus === 'waitlist_only'
                      ? 'Priority Waitlist Reservation'
                      : 'Bespoke Consultation Slot'}
                  </h4>
                  <span className="text-[9px] font-mono text-warm-grey block">
                    {preset.label} • Direct Staging Booking
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-warm-grey hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {confirmed ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-base text-soft-ivory">
                  Slot Confirmed &amp; Dispatched!
                </h4>
                <p className="text-xs text-warm-grey">
                  Webhook payload generated. Telegram Bot and CRM alerted in 280ms.
                </p>
              </div>
            ) : (
              <div className="space-y-4 font-sans text-xs">
                {/* Date Selection Pills */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider block mb-2">
                    1. Select Preferred Allocation Window:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {dates.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDateIndex(i)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedDateIndex === i
                            ? 'bg-neutral-800 border-champagne-gold shadow-md text-white font-bold'
                            : 'bg-neutral-950/50 border-white/10 text-warm-grey hover:border-white/25'
                        }`}
                        style={
                          selectedDateIndex === i
                            ? { borderColor: accent.hex, boxShadow: `0 0 12px ${accent.glow}` }
                            : {}
                        }
                      >
                        <span className="text-[8px] font-mono uppercase block">{d.day}</span>
                        <span className="text-xs font-bold block mt-0.5">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider block mb-2">
                    2. Select Time Window:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlotIndex(i)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all text-[11px] font-mono cursor-pointer ${
                          selectedSlotIndex === i
                            ? 'bg-neutral-800 border-white text-white font-bold shadow-sm'
                            : 'bg-neutral-950/50 border-white/10 text-warm-grey hover:border-white/20'
                        }`}
                        style={
                          selectedSlotIndex === i
                            ? { borderColor: accent.hex, color: accent.hex }
                            : {}
                        }
                      >
                        <Clock className="w-2.5 h-2.5 mx-auto mb-0.5 opacity-70" />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment & Guarantee */}
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-warm-grey block">Target Allocation Floor</span>
                    <span className="text-sm font-bold text-soft-ivory font-mono">
                      {formattedPrice}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Encrypted SSL</span>
                    </span>
                    <span className="text-[9px] font-mono text-warm-grey">0.28s Edge Sync</span>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  style={{
                    backgroundColor: accent.buttonBg,
                    color: accent.buttonText,
                    boxShadow: `0 8px 24px -4px ${accent.glow}`,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Booking Staging Slot...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {state.bookingStatus === 'waitlist_only'
                          ? 'Join Priority Waitlist'
                          : 'Lock In Appointment'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
