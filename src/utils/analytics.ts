// SamaXon Premium Real-Time Analytics Tracker
// Captures authentic visitor telemetry and click states. Tied directly to Database states.
import { supabaseService } from './supabaseService';

export interface AnalyticsData {
  pageViews: number;
  formStarts: number;
  formSubmits: number;
  whatsappClickouts: number;
  callClicks: number;
  chartData: number[]; // Last 7 days human traffic
  chartBots: number[]; // Last 7 days bot traffic
}

const ANALYTICS_KEY = 'samaxon_realtime_analytics_v1';

export const analytics = {
  // Save/load local cache as fallback only
  getStats(): AnalyticsData {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const emptyStats: AnalyticsData = {
      pageViews: 0,
      formStarts: 0,
      formSubmits: 0,
      whatsappClickouts: 0,
      callClicks: 0,
      chartData: [0, 0, 0, 0, 0, 0, 0],
      chartBots: [0, 0, 0, 0, 0, 0, 0]
    };
    if (!raw) return emptyStats;
    try {
      return JSON.parse(raw);
    } catch {
      return emptyStats;
    }
  },

  saveStats(data: AnalyticsData) {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  },

  // Record a real-time page view
  async trackPageView(pageName: string) {
    await supabaseService.trackSiteEvent('page_view', { page: pageName });
    const stats = this.getStats();
    stats.pageViews += 1;
    stats.chartData[6] = (stats.chartData[6] || 0) + 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Record a form interaction start
  async trackFormStart() {
    await supabaseService.trackSiteEvent('contact_form_start');
    const stats = this.getStats();
    stats.formStarts += 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Record career form interaction start
  async trackCareerFormStart() {
    await supabaseService.trackSiteEvent('career_form_start');
    const stats = this.getStats();
    stats.formStarts += 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Record successful submission
  async trackFormSubmit() {
    await supabaseService.trackSiteEvent('contact_form_submit');
    const stats = this.getStats();
    stats.formSubmits += 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Same for careers
  async trackCareerFormSubmit() {
    await supabaseService.trackSiteEvent('career_form_submit');
    const stats = this.getStats();
    stats.formSubmits += 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Record WhatsApp bypass click
  async trackWhatsAppClick() {
    await supabaseService.trackSiteEvent('whatsapp_click');
    const stats = this.getStats();
    stats.whatsappClickouts += 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Record Call click
  async trackCallClick() {
    await supabaseService.trackSiteEvent('call_button_click');
    const stats = this.getStats();
    stats.callClicks = (stats.callClicks || 0) + 1;
    this.saveStats(stats);
    window.dispatchEvent(new Event('samaxon_analytics_updated'));
  },

  // Portfolio click
  async trackPortfolioClick(projectId: string) {
    await supabaseService.trackSiteEvent('portfolio_click', { projectId });
  },

  // Service page view
  async trackServicePageView(serviceId: string) {
    await supabaseService.trackSiteEvent('service_page_view', { serviceId });
  },

  // Admin logs
  async trackAdminLogin(email: string) {
    await supabaseService.trackSiteEvent('admin_login', { email });
  },

  async trackAdminLogout() {
    await supabaseService.trackSiteEvent('admin_logout');
  },

  // Dynamically compile active database analytics.
  // Calculates real counts and 7-day curves from actual database rows.
  computeStatsFromDatabase(siteEvents: any[], crawlerLogs: any[], leadsCount: number, careersCount: number): AnalyticsData {
    // Counts
    const pageViews = siteEvents.filter(e => e.event_type === 'page_view').length;
    const formStarts = siteEvents.filter(e => e.event_type === 'contact_form_start' || e.event_type === 'career_form_start').length;
    
    // Form submits: use the maximum of recorded events or actual database leads count to represent data safely
    const formSubmits = leadsCount + careersCount;

    const whatsappClickouts = siteEvents.filter(e => e.event_type === 'whatsapp_click').length;
    const callClicks = siteEvents.filter(e => e.event_type === 'call_button_click').length;

    // Daily Curves (7 Days back)
    const chartData = [0, 0, 0, 0, 0, 0, 0];
    const chartBots = [0, 0, 0, 0, 0, 0, 0];

    // Generate timestamps for past 7 days
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(now.getTime() - (6 - i) * dayMs);
      const targetDateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

      // Human Views for this day
      const dayHumans = siteEvents.filter(e => {
        const dStr = e.created_at || e.createdAt;
        if (!dStr) return false;
        const parsedDate = new Date(dStr);
        if (isNaN(parsedDate.getTime())) return false;
        const dateStr = parsedDate.toISOString().split('T')[0];
        return dateStr === targetDateString && e.event_type === 'page_view';
      });
      chartData[i] = dayHumans.length;

      // Bot views for this day
      const dayBots = crawlerLogs.filter(b => {
        const dStr = b.created_at || b.createdAt;
        if (!dStr) return false;
        const parsedDate = new Date(dStr);
        if (isNaN(parsedDate.getTime())) return false;
        const dateStr = parsedDate.toISOString().split('T')[0];
        return dateStr === targetDateString;
      });
      chartBots[i] = dayBots.length;
    }

    const calculated: AnalyticsData = {
      pageViews,
      formStarts,
      formSubmits,
      whatsappClickouts,
      callClicks,
      chartData,
      chartBots
    };

    // Keep stats synchronized locally for lightweight triggers
    this.saveStats(calculated);

    return calculated;
  },

  syncWithDatabase(dbLeadsCount: number, dbJobAppsCount: number) {
    // Retain signature interface, calculations migrated to computeStatsFromDatabase for 100% database reliance
  }
};
