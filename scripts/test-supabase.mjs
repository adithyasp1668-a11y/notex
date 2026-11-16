import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bekstvkypwgxgpstpmri.supabase.co';
const supabaseKey = 'sb_publishable_zBD5BWn-F3MMFthmiYfgxQ_-xokpUfZ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase live connection...');
  
  const tables = [
    'profiles', 'universities', 'colleges', 'branches', 'subjects',
    'notes', 'note_files', 'purchases', 'payments', 'creator_wallets',
    'wallet_transactions', 'payouts', 'reviews', 'reports', 'wishlists',
    'notifications', 'admin_audit_logs', 'platform_settings'
  ];

  const results = {};
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true, count: count ?? 0 };
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
    }
  }

  console.log('Table verification results:', JSON.stringify(results, null, 2));

  // Test reading from notes table
  const { data: notes, error: notesError } = await supabase.from('notes').select('*').limit(5);
  console.log('Notes query result:', { count: notes?.length, error: notesError?.message });

  // Test bucket
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log('Storage buckets:', { buckets: buckets?.map(b => b.name), error: bucketsError?.message });
}

testConnection();
