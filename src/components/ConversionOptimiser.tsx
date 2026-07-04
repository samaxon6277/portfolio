import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Calendar, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ConversionOptimiser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('918000000000');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('samaxon_website_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          const rawPhone = parsed.phoneWhatsapp || '918000000000';
          // Sanitize raw phone to digits only for the direct WhatsApp link
          const sanitized = rawPhone.replace(/[^\d]/g, '');
          setPhoneWhatsapp(sanitized || '918000000000');
        }
      } catch (e) {
        // Safe fail
      }
    };

    loadSettings();
    window.addEventListener('samaxon_website_settings_updated', loadSettings);
    return () => {
      window.removeEventListener('samaxon_website_settings_updated', loadSettings);
    };
  }, []);

  // Click outside to close the expandable floating menu - ONLY when open to prevent race conditions
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/${phoneWhatsapp}?text=Hello%20SamaXon%20team,%20I%20am%20interested%20in%20initiating%20a%2048-hour%20digital%20upgrade.`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleBookConsultation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/contact', { state: { source: 'floating-cta-consult' } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleStartProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/contact', { state: { source: 'floating-cta-start-project' } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  // Hide on Admin Panel to avoid covering control dashboards (safe early return after hooks)
  if (location.pathname === '/admin') return null;

  return (
    <div id="conversion-optimiser-global-hooks">
      {/* UNIFIED EXPANDABLE FLOATING ACTION BUTTON (FAB) FOR ALL SCREEN SIZES */}
      <div 
        ref={containerRef}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end font-sans"
      >
        {/* Expanded Action Stack */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex flex-col items-end gap-3 mb-3"
            >
              {/* Action 1: Start Project */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartProject}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] text-[#111111] rounded-full shadow-xl font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap border border-white/15 cursor-pointer hover:shadow-2xl hover:shadow-[#D6B46A]/20 transition-all"
              >
                <Zap className="w-4 h-4 text-[#111111] fill-current" />
                <span>Start Project</span>
              </motion.button>

              {/* Action 2: Book Consultation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookConsultation}
                className="flex items-center gap-2 px-4 py-3 bg-[#111111]/95 backdrop-blur-md text-white rounded-full shadow-xl font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap border border-[#D6B46A]/30 cursor-pointer hover:border-[#D6B46A] hover:bg-[#161616] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#D6B46A]" />
                <span>Consultation</span>
              </motion.button>

              {/* Action 3: WhatsApp Chat */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-full shadow-xl font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap border border-emerald-500/20 cursor-pointer hover:bg-emerald-700 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white text-white" />
                <span>WhatsApp Chat</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master FAB Trigger Button */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] text-matte-black flex items-center justify-center shadow-2xl border border-white/25 cursor-pointer focus:outline-none relative overflow-hidden group"
          title="SamaXon Quick Actions"
        >
          {/* Subtle pulse effect inside the trigger button */}
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="w-6 h-6 md:w-7 md:h-7 text-matte-black" />
            ) : (
              <Zap className="w-6 h-6 md:w-7 md:h-7 text-matte-black fill-matte-black/5" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
