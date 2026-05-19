import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash, RefreshCw, Eye } from "lucide-react";
import { supabase } from "../../lib/supabase";
import CustomSelect from "../components/CustomSelect";
import MediaUploader from "../../components/MediaUploader";

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  views: number;
  created_at: any;
  slug?: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  technologies?: string;
  githubUrl?: string;
  liveUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    slug: "", 
    category: "", 
    shortDescription: "",
    description: "",
    imageUrl: "",
    galleryUrls: [] as string[],
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    status: "Published" 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (mounted) {
        if (!error && data) {
          setProjects(data as any[]);
        }
        setLoading(false);
      }
    };
    
    fetchProjects();

    const subscription = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
        fetchProjects(); // simple refetch on any change
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFormData({ 
      title: "", slug: "", category: "", shortDescription: "", description: "", 
      imageUrl: "", galleryUrls: [], technologies: "", githubUrl: "", liveUrl: "", 
      metaTitle: "", metaDescription: "", keywords: "", status: "Published" 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savePayload = {
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category: formData.category,
          description: formData.description,
          image_url: formData.imageUrl,
          live_link: formData.liveUrl,
          github_link: formData.githubUrl,
          status: formData.status,
          // note: some fields might need schema updates if they don't map directly
      };

      if (editingId) {
        await supabase.from('projects').update(savePayload).eq('id', editingId);
      } else {
        await supabase.from('projects').insert([savePayload]);
      }
      setShowModal(false);
      handleResetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (proj: any) => {
    setEditingId(proj.id);
    setFormData({ 
      title: proj.title || "", 
      slug: proj.slug || "",
      category: proj.category || "", 
      shortDescription: proj.shortDescription || "",
      description: proj.description || "",
      imageUrl: proj.image_url || "",
      galleryUrls: proj.galleryUrls || [],
      technologies: proj.technologies || "",
      githubUrl: proj.github_link || "",
      liveUrl: proj.live_link || "",
      metaTitle: proj.metaTitle || "",
      metaDescription: proj.metaDescription || "",
      keywords: proj.keywords || "",
      status: proj.status || "Published" 
    });
    setShowModal(true);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All Status" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-[#A8AFBD] mt-1">Manage your portfolio projects.</p>
        </div>
        <button 
          onClick={() => { handleResetForm(); setShowModal(true); }}
          className="bg-[#2984FF] hover:bg-[#2984FF]/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AFBD]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects by title or category..." 
              className="w-full bg-[#101010] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
            />
          </div>
          <CustomSelect 
            value={filterStatus}
            onChange={setFilterStatus}
            options={["All Status", "Published", "Featured", "Archived", "Draft"]}
            className="w-40"
          />
        </div>

        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center p-12">
              <RefreshCw className="w-8 h-8 text-[#A8AFBD] animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-[#A8AFBD]">
              <Eye className="w-12 h-12 mb-4 opacity-20" />
              <p>No projects found.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#101010] text-[#A8AFBD] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Views</th>
                  <th className="px-6 py-4 font-medium min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{proj.title}</div>
                    </td>
                    <td className="px-6 py-4 text-[#A8AFBD]">{proj.category}</td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        proj.status === 'Published' || proj.status === 'Featured'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-[#A8AFBD]/10 text-[#A8AFBD] border border-[#A8AFBD]/20'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#A8AFBD]">{proj.views?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEditModal(proj)} className="text-[#A8AFBD] hover:text-[#2984FF] transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(proj.id)} className="text-[#A8AFBD] hover:text-red-400 transition-colors" title="Delete">
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
          <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold font-display text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A8AFBD] hover:text-white transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-white/10 pb-2">Basic Info</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Project Title</label>
                      <input 
                        type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                        placeholder="e.g. Aura E-Commerce"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Slug</label>
                      <input 
                        type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                        placeholder="e.g. aura-ecommerce"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Category</label>
                      <input 
                        type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                        placeholder="e.g. Fullstack, UI/UX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Status</label>
                      <CustomSelect 
                        value={formData.status} 
                        onChange={value => setFormData({...formData, status: value})}
                        options={["Draft", "Published", "Featured", "Archived"]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Short Description</label>
                    <textarea 
                      value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} rows={2}
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Full Description</label>
                    <textarea 
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4}
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors relative block"
                    />
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-white/10 pb-2">Media</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Thumbnail Image</label>
                    <MediaUploader 
                      value={formData.imageUrl}
                      onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})}
                      onClear={() => setFormData({...formData, imageUrl: ""})}
                      accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}}
                      aspectRatio={16/9}
                      folder="portfolio/projects"
                      buttonText="Upload Thumbnail (16:9)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Gallery Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {formData.galleryUrls.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-[#101010] border border-white/10">
                          <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => {
                              const newGallery = [...formData.galleryUrls];
                              newGallery.splice(idx, 1);
                              setFormData({...formData, galleryUrls: newGallery});
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="text-sm px-1">&times;</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <MediaUploader 
                      onUploadSuccess={(url) => setFormData({...formData, galleryUrls: [...formData.galleryUrls, url]})}
                      accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}}
                      folder="portfolio/projects/gallery"
                      buttonText="Add Gallery Image"
                    />
                  </div>
                </div>

                {/* Technical */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-white/10 pb-2">Technical Details</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Technologies Used (comma separated)</label>
                    <input 
                      type="text" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} 
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">GitHub URL</label>
                      <input 
                        type="text" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Live Demo URL</label>
                      <input 
                        type="text" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} 
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-4">
                   <h4 className="text-white font-medium border-b border-white/10 pb-2">SEO</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Meta Title</label>
                      <input 
                        type="text" value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} 
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#A8AFBD]">Keywords (comma separated)</label>
                      <input 
                        type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} 
                        className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A8AFBD]">Meta Description</label>
                    <textarea 
                      value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} rows={2}
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                    />
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="submit" form="project-form" className="flex-1 px-4 py-3 rounded-xl bg-[#2984FF] hover:bg-[#2984FF]/90 text-white font-medium transition-colors">
                Save Project
              </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
