import React, { useState, useEffect } from "react";
import { UserCircle, Shield, Moon, Bell, Save, RefreshCw, CheckCircle, AlignLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import CustomSelect from "../components/CustomSelect";
import MediaUploader from "../../components/MediaUploader";

export default function ProfileSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'profile';
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    avatarUrl: user?.photoURL || "",
    username: "",
    bio: "",
    phone: "",
    social: {
      github: "",
      linkedin: "",
      telegram: ""
    },
    preferences: {
      theme: "dark",
      density: "comfortable"
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "admin_profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() as any }));
        }
      } catch (error) {
        console.error("Fetch profile error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, social: { ...prev.social, [field]: value } }));
    } else if (name.startsWith('preferences.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, [field]: value } }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "admin_profiles", user.uid), {
        ...formData,
        fullName: formData.fullName || user.displayName || "Admin User",
        updatedAt: serverTimestamp()
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      try { handleFirestoreError(error, OperationType.WRITE, "admin_profiles"); } catch(e) {}
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: UserCircle },
    { id: 'settings', label: 'Account Settings', icon: Moon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'activity', label: 'Activity Logs', icon: AlignLeft },
  ];

  if (loading) {
     return <div className="flex justify-center items-center h-[50vh]"><RefreshCw className="w-8 h-8 text-[#A8AFBD] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Profile & Settings</h1>
          <p className="text-[#A8AFBD] mt-1">Manage your account credentials and preferences.</p>
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

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-2">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setSearchParams({ tab: tab.id })}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                 currentTab === tab.id 
                 ? "bg-[#2984FF]/10 text-[#2984FF] shadow-[0_0_15px_rgba(41,132,255,0.1)] font-medium" 
                 : "text-[#A8AFBD] hover:text-white hover:bg-white/5"
               }`}
             >
               <tab.icon className="w-5 h-5" />
               {tab.label}
             </button>
           ))}
        </aside>

        <div className="flex-1 bg-[#1B1B1B] border border-white/5 rounded-2xl p-6 md:p-8">
           {currentTab === 'profile' && (
             <div className="space-y-6 animate-in fade-in">
               <h2 className="text-xl font-bold font-display border-b border-white/5 pb-4">Personal Information</h2>
               
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                 <div className="w-24 h-24 rounded-full bg-[#101010] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 filter drop-shadow-lg relative group">
                   {formData.avatarUrl ? <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : <UserCircle className="w-12 h-12 text-[#A8AFBD]" />}
                 </div>
                 <div className="flex-1 max-w-sm">
                   <MediaUploader 
                     value={formData.avatarUrl}
                     onUploadSuccess={(url) => setFormData({...formData, avatarUrl: url})}
                     onClear={() => setFormData({...formData, avatarUrl: ""})}
                     accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}}
                     aspectRatio={1}
                     folder="portfolio/profile"
                     buttonText="Change Avatar"
                   />
                   <p className="text-xs text-[#A8AFBD] mt-2">Upload a 1:1 image. Recommended size 500x500px.</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Email Address (Read-only)</label>
                   <input type="email" readOnly value={user?.email || ""} className="w-full bg-[#101010] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#A8AFBD] cursor-not-allowed" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Full Name</label>
                   <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Username</label>
                   <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Phone</label>
                   <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Bio</label>
                   <textarea rows={3} name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors resize-none"></textarea>
                 </div>
               </div>

               <h2 className="text-xl font-bold font-display border-b border-white/5 pb-4 mt-8 pt-4">Social Links</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">GitHub</label>
                   <input type="text" name="social.github" value={formData.social?.github} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">LinkedIn</label>
                   <input type="text" name="social.linkedin" value={formData.social?.linkedin} onChange={handleChange} placeholder="https://linkedin.com/..." className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Telegram</label>
                   <input type="text" name="social.telegram" value={formData.social?.telegram} onChange={handleChange} placeholder="https://t.me/..." className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors" />
                 </div>
               </div>
             </div>
           )}

           {currentTab === 'settings' && (
             <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold font-display border-b border-white/5 pb-4">Theme Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Color Theme</label>
                    <CustomSelect 
                      value={formData.preferences?.theme || "dark"}
                      onChange={val => handleChange({ target: { name: 'preferences.theme', value: val } } as any)}
                      options={[
                        { label: "Dark Theme (Default)", value: "dark" },
                        { label: "Light Theme (Not yet supported)", value: "light" },
                        { label: "System Preference", value: "system" }
                      ]}
                      className="w-full md:w-1/2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A8AFBD] mb-2">Layout Density</label>
                    <CustomSelect 
                      value={formData.preferences?.density || "comfortable"}
                      onChange={val => handleChange({ target: { name: 'preferences.density', value: val } } as any)}
                      options={[
                        { label: "Comfortable", value: "comfortable" },
                        { label: "Compact", value: "compact" }
                      ]}
                      className="w-full md:w-1/2"
                    />
                  </div>
                </div>
             </div>
           )}

           {currentTab === 'notifications' && (
             <div className="space-y-6 animate-in fade-in">
               <h2 className="text-xl font-bold font-display border-b border-white/5 pb-4">Notification Settings</h2>
               <div className="space-y-4 max-w-lg">
                 {[
                   { id: 'emailSub', label: 'Email Notifications', desc: 'Receive daily summaries of your leads.' },
                   { id: 'pushSub', label: 'Push Notifications', desc: 'Real-time browser notifications.' },
                   { id: 'secSub', label: 'Security Alerts', desc: 'Alerts on suspicious login activity.' }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-[#101010] border border-white/5 rounded-xl">
                      <div>
                        <div className="text-sm font-medium text-white">{item.label}</div>
                        <div className="text-xs text-[#A8AFBD] mt-1">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2984FF]"></div>
                      </label>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {currentTab === 'security' && (
             <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold font-display border-b border-white/5 pb-4">Security Settings</h2>
                <div className="bg-[#101010] border border-white/5 rounded-xl p-6">
                   <div className="flex items-center gap-4 mb-4">
                     <Shield className="w-8 h-8 text-green-400" />
                     <div>
                       <div className="font-semibold text-white">Google Authentication Active</div>
                       <div className="text-sm text-[#A8AFBD]">Your account security is managed by Google.</div>
                     </div>
                   </div>
                   <p className="text-sm text-[#A8AFBD] mb-6">
                     To change your password or enable 2-Factor Authentication, please visit your Google Account security settings.
                   </p>
                   <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="inline-flex bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                     Manage Google Account
                   </a>
                </div>
                
                <h3 className="text-lg font-bold mt-8 mb-4">Active Sessions</h3>
                <div className="bg-[#101010] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                   <div>
                     <div className="text-sm font-medium text-white">Current Session (Mac OS, Chrome)</div>
                     <div className="text-xs text-[#A8AFBD]">Started just now, IP: 192.168.1.1</div>
                   </div>
                   <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded uppercase font-bold tracking-wider">Active</span>
                </div>
             </div>
           )}

           {currentTab === 'activity' && (
             <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold font-display border-b border-white/5 pb-4">Activity Logs</h2>
                <div className="space-y-4">
                   {[
                     { action: "Logged in successfully", time: "Just now" },
                     { action: "Updated homepage settings", time: "2 hours ago" },
                     { action: "Created new project 'Nexus'", time: "1 day ago" },
                     { action: "Changed portfolio metadata", time: "3 days ago" },
                   ].map((log, i) => (
                     <div key={i} className="flex gap-4 p-4 border-b border-white/5 hover:bg-[#101010] rounded-xl transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#2984FF] mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-sm text-white">{log.action}</p>
                          <p className="text-xs text-[#A8AFBD] mt-1">{log.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
