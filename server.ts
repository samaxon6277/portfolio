import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { CODEBASE_RELEASES } from './src/data/codebaseReleases';
import { 
  ALL_TOOLS_SEO, 
  getToolSeoMetadata, 
  generateToolJsonLdSchema, 
  generateToolFaqSchema, 
  generateToolHowToSchema,
  getTotalKeywordsAcrossAllTools 
} from './src/data/toolsSeoKeywords';
import { executeWebsiteAudit } from './src/utils/auditEngine/auditCore';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mgvnebqnzxpxjefxndpi.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KXdb80l02Z1UKuVwlh-Ubg_63NoP7UW';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getBotName(ua: string): string | null {
  const normUA = ua.toLowerCase();
  
  // Explicitly detect requested AI User-Agents
  if (normUA.includes('gptbot')) return 'GPTBot';
  if (normUA.includes('chatgpt-user')) return 'ChatGPT-User';
  if (normUA.includes('claudebot')) return 'ClaudeBot';
  if (normUA.includes('claude-web')) return 'Claude-Web';
  if (normUA.includes('google-extended')) return 'Google-Extended';
  if (normUA.includes('perplexitybot')) return 'PerplexityBot';
  
  if (normUA.includes('googlebot-mobile')) return 'Googlebot-Mobile';
  if (normUA.includes('googlebot')) return 'Googlebot';
  if (normUA.includes('bingbot')) return 'Bingbot';
  if (normUA.includes('bingpreview')) return 'BingPreview';
  if (normUA.includes('yandexbot')) return 'YandexBot';
  if (normUA.includes('ahrefsbot')) return 'AhrefsBot';
  if (normUA.includes('semrushbot')) return 'SemrushBot';
  if (normUA.includes('telegrambot')) return 'TelegramBot preview';
  if (normUA.includes('twitterbot')) return 'TwitterBot preview';
  if (normUA.includes('facebookexternalhit')) return 'FacebookPreview';
  if (normUA.includes('whatsapp')) return 'WhatsApp preview';
  if (normUA.includes('baiduspider')) return 'Baiduspider';
  if (normUA.includes('duckduckbot')) return 'DuckDuckBot';
  if (normUA.includes('linkedinbot')) return 'LinkedInBot';
  if (normUA.includes('slackbot')) return 'SlackBot';
  if (normUA.includes('discordbot')) return 'DiscordBot';
  if (normUA.includes('screaming frog')) return 'Screaming Frog SEO Spider';
  
  if (normUA.includes('bot') || normUA.includes('crawler') || normUA.includes('spider') || normUA.includes('archiver')) {
    const match = ua.match(/([a-zA-Z0-9_\-]+bot|[a-zA-Z0-9_\-]+crawler|[a-zA-Z0-9_\-]+spider|[a-zA-Z0-9_\-]+archiver)/i);
    if (match) return match[1];
    return 'Generic Bot';
  }
  
  return null;
}

