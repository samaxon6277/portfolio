export const PAGE_TO_ROUTE: Record<string, string> = {
  'home': '/',
  'about': '/about',
  'services': '/services',
  'portfolio': '/projects', // mapped to projects
  'edge': '/edge',
  'control': '/control',
  'careers': '/careers',
  'contact': '/contact',
  'privacy': '/privacy',
  'terms': '/terms',
  'refund': '/refund',
  'admin': '/admin',
  'banquet-hall-website-design': '/banquet-hall-website-design',
  'resort-website-design': '/resort-website-design',
  'hotel-website-design': '/hotel-website-design',
  'gym-website-design': '/gym-website-design',
  'restaurant-website-design': '/restaurant-website-design',
  'business-website-design': '/business-website-design',
  'school-website-design': '/school-website-design',
  'clinic-website-design': '/clinic-website-design',
  'interior-designer-website-design': '/interior-designer-website-design'
};

export const ROUTE_TO_PAGE: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/projects': 'portfolio',
  '/edge': 'edge',
  '/control': 'control',
  '/careers': 'careers',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/refund': 'refund',
  '/admin': 'admin',
  '/banquet-hall-website-design': 'banquet-hall-website-design',
  '/resort-website-design': 'resort-website-design',
  '/hotel-website-design': 'hotel-website-design',
  '/gym-website-design': 'gym-website-design',
  '/restaurant-website-design': 'restaurant-website-design',
  '/business-website-design': 'business-website-design',
  '/school-website-design': 'school-website-design',
  '/clinic-website-design': 'clinic-website-design',
  '/interior-designer-website-design': 'interior-designer-website-design'
};

// Dispatches synthetic popstate for smooth reactivity in live SPA context
export const pushRoute = (pageId: string) => {
  const targetRoute = PAGE_TO_ROUTE[pageId] || '/';
  if (window.location.pathname !== targetRoute) {
    window.history.pushState(null, '', targetRoute);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
};
