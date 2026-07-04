import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Star, Layers, Code, Sparkles, MessageCircle, ArrowUpRight, PlayCircle, Trophy, BarChart3, Database, ShieldCheck, Mail, Users, FileSpreadsheet, Crown, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { SERVICES_DATA, PORTFOLIO_DATA, TESTIMONIALS_DATA } from '../data';
import { PAGE_TO_ROUTE } from '../utils/navigation';

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
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 14 } }
      }}
      whileHover={{ 
        y: -4, 
        borderColor: 'rgba(214, 180, 106, 0.45)', 
        backgroundColor: 'rgba(20, 20, 20, 0.6)',
        boxShadow: "0 15px 35px -10px rgba(214, 180, 106, 0.18)"
      }}
      className={`group p-6 md:p-8 rounded-[1.5rem] bg-[#111111]/45 backdrop-blur-md border border-white/5 flex flex-col justify-center items-center transition-all duration-300 select-none cursor-default ${colSpan}`}
    >
      <span className="block text-3xl md:text-4xl font-display font-black text-champagne-gold tracking-tight mb-1">
        <AnimatedCounter value={value} />
      </span>
      <span className="block text-[9px] uppercase tracking-widest text-[#A89F91] font-bold font-mono group-hover:text-white transition-colors duration-300">
        {label}
      </span>
    </motion.div>
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

      {/* iOS Gyroscope Activation Banner */}
      {permissionState === 'prompt' && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center z-20 px-4">
          <button
            onClick={requestPermission}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] text-matte-black text-[10px] font-bold uppercase tracking-widest shadow-lg border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Enable 3D Gyro Motion</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface HomeProps {
  setCurrentPage?: (page: string) => void;
}

