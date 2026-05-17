import React, { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import MediaUploader from "../../components/MediaUploader";

const SOCIAL_PLATFORMS = [
  "Instagram", "Facebook", "X/Twitter", "LinkedIn", 
  "GitHub", "YouTube", "Telegram", "Discord", "Fiverr", "Upwork"
];

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState("General");
  
  const [formData, setFormData] = useState({
    portfolioName: "SamaXon Agency",
    tagline: "",
    logoType: "text",
    logoText: "SAMAXON",
    logoImageUrl: "",
    faviconUrl: "",
    contactPhone: "8076874034",
    whatsappNumber: "",
    contactEmail: "samaxon6277@gmail.com",
    contactLocation: "",
    businessName: "SamaXon",
    aboutTitle: "",
    aboutSubtitle: "",
    aboutBio: "",
    skills: ["React", "Firebase", "Tailwind CSS"],
    experience: [],
    avatarUrl: "",
    resumeUrl: "",
    socialLinks: SOCIAL_PLATFORMS.map(p => ({ platform: p, url: "", enabled: false })),
    metaTitle: "SamaXon - Digital Portfolio",
    keywords: "portfolio, web dev",
    metaDescription: "A high-quality portfolio.",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
             ...prev, 
             ...data,
             socialLinks: data.socialLinks || prev.socialLinks
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
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
      await setDoc(doc(db, "settings", "global"), {
        ...formData,
        updatedAt: serverTimestamp()
      });
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
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Portfolio Name</label>
                  <input type="text" name="portfolioName" value={formData.portfolioName} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#2984FF]" />
                </div>
                <div className="md:col-span-2">
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
                <div className="space-y-2 md:col-span-2">
                   <label className="block text-sm font-medium text-[#A8AFBD]">Profile Avatar (1:1)</label>
                   <MediaUploader value={formData.avatarUrl} onUploadSuccess={(url) => setFormData({...formData, avatarUrl: url})} onClear={() => setFormData({...formData, avatarUrl: ""})} accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}} aspectRatio={1} folder="portfolio/profile" buttonText="Upload Avatar" />
                </div>
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
