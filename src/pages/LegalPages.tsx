import SEO from '../components/SEO';

interface LegalPagesProps {
  type: 'privacy' | 'terms' | 'refund';
}

export default function LegalPages({ type }: LegalPagesProps) {
  return (
    <div className="bg-soft-ivory min-h-screen pt-32 pb-24 text-left font-sans" id={`legal-page-${type}`}>
      
      {type === 'privacy' && (
        <>
          <SEO 
            title="Privacy Compliance Covenants"
            description="Isolating client particulars. Review how SamaXon secures project parameters and Lead data."
            canonicalPath="/privacy"
          />
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="border-b border-champagne-gold/15 pb-6">
              <span className="text-[10px] font-mono text-[#BFA15A] tracking-wider uppercase font-bold block">Compliance &amp; Security</span>
              <h1 className="font-display text-3xl font-bold text-matte-black mt-2 uppercase tracking-wide">Privacy Policy</h1>
              <p className="text-xs text-warm-grey mt-1">Last Updated: May 23, 2026 · Compiled by Senior Compliance Wing</p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-charcoal leading-relaxed">
              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">1. Information Accumulation Architecture</h3>
                <p>
                  SamaXon operates secure client onboarding touchpoints. We capture specified input variables (Inquiry particulars, career responses, target investment brackets, and project briefs) provided freely by user intents. This record logging remains isolated on verified offline states and local storage frameworks.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">2. Storage Safeguards &amp; Confidentiality</h3>
                <p>
                  We compile your organizational goals and customer inquiries exclusively to map out design templates and custom webhook directions. These lists are protected from external index crawlers, third-party sales clusters, and tracking aggregators. SamaXon operates under strict NDA parameters from client onboarding day.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">3. Cookies &amp; Frame Containment</h3>
                <p>
                  Our public assets use technical local caching structures to establish high responsiveness during page navigation. We do not operate tracking beacons or user-profile tracking.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">4. Regulatory Rectification</h3>
                <p>
                  For any requests regarding removing your submitted inquiry parameter logs or applicant items, contact our Senior engineering team at <strong>build@samaxon.pro</strong>.
                </p>
              </section>
            </div>
          </div>
        </>
      )}

      {type === 'terms' && (
        <>
          <SEO 
            title="SamaXon Operational Covenants"
            description="Our service boundaries. Review project milestone deliverables and 48-Hour delivery parameters."
            canonicalPath="/terms"
          />
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="border-b border-champagne-gold/15 pb-6">
              <span className="text-[10px] font-mono text-[#BFA15A] tracking-wider uppercase font-bold block">Code of Operations</span>
              <h1 className="font-display text-3xl font-bold text-matte-black mt-2 uppercase tracking-wide">Terms &amp; Conditions</h1>
              <p className="text-xs text-warm-grey mt-1">Last Updated: May 23, 2026 · Compiled by Senior Compliance Wing</p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-charcoal leading-relaxed">
              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">1. Ground Rules of Staging Actions</h3>
                <p>
                  By accessing the SamaXon digital studio layout and testing our administrative simulator sandbox, you acknowledge and agree to respect our trade monograph styles, custom Champagne gold grids, and proprietary component architectures.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">2. Scope Boundaries of the 48-Hour Delivery Promise</h3>
                <p>
                  SamaXon's legendary 48-hour delivery commitment is strictly bounded by active client cooperation. The sprint stopwatch initiates the moment (1) the visual layout template is finalized, and (2) all core copy and logo content are securely delivered by the client to our Developer Wing. Complexity shifts or secondary widget requests override the standard speed rules.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">3. Proprietary Design Mechanics</h3>
                <p>
                  The custom visual layouts, champagne gradients, floating interface containers, and interactive scripts constructed by SamaXon Design Studio remain under exclusive trade protections until all development balances are resolved.
                </p>
              </section>
            </div>
          </div>
        </>
      )}

      {type === 'refund' && (
        <>
          <SEO 
            title="Refund &amp; Project Fulfillment Policy"
            description="Project insurance. Read our guaranteed staging directives and refund policy criteria."
            canonicalPath="/refund"
          />
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="border-b border-champagne-gold/15 pb-6">
              <span className="text-[10px] font-mono text-[#BFA15A] tracking-wider uppercase font-bold block">Accountable Execution</span>
              <h1 className="font-display text-3xl font-bold text-matte-black mt-2 uppercase tracking-wide">Refund &amp; Project Policy</h1>
              <p className="text-xs text-warm-grey mt-1">Last Updated: May 23, 2026 · Compiled by Senior Compliance Wing</p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-charcoal leading-relaxed">
              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">1. Staged Execution Insurance</h3>
                <p>
                  SamaXon operates a demo-first execution model to protect Indian founders from blind investments. We show visual blueprints and layout navigation paths before requesting primary invoice payouts. Because of this extreme transparency, both groups are completely aligned before major work commences.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">2. Performance &amp; Technical Compliance</h3>
                <p>
                  We guarantee absolute compliance with the visual screens approved during onboarding. If the live staging asset fails our confirmed loading speed tests (Lighthouse Speed &lt; 90 on mobile setups) or displays layout inconsistencies that our Developer Wing cannot optimize within 72 hours, we will immediately process a full reversal of the staging setup fee.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-matte-black text-sm uppercase">3. Project Changes &amp; Delays</h3>
                <p>
                  If a client requests major structural modifications from the agreed plan mid-sprint, our 48-Hour delivery guarantee becomes void. We will calculate a revised timeline reflecting the new deliverables.
                </p>
              </section>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
