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
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();
        
      if (mounted) {
        if (!error && data) {
           const mappedData: SettingsData = {
             ...data,
             avatarUrl: data.logo_url // Mapping logo_url to avatarUrl for About component
           };
           setSettings(mappedData);
        }
        setLoading(false);
      }
    };
    
    fetchSettings();
    
    const channel = supabase
      .channel(`realtime:settings_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
        if (mounted) {
          setSettings(payload.new as any);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}

