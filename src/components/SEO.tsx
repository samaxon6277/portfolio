import { useEffect } from 'react';
import { SITE_CONFIG, generateStudioSchemas } from '../config/siteConfig';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  schemaType?: string;
  schemaData?: Record<string, any>;
  schemas?: any[];
}

export default function SEO({
  title,
  description,
  canonicalPath,
  keywords,
  schemaType = 'ProfessionalService',
  schemaData,
  schemas
}: SEOProps) {
  useEffect(() => {
    // 1. Set dynamic page title
    const fullTitle = `${title} | ${SITE_CONFIG.name}`;
    document.title = fullTitle;

    // 2. Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 2b. Set Meta Keywords
    const defaultKeywords = "Premium Digital Studio, High-Performance Web Development, 48-Hour Web Delivery, Enterprise Software Noida Delhi NCR, B2B Web Automation, Tier 1 Digital Studio, SamaXon Digital";
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || defaultKeywords);

    // 3. Set Open Graph (OG) and Twitter Tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:type': 'website',
      'og:url': `${SITE_CONFIG.baseUrl}${canonicalPath}`,
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

    // 4. Clean previous schema tags
    document.querySelectorAll('.samaxon-jsonld-script').forEach(el => el.remove());
    const existingOldScript = document.getElementById('samaxon-jsonld');
    if (existingOldScript) {
      existingOldScript.remove();
    }

    const schemasToInject: any[] = [];
    if (schemas && schemas.length > 0) {
      schemasToInject.push(...schemas);
    } else {
      // Inject standard Organization, ProfessionalService, and WebSite schemas
      schemasToInject.push(...generateStudioSchemas(canonicalPath));

      // Build BreadcrumbList Schema
      const pathSegments = canonicalPath.split('/').filter(Boolean);
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

      const breadcrumbListSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
      };

      schemasToInject.push(breadcrumbListSchema);

      // Custom Service or Product Schema if extra schemaData is passed
      if (schemaData) {
        const customServiceSchema = {
          "@context": "https://schema.org",
          "@type": schemaType,
          "name": title,
          "description": description,
          "provider": {
            "@type": "ProfessionalService",
            "name": SITE_CONFIG.name,
            "url": SITE_CONFIG.baseUrl
          },
          ...schemaData
        };
        schemasToInject.push(customServiceSchema);
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

    // 5. Update canonical link elements
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${SITE_CONFIG.baseUrl}${canonicalPath}`);

  }, [title, description, canonicalPath, schemaType, schemaData, schemas]);

  return null;
}

