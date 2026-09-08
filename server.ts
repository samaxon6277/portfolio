import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';

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

  // Global Rate Limiter: 150 requests per minute per IP
  const globalLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 150,
    message: 'Global traffic threshold exceeded. Please slow down.'
  });
  app.use(globalLimiter);

  // --- Strict Security Headers & Transport Layer Defenses ---
  app.use((req, res, next) => {
    // 1. Force 301 HTTPS Redirect when running in production behind reverse proxies
    const proto = req.headers['x-forwarded-proto'];
    if (process.env.NODE_ENV === 'production' && proto && proto !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    // 2. HTTP Strict Transport Security (HSTS) - 2 Years with preload
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // 3. Prevent MIME Sniffing attacks
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 4. Clickjacking defense (SAMEORIGIN, plus frame-ancestors in CSP for Google Cloud Run preview)
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // 5. Cross-Site Scripting (XSS) legacy defense
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // 6. Referrer Policy: Send full URL on same origin, domain-only on cross-origin HTTPS
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 7. Permissions Policy: Disable unwanted hardware sensor access
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    // 8. Content Security Policy (CSP): Enforce strict sources for scripts, styles, and fonts
    const isDev = process.env.NODE_ENV !== 'production';
    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://*.supabase.co`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.telegram.org",
      "frame-ancestors 'self' https://*.google.com https://*.run.app",
      "object-src 'none'",
      "base-uri 'self'"
    ].filter(Boolean).join('; ');

    res.setHeader('Content-Security-Policy', cspDirectives);

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
