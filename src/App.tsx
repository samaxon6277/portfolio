import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, RefreshCw } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConversionOptimiser from './components/ConversionOptimiser';
import CookieConsent from './components/CookieConsent';
import CustomCursor from './components/CustomCursor';
import AmbientBackground from './components/AmbientBackground';
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
import Founder from './pages/Founder';
import Team from './pages/Team';
import Company from './pages/Company';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Pricing from './pages/Pricing';
import SelectDirection from './pages/SelectDirection';
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
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden text-[#F5F5F7]" id="maintenance-mode-active-screen">
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(214, 180, 106, 0.12) 0%, transparent 60%)'
          }}
        />
        
        <div className="max-w-md w-full bg-[#121212] text-[#F5F5F7] border border-white/10 p-8 rounded-3xl text-center shadow-2xl relative z-10 space-y-6 animate-fade-in text-left">
          <div className="w-14 h-14 bg-[#D6B46A]/10 border border-[#D6B46A]/30 rounded-2xl flex items-center justify-center mx-auto">
            <Wrench className="w-7 h-7 text-[#D6B46A]" />
          </div>

          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">SYSTEM CALIBRATED MAINTENANCE</span>
            <h2 className="text-lg font-display font-bold uppercase tracking-wide">WE WILL BE BACK ONLINE SHORTLY</h2>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              The senior engineering team is currently upgrading high-fidelity layouts and server channels to guarantee optimal performance speeds.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col justify-center items-center gap-3">
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
              className="px-6 py-2.5 bg-[#D6B46A] text-[#0A0A0A] hover:bg-[#BFA15A] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md w-full justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Check Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden transition-colors duration-300" id="app-viewport">
      {/* Precision Ambient Atmosphere */}
      <AmbientBackground />

      {/* Desktop Custom Precision Cursor */}
      <CustomCursor />
      
      {/* Dynamic Floating Navbar */}
      <Navbar />

      {/* Global CTA Conversion Optimiser */}
      <ConversionOptimiser />

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Main viewport with elegant page entry transitions */}
      <main className="flex-grow relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
              
              <Route path="/founder" element={<Founder />} />
              <Route path="/team" element={<Team />} />
              <Route path="/company" element={<Company />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/select-direction" element={<SelectDirection />} />
              
              {/* Case Study Detail Page */}
              <Route path="/case-study/:id" element={<CaseStudyDetail />} />

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
              
              <Route path="/website-design-for-hotels-delhi" element={<SEOPage niche="hotel_delhi" />} />
              <Route path="/interior-design-website-development" element={<SEOPage niche="interior_dev" />} />
              <Route path="/gaming-website-development-india" element={<SEOPage niche="gaming_india" />} />
              <Route path="/business-automation-lead-generation-services" element={<SEOPage niche="business_auto" />} />
              <Route path="/website-development-delhi" element={<SEOPage niche="delhi_local" />} />
              
              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <HashUrlRedirector />
        <MainAppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
