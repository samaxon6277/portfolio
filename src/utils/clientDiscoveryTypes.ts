/**
 * Client Discovery Questionnaire Data Architecture & Summary Engine
 * Types, Validation Rules, Smart Follow-ups, and Structured Summary Generator
 */

export interface PageRequirementItem {
  id: string;
  name: string;
  quantity: number;
  notes: string;
  isCustom?: boolean;
}

export type AssetReadinessStatus = 'available' | 'partial' | 'not-available' | 'need-help';

export interface AssetReadinessItem {
  key: string;
  label: string;
  status: AssetReadinessStatus;
  notes?: string;
}

export interface EcommerceFollowUp {
  productCount: string;
  categoriesCount: string;
  paymentGateways: string[];
  shippingRequirements: string;
  inventoryManagement: 'manual' | 'automated' | 'external-erp' | 'not-needed';
  customerAccounts: 'required' | 'optional' | 'guest-only';
}

export interface BookingFollowUp {
  bookingType: 'appointments' | 'group-events' | 'resource-rental' | 'consultations';
  dateTimeSlots: 'fixed' | 'flexible' | 'custom-duration';
  staffAvailability: boolean;
  cancellationRules: string;
  requiresUpfrontPayment: boolean;
}

export interface MultilingualFollowUp {
  languages: string[];
  translationStatus: 'ready' | 'needs-translation' | 'ai-translation-acceptable';
  switcherPreference: 'header-dropdown' | 'modal' | 'automatic-geoip';
}

export interface AdminDashboardFollowUp {
  contentManaged: string[];
  userRoles: ('superadmin' | 'admin' | 'editor' | 'viewer')[];
  approvalWorkflow: boolean;
  dataExportNeeded: boolean;
}

export interface AiFeatureFollowUp {
  aiFunctions: ('chatbot' | 'smart-search' | 'recommendations' | 'generative-copy' | 'image-generation')[];
  expectedInputsOutputs: string;
  privacyConstraints: string;
}

export interface DiscoveryFormData {
  // Step 1: Business Overview
  businessName: string;
  businessCategory: string;
  customCategory?: string;
  location: string;
  businessDescription: string;
  yearsInOperation: string;
  existingOnlinePresence: string[];
  mainProductsOrServices: string;
  primaryBusinessGoal: string;

  // Step 2: Project Objectives
  objectives: string[];
  primaryObjective: string;
  objectiveExplanation: string;

  // Step 3: Target Audience
  primaryAudience: string;
  customerType: ('B2B' | 'B2C' | 'D2C' | 'Enterprise' | 'High-Net-Worth' | 'Government')[];
  serviceArea: 'Local' | 'National' | 'International';
  preferredLanguage: string;
  devicesUsed: ('Mobile' | 'Desktop' | 'Tablet')[];
  mainCustomerProblems: string;
  desiredCustomerActions: string[];

  // Step 4: Website Pages
  selectedPages: PageRequirementItem[];

  // Step 5: Features & Integrations
  selectedFeatures: string[];
  ecommerceDetails?: EcommerceFollowUp;
  bookingDetails?: BookingFollowUp;
  multilingualDetails?: MultilingualFollowUp;
  adminDetails?: AdminDashboardFollowUp;
  aiDetails?: AiFeatureFollowUp;
  thirdPartyServices: string[];

  // Step 6: Design Preferences
  visualStyle: string;
  brandColors: string;
  hasLogo: 'yes-final' | 'yes-needs-redesign' | 'no-need-created';
  typographyPreference: string;
  referenceWebsitesLiked: string;
  websitesDisliked: string;
  designMoodNotes: string;
  accessibilityNeeds: string[];
  mobileFirstPriority: boolean;

  // Step 7: Content & Asset Readiness
  assetReadiness: Record<string, AssetReadinessStatus>;
  contentPreparationPlan: string;

  // Step 8: Timeline & Budget
  desiredLaunchTimeline: string;
  urgencyReason: string;
  budgetTier: string;
  decisionMakingStatus: string;
  preferredCommunicationChannel: string;

