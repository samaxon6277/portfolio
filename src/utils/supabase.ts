import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || 'https://mgvnebqnzxpxjefxndpi.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KXdb80l02Z1UKuVwlh-Ubg_63NoP7UW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
