import { Service, PortfolioProject, Testimonial } from './types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    category: 'websites',
    headline: 'High-Performance Website Development',
    painPoint: 'A slow or outdated website silently kills trust. Basic templates look average and drive premium clients away.',
    solutionCopy: 'SamaXon builds fast, premium, responsive, SEO-ready websites that position your business as highly credible and established. From landing pages to multi-page business platforms, every build is custom-designed for speed, visual clarity, and high-quality conversion.',
    deliverables: [
      'Multi-page responsive website',
      'Soft UI PRO Custom CSS design',
      'SEO & Google Search Console setup',
      'Advanced high-converting Lead form',
      'Instant WhatsApp CTA integration',
      'Speed optimization (95+ Lighthouse)',
      'Secure deployment readiness'
    ],
    ctaText: 'Start Your 48-Hour Build',
    benefitPoints: [
      'Ultra-fast load speeds in India & globally',
      'Stunning soft visual aesthetics that establish immediate authority',
      'Mobile-first responsive layouts that feel like native apps'
    ]
  },
  {
    id: 'app-dev',
    title: 'App Development',
    category: 'apps',
    headline: 'Native and WebView App Development',
    painPoint: 'Customers forget brands that only exist on crowded social media channels. If you aren’t on their phone screen, you are invisible.',
    solutionCopy: 'We build high-performance native and WebView mobile experiences that keep your business accessible right from your customer’s phone. Whether you need an appointment booking hub, customer inquiry portal, or catalog app, SamaXon creates highly responsive, touch-optimized mobile systems.',
    deliverables: [
      'WebView / Native wrapper setup',
      'Touch-friendly interface design',
      'Offline caching & rapid launch features',
      'Push notifications preparation',
      'Play Store & App Store build configuration'
    ],
    ctaText: 'Request App Direction',
    benefitPoints: [
      'Continuous customer connection and brand equity',
      'Frictionless touch-first navigation and user flows',
      'Optimized performance for slower mobile connections'
    ]
  },
  {
    id: 'identity-design',
    title: 'Logo & Identity Design',
    category: 'brand-identity',
    headline: 'Logo and Brand Identity That Feels Premium',
    painPoint: 'A weak, generic logo makes even a strong, multi-million dollar business look ordinary or unreliable.',
    solutionCopy: 'Our Design Studio crafts sharp, custom, professional brand identities and visual systems that make your business look serious, premium, and trustworthy across your website, social handles, packaging, and marketing channels.',
    deliverables: [
      'Premium Custom Vector Logo',
      'Cohesive Color Palette selection',
      'Premium Typography pairings guidelines',
      'Social Media Brand Assets',
      'Premium Digital Letterheads & Invoices'
    ],
    ctaText: 'Explore Visual Direction',
    benefitPoints: [
      'Professional stature that lets you command higher fees',
      'Immediate memorability among Indian business circles',
      'Visual alignment that builds instantaneous trust'
    ]
  },
  {
    id: '8k-graphics',
    title: '8K Graphic Designing',
    category: 'graphics',
    headline: 'Ultra-Premium 8K Visual Assets',
    painPoint: 'Low-quality, pixelated banner ads and launch graphics make your enterprise look low-budget and amateur.',
    solutionCopy: 'We create high-resolution, pixel-perfect launch creatives, marketing banners, social media graphics, offer posters, and digital brochures that look jaw-droppingly clean and stop user scrolls instantly.',
    deliverables: [
      'High-resolution 8K social media banners',
      'Ad campaign creative graphics',
      'Offer announcement designs',
      'Premium business posters & certificates',
      'High-end slider graphics for websites'
    ],
    ctaText: 'Request Visual Assets',
    benefitPoints: [
      'Crisp rendering on ultra-high-definition displays',
      'Visually captivating typography and gold accent layers',
      'Polished contrast ratios for high ad performance'
    ]
  },
  {
    id: 'automations',
    title: 'Advanced Automations',
    category: 'automations',
    headline: 'Business Automation Workflows',
    painPoint: 'Manually copy-pasting leads, chasing team updates, and delayed follow-ups waste thousands of hours and lose hot prospects.',
    solutionCopy: 'SamaXon designs smart background automation workflows that instantly capture web inquiries, send SMS/WhatsApp client alerts, organize Excel sheets, notify sales reps, and sync up databases without human intervention.',
    deliverables: [
      'Multi-channel API sync setups',
      'Instant WhatsApp/Email trigger flows',
      'CRM & Google Sheets synchronization',
      'Lead assignment and team allocation systems',
      'Error protection and task retry logic'
    ],
    ctaText: 'Automate My Workspace',
    benefitPoints: [
      'Respond to inquiries in 60 seconds automatically',
      'Zero lead leakage through broken handoffs',
      'Free up 12+ hours of team manual labor every week'
    ]
  },
  {
    id: 'telegram-bots',
    title: 'Custom Telegram Bots',
    category: 'bots',
    headline: 'Telegram Bots for Instant Leads & Support',
    painPoint: 'Leads get missed when notifications are buried. Manual customer support gets slow and delayed during off-hours.',
    solutionCopy: 'Get real-time workspace capability. We build custom Telegram bots that alert you the instant a client fills a contact form, route customer support flows automatically, send order updates, and coordinate daily tasks with your internal team.',
    deliverables: [
      'Form-to-Telegram instant alert pipeline',
      'Automatic FAQ response menus',
      'Booking tracker & notification setups',
      'Premium customer interactions structure',
      'Inline command tools for quick database lookup'
    ],
    ctaText: 'Deploy Telegram Bot',
    benefitPoints: [
      'Never miss a lead with vibrating high-priority notifications',
      'Automated service queries answered 24/7/365',
      'Zero monthly server overhead for communication'
    ]
  },
  {
    id: 'admin-dashboards',
    title: 'Admin Dashboard Systems',
    category: 'admin-ready',
    headline: 'Complete Client Control Platforms',
    painPoint: 'Relying on developers for simple edits like editing a phone number, changing text, or looking up leads is frustrating and slow.',
    solutionCopy: 'We prepare the underlying database architecture and schema structures so your business is ready to mount a Digital Remote Control. When the admin phase is activated, you can update service details, track incoming leads, update pricing notes, and view client messages all from one gorgeous, secure board.',
    deliverables: [
      'Future-ready database structure scaffolding',
      'Secure routing layout for admin sections',
      'Dynamic content bindings',
      'Inquiry schema design (Leads, Services, Settings)',
      'Admin visual mockups built for Soft UI PRO'
    ],
    ctaText: 'Build My Control System',
    benefitPoints: [
      'Absolute control over website visuals and content',
      'Consolidated leads management system',
      'Scalable framework ready for CRM or inventory modules'
    ]
  },
  {
    id: 'seo-perf',
    title: 'Performance & SEO Optimization',
    category: 'websites',
    headline: 'Performance and Speed Engineering',
    painPoint: 'A beautiful website is completely useless if Google does not show it on Page 1, or if it takes more than 3 seconds to load.',
    solutionCopy: 'We carry out extreme code refinement: image compression, code splitting, asset prefetching, semantic structure setup, and local indexing rules so that Google bots can crawl your public pages instantaneously and index your services optimally.',
    deliverables: [
      'Advanced meta titles, descriptions & Open Graph tags',
      'JSON-LD Structured Schema script integration',
      'Performance audits and asset optimization',
      'Optimized sitemap.xml and robots.txt setup',
      'Server-side compliance structure'
    ],
    ctaText: 'Maximize Digital Reach',
    benefitPoints: [
      'Higher organic ranking for local search intents in India',
      'Ultra-high retention rate with instantaneous load times',
      'Clean schema formatting making search rich results active'
    ]
  }
];

