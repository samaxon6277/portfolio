import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, FileSpreadsheet, Eye, Trash2, Check, Clock, AlertTriangle, 
  User, CheckCircle, XSquare, PlusSquare, ArrowLeft, MessageSquare, Tag, Bookmark
} from 'lucide-react';
import { Lead } from '../../types';
import CustomSelect from '../../components/CustomSelect';
import { useCustomUi } from '../../context/CustomUiContext';

interface LeadsTabProps {
  leads: Lead[];
  onUpdateLead: (updatedLead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function LeadsTab({ leads, onUpdateLead, onDeleteLead }: LeadsTabProps) {
  const { showToast, showConfirm } = useCustomUi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Extra fields helper mapping
  const getLeadPriority = (lead: any) => lead.priority || 'medium';
  const getLeadNotes = (lead: any) => lead.internalNotes || '';
  const getLeadAssigned = (lead: any) => lead.assignedTo || 'Unassigned';

  // Available filters
  const servicesList = ['All', 'Web Development', 'App Development', 'Logo and Identity Design', '8K Graphic Designing', 'Advanced Automations', 'Custom Telegram Bots', 'Admin Dashboard Systems', 'Performance and SEO Optimization'];
  const statusesList = [
    { value: 'All', label: 'All Statuses' },
    { value: 'new', label: 'New Inquiries' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'negotiating', label: 'Qualified / Demo' },
    { value: 'won', label: 'Won / Commissions' },
    { value: 'lost', label: 'Lost / Closed' }
  ];
  const prioritiesList = ['All', 'low', 'medium', 'high', 'urgent'];

  // Filtering logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = selectedService === 'All' || lead.serviceNeeded === selectedService;
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || getLeadPriority(lead) === selectedPriority;

    return matchesSearch && matchesService && matchesStatus && matchesPriority;
  });