  // Step 9: Existing Website
  hasExistingWebsite: boolean;
  existingWebsiteUrl?: string;
  whatWorksWell?: string;
  whatNeedsImprovement?: string;
  whatCausesProblems?: string;
  accessToDomain: 'yes' | 'no' | 'unsure';
  accessToHosting: 'yes' | 'no' | 'unsure';
  accessToAnalytics: 'yes' | 'no' | 'unsure';

  // Step 10: Contact & Review
  fullName: string;
  businessEmail: string;
  phone: string;
  contactMethodPreference: 'WhatsApp' | 'Email' | 'Phone Call';
  additionalNotes: string;
  consentAgreed: boolean;
}

export const INITIAL_DISCOVERY_FORM: DiscoveryFormData = {
  businessName: '',
  businessCategory: 'Luxury & Premium Brand',
  customCategory: '',
  location: '',
  businessDescription: '',
  yearsInOperation: '',
  existingOnlinePresence: [],
  mainProductsOrServices: '',
  primaryBusinessGoal: '',

  objectives: ['Build new website', 'Generate more leads', 'Improve performance'],
  primaryObjective: 'Generate more leads',
  objectiveExplanation: '',

  primaryAudience: '',
  customerType: ['B2B'],
  serviceArea: 'National',
  preferredLanguage: 'English',
  devicesUsed: ['Mobile', 'Desktop'],
  mainCustomerProblems: '',
  desiredCustomerActions: ['Submit inquiry', 'Call or WhatsApp'],

  selectedPages: [
    { id: 'home', name: 'Home', quantity: 1, notes: 'Hero, core value proposition, key services, proof, call to action' },
    { id: 'about', name: 'About Us', quantity: 1, notes: 'Brand story, executive leadership, credentials, mission' },
    { id: 'services', name: 'Services / Offerings', quantity: 1, notes: 'Detailed overview of core digital solutions' },
    { id: 'contact', name: 'Contact & Inquiries', quantity: 1, notes: 'Interactive contact form, WhatsApp quick-connect, map' }
  ],

  selectedFeatures: ['Contact Form', 'WhatsApp Integration', 'SEO Setup', 'Analytics Tracking'],
  thirdPartyServices: [],

  visualStyle: 'Luxury & Architectural',
  brandColors: 'Champagne Gold & Matte Black (#D6B46A / #111111)',
  hasLogo: 'yes-final',
  typographyPreference: 'High-contrast Serif headings with clean Modern Sans body',
  referenceWebsitesLiked: '',
  websitesDisliked: '',
  designMoodNotes: '',
  accessibilityNeeds: ['WCAG AA Contrast', 'Keyboard Accessible'],
  mobileFirstPriority: true,

  assetReadiness: {
    logo: 'available',
    brandGuidelines: 'partial',
    images: 'partial',
    videos: 'not-available',
    writtenCopy: 'need-help',
    productOrServiceInfo: 'available',
    testimonials: 'partial',
    teamPhotos: 'partial',
    domain: 'available',
    hosting: 'need-help',
    analytics: 'need-help'
  },
  contentPreparationPlan: '',

  desiredLaunchTimeline: 'Within 1 month',
  urgencyReason: '',
  budgetTier: '$2,500 – $5,000 (Growth / Custom Architecture)',
  decisionMakingStatus: 'Ready to proceed upon approval of proposal',
  preferredCommunicationChannel: 'WhatsApp',

  hasExistingWebsite: false,
  existingWebsiteUrl: '',
  whatWorksWell: '',
  whatNeedsImprovement: '',
  whatCausesProblems: '',
  accessToDomain: 'yes',
  accessToHosting: 'unsure',
  accessToAnalytics: 'unsure',

  fullName: '',
  businessEmail: '',
  phone: '',
  contactMethodPreference: 'WhatsApp',
  additionalNotes: '',
  consentAgreed: false
};

export const BUSINESS_CATEGORIES = [
  'Luxury & Premium Brand',
  'Software / SaaS / Technology',
  'Corporate & B2B Consulting',
  'Healthcare & Medical Practice',
  'Real Estate & Architectural',
  'Legal & Financial Services',
  'Hospitality, Hotel & Dining',
  'E-Commerce & Retail',
  'Education & Coaching Academy',
  'Creative Agency & Portfolio',
  'Industrial & Manufacturing',
  'Non-Profit & NGO',
  'Other (Custom Specify)'
];

