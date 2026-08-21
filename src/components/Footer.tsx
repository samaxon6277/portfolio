import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Crown, Shield, Scale, Monitor, Smartphone, Palette, Cpu, Bot, Send, Linkedin, Instagram, MessageSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG, getWhatsAppInquiryUrl } from '../config/siteConfig';

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const [socialLinks, setSocialLinks] = useState({
    telegramLink: SITE_CONFIG.social.telegram,
    linkedinLink: SITE_CONFIG.social.linkedin,
    instagramLink: SITE_CONFIG.social.instagram,
    phoneWhatsapp: SITE_CONFIG.phoneWhatsapp,
  });

  useEffect(() => {
    const loadSocial = () => {
      try {
        const stored = localStorage.getItem('samaxon_website_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSocialLinks({
            telegramLink: parsed.telegramLink || SITE_CONFIG.social.telegram,
            linkedinLink: parsed.linkedinLink || SITE_CONFIG.social.linkedin,
            instagramLink: parsed.instagramLink || SITE_CONFIG.social.instagram,
            phoneWhatsapp: parsed.phoneWhatsapp || SITE_CONFIG.phoneWhatsapp,
          });
        }
      } catch (e) {
        // Safe fallback
      }
    };

    loadSocial();
    window.addEventListener('samaxon_website_settings_updated', loadSocial);
    return () => {
      window.removeEventListener('samaxon_website_settings_updated', loadSocial);
    };
  }, []);

  const whatsappInquiryLink = getWhatsAppInquiryUrl('Hello SamaXon Team, I would like to request a quote for a custom digital build.');

  return (
    <footer className="bg-[#0D0D0D] text-[#E5DBCF] border-t border-[#D6B46A]/20 pt-20 pb-12 overflow-hidden relative">
      {/* Decorative Golden Ambient Aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-[120px] pointer-events-none -z-1" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-[120px] pointer-events-none -z-1" />

      {/* Main 4-Column Footer Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
        
        {/* Column 1: Brand Information & Social Profiles */}
        <div className="flex flex-col gap-6">
          <Link 
            to="/"
            className="flex items-center gap-2.5 cursor-pointer group w-fit block"
            aria-label="SamaXon Home"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:border-[#D6B46A] transition-colors duration-300">
              <Zap className="w-5 h-5 text-[#D6B46A] fill-[#D6B46A]/10" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-medium uppercase tracking-widest text-lg text-white flex items-center gap-1.5 leading-none">
                SamaXon
                <Crown className="w-3.5 h-3.5 text-[#D6B46A]" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#D6B46A] uppercase mt-0.5">
                Speed-Driven Digital Studio
              </span>
            </div>
          </Link>

          <p className="text-xs text-[#A6A29E] leading-relaxed max-w-sm">
            High-Performance Digital Architecture, Delivered in 48 Hours. Precision-built digital assets, bespoke user interfaces, and automated workflows engineered for modern enterprise scale.
          </p>

          <div className="flex flex-col gap-2 pt-2 border-l-2 border-[#D6B46A]/40 pl-3.5 py-1 bg-white/[0.02] rounded-r-lg">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-semibold">
              The Studio Standard:
            </span>
            <p className="text-xs text-[#D8D2C9] leading-normal font-sans">
              No wireframe delays. Real interactive prototypes delivered within 48 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2" id="footer-social-panel">
            <a 
              href={socialLinks.linkedinLink}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href={socialLinks.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="Instagram Handle"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href={socialLinks.telegramLink}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="Telegram Channel"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
            <a 
              href={whatsappInquiryLink}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="Official WhatsApp Inquiry"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Digital Capabilities & Services */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] border-b border-[#D6B46A]/20 pb-2 w-fit font-bold">
            Core Capabilities
          </span>
          <div className="flex flex-col gap-3.5">
            <Link 
              to="/services" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5 text-[#D6B46A]/75 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>High-Performance Web Systems</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#D6B46A]/75 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>Full-Stack Mobile Applications</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#D6B46A]/75 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>Brand Identity & Design Systems</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D6B46A]/75 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>Business Workflow Automations</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-[#D6B46A]/75 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>AI Integration & Telegram Bots</span>
            </Link>
          </div>
        </div>

        {/* Column 3: Studio Ecosystem & Navigation */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] border-b border-[#D6B46A]/20 pb-2 w-fit font-bold">
            Studio Ecosystem
          </span>
          <div className="flex flex-col gap-3">
            <Link 
              to="/about" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Why SamaXon Exists
            </Link>
            <Link 
              to="/edge" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              The Demo-First Model
            </Link>
            <Link 
              to="/projects" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Selected Portfolio
            </Link>
            <Link 
              to="/control" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Client Control Scaffolding
            </Link>
            <Link 
              to="/pricing" 
              className="text-left text-xs text-[#D6B46A] hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider block font-semibold"
            >
              Bespoke Pricing Plans
            </Link>
            <Link 
              to="/careers" 
              className="text-left text-xs text-[#A6A29E] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Careers / Senior Dev Wing
            </Link>
          </div>
        </div>

        {/* Column 4: Initiate Build & Direct Inquiries */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] border-b border-[#D6B46A]/20 pb-2 w-fit font-bold">
            Initiate Build
          </span>
          <div className="bg-[#161616] border border-[#D6B46A]/20 p-5 rounded-2xl flex flex-col gap-4">
            <p className="text-xs text-[#A6A29E] leading-relaxed">
              Skip cumbersome discovery loops. Submit your requirements and review an interactive demo within 48 hours.
            </p>
            <Link 
              to="/contact"
              className="w-full py-3 bg-[#D6B46A] text-[#111111] font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-[#BFA15A] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-center font-sans shadow-lg shadow-[#D6B46A]/10 active:scale-[0.98]"
            >
              Request Quote
              <CheckCircle2 className="w-3.5 h-3.5 inline-block" />
            </Link>
            <a 
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="text-[11px] font-mono text-[#D6B46A] hover:underline flex items-center justify-center gap-1 mt-1 text-center"
            >
              {SITE_CONFIG.contactEmail}
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

      {/* Studio Operational Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="border border-[#D6B46A]/20 bg-white/[0.03] backdrop-blur-md rounded-2xl p-5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Engineering Unit</span>
              <span className="text-xs sm:text-sm font-semibold text-white">SamaXon Senior Developer Wing</span>
            </div>
            <div className="w-px h-7 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Turnaround SLA</span>
              <span className="text-xs sm:text-sm font-semibold text-white">48-Hour Interactive Delivery</span>
            </div>
            <div className="w-px h-7 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Delivery Architecture</span>
              <span className="text-xs sm:text-sm font-semibold text-[#D6B46A]">Demo-First Execution</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">Active Production Pipeline</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-[#D6B46A]/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A6A29E]">
        <p className="font-mono text-[10px] tracking-wide uppercase text-center md:text-left">
          © {new Date().getFullYear()} {SITE_CONFIG.legalName.toUpperCase()}. ALL RIGHTS RESERVED.
        </p>
        
        {/* Clean Legal Links */}
        <div className="flex items-center gap-6 flex-wrap justify-center font-medium">
          <Link 
            to="/privacy" 
            className="hover:text-[#D6B46A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3 h-3 text-[#D6B46A]" />
            Privacy Policy
          </Link>
          <Link 
            to="/terms" 
            className="hover:text-[#D6B46A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-3 h-3 text-[#D6B46A]" />
            Terms of Service
          </Link>
          <Link 
            to="/refund" 
            className="hover:text-[#D6B46A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-3 h-3 text-[#D6B46A]" />
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
