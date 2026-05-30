import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, RefreshCw } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import SamaXonEdge from './pages/SamaXonEdge';
import ClientControl from './pages/ClientControl';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import LegalPages from './pages/LegalPages';
import AdminPanel from './pages/AdminPanel';
import SEOPage from './pages/SEOPage';
import { analytics } from './utils/analytics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('samaxon_website_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return !!parsed.maintenanceMode;
      }
    } catch {
      return false;
    }
    return false;
  });

  // Track page views in real-time
  useEffect(() => {
    analytics.trackPageView(currentPage);
  }, [currentPage]);

  // Synchronise Maintenance Mode state on navigate or storage update
  useEffect(() => {
    const checkMaintenance = () => {
      try {
        const stored = localStorage.getItem('samaxon_website_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setMaintenanceMode(!!parsed.maintenanceMode);
        }
      } catch {}
    };
    checkMaintenance();
    window.addEventListener('storage', checkMaintenance);
    window.addEventListener('samaxon_website_settings_updated', checkMaintenance);
    return () => {
      window.removeEventListener('storage', checkMaintenance);
      window.removeEventListener('samaxon_website_settings_updated', checkMaintenance);
    };
  }, [currentPage]);

  // Multi-page routing via simple pathname & hash matching for search-crawlers and users
  useEffect(() => {
    const handleRouteChange = () => {
      const pathRaw = window.location.pathname.replace(/^\/|\/$/g, '');
      const hashRaw = window.location.hash.replace('#', '');
      
      const validPages = [
        'home', 'about', 'services', 'portfolio', 'edge', 'control', 'careers', 'contact', 
        'privacy', 'terms', 'refund', 'admin',
        'banquet-hall-website-design', 'resort-website-design', 'hotel-website-design', 
        'gym-website-design', 'restaurant-website-design', 'business-website-design'
      ];
      
      if (pathRaw && validPages.includes(pathRaw)) {
        setCurrentPage(pathRaw);
      } else if (hashRaw && validPages.includes(hashRaw)) {
        setCurrentPage(hashRaw);
      } else {
        setCurrentPage('home');
      }
    };

    // Initialize routing on load
    handleRouteChange();

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Isolate Admin Control Panel view
  if (currentPage === 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-[#FFFDF8]" id="app-viewport">
        <AdminPanel />
      </div>
    );
  }

  // Handle Maintenance Mode active view for client-facing visitors
  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-6 relative overflow-hidden text-matte-black" id="maintenance-mode-active-screen">
        {/* Luxury subtle pattern background */}
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(214, 180, 106, 0.15) 0%, transparent 60%)'
          }}
        />
        
        <div className="max-w-md w-full bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/20 p-8 rounded-3xl text-center shadow-2xl relative z-10 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#D6B46A]/10 border border-[#D6B46A]/35 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Wrench className="w-8 h-8 text-[#D6B46A]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-black block">SYSTEM CALIBRATED MAINTENANCE</span>
            <h2 className="text-xl font-display font-black uppercase tracking-wide">WE WILL BE BACK ONLINE SHORTLY</h2>
            <p className="text-xs text-[#A89F91] leading-relaxed">
              The senior engineering team is currently upgrading high-fidelity layouts and server channels to guarantee optimal performance speeds.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-[#D6B46A]/10 rounded-2xl text-xs space-y-1">
            <div className="text-[#BFA15A] font-bold font-mono text-[10px] uppercase">Visitor status: Blocked Ingress</div>
            <p className="text-[11px] text-[#A89F91]">
              Only validated administrative sessions can access the terminal nodes right now.
            </p>
          </div>

          <div className="pt-4 border-t border-[#D6B46A]/15 flex flex-col justify-center items-center gap-3">
            <button
              onClick={() => {
                try {
                  const stored = localStorage.getItem('samaxon_website_settings');
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    setMaintenanceMode(!!parsed.maintenanceMode);
                  }
                } catch {}
              }}
              className="px-6 py-2.5 bg-[#FFFDF8] text-[#111111] hover:bg-[#D6B46A] hover:text-[#111111] text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md w-full justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Check Status
            </button>
            <button
              onClick={() => {
                window.location.hash = '#admin';
                setCurrentPage('admin');
              }}
              className="text-[10px] uppercase tracking-wider text-[#A89F91] hover:text-[#FFFDF8] hover:underline cursor-pointer"
            >
              Administrative Access Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper to render active layout
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'about':
        return <About setCurrentPage={setCurrentPage} />;
      case 'services':
        return <Services setCurrentPage={setCurrentPage} />;
      case 'portfolio':
        return <Portfolio setCurrentPage={setCurrentPage} />;
      case 'edge':
        return <SamaXonEdge setCurrentPage={setCurrentPage} />;
      case 'control':
        return <ClientControl setCurrentPage={setCurrentPage} />;
      case 'careers':
        return <Careers />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <LegalPages type="privacy" />;
      case 'terms':
        return <LegalPages type="terms" />;
      case 'refund':
        return <LegalPages type="refund" />;
      case 'banquet-hall-website-design':
        return <SEOPage niche="banquet" setCurrentPage={setCurrentPage} />;
      case 'resort-website-design':
        return <SEOPage niche="resort" setCurrentPage={setCurrentPage} />;
      case 'hotel-website-design':
        return <SEOPage niche="hotel" setCurrentPage={setCurrentPage} />;
      case 'gym-website-design':
        return <SEOPage niche="gym" setCurrentPage={setCurrentPage} />;
      case 'restaurant-website-design':
        return <SEOPage niche="restaurant" setCurrentPage={setCurrentPage} />;
      case 'business-website-design':
        return <SEOPage niche="business" setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-soft-ivory selection:bg-champagne-gold/30 selection:text-matte-black relative overflow-x-hidden" id="app-viewport">
      {/* Global Luxury Radial Gradient Backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle at 12% 12%, rgba(214, 180, 106, 0.12) 0%, transparent 45%), radial-gradient(circle at 88% 88%, rgba(214, 180, 106, 0.12) 0%, transparent 45%)'
        }}
      />
      
      {/* Dynamic Floating Navbar with active control hooks */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main viewport with elegant page entry transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Multi-column Global Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
