import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Real-time server-side Bot / Crawler detection middleware
  app.use((req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    const botName = getBotName(ua);
    
    if (botName) {
      const isStatic = /\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map|xml|txt|woff|woff2|ttf|eot)$/i.test(req.path);
      if (!isStatic && !req.path.startsWith('/api/')) {
        const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const ipHash = getMaskedIp(req);
        const crawlerLogId = `craw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        
        // Execute asynchronously without blocking the request
        (async () => {
          try {
            const { error } = await supabase
              .from('crawler_logs')
              .insert({
                id: crawlerLogId,
                bot_name: botName,
                user_agent: ua,
                page_url: pageUrl,
                ip_hash: ipHash,
                source: 'Express Server Middleware',
                created_at: new Date().toISOString()
              });
            if (error) {
              console.warn('Server middleware crawler logging failed:', error.message);
            } else {
              console.log(`[BOT COMPASS DETECTED] Logged bot hit: "${botName}" at "${req.path}"`);
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
    res.json({ status: 'ok', time: new Date().toISOString() });
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is booted up and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