export const STANDARD_PAGE_OPTIONS = [
  'Home',
  'About Us',
  'Services / Offerings',
  'Service Detail Page(s)',
  'Portfolio / Case Studies',
  'Individual Case Study Pages',
  'Blog / Articles Hub',
  'Single Blog Post Template',
  'Contact & Inquiries',
  'FAQ / Knowledge Center',
  'Pricing / Packages',
  'Executive Team',
  'Careers / Hiring',
  'Online Booking / Reservation',
  'Shop / Catalog',
  'Product Detail Template',
  'Testimonials & Client Reviews',
  'Terms & Privacy Policy'
];

export const AVAILABLE_FEATURES = [
  { name: 'Contact Form', category: 'Lead Generation', description: 'Custom validated inquiry form with email notifications' },
  { name: 'WhatsApp Integration', category: 'Communication', description: 'Direct WhatsApp click-to-chat with custom pre-filled message' },
  { name: 'Online Booking', category: 'Interactive', description: 'Calendar appointment or reservation scheduler with time slots' },
  { name: 'E-Commerce / Online Store', category: 'Transaction', description: 'Product catalog, shopping bag, checkout, and inventory flow' },
  { name: 'Payment Gateway', category: 'Transaction', description: 'Stripe, PayPal, or Razorpay card and bank payment checkout' },
  { name: 'User Accounts / Portal', category: 'Authentication', description: 'Secure client login, profile, and order history dashboard' },
  { name: 'Custom Admin Dashboard', category: 'Management', description: 'Bespoke backend to manage leads, orders, content, and media' },
  { name: 'CMS / Blog Engine', category: 'Content', description: 'Manage articles, publications, news, and categories easily' },
  { name: 'Site-Wide Search', category: 'Navigation', description: 'Instant modal search across pages, blogs, and products' },
  { name: 'Multilingual Support', category: 'Localization', description: 'Multiple languages with locale routing and language switcher' },
  { name: 'SEO Setup & Schema', category: 'Visibility', description: 'Meta tags, OpenGraph previews, XML sitemap, and rich snippets' },
  { name: 'Analytics Tracking', category: 'Data', description: 'Google Analytics 4, Tag Manager, or Meta Pixel integration' },
  { name: 'Interactive Google Maps', category: 'Location', description: 'Custom styled map with office branches and directions' },
  { name: 'Client Reviews Engine', category: 'Proof', description: 'Verified testimonial cards and Google review syndication' },
  { name: 'Newsletter Signup', category: 'Marketing', description: 'Mailchimp, Klaviyo, or ConvertKit subscriber integration' },
  { name: 'File Upload Capability', category: 'Forms', description: 'Allow clients to upload briefs, RFPs, or PDF documents' },
  { name: 'PDF Document Generator', category: 'Utility', description: 'Generate branded PDF invoices, estimates, or brochures' },
  { name: 'AI-Powered Capabilities', category: 'Artificial Intelligence', description: 'Custom Gemini AI assistant, recommendation, or summarizer' },
  { name: 'Custom Third-Party API', category: 'Engineering', description: 'Integration with custom CRM, ERP, or proprietary webhook' }
];

export const ASSET_ITEMS: { key: string; label: string; description: string }[] = [
  { key: 'logo', label: 'Vector Brand Logo', description: 'Vector AI, SVG, or high-res PNG logo file' },
  { key: 'brandGuidelines', label: 'Brand Guidelines / Style Guide', description: 'Color palette hex codes, font rules, spacing standards' },
  { key: 'images', label: 'Professional Photography', description: 'High-resolution photography of products, office, or team' },
  { key: 'videos', label: 'Video Assets', description: 'Promo reels, customer interviews, or product demos' },
  { key: 'writtenCopy', label: 'Written Page Copy & Messaging', description: 'Drafts or finalized text for headings, services, and about pages' },
  { key: 'productOrServiceInfo', label: 'Product & Service Specifications', description: 'Names, pricing, feature lists, and deliverable scopes' },
  { key: 'testimonials', label: 'Real Testimonials & Case Studies', description: 'Quotes, client names, metrics achieved, and approval to publish' },
  { key: 'teamPhotos', label: 'Team Photos & Bios', description: 'Headshots, titles, credentials, and social links' },
  { key: 'domain', label: 'Custom Domain Name', description: 'Registered domain with DNS control (e.g. at Cloudflare, GoDaddy, Namecheap)' },
  { key: 'hosting', label: 'Web Hosting / Cloud Account', description: 'Cloudflare, Vercel, AWS, or cPanel access' },
  { key: 'analytics', label: 'Analytics Accounts', description: 'Google Analytics, Search Console, or Tag Manager container' }
];

