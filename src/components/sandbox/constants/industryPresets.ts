import { IndustryKey, IndustryPreset } from '../types';

export const INDUSTRY_PRESETS: Record<IndustryKey, IndustryPreset> = {
  'real-estate': {
    id: 'real-estate',
    label: 'Luxury Real Estate',
    badge: 'Ultra-Luxury Real Estate',
    defaultHeadline: 'Architectural Landmarks Built for Generations',
    defaultSubheadline: 'Curated ultra-luxury penthouses, skyline residences, and beachfront villas in prime metro sectors.',
    defaultCtaText: 'Download Private Inventory',
    defaultPrice: 120000,
    promoText: '⚡ Q3 Investor Allotment: Private Pre-Launch Allocation Live',
    heroTagline: 'Prime Developments & Sovereign Assets',
    metaDescription: 'Explore private high-yield luxury real estate, penthouse portfolios, and architectural landmarks across India and UAE.',
    leadSampleNames: [
      'Vikramaditya Singhania',
      'Ananya Birla Capital',
      'Rohan Mehra & Partners',
      'Devendra Oberoi',
      'Sunita Raheja Family Office',
    ],
    serviceCards: [
      {
        title: 'Skyline Penthouses',
        subtitle: 'Triplex layouts with private helipads and 360° infinity vistas.',
        badge: 'Top Tier 01',
      },
      {
        title: 'Coastal Estates',
        subtitle: 'Direct private marina access with automated smart home glass systems.',
        badge: 'Private 02',
      },
      {
        title: 'Family Office Yields',
        subtitle: 'Turnkey prime commercial leases pre-vetted with institutional guarantees.',
        badge: 'Yield 03',
      },
    ],
  },
  'luxury-hospitality': {
    id: 'luxury-hospitality',
    label: 'Boutique Hospitality',
    badge: 'Boutique Hospitality & Retreats',
    defaultHeadline: 'Sanctuaries of Uncompromising Elegance',
    defaultSubheadline: 'Bespoke cliffside suites, private wellness villas, and Michelin-caliber culinary experiences.',
    defaultCtaText: 'Reserve Exclusive Suite',
    defaultPrice: 85000,
    promoText: '🥂 Weekend Escape: Complimentary Helicopter Transfers on 3+ Night Stays',
    heroTagline: 'Bespoke Experiential Sanctuaries',
    metaDescription: 'Private cliffside suites, Michelin-star culinary dining, and 24/7 dedicated butler service for discerning travelers.',
    leadSampleNames: [
      'Lord Alistair Sterling',
      'Meera Nambiar',
      'Kabir & Tara Kapoor',
      'Siddharth Goenka',
      'Dr. Elena Rossi',
    ],
    serviceCards: [
      {
        title: 'Cliffside Infinity Villas',
        subtitle: 'Heated plunge pools with panoramic sunset views and dedicated butler.',
        badge: 'Suite 01',
      },
      {
        title: 'Artisan Gastronomy',
        subtitle: 'Farm-to-table tasting journeys paired with rare reserve vintages.',
        badge: 'Culinary 02',
      },
      {
        title: 'Holistic Longevity Spa',
        subtitle: 'Sound therapies, thermal springs, and ayurvedic rejuvenation.',
        badge: 'Wellness 03',
      },
    ],
  },
  'aesthetic-clinic': {
    id: 'aesthetic-clinic',
    label: 'Aesthetic Clinic',
    badge: 'Aesthetic & Longevity Clinic',
    defaultHeadline: 'Precision Aesthetics & Cellular Longevity',
    defaultSubheadline: 'Board-certified dermatological surgery, bio-rejuvenation therapies, and advanced laser science.',
    defaultCtaText: 'Schedule Clinical Assessment',
    defaultPrice: 65000,
    promoText: '✦ Diagnostic Consultation Slots Open for Select New Patients',
    heroTagline: 'Cellular Longevity & Precision Dermatology',
    metaDescription: 'Leading surgical dermatology, regenerative longevity protocols, and non-invasive laser facial contouring.',
    leadSampleNames: [
      'Dr. Natasha Sehgal',
      'Arjun Varma',
      'Shreya Chawla',
      'Rhea Singhal',
      'Kunal Bahl',
    ],
    serviceCards: [
      {
        title: 'Cellular Bio-Infusions',
        subtitle: 'Targeted exosome therapy and deep regenerative peptide infusions.',
        badge: 'Clinical 01',
      },
      {
        title: 'Laser Facial Contouring',
        subtitle: 'Micro-focused ultrasonic lifting with zero patient downtime.',
        badge: 'Sculpt 02',
      },
      {
        title: 'Full-Genome Biomarkers',
        subtitle: 'Comprehensive metabolic and biological age optimization mapping.',
        badge: 'Longevity 03',
      },
    ],
  },
  'd2c-luxury': {
    id: 'd2c-luxury',
    label: 'D2C Luxury Atelier',
    badge: 'Haute Horlogerie & Atelier',
    defaultHeadline: 'Handcrafted Horology & Bespoke Leathercraft',
    defaultSubheadline: 'Numbered limited-edition timepieces and handcrafted travel goods forged from aerospace titanium.',
    defaultCtaText: 'Acquire Numbered Piece',
    defaultPrice: 95000,
    promoText: '🔥 Series VII: Only 15 Numbered Pieces Allocated Globally',
    heroTagline: 'Aerospace Horology & Limited Editions',
    metaDescription: 'Handcrafted mechanical tourbillons, bespoke bridle leather luggage, and certified aerospace grade titanium.',
    leadSampleNames: [
      'Zaid Merchant',
      'Aarav Jindal',
      'Tanvi Kothari',
      'Harshvardhan Ruia',
      'Chloe Beaumont',
    ],
    serviceCards: [
      {
        title: 'Series VII Flying Tourbillon',
        subtitle: '72-hour power reserve encased in titanium grade 5 chassis.',
        badge: 'Atelier 01',
      },
      {
        title: 'Bespoke Weekender Luggage',
        subtitle: 'Full-grain Tuscan saddle leather with hand-stitched waxed linen.',
        badge: 'Heritage 02',
      },
      {
        title: 'Custom Monogram Vault',
        subtitle: 'Biometric locking presentation chests lined with Italian alcantara.',
        badge: 'Custom 03',
      },
    ],
  },
};

export const INITIAL_INDUSTRY: IndustryKey = 'real-estate';