export default function Home({ setCurrentPage }: HomeProps) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalProjects: '42+',
    activeClients: '18+',
    teamMembers: '8+',
    industriesServed: '12+',
    yearsExperience: '5+'
  });

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
    "image": "https://samaxon.site/og-image.jpg",
    "@id": "https://samaxon.site/#organization",
    "url": "https://samaxon.site",
    "telephone": "+918000000000",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SamaXon Elite Hub, MG Road",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
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
              className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-[#D6B46A]/20 w-max shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-[#D6B46A] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#BFA15A]">
                India’s Premium 48-Hour Digital Studio
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display text-4xl sm:text-5xl lg:text-[66px] lg:leading-[0.95] font-black tracking-tighter text-[#111111]"
            >
              The Future of <br className="hidden sm:inline" />
              <span className="text-[#D6B46A]">Digital Branding</span>, <br />
              Delivered in 48 Hours.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-[#8A8178] leading-relaxed max-w-[580px]"
            >
              SamaXon builds high-performance websites, mobile apps, premium brand identities, automations, and business control systems for founders who do not have time for slow agencies and average execution.
            </motion.p>

            {/* Light Hinglish Pain-Point text */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-l-2 border-[#D6B46A] pl-4 py-1.5 my-2 bg-[#D6B46A]/5 rounded-r-xl max-w-xl"
            >
              <p className="text-xs font-semibold text-matte-black/95 italic leading-relaxed">
                “Aapka business ready hai, but website, branding aur systems slow hain? SamaXon ka Senior Engineering Team aapke business ko premium digital presence deta hai — fast, polished, and conversion-ready.”
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => handleAction('contact')}
                id="hero-primary-cta"
                className="w-full sm:w-auto px-8 py-5 bg-[#111111] text-white hover:text-[#D6B46A] hover:bg-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-[#D6B46A]/20 shadow-2xl flex items-center justify-center gap-2 cursor-pointer duration-300 transform active:scale-95 transition-all"
              >
                Start Your 48-Hour Build
                <ArrowRight className="w-4 h-4 text-[#D6B46A]" />
              </button>
              <button
                onClick={() => handleAction('services')}
                id="hero-secondary-cta"
                className="w-full sm:w-auto px-8 py-5 bg-white/45 border border-[#D6B46A]/40 text-[#111111] hover:bg-[#D6B46A]/5 font-bold text-xs uppercase tracking-widest rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer duration-300 transform active:scale-95 transition-all"
              >
                Explore Capabilities
              </button>
            </motion.div>

            {/* Brand Trust tags */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-2 mt-4"
            >
              {['Senior Developer Wing', 'Design Studio', 'Demo-First Model', 'Admin Dashboard Ready', '48-Hour Delivery'].map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-3.5 py-1.5 bg-soft-ivory/50 border border-champagne-gold/15 text-matte-black font-semibold uppercase tracking-wider text-[9px] rounded-full gold-shadow-sm font-mono flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-champagne-gold" />
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero Decorative Elements (Interactive Soft UI Interface) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-square rounded-[40px] bg-gradient-to-br from-champagne-gold/10 to-transparent p-1 border border-champagne-gold/15 gold-shadow animate-floating">
              
              {/* Main Interactive Floater Card: Client Control dashboard mock */}
              <div className="absolute inset-4 rounded-[36px] bg-soft-ivory border border-champagne-gold/20 p-6 flex flex-col justify-between">
                
                {/* Floating Card Top */}
                <div className="flex items-center justify-between border-b border-champagne-gold/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-matte-black flex items-center justify-center border border-champagne-gold/30">
                      <Zap className="w-4 h-4 text-champagne-gold fill-champagne-gold/15" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xs tracking-wider uppercase text-matte-black">SamaXon Client ID</div>
                      <div className="text-[8px] font-mono uppercase text-champagne-gold tracking-widest mt-0.5">Live Build #4592</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-mono text-[8px] uppercase tracking-wider rounded">
                    Active 48h
                  </span>
                </div>

                {/* Simulated charts/metrics representing Digital Remote Control */}
                <div className="flex flex-col gap-4 py-4">
                  <div className="p-3 bg-white/60 rounded-xl border border-champagne-gold/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-champagne-gold" />
                      <div>
                        <div className="text-[9px] font-mono uppercase text-warm-grey tracking-wider">Business Growth</div>
                        <div className="font-display font-medium text-xs text-matte-black mt-0.5">Leads Captured +142%</div>
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-champagne-gold/10 border border-champagne-gold/20 rounded flex items-center justify-center">
                      <span className="text-[7px] font-mono text-champagne-gold uppercase tracking-wider font-bold">SEO Page 1</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/60 rounded-xl border border-champagne-gold/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-warm-grey" />
                      <div>
                        <div className="text-[9px] font-mono uppercase text-warm-grey tracking-wider">Control Layer</div>
                        <div className="font-display font-medium text-xs text-matte-black mt-0.5">Admin Dashboard Ready</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-champagne-gold animate-ping" />
                  </div>
                </div>

                {/* Action Indicator */}
                <button 
                  onClick={() => handleAction('control')}
                  className="w-full py-3 bg-matte-black text-soft-ivory hover:text-champagne-gold text-[10px] font-bold uppercase tracking-widest rounded-xl border border-champagne-gold/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Client Control Activated
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Backside Floating Badge: Automation bubble */}
              <div className="absolute -top-6 -left-6 z-10 glass-panel max-w-[170px] rounded-2xl p-3.5 gold-shadow-sm flex items-center gap-3 animate-floating-delayed">
                <div className="w-8 h-8 rounded-full bg-matte-black flex items-center justify-center">
                  <Target className="w-4 h-4 text-champagne-gold" />
                </div>
                <div>
                  <div className="text-[8px] font-mono uppercase text-warm-grey font-bold tracking-wider">Auto Integration</div>
                  <div className="text-[10px] font-bold text-matte-black tracking-tight">Telegram Alerts Active</div>
                </div>
              </div>

              {/* Bottom Right Floor Floater */}
              <div className="absolute -bottom-4 -right-4 z-10 bg-soft-ivory border border-champagne-gold/20 max-w-[180px] rounded-2xl p-4 shadow-xl flex flex-col gap-1.5 animate-floating-reverse">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-champagne-gold fill-champagne-gold" />
                  ))}
                </div>
                <p className="text-[9px] text-warm-grey leading-tight italic font-medium">
                  "Website live in 48 hours is absolute perfection."
                </p>
                <div className="text-[8px] font-mono uppercase text-matte-black font-bold tracking-wider mt-1">
                  — RAJESH M., MALHOTRA ESTATES
                </div>
              </div>

            </div>
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
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
              <div 
                key={service.id}
                className="bg-white/55 border border-champagne-gold/15 p-8 rounded-3xl hover:border-champagne-gold duration-300 transition-all gold-shadow-sm flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-matte-black text-champagne-gold flex items-center justify-center border border-champagne-gold/20 mb-6 group-hover:scale-105 duration-300">
                    {service.id === 'web-dev' && <Code className="w-6 h-6" />}
                    {service.id === 'app-dev' && <Layers className="w-6 h-6" />}
                    {service.id === 'identity-design' && <Crown className="w-6 h-6" />}
                    {service.id === '8k-graphics' && <Sparkles className="w-6 h-6" />}
                    {service.id === 'automations' && <FileSpreadsheet className="w-6 h-6" />}
                    {service.id === 'telegram-bots' && <MessageCircle className="w-6 h-6" />}
                  </div>

                  <h3 className="font-display font-bold text-lg text-matte-black mb-2 flex items-center gap-1.5">
                    {service.title}
                  </h3>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#BFA15A] mb-4">
                    Pain Solved: {service.painPoint.split('.')[0]}.
                  </p>
                  <p className="text-xs text-warm-grey leading-relaxed mb-6">
                    {service.solutionCopy.slice(0, 140)}...
                  </p>
                </div>

                <button
                  onClick={() => handleAction('services')}
                  className="w-full py-3 bg-white border border-champagne-gold/20 text-matte-black hover:bg-matte-black hover:text-soft-ivory group-hover:border-champagne-gold font-bold uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Explore Service
                  <ArrowRight className="w-3.5 h-3.5 text-champagne-gold" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => handleAction('services')}
              className="px-8 py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold text-xs font-bold uppercase tracking-widest rounded-full border border-champagne-gold/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              View Full Capability Stack
              <Layers className="w-4 h-4 text-champagne-gold" />
            </button>
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
                  { title: "Demo-First Approach", desc: "No blind invoices. We render key design screens before invoicing." },
                  { title: "Senior Engineering Wing", desc: "Crafted directly by high-end frontend architects, not junior freelancers." },
                  { title: "48-Hour Execution Culture", desc: "Optimized pipelines allow custom premium websites to ship in 48 hours." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/40 border border-champagne-gold/10 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-matte-black flex items-center justify-center shrink-0 border border-champagne-gold/20">
                      <Trophy className="w-4.5 h-4.5 text-champagne-gold" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-matte-black uppercase tracking-wider">{item.title}</h4>
                      <p className="text-xs text-warm-grey mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleAction('edge')}
                className="mt-4 px-8 py-4 bg-matte-black text-soft-ivory hover:text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-full border border-champagne-gold/25 flex items-center gap-2 group cursor-pointer hover:bg-charcoal"
              >
                Request a Demo Direction
                <ArrowRight className="w-4 h-4 text-champagne-gold group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Simulated premium interface widget */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0 flex justify-center">
              <div className="w-full max-w-[380px] bg-white rounded-3xl p-6 border border-champagne-gold/20 shadow-2xl relative">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <span className="font-display font-medium text-xs text-matte-black">PROTOTYPE DIRECTION</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5DBCF]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-champagne-gold animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-mono text-warm-grey uppercase tracking-widest">
                    Pre-Build Rendering
                  </p>
                  
                  {/* Mock wireframe container representing design precision */}
                  <div className="h-32 bg-pearl-white/80 rounded-2xl border border-champagne-gold/10 flex flex-col justify-center items-center p-4">
                    <Sparkles className="w-8 h-8 text-champagne-gold animate-pulse" />
                    <span className="text-[10px] font-mono uppercase text-matte-black tracking-widest font-bold mt-2">
                      SamaXon Design Studio
                    </span>
                    <span className="text-[8px] text-warm-grey uppercase mt-0.5">
                      Visual Direction Ready
                    </span>
                  </div>

                  <div className="p-3 bg-white/85 rounded-xl border border-champagne-gold/10">
                    <span className="text-[8px] font-mono text-warm-grey block uppercase tracking-wider">
                      Proposed Delivery Timeline
                    </span>
                    <span className="text-xs font-semibold text-matte-black uppercase flex items-center justify-between mt-1">
                      <span>48-Hour Live Deployment</span>
                      <span className="text-champagne-gold font-mono text-[10px] font-bold">100% Guaranteed</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CLIENT CONTROL PREVIEW SECTION --- */}
      <section className="py-24 bg-matte-black text-soft-ivory relative overflow-hidden" id="client-control-section">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-champagne-gold/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Dashboard Concept Mock Illustration */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="w-full max-w-[380px] bg-charcoal/80 border border-champagne-gold/15 p-6 rounded-3xl shadow-3xl text-[#E5DBCF]">
              <div className="flex items-center gap-3 border-b border-champagne-gold/15 pb-4 mb-5">
                <BarChart3 className="w-5 h-5 text-champagne-gold" />
                <div>
                  <h4 className="font-display font-medium text-xs tracking-wider text-soft-ivory uppercase">Digital Remote Control</h4>
                  <p className="text-[7px] font-mono uppercase text-warm-grey">Future Admin Control Concept</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-charcoal rounded-xl border border-champagne-gold/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-soft-ivory">Manage Content</span>
                  <span className="text-[9px] text-champagne-gold font-mono uppercase">Instant Edit</span>
                </div>
                <div className="p-3 bg-charcoal rounded-xl border border-champagne-gold/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-soft-ivory">Manage Leads</span>
                  <span className="text-[9px] text-emerald-500 font-mono uppercase">Active (2 New)</span>
                </div>
                <div className="p-3 bg-charcoal rounded-xl border border-champagne-gold/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-soft-ivory">Manage Bookings</span>
                  <span className="text-[9px] text-[#A69C91] font-mono uppercase">Unlocks on Request</span>
                </div>
              </div>

              <div className="mt-5 p-3.5 bg-champagne-gold/10 border border-champagne-gold/20 rounded-xl text-center">
                <p className="text-[9px] font-mono text-[#D6B46A] uppercase tracking-wider">
                  No DB coding required for basic updates
                </p>
              </div>
            </div>
          </div>

          {/* Copy description */}
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
                { title: "Manage Content", desc: "Edit service texts, gallery banners, and visual assets without developer assistance." },
                { title: "Consolidate Leads", desc: "Centralize inquiry submissions into one secure workspace cataloged automatically." },
                { title: "Track Growth Metrics", desc: "Keep a future-ready analytics backbone configured right from launch day." },
                { title: "Bookings-Configured", desc: "Prepared systems to enable booking and consultation slots dynamically later." }
              ].map((card, idx) => (
                <div key={idx} className="p-4 bg-charcoal/40 border border-champagne-gold/10 rounded-2xl flex flex-col gap-1.5">
                  <h4 className="font-display font-bold text-xs text-soft-ivory uppercase tracking-wider">{card.title}</h4>
                  <p className="text-xs text-warm-grey leading-normal">{card.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAction('control')}
              className="px-8 py-4 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-widest text-xs rounded-full flex items-center gap-1.5 cursor-pointer transition-colors mt-2"
            >
              Build My Digital Control System
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- 48-HOUR PROCESS SECTION --- */}
      <section className="py-24 bg-soft-ivory" id="process-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
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
              <div 
                key={idx}
                className="bg-white/40 border border-champagne-gold/15 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-72 group hover:border-champagne-gold duration-300"
              >
                <div className="absolute top-2 right-4 font-display font-bold text-6xl text-champagne-gold/10 group-hover:text-champagne-gold/15 duration-200">
                  {step.num}
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#BFA15A] font-bold tracking-widest block mb-4">
                    Step {step.num}
                  </span>
                  <h4 className="font-display font-bold text-lg text-matte-black mb-3">
                    {step.title}
                  </h4>
                  <p className="text-xs text-warm-grey leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-champagne-gold to-muted-gold rounded w-1/3 group-hover:w-full duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xs font-mono text-warm-grey italic">
              Speed matters. But premium speed matters far more. SamaXon is built for founders who want both.
            </p>
          </div>
        </div>
      </section>

      {/* --- SELECTED WORK PORTFOLIO PREVIEW --- */}
      <section className="py-24 bg-pearl-white" id="portfolio-preview-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="text-left flex flex-col items-start gap-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
                Elite Proof of Work
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-matte-black">
                Engineered to Look Expensive.
              </h2>
              <p className="text-sm text-warm-grey max-w-xl">
                Every SamaXon project is built with one focused milestone: make the business look trustworthy, modern, credible, and conversion-ready.
              </p>
            </div>
            <button
              onClick={() => handleAction('portfolio')}
              className="px-6 py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-full border border-champagne-gold/25 flex items-center justify-center gap-1.5 group cursor-pointer"
            >
              View Selected Work
              <ArrowUpRight className="w-4 h-4 text-champagne-gold group-hover:translate-x-0.5 duration-200" />
            </button>
          </div>

          {/* Quick Portfolio Grid preview: First 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_DATA.filter(p => !!p.thumbnailUrl).slice(0, 3).map((project) => (
              <div 
                key={project.id}
                className="bg-white/60 border border-champagne-gold/15 p-8 rounded-3xl hover:border-champagne-gold transition-all duration-300 gold-shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {project.thumbnailUrl && (
                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 border border-champagne-gold/15 bg-matte-black/5">
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6 border-b border-champagne-gold/10 pb-4">
                    <span className="px-3 py-1 bg-matte-black text-soft-ivory text-[9px] font-mono uppercase tracking-widest rounded-full border border-champagne-gold/20">
                      {project.visualTag}
                    </span>
                    <span className="text-[8px] font-mono text-warm-grey tracking-wider uppercase font-bold mt-1">
                      Live Build
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-matte-black mb-3">
                    {project.title}
                  </h3>
                  <div className="space-y-4 text-xs text-warm-grey leading-relaxed">
                    <p>
                      <strong className="text-matte-black uppercase text-[9px] font-mono tracking-widest block mb-0.5">Problem:</strong>
                      {project.problem.slice(0, 100)}...
                    </p>
                    <p>
                      <strong className="text-[#D6B46A] uppercase text-[9px] font-mono tracking-widest block mb-0.5">SamaXon Action:</strong>
                      {project.solution.slice(0, 100)}...
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-champagne-gold/10">
                  <button
                    onClick={() => handleAction('portfolio')}
                    className="w-full py-3 bg-white hover:bg-matte-black hover:text-soft-ivory border border-champagne-gold/20 font-bold uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-1.5 duration-200 cursor-pointer"
                  >
                    View Project Case Study
                    <ArrowRight className="w-3 h-3 text-champagne-gold" />
                  </button>
                </div>
              </div>
            ))}
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
              <div 
                key={testimonial.id}
                className="bg-white/55 border border-champagne-gold/15 p-8 rounded-3xl relative flex flex-col justify-between h-full gold-shadow-sm"
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

                <div className="flex items-center gap-3 border-t border-champagne-gold/10 pt-4">
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
                  <span className="absolute top-4 right-4 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[7px] font-mono uppercase tracking-widest px-2.5 py-1 rounded">
                    Selected Case
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION FOR AEO & VOICE SEARCH --- */}
      <section className="py-24 bg-[#FFFDF8] border-t border-champagne-gold/15" id="home-faq-section">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
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
                    <span className="text-[#BFA15A] w-6 h-6 rounded-full bg-[#D6B46A]/10 border border-[#D6B46A]/25 flex items-center justify-center shrink-0 ml-4">
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
            Aapka product strong hai. Service strong hai. Ab digital presence bhi strong honi chahiye. SamaXon brings premium design, fast engineering, and business-ready systems together in one elite studio.
          </p>

          <div className="h-px w-24 bg-champagne-gold/30 my-2" />

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button
              onClick={() => handleAction('contact')}
              id="cta-bottom-start"
              className="w-full sm:w-auto px-10 py-5 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer transition-colors gold-shadow"
            >
              Start Your 48-Hour Build
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAction('about')}
              id="cta-bottom-talk"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-champagne-gold/30 hover:border-champagne-gold text-soft-ivory hover:text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Who is SamaXon?
            </button>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-warm-grey uppercase mt-4">
            NO RANDOM TRYS · NO ENDLESS BACK-AND-FORTH · PREMIUM DIRECT LAUNCH
          </div>
        </div>
      </section>
    </div>
  );
}
