import { supabase } from './supabase';
import { Lead, CareerApplication, Service, PortfolioProject, Testimonial, BlogPost } from '../types';

// Helper to determine if we should attempt Supabase queries
const checkHasKeys = () => {
  const url = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL;
  const key = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key);
};

export const supabaseService = {
  // 1. LEADS
  async getLeads(): Promise<Lead[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_leads') || '[]');
    try {
      const { data, error } = await supabase
        .from('samaxon_leads')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('samaxon_leads', JSON.stringify(data));
        return data as Lead[];
      }
    } catch (err) {
      console.warn('Supabase fetch leads failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_leads') || '[]');
  },

  async upsertLead(lead: Lead): Promise<boolean> {
    localStorage.setItem('samaxon_leads', JSON.stringify([
      lead,
      ...JSON.parse(localStorage.getItem('samaxon_leads') || '[]').filter((l: Lead) => l.id !== lead.id)
    ]));
    
    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('samaxon_leads')
        .upsert(lead);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase save lead failed:', err);
      return false;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    const nextList = JSON.parse(localStorage.getItem('samaxon_leads') || '[]').filter((l: Lead) => l.id !== id);
    localStorage.setItem('samaxon_leads', JSON.stringify(nextList));

    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('samaxon_leads')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete lead failed:', err);
      return false;
    }
  },

  // 2. CAREER APPLICATIONS
  async getCareers(): Promise<CareerApplication[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_career_applications') || '[]');
    try {
      const { data, error } = await supabase
        .from('samaxon_career_applications')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('samaxon_career_applications', JSON.stringify(data));
        return data as CareerApplication[];
      }
    } catch (err) {
      console.warn('Supabase fetch careers failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_career_applications') || '[]');
  },

  async upsertCareer(app: CareerApplication): Promise<boolean> {
    localStorage.setItem('samaxon_career_applications', JSON.stringify([
      app,
      ...JSON.parse(localStorage.getItem('samaxon_career_applications') || '[]').filter((c: CareerApplication) => c.id !== app.id)
    ]));

    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('samaxon_career_applications')
        .upsert(app);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase save career app failed:', err);
      return false;
    }
  },

  async deleteCareer(id: string): Promise<boolean> {
    const nextList = JSON.parse(localStorage.getItem('samaxon_career_applications') || '[]').filter((c: CareerApplication) => c.id !== id);
    localStorage.setItem('samaxon_career_applications', JSON.stringify(nextList));

    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('samaxon_career_applications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete career application failed:', err);
      return false;
    }
  },

  // 3. PORTFOLIO PROJECTS
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_portfolio_projects') || '[]');
    try {
      const { data, error } = await supabase
        .from('samaxon_portfolio_projects')
        .select('*');
        
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(data));
        return data as PortfolioProject[];
      }
    } catch (err) {
      console.warn('Supabase fetch projects failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_portfolio_projects') || '[]');
  },

  async upsertPortfolioProjects(projects: PortfolioProject[]): Promise<boolean> {
    localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(projects));

    if (!checkHasKeys()) return true;
    try {
      // Upsert full array or individual elements
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
    const nextList = JSON.parse(localStorage.getItem('samaxon_portfolio_projects') || '[]').filter((p: PortfolioProject) => p.id !== id);
    localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(nextList));

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

  // 4. SERVICES
  async getServices(): Promise<Service[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_services') || '[]');
    try {
      const { data, error } = await supabase
        .from('samaxon_services')
        .select('*');
        
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('samaxon_services', JSON.stringify(data));
        return data as Service[];
      }
    } catch (err) {
      console.warn('Supabase fetch services failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_services') || '[]');
  },

  async upsertServices(services: Service[]): Promise<boolean> {
    localStorage.setItem('samaxon_services', JSON.stringify(services));

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

  // 5. TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_testimonials') || '[]');
    try {
      const { data, error } = await supabase
        .from('samaxon_testimonials')
        .select('*');
        
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('samaxon_testimonials', JSON.stringify(data));
        return data as Testimonial[];
      }
    } catch (err) {
      console.warn('Supabase fetch testimonials failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_testimonials') || '[]');
  },

  async upsertTestimonials(testimonials: Testimonial[]): Promise<boolean> {
    localStorage.setItem('samaxon_testimonials', JSON.stringify(testimonials));

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

  // 6. BLOG POSTS
  async getBlogs(): Promise<BlogPost[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_blogs') || '[]');
    try {
      const { data, error } = await supabase
        .from('samaxon_blogs')
        .select('*');
        
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('samaxon_blogs', JSON.stringify(data));
        return data as BlogPost[];
      }
    } catch (err) {
      console.warn('Supabase fetch blogs failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_blogs') || '[]');
  },

  async upsertBlogs(blogs: BlogPost[]): Promise<boolean> {
    localStorage.setItem('samaxon_blogs', JSON.stringify(blogs));

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
  }
};
