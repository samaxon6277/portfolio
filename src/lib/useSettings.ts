import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface SettingsData {
  company_name?: string;
  tagline?: string;
  logo_type?: "text" | "image" | "both";
  logo_text?: string;
  logo_url?: string;
  favicon_url?: string;
  phone?: string;
  whatsapp_number?: string;
  email?: string;
  address?: string;
  about_title?: string;
  about_subtitle?: string;
  about_text?: string;
  skills?: string[];
  resume_url?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  // Legacy aliases
  avatarUrl?: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .limit(1);
          
        if (mounted) {
           if (!error && data && data.length > 0) {
             const settingsData = data[0];
             const mappedData: SettingsData = {
               ...settingsData,
               avatarUrl: settingsData.logo_url 
             };
             setSettings(mappedData);
             
             // Update document head
             if (settingsData.favicon_url) {
               let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
               if (!link) {
                 link = document.createElement('link');
                 link.rel = 'icon';
                 document.head.appendChild(link);
               }
               link.href = settingsData.favicon_url;
             }
             if (settingsData.meta_title || settingsData.company_name) {
               document.title = settingsData.meta_title || settingsData.company_name;
             }
             if (settingsData.meta_description) {
               let meta = document.querySelector("meta[name='description']");
               if (!meta) {
                 meta = document.createElement('meta');
                 meta.setAttribute("name", "description");
                 document.head.appendChild(meta);
               }
               meta.setAttribute("content", settingsData.meta_description);
             }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch settings error:", err);
        if (mounted) setLoading(false);
      }
    };
    
    fetchSettings();
    
    let channel: any = null;
    try {
      const channelId = `settings_${Math.random().toString(36).substring(7)}`;
      channel = supabase
        .channel(channelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
          if (mounted && payload.new) {
            const newSettings = payload.new as any;
            setSettings(prev => ({
              ...prev,
              ...newSettings,
              avatarUrl: newSettings.logo_url || prev?.avatarUrl
            }));
            
            // Update document head in realtime
            if (newSettings.favicon_url) {
               let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
               if (!link) {
                 link = document.createElement('link');
                 link.rel = 'icon';
                 document.head.appendChild(link);
               }
               link.href = newSettings.favicon_url;
            }
            if (newSettings.meta_title || newSettings.company_name) {
               document.title = newSettings.meta_title || newSettings.company_name;
            }
          }
        })
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error('Supabase channel error');
          }
        });
    } catch (err) {
      console.error("Realtime subscription error:", err);
    }

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { settings, loading };
}

