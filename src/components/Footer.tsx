import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Crown, Shield, CheckCircle, Scale, Monitor, Smartphone, Palette, Cpu, Bot, Send, Linkedin, Instagram, MessageSquare } from 'lucide-react';

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const [socialLinks, setSocialLinks] = useState({
    telegramLink: 'https://t.me/samaxon_studio',
    linkedinLink: 'https://linkedin.com/company/samaxon',
    instagramLink: 'https://instagram.com/samaxon_studio',
    phoneWhatsapp: '+91 80000 00000'
  });

  useEffect(() => {
    const loadSocial = () => {
      try {
        const stored = localStorage.getItem('samaxon_website_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSocialLinks({
            telegramLink: parsed.telegramLink || 'https://t.me/samaxon_studio',
            linkedinLink: parsed.linkedinLink || 'https://linkedin.com/company/samaxon',
            instagramLink: parsed.instagramLink || 'https://instagram.com/samaxon_studio',
            phoneWhatsapp: parsed.phoneWhatsapp || '+91 80000 00000'
          });
        }
      } catch (e) {
        // Suppress logs under secure logging rule
      }
    };

    loadSocial();
    window.addEventListener('samaxon_website_settings_updated', loadSocial);
    return () => {
      window.removeEventListener('samaxon_website_settings_updated', loadSocial);
    };
  }, []);

  return (
    <footer className="bg-matte-black text-[#E5DBCF] border-t border-champagne-gold/15 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative Golden Accent Ring (Ambient Light) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[100px] pointer-events-none -z-1" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[100px] pointer-events-none -z-1" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
        
        {/* Brand Information Column */}
        <div className="flex flex-col gap-6">
          <Link 
            to="/"
            className="flex items-center gap-2 cursor-pointer group w-fit block"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-champagne-gold/30">
              <Zap className="w-5 h-5 text-champagne-gold fill-champagne-gold/10" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-medium uppercase tracking-widest text-lg text-soft-ivory flex items-center gap-1 leading-none">
                SamaXon
                <Crown className="w-3.5 h-3.5 text-champagne-gold" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-champagne-gold uppercase mt-0.5">
                Elite Speed Studio
              </span>
            </div>
          </Link>

          <p className="text-xs text-warm-grey leading-relaxed max-w-sm">
            India’s fastest premium digital studio building elite web systems, premium brand assets, and customized workflow automations under 48 hours.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold">
              Hinglish Trust Note:
            </span>
            <p className="text-xs italic text-warm-grey">
              "Aapka business ready hai, but systems slow hain? Wait mat kijiye. Build premium, scale fast."
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2" id="footer-social-panel">
            <a 
              href={socialLinks.telegramLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-champagne-gold/20 hover:border-champagne-gold hover:text-champagne-gold transition-all duration-300 flex items-center justify-center text-warm-grey cursor-pointer hover:scale-105 active:scale-95"
              title="Telegram Channel"
            >
              <Send className="w-4 h-4" />
            </a>
            <a 
              href={socialLinks.linkedinLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-champagne-gold/20 hover:border-champagne-gold hover:text-champagne-gold transition-all duration-300 flex items-center justify-center text-warm-grey cursor-pointer hover:scale-105 active:scale-95"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href={socialLinks.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-champagne-gold/20 hover:border-champagne-gold hover:text-champagne-gold transition-all duration-300 flex items-center justify-center text-warm-grey cursor-pointer hover:scale-105 active:scale-95"
              title="Instagram Handle"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href={`https://wa.me/${(socialLinks?.phoneWhatsapp || '').replace(/[^\d]/g, '') || '918000000000'}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-champagne-gold/20 hover:border-champagne-gold hover:text-champagne-gold transition-all duration-300 flex items-center justify-center text-warm-grey cursor-pointer hover:scale-105 active:scale-95"
              title="WhatsApp Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Studio Wings Navigation */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold border-b border-champagne-gold/15 pb-2 w-fit font-bold">
            Studio Wings
          </span>
          <div className="flex flex-col gap-3">
            <Link 
              to="/about" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Why SamaXon Exists
            </Link>
            <Link 
              to="/edge" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              The Demo-First Model
            </Link>
            <Link 
              to="/control" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Client Control Scaffolding
            </Link>
            <Link 
              to="/careers" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider block"
            >
              Careers / Digital Growth
            </Link>
          </div>
        </div>

        {/* Digital Capabilities Navigation */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold border-b border-champagne-gold/15 pb-2 w-fit font-bold">
            Capabilities
          </span>
          <div className="flex flex-col gap-3">
            <Link 
              to="/services" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer block"
            >
              <Monitor className="w-3.5 h-3.5 text-champagne-gold/75 group-hover:text-champagne-gold transition-colors duration-200" />
              <span>Premium Web Development</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer block"
            >
              <Smartphone className="w-3.5 h-3.5 text-champagne-gold/75 group-hover:text-champagne-gold transition-colors duration-200" />
              <span>Mobile App Solutions</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer block"
            >
              <Palette className="w-3.5 h-3.5 text-champagne-gold/75 group-hover:text-champagne-gold transition-colors duration-200" />
              <span>Logo & Identity Design</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer block"
            >
              <Cpu className="w-3.5 h-3.5 text-champagne-gold/75 group-hover:text-champagne-gold transition-colors duration-200" />
              <span>Business Workflow Automations</span>
            </Link>
            <Link 
              to="/services" 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 flex items-center gap-2 group cursor-pointer block"
            >
              <Bot className="w-3.5 h-3.5 text-champagne-gold/75 group-hover:text-champagne-gold transition-colors duration-200" />
              <span>Custom Telegram Bots</span>
            </Link>
          </div>
        </div>

        {/* Quick Contact Box */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold border-b border-champagne-gold/15 pb-2 w-fit font-bold">
            Initiate Build
          </span>
          <div className="bg-[#1A1A1A] border border-champagne-gold/10 p-5 rounded-2xl flex flex-col gap-4">
            <p className="text-xs text-warm-grey leading-relaxed">
              Skip traditional slow proposals. Submit inquiry and see direction first.
            </p>
            <Link 
              to="/contact"
              className="w-full py-2.5 bg-champagne-gold text-matte-black font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-muted-gold transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-center block font-sans"
            >
              Request Quote
              <CheckCircle className="w-3.5 h-3.5 inline-block" />
            </Link>
          </div>
        </div>

      </div>

      {/* Premium Studio Metrics Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="border border-[#D6B46A]/20 bg-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Dedicated Unit</span>
              <span className="text-sm font-semibold text-white">SamaXon Senior Wing</span>
            </div>
            <div className="w-px h-8 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Execution Period</span>
              <span className="text-sm font-semibold text-white">Guaranteed Under 48 Hours</span>
            </div>
            <div className="w-px h-8 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Delivery Pipeline</span>
              <span className="text-sm font-semibold text-[#D6B46A]">Demo-First Ready</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">System Live: Active</span>
          </div>
        </div>
      </div>

      {/* Dividers & Legal Pages block */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-champagne-gold/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-warm-grey">
        <p className="font-mono text-[10px] tracking-wide uppercase text-center md:text-left">
          © {new Date().getFullYear()} SAMAXON STUDIO. ALL RIGHTS RESERVED. POWERED BY SENIOR DEV WING.
        </p>
        
        {/* Legal buttons */}
        <div className="flex items-center gap-6 flex-wrap justify-center font-bold">
          <Link 
            to="/privacy" 
            className="hover:text-champagne-gold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1 block"
          >
            <Shield className="w-3 h-3 text-champagne-gold inline-block" />
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className="hover:text-champagne-gold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1 block"
          >
            <Scale className="w-3 h-3 text-champagne-gold inline-block" />
            Terms & Conditions
          </Link>
          <Link 
            to="/refund" 
            className="hover:text-champagne-gold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1 block"
          >
            <Scale className="w-3 h-3 text-champagne-gold inline-block" />
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
