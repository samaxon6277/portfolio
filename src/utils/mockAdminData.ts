import { Lead, CareerApplication, Service, PortfolioProject, Testimonial, BlogPost, MediaAsset } from '../types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Content Editor' | 'Sales Manager' | 'Career Manager' | 'Viewer';
  status: 'Active' | 'Disabled';
  lastLogin: string;
  createdAt: string;
  password?: string;
}

export interface BotVisit {
  id: string;
  botName: string;
  category: 'Googlebot' | 'Bingbot' | 'Social Preview Bot' | 'SEO Tool Bot' | 'Unknown Bot' | 'Suspicious Bot';
  userAgent: string;
  pagePath: string;
  ipHash: string;
  visitCount: number;
  lastSeenAt: string;
  createdAt: string;
}

export interface AutomationLog {
  id: string;
  automationType: 'Lead Telegram Notification' | 'Career Application Notification' | 'Contact Form Alert' | 'Webhook Delivery' | 'Future CRM Sync';
  triggerEvent: string;
  status: 'Success' | 'Failed' | 'Pending';
  payloadSummary: string;
  errorMessage?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminUserName: string;
  adminUserRole: string;
  actionType: string;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: string;
  createdAt: string;
}

export interface PageSectionContent {
  id: string;
  pageName: 'Home' | 'About' | 'Services' | 'Portfolio' | 'Edge' | 'Control' | 'Careers' | 'Contact';
  sectionKey: string;
  sectionTitle: string;
  sectionSubtitle?: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface WebsiteSettings {
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  phoneWhatsapp: string;
  telegramLink: string;
  linkedinLink: string;
  instagramLink: string;
  address: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  maintenanceMode: boolean;
  globalCtaText: string;
  footerText: string;
  statTotalProjects: string;
  statActiveClients: string;
  statTeamMembers: string;
  statIndustriesServed: string;
  statYearsExperience: string;
}

// Initial mock data definitions
const defaultLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Aditya Birla Sharma',
    businessName: 'Birla Premium AgriTech',
    phone: '+91 98210 12345',
    email: 'aditya@birlaagritech.com',
    city: 'Mumbai',
    serviceNeeded: 'Web Development',
    currentProblem: 'Existing React web platform loads in 8.5 seconds, failing Google Core Web Vitals and losing active user retention.',
    desiredTimeline: 'Under 48 Hours',
    budgetRange: '₹1,00,000 - ₹2,50,000 (Elite Premium)',
    message: 'We need the homepage and the main products funnel rebuilt completely inside 48 hours for our upcoming venture capital pitch.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() // 1.5 hours ago
  },
  {
    id: 'lead-2',
    name: 'Meera Deshmukh',
    businessName: 'Nouveau Luxury Furnishings',
    phone: '+91 88799 44556',
    email: 'meera@nouveaudecor.in',
    city: 'Bangalore',
    serviceNeeded: 'Logo and Identity Design',
    currentProblem: 'Corporate identity looks outdated and resembles lower-tier e-commerce players rather than targeted elite buyers.',
    desiredTimeline: 'Under 48 Hours',
    budgetRange: '₹50,000 - ₹1,00,000 (Standard Premium)',
    message: 'Seeking a total minimalist visual rebrand featuring champagne gold color highlights and ultra-luxury typography.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
  },
  {
    id: 'lead-3',
    name: 'Vikram Kapoor',
    businessName: 'Apex Health Systems',
    phone: '+91 91100 88990',
    email: 'v.kapoor@apexhealth.co.in',
    city: 'Delhi NCR',
    serviceNeeded: 'Advanced Automations',
    currentProblem: 'Patient lead generation triggers manual Excel updates which takes up to 48 hours to complete. Losing client appointments.',
    desiredTimeline: 'Under 48 Hours',
    budgetRange: '₹1,00,000 - ₹2,50,000 (Elite Premium)',
    message: 'We require custom automation bridges linking Google Forms, CRM, and target doctors WhatsApp notifications immediately.',
    status: 'negotiating',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString() // 1.5 days ago
  },
  {
    id: 'lead-4',
    name: 'Rohan Singhania',
    businessName: 'Singhania & Sons Jewelers',
    phone: '+91 99334 55667',
    email: 'rohan@singhaniaheritage.com',
    city: 'Jaipur',
    serviceNeeded: 'Custom Telegram Bots',
    currentProblem: 'Client customized orders are queued slowly. Needs instant live order status queries on Telegram/WhatsApp.',
    desiredTimeline: 'Under 48 Hours',
    budgetRange: '₹1,00,000 - ₹2,50,000 (Elite Premium)',
    message: 'Need a production-ready Telegram Bot to fetch secure order records in under 0.2s.',
    status: 'won',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'lead-5',
    name: 'Karan Mehra',
    businessName: 'BetaFlow Crypto Analytics',
    phone: '+91 90044 11223',
    email: 'karan@betaflow.io',
    city: 'Pune',
    serviceNeeded: 'Performance and SEO Optimization',
    currentProblem: 'Mobile lighthouse scores are under 40%. Slow SEO crawling has reduced inbound organic index signups.',
    desiredTimeline: 'Under 48 Hours',
    budgetRange: '₹50,000 - ₹1,00,000 (Standard Premium)',
    message: 'Need standard auditing and optimization inside our code layout next weekend.',
    status: 'lost',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString()
  }
];

