import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bekstvkypwgxgpstpmri.supabase.co';
const supabasePublishableKey = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  supabasePublishableKey.length > 20 &&
  !supabasePublishableKey.includes('placeholder')
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '⚠️ NoteX Supabase Client: Missing or placeholder VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.\n' +
    'The app is running in resilient preview mode with simulated client-side fallbacks.'
  );
}

// Reusable Supabase client with strict TypeScript Database typing
export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Health check helper to test database connectivity
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    if (!isSupabaseConfigured) {
      return {
        ok: false,
        message: 'Supabase credentials are not fully configured in .env.local yet.'
      };
    }
    const { data, error } = await supabase.from('platform_settings').select('*').limit(1);
    if (error) {
      return { ok: false, message: `Database query returned: ${error.message}` };
    }
    return { ok: true, message: 'Successfully connected to NoteX Supabase Database!' };
  } catch (err: any) {
    return { ok: false, message: err.message || 'Connection failed' };
  }
}
