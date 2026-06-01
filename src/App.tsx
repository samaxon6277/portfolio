import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HashUrlRedirector() {
  const navigate = useNavigate();
  useEffect(() => {
    const hash = (window.location?.hash || '').replace('#', '');
    const hashToPageMap: Record<string, string> = {
      'about': '/about',
      'services': '/services',
      'portfolio': '/projects',
      'projects': '/projects',
      'edge': '/edge',
      'control': '/control',
      'careers': '/careers',
      'contact': '/contact',
      'admin': '/admin'
    };
    if (hash && hashToPageMap[hash]) {
      navigate(hashToPageMap[hash], { replace: true });
    }
  }, [navigate]);
  return null;
}

function MainAppContent() {
  const location = useLocation();
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

  // Track page views in real-time on pathname change
  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

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
  }, [location.pathname]);

  // Isolate Admin Control Panel view or bypass maintenance screen for Admin
  const isAdmin = location.pathname === '/admin';

  if (isAdmin) {
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
        
        <div className="max-w-md w-full bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/20 p-8 rounded-3xl text-center shadow-2xl relative z-10 space-y-6 animate-fade-in text-left">
          <div className="w-16 h-16 bg-[#D6B46A]/10 border border-[#D6B46A]/35 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Wrench className="w-8 h-8 text-[#D6B46A]" />
          </div>

          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-black block">SYSTEM CALIBRATED MAINTENANCE</span>
            <h2 className="text-xl font-display font-black uppercase tracking-wide">WE WILL BE BACK ONLINE SHORTLY</h2>
            <p className="text-xs text-[#A89F91] leading-relaxed">
              The senior engineering team is currently upgrading high-fidelity layouts and server channels to guarantee optimal performance speeds.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-[#D6B46A]/10 rounded-2xl text-xs space-y-1 text-center">
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
              className="px-6 py-2.5 bg-[#FFFDF8] text-[#111111] hover:bg-[#D6B46A] hover:text-[#111111] text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md w-full justify-center font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Check Status
            </button>
            <a
              href="/admin"
              className="text-[10px] uppercase tracking-wider text-[#A89F91] hover:text-[#FFFDF8] hover:underline cursor-pointer font-bold font-mono"
            >
              Administrative Access Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-soft-ivory selection:bg-champagne-gold/30 selection:text-matte-black relative overflow-x-hidden" id="app-viewport">
      {/* Global Luxury Radial Gradient Backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle at 12% 12%, rgba(214, 180, 106, 0.12) 0%, transparent 45%), radial-gradient(circle at 88% 88%, rgba(214, 180, 106, 0.12) 0%, transparent 45%)'
        }}
      />
      
      {/* Dynamic Floating Navbar */}
      <Navbar />

      {/* Main viewport with elegant page entry transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Portfolio />} />
              <Route path="/edge" element={<SamaXonEdge />} />
              <Route path="/control" element={<ClientControl />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/start-project" element={<Contact />} />
              <Route path="/privacy" element={<LegalPages type="privacy" />} />
              <Route path="/terms" element={<LegalPages type="terms" />} />
              <Route path="/refund" element={<LegalPages type="refund" />} />
              
              {/* Niche Landing Pages */}
              <Route path="/banquet-hall-website-design" element={<SEOPage niche="banquet" />} />
              <Route path="/resort-website-design" element={<SEOPage niche="resort" />} />
              <Route path="/hotel-website-design" element={<SEOPage niche="hotel" />} />
              <Route path="/gym-website-design" element={<SEOPage niche="gym" />} />
              <Route path="/restaurant-website-design" element={<SEOPage niche="restaurant" />} />
              <Route path="/business-website-design" element={<SEOPage niche="business" />} />
              <Route path="/school-website-design" element={<SEOPage niche="school" />} />
              <Route path="/clinic-website-design" element={<SEOPage niche="clinic" />} />
              <Route path="/interior-designer-website-design" element={<SEOPage niche="interior" />} />
              
              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Multi-column Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <HashUrlRedirector />
      <MainAppContent />
    </BrowserRouter>
  );
}