const defaultCareers: CareerApplication[] = [
  {
    id: 'app-1',
    name: 'Rohit Kulkarni',
    phone: '+91 97665 43210',
    email: 'rohit.kulkarni@gmail.com',
    city: 'Pune',
    roleInterestedIn: 'Digital Growth Consultant',
    experience: '4 Years in Enterprise consultative tech sales at Oracle and Zoho India. Managed portfolios worth ₹50L+.',
    whySamaXon: 'I thrive under fast turnaround cycles. Traditional corporate processes take weeks to approve quotes. SamaXons 48-hour model is exactly the disruptive environment I prefer.',
    portfolioUrl: 'https://rohitkulkarni.com/dashboard',
    linkedinUrl: 'https://linkedin.com/in/rohit-kulkarni-consult',
    resumeUrl: 'https://drive.google.com/file/d/rohit-resume-pdf',
    status: 'submitted',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    id: 'app-2',
    name: 'Ananya Sen',
    phone: '+91 98300 11223',
    email: 'ananya.sen@designstudio.in',
    city: 'Kolkata',
    roleInterestedIn: 'Senior Brand Identity Designer',
    experience: '6 Years creating luxury visual guidelines for high-end fashion lines and premium hospitality platforms across APAC.',
    whySamaXon: 'SamaXon prioritizes aesthetic authority (Champagne Gold / Matte Black visual styles). I design pixel-perfect typography guidelines that perfectly map to your clientele.',
    portfolioUrl: 'https://behance.net/ananyasen-premium',
    linkedinUrl: 'https://linkedin.com/in/ananya-sen-identity',
    resumeUrl: 'https://drive.google.com/file/d/ananya-resume-cv',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'app-3',
    name: 'Devansh Malhotra',
    phone: '+91 81234 56789',
    email: 'dev@malhotra-labs.dev',
    city: 'Bangalore',
    roleInterestedIn: 'Custom Systems & Automation Architect',
    experience: '5 Years core backend Node, Go and Python integration. Expert in Webhooks, Redis queues and low-latency API proxy tunnels.',
    whySamaXon: 'I hate slow developer loops. I specialize in immediate real-time workflow integrations matching SamaXon’s 48-hour delivery timeline.',
    portfolioUrl: 'https://github.com/dev-malhotra-speed',
    linkedinUrl: 'https://linkedin.com/in/devansh-m-architect',
    resumeUrl: 'https://drive.google.com/file/d/dev-resume-sys',
    status: 'accepted',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

const defaultServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Web Development',
    headline: 'High-Performance Custom Sites',
    category: 'websites',
    painPoint: 'Slow loading, average design templates, poor conversion.',
    solutionCopy: 'Custom-built speed-optimized React platforms using luxury display typography.',
    deliverables: ['Custom React App', 'Lighthouse 95+ Score', 'Tailwind Fluid Layout', 'Vercel Fast Ingress Deployment'],
    ctaText: 'Deploy in 48h',
    benefitPoints: ['Zero-flicker loading', 'Luxury high contrast UI', 'Hinglish target copywriting']
  },
  {
    id: 'srv-2',
    title: 'App Development',
    headline: 'Native Cross-Platform Experience',
    category: 'apps',
    painPoint: 'Clunky layouts, slow animations, API syncing lag.',
    solutionCopy: 'Stunning Flutter/React Native fast deployments mapped to luxury frameworks.',
    deliverables: ['Cross-platform APK & IPA', 'Offline-first SQLite State', 'Smooth Motion choreography', 'Secure backend endpoints'],
    ctaText: 'Build mobile client',
    benefitPoints: ['Fluid 120 FPS transitions', 'Immediate local persistence', 'Automated logging pipelines']
  },
  {
    id: 'srv-3',
    title: 'Logo and Identity Design',
    headline: 'Luxury Branding Collaterals',
    category: 'brand-identity',
    painPoint: 'Amateur vector shapes, mismatched fonts, weak brand presence.',
    solutionCopy: 'Elite typography sets and brand vector books styled with Premium Pearl/Champagne.',
    deliverables: ['Print-ready SVG Assets', 'Typography Palette Guide', 'Corporate Stationery Layouts', 'Responsive Logo Kit'],
    ctaText: 'Submit design brief',
    benefitPoints: ['Champagne gold visual presets', 'Strict geometric alignments', 'High readability typeface pairs']
  },
  {
    id: 'srv-4',
    title: '8K Graphic Designing',
    headline: 'Breathtaking Ultra-Res Materials',
    category: 'graphics',
    painPoint: 'Pixelated banners, dull social media grids, low impact.',
    solutionCopy: 'Striking 8K displays engineered for digital billboards, high-end pitch decks, and hero banners.',
    deliverables: ['8K Premium Assets', 'Social Grid Map', 'Investor Deck Template', 'Optimized Web WebP Formats'],
    ctaText: 'Kickstart graphic assets',
    benefitPoints: ['Pristine zoom resolution', 'Color-accurate color grading', 'Stunning negative space composition']
  },
  {
    id: 'srv-5',
    title: 'Advanced Automations',
    headline: 'Frictionless Business Processing',
    category: 'automations',
    painPoint: 'Manual double entry, lost lead sheets, delayed client outreach.',
    solutionCopy: 'Intelligent backend pipelines using N8N, Zapier, or custom low-latency Node queues.',
    deliverables: ['Automated Lead Pipeline', 'Google Sheet Bi-Sync', 'Immediate WhatsApp SMS Alerts', 'System Health Monitor'],
    ctaText: 'Automate business leads',
    benefitPoints: ['< 3 second execution times', 'Secure API credential vaults', 'Self-healing error retry loops']
  },
  {
    id: 'srv-6',
    title: 'Custom Telegram Bots',
    headline: 'High-Velocity Chat Utilities',
    category: 'bots',
    painPoint: 'Unresponsive manual chat, slow FAQ replies, high support overhead.',
    solutionCopy: 'Command-driven secure Telegram bot infrastructures running on serverless edges.',
    deliverables: ['Command Control Panel', 'Inline Database Querying', 'Instant Broadcast Engine', 'Masked Session Isolation'],
    ctaText: 'Deploy custom bot',
    benefitPoints: ['Millisecond trigger answers', 'Automated chat commands', 'Future webhook endpoints prepared']
  },
  {
    id: 'srv-7',
    title: 'Admin Dashboard Systems',
    headline: 'The Elite Digital Remote Control',
    category: 'admin-ready',
    painPoint: 'Blind operations, fragmented settings, unmonitored server states.',
    solutionCopy: 'Bespoke administrative command centers with live state widgets and custom permissions.',
    deliverables: ['Role-based Control Center', 'Real-time Analytical Graphs', 'Dynamic DB Editor Suite', 'Full Activity Audits'],
    ctaText: 'Claim remote command',
    benefitPoints: ['Matte-black micro layouts', 'Glassmorphism state cards', 'Secure session logout procedures']
  },
  {
    id: 'srv-8',
    title: 'Performance and SEO Optimization',
    headline: 'Lighthouse & Core Web Vitals Dominance',
    category: 'websites',
    painPoint: 'Poor SEO ranks, low search visibility, slow layout shifts.',
    solutionCopy: 'In-depth code layout audit, absolute static generation, and metadata injections.',
    deliverables: ['100/100 Lighthouse Report', 'Structured Schema Assets', 'Sitemap and Robots Builder', 'Canonical URL Integrations'],
    ctaText: 'Upgrade site vitals',
    benefitPoints: ['Zero Layout Shifts (CLS)', 'Sub-second Largest Paint (LCP)', 'Pre-fetched page routers']
  }
];

