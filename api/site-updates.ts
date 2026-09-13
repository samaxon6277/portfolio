// Vercel Serverless Function: /api/site-updates
import { CODEBASE_RELEASES } from '../src/data/codebaseReleases';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    latestUpdate: CODEBASE_RELEASES[0] || null,
    releases: CODEBASE_RELEASES,
    serverTime: new Date().toISOString()
  });
}
