import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, Check, CheckCheck, Sparkles } from 'lucide-react';
import { SandboxState, AccentColorToken, IndustryPreset } from '../types';

interface PreviewWhatsAppBotProps {
  isOpen: boolean;
  onToggle: () => void;
  state: SandboxState;
  accent: AccentColorToken;
  preset: IndustryPreset;
  onSimulateInquiry: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const PreviewWhatsAppBot: React.FC<PreviewWhatsAppBotProps> = ({
  isOpen,
  onToggle,
  state,
  accent,
  preset,
  onSimulateInquiry,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello! Welcome to ${preset.label} Sovereign Concierge. How may our team assist your private inquiry today?`,
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const quickReplies = [
    'Request Pricing Deck',
    'Schedule Private Viewing',
    'Speak to Senior Partner',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = `Thank you for your interest in our ${preset.badge}. Our managing director has received your inquiry and will contact you directly within 15 minutes.`;
      if (text.includes('Pricing')) {
        reply = `Our current baseline allocation is active at ₹${state.pricingValue.toLocaleString('en-IN')}. I've routed the complete investor brochure to your verified line.`;
      } else if (text.includes('Viewing') || text.includes('Schedule')) {
        reply = `Private viewing slots are currently ${
          state.bookingStatus === 'available'
            ? 'open for immediate confirmation'
            : state.bookingStatus === 'urgency_2_slots'
            ? 'high demand (2 slots remaining)'
            : 'on priority waitlist'
        }. May we reserve a weekend allocation?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          time: 'Just now',
        },
      ]);

      // Also trigger simulated webhook lead ingestion
      onSimulateInquiry();
    }, 800);
  };

  return (
    <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end">
      {/* Chat Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="mb-3 w-72 sm:w-80 bg-neutral-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left font-sans"
          >
            {/* Header */}
            <div className="bg-emerald-800 px-4 py-3 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center relative">
                  <Bot className="w-4 h-4 text-white" />
                  <span className="w-2 h-2 rounded-full bg-emerald-300 absolute -bottom-0.5 -right-0.5 border border-emerald-900" />
                </div>
                <div>
                  <h5 className="font-bold text-xs leading-tight flex items-center gap-1">
                    <span>SamaXon AI Bot</span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  </h5>
                  <span className="text-[9px] text-emerald-100 font-mono">
                    24/7 Sovereign Concierge
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggle}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="p-3 space-y-2.5 max-h-56 overflow-y-auto bg-neutral-950/90 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-neutral-800 text-soft-ivory border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[8px] font-mono mt-1 flex items-center justify-end gap-1 ${
                        msg.sender === 'user' ? 'text-emerald-100' : 'text-warm-grey'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck className="w-2.5 h-2.5 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-neutral-800 rounded-2xl w-16 text-warm-grey">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse delay-200" />
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="p-2 bg-neutral-900 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[9.5px]">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(qr)}
                  className="px-2 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/20 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-2.5 bg-neutral-900 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask concierge anything..."
                className="flex-1 bg-neutral-950 border border-white/10 text-soft-ivory text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 font-sans"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        id="preview-whatsapp-bot-launcher"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl flex items-center justify-center cursor-pointer border-2 border-white/20 relative group"
        style={{
          boxShadow: '0 8px 24px -2px rgba(16, 185, 129, 0.5)',
        }}
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[7px] font-bold">
          1
        </span>
      </motion.button>
    </div>
  );
};
