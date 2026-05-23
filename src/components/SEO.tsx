import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  schemaType?: 'Organization' | 'ProfessionalService' | 'WebSite';
  schemaData?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  canonicalPath,
  schemaType = 'ProfessionalService',
  schemaData
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

    // 3. Set Open Graph (OG) Tags
    const ogTags = {
      'og:title': fullTitle,
      'og:description': description,
      'og:type': 'website',
      'og:url': `https://samaxon.site${canonicalPath}`,
      'og:image': 'https://samaxon.site/og-image.png',
      'og:image:secure_url': 'https://samaxon.site/og-image.png',
      'og:image:type': 'image/png',
      'og:image:width': '1730',
      'og:image:height': '909',
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': 'https://samaxon.site/og-image.png'
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
    const existingScript = document.getElementById('samaxon-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": "SamaXon",
      "image": "https://samaxon.site/favicon.png",
      "@id": "https://samaxon.site/#organization",
      "url": "https://samaxon.site",
      "telephone": "+918000000000",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "SamaXon Elite Hub, MG Road",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560001",
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
        "https://twitter.com/samaxon"
      ]
    };

    const finalSchema = {
      ...defaultSchema,
      ...(schemaData || {})
    };

    const script = document.createElement('script');
    script.id = 'samaxon-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(finalSchema);
    document.head.appendChild(script);

    // Scroll to top of the page on route load
    window.scrollTo({ top: 0, behavior: 'instant' as any });

  }, [title, description, canonicalPath, schemaType, schemaData]);

  return null;
}
