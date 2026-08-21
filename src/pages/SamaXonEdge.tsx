import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldAlert, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { EDGE_BULLETS } from '../data';
import { useTheme } from '../context/ThemeContext';

interface SamaXonEdgeProps {
  setCurrentPage?: (page: string) => void;
}

export default function SamaXonEdge({ setCurrentPage }: SamaXonEdgeProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleInquire = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 transition-colors duration-300 font-sans" id="samaxon-edge-page">
      <SEO 
        title="The SamaXon Edge - Demo-First & 48H Process"
        description="We do not sell promises. We show direction. Read about our elite demo-first model, senior developer execution, and the 48-Hour Promise."
        canonicalPath="/edge"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-left flex flex-col items-start gap-4 mb-16 max-w-4xl border-b border-black/5 dark:border-white/5 pb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-[#D6B46A]'
              : 'bg-black/[0.03] border-black/10 text-[#BFA15A]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
            <span>Elite Studio Advantage</span>
          </div>

          <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-[#F5F5F7]' : 'text-[#1D1D1F]'
          }`}>
            We Do Not Sell Promises. <br />
            <span className="text-[#D6B46A]">We Show Direction.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl mt-1">
            SamaXon’s demo-first model is custom-engineered for serious business owners and ambitious founders who want solid proof of Speed, Visual Quality, and Execution Class before financial commitment.
          </p>
        </div>

        {/* --- MAIN VALUE PROPOSITION WINGS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24" id="edge-pillars">
          
          {/* Key Differentiators Stack */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#1D1D1F]'
            }`}>
              Elite Differentiators
            </h2>
            
            <div className="space-y-4">
              {EDGE_BULLETS.map((bullet, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark 
                      ? 'bg-[#121212] border-white/10 hover:border-[#D6B46A]/40' 
                      : 'bg-white border-black/10 hover:border-[#D6B46A]/50 shadow-sm'
                  }`}
                >
                  <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                    <span>{bullet.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                    {bullet.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Comparative matrix */}
          <div className={`lg:col-span-5 rounded-3xl p-7 sm:p-8 border text-left space-y-6 sticky top-24 transition-all ${
            isDark ? 'bg-[#121212] border-white/10 text-white' : 'bg-white border-black/10 text-[#1D1D1F] shadow-lg'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-[#D6B46A]" />
              <span className="font-display text-xs tracking-widest uppercase font-bold">Standard vs SamaXon</span>
            </div>

            <div className="space-y-4 border-t border-black/5 dark:border-white/5 pt-4 text-left">
              
              {/* Row 1 */}
              <div className="pb-3 border-b border-black/5 dark:border-white/5">
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">Visual Language</span>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div>
                    <span className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-500" />
                      Others
                    </span>
                    <p className="text-[11px] text-[#8E8E93] mt-0.5">Pre-made builders, generic widgets, template look.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 font-semibold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      SamaXon
                    </span>
                    <p className="text-[11px] font-medium mt-0.5">Bespoke soft UI structures, gold alignments, crisp layout.</p>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="pb-3 border-b border-black/5 dark:border-white/5">
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">Timeline Commitments</span>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div>
                    <span className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-500" />
                      Others
                    </span>
                    <p className="text-[11px] text-[#8E8E93] mt-0.5">3 to 6 weeks of back-and-forth and unkept deadlines.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 font-semibold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      SamaXon
                    </span>
                    <p className="text-[11px] font-medium mt-0.5">Guaranteed live deployment staging link in under 48 hours.</p>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="pb-1">
                <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest font-bold">Client Handover</span>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div>
                    <span className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-500" />
                      Others
                    </span>
                    <p className="text-[11px] text-[#8E8E93] mt-0.5">Locked systems, developers needed for text shifts.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 font-semibold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      SamaXon
                    </span>
                    <p className="text-[11px] font-medium mt-0.5">Unrestricted scaffolding prepared for Digital Remote Control.</p>
                  </div>
                </div>
              </div>

            </div>

            <button 
              onClick={handleInquire}
              className="w-full py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 duration-200 cursor-pointer shadow-md"
            >
              <span>Start Build (SamaXon Way)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* --- DEMO EXPLANATION DEEP BLOCK --- */}
        <section className={`border rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden transition-all ${
          isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10 shadow-lg'
        }`} id="edge-culture-cta">
          <div className="max-w-3xl space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
              Execution Integrity Guide
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              See Before You Decide
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
              Traditional digital agencies expect business owners to sign bulk invoices based merely on oral narratives, fancy PDFs, or pre-made slide presentations. SamaXon believes action speaks louder.
            </p>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
              Our Design Studio will compile the main elements of your proposed website, landing flow, or logo monograph and render it within 24 hours. Once the supreme quality, visual weight, and loading efficiency align with your objectives, we activate the 48-Hour delivery sprint. This is absolute, risk-free integrity.
            </p>
            <div className="pt-2">
              <button
                onClick={handleInquire}
                className="px-7 py-3 bg-[#D6B46A] hover:bg-[#BFA15A] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Inquire For Staging Direction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
