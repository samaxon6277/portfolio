import { createClient } from '@supabase/supabase-js';

const getEnvVal = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  const metaEnv = (import.meta as any).env || {};
  return metaEnv[key] || '';
};

const supabaseUrl = getEnvVal('VITE_SUPABASE_URL') || getEnvVal('NEXT_PUBLIC_SUPABASE_URL') || 'https://mgvnebqnzxpxjefxndpi.supabase.co';
const supabaseAnonKey = getEnvVal('VITE_SUPABASE_ANON_KEY') || getEnvVal('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnvVal('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || 'sb_publishable_KXdb80l02Z1UKuVwlh-Ubg_63NoP7UW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