const defaultProjects: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Elite Real Estate Showcase',
    type: 'Premium Website Build',
    category: 'websites',
    problem: 'A premium luxury developer in Mumbai had strong trust offline but their online website looked like a basic template, driving affluent home buyers away.',
    solution: 'SamaXon created an immersive champagne-gold & dark charcoal multi-page presentation using Soft UI elements, interactive floor plans, instant WhatsApp click-to-chat, and optimized fast image rendering.',
    result: 'Visual credibility established immediately. Organic buyer inquiries increased by 160% in the first month alone due to fast load speeds and premium site aesthetics.',
    visualTag: 'websites',
    accentColor: '#D6B46A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-2',
    title: 'Nouveau Jewellery Brand Design',
    type: 'Luxury Brand Identity',
    category: 'brand-identity',
    problem: 'An elite heritage boutique wanted to pivot to a minimalist, younger millennial luxury audience but had a crowded, heavy 1990s style visual logo.',
    solution: 'Our specialized Design Studio engineered a refined custom monogram logo, defined a Pearl & Soft Ivory grid system for social assets, and prepared high-converting ad layout grids.',
    result: 'The brand successfully pivoted, positioning itself alongside world-class luxury houses and commanding a 40% margin premium on debut collection launches.',
    visualTag: 'brand-identity',
    accentColor: '#FFFDF8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-3',
    title: 'Aura SPA Booking Wrapper',
    type: 'Mobile App Interface',
    category: 'apps',
    problem: 'A multiple-location premium wellness spa needed a fast way for VIP customers to schedule slots directly from mobile screens without calling phone lines.',
    solution: 'SamaXon developed a lightweight, fluid WebView app wrapping an elegant, optimized Pearl-White reservation engine with localized SMS alerts and reminder notes.',
    result: 'No more double booking. Reduced customer drop-offs by 45% and improved appointment volumes by automating notifications 2 hours prior to schedules.',
    visualTag: 'apps',
    accentColor: '#BFA15A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-4',
    title: 'Apex Consulting Lead Flow',
    type: 'Lead Automation System',
    category: 'automations',
    problem: 'A business consulting firm was losing hot visual ad leads because team members took over 5 hours to copy lead data from platforms and initiate contact.',
    solution: 'We engineered an advanced automation pipeline that fetches leads instantly, syncs with Google Sheets, and updates the sales team’s priority list within 60 seconds.',
    result: 'Reduced response time from 5 hours to 45 seconds. Contact rates improved by 220%, leading to an immediate boost in booked consultative calls.',
    visualTag: 'automations',
    accentColor: '#8A8178',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-5',
    title: 'Centurion Logistics Control Room',
    type: 'Admin Dashboard System',
    category: 'admin-ready',
    problem: 'The business owner had no way to keep track of daily booking requests and leads without calling developers or searching Excel sheets.',
    solution: 'Prepared the foundation for SamaXon Client Control in under 48 hours. Created a premium dashboard design preview with structured tables, quick content toggles, and unified lead listings.',
    result: 'The business foundation is completely ready to scale. Future integrations are secured on standard TypeScript bindings for seamless system extensions.',
    visualTag: 'admin-ready',
    accentColor: '#262626',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-6',
    title: 'Vanguard Realty Lead Alert Bot',
    type: 'Telegram Bot Workflow',
    category: 'bots',
    problem: 'Leads from Facebook and Google Ads were gathering dust on server directories while field executives sat idle waiting for updates.',
    solution: 'SamaXon created a secure Telegram notification bot that pings executive smartphones the instant a lead form is filled, displaying client names, services, and phone numbers.',
    result: 'Team responds instantly. Lead conversion rate grew by 180% as callers contacted buyers while they were actively browsing the platform.',
    visualTag: 'bots',
    accentColor: '#111111',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-7',
    title: 'Bharat AgriTech PWA',
    type: 'IoT Farming Monitor',
    category: 'apps',
    problem: 'Organic cold-press oil exporters in Maharashtra struggled with tracking real-time cold-storage moisture levels, causing a 12% crop spoilage rate.',
    solution: 'SamaXon engineered a high-performance Progressive Web Application (PWA) with live Recharts visualizers, SMS alerts for temperature fluctuations, and offline cache backup capabilities.',
    result: 'Crop spoilage rate crashed to zero. Soil and yield forecast efficiency grew by 45%, saving the farming cooperative lakhs in monthly operational costs.',
    visualTag: 'apps',
    accentColor: '#4CAF50',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-8',
    title: 'Dharmasutra Heritage Textiles',
    type: 'Ethnic Luxury Brand',
    category: 'brand-identity',
    problem: 'A premium Banarasi silk weaver household had an incredible legacy since 1948 but lacked a premium, modern visual brand, making it hard to target luxury global boutiques.',
    solution: 'Designed a majestic heritage monogram logo, premium copper-trim typography guides, custom physical packaging templates, and high-contrast lookbook presentation patterns.',
    result: 'The brand successfully debuted in London and Milan exhibitions, commanding premium prices starting at ₹1,5,000 per saree with an immediate 5-month preorder booking waitlist.',
    visualTag: 'brand-identity',
    accentColor: '#BFA15A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-9',
    title: 'Mumbai QuickCommerce Dispatch Bot',
    type: 'Automated Courier Routing',
    category: 'bots',
    problem: 'A fast-growing Mumbai gourmet dessert kitchen had delivery dispatchers spending 4 hours daily copying order addresses to courier apps.',
    solution: 'Built an automated Telegram Dispatch Bot connected directly to their Shopify order webhook, auto-allocating deliveries to the nearest courier partner based on geofencing.',
    result: 'Reduced kitchen-to-door delivery transit delay by 18 minutes. Eliminated administrative manual copy errors completely.',
    visualTag: 'bots',
    accentColor: '#2196F3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-10',
    title: 'Kolkata Legal Systems Automation',
    type: 'Supreme Court Doc Sync',
    category: 'automations',
    problem: 'A tier-1 litigation firm in Kolkata spent hundreds of manual paralegal hours checking national court case calendars and daily case listings.',
    solution: 'Programmed a scheduled web scraping script and data pipeline that auto-checks official supreme court registries, updates active case spreadsheets, and emails case-status digests at 8 AM.',
    result: 'Saved 22 Paralegal hours per week. Eliminated missed hearing risks entirely, securing 100% schedule accuracy.',
    visualTag: 'automations',
    accentColor: '#FF5722',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-11',
    title: 'Zenith Diagnostic Centers',
    type: 'Multi-City Medical Platform',
    category: 'websites',
    problem: 'A premium healthcare and diagnostics chain in Hyderabad had a slow, chaotic website where senior patients struggled to schedule lab packages or find reports.',
    solution: 'Created a fully custom-engineered React-based medical booking ecosystem featuring 0.4s page loading, high-contrast typography, and intuitive 3-click report downloads.',
    result: 'Online bookings skyrocketed by 135% within 3 weeks. Reduced call center overload by 55% as patients seamlessly downloaded report PDFs themselves.',
    visualTag: 'websites',
    accentColor: '#3F51B5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-12',
    title: 'Jaipur Royal Rugs Admin Hub',
    type: 'Global Inventory Console',
    category: 'admin-ready',
    problem: 'Luxury rug manufacturers in Rajasthan had no unified digital control screen to track active weaves, raw wool inventory, and worldwide shipping container numbers.',
    solution: 'Configured the ultimate SamaXon Client Admin Console with live status tracking, inventory warning logs, and integrated currency fluctuation estimators.',
    result: 'The complete logistics workflow is now managed under one screen, preparing the brand for rapid North American retail store expansions.',
    visualTag: 'admin-ready',
    accentColor: '#E91E63',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-13',
    title: 'Saffron Luxe Graphics Suite',
    type: 'High-Converting Ad Visuals',
    category: 'graphics',
    problem: 'A high-end organic skincare brand had great products but basic, cluttered social media banner creatives that led to high advertising customer acquisition costs (CAC).',
    solution: 'Produced a cohesive, high-contrast visual design suite, custom 3D gold-embossed serum bottles mockups, and minimal modern advertising templates.',
    result: 'Social media ad click-through rates (CTR) rose from 1.1% to 4.2%, while client acquisition cost dropped by 35% in 15 days.',
    visualTag: 'graphics',
    accentColor: '#FF9800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-14',
    title: 'Himalayan Nectar Branding Assets',
    type: 'High-End Graphic Package',
    category: 'graphics',
    problem: 'An organic honey and pure herbal products startup in Dehradun lacked high-converting aesthetic visuals for their digital storefront launched on Shopify.',
    solution: 'SamaXon designed customized high-contrast modern web product banners, detailed brand vector patterns, and elegant digital visual templates.',
    result: 'User scroll time on the storefront increased by 140%, resulting in a 48% growth in initial basket checkout counts during the launch week.',
    visualTag: 'graphics',
    accentColor: '#FFB300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote: "Aapka team is incredibly fast! Hamari real estate landing page and CRM integration only took 40 hours to be absolutely live. Founders in India should look no further than SamaXon.",
    author: "Pranav Singhania",
    role: "Managing Director",
    company: "Singhania Real Estate",
    founderNote: true
  },
  {
    id: 'test-2',
    quote: "We needed a luxury brand look with a custom-engineered high-speed dashboard. SamaXon’s team built a breathtaking framework in champagne gold that blew our board away in 2 days.",
    author: "Amina Al-Sayed",
    role: "Venture Lead",
    company: "Emirates Luxe Capital",
    founderNote: false
  }
];

const defaultBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why Slow Websites Are Silently Killing Indian Luxury Direct-to-Consumer Brands',
    excerpt: 'In premium commerce, speed is your ultimate luxury asset. If your page takes over 2 seconds to load, your high-net-worth customers are gone.',
    content: 'Indian premium brands invest millions in quality product designs, photography, and luxury packaging, but host their websites on bloated e-commerce templates that load in 6+ seconds. High-net-worth individuals (HNIs) value time above all. A slow digital experience equates to a low-quality product experience. We break down the technical micro-optimizations that trim load times down to sub-800 milliseconds and double user engagement.',
    author: 'SamaXon Editorial',
    publishedAt: 'May 12, 2026',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    title: 'Building Zero-Maintenance Business Automations: Moving Beyond Fragile Excel Triggers',
    excerpt: 'Manual double entries and poorly programmed scripts are hidden business liabilities. Learn how to script solid API tunnels.',
    content: 'Many scale-up founders rely on administrative staff to copy-paste CRM entries or manual WhatsApp updates. This leads to leaked contact coordinates and slower response latency. Senior engineers explain the benefits of node-based API triggers, retry microservices, and state retention queues to establish robust data pipelines.',
    author: 'Systems Architect',
    publishedAt: 'April 28, 2026',
    readTime: '6 min read'
  }
];

