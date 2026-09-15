import { 
  Code2, 
  Sliders, 
  Palette, 
  Sparkles, 
  SearchCode, 
  Layers, 
  Clock,
  LucideIcon
} from 'lucide-react';

export interface ToolCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  purpose: string;
  iconName: string;
  examples: string[];
  toolIds: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface CatalogTool {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  categoryId: string;
  iconName: string;
  route: string;
  badge: string;
  featurePills: string[];
  footerBadge: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'development-qa',
    slug: 'development-qa',
    name: 'Development & QA',
    shortDescription: 'Validate, compare, format, and troubleshoot digital content with practical tools built for developers and technical teams.',
    purpose: 'Engineered for software engineers, frontend developers, and QA specialists to format JSON payloads, inspect diffs, test responsive breakpoints, and audit accessibility.',
    iconName: 'Code2',
    examples: ['JSON Formatter & Validator', 'Text Diff Checker', 'URL Encoder & Decoder'],
    toolIds: [
      'json-formatter-validator',
      'text-diff-checker',
      'url-encoder-decoder',
      'responsive-breakpoint-tester',
      'website-launch-readiness',
      'website-accessibility-auditor',
      'api-request-builder'
    ],
    seoTitle: 'Development & QA Tools | JSON, Text, URL & Website Utilities | SamaXon',
    seoDescription: 'Explore practical development and QA tools for formatting JSON, comparing text revisions, encoding URLs, testing viewports, and auditing web accessibility.',
    seoKeywords: 'developer tools, json formatter validator, text diff checker, url encoder decoder, responsive breakpoint tester, accessibility auditor, website launch readiness, api request builder'
  },
  {
    id: 'ui-planning',
    slug: 'ui-planning',
    name: 'UI Planning',
    shortDescription: 'Plan website structure, technical specifications, editorial content, and project scope before development.',
    purpose: 'Structured tools that help founders, product managers, and agencies define sitemaps, deliverable matrices, sprint timelines, and ROI financial models.',
    iconName: 'Sliders',
    examples: ['AI Project Brief Generator', 'Website Project Scope Builder', 'Website ROI Calculator'],
    toolIds: [
      'website-project-brief',
      'website-project-scope-builder',
      'client-discovery-questionnaire',
      'website-content-brief-generator',
      'roi-calculator'
    ],
    seoTitle: 'UI Planning Tools | Website Project Scope, Briefs & ROI Calculators | SamaXon',
    seoDescription: 'Plan your website architecture, project scope, editorial briefs, and financial ROI models before writing code with client-side planning tools.',
    seoKeywords: 'website planning tools, ai project brief generator, website scope builder, client discovery questionnaire, website content brief, website roi calculator'
  },
  {
    id: 'design-ux',
    slug: 'design-ux',
    name: 'Design & UX',
    shortDescription: 'Prepare, optimize, transform, and enhance visual assets and design systems entirely in your browser.',
    purpose: 'Essential utilities for graphic designers and UI/UX specialists to compress photos to target KB sizes, resize to print standards, upscale to 4K, and vectorize raster icons.',
    iconName: 'Palette',
    examples: ['Photo Compressor', 'Photo Resizer', 'Universal Image Converter'],
    toolIds: [
      'compressor',
      'resizer',
      'converter',
      'bg-remover',
      'upscaler',
      'vectorizer',
      'design-system-generator',
      'image-steganography'
    ],
    seoTitle: 'Design & UX Tools | Image Compressor, Resizer, Converter & Vectorizer | SamaXon',
    seoDescription: 'Client-side design and UX utilities: compress photos to exact KB limits, resize with print fidelity, convert formats, upscale to 4K, and generate design systems.',
    seoKeywords: 'image compressor, photo resizer, image converter, background remover, image upscaler, raster to svg vectorizer, design system generator, image steganography'
  },
  {
    id: 'branding-identity',
    slug: 'branding-identity',
    name: 'Branding & Identity',
    shortDescription: 'Create and prepare practical brand assets, custom vector QR codes, social share previews, and invoices.',
    purpose: 'Specialized generators for entrepreneurs and creators to build custom branded QR codes with embedded logos, preview social share cards, and generate commercial invoices.',
    iconName: 'Sparkles',
    examples: ['QR Code Studio', 'Open Graph Preview Designer', 'Invoice Generator'],
    toolIds: [
      'qr-generator',
      'business-name-generator',
      'open-graph-preview-designer',
      'invoice-generator'
    ],
    seoTitle: 'Branding & Identity Tools | QR Studio, Social Cards & Invoices | SamaXon',
    seoDescription: 'Craft practical brand assets: vector QR codes with embedded logos, Open Graph social share cards, AI business names, and commercial invoices.',
    seoKeywords: 'qr code generator, business name generator, open graph preview designer, invoice generator, brand identity tools'
  },
  {
    id: 'seo-audit',
    slug: 'seo-audit',
    name: 'SEO & Audit',
    shortDescription: 'Inspect website visibility, technical SEO, Core Web Vitals, metadata, canonicals, and competitor gaps.',
    purpose: 'In-depth diagnostic scanners for webmasters and marketers to analyze on-page SEO factors, audit TTFB latency, validate canonical tags, and analyze competitor disparity.',
    iconName: 'SearchCode',
    examples: ['Website SEO Audit Tool', 'Website Speed Checker', 'Canonical URL Validator'],
    toolIds: [
      'website-seo-audit',
      'analyzer',
      'website-speed-checker',
      'canonical-url-validator',
      'utm-campaign-url-builder',
      'internal-link-planner',
      'seo-competitor-gap-analyzer'
    ],
    seoTitle: 'SEO & Audit Tools | Website SEO Health, Speed & Canonical Validators | SamaXon',
    seoDescription: 'Free on-page SEO scanners, Core Web Vitals speed checkers, canonical tag inspectors, competitor gap analyzers, and UTM link builders.',
    seoKeywords: 'website seo audit, website analyzer, website speed checker, canonical url validator, utm builder, internal link planner, seo competitor gap analyzer'
  },
  {
    id: 'documents-pdf',
    slug: 'documents-pdf',
    name: 'Documents & PDF',
    shortDescription: 'Process, convert, merge, and digitally sign documents with 100% in-browser privacy.',
    purpose: 'Secure, client-side document processing for merging PDF files, converting PDF to editable Word DOCX, compressing below target limits, and signing documents locally.',
    iconName: 'Layers',
    examples: ['PDF Tools (Merge/Split/Rotate)', 'PDF to Word Converter', 'PDF Reducer & Digital Signer'],
    toolIds: [
      'pdf-tools',
      'pdf-to-word-converter',
      'pdf-tool'
    ],
    seoTitle: 'Documents & PDF Tools | Merge, Convert to Word & Sign PDFs | SamaXon',
    seoDescription: 'Client-side PDF and document tools: merge, split, rotate pages, convert PDF to Word .docx, compress files, and add verified digital signatures.',
    seoKeywords: 'pdf tools, merge pdf, split pdf, pdf to word converter, pdf reducer signer, client side pdf tools'
  },
  {
    id: 'text-productivity',
    slug: 'text-productivity',
    name: 'Text, Productivity & Utilities',
    shortDescription: 'Everyday writing, calculations, time conversion, privacy compliance, and password tools.',
    purpose: 'Handy everyday tools for counting words, calculating exact age and time zones, solving complex multi-variable calculations, and generating cryptographic passwords.',
    iconName: 'Clock',
    examples: ['Word Counter', 'Password Generator', 'Time Zone Converter'],
    toolIds: [
      'word-counter',
      'password-generator',
      'age-calculator',
      'time-zone-converter',
      'calculator',
      'website-privacy-policy-builder'
    ],
    seoTitle: 'Text, Productivity & Utility Tools | Word Counter, Passwords & Calculators | SamaXon',
    seoDescription: 'Everyday productivity tools: real-time word counter, crypto-secure password generator, age calculator, global time zone converter, and multi-calculator.',
    seoKeywords: 'word counter, password generator, age calculator, time zone converter, universal calculator, privacy policy builder'
  }
];

