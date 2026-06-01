import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Flame, ShieldAlert, Sparkles, Terminal, Award, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { EDGE_BULLETS } from '../data';

interface SamaXonEdgeProps {
  setCurrentPage?: (page: string) => void;
}

export default function SamaXonEdge({ setCurrentPage }: SamaXonEdgeProps) {
  const navigate = useNavigate();
  const handleInquire = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24" id="samaxon-edge-page">
      <SEO 
        title="The SamaXon Edge - Demo-First & 48H Process"
        description="We do not sell promises. We show direction. Read about our elite demo-first model, senior developer execution, and the 48-Hour Promise."
        canonicalPath="/edge"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-champagne-gold/15 pb-12">
          <div className="px-3.5 py-1.5 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-bold tracking-widest rounded-full">
            Elite Studio Advantage
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-matte-black leading-tight">
            We Do Not Sell Promises. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold to-muted-gold">
              We Show Direction.
            </span>
          </h1>
          <p className="text-base text-warm-grey leading-relaxed mt-2 max-w-2xl">
            SamaXon’s demo-first model is custom-engineered for serious business owners and ambitious founders who want solid proof of Speed, Visual Quality, and Execution Class before financial commitment.
          </p>
        </div>

        {/* --- MAIN VALUE PROPOSITION WINGS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24" id="edge-pillars">
          
          {/* Key Differentiators Stack */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-matte-black">
              Elite Differentiators
            </h2>
            
            <div className="space-y-6">
              {EDGE_BULLETS.map((bullet, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-white/60 border border-champagne-gold/15 rounded-3xl hover:border-champagne-gold transition-colors duration-200"
                >
                  <h3 className="font-display font-bold text-sm sm:text-base text-matte-black uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-champagne-gold" />
                    {bullet.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
                    {bullet.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Column Table comparative matrix */}
          <div className="lg:col-span-5 bg-matte-black text-soft-ivory rounded-[36px] p-8 border border-champagne-gold/25 gold-shadow text-left space-y-6 sticky top-24">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6 text-champagne-gold" />
              <span className="font-display text-xs tracking-widest uppercase text-soft-ivory font-bold">Standard vs SamaXon</span>
            </div>

            <div className="space-y-5 border-t border-champagne-gold/15 pt-5 text-left">
              
              {/* Comparative Row 1 */}
              <div className="pb-4 border-b border-champagne-gold/10">
                <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest font-bold">Visual Language</span>
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  <div>
                    <span className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      Others
                    </span>
                    <p className="text-[11px] text-warm-grey">Pre-made theme builders, overcrowded widgets, template look.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      SamaXon
                    </span>
                    <p className="text-[11px] text-[#E5DBCF] font-medium">Bespoke Soft UI structures, champagne gold alignments, pristine grids.</p>
                  </div>
                </div>
              </div>

              {/* Comparative Row 2 */}
              <div className="pb-4 border-b border-champagne-gold/10">
                <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest font-bold">Timeline Commitments</span>
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  <div>
                    <span className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      Others
                    </span>
                    <p className="text-[11px] text-warm-grey">3 to 6 weeks of back-and-forth mock proposals and unkept deadlines.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      SamaXon
                    </span>
                    <p className="text-[11px] text-[#E5DBCF] font-medium">Guaranteed live deployment staging link within 48 hours.</p>
                  </div>
                </div>
              </div>

              {/* Comparative Row 3 */}
              <div className="pb-2">
                <span className="text-[9px] font-mono uppercase text-champagne-gold tracking-widest font-bold">Client Handover</span>
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  <div>
                    <span className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      Others
                    </span>
                    <p className="text-[11px] text-warm-grey">Locked systems, need coders for basic text shifts, high recurring costs.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      SamaXon
                    </span>
                    <p className="text-[11px] text-[#E5DBCF] font-medium">Unrestricted content scaffolding prepared for Digital Remote Control.</p>
                  </div>
                </div>
              </div>

            </div>

            <button 
              onClick={handleInquire}
              className="w-full py-4 bg-champagne-gold hover:bg-muted-gold text-matte-black font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 duration-200 cursor-pointer"
            >
              Start Build (SamaXon Way)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* --- DEMO EXPLANATION DEEP BLOCK --- */}
        <section className="bg-white border border-champagne-gold/15 rounded-[40px] p-8 sm:p-12 text-left relative overflow-hidden" id="edge-culture-cta">
          <div className="max-w-3xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">
              Execution Integrity Guide
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-matte-black">
              See Before You Decide
            </h3>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              Traditional digital agencies expect business owners to sign bulk invoices based merely on oral narratives, fancy PDFs, or pre-made slide presentations. SamaXon believes action speaks louder. 
            </p>
            <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
              Our Design Studio will compile the main elements of your proposed website, landing flow, or logo monograph and render it within 24 hours. Once the supreme quality, visual weight, and loading efficiency align with your objectives, we activate the 48-Hour delivery sprint. This is absolute, risk-free integrity.
            </p>
            <div className="pt-2">
              <button
                onClick={handleInquire}
                className="px-8 py-3.5 bg-matte-black text-soft-ivory hover:text-champagne-gold hover:bg-charcoal font-bold uppercase tracking-widest text-[10px] rounded-full border border-champagne-gold/25 flex items-center gap-1.5 cursor-pointer"
              >
                Inquire For Staging Direction
                <ArrowRight className="w-3.5 h-3.5 text-champagne-gold" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
