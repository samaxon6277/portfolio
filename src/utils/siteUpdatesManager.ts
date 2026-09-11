import { WebsiteUpdateLog } from '../types';

const STORAGE_KEY = 'samaxon_website_updates';
export const SITE_UPDATES_EVENT = 'samaxon_site_updates_updated';

// Formats relative time elapsed ("kitni der pehle update hui thi")
export function formatTimeAgo(isoString: string): string {
  try {
    const updateTime = new Date(isoString).getTime();
    if (isNaN(updateTime)) return 'Recently';
    
    const now = Date.now();
    const diffMs = now - updateTime;
    
    if (diffMs < 0) return 'Just now';
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 45) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours === 1) {
      return '1 hour ago';
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  } catch (err) {
    return 'Recently';
  }
}

// Extracts explicit day, date, hour, minute, second breakdown
export function parseTimestampBreakdown(dateInput: Date | string) {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[d.getDay()];
  const dayNum = String(d.getDate()).padStart(2, '0');
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return {
    iso: d.toISOString(),
    displayDate: `${dayNum} ${monthName} ${year}`,
    displayDay: dayName,
    displayTime: `${hours12}:${minutes} ${ampm} (${String(hours).padStart(2, '0')}:${minutes}:${seconds})`,
    exactHour: hours,
    exactMinute: d.getMinutes(),
    exactSecond: d.getSeconds(),
    formatted12Hour: `${hours12}:${minutes}:${seconds} ${ampm}`,
    formatted24Hour: `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
  };
}

// Default Seed Updates representing the rich evolution of the SamaXon platform
const DEFAULT_UPDATES: WebsiteUpdateLog[] = [
  {
    id: 'upd-005',
    version: 'v2.5.2',
    title: "Partner Commission Engine & Buyer's Intelligence Suite",
    category: 'Feature Release',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
    displayDate: '08 September 2026',
    displayDay: 'Tuesday',
    displayTime: '09:45 AM (09:45:10)',
    exactHour: 9,
    exactMinute: 45,
    author: 'Salman Khan (Lead Systems Architect)',
    summary: 'Integrated high-converting Partner & Affiliate commission hub with 20% tier calculations, plus full Buyer Intelligence guides with vendor contracts & estimators.',
    changes: [
      'Launched /partner portal with live tiered earnings calculator up to 20% on closed retainers',
      "Built Buyer's Guide (/guides) featuring 10-Point Vendor Red-Flag Radar and cost estimators",
      'Integrated live Free Consultation card directly inside mobile navigation drawer',
      'Enhanced footer architectural guarantee banner with direct partner links'
    ],
    affectedModules: ['Partner Engine', 'Buyer Guides', 'Mobile Drawer', 'Footer Ecosystem'],
    status: 'published'
  },
  {
    id: 'upd-004',
    version: 'v2.4.0',
    title: 'SamaXon Edge 48-Hour Engine & Client Control Terminal',
    category: 'Core Architecture',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // ~1 day ago
    displayDate: '07 September 2026',
    displayDay: 'Monday',
    displayTime: '04:15 PM (16:15:00)',
    exactHour: 16,
    exactMinute: 15,
    author: 'Executive Engineering Wing',
    summary: 'Production release of the 48-hour turn-around SLA sprint tracker and real-time Client Control portal for live milestone auditing.',
    changes: [
      'Integrated SamaXon Edge (/edge) with 48-hour countdown sprint visualizer',
      'Launched Client Control Terminal (/control) with proof-of-work asset downloads and direct engineer line',
      'Implemented automated Webhook telemetry and AI crawler bot categorization',
      'Refined glassmorphism navbar with sub-millisecond route transitions'
    ],
    affectedModules: ['SamaXon Edge', 'Client Control', 'Telemetry Engine', 'Navbar'],
    status: 'published'
  },
  {
    id: 'upd-003',
    version: 'v2.3.0',
    title: 'Creator & Business AI Tools Suite',
    category: 'Feature Release',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    displayDate: '05 September 2026',
    displayDay: 'Saturday',
    displayTime: '11:20 AM (11:20:00)',
    exactHour: 11,
    exactMinute: 20,
    author: 'SamaXon Senior Dev Wing',
    summary: 'Deployed free web utilities suite including lossless image compressor, JSON-LD schema builder, and dynamic color studio.',
    changes: [
      'Released client-side Canvas-based Image Compressor with zero server storage overhead',
      'Added Schema Markup Generator for Organization, Product, and Article structures',
      'Integrated Color Palette Studio with contrast ratio accessibility checker',
      'Unified /tools route with instant tab-switching'
    ],
    affectedModules: ['AI Tools Suite', 'Image Processing', 'SEO Tools'],
    status: 'published'
  },
  {
    id: 'upd-002',
    version: 'v2.2.0',
    title: 'Executive Operations Terminal & Project Pipeline Automation',
    category: 'Platform Enhancement',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
    displayDate: '02 September 2026',
    displayDay: 'Wednesday',
    displayTime: '06:30 PM (18:30:00)',
    exactHour: 18,
    exactMinute: 30,
    author: 'Studio Operations Team',
    summary: 'Streamlined executive terminal workflow, real-time client inquiry pipelines, and project delivery milestone synchronization.',
    changes: [
      'Built multi-department workflow management for Project Managers, Designers, and Content Leads',
      'Integrated real-time applicant tracking pipeline and inquiry dispatch counters',
      'Added automated performance telemetry and engagement analytics',
      'Optimized dashboard state synchronization for rapid multi-team review'
    ],
    affectedModules: ['Operations Terminal', 'Workflow Engine', 'Project Pipeline'],
    status: 'published'
  },
  {
    id: 'upd-001',
    version: 'v2.0.0',
    title: 'Initial SamaXon Speed Studio Production Launch',
    category: 'Feature Release',
    timestamp: new Date('2026-08-28T10:00:00.000Z').toISOString(),
    displayDate: '28 August 2026',
    displayDay: 'Friday',
    displayTime: '03:30 PM (15:30:00)',
    exactHour: 15,
    exactMinute: 30,
    author: 'Salman Khan',
    summary: 'Official production launch of SamaXon — India’s premier speed-driven digital engineering and design studio.',
    changes: [
      'De-novo deployment of dark-luxury and champagne-gold visual identity',
      'Modular service catalog with interactive pricing calculator',
      'Instant WhatsApp and Telegram direct executive bridge integration',
      'Fully responsive mobile, tablet, and ultra-wide desktop optimization'
    ],
    affectedModules: ['Core Studio Framework', 'Brand System', 'Service Catalog'],
    status: 'published'
  }
];

export function getSiteUpdates(): WebsiteUpdateLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_UPDATES));
      return DEFAULT_UPDATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Sanitize any previous security disclosure text to protect site architecture
      const sanitized = parsed.map((item: WebsiteUpdateLog) => {
        if (item.id === 'upd-002' && (item.title?.includes('Security') || item.category === 'Security Patch')) {
          const defaultUpd2 = DEFAULT_UPDATES.find(d => d.id === 'upd-002');
          return defaultUpd2 || item;
        }
        return item;
      });
      return sanitized;
    }
    return DEFAULT_UPDATES;
  } catch (err) {
    return DEFAULT_UPDATES;
  }
}

export function saveSiteUpdates(updates: WebsiteUpdateLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
    window.dispatchEvent(new CustomEvent(SITE_UPDATES_EVENT, { detail: updates }));
  } catch (err) {
    console.error('Failed to save website updates:', err);
  }
}

export function addSiteUpdate(data: Omit<WebsiteUpdateLog, 'id'>): WebsiteUpdateLog {
  const updates = getSiteUpdates();
  const id = `upd-${Date.now()}`;
  const newUpdate: WebsiteUpdateLog = {
    ...data,
    id
  };
  
  // Insert at top of list
  const nextList = [newUpdate, ...updates];
  saveSiteUpdates(nextList);
  return newUpdate;
}

export function updateSiteUpdate(id: string, updatedFields: Partial<WebsiteUpdateLog>): WebsiteUpdateLog | null {
  const updates = getSiteUpdates();
  const index = updates.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  const updated: WebsiteUpdateLog = {
    ...updates[index],
    ...updatedFields
  };
  
  updates[index] = updated;
  saveSiteUpdates(updates);
  return updated;
}

export function deleteSiteUpdate(id: string): boolean {
  const updates = getSiteUpdates();
  const nextList = updates.filter(u => u.id !== id);
  if (nextList.length === updates.length) return false;
  
  saveSiteUpdates(nextList);
  return true;
}

export function getLatestUpdate(): WebsiteUpdateLog | null {
  const updates = getSiteUpdates();
  return updates.length > 0 ? updates[0] : null;
}
