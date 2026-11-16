-- ====================================================================
-- NOTEX DATABASE MIGRATION 005: SEED INITIAL VTU NOTES
-- Description: Seeds verified sample notes for VTU subjects (21CS52, 21CS53, 21CS44, 21EC52)
-- ====================================================================

DO $$
DECLARE
    v_creator_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_univ_id UUID;
    v_college_id UUID;
    v_cse_id UUID;
    v_ece_id UUID;
    v_cn_subj_id UUID;
    v_dbms_subj_id UUID;
    v_os_subj_id UUID;
    v_dsp_subj_id UUID;
    v_note1_id UUID := 'b0000000-0000-0000-0000-000000000001';
    v_note2_id UUID := 'b0000000-0000-0000-0000-000000000002';
    v_note3_id UUID := 'b0000000-0000-0000-0000-000000000003';
    v_note4_id UUID := 'b0000000-0000-0000-0000-000000000004';
BEGIN
    -- 1. Ensure VTU University and Colleges exist
    SELECT id INTO v_univ_id FROM public.universities WHERE abbreviation = 'VTU' LIMIT 1;
    SELECT id INTO v_college_id FROM public.colleges WHERE college_name LIKE '%RV College%' LIMIT 1;
    SELECT id INTO v_cse_id FROM public.branches WHERE branch_code = 'CSE' LIMIT 1;
    SELECT id INTO v_ece_id FROM public.branches WHERE branch_code = 'ECE' LIMIT 1;

    -- Look up subjects
    SELECT id INTO v_cn_subj_id FROM public.subjects WHERE subject_code = '21CS52' LIMIT 1;
    SELECT id INTO v_dbms_subj_id FROM public.subjects WHERE subject_code = '21CS53' LIMIT 1;
    SELECT id INTO v_os_subj_id FROM public.subjects WHERE subject_code = '21CS44' LIMIT 1;
    SELECT id INTO v_dsp_subj_id FROM public.subjects WHERE subject_code = '21EC52' LIMIT 1;

    -- 2. Ensure Seed Creator exists in auth.users & public.profiles
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_creator_id) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            role,
            aud
        ) VALUES (
            v_creator_id,
            '00000000-0000-0000-0000-000000000000',
            'rahul.k@rvce.edu.in',
            crypt('NoteXDemo2026!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Rahul Kulkarni","college":"RV College of Engineering (RVCE)","branch":"CSE","semester":6}',
            NOW(),
            NOW(),
            'authenticated',
            'authenticated'
        );
    END IF;

    -- Ensure profile exists
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        college_id,
        branch_id,
        semester,
        role,
        bio,
        is_verified_creator
    ) VALUES (
        v_creator_id,
        'Rahul Kulkarni',
        'rahul.k@rvce.edu.in',
        v_college_id,
        v_cse_id,
        6,
        'CREATOR',
        'RVCE 6th Sem CSE • 9.42 CGPA • VTU Rank Holder Notes with Diagrams',
        TRUE
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = 'Rahul Kulkarni',
        is_verified_creator = TRUE;

    -- Ensure Creator Wallet exists
    INSERT INTO public.creator_wallets (
        creator_id,
        balance,
        total_earned,
        upi_id
    ) VALUES (
        v_creator_id,
        450.00,
        1850.00,
        'rahul.k@okaxis'
    ) ON CONFLICT (creator_id) DO NOTHING;

    -- 3. Insert Seed Note 1: Computer Networks (21CS52)
    IF v_cn_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id,
            title,
            description,
            creator_id,
            university_id,
            college_id,
            branch_id,
            subject_id,
            semester,
            course,
            price,
            total_pages,
            preview_pages_count,
            modules,
            cover_image_url,
            status,
            sales_count,
            average_rating,
            ratings_count
        ) VALUES (
            v_note1_id,
            'Computer Networks (21CS52) - Comprehensive 5 Modules + Solved PYQs',
            'Complete handwritten notes for VTU 5th Sem CSE. Includes OSI/TCP-IP models, IP subnetting cheatsheet, socket programming diagrams, and 5 years solved question papers.',
            v_creator_id,
            v_univ_id,
            v_college_id,
            v_cse_id,
            v_cn_subj_id,
            5,
            'B.E.',
            49.00,
            68,
            3,
            ARRAY[
                'Module 1: Introduction to Networks & Physical Layer',
                'Module 2: Data Link Layer & Framing Protocols',
                'Module 3: Network Layer & IP Addressing/Subnetting',
                'Module 4: Transport Layer (TCP vs UDP, Flow Control)',
                'Module 5: Application Layer (DNS, HTTP, SMTP) + Solved VTU PYQs'
            ],
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
            'APPROVED',
            42,
            4.9,
            38
        ) ON CONFLICT (id) DO NOTHING;

        -- Note file record
        INSERT INTO public.note_files (
            note_id,
            file_name,
            file_size_bytes,
            mime_type,
            storage_path,
            sha256_hash
        ) VALUES (
            v_note1_id,
            '21CS52_CN_Complete_Handwritten_Notes.pdf',
            14500000,
            'application/pdf',
            'notes/' || v_note1_id || '/original.pdf',
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        ) ON CONFLICT (note_id) DO NOTHING;
    END IF;

    -- 4. Insert Seed Note 2: Database Management Systems (21CS53)
    IF v_dbms_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id,
            title,
            description,
            creator_id,
            university_id,
            college_id,
            branch_id,
            subject_id,
            semester,
            course,
            price,
            total_pages,
            preview_pages_count,
            modules,
            cover_image_url,
            status,
            sales_count,
            average_rating,
            ratings_count
        ) VALUES (
            v_note2_id,
            'DBMS (21CS53) - ER Diagrams, SQL Queries, Normalization & ACID',
            'Handwritten diagrams for ER modeling, SQL query examples, BCNF/3NF decomposition steps, and concurrency control algorithms.',
            v_creator_id,
            v_univ_id,
            v_college_id,
            v_cse_id,
            v_dbms_subj_id,
            5,
            'B.E.',
            39.00,
            54,
            3,
            ARRAY[
                'Module 1: Database Concepts & ER Modeling',
                'Module 2: Relational Model & SQL/PL-SQL',
                'Module 3: Normalization (1NF, 2NF, 3NF, BCNF)',
                'Module 4: Transaction Processing & ACID Properties',
                'Module 5: Concurrency Control & Recovery System'
            ],
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000',
            'APPROVED',
            57,
            4.8,
            46
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.note_files (
            note_id,
            file_name,
            file_size_bytes,
            mime_type,
            storage_path,
            sha256_hash
        ) VALUES (
            v_note2_id,
            '21CS53_DBMS_Notes.pdf',
            11200000,
            'application/pdf',
            'notes/' || v_note2_id || '/original.pdf',
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856'
        ) ON CONFLICT (note_id) DO NOTHING;
    END IF;

    -- 5. Insert Seed Note 3: Operating Systems (21CS44)
    IF v_os_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id,
            title,
            description,
            creator_id,
            university_id,
            college_id,
            branch_id,
            subject_id,
            semester,
            course,
            price,
            total_pages,
            preview_pages_count,
            modules,
            cover_image_url,
            status,
            sales_count,
            average_rating,
            ratings_count
        ) VALUES (
            v_note3_id,
            'Operating Systems (21CS44) - CPU Scheduling, Deadlocks, Memory Management',
            'Short revision notes with step-by-step solved problems on Bankers Algorithm, Paging, Page Replacement (FIFO, LRU, Optimal), and Semaphore Synchronization.',
            v_creator_id,
            v_univ_id,
            v_college_id,
            v_cse_id,
            v_os_subj_id,
            4,
            'B.E.',
            39.00,
            48,
            3,
            ARRAY[
                'Module 1: OS Structures & System Calls',
                'Module 2: Process Management & CPU Scheduling',
                'Module 3: Deadlocks & Banker Algorithm',
                'Module 4: Memory Management & Virtual Memory (LRU/FIFO)',
                'Module 5: File Systems & Disk Scheduling'
            ],
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
            'APPROVED',
            63,
            4.9,
            51
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.note_files (
            note_id,
            file_name,
            file_size_bytes,
            mime_type,
            storage_path,
            sha256_hash
        ) VALUES (
            v_note3_id,
            '21CS44_OS_Notes.pdf',
            9800000,
            'application/pdf',
            'notes/' || v_note3_id || '/original.pdf',
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857'
        ) ON CONFLICT (note_id) DO NOTHING;
    END IF;

    -- 6. Insert Seed Note 4: Digital Signal Processing (21EC52)
    IF v_dsp_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id,
            title,
            description,
            creator_id,
            university_id,
            college_id,
            branch_id,
            subject_id,
            semester,
            course,
            price,
            total_pages,
            preview_pages_count,
            modules,
            cover_image_url,
            status,
            sales_count,
            average_rating,
            ratings_count
        ) VALUES (
            v_note4_id,
            'Digital Signal Processing (21EC52) - FFT, DFT, Filter Design (IIR/FIR)',
            'Complete solved mathematical derivations for Radix-2 DIT/DIF FFT, Butterworth and Chebyshev IIR filters, and Bilinear Transformation.',
            v_creator_id,
            v_univ_id,
            v_college_id,
            v_ece_id,
            v_dsp_subj_id,
            5,
            'B.E.',
            49.00,
            72,
            3,
            ARRAY[
                'Module 1: Discrete Fourier Transform & Properties',
                'Module 2: Radix-2 FFT Algorithms (DIT & DIF)',
                'Module 3: IIR Filter Design (Butterworth, Chebyshev)',
                'Module 4: FIR Filter Design (Window Techniques)',
                'Module 5: Digital Signal Processors Architecture'
            ],
            'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000',
            'APPROVED',
            29,
            4.7,
            24
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.note_files (
            note_id,
            file_name,
            file_size_bytes,
            mime_type,
            storage_path,
            sha256_hash
        ) VALUES (
            v_note4_id,
            '21EC52_DSP_Complete_Notes.pdf',
            16200000,
            'application/pdf',
            'notes/' || v_note4_id || '/original.pdf',
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858'
        ) ON CONFLICT (note_id) DO NOTHING;
    END IF;

END $$;