const defaultMedia: MediaAsset[] = [
  {
    id: 'med-1',
    fileName: 'hero_luxury_backdrop.webp',
    url: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?q=80&w=800&auto=format&fit=crop',
    mimeType: 'image/webp',
    uploadedAt: new Date(Date.now() - 3600000 * 200).toISOString()
  },
  {
    id: 'med-2',
    fileName: 'branding_champagne_mockup.webp',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    mimeType: 'image/webp',
    uploadedAt: new Date(Date.now() - 3600000 * 180).toISOString()
  },
  {
    id: 'med-3',
    fileName: 'dashboard_remote_ui.webp',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mimeType: 'image/webp',
    uploadedAt: new Date(Date.now() - 3600000 * 50).toISOString()
  }
];

const defaultBotVisits: BotVisit[] = [
  {
    id: 'bot-1',
    botName: 'Googlebot-Mobile',
    category: 'Googlebot',
    userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MHB01G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    pagePath: '/services',
    ipHash: '66.249.79.xx',
    visitCount: 342,
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString()
  },
  {
    id: 'bot-2',
    botName: 'BingPreview',
    category: 'Bingbot',
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.34 (KHTML, like Gecko) BingPreview/1.0b',
    pagePath: '/portfolio',
    ipHash: '40.77.167.xx',
    visitCount: 129,
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString()
  },
  {
    id: 'bot-3',
    botName: 'TelegramBot preview',
    category: 'Social Preview Bot',
    userAgent: 'TelegramBot (like TwitterBot)',
    pagePath: '/home',
    ipHash: '149.154.161.xx',
    visitCount: 78,
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString()
  },
  {
    id: 'bot-4',
    botName: 'AhrefsBot',
    category: 'SEO Tool Bot',
    userAgent: 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
    pagePath: '/blog-post-luxury-brands',
    ipHash: '54.36.148.xx',
    visitCount: 198,
    lastSeenAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString()
  }
];

