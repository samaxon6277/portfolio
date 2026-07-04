import { useEffect } from 'react';

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
    const fullTitle = `${title} | SamaXon Premium Digital Studio India`;
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
    const defaultKeywords = "Premium Digital Studio, Express Website Development India, 48-Hour Website Delivery, High-End Portfolio Design Noida, B2B Web Automation, SamaXon Digital";
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || defaultKeywords);

    // 3. Set Open Graph (OG) Tags
    const ogTags = {
      'og:title': fullTitle,
      'og:description': description,
      'og:type': 'website',
      'og:url': `https://samaxon.site${canonicalPath}`,
      'og:image': 'https://samaxon.site/og-image.jpg',
      'og:image:secure_url': 'https://samaxon.site/og-image.jpg',
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': 'https://samaxon.site/og-image.jpg'
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

    // 4. Inject JSON-LD structured data
    // Clear any previous schema script tags
    document.querySelectorAll('.samaxon-jsonld-script').forEach(el => el.remove());
    const existingOldScript = document.getElementById('samaxon-jsonld');
    if (existingOldScript) {
      existingOldScript.remove();
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": "SamaXon Digital Solutions",
      "image": "https://samaxon.site/og-image.jpg",
      "@id": "https://samaxon.site/#organization",
      "url": "https://samaxon.site",
      "telephone": "+918000000000",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "SamaXon Elite Hub, MG Road",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201301",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "sameAs": [
        "https://linkedin.com/company/samaxon",
        "https://twitter.com/samaxon_studio"
      ]
    };

    const schemasToInject: any[] = [];
    if (schemas && schemas.length > 0) {
      schemasToInject.push(...schemas);
    } else {
      const finalSchema = {
        ...defaultSchema,
        ...(schemaData || {})
      };
      schemasToInject.push(finalSchema);
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
    canonicalLink.setAttribute('href', `https://samaxon.site${canonicalPath}`);

  }, [title, description, canonicalPath, schemaType, schemaData, schemas]);

  return null;
}
