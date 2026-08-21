import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Star, Layers, Code, Sparkles, MessageCircle, ArrowUpRight, Trophy, BarChart3, Database, FileSpreadsheet, Crown, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import LiquidButton from '../components/LiquidButton';
import LiquidGlassPanel from '../components/LiquidGlassPanel';
import { SERVICES_DATA, PORTFOLIO_DATA, TESTIMONIALS_DATA } from '../data';
import { PAGE_TO_ROUTE } from '../utils/navigation';
import { useTheme } from '../context/ThemeContext';

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
          const duration = 1800;
          const startTime = performance.now();

          const animate = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
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
    <span ref={elementRef} className="tabular-nums font-black text-[#D6B46A]">
      {prefix}
      {hasAnimated ? count : 0}
      {suffix}
    </span>
  );
}

function StatCard({ value, label, colSpan = "" }: { value: string; label: string; colSpan?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-center items-center select-none cursor-default backdrop-blur-2xl backdrop-saturate-180 relative overflow-hidden ${
        isDark 
          ? 'bg-[#121212]/80 border-white/10 hover:border-[#D6B46A]/40 shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)]' 
          : 'bg-gradient-to-br from-white/80 via-white/50 to-white/70 border-white/85 hover:border-[#D6B46A]/50 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(255,255,255,0.4)]'
      } ${colSpan}`}
    >
      {/* Top Meniscus Reflection */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-3xl bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-80" 
        aria-hidden="true" 
      />
      <span className="block text-3xl md:text-4xl font-display font-bold text-[#D6B46A] tracking-tight mb-1 relative z-10">
        <AnimatedCounter value={value} />
      </span>
      <span className="block text-[10px] uppercase tracking-widest text-[#8E8E93] font-semibold font-mono relative z-10">
        {label}
      </span>
    </motion.div>
  );
}

function InteractiveStatsGrid({ stats }: { stats: any }) {
  return (
    <div className="relative isolate max-w-6xl mx-auto">
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3.5 md:gap-4 p-2 text-center font-sans"
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Interactive 3D tilt for hero floater
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  const handleHeroCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ rotateX, rotateY });
  };

  const handleHeroCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div id="home-page-container" className="transition-colors duration-300">
      <SEO 
        title="Speed-Driven Premium Digital Studio India"
        description="SamaXon builds elite business websites, mobile apps, brand identities, custom automations, and Telegram bots in under 48 hours with a Demo-First model."
        canonicalPath="/"
        schemas={[defaultOrgSchema, faqSchema]}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 md:pt-32 pb-20 md:pb-28 overflow-hidden" id="hero-section">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            {/* Eyebrow badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-2xl ${
                isDark
                  ? 'bg-white/[0.06] border-white/12 text-[#D6B46A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'bg-white/80 border-black/8 text-[#BFA15A] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A]" />
              <span>India’s Premium 48-Hour Digital Studio</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
                isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
              }`}
            >
              The Future of <br className="hidden sm:inline" />
              <span className="text-[#D6B46A]">Digital Branding</span>, <br />
              Delivered in 48 Hours.
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-[560px]"
            >
              SamaXon builds high-performance websites, mobile apps, premium brand identities, automations, and business control systems for founders who do not have time for slow agencies and average execution.
            </motion.p>

            {/* Hinglish Trust Callout */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={`border-l-2 border-[#D6B46A] pl-4 py-2.5 rounded-r-2xl max-w-xl backdrop-blur-md ${
                isDark ? 'bg-white/[0.03] border-t border-b border-r border-white/5' : 'bg-white/60 border-t border-b border-r border-black/5 shadow-sm'
              }`}
            >
              <p className="text-xs sm:text-sm font-medium italic leading-relaxed text-[#8E8E93]">
                “Aapka business ready hai, but website, branding aur systems slow hain? SamaXon ka Senior Engineering Team aapke business ko premium digital presence deta hai — fast, polished, and conversion-ready.”
              </p>
            </motion.div>

            {/* Action Buttons with Liquid Physics Ripple */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto pt-1"
            >
              <LiquidButton
                onClick={() => handleAction('contact')}
                id="hero-primary-cta"
                variant="gold"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Start Your 48-Hour Build
              </LiquidButton>
              <LiquidButton
                onClick={() => handleAction('services')}
                id="hero-secondary-cta"
                variant="glass"
                size="lg"
              >
                Explore Capabilities
              </LiquidButton>
            </motion.div>

            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              {['Senior Developer Wing', 'Design Studio', 'Demo-First Model', 'Admin Dashboard Ready', '48-Hour Delivery'].map((tag, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1 border text-[10px] font-mono uppercase tracking-wider rounded-full font-medium flex items-center gap-1.5 backdrop-blur-md ${
                    isDark 
                      ? 'bg-white/[0.04] border-white/10 text-[#8E8E93]' 
                      : 'bg-white/70 border-black/8 text-[#6E6E73] shadow-xs'
                  }`}
                >
                  <span className="w-1 h-1 rounded-full bg-[#D6B46A]" />
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual Mock with Liquid Glass 3D Depth */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div 
              ref={heroCardRef}
              onMouseMove={handleHeroCardMouseMove}
              onMouseLeave={handleHeroCardMouseLeave}
              className="relative w-full max-w-[420px] transition-transform duration-200 ease-out"
              style={{
                perspective: '1000px',
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
              }}
            >
              {/* Main Liquid Glass Card */}
              <div className={`rounded-3xl border p-6 md:p-7 relative backdrop-blur-3xl backdrop-saturate-200 transition-colors duration-300 overflow-hidden ${
                isDark 
                  ? 'bg-[#121212]/85 border-white/12 text-[#F5F5F7] shadow-[0_24px_60px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.15)]' 
                  : 'bg-gradient-to-br from-white/85 via-white/50 to-white/75 border-white/90 text-[#1D1D1F] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.02),inset_0_1.5px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(255,255,255,0.4)]'
              }`}>
                {/* Convex Meniscus Water Highlight */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-3xl bg-gradient-to-b from-white/60 via-white/15 to-transparent opacity-90" 
                  aria-hidden="true" 
                />

                {/* Specular shimmer overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-tr from-transparent via-white/20 to-transparent" 
                  aria-hidden="true" 
                />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/30 flex items-center justify-center text-[#D6B46A] shadow-sm">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xs tracking-wide uppercase text-[#1D1D1F]">SamaXon Client ID</div>
                      <div className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-wider">Live Build #4592</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-mono text-[9px] uppercase tracking-wider rounded-full font-semibold shadow-xs">
                    Active 48h
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex flex-col gap-3 py-4 relative z-10">
                  <div className="p-3.5 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-[#D6B46A]" />
                      <div>
                        <div className="text-[9px] font-mono uppercase text-[#8E8E93]">Business Growth</div>
                        <div className="font-display font-semibold text-xs mt-0.5 text-[#1D1D1F]">Leads Captured +142%</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-[#D6B46A] font-bold">SEO Page 1</span>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-[#8E8E93]" />
                      <div>
                        <div className="text-[9px] font-mono uppercase text-[#8E8E93]">Control Layer</div>
                        <div className="font-display font-semibold text-xs mt-0.5 text-[#1D1D1F]">Admin Dashboard Ready</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A] animate-pulse" />
                  </div>
                </div>

                {/* Card CTA with LiquidButton */}
                <div className="relative z-10 pt-1">
                  <LiquidButton 
                    onClick={() => handleAction('control')}
                    variant="gold"
                    size="md"
                    className="w-full justify-center"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Client Control Activated
                  </LiquidButton>
                </div>
              </div>

              {/* Floating micro card 1 */}
              <div className="absolute -top-4 -left-4 rounded-2xl p-3 border border-white/85 bg-gradient-to-r from-white/85 to-white/70 shadow-[0_12px_28px_rgba(0,0,0,0.05),inset_0_1px_1.5px_rgba(255,255,255,1)] flex items-center gap-2.5 backdrop-blur-2xl hidden sm:flex text-[#1D1D1F]">
                <div className="w-7 h-7 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/30 flex items-center justify-center text-[#D6B46A]">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[8px] font-mono uppercase text-[#8E8E93]">Auto Integration</div>
                  <div className="text-[10px] font-bold">Telegram Alerts Active</div>
                </div>
              </div>

              {/* Floating micro card 2 */}
              <div className="absolute -bottom-4 -right-4 rounded-2xl p-3.5 border border-white/85 bg-gradient-to-r from-white/85 to-white/70 shadow-[0_12px_28px_rgba(0,0,0,0.05),inset_0_1px_1.5px_rgba(255,255,255,1)] flex flex-col gap-1 backdrop-blur-2xl max-w-[190px] hidden sm:flex text-[#1D1D1F]">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 text-[#D6B46A] fill-[#D6B46A]" />
                  ))}
                </div>
                <p className="text-[10px] text-[#8E8E93] italic">
                  "Website live in 48 hours is absolute perfection."
                </p>
                <span className="text-[8px] font-mono uppercase font-bold text-[#D6B46A] mt-0.5">
                  — Rajesh M.
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- TRUST STATS SECTION --- */}
      <section className={`py-16 border-y transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0A]/60 border-white/10' : 'bg-[#F2F2F0]/60 border-black/[0.08]'
      }`} id="trust-bar-section">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <InteractiveStatsGrid stats={stats} />

          <div className="text-center flex flex-col items-center gap-2.5 pt-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Built for business owners who want speed without compromising class.
            </p>
            <p className="text-xs text-[#8E8E93] max-w-3xl leading-relaxed">
              No endless waiting. No basic templates. No confusing process. SamaXon brings senior engineering, high-caliber aesthetic design, smart workflow automation, and dashboard systems under one premium execution studio.
            </p>
          </div>
        </div>
      </section>

      {/* --- CAPABILITIES SUITE --- */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="capabilities-grid-section">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
            One Studio. Complete Digital Power.
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-[#1D1D1F]'
          }`}>
            Capabilities Suite
          </h2>
          <p className="text-sm text-[#8E8E93] max-w-xl leading-relaxed">
            From your first high-end logo to your full business control dashboard, SamaXon handles the complete digital chain with uncompromising posture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.slice(0, 6).map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between group backdrop-blur-2xl relative overflow-hidden ${
                isDark 
                  ? 'bg-[#121212]/80 border-white/10 hover:border-[#D6B46A]/50 hover:bg-[#161616]/90 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                  : 'bg-white/80 border-black/8 hover:border-[#D6B46A]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
              }`}
            >
              <div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105 border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-[#D6B46A]' 
                    : 'bg-black/5 border-black/5 text-[#D6B46A]'
                }`}>
                  {service.id === 'web-dev' && <Code className="w-5 h-5" />}
                  {service.id === 'app-dev' && <Layers className="w-5 h-5" />}
                  {service.id === 'identity-design' && <Crown className="w-5 h-5" />}
                  {service.id === '8k-graphics' && <Sparkles className="w-5 h-5" />}
                  {service.id === 'automations' && <FileSpreadsheet className="w-5 h-5" />}
                  {service.id === 'telegram-bots' && <MessageCircle className="w-5 h-5" />}
                </div>

                <h3 className="font-display font-bold text-base mb-1.5 flex items-center gap-1.5">
                  {service.title}
                </h3>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#D6B46A] mb-3 font-semibold">
                  Pain Solved: {service.painPoint.split('.')[0]}.
                </p>
                <p className="text-xs text-[#8E8E93] leading-relaxed mb-6">
                  {service.solutionCopy.slice(0, 130)}...
                </p>
              </div>

              <LiquidButton
                onClick={() => handleAction('services')}
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                icon={<ArrowRight className="w-3 h-3 text-[#D6B46A]" />}
              >
                Explore Service
              </LiquidButton>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <LiquidButton
            onClick={() => handleAction('services')}
            variant="gold"
            size="md"
            icon={<Layers className="w-3.5 h-3.5" />}
          >
            View Full Capability Stack
          </LiquidButton>
        </div>
      </section>

      {/* --- DEMO-FIRST EDGE SECTION --- */}
      <section className={`py-24 border-t transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0A]/60 border-white/10' : 'bg-[#F2F2F0]/60 border-black/[0.08]'
      }`} id="edge-section">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start gap-5 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              See the Work Before You Trust the Words
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-[#1D1D1F]'
            }`}>
              The SamaXon Edge: Demo-First.
            </h2>
            <p className="text-sm text-[#8E8E93] leading-relaxed">
              Most traditional digital agencies start with billing, complex contracts, and pitch slides. SamaXon starts with execution. We examine your enterprise, craft a premium conceptual visual layout direction, and show you exactly what we can build before requesting major commitments.
            </p>

            <div className="flex flex-col gap-3 w-full">
              {[
                { title: "Demo-First Approach", desc: "No blind invoices. We render key design screens before invoicing." },
                { title: "Senior Engineering Wing", desc: "Crafted directly by high-end frontend architects, not junior freelancers." },
                { title: "48-Hour Execution Culture", desc: "Optimized pipelines allow custom premium websites to ship in 48 hours." }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3.5 p-3.5 rounded-2xl border backdrop-blur-xl ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                      : 'bg-white/85 border-black/6 shadow-xs'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/30 flex items-center justify-center shrink-0 text-[#D6B46A]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-[#8E8E93] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <LiquidButton
                onClick={() => handleAction('edge')}
                variant="gold"
                size="md"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Request a Demo Direction
              </LiquidButton>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className={`w-full max-w-[380px] rounded-3xl p-6 border shadow-2xl relative backdrop-blur-3xl overflow-hidden ${
              isDark 
                ? 'bg-[#141414]/85 border-white/12 text-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)]' 
                : 'bg-white/85 border-black/10 text-[#1D1D1F] shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
            }`}>
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3.5 mb-4">
                <span className="font-display font-bold text-xs uppercase">Prototype Direction</span>
                <span className="w-2 h-2 rounded-full bg-[#D6B46A] shadow-[0_0_8px_#D6B46A] animate-pulse" />
              </div>

              <div className="space-y-3.5">
                <p className="text-[9px] font-mono text-[#8E8E93] uppercase tracking-widest">
                  Pre-Build Rendering
                </p>
                
                <div className={`h-28 rounded-2xl border flex flex-col justify-center items-center p-4 backdrop-blur-md ${
                  isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.03] border-black/6'
                }`}>
                  <Sparkles className="w-6 h-6 text-[#D6B46A]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold mt-1.5">
                    SamaXon Design Studio
                  </span>
                  <span className="text-[8px] text-[#8E8E93] uppercase mt-0.5">
                    Visual Direction Ready
                  </span>
                </div>

                <div className={`p-3 rounded-xl border backdrop-blur-md ${
                  isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.02] border-black/6'
                }`}>
                  <span className="text-[8px] font-mono text-[#8E8E93] block uppercase tracking-wider">
                    Proposed Delivery Timeline
                  </span>
                  <span className="text-xs font-semibold uppercase flex items-center justify-between mt-1">
                    <span>48-Hour Live Deployment</span>
                    <span className="text-[#D6B46A] font-mono text-[10px] font-bold">100% Guaranteed</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- CLIENT CONTROL SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="client-control-section">
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
          <div className={`w-full max-w-[380px] rounded-3xl p-6 border shadow-2xl backdrop-blur-3xl relative overflow-hidden ${
            isDark 
              ? 'bg-[#121212]/85 border-white/12 text-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)]' 
              : 'bg-white/85 border-black/10 text-[#1D1D1F] shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
          }`}>
            <div className="flex items-center gap-2.5 border-b border-black/5 dark:border-white/5 pb-3.5 mb-4">
              <BarChart3 className="w-4 h-4 text-[#D6B46A]" />
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider">Digital Remote Control</h4>
                <p className="text-[8px] font-mono uppercase text-[#8E8E93]">Future Admin Control Concept</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className={`p-3 rounded-xl border flex items-center justify-between backdrop-blur-md ${
                isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.02] border-black/6'
              }`}>
                <span className="text-[10px] font-mono uppercase">Manage Content</span>
                <span className="text-[9px] text-[#D6B46A] font-mono uppercase font-bold">Instant Edit</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-between backdrop-blur-md ${
                isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.02] border-black/6'
              }`}>
                <span className="text-[10px] font-mono uppercase">Manage Leads</span>
                <span className="text-[9px] text-emerald-500 font-mono uppercase font-bold">Active (2 New)</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-between backdrop-blur-md ${
                isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.02] border-black/6'
              }`}>
                <span className="text-[10px] font-mono uppercase">Manage Bookings</span>
                <span className="text-[9px] text-[#8E8E93] font-mono uppercase">Unlocks on Request</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#D6B46A]/10 border border-[#D6B46A]/20 rounded-xl text-center">
              <p className="text-[9px] font-mono text-[#D6B46A] uppercase tracking-wider font-semibold">
                No DB coding required for basic updates
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start gap-5 text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
            Every Serious Business Needs a Digital Remote Control.
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-[#1D1D1F]'
          }`}>
            Website with an Architectural Control Layer.
          </h2>
          <p className="text-sm text-[#8E8E93] leading-relaxed">
            A visually stunning front-end portal is only half the battle. Every SamaXon build has its structure prepared for our exclusive Client Control system. Update marketing slogans, list pricing metrics, alter images, and track inquiries safely without having to call developers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {[
              { title: "Manage Content", desc: "Edit service texts, gallery banners, and visual assets without developer assistance." },
              { title: "Consolidate Leads", desc: "Centralize inquiry submissions into one secure workspace cataloged automatically." },
              { title: "Track Growth Metrics", desc: "Keep a future-ready analytics backbone configured right from launch day." },
              { title: "Bookings-Configured", desc: "Prepared systems to enable booking and consultation slots dynamically later." }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-2xl border flex flex-col gap-1 backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/[0.03] border-white/8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                    : 'bg-white/80 border-black/6 shadow-xs'
                }`}
              >
                <h4 className="font-display font-bold text-xs uppercase tracking-wider">{card.title}</h4>
                <p className="text-xs text-[#8E8E93] leading-normal">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <LiquidButton
              onClick={() => handleAction('control')}
              variant="gold"
              size="md"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Build My Digital Control System
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* --- 48-HOUR PROCESS TIMELINE --- */}
      <section className={`py-24 border-t transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0A]/60 border-white/10' : 'bg-[#F2F2F0]/60 border-black/[0.08]'
      }`} id="process-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Execution Architecture
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#1D1D1F]'
            }`}>
              Idea to Digital Presence in 48 Hours.
            </h2>
            <p className="text-sm text-[#8E8E93] max-w-xl leading-relaxed">
              Speed is not lucky. True speed comes from strict pipeline mechanics, optimized component frames, senior developers, and structured client interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Decode", desc: "We immediately explore your business layout, targets, offerings, pain points, and core deadlines." },
              { num: "02", title: "Design", desc: "Our Design Studio creates the custom premium layout, color grids, and brand aesthetics." },
              { num: "03", title: "Develop", desc: "Our Senior Developer Wing writes response-ready responsive code, applying fast-loading principles." },
              { num: "04", title: "Deliver", desc: "Your asset is securely deployed, live, and fully ready to capture qualified inquiries." }
            ].map((step, idx) => (
              <div 
                key={idx}
                className={`p-7 rounded-3xl border relative overflow-hidden flex flex-col justify-between h-64 group transition-all duration-300 backdrop-blur-2xl ${
                  isDark 
                    ? 'bg-[#121212]/80 border-white/10 hover:border-[#D6B46A]/50 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                    : 'bg-white/80 border-black/8 hover:border-[#D6B46A]/50 hover:shadow-lg shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
                }`}
              >
                <div className="absolute top-2 right-4 font-display font-bold text-5xl text-[#D6B46A]/10 group-hover:text-[#D6B46A]/20 transition-colors select-none">
                  {step.num}
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#D6B46A] font-bold tracking-widest block mb-3">
                    Step {step.num}
                  </span>
                  <h4 className="font-display font-bold text-base mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#8E8E93] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="h-0.5 bg-[#D6B46A] rounded w-1/4 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO PREVIEW --- */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="portfolio-preview-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left flex flex-col items-start gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Elite Proof of Work
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#1D1D1F]'
            }`}>
              Engineered to Look Expensive.
            </h2>
            <p className="text-sm text-[#8E8E93] max-w-lg">
              Every SamaXon project is built with one focused milestone: make the business look trustworthy, modern, credible, and conversion-ready.
            </p>
          </div>
          <LiquidButton
            onClick={() => handleAction('portfolio')}
            variant="gold"
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            View Selected Work
          </LiquidButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.filter(p => !!p.thumbnailUrl).slice(0, 3).map((project) => (
            <div 
              key={project.id}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group backdrop-blur-2xl relative overflow-hidden ${
                isDark 
                  ? 'bg-[#121212]/80 border-white/10 hover:border-[#D6B46A]/50 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                  : 'bg-white/80 border-black/8 hover:border-[#D6B46A]/50 hover:shadow-lg shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
              }`}
            >
              <div>
                {project.thumbnailUrl && (
                  <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-black/5 dark:border-white/5 bg-black/5">
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border backdrop-blur-md ${
                    isDark 
                      ? 'bg-white/10 border-white/15 text-white' 
                      : 'bg-black/5 border-black/10 text-[#1D1D1F]'
                  }`}>
                    {project.visualTag}
                  </span>
                  <span className="text-[8px] font-mono text-[#8E8E93] uppercase font-bold">
                    Live Build
                  </span>
                </div>

                <h3 className="font-display font-semibold text-base mb-2">
                  {project.title}
                </h3>
                <div className="space-y-2 text-xs text-[#8E8E93] leading-relaxed">
                  <p>
                    <strong className="text-[#D6B46A] uppercase text-[9px] font-mono tracking-wider block">Problem:</strong>
                    {project.problem.slice(0, 90)}...
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5">
                <LiquidButton
                  onClick={() => handleAction('portfolio')}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-3 h-3 text-[#D6B46A]" />}
                >
                  View Project Case Study
                </LiquidButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className={`py-24 border-t transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0A]/60 border-white/10' : 'bg-[#F2F2F0]/60 border-black/[0.08]'
      }`} id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Founder Trust Notes
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#1D1D1F]'
            }`}>
              Direct Experience Reports
            </h2>
            <p className="text-sm text-[#8E8E93] max-w-lg">
              Understand why ambitious business leaders in India trust SamaXon to execute their digital launches with extreme speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <div 
                key={testimonial.id}
                className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all duration-300 backdrop-blur-2xl ${
                  isDark 
                    ? 'bg-[#121212]/80 border-white/10 hover:border-[#D6B46A]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                    : 'bg-white/80 border-black/8 hover:border-[#D6B46A]/50 shadow-sm shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
                }`}
              >
                <div>
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 text-[#D6B46A] fill-[#D6B46A]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm italic leading-relaxed mb-6 text-[#8E8E93]">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-black/5 dark:border-white/5 pt-4">
                  <div className="w-8 h-8 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#D6B46A] flex items-center justify-center font-display font-bold text-xs shrink-0">
                    {testimonial.author.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-display text-xs font-bold uppercase tracking-wide">
                      {testimonial.author}
                    </span>
                    <span className="text-[9px] font-mono text-[#8E8E93] uppercase">
                      {testimonial.role} · <span className="text-[#D6B46A]">{testimonial.company}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 max-w-4xl mx-auto px-6" id="home-faq-section">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
            Direct Clarity · Answer Engine Optimised
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight uppercase ${
            isDark ? 'text-white' : 'text-[#1D1D1F]'
          }`}>
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#8E8E93] max-w-xl leading-relaxed">
            Get direct, transparent answers to our delivery cycles, client controls, and our Demo-First methodology.
          </p>
        </div>

        <div className="space-y-3.5 max-w-3xl mx-auto">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`rounded-2xl border p-5 sm:p-6 transition-all backdrop-blur-2xl ${
                  isDark 
                    ? 'bg-[#121212]/80 border-white/10 hover:border-[#D6B46A]/40 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                    : 'bg-white/80 border-black/8 hover:border-[#D6B46A]/50 shadow-sm shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left font-display font-bold text-xs sm:text-sm uppercase tracking-wide cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#D6B46A] w-6 h-6 rounded-full bg-[#D6B46A]/10 border border-[#D6B46A]/20 flex items-center justify-center shrink-0 ml-4">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ 
                    height: isOpen ? 'auto' : 0, 
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? 10 : 0
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed pl-3.5 border-l-2 border-[#D6B46A]/40 pt-1">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- FINAL CONVERSION CTA --- */}
      <section className={`py-24 border-t transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0A]/60 border-white/10' : 'bg-[#F2F2F0]/60 border-black/[0.08]'
      }`} id="final-cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <div className="w-10 h-10 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/30 text-[#D6B46A] flex items-center justify-center">
            <Zap className="w-5 h-5 fill-current" />
          </div>

          <h2 className={`font-display text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-tight ${
            isDark ? 'text-white' : 'text-[#1D1D1F]'
          }`}>
            Your Business Deserves an Online Presence That Matches Your Ambition.
          </h2>

          <p className="text-sm sm:text-base text-[#8E8E93] max-w-xl leading-relaxed">
            Aapka product strong hai. Service strong hai. Ab digital presence bhi strong honi chahiye. SamaXon brings premium design, fast engineering, and business-ready systems together in one elite studio.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center pt-2">
            <LiquidButton
              onClick={() => handleAction('contact')}
              id="cta-bottom-start"
              variant="gold"
              size="lg"
              icon={<ArrowRight className="w-4 h-4 inline-block ml-1.5" />}
            >
              Start Your 48-Hour Build
            </LiquidButton>
            <LiquidButton
              onClick={() => handleAction('about')}
              id="cta-bottom-talk"
              variant="glass"
              size="lg"
            >
              Who is SamaXon?
            </LiquidButton>
          </div>

          <div className="text-[9px] font-mono tracking-widest text-[#8E8E93] uppercase mt-2">
            NO RANDOM TRYS · NO ENDLESS BACK-AND-FORTH · PREMIUM DIRECT LAUNCH
          </div>
        </div>
      </section>
    </div>
  );
}