export const BUDGET_TIERS = [
  '$1,000 – $2,500 (Starter / Essential Presence)',
  '$2,500 – $5,000 (Growth / Custom Architecture)',
  '$5,000 – $10,000 (Enterprise / High-Conversion Platform)',
  '$10,000+ (Comprehensive Digital Transformation / Custom Web App)',
  'Budget Flexible / Open to Advisory Recommendation'
];

export const LAUNCH_TIMELINES = [
  'Within 2 weeks (Urgent / High Priority)',
  'Within 1 month (Standard Execution)',
  'Within 2-3 months (Comprehensive Strategy)',
  'Flexible / Quality is Top Priority',
  'Specific fixed deadline event'
];

/**
 * Calculates Content Readiness Score (0 - 100)
 */
export function calculateReadinessScore(readiness: Record<string, AssetReadinessStatus>): {
  score: number;
  rating: 'High' | 'Moderate' | 'Initial';
  readinessSummary: string;
} {
  const totalItems = Object.keys(readiness).length;
  if (totalItems === 0) return { score: 0, rating: 'Initial', readinessSummary: 'No assets evaluated.' };

  let points = 0;
  Object.values(readiness).forEach(status => {
    if (status === 'available') points += 10;
    else if (status === 'partial') points += 5;
    else if (status === 'need-help') points += 2;
  });

  const maxPoints = totalItems * 10;
  const score = Math.min(100, Math.round((points / maxPoints) * 100));

  let rating: 'High' | 'Moderate' | 'Initial' = 'Initial';
  let readinessSummary = 'Most assets and copy will need to be prepared during the strategic discovery phase.';

  if (score >= 70) {
    rating = 'High';
    readinessSummary = 'Excellent asset preparedness. Ready for rapid architectural design and immediate development.';
  } else if (score >= 40) {
    rating = 'Moderate';
    readinessSummary = 'Solid foundation. A targeted content collection sprint will be required in week one.';
  }

  return { score, rating, readinessSummary };
}

/**
 * Generates an executive Markdown project brief for export and client copy
 */
