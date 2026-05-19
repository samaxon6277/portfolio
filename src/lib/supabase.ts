import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igphkrasvyfnxgxqcqly.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_SONcJ2ukgLB5MzaN3Xd8Sw_JgF84PJ-';

console.log("Supabase Client initializing with URL:", supabaseUrl?.substring(0, 20) + "...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
