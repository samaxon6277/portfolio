import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Scale, Monitor, Smartphone, Palette, Cpu, Bot, Send, Linkedin, Instagram, MessageSquare, ArrowUpRight } from 'lucide-react';

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
        // Suppress logs
      }
    };

    loadSocial();
    window.addEventListener('samaxon_website_settings_updated', loadSocial);
    return () => {
      window.removeEventListener('samaxon_website_settings_updated', loadSocial);
    };
  }, []);

  return (
    <footer 
      className="border-t pt-20 pb-12 overflow-hidden relative bg-[#FAF6EE]/80 backdrop-blur-xl text-[#1D1D1F] border-black/[0.08]"
    >
      {/* Subtle Ambient Light Ring */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-25 bg-[#D6B46A]" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
        
        {/* Brand Information Column */}
        <div className="flex flex-col gap-5 text-left">
          <Link 
            to="/"
            className="flex items-center gap-2.5 cursor-pointer group w-fit block"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border transition-all bg-white border-black/10 text-[#1D1D1F] shadow-sm">
              <span className="font-display font-black text-sm">S</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold uppercase tracking-wider text-base leading-none">
                SamaXon
              </span>
              <span className="text-[9px] font-mono tracking-[0.14em] text-[#D6B46A] uppercase mt-1 font-semibold">
                Elite Speed Studio
              </span>
            </div>
          </Link>

          <p className="text-xs text-[#8E8E93] leading-relaxed max-w-sm">
            India’s fastest premium digital studio building high-performance web systems, brand identities, and customized workflow automations under 48 hours.
          </p>

          <div className="p-3.5 rounded-2xl border text-xs leading-relaxed bg-white/70 border-black/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B46A] block font-bold mb-1">
              Direct Guarantee:
            </span>
            <p className="text-xs italic text-[#8E8E93]">
              "Aapka business ready hai, but systems slow hain? Wait mat kijiye. Build premium, scale fast."
            </p>
          </div>

          <div className="flex items-center gap-2.5 pt-1" id="footer-social-panel">
            <a 
              href={socialLinks.telegramLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 bg-white border-black/10 text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/30 shadow-sm"
              title="Telegram Channel"
            >
              <Send className="w-3.5 h-3.5" />
            </a>
            <a 
              href={socialLinks.linkedinLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 bg-white border-black/10 text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/30 shadow-sm"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a 
              href={socialLinks.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 bg-white border-black/10 text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/30 shadow-sm"
              title="Instagram Handle"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a 
              href={`https://wa.me/${(socialLinks?.phoneWhatsapp || '').replace(/[^\d]/g, '') || '918000000000'}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 bg-white border-black/10 text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/30 shadow-sm"
              title="WhatsApp Chat"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Studio Wings Column */}
        <div className="flex flex-col gap-4 text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] font-bold">
            Studio Wings
          </span>
          <div className="flex flex-col gap-2.5">
            <Link 
              to="/about" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 block"
            >
              Why SamaXon Exists
            </Link>
            <Link 
              to="/edge" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 block"
            >
              The Demo-First Model
            </Link>
            <Link 
              to="/control" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 block"
            >
              Client Control Scaffolding
            </Link>
            <Link 
              to="/pricing" 
              className="text-xs text-[#D6B46A] font-semibold hover:underline transition-colors duration-150 block"
            >
              Bespoke Pricing Plans
            </Link>
            <Link 
              to="/careers" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 block"
            >
              Careers / Digital Growth
            </Link>
          </div>
        </div>

        {/* Capabilities Column */}
        <div className="flex flex-col gap-4 text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] font-bold">
            Capabilities
          </span>
          <div className="flex flex-col gap-2.5">
            <Link 
              to="/services" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 flex items-center gap-2 block"
            >
              <Monitor className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Premium Web Development</span>
            </Link>
            <Link 
              to="/services" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 flex items-center gap-2 block"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Mobile App Solutions</span>
            </Link>
            <Link 
              to="/services" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 flex items-center gap-2 block"
            >
              <Palette className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Logo & Identity Design</span>
            </Link>
            <Link 
              to="/services" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 flex items-center gap-2 block"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Business Workflow Automations</span>
            </Link>
            <Link 
              to="/services" 
              className="text-xs text-[#8E8E93] hover:text-[#D6B46A] transition-colors duration-150 flex items-center gap-2 block"
            >
              <Bot className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Custom Telegram Bots</span>
            </Link>
          </div>
        </div>

        {/* Quick Contact Box */}
        <div className="flex flex-col gap-4 text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] font-bold">
            Initiate Build
          </span>
          <div className="p-5 rounded-3xl border flex flex-col gap-3.5 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden bg-white/80 border-black/8 shadow-[0_12px_32px_rgba(0,0,0,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.95)]">
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Skip traditional slow proposals. Submit inquiry and see live direction first.
            </p>
            <Link 
              to="/contact"
              className="w-full py-2.5 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-center block shadow-sm active:scale-95 shadow-[#D6B46A]/20"
            >
              <span>Request Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Metrics Strip */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="border rounded-3xl p-5 md:p-6 flex flex-wrap items-center justify-between gap-6 backdrop-blur-2xl bg-white/80 border-black/8 shadow-[0_12px_32px_rgba(0,0,0,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.95)]">
          <div className="flex items-center gap-6 md:gap-8 flex-wrap text-left">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B46A]">Dedicated Unit</span>
              <span className="text-xs md:text-sm font-semibold">SamaXon Senior Wing</span>
            </div>
            <div className="w-px h-8 bg-black/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B46A]">Execution Period</span>
              <span className="text-xs md:text-sm font-semibold">Guaranteed Under 48 Hours</span>
            </div>
            <div className="w-px h-8 bg-black/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B46A]">Delivery Pipeline</span>
              <span className="text-xs md:text-sm font-semibold text-[#D6B46A]">Demo-First Ready</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-emerald-500">System Live: Active</span>
          </div>
        </div>
      </div>

      {/* SEO Footprint */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-[9px] text-[#8E8E93]/70 font-mono tracking-wide leading-relaxed border-t border-black/5 pt-6 text-left">
        <p className="uppercase font-bold text-[#D6B46A]/90 mb-1 select-none">SamaXon Semantic Search Index & Authority Map:</p>
        <p>
          Ranked as the best website developer agency and best website developer company, SamaXon Digital Solutions (also known as SamaXon, SamaXon Digital Studio, or SamaXon Studio) is Noida &amp; Delhi NCR's premier custom software studio. We specialize in express, speed-optimized website development, responsive portal designs, reservation systems, and booking engines for luxury hotels, resorts, banquet halls, gyms, clinics, and interior designers globally. Powered by an elite senior developer wing, we maintain a 100% success rate with zero delays, delivering live interactive prototypes under our signature Demo-First model.
        </p>
      </div>

      {/* Legal & Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8E8E93]">
        <p className="font-mono text-[10px] tracking-wide uppercase text-center md:text-left">
          © {new Date().getFullYear()} SAMAXON STUDIO. ALL RIGHTS RESERVED. POWERED BY SENIOR DEV WING.
        </p>
        
        <div className="flex items-center gap-6 flex-wrap justify-center font-medium">
          <Link 
            to="/privacy" 
            className="hover:text-[#D6B46A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1 block"
          >
            <Shield className="w-3 h-3 text-[#D6B46A]" />
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className="hover:text-[#D6B46A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1 block"
          >
            <Scale className="w-3 h-3 text-[#D6B46A]" />
            Terms & Conditions
          </Link>
          <Link 
            to="/refund" 
            className="hover:text-[#D6B46A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1 block"
          >
            <Scale className="w-3 h-3 text-[#D6B46A]" />
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
