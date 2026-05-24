import { supabase } from './supabase';
import { Lead, JobApplication, Service, PortfolioProject, Testimonial, BlogPost, MediaAsset } from '../types';

// Role mappings
export type AdminRole = 'Super Admin' | 'Admin' | 'Content Editor' | 'Sales Manager' | 'Career Manager' | 'Viewer';

export interface DbTeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string; // db style: super_admin, etc.
  status: string; // db style: active, disabled
  created_at: string;
  last_login?: string | null;
  created_by?: string | null;
}

export function dbRoleToUi(dbRole: string): AdminRole {
  const norm = (dbRole || '').toLowerCase().trim();
  if (norm === 'super_admin' || norm === 'super admin') return 'Super Admin';
  if (norm === 'admin') return 'Admin';
  if (norm === 'content_editor' || norm === 'content editor') return 'Content Editor';
  if (norm === 'sales_manager' || norm === 'sales manager') return 'Sales Manager';
  if (norm === 'career_manager' || norm === 'career manager') return 'Career Manager';
  return 'Viewer';
}

export function uiRoleToDb(uiRole: AdminRole) {
  switch (uiRole) {
    case 'Super Admin': return 'super_admin';
    case 'Admin': return 'admin';
    case 'Content Editor': return 'content_editor';
    case 'Sales Manager': return 'sales_manager';
    case 'Career Manager': return 'career_manager';
    default: return 'viewer';
  }
}

const checkHasKeys = () => {
  const env = (import.meta as any).env || {};
  const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key);
};