export const CATALOG_TOOLS: Record<string, CatalogTool> = {
  // Development & QA
  'json-formatter-validator': {
    id: 'json-formatter-validator',
    slug: 'json-formatter-validator',
    name: 'JSON Formatter & Validator',
    shortName: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with clear syntax feedback and visual tree navigation.',
    categoryId: 'development-qa',
    iconName: 'Code2',
    route: '/tools/json-formatter-validator',
    badge: 'RFC 8259 Compliant',
    featurePills: ['Prettify & Compact', 'Visual Tree Navigator', 'Syntax Error Locator'],
    footerBadge: 'RFC 8259 Compliant · 100% In-Browser'
  },
  'text-diff-checker': {
    id: 'text-diff-checker',
    slug: 'text-diff-checker',
    name: 'Text Diff Checker & Revision Inspector',
    shortName: 'Text Diff Checker',
    description: 'Compare two text versions and identify additions, removals, and changes line-by-line.',
    categoryId: 'development-qa',
    iconName: 'GitCompare',
    route: '/tools/text-diff-checker',
    badge: 'LCS High Fidelity',
    featurePills: ['Side-by-Side & Unified', 'Line & Word Diffing', 'LCS Algorithm Precision'],
    footerBadge: 'LCS Diff Engine · 100% Private'
  },
  'url-encoder-decoder': {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    shortName: 'URL Encoder & Decoder',
    description: 'Encode or decode URL text safely for web development, API query parameters, and sharing.',
    categoryId: 'development-qa',
    iconName: 'Code2',
    route: '/tools/url-encoder-decoder',
    badge: 'RFC 3986 Standard',
    featurePills: ['Component & Full URI', 'RFC 3986 Standard', 'ASCII Cheat Sheet'],
    footerBadge: 'RFC 3986 Standard · Instant Transform'
  },
  'responsive-breakpoint-tester': {
    id: 'responsive-breakpoint-tester',
    slug: 'responsive-breakpoint-tester',
    name: 'Responsive Breakpoint & Viewport Tester',
    shortName: 'Responsive Tester',
    description: 'Test URLs across Mobile (375px), Tablet (768px), and Desktop (1280px) with live sandboxed preview.',
    categoryId: 'development-qa',
    iconName: 'Smartphone',
    route: '/tools/responsive-breakpoint-tester',
    badge: 'Multi-Device Suite',
    featurePills: ['Mobile, Tablet, Laptop, 4K', 'Live iFrame Sandboxing', 'Rotate & Custom Dimensions'],
    footerBadge: 'Multi-Device Suite · Live Sandboxed iFrame'
  },
  'website-launch-readiness': {
    id: 'website-launch-readiness',
    slug: 'website-launch-readiness',
    name: 'Website Launch Readiness Checker',
    shortName: 'Launch Readiness',
    description: 'Comprehensive 6-pillar deployment audit with live HTTP probing, blocker grading, and sign-off export.',
    categoryId: 'development-qa',
    iconName: 'CheckSquare',
    route: '/tools/website-launch-readiness',
    badge: 'Pre-Flight Engine',
    featurePills: ['6-Pillar Deployment Audit', 'Live HTTP Pre-Flight Probe', 'Sign-Off Certificate Export'],
    footerBadge: 'Pre-Flight Engine · 100% Free'
  },
  'website-accessibility-auditor': {
    id: 'website-accessibility-auditor',
    slug: 'website-accessibility-auditor',
    name: 'Website Accessibility Auditor',
    shortName: 'Accessibility Auditor',
    description: 'Deep accessibility engine auditing image alt coverage, heading hierarchy, and WCAG 2.1 rules.',
    categoryId: 'development-qa',
    iconName: 'ShieldCheck',
    route: '/tools/website-accessibility-auditor',
    badge: 'WCAG 2.1 AA/AAA',
    featurePills: ['WCAG 2.1 AA/AAA Rules', 'DOM Parser Deep Analysis', 'Interactive Heading Hierarchy'],
    footerBadge: 'WCAG 2.1 AA/AAA Audit · Zero Fake Reports'
  },
  'api-request-builder': {
    id: 'api-request-builder',
    slug: 'api-request-builder',
    name: 'API Request Builder & HTTP Tester',
    shortName: 'API Builder',
    description: 'Interactive REST client for building and executing HTTP requests with custom headers and cURL export.',
    categoryId: 'development-qa',
    iconName: 'Terminal',
    route: '/tools/api-request-builder',
    badge: 'CORS Proxy & cURL',
    featurePills: ['Multi-Method REST Client', 'CORS Proxy Gateway', 'cURL, Fetch & Python Export'],
    footerBadge: 'Zero Secret Logging · Multi-Method Client'
  },

  // UI Planning
  'website-project-brief': {
    id: 'website-project-brief',
    slug: 'website-project-brief',
    name: 'AI Website Project Brief Generator',
    shortName: 'Project Brief AI',
    description: 'Generate comprehensive website project briefs with complete sitemaps, tech specs, and milestone roadmaps.',
    categoryId: 'ui-planning',
    iconName: 'Sparkles',
    route: '/tools/website-project-brief',
    badge: 'Gemini Powered',
    featurePills: ['Strategic Architecture', 'Sitemap & Milestone Roadmap', '1-Click Markdown & PDF Export'],
    footerBadge: 'AI Strategic Architect · Free Forever'
  },
  'website-project-scope-builder': {
    id: 'website-project-scope-builder',
    slug: 'website-project-scope-builder',
    name: 'Website Project Scope Builder',
    shortName: 'Scope Builder',
    description: 'Interactive agency-grade scoping matrix with deliverable selections, role hour allocations, and SOW export.',
    categoryId: 'ui-planning',
    iconName: 'Sliders',
    route: '/tools/website-project-scope-builder',
    badge: 'Agency Work-Matrix',
    featurePills: ['Scope Matrix & Deliverables', 'Sprint Timeline & Roles', 'Statement of Work (SOW)'],
    footerBadge: 'Agency Work-Matrix · Statement of Work Export'
  },
  'client-discovery-questionnaire': {
    id: 'client-discovery-questionnaire',
    slug: 'client-discovery-questionnaire',
    name: 'Client Discovery Questionnaire',
    shortName: 'Client Discovery',
    description: 'Agency-grade 10-stage project intake questionnaire for scoping sitemaps, technical integrations, and design.',
    categoryId: 'ui-planning',
    iconName: 'FileText',
    route: '/tools/client-discovery-questionnaire',
    badge: '10-Stage Blueprint',
    featurePills: ['10-Stage Strategic Blueprint', 'Interactive Page Sitemap', 'Asset Readiness Scoring'],
    footerBadge: 'Executive Strategic Blueprint · Instant Export'
  },
  'website-content-brief-generator': {
    id: 'website-content-brief-generator',
    slug: 'website-content-brief-generator',
    name: 'Website Content Brief Generator',
    shortName: 'Content Brief',
    description: 'High-intent editorial briefs with search intent mapping, target keyword clustering, and heading outlines.',
    categoryId: 'ui-planning',
    iconName: 'FileEdit',
    route: '/tools/website-content-brief-generator',
    badge: 'Editorial Blueprint',
    featurePills: ['Search Intent & Keyword Map', 'H1/H2/H3 Heading Architecture', 'Copywriter Blueprint Export'],
    footerBadge: 'Editorial Strategy Engine · Instant Export'
  },
  'roi-calculator': {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    name: 'Website ROI & Value Calculator',
    shortName: 'ROI Calculator',
    description: 'Model revenue growth, lead multipliers, and conversion acceleration with interactive 3-year projections.',
    categoryId: 'ui-planning',
    iconName: 'TrendingUp',
    route: '/tools/roi-calculator',
    badge: 'Executive Model',
    featurePills: ['Conversion & Lead Model', '3-Year Financial Forecast', 'Interactive Chart Visualization'],
    footerBadge: 'Executive Financial Model · Real-Time Chart'
  },

  // Design & UX
  'compressor': {
    id: 'compressor',
    slug: 'compressor',
    name: 'Ultra-Fast Photo Compressor',
    shortName: 'Photo Compressor',
    description: 'Compress high-resolution images down to targeted KB limits (<20KB, <50KB, <100KB) with instant preview.',
    categoryId: 'design-ux',
    iconName: 'Minimize2',
    route: '/tools/compressor',
    badge: 'Lossless & Web',
    featurePills: ['Target KB Precision', 'Client-Side Canvas', 'Real-Time File Comparison'],
    footerBadge: 'Lossless WebP · 1-Click Export'
  },
  'resizer': {
    id: 'resizer',
    slug: 'resizer',
    name: 'Photo Resizer & Transformer',
    shortName: 'Photo Resizer',
    description: 'Resize by pixels, cm, mm, inch or percentage with aspect-ratio locking and 300 DPI print fidelity.',
    categoryId: 'design-ux',
    iconName: 'Crop',
    route: '/tools/resizer',
    badge: '300 DPI Print',
    featurePills: ['Passport & Visa Presets', '300 DPI Print Fidelity', 'Cover & Contain Scaling'],
    footerBadge: '300 DPI · Free Forever'
  },
  'converter': {
    id: 'converter',
    slug: 'converter',
    name: 'Universal Batch Image Converter',
    shortName: 'Image Converter',
    description: 'Convert between PNG, JPG, WEBP, AVIF, BMP, GIF, and ICO standards instantly in-browser.',
    categoryId: 'design-ux',
    iconName: 'RefreshCw',
    route: '/tools/converter',
    badge: 'Multi-Format',
    featurePills: ['WEBP · PNG · JPG · ICO', 'Batch ZIP Export', 'Alpha Transparency'],
    footerBadge: '100% Client-Side · Unlimited'
  },
  'bg-remover': {
    id: 'bg-remover',
    slug: 'bg-remover',
    name: 'AI Background Remover Studio',
    shortName: 'Background Remover',
    description: 'Neural segmentation to isolate portrait and product backgrounds with zero server uploads.',
    categoryId: 'design-ux',
    iconName: 'Wand2',
    route: '/tools/bg-remover',
    badge: 'Smart Isolation',
    featurePills: ['Smart Edge Isolation', 'Studio Presets', 'Custom Color Backdrops'],
    footerBadge: 'In-Browser Matting · Zero Uploads'
  },
  'upscaler': {
    id: 'upscaler',
    slug: 'upscaler',
    name: 'AI Image 4K Upscaler',
    shortName: 'Image Upscaler',
    description: 'Enhance low-resolution graphics up to 4K using in-browser super-resolution and GPU acceleration.',
    categoryId: 'design-ux',
    iconName: 'Sparkles',
    route: '/tools/upscaler',
    badge: '4K Ultra',
    featurePills: ['4K Super-Resolution', 'Unsharp Detail Enhancer', 'Bicubic GPU Acceleration'],
    footerBadge: 'GPU Accelerated · No Watermarks'
  },
  'vectorizer': {
    id: 'vectorizer',
    slug: 'vectorizer',
    name: 'Raster to SVG Vectorizer',
    shortName: 'SVG Vectorizer',
    description: 'Convert raster logos, icons, and artwork into infinitely scalable SVG paths with bezier smoothing.',
    categoryId: 'design-ux',
    iconName: 'ImageIcon',
    route: '/tools/vectorizer',
    badge: 'Crisp Vector',
    featurePills: ['Infinite Scalable SVG', 'Bezier Edge Smoothing', 'Clean Copyable XML'],
    footerBadge: 'Crisp Vector Paths · Clean Code'
  },
  'design-system-generator': {
    id: 'design-system-generator',
    slug: 'design-system-generator',
    name: 'Design System Architecture Generator',
    shortName: 'Design System',
    description: 'Create multi-brand design tokens, mathematical typography scales, and WCAG contrast verified palettes.',
    categoryId: 'design-ux',
    iconName: 'Palette',
    route: '/tools/design-system-generator',
    badge: 'Token Studio',
    featurePills: ['Design Tokens & Palettes', 'WCAG AA/AAA Math', 'Tailwind & CSS Code Export'],
    footerBadge: 'Design Token Engine · Tailwind Ready'
  },
  'image-steganography': {
    id: 'image-steganography',
    slug: 'image-steganography',
    name: 'Image Steganography & Encryptor',
    shortName: 'Steganography',
    description: 'Hide encrypted messages or files inside an image and extract them later with Web Crypto AES-256.',
    categoryId: 'design-ux',
    iconName: 'Lock',
    route: '/tools/image-steganography',
    badge: 'AES-256 & LSB',
    featurePills: ['In-Browser Web Crypto', 'Lossless Canvas LSB', 'Password Protected Secret'],
    footerBadge: '100% In-Browser · Cryptographic Privacy'
  },

  // Branding & Identity
  'qr-generator': {
    id: 'qr-generator',
    slug: 'qr-generator',
    name: 'Custom Vector QR Code Studio',
    shortName: 'QR Studio',
    description: 'Generate customizable vector QR codes for URLs, WiFi, vCards, UPI, and SMS with embedded center logos.',
    categoryId: 'branding-identity',
    iconName: 'QrCode',
    route: '/tools/qr-generator',
    badge: 'Vector & Logo',
    featurePills: ['URL, WiFi, vCard, UPI & SMS', 'Embedded Brand Logo', 'Crisp SVG & PNG Export'],
    footerBadge: 'Custom Vector Studio · Zero Data Logging'
  },
  'business-name-generator': {
    id: 'business-name-generator',
    slug: 'business-name-generator',
    name: 'AI Business & Brand Name Generator',
    shortName: 'Business Name AI',
    description: 'Generate distinctive brand names with linguistic rationales, phonetic guides, and domain availability.',
    categoryId: 'branding-identity',
    iconName: 'Sparkles',
    route: '/tools/business-name-generator',
    badge: 'Linguistic AI',
    featurePills: ['AI Linguistic Synthesis', 'Latin Roots & Phonetics', 'Domain Availability & Dossier'],
    footerBadge: 'Linguistic AI Generator · Trademark Ready'
  },
  'open-graph-preview-designer': {
    id: 'open-graph-preview-designer',
    slug: 'open-graph-preview-designer',
    name: 'Open Graph Preview Designer',
    shortName: 'Open Graph Designer',
    description: 'Interactive social card studio rendering live Google, Facebook, Twitter, and LinkedIn previews.',
    categoryId: 'branding-identity',
    iconName: 'Share2',
    route: '/tools/open-graph-preview-designer',
    badge: '1200×630 Canvas',
    featurePills: ['1200×630 Canvas Renderer', 'Google, FB, X, LinkedIn Live', 'Meta Tag Code & PNG Export'],
    footerBadge: 'HTML5 Canvas Studio · 1200×630 Export'
  },
  'invoice-generator': {
    id: 'invoice-generator',
    slug: 'invoice-generator',
    name: 'Professional Luxury Invoice Generator',
    shortName: 'Invoice Studio',
    description: 'Generate clean commercial invoices with automatic subtotal, tax/GST calculations, and PDF print export.',
    categoryId: 'branding-identity',
    iconName: 'FileText',
    route: '/tools/invoice-generator',
    badge: 'Print Ready',
    featurePills: ['GST & Tax Calculation Engine', 'Compliant Print-to-PDF Format', 'Local Storage Template Saver'],
    footerBadge: 'Official Commercial Standard · Print Ready'
  },

  // SEO & Audit
  'website-seo-audit': {
    id: 'website-seo-audit',
    slug: 'website-seo-audit',
    name: 'Website SEO Audit Tool',
    shortName: 'SEO Audit Tool',
    description: 'Inspect on-page SEO health: SERP preview simulator, heading hierarchy, image alt accessibility, and code fixes.',
    categoryId: 'seo-audit',
    iconName: 'SearchCode',
    route: '/tools/website-seo-audit',
    badge: 'Technical Scanner',
    featurePills: ['SERP Preview Simulator', 'Missing Alt & Headings Map', 'Instant Copyable Code Fixes'],
    footerBadge: 'Deep On-Page & SERP Crawler · 100% Free'
  },
  'analyzer': {
    id: 'analyzer',
    slug: 'analyzer',
    name: 'Website Security, Bug & SEO Audit Engine',
    shortName: 'Website Analyzer',
    description: 'Enter any website URL to perform a full technical audit: security vulnerabilities, SSL status, and code bugs.',
    categoryId: 'seo-audit',
    iconName: 'SearchCode',
    route: '/tools/analyzer',
    badge: 'Deep Inspection',
    featurePills: ['SSL & Security Vulnerabilities', 'Code Bugs & Missing Alt Tags', 'Missing SEO Keywords Engine'],
    footerBadge: 'Deep Diagnostic Scan · 100% Free'
  },
  'website-speed-checker': {
    id: 'website-speed-checker',
    slug: 'website-speed-checker',
    name: 'Website Speed Checker & Core Web Vitals',
    shortName: 'Speed Checker',
    description: 'High-precision TTFB, simulated Core Web Vitals (LCP, CLS, INP), and CSS animation jank diagnostic.',
    categoryId: 'seo-audit',
    iconName: 'Gauge',
    route: '/tools/website-speed-checker',
    badge: 'Lab Benchmark',
    featurePills: ['Time to First Byte (TTFB)', 'Core Web Vitals Simulation', 'CSS Animation Jank Analyzer'],
    footerBadge: 'Millisecond Network Diagnostics · 100% Free'
  },
  'canonical-url-validator': {
    id: 'canonical-url-validator',
    slug: 'canonical-url-validator',
    name: 'Canonical URL Validator & Tag Inspector',
    shortName: 'Canonical Validator',
    description: 'Deep canonical tag verification, normalization analysis, tracking parameter stripping, and HTTP inspection.',
    categoryId: 'seo-audit',
    iconName: 'SearchCode',
    route: '/tools/canonical-url-validator',
    badge: 'RFC 6596 Engine',
    featurePills: ['RFC 6596 Syntax Audit', 'HTML Tag & Header Probe', 'Normalizer & UTM Stripper'],
    footerBadge: 'RFC 6596 Standard Engine · 100% Free'
  },
  'utm-campaign-url-builder': {
    id: 'utm-campaign-url-builder',
    slug: 'utm-campaign-url-builder',
    name: 'UTM Campaign URL Builder',
    shortName: 'UTM URL Builder',
    description: 'Create trackable Google Analytics (GA4) campaign URLs with structured UTM parameters and instant copy.',
    categoryId: 'seo-audit',
    iconName: 'Link2',
    route: '/tools/utm-campaign-url-builder',
    badge: 'Attribution Engine',
    featurePills: ['GA4 Attribution Links', 'Collision Shield', 'Clean Syntax Preview'],
    footerBadge: 'Attribution Standard · Instant Copy'
  },
  'internal-link-planner': {
    id: 'internal-link-planner',
    slug: 'internal-link-planner',
    name: 'Internal Link Planner & Topic Cluster Architect',
    shortName: 'Internal Link Planner',
    description: 'Model topic clusters, pillar-spoke hierarchies, anchor text distribution, and click-depth calculation.',
    categoryId: 'seo-audit',
    iconName: 'Network',
    route: '/tools/internal-link-planner',
    badge: 'Topic Cluster Graph',
    featurePills: ['Topic Cluster & Pillar Graph', 'Click-Depth & Inbound Matrix', 'JSON-LD Navigation Schema'],
    footerBadge: 'Topic Cluster Architect · JSON-LD Schema'
  },
  'seo-competitor-gap-analyzer': {
    id: 'seo-competitor-gap-analyzer',
    slug: 'seo-competitor-gap-analyzer',
    name: 'SEO Competitor Gap Analyzer',
    shortName: 'Competitor Analyzer',
    description: 'Audit your domain side-by-side against commercial rivals: content depth deficits, latency gaps, and schema omissions.',
    categoryId: 'seo-audit',
    iconName: 'GitCompare',
    route: '/tools/seo-competitor-gap-analyzer',
    badge: 'Disparity Matrix',
    featurePills: ['Side-by-Side Diagnostic', 'Content Depth & Latency', 'Actionable Gap Dossier'],
    footerBadge: 'Competitive Disparity Matrix · Full Dossier'
  },

  // Documents & PDF
  'pdf-tools': {
    id: 'pdf-tools',
    slug: 'pdf-tools',
    name: 'PDF Tools (Merge, Split, Rotate & Extract)',
    shortName: 'PDF Tools',
    description: 'Merge multiple PDFs, split by custom ranges, rotate pages, and extract subsets with complete local privacy.',
    categoryId: 'documents-pdf',
    iconName: 'Layers',
    route: '/tools/pdf-tools',
    badge: '100% In-Browser',
    featurePills: ['Merge Multiple PDFs', 'Visual Page Reorder & Rotate', 'Split by Custom Range'],
    footerBadge: '100% In-Browser · Zero Uploads'
  },
  'pdf-to-word-converter': {
    id: 'pdf-to-word-converter',
    slug: 'pdf-to-word-converter',
    name: 'PDF to Word Converter',
    shortName: 'PDF to Word',
    description: 'Convert text-based PDF documents into fully editable Microsoft Word (.docx) with structured headings.',
    categoryId: 'documents-pdf',
    iconName: 'FileCheck',
    route: '/tools/pdf-to-word-converter',
    badge: 'DOCX Generator',
    featurePills: ['Extract Text & Headings', 'Generate Microsoft Word .docx', '100% In-Browser Privacy'],
    footerBadge: 'Editable DOCX · 100% Private'
  },
  'pdf-tool': {
    id: 'pdf-tool',
    slug: 'pdf-tool',
    name: 'PDF Reducer & Digital Signer',
    shortName: 'PDF Signer',
    description: 'Shrink heavy PDFs to government specs (<100KB, <500KB) and draw, type, or affix verified signatures.',
    categoryId: 'documents-pdf',
    iconName: 'FileText',
    route: '/tools/pdf-tool',
    badge: 'Unlimited MB',
    featurePills: ['Compress Under 100KB', 'Draw, Type or Scan Sign', 'Interactive Drag Placement'],
    footerBadge: 'Official Govt Specs · Zero Uploads'
  },

  // Text, Productivity & Utilities
  'word-counter': {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter & Text Analyzer',
    shortName: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, reading time, speaking time, and keyword density.',
    categoryId: 'text-productivity',
    iconName: 'FileText',
    route: '/tools/word-counter',
    badge: 'Real-Time Stats',
    featurePills: ['Word & Character Counts', 'Reading & Speaking Time', 'Keyword Density & Multilingual'],
    footerBadge: 'Real-Time Stats · Multilingual'
  },
  'password-generator': {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Cryptographic Password Generator',
    shortName: 'Password Generator',
    description: 'Generate cryptographically secure random passwords and memorable multi-word passphrases with entropy scores.',
    categoryId: 'text-productivity',
    iconName: 'KeyRound',
    route: '/tools/password-generator',
    badge: 'Crypto Random',
    featurePills: ['window.crypto Cryptographic Engine', 'Memorable Multi-Word Passphrases', 'Entropy Bits & Strength Score'],
    footerBadge: 'Crypto-Secure · Entropy Scored'
  },
  'age-calculator': {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator & Chrono Milestones',
    shortName: 'Age Calculator',
    description: 'Calculate exact age in years, months, and days with total hours, leap year math, and birthday countdowns.',
    categoryId: 'text-productivity',
    iconName: 'Calendar',
    route: '/tools/age-calculator',
    badge: 'Precision Chrono',
    featurePills: ['Exact Years, Months, Days', 'Upcoming Birthday Countdown', 'Total Hours & Leap Year Math'],
    footerBadge: 'Exact Precision · Leap Year Math'
  },
  'time-zone-converter': {
    id: 'time-zone-converter',
    slug: 'time-zone-converter',
    name: 'Time Zone Converter & Meeting Scheduler',
    shortName: 'Time Zone Converter',
    description: 'Convert dates and times across global international time zones with accurate Daylight Saving Time calculations.',
    categoryId: 'text-productivity',
    iconName: 'Clock',
    route: '/tools/time-zone-converter',
    badge: 'Accurate DST',
    featurePills: ['Accurate DST Calculation', 'Multi-City Office Matrix', 'Relative Day Detection'],
    footerBadge: 'Intl tzdb Standard · Accurate DST'
  },
  'calculator': {
    id: 'calculator',
    slug: 'calculator',
    name: 'Universal Multi-Calculator',
    shortName: 'Calculator Suite',
    description: 'Complete multi-paradigm calculator: Standard Basic, Scientific Pro, Loan EMI, GST solver, and SIP models.',
    categoryId: 'text-productivity',
    iconName: 'Calculator',
    route: '/tools/calculator',
    badge: 'Pro Engine',
    featurePills: ['Basic & Scientific Pro', 'Loan EMI & GST Solver', 'SIP Wealth & Unit Matrix'],
    footerBadge: 'Tactile Audio · Keyboard Ready'
  },
  'website-privacy-policy-builder': {
    id: 'website-privacy-policy-builder',
    slug: 'website-privacy-policy-builder',
    name: 'Website Privacy Policy & Data Governance Builder',
    shortName: 'Privacy Policy Builder',
    description: 'Construct legally structured privacy policies aligned with DPDPA, GDPR, and global data privacy standards.',
    categoryId: 'text-productivity',
    iconName: 'Lock',
    route: '/tools/website-privacy-policy-builder',
    badge: 'DPDPA & GDPR Compliant',
    featurePills: ['DPDPA & GDPR Compliant', 'Sub-Processor Registry', 'HTML & Markdown Export'],
    footerBadge: 'DPDPA & GDPR Standard · Clean HTML & Markdown'
  }
};

