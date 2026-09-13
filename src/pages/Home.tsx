import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Star, Layers, Code, Sparkles, MessageCircle, ArrowUpRight, PlayCircle, Trophy, BarChart3, Database, ShieldCheck, Mail, Users, FileSpreadsheet, Crown, Plus, Minus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { SERVICES_DATA, PORTFOLIO_DATA, TESTIMONIALS_DATA } from '../data';
import { PAGE_TO_ROUTE } from '../utils/navigation';
import { SITE_CONFIG, getWhatsAppInquiryUrl } from '../config/siteConfig';
import LiveUpdateSection from '../components/LiveUpdateSection';

function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const match = value.match(/^([^\d]*)(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[2], 10);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000; // Premium deceleration duration
          const startTime = performance.now();

          const animate = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: easeOutQuint for extremely professional and smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 5);
            const currentCount = Math.floor(easeProgress * target);
            
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, hasAnimated]);

  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) {
    return <span>{value}</span>;
  }
  const prefix = match[1] || '';
  const suffix = match[3] || '';

  return (
    <span ref={elementRef} className="tabular-nums font-black text-champagne-gold">
      {prefix}
      {hasAnimated ? count : 0}
      {suffix}
    </span>
  );
}

function StatCard({ value, label, colSpan = "" }: { value: string; label: string; colSpan?: string }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1400);
  };

  return (
    <motion.button 
      type="button"
      onClick={handleClick}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 14 } }
      }}
      whileHover={{ 
        y: -6, 
        scale: 1.04, 
        borderColor: 'rgba(214, 180, 106, 0.65)', 
        backgroundColor: 'rgba(26, 24, 20, 0.75)',
        boxShadow: "0 20px 40px -10px rgba(214, 180, 106, 0.28)"
      }}
      whileTap={{ 
        scale: 0.92,
        y: 2,
        boxShadow: "0 6px 16px rgba(214, 180, 106, 0.35)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`group relative p-6 md:p-8 rounded-[1.5rem] bg-[#111111]/55 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center transition-colors duration-200 select-none cursor-pointer outline-none overflow-hidden ${colSpan} ${
        clicked ? 'border-[#D6B46A] ring-2 ring-[#D6B46A]/60 bg-[#1C1A16]' : ''
      }`}
    >
      {/* 3D Sheen Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {clicked && (
        <motion.span 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#D6B46A] text-[#0A0A09] text-[8px] font-mono font-black uppercase tracking-wider shadow-sm z-10"
        >
          ✓ Live Verified
        </motion.span>
      )}

      <span className="block text-3xl md:text-4xl font-display font-black text-champagne-gold tracking-tight mb-1 group-hover:scale-105 group-hover:text-white transition-all duration-300">
        <AnimatedCounter value={value} />
      </span>
      <span className="block text-xs sm:text-sm uppercase tracking-widest text-[#DCD7CF] font-bold font-mono group-hover:text-[#D6B46A] transition-colors duration-300 text-center">
        {label}
      </span>
      <span className="text-[8px] font-mono text-[#7A7266] uppercase tracking-wider mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
        Tap to verify
      </span>
    </motion.button>
  );
}

function InteractiveStatsGrid({ stats }: { stats: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'unavailable'>('unavailable');
  
  // High performance coordinates for buttery-smooth liquid motion
  const targetX = useRef(50); 
  const targetY = useRef(50); 
  const currentX = useRef(50);
  const currentY = useRef(50);
  
  const glowElementRef = useRef<HTMLDivElement>(null);

  // Check if permission prompt is required for iOS/Safari
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      // iOS devices need permission
      setPermissionState('prompt');
    } else {
      // Android / Desktop does not require explicit iOS prompt API
      setPermissionState('granted');
    }
  }, []);

  const requestPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const result = await (DeviceOrientationEvent as any).requestPermission();
        if (result === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('unavailable');
        }
      } catch (err) {
        console.error('Error requesting orientation permission:', err);
        setPermissionState('unavailable');
      }
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    
    // Smooth update loop (LERP with direct DOM styling bypasses React re-render lags)
    const updatePosition = () => {
      // Luxurious slow interpolation for heavy liquid look (0.057)
      currentX.current += (targetX.current - currentX.current) * 0.057;
      currentY.current += (targetY.current - currentY.current) * 0.057;
      
      if (glowElementRef.current) {
        glowElementRef.current.style.background = `radial-gradient(circle 420px at ${currentX.current}% ${currentY.current}%, rgba(214, 180, 106, 0.35) 0%, rgba(214, 180, 106, 0.12) 40%, rgba(191, 161, 90, 0.02) 70%, transparent 100%)`;
      }
      
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    
    animationFrameId = requestAnimationFrame(updatePosition);

    // Mouse handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      targetX.current = Math.max(0, Math.min(100, x));
      targetY.current = Math.max(0, Math.min(100, y));
    };

    // Touch handler - supports seamless drag triggers on touch devices
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      targetX.current = Math.max(0, Math.min(100, x));
      targetY.current = Math.max(0, Math.min(100, y));
    };

    // Auto-calibrating variables for starting angle baselines
    let initialBeta: number | null = null;
    let initialGamma: number | null = null;

    // Gyroscope handler with strong low-pass filter to eliminate raw hardware micro-jitter/shaking
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta; 
      const gamma = e.gamma; 

      if (beta !== null && gamma !== null) {
        // Calibrate baseline dynamically on the first event
        if (initialBeta === null) initialBeta = beta;
        if (initialGamma === null) initialGamma = gamma;

        // Delta relative to initial holding posture (clamp comfortable active range to 30deg)
        const deltaBeta = Math.max(-30, Math.min(30, beta - initialBeta));
        const deltaGamma = Math.max(-30, Math.min(30, gamma - initialGamma));

        // Soft, non-jittery mapping from hardware delta to responsive fluid coordinate system
        const targetXRaw = 50 + (deltaGamma / 30) * 45;
        const targetYRaw = 50 + (deltaBeta / 30) * 45;

        // Apply progressive dampening filter on inputs before target assignment
        targetX.current = targetX.current * 0.85 + Math.max(5, Math.min(95, targetXRaw)) * 0.15;
        targetY.current = targetY.current * 0.85 + Math.max(5, Math.min(95, targetYRaw)) * 0.15;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchstart', handleTouchMove, { passive: true });
    }
    
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchstart', handleTouchMove);
      }
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative p-0.5 rounded-[2.5rem] bg-gradient-to-b from-[#D6B46A]/20 to-transparent overflow-hidden isolate"
    >
      {/* Butter-smooth Dynamic Golden Liquid Light Glow */}
      <div 
        ref={glowElementRef}
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 380px at 50% 50%, rgba(214, 180, 106, 0.12) 0%, transparent 100%)`,
        }}
      />
      
      {/* Dark premium matte backdrop */}
      <div className="absolute inset-0 bg-[#0B0B0B]/98 -z-20 rounded-[2.5rem]" />
      
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 p-4 md:p-8 text-center font-sans relative z-10"
      >
        <StatCard value={stats.totalProjects} label="Total Projects" />
        <StatCard value={stats.activeClients} label="Active Clients" />
        <StatCard value={stats.teamMembers} label="Team Members" />
        <StatCard value={stats.industriesServed} label="Industries Served" />
        <StatCard value={stats.yearsExperience} label="Years Experience" colSpan="col-span-2 md:col-span-1" />
      </motion.div>
    </div>
  );
}

