import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Image, BarChart2, ShieldAlert, Users, Radio, History, ClipboardList, Lock, Check, Copy, Upload, Trash2, ShieldCheck, RefreshCw, Eye, EyeOff, BookOpen, AlertCircle,
  Crown, Sparkles, Palette, RotateCcw, Monitor, Smartphone, Globe
} from 'lucide-react';
import { MediaAsset } from '../../types';
import { BotVisit, AutomationLog, ActivityLog, AdminUser, WebsiteSettings } from '../../utils/mockAdminData';
import { analytics } from '../../utils/analytics';
import CustomSelect from '../../components/CustomSelect';
import { useCustomUi } from '../../context/CustomUiContext';
import InteractiveLogoEditor from '../../components/admin/InteractiveLogoEditor';

interface SystemSettingsTabProps {
  initialSubTab?: 'media' | 'analytics' | 'botlogs' | 'team' | 'brand' | 'audit' | 'profile';
  onSubTabChange?: (tab: 'media' | 'analytics' | 'botlogs' | 'team' | 'brand' | 'audit' | 'profile') => void;
  mediaAssets: MediaAsset[];
  botVisits: BotVisit[];
  automationLogs: any[];
  activityLogs: ActivityLog[];
  adminUsers: AdminUser[];
  websiteSettings: WebsiteSettings;
  onUpdateMedia: (assets: MediaAsset[]) => void;
  onUpdateWebsiteSettings: (settings: WebsiteSettings) => void;
  onUpdateAdminUsers: (users: AdminUser[]) => void;
}

