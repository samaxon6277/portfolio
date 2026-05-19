import React, { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";
import MediaUploader from "../../components/MediaUploader";

const SOCIAL_PLATFORMS = [
  "Instagram", "Facebook", "X/Twitter", "LinkedIn", 
  "GitHub", "YouTube", "Telegram", "Discord", "Fiverr", "Upwork"
];

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState("General");
  
  const [formData, setFormData] = useState({
    businessName: "SamaXon",
    tagline: "Odyssey of a Full-Stack Developer",
    logoType: "text",
    logoText: "SAMAXON",
    logoImageUrl: "",
    faviconUrl: "",
    contactPhone: "+91 80768 74034",
    whatsappNumber: "+91 80768 74034",
    contactEmail: "samaxon6277@gmail.com",
    contactLocation: "India",
    aboutTitle: "Samar",
    aboutSubtitle: "Full-Stack Developer",
    aboutBio: "I am Samar, a passionate creative Full-Stack Developer bridging the gap between beautiful design and robust engineering. I build tools for SamaXon to craft digital products that not only look stunning but perform flawlessly.",
    skills: ["React", "TypeScript", "Node.js", "TailwindCSS", "Next.js", "Supabase"] as string[],
    resumeUrl: "",
    socialLinks: SOCIAL_PLATFORMS.map(p => ({ platform: p, url: "", enabled: false })),
    metaTitle: "SamaXon - Digital Portfolio",
    keywords: "Samar, SamaXon, Full-Stack Developer, Portfolio",
    metaDescription: "The professional digital portfolio of Samar, founder of SamaXon.",
    id: "" 
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        // Fetch Settings
        const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').limit(1).single();
        
        // Fetch Social Links
        const { data: socialData, error: socialError } = await supabase.from('social_links').select('*');

        if (mounted) {
          if (!settingsError && settingsData) {
            setFormData(prev => ({
              ...prev,
              id: settingsData.id,
              businessName: settingsData.company_name || prev.businessName,
              tagline: settingsData.tagline || "",
              logoType: settingsData.logo_type || prev.logoType,
              logoText: settingsData.logo_text || prev.logoText,
              logoImageUrl: settingsData.logo_url || "",
              faviconUrl: settingsData.favicon_url || "",
              contactPhone: settingsData.phone || "",
              whatsappNumber: settingsData.whatsapp_number || "",
              contactEmail: settingsData.email || "",
              contactLocation: settingsData.address || "",
              aboutTitle: settingsData.about_title || "",
              aboutSubtitle: settingsData.about_subtitle || "",
              aboutBio: settingsData.about_text || "",
              skills: settingsData.skills || prev.skills,
              resumeUrl: settingsData.resume_url || "",
              metaTitle: settingsData.meta_title || prev.metaTitle,
              keywords: settingsData.meta_keywords || "",
              metaDescription: settingsData.meta_description || ""
            }));
          }

          if (!socialError && socialData) {
            setFormData(prev => {
              const newSocialLinks = [...prev.socialLinks];
              socialData.forEach(item => {
                const idx = newSocialLinks.findIndex(s => s.platform.toLowerCase() === item.platform.toLowerCase());
                if (idx !== -1) {
                  newSocialLinks[idx] = { ...newSocialLinks[idx], url: item.url, enabled: item.is_active };
                }
              });
              return { ...prev, socialLinks: newSocialLinks };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSettings();

    return () => { mounted = false; };
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (index: number, field: string, value: any) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const handleSkillChange = (e: any) => {
    const skills = e.target.value.split(",").map((s: string) => s.trim());
    setFormData({ ...formData, skills });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // 1. Update Settings
      const settingsPayload = {
        company_name: formData.businessName,
        tagline: formData.tagline,
        logo_type: formData.logoType,
        logo_text: formData.logoText,
        logo_url: formData.logoImageUrl,
        favicon_url: formData.faviconUrl,
        phone: formData.contactPhone,
        whatsapp_number: formData.whatsappNumber,
        email: formData.contactEmail,
        address: formData.contactLocation,
        about_title: formData.aboutTitle,
        about_subtitle: formData.aboutSubtitle,
        about_text: formData.aboutBio,
        skills: formData.skills,
        resume_url: formData.resumeUrl,
        meta_title: formData.metaTitle,
        meta_keywords: formData.keywords,
        meta_description: formData.metaDescription,
        updated_at: new Date().toISOString()
      };

      if (formData.id) {
        await supabase.from('settings').update(settingsPayload).eq('id', formData.id);
      } else {
        const { data } = await supabase.from('settings').insert([settingsPayload]).select().single();
        if (data) setFormData(p => ({...p, id: data.id}));
      }

      // 2. Update Social Links
      // Fast clear and insert
      await supabase.from('social_links').delete().neq('platform', 'unknown'); // clear all
      
      const socialPayload = formData.socialLinks.map((s, index) => ({
        platform: s.platform,
        url: s.url,
        is_active: s.enabled,
        order_index: index
      }));
      await supabase.from('social_links').insert(socialPayload);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[400px] items-center justify-center"><RefreshCw className="w-8 h-8 text-[#A8AFBD] animate-spin" /></div>;

  const tabs = ["General", "Logo", "Contact", "About", "Social", "SEO"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-[#A8AFBD] mt-1">Manage global portfolio settings and data.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2984FF] hover:bg-[#2984FF]/90 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <><RefreshCw className="w-5 h-5 animate-spin" /> Saving...</> : 
           saved ? <><CheckCircle className="w-5 h-5 text-green-300" /> Saved</> : 
           <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-hide">
         {tabs.map(tab => (
            <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 font-medium text-sm rounded-lg whitespace-nowrap transition-colors ${activeTab === tab ? "bg-[#2984FF]/10 text-[#2984FF]" : "text-[#A8AFBD] hover:text-white"}`}
            >
               {tab}
            </button>
         ))}
      </div>

      <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8">
        
        {activeTab === "General" && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold border-b border-white/5 pb-2">General Settings</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Tagline</label>
                  <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
             </div>
          </div>
        )}

        {activeTab === "Logo" && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold border-b border-white/5 pb-2">Logo Settings</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Logo Type</label>
                   <select name="logoType" value={formData.logoType} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]">
                     <option value="text">Text Only</option>
                     <option value="image">Image Only</option>
                     <option value="both">Both Text and Image</option>
                   </select>
                 </div>
                 {["text", "both"].includes(formData.logoType) && (
                   <div>
                     <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Logo Text</label>
                     <input type="text" name="logoText" value={formData.logoText} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                   </div>
                 )}
                 {["image", "both"].includes(formData.logoType) && (
                   <div className="space-y-2 md:col-span-2">
                     <label className="block text-sm font-medium text-[#A8AFBD]">Upload Logo (PNG/SVG)</label>
                     <MediaUploader value={formData.logoImageUrl} onUploadSuccess={(url) => setFormData({...formData, logoImageUrl: url})} onClear={() => setFormData({...formData, logoImageUrl: ""})} accept={{"image/*": [".png", ".svg", ".webp"]}} folder="portfolio/logo" buttonText="Upload Logo" />
                   </div>
                 )}
                 <div className="space-y-2 md:col-span-2">
                     <label className="block text-sm font-medium text-[#A8AFBD]">Favicon (1:1)</label>
                     <MediaUploader value={formData.faviconUrl} onUploadSuccess={(url) => setFormData({...formData, faviconUrl: url})} onClear={() => setFormData({...formData, faviconUrl: ""})} accept={{"image/*": [".png", ".ico"]}} aspectRatio={1} folder="portfolio/logo" buttonText="Upload Favicon" />
                 </div>
             </div>
          </div>
        )}

        {activeTab === "Contact" && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold border-b border-white/5 pb-2">Contact Details</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Contact Email</label>
                  <div className="flex items-center gap-2 bg-[#101010] border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#2984FF]">
                     <Mail className="w-5 h-5 text-[#A8AFBD]" />
                     <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-transparent text-white focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Phone Number</label>
                  <div className="flex items-center gap-2 bg-[#101010] border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#2984FF]">
                     <Phone className="w-5 h-5 text-[#A8AFBD]" />
                     <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full bg-transparent text-white focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">WhatsApp Number</label>
                  <div className="flex items-center gap-2 bg-[#101010] border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#2984FF]">
                     <Phone className="w-5 h-5 text-[#A8AFBD]" />
                     <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full bg-transparent text-white focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Location</label>
                  <div className="flex items-center gap-2 bg-[#101010] border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#2984FF]">
                     <MapPin className="w-5 h-5 text-[#A8AFBD]" />
                     <input type="text" name="contactLocation" value={formData.contactLocation} onChange={handleChange} className="w-full bg-transparent text-white focus:outline-none" />
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === "About" && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold border-b border-white/5 pb-2">About Section</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Title</label>
                  <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" placeholder="e.g. Creative Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Subtitle</label>
                  <input type="text" name="aboutSubtitle" value={formData.aboutSubtitle} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Bio / Description</label>
                  <textarea rows={4} name="aboutBio" value={formData.aboutBio} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF] resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Skills (Comma separated)</label>
                  <input type="text" value={formData.skills?.join(", ")} onChange={handleSkillChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="block text-sm font-medium text-[#A8AFBD]">Resume PDF</label>
                   <MediaUploader value={formData.resumeUrl} onUploadSuccess={(url) => setFormData({...formData, resumeUrl: url})} onClear={() => setFormData({...formData, resumeUrl: ""})} accept={{"application/pdf": [".pdf"]}} folder="portfolio/documents" buttonText="Upload Resume" />
                </div>
             </div>
          </div>
        )}

        {activeTab === "Social" && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold border-b border-white/5 pb-2">Social Media Links</h2>
             <div className="space-y-4">
                {formData.socialLinks?.map((link, idx) => (
                   <div key={link.platform} className="flex items-center gap-4 bg-[#101010] border border-white/10 rounded-xl p-4">
                      <div className="w-32 font-medium">{link.platform}</div>
                      <input 
                         type="url" 
                         value={link.url} 
                         onChange={(e) => handleSocialChange(idx, "url", e.target.value)} 
                         placeholder={`https://${link.platform.toLowerCase()}.com/...`} 
                         className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2984FF] text-sm"
                         disabled={!link.enabled}
                      />
                      <label className="flex items-center gap-2 text-sm cursor-pointer ml-auto">
                         <input type="checkbox" checked={link.enabled} onChange={(e) => handleSocialChange(idx, "enabled", e.target.checked)} className="rounded border-white/10 bg-[#1B1B1B] text-[#2984FF]" />
                         Enabled
                      </label>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold border-b border-white/5 pb-2">SEO Optimization</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Keywords (Comma separated)</label>
                  <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Meta Description</label>
                  <textarea rows={3} name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF] resize-none" />
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