interface HomeProps {
  setCurrentPage?: (page: string) => void;
}

export default function Home({ setCurrentPage }: HomeProps) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoDirection, setDemoDirection] = useState<'hotel' | 'corporate' | 'retail'>('hotel');
  const [activeControlTab, setActiveControlTab] = useState<'content' | 'leads' | 'analytics'>('content');
  const [activeSprintStage, setActiveSprintStage] = useState<1 | 2 | 3>(2);
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);
  const [telemetryNotice, setTelemetryNotice] = useState<string | null>(null);
  const [testHeadlineIndex, setTestHeadlineIndex] = useState<number>(0);
  const [testLeadAdded, setTestLeadAdded] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalProjects: '42+',
    activeClients: '18+',
    teamMembers: '8+',
    industriesServed: '12+',
    yearsExperience: '5+'
  });
  const [homeAnalyzerInput, setHomeAnalyzerInput] = useState('');

  const handleHomeAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeAnalyzerInput.trim()) {
      navigate('/analyzer');
      return;
    }
    const cleanUrl = homeAnalyzerInput.trim();
    navigate(`/analyzer?url=${encodeURIComponent(cleanUrl)}`);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samaxon_website_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setStats({
          totalProjects: parsed.statTotalProjects || '42+',
          activeClients: parsed.statActiveClients || '18+',
          teamMembers: parsed.statTeamMembers || '8+',
          industriesServed: parsed.statIndustriesServed || '12+',
          yearsExperience: parsed.statYearsExperience || '5+'
        });
      }
    } catch {}
  }, []);

  const handleAction = (page: string) => {
    const targetRoute = PAGE_TO_ROUTE[page] || '/';
    navigate(targetRoute);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const defaultOrgSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "SamaXon Digital Solutions",
    "alternateName": [
      "SamaXon",
      "SamaXon Digital Studio",
      "SamaXon Digital Solutions",
      "SamaXon Studio",
      "SamaXon digital"
    ],
    "description": "SamaXon is India's premier website developer agency and digital studio, widely recognized as the best website developer and custom software company. We build speed-optimized corporate portals, luxury business sites, hotel/resort systems, and custom admin dashboards with express 48-hour delivery.",
    "knowsAbout": [
      "website development",
      "web developer agency Noida",
      "best website developer Delhi NCR",
      "premium UI/UX design",
      "custom booking solutions",
      "corporate portal development",
      "SamaXon digital solutions"
    ],
    "image": `${SITE_CONFIG.baseUrl}/og-image.jpg`,
    "@id": `${SITE_CONFIG.baseUrl}/#organization`,
    "url": SITE_CONFIG.baseUrl,
    "telephone": SITE_CONFIG.phoneWhatsapp,
    "priceRange": SITE_CONFIG.priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.street,
      "addressLocality": SITE_CONFIG.address.city,
      "addressRegion": SITE_CONFIG.address.region,
      "postalCode": SITE_CONFIG.address.postalCode,
      "addressCountry": SITE_CONFIG.address.countryCode
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does 48-hour delivery work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SamaXon's 48-hour delivery works by utilizing pre-compiled speed frameworks, modular custom blueprints, and our unique Demo-First model. Instead of endless wireframing, we build a fully working, premium visual prototype within 24 hours. Once you review and confirm, we complete fine-tuning and deploy it to enterprise-grade servers within the next 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need tech skills to manage my website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not at all. Every SamaXon website includes an intuitive, bespoke client administration panel. You can easily manage bookings, content, images, portfolios, and settings without writing a single line of code. We also provide a complete custom video walkthrough guide on launch."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Demo-First model?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In our Demo-First model, we do not waste weeks on theoretical wireframes or presentations. We listen to your requirements and build a real, high-performance, live-interactive prototype first. You experience the actual page speed, layout, and system features on your own phone or computer before any formal contract. What you see is exactly what you get."
        }
      },
      {
        "@type": "Question",
        "name": "Does SamaXon support custom API integrations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We configure secure API routes, webhook events, and server-side authentication proxies. Whether you need Google Sheets syncing, Razorpay/Stripe checkout, custom WhatsApp responders, or booking managers, we build real, secure, server-side integrations."
        }
      }
    ]
  };

  const faqItems = [
    {
      q: "How does 48-hour delivery work?",
      a: "SamaXon's 48-hour delivery works by utilizing pre-compiled speed frameworks, modular custom blueprints, and our unique Demo-First model. Instead of endless wireframing, we build a fully working, premium visual prototype within 24 hours. Once you review and confirm, we complete fine-tuning and deploy it to enterprise-grade servers within the next 24 hours."
    },
    {
      q: "Do I need tech skills to manage my website?",
      a: "Not at all. Every SamaXon website includes an intuitive, bespoke client administration panel. You can easily manage bookings, content, images, portfolios, and settings without writing a single line of code. We also provide a complete custom video walkthrough guide on launch."
    },
    {
      q: "What is the Demo-First model?",
      a: "In our Demo-First model, we do not waste weeks on theoretical wireframes or presentations. We listen to your requirements and build a real, high-performance, live-interactive prototype first. You experience the actual page speed, layout, and system features on your own phone or computer before any formal contract. What you see is exactly what you get."
    },
    {
      q: "Does SamaXon support custom API integrations?",
      a: "Absolutely. We configure secure API routes, webhook events, and server-side authentication proxies. Whether you need Google Sheets syncing, Razorpay/Stripe checkout, custom WhatsApp responders, or booking managers, we build real, secure, server-side integrations."
    }
  ];

  return (
    <div id="home-page-container">
      <SEO 
        title="Speed-Driven Premium Digital Studio India"
        description="SamaXon builds elite business websites, mobile apps, brand identities, custom automations, and Telegram bots in under 48 hours with a Demo-First model."
        canonicalPath="/"
        schemas={[defaultOrgSchema, faqSchema]}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 overflow-hidden" id="hero-section">
        {/* Abstract Fluid Gradients for soft ambient lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-champagne-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-muted-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Main Words */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-white/75 backdrop-blur-md rounded-full border border-[#D6B46A]/30 w-max shadow-sm"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#D6B46A] animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-[0.16em] text-[#85641C]">
                India’s Premium 48-Hour Digital Studio
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display text-4xl sm:text-5xl lg:text-[68px] lg:leading-[1.0] font-black tracking-tighter text-[#111111]"
            >
              The Future of <br className="hidden sm:inline" />
              <span className="text-[#D6B46A]">Digital Branding</span>, <br />
              Delivered in 48 Hours.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg sm:text-xl text-[#3D3731] font-normal leading-relaxed max-w-[620px]"
            >
              SamaXon builds high-performance websites, mobile apps, premium brand identities, automations, and business control systems for founders who do not have time for slow agencies and average execution.
            </motion.p>

            {/* Elite B2B Studio Trust Note */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-l-2 border-[#D6B46A] pl-4 py-2.5 my-2 bg-[#D6B46A]/10 rounded-r-xl max-w-xl"
            >
              <p className="text-sm font-semibold text-[#181614] leading-relaxed">
                “Stop losing high-ticket clients to sluggish agency cycles. SamaXon engineers fast, precision-built digital assets and automated workflows ready for modern enterprise scale.”
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 w-full sm:w-auto"
            >
              <button
                onClick={() => handleAction('contact')}
                id="hero-primary-cta"
                className="w-full sm:w-auto px-7 py-4 bg-[#111111] text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-champagne-gold/30 shadow-[0_6px_20px_rgba(17,17,17,0.35)] hover:shadow-[0_10px_28px_rgba(17,17,17,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer duration-200 transition-all"
              >
                Start Your 48-Hour Build
                <ArrowRight className="w-4 h-4 text-champagne-gold ml-1" />
              </button>
              <button
                onClick={() => handleAction('services')}
                id="hero-secondary-cta"
                className="w-full sm:w-auto px-7 py-4 bg-white/80 border border-champagne-gold/40 text-[#111111] hover:bg-matte-black hover:text-soft-ivory hover:border-matte-black font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl backdrop-blur-sm shadow-[0_2px_8px_rgba(17,17,17,0.04)] hover:shadow-[0_6px_18px_rgba(17,17,17,0.1)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer duration-200 transition-all"
              >
                Explore Capabilities
              </button>
              <button
                onClick={() => navigate('/analyzer')}
                id="hero-analyzer-cta"
                className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-[#D6B46A]/20 via-white/80 to-[#D6B46A]/20 border border-[#D6B46A] text-[#111111] hover:bg-[#111111] hover:text-[#FFFDF8] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl backdrop-blur-md shadow-[0_4px_16px_rgba(214,180,106,0.25)] hover:shadow-[0_8px_24px_rgba(214,180,106,0.4)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer duration-200 transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Search className="w-4 h-4 text-[#85641C] group-hover:text-[#D6B46A] transition-colors" />
                <span>Free Website Analyzer</span>
              </button>
            </motion.div>

            {/* Interactive Brand Trust tags with 3D tactile feedback */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-2.5 mt-4"
            >
              {[
                { name: 'Senior Developer Wing', targetId: 'edge-section' },
                { name: 'Design Studio', targetId: 'edge-section' },
                { name: 'Demo-First Model', targetId: 'edge-section' },
                { name: 'Admin Dashboard Ready', targetId: 'control-section' },
                { name: '48-Hour Delivery', targetId: 'process-section' }
              ].map((tag, idx) => (
                <motion.button 
                  key={idx}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(tag.targetId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  whileHover={{ 
                    scale: 1.07, 
                    y: -3,
                    borderColor: 'rgba(214, 180, 106, 0.75)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: "0 10px 24px -5px rgba(214, 180, 106, 0.3)"
                  }}
                  whileTap={{ 
                    scale: 0.92,
                    y: 1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="px-4 py-2 bg-soft-ivory/90 border border-champagne-gold/30 text-[#1F1C1A] font-bold uppercase tracking-wider text-xs rounded-full gold-shadow-sm font-mono flex items-center gap-2 cursor-pointer select-none active:bg-champagne-gold active:text-black transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold animate-pulse" />
                  <span>{tag.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Hero Right Column: 48-Hour Live Sprint Cockpit Showcase */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ 
                boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 50px rgba(214,180,106,0.2)"
              }}
              className="relative w-full max-w-[460px] rounded-[32px] bg-[#0E0D0B] p-6 sm:p-7 border border-[#D6B46A]/35 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(214,180,106,0.12)] text-[#FFFDF8] isolate overflow-hidden transition-shadow duration-300"
            >
              {/* Subtle luxury ambient glow inside card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D6B46A]/5 rounded-full blur-2xl pointer-events-none -z-10" />

              {/* Console Top Header */}
              <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6B46A]/25 to-black/40 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A]">
                    <Zap className="w-5 h-5 fill-[#D6B46A]/20" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-[#FFFDF8] flex items-center gap-2">
                      <span>48-Hour Sprint Engine</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#D6B46A] tracking-widest uppercase font-semibold">
                      Live Delivery Cockpit #48-EXP
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">Active</span>
                </div>
              </div>

              {/* 3-Step Sprint Pipeline Sequence - Fully 3D Clickable */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A89F91]">
                  <span>Execution Pipeline (Tap to Inspect)</span>
                  <span className="text-[#D6B46A] font-bold">48-Hour Total Window</span>
                </div>

                {/* Stage 01 */}
                <motion.button 
                  type="button"
                  onClick={() => setActiveSprintStage(1)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 cursor-pointer text-left ${
                    activeSprintStage === 1
                      ? 'bg-gradient-to-r from-[#D6B46A]/20 via-[#D6B46A]/10 to-transparent border-[#D6B46A] shadow-[0_0_20px_rgba(214,180,106,0.2)]'
                      : 'bg-white/[0.04] border-[#D6B46A]/15 hover:border-[#D6B46A]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono font-bold">✓</span>
                    <div>
                      <div className="text-xs font-bold text-[#FFFDF8] flex items-center gap-1.5">
                        <span>Stage 01: Decode & Architecture</span>
                        {activeSprintStage === 1 && <span className="text-[9px] text-[#D6B46A] font-mono font-bold">(Viewing)</span>}
                      </div>
                      <div className="text-[10px] text-[#A89F91] font-mono">Scope locked & core blueprints mapped</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">0-4 Hours</span>
                </motion.button>

                {/* Stage 02 */}
                <motion.button 
                  type="button"
                  onClick={() => setActiveSprintStage(2)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 cursor-pointer text-left ${
                    activeSprintStage === 2
                      ? 'bg-gradient-to-r from-[#D6B46A]/25 via-[#D6B46A]/15 to-transparent border-[#D6B46A] shadow-[0_0_25px_rgba(214,180,106,0.25)]'
                      : 'bg-white/[0.04] border-[#D6B46A]/15 hover:border-[#D6B46A]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D6B46A] text-black flex items-center justify-center text-[10px] font-mono font-black animate-pulse">02</span>
                    <div>
                      <div className="text-xs font-bold text-[#FFFDF8] flex items-center gap-1.5">
                        <span>Stage 02: High-Fidelity UI & Motion</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] animate-ping" />
                      </div>
                      <div className="text-[10px] text-[#D6B46A] font-mono">Senior Engineering Wing staging preview</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#D6B46A] font-bold">In Progress</span>
                </motion.button>

                {/* Stage 03 */}
                <motion.button 
                  type="button"
                  onClick={() => setActiveSprintStage(3)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 cursor-pointer text-left ${
                    activeSprintStage === 3
                      ? 'bg-gradient-to-r from-[#D6B46A]/20 via-[#D6B46A]/10 to-transparent border-[#D6B46A] shadow-[0_0_20px_rgba(214,180,106,0.2)]'
                      : 'bg-white/[0.02] border-white/5 hover:border-[#D6B46A]/40 opacity-85'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-[#A89F91] flex items-center justify-center text-[10px] font-mono font-bold">03</span>
                    <div>
                      <div className="text-xs font-bold text-[#DCD7CF] flex items-center gap-1.5">
                        <span>Stage 03: Production Deployment</span>
                        {activeSprintStage === 3 && <span className="text-[9px] text-[#D6B46A] font-mono font-bold">(Viewing)</span>}
                      </div>
                      <div className="text-[10px] text-[#7A7266] font-mono">Global CDN + Admin Remote Control live</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#A89F91] font-bold">Hour 48</span>
                </motion.button>
              </div>

              {/* Dynamic Stage Drilldown Detail Preview */}
              <motion.div 
                key={activeSprintStage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-white/[0.04] border border-[#D6B46A]/25 rounded-2xl mb-4 text-left"
              >
                <div className="text-[9px] font-mono uppercase text-[#D6B46A] font-bold flex items-center justify-between">
                  <span>Selected Stage {activeSprintStage} Milestones</span>
                  <span className="text-emerald-400">Guaranteed SLA</span>
                </div>
                <p className="text-xs text-[#FFFDF8] mt-1 font-medium leading-relaxed">
                  {activeSprintStage === 1 && "• Business DNA decode • Visual color & layout architecture locked • Direct wireframe bypass to eliminate 14-day delays."}
                  {activeSprintStage === 2 && "• Senior front-end engineers write production-ready code • 60 FPS smooth motion • WhatsApp and client lead channels integrated."}
                  {activeSprintStage === 3 && "• Worldwide Cloudflare CDN deployment • SSL secured • Custom domain pointed • Zero-code Admin Remote Control handover."}
                </p>
              </motion.div>

              {/* Real-time Telemetry Stats Pill Bar - Clickable with 3D feedback */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-black/50 border border-white/10 mb-5 text-center">
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setTelemetryNotice("⚡ Google PageSpeed 99+ verified on mobile & desktop!");
                    setTimeout(() => setTelemetryNotice(null), 2500);
                  }}
                  className="p-1 cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="text-xs font-bold text-[#D6B46A] font-mono">99 / 100</div>
                  <div className="text-[9px] text-[#A89F91] uppercase tracking-wider mt-0.5">Speed Index</div>
                </motion.button>

                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setTelemetryNotice("📩 Leads pushed to WhatsApp & Telegram within 1.2 seconds!");
                    setTimeout(() => setTelemetryNotice(null), 2500);
                  }}
                  className="p-1 border-x border-white/10 cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="text-xs font-bold text-emerald-400 font-mono">Instant</div>
                  <div className="text-[9px] text-[#A89F91] uppercase tracking-wider mt-0.5">Lead Routing</div>
                </motion.button>

                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setTelemetryNotice("🛠️ Zero code needed to edit slogans, photos, or prices!");
                    setTimeout(() => setTelemetryNotice(null), 2500);
                  }}
                  className="p-1 cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="text-xs font-bold text-[#FFFDF8] font-mono">100% Zero</div>
                  <div className="text-[9px] text-[#A89F91] uppercase tracking-wider mt-0.5">Code Admin</div>
                </motion.button>
              </div>

              {telemetryNotice && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-2.5 bg-[#D6B46A]/20 border border-[#D6B46A] rounded-xl text-center text-[10px] font-mono text-[#FFFDF8] font-bold"
                >
                  {telemetryNotice}
                </motion.div>
              )}

              {/* Direct Cockpit CTA */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/service-request')}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D6B46A] via-[#E5C158] to-[#BFA15A] text-[#111111] hover:brightness-105 font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_6px_20px_rgba(214,180,106,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <span>Launch 48-Hour Build Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/projects')}
                  className="w-full py-2 text-[10px] font-mono uppercase tracking-widest text-[#A89F91] hover:text-[#FFFDF8] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Inspect Live Work Examples & Case Studies →</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR / COHESIVE SPEED PROMISE & TRUST BUILDERS --- */}
      <section className="bg-matte-black border-y border-champagne-gold/15 py-12 relative overflow-hidden" id="trust-bar-section">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-champagne-gold/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          
          {/* STATS COUNT GRID (Trust Builders with 3D Parallax Gyro & Hover Tracking) */}
          <InteractiveStatsGrid stats={stats} />

          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Built for business owners who want speed without compromising class.
            </p>
            <div className="h-px bg-champagne-gold/15 w-24 my-1" />
            <p className="text-xs text-[#E5DBCF]/80 max-w-4xl leading-relaxed">
              No endless waiting. No basic templates. No confusing process. SamaXon brings senior engineering, high-caliber aesthetic design, smart workflow automation, and dashboard systems under one premium execution studio.
            </p>
          </div>
        </div>
      </section>

      {/* --- CAPABILITIES PREVIEW GRID --- */}
      <section className="py-24 bg-soft-ivory relative" id="capabilities-grid-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">
              One Studio. Complete Digital Power.
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-matte-black">
              Capabilities Suite
            </h2>
            <p className="text-sm text-warm-grey max-w-2xl leading-relaxed">
              From your first high-end logo to your full business control dashboard, SamaXon handles the complete digital chain with uncompromising posture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.slice(0, 6).map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  borderColor: 'rgba(214, 180, 106, 0.65)',
                  boxShadow: "0 24px 48px -12px rgba(214, 180, 106, 0.22)"
                }}
                whileTap={{ 
                  scale: 0.96,
                  y: -2
                }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                onClick={() => navigate(`/service-request?service=${service.id}`)}
                className="bg-white/70 border border-champagne-gold/20 p-8 rounded-3xl duration-200 transition-colors gold-shadow-sm flex flex-col justify-between group h-full cursor-pointer relative overflow-hidden"
              >
                {/* 3D Glass Sheen on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-matte-black text-champagne-gold flex items-center justify-center border border-champagne-gold/20 mb-6 group-hover:scale-110 group-hover:rotate-1 duration-300 shadow-md">
                    {service.id === 'web-dev' && <Code className="w-6 h-6" />}
                    {service.id === 'app-dev' && <Layers className="w-6 h-6" />}
                    {service.id === 'identity-design' && <Crown className="w-6 h-6" />}
                    {service.id === '8k-graphics' && <Sparkles className="w-6 h-6" />}
                    {service.id === 'automations' && <FileSpreadsheet className="w-6 h-6" />}
                    {service.id === 'telegram-bots' && <MessageCircle className="w-6 h-6" />}
                  </div>

                  <h3 className="font-display font-bold text-lg text-matte-black mb-2 flex items-center gap-1.5 group-hover:text-[#85641C] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#85641C] mb-4 font-bold">
                    Pain Solved: {service.painPoint.split('.')[0]}.
                  </p>
                  <p className="text-xs text-warm-grey leading-relaxed mb-6">
                    {service.solutionCopy.slice(0, 140)}...
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/service-request?service=${service.id}`);
                  }}
                  className="w-full py-3.5 bg-white border border-[#D6B46A]/40 text-[#111111] hover:bg-[#111111] hover:text-[#FFFDF8] group-hover:border-[#D6B46A] group-hover:bg-[#111111] group-hover:text-[#FFFDF8] font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <span>Launch Live Sandbox & Request</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6B46A] group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('services')}
              className="px-8 py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold text-xs font-bold uppercase tracking-widest rounded-full border border-champagne-gold/30 transition-all flex items-center gap-2 group cursor-pointer shadow-md"
            >
              View Full Capability Stack
              <Layers className="w-4 h-4 text-champagne-gold" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- SAMAXON EDGE SECTION (Demo-First Model) --- */}
      <section className="py-24 bg-pearl-white relative overflow-hidden" id="edge-section">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-champagne-gold/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Presentation side */}
          <div className="lg:col-span-12 lg:grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Copy portion */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
                See the Work Before You Trust the Words
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-matte-black leading-tight">
                The SamaXon Edge: Demo-First.
              </h2>
              <p className="text-sm text-warm-grey leading-relaxed">
                Most traditional digital agencies start with billing, complex contracts, and pitch slides. SamaXon starts with execution. We examine your enterprise, craft a premium conceptual visual layout direction, and show you exactly what we can build before requesting major commitments.
              </p>

              <div className="flex flex-col gap-4 w-full">
                {[
                  { title: "Demo-First Approach", desc: "No blind invoices. We render key design screens before invoicing.", mode: 'hotel' as const },
                  { title: "Senior Engineering Wing", desc: "Crafted directly by high-end frontend architects, not junior freelancers.", mode: 'corporate' as const },
                  { title: "48-Hour Execution Culture", desc: "Optimized pipelines allow custom premium websites to ship in 48 hours.", mode: 'retail' as const }
                ].map((item, idx) => (
                  <motion.button 
                    key={idx}
                    type="button"
                    onClick={() => setDemoDirection(item.mode)}
                    whileHover={{ scale: 1.02, x: 6 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                      demoDirection === item.mode
                        ? 'bg-white border-[#D6B46A] shadow-[0_8px_25px_rgba(214,180,106,0.2)] ring-1 ring-[#D6B46A]'
                        : 'bg-white/50 border-champagne-gold/15 hover:border-champagne-gold/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-matte-black flex items-center justify-center shrink-0 border border-champagne-gold/20">
                      <Trophy className="w-4.5 h-4.5 text-champagne-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-xs text-matte-black uppercase tracking-wider">{item.title}</h3>
                        {demoDirection === item.mode && (
                          <span className="text-[9px] font-mono text-[#85641C] font-bold bg-[#D6B46A]/20 px-2 py-0.5 rounded-full">
                            Active Preview
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-warm-grey mt-0.5">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('edge')}
                className="mt-4 px-8 py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-full border border-champagne-gold/25 flex items-center gap-2 group cursor-pointer hover:bg-charcoal shadow-md"
              >
                Request a Demo Direction
                <ArrowRight className="w-4 h-4 text-champagne-gold group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Interactive Demo-First Prototype Direction Widget with 3D feel */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0 flex justify-center">
              <motion.div 
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(214, 180, 106, 0.25)" }}
                className="w-full max-w-[420px] bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#D6B46A]/30 shadow-2xl relative text-left"
              >
                <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                    <span className="font-display font-bold text-xs text-[#111111] uppercase tracking-wider">PROTOTYPE DIRECTION</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5DBCF]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D6B46A] animate-pulse" />
                  </div>
                </div>

                {/* Industry Selector Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F1E8] rounded-xl mb-4 text-center">
                  {(['hotel', 'corporate', 'retail'] as const).map((mode) => (
                    <motion.button
                      key={mode}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setDemoDirection(mode)}
                      className={`py-2 text-[10px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                        demoDirection === mode 
                          ? 'bg-[#111111] text-[#FFFDF8] shadow-md ring-1 ring-[#D6B46A]/50' 
                          : 'text-[#6A6359] hover:text-[#111111]'
                      }`}
                    >
                      {mode === 'hotel' ? 'Hospitality' : mode === 'corporate' ? 'Corporate' : 'Boutique'}
                    </motion.button>
                  ))}
                </div>

                {/* Live Staged Direction Container */}
                <div className="space-y-3">
                  <motion.div 
                    key={demoDirection}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="p-4 rounded-2xl bg-[#0E0D0B] text-[#FFFDF8] border border-[#D6B46A]/40 relative overflow-hidden shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-wider font-bold">
                        Direction Mode: {demoDirection.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-bold">
                        Interactive Spec
                      </span>
                    </div>

                    <div className="text-sm font-display font-bold text-[#FFFDF8] mb-1">
                      {demoDirection === 'hotel' && 'Royal Grandeur Suite & Banquet Engine'}
                      {demoDirection === 'corporate' && 'High-Velocity SaaS & Enterprise Portal'}
                      {demoDirection === 'retail' && 'Haute Couture Monogram Commerce'}
                    </div>

                    <p className="text-xs text-[#A89F91] leading-relaxed">
                      {demoDirection === 'hotel' && 'Direct room & wedding inquiries with instant WhatsApp alerts and custom high-resolution suites showcase.'}
                      {demoDirection === 'corporate' && 'Zero-friction booking links, automated client onboarding forms, and high-conversion B2B authority copy.'}
                      {demoDirection === 'retail' && 'Ultra-fast luxury product catalogs, 300 DPI graphics, and frictionless concierge checkout.'}
                    </p>
                  </motion.div>

                  <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#D6B46A]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-[#6A6359] block uppercase tracking-wider font-bold">
                        Prototype Staging Commitment
                      </span>
                      <span className="text-xs font-bold text-[#111111] uppercase mt-0.5 block font-mono">
                        Working Link in 24 Hours
                      </span>
                    </div>
                    <span className="text-[#D6B46A] font-mono text-[11px] font-black bg-[#D6B46A]/15 px-2.5 py-1 rounded-lg">
                      100% Free Spec
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/select-direction')}
                    className="w-full py-3 bg-[#111111] hover:bg-[#D6B46A] hover:text-[#111111] text-[#FFFDF8] text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Inspect All Direction Demos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CLIENT CONTROL PREVIEW SECTION --- */}
      <section className="py-24 bg-matte-black text-soft-ivory relative overflow-hidden" id="control-section">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-champagne-gold/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Dashboard Concept Mock Illustration */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <motion.div 
              whileHover={{ boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(214,180,106,0.15)" }}
              className="w-full max-w-[420px] bg-[#0E0D0B] border border-[#D6B46A]/30 p-6 sm:p-7 rounded-[32px] shadow-3xl text-[#E5DBCF]"
            >
              <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-[#D6B46A]" />
                  <div>
                    <p className="font-display font-bold text-xs tracking-wider text-[#FFFDF8] uppercase">Digital Remote Control</p>
                    <p className="text-[8px] font-mono uppercase text-[#A89F91]">Live Interactive Client Cockpit</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Interactive Control Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.05] rounded-xl mb-4 text-center">
                {(['content', 'leads', 'analytics'] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setActiveControlTab(tab)}
                    className={`py-2 text-[10px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                      activeControlTab === tab 
                        ? 'bg-[#D6B46A] text-black shadow-md' 
                        : 'text-[#A89F91] hover:text-[#FFFDF8]'
                    }`}
                  >
                    {tab === 'content' ? 'Content' : tab === 'leads' ? 'Leads (Real-time)' : 'Health'}
                  </motion.button>
                ))}
              </div>

              {/* Dynamic Viewport for Active Tab */}
              <div className="space-y-3 mb-5">
                {activeControlTab === 'content' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-[#D6B46A]/20 space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                      <span className="text-[#A89F91]">Active Headline</span>
                      <span className="text-emerald-400 font-bold">Saved Live ✓</span>
                    </div>
                    <div className="text-xs font-semibold text-[#FFFDF8] bg-black/40 p-2.5 rounded-lg border border-white/10">
                      {testHeadlineIndex === 0 && '"Delivering Ultra-Fast Luxury In 48 Hours"'}
                      {testHeadlineIndex === 1 && '"Precision Engineering For Modern Enterprises"'}
                      {testHeadlineIndex === 2 && '"High-Performance Digital Architecture Ready Now"'}
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setTestHeadlineIndex((prev) => (prev + 1) % 3)}
                      className="w-full py-1.5 bg-[#D6B46A]/20 hover:bg-[#D6B46A]/30 text-[#D6B46A] border border-[#D6B46A]/30 rounded-lg text-[9px] font-mono uppercase font-bold cursor-pointer transition-colors"
                    >
                      ✏️ Click to Test Edit Slogan
                    </motion.button>
                  </motion.div>
                )}

                {activeControlTab === 'leads' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-[#D6B46A]/20 space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                      <span className="text-[#A89F91]">Recent Verified Lead</span>
                      <span className="text-[#D6B46A] font-bold">Just Now</span>
                    </div>
                    <div className="text-xs font-semibold text-[#FFFDF8] bg-black/40 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                      <span>{testLeadAdded ? "Rohan V. • Villa Booking Inq." : "Aditya S. • Banquet Booking"}</span>
                      <span className="text-[9px] text-emerald-400 font-mono">WhatsApp Pushed</span>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setTestLeadAdded(!testLeadAdded)}
                      className="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[9px] font-mono uppercase font-bold cursor-pointer transition-colors"
                    >
                      📩 Simulate Incoming Lead Alert
                    </motion.button>
                  </motion.div>
                )}

                {activeControlTab === 'analytics' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-[#D6B46A]/20 space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                      <span className="text-[#A89F91]">Core Web Vital Speed</span>
                      <span className="text-emerald-400 font-bold">Grade A+</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-black/40 p-2 rounded border border-white/10">
                        <div className="text-[#A89F91] text-[9px]">FCP Response</div>
                        <div className="text-[#D6B46A] font-bold mt-0.5">0.38s</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded border border-white/10">
                        <div className="text-[#A89F91] text-[9px]">Uptime SLA</div>
                        <div className="text-emerald-400 font-bold mt-0.5">99.98%</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-3 bg-[#D6B46A]/10 border border-[#D6B46A]/20 rounded-xl text-center">
                <p className="text-[10px] font-mono text-[#D6B46A] uppercase tracking-wider font-bold">
                  Zero Technical Knowledge Required · Custom Video Guide Included
                </p>
              </div>
            </motion.div>
          </div>

          {/* Copy description & 3D Interactive Feature Buttons */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start gap-6 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Every Serious Business Needs a Digital Remote Control.
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-soft-ivory leading-tight">
              Website with an Architectural Control Layer.
            </h2>
            <p className="text-sm text-warm-grey leading-relaxed">
              A visually stunning front-end portal is only half the battle. Every SamaXon build has its structure prepared for our exclusive Client Control system. Update marketing slogans, list pricing metrics, alter images, and track inquiries safely without having to call developers. 
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                { title: "Manage Content", desc: "Edit service texts, gallery banners, and visual assets without developer assistance.", tab: 'content' as const },
                { title: "Consolidate Leads", desc: "Centralize inquiry submissions into one secure workspace cataloged automatically.", tab: 'leads' as const },
                { title: "Track Growth Metrics", desc: "Keep a future-ready analytics backbone configured right from launch day.", tab: 'analytics' as const },
                { title: "Bookings-Configured", desc: "Prepared systems to enable booking and consultation slots dynamically later.", tab: 'leads' as const }
              ].map((card, idx) => (
                <motion.button 
                  key={idx}
                  type="button"
                  onClick={() => setActiveControlTab(card.tab)}
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-2xl flex flex-col gap-1.5 text-left cursor-pointer border transition-all ${
                    activeControlTab === card.tab 
                      ? 'bg-[#181612] border-[#D6B46A] ring-1 ring-[#D6B46A]/60 shadow-[0_0_20px_rgba(214,180,106,0.18)]' 
                      : 'bg-charcoal/40 border-champagne-gold/15 hover:border-champagne-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-display font-bold text-xs text-soft-ivory uppercase tracking-wider">{card.title}</h3>
                    {activeControlTab === card.tab && (
                      <span className="w-2 h-2 rounded-full bg-[#D6B46A] animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-warm-grey leading-normal">{card.desc}</p>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('control')}
              className="px-8 py-4 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-widest text-xs rounded-full flex items-center gap-1.5 cursor-pointer transition-colors mt-2 shadow-md"
            >
              Build My Digital Control System
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- 48-HOUR PROCESS SECTION --- */}
      <section className="py-24 bg-soft-ivory" id="process-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">
              Execution Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-matte-black">
              Idea to Digital Presence in 48 Hours.
            </h2>
            <p className="text-sm text-warm-grey max-w-2xl leading-relaxed">
              Speed is not lucky. True speed comes from strict pipeline mechanics, optimized component frames, senior developers, and structured client interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Decode", desc: "We immediately explore your business layout, targets, offerings, pain points, and core deadlines." },
              { num: "02", title: "Design", desc: "Our Design Studio creates the custom premium layout, color grids, and brand aesthetics." },
              { num: "03", title: "Develop", desc: "Our Senior Developer Wing writes response-ready responsive code, applying fast-loading principles." },
              { num: "04", title: "Deliver", desc: "Your asset is securely deployed, live, and fully ready to capture qualified inquiries." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                onClick={() => setActiveProcessStep(idx)}
                whileHover={{ 
                  scale: 1.04, 
                  y: -6,
                  borderColor: 'rgba(214, 180, 106, 0.7)',
                  boxShadow: "0 20px 40px -10px rgba(214, 180, 106, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-72 cursor-pointer transition-all duration-300 border ${
                  activeProcessStep === idx
                    ? 'bg-white border-[#D6B46A] ring-2 ring-[#D6B46A]/50 shadow-xl'
                    : 'bg-white/70 backdrop-blur-sm border-champagne-gold/25 hover:border-champagne-gold/60 shadow-sm'
                }`}
              >
                <div className="absolute top-2 right-4 font-display font-black text-6xl text-[#D6B46A]/25 group-hover:text-[#D6B46A]/50 transition-colors duration-300 select-none">
                  {step.num}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase text-[#85641C] font-bold tracking-widest block">
                      Step {step.num}
                    </span>
                    {activeProcessStep === idx && (
                      <span className="text-[9px] font-mono uppercase text-emerald-600 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-matte-black mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs text-warm-grey leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className={`h-1.5 rounded transition-all duration-300 ${
                  activeProcessStep === idx 
                    ? 'w-full bg-gradient-to-r from-champagne-gold to-[#85641C]' 
                    : 'w-1/3 bg-gradient-to-r from-champagne-gold to-muted-gold group-hover:w-full'
                }`} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xs font-mono text-warm-grey italic">
              Speed matters. But premium speed matters far more. SamaXon is built for founders who want both.
            </p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS & FOUNDER TRUST NOTES --- */}
      <section className="py-24 bg-soft-ivory border-t border-champagne-gold/15" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
              Founder Trust Notes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-matte-black">
              Direct Experience Reports
            </h2>
            <p className="text-sm text-warm-grey max-w-xl">
              Understand why ambitious business leaders in India trust SamaXon to execute their digital launches with extreme speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02,
                  borderColor: 'rgba(214, 180, 106, 0.6)',
                  boxShadow: '0 20px 40px -10px rgba(214, 180, 106, 0.18)'
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/65 backdrop-blur-xs border border-champagne-gold/20 p-8 rounded-3xl relative flex flex-col justify-between h-full gold-shadow-sm transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-champagne-gold fill-champagne-gold" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal italic leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-champagne-gold/15 pt-4">
                  <div className="w-9 h-9 rounded-full bg-matte-black flex items-center justify-center text-soft-ivory border border-champagne-gold/20 font-display font-medium text-xs">
                    {testimonial.author.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-display text-xs font-bold text-matte-black uppercase tracking-wide">
                      {testimonial.author}
                    </span>
                    <span className="text-[9px] font-mono text-warm-grey uppercase tracking-widest">
                      {testimonial.role} · <strong className="text-champagne-gold font-normal">{testimonial.company}</strong>
                    </span>
                  </div>
                </div>

                {testimonial.founderNote && (
                  <span className="absolute top-4 right-4 bg-champagne-gold/10 border border-champagne-gold/25 text-[#85641C] text-[7px] font-mono uppercase tracking-widest px-2.5 py-1 rounded font-bold">
                    Selected Case
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION FOR AEO & VOICE SEARCH --- */}
      <section className="py-24 bg-[#FFFDF8] border-t border-champagne-gold/15" id="home-faq-section">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">
              Direct Clarity · Answer Engine Optimised
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-matte-black uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-warm-grey max-w-2xl leading-relaxed font-sans">
              Get direct, transparent answers to our delivery cycles, client controls, and our Demo-First methodology. Fully structured for human and voice search crawlers.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-[#D6B46A]/20 rounded-[20px] p-5 sm:p-6 shadow-sm hover:border-[#D6B46A] transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left font-display font-bold text-xs sm:text-sm text-neutral-900 uppercase tracking-wide cursor-pointer focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#85641C] w-6 h-6 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/35 flex items-center justify-center shrink-0 ml-4">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isOpen ? 'auto' : 0, 
                      opacity: isOpen ? 1 : 0,
                      marginTop: isOpen ? 12 : 0
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs sm:text-sm text-warm-grey leading-relaxed pl-4 border-l-2 border-[#D6B46A]/25 font-sans pt-1">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- HOMEPAGE WEBSITE ANALYZER & MULTI-PAGE SCANNER SHOWCASE --- */}
      <section className="py-20 bg-gradient-to-b from-[#FFFDF8] via-[#FBF7EE] to-[#FFFDF8] border-t border-champagne-gold/20 relative overflow-hidden" id="home-website-analyzer-section">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-[#111111] text-[#FFFDF8] rounded-3xl sm:rounded-[36px] p-8 sm:p-12 lg:p-14 border border-[#D6B46A]/30 shadow-2xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D6B46A]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D6B46A]/15 border border-[#D6B46A]/35 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D6B46A]">
                    Free Multi-Page Crawler &amp; Security Auditor
                  </span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-[40px] text-white tracking-tight leading-tight">
                  Is Your Website Leaking Clients, SEO Rank &amp; Speed?
                </h2>

                <p className="text-xs sm:text-sm text-[#D8D2C6] leading-relaxed max-w-xl">
                  Run a real-time deep audit across every page of your site. Inspect SSL security headers, subpage response times, broken image alt tags, missing meta descriptions, layout jank, and 1,000+ high-intent search keywords.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Full Subpage Crawler',
                    'SSL & HSTS Security',
                    'Core Web Vitals & TTFB',
                    'Page-by-Page Error Detection',
                    '100% Free · No Login'
                  ].map((feat, fIdx) => (
                    <span 
                      key={fIdx}
                      className="px-3 py-1 bg-white/5 border border-[#D6B46A]/20 rounded-lg text-[11px] font-mono text-[#D6B46A]"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Interactive Instant Scan Form */}
                <form onSubmit={handleHomeAnalyze} className="pt-3 max-w-xl">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8A8178]">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={homeAnalyzerInput}
                        onChange={(e) => setHomeAnalyzerInput(e.target.value)}
                        placeholder="e.g. yourbusiness.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-black/60 border border-[#D6B46A]/40 focus:border-[#D6B46A] rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-[#8A8178] focus:outline-none focus:ring-1 focus:ring-[#D6B46A] transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-[#D6B46A] hover:bg-[#E5C77F] text-[#111111] font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
                    >
                      <span>Analyze Website</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8178] mt-2 block">
                    Zero installations required · Audits HTTP status, SSL, DOM, Core Web Vitals, and internal subpages.
                  </span>
                </form>
              </div>

              {/* Right Diagnostic Visual Preview */}
              <div className="lg:col-span-5 relative">
                <div className="bg-[#181715] border border-[#D6B46A]/25 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-[#D6B46A] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Live Diagnostic Engine
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Ready to scan
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-[#8A8178]">Multi-Page Discovery</span>
                      <span className="text-emerald-400 font-bold">Every Internal Page</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-[#8A8178]">Security Protocols</span>
                      <span className="text-emerald-400 font-bold">SSL / HSTS / CSP / X-Frame</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-[#8A8178]">Speed &amp; Latency</span>
                      <span className="text-amber-400 font-bold">TTFB &amp; Core Web Vitals</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-[#8A8178]">SEO Keyword Index</span>
                      <span className="text-[#D6B46A] font-bold">1,000+ Search Terms</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/analyzer')}
                    className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-bold border border-white/10"
                  >
                    <span>Open Full Analyzer Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE SYSTEM & WEBSITE UPDATES SECTION --- */}
      <LiveUpdateSection />

      {/* --- FINAL CONVERSION CTA --- */}
      <section className="py-24 bg-matte-black text-soft-ivory relative overflow-hidden" id="final-cta-section">
        {/* Deep ambient circular background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-champagne-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 relative z-10">
          <div className="w-12 h-12 rounded-full bg-charcoal border border-champagne-gold/40 flex items-center justify-center mb-2 animate-bounce">
            <Zap className="w-6 h-6 text-champagne-gold fill-champagne-gold/15" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-soft-ivory max-w-3xl leading-tight">
            Your Business Deserves an Online Presence That Matches Your Ambition.
          </h2>

          <p className="text-sm sm:text-base text-warm-grey max-w-2xl leading-relaxed">
            Your product and services are exceptional. Your digital presence should reflect that caliber. SamaXon unifies world-class design, rapid engineering, and scalable business systems into one premier studio.
          </p>

          <div className="h-px w-24 bg-champagne-gold/30 my-2" />

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleAction('contact')}
              id="cta-bottom-start"
              className="w-full sm:w-auto px-9 py-4.5 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-[0.12em] text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_6px_20px_rgba(214,180,106,0.35)] hover:shadow-[0_10px_28px_rgba(214,180,106,0.48)]"
            >
              Start Your 48-Hour Build
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleAction('about')}
              id="cta-bottom-talk"
              className="w-full sm:w-auto px-9 py-4.5 bg-transparent border border-champagne-gold/35 hover:border-champagne-gold text-soft-ivory hover:text-champagne-gold font-bold uppercase tracking-[0.12em] text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5"
            >
              Who is SamaXon?
            </motion.button>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-warm-grey uppercase mt-4">
            NO RANDOM TRYS · NO ENDLESS BACK-AND-FORTH · PREMIUM DIRECT LAUNCH
          </div>
        </div>
      </section>
    </div>
  );
}
