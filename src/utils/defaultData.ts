import { 
  DirectoryTeamMember, FounderDetails, CompanyDetails, 
  CaseStudy, PricingPlan, JobListing, Testimonial 
} from '../types';

export const DEFAULT_FOUNDER: FounderDetails = {
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  name: 'Samar Khan',
  designation: 'Founder & Principal Systems Architect',
  bio: 'Samar is a dedicated technologist and elite systems developer with over a decade of experience designing responsive applications and background automation workflows. He founded SamaXon to bridge the gap between high-end architectural coding and fast business results.',
  story: 'SamaXon started with a single, clear realization: most modern corporate websites are slow, bloated with heavy plugins, and fail to generate actual qualified revenue pipelines. Agencies would charge exorbitant fees and take months to deliver average results. Samar set out to build an elite, specialized squad of engineers and design artists capable of deploying razor-sharp, custom-coded digital experiences and automatic data routing pipelines in under 48 hours. By omitting bloated content management systems and compiling clean hand-written code, SamaXon delivers instantaneous loading speeds and visual prestige that helps brands establish absolute credibility on Day One.',
  mission: 'To build high-performance, custom-coded, zero-license-cost digital systems that translate visual authority directly into commercial enterprise growth.',
  vision: 'To position SamaXon as Asia’s leading premium software and automation engineering studio, recognized for absolute architectural transparency, lightning execution capabilities, and conversion-centered design philosophy.',
  message: 'At SamaXon, we do not build generic portals. We construct cohesive visual engines designed to represent your authority, command your market space, and lock in system-backed consistency. When you partner with us, you are not just getting a web design—you are upgrading your company’s digital infrastructure. Let’s build something extraordinary.',
  experience: [
    'Founder & Principal, SamaXon Studio (2021 - Present)',
    'Chief Technical Architect, Nexus Capital Solutions (2018 - 2021)',
    'Senior Full-Stack Engineer, Redux Digital Agency (2015 - 2018)',
    'Systems Consultant, Google Developer Group Mentor'
  ],
  achievements: [
    'Led deployment of over 380+ high-traffic digital portals across India and internationally',
    'Consistently achieved 99% Google Lighthouse performance ratings on all compiled client systems',
    'Developed background sync and integration tools saving client teams over 18,000 manual hours yearly',
    'Recognized as an Elite Digital Innovator in Enterprise Business Automation'
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/samar-samaxon',
    twitter: 'https://twitter.com/samar_samaxon',
    email: 'samkhan4562@gmail.com'
  }
};

export const DEFAULT_TEAM: DirectoryTeamMember[] = [
  {
    id: 'team-1',
    name: 'Samar Khan',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    position: 'Founder & Principal Systems Architect',
    department: 'Leadership',
    experience: '10+ Years',
    skills: ['React', 'TypeScript', 'Supabase', 'Node.js', 'Systems Automation', 'API Design'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/samaxon',
      email: 'samkhan4562@gmail.com'
    },
    status: 'Show',
    sortOrder: 1
  },
  {
    id: 'team-2',
    name: 'Nisha Singhal',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    position: 'Lead Creative Brand Director',
    department: 'Design',
    experience: '8+ Years',
    skills: ['Figma Pro', 'Brand Architecture', 'Soft UI Stylings', 'Vector Monograms', 'Corporate Design System'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/samaxon'
    },
    status: 'Show',
    sortOrder: 2
  },
  {
    id: 'team-3',
    name: 'Rohan Deshmukh',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    position: 'Senior Full Stack & Automation Engineer',
    department: 'Development',
    experience: '6+ Years',
    skills: ['Next.js', 'Express', 'D3.js', 'Zapier Automation', 'Custom Bots', 'Docker'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/samaxon'
    },
    status: 'Show',
    sortOrder: 3
  },
  {
    id: 'team-4',
    name: 'Aanya Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    position: 'Elite Technical SEO Strategist',
    department: 'SEO',
    experience: '5+ Years',
    skills: ['Google Search Console', 'JSON-LD Structured Schema', 'Local Business Optimisation', 'Sitemaps', 'Keyword Auditing'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/samaxon'
    },
    status: 'Show',
    sortOrder: 4
  },
  {
    id: 'team-5',
    name: 'Devashish Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    position: 'Director of Business Development',
    department: 'Sales',
    experience: '7+ Years',
    skills: ['Enterprise Sales', 'Client Relations', 'Proposal Scoping', 'Account Strategy'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/samaxon'
    },
    status: 'Show',
    sortOrder: 5
  },
  {
    id: 'team-6',
    name: 'Priyanka Sen',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    position: 'Head of Talent & HR Systems',
    department: 'HR',
    experience: '5+ Years',
    skills: ['Talent Sourcing', 'Hiring Workflow', 'Developer Board', 'Company Culture'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/samaxon'
    },
    status: 'Show',
    sortOrder: 6
  }
];

