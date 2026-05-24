import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Bot, LayoutDashboard, FileSpreadsheet, Briefcase, Settings, LogOut, Lock, Mail, Shield, CheckCircle, Home
} from 'lucide-react';

import { Lead, CareerApplication, Service, PortfolioProject, Testimonial, BlogPost, MediaAsset, JobApplication } from '../types';
import { 
  AdminUser, BotVisit, AutomationLog, ActivityLog, PageSectionContent, WebsiteSettings, 
  initializeDatabase, logActivity 
} from '../utils/mockAdminData';
import { supabaseService } from '../utils/supabaseService';

// Tab components imports
import DashboardTab from './admin/DashboardTab';
import LeadsTab from './admin/LeadsTab';
import CareersTab from './admin/CareersTab';
import ContentSettingsTab from './admin/ContentSettingsTab';
import SystemSettingsTab from './admin/SystemSettingsTab';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Core administrative state datasets
  const [leads, setLeads] = useState<Lead[]>([]);
  const [careers, setCareers] = useState<CareerApplication[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pageSections, setPageSections] = useState<PageSectionContent[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [legalPages, setLegalPages] = useState<any>({});
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [botVisits, setBotVisits] = useState<BotVisit[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<any>({});

  // 1. Mount initial states
  useEffect(() => {
    // Standard initialization check
    initializeDatabase();

    // Async sync with Supabase and handle fallbacks
    const syncWithSupabase = async () => {
      try {
        const dynamicProjects = await supabaseService.getPortfolioProjects();
        setPortfolioProjects(dynamicProjects);

        const dynamicServices = await supabaseService.getServices();
        setServices(dynamicServices);

        const dynamicLeads = await supabaseService.getLeads();
        setLeads(dynamicLeads);

        const dynamicCareers = await supabaseService.getCareers();
        setCareers(dynamicCareers);

        const dynamicJobApps = await supabaseService.getJobApplications();
        setJobApplications(dynamicJobApps);

        const dynamicTestimonials = await supabaseService.getTestimonials();
        setTestimonials(dynamicTestimonials);

        const dynamicBlogs = await supabaseService.getBlogs();
        setBlogs(dynamicBlogs);
      } catch (err) {
        console.warn('Initial Supabase fetch failed, relying on localStorage cached sync:', err);
      }
    };

    syncWithSupabase();

    // Load static logs, media, settings etc. from localStorage as before
    setPageSections(JSON.parse(localStorage.getItem('samaxon_page_sections') || '[]'));
    setLegalPages(JSON.parse(localStorage.getItem('samaxon_legal_pages') || '{}'));
    setMediaAssets(JSON.parse(localStorage.getItem('samaxon_media') || '[]'));
    setBotVisits(JSON.parse(localStorage.getItem('samaxon_bot_visits') || '[]'));
    setAutomationLogs(JSON.parse(localStorage.getItem('samaxon_automation_logs') || '[]'));
    setActivityLogs(JSON.parse(localStorage.getItem('samaxon_activity_logs') || '[]'));
    setAdminUsers(JSON.parse(localStorage.getItem('samaxon_admin_users') || '[]'));
    setWebsiteSettings(JSON.parse(localStorage.getItem('samaxon_website_settings') || '{}'));

    // Check pre-existing session
    const prevSession = sessionStorage.getItem('samaxon_admin_authorized');
    if (prevSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Persistent State Writers
  const updateLeadsState = (nextLeads: Lead[]) => {
    setLeads(nextLeads);
    localStorage.setItem('samaxon_leads', JSON.stringify(nextLeads));
  };

  const updateCareersState = (nextCareers: CareerApplication[]) => {
    setCareers(nextCareers);
    localStorage.setItem('samaxon_career_applications', JSON.stringify(nextCareers));
  };

  const updateJobApplicationsState = (nextApps: JobApplication[]) => {
    setJobApplications(nextApps);
    localStorage.setItem('samaxon_job_applications', JSON.stringify(nextApps));
  };

  const updateServicesState = (nextServices: Service[]) => {
    setServices(nextServices);
    localStorage.setItem('samaxon_services', JSON.stringify(nextServices));
    supabaseService.upsertServices(nextServices);
  };

  const updatePortfolioState = (nextProjects: PortfolioProject[]) => {
    setPortfolioProjects(nextProjects);
    localStorage.setItem('samaxon_portfolio_projects', JSON.stringify(nextProjects));
    supabaseService.upsertPortfolioProjects(nextProjects);
  };

  const updateTestimonialsState = (nextTest: Testimonial[]) => {
    setTestimonials(nextTest);
    localStorage.setItem('samaxon_testimonials', JSON.stringify(nextTest));
    supabaseService.upsertTestimonials(nextTest);
  };

  const updatePageSectionsState = (nextSections: PageSectionContent[]) => {
    setPageSections(nextSections);
    localStorage.setItem('samaxon_page_sections', JSON.stringify(nextSections));
  };

  const updateBlogsState = (nextBlogs: BlogPost[]) => {
    setBlogs(nextBlogs);
    localStorage.setItem('samaxon_blogs', JSON.stringify(nextBlogs));
    supabaseService.upsertBlogs(nextBlogs);
  };

  const updateLegalPagesState = (nextLegal: any) => {
    setLegalPages(nextLegal);
    localStorage.setItem('samaxon_legal_pages', JSON.stringify(nextLegal));
  };

  const updateMediaState = (nextMedia: MediaAsset[]) => {
    setMediaAssets(nextMedia);
    localStorage.setItem('samaxon_media', JSON.stringify(nextMedia));
  };

  const updateWebsiteSettingsState = (nextSettings: WebsiteSettings) => {
    setWebsiteSettings(nextSettings);
    localStorage.setItem('samaxon_website_settings', JSON.stringify(nextSettings));
  };

  const updateAdminUsersState = (nextUsers: AdminUser[]) => {
    setAdminUsers(nextUsers);
    localStorage.setItem('samaxon_admin_users', JSON.stringify(nextUsers));
  };

  // Re-read activity logs helper
  const reloadActivityLogs = () => {
    setActivityLogs(JSON.parse(localStorage.getItem('samaxon_activity_logs') || '[]'));
  };

  // 3. Command Action Triggering: updates and audit logs appending
  const handleUpdateLead = (updatedLead: Lead) => {
    const nextList = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    updateLeadsState(nextList);
    supabaseService.upsertLead(updatedLead);
    logActivity(
      'Raj Patel', 'Super Admin', 'UPDATE_LEAD', 'LEAD', updatedLead.id,
      `Updated pipeline status of lead "${updatedLead.name}" code to: ${updatedLead.status.toUpperCase()}`
    );
    reloadActivityLogs();
  };

  const handleDeleteLead = (leadId: string) => {
    const nextList = leads.filter(l => l.id !== leadId);
    updateLeadsState(nextList);
    supabaseService.deleteLead(leadId);
    logActivity('Raj Patel', 'Super Admin', 'DELETE_LEAD', 'LEAD', leadId, `Permanently purged lead trace ID: ${leadId} from dashboard.`);
    reloadActivityLogs();
  };

  const handleUpdateCareer = (updatedApp: CareerApplication) => {
    const nextList = careers.map(c => c.id === updatedApp.id ? updatedApp : c);
    updateCareersState(nextList);
    supabaseService.upsertCareer(updatedApp);
    logActivity(
      'Raj Patel', 'Super Admin', 'UPDATE_CAREER', 'CAREER_APPLICATION', updatedApp.id,
      `Candidate application for ${updatedApp.name} update committed to system: ${updatedApp.status.toUpperCase()}`
    );
    reloadActivityLogs();
  };

  const handleDeleteCareer = (appId: string) => {
    const nextList = careers.filter(c => c.id !== appId);
    updateCareersState(nextList);
    supabaseService.deleteCareer(appId);
    logActivity('Raj Patel', 'Super Admin', 'DELETE_CAREER', 'CAREER_APPLICATION', appId, `Candidate records trace ID: ${appId} deleted entirely.`);
    reloadActivityLogs();
  };

  const handleUpdateJobApplication = (updatedApp: JobApplication) => {
    const nextList = jobApplications.map(c => c.id === updatedApp.id ? updatedApp : c);
    updateJobApplicationsState(nextList);
    supabaseService.upsertJobApplication(updatedApp);
    logActivity(
      'Raj Patel', 'Super Admin', 'UPDATE_JOB_APPLICATION', 'JOB_APPLICATION', updatedApp.id,
      `Job Application for ${updatedApp.full_name} status updated to: ${updatedApp.status.toUpperCase()}`
    );
    reloadActivityLogs();
  };

  const handleDeleteJobApplication = (appId: string) => {
    const nextList = jobApplications.filter(c => c.id !== appId);
    updateJobApplicationsState(nextList);
    supabaseService.deleteJobApplication(appId);
    logActivity('Raj Patel', 'Super Admin', 'DELETE_JOB_APPLICATION', 'JOB_APPLICATION', appId, `Job Application ID: ${appId} permanently deleted.`);
    reloadActivityLogs();
  };

  // Content state updaters accompanied with active audit log entries
  const handleUpdateServices = (nextServices: Service[]) => {
    updateServicesState(nextServices);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_SERVICES', 'SERVICES_METADATA', 'srv-group', 'Re-configured SamaXon capabilities grid layout configurations.');
    reloadActivityLogs();
  };

  const handleUpdatePortfolio = (nextPortfolio: PortfolioProject[]) => {
    updatePortfolioState(nextPortfolio);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_PORTFOLIO', 'PORTFOLIO_CASES', 'proj-group', 'Committed layout revision to published client success stories.');
    reloadActivityLogs();
  };

  const handleUpdateTestimonials = (nextTest: Testimonial[]) => {
    updateTestimonialsState(nextTest);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_TESTIMONIALS', 'CLIENT_QUOTES', 'test-group', 'Updated verified client text testimonials configurations.');
    reloadActivityLogs();
  };

  const handleUpdatePageSections = (nextSections: PageSectionContent[]) => {
    updatePageSectionsState(nextSections);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_PAGES', 'STATIC_PAGE_TEXT', 'sec-group', 'Re-scripted static page hero components or copy coordinates.');
    reloadActivityLogs();
  };

  const handleUpdateBlogs = (nextBlogs: BlogPost[]) => {
    updateBlogsState(nextBlogs);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_BLOGS', 'BLOG_POSTS', 'blog-group', 'Saved visual draft update inside insights builder.');
    reloadActivityLogs();
  };

  const handleUpdateLegalPages = (nextPages: any) => {
    updateLegalPagesState(nextPages);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_LEGAL', 'LEGAL_DISCLOSURES', 'legal-group', 'Re-signed security parameters or refund frames.');
    reloadActivityLogs();
  };

  const handleUpdateMedia = (nextMedia: MediaAsset[]) => {
    updateMediaState(nextMedia);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_MEDIA', 'MEDIA_LIBRARY', 'media-group', 'Modified storage assets reference paths inside storage manager.');
    reloadActivityLogs();
  };

  const handleUpdateWebsiteSettings = (nextSettings: WebsiteSettings) => {
    updateWebsiteSettingsState(nextSettings);
    logActivity('Raj Patel', 'Super Admin', 'REWRITE_SETTINGS', 'SITE_SETTINGS', 'setting-group', 'Updated master metadata, SEO values, or WhatsApp contact points.');
    reloadActivityLogs();
  };

  const handleUpdateAdminUsers = (nextUsers: AdminUser[]) => {
    updateAdminUsersState(nextUsers);
    logActivity('Raj Patel', 'Super Admin', 'CONTROL_ACCESS', 'RBAC_POLICIES', 'rbac-group', 'Adjusted Role-Based Access controls matrix.');
    reloadActivityLogs();
  };

  // 4. Verification Form Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@samaxon.com' && loginPassword === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('samaxon_admin_authorized', 'true');
      logActivity('Raj Patel', 'Super Admin', 'LOGIN', 'SESSION', `sess-${Date.now()}`, 'Super Admin authenticated successfully.');
      reloadActivityLogs();
      setLoginError('');
    } else {
      setLoginError('Invalid administrative token key combination. Enter raj@samaxon.com or admin credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('samaxon_admin_authorized');
  };

  // 5. Renders Wall check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center p-4 relative overflow-hidden" id="admin-login-screen">
        
        {/* Abstract Gold Background highlights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#BFA15A]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md bg-white border border-[#D6B46A]/25 rounded-3xl overflow-hidden shadow-2xl relative z-10 text-left"
        >
          {/* Champagne Header block styling */}
          <div className="bg-[#111111] p-8 text-center border-b border-[#D6B46A]/30">
            <div className="mx-auto w-12 h-12 bg-white/5 border border-[#D6B46A]/25 rounded-xl flex items-center justify-center text-[#D6B46A] mb-4.5 font-display text-lg font-black tracking-widest">
              S
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">Administrative Gateway</span>
            <h1 className="font-display text-xl font-black text-[#FFFDF8] tracking-tight mt-1">SamaXon Studio Control</h1>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-8 space-y-6">
            
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-start gap-2.5 leading-normal"
              >
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8178] font-bold block">Interlink ID (Email)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8178]/65">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="admin@samaxon.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all placeholder:text-[#8A8178]/70"
                  />
                </div>
              </div>

              {/* Security passphrase */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8178] font-bold block">Access Password (Passphrase)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8178]/65">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Quick Helper Credentials */}
            <div className="bg-[#FFFDF8] border border-[#D6B46A]/15 p-3.5 rounded-2xl text-[11px] text-[#8A8178] font-medium leading-relaxed">
              <span className="font-bold text-[#111111] block mb-0.5">Quick Emulator Access credentials:</span>
              Use Email: <strong className="text-[#BFA15A]">admin@samaxon.com</strong> & Password: <strong className="text-[#BFA15A]">admin</strong> to bypass auth checks.
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#111111] hover:bg-[#262626] text-white hover:text-[#D6B46A] text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Verify Executive Token
            </button>
          </form>

          {/* Secure disclaimer brand footer */}
          <div className="p-6 text-center border-t border-neutral-100 text-[10px] font-mono text-[#8A8178] tracking-wider uppercase bg-[#FFFDF8]">
            SamaXon R&D Systems • Secured 256h Crypts
          </div>
        </motion.div>
      </div>
    );
  }

  // Visual Nav Menu Options mapping
  const menuOptions = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Client Inquiries', icon: FileSpreadsheet },
    { id: 'careers', label: 'Applications', icon: Briefcase },
    { id: 'content', label: 'Content Board', icon: Settings },
    { id: 'system', label: 'Systems Hub', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col md:flex-row text-neutral-800 font-sans antialiased" id="admin-workspace-core">
      
      {/* 1. Luxurious Floating Left Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] text-[#FFFDF8] border-r border-[#D6B46A]/20 flex flex-col justify-between shrink-0 text-left">
        <div>
          {/* Master branding block */}
          <div className="p-6 border-b border-[#D6B46A]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFFDF8] text-[#111111] rounded-xl font-display font-black text-base flex items-center justify-center">
                S
              </div>
              <div>
                <h1 className="font-display font-black text-base text-white tracking-widest uppercase">SamaXon</h1>
                <span className="text-[8px] font-mono text-[#D6B46A] tracking-wider uppercase font-extrabold block">Remote Terminal</span>
              </div>
            </div>
            
            {/* Quick bypass back anchor to public screen */}
            <a 
              href="#home"
              className="p-1 px-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#D6B46A] border border-white/10 rounded transition-all"
              title="Return to Public Website"
            >
              <Home className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Menu loops links */}
          <nav className="p-4 py-6 space-y-2">
            {menuOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveTab(opt.id)}
                  className={`w-full py-3.5 px-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                    activeTab === opt.id 
                      ? 'bg-[#FFFDF8] text-[#111111] shadow-lg' 
                      : 'text-white/65 hover:text-[#FFFDF8] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Session profile controls and stats */}
        <div className="p-5 border-t border-[#D6B46A]/15 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center font-display text-emerald-400 font-black text-xs">
              RP
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-bold text-white">Raj Patel</span>
              <span className="text-[9px] font-mono text-[#D6B46A] uppercase font-bold">Super Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-white/5 hover:bg-rose-500/10 border border-white/15 hover:border-rose-500/25 text-white/80 hover:text-rose-400 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect Terminal
          </button>
        </div>
      </aside>

      {/* 2. Primary Workspace Body */}
      <main className="flex-1 min-w-0 bg-[#FFFDF8] p-6 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full"
          >
            {activeTab === 'dashboard' && (
              <DashboardTab
                leads={leads}
                careers={careers}
                botVisits={botVisits}
                activityLogs={activityLogs}
                onNavigateTo={(tabId) => setActiveTab(tabId)}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsTab
                leads={leads}
                onUpdateLead={handleUpdateLead}
                onDeleteLead={handleDeleteLead}
              />
            )}

            {activeTab === 'careers' && (
              <CareersTab
                jobApplications={jobApplications}
                onUpdateJobApplication={handleUpdateJobApplication}
                onDeleteJobApplication={handleDeleteJobApplication}
              />
            )}

            {activeTab === 'content' && (
              <ContentSettingsTab
                services={services}
                portfolioProjects={portfolioProjects}
                testimonials={testimonials}
                pageSections={pageSections}
                blogs={blogs}
                legalPages={legalPages}
                onUpdateServices={handleUpdateServices}
                onUpdatePortfolio={handleUpdatePortfolio}
                onUpdateTestimonials={handleUpdateTestimonials}
                onUpdatePageSections={handleUpdatePageSections}
                onUpdateBlogs={handleUpdateBlogs}
                onUpdateLegalPages={handleUpdateLegalPages}
              />
            )}

            {activeTab === 'system' && (
              <SystemSettingsTab
                mediaAssets={mediaAssets}
                botVisits={botVisits}
                automationLogs={automationLogs}
                activityLogs={activityLogs}
                adminUsers={adminUsers}
                websiteSettings={websiteSettings}
                onUpdateMedia={handleUpdateMedia}
                onUpdateWebsiteSettings={handleUpdateWebsiteSettings}
                onUpdateAdminUsers={handleUpdateAdminUsers}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
