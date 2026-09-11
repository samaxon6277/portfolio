import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Crown, Shield, Scale, Monitor, Smartphone, Palette, Cpu, Bot, Send, Linkedin, Instagram, MessageSquare, ArrowUpRight, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { SITE_CONFIG, useLiveWebsiteSettings } from '../config/siteConfig';
import { getLatestUpdate, formatTimeAgo, SITE_UPDATES_EVENT } from '../utils/siteUpdatesManager';
import { WebsiteUpdateLog } from '../types';

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const settings = useLiveWebsiteSettings();
  const [latestUpdate, setLatestUpdate] = useState<WebsiteUpdateLog | null>(null);

  useEffect(() => {
    const loadUpdates = () => {
      setLatestUpdate(getLatestUpdate());
    };

    loadUpdates();
    window.addEventListener(SITE_UPDATES_EVENT, loadUpdates);
    return () => {
      window.removeEventListener(SITE_UPDATES_EVENT, loadUpdates);
    };
  }, []);

  const whatsappInquiryLink = `https://wa.me/${settings.phoneWhatsappRaw}?text=${encodeURIComponent('Hello SamaXon Team, I would like to request a quote for a custom digital build.')}`;

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
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center border border-[#D6B46A]/30 group-hover:border-[#D6B46A] transition-colors duration-300 overflow-hidden">
              {settings.logoType === 'image' && settings.logoUrl && settings.logoUrl.length > 5 ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.brandName || "Logo"} 
                  className="w-full h-full object-contain p-1" 
                />
              ) : (
                <span className="text-[#D6B46A] font-bold text-base font-display">
                  {settings.logoText || (settings.logoUrl && settings.logoUrl.length <= 4 ? settings.logoUrl : 'S')}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-medium uppercase tracking-widest text-lg text-white flex items-center gap-1.5 leading-none">
                {settings.brandName ? settings.brandName.split(' ')[0] : 'SamaXon'}
                <Crown className="w-3.5 h-3.5 text-[#D6B46A]" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#D6B46A] uppercase mt-0.5">
                Speed-Driven Digital Studio
              </span>
            </div>
          </Link>

          <p className="text-sm text-[#D5CEC4] leading-relaxed max-w-sm">
            High-Performance Digital Architecture, Delivered in 48 Hours. Precision-built digital assets, bespoke user interfaces, and automated workflows engineered for modern enterprise scale.
          </p>

          <div className="flex flex-col gap-2 pt-2 border-l-2 border-[#D6B46A]/40 pl-3.5 py-1.5 bg-white/[0.03] rounded-r-lg">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              The Studio Standard:
            </span>
            <p className="text-sm text-[#E2DDD5] leading-normal font-sans">
              No wireframe delays. Real interactive prototypes delivered within 48 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2" id="footer-social-panel">
            <a 
              href={settings.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href={settings.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="Instagram Handle"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#161616] border border-[#D6B46A]/20 hover:border-[#D6B46A] hover:text-[#D6B46A] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center text-[#A6A29E] cursor-pointer hover:scale-105 active:scale-95"
              title="Telegram Channel"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
            <a 
              href={whatsappInquiryLink}
              target="_blank"
              rel="noopener noreferrer"
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
          <span className="text-sm font-mono uppercase tracking-widest text-[#D6B46A] border-b border-[#D6B46A]/20 pb-2 w-fit font-bold">
            Core Capabilities
          </span>
          <div className="flex flex-col gap-3.5">
            <Link 
              to="/services" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2.5 group cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-[#D6B46A]/80 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>High-Performance Web Systems</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2.5 group cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#D6B46A]/80 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>Full-Stack Mobile Applications</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2.5 group cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[#D6B46A]/80 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>Brand Identity & Design Systems</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2.5 group cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#D6B46A]/80 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>Business Workflow Automations</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 flex items-center gap-2.5 group cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#D6B46A]/80 group-hover:text-[#D6B46A] transition-colors duration-200" />
              <span>AI Integration & Telegram Bots</span>
            </Link>
          </div>
        </div>

        {/* Column 3: Studio Ecosystem & Navigation */}
        <div className="flex flex-col gap-6">
          <span className="text-sm font-mono uppercase tracking-widest text-[#D6B46A] border-b border-[#D6B46A]/20 pb-2 w-fit font-bold">
            Studio Ecosystem
          </span>
          <div className="flex flex-col gap-3">
            <Link 
              to="/about" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              Why SamaXon Exists
            </Link>
            <Link 
              to="/edge" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              The Demo-First Model
            </Link>
            <Link 
              to="/projects" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              Selected Portfolio
            </Link>
            <Link 
              to="/control" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              Client Control Scaffolding
            </Link>
            <Link 
              to="/pricing" 
              className="text-left text-sm text-[#D6B46A] hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider block font-bold"
            >
              Bespoke Pricing Plans
            </Link>
            <Link 
              to="/guides" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              Knowledge & Guides
            </Link>
            <Link 
              to="/partner" 
              className="text-left text-sm text-[#D6B46A] hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider flex items-center justify-between font-bold"
            >
              <span>Partner Program</span>
              <span className="px-2 py-0.5 bg-[#D6B46A]/20 text-[#D6B46A] text-[10px] font-mono rounded font-bold">20% Earn</span>
            </Link>
            <Link 
              to="/tools" 
              className="text-left text-sm text-[#D6B46A] hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider flex items-center justify-between font-bold"
            >
              <span>Tools Suite</span>
              <span className="px-2 py-0.5 bg-[#D6B46A]/20 text-[#D6B46A] text-[10px] font-mono rounded font-bold">Free</span>
            </Link>
            <Link 
              to="/updates" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider flex items-center justify-between font-medium"
            >
              <span>Site Updates & Changelog</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-mono rounded font-bold">
                {latestUpdate ? latestUpdate.version : 'Live'}
              </span>
            </Link>
            <Link 
              to="/service-request" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              Interactive Service Portal
            </Link>
            <Link 
              to="/careers" 
              className="text-left text-sm text-[#D1CCC4] hover:text-[#D6B46A] hover:translate-x-1 duration-200 uppercase tracking-wider block font-medium"
            >
              Careers / Senior Dev Wing
            </Link>
          </div>
        </div>

        {/* Column 4: Initiate Build & Direct Inquiries */}
        <div className="flex flex-col gap-6">
          <span className="text-sm font-mono uppercase tracking-widest text-[#D6B46A] border-b border-[#D6B46A]/20 pb-2 w-fit font-bold">
            Initiate Build
          </span>
          <div className="bg-[#161616] border border-[#D6B46A]/20 p-6 rounded-2xl flex flex-col gap-4">
            <p className="text-sm text-[#D5CEC4] leading-relaxed">
              Skip cumbersome discovery loops. Submit your requirements and review an interactive demo within 48 hours.
            </p>
            <Link 
              to="/contact"
              className="w-full py-3.5 bg-[#D6B46A] text-[#111111] font-bold uppercase tracking-wider text-xs sm:text-sm rounded-xl hover:bg-[#BFA15A] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-center font-sans shadow-lg shadow-[#D6B46A]/10 active:scale-[0.98]"
            >
              Request Quote
              <CheckCircle2 className="w-4 h-4 inline-block" />
            </Link>
            <a 
              href={`mailto:${settings.contactEmail}`}
              className="text-xs font-mono text-[#D6B46A] hover:underline flex items-center justify-center gap-1 mt-1 text-center font-semibold"
            >
              {settings.contactEmail}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Studio Operational Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="border border-[#D6B46A]/20 bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#BFA15A]">Engineering Unit</span>
              <span className="text-sm sm:text-base font-bold text-white">SamaXon Senior Developer Wing</span>
            </div>
            <div className="w-px h-8 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#BFA15A]">Turnaround SLA</span>
              <span className="text-sm sm:text-base font-bold text-white">48-Hour Interactive Delivery</span>
            </div>
            <div className="w-px h-8 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#BFA15A]">Delivery Architecture</span>
              <span className="text-sm sm:text-base font-bold text-[#D6B46A]">Demo-First Execution</span>
            </div>
          </div>
          <Link
            to="/updates"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer group"
            title="View full website upgrade timeline and changelog"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 group-hover:text-white transition-colors flex items-center gap-1">
                <span>Production Live</span>
                <span className="text-emerald-500 font-normal">·</span>
                <span className="text-[#D6B46A]">Updated {latestUpdate ? formatTimeAgo(latestUpdate.timestamp) : 'Recently'}</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400/75">
                {latestUpdate ? `${latestUpdate.displayDate} at ${latestUpdate.displayTime.split('(')[0].trim()}` : 'Real-Time Sync'}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform ml-1" />
          </Link>
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
