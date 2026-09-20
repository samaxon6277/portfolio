// Studio Digital Tools Configuration and Status Management
// Allows Admin to enable/disable any tool with instant real-time synchronization

export interface ToolItemConfig {
  id: 
    | 'website-launch-readiness'
    | 'website-project-scope-builder'
    | 'design-system-generator'
    | 'website-accessibility-auditor'
    | 'website-content-brief-generator'
    | 'open-graph-preview-designer'
    | 'internal-link-planner'
    | 'responsive-breakpoint-tester'
    | 'seo-competitor-gap-analyzer'
    | 'website-privacy-policy-builder'
    | 'seo-geo-aeo-research'
    | 'website-seo-audit' 
    | 'website-speed-checker' 
    | 'website-project-brief' 
    | 'roi-calculator' 
    | 'qr-generator' 
    | 'business-name-generator' 
    | 'invoice-generator' 
    | 'canonical-url-validator' 
    | 'api-request-builder' 
    | 'client-discovery-questionnaire' 
    | 'pdf-tools'
    | 'pdf-to-word-converter'
    | 'password-generator'
    | 'word-counter'
    | 'age-calculator'
    | 'json-formatter-validator'
    | 'utm-campaign-url-builder'
    | 'time-zone-converter'
    | 'text-diff-checker'
    | 'url-encoder-decoder'
    | 'image-steganography'
    | 'analyzer' 
    | 'converter' 
    | 'calculator' 
    | 'compressor' 
    | 'resizer' 
    | 'pdf-tool' 
    | 'bg-remover' 
    | 'upscaler' 
    | 'vectorizer'
    | 'glassmorphism-neumorphism-generator'
    | 'svg-optimizer'
    | 'cron-generator'
    | 'regex-tester'
    | 'markdown-to-html'
    | 'jwt-debugger'
    | 'favicon-generator'
    | 'whatsapp-link-generator'
    | 'css-animation-builder'
    | 'color-contrast-checker';
  name: string;
  shortName: string;
  category: 'SEO & Audit' | 'Speed & Vitals' | 'AI Planning' | 'Finance & ROI' | 'Branding & Identity' | 'Image' | 'Document' | 'Productivity' | 'AI Neural' | 'Development & QA' | 'Design & UX' | 'Legal & Compliance';
  badge: string;
  description: string;
  enabled: boolean;
  maintenanceNotice?: string;
  iconName: string;
}