export default function SystemSettingsTab({
  initialSubTab, onSubTabChange,
  mediaAssets, botVisits, automationLogs, activityLogs, adminUsers, websiteSettings,
  onUpdateMedia, onUpdateWebsiteSettings, onUpdateAdminUsers
}: SystemSettingsTabProps) {
  const { showConfirm, showToast, showAlert } = useCustomUi();
  const [subTab, setSubTab] = useState<'media' | 'analytics' | 'botlogs' | 'team' | 'brand' | 'audit' | 'profile'>('media');
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>(websiteSettings);

  useEffect(() => {
    if (websiteSettings) {
      setLocalSettings(websiteSettings);
    }
  }, [websiteSettings]);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const changeSubTab = (tab: 'media' | 'analytics' | 'botlogs' | 'team' | 'brand' | 'audit' | 'profile') => {
    setSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchAudit, setSearchAudit] = useState('');
  const [auditEventFilter, setAuditEventFilter] = useState<'ALL' | 'LOGIN' | 'UPDATE' | 'LEAD' | 'PAGE_VIEW' | 'SETTINGS' | 'BOT'>('ALL');
  const [auditCurrentPage, setAuditCurrentPage] = useState(1);

  // Real-time custom states for Webhook Delivery systems & Bot tracking
  const [expandedWebhooks, setExpandedWebhooks] = useState<Record<string, boolean>>({});
  const [copiedWebhookId, setCopiedWebhookId] = useState<string | null>(null);

  const toggleExpandWebhook = (id: string) => {
    setExpandedWebhooks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPayload = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhookId(id);
    setTimeout(() => setCopiedWebhookId(null), 2000);
    showToast('Webhook payload copied to clipboard!', 'success');
  };

  const renderPayload = (payload: any): string => {
    if (!payload) return 'No payload data';
    let formatted = '';
    try {
      if (typeof payload === 'object') {
        formatted = JSON.stringify(payload, null, 2);
      } else if (typeof payload === 'string') {
        const parsed = JSON.parse(payload);
        formatted = JSON.stringify(parsed, null, 2);
      } else {
        formatted = String(payload);
      }
    } catch (e) {
      formatted = String(payload);
    }
    return formatted;
  };
  
  const [analyticsData, setAnalyticsData] = useState(() => analytics.getStats());

  useEffect(() => {
    const handleUpdate = () => {
      setAnalyticsData(analytics.getStats());
    };
    window.addEventListener('samaxon_analytics_updated', handleUpdate);
    return () => {
      window.removeEventListener('samaxon_analytics_updated', handleUpdate);
    };
  }, []);

  // Team Management new member states
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Super Admin' | 'Admin' | 'Content Editor' | 'Sales Manager' | 'Career Manager' | 'Viewer'>('Admin');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [showNewMemberPassword, setShowNewMemberPassword] = useState(false);

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPassword) {
      showAlert({
        title: 'Error creating user',
        message: 'Please fill out Member Name, Email, and Access Password to create this profile.',
        type: 'error'
      });
      return;
    }
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(newMemberEmail)) {
      showAlert({
        title: 'Invalid format',
        message: 'Please provide a valid active email address.',
        type: 'error'
      });
      return;
    }
    if (newMemberPassword.length < 6) {
      showAlert({
        title: 'Incorrect requirements',
        message: 'Password must be at least 6 characters long to maintain premium terminal encryption.',
        type: 'warning'
      });
      return;
    }
    const duplicate = adminUsers.find(u => u.email.toLowerCase() === newMemberEmail.trim().toLowerCase());
    if (duplicate) {
      showAlert({
        title: 'Error creating user',
        message: 'This email address is already registered as an active team member.',
        type: 'error'
      });
      return;
    }

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      role: newMemberRole,
      status: 'Active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString(),
      password: newMemberPassword
    };

    onUpdateAdminUsers([...adminUsers, newUser]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPassword('');
    setNewMemberRole('Admin');
    showToast(`Successfully registered ${newUser.name} as ${newUser.role}!`, 'success');
  };

  // Media simulation
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  const handleUploadMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName || !newMediaUrl) return;
    const item: MediaAsset = {
      id: `med-${Date.now()}`,
      fileName: newMediaName,
      url: newMediaUrl,
      mimeType: 'image/webp',
      uploadedAt: new Date().toISOString()
    };
    onUpdateMedia([item, ...mediaAssets]);
    setNewMediaName('');
    setNewMediaUrl('');
    showToast(`Upload successfully completed! Path added to public library.`, 'success');
  };

  const handleDeleteMedia = (id: string) => {
    showConfirm({
      title: 'Delete Media Asset?',
      message: 'Are you sure you want to permanently delete this media component? This can break visual placeholders if the file is in active use.',
      confirmText: 'Delete Asset',
      onConfirm: () => {
        onUpdateMedia(mediaAssets.filter(m => m.id !== id));
        showToast('Media file deleted.', 'success');
      }
    });
  };

  const handleTeamMemberToggle = (id: string) => {
    onUpdateAdminUsers(adminUsers.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleRoleChange = (id: string, role: any) => {
    onUpdateAdminUsers(adminUsers.map(u => {
      if (u.id === id) {
        return { ...u, role };
      }
      return u;
    }));
  };

  // Copy helper
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  // Filtering activity logs
  const filteredAudits = activityLogs.filter(log => {
    const matchesKeyword = 
      log.adminUserName.toLowerCase().includes(searchAudit.toLowerCase()) ||
      log.description.toLowerCase().includes(searchAudit.toLowerCase()) ||
      log.actionType.toLowerCase().includes(searchAudit.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchAudit.toLowerCase());

    if (!matchesKeyword) return false;

    if (auditEventFilter === 'ALL') return true;
    const action = (log.actionType || '').toUpperCase();
    if (auditEventFilter === 'LOGIN') return action.includes('LOGIN') || action.includes('AUTH') || action.includes('SESSION');
    if (auditEventFilter === 'UPDATE') return action.includes('UPDATE') || action.includes('EDIT') || action.includes('MODIFY') || action.includes('SERVICE') || action.includes('PORTFOLIO');
    if (auditEventFilter === 'LEAD') return action.includes('LEAD') || action.includes('APPLICANT') || action.includes('CAREER') || action.includes('SHORTLIST');
    if (auditEventFilter === 'PAGE_VIEW') return action.includes('PAGE_VIEW') || action.includes('VIEW') || action.includes('VISIT');
    if (auditEventFilter === 'SETTINGS') return action.includes('SETTING') || action.includes('CONFIG') || action.includes('BRAND');
    if (auditEventFilter === 'BOT') return action.includes('BOT') || action.includes('CRAWL') || action.includes('SECURITY');
    return true;
  });

  const AUDIT_PAGE_SIZE = 12;
  const auditTotalPages = Math.max(1, Math.ceil(filteredAudits.length / AUDIT_PAGE_SIZE));
  const paginatedAudits = filteredAudits.slice((auditCurrentPage - 1) * AUDIT_PAGE_SIZE, auditCurrentPage * AUDIT_PAGE_SIZE);

  return (
    <div className="space-y-6" id="system-settings-manager">
      
      {/* Title Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Hardware & Logistics Core</span>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">Systems Remote Control</h2>
        </div>

        {/* System Subtab Navigator */}
        <div className="relative max-w-full overflow-x-auto scrollbar-none py-1">
          <div className="flex flex-nowrap items-center bg-[#FFFDF8] border border-[#D6B46A]/20 p-1 rounded-xl text-[10px] font-mono font-bold tracking-widest uppercase gap-1 whitespace-nowrap shadow-sm" id="system-sub-navigator">
            {[
              { id: 'media', label: 'Media Library', icon: Image },
              { id: 'analytics', label: 'Full Analytics', icon: BarChart2 },
              { id: 'botlogs', label: 'Webhooks & Bot logs', icon: ShieldAlert },
              { id: 'team', label: 'Team Roles', icon: Users },
              { id: 'brand', label: 'Brand & Logo Identity', icon: Crown },
              { id: 'audit', label: 'Activity Audit', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => changeSubTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    subTab === tab.id 
                      ? 'bg-[#111111] text-white shadow-sm' 
                      : 'text-[#8A8178] hover:text-[#111111] hover:bg-[#F4EFE6]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MEDIA MODULE SUB --- */}
      {subTab === 'media' && (
        <div className="space-y-6 text-left" id="subtab-media-view">
          {/* Simulated File upload panel */}
          <form onSubmit={handleUploadMedia} className="bg-white border border-[#D6B46A]/15 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">Supabase Storage Emulator Bucket</h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Simulated Asset Name</label>
                <input 
                  type="text" 
                  placeholder="branding_lux_vector.webp"
                  value={newMediaName}
                  onChange={e => setNewMediaName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl text-xs" 
                />
              </div>
              <div className="md:col-span-5">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Image web url source</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newMediaUrl}
                  onChange={e => setNewMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl text-xs" 
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  className="w-full py-2 bg-[#111111] text-[#D6B46A] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#262626] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload asset
                </button>
              </div>
            </div>
          </form>

          {/* Media Grid Cards displaying links and sizes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-1">
            {mediaAssets.map(asset => (
              <div key={asset.id} className="bg-white border border-[#D6B46A]/12 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
                <div className="aspect-video w-full overflow-hidden bg-neutral-100 relative">
                  <img src={asset.url} alt={asset.fileName} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-[#111111] block truncate">{asset.fileName}</span>
                    <span className="text-[9px] font-mono text-[#8A8178] block">{asset.mimeType} • Vector Asset</span>
                  </div>

                  <div className="flex gap-2 text-[9px] font-mono uppercase tracking-widest">
                    <button 
                      onClick={() => handleCopy(asset.url)}
                      className="px-2 py-1 bg-neutral-50 hover:bg-[#FFFDF8] border border-neutral-200 hover:border-[#D6B46A]/30 text-[#8A8178] hover:text-[#111111] rounded transition-all cursor-pointer inline-flex items-center gap-1 w-full justify-center"
                    >
                      {copiedUrl === asset.url ? 'Copied' : 'Copy link'}
                    </button>
                    <button 
                      onClick={() => handleDeleteMedia(asset.id)}
                      className="p-1 bg-neutral-50 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 text-[#8A8178] hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ANALYTICS MODULE SUB --- */}
      {subTab === 'analytics' && (
        <div className="space-y-6 text-left" id="subtab-analytics-view">
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h4 className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider">Telemetry Click Events Breakdown (conversion counts)</h4>
              <p className="text-xs text-[#8A8178] mt-0.5">Tracks direct client interaction signals mapped across public interfaces</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Page Views', count: analyticsData.pageViews, rate: 'Direct site loads' },
                { label: 'Form Starts', count: analyticsData.formStarts, rate: 'Form focus actions' },
                { label: 'Form Submits', count: analyticsData.formSubmits, rate: 'Secure database records' },
                { label: 'WhatsApp clickouts', count: analyticsData.whatsappClickouts, rate: 'Direct WhatsApp bypass' }
              ].map(event => (
                <div key={event.label} className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-4">
                  <span className="text-[10px] font-mono uppercase text-[#8A8178] tracking-wider block font-bold">{event.label}</span>
                  <span className="text-2xl font-black font-display text-[#111111] block mt-1">{event.count}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● {event.rate}</span>
                </div>
              ))}
            </div>

            {/* Custom SVG conversion bar chart */}
            <div className="border border-neutral-100 rounded-2xl p-6 bg-neutral-50 space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-black block">Traffic Source Acquisition Maps</span>
              <div className="space-y-3.5">
                {(() => {
                  let directCount = 0;
                  let linkedinCount = 0;
                  let telegramCount = 0;
                  let socialCount = 0;

                  (activityLogs || []).forEach(log => {
                    const desc = (log.description || '').toLowerCase();
                    if (desc.includes('ref: direct') || desc.includes('ref: unknown')) {
                      directCount++;
                    } else if (desc.includes('linkedin')) {
                      linkedinCount++;
                    } else if (desc.includes('telegram') || desc.includes('t.me') || desc.includes('t.co')) {
                      telegramCount++;
                    } else {
                      socialCount++;
                    }
                  });

                  const total = directCount + linkedinCount + telegramCount + socialCount || 1;
                  const sources = [
                    { source: 'Direct Search / Organic Ingress', count: directCount },
                    { source: 'LinkedIn Enterprise Referrals', count: linkedinCount },
                    { source: 'Telegram Consulting Leads', count: telegramCount },
                    { source: 'External Web Referrers / Socials', count: socialCount }
                  ];

                  // In case there's no data, default to 100% direct for visual placeholder elegance
                  const hasData = (directCount + linkedinCount + telegramCount + socialCount) > 0;
                  const mappedSources = sources.map(s => ({
                    source: s.source,
                    pct: hasData ? Math.round((s.count / total) * 100) : (s.source.includes('Direct') ? 100 : 0)
                  }));

                  return mappedSources.map(src => (
                    <div key={src.source} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-neutral-800">
                        <span className="font-medium">{src.source}</span>
                        <span className="font-mono font-bold text-[#D6B46A]">{src.pct}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#D6B46A] h-full rounded-full animate-all duration-500" style={{ width: `${src.pct}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- WEBHOOK AUTOMATIONS & BOT LOGS --- */}
      {subTab === 'botlogs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="subtab-botlogs-view">
          
          {/* Webhook Transaction Logs */}
          <div className="lg:col-span-6 bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111]">Webhook Delivery Systems</h4>
                <p className="text-[11px] text-[#8A8178] mt-0.5">Real-time external postback bridges active inside the database</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-850 rounded-full font-mono font-bold text-[9px] tracking-wide">
                {automationLogs.length} Records
              </span>
            </div>

            {automationLogs.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-2xl bg-[#FFFDF8]/40 space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto animate-bounce" />
                <p className="text-xs">No webhook logs available yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {automationLogs.map(log => {
                  const payloadStr = renderPayload(log.payload);
                  const isExpanded = !!expandedWebhooks[log.id];
                  
                  // Status mappings or styling logic
                  const statusRaw = (log.status || '').toLowerCase();
                  let statusBg = 'bg-neutral-50 border-neutral-200 text-neutral-700';
                  let statusLabel = log.status || 'Success';

                  if (statusRaw === 'success') {
                    statusBg = 'bg-emerald-50 border-emerald-200 text-emerald-800';
                    statusLabel = 'Success';
                  } else if (statusRaw === 'failed' || statusRaw === 'error' || statusRaw === 'fail') {
                    statusBg = 'bg-rose-50 border-rose-200 text-rose-800 animate-pulse';
                    statusLabel = 'Failed';
                  } else if (statusRaw === 'pending') {
                    statusBg = 'bg-amber-50 border-amber-200 text-amber-800';
                    statusLabel = 'Pending';
                  } else if (statusRaw === 'active') {
                    statusBg = 'bg-sky-50 border-sky-200 text-sky-800';
                    statusLabel = 'Active';
                  }

                  // Date format handler preventing invalid dates
                  let dateStr = 'Unknown date';
                  if (log.created_at) {
                    try {
                      const d = new Date(log.created_at);
                      if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'medium'
                        });
                      }
                    } catch (e) {}
                  }

                  return (
                    <div 
                      key={log.id} 
                      className="bg-[#FFFDF8] border border-[#D6B46A]/20 hover:border-[#D6B46A]/45 rounded-2xl p-4 transition-all duration-200 text-xs shadow-xs space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <strong className="text-neutral-900 font-display uppercase tracking-wide text-[11px] block">
                            {log.webhook_type || 'Custom Webhook Notification'}
                          </strong>
                          <span className="text-[10px] text-[#8A8178] font-mono">{dateStr}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-black rounded-lg border ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Webhook Meta Fields Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 py-2 border-t border-b border-dashed border-[#D6B46A]/10 text-[11px] text-neutral-800 font-medium">
                        <div>
                          <span className="text-[9px] font-mono text-[#8A8178] block uppercase">Target API URL</span>
                          <span className="truncate block select-all" title={log.target_url || 'https://api.telegram.org'}>
                            {log.target_url || '/api/v1/automate'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-[#8A8178] block uppercase">Response Header</span>
                          <span className="font-mono">
                            HTTP {log.response_code || (statusRaw === 'success' ? '200' : '400')}
                          </span>
                        </div>
                      </div>

                      {/* Error Message if failed */}
                      {log.error_message && (
                        <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl text-rose-700 text-[11px] font-medium leading-relaxed">
                          <span className="font-bold text-[9px] font-mono uppercase tracking-widest block text-rose-500 mb-0.5">Delivery Error Context</span>
                          {log.error_message}
                        </div>
                      )}

                      {/* Actions Box */}
                      <div className="flex items-center justify-between gap-4 pt-1">
                        <button 
                          onClick={() => toggleExpandWebhook(log.id)}
                          className="text-[#BFA15A] hover:text-[#111111] font-mono font-black text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isExpanded ? 'Hide Payload' : 'Show Payload Details'}
                        </button>
                        <button 
                          onClick={() => handleCopyPayload(log.id, payloadStr)}
                          className="px-2 py-1 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedWebhookId === log.id ? 'Copied!' : 'Copy JSON'}
                        </button>
                      </div>

                      {/* Expanded Section for Payload with high-contrast text */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-1">
                              <span className="text-[9px] font-mono text-[#8A8178] uppercase block font-bold">Payload JSON Representation:</span>
                              <pre 
                                className="p-3 bg-neutral-900 border border-neutral-800 text-[#F5F5F5] font-mono text-[10px] leading-relaxed rounded-xl overflow-x-auto max-h-[250px] scrollbar-thin shadow-inner block select-all whitespace-pre"
                                style={{ color: '#E0E0E0' }}
                              >
                                {payloadStr}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Crawler user agents tracking logs */}
          <div className="lg:col-span-6 bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111]">Robot Crawler Analytics</h4>
                <p className="text-[11px] text-[#8A8178] mt-0.5">Verified backend audit trace of standard SEO spiders and previews</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-850 rounded-full font-mono font-bold text-[9px] tracking-wide">
                {botVisits.length} Agents
              </span>
            </div>

            {botVisits.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-2xl bg-[#FFFDF8]/40 space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-xs">No crawler activity detected yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#D6B46A]/10 max-h-[550px] overflow-y-auto pr-1">
                {botVisits.map(bot => {
                  let dateStr = 'Just now';
                  if (bot.lastSeenAt) {
                    try {
                      const d = new Date(bot.lastSeenAt);
                      if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'medium'
                        });
                      }
                    } catch (e) {}
                  }

                  return (
                    <div key={bot.id} className="py-3.5 space-y-2 text-xs hover:bg-[#FFFDF8]/30 px-1 rounded-xl transition-all duration-150">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-neutral-900 tracking-tight text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
                            {bot.botName || 'Generic Bot'}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono italic block">{bot.pagePath || '/'}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-[#BFA15A] text-[9px] font-mono uppercase font-black rounded-lg">
                          {bot.category || 'Unknown Bot'}
                        </span>
                      </div>

                      <div className="p-2 bg-neutral-50 border border-neutral-200/55 rounded-xl space-y-1">
                        <span className="text-[8px] font-mono text-[#8A8178] block uppercase tracking-wider">Device Agent Match</span>
                        <p className="text-[10px] text-neutral-700 font-mono tracking-tight leading-normal select-all select-text">{bot.userAgent}</p>
                      </div>

                      <div className="flex justify-between text-[10px] text-neutral-500 font-mono font-medium pt-1">
                        <span>Masked Client IP: <strong className="text-neutral-800 select-all">{bot.ipHash || 'unknown'}</strong></span>
                        <span>Active Seen: <strong className="text-neutral-800">{dateStr}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- ADMINS MANAGEMENT ROLES SYSTEM --- */}
      {subTab === 'team' && (
        <div className="space-y-4 text-left" id="subtab-team-view">
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">Admins and Roles System</h4>
              <p className="text-[11px] text-[#8A8178] mt-0.5">Role-Based Access Control logic configured to protect critical features</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#D6B46A]/15 text-[#8A8178] text-[9px] font-mono uppercase tracking-wider text-left">
                    <th className="py-3 px-4">Executive name</th>
                    <th className="py-3 px-4">Assigned Role Controls</th>
                    <th className="py-3 px-4">Account status</th>
                    <th className="py-3 px-4">Log in activity</th>
                    <th className="py-3 px-4 text-right">Authorize updates</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(user => (
                    <tr key={user.id} className="border-b border-neutral-100 hover:bg-[#FFFDF8]/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#111111]">{user.name}</td>
                      <td className="py-3 px-4">
                        <CustomSelect 
                          value={user.role}
                          onChange={(val) => handleRoleChange(user.id, val as any)}
                          options={['Super Admin', 'Admin', 'Content Editor', 'Sales Manager', 'Career Manager', 'Viewer']}
                          className="w-40"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase font-black rounded ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-[#8A8178]'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#8A8178]">
                        {user.lastLogin === 'Never' ? 'Disabled Account' : new Date(user.lastLogin).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => handleTeamMemberToggle(user.id)}
                          className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                            user.status === 'Active' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {user.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Team Member Entry Module */}
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">Register New Executive Member</h4>
              <p className="text-[11px] text-[#8A8178] mt-0.5">Authorize additional managers or specialists with granular Access Controls</p>
            </div>
            
            <form onSubmit={handleAddNewMember} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-3 col-span-12">
                <label className="text-[9px] uppercase font-bold text-[#8A8178] block mb-1.5">Executive Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Devashish Sharma"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl text-xs outline-none focus:border-[#D6B46A] text-matte-black font-semibold" 
                />
              </div>
              <div className="md:col-span-3 col-span-12">
                <label className="text-[9px] uppercase font-bold text-[#8A8178] block mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. devashish@samaxon.site"
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl text-xs outline-none focus:border-[#D6B46A] text-matte-black font-semibold" 
                />
              </div>
              <div className="md:col-span-2 col-span-12">
                <label className="text-[9px] uppercase font-bold text-[#8A8178] block mb-1.5">Access Password</label>
                <div className="relative">
                  <input 
                    type={showNewMemberPassword ? "text" : "password"} 
                    required
                    placeholder="Min 6 characters"
                    value={newMemberPassword}
                    onChange={e => setNewMemberPassword(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl text-xs outline-none focus:border-[#D6B46A] text-matte-black font-semibold" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewMemberPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#8A8178]/65 hover:text-[#D6B46A]"
                  >
                    {showNewMemberPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 col-span-12">
                <label className="text-[9px] uppercase font-bold text-[#8A8178] block mb-1.5">Select Role Control</label>
                <CustomSelect 
                  value={newMemberRole}
                  onChange={val => setNewMemberRole(val as any)}
                  options={['Super Admin', 'Admin', 'Content Editor', 'Sales Manager', 'Career Manager', 'Viewer']}
                />
              </div>
              <div className="md:col-span-2 col-span-12">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#111111] text-[#D6B46A] hover:text-white hover:bg-[#222222] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  Add Member
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* --- MASTER BRAND CONFIGS & SEO --- */}
      {subTab === 'brand' && (
        <form 
          onSubmit={e => { 
            e.preventDefault(); 
            onUpdateWebsiteSettings(localSettings);
            showToast('Master branding, logo & SEO settings successfully saved to system registry!', 'success'); 
          }} 
          className="space-y-6 text-left" 
          id="subtab-brand-view"
        >
          {/* Master Logo & Brand Crest Studio */}
          <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="logo-customizer-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B46A]/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/15 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A] shadow-inner">
                  <Crown className="w-5 h-5 fill-[#D6B46A]/20" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#BFA15A] block">
                    Identity Customization Hub
                  </span>
                  <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-wide">
                    Website Logo & PWA App Icon
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLocalSettings(prev => ({
                      ...prev,
                      logoUrl: 'S',
                      logoType: 'monogram',
                      logoText: 'S',
                      faviconUrl: '/favicon.svg'
                    }));
                    showToast('Logo restored to default imperial monogram', 'info');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:border-[#D6B46A]/50 bg-neutral-50 hover:bg-white text-neutral-700 hover:text-neutral-900 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Revert back to default SamaXon luxury monogram"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#BFA15A]" />
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Mode selection toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
              <button
                type="button"
                onClick={() => setLocalSettings(prev => ({ ...prev, logoType: 'monogram' }))}
                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  (localSettings.logoType || 'monogram') === 'monogram'
                    ? 'bg-[#111111] text-[#D6B46A] shadow-md'
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>Monogram Typography Crest (S)</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings(prev => ({ ...prev, logoType: 'image' }))}
                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  localSettings.logoType === 'image'
                    ? 'bg-[#111111] text-[#D6B46A] shadow-md'
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Custom Image / Vector Logo</span>
              </button>
            </div>

            {/* Controls depending on mode */}
            {localSettings.logoType === 'image' ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload drag/click */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1.5">
                      Upload Logo File (PNG, SVG, JPG, WebP)
                    </label>
                    <label className="border-2 border-dashed border-[#D6B46A]/35 hover:border-[#D6B46A] bg-[#FFFDF8] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#D6B46A]/5 text-center group min-h-[140px]">
                      <Upload className="w-7 h-7 text-[#D6B46A] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#111111]">Click to Browse or Drag File Here</span>
                      <span className="text-[10px] text-[#8A8178] font-mono mt-1">Recommended: Transparent PNG or SVG (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/png, image/svg+xml, image/jpeg, image/webp"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setLocalSettings(prev => ({
                                  ...prev,
                                  logoUrl: result,
                                  logoType: 'image'
                                }));
                                showToast('Logo image uploaded successfully!', 'success');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Or enter Direct Image Web URL */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1.5">
                        Or Enter Direct Logo Image URL / Path
                      </label>
                      <input
                        type="text"
                        placeholder="https://.../logo.png or /logo.png or /favicon.svg"
                        value={localSettings.logoUrl && localSettings.logoUrl.startsWith('data:') ? 'Custom File Uploaded (Ready)' : (localSettings.logoUrl || '')}
                        onChange={e => setLocalSettings(prev => ({
                          ...prev,
                          logoUrl: e.target.value,
                          logoType: 'image'
                        }))}
                        className="w-full px-3.5 py-2.5 border border-[#D6B46A]/25 bg-[#FFFDF8] rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-[#D6B46A]"
                      />
                      <span className="text-[10px] text-[#8A8178] block mt-1.5">
                        Can be an external URL (`https://...`), an internal asset (`/favicon.svg`, `/logo.png`), or uploaded image.
                      </span>
                    </div>

                    <div className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[11px] text-amber-950 leading-relaxed">
                      💡 <strong>Studio Standard:</strong> For the cleanest aesthetic, use a transparent vector PNG or SVG with gold or white contrast.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1.5">
                    Monogram Letter / Short Initials (1-3 Characters)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={localSettings.logoText || (localSettings.logoUrl && localSettings.logoUrl.length <= 4 ? localSettings.logoUrl : 'S')}
                    onChange={e => {
                      const val = e.target.value.toUpperCase();
                      setLocalSettings(prev => ({
                        ...prev,
                        logoText: val,
                        logoUrl: val,
                        logoType: 'monogram'
                      }));
                    }}
                    placeholder="S"
                    className="w-full px-3.5 py-2.5 border border-[#D6B46A]/25 bg-[#FFFDF8] rounded-xl text-sm font-display font-black tracking-wider text-[#111111]"
                  />
                  <span className="text-[10px] text-[#8A8178] block mt-1">
                    Displayed in the royal champagne gold beveled emblem on matte black.
                  </span>
                </div>

                <div className="p-4 bg-neutral-900 text-neutral-100 rounded-2xl border border-[#D6B46A]/30 flex items-center justify-between shadow-md">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#D6B46A] uppercase font-bold tracking-widest block">Current Monogram Style</span>
                    <p className="text-xs text-neutral-300">Imperial Gold Typography on Matte Black Canvas with subtle gold rim.</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black border border-[#D6B46A]/60 flex items-center justify-center font-display font-bold text-xl text-[#D6B46A] shadow-lg shrink-0">
                    {localSettings.logoText || (localSettings.logoUrl && localSettings.logoUrl.length <= 4 ? localSettings.logoUrl : 'S')}
                  </div>
                </div>
              </div>
            )}

            {/* PWA App Icon & Favicon Section */}
            <div className="pt-4 border-t border-[#D6B46A]/15 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A8178] block">
                    PWA Installed App Icon & Favicon Source
                  </label>
                  <span className="text-[10px] text-[#8A8178] block">
                    The icon that appears on Android/iOS home screens when the user installs the app.
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-mono text-[9px] font-bold uppercase">
                  PWA Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={localSettings.faviconUrl || '/favicon.svg'}
                    onChange={e => setLocalSettings(prev => ({ ...prev, faviconUrl: e.target.value }))}
                    placeholder="/favicon.svg"
                    className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-4 flex items-center gap-2">
                  <label className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Icon</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setLocalSettings(prev => ({ ...prev, faviconUrl: result }));
                              showToast('Favicon/App Icon updated!', 'success');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Interactive Logo Drag & Scale Studio */}
            <div className="pt-4 border-t border-[#D6B46A]/15">
              <InteractiveLogoEditor
                settings={localSettings}
                onChange={(updated) => setLocalSettings(updated)}
                onSave={(updated) => {
                  setLocalSettings(updated);
                  onUpdateWebsiteSettings(updated);
                  showToast('Logo positioning settings saved and applied!', 'success');
                }}
              />
            </div>
          </div>
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block border-b border-[#D6B46A]/10 pb-1.5">Master Branding Settings</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Corporate Studio Brand Name</label>
                <input 
                  type="text" 
                  value={localSettings.brandName || ''}
                  onChange={e => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">General Inquiries & Business Email</label>
                <input 
                  type="email" 
                  value={localSettings.contactEmail || ''}
                  placeholder="contact@samaxon.site"
                  onChange={e => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Primary public contact channel for project quotes</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Customer Support Email</label>
                <input 
                  type="email" 
                  value={localSettings.supportEmail || ''}
                  placeholder="support@samaxon.site"
                  onChange={e => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Dedicated SLA support & ongoing client care</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Executive Founder Email</label>
                <input 
                  type="email" 
                  value={localSettings.founderEmail || ''}
                  placeholder="founder@samaxon.site"
                  onChange={e => setLocalSettings({ ...localSettings, founderEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Used strictly for executive partnerships & founder correspondence</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Talent & Careers Email</label>
                <input 
                  type="email" 
                  value={localSettings.careersEmail || ''}
                  placeholder="careers@samaxon.site"
                  onChange={e => setLocalSettings({ ...localSettings, careersEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Job applications & consultant recruitment</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">WhatsApp Business Number</label>
                <input 
                  type="text" 
                  value={localSettings.phoneWhatsapp || ''}
                  placeholder="+91 8076874034"
                  onChange={e => setLocalSettings({ ...localSettings, phoneWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Used for instant WhatsApp chat & inquiry redirection</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Direct Call Mobile Number (Realme / Studio Call)</label>
                <input 
                  type="text" 
                  value={localSettings.directPhone || ''}
                  placeholder="+91 8076874034"
                  onChange={e => setLocalSettings({ ...localSettings, directPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Displayed in Mobile Drawer Consultation & Direct Calling across website</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">City & Delivery Region</label>
                <input 
                  type="text" 
                  value={localSettings.cityRegion || ''}
                  placeholder="Delhi-NCR, India · Global Delivery"
                  onChange={e => setLocalSettings({ ...localSettings, cityRegion: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Displayed in Mobile Drawer, Footer, and Header quick cards</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Telegram Ingress Link</label>
                <input 
                  type="text" 
                  value={localSettings.telegramLink || ''}
                  onChange={e => setLocalSettings({ ...localSettings, telegramLink: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">LinkedIn Corporate Link</label>
                <input 
                  type="text" 
                  value={localSettings.linkedinLink || ''}
                  onChange={e => setLocalSettings({ ...localSettings, linkedinLink: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Instagram Handle Link</label>
                <input 
                  type="text" 
                  value={localSettings.instagramLink || ''}
                  onChange={e => setLocalSettings({ ...localSettings, instagramLink: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Hashed HQ Office Address</label>
                <input 
                  type="text" 
                  value={localSettings.address || ''}
                  onChange={e => setLocalSettings({ ...localSettings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              {/* Trust Builders Stats Block */}
              <div className="col-span-1 md:col-span-2 border-t border-[#D6B46A]/10 pt-4 mt-2">
                <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#BFA15A] block mb-3 font-mono">Trust Builder Stats Counters (Homepage)</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[8.5px] uppercase font-bold text-[#8A8178] block mb-1">Total Projects</label>
                    <input 
                      type="text" 
                      value={localSettings.statTotalProjects || ''}
                      onChange={e => setLocalSettings({ ...localSettings, statTotalProjects: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-lg font-bold font-mono text-[10px]" 
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] uppercase font-bold text-[#8A8178] block mb-1">Active Clients</label>
                    <input 
                      type="text" 
                      value={localSettings.statActiveClients || ''}
                      onChange={e => setLocalSettings({ ...localSettings, statActiveClients: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-lg font-bold font-mono text-[10px]" 
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] uppercase font-bold text-[#8A8178] block mb-1">Team Members</label>
                    <input 
                      type="text" 
                      value={localSettings.statTeamMembers || ''}
                      onChange={e => setLocalSettings({ ...localSettings, statTeamMembers: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-lg font-bold font-mono text-[10px]" 
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] uppercase font-bold text-[#8A8178] block mb-1">Industries Served</label>
                    <input 
                      type="text" 
                      value={localSettings.statIndustriesServed || ''}
                      onChange={e => setLocalSettings({ ...localSettings, statIndustriesServed: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-lg font-bold font-mono text-[10px]" 
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[8.5px] uppercase font-bold text-[#8A8178] block mb-1">Years Experience</label>
                    <input 
                      type="text" 
                      value={localSettings.statYearsExperience || ''}
                      onChange={e => setLocalSettings({ ...localSettings, statYearsExperience: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-lg font-bold font-mono text-[10px]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block border-b border-[#D6B46A]/10 pb-1.5">SEO Master Parameters Configuration</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs col-span-2">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Global Meta title context</label>
                <input 
                  type="text" 
                  value={localSettings.defaultSeoTitle || ''}
                  onChange={e => setLocalSettings({ ...localSettings, defaultSeoTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Global Meta description content</label>
                <textarea 
                  rows={2}
                  value={localSettings.defaultSeoDescription || ''}
                  onChange={e => setLocalSettings({ ...localSettings, defaultSeoDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold leading-relaxed" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#D6B46A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#8A8178]">
                <strong>Maintenance Mode Active:</strong> {localSettings.maintenanceMode ? 'Blocked Ingress' : 'Active Live Studio'}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    const nextMaintenance = !localSettings.maintenanceMode;
                    const updated = { ...localSettings, maintenanceMode: nextMaintenance };
                    setLocalSettings(updated);
                    onUpdateWebsiteSettings(updated);
                    showToast(`Maintenance Mode is now ${nextMaintenance ? 'Active (Blocked Ingress)' : 'Inactive (Active Live Studio)'}`, 'info');
                  }}
                  className={`px-3.5 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    localSettings.maintenanceMode 
                      ? 'bg-amber-100/70 text-amber-800 border-amber-300 shadow-sm' 
                      : 'bg-[#FFFDF8] text-[#8A8178] hover:text-[#111111] border-[#D6B46A]/20 hover:border-[#D6B46A]'
                  }`}
                >
                  Toggle Maintenance Mode
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#111111] hover:bg-neutral-800 text-[#D6B46A] hover:text-white border border-[#111111] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  Save Brand Settings
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* --- AUDIT TIMELINE EVENT LOG MATRIX --- */}
      {subTab === 'audit' && (
        <div className="space-y-4 text-left" id="subtab-audit-view">
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D6B46A]/10 pb-4">
              <div>
                <h4 className="font-display font-black text-sm text-[#111111] uppercase tracking-wider">Chronological Audit Operations Index</h4>
                <p className="text-xs text-[#8A8178] mt-0.5">Verified changes compiled inside master terminal frameworks</p>
              </div>
              <div className="flex items-center gap-2.5">
                <input 
                  type="text" 
                  placeholder="Filter by keyword..."
                  value={searchAudit}
                  onChange={e => {
                    setSearchAudit(e.target.value);
                    setAuditCurrentPage(1);
                  }}
                  className="px-3.5 py-2 bg-[#FFFDF8] border border-[#D6B46A]/20 focus:border-[#D6B46A] rounded-xl text-xs outline-none w-full sm:w-60 transition-all shadow-inner" 
                />
              </div>
            </div>

            {/* Event Category Filter Rail */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-[10px] font-mono font-bold uppercase tracking-wider">
              {[
                { id: 'ALL', label: 'All Events' },
                { id: 'LOGIN', label: 'Sessions & Auth' },
                { id: 'UPDATE', label: 'Content Updates' },
                { id: 'LEAD', label: 'Leads & Careers' },
                { id: 'PAGE_VIEW', label: 'Page Traffic' },
                { id: 'SETTINGS', label: 'Brand & Config' },
                { id: 'BOT', label: 'Bot & Security' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setAuditEventFilter(cat.id as any);
                    setAuditCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer ${
                    auditEventFilter === cat.id
                      ? 'bg-[#111111] text-white shadow'
                      : 'bg-[#FFFDF8] text-[#8A8178] border border-[#D6B46A]/15 hover:text-[#111111] hover:border-[#D6B46A]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scroll-contained Table: max-h-[420px] overflow-y-auto */}
            <div className="border border-[#D6B46A]/15 rounded-2xl overflow-hidden bg-[#FFFDF8]/30">
              <div className="max-h-[420px] overflow-y-auto overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[600px]">
                  <thead className="sticky top-0 bg-[#FFFDF8] border-b border-[#D6B46A]/15 z-10 shadow-xs">
                    <tr className="text-[#8A8178] font-mono text-[9px] uppercase tracking-wider">
                      <th className="py-2.5 px-4 animate-pulse">Session Executor</th>
                      <th className="py-2.5 px-4">Command Action Event</th>
                      <th className="py-2.5 px-4">Affected entity</th>
                      <th className="py-2.5 px-4 text-right">Absolute Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAudits.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-[#8A8178] italic">
                          No audit records match the current filter or query keyword.
                        </td>
                      </tr>
                    ) : (
                      paginatedAudits.map(log => (
                        <tr key={log.id} className="border-b border-neutral-100 hover:bg-[#FFFDF8] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#111111]">{log.adminUserName}</td>
                          <td className="py-3 px-4 text-[#111111]/80 max-w-xs truncate pr-6">{log.description}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#BFA15A] text-[9px] font-mono uppercase font-black rounded">
                              {log.entityType}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[#8A8178] text-right">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-[#8A8178]">
              <div>
                Showing <span className="font-bold text-[#111111]">{paginatedAudits.length}</span> of{' '}
                <span className="font-bold text-[#111111]">{filteredAudits.length}</span> total verified logs
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setAuditCurrentPage(p => Math.max(1, p - 1))}
                  disabled={auditCurrentPage <= 1}
                  className="px-3 py-1.5 rounded-lg border border-[#D6B46A]/20 bg-[#FFFDF8] text-[#111111] text-[10px] font-bold uppercase tracking-wider hover:border-[#D6B46A] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Previous
                </button>
                <span className="px-2 text-[11px] font-bold text-[#111111]">
                  Page {auditCurrentPage} of {auditTotalPages}
                </span>
                <button
                  onClick={() => setAuditCurrentPage(p => Math.min(auditTotalPages, p + 1))}
                  disabled={auditCurrentPage >= auditTotalPages}
                  className="px-3 py-1.5 rounded-lg border border-[#D6B46A]/20 bg-[#FFFDF8] text-[#111111] text-[10px] font-bold uppercase tracking-wider hover:border-[#D6B46A] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