/**
 * Accessor Helpers
 */
export function getAllCategories(): ToolCategory[] {
  return TOOL_CATEGORIES;
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return TOOL_CATEGORIES.find(c => c.slug === clean || c.id === clean);
}

export function getCategoryForTool(toolId: string): ToolCategory | undefined {
  const tool = CATALOG_TOOLS[toolId];
  if (!tool) return undefined;
  return TOOL_CATEGORIES.find(c => c.id === tool.categoryId);
}

export function getToolsForCategory(categoryId: string): CatalogTool[] {
  const category = getCategoryBySlug(categoryId);
  if (!category) return [];
  return category.toolIds
    .map(id => CATALOG_TOOLS[id])
    .filter((t): t is CatalogTool => !!t);
}

export function getAllCatalogTools(): CatalogTool[] {
  return Object.values(CATALOG_TOOLS);
}

export function getCatalogToolById(id: string): CatalogTool | undefined {
  return CATALOG_TOOLS[id];
}

/**
 * Schema.org Generators for Category Pages
 */
export function generateCategoryBreadcrumbSchema(category: ToolCategory) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://samaxon.site/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://samaxon.site/tools'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://samaxon.site/tools/category/${category.slug}`
      }
    ]
  };
}

export function generateCategoryCollectionSchema(category: ToolCategory, tools: CatalogTool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.seoTitle,
    description: category.seoDescription,
    url: `https://samaxon.site/tools/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        description: tool.description,
        url: `https://samaxon.site${tool.route}`
      }))
    }
  };
}
