import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Image, BarChart2, ShieldAlert, Users, Radio, History, ClipboardList, Lock, Check, Copy, Upload, Trash2, ShieldCheck, RefreshCw, Eye, BookOpen, AlertCircle
} from 'lucide-react';
import { MediaAsset } from '../../types';
import { BotVisit, AutomationLog, ActivityLog, AdminUser, WebsiteSettings } from '../../utils/mockAdminData';

interface SystemSettingsTabProps {
  mediaAssets: MediaAsset[];
  botVisits: BotVisit[];
  automationLogs: AutomationLog[];
  activityLogs: ActivityLog[];
  adminUsers: AdminUser[];
  websiteSettings: WebsiteSettings;
  onUpdateMedia: (assets: MediaAsset[]) => void;
  onUpdateWebsiteSettings: (settings: WebsiteSettings) => void;
  onUpdateAdminUsers: (users: AdminUser[]) => void;
}

export default function SystemSettingsTab({
  mediaAssets, botVisits, automationLogs, activityLogs, adminUsers, websiteSettings,
  onUpdateMedia, onUpdateWebsiteSettings, onUpdateAdminUsers
}: SystemSettingsTabProps) {
  const [subTab, setSubTab] = useState<'media' | 'analytics' | 'botlogs' | 'team' | 'brand' | 'audit' | 'profile'>('media');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchAudit, setSearchAudit] = useState('');
  
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
    alert('Simulated Upload complete in Supabase bucket! Path: ' + item.url);
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Delete this media file?')) {
      onUpdateMedia(mediaAssets.filter(m => m.id !== id));
    }
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
  const filteredAudits = activityLogs.filter(log => 
    log.adminUserName.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.description.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.actionType.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchAudit.toLowerCase())
  );

  return (
    <div className="space-y-6" id="system-settings-manager">
      
      {/* Title Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Hardware & Logistics Core</span>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">Systems Remote Control</h2>
        </div>

        {/* System Subtab Navigator */}
        <div className="flex flex-wrap bg-[#FFFDF8] border border-[#D6B46A]/20 p-1 rounded-xl text-[10px] font-mono font-bold tracking-widest uppercase" id="system-sub-navigator">
          {[
            { id: 'media', label: 'Media Library', icon: Image },
            { id: 'analytics', label: 'Full Analytics', icon: BarChart2 },
            { id: 'botlogs', label: 'Webhooks & Bot logs', icon: ShieldAlert },
            { id: 'team', label: 'Team Roles', icon: Users },
            { id: 'brand', label: 'SEO Settings', icon: Radio },
            { id: 'audit', label: 'Activity Audit', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  subTab === tab.id 
                    ? 'bg-[#111111] text-white' 
                    : 'text-[#8A8178] hover:text-[#111111]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
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
                { label: 'Page Views', count: 18450, rate: '74% of traffic' },
                { label: 'Form Starts', count: 480, rate: 'new clients' },
                { label: 'Form Submits', count: 58, rate: '12% success funnel' },
                { label: 'WhatsApp clickouts', count: 290, rate: 'instant bypass' }
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
                {[
                  { source: 'Direct Search Ingress (Organic)', pct: 54 },
                  { source: 'Linked In Referral Engine (Enterprise)', pct: 28 },
                  { source: 'Telegram Consulting Networks', pct: 15 },
                  { source: 'Google Ads campaigns', pct: 3 }
                ].map(src => (
                  <div key={src.source} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-neutral-800">
                      <span className="font-medium">{src.source}</span>
                      <span className="font-mono font-bold text-[#D6B46A]">{src.pct}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#D6B46A] h-full rounded-full" style={{ width: `${src.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- WEBHOOK AUTOMATIONS & BOT LOGS --- */}
      {subTab === 'botlogs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="subtab-botlogs-view">
          
          {/* Telegram bots webhook logs */}
          <div className="lg:col-span-6 bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">Automation Webhook Transaction Logs</h4>
              <p className="text-[11px] text-[#8A8178] mt-0.5">Future CRM bridges and target Telegram logs emulations</p>
            </div>

            <div className="space-y-4">
              {automationLogs.map(log => (
                <div key={log.id} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-neutral-800 font-display uppercase text-[10px] tracking-wide">{log.automationType}</strong>
                    <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-extrabold rounded ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700 animate-pulse'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="font-semibold text-neutral-800">{log.triggerEvent}</p>
                  <pre className="p-2.5 bg-neutral-900 border border-neutral-800 text-[#FFFDF8] text-[9px] font-mono rounded-lg overflow-x-auto">
                    {log.payloadSummary}
                  </pre>
                  {log.errorMessage && <p className="text-[10px] text-rose-600 font-bold">Error: {log.errorMessage}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Crawler user agents tracking logs */}
          <div className="lg:col-span-6 bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">Robot Crawler user agent indexes</h4>
              <p className="text-[11px] text-[#8A8178] mt-0.5">Isolated crawler agent hits comparing SEO indexes</p>
            </div>

            <div className="divide-y divide-neutral-100">
              {botVisits.map(bot => (
                <div key={bot.id} className="py-3.5 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-900">{bot.botName}</span>
                    <span className="px-1.5 py-0.5 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#BFA15A] text-[9px] font-mono uppercase font-black rounded">
                      {bot.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8A8178] font-mono tracking-tight leading-normal truncate">{bot.userAgent}</p>
                  <div className="flex justify-between text-[10px] text-[#8A8178]">
                    <span>Masked IP: {bot.ipHash} • hits: <strong>{bot.visitCount}</strong></span>
                    <span>Last Active: {new Date(bot.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
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
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className="px-2 py-1 bg-white border border-[#D6B46A]/20 text-[11px] text-[#111111] font-semibold rounded outline-none"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Admin">Admin</option>
                          <option value="Content Editor">Content Editor</option>
                          <option value="Sales Manager">Sales Manager</option>
                          <option value="Career Manager">Career Manager</option>
                          <option value="Viewer">Viewer</option>
                        </select>
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
        </div>
      )}

      {/* --- MASTER BRAND CONFIGS & SEO --- */}
      {subTab === 'brand' && (
        <form onSubmit={e => { e.preventDefault(); alert('Master web setting applied successfully!'); }} className="space-y-6 text-left" id="subtab-brand-view">
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block border-b border-[#D6B46A]/10 pb-1.5">Master Branding Settings</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Corporate Studio Brand Name</label>
                <input 
                  type="text" 
                  value={websiteSettings.brandName}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, brandName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Brand Contact Endpoint email</label>
                <input 
                  type="email" 
                  value={websiteSettings.contactEmail}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Phone / WhatsApp coordinate</label>
                <input 
                  type="text" 
                  value={websiteSettings.phoneWhatsapp}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, phoneWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Telegram Ingress Link</label>
                <input 
                  type="text" 
                  value={websiteSettings.telegramLink}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, telegramLink: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Hashed HQ Office Address</label>
                <input 
                  type="text" 
                  value={websiteSettings.address}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
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
                  value={websiteSettings.defaultSeoTitle}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, defaultSeoTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold" 
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Global Meta description content</label>
                <textarea 
                  rows={2}
                  value={websiteSettings.defaultSeoDescription}
                  onChange={e => onUpdateWebsiteSettings({ ...websiteSettings, defaultSeoDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6B46A]/20 bg-[#FFFDF8] rounded-xl font-semibold leading-relaxed" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#D6B46A]/15 flex items-center justify-between">
              <div className="text-xs text-[#8A8178]">
                <strong>Maintenance Mode Active:</strong> {websiteSettings.maintenanceMode ? 'Blocked Ingress' : 'Active Live Studio'}
              </div>
              <button 
                type="button"
                onClick={() => onUpdateWebsiteSettings({ ...websiteSettings, maintenanceMode: !websiteSettings.maintenanceMode })}
                className={`px-3.5 py-1.5 border rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  websiteSettings.maintenanceMode 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-white text-[#BFA15A] border-[#D6B46A]/20 hover:border-[#D6B46A]'
                }`}
              >
                Toggle maintenance Mode
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- AUDIT TIMELINE EVENT LOG MATRIX --- */}
      {subTab === 'audit' && (
        <div className="space-y-4 text-left" id="subtab-audit-view">
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-black text-sm text-[#111111] uppercase tracking-wider">Chronological Audit Operations Index</h4>
                <p className="text-xs text-[#8A8178] mt-0.5">Search and view verified changes compiled inside master frameworks</p>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter by keyword..."
                  value={searchAudit}
                  onChange={e => setSearchAudit(e.target.value)}
                  className="px-3.5 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/20 focus:border-[#D6B46A] rounded-xl text-xs outline-none w-52" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#D6B46A]/12 text-[#8A8178] font-mono text-[9px] uppercase tracking-wider">
                    <th className="py-2.5 px-4 animate-pulse">Session Executor</th>
                    <th className="py-2.5 px-4">Command Action Event</th>
                    <th className="py-2.5 px-4">Affected entity</th>
                    <th className="py-2.5 px-4 text-right">Absolute Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-[#8A8178] italic">No logs match query keyword.</td>
                    </tr>
                  ) : (
                    filteredAudits.map(log => (
                      <tr key={log.id} className="border-b border-neutral-100 hover:bg-[#FFFDF8]/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#111111]">{log.adminUserName}</td>
                        <td className="py-3 px-4 text-[#111111]/80 pr-12">{log.description}</td>
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
        </div>
      )}

    </div>
  );
}
