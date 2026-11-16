import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://bekstvkypwgxgpstpmri.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_zBD5BWn-F3MMFthmiYfgxQ_-xokpUfZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
