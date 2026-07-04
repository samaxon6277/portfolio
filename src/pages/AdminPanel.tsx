import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Bot, LayoutDashboard, FileSpreadsheet, Briefcase, Settings, LogOut, Lock, Mail, Shield, CheckCircle, Home, RefreshCw, Eye, EyeOff
} from 'lucide-react';

import { Lead, CareerApplication, Service, PortfolioProject, Testimonial, BlogPost, MediaAsset, JobApplication } from '../types';
import { supabaseService, dbRoleToUi, uiRoleToDb } from '../utils/supabaseService';
import { supabase } from '../utils/supabase';
import { analytics } from '../utils/analytics';
import { useCustomUi } from '../context/CustomUiContext';
import { logger } from '../utils/logger';

// Tab components imports
import DashboardTab from './admin/DashboardTab';
import LeadsTab from './admin/LeadsTab';
import CareersTab from './admin/CareersTab';
import ContentSettingsTab from './admin/ContentSettingsTab';
import SystemSettingsTab from './admin/SystemSettingsTab';

export default function AdminPanel() {
  const { showToast, showAlert } = useCustomUi();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemSubTab, setSystemSubTab] = useState<'media' | 'analytics' | 'botlogs' | 'team' | 'brand' | 'audit' | 'profile'>('media');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active Admin Session Data
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null>(null);

  // Core administrative state datasets
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [botVisits, setBotVisits] = useState<any[]>([]);
  const [automationLogs, setAutomationLogs] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  
  // Unused mock fields kept to satisfy initial tab component properties
  const [careers, setCareers] = useState<CareerApplication[]>([]);
  const [pageSections, setPageSections] = useState<any[]>([]);
  const [legalPages, setLegalPages] = useState<any>({});
  const [websiteSettings, setWebsiteSettings] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('samaxon_website_settings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      logger.warn('Failed to parse website settings from localStorage:', e);
    }
    return {
      brandName: 'SamaXon',
      logoUrl: 'S',
      faviconUrl: '/favicon.ico',
      contactEmail: 'build@samaxon.com',
      phoneWhatsapp: '+91 80000 00000',
      telegramLink: 'https://t.me/samaxon_studio',
      linkedinLink: 'https://linkedin.com/company/samaxon',
      instagramLink: 'https://instagram.com/samaxon_studio',
      address: 'SamaXon Tech Suites, Level 8, DLF CyberCity, Gurugram, HR, India',
      defaultSeoTitle: "SamaXon | India's Premium 48-Hour Digital & Systems Studio",
      defaultSeoDescription: 'SamaXon engineers luxury websites, lightning-fast mobile apps, advanced automations, custom telegram bots, and bespoke digital control hubs in 48 hours.',
      maintenanceMode: false,
      globalCtaText: 'Start Your 48h Build',
      footerText: '© 2026 SAMAXON STUDIO. ALL RIGHTS PROTECTED.',
      statTotalProjects: '42+',
      statActiveClients: '18+',
      statTeamMembers: '8+',
      statIndustriesServed: '12+',
      statYearsExperience: '5+'
    };
  });

  // 1. Mount initial states & Check Auth
  const syncWithDatabase = async () => {
    try {
      const [
        dynamicProjects,
        dynamicServices,
        dynamicLeads,
        dynamicJobApps,
        dynamicTestimonials,
        dynamicBlogs,
        rawMembers,
        rawEvents,
        rawCrawlers,
        rawWebhooks
      ] = await Promise.all([
        supabaseService.getPortfolioProjects(),
        supabaseService.getServices(),
        supabaseService.getLeads(),
        supabaseService.getJobApplications(),
        supabaseService.getTestimonials(),
        supabaseService.getBlogs(),
        supabaseService.getTeamMembers(),
        supabaseService.fetchSiteEvents(),
        supabaseService.fetchCrawlerLogs(),
        supabaseService.fetchWebhookLogs()
      ]);

      setPortfolioProjects(dynamicProjects);
      setServices(dynamicServices);
      setLeads(dynamicLeads);
      setJobApplications(dynamicJobApps);
      setTestimonials(dynamicTestimonials);
      setBlogs(dynamicBlogs);

      // Map live team members
      const mappedAdmins = rawMembers.map(m => ({
        id: m.id,
        name: m.full_name,
        email: m.email,
        role: dbRoleToUi(m.role),
        status: (m.status || '').toLowerCase() === 'active' ? 'Active' : 'Disabled',
        lastLogin: m.last_login || 'Never',
        createdAt: m.created_at
      }));
      setAdminUsers(mappedAdmins);

      // Map crawlers
      const mappedBots = rawCrawlers.map(l => {
        const botName = l.bot_name || 'Generic Bot';
        const userAgent = l.user_agent || 'Unknown';
        const normUA = userAgent.toLowerCase();
        const normName = botName.toLowerCase();
        let category = 'Unknown Bot';
        if (normName.includes('google') || normUA.includes('google')) category = 'Googlebot';
        else if (normName.includes('bing') || normUA.includes('bing')) category = 'Bingbot';
        else if (normName.includes('telegram') || normName.includes('twitter') || normName.includes('facebook') || normUA.includes('telegram') || normUA.includes('twitter') || normUA.includes('facebook') || normUA.includes('whatsapp')) category = 'Social Preview Bot';
        else if (normName.includes('ahrefs') || normName.includes('semrush') || normUA.includes('ahrefs') || normUA.includes('semrush')) category = 'SEO Tool Bot';
        
        return {
          id: l.id,
          botName: botName,
          category: category as any,
          userAgent: userAgent,
          pagePath: l.page_url || '/',
          ipHash: l.ip_hash || 'unknown',
          visitCount: 1,
          lastSeenAt: l.created_at,
          createdAt: l.created_at
        };
      });
      setBotVisits(mappedBots);

      // Map siteEvents to activity logs
      const mappedActivityLogs = rawEvents.map(e => ({
        id: e.id,
        adminUserName: e.metadata?.name || e.metadata?.email || 'Visitor Address',
        adminUserRole: e.metadata?.role || 'Guest',
        actionType: (e.event_type || '').toUpperCase(),
        entityType: e.metadata?.page || 'Site Routing',
        entityId: e.id,
        description: `Triggered event: "${e.event_type}" from ${e.browser || 'Unknown'} Browser on a ${e.device_type || 'Desktop'}. Ref: ${e.referrer || 'Direct'}. Path: ${e.page_url || '/'}`,
        createdAt: e.created_at,
        timestamp: e.created_at
      }));
      setActivityLogs(mappedActivityLogs);

      // Webhook dynamic logs - directly connect to real database table
      setAutomationLogs(rawWebhooks || []);

    } catch (err) {
      logger.warn('Sync failed to load real-time database elements:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true);
      try {
        // Fetch auth states
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const emailLower = session.user.email || '';
          const userId = session.user.id;

          // Retrieve team member mapping cleanly
          const { data: match, error: fetchError } = await supabaseService.getTeamMemberByAuth(userId, emailLower);

          // Log database details in development only
          logger.log("--- Auth Session Init Diagnosis ---");
          logger.log("Auth User ID:", userId);
          logger.log("Auth Email:", emailLower);

          if (fetchError) {
            logger.error("Auth initialization query failed:", fetchError);
            setLoginError(`Authentication lookup failed. Please contact your system administrator.`);
            await supabase.auth.signOut();
            return;
          }

          if (match) {
            const roleDb = (match.role || '').toLowerCase().trim();
            const allowedRoles = ['super_admin', 'admin', 'sales_manager', 'career_manager', 'content_editor', 'viewer'];
            
            if (!allowedRoles.includes(roleDb)) {
              setLoginError("Access denied: Admin role value not authorized. Ensure it matches one of: 'super_admin', 'admin', 'sales_manager', 'career_manager', 'content_editor', or 'viewer'.");
              await supabase.auth.signOut();
            } else if (match.status && match.status.toLowerCase().trim() !== 'active') {
              setLoginError('Access denied: Account disabled.');
              await supabase.auth.signOut();
            } else {
              setCurrentUser({
                id: match.id,
                email: match.email,
                full_name: match.full_name,
                role: dbRoleToUi(match.role)
              });
              setIsAuthenticated(true);
              
              // Log login activity
              await supabaseService.trackSiteEvent('admin_session_resume', {
                email: match.email,
                role: dbRoleToUi(match.role),
                name: match.full_name
              });
            }
          } else {
            setLoginError("No team member row found for this auth user.");
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        logger.warn('Initial auth validation process encountered error');
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
    syncWithDatabase();

    // Setup local listeners to mirror analytics triggers
    const handleLocalTele = () => {
      syncWithDatabase();
    };
    window.addEventListener('samaxon_analytics_updated', handleLocalTele);
    return () => {
      window.removeEventListener('samaxon_analytics_updated', handleLocalTele);
    };
  }, []);

  // Sync up states dynamically when authenticated succeeds
  useEffect(() => {
    if (isAuthenticated) {
      syncWithDatabase();
    }
  }, [isAuthenticated]);

  // 3. Command Action Triggering: updates and audit logs appending
  const handleUpdateLead = async (updatedLead: Lead) => {
    const success = await supabaseService.upsertLead(updatedLead);
    if (success) {
      setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
      await supabaseService.trackSiteEvent('update_lead_status', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role,
        leadId: updatedLead.id,
        nextStatus: updatedLead.status
      });
      syncWithDatabase();
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const success = await supabaseService.deleteLead(leadId);
    if (success) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      await supabaseService.trackSiteEvent('delete_lead', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role,
        leadId: leadId
      });
      syncWithDatabase();
    }
  };

  const handleUpdateJobApplication = async (updatedApp: JobApplication) => {
    const success = await supabaseService.upsertJobApplication(updatedApp);
    if (success) {
      setJobApplications(prev => prev.map(c => c.id === updatedApp.id ? updatedApp : c));
      await supabaseService.trackSiteEvent('update_job_status', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role,
        appId: updatedApp.id,
        nextStatus: updatedApp.status
      });
      syncWithDatabase();
    }
  };

  const handleDeleteJobApplication = async (appId: string) => {
    const success = await supabaseService.deleteJobApplication(appId);
    if (success) {
      setJobApplications(prev => prev.filter(c => c.id !== appId));
      await supabaseService.trackSiteEvent('delete_job_application', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role,
        appId: appId
      });
      syncWithDatabase();
    }
  };

  // Content state updaters accompanied with active audit log entries
  const handleUpdateServices = async (nextServices: Service[]) => {
    const success = await supabaseService.upsertServices(nextServices);
    if (success) {
      setServices(nextServices);
      await supabaseService.trackSiteEvent('update_all_services', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role
      });
      syncWithDatabase();
    }
  };

  const handleUpdatePortfolio = async (nextPortfolio: PortfolioProject[]) => {
    const success = await supabaseService.upsertPortfolioProjects(nextPortfolio);
    if (success) {
      setPortfolioProjects(nextPortfolio);
      await supabaseService.trackSiteEvent('update_all_portfolio', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role
      });
      syncWithDatabase();
    }
  };

  const handleUpdateTestimonials = async (nextTest: Testimonial[]) => {
    const success = await supabaseService.upsertTestimonials(nextTest);
    if (success) {
      setTestimonials(nextTest);
      await supabaseService.trackSiteEvent('update_all_testimonials', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role
      });
      syncWithDatabase();
    }
  };

  const handleUpdatePageSections = (nextSections: any[]) => {
    setPageSections(nextSections);
  };

  const handleUpdateBlogs = async (nextBlogs: BlogPost[]) => {
    const success = await supabaseService.upsertBlogs(nextBlogs);
    if (success) {
      setBlogs(nextBlogs);
      await supabaseService.trackSiteEvent('update_all_blogs_and_insights', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role
      });
      syncWithDatabase();
    }
  };

  const handleUpdateLegalPages = (nextPages: any) => {
    setLegalPages(nextPages);
  };

  const handleUpdateMedia = (nextMedia: MediaAsset[]) => {
    setMediaAssets(nextMedia);
  };

  const handleUpdateWebsiteSettings = (nextSettings: any) => {
    setWebsiteSettings(nextSettings);
    try {
      localStorage.setItem('samaxon_website_settings', JSON.stringify(nextSettings));
      window.dispatchEvent(new Event('samaxon_website_settings_updated'));
    } catch (e) {
      logger.warn('Failed to save website settings to localStorage:', e);
    }
  };

  const handleUpdateAdminUsers = async (nextUsers: any[]) => {
    try {
      for (const nextUser of nextUsers) {
        const found = adminUsers.find(u => u.id === nextUser.id);
        if (!found) {
          // NEW Teammate ADDED!
          // Try to sign up the user in Supabase Auth first with the custom password set
          const passwordToUse = nextUser.password || 'SamaXonAdminSecurePassword123!';
          let finalId = nextUser.id;
          
          try {
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email: nextUser.email,
              password: passwordToUse
            });
            if (signUpErr) {
              logger.warn('Supabase Auth signUp returned error/warning.');
            }
            if (signUpData?.user?.id) {
              finalId = signUpData.user.id;
            }
          } catch (signUpFail) {
            logger.error('Supabase Auth signUp failed.');
          }

          const dbMemberObj = {
            id: finalId,
            full_name: nextUser.name,
            email: nextUser.email,
            role: uiRoleToDb(nextUser.role),
            status: nextUser.status === 'Active' ? 'active' : 'disabled',
            created_at: new Date().toISOString(),
            created_by: currentUser?.id
          };
          await supabaseService.upsertTeamMember(dbMemberObj);
        } else if (found.status !== nextUser.status || found.role !== nextUser.role) {
          // Role / status modified!
          const dbMemberObj = {
            id: nextUser.id,
            full_name: nextUser.name,
            email: nextUser.email,
            role: uiRoleToDb(nextUser.role),
            status: nextUser.status === 'Active' ? 'active' : 'disabled',
            created_at: found.createdAt || new Date().toISOString(),
            created_by: currentUser?.id
          };
          await supabaseService.upsertTeamMember(dbMemberObj);
        }
      }

      // Check for deletes
      for (const oldUser of adminUsers) {
        const found = nextUsers.find(u => u.id === oldUser.id);
        if (!found) {
          await supabaseService.deleteTeamMember(oldUser.id);
        }
      }

      await supabaseService.trackSiteEvent('admin_rbac_matrix_changed', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role
      });
      
      const rawMembers = await supabaseService.getTeamMembers();
      const mappedAdmins = rawMembers.map(m => ({
        id: m.id,
        name: m.full_name,
        email: m.email,
        role: dbRoleToUi(m.role),
        status: (m.status || '').toLowerCase() === 'active' ? 'Active' : 'Disabled',
        lastLogin: m.last_login || 'Never',
        createdAt: m.created_at
      }));
      setAdminUsers(mappedAdmins);

      showToast('Database team matrix sync completed successfully!', 'success');
    } catch (err) {
      logger.error('Failed to update team members');
    }
  };

  // 4. Secure Audited Auth Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setLoginError('');

    try {
      const emailLower = loginEmail.trim().toLowerCase();
      if (!emailLower || !loginPassword) {
        throw new Error('Please enter both your identifier email and access passphrase.');
      }

      // Strictly sign in using credentials. No registration or auto-onboarding routes.
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: loginPassword
      });

      if (signInError) {
        const errMsg = signInError.message.toLowerCase();
        if (errMsg.includes('invalid login credentials') || errMsg.includes('invalid grant')) {
          throw new Error('Invalid email or password.');
        } else {
          throw signInError;
        }
      }

      const authUser = signInData?.user;
      if (!authUser) {
        throw new Error('Verification failed. Unable to establish session.');
      }

      // Retrieve team member mapping cleanly
      const { data: match, error: fetchError } = await supabaseService.getTeamMemberByAuth(authUser.id, emailLower);

      // Log database details in development only
      logger.log("--- Auth Action Diagnosis ---");
      logger.log("Auth User ID:", authUser.id);
      logger.log("Auth Email:", emailLower);

      if (fetchError) {
        await supabase.auth.signOut();
        throw new Error(`Access verification failed. RLS policy mismatch detected.`);
      }

      if (!match) {
        await supabase.auth.signOut();
        throw new Error("No team member row found for this auth user.");
      }

      const roleDb = (match.role || '').toLowerCase().trim();
      const allowedRoles = ['super_admin', 'admin', 'sales_manager', 'career_manager', 'content_editor', 'viewer'];
      
      if (!allowedRoles.includes(roleDb)) {
        await supabase.auth.signOut();
        throw new Error("Access denied: Unauthorized role value. Valid configured roles are: 'super_admin', 'admin', 'sales_manager', 'career_manager', 'content_editor', or 'viewer'.");
      }

      if (match.status && match.status.toLowerCase().trim() !== 'active') {
        await supabase.auth.signOut();
        throw new Error('Access denied: Account disabled.');
      }

      // Commit login timestamp audit log
      match.last_login = new Date().toISOString();
      await supabaseService.upsertTeamMember(match);

      setCurrentUser({
        id: match.id,
        email: match.email,
        full_name: match.full_name,
        role: dbRoleToUi(match.role)
      });
      setIsAuthenticated(true);

      await supabaseService.trackSiteEvent('admin_completed_secure_login', {
        email: match.email,
        role: dbRoleToUi(match.role),
        name: match.full_name
      });

    } catch (err: any) {
      setLoginError(err.message || 'System Network Interruption. Authentication aborted.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabaseService.trackSiteEvent('admin_disconnected_terminal', {
        email: currentUser?.email,
        name: currentUser?.full_name,
        role: currentUser?.role
      });
      await supabase.auth.signOut();
    } catch (e) {
      logger.warn('Signout action failed');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Initializing screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 gap-3">
        <RefreshCw className="w-8 h-8 text-[#D6B46A] animate-spin" />
        <span className="text-xs font-mono tracking-widest text-[#8A8178] uppercase mt-2 animate-pulse">Checking Secure Shell...</span>
      </div>
    );
  }

  // 5. Renders Auth Wall check
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
              Administrative Gateway
            </span>
            <h1 className="font-display text-xl font-black text-[#FFFDF8] tracking-tight mt-1">
              SamaXon Studio Control
            </h1>
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
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8178] font-bold block">Executive Identifier Key (Email)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8178]/65">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@samaxon.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all placeholder:text-[#8A8178]/70"
                  />
                </div>
              </div>

              {/* Security passphrase */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8178] font-bold block">Access Passphrase (Password)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8178]/65">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#FFFDF8] hover:bg-neutral-50 border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-semibold text-[#111111] rounded-xl outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8178]/65 hover:text-[#D6B46A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 bg-[#111111] hover:bg-[#262626] text-white hover:text-[#D6B46A] text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              {isSubmittingAuth ? 'Establishing Sync Link...' : 'Verify Executive Token'}
            </button>
          </form>

          {/* Secure disclaimer brand footer */}
          <div className="p-6 text-center border-t border-neutral-100 text-[10px] font-mono text-[#8A8178] tracking-wider uppercase bg-[#FFFDF8]">
            SamaXon Security Node • Production Authenticated
          </div>
        </motion.div>
      </div>
    );
  }

  // Visual Nav Menu Options mapping (System Settings Hub is restricted to Super Admin only)
  const menuOptions = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Client Inquiries', icon: FileSpreadsheet },
    { id: 'careers', label: 'Applications', icon: Briefcase },
    { id: 'content', label: 'Content Board', icon: Settings },
  ];

  if (currentUser) {
    menuOptions.push({ id: 'system', label: 'Systems Hub', icon: Shield });
  }

  // Get name initials
  const initials = currentUser?.full_name
    ? currentUser.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'EX';

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#FFFDF8] flex flex-col md:flex-row text-neutral-800 font-sans antialiased" id="admin-workspace-core">
      
      {/* 1. Luxurious Floating Left Navigation Sidebar */}
      <aside className="w-full md:w-64 md:h-full bg-[#111111] text-[#FFFDF8] border-r border-[#D6B46A]/20 flex flex-col justify-between shrink-0 text-left overflow-y-auto custom-scrollbar">
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
            <div className="w-9 h-9 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/40 flex items-center justify-center font-display text-[#D6B46A] font-black text-xs">
              {initials}
            </div>
            <div className="flex flex-col text-xs max-w-[140px] truncate select-none">
              <span className="font-bold text-white leading-tight truncate">{currentUser?.full_name}</span>
              <span className="text-[9px] font-mono text-[#D6B46A] uppercase font-bold truncate">{currentUser?.role}</span>
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
      <main className="flex-1 min-w-0 bg-[#FFFDF8] p-6 lg:p-10 md:h-full md:overflow-y-auto">
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
                careers={jobApplications as any}
                botVisits={botVisits}
                activityLogs={activityLogs}
                onNavigateTo={(tabId) => {
                  if (tabId === 'bot-logs') {
                    setSystemSubTab('botlogs');
                    setActiveTab('system');
                  } else if (tabId === 'activity-logs') {
                    setSystemSubTab('audit');
                    setActiveTab('system');
                  } else {
                    setActiveTab(tabId);
                  }
                }}
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
                initialSubTab={systemSubTab}
                onSubTabChange={(st: any) => setSystemSubTab(st)}
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
