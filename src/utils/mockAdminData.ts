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
  address: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  maintenanceMode: boolean;
  globalCtaText: string;
  footerText: string;
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
    title: 'Deccan Royal Spices e-Commerce',
    type: 'Luxury Web Platform',
    category: 'websites',
    problem: 'Their international spice catalog web application took 7 seconds to display and generated a bounce rate of nearly 52%.',
    solution: 'Re-engineered the platform using Next.js static page generation and premium dark wood typography highlights.',
    result: 'Achieved a 0.8s load speed and a subsequent 142% volume growth in international client inquiries inside 30 days.',
    visualTag: 'websites',
    accentColor: '#D6B46A'
  },
  {
    id: 'proj-2',
    title: 'Goa Premium Villa Rent Control',
    type: 'Bespoke Mobile Companion',
    category: 'apps',
    problem: 'High-end estate bookings suffered from overlapping reserve calendars and lack of immediate push reminders.',
    solution: 'Built an offline-first premium mobile booking companion application with custom reactive synchronizations.',
    result: 'Zero booking collusions recorded till date, elevating user satisfaction indices by 4.8 / 5 points.',
    visualTag: 'apps',
    accentColor: '#BFA15A'
  },
  {
    id: 'proj-3',
    title: 'Aura Premium Wellness',
    type: 'High-End Rebranding Package',
    category: 'brand-identity',
    problem: 'Wellness center brand appeared like a mass-market chemist shop, repelling premium health candidates.',
    solution: 'Designed a premium minimalist visual identity using Pearl textures and spacious typography guides.',
    result: 'Increased average ticket size per client by 85% by establishing aesthetic authority.',
    visualTag: 'brand-identity',
    accentColor: '#111111'
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
  address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram, HR, India',
  defaultSeoTitle: 'SamaXon | India\'s Premium 48-Hour Digital & Systems Studio',
  defaultSeoDescription: 'SamaXon engineers luxury websites, lightning-fast mobile apps, advanced automations, custom telegram bots, and bespoke digital control hubs in 48 hours.',
  maintenanceMode: false,
  globalCtaText: 'Start Your 48h Build',
  footerText: '© 2026 SAMAXON STUDIO. ALL RIGHTS PROTECTED.'
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
  if (!localStorage.getItem('samaxon_portfolio_projects')) {
    localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(defaultProjects));
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
