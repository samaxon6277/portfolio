import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, Clock, Search, 
  ExternalLink, MessageSquare, Phone, Mail, Globe, Wrench, 
  Trash2, RefreshCw, Filter, ArrowUpRight, Terminal, Check, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteAuditLead } from '../../types';
import { supabaseService } from '../../utils/supabaseService';

interface AuditLeadsTabProps {
  onLeadCountChange?: (count: number) => void;
}

export default function AuditLeadsTab({ onLeadCountChange }: AuditLeadsTabProps) {
  const [leads, setLeads] = useState<WebsiteAuditLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'in_progress' | 'fixed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent_48h' | 'high' | 'standard'>('all');
  const [selectedLead, setSelectedLead] = useState<WebsiteAuditLead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // 1. Fetch from supabase service (handles Supabase + localStorage fallback)
      const data = await supabaseService.getWebsiteAuditLeads();

      // 2. Also query server API to merge any in-memory leads
      try {
        const res = await fetch('/api/admin/audit-leads');
        const json = await res.json();
        if (json.success && Array.isArray(json.leads)) {
          const map = new Map<string, WebsiteAuditLead>();
          data.forEach(d => map.set(d.id, d));
          json.leads.forEach((l: any) => {
            const mapped: WebsiteAuditLead = {
              id: l.id,
              ticketNumber: l.ticket_number || l.ticketNumber || 'AUDIT-000',
              clientName: l.client_name || l.clientName || 'Anonymous',
              businessName: l.business_name || l.businessName,
              email: l.email,
              phone: l.phone,
              websiteUrl: l.website_url || l.websiteUrl,
              overallScore: l.overall_score || l.overallScore || 50,
              securityScore: l.security_score || l.securityScore || 50,
              seoScore: l.seo_score || l.seoScore || 50,
              codeScore: l.code_score || l.codeScore || 50,
              performanceScore: l.performance_score || l.performanceScore || 50,
              criticalIssuesCount: l.critical_issues_count || l.criticalIssuesCount || 0,
              warningIssuesCount: l.warning_issues_count || l.warningIssuesCount || 0,
              topIssues: l.top_issues || l.topIssues || [],
              missingKeywords: l.missing_keywords || l.missingKeywords || [],
              animationIssues: l.animation_issues || l.animationIssues || [],
              internalPages: l.internal_pages || l.internalPages || [],
              clientNotes: l.client_notes || l.clientNotes,
              priority: l.priority || 'standard',
              status: l.status || 'new',
              createdAt: l.created_at || l.createdAt || new Date().toISOString()
            };
            map.set(mapped.id, mapped);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setLeads(merged);
          if (onLeadCountChange) onLeadCountChange(merged.filter(m => m.status === 'new').length);
          setLoading(false);
          return;
        }
      } catch {}

      setLeads(data);
      if (onLeadCountChange) onLeadCountChange(data.filter(m => m.status === 'new').length);
    } catch (err) {
      console.warn('Failed fetching audit leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const handleUpdate = () => fetchLeads();
    window.addEventListener('samaxon_audit_leads_updated', handleUpdate);
    return () => window.removeEventListener('samaxon_audit_leads_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateStatus = async (lead: WebsiteAuditLead, nextStatus: WebsiteAuditLead['status']) => {
    setIsUpdating(true);
    const updated = { ...lead, status: nextStatus };
    try {
      await supabaseService.upsertWebsiteAuditLead(updated);
      try {
        await fetch(`/api/admin/audit-leads/${lead.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });
      } catch {}

      setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
      if (selectedLead?.id === lead.id) {
        setSelectedLead(updated);
      }
      showToast(`Ticket status updated to "${nextStatus.replace('_', ' ').toUpperCase()}".`);
    } catch (err) {
      console.error('Failed to update lead status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this website audit ticket?')) return;
    try {
      await supabaseService.deleteWebsiteAuditLead(leadId);
      try {
        await fetch(`/api/admin/audit-leads/${leadId}`, { method: 'DELETE' });
      } catch {}
      setLeads(prev => prev.filter(l => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      showToast('Ticket removed.');
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.websiteUrl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.ticketNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const urgentCount = leads.filter(l => l.priority === 'urgent_48h' && l.status !== 'fixed').length;
  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-mono font-bold flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B46A] font-bold block">
            Client Diagnostic Pipeline
          </span>
          <h2 className="font-display font-black text-2xl text-[#111111] tracking-tight flex items-center gap-2.5">
            <span>Website Bug Reports &amp; 48h Fix Requests</span>
            {newCount > 0 && (
              <span className="px-2.5 py-0.5 bg-rose-500 text-white rounded-full text-xs font-mono font-bold animate-pulse">
                {newCount} New
              </span>
            )}
          </h2>
          <p className="text-xs text-[#8A8178] mt-1">
            Submissions received from the Website Security &amp; Code Analyzer tool with requested remediation.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-[#FFFDF8] hover:bg-[#F4EFE6] border border-[#D6B46A]/30 text-[#111111] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#BFA15A] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D6B46A]/20 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">Total Ingested</span>
          <div className="text-2xl font-black font-display text-[#111111] my-1">{leads.length}</div>
          <span className="text-[10px] text-[#8A8178]">Audit diagnostic tickets</span>
        </div>

        <div className="bg-white border border-rose-500/20 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-rose-600 block">48-Hour Emergency SLA</span>
          <div className="text-2xl font-black font-display text-rose-700 my-1">{urgentCount}</div>
          <span className="text-[10px] text-rose-500 font-medium">Critical rapid turnarounds</span>
        </div>

        <div className="bg-white border border-amber-500/20 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-700 block">Pending Triage</span>
          <div className="text-2xl font-black font-display text-amber-800 my-1">{newCount}</div>
          <span className="text-[10px] text-amber-600">Awaiting engineer contact</span>
        </div>

        <div className="bg-white border border-emerald-500/20 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 block">Completed &amp; Fixed</span>
          <div className="text-2xl font-black font-display text-emerald-800 my-1">
            {leads.filter(l => l.status === 'fixed').length}
          </div>
          <span className="text-[10px] text-emerald-600">Successfully resolved</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D6B46A]/20 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A8178] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, website URL, phone, or ticket #..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-xs text-[#111111] placeholder:text-[#8A8178]/70 focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-xs font-mono text-[#111111] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Unread)</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="fixed">Fixed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F4EFE6]/40 border border-[#D6B46A]/30 rounded-xl text-xs font-mono text-[#111111] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent_48h">🚀 Urgent 48h SLA</option>
            <option value="high">⚡ High Priority</option>
            <option value="standard">🛠️ Standard</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Full-Width Table & Expansive Modal/View */}
      <div className="space-y-4">
        {/* Leads Table */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-[#8A8178] bg-white rounded-3xl border border-[#D6B46A]/20">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#D6B46A]" />
              Loading audit lead database...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8A8178] bg-white rounded-3xl border border-[#D6B46A]/20">
              No audit bug submissions matched your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLeads.map(lead => {
                const isSelected = selectedLead?.id === lead.id;
                const isUrgent = lead.priority === 'urgent_48h';
                const isNew = lead.status === 'new';

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white text-left flex flex-col justify-between space-y-4 hover:shadow-md ${
                      isSelected 
                        ? 'border-[#111111] ring-2 ring-[#D6B46A]' 
                        : isNew 
                        ? 'border-amber-400/80 shadow-xs' 
                        : 'border-[#D6B46A]/20 hover:border-[#D6B46A]/60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-xs text-[#111111]">
                            #{lead.ticketNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                            isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-[#F4EFE6] text-[#8A8178]'
                          }`}>
                            {lead.priority.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                            lead.status === 'new' 
                              ? 'bg-amber-100 text-amber-800' 
                              : lead.status === 'fixed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-[#8A8178]">
                          {new Date(lead.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-sm text-[#111111]">
                            {lead.clientName}
                          </span>
                          {lead.businessName && (
                            <span className="text-xs text-[#8A8178]">
                              ({lead.businessName})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#BFA15A] font-mono break-all font-semibold">
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span>{lead.websiteUrl}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/5">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-[9px] font-mono uppercase text-[#8A8178] block leading-tight">Health</span>
                          <span className={`font-display font-black text-sm ${
                            lead.overallScore >= 80 ? 'text-emerald-600' : lead.overallScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {lead.overallScore}/100
                          </span>
                        </div>
                        {lead.criticalIssuesCount !== undefined && (
                          <div>
                            <span className="text-[9px] font-mono uppercase text-rose-600 block leading-tight">Critical</span>
                            <span className="font-display font-black text-sm text-rose-600">
                              {lead.criticalIssuesCount}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] rounded-xl text-xs font-mono font-bold uppercase transition-all"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dedicated Expansive Lead Inspector Modal */}
        <AnimatePresence>
          {selectedLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white border border-[#D6B46A]/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-4xl w-full my-auto text-left space-y-6 max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#D6B46A] font-bold">
                        Website Audit Ticket Details
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        selectedLead.priority === 'urgent_48h' ? 'bg-rose-100 text-rose-800' : 'bg-[#F4EFE6] text-[#8A8178]'
                      }`}>
                        {selectedLead.priority.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800">
                        {selectedLead.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-[#111111]">
                      Ticket #{selectedLead.ticketNumber}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    ✕ Exit Details
                  </button>
                </div>

                {/* Client Coordinates & Website Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                      Client Coordinates
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#D6B46A] shrink-0" />
                        <span className="font-bold text-[#111111] text-sm">{selectedLead.clientName}</span>
                        {selectedLead.businessName && <span className="text-[#8A8178]">({selectedLead.businessName})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#D6B46A] shrink-0" />
                        <a href={`mailto:${selectedLead.email}`} className="text-[#111111] hover:underline font-mono">
                          {selectedLead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D6B46A] shrink-0" />
                        <a href={`tel:${selectedLead.phone}`} className="text-[#111111] hover:underline font-mono">
                          {selectedLead.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                      Audited Web Property
                    </span>
                    <div className="space-y-2">
                      <a 
                        href={selectedLead.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 hover:underline font-mono font-bold flex items-center gap-1.5 break-all"
                      >
                        <Globe className="w-4 h-4 shrink-0 text-blue-500" />
                        <span>{selectedLead.websiteUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                      <div className="text-[11px] font-mono text-[#8A8178]">
                        Submitted on: {new Date(selectedLead.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnostic Score Cards */}
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block mb-2">
                    Diagnostic Performance Scores
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Overall Health</span>
                      <span className={`font-display font-black text-xl ${
                        selectedLead.overallScore >= 80 ? 'text-emerald-600' : selectedLead.overallScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {selectedLead.overallScore}/100
                      </span>
                    </div>
                    <div className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Security</span>
                      <span className="font-display font-black text-xl text-[#111111]">{selectedLead.securityScore}/100</span>
                    </div>
                    <div className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">SEO Rank</span>
                      <span className="font-display font-black text-xl text-[#111111]">{selectedLead.seoScore}/100</span>
                    </div>
                    <div className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Code Cleanliness</span>
                      <span className="font-display font-black text-xl text-[#111111]">{selectedLead.codeScore}/100</span>
                    </div>
                    <div className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#D6B46A]/25">
                      <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Speed &amp; Perf</span>
                      <span className="font-display font-black text-xl text-[#111111]">{selectedLead.performanceScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Remediations / Issues Checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-[#8A8178] block">
                      Remediation Issues Checklist ({selectedLead.topIssues?.length || 0})
                    </span>
                    <span className="text-[11px] font-mono text-rose-600 font-bold">
                      {selectedLead.criticalIssuesCount || 0} Critical · {selectedLead.warningIssuesCount || 0} Warnings
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2 border border-[#D6B46A]/15 rounded-2xl p-3 bg-neutral-50/50">
                    {selectedLead.topIssues && selectedLead.topIssues.length > 0 ? (
                      selectedLead.topIssues.map((issue: any, iIdx: number) => (
                        <div key={iIdx} className="p-3 bg-white rounded-xl border border-[#D6B46A]/20 text-xs space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-[#111111] text-sm">{issue.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                              issue.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                          {issue.description && (
                            <p className="text-xs text-[#554F49] leading-relaxed">
                              {issue.description}
                            </p>
                          )}
                          {issue.recommendation && (
                            <p className="text-xs font-mono text-[#A68936] bg-[#FFFDF8] p-2 rounded-lg border border-[#D6B46A]/20">
                              Recommendation: {issue.recommendation}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[#8A8178] italic p-4 text-center">
                        No specific critical issues logged. General performance optimization requested.
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Notes if present */}
                {selectedLead.clientNotes && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                      Client Brief / Context
                    </span>
                    <p className="text-xs text-[#111111] bg-[#FFFDF8] p-4 rounded-2xl border border-[#D6B46A]/25 leading-relaxed font-sans">
                      {selectedLead.clientNotes}
                    </p>
                  </div>
                )}

                {/* Actions & WhatsApp Outreach */}
                <div className="pt-4 border-t border-[#D6B46A]/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                        Update Ticket Workflow State
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { id: 'new', label: 'Mark as New' },
                          { id: 'contacted', label: 'Contacted' },
                          { id: 'in_progress', label: 'In Progress' },
                          { id: 'fixed', label: '✓ Marked Fixed' }
                        ].map(st => (
                          <button
                            key={st.id}
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(selectedLead, st.id as any)}
                            className={`py-2 px-3.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              selectedLead.status === st.id
                                ? 'bg-[#111111] text-[#D6B46A] ring-1 ring-[#D6B46A]'
                                : 'bg-[#F4EFE6]/60 hover:bg-[#F4EFE6] text-[#111111]'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDelete(selectedLead.id)}
                        className="py-2.5 px-4 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-mono uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Ticket</span>
                      </button>

                      <button
                        onClick={() => setSelectedLead(null)}
                        className="py-2.5 px-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Exit Details
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Direct Outreach */}
                  <a
                    href={`https://wa.me/${(selectedLead.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedLead.clientName}, this is SamaXon Engineering regarding your Website Bug Fix Request #${selectedLead.ticketNumber} for ${selectedLead.websiteUrl}. We've completed our diagnostic assessment and are ready to review the remediation roadmap.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Launch WhatsApp Client Outreach</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