export const PORTFOLIO_DATA: PortfolioProject[] = [
  {
    id: 'project-1',
    title: 'Elite Real Estate Showcase',
    type: 'Premium Website Build',
    category: 'websites',
    problem: 'A premium luxury developer in Mumbai had strong trust offline but their online website looked like a basic template, driving affluent home buyers away.',
    solution: 'SamaXon created an immersive champagne-gold & dark charcoal multi-page presentation using Soft UI elements, interactive floor plans, instant WhatsApp click-to-chat, and optimized fast image rendering.',
    result: 'Visual credibility established immediately. Organic buyer inquiries increased by 160% in the first month alone due to fast load speeds and premium site aesthetics.',
    visualTag: 'Premium Business Website',
    accentColor: '#D6B46A'
  },
  {
    id: 'project-2',
    title: 'Nouveau Jewellery Brand Design',
    type: 'Luxury Brand Identity',
    category: 'brand-identity',
    problem: 'An elite heritage boutique wanted to pivot to a minimalist, younger millennial luxury audience but had a crowded, heavy 1990s style visual logo.',
    solution: 'Our specialized Design Studio engineered a refined custom monogram logo, defined a Pearl & Soft Ivory grid system for social assets, and prepared high-converting ad layout grids.',
    result: 'The brand successfully pivoted, positioning itself alongside world-class luxury houses and commanding a 40% margin premium on debut collection launches.',
    visualTag: 'Luxury Brand Identity',
    accentColor: '#FFFDF8'
  },
  {
    id: 'project-3',
    title: 'Aura SPA Booking Wrapper',
    type: 'Mobile App Interface',
    category: 'apps',
    problem: 'A multiple-location premium wellness spa needed a fast way for VIP customers to schedule slots directly from mobile screens without calling phone lines.',
    solution: 'SamaXon developed a lightweight, fluid WebView app wrapping an elegant, optimized Pearl-White reservation engine with localized SMS alerts and reminder notes.',
    result: 'No more double booking. Reduced customer drop-offs by 45% and improved appointment volumes by automating notifications 2 hours prior to schedules.',
    visualTag: 'Mobile App Interface',
    accentColor: '#BFA15A'
  },
  {
    id: 'project-4',
    title: 'Apex Consulting Lead Flow',
    type: 'Lead Automation System',
    category: 'automations',
    problem: 'A business consulting firm was losing hot visual ad leads because team members took over 5 hours to copy lead data from platforms and initiate contact.',
    solution: 'We engineered an advanced automation pipeline that fetches leads instantly, syncs with Google Sheets, and updates the sales team’s priority list within 60 seconds.',
    result: 'Reduced response time from 5 hours to 45 seconds. Contact rates improved by 220%, leading to an immediate boost in booked consultative calls.',
    visualTag: 'Lead Automation System',
    accentColor: '#8A8178'
  },
  {
    id: 'project-5',
    title: 'Centurion Logistics Control Room',
    type: 'Admin Dashboard System',
    category: 'admin-ready',
    problem: 'The business owner had no way to keep track of daily booking requests and leads without calling developers or searching Excel sheets.',
    solution: 'Prepared the foundation for SamaXon Client Control in under 48 hours. Created a premium dashboard design preview with structured tables, quick content toggles, and unified lead listings.',
    result: 'The business foundation is completely ready to scale. Future integrations are secured on standard TypeScript bindings for seamless system extensions.',
    visualTag: 'Admin Dashboard Ready Platform',
    accentColor: '#262626'
  },
  {
    id: 'project-6',
    title: 'Vanguard Realty Lead Alert Bot',
    type: 'Telegram Bot Workflow',
    category: 'bots',
    problem: 'Leads from Facebook and Google Ads were gathering dust on server directories while field executives sat idle waiting for updates.',
    solution: 'SamaXon created a secure Telegram notification bot that pings executive smartphones the instant a lead form is filled, displaying client names, services, and phone numbers.',
    result: 'Team responds instantly. Lead conversion rate grew by 180% as callers contacted buyers while they were actively browsing the platform.',
    visualTag: 'Telegram Bot Workflow',
    accentColor: '#111111'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    quote: "Most agencies talk about 'brand studies' and take 6 weeks just to show a landing page. SamaXon literally sat with me, decoded our requirement, and showed an outstanding direction in 24 hours. The website was live in exactly 48 hours. Premium speed is real.",
    author: "Rajesh Malhotra",
    role: "Founder & Director",
    company: "Malhotra & Co. Estates",
    founderNote: true
  },
  {
    id: 'test-2',
    quote: "Having our leads instantly hit our team's Telegram makes it impossible to miss deals. Every detail feels thoughtful and expensive. Our customers have repeatedly commented on how professional our digital setup feels.",
    author: "Ananya Sen-Gupta",
    role: "Managing Partner",
    company: "Aura Spaces Bengaluru",
    founderNote: false
  },
  {
    id: 'test-3',
    quote: "SamaXon has built an incredible digital remote control concept. Knowing we can transition to a full CRM/management board without having to rebuild our beautiful front-end is saving us lakhs in future development costs.",
    author: "Vikramaditya Shah",
    role: "Chief Executive Officer",
    company: "Shah Heritage Capital",
    founderNote: false
  }
];