const defaultAutomationLogs: AutomationLog[] = [
  {
    id: 'auto-1',
    automationType: 'Lead Telegram Notification',
    triggerEvent: 'New lead: Aditya Birla Sharma',
    status: 'Success',
    payloadSummary: '{"text":"🚨 *New SamaXon Inquiry*\\n• *Client*: Aditya Birla\\n• *Business*: Birla Premium AgriTech\\n• *Budget*: ₹1,00,000 - ₹2,50,000"}',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 'auto-2',
    automationType: 'Career Application Notification',
    triggerEvent: 'Applicant: Rohit Kulkarni',
    status: 'Success',
    payloadSummary: '{"text":"💼 *New Career Application*\\n• *Name*: Rohit Kulkarni\\n• *Role*: Digital Growth Consultant\\n• *Location*: Pune"}',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'auto-3',
    automationType: 'Webhook Delivery',
    triggerEvent: 'Lead integration webhook sync',
    status: 'Failed',
    payloadSummary: '{"target_url":"https://api.crm.samaxon.internal/leads","payload":{"id":"lead-1"}}',
    errorMessage: 'Connection timed out (5000ms). Webhook endpoint unresponsive.',
    createdAt: new Date(Date.now() - 3600000 * 1.5 + 30000).toISOString()
  }
];