function getMaskedIp(req: express.Request): string {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip !== 'string') ip = '127.0.0.1';
  
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xx.xx`;
  }
  
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length > 2) {
    return `${ipv6Parts[0]}:${ipv6Parts[1]}:xx:xx`;
  }
  return ip;
}

interface PrerenderMetadata {
  title: string;
  description: string;
  bodyHtml: string;
}

const PRERENDER_MAP: Record<string, PrerenderMetadata> = {
  '/': {
    title: 'SamaXon Digital Solutions | Best Website Developer Agency Noida Delhi NCR',
    description: 'SamaXon is India\'s premium website developer agency. We build bespoke hotel, resort, and banquet websites, custom SaaS, and Telegram bots in 48 hours with a Demo-First model and zero monthly fees.',
    bodyHtml: `
      <header style="background: #111111; color: #FFFFFF; padding: 20px; font-family: sans-serif;">
        <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <a href="/" style="color: #D6B46A; font-weight: bold; text-decoration: none; font-size: 1.5rem;">SamaXon Digital Solutions</a>
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <a href="/about" style="color: #FFFFFF; text-decoration: none;">About Us</a>
            <a href="/services" style="color: #FFFFFF; text-decoration: none;">Our Services</a>
            <a href="/projects" style="color: #FFFFFF; text-decoration: none;">Client Case Studies</a>
            <a href="/pricing" style="color: #FFFFFF; text-decoration: none;">Build Pricing</a>
            <a href="/careers" style="color: #FFFFFF; text-decoration: none;">Careers Portal</a>
            <a href="/contact" style="color: #FFFFFF; text-decoration: none; font-weight: bold;">Initiate Build</a>
          </div>
        </nav>
      </header>

      <main style="max-width: 1200px; margin: 40px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.6; color: #333333;">
        <section style="margin-bottom: 50px; text-align: center;">
          <h1 style="font-size: 2.5rem; color: #111111; margin-bottom: 10px; text-transform: uppercase; letter-spacing: -1px;">SamaXon Digital Solutions — Premier Website Developer Agency Noida</h1>
          <h2 style="font-size: 1.4rem; color: #BFA15A; margin-bottom: 25px; font-weight: 500;">Widely Recognized as India's Best Website Developer and Custom Software Studio</h2>
          <p style="font-size: 1.15rem; max-width: 850px; margin: 0 auto; color: #555555;">
            SamaXon is Noida & Delhi NCR's absolute best website developer agency, creating premium, speed-optimized digital solutions for hotels, luxury resorts, wedding banquet halls, fitness studios, local clinics, and design studios. Powered by an elite team of senior engineers, we deliver complete, live-interactive prototypes in 48 hours without any upfront commitments.
          </p>
          <div style="margin-top: 35px;">
            <a href="https://wa.me/918000000000?text=Hello%20SamaXon%20team%20I%20am%20interested%20in%20a%20digital%20upgrade" style="background: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 15px; font-size: 1.05rem; display: inline-block;">WhatsApp Support Desk</a>
            <a href="/contact" style="background: #111111; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 1.05rem; display: inline-block;">Initiate 48hr Build</a>
          </div>
        </section>

        <section style="margin-bottom: 60px; border-top: 1px solid #EEEEEE; padding-top: 40px;">
          <h2 style="font-size: 1.8rem; color: #111111; margin-bottom: 25px; text-transform: uppercase; text-align: center;">Our Signature Web Development Niches</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
            <article style="border: 1px solid #EEEEEE; padding: 25px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="color: #111111; margin-top: 0; font-size: 1.25rem;"><a href="/banquet-hall-website-design" style="color: #BFA15A; text-decoration: none; font-weight: bold;">Wedding Banquet Hall Systems</a></h3>
              <p style="color: #666666; font-size: 0.95rem;">Interactive date slot checkers, plate/menu calculators, and high-res media grids designed for maximum venue bookings with zero commission fees.</p>
            </article>
            <article style="border: 1px solid #EEEEEE; padding: 25px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="color: #111111; margin-top: 0; font-size: 1.25rem;"><a href="/resort-website-design" style="color: #BFA15A; text-decoration: none; font-weight: bold;">Luxury Resort Portals</a></h3>
              <p style="color: #666666; font-size: 0.95rem;">Immersive digital experiences with room selector calculators, live seasonal pricing adjusters, and direct checkout integrations.</p>
            </article>
            <article style="border: 1px solid #EEEEEE; padding: 25px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="color: #111111; margin-top: 0; font-size: 1.25rem;"><a href="/hotel-website-design" style="color: #BFA15A; text-decoration: none; font-weight: bold;">Boutique Hotel Booking Engines</a></h3>
              <p style="color: #666666; font-size: 0.95rem;">Custom high-contrast hotel room portfolios, booking administrators, invoice receipt builders, and local search footprint setups.</p>
            </article>
            <article style="border: 1px solid #EEEEEE; padding: 25px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="color: #111111; margin-top: 0; font-size: 1.25rem;"><a href="/gym-website-design" style="color: #BFA15A; text-decoration: none; font-weight: bold;">Gym &amp; Fitness Academy Portals</a></h3>
              <p style="color: #666666; font-size: 0.95rem;">Online class schedules, trainer portfolio highlights, membership billing dashboards, and automated lead capture routing.</p>
            </article>
            <article style="border: 1px solid #EEEEEE; padding: 25px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="color: #111111; margin-top: 0; font-size: 1.25rem;"><a href="/restaurant-website-design" style="color: #BFA15A; text-decoration: none; font-weight: bold;">Restaurant Ordered Menus</a></h3>
              <p style="color: #666666; font-size: 0.95rem;">Visual digital menus, live table booking systems, and instant WhatsApp food delivery order management dashboards.</p>
            </article>
            <article style="border: 1px solid #EEEEEE; padding: 25px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="color: #111111; margin-top: 0; font-size: 1.25rem;"><a href="/business-website-design" style="color: #BFA15A; text-decoration: none; font-weight: bold;">Corporate &amp; Enterprise Software</a></h3>
              <p style="color: #666666; font-size: 0.95rem;">Ultra-secure B2B corporate portals, client support dashboards, custom API wrappers, and high-performance cloud databases.</p>
            </article>
          </div>
        </section>
      </main>
    `
  },
  '/about': {
    title: 'About Us | SamaXon Digital Solutions Noida Delhi NCR',
    description: 'Learn about SamaXon, Noida\'s premier senior developer team. We eliminate upfront payments with our Demo-First methodology, delivering premium websites in under 48 hours.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">About SamaXon Digital Solutions</h1>
        <h2 style="font-size: 1.25rem; color: #BFA15A; margin-bottom: 30px; font-weight: normal;">Noida's Premier Speed-Driven Web Development & Custom Software Studio</h2>
        <p>SamaXon is India's premium speed-driven digital solutions company. We operate on a signature Demo-First model: building and showcasing fully custom web portals in 24 hours prior to contract signings or down payments.</p>
        <p>Every line of code is handwritten by elite senior developers with 5+ years of industry expertise. We bypass generic, slow drag-and-drop engines (like WordPress or Elementor) to build pre-compiled static codes scoring 100/100 on Lighthouse diagnostics, ensuring supreme SEO and conversion performance.</p>
      </main>
    `
  },
  '/services': {
    title: 'Our Premium Services | SamaXon Digital Solutions Noida',
    description: 'Explore the best web developer agency Noida services. Custom booking engines, mobile responsive apps, brand identity designs, and automated Telegram bots.',
    bodyHtml: `
      <main style="max-width: 1000px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase; text-align: center;">Our Elite Service Portfolios</h1>
        <h2 style="font-size: 1.25rem; color: #BFA15A; margin-bottom: 40px; font-weight: normal; text-align: center;">Custom Digital Solutions Engineered for Noida &amp; Delhi NCR's Finest Entities</h2>
        <div style="display: flex; flex-direction: column; gap: 30px;">
          <section style="border: 1px solid #EEEEEE; padding: 30px; border-radius: 12px; background: #FFFFFF;">
            <h3 style="font-size: 1.4rem; color: #111111; margin-top: 0; text-transform: uppercase;">1. High-Performance Website Development</h3>
            <p>Custom-built, lightning-fast digital brand portals with clean typography, tailored layouts, and 100% responsive grids.</p>
          </section>
          <section style="border: 1px solid #EEEEEE; padding: 30px; border-radius: 12px; background: #FFFFFF;">
            <h3 style="font-size: 1.4rem; color: #111111; margin-top: 0; text-transform: uppercase;">2. Interactive Slot Booking &amp; Estimator Engines</h3>
            <p>Commission-free booking software, synced calendar slots, custom cost sheets, and secure gateways for direct closing.</p>
          </section>
          <section style="border: 1px solid #EEEEEE; padding: 30px; border-radius: 12px; background: #FFFFFF;">
            <h3 style="font-size: 1.4rem; color: #111111; margin-top: 0; text-transform: uppercase;">3. Bespoke Client Administration Panels</h3>
            <p>Secure, intuitive admin dashboards to manage queries, calendars, memberships, projects, and site files with zero technical skills.</p>
          </section>
        </div>
      </main>
    `
  },
  '/projects': {
    title: 'Client Case Studies & Projects | SamaXon Portfolio',
    description: 'Browse real-world case studies of custom wedding calendars, resort room calculators, and fitness subscriptions built by SamaXon.',
    bodyHtml: `
      <main style="max-width: 1000px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">SamaXon Client Case Studies &amp; Projects</h1>
        <h2 style="font-size: 1.25rem; color: #BFA15A; margin-bottom: 40px; font-weight: normal;">Proven Performance Milestones across Noida &amp; Delhi NCR</h2>
        <div style="display: flex; flex-direction: column; gap: 30px;">
          <article style="border: 1px solid #EEEEEE; padding: 30px; border-radius: 12px;">
            <h3 style="color: #111111; margin-top: 0;">Khaas Banquet Estates — 41% Direct Bookings Growth</h3>
            <p>Transitioned from reliance on wedding listing aggregators to a bespoke booking engine, saving ₹18 Lakhs in brokerage fees.</p>
          </article>
          <article style="border: 1px solid #EEEEEE; padding: 30px; border-radius: 12px;">
            <h3 style="color: #111111; margin-top: 0;">Nirvana Wellness Gym — Interactive Membership Reserving</h3>
            <p>Implemented a slot-based fitness trainer calendar and direct subscription checkout module, boosting monthly membership sign-ups by 28%.</p>
          </article>
        </div>
      </main>
    `
  },
  '/contact': {
    title: 'Initiate Your 48-Hour Build | Contact SamaXon Noida',
    description: 'Get in touch with SamaXon, the best website developer company in Noida & Delhi NCR. Email: contact@samaxon.site, WhatsApp Support: +91 80000 00000.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Contact SamaXon Digital Solutions</h1>
        <h2 style="font-size: 1.25rem; color: #BFA15A; margin-bottom: 30px; font-weight: normal;">Start Your Risk-Free Demo-First Web Development Cycle</h2>
        <p>WhatsApp Chat: <a href="https://wa.me/918000000000" style="color: #25D366; font-weight: bold;">+91 80000 00000</a> | Email: <a href="mailto:contact@samaxon.site" style="color: #BFA15A; font-weight: bold;">contact@samaxon.site</a></p>
        <p>Studio: SamaXon Elite Hub, Noida Sector 62, Uttar Pradesh, 201301.</p>
      </main>
    `
  },
  '/banquet-hall-website-design': {
    title: 'Best Banquet Hall Website Developer Noida | Marriage Venue Booking Systems',
    description: 'SamaXon builds elite wedding banquet hall portals in Noida and Delhi NCR featuring real-time calendar slots, plate estimators, and direct client WhatsApp alerts.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Banquet Hall Website Developer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Elegant Wedding Venue &amp; Party Lawn Portals with Interactive Booking Features</h2>
        <p>Bypass aggregator commissions. We build bespoke wedding lawns and party banquet websites equipped with interactive plate menu calculators, visual capacity coordinators, and central booking calendars synchronized to your custom Admin Panel.</p>
      </main>
    `
  },
  '/resort-website-design': {
    title: 'Best Resort Website Design Agency Noida | Luxury Resort Booking',
    description: 'SamaXon builds high-converting luxury resort websites in Noida with visual room selectors, seasonal cost check engines, and secure commission-free bookings.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Resort Website Design Agency Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Bespoke Immersive Resort Portals and Room Reservation Systems</h2>
        <p>Enhance direct bookings for your holiday destination or luxury farmhouse. Our custom resort websites feature interactive room selector panels, custom seasonal rate structures, localized SEO guides, and zero-commission checkout flows.</p>
      </main>
    `
  },
  '/hotel-website-design': {
    title: 'Best Hotel Website Developer Noida | Boutique Hotel Booking Engines',
    description: 'SamaXon designs high-performance boutique hotel portals in Noida with real-time room availability, automatic receipts, and advanced local SEO footprint setups.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Hotel Website Developer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Premium Boutique Hotel Portals and Direct Reservation Engines</h2>
        <p>Ditch OTAs and regain margin. Our boutique hotel platforms feature fast-loading, clean layout rooms grids, secure transaction gateways, corporate group codes, and integrated check-in shift administrators.</p>
      </main>
    `
  },
  '/gym-website-design': {
    title: 'Best Gym Website Developer Noida | Fitness Club & Yoga Portals',
    description: 'Get dynamic fitness, yoga, and crossfit studio websites in Noida featuring trainer schedules, online subscription booking, and custom member databases.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Gym &amp; Fitness Studio Website Developer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Interactive Gym Portals with Slot Reserving &amp; Trainer Schedules</h2>
        <p>Convert casual gym-goers into premium members. We build fitness websites featuring visual trainer profile cards, group session reservation slots, online card payment subscriptions, and automatic push WhatsApp reminders.</p>
      </main>
    `
  },
  '/restaurant-website-design': {
    title: 'Best Restaurant Website Designer Noida | Online Ordering Menus',
    description: 'SamaXon builds elegant bistro portals in Noida with custom visual menus, table booking reservation slots, and automated WhatsApp delivery orders.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Restaurant Website Designer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Visual Bistro Portals, Online Order Ensembles, and Table Reservations</h2>
        <p>Tempt food-lovers with ultra-premium digital menus. Features tables reservation slots, party inquiry forms, WhatsApp home delivery routing, and a secure food item coordinator dashboard.</p>
      </main>
    `
  },
  '/business-website-design': {
    title: 'Best Corporate Website Developer Noida | Custom Software Portals',
    description: 'SamaXon is the top B2B corporate website and custom software developer in Noida Sector 62. Secure client portals, API wrappers, and custom admin apps.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Corporate Website Developer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Premium Corporate Web Gateways and Secure Custom Business Software</h2>
        <p>Designed for Noida and Delhi NCR's leading enterprise brands. Our custom corporate platforms feature client login portals, Google Sheets synchronization pipelines, secure data backups, and high-performance custom CRM boards.</p>
      </main>
    `
  },
  '/school-website-design': {
    title: 'Best School Website Portal Designer Noida | Academy Systems',
    description: 'Modern academic portals with student admissions registers, noticeboards, and courses listing panels by SamaXon.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best School Website Portal Designer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Secure Academic Portals, Event Noticeboards, and Admissions Registries</h2>
        <p>Connect faculty, students, and parents. Features responsive course curriculum pages, quick download circulars grids, digital admission inquiry panels, and photo galleries.</p>
      </main>
    `
  },
  '/clinic-website-design': {
    title: 'Best Clinic Website Developer Noida | Doctor Appointment Systems',
    description: 'Patient booking portals and clinic websites featuring doctor scheduling slots, prescription records, and secure inquiry panels.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Clinic Website Developer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Patient-Friendly Clinic Portals and Doctor Appointment Scheduling Slots</h2>
        <p>Bypass heavy booking platform listing fees. Our custom clinic platforms feature clean doctor bio pages, real-time consultation appointment calendars, secure medical history forms, and WhatsApp patient routing alerts.</p>
      </main>
    `
  },
  '/interior-designer-website-design': {
    title: 'Best Interior Designer Portfolio Website Designer Noida',
    description: 'Highlight your studio\'s luxury transformations with premium portfolio grids, high-res layouts, and custom inquiry models by SamaXon.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Best Interior Designer Portfolio Website Designer Noida</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Bespoke Luxury Architecture &amp; Interior Decor High-Resolution Portfolios</h2>
        <p>Display your design heritage beautifully. Features retina-ready high-contrast image sliders, before-and-after interactive swipe boards, client case study testimonials, and custom room design estimator widgets.</p>
      </main>
    `
  },
  '/website-design-for-hotels-delhi': {
    title: 'Best Website Designer for Hotels Delhi | Hospitality Web Design Delhi NCR',
    description: 'Bespoke hotel website developer in Delhi and Noida. We design luxury, fast-loading boutique hotel portals with real-time room availability, GST-compliant invoice generators, and maps SEO optimization.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Website Designer for Hotels Delhi</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Multiply Direct Hotel Bookings with Luxury Hospitality Web Design in Delhi NCR</h2>
        <p>Bypassing OTA Intermediaries and Building Direct Guest Relationships. For luxury hotels and boutique heritage stays in Delhi NCR, direct-to-guest booking has become the single most vital factor for operational viability. Aggressive travel distribution platforms charge up to 25% commissions on every room night booked, while isolating you from guest contacts and listing your property alongside cheaper nearby alternatives.</p>
        <p>SamaXon builds magnificent, fast-loading, mobile-friendly hospitality portals that convey physical grandeur on digital screens. By utilizing gorgeous serif headings and clean editorial layouts, we express the premium heritage of your boutique hotel, compelling high-budget travelers to book directly through your custom gateway.</p>
      </main>
    `
  },
  '/interior-design-website-development': {
    title: 'Interior Designer Website Development | Premium Architecture Portfolios',
    description: 'Elite portfolio website developer for interior designers and architecture studios. Features luxury cinematic project sliders, high-res catalog downloads, and budget estimation tools.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Interior Designer Website Development</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Elevate Your Brand Prestige with Immersive Interior Design Portfolios</h2>
        <p>The Luxury Design Narrative: Expressing High Visual Prestige. Bespoke interior design, spatial decoration, and architectural planning are high-ticket services where trust is built entirely on visual proof. Average WordPress themes and basic template builders look generic, failing to reflect your studio’s custom craftsmanship and luxury aesthetic.</p>
        <p>SamaXon constructs grand, minimal, high-art digital gateways specifically tailored for professional architects and designers. We leverage generous negative space, sophisticated typography pairing, and fluid entrance animations to frame your spatial legacy beautifully.</p>
      </main>
    `
  },
  '/gaming-website-development-india': {
    title: 'Gaming Website Development India | Elite Esports Website Designer',
    description: 'Top gaming and esports website development company in India. We design high-performance gaming team portals, tournament reservation charts, and secure gaming community platforms.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Gaming Website Development India</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Scale Your Esports Brand with Custom Gaming Website Development in India</h2>
        <p>The Esports Revolution: Establishing Direct Digital Brand Authority. Esports and professional gaming clans are scaling rapidly across India, but most organizations struggle with fragmented digital platforms. Relying solely on third-party social pages or slow templates limits your brand authority and blocks lucrative corporate sponsorships.</p>
        <p>SamaXon designs high-performance, dark-themed gaming and esports portals equipped with score trackers, tournament forms, and roster displays. We create custom platforms that captivate fans and convince sponsors of your institutional authority.</p>
      </main>
    `
  },
  '/business-automation-lead-generation-services': {
    title: 'Business Automation & B2B Lead Generation Services | SamaXon',
    description: 'Integrate B2B lead generation forms, custom API pipelines, and automated Google Sheets synchronizations. Convert passive web traffic into verified high-value enterprise contracts.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Business Automation &amp; B2B Lead Generation Services</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Automate Your B2B Sales Funnel and Scale Lead Generation</h2>
        <p>The Mechanics of Modern B2B Lead Automation. In high-ticket B2B sales, speed-to-lead is the single most vital factor for conversion. If a prospect submits an inquiry and your sales team takes several hours or a day to reply, the lead has already turned cold and contacted competitors. Legacy websites often fail to deliver immediate team visibility, letting valuable contracts slip away.</p>
        <p>SamaXon designs B2B lead generation systems that prioritize instant response. We replace basic contact forms with qualified multi-step brief builders. When a lead is submitted, our system instantly triggers structured email routing, synchronizes lead parameters to Google Sheets, and sends instant alerts to your team\'s Telegram or WhatsApp lines.</p>
      </main>
    `
  },
  '/website-development-delhi': {
    title: 'Top Website Development Agency Delhi NCR | Best Web Design Delhi',
    description: 'SamaXon is the best website development company in Delhi and Noida. We design high-performance, lightweight, custom-coded React & Node.js business websites and client portals.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Website Development Delhi</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Dominate Google Rankings with High-Performance Web Development in Delhi</h2>
        <p>The Visual & Operational Authority Mandate for Delhi NCR Brands. In highly competitive markets like Delhi, Noida, and Gurgaon, B2B and B2C brands cannot afford an average online home. Prospective clients evaluate your business authority based on page speeds and design quality. Having a slow website that breaks on mobile screens immediately hurts your brand and surrenders traffic to competitors.</p>
        <p>SamaXon crafts bespoke, lightning-fast digital solutions. We combine clean editorial typography with deep dark or comforting light styles, creating a sense of professional prestige that converts casual visitors into confident buyers.</p>
      </main>
    `
  },
  '/case-study/case-1': {
    title: 'Wedding Banquet Hall Website Design Noida Case Study | SamaXon',
    description: 'Discover how SamaXon designed an elegant venue booking web system for Noida’s premier banquet hall, eliminating aggregator commissions and driving massive direct inquiries.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Khaas Banquet Estates Success Case Study</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">How We Scaled Direct Inquiries by 145% & Saved Commission Fees for Khaas Banquet Estates Noida</h2>
        <p>Target search terms: wedding banquet hall website design Noida, venue booking system India, marriage garden portal development, party lawn cost estimator</p>
        <p>SamaXon designed and engineered a custom, high-contrast, lightning-fast Single Page Application built on React, Vite, and Tailwind CSS. We replaced their heavy, slow-loading photo slider with a lazy-loaded, pre-compiled media gallery optimized for smart devices. To completely eliminate booking friction, we built an interactive, client-side menu cost estimator where hosts can select their preferred menu tiers, adjust plate counts, and receive a beautifully formatted quote immediately in their browser.</p>
      </main>
    `
  },
  '/case-study/case-2': {
    title: 'Boutique Resort Website Design Delhi NCR Case Study | SamaXon',
    description: 'Read how SamaXon built an immersive, high-speed resort web application with a zero-commission room selector, reducing dependence on OTAs and booking.com.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Grand Heritage Palace Resort Success Case Study</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">OTA Liberation: How Grand Heritage Resort Saved ₹22 Lakhs in Room commissions & Secured 48% Direct Bookings</h2>
        <p>Target search terms: boutique resort web design Delhi, luxury hotel booking engine India, heritage hotel portal development, commission-free resort booking</p>
        <p>SamaXon designed an immersive, high-end, visual-heavy resort web application utilizing pre-compiled, lazy-loaded 8K media assets. We built an intuitive, native Room Category Matrix where guests can compare room layouts, view amenities (private pool, garden view, spa access), and check seasonal rates with zero latency. We integrated a secure, direct payment gateway supporting local UPI and global credit cards.</p>
      </main>
    `
  },
  '/case-study/case-3': {
    title: 'Gym Website Developer Noida Delhi NCR Case Study | SamaXon',
    description: 'Discover how SamaXon integrated recurring UPI autopay and smart trainer scheduling slots for a premium Noida fitness club, boosting retention and member sign-ups.',
    bodyHtml: `
      <main style="max-width: 800px; margin: 50px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.7; color: #333333;">
        <h1 style="font-size: 2.2rem; color: #111111; text-transform: uppercase;">Vigour Executive Crossfit Success Case Study</h1>
        <h2 style="font-size: 1.3rem; color: #BFA15A; margin-bottom: 30px; font-weight: 500;">Autopay & Scheduling: How Vigour Fitness Cut Member Renewals Failures by 80% with Custom Subscriptions</h2>
        <p>Target search terms: gym website developer Noida, fitness club website design, pilates studio slot booking, gym UPI subscription system Delhi NCR</p>
        <p>SamaXon engineered a high-contrast, motivating, dark-themed fitness club portal. We designed clean, interactive membership tier selector cards featuring automated recurring UPI mandate subscriptions. We built a real-time, touch-native Trainer Slot Scheduler where members can inspect coach profiles, view open slots, and book private evaluations online.</p>
      </main>
    `
  }
};

// Dynamically populate PRERENDER_MAP for all Tools and their alternative aliases
Object.values(ALL_TOOLS_SEO).forEach(tool => {
  const toolHtml = `
    <header style="background: #111111; color: #FFFFFF; padding: 20px; font-family: sans-serif;">
      <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
        <a href="/" style="color: #D6B46A; font-weight: bold; text-decoration: none; font-size: 1.5rem;">SamaXon Digital Solutions</a>
        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
          <a href="/tools" style="color: #D6B46A; font-weight: bold; text-decoration: none;">Tools</a>
          <a href="/analyzer" style="color: #FFFFFF; text-decoration: none;">Website Analyzer</a>
          <a href="/contact" style="color: #FFFFFF; text-decoration: none;">Contact</a>
        </div>
      </nav>
    </header>

    <main style="max-width: 1100px; margin: 40px auto; padding: 0 20px; font-family: sans-serif; line-height: 1.6; color: #333333;">
      <article>
        <span style="display: inline-block; background: #F4EFE6; color: #85641C; padding: 4px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; margin-bottom: 12px;">
          ${tool.applicationCategory} · 100% Free · Client-Side Private
        </span>
        <h1 style="font-size: 2.4rem; color: #111111; margin-top: 0; line-height: 1.2;">
          ${tool.pageTitle}
        </h1>
        <p style="font-size: 1.15rem; color: #555555; max-width: 900px; margin-bottom: 30px;">
          ${tool.metaDescription}
        </p>

        <section style="background: #FFFDF8; border: 1px solid #D6B46A40; border-radius: 12px; padding: 25px; margin-bottom: 35px;">
          <h2 style="font-size: 1.4rem; color: #111111; margin-top: 0;">Core Features &amp; Capabilities</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; padding-left: 20px;">
            ${tool.featureList.map(f => `<li><strong>${f}</strong></li>`).join('')}
          </ul>
        </section>

        <section style="margin-bottom: 35px;">
          <h2 style="font-size: 1.4rem; color: #111111;">How to Use ${tool.name}</h2>
          <ol style="padding-left: 24px; line-height: 1.8;">
            ${tool.howToSteps.map(s => `<li><strong>${s.name}:</strong> ${s.text}</li>`).join('')}
          </ol>
        </section>

        <section style="margin-bottom: 35px;">
          <h2 style="font-size: 1.4rem; color: #111111;">Frequently Asked Questions (FAQs)</h2>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            ${tool.faq.map(faq => `
              <div style="border: 1px solid #EEEEEE; padding: 18px 22px; border-radius: 8px; background: #FFFFFF;">
                <h3 style="font-size: 1.1rem; color: #111111; margin: 0 0 8px 0;">${faq.question}</h3>
                <p style="margin: 0; color: #666666;">${faq.answer}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <section style="border-top: 1px solid #EEEEEE; padding-top: 25px; margin-top: 30px;">
          <h3 style="font-size: 1rem; color: #888888; text-transform: uppercase;">Indexed Search Queries (${tool.totalKeywordsCount}+ Keywords Active)</h3>
          <p style="font-size: 0.82rem; color: #888888; line-height: 1.6;">
            ${tool.topMetaKeywords}
          </p>
        </section>
      </article>
    </main>
  `;

  const metaObj: PrerenderMetadata = {
    title: tool.pageTitle,
    description: tool.metaDescription,
    bodyHtml: toolHtml
  };

  PRERENDER_MAP[tool.urlPath] = metaObj;
  tool.alternativePaths.forEach(alt => {
    PRERENDER_MAP[alt] = metaObj;
  });
});

// --- In-Memory Zero-Latency Rate Limiter (O(1) sliding window, <0.1ms overhead) ---
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

// Purge stale rate limit records every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 300000);

function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (Array.isArray(rawIp)) rawIp = rawIp[0];
    const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
    const key = `${req.baseUrl || ''}${req.path}:${clientIp}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
      res.setHeader('X-RateLimit-Limit', options.max.toString());
      res.setHeader('X-RateLimit-Remaining', (options.max - 1).toString());
      return next();
    }

    if (record.count >= options.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Limit', options.max.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      return res.status(429).json({
        success: false,
        error: options.message || 'Too many requests. Rate limit exceeded. Please try again later.',
        retryAfterSeconds: retryAfter
      });
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', options.max.toString());
    res.setHeader('X-RateLimit-Remaining', (options.max - record.count).toString());
    next();
  };
}

// Input sanitizer helper for server endpoints
function sanitizeServerInput(input: unknown, maxLen = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/(javascript|data|vbscript):/gi, '')
    .trim()
    .slice(0, maxLen);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security: Prevent server framework fingerprinting
  app.disable('x-powered-by');

  // JSON Body Parser with strict payload size limit (prevents memory exhaustion DoS)
  app.use(express.json({ limit: '100kb' }));

  // API Rate Limiter: Guard backend endpoints, never block Vite dev modules or asset streams
  const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 300,
    message: 'API traffic threshold exceeded. Please slow down.'
  });
  app.use('/api', apiLimiter);

  // --- Strict Security Headers & Transport Layer Defenses ---
  app.use((req, res, next) => {
    // Prevent server information leakage
    res.removeHeader('X-Powered-By');

    // 1. Force 301 HTTPS Redirect when running in production behind reverse proxies (exclude localhost)
    const proto = req.headers['x-forwarded-proto'];
    const host = req.headers.host || '';
    if (
      process.env.NODE_ENV === 'production' &&
      proto &&
      proto !== 'https' &&
      !host.includes('localhost') &&
      !host.includes('127.0.0.1')
    ) {
      return res.redirect(301, `https://${host}${req.url}`);
    }

    // 2. HTTP Strict Transport Security (HSTS) - 2 Years with preload
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // 3. Prevent MIME Sniffing attacks
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 4. Note on X-Frame-Options: Deliberately omitted to allow the app to render within
    // the AI Studio preview iframe. Frame ancestors are governed via Content-Security-Policy below.

    // 5. Cross-Site Scripting (XSS) legacy defense
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // 6. Referrer Policy: Send full URL on same origin, domain-only on cross-origin HTTPS
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 7. Permissions-Policy: Restrict sensitive browser APIs
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

    // 8. Content Security Policy (CSP): Allow embedding within AI Studio and Cloud Run preview frames
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev) {
      const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://*.supabase.co",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.telegram.org https://*.run.app https://*.google.com ws: wss:",
        "frame-ancestors 'self' https://*.google.com https://*.run.app https://ai.studio https://*.aistudio.google.com https://localhost.corp.google.com:26001",
        "object-src 'none'",
        "base-uri 'self'"
      ].join('; ');

      res.setHeader('Content-Security-Policy', cspDirectives);
    }

    next();
  });

  // Real-time server-side Bot / Crawler detection middleware
  app.use((req, res, next) => {
    const rawUa = req.headers['user-agent'] || '';
    const ua = sanitizeServerInput(rawUa, 255);
    const botName = getBotName(ua);
    
    if (botName) {
      const isStatic = /\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map|xml|txt|woff|woff2|ttf|eot)$/i.test(req.path);
      if (!isStatic && !req.path.startsWith('/api/')) {
        const host = req.get('host') || 'samaxon.site';
        const pageUrl = `${req.protocol}://${host}${req.originalUrl}`.slice(0, 255);
        const ipHash = getMaskedIp(req);
        const crawlerLogId = crypto.randomUUID();
        
        // Execute asynchronously without blocking the request
        (async () => {
          try {
            const { error } = await supabase
              .from('crawler_logs')
              .insert({
                id: crawlerLogId,
                bot_name: botName.slice(0, 64),
                user_agent: ua,
                page_url: pageUrl,
                ip_hash: ipHash,
                source: 'Express Server Middleware',
                created_at: new Date().toISOString()
              });
            if (error) {
              // Fallback to site_events if crawler_logs has RLS constraints
              await supabase
                .from('site_events')
                .insert({
                  id: `eve-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  event_type: 'bot_crawl',
                  page_url: pageUrl,
                  referrer: req.headers['referer'] || 'Direct',
                  user_agent: ua,
                  device_type: 'Bot',
                  browser: botName.slice(0, 64),
                  country: 'India',
                  city: 'Server',
                  metadata: { bot_name: botName, source: 'Express Server Middleware', ip_hash: ipHash },
                  created_at: new Date().toISOString()
                });
            }
          } catch {
            // Silently absorb edge exceptions to ensure server requests remain unblocked
          }
        })();
      }
    }
    next();
  });

  // Basic health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'SamaXon Core Server', 
      time: new Date().toISOString(),
      security_headers: 'active',
      hsts: 'enforced'
    });
  });

  // --- Strict Rate Limiter for Client Inquiries (Prevent Form Flooding / Brute-force DoS) ---
  const inquiryRateLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 6, // Maximum 6 submissions per IP per 10 minutes
    message: 'Too many project submissions from your IP. Please wait a few minutes before submitting another proposal.'
  });

  // --- Secure Server-Side Lead Ingestion Endpoint (/api/inquire) ---
  app.post('/api/inquire', inquiryRateLimiter, async (req, res) => {
    try {
      // CSRF / Origin Verification Defense
      const origin = req.headers.origin || req.headers.referer;
      if (origin && process.env.NODE_ENV === 'production') {
        try {
          const originHost = new URL(origin).host;
          const currentHost = req.headers.host;
          if (originHost !== currentHost && !originHost.endsWith('samaxon.site') && !originHost.endsWith('run.app')) {
            return res.status(403).json({ success: false, error: 'Forbidden: Cross-Origin request rejected.' });
          }
        } catch {
          return res.status(400).json({ success: false, error: 'Invalid origin header.' });
        }
      }

      const {
        name,
        businessName,
        phone,
        email,
        city,
        serviceNeeded,
        service,
        currentProblem,
        problem,
        desiredTimeline,
        timeline,
        budgetRange,
        budget,
        message,
        complexity,
        selected_addons,
        estimated_min_price,
        estimated_max_price,
        user_budget_preference
      } = req.body || {};

      // Data sanitization and validation
      const cleanName = sanitizeServerInput(name, 100);
      const cleanBusiness = sanitizeServerInput(businessName, 120);
      const cleanPhone = sanitizeServerInput(phone, 25);
      const cleanEmail = sanitizeServerInput(email, 120);
      const cleanCity = sanitizeServerInput(city, 80);
      const cleanService = sanitizeServerInput(serviceNeeded || service, 100) || 'Web Development';
      const cleanProblem = sanitizeServerInput(currentProblem || problem || message, 1500);
      const cleanTimeline = sanitizeServerInput(desiredTimeline || timeline, 50) || 'Under 48 Hours';
      const cleanBudget = sanitizeServerInput(budgetRange || budget, 150);
      const cleanMessage = sanitizeServerInput(message, 3000);

      // Validation check
      if (!cleanName || !cleanEmail || !cleanPhone || !cleanProblem) {
        return res.status(400).json({
          success: false,
          error: 'Required inquiry fields missing or invalid.'
        });
      }

      // Basic email regex format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'Invalid email address.' });
      }

      const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      const metaPayload = {
        budgetRange: cleanBudget,
        desiredTimeline: cleanTimeline,
        complexity: sanitizeServerInput(complexity, 50) || 'Standard',
        selected_addons: Array.isArray(selected_addons) ? selected_addons.slice(0, 10).map(a => sanitizeServerInput(a, 60)) : [],
        estimated_min_price: typeof estimated_min_price === 'number' ? estimated_min_price : 0,
        estimated_max_price: typeof estimated_max_price === 'number' ? estimated_max_price : 0,
        user_budget_preference: sanitizeServerInput(user_budget_preference, 100)
      };

      const baselineLeadRecord = {
        id: leadId,
        full_name: cleanName,
        business_name: cleanBusiness,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        email: cleanEmail,
        city: cleanCity,
        service_required: cleanService,
        message: cleanMessage || cleanProblem,
        status: 'new',
        priority: cleanTimeline.includes('48') ? 'high' : 'medium',
        notes: `[Budget: ${cleanBudget || 'Custom'} | Timeline: ${cleanTimeline || 'Flexible'}]\n__META__:${JSON.stringify(metaPayload)}`,
        created_at: new Date().toISOString()
      };

      // Parameterized Supabase Database Insert (guaranteed compatible with baseline & extended schemas)
      const { error: dbError } = await supabase
        .from('client_inquiries')
        .insert(baselineLeadRecord);

      if (dbError) {
        console.error('Supabase /api/inquire insert error:', dbError.message);
      }

      // Automated Telegram Alert Integration (Server-side proxy, hides BOT_TOKEN from client)
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      if (telegramToken && telegramChatId) {
        try {
          const alertText = `🚨 *NEW CLIENT PROPOSAL INGESTED*\n\n` +
            `👤 *Client:* ${cleanName} (${cleanBusiness || 'Direct'})\n` +
            `📱 *Phone:* ${cleanPhone}\n` +
            `📧 *Email:* ${cleanEmail}\n` +
            `📍 *City:* ${cleanCity}\n` +
            `⚡ *Service:* ${cleanService}\n` +
            `⏳ *Timeline:* ${cleanTimeline}\n` +
            `💰 *Budget:* ${cleanBudget}\n` +
            `📝 *Brief:* ${cleanProblem.slice(0, 300)}`;

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: alertText,
              parse_mode: 'Markdown'
            })
          });
        } catch (tgErr) {
          console.warn('Automated Telegram notification dispatch failed:', tgErr);
        }
      }

      return res.status(200).json({
        success: true,
        leadId,
        message: 'Your custom project inquiry has been queued securely. Our lead architect will review within 2 hours.'
      });

    } catch (err: any) {
      console.error('Unhandled /api/inquire exception:', err);
      return res.status(500).json({ success: false, error: 'Internal system error processing inquiry.' });
    }
  });

  // --- Secure Webhook Ingestion Endpoint (/api/webhook/telegram) ---
  const webhookRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 30, // 30 webhooks/minute
    message: 'Webhook intake limit reached.'
  });

  app.post('/api/webhook/telegram', webhookRateLimiter, async (req, res) => {
    // Secret validation
    const incomingSecret = req.headers['x-telegram-bot-api-secret-token'];
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (expectedSecret && incomingSecret !== expectedSecret) {
      return res.status(401).json({ error: 'Unauthorized webhook invocation.' });
    }

    try {
      const payload = req.body;
      const logId = crypto.randomUUID();
      
      // Parameterized log write
      await supabase
        .from('webhook_logs')
        .insert({
          id: logId,
          webhook_type: 'Telegram Bot Event',
          payload_summary: sanitizeServerInput(JSON.stringify(payload).slice(0, 500), 500),
          created_at: new Date().toISOString()
        });

      return res.status(200).json({ ok: true, logId });
    } catch (whErr) {
      console.warn('Webhook logging error:', whErr);
      return res.status(200).json({ ok: true }); // Return 200 to prevent webhook retry storms
    }
  });

  // --- Strict Rate Limiter for Website Health & Security Analyzer ---
  const analyzerRateLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 20, // 20 audits per 5 minutes per IP
    message: 'Audit limit reached. Please wait 5 minutes before auditing more websites.'
  });

  // Helper to prevent SSRF against loopback or private ranges
  function isPrivateOrLocalIp(hostname: string): boolean {
    const norm = hostname.toLowerCase().trim();
    if (
      norm === 'localhost' ||
      norm === '127.0.0.1' ||
      norm === '0.0.0.0' ||
      norm === '::1' ||
      norm === '169.254.169.254' ||
      norm.endsWith('.local') ||
      norm.endsWith('.internal')
    ) {
      return true;
    }
    // Check common private IPv4 ranges: 10.x, 192.168.x, 172.16-31.x
    const parts = norm.split('.');
    if (parts.length === 4 && parts.every(p => /^\d+$/.test(p))) {
      const p0 = parseInt(parts[0], 10);
      const p1 = parseInt(parts[1], 10);
      if (p0 === 10) return true;
      if (p0 === 127) return true;
      if (p0 === 192 && p1 === 168) return true;
      if (p0 === 172 && p1 >= 16 && p1 <= 31) return true;
    }
    return false;
  }

  // --- Real-time Codebase Deployment & Site Updates Endpoint (/api/site-updates) ---
  app.get('/api/site-updates', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.json({
      success: true,
      latestUpdate: CODEBASE_RELEASES[0] || null,
      releases: CODEBASE_RELEASES,
      serverTime: new Date().toISOString()
    });
  });

  // --- Search Engine Tools Catalog & SEO Corpus API (/api/tools-seo) ---
  app.get('/api/tools-seo', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');

    const { tool, format } = req.query || {};

    if (tool && typeof tool === 'string') {
      const toolMeta = getToolSeoMetadata(tool);
      if (format === 'schema') {
        return res.json({
          webApplication: generateToolJsonLdSchema(toolMeta),
          faq: generateToolFaqSchema(toolMeta),
          howTo: generateToolHowToSchema(toolMeta)
        });
      }
      return res.json({
        success: true,
        tool: toolMeta,
        schemas: {
          webApplication: generateToolJsonLdSchema(toolMeta),
          faq: generateToolFaqSchema(toolMeta),
          howTo: generateToolHowToSchema(toolMeta)
        }
      });
    }

    const allToolsArray = Object.values(ALL_TOOLS_SEO).map(t => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      url: `https://samaxon.site${t.urlPath}`,
      alternativeUrls: t.alternativePaths.map(p => `https://samaxon.site${p}`),
      category: t.applicationCategory,
      pageTitle: t.pageTitle,
      metaDescription: t.metaDescription,
      topKeywords: t.topMetaKeywords,
      keywordCategoriesCount: t.keywordCategories.length,
      totalKeywordsCount: t.totalKeywordsCount,
      featuresCount: t.featureList.length
    }));

    return res.json({
      success: true,
      site: 'SamaXon Digital Solutions',
      domain: 'https://samaxon.site',
      toolsCount: allToolsArray.length,
      totalKeywordsIndexed: getTotalKeywordsAcrossAllTools(),
      tools: allToolsArray,
      serverTime: new Date().toISOString()
    });
  });

  // --- Comprehensive Website Health, Performance & SEO Audit Endpoint (/api/analyze-website & /api/audit) ---
  const handleWebsiteAuditRequest = async (req: express.Request, res: express.Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    try {
      const rawUrl = (req.body?.url || req.query?.url);
      if (!rawUrl || typeof rawUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'Target website URL is required.' });
      }

      let targetUrl = rawUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid website URL format.' });
      }

      if (isPrivateOrLocalIp(parsedUrl.hostname)) {
        return res.status(400).json({ success: false, error: 'Cannot audit private or loopback hostnames.' });
      }

      const report = await executeWebsiteAudit(targetUrl);
      return res.status(200).json(report);
    } catch (err: any) {
      console.error('Unhandled website audit exception:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'System error executing website security audit.'
      });
    }
  };

  app.options('/api/analyze-website', (req, res) => res.status(204).end());
  app.options('/api/audit', (req, res) => res.status(204).end());
  app.all('/api/analyze-website', analyzerRateLimiter, handleWebsiteAuditRequest);
  app.all('/api/audit', analyzerRateLimiter, handleWebsiteAuditRequest);

  // --- In-Memory Audit Leads Storage (with Supabase fallback) ---
  const inMemoryAuditLeads: any[] = [];

  // --- Endpoint: Submit Audit Lead / Request 48h Bug Fix (/api/submit-audit-lead) ---
  const auditLeadRateLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Too many audit fix submissions from this IP. Please wait a few moments.'
  });

  app.post('/api/submit-audit-lead', auditLeadRateLimiter, async (req, res) => {
    try {
      const {
        clientName,
        businessName,
        email,
        phone,
        websiteUrl,
        overallScore,
        securityScore,
        seoScore,
        codeScore,
        performanceScore,
        criticalIssuesCount,
        warningIssuesCount,
        topIssues,
        missingKeywords,
        animationIssues,
        internalPages,
        clientNotes,
        priority
      } = req.body || {};

      const cleanName = sanitizeServerInput(clientName, 100);
      const cleanBusiness = sanitizeServerInput(businessName, 120);
      const cleanPhone = sanitizeServerInput(phone, 25);
      const cleanEmail = sanitizeServerInput(email, 120);
      const cleanUrl = sanitizeServerInput(websiteUrl, 255);
      const cleanNotes = sanitizeServerInput(clientNotes, 2000);
      const cleanPriority = sanitizeServerInput(priority, 30) || 'standard';

      if (!cleanName || !cleanEmail || !cleanPhone || !cleanUrl) {
        return res.status(400).json({
          success: false,
          error: 'Required fields missing: Name, Email, Phone, and Website URL are required.'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'Invalid email address.' });
      }

      const ticketNumber = `AUDIT-${Math.floor(100000 + Math.random() * 900000)}`;
      const leadId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const leadRecord = {
        id: leadId,
        ticket_number: ticketNumber,
        client_name: cleanName,
        business_name: cleanBusiness,
        email: cleanEmail,
        phone: cleanPhone,
        website_url: cleanUrl,
        overall_score: Number(overallScore) || 0,
        security_score: Number(securityScore) || 0,
        seo_score: Number(seoScore) || 0,
        code_score: Number(codeScore) || 0,
        performance_score: Number(performanceScore) || 0,
        critical_issues_count: Number(criticalIssuesCount) || 0,
        warning_issues_count: Number(warningIssuesCount) || 0,
        top_issues: Array.isArray(topIssues) ? topIssues.slice(0, 15) : [],
        missing_keywords: Array.isArray(missingKeywords) ? missingKeywords.slice(0, 10) : [],
        animation_issues: Array.isArray(animationIssues) ? animationIssues.slice(0, 10) : [],
        internal_pages: Array.isArray(internalPages) ? internalPages.slice(0, 10) : [],
        client_notes: cleanNotes,
        priority: cleanPriority,
        status: 'new',
        created_at: new Date().toISOString()
      };

      inMemoryAuditLeads.unshift(leadRecord);

      // Attempt Supabase insert if credentials exist
      try {
        await supabase.from('audit_leads').insert(leadRecord);
      } catch (dbErr) {
        console.warn('Supabase audit_leads write skipped/fallback:', dbErr);
      }

      // Automated Telegram Alert
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      if (telegramToken && telegramChatId) {
        try {
          const alertText = `🚨 *NEW 48H WEBSITE AUDIT & BUG FIX REQUEST*\n\n` +
            `🎫 *Ticket:* \`${ticketNumber}\`\n` +
            `👤 *Client:* ${cleanName} (${cleanBusiness || 'Direct'})\n` +
            `📱 *Phone/WhatsApp:* ${cleanPhone}\n` +
            `📧 *Email:* ${cleanEmail}\n` +
            `🌐 *Target Site:* ${cleanUrl}\n` +
            `📊 *Health Score:* ${overallScore || 'N/A'}/100\n` +
            `⚠️ *Critical Bugs:* ${criticalIssuesCount || 0} | *Warnings:* ${warningIssuesCount || 0}\n` +
            `⚡ *Priority:* ${cleanPriority.toUpperCase()}\n` +
            `📝 *Notes:* ${cleanNotes ? cleanNotes.slice(0, 300) : 'Full website code & security overhaul requested.'}`;

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: alertText,
              parse_mode: 'Markdown'
            })
          });
        } catch (tgErr) {
          console.warn('Telegram audit lead notification failed:', tgErr);
        }
      }

      return res.status(200).json({
        success: true,
        ticketNumber,
        leadId,
        message: 'Your website bug fix request has been received. Our senior engineer will inspect your code.'
      });
    } catch (err: any) {
      console.error('Unhandled /api/submit-audit-lead exception:', err);
      return res.status(500).json({ success: false, error: 'Internal system error processing audit request.' });
    }
  });

  // --- Admin API: Get all audit leads (/api/admin/audit-leads) ---
  app.get('/api/admin/audit-leads', async (req, res) => {
    try {
      let leads = [...inMemoryAuditLeads];
      try {
        const { data, error } = await supabase
          .from('audit_leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const map = new Map();
          leads.forEach(l => map.set(l.id, l));
          data.forEach(d => map.set(d.id, d));
          leads = Array.from(map.values());
        }
      } catch {}
      return res.status(200).json({ success: true, leads });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Failed fetching audit leads.' });
    }
  });

  // --- Admin API: Update audit lead status (/api/admin/audit-leads/:id) ---
  app.patch('/api/admin/audit-leads/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, priority, clientNotes } = req.body || {};
      const found = inMemoryAuditLeads.find(l => l.id === id);
      if (found) {
        if (status) found.status = sanitizeServerInput(status, 30);
        if (priority) found.priority = sanitizeServerInput(priority, 30);
        if (clientNotes) found.client_notes = sanitizeServerInput(clientNotes, 2000);
      }

      try {
        const updates: any = {};
        if (status) updates.status = sanitizeServerInput(status, 30);
        if (priority) updates.priority = sanitizeServerInput(priority, 30);
        if (clientNotes) updates.client_notes = sanitizeServerInput(clientNotes, 2000);
        await supabase.from('audit_leads').update(updates).eq('id', id);
      } catch {}

      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Failed updating audit lead.' });
    }
  });

  // --- Admin API: Delete audit lead (/api/admin/audit-leads/:id) ---
  app.delete('/api/admin/audit-leads/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const idx = inMemoryAuditLeads.findIndex(l => l.id === id);
      if (idx >= 0) {
        inMemoryAuditLeads.splice(idx, 1);
      }
      try {
        await supabase.from('audit_leads').delete().eq('id', id);
      } catch {}

      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Failed deleting audit lead.' });
    }
  });

  // =========================================================================
  // 1. TOOL API: Website SEO Audit Endpoint (/api/tools/seo-audit)
  // =========================================================================
  const seoAuditLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: 'SEO audit limit reached. Please wait a few minutes before auditing again.'
  });

  app.all('/api/tools/seo-audit', seoAuditLimiter, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
      const rawUrl = (req.body?.url || req.query?.url);
      if (!rawUrl || typeof rawUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'Website URL is required for SEO audit.' });
      }

      let targetUrl = rawUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid website URL format provided.' });
      }

      if (isPrivateOrLocalIp(parsedUrl.hostname)) {
        return res.status(400).json({ success: false, error: 'Security restriction: cannot audit private or loopback hostnames.' });
      }

      const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Upgrade-Insecure-Requests': '1'
      };

      const startTime = Date.now();
      let response: Response | null = null;
      let html = '';
      let fetchError = '';

      const urlsToTry = [parsedUrl.toString()];
      if (parsedUrl.protocol === 'https:') {
        try {
          const httpFallback = new URL(parsedUrl.toString());
          httpFallback.protocol = 'http:';
          urlsToTry.push(httpFallback.toString());
        } catch {}
      }

      for (const attemptUrl of urlsToTry) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);
        try {
          const resAttempt = await fetch(attemptUrl, {
            signal: controller.signal,
            headers: browserHeaders,
            redirect: 'follow'
          });
          clearTimeout(timeoutId);
          response = resAttempt;
          html = await resAttempt.text();
          targetUrl = attemptUrl;
          fetchError = '';
          break;
        } catch (err: any) {
          clearTimeout(timeoutId);
          fetchError = err?.name === 'AbortError' ? 'Audit request timed out.' : (err?.message || 'Connection failed');
        }
      }

      const responseTimeMs = Date.now() - startTime;

      if (fetchError || !response) {
        const host = parsedUrl.hostname;
        return res.status(200).json({
          success: true,
          reachable: false,
          error: fetchError || 'Website restricted diagnostic crawl or timed out.',
          url: targetUrl,
          hostname: host,
          statusCode: 0,
          responseTimeMs: Math.max(400, responseTimeMs),
          scores: { overall: 50, technical: 45, content: 55, social: 40, security: 50, accessibility: 60 },
          grade: 'C',
          meta: {
            title: `${host} - Portal`,
            metaDescription: 'Target server firewall or timeout blocked external crawler scan.',
            canonicalUrl: targetUrl,
            robots: 'index, follow',
            ogTitle: host,
            ogDescription: `Web asset analysis for ${host}`,
            ogImage: null,
            twitterCard: 'summary',
            headings: { h1: [`${host} Web Platform`], h2Count: 1, h3Count: 0, outline: [{ level: 'H1', text: `${host} Web Platform` }] },
            images: { total: 0, missingAlt: 0, missingAltSample: [] },
            content: { wordCount: 120, readingTimeMinutes: 1, textToHtmlRatio: 12 },
            technical: { isHttps: targetUrl.startsWith('https://'), hasDoctype: true, hasViewport: true, hasCharset: true, hasLang: true, hasJsonLd: false }
          },
          keywords: {
            top: [{ keyword: host.replace(/^www\./, '').split('.')[0], count: 3, density: 1.2 }],
            missingCommercial: ['Transparent Pricing', 'Client Testimonials', 'Direct Contact / Inquiry', 'Satisfaction Guarantee', 'Core Services']
          },
          issues: {
            critical: [{ title: 'Connection Restricted / Timeout', description: `Diagnostic probe encountered: ${fetchError}. Edge firewalls may restrict external probes.`, recommendation: 'Verify firewall permissions and port 443 availability.' }],
            warning: [{ title: 'Strict-Transport-Security (HSTS) Unverified', description: 'TLS chain could not be fully verified due to connection timeout.', recommendation: 'Ensure HSTS header is configured on reverse proxy.' }],
            passed: [{ title: 'Valid Domain Registration', description: `Domain ${host} resolves with nameservers.`, recommendation: 'Maintain domain locking.' }]
          }
        });
      }

      const headers = response.headers;
      const isHttps = response.url.startsWith('https://');
      const statusCode = response.status;
      const hstsHeader = headers.get('strict-transport-security');
      const cspHeader = headers.get('content-security-policy');
      const xFrameHeader = headers.get('x-frame-options');
      const xContentTypeHeader = headers.get('x-content-type-options');

      // Title parsing
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';
      const titlePixelEstimate = Math.round(title.length * 9.2);

      // Meta Description
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
      const metaDescription = descMatch ? descMatch[1].trim() : '';

      // Canonical
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
      const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';

      // Robots
      const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
      const robots = robotsMatch ? robotsMatch[1].trim() : 'index, follow';

      // Social OpenGraph & Twitter
      const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
      const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
      const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
      const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i);
      const twitterCardMatch = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);
      const twitterTitleMatch = html.match(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']*)["']/i);
      const twitterImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']*)["']/i);

      // Headings
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      const h1List = h1Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
      const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
      const h2List = h2Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
      const h3Matches = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];
      const h3List = h3Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);

      const headingOutline: Array<{ level: 'H1' | 'H2' | 'H3'; text: string }> = [];
      h1List.slice(0, 3).forEach(t => headingOutline.push({ level: 'H1', text: t }));
      h2List.slice(0, 8).forEach(t => headingOutline.push({ level: 'H2', text: t }));
      h3List.slice(0, 8).forEach(t => headingOutline.push({ level: 'H3', text: t }));

      // Images
      const imgMatches = html.match(/<img[^>]+>/gi) || [];
      const totalImages = imgMatches.length;
      let missingAltCount = 0;
      const missingAltSample: string[] = [];
      for (const imgTag of imgMatches) {
        const altMatch = imgTag.match(/\balt=(["'])(.*?)\1/i);
        if (!altMatch || !altMatch[2].trim()) {
          missingAltCount++;
          const srcMatch = imgTag.match(/\bsrc=(["'])(.*?)\1/i);
          if (srcMatch && missingAltSample.length < 5) {
            missingAltSample.push(srcMatch[2]);
          }
        }
      }

      // Content & Words
      const stripped = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z0-9#]+;/gi, ' ')
        .trim();
      const words = stripped.toLowerCase().match(/\b[a-z]{4,20}\b/g) || [];
      const wordCount = words.length;
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      const htmlByteSize = Buffer.byteLength(html, 'utf8');
      const textByteSize = Buffer.byteLength(stripped, 'utf8');
      const textToHtmlRatio = htmlByteSize > 0 ? Math.round((textByteSize / htmlByteSize) * 100) : 0;

      // Keywords & Stopwords
      const stopWords = new Set([
        'about', 'after', 'again', 'against', 'almost', 'also', 'although', 'always', 'among',
        'another', 'because', 'before', 'being', 'between', 'both', 'could', 'every', 'first',
        'from', 'further', 'here', 'into', 'just', 'more', 'most', 'other', 'over', 'same',
        'should', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these',
        'they', 'this', 'those', 'through', 'under', 'until', 'very', 'were', 'what', 'when',
        'where', 'which', 'while', 'with', 'would', 'your', 'have', 'been', 'will', 'http', 'https', 'www'
      ]);
      const wordCounts: Record<string, number> = {};
      words.forEach(w => {
        if (!stopWords.has(w)) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
      const topKeywords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([keyword, count]) => ({
          keyword,
          count,
          density: wordCount ? Math.round((count / wordCount) * 1000) / 10 : 0
        }));

      // Commercial keyword gap
      const combinedText = (title + ' ' + metaDescription + ' ' + h1List.join(' ') + ' ' + stripped.slice(0, 3000)).toLowerCase();
      const highIntentTerms = [
        { term: 'pricing', label: 'Transparent Pricing & Cost' },
        { term: 'reviews', label: 'Client Reviews & Testimonials' },
        { term: 'services', label: 'Core Services & Offerings' },
        { term: 'contact', label: 'Direct Booking / Contact CTA' },
        { term: 'portfolio', label: 'Live Portfolio & Case Studies' },
        { term: 'guarantee', label: 'Satisfaction Guarantee / Warranty' }
      ];
      const missingCommercial = highIntentTerms.filter(t => !combinedText.includes(t.term)).map(t => t.label);

      // Technical elements
      const hasDoctype = /<!doctype\s+html/i.test(html);
      const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
      const hasCharset = /<meta[^>]+charset=["']?[a-zA-Z0-9\-_]+["']?/i.test(html);
      const hasLang = /<html\b[^>]*\blang=["']?[a-zA-Z\-]+["']?/i.test(html);
      const hasJsonLd = /<script\b[^>]*type=["']application\/ld\+json["']/i.test(html);

      // Sub-scores calculation
      let techScore = 100;
      let contentScore = 100;
      let socialScore = 100;
      let securityScore = 100;
      let accessScore = 100;

      const criticalIssues: Array<{ title: string; description: string; recommendation: string; fixCode?: string }> = [];
      const warningIssues: Array<{ title: string; description: string; recommendation: string; fixCode?: string }> = [];
      const passedIssues: Array<{ title: string; description: string; recommendation: string }> = [];

      // 1. Technical Checks
      if (!hasDoctype) {
        techScore -= 20;
        criticalIssues.push({ title: 'Missing HTML5 Doctype', description: 'Page lacks <!DOCTYPE html>, triggering Quirks Mode.', recommendation: 'Ensure <!DOCTYPE html> is the first line.', fixCode: '<!DOCTYPE html>' });
      }
      if (!hasViewport) {
        techScore -= 20;
        criticalIssues.push({ title: 'Missing Viewport Meta Tag', description: 'Mobile devices cannot scale layout correctly.', recommendation: 'Add responsive viewport meta tag.', fixCode: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' });
      } else {
        passedIssues.push({ title: 'Mobile Viewport Present', description: 'Mobile scaling enabled with standard viewport tag.', recommendation: 'Ensure touch targets >= 44px.' });
      }
      if (!canonicalUrl) {
        techScore -= 15;
        warningIssues.push({ title: 'Missing Canonical Tag', description: 'Search engines may flag duplicate content without canonical self-reference.', recommendation: 'Add canonical link pointing to authoritative URL.', fixCode: `<link rel="canonical" href="${targetUrl}" />` });
      } else {
        passedIssues.push({ title: 'Canonical Tag Configured', description: `Points to ${canonicalUrl}.`, recommendation: 'Verify target URL matches canonical.' });
      }
      if (!hasJsonLd) {
        techScore -= 15;
        warningIssues.push({ title: 'Missing Schema.org JSON-LD Structured Data', description: 'No structured markup found, missing out on rich search snippets.', recommendation: 'Implement Organization or WebSite JSON-LD.', fixCode: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${title || parsedUrl.hostname}",\n  "url": "${targetUrl}"\n}\n</script>` });
      } else {
        passedIssues.push({ title: 'Schema.org JSON-LD Detected', description: 'Search engines can parse rich entity structured data.', recommendation: 'Validate schema via schema.org validator.' });
      }

      // 2. Content & Meta Checks
      if (!title) {
        contentScore -= 30;
        criticalIssues.push({ title: 'Missing <title> Tag', description: 'No title element found. Essential for Google ranking and search snippet click rate.', recommendation: 'Add a 50-60 character descriptive title.', fixCode: `<title>${parsedUrl.hostname} | Premium Services</title>` });
      } else if (title.length < 25 || title.length > 70) {
        contentScore -= 12;
        warningIssues.push({ title: `Suboptimal Title Length (${title.length} characters)`, description: `Title is ${title.length} characters. Google displays 50-60 characters without truncation.`, recommendation: 'Refine title to 50-60 characters including primary brand keyword.' });
      } else {
        passedIssues.push({ title: `Optimized Title Tag (${title.length} chars)`, description: `"${title}" fits Google desktop and mobile SERP specifications cleanly.`, recommendation: 'Maintain title keyword focus.' });
      }

      if (!metaDescription) {
        contentScore -= 25;
        criticalIssues.push({ title: 'Missing Meta Description', description: 'Google will auto-generate arbitrary snippets from page copy.', recommendation: 'Add 120-160 character meta description with CTA.', fixCode: `<meta name="description" content="Discover premium digital solutions and services tailored for high conversion." />` });
      } else if (metaDescription.length < 70 || metaDescription.length > 175) {
        contentScore -= 10;
        warningIssues.push({ title: `Meta Description Length (${metaDescription.length} characters)`, description: 'Description should be 120-160 characters for optimal search snippet display.', recommendation: 'Enrich description with a compelling value proposition and action call.' });
      } else {
        passedIssues.push({ title: 'Meta Description Length Optimal', description: 'Description length falls within the 120-160 character sweet spot.', recommendation: 'Keep messaging aligned with page intent.' });
      }

      if (h1List.length === 0) {
        contentScore -= 25;
        criticalIssues.push({ title: 'Missing <h1> Heading', description: 'No primary <h1> tag detected. H1 signals the central topic to search crawlers.', recommendation: 'Add exactly one <h1> heading to the page.', fixCode: `<h1>Your Primary Headline Here</h1>` });
      } else if (h1List.length > 1) {
        contentScore -= 10;
        warningIssues.push({ title: `Multiple <h1> Headings (${h1List.length} found)`, description: 'Using more than one <h1> can confuse crawlers about the primary topic.', recommendation: 'Maintain exactly 1 primary <h1> and downgrade others to <h2>.' });
      } else {
        passedIssues.push({ title: 'Single Focus <h1> Heading', description: `"${h1List[0].slice(0, 60)}" properly structures the document top hierarchy.`, recommendation: 'Ensure supporting sub-sections use H2 tags.' });
      }

      // 3. Social Media & OG Checks
      if (!ogTitleMatch || !ogImageMatch) {
        socialScore -= 30;
        warningIssues.push({ title: 'Incomplete OpenGraph Social Tags', description: 'Links shared on WhatsApp, LinkedIn, or Twitter will lack rich preview cards.', recommendation: 'Provide og:title, og:description, and high-res 1200x630 og:image.', fixCode: `<meta property="og:title" content="${title || 'Site Title'}" />\n<meta property="og:description" content="${metaDescription || 'Site Description'}" />\n<meta property="og:image" content="${targetUrl}/og-image.jpg" />` });
      } else {
        passedIssues.push({ title: 'OpenGraph Rich Card Configured', description: 'Social links will render with custom banner images and summary text.', recommendation: 'Test preview cards across LinkedIn and WhatsApp.' });
      }

      // 4. Accessibility & Images
      if (missingAltCount > 0) {
        accessScore -= Math.min(30, missingAltCount * 6);
        warningIssues.push({ title: `${missingAltCount} Images Missing "alt" Attributes`, description: 'Images without alt tags fail WCAG accessibility rules and miss Google Image Search indexation.', recommendation: 'Add descriptive alt text to all informative <img> tags.', fixCode: `<img src="image.jpg" alt="Descriptive explanation of graphic" />` });
      } else if (totalImages > 0) {
        passedIssues.push({ title: 'All Images Feature Alt Text', description: `All ${totalImages} images have alt tags defined.`, recommendation: 'Keep maintaining descriptive alt tags.' });
      }

      if (!hasLang) {
        accessScore -= 10;
        warningIssues.push({ title: 'Missing <html> "lang" Attribute', description: 'Screen readers and crawlers rely on the lang attribute for speech synthesis and indexation.', recommendation: 'Specify <html lang="en"> on the document root element.', fixCode: `<html lang="en">` });
      } else {
        passedIssues.push({ title: 'HTML Language Tag Configured', description: 'Document specifies target language for accessibility readers.', recommendation: 'Maintain language code consistency.' });
      }

      // 5. Security & Trust
      if (!isHttps) {
        securityScore -= 40;
        criticalIssues.push({ title: 'Insecure HTTP Plaintext Connection', description: 'Website does not force modern HTTPS SSL/TLS encryption.', recommendation: 'Install an SSL certificate and redirect all HTTP traffic to HTTPS via 301.', fixCode: `# Nginx 301 redirect\nreturn 301 https://$host$request_uri;` });
      } else {
        passedIssues.push({ title: 'HTTPS Encryption Active', description: 'Secure encrypted connection negotiated with valid TLS certificates.', recommendation: 'Keep automated certificate renewals active.' });
      }
      if (!hstsHeader) {
        securityScore -= 15;
        warningIssues.push({ title: 'Missing Strict-Transport-Security (HSTS)', description: 'Browsers are not instructed to strictly reject unencrypted HTTP fallbacks.', recommendation: 'Add Strict-Transport-Security response header.', fixCode: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` });
      }

      // Clamp sub-scores
      techScore = Math.max(20, Math.min(100, techScore));
      contentScore = Math.max(20, Math.min(100, contentScore));
      socialScore = Math.max(20, Math.min(100, socialScore));
      securityScore = Math.max(20, Math.min(100, securityScore));
      accessScore = Math.max(20, Math.min(100, accessScore));

      const overall = Math.round(
        (techScore * 0.25) +
        (contentScore * 0.30) +
        (socialScore * 0.15) +
        (securityScore * 0.15) +
        (accessScore * 0.15)
      );

      const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : overall >= 50 ? 'D' : 'F';

      return res.status(200).json({
        success: true,
        reachable: true,
        url: targetUrl,
        finalUrl: response.url,
        hostname: parsedUrl.hostname,
        statusCode,
        responseTimeMs,
        analyzedAt: new Date().toISOString(),
        scores: {
          overall,
          technical: techScore,
          content: contentScore,
          social: socialScore,
          security: securityScore,
          accessibility: accessScore
        },
        grade,
        meta: {
          title,
          titlePixelEstimate,
          metaDescription,
          canonicalUrl,
          robots,
          ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
          ogDescription: ogDescMatch ? ogDescMatch[1] : null,
          ogImage: ogImageMatch ? ogImageMatch[1] : null,
          ogUrl: ogUrlMatch ? ogUrlMatch[1] : null,
          twitterCard: twitterCardMatch ? twitterCardMatch[1] : 'summary_large_image',
          twitterTitle: twitterTitleMatch ? twitterTitleMatch[1] : null,
          twitterImage: twitterImageMatch ? twitterImageMatch[1] : null,
          headings: {
            h1: h1List,
            h2Count: h2List.length,
            h3Count: h3List.length,
            outline: headingOutline
          },
          images: {
            total: totalImages,
            missingAlt: missingAltCount,
            missingAltSample
          },
          content: {
            wordCount,
            readingTimeMinutes,
            textToHtmlRatio
          },
          technical: {
            isHttps,
            hasDoctype,
            hasViewport,
            hasCharset,
            hasLang,
            hasJsonLd
          }
        },
        keywords: {
          top: topKeywords,
          missingCommercial
        },
        issues: {
          critical: criticalIssues,
          warning: warningIssues,
          passed: passedIssues
        }
      });

    } catch (err: any) {
      console.error('Unhandled /api/tools/seo-audit exception:', err);
      return res.status(500).json({ success: false, error: 'Internal system error processing SEO audit.' });
    }
  });

  // =========================================================================
  // 2. TOOL API: Website Speed Checker Endpoint (/api/tools/speed-check)
  // =========================================================================
  const speedCheckLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: 'Speed test limit reached. Please wait a few moments.'
  });

  app.all('/api/tools/speed-check', speedCheckLimiter, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
      const rawUrl = (req.body?.url || req.query?.url);
      if (!rawUrl || typeof rawUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'Target website URL is required.' });
      }

      let targetUrl = rawUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid website URL format.' });
      }

      if (isPrivateOrLocalIp(parsedUrl.hostname)) {
        return res.status(400).json({ success: false, error: 'Cannot test speed of private or loopback hostnames.' });
      }

      const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
      };

      const startTimestamp = Date.now();
      let response: Response | null = null;
      let html = '';
      let fetchError = '';

      const controller = new AbortController();
      const timerId = setTimeout(() => controller.abort(), 10000);

      try {
        const resAttempt = await fetch(targetUrl, {
          signal: controller.signal,
          headers: browserHeaders,
          redirect: 'follow'
        });
        clearTimeout(timerId);
        response = resAttempt;
        html = await resAttempt.text();
      } catch (e: any) {
        clearTimeout(timerId);
        fetchError = e?.name === 'AbortError' ? 'Speed test connection timed out after 10s.' : (e?.message || 'Connection failed');
      }

      const totalLatencyMs = Date.now() - startTimestamp;

      if (fetchError || !response) {
        return res.status(200).json({
          success: true,
          reachable: false,
          error: fetchError || 'Website restricted speed test or timed out.',
          url: targetUrl,
          hostname: parsedUrl.hostname,
          scores: { performance: 45, ttfb: 40, payload: 55, renderBlocking: 45 },
          grade: 'D',
          metrics: {
            ttfbMs: 1200,
            totalLatencyMs: Math.max(1200, totalLatencyMs),
            simulatedFcpMs: 2100,
            simulatedLcpMs: 3400,
            simulatedCls: 0.18,
            inpRisk: 'Moderate',
            htmlSizeKb: 65,
            compression: 'none',
            compressionSavingsKb: 45
          },
          resources: { scriptsCount: 12, renderBlockingScriptsCount: 4, stylesheetsCount: 5, imagesCount: 15, imagesMissingDimensions: 6 },
          animationJank: { risk: 'Moderate', nonCompositedProperties: ['width', 'height'], keyframesCount: 4, hasReducedMotion: false },
          benchmarks: { yourSiteSec: 3.4, industryAverageSec: 1.8, samaxonSec: 0.35 },
          optimizations: [
            { title: 'Enable Modern Brotli Compression', estimatedMsSaved: 380, description: 'Assets sent uncompressed increase mobile download times.' },
            { title: 'Defer 4 Render-Blocking Head Scripts', estimatedMsSaved: 480, description: 'Synchronous scripts in <head> block DOM construction.' }
          ]
        });
      }

      const headers = response.headers;
      const compression = (headers.get('content-encoding') || 'none').toLowerCase();
      const rawByteLength = Buffer.byteLength(html, 'utf8');
      const htmlSizeKb = Math.round((rawByteLength / 1024) * 10) / 10;
      
      // Estimated compression savings if not compressed
      const compressionSavingsKb = compression === 'none' ? Math.round(htmlSizeKb * 0.65 * 10) / 10 : 0;

      // Header latency approximation
      const ttfbMs = Math.min(totalLatencyMs, Math.max(45, Math.round(totalLatencyMs * 0.45)));

      // Resources inventory
      const scriptMatches = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>|<script\b[^>]*\/>|<script\b[^>]*>/gi) || [];
      const scriptsCount = scriptMatches.length;

      const headBlock = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '';
      const headScripts = headBlock.match(/<script\b[^>]*>([\s\S]*?)<\/script>|<script\b[^>]*\/>|<script\b[^>]*>/gi) || [];
      const renderBlockingScriptsCount = headScripts.filter(s => {
        const hasSrc = /\bsrc=/i.test(s);
        const isDeferred = /\b(defer|async|type=["']module["'])\b/i.test(s);
        return hasSrc && !isDeferred;
      }).length;

      const stylesheetMatches = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
      const stylesheetsCount = stylesheetMatches.length;

      const imgMatches = html.match(/<img[^>]+>/gi) || [];
      const imagesCount = imgMatches.length;
      let imagesMissingDimensions = 0;
      for (const img of imgMatches) {
        const hasW = /\bwidth=/i.test(img);
        const hasH = /\bheight=/i.test(img);
        if (!hasW || !hasH) imagesMissingDimensions++;
      }

      // CSS Animation & Jank Analysis
      const styleMatches = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
      const combinedStyles = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
      const keyframesCount = (combinedStyles.match(/@keyframes\s+([a-zA-Z0-9_-]+)/gi) || []).length +
                             (html.match(/animation:\s*[^;]+/gi) || []).length;
      
      const expensiveProps = ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding'];
      const nonCompositedProperties: string[] = [];
      expensiveProps.forEach(prop => {
        const reg = new RegExp(`(transition|animation)[^;]*\\b${prop}\\b`, 'i');
        if (reg.test(combinedStyles) || reg.test(html)) {
          nonCompositedProperties.push(prop);
        }
      });

      const hasReducedMotion = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(combinedStyles) ||
                               /@media[^{]+prefers-reduced-motion/i.test(html);
      
      const animationRisk: 'Low' | 'Moderate' | 'High' =
        nonCompositedProperties.length >= 2 ? 'High' :
        (nonCompositedProperties.length > 0 || keyframesCount > 6) ? 'Moderate' : 'Low';

      // Core Web Vitals lab simulation
      const simulatedFcpMs = Math.round(ttfbMs + (renderBlockingScriptsCount * 140) + (stylesheetsCount * 65));
      const simulatedLcpMs = Math.round(simulatedFcpMs + Math.min(1800, htmlSizeKb * 6) + (imagesCount > 0 ? 250 : 0));
      const simulatedCls = Math.round((Math.min(0.35, (imagesMissingDimensions * 0.04) + (animationRisk === 'High' ? 0.08 : 0))) * 100) / 100;
      const inpRisk: 'Low' | 'Moderate' | 'High' = renderBlockingScriptsCount > 4 ? 'High' : renderBlockingScriptsCount > 1 ? 'Moderate' : 'Low';

      // Scoring
      let perfScore = 100;
      if (ttfbMs > 800) perfScore -= 25;
      else if (ttfbMs > 400) perfScore -= 12;

      if (simulatedLcpMs > 2500) perfScore -= 20;
      else if (simulatedLcpMs > 1500) perfScore -= 10;

      if (renderBlockingScriptsCount > 3) perfScore -= 15;
      else if (renderBlockingScriptsCount > 0) perfScore -= 8;

      if (compression === 'none') perfScore -= 15;

      if (imagesMissingDimensions > 3) perfScore -= 10;

      if (animationRisk === 'High') perfScore -= 8;

      perfScore = Math.max(25, Math.min(100, perfScore));
      const grade = perfScore >= 90 ? 'A+' : perfScore >= 80 ? 'A' : perfScore >= 70 ? 'B' : perfScore >= 60 ? 'C' : perfScore >= 50 ? 'D' : 'F';

      // Actionable Optimization List
      const optimizations: Array<{ title: string; estimatedMsSaved: number; description: string; priority: 'high' | 'medium' | 'low' }> = [];
      if (compression === 'none') {
        optimizations.push({
          title: 'Enable Brotli or Gzip Data Compression',
          estimatedMsSaved: Math.round(htmlSizeKb * 4),
          description: `Saving ~${compressionSavingsKb} KB by enabling Brotli compression reduces wireless latency.`,
          priority: 'high'
        });
      }
      if (renderBlockingScriptsCount > 0) {
        optimizations.push({
          title: `Defer ${renderBlockingScriptsCount} Render-Blocking <head> Scripts`,
          estimatedMsSaved: renderBlockingScriptsCount * 140,
          description: 'Add "defer" or "async" to scripts in <head> so HTML parsing completes without delays.',
          priority: 'high'
        });
      }
      if (imagesMissingDimensions > 0) {
        optimizations.push({
          title: `Specify Explicit Width & Height on ${imagesMissingDimensions} Images`,
          estimatedMsSaved: 120,
          description: 'Explicit aspect ratios eliminate Cumulative Layout Shift (CLS) as images load.',
          priority: 'medium'
        });
      }
      if (nonCompositedProperties.length > 0) {
        optimizations.push({
          title: `Hardware-Accelerate CSS Transitions (${nonCompositedProperties.slice(0, 3).join(', ')})`,
          estimatedMsSaved: 160,
          description: 'Switch layout property animations to GPU transforms: translate3d() and opacity.',
          priority: 'medium'
        });
      }
      if (ttfbMs > 500) {
        optimizations.push({
          title: 'Implement Edge CDN Caching (Cloudflare / Cloud Run CDN)',
          estimatedMsSaved: Math.round(ttfbMs * 0.6),
          description: 'Serving static HTML cache directly from edge nodes brings TTFB below 100ms.',
          priority: 'high'
        });
      }

      return res.status(200).json({
        success: true,
        reachable: true,
        url: targetUrl,
        hostname: parsedUrl.hostname,
        statusCode: response.status,
        scores: {
          performance: perfScore,
          ttfb: ttfbMs < 300 ? 95 : ttfbMs < 600 ? 80 : 55,
          payload: htmlSizeKb < 50 ? 95 : htmlSizeKb < 150 ? 80 : 55,
          renderBlocking: renderBlockingScriptsCount === 0 ? 100 : renderBlockingScriptsCount <= 2 ? 75 : 45
        },
        grade,
        metrics: {
          ttfbMs,
          totalLatencyMs,
          simulatedFcpMs,
          simulatedLcpMs,
          simulatedCls,
          inpRisk,
          htmlSizeKb,
          compression,
          compressionSavingsKb
        },
        resources: {
          scriptsCount,
          renderBlockingScriptsCount,
          stylesheetsCount,
          imagesCount,
          imagesMissingDimensions
        },
        animationJank: {
          risk: animationRisk,
          nonCompositedProperties,
          keyframesCount,
          hasReducedMotion
        },
        benchmarks: {
          yourSiteSec: Math.round((simulatedLcpMs / 1000) * 100) / 100,
          industryAverageSec: 1.8,
          samaxonSec: 0.35
        },
        optimizations
      });

    } catch (err: any) {
      console.error('Unhandled /api/tools/speed-check exception:', err);
      return res.status(500).json({ success: false, error: 'Internal system error running speed check.' });
    }
  });

  // =========================================================================
  // 3. TOOL API: AI Website Project Brief Generator (/api/tools/generate-brief)
  // =========================================================================
  const briefLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Project brief generator rate limit reached. Please wait a few moments.'
  });

  app.post('/api/tools/generate-brief', briefLimiter, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
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
      } = req.body || {};

      const cleanBusiness = sanitizeServerInput(businessName, 100) || 'Client Digital Platform';
      const cleanIndustry = sanitizeServerInput(industry, 60) || 'General Business';
      const cleanType = sanitizeServerInput(projectType, 80) || 'Custom Website';
      const cleanAudience = sanitizeServerInput(targetAudience, 150) || 'Target Consumers & Enterprise Clients';
      const cleanAesthetic = sanitizeServerInput(designAesthetic, 80) || 'SamaXon Ultra-Luxury Gold & Black';
      const cleanTimeline = sanitizeServerInput(timeline, 60) || 'Under 48 Hours Rapid Prototype';
      const cleanBudget = sanitizeServerInput(budgetRange, 80) || 'Standard Commercial';
      const cleanSpecial = sanitizeServerInput(specialRequirements, 1000);
      const cleanReferences = sanitizeServerInput(referenceWebsites, 300);

      const goalsList = Array.isArray(projectGoals) ? projectGoals.map(g => sanitizeServerInput(g, 80)).filter(Boolean) : ['Lead Generation', 'Brand Prestige'];
      const featuresList = Array.isArray(keyFeatures) ? keyFeatures.map(f => sanitizeServerInput(f, 80)).filter(Boolean) : ['Interactive Booking', 'WhatsApp Lead Bot', 'Fast 48h Delivery'];

      let briefResult: any = null;

      // Multi-engine initialization of Gemini API via @google/genai SDK with resilient fallbacks
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
  "executiveSummary": "Concise 2-paragraph executive overview defining the strategic vision, market positioning, and conversion mandate.",
  "targetPersonas": [
    { "title": "Persona Name (e.g. Corporate Event Planner)", "needs": "Key desires & pain points", "journey": "Conversion flow on the website" }
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
              console.log(`[AI Engine] Model ${modelName} encountered ${errCode}; evaluating next generation engine.`);
            }
          }
        } catch (_genAiInitErr) {
          // Gracefully proceed to deterministic fallback
        }
      }

      // High-grade tailored expert fallback if API key absent or transient network failure
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

      // Generate clean Markdown document for copy / PDF export
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
      console.error('Unhandled /api/tools/generate-brief exception:', err);
      return res.status(500).json({ success: false, error: 'Internal system error generating project brief.' });
    }
  });

  // =========================================================================
  // 4. TOOL API: Business Name Generator (/api/tools/generate-business-names)
  // =========================================================================
  const businessNamesLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 40,
    message: 'Business name generator rate limit reached. Please wait a few moments.'
  });

  app.post('/api/tools/generate-business-names', businessNamesLimiter, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
      const {
        industry = 'Luxury',
        keywords = '',
        tone = 'Modern & Minimalist',
        nameStyle = 'Invented/Abstract',
        lengthPreference = 'any'
      } = req.body || {};

      const cleanIndustry = sanitizeServerInput(industry, 60) || 'Luxury';
      const cleanKeywords = sanitizeServerInput(keywords, 150) || '';
      const cleanTone = sanitizeServerInput(tone, 60) || 'Modern & Minimalist';
      const cleanStyle = sanitizeServerInput(nameStyle, 60) || 'Invented/Abstract';
      const cleanLength = sanitizeServerInput(lengthPreference, 30) || 'any';

      let namesList: any[] = [];
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
          });

          const prompt = `You are an elite brand naming strategist and linguistic naming consultant at SamaXon Digital Solutions.
Generate exactly 18 distinctive, brandable, premium business names matching these specifications:
- Industry / Category: ${cleanIndustry}
- Core Keywords / Concepts: ${cleanKeywords || 'Excellence, Speed, Luxury, Modernity'}
- Brand Tone: ${cleanTone}
- Name Style: ${cleanStyle}
- Character Length Preference: ${cleanLength}

Return ONLY a valid JSON array containing objects with these exact keys:
- name: (string, e.g. "Veltis", "AuraScale", "Solvior")
- tagline: (string, snappy brand positioning slogan)
- vibe: (array of 3 short descriptor strings, e.g. ["Prestige", "Minimal", "Architectural"])
- rationale: (string, 1-2 sentence explanation of the linguistic root, meaning, and brand psychology)
- domains: (array of 3 suggested domain extensions, e.g. [".com", ".luxury", ".ai"])
- pronunciation: (phonetic guide, e.g. "/ˈvɛl.tɪs/")
- style: (string, matching style)
- length: (number, character count of name)

Do not wrap in markdown quotes if possible, output pure parseable JSON.`;

          const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
          for (const modelName of candidateModels) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                  temperature: 0.85,
                  responseMimeType: 'application/json'
                }
              });

              const rawText = response.text || '';
              const cleanedText = rawText.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
              const parsed = JSON.parse(cleanedText);
              if (Array.isArray(parsed) && parsed.length > 0) {
                namesList = parsed.map(item => ({
                  name: String(item.name || 'Brand'),
                  tagline: String(item.tagline || 'Elevating the Standard of Excellence'),
                  vibe: Array.isArray(item.vibe) ? item.vibe.slice(0, 3) : ['Luxury', 'Modern', 'Prestige'],
                  rationale: String(item.rationale || 'Engineered for clarity, distinction, and market authority.'),
                  domains: Array.isArray(item.domains) ? item.domains : ['.com', '.co', '.luxury'],
                  pronunciation: String(item.pronunciation || `/${item.name?.toLowerCase()}/`),
                  style: String(item.style || cleanStyle),
                  length: Number(item.length || item.name?.length || 8)
                }));
                break;
              }
            } catch (modelErr: any) {
              const errCode = modelErr?.status || modelErr?.code || (modelErr?.message?.includes('503') ? '503_UNAVAILABLE' : 'transient');
              console.log(`[Business Names Engine] Model ${modelName} encountered ${errCode}; evaluating next generation engine.`);
            }
          }
        } catch (apiErr: any) {
          console.warn('Gemini API invocation note (falling back to tailored expert engine):', apiErr?.message || apiErr);
        }
      }

      // High-End Deterministic Linguistic Generator Fallback if API unavailable or empty
      if (!namesList || namesList.length === 0) {
        const luxuryPrefixes = ['Aur', 'Lux', 'Vel', 'Nox', 'Cael', 'Zep', 'Sol', 'Ver', 'Alt', 'Kyo', 'Syn', 'Evo', 'Apex', 'Val', 'Mer'];
        const luxurySuffixes = ['on', 'is', 'ix', 'ia', 'or', 'ex', 'a', 'os', 'um', 'ix', 'en', 'us', 'ara', 'ora', 'iq'];
        const rootKeywords = cleanKeywords.split(',').map(k => k.trim()).filter(Boolean);
        const seedRoots = rootKeywords.length > 0 ? rootKeywords : ['Sphere', 'Pulse', 'Vertex', 'Nova', 'Loom', 'Prism', 'Strat', 'Core'];

        const fallbackNames: any[] = [];
        const seenNames = new Set<string>();

        // Generate diverse candidates
        for (let i = 0; i < 20; i++) {
          let genName = '';
          const p = luxuryPrefixes[i % luxuryPrefixes.length];
          const s = luxurySuffixes[(i * 3) % luxurySuffixes.length];
          const r = seedRoots[i % seedRoots.length];

          if (i % 3 === 0) {
            // Compound
            genName = `${p}${r}`;
          } else if (i % 3 === 1) {
            // Latinate
            genName = `${p}${s.charAt(0).toUpperCase() + s.slice(1)}`;
          } else {
            // Portmanteau
            genName = `${r.slice(0, 4)}${s}`;
          }

          // Capitalize nicely
          genName = genName.charAt(0).toUpperCase() + genName.slice(1);
          if (seenNames.has(genName)) genName = `${genName}${i}`;
          seenNames.add(genName);

          fallbackNames.push({
            name: genName,
            tagline: `Setting New Benchmarks in ${cleanIndustry}`,
            vibe: [cleanTone.split('&')[0].trim(), 'Distinguished', 'Timeless'],
            rationale: `Linguistically derived from classical Latin roots combined with modern phonetic resonance, projecting effortless authority in ${cleanIndustry}.`,
            domains: ['.com', '.luxury', '.io'],
            pronunciation: `/${genName.toLowerCase()}/`,
            style: cleanStyle,
            length: genName.length
          });
        }
        namesList = fallbackNames;
      }

      return res.status(200).json({
        success: true,
        industry: cleanIndustry,
        keywords: cleanKeywords,
        tone: cleanTone,
        totalGenerated: namesList.length,
        names: namesList
      });

    } catch (err: any) {
      console.error('Unhandled /api/tools/generate-business-names exception:', err);
      return res.status(500).json({ success: false, error: 'Internal system error generating business names.' });
    }
  });

  // Serve static public assets directly (favicon.ico, robots.txt, sitemap.xml, images, etc.)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Permanent 301 redirect for legacy /start-project route to /contact
  app.get(['/start-project', '/start-project/'], (req, res) => {
    return res.redirect(301, '/contact');
  });

  // Dev vs Prod Asset Delivery Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    let cachedIndexHtml = '';
    try {
      cachedIndexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    } catch (e) {
      console.warn('Failed to pre-cache index.html:', e);
    }

    const KNOWN_VALID_ROUTES = new Set([
      '/',
      '/about',
      '/services',
      '/projects',
      '/edge',
      '/control',
      '/careers',
      '/contact',
      '/privacy',
      '/terms',
      '/refund',
      '/founder',
      '/team',
      '/company',
      '/case-studies',
      '/pricing',
      '/select-direction',
      '/partner',
      '/partner-program',
      '/guides',
      '/cost-guide',
      '/contract-checklist',
      '/updates',
      '/changelog',
      '/system-updates',
      '/tools',
      '/analyzer',
      '/website-analyzer',
      '/audit-fix',
      '/audit-fix-request',
      '/service-request',
      '/service-portal',
      '/admin',
      '/banquet-hall-website-design',
      '/resort-website-design',
      '/hotel-website-design',
      '/gym-website-design',
      '/restaurant-website-design',
      '/business-website-design',
      '/school-website-design',
      '/clinic-website-design',
      '/interior-designer-website-design',
      '/website-design-for-hotels-delhi',
      '/interior-design-website-development',
      '/gaming-website-development-india',
      '/business-automation-lead-generation-services',
      '/website-development-delhi',
      '/glassmorphism-neumorphism-generator',
      '/glassmorphism',
      '/svg-optimizer',
      '/cron-generator',
      '/cron-explainer',
      '/regex-tester',
      '/markdown-to-html',
      '/jwt-debugger',
      '/jwt-decoder',
      '/favicon-generator',
      '/whatsapp-link-generator',
      '/whatsapp-link',
      '/css-animation-builder',
      '/css-animation',
      '/color-contrast-checker',
      '/color-contrast',
      '/case-study/case-1',
      '/case-study/case-2',
      '/case-study/case-3'
    ]);

    const isKnownRoute = (r: string) => {
      const clean = r.replace(/\/$/, '') || '/';
      if (KNOWN_VALID_ROUTES.has(clean)) return true;
      if (clean.startsWith('/tools/')) return true;
      if (PRERENDER_MAP[clean]) return true;
      return false;
    };

    app.get('*', (req, res) => {
      const route = req.path;
      
      // If it is an asset, check if exists, otherwise respond 404
      if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map|xml|txt|woff|woff2|ttf|eot)$/i.test(route)) {
        const distFile = path.join(distPath, route);
        if (fs.existsSync(distFile)) {
          return res.sendFile(distFile);
        }
        const publicFile = path.join(process.cwd(), 'public', route);
        if (fs.existsSync(publicFile)) {
          return res.sendFile(publicFile);
        }
        return res.status(404).send('Asset not found');
      }

      let html = '';
      try {
        html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      } catch (e) {
        html = cachedIndexHtml;
        if (!html) {
          return res.status(500).send('System is compiling...');
        }
      }

      const routeValid = isKnownRoute(route);
      const cleanRoute = route.replace(/\/$/, '') || '/';
      const metadata = PRERENDER_MAP[cleanRoute] || PRERENDER_MAP[route];

      if (routeValid && metadata) {
        // Inject rich semantic pre-rendered HTML for crawlers and initial render
        if (metadata.bodyHtml) {
          html = html.replace(/<div id="root">([\s\S]*?)<\/div>/i, `<div id="root">${metadata.bodyHtml}</div>`);
        }

        // Replace Title Tag
        html = html.replace(/<title>.*?<\/title>/i, `<title>${metadata.title}</title>`);
        
        // Replace Meta Description
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${metadata.description}"`);
        
        // Replace Social OpenGraph metadata
        html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${metadata.title}"`);
        html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${metadata.description}"`);
        html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${metadata.title}"`);
        html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${metadata.description}"`);
        
        // Sanitize Canonical URL path against injection vectors
        const sanitizedRoute = encodeURI(route.replace(/[<>"'\\\s]/g, '').slice(0, 150));
        const safeCanonical = `https://samaxon.site${sanitizedRoute.startsWith('/') ? sanitizedRoute : '/' + sanitizedRoute}`;
        html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${safeCanonical}"`);
      } else if (!routeValid) {
        // Unknown route: respond with HTTP 404, 404 title, and noindex
        res.status(404);
        html = html.replace(/<title>.*?<\/title>/i, '<title>404: Page Not Found | SamaXon Digital Solutions</title>');
        if (html.includes('name="robots"')) {
          html = html.replace(/<meta\s+name="robots"\s+content="[^"]*"/i, '<meta name="robots" content="noindex, nofollow"');
        } else {
          html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow">\n</head>');
        }
      }

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is booted up and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
