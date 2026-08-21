import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Bot,
  Send,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  PhoneCall,
  Activity,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset, InboundLead } from '../types';
import { CURRENCIES } from '../constants/currencies';

interface TabLeadEngineProps {
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onSimulateLead: () => void;
  onOpenTelegramDrawer?: () => void;
}

export const TabLeadEngine: React.FC<TabLeadEngineProps> = ({
  state,
  accent,
  preset,
  onSimulateLead,
  onOpenTelegramDrawer,
}) => {
  const [showJsonPayload, setShowJsonPayload] = useState<boolean>(false);
  const latestLead: InboundLead | undefined = state.leads[0];
  const currencyConfig = CURRENCIES[state.currency] || CURRENCIES.INR;
  const formattedPrice = currencyConfig.format(state.pricingValue);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. Inbound Webhook Execution Trigger */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>1. Instant Lead Ingestion &amp; Webhook Trigger:</span>
        </label>

        <button
          type="button"
          onClick={onSimulateLead}
          disabled={state.isSimulatingLead}
          id="simulate-lead-btn"
          className="w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-xl flex items-center justify-center gap-2.5 duration-200 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 relative overflow-hidden group"
          style={{
            backgroundColor: accent.buttonBg,
            color: accent.buttonText,
            boxShadow: `0 10px 30px -5px ${accent.glow}`,
          }}
        >
          {state.isSimulatingLead ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Routing Webhook via Edge API ({state.lastSimulatedLatencyMs || 280}ms)...</span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
              <Zap className="w-4 h-4 shrink-0 fill-current" />
              <span>Simulate Inbound Lead Execution</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>

        {/* Live Network Latency Counter */}
        <div className="flex items-center justify-between px-2 text-[10px] font-mono text-warm-grey">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Captured in {state.lastSimulatedLatencyMs || 280}ms via Edge API</span>
          </span>
          <span className="text-soft-ivory/60">Cloudflare Worker Gateway</span>
        </div>
      </div>

      {/* 2. Telegram Bot Automation View */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-champagne-gold/25 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-soft-ivory block font-sans">
                Telegram Bot Dispatch Alert
              </span>
              <span className="text-[9px] font-mono text-emerald-400">
                Active Webhook Channel • 200 OK
              </span>
            </div>
          </div>

          {onOpenTelegramDrawer && (
            <button
              type="button"
              onClick={onOpenTelegramDrawer}
              className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-[9px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer border border-sky-500/30"
            >
              <Send className="w-2.5 h-2.5" />
              <span>Inspect Channel</span>
            </button>
          )}
        </div>

        {/* Formatted Lead Message Box */}
        <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 font-mono text-[10px] text-soft-ivory/90 space-y-1.5">
          <div className="text-sky-400 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>[SAMAXON TELEGRAM DISPATCH]</span>
            </span>
            <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {state.lastSimulatedLatencyMs || 280}ms EDGE
            </span>
          </div>

          <div className="text-warm-grey">
            Lead Name:{' '}
            <span className="text-soft-ivory font-semibold">
              {latestLead ? latestLead.customerName : preset.leadSampleNames[0]}
            </span>
          </div>
          <div className="text-warm-grey">
            Contact:{' '}
            <span className="text-soft-ivory">
              {latestLead ? latestLead.phoneNumber : '+91 98765-XXXXX'}
            </span>
          </div>
          <div className="text-warm-grey">
            Industry:{' '}
            <span style={{ color: accent.hex }} className="font-bold">
              {preset.label}
            </span>
          </div>
          <div className="text-warm-grey">
            Target Floor:{' '}
            <span className="text-emerald-400 font-bold">
              {formattedPrice}
            </span>
          </div>
          <div className="text-warm-grey flex items-center gap-1.5 pt-1.5 border-t border-white/10 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">Status: Synced to Sales CRM &amp; Telegram Bot</span>
          </div>
        </div>

        {/* Collapsible JSON Inspector with clean dark theme */}
        <div>
          <button
            type="button"
            onClick={() => setShowJsonPayload(!showJsonPayload)}
            className="w-full py-1.5 text-[9.5px] font-mono text-warm-grey hover:text-soft-ivory flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3 text-champagne-gold" />
              <span>Inspect Webhook Raw JSON Payload</span>
            </span>
            {showJsonPayload ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <AnimatePresence>
            {showJsonPayload && (
              <motion.pre
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-black rounded-xl text-[9.5px] font-mono text-emerald-400 overflow-x-auto border border-white/10 max-h-48 leading-relaxed"
              >
                {JSON.stringify(
                  latestLead?.rawWebhookPayload || {
                    event: 'lead.inbound_captured',
                    source: 'Client_OS_Sandbox',
                    industry: state.industry,
                    currency: state.currency,
                    pricing_value: state.pricingValue,
                    formatted_budget: formattedPrice,
                    timestamp: new Date().toISOString(),
                    latency_ms: state.lastSimulatedLatencyMs || 280,
                    client_metadata: {
                      layout_style: state.layoutStyle,
                      font_pairing: state.fontPairing,
                      booking_urgency: state.bookingStatus,
                    },
                  },
                  null,
                  2
                )}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Mini Inbound CRM Table with Animated Status Changes */}
      <div className="space-y-2.5 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase text-champagne-gold font-bold tracking-wider flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>3. Mini Inbound CRM Log:</span>
          </label>
          <span className="text-[9px] font-mono text-warm-grey">{state.leads.length} Records</span>
        </div>

        {state.leads.length === 0 ? (
          <div className="p-6 rounded-xl bg-neutral-900/60 border border-white/5 text-center text-xs text-warm-grey">
            No simulated leads in queue. Click the button above to simulate an incoming high-ticket inquiry.
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {state.leads.slice(0, 5).map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-soft-ivory truncate">{lead.customerName}</span>
                    <span
                      className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor:
                          lead.status === 'INGESTING'
                            ? 'rgba(234, 179, 8, 0.2)'
                            : lead.status === 'HOT_LEAD'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                        color:
                          lead.status === 'INGESTING'
                            ? '#EAB308'
                            : lead.status === 'HOT_LEAD'
                            ? '#EF4444'
                            : '#10B981',
                      }}
                    >
                      {lead.status === 'INGESTING'
                        ? 'Ingesting...'
                        : lead.status === 'HOT_LEAD'
                        ? 'Verified 🔥'
                        : 'Dispatched to Telegram 🚀'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-warm-grey mt-0.5">
                    <span>{lead.phoneNumber}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{lead.estimatedBudget}</span>
                  </div>
                </div>

                <span className="text-[8px] font-mono text-warm-grey shrink-0">{lead.timestamp}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
