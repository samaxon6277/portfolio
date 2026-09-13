// Vercel Serverless Function & Search Engine Metadata API: /api/tools-seo
import { 
  ALL_TOOLS_SEO, 
  getToolSeoMetadata, 
  generateToolJsonLdSchema, 
  generateToolFaqSchema, 
  generateToolHowToSchema,
  getTotalKeywordsAcrossAllTools 
} from '../src/data/toolsSeoKeywords';

export default async function handler(req: any, res: any) {
  // CORS & Caching Headers for Search Crawlers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { tool, format } = req.query || {};

  // If specific tool requested
  if (tool && typeof tool === 'string') {
    const toolMeta = getToolSeoMetadata(tool);
    
    if (format === 'schema') {
      return res.status(200).json({
        webApplication: generateToolJsonLdSchema(toolMeta),
        faq: generateToolFaqSchema(toolMeta),
        howTo: generateToolHowToSchema(toolMeta)
      });
    }

    return res.status(200).json({
      status: 'success',
      tool: toolMeta,
      schemas: {
        webApplication: generateToolJsonLdSchema(toolMeta),
        faq: generateToolFaqSchema(toolMeta),
        howTo: generateToolHowToSchema(toolMeta)
      }
    });
  }

  // Otherwise return full catalog with 1,000+ keywords index per tool
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
    featuresCount: t.featureList.length,
    schemas: {
      webApplication: generateToolJsonLdSchema(t),
      faq: generateToolFaqSchema(t)
    }
  }));

  return res.status(200).json({
    status: 'success',
    site: 'SamaXon Digital Solutions',
    domain: 'https://samaxon.site',
    toolsCount: allToolsArray.length,
    totalKeywordsIndexed: getTotalKeywordsAcrossAllTools(),
    tools: allToolsArray,
    lastUpdated: new Date().toISOString()
  });
}
