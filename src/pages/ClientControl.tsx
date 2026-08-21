import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Cpu, Zap, Activity } from 'lucide-react';
import SEO from '../components/SEO';
import { ClientControlSandbox } from '../components/sandbox/ClientControlSandbox';

interface ClientControlProps {
  setCurrentPage?: (page: string) => void;
}

export default function ClientControl({ setCurrentPage }: ClientControlProps) {
  const navigate = useNavigate();

  const handleInquire = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="client-control-overview">
      <SEO 
        title="Enterprise Client OS Sandbox - Live Simulation Engine"
        description="Experience the speed, autonomy, and security of SamaXon's custom Client OS admin ecosystem. Real-time brand staging, booking capacity controls, lead capture webhooks, and edge telemetry."
        canonicalPath="/client-control"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-14 max-w-4xl border-b border-champagne-gold/15 pb-10">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9.5px] font-mono uppercase font-bold tracking-widest rounded-full flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-champagne-gold" />
            <span>Autonomous Admin Architecture • Live Sandbox</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-matte-black leading-[1.1]">
            Every High-Ticket Business Needs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-muted-gold to-champagne-gold">
              A Sovereign Client OS.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-warm-grey leading-relaxed max-w-2xl">
            A world-class digital storefront represents your stature. But you should never wait on developer billable hours for everyday marketing, inventory, and capacity adjustments. Experience our decoupled admin simulation in real time below.
          </p>
        </div>

        {/* --- LIVE ENTERPRISE CLIENT OS SANDBOX ENGINE --- */}
        <section className="mb-24" id="live-client-os-sandbox">
          <ClientControlSandbox />
        </section>

        {/* --- CORE ARCHITECTURAL PILLARS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-24" id="benefits-grid">
          {[
            {
              icon: Sparkles,
              wing: "Admin Wing 01",
              title: "Instant Copy & Campaign Staging",
              desc: "Toggle promo announcements, hero positioning, and campaign headlines with instantaneous 60 FPS live preview synchronization."
            },
            {
              icon: Zap,
              wing: "Admin Wing 02",
              title: "Edge Lead & Webhook Pipeline",
              desc: "Every incoming inquiry triggers real-time Telegram bot alerts and bi-directional CRM data sync in under 0.34s."
            },
            {
              icon: Cpu,
              wing: "Admin Wing 03",
              title: "Revenue & Dynamic Pricing",
              desc: "Fine-tune baseline service tiers, pricing thresholds, and dynamic urgency parameters without redeploying code."
            },
            {
              icon: Shield,
              wing: "Admin Wing 04",
              title: "1-Click Security & Maintenance",
              desc: "Engage frosted lock-screens and scheduled upgrade windows with complete data isolation and SHA-256 integrity."
            }
          ].map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={idx}
                className="bg-white/70 border border-champagne-gold/15 p-7 sm:p-8 rounded-3xl hover:border-champagne-gold transition-all duration-200 text-left flex flex-col justify-between shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9.5px] font-mono uppercase text-[#BFA15A] tracking-wider font-bold">
                      {benefit.wing}
                    </span>
                    <Icon className="w-4 h-4 text-champagne-gold" />
                  </div>
                  
                  <h3 className="font-display font-bold text-sm sm:text-base text-matte-black mb-2 uppercase tracking-wide">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-xs text-warm-grey leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
                <div className="h-0.5 bg-champagne-gold/20 w-1/4 mt-6" />
              </div>
            );
          })}
        </section>

        {/* --- BLUEPRINT ROADMAP INFO SEC --- */}
        <section className="bg-matte-black text-[#E5DBCF] rounded-[36px] sm:rounded-[44px] border border-champagne-gold/25 p-8 sm:p-14 text-left relative overflow-hidden shadow-2xl" id="framework-info">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none bg-champagne-gold" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-champagne-gold block font-bold">
              Engineering Foresight &amp; Scalability
            </span>
            
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-soft-ivory leading-tight">
              Phase 1: Public Stature. <br />
              Phase 2: Full Sovereign Autonomy.
            </h3>
            
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              We engineer clean database schemas, structural data bindings, and automated webhook pipelines on Day 1. This ensures your front-end launches in 48 hours to capture revenue immediately.
            </p>
            
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              When your operations scale, mounting our custom sovereign Client OS becomes a 24-hour drop-in module rather than an expensive multi-month overhaul. That is the luxury of engineering precision.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleInquire}
                id="secure-architecture-cta"
                className="px-8 py-4 bg-champagne-gold text-matte-black hover:bg-muted-gold font-bold uppercase tracking-wider text-xs rounded-full flex items-center justify-center gap-2 duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Secure 48-Hour Architecture</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

