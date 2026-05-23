import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://mgvnebqnzxpxjefxndpi.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KXdb80l02Z1UKuVwlh-Ubg_63NoP7UW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
