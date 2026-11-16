import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bekstvkypwgxgpstpmri.supabase.co';
const supabaseKey = 'sb_publishable_zBD5BWn-F3MMFthmiYfgxQ_-xokpUfZ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
  // Test getting bucket details
  const { data, error } = await supabase.storage.getBucket('notex-notes');
  console.log('Get bucket notex-notes:', { data, error: error?.message });
}

checkBucket();
