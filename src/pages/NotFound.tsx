import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Compass, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div 
      className="bg-soft-ivory min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden" 
      id="not-found-page"
    >
      {/* Dynamic SEO Tag setting noindex and appropriate 404 metadata */}
      <SEO
        title="404: Page Not Found"
        description="The requested resource or page could not be located on SamaXon Digital Solutions."
        canonicalPath="/404"
        noindex={true}
      />

      {/* Subtle ambient luxury backdrop glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne-gold/5 rounded-full blur-[120px] pointer-events-none" 
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 text-[#A68936] font-mono text-xs uppercase font-bold tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#A68936] animate-pulse" />
            <span>HTTP Status • 404 Route Not Found</span>
          </div>

          {/* Large Stylized 404 Display */}
          <div className="space-y-2">
            <h1 className="font-display text-7xl sm:text-9xl font-black text-matte-black tracking-tight select-none">
              4<span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">0</span>4
            </h1>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-matte-black tracking-normal">
              Resource Not Located
            </h2>
          </div>

          {/* Descriptive Message */}
          <p className="text-base sm:text-lg text-[#554F49] max-w-xl mx-auto leading-relaxed">
            The destination URL you requested does not exist, has been restructured, or is temporarily unavailable. Please verify the web address or return to our core directories.
          </p>

          {/* Navigation Action Hub */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111111] text-[#FFFDF8] hover:bg-neutral-800 transition-all text-sm font-semibold tracking-wide shadow-md group"
              id="not-found-home-btn"
            >
              <Home className="w-4 h-4 text-champagne-gold transition-transform group-hover:-translate-y-0.5" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#D6B46A]/30 text-matte-black hover:border-champagne-gold hover:bg-champagne-gold/5 transition-all text-sm font-semibold tracking-wide shadow-xs"
              id="not-found-services-btn"
            >
              <Compass className="w-4 h-4 text-[#A68936]" />
              <span>Explore Services</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-neutral-300 text-neutral-700 hover:text-matte-black hover:border-neutral-400 transition-all text-sm font-medium tracking-wide"
              id="not-found-contact-btn"
            >
              <MessageSquare className="w-4 h-4 text-neutral-500" />
              <span>Direct Contact</span>
            </Link>
          </div>

          {/* Back Action */}
          <div className="pt-2">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#8A8178] hover:text-matte-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Previous Screen</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
