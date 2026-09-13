import { useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  schemaType?: string;
  schemaData?: Record<string, any>;
  schemas?: any[];
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  canonicalPath,
  keywords,
  schemaType = 'ProfessionalService',
  schemaData,
  schemas,
  noindex = false
}: SEOProps) {
  useEffect(() => {
    // 1. Dynamic document title
    const fullTitle = title.includes(SITE_CONFIG.name) 
      ? title 
      : `${title} | ${SITE_CONFIG.name}`;
    document.title = fullTitle;

    // 2. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Meta Keywords
    const defaultKeywords = "Premium Digital Studio, High-Performance Web Development, 48-Hour Web Delivery, Enterprise Software Noida Delhi NCR, B2B Web Automation, Tier 1 Digital Studio, SamaXon Digital";
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || defaultKeywords);

    // 4. Robots Directives (Handles indexable vs restricted/404 routes)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // 5. Open Graph (OG) and Twitter Cards
    const canonicalUrl = `${SITE_CONFIG.baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:type': 'website',
      'og:url': canonicalUrl,
      'og:image': `${SITE_CONFIG.baseUrl}/og-image.jpg`,
      'og:image:secure_url': `${SITE_CONFIG.baseUrl}/og-image.jpg`,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': `${SITE_CONFIG.baseUrl}/og-image.jpg`
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`) || 
                document.querySelector(`meta[name="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 6. Structured Data Strategy (No duplicate Organization or WebSite schemas)
    // Clean previously injected route-specific schema scripts
    document.querySelectorAll('.samaxon-jsonld-script').forEach(el => el.remove());
    const existingOldScript = document.getElementById('samaxon-jsonld');
    if (existingOldScript) {
      existingOldScript.remove();
    }

    // Only inject route-specific schemas if not in noindex mode
    if (!noindex) {
      const schemasToInject: any[] = [];

      if (schemas && schemas.length > 0) {
        // Inject explicit route-specific schemas (e.g. FAQPage, Tool WebApplication, Niche Service)
        schemasToInject.push(...schemas);
      } else {
        // Build BreadcrumbList Schema for non-homepage routes
        const pathSegments = canonicalPath.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          const breadcrumbItems = [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${SITE_CONFIG.baseUrl}/`
            }
          ];

          let accumulatedPath = '';
          pathSegments.forEach((segment, index) => {
            accumulatedPath += `/${segment}`;
            const humanizedName = segment
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            breadcrumbItems.push({
              "@type": "ListItem",
              "position": index + 2,
              "name": humanizedName,
              "item": `${SITE_CONFIG.baseUrl}${accumulatedPath}`
            });
          });

          schemasToInject.push({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems
          });
        }

        // Route-specific Service or Product Schema if extra schemaData is passed
        if (schemaData) {
          schemasToInject.push({
            "@context": "https://schema.org",
            "@type": schemaType,
            "name": title,
            "description": description,
            "provider": {
              "@type": "Organization",
              "@id": `${SITE_CONFIG.baseUrl}/#organization`
            },
            ...schemaData
          });
        }
      }

      schemasToInject.forEach((schema, i) => {
        const script = document.createElement('script');
        script.className = 'samaxon-jsonld-script';
        script.id = `samaxon-jsonld-${i}`;
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    // 7. Canonical URL link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

  }, [title, description, canonicalPath, keywords, schemaType, schemaData, schemas, noindex]);

  return null;
}
