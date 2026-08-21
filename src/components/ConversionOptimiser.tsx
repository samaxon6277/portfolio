import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Calendar, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SITE_CONFIG, getWhatsAppInquiryUrl } from '../config/siteConfig';

export default function ConversionOptimiser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(SITE_CONFIG.phoneWhatsappRaw);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('samaxon_website_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          const rawPhone = parsed.phoneWhatsapp || SITE_CONFIG.phoneWhatsappRaw;
          const sanitized = rawPhone.replace(/[^\d]/g, '');
          setPhoneWhatsapp(sanitized || SITE_CONFIG.phoneWhatsappRaw);
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
    const url = getWhatsAppInquiryUrl('Hello SamaXon team, I would like to discuss initiating a 48-hour digital build.');
    window.open(url, '_blank', 'noopener,noreferrer');
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
              initial={{ opacity: 0, y: 15, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.88 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="flex flex-col items-end gap-2.5 mb-3"
            >
              {/* Action 1: Start Project */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartProject}
                className="flex items-center gap-2 px-4 py-2.5 bg-champagne-gold text-matte-black rounded-full shadow-[0_8px_20px_-4px_rgba(214,180,106,0.38)] hover:shadow-[0_12px_28px_-4px_rgba(214,180,106,0.5)] font-bold text-[10.5px] uppercase tracking-[0.12em] whitespace-nowrap border border-white/30 cursor-pointer transition-all duration-200"
              >
                <Zap className="w-3.5 h-3.5 text-matte-black fill-current" />
                <span>Start Project</span>
              </motion.button>

              {/* Action 2: Book Consultation */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBookConsultation}
                className="flex items-center gap-2 px-4 py-2.5 bg-matte-black/95 backdrop-blur-md text-soft-ivory rounded-full shadow-[0_8px_20px_-4px_rgba(17,17,17,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(17,17,17,0.45)] font-bold text-[10.5px] uppercase tracking-[0.12em] whitespace-nowrap border border-champagne-gold/30 cursor-pointer hover:border-champagne-gold transition-all duration-200"
              >
                <Calendar className="w-3.5 h-3.5 text-champagne-gold" />
                <span>Consultation</span>
              </motion.button>

              {/* Action 3: WhatsApp Chat */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-full shadow-[0_8px_20px_-4px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_28px_-4px_rgba(16,185,129,0.48)] font-bold text-[10.5px] uppercase tracking-[0.12em] whitespace-nowrap border border-emerald-400/20 cursor-pointer hover:bg-emerald-700 transition-all duration-200"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white text-white" />
                <span>WhatsApp Chat</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master FAB Trigger Button */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="w-13 h-13 md:w-15 md:h-15 rounded-full bg-champagne-gold text-matte-black flex items-center justify-center shadow-[0_10px_28px_-4px_rgba(214,180,106,0.45)] hover:shadow-[0_16px_36px_-4px_rgba(214,180,106,0.6)] border border-white/40 cursor-pointer focus:outline-none relative overflow-hidden group transition-shadow duration-300"
          title="SamaXon Quick Actions"
        >
          {/* Subtle sheen effect */}
          <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6 text-matte-black" />
            ) : (
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-matte-black fill-matte-black/10" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