export function generateDiscoveryMarkdownSummary(data: DiscoveryFormData): string {
  const { score, rating, readinessSummary } = calculateReadinessScore(data.assetReadiness);
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const lines: string[] = [
    `# Client Discovery Questionnaire Summary — ${data.businessName || 'Untitled Project'}`,
    `*Generated via SamaXon Digital Solutions Discovery Engine on ${now}*`,
    '',
    '---',
    '',
    '## 1. Executive Business Overview',
    `- **Business Name**: ${data.businessName || 'Not specified'}`,
    `- **Industry Category**: ${data.businessCategory === 'Other (Custom Specify)' ? data.customCategory : data.businessCategory}`,
    `- **Primary Location**: ${data.location || 'Not specified'}`,
    `- **Years in Operation**: ${data.yearsInOperation || 'New venture'}`,
    `- **Existing Online Presence**: ${data.existingOnlinePresence.length > 0 ? data.existingOnlinePresence.join(', ') : 'None / Not listed'}`,
    `- **Core Products / Services**: ${data.mainProductsOrServices || 'Not provided'}`,
    `- **Primary Business Goal**: ${data.primaryBusinessGoal || 'Not specified'}`,
    '',
    '## 2. Strategic Objectives',
    `- **Selected Objectives**: ${data.objectives.join(', ')}`,
    `- **Primary Priority**: ${data.primaryObjective}`,
    `- **Outcome Objective**: ${data.objectiveExplanation || 'To elevate brand authority and drive measurable qualified inquiries.'}`,
    '',
    '## 3. Target Audience & Visitor Dynamics',
    `- **Primary Audience**: ${data.primaryAudience || 'Not specified'}`,
    `- **Customer Segment**: ${data.customerType.join(', ')}`,
    `- **Target Geography**: ${data.serviceArea}`,
    `- **Devices Used**: ${data.devicesUsed.join(', ')}`,
    `- **Customer Problems Solved**: ${data.mainCustomerProblems || 'Not detailed'}`,
    `- **Desired Visitor Action**: ${data.desiredCustomerActions.join(', ')}`,
    '',
    '## 4. Required Page Architecture',
    ...data.selectedPages.map(p => `- **${p.name}** (x${p.quantity})${p.notes ? ` — *${p.notes}*` : ''}`),
    '',
    '## 5. Features & Technical Integrations',
    `- **Selected Features**: ${data.selectedFeatures.join(', ')}`,
    ...(data.ecommerceDetails ? [
      '',
      '### E-Commerce Specification',
      `- Product Count: ${data.ecommerceDetails.productCount}`,
      `- Gateways: ${data.ecommerceDetails.paymentGateways.join(', ') || 'Standard credit card'}`,
      `- Inventory: ${data.ecommerceDetails.inventoryManagement}`,
      `- Shipping: ${data.ecommerceDetails.shippingRequirements || 'Standard courier'}`
    ] : []),
    ...(data.bookingDetails ? [
      '',
      '### Online Booking Specification',
      `- Booking Paradigm: ${data.bookingDetails.bookingType}`,
      `- Slot Duration: ${data.bookingDetails.dateTimeSlots}`,
      `- Upfront Payment: ${data.bookingDetails.requiresUpfrontPayment ? 'Yes' : 'No'}`
    ] : []),
    ...(data.multilingualDetails ? [
      '',
      '### Multilingual Requirements',
      `- Target Locales: ${data.multilingualDetails.languages.join(', ')}`,
      `- Translation Status: ${data.multilingualDetails.translationStatus}`
    ] : []),
    ...(data.aiDetails ? [
      '',
      '### AI Integration Scope',
      `- Capabilities: ${data.aiDetails.aiFunctions.join(', ')}`,
      `- Workflow: ${data.aiDetails.expectedInputsOutputs}`
    ] : []),
    '',
    '## 6. Creative & Design Direction',
    `- **Aesthetic Style**: ${data.visualStyle}`,
    `- **Brand Palette**: ${data.brandColors || 'Champagne Gold & Matte Black'}`,
    `- **Logo Status**: ${data.hasLogo}`,
    `- **Typography Preference**: ${data.typographyPreference}`,
    `- **Reference Websites Liked**: ${data.referenceWebsitesLiked || 'None specified'}`,
    `- **Design Elements Disliked**: ${data.websitesDisliked || 'None specified'}`,
    `- **Mobile-First Priority**: ${data.mobileFirstPriority ? 'Strict Mobile-First Optimization' : 'Standard Responsive'}`,
    '',
    '## 7. Content & Asset Readiness',
    `- **Readiness Score**: **${score}% (${rating} Readiness)**`,
    `- **Readiness Assessment**: ${readinessSummary}`,
    ...Object.entries(data.assetReadiness).map(([key, status]) => {
      const match = ASSET_ITEMS.find(a => a.key === key);
      return `- ${match?.label || key}: **${status.toUpperCase()}**`;
    }),
    '',
    '## 8. Timeline, Budget & Governance',
    `- **Launch Timeline**: ${data.desiredLaunchTimeline}`,
    `- **Target Budget Tier**: ${data.budgetTier}`,
    `- **Decision Making Status**: ${data.decisionMakingStatus}`,
    `- **Preferred Communication**: ${data.preferredCommunicationChannel}`,
    '',
    '## 9. Existing Digital Presence',
    data.hasExistingWebsite ? [
      `- **Current URL**: ${data.existingWebsiteUrl}`,
      `- **What Works Well**: ${data.whatWorksWell || 'None noted'}`,
      `- **Pain Points**: ${data.whatCausesProblems || 'Slow, outdated design, low conversions'}`,
      `- **Access Credentials**: Domain: ${data.accessToDomain} | Hosting: ${data.accessToHosting} | Analytics: ${data.accessToAnalytics}`
    ].join('\n') : '- No existing website (Fresh launch)',
    '',
    '## 10. Contact & Proposal Recipient',
    `- **Client Name**: ${data.fullName}`,
    `- **Business Email**: ${data.businessEmail}`,
    `- **Phone / WhatsApp**: ${data.phone}`,
    `- **Preferred Contact**: ${data.contactMethodPreference}`,
    ...(data.additionalNotes ? [`- **Additional Notes**: ${data.additionalNotes}`] : []),
    '',
    '---',
    '*Prepared for SamaXon Digital Solutions Strategic Review. Confidential document.*'
  ];

  return lines.join('\n');
}

