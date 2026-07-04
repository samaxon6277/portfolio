import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a decision
    const consent = localStorage.getItem('samaxon-cookie-consent');
    if (!consent) {
      // Small timeout to make entrance transition look extremely intentional and high-end
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
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-6 left-6 max-w-sm md:max-w-md w-[calc(100%-3rem)] z-[100] font-sans"
        >
          <div className="bg-[#FFFDF8]/85 backdrop-blur-md border border-[#D6B46A]/35 rounded-[20px] p-5 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D6B46A]/10 border border-[#D6B46A]/30 rounded-full flex items-center justify-center text-[#BFA15A]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#BFA15A] uppercase font-bold block">Cookie Preferences</span>
                <h4 className="text-xs font-display font-bold uppercase text-neutral-900 tracking-wide">Optimising SamaXon.site</h4>
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 leading-relaxed">
              We use non-intrusive cookies to measure and enhance performance speed (guaranteeing a Lighthouse score &gt; 90) and to capture real-time crawler diagnostics. May we adjust your system preferences?
            </p>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border border-[#D6B46A]/20 text-[#8B7C62] hover:text-[#111111] hover:border-[#D6B46A]/50 rounded-xl transition-all cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-matte-black hover:bg-neutral-800 text-[#FFFDF8] rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Accept Preferences
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
