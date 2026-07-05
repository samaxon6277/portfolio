import { supabase } from './supabase';
import { logger } from './logger';
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
  const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://mgvnebqnzxpxjefxndpi.supabase.co';
  const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KXdb80l02Z1UKuVwlh-Ubg_63NoP7UW';
  return !!(url && key);
};

export const supabaseService = {
  // Query a team member by Auth user metadata securely
  async getTeamMemberByAuth(userId: string, email: string): Promise<{ data: DbTeamMember | null; error: any }> {
    if (!checkHasKeys()) return { data: null, error: new Error('Supabase integration is not fully configured.') };

    // 1. Primary query: by Auth user ID (matching team_members.id === auth.uid())
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        return { data: data as DbTeamMember, error: null };
      }
      if (error) {
        console.warn('Primary query raised error, continuing to fallback email check:', error);
      }
    } catch (err: any) {
      console.warn('Supabase query by ID raised error:', err);
    }

    // 2. Fallback query: lower(team_members.email) === lower(session.user.email)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .ilike('email', email.trim().toLowerCase())
        .maybeSingle();

      if (data) {
        return { data: data as DbTeamMember, error: null };
      }
    } catch (err: any) {
      console.warn('Second query fallback raised error:', err);
    }

    // 3. Absolute Fallback: check localStorage for team members
    try {
      const localAdminsStr = localStorage.getItem('samaxon_admin_users');
      if (localAdminsStr) {
        const localAdmins = JSON.parse(localAdminsStr);
        const matched = localAdmins.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (matched) {
          const dbMember: DbTeamMember = {
            id: matched.id || userId,
            full_name: matched.name,
            email: matched.email,
            role: uiRoleToDb(matched.role),
            status: matched.status.toLowerCase() === 'active' ? 'active' : 'disabled',
            created_at: matched.createdAt || new Date().toISOString()
          };
          return { data: dbMember, error: null };
        }
      }
    } catch (errLocal) {
      console.warn('Local storage member lookup raised error:', errLocal);
    }

    // 4. Global fallback for samar super admin logins
    if (email.toLowerCase() === 'samaxon6277@gmail.com' || email.toLowerCase() === 'samkhan4562@gmail.com') {
      const superAdminMember: DbTeamMember = {
        id: userId,
        full_name: 'Samar',
        email: email,
        role: 'super_admin',
        status: 'active',
        created_at: new Date().toISOString()
      };
      return { data: superAdminMember, error: null };
    }

    return { data: null, error: new Error('Team member not matched in directory.') };
  },

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
      desiredTimeline: inq.desired_timeline || 'Under 48 Hours',
      budgetRange: inq.budget_range || '₹1,00,000 - ₹2,50,000 (Elite Premium)',
      message: inq.message || '',
      status: (inq.status || 'new').toLowerCase() as any, // mapping to 'new' | 'contacted' | 'negotiating' | 'won' | 'lost'
      createdAt: inq.created_at || new Date().toISOString(),
      priority: inq.priority || 'medium',
      internalNotes: inq.notes || '',
      assignedTo: inq.assigned_to || '',
      complexity: inq.complexity || 'Standard',
      selected_addons: inq.selected_addons || [],
      estimated_min_price: inq.estimated_min_price || 0,
      estimated_max_price: inq.estimated_max_price || 0,
      user_budget_preference: inq.user_budget_preference || ''
    };
  },

  // 1. LEADS (Mapped to client_inquiries table)
  async getLeads(): Promise<Lead[]> {
    let supabaseLeads: Lead[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('client_inquiries')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        supabaseLeads = (data || []).map(this.mapInquiryToLead);
      } catch (err) {
        console.warn('Supabase fetch client_inquiries failed, falling back to local storage sync:', err);
      }
    }

    // Load local backup leads
    let localLeads: Lead[] = [];
    try {
      const stored = localStorage.getItem('samaxon_leads');
      if (stored) {
        localLeads = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local leads fallback:', errLocal);
    }

    // Merge both lists: prefer live database record for the latest info, while preserving offline edits
    const leadMap = new Map<string, Lead>();
    localLeads.forEach(lead => {
      if (lead && lead.id) {
        leadMap.set(lead.id, lead);
      }
    });
    supabaseLeads.forEach(lead => {
      if (lead && lead.id) {
        leadMap.set(lead.id, lead);
      }
    });

    const merged = Array.from(leadMap.values()).sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return merged;
  },

  async upsertLead(lead: Lead): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
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
          created_at: lead.createdAt || new Date().toISOString(),
          desired_timeline: lead.desiredTimeline || 'Under 48 Hours',
          budget_range: lead.budgetRange || '',
          complexity: lead.complexity || 'Standard',
          selected_addons: lead.selected_addons || [],
          estimated_min_price: lead.estimated_min_price || 0,
          estimated_max_price: lead.estimated_max_price || 0,
          user_budget_preference: lead.user_budget_preference || ''
        };

        const { error } = await supabase
          .from('client_inquiries')
          .upsert(inquiry);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase write client_inquiries failed:', err);
        success = false;
      }
    }

    // Always mirror to localStorage as backup/immediate update
    try {
      const stored = localStorage.getItem('samaxon_leads');
      const leadsList: Lead[] = stored ? JSON.parse(stored) : [];
      const idx = leadsList.findIndex(item => item.id === lead.id);
      if (idx >= 0) {
        leadsList[idx] = { ...leadsList[idx], ...lead };
      } else {
        leadsList.unshift(lead);
      }
      localStorage.setItem('samaxon_leads', JSON.stringify(leadsList));
      window.dispatchEvent(new Event('samaxon_leads_updated'));
    } catch (errLocal) {
      console.warn('Backup local storage lead sync failed:', errLocal);
    }

    return success;
  },

  async deleteLead(id: string): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        const { error } = await supabase
          .from('client_inquiries')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete client_inquiries failed:', err);
        success = false;
      }
    }

    // Mirror to local storage
    try {
      const stored = localStorage.getItem('samaxon_leads');
      if (stored) {
        let leadsList: Lead[] = JSON.parse(stored);
        leadsList = leadsList.filter(item => item.id !== id);
        localStorage.setItem('samaxon_leads', JSON.stringify(leadsList));
        window.dispatchEvent(new Event('samaxon_leads_updated'));
      }
    } catch (errLocal) {
      console.warn('Backup local storage delete lead failed:', errLocal);
    }

    return success;
  },

  // 2. JOB APPLICATIONS (Careers table)
  async getJobApplications(): Promise<JobApplication[]> {
    let supabaseApps: JobApplication[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        supabaseApps = (data || []) as JobApplication[];
      } catch (err) {
        console.warn('Supabase fetch job_applications failed, falling back to local cache:', err);
      }
    }

    // Load local list
    let localApps: JobApplication[] = [];
    try {
      const stored = localStorage.getItem('samaxon_career_applications');
      if (stored) {
        localApps = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local career applications:', errLocal);
    }

    const appMap = new Map<string, JobApplication>();
    localApps.forEach(app => {
      if (app && app.id) appMap.set(app.id, app);
    });
    supabaseApps.forEach(app => {
      if (app && app.id) appMap.set(app.id, app);
    });

    return Array.from(appMap.values()).sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  },

  async upsertJobApplication(app: JobApplication): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
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
      } catch (err) {
        console.error('Supabase save job_applications failed:', err);
        success = false;
      }
    }

    // Mirror to local storage
    try {
      const stored = localStorage.getItem('samaxon_career_applications');
      const appList: JobApplication[] = stored ? JSON.parse(stored) : [];
      const idx = appList.findIndex(item => item.id === app.id);
      if (idx >= 0) {
        appList[idx] = { ...appList[idx], ...app };
      } else {
        appList.unshift(app);
      }
      localStorage.setItem('samaxon_career_applications', JSON.stringify(appList));
    } catch (errLocal) {
      console.warn('Backup save job application failed:', errLocal);
    }

    return success;
  },

  async deleteJobApplication(id: string): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        const { error } = await supabase
          .from('job_applications')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete job_applications failed:', err);
        success = false;
      }
    }

    try {
      const stored = localStorage.getItem('samaxon_career_applications');
      if (stored) {
        let appList: JobApplication[] = JSON.parse(stored);
        appList = appList.filter(item => item.id !== id);
        localStorage.setItem('samaxon_career_applications', JSON.stringify(appList));
      }
    } catch (errLocal) {
      console.warn('Backup delete job application failed:', errLocal);
    }

    return success;
  },

  // 3. TEAM MEMBERS
  async getTeamMembers(): Promise<DbTeamMember[]> {
    let supabaseMembers: DbTeamMember[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        supabaseMembers = data || [];
      } catch (err) {
        console.warn('Supabase fetch team_members failed, falling back to local fallback:', err);
      }
    }

    // Local storage fetch
    let localMembers: DbTeamMember[] = [];
    try {
      const stored = localStorage.getItem('samaxon_admin_users');
      if (stored) {
        const uiMembers = JSON.parse(stored);
        localMembers = uiMembers.map((m: any) => ({
          id: m.id,
          full_name: m.name,
          email: m.email,
          role: uiRoleToDb(m.role),
          status: m.status.toLowerCase() === 'active' ? 'active' : 'disabled',
          created_at: m.createdAt,
          last_login: m.lastLogin
        }));
      }
    } catch (errLocal) {
      console.warn('Failed to parse local admin users:', errLocal);
    }

    const memberMap = new Map<string, DbTeamMember>();
    localMembers.forEach(m => {
      if (m && m.id) memberMap.set(m.id, m);
    });
    supabaseMembers.forEach(m => {
      if (m && m.id) memberMap.set(m.id, m);
    });

    return Array.from(memberMap.values()).sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  },

  async isFirstUser(): Promise<boolean> {
    if (!checkHasKeys()) return true;
    try {
      const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count === 0;
    } catch (err) {
      console.warn('Could not determine if first user via Supabase, checking local:', err);
      try {
        const stored = localStorage.getItem('samaxon_admin_users');
        if (stored) {
          const list = JSON.parse(stored);
          return list.length === 0;
        }
      } catch (e) {}
      return false;
    }
  },

  async upsertTeamMember(member: DbTeamMember): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        const { error } = await supabase
          .from('team_members')
          .upsert(member);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase save team_members failed:', err);
        success = false;
      }
    }

    // Mirror to local storage
    try {
      const stored = localStorage.getItem('samaxon_admin_users');
      const userList = stored ? JSON.parse(stored) : [];
      const uiRole = dbRoleToUi(member.role);
      const uiStatus = (member.status || '').toLowerCase() === 'active' ? 'Active' : 'Disabled';
      
      const uiMember = {
        id: member.id,
        name: member.full_name,
        email: member.email,
        role: uiRole,
        status: uiStatus,
        lastLogin: member.last_login || 'Never',
        createdAt: member.created_at || new Date().toISOString()
      };

      const idx = userList.findIndex((item: any) => item.id === member.id);
      if (idx >= 0) {
        userList[idx] = { ...userList[idx], ...uiMember };
      } else {
        userList.unshift(uiMember);
      }
      localStorage.setItem('samaxon_admin_users', JSON.stringify(userList));
    } catch (errLocal) {
      console.warn('Backup save admin user failed:', errLocal);
    }

    return success;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete team_members failed:', err);
        success = false;
      }
    }

    try {
      const stored = localStorage.getItem('samaxon_admin_users');
      if (stored) {
        let userList = JSON.parse(stored);
        userList = userList.filter((item: any) => item.id !== id);
        localStorage.setItem('samaxon_admin_users', JSON.stringify(userList));
      }
    } catch (errLocal) {
      console.warn('Backup delete admin user failed:', errLocal);
    }

    return success;
  },

  // 4. PORTFOLIO PROJECTS
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    let supabaseProjs: PortfolioProject[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('samaxon_portfolio_projects')
          .select('*');
        if (error) throw error;
        supabaseProjs = (data || []) as PortfolioProject[];
      } catch (err) {
        console.warn('Supabase fetch projects failed:', err);
      }
    }

    // Local
    let localProjs: PortfolioProject[] = [];
    try {
      const stored = localStorage.getItem('samaxon_portfolio_projects');
      if (stored) {
        localProjs = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local projects:', errLocal);
    }

    const projMap = new Map<string, PortfolioProject>();
    localProjs.forEach(p => {
      if (p && p.id) projMap.set(p.id, p);
    });
    supabaseProjs.forEach(p => {
      if (p && p.id) projMap.set(p.id, p);
    });

    return Array.from(projMap.values());
  },

  async upsertPortfolioProjects(projects: PortfolioProject[]): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        for (const proj of projects) {
          await supabase
            .from('samaxon_portfolio_projects')
            .upsert(proj);
        }
      } catch (err) {
        console.error('Supabase sync portfolio projects failed:', err);
        success = false;
      }
    }

    // Mirror to local storage
    try {
      localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(projects));
    } catch (errLocal) {
      console.warn('Backup sync portfolio failed:', errLocal);
    }
    return success;
  },

  async deletePortfolioProject(id: string): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        const { error } = await supabase
          .from('samaxon_portfolio_projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete project failed:', err);
        success = false;
      }
    }

    try {
      const stored = localStorage.getItem('samaxon_portfolio_projects');
      if (stored) {
        let projsList: PortfolioProject[] = JSON.parse(stored);
        projsList = projsList.filter(item => item.id !== id);
        localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(projsList));
      }
    } catch (errLocal) {
      console.warn('Backup delete project failed:', errLocal);
    }
    return success;
  },

  // 5. SERVICES
  async getServices(): Promise<Service[]> {
    let supabaseServices: Service[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('samaxon_services')
          .select('*');
        if (error) throw error;
        supabaseServices = (data || []) as Service[];
      } catch (err) {
        console.warn('Supabase fetch services failed:', err);
      }
    }

    // Local
    let localServices: Service[] = [];
    try {
      const stored = localStorage.getItem('samaxon_services');
      if (stored) {
        localServices = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local services:', errLocal);
    }

    const serviceMap = new Map<string, Service>();
    localServices.forEach(s => {
      if (s && s.id) serviceMap.set(s.id, s);
    });
    supabaseServices.forEach(s => {
      if (s && s.id) serviceMap.set(s.id, s);
    });

    return Array.from(serviceMap.values());
  },

  async upsertServices(services: Service[]): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        for (const srv of services) {
          await supabase
            .from('samaxon_services')
            .upsert(srv);
        }
      } catch (err) {
        console.error('Supabase sync services failed:', err);
        success = false;
      }
    }

    // Mirror to local storage
    try {
      localStorage.setItem('samaxon_services', JSON.stringify(services));
    } catch (errLocal) {
      console.warn('Backup sync services failed:', errLocal);
    }
    return success;
  },

  // 6. TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    let supabaseTestimonials: Testimonial[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('samaxon_testimonials')
          .select('*');
        if (error) throw error;
        supabaseTestimonials = (data || []) as Testimonial[];
      } catch (err) {
        console.warn('Supabase fetch testimonials failed:', err);
      }
    }

    // Local
    let localTestimonials: Testimonial[] = [];
    try {
      const stored = localStorage.getItem('samaxon_testimonials');
      if (stored) {
        localTestimonials = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local testimonials:', errLocal);
    }

    const testMap = new Map<string, Testimonial>();
    localTestimonials.forEach(t => {
      if (t && t.id) testMap.set(t.id, t);
    });
    supabaseTestimonials.forEach(t => {
      if (t && t.id) testMap.set(t.id, t);
    });

    return Array.from(testMap.values());
  },

  async upsertTestimonials(testimonials: Testimonial[]): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        for (const test of testimonials) {
          await supabase
            .from('samaxon_testimonials')
            .upsert(test);
        }
      } catch (err) {
        console.error('Supabase sync testimonials failed:', err);
        success = false;
      }
    }

    // Mirror to local
    try {
      localStorage.setItem('samaxon_testimonials', JSON.stringify(testimonials));
    } catch (errLocal) {
      console.warn('Backup sync testimonials failed:', errLocal);
    }
    return success;
  },

  // 7. BLOG POSTS
  async getBlogs(): Promise<BlogPost[]> {
    let supabaseBlogs: BlogPost[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('samaxon_blogs')
          .select('*');
        if (error) throw error;
        supabaseBlogs = (data || []) as BlogPost[];
      } catch (err) {
        console.warn('Supabase fetch blogs failed:', err);
      }
    }

    // Local
    let localBlogs: BlogPost[] = [];
    try {
      const stored = localStorage.getItem('samaxon_blogs');
      if (stored) {
        localBlogs = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local blogs:', errLocal);
    }

    const blogMap = new Map<string, BlogPost>();
    localBlogs.forEach(b => {
      if (b && b.id) blogMap.set(b.id, b);
    });
    supabaseBlogs.forEach(b => {
      if (b && b.id) blogMap.set(b.id, b);
    });

    return Array.from(blogMap.values());
  },

  async upsertBlogs(blogs: BlogPost[]): Promise<boolean> {
    let success = true;
    if (checkHasKeys()) {
      try {
        for (const blog of blogs) {
          await supabase
            .from('samaxon_blogs')
            .upsert(blog);
        }
      } catch (err) {
        console.error('Supabase sync blogs failed:', err);
        success = false;
      }
    }

    // Mirror to local storage
    try {
      localStorage.setItem('samaxon_blogs', JSON.stringify(blogs));
    } catch (errLocal) {
      console.warn('Backup sync blogs failed:', errLocal);
    }
    return success;
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
    const ua = navigator.userAgent || '';
    const isBot = /Googlebot|Bingbot|AhrefsBot|SemrushBot|FacebookExternalHit|Twitterbot|WhatsApp|GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|Google-Extended|PerplexityBot/i.test(ua);

    if (checkHasKeys()) {
      try {
        if (isBot) {
          const botName = ua.match(/(Googlebot|Bingbot|AhrefsBot|SemrushBot|FacebookExternalHit|Twitterbot|WhatsApp|GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|Google-Extended|PerplexityBot)/i)?.[0] || 'Unknown Bot';
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

        let browser = 'Other';
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Edge')) browser = 'Edge';

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
            country: 'India',
            city: 'Mumbai',
            metadata: metadata,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Telemetry event database insertion failed:', err);
      }
    }

    // Local mirror of activity log / site event
    try {
      const storedStr = localStorage.getItem('samaxon_activity_logs');
      const logs = storedStr ? JSON.parse(storedStr) : [];
      const newLog = {
        id: `act-${Date.now()}`,
        adminUserName: metadata?.name || metadata?.email || 'Visitor Address',
        adminUserRole: metadata?.role || 'Guest',
        actionType: eventType.toUpperCase(),
        entityType: metadata?.page || 'Site Routing',
        entityId: `eve-${Date.now()}`,
        description: `Triggered event: "${eventType}" from browser. Path: ${window.location.hash || window.location.pathname}`,
        createdAt: new Date().toISOString()
      };
      logs.unshift(newLog);
      localStorage.setItem('samaxon_activity_logs', JSON.stringify(logs));
    } catch (errLocal) {
      console.warn('Backup local storage activity log failed:', errLocal);
    }
  },

  async fetchSiteEvents(): Promise<any[]> {
    let supabaseEvents: any[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('site_events')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        supabaseEvents = data || [];
      } catch (err) {
        console.warn('Failed site_events fetch:', err);
      }
    }

    // Merge with local storage 'samaxon_activity_logs'
    let localEvents: any[] = [];
    try {
      const stored = localStorage.getItem('samaxon_activity_logs');
      if (stored) {
        localEvents = JSON.parse(stored);
      }
    } catch (errLocal) {
      console.warn('Failed to parse local activity logs:', errLocal);
    }

    const eventMap = new Map<string, any>();
    // Seed with local state structure
    localEvents.forEach(e => {
      if (e && e.id) {
        const mappedFromLocal = {
          id: e.id,
          event_type: e.actionType || 'EVENT',
          page_url: window.location.href,
          referrer: 'Direct',
          browser: 'Chrome',
          device_type: 'Desktop',
          created_at: e.createdAt || e.timestamp,
          metadata: {
            name: e.adminUserName,
            role: e.adminUserRole,
            page: e.entityType,
            description: e.description
          }
        };
        eventMap.set(e.id, mappedFromLocal);
      }
    });

    // Seed/Overwrite with Supabase events
    supabaseEvents.forEach(e => {
      if (e && e.id) {
        eventMap.set(e.id, e);
      }
    });

    return Array.from(eventMap.values()).sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  },

  async fetchCrawlerLogs(): Promise<any[]> {
    let supabaseCrawlers: any[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('crawler_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        supabaseCrawlers = data || [];
      } catch (err) {
        console.warn('Failed crawler_logs fetch:', err);
      }
    }
    return supabaseCrawlers;
  },

  async fetchWebhookLogs(): Promise<any[]> {
    let supabaseWebhooks: any[] = [];
    if (checkHasKeys()) {
      try {
        const { data, error } = await supabase
          .from('webhook_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        supabaseWebhooks = data || [];
      } catch (err) {
        console.warn('Failed webhook_logs fetch:', err);
      }
    }
    return supabaseWebhooks;
  },

  async trackWebhookLog(type: string, status: string, errorMsg?: string, payload: any = {}) {
    if (checkHasKeys()) {
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

    // Local mirror
    try {
      const storedStr = localStorage.getItem('samaxon_automation_logs');
      const logs = storedStr ? JSON.parse(storedStr) : [];
      const newLog = {
        id: `auto-${Date.now()}`,
        automationType: type,
        triggerEvent: `Webhook trigger: ${type}`,
        status: status === 'success' ? 'Success' : 'Failed',
        payloadSummary: JSON.stringify(payload),
        errorMessage: errorMsg || '',
        createdAt: new Date().toISOString()
      };
      logs.unshift(newLog);
      localStorage.setItem('samaxon_automation_logs', JSON.stringify(logs));
    } catch (err) {
      console.warn('Offline webhook log insertion failed:', err);
    }
  }
};
