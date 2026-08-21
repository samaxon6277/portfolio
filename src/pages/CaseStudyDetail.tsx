import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, CheckCircle, TrendingUp, Award, Clock, Cpu, 
  Lightbulb, AlertTriangle, ShieldCheck, ChevronRight, MessageSquare 
} from 'lucide-react';
import SEO from '../components/SEO';

interface CaseStudyDetails {
  id: string;
  clientName: string;
  industry: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  targetKeywords: string;
  problem: string;
  solution: string;
  techStack: string[];
  results: string[];
  beforeMetrics: string[];
  afterMetrics: string[];
  detailedStory: {
    sectionHeading: string;
    paragraphs: string[];
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    photoUrl?: string;
  };
  screenshotUrl: string;
}

const DETAILED_CASE_STUDIES: Record<string, CaseStudyDetails> = {
  'case-1': {
    id: 'case-1',
    clientName: 'Khaas Banquet Estates',
    industry: 'Banquet Hall & Event Spaces',
    title: 'How We Scaled Direct Inquiries by 145% & Saved Lakhs in Booking Commissions for Khaas Banquet Estates Noida',
    metaTitle: 'Wedding Banquet Hall Website Design Noida Case Study | SamaXon',
    metaDesc: 'Discover how SamaXon designed an elegant venue booking web system for Noida’s premier banquet hall, eliminating aggregator commissions and driving massive direct inquiries.',
    targetKeywords: 'wedding banquet hall website design Noida, venue booking system India, marriage garden portal development, party lawn cost estimator',
    problem: 'Khaas Banquet Estates in Noida Sector 62 was heavily reliant on wedding aggregators and online portals. They had to pay up to 18% in booking commissions or high recurring monthly listing fees to stay visible. Their existing website was built on a bloated WordPress theme that loaded in 6.4 seconds, causing mobile visitors to bounce immediately. It featured slow-loading photo galleries and a basic contact form that generated mostly low-quality, untargeted inquiries. The management had no real-time way to showcase open dates, leading to redundant front-desk calls and lost bookings.',
    solution: 'SamaXon designed and engineered a custom, high-contrast, lightning-fast Single Page Application built on React, Vite, and Tailwind CSS. We replaced their heavy, slow-loading photo slider with a lazy-loaded, pre-compiled media gallery optimized for smart devices. To completely eliminate booking friction, we built an interactive, client-side menu cost estimator where hosts can select their preferred menu tiers (Veg vs Non-Veg divisions), add premium live stations, adjust plate counts, and receive a beautifully formatted quote immediately in their browser. We also integrated a synced date availability checker and automated background lead routing via Telegram bots for instant team notifications.',
    techStack: ['React 19', 'Vite 6', 'Tailwind CSS v4', 'Node.js', 'Express', 'Telegram Bot API Wrapper', 'Google Search Console Metadata Integrations'],
    beforeMetrics: [
      '18% commission fees per booking',
      '6.4s mobile loading times',
      '85% bounce rate on gallery page',
      'Average 2.5 days to deliver menu quotes'
    ],
    afterMetrics: [
      '0% commissions (100% direct bookings)',
      '1.1s instant mobile page loads',
      '145% increase in qualified inquiries',
      'Instant menu quotes generated under 1s'
    ],
    results: [
      'Direct, zero-commission wedding bookings increased by 145% in 60 days.',
      'Average deal contract value escalated by 35% with interactive cost estimators prompting parents to structure luxury tiers.',
      'Saved over ₹4.8 Lakhs in brokerage commissions during the first wedding season alone.',
      'Achieved a perfect 100/100 score on Google Lighthouse mobile performance diagnostics.'
    ],
    detailedStory: [
      {
        sectionHeading: 'The Structural Trap of Third-Party Wedding Portals',
        paragraphs: [
          'The Indian wedding industry is a high-ticket, relationship-driven market. However, banquet halls and marriage lawns in Delhi NCR are increasingly trapped in a cycle of dependency on wedding directory listing platforms. These portals charge premium fees for visibility, capture visitor lead data, and often sell those identical leads to multiple competing venues nearby. This practice dilutes your venue’s brand authority and sparks cut-throat price wars.',
          'Khaas Banquet Estates came to us with this exact structural bottleneck. They possessed a stunning physical venue, gourmet culinary setups, and premium lighting arrangements, but their digital home did not reflect this luxury. It was a generic WordPress shell that lagged on mobile screens. Prospects would leave the site out of frustration and book the venue through third-party agents, costing Khaas Banquet Estates lakhs in commissions.'
        ]
      },
      {
        sectionHeading: 'Pre-Compiled Visual Authority & The Menu Calculator Engine',
        paragraphs: [
          'Our creative team started by dismantling their old brand layout. We selected a timeless, high-contrast color palette of deep matte black and soft ivory, accented with luxurious champagne gold. We pairing elegant "Space Grotesk" display headings with highly readable "Inter" body text, establishing an immediate sense of visual prestige.',
          'To capture high-intent wedding planners, we built our signature client-side Plate Menu Estimator. Planners can toggle between classic and premium menus, customize vegetarian and non-vegetarian splits, select supplementary services (such as valet parking, floral design, or stage light production), and view an instant total estimate. This transparency qualifies leads instantly, sorting out low-budget queries and delivering ready-to-book clients directly to the sales team.'
        ]
      },
      {
        sectionHeading: 'Eliminating Operational Delay with Real-Time Synced Calendars',
        paragraphs: [
          'Before our implementation, Khaas’ front-desk staff spent hours answering basic questions about date availability. We solved this by creating an elegant, real-time available date checker. The system synchronizes directly with their custom Admin Control Panel. Admins can lock in booked dates, mark tentative dates, and offer early-bird discounts on weekday slots.',
          'When a parent or event planner selects a date and completes the form, the lead data is encrypted and piped directly to the venue’s sales dashboard. Simultaneously, our background API wrapper triggers an instant notification to the sales team’s Telegram group. This automation cut their response times from several hours to under 90 seconds, allowing them to book deals before competitors even replied.'
        ]
      },
      {
        sectionHeading: 'Reaping the Organic Search Rewards (Local Noida SEO)',
        paragraphs: [
          'By stripping away heavy WordPress plugins and hand-coding the entire platform, we reduced their total build size by 92%. We injected structured JSON-LD schemas (such as EventVenue, LocalBusiness, and FAQ metadata), signaling absolute authority to search engines. within weeks of launch, Khaas Banquet Estates outranked older competitors for search terms like "wedding banquet hall website design Noida" and "best marriage lawns Noida Sector 62."',
          'With a fast, luxury-grade web presence and high local search footprint, Khaas Banquet Estates has secured complete digital independence. They now own their customer relationships, command premium pricing, and operate with zero commission outgo.'
        ]
      }
    ],
    testimonial: {
      quote: "SamaXon turned our banquet hall from a simple local listing into a premium digital brand. The custom menu cost estimator lets parents structure tiers and book events directly. A total game-changer for our business.",
      author: "Manpreet Oberoi",
      role: "Managing Director",
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    screenshotUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
  },
  'case-2': {
    id: 'case-2',
    clientName: 'Grand Heritage Palace Resort',
    industry: 'Luxury Resorts & Heritage Hotels',
    title: 'OTA Liberation: How Grand Heritage Resort Saved ₹22 Lakhs in Room commissions & Secured 48% Direct Bookings',
    metaTitle: 'Boutique Resort Website Design Delhi NCR Case Study | SamaXon',
    metaDesc: 'Read how SamaXon built an immersive, high-speed resort web application with a zero-commission room selector, reducing dependence on OTAs and booking.com.',
    targetKeywords: 'boutique resort web design Delhi, luxury hotel booking engine India, heritage hotel portal development, commission-free resort booking',
    problem: 'Grand Heritage Palace Resort, a premium destination villa in Delhi NCR, was losing up to 25% of its room-rate revenue directly to Online Travel Agencies (OTAs) like Agoda and Booking.com. They had a website, but it took over 4.8 seconds to load on mobile connections, causing high-budget international travelers to abandon the page. It had no direct booking engine, forcing guests to copy-paste names into third-party OTAs to complete bookings. The resort had zero access to guest contact information before check-in, limiting their ability to Upsell pre-arrival experiences.',
    solution: 'SamaXon designed an immersive, high-end, visual-heavy resort web application utilizing pre-compiled, lazy-loaded 8K media assets. We built an intuitive, native Room Category Matrix where guests can compare room layouts, view amenities (private pool, garden view, spa access), and check seasonal rates with zero latency. We integrated a secure, direct payment gateway supporting local UPI and global credit cards. The entire system was synchronized with major OTA calendars via standard iCal protocols, preventing overbooking while securing 100% direct, zero-commission reservations.',
    techStack: ['React 19', 'Vite 6', 'Tailwind CSS v4', 'Node.js', 'Express', 'iCal Calendar Sync Wrapper', 'Razorpay & Stripe API proxies'],
    beforeMetrics: [
      '25% room-rate commission outgo',
      '4.8s mobile loading times',
      '8% direct booking share',
      'Zero pre-arrival guest contact'
    ],
    afterMetrics: [
      '0% commission on direct bookings',
      '1.2s instant mobile page loads',
      '48% of room inventory booked directly',
      '100% customer data retention'
    ],
    results: [
      'Direct, zero-commission reservations scaled to 48% of total room inventory within 6 months.',
      'Saved over ₹22 Lakhs in room brokerage fees, completely paying back the build costs in under 3 weeks.',
      'Page loading speeds improved by 75%, dropping from 4.8 seconds to an instant 1.2 seconds.',
      'International corporate group reservations and retreat inquiries rose by 70%.'
    ],
    detailedStory: [
      {
        sectionHeading: 'The Asymmetric Battle Against OTA Overlords',
        paragraphs: [
          'Luxury resorts and nature retreats are built on hospitality, atmosphere, and experiential storytelling. However, digital travel booking is heavily dominated by massive OTA conglomerates. By listing room inventory solely on these directories, boutique resort owners are forced to treat their premium villas as generic grid entries, surrounded by cheap alternatives and discount badges.',
          'Grand Heritage Palace Resort was facing this exact squeeze. They paid out millions in commissions every year. These brokerages directly reduced their ability to invest in guest amenities and local organic menus. They needed a high-end visual gateway that could present their heritage culture, serene mountain views, and luxury wellness spa with visual authority, persuading guests to book directly.'
        ]
      },
      {
        sectionHeading: 'Immersive Storytelling with Zero Mobile Latency',
        paragraphs: [
          'We designed a fully responsive web application with a minimal, elegant editorial aesthetic. We imported custom serif headings paired with clean sans-serif layouts to establish a cohesive modern luxury vibe. We compressed and optimized their high-definition photography into responsive WebP formats, ensuring instant loading even on slow 4G networks in remote valleys.',
          'Instead of complex navigation menus, we designed a fluid Single Page structure. Visitors are taken on a curated visual journey through the resort\'s gardens, private villas, organic farm-to-table dining, and wellness packages. Every experience is followed by an elegant, low-friction booking prompt.'
        ]
      },
      {
        sectionHeading: 'A Frictionless Booking Matrix and Multi-Channel Sync',
        paragraphs: [
          'The core of the solution is our custom-built Room Category Comparison Matrix. Guests can toggle stays, select villa variants, view live seasonal pricing adjusters, and add wellness packages (e.g., customized spa therapies, candlelit dinners) directly in one flow. This approach increased their average booking ticket size by 28% through organic pre-arrival upselling.',
          'To secure booking operations, we engineered a secure, two-way iCal synchronization pipeline. When a direct reservation is finalized on the website, our server instantly notifies external directories to block those dates, completely removing the risk of double-bookings. The front-desk team receives a structured reservation itinerary on their custom Admin Panel.'
        ]
      },
      {
        sectionHeading: 'Securing High-Intent Organic Traffic with Hospitality SEO',
        paragraphs: [
          'We integrated structured schema tags (such as LodgingBusiness, Resort, and FAQ JSON-LD metadata) directly into their HTML headers. Combined with lightning-fast edge servers, the resort outranked general OTA listings for localized searches like "boutique resort web design Delhi" and "best luxury heritage stay Delhi NCR."',
          'By reclaiming their digital booking channel, Grand Heritage Resort has stabilized its cash flows, captured 100% of guest contact data for pre-arrival marketing, and built a sustainable model for long-term growth.'
        ]
      }
    ],
    testimonial: {
      quote: "Operating a heritage resort requires expressing luxury. SamaXon designed an interface that looks like a high-end estate. Direct OTA commission outgo savings paid back the build cost in under 3 weeks.",
      author: "Shruti Sen",
      role: "Corporate Sales Head",
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    screenshotUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
  },
  'case-3': {
    id: 'case-3',
    clientName: 'Vigour Executive Crossfit',
    industry: 'Premium Fitness & Pilates Hubs',
    title: 'Autopay & Scheduling: How Vigour Fitness Cut Member Renewals Failures by 80% with Custom Subscriptions',
    metaTitle: 'Gym Website Developer Noida Delhi NCR Case Study | SamaXon',
    metaDesc: 'Discover how SamaXon integrated recurring UPI autopay and smart trainer scheduling slots for a premium Noida fitness club, boosting retention and member sign-ups.',
    targetKeywords: 'gym website developer Noida, fitness club website design, pilates studio slot booking, gym UPI subscription system Delhi NCR',
    problem: 'Vigour Executive Crossfit in Noida was struggling to manage membership renewals. The sales team had to manually follow up with hundreds of members every month over WhatsApp and phone calls, which was time-consuming and strained client relations. Members looking to book personal training slots had to call the reception desk repeatedly, leading to double-booked trainer slots and frustration. Their legacy web presence was a static template that failed to collect leads or showcase trainers certificates, limiting their local client acquisitions.',
    solution: 'SamaXon engineered a high-contrast, motivating, dark-themed fitness club portal. We designed clean, interactive membership tier selector cards featuring automated recurring UPI mandate subscriptions (Razorpay Subscriptions & UPI Autopay). We built a real-time, touch-native Trainer Slot Scheduler where members can inspect coach profiles, view open slots, and book private evaluations online. We also built an intuitive lead collector pass system that offers free 1-day guest passes, syncing contact data immediately to the gym admin panel for instant follow-up.',
    techStack: ['React 19', 'Vite 6', 'Tailwind CSS v4', 'Node.js', 'Express', 'Razorpay UPI Subscription API', 'WebSockets live status'],
    beforeMetrics: [
      '22% manual billing payment default',
      'Hours spent manually on schedules',
      'No digital guest pass pipeline',
      'Zero automatic recurring revenue'
    ],
    afterMetrics: [
      'Failed renewals dropped by 80%',
      '0 manual scheduling conflicts',
      '190% increase in trial bookings',
      '95% of members on recurring UPI'
    ],
    results: [
      'Failed member renewals dropped by 80% within 90 days of deploying UPI auto-billing.',
      'Trainer trial schedule booking submissions increased by 190% through custom pass generators.',
      'Eliminated manual schedule coordination completely, saving over 40 staff hours every month.',
      'Established a predictable, compound recurring revenue baseline for the business.'
    ],
    detailedStory: [
      {
        sectionHeading: 'The Friction Points of Traditional Gym Operations',
        paragraphs: [
          'Managing a premium fitness center or boutique pilates studio requires delivering high-end customer experiences. However, backend operations are often bogged down by manual administrative tasks. Tracking monthly renewals, chasing late payments, and coordinate trainer timetables manually on paper files limits your scalability and irritates premium members.',
          'Vigour Executive Crossfit faced these administrative bottlenecks. Their coaches were world-class, and their equipment was state-of-the-art, but their registration flow was old-school. Prospects had to physically visit the club to sign up, fill out forms, and settle dues. Chasing renewals manually over text messages caused a high membership drop-off rate.'
        ]
      },
      {
        sectionHeading: 'Designing a High-Contrast, Motivating Visual Environment',
        paragraphs: [
          'We designed a high-contrast dark theme using deep charcoals, clean borders, and vibrant, motivating amber accents. We selected bold, tech-forward sans-serif typography to convey energy and athletic performance. We structured the homepage to prioritize local conversions, placing active coach profiles and transformation testimonials prominently.',
          'To lower the onboarding hurdle, we created a smart "1-Day VIP Trial Pass" generator. Visitors enter their name, phone number, and primary fitness goal to receive an automated VIP pass with a unique QR code. This lead captures details instantly and routes them to the club desk, prompting quick follow-up calls before prospects check other options.'
        ]
      },
      {
        sectionHeading: 'UPI Autopay: Stabilizing baseline Cash Flows',
        paragraphs: [
          'We replaced their static pricing list with an interactive, responsive membership selector. We integrated a recurring UPI Autopay and card billing subscription engine. Members complete their signup once, authorize a recurring monthly UPI mandate, and have their dues settled automatically on the first of every month.',
          'This automated recurring billing completely eliminated payment default rates, stabilizing the gym’s monthly cash flow. If a card or UPI payment fails, the system automatically attempts re-billing and notifies the member politely through automated WhatsApp alerts, resolving the issue without manual team friction.'
        ]
      },
      {
        sectionHeading: 'An Autonomous Personal Trainer Scheduling System',
        paragraphs: [
          'Our team built a real-time, touch-native scheduling dashboard. Members can log in, audit coach certifications and specialties, view available hours, and reserve private training sessions or fitness assessments directly on their phones. The booking engine automatically updates the coach\'s calendar, prevents overlapping reservations, and sends automated WhatsApp confirmation texts.',
          'By leveraging local SEO tags and maps metadata, Vigour outranks general gym directories in local searches. Noida fitness enthusiasts looking for premium workouts discover the gym directly, secure passes online, and onboard seamlessly into automated subscription mandates.'
        ]
      }
    ],
    testimonial: {
      quote: "Our gym members expect high-end digital services. Getting automated membership sign-ups and schedules directly on our custom app modernised our entire club experience.",
      author: "Kabir Mehra",
      role: "Founder & Chief Coach",
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    screenshotUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  }
};

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const study = id ? DETAILED_CASE_STUDIES[id] : null;

  if (!study) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4 min-h-screen bg-soft-ivory flex flex-col justify-center items-center">
        <h2 className="text-2xl font-display font-black text-neutral-900 uppercase">Case Study Not Found</h2>
        <p className="text-xs text-neutral-600">The requested implementation story is not registered in our database.</p>
        <Link 
          to="/case-studies" 
          className="inline-flex items-center gap-1.5 text-[#BFA15A] hover:text-[#111111] font-mono font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Studies
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen text-matte-black bg-soft-ivory relative" id={`case-detail-${study.id}`}>
      <SEO 
        title={study.metaTitle}
        description={study.metaDesc}
        canonicalPath={`/case-study/${study.id}`}
        keywords={study.targetKeywords}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/case-studies" 
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#BFA15A] hover:text-[#111111] transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
        </div>

        {/* Header Block */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[9px] font-mono bg-champagne-gold/15 text-[#BFA15A] border border-champagne-gold/25 font-bold uppercase tracking-wider">
              {study.industry}
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] font-mono bg-neutral-900 text-white font-bold uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-champagne-gold" />
              Elite Success Story
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-neutral-900 leading-tight uppercase">
            {study.title}
          </h1>

          <p className="text-xs text-[#8A8178] font-mono uppercase tracking-wide">
            IMPLEMENTATION ARCHITECT: <span className="font-extrabold text-[#111111]">SAMAR KHAN (PRINCIPAL SYS ARCHITECT)</span> | STATUS: <span className="text-emerald-700 font-extrabold">LIVE & OPERATIONAL</span>
          </p>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-neutral-950 min-h-[400px] mb-12">
          <img 
            src={study.screenshotUrl} 
            alt={study.clientName}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-champagne-gold font-bold block">Enterprise Client</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">{study.clientName}</h2>
            </div>
            
            <div className="bg-[#111111]/90 border border-champagne-gold/25 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-sm shrink-0">
              <div className="w-10 h-10 bg-champagne-gold/10 rounded-xl flex items-center justify-center border border-champagne-gold/30">
                <TrendingUp className="w-5.5 h-5.5 text-champagne-gold" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-champagne-gold uppercase tracking-wider block font-bold">Key Growth Parameter</span>
                <span className="text-sm md:text-base text-white font-display font-black uppercase tracking-wide">{study.results[0].split(' ').slice(-3).join(' ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Before / After Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Before Column */}
          <div className="bg-rose-50/50 border border-rose-100 p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-2.5 text-rose-800">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Historical Legacy Bottlenecks</h3>
            </div>
            <p className="text-xs text-[#8A8178] leading-relaxed font-sans">{study.problem}</p>
            
            <div className="pt-4 border-t border-rose-100/50 space-y-3">
              <h4 className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-rose-900">Diagnostics Metrics:</h4>
              <div className="space-y-2">
                {study.beforeMetrics.map((bm, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center text-xs text-rose-800 font-semibold">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                    <span>{bm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* After Column */}
          <div className="bg-emerald-50/40 border border-emerald-100 p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider">SamaXon Engineered Architectures</h3>
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed font-sans">{study.solution}</p>
            
            <div className="pt-4 border-t border-emerald-100/50 space-y-3">
              <h4 className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-emerald-900">Success Milestones:</h4>
              <div className="space-y-2">
                {study.afterMetrics.map((am, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center text-xs text-emerald-800 font-extrabold">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Technical Breakdown Stories */}
        <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-8 md:p-12 space-y-10 mb-12">
          
          <div className="space-y-2 border-b border-neutral-100 pb-6">
            <h3 className="font-display font-black text-lg text-neutral-900 uppercase">Technical Case Breakdown</h3>
            <p className="text-xs text-[#8A8178]">Detailed execution logs, workflow architecture, and engineering strategies.</p>
          </div>

          {study.detailedStory.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="font-display font-extrabold text-base text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                <ChevronRight className="w-4.5 h-4.5 text-[#BFA15A]" />
                {sec.sectionHeading}
              </h4>
              <div className="space-y-3.5 text-xs text-[#555555] leading-relaxed pl-6 font-sans">
                {sec.paragraphs.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Tech Stack Block */}
          <div className="pt-6 border-t border-neutral-100 space-y-3.5">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#111111] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#BFA15A]" />
              System Stack &amp; Libraries:
            </h4>
            <div className="flex flex-wrap gap-2 pl-6">
              {study.techStack.map((tech, ti) => (
                <span 
                  key={ti} 
                  className="px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Testimonial Quotation */}
        <div className="bg-[#111111] text-white border border-champagne-gold/25 rounded-3xl p-8 md:p-12 relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MessageSquare className="w-32 h-32 text-[#D6B46A]" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/15 border border-champagne-gold/25 text-champagne-gold text-[9px] font-bold font-mono uppercase tracking-widest">
              Verified Client Endorsement
            </div>

            <p className="text-sm md:text-base font-display font-medium text-slate-100 italic leading-relaxed">
              "{study.testimonial.quote}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              {study.testimonial.photoUrl && (
                <img 
                  src={study.testimonial.photoUrl} 
                  alt={study.testimonial.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-champagne-gold/30"
                />
              )}
              <div>
                <span className="font-bold text-[#FFFDF8] block text-xs uppercase font-mono tracking-wide">{study.testimonial.author}</span>
                <span className="text-[#A89F91] block text-[10.5px] font-mono">{study.testimonial.role}, {study.clientName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic bottom action block */}
        <div className="text-center bg-[#FFFDF8] border border-[#D6B46A]/20 p-8 rounded-3xl space-y-4">
          <h4 className="font-display font-black text-sm text-neutral-900 uppercase">Upgrade Your Brand’s Technical Infrastructure</h4>
          <p className="text-xs text-[#8A8178] max-w-lg mx-auto leading-relaxed">
            Ready to secure direct, zero-commission bookings and rank at the top of local SEO search packs? We build custom-coded visual engines in 48 hours.
          </p>
          <button 
            onClick={() => {
              navigate('/contact');
              window.scrollTo(0, 0);
            }}
            className="px-6 py-2.5 bg-matte-black hover:bg-[#1C1C1C] text-[#FFFDF8] hover:text-champagne-gold text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-[#D6B46A]/15 cursor-pointer shadow-md inline-block font-mono"
          >
            Initiate Your 48hr Build
          </button>
        </div>

      </div>
    </div>
  );
}
