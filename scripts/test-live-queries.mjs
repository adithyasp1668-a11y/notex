import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bekstvkypwgxgpstpmri.supabase.co';
const supabaseKey = 'sb_publishable_zBD5BWn-F3MMFthmiYfgxQ_-xokpUfZ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLiveQueries() {
  console.log('Testing live Supabase queries...');

  // 1. Fetch colleges
  const { data: colleges, error: cErr } = await supabase.from('colleges').select('college_name, city');
  console.log('Colleges in DB:', colleges?.length, cErr?.message || '');

  // 2. Fetch branches
  const { data: branches, error: bErr } = await supabase.from('branches').select('branch_name, branch_code');
  console.log('Branches in DB:', branches?.map(b => b.branch_code).join(', '), bErr?.message || '');

  // 3. Fetch subjects
  const { data: subjects, error: sErr } = await supabase.from('subjects').select('subject_name, subject_code, semester');
  console.log('Subjects in DB:', subjects?.map(s => `${s.subject_code} (${s.subject_name})`).join(', '), sErr?.message || '');

  // 4. Test platform settings
  const { data: settings, error: setErr } = await supabase.from('platform_settings').select('*');
  console.log('Platform settings in DB:', settings, setErr?.message || '');
}

testLiveQueries();
