// Vercel Serverless Function: /api/tools-generate-brief
// Server-Side AI Project Specification Brief Generator with Gemini & Smart Heuristic Engine

import { GoogleGenAI } from '@google/genai';

function sanitize(input: any, maxLen = 150): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').slice(0, maxLen);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      businessName,
      industry,
      projectType,
      projectGoals,
      targetAudience,
      keyFeatures,
      designAesthetic,
      referenceWebsites,
      timeline,
      budgetRange,
      specialRequirements
    } = body;

    const cleanBusiness = sanitize(businessName, 100) || 'Client Digital Platform';
    const cleanIndustry = sanitize(industry, 60) || 'General Business';
    const cleanType = sanitize(projectType, 80) || 'Custom High-Conversion Website';
    const cleanAudience = sanitize(targetAudience, 150) || 'Consumers & Enterprise Clients';
    const cleanAesthetic = sanitize(designAesthetic, 80) || 'SamaXon Ultra-Luxury Gold & Black';
    const cleanTimeline = sanitize(timeline, 60) || 'Under 48 Hours Rapid Prototype';
    const cleanBudget = sanitize(budgetRange, 80) || 'Standard Commercial';
    const cleanSpecial = sanitize(specialRequirements, 1000);
    const cleanReferences = sanitize(referenceWebsites, 300);

    const goalsList = Array.isArray(projectGoals) ? projectGoals.map(g => sanitize(g, 80)).filter(Boolean) : ['Lead Generation', 'Brand Prestige'];
    const featuresList = Array.isArray(keyFeatures) ? keyFeatures.map(f => sanitize(f, 80)).filter(Boolean) : ['Interactive Booking', 'WhatsApp Lead Bot', 'Fast 48h Delivery'];

    let briefResult: any = null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        const prompt = `You are a Principal Digital Architect at SamaXon Digital Solutions, India's fastest luxury digital studio.
Generate a comprehensive, executive, enterprise-grade Website Project Specification Brief based on the following client parameters:

- Business / Project Name: ${cleanBusiness}
- Industry: ${cleanIndustry}
- Project Scope & Type: ${cleanType}
- Core Goals: ${goalsList.join(', ')}
- Target Audience: ${cleanAudience}
- Essential Features: ${featuresList.join(', ')}
- Design Aesthetic & Tone: ${cleanAesthetic}
- Reference Sites: ${cleanReferences || 'None specified'}
- Timeline Expectation: ${cleanTimeline}
- Budget Category: ${cleanBudget}
- Special Notes: ${cleanSpecial || 'None'}

Return ONLY a valid JSON object strictly matching this schema with NO markdown wrapping, codeblocks, or extra text:
{
  "executiveSummary": "Concise 2-paragraph executive overview defining strategic vision, market positioning, and conversion mandate.",
  "targetPersonas": [
    { "title": "Persona Name", "needs": "Key desires & pain points", "journey": "Conversion flow on the website" }
  ],
  "sitemap": [
    { "page": "Page Name", "path": "/path", "purpose": "Strategic purpose", "keyElements": ["Element 1", "Element 2", "Primary CTA"] }
  ],
  "techStack": {
    "frontend": "e.g. React 19 + Vite + TypeScript",
    "styling": "e.g. Tailwind CSS v4 + Motion",
    "backend": "e.g. Node.js Express Cloud Run Microservice",
    "database": "e.g. Supabase PostgreSQL",
    "hosting": "e.g. Google Cloud Run Edge CDN with 0.35s TTFB",
    "security": "e.g. HSTS, CSP, Strict SSRF & TLS 1.3"
  },
  "features": [
    { "name": "Feature Title", "priority": "Must Have", "description": "Technical & business description" }
  ],
  "designGuidelines": {
    "styleName": "${cleanAesthetic}",
    "colorPalette": ["#111111 Matte Black", "#D6B46A Champagne Gold", "#FFFDF8 Soft Ivory", "#4A443E Warm Grey"],
    "typography": "Plus Jakarta Sans for display and body, JetBrains Mono for metrics",
    "layoutPrinciples": ["Mobile-first touch targets >= 44px", "Zero nested cards", "Instant 0.35s Core Web Vitals paint"]
  },
  "milestones": [
    { "phase": "Phase 1: Architecture & Interactive Demo", "timeline": "Hours 0–48", "deliverables": ["Interactive clickable prototype", "Database schema", "Brand identity validation"] },
    { "phase": "Phase 2: Full Stack Engineering", "timeline": "Days 3–7", "deliverables": ["Complete frontend modules", "CRM & Telegram alert hooks", "SEO schemas"] },
    { "phase": "Phase 3: QA & Production Launch", "timeline": "Days 8–10", "deliverables": ["Core Web Vitals audit (>95 score)", "HSTS enforcement", "DNS go-live"] }
  ],
  "conversionStrategy": [
    "Strategy point 1 for WhatsApp / booking hooks",
    "Strategy point 2 for social proof",
    "Strategy point 3 for mobile conversion"
  ]
}`;

        // Resilient model cascade: try primary gemini-3.8-flash, then gemini-3.1-flash-lite if demand spike / 503
        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json'
              }
            });

            if (response.text) {
              const parsed = JSON.parse(response.text);
              if (parsed && typeof parsed === 'object' && parsed.executiveSummary) {
                briefResult = parsed;
                break;
              }
            }
          } catch (modelErr: any) {
            const errCode = modelErr?.status || modelErr?.code || (modelErr?.message?.includes('503') ? '503_UNAVAILABLE' : 'transient');
            console.log(`[Serverless AI Engine] Model ${modelName} encountered ${errCode}; evaluating next generation engine.`);
          }
        }
      } catch (_initErr) {
        // Fallback to tailored expert engine
      }
    }

    if (!briefResult) {
      briefResult = {
        executiveSummary: `${cleanBusiness} is commissioning a state-of-the-art ${cleanType.toLowerCase()} engineered specifically for the ${cleanIndustry.toLowerCase()} sector. The primary objective is to dominate market visibility, elevate digital prestige, and accelerate qualified inbound conversions across ${cleanAudience.toLowerCase()}.\n\nBuilt under SamaXon's signature 48-Hour Demo architecture, the platform pairs ultra-luxury aesthetics (${cleanAesthetic}) with sub-second page performance, verified Google Core Web Vitals benchmarks, and direct automated lead-capture channels.`,
        targetPersonas: [
          {
            title: `Primary Decision Maker (${cleanIndustry} Client)`,
            needs: 'Requires immediate credibility, transparent capability showcases, and frictionless mobile communication.',
            journey: 'Lands on dynamic hero -> Validates social proof & case studies -> Engages 1-click WhatsApp / Inquiry modal in <60 seconds.'
          },
          {
            title: 'Mobile-First Commercial Buyer',
            needs: 'Browses on smartphone during transit; needs instant loading (<0.4s) and tap-friendly booking features.',
            journey: 'Accesses niche landing page -> Filters offerings -> Submits instant quote parameters -> Receives Telegram-dispatched confirmation.'
          }
        ],
        sitemap: [
          { page: 'Homepage / Interactive Showcase', path: '/', purpose: 'Instant luxury positioning, key value proposition, and hero conversion gateway.', keyElements: ['Hero visual with luxury typography', 'Interactive service sandbox', 'Live client metrics', 'Direct WhatsApp CTA'] },
          { page: `${cleanIndustry} Solutions & Capabilities`, path: '/services', purpose: 'Detailed breakdown of core offerings, technical deliverables, and ROI guarantees.', keyElements: ['Interactive feature cards', 'Deliverable timelines', 'Feature comparison matrix'] },
          { page: 'Case Studies & Live Work', path: '/portfolio', purpose: 'High-conversion proof of excellence with real performance metrics.', keyElements: ['Live demo links', 'Before/After speed comparisons', 'Client video testimonials'] },
          { page: 'About & Executive Pedigree', path: '/about', purpose: 'Establish domain authority, founder background, and client-first guarantee.', keyElements: ['Company vision', 'Zero-monthly-retainer model explanation', 'Security protocols'] },
          { page: 'Direct Consultation & Project Ingestion', path: '/contact', purpose: 'Frictionless conversion gateway with automated CRM routing.', keyElements: ['Interactive proposal builder', 'Direct WhatsApp dispatch', 'Response time SLA notice'] }
        ],
        techStack: {
          frontend: 'React 19 + Vite + TypeScript (Zero bloated dependencies)',
          styling: 'Tailwind CSS v4 + Motion Hardware Acceleration',
          backend: 'Node.js Express Cloud Run Microservice with SSL Reverse Proxy',
          database: 'Supabase PostgreSQL (Realtime leads & crawler telemetry)',
          hosting: 'Google Cloud Run Edge CDN (Sub-0.4s Time to First Byte)',
          security: 'HSTS (max-age=63072000), CSP Frame Ancestors, Rate Limiting & TLS 1.3'
        },
        features: [
          ...featuresList.map((f, i) => ({
            name: f,
            priority: (i === 0 ? 'Must Have' : i < 3 ? 'Must Have' : 'Recommended') as 'Must Have' | 'Recommended',
            description: `Engineered with client-side reactive state and server-side validation for seamless ${cleanIndustry} workflow.`
          })),
          { name: 'Automated Instant Lead Alerts', priority: 'Must Have', description: 'Server-side webhook piping qualified proposals directly to staff WhatsApp and Telegram within 2 seconds.' },
          { name: 'Core Web Vitals Performance Guarantee', priority: 'Must Have', description: 'Score of 95+ on Google PageSpeed with sub-0.4s Time to First Byte and zero layout shift.' }
        ],
        designGuidelines: {
          styleName: cleanAesthetic,
          colorPalette: ['#111111 Matte Black', '#D6B46A Champagne Gold', '#FFFDF8 Soft Ivory', '#4A443E Warm Grey', '#262626 Charcoal'],
          typography: 'Plus Jakarta Sans for display and headings, JetBrains Mono for technical metrics and badges.',
          layoutPrinciples: [
            'Generous negative space with high-contrast luxury pairing',
            'Minimum 44px mobile touch targets across all interactive buttons',
            'Zero nested cards; structural depth created via subtle 1px champagne borders',
            'Optimized layout animations strictly using transform and opacity'
          ]
        },
        milestones: [
          { phase: 'Sprint 1: Architecture & Interactive Demo', timeline: cleanTimeline.includes('48') ? '0–48 Hours' : 'Days 1–3', deliverables: ['Full clickable design prototype', 'Core database schema definition', 'Brand asset integration'] },
          { phase: 'Sprint 2: Functional Module Build', timeline: cleanTimeline.includes('48') ? 'Days 3–5' : 'Days 4–7', deliverables: ['Interactive feature workflows', 'Telegram / WhatsApp alert integration', 'On-page SEO schemas'] },
          { phase: 'Sprint 3: Performance Hardening & Launch', timeline: cleanTimeline.includes('48') ? 'Days 6–7' : 'Days 8–10', deliverables: ['Core Web Vitals verification', 'HSTS & CSP security testing', 'Domain DNS propagation'] }
        ],
        conversionStrategy: [
          'Deploy floating conversion dock with 1-click WhatsApp access on mobile viewports.',
          'Incorporate interactive pricing or ROI calculator to qualify client budget upfront.',
          'Include real-time client verification badges and fast 48-hour delivery guarantee.'
        ]
      };
    }

    const rawMarkdown = `# Project Specification Brief: ${cleanBusiness}
**Industry:** ${cleanIndustry} | **Project Type:** ${cleanType}
**Aesthetic Style:** ${cleanAesthetic} | **Target Timeline:** ${cleanTimeline}
**Date Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**Generated via:** SamaXon Digital Solutions AI Architecture Engine

---

## 1. Executive Summary & Strategic Objectives
${briefResult.executiveSummary}

### Strategic Mandates
${goalsList.map(g => `- **${g}**: Optimized throughout user navigation and CTAs.`).join('\n')}

---

## 2. Target Audience & User Journeys
${briefResult.targetPersonas.map((p: any) => `### ${p.title}
- **Needs & Pain Points:** ${p.needs}
- **Recommended User Journey:** ${p.journey}
`).join('\n')}

---

## 3. Recommended Page Sitemap & Architecture
${briefResult.sitemap.map((s: any) => `### ${s.page} (\`${s.path}\`)
- **Purpose:** ${s.purpose}
- **Key Page Elements:** ${s.keyElements.join(', ')}
`).join('\n')}

---

## 4. Recommended Technical Architecture & Stack
- **Frontend Framework:** ${briefResult.techStack.frontend}
- **Styling Architecture:** ${briefResult.techStack.styling}
- **Backend Services:** ${briefResult.techStack.backend}
- **Database & Persistence:** ${briefResult.techStack.database}
- **Cloud Hosting & CDN:** ${briefResult.techStack.hosting}
- **Security Protocols:** ${briefResult.techStack.security}

---

## 5. Key Functional Modules & Deliverables
${briefResult.features.map((f: any) => `- **[${f.priority}] ${f.name}**: ${f.description}`).join('\n')}

---

## 6. Brand Aesthetic & UI/UX Guidelines
- **Visual Tone:** ${briefResult.designGuidelines.styleName}
- **Color Palette:** ${briefResult.designGuidelines.colorPalette.join(', ')}
- **Typography:** ${briefResult.designGuidelines.typography}
- **Core Design Principles:**
${briefResult.designGuidelines.layoutPrinciples.map((l: string) => `  - ${l}`).join('\n')}

---

## 7. Phased Development Roadmap & Milestones
${briefResult.milestones.map((m: any) => `### ${m.phase} (${m.timeline})
${m.deliverables.map((d: string) => `- ${d}`).join('\n')}
`).join('\n')}

---

## 8. High-Conversion UX Recommendations
${briefResult.conversionStrategy.map((c: string) => `- ${c}`).join('\n')}

---
*Generated by SamaXon Digital Solutions (https://samaxon.site) — Fast 48-Hour Web Delivery.*
`;

    return res.status(200).json({
      success: true,
      businessName: cleanBusiness,
      industry: cleanIndustry,
      projectType: cleanType,
      generatedAt: new Date().toISOString(),
      brief: briefResult,
      rawMarkdown
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Internal system error generating project brief.' });
  }
}