export const DEFAULT_COMPANY: CompanyDetails = {
  overview: 'SamaXon is an elite, multi-disciplinary digital product studio and systems engineering firm. We replace bloated, fragile content management systems with high-performance, customcompiled, responsive web platforms and backend automation routines. Headquartered at the DLF CyberCity, Haryana, India, we construct digital interfaces that look like premium digital spaces, load instantly, and drive enterprise-scale customer acquisitions with zero monthly licensing overhead.',
  mission: 'To build robust, beautifully styled custom digital engines and automated backend routers that establish absolute business authority and maximize booking conversion rates.',
  vision: 'To serve as India’s highest-rated, developer-led luxury agency, creating high-caliber systems that bridge the gap between creative visual presentation and clean, scalable code.',
  coreValues: [
    {
      title: 'Architectural Transparency',
      description: 'We do not hide behind developer jargon. We build cleanly documented, customcompiled modules with zero dependencies, and give our clients complete code files ownership.',
      iconName: 'Shield'
    },
    {
      title: 'Extreme Performance Speed',
      description: 'Bloated third-party scripts and heavy plug-ins ruin load speed. We compile lightweight hand-crafted code that loads in under 1.2s and scores 95%+ on Google Core Web Vitals.',
      iconName: 'Zap'
    },
    {
      title: 'Conversion-First Design',
      description: 'A beautiful website which fails to capture leads is a vanity asset. We design conversion-centered layouts, plate calculators, and direct WhatsApp routing pipelines that capture premium clients.',
      iconName: 'Target'
    },
    {
      title: 'Systems & Automations',
      description: 'Human teams are prone to manual delays. We engineer background CRM, Google Sheets, and Telegram BOT alert triggers to capture and route leads in 60 seconds.',
      iconName: 'Cpu'
    }
  ],
  workingProcess: [
    {
      step: '01',
      title: 'Architectural Scoping & Blueprints',
      description: 'We analyze your current visual positioning, team workflows, and digital gaps. We define a precise visual layout, schema layout, and background automation map, resulting in a firm project scope statement.'
    },
    {
      step: '02',
      title: 'Premium Styling & Design Prototyping',
      description: 'Our luxury Design Studio maps monogram assets, selects typography families (e.g. Space Grotesk, Inter, JetBrains Mono), and prepares high-end Soft UI layout files that command authority.'
    },
    {
      step: '03',
      title: 'Custom High-Performance Compilation',
      description: 'We code your application from the ground up using React, Vite, and tailwind. No bloated builders or WordPress plugins. Every line is hand-optimized for speed and SEO rankings.'
    },
    {
      step: '04',
      title: 'Automatic Systems & API Sync',
      description: 'We set up real-time background automation hooks. When a lead arrives, it instantly synchronizes to your administrative panel, Gmail inbox, CRM, and notifies your team via custom Telegram BOT.'
    },
    {
      step: '05',
      title: 'Elite SEO Structuring & Launch',
      description: 'We deploy JSON-LD Organisation, LocalBusiness, and FAQ schema scripts. We configure index-ready sitemaps and robots rules, then launch your portal globally on enterprise-grade servers.'
    }
  ],
  industriesServed: [
    'Boutique Hotels & Heritage Properties',
    'Luxury Wedding lawns & Banquet Halls',
    'Premium Wellness Retreats & Resorts',
    'High-Budget Fitness & Crossfit Clubs',
    'Bespoke Corporate Brands & B2B Enterprises',
    'Specialist Medical Clinics & Diagnostics',
    'Interior Design & Creative Architecture Studios',
    'High-End F&B fine-dining Bistros & Restaurants'
  ]
};

