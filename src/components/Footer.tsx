import { Zap, Crown, Mail, Shield, CheckCircle, Scale } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-matte-black text-[#E5DBCF] border-t border-champagne-gold/15 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative Golden Accent Ring (Ambient Light) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[100px] pointer-events-none -z-1" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[100px] pointer-events-none -z-1" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
        
        {/* Brand Information Column */}
        <div className="flex flex-col gap-6">
          <div 
            onClick={() => handlePageChange('home')}
            className="flex items-center gap-2 cursor-pointer group w-fit"
          >
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center border border-champagne-gold/30">
              <Zap className="w-5 h-5 text-champagne-gold fill-champagne-gold/10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-medium uppercase tracking-widest text-lg text-soft-ivory flex items-center gap-1 leading-none">
                SamaXon
                <Crown className="w-3.5 h-3.5 text-champagne-gold" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-champagne-gold uppercase mt-0.5">
                Elite Speed Studio
              </span>
            </div>
          </div>

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
        </div>

        {/* Studio Wings Navigation */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold border-b border-champagne-gold/15 pb-2 w-fit">
            Studio Wings
          </span>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handlePageChange('about')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider"
            >
              Why SamaXon Exists
            </button>
            <button 
              onClick={() => handlePageChange('edge')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider"
            >
              The Demo-First Model
            </button>
            <button 
              onClick={() => handlePageChange('control')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider"
            >
              Client Control Scaffolding
            </button>
            <button 
              onClick={() => handlePageChange('careers')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200 uppercase tracking-wider"
            >
              Careers / Digital Growth
            </button>
          </div>
        </div>

        {/* Digital Capabilities Navigation */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold border-b border-champagne-gold/15 pb-2 w-fit">
            Capabilities
          </span>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handlePageChange('services')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200"
            >
              💻 Premium Web Development
            </button>
            <button 
              onClick={() => handlePageChange('services')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200"
            >
              📱 Mobile App Solutions
            </button>
            <button 
              onClick={() => handlePageChange('services')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200"
            >
              🎨 Logo & Identity Design
            </button>
            <button 
              onClick={() => handlePageChange('services')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200"
            >
              ⚡ Business Workflow Automations
            </button>
            <button 
              onClick={() => handlePageChange('services')} 
              className="text-left text-xs text-warm-grey hover:text-champagne-gold hover:translate-x-1 duration-200"
            >
              🤖 Custom Telegram Bots
            </button>
          </div>
        </div>

        {/* Quick Contact Box */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold border-b border-champagne-gold/15 pb-2 w-fit">
            Initiate Build
          </span>
          <div className="bg-charcoal/40 border border-champagne-gold/10 p-5 rounded-2xl flex flex-col gap-4">
            <p className="text-xs text-warm-grey leading-relaxed">
              Skip traditional slow proposals. Submit inquiry and see direction first.
            </p>
            <button 
              onClick={() => handlePageChange('contact')}
              className="w-full py-2.5 bg-champagne-gold text-matte-black font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-muted-gold transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Request Quote
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Premium Studio Metrics Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="border border-[#D6B46A]/20 bg-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Dedicated Unit</span>
              <span className="text-sm font-semibold text-white">SamaXon Senior Wing</span>
            </div>
            <div className="w-px h-8 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A]">Execution Period</span>
              <span className="text-sm font-semibold text-white">Guaranteed Under 48 Hours</span>
            </div>
            <div className="w-px h-8 bg-[#D6B46A]/20 hidden sm:block" />
            <div className="flex flex-col">
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
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <button 
            onClick={() => handlePageChange('privacy')} 
            className="hover:text-champagne-gold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1"
          >
            <Shield className="w-3 h-3 text-champagne-gold" />
            Privacy
          </button>
          <button 
            onClick={() => handlePageChange('terms')} 
            className="hover:text-champagne-gold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1"
          >
            <Scale className="w-3 h-3 text-champagne-gold" />
            Terms & Conditions
          </button>
          <button 
            onClick={() => handlePageChange('refund')} 
            className="hover:text-champagne-gold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1"
          >
            <Scale className="w-3 h-3 text-champagne-gold" />
            Refund Policy
          </button>
        </div>
      </div>
    </footer>
  );
}