  // Simulated CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Business', 'Phone', 'Email', 'City', 'Service', 'Problem', 'Timeline', 'Budget', 'Status', 'Priority', 'Notes', 'Created At'];
    const rows = filteredLeads.map(lead => [
      lead.id,
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.businessName || '').replace(/"/g, '""')}"`,
      `'${lead.phone}`,
      lead.email,
      lead.city,
      lead.serviceNeeded,
      `"${lead.currentProblem?.replace(/"/g, '""') || ''}"`,
      lead.desiredTimeline,
      `"${(lead.budgetRange || '').replace(/"/g, '""')}"`,
      lead.status,
      getLeadPriority(lead),
      `"${(getLeadNotes(lead) || '').replace(/"/g, '""')}"`,
      lead.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `samaxon_leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Action: update status directly in UI
  const handleStatusChange = (lead: Lead, nextStatus: any) => {
    onUpdateLead({
      ...lead,
      status: nextStatus
    });
  };

  // Modify full drawer adjustments
  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      onUpdateLead(editingLead);
      setEditingLead(null);
    }
  };

  // Status badge colors styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'negotiating':
        return 'bg-[#D6B46A]/10 text-[#BFA15A] border-[#D6B46A]/30';
      case 'won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-600';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'high':
        return 'bg-[#D6B46A]/20 text-[#BFA15A] font-bold';
      case 'urgent':
        return 'bg-rose-100 text-rose-700 font-bold animate-pulse';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6" id="leads-tab-manager">
      
      {/* Upper header action blocks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Client Inquiry Funnel</span>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">Leads Management Suite</h2>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Safe CSV
        </button>
      </div>

      {/* Filters panels & Search bar */}
      <div className="bg-white border border-[#D6B46A]/15 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Inputs */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8A8178]">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search leads by ClientName, Business, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/20 focus:border-[#D6B46A] text-xs font-medium text-[#111111] rounded-xl outline-none transition-all placeholder:text-[#8A8178]/75"
            />
          </div>

          {/* Select Service */}
          <div className="md:col-span-3">
            <CustomSelect
              value={selectedService}
              onChange={setSelectedService}
              options={[
                { value: 'All', label: 'All Core Services' },
                ...servicesList.slice(1).map(srv => ({ value: srv, label: srv }))
              ]}
            />
          </div>

          {/* Select Status */}
          <div className="md:col-span-2">
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusesList}
            />
          </div>

          {/* Select Priority */}
          <div className="md:col-span-2">
            <CustomSelect
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={[
                { value: 'All', label: 'All Priorities' },
                ...prioritiesList.slice(1).map(pr => ({ value: pr, label: `${pr.toUpperCase()} Priority` }))
              ]}
            />
          </div>

        </div>

        {/* Selected count footer */}
        <div className="text-[11px] font-mono font-bold text-[#8A8178] flex items-center justify-between">
          <span>Active filter query matches: {filteredLeads.length} leads listed</span>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedService('All');
              setSelectedStatus('All');
              setSelectedPriority('All');
            }} 
            className="text-[#BFA15A] hover:text-[#111111] transition-colors uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main leads lists elements matrix */}
      <div className="bg-white border border-[#D6B46A]/15 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#D6B46A]/10 bg-[#FFFDF8] text-[#8A8178] font-bold text-[10px] uppercase tracking-wider">
                <th className="py-4 px-6">Client & Business</th>
                <th className="py-4 px-6">Required Capabilities</th>
                <th className="py-4 px-6">City / Location</th>
                <th className="py-4 px-6 text-center">Priority</th>
                <th className="py-4 px-6">Status Lifecycle</th>
                <th className="py-4 px-6 text-right">Actions Dashboard</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8A8178]/70 font-display">
                    No matching client inquirires found inside current segment parameters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const priority = getLeadPriority(lead);
                  return (
                    <tr key={lead.id} className="border-b border-[#D6B46A]/5 hover:bg-[#FFFDF8]/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#111111] text-sm">{lead.name}</span>
                          <span className="text-[11px] text-[#8A8178] font-medium leading-normal mt-0.5">{lead.businessName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-white border border-[#D6B46A]/20 text-[#111111] text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {lead.serviceNeeded}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#111111]/80 font-medium">
                        {lead.city}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-black rounded ${getPriorityBadge(priority)}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[9px] font-mono uppercase font-bold rounded-full border ${getStatusBadge(lead.status)}`}>
                          {lead.status === 'negotiating' ? 'qualified / demo' : lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => setEditingLead({ ...lead })}
                            className="p-1.5 bg-[#FFFDF8] hover:bg-[#F8F4EE] border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[#BFA15A] hover:text-[#111111] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Command Drawer
                          </button>
                          <button
                            onClick={() => {
                              showConfirm({
                                title: 'Delete Lead Entry?',
                                message: `Are you absolutely certain you want to permanently delete lead: ${lead.name}?`,
                                confirmText: 'Confirm Delete',
                                onConfirm: () => {
                                  onDeleteLead(lead.id);
                                  showToast(`Lead: ${lead.name} has been successfully deleted!`, 'success');
                                }
                              });
                            }}
                            className="p-1.5 bg-[#FFFDF8] hover:bg-rose-50 border border-gray-100 hover:border-rose-200 text-[#8A8178] hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Command Drawer Modal for Viewing / Modifying Leads details */}
      <AnimatePresence>
        {editingLead && (
          <div className="fixed inset-0 z-50 flex justify-end" id="lead-editor-drawer-overlay">
            {/* Dark glass backdrop backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingLead(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel sliding sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
              id="lead-editor-drawer"
            >
              <div>
                {/* Drawer header */}
                <div className="bg-[#111111] text-[#FFFDF8] p-6 border-b border-[#D6B46A]/25">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#D6B46A] uppercase tracking-widest font-black block">Live Client Pipeline</span>
                      <h3 className="font-display text-lg font-black tracking-tight mt-0.5">SamaXon Client Diagnostics</h3>
                    </div>
                    <button 
                      onClick={() => setEditingLead(null)}
                      className="text-white/60 hover:text-[#D6B46A] transition-colors text-xs font-bold uppercase tracking-wider outline-none"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#D6B46A]" />
                      <span className="font-bold text-white/95">{editingLead.name}</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <span className="text-white/70">{editingLead.businessName}</span>
                  </div>
                </div>

                {/* Drawer Contents Form */}
                <div className="p-6 space-y-6">
                  
                  {/* Contact channels fields */}
                  <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A8178] block">Primary Email</span>
                      <a href={`mailto:${editingLead.email}`} className="text-xs font-semibold text-[#111111] hover:underline break-all block mt-0.5">
                        {editingLead.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A8178] block">WhatsApp / Phone</span>
                      <a href={`tel:${editingLead.phone}`} className="text-xs font-semibold text-[#D6B46A] hover:underline block mt-0.5">
                        {editingLead.phone}
                      </a>
                    </div>
                  </div>

                  {/* Operational diagnostics section */}
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block border-b border-[#D6B46A]/10 pb-1">Client Brief Diagnostics</span>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-[#8A8178] block">Required Capability Segment:</span>
                        <span className="font-bold text-[#111111]">{editingLead.serviceNeeded}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8178] block">Requested Sprint Deadline:</span>
                        <span className="font-bold text-rose-700">{editingLead.desiredTimeline}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8178] block">Project Complexity:</span>
                        <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase rounded-md inline-block mt-0.5">
                          {(editingLead as any).complexity || 'Standard'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8178] block">Budget Selection Preference:</span>
                        <span className="font-bold text-emerald-700">
                          {(editingLead as any).user_budget_preference || 'Not Selected'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-[#8A8178] block">Price Estimate Range:</span>
                        <span className="font-bold text-[#BFA15A] text-sm">
                          {(editingLead as any).estimated_min_price ? `₹${(editingLead as any).estimated_min_price.toLocaleString('en-IN')} - ₹${((editingLead as any).estimated_max_price || 0).toLocaleString('en-IN')}` : editingLead.budgetRange}
                        </span>
                      </div>
                      {((editingLead as any).selected_addons && (editingLead as any).selected_addons.length > 0) && (
                        <div className="col-span-2">
                          <span className="text-[10px] text-[#8A8178] block mb-1">Selected Add-ons:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(editingLead as any).selected_addons.map((addon: string) => (
                              <span key={addon} className="px-2 py-0.5 bg-[#FFFDF8] border border-[#D6B46A]/20 text-[#BFA15A] text-[9px] font-mono uppercase font-bold rounded">
                                {addon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <span className="text-[10px] font-bold text-[#8A8178] block">Current Digital Problem Statement:</span>
                      <p className="text-xs text-[#111111] leading-relaxed italic">
                        “{editingLead.currentProblem}”
                      </p>
                    </div>

                    {editingLead.message && (
                      <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                        <span className="text-[10px] font-bold text-[#8A8178] block">Additional Details / Message:</span>
                        <p className="text-xs text-[#111111]/85 leading-relaxed">
                          {editingLead.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Editable Fields Section */}
                  <div className="border-t border-[#D6B46A]/20 pt-6 space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block">Pipeline Controls</span>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Priority dropdown selector */}
                      <div>
                        <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Inquiry Lead Priority</label>
                        <CustomSelect
                          value={getLeadPriority(editingLead)}
                          onChange={(val) => setEditingLead({ ...editingLead, ...{ priority: val } })}
                          options={prioritiesList.slice(1).map(pr => ({ value: pr, label: `${pr.charAt(0).toUpperCase() + pr.slice(1)} Priority` }))}
                        />
                      </div>

                      {/* Status select input */}
                      <div>
                        <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Client Status State</label>
                        <CustomSelect
                          value={editingLead.status}
                          onChange={(val) => setEditingLead({ ...editingLead, status: val as any })}
                          options={statusesList.slice(1)}
                        />
                      </div>
                    </div>

                    {/* Internal annotation text updates */}
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Administrative internal Notes</label>
                      <textarea
                        value={getLeadNotes(editingLead)}
                        onChange={(e) => setEditingLead({ ...editingLead, ...{ internalNotes: e.target.value } })}
                        placeholder="Type executive comments, interview scheduling times, deposit details or engineering coordination states here..."
                        rows={4}
                        className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/25 text-xs text-[#111111] rounded-xl outline-none placeholder:text-[#8A8178]/65 leading-relaxed"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Action buttons footer */}
              <div className="bg-[#FFFDF8] border-t border-[#D6B46A]/20 p-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-5 py-3 whitespace-nowrap bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-[#8A8178] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  Cancel / Rollback
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetail}
                  className="px-6 py-3 w-full bg-[#111111] hover:bg-[#262626] text-white hover:text-[#D6B46A] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Save Pipeline Changes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