export const DEFAULT_TOOLS_CONFIG: ToolItemConfig[] = [
  {
    id: 'website-launch-readiness',
    name: 'Website Launch Readiness & Pre-Flight Gate Checker',
    shortName: 'Launch Readiness',
    category: 'Development & QA',
    badge: 'Pre-Flight Engine',
    description: 'Comprehensive 6-pillar deployment audit with automated live HTTP probing, blocker grading, launch verdicts, and client sign-off certificate export.',
    enabled: true,
    iconName: 'CheckSquare'
  },
  {
    id: 'website-project-scope-builder',
    name: 'Website Project Scope & Technical Estimator',
    shortName: 'Scope Builder',
    category: 'AI Planning',
    badge: 'Agency Work-Matrix',
    description: 'Interactive agency-grade scoping matrix with deliverable selections, role hour allocations, realistic sprint timelines, and Statement of Work (SOW) exports.',
    enabled: true,
    iconName: 'Sliders'
  },
  {
    id: 'design-system-generator',
    name: 'Design System & Style Guide Architecture Generator',
    shortName: 'Design System',
    category: 'Design & UX',
    badge: 'Token Studio',
    description: 'Create multi-brand design tokens, mathematical typography scales, WCAG AA/AAA contrast verified palettes, and export to Tailwind CSS, CSS variables, and Figma tokens.',
    enabled: true,
    iconName: 'Palette'
  },
  {
    id: 'website-accessibility-auditor',
    name: 'Website Accessibility Auditor & WCAG 2.1 Scanner',
    shortName: 'Accessibility Auditor',
    category: 'Development & QA',
    badge: 'WCAG 2.1 AA/AAA',
    description: 'Deep accessibility engine auditing image alt coverage, heading order hierarchy, form label bindings, color contrast, touch targets, and ARIA attributes.',
    enabled: true,
    iconName: 'ShieldCheck'
  },
  {
    id: 'website-content-brief-generator',
    name: 'Website Content Brief & Editorial Strategy Generator',
    shortName: 'Content Brief',
    category: 'AI Planning',
    badge: 'Editorial Blueprint',
    description: 'High-intent editorial briefs with search intent mapping, target keyword clustering, heading outlines (H1/H2/H3), conversion CTAs, and copywriter guidelines.',
    enabled: true,
    iconName: 'FileEdit'
  },
  {
    id: 'open-graph-preview-designer',
    name: 'Open Graph Preview Designer & Social Card Generator',
    shortName: 'Open Graph Designer',
    category: 'Branding & Identity',
    badge: '1200×630 Canvas',
    description: 'Interactive social card studio rendering live Google SERP, Facebook, Twitter, and LinkedIn previews with real-time HTML5 Canvas 1200×630 banner generation.',
    enabled: true,
    iconName: 'Share2'
  },
  {
    id: 'internal-link-planner',
    name: 'Internal Link Planner & Topic Cluster Architect',
    shortName: 'Internal Link Planner',
    category: 'SEO & Audit',
    badge: 'Topic Cluster Graph',
    description: 'Model topic clusters, pillar-spoke hierarchies, anchor text distribution, click-depth calculation, and export JSON-LD SiteNavigationElement schema.',
    enabled: true,
    iconName: 'Network'
  },
  {
    id: 'responsive-breakpoint-tester',
    name: 'Responsive Breakpoint & Multi-Device Viewport Tester',
    shortName: 'Responsive Tester',
    category: 'Development & QA',
    badge: 'Multi-Device Suite',
    description: 'Test URLs across Mobile (375px, 390px), Tablet (768px, 820px), Laptop (1024px, 1280px), and Ultra-wide (1920px) with live iframe rotation and zoom controls.',
    enabled: true,
    iconName: 'Smartphone'
  },
  {
    id: 'seo-competitor-gap-analyzer',
    name: 'SEO Competitor Gap Analyzer & Benchmark Engine',
    shortName: 'Competitor Analyzer',
    category: 'SEO & Audit',
    badge: 'Disparity Matrix',
    description: 'Audit your domain side-by-side against commercial rivals. Uncover content depth deficits, latency gaps, schema markup omissions, and tactical organic advantages.',
    enabled: true,
    iconName: 'GitCompare'
  },
  {
    id: 'website-privacy-policy-builder',
    name: 'Website Privacy Policy & Data Governance Builder',
    shortName: 'Privacy Policy Builder',
    category: 'Legal & Compliance',
    badge: 'DPDPA & GDPR Compliant',
    description: 'Construct complete, legally structured privacy policies aligned with the Digital Personal Data Protection Act (DPDPA), GDPR, and global data privacy standards.',
    enabled: true,
    iconName: 'Lock'
  },
  {
    id: 'canonical-url-validator',
    name: 'Canonical URL Validator & Tag Inspector',
    shortName: 'Canonical Validator',
    category: 'SEO & Audit',
    badge: 'RFC 6596 Engine',
    description: 'Deep canonical tag verification, normalization analysis, tracking parameter stripping, HTTP header inspection, and HTML head directive audit.',
    enabled: true,
    iconName: 'SearchCode'
  },
  {
    id: 'api-request-builder',
    name: 'API Request Builder & Full-Spectrum HTTP Tester',
    shortName: 'API Builder',
    category: 'Productivity',
    badge: 'CORS Proxy & cURL',
    description: 'Interactive REST client for building and executing HTTP requests with custom headers, body payloads, authentication tokens, and multi-language code export.',
    enabled: true,
    iconName: 'Terminal'
  },
  {
    id: 'client-discovery-questionnaire',
    name: 'Executive Client Discovery Questionnaire & Strategic Brief',
    shortName: 'Client Discovery',
    category: 'AI Planning',
    badge: '10-Stage Strategic Blueprint',
    description: 'Agency-grade 10-stage project intake questionnaire for scoping sitemaps, technical integrations, design aesthetics, and asset readiness scoring.',
    enabled: true,
    iconName: 'FileText'
  },
  {
    id: 'seo-geo-aeo-research',
    name: 'SEO, GEO & AEO Deep Research Suite',
    shortName: 'SEO / GEO / AEO Research',
    category: 'SEO & Audit',
    badge: 'Deep Intelligence',
    description: 'Deep technical research evaluating traditional Google Search SEO, Generative AI Engine Optimization (ChatGPT, Perplexity, Claude), and Voice Answer Engine Optimization (FAQ schema, question parsing, direct citations).',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'website-seo-audit',
    name: 'Website SEO Audit Tool (Technical & Meta Scanner)',
    shortName: 'SEO Audit Tool',
    category: 'SEO & Audit',
    badge: 'Flagship Tool',
    description: 'Deep on-page and technical SEO scanner: Google SERP preview, heading structure hierarchy, image alt accessibility, canonical & robots status, and instant copyable fixes.',
    enabled: true,
    iconName: 'SearchCode'
  },
  {
    id: 'website-speed-checker',
    name: 'Website Speed Checker & Core Web Vitals Diagnostic',
    shortName: 'Speed Checker',
    category: 'Speed & Vitals',
    badge: 'Lab Benchmark',
    description: 'High-precision TTFB, simulated Core Web Vitals (LCP, CLS, INP), Brotli compression check, asset payload breakdown, and CSS animation layout jank diagnostic.',
    enabled: true,
    iconName: 'Gauge'
  },
  {
    id: 'website-project-brief',
    name: 'AI Website Project Brief Generator',
    shortName: 'Project Brief AI',
    category: 'AI Planning',
    badge: 'Gemini Powered',
    description: 'Generate comprehensive, SaaS-grade website project briefs with complete page sitemaps, tech stack specs, user flows, and milestone timelines tailored to your industry.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'roi-calculator',
    name: 'Website ROI & Business Value Calculator',
    shortName: 'ROI Calculator',
    category: 'Finance & ROI',
    badge: 'Executive Model',
    description: 'Model exact revenue growth, lead multiplier, conversion rate acceleration, and payback timelines with interactive 3-year scenario projection charts.',
    enabled: true,
    iconName: 'TrendingUp'
  },
  {
    id: 'qr-generator',
    name: 'Custom Vector QR Code Studio',
    shortName: 'QR Studio',
    category: 'Branding & Identity',
    badge: 'Vector & Logo',
    description: 'Generate customizable vector QR codes for URLs, WiFi networks, vCards, UPI payments, and SMS with embedded center logos, corner styles, and SVG/PNG exports.',
    enabled: true,
    iconName: 'QrCode'
  },
  {
    id: 'business-name-generator',
    name: 'AI Business & Brand Name Generator',
    shortName: 'Business Name AI',
    category: 'Branding & Identity',
    badge: 'Linguistic AI',
    description: 'Generate distinctive, trademarkable brand names with linguistic rationales, phonetic guides, domain suggestions, and exportable brand briefs.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'invoice-generator',
    name: 'Professional Luxury Invoice Generator',
    shortName: 'Invoice Studio',
    category: 'Finance & ROI',
    badge: 'Print Ready',
    description: 'Generate clean, compliant, executive commercial invoices with automatic subtotal, tax/GST calculations, vector print export, and local template saving.',
    enabled: true,
    iconName: 'FileText'
  },
  {
    id: 'analyzer',
    name: 'Website Security, Bug & SEO Audit Engine',
    shortName: 'Website Analyzer',
    category: 'SEO & Audit',
    badge: 'Deep Inspection',
    description: 'Enter any website URL to perform a full technical audit: detect security vulnerabilities, broken tags, SSL status, missing SEO keywords, code bugs, and performance scores.',
    enabled: true,
    iconName: 'SearchCode'
  },
  {
    id: 'converter',
    name: 'Universal Batch Image Converter',
    shortName: 'Image Converter',
    category: 'Image',
    badge: 'Multi-Format',
    description: 'Convert between PNG, JPG, WEBP, AVIF, BMP, GIF, and ICO favicon standards instantly in-browser. Zero server uploads and 1-click batch ZIP downloads.',
    enabled: true,
    iconName: 'RefreshCw'
  },
  {
    id: 'image-steganography',
    name: 'Image Steganography',
    shortName: 'Steganography',
    category: 'Image',
    badge: 'AES-256 & LSB',
    description: 'Hide encrypted messages or files inside an image and extract them later using this tool. 100% in-browser Web Crypto and lossless canvas LSB embedding.',
    enabled: true,
    iconName: 'Lock'
  },
  {
    id: 'calculator',
    name: 'Universal Multi-Calculator',
    shortName: 'Calculator Suite',
    category: 'Productivity',
    badge: 'Pro Engine',
    description: 'Complete multi-paradigm calculator: Standard Basic, Scientific Pro (trig, roots, calculus), Loan & EMI planner, GST & tax solver, Mutual Fund SIP, and unit converter.',
    enabled: true,
    iconName: 'Calculator'
  },
  {
    id: 'compressor',
    name: 'Ultra-Fast Photo Compressor',
    shortName: 'Photo Compressor',
    category: 'Image',
    badge: 'Lossless & Web',
    description: 'Compress high-resolution images down to targeted KB limits (<20KB, <50KB, <100KB) with instant preview, zero server uploads, and batch export.',
    enabled: true,
    iconName: 'Minimize2'
  },
  {
    id: 'resizer',
    name: 'Photo Resizer & Transformer',
    shortName: 'Photo Resizer',
    category: 'Image',
    badge: '300 DPI Print',
    description: 'Resize by pixels, cm, mm, inch or percentage with aspect-ratio locking and 300 DPI print fidelity. Includes 1-click official ID standards (Indian Passport 3.5×4.5cm, US Visa 2×2").',
    enabled: true,
    iconName: 'Crop'
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools (Merge, Split, Rotate & Extract)',
    shortName: 'PDF Tools',
    category: 'Document',
    badge: '100% In-Browser',
    description: 'Merge multiple PDFs, split by custom page ranges, rotate pages, reorder visually, and extract page subsets with complete local privacy and zero server uploads.',
    enabled: true,
    iconName: 'Layers'
  },
  {
    id: 'pdf-to-word-converter',
    name: 'PDF to Word Converter',
    shortName: 'PDF to Word',
    category: 'Document',
    badge: 'DOCX Generator',
    description: 'Convert text-based PDF documents into fully editable Microsoft Word (.docx) documents with structured headings, paragraphs, and 100% in-browser privacy.',
    enabled: true,
    iconName: 'FileCheck'
  },
  {
    id: 'password-generator',
    name: 'Password Generator (Random & Memorable Passphrase)',
    shortName: 'Password Generator',
    category: 'Productivity',
    badge: 'Crypto Random',
    description: 'Generate cryptographically secure random passwords and memorable multi-word passphrases with entropy scores and customizable symbol, number, and case rules.',
    enabled: true,
    iconName: 'KeyRound'
  },
  {
    id: 'word-counter',
    name: 'Word Counter & Text Analyzer',
    shortName: 'Word Counter',
    category: 'Productivity',
    badge: 'Real-Time Stats',
    description: 'Count words, characters, sentences, paragraphs, reading time, speaking time, and target keyword density with Unicode and multilingual text support.',
    enabled: true,
    iconName: 'FileText'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator & Chrono Milestones',
    shortName: 'Age Calculator',
    category: 'Productivity',
    badge: 'Precision Chrono',
    description: 'Calculate exact age in years, months, and days from date of birth, with total hours, leap year calculations, and upcoming birthday countdowns.',
    enabled: true,
    iconName: 'Calendar'
  },
  {
    id: 'json-formatter-validator',
    name: 'JSON Formatter & Validator',
    shortName: 'JSON Formatter',
    category: 'Development & QA',
    badge: 'RFC 8259 Compliant',
    description: 'Format, prettify, compact, and validate JSON payloads with visual tree navigation, line/column error diagnostics, and 100% private in-browser parsing.',
    enabled: true,
    iconName: 'Code2'
  },
  {
    id: 'utm-campaign-url-builder',
    name: 'UTM Campaign URL Builder',
    shortName: 'UTM URL Builder',
    category: 'SEO & Audit',
    badge: 'Attribution Engine',
    description: 'Generate standardized, error-free Google Analytics (GA4) campaign tracking links with parameter collision prevention, fragment preservation, and instant copying.',
    enabled: true,
    iconName: 'Link2'
  },
  {
    id: 'time-zone-converter',
    name: 'Time Zone Converter & Meeting Scheduler',
    shortName: 'Time Zone Converter',
    category: 'Productivity',
    badge: 'Accurate DST',
    description: 'Convert dates and times across global international time zones with accurate Daylight Saving Time calculations and multi-city office comparison matrix.',
    enabled: true,
    iconName: 'Clock'
  },
  {
    id: 'text-diff-checker',
    name: 'Text Diff Checker & Revision Inspector',
    shortName: 'Text Diff Checker',
    category: 'Development & QA',
    badge: 'LCS High Fidelity',
    description: 'Compare two text blocks, legal contracts, or code snippets side-by-side or unified with line-by-line and word-by-word diff calculation.',
    enabled: true,
    iconName: 'GitCompare'
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    shortName: 'URL Encoder & Decoder',
    category: 'Development & QA',
    badge: 'RFC 3986 Standard',
    description: 'Convert special characters and query strings into percent-encoded RFC 3986 format or decode encoded URLs back to clean human text in your browser.',
    enabled: true,
    iconName: 'Code2'
  },
  {
    id: 'pdf-tool',
    name: 'PDF Reducer & Digital Signer',
    shortName: 'PDF Signer',
    category: 'Document',
    badge: 'Unlimited MB',
    description: 'Shrink heavy PDFs to government specs (<100KB, <500KB) and draw, type, or affix verified signatures with interactive drag-and-drop placement.',
    enabled: true,
    iconName: 'FileText'
  },
  {
    id: 'bg-remover',
    name: 'AI Background Remover Studio',
    shortName: 'Background Remover',
    category: 'AI Neural',
    badge: 'Smart Isolation',
    description: 'Smart neural segmentation and color matting to isolate portrait, cartoon & product backgrounds with custom color backdrops and manual brush refine.',
    enabled: true,
    iconName: 'Wand2'
  },
  {
    id: 'upscaler',
    name: 'AI Image 4K Upscaler',
    shortName: 'Image Upscaler',
    category: 'AI Neural',
    badge: '4K Ultra',
    description: 'Enhance low-resolution graphics up to 4K using in-browser super-resolution, bicubic GPU acceleration, and smart unsharp detail enhancement.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'vectorizer',
    name: 'Raster to SVG Vectorizer',
    shortName: 'SVG Vectorizer',
    category: 'Image',
    badge: 'Crisp Vector',
    description: 'Convert raster logos, icons, and artwork into infinitely scalable SVG paths with custom quantization and real-time bezier smoothing.',
    enabled: true,
    iconName: 'ImageIcon'
  },
  {
    id: 'glassmorphism-neumorphism-generator',
    name: 'CSS Glassmorphism & Neumorphism Generator',
    shortName: 'Glass & Soft-UI',
    category: 'Design & UX',
    badge: 'Dual Paradigm',
    description: 'Design frosted glass and tactile soft-UI components with real-time blur, saturation, dual shadow offsets, and instant CSS / Tailwind export.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer & Clean Minifier',
    shortName: 'SVG Optimizer',
    category: 'Development & QA',
    badge: 'Lossless Vector',
    description: 'Safely minify and clean vector SVGs, strip metadata, editor comments, empty nodes, round numeric path precision, and copy clean inline SVG.',
    enabled: true,
    iconName: 'Code2'
  },
  {
    id: 'cron-generator',
    name: 'Cron Expression & Crontab Explainer',
    shortName: 'Cron Explainer',
    category: 'Development & QA',
    badge: 'POSIX Standard',
    description: 'Construct, decode, and validate 5-part POSIX crontab schedules with human-readable English descriptions, interactive dials, and next execution calculations.',
    enabled: true,
    iconName: 'Clock'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester, Match Inspector & Visualizer',
    shortName: 'Regex Tester',
    category: 'Development & QA',
    badge: 'Real-Time Matcher',
    description: 'Test JavaScript Regular Expressions in real-time with syntax error trapping, color-coded capture group matches, substitution sandbox, and pre-built pattern libraries.',
    enabled: true,
    iconName: 'SearchCode'
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML Converter & Live Previewer',
    shortName: 'Markdown Studio',
    category: 'Productivity',
    badge: 'GFM Compliant',
    description: 'Write GFM Markdown with real-time HTML compilation, syntax highlighting, word/reading-time statistics, and clean HTML / .md file export.',
    enabled: true,
    iconName: 'FileText'
  },
  {
    id: 'jwt-debugger',
    name: 'JWT Debugger, Decoder & Expiry Inspector',
    shortName: 'JWT Debugger',
    category: 'Development & QA',
    badge: '100% Local Security',
    description: 'Decode and inspect JSON Web Tokens locally in your browser. Analyze header algorithms, payload claims, Unix timestamps, and HMAC-SHA256 signature verification.',
    enabled: true,
    iconName: 'Lock'
  },
  {
    id: 'favicon-generator',
    name: 'Favicon & App Icon Suite Generator',
    shortName: 'Favicon Suite',
    category: 'Branding & Identity',
    badge: 'Complete Package',
    description: 'Upload any logo or image and generate a complete multi-platform icon package: 16x16, 32x32, 48x48, Apple Touch Icon (180x180), Android Chrome (192/512), manifest.json, and HTML header tags.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'whatsapp-link-generator',
    name: 'Direct WhatsApp Link & QR Generator',
    shortName: 'WhatsApp Link & QR',
    category: 'Branding & Identity',
    badge: 'Official wa.me',
    description: 'Create official WhatsApp click-to-chat links (wa.me) with pre-filled messages, scannable high-resolution QR codes, and embeddable CTA buttons.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'css-animation-builder',
    name: 'CSS Keyframe Animation & Cubic-Bezier Builder',
    shortName: 'CSS Animation Builder',
    category: 'Design & UX',
    badge: 'Hardware Accelerated',
    description: 'Design fluid CSS keyframe sequences and cubic-bezier easing curves with interactive timeline editing and live multi-shape canvas simulation.',
    enabled: true,
    iconName: 'Sliders'
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker & Palette Harmony',
    shortName: 'Color Contrast',
    category: 'Design & UX',
    badge: 'WCAG 2.1 Compliant',
    description: 'Verify WCAG 2.1 contrast ratios for text and UI components, simulate real-world layout contexts, and generate harmonized color palettes.',
    enabled: true,
    iconName: 'Palette'
  }
];

