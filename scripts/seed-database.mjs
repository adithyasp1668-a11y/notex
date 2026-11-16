import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bekstvkypwgxgpstpmri.supabase.co';
const supabaseKey = 'sb_publishable_zBD5BWn-F3MMFthmiYfgxQ_-xokpUfZ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Seeding NoteX database with live creator and approved notes...');

  // 1. Check or create demo student creator
  const testEmail = 'topper.creator@vtu.notex.in';
  const testPassword = 'VTUStudent@2024';

  let creatorId = null;

  // Try signing in or signing up
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInData?.user) {
    creatorId = signInData.user.id;
    console.log('Signed in as existing creator:', creatorId);
  } else {
    console.log('Registering initial demo creator in Supabase Auth...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Ananya Sharma (RVCE Topper)',
          college_name: 'RV College of Engineering (RVCE)',
          branch: 'CSE',
          semester: 5,
          is_creator: true,
        },
      },
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError.message);
      return;
    }

    creatorId = signUpData?.user?.id;
    console.log('Created creator account in Supabase:', creatorId);
  }

  if (!creatorId) {
    console.error('Could not obtain creator ID.');
    return;
  }

  // 2. Fetch existing subjects from DB
  const { data: subjects } = await supabase.from('subjects').select('id, subject_name, subject_code, semester');
  console.log('Available subjects in DB:', subjects?.map(s => `${s.subject_code} (${s.id})`));

  if (!subjects || subjects.length === 0) {
    console.error('No subjects found in database.');
    return;
  }

  const cnSubject = subjects.find(s => s.subject_code === '21CS52') || subjects[0];
  const dbmsSubject = subjects.find(s => s.subject_code === '21CS53') || subjects[1] || subjects[0];
  const osSubject = subjects.find(s => s.subject_code === '21CS44') || subjects[2] || subjects[0];

  // 3. Insert approved notes
  const sampleNotes = [
    {
      creator_id: creatorId,
      subject_id: cnSubject.id,
      title: 'Computer Networks (21CS52) - Comprehensive VTU 5th Sem Notes',
      description: 'Complete 5-Module VTU 2021 Scheme notes curated by 9.6 CGPA topper. Covers OSI Model, TCP/IP, Dijkstra, and Socket Programming with previous 5 years solved university exam questions.',
      price: 49.00,
      page_count: 84,
      status: 'APPROVED',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      modules: [
        'Module 1: Application Layer & HTTP/DNS Architecture',
        'Module 2: Transport Layer, TCP Flow & Congestion Control',
        'Module 3: Network Layer & Routing Protocols (OSPF, BGP)',
        'Module 4: Link Layer & Error Detection (CRC, Parity)',
        'Module 5: Wireless & Mobile Networks + Solved VTU Question Bank'
      ],
      sample_preview_pages: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      creator_id: creatorId,
      subject_id: dbmsSubject.id,
      title: 'Database Management Systems (21CS53) - SQL, Normalization & ER Diagrams',
      description: 'High-yield DBMS notes for VTU 5th Sem. Contains crisp ER diagram conversion rules, Relational Algebra, BCNF/3NF step-by-step proofs, and SQL syntax cheat sheets.',
      price: 39.00,
      page_count: 68,
      status: 'APPROVED',
      cover_image: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe70d?auto=format&fit=crop&q=80&w=800',
      modules: [
        'Module 1: Database Systems Architecture & ER Modeling',
        'Module 2: Relational Model & Relational Algebra Queries',
        'Module 3: SQL Triggers, Views & Complex Nested Queries',
        'Module 4: Normalization (1NF to BCNF) with Examples',
        'Module 5: Concurrency Control, 2PL & Serializability'
      ],
      sample_preview_pages: [
        'https://images.unsplash.com/photo-1507842229451-7f01be7fe70d?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      creator_id: creatorId,
      subject_id: osSubject.id,
      title: 'Operating Systems (21CS44) - Core Concepts, Scheduling & Deadlocks',
      description: 'Covers CPU scheduling (FCFS, Round Robin), Banker Algorithm, Paging, TLB, and Page Replacement (LRU, Optimal) with handwritten diagrams and worked numericals.',
      price: 49.00,
      page_count: 76,
      status: 'APPROVED',
      cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      modules: [
        'Module 1: OS Structures, System Calls & Dual Mode',
        'Module 2: Process Scheduling & Semaphores',
        'Module 3: Deadlock Detection & Banker Algorithm',
        'Module 4: Virtual Memory & Demand Paging',
        'Module 5: Disk Scheduling Algorithms (SCAN, C-LOOK)'
      ],
      sample_preview_pages: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000'
      ]
    }
  ];

  for (const n of sampleNotes) {
    const { data: inserted, error: insertError } = await supabase.from('notes').insert(n).select();
    if (insertError) {
      console.warn('Note insert notice:', insertError.message);
    } else {
      console.log('Successfully inserted live approved note:', inserted?.[0]?.title);
    }
  }

  // Check total notes now
  const { count } = await supabase.from('notes').select('*', { count: 'exact', head: true });
  console.log(`\n🎉 Seed completed! Total notes in Supabase: ${count}`);
}

seedDatabase();