/**
 * Generates pure JSON string conforming to stable Schema for developers or external CRM
 */
export function generateDiscoveryJson(data: DiscoveryFormData): string {
  const { score, rating } = calculateReadinessScore(data.assetReadiness);

  const payload = {
    schemaVersion: '1.0.0',
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'SamaXon Client Discovery Engine',
      readinessScore: score,
      readinessRating: rating
    },
    client: {
      fullName: data.fullName,
      email: data.businessEmail,
      phone: data.phone,
      contactPreference: data.contactMethodPreference,
      consentAgreed: data.consentAgreed
    },
    business: {
      name: data.businessName,
      category: data.businessCategory === 'Other (Custom Specify)' ? data.customCategory : data.businessCategory,
      location: data.location,
      description: data.businessDescription,
      yearsInOperation: data.yearsInOperation,
      existingOnlinePresence: data.existingOnlinePresence,
      mainOfferings: data.mainProductsOrServices,
      primaryGoal: data.primaryBusinessGoal
    },
    project: {
      objectives: data.objectives,
      primaryObjective: data.primaryObjective,
      objectiveDetails: data.objectiveExplanation,
      targetAudience: data.primaryAudience,
      customerSegments: data.customerType,
      serviceArea: data.serviceArea,
      desiredActions: data.desiredCustomerActions,
      pages: data.selectedPages,
      features: data.selectedFeatures,
      advancedSpecs: {
        ecommerce: data.ecommerceDetails || null,
        booking: data.bookingDetails || null,
        multilingual: data.multilingualDetails || null,
        adminDashboard: data.adminDetails || null,
        ai: data.aiDetails || null
      }
    },
    design: {
      style: data.visualStyle,
      palette: data.brandColors,
      hasLogo: data.hasLogo,
      typography: data.typographyPreference,
      references: {
        liked: data.referenceWebsitesLiked,
        disliked: data.websitesDisliked
      },
      accessibility: data.accessibilityNeeds,
      mobileFirst: data.mobileFirstPriority
    },
    readiness: {
      score,
      matrix: data.assetReadiness,
      preparationPlan: data.contentPreparationPlan
    },
    commercial: {
      timeline: data.desiredLaunchTimeline,
      urgency: data.urgencyReason,
      budgetTier: data.budgetTier,
      decisionStatus: data.decisionMakingStatus,
      preferredChannel: data.preferredCommunicationChannel
    },
    existingSite: data.hasExistingWebsite ? {
      url: data.existingWebsiteUrl,
      strengths: data.whatWorksWell,
      weaknesses: data.whatNeedsImprovement,
      painPoints: data.whatCausesProblems,
      access: {
        domain: data.accessToDomain,
        hosting: data.accessToHosting,
        analytics: data.accessToAnalytics
      }
    } : null,
    notes: data.additionalNotes
  };

  return JSON.stringify(payload, null, 2);
}

const STORAGE_KEY = 'samaxon_discovery_questionnaire_progress';

export function saveQuestionnaireProgress(data: DiscoveryFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save questionnaire progress to localStorage:', err);
  }
}

export function loadQuestionnaireProgress(): DiscoveryFormData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DISCOVERY_FORM, ...parsed };
  } catch (err) {
    console.error('Failed to parse saved questionnaire progress:', err);
    return null;
  }
}

export function clearQuestionnaireProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear questionnaire progress:', err);
  }
}
