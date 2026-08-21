import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LiquidButton from './LiquidButton';

interface NavbarProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll logic for hide-on-scroll with smart threshold
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 5) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const navItems = [
    { label: 'Home', id: 'home', path: '/' },
    { label: 'About', id: 'about', path: '/about' },
    { label: 'Services', id: 'services', path: '/services' },
    { label: 'Portfolio', id: 'portfolio', path: '/projects' },
    { label: 'Pricing', id: 'pricing', path: '/pricing' },
    { label: 'SamaXon Edge', id: 'edge', path: '/edge' },
    { label: 'Client Control', id: 'control', path: '/control' },
    { label: 'Careers', id: 'careers', path: '/careers' },
  ];

  return (
    <>
      {/* Floating Liquid Glass Precision Pill Header */}
      <motion.header 
        className="fixed top-4 md:top-5 left-1/2 w-[94%] max-w-6xl z-50 origin-top"
        style={{ x: '-50%' }}
        initial={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
        animate={{
          y: isVisible ? 0 : -90,
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <nav 
          className="rounded-full px-4 md:px-5 py-2.5 flex items-center justify-between transition-all duration-300 backdrop-blur-3xl backdrop-saturate-200 relative overflow-hidden bg-gradient-to-r from-white/80 via-white/55 to-white/75 border border-white/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.02),inset_0_1.5px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(255,255,255,0.4)]"
        >
          {/* Convex top meniscus water gloss */}
          <div 
            className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none rounded-t-full bg-gradient-to-b from-white/60 via-white/20 to-transparent opacity-90" 
            aria-hidden="true" 
          />

          {/* Subtle water refraction sheen */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 bg-gradient-to-r from-transparent via-white/50 to-transparent" 
            aria-hidden="true" 
          />

          {/* Logo Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 cursor-pointer group select-none relative z-10"
            id="brand-logo"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm bg-gradient-to-br from-[#2A2A2D] to-[#121214] border border-white/20 text-[#D6B46A]">
              <span className="font-display font-black text-sm tracking-tighter">S</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold tracking-wider text-xs md:text-sm uppercase flex items-center gap-1 leading-none text-[#1D1D1F]">
                SamaXon
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A]" />
              </span>
              <span className="text-[8px] font-mono tracking-[0.14em] text-[#8E8E93] uppercase leading-none mt-1 font-semibold">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-0.5 relative z-10">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                id={`nav-${item.id}`}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 rounded-full relative inline-block ${
                    isActive 
                      ? 'text-[#1D1D1F] font-bold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span 
                        layoutId="active-nav-indicator"
                        className="absolute inset-0 rounded-full -z-10 bg-white/80 border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.03),inset_0_1px_1.5px_rgba(255,255,255,1)] backdrop-blur-md"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Actions: Start Build CTA */}
          <div className="hidden lg:flex items-center gap-3 relative z-10">
            {/* Liquid Physics CTA Button */}
            <LiquidButton
              to="/contact"
              id="desktop-cta-start"
              variant="gold"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Start Build
            </LiquidButton>
          </div>

          {/* Mobile Right Controls: Menu Button */}
          <div className="flex items-center gap-2 lg:hidden relative z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-full transition-colors cursor-pointer border text-[#1D1D1F] border-white/80 bg-white/60 backdrop-blur-lg hover:bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Slide-Out Liquid Glass Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-md"
              id="mobile-menu-backdrop"
            />

            {/* Sliding Liquid Glass Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm z-50 lg:hidden shadow-2xl flex flex-col p-6 justify-between text-left backdrop-blur-3xl backdrop-saturate-200 bg-gradient-to-b from-white/90 via-white/80 to-white/90 border-l border-white/90 text-[#1D1D1F] shadow-[0_24px_60px_rgba(0,0,0,0.12),inset_0_1.5px_2px_rgba(255,255,255,1)]"
              id="mobile-menu-drawer"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                  <div className="flex items-center gap-2 text-left">
                    <span className="w-2 h-2 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A]" />
                    <span className="font-display font-bold uppercase tracking-wider text-xs">
                      SamaXon Studio
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-black/5 cursor-pointer transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1.5 text-left">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `w-full text-left px-4 py-3 rounded-2xl tracking-wide text-xs font-semibold transition-all inline-block ${
                          isActive
                            ? 'bg-white/80 border border-white/90 text-black font-bold backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_1.5px_rgba(255,255,255,1)]'
                            : 'text-[#6E6E73] hover:text-black hover:bg-white/40'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom CTA */}
              <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
                <LiquidButton
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  variant="gold"
                  size="md"
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Build (48 Hours)
                </LiquidButton>
                <div className="text-[9px] font-mono text-center text-[#8E8E93] uppercase tracking-widest">
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
