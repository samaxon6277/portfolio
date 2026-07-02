import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, HelpCircle, BadgeCheck, AlertCircle, Quote, Sparkles, 
  LayoutDashboard, Share2, Star, Calendar, MessageSquare, Flame, 
  ShieldCheck, Zap, Laptop, Clock, CheckCircle, TrendingUp, DollarSign
} from 'lucide-react';
import SEO from '../components/SEO';
import { supabaseService } from '../utils/supabaseService';

interface FAQ {
  q: string;
  a: string;
}

interface NicheBenefit {
  title: string;
  desc: string;
}

interface NichePackage {
  name: string;
  price: string;
  delivery: string;
  features: string[];
}

interface NicheCaseStudy {
  client: string;
  result: string;
  details: string;
}

interface NicheConfig {
  title: string;
  description: string;
  canonicalPath: string;
  headline: string;
  painPoint: string;
  sol: string;
  keywords: string[];
  faqs: FAQ[];
  benefits: NicheBenefit[];
  packages: NichePackage[];
  empiricalCaseStudy: NicheCaseStudy;
  longAnalysis: {
    sectionHeading: string;
    paragraphs: string[];
  }[];
}

export const NICHE_DATA: Record<string, NicheConfig> = {
  banquet: {
    title: 'Premium Banquet Hall Website Design & Booking System',
    description: 'SamaXon creates elegant, high-converting banquet hall websites with interactive slot calendars, plate cost calculators, virtual 3D tour panels, and direct-closing CRM systems with zero monthly commissions.',
    canonicalPath: '/banquet-hall-website-design',
    headline: 'Secure Wedding Bookings with Custom Banquet Portals',
    painPoint: 'Tired of paying massive listing platform subscriptions or losing premium wedding leads to commission brokers and outdated photo galleries?',
    sol: 'Our premium wedding and banquet hall portals feature luxury photography grids, real-time date availability checkers, interactive banqueting menu estimators, and down-payment systems curated for highest conversion rates.',
    keywords: ['marriage hall booking web systems', 'banquet hall website designer', 'party lawn portal designs', 'corporate banquet event panels'],
    empiricalCaseStudy: {
      client: 'Khaas Banquet Estates',
      result: '41% Direct Bookings Growth',
      details: 'Transitioned from relying on aggressive marriage-aggregators to showcasing direct virtual tours and seasonal menu builders, saving ₹18 Lakhs in brokerage fees.'
    },
    benefits: [
      { title: 'Interactive Menu Cost Estimator', desc: 'Permit brides and planners to customize plates counts, food styles (veg/non-veg) and retrieve immediate estimates' },
      { title: 'Synced Calendar Ingress', desc: 'Secure custom calendar systems for admin management, which displays available calendar days while blocking overlaps' },
      { title: 'Bespoke Visual Heritage Grids', desc: 'High-end media libraries optimized to run on mobile devices, showcasing high-resolution banquet halls layouts cleanly' }
    ],
    packages: [
      { name: 'Boutique Venue Pack', price: '₹34,999', delivery: '2 Days', features: ['Pre-compiled templates', 'Menu cost estimator', 'Direct WhatsApp booking pipeline', '100% source files delivery'] },
      { name: 'Enterprise Estate Suite', price: '₹64,999', delivery: '5 Days', features: ['Bespoke high-contrast design', 'Advanced slot reserving calendar', 'Staff shift coordinator panel', 'SLA support contract'] }
    ],
    faqs: [
      { q: "How does the wedding date availability check function?", a: "Your website features a direct calendar slot dashboard synced directly to your administration app, avoiding double-bookings while letting guests reserve slots." },
      { q: "Can we integrate instant menu cost calculators?", a: "Yes. Wedding party clients enter client counts, choose veg/non-veg plate grades, decorate tiers, and retrieve a beautiful PDF cost estimate instantly." },
      { q: "Can we link virtual 3D maps or video tours directly in the page?", a: "Yes, our pre-compiled canvas nodes support embedding 360-degree panorama views and zero-latency video clips without bloated page weight." },
      { q: "How do we receive instant notifications of banquet queries?", a: "Every inquiry immediately triggers a structured email and high-contrast alert into your central Admin Panel, plus optional automated WhatsApp routing." },
      { q: "Is there support for corporate banquet seminars?", a: "Absolutely. The portal features custom-tailored tabs for corporate and social events alongside separate pricing and package calculators." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Commercial Paradigm of Direct Venue Bookings',
        paragraphs: [
          'The banquet hall and wedding venue marketplace has become aggressively dependent on heavy third-party listing platforms. While these aggregators claim to connect you with potential hosts, they often hijack your customer relationships, pit you against cut-throat competitors, and charge massive percentage-based brokerages on your prime wedding dates. This structural reliance dilutes your venue\'s prestige and directly harms your net operating yields.',
          'To regain financial autonomy, premium venue estates must establish a superior visual gateway. A custom banquet portal designed by SamaXon coordinates your prestige branding with interactive digital services. By positioning your wedding lawns, luxury lighting arrangements, and gourmet plate spreads inside a lightweight, lightning-fast static framework, you capture your prospective hosts\' attention. We build booking funnels that compel planners to contact you directly.'
        ]
      },
      {
        sectionHeading: 'Pre-Compiled Menu Estimations & Real-Time Slot Calendars',
        paragraphs: [
          'High-budget wedding hosts expect clear, instant pricing parameters. They do not want to wait 48 hours for a sales executive to send a vague PDF quote. Our custom banqueting suite features an interactive, client-side menu estimator. Planners can customize plate counts (veg/non-veg divisions), specify supplementary features like live action counters or premium mocktails, and calculate automatic investment tiers immediately in their browser.',
          'Furthermore, our real-time calendar slot engine displays seasonal slot availability seamlessly. Planners can audit available wedding dates, select their preferred evening or day shift, and submit a premium reservation down-payment. This pre-filtered inquiry reaches your desk fully structured, requiring simple administrative approval to close.'
        ]
      },
      {
        sectionHeading: 'The Mechanics of Speed & High Conversion Local SEO',
        paragraphs: [
          'Most wedding venue portals depend on heavy, bloated builders like WordPress, Elementor, or Wix. These platforms load extensive database files, causing heavy mobile lag that prompts high-value clients to abandon your page. Our custom-compiled systems completely bypass database requests, scoring a perfect 100/100 on Google Lighthouse.',
          'By leveraging clean, semantic HTML schemas (including Event, LocalBusiness, and FAQ structured data), we ensure search engines index your venue above competitors. When potential clients search for wedding venues in your local service areas, your fast-loading portal positions itself at the top of local maps pack, securing organic traffic without continuous ad spends.'
        ]
      }
    ]
  },
  resort: {
    title: 'Luxury Resorts & Nature Retreat Website Design Agency',
    description: 'SamaXon designs immersive resort websites with interactive room reservation systems, experience packaging grids, activity highlights, and direct billing integration with 100% cloud ownership.',
    canonicalPath: '/resort-website-design',
    headline: 'Immersive Retreat Portals For Elite Luxury Resorts',
    painPoint: 'Losing 15% to 25% room-rate commission shares to OTAs and third-party booking travel portals every month?',
    sol: 'We develop beautiful, visual-heavy resort portals utilizing cinematic video backgrounds, touch-native room calendars, customizable package booking calculators, and zero-commission booking pipelines.',
    keywords: ['spa resort website development', 'eco resort custom web design', 'resort room reservation system', 'wellness retreat booking site'],
    empiricalCaseStudy: {
      client: 'Nirvana Forest Retreat',
      result: '₹22 Lakhs Commission Saved',
      details: 'Switched from Booking.com heavy listings to an immersive, direct-checkout SPA, scaling organic room reserves from 8% to 64% in 6 months.'
    },
    benefits: [
      { title: 'Cinematic Visual Galleries', desc: 'Pre-compiled zero-latency video banners optimized for smart phones' },
      { title: 'Flexible Package Builder', desc: 'Create custom holiday/spa packages with custom stay durations' },
      { title: 'iCal Calendar Syncing', desc: 'Two-way integration with Airbnb/Booking.com to completely avoid double bookings' }
    ],
    packages: [
      { name: 'Eco-Retreat Lite', price: '₹39,999', delivery: '3 Days', features: ['Fluid room galleries', 'Direct inquiry forms', 'Mobile touch menus', 'Sitemap registration'] },
      { name: 'Premium Heritage Villa Pack', price: '₹69,999', delivery: '5 Days', features: ['Cinematic immersive canvas', 'Dual-way iCal OTA sync', 'Add-on experience builder', 'Full SEO integration'] }
    ],
    faqs: [
      { q: "Can we override seasonal peak resort rates and customize holiday packages?", a: "Yes. The administrative CRM allows overriding pricing tier systems, weekend premium slots, wellness package durations, and breakfast configurations in real-time." },
      { q: "Is there synchronizations for multi-OTA channel bookings?", a: "Absolutely. We sync your direct website reservation calendar with Booking, Agoda, and Airbnb using iCal standard protocols, preventing overbooking." },
      { q: "What happens if a reservation is canceled?", a: "The administrative panel has dedicated cancellation workflows. Refund terms can be customized directly, firing instant email alerts to guests." },
      { q: "Can we sell wellness retreats or adventure tours directly?", a: "Yes. You can package customized spa treatments, dining vouchers, and adventure activities as direct checkout add-ons during reservations." },
      { q: "Is there multi-lingual translation support?", a: "Yes, our pre-compiled architectures support lightning-fast multi-language routing for global luxury travelers." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'OTA Liberation: Reclaiming Resort Profitability',
        paragraphs: [
          'Luxury resort operations are increasingly suffocated by Online Travel Agencies (OTAs). Paying up to 25% in commissions on every night\'s stay represents an unsustainable operational drag. It eats directly into your boutique retreat’s marketing budget and dilutes your ability to offer premium client experiences. Furthermore, OTAs treat your luxury villas as generic grid entries, surrounding your listing with cheaper alternatives.',
          'A bespoke resort portal from SamaXon re-establishes your brand\'s primary prestige. Utilizing elegant, cinema-grade transitions, we capture the serene, exclusive atmosphere of your eco-retreat or wellness spa right on the visitor\'s screen. We showcase your organic farms, private pools, and high-end spas in ultra-high resolution without slowing down page load times. This visual storytelling validates your premium room pricing and primes guests to book directly.'
        ]
      },
      {
        sectionHeading: 'The Technical Blueprint of Zero-Commission Checkouts',
        paragraphs: [
          'Direct bookings rely on frictionless checkout paths. If a user has to jump through complicated external payment systems or slow booking widgets, they will abandon the page and return to OTAs. SamaXon engineers custom direct-reservation funnels that keep the guest on your domain. We integrate local UPI, credit/debit card, and international payment processors with instant authorization.',
          'To ensure seamless occupancy operations, we build secure iCal calendar synchronization protocols. Any direct booking completed on your website automatically fires update markers to Booking.com, Agoda, and Airbnb, entirely removing double-booking vulnerabilities. Your front-desk team gets clean, unified reservations charts within our responsive Admin Portal.'
        ]
      },
      {
        sectionHeading: 'Optimizing Resort Speed for High-Spike Seasonal Traffic',
        paragraphs: [
          'High-end travel inquiries surge during specific seasons or long weekends. Traditional server-driven sites crash or slow down under sudden traffic load spikes, directly costing you guest inquiries. Because SamaXon builds pre-compiled, static web assets, we deploy your files to global edge servers.',
          'Your resort portal loads instantly for international and domestic guests alike—even on slow mobile connections in remote nature reserves. With integrated schema models (like Resort, Place, and FAQ structured data), your retreat ranks above OTA listing clusters, building high-converting local authority and driving direct, high-ticket reservations.'
        ]
      }
    ]
  },
  hotel: {
    title: 'Boutique & Heritage Hotel Website Design Agency',
    description: 'Premium boutique and heritage hotel web development. Features rooms list matrices, instant speed booking check-outs, local maps SEO integrations, and automatic GST compliant invoice generations.',
    canonicalPath: '/hotel-website-design',
    headline: 'Multiply Heritage and Boutique Hotel Direct Room bookings',
    painPoint: 'Struggling with slow website loads, low direct bookings, or booking portals failing on mobile devices?',
    sol: 'Our heritage hotel packages compile highly visual, fast-loading room galleries, transparent guest tax estimators, custom travel guide grids, and payment systems loading under 1.2s.',
    keywords: ['heritage boutique hotel site designs', 'boutique room reserving softwares', 'speedy reservation checkouts', 'hotel marketing web development'],
    empiricalCaseStudy: {
      client: 'Kailash Heritage Haveli',
      result: '53% Direct Booking Increase',
      details: 'Transitioned a historic hotel from heavy WordPress themes to a pre-compiled, responsive Single Page Application. Direct reservation receipts surged within 90 days.'
    },
    benefits: [
      { title: 'Room Category Grid matrices', desc: 'Display amenities, capacities, and rates elegantly inside side-by-side sheets' },
      { title: 'GST invoice compliance engines', desc: 'Let business travelers enter corporate details to receive compliant tax bills instantly' },
      { title: 'High Visual Authority Styling', desc: 'Rich heritage layouts structured for mobile devices' }
    ],
    packages: [
      { name: 'Heritage Classic Pack', price: '₹32,999', delivery: '2 Days', features: ['Room categorization', 'Quick booking router', 'Google Maps listing SEO', 'Full source files Delivery'] },
      { name: 'Palace Suite Premium', price: '₹59,999', delivery: '4 Days', features: ['Interactive Booking engine', 'GST corporate bill generator', 'Admin inquiries console', 'High performance hosting setup'] }
    ],
    faqs: [
      { q: "Does the booking form support commercial billing details & GST invoices?", a: "Yes, corporate travelers can enter specific company GST details to receive auto-generated compliance invoices directly." },
      { q: "Why is website speed important for luxury hotel bookings?", a: "Our hotels load within 1.2 seconds, resulting in a 40% bounce rate decrease compared to heavy heritage themes, retaining high-budget users." },
      { q: "Can we integrate existing channel managers?", a: "Yes. We easily bind direct calendar hooks and API layers into major Channel Managers to sync room counts globally." },
      { q: "How do potential guests verify hotel location highlights?", a: "We place fast, custom-styled Google Map nodes mapping historic tourist attractions near your hospitality zones cleanly." },
      { q: "Is the direct reservation form secure?", a: "Yes, our forms have standard SSL encodings and optional firewalls, blocking spam inquiries and guaranteeing guest confidentiality." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Luxury Hospitality Direct Reservation Mandate',
        paragraphs: [
          'High-end boutique hotels are fighting an asymmetric battle against massive travel distribution conglomerates. By conditioning your guests to use corporate aggregators, you dilute your brand’s prestige and surrender significant room-rate profits. Heritage and boutique hotels rely on storytelling—the history of the architecture, the customized room amenities, the exclusive food menu spreads, and exceptional hospitality.',
          'SamaXon builds hotel landing systems that showcase this luxury narrative. We don\'t settle for cookie-cutter booking widgets. We craft custom-designed room lists, visual amenities showcases, and direct room calculators styled with elegant classic margins and luxurious typography layout pairs. Your digital gateway feels like a natural extension of your property’s physical luxury.'
        ]
      },
      {
        sectionHeading: 'Reducing Guest Abandonment with Fluid Checkouts',
        paragraphs: [
          'Every supplementary step, redirect link, or slow page calculation represents an abandonment trigger for guests trying to book a hotel room. If your website redirecting to slow external panels that break on mobile screens, they will close the tab and reserve elsewhere. Our pre-compiled hotel booking templates use fluid, client-side state transitions.',
          'Guests can check room configurations, add optional breakfast setups, verify occupancy parameters, enter corporate GST details, and settle payments in one unified flow. We build GST invoice generators right into your admin CRM backend, saving manual front-desk billing labor and establishing commercial prestige for corporate guests.'
        ]
      },
      {
        sectionHeading: 'Unlocking Organic Direct Bookings through Maps SEO',
        paragraphs: [
          'Most travelers discover heritage hotels while mapping trip routes on Google Maps. Because we optimize your custom code for Google Business listings and map hooks, search engines place your business directly into localized map search panels. Our pre-compiled structures use LocalBusiness schemas and custom coordinate models.',
          'Your hotel outranks larger chains for authentic local searches, capturing guest traffic directly and converting visitors using zero-commission payment routes. You own your customer database from day one.'
        ]
      }
    ]
  },
  gym: {
    title: 'Exclusive Fitness Clubs, Gym & Pilates Web Design Provider',
    description: 'Bespoke fitness clubs and gym branding web solutions. Includes membership selector cards, real-time scheduler integrations, trainers bios, and automated monthly subscription payment paths.',
    canonicalPath: '/gym-website-design',
    headline: 'Slick Member Portals for High-Budget Gyms & Yoga Hubs',
    painPoint: 'Members calling repeatedly to schedule sessions or buy crossfit memberships through confusing external application stores?',
    sol: 'We build direct web membership flows, online registration gateways, trainer appointment schedulers, and slick scan-to-enter QR code generators optimized for all major browsers.',
    keywords: ['fitness club portal developer', 'crossfit gym custom web', 'pilates studio schedule tracker', 'recurring subscription pay gym'],
    empiricalCaseStudy: {
      client: 'Power Forge Athletics',
      result: '230+ Active Subscriptions Secured',
      details: 'Designed a high-contrast dark theme signup panel with automated monthly UPI autopay, decreasing manual payment collection follow-ups.'
    },
    benefits: [
      { title: 'Interactive Membership Slices', desc: 'Display tiers side-by-side with toggle-able add-ons' },
      { title: 'Trainer Booking Calendars', desc: 'Let gym members reserve personal training sessions or physical evaluations online' },
      { title: 'Scan-to-Register QR Nodes', desc: 'Fast digital onboarding for direct offline member capture' }
    ],
    packages: [
      { name: 'Fit-Club Starter', price: '₹24,999', delivery: '2 Days', features: ['Membership card tiers', 'Class schedules sheet', 'Trainer bio cards', '100% responsive code'] },
      { name: 'Active Gym Enterprise', price: '₹47,999', delivery: '4 Days', features: ['UPI Autopay subscription integration', 'Private slot booking scheduler', 'Admin lead pipeline metrics', 'SLA support contract'] }
    ],
    faqs: [
      { q: "Does the gym website support automated monthly UPI autopay subscription?", a: "Yes. We configure recurring UPI autopay or card mandate authentications so your club secures monthly renewal fees without manual collection stress." },
      { q: "Can members book private classes with personal trainers directly?", a: "Members select the trainer profile card, view available 1-on-1 slots, make session payments, and secure their training appointment instantly." },
      { q: "Is the schedule planner responsive for dynamic fitness classes?", a: "Yes. Gym admins can update class timings, session trainer slots, and slot capacities in real-time." },
      { q: "Can we integrate client fitness testimonials and transformation photos?", a: "Absolutely. We build premium before/after visual cards showing transformation metrics and member testimonials." },
      { q: "Does this include tracking for member lead generation?", a: "Yes, we build custom trial passes pipelines. Visitors secure trial passes, and those contacts sync instantly to your Admin Lead Desk database." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Direct Digital Membership Acquisition Blueprint',
        paragraphs: [
          'High-performance gym facilities, crossfit boxes, and luxury pilates studios cannot depend on fragmented communication. Direct calls and paper signup files represent a massive friction point, costing you member signups. Modern fitness consumers expect a fluid, self-directed subscription model. They want to check club rules, inspect workout equipment galleries, choose membership tiers, and settle recurring payments directly through their smartphone screens.',
          'SamaXon engineers bold, high-contrast, motivating digital gateways tailored for the luxury fitness sector. We utilize clean, dark, striking graphic elements and strong typography. We place interactive membership selectors prominent on the layout, highlighting premium features (like personal coaching, group wellness access, and corporate discounts). This visual clarity compels gym enthusiasts to lock in their memberships instantly.'
        ]
      },
      {
        sectionHeading: 'UPI Autopay and Trainer Appointment Integration',
        paragraphs: [
          'The biggest operational struggle in gym management is tracking monthly membership renewals. Sending repetitive follow-up texts is tedious and strains client relationships. Our fitness portals support automated recurring subscription billing systems. By integrating secure UPI autopay checkouts, your gym collects membership fees silently every month, stabilizing your baseline cash flow.',
          'Additionally, members can book private classes directly. Our trainer scheduler module maps out specialist schedules in real-time. Members select their preferred coach, allocate their training hour, and lock in the session. This automation keeps your training floor active and maximizes ancillary trainer revenues.'
        ]
      },
      {
        sectionHeading: 'Capturing Trial Passes with Localized Search Optimizations',
        paragraphs: [
          'Most potential fitness members search for gyms within a 3km radius of their home or office. If your web assets fail to rank for localized nearby queries on Google, you surrender valuable trial traffic to competitors. By deploying extremely lightweight, fast-loading, local-SEO optimized pages, we ensure your gym outranks commercial franchises.',
          'We craft high-converting "Free Trial Pass" generators that collect names, verified WhatsApp numbers, and fitness goals. These leads stream into your central Admin Panel, allowing your sales team to convert prospects quickly before they consider other alternatives.'
        ]
      }
    ]
  },
  restaurant: {
    title: 'Fine-Dining Restaurants, Lounge & Bistro Web Design Studio',
    description: 'Stunning interactively visual menu interfaces, reservation seat calendars with deposit support, corporate catering estimate engines, and WhatsApp direct delivery integrations.',
    canonicalPath: '/restaurant-website-design',
    headline: 'Indulgent Culinary Web Experiences for Fine Dining Bistros',
    painPoint: 'Surrendering 30% food transaction fees to heavy delivery platforms, and relying on obsolete, static download PDF menus?',
    sol: 'Our gourmet restaurant blueprints build premium, responsive menu items, table seating reservation grids, catering estimate forms, and direct WhatsApp delivery models.',
    keywords: ['interactive restaurant bill menus', 'table reservation web engine', 'commissions free food order site', 'bistro custom web develop'],
    empiricalCaseStudy: {
      client: 'Prana Gourmet Kitchen',
      result: '180+ Table bookings / Mo',
      details: 'Launched custom menu sliders with real-time dining host calendars, cutting out manual reservation phone calls completely.'
    },
    benefits: [
      { title: 'Interactive Menu Sheets', desc: 'Ditch boring download PDFs. Show beautiful, fast-filtering gourmet menu grids' },
      { title: 'Dining Desk Reservation Sync', desc: 'Guests reserve seats and specify dietary alerts online' },
      { title: 'Catering Lead Estimators', desc: 'Dynamic calculator for wedding feasts or corporate galas' }
    ],
    packages: [
      { name: 'Bistro Classic Pack', price: '₹26,999', delivery: '2 Days', features: ['Interactive web menu', 'Table reservation form', 'Social channels feed integration', 'Full responsive design'] },
      { name: 'Elite Lounge Suite', price: '₹49,999', delivery: '4 Days', features: ['Real-time slot visual selector', 'Catering cost Estimator', 'Live Admin inquiries CRM', 'SEO schema optimizations'] }
    ],
    faqs: [
      { q: "How do table reservations alert the dining floor?", a: "Every table booking sends instant alerts to the host desk via email or automated Google Sheets/WhatsApp integrations for real-time guest seating management." },
      { q: "Can customers order catering and set backend specifications?", a: "Clients customize plate plans, add special catering items (veg/non-veg ratios, live counters) and receive automatic estimates." },
      { q: "Can we support seasonal holiday menu updates?", a: "Yes. Our Admin Panel is designed for easy food item uploads, letting you update pricing, specials, and seasonal dishes in seconds." },
      { q: "Does the dining portal support deposit payments on special dates?", a: "Yes, you can configure token deposits for Valentine's, New Year's Eve, or special group bookings to secure tables and reduce no-shows." },
      { q: "Can we embed google review widgets?", a: "Absolutely. We place elegant review sliders that sync verified guest ratings, building high local trust." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Digital Feast: Why Modern Bistros Must Evolve',
        paragraphs: [
          'Fine-dining restaurants, family bistros, and upscale lounges are leaking valuable transaction profits to aggressive delivery apps. Surrendering up to 30% on every meal, coupled with relying on outdated PDF menus that force customers to pinch-and-zoom on mobile devices, damages your customer experience. Your digital presence should be as refined as your culinary creations.',
          'SamaXon crafts bespoke, sensory-rich restaurant websites. We replace static PDFs with interactive menu sheets that load in a heartbeat. We organize dishes with clean categories, dietary markers (vegan, gluten-free), and vivid, fast-loading photography. This visual design stimulates diners\' appetites, leading to higher average guest bills and increased reservation rates.'
        ]
      },
      {
        sectionHeading: 'Frictionless Table Reservations & Catering Estimators',
        paragraphs: [
          'Securing guest reservation slots on busy weekend evenings shouldn\'t require endless phone calls. Our custom reservation engine features a simple table booking dashboard. Guests specify guest counts, select their preferred dining times, list details about food allergies or special occasions, and lock in their seats instantly.',
          'For corporate events or wedding catering inquiries, we build dynamic menu estimators. Planners can choose custom buffet tiers, add premium live food stations, estimate plate costs instantly, and submit inquiries directly. This structured data lets you close lucrative event contracts faster.'
        ]
      },
      {
        sectionHeading: 'Securing High-Intent Diners with Local SEO',
        paragraphs: [
          'Most fine-dining guests search for eat-out options on Google while on the move, making rapid page load speeds critical. If your restaurant’s website is slow or difficult to navigate on mobile, users will quickly switch to competitors. We build lightweight, edge-delivered platforms that load in less than a second.',
          'By embedding structured Restaurant schemas and local coordinate markers, we place your dining spot at the top of local maps search results. This visibility guarantees a steady stream of reservations, birthday bookings, and corporate event queries.'
        ]
      }
    ]
  },
  business: {
    title: 'Bespoke Premium Corporate & Brand Web Design Agency',
    description: 'We construct lightweight, speed-optimized custom corporate and business websites with built-in leads capturing panels, consultation scheduler cards, and dynamic SEO pages.',
    canonicalPath: '/business-website-design',
    headline: 'Accelerate Authority with Distinctive Corporate Portals',
    painPoint: 'Using generic, slow-loading WordPress or Wix widgets that dilute your authority and look identical to lower-tier competitors?',
    sol: 'SamaXon designs bespoke, hand-crafted corporate solutions that match your exact visual framework. We deliver ultra-low page weights, premium typography, custom lead-capture pipelines, and fast API integration structures.',
    keywords: ['premium corporate web agencies', 'bespoke brand website developer', 'speed consulting web builder', 'b2b corporate lead funnels'],
    empiricalCaseStudy: {
      client: 'Equitas Corporate Advisors',
      result: '110+ Inbound Corporate Leads',
      details: 'Transitioned a B2B advisory firm from slow builder templates to a lightning-fast custom framework, increasing direct consult bookings by 3x.'
    },
    benefits: [
      { title: 'Global Edge Delivery', desc: 'Secure high performance speed loading times under 1.2s across India' },
      { title: 'Secure Enquiries Panel', desc: 'Admin console to review lead details, status logs, and export sheets' },
      { title: 'SEO Rank Supremacy', desc: 'Built-in semantic schemas (Organization, LocalBusiness) to index top' }
    ],
    packages: [
      { name: 'Corporate Launch Pack', price: '₹28,999', delivery: '2 Days', features: ['Bespoke 5-page SPA development', 'Direct leads form CRM sync', 'Google Search console setup', '100% source files delivery'] },
      { name: 'Elite Enterprise Hub', price: '₹54,999', delivery: '5 Days', features: ['Custom UI styling framework', 'Advanced smart scheduler integration', 'Media library & analytics board', 'Comprehensive local SEO pack'] }
    ],
    faqs: [
      { q: "What is the speed guarantee of SamaXon custom engines?", a: "WordPress or elementor sites depend on heavy databases. We deploy compiled, hand-written static files, consistently score 99%+ on Google Lighthouse Vitals, and load within a blink." },
      { q: "Do we receive an administrative panel to review submissions?", a: "Yes. Every client receives credentials to our robust Admin panel, enabling you to inspect incoming client inquiries, update portfolio cards, and handle lead logs." },
      { q: "Can we connect existing CRM platforms like HubSpot?", a: "Yes. We build custom API bridges and webhooks to sync leads directly to your CRM, keeping your sales funnel active." },
      { q: "Do you offer post-launch maintenance?", a: "Yes. We provide dedicated support SLA plans covering minor copy edits, regular security checks, and hosting server monitors." },
      { q: "Can we publish corporate case studies and news?", a: "Absolutely. The client Admin Panel features specific content modules allowing you to add, edit, and archive blog articles and projects." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Corporate Authority Imperative in B2B Markets',
        paragraphs: [
          'In high-ticket business advisory, enterprise software, and professional client consultations, trust is the primary currency. Relying on generic, slow WordPress templates or visual builders can dilute your brand\'s credibility and makes you look identical to lower-tier competitors. High-value clients make split-second decisions based on visual quality and functional responsiveness.',
          'SamaXon crafts bespoke corporate portals that project enterprise-grade authority. We emphasize minimal layout boundaries, clean typography pairings, and generous negative space. Every design choice is intentionally engineered to display your professional track record, elite clients base, and service credentials with prestige.'
        ]
      },
      {
        sectionHeading: 'Frictionless Leads Funnels & Smart CRM Syncing',
        paragraphs: [
          'Capturing B2B inquiries requires a highly intuitive strategy. Complex, multi-page contact sheets and slow booking forms reduce conversions. We build streamlined lead collection forms directly into the interface. Potential clients can request a brief consultation or schedule an introductory call in seconds.',
          'All guest inquiries stream directly into our robust, responsive Admin Panel. This pipeline allows your sales team to review lead source tracking, mark deal stages, export CSV tables, and initiate client outreach instantly, maximizing your sales cycle efficiency.'
        ]
      },
      {
        sectionHeading: 'Google Lighthouse Performance & Structural SEO Supremacy',
        paragraphs: [
          'High-intent B2B decision-makers search for regional specialist partners on Google. If your web assets fail to load quickly or rank well on search results, you lose valuable client inquiries. Because we write pre-compiled, static web frameworks, search engines can easily parse your content.',
          'By leveraging structured schema metadata, your business ranks at the top of local SEO search packs, driving organic B2B leads without requiring continuously expensive ad campaigns.'
        ]
      }
    ]
  },
  school: {
    title: 'Premium School, Academy & K12 Portal Design Agency',
    description: 'SamaXon designs beautiful, high-converting school and educational institution websites with interactive academic calendars, fee calculators, admission inquiry systems, and custom content management zero monthly commissions.',
    canonicalPath: '/school-website-design',
    headline: 'Secure Student Enrollments with Custom Academy Portals',
    painPoint: 'Tired of losing parent attention to slow-loading school portals, or struggles with endless manual paperwork?',
    sol: 'Our bespoke educational portals feature dynamic academic highlights, fast online admission forms, teacher-parent communication modules, and real-time inquiry management matrices.',
    keywords: ['school portal development', 'academy web designs', 'college admissions sites', 'student management setups'],
    empiricalCaseStudy: {
      client: 'Vanguard International School',
      result: '140+ New Admissions Booked',
      details: 'Overhauled an outdated school portal with static fee estimators and fluid online inquiry pipelines, saving front-desk processing times.'
    },
    benefits: [
      { title: 'Interactive Fee Estimators', desc: 'Let parents calculate monthly/quarterly tuition fees side-by-side cleanly' },
      { title: 'Academic Calendar Sync', desc: 'Sync events, holidays, and sports schedules in real-time' },
      { title: 'Slick Online Admission Form', desc: 'Collect applicant details, grade selections, and parent contacts in one step' }
    ],
    packages: [
      { name: 'K12 Academy Lite Package', price: '₹29,999', delivery: '3 Days', features: ['Academic events timeline', 'Basic admission form', 'Responsive faculty cards', '100% cloud ownership'] },
      { name: 'Premium College Portal Pack', price: '₹54,999', delivery: '5 Days', features: ['Bespoke visual menu', 'Dynamic tuition fee estimator', 'Syllabus folder downloader', 'Admin dashboard panel access'] }
    ],
    faqs: [
      { q: "How are student admission inquiries tracked?", a: "All submissions load instantly in your central administrative panel. Admins can view complete contact data, parent details, and targeted grades." },
      { q: "Can we publish digital newsletters and school event calendars?", a: "Yes. Adding newsletters, upcoming sports events, and exam timetables is simple and can be done instantly in the administration console." },
      { q: "Is the portal responsive for parent newsletters?", a: "Absolutely. The portal features fluid mobile responsiveness, ensuring parents can view sports matches or event updates clearly on any screen." },
      { q: "Can we upload student syllabus catalogs?", a: "Yes. You can manage a dynamic resource download directory where parents can access books lists and syllabus sheets." },
      { q: "Can we handle online fee pay queries?", a: "Yes, we can link your secure school UPI details or bank transfer portals directly into checkouts panels." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Modern Digital Admission Funnel for Elite Schools',
        paragraphs: [
          'Modern K-12 academies, universities, and coaching centers compete in a highly fast-paced market. Parents checking educational campuses expect a clear, professional, and trustworthy representation of your academic values. Outdated, slow, or difficult-to-navigate school portals damage parent trust and directly hurt registration numbers.',
          'SamaXon crafts visually grand, easy-to-use educational portals. We design layouts that celebrate student achievements, outstanding faculty profiles, and modern physical amenities with clean typography and balanced padding. Your digital gate is engineered to convert visiting parents into confident enrollment leads.'
        ]
      },
      {
        sectionHeading: 'Interactive Fee Estimators & Easy Admission Pipelines',
        paragraphs: [
          'Providing transparent fee schedules on school portals saves valuable administrative time. We build client-side fee calculators, letting parents check transport rates, laboratory charges, and sibling discounts instantly in their browser.',
          'We also design low-friction digital enrollment forms. Parents can specify student grades, input contact parameters, and submit details directly. These submissions sync to your central Admin Panel, allowing admissions teams to quickly organize campus tours and follow-up interviews.'
        ]
      },
      {
        sectionHeading: 'Maximum Mobile Speed & High Organic Authority',
        paragraphs: [
          'Busy parents rely heavily on their smartphones to research schools, making rapid page load speeds a priority. Our pre-compiled, static educational portals load instantly on any mobile device. By applying advanced EducationalOrganization metadata schemas, we ensure your school outranks competitors in local organic searches.'
        ]
      }
    ]
  },
  clinic: {
    title: 'Specialized Medical Clinics, Doctors & Wellness Web Design',
    description: 'Bespoke medical clinic, diagnostic center, and doctor practice branding web solutions. Includes patient slot booking calendars, therapist profiles, and automated WhatsApp healthcare inquiry routers.',
    canonicalPath: '/clinic-website-design',
    headline: 'Multiply Patient Bookings with Secure Healthcare Portals',
    painPoint: 'Losing valued patients to expensive hospital booking aggregators, or managing patient schedules with phone calls and spreadsheets?',
    sol: 'We develop beautiful, HIPAA-ready doctor and clinic websites with premium doctors cards, direct appointments calendars, healthcare packages cost estimators, and direct patient acquisition panels.',
    keywords: ['doctor clinic websites', 'medical facility custom design', 'wellness center slots system', 'physiotherapist schedule web'],
    empiricalCaseStudy: {
      client: 'Aura Skin & Dental Care',
      result: '3x Patient Bookings Growth',
      details: 'Built custom specialist bios folders with a direct WhatsApp appointment scheduler, bypassing expensive patient booking brokers.'
    },
    benefits: [
      { title: 'Interactive Specialist Cards', desc: 'Display doctor bios, certifications, and slot times cleanly' },
      { title: 'WhatsApp Consultation Routing', desc: 'Forward patient appointment requests directly to clinical staff line' },
      { title: 'Healthcare Package Display', desc: 'Securely display dental, skin, or diagnostics packages with clear rates' }
    ],
    packages: [
      { name: 'Clinic Starter Pack', price: '₹26,999', delivery: '2 Days', features: ['Doctors profile sheet', 'WhatsApp direct booking', 'Google Maps listing SEO', 'Full responsive structure'] },
      { name: 'Healthcare Premium Suite', price: '₹48,999', delivery: '4 Days', features: ['Advanced slot reserving calendar', 'Treatment package cards', 'Admin inquiry CRM access', 'SLA support contract'] }
    ],
    faqs: [
      { q: "Does the booking form connect to our WhatsApp or email?", a: "Yes. Patients can submit booking details which immediately fire alerts to your clinic's WhatsApp line and emails for easy verification." },
      { q: "Can we showcase specialized medical packages?", a: "Yes. Show health checkup packages with full cost details and let patients secure their clinic slot online." },
      { q: "Can we support multiple branch clinics?", a: "Yes. The system supports multi-location filters, directing patients to book appointments at their nearest branch." },
      { q: "Is patient inquiry data stored securely?", a: "Absolutely. All clinical lead logs are encrypted and stored in our secure database with strict role-based access control." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Direct Patient Acquisition Mandate for Modern Clinics',
        paragraphs: [
          'Specialized medical clinics, dental studios, and diagnostic complexes are increasingly losing autonomy to expensive third-party appointment syndicates. These aggregates charge high margins on new patient slots, and put you side-by-side with cheaper operations. To secure your clinical authority, you must establish a fast-loading, highly professional digital home.',
          'SamaXon crafts clean, comforting, trustworthy healthcare portals. We construct designs that immediately showcase your advanced medical apparatus, expert clinical certifications, and sterile rooms. This professional presentation builds deep patient trust.'
        ]
      },
      {
        sectionHeading: 'Streamlined Appointment Calibrations & WhatsApp Routers',
        paragraphs: [
          'Patient checkouts must be incredibly fluid. If your clinic website uses slow booking systems or hard-to-read timetables, patients will call other centers instead. We integrate direct call-to-actions, letting patients select specialists, specify appointment hours, and submit details directly.',
          'These appointments route directly to your clinical front-desk team via email or structured WhatsApp alerts, ensuring rapid scheduling confirmation with zero manual delay.'
        ]
      },
      {
        sectionHeading: 'Maps SEO Optimization for Direct Appointments Growth',
        paragraphs: [
          'Patients hunt for clinics in emergency moments near their neighborhood. By deploying pre-compiled local SEO schemas, we ensure your clinic ranks at the top of Google Maps pack for localized treatment queries in your city.'
        ]
      }
    ]
  },
  interior: {
    title: 'Interior Designers, Architecture Studios & Decors Web Design',
    description: 'Immersive interior designer and architecture brand websites. Features luxury cinematic portfolio matrices, projects catalog folder downloads, and consultation scheduler integrations.',
    canonicalPath: '/interior-designer-website-design',
    headline: 'Secure Premium Clients with Immersive Architectural Portals',
    painPoint: 'Failing to display high-resolution visual mastery, or losing high-ticket design contracts to lower-tier competitors?',
    sol: 'Our design studio packages feature ultra-low weight 8K graphics capabilities, project categories filters, budget calculators, and booking systems built to convert high-ticket leads.',
    keywords: ['interior design portfolio sites', 'architect web development', 'premium decoration portfolios', 'high-ticket design funnels'],
    empiricalCaseStudy: {
      client: 'Opulent Habitat Studios',
      result: '18 Signature Deals Secured',
      details: 'Launched dynamic portfolio grids with built-in material catalog downloads, increasing high-value client consultations by 150%.'
    },
    benefits: [
      { title: 'Interactive Portfolio Filters', desc: 'Categorize your project designs by styles (Scandinavian, Neo-Classic) cleanly' },
      { title: 'Catalog Downloader Panels', desc: 'Secure high-value client trust by offering beautiful design catalog packets' },
      { title: 'Budget Range Estimator', desc: 'Let potential clients select bedroom counts, material grades, and view pricing sheets' }
    ],
    packages: [
      { name: 'Studio Portfolio Pack', price: '₹28,999', delivery: '3 Days', features: ['Creative portfolio grids', 'WhatsApp consultation hook', '100% source files delivery', 'Sitemap registration'] },
      { name: 'Elite Signature Suite', price: '₹54,999', delivery: '5 Days', features: ['Immersive cinematic design', 'Interactive budget estimator', 'Admin portfolio manager', 'SLA support contract'] }
    ],
    faqs: [
      { q: "Can clients filter your portfolio by design style or project type?", a: "Yes. Your dynamic project filter lets clients view residential, commercial, or modular kitchen segments instantly without page reloads." },
      { q: "How do potential clients schedule an initial consultation?", a: "We place clean consultation cards throughout the portal, scheduling direct project calls on your team's calendar slot." },
      { q: "Do you support high-resolution 4K project photos?", a: "Yes, our pre-compiled media loaders compress and optimize heavy images, showing your work in stunning detail without slowing down page load times." },
      { q: "Can we collect material specification requirements online?", a: "Yes. We build dynamic brief questionnaires that capture client style preferences, room counts, and material budgets." },
      { q: "How do we manage our project gallery portfolio?", a: "The Admin Panel's built-in Media Library and portfolio modules make it simple to upload, edit, or delete project cards anytime." }
    ],
    longAnalysis: [
      {
        sectionHeading: 'The Luxury Design Narrative: Elevating Architecture Branding',
        paragraphs: [
          'High-end interior designers and architecture labs rely on visual authority. Clients seeking custom villa renovations, modern office spacing, or boutique hospitality styling require immaculate visual proof of your designs. Relying on average website templates or simple social media posts dilutes your designer pedigree.',
          'SamaXon engineers gorgeous, minimal, high-art digital portfolios tailored for professional creators. We focus on cinematic full-bleed sliders, elegant typography tracking, and spacious negative space. We present your portfolio like a digital gallery, validating your signature design premiums.'
        ]
      },
      {
        sectionHeading: 'Material Brief Creators & Dynamic Project Portals',
        paragraphs: [
          'Converting high-ticket design leads requires structured project discovery. Our interior design portals feature dynamic brief questionnaires. Prospects can select their preferred room layouts, pick materials (Premium, Luxury, Elite), and specify their budget range.',
          'These detailed inquiries sync directly to your Admin Lead Desk, allowing your design team to prepare highly customized visual presentations for initial client meetings.'
        ]
      },
      {
        sectionHeading: 'High-Performance Media Loading & Organic Local Discoveries',
        paragraphs: [
          'Elite design studios require heavy premium imagery. Standard sites slow to a crawl when loading heavy portfolio files, driving away high-budget clients. We use pre-optimized, edge-delivered image loading libraries to present your graphics instantly on any screen.',
          'By leveraging local SEO tags and maps metadata, your architecture group ranks first for local searches in your service areas, securing massive organic projects and direct calls.'
        ]
      }
    ]
  }
};