export const EDGE_BULLETS = [
  {
    title: "Demo-First Model",
    desc: "We do not believe in lengthy sales pitch PDFs. We show real execution, premium aesthetics, and visual structure before we talk about billing. You see real direction premium class first."
  },
  {
    title: "The 48-Hour Promise",
    desc: "When Indian businesses need momentum, waiting weeks is a failure. We deliver highly optimized, fully customized premium digital assets in under 48 hours for our standard builds."
  },
  {
    title: "Senior Team Execution",
    desc: "Your business presence is too important to be treated like an intern's coding practice. Our Senior Developer Wing and Design Studio construct your interface using elite coding principles."
  },
  {
    title: "Admin-Control Ready",
    desc: "Every website build has its data layers isolated and prepared, so mounting our premium 'Digital Remote Control' admin dashboard later is simple, secure, and dev-independent."
  },
  {
    title: "Pure Soft UI Craftsmanship",
    desc: "We avoid generic templates and template platforms that look basic. Our systems are built from scratch with custom pearl grids, gold trims, and eye-friendly, luxurious typography."
  }
];

export const CAREER_EXPECTATIONS = [
  {
    title: "Connect with Indian Founders",
    desc: "You will connect with business owners, service providers, and startup teams across India, helping them identify vulnerabilities in their current outdated websites and digital branding."
  },
  {
    title: "Explain the 48-Hour Advantage",
    desc: "Present SamaXon’s premium speed, design precision, and demo-first approach clearly. Help clients understand why speed combined with outstanding visual class is crucial for their growth."
  },
  {
    title: "Uncompromising Discipline",
    desc: "This is a remote-first role for self-motivated, high-integrity growth consultants who can maintain follow-up schedules, converse clearly, and represent a luxury brand with absolute decorum."
  }
];
