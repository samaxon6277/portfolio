import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Calendar, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LiquidButton from './LiquidButton';

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

  // Click outside to close
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

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.stopPropagation();
    window.open(`https://wa.me/${phoneWhatsapp}?text=Hello%20SamaXon%20team,%20I%20am%20interested%20in%20initiating%20a%2048-hour%20digital%20upgrade.`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleBookConsultation = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.stopPropagation();
    navigate('/contact', { state: { source: 'floating-cta-consult' } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleStartProject = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.stopPropagation();
    navigate('/contact', { state: { source: 'floating-cta-start-project' } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  if (location.pathname === '/admin') return null;

  return (
    <div id="conversion-optimiser-global-hooks">
      <div 
        ref={containerRef}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end font-sans"
      >
        {/* Expanded Action Stack in Liquid Glass Sheet Container */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.92, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10, scale: 0.92, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-end gap-2.5 mb-3 p-2 rounded-3xl backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
            >
              {/* Action 1: Start Project */}
              <LiquidButton
                variant="gold"
                size="sm"
                onClick={handleStartProject}
                icon={<Zap className="w-3.5 h-3.5 fill-current" />}
              >
                Start Project
              </LiquidButton>

              {/* Action 2: Book Consultation */}
              <LiquidButton
                variant="glass"
                size="sm"
                onClick={handleBookConsultation}
                icon={<Calendar className="w-3.5 h-3.5 text-[#D6B46A]" />}
              >
                Consultation
              </LiquidButton>

              {/* Action 3: WhatsApp Chat */}
              <LiquidButton
                variant="emerald"
                size="sm"
                onClick={handleWhatsAppClick}
                icon={<MessageSquare className="w-3.5 h-3.5 fill-white text-white" />}
              >
                WhatsApp Chat
              </LiquidButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Trigger Liquid Button */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-[#E7C77E] via-[#D6B46A] to-[#C49E4E] text-[#0A0A0A] flex items-center justify-center shadow-[0_10px_35px_rgba(214,180,106,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.9)] border border-white/30 cursor-pointer focus:outline-none relative overflow-hidden active:shadow-inner"
          title="SamaXon Quick Actions"
          aria-label="Quick action menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
