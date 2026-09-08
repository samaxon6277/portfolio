import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Crown, ArrowRight, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';

interface NavbarProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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

  // Scroll logic for hide-on-scroll
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      // Show if near top, hide on scroll down, show on scroll up
      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        // Scrolling up (with 5px threshold to prevent jitter)
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Desktop streamlined navigation
  const desktopNavItems = [
    { label: 'Services', id: 'services', path: '/services' },
    { label: 'Work', id: 'portfolio', path: '/projects' },
    { label: 'Pricing', id: 'pricing', path: '/pricing' },
    { label: 'Guides', id: 'guides', path: '/guides' },
    { label: 'Partner', id: 'partner', path: '/partner', badge: '20%' },
    { label: 'AI Tools', id: 'tools', path: '/tools', badge: 'Free' },
    { label: 'Company', id: 'company', path: '/company' },
  ];

  // Mobile complete navigation
  const mobileNavItems = [
    { label: 'Home', id: 'home', path: '/' },
    { label: 'Services', id: 'services', path: '/services' },
    { label: 'Selected Work', id: 'portfolio', path: '/projects' },
    { label: 'Pricing Plans', id: 'pricing', path: '/pricing' },
    { label: "Buyer's Guides", id: 'guides', path: '/guides', badge: 'New' },
    { label: 'Partner Program', id: 'partner', path: '/partner', badge: '20% Earn' },
    { label: 'Free AI Tools', id: 'tools', path: '/tools', badge: 'Free' },
    { label: 'About SamaXon', id: 'about', path: '/about' },
    { label: 'SamaXon Edge (48-Hr)', id: 'edge', path: '/edge' },
    { label: 'Client Control', id: 'control', path: '/control' },
    { label: 'Careers', id: 'careers', path: '/careers' },
  ];

  return (
    <>
      {/* Floating Glassmorphism Header with Spring transition */}
      <motion.header 
        className="fixed top-4 left-1/2 w-[94%] max-w-7xl z-50 origin-top"
        style={{ x: '-50%', perspective: 1000 }}
        animate={{
          y: isVisible ? 0 : -110,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.94,
          rotateX: isVisible ? 0 : -12,
          filter: isVisible ? "blur(0px)" : "blur(4px)",
        }}
        transition={{
          type: "spring",
          stiffness: 160,
          damping: 20,
          mass: 0.6
        }}
      >
        <nav className="glass-header rounded-full px-5 sm:px-7 py-3 flex items-center justify-between transition-all duration-300">
          {/* Logo Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-matte-black flex items-center justify-center rounded-xl border border-champagne-gold/35 group-hover:border-champagne-gold group-hover:shadow-[0_0_16px_rgba(214,180,106,0.35)] transition-all duration-300 shadow-md">
              <span className="text-champagne-gold font-bold text-base sm:text-lg font-display">S</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold tracking-[0.16em] text-base sm:text-lg text-matte-black flex items-center gap-1.5 leading-none uppercase">
                SamaXon
                <Crown className="w-4 h-4 text-champagne-gold fill-champagne-gold/20" />
              </span>
              <span className="text-[11px] font-mono tracking-[0.14em] text-[#BFA15A] uppercase leading-none mt-1.5 font-bold">
                48-HR Digital Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Container with Strict Relative Coordinate Space */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-matte-black/[0.04] border border-champagne-gold/25 relative">
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                id={`nav-${item.id}`}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 text-sm font-semibold tracking-normal rounded-full transition-colors duration-200 cursor-pointer select-none ${
                    isActive 
                      ? 'text-matte-black' 
                      : 'text-matte-black/75 hover:text-matte-black hover:bg-champagne-gold/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span 
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-gradient-to-r from-champagne-gold/20 via-champagne-gold/30 to-champagne-gold/20 rounded-full border border-champagne-gold/45 shadow-[0_2px_8px_rgba(214,180,106,0.22)] -z-0"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {item.label}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 bg-[#D6B46A]/25 text-[#BFA15A] text-[10px] font-mono uppercase font-bold rounded">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Contact CTA Action */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              id="desktop-cta-start"
              className="px-5 py-2.5 bg-champagne-gold hover:bg-muted-gold text-matte-black text-sm font-bold tracking-wider rounded-full shadow-[0_4px_14px_rgba(214,180,106,0.32)] hover:shadow-[0_8px_24px_rgba(214,180,106,0.42)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-center inline-block"
            >
              Start Build
              <ArrowRight className="w-4 h-4 inline-block ml-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-menu-toggle"
            className="lg:hidden p-2 text-matte-black hover:text-champagne-gold transition-colors focus:outline-none cursor-pointer rounded-lg hover:bg-champagne-gold/10"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

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
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-soft-ivory border-l border-champagne-gold/20 z-50 lg:hidden shadow-2xl flex flex-col p-6 sm:p-8 justify-between text-left overflow-y-auto"
              id="mobile-menu-drawer"
            >
              {/* Drawer Top */}
              <div>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-champagne-gold/15">
                  <div className="flex items-center gap-2 text-left">
                    <Zap className="w-5 h-5 text-champagne-gold" />
                    <span className="font-display font-medium text-matte-black uppercase tracking-widest text-sm">
                      SamaXon Studio
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-warm-grey hover:text-matte-black cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-2 text-left">
                  {mobileNavItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `w-full text-left px-4 py-3 rounded-xl uppercase tracking-wider text-xs font-bold transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-gradient-to-r from-champagne-gold/20 to-champagne-gold/10 border border-champagne-gold/40 text-matte-black font-extrabold'
                            : 'text-[#38332E] hover:bg-champagne-gold/10 hover:text-matte-black'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-[#D6B46A]/25 text-[#8B6E23] text-[10px] font-mono uppercase font-bold rounded">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom: Free Consultation & Contacts */}
              <div className="flex flex-col gap-4 pt-6 border-t border-champagne-gold/20 mt-6">
                {/* Consultation Card */}
                <div className="p-4 bg-white/80 border border-champagne-gold/30 rounded-2xl space-y-2.5 text-xs text-left">
                  <div className="flex items-center gap-1.5 text-champagne-gold font-bold font-mono text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free Consultation
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href="tel:+917065451263"
                      className="flex items-center gap-2 text-matte-black hover:text-[#A68936] font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                      <span>+91 70654 51263</span>
                    </a>
                    <a 
                      href="mailto:info@samaxon.com"
                      className="flex items-center gap-2 text-[#595046] hover:text-matte-black transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                      <span>info@samaxon.com</span>
                    </a>
                    <div className="flex items-center gap-2 text-[#7A7167] text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                      <span>Delhi-NCR, India · Global Delivery</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold uppercase tracking-widest text-xs font-bold rounded-xl border border-champagne-gold/30 text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Start Build (48 Hours)
                  <ArrowRight className="w-4 h-4 text-champagne-gold" />
                </Link>
                <div className="text-[10px] font-mono text-center text-[#6B635B] uppercase tracking-widest font-bold">
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
