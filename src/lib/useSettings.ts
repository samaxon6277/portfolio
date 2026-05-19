import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface SettingsData {
  portfolioName?: string;
  tagline?: string;
  logoType?: "text" | "image" | "both";
  logoText?: string;
  logoImageUrl?: string;
  faviconUrl?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  contactEmail?: string;
  contactLocation?: string;
  businessName?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutBio?: string;
  skills?: string[];
  experience?: any[];
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: Array<{ platform: string; url: string; enabled: boolean }>;
  metaTitle?: string;
  keywords?: string;
  metaDescription?: string;
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
           // map your fields from supabase logic to this interface if needed, or just set it
           setSettings(data as any);
        }
        setLoading(false);
      }
    };
    
    fetchSettings();
    
    const subscription = supabase
      .channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
        setSettings(payload.new as any);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  return { settings, loading };
}