const defaultActivityLogs: ActivityLog[] = [
  {
    id: 'act-1',
    adminUserName: 'Raj Patel',
    adminUserRole: 'Super Admin',
    actionType: 'LOGIN',
    entityType: 'SESSION',
    entityId: 'sess-83921',
    description: 'Super Admin Raj Patel successfully authenticated from hashed session.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() // 50 mins ago
  },
  {
    id: 'act-2',
    adminUserName: 'Priya Sharma',
    adminUserRole: 'Sales Manager',
    actionType: 'UPDATE_STATUS',
    entityType: 'LEAD',
    entityId: 'lead-2',
    description: 'Lead "Nouveau Luxury Furnishings" status updated from New to Contacted.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'act-3',
    adminUserName: 'Raj Patel',
    adminUserRole: 'Super Admin',
    actionType: 'UPDATE_SERVICE',
    entityType: 'SERVICE',
    entityId: 'srv-1',
    description: 'Service "Web Development" deliverables list and speed parameters optimized.',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'act-4',
    adminUserName: 'Kabir Dev',
    adminUserRole: 'Career Manager',
    actionType: 'STATUS_SHORTLIST',
    entityType: 'CAREER_APPLICATION',
    entityId: 'app-2',
    description: 'Career Application from Ananya Sen set to Reviewing / Shortlisted state.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

const defaultAdminUsers: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Raj Patel',
    email: 'raj@samaxon.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya@samaxon.com',
    role: 'Sales Manager',
    status: 'Active',
    lastLogin: new Date(Date.now() - 3000 * 3600).toISOString(),
    createdAt: '2026-02-15T11:30:00Z'
  },
  {
    id: 'usr-3',
    name: 'Kabir Dev',
    email: 'kabir@samaxon.com',
    role: 'Career Manager',
    status: 'Active',
    lastLogin: new Date(Date.now() - 3600 * 15 * 1000).toISOString(),
    createdAt: '2026-03-01T14:20:00Z'
  },
  {
    id: 'usr-4',
    name: 'Tanya Sen',
    email: 'tanya@samaxon.com',
    role: 'Content Editor',
    status: 'Active',
    lastLogin: new Date(Date.now() - 3600 * 48 * 1000).toISOString(),
    createdAt: '2026-03-20T08:45:00Z'
  },
  {
    id: 'usr-5',
    name: 'Aron Finch',
    email: 'aron@samaxon.com',
    role: 'Viewer',
    status: 'Disabled',
    lastLogin: 'Never',
    createdAt: '2026-04-12T10:15:00Z'
  }
];

const defaultWebsiteSettings: WebsiteSettings = {
  brandName: 'SamaXon',
  logoUrl: 'S',
  faviconUrl: '/favicon.ico',
  contactEmail: 'build@samaxon.com',
  phoneWhatsapp: '+91 80000 00000',
  telegramLink: 'https://t.me/samaxon_studio',
  linkedinLink: 'https://linkedin.com/company/samaxon',
  instagramLink: 'https://instagram.com/samaxon_studio',
  address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram, HR, India',
  defaultSeoTitle: 'SamaXon | India\'s Premium 48-Hour Digital & Systems Studio',
  defaultSeoDescription: 'SamaXon engineers luxury websites, lightning-fast mobile apps, advanced automations, custom telegram bots, and bespoke digital control hubs in 48 hours.',
  maintenanceMode: false,
  globalCtaText: 'Start Your 48h Build',
  footerText: '© 2026 SAMAXON STUDIO. ALL RIGHTS PROTECTED.',
  statTotalProjects: '42+',
  statActiveClients: '18+',
  statTeamMembers: '8+',
  statIndustriesServed: '12+',
  statYearsExperience: '5+'
};

const defaultLegalPages = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'February 24, 2026',
    content: 'We take absolute digital confidentiality very seriously. Since the SamaXon team operates on secure premium isolated micro-containers, zero visitor profiling or user coordinate tracking is performed. We protect all input telemetry logs under strict hash encryption keys. No raw IP coordinates are published.'
  },
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: 'February 24, 2026',
    content: 'By commissioning a 48-Hour premium sprint, clients agree that exact visual mockups are generated selectively in correlation with initial payment deposits. Any deployment pipelines are configured on verified isolated platforms like Vercel or Cloud Run environments.'
  },
  refund: {
    title: 'Refund & Project Delivery Agreement',
    lastUpdated: 'February 24, 2026',
    content: 'SamaXon delivers high-performance frameworks, customized mockups, and operational systems within guaranteed 48-hour delivery bands. If we fail to showcase an interactive preview within 48 hours of initial verification deposit, a absolute 100% immediate escrow refund is completed.'
  }
};