const STORAGE_KEY = 'samaxon_tools_status';
const SYNC_EVENT = 'samaxon_tools_status_updated';

export function getToolsConfig(): ToolItemConfig[] {
  try {
    const seen = new Set<string>();
    const uniqueDefaults = DEFAULT_TOOLS_CONFIG.filter(tool => {
      if (seen.has(tool.id)) return false;
      seen.add(tool.id);
      return true;
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return uniqueDefaults;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return uniqueDefaults;

    return uniqueDefaults.map(defaultTool => {
      const match = parsed.find((p: any) => p && p.id === defaultTool.id);
      if (!match) return defaultTool;
      return {
        ...defaultTool,
        enabled: typeof match.enabled === 'boolean' ? match.enabled : defaultTool.enabled,
        maintenanceNotice: match.maintenanceNotice || defaultTool.maintenanceNotice
      };
    });
  } catch (e) {
    const seen = new Set<string>();
    return DEFAULT_TOOLS_CONFIG.filter(tool => {
      if (seen.has(tool.id)) return false;
      seen.add(tool.id);
      return true;
    });
  }
}

export function saveToolStatus(toolId: string, enabled: boolean, maintenanceNotice?: string): ToolItemConfig[] {
  const current = getToolsConfig();
  const next = current.map(item => {
    if (item.id === toolId) {
      return {
        ...item,
        enabled,
        maintenanceNotice: maintenanceNotice !== undefined ? maintenanceNotice : item.maintenanceNotice
      };
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
  } catch (e) {
    console.error('Failed to save tools config:', e);
  }

  return next;
}

export function resetToolsConfig(): ToolItemConfig[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: DEFAULT_TOOLS_CONFIG }));
  } catch (e) {
    console.error('Failed to reset tools config:', e);
  }
  return DEFAULT_TOOLS_CONFIG;
}
