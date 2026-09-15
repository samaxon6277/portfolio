export type ChecklistCategory =
  | 'Core Functionality'
  | 'Responsive Design'
  | 'SEO'
  | 'Performance'
  | 'Accessibility'
  | 'Security'
  | 'Analytics & Operations'
  | 'Legal & Content';

export type CheckItemStatus = 'passed' | 'failed' | 'needs_review' | 'not_checked' | 'not_applicable';

export type CheckItemPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: ChecklistCategory;
  status: CheckItemStatus;
  priority: CheckItemPriority;
  suggestedFix: string;
  notes?: string;
  evidence?: string;
}

export const DEFAULT_LAUNCH_CHECKLIST: ChecklistItem[] = [
  // A. Core Functionality
  {
    id: 'func-nav',
    title: 'Navigation & Internal Routing',
    description: 'All primary and secondary navigation links, mobile drawer links, and dropdown menus route to existing pages without 404 errors.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Run an automated link scan and manually test all desktop and mobile navigation routes.'
  },
  {
    id: 'func-buttons',
    title: 'Interactive Buttons & CTA Triggers',
    description: 'Every call-to-action button produces a tangible user-facing event (modal, anchor scroll, or navigation) with no silent clicks.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Verify click listeners on all CTA buttons and ensure disabled states reflect pending operations.'
  },
  {
    id: 'func-forms',
    title: 'Form Submission & Lead Routing',
    description: 'Inquiry and contact forms validate client inputs, handle server errors gracefully, and deliver notifications to the intended mailbox/CRM.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Submit a live test lead and verify delivery in email inboxes and database tables.'
  },
  {
    id: 'func-search',
    title: 'Search & Filtering Functionality',
    description: 'Search inputs return accurate results, highlight keywords, and display an intuitive empty state when no results match.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Test fuzzy search queries, empty strings, and special characters.'
  },
  {
    id: 'func-auth',
    title: 'User Authentication & Session Recovery',
    description: 'Login, registration, password reset, and logout flows function securely across devices with appropriate session timeouts.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Execute sign-up and password reset tests using disposable email accounts.'
  },
  {
    id: 'func-booking',
    title: 'Booking & Scheduling Engine',
    description: 'Calendar pickers, time-slot selectors, and automated confirmation dispatches operate without timezone conflicts.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Confirm appointment triggers across multiple browser timezones.'
  },
  {
    id: 'func-checkout',
    title: 'Checkout & Payment Processing',
    description: 'Payment gateway integration functions with valid webhooks, currency formatting, and SSL-secured transactions.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Perform end-to-end sandbox transactions and confirm webhook fulfillment receipts.'
  },
  {
    id: 'func-errors',
    title: 'Custom Error Pages (404 & 500 Handling)',
    description: 'Branded 404 and 500 error boundaries exist with clear navigation paths back to the home page or help center.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Navigate to an intentional non-existent URL (e.g. /broken-route-test) to verify the 404 view.'
  },
  {
    id: 'func-success',
    title: 'Success Feedback & Confirmation Banners',
    description: 'Successful actions trigger unambiguous visual feedback without leaving the user questioning transaction status.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Review all submission states to ensure success modals or banners are displayed.'
  },
  {
    id: 'func-contact',
    title: 'Direct Contact Details & Click-to-Call',
    description: 'Phone numbers (tel:), emails (mailto:), WhatsApp links, and physical addresses are verified and active.',
    category: 'Core Functionality',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Tap all tel: and mailto: links on mobile to verify dialing and mailing apps open properly.'
  },

  // B. Responsive Design
  {
    id: 'resp-mobile',
    title: 'Mobile Viewport Usability (320px–428px)',
    description: 'Layout renders flawlessly on compact mobile screens without text clipping, overlap, or broken layouts.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Test on physical iOS and Android devices or Chrome DevTools device mode.'
  },
  {
    id: 'resp-tablet',
    title: 'Tablet Viewport Layout (768px–1024px)',
    description: 'Grid systems adapt cleanly between portrait and landscape tablet orientations without awkward whitespace.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Audit layouts at 768px and 1024px to check column breaks.'
  },
  {
    id: 'resp-desktop',
    title: 'Ultra-Wide Desktop Constraints (1440px+)',
    description: 'Content is constrained with max-width wrappers preventing typography from stretching uncontrollably across wide displays.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Wrap container sections in max-w-7xl mx-auto to maintain typographic density.'
  },
  {
    id: 'resp-overflow',
    title: 'Zero Horizontal Scroll Overflow',
    description: 'Body element does not introduce accidental horizontal scrollbars or side panning on any page viewport.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Inspect elements exceeding viewport width using overflow-x: hidden on wrappers or fixing rigid width declarations.'
  },
  {
    id: 'resp-touch',
    title: 'Touch Target Sizing (Min 44x44px)',
    description: 'All tap targets, buttons, and navigation icons comply with WCAG 2.5.5 minimum 44px x 44px touch boundaries.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Add padding or min-h-[44px] to interactive icons and links.'
  },
  {
    id: 'resp-text',
    title: 'Base Font Legibility & Contrast',
    description: 'Body typography maintains a minimum of 16px on mobile to avoid automatic iOS browser zooming on form inputs.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Set mobile input font size to at least 16px (text-base).'
  },
  {
    id: 'resp-images',
    title: 'Responsive Images & Fluid Aspect Ratios',
    description: 'Images scale proportionally with max-w-full h-auto and explicit width/height attributes to prevent layout shift.',
    category: 'Responsive Design',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Declare aspect-ratio CSS or explicit HTML dimensions on image containers.'
  },

  // C. SEO
  {
    id: 'seo-title',
    title: 'Unique Page Titles & Title Tags',
    description: 'Each public route features an accurate, descriptive <title> tag between 40 and 60 characters with primary brand keywords.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Audit document.title across all pages ensuring zero generic or placeholder titles.'
  },
  {
    id: 'seo-desc',
    title: 'Descriptive Meta Descriptions',
    description: 'Compelling meta descriptions (120–160 characters) present on every indexable page summarizing core offerings.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Provide concise summaries encouraging search click-through.'
  },
  {
    id: 'seo-h1',
    title: 'Single H1 Heading Per Page',
    description: 'Exactly one logical <h1> heading exists per page reflecting the primary topic of the document.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Ensure main hero headings use <h1> and subsequent section headers use <h2> and <h3> in hierarchy.'
  },
  {
    id: 'seo-canonical',
    title: 'Self-Referential Canonical Tags',
    description: 'Absolute canonical URL tags (<link rel="canonical">) prevent duplicate content indexing across parameter variations.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Point rel="canonical" to the primary production HTTPS URL.'
  },
  {
    id: 'seo-sitemap',
    title: 'XML Sitemap & Robots.txt Verification',
    description: 'Accessible sitemap.xml and robots.txt files deployed at root with correct sitemap references and crawler directives.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Visit /sitemap.xml and /robots.txt in the browser to ensure 200 HTTP status.'
  },
  {
    id: 'seo-alt',
    title: 'Descriptive Image Alt Attributes',
    description: 'All informational imagery provides meaningful alternative text; decorative graphics declare alt="".',
    category: 'SEO',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Audit <img> tags and provide concise descriptions of image subject matter.'
  },
  {
    id: 'seo-og',
    title: 'Open Graph & Social Share Metadata',
    description: 'og:title, og:description, og:image (1200x630px), and twitter:card meta tags are verified for social sharing cards.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Validate sharing preview via social card debuggers.'
  },
  {
    id: 'seo-schema',
    title: 'Structured Schema Markup (JSON-LD)',
    description: 'Valid Organization, LocalBusiness, WebSite, or FAQPage schema embedded in page head.',
    category: 'SEO',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Test with Google Rich Results Test tool.'
  },

  // D. Performance
  {
    id: 'perf-images',
    title: 'Modern Image Formats (WebP/AVIF)',
    description: 'Heavy photographic assets are compressed and served in WebP or AVIF formats under 200KB per image.',
    category: 'Performance',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Run batch compression on hero and gallery images using modern encoders.'
  },
  {
    id: 'perf-lazy',
    title: 'Native Image & Iframe Lazy Loading',
    description: 'Below-the-fold images and embedded iframes declare loading="lazy" to reduce initial payload weight.',
    category: 'Performance',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Add loading="lazy" and decoding="async" to all non-hero media elements.'
  },
  {
    id: 'perf-fonts',
    title: 'Optimized Font Loading & Preconnect',
    description: 'Web fonts use font-display: swap, preconnect origins, and only load necessary weights.',
    category: 'Performance',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Add <link rel="preconnect"> for font CDNs and eliminate unused font families.'
  },
  {
    id: 'perf-cwv',
    title: 'Core Web Vitals Benchmarks (LCP < 2.5s, CLS < 0.1)',
    description: 'Page speed benchmarks meet Google "Good" thresholds on mobile 4G network throttling simulations.',
    category: 'Performance',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Eliminate render-blocking JavaScript and inline critical layout CSS.'
  },
  {
    id: 'perf-console',
    title: 'Zero Uncaught JavaScript Console Errors',
    description: 'Browser console reports zero unhandled promise rejections, TypeError crashes, or missing asset 404s.',
    category: 'Performance',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Open Developer Tools Console and navigate through the app to confirm clean execution.'
  },

  // E. Accessibility
  {
    id: 'a11y-keyboard',
    title: 'Keyboard Navigation & Tab Order',
    description: 'All interactive elements are reachable via Tab key in a logical visual sequence without keyboard traps.',
    category: 'Accessibility',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Navigate through entire pages using Tab, Shift+Tab, Enter, and Spacebar only.'
  },
  {
    id: 'a11y-focus',
    title: 'Visible Focus Ring Indicators',
    description: 'Focused interactive elements display a clear, high-contrast outline (focus-visible) and never rely on outline: none.',
    category: 'Accessibility',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Apply focus-visible:ring-2 focus-visible:ring-[#D6B46A] across buttons and links.'
  },
  {
    id: 'a11y-contrast',
    title: 'Color Contrast Compliance (WCAG AA 4.5:1)',
    description: 'All body text achieves at least 4.5:1 contrast against backgrounds; large text achieves at least 3:1.',
    category: 'Accessibility',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Verify foreground text color against container backgrounds using contrast checkers.'
  },
  {
    id: 'a11y-lang',
    title: 'Document Language Declaration (html lang)',
    description: 'The root <html> tag declares an active ISO language attribute such as lang="en".',
    category: 'Accessibility',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Add lang="en" (or appropriate locale) to <html lang="...">.'
  },
  {
    id: 'a11y-motion',
    title: 'Reduced Motion Media Query Support',
    description: 'Animations and auto-playing carousels respect prefers-reduced-motion: reduce system settings.',
    category: 'Accessibility',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Wrap animation triggers in CSS motion queries or Motion/React shouldReduceMotion.'
  },

  // F. Security
  {
    id: 'sec-https',
    title: 'Enforced HTTPS & SSL/TLS Configuration',
    description: 'All HTTP traffic automatically redirects to HTTPS with an active, valid TLS 1.3 certificate.',
    category: 'Security',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Enable automatic HTTP-to-HTTPS redirect on web server and CDN settings.'
  },
  {
    id: 'sec-secrets',
    title: 'Zero Client-Side Secret Exposure',
    description: 'No private API keys (OpenAI, Stripe secret keys, database credentials) appear in frontend bundles or Git repositories.',
    category: 'Security',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Proxy third-party integrations through backend API routes (/api/*) and check client build chunks.'
  },
  {
    id: 'sec-headers',
    title: 'Security Headers (HSTS, CSP, X-Frame-Options)',
    description: 'Production reverse proxy dispatches Strict-Transport-Security, X-Content-Type-Options: nosniff, and anti-clickjacking headers.',
    category: 'Security',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Configure security headers in web server middleware.'
  },
  {
    id: 'sec-input',
    title: 'Input Sanitization & XSS Defense',
    description: 'All user inputs rendered in the UI are properly escaped; no unsanitized dangerouslySetInnerHTML is used.',
    category: 'Security',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Sanitize strings using text nodes or vetted sanitizers before DOM injection.'
  },

  // G. Analytics and Operations
  {
    id: 'ops-analytics',
    title: 'Analytics Tracking Verification',
    description: 'Google Analytics 4, Plausible, or custom telemetry scripts fire page views and key conversion events accurately.',
    category: 'Analytics & Operations',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Inspect network tab or Realtime analytics view while executing conversion actions.'
  },
  {
    id: 'ops-gsc',
    title: 'Google Search Console Verification',
    description: 'Domain or HTML tag ownership verification completed with Google Search Console for index tracking.',
    category: 'Analytics & Operations',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Add DNS TXT verification or HTML meta tag verification.'
  },
  {
    id: 'ops-backups',
    title: 'Automated Database & Code Backups',
    description: 'Scheduled daily database snapshots and automated Git repository branches verified for disaster recovery.',
    category: 'Analytics & Operations',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Verify cloud backup policies and restore procedures.'
  },
  {
    id: 'ops-env',
    title: 'Production Environment Variables Audit',
    description: 'All required environment variables are declared and validated in production hosting settings.',
    category: 'Analytics & Operations',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Check .env.example against hosting platform settings to ensure parity.'
  },

  // H. Legal and Content
  {
    id: 'legal-privacy',
    title: 'Published Privacy Policy & Contact',
    description: 'Compliant privacy policy published detailing data collection, cookie usage, user rights, and contact details.',
    category: 'Legal & Content',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Link an updated Privacy Policy in the website footer.'
  },
  {
    id: 'legal-terms',
    title: 'Terms of Service / Terms & Conditions',
    description: 'Standard terms governing platform usage, intellectual property, liability, and dispute jurisdiction are accessible.',
    category: 'Legal & Content',
    status: 'not_checked',
    priority: 'high',
    suggestedFix: 'Link Terms of Service from site footer and checkout/inquiry touchpoints.'
  },
  {
    id: 'legal-copyright',
    title: 'Dynamic Copyright Year & Business Identity',
    description: 'Footer displays correct registered legal entity name and current year without outdated hardcoded timestamps.',
    category: 'Legal & Content',
    status: 'not_checked',
    priority: 'medium',
    suggestedFix: 'Use new Date().getFullYear() in the footer copyright string.'
  },
  {
    id: 'legal-claims',
    title: 'Content Accuracy & Fact Verification',
    description: 'All pricing figures, deliverable promises, team credentials, and case study statistics are verified as accurate.',
    category: 'Legal & Content',
    status: 'not_checked',
    priority: 'critical',
    suggestedFix: 'Perform an editorial pass over all public pages to verify claims.'
  }
];
