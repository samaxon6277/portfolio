/**
 * Centralized Site Configuration for SamaXon Digital Solutions
 * Tier-1 Digital Studio Architecture & Constants
 */

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  domain: string;
  baseUrl: string;
  supportEmail: string;
  contactEmail: string;
  careersEmail: string;
  phoneWhatsapp: string;
  phoneWhatsappRaw: string;
  address: {
    street: string;
    locality: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    countryCode: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
    telegram: string;
    github: string;
  };
  serviceAreas: string[];
  priceRange: string;
  coreServices: {
    id: string;
    name: string;
    description: string;
    path: string;
  }[];
}

export const SITE_CONFIG: SiteConfig = {
  name: 'SamaXon Digital Solutions',
  legalName: 'SamaXon Digital Solutions Pvt. Ltd.',
  tagline: 'Speed-Driven Premium Digital Studio',
  description: 'High-Performance Digital Architecture, Delivered in 48 Hours. Precision web applications, bespoke UI/UX, workflow automation, and custom software systems for high-growth enterprises.',
  domain: 'samaxon.site',
  baseUrl: 'https://samaxon.site',
  supportEmail: 'support@samaxon.site',
  contactEmail: 'contact@samaxon.site',
  careersEmail: 'careers@samaxon.site',
  phoneWhatsapp: '+91 98188 54321',
  phoneWhatsappRaw: '919818854321',
  address: {
    street: 'SamaXon Elite Studio Hub, Sector 62',
    locality: 'Sector 62',
    city: 'Noida',
    region: 'Uttar Pradesh',
    postalCode: '201301',
    country: 'India',
    countryCode: 'IN',
  },
  social: {
    linkedin: 'https://linkedin.com/company/samaxon',
    twitter: 'https://twitter.com/samaxon_studio',
    instagram: 'https://instagram.com/samaxon_studio',
    telegram: 'https://t.me/samaxon_studio',
    github: 'https://github.com/samaxon-studio',
  },
  serviceAreas: ['Noida', 'Delhi NCR', 'Gurugram', 'Mumbai', 'Bengaluru', 'Global / International'],
  priceRange: '₹₹',
  coreServices: [
    {
      id: 'web-development',
      name: 'High-Performance Web Development',
      description: 'Ultra-fast, conversion-engineered web platforms and portals built with modern architectures.',
      path: '/services',
    },
    {
      id: 'app-development',
      name: 'Mobile & Full-Stack Applications',
      description: 'Native and cross-platform mobile experiences with resilient cloud infrastructure.',
      path: '/services',
    },
    {
      id: 'custom-automation',
      name: 'Bespoke Business Workflow Automation',
      description: 'Automated CRM pipelines, scheduling synchronization, and custom notification systems.',
      path: '/services',
    },
    {
      id: 'ai-bot-integration',
      name: 'Custom AI & Telegram Bots',
      description: 'Intelligent customer interaction bots and contextual AI-driven booking systems.',
      path: '/services',
    },
  ],
};

/**
 * Generate an official WhatsApp Direct Inquiry URL with customized pre-filled message
 */
export function getWhatsAppInquiryUrl(message?: string): string {
  const baseNumber = SITE_CONFIG.phoneWhatsappRaw;
  const defaultMsg = 'Hello SamaXon Team, I would like to discuss a high-performance build for my business.';
  const encodedMsg = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/${baseNumber}?text=${encodedMsg}`;
}

/**
 * Generate Schema.org JSON-LD definitions
 */
export function generateStudioSchemas(canonicalPath: string = '/') {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.baseUrl}/#organization`,
      name: SITE_CONFIG.name,
      legalName: SITE_CONFIG.legalName,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl}/logo.png`,
      image: `${SITE_CONFIG.baseUrl}/og-image.jpg`,
      email: SITE_CONFIG.contactEmail,
      telephone: SITE_CONFIG.phoneWhatsapp,
      sameAs: [
        SITE_CONFIG.social.linkedin,
        SITE_CONFIG.social.twitter,
        SITE_CONFIG.social.instagram,
        SITE_CONFIG.social.telegram,
        SITE_CONFIG.social.github,
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address.street,
        addressLocality: SITE_CONFIG.address.city,
        addressRegion: SITE_CONFIG.address.region,
        postalCode: SITE_CONFIG.address.postalCode,
        addressCountry: SITE_CONFIG.address.countryCode,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${SITE_CONFIG.baseUrl}${canonicalPath}#professionalservice`,
      name: SITE_CONFIG.name,
      url: `${SITE_CONFIG.baseUrl}${canonicalPath}`,
      telephone: SITE_CONFIG.phoneWhatsapp,
      email: SITE_CONFIG.contactEmail,
      priceRange: SITE_CONFIG.priceRange,
      image: `${SITE_CONFIG.baseUrl}/og-image.jpg`,
      areaServed: SITE_CONFIG.serviceAreas.map((area) => ({
        '@type': 'AdministrativeArea',
        name: area,
      })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital Studio Capabilities',
        itemListElement: SITE_CONFIG.coreServices.map((service, index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
          },
        })),
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address.street,
        addressLocality: SITE_CONFIG.address.city,
        addressRegion: SITE_CONFIG.address.region,
        postalCode: SITE_CONFIG.address.postalCode,
        addressCountry: SITE_CONFIG.address.countryCode,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.6280',
        longitude: '77.3649',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.baseUrl}/#website`,
      url: SITE_CONFIG.baseUrl,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      publisher: {
        '@id': `${SITE_CONFIG.baseUrl}/#organization`,
      },
    },
  ];
}
