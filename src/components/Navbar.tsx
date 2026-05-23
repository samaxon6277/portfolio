import { useState } from 'react';
import { Menu, X, Zap, Crown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'SamaXon Edge', id: 'edge' },
    { label: 'Client Control', id: 'control' },
    { label: 'Careers', id: 'careers' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsOpen(false);
    window.location.hash = id === 'home' ? '' : id;
  };

  return (
    <>
      {/* Floating Glassmorphism Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 transition-all duration-300">
        <nav className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between gold-shadow-sm">
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-10 h-10 bg-matte-black flex items-center justify-center rounded-xl border border-champagne-gold/30 group-hover:border-champagne-gold transition-all shadow-xl">
              <span className="text-champagne-gold font-bold text-lg font-display">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-widest text-base text-matte-black flex items-center gap-1 leading-none uppercase">
                SamaXon
                <Crown className="w-3.5 h-3.5 text-champagne-gold fill-champagne-gold/20" />
              </span>
              <span className="text-[9px] font-mono tracking-[0.12em] text-warm-grey uppercase leading-none mt-1 font-bold">
                48-HR Digital Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-${item.id}`}
                  className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-200 rounded-full relative ${
                    isActive 
                      ? 'text-matte-black' 
                      : 'text-warm-grey hover:text-[#D6B46A] hover:bg-champagne-gold/5'
                  }`}
                >
                  {isActive && (
                    <motion.span 
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#D6B46A]/10 to-[#D6B46A]/20 rounded-full border border-champagne-gold/30 -z-1"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Contact CTA Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('contact')}
              id="desktop-cta-start"
              className="px-6 py-3 bg-[#D6B46A] hover:bg-muted-gold text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#D6B46A]/10 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              Start Build
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-menu-toggle"
            className="lg:hidden p-2 text-matte-black hover:text-champagne-gold transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile Slide-Out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-matte-black/60 z-40 lg:hidden backdrop-blur-sm"
              id="mobile-menu-backdrop"
            />

            {/* Sliding Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-soft-ivory border-l border-champagne-gold/20 z-50 lg:hidden shadow-2xl flex flex-col p-8 justify-between"
              id="mobile-menu-drawer"
            >
              {/* Drawer Top */}
              <div>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-champagne-gold/15">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-champagne-gold" />
                    <span className="font-display font-medium text-matte-black uppercase tracking-widest text-sm">
                      SamaXon Studio
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-warm-grey hover:text-matte-black"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-3">
                  {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl uppercase tracking-wider text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-champagne-gold/15 to-champagne-gold/5 border border-champagne-gold/30 text-matte-black'
                            : 'text-warm-grey hover:bg-champagne-gold/5 hover:text-matte-black'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold uppercase tracking-widest text-xs font-bold rounded-xl border border-champagne-gold/30 text-center transition-all flex items-center justify-center gap-2"
                >
                  Start Build (48 Hours)
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[10px] font-mono text-center text-warm-grey uppercase tracking-widest">
                  India’s Premium Speed Studio
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