const defaultPageSections: PageSectionContent[] = [
  {
    id: 'sec-1',
    pageName: 'Home',
    sectionKey: 'hero',
    sectionTitle: 'The Future of Digital Branding, Delivered in 48 Hours.',
    sectionSubtitle: 'India’s Premium 48-Hour Digital Studio',
    content: 'SamaXon builds high-performance websites, mobile apps, premium brand identities, automations, and business control systems for founders who do not have time for slow agencies and average execution.',
    ctaText: 'Start Your 48-Hour Build',
    ctaLink: '#contact',
    displayOrder: 1,
    isVisible: true
  },
  {
    id: 'sec-2',
    pageName: 'Home',
    sectionKey: 'sub-quote',
    sectionTitle: 'Hinglish Quick Manifesto',
    content: '“Aapka business ready hai, but website, branding aur systems slow hain? SamaXon ka Senior Engineering Team aapke business ko premium digital presence deta hai — fast, polished, and conversion-ready.”',
    displayOrder: 2,
    isVisible: true
  }
];

export function initializeDatabase() {
  if (!localStorage.getItem('samaxon_leads')) {
    localStorage.setItem('samaxon_leads', JSON.stringify(defaultLeads));
  }
  if (!localStorage.getItem('samaxon_career_applications')) {
    localStorage.setItem('samaxon_career_applications', JSON.stringify(defaultCareers));
  }
  if (!localStorage.getItem('samaxon_services')) {
    localStorage.setItem('samaxon_services', JSON.stringify(defaultServices));
  }
  
  // For portfolio projects, automatically load defaultProjects if empty or if it contains fewer than 10 projects (to ensure our massive upgrade loads instantly)
  const existingProjectsStr = localStorage.getItem('samaxon_portfolio_projects');
  if (!existingProjectsStr) {
    localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(defaultProjects));
  } else {
    try {
      const parsed = JSON.parse(existingProjectsStr);
      if (!Array.isArray(parsed) || parsed.length < 10) {
        localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(defaultProjects));
      }
    } catch (e) {
      localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(defaultProjects));
    }
  }

  if (!localStorage.getItem('samaxon_testimonials')) {
    localStorage.setItem('samaxon_testimonials', JSON.stringify(defaultTestimonials));
  }
  if (!localStorage.getItem('samaxon_blogs')) {
    localStorage.setItem('samaxon_blogs', JSON.stringify(defaultBlogs));
  }
  if (!localStorage.getItem('samaxon_media')) {
    localStorage.setItem('samaxon_media', JSON.stringify(defaultMedia));
  }
  if (!localStorage.getItem('samaxon_bot_visits')) {
    localStorage.setItem('samaxon_bot_visits', JSON.stringify(defaultBotVisits));
  }
  if (!localStorage.getItem('samaxon_automation_logs')) {
    localStorage.setItem('samaxon_automation_logs', JSON.stringify(defaultAutomationLogs));
  }
  if (!localStorage.getItem('samaxon_activity_logs')) {
    localStorage.setItem('samaxon_activity_logs', JSON.stringify(defaultActivityLogs));
  }
  if (!localStorage.getItem('samaxon_admin_users')) {
    localStorage.setItem('samaxon_admin_users', JSON.stringify(defaultAdminUsers));
  }
  if (!localStorage.getItem('samaxon_website_settings')) {
    localStorage.setItem('samaxon_website_settings', JSON.stringify(defaultWebsiteSettings));
  }
  if (!localStorage.getItem('samaxon_legal_pages')) {
    localStorage.setItem('samaxon_legal_pages', JSON.stringify(defaultLegalPages));
  }
  if (!localStorage.getItem('samaxon_page_sections')) {
    localStorage.setItem('samaxon_page_sections', JSON.stringify(defaultPageSections));
  }
}

export function logActivity(adminName: string, role: string, actionType: string, entityType: string, entityId: string, description: string, metadata?: string) {
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem('samaxon_activity_logs') || '[]');
  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    adminUserName: adminName,
    adminUserRole: role,
    actionType,
    entityType,
    entityId,
    description,
    metadata,
    createdAt: new Date().toISOString()
  };
  logs.unshift(newLog);
  localStorage.setItem('samaxon_activity_logs', JSON.stringify(logs));
}
