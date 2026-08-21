import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LiquidButton from './LiquidButton';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const consent = localStorage.getItem('samaxon-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('samaxon-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('samaxon-cookie-consent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 max-w-sm md:max-w-md w-[calc(100%-3rem)] z-[100] font-sans"
        >
          <div className={`backdrop-blur-3xl rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-left space-y-3.5 border relative overflow-hidden ${
            isDark 
              ? 'bg-[#121212]/85 border-white/12 text-[#F5F5F7] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)]' 
              : 'bg-white/80 border-black/10 text-[#1D1D1F] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/30 flex items-center justify-center text-[#D6B46A] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#D6B46A] uppercase font-bold block">Cookie Preferences</span>
                <h4 className="text-xs font-display font-bold uppercase tracking-wide">Optimising SamaXon.site</h4>
              </div>
            </div>

            <p className="text-[11px] text-[#8E8E93] leading-relaxed">
              We use non-intrusive cookies to measure and enhance performance speed (guaranteeing a Lighthouse score &gt; 90) and to capture real-time crawler diagnostics.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <LiquidButton
                variant="ghost"
                size="sm"
                onClick={handleDecline}
              >
                Decline
              </LiquidButton>
              <LiquidButton
                variant="gold"
                size="sm"
                onClick={handleAccept}
              >
                Accept Preferences
              </LiquidButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
