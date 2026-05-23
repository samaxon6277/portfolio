import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Multi-page routing via simple hash matching
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'about', 'services', 'portfolio', 'edge', 'control', 'careers', 'contact', 'privacy', 'terms', 'refund', 'admin'];
      
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    // Initialize routing on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
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
