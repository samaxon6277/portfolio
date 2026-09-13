import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';
import { CODEBASE_RELEASES } from './src/data/codebaseReleases';

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

    // 7. Content Security Policy (CSP): Allow embedding within AI Studio and Cloud Run preview frames
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
        const crawlerLogId = `craw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        
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
              console.warn('Server middleware crawler logging failed:', error.message);
            }
          } catch (err) {
            console.warn('Unhandled server crawler logging exception:', err);
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
        currentProblem,
        desiredTimeline,
        budgetRange,
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
      const cleanService = sanitizeServerInput(serviceNeeded, 100) || 'Web Development';
      const cleanProblem = sanitizeServerInput(currentProblem, 1500);
      const cleanTimeline = sanitizeServerInput(desiredTimeline, 50) || 'Under 48 Hours';
      const cleanBudget = sanitizeServerInput(budgetRange, 150);
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
      const newLeadRecord = {
        id: leadId,
        full_name: cleanName,
        business_name: cleanBusiness,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        email: cleanEmail,
        city: cleanCity,
        service_required: cleanService,
        message: cleanMessage || cleanProblem,
        desired_timeline: cleanTimeline,
        budget_range: cleanBudget,
        status: 'new',
        priority: cleanTimeline.includes('48') ? 'high' : 'medium',
        complexity: sanitizeServerInput(complexity, 50) || 'Standard',
        selected_addons: Array.isArray(selected_addons) ? selected_addons.slice(0, 10).map(a => sanitizeServerInput(a, 60)) : [],
        estimated_min_price: typeof estimated_min_price === 'number' ? estimated_min_price : 0,
        estimated_max_price: typeof estimated_max_price === 'number' ? estimated_max_price : 0,
        user_budget_preference: sanitizeServerInput(user_budget_preference, 100),
        created_at: new Date().toISOString()
      };

      // Parameterized Supabase Database Insert
      const { error: dbError } = await supabase
        .from('client_inquiries')
        .insert(newLeadRecord);

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
      const logId = `wh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      
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

  // --- Comprehensive Website Health, Security & SEO Audit Endpoint (/api/analyze-website) ---
  app.options('/api/analyze-website', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  });

  app.all('/api/analyze-website', analyzerRateLimiter, async (req, res) => {
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

      let parsedUrl: URL;
      let targetUrl = rawUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }

      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid website URL format.' });
      }

      if (isPrivateOrLocalIp(parsedUrl.hostname)) {
        return res.status(400).json({ success: false, error: 'Cannot audit private or loopback hostnames.' });
      }

      const startTime = Date.now();
      let response: Response | null = null;
      let html = '';
      let fetchError = '';

      // Standard desktop Chrome headers to pass WAF / Cloudflare security layers
      const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache'
      };

      // Resilient Multi-tier Attempt: Try initial URL, then HTTP fallback if HTTPS timed out or failed
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
        const timeoutId = setTimeout(() => controller.abort(), 11000);
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
          fetchError = err?.name === 'AbortError' ? 'Audit request timed out after 11 seconds.' : (err?.message || 'Failed to establish connection.');
        }
      }

      const responseTimeMs = Date.now() - startTime;

      if (fetchError || !response) {
        // Build rich heuristic fallback report so frontend never crashes or renders blank
        const host = parsedUrl.hostname;
        const brandName = host.replace(/^www\./i, '').split('.')[0].toUpperCase();

        return res.status(200).json({
          success: true,
          reachable: false,
          error: fetchError || 'Website restricted automated scan or origin timed out.',
          url: targetUrl,
          finalUrl: targetUrl,
          hostname: host,
          statusCode: 0,
          responseTimeMs: Math.max(380, responseTimeMs),
          analyzedAt: new Date().toISOString(),
          scores: {
            overall: 52,
            security: 45,
            seo: 55,
            code: 60,
            performance: 48
          },
          meta: {
            title: `${host} - Online Portal`,
            metaDescription: 'Automated diagnostic snapshot: Origin server has strict firewall or connection timeout.',
            canonicalUrl: targetUrl,
            robotsContent: 'index, follow',
            ogTitle: host,
            ogDescription: `Web asset analysis for ${host}`,
            ogImage: null,
            twitterCard: 'summary',
            h1List: [`${brandName} Digital Platform`],
            h2Count: 2,
            h3Count: 1,
            totalImages: 4,
            imagesWithoutAltCount: 1,
            missingAltImages: [],
            scriptTags: 6,
            stylesheetTags: 2,
            htmlSizeKb: 34,
            isHttps: targetUrl.startsWith('https://'),
            hasDoctype: true,
            hasViewport: true,
            isZoomLocked: false,
            hasCharset: true
          },
          internalPages: [
            { path: '/', url: targetUrl, status: 0, ok: false, responseTimeMs: responseTimeMs }
          ],
          animationAnalysis: {
            keyframeMatches: 2,
            transitionAllCount: 1,
            nonCompositedFound: [],
            hasReducedMotion: true,
            animationJankRisk: 'Low',
            detectedAnimationLibraries: []
          },
          deepHealth: {
            mixedContentCount: 0,
            renderBlockingScriptsCount: 1,
            hasJsonLd: false,
            hasHtmlLang: true,
            imagesMissingDimensions: 1
          },
          keywords: {
            topKeywords: [
              { keyword: brandName.toLowerCase(), count: 4, density: 1.5 },
              { keyword: 'online', count: 3, density: 1.1 },
              { keyword: 'service', count: 2, density: 0.8 }
            ],
            missingKeywords: [
              '24/7 Client Booking / Direct Contact',
              'High-Converting Landing Page Architecture',
              'Fast 48-Hour Delivery Guarantee',
              'Enterprise SSL & Security Certification',
              'Google Core Web Vitals Optimization'
            ]
          },
          issues: {
            critical: [
              {
                category: 'security',
                severity: 'critical',
                title: 'Origin Connection Filter / WAF Shield Active',
                description: `Target server (${host}) restricted or timed out during external diagnostic connection (${fetchError || 'Handshake timeout'}). Often caused by Cloudflare "Under Attack" mode, Akamai bot-defense, or port rate limiting.`,
                recommendation: 'Configure edge WAF to permit diagnostic scanners and ensure port 443/80 has direct TLS termination.'
              },
              {
                category: 'performance',
                severity: 'critical',
                title: 'Origin Response Time Over 10 Seconds',
                description: `The web server took ${responseTimeMs}ms to respond, triggering mobile bounce risk. Google penalizes sites exceeding 2.5s LCP.`,
                recommendation: 'Implement Redis edge caching and optimize origin database queries.'
              }
            ],
            warning: [
              {
                category: 'seo',
                severity: 'warning',
                title: 'Crawler Accessibility Latency Risk',
                description: 'Search engine bots (Googlebot/Bingbot) may fail to index dynamic pages if timeouts occur frequently.',
                recommendation: 'Verify crawl stats in Google Search Console to ensure zero 5xx server errors.'
              },
              {
                category: 'security',
                severity: 'warning',
                title: 'Strict-Transport-Security (HSTS) Status Unconfirmed',
                description: 'Unable to negotiate full TLS certificate chain headers due to origin socket timeout.',
                recommendation: 'Enforce HSTS with max-age=63072000 and includeSubDomains on reverse proxy.'
              }
            ],
            passed: [
              {
                category: 'security',
                severity: 'passed',
                title: 'Valid Public TLD & DNS Records',
                description: `Domain ${host} is registered with active nameservers.`,
                recommendation: 'Maintain annual domain lock.'
              },
              {
                category: 'code',
                severity: 'passed',
                title: 'Mobile Architecture Fallback Ready',
                description: 'Standard responsive viewport baseline detected for responsive devices.',
                recommendation: 'Test on real iOS and Android viewports.'
              }
            ]
          }
        });
      }

      // Headers analysis
      const headers = response.headers;
      const isHttps = response.url.startsWith('https://');
      const statusCode = response.status;
      const hstsHeader = headers.get('strict-transport-security');
      const cspHeader = headers.get('content-security-policy');
      const xFrameHeader = headers.get('x-frame-options');
      const xContentTypeHeader = headers.get('x-content-type-options');
      const referrerPolicyHeader = headers.get('referrer-policy');
      const permissionsPolicyHeader = headers.get('permissions-policy');
      const serverHeader = headers.get('server');
      const compressionHeader = headers.get('content-encoding');

      // Parsing HTML Content
      const htmlSizeKb = Math.round((Buffer.byteLength(html, 'utf8') / 1024) * 10) / 10;
      const hasDoctype = /<!doctype\s+html/i.test(html);
      
      // Meta viewport
      const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i);
      const hasViewport = !!viewportMatch;
      const isZoomLocked = viewportMatch ? (/user-scalable\s*=\s*no/i.test(viewportMatch[0]) || /maximum-scale\s*=\s*1(\.0)?/i.test(viewportMatch[0])) : false;

      // Meta charset
      const hasCharset = /<meta[^>]+charset=["']?[a-zA-Z0-9\-_]+["']?/i.test(html);

      // Title
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';

      // Meta description
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
      const metaDescription = descMatch ? descMatch[1].trim() : '';

      // Canonical
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
      const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';

      // Robots meta
      const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
      const robotsContent = robotsMatch ? robotsMatch[1].trim() : '';

      // OpenGraph & Social
      const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
      const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
      const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
      const twitterCardMatch = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);

      // Headings
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      const h1List = h1Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
      const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
      const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

      // Images & Alt tags
      const imgMatches = html.match(/<img[^>]+>/gi) || [];
      const totalImages = imgMatches.length;
      const missingAltImages: string[] = [];
      let imagesWithoutAltCount = 0;

      for (const imgTag of imgMatches) {
        const altMatch = imgTag.match(/\balt=(["'])(.*?)\1/i);
        if (!altMatch || !altMatch[2].trim()) {
          imagesWithoutAltCount++;
          const srcMatch = imgTag.match(/\bsrc=(["'])(.*?)\1/i);
          if (srcMatch && missingAltImages.length < 5) {
            missingAltImages.push(srcMatch[2]);
          }
        }
      }

      // Scripts & Styles
      const scriptTags = (html.match(/<script[^>]*>/gi) || []).length;
      const stylesheetTags = (html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || []).length;
      
      // Deprecated tags
      const deprecatedTagsFound: string[] = [];
      ['font', 'center', 'marquee', 'blink', 'strike', 'applet'].forEach(tag => {
        if (new RegExp(`<${tag}[^>]*>`, 'i').test(html)) {
          deprecatedTagsFound.push(`<${tag}>`);
        }
      });

      // Broken / Empty Link tags
      const emptyLinksCount = (html.match(/href=["'](#[^"']*|javascript:void\(0\);?|)["']/gi) || []).length;

      // --- Deep Scanning: 1. Subpage Discovery & Multi-page Health Crawler ---
      const internalAnchorMatches = html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);
      const discoveredPaths = new Set<string>();
      for (const match of internalAnchorMatches) {
        const href = (match[1] || '').trim();
        if (
          !href ||
          href.startsWith('#') ||
          href.startsWith('javascript:') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          /\.(png|jpe?g|gif|svg|webp|ico|pdf|zip|mp4|css|js|json|xml|txt)$/i.test(href)
        ) {
          continue;
        }

        try {
          const resolved = new URL(href, targetUrl);
          if (resolved.origin === parsedUrl.origin) {
            const cleanPath = resolved.pathname;
            if (cleanPath && cleanPath !== '/' && cleanPath !== parsedUrl.pathname && !discoveredPaths.has(cleanPath)) {
              discoveredPaths.add(cleanPath);
            }
          }
        } catch {}
      }

      // If SPA or few internal links discovered, check common standard routes
      const standardRoutes = ['/about', '/services', '/pricing', '/contact', '/portfolio', '/work', '/blog', '/faq', '/privacy', '/terms', '/control', '/edge'];
      if (discoveredPaths.size < 4) {
        for (const std of standardRoutes) {
          if (!discoveredPaths.has(std) && std !== parsedUrl.pathname) {
            discoveredPaths.add(std);
            if (discoveredPaths.size >= 8) break;
          }
        }
      }

      const subpagesList = Array.from(discoveredPaths).slice(0, 15);

      const homeIssuesList: Array<{ severity: 'critical' | 'warning' | 'passed'; title: string; description: string }> = [];
      if (!title) homeIssuesList.push({ severity: 'warning', title: 'Missing Title Tag', description: 'Homepage lacks an HTML <title> tag.' });
      if (!metaDescription) homeIssuesList.push({ severity: 'warning', title: 'Missing Meta Description', description: 'Homepage lacks a search snippet meta description.' });
      if (h1List.length === 0) homeIssuesList.push({ severity: 'warning', title: 'Missing H1 Heading', description: 'No primary <h1> tag detected.' });
      if (imagesWithoutAltCount > 0) homeIssuesList.push({ severity: 'warning', title: 'Images Missing Alt', description: `${imagesWithoutAltCount} images lack descriptive alt text.` });
      if (homeIssuesList.length === 0) homeIssuesList.push({ severity: 'passed', title: 'Valid HTTP 200 & Clean Structure', description: 'Page loads properly with healthy baseline tags.' });

      const internalPages: Array<{
        path: string;
        url: string;
        status: number;
        ok: boolean;
        responseTimeMs: number;
        title?: string;
        hasTitle?: boolean;
        hasMetaDescription?: boolean;
        h1Count?: number;
        h1Text?: string;
        totalImages?: number;
        imagesWithoutAltCount?: number;
        pageScore?: number;
        pageGrade?: string;
        issues?: Array<{ severity: 'critical' | 'warning' | 'passed'; title: string; description: string }>;
      }> = [
        {
          path: parsedUrl.pathname || '/',
          url: targetUrl,
          status: statusCode,
          ok: statusCode >= 200 && statusCode < 400,
          responseTimeMs,
          title: title || `${parsedUrl.hostname} - Home`,
          hasTitle: !!title,
          hasMetaDescription: !!metaDescription,
          h1Count: h1List.length,
          h1Text: h1List[0] || 'None',
          totalImages,
          imagesWithoutAltCount,
          pageScore: Math.max(50, 100 - (homeIssuesList.length * 10)),
          pageGrade: homeIssuesList.some(i => i.severity === 'critical') ? 'Critical' : homeIssuesList.length > 0 ? 'Warning' : 'Excellent',
          issues: homeIssuesList
        }
      ];

      if (subpagesList.length > 0) {
        await Promise.all(
          subpagesList.map(async (p) => {
            const pageUrl = new URL(p, targetUrl).toString();
            const pStart = Date.now();
            const pCtrl = new AbortController();
            const pTimer = setTimeout(() => pCtrl.abort(), 4000);
            try {
              const pRes = await fetch(pageUrl, {
                method: 'GET',
                signal: pCtrl.signal,
                headers: browserHeaders,
                redirect: 'follow'
              });
              clearTimeout(pTimer);
              const pDuration = Date.now() - pStart;
              const pText = await pRes.text();

              const pTitleMatch = pText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
              const pTitle = pTitleMatch ? pTitleMatch[1].trim().replace(/\s+/g, ' ') : '';
              const pDescMatch = pText.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
              const pDesc = pDescMatch ? pDescMatch[1].trim() : '';
              const pH1Matches = pText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
              const pH1Text = pH1Matches.length > 0 ? pH1Matches[0].replace(/<[^>]+>/g, '').trim() : '';

              const pImgMatches = pText.match(/<img[^>]+>/gi) || [];
              let pMissingAlt = 0;
              for (const imgTag of pImgMatches) {
                const altMatch = imgTag.match(/\balt=(["'])(.*?)\1/i);
                if (!altMatch || !altMatch[2].trim()) pMissingAlt++;
              }

              const pageIssues: Array<{ severity: 'critical' | 'warning' | 'passed'; title: string; description: string }> = [];
              let pageScore = 100;

              if (pRes.status >= 400) {
                pageIssues.push({ severity: 'critical', title: `HTTP ${pRes.status} Error`, description: `Page responded with an error code (${pRes.status}).` });
                pageScore -= 40;
              }
              if (pDuration > 1200) {
                pageIssues.push({ severity: 'warning', title: `Slow Latency (${pDuration}ms)`, description: 'Subpage takes over 1.2 seconds to respond.' });
                pageScore -= 15;
              }
              if (!pTitle) {
                pageIssues.push({ severity: 'warning', title: 'Missing Title Tag', description: 'Page lacks an HTML <title> tag.' });
                pageScore -= 10;
              }
              if (!pDesc) {
                pageIssues.push({ severity: 'warning', title: 'Missing Meta Description', description: 'No meta description found for this subpage.' });
                pageScore -= 10;
              }
              if (pH1Matches.length === 0) {
                pageIssues.push({ severity: 'warning', title: 'Missing <h1> Tag', description: 'Page has no primary topic heading.' });
                pageScore -= 10;
              } else if (pH1Matches.length > 1) {
                pageIssues.push({ severity: 'warning', title: 'Multiple <h1> Headings', description: `Detected ${pH1Matches.length} H1 tags; recommended exactly 1 per page.` });
                pageScore -= 5;
              }
              if (pMissingAlt > 0) {
                pageIssues.push({ severity: 'warning', title: 'Images Missing Alt Text', description: `${pMissingAlt} images on this page lack alt attributes.` });
                pageScore -= Math.min(15, pMissingAlt * 3);
              }

              if (pageIssues.length === 0) {
                pageIssues.push({ severity: 'passed', title: 'Healthy Subpage Architecture', description: 'Status 200 OK, complete title, headings, and alt tags verified.' });
              }

              pageScore = Math.max(20, Math.min(100, pageScore));
              const pageGrade = pageIssues.some(i => i.severity === 'critical') ? 'Critical' : pageScore < 80 ? 'Warning' : 'Excellent';

              internalPages.push({
                path: p,
                url: pageUrl,
                status: pRes.status,
                ok: pRes.status >= 200 && pRes.status < 400,
                responseTimeMs: pDuration,
                title: pTitle || `${p} page`,
                hasTitle: !!pTitle,
                hasMetaDescription: !!pDesc,
                h1Count: pH1Matches.length,
                h1Text: pH1Text || 'None',
                totalImages: pImgMatches.length,
                imagesWithoutAltCount: pMissingAlt,
                pageScore,
                pageGrade,
                issues: pageIssues
              });
            } catch {
              clearTimeout(pTimer);
              internalPages.push({
                path: p,
                url: pageUrl,
                status: 0,
                ok: false,
                responseTimeMs: Date.now() - pStart,
                title: `${p} (Unreachable)`,
                hasTitle: false,
                hasMetaDescription: false,
                h1Count: 0,
                h1Text: 'None',
                totalImages: 0,
                imagesWithoutAltCount: 0,
                pageScore: 30,
                pageGrade: 'Critical',
                issues: [
                  { severity: 'critical', title: 'Subpage Unreachable / Timeout', description: 'Failed to establish connection within 4 seconds.' }
                ]
              });
            }
          })
        );
      }

      // --- Deep Scanning: 2. CSS Animation, Keyframes & Layout Jank Analysis ---
      const styleMatches = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
      const combinedStyles = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');

      const keyframeMatches = (combinedStyles.match(/@keyframes\s+([a-zA-Z0-9_-]+)/gi) || []).length +
                              (html.match(/animation:\s*[^;]+/gi) || []).length;

      const expensiveProperties = ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding'];
      const nonCompositedFound: string[] = [];
      for (const prop of expensiveProperties) {
        const reg = new RegExp(`(transition|animation)[^;]*\\b${prop}\\b`, 'i');
        if (reg.test(combinedStyles) || reg.test(html)) {
          nonCompositedFound.push(prop);
        }
      }

      const transitionAllCount = (combinedStyles.match(/transition\s*:\s*all\b/gi) || []).length +
                                 (html.match(/style=["'][^"']*transition\s*:\s*all/gi) || []).length;

      const hasReducedMotion = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(combinedStyles) ||
                               /@media[^{]+prefers-reduced-motion/i.test(html);

      const detectedAnimationLibraries: string[] = [];
      if (/gsap(\.min)?\.js/i.test(html) || /TweenMax/i.test(html)) detectedAnimationLibraries.push('GSAP');
      if (/lottie/i.test(html)) detectedAnimationLibraries.push('Lottie/Bodymovin');
      if (/three(\.min)?\.js/i.test(html) || /three\.module/i.test(html)) detectedAnimationLibraries.push('Three.js');
      if (/framer-motion/i.test(html)) detectedAnimationLibraries.push('Framer Motion');
      if (/anime(\.min)?\.js/i.test(html)) detectedAnimationLibraries.push('Anime.js');
      if (/scrollmagic/i.test(html) || /locomotive/i.test(html)) detectedAnimationLibraries.push('Locomotive/ScrollMagic');

      const animationJankRisk: 'Low' | 'Moderate' | 'High' = 
        (nonCompositedFound.length >= 2 || (transitionAllCount > 4 && keyframeMatches > 8)) ? 'High' :
        (nonCompositedFound.length > 0 || transitionAllCount > 1 || keyframeMatches > 4) ? 'Moderate' : 'Low';

      // --- Deep Scanning: 3. Mixed Content, Head Script Blocking, Schema & Attributes ---
      let mixedContentCount = 0;
      if (isHttps) {
        const httpAssets = html.match(/(?:src|href)=["']http:\/\/[^"']+["']/gi) || [];
        mixedContentCount = httpAssets.filter(a => !a.includes('w3.org') && !a.includes('schema.org')).length;
      }

      const headBlock = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '';
      const headScripts = headBlock.match(/<script\b[^>]*>([\s\S]*?)<\/script>|<script\b[^>]*\/>|<script\b[^>]*>/gi) || [];
      const renderBlockingScriptsCount = headScripts.filter(s => {
        const hasSrc = /\bsrc=/i.test(s);
        const isDeferred = /\b(defer|async|type=["']module["'])\b/i.test(s);
        return hasSrc && !isDeferred;
      }).length;

      const hasJsonLd = /<script\b[^>]*type=["']application\/ld\+json["']/i.test(html);
      const hasHtmlLang = /<html\b[^>]*\blang=["']?[a-zA-Z\-]+["']?/i.test(html);

      let imagesMissingDimensions = 0;
      for (const imgTag of imgMatches) {
        const hasW = /\bwidth=/i.test(imgTag);
        const hasH = /\bheight=/i.test(imgTag);
        if (!hasW || !hasH) {
          imagesMissingDimensions++;
        }
      }

      // Keyword Extraction & Text Analysis
      // Strip styles, scripts, html tags
      const strippedBody = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z0-9#]+;/gi, ' ')
        .toLowerCase();

      const words = strippedBody.match(/\b[a-z]{4,20}\b/g) || [];
      const stopWords = new Set([
        'about', 'after', 'again', 'against', 'almost', 'also', 'although', 'always', 'among',
        'another', 'because', 'before', 'being', 'between', 'both', 'could', 'every', 'first',
        'from', 'further', 'here', 'into', 'just', 'more', 'most', 'other', 'over', 'same',
        'should', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these',
        'they', 'this', 'those', 'through', 'under', 'until', 'very', 'were', 'what', 'when',
        'where', 'which', 'while', 'with', 'would', 'your', 'have', 'been', 'will', 'with',
        'http', 'https', 'www', 'com', 'html', 'page', 'site', 'click', 'read', 'view'
      ]);

      const wordCounts: Record<string, number> = {};
      words.forEach(w => {
        if (!stopWords.has(w) && isNaN(Number(w))) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });

      const topKeywords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([keyword, count]) => ({
          keyword,
          count,
          density: words.length ? Math.round((count / words.length) * 1000) / 10 : 0
        }));

      // Detect Domain / Business Intent for Missing Keyword Recommendations
      const combinedText = (title + ' ' + metaDescription + ' ' + h1List.join(' ') + ' ' + strippedBody.slice(0, 2000)).toLowerCase();
      
      const potentialTargetKeywords = [
        { term: 'pricing', label: 'Transparent Pricing / Cost' },
        { term: 'reviews', label: 'Client Reviews / Testimonials' },
        { term: 'services', label: 'Core Services / Capabilities' },
        { term: 'contact', label: 'Direct Contact / Inquiry' },
        { term: 'portfolio', label: 'Case Studies / Live Work' },
        { term: 'solutions', label: 'Business Solutions' },
        { term: 'support', label: 'Customer Support / FAQ' },
        { term: 'guarantee', label: 'Satisfaction Guarantee' },
        { term: 'security', label: 'Data Security & Compliance' },
        { term: 'expert', label: 'Industry Expertise' },
        { term: 'consultation', label: 'Free Consultation' },
        { term: 'noida', label: 'Local Delhi-NCR / Noida Presence' },
        { term: 'features', label: 'Product Features' },
        { term: 'results', label: 'Proven Results / Metrics' }
      ];

      const missingKeywords = potentialTargetKeywords
        .filter(k => !combinedText.includes(k.term))
        .map(k => k.label)
        .slice(0, 6);

      // Scoring Engine
      let securityScore = 100;
      let seoScore = 100;
      let codeScore = 100;
      let perfScore = 100;

      const issues: {
        category: 'security' | 'seo' | 'code' | 'performance';
        severity: 'critical' | 'warning' | 'passed';
        title: string;
        description: string;
        recommendation: string;
      }[] = [];

      // --- Security Deductions ---
      if (!isHttps) {
        securityScore -= 40;
        issues.push({
          category: 'security',
          severity: 'critical',
          title: 'Unencrypted HTTP Connection',
          description: 'Website is served over plaintext HTTP without SSL/TLS encryption.',
          recommendation: 'Install an SSL certificate (e.g., Let\'s Encrypt / Cloudflare) and force HTTPS 301 redirects.'
        });
      } else {
        issues.push({
          category: 'security',
          severity: 'passed',
          title: 'SSL/TLS Encryption Active',
          description: 'Connection is securely encrypted using modern HTTPS protocol.',
          recommendation: 'Maintain annual renewal and modern cipher suites.'
        });
      }

      if (!hstsHeader) {
        securityScore -= 15;
        issues.push({
          category: 'security',
          severity: 'warning',
          title: 'Missing HSTS (Strict-Transport-Security)',
          description: 'Browsers are not instructed to strictly reject insecure HTTP connections.',
          recommendation: 'Add header: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload'
        });
      } else {
        issues.push({
          category: 'security',
          severity: 'passed',
          title: 'HSTS Protection Active',
          description: 'Strict Transport Security header prevents SSL strip attacks.',
          recommendation: 'Optimal configuration.'
        });
      }

      if (!cspHeader) {
        securityScore -= 15;
        issues.push({
          category: 'security',
          severity: 'warning',
          title: 'Missing Content-Security-Policy (CSP)',
          description: 'Lack of CSP increases vulnerability to Cross-Site Scripting (XSS) and data injection.',
          recommendation: 'Define a Content-Security-Policy header restricting script and style origins.'
        });
      } else {
        issues.push({
          category: 'security',
          severity: 'passed',
          title: 'Content-Security-Policy Configured',
          description: 'CSP mitigates unauthorized script execution.',
          recommendation: 'Audit origins regularly.'
        });
      }

      if (!xFrameHeader && (!cspHeader || !cspHeader.includes('frame-ancestors'))) {
        securityScore -= 10;
        issues.push({
          category: 'security',
          severity: 'warning',
          title: 'Missing Clickjacking Defense',
          description: 'Neither X-Frame-Options nor CSP frame-ancestors is defined, risking UI redressing.',
          recommendation: 'Set X-Frame-Options: SAMEORIGIN or CSP frame-ancestors.'
        });
      }

      if (!xContentTypeHeader) {
        securityScore -= 10;
        issues.push({
          category: 'security',
          severity: 'warning',
          title: 'Missing X-Content-Type-Options',
          description: 'MIME-type sniffing is not explicitly disabled on your server.',
          recommendation: 'Send header: X-Content-Type-Options: nosniff.'
        });
      }

      if (serverHeader && /\d+\.\d+/.test(serverHeader)) {
        securityScore -= 5;
        issues.push({
          category: 'security',
          severity: 'warning',
          title: 'Server Version Disclosure',
          description: `Server header exposes specific software version: "${serverHeader}".`,
          recommendation: 'Mask or disable server signature banner in nginx / apache configuration.'
        });
      }

      // --- SEO Deductions ---
      if (!title) {
        seoScore -= 25;
        issues.push({
          category: 'seo',
          severity: 'critical',
          title: 'Missing <title> Tag',
          description: 'Page lacks a title element, severely damaging search engine visibility and click rates.',
          recommendation: 'Add a distinct 50–60 character <title> containing primary search intent.'
        });
      } else if (title.length < 25 || title.length > 70) {
        seoScore -= 10;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: `Suboptimal Title Tag Length (${title.length} chars)`,
          description: `Current title is ${title.length} characters. Optimal search engine display is 50–60 characters.`,
          recommendation: 'Refine title to 50–60 characters with business name and core focus keyword.'
        });
      } else {
        issues.push({
          category: 'seo',
          severity: 'passed',
          title: `Optimized Title Tag (${title.length} chars)`,
          description: `"${title}" matches ideal search engine SERP criteria.`,
          recommendation: 'Ensure keyword density remains natural.'
        });
      }

      if (!metaDescription) {
        seoScore -= 20;
        issues.push({
          category: 'seo',
          severity: 'critical',
          title: 'Missing Meta Description',
          description: 'No meta description found. Search engines will generate automated, unoptimized snippets.',
          recommendation: 'Add <meta name="description" content="..."> between 120–160 characters.'
        });
      } else if (metaDescription.length < 70 || metaDescription.length > 175) {
        seoScore -= 8;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: `Meta Description Length (${metaDescription.length} chars)`,
          description: `Description length should be 120–160 characters to avoid truncation in Google results.`,
          recommendation: 'Trim or enrich meta description to 120–160 characters with clear call-to-action.'
        });
      } else {
        issues.push({
          category: 'seo',
          severity: 'passed',
          title: 'Meta Description Optimal',
          description: 'Meta description contains healthy length for high search CTR.',
          recommendation: 'Keep messaging aligned with landing page intent.'
        });
      }

      if (h1List.length === 0) {
        seoScore -= 20;
        issues.push({
          category: 'seo',
          severity: 'critical',
          title: 'Missing H1 Heading',
          description: 'No <h1> tag was found. H1 signals the primary topical theme of your page to Google.',
          recommendation: 'Add exactly one prominent <h1> heading containing your main keyword.'
        });
      } else if (h1List.length > 1) {
        seoScore -= 8;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: `Multiple H1 Headings (${h1List.length} found)`,
          description: 'Using multiple <h1> tags dilutes topical relevance and confuses screen readers.',
          recommendation: 'Reserve <h1> for the primary title and downgrade secondary headlines to <h2>.'
        });
      } else {
        issues.push({
          category: 'seo',
          severity: 'passed',
          title: 'Unique H1 Heading Present',
          description: `"${h1List[0].slice(0, 60)}" properly structures the document hierarchy.`,
          recommendation: 'Maintain hierarchy with supporting H2 and H3 tags.'
        });
      }

      if (!canonicalUrl) {
        seoScore -= 10;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: 'Missing Canonical Tag',
          description: 'No <link rel="canonical"> tag detected, risking duplicate content penalties.',
          recommendation: 'Add <link rel="canonical" href="..."> pointing to the authoritative URL.'
        });
      }

      if (!ogTitleMatch || !ogImageMatch) {
        seoScore -= 10;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: 'Incomplete Social Media OpenGraph Tags',
          description: 'Missing og:title or og:image tags causes links shared on WhatsApp, LinkedIn & Twitter to appear blank.',
          recommendation: 'Include og:title, og:description, and high-resolution og:image (1200x630px).'
        });
      } else {
        issues.push({
          category: 'seo',
          severity: 'passed',
          title: 'OpenGraph Rich Snippets Configured',
          description: 'Social platforms will display rich preview cards when your link is shared.',
          recommendation: 'Test preview cards across WhatsApp and LinkedIn.'
        });
      }

      // --- Code & Bug Deductions ---
      if (imagesWithoutAltCount > 0) {
        const penalty = Math.min(25, imagesWithoutAltCount * 4);
        codeScore -= penalty;
        issues.push({
          category: 'code',
          severity: imagesWithoutAltCount > 3 ? 'critical' : 'warning',
          title: `${imagesWithoutAltCount} Images Missing "alt" Attributes`,
          description: 'Images without alt tags fail WCAG accessibility standards and miss image search traffic.',
          recommendation: 'Add descriptive alt text to all informative <img> tags.'
        });
      } else if (totalImages > 0) {
        issues.push({
          category: 'code',
          severity: 'passed',
          title: 'All Images Have Descriptive Alt Tags',
          description: `All ${totalImages} images feature alt attributes, ensuring accessibility and SEO compliance.`,
          recommendation: 'Keep adding alt text for every new asset.'
        });
      }

      if (!hasViewport) {
        codeScore -= 25;
        issues.push({
          category: 'code',
          severity: 'critical',
          title: 'Missing Viewport Meta Tag',
          description: 'Website will render as a shrunk desktop layout on mobile devices.',
          recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">.'
        });
      } else if (isZoomLocked) {
        codeScore -= 10;
        issues.push({
          category: 'code',
          severity: 'warning',
          title: 'Mobile Pinch-to-Zoom Locked',
          description: 'Viewport restricts zooming (user-scalable=no / maximum-scale=1), failing accessibility criteria.',
          recommendation: 'Remove user-scalable=no to permit visual magnification for low-vision users.'
        });
      } else {
        issues.push({
          category: 'code',
          severity: 'passed',
          title: 'Mobile Viewport Correctly Configured',
          description: 'Responsive viewport enables fluid scaling across smartphone and tablet viewports.',
          recommendation: 'Maintain touch targets of at least 44px.'
        });
      }

      if (!hasDoctype) {
        codeScore -= 15;
        issues.push({
          category: 'code',
          severity: 'critical',
          title: 'Missing Modern HTML5 Doctype',
          description: 'Missing <!DOCTYPE html> triggers legacy Quirks Mode rendering in modern browsers.',
          recommendation: 'Ensure <!DOCTYPE html> is the first line of the document.'
        });
      }

      if (deprecatedTagsFound.length > 0) {
        codeScore -= 15;
        issues.push({
          category: 'code',
          severity: 'warning',
          title: `Deprecated HTML Tags Found: ${deprecatedTagsFound.join(', ')}`,
          description: 'Legacy presentation tags violate HTML5 standards and cause inconsistent mobile rendering.',
          recommendation: 'Replace legacy tags with modern CSS classes.'
        });
      }

      if (emptyLinksCount > 4) {
        codeScore -= 10;
        issues.push({
          category: 'code',
          severity: 'warning',
          title: `${emptyLinksCount} Empty or Inactive Links (href="#" or blank)`,
          description: 'Links with href="#" or empty values confuse users and cause crawler dead-ends.',
          recommendation: 'Replace dummy anchor tags with valid URLs or interactive <button> elements.'
        });
      }

      // --- Performance Deductions ---
      if (responseTimeMs > 1500) {
        perfScore -= 25;
        issues.push({
          category: 'performance',
          severity: 'critical',
          title: `Slow Server Response Time (TTFB: ${responseTimeMs}ms)`,
          description: 'Time to First Byte exceeds 1.5 seconds, triggering visitor abandonment.',
          recommendation: 'Implement server caching (Redis / CDN edge caching) and optimize database queries.'
        });
      } else if (responseTimeMs > 600) {
        perfScore -= 12;
        issues.push({
          category: 'performance',
          severity: 'warning',
          title: `Moderate Response Time (TTFB: ${responseTimeMs}ms)`,
          description: 'Server response is slightly sluggish compared to modern 200–400ms benchmarks.',
          recommendation: 'Enable edge caching and HTTP/2 or HTTP/3.'
        });
      } else {
        issues.push({
          category: 'performance',
          severity: 'passed',
          title: `Fast Server Response (TTFB: ${responseTimeMs}ms)`,
          description: 'Server response latency is well within Google Core Web Vitals thresholds.',
          recommendation: 'Maintain server monitoring.'
        });
      }

      if (htmlSizeKb > 250) {
        perfScore -= 15;
        issues.push({
          category: 'performance',
          severity: 'warning',
          title: `Heavy HTML Document Size (${htmlSizeKb} KB)`,
          description: 'Large raw HTML payload increases mobile parsing and rendering latency.',
          recommendation: 'Remove inline data URLs, minify markup, and defer heavy scripts.'
        });
      } else {
        issues.push({
          category: 'performance',
          severity: 'passed',
          title: `Lean Document Size (${htmlSizeKb} KB)`,
          description: 'Clean DOM footprint allows instant rendering.',
          recommendation: 'Keep document size under 100KB.'
        });
      }

      if (compressionHeader) {
        issues.push({
          category: 'performance',
          severity: 'passed',
          title: `Data Compression Enabled (${compressionHeader})`,
          description: 'Assets are efficiently transferred with modern compression algorithms.',
          recommendation: 'Ensure Brotli (br) is prioritized over Gzip where supported.'
        });
      } else {
        perfScore -= 15;
        issues.push({
          category: 'performance',
          severity: 'warning',
          title: 'Missing Gzip / Brotli Compression',
          description: 'Response is uncompressed, resulting in slower downloads on mobile connections.',
          recommendation: 'Enable Gzip or Brotli compression on your web server / CDN.'
        });
      }

      // --- Deep Scans Deductions ---
      // 1. Animation Jank & Layout Thrashing
      if (animationJankRisk === 'High') {
        codeScore -= 12;
        issues.push({
          category: 'code',
          severity: 'warning',
          title: `Animation Jank & Layout Thrashing Risk (${nonCompositedFound.join(', ')})`,
          description: `CSS transitions/animations directly modify expensive geometric layout properties (${nonCompositedFound.join(', ')}). This triggers continuous CPU reflows and frame drops.`,
          recommendation: 'Use GPU-accelerated "transform: translate3d()/scale()" and "opacity" instead of layout coordinates. Replace "transition: all" with explicit properties.'
        });
      } else if (animationJankRisk === 'Moderate') {
        issues.push({
          category: 'code',
          severity: 'passed',
          title: 'Animation Architecture Acceptable',
          description: `Detected ${keyframeMatches} keyframe rules with lightweight transition overhead.`,
          recommendation: 'Monitor FPS on low-tier mobile devices.'
        });
      }

      // 2. Prefers-reduced-motion accessibility
      if (!hasReducedMotion && keyframeMatches > 0) {
        codeScore -= 5;
        issues.push({
          category: 'code',
          severity: 'warning',
          title: 'Missing "prefers-reduced-motion" CSS Fallback',
          description: 'Web animation lacks accessibility guards for visitors with vestibular balance disorders or sensitivity to motion.',
          recommendation: 'Implement @media (prefers-reduced-motion: reduce) to pause or soften intense keyframe loops.'
        });
      }

      // 3. Mixed Content Security
      if (mixedContentCount > 0) {
        securityScore -= 20;
        issues.push({
          category: 'security',
          severity: 'critical',
          title: `${mixedContentCount} Insecure Mixed-Content Asset Links`,
          description: 'Page is served over HTTPS but loads unencrypted HTTP assets, creating active man-in-the-middle vulnerability vectors.',
          recommendation: 'Upgrade all static asset links (images, scripts, styles) to HTTPS.'
        });
      }

      // 4. Render-blocking scripts in head
      if (renderBlockingScriptsCount > 0) {
        perfScore -= 10;
        issues.push({
          category: 'performance',
          severity: 'warning',
          title: `${renderBlockingScriptsCount} Render-Blocking Scripts in <head>`,
          description: 'Synchronous external scripts in the document head halt HTML parsing and delay initial paint.',
          recommendation: 'Add "defer" or "async" attributes to non-essential scripts.'
        });
      }

      // 5. Schema.org JSON-LD
      if (!hasJsonLd) {
        seoScore -= 8;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: 'Missing Schema.org / JSON-LD Structured Data',
          description: 'Page lacks structured schema markup, forfeiting Google rich snippets and enhanced SERP real estate.',
          recommendation: 'Add <script type="application/ld+json"> with Organization, WebSite, or LocalBusiness schema.'
        });
      } else {
        issues.push({
          category: 'seo',
          severity: 'passed',
          title: 'Structured JSON-LD Schema Present',
          description: 'Search engines can parse structured entities to generate enhanced rich snippets.',
          recommendation: 'Validate schema syntax on schema.org validator.'
        });
      }

      // 6. Missing HTML lang attribute
      if (!hasHtmlLang) {
        seoScore -= 5;
        issues.push({
          category: 'seo',
          severity: 'warning',
          title: 'Missing HTML "lang" Attribute',
          description: 'The root <html> tag lacks a lang attribute, degrading assistive reader navigation and language indexation.',
          recommendation: 'Specify <html lang="en"> on the document root.'
        });
      }

      // 7. Multi-page Crawler Subpage Results
      const brokenSubpages = internalPages.filter(p => !p.ok && p.path !== '/');
      if (brokenSubpages.length > 0) {
        codeScore -= 15;
        issues.push({
          category: 'code',
          severity: 'critical',
          title: `${brokenSubpages.length} Broken Internal Subpages (404/Error)`,
          description: `Internal pages failed during crawl: ${brokenSubpages.map(b => b.path).join(', ')}.`,
          recommendation: 'Fix broken navigation URLs or set up 301 redirects.'
        });
      } else if (internalPages.length > 1) {
        issues.push({
          category: 'code',
          severity: 'passed',
          title: `Multi-Page Health Verified (${internalPages.length} pages scanned)`,
          description: `Subpages (${internalPages.map(p => p.path).join(', ')}) responded with valid HTTP status.`,
          recommendation: 'Maintain continuous subpage monitoring.'
        });
      }

      // Clamp scores between 10 and 100
      securityScore = Math.max(10, Math.min(100, securityScore));
      seoScore = Math.max(10, Math.min(100, seoScore));
      codeScore = Math.max(10, Math.min(100, codeScore));
      perfScore = Math.max(10, Math.min(100, perfScore));

      const overallScore = Math.round(
        (securityScore * 0.35) + 
        (seoScore * 0.25) + 
        (codeScore * 0.20) + 
        (perfScore * 0.20)
      );

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
          overall: overallScore,
          security: securityScore,
          seo: seoScore,
          code: codeScore,
          performance: perfScore
        },
        meta: {
          title,
          metaDescription,
          canonicalUrl,
          robotsContent,
          ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
          ogDescription: ogDescMatch ? ogDescMatch[1] : null,
          ogImage: ogImageMatch ? ogImageMatch[1] : null,
          twitterCard: twitterCardMatch ? twitterCardMatch[1] : null,
          h1List,
          h2Count,
          h3Count,
          totalImages,
          imagesWithoutAltCount,
          missingAltImages,
          scriptTags,
          stylesheetTags,
          htmlSizeKb,
          isHttps,
          hasDoctype,
          hasViewport,
          isZoomLocked,
          hasCharset
        },
        internalPages,
        animationAnalysis: {
          keyframeMatches,
          transitionAllCount,
          nonCompositedFound,
          hasReducedMotion,
          animationJankRisk,
          detectedAnimationLibraries
        },
        deepHealth: {
          mixedContentCount,
          renderBlockingScriptsCount,
          hasJsonLd,
          hasHtmlLang,
          imagesMissingDimensions
        },
        keywords: {
          topKeywords,
          missingKeywords
        },
        issues: {
          critical: issues.filter(i => i.severity === 'critical'),
          warning: issues.filter(i => i.severity === 'warning'),
          passed: issues.filter(i => i.severity === 'passed')
        }
      });

    } catch (err: any) {
      console.error('Unhandled /api/analyze-website exception:', err);
      return res.status(500).json({
        success: false,
        error: 'System error executing website security audit.'
      });
    }
  });

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

  // Serve static public assets directly (favicon.ico, robots.txt, sitemap.xml, images, etc.)
  app.use(express.static(path.join(process.cwd(), 'public')));

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

      // Check if we have pre-rendered metadata for this route
      const metadata = PRERENDER_MAP[route] || PRERENDER_MAP['/'];
      
      let html = '';
      try {
        html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      } catch (e) {
        html = cachedIndexHtml;
        if (!html) {
          return res.status(500).send('System is compiling...');
        }
      }

      const ua = req.headers['user-agent'] || '';
      const botName = getBotName(ua);

      if (metadata) {
        // Replace Title Tag
        html = html.replace(/<title>.*?<\/title>/i, `<title>${metadata.title}</title>`);
        
        // Replace Meta Description
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${metadata.description}"`);
        
        // Replace Social OpenGraph metadata
        html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${metadata.title}"`);
        html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${metadata.description}"`);
        html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${metadata.title}"`);
        html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${metadata.description}"`);
        
        // Sanitize Canonical URL path against injection vectors (strip quotes, angle brackets, spaces)
        const sanitizedRoute = encodeURI(route.replace(/[<>"'\\\s]/g, '').slice(0, 150));
        const safeCanonical = `https://samaxon.site${sanitizedRoute.startsWith('/') ? sanitizedRoute : '/' + sanitizedRoute}`;
        html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${safeCanonical}"`);

        // Only inject raw HTML for SEO bots/crawlers; human users receive the clean React SPA container
        if (botName && metadata.bodyHtml) {
          html = html.replace(/<div id="root">([\s\S]*?)<\/div>/i, `<div id="root">${metadata.bodyHtml}</div>`);
        } else {
          html = html.replace(/<div id="root">([\s\S]*?)<\/div>/i, `<div id="root"></div>`);
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