export const supabaseService = {
  // Helpers to map client inquiries to UI Leads
  mapInquiryToLead(inq: any): Lead {
    return {
      id: inq.id,
      name: inq.full_name || '',
      businessName: inq.business_name || '',
      phone: inq.phone || inq.whatsapp || '',
      email: inq.email || '',
      city: inq.city || '',
      serviceNeeded: inq.service_required || 'Web Development',
      currentProblem: inq.message || '',
      desiredTimeline: 'Under 48 Hours',
      budgetRange: '₹1,00,000 - ₹2,50,000 (Elite Premium)',
      message: inq.message || '',
      status: (inq.status || 'new').toLowerCase() as any, // mapping to 'new' | 'contacted' | 'negotiating' | 'won' | 'lost'
      createdAt: inq.created_at || new Date().toISOString(),
      priority: inq.priority || 'medium',
      internalNotes: inq.notes || '',
      assignedTo: inq.assigned_to || ''
    } as any;
  },

  // 1. LEADS (Mapped to client_inquiries table)
  async getLeads(): Promise<Lead[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('client_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return (data || []).map(this.mapInquiryToLead);
    } catch (err) {
      console.warn('Supabase fetch client_inquiries failed:', err);
    }
    return [];
  },

  async upsertLead(lead: Lead): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const inquiry = {
        id: lead.id,
        full_name: lead.name,
        business_name: lead.businessName,
        phone: lead.phone,
        whatsapp: lead.phone,
        email: lead.email,
        service_required: lead.serviceNeeded,
        city: lead.city,
        message: lead.message || lead.currentProblem || '',
        status: lead.status || 'new',
        priority: (lead as any).priority || 'medium',
        notes: (lead as any).internalNotes || '',
        assigned_to: (lead as any).assignedTo || '',
        created_at: lead.createdAt || new Date().toISOString()
      };

      const { error } = await supabase
        .from('client_inquiries')
        .upsert(inquiry);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase write client_inquiries failed:', err);
      return false;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('client_inquiries')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete client_inquiries failed:', err);
      return false;
    }
  },

  // 2. JOB APPLICATIONS (Careers table)
  async getJobApplications(): Promise<JobApplication[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return (data || []) as JobApplication[];
    } catch (err) {
      console.warn('Supabase fetch job_applications failed:', err);
    }
    return [];
  },

  async upsertJobApplication(app: JobApplication): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('job_applications')
        .upsert({
          id: app.id,
          full_name: app.full_name,
          gender: app.gender,
          age: app.age,
          city: app.city,
          phone: app.phone,
          whatsapp: app.whatsapp,
          email: app.email,
          education: app.education,
          experience: app.experience,
          languages: app.languages,
          position: app.position,
          expected_salary: app.expected_salary,
          why_hire: app.why_hire,
          voice_sample_link: app.voice_sample_link || '',
          resume_url: app.resume_url || '',
          status: app.status || 'New',
          created_at: app.created_at || new Date().toISOString()
        });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase save job_applications failed:', err);
      return false;
    }
  },

  async deleteJobApplication(id: string): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete job_applications failed:', err);
      return false;
    }
  },

  // 3. TEAM MEMBERS
  async getTeamMembers(): Promise<DbTeamMember[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase fetch team_members failed:', err);
    }
    return [];
  },

  async isFirstUser(): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { data, error, count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count === 0;
    } catch (err) {
      console.warn('Could not determine if first user:', err);
      return false;
    }
  },

  async upsertTeamMember(member: DbTeamMember): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('team_members')
        .upsert(member);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase save team_members failed:', err);
      return false;
    }
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete team_members failed:', err);
      return false;
    }
  },

  // 4. PORTFOLIO PROJECTS
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('samaxon_portfolio_projects')
        .select('*');
      if (error) throw error;
      return (data || []) as PortfolioProject[];
    } catch (err) {
      console.warn('Supabase fetch projects failed:', err);
    }
    return [];
  },

  async upsertPortfolioProjects(projects: PortfolioProject[]): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      for (const proj of projects) {
        await supabase
          .from('samaxon_portfolio_projects')
          .upsert(proj);
      }
      return true;
    } catch (err) {
      console.error('Supabase sync portfolio projects failed:', err);
      return false;
    }
  },

  async deletePortfolioProject(id: string): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('samaxon_portfolio_projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete project failed:', err);
      return false;
    }
  },

  // 5. SERVICES
  async getServices(): Promise<Service[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('samaxon_services')
        .select('*');
      if (error) throw error;
      return (data || []) as Service[];
    } catch (err) {
      console.warn('Supabase fetch services failed:', err);
    }
    return [];
  },

  async upsertServices(services: Service[]): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      for (const srv of services) {
        await supabase
          .from('samaxon_services')
          .upsert(srv);
      }
      return true;
    } catch (err) {
      console.error('Supabase sync services failed:', err);
      return false;
    }
  },

  // 6. TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('samaxon_testimonials')
        .select('*');
      if (error) throw error;
      return (data || []) as Testimonial[];
    } catch (err) {
      console.warn('Supabase fetch testimonials failed:', err);
    }
    return [];
  },

  async upsertTestimonials(testimonials: Testimonial[]): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      for (const test of testimonials) {
        await supabase
          .from('samaxon_testimonials')
          .upsert(test);
      }
      return true;
    } catch (err) {
      console.error('Supabase sync testimonials failed:', err);
      return false;
    }
  },

  // 7. BLOG POSTS
  async getBlogs(): Promise<BlogPost[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('samaxon_blogs')
        .select('*');
      if (error) throw error;
      return (data || []) as BlogPost[];
    } catch (err) {
      console.warn('Supabase fetch blogs failed:', err);
    }
    return [];
  },

  async upsertBlogs(blogs: BlogPost[]): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      for (const blog of blogs) {
        await supabase
          .from('samaxon_blogs')
          .upsert(blog);
      }
      return true;
    } catch (err) {
      console.error('Supabase sync blogs failed:', err);
      return false;
    }
  },

  // 8. STORAGE PDF RESUME UPLOADER
  async uploadResumePDF(file: File): Promise<string> {
    if (!checkHasKeys()) {
      return `https://samaxon.site/resumes/${Date.now()}-${file.name}`;
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('job-resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.warn('Upload to job-resumes failed, trying fallback samaxon-media:', uploadError);
        const fallbackUpload = await supabase.storage
          .from('samaxon-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        if (fallbackUpload.error) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('samaxon-media')
          .getPublicUrl(filePath);
        return publicUrl;
      }
      
      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('job-resumes')
          .getPublicUrl(filePath);
        return publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, using simulated URL:', err);
    }
    return `https://samaxon.site/resumes/${Date.now()}-${file.name}`;
  },

  // 9. EVENT TRACKING & CRAWLERS LOGS
  async trackSiteEvent(eventType: string, metadata: any = {}) {
    if (!checkHasKeys()) return;
    try {
      const ua = navigator.userAgent || '';
      
      // Known bots
      const isBot = /Googlebot|Bingbot|AhrefsBot|SemrushBot|FacebookExternalHit|Twitterbot|WhatsApp/i.test(ua);
      
      if (isBot) {
        // Log crawler
        const botName = ua.match(/(Googlebot|Bingbot|AhrefsBot|SemrushBot|FacebookExternalHit|Twitterbot|WhatsApp)/i)?.[0] || 'Unknown Bot';
        await supabase
          .from('crawler_logs')
          .insert({
            id: `crawl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            bot_name: botName,
            user_agent: ua,
            page_url: window.location.href,
            ip_hash: `hash-${(botName + Date.now()).substring(0, 10)}`,
            created_at: new Date().toISOString()
          });
        return;
      }

      // Detect Browser
      let browser = 'Other';
      if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Safari')) browser = 'Safari';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edge')) browser = 'Edge';

      // Detect Device
      let deviceType = 'Desktop';
      if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';
      else if (/Mobi|Android|iPhone/i.test(ua)) deviceType = 'Mobile';

      await supabase
        .from('site_events')
        .insert({
          id: `eve-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          event_type: eventType,
          page_url: window.location.href,
          referrer: document.referrer || 'Direct',
          user_agent: ua,
          device_type: deviceType,
          browser: browser,
          country: 'India', // Local Default since container is sandboxed, optionally fetched or fallback
          city: 'Mumbai',
          metadata: metadata,
          created_at: new Date().toISOString()
        });
    } catch (err) {
      // Slant warning rather than crashing
      console.warn('Telemetry event writing failed:', err);
    }
  },

  async fetchSiteEvents(): Promise<any[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('site_events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Failed site_events fetch:', err);
      return [];
    }
  },

  async fetchCrawlerLogs(): Promise<any[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('crawler_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Failed crawler_logs fetch:', err);
      return [];
    }
  },

  async fetchWebhookLogs(): Promise<any[]> {
    if (!checkHasKeys()) return [];
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Failed webhook_logs fetch:', err);
      return [];
    }
  },

  async trackWebhookLog(type: string, status: string, errorMsg?: string, payload: any = {}) {
    if (!checkHasKeys()) return;
    try {
      await supabase
        .from('webhook_logs')
        .insert({
          id: `web-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          webhook_type: type,
          payload: payload,
          status: status,
          error_message: errorMsg || '',
          created_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('Telemetry webhook writing failed:', err);
    }
  }
};