export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    clientName: 'Elite Imperial Banquets',
    industry: 'Banquet Hall & Event Spaces',
    beforeState: 'Paying 18% booking commissions to wedding listing aggregator websites. Had a slow, outdated website with low-resolution photo grids and a simple contact form that generated mostly low-budget queries.',
    afterState: 'A custom, premium wedding portal featuring high-fidelity menus selector calculators, an interactive booking slot calendar, and gold-accented typography with zero monthly licensing overhead.',
    results: [
      'Direct wedding bookings increased by 145% in 60 days',
      'Average booking contract value escalated by 35% with visual menu estimators',
      'Overaved booking platform commission fees (saved ₹4.8 Lakhs in first wedding season)'
    ],
    testimonial: {
      quote: "SamaXon turned our wedding hall from a basic local listing into a premium digital brand. The custom menu cost estimator lets parents structure tiers and book events directly. A total game-changer for our business.",
      author: "Manpreet Oberoi",
      role: "Managing Director",
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    screenshotUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    sortOrder: 1
  },
  {
    id: 'case-2',
    clientName: 'Grand Heritage Palace Resort',
    industry: 'Luxury Resorts & Heritage Hotels',
    beforeState: 'Relying 85% on third-party OTA OTAs (Agoda, Booking.com), losing 18% of room-rate revenue directly. Website loaded in 4.8 seconds, causing a huge drop-off of premium international travelers.',
    afterState: 'A gorgeous, visual-heavy resort web application utilizing compressed ultra-high-definition slideshows, instant Room selectors, and integrated payment pathways loading in under 1.2 seconds.',
    results: [
      'Direct, zero-commission reservations grew to 48% of total room inventory',
      'Page speed boosted and load times dropped from 4.8s to 1.1s',
      'International corporate group booking reservations rose by 70%'
    ],
    testimonial: {
      quote: "Operating a heritage resort requires expressing luxury. SamaXon designed an interface that looks like a high-end estate. Direct OTA commission outgo savings paid back the build cost in under 3 weeks.",
      author: "Shruti Sen",
      role: "Corporate Sales Head",
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    screenshotUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    sortOrder: 2
  },
  {
    id: 'case-3',
    clientName: 'Vigour Executive Crossfit',
    industry: 'Premium Fitness & Pilates Hubs',
    beforeState: 'Chasing membership renewals manually via WhatsApp threads and phone calls. Leads with interest in premium packages dropped out during heavy sign-up flows.',
    afterState: 'Highly interactive membership selection cards with automated recurring UPI mandate subscriptions and instant scan-to-enter QR generation.',
    results: [
      'Failed member renewals dropped by 80% using UPI auto-billing',
      'Trainer trial schedule booking submissions increased by 190%',
      'Slick admin dashboard panel gives complete member insight in real-time'
    ],
    testimonial: {
      quote: "Our gym members expect high-end digital services. Getting automated membership sign-ups and schedules directly on our custom app modernised our entire club experience.",
      author: "Kabir Mehra",
      role: "Founder & Chief Coach",
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    screenshotUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    sortOrder: 3
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: "SamaXon operates at a different tier. No bloated builders or templates. They delivered our bespoke business website and automated lead sync parameters in exactly 48 hours. Absolute speed masters.",
    author: "Vikramjit Roy",
    role: "VP of Enterprise Delivery",
    company: "Roy Capital Investments",
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3061/3061341.png'
  },
  {
    id: 'test-2',
    quote: "Our dental clinic needed zero booking leaks and swift patient followups. Samar engineered a background pipeline syncing appointments directly to our reception sheets. Incredibly functional systems.",
    author: "Dr. Ananya Goel",
    role: "Chief Aesthetic Surgeon",
    company: "Goel Dental & Skin Clinic",
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3061/3061341.png'
  },
  {
    id: 'test-3',
    quote: "We required an ultra-premium visual layout to capture luxury modular kitchen contracts. Nishas brand system matches the exact premium aesthetic of our physical showrooms. High conversions recorded.",
    author: "Aryan Goenka",
    role: "Managing Director",
    company: "Goenka Design Studio",
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3061/3061341.png'
  }
];

export const DEFAULT_PRICING: PricingPlan[] = [
  {
    id: 'price-starter',
    name: 'Starter Package',
    price: '₹28,000',
    subtitle: 'For Growing Businesses & Portfolios',
    features: [
      'Sleek Single Page Soft UI CSS layout',
      'Responsive Mobile-First code structure',
      'Instant Lead Capture Form integration',
      'Direct WhatsApp Click-to-Chat routing',
      'Up to 3 Premium Stock media selections',
      'Deploy on high-speed static CDN',
      'Complete Source Files ownership'
    ],
    popular: false,
    deliveryTime: '48 Hours',
    sortOrder: 1,
    category: 'website'
  },
  {
    id: 'price-pro',
    name: 'Professional Package',
    price: '₹55,000',
    subtitle: 'Premium Multi-page Business Platform',
    features: [
      'Up to 5 Custom Pages (e.g., Home, About, Services, Contact)',
      'Highly Interactive calculators or slot selectors',
      'Advanced Meta SEO configurations & Google Search Console',
      'Automated Leads sync to central Admin Dashboard Panel',
      'Custom Telegram BOT integration for Instant Lead Alerts',
      'High-resolution compressed vector brand assets & graphics',
      '1 Year High-Speed Private Server deployment'
    ],
    popular: true,
    deliveryTime: '48 Hours',
    sortOrder: 2,
    category: 'website'
  },
  {
    id: 'price-business',
    name: 'Business Automation Pro',
    price: '₹95,000',
    subtitle: 'Enterprise-Grade Leads & Systems Hub',
    features: [
      'Complete Multi-page premium visual platform',
      'Comprehensive Admin Control System to edit services, text, & blogs',
      'Full Database setup with Auth Roles permissions',
      'Background Zapier API sync tools to Google Sheets or CRMs',
      'Auto-generated billing GST compliant PDF invoicing templates',
      'Dedicated Google Local SEO Rank audit & mapping across service cities',
      'Priority Priority engineering queue and 1-on-1 Samar consulting'
    ],
    popular: false,
    deliveryTime: '3-4 Days',
    sortOrder: 3,
    category: 'website'
  },
  {
    id: 'price-enterprise',
    name: 'Bespoke Custom SaaS build',
    price: '₹1,85,000+',
    subtitle: 'Custom Native App & Multi-Agent Database Engine',
    features: [
      'Full Stack custom-compiled Web Application architecture',
      'Android & iOS Native WebView application bundles package',
      'Multi-user workspace configurations with role permissions',
      'Real-time automated transaction and slot calculators engines',
      'Interactive Custom Client CRM interface trackers',
      'Comprehensive security hardening with database backups',
      '12 Months premium dedicated engineering support retainer'
    ],
    popular: false,
    deliveryTime: '7 Days',
    sortOrder: 4,
    category: 'website'
  },
  {
    id: 'price-bot-starter',
    name: 'Starter Bot Package',
    price: '₹18,000',
    subtitle: 'Essential FAQ & Menu Responders',
    features: [
      'Interactive key-value auto-reply flow',
      'Customized welcome messages & menus',
      'Direct WhatsApp or Telegram routing',
      'Lead collection synced to Google Sheets',
      'Basic button menu user navigation',
      'Static offline auto-reply fallback',
      'Full source ownership & easy deploy guide'
    ],
    popular: false,
    deliveryTime: '24 Hours',
    sortOrder: 5,
    category: 'bot'
  },
  {
    id: 'price-bots',
    name: 'AI Lead & Support Agent',
    price: '₹45,000',
    subtitle: 'Smart Intelligent AI Customer Agents',
    features: [
      'Custom AI Agent (Gemini API Integration)',
      'WhatsApp or Telegram API deployment',
      'Instant lead capture & auto-sync to Sheets',
      'Multi-turn booking and query handling',
      'Offline automatic reply configurations',
      'Hands-free CRM system alerts setup',
      'Full source code ownership'
    ],
    popular: true,
    deliveryTime: '48 Hours',
    sortOrder: 6,
    category: 'bot'
  },
  {
    id: 'price-bot-admin',
    name: 'Admin-Controlled Bot Suite',
    price: '₹75,000',
    subtitle: 'Interactive Bot with Web-App Interface',
    features: [
      'Interactive Custom inline Telegram Web-App',
      'Admin Dashboard panel to edit response nodes',
      'User verification and OTP login routing',
      'Mass marketing campaign broadcast scheduler',
      'Custom database user-state saving',
      'Hourly backup logs and bot status monitors',
      '3 Months priority maintenance retainer'
    ],
    popular: false,
    deliveryTime: '3 Days',
    sortOrder: 7,
    category: 'bot'
  },
  {
    id: 'price-bot-enterprise',
    name: 'Omnichannel Agent Ecosystem',
    price: '₹1,35,000',
    subtitle: 'Cohesive Multi-Platform Bot System',
    features: [
      'Simultaneous WhatsApp, Telegram, Slack sync',
      'AI fine-tuned on company PDF/knowledgebase',
      'In-chat bookings & secure payment gateway',
      'Smart customer query routing to human agents',
      'Real-time live chat operator interface',
      'Enterprise database cluster connection',
      '6 Months dedicated elite developer support'
    ],
    popular: false,
    deliveryTime: '5 Days',
    sortOrder: 8,
    category: 'bot'
  },
  {
    id: 'price-automation-basic',
    name: 'Essential App-to-App Sync',
    price: '₹25,000',
    subtitle: 'Automate Repetitive Daily Workflows',
    features: [
      'Single-source automated trigger sequence',
      'Auto-syncing Leads to central Google Sheets',
      'Custom webhook listener configurations',
      'Slack/Telegram instant team notifications',
      'Standard email template automation triggers',
      'Setup of up to 2 active operational pipelines',
      'Comprehensive testing & hand-off guide'
    ],
    popular: false,
    deliveryTime: '24 Hours',
    sortOrder: 9,
    category: 'automation'
  },
  {
    id: 'price-automation',
    name: 'Enterprise Automation Suite',
    price: '₹65,000',
    subtitle: 'Seamless Zapier & API Integrations',
    features: [
      'Background sync tools (Zapier, Make, Webhooks)',
      'Central Database & CRM automation',
      'Real-time alert notifications (WhatsApp/Telegram)',
      'Automatic GST billing & invoice generation',
      'Team work assignment task routing',
      'Custom API endpoints for 3rd party sync',
      '1 Year premium integration maintenance'
    ],
    popular: true,
    deliveryTime: '3 Days',
    sortOrder: 10,
    category: 'automation'
  },
  {
    id: 'price-automation-etl',
    name: 'ETL Scraping & Report System',
    price: '₹1,10,000',
    subtitle: 'Scheduled Background Scrapers & Reporting',
    features: [
      'Custom-coded high-speed background web scraper',
      'Structured automated reports (PDF/XLSX)',
      'Legacy API bridges & custom data pipelines',
      'Automated email digests with chart summaries',
      'Secure credential vaulting mechanisms',
      'Dynamic cloud scheduler auto-executions',
      'Full technical architecture documentation'
    ],
    popular: false,
    deliveryTime: '5 Days',
    sortOrder: 11,
    category: 'automation'
  },
  {
    id: 'price-automation-erp',
    name: 'Full Custom ERP Automation',
    price: '₹2,20,000',
    subtitle: 'Complete Cloud Operations Synchronization',
    features: [
      'Complete workflow audit & systems blueprinting',
      'Multi-system sync (Inventory, CRM, HR, Bank)',
      'Automated cold-outreach follow-up pipelines',
      'Background high-performance Node.js daemons',
      'Detailed visual system status dashboard panel',
      'End-to-end encrypted API payload tunnels',
      '12 Months premium dedicated systems coverage'
    ],
    popular: false,
    deliveryTime: '7 Days',
    sortOrder: 12,
    category: 'automation'
  },
  {
    id: 'price-app-pwa',
    name: 'Progressive Web App Shell',
    price: '₹48,000',
    subtitle: 'Installable High-Speed Web Apps',
    features: [
      'Fully responsive Progressive Web App setup',
      'Installable on Android, iOS & Windows platforms',
      'Robust local offline storage configuration',
      'Basic Firebase/Supabase user auth module',
      'Interactive database state sync engine',
      'Push notification alerts configuration console',
      'Complete release-ready source build'
    ],
    popular: false,
    deliveryTime: '48 Hours',
    sortOrder: 13,
    category: 'app'
  },
  {
    id: 'price-app-mvp',
    name: 'Custom SaaS MVP Prototype',
    price: '₹85,000',
    subtitle: 'Build Your Minimum Viable Product',
    features: [
      'Clean interactive dashboard UI/UX architecture',
      'Complete user profiles with access levels',
      'Custom integrated database collections (up to 15)',
      'Razorpay/Stripe checkout & plan subscriptions',
      'Interactive dynamic charts (Recharts/D3)',
      'Central Admin System overview interface',
      'SEO optimized marketing landing page segment'
    ],
    popular: false,
    deliveryTime: '4 Days',
    sortOrder: 14,
    category: 'app'
  },
  {
    id: 'price-mobile-app',
    name: 'Premium Mobile Application',
    price: '₹1,20,000',
    subtitle: 'Native Android & iOS Hybrid Apps',
    features: [
      'Android (.apk/.aab) & iOS (.ipa) App builds',
      'Razor-sharp Hybrid Web-Shell performance',
      'Dynamic Push Notifications system setup',
      'Direct Play Store & App Store upload guides',
      'Local offline storage & caching protocols',
      'Integrated payment gateways and checkouts',
      '6 Months priority engineering support retainer'
    ],
    popular: true,
    deliveryTime: '5-7 Days',
    sortOrder: 15,
    category: 'app'
  },
  {
    id: 'price-app-scale',
    name: 'High-Scale Scalable App Engine',
    price: '₹2,50,000+',
    subtitle: 'Massive Enterprise Architecture Ecosystem',
    features: [
      'High-performance full-scale Web & Native Apps',
      'Infinite-scaling Serverless Cloud Run setup',
      'Real-time synchronized chat/notification sockets',
      'Advanced role-based administrative permissions',
      'Third-party software API extensions suite',
      'Comprehensive penetration & security audits',
      '1 Year elite engineering support SLA coverage'
    ],
    popular: false,
    deliveryTime: '10 Days',
    sortOrder: 16,
    category: 'app'
  }
];

export const DEFAULT_JOBS: JobListing[] = [
  {
    id: 'job-consultant',
    title: 'Digital Growth Consultant',
    department: 'Sales',
    experienceLevel: 'Mid-to-Senior (2+ Years)',
    salaryRange: '₹40,000 - ₹60,000/mo',
    type: 'Full-time',
    location: 'Remote',
    description: 'We are seeking an energetic and strategic Digital Growth Consultant to join our team. You will be responsible for understanding client businesses, counseling them on custom web, bot, or automation systems, and closing premium project pipelines.',
    requirements: [
      'Excellent verbal and written communication skills in English and Hindi.',
      'Strong understanding of digital systems, websites, CRM tools, and business automation pipelines.',
      'Proven experience in business development, consultative sales, or client relations roles.',
      'Comfortable communicating with high-ticket clients and business owners directly on WhatsApp, Zoom, or calls.',
      'Highly organized: managing active leads, scheduling follow-ups, and structuring custom client blueprints.'
    ],
    benefits: [
      'Competitive base compensation with extremely rewarding commissions per project successfully initiated',
      '100% remote workspace posture: work from anywhere at your preferred hours',
      'Direct learning and growth mentorship under our core strategy and engineering leadership'
    ],
    status: 'Open',
    createdAt: '2026-06-15'
  }
];

export const LOCAL_SEO_REGIONS = [
  {
    city: 'Noida',
    slug: 'noida',
    address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram (Serving Noida & Delhi NCR)',
    summary: 'Premium digital systems engineering and high-performance hotel, banquet, and corporate website design services across Noida and Sector 62 tech hubs.',
    stats: { projects: 85, clients: 42, avgSpeed: '1.1s' }
  },
  {
    city: 'Gurgaon',
    slug: 'gurgaon',
    address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram, Haryana, 122002',
    summary: 'Our primary systems and automations design HQ. Deploying elite luxury brand platforms, direct-checkout booking models, and real-time CRM software pipelines across G-Town tech corridors.',
    stats: { projects: 140, clients: 72, avgSpeed: '0.9s' }
  },
  {
    city: 'Delhi',
    slug: 'delhi',
    address: 'SamaXon Creative Desk, Connaught Place, New Delhi (Serving Greater Kailash, GK2 & South Delhi)',
    summary: 'Custom-compiled corporate portals, Fine Dining WhatsApp reservations bistros sites, and high-ticket interior design portfolio channels throughout Delhi NCR.',
    stats: { projects: 125, clients: 65, avgSpeed: '1.2s' }
  },
  {
    city: 'Ghaziabad',
    slug: 'ghaziabad',
    address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram (Serving Ghaziabad Tech Hubs)',
    summary: 'Slick clinical slot selectors, heavy commercial school admissions portals, and high-budget fitness gym subscription pathways across Indirapuram and Raj Nagar.',
    stats: { projects: 48, clients: 22, avgSpeed: '1.1s' }
  },
  {
    city: 'Faridabad',
    slug: 'faridabad',
    address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram (Serving Faridabad Business Sectors)',
    summary: 'Enterprise web development, CRM dashboards integrations, and localized micro-services programmatic SEO platforms tailored for Faridabad’s manufacturing and tech offices.',
    stats: { projects: 42, clients: 19, avgSpeed: '1.0s' }
  }
];
