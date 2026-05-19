import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, RefreshCw, Eye } from "lucide-react";
import { supabase } from "../../lib/supabase";
import CustomSelect from "../components/CustomSelect";
import MediaUploader from "../../components/MediaUploader";

interface Service {
  id: string;
  title: string;
  category: string;
  pricing: string;
  status: string;
  imageUrl?: string;
  created_at: any;
  description?: string;
  timeline?: string;
  features?: string;
  faqs?: string;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", category: "", pricing: "", status: "Active",
    description: "", timeline: "", features: "", faqs: "", imageUrl: "" 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (mounted) {
        if (!error && data) {
          setServices(data as any[]);
        }
        setLoading(false);
      }
    };
    
    fetchServices();

    const subscription = supabase
      .channel('services_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, payload => {
        fetchServices();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFormData({ 
      title: "", category: "", pricing: "", status: "Active",
      description: "", timeline: "", features: "", faqs: "", imageUrl: "" 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        price_type: formData.pricing, // map to Supabase column
        status: formData.status,     // note: we may need to add status to schema, using existing ones mainly
        description: formData.description,
        timeline: formData.timeline,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        faqs: formData.faqs,
        icon: formData.imageUrl,      // map to Supabase column (icon)
      };

      if (editingId) {
        await supabase.from('services').update(payload).eq('id', editingId);
      } else {
        await supabase.from('services').insert([payload]);
      }
      setShowModal(false);
      handleResetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (svc: any) => {
    setEditingId(svc.id);
    setFormData({ 
      title: svc.title || "", 
      category: svc.category || "", 
      pricing: svc.price_type || svc.pricing || "", // fallback to prev db naming
      status: svc.status || "Active",
      description: svc.description || "",
      timeline: svc.timeline || "",
      features: Array.isArray(svc.features) ? svc.features.join(", ") : (svc.features || ""),
      faqs: svc.faqs || "",
      imageUrl: svc.icon || svc.imageUrl || ""
    });
    setShowModal(true);
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || s.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Services</h1>
          <p className="text-[#A8AFBD] mt-1">Manage your offerings and pricing.</p>
        </div>
        <button 
          onClick={() => { handleResetForm(); setShowModal(true); }}
          className="bg-[#2984FF] hover:bg-[#2984FF]/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AFBD]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services..." 
              className="w-full bg-[#101010] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center p-12">
              <RefreshCw className="w-8 h-8 text-[#A8AFBD] animate-spin" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-[#A8AFBD]">
              <Eye className="w-12 h-12 mb-4 opacity-20" />
              <p>No services found.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#101010] text-[#A8AFBD] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Service Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Pricing</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{svc.title}</div>
                    </td>
                    <td className="px-6 py-4 text-[#A8AFBD]">{svc.category}</td>
                    <td className="px-6 py-4 text-white font-medium">{svc.pricing}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        svc.status === 'Active' || svc.status === 'Featured'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-[#A8AFBD]/10 text-[#A8AFBD] border border-[#A8AFBD]/20'
                      }`}>
                        {svc.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEditModal(svc)} className="text-[#A8AFBD] hover:text-[#2984FF] transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(svc.id)} className="text-[#A8AFBD] hover:text-red-400 transition-colors" title="Delete">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold font-display text-white">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A8AFBD] hover:text-white transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Service Title</label>
                    <input 
                      type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      placeholder="e.g. Website Development"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Category</label>
                    <input 
                      type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      placeholder="e.g. Web Development"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Pricing</label>
                    <input 
                      type="text" value={formData.pricing} onChange={e => setFormData({...formData, pricing: e.target.value})} required
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      placeholder="e.g. $1000+"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Status</label>
                    <CustomSelect 
                      value={formData.status} 
                      onChange={value => setFormData({...formData, status: value})}
                      options={["Draft", "Active", "Featured"]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A8AFBD]">Service Banner Image</label>
                  <MediaUploader 
                    value={formData.imageUrl}
                    onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})}
                    onClear={() => setFormData({...formData, imageUrl: ""})}
                    accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}}
                    aspectRatio={16/9}
                    folder="portfolio/services"
                    buttonText="Upload Service Image (16:9)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A8AFBD]">Description</label>
                  <textarea 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A8AFBD]">Timeline</label>
                  <input 
                    type="text" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                    placeholder="e.g. 2-4 weeks"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A8AFBD]">Features (comma separated)</label>
                  <textarea 
                    value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} rows={2}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                    placeholder="e.g. Responsive Design, SEO Optimized, CMS Integration"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A8AFBD]">FAQs (format: Q|A, Q|A)</label>
                  <textarea 
                    value={formData.faqs} onChange={e => setFormData({...formData, faqs: e.target.value})} rows={2}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                    placeholder="e.g. Do you offer hosting?|Yes we do!, Will you maintain the site?|Yes for 6 months."
                  />
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="submit" form="service-form" className="flex-1 px-4 py-3 rounded-xl bg-[#2984FF] hover:bg-[#2984FF]/90 text-white font-medium transition-colors">
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
