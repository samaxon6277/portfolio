import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, CheckCircle2, ChevronDown, ChevronUp, Code2, Copy, Check } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset, InboundLead } from '../types';

interface TelegramAlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  latestLead?: InboundLead | null;
}

export const TelegramAlertDrawer: React.FC<TelegramAlertDrawerProps> = ({
  isOpen,
  onClose,
  state,
  accent,
  preset,
  latestLead,
}) => {
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeLead = latestLead || state.leads[0];
  const customerName = activeLead ? activeLead.customerName : preset.leadSampleNames[0];
  const phone = activeLead ? activeLead.phoneNumber : '+91 98765-XXXXX';
  const timestamp = activeLead ? activeLead.timestamp : 'Just now';

  const webhookPayload = activeLead?.rawWebhookPayload || {
    event: 'lead.inbound_captured',
    source: 'Client_OS_Sandbox',
    industry: state.industry,
    customer_name: customerName,
    phone_masked: phone,
    projected_ticket_inr: state.pricingValue,
    timestamp: new Date().toISOString(),
    edge_latency_ms: 34,
    crm_synced: true,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(webhookPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal / Drawer Window */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative z-10 w-full max-w-lg bg-neutral-900 border border-champagne-gold/30 rounded-3xl overflow-hidden shadow-2xl text-left flex flex-col max-h-[85vh]"
          >
            {/* Telegram Blue Header */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm leading-tight flex items-center gap-1.5">
                    <span>SamaXon Bot Dispatcher</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                  </h4>
                  <span className="text-[10px] text-white/80 font-mono">
                    @samaxon_lead_bot • Instant Push Channel
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body */}
            <div className="p-5 space-y-4 overflow-y-auto bg-neutral-950/80 flex-1 font-sans">
              {/* Message Bubble */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-sky-500/30 text-soft-ivory shadow-lg relative">
                <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 border-b border-white/10 pb-2 mb-3">
                  <span className="font-bold flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    <span>⚡ [SAMAXON BOT DISPATCH]</span>
                  </span>
                  <span className="text-warm-grey">{timestamp}</span>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-soft-ivory">
                  <p>
                    <span className="text-warm-grey">New Verified Lead:</span>{' '}
                    <strong className="text-soft-ivory">{customerName}</strong>
                  </p>
                  <p>
                    <span className="text-warm-grey">Contact:</span>{' '}
                    <span className="text-soft-ivory">{phone}</span>
                  </p>
                  <p>
                    <span className="text-warm-grey">Industry:</span>{' '}
                    <span style={{ color: accent.hex }} className="font-bold">
                      {preset.label}
                    </span>
                  </p>
                  <p>
                    <span className="text-warm-grey">Projected Ticket:</span>{' '}
                    <span className="text-emerald-400 font-bold">
                      ₹{state.pricingValue.toLocaleString('en-IN')}
                    </span>
                  </p>
                  <p>
                    <span className="text-warm-grey">Latency:</span>{' '}
                    <span className="text-sky-300 font-semibold">0.34s via Edge Webhook</span>
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-bold">Status: ✅ Synced to Sales CRM &amp; Mobile Phone</span>
                </div>
              </div>

              {/* Collapsible JSON Inspector */}
              <div className="p-3 bg-neutral-900/90 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="w-full flex items-center justify-between text-xs font-mono text-warm-grey hover:text-soft-ivory transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-champagne-gold" />
                    <span>Inspect Raw Webhook Payload (JSON)</span>
                  </span>
                  {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRawJson && (
                  <div className="mt-3 relative">
                    <button
                      type="button"
                      onClick={handleCopyPayload}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[9px] font-mono text-soft-ivory flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <pre className="p-3.5 bg-black rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto border border-white/10 max-h-48">
                      {JSON.stringify(webhookPayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-neutral-900 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[9px] font-mono text-warm-grey">
                Live Simulation Mode • No actual Telegram tokens needed
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-champagne-gold text-matte-black font-bold uppercase text-[10px] tracking-wider rounded-xl hover:bg-muted-gold transition-colors cursor-pointer"
              >
                Acknowledge Alert
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
