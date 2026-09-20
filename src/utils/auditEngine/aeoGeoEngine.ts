/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SamaXon Digital Solutions - AEO & GEO Intelligence Engine
 * Answer Engine Optimization (AEO) & Generative Engine Optimization (GEO)
 * 
 * Strictly Evidence-Based Computation — Zero Fabricated Data
 * Evaluates real technical capabilities, semantic markup, and crawl accessibility.
 */

import { AeoData, GeoData, AuditFinding, SchemaJsonLdItem, AuditEvaluationCheck } from './types';

interface AeoGeoInput {
  rawHtml: string;
  schemaItems: SchemaJsonLdItem[];
  detectedSchemaTypes: Set<string>;
  robotsTxtStatus: {
    checked: boolean;
    exists: boolean;
    allowsCrawl: boolean;
    userAgentGroups?: Array<{ userAgent: string; allowsCrawl: boolean; disallowRules: string[]; allowRules: string[] }>;
  };
  finalUrl: string;
}

export function analyzeAeoAndGeo(input: AeoGeoInput): {
  aeoData: AeoData;
  geoData: GeoData;
  findings: AuditFinding[];
} {
  const { rawHtml, schemaItems, detectedSchemaTypes, robotsTxtStatus, finalUrl } = input;
  const findings: AuditFinding[] = [];
  const now = new Date().toISOString();

  // ==========================================
  // 1. AEO (Answer Engine Optimization)
  // ==========================================
  
  // A. Question Coverage & Heading Analysis
  const headingMatches = rawHtml.match(/<h[2-4]\b[^>]*>([\s\S]*?)<\/h[2-4]>/gi) || [];
  const questionHeadings: string[] = [];
  for (const h of headingMatches) {
    const text = h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (/\?$/.test(text) || /^(what|how|why|when|where|who|which|can|is|are|does|should)\b/i.test(text)) {
      questionHeadings.push(text);
    }
  }
  const hasQuestionHeadings = questionHeadings.length > 0;

  // B. Schema Q&A / FAQ Verification
  const hasFaqSchema = detectedSchemaTypes.has('FAQPage') || 
                       detectedSchemaTypes.has('Question') || 
                       /itemtype=["']https?:\/\/schema\.org\/(FAQPage|Question)["']/i.test(rawHtml);
  const hasQaSchema = detectedSchemaTypes.has('QAPage') || 
                      detectedSchemaTypes.has('Answer') || 
                      /itemtype=["']https?:\/\/schema\.org\/(QAPage|Answer)["']/i.test(rawHtml);

  // C. Definition Blocks and Direct Answer Formatting
  const definitionBlockMatches = rawHtml.match(/<dfn\b|<dt\b|<dl\b|<details\b/gi) || [];
  const definitionSentenceMatches = rawHtml.match(/\b([A-Z][a-zA-Z0-9\s]{2,30})\s+(?:is\s+(?:a|an|the)|refers\s+to|means|serves\s+as)\s+[^.!?]{15,120}[.!?]/g) || [];
  const definitionBlocksCount = definitionBlockMatches.length + Math.min(definitionSentenceMatches.length, 10);
  const hasDefinitionBlocks = definitionBlocksCount > 0;

  // D. Lists & Tables
  const tableMatches = (rawHtml.match(/<table\b/gi) || []).length;
  const listMatches = (rawHtml.match(/<[ou]l\b/gi) || []).length;
  const listAndTableCount = tableMatches + listMatches;
  const hasTableOrListStructure = listAndTableCount > 0;

  // E. Direct Answer Paragraph Readability (Paragraphs between 30 and 65 words)
  const paragraphMatches = rawHtml.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) || [];
  let optimalParagraphs = 0;
  let totalParagraphWords = 0;

  for (const p of paragraphMatches) {
    const textOnly = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textOnly.split(' ').filter(Boolean).length;
    totalParagraphWords += wordCount;
    if (wordCount >= 25 && wordCount <= 65) {
      optimalParagraphs++;
    }
  }

  const directAnswerReadability: 'optimal' | 'moderate' | 'low' = 
    optimalParagraphs >= 3 ? 'optimal' :
    optimalParagraphs >= 1 || (paragraphMatches.length > 0 && totalParagraphWords / Math.max(1, paragraphMatches.length) < 80) ? 'moderate' : 'low';

  // F. Entity Clarity & Verified Identity
  const detectedEntities: string[] = [];
  let entityScore = 30; // base score for basic web presence

  if (detectedSchemaTypes.has('Organization')) {
    detectedEntities.push('Organization');
    entityScore += 25;
  }
  if (detectedSchemaTypes.has('LocalBusiness')) {
    detectedEntities.push('LocalBusiness');
    entityScore += 25;
  }
  if (detectedSchemaTypes.has('Person')) {
    detectedEntities.push('Person / Author');
    entityScore += 15;
  }
  if (detectedSchemaTypes.has('Brand') || detectedSchemaTypes.has('Corporation')) {
    detectedEntities.push('Brand');
    entityScore += 15;
  }
  if (detectedSchemaTypes.has('WebSite')) {
    detectedEntities.push('WebSite');
    entityScore += 10;
  }
  if (/<meta\s+property=["']og:site_name["']/i.test(rawHtml)) {
    entityScore += 10;
  }
  const entityClarityScore = Math.min(100, Math.max(20, entityScore));

  // Voice Search Readiness Rating
  const voiceSearchReadiness: 'High' | 'Medium' | 'Low' = 
    (hasFaqSchema || (hasDefinitionBlocks && directAnswerReadability === 'optimal')) && entityClarityScore >= 60 ? 'High' :
    (hasDefinitionBlocks || directAnswerReadability === 'moderate' || hasTableOrListStructure) ? 'Medium' : 'Low';

  // Evidence-based AEO Checks Breakdown
  const aeoChecks: AuditEvaluationCheck[] = [
    {
      name: 'Question Coverage & Conversational Queries',
      category: 'AEO',
      status: (hasFaqSchema || questionHeadings.length >= 2) ? 'PASS' : questionHeadings.length === 1 ? 'WARNING' : 'FAIL',
      evidence: hasFaqSchema 
        ? `Schema FAQ detected + ${questionHeadings.length} question-formatted headings` 
        : `${questionHeadings.length} question-formatted headings found in document`,
      description: 'Checks if common user questions are explicitly structured in headings (H2/H3) or Schema.org FAQ markup.',
      recommendation: questionHeadings.length === 0 ? 'Add H2/H3 headings formatted as natural questions (e.g. "How does...", "What is...").' : undefined
    },
    {
      name: 'Direct Answer Conciseness & Extraction',
      category: 'AEO',
      status: directAnswerReadability === 'optimal' ? 'PASS' : directAnswerReadability === 'moderate' ? 'WARNING' : 'FAIL',
      evidence: `${optimalParagraphs} direct-answer paragraphs (25–65 words) found out of ${paragraphMatches.length} total paragraphs`,
      description: 'Answer engines prioritize concise answers between 30 and 60 words positioned immediately beneath questions.',
      recommendation: directAnswerReadability !== 'optimal' ? 'Provide crisp 35-50 word summary definitions immediately following service or FAQ questions.' : undefined
    },
    {
      name: 'Definition Blocks (<dfn>, <dl>, <details>)',
      category: 'AEO',
      status: definitionBlocksCount >= 2 ? 'PASS' : definitionBlocksCount === 1 ? 'WARNING' : 'FAIL',
      evidence: `${definitionBlockMatches.length} semantic definition elements (<dl>/<dt>/<dfn>/<details>) + ${Math.min(definitionSentenceMatches.length, 10)} definition sentence patterns`,
      description: 'Semantic definition elements enable voice engines to parse term meanings with high confidence.',
      recommendation: definitionBlocksCount === 0 ? 'Utilize semantic <dl>, <dt>, and <dd> tags or HTML5 <details> accordions for term definitions.' : undefined
    },
    {
      name: 'Entity Clarity & Disambiguation',
      category: 'AEO',
      status: entityClarityScore >= 70 ? 'PASS' : entityClarityScore >= 40 ? 'WARNING' : 'FAIL',
      evidence: detectedEntities.length > 0 ? `Entities: ${detectedEntities.join(', ')} (Score: ${entityClarityScore}/100)` : 'No structured entity types detected in JSON-LD',
      description: 'Ensures brand identity, organization type, and primary services are declared in Schema.org.',
      recommendation: entityClarityScore < 70 ? 'Declare Schema.org Organization or LocalBusiness JSON-LD with official brand name and sameAs social links.' : undefined
    },
    {
      name: 'Structured Lists & Tables',
      category: 'AEO',
      status: hasTableOrListStructure ? 'PASS' : 'FAIL',
      evidence: `${tableMatches} tables and ${listMatches} structured lists (<ol>/<ul>) detected`,
      description: 'Structured comparison tables and bulleted lists provide machine-parseable data for comparison queries.',
      recommendation: !hasTableOrListStructure ? 'Organize deliverables, specs, and comparison points into HTML <table> or <ul> elements.' : undefined
    }
  ];

  const aeoRecommendations: string[] = [];
  if (!hasFaqSchema && !hasQaSchema) {
    aeoRecommendations.push('Add Schema.org FAQPage or Question/Answer JSON-LD markup to capture conversational voice queries and AI summaries.');
  }
  if (directAnswerReadability === 'low') {
    aeoRecommendations.push('Structure primary service definitions into concise 40-55 word summary paragraphs directly following H2 questions.');
  }
  if (!hasTableOrListStructure) {
    aeoRecommendations.push('Incorporate HTML comparison tables or bulleted feature lists (<ol>/<ul>) for machine-synthesizable answers.');
  }
  if (entityClarityScore < 60) {
    aeoRecommendations.push('Provide Organization or LocalBusiness JSON-LD markup with name, logo, sameAs social links, and contactPoint.');
  }

  const aeoData: AeoData = {
    directAnswerReadability,
    hasFaqSchema,
    hasQaSchema,
    hasDefinitionBlocks,
    definitionBlocksCount,
    listAndTableCount,
    hasTableOrListStructure,
    entityClarityScore,
    detectedEntities,
    voiceSearchReadiness,
    checks: aeoChecks,
    recommendations: aeoRecommendations
  };

  // ==========================================
  // 2. GEO (Generative Engine Optimization)
  // ==========================================

  // A. AI Crawlers Status from robots.txt
  const uaGroups = robotsTxtStatus.userAgentGroups || [];
  const defaultGroup = uaGroups.find(g => g.userAgent === '*') || { userAgent: '*', allowsCrawl: robotsTxtStatus.allowsCrawl, disallowRules: [], allowRules: [] };

  const checkBotAllowance = (botName: string): 'allowed' | 'disallowed' | 'unrestricted' => {
    if (!robotsTxtStatus.exists) return 'unrestricted';
    const specificGroup = uaGroups.find(g => g.userAgent.toLowerCase().includes(botName.toLowerCase()));
    if (specificGroup) {
      return specificGroup.allowsCrawl ? 'allowed' : 'disallowed';
    }
    // Fall back to wildcard *
    return defaultGroup.allowsCrawl ? 'unrestricted' : 'disallowed';
  };

  const aiBotsStatus = {
    gptBot: checkBotAllowance('gptbot'),
    claudeBot: checkBotAllowance('claudebot') === 'disallowed' ? 'disallowed' : checkBotAllowance('anthropic-ai'),
    perplexityBot: checkBotAllowance('perplexitybot'),
    googleExtended: checkBotAllowance('google-extended'),
    applebotExtended: checkBotAllowance('applebot-extended')
  };

  // B. Factual Citeability & Authoritative Metadata
  const citationMatches = (rawHtml.match(/<a\b[^>]*href=["']https?:\/\/[^"']+["']/gi) || []).length;
  const statisticalClaims = (rawHtml.match(/\b\d+(?:\.\d+)?%\b|\b\d+\s*(?:million|billion|thousand|users|clients|ms|seconds|hours)\b/gi) || []).length;
  
  let citeScore = 30;
  if (citationMatches >= 3) citeScore += 20;
  else if (citationMatches >= 1) citeScore += 10;
  if (statisticalClaims >= 3) citeScore += 25;
  else if (statisticalClaims >= 1) citeScore += 15;
  if (tableMatches > 0) citeScore += 15;
  if (detectedSchemaTypes.has('Article') || detectedSchemaTypes.has('BlogPosting') || detectedSchemaTypes.has('WebPage')) citeScore += 10;
  const factualCiteabilityScore = Math.min(100, Math.max(15, citeScore));

  // C. Author & Publication Dates
  const hasAuthorOrPublisherMeta = /<meta\b[^>]*name=["'](?:author|publisher)["']/i.test(rawHtml) ||
                                  /<meta\b[^>]*property=["'](?:article:author|og:site_name)["']/i.test(rawHtml) ||
                                  /rel=["']author["']/i.test(rawHtml) ||
                                  detectedSchemaTypes.has('Person');

  const hasPublicationDates = /<meta\b[^>]*property=["'](?:article:published_time|article:modified_time)["']/i.test(rawHtml) ||
                             /<time\b/i.test(rawHtml) ||
                             /"datePublished"|"dateModified"/i.test(rawHtml);

  // D. Semantic HTML Structure Ratio
  const totalTags = (rawHtml.match(/<[a-z][a-z0-9-]*\b/gi) || []).length;
  const semanticTags = (rawHtml.match(/<(?:article|section|header|nav|aside|main|figure|figcaption|footer|mark|time)\b/gi) || []).length;
  const semanticHtmlStructureRatio = totalTags > 0 ? Math.min(100, Math.round((semanticTags / Math.max(1, totalTags)) * 100 * 4.5)) : 50;

  // E. Clean Text-to-HTML Ratio
  const strippedText = rawHtml
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const cleanTextToHtmlRatio = rawHtml.length > 0 ? Math.min(100, Math.max(2, Math.round((strippedText.length / rawHtml.length) * 100))) : 10;

  // F. Client-Side Render Dependency
  const hasSubstantialPrerenderedText = strippedText.length > 500;
  const isSpaContainerOnly = /<div\s+id=["'](?:root|app|__next)["']\s*>\s*<\/div>/i.test(rawHtml) && strippedText.length < 250;
  const clientRenderDependency: 'low' | 'moderate' | 'heavy' = 
    isSpaContainerOnly ? 'heavy' :
    hasSubstantialPrerenderedText ? 'low' : 'moderate';

  // G. llms.txt Detection (OPTIONAL emerging standard - NOT required for Google)
  const mentionsLlmsTxt = /llms\.txt/i.test(rawHtml);
  const llmsTxtStatus = {
    checked: true,
    exists: mentionsLlmsTxt,
    isOptional: true as const,
    note: mentionsLlmsTxt 
      ? 'llms.txt reference detected. (Note: llms.txt is an optional markdown file for LLMs; it is not a requirement for Google Search ranking).'
      : 'llms.txt not detected. (Status: Optional — Not required by Google or Bing, and provides no synthetic search ranking boost).'
  };

  // H. Google-Extended Crawler Explanation
  const googleExtendedRule = checkBotAllowance('google-extended');
  const googleExtendedAnalysis = {
    status: googleExtendedRule,
    explanation: googleExtendedRule === 'disallowed'
      ? 'Google-Extended is disallowed. This prevents Google from using site content to train Gemini and Vertex AI models. Note: This DOES NOT affect standard Google Search indexing or web search ranking.'
      : 'Google-Extended is permitted or unrestricted. Content is eligible for Gemini training and grounding datasets. Note: Google-Extended operates separately from standard Google Search indexing.',
    affectsSearchRanking: false as const
  };

  // Overall AI Readiness Level
  const anyBotDisallowed = Object.values(aiBotsStatus).some(status => status === 'disallowed');
  const aiReadinessLevel: 'AI-Ready' | 'Partially Optimized' | 'Blocked / Non-Semantic' =
    anyBotDisallowed ? 'Blocked / Non-Semantic' :
    (factualCiteabilityScore >= 60 && semanticHtmlStructureRatio >= 35 && clientRenderDependency !== 'heavy') ? 'AI-Ready' :
    'Partially Optimized';

  // Explicit Evidence-Based GEO Checks Breakdown
  const geoChecks: AuditEvaluationCheck[] = [
    {
      name: 'AI Web Crawler Access (robots.txt)',
      category: 'GEO',
      status: anyBotDisallowed ? 'WARNING' : 'PASS',
      evidence: `GPTBot: ${aiBotsStatus.gptBot}, ClaudeBot: ${aiBotsStatus.claudeBot}, PerplexityBot: ${aiBotsStatus.perplexityBot}`,
      description: 'Validates whether generative search bots (SearchGPT, Claude, Perplexity) are permitted in robots.txt.',
      recommendation: anyBotDisallowed ? 'Review robots.txt disallow rules if you intend for content to be synthesized in generative AI answers.' : undefined
    },
    {
      name: 'HTML Content Accessibility (Non-JS)',
      category: 'GEO',
      status: clientRenderDependency === 'low' ? 'PASS' : clientRenderDependency === 'moderate' ? 'WARNING' : 'FAIL',
      evidence: `${strippedText.length} characters of initial pre-rendered text detected (${cleanTextToHtmlRatio}% text ratio)`,
      description: 'AI crawlers and lightweight bots often do not execute full JavaScript; primary content must exist in initial HTML.',
      recommendation: clientRenderDependency === 'heavy' ? 'Implement Server-Side Rendering (SSR) or Static Site Generation (SSG) to expose text to non-headless crawlers.' : undefined
    },
    {
      name: 'Factual Claims & Data Citeability',
      category: 'GEO',
      status: factualCiteabilityScore >= 60 ? 'PASS' : factualCiteabilityScore >= 35 ? 'WARNING' : 'FAIL',
      evidence: `${statisticalClaims} numerical/statistical claims, ${tableMatches} data tables, and ${citationMatches} outbound links`,
      description: 'Generative models prioritize content with verifiable claims, exact statistics, and structured references.',
      recommendation: factualCiteabilityScore < 60 ? 'Add concrete verifiable metrics, benchmark data, and authoritative outbound references.' : undefined
    },
    {
      name: 'Author & Publication Provenance',
      category: 'GEO',
      status: (hasAuthorOrPublisherMeta && hasPublicationDates) ? 'PASS' : (hasAuthorOrPublisherMeta || hasPublicationDates) ? 'WARNING' : 'FAIL',
      evidence: `Author metadata: ${hasAuthorOrPublisherMeta ? 'Detected' : 'Missing'} | Date stamps: ${hasPublicationDates ? 'Detected' : 'Missing'}`,
      description: 'Signals content recency and E-E-A-T authorship credibility to LLM citation algorithms.',
      recommendation: (!hasAuthorOrPublisherMeta || !hasPublicationDates) ? 'Add <time datetime="..."> tags, <meta name="author">, or JSON-LD dateModified properties.' : undefined
    },
    {
      name: 'Semantic Content Partitioning',
      category: 'GEO',
      status: semanticHtmlStructureRatio >= 30 ? 'PASS' : 'WARNING',
      evidence: `${semanticTags} semantic landmark tags (<main>, <article>, <section>, <nav>) out of ${totalTags} total tags`,
      description: 'Semantic landmark tags allow LLM chunking algorithms to cleanly isolate core content from navigation/boilerplates.'
    },
    {
      name: 'Optional llms.txt Standard Detection',
      category: 'GEO',
      status: llmsTxtStatus.exists ? 'PASS' : 'NOT AVAILABLE',
      evidence: llmsTxtStatus.note,
      description: 'llms.txt is an optional emerging format providing markdown summaries for LLMs. It is not required for Google ranking.'
    },
    {
      name: 'Google-Extended Crawler Policy',
      category: 'GEO',
      status: 'PASS',
      evidence: `${googleExtendedAnalysis.status.toUpperCase()} — ${googleExtendedAnalysis.explanation}`,
      description: 'Controls Google AI training data ingestion. Has zero impact on traditional Google Search ranking.'
    }
  ];

  const geoRecommendations: string[] = [];
  if (anyBotDisallowed) {
    geoRecommendations.push('Review robots.txt: AI bots (such as GPTBot or ClaudeBot) are currently restricted, preventing generative search citations.');
  }
  if (!hasAuthorOrPublisherMeta) {
    geoRecommendations.push('Add explicit author metadata (<meta name="author"> and JSON-LD Person/Organization) for generative source credibility.');
  }
  if (!hasPublicationDates) {
    geoRecommendations.push('Add <time datetime="..."> tags or JSON-LD datePublished/dateModified timestamps to signal content freshness to AI engines.');
  }
  if (clientRenderDependency === 'heavy') {
    geoRecommendations.push('Adopt Server-Side Rendering (SSR) or Static Site Generation (SSG) so AI crawlers without JavaScript execution can index content.');
  }

  const aiVisibilityDisclaimer = 'GEO Readiness evaluates the on-page technical parseability, entity definitions, and crawler accessibility for generative AI engines. Real-world citations in ChatGPT Search, Perplexity, or Google AI Overviews depend on external model training and user query relevance. We do not fabricate third-party citation metrics.';

  const geoData: GeoData = {
    aiBotsStatus,
    factualCiteabilityScore,
    hasAuthorOrPublisherMeta,
    hasPublicationDates,
    semanticHtmlStructureRatio,
    cleanTextToHtmlRatio,
    clientRenderDependency,
    aiReadinessLevel,
    llmsTxtStatus,
    googleExtendedAnalysis,
    checks: geoChecks,
    aiVisibilityDisclaimer,
    recommendations: geoRecommendations
  };

  // ==========================================
  // 3. Generate Explicit Actionable Findings
  // ==========================================
  
  if (anyBotDisallowed) {
    findings.push({
      id: 'geo-ai-bots-blocked',
      category: 'seo',
      title: 'AI & Generative Search Crawlers Restricted in robots.txt',
      description: 'One or more major generative AI web crawlers (GPTBot, ClaudeBot, PerplexityBot) are restricted or disallowed in your robots.txt, preventing citation in ChatGPT Search, Claude, and Perplexity.',
      severity: 'medium',
      impact: 'High',
      confidence: 'verified',
      status: 'warn',
      currentValue: 'Disallow rules active',
      expectedValue: 'Permissive or selectively allowed rules',
      evidence: JSON.stringify(aiBotsStatus),
      recommendation: 'If you want your website cited in AI-generated answers, allow GPTBot, ClaudeBot, and PerplexityBot in robots.txt.',
      suggestedFix: {
        language: 'plaintext',
        code: `# Allow AI engines to index and cite content\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /`,
        description: 'Explicitly permit AI web crawlers in /robots.txt'
      },
      detectedAt: now,
      checkType: 'server',
      availabilityStatus: 'available'
    });
  }

  if (!hasFaqSchema && !hasQaSchema) {
    findings.push({
      id: 'aeo-faq-schema-missing',
      category: 'seo',
      title: 'Missing Structured Q&A or FAQPage Schema for Voice & AI Answers',
      description: 'No Schema.org FAQPage or Question markup was detected in JSON-LD. Search engines and AI answer engines rely on structured Q&A to provide instant answers in voice search and AI Overviews.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: '0 structured Q&A entities',
      expectedValue: 'Schema.org FAQPage JSON-LD',
      recommendation: 'Add structured FAQPage schema containing common client questions and definitive answers.',
      suggestedFix: {
        language: 'json',
        code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What services does SamaXon provide?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "SamaXon delivers custom web development, mobile applications, and AI integrations."\n    }\n  }]\n}\n</script>`,
        description: 'Standard Schema.org FAQPage JSON-LD snippet'
      },
      detectedAt: now,
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  if (entityClarityScore < 50) {
    findings.push({
      id: 'aeo-entity-schema-missing',
      category: 'seo',
      title: 'Missing Organization / Brand Entity Verification Schema',
      description: 'The page lacks Organization or LocalBusiness structured markup. AI models (Gemini, ChatGPT, Claude) depend on entity definitions to disambiguate your brand identity.',
      severity: 'medium',
      impact: 'Moderate',
      confidence: 'verified',
      status: 'warn',
      currentValue: `Entity score: ${entityClarityScore}/100`,
      expectedValue: 'Organization or LocalBusiness Schema',
      recommendation: 'Add Organization Schema with canonical brand name, logo, contact points, and sameAs verified social URLs.',
      suggestedFix: {
        language: 'json',
        code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Brand Name",\n  "url": "${finalUrl}",\n  "logo": "${finalUrl}/logo.png",\n  "sameAs": [\n    "https://twitter.com/yourhandle",\n    "https://linkedin.com/company/yourhandle"\n  ]\n}\n</script>`,
        description: 'Organization JSON-LD schema snippet'
      },
      detectedAt: now,
      checkType: 'static-rule',
      availabilityStatus: 'available'
    });
  }

  return { aeoData, geoData, findings };
}