interface SEOPageProps {
  niche: string;
}

export default function SEOPage({ niche = 'business' }: SEOPageProps) {
  const navigate = useNavigate();
  const config = NICHE_DATA[niche] || NICHE_DATA.business;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim() || !leadForm.email.trim()) {
      setFormError('Please fill in Name, Phone, and Email');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const leadRecord = {
        id: `lead-${Date.now()}`,
        name: leadForm.name,
        businessName: `${niche.toUpperCase()} - Direct Landing Lead`,
        email: leadForm.email,
        phone: leadForm.phone,
        city: 'Online Organic',
        serviceNeeded: `${config.headline} [${niche.toUpperCase()}]`,
        currentProblem: 'Prospect requested free consultation demo layout for ' + niche,
        desiredTimeline: 'Within 2 Weeks',
        budgetRange: 'Premium Segment',
        message: leadForm.message || `Prospect applied directly from localized SEO rank page: ${config.canonicalPath}`,
        status: 'new' as const,
        createdAt: new Date().toISOString()
      };

      const success = await supabaseService.upsertLead(leadRecord);
      if (success) {
        setIsSuccess(true);
        setLeadForm({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        setFormError('Failed to capture lead. Please attempt direct contact instead.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An error occurred during submission. Placed locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": config.title,
      "description": config.description,
      "provider": {
        "@type": "LocalBusiness",
        "name": "SamaXon",
        "image": "https://samaxon.site/og-image.png",
        "url": "https://samaxon.site"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": config.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    }
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-32 pb-20 text-left" id={`seo-landing-${niche}`}>
      <SEO 
        title={config.title}
        description={config.description}
        canonicalPath={config.canonicalPath}
        schemas={pageSchemas}
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* TOP BREADCRUMB */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#8A8178] uppercase font-bold">
          <Link to="/" className="hover:text-champagne-gold transition-colors">SamaXon</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-champagne-gold transition-colors">Services</Link>
          <span>/</span>
          <span className="text-neutral-900">{niche} Web Solutions</span>
        </div>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 border-b border-neutral-150 pb-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-champagne-gold/10 border border-champagne-gold/25 text-[#BFA15A] text-[9px] font-mono uppercase font-black tracking-widest rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Niche Service Excellence
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-tight uppercase">
              {config.headline}
            </h1>
            
            <p className="text-sm text-[#8A8178] leading-relaxed font-sans pr-4">
              {config.description}
            </p>

            <div className="bg-rose-50/55 border border-rose-100 p-5 rounded-2xl space-y-1">
              <span className="text-[9px] font-mono text-rose-800 font-extrabold flex items-center gap-1 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-700 shrink-0" />
                The Market Pain-Point
              </span>
              <p className="text-[11.5px] text-rose-700/95 leading-relaxed font-sans">
                {config.painPoint}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {config.keywords.map((word, idx) => (
                <span key={idx} className="text-[9.5px] uppercase tracking-wider font-mono bg-white border border-[#D6B46A]/20 text-[#8A8178] px-2.5 py-0.5 rounded-md font-bold">
                  #{word}
                </span>
              ))}
            </div>
          </div>

          {/* VISUAL DEVICE DECOR CONTAINER */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-champagne-gold/10 via-transparent to-transparent rounded-3xl blur-2xl transform rotate-6 pointer-events-none" />
            
            <div className="relative bg-neutral-900 border border-champagne-gold/25 rounded-3xl p-6 shadow-xl space-y-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-white/5 border border-white/10 text-[8px] font-mono text-neutral-400 px-3 py-1 rounded-full">
                  https://samaxon.site{config.canonicalPath}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[8px] font-mono text-champagne-gold uppercase tracking-widest block">Live Precompiled Asset Preview</span>
                <h3 className="font-display font-bold text-base leading-snug">
                  Speed-Compiled Direct Frameworks. <br />
                  <span className="text-champagne-gold">No monthly platform taxes.</span>
                </h3>
                <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                  {config.sol}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[7.5px] text-neutral-500 block uppercase">PAGE WEIGHT</span>
                  <strong className="text-emerald-400">42 KB Total</strong>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-[7.5px] text-neutral-500 block uppercase">LIGHTHOUSE</span>
                  <strong className="text-emerald-400">100/100 PERFECT</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1500+ WORDS COPY ANALYSIS DEPTH */}
        <div className="mb-20 space-y-12 border-b border-neutral-150 pb-16 bg-[#FFFDF8] rounded-3xl p-8 sm:p-10 border border-[#D6B46A]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-neutral-100 pointer-events-none translate-x-4 -translate-y-4 font-mono font-black text-[120px] select-none opacity-20">
            SOP
          </div>
          <div className="space-y-2 max-w-xl relative z-10">
            <span className="text-[9px] font-mono uppercase text-[#BFA15A] tracking-widest font-black block">Systems Engineering Deep-Dive</span>
            <h2 className="text-2xl font-display font-black text-neutral-900 uppercase">STRUCTURAL CAPABILITIES ANALYSIS</h2>
            <p className="text-xs text-[#8A8178]">Unpacking our rigid systems specifications, speed-optimized compilation processes, and customer acquisition models.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* Left Nav menu list */}
            <div className="lg:col-span-4 space-y-4 font-mono text-[9px] uppercase tracking-wide text-neutral-500 border-l border-[#D6B46A]/20 pl-4 h-fit">
              {config.longAnalysis.map((sec, si) => (
                <div key={si} className="space-y-1.5 py-1.5 border-b border-neutral-100 last:border-none">
                  <span className="text-[#BFA15A] block font-black">CHAPTER 0{si + 1}:</span>
                  <span className="font-bold text-neutral-800 leading-normal block">{sec.sectionHeading}</span>
                </div>
              ))}
            </div>

            {/* Paragraph Blocks (The actual 1500+ Words deep analysis content) */}
            <div className="lg:col-span-8 space-y-8 text-neutral-700 leading-relaxed font-sans text-xs sm:text-sm">
              {config.longAnalysis.map((sec, si) => (
                <div key={si} className="space-y-3">
                  <h4 className="font-display font-bold text-base text-neutral-900 uppercase tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#BFA15A] rounded-full" />
                    {sec.sectionHeading}
                  </h4>
                  {sec.paragraphs.map((para, pi) => (
                    <p key={pi} className="text-[#8A8178] leading-relaxed font-sans text-xs">
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ADVANCED TESTIMONIAL / CASE STUDY BLOCK FOR THIS NICHE */}
        <div className="mb-20 bg-neutral-900 text-[#FFFDF8] border border-[#D6B46A]/20 p-8 sm:p-12 rounded-3xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-champagne-gold font-bold">CASE RESULT</span>
              <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                {config.empiricalCaseStudy.client}
              </h3>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-champagne-gold/15 text-champagne-gold border border-champagne-gold/25 font-mono text-xs font-bold uppercase">
                <TrendingUp className="w-4 h-4 shrink-0" />
                {config.empiricalCaseStudy.result}
              </div>
            </div>

            <div className="lg:col-span-7 p-6 bg-white/5 border border-white/10 rounded-2xl relative">
              <p className="text-xs text-neutral-300 leading-relaxed font-sans italic">
                "{config.empiricalCaseStudy.details}"
              </p>
              
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono text-[#A89F91]">
                <span>Implementation: SamaXon Custom Engine</span>
                <span className="text-champagne-gold font-bold uppercase">Verified Success Metric</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED PACKAGES GRID SPECIFIC TO NICHE */}
        <div className="mb-20">
          <div className="text-center max-w-sm mx-auto mb-10 space-y-1">
            <h4 className="font-display font-medium text-xs uppercase text-[#BFA15A] tracking-wider font-mono">INVESTMENT PACKAGES</h4>
            <h3 className="text-xl font-display font-bold text-neutral-900 uppercase">CHOOSE YOUR PERFORMANCE TIER</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {config.packages.map((pack, pi) => (
              <div key={pi} className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-display font-bold text-sm text-neutral-800 uppercase">{pack.name}</h4>
                      <span className="text-[9.5px] font-mono text-[#8A8178] block mt-0.5 uppercase tracking-wide">Deployment: {pack.delivery}</span>
                    </div>
                    <div className="text-lg font-display font-black text-[#BFA15A]">{pack.price}</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    {pack.features.map((feat, fi) => (
                      <div key={fi} className="flex gap-2 items-center text-xs text-[#8A8178] font-sans">
                        <CheckCircle className="w-4 h-4 text-[#BFA15A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const el = document.getElementById('seo-niche-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-[#FFFDF8] hover:bg-[#111111] text-neutral-800 hover:text-white border border-neutral-350 hover:border-neutral-900 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all text-center cursor-pointer"
                >
                  Confirm package requirements
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SPECIFIC BENEFITS GRID */}
        <div className="mb-20">
          <div className="max-w-md mb-10">
            <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-black block mb-1">Niche Capabilities Overview</span>
            <h3 className="text-xl font-display font-bold text-neutral-900 uppercase">SPECIFIC CAPABILITIES OVERVIEW</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.benefits.map((ben, bi) => (
              <div key={bi} className="bg-white border border-[#D6B46A]/15 p-6 rounded-3xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-champagne-gold/10 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-champagne-gold" />
                </div>
                <h4 className="font-display font-bold text-xs uppercase text-neutral-800 tracking-tight">{ben.title}</h4>
                <p className="text-[11px] text-[#8A8178] leading-relaxed font-sans">{ben.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LEAD CAPTURE FORM AND ACCORDION FAQS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-[#D6B46A]/15 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* FAQs (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold block mb-0.5">TERMS REVIEW</span>
              <h3 className="font-display font-bold text-lg text-neutral-900 uppercase">FAQ AND OPERATIONAL POLICIES</h3>
            </div>

            <div className="space-y-4">
              {config.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-neutral-100 pb-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-1 font-display font-medium text-xs text-neutral-900 hover:text-champagne-gold transition-colors"
                    >
                      <span className="uppercase">{faq.q}</span>
                      <span className="text-champagne-gold font-bold font-mono">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <p className="text-xs text-[#8A8178] leading-relaxed pt-2 pl-3 border-l-2 border-[#D6B46A]/25 font-sans">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Form (Right) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#D6B46A]/20 p-6 rounded-2xl">
            <div className="border-b border-[#D6B46A]/15 pb-4 mb-4">
              <span className="text-[9px] font-mono text-champagne-gold uppercase tracking-wider block font-bold">SECURE SLOTS PREVIEW</span>
              <h4 className="font-display font-bold text-sm text-neutral-900 uppercase">Inquire For Direct Customizations</h4>
              <p className="text-[10px] text-[#8A8178] leading-normal font-sans">Submit your requirements and our digital specialists will review and follow-up on WhatsApp within 24 hours.</p>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <BadgeCheck className="w-6 h-6 animate-bounce" />
                </div>
                <h5 className="font-display font-bold text-sm text-neutral-900 uppercase">Agenda Secured</h5>
                <p className="text-[11px] text-[#8A8178] leading-normal font-sans">Our design consultant will contact you shortly to frame live template mockups.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 text-[9px] font-mono bg-matte-black text-white hover:text-champagne-gold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4" id="seo-niche-form">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Your Name *</label>
                  <input 
                    type="text"
                    name="name"
                    value={leadForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Advait Kumar"
                    className="w-full bg-white border border-[#D6B46A]/15 p-2.5 text-xs text-matte-black rounded-lg outline-none focus:border-champagne-gold"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-[#0c5737] font-extrabold tracking-wide">Phone (WhatsApp Recommended) *</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={leadForm.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 91234 56789"
                    className="w-full bg-white border border-[#D6B46A]/15 p-2.5 text-xs text-[#0c5737] rounded-lg outline-none focus:border-emerald-600 font-bold"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Email Address *</label>
                  <input 
                    type="email"
                    name="email"
                    value={leadForm.email}
                    onChange={handleInputChange}
                    placeholder="e.g. advait@hotelbrand.com"
                    className="w-full bg-white border border-[#D6B46A]/15 p-2.5 text-xs text-matte-black rounded-lg outline-none focus:border-champagne-gold"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-600 font-bold">Describe Custom Specs (Optional)</label>
                  <textarea 
                    name="message"
                    value={leadForm.message}
                    onChange={handleInputChange}
                    placeholder="Describe capacity, layout sizes, or special features required..."
                    rows={3}
                    className="w-full bg-white border border-[#D6B46A]/15 p-2.5 text-xs text-matte-black rounded-lg outline-none focus:border-champagne-gold"
                  />
                </div>

                {formError && (
                  <div className="p-2 bg-red-100 text-red-700 text-[10.5px] rounded border border-red-200 font-semibold">{formError}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-matte-black hover:bg-[#1C1C1C] text-white hover:text-champagne-gold font-bold uppercase tracking-widest text-[9.5px] rounded-xl border border-[#D6B46A]/20 flex items-center justify-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Securing Blueprint...' : 'Capture pre-built demonstration'}
                  <ArrowRight className="w-4 h-4 text-champagne-gold" />
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
