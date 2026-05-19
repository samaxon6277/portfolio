import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, RefreshCw, Eye, FileText } from "lucide-react";
import { supabase } from "../../lib/supabase";
import CustomSelect from "../components/CustomSelect";
import MediaUploader from "../../components/MediaUploader";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    tags: "",
    status: "Published",
    coverImage: ""
  });

  useEffect(() => {
    let mounted = true;

    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (mounted) {
        if (!error && data) {
          setBlogs(data);
        }
        setLoading(false);
      }
    };

    fetchBlogs();

    const subscription = supabase
      .channel('blogs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, payload => {
        fetchBlogs();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  const openAppModal = (blog: any) => {
    setEditingId(blog.id);
    setFormData({ 
      title: blog.title || "", 
      slug: blog.slug || "",
      content: blog.content || "",
      tags: blog.tags || "",
      status: blog.status || "Published",
      coverImage: blog.coverImage || blog.thumbnail_url || ""
    });
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      tags: "",
      status: "Published",
      coverImage: ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        // We're converting the tags string to an array or leaving as is if schema is TEXT
        // In the supabase-schema we used TEXT for slug and generic structure.
        // The original used string for tags
        status: formData.status.toLowerCase(), // Check schema constraint: 'draft', 'published'
        thumbnail_url: formData.coverImage,
        author_id: session?.user?.id
        // removing generic tags for now if not in schema, unless we added it later.
      };
      
      if (editingId) {
        await supabase.from('blogs').update({
           title: payload.title,
           slug: payload.slug,
           content: payload.content,
           status: payload.status,
           thumbnail_url: payload.thumbnail_url
        }).eq('id', editingId);
      } else {
        await supabase.from('blogs').insert([payload]);
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await supabase.from('blogs').delete().eq('id', id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || b.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All Status" || (b.status && b.status.toLowerCase() === filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Blogs</h1>
          <p className="text-[#A8AFBD] mt-1">Manage content and SEO marketing.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-[#2984FF] hover:bg-[#2984FF]/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Blog
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
              placeholder="Search blogs..." 
              className="w-full bg-[#101010] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
            />
          </div>
          <CustomSelect 
            value={filterStatus}
            onChange={setFilterStatus}
            options={["All Status", "Published", "Draft", "Scheduled"]}
            className="w-40"
          />
        </div>

        <div className="overflow-x-auto flex-1">
          {loading ? (
             <div className="h-full flex items-center justify-center p-12">
               <RefreshCw className="w-8 h-8 text-[#A8AFBD] animate-spin" />
             </div>
          ) : filteredBlogs.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center p-12 text-[#A8AFBD]">
               <FileText className="w-12 h-12 mb-4 opacity-20" />
               <p>No blogs found.</p>
             </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#101010] text-[#A8AFBD] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Views</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBlogs.map((b) => (
                   <tr key={b.id} className="hover:bg-white/5 transition-colors">
                     <td className="px-6 py-4">
                       <div className="font-semibold text-white">{b.title}</div>
                       <div className="text-xs text-[#A8AFBD] mt-1">/{b.slug}</div>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                         b.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                         b.status === 'scheduled' ? 'bg-[#2984FF]/10 text-[#2984FF] border border-[#2984FF]/20' :
                         'bg-[#A8AFBD]/10 text-[#A8AFBD] border border-[#A8AFBD]/20'
                       }`}>
                         {b.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-[#A8AFBD]">{b.views || 0}</td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openAppModal(b)} className="text-[#A8AFBD] hover:text-[#2984FF] transition-colors"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(b.id)} className="text-[#A8AFBD] hover:text-red-400 transition-colors"><Trash className="w-4 h-4"/></button>
                        </div>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
             <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
               <h3 className="text-xl font-bold font-display text-white">{editingId ? 'Edit Blog' : 'Create Blog'}</h3>
               <button onClick={() => setShowModal(false)} className="text-[#A8AFBD] hover:text-white transition-colors">
                 <span className="text-2xl leading-none">&times;</span>
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto flex-1">
               <form id="blogForm" onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-[#A8AFBD]">Blog Title</label>
                     <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-[#A8AFBD]">URL Slug</label>
                     <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-[#A8AFBD]">Cover Image</label>
                   <MediaUploader 
                      value={formData.coverImage}
                      onUploadSuccess={(url) => setFormData({...formData, coverImage: url})}
                      onClear={() => setFormData({...formData, coverImage: ""})}
                      accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}}
                      aspectRatio={16/9}
                      folder="portfolio/blogs"
                      buttonText="Upload Cover Image (16:9)"
                    />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-[#A8AFBD]">Tags (comma separated)</label>
                     <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-[#A8AFBD]">Status</label>
                     <CustomSelect 
                        value={formData.status} 
                        onChange={value => setFormData({...formData, status: value})}
                        options={["Draft", "Published", "Scheduled"]}
                      />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-[#A8AFBD]">Content (Markdown)</label>
                   <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={10} required className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors resize-y font-mono"></textarea>
                 </div>
               </form>
             </div>
             
             <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" form="blogForm" className="flex-1 px-4 py-3 rounded-xl bg-[#2984FF] hover:bg-[#2984FF]/90 text-white font-medium transition-colors">Save Blog</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
