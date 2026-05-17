import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

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
    const unsub = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SettingsData);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { settings, loading };
}
