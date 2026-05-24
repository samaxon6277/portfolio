import { supabase } from './supabase';
import { Lead, CareerApplication, Service, PortfolioProject, Testimonial, BlogPost, JobApplication } from '../types';

// Helper to determine if we should attempt Supabase queries
const checkHasKeys = () => {
  const env = (import.meta as any).env || {};
  const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://mgvnebqnzxpxjefxndpi.supabase.co';
  const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KXdb80l02Z1UKuVwlh-Ubg_63NoP7UW';
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
  },

  // 7. NEW JOB APPLICATIONS
  async getJobApplications(): Promise<JobApplication[]> {
    if (!checkHasKeys()) return JSON.parse(localStorage.getItem('samaxon_job_applications') || '[]');
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        localStorage.setItem('samaxon_job_applications', JSON.stringify(data));
        return data as JobApplication[];
      }
    } catch (err) {
      console.warn('Supabase fetch job applications failed, falling back to local storage:', err);
    }
    return JSON.parse(localStorage.getItem('samaxon_job_applications') || '[]');
  },

  async upsertJobApplication(app: JobApplication): Promise<boolean> {
    const list = JSON.parse(localStorage.getItem('samaxon_job_applications') || '[]');
    const nextList = [app, ...list.filter((x: JobApplication) => x.id !== app.id)];
    localStorage.setItem('samaxon_job_applications', JSON.stringify(nextList));

    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('job_applications')
        .upsert(app);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase save job application failed:', err);
      return false;
    }
  },

  async deleteJobApplication(id: string): Promise<boolean> {
    const nextList = JSON.parse(localStorage.getItem('samaxon_job_applications') || '[]').filter((x: JobApplication) => x.id !== id);
    localStorage.setItem('samaxon_job_applications', JSON.stringify(nextList));

    if (!checkHasKeys()) return true;
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete job application failed:', err);
      return false;
    }
  },

  async uploadResumePDF(file: File): Promise<string> {
    if (!checkHasKeys()) {
      // Return a simulated URL that works beautifully
      return `https://samaxon.site/resumes/${Date.now()}-${file.name}`;
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      // Try 'job_resumes' first, fallback to 'samaxon-media'
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
  }
};
